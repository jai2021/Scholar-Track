import React, { useState, useEffect } from 'react';
import type { Course, Task, TaskPriority, TaskCategory } from '../../types/planner';
import { XIcon, PlusIcon } from '../common/Icons';
import { formatDateToYYYYMMDD } from '../../utils/dateTime';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onAddTask: (newTask: Omit<Task, 'id' | 'createdDate'>) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  courses,
  onAddTask
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [dueDate, setDueDate] = useState(() => formatDateToYYYYMMDD());
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('assignment');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(45);
  const [error, setError] = useState('');

  // Reset error when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      if (!courseId && courses.length > 0) {
        setCourseId(courses[0].id);
      }
    }
  }, [isOpen, courses, courseId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    onAddTask({
      title: title.trim(),
      courseId,
      dueDate,
      dueTime: dueTime.trim() || undefined,
      priority,
      category,
      completed: false,
      estimatedMinutes: Number(estimatedMinutes) || 30
    });

    // Reset title
    setTitle('');
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-dialog-title"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 id="add-task-dialog-title" className="modal-title">Create New Task</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--danger-subtle)',
                  color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600
                }}
              >
                {error}
              </div>
            )}

            {/* Task Title */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                Task Title *
              </label>
              <input
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="e.g. Problem Set 5: Graph Traversal"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                required
              />
            </div>

            {/* Course & Category */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="task-course-select" className="form-label">
                  Course
                </label>
                <select
                  id="task-course-select"
                  className="form-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-category-select" className="form-label">
                  Category
                </label>
                <select
                  id="task-category-select"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam / Quiz</option>
                  <option value="reading">Reading</option>
                  <option value="lab">Lab Report</option>
                  <option value="project">Project</option>
                </select>
              </div>
            </div>

            {/* Due Date & Due Time */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="task-due-date" className="form-label">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-due-time" className="form-label">
                  Due Time
                </label>
                <input
                  id="task-due-time"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 11:59 PM or 04:00 PM"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>

            {/* Priority & Estimated Time */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="task-priority-select" className="form-label">
                  Priority Level
                </label>
                <select
                  id="task-priority-select"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-estimated-time" className="form-label">
                  Est. Study Minutes
                </label>
                <input
                  id="task-estimated-time"
                  type="number"
                  min="5"
                  step="5"
                  className="form-input"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Math.max(5, Number(e.target.value)))}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="modal-submit-task-btn"
            >
              <PlusIcon size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
