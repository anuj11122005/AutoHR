import { useState } from "react";
import s from "./Dashboard.module.css";
import ls from "./LeaveManagement.module.css";

// ═══════════════════════════════════════════════════════════
// n8n API LAYER
// When your n8n backend is ready, uncomment the fetch calls
// and set VITE_N8N_BASE_URL in your .env file
// ═══════════════════════════════════════════════════════════
const N8N_BASE = import.meta.env.VITE_N8N_BASE_URL || "https://your-n8n-instance.com/webhook";

const api = {
  async addEmployee(payload) {
    // ── UNCOMMENT when n8n is ready ──
    // const res = await fetch(`${N8N_BASE}/add-employee`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return res.json();

    await new Promise(r => setTimeout(r, 900)); // mock delay
    return { success: true, id: Date.now(), ...payload };
  },

  async postJob(payload) {
    // ── UNCOMMENT when n8n is ready ──
    // const res = await fetch(`${N8N_BASE}/post-job`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return res.json();

    await new Promise(r => setTimeout(r, 900));
    return { success: true, id: Date.now(), ...payload };
  },

  async updateLeave(id, status) {
    // ── UNCOMMENT when n8n is ready ──
    // const res = await fetch(`${N8N_BASE}/update-leave`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ id, status }),
    // });
    // return res.json();

    await new Promise(r => setTimeout(r, 400));
    return { success: true };
  },
};

// ═══════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════
const INITIAL_EMPLOYEES = [
  { id: 1, name: "Alex Johnson", dept: "Engineering", status: "Active",   salary: "₹82,000", joined: "Jan 2022", color: "#4fffb0" },
  { id: 2, name: "Priya Mehta",  dept: "Design",      status: "Active",   salary: "₹74,000", joined: "Mar 2023", color: "#4fb4ff" },
  { id: 3, name: "Rohit Kumar",  dept: "Marketing",   status: "On Leave", salary: "₹61,000", joined: "Aug 2021", color: "#ffb547" },
  { id: 4, name: "Neha Sharma",  dept: "HR",          status: "Active",   salary: "₹69,000", joined: "Nov 2022", color: "#ff5f7e" },
  { id: 5, name: "Karan Patel",  dept: "Engineering", status: "Active",   salary: "₹91,000", joined: "Feb 2020", color: "#c084fc" },
  { id: 6, name: "Anjali Rao",   dept: "Design",      status: "Active",   salary: "₹67,000", joined: "Jun 2022", color: "#4fb4ff" },
  { id: 7, name: "Dev Singh",    dept: "Engineering", status: "Active",   salary: "₹88,000", joined: "Oct 2019", color: "#4fffb0" },
  { id: 8, name: "Meena Joshi",  dept: "HR",          status: "Inactive", salary: "₹52,000", joined: "Apr 2021", color: "#ff5f7e" },
];

const INITIAL_JOBS = [
  { id: 1, title: "Senior React Developer", dept: "Engineering", applicants: 34, status: "Active",  posted: "Feb 10", type: "Full-time" },
  { id: 2, title: "UI/UX Designer",         dept: "Design",      applicants: 18, status: "Active",  posted: "Feb 14", type: "Full-time" },
  { id: 3, title: "HR Executive",           dept: "HR",          applicants: 12, status: "Active",  posted: "Feb 18", type: "Full-time" },
  { id: 4, title: "DevOps Engineer",        dept: "Engineering", applicants: 9,  status: "Paused",  posted: "Jan 30", type: "Contract" },
  { id: 5, title: "Content Writer",         dept: "Marketing",   applicants: 22, status: "Active",  posted: "Feb 20", type: "Part-time" },
  { id: 6, title: "Data Analyst",           dept: "Engineering", applicants: 15, status: "Closed",  posted: "Jan 15", type: "Full-time" },
];

const INITIAL_LEAVES = [
  { id: 1, name: "Rohit Kumar",  dept: "Marketing",   type: "Medical",   from: "2026-02-27", to: "2026-03-01", days: 3,  reason: "Fever and throat infection, doctor advised rest.",  status: "Pending",  color: "#ffb547", applied: "Feb 25" },
  { id: 2, name: "Anjali Rao",   dept: "Design",      type: "Casual",    from: "2026-03-01", to: "2026-03-01", days: 1,  reason: "Personal work.",                                   status: "Pending",  color: "#4fb4ff", applied: "Feb 26" },
  { id: 3, name: "Dev Singh",    dept: "Engineering", type: "Earned",    from: "2026-03-04", to: "2026-03-08", days: 5,  reason: "Family trip planned for a long time.",              status: "Approved", color: "#4fffb0", applied: "Feb 20" },
  { id: 4, name: "Meena Joshi",  dept: "HR",          type: "Casual",    from: "2026-03-06", to: "2026-03-07", days: 2,  reason: "Attending a wedding.",                             status: "Rejected", color: "#ff5f7e", applied: "Feb 22" },
  { id: 5, name: "Karan Patel",  dept: "Engineering", type: "Medical",   from: "2026-03-10", to: "2026-03-11", days: 2,  reason: "Dental surgery follow-up.",                        status: "Pending",  color: "#c084fc", applied: "Feb 27" },
  { id: 6, name: "Priya Mehta",  dept: "Design",      type: "Maternity", from: "2026-03-15", to: "2026-06-15", days: 90, reason: "Maternity leave as per company policy.",           status: "Approved", color: "#4fb4ff", applied: "Feb 10" },
  { id: 7, name: "Neha Sharma",  dept: "HR",          type: "Earned",    from: "2026-03-20", to: "2026-03-22", days: 3,  reason: "Visiting hometown.",                               status: "Pending",  color: "#ff5f7e", applied: "Feb 28" },
  { id: 8, name: "Alex Johnson", dept: "Engineering", type: "Casual",    from: "2026-03-03", to: "2026-03-03", days: 1,  reason: "Bank work and vehicle registration.",              status: "Approved", color: "#4fffb0", applied: "Feb 24" },
];

