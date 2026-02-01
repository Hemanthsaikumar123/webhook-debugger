import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/projects" className="brand-link">
            <span className="brand-icon">🪝</span>
            <span className="brand-text">Webhook Debugger</span>
          </Link>
        </div>
        <div className="navbar-nav">
          <Link to="/projects" className="nav-link">Projects</Link>
        </div>
      </div>
    </nav>
  );
}
