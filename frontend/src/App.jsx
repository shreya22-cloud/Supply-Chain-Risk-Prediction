import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OverviewDashboard from './pages/OverviewDashboard';
import RiskControlTower from './pages/RiskControlTower';
import ShipmentIntelligence from './pages/ShipmentIntelligence';
import SupplierIntelligence from './pages/SupplierIntelligence';
import DigitalTwin from './pages/DigitalTwin';
import AlertCenter from './pages/AlertCenter';
import NLPEarlyWarning from './pages/NLPEarlyWarning';
import MitigationCenter from './pages/MitigationCenter';
import AnalyticsPage from './pages/AnalyticsPage';
import DataUploadPage from './pages/DataUploadPage';
import CopilotPage from './pages/CopilotPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [view, setView] = useState(() => (
    localStorage.getItem('supplyguard-account') ? 'landing' : 'login'
  )); // 'landing', 'login', or active dashboard page
  const [activePage, setActivePage] = useState('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedAlertForMitigation, setSelectedAlertForMitigation] = useState(null);

  const handleLaunch = () => setView('login');
  const handleDemo = () => {
    setView('dashboard');
    setActivePage('overview');
  };
  const handleLoginSuccess = () => {
    setView('dashboard');
    setActivePage('overview');
  };

  const handleSearchFromNav = (query) => {
    setGlobalSearch(query);
    if (query && view === 'dashboard' && activePage !== 'shipments') {
      setActivePage('shipments');
    }
  };

  const handleNavigateToMitigation = (alertObj) => {
    setSelectedAlertForMitigation(alertObj);
    setActivePage('mitigation');
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} onDemo={handleDemo} />;
  }

  if (view === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4faf5', color: '#294436' }}>
      
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Navbar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          onSearch={handleSearchFromNav}
          onTriggerDemo={handleDemo}
        />

        {/* Page Routing Switcher */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activePage === 'overview' && <OverviewDashboard onNavigate={setActivePage} />}
          {activePage === 'control-tower' && <RiskControlTower onNavigateToShipments={(po) => { setGlobalSearch(po); setActivePage('shipments'); }} />}
          {activePage === 'shipments' && <ShipmentIntelligence initialSearch={globalSearch} />}
          {activePage === 'suppliers' && <SupplierIntelligence />}
          {activePage === 'digital-twin' && <DigitalTwin />}
          {activePage === 'alerts' && <AlertCenter onNavigateToMitigation={handleNavigateToMitigation} />}
          {activePage === 'nlp-warning' && <NLPEarlyWarning />}
          {activePage === 'mitigation' && <MitigationCenter activeAlert={selectedAlertForMitigation} />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === 'upload' && <DataUploadPage />}
          {activePage === 'copilot' && <CopilotPage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>

      </div>

    </div>
  );
}
