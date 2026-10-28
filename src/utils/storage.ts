import type { Task, Course, UserProfile, ThemeMode } from '../types/planner';

const STORAGE_KEYS = {
  TASKS: 'scholartrack_tasks_v2',
  COURSES: 'scholartrack_courses_v2',
  PROFILE: 'scholartrack_profile_v2',
  THEME: 'scholartrack_theme_v2'
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Jai',
  email: '',
  school: 'University',
  major: 'Computer Science',
  year: '2nd Year (Sophomore)'
};

function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}":`, error);
    return fallback;
  }
}

/**
 * Loads tasks from storage. Starts completely clean without dummy items.
 * Cleans out any legacy sample tasks from previous versions.
 */
export function loadStoredTasks(): Task[] {
  // Check new key first
  const stored = safeJsonParse<Task[] | null>(STORAGE_KEYS.TASKS, null);

  if (stored && Array.isArray(stored)) {
    // Filter out any legacy dummy tasks
    return stored.filter(
      (t) =>
        !t.id.startsWith('sample-') &&
        !['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7', 'task-8'].includes(t.id)
    );
  }

  // Clear legacy v1 if present
  try {
    localStorage.removeItem('scholartrack_tasks_v1');
    localStorage.removeItem('scholartrack_datesync_v2');
  } catch {}

  return [];
}

export function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

/**
 * Loads courses from storage. Starts completely clean without dummy courses.
 */
export function loadStoredCourses(): Course[] {
  const stored = safeJsonParse<Course[] | null>(STORAGE_KEYS.COURSES, null);

  if (stored && Array.isArray(stored)) {
    // Filter out legacy dummy courses
    return stored.filter(
      (c) =>
        !['course-cs101', 'course-math204', 'course-phys210', 'course-eng105'].includes(c.id)
    );
  }

  try {
    localStorage.removeItem('scholartrack_courses_v1');
  } catch {}

  return [];
}

export function saveStoredCourses(courses: Course[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (error) {
    console.error('Failed to save courses to localStorage:', error);
  }
}

/**
 * Loads student profile from storage.
 */
export function loadStoredProfile(): UserProfile {
  const stored = safeJsonParse<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
  if (!stored) {
    // Check v1
    const v1 = safeJsonParse<UserProfile | null>('scholartrack_profile_v1', null);
    if (v1 && v1.name) {
      const fixedProfile: UserProfile = {
        name: v1.name,
        email: v1.email || '',
        school: v1.school || 'University',
        major: v1.major || 'Computer Science',
        year: v1.year && v1.year.includes('Year 2') ? '2nd Year (Sophomore)' : (v1.year || '2nd Year (Sophomore)')
      };
      saveStoredProfile(fixedProfile);
      return fixedProfile;
    }
    return DEFAULT_PROFILE;
  }

  // Normalize legacy year string if needed
  if (stored.year === 'Year 2 • Undergraduate') {
    stored.year = '2nd Year (Sophomore)';
    saveStoredProfile(stored);
  }

  return stored;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
  }
}

/**
 * Theme preference management
 */
export function loadStoredTheme(): ThemeMode {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
  if (theme === 'dark' || theme === 'light' || theme === 'system') {
    return theme;
  }
  return 'light';
}

export function saveStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    applyThemeToDocument(theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}

/**
 * Applies data-theme attribute on document root for full CSS styling
 */
export function applyThemeToDocument(theme: ThemeMode): void {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    root.setAttribute('data-color-scheme', 'system');
  } else {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-color-scheme', theme);
  }
}

/**
 * Resets all stored user data
 */
export function clearAllStoredData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
