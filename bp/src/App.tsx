import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { MainLayout, AppTabs } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AddReadingPage } from './pages/AddReadingPage';
import { HistoryPage } from './pages/HistoryPage';
import { MonitorPage } from './pages/MonitorPage';

function App() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return <AuthPage />;
  }

  const handleReadingAdded = () => {
    setRefreshKey(prev => prev + 1); // Trigger a refresh in other components
    setCurrentTab('History'); // Switch to history tab
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'Dashboard':
        return <DashboardPage key={refreshKey} />;
      case 'Monitor':
        return <MonitorPage />;
      case 'Add Reading':
        return <AddReadingPage onReadingAdded={handleReadingAdded} />;
      case 'History':
        return <HistoryPage key={refreshKey} />;
      default:
        return <DashboardPage key={refreshKey} />;
    }
  };

  return (
    <MainLayout>
      <AppTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {renderContent()}
    </MainLayout>
  );
}

export default App;

