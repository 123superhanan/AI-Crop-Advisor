// components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>AgriVision</div>

      <div style={styles.navLinks}>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/history" style={styles.link}>
          History
        </Link>
        <Link to="/admin" style={styles.link}>
          Admin
        </Link>
      </div>

      <div style={styles.userSection}>
        <span style={styles.userName}>Welcome, {user?.name}</span>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ff88',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userName: {
    color: '#ccc',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Navbar;
