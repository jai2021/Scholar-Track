import React from 'react';
import type { Course, Task } from '../../types/planner';
import { CourseBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, BookOpenIcon, ClockIcon, UserIcon } from '../common/Icons';

interface CoursesViewProps {
  courses: Course[];
  tasks: Task[];
  onOpenAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  tasks,
  onOpenAddCourse,
  onEditCourse,
  onDeleteCourse
}) => {
  return (
    <div className="courses-page-container">
      <div className="section-header-row">
        <div>
          <h2 className="section-title-large">Enrolled Courses</h2>
          <p className="section-subtitle">
            Manage your academic subjects, instructors, timetables, and color themes.
          </p>
        </div>

        <button
          className="neo-btn neo-btn-primary"
          onClick={onOpenAddCourse}
          type="button"
          id="add-course-btn"
        >
          <PlusIcon size={16} />
          <span>Add Course</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="neo-card">
          <div className="neo-empty-state" style={{ padding: '3.5rem 1rem' }}>
            <BookOpenIcon size={36} />
            <h3 className="empty-title">No Courses Enrolled Yet</h3>
            <p className="empty-sub">
              Add your courses for this semester to associate assignments, labs, and track your schedule.
            </p>
            <button className="neo-btn neo-btn-primary" onClick={onOpenAddCourse} type="button">
              <PlusIcon size={16} />
              <span>Create Your First Course</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="neo-courses-grid">
          {courses.map((course) => {
            const courseTasks = tasks.filter((t) => t.courseId === course.id);
            const pendingTasks = courseTasks.filter((t) => !t.completed).length;

            return (
              <div key={course.id} className="neo-card course-card">
                <div
                  className="course-card-accent-bar"
                  style={{ backgroundColor: course.color }}
                />

                <div className="course-card-content">
                  <div className="course-top-row">
                    <CourseBadge course={course} />
                    <div className="item-actions">
                      <button
                        className="neo-icon-btn edit-btn"
                        onClick={() => onEditCourse(course)}
                        title="Edit course"
                        aria-label={`Edit ${course.code}`}
                        type="button"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        className="neo-icon-btn delete-btn"
                        onClick={() => onDeleteCourse(course)}
                        title="Delete course"
                        aria-label={`Delete ${course.code}`}
                        type="button"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="course-card-title">{course.name}</h3>

                  <div className="course-details-list">
                    {course.instructor && (
                      <div className="course-detail-item">
                        <UserIcon size={14} />
                        <span>{course.instructor}</span>
                      </div>
                    )}

                    {course.schedule && (
                      <div className="course-detail-item">
                        <ClockIcon size={14} />
                        <span>{course.schedule}</span>
                      </div>
                    )}
                  </div>

                  <div className="course-card-footer">
                    <span className="neo-badge neo-badge-assignment">
                      {pendingTasks} {pendingTasks === 1 ? 'task pending' : 'tasks pending'}
                    </span>
                    {course.term && (
                      <span className="course-term-pill">{course.term}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
