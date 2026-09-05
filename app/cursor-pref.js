// Shared on/off state for the custom cursor, so the toggle in the nav and the
// cursor itself stay in sync without dragging in a state library.
export const CURSOR_EVENT = 'tnt:cursor-pref';
const KEY = 'tnt-custom-cursor';

export function getCursorPref() {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(KEY) !== 'off';
  } catch {
    return true; // private mode / storage blocked — just use the default
  }
}

export function setCursorPref(on) {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* not fatal — the setting just won't survive a reload */
  }
  window.dispatchEvent(new CustomEvent(CURSOR_EVENT, { detail: on }));
}
