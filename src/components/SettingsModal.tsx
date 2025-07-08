import React, { useState } from "react";
import { NotificationSettings } from "../types";
import "./SettingsModal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  onImportData: () => void;
  onClearData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onImportData,
  onClearData,
}) => {
  const [localSettings, setLocalSettings] =
    useState<NotificationSettings>(settings);

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleResetSettings = () => {
    const defaultSettings: NotificationSettings = {
      enabled: true,
      defaultSnooze: 5,
      notificationStyle: "banner",
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2 className="settings-modal-title">设置</h2>
          <button className="settings-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-modal-content">
          {/* 通知设置 */}
          <div className="settings-section">
            <h3 className="settings-section-title">通知设置</h3>
            <div className="settings-item">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={localSettings.enabled}
                  onChange={(e) =>
                    handleSettingChange("enabled", e.target.checked)
                  }
                  className="settings-checkbox"
                />
                启用通知
              </label>
            </div>
            <div className="settings-item">
              <label className="settings-label">
                默认 Snooze 时间:
                <select
                  value={localSettings.defaultSnooze}
                  onChange={(e) =>
                    handleSettingChange(
                      "defaultSnooze",
                      parseInt(e.target.value)
                    )
                  }
                  className="settings-select"
                >
                  <option value={5}>5分钟</option>
                  <option value={10}>10分钟</option>
                  <option value={20}>20分钟</option>
                </select>
              </label>
            </div>
            <div className="settings-item">
              <label className="settings-label">
                通知样式:
                <select
                  value={localSettings.notificationStyle}
                  onChange={(e) =>
                    handleSettingChange(
                      "notificationStyle",
                      e.target.value as "banner" | "alert"
                    )
                  }
                  className="settings-select"
                >
                  <option value="banner">横幅 (右上角，自动消失)</option>
                  <option value="alert">提醒 (顶部中央，需手动关闭)</option>
                </select>
              </label>
            </div>
          </div>

          {/* 数据管理 */}
          <div className="settings-section">
            <h3 className="settings-section-title">数据管理</h3>
            <div className="settings-buttons">
              <button
                className="settings-btn import-btn"
                onClick={onImportData}
              >
                📥 导入数据
              </button>
              <button className="settings-btn clear-btn" onClick={onClearData}>
                🗑️ 清除数据
              </button>
            </div>
          </div>

          {/* 其他设置 */}
          <div className="settings-section">
            <h3 className="settings-section-title">其他设置</h3>
            <div className="settings-buttons">
              <button
                className="settings-btn reset-btn"
                onClick={handleResetSettings}
              >
                🔄 重置为默认设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
