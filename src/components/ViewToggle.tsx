import React from "react";
import "./ViewToggle.css";

interface ViewToggleProps {
  currentView: "weekly" | "daily";
  onViewChange: (view: "weekly" | "daily") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${currentView === "weekly" ? "active" : ""}`}
        onClick={() => onViewChange("weekly")}
      >
        📅 周历安排
      </button>
      <button
        className={`toggle-btn ${currentView === "daily" ? "active" : ""}`}
        onClick={() => onViewChange("daily")}
      >
        ✅ 每日打卡
      </button>
    </div>
  );
};

export default ViewToggle;
