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