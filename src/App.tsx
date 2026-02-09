import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GlucoseTracker from './pages/GlucoseTracker';
import SymptomLogger from './pages/SymptomLogger';
import InsulinCalculator from './pages/InsulinCalculator';
import Wellness from './pages/Wellness';
import Auth from './pages/Auth';
import { auth } from './config/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
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
