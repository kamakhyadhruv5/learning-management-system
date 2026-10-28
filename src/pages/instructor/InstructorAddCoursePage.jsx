import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';
import InstructorHeader from '../../components/instructor/InstructorHeader';
import { addStoredCourse, COURSE_CATEGORIES, PRESET_IMAGES } from '../../data/courseStorage';

export default function InstructorAddCoursePage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [instructorName, setInstructorName] = useState('Instructor');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(COURSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('All Levels');
  const [duration, setDuration] = useState('24 hours');
  const [lessonsCount, setLessonsCount] = useState(10);
  const [status, setStatus] = useState('Published');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.fullName) {
          setInstructorName(user.fullName);
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          setInstructorName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {}
    }
  }, []);

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
    if (!validate()) {
      return;
    }

    const newCourse = addStoredCourse({
      title: title.trim(),
      category,
      description: description.trim(),
      level,
      duration: duration.trim() || '10 hours',
      lessonsCount: Number(lessonsCount),
      status,
      image: imageUrl.trim(),
    });

    setCreatedCourse(newCourse);
    setShowSuccessModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setCategory(COURSE_CATEGORIES[0]);
    setDescription('');
    setLevel('All Levels');
    setDuration('24 hours');
    setLessonsCount(10);
    setStatus('Published');
    setImageUrl(PRESET_IMAGES[0]);
    setErrors({});
    setShowSuccessModal(false);
    setCreatedCourse(null);
  };

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <InstructorSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        instructorName={instructorName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <InstructorHeader
          setMobileOpen={setMobileOpen}
          instructorName={instructorName}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          <div className="flex items-center justify-between bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8">
            <div>
              <span className="text-[#4DE2BD] text-xs font-bold tracking-widest uppercase">
                Curriculum Creation
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Add New Course
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm mt-1">
                Provide the details, thumbnail, and metadata for your new curriculum.
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

          {Object.keys(errors).length > 0 && (
            <div className="bg-rose-950/30 border border-rose-800/60 text-rose-300 rounded-2xl p-4 text-xs sm:text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold">Please correct the highlighted errors before submitting:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-200/90">
                  {Object.values(errors).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A9C0C7] mb-2">
                    Initial Course Status
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
                        Published (Live immediately)
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
                        Draft (Work in progress)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1D363E] flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create & Save Course</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3.5 text-xs font-semibold text-[#A9C0C7] hover:text-white bg-[#07181E] border border-[#1D363E] rounded-xl hover:bg-[#10272F] transition-all"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

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
                  This preview illustrates how your course appears to learners and in your catalog.
                </p>

                <div className="bg-[#07181E] border border-[#1D363E] rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-48 w-full bg-[#091B21] overflow-hidden">
                    <img
                      src={imageUrl || PRESET_IMAGES[0]}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = PRESET_IMAGES[0];
                      }}
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
                      {description.trim() || 'Course summary and description will appear here as you type in the form...'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1D363E]/60 text-xs text-[#A9C0C7]">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>0 Students</span>
                      </div>
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

          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#143e39] text-[#4DE2BD] flex items-center justify-center mx-auto mb-4 border border-[#4DE2BD]/30">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Course Created Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-[#A9C0C7] mb-6 leading-relaxed">
                  <strong className="text-white">"{createdCourse?.title}"</strong> has been saved into your course catalog as <span className="text-[#4DE2BD] font-semibold">{createdCourse?.status}</span>.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/instructor/courses')}
                    className="w-full bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm py-3 rounded-xl transition-all shadow-md"
                  >
                    View in My Courses
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full bg-[#07181E] hover:bg-[#10272F] text-[#A9C0C7] hover:text-white text-xs font-semibold py-2.5 rounded-xl border border-[#1D363E] transition-all"
                  >
                    Create Another Course
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
