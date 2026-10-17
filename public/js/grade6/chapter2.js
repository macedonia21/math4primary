// Grade 6, Chapter II: divisibility in the natural numbers. Theory,
// step-by-step examples and exercise generators for lessons 8–12.
// All text is original, written to follow the curriculum topics.

import {
  bi, T, fmt, setOf, int, pick, shuffle, distinct, choice, input,
  gcd, lcm, divisors, isPrime, primesBelow, factorize, factorHtml, frac, DIV, NDIV, sym,
} from './util.js';
import {
  derivation, numberLine, dots, chipRows, sieve, divisionColumn,
} from './visuals.js';

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const hl = (s, tone = 'a') => `<span class="hl ${tone}">${s}</span>`;
const cap = (html, isNew = false, big = false) => `<p class="vx-caption${isNew ? ' new' : ''}${big ? ' big' : ''}">${html}</p>`;
const eq = (html) => `<span class="eq">${html}</span>`;
const YES = { vi: 'Có', en: 'Yes' };
const NO = { vi: 'Không', en: 'No' };
const digitSum = (n) => [...String(n)].reduce((s, d) => s + Number(d), 0);

// Numbers with many divisors make the best "divisor" questions.
const RICH = [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 72, 80, 84, 90, 96, 100];

// ---------- Bài 8. Quan hệ chia hết và tính chất ----------

