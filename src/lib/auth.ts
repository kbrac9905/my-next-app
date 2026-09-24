// Simple client-side auth helper (localStorage-backed). Not secure — for demo only.
export type Auth = {
  email: string;
  isAdmin: boolean;
  token?: string;
};

const AUTH_KEY = 'auth';

export function getAuth(): Auth | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAuth();
}

export function isAdmin(): boolean {
  const a = getAuth();
  return !!(a && a.isAdmin);
}

export function login(email: string, password: string): boolean {
  // Mock: admin@example.com / 123456 is the admin
  const adminEmail = process?.env?.NEXT_PUBLIC_ADMIN || 'admin@example.com';
  const adminPass = process?.env?.NEXT_PUBLIC_ADMIN_PASS || '123456';

  if (email === adminEmail && password === adminPass) {
    const auth: Auth = { email, isAdmin: true, token: 'admintoken' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return true;
  }

  // For simplicity accept any signup/login for non-admin (no password check)
  // but require exact admin credentials for admin.
  const auth: Auth = { email, isAdmin: false, token: 'usertoken' };
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  return true;
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {}
}
