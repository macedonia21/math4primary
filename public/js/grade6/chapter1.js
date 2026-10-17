// Grade 6, Chapter I: the set of natural numbers. Theory, step-by-step
// examples and exercise generators for lessons 1–7. All text is original,
// written to follow the curriculum topics (not copied from any textbook).

import {
  bi, T, fmt, setOf, pw, int, pick, shuffle, distinct, choice, input, nearNumbers,
} from './util.js';
import {
  derivation, numberLine, venn, placeTable, dots, groups,
} from './visuals.js';

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const hl = (s, tone = 'a') => `<span class="hl ${tone}">${s}</span>`;
const cap = (html, isNew = false, big = false) => `<p class="vx-caption${isNew ? ' new' : ''}${big ? ' big' : ''}">${html}</p>`;
const eq = (html) => `<span class="eq">${html}</span>`;

// ---------- Bài 1. Tập hợp ----------

const lesson1 = {
  id: 'c1b1',
  number: 1,
  title: { vi: 'Tập hợp', en: 'Sets' },
  points: [
    {
      title: { vi: 'Tập hợp và phần tử', en: 'Sets and elements' },
      theory: {
        vi: [
          'Một <b>tập hợp</b> gồm những đối tượng được xác định rõ ràng; mỗi đối tượng là một <b>phần tử</b> của tập hợp.',
          'Tên tập hợp thường là chữ in hoa: A, B, C, … Các phần tử viết trong dấu <b>{ }</b>, cách nhau bởi dấu <b>;</b>',
          'Mỗi phần tử chỉ viết <b>một lần</b>, thứ tự liệt kê tuỳ ý.',
          '<b>x ∈ A</b> đọc là "x thuộc A". <b>y ∉ A</b> đọc là "y không thuộc A".',
        ],
        en: [
          'A <b>set</b> is a collection of clearly defined objects; each object is an <b>element</b> of the set.',
          'Sets are usually named with capital letters: A, B, C, … Elements are written inside <b>{ }</b>, separated by commas.',
          'Each element is written <b>only once</b>, in any order.',
          '<b>x ∈ A</b> reads "x belongs to A". <b>y ∉ A</b> reads "y does not belong to A".',
        ],
      },
      example: {
        caption: { vi: 'A là tập hợp các chữ số lẻ.', en: 'A is the set of odd digits.' },
        frames: (L) => {
          const inside = [1, 3, 5, 7, 9];
          const outside = [4, 6];
          const base = venn({ name: 'A', inside, outside });
          return [
            venn({ name: 'A' }),
            venn({ name: 'A', inside, newInside: true }),
            venn({ name: 'A', inside, outside, newOutside: true })
              + cap(T(L, '4 và 6 là chữ số chẵn nên nằm ngoài A.', '4 and 6 are even, so they lie outside A.'), true),
            `${base}${cap(T(L, '4 và 6 là chữ số chẵn nên nằm ngoài A.', '4 and 6 are even, so they lie outside A.'))}
              ${cap('3 ∈ A &nbsp;&nbsp;&nbsp; 4 ∉ A', true, true)}`,
            `${base}${cap(T(L, '4 và 6 là chữ số chẵn nên nằm ngoài A.', '4 and 6 are even, so they lie outside A.'))}${cap('3 ∈ A &nbsp;&nbsp;&nbsp; 4 ∉ A', false, true)}${cap(`A = ${setOf(inside, L)}`, true, true)}`,
          ];
        },
      },
    },
    {
      title: { vi: 'Hai cách mô tả một tập hợp', en: 'Two ways to describe a set' },
      theory: {
        vi: [
          '<b>Cách 1 – Liệt kê</b> các phần tử: B = {0; 1; 2; 3; 4}.',
          '<b>Cách 2 – Chỉ ra tính chất đặc trưng</b> của các phần tử: B = {x | x ∈ ℕ, x &lt; 5}, đọc là "B là tập hợp các x sao cho x là số tự nhiên và x nhỏ hơn 5".',
          '<b>ℕ</b> là tập hợp các số tự nhiên: ℕ = {0; 1; 2; 3; …}. <b>ℕ*</b> là tập hợp các số tự nhiên khác 0.',
        ],
        en: [
          '<b>Way 1 – List</b> the elements: B = {0, 1, 2, 3, 4}.',
          '<b>Way 2 – State the property</b> that the elements share: B = {x | x ∈ ℕ, x &lt; 5}, read "B is the set of all x such that x is a natural number less than 5".',
          '<b>ℕ</b> is the set of natural numbers: ℕ = {0, 1, 2, 3, …}. <b>ℕ*</b> is the set of natural numbers other than 0.',
        ],
      },
      example: {
        caption: { vi: 'Liệt kê các phần tử của tập hợp C.', en: 'List the elements of set C.' },
        frames: (L) => {
          const title = cap('C = {x | x ∈ ℕ, 2 &lt; x ≤ 6}', false, true);
          const pts = [3, 4, 5, 6].map((n) => ({ n }));
          const note = T(L, '2 không thuộc C (x phải lớn hơn 2); 6 thuộc C (x được bằng 6).', '2 is not in C (x must be greater than 2); 6 is in C (x may equal 6).');
          return [
            title + numberLine({ from: 0, to: 9 }),
            title + numberLine({ from: 0, to: 9, points: pts.map((p) => ({ ...p, isNew: true })) }),
            title + numberLine({ from: 0, to: 9, points: [...pts, { n: 2, tone: 'off', isNew: true }] }) + cap(note, true),
            title + numberLine({ from: 0, to: 9, points: [...pts, { n: 2, tone: 'off' }] }) + cap(note)
              + cap(`C = ${setOf([3, 4, 5, 6], L)} — ${T(L, 'C có 4 phần tử', 'C has 4 elements')}`, true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Which statement about A is true?
    () => {
      const elems = distinct(int(4, 5), 0, 20);
      const others = shuffle(range(0, 20).filter((n) => !elems.includes(n)));
      const inA = shuffle(elems);
      const correct = Math.random() < 0.5 ? `${inA[0]} ∈ A` : `${others[0]} ∉ A`;
      const wrongs = [`${others[1]} ∈ A`, `${inA[1]} ∉ A`, Math.random() < 0.5 ? `${others[2]} ∈ A` : `${inA[2]} ∉ A`];
      const sorted = [...elems].sort((a, b) => a - b);
      return choice(
        bi((L) => `${T(L, 'Cho', 'Let')} A = ${setOf(inA, L)}. ${T(L, 'Khẳng định nào <b>đúng</b>?', 'Which statement is <b>true</b>?')}`),
        correct,
        wrongs,
        bi((L) => T(L, `A chỉ gồm các phần tử ${setOf(sorted, L)}.`, `A contains exactly ${setOf(sorted, L)}.`)),
      );
    },
    // ∈ or ∉?
    () => {
      const elems = distinct(5, 0, 30);
      const isIn = Math.random() < 0.5;
      const x = isIn ? pick(elems) : pick(range(0, 30).filter((n) => !elems.includes(n)));
      return choice(
        bi((L) => `B = ${setOf(elems, L)}. ${T(L, 'Chọn kí hiệu thích hợp:', 'Choose the right symbol:')} ${eq(`${x} ☐ B`)}`),
        isIn ? '∈' : '∉',
        [isIn ? '∉' : '∈'],
        bi((L) => (isIn
          ? T(L, `${x} có trong danh sách phần tử của B nên ${x} ∈ B.`, `${x} is listed in B, so ${x} ∈ B.`)
          : T(L, `${x} không có trong danh sách phần tử của B nên ${x} ∉ B.`, `${x} is not listed in B, so ${x} ∉ B.`))),
      );
    },
    // How many elements?
    () => {
      const a = int(0, 30);
      const b = a + int(3, 12);
      const strictLow = Math.random() < 0.5;
      const strictHigh = Math.random() < 0.5;
      const lo = strictLow ? a + 1 : a;
      const hi = strictHigh ? b - 1 : b;
      const count = hi - lo + 1;
      const cond = `${a} ${strictLow ? '&lt;' : '≤'} x ${strictHigh ? '&lt;' : '≤'} ${b}`;
      return input(
        bi((L) => `${T(L, 'Tập hợp', 'How many elements does')} M = {x | x ∈ ℕ, ${cond}} ${T(L, 'có bao nhiêu phần tử?', 'have?')}`),
        count,
        bi((L) => (count <= 8
          ? `M = ${setOf(range(lo, hi), L)} — ${T(L, `có ${count} phần tử.`, `${count} elements.`)}`
          : T(L, `M gồm các số từ ${lo} đến ${hi}: ${hi} − ${lo} + 1 = ${count} phần tử.`, `M holds the numbers from ${lo} to ${hi}: ${hi} − ${lo} + 1 = ${count} elements.`))),
      );
    },
    // From a property to a list.
    () => {
      const a = int(0, 15);
      const b = a + int(3, 5);
      const list = (lo, hi) => bi((L) => setOf(range(lo, hi), L));
      return choice(
        bi((L) => `${T(L, 'Viết tập hợp bằng cách liệt kê phần tử:', 'Write the set by listing its elements:')} ${eq(`D = {x | x ∈ ℕ, ${a} &lt; x ≤ ${b}}`)}`),
        list(a + 1, b),
        [list(a, b), list(a + 1, b - 1), list(a, b - 1)],
        bi((L) => T(L, `x lớn hơn ${a} (không lấy ${a}) và nhỏ hơn hoặc bằng ${b} (có lấy ${b}).`, `x is greater than ${a} (so not ${a}) and at most ${b} (so ${b} is included).`)),
      );
    },
    // From a list to the property.
    () => {
      const even = Math.random() < 0.5;
      const n = 2 * int(3, 8) + (even ? 0 : 1); // same parity, so "≤ n" would add n itself
      const elems = range(0, n - 1).filter((v) => v % 2 === (even ? 0 : 1));
      const kind = (L, isEven) => T(L, isEven ? 'x là số chẵn' : 'x là số lẻ', isEven ? 'x is even' : 'x is odd');
      const prop = (L, isEven, rel) => `{x | x ∈ ℕ, ${kind(L, isEven)}, x ${rel} ${n}}`;
      return choice(
        bi((L) => `${T(L, 'Tập hợp', 'Which property describes')} E = ${setOf(elems, L)} ${T(L, 'được mô tả bởi tính chất nào?', '?')}`),
        bi((L) => prop(L, even, '&lt;')),
        [
          bi((L) => prop(L, even, '≤')),
          bi((L) => prop(L, !even, '&lt;')),
          bi((L) => `{x | x ∈ ℕ, x &lt; ${n}}`),
        ],
        bi((L) => T(L, `E gồm các số ${even ? 'chẵn' : 'lẻ'} nhỏ hơn ${n}; ${n} không thuộc E nên dùng dấu &lt;.`, `E holds the ${even ? 'even' : 'odd'} numbers below ${n}; ${n} itself is not in E, so use &lt;.`)),
      );
    },
  ],
};

// ---------- Bài 2. Cách ghi số tự nhiên ----------

const PLACES = {
  vi: ['đơn vị', 'chục', 'trăm', 'nghìn', 'chục nghìn', 'trăm nghìn'],
  en: ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'],
};

const ONES = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
export const toRoman = (n) => 'X'.repeat(Math.floor(n / 10)) + ONES[n % 10];

function romanMistakes(n) {
  const tens = 'X'.repeat(Math.floor(n / 10));
  const ones = n % 10;
  const wrong = new Set();
  if (ones === 4) { wrong.add(`${tens}IIII`); wrong.add(`${tens}VI`); }
  if (ones === 9) { wrong.add(`${tens}VIIII`); wrong.add(`${tens}XI`); }
  if (ones === 6) wrong.add(`${tens}IV`);
  if (n + 1 <= 30) wrong.add(toRoman(n + 1));
  if (n - 1 >= 1) wrong.add(toRoman(n - 1));
  if (n + 10 <= 39) wrong.add(toRoman(n + 10));
  for (const extra of [n + 2, n + 5, n + 3]) if (wrong.size < 4 && extra <= 39) wrong.add(toRoman(extra));
  wrong.delete(toRoman(n));
  return shuffle([...wrong]).slice(0, 3);
}

const romanNumber = () => (Math.random() < 0.5 ? pick([4, 9, 14, 19, 24, 29]) : int(1, 30));

const lesson2 = {
  id: 'c1b2',
  number: 2,
  title: { vi: 'Cách ghi số tự nhiên', en: 'Writing natural numbers' },
  points: [
    {
      title: { vi: 'Hệ thập phân', en: 'The decimal system' },
      theory: {
        vi: [
          'Dùng <b>10 chữ số</b> 0; 1; 2; …; 9 để viết mọi số tự nhiên.',
          'Giá trị của mỗi chữ số phụ thuộc vào <b>vị trí</b> (hàng) của nó. Cứ 10 đơn vị ở một hàng thì bằng 1 đơn vị ở hàng liền trước.',
          'Mỗi số viết được thành tổng giá trị các chữ số: <b>abcd = a × 1 000 + b × 100 + c × 10 + d</b> (a ≠ 0).',
          '<b>Số chục</b> của một số: bỏ đi chữ số hàng đơn vị. <b>Số trăm</b>: bỏ đi hai chữ số cuối.',
        ],
        en: [
          '<b>Ten digits</b> 0, 1, 2, …, 9 are enough to write every natural number.',
          'The value of a digit depends on its <b>position</b> (place). 10 units of one place make 1 unit of the next place to the left.',
          'Every number is the sum of its digit values: <b>abcd = a × 1,000 + b × 100 + c × 10 + d</b> (a ≠ 0).',
          'The <b>number of tens</b> in a number: drop the ones digit. The <b>number of hundreds</b>: drop the last two digits.',
        ],
      },
      example: {
        caption: { vi: 'Phân tích số 6 205 theo các hàng.', en: 'Break 6,205 into its places.' },
        frames: (L) => {
          const headers = T(L, ['Nghìn', 'Trăm', 'Chục', 'Đơn vị'], ['Thousands', 'Hundreds', 'Tens', 'Ones']);
          const digits = [6, 2, 0, 5];
          const title = cap(fmt(6205, L), false, true);
          const sum = `${fmt(6205, L)} = 6 × ${fmt(1000, L)} + 2 × 100 + 0 × 10 + 5`;
          const tens = T(L, 'Số trăm của 6 205 là 62; số chục là 620.', '6,205 has 62 hundreds and 620 tens in total.');
          const full = placeTable({ headers, digits, showDigits: true, showValues: true });
          return [
            title + placeTable({ headers, digits }),
            title + placeTable({ headers, digits, showDigits: true, isNew: 'digits' }),
            title + placeTable({ headers, digits, showDigits: true, showValues: true, isNew: 'values' }),
            title + full + cap(sum, true),
            title + full + cap(sum) + cap(tens, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Số La Mã', en: 'Roman numerals' },
      theory: {
        vi: [
          'Ba chữ số cơ bản: <b>I = 1</b>, <b>V = 5</b>, <b>X = 10</b>.',
          'I viết <b>bên phải</b> V hoặc X thì cộng thêm: VI = 6, XI = 11. I viết <b>bên trái</b> thì bớt đi: IV = 4, IX = 9.',
          'Chữ số I và X không đứng liền nhau quá <b>ba lần</b>: 3 = III, nhưng 4 = IV (không viết IIII).',
          'Từ 11 đến 30: viết X, XX hoặc XXX rồi ghép thêm số từ 1 đến 10. Ví dụ 24 = XX + IV = XXIV.',
        ],
        en: [
          'Three basic numerals: <b>I = 1</b>, <b>V = 5</b>, <b>X = 10</b>.',
          'I written <b>to the right</b> of V or X adds: VI = 6, XI = 11. Written <b>to the left</b> it subtracts: IV = 4, IX = 9.',
          'I and X are never repeated more than <b>three times</b> in a row: 3 = III, but 4 = IV (not IIII).',
          'From 11 to 30: write X, XX or XXX, then add a number from 1 to 10. For example 24 = XX + IV = XXIV.',
        ],
      },
      example: {
        caption: { vi: 'Đọc số La Mã XXIX.', en: 'Read the Roman numeral XXIX.' },
        frames: () => derivation([
          `<span class="roman">XXIX</span>`,
          `= ${hl('X')} + ${hl('X')} + ${hl('IX', 'b')}`,
          `= ${hl('10')} + ${hl('10')} + ${hl('9', 'b')}`,
          '= 29',
        ]),
      },
    },
  ],
  exercises: [
    // Value of a digit.
    () => {
      let n;
      let pos;
      for (;;) {
        n = int(10000, 999999);
        const s = String(n);
        pos = int(0, s.length - 1);
        if (s[pos] !== '0' && s.split(s[pos]).length === 2) break;
      }
      const s = String(n);
      const d = Number(s[pos]);
      const place = s.length - 1 - pos;
      const others = range(0, 6).filter((q) => q !== place).sort((x, y) => Math.abs(x - place) - Math.abs(y - place)).slice(0, 3);
      const val = (q) => bi((L) => fmt(d * 10 ** q, L));
      return choice(
        bi((L) => T(L, `Trong số ${fmt(n, L)}, chữ số ${d} có giá trị bằng bao nhiêu?`, `In ${fmt(n, L)}, what is the value of the digit ${d}?`)),
        val(place),
        others.map(val),
        bi((L) => T(L, `Chữ số ${d} ở hàng ${PLACES.vi[place]} nên có giá trị ${fmt(d * 10 ** place, L)}.`, `The digit ${d} is in the ${PLACES.en[place]} place, so it is worth ${fmt(d * 10 ** place, L)}.`)),
      );
    },
    // Number of tens / hundreds.
    () => {
      const n = int(1000, 99999);
      const tens = Math.random() < 0.5;
      const ans = tens ? Math.floor(n / 10) : Math.floor(n / 100);
      return input(
        bi((L) => T(L, `Số ${tens ? 'chục' : 'trăm'} của ${fmt(n, L)} là bao nhiêu?`, `How many ${tens ? 'tens' : 'hundreds'} are there in ${fmt(n, L)} in total?`)),
        ans,
        bi((L) => T(L, `Bỏ đi ${tens ? 'chữ số cuối' : 'hai chữ số cuối'} của ${fmt(n, L)}: được ${fmt(ans, L)}.`, `Drop the last ${tens ? 'digit' : 'two digits'} of ${fmt(n, L)}: ${fmt(ans, L)}.`)),
      );
    },
    // Build the number from its expanded form.
    () => {
      const len = pick([4, 5]);
      const digits = [int(1, 9), ...Array.from({ length: len - 1 }, () => (Math.random() < 0.3 ? 0 : int(1, 9)))];
      const n = Number(digits.join(''));
      const terms = (L) => digits.map((d, i) => {
        const p = 10 ** (len - 1 - i);
        return p === 1 ? `${d}` : `${d} × ${fmt(p, L)}`;
      }).join(' + ');
      return input(
        bi((L) => `${T(L, 'Viết số:', 'Write the number:')} ${eq(terms(L))}`),
        n,
        bi((L) => T(L, `Mỗi chữ số đứng ở đúng hàng của nó: ${fmt(n, L)}.`, `Each digit goes in its own place: ${fmt(n, L)}.`)),
      );
    },
    // Roman to number (multiple choice).
    () => {
      const n = romanNumber();
      const misread = n % 10 === 4 ? n + 2 : n % 10 === 9 ? n + 2 : null; // IV read as VI, IX read as XI
      const wrongs = new Set([misread, n + 1, n - 1, n + 10, n + 5].filter((v) => v && v > 0 && v !== n));
      return choice(
        bi((L) => T(L, `Số La Mã <span class="roman">${toRoman(n)}</span> có giá trị là:`, `The Roman numeral <span class="roman">${toRoman(n)}</span> is worth:`)),
        n,
        shuffle([...wrongs]).slice(0, 3),
        bi((L) => `${toRoman(n)} = ${n}.${[4, 9].includes(n % 10) ? T(L, ' Nhớ: I đứng trước V hoặc X thì bớt 1.', ' Remember: I before V or X subtracts 1.') : ''}`),
      );
    },
    // Number to Roman.
    () => {
      const n = romanNumber();
      return choice(
        bi((L) => T(L, `Số ${n} viết bằng số La Mã là:`, `How is ${n} written in Roman numerals?`)),
        toRoman(n),
        romanMistakes(n),
        bi((L) => T(L, `${n} = ${toRoman(n)}. Không viết I quá ba lần liền nhau.`, `${n} = ${toRoman(n)}. I is never written more than three times in a row.`)),
      );
    },
    // Roman to number (typed).
    () => {
      const n = romanNumber();
      return input(
        bi((L) => T(L, `Viết số <span class="roman">${toRoman(n)}</span> trong hệ thập phân.`, `Write <span class="roman">${toRoman(n)}</span> as an ordinary number.`)),
        n,
        bi(() => `${toRoman(n)} = ${n}`),
      );
    },
  ],
};

// ---------- Bài 3. Thứ tự trong tập hợp các số tự nhiên ----------

function compareExplain(a, b, L) {
  const sa = String(a);
  const sb = String(b);
  if (sa.length !== sb.length) {
    return T(L, `${fmt(a, L)} có ${sa.length} chữ số, ${fmt(b, L)} có ${sb.length} chữ số: số nhiều chữ số hơn thì lớn hơn.`, `${fmt(a, L)} has ${sa.length} digits and ${fmt(b, L)} has ${sb.length}: more digits means bigger.`);
  }
  const i = [...sa].findIndex((c, k) => c !== sb[k]);
  if (i < 0) return T(L, 'Hai số giống hệt nhau.', 'The two numbers are the same.');
  const place = sa.length - 1 - i;
  return T(L, `Cùng ${sa.length} chữ số. So sánh từ trái sang phải: khác nhau đầu tiên ở hàng ${PLACES.vi[place]} (${sa[i]} và ${sb[i]}).`, `Same number of digits. Compare from the left: the first difference is in the ${PLACES.en[place]} place (${sa[i]} and ${sb[i]}).`);
}

const lesson3 = {
  id: 'c1b3',
  number: 3,
  title: { vi: 'Thứ tự trong tập hợp các số tự nhiên', en: 'Order in the natural numbers' },
  points: [
    {
      title: { vi: 'Tia số và thứ tự', en: 'The number ray and order' },
      theory: {
        vi: [
          'Mỗi số tự nhiên được biểu diễn bởi một điểm trên <b>tia số</b>; điểm biểu diễn số a gọi là điểm a.',
          'Trên tia số nằm ngang (chiều từ trái sang phải), nếu <b>a &lt; b</b> thì điểm a nằm <b>bên trái</b> điểm b.',
          '<b>a ≤ b</b> nghĩa là a &lt; b hoặc a = b. Nếu a &lt; b và b &lt; c thì a &lt; c (tính chất bắc cầu).',
        ],
        en: [
          'Each natural number is shown by a point on the <b>number ray</b>; the point for the number a is called point a.',
          'On a horizontal ray (pointing left to right), if <b>a &lt; b</b> then point a lies <b>to the left</b> of point b.',
          '<b>a ≤ b</b> means a &lt; b or a = b. If a &lt; b and b &lt; c, then a &lt; c (the transitive property).',
        ],
      },
      example: {
        caption: { vi: 'So sánh 3 và 8 trên tia số.', en: 'Compare 3 and 8 on the number ray.' },
        frames: (L) => [
          numberLine({ from: 0, to: 10 }),
          numberLine({ from: 0, to: 10, points: [{ n: 3, isNew: true }] }),
          numberLine({ from: 0, to: 10, points: [{ n: 3 }, { n: 8, tone: 'b', isNew: true }] }),
          numberLine({ from: 0, to: 10, points: [{ n: 3 }, { n: 8, tone: 'b' }] })
            + cap(T(L, 'Điểm 3 nằm bên trái điểm 8 nên <b>3 &lt; 8</b> (hay 8 &gt; 3).', 'Point 3 is to the left of point 8, so <b>3 &lt; 8</b> (or 8 &gt; 3).'), true),
        ],
      },
    },
    {
      title: { vi: 'Số liền trước, số liền sau', en: 'The number before and the number after' },
      theory: {
        vi: [
          'Mỗi số tự nhiên n có đúng một <b>số liền sau</b> là <b>n + 1</b>.',
          'Mỗi số tự nhiên n khác 0 có đúng một <b>số liền trước</b> là <b>n − 1</b>. Số 0 không có số liền trước trong ℕ.',
          'Hai số tự nhiên liên tiếp hơn kém nhau 1 đơn vị. Số 0 là số tự nhiên nhỏ nhất; không có số tự nhiên lớn nhất.',
        ],
        en: [
          'Every natural number n has exactly one <b>successor</b> (the number after it): <b>n + 1</b>.',
          'Every natural number n other than 0 has exactly one <b>predecessor</b> (the number before it): <b>n − 1</b>. 0 has no predecessor in ℕ.',
          'Two consecutive natural numbers differ by 1. 0 is the smallest natural number; there is no largest one.',
        ],
      },
      example: {
        caption: { vi: 'Số liền trước và liền sau của 6.', en: 'The numbers before and after 6.' },
        frames: (L) => {
          const before = { a: 6, b: 5, label: '−1' };
          const after = { a: 6, b: 7, label: '+1' };
          const capBefore = cap(T(L, 'Số liền trước của 6 là <b>5</b>.', 'The number before 6 is <b>5</b>.'));
          const capAfter = cap(T(L, 'Số liền sau của 6 là <b>7</b>.', 'The number after 6 is <b>7</b>.'));
          return [
            numberLine({ from: 0, to: 10, points: [{ n: 6 }] }),
            numberLine({ from: 0, to: 10, points: [{ n: 6 }, { n: 5, tone: 'b', isNew: true }], arcs: [{ ...before, isNew: true }] })
              + cap(T(L, 'Số liền trước của 6 là <b>5</b>.', 'The number before 6 is <b>5</b>.'), true),
            numberLine({ from: 0, to: 10, points: [{ n: 6 }, { n: 5, tone: 'b' }, { n: 7, tone: 'b', isNew: true }], arcs: [before, { ...after, isNew: true }] })
              + capBefore + cap(T(L, 'Số liền sau của 6 là <b>7</b>.', 'The number after 6 is <b>7</b>.'), true),
            numberLine({ from: 0, to: 10, points: [{ n: 6 }, { n: 5, tone: 'b' }, { n: 7, tone: 'b' }], arcs: [before, after] })
              + capBefore + capAfter + cap(T(L, '5; 6; 7 là ba số tự nhiên liên tiếp.', '5, 6, 7 are three consecutive natural numbers.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'So sánh hai số tự nhiên', en: 'Comparing two natural numbers' },
      theory: {
        vi: [
          'Số nào có <b>nhiều chữ số hơn</b> thì lớn hơn.',
          'Nếu hai số có cùng số chữ số: so sánh từng cặp chữ số ở cùng hàng, <b>từ trái sang phải</b>. Cặp đầu tiên khác nhau quyết định số nào lớn hơn.',
        ],
        en: [
          'The number with <b>more digits</b> is bigger.',
          'If both have the same number of digits: compare digits in the same place <b>from left to right</b>. The first pair that differs decides which is bigger.',
        ],
      },
      example: {
        caption: { vi: 'So sánh 47 385 và 47 392.', en: 'Compare 47,385 and 47,392.' },
        frames: (L) => derivation([
          `${fmt(47385, L)} ☐ ${fmt(47392, L)}`,
          T(L, 'Cùng có 5 chữ số → so sánh từ trái sang phải:', 'Both have 5 digits → compare from the left:'),
          `4 = 4, 7 = 7, 3 = 3, ${hl('8')} &lt; ${hl('9')} ${T(L, '(hàng chục)', '(tens place)')}`,
          `${T(L, 'Vậy', 'So')} <b>${fmt(47385, L)} &lt; ${fmt(47392, L)}</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // Number before / after.
    () => {
      const after = Math.random() < 0.5;
      const n = Math.random() < 0.4 ? pick([9, 99, 999, 9999, 99999, 1000, 10000, 100000, 2000, 39999, 70000]) : int(1, 99999);
      const ans = after ? n + 1 : n - 1;
      return input(
        bi((L) => T(L, `Số liền ${after ? 'sau' : 'trước'} của ${fmt(n, L)} là số nào?`, `What is the number ${after ? 'after' : 'before'} ${fmt(n, L)}?`)),
        ans,
        bi((L) => `${fmt(n, L)} ${after ? '+' : '−'} 1 = ${fmt(ans, L)}`),
      );
    },
    // Smallest / largest k-digit number, then its neighbour.
    () => {
      const k = int(2, 6);
      const smallest = Math.random() < 0.5;
      const n = smallest ? 10 ** (k - 1) : 10 ** k - 1;
      const ans = smallest ? n - 1 : n + 1;
      return input(
        bi((L) => (smallest
          ? T(L, `Số liền trước của số nhỏ nhất có ${k} chữ số là số nào?`, `What is the number before the smallest ${k}-digit number?`)
          : T(L, `Số liền sau của số lớn nhất có ${k} chữ số là số nào?`, `What is the number after the largest ${k}-digit number?`))),
        ans,
        bi((L) => T(L, `Số ${smallest ? 'nhỏ' : 'lớn'} nhất có ${k} chữ số là ${fmt(n, L)}; số liền ${smallest ? 'trước' : 'sau'} của nó là ${fmt(ans, L)}.`, `The ${smallest ? 'smallest' : 'largest'} ${k}-digit number is ${fmt(n, L)}; the number ${smallest ? 'before' : 'after'} it is ${fmt(ans, L)}.`)),
      );
    },
    // Compare two numbers.
    () => {
      const len = int(4, 6);
      const a = int(10 ** (len - 1), 10 ** len - 1);
      let b;
      const r = Math.random();
      if (r < 0.1) {
        b = a;
      } else if (r < 0.3) {
        b = int(10 ** (len - 2), 10 ** (len - 1) - 1); // fewer digits
      } else {
        const digits = [...String(a)];
        const i = int(1, len - 1);
        let d;
        do { d = int(0, 9); } while (String(d) === digits[i]);
        digits[i] = String(d);
        b = Number(digits.join(''));
      }
      const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
      const ans = x < y ? '&lt;' : x > y ? '&gt;' : '=';
      return choice(
        bi((L) => `${T(L, 'Điền dấu thích hợp:', 'Choose the right sign:')} ${eq(`${fmt(x, L)} ☐ ${fmt(y, L)}`)}`),
        ans,
        ['&lt;', '&gt;', '='].filter((s) => s !== ans),
        bi((L) => compareExplain(x, y, L)),
      );
    },
    // Largest or smallest of four numbers made from the same digits.
    () => {
      const digits = distinct(4, 1, 9);
      const nums = new Set();
      while (nums.size < 4) nums.add(Number(shuffle(digits).join('')));
      const list = [...nums];
      const largest = Math.random() < 0.5;
      const ans = largest ? Math.max(...list) : Math.min(...list);
      return choice(
        bi((L) => T(L, `Số nào <b>${largest ? 'lớn' : 'nhỏ'} nhất</b>?`, `Which number is the <b>${largest ? 'largest' : 'smallest'}</b>?`)),
        bi((L) => fmt(ans, L)),
        list.filter((v) => v !== ans).map((v) => bi((L) => fmt(v, L))),
        bi((L) => T(L, 'Các số cùng 4 chữ số: so sánh từ chữ số hàng nghìn trở đi.', 'All have 4 digits: compare from the thousands digit onwards.')),
      );
    },
    // Three consecutive numbers.
    () => {
      const n = int(10, 9999);
      const sep = (L) => (L === 'vi' ? '; ' : ', ');
      const triple = (arr) => bi((L) => arr.map((v) => fmt(v, L)).join(sep(L)));
      return choice(
        bi((L) => T(L, 'Dãy nào gồm <b>ba số tự nhiên liên tiếp tăng dần</b>?', 'Which list shows <b>three consecutive natural numbers in increasing order</b>?')),
        triple([n - 1, n, n + 1]),
        [triple([n + 1, n, n - 1]), triple([n - 1, n + 1, n + 3]), triple([n, n + 1, n + 3])],
        bi((L) => T(L, 'Ba số liên tiếp tăng dần: mỗi số hơn số đứng trước đúng 1 đơn vị.', 'Consecutive and increasing: each number is exactly 1 more than the one before.')),
      );
    },
  ],
};

// ---------- Bài 4. Phép cộng và phép trừ số tự nhiên ----------

const ITEMS = [
  ['một quyển truyện', 'a storybook'],
  ['một hộp bút màu', 'a box of crayons'],
  ['một chiếc thước kẻ', 'a ruler'],
  ['một quả bóng', 'a ball'],
  ['một cuốn vở', 'a notebook'],
  ['một hộp bánh', 'a box of cakes'],
];
const NAMES = ['An', 'Bình', 'Lan', 'Minh', 'Hoa', 'Nam', 'Mai'];

const lesson4 = {
  id: 'c1b4',
  number: 4,
  title: { vi: 'Phép cộng và phép trừ số tự nhiên', en: 'Adding and subtracting natural numbers' },
  points: [
    {
      title: { vi: 'Phép cộng và các tính chất', en: 'Addition and its properties' },
      theory: {
        vi: [
          '<b>a + b = c</b>: a và b là các <b>số hạng</b>, c là <b>tổng</b>.',
          '<b>Giao hoán</b>: a + b = b + a. <b>Kết hợp</b>: (a + b) + c = a + (b + c). <b>Cộng với 0</b>: a + 0 = a.',
          'Mẹo tính nhanh: đổi chỗ và nhóm các số có tổng tròn chục, tròn trăm.',
        ],
        en: [
          '<b>a + b = c</b>: a and b are the <b>terms</b> (addends), c is the <b>sum</b>.',
          '<b>Commutative</b>: a + b = b + a. <b>Associative</b>: (a + b) + c = a + (b + c). <b>Adding zero</b>: a + 0 = a.',
          'Quick trick: reorder and group numbers whose sum is a round ten or hundred.',
        ],
      },
      example: {
        caption: { vi: 'Tính nhanh 38 + 76 + 62 + 24.', en: 'Work out 38 + 76 + 62 + 24 quickly.' },
        frames: (L) => derivation([
          `${hl('38')} + ${hl('76', 'b')} + ${hl('62')} + ${hl('24', 'b')}`,
          `= (${hl('38')} + ${hl('62')}) + (${hl('76', 'b')} + ${hl('24', 'b')}) <span class="note">${T(L, 'giao hoán, kết hợp', 'commutative, associative')}</span>`,
          `= ${hl('100')} + ${hl('100', 'b')}`,
          '= 200',
        ]),
      },
    },
    {
      title: { vi: 'Phép trừ', en: 'Subtraction' },
      theory: {
        vi: [
          'Với a ≥ b: <b>a − b = c</b>; a là <b>số bị trừ</b>, b là <b>số trừ</b>, c là <b>hiệu</b>.',
          'a − b = c nghĩa là <b>c + b = a</b>. Trong ℕ, phép trừ a − b chỉ làm được khi a ≥ b.',
          'Tìm số chưa biết: x + b = a ⇒ x = a − b; &nbsp; x − b = c ⇒ x = c + b; &nbsp; a − x = c ⇒ x = a − c.',
        ],
        en: [
          'For a ≥ b: <b>a − b = c</b>; a is the <b>minuend</b>, b the <b>subtrahend</b>, c the <b>difference</b>.',
          'a − b = c means <b>c + b = a</b>. In ℕ, a − b can only be done when a ≥ b.',
          'Finding an unknown: x + b = a ⇒ x = a − b; &nbsp; x − b = c ⇒ x = c + b; &nbsp; a − x = c ⇒ x = a − c.',
        ],
      },
      example: {
        caption: { vi: 'Tính 11 − 4 trên tia số.', en: 'Work out 11 − 4 on the number ray.' },
        frames: (L) => {
          const jump = { a: 11, b: 7, label: '−4' };
          return [
            numberLine({ from: 0, to: 12, points: [{ n: 11 }] }) + cap('11 − 4 = ?', false, true),
            numberLine({ from: 0, to: 12, points: [{ n: 11 }, { n: 7, tone: 'b', isNew: true }], arcs: [{ ...jump, isNew: true }] })
              + cap(T(L, 'Từ 11 lùi sang trái 4 đơn vị, đến 7.', 'From 11, step 4 to the left: we reach 7.'), true),
            numberLine({ from: 0, to: 12, points: [{ n: 11 }, { n: 7, tone: 'b' }], arcs: [jump] })
              + cap(T(L, 'Từ 11 lùi sang trái 4 đơn vị, đến 7.', 'From 11, step 4 to the left: we reach 7.'))
              + cap(T(L, '<b>11 − 4 = 7</b> vì 7 + 4 = 11.', '<b>11 − 4 = 7</b> because 7 + 4 = 11.'), true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Quick sum by pairing.
    () => {
      const target = pick([100, 1000]);
      let a;
      do { a = int(11, target - 11); } while (a % 10 === 0);
      const c = target - a;
      const b = int(12, 489);
      const order = shuffle([a, b, c]);
      return input(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(order.map((v) => fmt(v, L)).join(' + '))}`),
        target + b,
        bi((L) => `(${fmt(a, L)} + ${fmt(c, L)}) + ${fmt(b, L)} = ${fmt(target, L)} + ${fmt(b, L)} = ${fmt(target + b, L)}`),
      );
    },
    // Find x.
    () => {
      const x = int(20, 500);
      const b = int(10, 500);
      const small = int(1, x - 1); // keeps x − small a natural number
      const [text, how] = pick([
        [`x + ${b} = ${x + b}`, `x = ${x + b} − ${b}`],
        [`${b} + x = ${x + b}`, `x = ${x + b} − ${b}`],
        [`x − ${small} = ${x - small}`, `x = ${x - small} + ${small}`],
        [`${x + b} − x = ${b}`, `x = ${x + b} − ${b}`],
      ]);
      return input(
        bi((L) => `${T(L, 'Tìm số tự nhiên x, biết:', 'Find the natural number x:')} ${eq(text)}`),
        x,
        bi(() => `${how} = ${x}`),
      );
    },
    // Which property?
    () => {
      const [a, b, c] = distinct(3, 12, 99);
      const kinds = {
        comm: [`${a} + ${b} = ${b} + ${a}`, { vi: 'Giao hoán', en: 'Commutative' }],
        assoc: [`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, { vi: 'Kết hợp', en: 'Associative' }],
        zero: [`${a} + 0 = ${a}`, { vi: 'Cộng với số 0', en: 'Adding zero' }],
      };
      const key = pick(Object.keys(kinds));
      const distributive = { vi: 'Phân phối', en: 'Distributive' };
      return choice(
        bi((L) => `${T(L, 'Đẳng thức sau thể hiện tính chất nào của phép cộng?', 'Which property of addition does this show?')} ${eq(kinds[key][0])}`),
        kinds[key][1],
        [...Object.keys(kinds).filter((k) => k !== key).map((k) => kinds[k][1]), distributive],
        bi((L) => ({
          comm: T(L, 'Đổi chỗ hai số hạng, tổng không đổi: tính chất giao hoán.', 'Swapping the terms keeps the sum: commutative.'),
          assoc: T(L, 'Nhóm các số hạng theo cách khác, tổng không đổi: tính chất kết hợp.', 'Grouping the terms differently keeps the sum: associative.'),
          zero: T(L, 'Cộng một số với 0 được chính số đó.', 'Adding 0 to a number gives the same number.'),
        })[key]),
      );
    },
    // Shopping word problem.
    () => {
      const total = pick([100, 200, 500]);
      const a = int(10, Math.floor(total * 0.4));
      const b = int(10, Math.floor(total * 0.4));
      const [i1, i2] = shuffle(ITEMS);
      const name = pick(NAMES);
      const left = total - a - b;
      return input(
        bi((L) => T(
          L,
          `${name} có ${total} nghìn đồng. ${name} mua ${i1[0]} giá ${a} nghìn đồng và ${i2[0]} giá ${b} nghìn đồng. Hỏi ${name} còn lại bao nhiêu nghìn đồng?`,
          `${name} has ${total} thousand dong and buys ${i1[1]} for ${a} thousand and ${i2[1]} for ${b} thousand. How many thousand dong are left?`,
        )),
        left,
        bi((L) => `${total} − ${a} − ${b} = ${left} ${T(L, '(nghìn đồng)', '(thousand dong)')}`),
      );
    },
    // Column subtraction.
    () => {
      const a = int(2000, 99999);
      const b = int(100, a - 1);
      return input(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${fmt(a, L)} − ${fmt(b, L)}`)}`),
        a - b,
        bi((L) => T(L, `Thử lại: ${fmt(a - b, L)} + ${fmt(b, L)} = ${fmt(a, L)}.`, `Check: ${fmt(a - b, L)} + ${fmt(b, L)} = ${fmt(a, L)}.`)),
      );
    },
  ],
};

// ---------- Bài 5. Phép nhân và phép chia số tự nhiên ----------

const lesson5 = {
  id: 'c1b5',
  number: 5,
  title: { vi: 'Phép nhân và phép chia số tự nhiên', en: 'Multiplying and dividing natural numbers' },
  points: [
    {
      title: { vi: 'Phép nhân và các tính chất', en: 'Multiplication and its properties' },
      theory: {
        vi: [
          '<b>a × b = a · b = c</b>: a, b là các <b>thừa số</b>, c là <b>tích</b>. a · b = a + a + … + a (b số hạng).',
          '<b>Giao hoán</b>: a · b = b · a. <b>Kết hợp</b>: (a · b) · c = a · (b · c). <b>Nhân với 1</b>: a · 1 = a.',
          '<b>Phân phối</b> đối với phép cộng, phép trừ: a · (b + c) = a · b + a · c; &nbsp; a · (b − c) = a · b − a · c.',
          'Mẹo: 25 · 4 = 100; 125 · 8 = 1 000; a · 99 = a · 100 − a.',
        ],
        en: [
          '<b>a × b = a · b = c</b>: a and b are the <b>factors</b>, c is the <b>product</b>. a · b = a + a + … + a (b times).',
          '<b>Commutative</b>: a · b = b · a. <b>Associative</b>: (a · b) · c = a · (b · c). <b>Times one</b>: a · 1 = a.',
          '<b>Distributive</b> over addition and subtraction: a · (b + c) = a · b + a · c; &nbsp; a · (b − c) = a · b − a · c.',
          'Tricks: 25 · 4 = 100; 125 · 8 = 1,000; a · 99 = a · 100 − a.',
        ],
      },
      example: {
        caption: { vi: 'Tính 4 · 13 bằng tính chất phân phối.', en: 'Work out 4 · 13 with the distributive property.' },
        frames: (L) => {
          const title = cap('4 · 13 = ?', false, true);
          const split = dots({ rows: 4, cols: 13, splitAt: 10 });
          const step1 = cap(`13 = ${hl('10')} + ${hl('3', 'b')}`);
          const step2 = cap(`4 · 13 = 4 · ${hl('10')} + 4 · ${hl('3', 'b')}`);
          return [
            title + dots({ rows: 4, cols: 13 }) + cap(T(L, '4 hàng, mỗi hàng 13 chấm.', '4 rows of 13 dots.')),
            title + dots({ rows: 4, cols: 13, splitAt: 10, isNew: true }) + cap(`13 = ${hl('10')} + ${hl('3', 'b')}`, true),
            title + split + step1 + cap(`4 · 13 = 4 · ${hl('10')} + 4 · ${hl('3', 'b')}`, true),
            title + split + step1 + step2 + cap(`= ${hl('40')} + ${hl('12', 'b')} = <b>52</b>`, true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Phép chia hết và phép chia có dư', en: 'Exact division and division with remainder' },
      theory: {
        vi: [
          'Với a, b ∈ ℕ, b ≠ 0, luôn tìm được đúng một cặp số q, r sao cho <b>a = b · q + r</b> với <b>0 ≤ r &lt; b</b>.',
          'a là <b>số bị chia</b>, b là <b>số chia</b>, q là <b>thương</b>, r là <b>số dư</b>.',
          'Nếu r = 0 thì a <b>chia hết</b> cho b, viết a : b = q. Nếu r ≠ 0 thì đó là <b>phép chia có dư</b>.',
          'Số dư luôn <b>nhỏ hơn số chia</b>.',
        ],
        en: [
          'For a, b ∈ ℕ with b ≠ 0, there is exactly one pair q, r such that <b>a = b · q + r</b> with <b>0 ≤ r &lt; b</b>.',
          'a is the <b>dividend</b>, b the <b>divisor</b>, q the <b>quotient</b>, r the <b>remainder</b>.',
          'If r = 0, a is <b>divisible</b> by b and we write a : b = q. If r ≠ 0, it is a <b>division with remainder</b>.',
          'The remainder is always <b>smaller than the divisor</b>.',
        ],
      },
      example: {
        caption: { vi: 'Chia 23 quả táo vào các đĩa, mỗi đĩa 5 quả.', en: 'Share 23 apples onto plates, 5 per plate.' },
        frames: (L) => {
          const grouped = groups({ total: 23, size: 5, emoji: '🍎', grouped: true });
          const eqLine = cap('23 = 5 · 4 + 3', false, true);
          return [
            groups({ total: 23, size: 5, emoji: '🍎', grouped: false }),
            groups({ total: 23, size: 5, emoji: '🍎', grouped: true, isNew: true })
              + cap(T(L, 'Được 4 đĩa đầy, còn thừa 3 quả.', '4 full plates, with 3 apples left over.'), true),
            grouped + cap(T(L, 'Được 4 đĩa đầy, còn thừa 3 quả.', '4 full plates, with 3 apples left over.')) + cap('23 = 5 · 4 + 3', true, true),
            grouped + eqLine + cap(T(L, 'Thương là <b>4</b>, số dư là <b>3</b> (3 &lt; 5).', 'Quotient <b>4</b>, remainder <b>3</b> (3 &lt; 5).'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Quick products.
    () => {
      const k = int(2, 99);
      const a = int(12, 99);
      const [b, c] = (() => { const x = int(11, 89); return [x, 100 - x]; })();
      const forms = [
        [`25 · ${k} · 4`, 100 * k, `(25 · 4) · ${k} = 100 · ${k}`],
        [`4 · ${k} · 25`, 100 * k, `(4 · 25) · ${k} = 100 · ${k}`],
        [`125 · ${k} · 8`, 1000 * k, `(125 · 8) · ${k} = 1000 · ${k}`],
        [`2 · ${k} · 50`, 100 * k, `(2 · 50) · ${k} = 100 · ${k}`],
        [`${a} · 99 + ${a}`, 100 * a, `${a} · (99 + 1) = ${a} · 100`],
        [`${a} · 101 − ${a}`, 100 * a, `${a} · (101 − 1) = ${a} · 100`],
        [`${a} · ${b} + ${a} · ${c}`, 100 * a, `${a} · (${b} + ${c}) = ${a} · 100`],
      ];
      const [expr, ans, how] = pick(forms);
      return input(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(expr)}`),
        ans,
        bi((L) => `${expr} = ${how} = ${fmt(ans, L)}`),
      );
    },
    // Quotient or remainder.
    () => {
      const b = int(3, 12);
      const q = int(5, 80);
      const r = int(0, b - 1);
      const a = b * q + r;
      const askRemainder = Math.random() < 0.5;
      return input(
        bi((L) => (askRemainder
          ? T(L, `Tìm <b>số dư</b> của phép chia ${a} cho ${b}.`, `Find the <b>remainder</b> when ${a} is divided by ${b}.`)
          : T(L, `Tìm <b>thương</b> của phép chia ${a} cho ${b}.`, `Find the <b>quotient</b> when ${a} is divided by ${b}.`))),
        askRemainder ? r : q,
        bi((L) => `${a} = ${b} · ${q} + ${r} &nbsp; (0 ≤ ${r} &lt; ${b}) — ${T(L, `thương ${q}, số dư ${r}`, `quotient ${q}, remainder ${r}`)}`),
      );
    },
    // Find the dividend.
    () => {
      const b = int(4, 15);
      const q = int(6, 60);
      const r = int(1, b - 1);
      const a = b * q + r;
      return input(
        bi((L) => T(L, `Một phép chia có số chia là ${b}, thương là ${q} và số dư là ${r}. Tìm số bị chia.`, `A division has divisor ${b}, quotient ${q} and remainder ${r}. Find the dividend.`)),
        a,
        bi(() => `${b} · ${q} + ${r} = ${a}`),
      );
    },
    // Distributive property.
    () => {
      const a = int(3, 9);
      const b = pick([10, 20, 30, 100]);
      const c = int(2, 9);
      const plus = Math.random() < 0.5;
      const op = plus ? '+' : '−';
      return choice(
        bi((L) => `${T(L, 'Biểu thức nào bằng', 'Which expression equals')} ${eq(`${a} · (${b} ${op} ${c})`)}?`),
        `${a} · ${b} ${op} ${a} · ${c}`,
        [`${a} · ${b} ${op} ${c}`, `${a} ${op} ${b} · ${c}`, `${a} · ${b} · ${c}`],
        bi((L) => T(L, `Nhân ${a} với <b>từng</b> số trong ngoặc: ${a} · ${b} ${op} ${a} · ${c} = ${plus ? a * b + a * c : a * b - a * c}.`, `Multiply ${a} by <b>each</b> number in the brackets: ${a} · ${b} ${op} ${a} · ${c} = ${plus ? a * b + a * c : a * b - a * c}.`)),
      );
    },
    // Buses: round the quotient up.
    () => {
      const k = int(12, 45);
      let n;
      do { n = int(40, 300); } while (n % k === 0);
      const q = Math.floor(n / k);
      const r = n % k;
      return input(
        bi((L) => T(L, `Trường tổ chức cho ${n} học sinh đi tham quan. Mỗi xe chở được nhiều nhất ${k} học sinh. Cần ít nhất bao nhiêu xe?`, `${n} students go on a school trip. Each bus carries at most ${k} students. What is the smallest number of buses needed?`)),
        q + 1,
        bi((L) => T(L, `${n} = ${k} · ${q} + ${r}: ${q} xe chở đủ ${k * q} em, còn ${r} em cần thêm 1 xe. Vậy cần ${q + 1} xe.`, `${n} = ${k} · ${q} + ${r}: ${q} buses carry ${k * q} students, and the other ${r} need one more bus. So ${q + 1} buses.`)),
      );
    },
  ],
};

// ---------- Bài 6. Luỹ thừa với số mũ tự nhiên ----------

const lesson6 = {
  id: 'c1b6',
  number: 6,
  title: { vi: 'Luỹ thừa với số mũ tự nhiên', en: 'Powers with natural exponents' },
  points: [
    {
      title: { vi: 'Luỹ thừa', en: 'Powers' },
      theory: {
        vi: [
          `${pw('a', 'n')} = a · a · … · a (n thừa số a, n ≠ 0). Đọc là "a mũ n" hoặc "a luỹ thừa n".`,
          `a là <b>cơ số</b>, n là <b>số mũ</b>. ${pw('a', 2)} đọc là "a bình phương", ${pw('a', 3)} đọc là "a lập phương".`,
          `Quy ước: ${pw('a', 1)} = a; &nbsp; ${pw('a', 0)} = 1 (a ≠ 0).`,
        ],
        en: [
          `${pw('a', 'n')} = a · a · … · a (n factors of a, n ≠ 0). Read "a to the power n".`,
          `a is the <b>base</b>, n is the <b>exponent</b>. ${pw('a', 2)} is "a squared", ${pw('a', 3)} is "a cubed".`,
          `By convention: ${pw('a', 1)} = a; &nbsp; ${pw('a', 0)} = 1 (a ≠ 0).`,
        ],
      },
      example: {
        caption: { vi: 'Một tế bào cứ mỗi giờ lại tách làm đôi.', en: 'A cell splits in two every hour.' },
        frames: (L) => derivation([1, 2, 3, 4, 5].map((h) => {
          const n = 2 ** h;
          return `${T(L, 'Sau', 'After')} ${h} ${T(L, 'giờ', h === 1 ? 'hour' : 'hours')}: <span class="cells">${'<i></i>'.repeat(n)}</span> ${n} = ${pw(2, h)}`;
        })),
      },
    },
    {
      title: { vi: 'Nhân, chia hai luỹ thừa cùng cơ số', en: 'Multiplying and dividing powers with the same base' },
      theory: {
        vi: [
          `<b>${pw('a', 'm')} · ${pw('a', 'n')} = ${pw('a', 'm + n')}</b> — giữ nguyên cơ số, <b>cộng</b> các số mũ.`,
          `<b>${pw('a', 'm')} : ${pw('a', 'n')} = ${pw('a', 'm − n')}</b> (a ≠ 0, m ≥ n) — giữ nguyên cơ số, <b>trừ</b> các số mũ.`,
        ],
        en: [
          `<b>${pw('a', 'm')} · ${pw('a', 'n')} = ${pw('a', 'm + n')}</b> — keep the base, <b>add</b> the exponents.`,
          `<b>${pw('a', 'm')} : ${pw('a', 'n')} = ${pw('a', 'm − n')}</b> (a ≠ 0, m ≥ n) — keep the base, <b>subtract</b> the exponents.`,
        ],
      },
      example: {
        caption: { vi: `Vì sao ${pw(3, 4)} · ${pw(3, 2)} = ${pw(3, 6)}?`, en: `Why is ${pw(3, 4)} · ${pw(3, 2)} = ${pw(3, 6)}?` },
        frames: (L) => derivation([
          `${pw(3, 4)} · ${pw(3, 2)}`,
          `= (${hl('3 · 3 · 3 · 3')}) · (${hl('3 · 3', 'b')})`,
          `= 3 · 3 · 3 · 3 · 3 · 3 <span class="note">${T(L, '6 thừa số 3', '6 factors of 3')}</span>`,
          `= ${pw(3, '4 + 2')} = <b>${pw(3, 6)}</b>`,
          `${T(L, 'Tương tự', 'Likewise')}: ${pw(5, 5)} : ${pw(5, 3)} = ${pw(5, '5 − 3')} = ${pw(5, 2)} = 25`,
        ]),
      },
    },
  ],
  exercises: [
    // Value of a power.
    () => {
      const options = [[2, 10], [3, 5], [4, 4], [5, 4], [10, 6], [6, 3], [7, 3], [8, 3], [9, 3]];
      const [a, maxN] = pick(options);
      const n = Math.random() < 0.1 ? pick([0, 1]) : int(2, maxN);
      const v = a ** n;
      return input(
        bi((L) => `${T(L, 'Tính', 'Work out')} ${eq(pw(a, n))}`),
        v,
        bi((L) => (n === 0
          ? T(L, `Quy ước: ${pw(a, 0)} = 1.`, `By convention, ${pw(a, 0)} = 1.`)
          : n === 1 ? `${pw(a, 1)} = ${a}` : `${pw(a, n)} = ${Array(n).fill(a).join(' · ')} = ${fmt(v, L)}`)),
      );
    },
    // Multiply powers.
    () => {
      const a = int(2, 9);
      const [m, n] = [int(2, 7), int(2, 7)];
      const wrongExp = m * n === m + n ? m + n + 1 : m * n;
      const third = m === n ? m + n - 1 : Math.abs(m - n);
      return choice(
        bi(() => `${eq(`${pw(a, m)} · ${pw(a, n)}`)} = ?`),
        pw(a, m + n),
        [pw(a, wrongExp), pw(a * a, m + n), pw(a, third)],
        bi((L) => `${T(L, 'Giữ nguyên cơ số, cộng số mũ', 'Keep the base, add the exponents')}: ${pw(a, `${m} + ${n}`)} = ${pw(a, m + n)}`),
      );
    },
    // Divide powers.
    () => {
      const a = int(2, 9);
      const n = int(1, 5);
      const m = n + int(1, 6);
      return choice(
        bi(() => `${eq(`${pw(a, m)} : ${pw(a, n)}`)} = ?`),
        pw(a, m - n),
        [pw(a, m + n), pw(1, m - n), pw(a, m)].filter((v, i, arr) => arr.indexOf(v) === i && v !== pw(a, m - n)),
        bi((L) => `${T(L, 'Giữ nguyên cơ số, trừ số mũ', 'Keep the base, subtract the exponents')}: ${pw(a, `${m} − ${n}`)} = ${pw(a, m - n)}`),
      );
    },
    // Find the exponent.
    () => {
      const [a, maxN] = pick([[2, 10], [3, 6], [5, 4], [10, 6]]);
      const n = int(2, maxN);
      return input(
        bi((L) => `${T(L, 'Tìm số tự nhiên n, biết', 'Find the natural number n such that')} ${eq(`${pw(a, 'n')} = ${fmt(a ** n, L)}`)}`),
        n,
        bi((L) => `${fmt(a ** n, L)} = ${Array(n).fill(a).join(' · ')} = ${pw(a, n)} ⇒ n = ${n}`),
      );
    },
    // Repeated product as a power.
    () => {
      const a = int(2, 9);
      let n;
      do { n = int(3, 6); } while (n === a); // a = n would make aⁿ and nᵃ the same choice
      const product = Array(n).fill(a).join(' · ');
      return choice(
        bi((L) => `${T(L, 'Viết gọn tích sau dưới dạng luỹ thừa:', 'Write as a single power:')} ${eq(product)}`),
        pw(a, n),
        [pw(n, a), `${a} · ${n}`, `${a * n}`],
        bi((L) => T(L, `Có ${n} thừa số ${a}: cơ số ${a}, số mũ ${n}.`, `There are ${n} factors of ${a}: base ${a}, exponent ${n}.`)),
      );
    },
  ],
};

// ---------- Bài 7. Thứ tự thực hiện các phép tính ----------

// Expression templates: html, value and the working lines for the explanation.
// All intermediate results stay natural numbers.
const EXPRESSIONS = [
  () => { const [a, b, c] = [int(5, 99), int(2, 12), int(2, 12)]; return { html: `${a} + ${b} · ${c}`, steps: [`${a} + ${b * c}`], value: a + b * c }; },
  () => { const [b, c] = [int(2, 9), int(2, 9)]; const a = b * c + int(1, 60); return { html: `${a} − ${b} · ${c}`, steps: [`${a} − ${b * c}`], value: a - b * c }; },
  () => { const [a, b, c, d] = [int(5, 15), int(5, 12), int(2, 6), int(2, 6)]; return a * b > c * d ? { html: `${a} · ${b} − ${c} · ${d}`, steps: [`${a * b} − ${c * d}`], value: a * b - c * d } : null; },
  () => { const [a, b, c] = [int(1, 50), int(2, 5), int(2, 6)]; return { html: `${a} + ${pw(b, 2)} · ${c}`, steps: [`${a} + ${b * b} · ${c}`, `${a} + ${b * b * c}`], value: a + b * b * c }; },
  () => { const [a, b, c] = [int(3, 30), int(3, 30), int(2, 9)]; return { html: `(${a} + ${b}) · ${c}`, steps: [`${a + b} · ${c}`], value: (a + b) * c }; },
  () => { const [c, k, d] = [int(1, 20), int(1, 9), int(2, 6)]; const b = c + k; const a = k * d + int(1, 50); return { html: `${a} − (${b} − ${c}) · ${d}`, steps: [`${a} − ${k} · ${d}`, `${a} − ${k * d}`], value: a - k * d }; },
  () => { const [b, q, c, d] = [int(2, 9), int(2, 15), int(2, 9), int(2, 9)]; const a = b * q; return { html: `${a} : ${b} + ${c} · ${d}`, steps: [`${q} + ${c * d}`], value: q + c * d }; },
  () => {
    const [a, b, c, e, q] = [int(1, 20), int(1, 20), int(2, 6), int(2, 9), int(2, 15)];
    const d = (a + b) * c - e * q;
    if (d < 0) return null;
    return {
      html: `[(${a} + ${b}) · ${c} − ${d}] : ${e}`,
      steps: [`[${a + b} · ${c} − ${d}] : ${e}`, `[${(a + b) * c} − ${d}] : ${e}`, `${e * q} : ${e}`],
      value: q,
    };
  },
];

function randomExpression() {
  for (;;) {
    const e = pick(EXPRESSIONS)();
    if (e) return e;
  }
}

const lesson7 = {
  id: 'c1b7',
  number: 7,
  title: { vi: 'Thứ tự thực hiện các phép tính', en: 'Order of operations' },
  points: [
    {
      title: { vi: 'Biểu thức không có dấu ngoặc', en: 'Expressions without brackets' },
      theory: {
        vi: [
          'Chỉ có cộng và trừ (hoặc chỉ có nhân và chia): làm <b>từ trái sang phải</b>.',
          'Có nhiều loại phép tính: <b>Luỹ thừa → Nhân và chia → Cộng và trừ</b>.',
        ],
        en: [
          'Only addition and subtraction (or only multiplication and division): work <b>from left to right</b>.',
          'Several kinds of operations: <b>Powers → Multiplication and division → Addition and subtraction</b>.',
        ],
      },
      example: {
        caption: { vi: `Tính 60 − 4 · ${pw(2, 3)} + 10.`, en: `Work out 60 − 4 · ${pw(2, 3)} + 10.` },
        frames: (L) => derivation([
          `60 − 4 · ${hl(pw(2, 3))} + 10 <span class="note">${T(L, 'luỹ thừa trước', 'powers first')}</span>`,
          `= 60 − ${hl('4 · 8')} + 10 <span class="note">${T(L, 'rồi đến nhân', 'then multiply')}</span>`,
          `= ${hl('60 − 32')} + 10 <span class="note">${T(L, 'cộng, trừ từ trái sang phải', 'add and subtract left to right')}</span>`,
          '= 28 + 10',
          '= <b>38</b>',
        ]),
      },
    },
    {
      title: { vi: 'Biểu thức có dấu ngoặc', en: 'Expressions with brackets' },
      theory: {
        vi: [
          'Làm trong ngoặc trước theo thứ tự: <b>( ) → [ ] → { }</b>.',
          'Bên trong mỗi ngoặc vẫn theo thứ tự: luỹ thừa → nhân, chia → cộng, trừ.',
        ],
        en: [
          'Work inside brackets first, in the order <b>( ) → [ ] → { }</b>.',
          'Inside each bracket, keep the usual order: powers → multiply, divide → add, subtract.',
        ],
      },
      example: {
        caption: { vi: `Tính 100 − [5 · (9 − 3) + ${pw(2, 2)}].`, en: `Work out 100 − [5 · (9 − 3) + ${pw(2, 2)}].` },
        frames: (L) => derivation([
          `100 − [5 · ${hl('(9 − 3)')} + ${pw(2, 2)}] <span class="note">${T(L, 'ngoặc tròn trước', 'round brackets first')}</span>`,
          `= 100 − [5 · 6 + ${hl(pw(2, 2))}] <span class="note">${T(L, 'luỹ thừa', 'power')}</span>`,
          `= 100 − [${hl('5 · 6')} + 4] <span class="note">${T(L, 'nhân', 'multiply')}</span>`,
          `= 100 − ${hl('[30 + 4]')} <span class="note">${T(L, 'ngoặc vuông', 'square brackets')}</span>`,
          '= 100 − 34 = <b>66</b>',
        ]),
      },
    },
  ],
  exercises: [
    // Evaluate an expression.
    () => {
      const e = randomExpression();
      return input(
        bi((L) => `${T(L, 'Tính giá trị biểu thức:', 'Work out:')} ${eq(e.html)}`),
        e.value,
        bi(() => `${e.html} = ${[...e.steps, e.value].join(' = ')}`),
        { html: e.html, value: e.value },
      );
    },
    // Right or wrong?
    () => {
      const [a, b, c] = [int(2, 20), int(2, 9), int(2, 9)];
      const right = a + b * c;
      const wrongValue = (a + b) * c;
      const honest = Math.random() < 0.5;
      const name = pick(NAMES);
      const shown = honest ? right : wrongValue;
      return choice(
        bi((L) => T(L, `Bạn ${name} tính: ${eq(`${a} + ${b} · ${c} = ${shown}`)}. ${name} làm đúng hay sai?`, `${name} worked out ${eq(`${a} + ${b} · ${c} = ${shown}`)}. Is that right or wrong?`)),
        honest ? { vi: 'Đúng', en: 'Right' } : { vi: 'Sai', en: 'Wrong' },
        [honest ? { vi: 'Sai', en: 'Wrong' } : { vi: 'Đúng', en: 'Right' }],
        bi((L) => T(L, `Nhân trước, cộng sau: ${a} + ${b * c} = ${right}.`, `Multiply first, then add: ${a} + ${b * c} = ${right}.`)),
      );
    },
    // Which operation comes first?
    () => {
      const [a, b, c, d] = [int(20, 90), int(2, 9), int(2, 5), int(2, 9)];
      const forms = [
        [`${a} + ${b} · ${pw(c, 2)}`, pw(c, 2), [`${b} · ${c}`, `${a} + ${b}`]],
        [`${a} − ${b * d} : ${b} + ${c}`, `${b * d} : ${b}`, [`${a} − ${b * d}`, `${b} + ${c}`]],
        [`${b} · (${a} + ${d})`, `${a} + ${d}`, [`${b} · ${a}`]],
        [`${a} − ${b} + ${c} · ${d}`, `${c} · ${d}`, [`${a} − ${b}`, `${b} + ${c}`]],
      ];
      const [expr, first, wrongs] = pick(forms);
      return choice(
        bi((L) => `${T(L, 'Trong biểu thức', 'In the expression')} ${eq(expr)}${T(L, ', phép tính nào làm <b>trước tiên</b>?', ', which part is worked out <b>first</b>?')}`),
        first,
        wrongs,
        bi((L) => T(L, 'Thứ tự: ngoặc → luỹ thừa → nhân, chia → cộng, trừ.', 'Order: brackets → powers → multiply, divide → add, subtract.')),
      );
    },
  ],
};

export const CHAPTER1 = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7];
