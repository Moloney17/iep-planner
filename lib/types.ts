export const DISABILITY_CATEGORIES = [
  'Autism Spectrum Disorder',
  'Developmental Delay',
  'Speech or Language Impairment',
  'Intellectual Disability',
  'Emotional Behavioral Disorder',
  'Other Health Impairment',
  'Specific Learning Disability',
  'Multiple Disabilities',
  'Orthopedic Impairment',
  'Deaf or Hard of Hearing',
  'Visual Impairment Including Blindness',
  'Traumatic Brain Injury',
] as const;

export const GRADE_LEVELS = [
  'Early Intervention (Birth–3)',
  'Pre-K (Age 3)',
  'Pre-K (Age 4)',
  'Pre-K (Age 5)',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Transition (18–21)',
] as const;

export const DOMAIN_COLORS: Record<string, string> = {
  'Cognitive/Academic': 'bg-blue-100 text-blue-800 border-blue-200',
  'Communication/Language': 'bg-purple-100 text-purple-800 border-purple-200',
  'Social-Emotional': 'bg-green-100 text-green-800 border-green-200',
  'Adaptive/Self-Help': 'bg-orange-100 text-orange-800 border-orange-200',
  'Physical/Motor': 'bg-red-100 text-red-800 border-red-200',
};

export const DOMAIN_ICONS: Record<string, string> = {
  'Cognitive/Academic': '🧠',
  'Communication/Language': '💬',
  'Social-Emotional': '❤️',
  'Adaptive/Self-Help': '⭐',
  'Physical/Motor': '🏃',
};

export interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  grade: string;
  disabilityCategory: string;
  meetingDate: string;
  reviewDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  presentLevels: {
    cognitive: string;
    communication: string;
    socialEmotional: string;
    adaptive: string;
    physical: string;
  };
  strengths: string;
  concerns: string;
  familyPriorities: string;
  currentServices: string;
  environmentalFactors: string;
  generatedIEP?: GeneratedIEP;
  archived?: boolean;
  archivedAt?: string;
  iepHistory?: GeneratedIEP[];
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedIEP {
  plaafp: string;
  goals: IEPGoal[];
  services: IEPService[];
  accommodations: string[];
  assessmentAccommodations: string[];
  progressMonitoring: ProgressPlan[];
  lreStatement: string;
  generatedAt: string;
}

export interface IEPGoal {
  domain: string;
  goalStatement: string;
  benchmarks: string[];
  successCriteria: string;
  timeframe: string;
}

export interface IEPService {
  serviceType: string;
  frequency: string;
  duration: string;
  setting: string;
  provider: string;
}

export interface ProgressPlan {
  goalDomain: string;
  dataCollectionMethod: string;
  frequency: string;
  responsibleParty: string;
  reportingSchedule: string;
}


export type ProgressStatus = 'on_track' | 'emerging' | 'not_yet' | 'mastered';

export const PROGRESS_STATUS_LABELS: Record<ProgressStatus, string> = {
  on_track: 'On Track',
  emerging: 'Emerging',
  not_yet: 'Not Yet',
  mastered: '✅ Mastered',
};

export const PROGRESS_STATUS_COLORS: Record<ProgressStatus, string> = {
  on_track: 'bg-green-100 text-green-800 border-green-200',
  emerging: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  not_yet: 'bg-red-100 text-red-800 border-red-200',
  mastered: 'bg-blue-100 text-blue-800 border-blue-200',
};

export interface ProgressNote {
  id: string;
  studentId: string;
  goalDomain: string;
  goalStatement: string;
  date: string;
  currentPerformance: string;
  status: ProgressStatus;
  notes?: string;
  createdAt: string;
}

export interface ProgressReport {
  generatedAt: string;
  reportingPeriod: string;
  narratives: {
    goalDomain: string;
    goalStatement: string;
    summary: string;
    dataPoints: string[];
    currentStatus: ProgressStatus;
    recommendation: string;
  }[];
  overallSummary: string;
}

export const SPED_SYSTEMS = [
  { id: 'csv', label: 'Universal CSV (all systems)' },
  { id: 'frontline', label: 'Frontline Special Ed (Exceed)' },
  { id: 'iep_direct', label: 'IEP Direct' },
  { id: 'skyward', label: 'Skyward' },
  { id: 'powerschool', label: 'PowerSchool Special Programs' },
  { id: 'spedi', label: 'SPED-i' },
  { id: 'edio', label: 'Edio' },
] as const;
