// Grade 6, Chapter V: symmetry of shapes in nature. Lessons 21–22 with
// theory, step-by-step pictures (folding along an axis, half-turns about a
// centre), basic and advanced exercises. All text is original.

import { bi, T, int, pick, shuffle, choice, input } from './util.js';
import { shapeSvg, shapePoints, SYMMETRY, midpoint } from './shapes.js';
import {
  SHAPE_NAMES, svg, poly, line, cap,
} from './chapter4.js';

const YES = { vi: 'Có', en: 'Yes' };
const NO = { vi: 'Không', en: 'No' };

// Block capitals with a line of symmetry / a centre of symmetry (as usually
// taught for simple printed capitals).
const AXIS_LETTERS = [...'ABCDEHIKMOTUVWXY'];
const NO_AXIS_LETTERS = [...'FGJLNPQRSZ'];
const CENTRE_LETTERS = [...'HINOSXZ'];
const NO_CENTRE_LETTERS = [...'ABCDEFGJKLMPQRTUVWY'];
const letter = (c) => `<span class="letter">${c}</span>`;
const WORDS = ['HOC TOAN', 'VIET NAM', 'MUA XUAN', 'HA NOI', 'TRUONG HOC', 'BAN BE', 'SACH VO', 'THAY CO', 'HOA SEN', 'BAU TROI', 'MAT TROI', 'SONG NUOC'];

const NAMES = {
  ...SHAPE_NAMES,
  equilateral: { vi: 'Tam giác đều', en: 'Equilateral triangle' },
  isosceles: { vi: 'Tam giác cân', en: 'Isosceles triangle' },
};
const lower = (name, L) => name[L].toLowerCase();

// ---------- Bài 21. Hình có trục đối xứng ----------

// A butterfly: right half, mirrored for the left half (axis x = 80).
const RIGHT_WING = [[80, 34], [108, 10], [150, 18], [142, 62], [102, 74], [140, 96], [130, 132], [96, 118], [80, 100]];
const LEFT_WING = RIGHT_WING.map(([x, y]) => [160 - x, y]);
const BUTTERFLY = [...RIGHT_WING, ...[...LEFT_WING].reverse()];

const AXIS_KINDS = ['equilateral', 'isosceles', 'square', 'rectangle', 'rhombus', 'trapezoid', 'hexagon', 'parallelogram'];

// A grid of small shapes; the first `upto` show their axes (or centre).
function shapeGrid(kinds, upto, L, mode) {
  const cells = kinds.map((kind, i) => {
    const shown = i < upto;
    const fresh = i === upto - 1;
    const sym = SYMMETRY[kind];
    const opts = mode === 'axes'
      ? { axes: shown, newPart: fresh ? 'axes' : '' }
      : { centre: shown && sym.centre, newPart: fresh ? 'centre' : '' };
    const note = !shown ? '&nbsp;' : mode === 'axes'
      ? T(L, `${sym.axes} trục`, `${sym.axes} ${sym.axes === 1 ? 'line' : 'lines'}`)
      : sym.centre ? T(L, '✓ có tâm', '✓ centre') : T(L, '✗ không có', '✗ none');
    return `<div class="shape-cell"><div class="shape-cell-pic">${shapeSvg(kind, { small: true, ...opts })}</div>
      <div class="shape-cell-name">${NAMES[kind][L]}</div><div class="shape-cell-note${fresh ? ' new' : ''}">${note}</div></div>`;
  });
  return `<div class="shape-grid">${cells.join('')}</div>`;
}

