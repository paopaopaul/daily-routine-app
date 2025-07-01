import React from "react";
import { EventTemplate } from "../types";
import EventTemplateComponent from "./EventTemplate";
import "./EventPanel.css";

interface EventPanelProps {
  templates: EventTemplate[];
  onDragStart: (e: React.DragEvent, template: EventTemplate) => void;
}

const EventPanel: React.FC<EventPanelProps> = ({ templates, onDragStart }) => {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <div className="event-panel">
      <h2 className="panel-title">我的事件</h2>
      <p className="panel-subtitle">拖拽事件到周历中安排时间</p>

      <div className="event-categories">
        {categories.map((category) => {
          const categoryTemplates = templates.filter(
            (t) => t.category === category
          );
          return (
            <div key={category} className="event-category">
              <h3 className="category-title">{category}</h3>
              <div className="category-events">
                {categoryTemplates.map((template) => (
                  <EventTemplateComponent
                    key={template.id}
                    template={template}
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventPanel;
