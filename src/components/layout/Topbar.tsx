import React from 'react';
import type { ThemeMode } from '../../types/planner';
import { MenuIcon, CalendarIcon, ClockIcon, PlusIcon, SunIcon, MoonIcon } from '../common/Icons';
import { useCurrentDateTime } from '../../utils/dateTime';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenAddTask: () => void;
  currentTheme: ThemeMode;
  onToggleTheme: () => void;
  formattedDateFull?: string;
  formattedDateShort?: string;
  formattedTime?: string;
  timezone?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileSidebar,
  onOpenAddTask,
  currentTheme,
  onToggleTheme,
  formattedDateFull: propDateFull,
  formattedDateShort: propDateShort,
  formattedTime: propTime,
  timezone: propTimezone
}) => {
  const liveDateTime = useCurrentDateTime();

  const formattedDateFull = propDateFull || liveDateTime.formattedDateFull;
  const formattedDateShort = propDateShort || liveDateTime.formattedDateShort;
  const formattedTime = propTime || liveDateTime.formattedTime;
  const timezone = propTimezone || liveDateTime.timezone;

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          className="neo-icon-btn mobile-menu-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          type="button"
        >
          <MenuIcon size={20} />
        </button>

        {/* Live synchronized Device Date & Time Pill */}
        <div
          className="neo-date-pill"
          title={`Synchronized live with your device system clock (${timezone})`}
          aria-label={`Current date: ${formattedDateFull}, current time: ${formattedTime}`}
        >
          <span className="live-pulse-dot" aria-hidden="true" />
          <CalendarIcon size={15} />
          <span className="date-pill-text-full">{formattedDateFull}</span>
          <span className="date-pill-text-short">{formattedDateShort}</span>
          <span className="date-pill-sep">|</span>
          <ClockIcon size={15} />
          <span className="date-pill-time">{formattedTime}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Theme Mode Toggle Button */}
        <button
          className="neo-btn neo-btn-secondary theme-toggle-neo"
          onClick={onToggleTheme}
          title={`Toggle Theme (current: ${currentTheme})`}
          aria-label="Toggle between light and dark theme"
          type="button"
        >
          {currentTheme === 'dark' ? (
            <>
              <SunIcon size={16} color="#ffe600" />
              <span className="toggle-label">Light</span>
            </>
          ) : (
            <>
              <MoonIcon size={16} color="#18181b" />
              <span className="toggle-label">Dark</span>
            </>
          )}
        </button>

        {/* Quick Add Event / Task */}
        <button
          className="neo-btn neo-btn-primary add-event-btn"
          onClick={onOpenAddTask}
          type="button"
          id="topbar-add-task-btn"
        >
          <PlusIcon size={16} />
          <span>New Event / Task</span>
        </button>
      </div>
    </header>
  );
};
