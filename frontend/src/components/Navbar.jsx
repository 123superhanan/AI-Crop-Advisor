import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Used to highlight the active link

  const isActive = path => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Bold & Tight */}
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <h2>
            AgriVision<span className="glow">AI</span>
          </h2>
        </Link>

        {/* Desktop Menu - High End Minimal */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/history" className={isActive('/history') ? 'active' : ''}>
              History
            </Link>
          </li>
          <li>
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              Admin
            </Link>
          </li>
        </ul>

        {/* Action Area */}
        <div className="nav-right">
          <button className="login-btn">Sign In</button>
          <div className="user-avatar">
            <span style={{ fontSize: '14px' }}>H</span>
          </div>

          {/* Mobile Toggle - Clean Icon */}
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide Down Overlay */}
      {isOpen && (
        <div className="mobile-overlay">
          <ul className="mobile-menu">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={() => setIsOpen(false)}>
                History
              </Link>
            </li>
            <li>
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            </li>
            <li>
              <button className="mobile-login-btn">Sign In</button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
