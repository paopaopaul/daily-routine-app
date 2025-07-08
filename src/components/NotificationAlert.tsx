import React, { useState } from "react";
import { RoutineItem } from "../types";
import "./NotificationAlert.css";

interface NotificationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  routine: RoutineItem;
  onStart: () => void;
  onSnooze: (minutes: number) => void;
  defaultSnooze: number;
}

const NotificationAlert: React.FC<NotificationAlertProps> = ({
  isOpen,
  onClose,
  routine,
  onStart,
  onSnooze,
  defaultSnooze,
}) => {
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

  const handleSnoozeClick = () => {
    setShowSnoozeOptions(!showSnoozeOptions);
  };

  const handleSnoozeSelect = (minutes: number) => {
    onSnooze(minutes);
    setShowSnoozeOptions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="notification-alert-overlay">
      <div className="notification-alert">
        <div className="notification-alert-header">
          <h3 className="notification-alert-title">事件提醒</h3>
        </div>

        <div className="notification-alert-content">
          <div className="notification-event-info">
            <div className="notification-event-title">{routine.title}</div>
            <div className="notification-event-time">
              {routine.time} - {routine.endTime}
            </div>
          </div>
        </div>

        <div className="notification-alert-actions">
          <button className="notification-btn start-btn" onClick={onStart}>
            ✅ 开始
          </button>

          <div className="snooze-container">
            <button
              className="notification-btn snooze-btn"
              onClick={handleSnoozeClick}
            >
              ⏰ Snooze {showSnoozeOptions ? "▼" : "▼"}
            </button>

            {showSnoozeOptions && (
              <div className="snooze-options">
                <button
                  className="snooze-option"
                  onClick={() => handleSnoozeSelect(5)}
                >
                  5分钟
                </button>
                <button
                  className="snooze-option"
                  onClick={() => handleSnoozeSelect(10)}
                >
                  10分钟
                </button>
                <button
                  className="snooze-option"
                  onClick={() => handleSnoozeSelect(20)}
                >
                  20分钟
                </button>
              </div>
            )}
          </div>

          <button className="notification-btn close-btn" onClick={onClose}>
            ❌ 关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationAlert;
