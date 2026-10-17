// Grade 6 volume 2, Chapter VII: decimals. Lessons 28–31 with theory,
// step-by-step pictures, basic and advanced exercises. Numbers are built
// from integers (e.g. 1 234 hundredths) so the answers are exact. Original text.

import {
  bi, T, fmt, int, pick, shuffle, choice, input, inputD, frac, gcd,
} from './util.js';
import { derivation, fractionBar } from './visuals.js';

const cap = (html, isNew = false, big = false) => `<p class="vx-caption${isNew ? ' new' : ''}${big ? ' big' : ''}">${html}</p>`;
const eq = (html) => `<span class="eq">${html}</span>`;
const hl = (s, tone = 'a') => `<span class="hl ${tone}">${s}</span>`;
const YES = { vi: 'Đúng', en: 'Right' };
const NO = { vi: 'Sai', en: 'Wrong' };
const exact = (x) => Number(x.toFixed(6));
const D = (x, L) => fmt(exact(x), L);
const P = (x, L) => (x < 0 ? `(${D(x, L)})` : D(x, L)); // decimal inside an expression
const nonZero = (lo, hi) => { for (;;) { const v = int(lo, hi); if (v) return v; } };
// A decimal with `places` decimal places, from an integer count of units.
const decimal = (lo, hi, places) => int(lo, hi) / 10 ** places;
const percentGrid = (n) => `<div class="area-grid hundred">${Array.from({ length: 100 }, (_, i) => `<span class="${i < n ? 'col' : ''}"></span>`).join('')}</div>`;

// ---------- Bài 28. Số thập phân ----------

