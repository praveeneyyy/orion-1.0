'use client';

import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  CheckCircle2, 
  ShieldAlert, 
  CreditCard, 
  Users, 
  FileText,
  Lock,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { PROBLEM_STATEMENTS, EVENT_METRICS } from '../../data/orionData';
import type { RegisteredTeam } from '../../types/orion';
import { sound } from '../../audio/soundEffects';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegister?: (newTeam: RegisteredTeam) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSuccessRegister }) => {
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('floatchat');
  const [memberCount, setMemberCount] = useState(4);
  const [submitted, setSubmitted] = useState(false);
  const [generatedTeamId, setGeneratedTeamId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLaunchWarp();
    const newId = `ORION-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTeamId(newId);
    setSubmitted(true);

    if (onSuccessRegister) {
      onSuccessRegister({
        teamId: newId,
        teamName,
        leaderName,
        leaderEmail,
        institution,
        track: selectedTrack,
        membersCount: memberCount,
        status: 'Round 1 Pending Review',
        registrationDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <GlassCard
          glowColor="cyan"
          className="p-6 sm:p-8 border border-[rgba(212,233,255,0.16)] bg-[#07193D] shadow-2xl rounded-none text-left"
          withHudCorners={true}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(212,233,255,0.12)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8]">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">
                  ROUND 1 SQUAD REGISTRATION
                </h3>
                <div className="text-xs font-mono-hud text-[#38BDF8]">
                  FLAT ₹100 TEAM LAUNCHPAD // 2–6 BUILDERS
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playModalClose();
                onClose();
              }}
              className="p-1.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] text-[#BAE6FD] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-none bg-[#040E24] border border-[#38BDF8] flex items-center justify-center text-[#38BDF8] mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono-hud text-[#38BDF8] font-bold">
                  SQUAD COMMISSIONED SUCCESSFULLY
                </span>
                <h4 className="text-2xl font-display font-black text-white mt-1">
                  WELCOME TO ORION 1.0, {teamName.toUpperCase()}!
                </h4>
              </div>

              <div className="p-4 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] max-w-sm mx-auto">
                <div className="text-[10px] font-mono-hud text-[#7DD3FC] mb-1">ASSIGNED MISSION DOSSIER ID</div>
                <div className="text-2xl font-mono-hud font-black text-[#38BDF8] tracking-widest">
                  {generatedTeamId}
                </div>
              </div>

              <p className="text-xs font-sans text-[#BAE6FD] max-w-md mx-auto leading-relaxed">
                Confirmation dispatch transmitted to <strong className="text-white">{leaderEmail}</strong>. Prepare your standardized PPT submission using the mandatory blueprint.
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  setSubmitted(false);
                }}
                className="px-8 py-3 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-md cursor-pointer"
              >
                RETURN TO MISSION DASHBOARD
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    SQUAD / TEAM NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Aether Dynamics"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    SQUAD LEADER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="e.g. Kavya Ramesh"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    LEADER EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="kavya@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    PHONE NUMBER (WHATSAPP) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    INSTITUTION / COLLEGE / ORG *
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. SIST Chennai"
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                    SQUAD MEMBER COUNT (2–6) *
                  </label>
                  <select
                    value={memberCount}
                    onChange={(e) => setMemberCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-mono-hud focus:outline-none focus:border-[#38BDF8] transition-colors"
                  >
                    {[2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Crew Members (Flat ₹100 Total)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                  SELECT CHALLENGE MISSION / TRACK *
                </label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-sans focus:outline-none focus:border-[#38BDF8] transition-colors"
                >
                  {PROBLEM_STATEMENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code}: {p.title} — {p.domain}
                    </option>
                  ))}
                  <option value="open">ORION-PS-04: Open Innovation Track (AI / Web3 / Systems / Robotics)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] flex items-center justify-between text-xs font-mono-hud">
                <span className="text-[#7DD3FC]">ROUND 1 REGISTRATION FEE:</span>
                <span className="text-white font-bold">{EVENT_METRICS.round1Fee} FLAT</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-[#040E24]" />
                  <span>PROCEED TO SQUAD CHECKOUT — ₹100</span>
                </button>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
