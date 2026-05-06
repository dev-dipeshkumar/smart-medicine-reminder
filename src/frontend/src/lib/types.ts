// Backend-aligned types for MediRemind V23 (Vite + ICP)
// These match the ICP canister backend.d.ts shapes

export interface UserProfileData {
  name: string;
  age: bigint;
  gender: string;
  locality: string;
  photoUrl: string;
  lastUpdated: bigint;
}

export interface ReminderData {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  color: string;
  notes: string;
  isActive: boolean;
}

export interface DoseLogData {
  reminderId: string;
  status: string;
  timestamp: bigint;
  snoozeMinutes?: bigint;
}

export interface DoctorGuidanceData {
  id: string;
  doctorName: string;
  treatment: string;
  notes: string;
  date: string;
}

export interface CheckupReportData {
  id: string;
  visitDate: string;
  doctorName: string;
  notes: string;
}
