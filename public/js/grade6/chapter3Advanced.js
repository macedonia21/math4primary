// Grade 6, Chapter III: advanced ("nâng cao") exercises on integers —
// sums of ranges of integers, alternating sums, nested brackets, powers of
// negative numbers, divisibility of n + c by n + 1 over ℤ — with original
// wording and randomly generated numbers.

import {
  bi, T, fmt, int, pick, choice, input, inputZ, z, par, pw, divisors, DIV,
} from './util.js';

const eq = (html) => `<span class="eq">${html}</span>`;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const nonZero = (lo, hi) => { for (;;) { const v = int(lo, hi); if (v) return v; } };
const sumRange = (lo, hi) => range(lo, hi).reduce((s, v) => s + v, 0);

// ---------- Bài 13 ----------

const lesson13 = [
  // Sum of all integers in a range.
  () => {
    const a = int(3, 40);
    const b = int(2, 40);
    const strict = Math.random() < 0.5;
    const [lo, hi] = strict ? [-a + 1, b - 1] : [-a, b];
    const sum = sumRange(lo, hi);
    const keep = hi > -lo ? `${-lo + 1} + … + ${hi}` : hi < -lo ? `(${z(lo)}) + … + (${z(-hi - 1)})` : '0';
    return inputZ(
      bi((L) => T(L, `Tính tổng tất cả các số nguyên x thoả mãn ${eq(`${z(-a)} ${strict ? '&lt;' : '≤'} x ${strict ? '&lt;' : '≤'} ${b}`)}.`, `Add up all the integers x with ${eq(`${z(-a)} ${strict ? '&lt;' : '≤'} x ${strict ? '&lt;' : '≤'} ${b}`)}.`)),
      sum,
      bi((L) => T(L, `Các cặp số đối (−1 và 1, −2 và 2, …) có tổng 0. Còn lại: ${keep} = ${fmt(sum, L)}.`, `Opposite pairs (−1 and 1, −2 and 2, …) add to 0. What is left: ${keep} = ${fmt(sum, L)}.`)),
    );
  },
  // Extreme negative numbers.
  () => {
    const k = int(2, 4);
    const a = int(5, 300);
    const kind = pick(['largestK', 'smallestK', 'below', 'above']);
    const data = {
      largestK: [-(10 ** (k - 1)), (L) => T(L, `Tìm số nguyên âm <b>lớn nhất</b> có ${k} chữ số.`, `Find the <b>largest</b> negative integer with ${k} digits.`), (L) => T(L, `Số âm có phần số tự nhiên càng nhỏ thì càng lớn: −${10 ** (k - 1)}.`, `The smaller the number part, the larger the negative number: −${10 ** (k - 1)}.`)],
      smallestK: [-(10 ** k - 1), (L) => T(L, `Tìm số nguyên âm <b>nhỏ nhất</b> có ${k} chữ số.`, `Find the <b>smallest</b> negative integer with ${k} digits.`), (L) => T(L, `Phần số tự nhiên lớn nhất có ${k} chữ số là ${10 ** k - 1}: số cần tìm là −${10 ** k - 1}.`, `The largest ${k}-digit number part is ${10 ** k - 1}: the answer is −${10 ** k - 1}.`)],
      below: [-a - 1, (L) => T(L, `Tìm số nguyên lớn nhất <b>nhỏ hơn</b> −${a}.`, `Find the largest integer <b>less than</b> −${a}.`), (L) => T(L, `Ngay bên trái −${a} trên trục số là −${a + 1}.`, `Just left of −${a} on the number line is −${a + 1}.`)],
      above: [-a + 1, (L) => T(L, `Tìm số nguyên nhỏ nhất <b>lớn hơn</b> −${a}.`, `Find the smallest integer <b>greater than</b> −${a}.`), (L) => T(L, `Ngay bên phải −${a} trên trục số là ${z(-a + 1)}.`, `Just right of −${a} on the number line is ${z(-a + 1)}.`)],
    }[kind];
    return inputZ(bi(data[1]), data[0], bi(data[2]));
  },
  // A point a given distance from another point.
  () => {
    const start = int(-30, 10);
    const d = int(3, 25);
    const right = Math.random() < 0.5;
    const end = right ? start + d : start - d;
    return inputZ(
      bi((L) => T(L, `Trên trục số, điểm A biểu diễn số ${z(start)}. Điểm B nằm <b>bên ${right ? 'phải' : 'trái'}</b> A và cách A ${d} đơn vị. B biểu diễn số nào?`, `On the number line, point A is ${z(start)}. Point B is ${d} units <b>to the ${right ? 'right' : 'left'}</b> of A. Which number is B?`)),
      end,
      bi(() => `${par(start)} ${right ? '+' : '−'} ${d} = ${z(end)}`),
    );
  },
  // Count integers between two negatives.
  () => {
    const a = int(10, 60);
    const b = int(1, a - 3);
    const count = a - b; // −a ≤ x < −b
    return input(
      bi((L) => T(L, `Có bao nhiêu số nguyên x thoả mãn ${eq(`−${a} ≤ x &lt; −${b}`)}?`, `How many integers x satisfy ${eq(`−${a} ≤ x &lt; −${b}`)}?`)),
      count,
      bi((L) => T(L, `x = −${a}; −${a - 1}; …; −${b + 1}: có ${a} − ${b} = ${count} số.`, `x = −${a}, −${a - 1}, …, −${b + 1}: ${a} − ${b} = ${count} integers.`)),
    );
  },
];

