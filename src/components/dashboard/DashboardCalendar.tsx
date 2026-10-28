import React, { useState, useMemo } from 'react';
import type { Task, Course } from '../../types/planner';
import { CourseBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { formatDateToYYYYMMDD } from '../../utils/dateTime';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon
} from '../common/Icons';

interface DashboardCalendarProps {
  tasks: Task[];
  courses: Course[];
  todayDateStr?: string; // e.g. "2026-10-25"
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAddTaskForDate: (dateStr: string) => void;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  tasks,
  courses,
  todayDateStr = formatDateToYYYYMMDD(),
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTaskForDate
}) => {
  // Parse initial year and month from device todayDateStr
  const initialDate = useMemo(() => {
    const parts = todayDateStr.split('-').map(Number);
    return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
  }, [todayDateStr]);

  const [currentYear, setCurrentYear] = useState<number>(() => initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => initialDate.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayDateStr);

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((c) => map.set(c.id, c));
    return map;
  }, [courses]);

  // Group tasks by dueDate (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const list = map.get(task.dueDate) || [];
      list.push(task);
      map.set(task.dueDate, list);
    });
    return map;
  }, [tasks]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(formatDateToYYYYMMDD(today));
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Monday as 0, Sunday as 6
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      tasks: Task[];
    }[] = [];

    // Leading days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const monthStr = String(prevMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${prevYear}-${monthStr}-${dayStr}`;

      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayDateStr,
        tasks: tasksByDate.get(dateStr) || []
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayDateStr,
        tasks: tasksByDate.get(dateStr) || []
      });
    }

    // Trailing days for next month
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const monthStr = String(nextMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${nextYear}-${monthStr}-${dayStr}`;

      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayDateStr,
        tasks: tasksByDate.get(dateStr) || []
      });
    }

    return days;
  }, [currentYear, currentMonth, todayDateStr, tasksByDate]);

  const selectedDateTasks = useMemo(() => {
    return tasksByDate.get(selectedDateStr) || [];
  }, [tasksByDate, selectedDateStr]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const selectedDateLabel = useMemo(() => {
    if (!selectedDateStr) return '';
    try {
      const parts = selectedDateStr.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr]);

  return (
    <section className="neo-card calendar-card" aria-labelledby="dashboard-calendar-heading">
      {/* Top Header Bar */}
      <div className="calendar-header-bar">
        <div className="calendar-title-group">
          <div className="neo-badge neo-badge-event calendar-badge">
            <CalendarIcon size={16} />
          </div>
          <h2 id="dashboard-calendar-heading" className="calendar-month-title">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="calendar-nav-buttons">
          <button
            className="neo-btn neo-btn-secondary today-jump-btn"
            onClick={handleJumpToToday}
            type="button"
            title="Jump to today's date"
          >
            Today
          </button>
          <button
            className="neo-icon-btn"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            type="button"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            className="neo-icon-btn"
            onClick={handleNextMonth}
            aria-label="Next Month"
            type="button"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-layout-row">
        {/* Month Calendar Grid */}
        <div className="calendar-month-pane">
          <div className="calendar-weekdays-row" aria-hidden="true">
            {weekdayNames.map((day) => (
              <div key={day} className="calendar-weekday-cell">{day}</div>
            ))}
          </div>

          <div className="calendar-days-grid" role="grid" aria-label="Monthly academic calendar">
            {calendarDays.map((dayItem) => {
              const isSelected = dayItem.dateStr === selectedDateStr;
              return (
                <button
                  key={dayItem.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(dayItem.dateStr)}
                  className={`calendar-day-btn ${!dayItem.isCurrentMonth ? 'other-month' : ''} ${dayItem.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  aria-label={`${dayItem.dateStr}: ${dayItem.tasks.length} tasks scheduled`}
                  aria-pressed={isSelected}
                >
                  <div className="day-btn-top">
                    <span className="day-number">{dayItem.dayNumber}</span>
                    {dayItem.isToday && <span className="today-micro-tag">TODAY</span>}
                  </div>

                  {/* Task Indicator Dots */}
                  <div className="calendar-dots-row">
                    {dayItem.tasks.slice(0, 3).map((task) => {
                      const course = task.courseId ? courseMap.get(task.courseId) : undefined;
                      const dotColor = course ? course.color : '#000000';
                      return (
                        <span
                          key={task.id}
                          className="calendar-dot"
                          style={{ backgroundColor: dotColor }}
                          title={task.title}
                        />
                      );
                    })}
                    {dayItem.tasks.length > 3 && (
                      <span className="calendar-dot-more">
                        +{dayItem.tasks.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Agenda Pane */}
        <div className="calendar-agenda-pane">
          <div className="calendar-agenda-header">
            <div>
              <span className="agenda-context-tag">
                {selectedDateStr === todayDateStr ? "TODAY'S SCHEDULE" : 'SELECTED DATE'}
              </span>
              <h3 className="calendar-agenda-title">{selectedDateLabel}</h3>
            </div>
            <button
              className="neo-btn neo-btn-primary neo-btn-sm"
              onClick={() => onAddTaskForDate(selectedDateStr)}
              type="button"
              title={`Add event or task for ${selectedDateStr}`}
            >
              <PlusIcon size={14} />
              <span>Add</span>
            </button>
          </div>

          <div className="calendar-agenda-list">
            {selectedDateTasks.length === 0 ? (
              <div className="neo-empty-state">
                <ClockIcon size={28} />
                <p className="empty-title">No events or tasks</p>
                <p className="empty-sub">Nothing scheduled for this date.</p>
                <button
                  className="neo-btn neo-btn-secondary neo-btn-sm"
                  onClick={() => onAddTaskForDate(selectedDateStr)}
                  type="button"
                >
                  <PlusIcon size={14} />
                  <span>Schedule Event / Task</span>
                </button>
              </div>
            ) : (
              selectedDateTasks.map((task) => {
                const course = task.courseId ? courseMap.get(task.courseId) : undefined;
                return (
                  <div
                    key={task.id}
                    className={`neo-item-card ${task.completed ? 'completed' : ''}`}
                  >
                    <button
                      type="button"
                      className={`neo-checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Mark "${task.title}" as complete`}
                    >
                      {task.completed && <CheckIcon size={13} color="#000000" />}
                    </button>

                    <div className="item-content">
                      <div className="item-title-row">
                        <span className="item-title">{task.title}</span>
                      </div>

                      <div className="item-badges-row">
                        <CategoryBadge category={task.category} />
                        <PriorityBadge priority={task.priority} />
                        {course && <CourseBadge course={course} />}
                        {task.dueTime && (
                          <span className="meta-time-chip">
                            <ClockIcon size={12} />
                            <span>{task.dueTime}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="neo-icon-btn edit-btn"
                        onClick={() => onEditTask(task)}
                        title="Edit"
                        aria-label={`Edit ${task.title}`}
                        type="button"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        className="neo-icon-btn delete-btn"
                        onClick={() => onDeleteTask(task)}
                        title="Delete Event"
                        aria-label={`Delete ${task.title}`}
                        type="button"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
