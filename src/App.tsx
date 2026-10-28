import React, { useState, useMemo, useEffect } from 'react';
import type { NavTab, Task, Course, QuickStats, UserProfile, ThemeMode } from './types/planner';
import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredCourses,
  saveStoredCourses,
  loadStoredProfile,
  saveStoredProfile,
  loadStoredTheme,
  saveStoredTheme,
  applyThemeToDocument,
  clearAllStoredData
} from './utils/storage';
import { useCurrentDateTime, formatDateToYYYYMMDD } from './utils/dateTime';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { DashboardCalendar } from './components/dashboard/DashboardCalendar';
import { TodaySection } from './components/dashboard/TodaySection';
import { UpcomingSection } from './components/dashboard/UpcomingSection';
import { TaskModal } from './components/tasks/TaskModal';
import { CourseModal } from './components/courses/CourseModal';
import { CoursesView } from './components/courses/CoursesView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { NotesView } from './components/notes/NotesView';
import { ConfirmModal } from './components/common/ConfirmModal';
import { CourseBadge, PriorityBadge, CategoryBadge } from './components/common/Badge';
import {
  CheckSquareIcon,
  PlusIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  CheckIcon
} from './components/common/Icons';

export const App: React.FC = () => {
  // Live synchronized with user device operating system clock
  const liveDateTime = useCurrentDateTime();
  const CURRENT_DATE = liveDateTime.currentDateStr;

  // Persistent State (Zero Dummy Data by default)
  const [courses, setCourses] = useState<Course[]>(() => loadStoredCourses());
  const [tasks, setTasks] = useState<Task[]>(() => loadStoredTasks());
  const [profile, setProfile] = useState<UserProfile>(() => loadStoredProfile());
  const [theme, setTheme] = useState<ThemeMode>(() => loadStoredTheme());

  // UI state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskDefaultDate, setTaskDefaultDate] = useState<string>(() => formatDateToYYYYMMDD());

  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Apply theme on mount and when changed
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Handle system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyThemeToDocument('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Real-time task updater
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveStoredTasks(newTasks);
  };

  // Real-time course updater
  const updateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    saveStoredCourses(newCourses);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateTasks(updated);
  };

  // Save Task / Event (Create or Edit)
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdDate'>,
    taskId?: string
  ) => {
    if (taskId) {
      // Edit
      const updated = tasks.map((t) =>
        t.id === taskId ? { ...t, ...taskData } : t
      );
      updateTasks(updated);
      showToast('Updated successfully!');
    } else {
      // Create new
      const newId = `task-${Date.now()}`;
      const newTask: Task = {
        ...taskData,
        id: newId,
        createdDate: CURRENT_DATE
      };
      updateTasks([newTask, ...tasks]);
      setRecentlyAddedId(newId);
      setTimeout(() => setRecentlyAddedId(null), 2500);
      showToast('New event / task added!');
    }
  };

  // Open modal to create task / event
  const handleOpenAddTask = (dateStr?: string) => {
    setTaskToEdit(null);
    setTaskDefaultDate(dateStr || CURRENT_DATE);
    setIsTaskModalOpen(true);
  };

  // Open modal to edit task
  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskDefaultDate(task.dueDate);
    setIsTaskModalOpen(true);
  };

  // Prompt delete task / event
  const handlePromptDeleteTask = (task: Task) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Item?',
      message: `Are you sure you want to delete "${task.title}"? This cannot be undone.`,
      confirmLabel: 'Delete Item',
      onConfirm: () => {
        const updated = tasks.filter((t) => t.id !== task.id);
        updateTasks(updated);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Item deleted.');
      }
    });
  };

  // Save Course
  const handleSaveCourse = (
    courseData: Omit<Course, 'id'>,
    courseId?: string
  ) => {
    if (courseId) {
      const updated = courses.map((c) =>
        c.id === courseId ? { ...c, ...courseData } : c
      );
      updateCourses(updated);
      showToast('Course updated!');
    } else {
      const newCourse: Course = {
        ...courseData,
        id: `course-${Date.now()}`
      };
      updateCourses([...courses, newCourse]);
      showToast('Course enrolled!');
    }
  };

  const handleOpenAddCourse = () => {
    setCourseToEdit(null);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setIsCourseModalOpen(true);
  };

  // Delete Course
  const handlePromptDeleteCourse = (course: Course) => {
    const affectedTasks = tasks.filter((t) => t.courseId === course.id);
    const count = affectedTasks.length;

    setConfirmDialog({
      isOpen: true,
      title: `Delete Course ${course.code}?`,
      message:
        count > 0
          ? `Are you sure you want to delete "${course.code}: ${course.name}"? ${count} ${count === 1 ? 'item is' : 'items are'} linked to this course and will become general unassigned items.`
          : `Are you sure you want to delete "${course.code}: ${course.name}"?`,
      confirmLabel: 'Delete Course',
      onConfirm: () => {
        const newCourses = courses.filter((c) => c.id !== course.id);
        updateCourses(newCourses);
        const newTasks = tasks.map((t) =>
          t.courseId === course.id ? { ...t, courseId: undefined } : t
        );
        updateTasks(newTasks);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Course deleted.');
      }
    });
  };

  // Save Profile
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    showToast('Profile saved!');
  };

  // Switch Theme
  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveStoredTheme(newTheme);
  };

  const handleToggleThemeQuick = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    handleSelectTheme(nextTheme);
  };

  // Clear all data (Clean slate)
  const handleClearAllData = () => {
    clearAllStoredData();
    setTasks([]);
    setCourses([]);
    showToast('All local data cleared.');
  };

  // Overdue items
  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate < CURRENT_DATE && !t.completed);
  }, [tasks, CURRENT_DATE]);

  // Today items
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === CURRENT_DATE);
  }, [tasks, CURRENT_DATE]);

  // Upcoming items
  const upcomingTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate > CURRENT_DATE);
  }, [tasks, CURRENT_DATE]);

  // Summary statistics
  const stats: QuickStats = useMemo(() => {
    const pendingToday = todayTasks.filter((t) => !t.completed).length;
    const completedToday = todayTasks.filter((t) => t.completed).length;
    const pendingUpcoming = upcomingTasks.filter((t) => !t.completed).length;

    return {
      dueTodayCount: pendingToday,
      completedTodayCount: completedToday,
      upcomingCount: pendingUpcoming,
      activeCoursesCount: courses.length
    };
  }, [todayTasks, upcomingTasks, courses]);

  // Filtered tasks for Tasks View
  const filteredAllTasks = useMemo(() => {
    if (taskFilter === 'pending') return tasks.filter((t) => !t.completed);
    if (taskFilter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, taskFilter]);

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="neo-toast" role="status" aria-live="polite">
          <CheckIcon size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        tasksDueTodayCount={stats.dueTodayCount}
        coursesCount={stats.activeCoursesCount}
        profile={profile}
      />

      {/* Main App Body */}
      <div className="app-main">
        {/* Top Header - Synchronized with Device System Clock */}
        <Topbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenAddTask={() => handleOpenAddTask()}
          currentTheme={theme}
          onToggleTheme={handleToggleThemeQuick}
          formattedDateFull={liveDateTime.formattedDateFull}
          formattedDateShort={liveDateTime.formattedDateShort}
          formattedTime={liveDateTime.formattedTime}
          timezone={liveDateTime.timezone}
        />

        {/* Dynamic Page Views */}
        <main className="page-content">
          {/* ========================================================
              DASHBOARD TAB VIEW
             ======================================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <WelcomeBanner
                userName={profile.name}
                userYear={profile.year}
                tasksDueTodayCount={stats.dueTodayCount}
                upcomingCount={stats.upcomingCount}
                academicTerm={liveDateTime.academicTerm}
                overdueCount={overdueTasks.length}
              />

              {/* Neo-brutalist Summary Cards */}
              <SummaryCards stats={stats} />

              {/* Monthly Dashboard Calendar */}
              <DashboardCalendar
                key={CURRENT_DATE}
                tasks={tasks}
                courses={courses}
                todayDateStr={CURRENT_DATE}
                onToggleTask={handleToggleTask}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handlePromptDeleteTask}
                onAddTaskForDate={(dateStr) => handleOpenAddTask(dateStr)}
              />

              {/* Split Sections: Today's Schedule & Upcoming Deadlines */}
              <div className="dashboard-sections-grid">
                <TodaySection
                  tasks={todayTasks}
                  overdueTasks={overdueTasks}
                  courses={courses}
                  onToggleTask={handleToggleTask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handlePromptDeleteTask}
                  onOpenAddTask={() => handleOpenAddTask()}
                />

                <UpcomingSection
                  tasks={upcomingTasks}
                  courses={courses}
                  todayDateStr={CURRENT_DATE}
                  onToggleTask={handleToggleTask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handlePromptDeleteTask}
                  onOpenAddTask={() => handleOpenAddTask()}
                />
              </div>
            </>
          )}

          {/* ========================================================
              TASKS & EVENTS TAB VIEW
             ======================================================== */}
          {activeTab === 'tasks' && (
            <div className="neo-card section-card">
              <div className="section-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 className="section-title">All Academic Tasks & Events</h2>
                  <p className="today-date-subhead">
                    Organize your assignments, tests, and campus events in one place.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className={`neo-btn neo-btn-sm ${taskFilter === 'all' ? 'neo-btn-primary' : 'neo-btn-secondary'}`}
                    onClick={() => setTaskFilter('all')}
                    type="button"
                  >
                    All ({tasks.length})
                  </button>
                  <button
                    className={`neo-btn neo-btn-sm ${taskFilter === 'pending' ? 'neo-btn-primary' : 'neo-btn-secondary'}`}
                    onClick={() => setTaskFilter('pending')}
                    type="button"
                  >
                    Pending ({tasks.filter((t) => !t.completed).length})
                  </button>
                  <button
                    className={`neo-btn neo-btn-sm ${taskFilter === 'completed' ? 'neo-btn-primary' : 'neo-btn-secondary'}`}
                    onClick={() => setTaskFilter('completed')}
                    type="button"
                  >
                    Completed ({tasks.filter((t) => t.completed).length})
                  </button>
                  <button
                    className="neo-btn neo-btn-primary neo-btn-sm"
                    onClick={() => handleOpenAddTask()}
                    type="button"
                  >
                    <PlusIcon size={14} />
                    <span>New Event / Task</span>
                  </button>
                </div>
              </div>

              <div className="section-card-body">
                {filteredAllTasks.length === 0 ? (
                  <div className="neo-empty-state">
                    <CheckSquareIcon size={32} />
                    <p className="empty-title">No tasks or events found</p>
                    <p className="empty-sub">Add your first assignment, exam, or study block.</p>
                    <button
                      className="neo-btn neo-btn-secondary neo-btn-sm"
                      onClick={() => handleOpenAddTask()}
                      type="button"
                    >
                      <PlusIcon size={14} />
                      <span>Create Event / Task</span>
                    </button>
                  </div>
                ) : (
                  <div className="task-list">
                    {filteredAllTasks.map((task) => {
                      const course = task.courseId ? courses.find((c) => c.id === task.courseId) : undefined;
                      const isRecentlyAdded = task.id === recentlyAddedId;

                      return (
                        <div
                          key={task.id}
                          className={`neo-item-card ${task.completed ? 'completed' : ''} ${isRecentlyAdded ? 'pop-in-event' : ''}`}
                        >
                          <button
                            type="button"
                            className={`neo-checkbox ${task.completed ? 'checked' : ''}`}
                            onClick={() => handleToggleTask(task.id)}
                            aria-label={`Toggle task completion`}
                          >
                            {task.completed && <CheckIcon size={13} color="#000000" />}
                          </button>

                          <div className="item-content">
                            <div className="item-title-row">
                              <span className="item-title">{task.title}</span>
                              <PriorityBadge priority={task.priority} />
                            </div>

                            <div className="item-badges-row">
                              <CategoryBadge category={task.category} />
                              <CourseBadge course={course} fallbackCode="General" />
                              <span className="meta-time-chip">
                                <ClockIcon size={12} />
                                <span>Due {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}</span>
                              </span>
                              {task.estimatedMinutes && (
                                <span className="meta-time-chip">
                                  ~{task.estimatedMinutes}m
                                </span>
                              )}
                            </div>
                            {task.notes && (
                              <p className="task-note-snippet">{task.notes}</p>
                            )}
                          </div>

                          <div className="item-actions">
                            <button
                              className="neo-icon-btn edit-btn"
                              onClick={() => handleOpenEditTask(task)}
                              title="Edit item"
                              aria-label={`Edit ${task.title}`}
                              type="button"
                            >
                              <EditIcon size={14} />
                            </button>
                            <button
                              className="neo-icon-btn delete-btn"
                              onClick={() => handlePromptDeleteTask(task)}
                              title="Delete item"
                              aria-label={`Delete ${task.title}`}
                              type="button"
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              COURSES TAB VIEW
             ======================================================== */}
          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              tasks={tasks}
              onOpenAddCourse={handleOpenAddCourse}
              onEditCourse={handleOpenEditCourse}
              onDeleteCourse={handlePromptDeleteCourse}
            />
          )}

          {/* ========================================================
              CALENDAR TAB VIEW
             ======================================================== */}
          {activeTab === 'calendar' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="section-title-large">Semester Academic Calendar</h2>
                <p className="section-subtitle">
                  Inspect assignments, exams, and class events across the semester.
                </p>
              </div>

              <DashboardCalendar
                key={`calendar-tab-${CURRENT_DATE}`}
                tasks={tasks}
                courses={courses}
                todayDateStr={CURRENT_DATE}
                onToggleTask={handleToggleTask}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handlePromptDeleteTask}
                onAddTaskForDate={(dateStr) => handleOpenAddTask(dateStr)}
              />
            </div>
          )}

          {/* ========================================================
              STUDY NOTES TAB VIEW
             ======================================================== */}
          {activeTab === 'notes' && (
            <NotesView courses={courses} />
          )}

          {/* ========================================================
              PROFILE TAB VIEW
             ======================================================== */}
          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {/* ========================================================
              SETTINGS TAB VIEW
             ======================================================== */}
          {activeTab === 'settings' && (
            <SettingsView
              currentTheme={theme}
              onSelectTheme={handleSelectTheme}
              tasksCount={tasks.length}
              coursesCount={courses.length}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>
      </div>

      {/* Task / Event Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        courses={courses}
        taskToEdit={taskToEdit}
        defaultDateStr={taskDefaultDate}
        onSaveTask={handleSaveTask}
      />

      {/* Course Create / Edit Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        courseToEdit={courseToEdit}
        onSaveCourse={handleSaveCourse}
      />

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default App;
