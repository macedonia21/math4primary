// Grade 6 volume 2, Chapter VI: fractions. Lessons 23–27 with theory,
// step-by-step pictures, basic and advanced exercises. Fraction answers are
// multiple choice; whole-number answers use the number pad. Original text.

import {
  bi, T, int, pick, shuffle, choice, input, inputZ, z, par, gcd, lcm, frac,
} from './util.js';
import { derivation, fractionBar } from './visuals.js';

const cap = (html, isNew = false, big = false) => `<p class="vx-caption${isNew ? ' new' : ''}${big ? ' big' : ''}">${html}</p>`;
const eq = (html) => `<span class="eq">${html}</span>`;
const YES = { vi: 'Có', en: 'Yes' };
const NO = { vi: 'Không', en: 'No' };
const nonZero = (lo, hi) => { for (;;) { const v = int(lo, hi); if (v) return v; } };

// Fractions as [numerator, denominator]; shown with a positive denominator.
export function reduce(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d) || 1;
  return [n / g, d / g];
}
const F = (n, d) => { const [a, b] = reduce(n, d); return b === 1 ? z(a) : a < 0 ? `−${frac(-a, b)}` : frac(a, b); };
const raw = (n, d) => (n < 0 ? `−${frac(-n, d)}` : frac(n, d));
const sameValue = ([a, b], [c, d]) => a * d === b * c;
// A fraction inside an expression: negative ones get brackets.
const PF = (n, d) => (F(n, d).startsWith('−') ? `(${F(n, d)})` : F(n, d));

// A fraction question: the right value plus three wrong values (never equal).
function fracChoice(text, [n, d], explain, likelyMistakes = []) {
  const right = reduce(n, d);
  const [a, b] = right;
  const pool = [...likelyMistakes, [a + 1, b], [a - 1, b], [a, b + 1], [b, a], [-a, b], [a + 2, b], [a, b + 2]]
    .filter(([x, y]) => y !== 0);
  const wrongs = [];
  for (const w of pool) {
    if (!sameValue(w, right) && !wrongs.some((v) => sameValue(v, w))) wrongs.push(w);
    if (wrongs.length === 3) break;
  }
  return choice(text, F(a, b), wrongs.map(([x, y]) => F(x, y)), explain);
}

// ---------- Bài 23. Mở rộng phân số. Phân số bằng nhau ----------

