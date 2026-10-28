import React, { useState } from 'react';
import type { ThemeMode } from '../../types/planner';
import { SunIcon, MoonIcon, MonitorIcon, ClockIcon, CalendarIcon, TrashIcon, CheckIcon } from '../common/Icons';
import { useCurrentDateTime } from '../../utils/dateTime';

interface SettingsViewProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  tasksCount: number;
  coursesCount: number;
  onClearAllData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentTheme,
  onSelectTheme,
  tasksCount,
  coursesCount,
  onClearAllData
}) => {
  const liveDateTime = useCurrentDateTime();
  const [clearedNotice, setClearedNotice] = useState(false);

  const themeOptions: { id: ThemeMode; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Bold Neo-Brutalist daylight aesthetic with warm cream background & black outlines',
      icon: <SunIcon size={24} color="#d97706" />
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'High-contrast matte dark theme with crisp borders and glowing accents',
      icon: <MoonIcon size={24} color="#ffe600" />
    },
    {
      id: 'system',
      label: 'System Preference',
      description: 'Automatically synchronizes with your device appearance preferences',
      icon: <MonitorIcon size={24} color="var(--text-secondary)" />
    }
  ];

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all tasks and courses? This will reset your planner to a fresh state.')) {
      if (onClearAllData) {
        onClearAllData();
        setClearedNotice(true);
        setTimeout(() => setClearedNotice(false), 3000);
      }
    }
  };

  return (
    <div className="settings-container">
      <div className="section-header-row">
        <div>
          <h2 className="section-title-large">Application Settings</h2>
          <p className="section-subtitle">
            Personalize your theme, verify live device synchronization, and review local data.
          </p>
        </div>
      </div>

      {clearedNotice && (
        <div className="neo-alert neo-alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckIcon size={18} />
          <span>All tasks and courses have been cleared. Planner is reset!</span>
        </div>
      )}

      {/* Device Date & Time Synchronization Status */}
      <div className="neo-card" style={{ marginBottom: '1.5rem' }}>
        <div className="neo-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="neo-badge neo-badge-event">
              <ClockIcon size={16} />
            </div>
            <h3 className="section-title">System Clock & Time Synchronization</h3>
          </div>
          <span className="neo-badge neo-badge-low" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-pulse-dot" />
            Live Device Synced
          </span>
        </div>

        <div className="neo-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            ScholarTrack syncs directly with your device's internal operating system clock. Deadlines, daily schedules, and the calendar automatically adapt to your live local timezone.
          </p>

          <div className="form-grid-2">
            <div className="neo-info-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <CalendarIcon size={15} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Device Date</span>
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {liveDateTime.formattedDateFull}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Space Grotesk, monospace' }}>
                ISO: {liveDateTime.currentDateStr}
              </span>
            </div>

            <div className="neo-info-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <ClockIcon size={15} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Clock</span>
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                {liveDateTime.formattedTimeWithSeconds}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Zone: {liveDateTime.timezone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="neo-card" style={{ marginBottom: '1.5rem' }}>
        <div className="neo-card-header">
          <div>
            <h3 className="section-title">Interface Appearance</h3>
            <p className="today-date-subhead">
              Select your favorite theme. Real-time changes are saved instantly.
            </p>
          </div>
        </div>

        <div className="neo-card-body">
          <div className="neo-theme-grid">
            {themeOptions.map((opt) => {
              const isActive = currentTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`neo-theme-option ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTheme(opt.id)}
                  role="radio"
                  aria-checked={isActive}
                >
                  <div className="theme-icon-wrap">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="theme-opt-title">
                      {opt.label}
                    </div>
                    <p className="theme-opt-desc">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Browser Storage & Data Section */}
      <div className="neo-card">
        <div className="neo-card-header">
          <div>
            <h3 className="section-title">Local Browser Storage</h3>
            <p className="today-date-subhead">
              All data is stored directly in your browser with zero dummy data and zero tracking.
            </p>
          </div>
        </div>

        <div className="neo-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid-2">
            <div className="neo-info-box">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Tasks & Events</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {tasksCount}
              </p>
            </div>

            <div className="neo-info-box">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Enrolled Courses</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {coursesCount}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem', borderTop: '2px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Need a completely fresh start? Clear your local storage here.
            </p>
            <button
              type="button"
              className="neo-btn neo-btn-danger neo-btn-sm"
              onClick={handleClear}
            >
              <TrashIcon size={14} />
              <span>Reset All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
