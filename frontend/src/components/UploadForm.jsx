// src/components/UploadForm.jsx
import { useState } from 'react';
import { predictionService } from '../services/api';

const UploadForm = ({ onClose, onSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image); // Change field name if your backend expects different key
    // formData.append('cropType', 'wheat'); // Add more fields if needed

    try {
      await predictionService.createPrediction(formData); // Make sure your api.js supports FormData
      onSuccess(); // Refresh dashboard
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>New Crop Analysis</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.uploadArea}>
            {preview ? (
              <img src={preview} alt="preview" style={styles.previewImage} />
            ) : (
              <div style={styles.placeholder}>
                <p>📸</p>
                <p>Drop image here or click to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
              </div>
            )}
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitBtn} disabled={loading || !image}>
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: '#111',
    width: '90%',
    maxWidth: '480px',
    borderRadius: '16px',
    border: '1px solid #222',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 25px',
    borderBottom: '1px solid #222',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '24px',
    cursor: 'pointer',
  },
  form: {
    padding: '30px 25px',
  },
  uploadArea: {
    border: '2px dashed #333',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
    position: 'relative',
  },
  placeholder: {
    color: '#666',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '10px',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  error: {
    color: '#ff6666',
    textAlign: 'center',
    margin: '10px 0',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00ff88',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default UploadForm;
