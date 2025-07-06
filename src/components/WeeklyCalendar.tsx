import React, { useRef, useEffect, useMemo } from "react";
import { WeeklyEvent, EventTemplate } from "../types";
import { formatDateDisplay, getDayOfWeek } from "../utils/weeklyUtils";
import "./WeeklyCalendar.css";

interface WeeklyCalendarProps {
  events: WeeklyEvent[];
  onEventAdd: (event: WeeklyEvent) => void;
  onEventDelete: (eventId: string) => void;
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  events,
  onEventAdd,
  onEventDelete,
  currentWeekStart,
  onWeekChange,
}) => {
  // 生成当前周的日期数组
  const weekDates = useMemo(() => {
    const dates: string[] = [];
    const startDate = new Date(currentWeekStart);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    onWeekChange(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    onWeekChange(newWeekStart);
  };

  const formatWeekRange = () => {
    const startDate = new Date(currentWeekStart);
    const endDate = new Date(currentWeekStart);
    endDate.setDate(startDate.getDate() + 6);

    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth}月${startDay}日 - ${endDay}日`;
    } else {
      return `${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");
  };

  // 判断事件是否覆盖当前时间格
  const isEventInSlot = (event: WeeklyEvent, slotTime: string) => {
    const start = new Date(`2000-01-01T${event.startTime}`);
    const end = new Date(`2000-01-01T${event.endTime}`);
    const slot = new Date(`2000-01-01T${slotTime}`);
    return slot >= start && slot < end;
  };

  const handleDrop = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");

    try {
      const templateData = e.dataTransfer.getData("text/plain");

      if (!templateData) {
        console.log("No template data found");
        return;
      }

      const draggedTemplate: EventTemplate = JSON.parse(templateData);

      if (!draggedTemplate) {
        console.log("Failed to parse dragged template");
        return;
      }

      console.log(
        "Dropping template:",
        draggedTemplate,
        "on date:",
        date,
        "time:",
        time
      );

      const [hours, minutes] = time.split(":").map(Number);
      const startTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      const endHours = hours + draggedTemplate.duration;
      const endTime = `${endHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      // 检查是否有任何重叠
      const newStart = new Date(`2000-01-01T${startTime}`);
      const newEnd = new Date(`2000-01-01T${endTime}`);
      const hasOverlap = events.some((ev) => {
        if (ev.date !== date) return false;
        const evStart = new Date(`2000-01-01T${ev.startTime}`);
        const evEnd = new Date(`2000-01-01T${ev.endTime}`);
        return newStart < evEnd && newEnd > evStart;
      });
      if (hasOverlap) {
        alert("已经有事件了");
        return;
      }

      const newEvent: WeeklyEvent = {
        id: `${Date.now()}-${Math.random()}`,
        templateId: draggedTemplate.id,
        date,
        startTime,
        endTime,
        title: draggedTemplate.title,
        color: draggedTemplate.color,
        category: draggedTemplate.category,
      };

      console.log("Creating new event:", newEvent);
      onEventAdd(newEvent);
    } catch (error) {
      console.error("Error parsing dragged template:", error);
    }
  };

  const calendarBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 每小时一行，每行35px，8点是第8行
    if (calendarBodyRef.current) {
      calendarBodyRef.current.scrollTop = 8 * 35;
    }
  }, []);

  return (
    <div className="weekly-calendar">
      <div className="calendar-week-navigation">
        <button
          className="week-nav-btn prev-week"
          onClick={handlePreviousWeek}
          title="上一周"
        >
          ‹
        </button>
        <div className="week-range-display">{formatWeekRange()}</div>
        <button
          className="week-nav-btn next-week"
          onClick={handleNextWeek}
          title="下一周"
        >
          ›
        </button>
      </div>

      <div className="calendar-header">
        <div className="time-column-header">时间</div>
        {weekDates.map((date) => (
          <div key={date} className="day-header">
            <div className="date-display">{formatDateDisplay(date)}</div>
            <div className="day-display">{getDayOfWeek(date)}</div>
          </div>
        ))}
      </div>

      <div className="calendar-body" ref={calendarBodyRef}>
        {Array.from({ length: 24 }, (_, i) => {
          const time = `${i.toString().padStart(2, "0")}:00`;
          const displayTime = i === 0 ? "" : time;
          return (
            <div key={time} className="time-slot">
              <div className="time-column">
                <span className="time-label">{displayTime}</span>
              </div>
              {weekDates.map((date) => {
                // 该格子所有覆盖的事件
                const slotEvents = events.filter(
                  (event) => event.date === date && isEventInSlot(event, time)
                );
                return (
                  <div
                    key={`${date}-${time}`}
                    className="calendar-cell"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, date, time)}
                  >
                    {slotEvents.map((event) => {
                      return (
                        <div
                          key={event.id}
                          className="calendar-event"
                          style={{
                            backgroundColor: event.color,
                          }}
                        >
                          <span className="event-title">{event.title}</span>
                          <button
                            className="delete-event-btn"
                            onClick={() => onEventDelete(event.id)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
