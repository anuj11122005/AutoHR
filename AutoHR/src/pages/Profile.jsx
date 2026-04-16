import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "John Smith",
    email: user?.email || "employee@autohr.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    designation: user?.role || "Employee",
    joinDate: "2024-06-15",
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("") || "??";

  const ROLE_COLORS = {
    Admin:      { bg: "rgba(192, 132, 252, 0.12)", color: "#c084fc" },
    "HR Manager":{ bg: "rgba(79, 180, 255, 0.12)",  color: "#4fb4ff" },
    HR:         { bg: "rgba(79, 180, 255, 0.12)",  color: "#4fb4ff" },
    Employee:   { bg: "rgba(79, 255, 176, 0.12)",  color: "#4fffb0" },
    Manager:    { bg: "rgba(255, 181, 71, 0.12)",   color: "#ffb547" },
  };

  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.Employee;

  const infoFields = [
    { label: "Full Name",    name: "name",        type: "text" },
    { label: "Email",        name: "email",       type: "email" },
    { label: "Phone",        name: "phone",       type: "tel" },
    { label: "Department",   name: "department",  type: "text" },
    { label: "Designation",  name: "designation", type: "text", disabled: true },
    { label: "Date Joined",  name: "joinDate",    type: "date", disabled: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* ── Toast ── */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          style={{
            position: "fixed", top: "24px", right: "24px", zIndex: 100,
            padding: "14px 24px", borderRadius: "12px",
            background: "rgba(79, 255, 176, 0.15)",
            border: "1px solid rgba(79, 255, 176, 0.4)",
            color: "#4fffb0", fontWeight: 600, fontSize: "0.9rem",
            backdropFilter: "blur(12px)",
          }}
        >
          ✓ Profile updated successfully!
        </motion.div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>My Profile</h1>
        <p style={{ color: "var(--text-muted)" }}>View and manage your personal information</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>

        {/* ── Left: Profile Card ── */}
        <motion.div
          className="glass-card"
          style={{ padding: "32px", textAlign: "center" }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Avatar */}
          <div style={{
            width: "90px", height: "90px", borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(79, 255, 176, 0.2), rgba(79, 180, 255, 0.2))",
            color: "var(--primary)", fontSize: "1.8rem", fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            border: "2px solid rgba(79, 255, 176, 0.2)",
          }}>
            {getInitials(form.name)}
          </div>

          <h3 style={{ marginBottom: "6px" }}>{form.name}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>{form.email}</p>

          {/* Role Badge */}
          <div style={{
            display: "inline-block", padding: "6px 18px",
            borderRadius: "8px", background: roleStyle.bg,
            color: roleStyle.color, fontWeight: 600, fontSize: "0.8rem",
            marginBottom: "24px",
          }}>
            {user?.role || "Employee"}
          </div>

          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
            {[
              { label: "Dept.", value: form.department },
              { label: "Joined", value: new Date(form.joinDate).getFullYear() },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: "14px", borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-color)",
              }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: "0.95rem" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              width: "100%", marginTop: "24px", padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 95, 126, 0.3)",
              background: "rgba(255, 95, 126, 0.08)",
              color: "#ff5f7e", fontWeight: 700,
              fontFamily: "'Syne', sans-serif", fontSize: "0.9rem",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            Sign Out
          </button>
        </motion.div>

        {/* ── Right: Info Form ── */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <div>
              <h3 style={{ marginBottom: "4px" }}>Personal Information</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {editing ? "Edit your details below" : "Click edit to update your details"}
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: "8px 20px", borderRadius: "10px",
                  border: "1px solid var(--primary)",
                  background: "rgba(79, 255, 176, 0.08)",
                  color: "var(--primary)", fontWeight: 600,
                  fontFamily: "'Syne', sans-serif", fontSize: "0.85rem",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                ✏ Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {infoFields.map(({ label, name, type, disabled }) => (
                <div key={name} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{
                    fontSize: "0.72rem", fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}>
                    {label}
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    disabled={!editing || disabled}
                    className="form-control"
                    style={{
                      opacity: (!editing || disabled) ? 0.6 : 1,
                      cursor: (!editing || disabled) ? "default" : "text",
                    }}
                  />
                </div>
              ))}
            </div>

            {editing && (
              <div style={{ display: "flex", gap: "12px", marginTop: "28px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    padding: "10px 24px", borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "transparent", color: "var(--text-muted)",
                    fontFamily: "'Syne', sans-serif", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Activity Section ── */}
      <div className="glass-card" style={{ padding: "28px 32px", marginTop: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>Recent Activity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { action: "Leave request submitted", type: "Sick Leave", date: "Apr 10, 2026", status: "Pending", statusColor: "#ffb547" },
            { action: "Leave approved",          type: "Casual Leave", date: "Mar 28, 2026", status: "Approved", statusColor: "#4fffb0" },
            { action: "Profile updated",         type: "Personal Info", date: "Mar 15, 2026", status: "Done", statusColor: "#4fb4ff" },
            { action: "Leave rejected",          type: "Paid Time Off", date: "Feb 22, 2026", status: "Rejected", statusColor: "#ff5f7e" },
          ].map((item, i) => (
            <motion.div
              key={i}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border-color)",
                gap: "12px",
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: item.statusColor, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{item.action}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{item.type}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{item.date}</div>
              <span style={{
                padding: "4px 12px", borderRadius: "6px",
                background: `${item.statusColor}18`, color: item.statusColor,
                fontSize: "0.75rem", fontWeight: 600,
              }}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}