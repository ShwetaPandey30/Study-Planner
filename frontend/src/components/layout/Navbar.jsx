import { FaUserCircle, FaBars } from "react-icons/fa";

function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <button className="menu-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
        <FaBars />
      </button>
      
      <div className="navbar-title">AI Study Assistant 🚀</div>
    </header>
  );
}

export default Navbar;