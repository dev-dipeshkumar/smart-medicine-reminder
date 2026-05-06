import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface DoseLog {
    status: DoseStatus;
    snoozeMinutes?: bigint;
    reminderId: string;
    timestamp: bigint;
}
export interface CheckupReport {
    id: string;
    visitDate: string;
    notes: string;
    doctorName: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface DoctorGuidance {
    id: string;
    date: string;
    treatment: string;
    notes: string;
    doctorName: string;
}
export interface DayStats {
    missedDoses: bigint;
    date: string;
    takenDoses: bigint;
    snoozedDoses: bigint;
    totalDoses: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface MedicineReminder {
    id: string;
    times: Array<string>;
    dosage: string;
    name: string;
    color: string;
    isActive: boolean;
    notes: string;
    frequency: Frequency;
}
export interface ReminderDayStats {
    missedDoses: bigint;
    reminderId: string;
    reminderName: string;
    adherenceRate: number;
    takenDoses: bigint;
    snoozedDoses: bigint;
    totalDoses: bigint;
}
export interface UserProfile {
    age: bigint;
    name: string;
    lastUpdated: bigint;
    photoUrl: string;
    gender: string;
    locality: string;
}
export enum DoseStatus {
    taken = "taken",
    missed = "missed",
    snoozed = "snoozed"
}
export enum Frequency {
    twiceDaily = "twiceDaily",
    daily = "daily",
    asNeeded = "asNeeded",
    weekly = "weekly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCheckupReport(report: CheckupReport): Promise<void>;
    addDoctorGuidance(guidance: DoctorGuidance): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReminder(reminder: MedicineReminder): Promise<void>;
    deleteCheckupReport(reportId: string): Promise<void>;
    deleteDoctorGuidance(guidanceId: string): Promise<void>;
    deleteReminder(reminderId: string): Promise<void>;
    getAllCheckupReports(): Promise<Array<CheckupReport>>;
    getAllDayLogs(dayStartNS: bigint): Promise<Array<DoseLog>>;
    getAllDayLogsRange(startTimeNS: bigint, endTimeNS: bigint): Promise<Array<DoseLog>>;
    getAllDoctorGuidance(): Promise<Array<DoctorGuidance>>;
    getAllLogs(): Promise<Array<DoseLog>>;
    getAllReminderDayStats(dayStartNS: bigint): Promise<Array<ReminderDayStats>>;
    getAllReminderDayStatsRange(startTimeNS: bigint, endTimeNS: bigint): Promise<Array<ReminderDayStats>>;
    getAllReminderLogs(reminderId: string): Promise<Array<DoseLog>>;
    getAllReminders(): Promise<Array<MedicineReminder>>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentStreak(): Promise<bigint>;
    getDayStats(dayStartNS: bigint): Promise<DayStats>;
    getDayStatsRange(startTimeNS: bigint, endTimeNS: bigint): Promise<DayStats>;
    getMedicineInfo(searchQuery: string): Promise<string>;
    getPastNDayStats(nDays: bigint): Promise<Array<[bigint, DayStats]>>;
    getProfile(): Promise<UserProfile | null>;
    getReminder(reminderId: string): Promise<MedicineReminder>;
    getReminderDayLogs(reminderId: string, dayStartNS: bigint): Promise<Array<DoseLog>>;
    getReminderDayLogsRange(reminderId: string, startTimeNS: bigint, endTimeNS: bigint): Promise<Array<DoseLog>>;
    getReminderDayStats(reminderId: string, dayStartNS: bigint): Promise<ReminderDayStats>;
    getReminderDayStatsRange(reminderId: string, startTimeNS: bigint, endTimeNS: bigint): Promise<ReminderDayStats>;
    isCallerAdmin(): Promise<boolean>;
    logDose(doseLog: DoseLog): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCheckupReport(report: CheckupReport): Promise<void>;
    updateDoctorGuidance(guidance: DoctorGuidance): Promise<void>;
    updateProfile(profile: UserProfile): Promise<void>;
    updateReminder(reminder: MedicineReminder): Promise<void>;
}
