import { WeeklyEvent, EventTemplate } from '../types';

// 生成重复事件
export const generateRepeatingEvents = (
  template: EventTemplate,
  days: number[], // 0-6 (周日-周六)
  startTime: string,
  endTime: string
): WeeklyEvent[] => {
  return days.map(day => ({
    id: `${template.id}-${day}-${Date.now()}`,
    templateId: template.id,
    day,
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