const lesson23 = {
  id: 'c6b23',
  number: 23,
  title: { vi: 'Mở rộng phân số. Phân số bằng nhau', en: 'Fractions. Equal fractions' },
  points: [
    {
      title: { vi: 'Phân số với tử và mẫu là số nguyên', en: 'Fractions with integer numerator and denominator' },
      theory: {
        vi: [
          `Với a, b ∈ ℤ, b ≠ 0, ta gọi ${frac('a', 'b')} là một <b>phân số</b>; a là <b>tử số</b>, b là <b>mẫu số</b>.`,
          `Mỗi số nguyên a cũng là một phân số: a = ${frac('a', 1)}.`,
          `Phân số âm có thể viết dấu "−" ở tử hoặc trước phân số: ${frac('−3', 4)} = −${frac(3, 4)} = ${frac(3, '−4')}. Thường viết mẫu số dương.`,
        ],
        en: [
          `For a, b ∈ ℤ with b ≠ 0, ${frac('a', 'b')} is a <b>fraction</b>; a is the <b>numerator</b>, b the <b>denominator</b>.`,
          `Every integer a is also a fraction: a = ${frac('a', 1)}.`,
          `A negative fraction can carry the "−" on top or in front: ${frac('−3', 4)} = −${frac(3, 4)} = ${frac(3, '−4')}. We usually keep the denominator positive.`,
        ],
      },
      example: {
        caption: { vi: `${frac(3, 4)} của một thanh.`, en: `${frac(3, 4)} of a bar.` },
        frames: (L) => [
          fractionBar({ n: 0, d: 4, label: '' }) + cap(T(L, 'Chia thanh thành 4 phần bằng nhau (mẫu số 4).', 'Cut the bar into 4 equal parts (denominator 4).')),
          fractionBar({ n: 3, d: 4, isNew: true, label: frac(3, 4) }) + cap(T(L, 'Tô 3 phần (tử số 3).', 'Shade 3 parts (numerator 3).'), true),
        ],
      },
    },
    {
      title: { vi: 'Phân số bằng nhau. Tính chất cơ bản', en: 'Equal fractions. The basic property' },
      theory: {
        vi: [
          `<b>${frac('a', 'b')} = ${frac('c', 'd')}</b> nếu <b>a · d = b · c</b>.`,
          'Nhân cả tử và mẫu với cùng một số nguyên khác 0, hoặc chia cả tử và mẫu cho cùng một ước chung, ta được phân số bằng phân số đã cho.',
          `<b>Rút gọn</b>: chia cả tử và mẫu cho ƯCLN của chúng để được phân số <b>tối giản</b>.`,
        ],
        en: [
          `<b>${frac('a', 'b')} = ${frac('c', 'd')}</b> when <b>a · d = b · c</b>.`,
          'Multiplying top and bottom by the same non-zero integer, or dividing both by a common divisor, gives an equal fraction.',
          '<b>Simplify</b> by dividing top and bottom by their GCD to reach <b>lowest terms</b>.',
        ],
      },
      example: {
        caption: { vi: `${frac(1, 2)} = ${frac(2, 4)} = ${frac(4, 8)}`, en: `${frac(1, 2)} = ${frac(2, 4)} = ${frac(4, 8)}` },
        frames: (L) => [
          fractionBar({ n: 1, d: 2, label: frac(1, 2) }),
          fractionBar({ n: 1, d: 2, label: frac(1, 2) }) + fractionBar({ n: 2, d: 4, isNew: true, label: frac(2, 4) }),
          fractionBar({ n: 1, d: 2, label: frac(1, 2) }) + fractionBar({ n: 2, d: 4, label: frac(2, 4) }) + fractionBar({ n: 4, d: 8, isNew: true, label: frac(4, 8) }),
          fractionBar({ n: 1, d: 2, label: frac(1, 2) }) + fractionBar({ n: 2, d: 4, label: frac(2, 4) }) + fractionBar({ n: 4, d: 8, label: frac(4, 8) })
            + cap(T(L, `Phần tô màu dài bằng nhau. Kiểm tra: 1 · 4 = 2 · 2 nên ${frac(1, 2)} = ${frac(2, 4)}.`, `The shaded parts are the same length. Check: 1 · 4 = 2 · 2, so ${frac(1, 2)} = ${frac(2, 4)}.`), true),
        ],
      },
    },
  ],
  exercises: [
    // Which fraction is equal?
    () => {
      const [a, b] = reduce(nonZero(-9, 9), int(2, 12));
      const k = int(2, 6);
      const wrongs = [];
      for (const w of [[a * k + 1, b * k], [a + k, b + k], [a * k, b * (k + 1)], [a * k - 1, b * k], [b * k, a * k]]) {
        if (w[1] !== 0 && !sameValue(w, [a, b]) && !wrongs.some((v) => sameValue(v, w))) wrongs.push(w);
      }
      wrongs.length = Math.min(wrongs.length, 3);
      return choice(
        bi((L) => `${T(L, 'Phân số nào bằng', 'Which fraction equals')} ${F(a, b)}?`),
        raw(a * k, b * k),
        wrongs.map(([x, y]) => (y < 0 ? raw(-x, -y) : raw(x, y))),
        bi((L) => T(L, `Nhân cả tử và mẫu với ${k}: ${raw(a * k, b * k)}.`, `Multiply top and bottom by ${k}: ${raw(a * k, b * k)}.`)),
      );
    },
    // Find x: a/b = x/d.
    () => {
      const [a, b] = reduce(nonZero(-9, 9), int(2, 9));
      const k = int(2, 8);
      return inputZ(
        bi((L) => `${T(L, 'Tìm số nguyên x, biết:', 'Find the integer x:')} ${eq(`${F(a, b)} = ${frac('x', b * k)}`)}`),
        a * k,
        bi(() => `x = ${par(a)} · ${b * k} : ${b} = ${z(a * k)}`),
      );
    },
    // Simplify: give the numerator.
    () => {
      const [a, b] = reduce(int(1, 15), int(2, 20));
      const g = int(2, 9);
      return fracChoice(
        bi((L) => `${T(L, 'Rút gọn về phân số tối giản:', 'Simplify to lowest terms:')} ${frac(a * g, b * g)}`),
        [a, b],
        bi(() => `${frac(a * g, b * g)} = ${frac(`${a * g} : ${g}`, `${b * g} : ${g}`)} = ${F(a, b)}`),
        [[a * g, b], [a, b * g]],
      );
    },
    // Equal or not?
    () => {
      const [a, b] = [int(1, 9), int(2, 12)];
      const k = int(2, 5);
      const equal = Math.random() < 0.5;
      const [c, d] = equal ? [a * k, b * k] : [a * k + pick([1, -1]), b * k];
      return choice(
        bi((L) => `${T(L, 'Hai phân số sau có bằng nhau không?', 'Are these fractions equal?')} ${frac(a, b)} ${T(L, 'và', 'and')} ${frac(c, d)}`),
        equal ? YES : NO,
        [equal ? NO : YES],
        bi(() => `${a} · ${d} = ${a * d}; ${b} · ${c} = ${b * c} ⇒ ${a * d === b * c ? '=' : '≠'}`),
      );
    },
  ],
};

// ---------- Bài 24. So sánh phân số. Hỗn số dương ----------

