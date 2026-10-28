import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types/planner';
import { CheckIcon } from '../common/Icons';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

const PRESET_YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  '5th Year (Super Senior)',
  "Master's (Year 1)",
  "Master's (Year 2)",
  'PhD / Doctorate'
];

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [name, setName] = useState(profile.name || 'Jai');
  const [email, setEmail] = useState(profile.email || '');
  const [school, setSchool] = useState(profile.school || '');
  const [major, setMajor] = useState(profile.major || '');
  
  // Year handling with custom support
  const initialYear = profile.year || '2nd Year (Sophomore)';
  const isPreset = PRESET_YEARS.includes(initialYear);
  const [selectedYearMode, setSelectedYearMode] = useState<string>(isPreset ? initialYear : 'custom');
  const [customYearText, setCustomYearText] = useState<string>(isPreset ? '' : initialYear);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setName(profile.name || 'Jai');
    setEmail(profile.email || '');
    setSchool(profile.school || '');
    setMajor(profile.major || '');
    const currentYear = profile.year || '2nd Year (Sophomore)';
    if (PRESET_YEARS.includes(currentYear)) {
      setSelectedYearMode(currentYear);
      setCustomYearText('');
    } else {
      setSelectedYearMode('custom');
      setCustomYearText(currentYear);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalYear = selectedYearMode === 'custom' 
      ? (customYearText.trim() || 'Student')
      : selectedYearMode;

    onSaveProfile({
      name: name.trim() || 'Student',
      email: email.trim() || undefined,
      school: school.trim() || undefined,
      major: major.trim() || undefined,
      year: finalYear
    });

    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 2800);
  };

  const currentDisplayYear = selectedYearMode === 'custom'
    ? (customYearText.trim() || 'Not specified')
    : selectedYearMode;

  const initialLetter = (name.trim()[0] || 'S').toUpperCase();

  return (
    <div className="profile-container">
      <div className="section-header-row">
        <div>
          <h2 className="section-title-large">Academic Profile</h2>
          <p className="section-subtitle">
            Manage your personal student identity, major, and current year of study.
          </p>
        </div>
      </div>

      <div className="neo-card profile-card">
        {/* Profile Hero Header */}
        <div className="profile-hero">
          <div className="profile-avatar-neo">
            {initialLetter}
          </div>
          <div className="profile-hero-info">
            <h3 className="profile-hero-name">
              {name || 'Student'}
            </h3>
            <div className="profile-hero-badges">
              <span className="neo-badge neo-badge-course">
                {major || 'Undergraduate'}
              </span>
              <span className="neo-badge neo-badge-high">
                {currentDisplayYear}
              </span>
            </div>
            {school && (
              <p className="profile-hero-school">
                🏫 {school}
              </p>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          {savedNotice && (
            <div className="neo-alert neo-alert-success">
              <CheckIcon size={18} />
              <span>Profile updated successfully! Real-time changes saved.</span>
            </div>
          )}

          <div className="form-grid-2">
            <div className="neo-field">
              <label htmlFor="profile-name" className="neo-label">
                Full Name *
              </label>
              <input
                id="profile-name"
                type="text"
                className="neo-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jai"
                required
              />
            </div>

            <div className="neo-field">
              <label htmlFor="profile-email" className="neo-label">
                Student Email
              </label>
              <input
                id="profile-email"
                type="email"
                className="neo-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jai@university.edu"
              />
            </div>
          </div>

          <div className="neo-field">
            <label htmlFor="profile-school" className="neo-label">
              University / Institution
            </label>
            <input
              id="profile-school"
              type="text"
              className="neo-input"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Faculty of Science & Engineering"
            />
          </div>

          <div className="form-grid-2">
            <div className="neo-field">
              <label htmlFor="profile-major" className="neo-label">
                Major / Degree Program
              </label>
              <input
                id="profile-major"
                type="text"
                className="neo-input"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>

            <div className="neo-field">
              <label htmlFor="profile-year-select" className="neo-label">
                Current Year of Study *
              </label>
              <select
                id="profile-year-select"
                className="neo-select"
                value={selectedYearMode}
                onChange={(e) => setSelectedYearMode(e.target.value)}
              >
                {PRESET_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
                <option value="custom">Custom Year / Batch...</option>
              </select>
            </div>
          </div>

          {selectedYearMode === 'custom' && (
            <div className="neo-field">
              <label htmlFor="custom-year-input" className="neo-label">
                Custom Year Description
              </label>
              <input
                id="custom-year-input"
                type="text"
                className="neo-input"
                value={customYearText}
                onChange={(e) => setCustomYearText(e.target.value)}
                placeholder="e.g. 2nd Year B.Tech, Class of 2027, etc."
                required
              />
            </div>
          )}

          <div className="form-action-row">
            <button type="submit" className="neo-btn neo-btn-primary" id="save-profile-btn">
              <CheckIcon size={16} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