const lesson28 = {
  id: 'c7b28',
  number: 28,
  title: { vi: 'Số thập phân', en: 'Decimals' },
  points: [
    {
      title: { vi: 'Phân số thập phân và số thập phân', en: 'Decimal fractions and decimals' },
      theory: {
        vi: [
          `<b>Phân số thập phân</b> là phân số có mẫu là luỹ thừa của 10: ${frac(3, 10)}, ${frac(-7, 100)}, ${frac(2375, 1000)}…`,
          `Viết dưới dạng <b>số thập phân</b>: ${frac(3, 10)} = 0,3; ${frac(-7, 100)} = −0,07; ${frac(2375, 1000)} = 2,375.`,
          'Số thập phân gồm <b>phần nguyên</b> (bên trái dấu phẩy) và <b>phần thập phân</b> (bên phải): hàng phần mười, phần trăm, phần nghìn…',
          'Hai số thập phân −a và a là hai số đối nhau.',
        ],
        en: [
          `A <b>decimal fraction</b> has a power of 10 as denominator: ${frac(3, 10)}, ${frac(-7, 100)}, ${frac(2375, 1000)}…`,
          `As <b>decimals</b>: ${frac(3, 10)} = 0.3; ${frac(-7, 100)} = −0.07; ${frac(2375, 1000)} = 2.375.`,
          'A decimal has a <b>whole part</b> (left of the point) and a <b>decimal part</b> (right of it): tenths, hundredths, thousandths…',
          '−a and a are opposite decimals.',
        ],
      },
      example: {
        caption: { vi: '0,3 và 2,375.', en: '0.3 and 2.375.' },
        frames: (L) => [
          fractionBar({ n: 3, d: 10, label: frac(3, 10) }) + cap(T(L, 'Thanh chia 10 phần, tô 3 phần: 0,3.', 'A bar in 10 parts, 3 shaded: 0.3.')),
          ...derivation([
            `${D(2.375, L)}`,
            `= ${hl('2')} + ${hl(frac(3, 10), 'b')} + ${frac(7, 100)} + ${frac(5, 1000)}`,
            T(L, 'phần nguyên 2; phần mười 3; phần trăm 7; phần nghìn 5', 'whole part 2; tenths 3; hundredths 7; thousandths 5'),
          ]),
        ],
      },
    },
    {
      title: { vi: 'So sánh hai số thập phân', en: 'Comparing decimals' },
      theory: {
        vi: [
          'Số thập phân âm &lt; 0 &lt; số thập phân dương.',
          'Hai số dương: so sánh phần nguyên; nếu bằng nhau thì so sánh lần lượt từng hàng phần mười, phần trăm, … cho đến khi khác nhau.',
          'Hai số âm: số nào có phần số (bỏ dấu "−") lớn hơn thì nhỏ hơn.',
        ],
        en: [
          'Negative decimals &lt; 0 &lt; positive decimals.',
          'Two positives: compare the whole parts; if equal, compare tenths, then hundredths, … until they differ.',
          'Two negatives: the one with the larger number part (ignoring "−") is smaller.',
        ],
      },
      example: {
        caption: { vi: 'So sánh 12,35 và 12,4.', en: 'Compare 12.35 and 12.4.' },
        frames: (L) => derivation([
          `${D(12.35, L)} ☐ ${D(12.4, L)}`,
          T(L, 'Phần nguyên bằng nhau (12 = 12).', 'Equal whole parts (12 = 12).'),
          `${T(L, 'Hàng phần mười', 'Tenths')}: ${hl('3')} &lt; ${hl('4')}`,
          `⇒ <b>${D(12.35, L)} &lt; ${D(12.4, L)}</b>`,
        ]),
      },
    },
  ],
  exercises: [
    // Decimal fraction → decimal.
    () => {
      const k = int(1, 3);
      const n = int(1, 9999) * pick([1, 1, -1]);
      const x = n / 10 ** k;
      const wrongs = [x * 10, x / 10, -x].filter((w) => exact(w) !== exact(x));
      return choice(
        bi((L) => `${frac(n < 0 ? `−${-n}` : n, 10 ** k)} = ?`),
        bi((L) => D(x, L)),
        wrongs.map((w) => bi((L) => D(w, L))),
        bi((L) => T(L, `Mẫu có ${k} chữ số 0 nên phần thập phân có ${k} chữ số: ${D(x, L)}.`, `The denominator has ${k} zeros, so ${k} decimal places: ${D(x, L)}.`)),
      );
    },
    // Compare.
    () => {
      const a = exact(decimal(-999, 999, 2));
      let b = exact(Math.random() < 0.5 ? -a : a + pick([0.1, -0.01, 0.09, -0.1]));
      if (Math.random() < 0.1) b = a;
      const ans = a < b ? '&lt;' : a > b ? '&gt;' : '=';
      return choice(
        bi((L) => `${T(L, 'Điền dấu:', 'Choose the sign:')} ${eq(`${D(a, L)} ☐ ${D(b, L)}`)}`),
        ans,
        ['&lt;', '&gt;', '='].filter((s) => s !== ans),
        bi((L) => T(L, 'So sánh dấu, rồi phần nguyên, rồi từng hàng thập phân.', 'Compare signs, then whole parts, then each decimal place.')),
      );
    },
    // Largest / smallest of tricky decimals.
    () => {
      const w = int(0, 9);
      const [p, q] = [int(1, 9), int(1, 9)];
      const list = [...new Set([w + p / 10, w + p / 10 + q / 100, w + q / 10 + p / 100, w + p / 100, w + p / 10 + q / 1000].map(exact))].slice(0, 4);
      if (list.length < 4) return lesson28.exercises[2]();
      const largest = Math.random() < 0.5;
      const best = largest ? Math.max(...list) : Math.min(...list);
      return choice(
        bi((L) => T(L, `Số nào <b>${largest ? 'lớn' : 'nhỏ'} nhất</b>?`, `Which is the <b>${largest ? 'largest' : 'smallest'}</b>?`)),
        bi((L) => D(best, L)),
        list.filter((v) => v !== best).map((v) => bi((L) => D(v, L))),
        bi((L) => [...list].sort((a, b) => a - b).map((v) => D(v, L)).join(' &lt; ')),
      );
    },
    // Type a decimal (with sign).
    () => {
      const k = int(1, 3);
      const n = nonZero(-999, 999);
      return inputD(
        bi((L) => `${T(L, 'Viết dưới dạng số thập phân:', 'Write as a decimal:')} ${frac(n < 0 ? `−${-n}` : n, 10 ** k)}`),
        n / 10 ** k,
        bi((L) => D(n / 10 ** k, L)),
        true,
      );
    },
  ],
};

// ---------- Bài 29. Tính toán với số thập phân ----------

