import { RoutineItem, RoutineCategory } from '../types';

export const defaultRoutines: RoutineItem[] = [
  // 早晨例行程序
  {
    id: '1',
    title: '起床',
    description: '设定闹钟，慢慢起床，不要赖床',
    time: '07:00',
    completed: false,
    category: 'morning'
  },
  {
    id: '2',
    title: '喝水',
    description: '起床后立即喝一杯温水，补充水分',
    time: '07:05',
    completed: false,
    category: 'morning'
  },
  {
    id: '3',
    title: '晨练',
    description: '进行15-20分钟的轻度运动，如散步或瑜伽',
    time: '07:15',
    completed: false,
    category: 'morning'
  },
  {
    id: '4',
    title: '早餐',
    description: '吃营养丰富的早餐，包含蛋白质和纤维',
    time: '07:45',
    completed: false,
    category: 'morning'
  },
  {
    id: '5',
    title: '整理房间',
    description: '整理床铺，收拾房间，保持整洁',
    time: '08:00',
    completed: false,
    category: 'morning'
  },

  // 下午例行程序
  {
    id: '6',
    title: '午餐',
    description: '吃健康的午餐，注意营养搭配',
    time: '12:00',
    completed: false,
    category: 'afternoon'
  },
  {
    id: '7',
    title: '午休',
    description: '短暂休息15-20分钟，恢复精力',
    time: '12:30',
    completed: false,
    category: 'afternoon'
  },
  {
    id: '8',
    title: '喝水',
    description: '下午补充水分，保持身体水分充足',
    time: '15:00',
    completed: false,
    category: 'afternoon'
  },
  {
    id: '9',
    title: '伸展运动',
    description: '进行简单的伸展运动，缓解久坐疲劳',
    time: '16:00',
    completed: false,
    category: 'afternoon'
  },

  // 晚上例行程序
  {
    id: '10',
    title: '晚餐',
    description: '吃清淡的晚餐，避免过饱',
    time: '18:30',
    completed: false,
    category: 'evening'
  },
  {
    id: '11',
    title: '散步',
    description: '饭后散步20-30分钟，帮助消化',
    time: '19:00',
    completed: false,
    category: 'evening'
  },
  {
    id: '12',
    title: '阅读',
    description: '阅读30分钟，放松心情',
    time: '20:00',
    completed: false,
    category: 'evening'
  },
  {
    id: '13',
    title: '整理明天计划',
    description: '回顾今天，规划明天的任务',
    time: '21:00',
    completed: false,
    category: 'evening'
  },

  // 夜间例行程序
  {
    id: '14',
    title: '洗漱',
    description: '刷牙洗脸，准备睡觉',
    time: '21:30',
    completed: false,
    category: 'night'
  },
  {
    id: '15',
    title: '冥想',
    description: '进行10分钟的冥想，放松身心',
    time: '21:45',
    completed: false,
    category: 'night'
  },
  {
    id: '16',
    title: '睡觉',
    description: '设定睡眠时间，保证充足睡眠',
    time: '22:00',
    completed: false,
    category: 'night'
  }
];

export const getRoutineCategories = (routines: RoutineItem[]): RoutineCategory[] => {
  const categories = [
    { name: '早晨', color: '#FF6B6B', key: 'morning' as const },
    { name: '下午', color: '#4ECDC4', key: 'afternoon' as const },
    { name: '晚上', color: '#45B7D1', key: 'evening' as const },
    { name: '夜间', color: '#96CEB4', key: 'night' as const }
  ];

  return categories.map(category => ({
    name: category.name,
    color: category.color,
    items: routines.filter(routine => routine.category === category.key)
  }));
}; 