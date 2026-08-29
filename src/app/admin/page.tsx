'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Unlock, 
  RefreshCw, 
  ArrowLeft, 
  Sparkles, 
  Settings, 
  ListOrdered, 
  Eye, 
  Check, 
  FileCheck, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import type { TeamRecord, AuditLogRecord, SystemConfig } from '@/types/orion';
import { sound } from '@/audio/soundEffects';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active Tab: 'TEAMS' | 'AUDIT_LOGS' | 'SETTINGS'
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'AUDIT_LOGS' | 'SETTINGS'>('TEAMS');

  // Dashboard Data State
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [, setConfig] = useState<SystemConfig | null>(null);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    paymentVerified: 0,
    paymentPending: 0,
    paymentRejected: 0,
    paymentResubmission: 0,
    round1Submissions: 0,
    round1PendingReview: 0,
    round1Selected: 0,
    round1NotSelected: 0,
    totalRevenue: 0,
    countByTrack: {} as Record<string, number>
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [selectedRoundStatus, setSelectedRoundStatus] = useState('ALL');
  const [onlySuspicious, setOnlySuspicious] = useState(false);

  // Selected Team for Detail Modal
  const [selectedTeam, setSelectedTeam] = useState<TeamRecord | null>(null);

  // Action Form States inside Modal
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [evalScoreInput] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<Partial<SystemConfig>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Fetch admin data helper
  const fetchAdminData = useCallback(async (key: string, isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { 'x-admin-key': key }
      });

      if (res.status === 401) {
        sessionStorage.removeItem('orion_admin_key');
        setIsAuthenticated(false);
        setAuthError('Session expired. Please enter passcode again.');
        return;
      }

      const json = await res.json();
      if (json.success) {
        setTeams(json.teams || []);
        setAuditLogs(json.auditLogs || []);
        if (json.config) {
          setConfig(json.config);
          setSettingsForm(json.config);
        }
        setStats(json.stats || {
          totalRegistrations: 0,
          paymentVerified: 0,
          paymentPending: 0,
          paymentRejected: 0,
          paymentResubmission: 0,
          round1Submissions: 0,
          round1PendingReview: 0,
          round1Selected: 0,
          round1NotSelected: 0,
          totalRevenue: 0,
          countByTrack: {}
        });
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  // Check saved session in sessionStorage
  useEffect(() => {
    const savedKey = typeof window !== 'undefined' ? sessionStorage.getItem('orion_admin_key') : null;
    if (savedKey) {
      const timer = setTimeout(() => {
        fetchAdminData(savedKey);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [fetchAdminData]);

  // Real-time polling every 6 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const savedKey = sessionStorage.getItem('orion_admin_key');
      if (savedKey) {
        fetchAdminData(savedKey, true);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });

      const json = await res.json();
      if (res.ok && json.authorized) {
        sessionStorage.setItem('orion_admin_key', passcode.trim());
        setIsAuthenticated(true);
        fetchAdminData(passcode.trim());
      } else {
        setAuthError(json.error || 'Invalid passcode');
      }
    } catch {
      setAuthError('Connection error during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sound.playClick();
    sessionStorage.removeItem('orion_admin_key');
    setIsAuthenticated(false);
    setTeams([]);
  };

  // Perform Admin Action: Payment or Round 1 Evaluation
  const handleAdminAction = async (payload: {
    action: string;
    teamId: string;
    decision?: string;
    score?: number;
    reason?: string;
    note?: string;
  }) => {
    const key = sessionStorage.getItem('orion_admin_key') || '';
    sound.playClick();
    setActionSuccessMsg('');

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccessMsg(json.message || 'Action saved successfully');
        setTimeout(() => setActionSuccessMsg(''), 4000);
        
        // Refresh admin data
        await fetchAdminData(key, true);
        
        // Update currently opened team
        if (selectedTeam) {
          const updated = await fetch(`/api/team/portal?teamId=${selectedTeam.registration_id}`).then(r => r.json());
          if (updated.team) setSelectedTeam(updated.team);
        }
      } else {
        alert(json.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Admin action error:', err);
      alert('Error executing administrative command');
    }
  };

  // Save System Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = sessionStorage.getItem('orion_admin_key') || '';
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key
        },
        body: JSON.stringify({ config: settingsForm })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.config);
        alert('System configuration updated successfully');
      }
    } catch (err) {
      console.error('Settings update error:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!teams.length) return;

    const headers = [
      'Team ID',
      'Team Name',
      'Track',
      'Leader Name',
      'Leader Phone',
      'Leader Email',
      'Institution',
      'Department',
      'Year',
      'Payment Status',
      'UTR Number',
      'Round 1 Status',
      'Round 2 Status',
      'Score',
      'Members Count',
      'Passcode',
      'Registration Date'
    ];

    const rows = teams.map((t) => [
      t.registration_id,
      `"${t.team_name.replace(/"/g, '""')}"`,
      t.problem_statement,
      `"${t.leader_name.replace(/"/g, '""')}"`,
      `"${t.leader_phone}"`,
      t.leader_email,
      `"${t.institution.replace(/"/g, '""')}"`,
      `"${t.department || ''}"`,
      `"${t.year || ''}"`,
      t.payment_status,
      `"${t.payment?.utr_number || ''}"`,
      t.round_1_status,
      t.round_2_status,
      t.round_1_score || '',
      t.members.length + 1,
      t.access_token,
      t.created_at ? t.created_at.split('T')[0] : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ORION_Hackathon_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Teams
  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      t.registration_id.toLowerCase().includes(q) ||
      t.team_name.toLowerCase().includes(q) ||
      t.leader_name.toLowerCase().includes(q) ||
      t.leader_email.toLowerCase().includes(q) ||
      t.leader_phone.includes(q) ||
      (t.payment?.utr_number && t.payment.utr_number.toLowerCase().includes(q)) ||
      t.institution.toLowerCase().includes(q)
    );

    const matchesTrack = selectedTrack === 'ALL' || t.problem_statement.includes(selectedTrack);
    const matchesPayment = selectedPaymentStatus === 'ALL' || t.payment_status === selectedPaymentStatus;
    const matchesRound = selectedRoundStatus === 'ALL' || t.round_1_status === selectedRoundStatus;
    const matchesSuspicious = !onlySuspicious || ((t.suspicion_flags?.length || 0) > 0);

    return matchesSearch && matchesTrack && matchesPayment && matchesRound && matchesSuspicious;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-[#00BCF2]/30 selection:text-[#BAE6FD] relative pb-20">
      
      {/* Top Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#0B1220]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="ORION 1.0" className="w-8 h-8 object-contain" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-sm text-white">ORION 1.0</span>
                  <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.2 border border-rose-500/40 font-bold">
                    ADMIN COMMAND CENTER
                  </span>
                </div>
                <div className="text-[9px] font-sans text-slate-400">Microsoft Club SIST</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    const key = sessionStorage.getItem('orion_admin_key') || '';
                    fetchAdminData(key);
                  }}
                  className="p-2 bg-[#040E24] border border-white/10 text-[#38BDF8] hover:bg-[#07193D] transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  title="Sync Live Records"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">SYNC</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-colors text-xs font-mono-hud flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">EXPORT CSV</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 transition-colors text-xs font-mono-hud flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>EXIT</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="px-3.5 py-1.5 border border-white/15 text-slate-300 hover:text-white font-mono-hud text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO EVENT SITE</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* LOGIN FORM */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto pt-16">
            <div className="p-6 sm:p-8 bg-[#07193D] border border-[#38BDF8]/40 shadow-2xl space-y-5 text-left">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-hud text-[#38BDF8] font-bold uppercase tracking-wider">
                    RESTRICTED SECRETARIAT ACCESS
                  </div>
                  <h2 className="text-xl font-display font-black text-white">
                    ADMIN COMMAND GATE
                  </h2>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-mono">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    ADMIN SECURITY PASSCODE
                  </label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin key (e.g. orion_genesis_2026)"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[#38BDF8]/40 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-glow-cyan w-full py-3 font-display font-black text-xs text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4 text-[#040E24]" />
                  <span>AUTHORIZE ADMIN SESSION</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* LIVE METRICS HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <div className="p-3 bg-[#07193D] border border-white/10">
                <div className="text-[9px] font-mono-hud text-slate-400">TOTAL SQUADS</div>
                <div className="text-xl font-mono-hud font-black text-white">{stats.totalRegistrations}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-emerald-500/40">
                <div className="text-[9px] font-mono-hud text-emerald-400">PAID & VERIFIED</div>
                <div className="text-xl font-mono-hud font-black text-emerald-400">{stats.paymentVerified}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-amber-500/40">
                <div className="text-[9px] font-mono-hud text-amber-300">PAY PENDING</div>
                <div className="text-xl font-mono-hud font-black text-amber-300">{stats.paymentPending}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-orange-500/40">
                <div className="text-[9px] font-mono-hud text-orange-400">RESUBMIT REQ</div>
                <div className="text-xl font-mono-hud font-black text-orange-400">{stats.paymentResubmission}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-[#38BDF8]/40">
                <div className="text-[9px] font-mono-hud text-[#38BDF8]">R1 PPT FILED</div>
                <div className="text-xl font-mono-hud font-black text-[#38BDF8]">{stats.round1Submissions}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-cyan-500/40">
                <div className="text-[9px] font-mono-hud text-cyan-300">R1 IN REVIEW</div>
                <div className="text-xl font-mono-hud font-black text-cyan-300">{stats.round1PendingReview}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-emerald-400/60 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                <div className="text-[9px] font-mono-hud text-emerald-300 font-bold">R2 SELECTED</div>
                <div className="text-xl font-mono-hud font-black text-emerald-300">{stats.round1Selected}</div>
              </div>
              <div className="p-3 bg-[#07193D] border border-slate-500/40">
                <div className="text-[9px] font-mono-hud text-slate-400">NOT SELECTED</div>
                <div className="text-xl font-mono-hud font-black text-slate-400">{stats.round1NotSelected}</div>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('TEAMS')}
                className={`px-4 py-2 text-xs font-mono-hud font-bold border transition-all cursor-pointer ${
                  activeTab === 'TEAMS'
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-[#040E24] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                SQUAD ROSTER & EVALUATION ({teams.length})
              </button>

              <button
                onClick={() => setActiveTab('AUDIT_LOGS')}
                className={`px-4 py-2 text-xs font-mono-hud font-bold border transition-all cursor-pointer ${
                  activeTab === 'AUDIT_LOGS'
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-[#040E24] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                SYSTEM AUDIT LOGS ({auditLogs.length})
              </button>

              <button
                onClick={() => setActiveTab('SETTINGS')}
                className={`px-4 py-2 text-xs font-mono-hud font-bold border transition-all cursor-pointer ${
                  activeTab === 'SETTINGS'
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-[#040E24] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                COMPETITION SETTINGS
              </button>
            </div>

            {/* TAB 1: TEAMS & EVALUATION */}
            {activeTab === 'TEAMS' && (
              <div className="space-y-4">
                
                {/* Search & Multi-Filter Bar */}
                <div className="p-4 bg-[#07193D] border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    
                    {/* Text Search */}
                    <div className="lg:col-span-2 relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Team ID, Squad Name, Leader, Email, Phone, UTR..."
                        className="w-full pl-9 pr-3 py-2 bg-[#040E24] border border-white/10 text-white text-xs font-mono focus:border-[#38BDF8] focus:outline-none"
                      />
                    </div>

                    {/* Payment Filter */}
                    <div>
                      <select
                        value={selectedPaymentStatus}
                        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-[#040E24] border border-white/10 text-white text-xs font-mono focus:border-[#38BDF8] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">Payment: All States</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="RESUBMISSION_REQUIRED">Resubmission Req</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="NOT_SUBMITTED">Not Submitted</option>
                      </select>
                    </div>

                    {/* Round 1 Status Filter */}
                    <div>
                      <select
                        value={selectedRoundStatus}
                        onChange={(e) => setSelectedRoundStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-[#040E24] border border-white/10 text-white text-xs font-mono focus:border-[#38BDF8] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">Round 1: All States</option>
                        <option value="SUBMISSION_OPEN">Submission Open</option>
                        <option value="SUBMITTED">PPT Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SELECTED">Selected for R2</option>
                        <option value="NOT_SELECTED">Not Selected</option>
                        <option value="NOT_STARTED">Not Started</option>
                      </select>
                    </div>

                    {/* Track Filter */}
                    <div>
                      <select
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        className="w-full px-3 py-2 bg-[#040E24] border border-white/10 text-white text-xs font-mono focus:border-[#38BDF8] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">Track: All Tracks</option>
                        <option value="PS-01">PS-01: FloatChat</option>
                        <option value="PS-02">PS-02: LexVault</option>
                        <option value="PS-03">PS-03: SylvaSense</option>
                        <option value="PS-04">PS-04: Open Track</option>
                      </select>
                    </div>

                  </div>

                  {/* Suspicious Checkbox Toggle */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-amber-300">
                      <input
                        type="checkbox"
                        checked={onlySuspicious}
                        onChange={(e) => setOnlySuspicious(e.target.checked)}
                        className="accent-amber-400 w-3.5 h-3.5"
                      />
                      <span>Show Only Flagged / Duplicate Anomalies</span>
                    </label>
                    <span className="text-slate-400">
                      Showing {filteredTeams.length} of {teams.length} Squads
                    </span>
                  </div>
                </div>

                {/* Team Roster Grid */}
                <div className="space-y-2">
                  {filteredTeams.length === 0 ? (
                    <div className="p-8 bg-[#07193D] border border-white/10 text-center text-slate-400 text-xs font-mono">
                      No matching squad records found.
                    </div>
                  ) : (
                    filteredTeams.map((team) => (
                      <div 
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        className={`p-4 bg-[#07193D] hover:bg-[#0B2556] border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          team.round_1_status === 'SELECTED'
                            ? 'border-emerald-400/60 shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                            : (team.suspicion_flags?.length || 0) > 0
                            ? 'border-amber-400/60'
                            : 'border-white/10 hover:border-[#38BDF8]/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-hud text-xs font-bold text-[#38BDF8]">
                              {team.registration_id}
                            </span>
                            <span className="font-display font-black text-sm text-white">
                              {team.team_name}
                            </span>
                            {(team.suspicion_flags?.length || 0) > 0 && (
                              <span className="text-[9px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.2 border border-amber-400/40 font-bold flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                {team.suspicion_flags?.length} FLAG(S)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-300 font-sans flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span>Leader: <strong>{team.leader_name}</strong> ({team.leader_phone})</span>
                            <span>•</span>
                            <span className="text-slate-400 truncate max-w-xs">{team.institution}</span>
                            <span>•</span>
                            <span className="text-[#38BDF8] font-mono">{team.problem_statement}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Payment Badge */}
                          <span className={`text-[10px] font-mono px-2 py-0.5 font-bold ${
                            team.payment_status === 'VERIFIED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : team.payment_status === 'PENDING'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          }`}>
                            PAY: {team.payment_status}
                          </span>

                          {/* Round 1 Status Badge */}
                          <span className={`text-[10px] font-mono px-2 py-0.5 font-bold ${
                            team.round_1_status === 'SELECTED'
                              ? 'bg-emerald-400 text-[#040E24]'
                              : ['SUBMITTED', 'UNDER_REVIEW'].includes(team.round_1_status)
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-[#040E24] text-slate-400 border border-white/10'
                          }`}>
                            R1: {team.round_1_status}
                          </span>

                          <button
                            type="button"
                            className="px-3 py-1.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>DOSSIER</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: AUDIT LOGS */}
            {activeTab === 'AUDIT_LOGS' && (
              <div className="p-5 bg-[#07193D] border border-white/10 space-y-3">
                <div className="text-xs font-mono-hud text-[#38BDF8] font-bold flex items-center gap-2 border-b border-white/10 pb-3">
                  <ListOrdered className="w-4 h-4" />
                  <span>IMMUTABLE ADMINISTRATIVE & SYSTEM AUDIT LOGS</span>
                </div>

                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-[#040E24] border border-white/5 text-xs font-mono flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{log.action}</strong>
                          {log.team_name && <span className="text-[#38BDF8]">[{log.team_name}]</span>}
                          <span className="text-[10px] text-slate-400">by {log.actor}</span>
                        </div>
                        {log.details && <div className="text-slate-300 text-[11px] mt-0.5">{log.details}</div>}
                      </div>
                      <div className="text-[10px] text-slate-500 shrink-0">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SETTINGS */}
            {activeTab === 'SETTINGS' && (
              <div className="p-6 bg-[#07193D] border border-white/10 space-y-5 max-w-2xl text-xs font-mono">
                <div className="text-xs font-mono-hud text-[#38BDF8] font-bold flex items-center gap-2 border-b border-white/10 pb-3">
                  <Settings className="w-4 h-4" />
                  <span>COMPETITION RULES & TIMING CONFIGURATION</span>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Round 1 Submission Deadline (ISO String)</label>
                    <input
                      type="text"
                      value={settingsForm.round1SubmissionDeadline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, round1SubmissionDeadline: e.target.value })}
                      className="w-full p-2.5 bg-[#040E24] border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Max Submission File Size (MB)</label>
                    <input
                      type="number"
                      value={settingsForm.maxFileSizeMb || 25}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxFileSizeMb: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#040E24] border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allowResubmission"
                      checked={settingsForm.allowRound1Resubmission || false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, allowRound1Resubmission: e.target.checked })}
                      className="accent-[#38BDF8] w-4 h-4"
                    />
                    <label htmlFor="allowResubmission" className="text-slate-200 cursor-pointer">
                      Allow Round 1 Presentation Resubmission before deadline
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Organizer UPI ID</label>
                    <input
                      type="text"
                      value={settingsForm.upiId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full p-2.5 bg-[#040E24] border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="btn-glow-cyan px-6 py-2.5 font-display font-bold text-xs text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSavingSettings ? 'SAVING...' : 'SAVE CONFIGURATION'}
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </main>

      {/* TEAM DETAIL MODAL / DRAWER */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#07193D] border border-[#38BDF8]/60 p-6 shadow-2xl space-y-5 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-hud text-xs font-bold text-[#38BDF8]">{selectedTeam.registration_id}</span>
                  <span className="text-[10px] font-mono bg-[#0B2556] text-[#BAE6FD] px-2 py-0.5 border border-[#38BDF8]/30">
                    PASSCODE: {selectedTeam.access_token}
                  </span>
                </div>
                <h2 className="text-2xl font-display font-black text-white mt-1">
                  {selectedTeam.team_name}
                </h2>
                <div className="text-xs text-slate-300 font-sans mt-0.5">
                  {selectedTeam.institution} • Track: <strong>{selectedTeam.problem_statement}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeam(null)}
                className="p-2 bg-[#040E24] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Success Alert inside Modal */}
            {actionSuccessMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Suspicion Flags Alert (If Any) */}
            {(selectedTeam.suspicion_flags?.length || 0) > 0 && (
              <div className="p-4 bg-amber-950/60 border border-amber-500/60 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SUSPICIOUS REGISTRATION ANOMALIES DETECTED ({selectedTeam.suspicion_flags?.length})</span>
                </div>
                <div className="space-y-1.5">
                  {selectedTeam.suspicion_flags?.map((flag, idx) => (
                    <div key={idx} className="p-2 bg-black/40 border border-amber-500/20 text-amber-200 text-[11px]">
                      • [{flag.flag_type}] {flag.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid 2-Column: Actions & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
              
              {/* PAYMENT VERIFICATION DOSSIER */}
              <div className="p-4 bg-[#040E24] border border-white/10 space-y-3">
                <div className="text-[11px] font-mono-hud text-[#38BDF8] font-bold border-b border-white/10 pb-2">
                  PAYMENT VERIFICATION (₹100)
                </div>

                <div className="space-y-1.5">
                  <div>Status: <strong className="text-white">{selectedTeam.payment_status}</strong></div>
                  <div>UTR / Ref: <strong className="text-[#38BDF8] font-mono">{selectedTeam.payment?.utr_number || 'NOT_SUBMITTED'}</strong></div>
                  <div>Payer Name: <span className="text-slate-300">{selectedTeam.payment?.payer_name || 'N/A'}</span></div>
                  <div>Submitted: <span className="text-slate-400">{selectedTeam.payment?.submitted_at ? new Date(selectedTeam.payment.submitted_at).toLocaleString() : 'N/A'}</span></div>
                </div>

                {/* Payment Action Buttons */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdminAction({ action: 'VERIFY_PAYMENT', teamId: selectedTeam.registration_id })}
                      className="flex-1 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>VERIFY PAYMENT</span>
                    </button>
                    <button
                      onClick={() => handleAdminAction({ action: 'REJECT_PAYMENT', teamId: selectedTeam.registration_id, reason: 'Invalid payment reference.' })}
                      className="py-2 px-3 bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs cursor-pointer"
                    >
                      REJECT
                    </button>
                  </div>

                  <button
                    onClick={() => handleAdminAction({ action: 'REQUEST_PAYMENT_RESUBMISSION', teamId: selectedTeam.registration_id, reason: 'Please provide valid 12-digit UTR.' })}
                    className="w-full py-1.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] cursor-pointer"
                  >
                    REQUEST RESUBMISSION
                  </button>
                </div>
              </div>

              {/* ROUND 1 PPT & EVALUATION */}
              <div className="p-4 bg-[#040E24] border border-white/10 space-y-3">
                <div className="text-[11px] font-mono-hud text-[#38BDF8] font-bold border-b border-white/10 pb-2">
                  ROUND 1 PPT EVALUATION & SELECTION
                </div>

                <div className="space-y-1.5">
                  <div>R1 Status: <strong className="text-white">{selectedTeam.round_1_status}</strong></div>
                  <div>R2 Access: <strong className="text-emerald-400">{selectedTeam.round_2_status}</strong></div>
                  
                  {selectedTeam.submissions && selectedTeam.submissions.length > 0 ? (
                    <div className="p-2.5 bg-[#020817] border border-white/10 space-y-1 mt-2">
                      <div className="text-emerald-400 font-bold flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Presentation Uploaded (v{selectedTeam.submissions[selectedTeam.submissions.length - 1].version})</span>
                      </div>
                      <div className="text-white truncate">{selectedTeam.submissions[selectedTeam.submissions.length - 1].original_filename}</div>
                      <a
                        href={selectedTeam.submissions[selectedTeam.submissions.length - 1].file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#38BDF8] hover:underline pt-1 text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download & Review File</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[11px]">No presentation file uploaded yet.</div>
                  )}
                </div>

                {/* Evaluation Buttons */}
                <div className="pt-2 border-t border-white/10 flex gap-2">
                  <button
                    onClick={() => handleAdminAction({ action: 'EVALUATE_ROUND_1', teamId: selectedTeam.registration_id, decision: 'SELECT', score: Number(evalScoreInput) || 85 })}
                    className="flex-1 py-2 bg-emerald-500 text-[#040E24] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SELECT FOR ROUND 2</span>
                  </button>
                  <button
                    onClick={() => handleAdminAction({ action: 'EVALUATE_ROUND_1', teamId: selectedTeam.registration_id, decision: 'NOT_SELECTED' })}
                    className="py-2 px-3 bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    NOT SELECTED
                  </button>
                </div>
              </div>

            </div>

            {/* SQUAD MEMBERS ROSTER */}
            <div className="p-4 bg-[#040E24] border border-white/10 space-y-3">
              <div className="text-[11px] font-mono-hud text-[#38BDF8] font-bold">
                SQUAD ROSTER ({selectedTeam.members.length + 1} PARTICIPANTS)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#07193D] border border-[#38BDF8]/40 space-y-0.5">
                  <div className="text-[#38BDF8] font-bold text-[10px]">LEADER: {selectedTeam.leader_name}</div>
                  <div className="text-slate-300">{selectedTeam.leader_phone}</div>
                  <div className="text-slate-400 text-[10px] truncate">{selectedTeam.leader_email}</div>
                  <div className="text-slate-400 text-[10px]">{selectedTeam.department} • {selectedTeam.year}</div>
                </div>
                {selectedTeam.members.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-[#020817] border border-white/10 space-y-0.5">
                    <div className="text-white font-bold text-[10px]">MEMBER 0{idx + 1}: {m.member_name}</div>
                    <div className="text-slate-300">{m.member_phone}</div>
                    {m.member_email && <div className="text-slate-400 text-[10px] truncate">{m.member_email}</div>}
                    <div className="text-slate-400 text-[10px]">{m.department} • {m.year}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIN NOTES */}
            <div className="p-4 bg-[#040E24] border border-white/10 space-y-2">
              <div className="text-[11px] font-mono-hud text-[#38BDF8] font-bold">ADMINISTRATIVE NOTES</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNoteInput || selectedTeam.admin_notes || ''}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Add confidential admin note..."
                  className="flex-1 p-2 bg-[#020817] border border-white/10 text-white text-xs font-mono"
                />
                <button
                  onClick={() => handleAdminAction({ action: 'ADD_NOTE', teamId: selectedTeam.registration_id, note: adminNoteInput })}
                  className="px-4 py-2 bg-[#0B2556] text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-mono cursor-pointer"
                >
                  SAVE NOTE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
