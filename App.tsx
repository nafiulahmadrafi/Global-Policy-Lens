/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PolicyProvider } from './context/PolicyContext';
import Home from './pages/Home';
import Upload from './pages/Upload';
import DashboardPage from './pages/DashboardPage';
import MethodologyPage from './pages/MethodologyPage';
import PublicFeed from './pages/PublicFeed';
import { ErrorBoundary } from './components/LandingPage';

export default function App() {
  return (
    <PolicyProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/upload" element={<ErrorBoundary><Upload /></ErrorBoundary>} />
            <Route path="/dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="/methodology" element={<ErrorBoundary><MethodologyPage /></ErrorBoundary>} />
            <Route path="/feed" element={<ErrorBoundary><PublicFeed /></ErrorBoundary>} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </PolicyProvider>
  );
}
