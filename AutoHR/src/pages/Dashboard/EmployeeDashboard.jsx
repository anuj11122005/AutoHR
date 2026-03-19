import { useState } from "react";
import s from "./Dashboard.module.css";
import ls from "./LeaveManagement.module.css";

// ═══════════════════════════════════════════════════════════
// n8n API LAYER — swap webhook URLs when backend is ready
// ═══════════════════════════════════════════════════════════
const N8N_BASE = import.meta.env.VITE_N8N_BASE_URL || "https://your-n8n-instance.com/webhook";

const api = {
  async submitLeave(payload) {
    // ── UNCOMMENT when n8n is ready ──
    // const res = await fetch(`${N8N_BASE}/submit-leave`, {
    //   method: "POST", headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return res.json();
    await new Promise(r => setTimeout(r, 900));
    return { success: true, id: Date.now(), ...payload };
  },
};

// ═══════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════
const USER = { name: "Amit Verma", role: "Employee", dept: "Engineering", initials: "AV", empId: "EMP-2041", joined: "Mar 2022" };

const MY_TASKS = [
  { id: 1, title: "Complete Q1 performance review",  due: "Mar 5",  priority: "High",   status: "Pending",     project: "HR Process" },
  { id: 2, title: "Submit project documentation",    due: "Mar 3",  priority: "High",   status: "In Progress", project: "Product Alpha" },
  { id: 3, title: "Attend team standup",             due: "Today",  priority: "Medium", status: "Pending",     project: "Daily" },
  { id: 4, title: "Update sprint board",             due: "Today",  priority: "Low",    status: "Done",        project: "Product Alpha" },
  { id: 5, title: "Review pull requests",            due: "Mar 4",  priority: "Medium", status: "Pending",     project: "Engineering" },
  { id: 6, title: "Prepare demo slides",             due: "Mar 7",  priority: "High",   status: "In Progress", project: "Client Demo" },
];

const MY_ATTENDANCE = [
  { date: "Mon, Feb 24", checkIn: "9:02 AM",  checkOut: "6:10 PM",  hours: "9h 8m",  status: "Present" },
  { date: "Tue, Feb 25", checkIn: "9:15 AM",  checkOut: "6:00 PM",  hours: "8h 45m", status: "Present" },
  { date: "Wed, Feb 26", checkIn: "9:00 AM",  checkOut: "5:55 PM",  hours: "8h 55m", status: "Present" },
  { date: "Thu, Feb 27", checkIn: "9:30 AM",  checkOut: "6:30 PM",  hours: "9h 0m",  status: "Late" },
  { date: "Fri, Feb 28", checkIn: "—",         checkOut: "—",         hours: "—",      status: "Absent" },
  { date: "Mon, Mar 3",  checkIn: "8:58 AM",  checkOut: "6:05 PM",  hours: "9h 7m",  status: "Present" },
  { date: "Tue, Mar 4",  checkIn: "9:05 AM",  checkOut: "6:00 PM",  hours: "8h 55m", status: "Present" },
];

const LEAVE_HISTORY = [
  { id: 1, type: "Casual",  from: "2026-02-01", to: "2026-02-01", days: 1,  reason: "Personal work",          status: "Approved" },
  { id: 2, type: "Medical", from: "2026-01-15", to: "2026-01-17", days: 3,  reason: "Doctor visit",           status: "Approved" },
  { id: 3, type: "Earned",  from: "2026-03-20", to: "2026-03-22", days: 3,  reason: "Planned vacation",       status: "Pending" },
  { id: 4, type: "Casual",  from: "2025-12-24", to: "2025-12-24", days: 1,  reason: "Festival holiday travel",status: "Approved" },
];

const LEAVE_BALANCE = { casual: 6, earned: 12, medical: 8, totalUsed: 5, totalAllotted: 30 };

const PAYSLIPS = [
  { month: "February 2026", basic: "₹65,000", hra: "₹12,000", allowances: "₹5,000", deductions: "₹7,200", net: "₹74,800", status: "Paid" },
  { month: "January 2026",  basic: "₹65,000", hra: "₹12,000", allowances: "₹5,000", deductions: "₹7,200", net: "₹74,800", status: "Paid" },
  { month: "December 2025", basic: "₹65,000", hra: "₹12,000", allowances: "₹8,000", deductions: "₹7,200", net: "₹77,800", status: "Paid" },
];