const lesson29 = {
  id: 'c7b29',
  number: 29,
  title: { vi: 'Tính toán với số thập phân', en: 'Calculating with decimals' },
  points: [
    {
      title: { vi: 'Cộng, trừ số thập phân', en: 'Adding and subtracting decimals' },
      theory: {
        vi: [
          'Viết các số sao cho <b>các dấu phẩy thẳng cột</b> (thêm chữ số 0 cho đủ), rồi cộng, trừ như số tự nhiên.',
          'Với số thập phân âm, dùng quy tắc dấu như với số nguyên: a − b = a + (−b).',
        ],
        en: [
          'Line up the <b>decimal points</b> (add zeros if needed), then add or subtract as with whole numbers.',
          'With negative decimals, use the integer sign rules: a − b = a + (−b).',
        ],
      },
      example: {
        caption: { vi: 'Tính 12,5 + 3,75 và 3,2 − 5,45.', en: 'Work out 12.5 + 3.75 and 3.2 − 5.45.' },
        frames: (L) => derivation([
          `${D(12.5, L)} + ${D(3.75, L)} = ${hl(`${D(12, L)}${L === 'vi' ? ',' : '.'}50`)} + ${D(3.75, L)} = <b>${D(16.25, L)}</b>`,
          `${D(3.2, L)} − ${D(5.45, L)} = −(${D(5.45, L)} − ${D(3.2, L)}) = <b>${D(-2.25, L)}</b>`,
        ]),
      },
    },
    {
      title: { vi: 'Nhân, chia số thập phân', en: 'Multiplying and dividing decimals' },
      theory: {
        vi: [
          '<b>Nhân</b>: nhân như số tự nhiên, rồi tách ở tích số chữ số thập phân bằng <b>tổng</b> số chữ số thập phân của các thừa số.',
          '<b>Chia cho số thập phân</b>: dời dấu phẩy của số chia và số bị chia sang phải cùng một số chữ số để số chia thành số tự nhiên, rồi chia.',
          'Dấu của tích, thương: như với số nguyên.',
        ],
        en: [
          '<b>Multiply</b> as whole numbers, then give the product as many decimal places as the factors have <b>together</b>.',
          '<b>Divide by a decimal</b>: move both decimal points right by the same number of places until the divisor is a whole number, then divide.',
          'Signs follow the integer rules.',
        ],
      },
      example: {
        caption: { vi: 'Tính 1,2 · 0,35 và 4,5 : 0,15.', en: 'Work out 1.2 · 0.35 and 4.5 : 0.15.' },
        frames: (L) => derivation([
          `12 · 35 = 420 <span class="note">${T(L, '1 + 2 = 3 chữ số thập phân', '1 + 2 = 3 decimal places')}</span>`,
          `⇒ ${D(1.2, L)} · ${D(0.35, L)} = 0${L === 'vi' ? ',' : '.'}420 = <b>${D(0.42, L)}</b>`,
          `${D(4.5, L)} : ${D(0.15, L)} = ${hl('450 : 15')} <span class="note">${T(L, 'dời dấu phẩy 2 chữ số', 'move both points 2 places')}</span>`,
          '= <b>30</b>',
        ]),
      },
    },
  ],
  exercises: [
    // Add / subtract.
    () => {
      const [a, b] = [decimal(-9999, 9999, 2), decimal(-999, 999, 1)];
      const plus = Math.random() < 0.5;
      const value = plus ? a + b : a - b;
      return inputD(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${D(a, L)} ${plus ? '+' : '−'} ${P(b, L)}`)}`),
        exact(value),
        bi((L) => `= ${D(value, L)}`),
        true,
      );
    },
    // Multiply.
    () => {
      const [a, b] = [decimal(2, 99, 1), decimal(2, 99, 2)];
      const sign = pick([1, -1]);
      return inputD(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${P(sign * a, L)} · ${D(b, L)}`)}`),
        exact(sign * a * b),
        bi((L) => T(L, `Nhân ${Math.round(a * 10)} · ${Math.round(b * 100)} = ${Math.round(a * 10) * Math.round(b * 100)}, tách 3 chữ số thập phân: ${D(sign * a * b, L)}.`, `${Math.round(a * 10)} · ${Math.round(b * 100)} = ${Math.round(a * 10) * Math.round(b * 100)}; 3 decimal places: ${D(sign * a * b, L)}.`)),
        true,
      );
    },
    // Divide exactly.
    () => {
      const b = decimal(2, 99, pick([1, 2]));
      const q = decimal(2, 99, 1);
      const a = exact(b * q);
      return inputD(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${D(a, L)} : ${D(b, L)}`)}`),
        q,
        bi((L) => `${D(b, L)} · ${D(q, L)} = ${D(a, L)} ⇒ ${D(a, L)} : ${D(b, L)} = ${D(q, L)}`),
      );
    },
    // Shopping.
    () => {
      const price = decimal(55, 395, 1);
      const qty = int(2, 9);
      return inputD(
        bi((L) => T(L, `Mỗi quyển vở giá ${D(price, L)} nghìn đồng. Mua ${qty} quyển hết bao nhiêu nghìn đồng?`, `A notebook costs ${D(price, L)} thousand dong. How much do ${qty} cost, in thousand dong?`)),
        exact(price * qty),
        bi((L) => `${D(price, L)} · ${qty} = ${D(price * qty, L)}`),
      );
    },
  ],
};

