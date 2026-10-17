# Vui Học Toán (math4primary) — working notes

Static math site (Vietnamese + English) served from `public/`, deployed to GitHub Pages
(https://macedonia21.github.io/math4primary/) by `.github/workflows/pages.yml` on every push to `main`.
`npm start` serves it locally (also on the LAN); `npm test` runs `node --test`.

## Working with the owner
- Reply in **Vietnamese** when the owner writes Vietnamese.
- **Commit** finished work, but **ask before pushing** (pushing publishes the live site).
- Verify in the browser before reporting done: step through every example, both languages,
  phone (375×667 and 375×553) and iPad landscape (1024×698) sizes; nothing may overflow.

## Grade 6 (Lớp 6) — how a chapter is built
- One file per chapter: `public/js/grade6/chapterN.js` exporting `CHAPTERN` (lessons) and
  `ADVANCEDN` (challenge exercises keyed by lesson id), registered in `grade6/index.js`
  (`CHAPTERS` has `volume: 1|2`). Chapters I–VIII are done; IX is listed, empty.
- Lesson id `c<chapter>b<lesson>` (e.g. `c8b32`); lesson numbers continue the textbook (VIII = 32–37, IX = 38–43).
- Each lesson: 2–3 `points` (bilingual `theory` bullets + an `example` whose `frames(L)` reveal
  one step at a time; new pieces get class `new`), about 4 basic `exercises`, 3–4 `advanced`.
- **All text is original** — textbooks/workbooks are only used to know the topics and problem
  types; never copy their wording or examples.
- Every string is bilingual via `bi((L) => T(L, vi, en))`; numbers via `fmt(n, L)` (vi: 12 345 and 3,5;
  en: 12,345 and 3.5). Use the real minus "−" (`z`, `par`).
- Question builders (`util.js`): `choice(text, correct, wrongs, explain)`, `input` (natural number),
  `inputZ` (± key), `inputD(text, answer, explain, signed)` (decimal key). Wrong choices must never
  equal the right value (see `fracChoice` in chapter6.js). Build decimals from integers (`decimal()`,
  `exact()`) to avoid float errors.
- Pictures: `visuals.js` (number line, place table, dots, groups, chip rows, sieve, fraction bar…),
  `shapes.js` (SVG shapes with ticks/right angles/diagonals/axes/centre). Teaching animations use
  WAAPI (`data-anim` flip/turn/slide) and must play even with reduced motion on.
- Tests (`test/grade6.test.js`) run every generator hundreds of times; add a brute-force or
  direct-evaluation check for any new kind of answer, and update the lesson-count test.
- Update `README.md` (chapter table, challenge table, project structure) with each chapter.
