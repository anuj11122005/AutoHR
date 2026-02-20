import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

/* ================= MOCK DATA ================= */

const employeeData = [
  { month: "Jan", leaves: 2 },
  { month: "Feb", leaves: 1 },
  { month: "Mar", leaves: 3 },
  { month: "Apr", leaves: 0 },
  { month: "May", leaves: 4 },
  { month: "Jun", leaves: 2 }
];

const hrData = [
  { month: "Jan", requests: 12 },
  { month: "Feb", requests: 18 },
  { month: "Mar", requests: 9 },
  { month: "Apr", requests: 14 },
  { month: "May", requests: 20 },
  { month: "Jun", requests: 16 }
];

/* ================= MAIN DASHBOARD ================= */

function Dashboard() {
  const { user } = useAuth();

  const role = user?.role || "Employee";

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ================= TITLE ================= */}

      <h1 className="dashboard-title">
        {role} Dashboard 🚀
      </h1>

      {/* ================= STATS GRID ================= */}

      <div className="stats-grid">

        {role === "Employee" && (
          <>
            <StatCard title="Available Leaves" value={12} />
            <StatCard title="Used Leaves" value={6} />
            <StatCard title="Pending Requests" value={1} />
            <StatCard title="Approved Leaves" value={5} />
          </>
        )}

        {role === "HR" && (
          <>
            <StatCard title="Total Employees" value={85} />
            <StatCard title="Pending Approvals" value={14} />
            <StatCard title="Leaves This Month" value={32} />
            <StatCard title="Departments" value={6} />
          </>
        )}

        {role === "Manager" && (
          <>
            <StatCard title="Team Members" value={12} />
            <StatCard title="Pending Approvals" value={4} />
            <StatCard title="Approved This Month" value={9} />
            <StatCard title="Rejected Requests" value={2} />
          </>
        )}

      </div>

      {/* ================= CHART SECTION ================= */}

      <div className="chart-card">
        <h3 className="chart-title">
          {role === "Employee"
            ? "Your Leave Usage (2026)"
            : "Organization Leave Analytics"}
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={role === "Employee" ? employeeData : hrData}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />
            <XAxis
              dataKey="month"
              stroke="#E2E8F0"
            />
            <YAxis stroke="#E2E8F0" />
            <Tooltip />

            <Bar
              dataKey={
                role === "Employee"
                  ? "leaves"
                  : "requests"
              }
              fill="#0EA5E9"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ================= REUSABLE STAT CARD ================= */

function StatCard({ title, value }) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <h3>{title}</h3>

      <p>
        <CountUp
          end={value}
          duration={2}
        />
      </p>
    </motion.div>
  );
}

export default Dashboard;