// ---------- Bài 14 ----------

const lesson14 = [
  // Sum of consecutive integers from −a to b.
  () => {
    const a = int(5, 60);
    const b = int(5, 60);
    const sum = sumRange(-a, b);
    return inputZ(
      bi((L) => `${T(L, 'Tính tổng:', 'Work out:')} ${eq(`(−${a}) + (−${a - 1}) + … + ${b - 1} + ${b}`)}`),
      sum,
      bi((L) => T(L, `Các cặp số đối triệt tiêu nhau; còn lại ${b > a ? `${a + 1} + … + ${b}` : b < a ? `(−${a}) + … + (−${b + 1})` : '0'} = ${fmt(sum, L)}.`, `Opposite pairs cancel; what is left is ${b > a ? `${a + 1} + … + ${b}` : b < a ? `(−${a}) + … + (−${b + 1})` : '0'} = ${fmt(sum, L)}.`)),
    );
  },
  // Find x.
  () => {
    const x = nonZero(-60, 60);
    const a = nonZero(-60, 60);
    const forms = [
      [`x + ${par(a)} = ${z(x + a)}`, `x = ${z(x + a)} − ${par(a)}`],
      [`${z(a)} − x = ${z(a - x)}`, `x = ${z(a)} − ${par(a - x)}`],
      [`x − ${par(a)} = ${z(x - a)}`, `x = ${z(x - a)} + ${par(a)}`],
    ];
    const [text, how] = pick(forms);
    return inputZ(
      bi((L) => `${T(L, 'Tìm số nguyên x, biết:', 'Find the integer x:')} ${eq(text)}`),
      x,
      bi(() => `${how} = ${z(x)}`),
    );
  },
  // Submarine.
  () => {
    const [d, up, down] = [int(20, 200), int(5, 80), int(5, 120)];
    const end = -d + up - down;
    return inputZ(
      bi((L) => T(L, `Một tàu ngầm đang ở độ cao −${d} m (dưới mực nước biển). Tàu nổi lên ${up} m rồi lặn xuống ${down} m. Độ cao mới của tàu là bao nhiêu mét?`, `A submarine is at a height of −${d} m (below sea level). It rises ${up} m, then dives ${down} m. What is its new height, in metres?`)),
      end,
      bi(() => `(−${d}) + ${up} − ${down} = ${z(end)} (m)`),
    );
  },
  // Lifespan in years BC.
  () => {
    const born = int(200, 600);
    const life = int(40, 90);
    const died = born - life;
    return input(
      bi((L) => T(L, `Một nhà toán học cổ đại sinh năm −${born} và mất năm −${died} (năm âm là năm trước Công nguyên). Ông sống bao nhiêu năm?`, `An ancient mathematician was born in the year −${born} and died in −${died} (negative years are BC). How many years did they live?`)),
      life,
      bi(() => `(−${died}) − (−${born}) = −${died} + ${born} = ${life}`),
    );
  },
];

// ---------- Bài 15 ----------

