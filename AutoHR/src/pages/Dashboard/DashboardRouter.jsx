// src/pages/Dashboard/index.jsx
// Drop this as the /dashboard route — it reads the saved role
// and renders the correct dashboard automatically.

import HRDashboard      from "./HRDashboard";
import FacultyDashboard from "./FacultyDashboard";

export default function Dashboard() {
  const raw  = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role || "";

  if (role === "HR Manager") return <HRDashboard />;
  if (role === "Employee")    return <FacultyDashboard />;

  // Fallback — not logged in or unknown role
//   window.location.href = "/login";
  return <HRDashboard />;
}