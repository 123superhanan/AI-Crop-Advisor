// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import ResultCard from '../components/ResultCard';
import UploadForm from '../components/UploadForm'; // We'll create this next
import { predictionService } from '../services/api';

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
    <div style={styles.dashboardContainer}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          AgriVision <span style={styles.aiTag}>AI</span>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navItemActive}>Overview</div>
          <div style={styles.navItem} onClick={() => setShowUpload(true)}>
            New Analysis
          </div>
          <div style={styles.navItem}>My Crops</div>
          <div style={styles.navItem}>History</div>
          <div style={styles.navItem}>Settings</div>
        </nav>

        <div style={styles.sidebarFooter}>
          <p>© 2026 AgriVision AI</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.mainContent}>
        <header style={styles.topNav}>
          <div>
            <h1 style={styles.welcome}>Dashboard / ڈیش بورڈ</h1>
            <p style={styles.subtext}>Welcome back! Here's what's happening in your fields.</p>
          </div>

          <div style={styles.userSection}>
            <div style={styles.userCircle}>U</div>
          </div>
        </header>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Analysis</span>
            <span style={styles.statValue}>{predictions.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>System Status</span>
            <span style={{ ...styles.statValue, color: '#00ff88' }}>Healthy</span>
          </div>
        </div>

        {/* Recent Analysis */}
        <div style={styles.feedContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Analysis</h2>
            <button style={styles.uploadBtn} onClick={() => setShowUpload(true)}>
              + New Upload
            </button>
          </div>

          <div style={styles.gridWrapper}>
            {loading ? (
              <p>Loading...</p>
            ) : predictions.length > 0 ? (
              predictions.map(pred => <ResultCard key={pred._id} prediction={pred} />)
            ) : (
              <p>No predictions yet. Upload your first image!</p>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <UploadForm onClose={() => setShowUpload(false)} onSuccess={fetchPredictions} />
      )}
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: 'Inter, system-ui, sans-serif',
    overflow: 'hidden',
  },

  sidebar: {
    width: '280px',
    backgroundColor: '#111111',
    borderRight: '1px solid #222',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
  },

  logo: {
    fontSize: '26px',
    fontWeight: '800',
    marginBottom: '50px',
    letterSpacing: '-1px',
  },

  aiTag: {
    color: '#00ff88',
    fontSize: '20px',
  },

  nav: {
    flex: 1,
  },

  navItem: {
    padding: '14px 18px',
    marginBottom: '8px',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#aaa',
    transition: '0.3s',
  },

  navItemActive: {
    padding: '14px 18px',
    marginBottom: '8px',
    borderRadius: '10px',
    backgroundColor: '#1a1a1a',
    color: '#00ff88',
    fontWeight: '600',
  },

  sidebarFooter: {
    color: '#555',
    fontSize: '13px',
    marginTop: 'auto',
  },

  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 50px',
  },

  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },

  welcome: {
    fontSize: '32px',
    margin: 0,
    fontWeight: '700',
  },

  subtext: {
    color: '#777',
    marginTop: '6px',
    fontSize: '15px',
  },

  userCircle: {
    width: '45px',
    height: '45px',
    backgroundColor: '#00ff88',
    color: '#000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },

  statsGrid: {
    display: 'flex',
    gap: '25px',
    marginBottom: '40px',
  },

  statCard: {
    flex: 1,
    backgroundColor: '#111',
    padding: '28px',
    borderRadius: '16px',
    border: '1px solid #222',
  },

  statLabel: {
    display: 'block',
    color: '#666',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },

  statValue: {
    fontSize: '36px',
    fontWeight: '800',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  sectionTitle: {
    fontSize: '20px',
    color: '#ddd',
  },

  uploadBtn: {
    backgroundColor: '#00ff88',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  feedContainer: {},
  gridWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
};

export default Dashboard;