const lesson15 = [
  // Alternating sum.
  () => {
    const n = int(10, 120);
    const value = n % 2 ? (n + 1) / 2 : -n / 2;
    const lastSign = n % 2 ? '+' : '−';
    return inputZ(
      bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`1 − 2 + 3 − 4 + … ${lastSign} ${n}`)}`),
      value,
      bi((L) => (n % 2
        ? T(L, `Nhóm (1 − 2) + (3 − 4) + … + (${n - 2} − ${n - 1}) + ${n}: ${(n - 1) / 2} cặp, mỗi cặp bằng −1, cộng thêm ${n}: −${(n - 1) / 2} + ${n} = ${value}.`, `Group (1 − 2) + (3 − 4) + … + (${n - 2} − ${n - 1}) + ${n}: ${(n - 1) / 2} pairs of −1, plus ${n}: −${(n - 1) / 2} + ${n} = ${value}.`)
        : T(L, `Nhóm (1 − 2) + (3 − 4) + … + (${n - 1} − ${n}): ${n / 2} cặp, mỗi cặp bằng −1: ${value}.`, `Group (1 − 2) + (3 − 4) + … + (${n - 1} − ${n}): ${n / 2} pairs, each −1: ${value}.`))),
    );
  },
  // Find x with brackets.
  () => {
    const x = nonZero(-50, 50);
    const [a, b] = [int(5, 80), int(5, 80)];
    const forms = [
      [`${a} − (x − ${b}) = ${z(a - x + b)}`, `x − ${b} = ${a} − ${par(a - x + b)} = ${z(x - b)}`],
      [`(x + ${a}) − (${b} − ${a}) = ${z(x + 2 * a - b)}`, `x + ${a} − ${b} + ${a} = ${z(x + 2 * a - b)} ⇒ x + ${2 * a - b < 0 ? `(−${b - 2 * a})` : 2 * a - b} = ${z(x + 2 * a - b)}`],
    ];
    const [text, how] = pick(forms);
    return inputZ(
      bi((L) => `${T(L, 'Tìm số nguyên x, biết:', 'Find the integer x:')} ${eq(text)}`),
      x,
      bi(() => `${how} ⇒ x = ${z(x)}`),
    );
  },
  // Nested brackets.
  () => {
    const [a, b, c, d] = [int(10, 90), int(10, 90), int(10, 90), int(10, 90)];
    const value = a - (b - (c - d));
    return inputZ(
      bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${a} − [${b} − (${c} − ${d})]`)}`),
      value,
      bi(() => `${a} − ${b} + (${c} − ${d}) = ${a} − ${b} + ${c} − ${d} = ${z(value)}`),
      { html: `${a} − [${b} − (${c} − ${d})]`, value },
    );
  },
  // Big numbers cancelling.
  () => {
    const [a, b, c] = [int(1000, 9999), int(100, 999), int(1000, 9999)];
    const value = 2 * b;
    return inputZ(
      bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(`(${fmt(a, L)} + ${b} − ${fmt(c, L)}) − (${fmt(a, L)} − ${b} − ${fmt(c, L)})`)}`),
      value,
      bi(() => `${a} + ${b} − ${c} − ${a} + ${b} + ${c} = ${b} + ${b} = ${value}`),
    );
  },
];

// ---------- Bài 16 ----------

const lesson16 = [
  // Powers of negative numbers.
  () => {
    const base = pick([-1, -2, -3]);
    const n = base === -1 ? int(10, 99) : base === -2 ? int(2, 9) : int(2, 5);
    const value = base ** n;
    return inputZ(
      bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(pw(`(${z(base)})`, n))}`),
      value,
      bi((L) => T(L, `${n} thừa số âm (${n % 2 ? 'lẻ' : 'chẵn'}) → kết quả ${n % 2 ? 'âm' : 'dương'}: ${pw(-base, n)} = ${fmt(Math.abs(value), L)} ⇒ ${fmt(value, L)}.`, `${n} negative factors (${n % 2 ? 'odd' : 'even'}) → ${n % 2 ? 'negative' : 'positive'}: ${pw(-base, n)} = ${fmt(Math.abs(value), L)} ⇒ ${fmt(value, L)}.`)),
    );
  },
  // Find x in a product.
  () => {
    const x = nonZero(-20, 20);
    const [a, b] = [nonZero(-9, 9), nonZero(-15, 15)];
    const value = (x - b) * a;
    return inputZ(
      bi((L) => `${T(L, 'Tìm số nguyên x, biết:', 'Find the integer x:')} ${eq(`(x − ${par(b)}) · ${par(a)} = ${z(value)}`)}`),
      x,
      bi(() => `x − ${par(b)} = ${par(value)} : ${par(a)} = ${z(x - b)} ⇒ x = ${z(x - b)} + ${par(b)} = ${z(x)}`),
    );
  },
  // Compare two powers of negative numbers.
  () => {
    let a; let m; let b; let n;
    do {
      [a, m, b, n] = [int(2, 4), int(2, 6), int(2, 4), int(2, 6)];
    } while ((-a) ** m === (-b) ** n || (a === b && m === n));
    const [X, Y] = [(-a) ** m, (-b) ** n];
    const ans = X < Y ? '&lt;' : '&gt;';
    return choice(
      bi((L) => `${T(L, 'So sánh:', 'Compare:')} ${eq(`${pw(`(−${a})`, m)} ☐ ${pw(`(−${b})`, n)}`)}`),
      ans,
      ['&lt;', '&gt;', '='].filter((s) => s !== ans),
      bi((L) => `${pw(`(−${a})`, m)} = ${fmt(X, L)}; ${pw(`(−${b})`, n)} = ${fmt(Y, L)} ${T(L, '(số mũ chẵn → dương, lẻ → âm)', '(even exponent → positive, odd → negative)')}`),
    );
  },
  // Longer expression.
  () => {
    const [a, b, c, d, e, f] = [nonZero(-9, 9), int(-20, 20), int(-20, 20), nonZero(-9, 9), int(-20, 20), int(-20, 20)];
    const value = a * (b - c) - d * (e + f);
    const html = `${par(a)} · (${z(b)} − ${par(c)}) − ${par(d)} · (${z(e)} + ${par(f)})`;
    return inputZ(
      bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(html)}`),
      value,
      bi(() => `${par(a)} · ${par(b - c)} − ${par(d)} · ${par(e + f)} = ${z(a * (b - c))} − ${par(d * (e + f))} = ${z(value)}`),
    );
  },
];