// ---------- Bài 30. Làm tròn và ước lượng ----------

const PLACE_NAMES = {
  vi: { '-2': 'hàng trăm', '-1': 'hàng chục', 0: 'hàng đơn vị', 1: 'hàng phần mười', 2: 'hàng phần trăm' },
  en: { '-2': 'hundreds', '-1': 'tens', 0: 'ones', 1: 'tenths', 2: 'hundredths' },
};
// Round half away from zero to `places` decimal places (negative = tens, hundreds…).
export const roundTo = (x, places) => Math.sign(x) * Math.round(Math.abs(x) * 10 ** places + 1e-9) / 10 ** places;

const lesson30 = {
  id: 'c7b30',
  number: 30,
  title: { vi: 'Làm tròn và ước lượng', en: 'Rounding and estimating' },
  points: [
    {
      title: { vi: 'Làm tròn số', en: 'Rounding' },
      theory: {
        vi: [
          'Nhìn <b>chữ số ngay bên phải</b> hàng cần làm tròn: nếu <b>nhỏ hơn 5</b> thì giữ nguyên hàng đó; nếu <b>lớn hơn hoặc bằng 5</b> thì cộng thêm 1 vào hàng đó.',
          'Bỏ các chữ số bên phải (ở phần thập phân) hoặc thay chúng bằng chữ số 0 (ở phần nguyên).',
          'Số âm: làm tròn phần số rồi giữ dấu "−".',
        ],
        en: [
          'Look at the <b>digit just right</b> of the place you round to: <b>less than 5</b> keeps that digit; <b>5 or more</b> adds 1 to it.',
          'Drop the digits after it (in the decimal part) or replace them with zeros (in the whole part).',
          'Negative numbers: round the number part and keep the "−".',
        ],
      },
      example: {
        caption: { vi: 'Làm tròn 3,14159 và 4 567.', en: 'Round 3.14159 and 4,567.' },
        frames: (L) => derivation([
          `${D(3.14, L)}${hl('1')}59 → ${T(L, 'hàng phần trăm', 'hundredths')}: 1 &lt; 5 ⇒ <b>${D(3.14, L)}</b>`,
          `${fmt(4500, L).slice(0, -2)}${hl('6')}7 → ${T(L, 'hàng trăm', 'hundreds')}: 6 ≥ 5 ⇒ <b>${fmt(4600, L)}</b>`,
          `${D(-2.4, L)}${hl('5')}6 → ${T(L, 'hàng phần mười', 'tenths')}: 5 ≥ 5 ⇒ <b>${D(-2.5, L)}</b>`,
        ]),
      },
    },
    {
      title: { vi: 'Ước lượng kết quả', en: 'Estimating results' },
      theory: {
        vi: [
          'Làm tròn các số đến hàng thích hợp rồi tính nhẩm để được một <b>kết quả gần đúng</b>.',
          'Ước lượng giúp phát hiện kết quả tính sai (ví dụ đặt sai dấu phẩy).',
        ],
        en: [
          'Round the numbers to a convenient place, then work it out in your head for an <b>approximate result</b>.',
          'Estimating catches mistakes, such as a misplaced decimal point.',
        ],
      },
      example: {
        caption: { vi: 'Ước lượng 19,8 · 5,1.', en: 'Estimate 19.8 · 5.1.' },
        frames: (L) => derivation([
          `${D(19.8, L)} · ${D(5.1, L)} ≈ ${hl('20')} · ${hl('5')} = 100`,
          `${T(L, 'Kết quả đúng', 'Exact')}: ${D(100.98, L)} ≈ 100 ✓`,
          `${T(L, 'Nếu ai đó tính ra', 'If someone gets')} ${D(1009.8, L)} ${T(L, 'thì chắc chắn đã sai dấu phẩy.', 'the decimal point must be wrong.')}`,
        ]),
      },
    },
  ],
  exercises: [
    // Round a decimal.
    () => {
      const places = pick([0, 1, 2]);
      const x = decimal(-99999, 99999, 3);
      return inputD(
        bi((L) => T(L, `Làm tròn ${D(x, L)} đến ${PLACE_NAMES.vi[places]}.`, `Round ${D(x, L)} to the nearest ${PLACE_NAMES.en[places]}.`)),
        exact(roundTo(x, places)),
        bi((L) => `${D(x, L)} ≈ ${D(roundTo(x, places), L)}`),
        true,
      );
    },
    // Round a whole number.
    () => {
      const places = pick([-1, -2, -3]);
      const n = int(1000, 99999);
      const r = roundTo(n, places);
      return input(
        bi((L) => T(L, `Làm tròn ${fmt(n, L)} đến ${places === -3 ? 'hàng nghìn' : PLACE_NAMES.vi[places]}.`, `Round ${fmt(n, L)} to the nearest ${places === -3 ? 'thousand' : PLACE_NAMES.en[places]}.`)),
        r,
        bi((L) => `${fmt(n, L)} ≈ ${fmt(r, L)}`),
      );
    },
    // Best estimate.
    () => {
      const [a, b] = [int(11, 99) + pick([0.2, 0.3, 0.7, 0.8]), int(3, 19) + pick([0.1, 0.2, 0.8, 0.9])];
      const est = Math.round(a) * Math.round(b);
      return choice(
        bi((L) => `${T(L, 'Ước lượng nào hợp lí nhất cho', 'Which is the best estimate of')} ${eq(`${D(a, L)} · ${D(b, L)}`)}?`),
        bi((L) => fmt(est, L)),
        [est * 10, Math.round(est / 10), est + Math.round(a) * 3].map((v) => bi((L) => fmt(v, L))),
        bi((L) => `${D(a, L)} · ${D(b, L)} ≈ ${Math.round(a)} · ${Math.round(b)} = ${fmt(est, L)} (${T(L, 'đúng', 'exact')}: ${D(a * b, L)})`),
      );
    },
    // Which rounds to …?
    () => {
      const target = int(2, 98) / 10;
      const right = exact(target + pick([-0.04, -0.03, 0.02, 0.04]));
      const wrongs = [target + 0.05, target - 0.06, target + 0.1].map(exact);
      return choice(
        bi((L) => T(L, `Số nào làm tròn đến hàng phần mười được ${D(target, L)}?`, `Which number rounds to ${D(target, L)} (nearest tenth)?`)),
        bi((L) => D(right, L)),
        wrongs.map((v) => bi((L) => D(v, L))),
        bi((L) => `${D(right, L)} ≈ ${D(target, L)}`),
      );
    },
  ],
};

