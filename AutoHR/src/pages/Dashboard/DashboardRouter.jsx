// src/pages/Dashboard/index.jsx
// Reads role from localStorage and renders the correct dashboard

import HRDashboard       from "./HRDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

export default function Dashboard() {
  const raw  = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role || "";

  if (role === "HR Manager" || role === "Admin") return <HRDashboard />;
  if (role === "Employee"   || role === "Faculty") return <EmployeeDashboard />;

  // Not logged in — redirect to login
  // window.location.href = "/login";
  return null;
}