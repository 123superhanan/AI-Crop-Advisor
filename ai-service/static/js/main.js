// ====================== DISEASE DETECTION ======================
async function predictDisease() {
  const file = document.getElementById('image');
  if (!file || !file.files[0]) {
    alert('Please select a leaf image first');
    return;
  }

  const formData = new FormData();
  formData.append('image', file.files[0]);

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="loading"></div> Analyzing leaf image...';
  resultDiv.style.display = 'block';

  try {
    const response = await fetch('/api/predict-disease', { method: 'POST', body: formData });
    const data = await response.json();

    if (data.success) {
      const severityColor =
        data.severity === 'High' ? '#FF6B6B' : data.severity === 'Medium' ? '#FFD700' : '#1DB954';
      resultDiv.innerHTML = `
                <h3>Diagnosis Result</h3>
                <p>Disease: <strong style="color:#1DB954">${data.disease}</strong></p>
                <p>Confidence: <strong>${data.confidence_percentage}</strong></p>
                <p>Severity: <strong style="color:${severityColor}">${data.severity}</strong></p>
                <p>Treatment: ${data.treatment}</p>
                <p>Prevention: ${data.prevention}</p>
                <hr>
                <p style="font-size:12px; color:#666;">Powered by AgriVision AI CNN Model</p>
            `;
    } else {
      resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Network error. Please try again.</p>`;
  }
}

// ====================== IRRIGATION ADVISOR ======================
async function predictIrrigation() {
  const data = {
    soilMoisture: document.getElementById('soilMoisture')?.value || 35,
    soilType: document.getElementById('soilType')?.value || 'loam',
    temperature: document.getElementById('temperature')?.value || 28,
  };

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="loading"></div> Calculating irrigation schedule...';
  resultDiv.style.display = 'block';

  try {
    const response = await fetch('/api/irrigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.success) {
      resultDiv.innerHTML = `
                <h3>Irrigation Recommendation</h3>
                <p>Water Required: <strong style="color:#00BFFF">${result.recommended_irrigation}</strong></p>
                <p>Frequency: ${result.frequency}</p>
                <p>Best Time: ${result.best_time}</p>
                <hr>
                <p style="font-size:12px; color:#666;">Based on soil moisture and temperature analysis</p>
            `;
    } else {
      resultDiv.innerHTML = `<p class="error">Error: ${result.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Network error. Please try again.</p>`;
  }
}

// ====================== PEST RISK ASSESSMENT ======================
async function predictPestRisk() {
  const data = {
    humidity: document.getElementById('humidity')?.value || 65,
    cropType: document.getElementById('cropType')?.value || 'wheat',
    history: document.getElementById('history')?.value || 'none',
  };

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="loading"></div> Analyzing pest risk factors...';
  resultDiv.style.display = 'block';

  try {
    const response = await fetch('/api/pest-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.success) {
      const riskColor =
        result.risk_level === 'High'
          ? '#FF6B6B'
          : result.risk_level === 'Moderate'
            ? '#FFD700'
            : '#1DB954';
      resultDiv.innerHTML = `
                <h3>Pest Risk Assessment</h3>
                <p>Risk Level: <strong style="color:${riskColor}">${result.risk_level}</strong></p>
                <p>Risk Score: ${result.risk_score}/100</p>
                <p>Recommended Action: ${result.action}</p>
                <hr>
                <p style="font-size:12px; color:#666;">Based on humidity and regional pest history</p>
            `;
    } else {
      resultDiv.innerHTML = `<p class="error">Error: ${result.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Network error. Please try again.</p>`;
  }
}

// ====================== YIELD PREDICTOR ======================
async function predictYield() {
  const data = {
    farmSize: document.getElementById('farmSize')?.value || 1,
    fertilizer: document.getElementById('fertilizer')?.value || 100,
    rainfall: document.getElementById('rainfall')?.value || 400,
  };

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="loading"></div> Calculating yield prediction...';
  resultDiv.style.display = 'block';

  try {
    const response = await fetch('/api/yield', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.success) {
      resultDiv.innerHTML = `
                <h3>Yield Prediction</h3>
                <p>Estimated Yield: <strong style="color:#FFD700">${result.estimated_yield}</strong></p>
                <p>Projected Market Value: ${result.market_value}</p>
                <hr>
                <p style="font-size:12px; color:#666;">Based on farm area, fertilizer, and rainfall data</p>
            `;
    } else {
      resultDiv.innerHTML = `<p class="error">Error: ${result.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Network error. Please try again.</p>`;
  }
}

// ====================== UTILITY FUNCTIONS ======================
function updateRangeValue(sliderId, outputId) {
  const slider = document.getElementById(sliderId);
  const output = document.getElementById(outputId);
  if (slider && output) {
    output.value =
      slider.value + (sliderId.includes('moisture') || sliderId.includes('humidity') ? '%' : '');
    slider.oninput = function () {
      output.value =
        this.value + (sliderId.includes('moisture') || sliderId.includes('humidity') ? '%' : '');
    };
  }
}

// Initialize range sliders when page loads
document.addEventListener('DOMContentLoaded', function () {
  updateRangeValue('soilMoisture', 'moistureValue');
  updateRangeValue('humidity', 'humidityValue');
});
