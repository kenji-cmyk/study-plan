import { useState } from 'react';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { SubjectManagement } from './components/subjects/SubjectManagement';
import { PlanGenerator } from './components/plan/PlanGenerator';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';

export function App() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'plan'>('subjects');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSubjectsCount, setActiveSubjectsCount] = useState<number>(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
      title,
    });
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'subjects' ? (
          <SubjectManagement
            onNotify={showToast}
            onActiveSubjectsChange={setActiveSubjectsCount}
          />
        ) : (
          <PlanGenerator
            onNotify={showToast}
            activeSubjectsCount={activeSubjectsCount}
          />
        )}
      </main>

      {/* Global Modals & Notifications */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => showToast('info', 'API & Auth credentials updated.')}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

export default App;
