import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_USERS = [
  { id: 1, name: "Alex Chen", email: "admin@examai.io", role: "admin", avatar: "AC" },
  { id: 2, name: "Prof. Sarah Kim", email: "teacher@examai.io", role: "teacher", avatar: "SK" },
  { id: 3, name: "Jordan Lee", email: "student@examai.io", role: "student", avatar: "JL" },
];

const MOCK_EXAMS = [
  { id: "e1", title: "Advanced Data Structures", subject: "Computer Science", duration: 90, totalQuestions: 50, status: "live", startTime: "2026-02-26T10:00:00", endTime: "2026-02-26T11:30:00", students: 142, cheatingAlerts: 3, createdBy: "Prof. Sarah Kim" },
  { id: "e2", title: "Calculus II Midterm", subject: "Mathematics", duration: 120, totalQuestions: 40, status: "upcoming", startTime: "2026-02-28T14:00:00", endTime: "2026-02-28T16:00:00", students: 89, cheatingAlerts: 0, createdBy: "Prof. Sarah Kim" },
  { id: "e3", title: "Operating Systems Fundamentals", subject: "Computer Science", duration: 60, totalQuestions: 30, status: "completed", startTime: "2026-02-20T09:00:00", endTime: "2026-02-20T10:00:00", students: 201, cheatingAlerts: 7, createdBy: "Prof. Sarah Kim" },
  { id: "e4", title: "Python Programming Challenge", subject: "Coding", duration: 180, totalQuestions: 5, status: "upcoming", startTime: "2026-03-01T11:00:00", endTime: "2026-03-01T14:00:00", students: 312, cheatingAlerts: 0, createdBy: "Prof. Sarah Kim" },
];

const MOCK_QUESTIONS = [
  { id: 1, text: "What is the time complexity of searching an element in a balanced BST?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 1, subject: "Data Structures", difficulty: "Medium", flagged: false },
  { id: 2, text: "Which data structure uses LIFO (Last In First Out) principle?", options: ["Queue", "Array", "Stack", "LinkedList"], correct: 2, subject: "Data Structures", difficulty: "Easy", flagged: false },
  { id: 3, text: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: 1, subject: "Algorithms", difficulty: "Medium", flagged: false },
  { id: 4, text: "Which traversal of a BST gives nodes in sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correct: 2, subject: "Trees", difficulty: "Easy", flagged: false },
  { id: 5, text: "What is a Hash collision?", options: ["Two keys hash to same index", "Hash table overflow", "Invalid key", "Empty table"], correct: 0, subject: "Hashing", difficulty: "Medium", flagged: false },
  { id: 6, text: "Dijkstra's algorithm is used for?", options: ["Sorting", "Shortest path", "Minimum spanning tree", "Graph coloring"], correct: 1, subject: "Graphs", difficulty: "Hard", flagged: false },
  { id: 7, text: "Which sorting algorithm has best average case performance?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], correct: 2, subject: "Algorithms", difficulty: "Medium", flagged: false },
  { id: 8, text: "What is the space complexity of DFS?", options: ["O(1)", "O(V)", "O(E)", "O(V+E)"], correct: 1, subject: "Graphs", difficulty: "Hard", flagged: false },
  { id: 9, text: "AVL trees maintain balance through?", options: ["Rotations", "Hashing", "Sorting", "Merging"], correct: 0, subject: "Trees", difficulty: "Hard", flagged: false },
  { id: 10, text: "Which data structure is best for implementing a priority queue?", options: ["Stack", "Array", "Heap", "LinkedList"], correct: 2, subject: "Data Structures", difficulty: "Medium", flagged: false },
];

const MOCK_CODING_PROBLEM = {
  id: "c1",
  title: "Two Sum",
  difficulty: "Easy",
  description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] = 6" },
  ],
  constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Only one valid answer exists"],
  testCases: [
    { input: "[2,7,11,15]\n9", expected: "[0,1]", passed: null },
    { input: "[3,2,4]\n6", expected: "[1,2]", passed: null },
    { input: "[3,3]\n6", expected: "[0,1]", passed: null },
  ],
};

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Emma Wilson", score: 98, time: "52:14", violations: 0, avatar: "EW" },
  { rank: 2, name: "Liam Park", score: 96, time: "58:42", violations: 0, avatar: "LP" },
  { rank: 3, name: "Jordan Lee", score: 94, time: "61:15", violations: 1, avatar: "JL" },
  { rank: 4, name: "Aisha Patel", score: 91, time: "67:03", violations: 0, avatar: "AP" },
  { rank: 5, name: "Marcus Scott", score: 88, time: "71:22", violations: 2, avatar: "MS" },
  { rank: 6, name: "Priya Nair", score: 85, time: "75:44", violations: 0, avatar: "PN" },
];

const MOCK_STUDENTS = [
  { id: 1, name: "Emma Wilson", email: "emma@uni.edu", score: 98, status: "completed", violations: 0 },
  { id: 2, name: "Liam Park", email: "liam@uni.edu", score: 96, status: "completed", violations: 0 },
  { id: 3, name: "Jordan Lee", email: "jordan@uni.edu", score: 94, status: "live", violations: 1 },
  { id: 4, name: "Aisha Patel", email: "aisha@uni.edu", score: null, status: "live", violations: 0 },
  { id: 5, name: "Marcus Scott", email: "marcus@uni.edu", score: 88, status: "completed", violations: 2 },
  { id: 6, name: "Riya Sharma", email: "riya@uni.edu", score: null, status: "not_started", violations: 0 },
];

const MOCK_ANALYTICS = {
  weeklyAttempts: [45, 78, 62, 91, 84, 110, 95],
  scoreDistribution: [{ label: "90-100", val: 22 }, { label: "80-89", val: 35 }, { label: "70-79", val: 28 }, { label: "60-69", val: 10 }, { label: "<60", val: 5 }],
  subjectPerf: [{ sub: "DS", score: 85 }, { sub: "Algo", score: 72 }, { sub: "OS", score: 91 }, { sub: "Math", score: 68 }, { sub: "Networks", score: 79 }],
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Exam 'Advanced Data Structures' starts in 30 minutes", time: "5m ago", type: "warning", read: false },
  { id: 2, text: "Your result for 'OS Fundamentals' is available", time: "1h ago", type: "success", read: false },
  { id: 3, text: "New exam 'Python Challenge' has been assigned to you", time: "3h ago", type: "info", read: true },
  { id: 4, text: "Certificate for 'Calculus I' is ready to download", time: "1d ago", type: "success", read: true },
];

// ============================================================
// ICONS (Inline SVG components)
// ============================================================
const Icon = ({ path, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
);

const Icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  exam: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  play: "M5 3l14 9-14 9V3z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  trophy: "M8.21 13.89L7 23l5-3 5 3-1.21-9.12 M15 7a3 3 0 11-6 0 M20 7V4H4v3 M20 7a5 5 0 01-5 5H9a5 5 0 01-5-5",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  plus: "M12 5v14 M5 12h14",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  chevronRight: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  terminal: "M4 17l6-6-6-6 M12 19h8",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z",
  wifi: "M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01",
  cpu: "M9 2H7a2 2 0 00-2 2v2M9 2h6M9 2v3M15 2h2a2 2 0 012 2v2M15 2v3M2 9h3m14 0h3M2 15h3m14 0h3M9 22h6M9 22v-3M15 22v-3M7 22H5a2 2 0 01-2-2v-2M17 22h2a2 2 0 002-2v-2 M9 9h6v6H9z",
};

