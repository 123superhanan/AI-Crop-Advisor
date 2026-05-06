// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>AGRIVISION</div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <Link to="/" style={styles.linkActive}>
            Dashboard
          </Link>
          <Link to="/history" style={styles.link}>
            History
          </Link>
          <Link to="/admin" style={styles.link}>
            Reports
          </Link>
        </div>

        <div style={styles.userSection}>
          <span style={styles.userName}>John Doe</span>
          <div style={styles.avatar}>JD</div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
    padding: '1rem 5%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },

  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    fontSize: '26px',
    fontWeight: '900',
    letterSpacing: '2px',
    color: '#ffffff',
  },

  navLinks: {
    display: 'flex',
    gap: '2.5rem',
  },

  link: {
    color: '#aaaaaa',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1.02rem',
  },

  linkActive: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.02rem',
    borderBottom: '2px solid #0066ff',
    paddingBottom: '4px',
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  newAnalysisBtn: {
    backgroundColor: '#0066ff',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },

  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  userName: {
    color: '#ccc',
    fontSize: '0.95rem',
  },

  avatar: {
    width: '42px',
    height: '42px',
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
};

export default Navbar;
