import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentSession } from '../data/authStorage.js';
import { getStudentEnrollments } from '../data/enrollmentStorage.js';
import { getCatalogCourseById } from '../data/courseCatalog.js';

/**
 * Hook that returns the logged‑in student's enrollments enriched with the full
 * catalog course information. It also refreshes when the `course_enrollments_updated`
 * event fires (dispatched by `saveEnrollment`).
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
      return {
        ...e,
        courseId: e.courseId,
        id: e.id,
        status: e.status || 'In Progress',
        progress: typeof e.progress === 'number' ? e.progress : 0,
        course: catalogCourse,
        // Provide standard fields for UI consumption
        title: catalogCourse?.title || 'Course Details Unavailable',
        instructor: catalogCourse?.instructor || 'Instructor unavailable',
        image: catalogCourse?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
        category: catalogCourse?.category || 'General',
        totalLessons: catalogCourse?.lessonsCount || 0,
        lessonsCompleted: catalogCourse?.lessonsCount ? Math.round(((e.progress || 0) / 100) * catalogCourse.lessonsCount) : 0,
        progressColor: e.progress === 100 ? 'bg-[#4DE2BD]' : e.progress > 0 ? 'bg-sky-400' : 'bg-amber-400',
        lastAccessed: 'Recently',
      };
    });
    setEnrollments(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('course_enrollments_updated', handler);
    return () => window.removeEventListener('course_enrollments_updated', handler);
  }, [load]);

  return { enrollments, loading, reload: load };
}