const LEAVE_BALANCE = [
  { name: "Rohit Kumar",  casual: 3, earned: 8,  medical: 2, total: 13 },
  { name: "Anjali Rao",   casual: 6, earned: 12, medical: 5, total: 23 },
  { name: "Dev Singh",    casual: 4, earned: 3,  medical: 6, total: 13 },
  { name: "Meena Joshi",  casual: 1, earned: 10, medical: 4, total: 15 },
  { name: "Karan Patel",  casual: 5, earned: 9,  medical: 3, total: 17 },
];

const PAYROLL_DATA = [
  { name: "Alex Johnson", dept: "Engineering", basic: "₹65,000", hra: "₹12,000", deductions: "₹4,800", net: "₹82,000", status: "Paid",    color: "#4fffb0" },
  { name: "Priya Mehta",  dept: "Design",      basic: "₹58,000", hra: "₹11,000", deductions: "₹4,200", net: "₹74,000", status: "Paid",    color: "#4fb4ff" },
  { name: "Rohit Kumar",  dept: "Marketing",   basic: "₹48,000", hra: "₹9,000",  deductions: "₹3,600", net: "₹61,000", status: "Pending", color: "#ffb547" },
  { name: "Neha Sharma",  dept: "HR",          basic: "₹54,000", hra: "₹10,000", deductions: "₹4,000", net: "₹69,000", status: "Paid",    color: "#ff5f7e" },
  { name: "Karan Patel",  dept: "Engineering", basic: "₹72,000", hra: "₹14,000", deductions: "₹5,200", net: "₹91,000", status: "Paid",    color: "#c084fc" },
];

const ACTIVITY = [
  { title: "New hire onboarded",       sub: "Karan Patel — Engineering", time: "2h ago", dot: "green" },
  { title: "Leave approved",           sub: "Dev Singh — 5 days",        time: "4h ago", dot: "blue" },
  { title: "Payroll processed",        sub: "February 2026 — 284 emp.", time: "1d ago", dot: "green" },
  { title: "Job application received", sub: "Senior React Developer",    time: "1d ago", dot: "orange" },
  { title: "Leave rejected",           sub: "Meena Joshi — reason sent",time: "2d ago", dot: "red" },
];

const ATTENDANCE = [55, 70, 60, 85, 90, 78, 92];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MAX_BAR = Math.max(...ATTENDANCE);

const DEPT_BREAKDOWN = [
  { label: "Engineering", pct: 38, color: "green" },
  { label: "Design",      pct: 14, color: "blue" },
  { label: "Marketing",   pct: 20, color: "orange" },
  { label: "HR",          pct: 12, color: "red" },
  { label: "Others",      pct: 16, color: "muted" },
];

const DEPTS         = ["Engineering", "Design", "Marketing", "HR", "Finance", "Operations"];
const STATUS_TABS   = ["All", "Pending", "Approved", "Rejected"];
const LEAVE_TYPES   = ["All Types", "Casual", "Medical", "Earned", "Maternity"];
const STATUS_COLOR  = { Pending: "orange", Approved: "green", Rejected: "red" };
const TYPE_COLOR    = { Casual: "blue", Medical: "red", Earned: "green", Maternity: "muted" };
const EMP_S_COLOR   = { Active: "green", "On Leave": "orange", Inactive: "red" };
const JOB_COLOR     = { Active: "green", Paused: "muted", Closed: "red" };
const JOB_T_COLOR   = { "Full-time": "green", "Part-time": "blue", Contract: "orange", Internship: "muted" };
const AVATAR_COLORS = ["#4fffb0","#4fb4ff","#ffb547","#ff5f7e","#c084fc","#f472b6","#34d399"];

const PAGE_META = {
  dashboard: { title: "HR Dashboard",    sub: "Welcome back, Sara" },
  employees: { title: "Employees",       sub: "Manage your workforce" },
  recruit:   { title: "Recruitment",     sub: "Track open positions & applicants" },
  leave:     { title: "Leave Management",sub: "Review, approve and track leave requests" },
  payroll:   { title: "Payroll",         sub: "February 2026 payroll summary" },
  reports:   { title: "Reports",         sub: "Analytics and insights" },
};

// ═══════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════
function Icon({ name, size = 17 }) {
  const p = {
    users:     <><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    clock:     <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
    search:    <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></>,
    employee:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    payroll:   <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    leave:     <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    recruit:   <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    report:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/><line x1="10" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5"/></>,
    check:     <><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>,
    close:     <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    download:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>{p[name]}</svg>;
}

// ═══════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ═══════════════════════════════════════════════════════════
function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`${ls.toast} ${ls[toast.type]}`}>{toast.msg}</div>;
}

const inputBase = {
  background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 9,
  padding: "10px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem",
  color: "var(--text)", outline: "none", width: "100%", transition: "border-color 0.2s, box-shadow 0.2s",
};

function FInput({ value, onChange, placeholder, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ ...inputBase, ...(f ? { borderColor:"var(--accent)", boxShadow:"0 0 0 3px rgba(79,255,176,0.1)" } : {}) }}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
}

function FSelect({ value, onChange, children }) {
  const [f, setF] = useState(false);
  return (
    <select value={value} onChange={onChange}
      style={{ ...inputBase, ...(f ? { borderColor:"var(--accent)", boxShadow:"0 0 0 3px rgba(79,255,176,0.1)" } : {}), cursor:"pointer", appearance:"none" }}
      onFocus={() => setF(true)} onBlur={() => setF(false)}>
      {children}
    </select>
  );
}

function FTextarea({ value, onChange, placeholder, rows = 4 }) {
  const [f, setF] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ ...inputBase, ...(f ? { borderColor:"var(--accent)", boxShadow:"0 0 0 3px rgba(79,255,176,0.1)" } : {}), resize:"vertical", lineHeight:1.6 }}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
}

