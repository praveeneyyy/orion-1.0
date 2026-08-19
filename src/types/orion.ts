export interface ProblemStatement {
  id: string;
  code: string;
  title: string;
  tagline: string;
  domain: string;
  accentColor: 'cyan' | 'violet' | 'emerald';
  visualTheme: string;
  overview: string;
  keyFeatures: string[];
  techStack: string[];
  deliverables: string[];
  datasetSources: string[];
  evaluationFocus: string[];
  classificationLevel: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Fees & Teams' | 'Submissions' | 'Finale & Logistics';
}

export interface PatronProfile {
  name: string;
  title: string;
  organization: string;
  roleType: 'Chief Patron' | 'Convenor' | 'Club Lead';
  initials: string;
  avatarColor: string;
  bio?: string;
}

export interface OfficeBearer {
  name: string;
  title: string;
  department: string;
  phone: string;
  initials: string;
  organization: string;
}

export interface TimelinePhase {
  number: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'active' | 'upcoming' | 'completed';
  highlights: string[];
}

export interface RegisteredTeam {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  institution: string;
  track: string;
  membersCount: number;
  status: 'Round 1 Pending Review' | 'Qualified - Top 70 Finalist' | 'Confirmed Finalist';
  registrationDate: string;
}

export interface StarNodeData {
  name: string;
  coords: [number, number, number];
  role: string;
  designation: string;
  distance: string;
  apparentMagnitude: string;
  size: number;
  color: string;
}

export interface MicrosoftTech {
  id: string;
  name: string;
  category: string;
  description: string;
  capabilities: string[];
  icon: string;
  badge: string;
  accent: string;
}

export interface JudgingCriterion {
  number: string;
  name: string;
  weight: number;
  weightLabel: string;
  description: string;
  keyFactors: string[];
  color: string;
}