const ANNOUNCEMENTS = [
  { title: "Q1 appraisal cycle starts March 10",  sub: "Submit self-review by March 8",           time: "Today",    dot: "green" },
  { title: "Company all-hands — March 15, 4 PM",  sub: "Virtual meeting link sent to your email", time: "Today",    dot: "blue" },
  { title: "New WFH policy effective April 1",     sub: "Check the updated policy document",       time: "Yesterday",dot: "orange" },
  { title: "Office closed — Holi, March 14",       sub: "Public holiday — no attendance required", time: "2d ago",   dot: "green" },
  { title: "IT system maintenance — Mar 8, 11 PM", sub: "Services may be unavailable for 2 hrs",  time: "3d ago",   dot: "muted" },
];

const TEAM_MEMBERS = [
  { name: "Sara Williams",  role: "HR Manager",     status: "Online",  color: "#4fffb0" },
  { name: "Alex Johnson",   role: "Team Lead",       status: "Online",  color: "#4fb4ff" },
  { name: "Priya Mehta",    role: "Designer",        status: "Away",    color: "#ffb547" },
  { name: "Karan Patel",    role: "Senior Dev",      status: "Online",  color: "#c084fc" },
  { name: "Neha Sharma",    role: "HR Executive",    status: "Offline", color: "#ff5f7e" },
];

const WEEK_ATTENDANCE = [1, 1, 1, 0, 0]; // Mon–Fri: 1=present, 0=absent this week
const ATT_BAR_DATA = [88, 92, 85, 78, 0]; // % for chart
const DAYS = ["Mon","Tue","Wed","Thu","Fri"];

const LEAVE_TYPES  = ["Casual", "Medical", "Earned", "Maternity", "Paternity"];
const STATUS_COLOR = { Pending:"orange", Approved:"green", Rejected:"red" };
const TASK_PRIORITY_COLOR = { High:"red", Medium:"orange", Low:"blue" };
const TASK_STATUS_COLOR   = { Pending:"orange", "In Progress":"blue", Done:"green" };
const ATT_STATUS_COLOR    = { Present:"green", Late:"orange", Absent:"red", "Work From Home":"blue" };

const PAGE_META = {
  dashboard:   { title: "My Dashboard",    sub: `Welcome back, ${USER.name}` },
  tasks:       { title: "My Tasks",        sub: "Track your work and deliverables" },
  attendance:  { title: "My Attendance",   sub: "View your attendance and work hours" },
  leave:       { title: "Leave",           sub: "Apply and track your leave requests" },
  payroll:     { title: "Payroll",         sub: "View your payslips and salary details" },
  announcements:{ title:"Announcements",  sub: "Company updates and notices" },
};

// ═══════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════
function Icon({ name, size = 17 }) {
  const p = {
    dashboard:    <><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></>,
    tasks:        <><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    attendance:   <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/><path d="M9 16l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    leave:        <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    payroll:      <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="15" x2="10" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    announcements:<><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
    search:       <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    logout:       <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    clock:        <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    close:        <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    download:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></>,
    users:        <><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    filter:       <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>,
    flag:         <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="1.5"/><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>{p[name]}</svg>;
}

// ═══════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════
function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`${ls.toast} ${ls[toast.type]}`}>{toast.msg}</div>;
}

function StatCard({ label, value, change, trend, color, icon }) {
  const colorMap = { green:"green", blue:"blue", orange:"orange", red:"red" };
  return (
    <div className={s.statCard}>
      <div className={s.statCardTop}>
        <div className={`${s.statCardIcon} ${s[colorMap[color]]}`}><Icon name={icon} size={18}/></div>
        <span className={`${s.statCardChange} ${s[trend]}`}>{change}</span>
      </div>
      <div><div className={s.statCardVal}>{value}</div><div className={s.statCardLabel}>{label}</div></div>
    </div>
  );
}

const inputBase = {
  background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:9,
  padding:"10px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem",
  color:"var(--text)", outline:"none", width:"100%", transition:"border-color 0.2s, box-shadow 0.2s",
};

function FInput({ value, onChange, placeholder, type="text" }) {
  const [f, setF] = useState(false);
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ ...inputBase, ...(f?{borderColor:"var(--accent)",boxShadow:"0 0 0 3px rgba(79,255,176,0.1)"}:{}) }}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>;
}