function Label({ children }) {
  return <label style={{ fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:6 }}>{children}</label>;
}

function FieldErr({ msg }) {
  return msg ? <span style={{ fontSize:"0.7rem", color:"var(--danger)", marginTop:3, display:"block" }}>{msg}</span> : null;
}

function PrimaryBtn({ onClick, loading, disabled, children, style = {} }) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 20px", borderRadius:9, border:"none",
        background:"var(--accent)", color:"#0b0d11", fontFamily:"'Syne',sans-serif", fontWeight:700,
        fontSize:"0.85rem", cursor: (loading||disabled) ? "not-allowed" : "pointer",
        opacity: (loading||disabled) ? 0.7 : 1, transition:"opacity 0.15s, transform 0.12s", ...style }}>
      {loading
        ? <span style={{ width:16,height:16,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0b0d11",borderRadius:"50%",display:"inline-block",animation:"hrSpin 0.7s linear infinite" }}/>
        : children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:9,
        border:"1px solid var(--border)", background:"var(--surface2)", color:"var(--text)",
        fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", cursor:"pointer" }}>
      {children}
    </button>
  );
}

// Generic modal shell
function Modal({ open, onClose, eyebrow, title, sub, children, footer }) {
  if (!open) return null;
  return (
    <div className={ls.modalOverlay} onClick={onClose}>
      <div className={ls.modal} style={{ width:540, maxHeight:"90vh", display:"flex", flexDirection:"column" }} onClick={e => e.stopPropagation()}>
        <div className={ls.modalHead}>
          <div>
            {eyebrow && <p className={ls.modalEyebrow}>{eyebrow}</p>}
            <h3 className={ls.modalTitle}>{title}</h3>
            {sub && <p className={ls.modalSub}>{sub}</p>}
          </div>
          <button className={ls.modalClose} onClick={onClose}><Icon name="close" size={18}/></button>
        </div>
        <div className={ls.modalBody} style={{ overflowY:"auto", flex:1 }}>{children}</div>
        {footer && <div className={ls.modalActions}>{footer}</div>}
      </div>
    </div>
  );
}

// Stat card
function StatCard({ label, value, change, trend, color, icon }) {
  return (
    <div className={s.statCard}>
      <div className={s.statCardTop}>
        <div className={`${s.statCardIcon} ${s[color]}`}><Icon name={icon}/></div>
        <span className={`${s.statCardChange} ${s[trend]}`}>{change}</span>
      </div>
      <div><div className={s.statCardVal}>{value}</div><div className={s.statCardLabel}>{label}</div></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADD EMPLOYEE MODAL
// ═══════════════════════════════════════════════════════════
const EMPTY_EMP = { name:"", email:"", phone:"", dept:"Engineering", role:"", salary:"", joined:"", status:"Active" };

function AddEmployeeModal({ open, onClose, onAdd, showToast }) {
  const [form, setForm]       = useState(EMPTY_EMP);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = key => e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(ev => ({ ...ev, [key]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = "Full name is required";
    if (!form.email.trim())  e.email  = "Email is required";
    if (!form.salary.trim()) e.salary = "Salary is required";
    if (!form.joined)        e.joined = "Joining date is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await api.addEmployee(form);
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      // Format date for display
      const d = new Date(form.joined);
      const joinedDisplay = `${d.toLocaleString("default",{month:"short"})} ${d.getFullYear()}`;
      onAdd({ ...form, id: result.id, color, joined: joinedDisplay });
      showToast(`${form.name} added successfully!`, "green");
      setForm(EMPTY_EMP);
      setErrors({});
      onClose();
    } catch {
      showToast("Failed to add employee. Please try again.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} eyebrow="New Employee" title="Add Employee" sub="Fill in details to onboard a new team member"
      footer={<><GhostBtn onClick={onClose}>Cancel</GhostBtn><PrimaryBtn onClick={handleSubmit} loading={loading}><Icon name="plus" size={15}/>Add Employee</PrimaryBtn></>}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <Label>Full Name *</Label>
          <FInput value={form.name} onChange={set("name")} placeholder="Alex Johnson"/>
          <FieldErr msg={errors.name}/>
        </div>
        <div>
          <Label>Email *</Label>
          <FInput type="email" value={form.email} onChange={set("email")} placeholder="alex@company.com"/>
          <FieldErr msg={errors.email}/>
        </div>
        <div>
          <Label>Phone</Label>
          <FInput value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210"/>
        </div>
        <div>
          <Label>Department</Label>
          <FSelect value={form.dept} onChange={set("dept")}>{DEPTS.map(d=><option key={d}>{d}</option>)}</FSelect>
        </div>
        <div>
          <Label>Job Role</Label>
          <FInput value={form.role} onChange={set("role")} placeholder="Senior Developer"/>
        </div>
        <div>
          <Label>Salary *</Label>
          <FInput value={form.salary} onChange={set("salary")} placeholder="₹75,000"/>
          <FieldErr msg={errors.salary}/>
        </div>
        <div>
          <Label>Joining Date *</Label>
          <FInput type="date" value={form.joined} onChange={set("joined")}/>
          <FieldErr msg={errors.joined}/>
        </div>
        <div>
          <Label>Status</Label>
          <FSelect value={form.status} onChange={set("status")}><option>Active</option><option>Inactive</option></FSelect>
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// POST JOB MODAL
// ═══════════════════════════════════════════════════════════
const EMPTY_JOB = { title:"", dept:"Engineering", type:"Full-time", location:"", experience:"", description:"", status:"Active" };

function PostJobModal({ open, onClose, onAdd, showToast }) {
  const [form, setForm]       = useState(EMPTY_JOB);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = key => e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(ev => ({ ...ev, [key]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Job title is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await api.postJob(form);
      const now = new Date();
      const posted = `${now.toLocaleString("default",{month:"short"})} ${now.getDate()}`;
      onAdd({ ...form, id: result.id, applicants: 0, posted });
      showToast(`"${form.title}" posted successfully!`, "green");
      setForm(EMPTY_JOB);
      setErrors({});
      onClose();
    } catch {
      showToast("Failed to post job. Please try again.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} eyebrow="New Position" title="Post a Job" sub="Create a new job listing for your team"
      footer={<><GhostBtn onClick={onClose}>Cancel</GhostBtn><PrimaryBtn onClick={handleSubmit} loading={loading}><Icon name="plus" size={15}/>Post Job</PrimaryBtn></>}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <Label>Job Title *</Label>
          <FInput value={form.title} onChange={set("title")} placeholder="Senior React Developer"/>
          <FieldErr msg={errors.title}/>
        </div>
        <div>
          <Label>Department</Label>
          <FSelect value={form.dept} onChange={set("dept")}>{DEPTS.map(d=><option key={d}>{d}</option>)}</FSelect>
        </div>
        <div>
          <Label>Job Type</Label>
          <FSelect value={form.type} onChange={set("type")}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></FSelect>
        </div>
        <div>
          <Label>Location</Label>
          <FInput value={form.location} onChange={set("location")} placeholder="Remote / Mumbai"/>
        </div>
        <div>
          <Label>Experience Required</Label>
          <FInput value={form.experience} onChange={set("experience")} placeholder="2–4 years"/>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <Label>Job Description</Label>
          <FTextarea value={form.description} onChange={set("description")} placeholder="Describe responsibilities, requirements, perks…"/>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <Label>Initial Status</Label>
          <FSelect value={form.status} onChange={set("status")}><option>Active</option><option>Paused</option></FSelect>
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// LEAVE DETAIL MODAL
// ═══════════════════════════════════════════════════════════
function LeaveDetailModal({ selected, onClose, onUpdate }) {
  if (!selected) return null;
  return (
    <div className={ls.modalOverlay} onClick={onClose}>
      <div className={ls.modal} onClick={e => e.stopPropagation()}>
        <div className={ls.modalHead}>
          <div>
            <p className={ls.modalEyebrow}>Leave Request</p>
            <h3 className={ls.modalTitle}>{selected.name}</h3>
            <p className={ls.modalSub}>{selected.dept}</p>
          </div>
          <button className={ls.modalClose} onClick={onClose}><Icon name="close" size={18}/></button>
        </div>
        <div className={ls.modalBody}>
          <div className={ls.modalGrid}>
            <div className={ls.modalField}><span className={ls.modalLabel}>Leave Type</span><span className={`${s.badge} ${s[TYPE_COLOR[selected.type]]}`}>{selected.type}</span></div>
            <div className={ls.modalField}><span className={ls.modalLabel}>Status</span><span className={`${s.badge} ${s[STATUS_COLOR[selected.status]]}`}>{selected.status}</span></div>
            <div className={ls.modalField}><span className={ls.modalLabel}>From</span><span className={ls.modalVal}>{selected.from}</span></div>
            <div className={ls.modalField}><span className={ls.modalLabel}>To</span><span className={ls.modalVal}>{selected.to}</span></div>
            <div className={ls.modalField}><span className={ls.modalLabel}>Duration</span><span className={ls.modalVal}>{selected.days} day{selected.days > 1 ? "s" : ""}</span></div>
            <div className={ls.modalField}><span className={ls.modalLabel}>Applied On</span><span className={ls.modalVal}>{selected.applied}</span></div>
          </div>
          <div className={ls.modalReason}>
            <span className={ls.modalLabel}>Reason</span>
            <p className={ls.modalReasonText}>{selected.reason}</p>
          </div>
        </div>
        {selected.status === "Pending" ? (
          <div className={ls.modalActions}>
            <button className={ls.rejectBtn} onClick={() => onUpdate(selected.id, "Rejected")}><Icon name="x" size={15}/> Reject</button>
            <button className={ls.approveBtn} onClick={() => onUpdate(selected.id, "Approved")}><Icon name="check" size={15}/> Approve</button>
          </div>
        ) : (
          <div className={ls.modalActions}>
            <p className={ls.modalDone}>This request has been <strong>{selected.status.toLowerCase()}</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════

// ── Dashboard ─────────────────────────────────────────────
function DashboardPage({ onNavigate, employees, leaveRequests, jobs }) {
  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"Total Employees", value:employees.length, change:"+12", trend:"up", color:"green", icon:"users" },
          { label:"Open Positions",  value:jobs.filter(j=>j.status==="Active").length, change:"+3", trend:"up", color:"blue", icon:"briefcase" },
          { label:"On Leave Today",  value:employees.filter(e=>e.status==="On Leave").length, change:"-2", trend:"down", color:"orange", icon:"calendar" },
          { label:"Pending Leaves",  value:leaveRequests.filter(r=>r.status==="Pending").length, change:"new", trend:"neutral", color:"red", icon:"clock" },
        ].map(st => <StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.grid3}>
        <div className={s.panel}>
          <div className={s.panelHead}><span className={s.panelTitle}>Recent Employees</span><button className={s.panelAction} onClick={()=>onNavigate("employees")}>View all →</button></div>
          <div className={s.panelBody}>
            <table className={s.table}>
              <thead><tr><th>Name</th><th>Department</th><th>Salary</th><th>Status</th></tr></thead>
              <tbody>
                {employees.slice(0,5).map(emp=>(
                  <tr key={emp.id}>
                    <td><div className={s.avatarRow}><div className={s.avatarSm} style={{background:emp.color+"33",color:emp.color}}>{emp.name.split(" ").map(n=>n[0]).join("")}</div><div><div className={s.avatarName}>{emp.name}</div><div className={s.avatarSub}>Since {emp.joined}</div></div></div></td>
                    <td style={{color:"var(--muted)",fontSize:"0.8rem"}}>{emp.dept}</td>
                    <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:"0.83rem"}}>{emp.salary}</td>
                    <td><span className={`${s.badge} ${s[EMP_S_COLOR[emp.status]]}`}>{emp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={s.panel}>
          <div className={s.panelHead}><span className={s.panelTitle}>Leave Requests</span><button className={s.panelAction} onClick={()=>onNavigate("leave")}>Manage →</button></div>
          <div className={s.panelBody}>
            {leaveRequests.slice(0,4).map((req,i)=>(
              <div className={s.listItem} key={i}>
                <div className={`${s.listDot} ${s[STATUS_COLOR[req.status]]}`}/>
                <div className={s.listMain}><div className={s.listTitle}>{req.name}</div><div className={s.listSub}>{req.type} · {req.days}d from {req.from}</div></div>
                <span className={`${s.badge} ${s[STATUS_COLOR[req.status]]}`}>{req.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.grid2}>
        <div className={s.panel}>
          <div className={s.panelHead}><span className={s.panelTitle}>Open Positions</span><button className={s.panelAction} onClick={()=>onNavigate("recruit")}>View all →</button></div>
          <div className={s.panelBody}>
            <table className={s.table}>
              <thead><tr><th>Role</th><th>Department</th><th>Applicants</th><th>Status</th></tr></thead>
              <tbody>
                {jobs.slice(0,4).map((job,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:500,fontSize:"0.83rem"}}>{job.title}</td>
                    <td style={{color:"var(--muted)",fontSize:"0.8rem"}}>{job.dept}</td>
                    <td><div className={s.progressWrap}><div className={s.progressBar}><div className={s.progressFill} style={{width:`${Math.min(job.applicants*2,100)}%`}}/></div><span className={s.progressPct}>{job.applicants}</span></div></td>
                    <td><span className={`${s.badge} ${s[JOB_COLOR[job.status]]}`}>{job.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div className={s.panel}>
            <div className={s.panelHead}><span className={s.panelTitle}>Attendance This Week</span><span style={{fontSize:"0.75rem",color:"var(--accent)"}}>Avg 76%</span></div>
            <div className={s.panelBody}>
              <div className={s.chartBars}>{ATTENDANCE.map((v,i)=><div key={i} className={`${s.bar} ${i===4?s.active:""}`} style={{height:`${(v/MAX_BAR)*100}%`}} title={`${DAYS[i]}: ${v}%`}/>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>{DAYS.map(d=><span key={d} style={{fontSize:"0.65rem",color:"var(--muted2)",flex:1,textAlign:"center"}}>{d}</span>)}</div>
            </div>
          </div>
          <div className={s.panel}>
            <div className={s.panelHead}><span className={s.panelTitle}>Dept. Breakdown</span></div>
            <div className={s.panelBody}>
              <div className={s.ringWrap}>
                <div className={s.ring} style={{"--p1":"38%","--p2":"52%","--p3":"72%"}}>
                  <div className={s.ringInner}><div className={s.ringVal}>{employees.length}</div><div className={s.ringLbl}>total</div></div>
                </div>
                <div className={s.ringLegend}>
                  {DEPT_BREAKDOWN.map(d=>(
                    <div className={s.legendItem} key={d.label}>
                      <div className={s.legendDot} style={{background:d.color==="green"?"var(--accent)":d.color==="blue"?"var(--info)":d.color==="orange"?"var(--warning)":d.color==="red"?"var(--danger)":"var(--muted2)"}}/>
                      {d.label}<strong style={{marginLeft:"auto",paddingLeft:8,color:"var(--text)"}}>{d.pct}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.panel}>
        <div className={s.panelHead}><span className={s.panelTitle}>Recent Activity</span></div>
        <div className={s.panelBody} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))"}}>
          {ACTIVITY.map((a,i)=>(
            <div className={s.listItem} key={i}>
              <div className={`${s.listDot} ${s[a.dot]}`}/>
              <div className={s.listMain}><div className={s.listTitle}>{a.title}</div><div className={s.listSub}>{a.sub}</div></div>
              <div className={s.listTime}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Employees ─────────────────────────────────────────────
function EmployeesPage({ employees, onAdd }) {
  const [search, setSearch]     = useState("");
  const [dept, setDept]         = useState("All");
  const [showModal, setModal]   = useState(false);
  const [toast, setToast]       = useState(null);
  const showToast = (msg,type="green") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const tabs = ["All", ...DEPTS];
  const filtered = employees.filter(e =>
    (dept==="All" || e.dept===dept) && e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toast toast={toast}/>
      <AddEmployeeModal open={showModal} onClose={()=>setModal(false)} onAdd={onAdd} showToast={showToast}/>

      {/* Spin keyframe injected once */}
      <style>{`@keyframes hrSpin { to { transform: rotate(360deg); } }`}</style>

      <div className={s.statsGrid}>
        {[
          { label:"Total Employees", value:employees.length, change:"+12", trend:"up",      color:"green",  icon:"users" },
          { label:"Active",          value:employees.filter(e=>e.status==="Active").length, change:`${Math.round(employees.filter(e=>e.status==="Active").length/employees.length*100)}%`, trend:"up", color:"blue", icon:"check" },
          { label:"On Leave",        value:employees.filter(e=>e.status==="On Leave").length, change:"today", trend:"neutral", color:"orange", icon:"calendar" },
          { label:"Inactive",        value:employees.filter(e=>e.status==="Inactive").length, change:"-1", trend:"up", color:"red", icon:"x" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.panel}>
        <div className={ls.filterBar}>
          <div className={ls.tabs}>
            {tabs.map(t=>(
              <button key={t} className={`${ls.tab} ${dept===t?ls.tabActive:""}`} onClick={()=>setDept(t)}>
                {t}<span className={ls.tabCount}>{t==="All"?employees.length:employees.filter(e=>e.dept===t).length}</span>
              </button>
            ))}
          </div>
          <div className={ls.filterRight}>
            <div className={ls.searchWrap}><Icon name="search" size={15}/><input className={ls.searchInput} placeholder="Search employee…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <button onClick={()=>setModal(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,border:"none",background:"var(--accent)",color:"#0b0d11",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",whiteSpace:"nowrap"}}>
              <Icon name="plus" size={14}/> Add Employee
            </button>
          </div>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Employee</th><th>Department</th><th>Salary</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={5}><div className={s.emptyState}><Icon name="user" size={28}/><p>No employees found.</p></div></td></tr>
                : filtered.map(emp=>(
                  <tr key={emp.id} className={ls.tableRow}>
                    <td><div className={s.avatarRow}><div className={s.avatarSm} style={{background:emp.color+"33",color:emp.color}}>{emp.name.split(" ").map(n=>n[0]).join("")}</div><div><div className={s.avatarName}>{emp.name}</div><div className={s.avatarSub}>{emp.role||emp.dept}</div></div></div></td>
                    <td style={{color:"var(--muted)",fontSize:"0.8rem"}}>{emp.dept}</td>
                    <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:"0.83rem"}}>{emp.salary}</td>
                    <td style={{color:"var(--muted)",fontSize:"0.78rem"}}>{emp.joined}</td>
                    <td><span className={`${s.badge} ${s[EMP_S_COLOR[emp.status]]}`}>{emp.status}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Recruitment ───────────────────────────────────────────
function RecruitmentPage({ jobs, onAddJob }) {
  const [showModal, setModal] = useState(false);
  const [toast, setToast]     = useState(null);
  const showToast = (msg,type="green") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  return (
    <>
      <Toast toast={toast}/>
      <PostJobModal open={showModal} onClose={()=>setModal(false)} onAdd={onAddJob} showToast={showToast}/>
      <style>{`@keyframes hrSpin { to { transform: rotate(360deg); } }`}</style>

      <div className={s.statsGrid}>
        {[
          { label:"Open Positions",   value:jobs.filter(j=>j.status==="Active").length, change:"+3",       trend:"up",      color:"green",  icon:"recruit" },
          { label:"Total Applicants", value:jobs.reduce((a,j)=>a+j.applicants,0),       change:"+24",      trend:"up",      color:"blue",   icon:"users" },
          { label:"Interviews Today", value:6,                                            change:"scheduled",trend:"neutral", color:"orange", icon:"calendar" },
          { label:"Offers Sent",      value:3,                                            change:"this week",trend:"up",      color:"red",    icon:"check" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.panel}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>Job Listings</span>
          <button onClick={()=>setModal(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,border:"none",background:"var(--accent)",color:"#0b0d11",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"}}>
            <Icon name="plus" size={14}/> Post New Job
          </button>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Role</th><th>Department</th><th>Type</th><th>Applicants</th><th>Posted</th><th>Status</th></tr></thead>
            <tbody>
              {jobs.map(job=>(
                <tr key={job.id} className={ls.tableRow}>
                  <td style={{fontWeight:500,fontSize:"0.83rem"}}>{job.title}</td>
                  <td style={{color:"var(--muted)",fontSize:"0.8rem"}}>{job.dept}</td>
                  <td><span className={`${s.badge} ${s[JOB_T_COLOR[job.type]]}`}>{job.type}</span></td>
                  <td><div className={s.progressWrap}><div className={s.progressBar}><div className={s.progressFill} style={{width:`${Math.min(job.applicants*2,100)}%`}}/></div><span className={s.progressPct}>{job.applicants}</span></div></td>
                  <td style={{color:"var(--muted)",fontSize:"0.78rem"}}>{job.posted}</td>
                  <td><span className={`${s.badge} ${s[JOB_COLOR[job.status]]}`}>{job.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Leave ─────────────────────────────────────────────────
function LeavePage({ leaveRequests, onUpdateLeave }) {
  const [tab, setTab]           = useState("All");
  const [typeF, setTypeF]       = useState("All Types");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState(null);
  const showToast = (msg,type="green") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const pending  = leaveRequests.filter(r=>r.status==="Pending").length;
  const approved = leaveRequests.filter(r=>r.status==="Approved").length;
  const rejected = leaveRequests.filter(r=>r.status==="Rejected").length;
  const totalDays = leaveRequests.filter(r=>r.status==="Approved").reduce((a,r)=>a+r.days,0);

  const filtered = leaveRequests.filter(r=>
    (tab==="All"||r.status===tab) &&
    (typeF==="All Types"||r.type===typeF) &&
    (r.name.toLowerCase().includes(search.toLowerCase())||r.dept.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpdate = async (id, newStatus) => {
    try {
      await api.updateLeave(id, newStatus);
      onUpdateLeave(id, newStatus);
      setSelected(prev=>prev?{...prev,status:newStatus}:null);
      showToast(newStatus==="Approved"?"Leave request approved.":"Leave request rejected.", newStatus==="Approved"?"green":"red");
    } catch {
      showToast("Action failed. Please try again.", "red");
    }
  };

  return (
    <>
      <Toast toast={toast}/>
      <LeaveDetailModal selected={selected} onClose={()=>setSelected(null)} onUpdate={handleUpdate}/>

      <div className={s.statsGrid}>
        {[
          { label:"Total Requests", value:leaveRequests.length, change:"this month",    trend:"neutral",              color:"blue",   icon:"calendar" },
          { label:"Pending",        value:pending,               change:"action needed", trend:pending>0?"down":"up",  color:"orange", icon:"clock" },
          { label:"Approved",       value:approved,              change:`${totalDays} days`, trend:"up",               color:"green",  icon:"check" },
          { label:"Rejected",       value:rejected,              change:"this month",    trend:"neutral",              color:"red",    icon:"x" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.panel}>
        <div className={ls.filterBar}>
          <div className={ls.tabs}>
            {STATUS_TABS.map(t=>(
              <button key={t} className={`${ls.tab} ${tab===t?ls.tabActive:""}`} onClick={()=>setTab(t)}>
                {t}<span className={ls.tabCount}>{t==="All"?leaveRequests.length:leaveRequests.filter(r=>r.status===t).length}</span>
              </button>
            ))}
          </div>
          <div className={ls.filterRight}>
            <div className={ls.searchWrap}><Icon name="search" size={15}/><input className={ls.searchInput} placeholder="Search name or dept…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <div className={ls.selectWrap}><Icon name="filter" size={14}/><select className={ls.filterSelect} value={typeF} onChange={e=>setTypeF(e.target.value)}>{LEAVE_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Employee</th><th>Type</th><th>Duration</th><th>Dates</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={7}><div className={s.emptyState}><Icon name="calendar" size={28}/><p>No requests match your filters.</p></div></td></tr>
                : filtered.map(req=>(
                  <tr key={req.id} className={ls.tableRow}>
                    <td><div className={s.avatarRow}><div className={s.avatarSm} style={{background:req.color+"28",color:req.color}}>{req.name.split(" ").map(n=>n[0]).join("")}</div><div><div className={s.avatarName}>{req.name}</div><div className={s.avatarSub}>{req.dept}</div></div></div></td>
                    <td><span className={`${s.badge} ${s[TYPE_COLOR[req.type]]}`}>{req.type}</span></td>
                    <td><span className={ls.daysChip}>{req.days} day{req.days>1?"s":""}</span></td>
                    <td style={{fontSize:"0.78rem",color:"var(--muted)"}}>{req.from} → {req.to}</td>
                    <td style={{fontSize:"0.78rem",color:"var(--muted2)"}}>{req.applied}</td>
                    <td><span className={`${s.badge} ${s[STATUS_COLOR[req.status]]}`}>{req.status}</span></td>
                    <td>
                      <div className={ls.actionBtns}>
                        <button className={ls.viewBtn} onClick={()=>setSelected(req)} title="View"><Icon name="eye" size={14}/></button>
                        {req.status==="Pending"&&<>
                          <button className={ls.approveIconBtn} onClick={()=>handleUpdate(req.id,"Approved")} title="Approve"><Icon name="check" size={14}/></button>
                          <button className={ls.rejectIconBtn}  onClick={()=>handleUpdate(req.id,"Rejected")} title="Reject"><Icon name="x" size={14}/></button>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.panel} style={{marginTop:20}}>
        <div className={s.panelHead}><span className={s.panelTitle}>Employee Leave Balance</span><span style={{fontSize:"0.75rem",color:"var(--muted)"}}>FY 2025–26</span></div>
        <div className={s.panelBody}>
          <table className={s.table}>
            <thead><tr><th>Employee</th><th>Casual</th><th>Earned</th><th>Medical</th><th>Total Remaining</th></tr></thead>
            <tbody>
              {LEAVE_BALANCE.map((emp,i)=>(
                <tr key={i}>
                  <td><div className={s.avatarRow}><div className={s.avatarSm} style={{background:"var(--border)",color:"var(--muted)"}}>{emp.name.split(" ").map(n=>n[0]).join("")}</div><span className={s.avatarName}>{emp.name}</span></div></td>
                  <td><div className={s.progressWrap}><div className={s.progressBar}><div className={`${s.progressFill} ${s.blue}`} style={{width:`${(emp.casual/12)*100}%`}}/></div><span className={s.progressPct}>{emp.casual}</span></div></td>
                  <td><div className={s.progressWrap}><div className={s.progressBar}><div className={s.progressFill} style={{width:`${(emp.earned/20)*100}%`}}/></div><span className={s.progressPct}>{emp.earned}</span></div></td>
                  <td><div className={s.progressWrap}><div className={s.progressBar}><div className={`${s.progressFill} ${s.orange}`} style={{width:`${(emp.medical/10)*100}%`}}/></div><span className={s.progressPct}>{emp.medical}</span></div></td>
                  <td><span className={`${s.badge} ${emp.total>18?s.green:emp.total>10?s.orange:s.red}`}>{emp.total} days</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Payroll ───────────────────────────────────────────────
function PayrollPage() {
  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"Total Disbursed", value:"₹3.79L", change:"Feb 2026", trend:"neutral", color:"green",  icon:"payroll" },
          { label:"Employees Paid",  value:"283",     change:"99.6%",    trend:"up",      color:"blue",   icon:"check" },
          { label:"Pending",         value:"1",       change:"action",   trend:"down",    color:"orange", icon:"clock" },
          { label:"Avg. Salary",     value:"₹75.8k",  change:"+2.1%",    trend:"up",      color:"red",    icon:"users" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>
      <div className={s.panel}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>February 2026 Payroll</span>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.82rem",cursor:"pointer"}}>
            <Icon name="download" size={14}/> Export
          </button>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Employee</th><th>Department</th><th>Basic</th><th>HRA</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead>
            <tbody>
              {PAYROLL_DATA.map((emp,i)=>(
                <tr key={i} className={ls.tableRow}>
                  <td><div className={s.avatarRow}><div className={s.avatarSm} style={{background:emp.color+"33",color:emp.color}}>{emp.name.split(" ").map(n=>n[0]).join("")}</div><span className={s.avatarName}>{emp.name}</span></div></td>
                  <td style={{color:"var(--muted)",fontSize:"0.8rem"}}>{emp.dept}</td>
                  <td style={{fontSize:"0.83rem"}}>{emp.basic}</td>
                  <td style={{fontSize:"0.83rem"}}>{emp.hra}</td>
                  <td style={{fontSize:"0.83rem",color:"var(--danger)"}}>−{emp.deductions}</td>
                  <td style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.88rem",color:"var(--accent)"}}>{emp.net}</td>
                  <td><span className={`${s.badge} ${emp.status==="Paid"?s.green:s.orange}`}>{emp.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Reports ───────────────────────────────────────────────
function ReportsPage() {
  const reports = [
    { title:"Monthly Headcount Report",   desc:"Employee count by dept — Feb 2026", date:"Mar 1, 2026",  type:"HR",         size:"142 KB" },
    { title:"Attendance Summary",         desc:"Weekly attendance trends",           date:"Feb 28, 2026", type:"Attendance", size:"89 KB" },
    { title:"Leave Utilisation Report",   desc:"Leave taken vs. balance",            date:"Feb 25, 2026", type:"Leave",      size:"204 KB" },
    { title:"Payroll Summary — Feb 2026", desc:"Full payroll breakdown",             date:"Feb 28, 2026", type:"Payroll",    size:"317 KB" },
    { title:"Recruitment Pipeline",       desc:"Applicants, interviews, offers",     date:"Feb 20, 2026", type:"Recruit",    size:"178 KB" },
  ];
  const tc = { HR:"green", Attendance:"blue", Leave:"orange", Payroll:"red", Recruit:"muted" };
  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"Reports Generated", value:"24", change:"this month", trend:"up",      color:"green",  icon:"report" },
          { label:"Scheduled",         value:"6",  change:"upcoming",   trend:"neutral", color:"blue",   icon:"calendar" },
          { label:"Shared",            value:"11", change:"with team",  trend:"up",      color:"orange", icon:"users" },
          { label:"Pending Review",    value:"3",  change:"action",     trend:"down",    color:"red",    icon:"clock" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>
      <div className={s.panel}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>Recent Reports</span>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,border:"none",background:"var(--accent)",color:"#0b0d11",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"}}>
            <Icon name="plus" size={14}/> Generate Report
          </button>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Report</th><th>Type</th><th>Generated</th><th>Size</th><th>Action</th></tr></thead>
            <tbody>
              {reports.map((r,i)=>(
                <tr key={i} className={ls.tableRow}>
                  <td><div className={s.avatarName}>{r.title}</div><div className={s.avatarSub}>{r.desc}</div></td>
                  <td><span className={`${s.badge} ${s[tc[r.type]]}`}>{r.type}</span></td>
                  <td style={{color:"var(--muted)",fontSize:"0.78rem"}}>{r.date}</td>
                  <td style={{color:"var(--muted2)",fontSize:"0.78rem"}}>{r.size}</td>
                  <td><button className={ls.viewBtn} title="Download"><Icon name="download" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT COMPONENT — shared state lives here
// ═══════════════════════════════════════════════════════════
export default function HRDashboard() {
  const [activeNav, setActiveNav]  = useState("dashboard");
  const [employees, setEmployees]  = useState(INITIAL_EMPLOYEES);
  const [jobs, setJobs]            = useState(INITIAL_JOBS);
  const [leaves, setLeaves]        = useState(INITIAL_LEAVES);

  const addEmployee = emp    => setEmployees(prev => [emp, ...prev]);
  const addJob      = job    => setJobs(prev => [job, ...prev]);
  const updateLeave = (id,st)=> setLeaves(prev => prev.map(r => r.id===id ? {...r,status:st} : r));

  const pendingLeaves = leaves.filter(r => r.status==="Pending").length;
  const activeJobs    = jobs.filter(j => j.status==="Active").length;

  const nav = [
    { id:"dashboard", label:"Dashboard",   icon:"dashboard" },
    { id:"employees", label:"Employees",   icon:"employee" },
    { id:"recruit",   label:"Recruitment", icon:"recruit",  badge: activeJobs },
    { id:"leave",     label:"Leave",       icon:"leave",    badge: pendingLeaves },
    { id:"payroll",   label:"Payroll",     icon:"payroll" },
    { id:"reports",   label:"Reports",     icon:"report" },
  ];

  const renderPage = () => {
    switch (activeNav) {
      case "dashboard": return <DashboardPage onNavigate={setActiveNav} employees={employees} leaveRequests={leaves} jobs={jobs}/>;
      case "employees": return <EmployeesPage employees={employees} onAdd={addEmployee}/>;
      case "recruit":   return <RecruitmentPage jobs={jobs} onAddJob={addJob}/>;
      case "leave":     return <LeavePage leaveRequests={leaves} onUpdateLeave={updateLeave}/>;
      case "payroll":   return <PayrollPage/>;
      case "reports":   return <ReportsPage/>;
      default:          return <DashboardPage onNavigate={setActiveNav} employees={employees} leaveRequests={leaves} jobs={jobs}/>;
    }
  };

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.sidebarBrand}>
          <div className={s.brandIcon}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2Z" fill="#0b0d11"/>
              <path d="M9 12l2 2 4-4" stroke="#4fffb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={s.brandName}>Auto<span>HR</span></span>
        </div>
        <div className={s.navSection}>
          <p className={s.navLabel}>Main</p>
          {nav.map(item=>(
            <button key={item.id} className={`${s.navItem} ${activeNav===item.id?s.active:""}`} onClick={()=>setActiveNav(item.id)}>
              <Icon name={item.icon}/>
              {item.label}
              {item.badge>0&&<span className={s.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </div>
        <div className={s.sidebarBottom}>
          <div className={s.userCard}>
            <div className={s.avatar}>SW</div>
            <div className={s.userInfo}>
              <div className={s.userName}>Sara Williams</div>
              <div className={s.userRole}>HR Manager</div>
            </div>
            <button className={s.logoutBtn} onClick={()=>{localStorage.clear();window.location.href="/login";}} title="Logout">
              <Icon name="logout"/>
            </button>
          </div>
        </div>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <h1>{PAGE_META[activeNav].title}</h1>
            <p>{PAGE_META[activeNav].sub}</p>
          </div>
          <div className={s.topbarRight}>
            <span className={s.rolePill}>HR Manager</span>
            <div className={s.iconBtn}><Icon name="search"/></div>
            <div className={s.iconBtn}><Icon name="bell"/><span className={s.notifDot}/></div>
          </div>
        </header>
        <div className={s.content} key={activeNav}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}