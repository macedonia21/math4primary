import {
  makeQuestion, starsForScore, ACTIVITIES, LEVELS, QUESTIONS_PER_ROUND, MAX_BY_LEVEL,
} from './questions.js';
import { STRINGS } from './i18n.js';
import { load, save } from './storage.js';

const ICONS = { numbers: '🔢', add: '➕', sub: '➖', mixed: '🎯' };
const CONFETTI = ['🎉', '⭐', '✨', '🎈', '🌟'];

const app = document.getElementById('app');
const data = load();
const state = { screen: 'home', activity: null, level: null, index: 0, correct: 0, question: null };
let nextTimer = null;
let audio = null;

const t = () => STRINGS[data.lang];
const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const starsFor = (activity, level) => data.stars[activity]?.[level] ?? 0;
const isUnlocked = (activity, level) => level === 1 || starsFor(activity, level - 1) > 0;
const starRow = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

function totalStars() {
  return Object.values(data.stars)
    .flatMap((levels) => Object.values(levels))
    .reduce((sum, n) => sum + n, 0);
}

// ---------- screens ----------

function topbar() {
  const left = state.screen === 'home'
    ? `<span class="logo">🌈 ${t().title}</span>`
    : `<button class="icon-btn" data-action="home" aria-label="${t().home}">🏠</button>`;
  return `
    <header class="topbar">
      ${left}
      <span class="spacer"></span>
      <span class="total-stars">⭐ ${totalStars()}</span>
      <button class="icon-btn" data-action="mute" aria-label="${t().sound}">${data.muted ? '🔇' : '🔊'}</button>
      <button class="icon-btn lang" data-action="lang">${data.lang === 'vi' ? 'EN' : 'VI'}</button>
    </header>`;
}

function homeScreen() {
  const cards = ACTIVITIES.map((a) => `
    <button class="card ${a}" data-action="activity" data-activity="${a}">
      <span class="card-icon">${ICONS[a]}</span>
      <span class="card-name">${t().activities[a]}</span>
    </button>`).join('');
  return `<main class="home"><h1>${t().chooseActivity}</h1><div class="cards">${cards}</div></main>`;
}

function levelsScreen() {
  const { activity } = state;
  const buttons = LEVELS.map((level) => {
    const open = isUnlocked(activity, level);
    return `
      <button class="level" data-action="level" data-level="${level}" ${open ? '' : `disabled aria-label="${t().locked}"`}>
        <span class="level-number">${open ? level : '🔒'}</span>
        <span class="level-name">${t().levelNames[activity][level - 1]}</span>
        <span class="level-stars">${starRow(starsFor(activity, level))}</span>
      </button>`;
  }).join('');
  return `
    <main class="levels ${activity}">
      <h1>${ICONS[activity]} ${t().activities[activity]}</h1>
      <p class="subtitle">${t().chooseLevel}</p>
      <div class="level-list">${buttons}</div>
    </main>`;
}

function promptHtml(prompt) {
  switch (prompt.type) {
    case 'expr': {
      const expr = `<div class="expr">${prompt.a} ${prompt.op === '+' ? '+' : '−'} ${prompt.b} = <span class="blank">?</span></div>`;
      return MAX_BY_LEVEL[state.level] <= 20 ? expr + countingAid(prompt) : expr;
    }
    case 'count': {
      const objects = `<span>${prompt.emoji}</span>`.repeat(prompt.n);
      return `<p class="ask">${t().howMany}</p><div class="objects ${prompt.n > 10 ? 'many' : ''}">${objects}</div>`;
    }
    case 'compare':
      return `<p class="ask big">${t()[prompt.want]}</p>`;
    default: {
      const items = prompt.items
        .map((n) => (n === null ? '<span class="blank">?</span>' : `<span>${n}</span>`))
        .join('');
      return `<p class="ask">${t().missing}</p><div class="sequence">${items}</div>`;
    }
  }
}

// n objects in rows of 5; the last `crossed` of them are shown as taken away.
function pile(n, emoji, crossed = 0) {
  const rows = [];
  for (let start = 0; start < n; start += 5) {
    const row = Array.from({ length: Math.min(5, n - start) }, (_, i) => (
      start + i >= n - crossed ? `<span class="gone">${emoji}</span>` : `<span>${emoji}</span>`
    ));
    rows.push(`<div class="five">${row.join('')}</div>`);
  }
  return `<div class="pile">${rows.join('')}</div>`;
}

function countingAid({ a, op, b, emoji }) {
  const content = op === '+'
    ? `${pile(a, emoji)}<span class="aid-sign">+</span>${pile(b, emoji)}`
    : pile(a, emoji, b);
  return `<div class="counting-aid" aria-hidden="true">${content}</div>`;
}

