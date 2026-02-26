import { useState } from "react";
import s from "./Dashboard.module.css";

// ─── Mock Data ────────────────────────────────────────────
const MOCK = {
  user: { name: "Sara Williams", role: "HR Manager", initials: "SW" },
  stats: [
    { label: "Total Employees", value: "284", change: "+12", trend: "up",    color: "green",  icon: "users" },
    { label: "Open Positions",  value: "18",  change: "+3",  trend: "up",    color: "blue",   icon: "briefcase" },
    { label: "On Leave Today",  value: "9",   change: "-2",  trend: "down",  color: "orange", icon: "calendar" },
    { label: "Pending Leaves",  value: "5",   change: "new", trend: "neutral", color: "red",  icon: "clock" },
  ],
  employees: [
    { id: 1, name: "Alex Johnson",  dept: "Engineering",  status: "Active",  salary: "₹82,000", joined: "Jan 2022",   color: "#4fffb0" },
    { id: 2, name: "Priya Mehta",   dept: "Design",       status: "Active",  salary: "₹74,000", joined: "Mar 2023",   color: "#4fb4ff" },
    { id: 3, name: "Rohit Kumar",   dept: "Marketing",    status: "On Leave",salary: "₹61,000", joined: "Aug 2021",   color: "#ffb547" },
    { id: 4, name: "Neha Sharma",   dept: "HR",           status: "Active",  salary: "₹69,000", joined: "Nov 2022",   color: "#ff5f7e" },
    { id: 5, name: "Karan Patel",   dept: "Engineering",  status: "Active",  salary: "₹91,000", joined: "Feb 2020",   color: "#c084fc" },
  ],
  leaveRequests: [
    { name: "Rohit Kumar",  type: "Medical",  days: 3, from: "Feb 27", status: "Pending" },
    { name: "Anjali Rao",   type: "Casual",   days: 1, from: "Mar 1",  status: "Pending" },
    { name: "Dev Singh",    type: "Earned",   days: 5, from: "Mar 4",  status: "Approved" },
    { name: "Meena Joshi",  type: "Casual",   days: 2, from: "Mar 6",  status: "Rejected" },
  ],
  jobs: [
    { title: "Senior React Developer", dept: "Engineering", applicants: 34, status: "Active" },
    { title: "UI/UX Designer",         dept: "Design",      applicants: 18, status: "Active" },
    { title: "HR Executive",           dept: "HR",          applicants: 12, status: "Active" },
    { title: "DevOps Engineer",        dept: "Engineering", applicants: 9,  status: "Paused" },
  ],
  attendance: [55, 70, 60, 85, 90, 78, 92], // Mon–Sun percentages
  deptBreakdown: [
    { label: "Engineering", pct: 38, color: "green" },
    { label: "Design",      pct: 14, color: "blue" },
    { label: "Marketing",   pct: 20, color: "orange" },
    { label: "HR",          pct: 12, color: "red" },
    { label: "Others",      pct: 16, color: "muted" },
  ],
  recentActivity: [
    { title: "New hire onboarded",       sub: "Karan Patel — Engineering",  time: "2h ago",  dot: "green" },
    { title: "Leave approved",           sub: "Dev Singh — 5 days",          time: "4h ago",  dot: "blue" },
    { title: "Payroll processed",        sub: "February 2026 — 284 emp.",   time: "1d ago",  dot: "green" },
    { title: "Job application received", sub: "Senior React Developer",      time: "1d ago",  dot: "orange" },
    { title: "Leave rejected",           sub: "Meena Joshi — reason sent",  time: "2d ago",  dot: "red" },
  ],
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxBar = Math.max(...MOCK.attendance);

// ─── Icons ────────────────────────────────────────────────
function Icon({ name }) {
  const icons = {
    users: <><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    clock: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
    search: <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></>,
    employee: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    payroll: <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    leave: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    recruit: <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    report: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/><line x1="10" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none">{icons[name]}</svg>;
}

const statusColor = { Active: "green", "On Leave": "orange", Inactive: "red" };
const leaveColor  = { Pending: "orange", Approved: "green", Rejected: "red" };
const jobColor    = { Active: "green", Paused: "muted" };

export default function HRDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const nav = [
    { id: "dashboard", label: "Dashboard",  icon: "dashboard" },
    { id: "employees", label: "Employees",  icon: "employee" },
    { id: "recruit",   label: "Recruitment",icon: "recruit",  badge: 4 },
    { id: "leave",     label: "Leave",      icon: "leave",    badge: 5 },
    { id: "payroll",   label: "Payroll",    icon: "payroll" },
    { id: "reports",   label: "Reports",    icon: "report" },
  ];

  return (
    <div className={s.layout}>
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
          {nav.map((item) => (
            <button key={item.id} className={`${s.navItem} ${activeNav === item.id ? s.active : ""}`} onClick={() => setActiveNav(item.id)}>
              <Icon name={item.icon} />
              {item.label}
              {item.badge && <span className={s.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </div>

        <div className={s.sidebarBottom}>
          <div className={s.userCard}>
            <div className={s.avatar}>{MOCK.user.initials}</div>
            <div className={s.userInfo}>
              <div className={s.userName}>{MOCK.user.name}</div>
              <div className={s.userRole}>{MOCK.user.role}</div>
            </div>
            <button className={s.logoutBtn} onClick={() => { localStorage.clear(); window.location.href = "/login"; }} title="Logout">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={s.main}>
        {/* Topbar */}
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <h1>HR Dashboard</h1>
            <p>Thursday, 26 February 2026</p>
          </div>
          <div className={s.topbarRight}>
            <span className={s.rolePill}>HR Manager</span>
            <div className={s.iconBtn}><Icon name="search" /></div>
            <div className={s.iconBtn}><Icon name="bell" /><span className={s.notifDot} /></div>
          </div>
        </header>

        {/* Content */}
        <div className={s.content}>

          {/* Stats */}
          <div className={s.statsGrid}>
            {MOCK.stats.map((stat) => (
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

          {/* Row 1: Employee table + Leave requests */}
          <div className={s.grid3}>
            {/* Employee Table */}
            <div className={s.panel}>
              <div className={s.panelHead}>
                <span className={s.panelTitle}>Recent Employees</span>
                <button className={s.panelAction}>View all →</button>
              </div>
              <div className={s.panelBody}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Salary</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK.employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <div className={s.avatarRow}>
                            <div className={s.avatarSm} style={{ background: emp.color + "33", color: emp.color }}>
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <div className={s.avatarName}>{emp.name}</div>
                              <div className={s.avatarSub}>Since {emp.joined}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{emp.dept}</td>
                        <td style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.83rem" }}>{emp.salary}</td>
                        <td><span className={`${s.badge} ${s[statusColor[emp.status]]}`}>{emp.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leave Requests */}
            <div className={s.panel}>
              <div className={s.panelHead}>
                <span className={s.panelTitle}>Leave Requests</span>
                <button className={s.panelAction}>Manage →</button>
              </div>
              <div className={s.panelBody}>
                {MOCK.leaveRequests.map((req, i) => (
                  <div className={s.listItem} key={i}>
                    <div className={`${s.listDot} ${s[leaveColor[req.status]]}`} />
                    <div className={s.listMain}>
                      <div className={s.listTitle}>{req.name}</div>
                      <div className={s.listSub}>{req.type} · {req.days}d from {req.from}</div>
                    </div>
                    <span className={`${s.badge} ${s[leaveColor[req.status]]}`}>{req.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Open Jobs + Attendance chart + Activity */}
          <div className={s.grid2}>
            {/* Open Jobs */}
            <div className={s.panel}>
              <div className={s.panelHead}>
                <span className={s.panelTitle}>Open Positions</span>
                <button className={s.panelAction}>Post new →</button>
              </div>
              <div className={s.panelBody}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Role</th><th>Department</th><th>Applicants</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {MOCK.jobs.map((job, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500, fontSize: "0.83rem" }}>{job.title}</td>
                        <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{job.dept}</td>
                        <td>
                          <div className={s.progressWrap}>
                            <div className={s.progressBar}>
                              <div className={`${s.progressFill} ${job.applicants > 20 ? "" : job.applicants > 10 ? "blue" : "orange"}`} style={{ width: `${Math.min(job.applicants * 2, 100)}%` }} />
                            </div>
                            <span className={s.progressPct}>{job.applicants}</span>
                          </div>
                        </td>
                        <td><span className={`${s.badge} ${s[jobColor[job.status]]}`}>{job.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance + Activity */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Attendance chart */}
              <div className={s.panel}>
                <div className={s.panelHead}>
                  <span className={s.panelTitle}>Attendance This Week</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent)" }}>Avg 76%</span>
                </div>
                <div className={s.panelBody}>
                  <div className={s.chartBars}>
                    {MOCK.attendance.map((val, i) => (
                      <div
                        key={i}
                        className={`${s.bar} ${i === 4 ? s.active : ""}`}
                        style={{ height: `${(val / maxBar) * 100}%` }}
                        title={`${days[i]}: ${val}%`}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    {days.map(d => <span key={d} style={{ fontSize: "0.65rem", color: "var(--muted2)", flex: 1, textAlign: "center" }}>{d}</span>)}
                  </div>
                </div>
              </div>

              {/* Dept breakdown */}
              <div className={s.panel}>
                <div className={s.panelHead}><span className={s.panelTitle}>Dept. Breakdown</span></div>
                <div className={s.panelBody}>
                  <div className={s.ringWrap}>
                    <div
                      className={s.ring}
                      style={{
                        "--p1": "38%",
                        "--p2": "52%",
                        "--p3": "72%",
                      }}
                    >
                      <div className={s.ringInner}>
                        <div className={s.ringVal}>284</div>
                        <div className={s.ringLbl}>total</div>
                      </div>
                    </div>
                    <div className={s.ringLegend}>
                      {MOCK.deptBreakdown.map((d) => (
                        <div className={s.legendItem} key={d.label}>
                          <div className={`${s.legendDot}`} style={{ background: d.color === "green" ? "var(--accent)" : d.color === "blue" ? "var(--info)" : d.color === "orange" ? "var(--warning)" : d.color === "red" ? "var(--danger)" : "var(--muted2)" }} />
                          {d.label} <strong style={{ marginLeft: "auto", paddingLeft: 8, color: "var(--text)" }}>{d.pct}%</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>Recent Activity</span>
              <button className={s.panelAction}>View all →</button>
            </div>
            <div className={s.panelBody} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 0 }}>
              {MOCK.recentActivity.map((act, i) => (
                <div className={s.listItem} key={i}>
                  <div className={`${s.listDot} ${s[act.dot]}`} />
                  <div className={s.listMain}>
                    <div className={s.listTitle}>{act.title}</div>
                    <div className={s.listSub}>{act.sub}</div>
                  </div>
                  <div className={s.listTime}>{act.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}