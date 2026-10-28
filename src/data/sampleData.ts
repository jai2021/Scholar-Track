import type { Course, Task } from '../types/planner';
import { formatDateToYYYYMMDD, addDaysToDateStr, getAcademicTerm } from '../utils/dateTime';

export function getSampleCourses(): Course[] {
  const currentTerm = getAcademicTerm();
  return [
    {
      id: 'course-cs101',
      code: 'CS 101',
      name: 'Data Structures & Algorithms',
      color: '#4f46e5',
      bgColor: '#eef2ff',
      borderColor: '#c7d2fe',
      instructor: 'Dr. Evelyn Reed',
      schedule: 'MWF 10:00 - 11:15 AM',
      term: currentTerm
    },
    {
      id: 'course-math204',
      code: 'MATH 204',
      name: 'Discrete Mathematics',
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      instructor: 'Prof. Marcus Chen',
      schedule: 'TTh 01:00 - 02:30 PM',
      term: currentTerm
    },
    {
      id: 'course-phys210',
      code: 'PHYS 210',
      name: 'General Physics: Fields & Waves',
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      instructor: 'Dr. Sarah Al-Mansoor',
      schedule: 'MW 02:00 - 03:30 PM',
      term: currentTerm
    },
    {
      id: 'course-eng105',
      code: 'ENG 105',
      name: 'Academic Research & Writing',
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      instructor: 'Prof. Julian Brooks',
      schedule: 'Friday 09:00 - 11:30 AM',
      term: currentTerm
    }
  ];
}

export function getSampleTasks(baseDateStr: string = formatDateToYYYYMMDD()): Task[] {
  return [
    {
      id: 'task-1',
      title: 'Problem Set 4: Balanced Binary Trees & Heaps',
      courseId: 'course-cs101',
      dueDate: addDaysToDateStr(baseDateStr, 0), // Today
      dueTime: '11:59 PM',
      priority: 'high',
      category: 'assignment',
      completed: false,
      estimatedMinutes: 90,
      notes: 'Implement rotation helpers for AVL trees and verify test cases.',
      createdDate: addDaysToDateStr(baseDateStr, -4)
    },
    {
      id: 'task-2',
      title: 'Reading: Chapter 7 Graph Theory & Euler Paths',
      courseId: 'course-math204',
      dueDate: addDaysToDateStr(baseDateStr, 0), // Today
      dueTime: '04:00 PM',
      priority: 'medium',
      category: 'reading',
      completed: false,
      estimatedMinutes: 45,
      notes: 'Prepare brief summary notes on planar graph proofs.',
      createdDate: addDaysToDateStr(baseDateStr, -2)
    },
    {
      id: 'task-3',
      title: 'Lab 5 Pre-lab Quiz & Equipment Verification',
      courseId: 'course-phys210',
      dueDate: addDaysToDateStr(baseDateStr, 0), // Today
      dueTime: '06:00 PM',
      priority: 'low',
      category: 'lab',
      completed: true,
      estimatedMinutes: 30,
      notes: 'Check oscilloscope calibration steps before entering the lab.',
      createdDate: addDaysToDateStr(baseDateStr, -1)
    },
    {
      id: 'task-4',
      title: 'Draft Submission: Annotated Bibliography for Research Paper',
      courseId: 'course-eng105',
      dueDate: addDaysToDateStr(baseDateStr, 1), // Tomorrow
      dueTime: '11:59 PM',
      priority: 'high',
      category: 'assignment',
      completed: false,
      estimatedMinutes: 120,
      notes: 'Need at least 6 peer-reviewed citations formatted in APA 7.',
      createdDate: addDaysToDateStr(baseDateStr, -5)
    },
    {
      id: 'task-5',
      title: 'Discrete Math Quiz 3: Induction & Recursion',
      courseId: 'course-math204',
      dueDate: addDaysToDateStr(baseDateStr, 2), // In 2 days
      dueTime: '01:15 PM',
      priority: 'high',
      category: 'exam',
      completed: false,
      estimatedMinutes: 60,
      notes: 'In-class 20-minute closed-book quiz.',
      createdDate: addDaysToDateStr(baseDateStr, -3)
    },
    {
      id: 'task-6',
      title: 'Physics Circuit Simulation & Oscilloscope Report',
      courseId: 'course-phys210',
      dueDate: addDaysToDateStr(baseDateStr, 4), // In 4 days
      dueTime: '05:00 PM',
      priority: 'medium',
      category: 'lab',
      completed: false,
      estimatedMinutes: 75,
      notes: 'Include resonance frequency curves and uncertainty calculations.',
      createdDate: addDaysToDateStr(baseDateStr, -2)
    },
    {
      id: 'task-7',
      title: 'Midterm Review: Algorithms & Asymptotic Complexity',
      courseId: 'course-cs101',
      dueDate: addDaysToDateStr(baseDateStr, 7), // In 7 days
      dueTime: '10:00 AM',
      priority: 'high',
      category: 'exam',
      completed: false,
      estimatedMinutes: 180,
      notes: 'Covers Big-O proofs, sorting algorithms, and binary heap operations.',
      createdDate: addDaysToDateStr(baseDateStr, -1)
    },
    {
      id: 'task-8',
      title: 'Peer Review: Review 2 Classmate Essay Abstracts',
      courseId: 'course-eng105',
      dueDate: addDaysToDateStr(baseDateStr, 9), // In 9 days
      dueTime: '09:00 AM',
      priority: 'low',
      category: 'assignment',
      completed: false,
      estimatedMinutes: 40,
      notes: 'Provide structured feedback on clarity and thesis strength.',
      createdDate: addDaysToDateStr(baseDateStr, -1)
    }
  ];
}

export const SAMPLE_COURSES: Course[] = getSampleCourses();
export const SAMPLE_TASKS: Task[] = getSampleTasks();
