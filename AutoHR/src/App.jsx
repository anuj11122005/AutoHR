import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveStatus from "./pages/LeaveStatus";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Approval from "./pages/Approval";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTE ================= */}
      <Route path="/" element={<Login />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-leave"
        element={
          <ProtectedRoute>
            <Layout>
              <ApplyLeave />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-status"
        element={
          <ProtectedRoute>
            <Layout>
              <LeaveStatus />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/approval"
        element={
          <ProtectedRoute>
            <Layout>
              <Approval />
            </Layout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;