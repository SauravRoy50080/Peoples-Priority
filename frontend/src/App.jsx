import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Submit from './pages/Submit';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClusterDetail from './pages/ClusterDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public — no login needed */}
          <Route path="/" element={<Landing />} />
          <Route path="/submit" element={<><Navbar /><Submit /></>} />
          <Route path="/login" element={<Login />} />

          {/* Protected — MP only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cluster/:clusterId"
            element={
              <ProtectedRoute>
                <Navbar />
                <ClusterDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;