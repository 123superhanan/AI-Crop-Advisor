// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import your components/pages (default imports)
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
