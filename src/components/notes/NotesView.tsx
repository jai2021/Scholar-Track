import React, { useState } from 'react';
import type { Course } from '../../types/planner';
import { CourseBadge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, NotesIcon, CheckIcon } from '../common/Icons';

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  updatedAt: string;
}

const NOTES_STORAGE_KEY = 'scholartrack_notes_v2';

function loadStoredNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredNotes(notes: StudyNote[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

interface NotesViewProps {
  courses: Course[];
}

export const NotesView: React.FC<NotesViewProps> = ({ courses }) => {
  const [notes, setNotes] = useState<StudyNote[]>(() => loadStoredNotes());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<StudyNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [courseId, setCourseId] = useState('');

  const courseMap = React.useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((c) => map.set(c.id, c));
    return map;
  }, [courses]);

  const handleOpenAdd = () => {
    setNoteToEdit(null);
    setTitle('');
    setContent('');
    setCourseId('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: StudyNote) => {
    setNoteToEdit(note);
    setTitle(note.title);
    setContent(note.content);
    setCourseId(note.courseId || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this study note?')) {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      saveStoredNotes(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dateStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });

    if (noteToEdit) {
      const updated = notes.map((n) =>
        n.id === noteToEdit.id
          ? {
              ...n,
              title: title.trim(),
              content: content.trim(),
              courseId: courseId || undefined,
              updatedAt: dateStr
            }
          : n
      );
      setNotes(updated);
      saveStoredNotes(updated);
    } else {
      const newNote: StudyNote = {
        id: `note-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        courseId: courseId || undefined,
        updatedAt: dateStr
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      saveStoredNotes(updated);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="notes-container">
      <div className="section-header-row">
        <div>
          <h2 className="section-title-large">Study Notes & Cheat Sheets</h2>
          <p className="section-subtitle">
            Jot down formulas, lecture takeaways, and quick exam prep summaries.
          </p>
        </div>

        <button className="neo-btn neo-btn-primary" onClick={handleOpenAdd} type="button">
          <PlusIcon size={16} />
          <span>New Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="neo-card">
          <div className="neo-empty-state" style={{ padding: '3.5rem 1rem' }}>
            <NotesIcon size={36} />
            <h3 className="empty-title">No Study Notes Yet</h3>
            <p className="empty-sub">
              Create quick lecture reminders, key theorems, or study checklists.
            </p>
            <button className="neo-btn neo-btn-secondary" onClick={handleOpenAdd} type="button">
              <PlusIcon size={15} />
              <span>Create First Note</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="neo-notes-grid">
          {notes.map((note) => {
            const course = note.courseId ? courseMap.get(note.courseId) : undefined;
            return (
              <div key={note.id} className="neo-card note-card">
                <div className="note-card-header">
                  {course ? (
                    <CourseBadge course={course} />
                  ) : (
                    <span className="neo-badge neo-badge-low">Quick Note</span>
                  )}
                  <div className="item-actions">
                    <button
                      className="neo-icon-btn edit-btn"
                      onClick={() => handleOpenEdit(note)}
                      title="Edit note"
                      type="button"
                    >
                      <EditIcon size={13} />
                    </button>
                    <button
                      className="neo-icon-btn delete-btn"
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                      type="button"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="note-card-title">{note.title}</h3>
                <p className="note-card-body-text">{note.content}</p>

                <div className="note-card-footer">
                  <span className="note-updated-tag">Updated {note.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Edit / Create Modal */}
      {isModalOpen && (
        <div
          className="neo-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          role="dialog"
        >
          <div className="neo-modal-dialog">
            <div className="neo-modal-header">
              <h2 className="neo-modal-title">
                {noteToEdit ? '✏️ Edit Study Note' : '📝 New Study Note'}
              </h2>
              <button
                type="button"
                className="neo-icon-btn modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="neo-modal-body">
              <div className="neo-field">
                <label className="neo-label">Note Title *</label>
                <input
                  type="text"
                  className="neo-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tree Traversal Algorithms, Calculus Formulas"
                  required
                  autoFocus
                />
              </div>

              <div className="neo-field">
                <label className="neo-label">Associated Course (optional)</label>
                <select
                  className="neo-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">General Note</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="neo-field">
                <label className="neo-label">Content / Formulas / Key Takeaways</label>
                <textarea
                  className="neo-textarea"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type notes, code snippets, reminders, or formulas here..."
                />
              </div>

              <div className="neo-modal-footer">
                <button
                  type="button"
                  className="neo-btn neo-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="neo-btn neo-btn-primary">
                  <CheckIcon size={16} />
                  <span>Save Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
