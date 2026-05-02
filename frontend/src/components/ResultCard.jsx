const ResultCard = ({ prediction }) => {
  if (!prediction) return null;

  // Visual helper for confidence colors
  const getStatusColor = score => {
    if (score > 80) return '#00FF66'; // Healthy/Certain
    if (score > 50) return '#FFBB00'; // Warning
    return '#FF4D4F'; // Critical
  };

  const statusColor = getStatusColor(prediction.confidence || 0);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        {/* Your requested 38px Circle Style */}
        <div style={{ ...styles.avatarCircle, borderColor: statusColor }}>
          <span style={{ fontSize: '14px' }}>🌱</span>
        </div>
        <div style={styles.headerText}>
          <h3 style={styles.title}>{prediction.result || 'Scanning...'}/ نتیجا</h3>
          <p style={styles.date}>{new Date(prediction.createdAt).toLocaleDateString()}</p>
        </div>
        <div style={styles.badge}>
          <span style={{ color: statusColor, fontWeight: '800' }}>{prediction.confidence}%</span>
        </div>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.dataRow}>
          <span style={styles.label}>Trace ID:</span>
          <span style={styles.value}>{prediction._id.slice(-6).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(145deg, #1a1a1a, #111)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #222',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '38px',
    height: '38px',
    background: '#333',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #aaa', // Default border as requested
  },
  headerText: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '16px',
    color: '#fff',
    fontWeight: '700',
  },
  date: {
    margin: 0,
    fontSize: '11px',
    color: '#666',
  },
  badge: {
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  cardBody: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #222',
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  label: { color: '#555' },
  value: { color: '#888', fontFamily: 'monospace' },
};
export default ResultCard;
