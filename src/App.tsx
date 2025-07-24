import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import AuthForm from './components/Auth/AuthForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import UserDashboard from './components/Dashboard/UserDashboard';
import OrganizerDashboard from './components/Dashboard/OrganizerDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return user?.type === 'organizer' ? 'dashboard' : 'discover';
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <main className="flex-1 md:ml-64">
          {user?.type === 'organizer' ? (
            <OrganizerDashboard activeTab={activeTab} />
          ) : (
            <UserDashboard activeTab={activeTab} />
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </AuthProvider>
  );
}

export default App;