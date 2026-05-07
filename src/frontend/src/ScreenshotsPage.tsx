const SCHEDULE_ITEMS = [
  {
    icon: "💊",
    color: "pill-teal",
    name: "Metformin 500mg",
    time: "8:00 AM",
    badge: "badge-taken",
    label: "Taken",
  },
  {
    icon: "💙",
    color: "pill-blue",
    name: "Lisinopril 10mg",
    time: "2:00 PM",
    badge: "badge-now",
    label: "Take Now",
  },
  {
    icon: "☀️",
    color: "pill-amber",
    name: "Vitamin D3 1000IU",
    time: "9:00 PM",
    badge: "badge-upcoming",
    label: "Upcoming",
  },
  {
    icon: "❤️",
    color: "pill-purple",
    name: "Aspirin 75mg",
    time: "10:00 PM",
    badge: "badge-upcoming",
    label: "Upcoming",
  },
];

const CHART_BARS_DASH = [
  { day: "Mon", h: 58, today: false, low: false },
  { day: "Tue", h: 70, today: false, low: false },
  { day: "Wed", h: 42, today: false, low: true },
  { day: "Thu", h: 65, today: false, low: false },
  { day: "Fri", h: 80, today: false, low: false },
  { day: "Sat", h: 55, today: false, low: false },
  { day: "Sun", h: 70, today: true, low: false },
];

const REMINDERS_LIST = [
  {
    icon: "💊",
    name: "Metformin",
    dosage: "500mg",
    freq: "Twice Daily",
    time: "8:00 AM & 8:00 PM",
    active: true,
  },
  {
    icon: "💙",
    name: "Lisinopril",
    dosage: "10mg",
    freq: "Once Daily",
    time: "2:00 PM",
    active: true,
  },
  {
    icon: "☀️",
    name: "Vitamin D3",
    dosage: "1000 IU",
    freq: "Once Daily",
    time: "9:00 PM",
    active: true,
  },
  {
    icon: "❤️",
    name: "Aspirin",
    dosage: "75mg",
    freq: "Once Daily",
    time: "10:00 PM",
    active: false,
  },
];

const CHART_BARS_ANALYTICS = [
  { day: "Mon", h: 90, today: false, low: false },
  { day: "Tue", h: 75, today: false, low: false },
  { day: "Wed", h: 50, today: false, low: true },
  { day: "Thu", h: 85, today: false, low: false },
  { day: "Fri", h: 100, today: false, low: false },
  { day: "Sat", h: 70, today: false, low: false },
  { day: "Sun", h: 80, today: true, low: false },
];

const INSIGHTS = [
  { name: "Metformin 500mg", pct: 96 },
  { name: "Lisinopril 10mg", pct: 89 },
  { name: "Vitamin D3 1000IU", pct: 82 },
  { name: "Aspirin 75mg", pct: 75 },
  { name: "Omeprazole 20mg", pct: 68 },
];

const DOSE_LOG = [
  { date: "07 May", med: "Metformin 500mg", time: "8:00 AM", status: "taken" },
  { date: "07 May", med: "Lisinopril 10mg", time: "2:00 PM", status: "taken" },
  { date: "06 May", med: "Metformin 500mg", time: "8:00 AM", status: "taken" },
  {
    date: "06 May",
    med: "Vitamin D3 1000IU",
    time: "9:00 PM",
    status: "missed",
  },
  { date: "05 May", med: "Aspirin 75mg", time: "10:00 PM", status: "missed" },
  { date: "05 May", med: "Metformin 500mg", time: "8:00 AM", status: "taken" },
  { date: "04 May", med: "Lisinopril 10mg", time: "2:00 PM", status: "taken" },
  { date: "04 May", med: "Omeprazole 20mg", time: "7:00 AM", status: "taken" },
  { date: "03 May", med: "Metformin 500mg", time: "8:00 PM", status: "missed" },
  {
    date: "02 May",
    med: "Vitamin D3 1000IU",
    time: "9:00 PM",
    status: "taken",
  },
];

const MEDICATIONS_REPORT = [
  "Metformin 500mg — Twice Daily",
  "Lisinopril 10mg — Once Daily",
  "Vitamin D3 1000IU — Once Daily",
  "Aspirin 75mg — Once Daily",
];

const POLLING_STEPS = [
  { n: "1", label: "Timer fires every 30 seconds" },
  { n: "2", label: "Current time checked (HH:MM)" },
  { n: "3", label: "Matches reminder schedule?" },
  { n: "4", label: "Browser notification + TTS fired" },
];

function ChromeBar({ title, num }: { title: string; num: string }) {
  return (
    <div className="ss-card-chrome">
      <div className="ss-chrome-dots">
        <div className="ss-dot ss-dot-red" />
        <div className="ss-dot ss-dot-yellow" />
        <div className="ss-dot ss-dot-green" />
      </div>
      <div className="ss-chrome-title">{title}</div>
      <div className="ss-chrome-num">{num}</div>
    </div>
  );
}

