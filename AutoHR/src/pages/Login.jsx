import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

// ─── Mock users — replace with real API later ────────────
const MOCK_USERS = [
  {
    id: 1,
    email: "admin@autohr.com",
    password: "admin123",
    name: "Alex Johnson",
    role: "Admin",
  },
  {
    id: 2,
    email: "hr@autohr.com",
    password: "hr1234",
    name: "Sara Williams",
    role: "HR Manager",
  },
  {
    id: 3,
    email: "employee@autohr.com",
    password: "emp123",
    name: "John Smith",
    role: "Employee",
  },
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    setError("Please fill in all fields.");
    return;
  }

  setLoading(true);

  await new Promise((r) => setTimeout(r, 900));

  const user = MOCK_USERS.find(
    (u) => u.email === form.email && u.password === form.password
  );

  if (!user) {
    setError("Invalid email or password.");
    setLoading(false);
    return;
  }

  localStorage.setItem("token", `mock-token-${user.id}`);
  localStorage.setItem("user", JSON.stringify(user));

  navigate("/dashboard");   // ✅ correct way
};

  return (
    <div className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.glow} />

      <div className={styles.card}>
        {/* ── Left branding panel ── */}
        <div className={styles.left}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2Z" fill="#0b0d11" />
                <path d="M9 12l2 2 4-4" stroke="#4fffb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={styles.brandName}>Auto<span>HR</span></span>
          </div>

          <div className={styles.leftBody}>
            <h1>Human Resources,<br />Fully Automated.</h1>
            <p>
              Streamline hiring, onboarding, payroll, and performance — all from
              one intelligent platform built for modern teams.
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statVal}>12k+</div>
              <div className={styles.statLbl}>Employees managed</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statVal}>98%</div>
              <div className={styles.statLbl}>Automation rate</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statVal}>4.9★</div>
              <div className={styles.statLbl}>Avg. rating</div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className={styles.right}>
          <p className={styles.formEyebrow}>Welcome back</p>
          <h2 className={styles.formTitle}>Sign in to AutoHR</h2>
          <p className={styles.formSub}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className={styles.row}>
              <label className={styles.checkLabel}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className={styles.forgotLink}>Forgot password?</a>
            </div>

            {/* Error */}
            {error && <div className={styles.error}>{error}</div>}

            {/* Submit */}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : "Sign In"}
            </button>
          </form>

          {/* Mock credentials hint */}
          <div className={styles.mockHint}>
            <p className={styles.mockTitle}>🔑 Demo credentials</p>
            <div className={styles.mockList}>
              <div className={styles.mockRow}>
                <span>admin@autohr.com</span>
                <span className={styles.mockPass}>admin123</span>
                <span className={styles.mockRole}>Admin</span>
              </div>
              <div className={styles.mockRow}>
                <span>hr@autohr.com</span>
                <span className={styles.mockPass}>hr1234</span>
                <span className={styles.mockRole}>HR Manager</span>
              </div>
              <div className={styles.mockRow}>
                <span>employee@autohr.com</span>
                <span className={styles.mockPass}>emp123</span>
                <span className={styles.mockRole}>Employee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}