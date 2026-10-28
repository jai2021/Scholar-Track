import React, { useState, useEffect } from 'react';
import type { Course } from '../../types/planner';
import { XIcon, CheckIcon } from '../common/Icons';
import { getAcademicTerm } from '../../utils/dateTime';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
  onSaveCourse: (
    courseData: Omit<Course, 'id'>,
    courseId?: string
  ) => void;
}

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#059669', // Emerald
  '#0d9488', // Teal
  '#d97706', // Amber
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#7c3aed', // Purple
  '#000000'  // Onyx
];

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
  onSaveCourse
}) => {
  const currentAcademicTerm = getAcademicTerm();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [schedule, setSchedule] = useState('');
  const [term, setTerm] = useState(currentAcademicTerm);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const isEditMode = Boolean(courseToEdit);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (courseToEdit) {
        setCode(courseToEdit.code);
        setName(courseToEdit.name);
        setInstructor(courseToEdit.instructor || '');
        setSchedule(courseToEdit.schedule || '');
        setTerm(courseToEdit.term || currentAcademicTerm);
        setColor(courseToEdit.color || PRESET_COLORS[0]);
      } else {
        setCode('');
        setName('');
        setInstructor('');
        setSchedule('');
        setTerm(currentAcademicTerm);
        setColor(PRESET_COLORS[0]);
      }
    }
  }, [isOpen, courseToEdit, currentAcademicTerm]);

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
    if (!code.trim()) {
      setError('Course code is required (e.g. CS 101).');
      return;
    }
    if (!name.trim()) {
      setError('Course name is required (e.g. Data Structures & Algorithms).');
      return;
    }

    onSaveCourse(
      {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        instructor: instructor.trim() || undefined,
        schedule: schedule.trim() || undefined,
        term: term.trim() || currentAcademicTerm,
        color,
        bgColor: `${color}18`,
        borderColor: `${color}40`
      },
      courseToEdit?.id
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
      aria-labelledby="course-dialog-title"
    >
      <div className="neo-modal-dialog">
        <div className="neo-modal-header">
          <h2 id="course-dialog-title" className="neo-modal-title">
            {isEditMode ? '📚 Edit Course' : '📚 Enroll New Course'}
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

          <div className="form-grid-2">
            <div className="neo-field">
              <label htmlFor="course-code" className="neo-label">
                Course Code *
              </label>
              <input
                id="course-code"
                type="text"
                className="neo-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS 101, MATH 204"
                autoFocus
                required
              />
            </div>

            <div className="neo-field">
              <label htmlFor="course-term" className="neo-label">
                Academic Term
              </label>
              <input
                id="course-term"
                type="text"
                className="neo-input"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Fall 2026"
              />
            </div>
          </div>

          <div className="neo-field">
            <label htmlFor="course-name" className="neo-label">
              Course Name *
            </label>
            <input
              id="course-name"
              type="text"
              className="neo-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Object Oriented Programming & Systems"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="neo-field">
              <label htmlFor="course-instructor" className="neo-label">
                Instructor / Professor (optional)
              </label>
              <input
                id="course-instructor"
                type="text"
                className="neo-input"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Dr. Alan Turing"
              />
            </div>

            <div className="neo-field">
              <label htmlFor="course-schedule" className="neo-label">
                Class Timetable / Schedule (optional)
              </label>
              <input
                id="course-schedule"
                type="text"
                className="neo-input"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. MWF 10:00 - 11:15 AM"
              />
            </div>
          </div>

          {/* Color theme selection */}
          <div className="neo-field">
            <label className="neo-label">
              Course Color Tag
            </label>
            <div className="neo-color-swatches">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch-btn ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                >
                  {color === c && <CheckIcon size={14} color="#ffffff" />}
                </button>
              ))}
            </div>
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
              id="course-submit-btn"
            >
              <CheckIcon size={16} />
              <span>{isEditMode ? 'Update Course' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
