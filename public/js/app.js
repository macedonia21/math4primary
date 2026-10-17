import {
  makeRound, starsForScore, ACTIVITIES, QUESTIONS_PER_ROUND, MAX_BY_LEVEL, levelsFor, tableFor,
} from './questions.js';
import { STRINGS } from './i18n.js';
import { load, save } from './storage.js';
import { createGrade6 } from './grade6/ui.js';

const ICONS = { numbers: '🔢', add: '➕', sub: '➖', mixed: '🎯', mul: '✖️' };
const OPS = { '+': '+', '-': '−', '×': '×' };
const CONFETTI = ['🎉', '⭐', '✨', '🎈', '🌟'];

const app = document.getElementById('app');
const data = load();
const state = {
  screen: 'home', activity: null, level: null, index: 0, correct: 0, question: null, steps: {}, typed: '', answered: false,
};
// Where the back button leads from each screen.
const PARENT = {
  primary: 'home', levels: 'primary', table: 'levels', play: 'levels', results: 'levels',
  grade6: 'home', lesson: 'grade6', g6play: 'lesson', g6results: 'lesson',
};
let nextTimer = null;
let audio = null;

const t = () => STRINGS[data.lang];
const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const starsFor = (activity, level) => data.stars[activity]?.[level] ?? 0;
// Every times table is open: children may be learning any of them at school.
const isUnlocked = (activity, level) => activity === 'mul' || level === 1 || starsFor(activity, level - 1) > 0;
const levelLabel = (activity, level) => (activity === 'mul' ? tableFor(level) ?? '🎲' : level);
const starRow = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

function totalStars() {
  return Object.values(data.stars)
    .flatMap((levels) => Object.values(levels))
    .reduce((sum, n) => sum + n, 0);
}

// ---------- screens ----------

function topbar() {
  const parent = PARENT[state.screen];
  const back = parent && parent !== 'home'
    ? `<button class="icon-btn" data-action="back" aria-label="${t().back}">⬅️</button>` : '';
  const left = state.screen === 'home'
    ? `<span class="logo">🌈 ${t().title}</span>`
    : `<button class="icon-btn" data-action="home" aria-label="${t().home}">🏠</button>${back}`;
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
  const stage = (action, icon, name, desc) => `
    <button class="card stage ${action}-stage" data-action="${action}">
      <span class="card-icon">${icon}</span>
      <span class="card-name">${name}</span>
      <span class="card-desc">${desc}</span>
    </button>`;
  return `
    <main class="home">
      <h1>${t().stages.choose}</h1>
      <div class="cards stages">
        ${stage('primary', '🎒', t().stages.primary, t().stages.primaryDesc)}
        ${stage('grade6', '📐', t().stages.grade6, t().stages.grade6Desc)}
      </div>
    </main>`;
}

function primaryScreen() {
  const cards = ACTIVITIES.map((a) => `
    <button class="card ${a}" data-action="activity" data-activity="${a}">
      <span class="card-icon">${ICONS[a]}</span>
      <span class="card-name">${t().activities[a]}</span>
    </button>`).join('');
  return `<main class="home"><h1>${t().chooseActivity}</h1><div class="cards">${cards}</div></main>`;
}

