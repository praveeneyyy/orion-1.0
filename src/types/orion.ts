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

export type PaymentStatus = 
  | 'NOT_SUBMITTED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'RESUBMISSION_REQUIRED';

export type Round1Status = 
  | 'NOT_STARTED'
  | 'SUBMISSION_OPEN'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SELECTED'
  | 'NOT_SELECTED';

export type Round2Status = 
  | 'LOCKED'
  | 'ACCESS_GRANTED'
  | 'CONFIRMED_FINALIST';

export interface TeamMember {
  id?: string;
  team_id?: string;
  member_number: number;
  member_name: string;
  member_email?: string;
  member_phone: string;
  department?: string;
  year?: string;
}

export interface SuspicionFlag {
  id: string;
  team_id: string;
  flag_type: 'DUPLICATE_EMAIL' | 'DUPLICATE_PHONE' | 'DUPLICATE_UTR' | 'CROSS_TEAM_PARTICIPANT' | 'SUSPICIOUS_DATA';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  matched_value: string;
  matched_team_id?: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  team_id: string;
  utr_number: string;
  payer_name: string;
  amount: number;
  payment_status: PaymentStatus;
  notes?: string;
  rejection_reason?: string;
  submitted_at: string;
  verified_at?: string | null;
  verified_by?: string | null;
}

export interface SubmissionRecord {
  id: string;
  team_id: string;
  round_number: 1 | 2;
  file_url: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  version: number;
  submission_status: 'SUBMITTED' | 'UNDER_REVIEW' | 'EVALUATED';
  submitted_at: string;
  review_notes?: string;
}

export interface AuditLogRecord {
  id: string;
  team_id?: string | null;
  team_name?: string | null;
  action: string;
  actor: string;
  details?: string | null;
  created_at: string;
}

export interface TeamRecord {
  id: string;
  registration_id: string; // e.g. ORION-2026-0147
  team_name: string;
  leader_name: string;
  leader_phone: string;
  leader_email: string;
  institution: string;
  department?: string;
  year?: string;
  problem_statement: string;
  access_token: string; // Secure passcode for team portal
  payment_status: PaymentStatus;
  payment?: PaymentRecord | null;
  amount: number;
  registration_status: 'REGISTERED' | 'PENDING' | 'REJECTED';
  round_1_status: Round1Status;
  round_2_status: Round2Status;
  round_1_score?: number | null;
  admin_notes?: string | null;
  suspicion_flags?: SuspicionFlag[];
  members: TeamMember[];
  submissions?: SubmissionRecord[];
  audit_logs?: AuditLogRecord[];
  created_at: string;
  updated_at?: string;
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
  paymentStatus?: PaymentStatus | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  orderId?: string;
  round1Status?: Round1Status;
  round2Status?: Round2Status;
}

export interface TeamRegistrationPayload {
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  leaderEmail: string;
  institution: string;
  department?: string;
  year?: string;
  problemStatement: string;
  members: { 
    name: string; 
    email?: string; 
    phone: string; 
    department?: string; 
    year?: string; 
  }[];
  declarations?: {
    accurateInfo: boolean;
    membersBelong: boolean;
    rulesAgreed: boolean;
    feeUnderstood: boolean;
    qualifierUnderstood: boolean;
  };
}

export interface SystemConfig {
  registrationOpen: boolean;
  round1SubmissionDeadline: string; // ISO string
  allowRound1Resubmission: boolean;
  maxFileSizeMb: number;
  upiId: string;
  upiPayeeName: string;
  upiQrCodeUrl: string;
  round1FeeInr: number;
  finalistFeeInr: number;
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
