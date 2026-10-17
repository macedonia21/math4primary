// Grade 6, Chapter I: advanced ("nâng cao") exercises. These follow problem
// types common in Vietnamese Grade 6 enrichment material (arithmetic series,
// page numbering, last digits of powers, comparing powers, nested "find x"),
// with original wording and randomly generated numbers.

import {
  bi, T, fmt, setOf, pw, int, pick, shuffle, distinct, choice, input,
} from './util.js';

const eq = (html) => `<span class="eq">${html}</span>`;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Digits needed to write every number from 1 to n.
function digitsUpTo(n) {
  let total = 0;
  for (let len = 1, start = 1; start <= n; len++, start *= 10) {
    total += (Math.min(n, start * 10 - 1) - start + 1) * len;
  }
  return total;
}

// ---------- Bài 1. Tập hợp ----------

const lesson1 = [
  // Elements of an evenly spaced set.
  () => {
    const a = int(1, 20);
    const d = int(2, 7);
    const count = int(10, 60);
    const b = a + d * (count - 1);
    return input(
      bi((L) => T(L, `Tập hợp A = {${a}; ${a + d}; ${a + 2 * d}; …; ${fmt(b, L)}} có bao nhiêu phần tử?`, `How many elements does A = {${a}, ${a + d}, ${a + 2 * d}, …, ${fmt(b, L)}} have?`)),
      count,
      bi((L) => T(L, `Hai phần tử liền nhau hơn kém nhau ${d}. Số phần tử = (${b} − ${a}) : ${d} + 1 = ${count}.`, `Neighbouring elements differ by ${d}. Count = (${b} − ${a}) : ${d} + 1 = ${count}.`)),
    );
  },
  // Odd or even numbers strictly between a and b.
  () => {
    const a = int(5, 80);
    const b = a + int(12, 60);
    const odd = Math.random() < 0.5;
    const list = range(a + 1, b - 1).filter((x) => x % 2 === (odd ? 1 : 0));
    const [first, last] = [list[0], list[list.length - 1]];
    return input(
      bi((L) => T(L, `Có bao nhiêu số tự nhiên <b>${odd ? 'lẻ' : 'chẵn'}</b> x thoả mãn ${a} &lt; x &lt; ${b}?`, `How many <b>${odd ? 'odd' : 'even'}</b> natural numbers x satisfy ${a} &lt; x &lt; ${b}?`)),
      list.length,
      bi((L) => T(L, `Các số đó là ${first}; ${first + 2}; …; ${last}. Số các số: (${last} − ${first}) : 2 + 1 = ${list.length}.`, `They are ${first}, ${first + 2}, …, ${last}. Count: (${last} − ${first}) : 2 + 1 = ${list.length}.`)),
    );
  },
  // Two-digit numbers with a given digit sum.
  () => {
    const s = int(2, 17);
    const list = range(10, 99).filter((n) => Math.floor(n / 10) + (n % 10) === s);
    return input(
      bi((L) => T(L, `Gọi B là tập hợp các số có hai chữ số mà tổng hai chữ số bằng ${s}. B có bao nhiêu phần tử?`, `B is the set of two-digit numbers whose digits add up to ${s}. How many elements does B have?`)),
      list.length,
      bi((L) => `B = ${setOf(list, L)} — ${T(L, `${list.length} phần tử`, `${list.length} elements`)}.`),
    );
  },
  // Describe an evenly spaced set by a formula.
  () => {
    const d = int(3, 6);
    const r = int(1, d - 1);
    const k = int(4, 6);
    const elems = range(0, k - 1).map((i) => d * i + r);
    const form = (dd, rr, kk) => bi((L) => `{x | x = ${dd}k + ${rr}, k ∈ ℕ, k ≤ ${kk}}`);
    return choice(
      bi((L) => `${T(L, 'Cách viết nào mô tả đúng tập hợp', 'Which description matches')} C = ${setOf(elems, L)}?`),
      form(d, r, k - 1),
      [form(d, r, k), form(d, r + 1, k - 1), form(d + 1, r, k - 1)],
      bi((L) => T(L, `Mỗi phần tử chia ${d} dư ${r}: x = ${d}k + ${r}. k chạy từ 0 đến ${k - 1} (${k} phần tử).`, `Each element is ${d}k + ${r}, with k from 0 to ${k - 1} (${k} elements).`)),
    );
  },
];

