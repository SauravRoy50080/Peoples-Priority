import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClusterDetail from './pages/ClusterDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cluster/:clusterId" element={<ClusterDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;