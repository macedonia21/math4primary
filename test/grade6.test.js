import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, ALL_LESSONS, makeLessonRound, questionKey } from '../public/js/grade6/index.js';
import { toRoman } from '../public/js/grade6/chapter1.js';
import { shapeSvg, SYMMETRY } from '../public/js/grade6/shapes.js';

const RUNS = 300;
const isBi = (x) => typeof x?.vi === 'string' && typeof x?.en === 'string' && x.vi && x.en;

test('every lesson has bilingual theory and examples with the same steps in both languages', () => {
  assert.ok(ALL_LESSONS.length >= 7);
  for (const lesson of ALL_LESSONS) {
    assert.ok(isBi(lesson.title), lesson.id);
    assert.ok(lesson.points.length >= 1, lesson.id);
    for (const point of lesson.points) {
      assert.ok(isBi(point.title), `${lesson.id} point title`);
      assert.equal(point.theory.vi.length, point.theory.en.length, `${lesson.id} theory length`);
      assert.ok(isBi(point.example.caption), `${lesson.id} caption`);
      const vi = point.example.frames('vi');
      const en = point.example.frames('en');
      assert.ok(vi.length >= 2, `${lesson.id} has steps`);
      assert.equal(vi.length, en.length, `${lesson.id} same steps in both languages`);
      assert.ok([...vi, ...en].every((f) => typeof f === 'string' && f.length > 0));
    }
    assert.ok(lesson.exercises.length >= 3, `${lesson.id} exercise kinds`);
  }
});

test('every exercise is well formed: bilingual, answer present, no duplicate choices', () => {
  for (const lesson of ALL_LESSONS) {
    [...lesson.exercises, ...lesson.advanced].forEach((make, k) => {
      for (let i = 0; i < RUNS; i++) {
        const q = make();
        const where = `${lesson.id} exercise ${k + 1}: ${q.text?.vi}`;
        assert.ok(isBi(q.text), where);
        assert.ok(isBi(q.explain), `${where} (explain)`);
        if (q.input) {
          // Negative answers only where the number pad offers a ± key.
          // Decimal answers have at most 4 decimal places (the pad allows 4).
          const whole = q.decimal ? Math.abs(q.answer * 10000 - Math.round(q.answer * 10000)) < 1e-6 : Number.isInteger(q.answer);
          assert.ok(whole && (q.signed || q.answer >= 0), `${where} → ${q.answer}`);
        } else {
          assert.ok(q.choices.length >= 2, where);
          assert.ok(q.choices.includes(q.answer), where);
          const shown = q.choices.map((c) => JSON.stringify(c));
          assert.equal(new Set(shown).size, shown.length, `${where} duplicate choices ${shown}`);
        }
      }
    });
  }
});

test('order-of-operations answers match a real evaluation of the expression', () => {
  const lesson = ALL_LESSONS.find((l) => l.id === 'c1b7');
  for (let i = 0; i < RUNS; i++) {
    const q = (i % 2 ? lesson.advanced : lesson.exercises)[0]();
    const js = q.check.html
      .replace(/<sup>(\d+)<\/sup>/g, '**$1')
      .replaceAll('·', '*').replaceAll(':', '/').replaceAll('−', '-')
      .replaceAll('[', '(').replaceAll(']', ')')
      .replaceAll('{', '(').replaceAll('}', ')');
    // eslint-disable-next-line no-new-func
    assert.equal(Function(`return ${js}`)(), q.answer, q.check.html);
  }
});

test('Roman numerals 1 to 30 are written correctly', () => {
  assert.deepEqual([1, 4, 5, 9, 10, 14, 19, 24, 29, 30].map(toRoman),
    ['I', 'IV', 'V', 'IX', 'X', 'XIV', 'XIX', 'XXIV', 'XXIX', 'XXX']);
});

test('basic and advanced practice rounds have 10 different questions', () => {
  for (const lesson of ALL_LESSONS) {
    assert.ok(lesson.advanced.length >= 3, `${lesson.id} advanced kinds`);
    for (const mode of ['basic', 'advanced']) {
      for (let i = 0; i < 20; i++) {
        const round = makeLessonRound(lesson, 10, mode);
        assert.equal(round.length, 10);
        assert.equal(new Set(round.map(questionKey)).size, 10, `${lesson.id} ${mode}`);
      }
    }
  }
});

