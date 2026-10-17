// Shared helpers for Grade 6 lessons: random picks, bilingual text and
// number formatting, plus builders for the two question kinds.

export const int = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const pick = (arr) => arr[int(0, arr.length - 1)];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = int(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Distinct random integers in [min, max].
export function distinct(count, min, max) {
  const set = new Set();
  while (set.size < count) set.add(int(min, max));
  return [...set];
}

// Bilingual text: bi((L) => ...) builds { vi, en } from one template.
export const bi = (fn) => ({ vi: fn('vi'), en: fn('en') });
export const T = (L, vi, en) => (L === 'vi' ? vi : en);
export const tr = (x, L) => (x && typeof x === 'object' && 'vi' in x ? x[L] : x);

// Vietnamese textbooks group thousands with a space (12 345); English uses commas.
export function fmt(n, L) {
  const s = String(n);
  if (Math.abs(n) < 1000) return s;
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, L === 'vi' ? '\u00A0' : ',');
}

// Sets: Vietnamese separates elements with ";" (since "," is the decimal mark).
export const setOf = (items, L) => `{${items.join(L === 'vi' ? '; ' : ', ')}}`;
export const pw = (a, n) => `${a}<sup>${n}</sup>`;

// A multiple-choice question. Choices may be plain strings/numbers or { vi, en }.
export function choice(text, correct, wrongs, explain) {
  return { text, choices: shuffle([correct, ...wrongs]), answer: correct, explain };
}

// A question answered by typing a natural number on the number pad.
// `check` optionally carries data the tests use to verify the answer.
export function input(text, answer, explain, check) {
  return { text, input: true, answer, explain, check };
}

// Three wrong numeric answers close to the right one (never negative).
export function nearNumbers(answer, spread = [1, 2, 10]) {
  const pool = new Set();
  for (const d of spread) {
    if (answer - d >= 0) pool.add(answer - d);
    pool.add(answer + d);
  }
  pool.delete(answer);
  return shuffle([...pool]).slice(0, 3);
}
