import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LeadsView } from './components/LeadsView';
import { ModelEvaluation } from './components/ModelEvaluation';
import { MessagingView } from './components/MessagingView';
import { SettingsView } from './components/SettingsView';
import { LeadDetail } from './components/LeadDetail';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const renderView = () => {
    if (selectedLead) {
      return <LeadDetail leadId={selectedLead} onBack={() => setSelectedLead(null)} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadsView onSelectLead={setSelectedLead} />;
      case 'evaluation':
        return <ModelEvaluation />;
      case 'messaging':
        return <MessagingView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}