test('advanced answers that can be checked by brute force are right', () => {
  const find = (id) => ALL_LESSONS.find((l) => l.id === id).advanced;
  // Page numbering: count digits directly.
  for (let i = 0; i < 100; i++) {
    const q = find('c1b2')[0]();
    const n = Number(q.text.en.match(/has (\d+) pages/)[1]);
    let digits = 0;
    for (let p = 1; p <= n; p++) digits += String(p).length;
    assert.equal(q.answer, digits);
  }
  // Last digit of a power: compute with BigInt.
  for (let i = 0; i < 100; i++) {
    const q = find('c1b6')[0]();
    const [, a, n] = q.text.en.match(/(\d+)<sup>(\d+)<\/sup>/);
    assert.equal(q.answer, Number(BigInt(a) ** BigInt(n) % 10n));
  }
  // Arithmetic series: add the terms one by one.
  for (let i = 0; i < 100; i++) {
    const q = find('c1b4')[0]();
    const [a, second, , b] = q.text.en.match(/\d+/g).map(Number);
    let sum = 0;
    for (let v = a; v <= b; v += second - a) sum += v;
    assert.equal(q.answer, sum);
  }
});

test('both volumes (lessons 1–43, chapters I–IX) are complete', () => {
  assert.deepEqual(CHAPTERS.map((c) => c.number), ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']);
  assert.deepEqual(ALL_LESSONS.map((l) => l.number), Array.from({ length: 43 }, (_, i) => i + 1));
  assert.ok(ALL_LESSONS.every((l) => l.advanced.length >= 3), 'every lesson has challenge exercises');
});

test('shape drawings show as many lines of symmetry as the shape really has', () => {
  for (const [kind, { axes, centre }] of Object.entries(SYMMETRY)) {
    const svg = shapeSvg(kind, { axes: true, centre: true });
    const axisGroup = svg.match(/<g class="sh-axes">(.*?)<\/g>/s);
    assert.equal(axisGroup ? (axisGroup[1].match(/<line/g) ?? []).length : 0, axes, kind);
    assert.ok(svg.includes('sh-centre'), kind);
    assert.equal(typeof centre, 'boolean');
  }
});

test('chapter III integer answers agree with a direct evaluation', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  const toJs = (html) => html.replace(/<[^>]+>/g, '').replaceAll('−', '-').replaceAll('·', '*').replaceAll(':', '/')
    .replaceAll('[', '(').replaceAll(']', ')');
  // eslint-disable-next-line no-new-func
  const evaluate = (html) => Function(`return ${toJs(html)}`)();
  const exprOf = (q) => q.text.en.match(/<span class="eq">(.*)<\/span>/)[1];
  for (let i = 0; i < 200; i++) {
    for (const [id, k] of [['c3b14', 0], ['c3b14', 1], ['c3b14', 2], ['c3b14', 4], ['c3b16', 0], ['c3b16', 2], ['c3b16', 3], ['c3b17', 0]]) {
      const q = lesson(id).exercises[k]();
      assert.equal(evaluate(exprOf(q)), q.answer, `${id} #${k}: ${exprOf(q)}`);
    }
    let q = lesson('c3b15').exercises[2]();
    assert.equal(evaluate(q.check.html), q.answer, q.check.html);
    q = lesson('c3b15').advanced[2]();
    assert.equal(evaluate(q.check.html), q.answer, q.check.html);
    // Alternating sum 1 − 2 + 3 − … ± n, added up term by term.
    q = lesson('c3b15').advanced[0]();
    const n = Number(exprOf(q).match(/(\d+)$/)[1]);
    let s = 0;
    for (let t = 1; t <= n; t++) s += t % 2 ? t : -t;
    assert.equal(q.answer, s, exprOf(q));
    // Sum of all integers in a range.
    q = lesson('c3b13').advanced[0]();
    const [, lo, op1, op2, hi] = exprOf(q).match(/(−?\d+) (&lt;|≤) x (&lt;|≤) (−?\d+)/);
    const from = Number(lo.replace('−', '-')) + (op1 === '&lt;' ? 1 : 0);
    const to = Number(hi.replace('−', '-')) - (op2 === '&lt;' ? 1 : 0);
    let total = 0;
    for (let x = from; x <= to; x++) total += x;
    assert.equal(q.answer, total, exprOf(q));
  }
});

