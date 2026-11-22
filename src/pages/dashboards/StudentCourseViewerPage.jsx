import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { getCatalogCourseById } from '../../data/courseCatalog';
import { getCurrentSession } from '../../data/authStorage';
import { getCompletedLessons, toggleLessonCompletion } from '../../data/progressStorage';

export default function StudentCourseViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getCurrentSession();
  const course = getCatalogCourseById(id);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'materials'
  const [completedList, setCompletedList] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (session?.fullName) {
      setStudentName(session.fullName);
    } else if (session?.email) {
      const namePart = session.email.split('@')[0];
      setStudentName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    }
  }, [session]);

  // Construct structured lessons from course syllabus or generate fallback lessons
  const modules = React.useMemo(() => {
    if (course?.syllabus && course.syllabus.length > 0) {
      return course.syllabus.map((m, mIdx) => ({
        title: m.title || `Module ${mIdx + 1}`,
        lessons: (m.lessons || []).map((l, lIdx) => ({
          id: `mod-${mIdx}-les-${lIdx}`,
          title: typeof l === 'string' ? l : (l.title || `Lesson ${lIdx + 1}`),
          duration: '15 mins',
          type: 'video',
          videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // Clean embedded video placeholder
          summary: `In this lesson, you will explore in-depth concepts, practical workflows, and real-world implementations of ${typeof l === 'string' ? l : l.title}.`,
        }))
      }));
    }
    // Fallback if no syllabus
    return [
      {
        title: 'Module 1: Getting Started & Foundations',
        lessons: [
          {
            id: 'mod-0-les-0',
            title: 'Welcome & Course Orientation',
            duration: '10 mins',
            type: 'video',
            summary: `Introduction to ${course?.title || 'this course'} and overview of learning outcomes.`
          },
          {
            id: 'mod-0-les-1',
            title: 'Core Concepts & Fundamentals',
            duration: '25 mins',
            type: 'video',
            summary: 'Understanding essential principles and setup.'
          }
        ]
      },
      {
        title: 'Module 2: Advanced Topics & Hands-on Project',
        lessons: [
          {
            id: 'mod-1-les-0',
            title: 'Practical Application & Architecture',
            duration: '30 mins',
            type: 'video',
            summary: 'Building and structuring your knowledge with practical exercises.'
          },
          {
            id: 'mod-1-les-1',
            title: 'Review, Testing & Summary',
            duration: '20 mins',
            type: 'video',
            summary: 'Final review and preparing for the course assessment.'
          }
        ]
      }
    ];
  }, [course]);

  const allLessons = React.useMemo(() => {
    return modules.flatMap((m) => m.lessons);
  }, [modules]);

  const totalLessonsCount = allLessons.length;

  // Load completed lessons
  useEffect(() => {
    if (session?.email && course?.id) {
      setCompletedList(getCompletedLessons(session.email, course.id));
    }
  }, [session?.email, course?.id]);

  // Set default selected lesson
  useEffect(() => {
    if (allLessons.length > 0 && !selectedLesson) {
      setSelectedLesson(allLessons[0]);
    }
  }, [allLessons, selectedLesson]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#07181E] text-white flex items-center justify-center p-6">
        <div className="bg-[#0D2229] border border-[#1D363E] p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-3">Course Not Found</h2>
          <p className="text-[#A9C0C7] text-sm mb-5">The course you are looking for does not exist.</p>
          <button onClick={() => navigate('/student/courses')} className="bg-[#4DE2BD] text-[#07181E] font-bold text-sm px-5 py-2.5 rounded-xl">
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const completedCount = completedList.length;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(1, totalLessonsCount)) * 100));

  const handleToggleLesson = (lessonId) => {
    if (!session?.email || !course?.id) return;
    const res = toggleLessonCompletion(session.email, course.id, lessonId, totalLessonsCount);
    setCompletedList(getCompletedLessons(session.email, course.id));
  };

  // Learning Materials
  const materials = [
    {
      id: 'mat-1',
      title: `${course.title} — Official Course Syllabus & Lecture Slides (PDF)`,
      size: '4.8 MB',
      type: 'PDF Document',
      icon: '📄'
    },
    {
      id: 'mat-2',
      title: 'Starter Code Templates & Project Repositories (ZIP)',
      size: '12.4 MB',
      type: 'Source Code Archive',
      icon: '📦'
    },
    {
      id: 'mat-3',
      title: 'Cheatsheet & Syntax Reference Guide (Markdown)',
      size: '850 KB',
      type: 'Reference Guide',
      icon: '📑'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <StudentSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} studentName={studentName} />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader setMobileOpen={setMobileOpen} studentName={studentName} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header breadcrumb & info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D363E]/60 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#A9C0C7] mb-1.5">
                <Link to="/student/courses" className="hover:text-[#4DE2BD] transition-colors">My Courses</Link>
                <span>/</span>
                <span className="text-white font-medium truncate max-w-xs">{course.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{course.title}</h1>
              <p className="text-xs sm:text-sm text-[#A9C0C7] mt-1">
                Instructor: <span className="text-white font-semibold">{course.instructor}</span> • {course.category}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/student/courses/${course.id}/quiz`)}
                className="bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] border border-[#4DE2BD]/30 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>Take Course Quiz</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Progress Banner */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between text-xs text-[#A9C0C7] mb-2">
                <span>Course Completion Progress</span>
                <span className="font-bold text-[#4DE2BD]">{progressPercent}% ({completedCount}/{totalLessonsCount} lessons completed)</span>
              </div>
              <div className="w-full h-2.5 bg-[#091B21] rounded-full overflow-hidden border border-[#1D363E]">
                <div
                  className="h-full bg-gradient-to-r from-[#4DE2BD] to-[#38BDF8] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {progressPercent === 100 && (
              <span className="bg-[#143C3A] text-[#4DE2BD] border border-[#4DE2BD]/40 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 flex items-center gap-1.5">
                <span>✓</span> Course Completed!
              </span>
            )}
          </div>

          {/* Tabs: Lessons / Materials */}
          <div className="flex gap-3 border-b border-[#1D363E]">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'lessons'
                  ? 'border-[#4DE2BD] text-[#4DE2BD]'
                  : 'border-transparent text-[#A9C0C7] hover:text-white'
              }`}
            >
              Lessons & Video Lectures
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'materials'
                  ? 'border-[#4DE2BD] text-[#4DE2BD]'
                  : 'border-transparent text-[#A9C0C7] hover:text-white'
              }`}
            >
              Learning Materials & Resources
            </button>
          </div>

          {activeTab === 'lessons' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Video Player & Active Lesson Info */}
              <div className="lg:col-span-7 xl:col-span-8 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="relative w-full aspect-video bg-[#07181E] rounded-xl overflow-hidden border border-[#1D363E]/80 shadow-inner flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#07181E] to-[#0D252E] p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#14323A] border border-[#4DE2BD]/40 flex items-center justify-center text-[#4DE2BD] mb-3 shadow-lg">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {selectedLesson?.title || 'Interactive Lesson Player'}
                    </h3>
                    <p className="text-xs text-[#A9C0C7] max-w-sm">
                      Streaming video lesson in HD quality with transcript & notes enabled.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#1D363E]/50">
                  <div>
                    <span className="text-[11px] font-semibold text-[#4DE2BD] uppercase tracking-wider">Current Lesson</span>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">{selectedLesson?.title}</h2>
                    <p className="text-xs text-[#A9C0C7] mt-1">{selectedLesson?.duration} • Video Lecture</p>
                  </div>

                  <button
                    onClick={() => selectedLesson && handleToggleLesson(selectedLesson.id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                      completedList.includes(selectedLesson?.id)
                        ? 'bg-[#143C3A] text-[#4DE2BD] border border-[#4DE2BD]/40 hover:bg-[#184643]'
                        : 'bg-[#4DE2BD] text-[#07181E] hover:bg-[#41D1AC] shadow-md'
                    }`}
                  >
                    <span>{completedList.includes(selectedLesson?.id) ? '✓ Completed' : 'Mark as Complete'}</span>
                  </button>
                </div>

                <div className="bg-[#091B21] border border-[#1D363E]/60 rounded-xl p-4 mt-2">
                  <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider text-[#A9C0C7]">Lesson Overview</h4>
                  <p className="text-xs sm:text-sm text-[#A9C0C7] leading-relaxed">
                    {selectedLesson?.summary}
                  </p>
                </div>
              </div>

              {/* Right: Lesson Playlist / Syllabus */}
              <div className="lg:col-span-5 xl:col-span-4 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 shadow-lg space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Curriculum & Lessons</span>
                  <span className="text-xs font-medium text-[#A9C0C7]">{completedCount}/{totalLessonsCount} Done</span>
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {modules.map((module, mIdx) => (
                    <div key={mIdx} className="border border-[#1D363E]/80 rounded-xl p-3 bg-[#091B21]/50">
                      <h4 className="text-xs font-bold text-white mb-2 text-[#4DE2BD]">{module.title}</h4>
                      <div className="space-y-1.5">
                        {module.lessons.map((lesson) => {
                          const isCompleted = completedList.includes(lesson.id);
                          const isSelected = selectedLesson?.id === lesson.id;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`p-2.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer text-xs transition-all border ${
                                isSelected
                                  ? 'bg-[#14323A] border-[#4DE2BD] text-white font-medium'
                                  : 'bg-[#0D2229] border-transparent hover:border-[#1D363E] text-[#A9C0C7] hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleLesson(lesson.id);
                                  }}
                                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                                    isCompleted
                                      ? 'bg-[#4DE2BD] border-[#4DE2BD] text-[#07181E] font-bold'
                                      : 'border-[#1D363E] hover:border-[#4DE2BD]'
                                  }`}
                                  title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  {isCompleted && '✓'}
                                </button>
                                <span className={`truncate ${isCompleted ? 'line-through text-[#A9C0C7]/70' : ''}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#A9C0C7] flex-shrink-0">{lesson.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Materials Tab */
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Course Learning Materials</h3>
                <p className="text-xs sm:text-sm text-[#A9C0C7] mt-1">
                  Download supplemental lecture slides, cheat sheets, code repositories, and reference guides.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {materials.map((mat) => (
                  <div key={mat.id} className="bg-[#091B21] border border-[#1D363E] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#29444C] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-2xl p-2 bg-[#14323A] rounded-lg border border-[#1D363E] flex-shrink-0">
                        {mat.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">{mat.title}</h4>
                        <p className="text-[11px] text-[#A9C0C7] mt-0.5">{mat.type} • {mat.size}</p>
                      </div>
                    </div>

                    <a
                      href="#download"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${mat.title}... (Demo download simulation)`);
                      }}
                      className="bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs px-3.5 py-2 rounded-lg border border-[#1D363E] transition-all flex-shrink-0"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
