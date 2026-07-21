/**
 * Minimal client-side auth gate for the demo — there's no backend, so "signed in"
 * is just a flag in web storage. `remember` decides whether it survives a browser
 * restart (localStorage) or clears with the tab (sessionStorage).
 */
const KEY = "apex-auth";
const EMAIL_KEY = "apex-auth-email";

export function isAuthed() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "1" || sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// The signed-in email doubles as the Stream Video identity (see lib/stream.js),
// so two browsers signed in with different emails become two real callable users.
export function getAuthEmail() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(EMAIL_KEY) || sessionStorage.getItem(EMAIL_KEY) || null;
  } catch {
    return null;
  }
}

export function signIn({ email, remember = true } = {}) {
  try {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    store.setItem(KEY, "1");
    other.removeItem(KEY);
    if (email) {
      store.setItem(EMAIL_KEY, email);
      other.removeItem(EMAIL_KEY);
    }
  } catch {}
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(EMAIL_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
  } catch {}
}
