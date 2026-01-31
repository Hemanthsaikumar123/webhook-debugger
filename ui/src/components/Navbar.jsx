import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <Link to="/projects">Projects</Link>
    </nav>
  );
}
