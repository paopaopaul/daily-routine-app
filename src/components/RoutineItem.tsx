import React from "react";
import { RoutineItem as RoutineItemType } from "../types";
import "./RoutineItem.css";

interface RoutineItemProps {
  item: RoutineItemType;
  onToggle: (id: string) => void;
}

const RoutineItem: React.FC<RoutineItemProps> = ({ item, onToggle }) => {
  return (
    <div className={`routine-item ${item.completed ? "completed" : ""}`}>
      <div className="routine-item-header">
        <div className="routine-item-time">{item.time}</div>
        <button
          className={`toggle-button ${item.completed ? "completed" : ""}`}
          onClick={() => onToggle(item.id)}
          aria-label={item.completed ? "标记为未完成" : "标记为已完成"}
        >
          {item.completed ? "✓" : "○"}
        </button>
      </div>
      <div className="routine-item-content">
        <h3 className="routine-item-title">{item.title}</h3>
        <p className="routine-item-description">{item.description}</p>
      </div>
    </div>
  );
};

export default RoutineItem;
