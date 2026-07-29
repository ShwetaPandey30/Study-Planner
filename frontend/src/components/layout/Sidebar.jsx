import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaComments,
  FaFilePdf,
  FaCog,
  FaTimes,
} from "react-icons/fa";

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">StudyAI</h2>
        <button className="close-sidebar-btn" onClick={onClose} aria-label="Close Sidebar">
          <FaTimes />
        </button>
      </div>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          onClick={onClose}
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          onClick={onClose}
        >
          <FaComments />
          <span>AI Chat</span>
        </NavLink>

        <NavLink
          to="/pdf"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          onClick={onClose}
        >
          <FaFilePdf />
          <span>PDF Assistant</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          onClick={onClose}
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;