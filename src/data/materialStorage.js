const MATERIALS_STORAGE_KEY = 'course_materials';

export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF Document', icon: '📄' },
  { value: 'slides', label: 'Presentation Slides', icon: '📊' },
  { value: 'document', label: 'Word/Text Document', icon: '📝' },
  { value: 'link', label: 'External Resource/Link', icon: '🔗' },
  { value: 'video', label: 'Video Lecture', icon: '🎥' },
  { value: 'code', label: 'Source Code / Archive', icon: '💻' },
];

export const initialMaterials = [
  {
    id: 'mat-wd-1',
    courseId: 'web-dev',
    lessonId: 'lsn-wd-1',
    lessonTitle: '1. Introduction to Full Stack Architecture',
    title: 'Full Stack Architecture Cheatsheet',
    type: 'pdf',
    url: 'https://developer.mozilla.org/en-US/docs/Learn',
    fileSize: '1.8 MB',
    description: 'Reference sheet covering modern client-server models, HTTP headers, and API architectural patterns.',
    uploadedAt: '2026-02-01T10:00:00.000Z',
    instructor: 'Dr. Sarah Khan',
  },
  {
    id: 'mat-wd-2',
    courseId: 'web-dev',
    lessonId: 'lsn-wd-2',
    lessonTitle: '2. Modern React with Hooks & State',
    title: 'React 19 Hooks & State Deep Dive (Slides)',
    type: 'slides',
    url: 'https://react.dev/reference/react',
    fileSize: '4.2 MB',
    description: 'Comprehensive presentation slides explaining hook lifecycles, custom hooks, and concurrent features.',
    uploadedAt: '2026-02-15T14:30:00.000Z',
    instructor: 'Dr. Sarah Khan',
  },
  {
    id: 'mat-wd-3',
    courseId: 'web-dev',
    lessonId: 'lsn-wd-3',
    lessonTitle: '3. Backend REST APIs with Node & Express',
    title: 'Express REST Boilerplate & Postman Collection',
    type: 'code',
    url: 'https://github.com/expressjs/express',
    fileSize: '520 KB',
    description: 'Ready-to-use template repository with authentication middleware, error handlers, and sample routes.',
    uploadedAt: '2026-03-01T09:15:00.000Z',
    instructor: 'Dr. Sarah Khan',
  },
  {
    id: 'mat-ds-1',
    courseId: 'data-structures',
    lessonId: 'lsn-ds-1',
    lessonTitle: '1. Asymptotic Analysis & Big-O Notation',
    title: 'Big-O Complexity Chart & Reference Notes',
    type: 'pdf',
    url: 'https://www.bigocheatsheet.com/',
    fileSize: '2.1 MB',
    description: 'Visual reference guide detailing time and space complexity across major data structures and sorting algorithms.',
    uploadedAt: '2026-02-12T11:00:00.000Z',
    instructor: 'Prof. Amit Verma',
  },
  {
    id: 'mat-ds-2',
    courseId: 'data-structures',
    lessonId: 'lsn-ds-2',
    lessonTitle: '2. Arrays, Strings & Two-Pointer Techniques',
    title: '50 Essential Two-Pointer Practice Problems',
    type: 'document',
    url: 'https://leetcode.com',
    fileSize: '890 KB',
    description: 'Curated list of practice questions with algorithm breakdowns and Python/JavaScript solutions.',
    uploadedAt: '2026-02-20T16:00:00.000Z',
    instructor: 'Prof. Amit Verma',
  },
];

export function getMaterials() {
  try {
    const raw = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(initialMaterials));
      return initialMaterials;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(initialMaterials));
    return initialMaterials;
  } catch {
    return initialMaterials;
  }
}

export function saveMaterials(materials) {
  try {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
    window.dispatchEvent(new Event('course_materials_updated'));
  } catch (err) {
    void err;
  }
}

export function getMaterialsByCourse(courseId) {
  const all = getMaterials();
  return all.filter((m) => m.courseId === courseId);
}

export function getMaterialsByLesson(courseId, lessonId) {
  const all = getMaterials();
  return all.filter((m) => m.courseId === courseId && m.lessonId === lessonId);
}

export function addMaterial(materialData) {
  const current = getMaterials();
  const newMaterial = {
    ...materialData,
    id: materialData.id || `mat-${Date.now()}`,
    courseId: materialData.courseId || '',
    lessonId: materialData.lessonId || '',
    lessonTitle: materialData.lessonTitle || '',
    title: materialData.title?.trim() || 'Untitled Material',
    type: materialData.type || 'pdf',
    url: materialData.url?.trim() || '#',
    fileSize: materialData.fileSize || '1.0 MB',
    description: materialData.description?.trim() || '',
    uploadedAt: new Date().toISOString(),
    instructor: materialData.instructor || 'Instructor',
    instructorId: materialData.instructorId || '',
  };

  const updated = [newMaterial, ...current];
  saveMaterials(updated);
  return newMaterial;
}

export function updateMaterial(materialId, updatedData) {
  const current = getMaterials();
  const updated = current.map((m) => {
    if (m.id === materialId) {
      return {
        ...m,
        ...updatedData,
        id: m.id,
      };
    }
    return m;
  });
  saveMaterials(updated);
  return updated.find((m) => m.id === materialId) || null;
}

export function deleteMaterial(materialId) {
  const current = getMaterials();
  const updated = current.filter((m) => m.id !== materialId);
  saveMaterials(updated);
  return updated;
}
