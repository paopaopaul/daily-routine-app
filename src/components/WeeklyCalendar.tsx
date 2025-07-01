import React, { useState } from "react";
import { WeeklyEvent, EventTemplate } from "../types";
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
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const timeSlots = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("drag-over");
    console.log("Drag over:", e.currentTarget);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag enter:", e.currentTarget);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");
    console.log("Drag leave:", e.currentTarget);
  };

  const handleDrop = (e: React.DragEvent, day: number, time: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");

    console.log("Drop event triggered:", { day, time });

    try {
      const templateData = e.dataTransfer.getData("text/plain");
      console.log("Template data:", templateData);

      if (!templateData) {
        console.log("No template data found in dataTransfer");
        return;
      }

      const draggedTemplate: EventTemplate = JSON.parse(templateData);
      console.log("Parsed template:", draggedTemplate);

      if (!draggedTemplate) {
        console.log("No template data found");
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
        day,
        startTime,
        endTime,
        title: draggedTemplate.title,
        description: draggedTemplate.description,
        color: draggedTemplate.color,
        category: draggedTemplate.category,
      };

      console.log("Creating new event:", newEvent);
      onEventAdd(newEvent);
    } catch (error) {
      console.error("Error parsing dragged template:", error);
    }
  };

  const getEventsForSlot = (day: number, time: string) => {
    return events.filter(
      (event) => event.day === day && event.startTime === time
    );
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <div className="time-column-header">时间</div>
        {days.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-body">
        {timeSlots.map((time) => (
          <div key={time} className="time-row">
            <div className="time-slot">{time}</div>
            {days.map((_, dayIndex) => {
              const slotEvents = getEventsForSlot(dayIndex, time);
              return (
                <div
                  key={`${dayIndex}-${time}`}
                  className="calendar-cell"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dayIndex, time)}
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
