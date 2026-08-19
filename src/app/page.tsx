'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/common/Navbar';
import { ClickSpark } from '@/components/common/ClickSpark';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ChallengeArena } from '@/components/sections/ChallengeArena';
import { MicrosoftEcosystemSection } from '@/components/sections/MicrosoftEcosystemSection';
import { PhasesSection } from '@/components/sections/PhasesSection';
import { SubmissionSection } from '@/components/sections/SubmissionSection';
import { JudgingCriteriaSection } from '@/components/sections/JudgingCriteriaSection';
import { PrizeSection } from '@/components/sections/PrizeSection';
import { HospitalitySection } from '@/components/sections/HospitalitySection';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { MissionCommandSection } from '@/components/sections/MissionCommandSection';
import { VenueSection } from '@/components/sections/VenueSection';
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
  const [isLoading, setIsLoading] = useState(true);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);

  const [teams, setTeams] = useState<RegisteredTeam[]>(INITIAL_REGISTERED_TEAMS);

  const handleRegisterSuccess = (newTeam: RegisteredTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
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
        
        {/* Animated Aerospace Loading Screen */}
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}

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

          <StatsSection />
          <ChallengeArena 
            onOpenProblemModal={(prob) => setSelectedProblem(prob)}
          />
          <MicrosoftEcosystemSection />
          <PhasesSection />
          <SubmissionSection />
          <JudgingCriteriaSection />
          <PrizeSection />
          <HospitalitySection />
          <TimelineSection />
          <LeadershipSection />
          <MissionCommandSection />
          <VenueSection />
          <FAQSection />
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
