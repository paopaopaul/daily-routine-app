import React from "react";
import { EventTemplate as EventTemplateType } from "../types";
import "./EventTemplate.css";

interface EventTemplateProps {
  template: EventTemplateType;
  onDragStart: (e: React.DragEvent, template: EventTemplateType) => void;
}

const EventTemplate: React.FC<EventTemplateProps> = ({
  template,
  onDragStart,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log("EventTemplate drag start triggered:", template);
    onDragStart(e, template);
  };

  return (
    <div
      className="event-template"
      draggable
      onDragStart={handleDragStart}
      style={{ borderLeftColor: template.color }}
    >
      <div className="template-header">
        <h3 className="template-title">{template.title}</h3>
        <span className="template-duration">{template.duration}h</span>
      </div>
      <p className="template-description">{template.description}</p>
      <div className="template-category">{template.category}</div>
    </div>
  );
};

export default EventTemplate;
