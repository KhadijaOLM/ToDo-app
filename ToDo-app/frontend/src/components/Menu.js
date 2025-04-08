import { Link } from 'react-router-dom';
import { FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Menu.css';

export default function Menu() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <nav className="menu">
        <div className="menu-loading">Chargement du menu...</div>
      </nav>
    );
  }

  return (
    <nav className="menu">
      <div className="menu-left">
        <Link to="/" className="menu-link">
        <FiHome className="logout-icon" />Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="menu-link">Dashboard</Link>
            <Link to="/boards" className="menu-link">Boards</Link>
          </>
        )}
      </div>

      <div className="menu-right">
        {isAuthenticated ? (
          <div className="user-section">
            <span className="menu-user">
              {user?.username || user?.email?.split('@')[0]}
            </span>
            <button onClick={logout} className="menu-logout" aria-label="Déconnexion">
              <FiLogOut className="logout-icon" />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="menu-link">Login</Link>
            <Link to="/register" className="menu-link menu-link-signup">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}