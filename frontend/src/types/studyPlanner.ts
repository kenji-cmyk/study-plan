export interface Subject {
  id: number;
  code: string;
  name: string;
  weight: number; // JSON number
  active: boolean;
}

export interface CreateSubjectRequest {
  code: string;
  name: string;
  weight: number;
  active?: boolean;
}

export interface UpdateSubjectRequest {
  code: string;
  name: string;
  weight: number;
  active?: boolean;
}

export interface SubjectPage {
  content: Subject[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // zero-based current page
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DailySchedule {
  date: string; // e.g. "2026-09-01"
  slots: Subject[]; // ordered slot 1, slot 2, ...
}

export interface StudyPlan {
  month: number; // 1..12
  year: number;
  days: DailySchedule[]; // chronological
}

export interface CreateStudyPlanRequest {
  year: number;
  month: number;
  slotsPerDay: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  errors: FieldError[];
  status: number;
  requestURI: string;
  timestamp: string;
}

export interface ApiSettings {
  baseUrl: string;
  basicAuthUser: string;
  basicAuthPass: string;
}