// ---------- Bài 31. Tỉ số và tỉ số phần trăm ----------

const lesson31 = {
  id: 'c7b31',
  number: 31,
  title: { vi: 'Một số bài toán về tỉ số và tỉ số phần trăm', en: 'Ratios and percentages' },
  points: [
    {
      title: { vi: 'Tỉ số và tỉ số phần trăm', en: 'Ratio and percentage' },
      theory: {
        vi: [
          `<b>Tỉ số</b> của a và b (b ≠ 0) là a : b, còn viết ${frac('a', 'b')}. Hai đại lượng phải <b>cùng đơn vị</b>.`,
          `<b>Tỉ số phần trăm</b> của a và b: <b>${frac('a', 'b')} · 100%</b>. Ví dụ tỉ số phần trăm của 3 và 8 là ${frac(3, 8)} · 100% = 37,5%.`,
        ],
        en: [
          `The <b>ratio</b> of a to b (b ≠ 0) is a : b, also written ${frac('a', 'b')}. Both must be in the <b>same unit</b>.`,
          `The <b>percentage</b> a is of b: <b>${frac('a', 'b')} · 100%</b>. For example 3 out of 8 is ${frac(3, 8)} · 100% = 37.5%.`,
        ],
      },
      example: {
        caption: { vi: '35 ô trong 100 ô là 35%.', en: '35 squares out of 100 is 35%.' },
        frames: (L) => [
          percentGrid(0) + cap(T(L, 'Một hình vuông chia 100 ô.', 'A square cut into 100 cells.')),
          `<div class="new">${percentGrid(35)}</div>` + cap(T(L, `Tô 35 ô: ${frac(35, 100)} = <b>35%</b>.`, `Shade 35 cells: ${frac(35, 100)} = <b>35%</b>.`), true, true),
        ],
      },
    },
    {
      title: { vi: 'Hai bài toán về tỉ số phần trăm', en: 'Two percentage problems' },
      theory: {
        vi: [
          `Tìm <b>m%</b> của a: <b>a · ${frac('m', 100)}</b>.`,
          `Tìm một số biết <b>m%</b> của nó là b: <b>b : ${frac('m', 100)}</b> = b · ${frac(100, 'm')}.`,
        ],
        en: [
          `<b>m%</b> of a is <b>a · ${frac('m', 100)}</b>.`,
          `If <b>m%</b> of a number is b, the number is <b>b : ${frac('m', 100)}</b> = b · ${frac(100, 'm')}.`,
        ],
      },
      example: {
        caption: { vi: '20% của 350 và một số có 15% bằng 45.', en: '20% of 350, and a number whose 15% is 45.' },
        frames: (L) => derivation([
          `20% ${T(L, 'của', 'of')} 350 = 350 · ${frac(20, 100)} = <b>70</b>`,
          `15% ${T(L, 'của số đó là', 'of the number is')} 45 ⇒ 45 : ${frac(15, 100)} = 45 · ${frac(100, 15)} = <b>300</b>`,
        ]),
      },
    },
  ],
  exercises: [
    () => {
      const m = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
      const a = 20 * int(2, 60);
      return input(
        bi((L) => `${T(L, 'Tìm', 'Find')} ${m}% ${T(L, 'của', 'of')} ${fmt(a, L)}.`),
        (a * m) / 100,
        bi((L) => `${fmt(a, L)} · ${frac(m, 100)} = ${fmt((a * m) / 100, L)}`),
      );
    },
    () => {
      const m = pick([5, 10, 20, 25, 40, 50]);
      const x = 20 * int(2, 50);
      return input(
        bi((L) => T(L, `${m}% của một số là ${fmt((x * m) / 100, L)}. Tìm số đó.`, `${m}% of a number is ${fmt((x * m) / 100, L)}. Find the number.`)),
        x,
        bi((L) => `${fmt((x * m) / 100, L)} : ${frac(m, 100)} = ${fmt(x, L)}`),
      );
    },
    // Percentage of a in b.
    () => {
      const b = pick([4, 5, 8, 16, 20, 25, 40, 50]);
      const a = int(1, b - 1);
      const pct = exact((a * 100) / b);
      return inputD(
        bi((L) => T(L, `Tỉ số phần trăm của ${a} và ${b} là bao nhiêu phần trăm? (chỉ ghi số)`, `What percentage of ${b} is ${a}? (number only)`)),
        pct,
        bi((L) => `${frac(a, b)} · 100% = ${D(pct, L)}%`),
      );
    },
    // Discount.
    () => {
      const m = pick([10, 15, 20, 25, 30, 40, 50]);
      const price = 20 * int(5, 40);
      return input(
        bi((L) => T(L, `Một đôi giày giá ${fmt(price, L)} nghìn đồng được giảm ${m}%. Giá sau khi giảm là bao nhiêu nghìn đồng?`, `Shoes priced at ${fmt(price, L)} thousand dong are ${m}% off. What is the sale price (thousand dong)?`)),
        price - (price * m) / 100,
        bi((L) => `${fmt(price, L)} − ${fmt(price, L)} · ${frac(m, 100)} = ${fmt(price - (price * m) / 100, L)}`),
      );
    },
  ],
};

