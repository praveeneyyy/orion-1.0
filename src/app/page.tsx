'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/common/Navbar';
import { ClickSpark } from '@/components/common/ClickSpark';
import { HeroSection } from '@/components/sections/HeroSection';
import { ChallengeArena } from '@/components/sections/ChallengeArena';
import { PrizeSection } from '@/components/sections/PrizeSection';
import { GuidelinesSection } from '@/components/sections/GuidelinesSection';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { VenuePerksSection } from '@/components/sections/VenuePerksSection';
import { OrganizersSection } from '@/components/sections/OrganizersSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalLaunchSection } from '@/components/sections/FinalLaunchSection';
import { Footer } from '@/components/sections/Footer';
import { RegisterModal } from '@/components/modals/RegisterModal';
import { TeamStatusModal } from '@/components/modals/TeamStatusModal';
import { ChallengeModal } from '@/components/modals/ChallengeModal';
import { INITIAL_REGISTERED_TEAMS } from '@/data/orionData';
import type { ProblemStatement, RegisteredTeam } from '@/types/orion';

// Dynamically import Three.js space background with SSR disabled
const SpaceBackground = dynamic(
  () => import('@/components/3d/SpaceBackground').then((mod) => mod.SpaceBackground),
  { ssr: false }
);

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);

  const [teams, setTeams] = useState<RegisteredTeam[]>(INITIAL_REGISTERED_TEAMS);
  const [registeredCount, setRegisteredCount] = useState<number>(0);

  const fetchLiveCount = () => {
    fetch('/api/registrations/count')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.registeredTeams === 'number') {
          setRegisteredCount(data.registeredTeams);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLiveCount();
  }, []);

  const handleRegisterSuccess = (newTeam: RegisteredTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
    setRegisteredCount((prev) => prev + 1);
  };

  const handleSelectTrackFromModal = () => {
    setIsRegisterOpen(true);
  };

  // Scroll to top and reset hash on page load/refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      // Force instant scroll to top on refresh
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

      // If reloaded with a hash (#challenges, etc.), reset URL to root
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  return (
    <ClickSpark sparkColor="#00BCF2" sparkSize={14} sparkRadius={26} sparkCount={10} duration={420}>
      <div className="relative min-h-screen bg-[#020617] text-slate-100 selection:bg-[#00BCF2]/30 selection:text-[#BAE6FD]">
        
        <SpaceBackground />

        <Navbar 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenStatus={() => setIsStatusOpen(true)}
        />

        <main className="relative z-10 flex flex-col">
          <HeroSection 
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenStatus={() => setIsStatusOpen(true)}
            onExplorePrizes={() => {
              document.getElementById('prizes')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <ChallengeArena 
            onOpenProblemModal={(prob) => setSelectedProblem(prob)}
          />
          <PrizeSection />
          <GuidelinesSection />
          <TimelineSection />
          <OrganizersSection />
          <FAQSection />
          <VenuePerksSection />
          <FinalLaunchSection 
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenStatus={() => setIsStatusOpen(true)}
          />
        </main>

        <Footer 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenStatus={() => setIsStatusOpen(true)}
        />

        <RegisterModal 
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSuccessRegister={handleRegisterSuccess}
          totalTeamsCount={registeredCount}
        />

        <TeamStatusModal 
          isOpen={isStatusOpen}
          onClose={() => setIsStatusOpen(false)}
          teams={teams}
        />

        <ChallengeModal 
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSelectTrack={handleSelectTrackFromModal}
        />
      </div>
    </ClickSpark>
  );
}
