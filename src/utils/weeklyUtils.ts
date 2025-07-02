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
  if (hour >= 0 && hour < 12) return 'morning';   // 凌晨0点到早上12点：早晨
  if (hour >= 12 && hour < 18) return 'afternoon'; // 中午12点到下午6点：下午
  if (hour >= 18 && hour < 22) return 'evening';   // 下午6点到晚上10点：晚上
  return 'night'; // 晚上10点到凌晨0点：夜间
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
  // 本地时间的0点
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay(); // 0-6 (周日-周六)
  // 本地本周日
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

// 格式化日期显示
export const formatDateDisplay = (dateString: string): string => {
  // 解析日期字符串，确保使用本地时间
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // 月份要减1，因为JavaScript月份从0开始
  const displayMonth = date.getMonth() + 1;
  const displayDay = date.getDate();
  return `${displayMonth}/${displayDay}`;
};

// 获取日期对应的星期
export const getDayOfWeek = (dateString: string): string => {
  // 解析日期字符串，确保使用本地时间
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // 月份要减1，因为JavaScript月份从0开始
  
  // JavaScript getDay() 返回 0-6 (周日-周六)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayIndex = date.getDay();
  return days[dayIndex];
}; 