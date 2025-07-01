import React from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  label,
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="progress-text">
        {completed} / {total} ({percentage}%)
      </div>
    </div>
  );
};

export default ProgressBar;