const lesson8 = {
  id: 'c2b8',
  number: 8,
  title: { vi: 'Quan hệ chia hết và tính chất', en: 'Divisibility and its properties' },
  points: [
    {
      title: { vi: 'Chia hết. Ước và bội', en: 'Divisibility. Divisors and multiples' },
      theory: {
        vi: [
          `Với a, b ∈ ℕ, b ≠ 0: nếu có số tự nhiên k sao cho <b>a = b · k</b> thì a <b>chia hết</b> cho b, kí hiệu <b>a ${DIV} b</b>. Ngược lại, viết a ${NDIV} b.`,
          `Nếu a ${DIV} b thì a là <b>bội</b> của b, còn b là <b>ước</b> của a.`,
          `<b>${sym('vi', 'U')}(a)</b>: tập hợp các ước của a — tìm bằng cách chia a lần lượt cho 1; 2; 3; …; a.`,
          `<b>${sym('vi', 'B')}(b)</b>: tập hợp các bội của b — tìm bằng cách nhân b lần lượt với 0; 1; 2; 3; …`,
        ],
        en: [
          `For a, b ∈ ℕ with b ≠ 0: if a = b · k for some natural number k, then a is <b>divisible</b> by b, written <b>a ${DIV} b</b>. Otherwise we write a ${NDIV} b.`,
          `If a ${DIV} b, then a is a <b>multiple</b> of b and b is a <b>divisor</b> of a.`,
          `<b>${sym('en', 'U')}(a)</b>: the set of divisors of a — divide a by 1, 2, 3, …, a in turn.`,
          `<b>${sym('en', 'B')}(b)</b>: the set of multiples of b — multiply b by 0, 1, 2, 3, … in turn.`,
        ],
      },
      example: {
        caption: { vi: 'Xếp 12 chấm thành các hàng đều nhau để tìm ước của 12.', en: 'Arrange 12 dots in equal rows to find the divisors of 12.' },
        frames: (L) => [
          dots({ rows: 1, cols: 12 }) + cap(T(L, '1 hàng × 12 chấm: 1 và 12 là ước của 12.', '1 row × 12 dots: 1 and 12 divide 12.')),
          dots({ rows: 2, cols: 6, isNew: true }) + cap(T(L, '2 hàng × 6 chấm: 2 và 6 là ước của 12.', '2 rows × 6 dots: 2 and 6 divide 12.'), true),
          dots({ rows: 3, cols: 4, isNew: true }) + cap(T(L, '3 hàng × 4 chấm: 3 và 4 là ước của 12.', '3 rows × 4 dots: 3 and 4 divide 12.'), true),
          dots({ rows: 3, cols: 4 }) + cap(T(L, `Không xếp được 5 hàng đều nhau: 12 ${NDIV} 5.`, `5 equal rows is impossible: 12 ${NDIV} 5.`), true),
          dots({ rows: 3, cols: 4 }) + cap(`${sym(L, 'U')}(12) = ${setOf([1, 2, 3, 4, 6, 12], L)}`, true, true),
        ],
      },
    },
    {
      title: { vi: 'Bội của một số', en: 'Multiples of a number' },
      theory: {
        vi: [
          'Các bội của b là 0; b; 2b; 3b; … Trên tia số, chúng cách đều nhau, mỗi bước dài b.',
          'Số 0 là bội của mọi số khác 0. Mỗi số khác 0 có vô số bội.',
        ],
        en: [
          'The multiples of b are 0, b, 2b, 3b, … On the number ray they are evenly spaced, b apart.',
          '0 is a multiple of every non-zero number. Every non-zero number has infinitely many multiples.',
        ],
      },
      example: {
        caption: { vi: 'Các bội của 3 trên tia số.', en: 'Multiples of 3 on the number ray.' },
        frames: (L) => {
          const frames = [];
          const points = [{ n: 0 }];
          const arcs = [];
          frames.push(numberLine({ from: 0, to: 15, points: [...points] }));
          for (let k = 1; k <= 5; k++) {
            frames.push(numberLine({
              from: 0, to: 15,
              points: [...points.map((p) => ({ ...p, isNew: false })), { n: 3 * k, isNew: true }],
              arcs: [...arcs, { a: 3 * (k - 1), b: 3 * k, label: '+3', isNew: true }],
            }));
            points.push({ n: 3 * k });
            arcs.push({ a: 3 * (k - 1), b: 3 * k, label: '+3' });
          }
          frames.push(numberLine({ from: 0, to: 15, points, arcs }) + cap(`${sym(L, 'B')}(3) = ${setOf([0, 3, 6, 9, 12, 15, '…'], L)}`, true, true));
          return frames;
        },
      },
    },
    {
      title: { vi: 'Tính chất chia hết của một tổng', en: 'Divisibility of a sum' },
      theory: {
        vi: [
          `Nếu <b>tất cả</b> các số hạng chia hết cho m thì tổng chia hết cho m: a ${DIV} m, b ${DIV} m ⇒ (a + b) ${DIV} m. Hiệu cũng vậy: (a − b) ${DIV} m.`,
          `Nếu chỉ có <b>đúng một</b> số hạng không chia hết cho m, còn lại đều chia hết, thì tổng <b>không</b> chia hết cho m.`,
          'Nhờ đó có thể biết một tổng có chia hết cho m hay không mà không cần tính tổng.',
        ],
        en: [
          `If <b>every</b> term is divisible by m, so is the sum: a ${DIV} m, b ${DIV} m ⇒ (a + b) ${DIV} m. The same holds for a difference: (a − b) ${DIV} m.`,
          `If <b>exactly one</b> term is not divisible by m and all the others are, the sum is <b>not</b> divisible by m.`,
          'So we can tell whether a sum is divisible by m without working it out.',
        ],
      },
      example: {
        caption: { vi: 'Không tính tổng, xét xem 35 + 49 + 18 có chia hết cho 7 không.', en: 'Without adding, decide whether 35 + 49 + 18 is divisible by 7.' },
        frames: (L) => derivation([
          `35 + 49 + 18 &nbsp; ? ${DIV} 7`,
          `35 = 7 · 5 ⇒ ${hl(`35 ${DIV} 7`, 'b')}`,
          `49 = 7 · 7 ⇒ ${hl(`49 ${DIV} 7`, 'b')}`,
          `18 = 7 · 2 + 4 ⇒ ${hl(`18 ${NDIV} 7`)}`,
          `${T(L, 'Đúng một số hạng không chia hết cho 7', 'Exactly one term is not divisible by 7')} ⇒ <b>(35 + 49 + 18) ${NDIV} 7</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // Which number is a divisor of n?
    () => {
      const n = pick(RICH);
      const divs = divisors(n);
      const right = pick(divs.filter((d) => d > 1 && d < n));
      const wrongs = shuffle(range(2, n - 1).filter((d) => n % d !== 0)).slice(0, 3);
      return choice(
        bi((L) => T(L, `Số nào là <b>ước</b> của ${n}?`, `Which number is a <b>divisor</b> of ${n}?`)),
        right,
        wrongs,
        bi((L) => `${sym(L, 'U')}(${n}) = ${setOf(divs, L)}`),
      );
    },
    // How many divisors?
    () => {
      const n = pick([...RICH, 16, 15, 21, 25, 27, 35, 49]);
      const divs = divisors(n);
      return input(
        bi((L) => T(L, `Số ${n} có bao nhiêu ước?`, `How many divisors does ${n} have?`)),
        divs.length,
        bi((L) => `${sym(L, 'U')}(${n}) = ${setOf(divs, L)} — ${T(L, `${divs.length} ước`, `${divs.length} divisors`)}`),
      );
    },
    // Which number is a multiple of k?
    () => {
      const k = int(3, 15);
      const m = k * int(3, 12);
      const wrongs = shuffle([...new Set([m - 1, m + 1, m + 2, m - 2, m + k - 1, m + k + 1])].filter((v) => v % k !== 0 && v > 0)).slice(0, 3);
      return choice(
        bi((L) => T(L, `Số nào là <b>bội</b> của ${k}?`, `Which number is a <b>multiple</b> of ${k}?`)),
        m,
        wrongs,
        bi(() => `${m} = ${k} · ${m / k}`),
      );
    },
    // Is the sum divisible by m?
    () => {
      const m = pick([3, 4, 5, 6, 7, 8, 9]);
      const terms = Array.from({ length: 3 }, () => m * int(2, 15));
      const breakIt = Math.random() < 0.5;
      if (breakIt) terms[int(0, 2)] += int(1, m - 1);
      const sum = terms.reduce((a, b) => a + b, 0);
      const yes = sum % m === 0;
      return choice(
        bi((L) => T(L, `Không tính tổng, cho biết ${eq(terms.join(' + '))} có chia hết cho ${m} không?`, `Without adding, is ${eq(terms.join(' + '))} divisible by ${m}?`)),
        yes ? YES : NO,
        [yes ? NO : YES],
        bi((L) => (yes
          ? T(L, `Mọi số hạng đều chia hết cho ${m} nên tổng chia hết cho ${m}.`, `Every term is divisible by ${m}, so the sum is too.`)
          : T(L, `Chỉ một số hạng không chia hết cho ${m} nên tổng không chia hết cho ${m}.`, `Exactly one term is not divisible by ${m}, so the sum is not.`))),
      );
    },
    // Multiples below a bound.
    () => {
      const k = int(3, 12);
      const n = int(30, 120);
      const list = range(0, n - 1).filter((v) => v % k === 0);
      return input(
        bi((L) => T(L, `Có bao nhiêu bội của ${k} nhỏ hơn ${n}? (kể cả số 0)`, `How many multiples of ${k} are less than ${n}? (0 included)`)),
        list.length,
        bi((L) => `${setOf(list.length > 8 ? [0, k, 2 * k, '…', list[list.length - 1]] : list, L)} — ${list.length}`),
      );
    },
  ],
};

// ---------- Bài 9. Dấu hiệu chia hết ----------

const SIGNS = {
  2: { vi: 'tận cùng là 0; 2; 4; 6; 8', en: 'last digit 0, 2, 4, 6 or 8' },
  5: { vi: 'tận cùng là 0 hoặc 5', en: 'last digit 0 or 5' },
  3: { vi: 'tổng các chữ số chia hết cho 3', en: 'digit sum divisible by 3' },
  9: { vi: 'tổng các chữ số chia hết cho 9', en: 'digit sum divisible by 9' },
};

function divisibilityReason(n, k, L) {
  if (k === 2 || k === 5) {
    const last = n % 10;
    return T(L, `${fmt(n, L)} có chữ số tận cùng là ${last}. Dấu hiệu chia hết cho ${k}: ${SIGNS[k].vi}.`, `${fmt(n, L)} ends in ${last}. A number is divisible by ${k} when it has ${SIGNS[k].en}.`);
  }
  const s = digitSum(n);
  return T(L, `Tổng các chữ số của ${fmt(n, L)} là ${s}. Dấu hiệu chia hết cho ${k}: ${SIGNS[k].vi}.`, `The digits of ${fmt(n, L)} add up to ${s}. A number is divisible by ${k} when its ${SIGNS[k].en}.`);
}

const lesson9 = {
  id: 'c2b9',
  number: 9,
  title: { vi: 'Dấu hiệu chia hết', en: 'Divisibility rules' },
  points: [
    {
      title: { vi: 'Dấu hiệu chia hết cho 2, cho 5', en: 'Divisibility by 2 and by 5' },
      theory: {
        vi: [
          `Số có chữ số tận cùng là <b>0; 2; 4; 6; 8</b> (số chẵn) thì chia hết cho 2, và chỉ những số đó mới chia hết cho 2.`,
          'Số có chữ số tận cùng là <b>0 hoặc 5</b> thì chia hết cho 5, và chỉ những số đó mới chia hết cho 5.',
          'Số có chữ số tận cùng là <b>0</b> thì chia hết cho cả 2 và 5.',
        ],
        en: [
          'A number ending in <b>0, 2, 4, 6 or 8</b> (an even number) is divisible by 2, and only those are.',
          'A number ending in <b>0 or 5</b> is divisible by 5, and only those are.',
          'A number ending in <b>0</b> is divisible by both 2 and 5.',
        ],
      },
      example: {
        caption: { vi: 'Chỉ cần nhìn chữ số tận cùng.', en: 'Just look at the last digit.' },
        frames: (L) => derivation([
          `3 47${hl('6')} → ${T(L, 'chẵn', 'even')} → ${DIV} 2, &nbsp; ${NDIV} 5`,
          `1 28${hl('5', 'b')} → ${DIV} 5, &nbsp; ${NDIV} 2`,
          `94${hl('0')} → ${DIV} 2 ${T(L, 'và', 'and')} ${DIV} 5`,
          `7 23${hl('1', 'b')} → ${NDIV} 2, &nbsp; ${NDIV} 5`,
        ]),
      },
    },
    {
      title: { vi: 'Dấu hiệu chia hết cho 9, cho 3', en: 'Divisibility by 9 and by 3' },
      theory: {
        vi: [
          'Số có <b>tổng các chữ số chia hết cho 9</b> thì chia hết cho 9, và chỉ những số đó mới chia hết cho 9.',
          'Số có <b>tổng các chữ số chia hết cho 3</b> thì chia hết cho 3, và chỉ những số đó mới chia hết cho 3.',
          'Số chia hết cho 9 thì chia hết cho 3; nhưng số chia hết cho 3 chưa chắc chia hết cho 9.',
        ],
        en: [
          'A number whose <b>digits add up to a multiple of 9</b> is divisible by 9, and only those are.',
          'A number whose <b>digits add up to a multiple of 3</b> is divisible by 3, and only those are.',
          'A number divisible by 9 is divisible by 3; but a number divisible by 3 need not be divisible by 9.',
        ],
      },
      example: {
        caption: { vi: 'Cộng các chữ số rồi xét tổng.', en: 'Add the digits, then check the total.' },
        frames: (L) => derivation([
          `5 832: &nbsp; ${hl('5 + 8 + 3 + 2')} = 18`,
          `18 ${DIV} 9 ⇒ <b>5 832 ${DIV} 9</b> ${T(L, '(và cũng', '(and so')} ${DIV} 3)`,
          `2 571: &nbsp; ${hl('2 + 5 + 7 + 1', 'b')} = 15`,
          `15 ${DIV} 3 ${T(L, 'nhưng', 'but')} 15 ${NDIV} 9 ⇒ <b>2 571 ${DIV} 3, 2 571 ${NDIV} 9</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // Which number is divisible by k?
    () => {
      const k = pick([2, 3, 5, 9]);
      const ok = (n) => n % k === 0;
      let right;
      do { right = int(100, 9999); } while (!ok(right));
      const wrongs = new Set();
      while (wrongs.size < 3) { const v = right + int(1, 30) * pick([1, -1]); if (!ok(v) && v > 0) wrongs.add(v); }
      return choice(
        bi((L) => T(L, `Số nào chia hết cho ${k}?`, `Which number is divisible by ${k}?`)),
        bi((L) => fmt(right, L)),
        [...wrongs].map((v) => bi((L) => fmt(v, L))),
        bi((L) => divisibilityReason(right, k, L)),
      );
    },
    // Yes/no for 3 or 9 with a bigger number.
    () => {
      const k = pick([3, 9]);
      const n = int(10000, 999999);
      const yes = n % k === 0;
      return choice(
        bi((L) => T(L, `Số ${fmt(n, L)} có chia hết cho ${k} không?`, `Is ${fmt(n, L)} divisible by ${k}?`)),
        yes ? YES : NO,
        [yes ? NO : YES],
        bi((L) => `${divisibilityReason(n, k, L)} ${digitSum(n)} ${digitSum(n) % k === 0 ? DIV : NDIV} ${k}.`),
      );
    },
    // Fill in the missing digit.
    () => {
      const k = pick([3, 9]);
      for (;;) {
        const digits = [int(1, 9), int(0, 9), int(0, 9), int(0, 9)];
        const pos = int(1, 3);
        const fits = range(0, 9).filter((d) => {
          const copy = [...digits];
          copy[pos] = d;
          return digitSum(Number(copy.join(''))) % k === 0;
        });
        if (!fits.length) continue;
        const shown = digits.map((d, i) => (i === pos ? '<span class="blank">*</span>' : d)).join('');
        const rest = digits.filter((_, i) => i !== pos).reduce((a, b) => a + b, 0);
        return input(
          bi((L) => T(L, `Thay * bằng chữ số <b>nhỏ nhất</b> để ${eq(shown)} chia hết cho ${k}.`, `Replace * with the <b>smallest</b> digit that makes ${eq(shown)} divisible by ${k}.`)),
          fits[0],
          bi((L) => T(L, `Tổng các chữ số đã biết là ${rest}. Cần ${rest} + * chia hết cho ${k}: * ∈ ${setOf(fits, L)}; nhỏ nhất là ${fits[0]}.`, `The known digits add up to ${rest}. We need ${rest} + * divisible by ${k}: * ∈ ${setOf(fits, L)}; the smallest is ${fits[0]}.`)),
        );
      }
    },
    // Divisible by both 2 and 5.
    () => {
      const base = int(10, 999);
      const right = base * 10;
      const wrongs = shuffle([base * 10 + 5, base * 10 + 2, base * 10 + 8, base * 10 + 4]).slice(0, 3);
      return choice(
        bi((L) => T(L, 'Số nào chia hết cho <b>cả 2 và 5</b>?', 'Which number is divisible by <b>both 2 and 5</b>?')),
        bi((L) => fmt(right, L)),
        wrongs.map((v) => bi((L) => fmt(v, L))),
        bi((L) => T(L, 'Chia hết cho cả 2 và 5 thì chữ số tận cùng phải là 0.', 'To be divisible by both 2 and 5 a number must end in 0.')),
      );
    },
    // How many numbers in a range are divisible by k?
    () => {
      const k = pick([2, 3, 5, 9]);
      const a = int(10, 200);
      const b = a + int(20, 120);
      const list = range(a, b).filter((v) => v % k === 0);
      const [first, last] = [list[0], list[list.length - 1]];
      return input(
        bi((L) => T(L, `Từ ${a} đến ${b} có bao nhiêu số chia hết cho ${k}?`, `How many numbers from ${a} to ${b} are divisible by ${k}?`)),
        list.length,
        bi((L) => T(L, `Các số đó: ${first}; ${first + k}; …; ${last}. Số các số: (${last} − ${first}) : ${k} + 1 = ${list.length}.`, `They are ${first}, ${first + k}, …, ${last}. Count: (${last} − ${first}) : ${k} + 1 = ${list.length}.`)),
      );
    },
  ],
};

// ---------- Bài 10. Số nguyên tố ----------

const PRIMES_100 = primesBelow(100);
const TRICKY_COMPOSITES = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 95, 99];

const lesson10 = {
  id: 'c2b10',
  number: 10,
  title: { vi: 'Số nguyên tố', en: 'Prime numbers' },
  points: [
    {
      title: { vi: 'Số nguyên tố và hợp số', en: 'Primes and composite numbers' },
      theory: {
        vi: [
          '<b>Số nguyên tố</b> là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó.',
          '<b>Hợp số</b> là số tự nhiên lớn hơn 1, có nhiều hơn hai ước.',
          'Số 0 và số 1 <b>không</b> là số nguyên tố, cũng không là hợp số. Số 2 là số nguyên tố chẵn duy nhất.',
          'Các số nguyên tố nhỏ hơn 30: 2; 3; 5; 7; 11; 13; 17; 19; 23; 29.',
        ],
        en: [
          'A <b>prime number</b> is a natural number greater than 1 whose only divisors are 1 and itself.',
          'A <b>composite number</b> is a natural number greater than 1 with more than two divisors.',
          '0 and 1 are <b>neither</b> prime nor composite. 2 is the only even prime.',
          'The primes below 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.',
        ],
      },
      example: {
        caption: { vi: 'Sàng Eratosthenes: gạch bỏ các bội để tìm số nguyên tố đến 50.', en: 'The sieve of Eratosthenes: cross out multiples to find the primes up to 50.' },
        frames: (L) => {
          const frames = [sieve({}) + cap(T(L, 'Viết các số từ 1 đến 50.', 'Write the numbers 1 to 50.'))];
          let crossed = [1];
          let primes = [];
          frames.push(sieve({ crossed, fresh: [1] }) + cap(T(L, 'Gạch số 1 (không là số nguyên tố).', 'Cross out 1 (not prime).'), true));
          for (const p of [2, 3, 5, 7]) {
            const newCross = range(2, 50).filter((n) => n % p === 0 && n !== p && !crossed.includes(n));
            crossed = [...crossed, ...newCross];
            primes = [...primes, p];
            frames.push(sieve({ crossed, primes, fresh: [p, ...newCross] })
              + cap(T(L, `Giữ ${p}, gạch các bội khác của ${p}.`, `Keep ${p}, cross out its other multiples.`), true));
          }
          const all = range(2, 50).filter((n) => !crossed.includes(n));
          frames.push(sieve({ crossed, primes: all, fresh: all.filter((n) => !primes.includes(n)) })
            + cap(T(L, `Các số còn lại là số nguyên tố: ${all.length} số.`, `The numbers left are prime: ${all.length} of them.`), true, true));
          return frames;
        },
      },
    },
    {
      title: { vi: 'Phân tích một số ra thừa số nguyên tố', en: 'Prime factorisation' },
      theory: {
        vi: [
          'Mọi hợp số đều viết được thành <b>tích các thừa số nguyên tố</b>, và cách viết đó là duy nhất (không kể thứ tự).',
          '<b>Cách làm "theo cột dọc"</b>: chia số đó cho số nguyên tố nhỏ nhất có thể (2, 3, 5, 7, …), lặp lại với thương cho đến khi được 1.',
          'Viết kết quả gọn bằng luỹ thừa, các thừa số theo thứ tự tăng dần: 180 = 2² · 3² · 5.',
        ],
        en: [
          'Every composite number can be written as a <b>product of primes</b>, in exactly one way (apart from order).',
          '<b>The column method</b>: divide by the smallest prime that works (2, 3, 5, 7, …), repeat with the quotient until you reach 1.',
          'Write the result with powers, primes in increasing order: 180 = 2² · 3² · 5.',
        ],
      },
      example: {
        caption: { vi: 'Phân tích 180 ra thừa số nguyên tố.', en: 'Factorise 180 into primes.' },
        frames: (L) => {
          const frames = [];
          for (let k = 1; k <= 6; k++) frames.push(divisionColumn({ n: 180, k }));
          frames.push(divisionColumn({ n: 180, k: 6 }) + cap(`180 = 2 · 2 · 3 · 3 · 5 = <b>${factorHtml(factorize(180))}</b>`, true, true));
          return frames;
        },
      },
    },
  ],
  exercises: [
    // Which is prime?
    () => {
      const p = pick(PRIMES_100.filter((n) => n > 10));
      return choice(
        bi((L) => T(L, 'Số nào là <b>số nguyên tố</b>?', 'Which number is <b>prime</b>?')),
        p,
        shuffle(TRICKY_COMPOSITES).slice(0, 3),
        bi((L) => T(L, `${p} chỉ có hai ước là 1 và ${p}. Các số còn lại đều có thêm ước khác (ví dụ chia hết cho 3 hoặc 7).`, `${p} has only the divisors 1 and ${p}. The others have more divisors (e.g. divisible by 3 or 7).`)),
      );
    },
    // Which is composite?
    () => {
      const c = pick(TRICKY_COMPOSITES);
      const ps = shuffle(PRIMES_100.filter((n) => n > 10)).slice(0, 3);
      const d = divisors(c).find((v) => v > 1);
      return choice(
        bi((L) => T(L, 'Số nào là <b>hợp số</b>?', 'Which number is <b>composite</b>?')),
        c,
        ps,
        bi(() => `${c} = ${d} · ${c / d}`),
      );
    },
    // Factorisation.
    () => {
      for (;;) {
        const n = int(24, 400);
        const f = factorize(n);
        if (f.length < 2 || isPrime(n)) continue;
        const exponents = f.map(([, e]) => e);
        if (Math.max(...exponents) < 2) continue;
        const correct = factorHtml(f);
        const dropOne = factorHtml(f.map(([p, e], i) => [p, i === 0 ? Math.max(1, e - 1) : e]));
        const plusOne = factorHtml(f.map(([p, e], i) => [p, i === f.length - 1 ? e + 1 : e]));
        const c = divisors(n).find((d) => d > 1 && !isPrime(d)); // 4 · 45 is a product, but not of primes
        const notPrime = `${c} · ${n / c}`;
        const wrongs = [...new Set([dropOne, plusOne, notPrime])].filter((w) => w !== correct);
        if (wrongs.length < 3) continue;
        return choice(
          bi((L) => T(L, `Phân tích ${n} ra thừa số nguyên tố:`, `The prime factorisation of ${n} is:`)),
          correct,
          wrongs,
          bi((L) => `${n} = ${factorize(n).flatMap(([p, e]) => Array(e).fill(p)).join(' · ')} = ${correct}`),
        );
      }
    },
    // Count primes below n.
    () => {
      const n = int(12, 50);
      const list = primesBelow(n);
      return input(
        bi((L) => T(L, `Có bao nhiêu số nguyên tố nhỏ hơn ${n}?`, `How many primes are less than ${n}?`)),
        list.length,
        bi((L) => `${setOf(list, L)} — ${list.length}`),
      );
    },
    // Next prime.
    () => {
      const n = int(10, 90);
      let p = n + 1;
      while (!isPrime(p)) p++;
      return input(
        bi((L) => T(L, `Tìm số nguyên tố nhỏ nhất lớn hơn ${n}.`, `Find the smallest prime greater than ${n}.`)),
        p,
        bi((L) => (p === n + 1
          ? T(L, `${p} là số nguyên tố.`, `${p} is prime.`)
          : T(L, `${range(n + 1, p - 1).join(', ')} là hợp số; ${p} là số nguyên tố.`, `${range(n + 1, p - 1).join(', ')} are composite; ${p} is prime.`))),
      );
    },
  ],
};

// ---------- Bài 11. Ước chung. Ước chung lớn nhất ----------

// Two numbers with a reasonably large GCD.
function gcdPair(maxG = 15) {
  for (;;) {
    const g = int(2, maxG);
    const [x, y] = distinct(2, 2, 9);
    if (gcd(x, y) === 1 && g * Math.max(x, y) <= 150) return [g * x, g * y];
  }
}

const lesson11 = {
  id: 'c2b11',
  number: 11,
  title: { vi: 'Ước chung. Ước chung lớn nhất', en: 'Common divisors. Greatest common divisor' },
  points: [
    {
      title: { vi: 'Ước chung và ước chung lớn nhất', en: 'Common divisors and the GCD' },
      theory: {
        vi: [
          `<b>Ước chung</b> của hai hay nhiều số là số vừa là ước của tất cả các số đó. Kí hiệu ${sym('vi', 'UC')}(a, b).`,
          `<b>Ước chung lớn nhất</b> là số lớn nhất trong tập hợp các ước chung, kí hiệu ${sym('vi', 'UCLN')}(a, b).`,
          `Các ước chung đều là ước của ${sym('vi', 'UCLN')}: ${sym('vi', 'UC')}(a, b) = ${sym('vi', 'U')}(${sym('vi', 'UCLN')}(a, b)).`,
          `Nếu ${sym('vi', 'UCLN')}(a, b) = 1 thì a và b là hai số <b>nguyên tố cùng nhau</b>.`,
        ],
        en: [
          `A <b>common divisor</b> of two or more numbers divides all of them. The set is written ${sym('en', 'UC')}(a, b).`,
          `The <b>greatest common divisor</b> is the largest of them, written ${sym('en', 'UCLN')}(a, b).`,
          `Every common divisor divides the GCD: ${sym('en', 'UC')}(a, b) = ${sym('en', 'U')}(${sym('en', 'UCLN')}(a, b)).`,
          `If ${sym('en', 'UCLN')}(a, b) = 1, a and b are <b>coprime</b>.`,
        ],
      },
      example: {
        caption: { vi: 'Tìm các ước chung của 18 và 24.', en: 'Find the common divisors of 18 and 24.' },
        frames: (L) => {
          const rows = [
            { label: `${sym(L, 'U')}(18)`, items: divisors(18) },
            { label: `${sym(L, 'U')}(24)`, items: divisors(24) },
          ];
          const common = [1, 2, 3, 6];
          return [
            chipRows({ rows: rows.slice(0, 1), newRow: 0 }),
            chipRows({ rows, newRow: 1 }),
            chipRows({ rows, common, showCommon: true }) + cap(`${sym(L, 'UC')}(18, 24) = ${setOf(common, L)}`, true),
            chipRows({ rows, common, showCommon: true }) + cap(`${sym(L, 'UC')}(18, 24) = ${setOf(common, L)}`)
              + cap(`${sym(L, 'UCLN')}(18, 24) = 6`, true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Tìm ƯCLN bằng cách phân tích ra thừa số nguyên tố', en: 'Finding the GCD by prime factorisation' },
      theory: {
        vi: [
          '<b>Bước 1:</b> Phân tích mỗi số ra thừa số nguyên tố.',
          '<b>Bước 2:</b> Chọn các thừa số nguyên tố <b>chung</b>.',
          '<b>Bước 3:</b> Lập tích các thừa số đã chọn, mỗi thừa số lấy với số mũ <b>nhỏ nhất</b>.',
        ],
        en: [
          '<b>Step 1:</b> Factorise each number into primes.',
          '<b>Step 2:</b> Pick the primes they have <b>in common</b>.',
          '<b>Step 3:</b> Multiply them, each with its <b>smallest</b> exponent.',
        ],
      },
      example: {
        caption: { vi: 'Tìm ƯCLN(36, 60).', en: 'Find GCD(36, 60).' },
        frames: (L) => derivation([
          `36 = ${hl('2²')} · ${hl('3²', 'b')}`,
          `60 = ${hl('2²')} · ${hl('3', 'b')} · 5`,
          `${T(L, 'Thừa số chung: 2 và 3 (5 không chung)', 'Common primes: 2 and 3 (5 is not common)')}`,
          `${sym(L, 'UCLN')}(36, 60) = 2² · 3 = <b>12</b> <span class="note">${T(L, 'số mũ nhỏ nhất', 'smallest exponents')}</span>`,
        ]),
      },
    },
    {
      title: { vi: 'Phân số tối giản', en: 'Fractions in lowest terms' },
      theory: {
        vi: [
          `Phân số ${frac('a', 'b')} là <b>tối giản</b> nếu ${sym('vi', 'UCLN')}(a, b) = 1.`,
          `Để rút gọn về phân số tối giản: chia cả tử và mẫu cho ${sym('vi', 'UCLN')} của chúng.`,
        ],
        en: [
          `The fraction ${frac('a', 'b')} is in <b>lowest terms</b> if ${sym('en', 'UCLN')}(a, b) = 1.`,
          'To simplify fully, divide the numerator and denominator by their GCD.',
        ],
      },
      example: {
        caption: { vi: `Rút gọn ${frac(24, 36)}.`, en: `Simplify ${frac(24, 36)}.` },
        frames: (L) => derivation([
          frac(24, 36),
          `${sym(L, 'UCLN')}(24, 36) = 12`,
          `${frac(24, 36)} = ${frac('24 : 12', '36 : 12')} = <b>${frac(2, 3)}</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // GCD of two numbers.
    () => {
      const [a, b] = gcdPair();
      const g = gcd(a, b);
      return input(
        bi((L) => `${T(L, 'Tìm', 'Find')} ${eq(`${sym(L, 'UCLN')}(${a}, ${b})`)}`),
        g,
        bi((L) => `${a} = ${factorHtml(factorize(a))}; ${b} = ${factorHtml(factorize(b))} ⇒ ${sym(L, 'UCLN')} = ${factorHtml(factorize(g))} = ${g}`),
      );
    },
    // The set of common divisors.
    () => {
      for (;;) {
        const [a, b] = gcdPair(12);
        const g = gcd(a, b);
        const correct = divisors(g);
        const notCommon = divisors(a).find((d) => b % d !== 0);
        const lists = [
          correct,
          divisors(g).filter((d) => d !== 1),
          [...divisors(g), notCommon].sort((x, y) => x - y),
          divisors(Math.min(a, b)),
        ];
        if (new Set(lists.map((l) => l.join())).size < 4) continue; // small pairs can repeat a list
        const set = (arr) => bi((L) => setOf(arr, L));
        return choice(
          bi((L) => `${eq(`${sym(L, 'UC')}(${a}, ${b})`)} = ?`),
          set(correct),
          lists.slice(1).map(set),
          bi((L) => `${sym(L, 'UCLN')}(${a}, ${b}) = ${g} ⇒ ${sym(L, 'UC')}(${a}, ${b}) = ${sym(L, 'U')}(${g}) = ${setOf(correct, L)}`),
        );
      }
    },
    // Simplify a fraction.
    () => {
      const [a, b] = gcdPair();
      const g = gcd(a, b);
      const [x, y] = [a / g, b / g];
      const half = [2, 3, 5].find((d) => g % d === 0 && d < g);
      const wrongs = [
        half ? frac(a / half, b / half) : frac(x + 1, y),
        frac(y, x),
        frac(x, y + 1),
      ];
      return choice(
        bi((L) => T(L, `Rút gọn ${frac(a, b)} về phân số tối giản:`, `Simplify ${frac(a, b)} to lowest terms:`)),
        frac(x, y),
        wrongs,
        bi((L) => `${sym(L, 'UCLN')}(${a}, ${b}) = ${g} ⇒ ${frac(a, b)} = ${frac(`${a} : ${g}`, `${b} : ${g}`)} = ${frac(x, y)}`),
      );
    },
    // Sharing into the most equal bags.
    () => {
      const [a, b] = gcdPair(12);
      const g = gcd(a, b);
      return input(
        bi((L) => T(L, `Có ${a} quyển vở và ${b} chiếc bút. Chia đều số vở và số bút vào các phần quà như nhau. Chia được nhiều nhất bao nhiêu phần quà?`, `There are ${a} notebooks and ${b} pens. They are shared equally into identical gift bags. What is the largest number of bags?`)),
        g,
        bi((L) => T(L, `Số phần quà là ước chung lớn nhất: ${sym(L, 'UCLN')}(${a}, ${b}) = ${g}. Mỗi phần có ${a / g} vở và ${b / g} bút.`, `The number of bags is the GCD: ${sym(L, 'UCLN')}(${a}, ${b}) = ${g}. Each bag holds ${a / g} notebooks and ${b / g} pens.`)),
      );
    },
    // GCD of three numbers.
    () => {
      for (;;) {
        const g = int(2, 12);
        const [x, y, z] = distinct(3, 2, 12);
        if (gcd(gcd(x, y), z) !== 1 || g * Math.max(x, y, z) > 150) continue;
        const [a, b, c] = [g * x, g * y, g * z];
        return input(
          bi((L) => `${T(L, 'Tìm', 'Find')} ${eq(`${sym(L, 'UCLN')}(${a}, ${b}, ${c})`)}`),
          g,
          bi((L) => `${a} = ${factorHtml(factorize(a))}; ${b} = ${factorHtml(factorize(b))}; ${c} = ${factorHtml(factorize(c))} ⇒ ${sym(L, 'UCLN')} = ${g}`),
        );
      }
    },
  ],
};

// ---------- Bài 12. Bội chung. Bội chung nhỏ nhất ----------

// Two numbers sharing a factor, neither dividing the other, so that
// BCNN is neither their product nor the larger number.
function lcmPair() {
  for (;;) {
    const [a, b] = distinct(2, 4, 30);
    const m = lcm(a, b);
    if (m <= 200 && m !== a * b && a % b && b % a) return [a, b];
  }
}

const lesson12 = {
  id: 'c2b12',
  number: 12,
  title: { vi: 'Bội chung. Bội chung nhỏ nhất', en: 'Common multiples. Least common multiple' },
  points: [
    {
      title: { vi: 'Bội chung và bội chung nhỏ nhất', en: 'Common multiples and the LCM' },
      theory: {
        vi: [
          `<b>Bội chung</b> của hai hay nhiều số là số vừa là bội của tất cả các số đó. Kí hiệu ${sym('vi', 'BC')}(a, b).`,
          `<b>Bội chung nhỏ nhất</b> là số nhỏ nhất <b>khác 0</b> trong tập hợp các bội chung, kí hiệu ${sym('vi', 'BCNN')}(a, b).`,
          `Các bội chung đều là bội của ${sym('vi', 'BCNN')}: ${sym('vi', 'BC')}(a, b) = ${sym('vi', 'B')}(${sym('vi', 'BCNN')}(a, b)).`,
          `Nếu a ${DIV} b thì ${sym('vi', 'BCNN')}(a, b) = a. Nếu a, b nguyên tố cùng nhau thì ${sym('vi', 'BCNN')}(a, b) = a · b.`,
        ],
        en: [
          `A <b>common multiple</b> of two or more numbers is a multiple of all of them. The set is written ${sym('en', 'BC')}(a, b).`,
          `The <b>least common multiple</b> is the smallest <b>non-zero</b> common multiple, written ${sym('en', 'BCNN')}(a, b).`,
          `Every common multiple is a multiple of the LCM: ${sym('en', 'BC')}(a, b) = ${sym('en', 'B')}(${sym('en', 'BCNN')}(a, b)).`,
          `If a ${DIV} b then ${sym('en', 'BCNN')}(a, b) = a. If a and b are coprime, ${sym('en', 'BCNN')}(a, b) = a · b.`,
        ],
      },
      example: {
        caption: { vi: 'Tìm các bội chung của 4 và 6.', en: 'Find the common multiples of 4 and 6.' },
        frames: (L) => {
          const rows = [
            { label: `${sym(L, 'B')}(4)`, items: range(0, 9).map((k) => 4 * k) },
            { label: `${sym(L, 'B')}(6)`, items: range(0, 6).map((k) => 6 * k) },
          ];
          const common = [0, 12, 24, 36];
          return [
            chipRows({ rows: rows.slice(0, 1), newRow: 0 }),
            chipRows({ rows, newRow: 1 }),
            chipRows({ rows, common, showCommon: true }) + cap(`${sym(L, 'BC')}(4, 6) = ${setOf([0, 12, 24, 36, '…'], L)}`, true),
            chipRows({ rows, common, showCommon: true }) + cap(`${sym(L, 'BC')}(4, 6) = ${setOf([0, 12, 24, 36, '…'], L)}`)
              + cap(`${sym(L, 'BCNN')}(4, 6) = 12`, true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Tìm BCNN bằng cách phân tích ra thừa số nguyên tố', en: 'Finding the LCM by prime factorisation' },
      theory: {
        vi: [
          '<b>Bước 1:</b> Phân tích mỗi số ra thừa số nguyên tố.',
          '<b>Bước 2:</b> Chọn các thừa số nguyên tố <b>chung và riêng</b>.',
          '<b>Bước 3:</b> Lập tích các thừa số đã chọn, mỗi thừa số lấy với số mũ <b>lớn nhất</b>.',
        ],
        en: [
          '<b>Step 1:</b> Factorise each number into primes.',
          '<b>Step 2:</b> Pick <b>all</b> the primes that appear (common and not common).',
          '<b>Step 3:</b> Multiply them, each with its <b>largest</b> exponent.',
        ],
      },
      example: {
        caption: { vi: 'Tìm BCNN(12, 18).', en: 'Find LCM(12, 18).' },
        frames: (L) => derivation([
          `12 = ${hl('2²')} · 3`,
          `18 = 2 · ${hl('3²', 'b')}`,
          T(L, 'Thừa số chung và riêng: 2 và 3', 'All primes that appear: 2 and 3'),
          `${sym(L, 'BCNN')}(12, 18) = 2² · 3² = <b>36</b> <span class="note">${T(L, 'số mũ lớn nhất', 'largest exponents')}</span>`,
        ]),
      },
    },
    {
      title: { vi: 'Quy đồng mẫu, cộng và trừ phân số', en: 'Common denominators, adding and subtracting fractions' },
      theory: {
        vi: [
          'Để quy đồng mẫu các phân số, lấy <b>mẫu số chung là BCNN của các mẫu</b>.',
          'Nhân cả tử và mẫu của mỗi phân số với thừa số phụ (mẫu chung : mẫu cũ), rồi cộng hoặc trừ các tử số.',
        ],
        en: [
          'To give fractions a common denominator, use <b>the LCM of the denominators</b>.',
          'Multiply the top and bottom of each fraction by the factor (common denominator : old denominator), then add or subtract the numerators.',
        ],
      },
      example: {
        caption: { vi: `Tính ${frac(5, 12)} + ${frac(7, 18)}.`, en: `Work out ${frac(5, 12)} + ${frac(7, 18)}.` },
        frames: (L) => derivation([
          `${frac(5, 12)} + ${frac(7, 18)}`,
          `${T(L, 'Mẫu chung', 'Common denominator')}: ${sym(L, 'BCNN')}(12, 18) = 36`,
          `= ${frac(`5 · ${hl('3')}`, `12 · ${hl('3')}`)} + ${frac(`7 · ${hl('2', 'b')}`, `18 · ${hl('2', 'b')}`)}`,
          `= ${frac(15, 36)} + ${frac(14, 36)} = <b>${frac(29, 36)}</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // LCM of two numbers.
    () => {
      const [a, b] = lcmPair();
      const m = lcm(a, b);
      return input(
        bi((L) => `${T(L, 'Tìm', 'Find')} ${eq(`${sym(L, 'BCNN')}(${a}, ${b})`)}`),
        m,
        bi((L) => `${a} = ${factorHtml(factorize(a))}; ${b} = ${factorHtml(factorize(b))} ⇒ ${sym(L, 'BCNN')} = ${factorHtml(factorize(m))} = ${m}`),
      );
    },
    // LCM of three numbers.
    () => {
      for (;;) {
        const [a, b, c] = distinct(3, 2, 15);
        const m = lcm(lcm(a, b), c);
        if (m > 240 || m === a * b * c) continue;
        return input(
          bi((L) => `${T(L, 'Tìm', 'Find')} ${eq(`${sym(L, 'BCNN')}(${a}, ${b}, ${c})`)}`),
          m,
          bi((L) => `${a} = ${factorHtml(factorize(a))}; ${b} = ${factorHtml(factorize(b))}; ${c} = ${factorHtml(factorize(c))} ⇒ ${sym(L, 'BCNN')} = ${factorHtml(factorize(m))} = ${m}`),
        );
      }
    },
    // The first common multiples.
    () => {
      const [a, b] = lcmPair();
      const m = lcm(a, b);
      const list = (k) => bi((L) => setOf([0, k, 2 * k, 3 * k, '…'], L));
      return choice(
        bi((L) => `${eq(`${sym(L, 'BC')}(${a}, ${b})`)} = ?`),
        list(m),
        [list(a * b), list(Math.max(a, b)), list(Math.min(a, b))],
        bi((L) => `${sym(L, 'BCNN')}(${a}, ${b}) = ${m} ⇒ ${sym(L, 'BC')}(${a}, ${b}) = ${sym(L, 'B')}(${m})`),
      );
    },
    // Two lights flashing together.
    () => {
      const [a, b] = lcmPair();
      const m = lcm(a, b);
      return input(
        bi((L) => T(L, `Đèn đỏ cứ ${a} giây nháy một lần, đèn xanh cứ ${b} giây nháy một lần. Hai đèn vừa cùng nháy. Sau ít nhất bao nhiêu giây chúng lại cùng nháy?`, `A red light flashes every ${a} seconds and a green light every ${b} seconds. They have just flashed together. After how many seconds, at least, will they flash together again?`)),
        m,
        bi((L) => T(L, `Thời gian cần tìm là ${sym(L, 'BCNN')}(${a}, ${b}) = ${m} giây.`, `The time is ${sym(L, 'BCNN')}(${a}, ${b}) = ${m} seconds.`)),
      );
    },
    // Add or subtract fractions.
    () => {
      for (;;) {
        const [m, n] = distinct(2, 3, 18);
        const d = lcm(m, n);
        if (d === m * n || d > 72) continue;
        const [x, y] = [int(1, m - 1), int(1, n - 1)];
        const plus = Math.random() < 0.6 || x * (d / m) <= y * (d / n);
        const top = plus ? x * (d / m) + y * (d / n) : x * (d / m) - y * (d / n);
        const g = gcd(top, d);
        const result = frac(top / g, d / g);
        const op = plus ? '+' : '−';
        const wrongs = [frac(plus ? x + y : Math.abs(x - y), m + n), frac(top, m * n), frac(top / g + 1, d / g)];
        if (new Set([result, ...wrongs]).size < 4) continue;
        return choice(
          bi((L) => `${T(L, 'Tính', 'Work out')} ${frac(x, m)} ${op} ${frac(y, n)}`),
          result,
          wrongs,
          bi((L) => `${T(L, 'Mẫu chung', 'Common denominator')} ${sym(L, 'BCNN')}(${m}, ${n}) = ${d}: ${frac(x * (d / m), d)} ${op} ${frac(y * (d / n), d)} = ${frac(top, d)}${g > 1 ? ` = ${result}` : ''}`),
        );
      }
    },
  ],
};

export const CHAPTER2 = [lesson8, lesson9, lesson10, lesson11, lesson12];
