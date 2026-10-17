import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, ALL_LESSONS, makeLessonRound, questionKey } from '../public/js/grade6/index.js';
import { toRoman } from '../public/js/grade6/chapter1.js';

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
          assert.ok(Number.isInteger(q.answer) && q.answer >= 0, `${where} → ${q.answer}`);
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

test('chapters II–V are listed, waiting for lessons', () => {
  assert.deepEqual(CHAPTERS.map((c) => c.number), ['I', 'II', 'III', 'IV', 'V']);
});