export default function ScreenshotsPage() {
  return (
    <>
      <style>{`
        .ss-page {
          font-family: 'Plus Jakarta Sans', 'DM Sans', Arial, sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
          padding: 0 0 60px;
        }
        .ss-header {
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          color: #fff;
          padding: 40px 32px 36px;
          text-align: center;
          position: relative;
        }
        .ss-header h1 {
          font-size: 28px; font-weight: 800; margin: 0 0 6px; letter-spacing: -0.5px;
        }
        .ss-header p { font-size: 14px; opacity: 0.88; margin: 0 0 24px; }
        .ss-header-actions {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
        }
        .ss-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer; text-decoration: none;
          transition: opacity 0.15s; border: none;
        }
        .ss-btn:hover { opacity: 0.85; }
        .ss-btn-back { background: rgba(255,255,255,0.18); color: #fff; border: 1.5px solid rgba(255,255,255,0.4) !important; }
        .ss-btn-print { background: #fff; color: #0d9488; }
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
          gap: 32px; padding: 36px 32px;
          max-width: 1400px; margin: 0 auto;
        }
        .ss-card {
          background: #fff; border: 1px solid #d1d5db; border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;
          break-inside: avoid; page-break-inside: avoid;
        }
        .ss-card-chrome {
          background: #1e2330; padding: 10px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .ss-chrome-dots { display: flex; gap: 6px; flex-shrink: 0; }
        .ss-dot { width: 11px; height: 11px; border-radius: 50%; }
        .ss-dot-red { background: #ff5f57; }
        .ss-dot-yellow { background: #ffbd2e; }
        .ss-dot-green { background: #28ca41; }
        .ss-chrome-title {
          color: #e2e8f0; font-size: 12px; font-weight: 600;
          flex: 1; text-align: center; letter-spacing: 0.3px;
        }
        .ss-chrome-num { color: #64748b; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .ss-content { padding: 0; background: #f8fafc; }
        /* Mockup inner styles */
        .mock-wrap { padding: 20px; background: #f8fafc; }
        /* Auth screen */
        .auth-wrap {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; padding: 20px; background: #f0f4f8;
        }
        .auth-panel {
          background: #fff; border-radius: 12px; padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .auth-logo { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; }
        .auth-logo-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: rgba(13,148,136,0.12);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px; font-size: 26px;
        }
        .auth-logo h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
        .auth-logo p { font-size: 11px; color: #64748b; margin: 0; }
        .auth-tabs {
          display: flex; background: #f1f5f9; border-radius: 8px;
          padding: 3px; margin-bottom: 16px;
        }
        .auth-tab {
          flex: 1; text-align: center; padding: 6px; font-size: 12px;
          font-weight: 600; border-radius: 6px; color: #64748b;
        }
        .auth-tab.active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .mock-field { margin-bottom: 12px; }
        .mock-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px; }
        .mock-input {
          width: 100%; padding: 8px 10px; border: 1.5px solid #e2e8f0;
          border-radius: 6px; font-size: 12px; color: #1e293b;
          box-sizing: border-box; background: #fff;
        }
        .mock-input.filled { color: #0f172a; background: #f8fafc; }
        .mock-btn-primary {
          width: 100%; padding: 10px; background: #0d9488; color: #fff;
          border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
          cursor: pointer; margin-top: 4px;
        }
        .mock-btn-outline {
          width: 100%; padding: 9px; background: #fff; color: #374151;
          border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .mock-divider { display: flex; align-items: center; gap: 8px; margin: 12px 0; }
        .mock-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .mock-divider span { font-size: 10px; color: #94a3b8; }
        /* Dashboard */
        .dash-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;
        }
        .dash-logo { display: flex; align-items: center; gap: 8px; }
        .dash-logo span { font-size: 15px; font-weight: 800; color: #0f172a; }
        .dash-notif-dot {
          display: flex; align-items: center; gap: 4px;
          background: #ecfdf5; padding: 2px 7px; border-radius: 20px;
          font-size: 10px; font-weight: 600; color: #059669;
        }
        .dash-notif-dot .dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .dash-header-right { display: flex; align-items: center; gap: 8px; }
        .dash-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(13,148,136,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #0d9488;
          border: 1.5px solid #e2e8f0;
        }
        .dash-mode-toggle {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f1f5f9; display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer; border: none;
        }
        .dash-body { padding: 16px; }
        .dash-greeting { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
        .dash-date { font-size: 11px; color: #94a3b8; margin-bottom: 14px; }
        .dash-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .stat-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .stat-card-label { font-size: 10px; font-weight: 600; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .progress-ring-wrap { display: flex; align-items: center; gap: 12px; }
        .progress-ring-pct { font-size: 22px; font-weight: 800; color: #0d9488; line-height: 1; }
        .progress-ring-sub { font-size: 10px; color: #64748b; margin-top: 2px; }
        .streak-card-inner { display: flex; align-items: center; gap: 10px; }
        .streak-flame { font-size: 28px; }
        .streak-num { font-size: 24px; font-weight: 800; color: #f97316; line-height: 1; }
        .streak-label { font-size: 11px; color: #64748b; }
        .streak-motivate { font-size: 10px; color: #94a3b8; margin-top: 2px; }
        .section-title { font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.4px; }
        .schedule-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .schedule-item {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .schedule-item-left { display: flex; align-items: center; gap: 10px; }
        .pill-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .pill-teal { background: rgba(13,148,136,0.1); }
        .pill-blue { background: rgba(59,130,246,0.1); }
        .pill-purple { background: rgba(139,92,246,0.1); }
        .pill-amber { background: rgba(245,158,11,0.1); }
        .schedule-name { font-size: 12px; font-weight: 700; color: #0f172a; }
        .schedule-time { font-size: 11px; color: #64748b; }
        .badge {
          display: inline-flex; align-items: center; padding: 3px 9px;
          border-radius: 20px; font-size: 10px; font-weight: 700;
        }
        .badge-taken { background: #dcfce7; color: #16a34a; }
        .badge-now { background: #fef3c7; color: #d97706; }
        .badge-upcoming { background: #f1f5f9; color: #64748b; }
        .badge-missed { background: #fee2e2; color: #dc2626; }
        .badge-fda { background: #dcfce7; color: #15803d; }
        .badge-ai { background: #ede9fe; color: #7c3aed; }
        /* Bar chart */
        .chart-wrap { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
        .chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 70px; }
        .chart-bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .chart-bar { width: 100%; border-radius: 4px 4px 0 0; background: #0d9488; opacity: 0.7; }
        .chart-bar.today { opacity: 1; }
        .chart-bar.low { background: #f97316; opacity: 0.7; }
        .chart-day { font-size: 9px; color: #94a3b8; margin-top: 4px; font-weight: 600; }
        /* Reminders */
        .rem-list { display: flex; flex-direction: column; gap: 10px; }
        .rem-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 14px 16px; display: flex; align-items: center; gap: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .rem-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(13,148,136,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .rem-info { flex: 1; }
        .rem-name { font-size: 13px; font-weight: 700; color: #0f172a; }
        .rem-meta { font-size: 11px; color: #64748b; margin-top: 2px; display: flex; gap: 8px; align-items: center; }
        .rem-tag { background: #f0fdf4; color: #15803d; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; }
        .rem-actions { display: flex; gap: 6px; }
        .rem-action-btn {
          width: 30px; height: 30px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; cursor: pointer; border: 1px solid #e2e8f0; background: #f8fafc;
        }
        .rem-add-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: #0d9488; color: #fff; border: none;
          padding: 10px 18px; border-radius: 8px; font-size: 13px;
          font-weight: 700; cursor: pointer; margin-bottom: 16px; width: 100%;
        }
        /* Modal */
        .modal-backdrop {
          position: relative; background: rgba(15,23,42,0.5);
          border-radius: 8px; padding: 24px;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-box {
          background: #fff; border-radius: 12px; padding: 24px;
          width: 100%; max-width: 360px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }
        .modal-title { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .modal-sub { font-size: 11px; color: #64748b; margin-bottom: 18px; }
        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .modal-btn-cancel {
          flex: 1; padding: 9px; border: 1.5px solid #e2e8f0;
          border-radius: 8px; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; color: #374151;
        }
        .modal-btn-save {
          flex: 1; padding: 9px; background: #0d9488; color: #fff;
          border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
        }
        /* Search */
        .search-bar-wrap { display: flex; gap: 8px; margin-bottom: 16px; }
        .search-input {
          flex: 1; padding: 10px 14px; border: 1.5px solid #0d9488;
          border-radius: 8px; font-size: 13px; color: #0f172a;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.12); outline: none; background: #fff;
        }
        .search-btn {
          padding: 10px 16px; background: #0d9488; color: #fff;
          border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
        }
        .result-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .result-card-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 12px;
        }
        .result-drug-name { font-size: 15px; font-weight: 800; color: #0f172a; }
        .result-section-title { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.4px; }
        .result-section-val { font-size: 12px; color: #475569; line-height: 1.5; }
        .result-section { margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
        .result-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        .ai-card { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 14px; }
        .ai-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .ai-title { font-size: 13px; font-weight: 700; color: #7c3aed; }
        .ai-text { font-size: 12px; color: #4b5563; line-height: 1.6; }
        /* Analytics */
        .analytics-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
        .analytics-stat-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 14px 12px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .analytics-stat-val { font-size: 24px; font-weight: 800; color: #0d9488; line-height: 1; }
        .analytics-stat-val.orange { color: #f97316; }
        .analytics-stat-val.blue { color: #3b82f6; }
        .analytics-stat-label { font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        .insights-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .insight-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #f1f5f9; }
        .insight-row:last-child { border-bottom: none; }
        .insight-name { font-size: 12px; font-weight: 600; color: #0f172a; }
        .insight-pct { font-size: 12px; font-weight: 700; color: #0d9488; }
        .insight-bar-wrap { width: 80px; height: 6px; background: #e2e8f0; border-radius: 3px; }
        .insight-bar { height: 100%; border-radius: 3px; background: #0d9488; }
        /* History */
        .history-filters { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; align-items: center; }
        .history-filter-input {
          padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px;
          font-size: 11px; color: #374151; background: #fff; flex: 1; min-width: 100px;
        }
        .export-btn {
          display: flex; align-items: center; gap: 5px;
          background: #0d9488; color: #fff; border: none;
          padding: 7px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap;
        }
        .history-table { width: 100%; border-collapse: collapse; }
        .history-table th {
          background: #f8fafc; font-size: 10px; font-weight: 700;
          color: #64748b; text-align: left; padding: 8px 10px;
          border-bottom: 1.5px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.4px;
        }
        .history-table td { padding: 9px 10px; font-size: 12px; color: #374151; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .history-table tr:hover td { background: #f8fafc; }
        /* Profile */
        .profile-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 20px; background: #f0f4f8; }
        .profile-left { display: flex; flex-direction: column; gap: 12px; }
        .profile-right { display: flex; flex-direction: column; gap: 12px; }
        .profile-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .profile-card-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
        .profile-avatar-wrap { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .profile-avatar {
          width: 58px; height: 58px; border-radius: 50%;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 800; color: #fff;
          border: 3px solid #fff; box-shadow: 0 2px 8px rgba(13,148,136,0.25);
        }
        .profile-avatar-meta h3 { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
        .profile-avatar-meta p { font-size: 11px; color: #64748b; margin: 0; }
        .profile-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .profile-field { display: flex; flex-direction: column; gap: 3px; }
        .profile-field-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
        .profile-field-val { font-size: 12px; font-weight: 600; color: #0f172a; }
        .profile-edit-btn {
          display: flex; align-items: center; gap: 5px; justify-content: center;
          background: #0d9488; color: #fff; border: none;
          padding: 8px 16px; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; width: 100%; margin-top: 8px;
        }
        .profile-logout-btn {
          display: flex; align-items: center; gap: 5px; justify-content: center;
          background: #fff; color: #dc2626; border: 1.5px solid #fca5a5;
          padding: 8px 16px; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; width: 100%; margin-top: 6px;
        }
        .last-updated { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 8px; }
        .medical-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .medical-card-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .medical-row { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
        .medical-row:last-child { margin-bottom: 0; }
        .medical-key { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .medical-val { font-size: 12px; color: #0f172a; font-weight: 500; }
        /* Notifications */
        .notif-wrap { padding: 20px; background: #f0f4f8; display: flex; flex-direction: column; gap: 16px; }
        .notif-header-demo {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .notif-active-badge {
          display: flex; align-items: center; gap: 5px;
          background: #ecfdf5; padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600; color: #059669; border: 1px solid #a7f3d0;
        }
        .notif-active-badge .ndot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; }
        .notif-popup {
          background: #1e2330; color: #fff; border-radius: 12px;
          padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .notif-popup-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(13,148,136,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .notif-popup-app { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .notif-popup-title { font-size: 13px; font-weight: 700; color: #f1f5f9; margin-bottom: 2px; }
        .notif-popup-body { font-size: 11px; color: #94a3b8; }
        .voice-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 14px 16px; display: flex; align-items: center; gap: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .voice-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(59,130,246,0.12);
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .voice-title { font-size: 13px; font-weight: 700; color: #0f172a; }
        .voice-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
        .polling-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .polling-title { font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 10px; }
        .polling-timeline { display: flex; align-items: center; gap: 0; position: relative; padding: 8px 0; }
        .polling-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; z-index: 1; }
        .polling-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          background: #0d9488; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; margin-bottom: 5px;
          box-shadow: 0 2px 6px rgba(13,148,136,0.3);
        }
        .polling-step-label { font-size: 9px; color: #64748b; text-align: center; font-weight: 600; max-width: 60px; line-height: 1.3; }
        .select-mock {
          width: 100%; padding: 8px 10px; border: 1.5px solid #e2e8f0;
          border-radius: 6px; font-size: 12px; color: #1e293b;
          background: #fff; appearance: none; box-sizing: border-box;
        }
        .ss-footer {
          text-align: center; padding: 24px 20px;
          font-size: 12px; color: #64748b;
          border-top: 1px solid #e2e8f0; background: #fff; margin-top: 8px;
        }
        @media print {
          .ss-header-actions { display: none !important; }
          .ss-page { background: #fff; }
          .ss-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .ss-grid { grid-template-columns: 1fr; padding: 16px; gap: 24px; }
          .ss-card { break-inside: avoid; page-break-inside: avoid; }
          .auth-wrap, .profile-wrap { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .ss-grid { grid-template-columns: 1fr; padding: 16px; }
          .auth-wrap, .profile-wrap { grid-template-columns: 1fr; }
          .analytics-stats { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>

      <div className="ss-page">
        <div className="ss-header">
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>💊</div>
          <h1>MediRemind — Project Screenshots</h1>
          <p>Smart Medicine Reminder System — Complete Feature Overview</p>
          <div className="ss-header-actions">
            <a href="/" className="ss-btn ss-btn-back">
              ← Back to App
            </a>
            <button
              type="button"
              className="ss-btn ss-btn-print"
              onClick={() => window.print()}
            >
              🖨 Print / Save as PDF
            </button>
          </div>
        </div>

        <div className="ss-grid">
          {/* Screenshot 1 — Login & Registration */}
          <div className="ss-card">
            <ChromeBar
              title="Screenshot 1 — Login &amp; Registration"
              num="#01"
            />
            <div className="ss-content">
              <div className="auth-wrap">
                <div className="auth-panel">
                  <div className="auth-logo">
                    <div className="auth-logo-icon">💊</div>
                    <h2>MediRemind</h2>
                    <p>Smart medicine reminders</p>
                  </div>
                  <div className="auth-tabs">
                    <div className="auth-tab active">Sign In</div>
                    <div className="auth-tab">Create Account</div>
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Username</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      value="raj.kumar"
                    />
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Password</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      type="password"
                      value="password"
                    />
                  </div>
                  <button type="button" className="mock-btn-primary">
                    Sign In
                  </button>
                  <div className="mock-divider">
                    <div className="mock-divider-line" />
                    <span>or</span>
                    <div className="mock-divider-line" />
                  </div>
                  <button type="button" className="mock-btn-outline">
                    🔑 Continue with Internet Identity
                  </button>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      textAlign: "center",
                      marginTop: "8px",
                    }}
                  >
                    Internet Identity works best on deployed version
                  </p>
                </div>
                <div className="auth-panel">
                  <div className="auth-logo">
                    <div className="auth-logo-icon">💊</div>
                    <h2>MediRemind</h2>
                    <p>Smart medicine reminders</p>
                  </div>
                  <div className="auth-tabs">
                    <div className="auth-tab">Sign In</div>
                    <div className="auth-tab active">Create Account</div>
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Full Name</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      value="Raj Kumar"
                    />
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Email</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      value="raj.kumar@example.com"
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    <div className="mock-field">
                      <div className="mock-label">Age</div>
                      <input
                        readOnly
                        className="mock-input filled"
                        value="24"
                      />
                    </div>
                    <div className="mock-field">
                      <div className="mock-label">Gender</div>
                      <select className="select-mock" disabled>
                        <option>Male</option>
                      </select>
                    </div>
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Locality / City</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      value="Mumbai, Maharashtra"
                    />
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Username</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      value="raj.kumar"
                    />
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Password</div>
                    <input
                      readOnly
                      className="mock-input"
                      type="password"
                      value="password"
                    />
                  </div>
                  <button type="button" className="mock-btn-primary">
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 2 — Dashboard */}
          <div className="ss-card">
            <ChromeBar title="Screenshot 2 — Dashboard Overview" num="#02" />
            <div className="ss-content">
              <div className="dash-header">
                <div className="dash-logo">
                  <span style={{ fontSize: "18px" }}>💊</span>
                  <span>MediRemind</span>
                  <div className="dash-notif-dot">
                    <div className="dot" />
                    Active
                  </div>
                </div>
                <div className="dash-header-right">
                  <button type="button" className="dash-mode-toggle">
                    🌙
                  </button>
                  <div className="dash-avatar">RK</div>
                </div>
              </div>
              <div className="dash-body">
                <div className="dash-greeting">Good morning, Raj! 👋</div>
                <div className="dash-date">Thursday, 7 May 2026</div>
                <div className="dash-stats">
                  <div className="stat-card">
                    <div className="stat-card-label">Today's Progress</div>
                    <div className="progress-ring-wrap">
                      <svg
                        width="52"
                        height="52"
                        viewBox="0 0 52 52"
                        role="img"
                        aria-label="Progress ring"
                      >
                        <title>Progress ring</title>
                        <circle
                          cx="26"
                          cy="26"
                          r="21"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="5"
                        />
                        <circle
                          cx="26"
                          cy="26"
                          r="21"
                          fill="none"
                          stroke="#0d9488"
                          strokeWidth="5"
                          strokeDasharray="131.9"
                          strokeDashoffset="33"
                          strokeLinecap="round"
                          transform="rotate(-90 26 26)"
                        />
                        <text
                          x="26"
                          y="30"
                          textAnchor="middle"
                          fill="#0d9488"
                          fontSize="11"
                          fontWeight="800"
                        >
                          75%
                        </text>
                      </svg>
                      <div>
                        <div className="progress-ring-pct">3 of 4</div>
                        <div className="progress-ring-sub">doses taken</div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-label">Current Streak</div>
                    <div className="streak-card-inner">
                      <div className="streak-flame">🔥</div>
                      <div>
                        <div className="streak-num">7</div>
                        <div className="streak-label">days</div>
                        <div className="streak-motivate">Keep it up! 💪</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-title">Today's Schedule</div>
                <div className="schedule-list">
                  {SCHEDULE_ITEMS.map((item) => (
                    <div key={item.name} className="schedule-item">
                      <div className="schedule-item-left">
                        <div className={`pill-icon ${item.color}`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="schedule-name">{item.name}</div>
                          <div className="schedule-time">{item.time}</div>
                        </div>
                      </div>
                      <div className={`badge ${item.badge}`}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="section-title">7-Day Adherence</div>
                <div className="chart-wrap">
                  <div className="chart-bars">
                    {CHART_BARS_DASH.map((b) => (
                      <div key={`dash-${b.day}`} className="chart-bar-col">
                        <div
                          className={`chart-bar${b.today ? " today" : ""}${b.low ? " low" : ""}`}
                          style={{ height: `${b.h.toString()}%` }}
                        />
                        <div
                          className="chart-day"
                          style={
                            b.today
                              ? { color: "#0d9488", fontWeight: "800" }
                              : {}
                          }
                        >
                          {b.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 3 — Reminders Tab */}
          <div className="ss-card">
            <ChromeBar title="Screenshot 3 — Medicine Reminders" num="#03" />
            <div className="ss-content">
              <div className="mock-wrap">
                <button type="button" className="rem-add-btn">
                  ＋ Add Medicine Reminder
                </button>
                <div className="rem-list">
                  {REMINDERS_LIST.map((med) => (
                    <div key={med.name} className="rem-card">
                      <div className="rem-icon">{med.icon}</div>
                      <div className="rem-info">
                        <div className="rem-name">
                          {med.name}{" "}
                          <span style={{ fontWeight: 500, color: "#0d9488" }}>
                            {med.dosage}
                          </span>
                        </div>
                        <div className="rem-meta">
                          <span>{med.time}</span>
                          <span className="rem-tag">{med.freq}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: med.active ? "#0d9488" : "#94a3b8",
                          }}
                        >
                          {med.active ? "Active" : "Inactive"}
                        </div>
                        <div className="rem-actions">
                          <button
                            type="button"
                            className="rem-action-btn"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="rem-action-btn"
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 4 — Add Reminder Modal */}
          <div className="ss-card">
            <ChromeBar title="Screenshot 4 — Add Reminder Modal" num="#04" />
            <div className="ss-content">
              <div className="modal-backdrop">
                <div className="modal-box">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <div className="modal-title">Add Medicine Reminder</div>
                      <div className="modal-sub">
                        Set up a new medicine schedule
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        color: "#94a3b8",
                        cursor: "pointer",
                        lineHeight: "1",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Medicine Name</div>
                    <input
                      readOnly
                      className="mock-input filled"
                      value="Metformin"
                      placeholder="e.g. Paracetamol"
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <div className="mock-field">
                      <div className="mock-label">Dosage</div>
                      <input
                        readOnly
                        className="mock-input filled"
                        value="500mg"
                      />
                    </div>
                    <div className="mock-field">
                      <div className="mock-label">Time</div>
                      <input
                        readOnly
                        className="mock-input filled"
                        value="08:00 AM"
                      />
                    </div>
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Frequency</div>
                    <select className="select-mock" disabled>
                      <option>Twice Daily</option>
                      <option>Once Daily</option>
                      <option>Three Times Daily</option>
                      <option>As Needed</option>
                    </select>
                  </div>
                  <div className="mock-field">
                    <div className="mock-label">Notes (Optional)</div>
                    <input
                      readOnly
                      className="mock-input"
                      value="Take with meals"
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="modal-btn-cancel">
                      Cancel
                    </button>
                    <button type="button" className="modal-btn-save">
                      Save Reminder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 5 — Medicine Search */}
          <div className="ss-card">
            <ChromeBar
              title="Screenshot 5 — Medicine Search &amp; AI Summary"
              num="#05"
            />
            <div className="ss-content">
              <div className="mock-wrap">
                <div className="search-bar-wrap">
                  <input
                    readOnly
                    className="search-input"
                    value="Paracetamol"
                  />
                  <button type="button" className="search-btn">
                    Search
                  </button>
                </div>
                <div className="result-card">
                  <div className="result-card-header">
                    <div>
                      <div className="result-drug-name">
                        Paracetamol (Acetaminophen)
                      </div>
                      <div
                        style={{
                          marginTop: "5px",
                          display: "flex",
                          gap: "6px",
                        }}
                      >
                        <span className="badge badge-fda">✓ FDA Approved</span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                            alignSelf: "center",
                          }}
                        >
                          Analgesic / Antipyretic
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: "22px" }}>💊</span>
                  </div>
                  <div className="result-section">
                    <div className="result-section-title">
                      Dosage &amp; Administration
                    </div>
                    <div className="result-section-val">
                      Adults: 325–650 mg every 4–6 hours as needed. Maximum
                      4,000 mg/day. Do not exceed prescribed dose.
                    </div>
                  </div>
                  <div className="result-section">
                    <div className="result-section-title">
                      Indications &amp; Usage
                    </div>
                    <div className="result-section-val">
                      Used for temporary relief of minor aches and pains,
                      headaches, muscle aches, backache, common cold, and
                      reduction of fever.
                    </div>
                  </div>
                  <div className="result-section">
                    <div className="result-section-title">Warnings</div>
                    <div className="result-section-val">
                      Do not use with other medicines containing acetaminophen.
                      Consult a doctor if symptoms persist more than 10 days.
                    </div>
                  </div>
                </div>
                <div className="ai-card">
                  <div className="ai-header">
                    <div className="ai-title">🤖 AI Summary</div>
                    <span className="badge badge-ai">
                      Powered by Hugging Face AI
                    </span>
                  </div>
                  <div className="ai-text">
                    Paracetamol is a commonly used over-the-counter pain
                    reliever and fever reducer. It is effective for mild to
                    moderate pain relief and is generally safe when taken at
                    recommended doses. Patients should avoid combining it with
                    other acetaminophen-containing products to prevent
                    accidental overdose and liver damage.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 6 — Analytics */}
          <div className="ss-card">
            <ChromeBar
              title="Screenshot 6 — Analytics &amp; Adherence"
              num="#06"
            />
            <div className="ss-content">
              <div className="mock-wrap">
                <div className="analytics-stats">
                  <div className="analytics-stat-card">
                    <div className="analytics-stat-val">82%</div>
                    <div className="analytics-stat-label">
                      Overall Adherence
                    </div>
                  </div>
                  <div className="analytics-stat-card">
                    <div className="analytics-stat-val orange">🔥 12</div>
                    <div className="analytics-stat-label">Day Streak</div>
                  </div>
                  <div className="analytics-stat-card">
                    <div className="analytics-stat-val blue">5</div>
                    <div className="analytics-stat-label">Active Medicines</div>
                  </div>
                </div>
                <div className="section-title">7-Day Adherence Chart</div>
                <div className="chart-wrap" style={{ marginBottom: "14px" }}>
                  <div className="chart-bars">
                    {CHART_BARS_ANALYTICS.map((b) => (
                      <div key={`analytics-${b.day}`} className="chart-bar-col">
                        <div
                          className={`chart-bar${b.today ? " today" : ""}${b.low ? " low" : ""}`}
                          style={{ height: `${b.h.toString()}%` }}
                        />
                        <div
                          className="chart-day"
                          style={
                            b.today
                              ? { color: "#0d9488", fontWeight: "800" }
                              : {}
                          }
                        >
                          {b.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="section-title">Medication Insights</div>
                <div className="insights-card">
                  {INSIGHTS.map((med) => (
                    <div key={med.name} className="insight-row">
                      <div className="insight-name">{med.name}</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div className="insight-bar-wrap">
                          <div
                            className="insight-bar"
                            style={{ width: `${med.pct.toString()}%` }}
                          />
                        </div>
                        <div className="insight-pct">{med.pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 7 — History / Dose Log */}
          <div className="ss-card">
            <ChromeBar
              title="Screenshot 7 — History &amp; Dose Log"
              num="#07"
            />
            <div className="ss-content">
              <div className="mock-wrap">
                <div className="history-filters">
                  <input
                    readOnly
                    className="history-filter-input"
                    value="01 May 2026"
                    placeholder="Start date"
                  />
                  <input
                    readOnly
                    className="history-filter-input"
                    value="07 May 2026"
                    placeholder="End date"
                  />
                  <input
                    readOnly
                    className="history-filter-input"
                    value="All Medicines"
                    style={{ minWidth: "120px" }}
                  />
                  <button type="button" className="export-btn">
                    ⬇ Export CSV
                  </button>
                </div>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Medicine</th>
                      <th>Scheduled</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOSE_LOG.map((row) => (
                      <tr key={`${row.date}-${row.med}-${row.time}`}>
                        <td style={{ color: "#64748b", fontWeight: 600 }}>
                          {row.date}
                        </td>
                        <td style={{ fontWeight: 600 }}>{row.med}</td>
                        <td>{row.time}</td>
                        <td>
                          <span
                            className={`badge ${row.status === "taken" ? "badge-taken" : "badge-missed"}`}
                          >
                            {row.status === "taken" ? "✓ Taken" : "✗ Missed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Screenshot 8 — User Profile */}
          <div className="ss-card">
            <ChromeBar
              title="Screenshot 8 — User Profile Management"
              num="#08"
            />
            <div className="ss-content">
              <div className="profile-wrap">
                <div className="profile-left">
                  <div className="profile-card">
                    <div className="profile-card-title">👤 User Profile</div>
                    <div className="profile-avatar-wrap">
                      <div className="profile-avatar">RK</div>
                      <div className="profile-avatar-meta">
                        <h3>Raj Kumar</h3>
                        <p>raj.kumar@example.com</p>
                      </div>
                    </div>
                    <div className="profile-field-row">
                      <div className="profile-field">
                        <div className="profile-field-label">Age</div>
                        <div className="profile-field-val">24 years</div>
                      </div>
                      <div className="profile-field">
                        <div className="profile-field-label">Gender</div>
                        <div className="profile-field-val">Male</div>
                      </div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-label">Locality</div>
                      <div className="profile-field-val">
                        Mumbai, Maharashtra
                      </div>
                    </div>
                    <button type="button" className="profile-edit-btn">
                      ✏️ Edit Profile
                    </button>
                    <div className="last-updated">
                      Last updated: 07 May 2026, 10:45 AM
                    </div>
                    <button type="button" className="profile-logout-btn">
                      ⏏ Logout
                    </button>
                  </div>
                </div>
                <div className="profile-right">
                  <div className="medical-card">
                    <div className="medical-card-title">
                      👨‍⚕️ Doctor Guidance
                    </div>
                    <div className="medical-row">
                      <div className="medical-key">Doctor</div>
                      <div className="medical-val">Dr. Priya Sharma</div>
                    </div>
                    <div className="medical-row">
                      <div className="medical-key">Specialization</div>
                      <div className="medical-val">
                        Endocrinologist, MBBS, MD
                      </div>
                    </div>
                    <div className="medical-row">
                      <div className="medical-key">Prescribed Treatment</div>
                      <div className="medical-val">
                        Continue Metformin 500mg twice daily. Monitor blood
                        sugar levels every 2 weeks.
                      </div>
                    </div>
                  </div>
                  <div className="medical-card">
                    <div className="medical-card-title">🏥 Checkup Reports</div>
                    <div className="medical-row">
                      <div className="medical-key">Last Visit</div>
                      <div className="medical-val">15 January 2026</div>
                    </div>
                    <div className="medical-row">
                      <div className="medical-key">Doctor's Notes</div>
                      <div className="medical-val">
                        Blood sugar levels are under control. HbA1c: 6.8%.
                        Continue current medication plan.
                      </div>
                    </div>
                  </div>
                  <div className="medical-card">
                    <div className="medical-card-title">
                      💊 Medication Reports
                    </div>
                    {MEDICATIONS_REPORT.map((m) => (
                      <div
                        key={m}
                        className="medical-row"
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className="medical-val"
                          style={{ fontSize: "11px" }}
                        >
                          {m}
                        </div>
                        <span
                          className="badge badge-taken"
                          style={{ fontSize: "9px" }}
                        >
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 9 — Notification System */}
          <div className="ss-card">
            <ChromeBar
              title="Screenshot 9 — Notification &amp; Alert System"
              num="#09"
            />
            <div className="ss-content">
              <div className="notif-wrap">
                <div className="notif-header-demo">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>💊</span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "15px",
                        color: "#0f172a",
                      }}
                    >
                      MediRemind
                    </span>
                  </div>
                  <div className="notif-active-badge">
                    <span className="ndot" />
                    Notifications Active
                  </div>
                </div>
                <div className="notif-popup">
                  <div className="notif-popup-icon">🔔</div>
                  <div>
                    <div className="notif-popup-app">
                      MediRemind — Reminder Alert
                    </div>
                    <div className="notif-popup-title">
                      Time to take your medicine
                    </div>
                    <div className="notif-popup-body">
                      Metformin 500mg — Scheduled: 8:00 AM
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: "11px",
                      color: "#64748b",
                      alignSelf: "flex-start",
                    }}
                  >
                    Just now
                  </div>
                </div>
                <div className="voice-card">
                  <div className="voice-icon">🔊</div>
                  <div>
                    <div className="voice-title">Voice Alert Active</div>
                    <div className="voice-sub">
                      "Time to take your Metformin 500mg" — Web Speech API
                      (SpeechSynthesis)
                    </div>
                  </div>
                  <span
                    className="badge badge-taken"
                    style={{ marginLeft: "auto", whiteSpace: "nowrap" }}
                  >
                    Active
                  </span>
                </div>
                <div className="polling-card">
                  <div className="polling-title">
                    ⏱ 30-Second Polling Mechanism
                  </div>
                  <div className="polling-timeline">
                    {POLLING_STEPS.map((step, idx, arr) => (
                      <div
                        key={step.n}
                        className="polling-step"
                        style={{ position: "relative" }}
                      >
                        {idx < arr.length - 1 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "14px",
                              left: "calc(50% + 14px)",
                              width: "calc(100% - 28px)",
                              height: "2px",
                              background: "#d1fae5",
                              zIndex: 0,
                            }}
                          />
                        )}
                        <div className="polling-step-dot">{step.n}</div>
                        <div className="polling-step-label">{step.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "#15803d",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>How it works:</strong> When the page is open, a
                  background{" "}
                  <code
                    style={{
                      background: "#dcfce7",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      fontSize: "11px",
                    }}
                  >
                    setInterval
                  </code>{" "}
                  runs every 30 seconds. Each tick compares the current time
                  against all active reminder schedules. On a match, the system
                  requests browser Notification API permission and dispatches a
                  desktop popup, while simultaneously using the{" "}
                  <code
                    style={{
                      background: "#dcfce7",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      fontSize: "11px",
                    }}
                  >
                    window.speechSynthesis
                  </code>{" "}
                  API to read the alert aloud in the user's system language.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ss-footer">
          <strong>MediRemind – Smart Medicine Reminder System</strong>
          <span style={{ margin: "0 10px", color: "#d1d5db" }}>|</span>
          B.Tech Project Report
          <span style={{ margin: "0 10px", color: "#d1d5db" }}>|</span>
          Internet Computer Platform (ICP)
          <span style={{ margin: "0 10px", color: "#d1d5db" }}>|</span>
          Built with React + TypeScript + Tailwind CSS
        </div>
      </div>
    </>
  );
}
