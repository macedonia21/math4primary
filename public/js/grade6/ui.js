// Grade 6 screens: chapter list, lesson (theory + step-by-step examples) and
// practice rounds with multiple-choice and typed answers.

import { CHAPTERS, findLesson, nextLesson, makeLessonRound } from './index.js';
import { tr, fmt } from './util.js';

const ROUND = 10;

export function createGrade6({
  app, state, data, save, t, render, go, playSound, confetti, starRow, starsForScore, randomOf,
}) {
  let timer = null;
  const L = () => data.lang;
  const g6 = () => t().g6;
  // Basic and advanced practice keep separate stars.
  const STAR_KEY = { basic: 'g6', advanced: 'g6adv' };
  const starsFor = (id, mode = 'basic') => data.stars[STAR_KEY[mode]]?.[id] ?? 0;
  const isAdvanced = () => state.mode === 'advanced';
  const lesson = () => findLesson(state.level);

  // ---------- chapter list ----------

  function chaptersScreen() {
    const chapters = CHAPTERS.map((chapter) => {
      const lessons = chapter.lessons.length
        ? chapter.lessons.map((l) => `
          <button class="lesson-btn" data-action="g6-lesson" data-id="${l.id}">
            <span class="lesson-num">${g6().lesson} ${l.number}</span>
            <span class="lesson-name">${tr(l.title, L())}</span>
            <span class="level-stars">${starRow(starsFor(l.id))}</span>
            ${l.advanced.length ? `<span class="adv-stars" title="${g6().advanced}">🚀${starRow(starsFor(l.id, 'advanced'))}</span>` : ''}
          </button>`).join('')
        : `<p class="soon">🚧 ${g6().comingSoon}</p>`;
      return `
        <section class="chapter">
          <h2><span class="ch-num">${g6().chapter} ${chapter.number}</span> ${tr(chapter.title, L())}</h2>
          <div class="lesson-list">${lessons}</div>
        </section>`;
    }).join('');
    return `
      <main class="g6">
        <h1>📐 ${t().stages.grade6}</h1>
        <p class="subtitle">${g6().book}</p>
        ${chapters}
      </main>`;
  }

  // ---------- lesson ----------

  function exampleBox(i) {
    const point = lesson().points[i];
    const frames = point.example.frames(L());
    const step = state.steps[i] ?? 0;
    return `
      <div class="example-head"><span class="example-tag">💡 ${g6().example}</span> ${tr(point.example.caption, L())}</div>
      <div class="vx-stage">${frames[step]}</div>
      <div class="example-controls">
        <button class="step-btn" data-action="g6-step" data-point="${i}" data-dir="-1" ${step === 0 ? 'disabled' : ''} aria-label="${g6().prevStep}">◀</button>
        <span class="step-count">${g6().step} ${step + 1}/${frames.length}</span>
        <button class="step-btn primary" data-action="g6-step" data-point="${i}" data-dir="1" ${step === frames.length - 1 ? 'disabled' : ''}>${g6().nextStep} ▶</button>
        <button class="step-btn" data-action="g6-step" data-point="${i}" data-dir="0" aria-label="${g6().replay}">↺</button>
      </div>`;
  }

  function lessonScreen() {
    const l = lesson();
    const points = l.points.map((point, i) => `
      <section class="point">
        <h2><span class="point-num">${i + 1}</span> ${tr(point.title, L())}</h2>
        <ul class="theory">${point.theory[L()].map((line) => `<li>${line}</li>`).join('')}</ul>
        <div class="example" data-point="${i}">${exampleBox(i)}</div>
      </section>`).join('');
    return `
      <main class="lesson-view g6">
        <p class="crumb">${g6().chapter} ${l.chapter.number} · ${g6().lesson} ${l.number}</p>
        <h1>${tr(l.title, L())}</h1>
        ${points}
        <div class="practice-bar">
          <div class="practice-option">
            <button class="big-btn primary" data-action="g6-practice" data-mode="basic">✏️ ${g6().practice} · ${ROUND} ${g6().questions}</button>
            <span class="level-stars">${starRow(starsFor(l.id))}</span>
          </div>
          ${l.advanced.length ? `
          <div class="practice-option">
            <button class="big-btn adv-btn" data-action="g6-practice" data-mode="advanced">🚀 ${g6().advanced} · ${ROUND} ${g6().questions}</button>
            <span class="level-stars">${starRow(starsFor(l.id, 'advanced'))}</span>
          </div>` : ''}
        </div>
      </main>`;
  }

  // Newly revealed pieces fade and slide in. Plays even with reduced motion
  // on, like the other teaching animations: the reveal is part of the lesson.
  function animateNew(root) {
    root.querySelectorAll('.new').forEach((el, i) => {
      const svg = el instanceof SVGElement;
      el.animate(
        svg ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(10px) scale(0.96)' }, { opacity: 1, transform: 'none' }],
        { duration: 450, delay: i * 40, easing: 'ease-out', fill: 'backwards' },
      );
    });
  }

  function step(el) {
    const i = Number(el.dataset.point);
    const dir = Number(el.dataset.dir);
    const count = lesson().points[i].example.frames(L()).length;
    const current = state.steps[i] ?? 0;
    state.steps[i] = dir === 0 ? 0 : Math.max(0, Math.min(count - 1, current + dir));
    const box = app.querySelector(`.example[data-point="${i}"]`);
    box.innerHTML = exampleBox(i);
    if (dir !== -1) animateNew(box.querySelector('.vx-stage'));
  }

  function openLesson(id) {
    Object.assign(state, { activity: 'g6', level: id, steps: {} });
    go('lesson');
    window.scrollTo(0, 0);
  }

  // ---------- practice ----------

  // What the student has typed so far, e.g. "−1 250" or "?".
  const typedText = () => `${state.negative ? '−' : ''}${state.typed ? fmt(Number(state.typed), L()) : '?'}`;
  const typedValue = () => (state.negative ? -1 : 1) * Number(state.typed);

  function numpad() {
    // Integer questions (Chapter III) get a ± key and a wide check button.
    const signed = state.question.signed;
    const keys = signed
      ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'sign', '0', 'del', 'ok']
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];
    const label = { del: '⌫', ok: '✓', sign: '±' };
    const aria = { del: g6().erase, ok: g6().check, sign: g6().sign };
    return `
      <div class="numpad-wrap">
        <div class="numpad-display" aria-live="polite">${typedText()}</div>
        <div class="numpad">${keys.map((k) => `
          <button class="numpad-key${k === 'ok' ? ' ok' : ''}${k === 'ok' && signed ? ' wide' : ''}" data-action="g6-key" data-key="${k}" aria-label="${aria[k] ?? k}">${label[k] ?? k}</button>`).join('')}
        </div>
      </div>`;
  }

  function playScreen() {
    const q = state.question;
    const answers = q.input ? numpad() : `
      <div class="choices g6-choices count-${q.choices.length}">${q.choices.map((c, i) => `
        <button class="choice" data-action="g6-answer" data-index="${i}">${tr(c, L())}</button>`).join('')}
      </div>`;
    return `
      <main class="play g6-play g6${isAdvanced() ? ' adv' : ''}">
        <div class="progress" aria-label="${state.index + 1} / ${ROUND}">
          <div class="progress-bar" style="width:${(state.index / ROUND) * 100}%"></div>
        </div>
        <p class="crumb">${isAdvanced() ? `🚀 ${g6().advanced} · ` : ''}${g6().question} ${state.index + 1}/${ROUND}</p>
        <div class="question g6q">${tr(q.text, L())}</div>
        ${answers}
        <p class="feedback" aria-live="polite"></p>
        <div class="explain" hidden></div>
        <button class="big-btn primary next-btn" data-action="g6-next" hidden>${g6().nextQuestion} ➡️</button>
      </main>`;
  }

  function startPractice(mode) {
    const round = makeLessonRound(lesson(), ROUND, mode);
    Object.assign(state, {
      screen: 'g6play', mode, index: 0, correct: 0, round, question: round[0], typed: '', negative: false, answered: false,
    });
    render();
  }

  function settle(isRight) {
    const q = state.question;
    state.answered = true;
    app.querySelectorAll('.choice, .numpad-key').forEach((b) => { b.disabled = true; });
    const feedback = app.querySelector('.feedback');
    playSound(isRight);
    if (isRight) {
      state.correct++;
      feedback.textContent = randomOf(t().praise);
      feedback.classList.add('good');
      confetti();
      timer = setTimeout(next, 1300);
      return;
    }
    const shown = q.input ? fmt(q.answer, L()) : tr(q.answer, L());
    feedback.innerHTML = `${g6().wrong} <b>${shown}</b>`;
    const explain = app.querySelector('.explain');
    explain.innerHTML = `💡 ${tr(q.explain, L())}`;
    explain.hidden = false;
    app.querySelector('.next-btn').hidden = false;
    app.querySelector('.next-btn').focus();
  }

  function answerChoice(el) {
    if (state.answered) return;
    const q = state.question;
    const picked = q.choices[Number(el.dataset.index)];
    const isRight = picked === q.answer;
    el.classList.add(isRight ? 'right' : 'wrong');
    if (!isRight) app.querySelector(`.choice[data-index="${q.choices.indexOf(q.answer)}"]`).classList.add('right');
    settle(isRight);
  }

  function key(k) {
    if (state.answered || !state.question?.input) return;
    if (k === 'ok') {
      if (!state.typed) return;
      const isRight = typedValue() === state.question.answer;
      app.querySelector('.numpad-display').classList.add(isRight ? 'right' : 'wrong');
      settle(isRight);
      return;
    }
    if (k === 'sign') {
      if (!state.question.signed) return;
      state.negative = !state.negative;
    } else if (k === 'del') {
      if (state.typed) state.typed = state.typed.slice(0, -1);
      else state.negative = false;
    } else if (state.typed.length < 9) {
      state.typed = state.typed === '0' ? k : state.typed + k;
    }
    app.querySelector('.numpad-display').textContent = typedText();
  }

  function next() {
    clearTimeout(timer);
    timer = null;
    state.index++;
    if (state.index < ROUND) {
      Object.assign(state, { question: state.round[state.index], typed: '', negative: false, answered: false });
    } else {
      const stars = starsForScore(state.correct);
      if (stars > starsFor(state.level, state.mode)) {
        const key = STAR_KEY[state.mode];
        data.stars[key] = { ...data.stars[key], [state.level]: stars };
        save(data);
      }
      state.screen = 'g6results';
      if (stars > 0) confetti();
    }
    render();
  }

  function resultsScreen() {
    const stars = starsForScore(state.correct);
    const after = nextLesson(state.level);
    const score = t().score.replace('{n}', state.correct).replace('{total}', ROUND);
    return `
      <main class="results g6${isAdvanced() ? ' adv' : ''}">
        <div class="result-stars">${starRow(stars)}</div>
        <h1>${t().resultTitles[stars]}</h1>
        <p class="score">${score}</p>
        <div class="result-actions">
          ${stars > 0 && !isAdvanced() && lesson().advanced.length ? `<button class="big-btn adv-btn" data-action="g6-practice" data-mode="advanced">🚀 ${g6().tryAdvanced}</button>` : ''}
          ${stars > 0 && after ? `<button class="big-btn primary" data-action="g6-lesson" data-id="${after.id}">${g6().nextLesson} ➡️</button>` : ''}
          <button class="big-btn" data-action="g6-practice" data-mode="${state.mode}">🔁 ${t().playAgain}</button>
          <button class="big-btn" data-action="g6-lesson" data-id="${state.level}">📖 ${g6().backToLesson}</button>
          <button class="big-btn" data-action="grade6">${g6().allLessons}</button>
        </div>
      </main>`;
  }

  // Physical keyboard for typed answers (and Enter to move on).
  function onKey(event) {
    if (state.screen !== 'g6play') return;
    if (state.answered) {
      if (event.key === 'Enter' && !timer) next();
      return;
    }
    if (/^[0-9]$/.test(event.key)) key(event.key);
    else if (event.key === 'Backspace') key('del');
    else if (event.key === '-') key('sign');
    else if (event.key === 'Enter') key('ok');
  }

  return {
    screens: { grade6: chaptersScreen, lesson: lessonScreen, g6play: playScreen, g6results: resultsScreen },
    actions: {
      grade6: () => go('grade6'),
      'g6-lesson': (el) => openLesson(el.dataset.id),
      'g6-step': step,
      'g6-practice': (el) => startPractice(el.dataset.mode ?? 'basic'),
      'g6-answer': answerChoice,
      'g6-key': (el) => key(el.dataset.key),
      'g6-next': next,
    },
    onKey,
    // Re-rendering mid-answer would lose the feedback and explanation.
    busy: () => state.screen === 'g6play' && state.answered,
    stop: () => { clearTimeout(timer); timer = null; },
  };
}
