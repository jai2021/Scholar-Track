import React from 'react';
import type { QuickStats } from '../../types/planner';
import {
  CheckSquareIcon,
  ClockIcon,
  BookOpenIcon
} from '../common/Icons';

interface SummaryCardsProps {
  stats: QuickStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      id: 'due-today',
      title: 'DUE TODAY',
      value: stats.dueTodayCount,
      subtext: stats.dueTodayCount === 0 ? 'No tasks scheduled' : `${stats.completedTodayCount} completed`,
      badgeClass: 'metric-card-yellow',
      icon: <ClockIcon size={20} />
    },
    {
      id: 'upcoming-deadlines',
      title: 'UPCOMING DEADLINES',
      value: stats.upcomingCount,
      subtext: 'Assignments & exams',
      badgeClass: 'metric-card-mint',
      icon: <CheckSquareIcon size={20} />
    },
    {
      id: 'active-courses',
      title: 'ACTIVE COURSES',
      value: stats.activeCoursesCount,
      subtext: 'Enrolled this term',
      badgeClass: 'metric-card-cyan',
      icon: <BookOpenIcon size={20} />
    }
  ];

  return (
    <div className="neo-metrics-grid" role="region" aria-label="Summary statistics">
      {cards.map((card) => (
        <div key={card.id} className={`neo-card metric-card ${card.badgeClass}`} id={`metric-card-${card.id}`}>
          <div className="metric-header-row">
            <span className="metric-label">{card.title}</span>
            <div className="metric-icon-box">
              {card.icon}
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-big-number">{card.value}</span>
            <p className="metric-subtext">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