test('chapter II answers agree with brute-force counting', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  const nums = (q) => q.text.en.replace(/<[^>]+>/g, ' ').match(/\d+/g).map(Number);
  const slowGcd = (...xs) => { for (let d = Math.min(...xs); ; d--) if (xs.every((x) => x % d === 0)) return d; };
  const slowLcm = (...xs) => { for (let m = Math.max(...xs); ; m++) if (xs.every((x) => m % x === 0)) return m; };
  const isPrimeSlow = (n) => n > 1 && [...Array(n).keys()].slice(2).every((d) => n % d);
  for (let i = 0; i < 200; i++) {
    let q = lesson('c2b11').exercises[0]();
    assert.equal(q.answer, slowGcd(...nums(q)), q.text.en);
    q = lesson('c2b11').exercises[4]();
    assert.equal(q.answer, slowGcd(...nums(q)), q.text.en);
    q = lesson('c2b12').exercises[0]();
    assert.equal(q.answer, slowLcm(...nums(q)), q.text.en);
    q = lesson('c2b12').exercises[1]();
    assert.equal(q.answer, slowLcm(...nums(q)), q.text.en);
    q = lesson('c2b10').exercises[3]();
    const [below] = nums(q);
    assert.equal(q.answer, [...Array(below).keys()].filter(isPrimeSlow).length, q.text.en);
    q = lesson('c2b8').advanced[0]();
    const [c] = nums(q);
    assert.equal(q.answer, [...Array(c + 1).keys()].slice(1).filter((n) => (n + c) % n === 0).length, q.text.en);
    q = lesson('c2b12').advanced[0]();
    const [lo, hi, a, b, cc] = nums(q);
    const fits = [...Array(hi - lo + 1).keys()].map((k) => lo + k).filter((n) => n % a === 0 && n % b === 0 && n % cc === 0);
    assert.deepEqual(fits, [q.answer], q.text.en);
  }
});

test('chapter VII decimal answers agree with a direct evaluation', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  // English text uses "." for decimals and "," for thousands.
  const evaluate = (html) => Function(`return ${html.replace(/<[^>]+>/g, '').replaceAll(',', '').replaceAll('−', '-').replaceAll('·', '*').replaceAll(':', '/')}`)();
  const exprOf = (q) => q.text.en.match(/<span class="eq">(.*)<\/span>/)[1];
  for (let i = 0; i < 300; i++) {
    for (const [id, k, adv] of [['c7b29', 0], ['c7b29', 1], ['c7b29', 2], ['c7b29', 2, true]]) {
      const q = (adv ? lesson(id).advanced : lesson(id).exercises)[k]();
      assert.ok(Math.abs(evaluate(exprOf(q)) - q.answer) < 1e-9, `${id} #${k}: ${exprOf(q)} → ${q.answer}`);
    }
  }
});