function playScreen() {
  const q = state.question;
  const choices = q.choices
    .map((c) => `<button class="choice" data-action="answer" data-value="${c}">${c}</button>`)
    .join('');
  return `
    <main class="play ${state.activity}">
      <div class="progress" aria-label="${state.index + 1} / ${QUESTIONS_PER_ROUND}">
        <div class="progress-bar" style="width:${(state.index / QUESTIONS_PER_ROUND) * 100}%"></div>
      </div>
      <div class="question">${promptHtml(q.prompt)}</div>
      <p class="feedback" aria-live="polite"></p>
      <div class="choices count-${q.choices.length}">${choices}</div>
    </main>`;
}

function resultsScreen() {
  const stars = starsForScore(state.correct);
  const canGoNext = stars > 0 && state.level < LEVELS.length;
  const score = t().score.replace('{n}', state.correct).replace('{total}', QUESTIONS_PER_ROUND);
  return `
    <main class="results ${state.activity}">
      <div class="result-stars">${starRow(stars)}</div>
      <h1>${t().resultTitles[stars]}</h1>
      <p class="score">${score}</p>
      <div class="result-actions">
        ${canGoNext ? `<button class="big-btn primary" data-action="next-level">${t().nextLevel} ➡️</button>` : ''}
        <button class="big-btn" data-action="again">🔁 ${t().playAgain}</button>
        <button class="big-btn" data-action="levels">${t().levels}</button>
      </div>
    </main>`;
}

const SCREENS = { home: homeScreen, levels: levelsScreen, play: playScreen, results: resultsScreen };

function render() {
  document.documentElement.lang = data.lang;
  document.title = t().title;
  app.innerHTML = topbar() + SCREENS[state.screen]();
}

// ---------- game flow ----------

function newQuestion() {
  // The same sum with a different emoji still counts as a repeat.
  const key = (question) => JSON.stringify({ ...question?.prompt, emoji: undefined });
  const previous = key(state.question);
  do {
    state.question = makeQuestion(state.activity, state.level);
  } while (key(state.question) === previous);
}

function startRound(level) {
  Object.assign(state, { screen: 'play', level, index: 0, correct: 0, question: null });
  newQuestion();
  render();
}

function answer(button) {
  if (nextTimer) return;
  const q = state.question;
  const isRight = Number(button.dataset.value) === q.answer;
  const feedback = app.querySelector('.feedback');
  if (isRight) {
    state.correct++;
    button.classList.add('right');
    feedback.textContent = randomOf(t().praise);
    feedback.classList.add('good');
    confetti();
  } else {
    button.classList.add('wrong');
    app.querySelector(`.choice[data-value="${q.answer}"]`).classList.add('right');
    feedback.textContent = t().wrong.replace('{n}', q.answer);
  }
  const blank = app.querySelector('.blank');
  if (blank) blank.textContent = q.answer;
  playSound(isRight);
  nextTimer = setTimeout(nextQuestion, isRight ? 1200 : 2200);
}

function nextQuestion() {
  nextTimer = null;
  state.index++;
  if (state.index < QUESTIONS_PER_ROUND) {
    newQuestion();
  } else {
    const stars = starsForScore(state.correct);
    if (stars > starsFor(state.activity, state.level)) {
      data.stars[state.activity] = { ...data.stars[state.activity], [state.level]: stars };
      save(data);
    }
    state.screen = 'results';
    if (stars > 0) confetti();
  }
  render();
}

function go(screen) {
  clearTimeout(nextTimer);
  nextTimer = null;
  state.screen = screen;
  render();
}

// ---------- effects ----------

function playSound(isRight) {
  if (data.muted) return;
  audio ??= new AudioContext();
  const notes = isRight ? [523, 659, 784] : [330, 262];
  notes.forEach((frequency, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const start = audio.currentTime + i * 0.12;
    osc.type = 'triangle';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + 0.25);
  });
}

function confetti() {
  const layer = document.createElement('div');
  layer.className = 'confetti';
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement('span');
    piece.textContent = randomOf(CONFETTI);
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    layer.append(piece);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 1600);
}

// ---------- events ----------

const ACTIONS = {
  home: () => go('home'),
  levels: () => go('levels'),
  activity: (el) => { state.activity = el.dataset.activity; go('levels'); },
  level: (el) => startRound(Number(el.dataset.level)),
  answer,
  again: () => startRound(state.level),
  'next-level': () => startRound(state.level + 1),
  mute: () => { data.muted = !data.muted; save(data); render(); },
  lang: () => { data.lang = data.lang === 'vi' ? 'en' : 'vi'; save(data); render(); },
};

app.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el || el.disabled) return;
  // Re-rendering mid-answer would wipe the feedback, so wait for the next question.
  if (nextTimer && (el.dataset.action === 'mute' || el.dataset.action === 'lang')) return;
  ACTIONS[el.dataset.action](el);
});

render();