function FSelect({ value, onChange, children }) {
  const [f, setF] = useState(false);
  return <select value={value} onChange={onChange}
    style={{ ...inputBase, ...(f?{borderColor:"var(--accent)",boxShadow:"0 0 0 3px rgba(79,255,176,0.1)"}:{}), cursor:"pointer", appearance:"none" }}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}>{children}</select>;
}

function FTextarea({ value, onChange, placeholder, rows=3 }) {
  const [f, setF] = useState(false);
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ ...inputBase, ...(f?{borderColor:"var(--accent)",boxShadow:"0 0 0 3px rgba(79,255,176,0.1)"}:{}), resize:"vertical", lineHeight:1.6 }}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>;
}

function Label({ children }) {
  return <label style={{fontSize:"0.7rem",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)",display:"block",marginBottom:6}}>{children}</label>;
}

function Modal({ open, onClose, eyebrow, title, sub, children, footer }) {
  if (!open) return null;
  return (
    <div className={ls.modalOverlay} onClick={onClose}>
      <div className={ls.modal} style={{width:500,maxHeight:"90vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div className={ls.modalHead}>
          <div>{eyebrow&&<p className={ls.modalEyebrow}>{eyebrow}</p>}<h3 className={ls.modalTitle}>{title}</h3>{sub&&<p className={ls.modalSub}>{sub}</p>}</div>
          <button className={ls.modalClose} onClick={onClose}><Icon name="close" size={18}/></button>
        </div>
        <div className={ls.modalBody} style={{overflowY:"auto",flex:1}}>{children}</div>
        {footer&&<div className={ls.modalActions}>{footer}</div>}
      </div>
    </div>
  );
}

function PrimaryBtn({ onClick, loading, children }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{display:"flex",alignItems:"center",gap:6,padding:"9px 20px",borderRadius:9,border:"none",
        background:"var(--accent)",color:"#0b0d11",fontFamily:"'Syne',sans-serif",fontWeight:700,
        fontSize:"0.85rem",cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1}}>
      {loading
        ? <span style={{width:16,height:16,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#0b0d11",borderRadius:"50%",display:"inline-block",animation:"empSpin 0.7s linear infinite"}}/>
        : children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",cursor:"pointer"}}>{children}</button>;
}

// ═══════════════════════════════════════════════════════════
// APPLY LEAVE MODAL
// ═══════════════════════════════════════════════════════════
const EMPTY_LEAVE = { type:"Casual", from:"", to:"", reason:"" };

function ApplyLeaveModal({ open, onClose, onSubmit, showToast }) {
  const [form, setForm]     = useState(EMPTY_LEAVE);
  const [errors, setErrors] = useState({});
  const [loading, setLoad]  = useState(false);
  const set = k => e => { setForm(f=>({...f,[k]:e.target.value})); setErrors(v=>({...v,[k]:""})); };

  const validate = () => {
    const e = {};
    if (!form.from)          e.from   = "Start date is required";
    if (!form.to)            e.to     = "End date is required";
    if (!form.reason.trim()) e.reason = "Reason is required";
    if (form.from && form.to && form.to < form.from) e.to = "End date must be after start date";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / (1000*60*60*24) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoad(true);
    try {
      const result = await api.submitLeave({ ...form, days: calcDays(), status: "Pending", applied: "Today" });
      onSubmit({ ...form, id: result.id, days: calcDays(), status: "Pending", applied: "Today" });
      showToast("Leave application submitted!", "green");
      setForm(EMPTY_LEAVE); setErrors({}); onClose();
    } catch {
      showToast("Failed to submit. Please try again.", "red");
    } finally { setLoad(false); }
  };

  const errStyle = { fontSize:"0.7rem", color:"var(--danger)", marginTop:3, display:"block" };

  return (
    <Modal open={open} onClose={onClose} eyebrow="New Request" title="Apply for Leave" sub="Your manager will be notified for approval"
      footer={<><GhostBtn onClick={onClose}>Cancel</GhostBtn><PrimaryBtn onClick={handleSubmit} loading={loading}><Icon name="plus" size={15}/> Submit Leave</PrimaryBtn></>}>
      <style>{`@keyframes empSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <Label>Leave Type</Label>
          <FSelect value={form.type} onChange={set("type")}>{LEAVE_TYPES.map(t=><option key={t}>{t}</option>)}</FSelect>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div>
            <Label>From Date *</Label>
            <FInput type="date" value={form.from} onChange={set("from")}/>
            {errors.from&&<span style={errStyle}>{errors.from}</span>}
          </div>
          <div>
            <Label>To Date *</Label>
            <FInput type="date" value={form.to} onChange={set("to")}/>
            {errors.to&&<span style={errStyle}>{errors.to}</span>}
          </div>
        </div>
        {calcDays()>0&&(
          <div style={{background:"var(--accent-dim)",border:"1px solid rgba(79,255,176,0.2)",borderRadius:9,padding:"10px 14px",fontSize:"0.83rem",color:"var(--accent)",fontWeight:500}}>
            📅 {calcDays()} day{calcDays()>1?"s":""} of leave
          </div>
        )}
        <div>
          <Label>Reason *</Label>
          <FTextarea value={form.reason} onChange={set("reason")} placeholder="Briefly describe the reason for your leave…" rows={3}/>
          {errors.reason&&<span style={errStyle}>{errors.reason}</span>}
        </div>
        <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px"}}>
          <p style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--muted)",marginBottom:8}}>Available Balance</p>
          <div style={{display:"flex",gap:20}}>
            {[["Casual",LEAVE_BALANCE.casual],["Earned",LEAVE_BALANCE.earned],["Medical",LEAVE_BALANCE.medical]].map(([t,v])=>(
              <div key={t} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.1rem",color:form.type===t?"var(--accent)":"var(--text)"}}>{v}</div>
                <div style={{fontSize:"0.68rem",color:"var(--muted)"}}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════

// ── Dashboard ─────────────────────────────────────────────
function DashboardPage({ onNavigate, tasks, leaveHistory }) {
  const pendingTasks  = tasks.filter(t=>t.status!=="Done").length;
  const pendingLeaves = leaveHistory.filter(l=>l.status==="Pending").length;
  const presentDays   = MY_ATTENDANCE.filter(a=>a.status==="Present").length;

  return (
    <>
      <style>{`@keyframes empSpin{to{transform:rotate(360deg)}}`}</style>
      <div className={s.statsGrid}>
        {[
          { label:"Tasks Pending",    value:pendingTasks,  change:`${tasks.filter(t=>t.status==="Done").length} done`, trend:"neutral", color:"green",  icon:"tasks" },
          { label:"Attendance %",     value:"88%",         change:"+3%",  trend:"up",      color:"blue",   icon:"attendance" },
          { label:"Leaves Remaining", value:LEAVE_BALANCE.earned+LEAVE_BALANCE.casual, change:"this FY", trend:"neutral", color:"orange", icon:"leave" },
          { label:"Pending Approvals",value:pendingLeaves, change:pendingLeaves>0?"awaiting":"all clear", trend:pendingLeaves>0?"down":"up", color:"red", icon:"clock" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      {/* Quick actions */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[
          { label:"Apply Leave", icon:"plus", nav:"leave", accent:true },
          { label:"View Payslip", icon:"download", nav:"payroll", accent:false },
          { label:"My Attendance", icon:"attendance", nav:"attendance", accent:false },
          { label:"Announcements", icon:"bell", nav:"announcements", accent:false },
        ].map(btn=>(
          <button key={btn.label} onClick={()=>onNavigate(btn.nav)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,
              border:btn.accent?"none":"1px solid var(--border)",
              background:btn.accent?"var(--accent)":"var(--surface)",
              color:btn.accent?"#0b0d11":"var(--text)",
              fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",fontWeight:500,cursor:"pointer",
              transition:"border-color 0.15s"}}>
            <Icon name={btn.icon} size={15}/>{btn.label}
          </button>
        ))}
      </div>

      <div className={s.grid3}>
        {/* My Tasks preview */}
        <div className={s.panel}>
          <div className={s.panelHead}><span className={s.panelTitle}>My Tasks</span><button className={s.panelAction} onClick={()=>onNavigate("tasks")}>View all →</button></div>
          <div className={s.panelBody}>
            {tasks.slice(0,5).map(task=>(
              <div className={s.listItem} key={task.id}>
                <div className={`${s.listDot} ${s[TASK_PRIORITY_COLOR[task.priority]]}`}/>
                <div className={s.listMain}>
                  <div className={s.listTitle} style={{textDecoration:task.status==="Done"?"line-through":"none",opacity:task.status==="Done"?0.5:1}}>{task.title}</div>
                  <div className={s.listSub}>{task.project} · Due {task.due}</div>
                </div>
                <span className={`${s.badge} ${s[TASK_STATUS_COLOR[task.status]]}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance this week + announcements */}
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {/* This week */}
          <div className={s.panel}>
            <div className={s.panelHead}><span className={s.panelTitle}>This Week</span><span style={{fontSize:"0.72rem",color:"var(--accent)"}}>Mar 3–7</span></div>
            <div className={s.panelBody}>
              <div style={{display:"flex",gap:8,justifyContent:"space-between",marginBottom:12}}>
                {DAYS.map((d,i)=>(
                  <div key={d} style={{flex:1,textAlign:"center"}}>
                    <div style={{width:"100%",height:32,borderRadius:8,background:i<MY_ATTENDANCE.length&&MY_ATTENDANCE[MY_ATTENDANCE.length-5+i]
                      ?MY_ATTENDANCE[MY_ATTENDANCE.length-5+i].status==="Present"?"rgba(79,255,176,0.2)":MY_ATTENDANCE[MY_ATTENDANCE.length-5+i].status==="Late"?"rgba(255,181,71,0.2)":"rgba(255,95,126,0.15)"
                      :"var(--border)",
                      display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
                      {i<MY_ATTENDANCE.length&&MY_ATTENDANCE[MY_ATTENDANCE.length-5+i]&&
                        <span style={{fontSize:"0.65rem",color:MY_ATTENDANCE[MY_ATTENDANCE.length-5+i].status==="Present"?"var(--accent)":MY_ATTENDANCE[MY_ATTENDANCE.length-5+i].status==="Late"?"var(--warning)":"var(--danger)"}}>
                          {MY_ATTENDANCE[MY_ATTENDANCE.length-5+i].status==="Present"?"✓":MY_ATTENDANCE[MY_ATTENDANCE.length-5+i].status==="Late"?"L":"✗"}
                        </span>}
                    </div>
                    <span style={{fontSize:"0.65rem",color:"var(--muted2)"}}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                {[["Present","var(--accent)"],["Late","var(--warning)"],["Absent","var(--danger)"]].map(([l,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.7rem",color:"var(--muted)"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leave balance */}
          <div className={s.panel}>
            <div className={s.panelHead}><span className={s.panelTitle}>Leave Balance</span><button className={s.panelAction} onClick={()=>onNavigate("leave")}>Apply →</button></div>
            <div className={s.panelBody}>
              {[["Casual","blue",LEAVE_BALANCE.casual,12],["Earned","green",LEAVE_BALANCE.earned,20],["Medical","orange",LEAVE_BALANCE.medical,10]].map(([type,color,val,max])=>(
                <div key={type} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:"0.78rem",fontWeight:500}}>{type} Leave</span>
                    <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>{val}/{max} days</span>
                  </div>
                  <div className={s.progressBar}>
                    <div className={`${s.progressFill} ${s[color]}`} style={{width:`${(val/max)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements preview */}
      <div className={s.panel}>
        <div className={s.panelHead}><span className={s.panelTitle}>Latest Announcements</span><button className={s.panelAction} onClick={()=>onNavigate("announcements")}>View all →</button></div>
        <div className={s.panelBody} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
          {ANNOUNCEMENTS.slice(0,4).map((a,i)=>(
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

// ── Tasks ─────────────────────────────────────────────────
function TasksPage({ tasks, onToggleTask }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All","Pending","In Progress","Done"];
  const filtered = tasks.filter(t => filter==="All" || t.status===filter);

  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"Total Tasks",   value:tasks.length,                              change:"assigned", trend:"neutral", color:"green",  icon:"tasks" },
          { label:"In Progress",   value:tasks.filter(t=>t.status==="In Progress").length, change:"active",   trend:"up",      color:"blue",   icon:"clock" },
          { label:"Pending",       value:tasks.filter(t=>t.status==="Pending").length,     change:"todo",     trend:"neutral", color:"orange", icon:"flag" },
          { label:"Completed",     value:tasks.filter(t=>t.status==="Done").length,        change:"done",     trend:"up",      color:"red",    icon:"check" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.panel}>
        <div className={ls.filterBar}>
          <div className={ls.tabs}>
            {filters.map(f=>(
              <button key={f} className={`${ls.tab} ${filter===f?ls.tabActive:""}`} onClick={()=>setFilter(f)}>
                {f}<span className={ls.tabCount}>{f==="All"?tasks.length:tasks.filter(t=>t.status===f).length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Task</th><th>Project</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(task=>(
                <tr key={task.id} className={ls.tableRow}>
                  <td>
                    <div style={{fontWeight:500,fontSize:"0.83rem",textDecoration:task.status==="Done"?"line-through":"none",opacity:task.status==="Done"?0.5:1}}>
                      {task.title}
                    </div>
                  </td>
                  <td><span className={`${s.badge} ${s.blue}`}>{task.project}</span></td>
                  <td style={{fontSize:"0.78rem",color:"var(--muted)"}}>{task.due}</td>
                  <td><span className={`${s.badge} ${s[TASK_PRIORITY_COLOR[task.priority]]}`}>{task.priority}</span></td>
                  <td><span className={`${s.badge} ${s[TASK_STATUS_COLOR[task.status]]}`}>{task.status}</span></td>
                  <td>
                    {task.status!=="Done"&&(
                      <button className={ls.approveIconBtn} onClick={()=>onToggleTask(task.id)} title="Mark done">
                        <Icon name="check" size={14}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Attendance ────────────────────────────────────────────
function AttendancePage() {
  const present = MY_ATTENDANCE.filter(a=>a.status==="Present").length;
  const late    = MY_ATTENDANCE.filter(a=>a.status==="Late").length;
  const absent  = MY_ATTENDANCE.filter(a=>a.status==="Absent").length;
  const pct     = Math.round((present/MY_ATTENDANCE.length)*100);

  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"Present Days",   value:present, change:`${pct}%`, trend:"up",      color:"green",  icon:"check" },
          { label:"Late Arrivals",  value:late,    change:"this month", trend:"neutral",color:"orange", icon:"clock" },
          { label:"Absent Days",    value:absent,  change:"this month", trend:"down",   color:"red",    icon:"x" },
          { label:"Avg. Work Hours",value:"8h 58m",change:"+12m",  trend:"up",      color:"blue",   icon:"clock" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      {/* Attendance bar chart */}
      <div className={s.panel} style={{marginBottom:20}}>
        <div className={s.panelHead}><span className={s.panelTitle}>Weekly Attendance %</span><span style={{fontSize:"0.75rem",color:"var(--accent)"}}>Last 5 days</span></div>
        <div className={s.panelBody}>
          <div className={s.chartBars} style={{height:64}}>
            {ATT_BAR_DATA.map((v,i)=>(
              <div key={i} className={`${s.bar} ${i===0?s.active:""}`}
                style={{height:v?`${(v/100)*100}%`:"4px",opacity:v?1:0.2}}
                title={`${DAYS[i]}: ${v?v+"%":"No class"}`}/>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            {DAYS.map(d=><span key={d} style={{fontSize:"0.65rem",color:"var(--muted2)",flex:1,textAlign:"center"}}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* Attendance log table */}
      <div className={s.panel}>
        <div className={s.panelHead}><span className={s.panelTitle}>Attendance Log</span><span style={{fontSize:"0.75rem",color:"var(--muted)"}}>March 2026</span></div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              {MY_ATTENDANCE.map((row,i)=>(
                <tr key={i} className={ls.tableRow}>
                  <td style={{fontWeight:500,fontSize:"0.83rem"}}>{row.date}</td>
                  <td style={{fontSize:"0.83rem",color:row.status==="Late"?"var(--warning)":"var(--text)"}}>{row.checkIn}</td>
                  <td style={{fontSize:"0.83rem",color:"var(--muted)"}}>{row.checkOut}</td>
                  <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:"0.83rem"}}>{row.hours}</td>
                  <td><span className={`${s.badge} ${s[ATT_STATUS_COLOR[row.status]]}`}>{row.status}</span></td>
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
function LeavePage({ leaveHistory, onAddLeave }) {
  const [showModal, setModal] = useState(false);
  const [toast, setToast]     = useState(null);
  const showToast = (msg,type="green") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  return (
    <>
      <Toast toast={toast}/>
      <ApplyLeaveModal open={showModal} onClose={()=>setModal(false)} onSubmit={onAddLeave} showToast={showToast}/>

      <div className={s.statsGrid}>
        {[
          { label:"Casual Leave",  value:`${LEAVE_BALANCE.casual} days`,  change:"remaining", trend:"neutral", color:"blue",   icon:"leave" },
          { label:"Earned Leave",  value:`${LEAVE_BALANCE.earned} days`,  change:"remaining", trend:"neutral", color:"green",  icon:"calendar" },
          { label:"Medical Leave", value:`${LEAVE_BALANCE.medical} days`, change:"remaining", trend:"neutral", color:"orange", icon:"user" },
          { label:"Used This Year",value:`${LEAVE_BALANCE.totalUsed} days`,change:`of ${LEAVE_BALANCE.totalAllotted}`, trend:"neutral", color:"red", icon:"check" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.panel}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>My Leave Requests</span>
          <button onClick={()=>setModal(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,border:"none",background:"var(--accent)",color:"#0b0d11",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"}}>
            <Icon name="plus" size={14}/> Apply Leave
          </button>
        </div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {leaveHistory.length===0
                ? <tr><td colSpan={6}><div className={s.emptyState}><Icon name="leave" size={28}/><p>No leave requests yet.</p></div></td></tr>
                : leaveHistory.map((l,i)=>(
                  <tr key={i} className={ls.tableRow}>
                    <td><span className={`${s.badge} ${s.blue}`}>{l.type}</span></td>
                    <td style={{fontSize:"0.83rem"}}>{l.from}</td>
                    <td style={{fontSize:"0.83rem"}}>{l.to}</td>
                    <td><span className={ls.daysChip}>{l.days} day{l.days>1?"s":""}</span></td>
                    <td style={{fontSize:"0.78rem",color:"var(--muted)",maxWidth:180}}>{l.reason}</td>
                    <td><span className={`${s.badge} ${s[STATUS_COLOR[l.status]]}`}>{l.status}</span></td>
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

// ── Payroll ───────────────────────────────────────────────
function PayrollPage() {
  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"This Month Net", value:"₹74,800", change:"Feb 2026",  trend:"neutral", color:"green",  icon:"payroll" },
          { label:"Basic Salary",   value:"₹65,000", change:"fixed",     trend:"neutral", color:"blue",   icon:"user" },
          { label:"Total Deductions",value:"₹7,200", change:"taxes+PF",  trend:"neutral", color:"orange", icon:"x" },
          { label:"YTD Earned",     value:"₹1.49L",  change:"FY 25-26",  trend:"up",      color:"red",    icon:"check" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      {/* Salary breakdown card */}
      <div className={s.grid2} style={{marginBottom:20}}>
        <div className={s.panel}>
          <div className={s.panelHead}><span className={s.panelTitle}>February 2026 Breakdown</span></div>
          <div className={s.panelBody}>
            {[
              { label:"Basic Salary",    val:"₹65,000", color:"var(--text)" },
              { label:"HRA",             val:"₹12,000", color:"var(--text)" },
              { label:"Other Allowances",val:"₹5,000",  color:"var(--text)" },
              { label:"PF Deduction",    val:"−₹3,600", color:"var(--danger)" },
              { label:"Professional Tax",val:"−₹200",   color:"var(--danger)" },
              { label:"TDS",             val:"−₹3,400", color:"var(--danger)" },
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<5?"1px solid var(--border)":"none"}}>
                <span style={{fontSize:"0.83rem",color:"var(--muted)"}}>{row.label}</span>
                <span style={{fontSize:"0.83rem",fontFamily:"'Syne',sans-serif",fontWeight:600,color:row.color}}>{row.val}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",marginTop:4}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.9rem"}}>Net Pay</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--accent)"}}>₹74,800</span>
            </div>
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHead}><span className={s.panelTitle}>Team Members</span></div>
          <div className={s.panelBody}>
            {TEAM_MEMBERS.map((m,i)=>(
              <div className={s.listItem} key={i}>
                <div className={s.avatarSm} style={{background:m.color+"33",color:m.color}}>{m.name.split(" ").map(n=>n[0]).join("")}</div>
                <div className={s.listMain}><div className={s.listTitle}>{m.name}</div><div className={s.listSub}>{m.role}</div></div>
                <span className={`${s.badge} ${m.status==="Online"?s.green:m.status==="Away"?s.orange:s.muted}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payslip history */}
      <div className={s.panel}>
        <div className={s.panelHead}><span className={s.panelTitle}>Payslip History</span></div>
        <div className={ls.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Month</th><th>Basic</th><th>HRA</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Download</th></tr></thead>
            <tbody>
              {PAYSLIPS.map((p,i)=>(
                <tr key={i} className={ls.tableRow}>
                  <td style={{fontWeight:500,fontSize:"0.83rem"}}>{p.month}</td>
                  <td style={{fontSize:"0.83rem"}}>{p.basic}</td>
                  <td style={{fontSize:"0.83rem"}}>{p.hra}</td>
                  <td style={{fontSize:"0.83rem"}}>{p.allowances}</td>
                  <td style={{fontSize:"0.83rem",color:"var(--danger)"}}>−{p.deductions}</td>
                  <td style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"var(--accent)"}}>{p.net}</td>
                  <td><span className={`${s.badge} ${s.green}`}>{p.status}</span></td>
                  <td><button className={ls.viewBtn} title="Download payslip"><Icon name="download" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Announcements ─────────────────────────────────────────
function AnnouncementsPage() {
  const dotColor = { green:"var(--accent)", blue:"var(--info)", orange:"var(--warning)", red:"var(--danger)", muted:"var(--muted2)" };
  return (
    <>
      <div className={s.statsGrid}>
        {[
          { label:"Total Notices",  value:ANNOUNCEMENTS.length, change:"this month", trend:"neutral", color:"green",  icon:"announcements" },
          { label:"Unread",         value:"3",                  change:"new",        trend:"down",    color:"blue",   icon:"bell" },
          { label:"Today",          value:"2",                  change:"posted",     trend:"neutral", color:"orange", icon:"calendar" },
          { label:"Action Required",value:"1",                  change:"urgent",     trend:"down",    color:"red",    icon:"flag" },
        ].map(st=><StatCard key={st.label} {...st}/>)}
      </div>

      <div className={s.panel}>
        <div className={s.panelHead}><span className={s.panelTitle}>All Announcements</span></div>
        <div className={s.panelBody}>
          {ANNOUNCEMENTS.map((ann,i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:i<ANNOUNCEMENTS.length-1?"1px solid var(--border)":"none",alignItems:"flex-start"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:dotColor[ann.dot]||"var(--muted2)",flexShrink:0,marginTop:5}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:"0.88rem",marginBottom:4}}>{ann.title}</div>
                <div style={{fontSize:"0.78rem",color:"var(--muted)",lineHeight:1.5}}>{ann.sub}</div>
              </div>
              <div style={{fontSize:"0.72rem",color:"var(--muted2)",flexShrink:0,whiteSpace:"nowrap"}}>{ann.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════
export default function EmployeeDashboard() {
  const [activeNav, setActiveNav]   = useState("dashboard");
  const [tasks, setTasks]           = useState(MY_TASKS);
  const [leaveHistory, setLeaves]   = useState(LEAVE_HISTORY);

  const toggleTask = id => setTasks(prev => prev.map(t => t.id===id ? {...t, status:"Done"} : t));
  const addLeave   = entry => setLeaves(prev => [entry, ...prev]);

  const pendingTasks = tasks.filter(t=>t.status!=="Done").length;

  const nav = [
    { id:"dashboard",    label:"Dashboard",     icon:"dashboard" },
    { id:"tasks",        label:"My Tasks",      icon:"tasks",        badge: pendingTasks },
    { id:"attendance",   label:"Attendance",    icon:"attendance" },
    { id:"leave",        label:"Leave",         icon:"leave",        badge: leaveHistory.filter(l=>l.status==="Pending").length },
    { id:"payroll",      label:"Payroll",       icon:"payroll" },
    { id:"announcements",label:"Announcements", icon:"announcements",badge: 3 },
  ];

  const renderPage = () => {
    switch (activeNav) {
      case "dashboard":    return <DashboardPage onNavigate={setActiveNav} tasks={tasks} leaveHistory={leaveHistory}/>;
      case "tasks":        return <TasksPage tasks={tasks} onToggleTask={toggleTask}/>;
      case "attendance":   return <AttendancePage/>;
      case "leave":        return <LeavePage leaveHistory={leaveHistory} onAddLeave={addLeave}/>;
      case "payroll":      return <PayrollPage/>;
      case "announcements":return <AnnouncementsPage/>;
      default:             return <DashboardPage onNavigate={setActiveNav} tasks={tasks} leaveHistory={leaveHistory}/>;
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
          <p className={s.navLabel}>Employee</p>
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
            <div className={s.avatar}>{USER.initials}</div>
            <div className={s.userInfo}>
              <div className={s.userName}>{USER.name}</div>
              <div className={s.userRole}>{USER.dept}</div>
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
            <span className={s.rolePill}>Employee</span>
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
