import React from "react";
import { WeeklyEvent, EventTemplate } from "../types";
import {
  getCurrentWeekDates,
  formatDateDisplay,
  getDayOfWeek,
} from "../utils/weeklyUtils";
import "./WeeklyCalendar.css";

interface WeeklyCalendarProps {
  events: WeeklyEvent[];
  onEventAdd: (event: WeeklyEvent) => void;
  onEventDelete: (eventId: string) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  events,
  onEventAdd,
  onEventDelete,
}) => {
  const weekDates = getCurrentWeekDates();

  const timeSlots = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

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

  const handleDrop = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");

    try {
      const templateData = e.dataTransfer.getData("text/plain");

      if (!templateData) {
        return;
      }

      const draggedTemplate: EventTemplate = JSON.parse(templateData);

      if (!draggedTemplate) {
        return;
      }

      const [hours, minutes] = time.split(":").map(Number);
      const startTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      const endHours = hours + draggedTemplate.duration;
      const endTime = `${endHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      const newEvent: WeeklyEvent = {
        id: `${Date.now()}-${Math.random()}`,
        templateId: draggedTemplate.id,
        date,
        startTime,
        endTime,
        title: draggedTemplate.title,
        description: draggedTemplate.description,
        color: draggedTemplate.color,
        category: draggedTemplate.category,
      };

      onEventAdd(newEvent);
    } catch (error) {
      console.error("Error parsing dragged template:", error);
    }
  };

  const getEventsForSlot = (date: string, time: string) => {
    return events.filter(
      (event) => event.date === date && event.startTime === time
    );
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <div className="time-column-header">时间</div>
        {weekDates.map((date) => (
          <div key={date} className="day-header">
            <div className="date-display">{formatDateDisplay(date)}</div>
            <div className="day-display">{getDayOfWeek(date)}</div>
          </div>
        ))}
      </div>

      <div className="calendar-body">
        {timeSlots.map((time) => (
          <div key={time} className="time-row">
            <div className="time-slot">{time}</div>
            {weekDates.map((date) => {
              const slotEvents = getEventsForSlot(date, time);
              return (
                <div
                  key={`${date}-${time}`}
                  className="calendar-cell"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, date, time)}
                >
                  {slotEvents.map((event) => (
                    <div
                      key={event.id}
                      className="calendar-event"
                      style={{
                        backgroundColor: event.color,
                        height: `${Math.max(
                          30,
                          ((new Date(`2000-01-01T${event.endTime}`).getTime() -
                            new Date(
                              `2000-01-01T${event.startTime}`
                            ).getTime()) /
                            (1000 * 60 * 60)) *
                            30
                        )}px`,
                      }}
                    >
                      <div className="event-content">
                        <span className="event-title">{event.title}</span>
                        <button
                          className="delete-event-btn"
                          onClick={() => onEventDelete(event.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
