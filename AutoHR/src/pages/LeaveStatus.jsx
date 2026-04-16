import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

/* ── Mock fallback data ── */
const MOCK_LEAVES = [
  { id: 1, type: "Sick Leave",   startDate: "2026-05-10", endDate: "2026-05-12", status: "Pending",  reason: "Fever and throat infection" },
  { id: 2, type: "Casual Leave", startDate: "2026-01-05", endDate: "2026-01-08", status: "Approved", reason: "Personal work" },
  { id: 3, type: "Paid Time Off",startDate: "2026-03-20", endDate: "2026-03-22", status: "Rejected", reason: "Family event" },
  { id: 4, type: "Sick Leave",   startDate: "2026-04-01", endDate: "2026-04-02", status: "Approved", reason: "Medical appointment" },
  { id: 5, type: "Casual Leave", startDate: "2026-04-15", endDate: "2026-04-15", status: "Pending",  reason: "Bank work" },
];

const STATUS_CONFIG = {
  Pending:  { color: "#ffb547", bg: "rgba(255, 181, 71, 0.12)", icon: "⏳" },
  Approved: { color: "#4fffb0", bg: "rgba(79, 255, 176, 0.12)", icon: "✓" },
  Rejected: { color: "#ff5f7e", bg: "rgba(255, 95, 126, 0.12)", icon: "✕" },
};

const TYPE_COLORS = {
  "Sick Leave":    "#ff5f7e",
  "Casual Leave":  "#4fb4ff",
  "Paid Time Off": "#c084fc",
};

function getDayCount(start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
}

export default function LeaveStatus() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    async function fetchLeaves() {
      try {
        const data = await api.getLeaves(user?.email, user?.role);
        if (data.success && data.leaves) {
          setLeaves(data.leaves);
        } else {
          setLeaves(MOCK_LEAVES);
        }
      } catch {
        console.warn("API unavailable, using mock leave data");
        setLeaves(MOCK_LEAVES);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaves();
  }, [user]);

  const tabs = ["All", "Pending", "Approved", "Rejected"];
  const filtered = filter === "All" ? leaves : leaves.filter(l => l.status === filter);

  const stats = {
    total:    leaves.length,
    pending:  leaves.filter(l => l.status === "Pending").length,
    approved: leaves.filter(l => l.status === "Approved").length,
    rejected: leaves.filter(l => l.status === "Rejected").length,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Leave Status</h1>
        <p style={{ color: "var(--text-muted)" }}>Track and monitor all your leave requests</p>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "2rem" }}>
        {[
          { label: "Total Requests", value: stats.total,    color: "#4fb4ff" },
          { label: "Pending",        value: stats.pending,  color: "#ffb547" },
          { label: "Approved",       value: stats.approved, color: "#4fffb0" },
          { label: "Rejected",       value: stats.rejected, color: "#ff5f7e" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="glass-card"
            style={{ padding: "20px", textAlign: "center" }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="glass-card" style={{ marginBottom: "1.5rem", padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "8px 20px",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: filter === tab ? "var(--primary)" : "var(--border-color)",
                background: filter === tab ? "rgba(79, 255, 176, 0.12)" : "transparent",
                color: filter === tab ? "var(--primary)" : "var(--text-muted)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab}
              <span style={{
                marginLeft: "8px",
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "6px",
                background: filter === tab ? "rgba(79, 255, 176, 0.2)" : "rgba(255,255,255,0.05)",
              }}>
                {tab === "All" ? stats.total : stats[tab.toLowerCase()]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Leave Cards ── */}
      {loading ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "var(--text-muted)" }}>Loading your leave requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📋</div>
          <p style={{ color: "var(--text-muted)" }}>No {filter !== "All" ? filter.toLowerCase() : ""} leave requests found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <AnimatePresence>
            {filtered.map((leave, i) => {
              const days = getDayCount(leave.startDate, leave.endDate);
              const sc = STATUS_CONFIG[leave.status] || STATUS_CONFIG.Pending;
              const typeColor = TYPE_COLORS[leave.type] || "#4fb4ff";

              return (
                <motion.div
                  key={leave.id}
                  className="glass-card"
                  style={{ padding: "20px 24px", cursor: "pointer" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01, borderColor: "rgba(79,255,176,0.3)" }}
                  onClick={() => setSelectedLeave(selectedLeave?.id === leave.id ? null : leave)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    {/* Left: Type + Dates */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "200px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: `${typeColor}18`, color: typeColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.1rem", fontWeight: 700, flexShrink: 0,
                      }}>
                        {leave.type.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", marginBottom: "2px" }}>
                          {leave.type}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {leave.startDate} → {leave.endDate}
                        </div>
                      </div>
                    </div>

                    {/* Center: Duration */}
                    <div style={{ textAlign: "center", minWidth: "80px" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration</div>
                      <div style={{ fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{days} day{days > 1 ? "s" : ""}</div>
                    </div>

                    {/* Right: Status */}
                    <div style={{
                      padding: "6px 16px", borderRadius: "8px",
                      background: sc.bg, color: sc.color,
                      fontSize: "0.8rem", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: "6px",
                    }}>
                      <span>{sc.icon}</span>
                      {leave.status}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {selectedLeave?.id === leave.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{
                          marginTop: "16px", paddingTop: "16px",
                          borderTop: "1px solid var(--border-color)",
                        }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                            Reason
                          </div>
                          <p style={{ color: "var(--text-main)", lineHeight: 1.6 }}>
                            {leave.reason || "No reason provided"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}