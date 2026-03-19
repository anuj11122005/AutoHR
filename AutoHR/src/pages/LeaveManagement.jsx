import { useState } from "react";
import s from "./Dashboard.module.css";
import ls from "./LeaveManagement.module.css";

// ─── Mock Data ────────────────────────────────────────────
const INITIAL_REQUESTS = [
  { id: 1,  name: "Rohit Kumar",   dept: "Marketing",   type: "Medical",  from: "2026-02-27", to: "2026-03-01", days: 3, reason: "Fever and throat infection, doctor advised rest.",          status: "Pending",  color: "#ffb547", applied: "Feb 25" },
  { id: 2,  name: "Anjali Rao",    dept: "Design",      type: "Casual",   from: "2026-03-01", to: "2026-03-01", days: 1, reason: "Personal work.",                                            status: "Pending",  color: "#4fb4ff", applied: "Feb 26" },
  { id: 3,  name: "Dev Singh",     dept: "Engineering", type: "Earned",   from: "2026-03-04", to: "2026-03-08", days: 5, reason: "Family trip planned for a long time.",                      status: "Approved", color: "#4fffb0", applied: "Feb 20" },
  { id: 4,  name: "Meena Joshi",   dept: "HR",          type: "Casual",   from: "2026-03-06", to: "2026-03-07", days: 2, reason: "Attending a wedding.",                                      status: "Rejected", color: "#ff5f7e", applied: "Feb 22" },
  { id: 5,  name: "Karan Patel",   dept: "Engineering", type: "Medical",  from: "2026-03-10", to: "2026-03-11", days: 2, reason: "Dental surgery follow-up.",                                 status: "Pending",  color: "#c084fc", applied: "Feb 27" },
  { id: 6,  name: "Priya Mehta",   dept: "Design",      type: "Maternity",from: "2026-03-15", to: "2026-06-15", days: 90,"reason":"Maternity leave as per company policy.",                  status: "Approved", color: "#4fb4ff", applied: "Feb 10" },
  { id: 7,  name: "Neha Sharma",   dept: "HR",          type: "Earned",   from: "2026-03-20", to: "2026-03-22", days: 3, reason: "Visiting hometown.",                                        status: "Pending",  color: "#ff5f7e", applied: "Feb 28" },
  { id: 8,  name: "Alex Johnson",  dept: "Engineering", type: "Casual",   from: "2026-03-03", to: "2026-03-03", days: 1, reason: "Bank work and vehicle registration.",                       status: "Approved", color: "#4fffb0", applied: "Feb 24" },
];

const LEAVE_BALANCE = [
  { name: "Rohit Kumar",  casual: 3, earned: 8,  medical: 2,  total: 13 },
  { name: "Anjali Rao",   casual: 6, earned: 12, medical: 5,  total: 23 },
  { name: "Dev Singh",    casual: 4, earned: 3,  medical: 6,  total: 13 },
  { name: "Meena Joshi",  casual: 1, earned: 10, medical: 4,  total: 15 },
  { name: "Karan Patel",  casual: 5, earned: 9,  medical: 3,  total: 17 },
];

const LEAVE_TYPES  = ["All Types", "Casual", "Medical", "Earned", "Maternity"];
const STATUS_TABS  = ["All", "Pending", "Approved", "Rejected"];
const STATUS_COLOR = { Pending: "orange", Approved: "green", Rejected: "red" };
const TYPE_COLOR   = { Casual: "blue", Medical: "red", Earned: "green", Maternity: "muted" };

