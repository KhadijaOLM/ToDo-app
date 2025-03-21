import { Link } from 'react-router-dom';
import './Menu.css';

export default function Menu() {
  return (
    <nav className="menu">
      <Link to="/" className="menu-link">Home</Link>
      <Link to="/dashboard" className="menu-link">Dashboard</Link>
      <Link to="/boards/123" className="menu-link">Board</Link>
      <Link to="/login" className="menu-link">Login</Link>
      <Link to="/register" className="menu-link">Sign Up</Link>
    </nav>
  );
}