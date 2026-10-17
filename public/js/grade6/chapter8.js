// Grade 6 volume 2, Chapter VIII: basic geometric figures. Lessons 32–37
// (points and lines, rays, segments, midpoints, angles, measuring angles)
// with theory, step-by-step pictures, basic and advanced exercises.
// All text is original, written to follow the curriculum topics.

import {
  bi, T, fmt, int, pick, shuffle, choice, input, inputD,
} from './util.js';
import { statementQuestion, cap } from './chapter4.js';

const YES = { vi: 'Có', en: 'Yes' };
const NO = { vi: 'Không', en: 'No' };
const exact = (x) => Number(x.toFixed(6));
const D = (x, L) => fmt(exact(x), L);
const C2 = (n) => (n * (n - 1)) / 2;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'M', 'N', 'P', 'Q', 'K'];
const letters = (n) => shuffle(LETTERS).slice(0, n);

// ---------- drawing ----------

const r1 = (v) => Math.round(v * 10) / 10;
// The point at distance r from o in direction deg (counter-clockwise from →).
const at = ([x, y], deg, r) => [x + r * Math.cos((deg * Math.PI) / 180), y - r * Math.sin((deg * Math.PI) / 180)];
const fig = (body, h = 130, w = 240, cls = '') => `<svg class="shape fig${cls}" viewBox="0 0 ${w} ${h}" role="img">${body}</svg>`;
const seg = (p, q, cls = 'sh-edge') => `<line class="${cls}" x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(q[0])}" y2="${r1(q[1])}"/>`;
const txt = ([x, y], s, cls = 'sh-text') => `<text class="${cls}" x="${r1(x)}" y="${r1(y)}">${s}</text>`;
const dot = (p, name, off = [0, -10]) => `<circle class="sh-dot" cx="${r1(p[0])}" cy="${r1(p[1])}" r="4"/>${name ? txt([p[0] + off[0], p[1] + off[1]], name) : ''}`;
const grp = (html, isNew = true, attrs = '') => `<g${isNew ? ' class="new"' : ''}${attrs ? ` ${attrs}` : ''}>${html}</g>`;
const BELOW = [0, 22];
// A ray from o in direction deg, with its name at the far end.
const ray = (o, deg, len, name, cls = 'sh-edge') => seg(o, at(o, deg, len), cls) + (name ? txt(at(o, deg + (deg > 90 ? -6 : 6), len + 8), name) : '');
// The shaded corner of an angle from direction a1 to a2 (a1 < a2).
function sector(o, a1, a2, r = 22) {
  if (a2 - a1 === 90) {
    const [p, q] = [at(o, a1, 13), at(o, a2, 13)];
    const c = [p[0] + q[0] - o[0], p[1] + q[1] - o[1]];
    return `<polyline class="sh-ang right" points="${[p, c, q].map((v) => v.map(r1).join(',')).join(' ')}"/>`;
  }
  const [p, q] = [at(o, a1, r), at(o, a2, r)].map((v) => v.map(r1));
  return `<path class="sh-ang" d="M ${o.map(r1).join(' ')} L ${p.join(' ')} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${q.join(' ')} Z"/>`;
}
// A ray that turns into place about o, starting `from` degrees clockwise of it.
const spin = (html, o, from) => grp(html, true, `data-anim="spin" data-from="${from}" style="transform-origin: ${r1(o[0])}px ${r1(o[1])}px"`);

// Points spread along a slightly sloping line, left to right.
function onLine(names, { y = 66, slope = pick([-0.15, -0.08, 0, 0.08, 0.15]), x0 = 30, x1 = 210 } = {}) {
  const gap = (x1 - x0) / Math.max(names.length - 1, 1);
  const yAt = (x) => y + slope * (x - 120);
  const pts = names.map((n, i) => {
    const x = x0 + i * gap + (i && i < names.length - 1 ? int(-12, 12) : 0);
    return [x, yAt(x)];
  });
  return { pts, yAt, line: seg([10, yAt(10)], [230, yAt(230)]) };
}

// A protractor centred at O with 0° on the right; rays at a and b degrees.
const PO = [145, 148];
const PR = 118;
function protractor() {
  const ticks = [];
  for (let d = 0; d <= 180; d += 5) {
    ticks.push(seg(at(PO, d, PR - (d % 10 ? 5 : 9)), at(PO, d, PR), 'sh-prot-tick'));
    // Numbers turned along the arc, as on a real protractor.
    const [x, y] = at(PO, d, PR - 18).map(r1);
    if (d % 10 === 0) ticks.push(`<text class="sh-prot-num" x="${x}" y="${y}" transform="rotate(${90 - d} ${x} ${y})">${d}</text>`);
  }
  return `<path class="sh-prot" d="M ${PO[0] - PR} ${PO[1]} A ${PR} ${PR} 0 0 1 ${PO[0] + PR} ${PO[1]} Z"/>${ticks.join('')}`;
}
const protRays = (a, b) => ray(PO, a, PR + 12, 'x') + ray(PO, b, PR + 12, 'y') + dot(PO, 'O', [0, 18]);
const protFig = (body) => fig(body, 176, 290, ' wide');

// ---------- Bài 32. Điểm và đường thẳng ----------

const STATEMENTS_32 = [
  ['Qua hai điểm phân biệt có một và chỉ một đường thẳng.', 'Exactly one line passes through two different points.', true],
  ['Hai đường thẳng phân biệt có nhiều nhất một điểm chung.', 'Two different lines have at most one common point.', true],
  ['Nếu điểm C thuộc đường thẳng AB thì ba điểm A, B, C thẳng hàng.', 'If C lies on the line AB, then A, B and C are collinear.', true],
  ['Hai đường thẳng song song không có điểm chung nào.', 'Two parallel lines have no common point.', true],
  ['Đường thẳng AB và đường thẳng BA là một đường thẳng.', 'The line AB and the line BA are the same line.', true],
  ['Qua hai điểm phân biệt vẽ được vô số đường thẳng.', 'Infinitely many lines pass through two different points.', false],
  ['Hai đường thẳng phân biệt có thể có hai điểm chung.', 'Two different lines can have two common points.', false],
  ['Ba điểm bất kì luôn thẳng hàng.', 'Any three points are always collinear.', false],
  ['Hai đường thẳng không cắt nhau thì phải trùng nhau.', 'Two lines that do not intersect must coincide.', false],
  ['Kí hiệu A ∈ d nghĩa là điểm A không nằm trên đường thẳng d.', 'A ∈ d means that A does not lie on the line d.', false],
];

const REL = {
  par: { vi: 'Song song', en: 'Parallel' },
  cut: { vi: 'Cắt nhau', en: 'Intersecting' },
  same: { vi: 'Trùng nhau', en: 'Coinciding' },
};

