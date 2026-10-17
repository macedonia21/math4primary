// Building blocks for the step-by-step examples. Each example is a list of
// frames (HTML strings); frame k shows everything up to step k, and pieces
// that appear in that step carry the class "new" so they can be animated in.

const fresh = (on) => (on ? ' new' : '');

// Lines of working, revealed one per step.
export function derivation(lines) {
  return lines.map((_, k) => `
    <div class="vx-derive">${lines.slice(0, k + 1)
      .map((line, i) => `<div class="vx-line${fresh(i === k)}">${line}</div>`).join('')}</div>`);
}

// A number ray from `from` to `to`. points: [{ n, tone, isNew }],
// arcs: [{ a, b, label, isNew }] jump from a to b above the ray.
export function numberLine({ from, to, points = [], arcs = [], marks = [] }) {
  const width = 640;
  const pad = 28;
  const y = 92;
  const step = (width - 2 * pad - 14) / (to - from);
  const x = (n) => pad + (n - from) * step;
  const ticks = [];
  for (let n = from; n <= to; n++) {
    const bold = marks.includes(n);
    ticks.push(`<line x1="${x(n)}" y1="${y - 7}" x2="${x(n)}" y2="${y + 7}" class="vx-tick"/>
      <text x="${x(n)}" y="${y + 30}" class="vx-num${bold ? ' bold' : ''}">${n < 0 ? `−${-n}` : n}</text>`);
  }
  const arcSvg = arcs.map(({ a, b, label, isNew }) => {
    const x1 = x(a);
    const x2 = x(b);
    const top = y - 30 - Math.min(Math.abs(b - a) * 6, 40);
    const mid = (x1 + x2) / 2;
    const dir = Math.sign(x2 - x1);
    return `<g class="vx-arc${fresh(isNew)}">
      <path d="M ${x1} ${y - 9} Q ${mid} ${top} ${x2} ${y - 9}" />
      <polygon points="${x2},${y - 8} ${x2 - dir * 11},${y - 16} ${x2 - dir * 3},${y - 20}" />
      <text x="${mid}" y="${top + 4}">${label}</text></g>`;
  }).join('');
  const dots = points.map(({ n, tone = 'a', isNew }) => `
    <circle cx="${x(n)}" cy="${y}" r="9" class="vx-pt ${tone}${fresh(isNew)}"/>`).join('');
  return `<svg class="vx-line-svg" viewBox="0 0 ${width} 136" role="img">
    <line x1="${pad - 12}" y1="${y}" x2="${width - 6}" y2="${y}" class="vx-ray"/>
    <polygon points="${width - 4},${y} ${width - 16},${y - 6} ${width - 16},${y + 6}" class="vx-ray-head"/>
    ${ticks.join('')}${arcSvg}${dots}</svg>`;
}

// A set drawn as an oval with its elements inside and other objects outside.
export function venn({ name, label, inside = [], outside = [], newInside = false, newOutside = false }) {
  const chips = (items, isNew) => items.map((v) => `<span class="vx-chip${fresh(isNew)}">${v}</span>`).join('');
  return `<div class="vx-venn">
    <div class="vx-oval"><span class="vx-oval-name">${name}</span>${chips(inside, newInside)}</div>
    <div class="vx-outside">${chips(outside, newOutside)}</div>
  </div>${label ? `<p class="vx-caption">${label}</p>` : ''}`;
}

// Place-value table: headers left to right, digits and their values.
export function placeTable({ headers, digits, showDigits, showValues, isNew }) {
  const n = digits.length;
  const cell = (content, cls) => `<td class="${cls}">${content}</td>`;
  const digitRow = digits.map((d) => cell(showDigits ? d : '', `vx-digit${fresh(isNew === 'digits')}`)).join('');
  const valueRow = digits.map((d, i) => cell(showValues ? d * 10 ** (n - 1 - i) : '', `vx-value${fresh(isNew === 'values')}`)).join('');
  return `<table class="vx-place"><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
    <tr>${digitRow}</tr>${showValues ? `<tr>${valueRow}</tr>` : ''}</table>`;
}

// rows × cols dots; with splitAt, the first splitAt columns get one colour
// and the rest another (to show a · (b + c) = a · b + a · c).
export function dots({ rows, cols, splitAt = null, isNew = false }) {
  const row = Array.from({ length: cols }, (_, c) => (
    `<span class="vx-dot ${splitAt !== null && c >= splitAt ? 'b' : 'a'}"></span>`
  )).join('');
  return `<div class="vx-dots${fresh(isNew)}${splitAt !== null ? ' split' : ''}" style="--cols:${cols};--split:${splitAt ?? 0}">
    ${`<div class="vx-dot-row">${row}</div>`.repeat(rows)}</div>`;
}

// Rows of number chips (e.g. divisors of two numbers); numbers in `common`
// are highlighted when showCommon is on. newRow marks the row just revealed.
export function chipRows({ rows, common = [], showCommon = false, newRow = -1 }) {
  return `<div class="vx-chiprows">${rows.map(({ label, items }, r) => `
    <div class="vx-chiprow${fresh(r === newRow)}"><span class="vx-chiprow-label">${label}</span>
      ${items.map((v) => `<span class="vx-chip${showCommon && common.includes(v) ? ' common' : ''}">${v}</span>`).join('')}
    </div>`).join('')}</div>`;
}

// Sieve of Eratosthenes on 1..max: crossed numbers are struck out, primes
// circled; `fresh` lists numbers crossed or circled in this step.
export function sieve({ max = 50, crossed = [], primes = [], fresh: newOnes = [] }) {
  const cells = Array.from({ length: max }, (_, i) => {
    const n = i + 1;
    const cls = crossed.includes(n) ? ' crossed' : primes.includes(n) ? ' prime' : '';
    return `<span class="vx-cell${cls}${newOnes.includes(n) ? ' new' : ''}">${n}</span>`;
  });
  return `<div class="vx-sieve">${cells.join('')}</div>`;
}

// Prime factorisation by repeated division (number | prime), first k rows.
export function divisionColumn({ n, k }) {
  const rows = [];
  let m = n;
  for (let p = 2; m > 1;) {
    if (m % p === 0) { rows.push([m, p]); m /= p; } else p++;
  }
  rows.push([1, '']);
  return `<div class="vx-divcol">${rows.slice(0, k).map(([v, p], i) => `
    <div class="vx-divrow${fresh(i === k - 1)}"><span>${v}</span><span>${p}</span></div>`).join('')}</div>`;
}

// total objects, optionally sorted into boxes of `size` with the remainder apart.
export function groups({ total, size, emoji, grouped, isNew = false }) {
  const item = `<span>${emoji}</span>`;
  if (!grouped) return `<div class="vx-loose">${item.repeat(total)}</div>`;
  const full = Math.floor(total / size);
  const rest = total % size;
  const boxes = `<div class="vx-box${fresh(isNew)}">${item.repeat(size)}</div>`.repeat(full);
  const left = rest ? `<div class="vx-box rest${fresh(isNew)}">${item.repeat(rest)}</div>` : '';
  return `<div class="vx-groups">${boxes}${left}</div>`;
}
