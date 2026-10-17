// Grade 6, Chapter IV: plane shapes in real life. Lessons 18–20 with
// theory, step-by-step pictures, basic and advanced exercises. All text is
// original, written to follow the curriculum topics.

import {
  bi, T, fmt, int, pick, shuffle, choice, input,
} from './util.js';
import { shapeSvg } from './shapes.js';

const cap = (html, isNew = false, big = false) => `<p class="vx-caption${isNew ? ' new' : ''}${big ? ' big' : ''}">${html}</p>`;
const eq = (html) => `<span class="eq">${html}</span>`;
const svg = (body, cls = 'shape') => `<svg class="${cls}" viewBox="-12 -12 184 164" role="img">${body}</svg>`;
const poly = (pts, cls, extra = '') => `<polygon class="${cls}" points="${pts.map((p) => p.join(',')).join(' ')}" ${extra}/>`;
const line = ([x1, y1], [x2, y2], cls) => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const label = (x, y, text, cls = 'sh-text') => `<text class="${cls}" x="${x}" y="${y}">${text}</text>`;
const g = (html, isNew, attrs = '') => `<g class="${isNew ? 'new' : ''}" ${attrs}>${html}</g>`;

// Statements for "which is true?" questions: [vi, en, true?]
function statementQuestion(pool) {
  const trues = shuffle(pool.filter((s) => s[2]));
  const falses = shuffle(pool.filter((s) => !s[2]));
  const asText = (s) => ({ vi: s[0], en: s[1] });
  const right = trues[0];
  return choice(
    { vi: 'Khẳng định nào <b>đúng</b>?', en: 'Which statement is <b>true</b>?' },
    asText(right),
    falses.slice(0, 3).map(asText),
    { vi: `Đúng: ${right[0]}`, en: `True: ${right[1]}` },
  );
}

// ---------- Bài 18. Tam giác đều. Hình vuông. Lục giác đều ----------

const A = [30, 128];
const B = [130, 128];
const C = [80, 41.4];
const arcPath = (center, r, a1, a2) => {
  const pt = (a) => [center[0] + r * Math.cos((a * Math.PI) / 180), center[1] + r * Math.sin((a * Math.PI) / 180)].map((v) => Math.round(v * 10) / 10);
  const [p, q] = [pt(a1), pt(a2)];
  return `<path class="sh-arc" d="M ${p[0]} ${p[1]} A ${r} ${r} 0 0 1 ${q[0]} ${q[1]}"/>`;
};

const STATEMENTS_18 = [
  ['Tam giác đều có ba cạnh bằng nhau.', 'An equilateral triangle has three equal sides.', true],
  ['Tam giác đều có ba góc bằng nhau.', 'An equilateral triangle has three equal angles.', true],
  ['Hình vuông có bốn góc vuông.', 'A square has four right angles.', true],
  ['Hình vuông có hai đường chéo bằng nhau.', 'A square has two equal diagonals.', true],
  ['Hình lục giác đều có sáu cạnh bằng nhau.', 'A regular hexagon has six equal sides.', true],
  ['Hình lục giác đều có ba đường chéo chính bằng nhau.', 'A regular hexagon has three equal main diagonals.', true],
  ['Tam giác đều có một góc vuông.', 'An equilateral triangle has a right angle.', false],
  ['Hai đường chéo của hình vuông không bằng nhau.', 'The two diagonals of a square are not equal.', false],
  ['Hình lục giác đều có sáu đường chéo chính.', 'A regular hexagon has six main diagonals.', false],
  ['Mọi hình có bốn cạnh bằng nhau đều là hình vuông.', 'Every shape with four equal sides is a square.', false],
  ['Hình lục giác đều có các góc không bằng nhau.', 'The angles of a regular hexagon are not all equal.', false],
];

const SHAPE_NAMES = {
  equilateral: { vi: 'Tam giác đều', en: 'Equilateral triangle' },
  square: { vi: 'Hình vuông', en: 'Square' },
  hexagon: { vi: 'Lục giác đều', en: 'Regular hexagon' },
  rectangle: { vi: 'Hình chữ nhật', en: 'Rectangle' },
  rhombus: { vi: 'Hình thoi', en: 'Rhombus' },
  parallelogram: { vi: 'Hình bình hành', en: 'Parallelogram' },
  trapezoid: { vi: 'Hình thang cân', en: 'Isosceles trapezoid' },
};

// Random proportions, so the same shape does not always look the same.
const randomParams = (kind) => ({
  rectangle: () => ({ w: int(110, 150), h: int(55, 95) }),
  rhombus: () => pick([{ dx: int(32, 45), dy: int(58, 66) }, { dx: int(62, 72), dy: int(36, 48) }]),
  parallelogram: () => ({ s: int(25, 50), w: int(80, 110), h: int(60, 95) }),
  trapezoid: () => ({ top: int(50, 85), bottom: int(120, 150), h: int(60, 95) }),
}[kind]?.() ?? {});