const lesson24 = {
  id: 'c6b24',
  number: 24,
  title: { vi: 'So sánh phân số. Hỗn số dương', en: 'Comparing fractions. Mixed numbers' },
  points: [
    {
      title: { vi: 'So sánh hai phân số', en: 'Comparing two fractions' },
      theory: {
        vi: [
          'Hai phân số <b>cùng mẫu dương</b>: phân số nào có tử lớn hơn thì lớn hơn.',
          '<b>Khác mẫu</b>: quy đồng về cùng một mẫu dương rồi so sánh các tử.',
          'Phân số âm &lt; 0 &lt; phân số dương.',
        ],
        en: [
          'Same <b>positive denominator</b>: the larger numerator gives the larger fraction.',
          '<b>Different denominators</b>: rewrite with a common positive denominator, then compare numerators.',
          'Negative fractions &lt; 0 &lt; positive fractions.',
        ],
      },
      example: {
        caption: { vi: `So sánh ${frac(3, 4)} và ${frac(5, 8)}.`, en: `Compare ${frac(3, 4)} and ${frac(5, 8)}.` },
        frames: (L) => [
          fractionBar({ n: 3, d: 4, label: frac(3, 4) }) + fractionBar({ n: 5, d: 8, tone: 'b', label: frac(5, 8) }),
          fractionBar({ n: 6, d: 8, isNew: true, label: frac(6, 8) }) + fractionBar({ n: 5, d: 8, tone: 'b', label: frac(5, 8) })
            + cap(T(L, `Quy đồng: ${frac(3, 4)} = ${frac(6, 8)}.`, `Common denominator: ${frac(3, 4)} = ${frac(6, 8)}.`), true),
          fractionBar({ n: 6, d: 8, label: frac(6, 8) }) + fractionBar({ n: 5, d: 8, tone: 'b', label: frac(5, 8) })
            + cap(`6 &gt; 5 ⇒ <b>${frac(3, 4)} &gt; ${frac(5, 8)}</b>`, true, true),
        ],
      },
    },
    {
      title: { vi: 'Hỗn số dương', en: 'Mixed numbers' },
      theory: {
        vi: [
          `Phân số dương có tử lớn hơn mẫu viết được thành <b>hỗn số</b>: ${frac(7, 3)} = 2 + ${frac(1, 3)} = 2${frac(1, 3)}.`,
          `Chia tử cho mẫu: <b>thương</b> là phần nguyên, <b>số dư</b> là tử của phần phân số.`,
          `Ngược lại: 2${frac(1, 3)} = ${frac('2 · 3 + 1', 3)} = ${frac(7, 3)}.`,
        ],
        en: [
          `A positive fraction with numerator larger than denominator can be written as a <b>mixed number</b>: ${frac(7, 3)} = 2 + ${frac(1, 3)} = 2${frac(1, 3)}.`,
          'Divide top by bottom: the <b>quotient</b> is the whole part, the <b>remainder</b> is the new numerator.',
          `Back again: 2${frac(1, 3)} = ${frac('2 · 3 + 1', 3)} = ${frac(7, 3)}.`,
        ],
      },
      example: {
        caption: { vi: `${frac(7, 3)} là bao nhiêu thanh?`, en: `How many bars is ${frac(7, 3)}?` },
        frames: (L) => [
          fractionBar({ n: 3, d: 3, label: '1' }),
          fractionBar({ n: 3, d: 3, label: '1' }) + fractionBar({ n: 3, d: 3, isNew: true, label: '1' }),
          fractionBar({ n: 3, d: 3, label: '1' }) + fractionBar({ n: 3, d: 3, label: '1' }) + fractionBar({ n: 1, d: 3, isNew: true, tone: 'b', label: frac(1, 3) })
            + cap(`${frac(7, 3)} = 2 + ${frac(1, 3)} = <b>2${frac(1, 3)}</b> ${T(L, '(7 chia 3 được 2 dư 1)', '(7 ÷ 3 = 2 remainder 1)')}`, true, true),
        ],
      },
    },
  ],
  exercises: [
    // Compare two fractions.
    () => {
      let a; let b; let c; let d;
      do { [a, b, c, d] = [nonZero(-9, 9), int(2, 12), nonZero(-9, 9), int(2, 12)]; } while (a * d === b * c || a / b === Math.trunc(a / b));
      const ans = a * d < c * b ? '&lt;' : '&gt;';
      const m = lcm(b, d);
      return choice(
        bi((L) => `${T(L, 'Điền dấu:', 'Choose the sign:')} ${F(a, b)} ☐ ${F(c, d)}`),
        ans,
        ['&lt;', '&gt;', '='].filter((s) => s !== ans),
        bi(() => `${raw(a * (m / b), m)} ${ans} ${raw(c * (m / d), m)}`),
      );
    },
    // Largest of four.
    () => {
      const list = [];
      while (list.length < 4) {
        const f = reduce(int(1, 11), int(2, 12));
        if (f[1] > 1 && !list.some((g) => sameValue(g, f))) list.push(f);
      }
      const largest = Math.random() < 0.5;
      const best = list.reduce((m, f) => ((largest ? f[0] * m[1] > m[0] * f[1] : f[0] * m[1] < m[0] * f[1]) ? f : m));
      return choice(
        bi((L) => T(L, `Phân số nào <b>${largest ? 'lớn' : 'nhỏ'} nhất</b>?`, `Which fraction is the <b>${largest ? 'largest' : 'smallest'}</b>?`)),
        F(...best),
        list.filter((f) => f !== best).map((f) => F(...f)),
        bi((L) => T(L, `Quy đồng mẫu ${list.reduce((m, f) => lcm(m, f[1]), 1)} rồi so sánh các tử.`, `Use the common denominator ${list.reduce((m, f) => lcm(m, f[1]), 1)} and compare numerators.`)),
      );
    },
    // Mixed number to improper fraction: numerator.
    () => {
      const [w, d] = [int(1, 9), int(2, 12)];
      const r = int(1, d - 1);
      return input(
        bi((L) => `${T(L, 'Viết hỗn số thành phân số', 'Write as a fraction')} ${eq(`${w}${frac(r, d)} = ${frac('?', d)}`)}. ${T(L, 'Tử số là bao nhiêu?', 'What is the numerator?')}`),
        w * d + r,
        bi(() => `${w} · ${d} + ${r} = ${w * d + r}`),
      );
    },
    // Whole part of an improper fraction.
    () => {
      const d = int(2, 12);
      const n = d * int(1, 12) + int(1, d - 1);
      return input(
        bi((L) => T(L, `Viết ${frac(n, d)} dưới dạng hỗn số. Phần nguyên là bao nhiêu?`, `Write ${frac(n, d)} as a mixed number. What is the whole part?`)),
        Math.floor(n / d),
        bi(() => `${n} = ${d} · ${Math.floor(n / d)} + ${n % d} ⇒ ${frac(n, d)} = ${Math.floor(n / d)}${frac(n % d, d)}`),
      );
    },
  ],
};

// ---------- Bài 25. Phép cộng và phép trừ phân số ----------