test('chapter VIII counting answers agree with real drawings and direct checks', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  // Exact line through two integer points, as a normalised key.
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const lineKey = ([x1, y1], [x2, y2]) => {
    let [a, b, c] = [y2 - y1, x1 - x2, (y2 - y1) * x1 + (x1 - x2) * y1];
    const g = gcd(gcd(a, b), c) || 1;
    [a, b, c] = [a / g, b / g, c / g];
    if (a < 0 || (a === 0 && b < 0)) [a, b, c] = [-a, -b, -c];
    return `${a},${b},${c}`;
  };
  const rnd = (n) => Math.floor(Math.random() * n);
  for (let i = 0; i < 40; i++) {
    // Intersections of real lines y = s·x + t (s equal for the parallel ones).
    for (const k of [0, 3]) {
      const q = lesson('c8b32').advanced[k]();
      const { lines, parallel } = q.check;
      for (;;) {
        const ls = Array.from({ length: lines }, (_, j) => [j < parallel ? 0 : j + 1, rnd(1000)]);
        const pts = new Set();
        for (let a = 0; a < lines; a++) {
          for (let b = a + 1; b < lines; b++) {
            const [s1, t1] = ls[a];
            const [s2, t2] = ls[b];
            if (s1 !== s2) pts.add(`${(t2 - t1) / (s1 - s2)},${(s1 * t2 - s2 * t1) / (s1 - s2)}`);
          }
        }
        const pairs = lines * (lines - 1) / 2 - parallel * (parallel - 1) / 2;
        if (pts.size !== pairs) continue; // three lines met by chance: draw again
        assert.equal(q.answer, pts.size, q.text.en);
        break;
      }
    }
    // Lines through points: k on y = 0, the rest scattered, no other three in a line.
    const q = lesson('c8b32').advanced[1]();
    const { points, collinear } = q.check;
    for (;;) {
      const pts = [...Array.from({ length: collinear }, (_, j) => [j * 7 + rnd(5), 0]),
        ...Array.from({ length: points - collinear }, () => [rnd(500), 1 + rnd(500)])];
      const keys = new Map();
      for (let a = 0; a < points; a++) {
        for (let b = a + 1; b < points; b++) {
          const key = lineKey(pts[a], pts[b]);
          keys.set(key, (keys.get(key) ?? new Set()).add(a).add(b));
        }
      }
      const extra = [...keys.values()].filter((set) => set.size > 2 && ![...set].every((j) => j < collinear));
      if (extra.length || new Set(pts.map(String)).size < points) continue;
      assert.equal(q.answer, keys.size, q.text.en);
      break;
    }
    // Angles from m lines: count pairs of 2m rays, minus the opposite pairs if asked.
    const a = lesson('c8b36').advanced[0]();
    // Ray j points at j · 180° / m, so rays j and j + m are opposite.
    const m = a.check.lines;
    let count = 0;
    for (let x = 0; x < 2 * m; x++) {
      for (let y = x + 1; y < 2 * m; y++) if (a.check.withStraight || y - x !== m) count++;
    }
    assert.equal(a.answer, count, a.text.en);
  }
});

test('chapter VIII rays, protractors and clocks are read correctly', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  const dir = (order, [p, q]) => Math.sign(order.indexOf(q) - order.indexOf(p));
  const parse = (c) => c.en.match(/Ray (\w)(\w)$/).slice(1);
  for (let i = 0; i < 300; i++) {
    for (const k of [1, 2]) {
      const q = lesson('c8b33').exercises[k]();
      const { order, kind, ray } = q.check;
      for (const c of q.choices) {
        const r = parse(c);
        const sameOrigin = r[0] === ray[0];
        const fits = kind === 'opposite' ? sameOrigin && dir(order, r) === -dir(order, ray) : sameOrigin && dir(order, r) === dir(order, ray);
        assert.equal(fits, c === q.answer, `${kind} of ${ray.join('')} in ${order.join('')}: ${c.en}`);
      }
    }
    const b = lesson('c8b33').advanced[0]();
    const { order, between: [x, z] } = b.check;
    const lo = Math.min(order.indexOf(x), order.indexOf(z));
    const hi = Math.max(order.indexOf(x), order.indexOf(z));
    assert.ok(order.indexOf(b.answer) > lo && order.indexOf(b.answer) < hi, b.text.en);
    // Protractor: the rays are drawn at a and b degrees.
    const p = lesson('c8b37').exercises[1]();
    assert.equal(p.answer, p.check.b - p.check.a);
    assert.ok(p.answer > 0 && p.check.b <= 180);
    // Clocks: hand positions in degrees from 12.
    for (const c of [lesson('c8b37').exercises[2](), lesson('c8b37').advanced[1]()]) {
      const { h, m } = c.check;
      const diff = Math.abs((h % 12) * 30 + m / 2 - m * 6);
      assert.equal(c.answer, Math.min(diff, 360 - diff), c.text.en);
    }
  }
});

