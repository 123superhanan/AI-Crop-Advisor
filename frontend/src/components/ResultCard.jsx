// src/components/ResultCard.jsx
import { FaCalendarAlt, FaIdCard, FaLeaf, FaSeedling } from 'react-icons/fa';
import { MdDangerous, MdHealthAndSafety, MdWarning } from 'react-icons/md';

const ResultCard = ({ prediction }) => {
  if (!prediction) return null;

  // Visual helper for confidence colors
  const getStatusColor = score => {
    if (score > 80) return '#00FF66';
    if (score > 50) return '#FFBB00';
    return '#FF4D4F';
  };

  const getStatusIcon = score => {
    if (score > 80) return <MdHealthAndSafety size={16} color="#00FF66" />;
    if (score > 50) return <MdWarning size={16} color="#FFBB00" />;
    return <MdDangerous size={16} color="#FF4D4F" />;
  };

  const statusColor = getStatusColor(prediction.confidence || 0);
  const confidence = prediction.confidence ? (prediction.confidence * 100).toFixed(1) : '0';

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ ...styles.avatarCircle, borderColor: statusColor }}>
          <FaLeaf size={20} color={statusColor} />
        </div>
        <div style={styles.headerText}>
          <h3 style={styles.title}>{prediction.disease || 'Unknown Disease'}</h3>
          <p style={styles.subtitle}>{prediction.crop || 'General Crop'}</p>
        </div>
        <div style={styles.badge}>
          {getStatusIcon(prediction.confidence || 0)}
          <span style={{ color: statusColor, fontWeight: '800', marginLeft: '4px' }}>
            {confidence}%
          </span>
        </div>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.detailRow}>
          <div style={styles.detailItem}>
            <FaCalendarAlt size={12} color="#666" />
            <span style={styles.label}>Date:</span>
            <span style={styles.value}>{new Date(prediction.createdAt).toLocaleDateString()}</span>
          </div>
          <div style={styles.detailItem}>
            <FaIdCard size={12} color="#666" />
            <span style={styles.label}>ID:</span>
            <span style={styles.value}>{prediction._id?.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        {prediction.severity && (
          <div style={styles.severityRow}>
            <span style={styles.severityLabel}>Severity:</span>
            <span
              style={{
                ...styles.severityValue,
                color:
                  prediction.severity === 'High'
                    ? '#FF4D4F'
                    : prediction.severity === 'Medium'
                      ? '#FFBB00'
                      : '#00FF66',
              }}
            >
              {prediction.severity}
            </span>
          </div>
        )}

        {prediction.recommendations && (
          <div style={styles.treatmentRow}>
            <FaSeedling size={12} color="#00FF66" />
            <span style={styles.treatmentText}>
              {prediction.recommendations.treatment_plan?.[0] || 'Monitor plant health'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: ' #2e7d32',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #222',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  avatarCircle: {
    width: '48px',
    height: '48px',
    background: '#1a1a1a',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #aaa',
    transition: 'all 0.2s',
  },
  headerText: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '18px',
    color: '#fff',
    fontWeight: '700',
    lineHeight: 1.3,
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#cdcdcd',
    textTransform: 'capitalize',
  },
  badge: {
    background: 'rgba(255,255,255,0.05)',
    padding: '6px 12px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cardBody: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #222',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '12px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    flex: 1,
  },
  label: {
    color: '#cdcdcd',
    fontSize: '11px',
    fontWeight: '500',
  },
  value: {
    color: '#cdcdcd',
    fontFamily: 'monospace',
    fontSize: '11px',
  },
  severityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
  },
  severityLabel: {
    fontSize: '12px',
    color: '#cdcdcd',
    fontWeight: '500',
  },
  severityValue: {
    fontSize: '12px',
    fontWeight: '700',
  },
  treatmentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    background: 'rgba(0, 255, 102, 0.64)',
    borderRadius: '8px',
    borderLeft: '2px solid #00FF66',
  },
  treatmentText: {
    fontSize: '11px',
    color: '#ccc',
    lineHeight: 1.4,
    flex: 1,
  },
};

// Add hover effect with CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .result-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    border-color: #00FF66;
  }
`;
document.head.appendChild(styleSheet);

export default ResultCard;