const lesson18 = {
  id: 'c4b18',
  number: 18,
  title: { vi: 'Hình tam giác đều. Hình vuông. Hình lục giác đều', en: 'Equilateral triangles, squares and regular hexagons' },
  points: [
    {
      title: { vi: 'Tam giác đều', en: 'The equilateral triangle' },
      theory: {
        vi: [
          'Tam giác đều có <b>ba cạnh bằng nhau</b> và <b>ba góc bằng nhau</b>.',
          '<b>Vẽ tam giác đều cạnh a</b> bằng thước và compa: vẽ đoạn AB = a; vẽ cung tròn tâm A bán kính AB và cung tròn tâm B bán kính BA; hai cung cắt nhau tại C; nối CA, CB.',
        ],
        en: [
          'An equilateral triangle has <b>three equal sides</b> and <b>three equal angles</b>.',
          '<b>To draw one with side a</b> using a ruler and compasses: draw AB = a; draw an arc centred at A with radius AB and one centred at B with radius BA; they meet at C; join CA and CB.',
        ],
      },
      example: {
        caption: { vi: 'Dựng tam giác đều ABC bằng thước và compa.', en: 'Construct the equilateral triangle ABC with ruler and compasses.' },
        frames: (L) => {
          const base = line(A, B, 'sh-edge') + label(A[0] - 12, A[1] + 6, 'A') + label(B[0] + 5, B[1] + 6, 'B');
          const arcA = arcPath(A, 100, -72, -48);
          const arcB = arcPath(B, 100, -132, -108);
          const pointC = `<circle class="sh-dot" cx="${C[0]}" cy="${C[1]}" r="4"/>` + label(C[0] - 5, C[1] - 10, 'C');
          const sides = line(A, C, 'sh-edge') + line(B, C, 'sh-edge');
          return [
            svg(g(base, true)) + cap(T(L, 'Vẽ đoạn thẳng AB.', 'Draw the segment AB.')),
            svg(base + g(arcA, true)) + cap(T(L, 'Cung tròn tâm A, bán kính AB.', 'An arc centred at A, radius AB.'), true),
            svg(base + arcA + g(arcB, true)) + cap(T(L, 'Cung tròn tâm B, bán kính BA.', 'An arc centred at B, radius BA.'), true),
            svg(base + arcA + arcB + g(pointC, true)) + cap(T(L, 'Hai cung cắt nhau tại C.', 'The arcs meet at C.'), true),
            svg(base + arcA + arcB + pointC + g(sides, true)) + cap(T(L, 'Nối CA, CB: AB = BC = CA, tam giác ABC đều.', 'Join CA and CB: AB = BC = CA, so ABC is equilateral.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Hình vuông', en: 'The square' },
      theory: {
        vi: [
          'Hình vuông có <b>bốn cạnh bằng nhau</b> và <b>bốn góc vuông</b>.',
          'Hai cạnh đối song song; hai <b>đường chéo bằng nhau</b>.',
          'Vẽ hình vuông bằng thước và ê ke: vẽ cạnh AB, dựng hai cạnh vuông góc tại A và B có cùng độ dài, rồi nối.',
        ],
        en: [
          'A square has <b>four equal sides</b> and <b>four right angles</b>.',
          'Opposite sides are parallel; the two <b>diagonals are equal</b>.',
          'To draw one with a ruler and set square: draw AB, draw equal sides at right angles at A and B, then join them.',
        ],
      },
      example: {
        caption: { vi: 'Các yếu tố của hình vuông ABCD.', en: 'The parts of square ABCD.' },
        frames: (L) => {
          const labels = ['A', 'B', 'C', 'D'];
          return [
            shapeSvg('square', { labels }),
            shapeSvg('square', { labels, ticks: true, newPart: 'ticks' }) + cap(T(L, 'Bốn cạnh bằng nhau.', 'Four equal sides.'), true),
            shapeSvg('square', { labels, ticks: true, right: true, newPart: 'right' }) + cap(T(L, 'Bốn góc vuông.', 'Four right angles.'), true),
            shapeSvg('square', { labels, ticks: true, right: true, diagonals: true, newPart: 'diagonals' }) + cap(T(L, 'Hai đường chéo AC và BD bằng nhau.', 'The diagonals AC and BD are equal.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Hình lục giác đều', en: 'The regular hexagon' },
      theory: {
        vi: [
          'Hình lục giác đều có <b>sáu cạnh bằng nhau</b> và <b>sáu góc bằng nhau</b>.',
          'Có <b>ba đường chéo chính</b> bằng nhau, cắt nhau tại một điểm.',
          'Lục giác đều được ghép từ <b>sáu tam giác đều</b> bằng nhau — vì thế tổ ong, gạch lát nền thường có dạng này.',
        ],
        en: [
          'A regular hexagon has <b>six equal sides</b> and <b>six equal angles</b>.',
          'Its <b>three main diagonals</b> are equal and meet at one point.',
          'It is made of <b>six identical equilateral triangles</b> — which is why honeycombs and floor tiles often have this shape.',
        ],
      },
      example: {
        caption: { vi: 'Lục giác đều và sáu tam giác đều.', en: 'A regular hexagon and its six equilateral triangles.' },
        frames: (L) => {
          const tri = (on) => (on ? '<g class="sh-tri new">' + Array.from({ length: 6 }, (_, k) => {
            const a1 = (Math.PI / 3) * k;
            const a2 = (Math.PI / 3) * (k + 1);
            const p = (a) => [80 + 68 * Math.cos(a), 70 + 68 * Math.sin(a)].map((v) => Math.round(v));
            return poly([[80, 70], p(a1), p(a2)], k % 2 ? 'sh-tri-a' : 'sh-tri-b');
          }).join('') + '</g>' : '');
          return [
            shapeSvg('hexagon'),
            shapeSvg('hexagon', { ticks: true, newPart: 'ticks' }) + cap(T(L, 'Sáu cạnh bằng nhau.', 'Six equal sides.'), true),
            shapeSvg('hexagon', { ticks: true, diagonals: true, newPart: 'diagonals' }) + cap(T(L, 'Ba đường chéo chính bằng nhau.', 'Three equal main diagonals.'), true),
            shapeSvg('hexagon', { ticks: true, diagonals: true }).replace('</svg>', `${tri(true)}</svg>`) + cap(T(L, 'Sáu tam giác đều ghép thành lục giác đều.', 'Six equilateral triangles make the hexagon.'), true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Which picture is the named shape?
    () => {
      const target = pick(['equilateral', 'square', 'hexagon']);
      const look = { equilateral: ['isosceles', 'rightTriangle', 'oddQuad'], square: ['rectangle', 'rhombus', 'oddQuad'], hexagon: ['oddHexagon', 'rhombus', 'trapezoid'] }[target];
      const pic = (kind) => shapeSvg(kind, { small: true, params: randomParams(kind) });
      return choice(
        bi((L) => T(L, `Hình nào là <b>${SHAPE_NAMES[target].vi.toLowerCase()}</b>?`, `Which picture is a <b>${SHAPE_NAMES[target].en.toLowerCase()}</b>?`)),
        pic(target),
        look.map(pic),
        bi((L) => ({
          equilateral: T(L, 'Tam giác đều có ba cạnh bằng nhau.', 'An equilateral triangle has three equal sides.'),
          square: T(L, 'Hình vuông có bốn cạnh bằng nhau và bốn góc vuông.', 'A square has four equal sides and four right angles.'),
          hexagon: T(L, 'Lục giác đều có sáu cạnh bằng nhau và sáu góc bằng nhau.', 'A regular hexagon has six equal sides and six equal angles.'),
        })[target]),
      );
    },
    // True statement.
    () => statementQuestion(STATEMENTS_18),
    // Perimeter.
    () => {
      const kind = pick(['equilateral', 'square', 'hexagon']);
      const n = { equilateral: 3, square: 4, hexagon: 6 }[kind];
      const a = int(3, 40);
      return input(
        bi((L) => T(L, `${SHAPE_NAMES[kind].vi} có cạnh ${a} cm. Tính chu vi (cm).`, `A ${SHAPE_NAMES[kind].en.toLowerCase()} has sides of ${a} cm. Find its perimeter (cm).`)),
        n * a,
        bi((L) => T(L, `Có ${n} cạnh bằng nhau: ${n} · ${a} = ${n * a} cm.`, `${n} equal sides: ${n} · ${a} = ${n * a} cm.`)),
      );
    },
    // Side from perimeter.
    () => {
      const kind = pick(['equilateral', 'square', 'hexagon']);
      const n = { equilateral: 3, square: 4, hexagon: 6 }[kind];
      const a = int(2, 30);
      return input(
        bi((L) => T(L, `${SHAPE_NAMES[kind].vi} có chu vi ${n * a} cm. Mỗi cạnh dài bao nhiêu xăng-ti-mét?`, `A ${SHAPE_NAMES[kind].en.toLowerCase()} has perimeter ${n * a} cm. How long is each side, in cm?`)),
        a,
        bi(() => `${n * a} : ${n} = ${a} cm`),
      );
    },
    // Counting facts.
    () => {
      const facts = [
        [{ vi: 'Hình lục giác đều có bao nhiêu đường chéo chính?', en: 'How many main diagonals does a regular hexagon have?' }, 3],
        [{ vi: 'Lục giác đều được ghép từ bao nhiêu tam giác đều?', en: 'How many equilateral triangles make up a regular hexagon?' }, 6],
        [{ vi: 'Hình vuông có bao nhiêu góc vuông?', en: 'How many right angles does a square have?' }, 4],
        [{ vi: 'Hình vuông có bao nhiêu đường chéo?', en: 'How many diagonals does a square have?' }, 2],
        [{ vi: 'Hình lục giác đều có bao nhiêu góc?', en: 'How many angles does a regular hexagon have?' }, 6],
      ];
      const [text, ans] = pick(facts);
      return input(text, ans, bi(() => `${ans}`));
    },
  ],
};

// ---------- Bài 19. Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân ----------

const STATEMENTS_19 = [
  ['Hình chữ nhật có bốn góc vuông.', 'A rectangle has four right angles.', true],
  ['Hình chữ nhật có hai đường chéo bằng nhau.', 'A rectangle has two equal diagonals.', true],
  ['Hình thoi có bốn cạnh bằng nhau.', 'A rhombus has four equal sides.', true],
  ['Hai đường chéo của hình thoi vuông góc với nhau.', 'The diagonals of a rhombus are perpendicular.', true],
  ['Hình bình hành có các cạnh đối song song và bằng nhau.', 'A parallelogram has opposite sides parallel and equal.', true],
  ['Hình bình hành có các góc đối bằng nhau.', 'A parallelogram has equal opposite angles.', true],
  ['Hình thang cân có hai cạnh bên bằng nhau.', 'An isosceles trapezoid has two equal legs.', true],
  ['Hình thang cân có hai đường chéo bằng nhau.', 'An isosceles trapezoid has two equal diagonals.', true],
  ['Mọi hình chữ nhật đều có bốn cạnh bằng nhau.', 'Every rectangle has four equal sides.', false],
  ['Mọi hình thoi đều có bốn góc vuông.', 'Every rhombus has four right angles.', false],
  ['Mọi hình bình hành đều có hai đường chéo bằng nhau.', 'Every parallelogram has equal diagonals.', false],
  ['Hình thang cân có hai đáy bằng nhau.', 'An isosceles trapezoid has two equal bases.', false],
  ['Mọi hình chữ nhật đều có hai đường chéo vuông góc.', 'Every rectangle has perpendicular diagonals.', false],
  ['Hình bình hành có bốn cạnh bằng nhau.', 'A parallelogram always has four equal sides.', false],
];

const quadPoint = (kind, title, theory, steps) => ({
  title,
  theory,
  example: {
    caption: { vi: `Các yếu tố của ${title.vi.toLowerCase()}.`, en: `The parts of a ${title.en.toLowerCase()}.` },
    frames: (L) => steps.map(([opts, vi, en], k) => shapeSvg(kind, { labels: ['A', 'B', 'C', 'D'], ...opts }) + (vi ? cap(T(L, vi, en), k > 0) : '')),
  },
});

const lesson19 = {
  id: 'c4b19',
  number: 19,
  title: { vi: 'Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân', en: 'Rectangles, rhombuses, parallelograms and isosceles trapezoids' },
  points: [
    quadPoint('rectangle', { vi: 'Hình chữ nhật', en: 'Rectangle' }, {
      vi: ['Hình chữ nhật có <b>bốn góc vuông</b>; các cạnh đối <b>song song và bằng nhau</b>.', 'Hai <b>đường chéo bằng nhau</b>.'],
      en: ['A rectangle has <b>four right angles</b>; opposite sides are <b>parallel and equal</b>.', 'Its two <b>diagonals are equal</b>.'],
    }, [
      [{}, '', ''],
      [{ ticks: true, newPart: 'ticks' }, 'AB = CD, BC = DA (các cạnh đối bằng nhau).', 'AB = CD, BC = DA (opposite sides are equal).'],
      [{ ticks: true, right: true, newPart: 'right' }, 'Bốn góc vuông.', 'Four right angles.'],
      [{ ticks: true, right: true, diagonals: true, newPart: 'diagonals' }, 'Hai đường chéo AC = BD.', 'Diagonals AC = BD.'],
    ]),
    quadPoint('rhombus', { vi: 'Hình thoi', en: 'Rhombus' }, {
      vi: ['Hình thoi có <b>bốn cạnh bằng nhau</b>; các cạnh đối song song; các góc đối bằng nhau.', 'Hai đường chéo <b>vuông góc</b> với nhau.'],
      en: ['A rhombus has <b>four equal sides</b>; opposite sides are parallel; opposite angles are equal.', 'Its two diagonals are <b>perpendicular</b>.'],
    }, [
      [{}, '', ''],
      [{ ticks: true, newPart: 'ticks' }, 'Bốn cạnh bằng nhau.', 'Four equal sides.'],
      [{ ticks: true, diagonals: true, newPart: 'diagonals' }, 'Hai đường chéo AC và BD vuông góc với nhau.', 'The diagonals AC and BD are perpendicular.'],
    ]),
    quadPoint('parallelogram', { vi: 'Hình bình hành', en: 'Parallelogram' }, {
      vi: ['Hình bình hành có các cạnh đối <b>song song và bằng nhau</b>; các góc đối bằng nhau.', 'Hai đường chéo cắt nhau tại <b>trung điểm của mỗi đường</b>.'],
      en: ['A parallelogram has opposite sides <b>parallel and equal</b>; opposite angles are equal.', 'Its diagonals cut each other <b>in half</b>.'],
    }, [
      [{}, '', ''],
      [{ ticks: true, newPart: 'ticks' }, 'AB = CD, AD = BC.', 'AB = CD, AD = BC.'],
      [{ ticks: true, diagonals: true, centre: true, newPart: 'diagonals' }, 'Hai đường chéo cắt nhau tại trung điểm O của mỗi đường.', 'The diagonals meet at O, the midpoint of each.'],
    ]),
    quadPoint('trapezoid', { vi: 'Hình thang cân', en: 'Isosceles trapezoid' }, {
      vi: ['Hình thang cân có hai <b>đáy song song</b>; hai <b>cạnh bên bằng nhau</b>; hai góc kề một đáy bằng nhau.', 'Hai <b>đường chéo bằng nhau</b>.'],
      en: ['An isosceles trapezoid has two <b>parallel bases</b> and two <b>equal legs</b>; the two angles on a base are equal.', 'Its two <b>diagonals are equal</b>.'],
    }, [
      [{}, '', ''],
      [{ ticks: true, newPart: 'ticks' }, 'Hai cạnh bên AD = BC; đáy AB song song với đáy CD.', 'Legs AD = BC; base AB is parallel to base CD.'],
      [{ ticks: true, diagonals: true, newPart: 'diagonals' }, 'Hai đường chéo AC = BD.', 'Diagonals AC = BD.'],
    ]),
  ],
  exercises: [
    // Name the shape.
    () => {
      const kinds = ['rectangle', 'rhombus', 'parallelogram', 'trapezoid'];
      const kind = pick(kinds);
      return choice(
        bi((L) => `${T(L, 'Hình sau là hình gì?', 'What is this shape?')}<br>${shapeSvg(kind, { params: randomParams(kind), ticks: true, right: true })}`),
        SHAPE_NAMES[kind],
        kinds.filter((k) => k !== kind).map((k) => SHAPE_NAMES[k]),
        bi((L) => ({
          rectangle: T(L, 'Bốn góc vuông, cạnh đối bằng nhau: hình chữ nhật.', 'Four right angles and equal opposite sides: a rectangle.'),
          rhombus: T(L, 'Bốn cạnh bằng nhau: hình thoi.', 'Four equal sides: a rhombus.'),
          parallelogram: T(L, 'Cạnh đối song song và bằng nhau, không có góc vuông: hình bình hành.', 'Opposite sides parallel and equal, no right angles: a parallelogram.'),
          trapezoid: T(L, 'Hai đáy song song, hai cạnh bên bằng nhau: hình thang cân.', 'Two parallel bases and two equal legs: an isosceles trapezoid.'),
        })[kind]),
      );
    },
    // True statement.
    () => statementQuestion(STATEMENTS_19),
    // Which shape has the property?
    () => {
      const props = [
        [{ vi: 'Hình nào có hai đường chéo <b>vuông góc</b> với nhau?', en: 'Which shape has <b>perpendicular</b> diagonals?' }, 'rhombus', ['rectangle', 'parallelogram', 'trapezoid']],
        [{ vi: 'Hình nào có <b>bốn góc vuông</b> nhưng các cạnh không nhất thiết bằng nhau?', en: 'Which shape has <b>four right angles</b> but sides that need not all be equal?' }, 'rectangle', ['rhombus', 'parallelogram', 'trapezoid']],
        [{ vi: 'Hình nào chỉ có <b>một cặp cạnh đối song song</b>?', en: 'Which shape has only <b>one pair of parallel sides</b>?' }, 'trapezoid', ['rectangle', 'rhombus', 'parallelogram']],
      ];
      const [text, right, wrongs] = pick(props);
      return choice(text, SHAPE_NAMES[right], wrongs.map((k) => SHAPE_NAMES[k]), { vi: SHAPE_NAMES[right].vi, en: SHAPE_NAMES[right].en });
    },
    // Perimeters.
    () => {
      const kind = pick(['rectangle', 'rhombus', 'parallelogram', 'trapezoid']);
      const [a, b] = [int(5, 40), int(3, 30)];
      const data = {
        rectangle: [`chiều dài ${a} cm, chiều rộng ${b} cm`, `length ${a} cm and width ${b} cm`, 2 * (a + b), `2 · (${a} + ${b})`],
        rhombus: [`cạnh ${a} cm`, `side ${a} cm`, 4 * a, `4 · ${a}`],
        parallelogram: [`hai cạnh kề ${a} cm và ${b} cm`, `adjacent sides ${a} cm and ${b} cm`, 2 * (a + b), `2 · (${a} + ${b})`],
        trapezoid: [`hai đáy ${a + b} cm và ${a} cm, cạnh bên ${b} cm`, `bases ${a + b} cm and ${a} cm and legs ${b} cm`, 2 * a + b + 2 * b, `${a + b} + ${a} + ${b} + ${b}`],
      }[kind];
      return input(
        bi((L) => T(L, `${SHAPE_NAMES[kind].vi} có ${data[0]}. Tính chu vi (cm).`, `A ${SHAPE_NAMES[kind].en.toLowerCase()} has ${data[1]}. Find its perimeter (cm).`)),
        data[2],
        bi(() => `${data[3]} = ${data[2]} cm`),
      );
    },
  ],
};

// ---------- Bài 20. Chu vi và diện tích của một số tứ giác đã học ----------

// Parallelogram turned into a rectangle by moving a triangle.
const PAR = [[45, 30], [155, 30], [115, 110], [5, 110]];
const CUT = [[5, 110], [45, 30], [45, 110]];
const KEEP = [[45, 30], [155, 30], [115, 110], [45, 110]];
const MOVED = [[115, 110], [155, 30], [155, 110]];

// Trapezoid doubled into a parallelogram by a half-turn about M.
const TRAP = [[30, 40], [70, 40], [90, 110], [10, 110]];
const M = [80, 75];

const lesson20 = {
  id: 'c4b20',
  number: 20,
  title: { vi: 'Chu vi và diện tích của một số tứ giác đã học', en: 'Perimeter and area of quadrilaterals' },
  points: [
    {
      title: { vi: 'Hình vuông, hình chữ nhật', en: 'Squares and rectangles' },
      theory: {
        vi: [
          'Hình vuông cạnh a: <b>C = 4a</b>; <b>S = a · a = a²</b>.',
          'Hình chữ nhật chiều dài a, chiều rộng b: <b>C = 2 · (a + b)</b>; <b>S = a · b</b>.',
          'Chu vi là độ dài đường bao quanh hình; diện tích là số ô vuông đơn vị phủ kín hình. Hai độ dài phải <b>cùng đơn vị</b>.',
        ],
        en: [
          'Square with side a: <b>P = 4a</b>; <b>A = a · a = a²</b>.',
          'Rectangle with length a and width b: <b>P = 2 · (a + b)</b>; <b>A = a · b</b>.',
          'Perimeter is the distance around a shape; area is the number of unit squares that cover it. Lengths must be in the <b>same unit</b>.',
        ],
      },
      example: {
        caption: { vi: 'Hình chữ nhật 5 cm × 3 cm.', en: 'A 5 cm × 3 cm rectangle.' },
        frames: (L) => {
          const [x0, y0, u] = [20, 34, 24];
          const outline = `<rect class="sh-body" x="${x0}" y="${y0}" width="${5 * u}" height="${3 * u}"/>${label(80, 24, '5 cm')}${label(150, 74, '3 cm')}`;
          const grid = Array.from({ length: 4 }, (_, i) => line([x0 + (i + 1) * u, y0], [x0 + (i + 1) * u, y0 + 3 * u], 'sh-grid')).join('')
            + Array.from({ length: 2 }, (_, i) => line([x0, y0 + (i + 1) * u], [x0 + 5 * u, y0 + (i + 1) * u], 'sh-grid')).join('');
          const walk = `<rect class="sh-walk" x="${x0}" y="${y0}" width="${5 * u}" height="${3 * u}"/>`;
          return [
            svg(outline),
            svg(outline + g(grid, true)) + cap(T(L, 'Chia thành các ô vuông cạnh 1 cm: 3 hàng, mỗi hàng 5 ô.', 'Cut into 1 cm squares: 3 rows of 5.'), true),
            svg(outline + grid) + cap(T(L, 'S = 5 · 3 = <b>15 cm²</b>', 'A = 5 · 3 = <b>15 cm²</b>'), true, true),
            svg(outline + grid + g(walk, true)) + cap(T(L, 'S = 5 · 3 = <b>15 cm²</b>', 'A = 5 · 3 = <b>15 cm²</b>'), false, true)
              + cap(T(L, 'Đi một vòng quanh hình: C = 2 · (5 + 3) = <b>16 cm</b>', 'Once around the edge: P = 2 · (5 + 3) = <b>16 cm</b>'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Hình bình hành, hình thoi', en: 'Parallelograms and rhombuses' },
      theory: {
        vi: [
          'Hình bình hành có độ dài một cạnh là a, chiều cao tương ứng h: <b>S = a · h</b>; chu vi C = 2 · (a + b).',
          'Hình thoi có hai đường chéo m, n: <b>S = m · n : 2</b>; cạnh a: C = 4a.',
        ],
        en: [
          'Parallelogram with a side a and its height h: <b>A = a · h</b>; perimeter P = 2 · (a + b).',
          'Rhombus with diagonals m and n: <b>A = m · n : 2</b>; with side a: P = 4a.',
        ],
      },
      example: {
        caption: { vi: 'Vì sao diện tích hình bình hành là a · h?', en: 'Why is the area of a parallelogram a · h?' },
        frames: (L) => {
          const height = line([45, 30], [45, 110], 'sh-dash') + label(51, 78, 'h', 'sh-text accent');
          const base = label(60, 128, 'a');
          return [
            svg(poly(PAR, 'sh-body') + base),
            svg(poly(PAR, 'sh-body') + base + g(height, true)) + cap(T(L, 'Kẻ chiều cao h từ một đỉnh.', 'Draw the height h from a corner.'), true),
            svg(poly(PAR, 'sh-body') + base + height + g(poly(CUT, 'sh-cut'), true)) + cap(T(L, 'Cắt phần tam giác bên trái…', 'Cut off the triangle on the left…'), true),
            svg(poly(KEEP, 'sh-body') + `<g class="new" data-anim="slide" data-dx="-110">${poly(MOVED, 'sh-cut')}</g>` + height + label(100, 128, 'a'))
              + cap(T(L, '…ghép sang bên phải: được hình chữ nhật a × h. Vậy <b>S = a · h</b>.', '…and move it to the right: a rectangle a × h. So <b>A = a · h</b>.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Hình thang cân', en: 'Isosceles trapezoids' },
      theory: {
        vi: [
          'Hình thang có hai đáy a, b và chiều cao h: <b>S = (a + b) · h : 2</b>.',
          'Chu vi bằng tổng độ dài bốn cạnh.',
        ],
        en: [
          'A trapezoid with bases a, b and height h: <b>A = (a + b) · h : 2</b>.',
          'Its perimeter is the sum of its four sides.',
        ],
      },
      example: {
        caption: { vi: 'Hai hình thang ghép thành một hình bình hành.', en: 'Two trapezoids make a parallelogram.' },
        frames: (L) => {
          const trap = poly(TRAP, 'sh-body') + label(46, 32, 'a') + label(46, 128, 'b');
          const copy = `<g class="new" data-anim="turn" style="transform: rotate(180deg); transform-origin: ${M[0]}px ${M[1]}px">${poly(TRAP, 'sh-cut')}</g>`;
          const copyStill = `<g style="transform: rotate(180deg); transform-origin: ${M[0]}px ${M[1]}px">${poly(TRAP, 'sh-cut')}</g>`;
          return [
            svg(trap),
            svg(trap + copy) + cap(T(L, 'Quay một bản sao nửa vòng quanh trung điểm cạnh bên…', 'Turn a copy half a turn about the middle of a leg…'), true),
            svg(trap + copyStill) + cap(T(L, '…được hình bình hành có đáy a + b và chiều cao h.', '…to get a parallelogram with base a + b and height h.'), true),
            svg(trap + copyStill) + cap(T(L, 'Mỗi hình thang bằng một nửa: <b>S = (a + b) · h : 2</b>', 'Each trapezoid is half of it: <b>A = (a + b) · h : 2</b>'), true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Square / rectangle area.
    () => {
      if (Math.random() < 0.4) {
        const a = int(3, 30);
        return input(
          bi((L) => T(L, `Tính diện tích hình vuông cạnh ${a} cm (cm²).`, `Find the area of a square with side ${a} cm (cm²).`)),
          a * a,
          bi(() => `${a} · ${a} = ${a * a} cm²`),
        );
      }
      const [a, b] = [int(5, 40), int(3, 25)];
      return input(
        bi((L) => T(L, `Tính diện tích hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm (cm²).`, `Find the area of a rectangle ${a} cm long and ${b} cm wide (cm²).`)),
        a * b,
        bi(() => `${a} · ${b} = ${a * b} cm²`),
      );
    },
    // Parallelogram / rhombus / trapezoid area.
    () => {
      const kind = pick(['parallelogram', 'rhombus', 'trapezoid']);
      if (kind === 'parallelogram') {
        const [a, h] = [int(4, 30), int(3, 20)];
        return input(
          bi((L) => T(L, `Hình bình hành có một cạnh ${a} cm, chiều cao tương ứng ${h} cm. Tính diện tích (cm²).`, `A parallelogram has a side of ${a} cm with height ${h} cm. Find its area (cm²).`)),
          a * h,
          bi(() => `${a} · ${h} = ${a * h} cm²`),
        );
      }
      if (kind === 'rhombus') {
        const [m, n] = [2 * int(2, 15), int(3, 20)];
        return input(
          bi((L) => T(L, `Hình thoi có hai đường chéo ${m} cm và ${n} cm. Tính diện tích (cm²).`, `A rhombus has diagonals of ${m} cm and ${n} cm. Find its area (cm²).`)),
          (m * n) / 2,
          bi(() => `${m} · ${n} : 2 = ${(m * n) / 2} cm²`),
        );
      }
      const [a, b] = [int(3, 20), int(3, 20)];
      const h = 2 * int(1, 10);
      return input(
        bi((L) => T(L, `Hình thang có hai đáy ${a} cm và ${b} cm, chiều cao ${h} cm. Tính diện tích (cm²).`, `A trapezoid has bases of ${a} cm and ${b} cm and height ${h} cm. Find its area (cm²).`)),
        ((a + b) * h) / 2,
        bi(() => `(${a} + ${b}) · ${h} : 2 = ${((a + b) * h) / 2} cm²`),
      );
    },
    // Missing side.
    () => {
      const [a, b] = [int(4, 30), int(3, 20)];
      const fromArea = Math.random() < 0.5;
      return input(
        bi((L) => (fromArea
          ? T(L, `Hình chữ nhật có diện tích ${a * b} cm², chiều rộng ${b} cm. Tính chiều dài (cm).`, `A rectangle has area ${a * b} cm² and width ${b} cm. Find its length (cm).`)
          : T(L, `Hình chữ nhật có chu vi ${2 * (a + b)} cm, chiều rộng ${b} cm. Tính chiều dài (cm).`, `A rectangle has perimeter ${2 * (a + b)} cm and width ${b} cm. Find its length (cm).`))),
        a,
        bi(() => (fromArea ? `${a * b} : ${b} = ${a} cm` : `${2 * (a + b)} : 2 − ${b} = ${a + b} − ${b} = ${a} cm`)),
      );
    },
    // Tiles for a floor.
    () => {
      const tile = pick([20, 25, 50]); // sizes that divide 1 m exactly, so tiles fit with no cutting
      const per = 100 / tile;
      const [L1, L2] = [int(2, 8), int(2, 6)];
      const count = L1 * per * L2 * per;
      return input(
        bi((L) => T(L, `Một căn phòng hình chữ nhật dài ${L1} m, rộng ${L2} m được lát bằng gạch vuông cạnh ${tile} cm. Cần bao nhiêu viên gạch?`, `A rectangular room ${L1} m long and ${L2} m wide is tiled with square tiles of side ${tile} cm. How many tiles are needed?`)),
        count,
        bi((L) => T(L, `Đổi ra cm: ${L1 * 100} cm và ${L2 * 100} cm. Mỗi chiều xếp ${L1 * per} và ${L2 * per} viên: ${L1 * per} · ${L2 * per} = ${fmt(count, L)} viên.`, `In cm: ${L1 * 100} cm by ${L2 * 100} cm, so ${L1 * per} by ${L2 * per} tiles: ${L1 * per} · ${L2 * per} = ${fmt(count, L)} tiles.`)),
      );
    },
  ],
};

export const CHAPTER4 = [lesson18, lesson19, lesson20];

// ---------- Nâng cao ----------

export const ADVANCED4 = {
  c4b18: [
    // Matchsticks in a row of triangles or squares.
    () => {
      const tri = Math.random() < 0.5;
      const k = int(4, 30);
      const sticks = tri ? 2 * k + 1 : 3 * k + 1;
      return input(
        bi((L) => T(L, `Xếp que diêm thành một hàng gồm ${k} ${tri ? 'tam giác đều' : 'hình vuông'} liền nhau (hai hình cạnh nhau chung một que). Cần bao nhiêu que?`, `Matchsticks make a row of ${k} ${tri ? 'equilateral triangles' : 'squares'} side by side (neighbours share a stick). How many sticks are needed?`)),
        sticks,
        bi((L) => (tri
          ? T(L, `Hình đầu cần 3 que, mỗi hình tiếp theo thêm 2 que: 3 + 2 · ${k - 1} = ${sticks}.`, `The first needs 3 sticks, each next one 2 more: 3 + 2 · ${k - 1} = ${sticks}.`)
          : T(L, `Hình đầu cần 4 que, mỗi hình tiếp theo thêm 3 que: 4 + 3 · ${k - 1} = ${sticks}.`, `The first needs 4 sticks, each next one 3 more: 4 + 3 · ${k - 1} = ${sticks}.`))),
      );
    },
    // Squares hidden in a grid.
    () => {
      const n = int(2, 5);
      const total = (n * (n + 1) * (2 * n + 1)) / 6;
      const parts = Array.from({ length: n }, (_, i) => (n - i) ** 2);
      return input(
        bi((L) => T(L, `Một hình vuông được chia thành ${n} × ${n} ô vuông nhỏ bằng nhau. Trong hình có tất cả bao nhiêu hình vuông (kể cả hình lớn)?`, `A square is divided into ${n} × ${n} equal small squares. How many squares are there altogether (the big one included)?`)),
        total,
        bi((L) => T(L, `Đếm theo kích thước 1 × 1, 2 × 2, …: ${parts.join(' + ')} = ${total}.`, `Count by size 1 × 1, 2 × 2, …: ${parts.join(' + ')} = ${total}.`)),
      );
    },
    // Hexagon from triangles.
    () => {
      const p = 3 * int(2, 20);
      return input(
        bi((L) => T(L, `Ghép sáu tam giác đều, mỗi tam giác có chu vi ${p} cm, thành một hình lục giác đều. Tính chu vi hình lục giác đều (cm).`, `Six equilateral triangles, each with perimeter ${p} cm, form a regular hexagon. Find the hexagon's perimeter (cm).`)),
        2 * p,
        bi((L) => T(L, `Cạnh tam giác = ${p} : 3 = ${p / 3} cm cũng là cạnh lục giác. Chu vi: 6 · ${p / 3} = ${2 * p} cm.`, `Triangle side = ${p} : 3 = ${p / 3} cm, which is also the hexagon's side. Perimeter: 6 · ${p / 3} = ${2 * p} cm.`)),
      );
    },
  ],
  c4b19: [
    // Rectangle from perimeter and difference.
    () => {
      const b = int(3, 30);
      const d = int(1, 20);
      const a = b + d;
      return input(
        bi((L) => T(L, `Hình chữ nhật có chu vi ${2 * (a + b)} cm, chiều dài hơn chiều rộng ${d} cm. Tính diện tích (cm²).`, `A rectangle has perimeter ${2 * (a + b)} cm and is ${d} cm longer than it is wide. Find its area (cm²).`)),
        a * b,
        bi((L) => T(L, `Nửa chu vi: ${a + b} cm. Chiều dài = (${a + b} + ${d}) : 2 = ${a}, chiều rộng = ${b}. S = ${a} · ${b} = ${a * b} cm².`, `Half the perimeter: ${a + b} cm. Length = (${a + b} + ${d}) : 2 = ${a}, width = ${b}. A = ${a} · ${b} = ${a * b} cm².`)),
      );
    },
    // Rectangle from perimeter and ratio.
    () => {
      const b = int(2, 15);
      const k = int(2, 4);
      const a = k * b;
      return input(
        bi((L) => T(L, `Hình chữ nhật có chu vi ${2 * (a + b)} cm, chiều dài gấp ${k} lần chiều rộng. Tính diện tích (cm²).`, `A rectangle has perimeter ${2 * (a + b)} cm and its length is ${k} times its width. Find its area (cm²).`)),
        a * b,
        bi((L) => T(L, `Nửa chu vi ${a + b} cm gồm ${k + 1} phần bằng nhau: chiều rộng = ${a + b} : ${k + 1} = ${b}, chiều dài = ${a}. S = ${a * b} cm².`, `Half the perimeter, ${a + b} cm, is ${k + 1} equal parts: width = ${a + b} : ${k + 1} = ${b}, length = ${a}. A = ${a * b} cm².`)),
      );
    },
    // Tricky true statements.
    () => statementQuestion([
      ['Hình vuông cũng là một hình chữ nhật.', 'A square is also a rectangle.', true],
      ['Hình vuông cũng là một hình thoi.', 'A square is also a rhombus.', true],
      ['Hình chữ nhật cũng là một hình bình hành.', 'A rectangle is also a parallelogram.', true],
      ['Hình thoi có hai đường chéo bằng nhau là hình vuông.', 'A rhombus with equal diagonals is a square.', true],
      ['Mọi hình thoi đều là hình vuông.', 'Every rhombus is a square.', false],
      ['Mọi hình bình hành đều là hình chữ nhật.', 'Every parallelogram is a rectangle.', false],
      ['Mọi hình thang cân đều là hình bình hành.', 'Every isosceles trapezoid is a parallelogram.', false],
      ['Hình chữ nhật nào cũng có bốn cạnh bằng nhau.', 'Every rectangle has four equal sides.', false],
    ]),
  ],
  c4b20: [
    // L-shaped area.
    () => {
      const [W, Hh] = [int(8, 20), int(6, 16)];
      const [w, h] = [int(2, W - 3), int(2, Hh - 3)];
      const area = W * Hh - w * h;
      const s = 120 / Math.max(W, Hh);
      const [X, Y] = [10, 10];
      const pts = [[X, Y], [X + (W - w) * s, Y], [X + (W - w) * s, Y + h * s], [X + W * s, Y + h * s], [X + W * s, Y + Hh * s], [X, Y + Hh * s]].map((p) => p.map((v) => Math.round(v)));
      const pic = svg(poly(pts, 'sh-body') + label(X + (W * s) / 2, Y + Hh * s + 16, `${W}`) + label(X - 8, Y + (Hh * s) / 2, `${Hh}`)
        // the notch: its width under the inner horizontal edge, its height left of the inner vertical edge
        + label(X + (W - w / 2) * s, Y + h * s + 16, `${w}`) + label(X + (W - w) * s - 10, Y + (h * s) / 2 + 5, `${h}`));
      return input(
        bi((L) => `${T(L, 'Tính diện tích hình dưới đây (đơn vị cm, kết quả cm²).', 'Find the area of this shape (lengths in cm, answer in cm²).')}<br>${pic}`),
        area,
        bi((L) => T(L, `Lấy hình chữ nhật lớn trừ phần bị khuyết: ${W} · ${Hh} − ${w} · ${h} = ${W * Hh} − ${w * h} = ${area} cm².`, `The big rectangle minus the missing corner: ${W} · ${Hh} − ${w} · ${h} = ${W * Hh} − ${w * h} = ${area} cm².`)),
      );
    },
    // Garden with a path around the inside.
    () => {
      const [a, b] = [int(10, 30), int(8, 20)];
      const p = int(1, 2);
      const inner = (a - 2 * p) * (b - 2 * p);
      return input(
        bi((L) => T(L, `Một mảnh vườn hình chữ nhật dài ${a} m, rộng ${b} m. Người ta làm lối đi rộng ${p} m chạy sát bốn cạnh, phía trong vườn. Phần còn lại để trồng rau rộng bao nhiêu mét vuông?`, `A garden is ${a} m by ${b} m. A path ${p} m wide runs inside it along all four sides. What area is left for vegetables, in m²?`)),
        inner,
        bi((L) => T(L, `Phần trồng rau là hình chữ nhật (${a} − ${2 * p}) × (${b} − ${2 * p}) = ${a - 2 * p} × ${b - 2 * p} = ${inner} m².`, `The vegetable patch is (${a} − ${2 * p}) × (${b} − ${2 * p}) = ${a - 2 * p} × ${b - 2 * p} = ${inner} m².`)),
      );
    },
    // Missing height of a trapezoid / diagonal of a rhombus.
    () => {
      if (Math.random() < 0.5) {
        const [a, b] = [int(3, 20), int(3, 20)];
        const h = int(2, 15);
        const S = ((a + b) * h) / 2;
        if (!Number.isInteger(S)) return ADVANCED4.c4b20[2]();
        return input(
          bi((L) => T(L, `Hình thang có diện tích ${S} cm², hai đáy ${a} cm và ${b} cm. Tính chiều cao (cm).`, `A trapezoid has area ${S} cm² and bases ${a} cm and ${b} cm. Find its height (cm).`)),
          h,
          bi(() => `h = ${S} · 2 : (${a} + ${b}) = ${2 * S} : ${a + b} = ${h} cm`),
        );
      }
      const [m, n] = [int(3, 20), int(3, 20)];
      const S = (m * n) / 2;
      if (!Number.isInteger(S)) return ADVANCED4.c4b20[2]();
      return input(
        bi((L) => T(L, `Hình thoi có diện tích ${S} cm², một đường chéo dài ${m} cm. Tính đường chéo còn lại (cm).`, `A rhombus has area ${S} cm² and one diagonal of ${m} cm. Find the other diagonal (cm).`)),
        n,
        bi(() => `${S} · 2 : ${m} = ${2 * S} : ${m} = ${n} cm`),
      );
    },
    // Fence cost.
    () => {
      const [a, b] = [int(10, 50), int(5, 30)];
      const price = pick([20, 25, 50, 100]);
      const cost = 2 * (a + b) * price;
      return input(
        bi((L) => T(L, `Một khu đất hình chữ nhật dài ${a} m, rộng ${b} m được rào xung quanh. Mỗi mét hàng rào giá ${price} nghìn đồng. Tiền làm hàng rào là bao nhiêu nghìn đồng?`, `A rectangular plot ${a} m by ${b} m is fenced all round. Fencing costs ${price} thousand dong per metre. What is the total cost, in thousand dong?`)),
        cost,
        bi((L) => T(L, `Chu vi: 2 · (${a} + ${b}) = ${2 * (a + b)} m. Tiền: ${2 * (a + b)} · ${price} = ${fmt(cost, L)} nghìn đồng.`, `Perimeter: 2 · (${a} + ${b}) = ${2 * (a + b)} m. Cost: ${2 * (a + b)} · ${price} = ${fmt(cost, L)} thousand dong.`)),
      );
    },
  ],
};

export { SHAPE_NAMES, randomParams, statementQuestion, svg, poly, line, label, g, cap };