const lesson25 = {
  id: 'c6b25',
  number: 25,
  title: { vi: 'Phép cộng và phép trừ phân số', en: 'Adding and subtracting fractions' },
  points: [
    {
      title: { vi: 'Cộng hai phân số', en: 'Adding fractions' },
      theory: {
        vi: [
          `Cùng mẫu: <b>${frac('a', 'm')} + ${frac('b', 'm')} = ${frac('a + b', 'm')}</b>.`,
          'Khác mẫu: quy đồng mẫu (thường dùng BCNN của các mẫu) rồi cộng các tử.',
          'Phép cộng phân số có tính chất giao hoán, kết hợp, cộng với 0.',
        ],
        en: [
          `Same denominator: <b>${frac('a', 'm')} + ${frac('b', 'm')} = ${frac('a + b', 'm')}</b>.`,
          'Different denominators: use a common denominator (usually the LCM), then add the numerators.',
          'Adding fractions is commutative and associative; adding 0 changes nothing.',
        ],
      },
      example: {
        caption: { vi: `Tính ${frac(1, 2)} + ${frac(1, 3)}.`, en: `Work out ${frac(1, 2)} + ${frac(1, 3)}.` },
        frames: (L) => [
          fractionBar({ n: 1, d: 2, label: frac(1, 2) }) + fractionBar({ n: 1, d: 3, tone: 'b', label: frac(1, 3) }),
          fractionBar({ n: 3, d: 6, isNew: true, label: frac(3, 6) }) + fractionBar({ n: 2, d: 6, tone: 'b', isNew: true, label: frac(2, 6) })
            + cap(T(L, 'Quy đồng mẫu 6.', 'Common denominator 6.'), true),
          `<div class="fbar-row new"><div class="fbar" style="--d:6">${'<span class="fb-cell on a"></span>'.repeat(3)}${'<span class="fb-cell on b"></span>'.repeat(2)}<span class="fb-cell"></span></div><span class="fbar-label">${frac(5, 6)}</span></div>`
            + cap(`${frac(3, 6)} + ${frac(2, 6)} = <b>${frac(5, 6)}</b>`, true, true),
        ],
      },
    },
    {
      title: { vi: 'Số đối. Phép trừ phân số', en: 'Opposites. Subtracting fractions' },
      theory: {
        vi: [
          `Số đối của ${frac('a', 'b')} là −${frac('a', 'b')}; tổng hai số đối bằng 0.`,
          `Trừ là cộng với số đối: <b>${frac('a', 'b')} − ${frac('c', 'd')} = ${frac('a', 'b')} + (−${frac('c', 'd')})</b>.`,
        ],
        en: [
          `The opposite of ${frac('a', 'b')} is −${frac('a', 'b')}; opposites add up to 0.`,
          `Subtracting means adding the opposite: <b>${frac('a', 'b')} − ${frac('c', 'd')} = ${frac('a', 'b')} + (−${frac('c', 'd')})</b>.`,
        ],
      },
      example: {
        caption: { vi: `Tính ${frac(3, 4)} − ${frac(5, 6)}.`, en: `Work out ${frac(3, 4)} − ${frac(5, 6)}.` },
        frames: (L) => derivation([
          `${frac(3, 4)} − ${frac(5, 6)}`,
          `= ${frac(9, 12)} − ${frac(10, 12)} <span class="note">${T(L, 'mẫu chung 12', 'common denominator 12')}</span>`,
          `= ${frac('9 − 10', 12)} = <b>−${frac(1, 12)}</b>`,
        ]),
      },
    },
  ],
  exercises: [
    () => {
      const [a, b, c, d] = [nonZero(-9, 9), int(2, 10), nonZero(-9, 9), int(2, 10)];
      const m = lcm(b, d);
      return fracChoice(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${F(a, b)} + ${F(c, d)}`),
        [a * d + c * b, b * d],
        bi(() => `${raw(a * (m / b), m)} + ${raw(c * (m / d), m)} = ${raw(a * (m / b) + c * (m / d), m)} = ${F(a * d + c * b, b * d)}`),
        [[a + c, b + d]],
      );
    },
    () => {
      const [a, b, c, d] = [nonZero(-9, 9), int(2, 10), nonZero(-9, 9), int(2, 10)];
      const m = lcm(b, d);
      return fracChoice(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${F(a, b)} − ${PF(c, d)}`),
        [a * d - c * b, b * d],
        bi(() => `${raw(a * (m / b), m)} − ${PF(c * (m / d), m)} = ${F(a * d - c * b, b * d)}`),
        [[a - c, b - d || 1], [a * d + c * b, b * d]],
      );
    },
    // Opposite.
    () => {
      const [a, b] = reduce(nonZero(-12, 12), int(2, 12));
      return fracChoice(
        bi((L) => T(L, `Số đối của ${F(a, b)} là:`, `The opposite of ${F(a, b)} is:`)),
        [-a, b],
        bi(() => `${F(a, b)} + ${F(-a, b).startsWith('−') ? `(${F(-a, b)})` : F(-a, b)} = 0`),
        [[a, b], [b, a]],
      );
    },
    // Find x.
    () => {
      const [a, b, c, d] = [nonZero(-7, 7), int(2, 8), nonZero(-7, 7), int(2, 8)];
      return fracChoice(
        bi((L) => `${T(L, 'Tìm x, biết:', 'Find x:')} ${eq(`x + ${F(a, b).startsWith('−') ? `(${F(a, b)})` : F(a, b)} = ${F(c, d)}`)}`),
        [c * b - a * d, b * d],
        bi(() => `x = ${F(c, d)} − ${F(a, b).startsWith('−') ? `(${F(a, b)})` : F(a, b)} = ${F(c * b - a * d, b * d)}`),
        [[c * b + a * d, b * d]],
      );
    },
  ],
};

// ---------- Bài 26. Phép nhân và phép chia phân số ----------

