export interface RoutineItem {
  id: string;
  title: string;
  description: string;
  time: string;
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
  description: string;
  duration: number; // 小时数
  color: string;
  category: string;
}

// 周历事件类型
export interface WeeklyEvent {
  id: string;
  templateId: string;
  day: number; // 0-6 (周日-周六)
  startTime: string; // HH:MM 格式
  endTime: string; // HH:MM 格式
  title: string;
  description: string;
  color: string;
  category: string;
}

// 时间槽类型
export interface TimeSlot {
  day: number;
  time: string;
  events: WeeklyEvent[];
}

// 应用状态类型
export interface AppState {
  currentView: 'weekly' | 'daily';
  weeklyEvents: WeeklyEvent[];
  dailyRoutines: RoutineItem[];
} 