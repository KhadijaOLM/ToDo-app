import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">TodoApp</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/login">Se connecter</Link></li>
        <li><Link to="/register">S'inscrire</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;