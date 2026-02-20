import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ collapsed }) {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <h2 className="logo">
        {collapsed ? "AH" : "AutoHR"}
      </h2>

      <nav className="sidebar-nav">
        <Link to="/dashboard">Dashboard</Link>

        {user?.role === "Employee" && (
          <>
            <Link to="/apply-leave">Apply Leave</Link>
            <Link to="/leave-status">Leave Status</Link>
          </>
        )}

        {user?.role === "Manager" && (
          <Link to="/approval">Approvals</Link>
        )}

        {user?.role === "HR" && (
          <Link to="/reports">Reports</Link>
        )}
      </nav>

      <button className="logout-btn" onClick={logout}>
        {collapsed ? "⎋" : "Logout"}
      </button>
    </aside>
  );
}

export default Sidebar;