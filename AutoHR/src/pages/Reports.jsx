import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

/* ── Mock report data ── */
const MONTHLY_DATA = [
  { month: "Jan", casual: 8,  sick: 12, pto: 4,  total: 24 },
  { month: "Feb", casual: 10, sick: 8,  pto: 6,  total: 24 },
  { month: "Mar", casual: 6,  sick: 14, pto: 3,  total: 23 },
  { month: "Apr", casual: 12, sick: 9,  pto: 7,  total: 28 },
  { month: "May", casual: 15, sick: 11, pto: 5,  total: 31 },
  { month: "Jun", casual: 9,  sick: 7,  pto: 8,  total: 24 },
];

const DEPT_DATA = [
  { dept: "Engineering", employees: 32, leaves: 48, avgPerEmp: 1.5, trend: "↓" },
  { dept: "Design",      employees: 12, leaves: 18, avgPerEmp: 1.5, trend: "→" },
  { dept: "Marketing",   employees: 18, leaves: 24, avgPerEmp: 1.3, trend: "↓" },
  { dept: "HR",          employees: 8,  leaves: 6,  avgPerEmp: 0.8, trend: "↓" },
  { dept: "Finance",     employees: 10, leaves: 14, avgPerEmp: 1.4, trend: "↑" },
  { dept: "Product",     employees: 5,  leaves: 8,  avgPerEmp: 1.6, trend: "↑" },
];

const TOP_LEAVE_TYPES = [
  { type: "Sick Leave",    count: 61, pct: 39, color: "#ff5f7e" },
  { type: "Casual Leave",  count: 60, pct: 38, color: "#4fb4ff" },
  { type: "Paid Time Off", count: 33, pct: 21, color: "#c084fc" },
  { type: "Maternity",     count: 3,  pct: 2,  color: "#ffb547" },
];

export default function Reports() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("6months");

  const totalLeaves = MONTHLY_DATA.reduce((a, m) => a + m.total, 0);
  const avgPerMonth = (totalLeaves / MONTHLY_DATA.length).toFixed(1);
  const maxBar = Math.max(...MONTHLY_DATA.map(m => m.total));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ marginBottom: "0.5rem" }}>Reports & Analytics</h1>
          <p style={{ color: "var(--text-muted)" }}>Organization-wide leave statistics and trends</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "3 Months", value: "3months" },
            { label: "6 Months", value: "6months" },
            { label: "Year",     value: "year" },
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              style={{
                padding: "8px 18px", borderRadius: "10px",
                border: "1px solid",
                borderColor: period === p.value ? "var(--primary)" : "var(--border-color)",
                background: period === p.value ? "rgba(79, 255, 176, 0.12)" : "transparent",
                color: period === p.value ? "var(--primary)" : "var(--text-muted)",
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.8rem",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Leaves",     value: totalLeaves, color: "#4fb4ff",  icon: "📊" },
          { label: "Avg / Month",      value: avgPerMonth,  color: "#4fffb0",  icon: "📈" },
          { label: "Total Employees",  value: 85,           color: "#c084fc",  icon: "👥" },
          { label: "Departments",      value: DEPT_DATA.length, color: "#ffb547", icon: "🏢" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card"
            style={{ padding: "24px", textAlign: "center" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginBottom: "24px" }}>

        {/* ── Bar Chart ── */}
        <div className="glass-card" style={{ padding: "28px 32px" }}>
          <h3 style={{ marginBottom: "24px" }}>Monthly Leave Trends</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "220px" }}>
            {MONTHLY_DATA.map((m, i) => (
              <motion.div
                key={m.month}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transformOrigin: "bottom" }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)" }}>{m.total}</span>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.pto / maxBar) * 180}px` }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                    style={{ background: "#c084fc", borderRadius: "4px 4px 0 0", minHeight: m.pto > 0 ? "4px" : "0" }}
                    title={`PTO: ${m.pto}`}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.sick / maxBar) * 180}px` }}
                    transition={{ delay: i * 0.1 + 0.15, duration: 0.6 }}
                    style={{ background: "#ff5f7e", minHeight: m.sick > 0 ? "4px" : "0" }}
                    title={`Sick: ${m.sick}`}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.casual / maxBar) * 180}px` }}
                    transition={{ delay: i * 0.1 + 0.1, duration: 0.6 }}
                    style={{ background: "#4fb4ff", borderRadius: "0 0 4px 4px", minHeight: m.casual > 0 ? "4px" : "0" }}
                    title={`Casual: ${m.casual}`}
                  />
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.month}</span>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "20px", marginTop: "20px", justifyContent: "center" }}>
            {[
              { label: "Casual", color: "#4fb4ff" },
              { label: "Sick",   color: "#ff5f7e" },
              { label: "PTO",    color: "#c084fc" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: l.color }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Leave Type Distribution ── */}
        <div className="glass-card" style={{ padding: "28px 24px" }}>
          <h3 style={{ marginBottom: "24px" }}>Leave Type Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {TOP_LEAVE_TYPES.map((lt, i) => (
              <motion.div
                key={lt.type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{lt.type}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{lt.count} ({lt.pct}%)</span>
                </div>
                <div style={{
                  height: "8px", borderRadius: "4px",
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lt.pct}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    style={{ height: "100%", borderRadius: "4px", background: lt.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Department Table ── */}
      <div className="glass-card" style={{ padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Department Overview</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>FY 2025–26</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr>
                {["Department", "Employees", "Total Leaves", "Avg / Emp", "Trend"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "10px 16px",
                    fontSize: "0.7rem", color: "var(--text-muted)",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    fontWeight: 600, borderBottom: "1px solid var(--border-color)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPT_DATA.map((dept, i) => (
                <motion.tr
                  key={dept.dept}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ borderRadius: "10px" }}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: "0.9rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: "rgba(79, 255, 176, 0.08)", color: "var(--primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 700,
                      }}>
                        {dept.dept.charAt(0)}
                      </div>
                      {dept.dept}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "0.88rem" }}>{dept.employees}</td>
                  <td style={{ padding: "14px 16px", fontSize: "0.88rem", fontWeight: 700 }}>{dept.leaves}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "6px",
                      background: dept.avgPerEmp > 1.4 ? "rgba(255, 95, 126, 0.12)" : "rgba(79, 255, 176, 0.12)",
                      color: dept.avgPerEmp > 1.4 ? "#ff5f7e" : "#4fffb0",
                      fontSize: "0.8rem", fontWeight: 600,
                    }}>
                      {dept.avgPerEmp}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "1.1rem" }}>
                    <span style={{
                      color: dept.trend === "↑" ? "#ff5f7e" : dept.trend === "↓" ? "#4fffb0" : "var(--text-muted)",
                    }}>
                      {dept.trend}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}