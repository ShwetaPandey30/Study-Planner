import { useState } from "react";
import "./layout.css";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="main">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;