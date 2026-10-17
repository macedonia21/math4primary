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
            <span class="lesson-stars">
              <span class="level-stars">${starRow(starsFor(l.id))}</span>
              ${l.advanced.length ? `<span class="adv-stars" title="${g6().advanced}">🚀${starRow(starsFor(l.id, 'advanced'))}</span>` : ''}
            </span>
          </button>`).join('')
        : `<p class="soon">🚧 ${g6().comingSoon}</p>`;
      return `
        <div class="slide">
          <section class="chapter">
            <h2><span class="ch-num">${g6().chapter} ${chapter.number}</span> ${tr(chapter.title, L())} <span class="vol-badge vol${chapter.volume}">${g6().volume} ${chapter.volume}</span></h2>
            <div class="lesson-list">${lessons}</div>
          </section>
        </div>`;
    }).join('');
    const current = state.chapterIndex ?? 0;
    // Volume 2 tabs are purple, with a divider where the volume starts.
    const tabs = CHAPTERS.map((chapter, i) => `
      ${i > 0 && chapter.volume !== CHAPTERS[i - 1].volume ? '<span class="tab-divider" aria-hidden="true"></span>' : ''}
      <button class="chapter-tab vol${chapter.volume}${i === current ? ' active' : ''}" data-action="g6-chapter" data-index="${i}" aria-label="${g6().chapter} ${chapter.number} · ${g6().volume} ${chapter.volume}">${chapter.number}</button>`).join('');
    return `
      <main class="g6">
        <h1>📐 ${t().stages.grade6}</h1>
        <p class="subtitle">${g6().book}</p>
        <nav class="chapter-tabs">
          <button class="carousel-arrow" data-action="g6-chapter" data-step="-1" aria-label="${g6().prevChapter}" ${current === 0 ? 'disabled' : ''}>◀</button>
          ${tabs}
          <button class="carousel-arrow" data-action="g6-chapter" data-step="1" aria-label="${g6().nextChapter}" ${current === CHAPTERS.length - 1 ? 'disabled' : ''}>▶</button>
        </nav>
        <div class="carousel-track">${chapters}</div>
      </main>`;
  }

  // ---------- chapter carousel ----------
  // One chapter per slide in a horizontally scrolling track: swipe on touch
  // screens, or use the chapter tabs, the arrows or the ← → keys.

  const track = () => app.querySelector('.carousel-track');

  function showChapter(index, smooth = true) {
    const t0 = track();
    if (!t0) return;
    state.chapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    t0.scrollTo({ left: state.chapterIndex * t0.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    markChapter();
  }

  // Highlight the tab of the visible chapter and enable/disable the arrows.
  function markChapter() {
    const i = state.chapterIndex ?? 0;
    app.querySelectorAll('.chapter-tab').forEach((tab, k) => tab.classList.toggle('active', k === i));
    const [prev, next] = app.querySelectorAll('.carousel-arrow');
    prev.disabled = i === 0;
    next.disabled = i === CHAPTERS.length - 1;
    app.querySelector('.chapter-tab.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  // Called after every render: put the track on the remembered chapter and
  // follow swipes.
  function afterRender() {
    if (state.screen !== 'grade6') return;
    const t0 = track();
    showChapter(state.chapterIndex ?? 0, false);
    let settle;
    t0.addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        state.chapterIndex = Math.round(t0.scrollLeft / t0.clientWidth);
        markChapter();
      }, 80);
    });
  }

  function chapterAction(el) {
    if (el.dataset.step) showChapter((state.chapterIndex ?? 0) + Number(el.dataset.step));
    else showChapter(Number(el.dataset.index));
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
      // Geometry moves: fold over an axis, half-turn about a centre, slide,
      // and a ray turning into place (spin).
      const move = {
        flip: [{ transform: 'scaleX(1)' }, { transform: 'scaleX(-1)' }],
        turn: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }],
        slide: [{ transform: `translate(${el.dataset.dx}px, 0px)` }, { transform: 'translate(0px, 0px)' }],
        spin: [{ transform: `rotate(${el.dataset.from}deg)` }, { transform: 'rotate(0deg)' }],
      }[el.dataset.anim];
      if (move) {
        el.animate(move, { duration: 1400, delay: 250, easing: 'ease-in-out', fill: 'backwards' });
        return;
      }
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
    // Remember the lesson's chapter so "back" returns to the same slide.
    const chapterIndex = CHAPTERS.findIndex((c) => c.lessons.some((l) => l.id === id));
    Object.assign(state, { activity: 'g6', level: id, steps: {}, chapterIndex });
    go('lesson');
    window.scrollTo(0, 0);
  }

  // ---------- practice ----------

  // What the student has typed so far, e.g. "−1 250" or "?".
  const typedText = () => {
    if (!state.typed) return `${state.negative ? '−' : ''}?`;
    const [whole, part] = state.typed.split('.');
    const point = state.typed.includes('.') ? `${L() === 'vi' ? ',' : '.'}${part}` : '';
    return `${state.negative ? '−' : ''}${fmt(Number(whole || 0), L())}${point}`;
  };
  const typedValue = () => (state.negative ? -1 : 1) * Number(state.typed);

  function numpad() {
    // Integer questions (Chapter III) get a ± key and a wide check button.
    // Decimal questions (Chapter VII) add a decimal-point key.
    const { signed, decimal } = state.question;
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const keys = decimal && signed ? [...digits, 'sign', '0', 'dot', 'del', 'ok']
      : decimal ? [...digits, 'dot', '0', 'del', 'ok']
        : signed ? [...digits, 'sign', '0', 'del', 'ok']
          : [...digits, 'del', '0', 'ok'];
    const label = { del: '⌫', ok: '✓', sign: '±', dot: L() === 'vi' ? ',' : '.' };
    const aria = { del: g6().erase, ok: g6().check, sign: g6().sign, dot: g6().point };
    const wideOk = signed || decimal;
    return `
      <div class="numpad-wrap">
        <div class="numpad-display" aria-live="polite">${typedText()}</div>
        <div class="numpad">${keys.map((k) => `
          <button class="numpad-key${k === 'ok' ? ' ok' : ''}${k === 'ok' && wideOk ? (decimal && signed ? ' wide2' : ' wide') : ''}" data-action="g6-key" data-key="${k}" aria-label="${aria[k] ?? k}">${label[k] ?? k}</button>`).join('')}
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
      const isRight = Math.abs(typedValue() - state.question.answer) < 1e-9;
      app.querySelector('.numpad-display').classList.add(isRight ? 'right' : 'wrong');
      settle(isRight);
      return;
    }
    if (k === 'sign') {
      if (!state.question.signed) return;
      state.negative = !state.negative;
    } else if (k === 'dot') {
      if (!state.question.decimal || state.typed.includes('.')) return;
      state.typed = `${state.typed || '0'}.`;
    } else if (k === 'del') {
      if (state.typed) state.typed = state.typed.slice(0, -1);
      else state.negative = false;
    } else if (state.typed.length < 10 && !/\.\d{4}$/.test(state.typed)) {
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
    if (state.screen === 'grade6' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      showChapter((state.chapterIndex ?? 0) + (event.key === 'ArrowLeft' ? -1 : 1));
      return;
    }
    if (state.screen !== 'g6play') return;
    if (state.answered) {
      if (event.key === 'Enter' && !timer) next();
      return;
    }
    if (/^[0-9]$/.test(event.key)) key(event.key);
    else if (event.key === 'Backspace') key('del');
    else if (event.key === '-') key('sign');
    else if (event.key === ',' || event.key === '.') key('dot');
    else if (event.key === 'Enter') key('ok');
  }

  return {
    screens: { grade6: chaptersScreen, lesson: lessonScreen, g6play: playScreen, g6results: resultsScreen },
    actions: {
      grade6: () => go('grade6'),
      'g6-lesson': (el) => openLesson(el.dataset.id),
      'g6-chapter': chapterAction,
      'g6-step': step,
      'g6-practice': (el) => startPractice(el.dataset.mode ?? 'basic'),
      'g6-answer': answerChoice,
      'g6-key': (el) => key(el.dataset.key),
      'g6-next': next,
    },
    onKey,
    afterRender,
    // Re-rendering mid-answer would lose the feedback and explanation.
    busy: () => state.screen === 'g6play' && state.answered,
    stop: () => { clearTimeout(timer); timer = null; },
  };
}
