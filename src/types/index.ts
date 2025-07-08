export interface RoutineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  endTime: string; // 添加结束时间
  completed: boolean;
  category: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface RoutineCategory {
  name: string;
  items: RoutineItem[];
  color: string;
}

// 新的事件模板类型
export interface EventTemplate {
  id: string;
  title: string;
  duration: number; // 小时数
  color: string;
  category: string;
  priority?: 'low' | 'medium' | 'high'; // 紧急程度
}

// 周历事件类型 - 更新为使用具体日期
export interface WeeklyEvent {
  id: string;
  templateId: string;
  date: string; // YYYY-MM-DD 格式
  startTime: string; // HH:MM 格式
  endTime: string; // HH:MM 格式
  title: string;
  color: string;
  category: string;
}

// 时间槽类型
export interface TimeSlot {
  date: string;
  time: string;
  events: WeeklyEvent[];
}

// 通知设置类型
export interface NotificationSettings {
  enabled: boolean;
  defaultSnooze: number; // 分钟数
  notificationStyle: 'banner' | 'alert'; // 通知样式：横幅或提醒
}

// 应用状态类型
export interface AppState {
  currentView: 'weekly' | 'daily';
  weeklyEvents: WeeklyEvent[];
  dailyRoutines: RoutineItem[];
  notificationSettings: NotificationSettings;
} 