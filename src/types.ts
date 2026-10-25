export type Language = 'es' | 'en';

export type PreferredTimeWindow = 'early_evening' | 'evening';

export interface ScheduleSlot {
  id: string;
  slotNumber: number;
  timeWindowId: PreferredTimeWindow;
  startTime: string;
  endTime: string;
  travelEndTime: string;
  labelEs: string;
  labelEn: string;
  isDec24Allowed: boolean;
}

export interface Booking {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email: string;
  dateKey: string;
  dateLabel: string;
  timeSlot: string;
  preferredTimeWindow?: PreferredTimeWindow;
  preferredExactSlotId?: string;
  zone: string;
  address: string;
  kidsInfo: string;
  notes?: string;
  packageId: string;
  packageName: string;
  price: number;
  createdAt: string;
  isExpress?: boolean;
  status: 'solicitud' | 'confirmada';
  assignedTime?: string;
  assignedSlot?: ScheduleSlot;
  routeOrder?: number;
}

export interface ZoneInfo {
  name: string;
  description: string;
  descriptionEn?: string;
  travelFee: number;
  slotsRemaining: number;
  highlightUrbanizations: string[];
  routeBlockEs?: string;
  routeBlockEn?: string;
}

export interface PackageTier {
  id: string;
  name: string;
  nameEn?: string;
  category: 'elfo' | 'santa-elfo';
  subtitle: string;
  subtitleEn?: string;
  dateInfo: string;
  dateInfoEn?: string;
  duration?: string;
  durationEn?: string;
  price: number;
  popular?: boolean;
  features: string[];
  featuresEn?: string[];
  cast: string;
  castEn?: string;
}

export interface FaqItem {
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

export interface TestimonialItem {
  quote: string;
  quoteEn: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  dateEn?: string;
}