// ─── Icons ────────────────────────────────────────────────
function Icon({ name, size = 17 }) {
  const paths = {
    calendar:   <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    clock:      <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    check:      <><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    eye:        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></>,
    users:      <><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    filter:     <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>,
    search:     <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
    logout:     <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    dashboard:  <><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></>,
    employee:   <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    payroll:    <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    recruit:    <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    report:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/></>,
    leave:      <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    close:      <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>{paths[name]}</svg>;
}

export default function LeaveManagement() {
  const [requests, setRequests]       = useState(INITIAL_REQUESTS);
  const [activeTab, setActiveTab]     = useState("All");
  const [typeFilter, setTypeFilter]   = useState("All Types");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(null); // detail modal
  const [activeNav, setActiveNav]     = useState("leave");
  const [toast, setToast]             = useState(null);

  // ── Derived stats ──
  const pending  = requests.filter(r => r.status === "Pending").length;
  const approved = requests.filter(r => r.status === "Approved").length;
  const rejected = requests.filter(r => r.status === "Rejected").length;
  const totalDaysApproved = requests.filter(r => r.status === "Approved").reduce((a, r) => a + r.days, 0);

  // ── Filtering ──
  const filtered = requests.filter(r => {
    const matchTab    = activeTab === "All" || r.status === activeTab;
    const matchType   = typeFilter === "All Types" || r.type === typeFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.dept.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchType && matchSearch;
  });

  // ── Actions ──
  const showToast = (msg, type = "green") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const updateStatus = (id, newStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    showToast(
      newStatus === "Approved" ? "Leave request approved." : "Leave request rejected.",
      newStatus === "Approved" ? "green" : "red"
    );
  };

  const nav = [
    { id: "dashboard", label: "Dashboard",   icon: "dashboard" },
    { id: "employees", label: "Employees",   icon: "employee" },
    { id: "recruit",   label: "Recruitment", icon: "recruit", badge: 4 },
    { id: "leave",     label: "Leave",       icon: "leave",   badge: pending },
    { id: "payroll",   label: "Payroll",     icon: "payroll" },
    { id: "reports",   label: "Reports",     icon: "report" },
  ];

  return (
    <div className={s.layout}>

      {/* ── Toast ── */}
      {toast && (
        <div className={`${ls.toast} ${ls[toast.type]}`}>{toast.msg}</div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <div className={ls.modalOverlay} onClick={() => setSelected(null)}>
          <div className={ls.modal} onClick={e => e.stopPropagation()}>
            <div className={ls.modalHead}>
              <div>
                <p className={ls.modalEyebrow}>Leave Request</p>
                <h3 className={ls.modalTitle}>{selected.name}</h3>
                <p className={ls.modalSub}>{selected.dept}</p>
              </div>
              <button className={ls.modalClose} onClick={() => setSelected(null)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className={ls.modalBody}>
              <div className={ls.modalGrid}>
                <div className={ls.modalField}>
                  <span className={ls.modalLabel}>Leave Type</span>
                  <span className={`${s.badge} ${s[TYPE_COLOR[selected.type]]}`}>{selected.type}</span>
                </div>
                <div className={ls.modalField}>
                  <span className={ls.modalLabel}>Status</span>
                  <span className={`${s.badge} ${s[STATUS_COLOR[selected.status]]}`}>{selected.status}</span>
                </div>
                <div className={ls.modalField}>
                  <span className={ls.modalLabel}>From</span>
                  <span className={ls.modalVal}>{selected.from}</span>
                </div>
                <div className={ls.modalField}>
                  <span className={ls.modalLabel}>To</span>
                  <span className={ls.modalVal}>{selected.to}</span>
                </div>
                <div className={ls.modalField}>
                  <span className={ls.modalLabel}>Duration</span>
                  <span className={ls.modalVal}>{selected.days} day{selected.days > 1 ? "s" : ""}</span>
                </div>
                <div className={ls.modalField}>
                  <span className={ls.modalLabel}>Applied On</span>
                  <span className={ls.modalVal}>{selected.applied}</span>
                </div>
              </div>

              <div className={ls.modalReason}>
                <span className={ls.modalLabel}>Reason</span>
                <p className={ls.modalReasonText}>{selected.reason}</p>
              </div>
            </div>

            {selected.status === "Pending" && (
              <div className={ls.modalActions}>
                <button className={ls.rejectBtn} onClick={() => updateStatus(selected.id, "Rejected")}>
                  <Icon name="x" size={15} /> Reject
                </button>
                <button className={ls.approveBtn} onClick={() => updateStatus(selected.id, "Approved")}>
                  <Icon name="check" size={15} /> Approve
                </button>
              </div>
            )}
            {selected.status !== "Pending" && (
              <div className={ls.modalActions}>
                <p className={ls.modalDone}>
                  This request has been <strong>{selected.status.toLowerCase()}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
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
          {nav.map(item => (
            <button key={item.id} className={`${s.navItem} ${activeNav === item.id ? s.active : ""}`} onClick={() => setActiveNav(item.id)}>
              <Icon name={item.icon} />
              {item.label}
              {item.badge > 0 && <span className={s.navBadge}>{item.badge}</span>}
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
            <button className={s.logoutBtn} onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={s.main}>
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <h1>Leave Management</h1>
            <p>Review, approve and track employee leave requests</p>
          </div>
          <div className={s.topbarRight}>
            <span className={s.rolePill}>HR Manager</span>
            <div className={s.iconBtn}><Icon name="bell" /><span className={s.notifDot} /></div>
          </div>
        </header>

        <div className={s.content}>

          {/* ── Stats ── */}
          <div className={s.statsGrid}>
            {[
              { label: "Total Requests",    value: requests.length,    change: "this month", trend: "neutral", color: "blue",   icon: "calendar" },
              { label: "Pending",           value: pending,            change: "action needed", trend: pending > 0 ? "down" : "up", color: "orange", icon: "clock" },
              { label: "Approved",          value: approved,           change: `${totalDaysApproved} days`, trend: "up",     color: "green",  icon: "check" },
              { label: "Rejected",          value: rejected,           change: "this month", trend: "neutral", color: "red",    icon: "x" },
            ].map(stat => (
              <div className={s.statCard} key={stat.label}>
                <div className={s.statCardTop}>
                  <div className={`${s.statCardIcon} ${s[stat.color]}`}><Icon name={stat.icon} /></div>
                  <span className={`${s.statCardChange} ${s[stat.trend]}`}>{stat.change}</span>
                </div>
                <div>
                  <div className={s.statCardVal}>{stat.value}</div>
                  <div className={s.statCardLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Main panel ── */}
          <div className={s.panel}>
            {/* Filters */}
            <div className={ls.filterBar}>
              {/* Status tabs */}
              <div className={ls.tabs}>
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab}
                    className={`${ls.tab} ${activeTab === tab ? ls.tabActive : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    <span className={ls.tabCount}>
                      {tab === "All" ? requests.length : requests.filter(r => r.status === tab).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className={ls.filterRight}>
                {/* Search */}
                <div className={ls.searchWrap}>
                  <Icon name="search" size={15} />
                  <input
                    className={ls.searchInput}
                    placeholder="Search name or dept…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                {/* Type filter */}
                <div className={ls.selectWrap}>
                  <Icon name="filter" size={14} />
                  <select className={ls.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className={ls.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Dates</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className={s.emptyState}>
                          <Icon name="calendar" size={32} />
                          <p>No leave requests match your filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map(req => (
                    <tr key={req.id} className={ls.tableRow}>
                      <td>
                        <div className={s.avatarRow}>
                          <div
                            className={s.avatarSm}
                            style={{ background: req.color + "28", color: req.color }}
                          >
                            {req.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className={s.avatarName}>{req.name}</div>
                            <div className={s.avatarSub}>{req.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${s.badge} ${s[TYPE_COLOR[req.type]]}`}>{req.type}</span>
                      </td>
                      <td>
                        <span className={ls.daysChip}>{req.days} day{req.days > 1 ? "s" : ""}</span>
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                        {req.from} → {req.to}
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "var(--muted2)" }}>{req.applied}</td>
                      <td>
                        <span className={`${s.badge} ${s[STATUS_COLOR[req.status]]}`}>{req.status}</span>
                      </td>
                      <td>
                        <div className={ls.actionBtns}>
                          <button className={ls.viewBtn} onClick={() => setSelected(req)} title="View details">
                            <Icon name="eye" size={14} />
                          </button>
                          {req.status === "Pending" && (
                            <>
                              <button className={ls.approveIconBtn} onClick={() => updateStatus(req.id, "Approved")} title="Approve">
                                <Icon name="check" size={14} />
                              </button>
                              <button className={ls.rejectIconBtn} onClick={() => updateStatus(req.id, "Rejected")} title="Reject">
                                <Icon name="x" size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Leave Balance Panel ── */}
          <div className={s.panel} style={{ marginTop: 20 }}>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>Employee Leave Balance</span>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>FY 2025–26</span>
            </div>
            <div className={s.panelBody}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Casual Leave</th>
                    <th>Earned Leave</th>
                    <th>Medical Leave</th>
                    <th>Total Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {LEAVE_BALANCE.map((emp, i) => (
                    <tr key={i}>
                      <td>
                        <div className={s.avatarRow}>
                          <div className={s.avatarSm} style={{ background: "var(--border)", color: "var(--muted)" }}>
                            {emp.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className={s.avatarName}>{emp.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className={s.progressWrap}>
                          <div className={s.progressBar}>
                            <div className={`${s.progressFill} ${s.blue}`} style={{ width: `${(emp.casual / 12) * 100}%` }} />
                          </div>
                          <span className={s.progressPct}>{emp.casual}</span>
                        </div>
                      </td>
                      <td>
                        <div className={s.progressWrap}>
                          <div className={s.progressBar}>
                            <div className={s.progressFill} style={{ width: `${(emp.earned / 20) * 100}%` }} />
                          </div>
                          <span className={s.progressPct}>{emp.earned}</span>
                        </div>
                      </td>
                      <td>
                        <div className={s.progressWrap}>
                          <div className={s.progressBar}>
                            <div className={`${s.progressFill} ${s.orange}`} style={{ width: `${(emp.medical / 10) * 100}%` }} />
                          </div>
                          <span className={s.progressPct}>{emp.medical}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${s.badge} ${emp.total > 18 ? s.green : emp.total > 10 ? s.orange : s.red}`}
                        >
                          {emp.total} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
