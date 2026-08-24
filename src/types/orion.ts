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
  roleType: 'Chief Patron' | 'Academic Patron' | 'Convenor' | 'Club Lead' | 'Event Organizer';
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

export type EventOrganizer = OfficeBearer;

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
  status: string;
  registrationDate: string;
  members?: TeamMember[];
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  orderId?: string;
}

export interface TeamMember {
  id?: string;
  team_id?: string;
  member_number: number;
  member_name: string;
  member_phone: string;
}

export interface TeamRecord {
  id: string;
  registration_id: string;
  team_name: string;
  leader_name: string;
  leader_phone: string;
  leader_email: string;
  institution: string;
  problem_statement: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  payment_id?: string | null;
  order_id?: string | null;
  amount: number;
  registration_status: 'REGISTERED' | 'PENDING' | 'REJECTED';
  created_at: string;
  members?: TeamMember[];
}

export interface TeamRegistrationPayload {
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  leaderEmail: string;
  institution: string;
  problemStatement: string;
  members: { name: string; phone: string }[];
  declarations: {
    accurateInfo: boolean;
    membersBelong: boolean;
    rulesAgreed: boolean;
    feeUnderstood: boolean;
    qualifierUnderstood: boolean;
  };
}

export interface PaymentVerificationPayload {
  orderId: string;
  paymentId: string;
  signature: string;
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

