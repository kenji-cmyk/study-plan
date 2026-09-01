import React from 'react';
import { BookOpen, Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: 'subjects' | 'plan';
  onTabChange: (tab: 'subjects' | 'plan') => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onOpenSettings }) => {
  return (
    <header className="header-bar">
      <div className="header-content">
        <div className="brand-logo">
          <div className="logo-icon">
            <BookOpen size={24} color="#FFFFFF" />
          </div>
          <div className="brand-title">
            <h1>StudyPlanner</h1>
            <span className="brand-subtitle">Smart Academic Scheduling</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => onTabChange('subjects')}
            id="nav-tab-subjects"
          >
            <BookOpen size={18} />
            <span>Subjects</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => onTabChange('plan')}
            id="nav-tab-plan"
          >
            <Calendar size={18} />
            <span>Study Plan</span>
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenSettings}
            id="btn-open-settings"
            title="Configure API & Auth Settings"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <style>{`
        .header-bar {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1140px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(3, 147, 244, 0.3);
        }

        .brand-title h1 {
          font-size: 1.25rem;
          line-height: 1.2;
          font-weight: 700;
          color: var(--color-navy);
          letter-spacing: -0.02em;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--color-muted);
          font-weight: 500;
        }

        .nav-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-bg);
          padding: 0.35rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-border);
        }

        .nav-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-pill);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-muted);
          transition: all var(--transition-fast);
        }

        .nav-tab:hover {
          color: var(--color-navy);
        }

        .nav-tab.active {
          background: #FFFFFF;
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 640px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </header>
  );
};
