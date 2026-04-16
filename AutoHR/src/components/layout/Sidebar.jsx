import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ collapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || "";

  // Determine if user has elevated role (HR Manager, Admin, Manager)
  const isHR = role === "HR Manager" || role === "HR";
  const isAdmin = role === "Admin";
  const isManager = role === "Manager";
  const isEmployee = role === "Employee";
  const isElevated = isHR || isAdmin || isManager;

  const navItems = [
    { to: "/dashboard",    label: "📊 Dashboard",    show: true },
    { to: "/apply-leave",  label: "✏️ Apply Leave",   show: isEmployee },
    { to: "/leave-status", label: "📋 Leave Status",  show: isEmployee },
    { to: "/approval",     label: "✅ Approvals",     show: isElevated },
    { to: "/reports",      label: "📈 Reports",       show: isHR || isAdmin },
    { to: "/profile",      label: "👤 Profile",       show: true },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <h2 className="logo">
        {collapsed ? "AH" : "AutoHR"}
      </h2>

      <nav className="sidebar-nav">
        {navItems.filter(n => n.show).map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? "active" : ""}
          >
            {collapsed ? item.label.split(" ")[0] : item.label}
          </Link>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        {collapsed ? "⎋" : "Logout"}
      </button>
    </aside>
  );
}

export default Sidebar;