// ---------- Bài 2. Cách ghi số tự nhiên ----------

const lesson2 = [
  // Page numbering.
  () => {
    const n = int(40, 999);
    const total = digitsUpTo(n);
    return input(
      bi((L) => T(L, `Một cuốn sách dày ${n} trang, đánh số từ 1. Cần dùng bao nhiêu chữ số để đánh số trang?`, `A book has ${n} pages, numbered from 1. How many digits are printed in the page numbers?`)),
      total,
      bi((L) => {
        const parts = [`9 · 1`];
        if (n >= 10) parts.push(`${Math.min(n, 99) - 9} · 2`);
        if (n >= 100) parts.push(`${n - 99} · 3`);
        return T(L, `Trang 1–9: 1 chữ số; 10–99: 2 chữ số; từ 100: 3 chữ số. Tổng: ${parts.join(' + ')} = ${fmt(total, L)}.`, `Pages 1–9 use 1 digit, 10–99 use 2, from 100 use 3. Total: ${parts.join(' + ')} = ${fmt(total, L)}.`);
      }),
    );
  },
  // Writing an extra digit on the right.
  () => {
    const x = int(12, 999);
    const c = Math.random() < 0.5 ? 0 : int(1, 9);
    const increase = 9 * x + c;
    return input(
      bi((L) => T(L, `Viết thêm chữ số ${c} vào bên phải một số tự nhiên thì số đó tăng thêm ${fmt(increase, L)} đơn vị. Tìm số đó.`, `Writing the digit ${c} on the right of a natural number makes it ${fmt(increase, L)} bigger. Find the number.`)),
      x,
      bi((L) => T(L, `Số mới là 10 · x + ${c}, nên tăng thêm 9 · x + ${c} = ${increase}. Vậy x = (${increase} − ${c}) : 9 = ${x}.`, `The new number is 10 · x + ${c}, so it grows by 9 · x + ${c} = ${increase}. So x = (${increase} − ${c}) : 9 = ${x}.`)),
    );
  },
  // Numbers with different digits made from a digit set.
  () => {
    const withZero = Math.random() < 0.6;
    const k = int(4, 5);
    const digits = withZero ? [0, ...distinct(k - 1, 1, 9)] : distinct(k, 1, 9);
    const len = 3;
    const firstChoices = digits.filter((d) => d !== 0).length;
    const count = firstChoices * (k - 1) * (k - 2);
    const sorted = [...digits].sort((a, b) => a - b);
    return input(
      bi((L) => T(L, `Từ các chữ số ${sorted.join('; ')} lập được bao nhiêu số có ${len} chữ số <b>khác nhau</b>?`, `Using the digits ${sorted.join(', ')}, how many ${len}-digit numbers with <b>all different</b> digits can be made?`)),
      count,
      bi((L) => T(L, `Hàng trăm: ${firstChoices} cách${withZero ? ' (khác 0)' : ''}; hàng chục: ${k - 1} cách; hàng đơn vị: ${k - 2} cách. Có ${firstChoices} · ${k - 1} · ${k - 2} = ${count} số.`, `Hundreds: ${firstChoices} choices${withZero ? ' (not 0)' : ''}; tens: ${k - 1}; ones: ${k - 2}. That makes ${firstChoices} · ${k - 1} · ${k - 2} = ${count} numbers.`)),
    );
  },
  // Smallest / largest number with k different digits.
  () => {
    const k = int(3, 6);
    const largest = Math.random() < 0.5;
    const n = largest ? Number('9876543210'.slice(0, k)) : Number(`10${'23456789'.slice(0, k - 2)}`);
    return input(
      bi((L) => T(L, `Tìm số tự nhiên <b>${largest ? 'lớn' : 'nhỏ'} nhất</b> có ${k} chữ số khác nhau.`, `Find the <b>${largest ? 'largest' : 'smallest'}</b> natural number with ${k} different digits.`)),
      n,
      bi((L) => (largest
        ? T(L, `Chọn các chữ số lớn nhất, xếp giảm dần: ${fmt(n, L)}.`, `Take the largest digits in decreasing order: ${fmt(n, L)}.`)
        : T(L, `Chữ số đầu nhỏ nhất khác 0 là 1, tiếp theo là 0, rồi 2; 3; …: ${fmt(n, L)}.`, `The first digit must be 1 (not 0), then 0, then 2, 3, …: ${fmt(n, L)}.`))),
    );
  },
];

