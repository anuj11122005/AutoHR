import { useState } from "react";
import s from "./Dashboard.module.css";

// ─── Mock Data ────────────────────────────────────────────
const MOCK = {
  user: { name: "Dr. Amit Verma", role: "Faculty", initials: "AV" },
  stats: [
    { label: "My Courses",       value: "4",   change: "Active", trend: "neutral", color: "green",  icon: "book" },
    { label: "Total Students",   value: "142", change: "+6",     trend: "up",      color: "blue",   icon: "users" },
    { label: "Avg. Attendance",  value: "84%", change: "+2%",    trend: "up",      color: "orange", icon: "chart" },
    { label: "Pending Tasks",    value: "7",   change: "due",    trend: "neutral", color: "red",    icon: "clock" },
  ],
  courses: [
    { code: "CS401", name: "Data Structures",       students: 42, progress: 68, nextClass: "Today 10:00 AM",  color: "#4fffb0" },
    { code: "CS302", name: "Operating Systems",      students: 38, progress: 45, nextClass: "Today 2:00 PM",   color: "#4fb4ff" },
    { code: "CS501", name: "Machine Learning",       students: 35, progress: 30, nextClass: "Thu 11:00 AM",    color: "#ffb547" },
    { code: "CS205", name: "Database Management",    students: 27, progress: 82, nextClass: "Fri 9:00 AM",     color: "#c084fc" },
  ],
  schedule: [
    { time: "10:00 AM", course: "Data Structures",    room: "Lab 3",   type: "Lecture" },
    { time: "12:00 PM", course: "—",                  room: "—",       type: "Break" },
    { time: "2:00 PM",  course: "Operating Systems",  room: "Hall B",  type: "Lecture" },
    { time: "4:00 PM",  course: "Office Hours",       room: "Room 12", type: "Office" },
  ],
  attendance: [
    { name: "Riya Sharma",   course: "CS401", pct: 92, status: "Good" },
    { name: "Ankit Gupta",   course: "CS302", pct: 61, status: "Low" },
    { name: "Priya Singh",   course: "CS501", pct: 78, status: "Average" },
    { name: "Vikram Nair",   course: "CS401", pct: 55, status: "Low" },
    { name: "Meghna Das",    course: "CS205", pct: 95, status: "Good" },
  ],
  assignments: [
    { title: "Binary Trees Lab",        course: "CS401", due: "Feb 28", submissions: 36, total: 42, status: "Open" },
    { title: "Shell Scripting Exercise",course: "CS302", due: "Mar 1",  submissions: 20, total: 38, status: "Open" },
    { title: "Neural Net Implementation",course:"CS501", due: "Mar 7",  submissions: 5,  total: 35, status: "Open" },
    { title: "SQL Normalization Quiz",   course: "CS205", due: "Feb 25", submissions: 27, total: 27, status: "Closed" },
  ],
  announcements: [
    { title: "Mid-term exam schedule released", time: "Today",    dot: "green" },
    { title: "Faculty meeting — 5 PM, Room 1",  time: "Today",    dot: "orange" },
    { title: "Guest lecture: Dr. Rao — AI",     time: "Tomorrow", dot: "blue" },
    { title: "Leave application approved",       time: "2d ago",   dot: "green" },
  ],
  weekAttendance: [72, 80, 78, 90, 84, 0, 0], // Mon–Sun
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxBar = Math.max(...MOCK.weekAttendance.filter(Boolean));

// ─── Icons ────────────────────────────────────────────────
function Icon({ name }) {
  const icons = {
    book:       <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5"/></>,
    users:      <><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    chart:      <><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6"  y1="20" x2="6"  y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    clock:      <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
    search:     <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    logout:     <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    dashboard:  <><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></>,
    courses:    <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    attendance: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><polyline points="16 11 18 13 22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    assignment: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/></>,
    schedule:   <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    announce:   <><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" stroke="currentColor" strokeWidth="1.5"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none">{icons[name] || null}</svg>;
}

const attendanceColor = { Good: "green", Average: "orange", Low: "red" };
const assignColor     = { Open: "green", Closed: "muted" };
const scheduleColor   = { Lecture: "green", Break: "muted", Office: "blue" };

export default function FacultyDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const nav = [
    { id: "dashboard",  label: "Dashboard",   icon: "dashboard" },
    { id: "courses",    label: "My Courses",  icon: "courses" },
    { id: "attendance", label: "Attendance",  icon: "attendance" },
    { id: "assignment", label: "Assignments", icon: "assignment", badge: 3 },
    { id: "schedule",   label: "Schedule",    icon: "schedule" },
    { id: "announce",   label: "Announcements",icon: "announce" },
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
          <p className={s.navLabel}>Faculty</p>
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
            <h1>Faculty Dashboard</h1>
            <p>Thursday, 26 February 2026</p>
          </div>
          <div className={s.topbarRight}>
            <span className={s.rolePill}>Faculty</span>
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

          {/* Row 1: My Courses + Today's Schedule */}
          <div className={s.grid3}>
            {/* Courses */}
            <div className={s.panel}>
              <div className={s.panelHead}>
                <span className={s.panelTitle}>My Courses</span>
                <button className={s.panelAction}>View all →</button>
              </div>
              <div className={s.panelBody}>
                {MOCK.courses.map((c) => (
                  <div className={s.listItem} key={c.code} style={{ alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: c.color + "22", color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.65rem", flexShrink: 0 }}>
                      {c.code}
                    </div>
                    <div className={s.listMain}>
                      <div className={s.listTitle}>{c.name}</div>
                      <div className={s.listSub}>{c.students} students · Next: {c.nextClass}</div>
                      <div className={s.progressWrap} style={{ marginTop: 8 }}>
                        <div className={s.progressBar}>
                          <div className={s.progressFill} style={{ width: `${c.progress}%`, background: c.color }} />
                        </div>
                        <span className={s.progressPct}>{c.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className={s.panel}>
              <div className={s.panelHead}>
                <span className={s.panelTitle}>Today's Schedule</span>
                <span style={{ fontSize: "0.72rem", color: "var(--accent)" }}>Thu 26 Feb</span>
              </div>
              <div className={s.panelBody}>
                {MOCK.schedule.map((item, i) => (
                  <div className={s.listItem} key={i}>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", minWidth: 60, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{item.time}</div>
                    <div className={s.listMain}>
                      <div className={s.listTitle} style={{ opacity: item.type === "Break" ? 0.4 : 1 }}>{item.course}</div>
                      <div className={s.listSub}>{item.room}</div>
                    </div>
                    <span className={`${s.badge} ${s[scheduleColor[item.type]]}`}>{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Assignments + Attendance */}
          <div className={s.grid2}>
            {/* Assignments */}
            <div className={s.panel}>
              <div className={s.panelHead}>
                <span className={s.panelTitle}>Assignments</span>
                <button className={s.panelAction}>Add new →</button>
              </div>
              <div className={s.panelBody}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Title</th><th>Course</th><th>Submissions</th><th>Due</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {MOCK.assignments.map((a, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500, fontSize: "0.83rem" }}>{a.title}</td>
                        <td><span className={`${s.badge} ${s.blue}`}>{a.course}</span></td>
                        <td>
                          <div className={s.progressWrap}>
                            <div className={s.progressBar}>
                              <div className={`${s.progressFill}`} style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                            </div>
                            <span className={s.progressPct}>{a.submissions}/{a.total}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{a.due}</td>
                        <td><span className={`${s.badge} ${s[assignColor[a.status]]}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance + Announcements */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Student Attendance */}
              <div className={s.panel}>
                <div className={s.panelHead}>
                  <span className={s.panelTitle}>Student Attendance</span>
                  <button className={s.panelAction}>Full report →</button>
                </div>
                <div className={s.panelBody}>
                  {MOCK.attendance.map((st, i) => (
                    <div className={s.listItem} key={i}>
                      <div className={s.avatarSm} style={{ background: "var(--border)", color: "var(--muted)", fontSize: "0.65rem" }}>
                        {st.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className={s.listMain}>
                        <div className={s.listTitle}>{st.name}</div>
                        <div className={s.progressWrap} style={{ marginTop: 4 }}>
                          <div className={s.progressBar}>
                            <div
                              className={s.progressFill}
                              style={{
                                width: `${st.pct}%`,
                                background: st.pct >= 85 ? "var(--accent)" : st.pct >= 70 ? "var(--warning)" : "var(--danger)"
                              }}
                            />
                          </div>
                          <span className={s.progressPct}>{st.pct}%</span>
                        </div>
                      </div>
                      <span className={`${s.badge} ${s[attendanceColor[st.status]]}`}>{st.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements */}
              <div className={s.panel}>
                <div className={s.panelHead}>
                  <span className={s.panelTitle}>Announcements</span>
                  <button className={s.panelAction}>Post →</button>
                </div>
                <div className={s.panelBody}>
                  {MOCK.announcements.map((ann, i) => (
                    <div className={s.listItem} key={i}>
                      <div className={`${s.listDot} ${s[ann.dot]}`} />
                      <div className={s.listMain}>
                        <div className={s.listTitle}>{ann.title}</div>
                      </div>
                      <div className={s.listTime}>{ann.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Attendance Chart */}
          <div className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>Weekly Class Attendance</span>
              <span style={{ fontSize: "0.75rem", color: "var(--accent)" }}>Avg 80.8%</span>
            </div>
            <div className={s.panelBody}>
              <div className={s.chartBars}>
                {MOCK.weekAttendance.map((val, i) => (
                  <div
                    key={i}
                    className={`${s.bar} ${i === 3 ? s.active : ""}`}
                    style={{ height: val ? `${(val / maxBar) * 100}%` : "8px", opacity: val ? 1 : 0.2 }}
                    title={`${days[i]}: ${val ? val + "%" : "No class"}`}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {days.map(d => <span key={d} style={{ fontSize: "0.65rem", color: "var(--muted2)", flex: 1, textAlign: "center" }}>{d}</span>)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}