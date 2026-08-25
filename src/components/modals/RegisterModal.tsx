'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Rocket, 
  CheckCircle2, 
  ShieldAlert, 
  CreditCard, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Edit3, 
  Download, 
  MessageSquare, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Lock,
  Phone,
  Mail,
  Building,
  Layers,
  UserCheck
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { PROBLEM_STATEMENTS, EVENT_METRICS } from '../../data/orionData';
import type { RegisteredTeam, TeamRegistrationPayload } from '../../types/orion';
import { sound } from '../../audio/soundEffects';
import CountUp from '../common/CountUp';

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
  totalTeamsCount = 0,
  initialProblemStatement
}) => {
  // Step state (1: Info, 2: Members, 3: Declarations, 4: Review, 5: Payment, 6: Confirmed)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Section 1: Team & Leader
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [problemStatement, setProblemStatement] = useState('ORION-PS-01');

  // Section 2: 4 Team Members (Name + Phone)
  const [members, setMembers] = useState<[
    { name: string; phone: string },
    { name: string; phone: string },
    { name: string; phone: string },
    { name: string; phone: string }
  ]>([
    { name: '', phone: '' },
    { name: '', phone: '' },
    { name: '', phone: '' },
    { name: '', phone: '' }
  ]);

  // Section 3: Declarations
  const [declarations, setDeclarations] = useState({
    accurateInfo: false,
    membersBelong: false,
    rulesAgreed: false,
    feeUnderstood: false,
    qualifierUnderstood: false
  });

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedRegId, setGeneratedRegId] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedPaymentId, setConfirmedPaymentId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  // Set initial problem statement if provided
  useEffect(() => {
    if (initialProblemStatement) {
      const match = PROBLEM_STATEMENTS.find(p => p.id === initialProblemStatement || p.code === initialProblemStatement);
      if (match) {
        setProblemStatement(match.code);
      }
    }
  }, [initialProblemStatement]);

  if (!isOpen) return null;

  // Validation helper for Indian Phone Number
  const isValidPhone = (p: string) => {
    const clean = p.replace(/[\s\-()]/g, '');
    return /^(\+91|91|0)?[6-9]\d{9}$/.test(clean);
  };

  // Validation helper for Email
  const isValidEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!teamName.trim()) return 'Please enter a Squad / Team Name';
    if (!leaderName.trim()) return 'Please enter the Team Leader Name';
    if (!isValidPhone(leaderPhone)) return 'Please enter a valid 10-digit Indian WhatsApp Phone Number for Team Leader';
    if (!isValidEmail(leaderEmail)) return 'Please enter a valid Team Leader Email Address';
    if (!institution.trim()) return 'Please enter your Institution / College Name';
    if (!problemStatement) return 'Please select a Problem Statement';
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    for (let i = 0; i < 4; i++) {
      if (!members[i].name.trim()) return `Please enter Member ${i + 1} Name`;
      if (!isValidPhone(members[i].phone)) return `Please enter a valid 10-digit phone number for Member ${i + 1}`;
    }
    return null;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (
      !declarations.accurateInfo ||
      !declarations.membersBelong ||
      !declarations.rulesAgreed ||
      !declarations.feeUnderstood ||
      !declarations.qualifierUnderstood
    ) {
      return 'Please agree to all 5 declaration checkboxes to proceed';
    }
    return null;
  };

  const handleNext = () => {
    sound.playClick();
    setErrorMessage('');

    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const err = validateStep3();
      if (err) {
        setErrorMessage(err);
        return;
      }
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

  // Update member field
  const updateMember = (index: number, field: 'name' | 'phone', value: string) => {
    const updated = [...members] as typeof members;
    updated[index][field] = value;
    setMembers(updated);
  };

  // Section 5: Initiate Payment Checkout
  const handleProceedToPayment = async () => {
    sound.playClick();
    setIsProcessing(true);
    setErrorMessage('');
    setCurrentStep(5);

    const payload: TeamRegistrationPayload = {
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderPhone: leaderPhone.trim(),
      leaderEmail: leaderEmail.trim().toLowerCase(),
      institution: institution.trim(),
      problemStatement,
      members,
      declarations
    };

    try {
      // 1. Create Razorpay Order Server-Side
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize order');
      }

      setGeneratedRegId(orderData.registrationId);
      setConfirmedOrderId(orderData.orderId);
      setIsSandboxMode(orderData.isSandbox);

      // 2. Check if Razorpay Checkout script can be opened
      const hasRzpKey = orderData.keyId && orderData.keyId.startsWith('rzp_') && !orderData.isSandbox;

      if (hasRzpKey && typeof window !== 'undefined') {
        // Load Razorpay Script dynamically if needed
        const loadScript = (src: string) => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (res && (window as unknown as { Razorpay: any }).Razorpay) {
          const Razorpay = (window as unknown as { Razorpay: any }).Razorpay;
          const options = {
            key: orderData.keyId,
            amount: 10000, // ₹100
            currency: 'INR',
            name: 'ORION 1.0 — SIST Hackathon',
            description: `Round 1 Squad Registration (${orderData.registrationId})`,
            image: '/logo.png',
            order_id: orderData.orderId,
            handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
              await verifyPaymentServer(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                orderData.registrationId,
                false
              );
            },
            prefill: {
              name: leaderName,
              email: leaderEmail,
              contact: leaderPhone
            },
            theme: {
              color: '#00BCF2'
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
                setCurrentStep(4);
              }
            }
          };

          const rzpInstance = new Razorpay(options);
          rzpInstance.open();
          return;
        }
      }

      // If Razorpay live credentials not configured or script unavailable, use Sandbox Simulator
      setIsProcessing(false);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error starting payment';
      setErrorMessage(msg);
      setIsProcessing(false);
      setCurrentStep(4);
    }
  };

  // Complete Payment Verification
  const verifyPaymentServer = async (
    orderId: string, 
    paymentId: string, 
    signature: string, 
    registrationId: string,
    isSandbox: boolean
  ) => {
    setIsProcessing(true);
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          registrationId,
          isSandbox
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      setConfirmedPaymentId(verifyData.receipt?.paymentId || paymentId);
      sound.playSuccessFanfare();
      setCurrentStep(6);

      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#00BCF2', '#5227FF', '#FFFFFF', '#38BDF8', '#34D399']
        });
      } catch {
        // Confetti fallback
      }

      if (onSuccessRegister) {
        onSuccessRegister({
          teamId: registrationId,
          teamName,
          leaderName,
          leaderEmail,
          institution,
          track: problemStatement,
          membersCount: 5,
          status: 'Round 1 Pending Review',
          registrationDate: new Date().toISOString().split('T')[0],
          paymentStatus: 'SUCCESS',
          paymentId,
          orderId
        });
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Copy ID
  const handleCopyId = () => {
    sound.playClick();
    navigator.clipboard.writeText(generatedRegId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Download printable styled receipt
  const handleDownloadReceipt = () => {
    sound.playClick();
    const receiptContent = `
================================================================
                    ORION 1.0 — ROUND 1 RECEIPT
          24-Hour National Hackathon • Microsoft Club SIST
================================================================
REGISTRATION ID   : ${generatedRegId}
TEAM NAME         : ${teamName}
PROBLEM STATEMENT : ${problemStatement}
TEAM LEADER       : ${leaderName} (${leaderPhone})
EMAIL             : ${leaderEmail}
INSTITUTION       : ${institution}
TOTAL SQUAD SIZE  : 5 Participants (1 Leader + 4 Members)
----------------------------------------------------------------
TEAM MEMBERS:
  1. ${members[0].name} — ${members[0].phone}
  2. ${members[1].name} — ${members[1].phone}
  3. ${members[2].name} — ${members[2].phone}
  4. ${members[3].name} — ${members[3].phone}
----------------------------------------------------------------
TRANSACTION DETAILS:
  ENTRY FEE       : ₹100 FLAT PER TEAM
  PAYMENT STATUS  : SUCCESS ✓
  ORDER ID        : ${confirmedOrderId}
  PAYMENT ID      : ${confirmedPaymentId}
  TIMESTAMP       : ${new Date().toLocaleString('en-IN')}
================================================================
NEXT STEPS:
1. Join the Official WhatsApp Dossier Group: ${process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/orion1point0'}
2. Download the Standardized 5-Slide PPT Blueprint from the portal.
3. Submit before Round 1 Deadline: Sep 08, 2026.
================================================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ORION_${generatedRegId}_Receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stepsList = [
    { num: 1, label: 'TEAM INFO' },
    { num: 2, label: 'MEMBERS' },
    { num: 3, label: 'DECLARATION' },
    { num: 4, label: 'REVIEW' },
    { num: 5, label: 'PAYMENT' },
    { num: 6, label: 'CONFIRMED' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <GlassCard
          glowColor="cyan"
          className="p-5 sm:p-8 border border-[#00BCF2]/40 bg-[#07193D] shadow-[0_20px_60px_rgba(2,8,24,0.95)] rounded-none text-left relative"
          withHudCorners={true}
        >
          {/* Header Title Lockup */}
          <div className="flex items-start justify-between pb-4 mb-5 border-b border-[rgba(212,233,255,0.12)]">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#0B2556] border border-[#00BCF2]/40 text-[#00BCF2] shadow-sm shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono-hud text-[#00BCF2] flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <span>ORION 1.0 • 24H NATIONAL HACKATHON</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-display font-black text-white">
                  ROUND 1 SQUAD REGISTRATION
                </h3>
                <p className="text-[11px] font-mono-hud text-[#BAE6FD] mt-0.5">
                  ONLINE QUALIFIER • <strong className="text-white">FLAT ₹100 PER TEAM</strong> (5 PARTICIPANTS)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playModalClose();
                onClose();
              }}
              className="p-1.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] hover:border-[#00BCF2]/60 text-[#BAE6FD] hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Multi-Step Progress Indicator */}
          {currentStep < 6 && (
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {stepsList.slice(0, 5).map((s) => {
                  const isActive = currentStep === s.num;
                  const isPassed = currentStep > s.num;
                  return (
                    <div 
                      key={s.num}
                      className={`p-2 border text-center transition-all ${
                        isActive 
                          ? 'bg-[#00BCF2]/15 border-[#00BCF2] text-white shadow-[0_0_10px_rgba(0,188,242,0.3)]' 
                          : isPassed 
                            ? 'bg-[#040E24] border-emerald-500/50 text-emerald-400' 
                            : 'bg-[#040E24]/60 border-white/10 text-slate-500'
                      }`}
                    >
                      <div className="text-[9px] font-mono-hud font-bold">
                        {isPassed ? '✓' : `0${s.num}`}
                      </div>
                      <div className="text-[10px] font-mono-hud font-bold truncate">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-950/70 border border-red-500/60 text-red-200 text-xs font-mono-hud flex items-center gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: TEAM INFORMATION */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono-hud font-bold text-[#00BCF2] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  SECTION 1 — TEAM & LEADER INFORMATION
                </span>
                <span className="text-[10px] font-mono-hud text-slate-400">
                  Fixed Structure: 1 Leader + 4 Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    TEAM NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Aether Dynamics"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#00BCF2] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    TEAM LEADER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="e.g. Kavya Ramesh"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#00BCF2] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    LEADER WHATSAPP PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-mono-hud focus:outline-none focus:border-[#00BCF2] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    LEADER EMAIL ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="kavya@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#00BCF2] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                  INSTITUTION / COLLEGE NAME *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Sathyabama Institute of Science and Technology"
                  className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#00BCF2] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                  PROBLEM STATEMENT NUMBER *
                </label>
                <select
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-none bg-[#071426] border border-[#00BCF2]/40 text-white text-xs font-mono-hud focus:outline-none focus:border-[#22D3EE] transition-colors"
                >
                  <option value="ORION-PS-01">ORION-PS-01: FloatChat (Oceanic Telemetry AI)</option>
                  <option value="ORION-PS-02">ORION-PS-02: LexVault (Zero-Knowledge Legal Tech)</option>
                  <option value="ORION-PS-03">ORION-PS-03: SylvaSense (Ecological Acoustic Edge)</option>
                  <option value="ORION-PS-04">ORION-PS-04: Open Innovation Track</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-sheen btn-glow-cyan py-3 px-6 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>CONTINUE TO TEAM MEMBERS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: TEAM MEMBERS (4 PARTICIPANTS) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono-hud font-bold text-[#00BCF2] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  SECTION 2 — 4 TEAM MEMBERS (LEADER EXCLUDED)
                </span>
                <span className="text-[10px] font-mono-hud text-emerald-400">
                  Total Team Size: 5
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                Please enter the Name and Phone Number for each of the 4 team members. (Do not repeat the team leader).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="p-3.5 bg-[#040E24] border border-[rgba(212,233,255,0.12)]">
                    <div className="text-[10px] font-mono-hud text-[#00BCF2] font-bold mb-2">
                      TEAM MEMBER 0{idx + 1}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-mono-hud text-slate-400 block mb-0.5">
                          MEMBER {idx + 1} NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={members[idx].name}
                          onChange={(e) => updateMember(idx, 'name', e.target.value)}
                          placeholder={`e.g. Member ${idx + 1} Full Name`}
                          className="w-full px-3 py-1.5 rounded-none bg-[#071426] border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-[#00BCF2]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono-hud text-slate-400 block mb-0.5">
                          MEMBER {idx + 1} PHONE NUMBER *
                        </label>
                        <input
                          type="tel"
                          required
                          value={members[idx].phone}
                          onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-1.5 rounded-none bg-[#071426] border border-white/10 text-white text-xs font-mono-hud focus:outline-none focus:border-[#00BCF2]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 bg-[#040E24] border border-white/15 text-slate-300 text-xs font-mono-hud hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-sheen btn-glow-cyan py-3 px-6 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>CONTINUE TO DECLARATION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: DECLARATION AND CONSENT */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono-hud font-bold text-[#00BCF2] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  SECTION 3 — DECLARATION & CONSENT
                </span>
                <span className="text-[10px] font-mono-hud text-amber-400">
                  All 5 Checkboxes Required
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                Please review and accept all mandatory declarations before reviewing your squad submission:
              </p>

              <div className="space-y-3 bg-[#040E24] p-4 border border-[rgba(212,233,255,0.12)]">
                {[
                  { key: 'accurateInfo', text: 'I confirm that all the information provided above is accurate.' },
                  { key: 'membersBelong', text: 'I confirm that all the listed members belong to this team.' },
                  { key: 'rulesAgreed', text: 'I agree to follow the ORION 1.0 Round 1 rules and guidelines.' },
                  { key: 'feeUnderstood', text: 'I understand that the ₹100 registration fee is a team entry fee.' },
                  { key: 'qualifierUnderstood', text: 'I understand that Round 1 registration does not automatically guarantee selection for the 24-hour hackathon.' }
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-start gap-3 cursor-pointer select-none group p-2 hover:bg-[#071426] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={declarations[item.key as keyof typeof declarations]}
                      onChange={(e) => setDeclarations({
                        ...declarations,
                        [item.key]: e.target.checked
                      })}
                      className="mt-0.5 w-4 h-4 rounded-none accent-[#00BCF2] cursor-pointer shrink-0"
                    />
                    <span className="text-xs font-sans text-slate-200 group-hover:text-white leading-relaxed">
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 bg-[#040E24] border border-white/15 text-slate-300 text-xs font-mono-hud hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-sheen btn-glow-cyan py-3 px-6 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>REVIEW BEFORE PAYMENT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: REVIEW BEFORE PAYMENT */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono-hud font-bold text-[#00BCF2] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SECTION 4 — REVIEW BEFORE PAYMENT
                </span>
                <span className="text-[10px] font-mono-hud text-emerald-400">
                  Ready for Checkout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team & Leader Summary */}
                <div className="p-4 bg-[#040E24] border border-[rgba(212,233,255,0.14)] space-y-2">
                  <div className="text-[10px] font-mono-hud text-[#00BCF2] font-bold border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>TEAM & LEADER SUMMARY</span>
                    <button 
                      onClick={() => setCurrentStep(1)} 
                      className="text-[9px] text-[#BAE6FD] hover:text-white flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> EDIT
                    </button>
                  </div>
                  <div className="text-xs font-sans space-y-1">
                    <div><span className="text-slate-400">Team Name:</span> <strong className="text-white">{teamName}</strong></div>
                    <div><span className="text-slate-400">Team Leader:</span> <strong className="text-white">{leaderName}</strong></div>
                    <div><span className="text-slate-400">Leader Phone:</span> <span className="font-mono-hud text-[#BAE6FD]">{leaderPhone}</span></div>
                    <div><span className="text-slate-400">Leader Email:</span> <span className="text-white">{leaderEmail}</span></div>
                    <div><span className="text-slate-400">Institution:</span> <span className="text-slate-200">{institution}</span></div>
                    <div><span className="text-slate-400">Track:</span> <span className="font-mono-hud font-bold text-[#00BCF2]">{problemStatement}</span></div>
                  </div>
                </div>

                {/* 4 Team Members Summary */}
                <div className="p-4 bg-[#040E24] border border-[rgba(212,233,255,0.14)] space-y-2">
                  <div className="text-[10px] font-mono-hud text-[#00BCF2] font-bold border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>TEAM MEMBERS (4)</span>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="text-[9px] text-[#BAE6FD] hover:text-white flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> EDIT
                    </button>
                  </div>
                  <div className="text-xs font-sans space-y-1.5">
                    {members.map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1">
                        <span className="text-white font-medium">0{i + 1}. {m.name}</span>
                        <span className="font-mono-hud text-[#BAE6FD]">{m.phone}</span>
                      </div>
                    ))}
                    <div className="pt-1 text-[10px] font-mono-hud text-slate-400 text-right">
                      Total Squad Size: <strong className="text-white">5 Participants</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-gradient-to-r from-[#0B2556] to-[#040E24] border border-[#00BCF2]/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono-hud text-[#00BCF2] font-bold">ROUND 1 ENTRY FEE</div>
                  <div className="text-xs font-sans text-slate-300">Single transaction for full 5-member team</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono-hud font-black text-white">₹100</div>
                  <div className="text-[9px] font-mono-hud text-emerald-400 font-bold">FLAT PER TEAM</div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 bg-[#040E24] border border-white/15 text-slate-300 text-xs font-mono-hud hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>EDIT DETAILS</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="btn-sheen btn-glow-cyan py-3.5 px-8 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-[#040E24]" />
                  <span>PROCEED TO CHECKOUT — ₹100</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: PAYMENT GATEWAY (SANDBOX / SIMULATION FALLBACK) */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-5 text-center py-6 animate-in fade-in">
              <div className="p-3 bg-[#0B2556] border border-[#00BCF2]/40 inline-flex items-center justify-center text-[#00BCF2] shadow-md">
                <CreditCard className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h4 className="text-xl font-display font-black text-white">
                  {isProcessing ? 'COMMUNICATING WITH RAZORPAY GATEWAY...' : 'ORION 1.0 CHECKOUT GATEWAY'}
                </h4>
                <p className="text-xs font-mono-hud text-slate-400 mt-1">
                  ORDER ID: <span className="text-[#00BCF2]">{confirmedOrderId}</span> • TOTAL: ₹100 FLAT
                </p>
              </div>

              {isSandboxMode && (
                <div className="p-4 bg-[#040E24] border border-[#00BCF2]/40 max-w-md mx-auto text-left space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-hud text-amber-400 font-bold border-b border-white/10 pb-1">
                    <span>SANDBOX SIMULATION MODE</span>
                    <span>FLAT ₹100</span>
                  </div>
                  <p className="text-xs font-sans text-slate-300">
                    Live Razorpay keys are not yet added in <code className="text-[#00BCF2]">.env.local</code>. You can simulate the transaction flow to test server-side database insertion and registration receipt generation:
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => verifyPaymentServer(confirmedOrderId, `pay_sim_${Date.now()}`, 'sim_signature', generatedRegId, true)}
                      disabled={isProcessing}
                      className="btn-sheen btn-glow-cyan flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-[#040E24] font-mono-hud font-bold text-xs text-center cursor-pointer hover:opacity-95 active:scale-95"
                    >
                      {isProcessing ? 'VERIFYING...' : '✓ SIMULATE SUCCESSFUL PAYMENT'}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(4);
                        setErrorMessage('Payment cancelled or rejected.');
                      }}
                      className="py-2.5 px-4 bg-[#071426] border border-red-500/40 text-red-300 font-mono-hud text-xs cursor-pointer hover:bg-red-950/40"
                    >
                      SIMULATE FAILURE
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: REGISTRATION CONFIRMED */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-none bg-[#040E24] border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono-hud text-emerald-400 font-bold tracking-widest uppercase">
                  [STATUS: SQUAD_COMMISSIONED_NOMINAL]
                </span>
                <h4 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                  REGISTRATION SUCCESSFUL
                </h4>
                <p className="text-xs font-sans text-slate-300 mt-1">
                  Welcome to ORION 1.0, <strong className="text-white">{teamName.toUpperCase()}</strong>!
                </p>
              </div>

              {/* Dossier ID Badge */}
              <div className="p-4 rounded-none bg-[#040E24] border border-[#00BCF2]/50 max-w-sm mx-auto shadow-xl relative">
                <span className="absolute top-1 left-2 font-mono-hud text-[7px] text-[#00BCF2]/50">[SECURITY_HASH: OK]</span>
                <div className="text-[10px] font-mono-hud text-[#7DD3FC] mb-1">ASSIGNED MISSION REGISTRATION ID</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-mono-hud font-black text-[#00BCF2] tracking-widest">
                    {generatedRegId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1.5 rounded-none bg-[#0B2556] border border-[#00BCF2]/40 text-[#BAE6FD] hover:text-white hover:border-[#00BCF2] transition-colors cursor-pointer"
                    title="Copy Registration ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#00BCF2]" />}
                  </button>
                </div>
              </div>

              {/* Confirmed Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto text-left text-xs font-sans">
                <div className="p-2.5 bg-[#040E24] border border-white/10">
                  <span className="text-[9px] font-mono-hud text-slate-400 block">TEAM LEADER</span>
                  <strong className="text-white truncate block">{leaderName}</strong>
                </div>
                <div className="p-2.5 bg-[#040E24] border border-white/10">
                  <span className="text-[9px] font-mono-hud text-slate-400 block">TRACK</span>
                  <strong className="text-[#00BCF2] font-mono-hud block">{problemStatement}</strong>
                </div>
                <div className="p-2.5 bg-[#040E24] border border-white/10">
                  <span className="text-[9px] font-mono-hud text-slate-400 block">TEAM SIZE</span>
                  <strong className="text-white block">5 Participants</strong>
                </div>
                <div className="p-2.5 bg-[#040E24] border border-white/10">
                  <span className="text-[9px] font-mono-hud text-slate-400 block">PAYMENT</span>
                  <strong className="text-emerald-400 font-mono-hud block">₹100 ✓ PAID</strong>
                </div>
              </div>

              {/* Live CountUp Badge */}
              <div className="p-3 bg-[#040E24] border border-[#00BCF2]/30 max-w-sm mx-auto flex items-center justify-between shadow-md">
                <div className="text-left">
                  <div className="text-[9px] font-mono-hud text-[#7DD3FC]">CONFIRMED REGISTERED SQUAD #</div>
                  <div className="text-xl font-mono-hud font-black text-white flex items-center gap-1">
                    <span className="text-[#00BCF2]">#</span>
                    <CountUp to={totalTeamsCount > 0 ? totalTeamsCount : 1} from={0} duration={1.5} separator="," />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-mono-hud text-slate-400">ROUND 1 QUALIFIER</div>
                  <div className="text-xs font-mono-hud font-bold text-emerald-400">ACTIVE</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/orion1point0'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-hud text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>JOIN WHATSAPP GROUP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleDownloadReceipt}
                  className="w-full sm:w-auto py-2.5 px-5 bg-[#0B2556] border border-[#00BCF2]/50 text-white hover:bg-[#00BCF2]/20 font-mono-hud text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#00BCF2]" />
                  <span>DOWNLOAD RECEIPT</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 bg-[#040E24] border border-white/20 text-slate-300 hover:text-white font-mono-hud text-xs font-bold transition-colors cursor-pointer"
                >
                  RETURN TO DASHBOARD
                </button>
              </div>
            </div>
          )}

        </GlassCard>
      </div>
    </div>
  );
};
