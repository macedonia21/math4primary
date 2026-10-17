// Grade 6, Chapter II: advanced ("nâng cao") exercises. Problem types common
// in Grade 6 enrichment material (divisibility of n + c by n, remainders by
// 9, numbers of divisors, sums of primes, GCD with remainders, lining up
// students), with original wording and randomly generated numbers.

import {
  bi, T, fmt, setOf, int, pick, shuffle, distinct, choice, input,
  gcd, lcm, divisors, isPrime, primesBelow, factorize, factorHtml, frac, DIV, sym,
} from './util.js';

const eq = (html) => `<span class="eq">${html}</span>`;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const digitSum = (n) => [...String(n)].reduce((s, d) => s + Number(d), 0);
const RICH = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 72, 80, 84, 90, 96, 100];
const PRIME = { vi: 'Số nguyên tố', en: 'Prime' };
const COMPOSITE = { vi: 'Hợp số', en: 'Composite' };

// ---------- Bài 8 ----------

const lesson8 = [
  // (n + c) ⋮ n.
  () => {
    const c = pick(RICH);
    const ds = divisors(c);
    return input(
      bi((L) => T(L, `Có bao nhiêu số tự nhiên n khác 0 để ${eq(`(n + ${c}) ${DIV} n`)}?`, `How many non-zero natural numbers n make ${eq(`(n + ${c}) ${DIV} n`)}?`)),
      ds.length,
      bi((L) => T(L, `Vì n ${DIV} n nên cần ${c} ${DIV} n, tức n ∈ ${sym(L, 'U')}(${c}) = ${setOf(ds, L)}: ${ds.length} số.`, `Since n ${DIV} n, we need ${c} ${DIV} n, so n ∈ ${sym(L, 'U')}(${c}) = ${setOf(ds, L)}: ${ds.length} numbers.`)),
    );
  },
  // (n + c) ⋮ (n + 1).
  () => {
    const r = pick(RICH);
    const c = r + 1;
    const ds = divisors(r);
    return input(
      bi((L) => T(L, `Có bao nhiêu số tự nhiên n để ${eq(`(n + ${c}) ${DIV} (n + 1)`)}?`, `How many natural numbers n make ${eq(`(n + ${c}) ${DIV} (n + 1)`)}?`)),
      ds.length,
      bi((L) => T(L, `n + ${c} = (n + 1) + ${r}. Vì (n + 1) ${DIV} (n + 1) nên cần ${r} ${DIV} (n + 1): n + 1 ∈ ${setOf(ds, L)}, có ${ds.length} giá trị của n.`, `n + ${c} = (n + 1) + ${r}. Since (n + 1) ${DIV} (n + 1), we need ${r} ${DIV} (n + 1): n + 1 ∈ ${setOf(ds, L)}, giving ${ds.length} values of n.`)),
    );
  },
  // Two-digit multiples.
  () => {
    const k = int(3, 19);
    const count = Math.floor(99 / k) - Math.floor(9 / k);
    const first = k * (Math.floor(9 / k) + 1);
    const last = k * Math.floor(99 / k);
    return input(
      bi((L) => T(L, `Có bao nhiêu số có hai chữ số là bội của ${k}?`, `How many two-digit numbers are multiples of ${k}?`)),
      count,
      bi((L) => T(L, `Bội nhỏ nhất có hai chữ số là ${first}, lớn nhất là ${last}: (${last} − ${first}) : ${k} + 1 = ${count}.`, `The smallest two-digit multiple is ${first}, the largest ${last}: (${last} − ${first}) : ${k} + 1 = ${count}.`)),
    );
  },
  // Choose x so that the sum is divisible by m.
  () => {
    const m = pick([3, 4, 5, 6, 7, 9]);
    const a = m * int(3, 20) + int(0, m - 1);
    const b = m * int(3, 20) + int(0, m - 1);
    const need = (m - ((a + b) % m)) % m;
    const x = need + m * int(1, 6);
    const wrongs = new Set();
    while (wrongs.size < 3) { const w = x + int(1, m - 1) * pick([1, -1]); if (w > 0 && (a + b + w) % m) wrongs.add(w); }
    return choice(
      bi((L) => T(L, `Chọn x để ${eq(`${a} + ${b} + x`)} chia hết cho ${m}.`, `Choose x so that ${eq(`${a} + ${b} + x`)} is divisible by ${m}.`)),
      x,
      [...wrongs],
      bi((L) => T(L, `${a} + ${b} = ${a + b} chia ${m} dư ${(a + b) % m}, nên x phải chia ${m} dư ${need}: x = ${x}.`, `${a} + ${b} = ${a + b} leaves remainder ${(a + b) % m} on division by ${m}, so x must leave ${need}: x = ${x}.`)),
    );
  },
];

