import React, { useState, useEffect } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import RoutineCategory from "./components/RoutineCategory";
import ViewToggle from "./components/ViewToggle";
import WeeklyCalendar from "./components/WeeklyCalendar";
import EventPanel from "./components/EventPanel";
import { RoutineItem } from "./types";
import { WeeklyEvent, EventTemplate } from "./types";
import eventTemplatesData from "./data/eventTemplates.json";
import { getRoutineCategories } from "./data/routines";
import { getCategoryFromTime } from "./utils/weeklyUtils";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"weekly" | "daily">("weekly");
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyEvent[]>([]);
  const [dailyRoutines, setDailyRoutines] = useState<RoutineItem[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // 获取本周开始日期（周日）
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });
  const [eventTemplates, setEventTemplates] = useState<EventTemplate[]>(() => {
    const saved = localStorage.getItem("event-templates");
    if (saved) return JSON.parse(saved);
    return eventTemplatesData.eventTemplates;
  });

  const [currentDate] = useState(new Date().toLocaleDateString("zh-CN"));

  useEffect(() => {
    localStorage.setItem("daily-routines", JSON.stringify(dailyRoutines));
    localStorage.setItem("weekly-events", JSON.stringify(weeklyEvents));
  }, [dailyRoutines, weeklyEvents]);

  useEffect(() => {
    localStorage.setItem("event-templates", JSON.stringify(eventTemplates));
  }, [eventTemplates]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("weekly-events");
    if (savedEvents) {
      setWeeklyEvents(JSON.parse(savedEvents));
    }
  }, []);

  const convertWeeklyEventsToDailyRoutines = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    const todayEvents = weeklyEvents.filter(
      (event) => event.date === todayString
    );

    const routines = todayEvents.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.title, // 使用标题作为描述
      time: event.startTime,
      category: getCategoryFromTime(event.startTime),
      completed: false,
    }));

    setDailyRoutines(routines);
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

  const handleEventAdd = (event: WeeklyEvent) => {
    setWeeklyEvents((prev) => {
      const newEvents = [...prev, event];
      return newEvents;
    });
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

  const handleAddTemplate = (template: EventTemplate) => {
    setEventTemplates((prev) => [...prev, template]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // 删除事件模板
    setEventTemplates((prev) => prev.filter((t) => t.id !== templateId));

    // 同时删除周历中所有使用该模板的事件
    setWeeklyEvents((prev) =>
      prev.filter((event) => event.templateId !== templateId)
    );
  };

  const handleUpdateTemplate = (
    templateId: string,
    updatedTemplate: EventTemplate
  ) => {
    setEventTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? updatedTemplate : t))
    );
  };

  const handleWeekChange = (newWeekStart: Date) => {
    setCurrentWeekStart(newWeekStart);
  };

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
                    e.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify(template)
                    );
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onAddTemplate={handleAddTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onUpdateTemplate={handleUpdateTemplate}
                />
              </div>
              <div className="calendar-container">
                <WeeklyCalendar
                  events={weeklyEvents}
                  onEventAdd={handleEventAdd}
                  onEventDelete={handleEventDelete}
                  currentWeekStart={currentWeekStart}
                  onWeekChange={handleWeekChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="daily-view">
            {totalRoutines > 0 ? (
              <>
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

                <main className="app-main">
                  {categories.map((category) => (
                    <RoutineCategory
                      key={category.name}
                      category={category}
                      onToggleItem={handleToggleRoutine}
                    />
                  ))}
                </main>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h2 className="empty-title">今日暂无安排</h2>
                <p className="empty-description">
                  请在周历界面为今天安排一些活动，然后回到这里查看打卡进度。
                </p>
                <button
                  className="switch-view-btn"
                  onClick={() => setCurrentView("weekly")}
                >
                  去周历安排
                </button>
              </div>
            )}
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
