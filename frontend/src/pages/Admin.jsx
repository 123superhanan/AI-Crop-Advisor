// src/pages/Admin.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';

function Admin() {
  const [analytics, setAnalytics] = useState({
    total: 0,
    healthy: 0,
    diseased: 0,
    avgConfidence: 0,
  });
  const [diseaseStats, setDiseaseStats] = useState([]);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchAllAnalytics();
  }, [dateRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch from NestJS backend
      const [summaryRes, diseaseRes, predictionsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/analytics/summary'),
        axios.get('http://localhost:3001/api/analytics/disease-stats'),
        axios.get('http://localhost:3001/api/analytics/predictions'),
      ]);

      setAnalytics(summaryRes.data);
      setDiseaseStats(diseaseRes.data);
      setRecentPredictions(predictionsRes.data.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/analytics/predictions');
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `analytics_${new Date().toISOString()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const confidencePercentage = (analytics.avgConfidence * 100).toFixed(1);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Analytics Dashboard</h1>
          <p style={styles.subtitle}>Monitor system performance and disease statistics</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={fetchAllAnalytics} style={styles.refreshBtn}>
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button onClick={exportData} style={styles.exportBtn}>
            <FiDownload size={16} />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiBarChart2 size={24} color="#4caf50" />
          </div>
          <div>
            <div style={styles.statValue}>{analytics.total}</div>
            <div style={styles.statLabel}>Total Predictions</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiCheckCircle size={24} color="#4caf50" />
          </div>
          <div>
            <div style={styles.statValue}>{analytics.healthy}</div>
            <div style={styles.statLabel}>Healthy Plants</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiAlertCircle size={24} color="#ff9800" />
          </div>
          <div>
            <div style={styles.statValue}>{analytics.diseased}</div>
            <div style={styles.statLabel}>Diseased Plants</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiTrendingUp size={24} color="#2196f3" />
          </div>
          <div>
            <div style={styles.statValue}>{confidencePercentage}%</div>
            <div style={styles.statLabel}>Avg Confidence</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Disease Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Disease Distribution</h3>
          <div style={styles.diseaseList}>
            {diseaseStats.map((stat, idx) => {
              const percentage = ((parseInt(stat.count) / analytics.total) * 100).toFixed(1);
              return (
                <div key={idx} style={styles.diseaseItem}>
                  <div style={styles.diseaseInfo}>
                    <span style={styles.diseaseName}>{stat.disease}</span>
                    <span style={styles.diseaseCount}>{stat.count}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
                  </div>
                  <span style={styles.percentage}>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>System Health</h3>
          <div style={styles.healthMetrics}>
            <div style={styles.metric}>
              <span>Health Rate</span>
              <span style={styles.metricValue}>
                {analytics.total > 0 ? ((analytics.healthy / analytics.total) * 100).toFixed(1) : 0}
                %
              </span>
            </div>
            <div style={styles.metric}>
              <span>Disease Rate</span>
              <span style={styles.metricValue}>
                {analytics.total > 0
                  ? ((analytics.diseased / analytics.total) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div style={styles.metric}>
              <span>Accuracy</span>
              <span style={styles.metricValue}>{confidencePercentage}%</span>
            </div>
          </div>
          <div style={styles.pieChart}>
            <div style={styles.pieSegment}>
              <div
                style={{
                  ...styles.pieHealth,
                  width: `${analytics.total > 0 ? (analytics.healthy / analytics.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.recentSection}>
        <h3 style={styles.sectionTitle}>Recent Predictions</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Disease</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPredictions.map((pred, idx) => (
                <tr key={idx}>
                  <td style={styles.cropCell}>{pred.crop}</td>
                  <td style={styles.diseaseCell}>{pred.disease}</td>
                  <td>{(pred.confidence * 100).toFixed(1)}%</td>
                  <td>
                    <span
                      style={{
                        ...styles.severityBadge,
                        backgroundColor:
                          pred.severity === 'High'
                            ? '#ff4444'
                            : pred.severity === 'Medium'
                              ? '#ffaa00'
                              : '#4caf50',
                      }}
                    >
                      {pred.severity || 'Unknown'}
                    </span>
                  </td>
                  <td>{new Date(pred.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Status */}
      <div style={styles.statusSection}>
        <div style={styles.statusCard}>
          <FiActivity size={20} color="#4caf50" />
          <div>
            <div style={styles.statusLabel}>MongoDB (Node.js)</div>
            <div style={styles.statusValue}>Connected</div>
          </div>
        </div>
        <div style={styles.statusCard}>
          <FiActivity size={20} color="#4caf50" />
          <div>
            <div style={styles.statusLabel}>PostgreSQL (NestJS)</div>
            <div style={styles.statusValue}>Connected</div>
          </div>
        </div>
        <div style={styles.statusCard}>
          <FiActivity size={20} color="#4caf50" />
          <div>
            <div style={styles.statusLabel}>Analytics Service</div>
            <div style={styles.statusValue}>Running</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    backgroundColor: '#0f0f0f',
    minHeight: '100vh',
    color: '#e5e5e5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#fff',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  refreshBtn: {
    padding: '8px 16px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  exportBtn: {
    padding: '8px 16px',
    backgroundColor: '#00ff88',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #333',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#00ff88',
  },
  statLabel: {
    fontSize: '13px',
    color: '#888',
    marginTop: '4px',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #333',
  },
  chartTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#fff',
  },
  diseaseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  diseaseItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  diseaseInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: '150px',
  },
  diseaseName: {
    fontSize: '14px',
    color: '#ddd',
  },
  diseaseCount: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#00ff88',
  },
  progressBar: {
    flex: 2,
    height: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    transition: 'width 0.3s',
  },
  percentage: {
    fontSize: '12px',
    color: '#888',
    minWidth: '45px',
    textAlign: 'right',
  },
  healthMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #333',
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#00ff88',
  },
  pieChart: {
    height: '100px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  pieSegment: {
    display: 'flex',
    height: '100%',
  },
  pieHealth: {
    backgroundColor: '#4caf50',
    transition: 'width 0.3s',
  },
  recentSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    border: '1px solid #333',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#fff',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  cropCell: {
    textTransform: 'capitalize',
  },
  diseaseCell: {
    textTransform: 'capitalize',
  },
  severityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff',
    display: 'inline-block',
  },
  statusSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid #333',
  },
  statusLabel: {
    fontSize: '12px',
    color: '#888',
  },
  statusValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#00ff88',
  },
};

export default Admin;
