import { adminData } from './adminData';

const USERS_STORAGE_KEY = 'admin_users';

export const initialUsers = [
  ...adminData.studentsList.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    role: 'Student',
    status: s.status,
    joinedDate: s.joinedDate,
    detail: `${s.enrolledCourses} Enrolled Courses`,
  })),
  ...adminData.instructorsList.map((i) => ({
    id: i.id,
    name: i.name,
    email: i.email,
    role: 'Instructor',
    status: i.status,
    joinedDate: '10 Jan 2026',
    detail: `${i.coursesCount} Courses • ${i.studentsCount} Students`,
  })),
  {
    id: 'ADM-01',
    name: 'System Administrator',
    email: 'admin@lms.edu',
    role: 'Admin',
    status: 'Active',
    joinedDate: '01 Jan 2026',
    detail: 'Full Access Rights',
  },
];

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  } catch {
    return initialUsers;
  }
}

export function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('admin_users_updated'));
  } catch {}
}

export function addStoredUser(userData) {
  const current = getStoredUsers();
  const prefix = userData.role === 'Instructor' ? 'INS' : userData.role === 'Admin' ? 'ADM' : 'STU';
  const newId = `${prefix}-${Date.now().toString().slice(-4)}`;
  const newUser = {
    id: newId,
    name: userData.name,
    email: userData.email,
    role: userData.role || 'Student',
    status: userData.status || 'Active',
    joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    detail: userData.detail || (userData.role === 'Student' ? '0 Enrolled Courses' : userData.role === 'Instructor' ? '0 Courses' : 'Admin User'),
  };
  const updated = [newUser, ...current];
  saveStoredUsers(updated);
  return newUser;
}

export function updateStoredUser(userId, updatedData) {
  const current = getStoredUsers();
  const updated = current.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        ...updatedData,
        id: u.id,
      };
    }
    return u;
  });
  saveStoredUsers(updated);
  return updated.find((u) => u.id === userId);
}

export function deleteStoredUser(userId) {
  const current = getStoredUsers();
  const updated = current.filter((u) => u.id !== userId);
  saveStoredUsers(updated);
  return updated;
}
