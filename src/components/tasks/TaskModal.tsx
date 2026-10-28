import React, { useState, useEffect } from 'react';
import type { Course, Task, TaskPriority, TaskCategory } from '../../types/planner';
import { XIcon, CheckIcon } from '../common/Icons';
import { formatDateToYYYYMMDD } from '../../utils/dateTime';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  taskToEdit?: Task | null;
  defaultDateStr?: string;
  onSaveTask: (
    taskData: Omit<Task, 'id' | 'createdDate'>,
    taskId?: string
  ) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  courses,
  taskToEdit,
  defaultDateStr = formatDateToYYYYMMDD(),
  onSaveTask
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState<string>('');
  const [dueDate, setDueDate] = useState(defaultDateStr);
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('assignment');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState('');

  const isEditMode = Boolean(taskToEdit);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setCourseId(taskToEdit.courseId || '');
        setDueDate(taskToEdit.dueDate);
        setDueTime(taskToEdit.dueTime || '');
        setPriority(taskToEdit.priority);
        setCategory(taskToEdit.category);
        setEstimatedMinutes(taskToEdit.estimatedMinutes || 30);
        setNotes(taskToEdit.notes || '');
      } else {
        setTitle('');
        setCourseId(courses[0]?.id || '');
        setDueDate(defaultDateStr || formatDateToYYYYMMDD());
        setDueTime('11:59 PM');
        setPriority('medium');
        setCategory('assignment');
        setEstimatedMinutes(45);
        setNotes('');
      }
    }
  }, [isOpen, taskToEdit, defaultDateStr, courses]);

  // Handle ESC key
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
      setError('Please provide a title for this event or task.');
      return;
    }

    onSaveTask(
      {
        title: title.trim(),
        courseId: courseId ? courseId : undefined,
        dueDate,
        dueTime: dueTime.trim() || undefined,
        priority,
        category,
        completed: taskToEdit ? taskToEdit.completed : false,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        notes: notes.trim() || undefined
      },
      taskToEdit?.id
    );

    onClose();
  };

  return (
    <div
      className="neo-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-dialog-title"
    >
      <div className="neo-modal-dialog">
        <div className="neo-modal-header">
          <h2 id="task-dialog-title" className="neo-modal-title">
            {isEditMode ? '✏️ Edit Event / Task' : '⚡ Schedule New Event / Task'}
          </h2>
          <button
            type="button"
            className="neo-icon-btn modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="neo-modal-body">
          {error && (
            <div className="neo-alert neo-alert-danger">
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="neo-field">
            <label htmlFor="task-title" className="neo-label">
              Title / Activity Name *
            </label>
            <input
              id="task-title"
              type="text"
              className="neo-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Exam, Hackathon, Problem Set 2"
              autoFocus
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="form-grid-2">
            <div className="neo-field">
              <label htmlFor="task-category" className="neo-label">
                Category
              </label>
              <select
                id="task-category"
                className="neo-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam / Quiz</option>
                <option value="event">Event / Meeting</option>
                <option value="project">Project</option>
                <option value="lab">Lab / Practical</option>
                <option value="reading">Reading / Study</option>
              </select>
            </div>

            <div className="neo-field">
              <label htmlFor="task-priority" className="neo-label">
                Priority Level
              </label>
              <select
                id="task-priority"
                className="neo-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Course Association */}
          <div className="neo-field">
            <label htmlFor="task-course" className="neo-label">
              Associated Course (Optional)
            </label>
            <select
              id="task-course"
              className="neo-select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">General / Non-Course Activity</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date & Time */}
          <div className="form-grid-2">
            <div className="neo-field">
              <label htmlFor="task-date" className="neo-label">
                Date (YYYY-MM-DD) *
              </label>
              <input
                id="task-date"
                type="date"
                className="neo-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="neo-field">
              <label htmlFor="task-time" className="neo-label">
                Time (optional)
              </label>
              <input
                id="task-time"
                type="text"
                className="neo-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. 11:59 PM or 02:30 PM"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="neo-field">
            <label htmlFor="task-notes" className="neo-label">
              Notes / Location / Instructions (optional)
            </label>
            <textarea
              id="task-notes"
              className="neo-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Room 302, bring graphing calculator, chapters 4-6"
            />
          </div>

          <div className="neo-modal-footer">
            <button
              type="button"
              className="neo-btn neo-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neo-btn neo-btn-primary"
              id="task-submit-btn"
            >
              <CheckIcon size={16} />
              <span>{isEditMode ? 'Save Changes' : 'Add Event / Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
