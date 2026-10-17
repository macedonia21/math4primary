// Grade 6, Chapter III: integers. Theory, step-by-step examples and
// exercise generators for lessons 13–17. All text is original, written to
// follow the curriculum topics.

import {
  bi, T, fmt, setOf, int, pick, shuffle, distinct, choice, input, inputZ, z, par, divisors, DIV, sym,
} from './util.js';
import { derivation, numberLine, chipRows } from './visuals.js';

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const hl = (s, tone = 'a') => `<span class="hl ${tone}">${s}</span>`;
const cap = (html, isNew = false, big = false) => `<p class="vx-caption${isNew ? ' new' : ''}${big ? ' big' : ''}">${html}</p>`;
const eq = (html) => `<span class="eq">${html}</span>`;
const nonZero = (lo, hi) => { for (;;) { const v = int(lo, hi); if (v) return v; } };
const sign = () => pick([1, -1]);

// ---------- Bài 13. Tập hợp các số nguyên ----------

const lesson13 = {
  id: 'c3b13',
  number: 13,
  title: { vi: 'Tập hợp các số nguyên', en: 'The set of integers' },
  points: [
    {
      title: { vi: 'Số nguyên âm và tập hợp ℤ', en: 'Negative numbers and the set ℤ' },
      theory: {
        vi: [
          'Các số −1; −2; −3; … là các <b>số nguyên âm</b>, đọc là "âm 1", "âm 2"… (hoặc "trừ 1", "trừ 2"…).',
          'Các số 1; 2; 3; … là các <b>số nguyên dương</b> (có thể viết +1; +2; …).',
          'Tập hợp các số nguyên: <b>ℤ = {…; −3; −2; −1; 0; 1; 2; 3; …}</b>. Số 0 không phải số nguyên âm, cũng không phải số nguyên dương.',
          'Số âm dùng để chỉ nhiệt độ dưới 0 °C, độ sâu dưới mực nước biển, số tiền nợ, năm trước Công nguyên…',
        ],
        en: [
          'The numbers −1, −2, −3, … are <b>negative integers</b>, read "minus 1", "minus 2"… (or "negative 1"…).',
          'The numbers 1, 2, 3, … are <b>positive integers</b> (sometimes written +1, +2, …).',
          'The set of integers: <b>ℤ = {…, −3, −2, −1, 0, 1, 2, 3, …}</b>. 0 is neither negative nor positive.',
          'Negative numbers describe temperatures below 0 °C, depths below sea level, debts, years BC…',
        ],
      },
      example: {
        caption: { vi: 'Các số nguyên trên trục số.', en: 'Integers on the number line.' },
        frames: (L) => {
          const pos = range(1, 5).map((n) => ({ n }));
          const neg = range(-5, -1).map((n) => ({ n, tone: 'b' }));
          return [
            numberLine({ from: -6, to: 6, points: [{ n: 0, tone: 'off' }] }) + cap(T(L, 'Điểm 0 là gốc.', 'Point 0 is the origin.')),
            numberLine({ from: -6, to: 6, points: [{ n: 0, tone: 'off' }, ...pos.map((p) => ({ ...p, isNew: true }))] })
              + cap(T(L, 'Bên phải 0: các số nguyên dương.', 'To the right of 0: positive integers.'), true),
            numberLine({ from: -6, to: 6, points: [{ n: 0, tone: 'off' }, ...pos, ...neg.map((p) => ({ ...p, isNew: true }))] })
              + cap(T(L, 'Bên trái 0: các số nguyên âm.', 'To the left of 0: negative integers.'), true),
            numberLine({ from: -6, to: 6, points: [{ n: 0, tone: 'off' }, ...pos, ...neg] })
              + cap(T(L, '−3 °C: lạnh hơn 0 °C ba độ. &nbsp; −20 m: 20 m dưới mực nước biển.', '−3 °C: three degrees below 0 °C. &nbsp; −20 m: 20 m below sea level.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Số đối', en: 'Opposite numbers' },
      theory: {
        vi: [
          'Trên trục số, hai điểm a và −a nằm về hai phía của 0 và <b>cách đều</b> 0. Ta nói a và −a là hai <b>số đối</b> nhau.',
          'Số đối của 0 là 0. Số đối của −a là a: <b>−(−a) = a</b>.',
        ],
        en: [
          'On the number line, a and −a lie on opposite sides of 0, the <b>same distance</b> from it. They are <b>opposite numbers</b>.',
          'The opposite of 0 is 0. The opposite of −a is a: <b>−(−a) = a</b>.',
        ],
      },
      example: {
        caption: { vi: '4 và −4 là hai số đối nhau.', en: '4 and −4 are opposites.' },
        frames: (L) => {
          const right = { a: 0, b: 4, label: '4' };
          const left = { a: 0, b: -4, label: '4' };
          return [
            numberLine({ from: -6, to: 6, points: [{ n: 4 }] }),
            numberLine({ from: -6, to: 6, points: [{ n: 4 }], arcs: [{ ...right, isNew: true }] })
              + cap(T(L, 'Điểm 4 cách 0 bốn đơn vị.', 'Point 4 is 4 units from 0.'), true),
            numberLine({ from: -6, to: 6, points: [{ n: 4 }, { n: -4, tone: 'b', isNew: true }], arcs: [right, { ...left, isNew: true }] })
              + cap(T(L, 'Điểm −4 cũng cách 0 bốn đơn vị, ở phía bên kia.', 'Point −4 is also 4 units from 0, on the other side.'), true),
            numberLine({ from: -6, to: 6, points: [{ n: 4 }, { n: -4, tone: 'b' }], arcs: [right, left] })
              + cap(T(L, 'Số đối của 4 là −4; số đối của −4 là 4: −(−4) = 4.', 'The opposite of 4 is −4; the opposite of −4 is 4: −(−4) = 4.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'So sánh hai số nguyên', en: 'Comparing integers' },
      theory: {
        vi: [
          'Trên trục số nằm ngang, nếu điểm a nằm <b>bên trái</b> điểm b thì <b>a &lt; b</b>.',
          'Mọi số nguyên âm đều nhỏ hơn 0; mọi số nguyên dương đều lớn hơn 0; số âm luôn nhỏ hơn số dương.',
          'Với hai số nguyên âm: số nào có phần số tự nhiên <b>lớn hơn</b> thì <b>nhỏ hơn</b>. Ví dụ 7 &gt; 2 nên −7 &lt; −2.',
        ],
        en: [
          'On a horizontal number line, if point a is <b>to the left</b> of point b, then <b>a &lt; b</b>.',
          'Every negative integer is less than 0, every positive integer is greater than 0, so negatives are less than positives.',
          'For two negative integers: the one with the <b>larger</b> number part is the <b>smaller</b>. For example 7 &gt; 2, so −7 &lt; −2.',
        ],
      },
      example: {
        caption: { vi: 'So sánh −7 và −2.', en: 'Compare −7 and −2.' },
        frames: (L) => [
          numberLine({ from: -9, to: 1, points: [{ n: -7, tone: 'b' }] }),
          numberLine({ from: -9, to: 1, points: [{ n: -7, tone: 'b' }, { n: -2, isNew: true }] }),
          numberLine({ from: -9, to: 1, points: [{ n: -7, tone: 'b' }, { n: -2 }] })
            + cap(T(L, '−7 nằm bên trái −2 nên <b>−7 &lt; −2</b>.', '−7 is to the left of −2, so <b>−7 &lt; −2</b>.'), true, true),
          numberLine({ from: -9, to: 1, points: [{ n: -7, tone: 'b' }, { n: -2 }] })
            + cap(T(L, '−7 nằm bên trái −2 nên <b>−7 &lt; −2</b>.', '−7 is to the left of −2, so <b>−7 &lt; −2</b>.'), false, true)
            + cap(T(L, 'Nhanh hơn: 7 &gt; 2 nên −7 &lt; −2 (đổi chiều).', 'Shortcut: 7 &gt; 2, so −7 &lt; −2 (the sign flips).'), true),
        ],
      },
    },
  ],
  exercises: [
    // Opposite number.
    () => {
      const a = nonZero(-99, 99);
      return inputZ(
        bi((L) => T(L, `Số đối của ${z(a)} là số nào?`, `What is the opposite of ${z(a)}?`)),
        -a,
        bi((L) => (a < 0 ? `−(${z(a)}) = ${-a}` : T(L, `Số đối của ${a} là −${a}.`, `The opposite of ${a} is −${a}.`))),
      );
    },
    // Compare.
    () => {
      let x; let y;
      if (Math.random() < 0.4) {
        [x, y] = [-int(2, 50), -int(2, 50)]; // two negatives: the tricky case
      } else {
        do { [x, y] = [int(-50, 50), int(-50, 50)]; } while (x >= 0 && y >= 0);
      }
      const ans = x < y ? '&lt;' : x > y ? '&gt;' : '=';
      return choice(
        bi((L) => `${T(L, 'Điền dấu thích hợp:', 'Choose the right sign:')} ${eq(`${z(x)} ☐ ${z(y)}`)}`),
        ans,
        ['&lt;', '&gt;', '='].filter((s) => s !== ans),
        bi((L) => (x < 0 && y < 0
          ? T(L, `Hai số âm: số có phần số tự nhiên lớn hơn thì nhỏ hơn (${-x} và ${-y}).`, `Both negative: the larger number part is the smaller number (${-x} and ${-y}).`)
          : T(L, `Trên trục số, ${z(Math.min(x, y))} nằm bên trái ${z(Math.max(x, y))}.`, `On the number line, ${z(Math.min(x, y))} is to the left of ${z(Math.max(x, y))}.`))),
      );
    },
    // Smallest / largest of four.
    () => {
      const nums = distinct(4, -40, 40);
      if (nums.every((v) => v >= 0)) nums[0] = -nums[0] - 1;
      const largest = Math.random() < 0.5;
      const ans = largest ? Math.max(...nums) : Math.min(...nums);
      return choice(
        bi((L) => T(L, `Số nào <b>${largest ? 'lớn' : 'nhỏ'} nhất</b>?`, `Which number is the <b>${largest ? 'largest' : 'smallest'}</b>?`)),
        z(ans),
        nums.filter((v) => v !== ans).map(z),
        bi((L) => `${[...nums].sort((a, b) => a - b).map(z).join(' &lt; ')}`),
      );
    },
    // How many integers between a and b?
    () => {
      const a = int(-30, -2);
      const b = int(a + 3, 20);
      const strict = Math.random() < 0.5;
      const count = strict ? b - a - 1 : b - a + 1;
      const [lo, hi] = strict ? [a + 1, b - 1] : [a, b];
      return input(
        bi((L) => T(L, `Có bao nhiêu số nguyên x thoả mãn ${eq(`${z(a)} ${strict ? '&lt;' : '≤'} x ${strict ? '&lt;' : '≤'} ${z(b)}`)}?`, `How many integers x satisfy ${eq(`${z(a)} ${strict ? '&lt;' : '≤'} x ${strict ? '&lt;' : '≤'} ${z(b)}`)}?`)),
        count,
        bi((L) => (count <= 10
          ? `x ∈ ${setOf(range(lo, hi).map(z), L)} — ${count}`
          : T(L, `Từ ${z(lo)} đến ${z(hi)}: ${z(hi)} − ${par(lo)} + 1 = ${count} số.`, `From ${z(lo)} to ${z(hi)}: ${z(hi)} − ${par(lo)} + 1 = ${count} integers.`))),
      );
    },
    // Put in increasing order.
    () => {
      let nums;
      do { nums = distinct(4, -20, 20); } while (nums.filter((v) => v < 0).length < 2);
      const asc = [...nums].sort((a, b) => a - b);
      const order = (arr) => arr.map(z).join('; ');
      const wrongs = new Set();
      wrongs.add(order([...asc].reverse()));
      wrongs.add(order([...asc].sort((a, b) => Math.abs(a) - Math.abs(b))));
      while (wrongs.size < 4) wrongs.add(order(shuffle(asc)));
      wrongs.delete(order(asc));
      return choice(
        bi((L) => T(L, 'Dãy nào được sắp xếp theo thứ tự <b>tăng dần</b>?', 'Which list is in <b>increasing</b> order?')),
        order(asc),
        [...wrongs].slice(0, 3),
        bi((L) => T(L, 'Số âm đứng trước số dương; trong các số âm, số có phần số tự nhiên lớn hơn thì nhỏ hơn.', 'Negatives come before positives; among negatives, a larger number part means a smaller number.')),
      );
    },
  ],
};

// ---------- Bài 14. Phép cộng và phép trừ số nguyên ----------

const lesson14 = {
  id: 'c3b14',
  number: 14,
  title: { vi: 'Phép cộng và phép trừ số nguyên', en: 'Adding and subtracting integers' },
  points: [
    {
      title: { vi: 'Cộng hai số nguyên cùng dấu', en: 'Adding integers with the same sign' },
      theory: {
        vi: [
          'Cộng hai số nguyên dương: như cộng hai số tự nhiên.',
          'Cộng hai số nguyên âm: cộng hai phần số tự nhiên rồi đặt dấu "−" trước kết quả: <b>(−a) + (−b) = −(a + b)</b>.',
        ],
        en: [
          'Adding two positive integers: just like natural numbers.',
          'Adding two negative integers: add the number parts and put "−" in front: <b>(−a) + (−b) = −(a + b)</b>.',
        ],
      },
      example: {
        caption: { vi: 'Tính (−3) + (−4) trên trục số.', en: 'Work out (−3) + (−4) on the number line.' },
        frames: (L) => {
          const j1 = { a: 0, b: -3, label: '−3' };
          const j2 = { a: -3, b: -7, label: '−4' };
          return [
            numberLine({ from: -9, to: 2, points: [{ n: 0, tone: 'off' }] }) + cap('(−3) + (−4) = ?', false, true),
            numberLine({ from: -9, to: 2, points: [{ n: 0, tone: 'off' }, { n: -3, isNew: true }], arcs: [{ ...j1, isNew: true }] })
              + cap(T(L, 'Từ 0 sang trái 3 đơn vị.', 'From 0, 3 units to the left.'), true),
            numberLine({ from: -9, to: 2, points: [{ n: 0, tone: 'off' }, { n: -3 }, { n: -7, tone: 'b', isNew: true }], arcs: [j1, { ...j2, isNew: true }] })
              + cap(T(L, 'Tiếp tục sang trái 4 đơn vị.', 'Then 4 more units to the left.'), true),
            numberLine({ from: -9, to: 2, points: [{ n: 0, tone: 'off' }, { n: -3 }, { n: -7, tone: 'b' }], arcs: [j1, j2] })
              + cap('(−3) + (−4) = −(3 + 4) = <b>−7</b>', true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Cộng hai số nguyên khác dấu', en: 'Adding integers with different signs' },
      theory: {
        vi: [
          'Hai số đối nhau có tổng bằng 0: <b>a + (−a) = 0</b>.',
          'Cộng hai số khác dấu không đối nhau: lấy phần số tự nhiên lớn trừ phần số tự nhiên nhỏ, rồi đặt trước kết quả <b>dấu của số có phần số tự nhiên lớn hơn</b>.',
          'Phép cộng số nguyên cũng có tính chất giao hoán, kết hợp, cộng với 0.',
        ],
        en: [
          'Opposite numbers add up to 0: <b>a + (−a) = 0</b>.',
          'Otherwise: subtract the smaller number part from the larger, and give the result <b>the sign of the number with the larger number part</b>.',
          'Adding integers is also commutative and associative, and adding 0 changes nothing.',
        ],
      },
      example: {
        caption: { vi: 'Tính 5 + (−8) trên trục số.', en: 'Work out 5 + (−8) on the number line.' },
        frames: (L) => {
          const j1 = { a: 0, b: 5, label: '+5' };
          const j2 = { a: 5, b: -3, label: '−8' };
          return [
            numberLine({ from: -5, to: 7, points: [{ n: 0, tone: 'off' }] }) + cap('5 + (−8) = ?', false, true),
            numberLine({ from: -5, to: 7, points: [{ n: 0, tone: 'off' }, { n: 5, isNew: true }], arcs: [{ ...j1, isNew: true }] })
              + cap(T(L, 'Từ 0 sang phải 5 đơn vị.', 'From 0, 5 units to the right.'), true),
            numberLine({ from: -5, to: 7, points: [{ n: 0, tone: 'off' }, { n: 5 }, { n: -3, tone: 'b', isNew: true }], arcs: [j1, { ...j2, isNew: true }] })
              + cap(T(L, 'Rồi sang trái 8 đơn vị, qua cả số 0.', 'Then 8 units to the left, past 0.'), true),
            numberLine({ from: -5, to: 7, points: [{ n: 0, tone: 'off' }, { n: 5 }, { n: -3, tone: 'b' }], arcs: [j1, j2] })
              + cap(T(L, '8 &gt; 5 nên kết quả mang dấu "−": 5 + (−8) = −(8 − 5) = <b>−3</b>', '8 &gt; 5 so the result is negative: 5 + (−8) = −(8 − 5) = <b>−3</b>'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Phép trừ số nguyên', en: 'Subtracting integers' },
      theory: {
        vi: [
          'Muốn trừ số nguyên a cho số nguyên b, ta <b>cộng a với số đối của b</b>: <b>a − b = a + (−b)</b>.',
          'Trong ℤ, phép trừ luôn thực hiện được (khác với ℕ).',
        ],
        en: [
          'To subtract b from a, <b>add the opposite of b</b>: <b>a − b = a + (−b)</b>.',
          'In ℤ subtraction is always possible (unlike in ℕ).',
        ],
      },
      example: {
        caption: { vi: 'Đổi phép trừ thành phép cộng với số đối.', en: 'Turn subtraction into adding the opposite.' },
        frames: () => derivation([
          `3 − ${hl('7')} = 3 + ${hl('(−7)')} = <b>−4</b>`,
          `(−2) − ${hl('(−6)')} = (−2) + ${hl('6')} = <b>4</b>`,
          `(−5) − ${hl('3', 'b')} = (−5) + ${hl('(−3)', 'b')} = <b>−8</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // Two negatives.
    () => {
      const [a, b] = [int(2, 60), int(2, 60)];
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`(−${a}) + (−${b})`)}`),
        -(a + b),
        bi(() => `(−${a}) + (−${b}) = −(${a} + ${b}) = −${a + b}`),
      );
    },
    // Different signs.
    () => {
      let a; let b;
      do { [a, b] = [int(2, 80), int(2, 80)]; } while (a === b);
      const first = Math.random() < 0.5;
      const [x, y] = first ? [a, -b] : [-a, b];
      const sum = x + y;
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${par(x)} + ${par(y)}`)}`),
        sum,
        bi((L) => T(L, `Khác dấu: ${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(sum)}, lấy dấu của số có phần số tự nhiên lớn hơn: ${z(sum)}.`, `Different signs: ${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(sum)}, with the sign of the larger number part: ${z(sum)}.`)),
      );
    },
    // Subtraction.
    () => {
      const [a, b] = [nonZero(-60, 60), nonZero(-60, 60)];
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${par(a)} − ${par(b)}`)}`),
        a - b,
        bi(() => `${par(a)} − ${par(b)} = ${par(a)} + ${par(-b)} = ${z(a - b)}`),
      );
    },
    // Temperature.
    () => {
      const start = int(-12, 8);
      const change = nonZero(-10, 12);
      const end = start + change;
      return inputZ(
        bi((L) => T(L, `Buổi sáng nhiệt độ là ${z(start)} °C. Đến trưa nhiệt độ ${change > 0 ? 'tăng' : 'giảm'} ${Math.abs(change)} °C. Nhiệt độ buổi trưa là bao nhiêu độ C?`, `In the morning it is ${z(start)} °C. By noon the temperature ${change > 0 ? 'rises' : 'falls'} by ${Math.abs(change)} °C. What is the temperature at noon, in °C?`)),
        end,
        bi(() => `${par(start)} ${change > 0 ? '+' : '−'} ${Math.abs(change)} = ${z(end)} (°C)`),
      );
    },
    // Opposites cancel.
    () => {
      const [a, b, c] = [int(100, 999), int(10, 99), int(10, 99)];
      const order = shuffle([`${a}`, `(−${b})`, `(−${a})`, `${c}`]);
      return inputZ(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(order.join(' + '))}`),
        c - b,
        bi((L) => `[${a} + (−${a})] + [${c} + (−${b})] = 0 + ${par(c - b)} = ${z(c - b)}`),
      );
    },
  ],
};

// ---------- Bài 15. Quy tắc dấu ngoặc ----------

const lesson15 = {
  id: 'c3b15',
  number: 15,
  title: { vi: 'Quy tắc dấu ngoặc', en: 'Removing brackets' },
  points: [
    {
      title: { vi: 'Bỏ dấu ngoặc', en: 'Removing brackets' },
      theory: {
        vi: [
          'Bỏ ngoặc có dấu <b>"+"</b> đằng trước: <b>giữ nguyên</b> dấu các số hạng trong ngoặc. a + (b − c) = a + b − c.',
          'Bỏ ngoặc có dấu <b>"−"</b> đằng trước: <b>đổi dấu tất cả</b> các số hạng trong ngoặc ("+" thành "−", "−" thành "+"). a − (b − c) = a − b + c.',
        ],
        en: [
          'Brackets with <b>"+"</b> in front: <b>keep</b> every sign inside. a + (b − c) = a + b − c.',
          'Brackets with <b>"−"</b> in front: <b>change every sign</b> inside ("+" becomes "−" and "−" becomes "+"). a − (b − c) = a − b + c.',
        ],
      },
      example: {
        caption: { vi: 'Tính 15 − (8 − 23 + 5).', en: 'Work out 15 − (8 − 23 + 5).' },
        frames: (L) => derivation([
          `15 ${hl('−')} (8 − 23 + 5)`,
          `= 15 − 8 ${hl('+')} 23 ${hl('−')} 5 <span class="note">${T(L, 'dấu "−" trước ngoặc: đổi dấu', '"−" in front: change the signs')}</span>`,
          '= 7 + 23 − 5',
          '= <b>25</b>',
        ]),
      },
    },
    {
      title: { vi: 'Tính nhanh nhờ đổi chỗ và nhóm số hạng', en: 'Quick sums by reordering and grouping' },
      theory: {
        vi: [
          'Một dãy cộng, trừ số nguyên có thể coi là một <b>tổng</b>; ta được đổi chỗ các số hạng (kèm theo dấu của chúng).',
          'Bỏ ngoặc rồi nhóm các số đối nhau hoặc các số có tổng tròn chục, tròn trăm.',
        ],
        en: [
          'A chain of additions and subtractions of integers is a <b>sum</b>; terms may be moved around (taking their signs with them).',
          'Remove the brackets, then group opposite numbers or numbers making round tens or hundreds.',
        ],
      },
      example: {
        caption: { vi: 'Tính nhanh (47 − 59) − (47 − 9).', en: 'Work out (47 − 59) − (47 − 9) quickly.' },
        frames: (L) => derivation([
          '(47 − 59) − (47 − 9)',
          `= ${hl('47')} − 59 ${hl('− 47')} + 9 <span class="note">${T(L, 'bỏ ngoặc', 'remove brackets')}</span>`,
          `= (${hl('47 − 47')}) + (−59 + 9)`,
          '= 0 + (−50) = <b>−50</b>',
        ]),
      },
    },
  ],
  exercises: [
    // Remove brackets correctly.
    () => {
      const [a, b, c, d] = distinct(4, 5, 60);
      return choice(
        bi((L) => `${T(L, 'Bỏ dấu ngoặc đúng:', 'Remove the brackets correctly:')} ${eq(`${a} − (${b} − ${c} + ${d})`)} =`),
        `${a} − ${b} + ${c} − ${d}`,
        [`${a} − ${b} − ${c} + ${d}`, `${a} − ${b} − ${c} − ${d}`, `${a} + ${b} − ${c} + ${d}`],
        bi((L) => T(L, 'Dấu "−" trước ngoặc: đổi dấu tất cả số hạng trong ngoặc.', '"−" in front of the brackets: change every sign inside.')),
      );
    },
    // Quick evaluation using brackets.
    () => {
      const a = int(100, 999);
      const [b, c] = [int(10, 99), int(10, 99)];
      const forms = [
        [`(${a} + ${b}) − (${a} − ${c})`, b + c, `${a} + ${b} − ${a} + ${c} = ${b} + ${c}`],
        [`(${a} − ${b}) − (${a} + ${c})`, -b - c, `${a} − ${b} − ${a} − ${c} = −${b} − ${c}`],
        [`(−${a} + ${b}) + (${a} − ${c})`, b - c, `−${a} + ${b} + ${a} − ${c} = ${b} − ${c}`],
        [`${a} − (${a} − ${b}) + (−${c})`, b - c, `${a} − ${a} + ${b} − ${c} = ${b} − ${c}`],
      ];
      const [expr, ans, how] = pick(forms);
      return inputZ(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(expr)}`),
        ans,
        bi(() => `${how} = ${z(ans)}`),
      );
    },
    // Evaluate with two brackets.
    () => {
      const [a, b, c, d, e] = [int(5, 50), int(5, 50), int(5, 50), int(5, 50), int(5, 50)];
      const value = a - (b + c) - (d - e);
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${a} − (${b} + ${c}) − (${d} − ${e})`)}`),
        value,
        bi(() => `${a} − ${b} − ${c} − ${d} + ${e} = ${z(value)}`),
        { html: `${a} − (${b} + ${c}) − (${d} − ${e})`, value },
      );
    },
    // Letters.
    () => {
      const [x, y, w] = shuffle(['a', 'b', 'c']);
      return choice(
        bi((L) => `${T(L, 'Bỏ dấu ngoặc:', 'Remove the brackets:')} ${eq(`−(${x} − ${y} + ${w})`)} =`),
        `−${x} + ${y} − ${w}`,
        [`−${x} − ${y} + ${w}`, `${x} − ${y} + ${w}`, `−${x} − ${y} − ${w}`],
        bi((L) => T(L, 'Đổi dấu từng số hạng trong ngoặc.', 'Change the sign of every term inside.')),
      );
    },
  ],
};

// ---------- Bài 16. Phép nhân số nguyên ----------

const NEG = { vi: 'Âm', en: 'Negative' };
const POS = { vi: 'Dương', en: 'Positive' };
const ZERO = { vi: 'Bằng 0', en: 'Zero' };

const lesson16 = {
  id: 'c3b16',
  number: 16,
  title: { vi: 'Phép nhân số nguyên', en: 'Multiplying integers' },
  points: [
    {
      title: { vi: 'Nhân hai số nguyên khác dấu', en: 'Multiplying integers with different signs' },
      theory: {
        vi: [
          'Tích của hai số nguyên khác dấu là một số <b>âm</b>: nhân hai phần số tự nhiên rồi đặt dấu "−" trước kết quả.',
          '<b>(−a) · b = a · (−b) = −(a · b)</b> (a, b ∈ ℕ*). Tích của một số nguyên với 0 bằng 0.',
        ],
        en: [
          'The product of two integers with different signs is <b>negative</b>: multiply the number parts and put "−" in front.',
          '<b>(−a) · b = a · (−b) = −(a · b)</b> (a, b ∈ ℕ*). Any integer times 0 is 0.',
        ],
      },
      example: {
        caption: { vi: '(−3) · 4 là tổng của bốn số −3.', en: '(−3) · 4 is four lots of −3 added together.' },
        frames: () => {
          const arcs = range(1, 4).map((k) => ({ a: -3 * (k - 1), b: -3 * k, label: '−3' }));
          const frames = [numberLine({ from: -13, to: 1, points: [{ n: 0, tone: 'off' }] }) + cap('(−3) · 4 = (−3) + (−3) + (−3) + (−3)', false, true)];
          for (let k = 1; k <= 4; k++) {
            frames.push(numberLine({
              from: -13, to: 1,
              points: [{ n: 0, tone: 'off' }, ...range(1, k).map((i) => ({ n: -3 * i, tone: i === 4 ? 'b' : 'a', isNew: i === k }))],
              arcs: arcs.slice(0, k).map((arc, i) => ({ ...arc, isNew: i === k - 1 })),
            }) + cap('(−3) · 4 = (−3) + (−3) + (−3) + (−3)', false, true));
          }
          frames.push(numberLine({ from: -13, to: 1, points: [{ n: 0, tone: 'off' }, { n: -3 }, { n: -6 }, { n: -9 }, { n: -12, tone: 'b' }], arcs })
            + cap('(−3) · 4 = −(3 · 4) = <b>−12</b>', true, true));
          return frames;
        },
      },
    },
    {
      title: { vi: 'Nhân hai số nguyên cùng dấu', en: 'Multiplying integers with the same sign' },
      theory: {
        vi: [
          'Tích của hai số nguyên âm là một số <b>dương</b>: <b>(−a) · (−b) = a · b</b>.',
          'Ghi nhớ: cùng dấu → tích dương; khác dấu → tích âm.',
        ],
        en: [
          'The product of two negative integers is <b>positive</b>: <b>(−a) · (−b) = a · b</b>.',
          'Remember: same signs → positive product; different signs → negative product.',
        ],
      },
      example: {
        caption: { vi: 'Vì sao (−3) · (−2) = 6? Nhìn quy luật.', en: 'Why is (−3) · (−2) = 6? Look at the pattern.' },
        frames: (L) => derivation([
          `(−3) · 3 = −9`,
          `(−3) · 2 = −6 <span class="note">+3</span>`,
          `(−3) · 1 = −3 <span class="note">+3</span>`,
          `(−3) · 0 = 0 <span class="note">+3</span>`,
          `(−3) · (−1) = ${hl('3')} <span class="note">+3</span>`,
          `(−3) · (−2) = ${hl('6')} <span class="note">${T(L, 'mỗi dòng tăng 3', 'up 3 each line')}</span>`,
        ]),
      },
    },
    {
      title: { vi: 'Tính chất của phép nhân', en: 'Properties of multiplication' },
      theory: {
        vi: [
          'Phép nhân số nguyên có tính chất giao hoán, kết hợp, nhân với 1 và <b>phân phối</b> đối với phép cộng, phép trừ: a · (b ± c) = a · b ± a · c.',
          'Dấu của tích nhiều thừa số khác 0: có <b>chẵn</b> thừa số âm → tích <b>dương</b>; <b>lẻ</b> thừa số âm → tích <b>âm</b>.',
        ],
        en: [
          'Multiplying integers is commutative and associative, 1 changes nothing, and it is <b>distributive</b> over + and −: a · (b ± c) = a · b ± a · c.',
          'Sign of a product of non-zero factors: an <b>even</b> number of negative factors → <b>positive</b>; an <b>odd</b> number → <b>negative</b>.',
        ],
      },
      example: {
        caption: { vi: 'Tính (−2) · (−5) · (−3) · 4.', en: 'Work out (−2) · (−5) · (−3) · 4.' },
        frames: (L) => derivation([
          `${hl('(−2)')} · ${hl('(−5)')} · ${hl('(−3)')} · 4`,
          T(L, 'Có 3 thừa số âm (số lẻ) → tích âm.', '3 negative factors (odd) → negative product.'),
          '2 · 5 · 3 · 4 = 120',
          '⇒ (−2) · (−5) · (−3) · 4 = <b>−120</b>',
        ]),
      },
    },
  ],
  exercises: [
    // Product of two.
    () => {
      const [a, b] = [nonZero(-15, 15), nonZero(-15, 15)];
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${par(a)} · ${par(b)}`)}`),
        a * b,
        bi((L) => `${(a < 0) === (b < 0) ? T(L, 'Cùng dấu → dương', 'Same signs → positive') : T(L, 'Khác dấu → âm', 'Different signs → negative')}: ${par(a)} · ${par(b)} = ${z(a * b)}`),
      );
    },
    // Sign of a long product.
    () => {
      const n = int(4, 6);
      const factors = Array.from({ length: n }, () => nonZero(-9, 9));
      if (Math.random() < 0.15) factors[int(0, n - 1)] = 0;
      const negatives = factors.filter((f) => f < 0).length;
      const hasZero = factors.includes(0);
      const ans = hasZero ? ZERO : negatives % 2 ? NEG : POS;
      return choice(
        bi((L) => `${T(L, 'Tích sau mang dấu gì?', 'What is the sign of this product?')} ${eq(factors.map(par).join(' · '))}`),
        ans,
        [ZERO, NEG, POS].filter((c) => c !== ans),
        bi((L) => (hasZero
          ? T(L, 'Có thừa số bằng 0 nên tích bằng 0.', 'One factor is 0, so the product is 0.')
          : T(L, `Có ${negatives} thừa số âm (${negatives % 2 ? 'lẻ' : 'chẵn'}) → tích ${negatives % 2 ? 'âm' : 'dương'}.`, `${negatives} negative factors (${negatives % 2 ? 'odd' : 'even'}) → ${negatives % 2 ? 'negative' : 'positive'}.`))),
      );
    },
    // Product of three.
    () => {
      const f = [nonZero(-9, 9), nonZero(-9, 9), nonZero(-6, 6)];
      const value = f[0] * f[1] * f[2];
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(f.map(par).join(' · '))}`),
        value,
        bi(() => `${par(f[0])} · ${par(f[1])} = ${z(f[0] * f[1])}; ${par(f[0] * f[1])} · ${par(f[2])} = ${z(value)}`),
      );
    },
    // Distributive shortcut.
    () => {
      const a = int(2, 49);
      const b = int(11, 89);
      const c = 100 - b;
      return inputZ(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(`(−${a}) · ${b} + (−${a}) · ${c}`)}`),
        -100 * a,
        bi((L) => `(−${a}) · (${b} + ${c}) = (−${a}) · 100 = ${fmt(-100 * a, L)}`),
      );
    },
    // Temperature dropping steadily.
    () => {
      const start = int(-5, 15);
      const drop = int(2, 5);
      const hours = int(2, 8);
      const end = start + -drop * hours;
      return inputZ(
        bi((L) => T(L, `Nhiệt độ lúc 18 giờ là ${z(start)} °C. Sau đó mỗi giờ nhiệt độ giảm ${drop} °C. Sau ${hours} giờ, nhiệt độ là bao nhiêu độ C?`, `At 6 pm it is ${z(start)} °C. After that the temperature drops ${drop} °C every hour. What is the temperature ${hours} hours later, in °C?`)),
        end,
        bi(() => `${par(start)} + (−${drop}) · ${hours} = ${par(start)} + ${par(-drop * hours)} = ${z(end)}`),
      );
    },
  ],
};

// ---------- Bài 17. Phép chia hết. Ước và bội của một số nguyên ----------

const lesson17 = {
  id: 'c3b17',
  number: 17,
  title: { vi: 'Phép chia hết. Ước và bội của một số nguyên', en: 'Exact division. Divisors and multiples of an integer' },
  points: [
    {
      title: { vi: 'Phép chia hết hai số nguyên', en: 'Exact division of integers' },
      theory: {
        vi: [
          `Với a, b ∈ ℤ, b ≠ 0: nếu có số nguyên q sao cho <b>a = b · q</b> thì a chia hết cho b, viết a : b = q (a ${DIV} b).`,
          'Thương của hai số <b>cùng dấu</b> là số dương; thương của hai số <b>khác dấu</b> là số âm.',
        ],
        en: [
          `For a, b ∈ ℤ with b ≠ 0: if a = b · q for some integer q, a is divisible by b and a : b = q (a ${DIV} b).`,
          'The quotient of two numbers with <b>the same sign</b> is positive; with <b>different signs</b> it is negative.',
        ],
      },
      example: {
        caption: { vi: 'Chia các số nguyên.', en: 'Dividing integers.' },
        frames: (L) => derivation([
          `(−36) : 4 = ${hl('−9')} <span class="note">${T(L, 'vì', 'because')} 4 · (−9) = −36</span>`,
          `36 : (−4) = ${hl('−9')} <span class="note">${T(L, 'vì', 'because')} (−4) · (−9) = 36</span>`,
          `(−36) : (−4) = ${hl('9', 'b')} <span class="note">${T(L, 'vì', 'because')} (−4) · 9 = −36</span>`,
          T(L, 'Cùng dấu → dương; khác dấu → âm.', 'Same signs → positive; different signs → negative.'),
        ]),
      },
    },
    {
      title: { vi: 'Ước và bội của một số nguyên', en: 'Divisors and multiples of an integer' },
      theory: {
        vi: [
          `Nếu a ${DIV} b thì a là <b>bội</b> của b và b là <b>ước</b> của a (a, b ∈ ℤ, b ≠ 0).`,
          'Nếu b là ước của a thì <b>−b cũng là ước</b> của a. Vì thế số ước nguyên của a gấp đôi số ước tự nhiên của nó.',
          'Các bội của b là 0; ±b; ±2b; ±3b; …',
        ],
        en: [
          `If a ${DIV} b then a is a <b>multiple</b> of b and b is a <b>divisor</b> of a (a, b ∈ ℤ, b ≠ 0).`,
          'If b divides a, then <b>−b divides a too</b>. So a has twice as many integer divisors as natural ones.',
          'The multiples of b are 0, ±b, ±2b, ±3b, …',
        ],
      },
      example: {
        caption: { vi: 'Các ước nguyên của 6.', en: 'The integer divisors of 6.' },
        frames: (L) => {
          const rows = [
            { label: T(L, 'Ước tự nhiên', 'Natural'), items: [1, 2, 3, 6] },
            { label: T(L, 'Ước nguyên', 'Integer'), items: ['−6', '−3', '−2', '−1', 1, 2, 3, 6] },
          ];
          return [
            chipRows({ rows: rows.slice(0, 1), newRow: 0 }),
            chipRows({ rows, newRow: 1, common: ['−6', '−3', '−2', '−1'], showCommon: true })
              + cap(T(L, 'Mỗi ước dương có thêm một ước âm là số đối của nó.', 'Each positive divisor has a negative partner, its opposite.'), true),
            chipRows({ rows, common: ['−6', '−3', '−2', '−1'], showCommon: true })
              + cap(`${sym(L, 'U')}(6) = ${setOf(['−6', '−3', '−2', '−1', 1, 2, 3, 6], L)} — ${T(L, '8 ước', '8 divisors')}`, true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Quotient with signs.
    () => {
      const [b, q] = [nonZero(-12, 12), nonZero(-15, 15)];
      const a = b * q;
      return inputZ(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${par(a)} : ${par(b)}`)}`),
        q,
        bi((L) => `${par(b)} · ${par(q)} = ${z(a)} ⇒ ${par(a)} : ${par(b)} = ${z(q)}`),
      );
    },
    // Number of integer divisors.
    () => {
      const n = pick([6, 8, 10, 12, 15, 16, 18, 20, 24, 28, 30, 36]);
      const ds = divisors(n);
      return input(
        bi((L) => T(L, `Số ${n} có bao nhiêu ước nguyên?`, `How many integer divisors does ${n} have?`)),
        2 * ds.length,
        bi((L) => T(L, `${n} có ${ds.length} ước tự nhiên ${setOf(ds, L)}; mỗi ước có thêm số đối: ${2 * ds.length} ước nguyên.`, `${n} has ${ds.length} natural divisors ${setOf(ds, L)}; each has an opposite too: ${2 * ds.length} integer divisors.`)),
      );
    },
    // Find x.
    () => {
      const [a, x] = [nonZero(-12, 12), nonZero(-20, 20)];
      return inputZ(
        bi((L) => `${T(L, 'Tìm số nguyên x, biết:', 'Find the integer x:')} ${eq(`${par(a)} · x = ${z(a * x)}`)}`),
        x,
        bi(() => `x = ${par(a * x)} : ${par(a)} = ${z(x)}`),
      );
    },
    // Which is a multiple?
    () => {
      const k = int(3, 12);
      const m = k * nonZero(-12, 12);
      const wrongs = new Set();
      while (wrongs.size < 3) { const w = m + nonZero(-k + 1, k - 1); if (w % k !== 0) wrongs.add(w); }
      return choice(
        bi((L) => T(L, `Số nào là <b>bội</b> của ${z(-k)}?`, `Which number is a <b>multiple</b> of ${z(-k)}?`)),
        z(m),
        [...wrongs].map(z),
        bi(() => `${z(m)} = ${par(-k)} · ${par(-m / k)}`),
      );
    },
    // Smallest integer divisor.
    () => {
      const n = pick([12, 15, 18, 20, 24, 30, 36, 40, 42, 48]);
      const smallest = Math.random() < 0.5;
      return inputZ(
        bi((L) => T(L, `Tìm ước <b>âm ${smallest ? 'nhỏ' : 'lớn'} nhất</b> của ${n}.`, `Find the ${smallest ? 'smallest' : 'largest'} <b>negative</b> divisor of ${n}.`)),
        smallest ? -n : -1,
        bi((L) => T(L, `Các ước âm của ${n}: ${divisors(n).map((d) => `−${d}`).reverse().join('; ')}. ${smallest ? `Nhỏ nhất là −${n}` : 'Lớn nhất là −1'}.`, `The negative divisors of ${n}: ${divisors(n).map((d) => `−${d}`).reverse().join(', ')}. The ${smallest ? `smallest is −${n}` : 'largest is −1'}.`)),
      );
    },
  ],
};

export const CHAPTER3 = [lesson13, lesson14, lesson15, lesson16, lesson17];
