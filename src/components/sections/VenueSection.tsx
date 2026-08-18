'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Compass, ExternalLink, Globe } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ElectricBorder } from '../common/ElectricBorder';
import { EVENT_METRICS } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

// Dynamic 3D Earth Radar Viewport
const EarthRadar3D = dynamic(
  () => import('../3d/EarthRadar3D').then((mod) => mod.EarthRadar3D),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center font-mono-hud text-xs text-[#7DD3FC]">CALIBRATING EARTH RADAR TELEMETRY...</div> }
);

export const VenueSection: React.FC = () => {
  return (
    <section id="venue" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>MISSION ARENA // GEOSPATIAL TARGET</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            VENUE <span className="text-gradient-frost-azure">COORDINATES</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            The 24-hour offline Grand Finale will be hosted inside the state-of-the-art computing complex at SIST Chennai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-stretch text-left">
          
          {/* Left Column: 3D Earth Target Globe */}
          <div className="lg:col-span-7">
            <ElectricBorder
              color="#38BDF8"
              speed={0.6}
              chaos={0.06}
              thickness={1.5}
              className="w-full h-full"
            >
              <div className="p-6 bg-[#07193D]/95 backdrop-blur-xl border border-[rgba(212,233,255,0.16)] h-full flex flex-col justify-between rounded-none">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(212,233,255,0.12)]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#38BDF8]" />
                      <span className="text-xs font-mono-hud text-white font-bold">
                        GEOSPATIAL RADAR TELEMETRY // CHENNAI ORBIT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-hud text-[#38BDF8] bg-[#0B2556] px-2 py-0.5 border border-[#38BDF8]/40 rounded-none">
                      TARGET LOCKED
                    </span>
                  </div>

                  <div className="w-full h-64 sm:h-72 relative overflow-hidden bg-[#040E24] border border-[rgba(212,233,255,0.1)] rounded-none mb-4">
                    <EarthRadar3D />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono-hud text-[#7DD3FC]">
                  <span>SATHYABAMA RADAR FIX: 12.8718° N, 80.2206° E</span>
                  <span className="text-[#38BDF8]">FREE ON-CAMPUS HOSTEL FOR FINALISTS</span>
                </div>
              </div>
            </ElectricBorder>
          </div>

          {/* Right Column: Campus Details & Navigation */}
          <div className="lg:col-span-5">
            <GlassCard glowColor="cyan" className="p-6 sm:p-8 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none h-full flex flex-col justify-between" withHudCorners={true}>
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[rgba(212,233,255,0.12)]">
                  <Compass className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-mono-hud text-[#F8FAFC] font-bold">CAMPUS INTEL & TRANSIT</span>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Sathyabama Institute of Science and Technology
                </h3>

                <p className="text-xs font-mono-hud text-[#38BDF8] mb-4">
                  Jeppiaar Nagar, Rajiv Gandhi Salai (OMR), Chennai, Tamil Nadu 600119
                </p>

                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)]">
                    <div className="text-[10px] font-mono-hud text-[#7DD3FC]">TRANSIT VIA AIR:</div>
                    <div className="text-xs text-white font-sans">Chennai International Airport (MAA) ~ 22 km</div>
                  </div>
                  <div className="p-3 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)]">
                    <div className="text-[10px] font-mono-hud text-[#7DD3FC]">TRANSIT VIA RAIL:</div>
                    <div className="text-xs text-white font-sans">Chennai Central (MAS) / Tambaram ~ 25 km</div>
                  </div>
                  <div className="p-3 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)]">
                    <div className="text-[10px] font-mono-hud text-[#7DD3FC]">ARENA FACILITY:</div>
                    <div className="text-xs text-white font-sans">School of Computing Central Auditorium & LAN Labs</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(212,233,255,0.12)]">
                <a
                  href={EVENT_METRICS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="w-full py-3 px-4 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#040E24]" />
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#040E24]" />
                </a>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  );
};
