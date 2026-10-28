import { useState, useEffect, useMemo } from 'react';

/**
 * Utility to format a Date into local YYYY-MM-DD string.
 * Uses local time components (getFullYear, getMonth, getDate) rather than UTC
 * so that it strictly adheres to the user's device local timezone.
 */
export function formatDateToYYYYMMDD(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string into a local Date object.
 */
export function parseDateFromYYYYMMDD(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * Add or subtract calendar days from a YYYY-MM-DD string.
 */
export function addDaysToDateStr(dateStr: string, days: number): string {
  const d = parseDateFromYYYYMMDD(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateToYYYYMMDD(d);
}

/**
 * Computes calendar day difference between target date and base date.
 * target - base in days.
 */
export function getCalendarDayDiff(
  targetDateStr: string,
  baseDateStr: string = formatDateToYYYYMMDD()
): number {
  const target = parseDateFromYYYYMMDD(targetDateStr);
  const base = parseDateFromYYYYMMDD(baseDateStr);
  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats a Date object into human-readable date strings based on user's device locale.
 */
export function formatDisplayDate(
  date: Date = new Date(),
  style: 'full' | 'weekday-short' | 'short' = 'full'
): string {
  try {
    if (style === 'full') {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (style === 'weekday-short') {
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return formatDateToYYYYMMDD(date);
  }
}

/**
 * Formats a Date object into a synchronized time string (e.g. "7:30 PM" or "7:30:15 PM").
 */
export function formatDisplayTime(
  date: Date = new Date(),
  options: { includeSeconds?: boolean; hour12?: boolean } = {}
): string {
  const { includeSeconds = false, hour12 = true } = options;
  try {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      ...(includeSeconds ? { second: '2-digit' } : {}),
      hour12
    });
  } catch {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

/**
 * Derives the academic semester / term based on current month & year of the device.
 */
export function getAcademicTerm(date: Date = new Date()): string {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const year = date.getFullYear();

  if (month >= 0 && month <= 4) {
    return `Spring ${year}`;
  } else if (month >= 5 && month <= 7) {
    return `Summer ${year}`;
  } else {
    return `Fall ${year}`;
  }
}

/**
 * Derives the academic year based on device date (e.g. 2026-2027).
 */
export function getAcademicYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0 = Jan
  const year = date.getFullYear();
  if (month >= 7) {
    // August onwards belongs to academic year (current)-(next)
    return `${year}–${year + 1}`;
  }
  return `${year - 1}–${year}`;
}

/**
 * Resolves the device's system timezone name (e.g. "Asia/Calcutta", "America/New_York").
 */
export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'System Local';
  } catch {
    return 'System Local';
  }
}

/**
 * Generates relative deadline badge information.
 */
export function getRelativeDeadlineLabel(
  dateStr: string,
  baseDateStr: string = formatDateToYYYYMMDD()
): { label: string; className: 'overdue' | 'urgent' | 'soon' | 'future' } {
  const diffDays = getCalendarDayDiff(dateStr, baseDateStr);

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    return {
      label: abs === 1 ? 'Yesterday (Overdue)' : `${abs}d overdue`,
      className: 'overdue'
    };
  }
  if (diffDays === 0) {
    return { label: 'Due today', className: 'urgent' };
  }
  if (diffDays === 1) {
    return { label: 'Tomorrow', className: 'urgent' };
  }
  if (diffDays <= 3) {
    return { label: `In ${diffDays} days`, className: 'soon' };
  }
  return { label: `In ${diffDays} days`, className: 'future' };
}

export interface CurrentDateTimeState {
  now: Date;
  currentYear: number;
  currentDateStr: string;
  formattedDateFull: string;
  formattedDateShort: string;
  formattedTime: string;
  formattedTimeWithSeconds: string;
  academicTerm: string;
  academicYear: string;
  timezone: string;
}

/**
 * React hook that connects components directly to the user device's date and live ticking clock.
 * Automatically updates every 1 second.
 */
export function useCurrentDateTime(): CurrentDateTimeState {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Ticking interval every second to keep time live
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    return {
      now,
      currentYear: now.getFullYear(),
      currentDateStr: formatDateToYYYYMMDD(now),
      formattedDateFull: formatDisplayDate(now, 'full'),
      formattedDateShort: formatDisplayDate(now, 'weekday-short'),
      formattedTime: formatDisplayTime(now, { includeSeconds: false }),
      formattedTimeWithSeconds: formatDisplayTime(now, { includeSeconds: true }),
      academicTerm: getAcademicTerm(now),
      academicYear: getAcademicYear(now),
      timezone: getDeviceTimezone()
    };
  }, [now]);
}