// ---------- Bài 9 ----------

const COMBOS = [[[2, 5], 10], [[2, 3], 6], [[3, 5], 15], [[2, 9], 18], [[5, 9], 45], [[2, 3, 5], 30], [[2, 5, 9], 90]];
const and = (L, list) => list.join(T(L, ' và ', ' and '));

const lesson9 = [
  // Remainder when divided by 9 or 3.
  () => {
    const k = pick([3, 9]);
    const n = int(1000000, 99999999);
    const s = digitSum(n);
    return input(
      bi((L) => T(L, `Tìm số dư khi chia ${fmt(n, L)} cho ${k}.`, `Find the remainder when ${fmt(n, L)} is divided by ${k}.`)),
      n % k,
      bi((L) => T(L, `Một số và tổng các chữ số của nó có cùng số dư khi chia cho ${k}. Tổng các chữ số là ${s}; ${s} chia ${k} dư ${s % k}.`, `A number and its digit sum leave the same remainder on division by ${k}. The digit sum is ${s}, and ${s} leaves ${s % k}.`)),
    );
  },
  // Count three-digit numbers divisible by several numbers.
  () => {
    const [list, l] = pick(COMBOS);
    const count = Math.floor(999 / l) - Math.floor(99 / l);
    const first = l * Math.ceil(100 / l);
    return input(
      bi((L) => T(L, `Có bao nhiêu số có ba chữ số chia hết cho ${and(L, list)}?`, `How many three-digit numbers are divisible by ${and(L, list)}?`)),
      count,
      bi((L) => T(L, `Chia hết cho ${and(L, list)} nghĩa là chia hết cho ${l}. Các số đó: ${first}; ${first + l}; …; ${l * Math.floor(999 / l)} — ${count} số.`, `Divisible by ${and(L, list)} means divisible by ${l}. They are ${first}, ${first + l}, …, ${l * Math.floor(999 / l)} — ${count} numbers.`)),
    );
  },
  // Smallest / largest four-digit number divisible by several numbers.
  () => {
    const [list, l] = pick(COMBOS);
    const largest = Math.random() < 0.5;
    const n = largest ? l * Math.floor(9999 / l) : l * Math.ceil(1000 / l);
    return input(
      bi((L) => T(L, `Tìm số <b>${largest ? 'lớn' : 'nhỏ'} nhất</b> có bốn chữ số chia hết cho ${and(L, list)}.`, `Find the <b>${largest ? 'largest' : 'smallest'}</b> four-digit number divisible by ${and(L, list)}.`)),
      n,
      bi((L) => T(L, `Số đó chia hết cho ${l}: ${fmt(n, L)} = ${l} · ${n / l}.`, `It must be a multiple of ${l}: ${fmt(n, L)} = ${l} · ${n / l}.`)),
    );
  },
  // Two missing digits, divisible by 2, 5 and 3 or 9.
  () => {
    for (;;) {
      const k = pick([3, 9]);
      const digits = [int(1, 9), int(0, 9), int(0, 9), 0];
      const pos = int(1, 2);
      const known = digits.filter((_, i) => i !== pos && i !== 3).reduce((a, b) => a + b, 0);
      const a = range(0, 9).find((d) => (known + d) % k === 0);
      if (a === undefined) continue;
      const shown = digits.map((d, i) => (i === pos ? '<span class="blank">a</span>' : i === 3 ? '<span class="blank">b</span>' : d)).join('');
      digits[pos] = a;
      const n = Number(digits.join(''));
      return input(
        bi((L) => T(L, `Tìm số nhỏ nhất dạng ${eq(shown)} chia hết cho cả 2, 5 và ${k}. Viết số đó.`, `Find the smallest number of the form ${eq(shown)} divisible by 2, 5 and ${k}. Write the number.`)),
        n,
        bi((L) => T(L, `Chia hết cho 2 và 5 ⇒ b = 0. Tổng các chữ số ${known} + a phải chia hết cho ${k} ⇒ a nhỏ nhất là ${a}. Số đó là ${fmt(n, L)}.`, `Divisible by 2 and 5 ⇒ b = 0. The digit sum ${known} + a must be divisible by ${k} ⇒ the smallest a is ${a}. The number is ${fmt(n, L)}.`)),
      );
    }
  },
];

