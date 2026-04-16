import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

/* ── Mock fallback data ── */
const MOCK_REQUESTS = [
  { id: 1, name: "Rohit Kumar",   dept: "Marketing",   type: "Sick Leave",    startDate: "2026-02-27", endDate: "2026-03-01", days: 3, reason: "Fever and throat infection, doctor advised rest.", status: "Pending" },
  { id: 2, name: "Anjali Rao",    dept: "Design",      type: "Casual Leave",  startDate: "2026-03-01", endDate: "2026-03-01", days: 1, reason: "Personal work.", status: "Pending" },
  { id: 3, name: "Dev Singh",     dept: "Engineering", type: "Paid Time Off", startDate: "2026-03-04", endDate: "2026-03-08", days: 5, reason: "Family trip planned for a long time.", status: "Pending" },
  { id: 4, name: "Karan Patel",   dept: "Engineering", type: "Sick Leave",    startDate: "2026-03-10", endDate: "2026-03-11", days: 2, reason: "Dental surgery follow-up.", status: "Pending" },
  { id: 5, name: "Neha Sharma",   dept: "HR",          type: "Casual Leave",  startDate: "2026-03-20", endDate: "2026-03-22", days: 3, reason: "Visiting hometown.", status: "Pending" },
];

const TYPE_COLORS = {
  "Sick Leave":    "#ff5f7e",
  "Casual Leave":  "#4fb4ff",
  "Paid Time Off": "#c084fc",
};

export default function Approval() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    async function fetchPending() {
      try {
        const data = await api.getLeaves(null, user?.role);
        if (data.success && data.leaves) {
          setRequests(data.leaves.filter(l => l.status === "Pending"));
        } else {
          setRequests(MOCK_REQUESTS);
        }
      } catch {
        console.warn("API unavailable, using mock data");
        setRequests(MOCK_REQUESTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPending();
  }, [user]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (id, status) => {
    setActionLoading(id);
    try {
      await api.updateLeaveStatus(id, status);
    } catch {
      console.warn("API unavailable, updating locally");
    }
    // Update local state
    setRequests(prev => prev.filter(r => r.id !== id));
    setSelectedRequest(null);
    showToast(
      status === "Approved" ? "✓ Leave request approved!" : "✕ Leave request rejected.",
      status === "Approved" ? "success" : "error"
    );
    setActionLoading(null);
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("") || "?";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{
              position: "fixed", top: "24px", right: "24px", zIndex: 100,
              padding: "14px 24px", borderRadius: "12px",
              background: toast.type === "success" ? "rgba(79, 255, 176, 0.15)" : "rgba(255, 95, 126, 0.15)",
              border: `1px solid ${toast.type === "success" ? "rgba(79, 255, 176, 0.4)" : "rgba(255, 95, 126, 0.4)"}`,
              color: toast.type === "success" ? "#4fffb0" : "#ff5f7e",
              fontWeight: 600, fontSize: "0.9rem",
              backdropFilter: "blur(12px)",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{ maxWidth: "520px", width: "100%", padding: "32px" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "50px", height: "50px", borderRadius: "14px",
                    background: "rgba(79, 255, 176, 0.1)", color: "var(--primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem", fontWeight: 700,
                  }}>
                    {getInitials(selectedRequest.name)}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: "2px" }}>{selectedRequest.name}</h3>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{selectedRequest.dept}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  style={{
                    background: "none", border: "none", color: "var(--text-muted)",
                    fontSize: "1.4rem", cursor: "pointer", padding: "4px",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                {[
                  { label: "Leave Type", value: selectedRequest.type },
                  { label: "Duration", value: `${selectedRequest.days} day${selectedRequest.days > 1 ? "s" : ""}` },
                  { label: "From", value: selectedRequest.startDate },
                  { label: "To", value: selectedRequest.endDate },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Reason */}
              <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border-color)", marginBottom: "24px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Reason</div>
                <p style={{ lineHeight: 1.6, fontSize: "0.9rem" }}>{selectedRequest.reason}</p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => handleAction(selectedRequest.id, "Rejected")}
                  disabled={actionLoading === selectedRequest.id}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "10px",
                    border: "1px solid rgba(255, 95, 126, 0.3)",
                    background: "rgba(255, 95, 126, 0.1)", color: "#ff5f7e",
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  ✕ Reject
                </button>
                <button
                  onClick={() => handleAction(selectedRequest.id, "Approved")}
                  disabled={actionLoading === selectedRequest.id}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "10px",
                    border: "none",
                    background: "var(--primary)", color: "var(--bg-dark)",
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  ✓ Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ marginBottom: "0.5rem" }}>Approval Panel</h1>
          <p style={{ color: "var(--text-muted)" }}>Review and manage pending leave requests</p>
        </div>
        <div style={{
          padding: "8px 20px", borderRadius: "10px",
          background: "rgba(255, 181, 71, 0.12)", color: "#ffb547",
          fontWeight: 600, fontSize: "0.85rem",
        }}>
          {requests.length} pending request{requests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Request Cards ── */}
      {loading ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "var(--text-muted)" }}>Loading pending requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
          <h3 style={{ marginBottom: "8px" }}>All caught up!</h3>
          <p style={{ color: "var(--text-muted)" }}>No pending leave requests to review</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {requests.map((req, i) => {
            const typeColor = TYPE_COLORS[req.type] || "#4fb4ff";
            return (
              <motion.div
                key={req.id}
                className="glass-card"
                style={{ padding: "20px 24px" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ borderColor: "rgba(79,255,176,0.3)" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  {/* Employee Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "200px" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: "rgba(79, 255, 176, 0.08)", color: "var(--primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", fontWeight: 700, flexShrink: 0,
                    }}>
                      {getInitials(req.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "2px" }}>{req.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{req.dept}</div>
                    </div>
                  </div>

                  {/* Leave Type */}
                  <div style={{
                    padding: "5px 14px", borderRadius: "8px",
                    background: `${typeColor}15`, color: typeColor,
                    fontSize: "0.78rem", fontWeight: 600,
                  }}>
                    {req.type}
                  </div>

                  {/* Duration */}
                  <div style={{ textAlign: "center", minWidth: "100px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Duration</div>
                    <div style={{ fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                      {req.days} day{req.days > 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Dates */}
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: "180px" }}>
                    {req.startDate} → {req.endDate}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      title="View details"
                      style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        border: "1px solid var(--border-color)", background: "transparent",
                        color: "var(--text-muted)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      👁
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "Approved")}
                      disabled={actionLoading === req.id}
                      title="Approve"
                      style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        border: "1px solid rgba(79, 255, 176, 0.3)",
                        background: "rgba(79, 255, 176, 0.1)", color: "#4fffb0",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", transition: "all 0.2s",
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "Rejected")}
                      disabled={actionLoading === req.id}
                      title="Reject"
                      style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        border: "1px solid rgba(255, 95, 126, 0.3)",
                        background: "rgba(255, 95, 126, 0.1)", color: "#ff5f7e",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", transition: "all 0.2s",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}