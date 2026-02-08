import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { VirtualTryOn } from './pages/VirtualTryOn';
import { LiveTryOn } from './pages/LiveTryOn';
import { FurnitureAR } from './pages/FurnitureAR';
import { Gallery } from './pages/Gallery';
import { Settings } from './pages/Settings';
import { PoseTest } from './pages/PoseTest';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-bg text-black font-sans selection:bg-accent selection:text-black">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tryon" element={<VirtualTryOn />} />
              <Route path="/live" element={<LiveTryOn />} />
              <Route path="/furniture" element={<FurnitureAR />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pose-test" element={<PoseTest />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;