// ---------- Bài 10 ----------

const PRIMES = primesBelow(200);

const lesson10 = [
  // Sum of two primes is odd.
  () => {
    const p = pick(PRIMES.filter((v) => v > 10 && v < 150));
    const S = p + 2;
    return input(
      bi((L) => T(L, `Tổng của hai số nguyên tố bằng ${S}. Tìm số nguyên tố lớn hơn.`, `Two primes add up to ${S}. Find the larger one.`)),
      p,
      bi((L) => T(L, `${S} là số lẻ, nên một số chẵn và một số lẻ. Số nguyên tố chẵn duy nhất là 2, nên số kia là ${S} − 2 = ${p}.`, `${S} is odd, so one prime is even and one is odd. The only even prime is 2, so the other is ${S} − 2 = ${p}.`)),
    );
  },
  // Number of divisors from the factorisation.
  () => {
    const ps = shuffle([2, 3, 5, 7]).slice(0, int(2, 3)).sort((a, b) => a - b);
    const f = ps.map((p) => [p, int(1, 4)]);
    const count = f.reduce((acc, [, e]) => acc * (e + 1), 1);
    return input(
      bi((L) => T(L, `Số ${eq(`n = ${factorHtml(f)}`)} có bao nhiêu ước?`, `How many divisors does ${eq(`n = ${factorHtml(f)}`)} have?`)),
      count,
      bi((L) => T(L, `Nếu n = ${factorHtml([['a', 'x'], ['b', 'y']])} · … thì số ước là (x + 1)(y + 1)…: ${f.map(([, e]) => `(${e} + 1)`).join(' · ')} = ${count}.`, `If n = ${factorHtml([['a', 'x'], ['b', 'y']])} · …, it has (x + 1)(y + 1)… divisors: ${f.map(([, e]) => `(${e} + 1)`).join(' · ')} = ${count}.`)),
    );
  },
  // Product of two consecutive primes.
  () => {
    const i = int(2, 14);
    const [p, q] = [PRIMES[i], PRIMES[i + 1]];
    return input(
      bi((L) => T(L, `Tích của hai số nguyên tố liên tiếp là ${fmt(p * q, L)}. Tìm số lớn hơn.`, `The product of two consecutive primes is ${fmt(p * q, L)}. Find the larger one.`)),
      q,
      bi((L) => `${fmt(p * q, L)} = ${p} · ${q}`),
    );
  },
  // Prime or composite, without a calculator.
  () => {
    for (;;) {
      if (Math.random() < 0.5) {
        const p = pick([2, 3, 5, 7]);
        const [x, y] = [p * int(2, 9), p * int(2, 9)];
        const [u, v] = [int(2, 9), int(2, 9)];
        const value = x * u + y * v;
        return choice(
          bi((L) => T(L, `Giá trị của ${eq(`${x} · ${u} + ${y} · ${v}`)} là số nguyên tố hay hợp số?`, `Is ${eq(`${x} · ${u} + ${y} · ${v}`)} prime or composite?`)),
          COMPOSITE,
          [PRIME],
          bi((L) => T(L, `${x} ${DIV} ${p} và ${y} ${DIV} ${p} nên tổng chia hết cho ${p} và lớn hơn ${p}: hợp số (= ${value}).`, `${x} ${DIV} ${p} and ${y} ${DIV} ${p}, so the sum is divisible by ${p} and bigger than ${p}: composite (= ${value}).`)),
        );
      }
      const [a, b, c] = [int(2, 9), int(2, 9), int(1, 40)];
      const value = a * b + c;
      if (!isPrime(value)) continue;
      const checked = PRIMES.filter((p) => p * p <= value);
      return choice(
        bi((L) => T(L, `Giá trị của ${eq(`${a} · ${b} + ${c}`)} là số nguyên tố hay hợp số?`, `Is ${eq(`${a} · ${b} + ${c}`)} prime or composite?`)),
        PRIME,
        [COMPOSITE],
        bi((L) => T(L, `${a} · ${b} + ${c} = ${value}. ${value} không chia hết cho ${checked.join(', ')} (các số nguyên tố p có p · p ≤ ${value}) nên là số nguyên tố.`, `${a} · ${b} + ${c} = ${value}. It is not divisible by ${checked.join(', ')} (the primes p with p · p ≤ ${value}), so it is prime.`)),
      );
    }
  },
];