function areaGrid(cols, colOn, rows, rowOn, showCols, showRows, freshPart) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cls = [showCols && c < colOn ? 'col' : '', showRows && r < rowOn ? 'row' : ''].join(' ');
      cells.push(`<span class="${cls}"></span>`);
    }
  }
  return `<div class="area-grid${freshPart ? ' new' : ''}" style="grid-template-columns: repeat(${cols}, 1fr)">${cells.join('')}</div>`;
}

const lesson26 = {
  id: 'c6b26',
  number: 26,
  title: { vi: 'Phép nhân và phép chia phân số', en: 'Multiplying and dividing fractions' },
  points: [
    {
      title: { vi: 'Phép nhân phân số', en: 'Multiplying fractions' },
      theory: {
        vi: [
          `<b>${frac('a', 'b')} · ${frac('c', 'd')} = ${frac('a · c', 'b · d')}</b>. Nên rút gọn chéo trước khi nhân.`,
          'Phép nhân phân số có tính chất giao hoán, kết hợp, nhân với 1, phân phối đối với phép cộng.',
        ],
        en: [
          `<b>${frac('a', 'b')} · ${frac('c', 'd')} = ${frac('a · c', 'b · d')}</b>. Cancel common factors first.`,
          'Multiplying fractions is commutative and associative, 1 changes nothing, and it distributes over addition.',
        ],
      },
      example: {
        caption: { vi: `${frac(2, 3)} · ${frac(3, 4)} bằng mô hình diện tích.`, en: `${frac(2, 3)} · ${frac(3, 4)} as an area model.` },
        frames: (L) => [
          areaGrid(3, 2, 4, 3, true, false) + cap(T(L, `Tô ${frac(2, 3)} theo chiều ngang (2 trong 3 cột).`, `Shade ${frac(2, 3)} across (2 of 3 columns).`)),
          areaGrid(3, 2, 4, 3, true, true, true) + cap(T(L, `Tô ${frac(3, 4)} theo chiều dọc (3 trong 4 hàng).`, `Shade ${frac(3, 4)} down (3 of 4 rows).`), true),
          areaGrid(3, 2, 4, 3, true, true) + cap(T(L, `Phần xanh lá: 6 trong 12 ô: ${frac(2, 3)} · ${frac(3, 4)} = ${frac(6, 12)} = <b>${frac(1, 2)}</b>`, `Green: 6 of 12 cells: ${frac(2, 3)} · ${frac(3, 4)} = ${frac(6, 12)} = <b>${frac(1, 2)}</b>`), true, true),
        ],
      },
    },
    {
      title: { vi: 'Phân số nghịch đảo. Phép chia phân số', en: 'Reciprocals. Dividing fractions' },
      theory: {
        vi: [
          `Hai số là <b>nghịch đảo</b> của nhau nếu tích bằng 1: nghịch đảo của ${frac('a', 'b')} là ${frac('b', 'a')} (a ≠ 0).`,
          `Chia cho một phân số là nhân với nghịch đảo của nó: <b>${frac('a', 'b')} : ${frac('c', 'd')} = ${frac('a', 'b')} · ${frac('d', 'c')}</b>.`,
        ],
        en: [
          `Two numbers are <b>reciprocals</b> if their product is 1: the reciprocal of ${frac('a', 'b')} is ${frac('b', 'a')} (a ≠ 0).`,
          `Dividing by a fraction means multiplying by its reciprocal: <b>${frac('a', 'b')} : ${frac('c', 'd')} = ${frac('a', 'b')} · ${frac('d', 'c')}</b>.`,
        ],
      },
      example: {
        caption: { vi: `Tính ${frac(3, 5)} : ${frac(9, 10)}.`, en: `Work out ${frac(3, 5)} : ${frac(9, 10)}.` },
        frames: (L) => derivation([
          `${frac(3, 5)} : ${frac(9, 10)}`,
          `= ${frac(3, 5)} · ${frac(10, 9)} <span class="note">${T(L, 'nhân với nghịch đảo', 'times the reciprocal')}</span>`,
          `= ${frac('3 · 10', '5 · 9')} = ${frac(30, 45)} = <b>${frac(2, 3)}</b>`,
        ]),
      },
    },
  ],
  exercises: [
    () => {
      const [a, b, c, d] = [nonZero(-9, 9), int(2, 10), nonZero(-9, 9), int(2, 10)];
      return fracChoice(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${F(a, b)} · ${c < 0 ? `(${F(c, d)})` : F(c, d)}`),
        [a * c, b * d],
        bi(() => `${frac(`${par(a)} · ${par(c)}`, `${b} · ${d}`)} = ${F(a * c, b * d)}`),
        [[a * d, b * c], [a + c, b + d]],
      );
    },
    () => {
      const [a, b, c, d] = [nonZero(-9, 9), int(2, 10), nonZero(-9, 9), int(2, 10)];
      return fracChoice(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${F(a, b)} : ${c < 0 ? `(${F(c, d)})` : F(c, d)}`),
        [a * d, b * c],
        bi(() => `${F(a, b)} · ${F(d, c).startsWith('−') ? `(${F(d, c)})` : F(d, c)} = ${F(a * d, b * c)}`),
        [[a * c, b * d]],
      );
    },
    // Reciprocal.
    () => {
      const [a, b] = reduce(nonZero(-12, 12), int(2, 12));
      return fracChoice(
        bi((L) => T(L, `Số nghịch đảo của ${F(a, b)} là:`, `The reciprocal of ${F(a, b)} is:`)),
        [b, a],
        bi(() => `${F(a, b)} · ${F(b, a).startsWith('−') ? `(${F(b, a)})` : F(b, a)} = 1`),
        [[-a, b], [-b, a]],
      );
    },
    // Fraction times a whole number (whole-number answer).
    () => {
      const d = int(2, 9);
      const n = int(1, d - 1);
      const k = d * int(2, 12);
      return input(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${frac(n, d)} · ${k}`)}`),
        (n * k) / d,
        bi(() => `${frac(`${n} · ${k}`, d)} = ${n * k} : ${d} = ${(n * k) / d}`),
      );
    },
  ],
};

