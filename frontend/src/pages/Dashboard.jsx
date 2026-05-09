// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiBarChart2, FiCheckCircle, FiTarget } from 'react-icons/fi';
import ResultCard from '../components/ResultCard';
import UploadForm from '../components/UploadForm';
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
    <div style={styles.container}>
      {/* Main Content */}
      <main style={styles.main}>
        {/* Hero Banner with Scan CTA */}
        <div style={styles.heroBanner}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>Plant Health Scanner</h1>
              <p style={styles.heroSubtitle}>
                Detect diseases early and protect your crops with AI-powered analysis
              </p>
              <button style={styles.scanButton} onClick={() => setShowUpload(true)}>
                Scan Plant Now
              </button>
            </div>
            <div style={styles.heroImage}>
              <img
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop"
                alt="Person scanning plant with smartphone"
                style={styles.plantImage}
              />
            </div>
          </div>
        </div>
        {/* Stats Section */}

        <div style={styles.statsSection}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <FiBarChart2 size={32} color="#2e7d32" />
              </div>
              <div>
                <div style={styles.statNumber}>{predictions.length}</div>
                <div style={styles.statLabel}>Total Scans</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <FiCheckCircle size={32} color="#4caf50" />
              </div>
              <div>
                <div style={styles.statNumber}>
                  {predictions.filter(p => p.disease === 'Healthy').length}
                </div>
                <div style={styles.statLabel}>Healthy Plants</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <FiAlertTriangle size={32} color="#ff9800" />
              </div>
              <div>
                <div style={styles.statNumber}>
                  {predictions.filter(p => p.disease !== 'Healthy').length}
                </div>
                <div style={styles.statLabel}>Issues Detected</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <FiTarget size={32} color="#2196f3" />
              </div>
              <div>
                <div style={styles.statNumber}>94%</div>
                <div style={styles.statLabel}>Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Analysis Section */}
        <div style={styles.recentSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Plant Analysis</h2>
            <button style={styles.newAnalysisBtn} onClick={() => setShowUpload(true)}>
              + New Scan
            </button>
          </div>

          <div style={styles.grid}>
            {loading ? (
              <div style={styles.loadingState}>
                <div style={styles.loader}></div>
                <p>Loading your plant data...</p>
              </div>
            ) : predictions.length > 0 ? (
              predictions.map(pred => <ResultCard key={pred._id} prediction={pred} />)
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🌱</div>
                <h3>No scans yet</h3>
                <p>Upload your first plant image to get started</p>
                <button style={styles.startScanBtn} onClick={() => setShowUpload(true)}>
                  Start Your First Scan
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showUpload && (
        <UploadForm
          onClose={() => setShowUpload(false)}
          onSuccess={fetchPredictions}
          userId="demo-user"
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },

  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 40px',
  },

  // Hero Banner Styles
  heroBanner: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    borderRadius: '24px',
    padding: '50px 60px',
    marginBottom: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  plantImage: {
    width: '100%',
    maxWidth: '280px',
    height: 'auto',
    borderRadius: '16px',
    objectFit: 'cover',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  heroContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '40px',
  },

  heroText: {
    flex: 1,
  },

  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 16px 0',
    lineHeight: 1.2,
  },

  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 32px 0',
    lineHeight: 1.5,
  },

  scanButton: {
    backgroundColor: '#ffffff',
    color: '#2e7d32',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },

  heroImage: {
    flex: 0.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plantIcon: {
    fontSize: '120px',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
  },

  // Stats Section Styles
  statsSection: {
    marginBottom: '50px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },

  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
  },

  statIcon: {
    fontSize: '40px',
  },

  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1b5e20',
    lineHeight: 1,
    marginBottom: '8px',
  },

  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },

  // Recent Analysis Section
  recentSection: {
    marginTop: '20px',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },

  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },

  newAnalysisBtn: {
    backgroundColor: '#2e7d32',
    color: '#ffffff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '24px',
  },

  loadingState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    color: '#666',
  },

  loader: {
    width: '48px',
    height: '48px',
    border: '3px solid #e0e0e0',
    borderTop: '3px solid #2e7d32',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },

  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    gridColumn: '1 / -1',
  },

  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },

  startScanBtn: {
    backgroundColor: '#2e7d32',
    color: '#ffffff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

// Add animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;
