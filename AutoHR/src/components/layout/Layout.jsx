import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-layout ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;