// ---------- Bài 27. Hai bài toán về phân số ----------

const lesson27 = {
  id: 'c6b27',
  number: 27,
  title: { vi: 'Hai bài toán về phân số', en: 'Two problems about fractions' },
  points: [
    {
      title: { vi: 'Tìm giá trị phân số của một số', en: 'A fraction of a number' },
      theory: {
        vi: [`Muốn tìm ${frac('m', 'n')} của số a, ta tính <b>a · ${frac('m', 'n')}</b>.`],
        en: [`To find ${frac('m', 'n')} of a number a, work out <b>a · ${frac('m', 'n')}</b>.`],
      },
      example: {
        caption: { vi: `Tìm ${frac(3, 4)} của 24.`, en: `Find ${frac(3, 4)} of 24.` },
        frames: (L) => [
          fractionBar({ n: 0, d: 4, label: '24' }) + cap(T(L, 'Chia 24 thành 4 phần: mỗi phần 6.', 'Split 24 into 4 parts: 6 each.')),
          fractionBar({ n: 3, d: 4, isNew: true, label: '24' }) + cap(T(L, 'Lấy 3 phần.', 'Take 3 parts.'), true),
          fractionBar({ n: 3, d: 4, label: '24' }) + cap(`24 · ${frac(3, 4)} = <b>18</b>`, true, true),
        ],
      },
    },
    {
      title: { vi: 'Tìm một số biết giá trị phân số của nó', en: 'Finding a number from a fraction of it' },
      theory: {
        vi: [`Muốn tìm một số biết ${frac('m', 'n')} của nó bằng a, ta tính <b>a : ${frac('m', 'n')}</b>.`],
        en: [`To find a number when ${frac('m', 'n')} of it is a, work out <b>a : ${frac('m', 'n')}</b>.`],
      },
      example: {
        caption: { vi: `${frac(2, 5)} của một số là 14. Tìm số đó.`, en: `${frac(2, 5)} of a number is 14. Find the number.` },
        frames: (L) => [
          fractionBar({ n: 2, d: 5, label: '?' }) + cap(T(L, '2 phần ứng với 14.', '2 parts make 14.')),
          fractionBar({ n: 2, d: 5, label: '?' }) + cap(T(L, 'Mỗi phần: 14 : 2 = 7.', 'One part: 14 : 2 = 7.'), true),
          fractionBar({ n: 5, d: 5, isNew: true, label: '35' }) + cap(`14 : ${frac(2, 5)} = 14 · ${frac(5, 2)} = <b>35</b>`, true, true),
        ],
      },
    },
  ],
  exercises: [
    () => {
      const n = int(2, 9);
      const m = int(1, n - 1);
      const a = n * int(2, 20);
      return input(
        bi((L) => `${T(L, 'Tìm', 'Find')} ${frac(m, n)} ${T(L, 'của', 'of')} ${a}.`),
        (a * m) / n,
        bi(() => `${a} · ${frac(m, n)} = ${(a * m) / n}`),
      );
    },
    () => {
      const n = int(2, 9);
      const m = int(1, n - 1);
      const x = n * int(2, 15);
      return input(
        bi((L) => T(L, `${frac(m, n)} của một số là ${(x * m) / n}. Tìm số đó.`, `${frac(m, n)} of a number is ${(x * m) / n}. Find the number.`)),
        x,
        bi(() => `${(x * m) / n} : ${frac(m, n)} = ${(x * m) / n} · ${frac(n, m)} = ${x}`),
      );
    },
    // Class.
    () => {
      const n = pick([3, 4, 5, 7]);
      const m = int(1, n - 1);
      const total = n * int(6, 10);
      return input(
        bi((L) => T(L, `Lớp 6A có ${total} học sinh, trong đó ${frac(m, n)} số học sinh là nữ. Lớp có bao nhiêu học sinh nam?`, `Class 6A has ${total} students; ${frac(m, n)} of them are girls. How many are boys?`)),
        total - (total * m) / n,
        bi((L) => T(L, `Số nữ: ${total} · ${frac(m, n)} = ${(total * m) / n}; số nam: ${total} − ${(total * m) / n} = ${total - (total * m) / n}.`, `Girls: ${total} · ${frac(m, n)} = ${(total * m) / n}; boys: ${total} − ${(total * m) / n} = ${total - (total * m) / n}.`)),
      );
    },
    // Book pages.
    () => {
      const n = pick([3, 4, 5, 6]);
      const m = int(1, n - 1);
      const pages = n * int(10, 40);
      return input(
        bi((L) => T(L, `An đã đọc ${(pages * m) / n} trang, bằng ${frac(m, n)} cuốn sách. Cuốn sách dày bao nhiêu trang?`, `An has read ${(pages * m) / n} pages, which is ${frac(m, n)} of the book. How many pages does the book have?`)),
        pages,
        bi(() => `${(pages * m) / n} : ${frac(m, n)} = ${pages}`),
      );
    },
  ],
};

export const CHAPTER6 = [lesson23, lesson24, lesson25, lesson26, lesson27];

// ---------- Nâng cao ----------

