import { useAuth } from "../../context/AuthContext";

function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <div className="topbar">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <h3>Dashboard</h3>

      <div className="user-pill">
        {user?.role}
      </div>
    </div>
  );
}

export default Navbar;