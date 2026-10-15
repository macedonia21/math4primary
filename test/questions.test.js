import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeQuestion, starsForScore, ACTIVITIES, LEVELS, MAX_BY_LEVEL,
} from '../public/js/questions.js';

const RUNS = 500;
const each = (activity, level, fn) => {
  for (let i = 0; i < RUNS; i++) fn(makeQuestion(activity, level));
};
const carries = (a, b) => (a % 10) + (b % 10) >= 10;

test('every question has unique choices that include the answer', () => {
  for (const activity of ACTIVITIES) {
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

test('stars follow the score', () => {
  assert.deepEqual([5, 6, 7, 8, 9, 10].map(starsForScore), [0, 1, 1, 2, 2, 3]);
});
