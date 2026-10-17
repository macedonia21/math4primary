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

// ---------- number theory (Chapter II) ----------

export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
export const isPrime = (n) => n > 1 && divisors(n).length === 2;
export const primesBelow = (n) => Array.from({ length: n }, (_, i) => i).filter(isPrime);

// 360 → [[2, 3], [3, 2], [5, 1]]
export function factorize(n) {
  const out = [];
  for (let p = 2; n > 1; p++) {
    let e = 0;
    while (n % p === 0) { n /= p; e++; }
    if (e) out.push([p, e]);
  }
  return out;
}

// [[2, 3], [3, 2], [5, 1]] → 2³ · 3² · 5
export const factorHtml = (factors) => factors.map(([p, e]) => (e === 1 ? `${p}` : pw(p, e))).join(' · ');

// A stacked fraction.
export const frac = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;

// "is divisible by" / "is not divisible by"
export const DIV = '⋮';
export const NDIV = '<span class="ndiv">⋮</span>';

// Set names: Vietnamese textbooks write Ư(12), ƯCLN(12, 18)…; English uses D, M, GCD, LCM.
const SYMBOLS = {
  vi: { U: 'Ư', B: 'B', UC: 'ƯC', BC: 'BC', UCLN: 'ƯCLN', BCNN: 'BCNN' },
  en: { U: 'D', B: 'M', UC: 'CD', BC: 'CM', UCLN: 'GCD', BCNN: 'LCM' },
};
export const sym = (L, name) => SYMBOLS[L][name];

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
