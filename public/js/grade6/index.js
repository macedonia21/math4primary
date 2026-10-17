// Grade 6 (Toán 6, tập một): chapters, lessons and practice rounds.

import { CHAPTER1 } from './chapter1.js';
import { ADVANCED } from './chapter1Advanced.js';
import { CHAPTER2 } from './chapter2.js';
import { ADVANCED2 } from './chapter2Advanced.js';
import { CHAPTER3 } from './chapter3.js';
import { ADVANCED3 } from './chapter3Advanced.js';
import { CHAPTER4, ADVANCED4 } from './chapter4.js';
import { CHAPTER5, ADVANCED5 } from './chapter5.js';
import { CHAPTER6, ADVANCED6 } from './chapter6.js';
import { shuffle } from './util.js';

export const CHAPTERS = [
  { number: 'I', volume: 1, title: { vi: 'Tập hợp các số tự nhiên', en: 'The set of natural numbers' }, lessons: CHAPTER1 },
  { number: 'II', volume: 1, title: { vi: 'Tính chia hết trong tập hợp các số tự nhiên', en: 'Divisibility in the natural numbers' }, lessons: CHAPTER2 },
  { number: 'III', volume: 1, title: { vi: 'Số nguyên', en: 'Integers' }, lessons: CHAPTER3 },
  { number: 'IV', volume: 1, title: { vi: 'Một số hình phẳng trong thực tiễn', en: 'Plane shapes in real life' }, lessons: CHAPTER4 },
  { number: 'V', volume: 1, title: { vi: 'Tính đối xứng của hình phẳng trong tự nhiên', en: 'Symmetry of shapes in nature' }, lessons: CHAPTER5 },
  // Volume 2
  { number: 'VI', volume: 2, title: { vi: 'Phân số', en: 'Fractions' }, lessons: CHAPTER6 },
  { number: 'VII', volume: 2, title: { vi: 'Số thập phân', en: 'Decimals' }, lessons: [] },
  { number: 'VIII', volume: 2, title: { vi: 'Những hình hình học cơ bản', en: 'Basic geometric figures' }, lessons: [] },
  { number: 'IX', volume: 2, title: { vi: 'Dữ liệu và xác suất thực nghiệm', en: 'Data and experimental probability' }, lessons: [] },
];

// Each lesson gets its chapter and its advanced exercises (empty if none yet).
const ALL_ADVANCED = {
  ...ADVANCED, ...ADVANCED2, ...ADVANCED3, ...ADVANCED4, ...ADVANCED5, ...ADVANCED6,
};
for (const chapter of CHAPTERS) {
  chapter.lessons = chapter.lessons.map((lesson) => ({ ...lesson, chapter, advanced: ALL_ADVANCED[lesson.id] ?? [] }));
}
export const ALL_LESSONS = CHAPTERS.flatMap((chapter) => chapter.lessons);
export const findLesson = (id) => ALL_LESSONS.find((lesson) => lesson.id === id);
export const nextLesson = (id) => ALL_LESSONS[ALL_LESSONS.findIndex((lesson) => lesson.id === id) + 1] ?? null;

// Two questions are the same if they show the same text and the same answers
// (some questions, like "Which number is largest?", differ only in their choices).
export const questionKey = (q) => JSON.stringify([q.text.vi, q.answer, (q.choices ?? []).map((c) => JSON.stringify(c)).sort()]);

// A practice round: every kind of exercise in the lesson comes up, in random
// order, and no question is asked twice. mode 'advanced' uses the harder set.
export function makeLessonRound(lesson, size = 10, mode = 'basic') {
  const pool = mode === 'advanced' ? lesson.advanced : lesson.exercises;
  const kinds = [];
  while (kinds.length < size) kinds.push(...shuffle(pool));
  const seen = new Set();
  return shuffle(kinds.slice(0, size)).map((make) => {
    let q;
    for (let tries = 0; tries < 50; tries++) {
      q = make();
      if (!seen.has(questionKey(q))) break;
    }
    seen.add(questionKey(q));
    return q;
  });
}
