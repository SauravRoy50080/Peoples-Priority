import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Dashboard from './pages/Dashboard';
import ClusterDetail from './pages/ClusterDetail';
=======
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ClusterDetail from './pages/ClusterDetail';
import Submit from './pages/Submit';
>>>>>>> Asmita

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cluster/:clusterId" element={<ClusterDetail />} />
=======
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cluster/:clusterId" element={<ClusterDetail />} />
        <Route path="/submit" element={<Submit />} />
>>>>>>> Asmita
      </Routes>
    </BrowserRouter>
  );
}

export default App;