import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MusicPlayer from './MusicPlayer';
import Auth from './components/auth/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Wrapper component for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, verifyToken } = useAuth();
  const [isVerifying, setIsVerifying] = React.useState(true);

  React.useEffect(() => {
    verifyToken().finally(() => setIsVerifying(false));
  }, [verifyToken]);

  if (isVerifying) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <MainContent />
              <MusicPlayer />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App
