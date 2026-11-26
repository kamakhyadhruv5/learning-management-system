import { addStoredUser } from './userStorage.js';

const ACCOUNTS_STORAGE_KEY = 'registeredUsers';
const SESSION_STORAGE_KEY = 'currentUser';

export const DEMO_AUTH_NOTICE =
  'This frontend-only demo keeps account data in this browser. It is not production authentication.';

export const DEMO_PASSWORD_HASH =
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'; // SHA-256 for 'password123'

export const initialDemoAccounts = [
  {
    id: 'usr-student-01',
    fullName: 'Alex Johnson',
    email: 'student@lms.edu',
    role: 'student',
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-student-02',
    fullName: 'Alex Johnson',
    email: 'alex.j@example.com',
    role: 'student',
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-instructor-01',
    fullName: 'Dr. Sarah Khan',
    email: 'instructor@lms.edu',
    role: 'instructor',
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-instructor-02',
    fullName: 'Dr. Sarah Khan',
    email: 'sarah.k@lms.edu',
    role: 'instructor',
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-admin-01',
    fullName: 'System Administrator',
    email: 'admin@lms.edu',
    role: 'admin',
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export function normalizeRole(role) {
  const value = String(role || '').toLowerCase();
  return ['student', 'instructor', 'admin'].includes(value) ? value : 'student';
}

export function getDashboardPath(role) {
  return `/${normalizeRole(role)}/dashboard`;
}

export function getAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initialDemoAccounts));
      return initialDemoAccounts;
    }
    const accounts = JSON.parse(raw);
    if (Array.isArray(accounts) && accounts.length > 0) {
      return accounts;
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initialDemoAccounts));
    return initialDemoAccounts;
  } catch {
    return initialDemoAccounts;
  }
}

async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser password hashing is unavailable. Please use a modern browser.');
  }

  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function registerDemoAccount({ fullName, email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getAccounts();

  if (accounts.some((account) => account.email?.toLowerCase() === normalizedEmail)) {
    return { ok: false, error: 'An account with this email address already exists. Please log in instead.' };
  }

  const accountRole = normalizeRole(role);
  const account = {
    id: `usr-${Date.now()}`,
    fullName: fullName.trim(),
    email: normalizedEmail,
    role: accountRole,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));

  try {
    const roleLabel = accountRole.charAt(0).toUpperCase() + accountRole.slice(1);
    addStoredUser({
      name: account.fullName,
      email: account.email,
      role: roleLabel,
      status: 'Active',
    });
  } catch {
    // Graceful fallback if storage event cannot dispatch in environment
  }

  return { ok: true, account };
}

export async function authenticateDemoAccount({ email, password, rememberMe = false }) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = getAccounts().find((candidate) => candidate.email?.toLowerCase() === normalizedEmail);

  if (!account?.passwordHash || account.passwordHash !== await hashPassword(password)) {
    return { ok: false, error: 'Invalid email or password. Please check your details or create an account.' };
  }

  const session = {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    role: normalizeRole(account.role),
    rememberMe: Boolean(rememberMe),
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function getCurrentSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || 'null');
    if (!session?.email || !session?.role) return null;
    return { ...session, role: normalizeRole(session.role) };
  } catch {
    return null;
  }
}

export function clearCurrentSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
