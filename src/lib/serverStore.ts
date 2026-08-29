import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './supabase';
import type { 
  TeamRecord, 
  TeamMember, 
  PaymentRecord, 
  SubmissionRecord, 
  AuditLogRecord, 
  SuspicionFlag, 
  SystemConfig 
} from '@/types/orion';

// ==============================================================================
// Fallback In-Memory / File Persistent Store (For Local Dev Offline Mode)
// ==============================================================================

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'orion_store.json');

interface StoreSchema {
  teams: TeamRecord[];
  payments: PaymentRecord[];
  submissions: SubmissionRecord[];
  suspicionFlags: SuspicionFlag[];
  auditLogs: AuditLogRecord[];
  config: SystemConfig;
}

const DEFAULT_CONFIG: SystemConfig = {
  registrationOpen: true,
  round1SubmissionDeadline: '2026-09-08T23:59:59+05:30',
  allowRound1Resubmission: true,
  maxFileSizeMb: 25,
  upiId: 'orion.sathyabama@upi',
  upiPayeeName: 'ORION 1.0 — Microsoft Club SIST',
  upiQrCodeUrl: '/orion_payment_qr.jpg',
  round1FeeInr: 100,
  finalistFeeInr: 200
};

// Safe helper for local disk store
function loadLocalStore(): StoreSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed: StoreSchema = JSON.parse(raw);
      parsed.config = { ...DEFAULT_CONFIG, ...(parsed.config || {}) };
      parsed.teams = parsed.teams || [];
      parsed.payments = parsed.payments || [];
      parsed.submissions = parsed.submissions || [];
      parsed.suspicionFlags = parsed.suspicionFlags || [];
      parsed.auditLogs = parsed.auditLogs || [];
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read persistent file store, initializing defaults:', err);
  }

  const initialStore: StoreSchema = {
    teams: [],
    payments: [],
    submissions: [],
    suspicionFlags: [],
    auditLogs: [],
    config: DEFAULT_CONFIG
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to initialize empty store:', err);
  }

  return initialStore;
}

function saveLocalStore(store: StoreSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write persistent local store:', err);
  }
}

// ==============================================================================
// Exported Core Server Store Services (Supabase PostgreSQL Primary)
// ==============================================================================

