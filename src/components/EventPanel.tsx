import React, { useState } from "react";
import { EventTemplate } from "../types";
import EventTemplateComponent from "./EventTemplate";
import "./EventPanel.css";

interface EventPanelProps {
  templates: EventTemplate[];
  onDragStart: (e: React.DragEvent, template: EventTemplate) => void;
  onAddTemplate: (template: EventTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onUpdateTemplate: (
    templateId: string,
    updatedTemplate: EventTemplate
  ) => void;
}

const EventPanel: React.FC<EventPanelProps> = ({
  templates,
  onDragStart,
  onAddTemplate,
  onDeleteTemplate,
  onUpdateTemplate,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    duration: 1,
    category: "学习",
    priority: "medium" as "low" | "medium" | "high",
  });

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  // 根据紧急程度获取颜色
  const getColorByPriority = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low":
        return "#4CAF50"; // 绿色
      case "medium":
        return "#FF9800"; // 橙色/黄色
      case "high":
        return "#F44336"; // 红色
      default:
        return "#FF9800";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTemplate: EventTemplate = {
      id: `custom-${Date.now()}`,
      ...formData,
      color: getColorByPriority(formData.priority),
    };
    onAddTemplate(newTemplate);
    setFormData({
      title: "",
      duration: 1,
      category: "学习",
      priority: "medium" as "low" | "medium" | "high",
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      title: "",
      duration: 1,
      category: "学习",
      priority: "medium" as "low" | "medium" | "high",
    });
  };

  return (
    <div className="event-panel">
      <div className="panel-header">
        <h2 className="panel-title">我的事件</h2>
        <button
          className="add-event-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "×" : "+"}
        </button>
      </div>
      <p className="panel-subtitle">拖拽事件到周历中安排时间</p>

      {showForm && (
        <form className="add-event-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-field-label">事件标题 *</label>
            <input
              type="text"
              placeholder="例如：学习编程"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">时长 *</label>
            <input
              type="number"
              placeholder="小时"
              min="0.5"
              step="0.5"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">类别</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="学习">📚 学习</option>
              <option value="工作">💼 工作</option>
              <option value="健康">🏃 健康</option>
              <option value="生活">🏠 生活</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-field-label">紧急程度</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
            >
              <option value="low">🟢 低</option>
              <option value="medium">🟡 中</option>
              <option value="high">🔴 高</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                添加事件
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                取消
              </button>
            </div>
          </div>
        </form>
      )}

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
                    onDelete={onDeleteTemplate}
                    onUpdate={onUpdateTemplate}
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
