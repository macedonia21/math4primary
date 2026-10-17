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
          assert.ok(Number.isInteger(q.answer) && (q.signed || q.answer >= 0), `${where} → ${q.answer}`);
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

test('volume 1 (lessons 1–22) and chapter VI (23–27) are complete; VII–IX are listed', () => {
  assert.deepEqual(CHAPTERS.map((c) => c.number), ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']);
  assert.deepEqual(ALL_LESSONS.map((l) => l.number), Array.from({ length: 27 }, (_, i) => i + 1));
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
