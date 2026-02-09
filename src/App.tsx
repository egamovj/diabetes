import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GlucoseTracker from './pages/GlucoseTracker';
import SymptomLogger from './pages/SymptomLogger';
import InsulinCalculator from './pages/InsulinCalculator';
import Wellness from './pages/Wellness';
import Auth from './pages/Auth';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Auth onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout onLogout={() => setIsAuthenticated(false)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/glucose" element={<GlucoseTracker />} />
          <Route path="/symptoms" element={<SymptomLogger />} />
          <Route path="/calculator" element={<InsulinCalculator />} />
          <Route path="/wellness" element={<Wellness />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