// ---------- Bài 3. Thứ tự trong tập hợp các số tự nhiên ----------

const lesson3 = [
  // Sum of consecutive numbers (or consecutive even numbers).
  () => {
    if (Math.random() < 0.5) {
      const n = int(10, 9000);
      const S = 3 * n;
      return input(
        bi((L) => T(L, `Tổng của ba số tự nhiên liên tiếp là ${fmt(S, L)}. Tìm số lớn nhất trong ba số đó.`, `Three consecutive natural numbers add up to ${fmt(S, L)}. Find the largest of them.`)),
        n + 1,
        bi((L) => T(L, `Số ở giữa = ${fmt(S, L)} : 3 = ${fmt(n, L)}; số lớn nhất = ${fmt(n + 1, L)}.`, `The middle number = ${fmt(S, L)} : 3 = ${fmt(n, L)}; the largest is ${fmt(n + 1, L)}.`)),
      );
    }
    const a = 2 * int(5, 2000);
    const S = 4 * a + 12;
    return input(
      bi((L) => T(L, `Tổng của bốn số chẵn liên tiếp là ${fmt(S, L)}. Tìm số nhỏ nhất.`, `Four consecutive even numbers add up to ${fmt(S, L)}. Find the smallest.`)),
      a,
      bi((L) => T(L, `Gọi số nhỏ nhất là a: a + (a + 2) + (a + 4) + (a + 6) = 4a + 12 = ${fmt(S, L)} ⇒ a = (${fmt(S, L)} − 12) : 4 = ${fmt(a, L)}.`, `Call the smallest a: a + (a + 2) + (a + 4) + (a + 6) = 4a + 12 = ${fmt(S, L)} ⇒ a = (${fmt(S, L)} − 12) : 4 = ${fmt(a, L)}.`)),
    );
  },
  // Product of two consecutive numbers.
  () => {
    const n = int(11, 99);
    const P = n * (n + 1);
    return input(
      bi((L) => T(L, `Tích của hai số tự nhiên liên tiếp là ${fmt(P, L)}. Tìm số lớn hơn.`, `The product of two consecutive natural numbers is ${fmt(P, L)}. Find the larger one.`)),
      n + 1,
      bi((L) => T(L, `${n} · ${n} = ${n * n} và ${n + 1} · ${n + 1} = ${(n + 1) ** 2}, nên hai số là ${n} và ${n + 1}: ${n} · ${n + 1} = ${fmt(P, L)}.`, `${n} · ${n} = ${n * n} and ${n + 1} · ${n + 1} = ${(n + 1) ** 2}, so the numbers are ${n} and ${n + 1}: ${n} · ${n + 1} = ${fmt(P, L)}.`)),
    );
  },
  // Counting three-digit numbers above / below a bound.
  () => {
    const a = int(120, 980);
    const greater = Math.random() < 0.5;
    const count = greater ? 999 - a : a - 100;
    return input(
      bi((L) => T(L, `Có bao nhiêu số có ba chữ số <b>${greater ? 'lớn hơn' : 'nhỏ hơn'}</b> ${a}?`, `How many three-digit numbers are <b>${greater ? 'greater' : 'less'} than</b> ${a}?`)),
      count,
      bi((L) => (greater
        ? T(L, `Từ ${a + 1} đến 999: 999 − ${a + 1} + 1 = ${count} số.`, `From ${a + 1} to 999: 999 − ${a + 1} + 1 = ${count} numbers.`)
        : T(L, `Từ 100 đến ${a - 1}: ${a - 1} − 100 + 1 = ${count} số.`, `From 100 to ${a - 1}: ${a - 1} − 100 + 1 = ${count} numbers.`))),
    );
  },
  // Put four tricky numbers in order.
  () => {
    const d = distinct(3, 1, 9);
    const nums = shuffle([...new Set([
      Number(`${d[0]}${d[1]}${d[2]}0`), Number(`${d[0]}${d[2]}${d[1]}0`),
      Number(`${d[0]}0${d[1]}${d[2]}`), Number(`${d[0]}${d[1]}0${d[2]}`),
    ])]);
    const asc = [...nums].sort((a, b) => a - b);
    const order = (arr) => bi((L) => arr.map((v) => fmt(v, L)).join(' &lt; '));
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const s = shuffle(asc);
      if (s.join() !== asc.join()) wrongs.add(s.join(','));
    }
    return choice(
      bi((L) => T(L, 'Sắp xếp nào đúng theo thứ tự tăng dần?', 'Which list is in increasing order?')),
      order(asc),
      [...wrongs].map((w) => order(w.split(',').map(Number))),
      bi((L) => T(L, 'Cùng 4 chữ số và cùng chữ số hàng nghìn: so sánh hàng trăm, rồi hàng chục, rồi hàng đơn vị.', 'Same length and same thousands digit: compare hundreds, then tens, then ones.')),
    );
  },
];

