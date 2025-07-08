import React, { useState, useEffect } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import RoutineItem from "./components/RoutineItem";
import ViewToggle from "./components/ViewToggle";
import WeeklyCalendar from "./components/WeeklyCalendar";
import EventPanel from "./components/EventPanel";
import SettingsModal from "./components/SettingsModal";
import NotificationAlert from "./components/NotificationAlert";
import { RoutineItem as RoutineItemType, NotificationSettings } from "./types";
import { WeeklyEvent, EventTemplate } from "./types";
import eventTemplatesData from "./data/eventTemplates.json";
import { getRoutineCategories } from "./data/routines";
import { getCategoryFromTime } from "./utils/weeklyUtils";
import { notificationService } from "./utils/notificationService";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"weekly" | "daily">("weekly");
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyEvent[]>([]);
  const [dailyRoutines, setDailyRoutines] = useState<RoutineItemType[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // 每次刷新都回到当前周（当天所在的周）
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

  // 通知相关状态
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(() => {
      const saved = localStorage.getItem("notification-settings");
      if (saved) return JSON.parse(saved);
      return { enabled: true, defaultSnooze: 5, notificationStyle: "banner" };
    });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationAlert, setNotificationAlert] = useState<{
    isOpen: boolean;
    routine: RoutineItemType | null;
  }>({ isOpen: false, routine: null });

  const [currentDate] = useState(new Date().toLocaleDateString("zh-CN"));

  // 保存周历事件到localStorage - 只在数据加载完成后保存
  useEffect(() => {
    if (isDataLoaded) {
      console.log("Saving weekly events:", weeklyEvents);
      localStorage.setItem("weekly-events", JSON.stringify(weeklyEvents));
    }
  }, [weeklyEvents, isDataLoaded]);

  // 保存每日例行程序到localStorage
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("daily-routines", JSON.stringify(dailyRoutines));
    }
  }, [dailyRoutines, isDataLoaded]);

  // 保存事件模板到localStorage
  useEffect(() => {
    localStorage.setItem("event-templates", JSON.stringify(eventTemplates));
  }, [eventTemplates]);

  // 保存当前视图到localStorage
  useEffect(() => {
    localStorage.setItem("current-view", currentView);
  }, [currentView]);

  // 保存通知设置到localStorage
  useEffect(() => {
    localStorage.setItem(
      "notification-settings",
      JSON.stringify(notificationSettings)
    );
  }, [notificationSettings]);

  // 初始化通知服务
  useEffect(() => {
    notificationService.init(
      (routine) => {
        setNotificationAlert({ isOpen: true, routine });
      },
      (routineId) => {
        // 当用户点击"开始"时，可以在这里添加逻辑
        console.log("Event started:", routineId);
      }
    );
  }, []);

  // 更新通知服务设置
  useEffect(() => {
    notificationService.setEnabled(notificationSettings.enabled);
    notificationService.setDefaultSnooze(notificationSettings.defaultSnooze);
    notificationService.setNotificationStyle(
      notificationSettings.notificationStyle
    );
  }, [notificationSettings]);

  // 初始化时从localStorage加载数据
  useEffect(() => {
    console.log("Loading data from localStorage...");

    // 加载周历事件
    const savedEvents = localStorage.getItem("weekly-events");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        console.log("Loaded weekly events:", parsedEvents);
        setWeeklyEvents(parsedEvents);
      } catch (error) {
        console.error("Error loading weekly events:", error);
        setWeeklyEvents([]);
      }
    } else {
      console.log("No saved weekly events found");
      setWeeklyEvents([]);
    }

    // 加载每日例行程序
    const savedRoutines = localStorage.getItem("daily-routines");
    if (savedRoutines) {
      try {
        setDailyRoutines(JSON.parse(savedRoutines));
      } catch (error) {
        console.error("Error loading daily routines:", error);
        setDailyRoutines([]);
      }
    } else {
      setDailyRoutines([]);
    }

    // 加载当前视图
    const savedView = localStorage.getItem("current-view");
    if (savedView && (savedView === "weekly" || savedView === "daily")) {
      setCurrentView(savedView);
    }

    // 加载通知设置
    const savedSettings = localStorage.getItem("notification-settings");
    if (savedSettings) {
      try {
        setNotificationSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading notification settings:", error);
        setNotificationSettings({
          enabled: true,
          defaultSnooze: 5,
          notificationStyle: "banner",
        });
      }
    }

    // 标记数据加载完成
    setIsDataLoaded(true);
    console.log("Data loading completed");
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

    // 获取当前已保存的每日例行程序，用于保留完成状态
    const existingRoutines = dailyRoutines;

    const newRoutines = todayEvents.map((event) => {
      // 查找是否已存在相同的例行程序，保留其完成状态
      const existingRoutine = existingRoutines.find(
        (routine) => routine.id === event.id
      );

      return {
        id: event.id,
        title: event.title,
        description: event.title, // 使用标题作为描述
        time: event.startTime,
        endTime: event.endTime, // 添加结束时间
        category: getCategoryFromTime(event.startTime),
        completed: existingRoutine ? existingRoutine.completed : false,
      };
    });

    // 按时间排序
    const sortedRoutines = newRoutines.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.time}`);
      const timeB = new Date(`2000-01-01T${b.time}`);
      return timeA.getTime() - timeB.getTime();
    });

    setDailyRoutines(sortedRoutines);

    // 更新通知定时器
    updateNotificationTimers(sortedRoutines);
  };

  // 更新通知定时器
  const updateNotificationTimers = (routines: RoutineItemType[]) => {
    // 清除所有现有定时器
    notificationService.clearAllTimers();

    // 为每个未完成的事件添加通知定时器
    routines.forEach((routine) => {
      if (!routine.completed) {
        notificationService.addEventNotification(routine);
      }
    });
  };

  const handleViewChange = (view: "weekly" | "daily") => {
    setCurrentView(view);
    if (view === "daily") {
      // 检查今日事件是否有变化
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayString = `${year}-${month}-${day}`;

      const todayEvents = weeklyEvents.filter(
        (event) => event.date === todayString
      );

      // 检查是否有新事件或删除的事件
      const currentEventIds = new Set(todayEvents.map((event) => event.id));
      const existingEventIds = new Set(
        dailyRoutines.map((routine) => routine.id)
      );

      const hasNewEvents = todayEvents.some(
        (event) => !existingEventIds.has(event.id)
      );
      const hasRemovedEvents = dailyRoutines.some(
        (routine) => !currentEventIds.has(routine.id)
      );

      // 如果有变化或每日例行程序为空，则更新
      if (hasNewEvents || hasRemovedEvents || dailyRoutines.length === 0) {
        convertWeeklyEventsToDailyRoutines();
      }
    }
  };

  const handleToggleRoutine = (id: string) => {
    setDailyRoutines((prevRoutines) => {
      const updatedRoutines = prevRoutines.map((routine) =>
        routine.id === id
          ? { ...routine, completed: !routine.completed }
          : routine
      );

      // 更新通知定时器
      updateNotificationTimers(updatedRoutines);

      return updatedRoutines;
    });
  };

  const handleEventAdd = (event: WeeklyEvent) => {
    console.log("Adding event:", event);
    setWeeklyEvents((prev) => {
      const newEvents = [...prev, event];
      console.log("New events array:", newEvents);
      return newEvents;
    });
  };

  const handleEventDelete = (eventId: string) => {
    console.log("Deleting event:", eventId);
    setWeeklyEvents((prev) => {
      const filteredEvents = prev.filter((event) => event.id !== eventId);
      console.log("Events after deletion:", filteredEvents);
      return filteredEvents;
    });
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

  // 通知Alert处理函数
  const handleNotificationStart = () => {
    if (notificationAlert.routine) {
      notificationService.handleStartEvent(notificationAlert.routine.id);
      setNotificationAlert({ isOpen: false, routine: null });
    }
  };

  const handleNotificationSnooze = (minutes: number) => {
    if (notificationAlert.routine) {
      notificationService.handleSnooze(notificationAlert.routine.id, minutes);
      setNotificationAlert({ isOpen: false, routine: null });
    }
  };

  const handleNotificationClose = () => {
    setNotificationAlert({ isOpen: false, routine: null });
  };

  // 数据管理功能
  const handleClearAllData = () => {
    if (window.confirm("确定要清除所有数据吗？此操作不可恢复。")) {
      localStorage.clear();
      setWeeklyEvents([]);
      setDailyRoutines([]);
      setEventTemplates(eventTemplatesData.eventTemplates);
      setCurrentView("weekly");
      // 重置通知设置
      setNotificationSettings({
        enabled: true,
        defaultSnooze: 5,
        notificationStyle: "banner",
      });

      // 重置当前周为本周
      const today = new Date();
      const currentDay = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDay);
      startOfWeek.setHours(0, 0, 0, 0);
      setCurrentWeekStart(startOfWeek);
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);

            // 验证数据格式
            if (data.weeklyEvents && data.eventTemplates) {
              setWeeklyEvents(data.weeklyEvents);
              setDailyRoutines(data.dailyRoutines || []);
              setEventTemplates(data.eventTemplates);
              // 导入通知设置
              if (data.notificationSettings) {
                setNotificationSettings(data.notificationSettings);
              }
              // 不导入currentWeekStart，保持当前周
              if (data.currentView) {
                setCurrentView(data.currentView);
              }
              alert("数据导入成功！");
            } else {
              alert("文件格式不正确，请选择正确的备份文件。");
            }
          } catch (error) {
            console.error("Error importing data:", error);
            alert("导入失败，请检查文件格式。");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // 设置相关处理函数
  const handleSettingsChange = (newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1 className="app-title">每日例行程序</h1>
            <div className="app-date">{currentDate}</div>
          </div>
          <div className="header-center">
            <ViewToggle
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </div>
          <div className="header-right">
            <button
              className="settings-button"
              onClick={handleOpenSettings}
              title="设置"
            >
              ⚙️
            </button>
          </div>
        </header>

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
                  <div className="daily-columns">
                    {categories.map((category) => (
                      <div key={category.name} className="daily-column">
                        <div className="column-header">
                          <h3 className="column-title">{category.name}</h3>
                          <div className="column-progress">
                            <span className="column-stats">
                              {
                                category.items.filter((item) => item.completed)
                                  .length
                              }
                              /{category.items.length}
                            </span>
                          </div>
                        </div>
                        <div className="column-items">
                          {category.items.map((item) => (
                            <RoutineItem
                              key={item.id}
                              item={item}
                              onToggle={handleToggleRoutine}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
      </div>

      {/* 设置模态框 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={notificationSettings}
        onSettingsChange={handleSettingsChange}
        onImportData={handleImportData}
        onClearData={handleClearAllData}
      />

      {/* 通知Alert */}
      {notificationAlert.routine && (
        <NotificationAlert
          isOpen={notificationAlert.isOpen}
          onClose={handleNotificationClose}
          routine={notificationAlert.routine}
          onStart={handleNotificationStart}
          onSnooze={handleNotificationSnooze}
          defaultSnooze={notificationSettings.defaultSnooze}
        />
      )}
    </div>
  );
};

export default App;
