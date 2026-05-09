// src/components/UploadForm.jsx
import { useEffect, useRef, useState } from 'react';
import { predictionService } from '../services/api';

const UploadForm = ({ onClose, onSuccess, userId = 'anonymous' }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [cropType, setCropType] = useState('general');
  const [organicFarming, setOrganicFarming] = useState(false);
  const [weather, setWeather] = useState('normal');
  const [temperature, setTemperature] = useState(25);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);
  let closeTimer = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setError('');
        setAnalysisResult(null);
        setShowSuccess(false);
      } else {
        setError('Please upload an image file');
      }
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setAnalysisResult(null);
      setShowSuccess(false);
    }
  };

  const handleClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    onClose();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('cropType', cropType);
    formData.append('organicFarming', organicFarming);
    formData.append('weather', weather);
    formData.append('temperature', temperature);
    formData.append('userId', userId);

    try {
      const result = await predictionService.analyzeImage(formData);
      setAnalysisResult(result);
      setShowSuccess(true);

      if (result.success) {
        await predictionService.savePrediction({
          userId: userId,
          crop: result.prediction.crop,
          disease: result.prediction.disease,
          confidence: result.prediction.confidence,
          severity: result.severity,
          recommendations: result.recommendations,
        });

        // Refresh dashboard data
        if (onSuccess && typeof onSuccess === 'function') {
          await onSuccess();
        }

        // Set timer to auto-close after showing results (5 seconds)
        closeTimer.current = setTimeout(() => {
          onClose();
        }, 5000); // Show results for 5 seconds
      }
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setAnalysisResult(null);
    setShowSuccess(false);
    setError('');
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleManualClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>New Crop Analysis</h2>
          <button style={styles.closeBtn} onClick={handleManualClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Big Photo Upload Card */}
          <div
            style={{
              ...styles.uploadCard,
              ...(dragActive && styles.uploadCardDrag),
              ...(preview && styles.uploadCardWithPreview),
              ...(analysisResult && styles.uploadCardSuccess),
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !preview && !analysisResult && fileInputRef.current?.click()}
          >
            {!preview ? (
              <div style={styles.uploadContent}>
                <div style={styles.uploadIcon}>📷</div>
                <div style={styles.uploadTitle}>Drop your crop image here</div>
                <div style={styles.uploadSubtitle}>or click to browse</div>
                <div style={styles.uploadFormats}>Supports: JPG, PNG, JPEG (Max 10MB)</div>
                <button
                  type="button"
                  style={styles.browseBtn}
                  onClick={e => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.hiddenInput}
                />
              </div>
            ) : (
              <div style={styles.previewContainer}>
                <img src={preview} alt="Preview" style={styles.previewImage} />
                {!analysisResult && (
                  <div style={styles.previewOverlay}>
                    <button
                      type="button"
                      style={styles.changeBtn}
                      onClick={e => {
                        e.stopPropagation();
                        resetForm();
                      }}
                    >
                      Change Image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Analysis Result Display - Stays visible */}
          {analysisResult && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div style={styles.resultIcon}>✓</div>
                <div style={styles.resultTitle}>Analysis Complete!</div>
                <div style={styles.autoCloseTimer}>Closing in 5s...</div>
              </div>
              <div style={styles.resultContent}>
                <div style={styles.resultDisease}>
                  <strong>Detected:</strong> {analysisResult.prediction.disease}
                </div>
                <div style={styles.resultConfidence}>
                  <strong>Confidence:</strong>{' '}
                  {(analysisResult.prediction.confidence * 100).toFixed(1)}%
                </div>
                <div style={styles.resultSeverity}>
                  <strong>Severity:</strong>
                  <span
                    style={{
                      ...styles.severityBadge,
                      backgroundColor:
                        analysisResult.severity === 'High'
                          ? '#ff4444'
                          : analysisResult.severity === 'Critical'
                            ? '#ff0000'
                            : '#ffaa00',
                    }}
                  >
                    {analysisResult.severity}
                  </span>
                </div>
                <div style={styles.resultTreatment}>
                  <strong>Treatment:</strong> {analysisResult.recommendations.treatment_plan?.[0]}
                </div>
              </div>
              <div style={styles.resultFooter}>
                <button style={styles.closeResultBtn} onClick={handleManualClose}>
                  Close & Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Farm Conditions Section - Hide after analysis */}
          {!analysisResult && (
            <div style={styles.conditionsSection}>
              <h3 style={styles.sectionTitle}>Farm Conditions</h3>
              <div style={styles.conditionsGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Crop Type</label>
                  <select
                    value={cropType}
                    onChange={e => setCropType(e.target.value)}
                    style={styles.select}
                    disabled={loading}
                  >
                    <option value="general">General Crop</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="corn">Corn</option>
                    <option value="tomato">Tomato</option>
                    <option value="potato">Potato</option>
                    <option value="cotton">Cotton</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Weather</label>
                  <select
                    value={weather}
                    onChange={e => setWeather(e.target.value)}
                    style={styles.select}
                    disabled={loading}
                  >
                    <option value="normal">Normal</option>
                    <option value="rainy">Rainy</option>
                    <option value="dry">Dry</option>
                    <option value="humid">Humid</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Temperature (°C)</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={e => setTemperature(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                  />
                </div>

                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={organicFarming}
                      onChange={e => setOrganicFarming(e.target.checked)}
                      disabled={loading}
                      style={styles.checkbox}
                    />
                    Organic Farming Practice
                  </label>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorCard}>
              <span style={styles.errorIcon}>!</span>
              <span style={styles.errorText}>{error}</span>
              <button style={styles.retryBtn} onClick={() => setError('')}>
                Dismiss
              </button>
            </div>
          )}

          {!analysisResult && (
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(loading && styles.submitBtnDisabled),
              }}
              disabled={loading || !image}
            >
              {loading ? (
                <span style={styles.loadingSpinner}>
                  <span style={styles.spinner}></span>
                  Analyzing...
                </span>
              ) : (
                'Start Analysis'
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(8px)',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    borderRadius: '20px',
    border: '1px solid #333',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
  header: {
    padding: '24px 30px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: '#1a1a1a',
    zIndex: 10,
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#fff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '28px',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  form: {
    padding: '30px',
  },
  uploadCard: {
    border: '3px dashed #444',
    borderRadius: '16px',
    marginBottom: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
  },
  uploadCardDrag: {
    borderColor: '#00ff88',
    backgroundColor: '#1a2a1a',
  },
  uploadCardWithPreview: {
    padding: '0',
    border: 'none',
    backgroundColor: 'transparent',
  },
  uploadCardSuccess: {
    borderColor: '#00ff88',
    backgroundColor: '#0a1a0a',
  },
  uploadContent: {
    textAlign: 'center',
    padding: '60px 40px',
  },
  uploadIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  uploadTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '10px',
  },
  uploadSubtitle: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '15px',
  },
  uploadFormats: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '25px',
  },
  browseBtn: {
    backgroundColor: '#0066ff',
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  hiddenInput: {
    display: 'none',
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    display: 'block',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  changeBtn: {
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resultCard: {
    backgroundColor: '#00ff8811',
    border: '2px solid #00ff88',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    animation: 'slideIn 0.5s ease',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  resultIcon: {
    fontSize: '24px',
    color: '#00ff88',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00ff88',
  },
  autoCloseTimer: {
    fontSize: '12px',
    color: '#888',
  },
  resultContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  resultDisease: {
    fontSize: '16px',
    color: '#fff',
  },
  resultConfidence: {
    fontSize: '14px',
    color: '#ccc',
  },
  resultSeverity: {
    fontSize: '14px',
    color: '#ccc',
  },
  severityBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    marginLeft: '10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
  },
  resultTreatment: {
    fontSize: '14px',
    color: '#ddd',
  },
  resultFooter: {
    paddingTop: '15px',
    borderTop: '1px solid #00ff8822',
    textAlign: 'center',
  },
  closeResultBtn: {
    backgroundColor: '#00ff88',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  conditionsSection: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#fff',
  },
  conditionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#aaa',
  },
  select: {
    padding: '10px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  input: {
    padding: '10px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '8px',
    fontSize: '14px',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ddd',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  errorCard: {
    backgroundColor: '#ff444411',
    border: '1px solid #ff4444',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorIcon: {
    fontSize: '20px',
    color: '#ff4444',
  },
  errorText: {
    color: '#ff8888',
    fontSize: '14px',
    flex: 1,
  },
  retryBtn: {
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '4px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#00ff88',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #000',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

// Add animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .preview-overlay:hover {
    opacity: 1;
  }
`;
document.head.appendChild(styleSheet);

export default UploadForm;