// ---------- Bài 11 ----------

const lesson11 = [
  // Largest divisor leaving given remainders.
  () => {
    for (;;) {
      const a = int(6, 30);
      const [r1, r2] = [int(1, a - 1), int(0, a - 1)];
      const [q1, q2] = distinct(2, 2, 12);
      const [m, n] = [a * q1 + r1, a * q2 + r2];
      const g = gcd(m - r1, n - r2);
      if (g > 60) continue;
      return input(
        bi((L) => T(L, `Tìm số tự nhiên a lớn nhất sao cho ${m} chia cho a dư ${r1} và ${n} chia cho a dư ${r2}.`, `Find the largest natural number a such that ${m} divided by a leaves ${r1} and ${n} divided by a leaves ${r2}.`)),
        g,
        bi((L) => T(L, `Khi đó ${m} − ${r1} = ${m - r1} và ${n} − ${r2} = ${n - r2} đều chia hết cho a, nên a = ${sym(L, 'UCLN')}(${m - r1}, ${n - r2}) = ${g} (và ${g} lớn hơn các số dư).`, `Then ${m} − ${r1} = ${m - r1} and ${n} − ${r2} = ${n - r2} are both divisible by a, so a = ${sym(L, 'UCLN')}(${m - r1}, ${n - r2}) = ${g} (bigger than both remainders).`)),
      );
    }
  },
  // Teams with equal numbers of boys and girls.
  () => {
    const g = int(3, 9);
    const [x, y] = (() => { for (;;) { const [p, q] = distinct(2, 2, 9); if (gcd(p, q) === 1) return [p, q]; } })();
    const [boys, girls] = [g * x, g * y];
    const askBoys = Math.random() < 0.5;
    return input(
      bi((L) => T(L, `Lớp có ${boys} bạn nam và ${girls} bạn nữ, chia thành nhiều tổ nhất sao cho số nam và số nữ ở các tổ đều bằng nhau. Mỗi tổ có bao nhiêu bạn ${askBoys ? 'nam' : 'nữ'}?`, `A class of ${boys} boys and ${girls} girls is split into as many teams as possible, each with the same numbers of boys and of girls. How many ${askBoys ? 'boys' : 'girls'} are in each team?`)),
      askBoys ? x : y,
      bi((L) => T(L, `Số tổ nhiều nhất là ${sym(L, 'UCLN')}(${boys}, ${girls}) = ${g}. Mỗi tổ có ${boys} : ${g} = ${x} nam và ${girls} : ${g} = ${y} nữ.`, `The most teams is ${sym(L, 'UCLN')}(${boys}, ${girls}) = ${g}. Each team has ${boys} : ${g} = ${x} boys and ${girls} : ${g} = ${y} girls.`)),
    );
  },
  // Largest square tiles.
  () => {
    const g = int(2, 15);
    const [x, y] = (() => { for (;;) { const [p, q] = distinct(2, 2, 9); if (gcd(p, q) === 1) return [p, q]; } })();
    const [w, h] = [g * x, g * y];
    const askCount = Math.random() < 0.5;
    return input(
      bi((L) => T(L, `Một tấm bìa hình chữ nhật ${w} cm × ${h} cm được cắt thành các hình vuông bằng nhau, lớn nhất có thể, không thừa mảnh nào. ${askCount ? 'Cắt được bao nhiêu hình vuông?' : 'Cạnh hình vuông dài bao nhiêu xăng-ti-mét?'}`, `A ${w} cm × ${h} cm card is cut into equal squares, as large as possible, with nothing left over. ${askCount ? 'How many squares are there?' : 'How long is the side of each square, in cm?'}`)),
      askCount ? x * y : g,
      bi((L) => T(L, `Cạnh hình vuông = ${sym(L, 'UCLN')}(${w}, ${h}) = ${g} cm. Số hình vuông: (${w} : ${g}) · (${h} : ${g}) = ${x} · ${y} = ${x * y}.`, `Side = ${sym(L, 'UCLN')}(${w}, ${h}) = ${g} cm. Number of squares: (${w} : ${g}) · (${h} : ${g}) = ${x} · ${y} = ${x * y}.`)),
    );
  },
  // Simplify a large fraction.
  () => {
    const g = int(6, 40);
    const [x, y] = (() => { for (;;) { const [p, q] = distinct(2, 2, 25); if (gcd(p, q) === 1 && p < q) return [p, q]; } })();
    const [a, b] = [g * x, g * y];
    return input(
      bi((L) => T(L, `Rút gọn ${frac(a, b)} về phân số tối giản. Tử số của phân số tối giản là bao nhiêu?`, `Simplify ${frac(a, b)} to lowest terms. What is the new numerator?`)),
      x,
      bi((L) => `${a} = ${factorHtml(factorize(a))}, ${b} = ${factorHtml(factorize(b))} ⇒ ${sym(L, 'UCLN')} = ${g} ⇒ ${frac(a, b)} = ${frac(x, y)}`),
    );
  },
];