test('chapter IX charts and pictograms show the values the answers use', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  // Read bar heights back from the SVG using the axis labels.
  const readBars = (html) => {
    const ticks = [...html.matchAll(/<text class="ch-tick" x="[\d.]+" y="([\d.]+)">(\d+)<\/text>/g)].map((m) => [Number(m[1]) - 4, Number(m[2])]);
    const [y0, v0] = ticks[0];
    const [y1, v1] = ticks.at(-1);
    const bars = [...html.matchAll(/<rect class="ch-bar s(\d)" x="([\d.]+)" y="([\d.]+)" width="[\d.]+" height="([\d.]+)"\/>/g)]
      .filter((m) => Number(m[3]) > 8) // skip the legend squares (drawn at y = 6)
      .map((m) => ({ s: Number(m[1]), x: Number(m[2]), v: Math.round(v0 + ((y0 - Number(m[3])) / (y0 - y1)) * (v1 - v0)) }));
    return [0, 1].map((s) => bars.filter((b) => b.s === s).sort((p, q) => p.x - q.x).map((b) => b.v));
  };
  for (let i = 0; i < 200; i++) {
    let q = lesson('c9b40').exercises[0]();
    assert.equal(readBars(q.text.en)[0][q.check.index], q.answer, q.text.en);
    q = lesson('c9b40').exercises[3]();
    assert.equal(readBars(q.text.en)[0].reduce((a, b) => a + b, 0), q.answer);
    q = lesson('c9b41').exercises[0]();
    assert.equal(readBars(q.text.en)[q.check.series][q.check.index], q.answer);
    q = lesson('c9b41').exercises[2]();
    assert.equal(readBars(q.text.en)[q.check.series].reduce((a, b) => a + b, 0), q.answer);
    // Pictogram: whole icons plus half icons, times the key.
    q = lesson('c9b39').exercises[0]();
    const per = Number(q.text.en.match(/<p class="pg-key">\S+ = (\d+)/)[1]);
    const row = q.text.en.match(/<b>([^<]+)<\/b>/)[1];
    const icons = q.text.en.match(new RegExp(`<span class="pg-label">${row}</span><span class="pg-icons">(.*?)</span></div>`))[1];
    const half = icons.includes('pg-half');
    const whole = [...icons.replace(/<span class="pg-half">.*?<\/span>/, '')].filter((c) => /\p{Extended_Pictographic}/u.test(c)).length;
    assert.equal(q.answer, (whole + (half ? 0.5 : 0)) * per, q.text.en);
  }
});

test('chapter IX counts agree with counting the outcomes one by one', () => {
  const lesson = (id) => ALL_LESSONS.find((l) => l.id === id);
  for (let i = 0; i < 200; i++) {
    let q = lesson('c9b38').exercises[3]();
    const words = q.text.en.match(/answered: (.*)\. How many chose (\w+)/);
    assert.equal(q.answer, words[1].split(', ').filter((w) => w.toLowerCase() === words[2]).length, q.text.en);
    q = lesson('c9b42').exercises[2]();
    let c = 0;
    for (let x = 1; x <= q.check.n; x++) if (q.check.test(x)) c++;
    assert.equal(q.answer, c);
    q = lesson('c9b43').exercises[1]();
    const rolls = q.text.en.match(/rolled \d+ times: ([\d, ]+)\./)[1].split(', ').map(Number);
    assert.ok(Math.abs(q.answer - rolls.filter(q.check.test).length / rolls.length) < 1e-9);
    q = lesson('c9b42').advanced[0]();
    let pairs = 0;
    for (let a = 1; a <= 6; a++) {
      for (let b = 1; b <= 6; b++) {
        const ok = { sum: a + b === q.check.s, evenProduct: (a * b) % 2 === 0, oddProduct: (a * b) % 2 === 1 }[q.check.kind];
        if (ok) pairs++;
      }
    }
    assert.equal(q.answer, pairs, q.text.en);
    q = lesson('c9b42').advanced[2]();
    c = 0;
    for (let x = 1; x <= q.check.n; x++) if (x % q.check.a === 0 || x % q.check.b === 0) c++;
    assert.equal(q.answer, c);
    q = lesson('c9b38').advanced[0]();
    assert.equal(q.answer, q.text.en.match(/marks: ([\d, ]+)\./)[1].split(', ').map(Number).filter((m) => m >= q.check.t).length);
  }
});