// ---------- Bài 4. Phép cộng và phép trừ số tự nhiên ----------

const lesson4 = [
  // Sum of an arithmetic series.
  () => {
    const a = int(1, 20);
    const d = int(1, 5);
    const n = int(10, 50);
    const b = a + d * (n - 1);
    const sum = ((a + b) * n) / 2;
    return input(
      bi((L) => `${T(L, 'Tính tổng:', 'Work out the sum:')} ${eq(`${a} + ${a + d} + ${a + 2 * d} + … + ${b}`)}`),
      sum,
      bi((L) => T(L, `Số số hạng: (${b} − ${a}) : ${d} + 1 = ${n}. Tổng = (${a} + ${b}) · ${n} : 2 = ${fmt(sum, L)}.`, `Number of terms: (${b} − ${a}) : ${d} + 1 = ${n}. Sum = (${a} + ${b}) · ${n} : 2 = ${fmt(sum, L)}.`)),
    );
  },
  // Find x with two operations.
  () => {
    const x = int(20, 400);
    const a = int(10, 300);
    const b = int(5, 200);
    const forms = [
      [`(x − ${a}) − ${b} = ${x - a - b}`, `x − ${a} = ${x - a - b} + ${b} = ${x - a} ⇒ x = ${x - a} + ${a}`, x > a + b],
      [`${x + a + b} − (x + ${b}) = ${a}`, `x + ${b} = ${x + a + b} − ${a} = ${x + b} ⇒ x = ${x + b} − ${b}`, true],
      [`(${x + a} − x) + ${b} = ${a + b}`, `${x + a} − x = ${a + b} − ${b} = ${a} ⇒ x = ${x + a} − ${a}`, true],
      [`${b} + (x − ${a}) = ${b + x - a}`, `x − ${a} = ${b + x - a} − ${b} = ${x - a} ⇒ x = ${x - a} + ${a}`, x > a],
    ].filter((f) => f[2]);
    const [text, how] = pick(forms);
    return input(
      bi((L) => `${T(L, 'Tìm số tự nhiên x, biết:', 'Find the natural number x:')} ${eq(text)}`),
      x,
      bi(() => `${how} = ${x}`),
    );
  },
  // Sum and difference.
  () => {
    const small = int(20, 900);
    const diff = int(5, 300);
    const big = small + diff;
    const askBig = Math.random() < 0.5;
    return input(
      bi((L) => T(L, `Tổng của hai số là ${fmt(big + small, L)}, hiệu của chúng là ${diff}. Tìm số ${askBig ? 'lớn' : 'bé'}.`, `Two numbers add up to ${fmt(big + small, L)} and differ by ${diff}. Find the ${askBig ? 'larger' : 'smaller'} one.`)),
      askBig ? big : small,
      bi((L) => T(L, `Số lớn = (tổng + hiệu) : 2 = (${big + small} + ${diff}) : 2 = ${big}; số bé = (tổng − hiệu) : 2 = ${small}.`, `Larger = (sum + difference) : 2 = (${big + small} + ${diff}) : 2 = ${big}; smaller = (sum − difference) : 2 = ${small}.`)),
    );
  },
  // Ages: the difference never changes.
  () => {
    const child = int(4, 14);
    const gap = int(22, 35);
    const years = int(2, 10);
    const total = 2 * (child + years) + gap;
    return input(
      bi((L) => T(L, `Mẹ hơn con ${gap} tuổi. Sau ${years} năm nữa, tổng số tuổi của hai mẹ con là ${total}. Hiện nay con bao nhiêu tuổi?`, `A mother is ${gap} years older than her child. In ${years} years their ages will add up to ${total}. How old is the child now?`)),
      child,
      bi((L) => T(L, `Hiệu số tuổi không đổi. Sau ${years} năm: tuổi con = (${total} − ${gap}) : 2 = ${child + years}. Hiện nay: ${child + years} − ${years} = ${child}.`, `The age gap never changes. In ${years} years the child is (${total} − ${gap}) : 2 = ${child + years}, so now ${child + years} − ${years} = ${child}.`)),
    );
  },
];

