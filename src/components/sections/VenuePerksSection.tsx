'use client';

import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  ExternalLink, 
  Globe, 
  Coffee, 
  Utensils, 
  Moon, 
  Shirt, 
  Wifi, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { HOSPITALITY_SYSTEMS, EVENT_METRICS } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

export const VenuePerksSection: React.FC = () => {
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Coffee,
    Utensils,
    Moon,
    Shirt,
    Wifi,
    ShieldCheck
  };

  return (
    <section id="venue" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-sans font-semibold text-blue-400 mb-4 shadow-sm">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Venue Location & Finalist Perks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Venue & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Hospitality</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Hosted at SIST Chennai with all-inclusive accommodation, meals, high-speed connectivity, and swags for shortlisted finalists.
          </p>
        </ScrollReveal>

        {/* Top Split Layout: Google Map & Campus Transit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-stretch text-left mb-12">
          
          {/* Interactive Google Map Container */}
          <ScrollReveal direction="left" delay={150} duration={650} className="lg:col-span-7 h-full">
            <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl h-full flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-sans text-white font-bold">
                      EVENT LOCATION // CHENNAI CAMPUS
                    </span>
                  </div>
                  <span className="text-xs font-sans text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 font-bold">
                    VENUE CONFIRMED
                  </span>
                </div>

                <div className="w-full h-64 sm:h-72 relative overflow-hidden bg-slate-950 border border-slate-800 rounded-xl mb-4">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.516870024921!2d80.21800167576595!3d12.871804987434195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b7b68636b07%3A0xe5a3c2005a7be3d1!2sSathyabama%20Institute%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sathyabama Institute of Science and Technology Google Map"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-sans text-slate-400">
                <span>SIST Coordinates: 12.8718° N, 80.2206° E</span>
                <span className="text-blue-400 font-semibold">Free Hostel for Finalists</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Campus Transit Info */}
          <ScrollReveal direction="right" delay={200} duration={650} className="lg:col-span-5 h-full">
            <GlassCard glowColor="cyan" className="p-6 border border-slate-800 bg-slate-900/60 rounded-2xl h-full flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-sans text-white font-bold">CAMPUS INTEL & TRANSIT</span>
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-1">
                  Sathyabama Institute of Science and Technology
                </h3>

                <p className="text-xs font-sans text-blue-400 mb-4">
                  Jeppiaar Nagar, OMR, Chennai, Tamil Nadu 600119
                </p>

                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs font-sans text-slate-400 font-semibold mb-0.5">TRANSIT VIA AIR:</div>
                    <div className="text-xs text-white font-sans">Chennai Airport (MAA) ~ 22 km</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs font-sans text-slate-400 font-semibold mb-0.5">TRANSIT VIA RAIL:</div>
                    <div className="text-xs text-white font-sans">Chennai Central (MAS) / Tambaram ~ 25 km</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <a
                  href={EVENT_METRICS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="btn-glow-cyan w-full py-3 px-4 rounded-xl font-sans font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            </GlassCard>
          </ScrollReveal>

        </div>

        {/* Hospitality Amenities Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          {HOSPITALITY_SYSTEMS.slice(0, 4).map((amenity, idx) => {
            const Icon = iconMap[amenity.icon] || CheckCircle2;
            return (
              <GlassCard
                key={idx}
                glowColor="cyan"
                className="p-5 border border-slate-800 bg-slate-900/60 rounded-2xl shadow-md"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-display font-bold text-white">
                    {amenity.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {amenity.detail}
                </p>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
