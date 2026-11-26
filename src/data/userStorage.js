import { adminData } from './adminData.js';

const USERS_STORAGE_KEY = 'admin_users';
const ACCOUNTS_STORAGE_KEY = 'registeredUsers';
const DEMO_PASSWORD_HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'; // SHA-256 for 'password123'

function syncUserToAuth(userData, action, oldEmail = null) {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return;
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return;

    if (action === 'add') {
      const emailLower = (userData.email || '').trim().toLowerCase();
      if (!emailLower) return;
      const exists = accounts.some((a) => a.email?.toLowerCase() === emailLower);
      if (!exists) {
        const role = (userData.role || 'Student').toLowerCase();
        accounts.push({
          id: `usr-${Date.now()}`,
          fullName: userData.name || 'User',
          email: emailLower,
          role,
          passwordHash: DEMO_PASSWORD_HASH,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      }
    } else if (action === 'update') {
      const targetEmail = (oldEmail || userData.email || '').trim().toLowerCase();
      const updatedEmail = (userData.email || targetEmail).trim().toLowerCase();
      let changed = false;
      const updatedAccounts = accounts.map((a) => {
        if (a.email?.toLowerCase() === targetEmail) {
          changed = true;
          return {
            ...a,
            fullName: userData.name || a.fullName,
            email: updatedEmail,
            role: userData.role ? userData.role.toLowerCase() : a.role,
          };
        }
        return a;
      });
      if (changed) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
      }
    } else if (action === 'delete') {
      const emailLower = (userData.email || '').trim().toLowerCase();
      const filtered = accounts.filter((a) => a.email?.toLowerCase() !== emailLower);
      if (filtered.length !== accounts.length) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(filtered));
      }
    }
  } catch {}
}

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
  syncUserToAuth(newUser, 'add');
  return newUser;
}

export function updateStoredUser(userId, updatedData) {
  const current = getStoredUsers();
  const existingUser = current.find((u) => u.id === userId);
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
  const result = updated.find((u) => u.id === userId);
  if (result && existingUser) {
    syncUserToAuth(result, 'update', existingUser.email);
  }
  return result;
}

export function deleteStoredUser(userId) {
  const current = getStoredUsers();
  const existingUser = current.find((u) => u.id === userId);
  const updated = current.filter((u) => u.id !== userId);
  saveStoredUsers(updated);
  if (existingUser) {
    syncUserToAuth(existingUser, 'delete');
  }
  return updated;
}
