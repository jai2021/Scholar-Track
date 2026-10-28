import React from 'react';
import { SparklesIcon, CalendarIcon, CheckSquareIcon } from '../common/Icons';
import { getAcademicTerm, getAcademicYear } from '../../utils/dateTime';

interface WelcomeBannerProps {
  userName: string;
  userYear?: string;
  tasksDueTodayCount: number;
  upcomingCount: number;
  academicTerm?: string;
  overdueCount?: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  userYear = '2nd Year',
  tasksDueTodayCount,
  upcomingCount,
  academicTerm = getAcademicTerm(),
  overdueCount = 0
}) => {
  const academicYear = getAcademicYear();

  return (
    <section className="neo-card welcome-banner" aria-labelledby="welcome-heading">
      <div className="welcome-content">
        <div className="welcome-tag-row">
          <span className="neo-sticker neo-sticker-yellow">
            <SparklesIcon size={14} />
            <span>{academicTerm} • Academic Year {academicYear}</span>
          </span>
          {userYear && (
            <span className="neo-sticker neo-sticker-pink">
              🎓 {userYear}
            </span>
          )}
        </div>

        <h1 id="welcome-heading" className="welcome-title">
          Hey, {userName || 'Jai'}! 🚀
        </h1>

        <p className="welcome-description">
          {tasksDueTodayCount === 0 && upcomingCount === 0 ? (
            <>Your schedule is completely clear! Click <strong>New Event / Task</strong> to plan your upcoming semester deadlines.</>
          ) : (
            <>
              You have <strong>{tasksDueTodayCount} {tasksDueTodayCount === 1 ? 'item' : 'items'}</strong> scheduled for today and <strong>{upcomingCount} upcoming</strong> deadlines on your radar.
              {overdueCount > 0 && (
                <span className="overdue-highlight">
                  {' '}(⚠️ {overdueCount} {overdueCount === 1 ? 'task needs' : 'tasks need'} attention!)
                </span>
              )}
            </>
          )}
        </p>
      </div>

      <div className="welcome-quick-status">
        <div className="status-chip">
          <CalendarIcon size={16} />
          <span>Today: <strong>{tasksDueTodayCount}</strong></span>
        </div>
        <div className="status-chip">
          <CheckSquareIcon size={16} />
          <span>Ahead: <strong>{upcomingCount}</strong></span>
        </div>
      </div>
    </section>
  );
};
