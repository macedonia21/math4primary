// SVG drawings of plane shapes for Chapters IV and V. Every shape fits a
// 160 × 140 viewBox. Parts (equal-side ticks, right angles, diagonals,
// axes and centre of symmetry) can be switched on one by one, and the part
// revealed in the current step gets the class "new" so it is animated in.

const W = 160;
const H = 140;
const round = (v) => Math.round(v * 10) / 10;
const ptsAttr = (pts) => pts.map(([x, y]) => `${round(x)},${round(y)}`).join(' ');
const mid = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];

function regular(n, r, rotation = 0, cx = 80, cy = 70) {
  return Array.from({ length: n }, (_, k) => {
    const a = rotation + (2 * Math.PI * k) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

// Corner points of each shape; p tweaks proportions so exercises can vary.
export function shapePoints(kind, p = {}) {
  switch (kind) {
    case 'equilateral': return regular(3, 74, -Math.PI / 2, 80, 84);
    case 'isosceles': return [[80, 10], [80 + (p.half ?? 42), 130], [80 - (p.half ?? 42), 130]];
    case 'rightTriangle': return [[25, 50], [25, 128], [150, 128]]; // legs clearly unequal
    case 'square': return [[25, 15], [135, 15], [135, 125], [25, 125]];
    case 'rectangle': { const w = p.w ?? 140; const h = p.h ?? 80; return [[80 - w / 2, 70 - h / 2], [80 + w / 2, 70 - h / 2], [80 + w / 2, 70 + h / 2], [80 - w / 2, 70 + h / 2]]; }
    case 'rhombus': { const dx = p.dx ?? 48; const dy = p.dy ?? 64; return [[80, 70 - dy], [80 + dx, 70], [80, 70 + dy], [80 - dx, 70]]; }
    case 'parallelogram': { const s = p.s ?? 40; const w = p.w ?? 105; const h = p.h ?? 90; const x0 = (W - w - s) / 2; const y0 = (H - h) / 2; return [[x0 + s, y0], [x0 + s + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]; }
    case 'trapezoid': { const t = p.top ?? 70; const b = p.bottom ?? 140; const h = p.h ?? 90; const y0 = (H - h) / 2; return [[80 - t / 2, y0], [80 + t / 2, y0], [80 + b / 2, y0 + h], [80 - b / 2, y0 + h]]; }
    case 'hexagon': return regular(6, 68);
    case 'oddHexagon': return [[20, 70], [52, 18], [118, 26], [146, 74], [104, 124], [44, 112]];
    case 'oddQuad': return [[22, 30], [122, 14], [146, 112], [40, 128]];
    default: throw new Error(`unknown shape ${kind}`);
  }
}

// How many tick marks on each side (same count = equal sides).
const TICKS = {
  equilateral: [1, 1, 1], isosceles: [1, 0, 1], square: [1, 1, 1, 1], rectangle: [1, 2, 1, 2],
  rhombus: [1, 1, 1, 1], parallelogram: [1, 2, 1, 2], trapezoid: [0, 1, 0, 1], hexagon: [1, 1, 1, 1, 1, 1],
};
const RIGHT = { square: [0, 1, 2, 3], rectangle: [0, 1, 2, 3], rightTriangle: [1] };
const DIAGONALS = { square: [[0, 2], [1, 3]], rectangle: [[0, 2], [1, 3]], rhombus: [[0, 2], [1, 3]], parallelogram: [[0, 2], [1, 3]], trapezoid: [[0, 2], [1, 3]], hexagon: [[0, 3], [1, 4], [2, 5]] };

// Lines of symmetry, as pairs of points (extended past the shape).
function axisLines(kind, pts) {
  const opp = (i, j, k) => [pts[i], mid(pts[j], pts[k])];
  switch (kind) {
    case 'equilateral': return [opp(0, 1, 2), opp(1, 2, 0), opp(2, 0, 1)];
    case 'isosceles': return [opp(0, 1, 2)];
    case 'square': return [[pts[0], pts[2]], [pts[1], pts[3]], [mid(pts[0], pts[1]), mid(pts[2], pts[3])], [mid(pts[1], pts[2]), mid(pts[3], pts[0])]];
    case 'rectangle': return [[mid(pts[0], pts[1]), mid(pts[2], pts[3])], [mid(pts[1], pts[2]), mid(pts[3], pts[0])]];
    case 'rhombus': return [[pts[0], pts[2]], [pts[1], pts[3]]];
    case 'trapezoid': return [[mid(pts[0], pts[1]), mid(pts[2], pts[3])]];
    case 'hexagon': return [[pts[0], pts[3]], [pts[1], pts[4]], [pts[2], pts[5]], [mid(pts[0], pts[1]), mid(pts[3], pts[4])], [mid(pts[1], pts[2]), mid(pts[4], pts[5])], [mid(pts[2], pts[3]), mid(pts[5], pts[0])]];
    default: return [];
  }
}

// Number of lines of symmetry and whether there is a centre of symmetry.
export const SYMMETRY = {
  equilateral: { axes: 3, centre: false }, isosceles: { axes: 1, centre: false }, rightTriangle: { axes: 0, centre: false },
  square: { axes: 4, centre: true }, rectangle: { axes: 2, centre: true }, rhombus: { axes: 2, centre: true },
  parallelogram: { axes: 0, centre: true }, trapezoid: { axes: 1, centre: false }, hexagon: { axes: 6, centre: true },
  oddHexagon: { axes: 0, centre: false }, oddQuad: { axes: 0, centre: false },
};

function extend([x1, y1], [x2, y2], by = 14) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
  return [[x1 - ux * by, y1 - uy * by], [x2 + ux * by, y2 + uy * by]];
}

function tickMarks(pts, counts) {
  return counts.flatMap((n, i) => {
    if (!n) return [];
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const [mx, my] = mid(a, b);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [ux, uy] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const [nx, ny] = [-uy, ux];
    return Array.from({ length: n }, (_, k) => {
      const off = (k - (n - 1) / 2) * 5;
      const [cx, cy] = [mx + ux * off, my + uy * off];
      return `<line x1="${round(cx - nx * 6)}" y1="${round(cy - ny * 6)}" x2="${round(cx + nx * 6)}" y2="${round(cy + ny * 6)}"/>`;
    });
  }).join('');
}

function rightMarks(pts, corners) {
  return corners.map((i) => {
    const p = pts[i];
    const a = pts[(i + pts.length - 1) % pts.length];
    const b = pts[(i + 1) % pts.length];
    const unit = (q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / l * 11, (q[1] - p[1]) / l * 11]; };
    const [u, v] = [unit(a), unit(b)];
    return `<polyline points="${ptsAttr([[p[0] + u[0], p[1] + u[1]], [p[0] + u[0] + v[0], p[1] + u[1] + v[1]], [p[0] + v[0], p[1] + v[1]]])}"/>`;
  }).join('');
}

const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

// options: params, ticks, right, diagonals, axes, centre, labels (array of
// vertex names), newPart (name of the part revealed in this step), small.
export function shapeSvg(kind, o = {}) {
  const pts = shapePoints(kind, o.params);
  const part = (name, on, html) => (on ? `<g class="sh-${name}${o.newPart === name ? ' new' : ''}">${html}</g>` : '');
  const [cx, cy] = centroid(pts);
  const labels = o.labels ? o.labels.map((name, i) => {
    const [x, y] = pts[i];
    const [dx, dy] = [x - cx, y - cy];
    const l = Math.hypot(dx, dy) || 1;
    return `<text x="${round(x + (dx / l) * 12)}" y="${round(y + (dy / l) * 12 + 5)}">${name}</text>`;
  }).join('') : '';
  return `<svg class="shape${o.small ? ' small' : ''}" viewBox="-12 -12 ${W + 24} ${H + 24}" role="img">
    <polygon class="sh-body" points="${ptsAttr(pts)}"/>
    ${part('diagonals', o.diagonals, (DIAGONALS[kind] ?? []).map(([i, j]) => `<line x1="${round(pts[i][0])}" y1="${round(pts[i][1])}" x2="${round(pts[j][0])}" y2="${round(pts[j][1])}"/>`).join(''))}
    ${part('ticks', o.ticks, tickMarks(pts, TICKS[kind] ?? []))}
    ${part('right', o.right, rightMarks(pts, RIGHT[kind] ?? []))}
    ${part('axes', o.axes, axisLines(kind, pts).map(([a, b]) => { const [p, q] = extend(a, b); return `<line x1="${round(p[0])}" y1="${round(p[1])}" x2="${round(q[0])}" y2="${round(q[1])}"/>`; }).join(''))}
    ${part('centre', o.centre, `<circle cx="${round(cx)}" cy="${round(cy)}" r="4"/><text x="${round(cx + 7)}" y="${round(cy - 6)}">O</text>`)}
    ${part('line', o.line, o.line ? (() => { const [p, q] = extend(...o.line(pts)); return `<line x1="${round(p[0])}" y1="${round(p[1])}" x2="${round(q[0])}" y2="${round(q[1])}"/>`; })() : '')}
    <g class="sh-labels">${labels}</g>
  </svg>`;
}

export const midpoint = mid;
