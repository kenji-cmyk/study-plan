import React, { useState } from "react";
import { Key, Server, X } from "lucide-react";
import type { ApiSettings } from "../types/studyPlanner";
import { getStoredSettings, saveSettings } from "../api/client";
import { Modal } from "./Modal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<ApiSettings>(getStoredSettings);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = settings.baseUrl.trim().replace(/\/+$/, "");
    if (baseUrl && !/^https?:\/\/[^\s]+$/i.test(baseUrl)) {
      setError(
        "Use an http:// or https:// address, or leave this blank for the default connection.",
      );
      return;
    }
    try {
      saveSettings({ ...settings, baseUrl });
      onSave?.();
      onClose();
    } catch {
      setError(
        "Your browser could not save these settings. Check whether browser storage is enabled.",
      );
    }
  };

  return (
    <Modal
      initialFocus="#setting-base-url"
      onClose={onClose}
      labelledBy="settings-dialog-title"
      id="settings-modal-dialog"
    >
      <div className="modal-header">
        <h2 className="modal-title" id="settings-dialog-title">
          Connection settings
        </h2>
        <button
          className="btn-icon"
          onClick={onClose}
          id="btn-close-settings"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
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
              onChange={(e) =>
                setSettings({ ...settings, baseUrl: e.target.value })
              }
              placeholder="http://localhost:8080"
              autoFocus
              aria-describedby="base-url-help"
            />
            <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>
              <span id="base-url-help">
                Leave blank to use this site’s default connection. For a custom
                server, enter its address without <code>/api/v1</code>.
              </span>
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="setting-auth-user">
              <Key size={16} /> Basic Auth Username
            </label>
            <input
              id="setting-auth-user"
              autoComplete="username"
              type="text"
              className="form-input"
              value={settings.basicAuthUser}
              onChange={(e) =>
                setSettings({ ...settings, basicAuthUser: e.target.value })
              }
              placeholder="e.g. admin"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="setting-auth-pass">
              <Key size={16} /> Basic Auth Password
            </label>
            <input
              id="setting-auth-pass"
              autoComplete="current-password"
              type="password"
              className="form-input"
              value={settings.basicAuthPass}
              onChange={(e) =>
                setSettings({ ...settings, basicAuthPass: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            id="btn-cancel-settings"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            id="btn-save-settings"
          >
            Save Settings
          </button>
        </div>
      </form>
    </Modal>
  );
};