// ---------- Bài 5. Phép nhân và phép chia số tự nhiên ----------

const lesson5 = [
  // Common factor with three products.
  () => {
    const a = int(12, 99);
    const [p, q] = [int(11, 60), int(11, 30)];
    const forms = [
      [`${a} · ${p} + ${a} · ${q} + ${a} · ${100 - p - q}`, `${a} · (${p} + ${q} + ${100 - p - q}) = ${a} · 100`, 100 * a, p + q < 100],
      [`${a} · ${100 + p} − ${a} · ${p}`, `${a} · (${100 + p} − ${p}) = ${a} · 100`, 100 * a, true],
      [`${a} · ${p} + ${a} · ${100 - p} − ${a}`, `${a} · (${p} + ${100 - p} − 1) = ${a} · 99`, 99 * a, true],
    ].filter((f) => f[3]);
    const [expr, how, ans] = pick(forms);
    return input(
      bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(expr)}`),
      ans,
      bi((L) => `${how} = ${fmt(ans, L)}`),
    );
  },
  // Dividend + divisor known.
  () => {
    const b = int(5, 30);
    const q = int(2, 20);
    const r = int(0, b - 1);
    const a = b * q + r;
    const askDivisor = Math.random() < 0.5;
    return input(
      bi((L) => T(L, `Chia một số cho một số khác được thương ${q}, số dư ${r}. Tổng số bị chia và số chia là ${a + b}. Tìm ${askDivisor ? 'số chia' : 'số bị chia'}.`, `Dividing one number by another gives quotient ${q} and remainder ${r}. The dividend plus the divisor is ${a + b}. Find the ${askDivisor ? 'divisor' : 'dividend'}.`)),
      askDivisor ? b : a,
      bi((L) => T(L, `Số bị chia = ${q} · số chia + ${r}, nên ${q + 1} · số chia + ${r} = ${a + b} ⇒ số chia = (${a + b} − ${r}) : ${q + 1} = ${b}; số bị chia = ${a}.`, `Dividend = ${q} · divisor + ${r}, so ${q + 1} · divisor + ${r} = ${a + b} ⇒ divisor = (${a + b} − ${r}) : ${q + 1} = ${b}; dividend = ${a}.`)),
    );
  },
  // Largest / smallest k-digit number with a given remainder.
  () => {
    const k = pick([2, 3]);
    const m = int(3, 15);
    const r = int(1, m - 1);
    const largest = Math.random() < 0.5;
    const lo = 10 ** (k - 1);
    const hi = 10 ** k - 1;
    const n = largest ? Math.floor((hi - r) / m) * m + r : Math.ceil((lo - r) / m) * m + r;
    return input(
      bi((L) => T(L, `Tìm số <b>${largest ? 'lớn' : 'nhỏ'} nhất</b> có ${k} chữ số mà chia cho ${m} dư ${r}.`, `Find the <b>${largest ? 'largest' : 'smallest'}</b> ${k}-digit number that leaves remainder ${r} when divided by ${m}.`)),
      n,
      bi((L) => T(L, `Các số chia ${m} dư ${r}: ${r}; ${r + m}; ${r + 2 * m}; … Số ${largest ? 'cuối cùng' : 'đầu tiên'} có ${k} chữ số là ${n} = ${m} · ${(n - r) / m} + ${r}.`, `Numbers leaving remainder ${r}: ${r}, ${r + m}, ${r + 2 * m}, … The ${largest ? 'last' : 'first'} one with ${k} digits is ${n} = ${m} · ${(n - r) / m} + ${r}.`)),
    );
  },
  // Dividend + divisor + remainder known.
  () => {
    const q = int(2, 9);
    const r = int(1, 9);
    const b = int(r + 1, 40);
    const a = b * q + r;
    const S = a + b + r;
    return input(
      bi((L) => T(L, `Một phép chia có thương ${q}, số dư ${r}. Tổng của số bị chia, số chia và số dư là ${S}. Tìm số bị chia.`, `A division has quotient ${q} and remainder ${r}. The dividend, divisor and remainder add up to ${S}. Find the dividend.`)),
      a,
      bi((L) => T(L, `Số bị chia + số chia = ${S} − ${r} = ${a + b}. Số bị chia = ${q} · số chia + ${r} ⇒ ${q + 1} · số chia = ${a + b - r} ⇒ số chia = ${b}, số bị chia = ${a}.`, `Dividend + divisor = ${S} − ${r} = ${a + b}. Dividend = ${q} · divisor + ${r} ⇒ ${q + 1} · divisor = ${a + b - r} ⇒ divisor = ${b}, dividend = ${a}.`)),
    );
  },
];

// ---------- Bài 6. Luỹ thừa với số mũ tự nhiên ----------

const CYCLES = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 4: [4, 6], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] };

const lesson6 = [
  // Last digit of a power.
  () => {
    const a = pick(Object.keys(CYCLES).map(Number));
    const n = int(10, 99);
    const cycle = CYCLES[a];
    const digit = cycle[(n - 1) % cycle.length];
    const same = ((n - 1) % cycle.length) + 1; // a^n ends like a^same
    return input(
      bi((L) => T(L, `Tìm chữ số tận cùng của ${pw(a, n)}.`, `Find the last digit of ${pw(a, n)}.`)),
      digit,
      bi((L) => T(L, `Chữ số tận cùng của ${pw(a, 1)}, ${pw(a, 2)}, ${pw(a, 3)}, … lặp lại theo chu kì ${cycle.join(', ')}. Vì ${n} = ${cycle.length} · ${Math.floor((n - 1) / cycle.length)} + ${same} nên ${pw(a, n)} tận cùng giống ${pw(a, same)}: là ${digit}.`, `The last digits of ${pw(a, 1)}, ${pw(a, 2)}, ${pw(a, 3)}, … repeat in the cycle ${cycle.join(', ')}. Since ${n} = ${cycle.length} · ${Math.floor((n - 1) / cycle.length)} + ${same}, ${pw(a, n)} ends like ${pw(a, same)}: in ${digit}.`)),
    );
  },
  // Compare two powers with a shared exponent factor.
  () => {
    let a; let b; let p; let q;
    do {
      [a, b] = distinct(2, 2, 7);
      [p, q] = [int(2, 4), int(2, 4)];
    } while (p === q || a ** p === b ** q || Math.abs(a ** p - b ** q) > 40); // same exponents would be too easy
    const m = int(5, 25);
    const [X, Y] = [a ** p, b ** q];
    const ans = X < Y ? '&lt;' : '&gt;';
    return choice(
      bi((L) => `${T(L, 'So sánh:', 'Compare:')} ${eq(`${pw(a, p * m)} ☐ ${pw(b, q * m)}`)}`),
      ans,
      ['&lt;', '&gt;', '='].filter((s) => s !== ans),
      bi((L) => T(L, `${pw(a, p * m)} = ${pw(`(${pw(a, p)})`, m)} = ${pw(X, m)} và ${pw(b, q * m)} = ${pw(`(${pw(b, q)})`, m)} = ${pw(Y, m)}. Vì ${X} ${ans} ${Y} nên ${pw(a, p * m)} ${ans} ${pw(b, q * m)}.`, `${pw(a, p * m)} = ${pw(`(${pw(a, p)})`, m)} = ${pw(X, m)} and ${pw(b, q * m)} = ${pw(`(${pw(b, q)})`, m)} = ${pw(Y, m)}. Since ${X} ${ans} ${Y}, ${pw(a, p * m)} ${ans} ${pw(b, q * m)}.`)),
    );
  },
  // Find x inside a power.
  () => {
    const forms = [
      () => { const c = int(1, 30); const k = int(2, 15); return [`${pw(`(x − ${c})`, 2)} = ${k * k}`, c + k, `x − ${c} = ${k}`]; },
      () => { const k = int(2, 6); const c = int(1, k - 1); return [`${pw(`(x + ${c})`, 3)} = ${k ** 3}`, k - c, `x + ${c} = ${k}`]; },
      () => { const a = pick([2, 3, 5]); const k = int(1, 4); const e = int(2, a === 2 ? 8 : 4); return [`${pw(a, `x + ${k}`)} = ${a ** (e + k)}`, e, `x + ${k} = ${e + k}`]; },
      () => { const e = int(2, 8); return [`${pw(2, 'x')} + ${pw(2, 'x + 1')} = ${3 * 2 ** e}`, e, `${pw(2, 'x')} · (1 + 2) = ${3 * 2 ** e} ⇒ ${pw(2, 'x')} = ${2 ** e}`]; },
    ];
    let f;
    do { f = pick(forms)(); } while (f[1] < 0);
    const [text, x, how] = f;
    return input(
      bi((L) => `${T(L, 'Tìm số tự nhiên x, biết:', 'Find the natural number x:')} ${eq(text)}`),
      x,
      bi(() => `${how} ⇒ x = ${x}`),
    );
  },
  // Write as a single power of 2 or 3.
  () => {
    const base2 = Math.random() < 0.5;
    const [big, small, b, eBig, eSmall] = base2 ? [8, 4, 2, 3, 2] : [27, 9, 3, 3, 2];
    const m = int(2, 9);
    const n = int(2, 9);
    const multiply = Math.random() < 0.5 || eBig * m < eSmall * n;
    const ans = multiply ? eBig * m + eSmall * n : eBig * m - eSmall * n;
    return input(
      bi((L) => `${T(L, 'Tìm n, biết:', 'Find n:')} ${eq(`${pw(big, m)} ${multiply ? '·' : ':'} ${pw(small, n)} = ${pw(b, 'n')}`)}`),
      ans,
      bi(() => `${big} = ${pw(b, eBig)}, ${small} = ${pw(b, eSmall)} ⇒ ${pw(b, eBig * m)} ${multiply ? '·' : ':'} ${pw(b, eSmall * n)} = ${pw(b, ans)} ⇒ n = ${ans}`),
    );
  },
];

// ---------- Bài 7. Thứ tự thực hiện các phép tính ----------

function bracesExpression() {
  for (;;) {
    const [a, b, c, d, e, f, g] = [int(2, 20), int(2, 20), int(2, 6), int(2, 6), int(2, 9), int(1, 20), int(2, 5)];
    const inner = (a + b) * c - d * d;
    if (inner <= 0 || inner % e) continue;
    const q = inner / e;
    return {
      html: `{[(${a} + ${b}) · ${c} − ${pw(d, 2)}] : ${e} + ${f}} · ${g}`,
      steps: [
        `{[${a + b} · ${c} − ${d * d}] : ${e} + ${f}} · ${g}`,
        `{[${(a + b) * c} − ${d * d}] : ${e} + ${f}} · ${g}`,
        `{${inner} : ${e} + ${f}} · ${g}`,
        `{${q} + ${f}} · ${g}`,
        `${q + f} · ${g}`,
      ],
      value: (q + f) * g,
    };
  }
}

const lesson7 = [
  // Long expression with three kinds of brackets.
  () => {
    const e = bracesExpression();
    return input(
      bi((L) => `${T(L, 'Tính giá trị biểu thức:', 'Work out:')} ${eq(e.html)}`),
      e.value,
      bi(() => `${e.html} = ${[...e.steps, e.value].join(' = ')}`),
      { html: e.html, value: e.value },
    );
  },
  // Find x inside an expression.
  () => {
    const x = int(3, 40);
    const forms = [
      () => { const [a, b, c] = [int(5, 60), int(2, 9), int(1, x - 1)]; const d = a + b * (x - c); return [`${a} + ${b} · (x − ${c}) = ${d}`, `${b} · (x − ${c}) = ${d - a} ⇒ x − ${c} = ${x - c}`]; },
      () => { const [a, c] = [int(2, 9), int(2, 9)]; const d = int(2, 20); const b = a * x - c * d; return b >= 0 ? [`(${a} · x − ${b}) : ${c} = ${d}`, `${a} · x − ${b} = ${c * d} ⇒ ${a} · x = ${c * d + b}`] : null; },
      () => { const [k, b] = [int(2, 4), int(1, 50)]; const c = k * k * x - b; return c >= 0 ? [`${pw(k, 2)} · x − ${b} = ${c}`, `${k * k} · x = ${c} + ${b} = ${k * k * x}`] : null; },
    ];
    let f;
    do { f = pick(forms)(); } while (!f);
    const [text, how] = f;
    return input(
      bi((L) => `${T(L, 'Tìm số tự nhiên x, biết:', 'Find the natural number x:')} ${eq(text)}`),
      x,
      bi(() => `${how} ⇒ x = ${x}`),
    );
  },
  // Where do the brackets go?
  () => {
    for (;;) {
      const [p, q, r, s] = [int(2, 9), int(2, 9), int(2, 9), int(2, 9)];
      const options = [
        [`(${p} + ${q}) · ${r} + ${s}`, (p + q) * r + s],
        [`${p} + ${q} · (${r} + ${s})`, p + q * (r + s)],
        [`(${p} + ${q}) · (${r} + ${s})`, (p + q) * (r + s)],
        [`${p} + ${q} · ${r} + ${s}`, p + q * r + s],
      ];
      const values = options.map((o) => o[1]);
      if (new Set(values).size < 4) continue;
      const [correct, value] = pick(options.slice(0, 3));
      return choice(
        bi((L) => T(L, `Đặt dấu ngoặc vào ${eq(`${p} + ${q} · ${r} + ${s}`)} thế nào để được kết quả <b>${value}</b>?`, `Where should brackets go in ${eq(`${p} + ${q} · ${r} + ${s}`)} to get <b>${value}</b>?`)),
        correct,
        options.filter((o) => o[0] !== correct).map((o) => o[0]),
        bi(() => options.map(([html, v]) => `${html} = ${v}`).join('; ')),
      );
    }
  },
];

export const ADVANCED = {
  c1b1: lesson1, c1b2: lesson2, c1b3: lesson3, c1b4: lesson4, c1b5: lesson5, c1b6: lesson6, c1b7: lesson7,
};
