import { RoutineItem, RoutineCategory } from '../types';

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