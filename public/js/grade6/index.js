// Grade 6 (Toán 6, tập một): chapters, lessons and practice rounds.

import { CHAPTER1 } from './chapter1.js';
import { shuffle } from './util.js';

export const CHAPTERS = [
  { number: 'I', title: { vi: 'Tập hợp các số tự nhiên', en: 'The set of natural numbers' }, lessons: CHAPTER1 },
  { number: 'II', title: { vi: 'Tính chia hết trong tập hợp các số tự nhiên', en: 'Divisibility in the natural numbers' }, lessons: [] },
  { number: 'III', title: { vi: 'Số nguyên', en: 'Integers' }, lessons: [] },
  { number: 'IV', title: { vi: 'Một số hình phẳng trong thực tiễn', en: 'Plane shapes in real life' }, lessons: [] },
  { number: 'V', title: { vi: 'Tính đối xứng của hình phẳng trong tự nhiên', en: 'Symmetry of shapes in nature' }, lessons: [] },
];

export const ALL_LESSONS = CHAPTERS.flatMap((chapter) => chapter.lessons.map((lesson) => ({ ...lesson, chapter })));
export const findLesson = (id) => ALL_LESSONS.find((lesson) => lesson.id === id);
export const nextLesson = (id) => ALL_LESSONS[ALL_LESSONS.findIndex((lesson) => lesson.id === id) + 1] ?? null;

// Two questions are the same if they show the same text and the same answers
// (some questions, like "Which number is largest?", differ only in their choices).
export const questionKey = (q) => JSON.stringify([q.text.vi, q.answer, (q.choices ?? []).map((c) => JSON.stringify(c)).sort()]);

// A practice round: every kind of exercise in the lesson comes up, in random
// order, and no question is asked twice.
export function makeLessonRound(lesson, size = 10) {
  const kinds = [];
  while (kinds.length < size) kinds.push(...shuffle(lesson.exercises));
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