// ============================================================
// THEME
// ============================================================
const theme = {
  dark: {
    bg: "#0a0e1a",
    bgCard: "#111827",
    bgHover: "#1a2035",
    border: "#1e2d45",
    text: "#e2e8f0",
    textMuted: "#64748b",
    textSub: "#94a3b8",
    accent: "#3b82f6",
    accentGlow: "rgba(59,130,246,0.25)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    sidebar: "#0d1525",
    glass: "rgba(17,24,39,0.8)",
  },
  light: {
    bg: "#f0f4f8",
    bgCard: "#ffffff",
    bgHover: "#f1f5f9",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#94a3b8",
    textSub: "#475569",
    accent: "#3b82f6",
    accentGlow: "rgba(59,130,246,0.15)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#7c3aed",
    cyan: "#0891b2",
    sidebar: "#ffffff",
    glass: "rgba(255,255,255,0.9)",
  },
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState("login");
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const t = isDark ? theme.dark : theme.light;

  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    setCurrentView("dashboard");
    addToast(`Welcome back, ${user.name}!`, "success");
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView("login");
    addToast("Logged out successfully", "info");
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    },
  };

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
        .hover-card:hover { background: ${t.bgHover} !important; transform: translateY(-1px); transition: all 0.2s; }
        .btn-primary { background: ${t.accent}; color: white; border: none; cursor: pointer; border-radius: 10px; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 25px ${t.accentGlow}; }
        .btn-ghost { background: transparent; color: ${t.text}; border: 1px solid ${t.border}; cursor: pointer; border-radius: 10px; transition: all 0.2s; }
        .btn-ghost:hover { background: ${t.bgHover}; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .fadeIn { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: ${t.accent} !important; }
        .glow-blue { box-shadow: 0 0 20px ${t.accentGlow}; }
        .gradient-text { background: linear-gradient(135deg, ${t.accent}, ${t.purple}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; }
      `}</style>

      {/* Toast notifications */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(toast => (
          <div key={toast.id} className="fadeIn" style={{
            padding: "12px 18px", borderRadius: 10, background: toast.type === "success" ? t.success : toast.type === "danger" ? t.danger : t.type === "warning" ? t.warning : t.bgCard,
            color: "white", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 8, minWidth: 250,
            border: `1px solid ${toast.type === "success" ? t.success : t.accent}40`,
          }}>
            <span>{toast.type === "success" ? "✓" : toast.type === "danger" ? "✕" : "ℹ"}</span> {toast.msg}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="fadeIn" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 32, maxWidth: 480, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
            {modal}
          </div>
        </div>
      )}

      {/* VIEWS */}
      {currentView === "login" && <LoginPage t={t} isDark={isDark} setIsDark={setIsDark} onLogin={login} addToast={addToast} />}
      {currentView === "dashboard" && currentUser && (
        <DashboardLayout t={t} isDark={isDark} setIsDark={setIsDark} user={currentUser} onLogout={logout} addToast={addToast} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} notifOpen={notifOpen} setNotifOpen={setNotifOpen} setModal={setModal} setCurrentView={setCurrentView} />
      )}
      {currentView === "exam" && (
        <ExamInterface t={t} isDark={isDark} user={currentUser} addToast={addToast} setCurrentView={setCurrentView} setModal={setModal} />
      )}
      {currentView === "coding" && (
        <CodingInterface t={t} isDark={isDark} user={currentUser} addToast={addToast} setCurrentView={setCurrentView} />
      )}
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ t, isDark, setIsDark, onLogin, addToast }) {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");

  const handleLogin = () => {
    if (!form.email || !form.password) { addToast("Please fill all fields", "danger"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.role === form.role) || MOCK_USERS[2];
      onLogin(user);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${t.accentGlow} 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 60%)` }} />

      {/* Left Panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px", position: "relative" }} className="fadeIn">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 60 }}>
          <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon path={Icons.shield} size={22} className="" style={{ color: "white" }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: t.text }}>ExamAI</div>
            <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: "0.05em" }}>PROCTORED PLATFORM</div>
          </div>
        </div>

        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2, marginBottom: 8 }}>
            {tab === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ color: t.textMuted, marginBottom: 40, fontSize: 15 }}>
            {tab === "login" ? "Enter your credentials to access the platform" : "Join ExamAI to start your assessment journey"}
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", background: t.bgHover, borderRadius: 10, padding: 4, marginBottom: 28, border: `1px solid ${t.border}` }}>
            {["login", "register"].map(tb => (
              <button key={tb} onClick={() => setTab(tb)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                background: tab === tb ? t.accent : "transparent", color: tab === tb ? "white" : t.textMuted,
              }}>{tb === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>

          {/* Role Select */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, marginBottom: 6, display: "block" }}>Select Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{
              width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgCard, color: t.text, fontSize: 14, cursor: "pointer",
            }}>
              <option value="student">🎓 Student</option>
              <option value="teacher">👩‍🏫 Teacher / Examiner</option>
              <option value="admin">🛠 Administrator</option>
            </select>
          </div>

          {tab === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, marginBottom: 6, display: "block" }}>Full Name</label>
              <input placeholder="John Doe" style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgCard, color: t.text, fontSize: 14 }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, marginBottom: 6, display: "block" }}>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder={`${form.role}@examai.io`} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgCard, color: t.text, fontSize: 14 }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, marginBottom: 6, display: "block" }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgCard, color: t.text, fontSize: 14 }} />
          </div>

          {tab === "login" && (
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <button style={{ background: "none", border: "none", color: t.accent, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Forgot password?</button>
            </div>
          )}

          <button onClick={handleLogin} className="btn-primary" disabled={loading} style={{ width: "100%", padding: "14px 0", fontSize: 15, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <span className="pulse">Authenticating...</span> : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>

          {/* Demo hint */}
          <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 10, background: t.bgHover, border: `1px solid ${t.border}`, fontSize: 13, color: t.textMuted }}>
            <strong style={{ color: t.textSub }}>Demo:</strong> Select any role above, enter any email & password, then click Sign In
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div style={{ flex: 1, background: `linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)`, borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", overflow: "hidden" }}>
        {/* Theme toggle */}
        <button onClick={() => setIsDark(!isDark)} style={{ position: "absolute", top: 24, right: 24, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: t.text, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Icon path={isDark ? Icons.sun : Icons.moon} size={16} /> {isDark ? "Light" : "Dark"}
        </button>

        {/* Stats cards floating */}
        <div style={{ position: "relative", width: "100%", maxWidth: 380 }}>
          {[
            { icon: Icons.users, label: "Active Students", value: "24,891", color: t.accent },
            { icon: Icons.exam, label: "Exams Completed", value: "1.2M+", color: t.success },
            { icon: Icons.shield, label: "Integrity Score", value: "99.2%", color: t.purple },
            { icon: Icons.zap, label: "AI Detection Rate", value: "98.7%", color: t.warning },
          ].map((stat, i) => (
            <div key={i} className="hover-card" style={{
              background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16,
              transform: `translateX(${i % 2 === 0 ? 0 : 20}px)`, transition: "all 0.3s",
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>
                <Icon path={stat.icon} size={20} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>AI-powered proctoring with real-time face detection,<br />tab monitoring, and behavioral analysis</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD LAYOUT
// ============================================================
function DashboardLayout({ t, isDark, setIsDark, user, onLogout, addToast, sidebarOpen, setSidebarOpen, notifOpen, setNotifOpen, setModal, setCurrentView }) {
  const [activePage, setActivePage] = useState("overview");

  const navItems = {
    admin: [
      { id: "overview", label: "Overview", icon: Icons.dashboard },
      { id: "users", label: "User Management", icon: Icons.users },
      { id: "monitoring", label: "Live Monitoring", icon: Icons.camera },
      { id: "analytics", label: "Analytics", icon: Icons.chart },
      { id: "settings", label: "Settings", icon: Icons.settings },
    ],
    teacher: [
      { id: "overview", label: "Dashboard", icon: Icons.dashboard },
      { id: "create_exam", label: "Create Exam", icon: Icons.plus },
      { id: "question_bank", label: "Question Bank", icon: Icons.book },
      { id: "results", label: "Student Results", icon: Icons.chart },
      { id: "leaderboard", label: "Leaderboard", icon: Icons.trophy },
    ],
    student: [
      { id: "overview", label: "My Dashboard", icon: Icons.dashboard },
      { id: "upcoming", label: "Upcoming Exams", icon: Icons.clock },
      { id: "results", label: "My Results", icon: Icons.star },
      { id: "leaderboard", label: "Leaderboard", icon: Icons.trophy },
    ],
  };

  const pages = navItems[user.role] || navItems.student;
  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 68, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column",
        transition: "width 0.3s", flexShrink: 0, overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon path={Icons.shield} size={18} />
          </div>
          {sidebarOpen && <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", whiteSpace: "nowrap" }}>ExamAI</div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {pages.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, transition: "all 0.2s", textAlign: "left",
              background: activePage === item.id ? `${t.accent}20` : "transparent",
              color: activePage === item.id ? t.accent : t.textMuted,
            }}>
              <Icon path={item.icon} size={18} />
              {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: t.bgHover }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {user.avatar}
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                <div style={{ fontSize: 11, color: t.textMuted, textTransform: "capitalize" }}>{user.role}</div>
              </div>
            )}
          </div>
          <button onClick={onLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginTop: 4,
            background: "transparent", color: t.danger, fontSize: 13, fontWeight: 500,
          }}>
            <Icon path={Icons.logout} size={16} />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{ padding: "0 24px", height: 64, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: t.bgCard, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 6 }}>
              <Icon path={Icons.menu} size={20} />
            </button>
            <div style={{ fontSize: 13, color: t.textMuted }}>
              <span style={{ color: t.textSub }}>Dashboard</span> <span style={{ margin: "0 6px" }}>›</span>
              <span style={{ color: t.text, textTransform: "capitalize" }}>{pages.find(p => p.id === activePage)?.label || "Overview"}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setIsDark(!isDark)} style={{ background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: t.textSub, display: "flex" }}>
              <Icon path={isDark ? Icons.sun : Icons.moon} size={16} />
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{ background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: t.textSub, display: "flex" }}>
                <Icon path={Icons.bell} size={16} />
              </button>
              {unreadNotifs > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: t.danger, color: "white", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unreadNotifs}</span>}
              {notifOpen && (
                <div className="fadeIn" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,0.3)", zIndex: 100, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                    <span style={{ fontSize: 12, color: t.accent, cursor: "pointer" }}>Mark all read</span>
                  </div>
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, background: n.read ? "transparent" : `${t.accent}08`, cursor: "pointer" }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, marginBottom: 4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: t.textMuted }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {activePage === "overview" && user.role === "admin" && <AdminOverview t={t} addToast={addToast} setModal={setModal} />}
          {activePage === "overview" && user.role === "teacher" && <TeacherOverview t={t} addToast={addToast} setModal={setModal} setCurrentView={setCurrentView} />}
          {activePage === "overview" && user.role === "student" && <StudentOverview t={t} addToast={addToast} setModal={setModal} setCurrentView={setCurrentView} />}
          {activePage === "users" && <UserManagement t={t} addToast={addToast} />}
          {activePage === "monitoring" && <LiveMonitoring t={t} addToast={addToast} />}
          {activePage === "analytics" && <AnalyticsPage t={t} />}
          {activePage === "settings" && <SettingsPage t={t} isDark={isDark} setIsDark={setIsDark} addToast={addToast} />}
          {activePage === "create_exam" && <CreateExam t={t} addToast={addToast} />}
          {activePage === "question_bank" && <QuestionBank t={t} addToast={addToast} />}
          {activePage === "results" && <ResultsPage t={t} user={user} addToast={addToast} setModal={setModal} />}
          {activePage === "leaderboard" && <LeaderboardPage t={t} user={user} />}
          {activePage === "upcoming" && <UpcomingExams t={t} addToast={addToast} setCurrentView={setCurrentView} />}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function StatCard({ t, icon, label, value, delta, color, subtitle }) {
  return (
    <div className="hover-card" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 22px", transition: "all 0.2s", cursor: "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
          <Icon path={icon} size={20} />
        </div>
        {delta && <span style={{ fontSize: 12, fontWeight: 600, color: delta > 0 ? t.success : t.danger, background: `${delta > 0 ? t.success : t.danger}18`, padding: "3px 8px", borderRadius: 6 }}>{delta > 0 ? "+" : ""}{delta}%</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: t.textMuted }}>{label}</div>
      {subtitle && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function SectionTitle({ t, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: t.textMuted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Badge({ text, color, bg }) {
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: bg || `${color}20`, color, display: "inline-block" }}>{text}</span>;
}

// Simple bar chart using divs
function BarChart({ t, data, height = 120, color }) {
  const max = Math.max(...data.map(d => d.val || d));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height, paddingTop: 10 }}>
      {data.map((d, i) => {
        const val = d.val !== undefined ? d.val : d;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: Math.max(4, (val / max) * (height - 24)), background: `linear-gradient(to top, ${color}, ${color}88)`, borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} title={`${val}`} />
            {d.label && <div style={{ fontSize: 9, color: t.textMuted, textAlign: "center" }}>{d.label}</div>}
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ t, data, height = 80, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#lg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PieChart({ t, data, size = 80 }) {
  const total = data.reduce((s, d) => s + d.val, 0);
  let offset = 0;
  const colors = [t.accent, t.success, t.warning, t.danger, t.purple];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        {data.map((d, i) => {
          const pct = d.val / total;
          const angle = pct * 360;
          const r = 14, cx = 16, cy = 16;
          const startAngle = (offset / total) * 360 - 90;
          const endAngle = startAngle + angle;
          const start = { x: cx + r * Math.cos((startAngle * Math.PI) / 180), y: cy + r * Math.sin((startAngle * Math.PI) / 180) };
          const end = { x: cx + r * Math.cos((endAngle * Math.PI) / 180), y: cy + r * Math.sin((endAngle * Math.PI) / 180) };
          const large = angle > 180 ? 1 : 0;
          offset += d.val;
          return <path key={i} d={`M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${large},1 ${end.x},${end.y} Z`} fill={colors[i % colors.length]} />;
        })}
        <circle cx="16" cy="16" r="8" fill={t.bgCard} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ color: t.textMuted }}>{d.label}:</span>
            <span style={{ fontWeight: 600, color: t.text }}>{d.val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN OVERVIEW
// ============================================================
function AdminOverview({ t, addToast, setModal }) {
  const stats = [
    { icon: Icons.users, label: "Total Users", value: "24,891", delta: 12, color: t.accent },
    { icon: Icons.exam, label: "Active Exams", value: "47", delta: 8, color: t.success },
    { icon: Icons.camera, label: "Live Sessions", value: "1,284", delta: 23, color: t.purple },
    { icon: Icons.alert, label: "Cheating Alerts", value: "23", delta: -15, color: t.danger },
  ];

  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Admin Overview" subtitle="Platform-wide insights and monitoring" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => <StatCard key={i} t={t} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Weekly chart */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Exam Attempts This Week</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Daily active sessions</div>
            </div>
            <Badge text="↑ 18% vs last week" color={t.success} />
          </div>
          <BarChart t={t} data={[
            { val: 45, label: "Mon" }, { val: 78, label: "Tue" }, { val: 62, label: "Wed" },
            { val: 91, label: "Thu" }, { val: 84, label: "Fri" }, { val: 110, label: "Sat" }, { val: 95, label: "Sun" },
          ]} height={140} color={t.accent} />
        </div>

        {/* Violation breakdown */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Violation Types</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Last 30 days</div>
          <PieChart t={t} data={[
            { label: "Tab Switch", val: 42 }, { label: "Multiple Face", val: 28 }, { label: "Copy Paste", val: 18 }, { label: "Other", val: 12 },
          ]} />
        </div>
      </div>

      {/* Live exams */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22, marginBottom: 20 }}>
        <SectionTitle t={t} title="Live Exams" subtitle="Currently running assessments" action={
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => addToast("Monitoring panel opened", "success")}>
            View All Monitoring
          </button>
        } />
        <table>
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}` }}>
              {["Exam Title", "Students", "Duration", "Alerts", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 12, color: t.textMuted, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_EXAMS.map(exam => (
              <tr key={exam.id} style={{ borderBottom: `1px solid ${t.border}20` }} className="hover-card">
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{exam.title}</div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>{exam.subject}</div>
                </td>
                <td style={{ padding: "14px 12px", fontSize: 14 }}>{exam.students}</td>
                <td style={{ padding: "14px 12px", fontSize: 14 }}>{exam.duration} min</td>
                <td style={{ padding: "14px 12px" }}>
                  <Badge text={exam.cheatingAlerts > 0 ? `⚠ ${exam.cheatingAlerts}` : "Clear"} color={exam.cheatingAlerts > 0 ? t.danger : t.success} />
                </td>
                <td style={{ padding: "14px 12px" }}>
                  <Badge text={exam.status} color={exam.status === "live" ? t.success : exam.status === "upcoming" ? t.warning : t.textMuted} />
                </td>
                <td style={{ padding: "14px 12px" }}>
                  <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => addToast(`Monitoring ${exam.title}`, "info")}>Monitor</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Suspicious activity log */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
        <SectionTitle t={t} title="Suspicious Activity Log" subtitle="Recent violations detected by AI" />
        {[
          { student: "Marcus Scott", exam: "Data Structures", type: "Tab Switch", time: "10:23 AM", severity: "medium" },
          { student: "Raj Patel", exam: "OS Fundamentals", type: "Multiple Faces Detected", time: "10:31 AM", severity: "high" },
          { student: "Anna Lee", exam: "Calculus II", type: "Copy-Paste Attempt", time: "10:45 AM", severity: "low" },
          { student: "Jake Thompson", exam: "Data Structures", type: "Screen Share Detected", time: "11:02 AM", severity: "high" },
        ].map((log, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${t.border}20` : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.severity === "high" ? t.danger : log.severity === "medium" ? t.warning : t.textMuted, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{log.student} — <span style={{ color: t.textMuted, fontWeight: 400 }}>{log.exam}</span></div>
              <div style={{ fontSize: 12, color: log.severity === "high" ? t.danger : t.textMuted }}>{log.type}</div>
            </div>
            <div style={{ fontSize: 12, color: t.textMuted }}>{log.time}</div>
            <Badge text={log.severity} color={log.severity === "high" ? t.danger : log.severity === "medium" ? t.warning : t.textMuted} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TEACHER OVERVIEW
// ============================================================
function TeacherOverview({ t, addToast, setModal, setCurrentView }) {
  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Teacher Dashboard" subtitle="Manage exams and track student performance" action={
        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={() => addToast("Navigate to Create Exam tab", "info")}>
          <Icon path={Icons.plus} size={16} /> New Exam
        </button>
      } />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard t={t} icon={Icons.exam} label="Total Exams" value="12" delta={5} color={t.accent} />
        <StatCard t={t} icon={Icons.users} label="Students Enrolled" value="844" delta={18} color={t.success} />
        <StatCard t={t} icon={Icons.star} label="Avg Score" value="78.4%" delta={3} color={t.purple} />
        <StatCard t={t} icon={Icons.alert} label="Flagged Students" value="7" delta={-22} color={t.warning} />
      </div>

      {/* Exam cards */}
      <SectionTitle t={t} title="Your Exams" subtitle="Recently created assessments" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 28 }}>
        {MOCK_EXAMS.map(exam => (
          <div key={exam.id} className="hover-card" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{exam.title}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{exam.subject} · {exam.totalQuestions} questions</div>
              </div>
              <Badge text={exam.status} color={exam.status === "live" ? t.success : exam.status === "upcoming" ? t.warning : t.textMuted} />
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 13, color: t.textMuted }}>
              <span>⏱ {exam.duration} min</span>
              <span>👥 {exam.students} students</span>
              {exam.cheatingAlerts > 0 && <span style={{ color: t.danger }}>⚠ {exam.cheatingAlerts} alerts</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, padding: "8px 0", fontSize: 12 }} onClick={() => addToast("Opening exam editor", "info")}>Edit</button>
              <button className="btn-primary" style={{ flex: 1, padding: "8px 0", fontSize: 12 }} onClick={() => addToast("Viewing results", "success")}>Results</button>
            </div>
          </div>
        ))}
      </div>

      {/* Score chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Score Distribution</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>Advanced Data Structures</div>
          <BarChart t={t} data={MOCK_ANALYTICS.scoreDistribution} height={120} color={t.purple} />
        </div>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Subject Performance</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>Average scores by subject</div>
          <BarChart t={t} data={MOCK_ANALYTICS.subjectPerf.map(s => ({ val: s.score, label: s.sub }))} height={120} color={t.cyan} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STUDENT OVERVIEW
// ============================================================
function StudentOverview({ t, addToast, setModal, setCurrentView }) {
  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="My Dashboard" subtitle="Track your performance and upcoming exams" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard t={t} icon={Icons.exam} label="Exams Taken" value="18" color={t.accent} />
        <StatCard t={t} icon={Icons.star} label="Avg Score" value="84.2%" delta={5} color={t.success} />
        <StatCard t={t} icon={Icons.trophy} label="Current Rank" value="#3" color={t.warning} />
        <StatCard t={t} icon={Icons.clock} label="Upcoming" value="2" color={t.purple} />
      </div>

      {/* Upcoming exam card - big CTA */}
      <div style={{ background: `linear-gradient(135deg, ${t.accent}20, ${t.purple}20)`, border: `1px solid ${t.accent}40`, borderRadius: 16, padding: 28, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Badge text="Starting Soon" color={t.warning} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "10px 0 6px" }}>Advanced Data Structures</h3>
          <div style={{ fontSize: 14, color: t.textMuted }}>Today at 10:00 AM · 90 minutes · 50 questions</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: t.warning, fontFamily: "'Space Grotesk', sans-serif" }}>02:34:12</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>Until start</div>
          </div>
          <button className="btn-primary" style={{ padding: "12px 28px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setCurrentView("exam")}>
            <Icon path={Icons.play} size={18} /> Start Exam
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Performance graph */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>My Performance Trend</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>Last 7 exams</div>
          <LineChart t={t} data={[68, 74, 71, 82, 79, 88, 84]} height={100} color={t.accent} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {["E1", "E2", "E3", "E4", "E5", "E6", "E7"].map(l => <span key={l} style={{ fontSize: 10, color: t.textMuted }}>{l}</span>)}
          </div>
        </div>

        {/* Subject strengths */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Subject Strengths</div>
          {MOCK_ANALYTICS.subjectPerf.map((s, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: t.textSub }}>{s.sub}</span>
                <span style={{ fontWeight: 600 }}>{s.score}%</span>
              </div>
              <div style={{ height: 6, background: t.bgHover, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.score}%`, background: s.score > 80 ? t.success : s.score > 70 ? t.warning : t.danger, borderRadius: 3, transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed exams */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
        <SectionTitle t={t} title="Recent Results" action={
          <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => addToast("Opening full results", "info")}>View All</button>
        } />
        {[
          { exam: "OS Fundamentals", score: 94, rank: 2, date: "Feb 20", time: "58:14" },
          { exam: "Calculus I", score: 88, rank: 5, date: "Feb 15", time: "71:30" },
          { exam: "Network Protocols", score: 79, rank: 8, date: "Feb 10", time: "84:22" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < 2 ? `1px solid ${t.border}20` : "none" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${r.score >= 90 ? t.success : r.score >= 80 ? t.accent : t.warning}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: r.score >= 90 ? t.success : r.score >= 80 ? t.accent : t.warning }}>
              {r.score}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.exam}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Rank #{r.rank} · {r.date} · {r.time}</div>
            </div>
            <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => addToast("Opening certificate", "success")}>Certificate</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// USER MANAGEMENT
// ============================================================
function UserManagement({ t, addToast }) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));

  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="User Management" subtitle="Manage platform users and permissions" action={
        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }} onClick={() => addToast("Add user form opened", "info")}>+ Add User</button>
      } />
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Icon path={Icons.search} size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }} />
          </div>
          <select style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }}>
            <option>All Roles</option><option>Admin</option><option>Teacher</option><option>Student</option>
          </select>
        </div>
        <table>
          <thead style={{ background: t.bgHover }}>
            <tr>
              {["User", "Role", "Email", "Status", "Actions"].map(h => <th key={h} style={{ padding: "12px 20px", fontSize: 12, color: t.textMuted, fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[...MOCK_USERS, ...MOCK_STUDENTS.slice(0, 4).map(s => ({ ...s, role: "student", avatar: s.name.split(" ").map(w => w[0]).join(""), email: s.email }))].map((u, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.border}20` }} className="hover-card">
                <td style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>{u.avatar || u.name?.[0]}</div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                </td>
                <td style={{ padding: "14px 20px" }}><Badge text={u.role} color={u.role === "admin" ? t.danger : u.role === "teacher" ? t.purple : t.accent} /></td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: t.textMuted }}>{u.email}</td>
                <td style={{ padding: "14px 20px" }}><Badge text="Active" color={t.success} /></td>
                <td style={{ padding: "14px 20px", display: "flex", gap: 8 }}>
                  <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => addToast("Edit user opened", "info")}>Edit</button>
                  <button style={{ padding: "5px 12px", fontSize: 12, border: `1px solid ${t.danger}`, borderRadius: 8, background: "transparent", color: t.danger, cursor: "pointer" }} onClick={() => addToast("User suspended", "danger")}>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// LIVE MONITORING
