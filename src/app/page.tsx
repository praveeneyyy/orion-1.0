'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/common/Navbar';
import { MissionHUD } from '@/components/common/MissionHUD';
import { ClickSpark } from '@/components/common/ClickSpark';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { PrizeSection } from '@/components/sections/PrizeSection';
import { PhasesSection } from '@/components/sections/PhasesSection';
import { ChallengeArena } from '@/components/sections/ChallengeArena';
import { SubmissionSection } from '@/components/sections/SubmissionSection';
import { HospitalitySection } from '@/components/sections/HospitalitySection';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { MissionCommandSection } from '@/components/sections/MissionCommandSection';
import { FinalLaunchSection } from '@/components/sections/FinalLaunchSection';
import { VenueSection } from '@/components/sections/VenueSection';
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

  return (
    <ClickSpark sparkColor="#38BDF8" sparkSize={14} sparkRadius={26} sparkCount={10} duration={420}>
      <div className="relative min-h-screen bg-[#040E24] text-slate-100 selection:bg-[#38BDF8]/30 selection:text-[#BAE6FD]">
        
        {/* Animated Aerospace Telemetry Loading Screen */}
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}

        <SpaceBackground />

        <Navbar 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenStatus={() => setIsStatusOpen(true)}
        />

        <MissionHUD />

        <main className="relative z-10 flex flex-col">
          <HeroSection 
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenStatus={() => setIsStatusOpen(true)}
            onExplorePrizes={() => {
              document.getElementById('prizes')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <StatsSection />
          <PrizeSection />
          <PhasesSection />
          <ChallengeArena 
            onOpenProblemModal={(prob) => setSelectedProblem(prob)}
          />
          <SubmissionSection />
          <HospitalitySection />
          <TimelineSection />
          <FAQSection />
          <LeadershipSection />
          <MissionCommandSection />
          <FinalLaunchSection 
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenStatus={() => setIsStatusOpen(true)}
          />
          <VenueSection />
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
