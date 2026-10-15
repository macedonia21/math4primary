import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeQuestion, makeRound, questionKey, starsForScore, ACTIVITIES, LEVELS, MAX_BY_LEVEL, levelsFor, tableFor,
} from '../public/js/questions.js';

const RUNS = 500;
const each = (activity, level, fn) => {
  for (let i = 0; i < RUNS; i++) fn(makeQuestion(activity, level));
};
const carries = (a, b) => (a % 10) + (b % 10) >= 10;

test('every question has unique choices that include the answer', () => {
  for (const activity of ACTIVITIES.filter((a) => a !== 'mul')) {
    for (const level of LEVELS) {
      each(activity, level, (q) => {
        assert.ok(q.choices.includes(q.answer));
        assert.equal(new Set(q.choices).size, q.choices.length);
        assert.equal(q.choices.length, q.prompt.type === 'compare' ? 2 : 4);
        for (const c of q.choices) {
          assert.ok(c >= 0 && c <= MAX_BY_LEVEL[level], `${activity} L${level}: choice ${c}`);
        }
      });
    }
  }
});

test('addition is correct and stays within the level limit', () => {
  for (const level of LEVELS) {
    each('add', level, ({ prompt, answer }) => {
      assert.equal(prompt.op, '+');
      assert.equal(prompt.a + prompt.b, answer);
      assert.ok(prompt.a >= 1 && prompt.b >= 1);
      assert.ok(answer <= MAX_BY_LEVEL[level]);
    });
  }
});

test('subtraction is correct and never goes below zero', () => {
  for (const level of LEVELS) {
    each('sub', level, ({ prompt, answer }) => {
      assert.equal(prompt.op, '-');
      assert.equal(prompt.a - prompt.b, answer);
      assert.ok(answer >= 0);
      assert.ok(prompt.a <= MAX_BY_LEVEL[level]);
    });
  }
});

test('carrying and borrowing only appear on levels 3 and 5', () => {
  for (const level of [2, 4]) {
    each('add', level, ({ prompt }) => assert.ok(!carries(prompt.a, prompt.b)));
    each('sub', level, ({ prompt, answer }) => assert.ok(!carries(answer, prompt.b)));
  }
  for (const level of [3, 5]) {
    each('add', level, ({ prompt }) => assert.ok(carries(prompt.a, prompt.b)));
    each('sub', level, ({ prompt, answer }) => assert.ok(carries(answer, prompt.b)));
  }
});

test('calculations carry one emoji for their counting objects', () => {
  for (const level of LEVELS) {
    each('mixed', level, ({ prompt }) => {
      assert.equal(typeof prompt.emoji, 'string');
      assert.ok(prompt.emoji.length > 0);
    });
  }
});

test('mixed challenge uses both operations', () => {
  const ops = new Set();
  each('mixed', 3, ({ prompt }) => ops.add(prompt.op));
  assert.deepEqual([...ops].sort(), ['+', '-']);
});

test('number questions match their prompt', () => {
  for (const level of LEVELS) {
    each('numbers', level, ({ prompt, answer, choices }) => {
      if (prompt.type === 'count') {
        assert.equal(prompt.n, answer);
        assert.ok(!choices.includes(0));
      } else if (prompt.type === 'compare') {
        const expected = prompt.want === 'bigger' ? Math.max(...choices) : Math.min(...choices);
        assert.equal(answer, expected);
      } else {
        const filled = prompt.items.map((v) => v ?? answer);
        const step = filled[1] - filled[0];
        assert.ok(step > 0);
        assert.equal(filled[2] - filled[1], step);
        assert.equal(filled[3] - filled[2], step);
        assert.ok(filled[3] <= MAX_BY_LEVEL[level]);
        assert.equal(prompt.items.filter((v) => v === null).length, 1);
      }
    });
  }
});

test('times tables ask the chosen table, 1 to 10', () => {
  for (const level of levelsFor('mul')) {
    const tables = new Set();
    each('mul', level, ({ prompt, answer, choices }) => {
      assert.equal(prompt.op, '×');
      assert.equal(prompt.a * prompt.b, answer);
      assert.ok(prompt.b >= 1 && prompt.b <= 10);
      if (tableFor(level)) assert.equal(prompt.a, tableFor(level));
      tables.add(prompt.a);
      assert.equal(choices.length, 4);
      assert.equal(new Set(choices).size, 4);
      assert.ok(choices.includes(answer));
      assert.ok(choices.every((c) => c > 0));
    });
    if (!tableFor(level)) assert.deepEqual([...tables].sort((x, y) => x - y), [2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }
});

test('times tables run easiest first, then all mixed', () => {
  assert.deepEqual(levelsFor('mul').map(tableFor), [2, 5, 10, 9, 4, 3, 6, 8, 7, null]);
});

test('a round never repeats a question', () => {
  for (const activity of ACTIVITIES) {
    for (const level of levelsFor(activity)) {
      for (let i = 0; i < 30; i++) {
        const round = makeRound(activity, level);
        assert.equal(round.length, 10);
        const keys = round.map(questionKey);
        assert.equal(new Set(keys).size, 10, `${activity} L${level}: ${keys.join(' ')}`);
      }
    }
  }
});

test('3 + 5 and 5 + 3 count as the same question', () => {
  const q = (a, b) => ({ prompt: { type: 'expr', a, op: '+', b, emoji: '🍎' }, choices: [] });
  assert.equal(questionKey(q(3, 5)), questionKey(q(5, 3)));
});

test('whole-tens sums are only a small share of level 4', () => {
  let tens = 0;
  each('add', 4, ({ prompt }) => { if (prompt.a % 10 === 0 && prompt.b % 10 === 0) tens++; });
  assert.ok(tens / RUNS < 0.3, `${tens} of ${RUNS}`);
});

test('stars follow the score', () => {
  assert.deepEqual([5, 6, 7, 8, 9, 10].map(starsForScore), [0, 1, 1, 2, 2, 3]);
});
