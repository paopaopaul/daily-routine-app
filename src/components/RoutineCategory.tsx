import React from "react";
import { RoutineCategory as RoutineCategoryType } from "../types";
import RoutineItem from "./RoutineItem";
import ProgressBar from "./ProgressBar";
import "./RoutineCategory.css";

interface RoutineCategoryProps {
  category: RoutineCategoryType;
  onToggleItem: (id: string) => void;
}

const RoutineCategory: React.FC<RoutineCategoryProps> = ({
  category,
  onToggleItem,
}) => {
  const completedCount = category.items.filter((item) => item.completed).length;
  const totalCount = category.items.length;

  return (
    <div
      className="routine-category"
      style={{ borderTopColor: category.color }}
    >
      <div className="category-header">
        <h2 className="category-title">{category.name}</h2>
        <ProgressBar
          completed={completedCount}
          total={totalCount}
          label={`${category.name}进度`}
        />
      </div>
      <div className="category-items">
        {category.items.map((item) => (
          <RoutineItem key={item.id} item={item} onToggle={onToggleItem} />
        ))}
      </div>
    </div>
  );
};

export default RoutineCategory;
