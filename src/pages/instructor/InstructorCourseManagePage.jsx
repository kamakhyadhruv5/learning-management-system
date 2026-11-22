import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';
import InstructorHeader from '../../components/instructor/InstructorHeader';
import {
  getStoredCourses,
  addCourseLesson,
  updateCourseLesson,
  deleteCourseLesson,
} from '../../data/courseStorage';
import {
  getMaterialsByCourse,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  MATERIAL_TYPES,
} from '../../data/materialStorage';
import {
  getQuizzesByCourse,
  saveQuiz,
  deleteQuiz,
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
} from '../../data/quizStorage';

export default function InstructorCourseManagePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [instructorName, setInstructorName] = useState('Instructor');
  const [currentUserId, setCurrentUserId] = useState('');

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'materials' | 'quizzes'

  // Course content state
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Modals & form state
  const [lessonModal, setLessonModal] = useState({ open: false, mode: 'add', lesson: null });
  const [lessonForm, setLessonForm] = useState({ title: '', duration: '45 mins', description: '', order: 1 });

  const [materialModal, setMaterialModal] = useState({ open: false, mode: 'add', material: null });
  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'pdf',
    lessonId: '',
    url: '',
    fileSize: '1.5 MB',
    description: '',
  });

  const [quizModal, setQuizModal] = useState({ open: false, mode: 'add', quiz: null });
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    duration: 15,
    totalMarks: 30,
    passingMarks: 20,
    status: 'Published',
  });

  const [questionManager, setQuestionManager] = useState({ open: false, quiz: null });
  const [questionModal, setQuestionModal] = useState({ open: false, mode: 'add', question: null });
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 10,
    explanation: '',
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type: 'lesson'|'material'|'quiz'|'question', id, title, parentId? }
  const [feedbackMessage, setFeedbackMessage] = useState(null); // { type: 'success'|'error', text }

  // Load instructor data and courses
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) setCurrentUserId(user.id);
        if (user.fullName) setInstructorName(user.fullName);
        else if (user.email) {
          const namePart = user.email.split('@')[0];
          setInstructorName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {}
    }

    const loadAllData = () => {
      const allCourses = getStoredCourses();
      setCourses(allCourses);

      const requestedId = searchParams.get('courseId');
      if (requestedId && allCourses.some((c) => c.id === requestedId)) {
        setSelectedCourseId(requestedId);
      } else if (allCourses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(allCourses[0].id);
      }
    };

    loadAllData();

    const handleDataUpdate = () => loadAllData();
    window.addEventListener('instructor_courses_updated', handleDataUpdate);
    window.addEventListener('course_materials_updated', handleDataUpdate);
    window.addEventListener('course_quizzes_updated', handleDataUpdate);

    return () => {
      window.removeEventListener('instructor_courses_updated', handleDataUpdate);
      window.removeEventListener('course_materials_updated', handleDataUpdate);
      window.removeEventListener('course_quizzes_updated', handleDataUpdate);
    };
  }, [searchParams]);

  // Load course-specific lessons, materials, quizzes when course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    const currentCourse = courses.find((c) => c.id === selectedCourseId);
    setLessons(currentCourse?.lessons || []);
    setMaterials(getMaterialsByCourse(selectedCourseId));
    setQuizzes(getQuizzesByCourse(selectedCourseId));

    if (questionManager.open && questionManager.quiz) {
      const updatedQuiz = getQuizzesByCourse(selectedCourseId).find((q) => q.id === questionManager.quiz.id);
      setQuestionManager((prev) => ({ ...prev, quiz: updatedQuiz || null }));
    }
  }, [selectedCourseId, courses]);

  const handleSelectCourse = (id) => {
    setSelectedCourseId(id);
    setSearchParams({ courseId: id });
    setFeedbackMessage(null);
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const isCourseOwner = !selectedCourse?.instructorId || !currentUserId || selectedCourse.instructorId === currentUserId;

  const showFeedback = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // ==========================================
  // Lesson Handlers
  // ==========================================
  const handleOpenAddLesson = () => {
    setLessonForm({
      title: '',
      duration: '45 mins',
      description: '',
      order: lessons.length + 1,
    });
    setLessonModal({ open: true, mode: 'add', lesson: null });
  };

  const handleOpenEditLesson = (lesson) => {
    setLessonForm({
      title: lesson.title || '',
      duration: lesson.duration || '30 mins',
      description: lesson.description || '',
      order: lesson.order || 1,
    });
    setLessonModal({ open: true, mode: 'edit', lesson });
  };

  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      showFeedback('Lesson title is required.', 'error');
      return;
    }

    if (lessonModal.mode === 'add') {
      addCourseLesson(selectedCourseId, lessonForm);
      showFeedback('New lesson added successfully!');
    } else {
      updateCourseLesson(selectedCourseId, lessonModal.lesson.id, lessonForm);
      showFeedback('Lesson updated successfully!');
    }

    setLessonModal({ open: false, mode: 'add', lesson: null });
  };

  // ==========================================
  // Material Handlers
  // ==========================================
  const handleOpenAddMaterial = () => {
    setMaterialForm({
      title: '',
      type: 'pdf',
      lessonId: lessons.length > 0 ? lessons[0].id : '',
      url: '',
      fileSize: '2.0 MB',
      description: '',
    });
    setMaterialModal({ open: true, mode: 'add', material: null });
  };

  const handleOpenEditMaterial = (material) => {
    setMaterialForm({
      title: material.title || '',
      type: material.type || 'pdf',
      lessonId: material.lessonId || '',
      url: material.url || '',
      fileSize: material.fileSize || '1.0 MB',
      description: material.description || '',
    });
    setMaterialModal({ open: true, mode: 'edit', material });
  };

  const handleSaveMaterial = (e) => {
    e.preventDefault();
    if (!materialForm.title.trim()) {
      showFeedback('Material title is required.', 'error');
      return;
    }

    const matchedLesson = lessons.find((l) => l.id === materialForm.lessonId);
    const payload = {
      ...materialForm,
      courseId: selectedCourseId,
      lessonTitle: matchedLesson ? matchedLesson.title : 'General Course Material',
      instructor: instructorName,
      instructorId: currentUserId,
    };

    if (materialModal.mode === 'add') {
      addMaterial(payload);
      showFeedback('Learning material added and linked to course!');
    } else {
      updateMaterial(materialModal.material.id, payload);
      showFeedback('Learning material updated successfully!');
    }

    setMaterialModal({ open: false, mode: 'add', material: null });
  };

  // ==========================================
  // Quiz Handlers
  // ==========================================
  const handleOpenAddQuiz = () => {
    setQuizForm({
      title: '',
      description: '',
      duration: 15,
      totalMarks: 30,
      passingMarks: 20,
      status: 'Published',
    });
    setQuizModal({ open: true, mode: 'add', quiz: null });
  };

  const handleOpenEditQuiz = (quiz) => {
    setQuizForm({
      title: quiz.title || '',
      description: quiz.description || '',
      duration: quiz.duration || 15,
      totalMarks: quiz.totalMarks || 30,
      passingMarks: quiz.passingMarks || 20,
      status: quiz.status || 'Published',
    });
    setQuizModal({ open: true, mode: 'edit', quiz });
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      showFeedback('Quiz title is required.', 'error');
      return;
    }

    const payload = {
      ...quizForm,
      id: quizModal.quiz?.id,
      courseId: selectedCourseId,
      courseTitle: selectedCourse?.title || '',
      instructor: instructorName,
      instructorId: currentUserId,
      questions: quizModal.quiz?.questions || [],
    };

    saveQuiz(payload);
    showFeedback(quizModal.mode === 'add' ? 'New quiz created successfully!' : 'Quiz settings saved!');
    setQuizModal({ open: false, mode: 'add', quiz: null });
  };

  const handleToggleQuizStatus = (quiz) => {
    const nextStatus = quiz.status === 'Published' ? 'Draft' : 'Published';
    saveQuiz({ ...quiz, status: nextStatus });
    showFeedback(`Quiz is now set to ${nextStatus}.`);
  };

  // ==========================================
  // Question Handlers
  // ==========================================
  const handleOpenAddQuestion = () => {
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 10,
      explanation: '',
    });
    setQuestionModal({ open: true, mode: 'add', question: null });
  };

  const handleOpenEditQuestion = (question) => {
    setQuestionForm({
      question: question.question || '',
      options: question.options?.length >= 2 ? [...question.options] : ['', '', '', ''],
      correctAnswer: question.correctAnswer || 0,
      marks: question.marks || 10,
      explanation: question.explanation || '',
    });
    setQuestionModal({ open: true, mode: 'edit', question });
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!questionForm.question.trim()) {
      showFeedback('Question statement cannot be empty.', 'error');
      return;
    }

    const validOptions = questionForm.options.map((opt) => opt.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      showFeedback('At least 2 non-empty answer options are required.', 'error');
      return;
    }

    if (questionForm.correctAnswer >= validOptions.length) {
      showFeedback('Please select a valid correct answer option.', 'error');
      return;
    }

    const payload = {
      ...questionForm,
      options: validOptions,
    };

    if (questionModal.mode === 'add') {
      addQuizQuestion(questionManager.quiz.id, payload);
      showFeedback('Question added to quiz!');
    } else {
      updateQuizQuestion(questionManager.quiz.id, questionModal.question.id, payload);
      showFeedback('Question updated!');
    }

    setQuestionModal({ open: false, mode: 'add', question: null });
  };

  // ==========================================
  // General Delete Execution
  // ==========================================
  const executeDelete = () => {
    if (!deleteConfirmation) return;
    const { type, id, parentId } = deleteConfirmation;

    if (type === 'lesson') {
      deleteCourseLesson(selectedCourseId, id);
      showFeedback('Lesson removed from course.');
    } else if (type === 'material') {
      deleteMaterial(id);
      showFeedback('Learning material deleted.');
    } else if (type === 'quiz') {
      deleteQuiz(id);
      showFeedback('Quiz deleted.');
    } else if (type === 'question') {
      deleteQuizQuestion(parentId, id);
      showFeedback('Question deleted from quiz.');
    }

    setDeleteConfirmation(null);
  };

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
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div>
              <span className="text-[#4DE2BD] text-xs font-bold tracking-widest uppercase">
                Curriculum Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Course Content Management
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm mt-1 max-w-xl">
                Organize lessons, publish downloadable learning materials, and author interactive quizzes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/instructor/courses')}
                className="bg-[#07181E] hover:bg-[#10272F] text-[#A9C0C7] hover:text-white font-semibold text-xs px-4 py-3 rounded-xl border border-[#1D363E] transition-all flex items-center gap-1.5"
              >
                <span>← All Courses</span>
              </button>
              {selectedCourse && (
                <button
                  onClick={() => navigate(`/instructor/courses/edit/${selectedCourse.id}`)}
                  className="bg-[#14323A] hover:bg-[#1a4049] text-[#4DE2BD] font-bold text-xs px-4 py-3 rounded-xl border border-[#4DE2BD]/30 transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Metadata</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Toast */}
          {feedbackMessage && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between border ${
                feedbackMessage.type === 'error'
                  ? 'bg-rose-950/50 border-rose-800 text-rose-300'
                  : 'bg-[#143e39]/80 border-[#4DE2BD]/40 text-[#4DE2BD]'
              }`}
            >
              <span>{feedbackMessage.text}</span>
              <button onClick={() => setFeedbackMessage(null)} className="font-bold opacity-70 hover:opacity-100">
                ✕
              </button>
            </div>
          )}

          {/* Course Selector Dropdown & Overview Bar */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 min-w-0">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A9C0C7] flex-shrink-0">
                Active Course:
              </label>
              <div className="relative flex-1 max-w-md w-full">
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleSelectCourse(e.target.value)}
                  className="w-full bg-[#07181E] border border-[#1D363E] text-sm text-white rounded-xl px-4 py-2.5 pr-10 appearance-none focus:outline-none focus:border-[#4DE2BD] cursor-pointer"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.status})
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

            {selectedCourse && (
              <div className="flex items-center gap-4 text-xs text-[#A9C0C7] flex-wrap">
                <span className="bg-[#07181E] px-3 py-1.5 rounded-lg border border-[#1D363E]">
                  Category: <strong className="text-white">{selectedCourse.category}</strong>
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg border font-bold ${
                    selectedCourse.status === 'Published'
                      ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/30'
                      : 'bg-[#2a2216] text-[#fbbf24] border-[#fbbf24]/30'
                  }`}
                >
                  {selectedCourse.status}
                </span>
              </div>
            )}
          </div>

          {!selectedCourse ? (
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-12 text-center">
              <p className="text-[#A9C0C7] text-sm mb-4">No course available to manage.</p>
              <button
                onClick={() => navigate('/instructor/courses/add')}
                className="bg-[#4DE2BD] text-[#07181E] font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                Create a Course First
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Content Navigation Tabs */}
              <div className="flex items-center gap-3 border-b border-[#1D363E] pb-3">
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'lessons'
                      ? 'bg-[#123835] text-[#4DE2BD] border border-[#4DE2BD]/40 shadow-sm'
                      : 'text-[#A9C0C7] hover:text-white hover:bg-[#10272F]'
                  }`}
                >
                  <span>📚 Lessons ({lessons.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'materials'
                      ? 'bg-[#123835] text-[#4DE2BD] border border-[#4DE2BD]/40 shadow-sm'
                      : 'text-[#A9C0C7] hover:text-white hover:bg-[#10272F]'
                  }`}
                >
                  <span>📎 Materials & Resources ({materials.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'quizzes'
                      ? 'bg-[#123835] text-[#4DE2BD] border border-[#4DE2BD]/40 shadow-sm'
                      : 'text-[#A9C0C7] hover:text-white hover:bg-[#10272F]'
                  }`}
                >
                  <span>📝 Quizzes & Assessments ({quizzes.length})</span>
                </button>
              </div>

              {/* ========================================================
                  TAB 1: LESSONS MANAGEMENT
                 ======================================================== */}
              {activeTab === 'lessons' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Course Lessons</h3>
                      <p className="text-xs text-[#A9C0C7]">
                        Define sequential lecture topics and modules for students.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddLesson}
                      className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Lesson</span>
                    </button>
                  </div>

                  {lessons.length === 0 ? (
                    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-10 text-center">
                      <p className="text-sm text-[#A9C0C7] mb-3">No lessons created for this course yet.</p>
                      <button
                        onClick={handleOpenAddLesson}
                        className="bg-[#14323A] hover:bg-[#1f4752] text-[#4DE2BD] text-xs font-bold px-4 py-2 rounded-xl border border-[#4DE2BD]/30"
                      >
                        + Create Lesson 1
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lessons.map((lesson, idx) => {
                        const lessonMaterials = materials.filter((m) => m.lessonId === lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 hover:border-[#29444C] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-[#14323A] text-[#4DE2BD] font-black flex items-center justify-center flex-shrink-0 text-sm border border-[#4DE2BD]/30">
                                {idx + 1}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h4 className="text-sm sm:text-base font-bold text-white truncate">
                                    {lesson.title}
                                  </h4>
                                  <span className="text-[11px] text-[#A9C0C7] bg-[#07181E] px-2.5 py-0.5 rounded-md border border-[#1D363E]">
                                    ⏱ {lesson.duration || '30 mins'}
                                  </span>
                                  {lessonMaterials.length > 0 && (
                                    <span className="text-[11px] text-[#4DE2BD] bg-[#143e39] px-2.5 py-0.5 rounded-md border border-[#4DE2BD]/30">
                                      📎 {lessonMaterials.length} materials
                                    </span>
                                  )}
                                </div>
                                {lesson.description && (
                                  <p className="text-xs text-[#A9C0C7] mt-1.5 line-clamp-2">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                              <button
                                onClick={() => handleOpenEditLesson(lesson)}
                                className="p-2 text-xs rounded-xl bg-[#07181E] text-[#A9C0C7] hover:text-white border border-[#1D363E] hover:border-[#4DE2BD]/40 transition-all flex items-center gap-1"
                              >
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirmation({
                                    type: 'lesson',
                                    id: lesson.id,
                                    title: lesson.title,
                                  })
                                }
                                className="p-2 text-xs rounded-xl bg-[#07181E] text-rose-400 hover:text-rose-300 border border-[#1D363E] hover:border-rose-800/40 transition-all"
                              >
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 2: MATERIALS MANAGEMENT
                 ======================================================== */}
              {activeTab === 'materials' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Course Materials & Downloads</h3>
                      <p className="text-xs text-[#A9C0C7]">
                        Upload documents, slides, code repositories, and external resource links for students.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddMaterial}
                      className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Material</span>
                    </button>
                  </div>

                  {materials.length === 0 ? (
                    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-10 text-center">
                      <p className="text-sm text-[#A9C0C7] mb-3">No learning materials added for this course.</p>
                      <button
                        onClick={handleOpenAddMaterial}
                        className="bg-[#14323A] hover:bg-[#1f4752] text-[#4DE2BD] text-xs font-bold px-4 py-2 rounded-xl border border-[#4DE2BD]/30"
                      >
                        + Add First Material
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {materials.map((mat) => {
                        const typeInfo = MATERIAL_TYPES.find((t) => t.value === mat.type) || {
                          icon: '📄',
                          label: 'Document',
                        };
                        return (
                          <div
                            key={mat.id}
                            className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 hover:border-[#29444C] transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#14323A] text-[#4DE2BD] border border-[#4DE2BD]/20">
                                  <span>{typeInfo.icon}</span>
                                  <span>{typeInfo.label}</span>
                                </span>
                                <span className="text-[11px] text-[#A9C0C7]">{mat.fileSize || '1.0 MB'}</span>
                              </div>

                              <h4 className="text-sm font-bold text-white mb-1.5">{mat.title}</h4>
                              <p className="text-xs text-[#4DE2BD] mb-2 font-medium">
                                📌 {mat.lessonTitle || 'General Course Material'}
                              </p>
                              {mat.description && (
                                <p className="text-xs text-[#A9C0C7] line-clamp-2 mb-4 leading-relaxed">
                                  {mat.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-[#1D363E]/60">
                              <a
                                href={mat.url || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-[#4DE2BD] hover:underline flex items-center gap-1"
                              >
                                <span>Access Resource</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenEditMaterial(mat)}
                                  className="text-xs text-[#A9C0C7] hover:text-white px-2.5 py-1 rounded-lg hover:bg-[#07181E] border border-[#1D363E]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: 'material',
                                      id: mat.id,
                                      title: mat.title,
                                    })
                                  }
                                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-950/40"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 3: QUIZZES MANAGEMENT
                 ======================================================== */}
              {activeTab === 'quizzes' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Course Quizzes & Assessments</h3>
                      <p className="text-xs text-[#A9C0C7]">
                        Create self-grading multiple choice quizzes, configure marks, and manage questions.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddQuiz}
                      className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Quiz</span>
                    </button>
                  </div>

                  {quizzes.length === 0 ? (
                    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-10 text-center">
                      <p className="text-sm text-[#A9C0C7] mb-3">No quizzes created for this course yet.</p>
                      <button
                        onClick={handleOpenAddQuiz}
                        className="bg-[#14323A] hover:bg-[#1f4752] text-[#4DE2BD] text-xs font-bold px-4 py-2 rounded-xl border border-[#4DE2BD]/30"
                      >
                        + Create First Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quizzes.map((quiz) => {
                        const questionCount = quiz.questions?.length || 0;
                        return (
                          <div
                            key={quiz.id}
                            className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 hover:border-[#29444C] transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                                <h4 className="text-base font-bold text-white">{quiz.title}</h4>
                                <button
                                  onClick={() => handleToggleQuizStatus(quiz)}
                                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                                    quiz.status === 'Published'
                                      ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/30 hover:bg-[#194c45]'
                                      : 'bg-[#2a2216] text-[#fbbf24] border-[#fbbf24]/30 hover:bg-[#382d1c]'
                                  }`}
                                >
                                  ● {quiz.status}
                                </button>
                              </div>

                              <p className="text-xs text-[#A9C0C7] mb-3 line-clamp-1">{quiz.description}</p>

                              <div className="flex items-center gap-4 text-xs text-[#A9C0C7] flex-wrap">
                                <span>❓ {questionCount} Questions</span>
                                <span>⏱ {quiz.duration || 15} Mins</span>
                                <span>🎯 Total: <strong className="text-white">{quiz.totalMarks} pts</strong></span>
                                <span>✅ Pass: <strong className="text-white">{quiz.passingMarks} pts</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 flex-wrap">
                              <button
                                onClick={() => setQuestionManager({ open: true, quiz })}
                                className="bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs px-3.5 py-2.5 rounded-xl border border-[#4DE2BD]/30 transition-all flex items-center gap-1.5"
                              >
                                <span>Manage Questions ({questionCount})</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditQuiz(quiz)}
                                className="bg-[#07181E] text-[#A9C0C7] hover:text-white text-xs px-3 py-2 rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
                              >
                                Settings
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteConfirmation({
                                    type: 'quiz',
                                    id: quiz.id,
                                    title: quiz.title,
                                  })
                                }
                                className="text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-950/40"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          MODAL: ADD / EDIT LESSON
         ======================================================== */}
      {lessonModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {lessonModal.mode === 'add' ? 'Add New Lesson' : 'Edit Lesson'}
            </h3>
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Lesson Title *</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. 1. Introduction to Concepts"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Duration</label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="e.g. 45 mins"
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Order Index</label>
                  <input
                    type="number"
                    min={1}
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Description / Summary</label>
                <textarea
                  rows={3}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Briefly describe what will be covered in this lesson..."
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLessonModal({ open: false, mode: 'add', lesson: null })}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#41D1AC]"
                >
                  {lessonModal.mode === 'add' ? 'Add Lesson' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT MATERIAL
         ======================================================== */}
      {materialModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {materialModal.mode === 'add' ? 'Add Learning Material' : 'Edit Material'}
            </h3>
            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Material Title *</label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder="e.g. React 19 Architecture Diagram & Notes"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Material Type</label>
                  <select
                    value={materialForm.type}
                    onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  >
                    {MATERIAL_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Associated Lesson</label>
                  <select
                    value={materialForm.lessonId}
                    onChange={(e) => setMaterialForm({ ...materialForm, lessonId: e.target.value })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  >
                    <option value="">General Course Material</option>
                    {lessons.map((lsn) => (
                      <option key={lsn.id} value={lsn.id}>
                        {lsn.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Download / Resource URL</label>
                  <input
                    type="text"
                    value={materialForm.url}
                    onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                    placeholder="https://... or /files/..."
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Size / Format Label</label>
                  <input
                    type="text"
                    value={materialForm.fileSize}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileSize: e.target.value })}
                    placeholder="e.g. 2.4 MB or 15 slides"
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  placeholder="Instructions or overview of what is in this resource..."
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMaterialModal({ open: false, mode: 'add', material: null })}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#41D1AC]"
                >
                  {materialModal.mode === 'add' ? 'Add Material' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT QUIZ SETTINGS
         ======================================================== */}
      {quizModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {quizModal.mode === 'add' ? 'Configure New Quiz' : 'Edit Quiz Settings'}
            </h3>
            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Unit 1 Mastery Assessment"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Description / Instructions</label>
                <textarea
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Guidelines for students taking this quiz..."
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min={1}
                    value={quizForm.duration}
                    onChange={(e) => setQuizForm({ ...quizForm, duration: Number(e.target.value) })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={quizForm.totalMarks}
                    onChange={(e) => setQuizForm({ ...quizForm, totalMarks: Number(e.target.value) })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={quizForm.passingMarks}
                    onChange={(e) => setQuizForm({ ...quizForm, passingMarks: Number(e.target.value) })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Availability Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="quizStatus"
                      value="Published"
                      checked={quizForm.status === 'Published'}
                      onChange={() => setQuizForm({ ...quizForm, status: 'Published' })}
                      className="accent-[#4DE2BD]"
                    />
                    <span>Published (Live to Students)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="quizStatus"
                      value="Draft"
                      checked={quizForm.status === 'Draft'}
                      onChange={() => setQuizForm({ ...quizForm, status: 'Draft' })}
                      className="accent-[#4DE2BD]"
                    />
                    <span>Draft (Hidden)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuizModal({ open: false, mode: 'add', quiz: null })}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#41D1AC]"
                >
                  {quizModal.mode === 'add' ? 'Create Quiz' : 'Save Quiz Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DRAWER / MODAL: QUIZ QUESTIONS MANAGER
         ======================================================== */}
      {questionManager.open && questionManager.quiz && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#1D363E]">
              <div>
                <span className="text-[#4DE2BD] text-[11px] font-bold uppercase tracking-wider">
                  Quiz Questions Authoring
                </span>
                <h3 className="text-lg font-bold text-white">{questionManager.quiz.title}</h3>
              </div>
              <button
                onClick={() => setQuestionManager({ open: false, quiz: null })}
                className="text-[#A9C0C7] hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-[#A9C0C7]">
                Total Questions: <strong className="text-white">{questionManager.quiz.questions?.length || 0}</strong>
              </span>
              <button
                onClick={handleOpenAddQuestion}
                className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>+ Add MCQ Question</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
              {(!questionManager.quiz.questions || questionManager.quiz.questions.length === 0) ? (
                <div className="p-8 text-center text-xs text-[#A9C0C7] bg-[#07181E] rounded-2xl border border-[#1D363E]">
                  No questions authoring for this quiz yet. Click "+ Add MCQ Question" to build your quiz.
                </div>
              ) : (
                questionManager.quiz.questions.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-4 rounded-2xl bg-[#07181E] border border-[#1D363E] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#14323A] text-[#4DE2BD] text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm font-bold text-white leading-snug">{q.question}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#A9C0C7] bg-[#0D2229] px-2 py-0.5 rounded border border-[#1D363E] flex-shrink-0">
                        {q.marks || 10} pts
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt, optIdx) => {
                        const isCorrect = Number(q.correctAnswer) === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-[#143e39]/80 border-[#4DE2BD]/50 text-white font-medium'
                                : 'bg-[#0D2229] border-[#1D363E] text-[#A9C0C7]'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCorrect ? 'bg-[#4DE2BD] text-[#07181E]' : 'bg-[#1D363E] text-[#A9C0C7]'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                            {isCorrect && (
                              <span className="ml-auto text-[10px] text-[#4DE2BD] font-bold uppercase">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-[#A9C0C7]/80 italic bg-[#0D2229]/60 p-2 rounded-lg">
                        💡 Explanation: {q.explanation}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1D363E]/40">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className="text-xs text-[#A9C0C7] hover:text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'question',
                            id: q.id,
                            parentId: questionManager.quiz.id,
                            title: `Question ${qIdx + 1}`,
                          })
                        }
                        className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-[#1D363E] flex justify-end">
              <button
                onClick={() => setQuestionManager({ open: false, quiz: null })}
                className="px-5 py-2.5 bg-[#14323A] text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT MCQ QUESTION
         ======================================================== */}
      {questionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {questionModal.mode === 'add' ? 'Add MCQ Question' : 'Edit Question'}
            </h3>
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Question Statement *</label>
                <textarea
                  required
                  rows={2}
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="Enter the question text..."
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-2">
                  Answer Options (Select the correct option radio) *
                </label>
                <div className="space-y-2">
                  {questionForm.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="correctAnswerSelect"
                        checked={Number(questionForm.correctAnswer) === optIdx}
                        onChange={() => setQuestionForm({ ...questionForm, correctAnswer: optIdx })}
                        className="accent-[#4DE2BD] w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="w-5 text-xs font-bold text-[#A9C0C7]">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...questionForm.options];
                          newOpts[optIdx] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOpts });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        className="flex-1 bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={questionForm.marks}
                    onChange={(e) => setQuestionForm({ ...questionForm, marks: Number(e.target.value) })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Explanation (Optional)</label>
                  <input
                    type="text"
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                    placeholder="Why this answer is correct..."
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuestionModal({ open: false, mode: 'add', question: null })}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#41D1AC]"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
         ======================================================== */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Delete {deleteConfirmation.type}?</h3>
            <p className="text-xs text-[#A9C0C7] mb-5">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirmation.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E]"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
