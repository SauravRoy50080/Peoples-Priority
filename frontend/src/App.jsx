import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ClusterDetail from './pages/ClusterDetail';
import Submit from './pages/Submit';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cluster/:clusterId" element={<ClusterDetail />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;