export const CHAPTER7 = [lesson28, lesson29, lesson30, lesson31];

// ---------- Nâng cao ----------

export const ADVANCED7 = {
  c7b28: [
    // Largest decimal with two decimal places below a number.
    () => {
      const a = decimal(100, 9999, 2);
      const largest = Math.random() < 0.5;
      return inputD(
        bi((L) => T(L, `Tìm số thập phân <b>${largest ? 'lớn nhất' : 'nhỏ nhất'}</b> có hai chữ số ở phần thập phân và ${largest ? 'nhỏ hơn' : 'lớn hơn'} ${D(a, L)}.`, `Find the <b>${largest ? 'largest' : 'smallest'}</b> decimal with two decimal places that is ${largest ? 'less' : 'greater'} than ${D(a, L)}.`)),
        exact(largest ? a - 0.01 : a + 0.01),
        bi((L) => `${D(a, L)} ${largest ? '−' : '+'} ${D(0.01, L)} = ${D(largest ? a - 0.01 : a + 0.01, L)}`),
      );
    },
    // Smallest missing digit.
    () => {
      const w = int(1, 9);
      const [p, q] = [int(1, 8), int(0, 9)];
      const r = int(0, 9);
      const ok = (x) => 10 * x + r > 10 * p + q; // compare in whole hundredths, exactly
      const x = [...Array(10).keys()].find(ok);
      if (x === undefined) return ADVANCED7.c7b28[1]();
      const sep = (L) => (L === 'vi' ? ',' : '.');
      return input(
        bi((L) => T(L, `Tìm chữ số x nhỏ nhất để ${eq(`${w}${sep(L)}x${r} &gt; ${D(w + p / 10 + q / 100, L)}`)}.`, `Find the smallest digit x with ${eq(`${w}${sep(L)}x${r} &gt; ${D(w + p / 10 + q / 100, L)}`)}.`)),
        x,
        bi((L) => T(L, `So sánh hàng phần mười rồi phần trăm: x = ${x}.`, `Compare tenths, then hundredths: x = ${x}.`)),
      );
    },
    // Fraction to decimal via a power of 10.
    () => {
      const [d, mult] = pick([[2, 5], [4, 25], [5, 2], [20, 5], [25, 4], [50, 2], [8, 125]]);
      let n;
      do { n = int(1, d * 3); } while (gcd(n, d) !== 1);
      return inputD(
        bi((L) => `${T(L, 'Viết dưới dạng số thập phân:', 'Write as a decimal:')} ${frac(n, d)}`),
        n / d,
        bi((L) => `${frac(n, d)} = ${frac(`${n} · ${mult}`, `${d} · ${mult}`)} = ${frac(n * mult, d * mult)} = ${D(n / d, L)}`),
      );
    },
  ],
  c7b29: [
    // Common factor with decimals.
    () => {
      const a = pick([2.5, 1.25, 0.4, 0.25, 12.5, 7.5]);
      const b = decimal(11, 89, 1);
      const c = exact(10 - b);
      return inputD(
        bi((L) => `${T(L, 'Tính nhanh:', 'Work out quickly:')} ${eq(`${D(a, L)} · ${D(b, L)} + ${D(a, L)} · ${D(c, L)}`)}`),
        exact(a * 10),
        bi((L) => `${D(a, L)} · (${D(b, L)} + ${D(c, L)}) = ${D(a, L)} · 10 = ${D(a * 10, L)}`),
      );
    },
    // Find x.
    () => {
      const x = decimal(-999, 999, 2);
      const a = decimal(2, 99, 1);
      const minus = Math.random() < 0.5;
      const rhs = exact(minus ? x - a : x * a);
      return inputD(
        bi((L) => `${T(L, 'Tìm x, biết:', 'Find x:')} ${eq(minus ? `x − ${D(a, L)} = ${D(rhs, L)}` : `x · ${D(a, L)} = ${D(rhs, L)}`)}`),
        exact(x),
        bi((L) => (minus ? `x = ${D(rhs, L)} + ${D(a, L)} = ${D(x, L)}` : `x = ${D(rhs, L)} : ${D(a, L)} = ${D(x, L)}`)),
        true,
      );
    },
    // Mixed expression.
    () => {
      const [a, b, c, d] = [decimal(-99, 99, 1), decimal(1, 99, 1), decimal(1, 99, 1), int(2, 9)];
      const value = exact(a - (b - c) * d);
      return inputD(
        bi((L) => `${T(L, 'Tính:', 'Work out:')} ${eq(`${D(a, L)} − (${D(b, L)} − ${D(c, L)}) · ${d}`)}`),
        value,
        bi((L) => `${D(a, L)} − ${P(exact(b - c), L)} · ${d} = ${D(a, L)} − ${P(exact((b - c) * d), L)} = ${D(value, L)}`),
        true,
      );
    },
  ],
  c7b30: [
    // Range that rounds to a value.
    () => {
      const n = 100 * int(10, 99);
      const largest = Math.random() < 0.5;
      return input(
        bi((L) => T(L, `Tìm số tự nhiên <b>${largest ? 'lớn' : 'nhỏ'} nhất</b> mà làm tròn đến hàng trăm được ${fmt(n, L)}.`, `Find the <b>${largest ? 'largest' : 'smallest'}</b> whole number that rounds to ${fmt(n, L)} (nearest hundred).`)),
        largest ? n + 49 : n - 50,
        bi((L) => T(L, `Các số từ ${fmt(n - 50, L)} đến ${fmt(n + 49, L)} đều làm tròn thành ${fmt(n, L)}.`, `Every number from ${fmt(n - 50, L)} to ${fmt(n + 49, L)} rounds to ${fmt(n, L)}.`)),
      );
    },
    // Spot the misplaced point by estimating.
    () => {
      const [a, b] = [decimal(101, 999, 1), decimal(11, 99, 1)];
      const right = exact(a * b);
      const honest = Math.random() < 0.5;
      const shown = honest ? right : exact(right * pick([10, 0.1]));
      return choice(
        bi((L) => T(L, `Bạn Minh tính ${eq(`${D(a, L)} · ${D(b, L)} = ${D(shown, L)}`)}. Dùng ước lượng, kết quả này đúng hay sai?`, `Minh worked out ${eq(`${D(a, L)} · ${D(b, L)} = ${D(shown, L)}`)}. Using an estimate, is it right or wrong?`)),
        honest ? YES : NO,
        [honest ? NO : YES],
        bi((L) => `${D(a, L)} · ${D(b, L)} ≈ ${Math.round(a)} · ${Math.round(b)} = ${fmt(Math.round(a) * Math.round(b), L)} — ${T(L, 'kết quả đúng', 'exact')}: ${D(right, L)}`),
      );
    },
    // Round a negative decimal.
    () => {
      const x = -decimal(1001, 99999, 3);
      const places = pick([1, 2]);
      return inputD(
        bi((L) => T(L, `Làm tròn ${D(x, L)} đến ${PLACE_NAMES.vi[places]}.`, `Round ${D(x, L)} to the nearest ${PLACE_NAMES.en[places]}.`)),
        exact(roundTo(x, places)),
        bi((L) => T(L, `Làm tròn phần số ${D(-x, L)} ≈ ${D(-roundTo(x, places), L)} rồi giữ dấu "−": ${D(roundTo(x, places), L)}.`, `Round ${D(-x, L)} ≈ ${D(-roundTo(x, places), L)} and keep the "−": ${D(roundTo(x, places), L)}.`)),
        true,
      );
    },
  ],
  c7b31: [
    // Up then down by the same percentage.
    () => {
      const m = pick([10, 20, 25, 50]);
      const price = 100 * int(2, 20);
      const final = exact(price * (1 + m / 100) * (1 - m / 100));
      return inputD(
        bi((L) => T(L, `Giá một món hàng là ${fmt(price, L)} nghìn đồng, tăng ${m}% rồi lại giảm ${m}%. Giá cuối cùng là bao nhiêu nghìn đồng?`, `An item costs ${fmt(price, L)} thousand dong. Its price rises ${m}%, then falls ${m}%. What is the final price (thousand dong)?`)),
        final,
        bi((L) => `${fmt(price, L)} · ${D(1 + m / 100, L)} = ${D(price * (1 + m / 100), L)}; ${D(price * (1 + m / 100), L)} · ${D(1 - m / 100, L)} = ${D(final, L)} — ${T(L, 'không quay về giá cũ!', 'not back to the start!')}`),
      );
    },
    // Savings interest.
    () => {
      const money = int(2, 50) * 10;
      const rate = pick([4, 5, 5.5, 6, 6.5, 7]);
      const total = exact(money + (money * rate) / 100);
      return inputD(
        bi((L) => T(L, `Gửi tiết kiệm ${money} triệu đồng với lãi suất ${D(rate, L)}% một năm. Sau một năm, cả gốc và lãi là bao nhiêu triệu đồng?`, `${money} million dong is saved at ${D(rate, L)}% interest a year. After one year, how much is there in total (million dong)?`)),
        total,
        bi((L) => `${money} + ${money} · ${D(rate, L)}% = ${money} + ${D((money * rate) / 100, L)} = ${D(total, L)}`),
      );
    },
    // Percentage increase.
    () => {
      const from = 20 * int(2, 25);
      const m = pick([5, 10, 15, 20, 25, 30, 40, 50]);
      const to = from + (from * m) / 100;
      return inputD(
        bi((L) => T(L, `Số học sinh tham gia câu lạc bộ tăng từ ${from} lên ${to} em. Số học sinh đã tăng bao nhiêu phần trăm? (chỉ ghi số)`, `Club membership rose from ${from} to ${to}. By what percentage did it rise? (number only)`)),
        m,
        bi((L) => `(${to} − ${from}) : ${from} · 100% = ${to - from} : ${from} · 100% = ${m}%`),
      );
    },
  ],
};
