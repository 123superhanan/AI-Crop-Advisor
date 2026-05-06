// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import ResultCard from '../components/ResultCard';
import { predictionService } from '../services/api';
import UploadForm from '../components/UploadForm';

function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const data = await predictionService.getPredictions();
      setPredictions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>AGRIVISION</div>

        <nav style={styles.nav}>
          <div style={styles.navActive}>Dashboard</div>
          <div style={styles.navItem} onClick={() => setShowUpload(true)}>
            New Analysis
          </div>
          <div style={styles.navItem}>Crop Management</div>
          <div style={styles.navItem}>History</div>
          <div style={styles.navItem}>Reports</div>
          <div style={styles.navItem}>Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Operations Dashboard</h1>
          <div style={styles.userInfo}>
            <span>Welcome back, User</span>
            <div style={styles.avatar}>JD</div>
          </div>
        </header>

        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>TOTAL PREDICTIONS</div>
            <div style={styles.statNumber}>{predictions.length}</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>LAST ANALYSIS</div>
            <div style={styles.statNumber}>2h ago</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>ACCURACY</div>
            <div style={styles.statNumber}>94.2%</div>
          </div>
        </div>

        {/* Recent Analysis Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>Recent Analysis</h2>
            <button style={styles.newBtn} onClick={() => setShowUpload(true)}>
              + NEW ANALYSIS
            </button>
          </div>

          <div style={styles.grid}>
            {loading ? (
              <p>Loading data...</p>
            ) : predictions.length > 0 ? (
              predictions.map(pred => <ResultCard key={pred._id} prediction={pred} />)
            ) : (
              <p>No analysis found yet.</p>
            )}
          </div>
        </div>
      </main>

      {showUpload && (
        <UploadForm onClose={() => setShowUpload(false)} onSuccess={fetchPredictions} />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#e5e5e5',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },

  sidebar: {
    width: '260px',
    backgroundColor: '#1a1a1a',
    borderRight: '1px solid #333',
    padding: '30px 20px',
  },

  logo: {
    fontSize: '28px',
    fontWeight: '900',
    letterSpacing: '1px',
    marginBottom: '60px',
    color: '#ffffff',
  },

  nav: { display: 'flex', flexDirection: 'column', gap: '6px' },
  navItem: {
    padding: '14px 20px',
    color: '#aaa',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  navActive: {
    padding: '14px 20px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontWeight: '600',
    borderRadius: '6px',
  },

  main: {
    flex: 1,
    padding: '40px 50px',
    overflowY: 'auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  avatar: {
    width: '48px',
    height: '48px',
    backgroundColor: '#444',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  statsBar: {
    display: 'flex',
    gap: '30px',
    marginBottom: '50px',
    padding: '20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
  },

  stat: { flex: 1 },
  statLabel: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    marginTop: '8px',
  },

  section: {},
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },

  newBtn: {
    backgroundColor: '#0066ff',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '24px',
  },
};

export default Dashboard;