// ---------- Bài 12 ----------

function lineUp(withRest) {
  for (;;) {
    const [a, b, c] = distinct(3, 2, 12);
    const m = lcm(lcm(a, b), c);
    if (m < 12 || m > 90) continue;
    const rest = withRest ? int(1, Math.min(a, b, c) - 1) : 0;
    if (withRest && rest < 1) continue;
    const k = int(3, Math.floor(450 / m));
    const n = m * k + rest;
    const lo = n - int(1, m - 1);
    const hi = lo + m - 1;
    return { a, b, c, m, rest, n, lo, hi };
  }
}

const lesson12 = [
  // Lining up exactly.
  () => {
    const { a, b, c, m, n, lo, hi } = lineUp(false);
    return input(
      bi((L) => T(L, `Số học sinh của một trường trong khoảng từ ${lo} đến ${hi}. Khi xếp hàng ${a}, hàng ${b}, hàng ${c} đều vừa đủ. Trường có bao nhiêu học sinh?`, `A school has between ${lo} and ${hi} students. Lined up in rows of ${a}, ${b} or ${c}, there is never anyone left over. How many students are there?`)),
      n,
      bi((L) => T(L, `Số học sinh là bội chung của ${a}, ${b}, ${c}, tức là bội của ${sym(L, 'BCNN')} = ${m}. Bội của ${m} trong khoảng đã cho là ${n}.`, `The number is a common multiple of ${a}, ${b} and ${c}, so a multiple of ${sym(L, 'BCNN')} = ${m}. The only one in range is ${n}.`)),
    );
  },
  // Lining up with the same remainder.
  () => {
    const { a, b, c, m, rest, n, lo, hi } = lineUp(true);
    return input(
      bi((L) => T(L, `Một đội đồng diễn có từ ${lo} đến ${hi} người. Khi xếp hàng ${a}, hàng ${b}, hàng ${c} đều thừa ${rest} người. Đội có bao nhiêu người?`, `A display team has between ${lo} and ${hi} people. In rows of ${a}, ${b} or ${c}, there are always ${rest} left over. How many people are on the team?`)),
      n,
      bi((L) => T(L, `Bớt ${rest} người thì xếp vừa đủ: số người − ${rest} là bội của ${sym(L, 'BCNN')}(${a}, ${b}, ${c}) = ${m}. Vậy số người là ${n - rest} + ${rest} = ${n}.`, `Without ${rest} people the rows are exact: (people − ${rest}) is a multiple of ${sym(L, 'BCNN')}(${a}, ${b}, ${c}) = ${m}. So there are ${n - rest} + ${rest} = ${n} people.`)),
    );
  },
  // GCD · LCM = product.
  () => {
    const d = int(2, 12);
    const [p, q] = (() => { for (;;) { const [x, y] = distinct(2, 2, 11); if (gcd(x, y) === 1) return [x, y]; } })();
    const [a, b] = [d * p, d * q];
    const m = d * p * q;
    return input(
      bi((L) => T(L, `Hai số có ${sym(L, 'UCLN')} là ${d} và ${sym(L, 'BCNN')} là ${m}. Một số là ${a}. Tìm số kia.`, `Two numbers have ${sym(L, 'UCLN')} ${d} and ${sym(L, 'BCNN')} ${m}. One of them is ${a}. Find the other.`)),
      b,
      bi((L) => T(L, `Tích hai số bằng tích ${sym(L, 'UCLN')} và ${sym(L, 'BCNN')}: ${a} · x = ${d} · ${m} = ${d * m} ⇒ x = ${d * m} : ${a} = ${b}.`, `The product of the numbers equals ${sym(L, 'UCLN')} · ${sym(L, 'BCNN')}: ${a} · x = ${d} · ${m} = ${d * m} ⇒ x = ${d * m} : ${a} = ${b}.`)),
    );
  },
  // Three fractions.
  () => {
    for (;;) {
      const [m, n, p] = distinct(3, 2, 12);
      const d = lcm(lcm(m, n), p);
      if (d > 60 || d === m * n * p) continue;
      const [x, y, z] = [int(1, m - 1), int(1, n - 1), int(1, p - 1)];
      const top = x * (d / m) + y * (d / n) - z * (d / p);
      if (top <= 0) continue;
      const g = gcd(top, d);
      const result = frac(top / g, d / g);
      const wrongs = [frac(x + y - z > 0 ? x + y - z : x + y + z, m + n + p), frac(top + 2 * z * (d / p), d), frac(top / g + 1, d / g)];
      if (new Set([result, ...wrongs]).size < 4) continue;
      return choice(
        bi((L) => `${T(L, 'Tính', 'Work out')} ${frac(x, m)} + ${frac(y, n)} − ${frac(z, p)}`),
        result,
        wrongs,
        bi((L) => `${T(L, 'Mẫu chung', 'Common denominator')} ${sym(L, 'BCNN')}(${m}, ${n}, ${p}) = ${d}: ${frac(x * (d / m), d)} + ${frac(y * (d / n), d)} − ${frac(z * (d / p), d)} = ${frac(top, d)}${g > 1 ? ` = ${result}` : ''}`),
      );
    }
  },
];

export const ADVANCED2 = {
  c2b8: lesson8, c2b9: lesson9, c2b10: lesson10, c2b11: lesson11, c2b12: lesson12,
};
