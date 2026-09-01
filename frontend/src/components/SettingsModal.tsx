import React, { useState } from 'react';
import { Key, Server, X } from 'lucide-react';
import type { ApiSettings } from '../types/studyPlanner';
import { getStoredSettings, saveSettings } from '../api/client';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState<ApiSettings>(getStoredSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSave) onSave();
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="settings-modal-backdrop">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} id="settings-modal-dialog">
        <div className="modal-header">
          <h3 className="modal-title">API & Authentication Settings</h3>
          <button className="btn-icon" onClick={onClose} id="btn-close-settings">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {savedSuccess && (
              <div className="alert alert-success">
                Settings saved successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="setting-base-url">
                <Server size={16} /> Backend Base URL
              </label>
              <input
                id="setting-base-url"
                type="text"
                className="form-input"
                value={settings.baseUrl}
                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                placeholder="http://localhost:8080"
                required
              />
              <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                Prefix <code>/api/v1</code> will be appended automatically.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setting-auth-user">
                <Key size={16} /> Basic Auth Username
              </label>
              <input
                id="setting-auth-user"
                type="text"
                className="form-input"
                value={settings.basicAuthUser}
                onChange={(e) => setSettings({ ...settings, basicAuthUser: e.target.value })}
                placeholder="e.g. admin"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="setting-auth-pass">
                <Key size={16} /> Basic Auth Password
              </label>
              <input
                id="setting-auth-pass"
                type="password"
                className="form-input"
                value={settings.basicAuthPass}
                onChange={(e) => setSettings({ ...settings, basicAuthPass: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} id="btn-cancel-settings">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" id="btn-save-settings">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