const lesson21 = {
  id: 'c5b21',
  number: 21,
  title: { vi: 'Hình có trục đối xứng', en: 'Shapes with a line of symmetry' },
  points: [
    {
      title: { vi: 'Trục đối xứng', en: 'Lines of symmetry' },
      theory: {
        vi: [
          'Nếu gấp một hình theo đường thẳng d mà <b>hai nửa trùng khít nhau</b> thì d là <b>trục đối xứng</b> của hình, và hình đó là hình có trục đối xứng.',
          'Ta gặp hình có trục đối xứng rất nhiều trong tự nhiên (lá cây, cánh bướm), kiến trúc và mĩ thuật.',
        ],
        en: [
          'If folding a shape along a line d makes <b>the two halves match exactly</b>, then d is a <b>line of symmetry</b> (axis of symmetry) of the shape.',
          'Shapes with a line of symmetry are everywhere in nature (leaves, butterfly wings), buildings and art.',
        ],
      },
      example: {
        caption: { vi: 'Gấp hình con bướm theo đường thẳng d.', en: 'Fold the butterfly along the line d.' },
        frames: (L) => {
          const body = poly(BUTTERFLY, 'sh-body');
          const axis = line([80, 0], [80, 142], 'sh-axis') + `<text class="sh-text accent" x="84" y="10">d</text>`;
          const flip = `<g class="new" data-anim="flip" style="transform: scaleX(-1); transform-origin: 80px 0px">${poly(LEFT_WING, 'sh-cut')}</g>`;
          const flipped = `<g style="transform: scaleX(-1); transform-origin: 80px 0px">${poly(LEFT_WING, 'sh-cut')}</g>`;
          return [
            svg(body),
            svg(body + `<g class="new">${axis}</g>`) + cap(T(L, 'Đường thẳng d chia hình thành hai nửa.', 'The line d splits the shape into two halves.'), true),
            svg(body + axis + flip) + cap(T(L, 'Gấp nửa bên trái theo d…', 'Fold the left half over d…'), true),
            svg(body + axis + flipped) + cap(T(L, '…hai nửa trùng khít nhau: <b>d là trục đối xứng</b>.', '…the halves match exactly: <b>d is a line of symmetry</b>.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Trục đối xứng của các hình đã học', en: 'Lines of symmetry of familiar shapes' },
      theory: {
        vi: [
          'Tam giác đều có <b>3</b> trục đối xứng; hình vuông có <b>4</b>; hình chữ nhật và hình thoi có <b>2</b>; hình thang cân có <b>1</b>; lục giác đều có <b>6</b>.',
          'Hình bình hành (không phải hình chữ nhật hay hình thoi) <b>không có</b> trục đối xứng. Hình tròn có <b>vô số</b> trục đối xứng (mọi đường thẳng qua tâm).',
          'Nhiều chữ cái in hoa có trục đối xứng, ví dụ A, H, M, T (trục dọc) hay B, C, D, E (trục ngang).',
        ],
        en: [
          'An equilateral triangle has <b>3</b> lines of symmetry; a square <b>4</b>; a rectangle and a rhombus <b>2</b>; an isosceles trapezoid <b>1</b>; a regular hexagon <b>6</b>.',
          'A parallelogram (that is not a rectangle or rhombus) has <b>none</b>. A circle has <b>infinitely many</b> (every line through its centre).',
          'Many capital letters have one, e.g. A, H, M, T (vertical) or B, C, D, E (horizontal).',
        ],
      },
      example: {
        caption: { vi: 'Đếm trục đối xứng của từng hình.', en: 'Count the lines of symmetry of each shape.' },
        frames: (L) => {
          const kinds = ['equilateral', 'square', 'rectangle', 'rhombus', 'trapezoid', 'hexagon', 'parallelogram'];
          return Array.from({ length: kinds.length + 1 }, (_, k) => shapeGrid(kinds, k, L, 'axes'));
        },
      },
    },
  ],
  exercises: [
    // How many lines of symmetry?
    () => {
      const kind = pick(AXIS_KINDS);
      const n = SYMMETRY[kind].axes;
      return input(
        bi((L) => `${T(L, 'Hình sau có bao nhiêu trục đối xứng?', 'How many lines of symmetry does this shape have?')}<br>${shapeSvg(kind, { ticks: true })}`),
        n,
        bi((L) => T(L, `${NAMES[kind].vi} có ${n} trục đối xứng.`, `A ${lower(NAMES[kind], 'en')} has ${n} ${n === 1 ? 'line' : 'lines'} of symmetry.`)),
      );
    },
    // Which shape has no line of symmetry?
    () => {
      const none = pick(['parallelogram', 'oddQuad', 'rightTriangle']);
      const some = shuffle(['equilateral', 'square', 'rectangle', 'rhombus', 'trapezoid', 'hexagon', 'isosceles']).slice(0, 3);
      const pic = (kind) => shapeSvg(kind, { small: true });
      return choice(
        bi((L) => T(L, 'Hình nào <b>không có</b> trục đối xứng?', 'Which shape has <b>no</b> line of symmetry?')),
        pic(none),
        some.map(pic),
        bi((L) => T(L, 'Gấp hình đó theo bất kì đường thẳng nào, hai nửa cũng không trùng khít.', 'However you fold it, the two halves never match.')),
      );
    },
    // Is the dashed line a line of symmetry?
    () => {
      const cases = [
        ['rectangle', (p) => [midpoint(p[0], p[1]), midpoint(p[2], p[3])], true],
        ['rectangle', (p) => [p[0], p[2]], false],
        ['square', (p) => [p[0], p[2]], true],
        ['rhombus', (p) => [p[1], p[3]], true],
        ['parallelogram', (p) => [p[0], p[2]], false],
        ['parallelogram', (p) => [midpoint(p[0], p[1]), midpoint(p[2], p[3])], false],
        ['trapezoid', (p) => [midpoint(p[0], p[1]), midpoint(p[2], p[3])], true],
        ['trapezoid', (p) => [p[0], p[2]], false],
        ['equilateral', (p) => [p[0], midpoint(p[1], p[2])], true],
        ['hexagon', (p) => [p[0], p[3]], true],
      ];
      const [kind, lineOf, yes] = pick(cases);
      return choice(
        bi((L) => `${T(L, 'Đường nét đứt có phải là trục đối xứng của hình không?', 'Is the dashed line a line of symmetry?')}<br>${shapeSvg(kind, { line: lineOf })}`),
        yes ? YES : NO,
        [yes ? NO : YES],
        bi((L) => (yes
          ? T(L, 'Gấp theo đường đó, hai nửa trùng khít nhau.', 'Folding along it, the two halves match.')
          : T(L, 'Gấp theo đường đó, hai nửa không trùng khít nhau.', 'Folding along it, the two halves do not match.'))),
      );
    },
    // Which letter has a line of symmetry?
    () => {
      const right = pick(AXIS_LETTERS);
      return choice(
        bi((L) => T(L, 'Chữ cái nào có trục đối xứng?', 'Which letter has a line of symmetry?')),
        letter(right),
        shuffle(NO_AXIS_LETTERS).slice(0, 3).map(letter),
        bi((L) => T(L, `Chữ ${right} gấp đôi được để hai nửa trùng nhau.`, `${right} can be folded so its halves match.`)),
      );
    },
  ],
};

// ---------- Bài 22. Hình có tâm đối xứng ----------

const PAR = shapePoints('parallelogram');
const O = [PAR.reduce((s, p) => s + p[0], 0) / 4, PAR.reduce((s, p) => s + p[1], 0) / 4];
const CENTRE_KINDS = ['square', 'rectangle', 'rhombus', 'parallelogram', 'hexagon'];
const NO_CENTRE_KINDS = ['equilateral', 'isosceles', 'trapezoid', 'oddQuad', 'rightTriangle'];

const lesson22 = {
  id: 'c5b22',
  number: 22,
  title: { vi: 'Hình có tâm đối xứng', en: 'Shapes with a centre of symmetry' },
  points: [
    {
      title: { vi: 'Tâm đối xứng', en: 'Centre of symmetry' },
      theory: {
        vi: [
          'Nếu quay một hình <b>nửa vòng (180°)</b> quanh điểm O mà hình <b>trùng với chính nó</b> ở vị trí ban đầu thì O là <b>tâm đối xứng</b> của hình.',
          'Mỗi điểm của hình khi quay nửa vòng quanh O sẽ đến một điểm của hình ở phía bên kia O, cách O một khoảng như cũ.',
        ],
        en: [
          'If turning a shape <b>half a turn (180°)</b> about a point O brings it <b>back onto itself</b>, then O is a <b>centre of symmetry</b> of the shape.',
          'Each point of the shape lands on another point of the shape on the other side of O, at the same distance from O.',
        ],
      },
      example: {
        caption: { vi: 'Quay hình bình hành ABCD nửa vòng quanh O.', en: 'Turn parallelogram ABCD half a turn about O.' },
        frames: (L) => {
          const labels = ['A', 'B', 'C', 'D'];
          const base = shapeSvg('parallelogram', { labels, centre: true });
          const copy = (anim) => `<g ${anim ? 'class="new" data-anim="turn"' : ''} style="transform: rotate(180deg); transform-origin: ${O[0]}px ${O[1]}px">
            ${poly(PAR, 'sh-cut')}<circle class="sh-dot" cx="${PAR[0][0]}" cy="${PAR[0][1]}" r="5"/></g>`;
          const withCopy = (anim) => base.replace('<g class="sh-labels">', `${copy(anim)}<g class="sh-labels">`);
          return [
            shapeSvg('parallelogram', { labels }),
            shapeSvg('parallelogram', { labels, centre: true, newPart: 'centre' }) + cap(T(L, 'O là giao điểm hai đường chéo.', 'O is where the diagonals meet.'), true),
            withCopy(true) + cap(T(L, 'Quay một bản sao nửa vòng quanh O (chấm đỏ đi từ A sang C)…', 'Turn a copy half a turn about O (the dot goes from A to C)…'), true),
            withCopy(false) + cap(T(L, '…hình trùng với chính nó: <b>O là tâm đối xứng</b>.', '…it lands on itself: <b>O is a centre of symmetry</b>.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Hình nào có tâm đối xứng?', en: 'Which shapes have a centre of symmetry?' },
      theory: {
        vi: [
          'Hình vuông, hình chữ nhật, hình thoi, hình bình hành: tâm đối xứng là <b>giao điểm hai đường chéo</b>.',
          'Lục giác đều và hình tròn có tâm đối xứng là tâm của hình.',
          'Tam giác đều, hình thang cân <b>không có</b> tâm đối xứng. Chữ cái có tâm đối xứng: H, I, N, O, S, X, Z.',
        ],
        en: [
          'Squares, rectangles, rhombuses and parallelograms: the centre is <b>where the diagonals meet</b>.',
          'A regular hexagon and a circle have their centre as centre of symmetry.',
          'Equilateral triangles and isosceles trapezoids have <b>no</b> centre of symmetry. Letters with one: H, I, N, O, S, X, Z.',
        ],
      },
      example: {
        caption: { vi: 'Hình nào có tâm đối xứng?', en: 'Which shapes have a centre of symmetry?' },
        frames: (L) => {
          const kinds = ['square', 'rectangle', 'rhombus', 'parallelogram', 'hexagon', 'equilateral', 'trapezoid'];
          return Array.from({ length: kinds.length + 1 }, (_, k) => shapeGrid(kinds, k, L, 'centre'));
        },
      },
    },
  ],
  exercises: [
    // Which shape has / has no centre?
    () => {
      const wantCentre = Math.random() < 0.5;
      const [rights, wrongs] = wantCentre ? [CENTRE_KINDS, NO_CENTRE_KINDS] : [NO_CENTRE_KINDS, CENTRE_KINDS];
      const pic = (kind) => shapeSvg(kind, { small: true });
      return choice(
        bi((L) => T(L, `Hình nào ${wantCentre ? '<b>có</b>' : '<b>không có</b>'} tâm đối xứng?`, `Which shape ${wantCentre ? '<b>has</b>' : 'has <b>no</b>'} centre of symmetry?`)),
        pic(pick(rights)),
        shuffle(wrongs).slice(0, 3).map(pic),
        bi((L) => T(L, 'Hình có tâm đối xứng: hình vuông, hình chữ nhật, hình thoi, hình bình hành, lục giác đều.', 'Shapes with a centre: squares, rectangles, rhombuses, parallelograms, regular hexagons.')),
      );
    },
    // Which letter has a centre?
    () => {
      const right = pick(CENTRE_LETTERS);
      return choice(
        bi((L) => T(L, 'Chữ cái nào có tâm đối xứng?', 'Which letter has a centre of symmetry?')),
        letter(right),
        shuffle(NO_CENTRE_LETTERS).slice(0, 3).map(letter),
        bi((L) => T(L, `Quay chữ ${right} nửa vòng, ta vẫn được chữ ${right}.`, `Turned half a turn, ${right} is still ${right}.`)),
      );
    },
    // Both kinds of symmetry.
    () => {
      const both = pick(['square', 'rectangle', 'rhombus', 'hexagon']);
      return choice(
        bi((L) => T(L, 'Hình nào có <b>cả</b> trục đối xứng <b>và</b> tâm đối xứng?', 'Which shape has <b>both</b> a line <b>and</b> a centre of symmetry?')),
        NAMES[both],
        [NAMES.parallelogram, NAMES.equilateral, NAMES.trapezoid],
        bi((L) => T(L, `${NAMES[both].vi} có ${SYMMETRY[both].axes} trục đối xứng và có tâm đối xứng. Hình bình hành chỉ có tâm; tam giác đều và hình thang cân chỉ có trục.`, `A ${lower(NAMES[both], 'en')} has ${SYMMETRY[both].axes} lines and a centre. A parallelogram has only a centre; equilateral triangles and isosceles trapezoids have only lines.`)),
      );
    },
    // Yes / no for a named shape.
    () => {
      const kind = pick([...CENTRE_KINDS, 'equilateral', 'trapezoid', 'isosceles']);
      const yes = SYMMETRY[kind].centre;
      return choice(
        bi((L) => T(L, `${NAMES[kind].vi} có tâm đối xứng không?`, `Does a ${lower(NAMES[kind], 'en')} have a centre of symmetry?`)),
        yes ? YES : NO,
        [yes ? NO : YES],
        bi((L) => (yes
          ? T(L, 'Quay nửa vòng quanh giao điểm hai đường chéo (tâm hình), hình trùng với chính nó.', 'A half-turn about its centre brings it back onto itself.')
          : T(L, 'Không có điểm nào để quay nửa vòng mà hình trùng với chính nó.', 'No point gives a half-turn that brings it back onto itself.'))),
      );
    },
  ],
};

export const CHAPTER5 = [lesson21, lesson22];

// ---------- Nâng cao ----------

const countIn = (word, set) => [...word].filter((c) => set.includes(c)).length;

export const ADVANCED5 = {
  c5b21: [
    // Regular polygons follow a pattern.
    () => {
      const n = pick([5, 7, 8, 9, 10, 12]);
      return input(
        bi((L) => T(L, `Tam giác đều có 3 trục đối xứng, hình vuông có 4, lục giác đều có 6. Theo quy luật đó, hình ${n} cạnh đều (các cạnh và các góc bằng nhau) có bao nhiêu trục đối xứng?`, `An equilateral triangle has 3 lines of symmetry, a square 4, a regular hexagon 6. Following the pattern, how many does a regular ${n}-sided shape have?`)),
        n,
        bi((L) => T(L, `Hình n cạnh đều có đúng n trục đối xứng: ${n}.`, `A regular n-sided shape has exactly n lines of symmetry: ${n}.`)),
      );
    },
    // Letters with a line of symmetry in a phrase.
    () => {
      const word = pick(WORDS);
      const count = countIn(word, AXIS_LETTERS);
      return input(
        bi((L) => T(L, `Trong cụm chữ ${letter(word)} có bao nhiêu chữ cái có trục đối xứng (đếm cả chữ lặp lại)?`, `In ${letter(word)}, how many letters have a line of symmetry (count repeats)?`)),
        count,
        bi((L) => `${[...word].filter((c) => c !== ' ').map((c) => (AXIS_LETTERS.includes(c) ? `<b>${c}</b>` : c)).join(' ')} → ${count}`),
      );
    },
    // Adding up lines of symmetry.
    () => {
      const kinds = shuffle(['equilateral', 'square', 'rectangle', 'rhombus', 'trapezoid', 'hexagon', 'parallelogram']).slice(0, 3);
      const total = kinds.reduce((s, k) => s + SYMMETRY[k].axes, 0);
      return input(
        bi((L) => T(L, `Tính tổng số trục đối xứng của ba hình: ${kinds.map((k) => lower(NAMES[k], 'vi')).join(', ')}.`, `Add up the lines of symmetry of: ${kinds.map((k) => lower(NAMES[k], 'en')).join(', ')}.`)),
        total,
        bi(() => `${kinds.map((k) => SYMMETRY[k].axes).join(' + ')} = ${total}`),
      );
    },
  ],
  c5b22: [
    // Regular polygons: centre only when the number of sides is even.
    () => {
      const n = int(3, 12);
      const yes = n % 2 === 0;
      return choice(
        bi((L) => T(L, `Hình vuông (4 cạnh) và lục giác đều (6 cạnh) có tâm đối xứng, tam giác đều (3 cạnh) thì không. Hình ${n} cạnh đều có tâm đối xứng không?`, `A square (4 sides) and a regular hexagon (6 sides) have a centre of symmetry; an equilateral triangle (3 sides) does not. Does a regular ${n}-sided shape?`)),
        yes ? YES : NO,
        [yes ? NO : YES],
        bi((L) => T(L, `Hình đều có số cạnh chẵn thì mỗi đỉnh có một đỉnh đối diện qua tâm, nên có tâm đối xứng; số cạnh lẻ thì không. ${n} là số ${yes ? 'chẵn' : 'lẻ'}.`, `With an even number of sides every corner has an opposite corner through the centre, so there is a centre of symmetry; with an odd number there is not. ${n} is ${yes ? 'even' : 'odd'}.`)),
      );
    },
    // Letters with a centre in a phrase.
    () => {
      const word = pick(WORDS);
      const count = countIn(word, CENTRE_LETTERS);
      return input(
        bi((L) => T(L, `Trong cụm chữ ${letter(word)} có bao nhiêu chữ cái có tâm đối xứng (đếm cả chữ lặp lại)?`, `In ${letter(word)}, how many letters have a centre of symmetry (count repeats)?`)),
        count,
        bi((L) => `${[...word].filter((c) => c !== ' ').map((c) => (CENTRE_LETTERS.includes(c) ? `<b>${c}</b>` : c)).join(' ')} → ${count}`),
      );
    },
    // How many of these shapes have a centre?
    () => {
      const kinds = shuffle([...CENTRE_KINDS, 'equilateral', 'trapezoid', 'isosceles']).slice(0, 5);
      const count = kinds.filter((k) => SYMMETRY[k].centre).length;
      return input(
        bi((L) => T(L, `Trong các hình sau có bao nhiêu hình có tâm đối xứng: ${kinds.map((k) => lower(NAMES[k], 'vi')).join(', ')}?`, `How many of these have a centre of symmetry: ${kinds.map((k) => lower(NAMES[k], 'en')).join(', ')}?`)),
        count,
        bi((L) => kinds.map((k) => `${lower(NAMES[k], L)} ${SYMMETRY[k].centre ? '✓' : '✗'}`).join('; ')),
      );
    },
    // One kind of symmetry but not the other.
    () => {
      if (Math.random() < 0.5) {
        return choice(
          { vi: 'Hình nào có tâm đối xứng nhưng <b>không có</b> trục đối xứng?', en: 'Which shape has a centre of symmetry but <b>no</b> line of symmetry?' },
          NAMES.parallelogram,
          shuffle([NAMES.rectangle, NAMES.equilateral, NAMES.trapezoid, NAMES.square, NAMES.rhombus]).slice(0, 3),
          { vi: 'Hình bình hành (không phải hình chữ nhật hay hình thoi) chỉ có tâm đối xứng.', en: 'A parallelogram (not a rectangle or rhombus) has only a centre of symmetry.' },
        );
      }
      const right = pick(['equilateral', 'trapezoid', 'isosceles']);
      return choice(
        { vi: 'Hình nào có trục đối xứng nhưng <b>không có</b> tâm đối xứng?', en: 'Which shape has a line of symmetry but <b>no</b> centre of symmetry?' },
        NAMES[right],
        shuffle([NAMES.parallelogram, NAMES.rectangle, NAMES.square, NAMES.hexagon]).slice(0, 3),
        bi((L) => T(L, `${NAMES[right].vi} có ${SYMMETRY[right].axes} trục đối xứng nhưng không có tâm đối xứng.`, `A ${lower(NAMES[right], 'en')} has ${SYMMETRY[right].axes} ${SYMMETRY[right].axes === 1 ? 'line' : 'lines'} of symmetry but no centre.`)),
      );
    },
  ],
};
