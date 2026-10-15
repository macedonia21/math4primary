const KEY = 'math4primary';

export function load() {
  const defaults = { lang: 'vi', muted: false, stars: {} };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return defaults;
  }
}

export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private mode): the game still works, just without saving
  }
}
