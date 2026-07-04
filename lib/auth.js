/**
 * Minimal client-side auth gate for the demo — there's no backend, so "signed in"
 * is just a flag in web storage. `remember` decides whether it survives a browser
 * restart (localStorage) or clears with the tab (sessionStorage).
 */
const KEY = "apex-auth";

export function isAuthed() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "1" || sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function signIn({ remember = true } = {}) {
  try {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    store.setItem(KEY, "1");
    other.removeItem(KEY);
  } catch {}
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {}
}
