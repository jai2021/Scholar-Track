import React from 'react';
import type { Task, Course } from '../../types/planner';
import { CourseBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { ClockIcon, CheckIcon, CalendarIcon, EditIcon, TrashIcon, PlusIcon } from '../common/Icons';
import { getRelativeDeadlineLabel, formatDateToYYYYMMDD } from '../../utils/dateTime';

interface UpcomingSectionProps {
  tasks: Task[];
  courses: Course[];
  todayDateStr?: string;
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onOpenAddTask: () => void;
}

export const UpcomingSection: React.FC<UpcomingSectionProps> = ({
  tasks,
  courses,
  todayDateStr = formatDateToYYYYMMDD(),
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

  // Sort upcoming tasks by date ascending
  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  return (
    <section className="neo-card section-card" aria-labelledby="upcoming-heading">
      <div className="section-card-header">
        <div>
          <div className="section-title-row">
            <h2 id="upcoming-heading" className="section-title">Upcoming Deadlines & Events</h2>
            <span className="neo-badge neo-badge-assignment">{sortedTasks.length} ahead</span>
          </div>
          <p className="today-date-subhead">
            Future assignments, quizzes, and academic milestones
          </p>
        </div>

        <button
          className="neo-btn neo-btn-primary neo-btn-sm"
          onClick={onOpenAddTask}
          type="button"
          title="Schedule upcoming event or deadline"
        >
          <PlusIcon size={14} />
          <span>Add</span>
        </button>
      </div>

      <div className="section-card-body">
        {sortedTasks.length === 0 ? (
          <div className="neo-empty-state">
            <CalendarIcon size={32} />
            <p className="empty-title">No upcoming deadlines</p>
            <p className="empty-sub">Your upcoming schedule is clean and clear.</p>
            <button className="neo-btn neo-btn-secondary" onClick={onOpenAddTask} type="button">
              <PlusIcon size={15} />
              <span>Schedule Event / Task</span>
            </button>
          </div>
        ) : (
          <div className="task-list">
            {sortedTasks.map((task) => {
              const course = task.courseId ? courseMap.get(task.courseId) : undefined;
              const relative = getRelativeDeadlineLabel(task.dueDate, todayDateStr);

              return (
                <div
                  key={task.id}
                  className={`neo-item-card ${task.completed ? 'completed' : ''}`}
                  id={`upcoming-item-${task.id}`}
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
                      <span className="neo-badge neo-badge-med">{relative.label}</span>
                    </div>

                    <div className="item-badges-row">
                      <CategoryBadge category={task.category} />
                      <PriorityBadge priority={task.priority} />
                      {course && <CourseBadge course={course} />}
                      <span className="meta-time-chip">
                        <ClockIcon size={12} />
                        <span>{task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}</span>
                      </span>
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
            })}
          </div>
        )}
      </div>
    </section>
  );
};
