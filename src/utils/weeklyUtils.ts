import { WeeklyEvent, EventTemplate } from '../types';

// 生成重复事件 - 更新为使用具体日期
export const generateRepeatingEvents = (
  template: EventTemplate,
  dates: string[], // YYYY-MM-DD 格式的日期数组
  startTime: string,
  endTime: string
): WeeklyEvent[] => {
  return dates.map(date => ({
    id: `${template.id}-${date}-${Date.now()}`,
    templateId: template.id,
    date,
    startTime,
    endTime,
    title: template.title,
    description: template.description,
    color: template.color,
    category: template.category
  }));
};

// 根据时间获取分类
export const getCategoryFromTime = (time: string): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

// 格式化时间显示
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

// 计算事件持续时间（小时）
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

// 获取当前周的日期范围
export const getCurrentWeekDates = (): string[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0-6 (周日-周六)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay); // 设置为本周日

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD 格式
  }
  return dates;
};

// 格式化日期显示
export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// 获取日期对应的星期
export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
}; 