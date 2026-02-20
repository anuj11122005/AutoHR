import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ApplyLeave from "../pages/ApplyLeave";
import LeaveStatus from "../pages/LeaveStatus";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import Approval from "../pages/Approval";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/apply-leave" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
      <Route path="/leave-status" element={<ProtectedRoute><LeaveStatus /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/approval" element={<ProtectedRoute><Approval /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;