import React from 'react';
import type { Task, Course } from '../../types/planner';
import { CourseBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { ClockIcon, CheckIcon, CheckSquareIcon, EditIcon, TrashIcon, AlertCircleIcon, PlusIcon } from '../common/Icons';
import { formatDisplayDate } from '../../utils/dateTime';

interface TodaySectionProps {
  tasks: Task[];
  overdueTasks?: Task[];
  courses: Course[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onOpenAddTask: () => void;
}

export const TodaySection: React.FC<TodaySectionProps> = ({
  tasks,
  overdueTasks = [],
  courses,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenAddTask
}) => {
  const courseMap = React.useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((c) => map.set(c.id, c));
    return map;
  }, [courses]);

  const pendingTodayCount = tasks.filter((t) => !t.completed).length;
  const todayFormatted = formatDisplayDate(new Date(), 'full');

  return (
    <section className="neo-card section-card" aria-labelledby="today-heading">
      <div className="section-card-header">
        <div>
          <div className="section-title-row">
            <h2 id="today-heading" className="section-title">Today's Schedule</h2>
            <span className="neo-badge neo-badge-high">{pendingTodayCount} remaining</span>
          </div>
          <p className="today-date-subhead">
            📅 {todayFormatted}
          </p>
        </div>

        <button
          className="neo-btn neo-btn-primary neo-btn-sm"
          onClick={onOpenAddTask}
          type="button"
          title="Add event or task for today"
        >
          <PlusIcon size={14} />
          <span>Add</span>
        </button>
      </div>

      <div className="section-card-body">
        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <div className="overdue-banner-box">
            <div className="overdue-header">
              <AlertCircleIcon size={16} />
              <span>OVERDUE ({overdueTasks.length} items needing attention)</span>
            </div>

            <div className="overdue-list">
              {overdueTasks.map((task) => {
                const course = task.courseId ? courseMap.get(task.courseId) : undefined;
                return (
                  <div
                    key={task.id}
                    className="neo-item-card overdue-item"
                    id={`overdue-task-${task.id}`}
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
                        <span className="neo-badge neo-badge-high">Due {task.dueDate}</span>
                      </div>
                      <div className="item-badges-row">
                        <CategoryBadge category={task.category} />
                        <PriorityBadge priority={task.priority} />
                        {course && <CourseBadge course={course} />}
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="neo-icon-btn edit-btn"
                        onClick={() => onEditTask(task)}
                        title="Edit"
                        type="button"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        className="neo-icon-btn delete-btn"
                        onClick={() => onDeleteTask(task)}
                        title="Delete task"
                        type="button"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Today Tasks */}
        {tasks.length === 0 ? (
          <div className="neo-empty-state">
            <CheckSquareIcon size={32} />
            <p className="empty-title">No tasks or events scheduled for today</p>
            <p className="empty-sub">
              Enjoy your day or click below to schedule your assignments and events.
            </p>
            <button className="neo-btn neo-btn-secondary" onClick={onOpenAddTask} type="button">
              <PlusIcon size={15} />
              <span>Schedule Event / Task</span>
            </button>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => {
              const course = task.courseId ? courseMap.get(task.courseId) : undefined;
              return (
                <div
                  key={task.id}
                  className={`neo-item-card ${task.completed ? 'completed' : ''}`}
                  id={`today-task-${task.id}`}
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
                      {task.estimatedMinutes && (
                        <span className="meta-time-chip">
                          <span>~{task.estimatedMinutes}m</span>
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
                      title="Delete"
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
    </section>
  );
};
