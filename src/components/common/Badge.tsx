import React from 'react';
import type { TaskPriority, TaskCategory, Course } from '../../types/planner';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles: Record<TaskPriority, { label: string; className: string }> = {
    high: {
      label: 'High Priority',
      className: 'neo-badge neo-badge-high'
    },
    medium: {
      label: 'Medium',
      className: 'neo-badge neo-badge-med'
    },
    low: {
      label: 'Low',
      className: 'neo-badge neo-badge-low'
    }
  };

  const current = styles[priority];

  return (
    <span className={current.className}>
      {current.label}
    </span>
  );
};

interface CourseBadgeProps {
  course?: Course;
  fallbackCode?: string;
}

export const CourseBadge: React.FC<CourseBadgeProps> = ({ course, fallbackCode = 'General' }) => {
  const code = course ? course.code : fallbackCode;
  const color = course?.color || '#000000';

  return (
    <span
      className="neo-badge neo-badge-course"
      style={{
        backgroundColor: course?.bgColor || '#f4f4f5',
        borderColor: 'var(--border-color, #000000)',
        color: 'var(--text-primary, #000000)'
      }}
      title={course ? `${course.code}: ${course.name}` : 'Unassigned / General'}
    >
      <span
        className="course-dot"
        style={{
          backgroundColor: color,
          border: '1.5px solid var(--border-color, #000000)'
        }}
      />
      <span>{code}</span>
    </span>
  );
};

interface CategoryBadgeProps {
  category: TaskCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const meta: Record<TaskCategory, { label: string; className: string }> = {
    event: { label: 'Event', className: 'neo-badge neo-badge-event' },
    assignment: { label: 'Assignment', className: 'neo-badge neo-badge-assignment' },
    exam: { label: 'Exam', className: 'neo-badge neo-badge-exam' },
    project: { label: 'Project', className: 'neo-badge neo-badge-project' },
    reading: { label: 'Reading', className: 'neo-badge neo-badge-reading' },
    lab: { label: 'Lab', className: 'neo-badge neo-badge-lab' }
  };

  const current = meta[category] || { label: category, className: 'neo-badge' };

  return (
    <span className={current.className}>
      {current.label}
    </span>
  );
};
