import React from 'react';
import type { NavTab, UserProfile } from '../../types/planner';
import {
  GraduationCapIcon,
  DashboardIcon,
  CheckSquareIcon,
  BookOpenIcon,
  CalendarIcon,
  NotesIcon,
  UserIcon,
  SettingsIcon,
  XIcon
} from '../common/Icons';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  tasksDueTodayCount: number;
  coursesCount: number;
  profile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  tasksDueTodayCount,
  coursesCount,
  profile
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon size={18} />
    },
    {
      id: 'tasks',
      label: 'Tasks & Events',
      icon: <CheckSquareIcon size={18} />,
      count: tasksDueTodayCount
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: <BookOpenIcon size={18} />,
      count: coursesCount
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon size={18} />
    },
    {
      id: 'notes',
      label: 'Study Notes',
      icon: <NotesIcon size={18} />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserIcon size={18} />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon size={18} />
    }
  ];

  const initialLetter = (profile?.name?.trim()?.[0] || 'J').toUpperCase();
  const displayYear = profile?.year || '2nd Year (Sophomore)';

  return (
    <>
      {/* Mobile background overlay */}
      <div
        className={`sidebar-backdrop ${isOpenMobile ? 'open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpenMobile ? 'open' : ''}`} aria-label="Sidebar Navigation">
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-logo-neo">
            <GraduationCapIcon size={22} />
          </div>
          <div className="brand-info">
            <span className="brand-title">ScholarTrack</span>
            <span className="brand-subtitle">Academic Planner</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="neo-icon-btn mobile-close-btn"
            aria-label="Close sidebar menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`neo-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                type="button"
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="nav-item-left">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="neo-nav-counter">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <button
            className={`neo-user-card ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('profile');
              onCloseMobile();
            }}
            type="button"
            title="Edit Profile"
          >
            <div className="neo-user-avatar">
              {initialLetter}
            </div>
            <div className="neo-user-meta">
              <span className="neo-user-name">{profile?.name || 'Student'}</span>
              <span className="neo-user-role">
                {profile?.major || 'Undergraduate'} • {displayYear}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
