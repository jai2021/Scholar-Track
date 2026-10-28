export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'assignment' | 'exam' | 'event' | 'reading' | 'project' | 'lab';

export interface Course {
  id: string;
  code: string;       // e.g. "CS 101"
  name: string;       // e.g. "Data Structures & Algorithms"
  color: string;      // Accent theme color
  bgColor?: string;   // Soft badge background (optional, can be derived)
  borderColor?: string;// Subtle border (optional, can be derived)
  instructor?: string;// e.g. "Dr. Aris Vance"
  schedule?: string;  // e.g. "MWF 10:00 - 11:15 AM"
  term?: string;      // e.g. "Fall 2026"
}

export interface Task {
  id: string;
  title: string;
  courseId?: string;        // Optional: tasks can be unassigned
  dueDate: string;          // YYYY-MM-DD
  dueTime?: string;         // e.g. "11:59 PM"
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  estimatedMinutes?: number;
  notes?: string;
  createdDate: string;
}

export type NavTab = 'dashboard' | 'tasks' | 'courses' | 'calendar' | 'notes' | 'profile' | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  name: string;
  email?: string;
  school?: string;
  major?: string;
  year?: string;
}

export interface QuickStats {
  dueTodayCount: number;
  upcomingCount: number;
  activeCoursesCount: number;
  completedTodayCount: number;
}