export const serverStore = {
  // System Configuration
  async getConfig(): Promise<SystemConfig> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('system_config')
          .select('value')
          .eq('key', 'main_config')
          .single();

        if (!error && data?.value) {
          return { ...DEFAULT_CONFIG, ...(data.value as Partial<SystemConfig>) };
        }

        // Initialize if not present
        await supabase
          .from('system_config')
          .upsert({ key: 'main_config', value: DEFAULT_CONFIG });
        return DEFAULT_CONFIG;
      } catch (err) {
        console.warn('Supabase getConfig error, using local fallback:', err);
      }
    }

    const store = loadLocalStore();
    return store.config || DEFAULT_CONFIG;
  },

  async updateConfig(newConfig: Partial<SystemConfig>, actor = 'Admin'): Promise<SystemConfig> {
    const current = await this.getConfig();
    const merged = { ...current, ...newConfig };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('system_config')
          .upsert({ 
            key: 'main_config', 
            value: merged,
            updated_at: new Date().toISOString()
          });

        await supabase.from('audit_logs').insert([{
          action: 'System Configuration Updated',
          actor,
          details: `Updated settings: ${Object.keys(newConfig).join(', ')}`,
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.error('Supabase updateConfig error:', err);
      }
    }

    // Keep local store in sync
    const store = loadLocalStore();
    store.config = merged;
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'System Configuration Updated',
      actor,
      details: `Updated settings: ${Object.keys(newConfig).join(', ')}`,
      created_at: new Date().toISOString()
    });
    saveLocalStore(store);

    return merged;
  },

  // Team Registration & Duplicate Detection
  async registerTeam(payload: {
    teamName: string;
    leaderName: string;
    leaderPhone: string;
    leaderEmail: string;
    institution: string;
    department?: string;
    year?: string;
    problemStatement: string;
    members: { name: string; email?: string; phone: string; department?: string; year?: string }[];
  }): Promise<{ team: TeamRecord; suspicionFlags: SuspicionFlag[] }> {
    const now = new Date().toISOString();
    const cleanLeaderEmail = payload.leaderEmail.trim().toLowerCase();
    const cleanLeaderPhone = payload.leaderPhone.replace(/[\s\-()]/g, '');
    const cleanTeamName = payload.teamName.trim();
    const cleanInstitution = payload.institution.trim();
    const cleanProblem = payload.problemStatement.trim();
    const passcode = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;

    let existingCount = 147;
    let existingTeamsForDupCheck: { id: string; registration_id: string; team_name: string; leader_email: string; leader_phone: string; members?: TeamMember[] }[] = [];

    // Check if Supabase is active
    if (isSupabaseConfigured() && supabase) {
      try {
        const { count } = await supabase.from('teams').select('*', { count: 'exact', head: true });
        if (typeof count === 'number') {
          existingCount = count + 147;
        }

        const { data: allTeams } = await supabase
          .from('teams')
          .select('id, registration_id, team_name, leader_email, leader_phone');
        
        const { data: allMembers } = await supabase
          .from('team_members')
          .select('id, team_id, member_name, member_email, member_phone');

        if (allTeams) {
          existingTeamsForDupCheck = allTeams.map(t => ({
            ...t,
            members: (allMembers || []).filter(m => m.team_id === t.id).map(m => ({
              member_number: 1,
              member_name: m.member_name,
              member_email: m.member_email || undefined,
              member_phone: m.member_phone
            }))
          }));
        }
      } catch (err) {
        console.warn('Supabase registration check error, falling back to local for dup check:', err);
      }
    }

    if (existingTeamsForDupCheck.length === 0) {
      const localStore = loadLocalStore();
      existingCount = localStore.teams.length + 147;
      existingTeamsForDupCheck = localStore.teams;
    }

    const teamNumber = String(existingCount + 1).padStart(4, '0');
    const registrationId = `ORION-2026-${teamNumber}`;

    // Duplicate & Suspicion Analysis
    const suspicionFlags: SuspicionFlag[] = [];

    const duplicateLeaderEmailTeam = existingTeamsForDupCheck.find(t => 
      t.leader_email.toLowerCase() === cleanLeaderEmail ||
      (t.members && t.members.some(m => m.member_email && m.member_email.toLowerCase() === cleanLeaderEmail))
    );
    if (duplicateLeaderEmailTeam) {
      suspicionFlags.push({
        id: `flag-${Date.now()}-1`,
        team_id: '',
        flag_type: 'DUPLICATE_EMAIL',
        description: `Leader email ${cleanLeaderEmail} was also registered under squad "${duplicateLeaderEmailTeam.team_name}" (${duplicateLeaderEmailTeam.registration_id}).`,
        severity: 'MEDIUM',
        matched_value: cleanLeaderEmail,
        matched_team_id: duplicateLeaderEmailTeam.registration_id,
        created_at: now
      });
    }

    const duplicateLeaderPhoneTeam = existingTeamsForDupCheck.find(t => 
      t.leader_phone.replace(/[\s\-()]/g, '') === cleanLeaderPhone ||
      (t.members && t.members.some(m => m.member_phone.replace(/[\s\-()]/g, '') === cleanLeaderPhone))
    );
    if (duplicateLeaderPhoneTeam) {
      suspicionFlags.push({
        id: `flag-${Date.now()}-2`,
        team_id: '',
        flag_type: 'DUPLICATE_PHONE',
        description: `Leader phone ${cleanLeaderPhone} matches squad "${duplicateLeaderPhoneTeam.team_name}" (${duplicateLeaderPhoneTeam.registration_id}).`,
        severity: 'MEDIUM',
        matched_value: cleanLeaderPhone,
        matched_team_id: duplicateLeaderPhoneTeam.registration_id,
        created_at: now
      });
    }

    payload.members.forEach((m, idx) => {
      const memberPhoneClean = m.phone.replace(/[\s\-()]/g, '');
      const memberEmailClean = (m.email || '').trim().toLowerCase();

      const match = existingTeamsForDupCheck.find(t =>
        (memberEmailClean && (t.leader_email.toLowerCase() === memberEmailClean || (t.members && t.members.some(tm => tm.member_email?.toLowerCase() === memberEmailClean)))) ||
        (memberPhoneClean && (t.leader_phone.replace(/[\s\-()]/g, '') === memberPhoneClean || (t.members && t.members.some(tm => tm.member_phone.replace(/[\s\-()]/g, '') === memberPhoneClean))))
      );

      if (match) {
        suspicionFlags.push({
          id: `flag-${Date.now()}-m${idx}`,
          team_id: '',
          flag_type: 'CROSS_TEAM_PARTICIPANT',
          description: `Member ${m.name} (${m.phone}) is also recorded on squad "${match.team_name}" (${match.registration_id}).`,
          severity: 'HIGH',
          matched_value: m.name,
          matched_team_id: match.registration_id,
          created_at: now
        });
      }
    });

    let newTeamId = `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const memberObjects: TeamMember[] = payload.members.map((m, idx) => ({
      member_number: idx + 1,
      member_name: m.name.trim(),
      member_email: m.email?.trim().toLowerCase() || '',
      member_phone: m.phone.replace(/[\s\-()]/g, ''),
      department: m.department?.trim() || payload.department || 'Engineering',
      year: m.year?.trim() || payload.year || 'Student'
    }));

    // Primary Write to Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: teamData, error: teamErr } = await supabase
          .from('teams')
          .insert([{
            registration_id: registrationId,
            team_name: cleanTeamName,
            leader_name: payload.leaderName.trim(),
            leader_phone: cleanLeaderPhone,
            leader_email: cleanLeaderEmail,
            institution: cleanInstitution,
            department: payload.department?.trim() || 'Engineering',
            year: payload.year?.trim() || 'Student',
            problem_statement: cleanProblem,
            access_token: passcode,
            payment_status: 'NOT_SUBMITTED',
            amount: 100,
            registration_status: 'REGISTERED',
            round_1_status: 'NOT_STARTED',
            round_2_status: 'LOCKED',
            created_at: now,
            updated_at: now
          }])
          .select('id')
          .single();

        if (teamErr) {
          console.error('Supabase team insertion error:', teamErr);
        } else if (teamData?.id) {
          newTeamId = teamData.id;

          const memberRows = memberObjects.map(m => ({
            team_id: newTeamId,
            member_number: m.member_number,
            member_name: m.member_name,
            member_email: m.member_email || null,
            member_phone: m.member_phone,
            department: m.department || null,
            year: m.year || null,
            created_at: now
          }));

          await supabase.from('team_members').insert(memberRows);

          if (suspicionFlags.length > 0) {
            const flagRows = suspicionFlags.map(f => ({
              team_id: newTeamId,
              flag_type: f.flag_type,
              description: f.description,
              severity: f.severity,
              matched_value: f.matched_value,
              matched_team_id: f.matched_team_id || null,
              created_at: now
            }));
            await supabase.from('suspicion_flags').insert(flagRows);
          }

          await supabase.from('audit_logs').insert([{
            team_id: newTeamId,
            team_name: cleanTeamName,
            action: 'Team Registered',
            actor: 'Public Portal',
            details: `Squad registered with ${payload.members.length + 1} members for track ${cleanProblem}. ID: ${registrationId}`,
            created_at: now
          }]);
        }
      } catch (sbErr) {
        console.error('Supabase async sync error in registerTeam:', sbErr);
      }
    }

    suspicionFlags.forEach(f => { f.team_id = newTeamId; });

    const newTeam: TeamRecord = {
      id: newTeamId,
      registration_id: registrationId,
      team_name: cleanTeamName,
      leader_name: payload.leaderName.trim(),
      leader_phone: cleanLeaderPhone,
      leader_email: cleanLeaderEmail,
      institution: cleanInstitution,
      department: payload.department?.trim() || 'Engineering',
      year: payload.year?.trim() || 'Student',
      problem_statement: cleanProblem,
      access_token: passcode,
      payment_status: 'NOT_SUBMITTED',
      amount: 100,
      registration_status: 'REGISTERED',
      round_1_status: 'NOT_STARTED',
      round_2_status: 'LOCKED',
      admin_notes: null,
      suspicion_flags: suspicionFlags,
      members: memberObjects,
      created_at: now,
      updated_at: now
    };

    // Save to local backup store
    const store = loadLocalStore();
    store.teams.unshift(newTeam);
    store.suspicionFlags.push(...suspicionFlags);
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      team_id: newTeamId,
      team_name: newTeam.team_name,
      action: 'Team Registered',
      actor: 'Public Portal',
      details: `Squad registered with ${memberObjects.length + 1} members for track ${cleanProblem}. ID: ${registrationId}`,
      created_at: now
    });
    saveLocalStore(store);

    return { team: newTeam, suspicionFlags };
  },

  // Team Authentication for Portal
  async authenticateTeam(identifier: string, secret: string): Promise<TeamRecord | null> {
    const cleanId = identifier.trim();
    const cleanSecret = secret.trim();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: teams, error } = await supabase
          .from('teams')
          .select('*')
          .or(`registration_id.ilike.${cleanId},leader_email.ilike.${cleanId}`)
          .limit(5);

        if (!error && teams && teams.length > 0) {
          const matched = teams.find(t => 
            t.access_token.toLowerCase() === cleanSecret.toLowerCase() ||
            t.leader_email.toLowerCase() === cleanSecret.toLowerCase()
          );

          if (matched) {
            return await this.getTeam(matched.id);
          }
        }
      } catch (err) {
        console.warn('Supabase authenticateTeam error, using fallback:', err);
      }
    }

    const store = loadLocalStore();
    const cleanIdLower = cleanId.toLowerCase();
    const cleanSecretLower = cleanSecret.toLowerCase();

    const team = store.teams.find(t => {
      const matchId = t.registration_id.toLowerCase() === cleanIdLower || t.leader_email.toLowerCase() === cleanIdLower;
      const matchSecret = t.access_token.toLowerCase() === cleanSecretLower || t.leader_email.toLowerCase() === cleanSecretLower;
      return matchId && matchSecret;
    });

    if (!team) return null;
    return await this.getTeam(team.id);
  },

  // Fetch Team By ID, Registration ID, or Email
  async getTeam(identifier: string): Promise<TeamRecord | null> {
    const clean = identifier.trim();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: team, error } = await supabase
          .from('teams')
          .select('*')
          .or(`id.eq.${clean},registration_id.ilike.${clean},leader_email.ilike.${clean}`)
          .maybeSingle();

        if (!error && team) {
          const [memRes, payRes, subRes, flagRes, logRes] = await Promise.all([
            supabase.from('team_members').select('*').eq('team_id', team.id).order('member_number', { ascending: true }),
            supabase.from('payments').select('*').eq('team_id', team.id).maybeSingle(),
            supabase.from('submissions').select('*').eq('team_id', team.id).order('version', { ascending: true }),
            supabase.from('suspicion_flags').select('*').eq('team_id', team.id),
            supabase.from('audit_logs').select('*').eq('team_id', team.id).order('created_at', { ascending: false })
          ]);

          return {
            id: team.id,
            registration_id: team.registration_id,
            team_name: team.team_name,
            leader_name: team.leader_name,
            leader_phone: team.leader_phone,
            leader_email: team.leader_email,
            institution: team.institution,
            department: team.department || undefined,
            year: team.year || undefined,
            problem_statement: team.problem_statement,
            access_token: team.access_token,
            payment_status: team.payment_status,
            amount: team.amount || 100,
            registration_status: team.registration_status || 'REGISTERED',
            round_1_status: team.round_1_status || 'NOT_STARTED',
            round_2_status: team.round_2_status || 'LOCKED',
            round_1_score: team.round_1_score !== null ? Number(team.round_1_score) : null,
            admin_notes: team.admin_notes || null,
            members: (memRes.data || []).map(m => ({
              id: m.id,
              team_id: m.team_id,
              member_number: m.member_number,
              member_name: m.member_name,
              member_email: m.member_email || undefined,
              member_phone: m.member_phone,
              department: m.department || undefined,
              year: m.year || undefined
            })),
            payment: payRes.data ? {
              id: payRes.data.id,
              team_id: payRes.data.team_id,
              utr_number: payRes.data.utr_number,
              payer_name: payRes.data.payer_name,
              amount: payRes.data.amount || 100,
              payment_status: payRes.data.payment_status,
              notes: payRes.data.notes || undefined,
              rejection_reason: payRes.data.rejection_reason || undefined,
              submitted_at: payRes.data.submitted_at,
              verified_at: payRes.data.verified_at || null,
              verified_by: payRes.data.verified_by || null
            } : null,
            submissions: (subRes.data || []).map(s => ({
              id: s.id,
              team_id: s.team_id,
              round_number: s.round_number as (1 | 2),
              file_url: s.file_url,
              original_filename: s.original_filename,
              file_size: Number(s.file_size),
              file_type: s.file_type,
              version: s.version,
              submission_status: s.submission_status,
              submitted_at: s.submitted_at,
              review_notes: s.review_notes || undefined
            })),
            suspicion_flags: (flagRes.data || []).map(f => ({
              id: f.id,
              team_id: f.team_id,
              flag_type: f.flag_type,
              description: f.description,
              severity: f.severity,
              matched_value: f.matched_value,
              matched_team_id: f.matched_team_id || undefined,
              created_at: f.created_at
            })),
            audit_logs: (logRes.data || []).map(l => ({
              id: l.id,
              team_id: l.team_id,
              team_name: l.team_name,
              action: l.action,
              actor: l.actor,
              details: l.details,
              created_at: l.created_at
            })),
            created_at: team.created_at,
            updated_at: team.updated_at
          };
        }
      } catch (err) {
        console.warn('Supabase getTeam error, falling back to local store:', err);
      }
    }

    const store = loadLocalStore();
    const cleanLower = clean.toLowerCase();
    const team = store.teams.find(t => 
      t.id.toLowerCase() === cleanLower || 
      t.registration_id.toLowerCase() === cleanLower || 
      t.leader_email.toLowerCase() === cleanLower
    );

    if (!team) return null;

    return {
      ...team,
      payment: store.payments.find(p => p.team_id === team.id || p.team_id === team.registration_id) || null,
      submissions: store.submissions.filter(s => s.team_id === team.id || s.team_id === team.registration_id) || [],
      suspicion_flags: store.suspicionFlags.filter(f => f.team_id === team.id || f.team_id === team.registration_id) || [],
      audit_logs: store.auditLogs.filter(l => l.team_id === team.id || l.team_id === team.registration_id) || []
    };
  },

  // Payment Submission with Strict Uniqueness Check
  async submitPayment(teamId: string, payload: { utrNumber: string; payerName: string; amount?: number }): Promise<{ success: boolean; error?: string; payment?: PaymentRecord }> {
    const cleanUTR = payload.utrNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanPayer = payload.payerName.trim();
    const now = new Date().toISOString();

    if (!cleanUTR || cleanUTR.length < 6) {
      return { success: false, error: 'Invalid UTR / Transaction Reference ID (Minimum 6 alphanumeric characters required).' };
    }
    if (!cleanPayer) {
      return { success: false, error: 'Payer name is required.' };
    }

    const team = await this.getTeam(teamId);
    if (!team) {
      return { success: false, error: 'Squad record not found.' };
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        // Check UTR duplicate across other teams
        const { data: existingUTR } = await supabase
          .from('payments')
          .select('id, team_id')
          .eq('utr_number', cleanUTR)
          .neq('team_id', team.id)
          .maybeSingle();

        if (existingUTR) {
          await supabase.from('suspicion_flags').insert([{
            team_id: team.id,
            flag_type: 'DUPLICATE_UTR',
            description: `Submitted UTR ${cleanUTR} is already registered by another squad.`,
            severity: 'HIGH',
            matched_value: cleanUTR,
            created_at: now
          }]);

          return { 
            success: false, 
            error: `Database Integrity Error: Transaction ID / UTR "${cleanUTR}" has already been submitted by another team. Please ensure you enter your squad's unique payment reference.` 
          };
        }

        // Upsert payment in Supabase
        const { data: payData, error: payErr } = await supabase
          .from('payments')
          .upsert({
            team_id: team.id,
            utr_number: cleanUTR,
            payer_name: cleanPayer,
            amount: payload.amount || 100,
            payment_status: 'PENDING',
            submitted_at: now
          })
          .select('*')
          .single();

        if (payErr) {
          console.error('Supabase submitPayment error:', payErr);
        }

        await supabase
          .from('teams')
          .update({ payment_status: 'PENDING', updated_at: now })
          .eq('id', team.id);

        await supabase.from('audit_logs').insert([{
          team_id: team.id,
          team_name: team.team_name,
          action: 'Payment UTR Submitted',
          actor: 'Participant Portal',
          details: `Submitted UTR: ${cleanUTR} (₹100) by ${cleanPayer}`,
          created_at: now
        }]);

        if (payData) {
          return {
            success: true,
            payment: {
              id: payData.id,
              team_id: payData.team_id,
              utr_number: payData.utr_number,
              payer_name: payData.payer_name,
              amount: payData.amount,
              payment_status: payData.payment_status,
              submitted_at: payData.submitted_at
            }
          };
        }
      } catch (sbErr) {
        console.error('Supabase submitPayment error:', sbErr);
      }
    }

    // Local fallback
    const store = loadLocalStore();
    const localTeam = store.teams.find(t => t.id === team.id || t.registration_id === team.id);
    if (!localTeam) return { success: false, error: 'Team record not found locally.' };

    const duplicateUTR = store.payments.find(p => p.utr_number.toUpperCase() === cleanUTR && p.team_id !== localTeam.id);
    if (duplicateUTR) {
      store.suspicionFlags.push({
        id: `flag-${Date.now()}-utr`,
        team_id: localTeam.id,
        flag_type: 'DUPLICATE_UTR',
        description: `Submitted UTR ${cleanUTR} is already claimed by another squad.`,
        severity: 'HIGH',
        matched_value: cleanUTR,
        created_at: now
      });
      saveLocalStore(store);
      return { 
        success: false, 
        error: `Database Integrity Error: Transaction ID / UTR "${cleanUTR}" has already been submitted by another team.` 
      };
    }

    let payment = store.payments.find(p => p.team_id === localTeam.id);
    if (payment) {
      payment.utr_number = cleanUTR;
      payment.payer_name = cleanPayer;
      payment.amount = payload.amount || 100;
      payment.payment_status = 'PENDING';
      payment.submitted_at = now;
    } else {
      payment = {
        id: `pay-${Date.now()}`,
        team_id: localTeam.id,
        utr_number: cleanUTR,
        payer_name: cleanPayer,
        amount: payload.amount || 100,
        payment_status: 'PENDING',
        submitted_at: now
      };
      store.payments.push(payment);
    }

    localTeam.payment_status = 'PENDING';
    localTeam.updated_at = now;
    saveLocalStore(store);

    return { success: true, payment };
  },

  // Admin Payment Actions: VERIFY, REJECT, REQUEST_RESUBMISSION
  async updatePaymentVerification(
    teamId: string, 
    action: 'VERIFY' | 'REJECT' | 'REQUEST_RESUBMISSION', 
    actor = 'Admin Secretariat', 
    reason?: string
  ): Promise<{ success: boolean; team: TeamRecord; payment?: PaymentRecord }> {
    const team = await this.getTeam(teamId);
    if (!team) throw new Error('Team not found');
    const now = new Date().toISOString();

    let targetPaymentStatus: 'VERIFIED' | 'REJECTED' | 'RESUBMISSION_REQUIRED' = 'VERIFIED';
    let targetRound1Status = team.round_1_status;

    if (action === 'VERIFY') {
      targetPaymentStatus = 'VERIFIED';
      if (team.round_1_status === 'NOT_STARTED') {
        targetRound1Status = 'SUBMISSION_OPEN';
      }
    } else if (action === 'REJECT') {
      targetPaymentStatus = 'REJECTED';
      targetRound1Status = 'NOT_STARTED';
    } else if (action === 'REQUEST_RESUBMISSION') {
      targetPaymentStatus = 'RESUBMISSION_REQUIRED';
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('payments')
          .update({
            payment_status: targetPaymentStatus,
            verified_at: action === 'VERIFY' ? now : null,
            verified_by: action === 'VERIFY' ? actor : null,
            rejection_reason: (action === 'REJECT' || action === 'REQUEST_RESUBMISSION') ? (reason || 'Verification rejected') : null
          })
          .eq('team_id', team.id);

        await supabase
          .from('teams')
          .update({
            payment_status: targetPaymentStatus,
            round_1_status: targetRound1Status,
            updated_at: now
          })
          .eq('id', team.id);

        await supabase.from('audit_logs').insert([{
          team_id: team.id,
          team_name: team.team_name,
          action: action === 'VERIFY' ? 'Payment Verified' : action === 'REJECT' ? 'Payment Rejected' : 'Payment Resubmission Requested',
          actor,
          details: reason || (action === 'VERIFY' ? 'Payment confirmed by Secretariat' : 'Status updated'),
          created_at: now
        }]);

        const updated = await this.getTeam(team.id);
        if (updated) {
          return { success: true, team: updated, payment: updated.payment || undefined };
        }
      } catch (sbErr) {
        console.error('Supabase updatePaymentVerification error:', sbErr);
      }
    }

    // Local fallback update
    const store = loadLocalStore();
    const localTeam = store.teams.find(t => t.id === team.id || t.registration_id === team.id);
    if (!localTeam) throw new Error('Team not found');

    let payment = store.payments.find(p => p.team_id === localTeam.id);
    if (!payment) {
      payment = {
        id: `pay-${Date.now()}`,
        team_id: localTeam.id,
        utr_number: 'MANUAL_ENTRY',
        payer_name: localTeam.leader_name,
        amount: 100,
        payment_status: targetPaymentStatus,
        submitted_at: now
      };
      store.payments.push(payment);
    }

    payment.payment_status = targetPaymentStatus;
    if (action === 'VERIFY') {
      payment.verified_at = now;
      payment.verified_by = actor;
    } else {
      payment.rejection_reason = reason;
    }

    localTeam.payment_status = targetPaymentStatus;
    localTeam.round_1_status = targetRound1Status;
    localTeam.updated_at = now;
    saveLocalStore(store);

    return { success: true, team: localTeam, payment };
  },

  // Round 1 Native Presentation Submission
  async submitRound1File(teamId: string, fileInfo: {
    originalFilename: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  }): Promise<{ success: boolean; error?: string; submission?: SubmissionRecord }> {
    const team = await this.getTeam(teamId);
    if (!team) return { success: false, error: 'Team record not found.' };

    if (team.payment_status !== 'VERIFIED') {
      return { success: false, error: 'Payment must be verified by organizers before Round 1 submission.' };
    }

    const config = await this.getConfig();
    const deadline = new Date(config.round1SubmissionDeadline).getTime();
    if (Date.now() > deadline) {
      return { success: false, error: `Round 1 Submission Deadline has passed (${config.round1SubmissionDeadline}). Submissions are locked.` };
    }

    const existingSubmissions = team.submissions?.filter(s => s.round_number === 1) || [];
    if (existingSubmissions.length > 0 && !config.allowRound1Resubmission) {
      return { success: false, error: 'Organizers have disabled presentation resubmission.' };
    }

    const version = existingSubmissions.length + 1;
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: subData, error: subErr } = await supabase
          .from('submissions')
          .insert([{
            team_id: team.id,
            round_number: 1,
            file_url: fileInfo.fileUrl,
            original_filename: fileInfo.originalFilename,
            file_size: fileInfo.fileSize,
            file_type: fileInfo.fileType,
            version,
            submission_status: 'SUBMITTED',
            submitted_at: now
          }])
          .select('*')
          .single();

        if (!subErr && subData) {
          await supabase
            .from('teams')
            .update({ round_1_status: 'SUBMITTED', updated_at: now })
            .eq('id', team.id);

          await supabase.from('audit_logs').insert([{
            team_id: team.id,
            team_name: team.team_name,
            action: `Round 1 PPT Submitted (v${version})`,
            actor: 'Participant Portal',
            details: `Uploaded ${fileInfo.originalFilename} (${(fileInfo.fileSize / (1024 * 1024)).toFixed(2)} MB)`,
            created_at: now
          }]);

          return {
            success: true,
            submission: {
              id: subData.id,
              team_id: subData.team_id,
              round_number: subData.round_number as (1 | 2),
              file_url: subData.file_url,
              original_filename: subData.original_filename,
              file_size: Number(subData.file_size),
              file_type: subData.file_type,
              version: subData.version,
              submission_status: subData.submission_status,
              submitted_at: subData.submitted_at
            }
          };
        }
      } catch (sbErr) {
        console.error('Supabase submitRound1File error:', sbErr);
      }
    }

    // Local fallback
    const store = loadLocalStore();
    const newSubmission: SubmissionRecord = {
      id: `sub-${Date.now()}-${version}`,
      team_id: team.id,
      round_number: 1,
      file_url: fileInfo.fileUrl,
      original_filename: fileInfo.originalFilename,
      file_size: fileInfo.fileSize,
      file_type: fileInfo.fileType,
      version,
      submission_status: 'SUBMITTED',
      submitted_at: now
    };

    store.submissions.push(newSubmission);
    const localTeam = store.teams.find(t => t.id === team.id);
    if (localTeam) {
      localTeam.round_1_status = 'SUBMITTED';
      localTeam.updated_at = now;
    }
    saveLocalStore(store);

    return { success: true, submission: newSubmission };
  },

  // Admin Round 1 Evaluation & Round 2 Access Gate
  async evaluateRound1(
    teamId: string,
    decision: 'SELECT' | 'NOT_SELECTED' | 'UNDER_REVIEW',
    actor = 'Admin Secretariat',
    score?: number,
    notes?: string
  ): Promise<{ success: boolean; team: TeamRecord }> {
    const team = await this.getTeam(teamId);
    if (!team) throw new Error('Team not found');
    const now = new Date().toISOString();

    let targetRound1Status: 'SELECTED' | 'NOT_SELECTED' | 'UNDER_REVIEW' = decision === 'SELECT' ? 'SELECTED' : decision;
    let targetRound2Status: 'LOCKED' | 'ACCESS_GRANTED' = decision === 'SELECT' ? 'ACCESS_GRANTED' : 'LOCKED';

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('teams')
          .update({
            round_1_status: targetRound1Status,
            round_2_status: targetRound2Status,
            round_1_score: typeof score === 'number' ? score : null,
            admin_notes: notes || team.admin_notes || null,
            updated_at: now
          })
          .eq('id', team.id);

        await supabase.from('audit_logs').insert([{
          team_id: team.id,
          team_name: team.team_name,
          action: decision === 'SELECT' ? 'Team Selected for Round 2' : decision === 'NOT_SELECTED' ? 'Round 1 Decision: Not Selected' : 'Round 1 Under Review',
          actor,
          details: `Score: ${score !== undefined ? score : 'N/A'}. ${notes || ''}`,
          created_at: now
        }]);

        const updated = await this.getTeam(team.id);
        if (updated) return { success: true, team: updated };
      } catch (sbErr) {
        console.error('Supabase evaluateRound1 error:', sbErr);
      }
    }

    const store = loadLocalStore();
    const localTeam = store.teams.find(t => t.id === team.id || t.registration_id === team.id);
    if (!localTeam) throw new Error('Team not found');

    localTeam.round_1_status = targetRound1Status;
    localTeam.round_2_status = targetRound2Status;
    if (typeof score === 'number') localTeam.round_1_score = score;
    if (notes) localTeam.admin_notes = notes;
    localTeam.updated_at = now;

    saveLocalStore(store);
    return { success: true, team: localTeam };
  },

  // Add Admin Note
  async addAdminNote(teamId: string, note: string, actor = 'Admin'): Promise<TeamRecord> {
    const team = await this.getTeam(teamId);
    if (!team) throw new Error('Team not found');
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('teams')
          .update({ admin_notes: note.trim(), updated_at: now })
          .eq('id', team.id);

        await supabase.from('audit_logs').insert([{
          team_id: team.id,
          team_name: team.team_name,
          action: 'Admin Note Updated',
          actor,
          details: note.trim(),
          created_at: now
        }]);

        const updated = await this.getTeam(team.id);
        if (updated) return updated;
      } catch (sbErr) {
        console.error('Supabase addAdminNote error:', sbErr);
      }
    }

    const store = loadLocalStore();
    const localTeam = store.teams.find(t => t.id === team.id || t.registration_id === team.id);
    if (!localTeam) throw new Error('Team not found');

    localTeam.admin_notes = note.trim();
    localTeam.updated_at = now;
    saveLocalStore(store);

    return localTeam;
  },

  // Get Admin Dashboard Overview and Teams
  async getAdminOverview(filters?: {
    search?: string;
    paymentStatus?: string;
    round1Status?: string;
    round2Status?: string;
    track?: string;
    college?: string;
    onlySuspicious?: boolean;
  }): Promise<{
    stats: {
      totalRegistrations: number;
      paymentVerified: number;
      paymentPending: number;
      paymentRejected: number;
      paymentResubmission: number;
      round1Submissions: number;
      round1PendingReview: number;
      round1Selected: number;
      round1NotSelected: number;
      totalRevenue: number;
      countByTrack: Record<string, number>;
    };
    teams: TeamRecord[];
    auditLogs: AuditLogRecord[];
  }> {
    let teams: TeamRecord[] = [];
    let auditLogs: AuditLogRecord[] = [];

    if (isSupabaseConfigured() && supabase) {
      try {
        const [teamsRes, memRes, payRes, subRes, flagRes, logRes] = await Promise.all([
          supabase.from('teams').select('*').order('created_at', { ascending: false }),
          supabase.from('team_members').select('*').order('member_number', { ascending: true }),
          supabase.from('payments').select('*'),
          supabase.from('submissions').select('*').order('version', { ascending: false }),
          supabase.from('suspicion_flags').select('*').order('created_at', { ascending: false }),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50)
        ]);

        if (teamsRes.data) {
          const membersByTeam = new Map<string, TeamMember[]>();
          (memRes.data || []).forEach(m => {
            const list = membersByTeam.get(m.team_id) || [];
            list.push({
              id: m.id,
              team_id: m.team_id,
              member_number: m.member_number,
              member_name: m.member_name,
              member_email: m.member_email || undefined,
              member_phone: m.member_phone,
              department: m.department || undefined,
              year: m.year || undefined
            });
            membersByTeam.set(m.team_id, list);
          });

          const paymentsByTeam = new Map<string, PaymentRecord>();
          (payRes.data || []).forEach(p => {
            paymentsByTeam.set(p.team_id, {
              id: p.id,
              team_id: p.team_id,
              utr_number: p.utr_number,
              payer_name: p.payer_name,
              amount: p.amount || 100,
              payment_status: p.payment_status,
              notes: p.notes || undefined,
              rejection_reason: p.rejection_reason || undefined,
              submitted_at: p.submitted_at,
              verified_at: p.verified_at || null,
              verified_by: p.verified_by || null
            });
          });

          const subsByTeam = new Map<string, SubmissionRecord[]>();
          (subRes.data || []).forEach(s => {
            const list = subsByTeam.get(s.team_id) || [];
            list.push({
              id: s.id,
              team_id: s.team_id,
              round_number: s.round_number as (1 | 2),
              file_url: s.file_url,
              original_filename: s.original_filename,
              file_size: Number(s.file_size),
              file_type: s.file_type,
              version: s.version,
              submission_status: s.submission_status,
              submitted_at: s.submitted_at,
              review_notes: s.review_notes || undefined
            });
            subsByTeam.set(s.team_id, list);
          });

          const flagsByTeam = new Map<string, SuspicionFlag[]>();
          (flagRes.data || []).forEach(f => {
            const list = flagsByTeam.get(f.team_id) || [];
            list.push({
              id: f.id,
              team_id: f.team_id,
              flag_type: f.flag_type,
              description: f.description,
              severity: f.severity,
              matched_value: f.matched_value,
              matched_team_id: f.matched_team_id || undefined,
              created_at: f.created_at
            });
            flagsByTeam.set(f.team_id, list);
          });

          teams = teamsRes.data.map(t => ({
            id: t.id,
            registration_id: t.registration_id,
            team_name: t.team_name,
            leader_name: t.leader_name,
            leader_phone: t.leader_phone,
            leader_email: t.leader_email,
            institution: t.institution,
            department: t.department || undefined,
            year: t.year || undefined,
            problem_statement: t.problem_statement,
            access_token: t.access_token,
            payment_status: t.payment_status,
            payment: paymentsByTeam.get(t.id) || null,
            amount: t.amount || 100,
            registration_status: t.registration_status || 'REGISTERED',
            round_1_status: t.round_1_status || 'NOT_STARTED',
            round_2_status: t.round_2_status || 'LOCKED',
            round_1_score: t.round_1_score !== null ? Number(t.round_1_score) : null,
            admin_notes: t.admin_notes || null,
            members: membersByTeam.get(t.id) || [],
            submissions: subsByTeam.get(t.id) || [],
            suspicion_flags: flagsByTeam.get(t.id) || [],
            created_at: t.created_at,
            updated_at: t.updated_at
          }));

          auditLogs = (logRes.data || []).map(l => ({
            id: l.id,
            team_id: l.team_id,
            team_name: l.team_name,
            action: l.action,
            actor: l.actor,
            details: l.details,
            created_at: l.created_at
          }));
        }
      } catch (err) {
        console.warn('Supabase getAdminOverview error, using fallback:', err);
      }
    }

    if (teams.length === 0) {
      const store = loadLocalStore();
      teams = store.teams.map(t => ({
        ...t,
        payment: store.payments.find(p => p.team_id === t.id || p.team_id === t.registration_id) || null,
        submissions: store.submissions.filter(s => s.team_id === t.id || s.team_id === t.registration_id) || [],
        suspicion_flags: store.suspicionFlags.filter(f => f.team_id === t.id || f.team_id === t.registration_id) || []
      }));
      auditLogs = store.auditLogs.slice(0, 50);
    }

    // Analytics Calculation
    const totalRegistrations = teams.length;
    const paymentVerified = teams.filter(t => t.payment_status === 'VERIFIED').length;
    const paymentPending = teams.filter(t => t.payment_status === 'PENDING').length;
    const paymentRejected = teams.filter(t => t.payment_status === 'REJECTED').length;
    const paymentResubmission = teams.filter(t => t.payment_status === 'RESUBMISSION_REQUIRED').length;

    const round1Submissions = teams.filter(t => ['SUBMITTED', 'UNDER_REVIEW', 'SELECTED', 'NOT_SELECTED'].includes(t.round_1_status)).length;
    const round1PendingReview = teams.filter(t => ['SUBMITTED', 'UNDER_REVIEW'].includes(t.round_1_status)).length;
    const round1Selected = teams.filter(t => t.round_1_status === 'SELECTED').length;
    const round1NotSelected = teams.filter(t => t.round_1_status === 'NOT_SELECTED').length;

    const countByTrack: Record<string, number> = {
      'ORION-PS-01': 0,
      'ORION-PS-02': 0,
      'ORION-PS-03': 0,
      'ORION-PS-04': 0,
      'OTHER': 0
    };

    teams.forEach(t => {
      const ps = t.problem_statement || '';
      if (ps.includes('PS-01') || ps.includes('floatchat')) countByTrack['ORION-PS-01']++;
      else if (ps.includes('PS-02') || ps.includes('lexvault')) countByTrack['ORION-PS-02']++;
      else if (ps.includes('PS-03') || ps.includes('sylvasense')) countByTrack['ORION-PS-03']++;
      else if (ps.includes('PS-04') || ps.includes('open')) countByTrack['ORION-PS-04']++;
      else countByTrack['OTHER']++;
    });

    // Apply Filters
    let filteredTeams = [...teams];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      filteredTeams = filteredTeams.filter(t => 
        t.registration_id.toLowerCase().includes(q) ||
        t.team_name.toLowerCase().includes(q) ||
        t.leader_name.toLowerCase().includes(q) ||
        t.leader_email.toLowerCase().includes(q) ||
        t.leader_phone.includes(q) ||
        (t.payment?.utr_number && t.payment.utr_number.toLowerCase().includes(q)) ||
        t.institution.toLowerCase().includes(q)
      );
    }

    if (filters?.paymentStatus && filters.paymentStatus !== 'ALL') {
      filteredTeams = filteredTeams.filter(t => t.payment_status === filters.paymentStatus);
    }

    if (filters?.round1Status && filters.round1Status !== 'ALL') {
      filteredTeams = filteredTeams.filter(t => t.round_1_status === filters.round1Status);
    }

    if (filters?.track && filters.track !== 'ALL') {
      filteredTeams = filteredTeams.filter(t => t.problem_statement.includes(filters.track!));
    }

    if (filters?.onlySuspicious) {
      filteredTeams = filteredTeams.filter(t => (t.suspicion_flags?.length || 0) > 0);
    }

    return {
      stats: {
        totalRegistrations,
        paymentVerified,
        paymentPending,
        paymentRejected,
        paymentResubmission,
        round1Submissions,
        round1PendingReview,
        round1Selected,
        round1NotSelected,
        totalRevenue: paymentVerified * 100,
        countByTrack
      },
      teams: filteredTeams,
      auditLogs
    };
  }
};