// ---------- Bài 17 ----------

const lesson17 = [
  // (n + c) ⋮ (n + 1) over the integers.
  () => {
    const r = pick([6, 8, 10, 12, 14, 15, 18, 20, 21, 24]);
    const c = r + 1;
    const ds = divisors(r);
    return input(
      bi((L) => T(L, `Có bao nhiêu số nguyên n để ${eq(`(n + ${c}) ${DIV} (n + 1)`)}?`, `How many integers n make ${eq(`(n + ${c}) ${DIV} (n + 1)`)}?`)),
      2 * ds.length,
      bi((L) => T(L, `n + ${c} = (n + 1) + ${r}, nên cần ${r} ${DIV} (n + 1): n + 1 là một trong ${2 * ds.length} ước nguyên của ${r} (±${ds.join('; ±')}).`, `n + ${c} = (n + 1) + ${r}, so ${r} ${DIV} (n + 1): n + 1 is one of the ${2 * ds.length} integer divisors of ${r} (±${ds.join(', ±')}).`)),
    );
  },
  // (2x + c) ⋮ (x + 1).
  () => {
    const r = pick([3, 5, 6, 7, 8, 9, 10, 12]);
    const c = r + 2;
    const ds = divisors(r);
    return input(
      bi((L) => T(L, `Có bao nhiêu số nguyên x để ${eq(`(2x + ${c}) ${DIV} (x + 1)`)}?`, `How many integers x make ${eq(`(2x + ${c}) ${DIV} (x + 1)`)}?`)),
      2 * ds.length,
      bi((L) => T(L, `2x + ${c} = 2(x + 1) + ${r}, nên cần ${r} ${DIV} (x + 1): có ${2 * ds.length} giá trị (x + 1 ∈ {±${ds.join('; ±')}}).`, `2x + ${c} = 2(x + 1) + ${r}, so ${r} ${DIV} (x + 1): ${2 * ds.length} values (x + 1 ∈ {±${ds.join(', ±')}}).`)),
    );
  },
  // Product equal to zero.
  () => {
    let a; let b;
    do { [a, b] = [nonZero(-20, 20), nonZero(-20, 20)]; } while (a === -b); // one repeated root
    return inputZ(
      bi((L) => T(L, `Tìm các số nguyên x biết ${eq(`(x − ${par(a)}) · (x + ${par(b)}) = 0`)}. Tính tổng các giá trị của x.`, `Find the integers x with ${eq(`(x − ${par(a)}) · (x + ${par(b)}) = 0`)}. Give the sum of all such x.`)),
      a - b,
      bi((L) => T(L, `Tích bằng 0 khi một thừa số bằng 0: x = ${z(a)} hoặc x = ${z(-b)}. Tổng: ${z(a)} + ${par(-b)} = ${z(a - b)}.`, `A product is 0 when a factor is 0: x = ${z(a)} or x = ${z(-b)}. Sum: ${z(a)} + ${par(-b)} = ${z(a - b)}.`)),
    );
  },
  // Multiples of k in an interval.
  () => {
    const k = int(3, 9);
    const a = int(10, 60);
    const b = int(10, 60);
    const list = range(-a + 1, b - 1).filter((v) => v % k === 0);
    return input(
      bi((L) => T(L, `Có bao nhiêu bội của ${k} nằm trong khoảng ${eq(`−${a} &lt; x &lt; ${b}`)}?`, `How many multiples of ${k} lie strictly between −${a} and ${b}?`)),
      list.length,
      bi((L) => T(L, `Các bội đó là ${z(list[0])}; ${z(list[1])}; …; ${z(list[list.length - 1])} (kể cả 0): ${list.length} số.`, `They are ${z(list[0])}, ${z(list[1])}, …, ${z(list[list.length - 1])} (0 included): ${list.length} numbers.`)),
    );
  },
];

export const ADVANCED3 = {
  c3b13: lesson13, c3b14: lesson14, c3b15: lesson15, c3b16: lesson16, c3b17: lesson17,
};
