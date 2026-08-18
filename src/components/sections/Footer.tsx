'use client';

import React from 'react';
import { 
  Compass, 
  ArrowUp, 
  MapPin, 
  Mail, 
  Terminal, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { EVENT_METRICS } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

interface FooterProps {
  onOpenRegister: () => void;
  onOpenStatus: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister, onOpenStatus }) => {
  const scrollToTop = () => {
    sound.playHover();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-[#040E24] border-t border-[rgba(212,233,255,0.14)] pt-16 pb-24 lg:pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-left">
          
          {/* Col 1: Brand & Organizer */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-display font-black text-base text-white tracking-wider">
                ORION 1.0
              </span>
            </div>
            <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed mb-4">
              National flagship 24-hour hackathon engineered by <strong className="text-white">Microsoft Club SIST</strong>, Sathyabama Institute of Science and Technology, Chennai.
            </p>
            <div className="text-[10px] font-mono-hud text-[#7DD3FC]">
              MISSION CODE: ORION-2026-SIST
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-xs font-mono-hud text-white font-bold tracking-widest uppercase mb-4">
              MISSION SECTORS
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#BAE6FD]">
              <li><a href="#challenges" className="hover:text-[#38BDF8] transition-colors">Challenge Arena (04 Tracks)</a></li>
              <li><a href="#prizes" className="hover:text-[#38BDF8] transition-colors">₹1,00,000 Prize Pool & Bounties</a></li>
              <li><a href="#phases" className="hover:text-[#38BDF8] transition-colors">Two-Tier Selection Protocol</a></li>
              <li><a href="#blueprint" className="hover:text-[#38BDF8] transition-colors">PPT Submission Blueprint</a></li>
              <li><a href="#hospitality" className="hover:text-[#38BDF8] transition-colors">Finalist Accommodation & Meals</a></li>
              <li><a href="#leadership" className="hover:text-[#38BDF8] transition-colors">Honorary Patrons & Leadership</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Commands */}
          <div>
            <h4 className="text-xs font-mono-hud text-white font-bold tracking-widest uppercase mb-4">
              COMMAND ACTIONS
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  sound.playLaunchWarp();
                  onOpenRegister();
                }}
                className="w-full py-2 px-3 rounded-none bg-[#0B2556] hover:bg-[#103374] border border-[#38BDF8]/40 text-xs font-mono-hud text-[#38BDF8] hover:text-white transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>ROUND 1 REGISTRATION</span>
                <span className="text-[10px] bg-[#38BDF8] text-[#040E24] px-1.5 py-0.2 font-bold">₹100</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenStatus();
                }}
                className="w-full py-2 px-3 rounded-none bg-[#07193D] hover:bg-[#0B2556] border border-[rgba(212,233,255,0.12)] text-xs font-mono-hud text-[#BAE6FD] hover:text-white transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>VERIFY SQUAD DOSSIER</span>
                <span className="text-[10px] text-[#7DD3FC]">LOOKUP</span>
              </button>
            </div>
          </div>

          {/* Col 4: Dispatch & Location */}
          <div>
            <h4 className="text-xs font-mono-hud text-white font-bold tracking-widest uppercase mb-4">
              MISSION CONTROL
            </h4>
            <div className="space-y-2 text-xs font-sans text-[#BAE6FD]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>Sathyabama Institute of Science and Technology, OMR, Chennai — 600119</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <a href="mailto:microsoftclub@sathyabama.ac.in" className="hover:text-[#38BDF8] transition-colors">
                  microsoftclub@sathyabama.ac.in
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(212,233,255,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-hud text-[#7DD3FC]">
          <div>
            © 2026 ORION 1.0 • Microsoft Club SIST. All aerospace rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>SIST CHENNAI</span>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#38BDF8] hover:text-white transition-colors cursor-pointer"
            >
              <span>RETURN TO TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
