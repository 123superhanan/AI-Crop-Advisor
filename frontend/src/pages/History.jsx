// src/pages/History.jsx
import { useEffect, useState } from 'react';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { predictionService } from '../services/api';

function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
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

  // Filter predictions
  const filteredPredictions = predictions.filter(pred => {
    if (filter === 'healthy') return pred.disease === 'Healthy';
    if (filter === 'diseased') return pred.disease !== 'Healthy';
    if (searchTerm) {
      return (
        pred.disease?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.crop?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const getStatusColor = disease => {
    return disease === 'Healthy' ? '#4caf50' : '#ff9800';
  };

  const getSeverityBadge = severity => {
    const colors = {
      Critical: '#ff0000',
      High: '#ff4444',
      Medium: '#ffaa00',
      Low: '#4caf50',
      None: '#888888',
    };
    return {
      backgroundColor: colors[severity] || '#888888',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#fff',
    };
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Prediction History</h1>
        <p style={styles.subtitle}>View all your past crop analyses</p>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{predictions.length}</div>
          <div style={styles.statLabel}>Total Scans</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {predictions.filter(p => p.disease === 'Healthy').length}
          </div>
          <div style={styles.statLabel}>Healthy Plants</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {predictions.filter(p => p.disease !== 'Healthy').length}
          </div>
          <div style={styles.statLabel}>Issues Found</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {predictions.length > 0
              ? Math.round(
                  (predictions.reduce((acc, p) => acc + (p.confidence || 0), 0) /
                    predictions.length) *
                    100
                )
              : 0}
            %
          </div>
          <div style={styles.statLabel}>Avg Confidence</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersSection}>
        <div style={styles.searchBox}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by disease or crop..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilter('all')}
            style={{ ...styles.filterBtn, ...(filter === 'all' && styles.filterBtnActive) }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('healthy')}
            style={{ ...styles.filterBtn, ...(filter === 'healthy' && styles.filterBtnActive) }}
          >
            Healthy Only
          </button>
          <button
            onClick={() => setFilter('diseased')}
            style={{ ...styles.filterBtn, ...(filter === 'diseased' && styles.filterBtnActive) }}
          >
            Diseased Only
          </button>
        </div>
      </div>

      {/* History List */}
      <div style={styles.historyList}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading history...</p>
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3>No history found</h3>
            <p>Start by analyzing your first crop image</p>
          </div>
        ) : (
          filteredPredictions.map((pred, index) => (
            <div
              key={pred._id || index}
              style={styles.historyCard}
              onClick={() =>
                setSelectedPrediction(selectedPrediction === pred._id ? null : pred._id)
              }
            >
              <div style={styles.cardHeader}>
                <div style={styles.cropInfo}>
                  <div
                    style={{ ...styles.cropBadge, backgroundColor: getStatusColor(pred.disease) }}
                  >
                    {pred.disease === 'Healthy' ? '✓' : '⚠'}
                  </div>
                  <div>
                    <div style={styles.cropName}>{pred.crop || 'General Crop'}</div>
                    <div style={styles.diseaseName}>{pred.disease || 'Unknown'}</div>
                  </div>
                </div>

                <div style={styles.metaInfo}>
                  {pred.severity && (
                    <span style={getSeverityBadge(pred.severity)}>{pred.severity}</span>
                  )}
                  <div style={styles.date}>
                    <FiCalendar size={12} />
                    <span>{new Date(pred.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedPrediction === pred._id && (
                <div style={styles.expandedDetails}>
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Confidence:</div>
                    <div style={styles.detailValue}>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${(pred.confidence || 0) * 100}%`,
                          }}
                        />
                      </div>
                      <span>{((pred.confidence || 0) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {pred.recommendations && (
                    <>
                      <div style={styles.detailRow}>
                        <div style={styles.detailLabel}>Treatment Plan:</div>
                        <div style={styles.detailValue}>
                          <ul style={styles.treatmentList}>
                            {pred.recommendations.treatment_plan?.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={styles.detailRow}>
                        <div style={styles.detailLabel}>Prevention Tips:</div>
                        <div style={styles.detailValue}>
                          <ul style={styles.tipsList}>
                            {pred.recommendations.prevention_tips?.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#fff',
    color: '#e5e5e5',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#000',
  },
  subtitle: {
    fontSize: '16px',
    color: '#888',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #333',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#888',
  },
  filtersSection: {
    marginBottom: '30px',
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#666',
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 38px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
  },
  filterBtn: {
    padding: '8px 20px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    backgroundColor: '#00ff88',
    color: '#000',
    borderColor: '#00ff88',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  historyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #333',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  cropInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cropBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#fff',
  },
  cropName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  diseaseName: {
    fontSize: '14px',
    color: '#aaa',
    marginTop: '2px',
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#666',
  },
  expandedDetails: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #333',
  },
  detailRow: {
    marginBottom: '15px',
  },
  detailLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#aaa',
    marginBottom: '8px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#ddd',
  },
  progressBar: {
    width: '200px',
    height: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    transition: 'width 0.3s',
  },
  treatmentList: {
    margin: '0',
    paddingLeft: '20px',
    color: '#ccc',
  },
  tipsList: {
    margin: '0',
    paddingLeft: '20px',
    color: '#ccc',
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #333',
    borderTop: '3px solid #00ff88',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
};

// Add animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default History;