export const ADVANCED6 = {
  c6b23: [
    // Cross-multiplication with x on the bottom.
    () => {
      const [a, b] = reduce(nonZero(-9, 9), int(2, 9));
      const k = nonZero(-6, 6);
      return inputZ(
        bi((L) => `${T(L, 'Tìm số nguyên x, biết:', 'Find the integer x:')} ${eq(`${frac(a * k, 'x')} = ${F(a, b)}`)}`),
        b * k,
        bi(() => `x · ${par(a)} = ${par(a * k)} · ${b} ⇒ x = ${z(b * k)}`),
      );
    },
    // Equal fraction with a given sum of top and bottom.
    () => {
      const [a, b] = reduce(int(1, 9), int(2, 12));
      const k = int(2, 12);
      return input(
        bi((L) => T(L, `Tìm phân số bằng ${F(a, b)} có tổng tử và mẫu bằng ${k * (a + b)}. Tử số là bao nhiêu?`, `Find a fraction equal to ${F(a, b)} whose numerator and denominator add up to ${k * (a + b)}. What is its numerator?`)),
        a * k,
        bi(() => `${frac(`${a}k`, `${b}k`)}: ${a + b}k = ${k * (a + b)} ⇒ k = ${k} ⇒ ${frac(a * k, b * k)}`),
      );
    },
    // Difference of bottom and top.
    () => {
      let a; let b;
      do { [a, b] = reduce(int(1, 9), int(2, 12)); } while (a >= b);
      const k = int(2, 12);
      return input(
        bi((L) => T(L, `Tìm phân số bằng ${F(a, b)}, biết mẫu lớn hơn tử ${k * (b - a)} đơn vị. Mẫu số là bao nhiêu?`, `Find a fraction equal to ${F(a, b)} whose denominator is ${k * (b - a)} more than its numerator. What is its denominator?`)),
        b * k,
        bi(() => `${frac(`${a}k`, `${b}k`)}: ${b - a}k = ${k * (b - a)} ⇒ k = ${k} ⇒ ${frac(a * k, b * k)}`),
      );
    },
  ],
  c6b24: [
    // Compare using the gap to 1.
    () => {
      const n = int(20, 2000);
      const k = int(1, 5);
      const [p, q] = [[n, n + k], [n + 1, n + 1 + k]];
      return choice(
        bi((L) => `${T(L, 'So sánh:', 'Compare:')} ${frac(...p)} ☐ ${frac(...q)}`),
        '&lt;',
        ['&gt;', '='],
        bi((L) => T(L, `1 − ${frac(...p)} = ${frac(k, n + k)} lớn hơn 1 − ${frac(...q)} = ${frac(k, n + 1 + k)}, nên ${frac(...p)} nhỏ hơn.`, `1 − ${frac(...p)} = ${frac(k, n + k)} is bigger than 1 − ${frac(...q)} = ${frac(k, n + 1 + k)}, so ${frac(...p)} is smaller.`)),
      );
    },
    // Count integers between two fractions.
    () => {
      const [a, b, c, d] = [int(-40, 10), int(2, 7), int(11, 60), int(2, 7)];
      const lo = a / b;
      const hi = c / d;
      let count = 0;
      for (let x = Math.floor(lo) - 1; x <= Math.ceil(hi) + 1; x++) if (x > lo && x < hi) count++;
      return input(
        bi((L) => T(L, `Có bao nhiêu số nguyên x thoả mãn ${F(a, b)} &lt; x &lt; ${F(c, d)}?`, `How many integers x satisfy ${F(a, b)} &lt; x &lt; ${F(c, d)}?`)),
        count,
        bi((L) => T(L, `${F(a, b)} ≈ ${(lo).toFixed(2).replace('.', ',')} và ${F(c, d)} ≈ ${(hi).toFixed(2).replace('.', ',')}: có ${count} số nguyên ở giữa.`, `${F(a, b)} ≈ ${lo.toFixed(2)} and ${F(c, d)} ≈ ${hi.toFixed(2)}: ${count} integers in between.`)),
      );
    },
    // Mixed numbers ordering.
    () => {
      const w = int(1, 5);
      let items;
      do {
        items = shuffle([3, 4, 5, 6, 8, 9]).slice(0, 4).map((d) => [w * d + int(1, d - 1), d]);
      } while (new Set(items.map(([n, d]) => n / d)).size < 4);
      const big = items.reduce((m, f) => (f[0] / f[1] > m[0] / m[1] ? f : m));
      const show = ([n, d]) => `${w}${frac(n - w * d, d)}`;
      return choice(
        bi((L) => T(L, 'Hỗn số nào lớn nhất?', 'Which mixed number is the largest?')),
        show(big),
        items.filter((f) => f !== big).map(show),
        bi((L) => T(L, 'Cùng phần nguyên: so sánh phần phân số (quy đồng mẫu).', 'Same whole part: compare the fraction parts (common denominator).')),
      );
    },
  ],
  c6b25: [
    // Telescoping sum.
    () => {
      const n = int(4, 30);
      return fracChoice(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${frac(1, '1 · 2')} + ${frac(1, '2 · 3')} + … + ${frac(1, `${n} · ${n + 1}`)}`)}`),
        [n, n + 1],
        bi((L) => T(L, `Vì ${frac(1, 'k(k + 1)')} = ${frac(1, 'k')} − ${frac(1, 'k + 1')}, tổng bằng 1 − ${frac(1, n + 1)} = ${frac(n, n + 1)}.`, `Since ${frac(1, 'k(k + 1)')} = ${frac(1, 'k')} − ${frac(1, 'k + 1')}, the sum is 1 − ${frac(1, n + 1)} = ${frac(n, n + 1)}.`)),
        [[1, n + 1], [n + 1, n + 2]],
      );
    },
    // Smart grouping.
    () => {
      const [a, b] = reduce(int(1, 9), int(2, 9));
      const [c, d] = reduce(int(1, 9), int(2, 9));
      const [e, f] = reduce(int(1, 9), int(2, 9));
      return fracChoice(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(`${F(a, b)} + ${F(c, d)} − ${F(a, b)} + ${F(e, f)} − ${F(c, d)}`)}`),
        [e, f],
        bi(() => `(${F(a, b)} − ${F(a, b)}) + (${F(c, d)} − ${F(c, d)}) + ${F(e, f)} = ${F(e, f)}`),
      );
    },
    // Find x with two steps.
    () => {
      const [a, b, c, d] = [int(1, 7), int(2, 8), int(1, 7), int(2, 8)];
      return fracChoice(
        bi((L) => `${T(L, 'Tìm x, biết:', 'Find x:')} ${eq(`${F(a, b)} − x = ${F(c, d)}`)}`),
        [a * d - c * b, b * d],
        bi(() => `x = ${F(a, b)} − ${F(c, d)} = ${F(a * d - c * b, b * d)}`),
        [[a * d + c * b, b * d], [c * b - a * d, b * d]],
      );
    },
  ],
  c6b26: [
    // Product telescoping.
    () => {
      const n = int(4, 40);
      return fracChoice(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`(1 − ${frac(1, 2)}) · (1 − ${frac(1, 3)}) · … · (1 − ${frac(1, n)})`)}`),
        [1, n],
        bi(() => `${frac(1, 2)} · ${frac(2, 3)} · ${frac(3, 4)} · … · ${frac(n - 1, n)} = ${frac(1, n)}`),
        [[n - 1, n], [1, n - 1]],
      );
    },
    // Find x in a product.
    () => {
      const [a, b, c, d] = [nonZero(-8, 8), int(2, 9), nonZero(-8, 8), int(2, 9)];
      return fracChoice(
        bi((L) => `${T(L, 'Tìm x, biết:', 'Find x:')} ${eq(`${F(a, b)} · x = ${F(c, d)}`)}`),
        [c * b, d * a],
        bi(() => `x = ${F(c, d)} : ${F(a, b).startsWith('−') ? `(${F(a, b)})` : F(a, b)} = ${F(c * b, d * a)}`),
        [[c * a, d * b]],
      );
    },
    // Ribbon pieces.
    () => {
      const d = pick([2, 3, 4, 5]);
      const pieces = int(6, 30);
      return input(
        bi((L) => T(L, `Một cuộn dây dài ${frac(pieces, d)} m được cắt thành các đoạn dài ${frac(1, d)} m. Được bao nhiêu đoạn?`, `A ${frac(pieces, d)} m rope is cut into pieces ${frac(1, d)} m long. How many pieces?`)),
        pieces,
        bi(() => `${frac(pieces, d)} : ${frac(1, d)} = ${frac(pieces, d)} · ${d} = ${pieces}`),
      );
    },
  ],
  c6b27: [
    // Spent fractions in two steps.
    () => {
      const [a, b] = [1, pick([3, 4, 5])];
      const [c, d] = [int(1, 3), pick([4, 5, 6])];
      if (c >= d) return ADVANCED6.c6b27[0]();
      const unit = b * d;
      const total = unit * int(2, 10);
      const after1 = total - (total * a) / b;
      const left = after1 - (after1 * c) / d;
      if (!Number.isInteger(left) || !Number.isInteger(after1)) return ADVANCED6.c6b27[0]();
      return input(
        bi((L) => T(L, `Mai tiêu ${frac(a, b)} số tiền, rồi tiêu tiếp ${frac(c, d)} số tiền còn lại thì còn ${left} nghìn đồng. Lúc đầu Mai có bao nhiêu nghìn đồng?`, `Mai spends ${frac(a, b)} of her money, then ${frac(c, d)} of what is left, and has ${left} thousand dong left. How much did she have at first (thousand dong)?`)),
        total,
        bi(() => `${left} : ${frac(d - c, d)} = ${after1}; ${after1} : ${frac(b - a, b)} = ${total}`),
      );
    },
    // Two groups in a fraction relation.
    () => {
      const [m, n] = [int(1, 4), int(2, 7)];
      if (m >= n) return ADVANCED6.c6b27[1]();
      const k = int(3, 12);
      const [g, rest] = [m * k, n * k];
      return input(
        bi((L) => T(L, `Số học sinh giỏi bằng ${frac(m, n)} số học sinh còn lại của lớp. Lớp có ${g + rest} học sinh. Có bao nhiêu học sinh giỏi?`, `The number of top students is ${frac(m, n)} of the rest of the class. The class has ${g + rest} students. How many top students are there?`)),
        g,
        bi((L) => T(L, `Coi số còn lại là ${n} phần, số giỏi là ${m} phần: cả lớp ${m + n} phần = ${g + rest} ⇒ 1 phần = ${k}; số giỏi = ${m} · ${k} = ${g}.`, `The rest is ${n} parts, top students ${m} parts: ${m + n} parts = ${g + rest} ⇒ 1 part = ${k}; top students = ${m} · ${k} = ${g}.`)),
      );
    },
    // Percent-like discount.
    () => {
      const d = pick([4, 5, 10]);
      const m = int(1, d - 1);
      const price = d * int(10, 60);
      return input(
        bi((L) => T(L, `Một chiếc áo giá ${price} nghìn đồng được giảm ${frac(m, d)} giá. Giá sau khi giảm là bao nhiêu nghìn đồng?`, `A shirt costs ${price} thousand dong and is reduced by ${frac(m, d)} of its price. What is the new price (thousand dong)?`)),
        price - (price * m) / d,
        bi(() => `${price} − ${price} · ${frac(m, d)} = ${price} − ${(price * m) / d} = ${price - (price * m) / d}`),
      );
    },
  ],
};
