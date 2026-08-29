'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Rocket, 
  CheckCircle2, 
  ShieldAlert, 
  CreditCard, 
  Users, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  QrCode,
  ArrowRight,
  Layers,
  UserCheck
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { PROBLEM_STATEMENTS } from '../../data/orionData';
import type { RegisteredTeam, TeamRegistrationPayload } from '../../types/orion';
import { sound } from '../../audio/soundEffects';
import Link from 'next/link';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegister?: (newTeam: RegisteredTeam) => void;
  totalTeamsCount?: number;
  initialProblemStatement?: string;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccessRegister,
  initialProblemStatement
}) => {
  // Steps: 1: Team & Leader, 2: Members, 3: Declarations, 4: Review, 5: UPI Payment & UTR, 6: Confirmed Dossier
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Section 1: Team & Leader
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [problemStatement, setProblemStatement] = useState(() => {
    if (initialProblemStatement) {
      const match = PROBLEM_STATEMENTS.find(p => p.id === initialProblemStatement || p.code === initialProblemStatement);
      return match ? match.code : 'ORION-PS-01';
    }
    return 'ORION-PS-01';
  });

  // Section 2: Team Members (1 to 5 additional members, total squad 2 to 6)
  const [members, setMembers] = useState<Array<{ name: string; phone: string; email: string; department: string; year: string }>>([
    { name: '', phone: '', email: '', department: '', year: '3rd Year' }
  ]);

  // Section 3: Declarations
  const [declarations, setDeclarations] = useState({
    accurateInfo: false,
    membersBelong: false,
    rulesAgreed: false,
    feeUnderstood: false,
    qualifierUnderstood: false
  });

  // Payment State (Step 5)
  const [utrNumber, setUtrNumber] = useState('');
  const [payerName, setPayerName] = useState('');

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredTeamData, setRegisteredTeamData] = useState<{
    teamId: string;
    accessToken: string;
    teamName: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen) return null;

  const isValidPhone = (p: string) => {
    const clean = p.replace(/[\s\-()]/g, '');
    return /^(\+91|91|0)?[6-9]\d{9}$/.test(clean);
  };

  const isValidEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  };

  const validateStep1 = () => {
    if (!teamName.trim()) return 'Please enter a Squad / Team Name';
    if (!leaderName.trim()) return 'Please enter the Team Leader Name';
    if (!isValidPhone(leaderPhone)) return 'Please enter a valid 10-digit Indian phone number for Team Leader';
    if (!isValidEmail(leaderEmail)) return 'Please enter a valid Team Leader Email Address';
    if (!institution.trim()) return 'Please enter your Institution / College Name';
    if (!problemStatement) return 'Please select a Problem Statement';
    return null;
  };

  const validateStep2 = () => {
    if (members.length < 1) return 'At least 1 team member is required (Total 2+ squad members)';
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) return `Please enter Member ${i + 1} Name`;
      if (!isValidPhone(members[i].phone)) return `Please enter a valid 10-digit phone number for Member ${i + 1}`;
    }
    return null;
  };

  const validateStep3 = () => {
    if (
      !declarations.accurateInfo ||
      !declarations.membersBelong ||
      !declarations.rulesAgreed ||
      !declarations.feeUnderstood ||
      !declarations.qualifierUnderstood
    ) {
      return 'Please accept all 5 declaration checkboxes to proceed';
    }
    return null;
  };

  const handleNext = () => {
    sound.playClick();
    setErrorMessage('');

    if (currentStep === 1) {
      const err = validateStep1();
      if (err) { setErrorMessage(err); return; }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) { setErrorMessage(err); return; }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const err = validateStep3();
      if (err) { setErrorMessage(err); return; }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    sound.playClick();
    setErrorMessage('');
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const addMember = () => {
    if (members.length >= 5) return;
    setMembers([...members, { name: '', phone: '', email: '', department: '', year: '3rd Year' }]);
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) return;
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  // Submit Registration and proceed to UPI Payment step
  const handleProceedToRegistration = async () => {
    sound.playClick();
    setIsProcessing(true);
    setErrorMessage('');

    const payload: TeamRegistrationPayload = {
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderPhone: leaderPhone.trim(),
      leaderEmail: leaderEmail.trim().toLowerCase(),
      institution: institution.trim(),
      department: department.trim(),
      year,
      problemStatement,
      members: members.map(m => ({
        name: m.name.trim(),
        phone: m.phone.trim(),
        email: m.email.trim(),
        department: m.department.trim(),
        year: m.year
      })),
      declarations
    };

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setRegisteredTeamData({
        teamId: data.team.teamId,
        accessToken: data.team.accessToken,
        teamName: data.team.teamName
      });

      setPayerName(leaderName.trim());
      setCurrentStep(5); // Proceed to Payment instructions & UTR submission

      if (onSuccessRegister) {
        onSuccessRegister({
          teamId: data.team.teamId,
          teamName: data.team.teamName,
          leaderName: data.team.leaderName,
          leaderEmail: data.team.leaderEmail,
          institution: data.team.institution,
          track: data.team.track,
          membersCount: data.team.membersCount,
          status: 'Round 1 Registered • Payment Pending',
          registrationDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration error occurred';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Payment UTR
  const handleSubmitPaymentUTR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredTeamData?.teamId) return;

    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid 12-digit UPI UTR / Transaction ID.');
      return;
    }

    sound.playClick();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/team/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: registeredTeamData.teamId,
          utrNumber: utrNumber.trim().toUpperCase(),
          payerName: (payerName || leaderName).trim(),
          amount: 100
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment details');
      }

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      sound.playSuccessCelebration();

      setCurrentStep(6); // Go to Final Dossier
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment submission failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, type: 'id' | 'pass') => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <GlassCard
          glowColor="cyan"
          className="p-6 sm:p-8 border border-[#38BDF8]/50 bg-[#07193D] shadow-[0_20px_60px_rgba(2,8,24,0.9)] rounded-none text-left"
          withHudCorners={true}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(212,233,255,0.12)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] shadow-sm">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono-hud text-[#38BDF8] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>ORION 1.0 MISSION SQUAD ENROLLMENT</span>
                  <span className="text-slate-400">• ₹100 Flat Fee</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                  SQUAD REGISTRATION PORTAL
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playModalClose();
                onClose();
              }}
              className="p-1.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] hover:border-[#38BDF8]/50 text-[#BAE6FD] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper HUD Indicator */}
          {currentStep < 6 && (
            <div className="mb-6 grid grid-cols-5 gap-1.5">
              {[
                { num: 1, label: 'LEADER' },
                { num: 2, label: 'MEMBERS' },
                { num: 3, label: 'TERMS' },
                { num: 4, label: 'REVIEW' },
                { num: 5, label: 'PAYMENT' }
              ].map((s) => (
                <div 
                  key={s.num}
                  className={`p-2 text-center border text-[10px] font-mono-hud transition-all ${
                    currentStep === s.num
                      ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-white font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                      : currentStep > s.num
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#040E24]/60 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="block text-[8px] opacity-75">STEP 0{s.num}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-none text-rose-200 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Validation Alert: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* STEP 1: Squad & Leader Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-mono-hud text-[#38BDF8] font-bold flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>SECTION 01: SQUAD IDENTITY & TEAM LEADER</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    SQUAD / TEAM NAME <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. CyberVanguard, NeuralKnights"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    TEAM LEADER FULL NAME <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    LEADER WHATSAPP PHONE <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    placeholder="10-digit mobile (e.g. 9876543210)"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    LEADER EMAIL ADDRESS <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="leader@college.edu or gmail.com"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    INSTITUTION / COLLEGE NAME <span className="text-[#38BDF8]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Sathyabama Institute of Science and Tech"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    DEPARTMENT / BRANCH
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CSE, IT, AI&DS, ECE"
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    ACADEMIC YEAR
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none cursor-pointer"
                  >
                    <option value="1st Year">1st Year Undergraduate</option>
                    <option value="2nd Year">2nd Year Undergraduate</option>
                    <option value="3rd Year">3rd Year Undergraduate</option>
                    <option value="4th Year">4th Year Undergraduate</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                    SELECT CHALLENGE TRACK / PROBLEM STATEMENT <span className="text-[#38BDF8]">*</span>
                  </label>
                  <select
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#040E24] border border-[#38BDF8]/40 text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none cursor-pointer"
                  >
                    {PROBLEM_STATEMENTS.map((ps) => (
                      <option key={ps.code} value={ps.code}>
                        {ps.code}: {ps.title} — ({ps.domain})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-glow-cyan px-6 py-2.5 font-display font-bold text-xs text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>NEXT: SQUAD MEMBERS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Members Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono-hud text-[#38BDF8] font-bold flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>SECTION 02: SQUAD MEMBERS ({members.length} Members + Leader)</span>
                </div>
                {members.length < 5 && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="px-2.5 py-1 text-[10px] font-mono-hud bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-colors"
                  >
                    + ADD MEMBER
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {members.map((member, idx) => (
                  <div key={idx} className="p-3.5 bg-[#040E24] border border-[rgba(212,233,255,0.1)] space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono-hud text-[#38BDF8] font-bold">
                        MEMBER 0{idx + 1}
                      </span>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(idx)}
                          className="text-[10px] font-mono text-rose-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono-hud text-slate-300 mb-0.5">
                          FULL NAME <span className="text-[#38BDF8]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={member.name}
                          onChange={(e) => updateMember(idx, 'name', e.target.value)}
                          placeholder={`Member ${idx + 1} Name`}
                          className="w-full px-3 py-2 bg-[#020817] border border-white/10 text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono-hud text-slate-300 mb-0.5">
                          PHONE NUMBER <span className="text-[#38BDF8]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={member.phone}
                          onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                          placeholder="10-digit mobile"
                          className="w-full px-3 py-2 bg-[#020817] border border-white/10 text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono-hud text-slate-300 mb-0.5">
                          EMAIL (OPTIONAL)
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateMember(idx, 'email', e.target.value)}
                          placeholder="member@email.com"
                          className="w-full px-3 py-2 bg-[#020817] border border-white/10 text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono-hud text-slate-300 mb-0.5">
                          DEPARTMENT (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          value={member.department}
                          onChange={(e) => updateMember(idx, 'department', e.target.value)}
                          placeholder="e.g. CSE / IT"
                          className="w-full px-3 py-2 bg-[#020817] border border-white/10 text-white text-xs font-mono-hud focus:border-[#38BDF8] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-white/15 text-slate-300 hover:text-white font-mono-hud text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-glow-cyan px-6 py-2.5 font-display font-bold text-xs text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>NEXT: DECLARATIONS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Declarations */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-mono-hud text-[#38BDF8] font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>SECTION 03: MISSION RULES & DECLARATIONS</span>
              </div>

              <div className="space-y-2.5 p-4 bg-[#040E24] border border-[rgba(212,233,255,0.1)] text-xs font-sans">
                {[
                  {
                    key: 'accurateInfo' as const,
                    label: 'Accurate Information: I declare that all squad member names, emails, contact numbers, and institutional affiliations provided are authentic and accurate.'
                  },
                  {
                    key: 'membersBelong' as const,
                    label: 'Team Integrity: All listed members belong to our registered squad and have given explicit consent for their enrollment in ORION 1.0.'
                  },
                  {
                    key: 'rulesAgreed' as const,
                    label: 'Hackathon Code of Conduct: We agree to abide by all ORION 1.0 code of conduct rules, academic integrity standards, and intellectual property requirements.'
                  },
                  {
                    key: 'feeUnderstood' as const,
                    label: 'Round 1 Fee Policy: We understand the ₹100 registration fee is non-refundable and covers full Round 1 online PPT evaluation by the expert technical panel.'
                  },
                  {
                    key: 'qualifierUnderstood' as const,
                    label: 'Offline Finale Qualification: We understand that only the Top 70 selected squads will advance to the 24-hour physical offline sprint at Sathyabama University, Chennai.'
                  }
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-start gap-3 p-2.5 border border-white/5 hover:border-[#38BDF8]/40 transition-colors bg-[#07193D]/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={declarations[item.key]}
                      onChange={(e) => setDeclarations({ ...declarations, [item.key]: e.target.checked })}
                      className="mt-0.5 accent-[#38BDF8] w-4 h-4 shrink-0 cursor-pointer"
                    />
                    <span className="text-slate-200 leading-relaxed text-[11px]">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-white/15 text-slate-300 hover:text-white font-mono-hud text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-glow-cyan px-6 py-2.5 font-display font-bold text-xs text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>NEXT: REVIEW DOSSIER</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review Summary */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-xs font-mono-hud text-[#38BDF8] font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>SECTION 04: DOSSIER REVIEW & CONFIRMATION</span>
              </div>

              <div className="p-4 bg-[#040E24] border border-[#38BDF8]/40 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">SQUAD NAME</span>
                    <strong className="text-white font-display text-sm">{teamName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">TRACK</span>
                    <strong className="text-[#38BDF8] font-mono">{problemStatement}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">FEE</span>
                    <strong className="text-emerald-400 font-mono">₹100 Flat</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">LEADER</span>
                    <div className="text-white">{leaderName} ({leaderPhone})</div>
                    <div className="text-slate-400 text-[11px]">{leaderEmail}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">INSTITUTION</span>
                    <div className="text-white">{institution}</div>
                    <div className="text-slate-400 text-[11px]">{department} • {year}</div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono-hud text-[#7DD3FC] block mb-1.5">
                    ENROLLED SQUAD MEMBERS ({members.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {members.map((m, idx) => (
                      <div key={idx} className="p-2 bg-[#020817] border border-white/5 text-[11px]">
                        <span className="text-[#38BDF8] font-mono mr-1.5">0{idx + 1}.</span>
                        <strong className="text-white">{m.name}</strong>
                        <span className="text-slate-400 ml-1">({m.phone})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-white/15 text-slate-300 hover:text-white font-mono-hud text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProceedToRegistration}
                  className="btn-glow-cyan px-7 py-3 font-display font-black text-xs sm:text-sm text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>GENERATING SQUAD ID...</span>
                  ) : (
                    <>
                      <span>PROCEED TO PAYMENT (₹100)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Official UPI Payment & UTR Submission */}
          {currentStep === 5 && registeredTeamData && (
            <div className="space-y-4">
              <div className="text-xs font-mono-hud text-emerald-400 font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>SECTION 05: OFFICIAL UPI PAYMENT & UTR SUBMISSION</span>
              </div>

              <div className="p-4 bg-[#040E24] border border-[#38BDF8]/40 space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0B2556] border border-[#38BDF8]/30">
                  <div>
                    <span className="text-[10px] font-mono-hud text-[#BAE6FD] block">REGISTERED SQUAD ID</span>
                    <strong className="text-white font-mono text-base">{registeredTeamData.teamId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono-hud text-emerald-300 block">FEE PAYABLE</span>
                    <strong className="text-emerald-400 font-mono text-lg">₹100</strong>
                  </div>
                </div>

                {/* UPI Instructions & QR Card */}
                <div className="p-4 bg-[#020817] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-white font-mono-hud text-xs font-bold">
                    <QrCode className="w-4 h-4 text-[#38BDF8]" />
                    <span>OFFICIAL UPI SCANNER & TRANSFER INSTRUCTIONS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* QR Code Frame */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-[#040E24] border border-[#38BDF8]/40 shadow-[0_0_20px_rgba(56,189,248,0.15)] relative">
                      <div className="w-full max-w-[170px] aspect-square bg-white p-2 rounded-sm relative flex items-center justify-center">
                        <img 
                          src="/orion_payment_qr.jpg" 
                          alt="Official Orion 1.0 Round 1 UPI QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-mono-hud text-[#38BDF8] mt-2 font-bold tracking-wider uppercase">
                        SCAN VIA ANY UPI APP
                      </span>
                    </div>

                    {/* Instructions & Copyable UPI */}
                    <div className="md:col-span-8 space-y-3">
                      <div className="p-3 bg-[#07193D] border border-dashed border-[#38BDF8]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">OFFICIAL UPI ID</span>
                          <strong className="text-white font-mono text-sm select-all">orion.sathyabama@upi</strong>
                          <div className="text-[10px] text-slate-300 mt-0.5">Payee: ORION 1.0 — Microsoft Club SIST</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('orion.sathyabama@upi', 'id')}
                          className="px-3 py-1.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] font-mono flex items-center gap-1.5 cursor-pointer hover:bg-[#0B2556]/80 transition-colors shrink-0"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId ? 'COPIED' : 'COPY UPI'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        1. Scan the QR code above or transfer flat <strong>₹100</strong> to <code>orion.sathyabama@upi</code> via GPay, PhonePe, Paytm, BHIM, or Cred.<br />
                        2. After payment, copy the <strong>12-digit UPI Reference / UTR Number</strong>.<br />
                        3. Enter the UTR and Payer Name below to lock your registration.
                      </p>
                    </div>
                  </div>
                </div>

                {/* UTR Submission Form */}
                <form onSubmit={handleSubmitPaymentUTR} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                        12-DIGIT UPI UTR / TRANSACTION ID <span className="text-[#38BDF8]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 423984920194"
                        className="w-full px-3.5 py-2.5 bg-[#020817] border border-[#38BDF8]/60 text-white text-xs font-mono-hud focus:outline-none uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-hud text-[#BAE6FD] mb-1">
                        PAYER NAME AS IN BANK ACCOUNT <span className="text-[#38BDF8]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="Name on UPI / Bank Account"
                        className="w-full px-3.5 py-2.5 bg-[#020817] border border-white/15 text-white text-xs font-mono-hud focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 font-display font-black text-xs sm:text-sm text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>VERIFYING UTR INTEGRITY...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#040E24]" />
                        <span>SUBMIT PAYMENT UTR REFERENCE</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 6: Final Confirmed Dossier */}
          {currentStep === 6 && registeredTeamData && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-400 rounded-none mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono-hud text-emerald-400 font-bold tracking-widest uppercase">
                  MISSION REGISTRATION CONFIRMED
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                  WELCOME ABOARD, {registeredTeamData.teamName.toUpperCase()}
                </h3>
                <p className="text-xs text-[#BAE6FD] max-w-md mx-auto mt-2">
                  Your squad has been enrolled for ORION 1.0. Your payment UTR has been logged for administrative verification.
                </p>
              </div>

              {/* Credentials Box */}
              <div className="p-5 bg-[#040E24] border border-[#38BDF8]/50 text-left space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[9px] font-mono-hud text-[#7DD3FC] block">IMMUTABLE TEAM ID</span>
                    <strong className="text-white font-mono text-lg font-bold">{registeredTeamData.teamId}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(registeredTeamData.teamId, 'id')}
                    className="px-3 py-1.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono-hud text-[#7DD3FC] block">TEAM ACCESS PASSCODE</span>
                    <strong className="text-amber-300 font-mono text-lg font-bold">{registeredTeamData.accessToken}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(registeredTeamData.accessToken, 'pass')}
                    className="px-3 py-1.5 bg-[#0B2556] border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPass ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-[#020817] border border-white/5 text-[10px] font-mono text-slate-300">
                  ⚠️ Save your Team ID and Passcode. You will use these to log in to the <strong>Team Portal</strong> to submit your Round 1 PPT and check Round 2 Selection.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/portal?teamId=${registeredTeamData.teamId}&token=${registeredTeamData.accessToken}`}
                  onClick={onClose}
                  className="btn-glow-cyan w-full sm:w-auto px-7 py-3 font-display font-black text-xs text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <span>LAUNCH TEAM PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 border border-white/20 text-slate-300 hover:text-white font-mono-hud text-xs cursor-pointer"
                >
                  CLOSE WINDOW
                </button>
              </div>
            </div>
          )}

        </GlassCard>
      </div>
    </div>
  );
};
