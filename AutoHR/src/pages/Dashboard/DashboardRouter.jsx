// src/pages/Dashboard/DashboardRouter.jsx
// Reads role from AuthContext/localStorage and renders the correct dashboard

import HRDashboard       from "./HRDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

export default function Dashboard() {
  const raw  = localStorage.getItem("autohr_user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role || "";

  if (role === "HR Manager" || role === "Admin" || role === "HR") return <HRDashboard />;
  if (role === "Employee"   || role === "Faculty") return <EmployeeDashboard />;

  // Manager sees the HR dashboard too (has team managing capabilities)
  if (role === "Manager") return <HRDashboard />;

  // Fallback to employee dashboard
  return <EmployeeDashboard />;
}