// ============================================================
function LiveMonitoring({ t, addToast }) {
  const [alerts, setAlerts] = useState(3);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.7) {
        addToast("⚠ New violation detected: Multiple faces", "danger");
        setAlerts(a => a + 1);
      }
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Live Monitoring" subtitle="Real-time proctoring oversight" action={
        <div style={{ display: "flex", gap: 10 }}>
          <Badge text={`${alerts} Active Alerts`} color={t.danger} />
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => addToast("All alerts acknowledged", "success")}>Acknowledge All</button>
        </div>
      } />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {MOCK_STUDENTS.filter(s => s.status === "live").map((s, i) => (
          <div key={s.id} style={{ background: t.bgCard, border: `1px solid ${s.violations > 0 ? t.danger : t.border}`, borderRadius: 14, overflow: "hidden" }}>
            {/* Webcam placeholder */}
            <div style={{ height: 140, background: `linear-gradient(135deg, #1a2035, #0a0e1a)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ textAlign: "center", color: t.textMuted }}>
                <Icon path={Icons.camera} size={32} />
                <div style={{ fontSize: 11, marginTop: 6 }}>Live Feed</div>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                <div style={{ background: t.success, width: 8, height: 8, borderRadius: "50%" }} className="pulse" />
                <div style={{ fontSize: 10, color: "white", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>LIVE</div>
              </div>
              {s.violations > 0 && (
                <div style={{ position: "absolute", top: 8, left: 8, background: t.danger, color: "white", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>⚠ {s.violations} Violations</div>
              )}
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>Advanced Data Structures</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "6px 0", fontSize: 12 }} onClick={() => addToast("Warning sent to student", "warning")}>Warn</button>
                <button style={{ flex: 1, padding: "6px 0", fontSize: 12, border: `1px solid ${t.danger}`, borderRadius: 8, background: "transparent", color: t.danger, cursor: "pointer" }} onClick={() => addToast("Student terminated", "danger")}>Terminate</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
        <SectionTitle t={t} title="Session Statistics" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Total Active", value: "1,284", color: t.accent },
            { label: "Face Detected", value: "1,271", color: t.success },
            { label: "Multiple Faces", value: "8", color: t.danger },
            { label: "Tab Switches", value: "31", color: t.warning },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "18px 12px", borderRadius: 10, background: t.bgHover, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ANALYTICS PAGE
// ============================================================
function AnalyticsPage({ t }) {
  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Analytics" subtitle="Platform performance metrics and insights" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Weekly Exam Attempts</div>
          <LineChart t={t} data={MOCK_ANALYTICS.weeklyAttempts} height={120} color={t.accent} />
        </div>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Score Distribution</div>
          <BarChart t={t} data={MOCK_ANALYTICS.scoreDistribution} height={120} color={t.success} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Subject Performance</div>
          <BarChart t={t} data={MOCK_ANALYTICS.subjectPerf.map(s => ({ val: s.score, label: s.sub }))} height={120} color={t.purple} />
        </div>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Integrity Overview</div>
          <PieChart t={t} data={[{ label: "Clean", val: 87 }, { label: "Minor", val: 9 }, { label: "Major", val: 4 }]} size={100} />
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: t.bgHover, border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 13, color: t.textMuted }}>Overall integrity score</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: t.success, fontFamily: "'Space Grotesk', sans-serif" }}>99.2%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS PAGE
// ============================================================
function SettingsPage({ t, isDark, setIsDark, addToast }) {
  const [notifs, setNotifs] = useState({ email: true, push: true, violations: true, results: true });
  const [proctoring, setProctoring] = useState({ faceDetect: true, tabSwitch: true, copyPaste: true, screenShare: false });

  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="System Settings" subtitle="Configure platform preferences" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          { title: "Appearance", items: [{ label: "Dark Mode", value: isDark, onChange: () => setIsDark(!isDark) }, { label: "Compact Layout", value: false }, { label: "Animations", value: true }] },
          { title: "Notifications", items: Object.keys(notifs).map(k => ({ label: k.charAt(0).toUpperCase() + k.slice(1) + " Notifications", value: notifs[k], onChange: () => setNotifs(p => ({ ...p, [k]: !p[k] })) })) },
          { title: "Proctoring", items: Object.keys(proctoring).map(k => ({ label: k, value: proctoring[k], onChange: () => setProctoring(p => ({ ...p, [k]: !p[k] })) })) },
          {
            title: "Security", items: [
              { label: "Two-Factor Auth", value: true },
              { label: "Session Timeout (30min)", value: true },
              { label: "IP Restriction", value: false },
            ]
          },
        ].map((section, si) => (
          <div key={si} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{section.title}</div>
            {section.items.map((item, ii) => (
              <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: ii < section.items.length - 1 ? `1px solid ${t.border}20` : "none" }}>
                <span style={{ fontSize: 14, color: t.textSub }}>{item.label}</span>
                <button onClick={item.onChange || (() => addToast("Setting updated", "success"))} style={{
                  width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  background: item.value ? t.accent : t.border,
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: item.value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn-ghost" style={{ padding: "10px 24px" }}>Reset to Defaults</button>
        <button className="btn-primary" style={{ padding: "10px 24px" }} onClick={() => addToast("Settings saved!", "success")}>Save Changes</button>
      </div>
    </div>
  );
}

// ============================================================
// CREATE EXAM
// ============================================================
function CreateExam({ t, addToast }) {
  const [form, setForm] = useState({ title: "", subject: "", duration: 60, negativeMarking: false, randomize: true, sections: [{ name: "Section 1", questions: 20 }] });

  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Create Exam" subtitle="Configure a new assessment" />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Basic Information</div>
            {[
              { label: "Exam Title", key: "title", placeholder: "e.g. Advanced Data Structures Midterm" },
              { label: "Subject", key: "subject", placeholder: "e.g. Computer Science" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, display: "block", marginBottom: 6 }}>{field.label}</label>
                <input value={form[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 14 }} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, display: "block", marginBottom: 6 }}>Duration (minutes)</label>
                <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, display: "block", marginBottom: 6 }}>Total Marks</label>
                <input type="number" defaultValue="100"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 14 }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, display: "block", marginBottom: 6 }}>Start Date & Time</label>
                <input type="datetime-local" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, display: "block", marginBottom: 6 }}>End Date & Time</label>
                <input type="datetime-local" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 14 }} />
              </div>
            </div>
          </div>

          {/* Section builder */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Sections</div>
              <button className="btn-primary" style={{ padding: "7px 14px", fontSize: 13 }} onClick={() => setForm(p => ({ ...p, sections: [...p.sections, { name: `Section ${p.sections.length + 1}`, questions: 10 }] }))}>+ Add Section</button>
            </div>
            {form.sections.map((sec, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                <input value={sec.name} onChange={e => setForm(p => ({ ...p, sections: p.sections.map((s, j) => j === i ? { ...s, name: e.target.value } : s) }))}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }} />
                <input type="number" value={sec.questions} onChange={e => setForm(p => ({ ...p, sections: p.sections.map((s, j) => j === i ? { ...s, questions: e.target.value } : s) }))}
                  style={{ width: 80, padding: "9px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }} />
                <span style={{ fontSize: 12, color: t.textMuted, whiteSpace: "nowrap" }}>questions</span>
                {form.sections.length > 1 && <button onClick={() => setForm(p => ({ ...p, sections: p.sections.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: t.danger, cursor: "pointer" }}>✕</button>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Settings</div>
            {[
              { label: "Negative Marking", key: "negativeMarking", desc: "Deduct 0.25 for wrong answers" },
              { label: "Randomize Questions", key: "randomize", desc: "Shuffle question order per student" },
            ].map(setting => (
              <div key={setting.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: `1px solid ${t.border}20` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{setting.label}</div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>{setting.desc}</div>
                </div>
                <button onClick={() => setForm(p => ({ ...p, [setting.key]: !p[setting.key] }))} style={{
                  width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  background: form[setting.key] ? t.accent : t.border, flexShrink: 0,
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: form[setting.key] ? 23 : 3, transition: "left 0.2s" }} />
                </button>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: t.textSub, display: "block", marginBottom: 8 }}>Proctoring Level</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Basic (Timer only)", "Standard (Face + Tab)", "Strict (Full AI Proctoring)"].map((level, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 12px", borderRadius: 8, border: `1px solid ${i === 2 ? t.accent : t.border}`, background: i === 2 ? `${t.accent}10` : "transparent", fontSize: 13 }}>
                    <input type="radio" name="proctoring" defaultChecked={i === 2} style={{ accentColor: t.accent }} /> {level}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Summary</div>
            <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 2 }}>
              <div>📋 {form.sections.reduce((s, sec) => s + +sec.questions, 0)} total questions</div>
              <div>⏱ {form.duration} minutes</div>
              <div>📂 {form.sections.length} section{form.sections.length > 1 ? "s" : ""}</div>
              <div>🛡 Full AI Proctoring</div>
            </div>
          </div>

          <button className="btn-primary" style={{ padding: "14px 0", fontSize: 15 }} onClick={() => addToast("Exam created successfully!", "success")}>Create Exam →</button>
          <button className="btn-ghost" style={{ padding: "12px 0", fontSize: 14 }} onClick={() => addToast("Saved as draft", "info")}>Save as Draft</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// QUESTION BANK
// ============================================================
function QuestionBank({ t, addToast }) {
  const [selected, setSelected] = useState([]);

  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Question Bank" subtitle="Manage and organize questions" action={
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => addToast("Import dialog opened", "info")}>Import CSV</button>
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => addToast("Question builder opened", "info")}>+ Add Question</button>
        </div>
      } />
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 10 }}>
          <input placeholder="Search questions..." style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }} />
          <select style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }}>
            <option>All Subjects</option><option>Data Structures</option><option>Algorithms</option>
          </select>
          <select style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13 }}>
            <option>All Difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
        {MOCK_QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}20`, display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer" }} className="hover-card">
            <input type="checkbox" checked={selected.includes(q.id)} onChange={() => setSelected(p => p.includes(q.id) ? p.filter(id => id !== q.id) : [...p, q.id])} style={{ marginTop: 3, accentColor: t.accent }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{q.text}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {q.options.map((opt, oi) => (
                  <span key={oi} style={{ fontSize: 12, padding: "2px 10px", borderRadius: 6, background: oi === q.correct ? `${t.success}20` : t.bgHover, color: oi === q.correct ? t.success : t.textMuted, border: `1px solid ${oi === q.correct ? t.success : t.border}20` }}>{opt}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <Badge text={q.difficulty} color={q.difficulty === "Easy" ? t.success : q.difficulty === "Medium" ? t.warning : t.danger} />
              <Badge text={q.subject} color={t.accent} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RESULTS PAGE
// ============================================================
function ResultsPage({ t, user, addToast, setModal }) {
  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Student Results" subtitle="Performance breakdown by exam" action={
        <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }} onClick={() => addToast("Exporting results as CSV", "success")}>
          <Icon path={Icons.download} size={14} /> Export
        </button>
      } />
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 20px", background: t.bgHover, borderBottom: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600 }}>Advanced Data Structures — Exam Results</div>
        <table>
          <thead>
            <tr style={{ background: t.bgHover }}>
              {["#", "Student", "Score", "Time Taken", "Violations", "Status", "Action"].map(h => <th key={h} style={{ padding: "11px 16px", fontSize: 12, color: t.textMuted, fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map((s, i) => (
              <tr key={s.id} className="hover-card" style={{ borderBottom: `1px solid ${t.border}20` }}>
                <td style={{ padding: "13px 16px", color: t.textMuted, fontSize: 13 }}>{i + 1}</td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${t.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.accent }}>{s.name.split(" ").map(w => w[0]).join("")}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: t.textMuted }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  {s.score ? <span style={{ fontSize: 15, fontWeight: 700, color: s.score >= 90 ? t.success : s.score >= 75 ? t.accent : t.warning }}>{s.score}%</span> : <span style={{ color: t.textMuted, fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: t.textMuted }}>
                  {s.status === "completed" ? "72:14" : "—"}
                </td>
                <td style={{ padding: "13px 16px" }}>
                  {s.violations > 0 ? <Badge text={`${s.violations} violation${s.violations > 1 ? "s" : ""}`} color={t.danger} /> : <Badge text="Clean" color={t.success} />}
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <Badge text={s.status.replace("_", " ")} color={s.status === "completed" ? t.success : s.status === "live" ? t.accent : t.textMuted} />
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setModal(<CertificateModal t={t} student={s} />)}>
                    {s.status === "completed" ? "Certificate" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CertificateModal({ t, student }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Certificate of Achievement</div>
      <div style={{ border: `3px solid ${t.accent}`, borderRadius: 12, padding: 32, marginBottom: 20, background: `linear-gradient(135deg, ${t.accent}08, ${t.purple}08)` }}>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>This certifies that</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{student.name}</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 20 }}>has successfully completed</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>Advanced Data Structures</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: t.success }}>{student.score}%</div><div style={{ fontSize: 11, color: t.textMuted }}>Score</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>Distinction</div><div style={{ fontSize: 11, color: t.textMuted }}>Grade</div></div>
        </div>
      </div>
      <button className="btn-primary" style={{ padding: "10px 28px", fontSize: 14 }} onClick={() => {}}>Download PDF</button>
    </div>
  );
}

// ============================================================
// LEADERBOARD PAGE
// ============================================================
function LeaderboardPage({ t, user }) {
  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Leaderboard" subtitle="Top performers this month" />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
          {/* Top 3 podium */}
          <div style={{ padding: "24px 24px 16px", background: `linear-gradient(135deg, ${t.accent}15, ${t.purple}15)`, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, height: 120 }}>
              {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((s, i) => {
                const heights = [80, 110, 60];
                const colors = [t.textMuted, t.warning, t.accent];
                const ranks = [2, 1, 3];
                return (
                  <div key={s.rank} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${colors[i]}30`, border: `2px solid ${colors[i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors[i], marginBottom: 6 }}>{s.avatar}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.split(" ")[0]}</div>
                    <div style={{ width: 56, height: heights[i], background: `${colors[i]}20`, border: `1px solid ${colors[i]}40`, borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: colors[i] }}>#{ranks[i]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rest of table */}
          {MOCK_LEADERBOARD.map((s, i) => (
            <div key={s.rank} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderBottom: `1px solid ${t.border}20`, background: s.name === user?.name ? `${t.accent}08` : "transparent" }} className="hover-card">
              <div style={{ width: 28, textAlign: "center", fontWeight: 700, fontSize: 15, color: i < 3 ? t.warning : t.textMuted }}>#{s.rank}</div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${t.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.accent }}>{s.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name} {s.name === user?.name && <Badge text="You" color={t.accent} />}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>Time: {s.time}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? t.warning : t.text }}>{s.score}%</div>
                {s.violations > 0 && <div style={{ fontSize: 11, color: t.danger }}>⚠ {s.violations} violations</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Your Stats</div>
            {[
              { label: "Current Rank", value: "#3", color: t.accent },
              { label: "Best Score", value: "94%", color: t.success },
              { label: "Percentile", value: "Top 5%", color: t.purple },
              { label: "Exams Taken", value: "18", color: t.warning },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${t.border}20` : "none" }}>
                <span style={{ fontSize: 13, color: t.textMuted }}>{stat.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: `linear-gradient(135deg, ${t.warning}20, ${t.accent}20)`, border: `1px solid ${t.warning}40`, borderRadius: 14, padding: 22, textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>🏆</div>
            <div style={{ fontSize: 15, fontWeight: 600, margin: "10px 0 6px" }}>Top Performer</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>You're in the top 5% this month!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UPCOMING EXAMS
// ============================================================
function UpcomingExams({ t, addToast, setCurrentView }) {
  return (
    <div className="fadeIn">
      <SectionTitle t={t} title="Upcoming Exams" subtitle="Your scheduled assessments" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {MOCK_EXAMS.filter(e => e.status === "upcoming").map(exam => (
          <div key={exam.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{exam.title}</h3>
                <Badge text={exam.subject} color={t.accent} />
              </div>
              <div style={{ fontSize: 13, color: t.textMuted, display: "flex", gap: 16 }}>
                <span>📅 {new Date(exam.startTime).toLocaleDateString()}</span>
                <span>⏰ {new Date(exam.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                <span>⏱ {exam.duration} min</span>
                <span>📋 {exam.totalQuestions} questions</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => addToast("Exam guidelines opened", "info")}>Guidelines</button>
              <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => { setCurrentView("exam"); addToast("Starting exam...", "success"); }}>Start Exam</button>
            </div>
          </div>
        ))}
        {MOCK_EXAMS.filter(e => e.status === "live").map(exam => (
          <div key={exam.id} style={{ background: t.bgCard, border: `1px solid ${t.success}40`, borderRadius: 14, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{exam.title}</h3>
                <Badge text="LIVE NOW" color={t.success} />
              </div>
              <div style={{ fontSize: 13, color: t.textMuted }}>⏱ {exam.duration} min · 📋 {exam.totalQuestions} questions</div>
            </div>
            <button className="btn-primary" style={{ padding: "12px 28px", fontSize: 14, background: t.success }} onClick={() => setCurrentView("exam")}>
              Join Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXAM INTERFACE
// ============================================================
function ExamInterface({ t, isDark, user, addToast, setCurrentView, setModal }) {
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [proctorWarnings, setProctorWarnings] = useState(1);
  const [faceDetected, setFaceDetected] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const totalQ = MOCK_QUESTIONS.length;

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.85) {
        setShowWarning(true);
        setProctorWarnings(w => w + 1);
        setTimeout(() => setShowWarning(false), 3000);
      }
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
  const q = MOCK_QUESTIONS[currentQ];

  const getQStatus = (idx) => {
    if (flagged.includes(idx)) return "flagged";
    if (answers[idx] !== undefined) return "answered";
    if (idx < currentQ) return "visited";
    if (idx === currentQ) return "current";
    return "not_visited";
  };

  const statusColors = { answered: t.success, flagged: t.warning, current: t.accent, visited: t.textMuted, not_visited: t.border };
  const statusBg = { answered: `${t.success}25`, flagged: `${t.warning}25`, current: `${t.accent}30`, visited: `${t.textMuted}10`, not_visited: t.bgHover };

  if (submitted) {
    const score = Math.round((Object.keys(answers).length / totalQ) * 100);
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.bg }}>
        <div className="fadeIn" style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Exam Submitted!</h1>
          <p style={{ color: t.textMuted, marginBottom: 32 }}>Your responses have been recorded and are being evaluated.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "18px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: t.success }}>{Object.keys(answers).length}/{totalQ}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Answered</div>
            </div>
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "18px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: t.warning }}>{flagged.length}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Flagged</div>
            </div>
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "18px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: proctorWarnings > 0 ? t.danger : t.success }}>{proctorWarnings}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Violations</div>
            </div>
          </div>
          <button className="btn-primary" style={{ padding: "14px 40px", fontSize: 16 }} onClick={() => setCurrentView("dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", flexDirection: "column" }}>
      {/* Tab switch warning */}
      {showWarning && (
        <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: t.bgCard, border: `2px solid ${t.danger}`, borderRadius: 16, padding: 40, textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: t.danger, marginBottom: 8 }}>Violation Detected!</h2>
            <p style={{ color: t.textMuted, marginBottom: 20 }}>Tab switching is not allowed during the exam. This has been recorded.</p>
            <button className="btn-primary" style={{ padding: "10px 28px" }} onClick={() => setShowWarning(false)}>I Understand</button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon path={Icons.shield} size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Advanced Data Structures</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Jordan Lee · Student</div>
          </div>
        </div>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: timeLeft < 600 ? `${t.danger}20` : t.bgHover, border: `1px solid ${timeLeft < 600 ? t.danger : t.border}`, borderRadius: 10, padding: "8px 16px" }}>
          <Icon path={Icons.clock} size={16} style={{ color: timeLeft < 600 ? t.danger : t.accent }} />
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: timeLeft < 600 ? t.danger : t.text }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>

        {/* Proctoring status */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.success }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.success }} className="pulse" />
            Face Detected
          </div>
          {proctorWarnings > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.danger, background: `${t.danger}15`, padding: "4px 10px", borderRadius: 6 }}>
              <Icon path={Icons.alert} size={12} />
              {proctorWarnings} Warning{proctorWarnings > 1 ? "s" : ""}
            </div>
          )}
          {/* Webcam thumb */}
          <div style={{ width: 60, height: 45, background: "#0a0e1a", borderRadius: 8, border: `2px solid ${t.success}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <Icon path={Icons.camera} size={18} style={{ color: t.textMuted }} />
            <div style={{ position: "absolute", bottom: 2, right: 4, width: 6, height: 6, borderRadius: "50%", background: t.success }} className="pulse" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Question panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {/* Section & question nav */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["Data Structures", "Algorithms", "Graphs"].map((sec, i) => (
              <button key={i} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${i === 0 ? t.accent : t.border}`, background: i === 0 ? `${t.accent}20` : "transparent", color: i === 0 ? t.accent : t.textMuted, fontSize: 13, cursor: "pointer", fontWeight: i === 0 ? 600 : 400 }}>
                {sec}
              </button>
            ))}
          </div>

          {/* Question card */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, marginBottom: 20 }} key={currentQ} className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: t.textMuted, background: t.bgHover, padding: "4px 12px", borderRadius: 6 }}>Q{currentQ + 1}/{totalQ}</span>
                <Badge text={q.subject} color={t.accent} />
                <Badge text={q.difficulty} color={q.difficulty === "Easy" ? t.success : q.difficulty === "Medium" ? t.warning : t.danger} />
              </div>
              <button onClick={() => setFlagged(p => p.includes(currentQ) ? p.filter(f => f !== currentQ) : [...p, currentQ])} style={{ background: "none", border: "none", cursor: "pointer", color: flagged.includes(currentQ) ? t.warning : t.textMuted, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <Icon path={Icons.flag} size={16} /> {flagged.includes(currentQ) ? "Flagged" : "Flag"}
              </button>
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 28, fontWeight: 500 }}>{q.text}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setAnswers(p => ({ ...p, [currentQ]: i }))} style={{
                  padding: "14px 18px", borderRadius: 10, border: `2px solid ${answers[currentQ] === i ? t.accent : t.border}`,
                  background: answers[currentQ] === i ? `${t.accent}15` : t.bgHover, color: t.text, fontSize: 14, textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${answers[currentQ] === i ? t.accent : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: answers[currentQ] === i ? t.accent : t.textMuted, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-save indicator */}
          <div style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.success }} />
            Auto-saved 2 seconds ago
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" style={{ padding: "11px 24px", fontSize: 14, flex: 1 }} onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>← Previous</button>
            <button className="btn-ghost" style={{ padding: "11px 24px", fontSize: 14, flex: 1, color: t.warning, borderColor: t.warning }} onClick={() => { setFlagged(p => [...p, currentQ]); setCurrentQ(q => Math.min(totalQ - 1, q + 1)); }}>Mark & Next</button>
            <button className="btn-primary" style={{ padding: "11px 24px", fontSize: 14, flex: 1 }} onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))}>Save & Next →</button>
          </div>
        </div>

        {/* Right sidebar: question palette + submit */}
        <div style={{ width: 260, background: t.bgCard, borderLeft: `1px solid ${t.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          {/* Legend */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Question Palette</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {[
                { label: "Answered", color: t.success }, { label: "Not Answered", color: t.border },
                { label: "Flagged", color: t.warning }, { label: "Current", color: t.accent }, { label: "Visited", color: t.textMuted },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: t.textMuted }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: l.color + "30", border: `1.5px solid ${l.color}` }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {MOCK_QUESTIONS.map((_, i) => {
              const status = getQStatus(i);
              return (
                <button key={i} onClick={() => setCurrentQ(i)} style={{
                  width: "100%", aspectRatio: "1", borderRadius: 6, border: `1.5px solid ${statusColors[status]}`,
                  background: statusBg[status], color: status === "not_visited" ? t.textMuted : statusColors[status], fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                }}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ padding: 14, borderRadius: 10, background: t.bgHover, border: `1px solid ${t.border}`, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: t.textMuted }}>Answered:</span>
              <span style={{ color: t.success, fontWeight: 700 }}>{Object.keys(answers).length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: t.textMuted }}>Not Answered:</span>
              <span style={{ color: t.danger, fontWeight: 700 }}>{totalQ - Object.keys(answers).length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: t.textMuted }}>Flagged:</span>
              <span style={{ color: t.warning, fontWeight: 700 }}>{flagged.length}</span>
            </div>
          </div>

          <button onClick={() => setModal(
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Submit Exam?</h2>
              <p style={{ color: t.textMuted, marginBottom: 20 }}>You have answered {Object.keys(answers).length}/{totalQ} questions. Are you sure you want to submit?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "10px 0" }} onClick={() => setModal(null)}>Review</button>
                <button className="btn-primary" style={{ flex: 1, padding: "10px 0" }} onClick={() => { setModal(null); setSubmitted(true); }}>Submit Now</button>
              </div>
            </div>
          )} className="btn-primary" style={{ padding: "13px 0", fontSize: 14, width: "100%" }}>
            Submit Exam
          </button>

          <button className="btn-ghost" style={{ padding: "10px 0", fontSize: 13, width: "100%" }} onClick={() => setCurrentView("dashboard")}>← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CODING INTERFACE
// ============================================================
function CodingInterface({ t, isDark, user, addToast, setCurrentView }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(`def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`);
  const [customInput, setCustomInput] = useState("[2,7,11,15]\n9");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState("testcases");

  const runCode = () => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      const results = MOCK_CODING_PROBLEM.testCases.map((tc, i) => ({
        ...tc,
        passed: i < 2, // Simulate 2 of 3 passing
        runtime: `${Math.floor(Math.random() * 50 + 20)}ms`,
        memory: `${(Math.random() * 2 + 14).toFixed(1)}MB`,
      }));
      setTestResults(results);
      setOutput("Output: [0, 1]\n\nExecution time: 32ms\nMemory: 15.2MB");
      setRunning(false);
      addToast("Code executed successfully", "success");
    }, 1500);
  };

  const submitCode = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      addToast("Solution submitted! 2/3 test cases passed", "warning");
    }, 2000);
  };

  const langStarters = {
    python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    javascript: `function twoSum(nums, target) {
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen[complement] !== undefined) {
            return [seen[complement], i];
        }
        seen[nums[i]] = i;
    }
    return [];
}`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: t.bg }}>
      {/* Header */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setCurrentView("dashboard")} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            ← Dashboard
          </button>
          <span style={{ color: t.border }}>|</span>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Python Programming Challenge</div>
          <Badge text="Coding" color={t.purple} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: t.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon path={Icons.clock} size={14} /> <span style={{ fontWeight: 700, color: t.warning }}>2:47:22</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={runCode} disabled={running} style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: t.success, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon path={Icons.play} size={14} /> {running ? "Running..." : "Run"}
            </button>
            <button onClick={submitCode} disabled={running} className="btn-primary" style={{ padding: "7px 18px", fontSize: 13 }}>Submit</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Problem */}
        <div style={{ width: "40%", borderRight: `1px solid ${t.border}`, overflowY: "auto", background: t.bgCard }}>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{MOCK_CODING_PROBLEM.title}</h2>
              <Badge text={MOCK_CODING_PROBLEM.difficulty} color={t.success} />
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.8, color: t.textSub, marginBottom: 20 }}>{MOCK_CODING_PROBLEM.description}</p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Examples</div>
              {MOCK_CODING_PROBLEM.examples.map((ex, i) => (
                <div key={i} style={{ background: t.bgHover, borderRadius: 8, padding: 14, marginBottom: 10, border: `1px solid ${t.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                  <div style={{ marginBottom: 6 }}><span style={{ color: t.textMuted }}>Input: </span><span style={{ color: t.text }}>{ex.input}</span></div>
                  <div style={{ marginBottom: 6 }}><span style={{ color: t.textMuted }}>Output: </span><span style={{ color: t.success }}>{ex.output}</span></div>
                  <div><span style={{ color: t.textMuted }}>Explanation: </span><span style={{ color: t.textSub }}>{ex.explanation}</span></div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Constraints</div>
              {MOCK_CODING_PROBLEM.constraints.map((c, i) => (
                <div key={i} style={{ fontSize: 13, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: t.textMuted, flexShrink: 0 }} /> {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Editor + Console */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 10, background: t.bgCard, flexShrink: 0 }}>
            <select value={language} onChange={e => { setLanguage(e.target.value); setCode(langStarters[e.target.value]); }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgHover, color: t.text, fontSize: 13, cursor: "pointer" }}>
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setCode(langStarters[language])}>Reset</button>
          </div>

          {/* Code area - simulated Monaco editor */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 50, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: 12, paddingRight: 8, gap: 0, zIndex: 1 }}>
              {code.split("\n").map((_, i) => <div key={i} style={{ fontSize: 12, color: t.textMuted, lineHeight: "21px", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>)}
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                position: "absolute", inset: 0, paddingLeft: 60, paddingTop: 12, paddingRight: 12, paddingBottom: 12, background: isDark ? "#0d1117" : "#f6f8fa",
                color: isDark ? "#c9d1d9" : "#24292e", border: "none", resize: "none", fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 13, lineHeight: "21px", outline: "none", width: "100%", height: "100%",
              }}
              spellCheck={false}
            />
          </div>

          {/* Console/Output */}
          <div style={{ height: 240, borderTop: `1px solid ${t.border}`, display: "flex", flexDirection: "column", background: t.bgCard, flexShrink: 0 }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, padding: "0 16px" }}>
              {["testcases", "output", "custominput"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 500,
                  color: activeTab === tab ? t.accent : t.textMuted, borderBottom: activeTab === tab ? `2px solid ${t.accent}` : "2px solid transparent",
                }}>
                  {tab === "testcases" ? "Test Cases" : tab === "output" ? "Output" : "Custom Input"}
                </button>
              ))}
              {running && <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textMuted }}><span className="pulse">●</span> Running...</div>}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
              {activeTab === "testcases" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {testResults.length > 0 ? testResults.map((tc, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${tc.passed ? t.success : t.danger}30`, background: `${tc.passed ? t.success : t.danger}10` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: tc.passed ? t.success : t.danger }}>{tc.passed ? "✓ Passed" : "✗ Failed"} — Case {i + 1}</span>
                        <span style={{ fontSize: 11, color: t.textMuted }}>{tc.runtime} · {tc.memory}</span>
                      </div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", color: t.textMuted }}>Input: {tc.input} → Expected: {tc.expected}</div>
                    </div>
                  )) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {MOCK_CODING_PROBLEM.testCases.map((tc, i) => (
                        <div key={i} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 12, fontFamily: "monospace", color: t.textMuted }}>
                          Case {i + 1}: {tc.input} → {tc.expected}
                        </div>
                      ))}
                      <div style={{ fontSize: 12, color: t.textMuted }}>🔒 3 hidden test cases</div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "output" && (
                <pre style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: output ? t.success : t.textMuted, lineHeight: 1.6 }}>
                  {output || "Run your code to see output here..."}
                </pre>
              )}
              {activeTab === "custominput" && (
                <div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>Custom Input (one value per line):</div>
                  <textarea value={customInput} onChange={e => setCustomInput(e.target.value)} style={{ width: "100%", height: 100, background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 12px", color: t.text, fontSize: 12, fontFamily: "monospace", resize: "none" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