function levelsScreen() {
  const { activity } = state;
  const buttons = levelsFor(activity).map((level) => {
    const open = isUnlocked(activity, level);
    return `
      <button class="level" data-action="level" data-level="${level}" ${open ? '' : `disabled aria-label="${t().locked}"`}>
        <span class="level-number">${open ? levelLabel(activity, level) : '🔒'}</span>
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
      const expr = `<div class="expr">${prompt.a} ${OPS[prompt.op]} ${prompt.b} = <span class="blank">?</span></div>`;
      if (prompt.op === '×') return expr + groupsAid(prompt);
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

// a × b = "a taken b times": b boxes holding a objects each (still in rows of 5).
function groupsAid({ a, b, emoji }) {
  const box = `<div class="group-box">${pile(a, emoji)}</div>`;
  return `<div class="groups-aid ${a * b > 40 ? 'many' : ''}" aria-hidden="true">${box.repeat(b)}</div>`;
}

function tableScreen() {
  const n = tableFor(state.level);
  const rows = Array.from({ length: 10 }, (_, i) => `
    <div class="tt-row"><span>${n} × ${i + 1}</span><span class="tt-eq">=</span><b>${n * (i + 1)}</b></div>`).join('');
  return `
    <main class="table-view ${state.activity}">
      <h1>${ICONS.mul} ${t().levelNames.mul[state.level - 1]}</h1>
      <div class="times-table">${rows}</div>
      <button class="big-btn primary" data-action="play">▶️ ${t().playNow}</button>
    </main>`;
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
  const canGoNext = stars > 0 && state.level < levelsFor(state.activity).length;
  const hasTable = tableFor(state.level) && state.activity === 'mul';
  const score = t().score.replace('{n}', state.correct).replace('{total}', QUESTIONS_PER_ROUND);
  return `
    <main class="results ${state.activity}">
      <div class="result-stars">${starRow(stars)}</div>
      <h1>${t().resultTitles[stars]}</h1>
      <p class="score">${score}</p>
      <div class="result-actions">
        ${canGoNext ? `<button class="big-btn primary" data-action="next-level">${t().nextLevel} ➡️</button>` : ''}
        <button class="big-btn" data-action="again">🔁 ${t().playAgain}</button>
        ${hasTable ? `<button class="big-btn" data-action="table">📖 ${t().viewTable}</button>` : ''}
        <button class="big-btn" data-action="levels">${t().levels}</button>
      </div>
    </main>`;
}

const grade6 = createGrade6({
  app, state, data, save, t, render, go, playSound, confetti, starRow, starsForScore, randomOf,
});

const SCREENS = {
  home: homeScreen,
  primary: primaryScreen,
  levels: levelsScreen,
  table: tableScreen,
  play: playScreen,
  results: resultsScreen,
  ...grade6.screens,
};

function render() {
  document.documentElement.lang = data.lang;
  document.title = t().title;
  app.innerHTML = topbar() + SCREENS[state.screen]();
}

// ---------- game flow ----------

function startRound(level) {
  const round = makeRound(state.activity, level);
  Object.assign(state, { screen: 'play', level, index: 0, correct: 0, round, question: round[0] });
  render();
}

// A single times table is shown in full before playing it.
function openLevel(level) {
  if (state.activity === 'mul' && tableFor(level)) {
    state.level = level;
    go('table');
  } else {
    startRound(level);
  }
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
  let wait = isRight ? 1200 : 2200;
  const aid = app.querySelector('.counting-aid');
  if (aid) {
    animateAid(aid, q.prompt.op);
    wait += 1300;
  }
  const groups = app.querySelector('.groups-aid');
  if (groups && q.prompt.a !== q.prompt.b) {
    const done = swapGroups(groups, q.prompt, feedback);
    wait = Math.max(wait, done + 1600);
  }
  nextTimer = setTimeout(nextQuestion, wait);
}

function nextQuestion() {
  nextTimer = null;
  state.index++;
  if (state.index < QUESTIONS_PER_ROUND) {
    state.question = state.round[state.index];
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
  grade6.stop();
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

// Shows the answer with the objects: addition merges both piles into one,
// subtraction sends the crossed-out objects flying away.
function animateAid(aid, op) {
  // Plays even with reduced motion on: the movement is the lesson, not decoration.
  if (op === '+') {
    // Full groups of five move as whole groups; only the loose objects
    // gather into new groups of five.
    const rows = [...aid.querySelectorAll('.five')];
    const full = rows.filter((row) => row.children.length === 5);
    const loose = rows.filter((row) => row.children.length < 5).flatMap((row) => [...row.children]);
    const start = new Map([...full, ...loose].map((el) => [el, el.getBoundingClientRect()]));

    const newRows = [];
    for (let i = 0; i < loose.length; i += 5) {
      const row = document.createElement('div');
      row.className = 'five';
      row.append(...loose.slice(i, i + 5));
      newRows.push(row);
    }
    const merged = document.createElement('div');
    merged.className = 'pile';
    merged.append(...full, ...newRows);
    aid.replaceChildren(merged);

    // FLIP: start each piece where it was, then slide it to its new place.
    const slide = (el, delay) => {
      const from = start.get(el);
      const to = el.getBoundingClientRect();
      el.animate(
        [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }],
        { duration: 600, delay, easing: 'ease-in-out', fill: 'backwards' },
      );
    };
    full.forEach((row) => slide(row, 0));
    loose.forEach((el, i) => slide(el, 500 + i * 60));
    newRows.forEach((row) => row.animate(
      [{ backgroundColor: 'rgba(238, 246, 255, 0)' }, { backgroundColor: 'rgba(238, 246, 255, 1)' }],
      { duration: 400, delay: 500 + loose.length * 60, fill: 'backwards' },
    ));
    return;
  }
  const gone = [...aid.querySelectorAll('.gone')];
  const flights = gone.map((el, i) => el.animate(
    [
      { transform: 'none', opacity: 0.35 },
      { transform: `translate(${(Math.random() - 0.5) * 120}px, -140px) rotate(${(Math.random() - 0.5) * 120}deg)`, opacity: 0 },
    ],
    { duration: 600, delay: i * 60, easing: 'ease-in', fill: 'forwards' },
  ).finished);
  Promise.all(flights).then(() => {
    gone.forEach((el) => el.remove());
    aid.querySelectorAll('.five:empty').forEach((row) => row.remove());
  });
}

// Swap hint for a × b: the b boxes of a regroup into a boxes of b. Each new
// box takes one object from every old box (rows become columns), then the
// feedback line shows a × b = b × a. Returns when the animation ends, in ms.
function swapGroups(aid, { a, b }, feedback) {
  const oldBoxes = [...aid.querySelectorAll('.group-box')].map((box) => [...box.querySelectorAll('span')]);
  const start = new Map(oldBoxes.flat().map((el) => [el, el.getBoundingClientRect()]));

  const newBoxes = Array.from({ length: a }, (_, i) => {
    const objects = oldBoxes.map((box) => box[i]);
    const pileEl = document.createElement('div');
    pileEl.className = 'pile';
    for (let s = 0; s < objects.length; s += 5) {
      const row = document.createElement('div');
      row.className = 'five';
      row.append(...objects.slice(s, s + 5));
      pileEl.append(row);
    }
    const box = document.createElement('div');
    box.className = 'group-box';
    box.append(pileEl);
    return box;
  });
  aid.replaceChildren(...newBoxes);

  const begin = 600;
  const end = begin + 700 + (a - 1) * 80;
  newBoxes.forEach((box, j) => {
    box.querySelectorAll('span').forEach((el) => {
      const from = start.get(el);
      const to = el.getBoundingClientRect();
      el.animate(
        [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }],
        { duration: 700, delay: begin + j * 80, easing: 'ease-in-out', fill: 'backwards' },
      );
    });
    box.animate(
      [{ borderColor: 'transparent' }, { borderColor: getComputedStyle(box).borderColor }],
      { duration: 300, delay: begin + j * 80 + 500, fill: 'backwards' },
    );
  });

  setTimeout(() => {
    if (!feedback.isConnected) return;
    feedback.textContent = `${a} × ${b} = ${b} × ${a} = ${a * b}`;
    feedback.className = 'feedback swap-hint';
  }, end);
  return end;
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
  back: () => go(PARENT[state.screen]),
  primary: () => go('primary'),
  levels: () => go('levels'),
  activity: (el) => { state.activity = el.dataset.activity; go('levels'); },
  level: (el) => openLevel(Number(el.dataset.level)),
  answer,
  again: () => startRound(state.level),
  'next-level': () => openLevel(state.level + 1),
  table: () => go('table'),
  play: () => startRound(state.level),
  ...grade6.actions,
  mute: () => { data.muted = !data.muted; save(data); render(); },
  lang: () => { data.lang = data.lang === 'vi' ? 'en' : 'vi'; save(data); render(); },
};

app.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el || el.disabled) return;
  // Re-rendering mid-answer would wipe the feedback, so wait for the next question.
  if ((nextTimer || grade6.busy()) && (el.dataset.action === 'mute' || el.dataset.action === 'lang')) return;
  ACTIONS[el.dataset.action](el);
});

document.addEventListener('keydown', grade6.onKey);

render();
