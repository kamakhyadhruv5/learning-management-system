import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';
import InstructorHeader from '../../components/instructor/InstructorHeader';
import {
  getStoredCourseById,
  updateStoredCourse,
  COURSE_CATEGORIES,
  PRESET_IMAGES,
} from '../../data/courseStorage';

export default function InstructorEditCoursePage() {
  const navigate = useNavigate();
  const { id: courseId } = useParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [instructorName, setInstructorName] = useState('Instructor');
  const [currentUserId, setCurrentUserId] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(COURSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('All Levels');
  const [duration, setDuration] = useState('24 hours');
  const [lessonsCount, setLessonsCount] = useState(10);
  const [status, setStatus] = useState('Published');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);

  // Page state
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedTitle, setSavedTitle] = useState('');

  useEffect(() => {
    // Read current user
    let userId = '';
    let userName = 'Instructor';
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id || '';
        if (user.fullName) {
          userName = user.fullName;
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
      }
    } catch (_) {}

    setCurrentUserId(userId);
    setInstructorName(userName);

    // Load the course to edit
    const course = getStoredCourseById(courseId);
    if (!course) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Ownership check: only enforce if the course has an instructorId recorded
    if (course.instructorId && userId && course.instructorId !== userId) {
      setNotAuthorized(true);
      setLoading(false);
      return;
    }

    // Pre-fill form
    setTitle(course.title || '');
    setCategory(course.category || COURSE_CATEGORIES[0]);
    setDescription(course.description || '');
    setLevel(course.level || 'All Levels');
    setDuration(course.duration || '24 hours');
    setLessonsCount(course.lessonsCount ?? 10);
    setStatus(course.status || 'Published');
    setImageUrl(course.image || PRESET_IMAGES[0]);
    setLoading(false);
  }, [courseId]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Course title is required.';
    } else if (title.trim().length < 4) {
      newErrors.title = 'Course title must be at least 4 characters long.';
    }
    if (!category) {
      newErrors.category = 'Please select a category.';
    }
    if (!description.trim()) {
      newErrors.description = 'Course description is required.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters long.';
    }
    if (!lessonsCount || Number(lessonsCount) < 1) {
      newErrors.lessonsCount = 'At least 1 lesson is required.';
    }
    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Course image URL is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateStoredCourse(courseId, {
      title: title.trim(),
      category,
      description: description.trim(),
      level,
      duration: duration.trim() || '10 hours',
      lessonsCount: Number(lessonsCount),
      status,
      image: imageUrl.trim(),
      // Preserve instructor display name; do not overwrite instructorId
      instructor: instructorName,
    });

    setSavedTitle(title.trim());
    setShowSuccessModal(true);
  };

  // ── Guard: loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07181E] text-white flex items-center justify-center">
        <p className="text-[#A9C0C7] text-sm">Loading course…</p>
      </div>
    );
  }

  // ── Guard: course not found ───────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#07181E] text-white flex">
        <InstructorSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          instructorName={instructorName}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <InstructorHeader setMobileOpen={setMobileOpen} instructorName={instructorName} />
          <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-rose-950/40 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Course Not Found</h2>
            <p className="text-sm text-[#A9C0C7]">
              The course you are trying to edit does not exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/instructor/courses')}
              className="mt-2 bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
            >
              Back to My Courses
            </button>
          </main>
        </div>
      </div>
    );
  }

  // ── Guard: not authorized ─────────────────────────────────────────────────
  if (notAuthorized) {
    return (
      <div className="min-h-screen bg-[#07181E] text-white flex">
        <InstructorSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          instructorName={instructorName}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <InstructorHeader setMobileOpen={setMobileOpen} instructorName={instructorName} />
          <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-rose-950/40 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Not Authorized</h2>
            <p className="text-sm text-[#A9C0C7] max-w-sm text-center">
              You can only edit courses that belong to you. This course was created by a different instructor.
            </p>
            <button
              onClick={() => navigate('/instructor/courses')}
              className="mt-2 bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
            >
              Back to My Courses
            </button>
          </main>
        </div>
      </div>
    );
  }

  // ── Main edit form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <InstructorSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        instructorName={instructorName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <InstructorHeader setMobileOpen={setMobileOpen} instructorName={instructorName} />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Page header */}
          <div className="flex items-center justify-between bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8">
            <div>
              <span className="text-[#4DE2BD] text-xs font-bold tracking-widest uppercase">
                Curriculum Editing
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Edit Course
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm mt-1">
                Update the details, thumbnail, and metadata for this course.
              </p>
            </div>
            <button
              onClick={() => navigate('/instructor/courses')}
              className="text-xs font-semibold text-[#A9C0C7] hover:text-white bg-[#07181E] border border-[#1D363E] px-4 py-2.5 rounded-xl hover:bg-[#10272F] transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Courses</span>
            </button>
          </div>

          {/* Validation error summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-rose-950/30 border border-rose-800/60 text-rose-300 rounded-2xl p-4 text-xs sm:text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold">Please correct the highlighted errors before saving:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-200/90">
                  {Object.values(errors).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7 bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: null });
                    }}
                    placeholder="e.g. Full-Stack Web Development Mastery"
                    className={`w-full bg-[#07181E] border ${
                      errors.title ? 'border-rose-500' : 'border-[#1D363E]'
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors`}
                  />
                  {errors.title && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.title}</p>
                  )}
                </div>

                {/* Category + Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#07181E] border border-[#1D363E] text-sm text-white rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-[#4DE2BD] transition-colors cursor-pointer"
                      >
                        {COURSE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#A9C0C7]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                      Difficulty Level
                    </label>
                    <div className="relative">
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-[#07181E] border border-[#1D363E] text-sm text-white rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-[#4DE2BD] transition-colors cursor-pointer"
                      >
                        <option value="All Levels">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Beginner to Advanced">Beginner to Advanced</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#A9C0C7]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                    Course Description *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) setErrors({ ...errors, description: null });
                    }}
                    placeholder="Provide a comprehensive summary of what students will achieve in this course..."
                    className={`w-full bg-[#07181E] border ${
                      errors.description ? 'border-rose-500' : 'border-[#1D363E]'
                    } rounded-xl p-4 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors resize-y`}
                  />
                  {errors.description && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.description}</p>
                  )}
                </div>

                {/* Duration + Lessons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                      Total Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 28 hours"
                      className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-3 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                      Number of Lessons *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={lessonsCount}
                      onChange={(e) => {
                        setLessonsCount(e.target.value);
                        if (errors.lessonsCount) setErrors({ ...errors, lessonsCount: null });
                      }}
                      className={`w-full bg-[#07181E] border ${
                        errors.lessonsCount ? 'border-rose-500' : 'border-[#1D363E]'
                      } rounded-xl px-4 py-3 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors`}
                    />
                    {errors.lessonsCount && (
                      <p className="text-rose-400 text-xs mt-1.5">{errors.lessonsCount}</p>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                    Course Thumbnail URL *
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (errors.imageUrl) setErrors({ ...errors, imageUrl: null });
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full bg-[#07181E] border ${
                      errors.imageUrl ? 'border-rose-500' : 'border-[#1D363E]'
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors`}
                  />
                  {errors.imageUrl && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.imageUrl}</p>
                  )}

                  <div className="mt-3">
                    <span className="text-[11px] font-semibold text-[#A9C0C7]/70 block mb-2">
                      Or select from pre-approved thumbnails:
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setImageUrl(img)}
                          className={`h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            imageUrl === img
                              ? 'border-[#4DE2BD] ring-2 ring-[#4DE2BD]/30 scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                    Course Status
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-[#07181E] border border-[#1D363E] px-4 py-3 rounded-xl hover:border-[#4DE2BD]/40 transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="Published"
                        checked={status === 'Published'}
                        onChange={() => setStatus('Published')}
                        className="accent-[#4DE2BD] w-4 h-4"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        Published (Live)
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer bg-[#07181E] border border-[#1D363E] px-4 py-3 rounded-xl hover:border-[#4DE2BD]/40 transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="Draft"
                        checked={status === 'Draft'}
                        onChange={() => setStatus('Draft')}
                        className="accent-[#4DE2BD] w-4 h-4"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        Draft (Hidden)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#1D363E] flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/instructor/courses')}
                    className="px-5 py-3.5 text-xs font-semibold text-[#A9C0C7] hover:text-white bg-[#07181E] border border-[#1D363E] rounded-xl hover:bg-[#10272F] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Live preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 shadow-xl sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Live Card Preview
                  </h3>
                  <span className="text-[11px] font-bold text-[#4DE2BD] bg-[#143e39] px-2.5 py-1 rounded-full border border-[#4DE2BD]/30">
                    Preview Mode
                  </span>
                </div>
                <p className="text-xs text-[#A9C0C7] mb-4">
                  This preview shows how your updated course will appear to learners.
                </p>

                <div className="bg-[#07181E] border border-[#1D363E] rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-48 w-full bg-[#091B21] overflow-hidden">
                    <img
                      src={imageUrl || PRESET_IMAGES[0]}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = PRESET_IMAGES[0]; }}
                    />
                    <span className="absolute top-3 left-3 bg-[#07181E]/80 backdrop-blur-md border border-[#1D363E] text-[#4DE2BD] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {category}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md ${
                        status === 'Published'
                          ? 'bg-[#143e39]/90 text-[#4DE2BD] border border-[#4DE2BD]/40'
                          : 'bg-[#2a2216]/90 text-[#fbbf24] border border-[#fbbf24]/40'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h4 className="text-base font-bold text-white mb-2 line-clamp-1">
                      {title.trim() || 'Untitled Course Title'}
                    </h4>
                    <p className="text-xs text-[#A9C0C7] line-clamp-3 mb-4 leading-relaxed">
                      {description.trim() || 'Course description will appear here as you type…'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1D363E]/60 text-xs text-[#A9C0C7]">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{lessonsCount || 1} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{duration || '10 hours'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#143e39] text-[#4DE2BD] flex items-center justify-center mx-auto mb-4 border border-[#4DE2BD]/30">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Course Updated Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-[#A9C0C7] mb-6 leading-relaxed">
                  <strong className="text-white">"{savedTitle}"</strong> has been updated and saved as{' '}
                  <span className="text-[#4DE2BD] font-semibold">{status}</span>.
                  {status === 'Published'
                    ? ' Changes are now live in the course catalog.'
                    : ' The course is hidden from the public catalog while in Draft.'}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/instructor/courses')}
                    className="w-full bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm py-3 rounded-xl transition-all shadow-md"
                  >
                    View in My Courses
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-[#07181E] hover:bg-[#10272F] text-[#A9C0C7] hover:text-white text-xs font-semibold py-2.5 rounded-xl border border-[#1D363E] transition-all"
                  >
                    Continue Editing
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
