// Question generators. Pure functions: pass a custom rng to make them deterministic.

export const ACTIVITIES = ['numbers', 'add', 'sub', 'mixed'];
export const LEVELS = [1, 2, 3, 4, 5];
export const QUESTIONS_PER_ROUND = 10;
export const MAX_BY_LEVEL = { 1: 10, 2: 20, 3: 20, 4: 100, 5: 100 };

const EMOJI = ['🍎', '🐟', '⭐', '🎈', '🐥', '🍓', '🌸', '🚗'];

const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, arr) => arr[int(rng, 0, arr.length - 1)];

function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = int(rng, 0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Two numbers to add, following the rules of each level.
function addends(level, rng) {
  switch (level) {
    case 1: { // sum within 10
      const a = int(rng, 1, 9);
      return [a, int(rng, 1, 10 - a)];
    }
    case 2: { // within 20, no carrying (12 + 5)
      const ones = int(rng, 0, 8);
      return shuffle(rng, [10 + ones, int(rng, 1, 9 - ones)]);
    }
    case 3: { // within 20, with carrying (8 + 7)
      const a = int(rng, 2, 9);
      return [a, int(rng, 11 - a, 9)];
    }
    case 4: { // within 100: whole tens (30 + 40) or no carrying (52 + 6)
      if (rng() < 0.5) {
        const tens = int(rng, 1, 9);
        return [tens * 10, int(rng, 1, 10 - tens) * 10];
      }
      const tens = int(rng, 1, 9);
      const ones = int(rng, 0, 8);
      const b = int(rng, 0, 9 - tens) * 10 + int(rng, 1, 9 - ones);
      return shuffle(rng, [tens * 10 + ones, b]);
    }
    default: { // within 100, with carrying (37 + 28)
      const tens = int(rng, 1, 8);
      const ones = int(rng, 1, 9);
      const b = int(rng, 0, 8 - tens) * 10 + int(rng, 10 - ones, 9);
      return shuffle(rng, [tens * 10 + ones, b]);
    }
  }
}

// The right answer plus three wrong answers that are close to it.
function makeChoices(answer, min, max, level, rng) {
  const valid = (v) => v >= min && v <= max;
  const pool = level >= 4 ? [answer + 10, answer - 10].filter(valid) : [];
  for (let d = 1; pool.length < 5; d++) {
    pool.push(...[answer + d, answer - d].filter(valid));
  }
  return shuffle(rng, [answer, ...shuffle(rng, pool).slice(0, 3)]);
}

function addQuestion(level, rng) {
  const [a, b] = addends(level, rng);
  return {
    prompt: { type: 'expr', a, op: '+', b },
    answer: a + b,
    choices: makeChoices(a + b, 0, MAX_BY_LEVEL[level], level, rng),
  };
}

// Subtraction is the matching addition turned around, so it never goes below zero.
function subQuestion(level, rng) {
  const [answer, b] = shuffle(rng, addends(level, rng));
  return {
    prompt: { type: 'expr', a: answer + b, op: '-', b },
    answer,
    choices: makeChoices(answer, 0, MAX_BY_LEVEL[level], level, rng),
  };
}

function countQuestion(max, level, rng) {
  const n = int(rng, 1, max);
  return {
    prompt: { type: 'count', emoji: pick(rng, EMOJI), n },
    answer: n,
    choices: makeChoices(n, 1, max, level, rng),
  };
}

function compareQuestion(max, rng) {
  const a = int(rng, 1, max);
  let b = int(rng, 1, max - 1);
  if (b >= a) b++;
  const want = rng() < 0.5 ? 'bigger' : 'smaller';
  return {
    prompt: { type: 'compare', want },
    answer: want === 'bigger' ? Math.max(a, b) : Math.min(a, b),
    choices: [a, b],
  };
}

function sequenceQuestion(max, steps, level, rng) {
  const step = pick(rng, steps);
  const last = max - 3 * step;
  const start = step >= 5 ? int(rng, 0, last / step) * step : int(rng, 0, last);
  const items = [0, 1, 2, 3].map((i) => start + i * step);
  const hidden = int(rng, 0, 3);
  const answer = items[hidden];
  items[hidden] = null;
  return {
    prompt: { type: 'sequence', items },
    answer,
    choices: makeChoices(answer, 0, max, level, rng),
  };
}

function numbersQuestion(level, rng) {
  switch (level) {
    case 1: return countQuestion(10, level, rng);
    case 2: return rng() < 0.5 ? countQuestion(20, level, rng) : compareQuestion(20, rng);
    case 3: return sequenceQuestion(20, [1], level, rng);
    case 4: return compareQuestion(100, rng);
    default: return sequenceQuestion(100, [1, 2, 5, 10], level, rng);
  }
}

export function makeQuestion(activity, level, rng = Math.random) {
  switch (activity) {
    case 'numbers': return numbersQuestion(level, rng);
    case 'add': return addQuestion(level, rng);
    case 'sub': return subQuestion(level, rng);
    default: return rng() < 0.5 ? addQuestion(level, rng) : subQuestion(level, rng);
  }
}

export function starsForScore(correct) {
  if (correct >= 10) return 3;
  if (correct >= 8) return 2;
  if (correct >= 6) return 1;
  return 0;
}
