// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import your components/pages
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Prc from './pages/prc';
// Protected Route Component (for pages that need login)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navbar only shows when user is logged in */}
        <NavbarWrapper />

        <main>
          <Routes>
            {/* Public route - Auth page */}
            <Route path="/login" element={<Auth />} />
            <Route path="/prc" element={<Prc />} />

            {/* Protected routes - require login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 page */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Navbar wrapper - only shows when user is logged in
const NavbarWrapper = () => {
  const { user } = useAuth();

  if (!user) return null;
  return <Navbar />;
};

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#00ff88',
    backgroundColor: '#0f0f0f',
  },
};

export default App;
