import type { backendInterface } from "../backend.d";
import { DoseStatus, Frequency, UserRole } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  addCheckupReport: async () => undefined,
  addDoctorGuidance: async () => undefined,
  assignCallerUserRole: async () => undefined,
  createReminder: async () => undefined,
  deleteCheckupReport: async () => undefined,
  deleteDoctorGuidance: async () => undefined,
  deleteReminder: async () => undefined,
  getAllCheckupReports: async () => [
    {
      id: "cr1",
      visitDate: "2026-04-15",
      notes: "Blood pressure normal. Continue current medication.",
      doctorName: "Dr. Sarah Mitchell",
    },
    {
      id: "cr2",
      visitDate: "2026-03-01",
      notes: "Cholesterol levels improved. Reduce salt intake.",
      doctorName: "Dr. Raj Patel",
    },
  ],
  getAllDayLogs: async () => [
    { status: DoseStatus.taken, reminderId: "r1", timestamp: now },
    { status: DoseStatus.missed, reminderId: "r2", timestamp: now },
  ],
  getAllDayLogsRange: async () => [],
  getAllDoctorGuidance: async () => [
    {
      id: "dg1",
      date: "2026-04-15",
      treatment: "Metformin 500mg twice daily for blood sugar control.",
      notes: "Monitor blood glucose weekly.",
      doctorName: "Dr. Sarah Mitchell",
    },
  ],
  getAllLogs: async () => [
    { status: DoseStatus.taken, reminderId: "r1", timestamp: now },
    { status: DoseStatus.taken, reminderId: "r1", timestamp: now - BigInt(86400000000000) },
    { status: DoseStatus.missed, reminderId: "r2", timestamp: now - BigInt(86400000000000) },
  ],
  getAllReminderDayStats: async () => [
    {
      reminderId: "r1",
      reminderName: "Metformin",
      takenDoses: BigInt(6),
      missedDoses: BigInt(1),
      snoozedDoses: BigInt(0),
      totalDoses: BigInt(7),
      adherenceRate: 0.857,
    },
  ],
  getAllReminderDayStatsRange: async () => [],
  getAllReminderLogs: async () => [],
  getAllReminders: async () => [
    {
      id: "r1",
      name: "Metformin",
      dosage: "500mg",
      times: ["08:00", "20:00"],
      frequency: Frequency.twiceDaily,
      color: "#3b82f6",
      isActive: true,
      notes: "Take with food",
    },
    {
      id: "r2",
      name: "Lisinopril",
      dosage: "10mg",
      times: ["09:00"],
      frequency: Frequency.daily,
      color: "#10b981",
      isActive: true,
      notes: "Blood pressure medication",
    },
    {
      id: "r3",
      name: "Atorvastatin",
      dosage: "20mg",
      times: ["21:00"],
      frequency: Frequency.daily,
      color: "#8b5cf6",
      isActive: false,
      notes: "Take at night",
    },
  ],
  getCallerUserRole: async () => UserRole.user,
  getCurrentStreak: async () => BigInt(7),
  getDayStats: async () => ({
    date: new Date().toISOString().split("T")[0],
    takenDoses: BigInt(4),
    missedDoses: BigInt(1),
    snoozedDoses: BigInt(0),
    totalDoses: BigInt(5),
  }),
  getDayStatsRange: async () => ({
    date: new Date().toISOString().split("T")[0],
    takenDoses: BigInt(28),
    missedDoses: BigInt(3),
    snoozedDoses: BigInt(1),
    totalDoses: BigInt(32),
  }),
  getMedicineInfo: async () =>
    JSON.stringify({
      brand_name: "Metformin HCl",
      generic_name: "Metformin Hydrochloride",
      purpose: "Type 2 diabetes management",
      indications_and_usage: "Used to improve blood sugar control in adults with type 2 diabetes mellitus.",
      dosage_and_administration: "500mg twice daily with meals. Maximum dose: 2550mg/day.",
      warnings: "Lactic acidosis risk. Discontinue before contrast imaging procedures.",
      ai_summary: "Metformin is a first-line oral medication for type 2 diabetes. It works by reducing glucose production in the liver and improving insulin sensitivity. Take with food to minimize stomach upset.",
    }),
  getPastNDayStats: async () => {
    const result: Array<[bigint, { date: string; takenDoses: bigint; missedDoses: bigint; snoozedDoses: bigint; totalDoses: bigint }]> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push([
        BigInt(d.getTime()) * BigInt(1_000_000),
        {
          date: d.toISOString().split("T")[0],
          takenDoses: BigInt(Math.floor(Math.random() * 3) + 2),
          missedDoses: BigInt(Math.floor(Math.random() * 2)),
          snoozedDoses: BigInt(0),
          totalDoses: BigInt(4),
        },
      ]);
    }
    return result;
  },
  getProfile: async () => ({
    name: "Alex Johnson",
    age: BigInt(34),
    gender: "Male",
    locality: "Mumbai, Maharashtra",
    photoUrl: "",
    lastUpdated: now,
  }),
  getReminder: async () => ({
    id: "r1",
    name: "Metformin",
    dosage: "500mg",
    times: ["08:00", "20:00"],
    frequency: Frequency.twiceDaily,
    color: "#3b82f6",
    isActive: true,
    notes: "Take with food",
  }),
  getReminderDayLogs: async () => [],
  getReminderDayLogsRange: async () => [],
  getReminderDayStats: async () => ({
    reminderId: "r1",
    reminderName: "Metformin",
    takenDoses: BigInt(6),
    missedDoses: BigInt(1),
    snoozedDoses: BigInt(0),
    totalDoses: BigInt(7),
    adherenceRate: 0.857,
  }),
  getReminderDayStatsRange: async () => ({
    reminderId: "r1",
    reminderName: "Metformin",
    takenDoses: BigInt(6),
    missedDoses: BigInt(1),
    snoozedDoses: BigInt(0),
    totalDoses: BigInt(7),
    adherenceRate: 0.857,
  }),
  isCallerAdmin: async () => false,
  logDose: async () => undefined,
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: [],
  }),
  updateCheckupReport: async () => undefined,
  updateDoctorGuidance: async () => undefined,
  updateProfile: async () => undefined,
  updateReminder: async () => undefined,
};
