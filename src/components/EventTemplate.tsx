import React, { useState } from "react";
import { EventTemplate as EventTemplateType } from "../types";
import "./EventTemplate.css";

interface EventTemplateProps {
  template: EventTemplateType;
  onDragStart: (e: React.DragEvent, template: EventTemplateType) => void;
  onDelete: (templateId: string) => void;
  onUpdate: (templateId: string, updatedTemplate: EventTemplateType) => void;
}

const EventTemplate: React.FC<EventTemplateProps> = ({
  template,
  onDragStart,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: template.title,
    duration: template.duration,
    category: template.category,
    priority: template.priority || ("medium" as "low" | "medium" | "high"),
  });

  const handleDragStart = (e: React.DragEvent) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
    onDragStart(e, template);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTemplate: EventTemplateType = {
      ...template,
      ...editData,
      color: getColorByPriority(editData.priority),
    };
    onUpdate(template.id, updatedTemplate);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditData({
      title: template.title,
      duration: template.duration,
      category: template.category,
      priority: template.priority || "medium",
    });
    setIsEditing(false);
  };

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

  if (isEditing) {
    return (
      <div
        className="event-template editing"
        style={{ borderLeftColor: getColorByPriority(editData.priority) }}
      >
        <div className="edit-form">
          <div className="form-field">
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              placeholder="事件标题"
              className="edit-input"
            />
          </div>
          <div className="form-field">
            <input
              type="number"
              value={editData.duration}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  duration: parseFloat(e.target.value),
                })
              }
              min="0.5"
              step="0.5"
              placeholder="时长"
              className="edit-input"
            />
          </div>
          <div className="form-field">
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              className="edit-select"
            >
              <option value="学习">📚 学习</option>
              <option value="工作">💼 工作</option>
              <option value="健康">🏃 健康</option>
              <option value="生活">🏠 生活</option>
            </select>
          </div>
          <div className="form-field">
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
              className="edit-select"
            >
              <option value="low">🟢 低</option>
              <option value="medium">🟡 中</option>
              <option value="high">🔴 高</option>
            </select>
          </div>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn" title="保存">
              ✓
            </button>
            <button onClick={handleCancel} className="cancel-btn" title="取消">
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="event-template"
      draggable
      onDragStart={handleDragStart}
      style={{ borderLeftColor: template.color }}
    >
      <div className="template-header">
        <h3 className="template-title">{template.title}</h3>
        <div className="template-actions">
          <span className="template-duration">{template.duration}h</span>
          <button
            className="delete-template-btn"
            onClick={handleDelete}
            title="删除模板"
          >
            ×
          </button>
        </div>
      </div>
      <p className="template-description">{template.title}</p>
      <div className="template-category">{template.category}</div>
      <div className="template-edit-action">
        <button
          className="edit-template-btn"
          onClick={handleEdit}
          title="编辑模板"
        >
          ✎
        </button>
      </div>
    </div>
  );
};

export default EventTemplate;
