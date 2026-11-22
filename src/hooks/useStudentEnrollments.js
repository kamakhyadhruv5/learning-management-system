import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentSession } from '../data/authStorage.js';
import { getStudentEnrollments } from '../data/enrollmentStorage.js';
import { getCatalogCourseById } from '../data/courseCatalog.js';
import { getCompletedLessons } from '../data/progressStorage.js';

/**
 * Hook that returns the logged‑in student's enrollments enriched with the full
 * catalog course information, real completed lessons, and recalculated progress.
 * It also refreshes when the `course_enrollments_updated` or `course_progress_updated`
 * event fires.
 */
export function useStudentEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const session = getCurrentSession();
    if (!session?.email) {
      setEnrollments([]);
      setLoading(false);
      return;
    }
    const raw = getStudentEnrollments(session.email);
    const enriched = raw.map((e) => {
      const catalogCourse = getCatalogCourseById(e.courseId);
      const totalLessons = catalogCourse?.lessonsCount || (catalogCourse?.syllabus ? catalogCourse.syllabus.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : 10);
      const completedLessonList = getCompletedLessons(session.email, e.courseId);
      
      // Calculate true progress from completed lessons if available, else fallback to stored progress
      const computedProgress = completedLessonList.length > 0
        ? Math.min(100, Math.round((completedLessonList.length / Math.max(1, totalLessons)) * 100))
        : (typeof e.progress === 'number' ? e.progress : 0);

      const status = computedProgress >= 100 ? 'Completed' : (computedProgress > 0 ? 'In Progress' : (e.status || 'Not Started'));

      return {
        ...e,
        courseId: e.courseId,
        id: e.id,
        status,
        progress: computedProgress,
        course: catalogCourse,
        title: catalogCourse?.title || 'Course Details Unavailable',
        instructor: catalogCourse?.instructor || 'Instructor unavailable',
        image: catalogCourse?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
        category: catalogCourse?.category || 'General',
        totalLessons,
        lessonsCompleted: completedLessonList.length > 0 ? completedLessonList.length : Math.round((computedProgress / 100) * totalLessons),
        completedLessonIds: completedLessonList,
        progressColor: computedProgress === 100 ? 'bg-[#4DE2BD]' : computedProgress > 0 ? 'bg-sky-400' : 'bg-amber-400',
        lastAccessed: 'Recently',
      };
    });
    setEnrollments(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener('course_enrollments_updated', handleUpdate);
    window.addEventListener('course_progress_updated', handleUpdate);
    return () => {
      window.removeEventListener('course_enrollments_updated', handleUpdate);
      window.removeEventListener('course_progress_updated', handleUpdate);
    };
  }, [load]);

  return { enrollments, loading, reload: load };
}
