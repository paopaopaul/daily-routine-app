import React, { useState, useEffect } from "react";
import { RoutineItem, WeeklyEvent, EventTemplate } from "./types";
import { defaultRoutines, getRoutineCategories } from "./data/routines";
import eventTemplatesData from "./data/eventTemplates.json";
import RoutineCategory from "./components/RoutineCategory";
import ProgressBar from "./components/ProgressBar";
import WeeklyCalendar from "./components/WeeklyCalendar";
import EventPanel from "./components/EventPanel";
import ViewToggle from "./components/ViewToggle";
import "./App.css";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"weekly" | "daily">("weekly");
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyEvent[]>([]);
  const [dailyRoutines, setDailyRoutines] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem("daily-routines");
    return saved ? JSON.parse(saved) : defaultRoutines;
  });

  const [currentDate] = useState(new Date().toLocaleDateString("zh-CN"));
  const eventTemplates: EventTemplate[] = eventTemplatesData.eventTemplates;

  useEffect(() => {
    localStorage.setItem("daily-routines", JSON.stringify(dailyRoutines));
    localStorage.setItem("weekly-events", JSON.stringify(weeklyEvents));
  }, [dailyRoutines, weeklyEvents]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("weekly-events");
    if (savedEvents) {
      setWeeklyEvents(JSON.parse(savedEvents));
    }
  }, []);

  const convertWeeklyEventsToDailyRoutines = () => {
    const today = new Date().getDay();
    const todayEvents = weeklyEvents.filter((event) => event.day === today);

    const routines: RoutineItem[] = todayEvents.map((event, index) => ({
      id: `weekly-${event.id}`,
      title: event.title,
      description: event.description,
      time: event.startTime,
      completed: false,
      category: getCategoryFromTime(event.startTime),
    }));

    const allRoutines = [...defaultRoutines, ...routines];
    setDailyRoutines(allRoutines);
  };

  const getCategoryFromTime = (
    time: string
  ): "morning" | "afternoon" | "evening" | "night" => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18 && hour < 22) return "evening";
    return "night";
  };

  const handleViewChange = (view: "weekly" | "daily") => {
    setCurrentView(view);
    if (view === "daily") {
      convertWeeklyEventsToDailyRoutines();
    }
  };

  const handleToggleRoutine = (id: string) => {
    setDailyRoutines((prevRoutines) =>
      prevRoutines.map((routine) =>
        routine.id === id
          ? { ...routine, completed: !routine.completed }
          : routine
      )
    );
  };

  const handleResetAll = () => {
    setDailyRoutines((prevRoutines) =>
      prevRoutines.map((routine) => ({ ...routine, completed: false }))
    );
  };

  const handleEventAdd = (event: WeeklyEvent) => {
    setWeeklyEvents((prev) => [...prev, event]);
  };

  const handleEventDelete = (eventId: string) => {
    setWeeklyEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const totalCompleted = dailyRoutines.filter(
    (routine) => routine.completed
  ).length;
  const totalRoutines = dailyRoutines.length;
  const overallProgress =
    totalRoutines > 0 ? Math.round((totalCompleted / totalRoutines) * 100) : 0;

  const categories = getRoutineCategories(dailyRoutines);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">每日例行程序</h1>
          <div className="app-date">{currentDate}</div>
        </header>

        <ViewToggle currentView={currentView} onViewChange={handleViewChange} />

        {currentView === "weekly" ? (
          <div className="weekly-view">
            <div className="weekly-layout">
              <div className="event-panel-container">
                <EventPanel
                  templates={eventTemplates}
                  onDragStart={(e, template) => {
                    console.log("Drag start:", template);
                    e.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify(template)
                    );
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                />
              </div>
              <div className="calendar-container">
                <WeeklyCalendar
                  events={weeklyEvents}
                  onEventAdd={handleEventAdd}
                  onEventDelete={handleEventDelete}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="daily-view">
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
          </div>
        )}

        <footer className="app-footer">
          <p>保持规律的生活习惯，让每一天都充满活力！</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