const lesson32 = {
  id: 'c8b32',
  number: 32,
  title: { vi: 'Điểm và đường thẳng', en: 'Points and lines' },
  points: [
    {
      title: { vi: 'Điểm thuộc đường thẳng', en: 'A point on a line' },
      theory: {
        vi: [
          'Điểm được đặt tên bằng chữ in hoa (A, B, M…); đường thẳng bằng chữ thường (a, d, m…). Đường thẳng không bị giới hạn về hai phía.',
          '<b>A ∈ d</b>: điểm A <b>thuộc</b> đường thẳng d (A nằm trên d, d đi qua A).',
          '<b>B ∉ d</b>: điểm B <b>không thuộc</b> đường thẳng d.',
        ],
        en: [
          'Points are named with capital letters (A, B, M…), lines with small letters (a, d, m…). A line goes on forever both ways.',
          '<b>A ∈ d</b>: the point A <b>lies on</b> the line d (d passes through A).',
          '<b>B ∉ d</b>: the point B <b>does not lie on</b> d.',
        ],
      },
      example: {
        caption: { vi: 'Đường thẳng d và hai điểm A, B.', en: 'The line d and two points A, B.' },
        frames: (L) => {
          const d = seg([10, 80], [230, 80]) + txt([225, 70], 'd');
          const A = dot([80, 80], 'A');
          const B = dot([160, 36], 'B');
          return [
            fig(d) + cap(T(L, 'Đường thẳng d (kéo dài mãi về hai phía).', 'The line d (it goes on forever both ways).')),
            fig(d + grp(A)) + cap(T(L, 'A nằm trên d: <b>A ∈ d</b>.', 'A is on d: <b>A ∈ d</b>.'), true),
            fig(d + A + grp(B)) + cap(T(L, 'B không nằm trên d: <b>B ∉ d</b>.', 'B is not on d: <b>B ∉ d</b>.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Ba điểm thẳng hàng', en: 'Collinear points' },
      theory: {
        vi: [
          'Có <b>một và chỉ một</b> đường thẳng đi qua hai điểm phân biệt A và B: đường thẳng AB (hay BA).',
          'Ba điểm cùng thuộc một đường thẳng là ba điểm <b>thẳng hàng</b>; nếu không có đường thẳng nào đi qua cả ba thì chúng <b>không thẳng hàng</b>.',
          'Kiểm tra bằng thước thẳng: đặt thước qua hai điểm, xem điểm thứ ba có nằm trên mép thước không.',
        ],
        en: [
          'Through two different points A and B there is <b>exactly one</b> line: the line AB (or BA).',
          'Three points on one line are <b>collinear</b>; if no line passes through all three, they are <b>not collinear</b>.',
          'Check with a ruler: lay it through two of the points and see whether the third is on its edge.',
        ],
      },
      example: {
        caption: { vi: 'Đường thẳng AB, điểm C và điểm D.', en: 'The line AB, a point C and a point D.' },
        frames: (L) => {
          const yAt = (x) => 92 - 0.25 * (x - 40);
          const AB = dot([40, yAt(40)], 'A', BELOW) + dot([200, yAt(200)], 'B', BELOW);
          const ln = seg([10, yAt(10)], [230, yAt(230)]);
          const C = dot([120, yAt(120)], 'C', BELOW);
          const Dp = dot([168, 100], 'D', BELOW);
          return [
            fig(AB) + cap(T(L, 'Hai điểm phân biệt A và B.', 'Two different points A and B.')),
            fig(grp(ln) + AB) + cap(T(L, 'Chỉ có một đường thẳng đi qua A và B: đường thẳng AB.', 'Only one line passes through A and B: the line AB.'), true),
            fig(ln + AB + grp(C)) + cap(T(L, 'C ∈ AB: ba điểm A, B, C <b>thẳng hàng</b>.', 'C ∈ AB: A, B and C are <b>collinear</b>.'), true),
            fig(ln + AB + C + grp(Dp)) + cap(T(L, 'D ∉ AB: ba điểm A, B, D <b>không thẳng hàng</b>.', 'D ∉ AB: A, B and D are <b>not collinear</b>.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Vị trí của hai đường thẳng', en: 'Two lines' },
      theory: {
        vi: [
          'Hai đường thẳng <b>song song</b> (a // b): không có điểm chung nào.',
          'Hai đường thẳng <b>cắt nhau</b>: có đúng một điểm chung, gọi là <b>giao điểm</b>.',
          'Hai đường thẳng <b>trùng nhau</b>: có hai (rồi mọi) điểm chung — thực ra chỉ là một đường thẳng.',
        ],
        en: [
          'Two <b>parallel</b> lines (a // b) have no common point.',
          'Two <b>intersecting</b> lines have exactly one common point, their <b>intersection point</b>.',
          'Two <b>coinciding</b> lines share two (and then all) points — they are really one line.',
        ],
      },
      example: {
        caption: { vi: 'Ba trường hợp của hai đường thẳng a và b.', en: 'Three ways two lines a and b can lie.' },
        frames: (L) => [
          fig(grp(seg([10, 50], [230, 30]) + txt([225, 22], 'a') + seg([10, 105], [230, 85], 'sh-edge b') + txt([225, 77], 'b')))
            + cap(T(L, 'Không có điểm chung: <b>a // b</b>.', 'No common point: <b>a // b</b>.'), true),
          fig(grp(seg([10, 30], [230, 105]) + txt([225, 95], 'a') + seg([10, 110], [230, 25], 'sh-edge b') + txt([225, 17], 'b') + dot([120, 67.5], 'I', [0, -12])))
            + cap(T(L, 'Đúng một điểm chung: a và b <b>cắt nhau</b> tại giao điểm I.', 'Exactly one common point: a and b <b>intersect</b> at I.'), true),
          fig(grp(seg([10, 90], [230, 40], 'sh-edge b thick') + seg([10, 90], [230, 40]) + txt([225, 30], 'a ≡ b') + dot([70, 76.4], 'M', BELOW) + dot([170, 53.6], 'N', BELOW)))
            + cap(T(L, 'Hai điểm chung M, N: a và b <b>trùng nhau</b>.', 'Two common points M and N: a and b <b>coincide</b>.'), true),
        ],
      },
    },
  ],
  exercises: [
    // Which point is (not) on d?
    () => {
      const askOn = Math.random() < 0.5;
      const names = letters(4);
      const order = shuffle([0, 1, 2, 3]);
      const { pts, yAt, line } = onLine(order.map((i) => names[i]), { x0: 30, x1: 190 });
      const body = order.map((i, k) => {
        const target = i === 0;
        const isOn = askOn ? target : !target;
        const [x, y] = pts[k];
        const off = isOn ? 0 : pick([-1, 1]) * int(26, 34);
        return dot([x, y + off], names[i], off > 0 ? BELOW : [0, -10]);
      }).join('');
      const pic = fig(line + txt([226, yAt(226) - 10], 'd') + body, 140);
      return choice(
        bi((L) => `${askOn ? T(L, 'Điểm nào <b>thuộc</b> đường thẳng d?', 'Which point <b>lies on</b> the line d?') : T(L, 'Điểm nào <b>không thuộc</b> đường thẳng d?', 'Which point does <b>not</b> lie on the line d?')}<br>${pic}`),
        names[0],
        names.slice(1),
        bi(() => `${names[0]} ${askOn ? '∈' : '∉'} d`),
      );
    },
    // Collinear or not, from a picture.
    () => {
      const names = letters(3);
      const straight = Math.random() < 0.5;
      const { pts } = onLine(names, { slope: pick([-0.3, -0.15, 0.15, 0.3]), x0: 40, x1: 200 });
      if (!straight) pts[1] = [pts[1][0], pts[1][1] + pick([-1, 1]) * int(22, 32)];
      const pic = fig(names.map((n, i) => dot(pts[i], n)).join(''), 130);
      const right = straight ? { vi: 'Thẳng hàng', en: 'Collinear' } : { vi: 'Không thẳng hàng', en: 'Not collinear' };
      const wrong = straight ? { vi: 'Không thẳng hàng', en: 'Not collinear' } : { vi: 'Thẳng hàng', en: 'Collinear' };
      return choice(
        bi((L) => `${T(L, `Ba điểm ${names.join(', ')} có thẳng hàng không?`, `Are ${names.join(', ')} collinear?`)}<br>${pic}`),
        right,
        [wrong],
        bi((L) => (straight
          ? T(L, `Đặt thước qua ${names[0]} và ${names[2]}: ${names[1]} nằm trên mép thước.`, `A ruler through ${names[0]} and ${names[2]} also passes through ${names[1]}.`)
          : T(L, `Đường thẳng ${names[0]}${names[2]} không đi qua ${names[1]}.`, `The line ${names[0]}${names[2]} does not pass through ${names[1]}.`))),
      );
    },
    // How do two lines lie?
    () => {
      const [a, b] = pick([['a', 'b'], ['m', 'n'], ['d', 'd\'']]);
      const variants = [
        [{ vi: `Hai đường thẳng ${a}, ${b} không có điểm chung nào.`, en: `The lines ${a} and ${b} have no common point.` }, 'par'],
        [{ vi: `Hai đường thẳng ${a}, ${b} có đúng một điểm chung.`, en: `The lines ${a} and ${b} have exactly one common point.` }, 'cut'],
        [{ vi: `Hai đường thẳng ${a}, ${b} có hai điểm chung phân biệt.`, en: `The lines ${a} and ${b} have two different common points.` }, 'same'],
        [{ vi: `Hai đường thẳng ${a}, ${b} có giao điểm là O.`, en: `The lines ${a} and ${b} meet at the point O.` }, 'cut'],
      ];
      const [text, rel] = pick(variants);
      return choice(
        bi((L) => `${text[L]} ${T(L, 'Hai đường thẳng đó:', 'The two lines are:')}`),
        REL[rel],
        Object.keys(REL).filter((k) => k !== rel).map((k) => REL[k]),
        bi((L) => T(L, '0 điểm chung: song song; 1 điểm chung: cắt nhau; từ 2 điểm chung: trùng nhau.', '0 common points: parallel; 1: intersecting; 2 or more: coinciding.')),
      );
    },
    // Lines through pairs of points.
    () => {
      const n = int(3, 12);
      return input(
        bi((L) => T(L, `Cho ${n} điểm, không có ba điểm nào thẳng hàng. Kẻ các đường thẳng đi qua từng cặp điểm. Có bao nhiêu đường thẳng?`, `There are ${n} points, no three of them collinear. A line is drawn through each pair of points. How many lines are there?`)),
        C2(n),
        bi((L) => T(L, `Mỗi điểm nối với ${n - 1} điểm còn lại, mỗi đường thẳng được đếm hai lần: ${n} · ${n - 1} : 2 = ${C2(n)}.`, `Each point joins the other ${n - 1}, and each line is counted twice: ${n} · ${n - 1} : 2 = ${C2(n)}.`)),
      );
    },
    () => statementQuestion(STATEMENTS_32),
  ],
};

// ---------- Bài 33. Điểm nằm giữa hai điểm. Tia ----------

const rayName = (name) => ({ vi: `Tia ${name}`, en: `Ray ${name}` });

const lesson33 = {
  id: 'c8b33',
  number: 33,
  title: { vi: 'Điểm nằm giữa hai điểm. Tia', en: 'A point between two points. Rays' },
  points: [
    {
      title: { vi: 'Điểm nằm giữa hai điểm', en: 'A point between two points' },
      theory: {
        vi: [
          'Trong ba điểm thẳng hàng, có <b>một và chỉ một</b> điểm nằm giữa hai điểm còn lại.',
          'Nếu B nằm giữa A và C thì: A và C nằm <b>khác phía</b> đối với B; A và B nằm <b>cùng phía</b> đối với C; B và C nằm cùng phía đối với A.',
        ],
        en: [
          'Of three collinear points, <b>exactly one</b> lies between the other two.',
          'If B is between A and C, then A and C are on <b>opposite sides</b> of B; A and B are on the <b>same side</b> of C; B and C are on the same side of A.',
        ],
      },
      example: {
        caption: { vi: 'Ba điểm thẳng hàng A, B, C.', en: 'Three collinear points A, B, C.' },
        frames: (L) => {
          const [A, B, C] = [[35, 70], [115, 70], [205, 70]];
          const base = seg([10, 70], [230, 70]) + dot(A, 'A', BELOW) + dot(C, 'C', BELOW);
          return [
            fig(base + dot(B, 'B', BELOW)) + cap(T(L, 'A, B, C cùng thuộc một đường thẳng.', 'A, B and C are on one line.')),
            fig(base + dot(B, 'B', BELOW) + grp(`<circle class="sh-ring" cx="${B[0]}" cy="${B[1]}" r="10"/>`)) + cap(T(L, '<b>B nằm giữa A và C.</b>', '<b>B is between A and C.</b>'), true),
            fig(base + grp(seg(A, B, 'sh-edge b thick') + seg(B, C, 'sh-edge c thick')) + dot(B, 'B', BELOW))
              + cap(T(L, 'A và C nằm <b>khác phía</b> đối với B.', 'A and C are on <b>opposite sides</b> of B.'), true),
            fig(base + grp(seg(A, C, 'sh-edge b thick')) + dot(B, 'B', BELOW))
              + cap(T(L, 'A và B nằm <b>cùng phía</b> đối với C.', 'A and B are on the <b>same side</b> of C.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Tia', en: 'Rays' },
      theory: {
        vi: [
          'Điểm O trên đường thẳng xy chia đường thẳng thành hai phần; mỗi phần cùng với O là một <b>tia gốc O</b>: tia Ox và tia Oy.',
          'Hai tia chung gốc tạo thành một đường thẳng là hai <b>tia đối nhau</b> (Ox và Oy).',
          'Nếu A thuộc tia Ox (A ≠ O) thì tia OA <b>trùng</b> với tia Ox. Khi đọc tên tia, chữ cái đầu tiên luôn là gốc.',
        ],
        en: [
          'A point O on the line xy splits it in two; each part together with O is a <b>ray with origin O</b>: ray Ox and ray Oy.',
          'Two rays with the same origin that make up a line are <b>opposite rays</b> (Ox and Oy).',
          'If A is on ray Ox (A ≠ O), ray OA is the <b>same ray</b> as Ox. A ray\'s name always starts with its origin.',
        ],
      },
      example: {
        caption: { vi: 'Đường thẳng xy và điểm O.', en: 'The line xy and a point O.' },
        frames: (L) => {
          const O = [120, 70];
          const base = seg([12, 70], [228, 70]) + txt([14, 58], 'x') + txt([226, 58], 'y');
          const Ox = seg(O, [12, 70], 'sh-edge b thick');
          const Oy = seg(O, [228, 70], 'sh-edge c thick');
          const o = dot(O, 'O', BELOW);
          return [
            fig(base + o) + cap(T(L, 'Điểm O chia đường thẳng xy thành hai phần.', 'O splits the line xy into two parts.')),
            fig(base + grp(Ox) + o) + cap(T(L, 'Phần bên trái cùng với O: <b>tia Ox</b>, gốc O.', 'The left part with O: <b>ray Ox</b>, origin O.'), true),
            fig(base + Ox + grp(Oy) + o) + cap(T(L, 'Tia Oy. Ox và Oy là hai <b>tia đối nhau</b>.', 'Ray Oy. Ox and Oy are <b>opposite rays</b>.'), true),
            fig(base + Ox + Oy + o + grp(dot([60, 70], 'A', BELOW))) + cap(T(L, 'A thuộc tia Ox: tia OA <b>trùng</b> với tia Ox.', 'A is on ray Ox: ray OA is the <b>same ray</b> as Ox.'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Which point is between the other two?
    () => {
      const names = letters(3);
      const { pts, line } = onLine(names, { x0: 40, x1: 200 });
      const pic = fig(line + names.map((n, i) => dot(pts[i], n, BELOW)).join(''), 110);
      return choice(
        bi((L) => `${T(L, 'Điểm nào nằm giữa hai điểm còn lại?', 'Which point is between the other two?')}<br>${pic}`),
        names[1],
        [names[0], names[2]],
        bi((L) => T(L, `${names[1]} nằm giữa ${names[0]} và ${names[2]}.`, `${names[1]} is between ${names[0]} and ${names[2]}.`)),
      );
    },
    // Opposite ray.
    () => {
      const n = pick([3, 4]);
      const order = letters(n);
      const i = int(1, n - 2);
      const P = order[i];
      const sides = shuffle([order.slice(0, i), order.slice(i + 1)]);
      const [Q, R] = [pick(sides[0]), pick(sides[1])];
      const { pts, line } = onLine(order, { x0: 30, x1: 210 });
      const pic = fig(line + order.map((m, k) => dot(pts[k], m, BELOW)).join(''), 110);
      return {
        ...choice(
          bi((L) => `${T(L, `Tia đối của tia ${P}${Q} là tia nào?`, `Which ray is opposite to ray ${P}${Q}?`)}<br>${pic}`),
          rayName(`${P}${R}`),
          [rayName(`${P}${Q}`), rayName(`${Q}${P}`), rayName(`${R}${P}`)],
          bi((L) => T(L, `Gốc vẫn là ${P}, nhưng đi về phía ngược lại (phía ${R}): tia ${P}${R}.`, `Same origin ${P}, other direction (towards ${R}): ray ${P}${R}.`)),
        ),
        check: { order, kind: 'opposite', ray: [P, Q] },
      };
    },
    // Same ray.
    () => {
      const order = letters(4);
      const flip = Math.random() < 0.5;
      const i = int(0, 1);
      const line4 = flip ? [...order].reverse() : order;
      const P = line4[i];
      const [Q, R] = shuffle(line4.slice(i + 1)).slice(0, 2);
      const { pts, line } = onLine(order, { x0: 30, x1: 210 });
      const pic = fig(line + order.map((m, k) => dot(pts[k], m, BELOW)).join(''), 110);
      return {
        ...choice(
          bi((L) => `${T(L, `Tia nào <b>trùng</b> với tia ${P}${Q}?`, `Which ray is the <b>same</b> as ray ${P}${Q}?`)}<br>${pic}`),
          rayName(`${P}${R}`),
          [rayName(`${Q}${P}`), rayName(`${R}${P}`), rayName(`${Q}${R}`)],
          bi((L) => T(L, `Cùng gốc ${P}, ${Q} và ${R} nằm cùng phía đối với ${P}: tia ${P}${R} trùng tia ${P}${Q}.`, `Same origin ${P}, and ${Q}, ${R} are on the same side of ${P}: ray ${P}${R} is ray ${P}${Q}.`)),
        ),
        check: { order, kind: 'same', ray: [P, Q] },
      };
    },
    // Rays on a line.
    () => {
      const n = int(2, 15);
      return input(
        bi((L) => T(L, `Trên đường thẳng xy lấy ${n} điểm phân biệt. Có bao nhiêu tia có gốc là một trong ${n} điểm đó? (Các tia trùng nhau chỉ tính một lần.)`, `${n} different points are marked on the line xy. How many rays have one of these points as origin? (Count rays that are the same only once.)`)),
        2 * n,
        bi((L) => T(L, `Mỗi điểm là gốc của đúng hai tia đối nhau: 2 · ${n} = ${2 * n}.`, `Each point is the origin of exactly two opposite rays: 2 · ${n} = ${2 * n}.`)),
      );
    },
    // Between, from words.
    () => {
      const O = pick(['O', 'I', 'K']);
      const [M, N] = shuffle(LETTERS.filter((c) => c !== O)).slice(0, 2);
      const [a, b] = [int(1, 9), int(10, 20)];
      const opposite = Math.random() < 0.5;
      const text = opposite
        ? { vi: `Điểm ${M} nằm trên tia ${O}x, điểm ${N} nằm trên tia đối của tia ${O}x.`, en: `${M} is on ray ${O}x and ${N} is on the ray opposite to ${O}x.` }
        : { vi: `Hai điểm ${M}, ${N} nằm trên tia ${O}x với ${O}${M} = ${a} cm, ${O}${N} = ${b} cm.`, en: `${M} and ${N} are on ray ${O}x with ${O}${M} = ${a} cm and ${O}${N} = ${b} cm.` };
      const right = opposite ? O : M;
      return choice(
        bi((L) => `${text[L]} ${T(L, 'Điểm nào nằm giữa hai điểm còn lại?', 'Which point is between the other two?')}`),
        right,
        [O, M, N].filter((c) => c !== right),
        bi((L) => (opposite
          ? T(L, `${M} và ${N} nằm khác phía đối với ${O}, nên ${O} nằm giữa.`, `${M} and ${N} are on opposite sides of ${O}, so ${O} is between them.`)
          : T(L, `${a} &lt; ${b}: ${M} gần ${O} hơn, nên ${M} nằm giữa ${O} và ${N}.`, `${a} &lt; ${b}: ${M} is nearer to ${O}, so ${M} is between ${O} and ${N}.`))),
      );
    },
  ],
};

// ---------- Bài 34. Đoạn thẳng. Độ dài đoạn thẳng ----------

const RULER_U = 25;
function ruler(x0, y, cm) {
  const ticks = [];
  for (let k = 0; k <= 2 * cm; k++) {
    const x = x0 + (k * RULER_U) / 2;
    ticks.push(seg([x, y], [x, y + (k % 2 ? 5 : 10)], 'sh-prot-tick'));
    if (k % 2 === 0) ticks.push(txt([x, y + 20], k / 2, 'sh-prot-num'));
  }
  return `<rect class="sh-prot" x="${x0 - 10}" y="${y}" width="${cm * RULER_U + 20}" height="28" rx="3"/>${ticks.join('')}`;
}

const lesson34 = {
  id: 'c8b34',
  number: 34,
  title: { vi: 'Đoạn thẳng. Độ dài đoạn thẳng', en: 'Segments and their lengths' },
  points: [
    {
      title: { vi: 'Đoạn thẳng', en: 'Segments' },
      theory: {
        vi: [
          '<b>Đoạn thẳng AB</b> gồm hai điểm A, B và tất cả các điểm nằm giữa A và B. A và B là hai <b>mút</b> (đầu mút) của đoạn thẳng.',
          'Đoạn thẳng AB bị giới hạn ở cả hai đầu; tia AB chỉ giới hạn ở gốc A; đường thẳng AB không bị giới hạn.',
        ],
        en: [
          'The <b>segment AB</b> is made of A, B and every point between A and B. A and B are its <b>endpoints</b>.',
          'A segment stops at both ends; the ray AB stops only at its origin A; the line AB never stops.',
        ],
      },
      example: {
        caption: { vi: 'Đoạn thẳng, tia và đường thẳng AB.', en: 'The segment, the ray and the line AB.' },
        frames: (L) => {
          const row = (y, from, to, tag, isNew) => grp(seg([from, y], [to, y]) + dot([70, y], 'A') + dot([150, y], 'B') + txt([232, y + 20], tag, 'sh-small'), isNew);
          const s = (isNew) => row(30, 70, 150, T(L, 'đoạn thẳng AB', 'segment AB'), isNew);
          const r = (isNew) => row(78, 70, 232, T(L, 'tia AB', 'ray AB'), isNew);
          const l = (isNew) => row(126, 8, 232, T(L, 'đường thẳng AB', 'line AB'), isNew);
          return [
            fig(s(false), 156) + cap(T(L, 'Đoạn thẳng AB: A, B và mọi điểm nằm giữa A và B.', 'Segment AB: A, B and every point between them.')),
            fig(s(false) + r(true), 156) + cap(T(L, 'Tia AB chỉ dừng ở gốc A.', 'Ray AB stops only at its origin A.'), true),
            fig(s(false) + r(false) + l(true), 156) + cap(T(L, 'Đường thẳng AB không dừng ở phía nào.', 'Line AB never stops.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Độ dài đoạn thẳng', en: 'Length of a segment' },
      theory: {
        vi: [
          'Mỗi đoạn thẳng có một <b>độ dài</b> (lớn hơn 0), đo bằng thước có chia khoảng. Độ dài AB còn gọi là <b>khoảng cách</b> giữa A và B.',
          'So sánh hai đoạn thẳng bằng cách so sánh độ dài: AB = CD, AB &lt; CD hoặc AB &gt; CD (nhớ đổi về cùng đơn vị).',
          'Nếu điểm M nằm giữa A và B thì <b>AM + MB = AB</b>.',
        ],
        en: [
          'Every segment has a <b>length</b> (greater than 0), measured with a ruler. The length AB is also the <b>distance</b> between A and B.',
          'Compare segments by their lengths: AB = CD, AB &lt; CD or AB &gt; CD (use the same unit).',
          'If M is between A and B, then <b>AM + MB = AB</b>.',
        ],
      },
      example: {
        caption: { vi: 'Đo đoạn thẳng AB bằng thước.', en: 'Measuring AB with a ruler.' },
        frames: (L) => {
          const [A, B, M] = [[20, 46], [220, 46], [95, 46]];
          const ab = seg(A, B) + dot(A, 'A') + dot(B, 'B');
          const m = dot(M, 'M') + txt([57.5, 16], '3 cm', 'sh-text accent') + txt([157.5, 16], '5 cm', 'sh-text accent');
          return [
            fig(ab + grp(ruler(20, 50, 8)), 100) + cap(T(L, 'Vạch 0 đặt ở A, B ở vạch 8: <b>AB = 8 cm</b>.', 'The 0 mark at A, B at 8: <b>AB = 8 cm</b>.')),
            fig(ab + ruler(20, 50, 8) + grp(m), 100) + cap(T(L, 'M nằm giữa A và B: AM = 3 cm, MB = 5 cm.', 'M is between A and B: AM = 3 cm, MB = 5 cm.'), true),
            fig(ab + ruler(20, 50, 8) + m, 100) + cap(T(L, 'AM + MB = AB: 3 + 5 = 8 (cm)', 'AM + MB = AB: 3 + 5 = 8 (cm)'), true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // AM + MB = AB.
    () => {
      const [a, b] = [int(5, 120), int(5, 120)];
      const findAB = Math.random() < 0.5;
      return inputD(
        bi((L) => (findAB
          ? T(L, `Điểm M nằm giữa A và B, AM = ${D(a / 10, L)} cm, MB = ${D(b / 10, L)} cm. Tính AB (cm).`, `M is between A and B, AM = ${D(a / 10, L)} cm and MB = ${D(b / 10, L)} cm. Find AB (cm).`)
          : T(L, `Điểm M nằm giữa A và B, AB = ${D((a + b) / 10, L)} cm, AM = ${D(a / 10, L)} cm. Tính MB (cm).`, `M is between A and B, AB = ${D((a + b) / 10, L)} cm and AM = ${D(a / 10, L)} cm. Find MB (cm).`))),
        exact((findAB ? a + b : b) / 10),
        bi((L) => (findAB
          ? `AB = AM + MB = ${D(a / 10, L)} + ${D(b / 10, L)} = ${D((a + b) / 10, L)} cm`
          : `MB = AB − AM = ${D((a + b) / 10, L)} − ${D(a / 10, L)} = ${D(b / 10, L)} cm`)),
      );
    },
    // Segments between n points.
    () => {
      const n = int(3, 12);
      const onOneLine = Math.random() < 0.5;
      return input(
        bi((L) => (onOneLine
          ? T(L, `Trên một đường thẳng có ${n} điểm phân biệt. Có bao nhiêu đoạn thẳng có hai mút là hai trong các điểm đó?`, `${n} different points lie on one line. How many segments have two of these points as endpoints?`)
          : T(L, `Cho ${n} điểm, không có ba điểm nào thẳng hàng. Nối từng cặp điểm, được bao nhiêu đoạn thẳng?`, `There are ${n} points, no three collinear. Joining every pair gives how many segments?`))),
        C2(n),
        bi((L) => T(L, `Mỗi cặp điểm cho một đoạn thẳng: ${n} · ${n - 1} : 2 = ${C2(n)}.`, `Each pair of points gives one segment: ${n} · ${n - 1} : 2 = ${C2(n)}.`)),
      );
    },
    // Longest / shortest in mixed units.
    () => {
      const mm = shuffle([...new Set(Array.from({ length: 8 }, () => int(15, 400)))]).slice(0, 4);
      if (mm.length < 4) return lesson34.exercises[2]();
      const names = ['AB', 'CD', 'EF', 'GH'];
      const units = mm.map(() => pick(['mm', 'cm', 'dm']));
      const shown = (i, L) => `${names[i]} = ${D(mm[i] / { mm: 1, cm: 10, dm: 100 }[units[i]], L)} ${units[i]}`;
      const longest = Math.random() < 0.5;
      const best = mm.indexOf(longest ? Math.max(...mm) : Math.min(...mm));
      return choice(
        bi((L) => `${T(L, `Đoạn thẳng nào <b>${longest ? 'dài' : 'ngắn'} nhất</b>?`, `Which segment is the <b>${longest ? 'longest' : 'shortest'}</b>?`)}<br>${mm.map((_, i) => shown(i, L)).join('; ')}`),
        names[best],
        names.filter((_, i) => i !== best),
        bi((L) => T(L, `Đổi ra mm: ${mm.map((v, i) => `${names[i]} = ${v} mm`).join(', ')}.`, `In mm: ${mm.map((v, i) => `${names[i]} = ${v} mm`).join(', ')}.`)),
      );
    },
    // Which of three collinear points is between, from the lengths.
    () => {
      const [P, Q, R] = letters(3);
      const [x, y] = [int(2, 15), int(2, 15)];
      const name = (u, v) => (Math.random() < 0.5 ? `${u}${v}` : `${v}${u}`);
      const facts = shuffle([`${name(P, Q)} = ${x} cm`, `${name(Q, R)} = ${y} cm`, `${name(P, R)} = ${x + y} cm`]);
      const listed = [P, Q, R].sort().join(', ');
      return choice(
        bi((L) => T(L, `Ba điểm ${listed} thẳng hàng, ${facts.join('; ')}. Điểm nào nằm giữa hai điểm còn lại?`, `${listed} are collinear with ${facts.join(', ')}. Which point is between the other two?`)),
        Q,
        [P, R],
        bi((L) => T(L, `${P}${Q} + ${Q}${R} = ${x} + ${y} = ${x + y} = ${P}${R}, nên ${Q} nằm giữa ${P} và ${R}.`, `${P}${Q} + ${Q}${R} = ${x} + ${y} = ${x + y} = ${P}${R}, so ${Q} is between ${P} and ${R}.`)),
      );
    },
  ],
};

// ---------- Bài 35. Trung điểm của đoạn thẳng ----------

const lesson35 = {
  id: 'c8b35',
  number: 35,
  title: { vi: 'Trung điểm của đoạn thẳng', en: 'The midpoint of a segment' },
  points: [
    {
      title: { vi: 'Trung điểm', en: 'The midpoint' },
      theory: {
        vi: [
          'Điểm M là <b>trung điểm</b> của đoạn thẳng AB nếu M nằm giữa A, B và <b>MA = MB</b>.',
          'Khi đó <b>MA = MB = AB : 2</b>. Trung điểm còn gọi là điểm chính giữa của đoạn thẳng.',
          'Chú ý: chỉ MA = MB thì chưa đủ — M còn phải nằm giữa A và B.',
        ],
        en: [
          'M is the <b>midpoint</b> of segment AB if M is between A and B and <b>MA = MB</b>.',
          'Then <b>MA = MB = AB : 2</b>. The midpoint is the exact middle of the segment.',
          'Note: MA = MB alone is not enough — M must also be between A and B.',
        ],
      },
      example: {
        caption: { vi: 'Trung điểm M của đoạn thẳng AB dài 6 cm.', en: 'The midpoint M of a 6 cm segment AB.' },
        frames: (L) => {
          const [A, B, M] = [[30, 70], [210, 70], [120, 70]];
          const ab = seg(A, B) + dot(A, 'A', BELOW) + dot(B, 'B', BELOW) + txt([120, 30], 'AB = 6 cm', 'sh-text accent');
          const ticks = seg([72, 62], [72, 78], 'sh-tick') + seg([168, 62], [168, 78], 'sh-tick');
          return [
            fig(ab, 110) + cap(T(L, 'Đoạn thẳng AB = 6 cm.', 'Segment AB = 6 cm.')),
            fig(ab + grp(dot(M, 'M', BELOW)), 110) + cap(T(L, 'M nằm giữa A và B…', 'M is between A and B…'), true),
            fig(ab + dot(M, 'M', BELOW) + grp(ticks), 110) + cap(T(L, '…và MA = MB (cùng một vạch đánh dấu).', '…and MA = MB (the same marks).'), true),
            fig(ab + dot(M, 'M', BELOW) + ticks, 110) + cap(T(L, 'MA = MB = 6 : 2 = <b>3 cm</b>', 'MA = MB = 6 : 2 = <b>3 cm</b>'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Tìm trung điểm', en: 'Finding the midpoint' },
      theory: {
        vi: [
          '<b>Dùng thước:</b> đo AB, tính AB : 2, rồi đánh dấu M trên đoạn AB sao cho AM = AB : 2.',
          '<b>Gấp giấy:</b> vẽ AB trên một băng giấy, gấp sao cho B trùng A; nếp gấp cắt AB tại trung điểm M.',
        ],
        en: [
          '<b>With a ruler:</b> measure AB, work out AB : 2 and mark M on AB with AM = AB : 2.',
          '<b>By folding:</b> draw AB on a strip of paper and fold it so that B lands on A; the fold crosses AB at the midpoint M.',
        ],
      },
      example: {
        caption: { vi: 'Gấp băng giấy để tìm trung điểm.', en: 'Fold a paper strip to find the midpoint.' },
        frames: (L) => {
          const left = '<rect class="sh-paper" x="20" y="40" width="100" height="50"/>' + seg([40, 65], [120, 65]);
          const right = '<rect class="sh-paper" x="120" y="40" width="100" height="50"/>' + seg([120, 65], [200, 65]) + `<circle class="sh-dot" cx="200" cy="65" r="4"/>`;
          const A = dot([40, 65], 'A', [0, 42]);
          const fold = grp(right, true, 'data-anim="flip" style="transform: scaleX(-1); transform-origin: 120px 0px"');
          return [
            fig(left + right + A + txt([200, 107], 'B'), 120) + cap(T(L, 'Đoạn thẳng AB vẽ trên băng giấy.', 'Segment AB on a strip of paper.')),
            fig(left + fold + txt([40, 107], 'A ≡ B'), 120) + cap(T(L, 'Gấp đôi băng giấy sao cho B trùng A.', 'Fold the strip so that B lands on A.'), true),
            fig(left + right + A + txt([200, 107], 'B') + grp(seg([120, 30], [120, 100], 'sh-axis') + dot([120, 65], 'M', [10, -8])), 120)
              + cap(T(L, 'Mở ra: nếp gấp cắt AB tại trung điểm <b>M</b>.', 'Unfold: the crease crosses AB at the midpoint <b>M</b>.'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Half of AB.
    () => {
      const ab = int(4, 200);
      return inputD(
        bi((L) => T(L, `M là trung điểm của đoạn thẳng AB, AB = ${D(ab / 10, L)} cm. Tính MA (cm).`, `M is the midpoint of AB and AB = ${D(ab / 10, L)} cm. Find MA (cm).`)),
        exact(ab / 20),
        bi((L) => `MA = AB : 2 = ${D(ab / 10, L)} : 2 = ${D(ab / 20, L)} cm`),
      );
    },
    // AB from half.
    () => {
      const am = int(2, 150);
      const named = pick(['MA', 'MB']);
      return inputD(
        bi((L) => T(L, `M là trung điểm của đoạn thẳng AB, ${named} = ${D(am / 10, L)} cm. Tính AB (cm).`, `M is the midpoint of AB and ${named} = ${D(am / 10, L)} cm. Find AB (cm).`)),
        exact(am / 5),
        bi((L) => `AB = 2 · ${named} = 2 · ${D(am / 10, L)} = ${D(am / 5, L)} cm`),
      );
    },
    // Is M the midpoint?
    () => {
      const kind = pick(['yes', 'notBetween', 'unequal']);
      const a = int(2, 20);
      const b = kind === 'unequal' ? a + pick([-1, 1]) * int(1, Math.min(a - 1, 5)) : a;
      const ab = kind === 'notBetween' ? a + b + pick([-1, 1]) * int(1, 3) : a + b;
      const right = kind === 'yes' ? YES : NO;
      return choice(
        bi((L) => T(L, `Ba điểm A, M, B thẳng hàng; MA = ${a} cm, MB = ${b} cm, AB = ${ab} cm. M có phải là trung điểm của AB không?`, `A, M, B are collinear; MA = ${a} cm, MB = ${b} cm, AB = ${ab} cm. Is M the midpoint of AB?`)),
        right,
        [right === YES ? NO : YES],
        bi((L) => ({
          yes: T(L, `MA + MB = ${a + b} = AB nên M nằm giữa A, B; lại có MA = MB: M là trung điểm.`, `MA + MB = ${a + b} = AB, so M is between A and B, and MA = MB: M is the midpoint.`),
          notBetween: T(L, `MA + MB = ${a + b} ≠ ${ab} = AB nên M không nằm giữa A và B.`, `MA + MB = ${a + b} ≠ ${ab} = AB, so M is not between A and B.`),
          unequal: T(L, `MA = ${a} cm ≠ MB = ${b} cm.`, `MA = ${a} cm ≠ MB = ${b} cm.`),
        })[kind]),
      );
    },
    // Which marked point is the midpoint, using a ruler?
    () => {
      const half = int(2, 5);
      const a = int(0, 10 - 2 * half);
      const b = a + 2 * half;
      const m = a + half;
      const others = shuffle([m - 1, m + 1, a + 1, b - 1].filter((v) => v > a && v < b && v !== m));
      const [P, Q] = [others[0], others.find((v) => v !== others[0])];
      const [nm, n1, n2] = letters(5).filter((c) => c !== 'A' && c !== 'B').slice(0, 3);
      const x = (v) => 20 + v * 20;
      const pts = [[a, 'A'], [b, 'B'], [m, nm], [P, n1], [Q, n2]];
      const pic = fig(seg([x(a), 40], [x(b), 40]) + pts.map(([v, n]) => dot([x(v), 40], n)).join('') + rulerAt(x), 100);
      return choice(
        bi((L) => `${T(L, 'Điểm nào là trung điểm của đoạn thẳng AB?', 'Which point is the midpoint of AB?')}<br>${pic}`),
        nm,
        [n1, n2],
        bi((L) => T(L, `A ở vạch ${a}, B ở vạch ${b}: AB = ${2 * half} cm. Trung điểm ở vạch ${a} + ${half} = ${m}: điểm ${nm}.`, `A is at ${a} and B at ${b}: AB = ${2 * half} cm. The midpoint is at ${a} + ${half} = ${m}: point ${nm}.`)),
      );
    },
  ],
};

// A 0–10 cm ruler under the picture (1 cm = 20 units), used in lesson 35.
function rulerAt(x) {
  const ticks = [];
  for (let k = 0; k <= 10; k++) {
    ticks.push(seg([x(k), 46], [x(k), 56], 'sh-prot-tick'));
    ticks.push(txt([x(k), 66], k, 'sh-prot-num'));
  }
  return `<rect class="sh-prot" x="10" y="46" width="220" height="26" rx="3"/>${ticks.join('')}`;
}

// ---------- Bài 36. Góc ----------

const STATEMENTS_36 = [
  ['Góc là hình gồm hai tia chung gốc.', 'An angle is made of two rays with the same origin.', true],
  ['Góc bẹt là góc có hai cạnh là hai tia đối nhau.', 'A straight angle has two opposite rays as its sides.', true],
  ['Góc xOy và góc yOx là cùng một góc.', 'The angles xOy and yOx are the same angle.', true],
  ['Điểm nằm trên cạnh của góc không phải là điểm trong của góc.', 'A point on a side of an angle is not inside the angle.', true],
  ['Đỉnh của góc xOy là điểm x.', 'The vertex of angle xOy is the point x.', false],
  ['Góc là hình gồm hai đoạn thẳng bất kì.', 'An angle is made of any two segments.', false],
  ['Hai tia đối nhau không tạo thành góc nào.', 'Two opposite rays do not make an angle.', false],
  ['Mọi điểm nằm trên cạnh Ox đều là điểm trong của góc xOy.', 'Every point on side Ox is inside the angle xOy.', false],
];

const ANGLE_O = [70, 118];
const lesson36 = {
  id: 'c8b36',
  number: 36,
  title: { vi: 'Góc', en: 'Angles' },
  points: [
    {
      title: { vi: 'Góc', en: 'Angles' },
      theory: {
        vi: [
          '<b>Góc</b> là hình gồm hai tia chung gốc. Góc xOy (kí hiệu <b>∠xOy</b>) có <b>đỉnh</b> O và hai <b>cạnh</b> Ox, Oy.',
          'Khi đọc tên góc, chữ chỉ đỉnh ở giữa: ∠xOy hay ∠yOx; góc ABC có đỉnh B.',
          'Góc có hai cạnh là hai tia đối nhau là <b>góc bẹt</b>.',
        ],
        en: [
          'An <b>angle</b> is made of two rays with the same origin. Angle xOy (written <b>∠xOy</b>) has <b>vertex</b> O and <b>sides</b> Ox and Oy.',
          'The vertex goes in the middle of the name: ∠xOy or ∠yOx; angle ABC has vertex B.',
          'An angle whose sides are opposite rays is a <b>straight angle</b>.',
        ],
      },
      example: {
        caption: { vi: 'Tia Oy quay quanh O.', en: 'The ray Oy turns about O.' },
        frames: (L) => {
          const O = [120, 112];
          const Ox = ray(O, 0, 100, 'x');
          const o = dot(O, 'O', BELOW);
          const Oy = ray(O, 50, 100, 'y');
          return [
            fig(Ox + o, 140) + cap(T(L, 'Tia Ox, gốc O.', 'Ray Ox, origin O.')),
            fig(Ox + spin(Oy, O, 50) + o, 140) + cap(T(L, 'Tia Oy chung gốc O.', 'Ray Oy with the same origin O.'), true),
            fig(grp(sector(O, 0, 50, 26)) + Ox + Oy + o, 140) + cap(T(L, 'Góc xOy: đỉnh O, hai cạnh Ox và Oy.', 'Angle xOy: vertex O, sides Ox and Oy.'), true),
            fig(grp(sector(O, 0, 180, 26)) + Ox + spin(ray(O, 180, 100, 'y'), O, 130) + o, 140) + cap(T(L, 'Ox, Oy đối nhau: <b>góc bẹt</b> xOy.', 'Ox and Oy opposite: a <b>straight angle</b> xOy.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Điểm trong của góc', en: 'Points inside an angle' },
      theory: {
        vi: [
          'Điểm M nằm <b>trong</b> góc xOy (không bẹt) nếu M nằm giữa hai điểm A ∈ Ox và B ∈ Oy (A, B khác O).',
          'Điểm nằm trên cạnh của góc, hay nằm ngoài góc, đều không phải điểm trong của góc.',
        ],
        en: [
          'M is <b>inside</b> angle xOy (not a straight angle) if M is between a point A on Ox and a point B on Oy (A, B not O).',
          'Points on a side of the angle, or outside it, are not inside the angle.',
        ],
      },
      example: {
        caption: { vi: 'Điểm trong và điểm không nằm trong góc xOy.', en: 'Points inside and not inside angle xOy.' },
        frames: (L) => {
          const O = ANGLE_O;
          const base = sector(O, 0, 70, 24) + ray(O, 0, 150, 'x') + ray(O, 70, 92, 'y') + dot(O, 'O', [-10, 16]);
          const M = dot(at(O, 35, 70), 'M');
          const others = dot(at(O, 115, 50), 'N') + dot(at(O, 0, 90), 'P', [0, 20]);
          const AB = seg(at(O, 0, 125), at(O, 70, 46), 'sh-dash') + dot(at(O, 0, 125), 'A', [0, 20]) + dot(at(O, 70, 46), 'B', [-12, -2]);
          return [
            fig(base, 146) + cap(T(L, 'Góc xOy.', 'The angle xOy.')),
            fig(base + grp(M), 146) + cap(T(L, 'M nằm trong góc xOy: <b>điểm trong</b>.', 'M is <b>inside</b> angle xOy.'), true),
            fig(base + M + grp(others), 146) + cap(T(L, 'N ở ngoài góc, P ở trên cạnh Ox: không phải điểm trong.', 'N is outside, P is on side Ox: neither is inside.'), true),
            fig(base + M + others + grp(AB), 146) + cap(T(L, 'Mọi điểm nằm giữa A ∈ Ox và B ∈ Oy đều nằm trong góc.', 'Every point between A on Ox and B on Oy is inside the angle.'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Vertex / name of a drawn angle.
    () => {
      const V = pick(['O', 'I', 'K', 'H']);
      const [s1, s2] = pick([['x', 'y'], ['m', 'n'], ['t', 'z'], ['x', 't'], ['a', 'b']]);
      const [A, B] = shuffle(LETTERS.filter((c) => c !== V)).slice(0, 2);
      const a1 = int(0, 25);
      const a2 = a1 + int(45, 120);
      const O = [a2 > 100 ? 110 : 60, 116];
      const pic = fig(sector(O, a1, a2) + ray(O, a1, 115, s1) + ray(O, a2, 92, s2) + dot(at(O, a1, 70), A, [0, -10]) + dot(at(O, a2, 60), B, [12, 2]) + dot(O, V, [0, 20]), 140);
      if (Math.random() < 0.5) {
        return choice(
          bi((L) => `${T(L, 'Đỉnh của góc trong hình là điểm nào?', 'Which point is the vertex of this angle?')}<br>${pic}`),
          V,
          [A, B],
          bi((L) => T(L, `Hai cạnh ${V}${s1} và ${V}${s2} chung gốc ${V}: đỉnh là ${V}.`, `The sides ${V}${s1} and ${V}${s2} start at ${V}: the vertex is ${V}.`)),
        );
      }
      const name = (n) => `∠${n}`;
      return choice(
        bi((L) => `${T(L, 'Tên của góc trong hình là gì?', 'What is the name of this angle?')}<br>${pic}`),
        name(`${s1}${V}${s2}`),
        [name(`${V}${s1}${s2}`), name(`${s1}${s2}${V}`), name(`${V}${s2}${s1}`)],
        bi((L) => T(L, `Chữ chỉ đỉnh ${V} đứng giữa: ∠${s1}${V}${s2} (hay ∠${s2}${V}${s1}).`, `The vertex ${V} goes in the middle: ∠${s1}${V}${s2} (or ∠${s2}${V}${s1}).`)),
      );
    },
    // Angles from n rays.
    () => {
      const n = int(3, 10);
      return input(
        bi((L) => T(L, `Vẽ ${n} tia chung gốc O, không có hai tia nào trùng nhau. Có tất cả bao nhiêu góc (kể cả góc bẹt, nếu có)?`, `${n} different rays are drawn from the same origin O. How many angles are there altogether (straight angles included, if any)?`)),
        C2(n),
        bi((L) => T(L, `Mỗi cặp tia tạo thành một góc: ${n} · ${n - 1} : 2 = ${C2(n)}.`, `Each pair of rays makes one angle: ${n} · ${n - 1} : 2 = ${C2(n)}.`)),
      );
    },
    // Is the point inside the angle?
    () => {
      const O = [90, 118];
      const th = 5 * int(9, 24);
      const kind = pick(['in', 'in', 'out', 'side']);
      const phi = { in: int(14, th - 14), out: int(th + 18, 172), side: pick([0, th]) }[kind];
      const [M] = letters(1);
      const p = at(O, phi, int(48, kind === 'side' ? 90 : 85));
      const pic = fig(sector(O, 0, th, 20) + ray(O, 0, 135, 'x') + ray(O, th, 108, 'y') + dot(p, M, [phi > th ? -10 : 10, -8]) + dot(O, 'O', [-10, 16]), 140);
      const right = kind === 'in' ? YES : NO;
      return choice(
        bi((L) => `${T(L, `Điểm ${M} có phải là điểm trong của góc xOy không?`, `Is ${M} inside the angle xOy?`)}<br>${pic}`),
        right,
        [right === YES ? NO : YES],
        bi((L) => ({
          in: T(L, `${M} nằm giữa hai cạnh Ox và Oy: là điểm trong.`, `${M} lies between the sides Ox and Oy: it is inside.`),
          out: T(L, `${M} nằm ngoài góc xOy.`, `${M} is outside the angle xOy.`),
          side: T(L, `${M} nằm trên một cạnh của góc, không phải điểm trong.`, `${M} is on a side of the angle, so it is not inside.`),
        })[kind]),
      );
    },
    () => statementQuestion(STATEMENTS_36),
  ],
};

// ---------- Bài 37. Số đo góc ----------

const KINDS = {
  acute: { vi: 'Góc nhọn', en: 'Acute angle' },
  right: { vi: 'Góc vuông', en: 'Right angle' },
  obtuse: { vi: 'Góc tù', en: 'Obtuse angle' },
  straight: { vi: 'Góc bẹt', en: 'Straight angle' },
};
const kindOf = (d) => (d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : 'straight');

const lesson37 = {
  id: 'c8b37',
  number: 37,
  title: { vi: 'Số đo góc', en: 'Measuring angles' },
  points: [
    {
      title: { vi: 'Đo góc', en: 'Measuring an angle' },
      theory: {
        vi: [
          'Đo góc bằng <b>thước đo góc</b>; đơn vị là <b>độ</b> (°). Mỗi góc có một số đo; góc bẹt có số đo <b>180°</b>.',
          'Cách đo ∠xOy: đặt <b>tâm</b> thước trùng đỉnh O, vạch 0 nằm trên cạnh Ox; cạnh Oy đi qua vạch nào thì đó là số đo của góc.',
          'Hai góc bằng nhau nếu có cùng số đo; góc nào có số đo lớn hơn thì lớn hơn.',
        ],
        en: [
          'Angles are measured with a <b>protractor</b>, in <b>degrees</b> (°). Each angle has one measure; a straight angle measures <b>180°</b>.',
          'To measure ∠xOy: put the protractor\'s <b>centre</b> on the vertex O with the 0 mark on side Ox; the mark that Oy passes through is the measure.',
          'Two angles are equal if they have the same measure; the larger measure means the larger angle.',
        ],
      },
      example: {
        caption: { vi: 'Đo góc xOy bằng thước đo góc.', en: 'Measuring ∠xOy with a protractor.' },
        frames: (L) => {
          const rays = protRays(0, 60);
          const ring = `<circle class="sh-ring" cx="${r1(at(PO, 60, PR - 18)[0])}" cy="${r1(at(PO, 60, PR - 18)[1])}" r="10"/>`;
          return [
            protFig(sector(PO, 0, 60, 26) + rays) + cap(T(L, 'Góc xOy cần đo.', 'The angle xOy to measure.')),
            protFig(grp(protractor()) + sector(PO, 0, 60, 26) + rays) + cap(T(L, 'Tâm thước đặt ở O, vạch 0 nằm trên cạnh Ox.', 'Centre on O, 0 mark on side Ox.'), true),
            protFig(protractor() + sector(PO, 0, 60, 26) + rays + grp(ring)) + cap(T(L, 'Cạnh Oy đi qua vạch 60: <b>∠xOy = 60°</b>.', 'Oy passes through 60: <b>∠xOy = 60°</b>.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Các loại góc', en: 'Kinds of angles' },
      theory: {
        vi: [
          '<b>Góc nhọn</b>: lớn hơn 0° và nhỏ hơn 90°.',
          '<b>Góc vuông</b>: bằng 90°.',
          '<b>Góc tù</b>: lớn hơn 90° và nhỏ hơn 180°. <b>Góc bẹt</b>: bằng 180°.',
        ],
        en: [
          '<b>Acute angle</b>: more than 0° and less than 90°.',
          '<b>Right angle</b>: exactly 90°.',
          '<b>Obtuse angle</b>: more than 90° and less than 180°. <b>Straight angle</b>: exactly 180°.',
        ],
      },
      example: {
        caption: { vi: 'Tia Oy quay dần, góc xOy lớn dần.', en: 'As Oy turns, ∠xOy grows.' },
        frames: (L) => {
          const O = [120, 118];
          const steps = [[50, 'acute'], [90, 'right'], [135, 'obtuse'], [180, 'straight']];
          return steps.map(([d, k], i) => fig(sector(O, 0, d, 22) + ray(O, 0, 100, 'x') + spin(ray(O, d, 95, 'y'), O, d - (i ? steps[i - 1][0] : 0)) + dot(O, 'O', BELOW), 152)
            + cap(`${KINDS[k][L]}: ∠xOy = ${d}°`, true, true));
        },
      },
    },
  ],
  exercises: [
    // Kind of angle from its measure.
    () => {
      const d = pick([int(1, 89), int(1, 89), 90, int(91, 179), int(91, 179), 180]);
      const k = kindOf(d);
      return choice(
        bi((L) => T(L, `Góc có số đo ${d}° là góc gì?`, `What kind of angle measures ${d}°?`)),
        KINDS[k],
        Object.keys(KINDS).filter((x) => x !== k).map((x) => KINDS[x]),
        bi((L) => T(L, 'Nhọn: dưới 90°; vuông: 90°; tù: giữa 90° và 180°; bẹt: 180°.', 'Acute: under 90°; right: 90°; obtuse: between 90° and 180°; straight: 180°.')),
      );
    },
    // Read a protractor.
    () => {
      const a = Math.random() < 0.6 ? 0 : 10 * int(1, 6);
      const b = a + 5 * int(2, (180 - a) / 5);
      const pic = protFig(protractor() + sector(PO, a, b, 24) + protRays(a, b));
      return input(
        bi((L) => `${T(L, 'Góc xOy có số đo bao nhiêu độ?', 'How many degrees is ∠xOy?')}<br>${pic}`),
        b - a,
        bi((L) => (a
          ? T(L, `Ox đi qua vạch ${a}, Oy đi qua vạch ${b}: ${b} − ${a} = ${b - a}°.`, `Ox passes through ${a} and Oy through ${b}: ${b} − ${a} = ${b - a}°.`)
          : T(L, `Vạch 0 trên cạnh Ox, Oy đi qua vạch ${b}: ∠xOy = ${b}°.`, `0 is on Ox and Oy passes through ${b}: ∠xOy = ${b}°.`))),
        { a, b },
      );
    },
    // Clock hands on the hour.
    () => {
      const h = int(1, 11);
      const deg = 30 * Math.min(h, 12 - h);
      return input(
        bi((L) => T(L, `Lúc ${h} giờ đúng, kim giờ và kim phút tạo thành góc (không lớn hơn 180°) bao nhiêu độ?`, `At ${h} o'clock, what angle (not more than 180°) do the hour and minute hands make, in degrees?`)),
        deg,
        bi((L) => T(L, `Mỗi khoảng giữa hai số liền nhau trên mặt đồng hồ là 360° : 12 = 30°; hai kim cách nhau ${Math.min(h, 12 - h)} khoảng: ${deg}°.`, `Neighbouring numbers on the clock are 360° : 12 = 30° apart; the hands are ${Math.min(h, 12 - h)} gaps apart: ${deg}°.`)),
        { h, m: 0 },
      );
    },
    // Which angle is of a given kind?
    () => {
      const target = pick(['acute', 'obtuse', 'right']);
      const make = { acute: () => int(10, 85), right: () => 90, obtuse: () => int(95, 175), straight: () => 180 };
      const names = shuffle(['∠xOy', '∠mAn', '∠ABC', '∠tIz']);
      const others = shuffle(Object.keys(make).filter((k) => k !== target)).slice(0, 3);
      const measures = [make[target](), ...others.map((k) => make[k]())];
      const list = (L) => names.map((n, i) => `${n} = ${measures[i]}°`).join(T(L, '; ', ', '));
      return choice(
        bi((L) => `${T(L, `Góc nào là <b>${KINDS[target].vi.toLowerCase()}</b>?`, `Which is ${target === 'right' ? 'a' : 'an'} <b>${KINDS[target].en.toLowerCase()}</b>?`)}<br>${list(L)}`),
        names[0],
        names.slice(1),
        bi((L) => `${names[0]} = ${measures[0]}°: ${KINDS[target][L].toLowerCase()}`),
      );
    },
  ],
};

export const CHAPTER8 = [lesson32, lesson33, lesson34, lesson35, lesson36, lesson37];

// ---------- Nâng cao ----------

export const ADVANCED8 = {
  c8b32: [
    // Intersection points of n lines.
    () => {
      const n = int(3, 15);
      return input(
        bi((L) => T(L, `Vẽ ${n} đường thẳng đôi một cắt nhau, không có ba đường thẳng nào cùng đi qua một điểm. Có bao nhiêu giao điểm?`, `${n} lines are drawn so that every two of them intersect and no three pass through one point. How many intersection points are there?`)),
        C2(n),
        bi((L) => T(L, `Mỗi cặp đường thẳng cho một giao điểm riêng: ${n} · ${n - 1} : 2 = ${C2(n)}.`, `Each pair of lines gives its own intersection point: ${n} · ${n - 1} : 2 = ${C2(n)}.`)),
        { lines: n, parallel: 0 },
      );
    },
    // n points, k of them collinear.
    () => {
      const n = int(5, 12);
      const k = int(3, n - 1);
      const ans = C2(n) - C2(k) + 1;
      return input(
        bi((L) => T(L, `Cho ${n} điểm, trong đó có đúng ${k} điểm thẳng hàng; ngoài ra không có ba điểm nào thẳng hàng. Có bao nhiêu đường thẳng đi qua ít nhất hai trong các điểm đó?`, `There are ${n} points; exactly ${k} of them are collinear and apart from those no three are collinear. How many lines pass through at least two of the points?`)),
        ans,
        bi((L) => T(L, `Nếu không có ba điểm thẳng hàng: ${C2(n)} đường. ${k} điểm thẳng hàng chỉ cho 1 đường thay vì ${C2(k)}: ${C2(n)} − ${C2(k)} + 1 = ${ans}.`, `With no three collinear there would be ${C2(n)} lines. The ${k} collinear points give 1 line instead of ${C2(k)}: ${C2(n)} − ${C2(k)} + 1 = ${ans}.`)),
        { points: n, collinear: k },
      );
    },
    // How many points, from the number of lines.
    () => {
      const n = int(4, 20);
      return input(
        bi((L) => T(L, `Cho một số điểm, không có ba điểm nào thẳng hàng. Kẻ các đường thẳng đi qua từng cặp điểm thì được ${C2(n)} đường thẳng. Có bao nhiêu điểm?`, `Some points are given, no three collinear. Drawing a line through every pair gives ${C2(n)} lines. How many points are there?`)),
        n,
        bi((L) => T(L, `n · (n − 1) : 2 = ${C2(n)} ⇒ n · (n − 1) = ${2 * C2(n)} = ${n} · ${n - 1}, nên n = ${n}.`, `n · (n − 1) : 2 = ${C2(n)} ⇒ n · (n − 1) = ${2 * C2(n)} = ${n} · ${n - 1}, so n = ${n}.`)),
      );
    },
    // n lines, k of them parallel.
    () => {
      const n = int(4, 12);
      const k = int(2, n - 1);
      const ans = C2(n) - C2(k);
      return input(
        bi((L) => T(L, `Vẽ ${n} đường thẳng, trong đó có ${k} đường thẳng song song với nhau; các đường còn lại cắt tất cả các đường khác và không có ba đường thẳng nào cùng đi qua một điểm. Có bao nhiêu giao điểm?`, `${n} lines are drawn: ${k} of them are parallel, every other line crosses all the rest, and no three pass through one point. How many intersection points are there?`)),
        ans,
        bi((L) => T(L, `Nếu mọi cặp đều cắt nhau: ${C2(n)} giao điểm. ${C2(k)} cặp song song không cắt nhau: ${C2(n)} − ${C2(k)} = ${ans}.`, `If every pair crossed: ${C2(n)} points. ${C2(k)} parallel pairs do not cross: ${C2(n)} − ${C2(k)} = ${ans}.`)),
        { lines: n, parallel: k },
      );
    },
  ],
  c8b33: [
    // Four points: what lies between?
    () => {
      const order = letters(4);
      const [W, X, Y, Z] = Math.random() < 0.5 ? order : [...order].reverse();
      const none = { vi: 'Không có điểm nào', en: 'None of them' };
      return {
        ...choice(
          bi((L) => T(L, `Bốn điểm ${[W, X, Y, Z].sort().join(', ')} cùng nằm trên một đường thẳng. ${Y} nằm giữa ${W} và ${Z}; ${X} nằm giữa ${W} và ${Y}. Trong các điểm ${W}, ${Y}, điểm nào nằm giữa ${X} và ${Z}?`, `${[W, X, Y, Z].sort().join(', ')} lie on one line. ${Y} is between ${W} and ${Z}; ${X} is between ${W} and ${Y}. Of ${W} and ${Y}, which is between ${X} and ${Z}?`)),
          Y,
          [W, none],
          bi((L) => T(L, `Thứ tự trên đường thẳng: ${W}, ${X}, ${Y}, ${Z}. Vậy ${Y} nằm giữa ${X} và ${Z}.`, `The order on the line is ${W}, ${X}, ${Y}, ${Z}, so ${Y} is between ${X} and ${Z}.`)),
        ),
        check: { order: [W, X, Y, Z], between: [X, Z] },
      };
    },
    // A set of points described in words.
    () => {
      const [P, Q] = letters(2);
      const figs = {
        ray: { vi: `Tia ${P}${Q}`, en: `Ray ${P}${Q}` },
        back: { vi: `Tia ${Q}${P}`, en: `Ray ${Q}${P}` },
        opp: { vi: `Tia đối của tia ${P}${Q}`, en: `The ray opposite to ${P}${Q}` },
        seg: { vi: `Đoạn thẳng ${P}${Q}`, en: `Segment ${P}${Q}` },
      };
      const [desc, key] = pick([
        [{ vi: `X là ${P}, hoặc X nằm cùng phía với ${Q} đối với ${P}`, en: `X is ${P}, or X is on the same side of ${P} as ${Q}` }, 'ray'],
        [{ vi: `X là ${Q}, hoặc X nằm cùng phía với ${P} đối với ${Q}`, en: `X is ${Q}, or X is on the same side of ${Q} as ${P}` }, 'back'],
        [{ vi: `X là ${P}, hoặc X nằm khác phía với ${Q} đối với ${P}`, en: `X is ${P}, or X is on the other side of ${P} from ${Q}` }, 'opp'],
        [{ vi: `X là ${P} hoặc ${Q}, hoặc X nằm giữa ${P} và ${Q}`, en: `X is ${P} or ${Q}, or X is between ${P} and ${Q}` }, 'seg'],
      ]);
      return choice(
        bi((L) => T(L, `Trên đường thẳng ${P}${Q}, tập hợp các điểm X sao cho: ${desc.vi}. Đó là hình nào?`, `On the line ${P}${Q}, take all points X such that ${desc.en}. Which figure is it?`)),
        figs[key],
        Object.keys(figs).filter((k) => k !== key).map((k) => figs[k]),
        bi((L) => `${figs[key][L]}.`),
      );
    },
    // Rays from m lines through one point.
    () => {
      const m = int(2, 12);
      const pairs = Math.random() < 0.5;
      return input(
        bi((L) => (pairs
          ? T(L, `Vẽ ${m} đường thẳng phân biệt cùng đi qua điểm O. Có bao nhiêu cặp tia đối nhau gốc O?`, `${m} different lines are drawn through the point O. How many pairs of opposite rays with origin O are there?`)
          : T(L, `Vẽ ${m} đường thẳng phân biệt cùng đi qua điểm O. Có bao nhiêu tia gốc O?`, `${m} different lines are drawn through the point O. How many rays with origin O are there?`))),
        pairs ? m : 2 * m,
        bi((L) => (pairs
          ? T(L, `Mỗi đường thẳng cho đúng một cặp tia đối nhau: ${m}.`, `Each line gives exactly one pair of opposite rays: ${m}.`)
          : T(L, `Mỗi đường thẳng cho hai tia gốc O: 2 · ${m} = ${2 * m}.`, `Each line gives two rays from O: 2 · ${m} = ${2 * m}.`))),
      );
    },
  ],
  c8b34: [
    // Points on a ray or on opposite rays.
    () => {
      const [a, b] = [int(10, 90), int(10, 90)];
      if (a === b) return ADVANCED8.c8b34[0]();
      const same = Math.random() < 0.5;
      const ans = same ? Math.abs(a - b) : a + b;
      return inputD(
        bi((L) => (same
          ? T(L, `Trên tia Ox lấy hai điểm A, B với OA = ${D(a / 10, L)} cm, OB = ${D(b / 10, L)} cm. Tính AB (cm).`, `On ray Ox, OA = ${D(a / 10, L)} cm and OB = ${D(b / 10, L)} cm. Find AB (cm).`)
          : T(L, `A thuộc tia Ox, B thuộc tia đối của tia Ox, OA = ${D(a / 10, L)} cm, OB = ${D(b / 10, L)} cm. Tính AB (cm).`, `A is on ray Ox and B on the opposite ray, with OA = ${D(a / 10, L)} cm and OB = ${D(b / 10, L)} cm. Find AB (cm).`))),
        exact(ans / 10),
        bi((L) => (same
          ? T(L, `Điểm gần O hơn nằm giữa: AB = ${D(Math.max(a, b) / 10, L)} − ${D(Math.min(a, b) / 10, L)} = ${D(ans / 10, L)} cm.`, `The point nearer O is in the middle: AB = ${D(Math.max(a, b) / 10, L)} − ${D(Math.min(a, b) / 10, L)} = ${D(ans / 10, L)} cm.`)
          : T(L, `O nằm giữa A và B: AB = ${D(a / 10, L)} + ${D(b / 10, L)} = ${D(ans / 10, L)} cm.`, `O is between A and B: AB = ${D(a / 10, L)} + ${D(b / 10, L)} = ${D(ans / 10, L)} cm.`))),
      );
    },
    // Measuring with a rope of fixed length.
    () => {
      const s = pick([8, 12, 15, 20, 25]);
      const k = int(3, 12);
      const r = int(1, s - 1);
      const total = k * s + r;
      return inputD(
        bi((L) => T(L, `Lan dùng một sợi dây dài ${D(s / 10, L)} m để đo chiều dài sân. Căng dây liên tiếp ${k} lần thì phần còn lại ngắn hơn sợi dây và dài ${D(r / 10, L)} m. Sân dài bao nhiêu mét?`, `Lan measures a yard with a ${D(s / 10, L)} m rope. After laying it ${k} times end to end, the part left is shorter than the rope: ${D(r / 10, L)} m. How long is the yard, in metres?`)),
        exact(total / 10),
        bi((L) => `${k} · ${D(s / 10, L)} + ${D(r / 10, L)} = ${D((k * s) / 10, L)} + ${D(r / 10, L)} = ${D(total / 10, L)} m`),
      );
    },
    // Segments do not merge, even for collinear points.
    () => {
      const n = int(5, 12);
      const k = int(3, n - 1);
      return input(
        bi((L) => T(L, `Cho ${n} điểm, trong đó có đúng ${k} điểm thẳng hàng. Có bao nhiêu đoạn thẳng có hai mút là hai trong các điểm đó?`, `There are ${n} points, exactly ${k} of them collinear. How many segments have two of these points as endpoints?`)),
        C2(n),
        bi((L) => T(L, `Mỗi cặp điểm cho một đoạn thẳng khác nhau, kể cả khi thẳng hàng: ${n} · ${n - 1} : 2 = ${C2(n)}.`, `Every pair gives a different segment, even when collinear: ${n} · ${n - 1} : 2 = ${C2(n)}.`)),
      );
    },
    // Sum and difference.
    () => {
      const mb = int(2, 30);
      const d = int(1, 20);
      const am = mb + d;
      return input(
        bi((L) => T(L, `Điểm M nằm giữa A và B, AB = ${am + mb} cm và AM dài hơn MB là ${d} cm. Tính AM (cm).`, `M is between A and B, AB = ${am + mb} cm and AM is ${d} cm longer than MB. Find AM (cm).`)),
        am,
        bi((L) => T(L, `AM + MB = ${am + mb}, AM − MB = ${d} ⇒ AM = (${am + mb} + ${d}) : 2 = ${am} cm.`, `AM + MB = ${am + mb}, AM − MB = ${d} ⇒ AM = (${am + mb} + ${d}) : 2 = ${am} cm.`)),
      );
    },
  ],
  c8b35: [
    // Midpoint of AB, both on ray Ox.
    () => {
      const [a, b] = [int(1, 40), int(41, 90)];
      return inputD(
        bi((L) => T(L, `Trên tia Ox lấy A, B với OA = ${D(a / 10, L)} cm, OB = ${D(b / 10, L)} cm. M là trung điểm của AB. Tính OM (cm).`, `On ray Ox, OA = ${D(a / 10, L)} cm and OB = ${D(b / 10, L)} cm. M is the midpoint of AB. Find OM (cm).`)),
        exact((a + b) / 20),
        bi((L) => T(L, `AB = ${D(b / 10, L)} − ${D(a / 10, L)} = ${D((b - a) / 10, L)}; AM = ${D((b - a) / 20, L)}; OM = OA + AM = ${D(a / 10, L)} + ${D((b - a) / 20, L)} = ${D((a + b) / 20, L)} cm.`, `AB = ${D(b / 10, L)} − ${D(a / 10, L)} = ${D((b - a) / 10, L)}; AM = ${D((b - a) / 20, L)}; OM = OA + AM = ${D(a / 10, L)} + ${D((b - a) / 20, L)} = ${D((a + b) / 20, L)} cm.`)),
      );
    },
    // Midpoint of AB, on opposite rays.
    () => {
      const [a, b] = [int(10, 40), int(41, 90)];
      return inputD(
        bi((L) => T(L, `A thuộc tia Ox, B thuộc tia đối của tia Ox, OA = ${D(a / 10, L)} cm, OB = ${D(b / 10, L)} cm. M là trung điểm của AB. Tính OM (cm).`, `A is on ray Ox and B on the opposite ray, OA = ${D(a / 10, L)} cm, OB = ${D(b / 10, L)} cm. M is the midpoint of AB. Find OM (cm).`)),
        exact((b - a) / 20),
        bi((L) => T(L, `AB = ${D(a / 10, L)} + ${D(b / 10, L)} = ${D((a + b) / 10, L)}; MB = ${D((a + b) / 20, L)}; OM = OB − MB = ${D(b / 10, L)} − ${D((a + b) / 20, L)} = ${D((b - a) / 20, L)} cm.`, `AB = ${D(a / 10, L)} + ${D(b / 10, L)} = ${D((a + b) / 10, L)}; MB = ${D((a + b) / 20, L)}; OM = OB − MB = ${D(b / 10, L)} − ${D((a + b) / 20, L)} = ${D((b - a) / 20, L)} cm.`)),
      );
    },
    // Midpoints of two neighbouring segments.
    () => {
      const [ac, cb] = [int(10, 90), int(10, 90)];
      return inputD(
        bi((L) => T(L, `Điểm C nằm giữa A và B, AC = ${D(ac / 10, L)} cm, CB = ${D(cb / 10, L)} cm. M, N lần lượt là trung điểm của AC và CB. Tính MN (cm).`, `C is between A and B, AC = ${D(ac / 10, L)} cm, CB = ${D(cb / 10, L)} cm. M and N are the midpoints of AC and CB. Find MN (cm).`)),
        exact((ac + cb) / 20),
        bi((L) => `MN = MC + CN = ${D(ac / 20, L)} + ${D(cb / 20, L)} = ${D((ac + cb) / 20, L)} cm ${T(L, '(bằng AB : 2)', '(= AB : 2)')}`),
      );
    },
    // Halving again and again.
    () => {
      const k = int(2, 5);
      const am = int(1, 9);
      const ab = am * 2 ** k;
      const names = ['M', 'N', 'P', 'Q', 'R'].slice(0, k);
      return input(
        bi((L) => {
          const steps = names.map((n, i) => (i === 0 ? `${n} ${T(L, 'là trung điểm của', 'is the midpoint of')} AB` : `${n} ${T(L, 'là trung điểm của', 'is the midpoint of')} A${names[i - 1]}`));
          return T(L, `Đoạn thẳng AB dài ${ab} cm. ${steps.join('; ')}. Tính A${names[k - 1]} (cm).`, `AB is ${ab} cm long. ${steps.join('; ')}. Find A${names[k - 1]} (cm).`);
        }),
        am,
        bi((L) => T(L, `Mỗi lần lấy trung điểm, độ dài giảm một nửa, ${k} lần: ${ab} : ${2 ** k} = ${am} cm.`, `Each midpoint halves the length, ${k} times: ${ab} : ${2 ** k} = ${am} cm.`)),
      );
    },
  ],
  c8b36: [
    // Angles from m lines through one point.
    () => {
      const m = int(2, 8);
      const withStraight = Math.random() < 0.5;
      const rays = 2 * m;
      const ans = C2(rays) - (withStraight ? 0 : m);
      return input(
        bi((L) => T(L, `Vẽ ${m} đường thẳng phân biệt cùng đi qua O. Có bao nhiêu góc đỉnh O (${withStraight ? 'kể cả' : 'không kể'} góc bẹt)?`, `${m} different lines are drawn through O. How many angles with vertex O are there (${withStraight ? 'including' : 'not counting'} straight angles)?`)),
        ans,
        bi((L) => T(L, `${rays} tia gốc O tạo ${rays} · ${rays - 1} : 2 = ${C2(rays)} góc${withStraight ? '' : `, trong đó ${m} góc bẹt: ${C2(rays)} − ${m} = ${ans}`}.`, `${rays} rays from O make ${rays} · ${rays - 1} : 2 = ${C2(rays)} angles${withStraight ? '' : `, ${m} of them straight: ${C2(rays)} − ${m} = ${ans}`}.`)),
        { lines: m, withStraight },
      );
    },
    // How many rays, from the number of angles.
    () => {
      const n = int(4, 15);
      return input(
        bi((L) => T(L, `Vẽ một số tia chung gốc O (không có hai tia nào trùng nhau) thì đếm được ${C2(n)} góc. Có bao nhiêu tia?`, `Some different rays are drawn from O, and there are ${C2(n)} angles. How many rays are there?`)),
        n,
        bi((L) => T(L, `n · (n − 1) : 2 = ${C2(n)} ⇒ n · (n − 1) = ${2 * C2(n)} = ${n} · ${n - 1}: n = ${n}.`, `n · (n − 1) : 2 = ${C2(n)} ⇒ n · (n − 1) = ${2 * C2(n)} = ${n} · ${n - 1}: n = ${n}.`)),
      );
    },
    // Rays inside an angle.
    () => {
      const n = int(1, 10);
      const ans = C2(n + 2);
      return input(
        bi((L) => T(L, `Vẽ ${n} tia nằm trong góc xOy (gốc O, phân biệt và khác Ox, Oy). Kể cả góc xOy, trong hình có bao nhiêu góc?`, `${n} different rays from O are drawn inside the angle xOy. Including xOy, how many angles are there?`)),
        ans,
        bi((L) => T(L, `Có ${n + 2} tia gốc O: ${n + 2} · ${n + 1} : 2 = ${ans} góc.`, `There are ${n + 2} rays from O: ${n + 2} · ${n + 1} : 2 = ${ans} angles.`)),
      );
    },
    // A segment across an angle.
    () => {
      const [A, B, M] = letters(3);
      return choice(
        bi((L) => T(L, `Điểm ${M} nằm trong góc xOy (không bẹt). Một đường thẳng qua ${M} cắt Ox tại ${A}, cắt Oy tại ${B}. Điểm nào nằm giữa hai điểm còn lại?`, `${M} is inside the angle xOy (not straight). A line through ${M} meets Ox at ${A} and Oy at ${B}. Which point is between the other two?`)),
        M,
        [A, B],
        bi((L) => T(L, `${A} và ${B} nằm trên hai cạnh; điểm trong ${M} nằm giữa ${A} và ${B}.`, `${A} and ${B} are on the two sides; the inside point ${M} is between them.`)),
      );
    },
  ],
  c8b37: [
    // Next to a straight angle.
    () => {
      const a = int(5, 175);
      return input(
        bi((L) => T(L, `Hai tia Ox, Oy đối nhau. Tia Oz tạo với Ox góc ∠xOz = ${a}°. Tính ∠zOy (độ).`, `Ox and Oy are opposite rays. Ray Oz makes ∠xOz = ${a}°. Find ∠zOy (degrees).`)),
        180 - a,
        bi((L) => T(L, `∠xOy là góc bẹt (180°) gồm ∠xOz và ∠zOy: 180 − ${a} = ${180 - a}°.`, `∠xOy is straight (180°), made of ∠xOz and ∠zOy: 180 − ${a} = ${180 - a}°.`)),
      );
    },
    // Clock at half past.
    () => {
      const h = int(1, 12);
      const raw = Math.abs(30 * (h % 12) + 15 - 180);
      const deg = Math.min(raw, 360 - raw);
      return input(
        bi((L) => T(L, `Lúc ${h} giờ 30 phút, kim giờ và kim phút tạo thành góc (không lớn hơn 180°) bao nhiêu độ?`, `At half past ${h}, what angle (not more than 180°) do the hands make, in degrees?`)),
        deg,
        bi((L) => T(L, `Kim phút chỉ số 6. Kim giờ nằm chính giữa số ${h} và số ${(h % 12) + 1}, mỗi khoảng 30°: góc là ${deg}°.`, `The minute hand points at 6. The hour hand is halfway between ${h} and ${(h % 12) + 1}, with 30° per gap: ${deg}°.`)),
        { h, m: 30 },
      );
    },
    // Splitting a straight angle.
    () => {
      if (Math.random() < 0.5) {
        const k = pick([1, 2, 3, 4, 5, 8, 9, 11]);
        const small = 180 / (k + 1);
        return input(
          bi((L) => T(L, `Tia Oz nằm trong góc bẹt xOy và ∠xOz = ${k === 1 ? '∠zOy' : `${k} · ∠zOy`}. Tính ∠xOz (độ).`, `Ray Oz is inside the straight angle xOy and ∠xOz = ${k === 1 ? '∠zOy' : `${k} · ∠zOy`}. Find ∠xOz (degrees).`)),
          k * small,
          bi((L) => T(L, `180° gồm ${k + 1} phần bằng nhau, mỗi phần ${small}°: ∠xOz = ${k} · ${small} = ${k * small}°.`, `180° is ${k + 1} equal parts of ${small}°: ∠xOz = ${k} · ${small} = ${k * small}°.`)),
        );
      }
      const d = 2 * int(5, 80);
      return input(
        bi((L) => T(L, `Tia Oz nằm trong góc bẹt xOy và ∠xOz lớn hơn ∠zOy là ${d}°. Tính ∠xOz (độ).`, `Ray Oz is inside the straight angle xOy and ∠xOz is ${d}° more than ∠zOy. Find ∠xOz (degrees).`)),
        (180 + d) / 2,
        bi((L) => `∠xOz = (180 + ${d}) : 2 = ${(180 + d) / 2}°`),
      );
    },
    // Third angle of a triangle.
    () => {
      const a = int(20, 110);
      const b = int(15, 160 - a);
      return input(
        bi((L) => T(L, `Đo ba góc của nhiều tam giác, Minh thấy tổng số đo ba góc luôn bằng 180°. Tam giác ABC có ∠A = ${a}°, ∠B = ${b}°. Tính ∠C (độ).`, `Measuring many triangles, Minh finds the three angles always add up to 180°. Triangle ABC has ∠A = ${a}° and ∠B = ${b}°. Find ∠C (degrees).`)),
        180 - a - b,
        bi(() => `180 − ${a} − ${b} = ${180 - a - b}°`),
      );
    },
  ],
};
