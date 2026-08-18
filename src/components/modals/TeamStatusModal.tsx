'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Users, 
  FileText,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { INITIAL_REGISTERED_TEAMS } from '../../data/orionData';
import type { RegisteredTeam } from '../../types/orion';
import { sound } from '../../audio/soundEffects';

interface TeamStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams?: RegisteredTeam[];
}

export const TeamStatusModal: React.FC<TeamStatusModalProps> = ({ isOpen, onClose, teams = INITIAL_REGISTERED_TEAMS }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<RegisteredTeam | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const cleanQuery = query.trim().toLowerCase();
    
    const found = teams.find(
      (t) =>
        t.teamId.toLowerCase() === cleanQuery ||
        t.teamName.toLowerCase().includes(cleanQuery) ||
        t.leaderEmail.toLowerCase() === cleanQuery
    );

    setResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <GlassCard
          glowColor="cyan"
          className="p-6 sm:p-8 border border-[rgba(212,233,255,0.16)] bg-[#07193D] shadow-2xl rounded-none text-left"
          withHudCorners={true}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(212,233,255,0.12)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8]">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">
                  SQUAD MISSION VERIFICATION
                </h3>
                <div className="text-xs font-mono-hud text-[#38BDF8]">
                  LOOKUP BY TEAM ID, NAME OR LEADER EMAIL
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

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. ORION-9012 or Aether Dynamics"
                className="flex-1 px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-white text-xs font-mono-hud focus:outline-none focus:border-[#38BDF8] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#040E24]" />
                <span>QUERY</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono-hud text-[#7DD3FC]">
              <span>SAMPLE IDS:</span>
              <button
                type="button"
                onClick={() => setQuery('ORION-9012')}
                className="text-[#38BDF8] hover:underline"
              >
                ORION-9012
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setQuery('ORION-8421')}
                className="text-[#38BDF8] hover:underline"
              >
                ORION-8421
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setQuery('ORION-6590')}
                className="text-[#38BDF8] hover:underline"
              >
                ORION-6590
              </button>
            </div>
          </form>

          {hasSearched && (
            <div>
              {result ? (
                <div className="p-5 rounded-none bg-[#040E24] border border-[#38BDF8]/40 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(212,233,255,0.1)]">
                    <div>
                      <span className="text-[10px] font-mono-hud text-[#7DD3FC]">TEAM DOSSIER</span>
                      <h4 className="text-lg font-display font-black text-white">
                        {result.teamName}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono-hud px-2.5 py-1 rounded-none font-bold ${
                      result.status.includes('Top 70')
                        ? 'bg-[#38BDF8] text-[#040E24]'
                        : 'bg-[#0B2556] text-[#BAE6FD] border border-[rgba(212,233,255,0.14)]'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">TEAM ID</span>
                      <span className="text-white font-mono-hud font-bold">{result.teamId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">SELECTED TRACK</span>
                      <span className="text-[#38BDF8] font-sans font-semibold">{result.track}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">SQUAD LEADER</span>
                      <span className="text-white font-sans">{result.leaderName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">CREW SIZE</span>
                      <span className="text-white font-mono-hud">{result.membersCount} Members</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] font-mono-hud text-[#7DD3FC] border-t border-[rgba(212,233,255,0.1)]">
                    INSTITUTE: {result.institution}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)] text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                  <div className="text-xs font-mono-hud text-white font-bold">
                    NO SQUAD RECORD FOUND
                  </div>
                  <p className="text-xs text-[#BAE6FD] font-sans">
                    No matching registration dossier for &ldquo;{query}&rdquo;. Check spelling or register your squadron today.
                  </p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
