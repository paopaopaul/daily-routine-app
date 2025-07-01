import React, { useState, useEffect } from "react";
import { RoutineItem } from "./types";
import { defaultRoutines, getRoutineCategories } from "./data/routines";
import RoutineCategory from "./components/RoutineCategory";
import ProgressBar from "./components/ProgressBar";
import "./App.css";

const App: React.FC = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem("daily-routines");
    return saved ? JSON.parse(saved) : defaultRoutines;
  });

  const [currentDate] = useState(new Date().toLocaleDateString("zh-CN"));

  useEffect(() => {
    localStorage.setItem("daily-routines", JSON.stringify(routines));
  }, [routines]);

  const handleToggleRoutine = (id: string) => {
    setRoutines((prevRoutines) =>
      prevRoutines.map((routine) =>
        routine.id === id
          ? { ...routine, completed: !routine.completed }
          : routine
      )
    );
  };

  const handleResetAll = () => {
    setRoutines((prevRoutines) =>
      prevRoutines.map((routine) => ({ ...routine, completed: false }))
    );
  };

  const totalCompleted = routines.filter((routine) => routine.completed).length;
  const totalRoutines = routines.length;
  const overallProgress =
    totalRoutines > 0 ? Math.round((totalCompleted / totalRoutines) * 100) : 0;

  const categories = getRoutineCategories(routines);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">每日例行程序</h1>
          <div className="app-date">{currentDate}</div>
        </header>

        <div className="overall-progress">
          <ProgressBar
            completed={totalCompleted}
            total={totalRoutines}
            label="今日总体进度"
          />
          <div className="progress-stats">
            <span className="stat-item">
              已完成: <strong>{totalCompleted}</strong>
            </span>
            <span className="stat-item">
              总计: <strong>{totalRoutines}</strong>
            </span>
            <span className="stat-item">
              完成率: <strong>{overallProgress}%</strong>
            </span>
          </div>
        </div>

        <div className="reset-section">
          <button className="reset-button" onClick={handleResetAll}>
            重置所有进度
          </button>
        </div>

        <main className="app-main">
          {categories.map((category) => (
            <RoutineCategory
              key={category.name}
              category={category}
              onToggleItem={handleToggleRoutine}
            />
          ))}
        </main>

        <footer className="app-footer">
          <p>保持规律的生活习惯，让每一天都充满活力！</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
