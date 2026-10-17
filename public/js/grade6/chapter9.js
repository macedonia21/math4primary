// Grade 6 volume 2, Chapter IX: data and experimental probability. Lessons
// 38–43 (collecting data, tables and pictograms, bar charts, double bar
// charts, outcomes and events, experimental probability) with theory,
// step-by-step pictures, basic and advanced exercises. All text is original.

import {
  bi, T, fmt, int, pick, shuffle, choice, input, inputD, frac,
} from './util.js';
import { cap } from './chapter4.js';

const YES = { vi: 'Có', en: 'Yes' };
const NO = { vi: 'Không', en: 'No' };
const exact = (x) => Number(x.toFixed(6));
const D = (x, L) => fmt(exact(x), L);
const sum = (xs) => xs.reduce((s, v) => s + v, 0);
const fresh = (on) => (on ? ' new' : '');

// ---------- themes shared by tables, pictograms and charts ----------

const WEEKDAYS = (L) => T(L, 'T2,T3,T4,T5,T6', 'Mon,Tue,Wed,Thu,Fri').split(',');
const THEMES = [
  { title: { vi: 'Số cây trồng được của mỗi lớp', en: 'Trees planted by each class' }, cats: () => ['6A', '6B', '6C', '6D', '6E'], unit: { vi: 'cây', en: 'trees' }, icon: '🌳', steps: [2, 5, 10] },
  { title: { vi: 'Số sách thư viện cho mượn mỗi ngày', en: 'Library books lent each day' }, cats: WEEKDAYS, unit: { vi: 'quyển', en: 'books' }, icon: '📚', steps: [5, 10, 20] },
  { title: { vi: 'Số que kem bán được mỗi ngày', en: 'Ice creams sold each day' }, cats: WEEKDAYS, unit: { vi: 'que', en: 'ice creams' }, icon: '🍦', steps: [10, 20, 50] },
  { title: { vi: 'Số bạn thích mỗi loại quả', en: 'Pupils who like each fruit' }, cats: (L) => T(L, 'Cam,Xoài,Chuối,Táo,Dưa', 'Orange,Mango,Banana,Apple,Melon').split(','), unit: { vi: 'bạn', en: 'pupils' }, icon: '🙂', steps: [1, 2, 5] },
  { title: { vi: 'Số ngày mưa mỗi tháng', en: 'Rainy days each month' }, cats: (L) => T(L, 'Th5,Th6,Th7,Th8,Th9', 'May,Jun,Jul,Aug,Sep').split(','), unit: { vi: 'ngày', en: 'days' }, icon: '🌧️', steps: [1, 2, 3] },
];
const catName = (theme, i) => ({ vi: theme.cats('vi')[i], en: theme.cats('en')[i] });

// A random data set: n categories, values that are multiples of `step`.
function dataset(n = int(4, 5), { distinct = true, maxSteps = 8 } = {}) {
  const theme = pick(THEMES);
  const step = pick(theme.steps);
  const ks = distinct ? shuffle(Array.from({ length: maxSteps }, (_, i) => i + 1)).slice(0, n) : Array.from({ length: n }, () => int(1, maxSteps));
  return { theme, step, values: ks.map((k) => k * step), n };
}

// A table with a category column and a count column.
const statTable = (head, rows, newRow = -1) => `<table class="stat-table"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r, i) => `<tr class="${fresh(i === newRow).trim()}">${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const themeTable = (d, L, newRow = -1) => statTable([T(L, d.theme.cats === WEEKDAYS ? 'Ngày' : 'Loại', d.theme.cats === WEEKDAYS ? 'Day' : 'Group'), d.theme.unit[L]], d.values.map((v, i) => [d.theme.cats(L)[i], fmt(v, L)]), newRow);

// Pictogram: each icon stands for `per` units; a half icon for half of that.
function pictogram(d, L, { per = d.step, upto = 99, newRow = -1, key = true } = {}) {
  const rows = d.values.map((v, i) => {
    if (i >= upto) return '';
    const full = Math.floor(v / per);
    const half = v % per ? `<span class="pg-half">${d.theme.icon}</span>` : '';
    return `<div class="pg-row${fresh(i === newRow)}"><span class="pg-label">${d.theme.cats(L)[i]}</span><span class="pg-icons">${d.theme.icon.repeat(full)}${half}</span></div>`;
  }).join('');
  return `<div class="pictogram">${rows}${key ? `<p class="pg-key">${d.theme.icon} = ${fmt(per, L)} ${d.theme.unit[L]}</p>` : ''}</div>`;
}

// Bar chart (one or two series). shown(i, s) / isNew(i, s) control the reveal.
const CW = 300;
const CH = 210;
function barChart({ cats, series, step, names = [], shown = () => true, isNew = () => false, labels = false }) {
  const two = series.length === 2;
  const [ML, MR, MT, MB] = [34, 6, two ? 36 : 14, 28];
  const top = Math.max(...series.flat());
  const ymax = step * Math.max(1, Math.ceil(top / step));
  const base = CH - MB;
  const ph = base - MT;
  const y = (v) => Math.round((base - (v / ymax) * ph) * 10) / 10;
  const grid = [];
  for (let v = 0; v <= ymax; v += step) {
    grid.push(`<line class="ch-grid" x1="${ML}" y1="${y(v)}" x2="${CW - MR}" y2="${y(v)}"/><text class="ch-tick" x="${ML - 5}" y="${y(v) + 4}">${v}</text>`);
  }
  const gw = (CW - ML - MR) / cats.length;
  const bw = two ? gw * 0.34 : gw * 0.5;
  const bars = cats.map((c, i) => series.map((vals, s) => {
    if (!shown(i, s)) return '';
    const x = Math.round((ML + i * gw + (gw - series.length * bw) / 2 + s * bw) * 10) / 10;
    const h = Math.round(((vals[i] / ymax) * ph) * 10) / 10;
    const lab = labels ? `<text class="ch-val" x="${Math.round((x + bw / 2) * 10) / 10}" y="${y(vals[i]) - 4}">${vals[i]}</text>` : '';
    return `<g class="${fresh(isNew(i, s)).trim()}"><rect class="ch-bar s${s}" x="${x}" y="${y(vals[i])}" width="${Math.round(bw * 10) / 10}" height="${h}"/>${lab}</g>`;
  }).join('') + `<text class="ch-cat" x="${Math.round((ML + (i + 0.5) * gw) * 10) / 10}" y="${base + 17}">${c}</text>`).join('');
  const legend = two ? names.map((n, s) => `<rect class="ch-bar s${s}" x="${ML + 4 + s * 120}" y="6" width="12" height="12"/><text class="ch-leg" x="${ML + 20 + s * 120}" y="16">${n}</text>`).join('') : '';
  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img">${grid.join('')}${bars}<line class="ch-axis" x1="${ML}" y1="${base}" x2="${CW - MR}" y2="${base}"/><line class="ch-axis" x1="${ML}" y1="${MT - 6}" x2="${ML}" y2="${base}"/>${legend}</svg>`;
}
const chartOf = (d, L, opts = {}) => barChart({ cats: d.theme.cats(L), series: [d.values], step: d.step, ...opts });
const titled = (d, L, html) => `<p class="ch-title">${d.theme.title[L]} (${d.theme.unit[L]})</p>${html}`;

// ---------- Bài 38. Dữ liệu và thu thập dữ liệu ----------

const NUMERIC = [
  ['Chiều cao (cm) của các bạn trong tổ', 'Heights (cm) of the pupils in a group'],
  ['Số anh chị em ruột của mỗi bạn trong lớp', 'Number of brothers and sisters of each pupil'],
  ['Nhiệt độ cao nhất mỗi ngày trong tuần', 'Highest temperature on each day of the week'],
  ['Số bàn thắng đội bóng ghi được ở mỗi trận', 'Goals the team scored in each match'],
  ['Khối lượng (kg) của mỗi bao gạo', 'Mass (kg) of each bag of rice'],
  ['Điểm kiểm tra Toán của các bạn trong lớp', 'Maths test marks of the class'],
];
const WORDS = [
  ['Màu sắc yêu thích của các bạn trong lớp', 'Favourite colours of the class'],
  ['Tên các tỉnh ven biển miền Trung', 'Names of the coastal provinces in central Viet Nam'],
  ['Môn thể thao mỗi bạn thích nhất', 'Each pupil\'s favourite sport'],
  ['Các loài hoa trồng trong vườn trường', 'Kinds of flowers in the school garden'],
  ['Phương tiện mỗi bạn dùng để đến trường', 'How each pupil gets to school'],
  ['Món ăn sáng của các bạn trong tổ', 'What each pupil in the group ate for breakfast'],
];

const METHODS = {
  look: { vi: 'Quan sát', en: 'Observation' },
  test: { vi: 'Làm thí nghiệm', en: 'Experiment' },
  ask: { vi: 'Lập phiếu hỏi', en: 'Questionnaire' },
  read: { vi: 'Nguồn có sẵn (sách, báo, internet)', en: 'Existing sources (books, internet)' },
};
const TASKS = [
  ['Đếm số xe máy đi qua cổng trường trong 15 phút', 'Counting motorbikes passing the school gate in 15 minutes', 'look'],
  ['Ghi lại màu áo của các bạn trong lớp hôm nay', 'Noting the colour of every pupil\'s shirt today', 'look'],
  ['Đếm số chim đậu trên cây trong sân trường', 'Counting the birds in a tree in the schoolyard', 'look'],
  ['Đo thời gian một viên đá tan hết trong cốc nước', 'Timing how long an ice cube takes to melt in a glass of water', 'test'],
  ['Tung một đồng xu 50 lần và ghi lại mặt xuất hiện', 'Tossing a coin 50 times and noting each result', 'test'],
  ['Đo nhiệt độ sôi của một số chất lỏng', 'Measuring the boiling point of some liquids', 'test'],
  ['Tìm hiểu món ăn yêu thích của các bạn trong lớp', 'Finding out the class\'s favourite foods', 'ask'],
  ['Hỏi ý kiến phụ huynh về giờ vào học', 'Asking parents what they think of the school start time', 'ask'],
  ['Dân số các tỉnh trong cả nước năm trước', 'Last year\'s population of each province', 'read'],
  ['Chiều dài các con sông lớn của Việt Nam', 'Lengths of the major rivers of Viet Nam', 'read'],
];

// Lists with exactly one value that cannot be right.
const ODD_LISTS = [
  { vi: 'Tuổi của một số bạn học sinh lớp 6', en: 'Ages of some Grade 6 pupils', make: () => ({ good: Array.from({ length: 5 }, () => int(11, 12)), bad: pick([112, 1, 2, 21]) }), why: { vi: 'Học sinh lớp 6 thường 11 hoặc 12 tuổi.', en: 'Grade 6 pupils are usually 11 or 12.' } },
  { vi: 'Điểm kiểm tra (thang điểm 10) của một tổ', en: 'Test marks (out of 10) in a group', make: () => ({ good: Array.from({ length: 5 }, () => int(4, 10)), bad: pick([11, 12, 15, 25]) }), why: { vi: 'Điểm theo thang 10 không vượt quá 10.', en: 'A mark out of 10 cannot be more than 10.' } },
  { vi: 'Nhiệt độ (°C) của nồi nước đang đun', en: 'Temperature (°C) of water being heated', make: () => ({ good: [int(20, 40), int(45, 60), int(65, 80), int(82, 95), 100], bad: pick([105, 110, 120]) }), why: { vi: 'Nước đang đun (ở áp suất thường) không nóng quá 100 °C.', en: 'Heated water (at normal pressure) does not go above 100 °C.' } },
  { vi: 'Số học sinh của các tổ trong lớp', en: 'Number of pupils in each group of a class', make: () => ({ good: Array.from({ length: 4 }, () => int(8, 12)), bad: pick([-9, 0.5, 2.5]) }), why: { vi: 'Số học sinh phải là số tự nhiên.', en: 'A number of pupils must be a natural number.' } },
  { vi: 'Tỉ lệ phần trăm học sinh thích đọc sách của các lớp', en: 'Percentage of pupils who like reading, by class', make: () => ({ good: Array.from({ length: 4 }, () => int(30, 95)), bad: pick([110, 120, 150]) }), why: { vi: 'Tỉ lệ phần trăm số bạn không vượt quá 100%.', en: 'A percentage of pupils cannot be more than 100%.' } },
];

const FRUITS = (L) => T(L, 'Cam,Xoài,Chuối,Táo', 'Orange,Mango,Banana,Apple').split(',');

const lesson38 = {
  id: 'c9b38',
  number: 38,
  title: { vi: 'Dữ liệu và thu thập dữ liệu', en: 'Data and collecting data' },
  points: [
    {
      title: { vi: 'Dữ liệu và cách thu thập', en: 'Data and how to collect it' },
      theory: {
        vi: [
          'Những thông tin thu thập được như số, chữ, hình ảnh… gọi là <b>dữ liệu</b>. Dữ liệu là số gọi là <b>số liệu</b>.',
          'Thu thập dữ liệu bằng cách: <b>quan sát</b>, <b>làm thí nghiệm</b>, <b>lập phiếu hỏi</b> (điều tra), hoặc lấy từ <b>nguồn có sẵn</b> như sách báo, trang web.',
        ],
        en: [
          'Information we collect — numbers, words, pictures… — is called <b>data</b>. Data made of numbers is <b>numerical data</b>.',
          'We collect data by <b>observing</b>, doing an <b>experiment</b>, using a <b>questionnaire</b> (survey), or from <b>existing sources</b> such as books and websites.',
        ],
      },
      example: {
        caption: { vi: 'Phiếu hỏi về một bạn trong lớp.', en: 'A questionnaire about one pupil.' },
        frames: (L) => {
          const rows = [
            [T(L, 'Chiều cao', 'Height'), '148 cm', true],
            [T(L, 'Môn học yêu thích', 'Favourite subject'), T(L, 'Toán', 'Maths'), false],
            [T(L, 'Số anh chị em', 'Brothers and sisters'), '2', true],
            [T(L, 'Quê quán', 'Home town'), T(L, 'Huế', 'Hue'), false],
          ];
          const table = (mark) => statTable([T(L, 'Câu hỏi', 'Question'), T(L, 'Trả lời', 'Answer')], rows.map(([q, a, num]) => [q, mark === 'num' && num ? `<span class="hl b">${a}</span>` : mark === 'word' && !num ? `<span class="hl a">${a}</span>` : a]));
          return [
            table('') + cap(T(L, 'Bạn Lan trả lời một phiếu hỏi.', 'Lan answers a questionnaire.')),
            table('num') + cap(T(L, 'Câu trả lời là số: <b>số liệu</b>.', 'Answers that are numbers: <b>numerical data</b>.'), true),
            table('word') + cap(T(L, 'Câu trả lời là chữ: dữ liệu <b>không phải số liệu</b>.', 'Answers that are words: data that is <b>not numerical</b>.'), true),
          ];
        },
      },
    },
    {
      title: { vi: 'Giá trị không hợp lí', en: 'Values that make no sense' },
      theory: {
        vi: [
          'Dữ liệu cần <b>hợp lí</b>: phù hợp với ý nghĩa của nó (số người là số tự nhiên, điểm thang 10 không quá 10, tỉ lệ phần trăm số bạn không quá 100%…).',
          'Khi thấy giá trị không hợp lí, cần kiểm tra lại hoặc loại bỏ trước khi dùng dữ liệu.',
        ],
        en: [
          'Data must <b>make sense</b>: a number of people is a natural number, a mark out of 10 is at most 10, a percentage of pupils is at most 100%…',
          'A value that makes no sense must be checked again or left out before the data is used.',
        ],
      },
      example: {
        caption: { vi: 'Chiều cao (cm) bạn Minh ghi lại cho tổ mình.', en: 'Heights (cm) Minh wrote down for his group.' },
        frames: (L) => {
          const vals = [142, 150, 138, 1450, 147];
          const chips = (bad) => `<div class="vx-chips">${vals.map((v) => `<span class="vx-pill${bad && v === 1450 ? ' bad new' : ''}">${fmt(v, L)}</span>`).join('')}</div>`;
          return [
            chips(false) + cap(T(L, 'Năm số đo chiều cao.', 'Five heights.')),
            chips(true) + cap(T(L, `${fmt(1450, L)} cm là hơn 14 m: <b>không hợp lí</b>.`, `${fmt(1450, L)} cm is over 14 m: it <b>makes no sense</b>.`), true),
            chips(true) + cap(T(L, 'Có lẽ Minh ghi nhầm 145 cm — cần hỏi lại.', 'Minh probably meant 145 cm — check it.'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Numerical or not.
    () => {
      const wantNum = Math.random() < 0.5;
      const [right, wrongs] = wantNum ? [pick(NUMERIC), shuffle(WORDS).slice(0, 3)] : [pick(WORDS), shuffle(NUMERIC).slice(0, 3)];
      const as = (x) => ({ vi: x[0], en: x[1] });
      return choice(
        wantNum ? { vi: 'Dữ liệu nào là <b>số liệu</b>?', en: 'Which data is <b>numerical</b>?' } : { vi: 'Dữ liệu nào <b>không phải</b> là số liệu?', en: 'Which data is <b>not</b> numerical?' },
        as(right),
        wrongs.map(as),
        { vi: wantNum ? `Số liệu là dữ liệu dạng số: ${right[0].toLowerCase()}.` : `Dữ liệu dạng chữ: ${right[0].toLowerCase()}.`, en: wantNum ? `Numerical data is numbers: ${right[1].toLowerCase()}.` : `This data is words: ${right[1].toLowerCase()}.` },
      );
    },
    // The value that makes no sense.
    () => {
      const list = pick(ODD_LISTS);
      const { good, bad } = list.make();
      const shown = shuffle([...good, bad]);
      const others = shuffle([...new Set(good)]).slice(0, 3);
      return choice(
        bi((L) => `${list[L]}: ${shown.map((v) => D(v, L)).join(T(L, '; ', ', '))}. ${T(L, 'Giá trị nào <b>không hợp lí</b>?', 'Which value <b>makes no sense</b>?')}`),
        bi((L) => D(bad, L)),
        others.map((v) => bi((L) => D(v, L))),
        list.why,
      );
    },
    // Collection method.
    () => {
      const [vi, en, m] = pick(TASKS);
      return choice(
        bi((L) => T(L, `Nên dùng cách nào để thu thập dữ liệu: <i>${vi}</i>?`, `Which method suits collecting this data: <i>${en}</i>?`)),
        METHODS[m],
        Object.keys(METHODS).filter((k) => k !== m).map((k) => METHODS[k]),
        METHODS[m],
      );
    },
    // Counting in raw data.
    () => {
      const n = int(12, 18);
      const data = Array.from({ length: n }, () => int(0, 3));
      const target = pick([...new Set(data)]);
      const count = data.filter((v) => v === target).length;
      return input(
        bi((L) => T(L, `Hỏi các bạn trong lớp "Em thích quả nào nhất?", Hà ghi lại: ${data.map((v) => FRUITS(L)[v]).join(', ')}. Có bao nhiêu bạn thích ${FRUITS(L)[target].toLowerCase()}?`, `Asked "Which fruit do you like best?", the pupils answered: ${data.map((v) => FRUITS(L)[v]).join(', ')}. How many chose ${FRUITS(L)[target].toLowerCase()}?`)),
        count,
        bi((L) => T(L, `Đếm từ "${FRUITS(L)[target]}" trong dãy: ${count} bạn.`, `Count "${FRUITS(L)[target]}" in the list: ${count} pupils.`)),
        { data, target },
      );
    },
  ],
};

// ---------- Bài 39. Bảng thống kê và biểu đồ tranh ----------

const EX39 = { theme: THEMES[0], step: 10, values: [30, 50, 20, 40] };
const RAW39 = [0, 1, 0, 2, 1, 1, 3, 0, 1, 2, 1, 3];

const lesson39 = {
  id: 'c9b39',
  number: 39,
  title: { vi: 'Bảng thống kê và biểu đồ tranh', en: 'Tables and pictograms' },
  points: [
    {
      title: { vi: 'Bảng thống kê', en: 'Frequency tables' },
      theory: {
        vi: [
          '<b>Bảng thống kê</b> trình bày dữ liệu gọn gàng: mỗi dòng (hoặc cột) là một loại, kèm số lượng của loại đó.',
          'Từ dữ liệu ban đầu, đếm số lần xuất hiện của từng loại rồi ghi vào bảng. Tổng các số lượng bằng số dữ liệu.',
        ],
        en: [
          'A <b>frequency table</b> shows data neatly: each row (or column) is one group, with how many belong to it.',
          'From the raw data, count how often each group appears and write it in the table. The counts add up to the number of data values.',
        ],
      },
      example: {
        caption: { vi: 'Quả yêu thích của 12 bạn trong tổ.', en: 'Favourite fruit of 12 pupils.' },
        frames: (L) => {
          const counts = [0, 1, 2, 3].map((k) => RAW39.filter((v) => v === k).length);
          const raw = `<div class="vx-chips">${RAW39.map((v) => `<span class="vx-pill">${FRUITS(L)[v]}</span>`).join('')}</div>`;
          const table = (upto) => statTable([T(L, 'Quả', 'Fruit'), T(L, 'Số bạn', 'Pupils')], counts.map((c, i) => [FRUITS(L)[i], i < upto ? c : '']), upto - 1);
          return [
            raw + cap(T(L, 'Dữ liệu ban đầu.', 'The raw data.')),
            raw + table(0) + cap(T(L, 'Lập bảng: mỗi dòng là một loại quả.', 'Make a table: one row per fruit.'), true),
            raw + table(2) + cap(T(L, 'Đếm từng loại và ghi vào bảng…', 'Count each fruit and fill in the table…'), true),
            raw + table(4) + cap(T(L, `…tổng: ${counts.join(' + ')} = 12 bạn.`, `…total: ${counts.join(' + ')} = 12 pupils.`), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Biểu đồ tranh', en: 'Pictograms' },
      theory: {
        vi: [
          '<b>Biểu đồ tranh</b> dùng biểu tượng (hình ảnh) để biểu diễn dữ liệu. Mỗi biểu tượng thay cho một số lượng ghi ở chú thích.',
          'Nửa biểu tượng thay cho một nửa số lượng đó. Đọc biểu đồ: số biểu tượng × số lượng mỗi biểu tượng.',
        ],
        en: [
          'A <b>pictogram</b> shows data with icons. Each icon stands for an amount given in the key.',
          'Half an icon stands for half that amount. To read it: number of icons × the amount per icon.',
        ],
      },
      example: {
        caption: { vi: 'Số cây trồng được của các lớp.', en: 'Trees planted by each class.' },
        frames: (L) => [
          pictogram(EX39, L, { upto: 1, newRow: 0 }) + cap(T(L, 'Chú thích: mỗi 🌳 là 10 cây.', 'Key: each 🌳 is 10 trees.')),
          pictogram(EX39, L, { newRow: 3 }) + cap(T(L, 'Mỗi lớp một hàng biểu tượng.', 'One row of icons per class.'), true),
          pictogram(EX39, L) + cap(T(L, '6B có 5 biểu tượng: 5 · 10 = <b>50 cây</b>.', '6B has 5 icons: 5 · 10 = <b>50 trees</b>.'), true, true),
          pictogram({ ...EX39, values: [...EX39.values, 35] }, L, { newRow: 4 }) + cap(T(L, '6E có 3 biểu tượng rưỡi: 3 · 10 + 5 = <b>35 cây</b>.', '6E has 3½ icons: 3 · 10 + 5 = <b>35 trees</b>.'), true, true),
        ],
      },
    },
  ],
  exercises: [
    // Read one row of a pictogram.
    () => {
      const d = dataset(4, { maxSteps: 6 });
      const per = pick([2, 4, 5, 10]);
      d.values = d.values.map((v) => (v / d.step) * per + (Math.random() < 0.3 && per % 2 === 0 ? per / 2 : 0));
      d.step = per;
      const i = int(0, 3);
      const icons = d.values[i] / per;
      return input(
        bi((L) => `${T(L, `${d.theme.title.vi}. Mục <b>${d.theme.cats(L)[i]}</b> là bao nhiêu ${d.theme.unit.vi}?`, `${d.theme.title.en}. How many ${d.theme.unit.en} for <b>${d.theme.cats(L)[i]}</b>?`)}${pictogram(d, L)}`),
        d.values[i],
        bi((L) => T(L, `${D(icons, L)} biểu tượng × ${per} = ${d.values[i]} ${d.theme.unit.vi}.`, `${D(icons, L)} icons × ${per} = ${d.values[i]} ${d.theme.unit.en}.`)),
        { per, icons },
      );
    },
    // Most / least.
    () => {
      const d = dataset(4, { maxSteps: 7 });
      const most = Math.random() < 0.5;
      const best = d.values.indexOf(most ? Math.max(...d.values) : Math.min(...d.values));
      return choice(
        bi((L) => `${T(L, `${d.theme.title.vi}. Mục nào <b>${most ? 'nhiều' : 'ít'} nhất</b>?`, `${d.theme.title.en}. Which has the <b>${most ? 'most' : 'fewest'}</b>?`)}${pictogram(d, L)}`),
        catName(d.theme, best),
        d.values.map((_, i) => i).filter((i) => i !== best).map((i) => catName(d.theme, i)),
        bi((L) => T(L, `${d.theme.cats(L)[best]} có ${most ? 'nhiều' : 'ít'} biểu tượng nhất.`, `${d.theme.cats(L)[best]} has the ${most ? 'most' : 'fewest'} icons.`)),
      );
    },
    // Read a table: total or difference.
    () => {
      const d = dataset(4);
      const total = Math.random() < 0.5;
      const [i, j] = shuffle([0, 1, 2, 3]);
      const [hi, lo] = d.values[i] > d.values[j] ? [i, j] : [j, i];
      return input(
        bi((L) => `${total
          ? T(L, `${d.theme.title.vi}. Tổng cộng có bao nhiêu ${d.theme.unit.vi}?`, `${d.theme.title.en}. How many ${d.theme.unit.en} altogether?`)
          : T(L, `${d.theme.title.vi}. ${d.theme.cats(L)[hi]} nhiều hơn ${d.theme.cats(L)[lo]} bao nhiêu ${d.theme.unit.vi}?`, `${d.theme.title.en}. How many more for ${d.theme.cats(L)[hi]} than for ${d.theme.cats(L)[lo]}?`)}${themeTable(d, L)}`),
        total ? sum(d.values) : d.values[hi] - d.values[lo],
        bi((L) => (total ? `${d.values.join(' + ')} = ${fmt(sum(d.values), L)}` : `${d.values[hi]} − ${d.values[lo]} = ${d.values[hi] - d.values[lo]}`)),
      );
    },
    // How many icons to draw.
    () => {
      const theme = pick(THEMES);
      const per = pick([2, 5, 10, 20]);
      const k = int(2, 9);
      const half = per % 2 === 0 && Math.random() < 0.4;
      const v = k * per + (half ? per / 2 : 0);
      return inputD(
        bi((L) => T(L, `Vẽ biểu đồ tranh, mỗi ${theme.icon} biểu diễn ${per} ${theme.unit.vi}. Cần vẽ bao nhiêu ${theme.icon} để biểu diễn ${v} ${theme.unit.vi}?`, `In a pictogram each ${theme.icon} stands for ${per} ${theme.unit.en}. How many ${theme.icon} show ${v} ${theme.unit.en}?`)),
        exact(v / per),
        bi((L) => `${v} : ${per} = ${D(v / per, L)}${half ? T(L, ' (một nửa biểu tượng cuối)', ' (the last one is half an icon)') : ''}`),
      );
    },
  ],
};

// ---------- Bài 40. Biểu đồ cột ----------

const EX40 = { theme: THEMES[1], step: 10, values: [30, 50, 20, 60, 40] };

const lesson40 = {
  id: 'c9b40',
  number: 40,
  title: { vi: 'Biểu đồ cột', en: 'Bar charts' },
  points: [
    {
      title: { vi: 'Đọc biểu đồ cột', en: 'Reading a bar chart' },
      theory: {
        vi: [
          '<b>Biểu đồ cột</b> gồm hai trục: trục ngang ghi các loại (đối tượng), trục đứng ghi số lượng theo một <b>tỉ lệ</b> (khoảng chia).',
          'Mỗi loại là một cột; <b>chiều cao</b> của cột cho biết số lượng. Cột cao nhất là nhiều nhất.',
        ],
        en: [
          'A <b>bar chart</b> has two axes: the horizontal one lists the groups, the vertical one shows amounts on a <b>scale</b>.',
          'Each group is one bar; the <b>height</b> of the bar is its amount. The tallest bar is the largest.',
        ],
      },
      example: {
        caption: { vi: 'Số sách thư viện cho mượn trong một tuần.', en: 'Library books lent in one week.' },
        frames: (L) => [
          titled(EX40, L, chartOf(EX40, L, { shown: () => false })) + cap(T(L, 'Trục đứng chia mỗi khoảng 10 quyển.', 'Each step on the vertical axis is 10 books.')),
          ...[0, 1, 2, 3, 4].map((k) => titled(EX40, L, chartOf(EX40, L, { shown: (i) => i <= k, isNew: (i) => i === k, labels: k === 4 }))
            + cap(k < 4 ? `${EX40.theme.cats(L)[k]}: ${EX40.values[k]} ${T(L, 'quyển', 'books')}` : T(L, 'Thứ Năm cho mượn nhiều nhất (60), thứ Tư ít nhất (20).', 'Thursday lent the most (60), Wednesday the fewest (20).'), true, k === 4)),
        ],
      },
    },
    {
      title: { vi: 'Vẽ biểu đồ cột', en: 'Drawing a bar chart' },
      theory: {
        vi: [
          'Bước 1: vẽ hai trục; trục ngang ghi tên các loại, trục đứng chọn khoảng chia phù hợp với số liệu.',
          'Bước 2: tại mỗi loại vẽ một cột có chiều cao bằng số liệu; các cột rộng bằng nhau và cách đều nhau.',
          'Bước 3: ghi tên biểu đồ, đơn vị, và (nếu cần) số liệu trên mỗi cột.',
        ],
        en: [
          'Step 1: draw two axes; name the groups on the horizontal one and choose a suitable scale for the vertical one.',
          'Step 2: draw one bar per group, as tall as its amount; bars have equal widths and equal gaps.',
          'Step 3: add the title, the unit and (if useful) the value on each bar.',
        ],
      },
      example: {
        caption: { vi: 'Vẽ biểu đồ cột từ bảng.', en: 'From a table to a bar chart.' },
        frames: (L) => {
          const d = { theme: THEMES[3], step: 2, values: [8, 12, 6, 10] };
          d.theme = { ...d.theme, cats: (LL) => FRUITS(LL) };
          const table = themeTable(d, L);
          return [
            table + cap(T(L, 'Số bạn thích mỗi loại quả.', 'Pupils who like each fruit.')),
            chartOf(d, L, { shown: () => false }) + cap(T(L, 'Vẽ hai trục; số lớn nhất là 12 nên chia mỗi khoảng 2 bạn.', 'Draw the axes; the largest value is 12, so use steps of 2.'), true),
            chartOf(d, L, { isNew: () => true }) + cap(T(L, 'Vẽ các cột cao bằng số liệu.', 'Draw bars as tall as the values.'), true),
            titled(d, L, chartOf(d, L, { labels: true })) + cap(T(L, 'Ghi tên biểu đồ và số liệu trên mỗi cột.', 'Add the title and the values.'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Read one bar.
    () => {
      const d = dataset();
      const i = int(0, d.n - 1);
      return input(
        bi((L) => `${T(L, `Mục <b>${d.theme.cats(L)[i]}</b> là bao nhiêu ${d.theme.unit.vi}?`, `How many ${d.theme.unit.en} for <b>${d.theme.cats(L)[i]}</b>?`)}${titled(d, L, chartOf(d, L))}`),
        d.values[i],
        bi((L) => T(L, `Đỉnh cột ${d.theme.cats(L)[i]} ngang vạch ${d.values[i]}.`, `The ${d.theme.cats(L)[i]} bar reaches ${d.values[i]}.`)),
        { values: d.values, index: i },
      );
    },
    // Highest / lowest bar.
    () => {
      const d = dataset();
      const most = Math.random() < 0.5;
      const best = d.values.indexOf(most ? Math.max(...d.values) : Math.min(...d.values));
      return choice(
        bi((L) => `${T(L, `Mục nào <b>${most ? 'nhiều' : 'ít'} nhất</b>?`, `Which has the <b>${most ? 'most' : 'fewest'}</b>?`)}${titled(d, L, chartOf(d, L))}`),
        catName(d.theme, best),
        d.values.map((_, i) => i).filter((i) => i !== best).slice(0, 3).map((i) => catName(d.theme, i)),
        bi((L) => T(L, `Cột ${d.theme.cats(L)[best]} ${most ? 'cao' : 'thấp'} nhất (${d.values[best]}).`, `The ${d.theme.cats(L)[best]} bar is the ${most ? 'tallest' : 'shortest'} (${d.values[best]}).`)),
      );
    },
    // Difference between two bars.
    () => {
      const d = dataset();
      const [i, j] = shuffle(d.values.map((_, k) => k));
      const [hi, lo] = d.values[i] > d.values[j] ? [i, j] : [j, i];
      return input(
        bi((L) => `${T(L, `${d.theme.cats(L)[hi]} nhiều hơn ${d.theme.cats(L)[lo]} bao nhiêu ${d.theme.unit.vi}?`, `How many more ${d.theme.unit.en} for ${d.theme.cats(L)[hi]} than for ${d.theme.cats(L)[lo]}?`)}${titled(d, L, chartOf(d, L))}`),
        d.values[hi] - d.values[lo],
        bi(() => `${d.values[hi]} − ${d.values[lo]} = ${d.values[hi] - d.values[lo]}`),
        { values: d.values },
      );
    },
    // Total.
    () => {
      const d = dataset(4);
      return input(
        bi((L) => `${T(L, `Tổng cộng có bao nhiêu ${d.theme.unit.vi}?`, `How many ${d.theme.unit.en} altogether?`)}${titled(d, L, chartOf(d, L))}`),
        sum(d.values),
        bi((L) => `${d.values.join(' + ')} = ${fmt(sum(d.values), L)}`),
        { values: d.values },
      );
    },
  ],
};

// ---------- Bài 41. Biểu đồ cột kép ----------

const DOUBLE_THEMES = [
  { title: { vi: 'Số học sinh tham gia câu lạc bộ', en: 'Pupils in the clubs' }, cats: () => ['6A', '6B', '6C', '6D'], names: (L) => [T(L, 'Nam', 'Boys'), T(L, 'Nữ', 'Girls')], unit: { vi: 'bạn', en: 'pupils' }, steps: [1, 2] },
  { title: { vi: 'Số cây trồng được qua hai năm', en: 'Trees planted in two years' }, cats: () => ['6A', '6B', '6C', '6D'], names: () => ['2024', '2025'], unit: { vi: 'cây', en: 'trees' }, steps: [5, 10] },
  { title: { vi: 'Số ngày mưa ở hai thành phố', en: 'Rainy days in two cities' }, cats: (L) => T(L, 'Th6,Th7,Th8,Th9', 'Jun,Jul,Aug,Sep').split(','), names: (L) => [T(L, 'Hà Nội', 'Ha Noi'), 'Huế'], unit: { vi: 'ngày', en: 'days' }, steps: [1, 2, 3] },
  { title: { vi: 'Số vé bán được hai tuần liền', en: 'Tickets sold in two weeks' }, cats: (L) => T(L, 'T2,T3,T4,T5', 'Mon,Tue,Wed,Thu').split(','), names: (L) => [T(L, 'Tuần 1', 'Week 1'), T(L, 'Tuần 2', 'Week 2')], unit: { vi: 'vé', en: 'tickets' }, steps: [10, 20] },
];

// Two series whose differences are all different (so "largest gap" is unique).
function doubleData() {
  const th = pick(DOUBLE_THEMES);
  const step = pick(th.steps);
  for (;;) {
    const a = Array.from({ length: 4 }, () => int(1, 9) * step);
    const b = Array.from({ length: 4 }, () => int(1, 9) * step);
    const gaps = a.map((v, i) => Math.abs(v - b[i]));
    if (new Set(gaps).size === 4 && gaps.every((g) => g > 0)) return { th, step, a, b };
  }
}
const doubleChart = (dd, L, opts = {}) => `<p class="ch-title">${dd.th.title[L]} (${dd.th.unit[L]})</p>${barChart({ cats: dd.th.cats(L), series: [dd.a, dd.b], step: dd.step, names: dd.th.names(L), ...opts })}`;
const EX41 = { th: DOUBLE_THEMES[0], step: 2, a: [8, 12, 6, 10], b: [10, 8, 12, 4] };

const lesson41 = {
  id: 'c9b41',
  number: 41,
  title: { vi: 'Biểu đồ cột kép', en: 'Double bar charts' },
  points: [
    {
      title: { vi: 'Biểu đồ cột kép', en: 'Double bar charts' },
      theory: {
        vi: [
          '<b>Biểu đồ cột kép</b> ghép hai biểu đồ cột vào một: mỗi loại có <b>hai cột</b> đặt cạnh nhau, mỗi cột thuộc một nhóm dữ liệu.',
          'Hai nhóm được phân biệt bằng màu, ghi ở <b>chú giải</b>. Dùng để so sánh hai nhóm dữ liệu theo từng loại.',
        ],
        en: [
          'A <b>double bar chart</b> puts two bar charts together: each group has <b>two bars</b> side by side, one for each data set.',
          'The two data sets have different colours, shown in the <b>key</b>. It is used to compare the two sets group by group.',
        ],
      },
      example: {
        caption: { vi: 'Số bạn nam, nữ tham gia câu lạc bộ ở bốn lớp.', en: 'Boys and girls in the clubs, by class.' },
        frames: (L) => [
          doubleChart(EX41, L, { shown: (i, s) => s === 0, isNew: () => true }) + cap(T(L, 'Cột xanh: số bạn nam.', 'Blue bars: boys.')),
          doubleChart(EX41, L, { isNew: (i, s) => s === 1 }) + cap(T(L, 'Thêm cột cam: số bạn nữ.', 'Add the orange bars: girls.'), true),
          doubleChart(EX41, L, { labels: true }) + cap(T(L, 'Lớp 6C: nữ (12) nhiều hơn nam (6) là 6 bạn.', 'Class 6C: 12 girls, 6 more than the 6 boys.'), true),
          doubleChart(EX41, L, { labels: true }) + cap(T(L, 'Tổng lớp 6B: 12 + 8 = <b>20 bạn</b>.', 'Class 6B in all: 12 + 8 = <b>20 pupils</b>.'), true, true),
        ],
      },
    },
  ],
  exercises: [
    // Read one bar.
    () => {
      const dd = doubleData();
      const [i, s] = [int(0, 3), int(0, 1)];
      const v = [dd.a, dd.b][s][i];
      return input(
        bi((L) => `${T(L, `Nhóm <b>${dd.th.names(L)[s]}</b> ở mục <b>${dd.th.cats(L)[i]}</b> là bao nhiêu?`, `What is the value for <b>${dd.th.names(L)[s]}</b> in <b>${dd.th.cats(L)[i]}</b>?`)}${doubleChart(dd, L)}`),
        v,
        bi((L) => `${dd.th.names(L)[s]}, ${dd.th.cats(L)[i]}: ${v}`),
        { values: [dd.a, dd.b], index: i, series: s },
      );
    },
    // Largest gap.
    () => {
      const dd = doubleData();
      const gaps = dd.a.map((v, i) => Math.abs(v - dd.b[i]));
      const best = gaps.indexOf(Math.max(...gaps));
      return choice(
        bi((L) => `${T(L, 'Ở mục nào hai cột <b>chênh lệch nhiều nhất</b>?', 'Where is the <b>biggest difference</b> between the two bars?')}${doubleChart(dd, L)}`),
        catName(dd.th, best),
        [0, 1, 2, 3].filter((i) => i !== best).map((i) => catName(dd.th, i)),
        bi((L) => dd.th.cats(L).map((c, i) => `${c}: ${gaps[i]}`).join('; ')),
      );
    },
    // Total of one group.
    () => {
      const dd = doubleData();
      const s = int(0, 1);
      const vals = [dd.a, dd.b][s];
      return input(
        bi((L) => `${T(L, `Tổng cộng nhóm <b>${dd.th.names(L)[s]}</b> là bao nhiêu?`, `What is the total for <b>${dd.th.names(L)[s]}</b>?`)}${doubleChart(dd, L)}`),
        sum(vals),
        bi(() => `${vals.join(' + ')} = ${sum(vals)}`),
        { values: [dd.a, dd.b], series: s },
      );
    },
    // Both groups at one category.
    () => {
      const dd = doubleData();
      const i = int(0, 3);
      return input(
        bi((L) => `${T(L, `Mục <b>${dd.th.cats(L)[i]}</b> có tất cả bao nhiêu (cả hai nhóm)?`, `How many in all for <b>${dd.th.cats(L)[i]}</b> (both groups)?`)}${doubleChart(dd, L)}`),
        dd.a[i] + dd.b[i],
        bi(() => `${dd.a[i]} + ${dd.b[i]} = ${dd.a[i] + dd.b[i]}`),
        { values: [dd.a, dd.b], index: i },
      );
    },
  ],
};

// ---------- Bài 42. Kết quả có thể và sự kiện trong trò chơi, thí nghiệm ----------

// Events about a number from 1 to n: [vi, en, test].
const EVENTS = (k) => [
  ['là số chẵn', 'is even', (x) => x % 2 === 0],
  ['là số lẻ', 'is odd', (x) => x % 2 === 1],
  ['chia hết cho 3', 'is divisible by 3', (x) => x % 3 === 0],
  ['là số nguyên tố', 'is a prime number', (x) => x > 1 && [2, 3, 5, 7, 11, 13, 17, 19].includes(x)],
  [`lớn hơn ${k}`, `is greater than ${k}`, (x) => x > k],
  [`nhỏ hơn ${k}`, `is less than ${k}`, (x) => x < k],
];
const DIE = { vi: 'Gieo một con xúc xắc', en: 'A die is rolled', sv: 'số chấm', se: 'the number of dots' };
const cards = (n) => ({ vi: `Rút ngẫu nhiên một thẻ từ hộp có ${n} thẻ ghi các số 1, 2, …, ${n}`, en: `A card is drawn at random from a box of ${n} cards numbered 1 to ${n}`, sv: 'số trên thẻ', se: 'the number on the card' });
const KIND = {
  sure: { vi: 'Chắc chắn xảy ra', en: 'Certain' },
  never: { vi: 'Không thể xảy ra', en: 'Impossible' },
  maybe: { vi: 'Có thể xảy ra', en: 'Possible' },
};

const lesson42 = {
  id: 'c9b42',
  number: 42,
  title: { vi: 'Kết quả có thể và sự kiện trong trò chơi, thí nghiệm', en: 'Outcomes and events in games and experiments' },
  points: [
    {
      title: { vi: 'Kết quả có thể', en: 'Possible outcomes' },
      theory: {
        vi: [
          'Trong một trò chơi hay thí nghiệm (tung đồng xu, gieo xúc xắc, rút thẻ…), ta <b>không biết trước</b> kết quả sẽ là gì.',
          'Tuy vậy ta liệt kê được mọi <b>kết quả có thể</b>: tung đồng xu có 2 kết quả (sấp, ngửa); gieo xúc xắc có 6 kết quả (1, 2, …, 6 chấm).',
        ],
        en: [
          'In a game or experiment (tossing a coin, rolling a die, drawing a card…) we <b>cannot know in advance</b> what will happen.',
          'But we can list all the <b>possible outcomes</b>: a coin has 2 (heads, tails); a die has 6 (1, 2, …, 6 dots).',
        ],
      },
      example: {
        caption: { vi: 'Các kết quả có thể khi gieo xúc xắc.', en: 'The possible outcomes when rolling a die.' },
        frames: (L) => {
          const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
          const row = (upto) => `<div class="vx-chips dice">${faces.map((f, i) => (i < upto ? `<span class="vx-die${fresh(i === upto - 1 || upto === 6)}">${f}</span>` : '')).join('')}</div>`;
          return [
            row(1) + cap(T(L, 'Gieo một lần: có thể ra 1 chấm…', 'One roll: it might show 1 dot…')),
            row(6) + cap(T(L, '…hoặc 2, 3, 4, 5, 6 chấm.', '…or 2, 3, 4, 5 or 6 dots.'), true),
            row(6) + cap(T(L, 'Tập hợp các kết quả có thể: {1; 2; 3; 4; 5; 6} — <b>6 kết quả</b>.', 'The set of possible outcomes: {1, 2, 3, 4, 5, 6} — <b>6 outcomes</b>.'), true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Sự kiện', en: 'Events' },
      theory: {
        vi: [
          'Một <b>sự kiện</b> (ví dụ "số chấm là số chẵn") có thể xảy ra hoặc không, tuỳ vào kết quả.',
          'Sự kiện <b>chắc chắn</b> xảy ra với mọi kết quả; sự kiện <b>không thể</b> không xảy ra với kết quả nào; còn lại là sự kiện <b>có thể</b> xảy ra.',
        ],
        en: [
          'An <b>event</b> (such as "the number of dots is even") may happen or not, depending on the outcome.',
          'A <b>certain</b> event happens for every outcome; an <b>impossible</b> event happens for none; otherwise the event is <b>possible</b>.',
        ],
      },
      example: {
        caption: { vi: 'Sự kiện "số chấm là số chẵn".', en: 'The event "the number of dots is even".' },
        frames: (L) => {
          const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
          const row = (mark) => `<div class="vx-chips dice">${faces.map((f, i) => `<span class="vx-die${mark && (i + 1) % 2 === 0 ? ' on new' : ''}">${f}</span>`).join('')}</div>`;
          return [
            row(false) + cap(T(L, 'Sáu kết quả có thể.', 'Six possible outcomes.')),
            row(true) + cap(T(L, 'Sự kiện xảy ra khi ra 2, 4 hoặc 6 chấm.', 'It happens if the die shows 2, 4 or 6.'), true),
            row(true) + cap(T(L, 'Ra 3 chấm: sự kiện <b>không xảy ra</b>. Ra 4 chấm: sự kiện <b>xảy ra</b>.', 'Showing 3: the event <b>does not happen</b>. Showing 4: it <b>happens</b>.'), true),
            row(true) + cap(T(L, '"Số chấm nhỏ hơn 7": chắc chắn. "Số chấm là 8": không thể.', '"Fewer than 7 dots": certain. "8 dots": impossible.'), true),
          ];
        },
      },
    },
  ],
  exercises: [
    // Number of possible outcomes.
    () => {
      const kind = pick(['coin', 'die', 'spinner', 'cards', 'balls']);
      if (kind === 'balls') {
        const colours = shuffle([['đỏ', 'red'], ['xanh', 'blue'], ['vàng', 'yellow'], ['trắng', 'white'], ['tím', 'purple']]).slice(0, int(2, 5));
        const counts = colours.map(() => int(1, 6));
        return input(
          bi((L) => T(L, `Hộp có ${colours.map(([c], i) => `${counts[i]} bóng ${c}`).join(', ')}. Lấy ngẫu nhiên một quả và xem màu. Có bao nhiêu kết quả có thể?`, `A box holds ${colours.map(([, c], i) => `${counts[i]} ${c}`).join(', ')} balls. One ball is taken at random and its colour noted. How many possible outcomes are there?`)),
          colours.length,
          bi((L) => T(L, `Kết quả là màu của quả bóng: ${colours.length} màu.`, `The outcome is the ball's colour: ${colours.length} colours.`)),
        );
      }
      const n = { coin: 2, die: 6, spinner: int(3, 10), cards: int(5, 30) }[kind];
      const text = {
        coin: { vi: 'Tung một đồng xu. Có bao nhiêu kết quả có thể?', en: 'A coin is tossed. How many possible outcomes are there?' },
        die: { vi: 'Gieo một con xúc xắc. Có bao nhiêu kết quả có thể?', en: 'A die is rolled. How many possible outcomes are there?' },
        spinner: { vi: `Quay một vòng quay chia ${n} ô bằng nhau, đánh số 1 đến ${n}. Có bao nhiêu kết quả có thể?`, en: `A spinner has ${n} equal parts numbered 1 to ${n}. How many possible outcomes are there?` },
        cards: { vi: `Rút một thẻ từ hộp có ${n} thẻ đánh số 1 đến ${n}. Có bao nhiêu kết quả có thể?`, en: `A card is drawn from ${n} cards numbered 1 to ${n}. How many possible outcomes are there?` },
      }[kind];
      return input(text, n, bi((L) => T(L, `Có ${n} kết quả có thể.`, `There are ${n} possible outcomes.`)));
    },
    // Does the event happen for this outcome?
    () => {
      const n = pick([6, 6, int(8, 20)]);
      const x = int(1, n);
      const [vi, en, test] = pick(EVENTS(int(2, n - 1)));
      const setup = n === 6 ? DIE : cards(n);
      const happens = test(x);
      return choice(
        bi((L) => T(L, `${setup.vi} — kết quả là <b>${x}</b>. Sự kiện "${setup.sv} ${vi}" có xảy ra không?`, `${setup.en} — the outcome is <b>${x}</b>. Does the event "${setup.se} ${en}" happen?`)),
        happens ? YES : NO,
        [happens ? NO : YES],
        bi((L) => T(L, `${x} ${happens ? '' : 'không '}${vi}.`, happens ? `${x} ${en}.` : `It is not true that ${x} ${en}.`)),
      );
    },
    // How many outcomes make the event happen?
    () => {
      const n = pick([6, int(10, 30)]);
      const events = EVENTS(int(2, n - 1));
      const [vi, en, test] = pick(events);
      const good = Array.from({ length: n }, (_, i) => i + 1).filter(test);
      const setup = n === 6 ? DIE : cards(n);
      return input(
        bi((L) => T(L, `${setup.vi}. Có bao nhiêu kết quả có thể làm cho sự kiện "${setup.sv} ${vi}" xảy ra?`, `${setup.en}. How many outcomes make the event "${setup.se} ${en}" happen?`)),
        good.length,
        bi((L) => (good.length ? `${good.join(T(L, '; ', ', '))}: ${good.length}` : T(L, 'Không có kết quả nào: 0.', 'None: 0.'))),
        { n, test },
      );
    },
    // Certain, impossible or possible.
    () => {
      const n = pick([6, int(8, 20)]);
      const want = pick(['sure', 'never', 'maybe']);
      const setup = n === 6 ? DIE : cards(n);
      const [up, far, mid] = [n + int(1, 5), n + int(1, 9), int(1, n - 1)];
      const ev = {
        sure: pick([[`không lớn hơn ${n}`, `is not more than ${n}`], ['lớn hơn 0', 'is greater than 0'], [`nhỏ hơn ${up}`, `is less than ${up}`]]),
        never: pick([[`lớn hơn ${n}`, `is greater than ${n}`], ['bằng 0', 'is 0'], [`bằng ${far}`, `is ${far}`]]),
        maybe: pick([['là số chẵn', 'is even'], ['là số lẻ', 'is odd'], [`lớn hơn ${mid}`, `is greater than ${mid}`]]),
      }[want];
      return choice(
        bi((L) => T(L, `${setup.vi}. Sự kiện "${setup.sv} ${ev[0]}" là sự kiện gì?`, `${setup.en}. What kind of event is "${setup.se} ${ev[1]}"?`)),
        KIND[want],
        Object.keys(KIND).filter((k) => k !== want).map((k) => KIND[k]),
        bi((L) => ({
          sure: T(L, 'Mọi kết quả đều làm sự kiện xảy ra.', 'Every outcome makes it happen.'),
          never: T(L, 'Không kết quả nào làm sự kiện xảy ra.', 'No outcome makes it happen.'),
          maybe: T(L, 'Có kết quả làm nó xảy ra, có kết quả thì không.', 'Some outcomes make it happen, some do not.'),
        })[want]),
      );
    },
  ],
};

// ---------- Bài 43. Xác suất thực nghiệm ----------

const NICE_N = [10, 20, 25, 40, 50, 100, 200, 250, 500];
const SEQ43 = 'SNNSSNSNNNSSNSNNSNSN'.split('');
const EXPERIMENTS = [
  { vi: (n, k) => `Tung một đồng xu ${n} lần thì có ${k} lần xuất hiện mặt sấp`, en: (n, k) => `A coin is tossed ${n} times and lands heads ${k} times`, ev: { vi: 'Xuất hiện mặt sấp', en: 'Heads' } },
  { vi: (n, k) => `Mai ném bóng vào rổ ${n} lần thì trúng ${k} lần`, en: (n, k) => `Mai throws a ball at the hoop ${n} times and scores ${k} times`, ev: { vi: 'Mai ném trúng rổ', en: 'Mai scores' } },
  { vi: (n, k) => `Gieo ${n} hạt đậu thì có ${k} hạt nảy mầm`, en: (n, k) => `${n} bean seeds are sown and ${k} of them sprout`, ev: { vi: 'Hạt đậu nảy mầm', en: 'A seed sprouts' } },
  { vi: (n, k) => `Một cửa hàng có ${n} khách thì có ${k} khách mua bánh mì`, en: (n, k) => `A shop has ${n} customers and ${k} of them buy bread`, ev: { vi: 'Khách mua bánh mì', en: 'A customer buys bread' } },
];

const lesson43 = {
  id: 'c9b43',
  number: 43,
  title: { vi: 'Xác suất thực nghiệm', en: 'Experimental probability' },
  points: [
    {
      title: { vi: 'Xác suất thực nghiệm', en: 'Experimental probability' },
      theory: {
        vi: [
          `Thực hiện một trò chơi hay thí nghiệm <b>n</b> lần, sự kiện A xảy ra <b>k</b> lần. <b>Xác suất thực nghiệm</b> của A là ${frac('k', 'n')} = số lần A xảy ra : tổng số lần thực hiện.`,
          'Xác suất thực nghiệm là một số từ 0 đến 1; có thể viết dưới dạng phân số, số thập phân hoặc phần trăm.',
        ],
        en: [
          `Repeat a game or experiment <b>n</b> times; event A happens <b>k</b> times. The <b>experimental probability</b> of A is ${frac('k', 'n')} = times A happened : number of tries.`,
          'It is a number from 0 to 1, written as a fraction, a decimal or a percentage.',
        ],
      },
      example: {
        caption: { vi: 'Tung đồng xu 20 lần (S: sấp, N: ngửa).', en: 'Tossing a coin 20 times (S: heads, N: tails).' },
        frames: (L) => {
          const seq = (mark) => `<div class="vx-chips">${SEQ43.map((c) => `<span class="vx-pill${mark && c === 'S' ? ' on new' : ''}">${c}</span>`).join('')}</div>`;
          const k = SEQ43.filter((c) => c === 'S').length;
          return [
            seq(false) + cap(T(L, 'Kết quả 20 lần tung: n = 20.', 'The results of 20 tosses: n = 20.')),
            seq(true) + cap(T(L, `Đếm số lần ra mặt sấp: k = ${k}.`, `Count the heads: k = ${k}.`), true),
            seq(true) + cap(`${T(L, 'Xác suất thực nghiệm', 'Experimental probability')}: ${frac(k, 20)} = ${D(k / 20, L)}`, true, true),
          ];
        },
      },
    },
    {
      title: { vi: 'Dùng bảng kết quả', en: 'Using a results table' },
      theory: {
        vi: [
          'Khi kết quả đã được ghi thành bảng, n là tổng các số trong bảng, k là số ứng với sự kiện cần tính.',
          'Số lần thực hiện càng nhiều thì xác suất thực nghiệm càng phản ánh đúng khả năng xảy ra của sự kiện.',
        ],
        en: [
          'When the results are in a table, n is the sum of all the counts and k is the count for the event.',
          'The more tries, the better the experimental probability shows how likely the event is.',
        ],
      },
      example: {
        caption: { vi: 'Lấy bóng từ hộp 50 lần (có trả lại).', en: 'Taking a ball from a box 50 times (putting it back).' },
        frames: (L) => {
          const rows = [[T(L, 'Đỏ', 'Red'), 18], [T(L, 'Xanh', 'Blue'), 22], [T(L, 'Vàng', 'Yellow'), 10]];
          const table = (hl) => statTable([T(L, 'Màu', 'Colour'), T(L, 'Số lần', 'Times')], rows.map(([c, v], i) => [c, i === hl ? `<span class="hl b">${v}</span>` : v]));
          return [
            table(-1) + cap(T(L, 'Bảng kết quả.', 'The results.')),
            table(-1) + cap('n = 18 + 22 + 10 = 50', true),
            table(1) + cap(T(L, `Sự kiện "lấy được bóng xanh": k = 22, xác suất thực nghiệm ${frac(22, 50)} = ${D(0.44, L)}.`, `"A blue ball": k = 22, experimental probability ${frac(22, 50)} = ${D(0.44, L)}.`), true, true),
          ];
        },
      },
    },
  ],
  exercises: [
    // k out of n.
    () => {
      const n = pick(NICE_N);
      const k = int(1, n - 1);
      const ex = pick(EXPERIMENTS);
      return inputD(
        bi((L) => T(L, `${ex.vi(fmt(n, L), fmt(k, L))}. Tính xác suất thực nghiệm của sự kiện "${ex.ev.vi}" (viết dạng số thập phân).`, `${ex.en(fmt(n, L), fmt(k, L))}. Find the experimental probability of "${ex.ev.en}" (as a decimal).`)),
        exact(k / n),
        bi((L) => `${frac(k, n)} = ${D(k / n, L)}`),
      );
    },
    // From a list of dice rolls.
    () => {
      const n = pick([10, 20, 25]);
      const rolls = Array.from({ length: n }, () => int(1, 6));
      const [vi, en, test] = pick(EVENTS(int(2, 5)).filter((e) => !e[1].startsWith('is a prime')));
      const k = rolls.filter(test).length;
      return {
        ...inputD(
          bi((L) => T(L, `Gieo một con xúc xắc ${n} lần, số chấm lần lượt là: ${rolls.join(T(L, '; ', ', '))}. Tính xác suất thực nghiệm của sự kiện "số chấm ${vi}" (số thập phân).`, `A die is rolled ${n} times: ${rolls.join(', ')}. Find the experimental probability that "the number of dots ${en}" (as a decimal).`)),
          exact(k / n),
          bi((L) => T(L, `Có ${k} lần trong ${n} lần: ${frac(k, n)} = ${D(k / n, L)}.`, `${k} times out of ${n}: ${frac(k, n)} = ${D(k / n, L)}.`)),
        ),
        check: { rolls, test },
      };
    },
    // From a table.
    () => {
      const n = pick([20, 25, 40, 50, 100]);
      const a = int(1, n - 2);
      const b = int(1, n - a - 1);
      const counts = shuffle([a, b, n - a - b]);
      const names = (L) => T(L, 'Đỏ,Xanh,Vàng', 'Red,Blue,Yellow').split(',');
      const i = int(0, 2);
      return inputD(
        bi((L) => `${T(L, `Lấy một quả bóng từ hộp rồi trả lại, làm ${n} lần. Tính xác suất thực nghiệm của sự kiện "lấy được bóng ${names(L)[i].toLowerCase()}" (số thập phân).`, `A ball is taken from a box and put back, ${n} times. Find the experimental probability of "a ${names(L)[i].toLowerCase()} ball" (as a decimal).`)}${statTable([T(L, 'Màu', 'Colour'), T(L, 'Số lần', 'Times')], names(L).map((c, j) => [c, counts[j]]))}`),
        exact(counts[i] / n),
        bi((L) => `n = ${counts.join(' + ')} = ${n}; ${frac(counts[i], n)} = ${D(counts[i] / n, L)}`),
      );
    },
    // Who did better?
    () => {
      const names = shuffle(['An', 'Bình', 'Chi', 'Dũng']).slice(0, 3);
      const ns = names.map(() => pick([10, 20, 25, 40, 50]));
      const ks = ns.map((n) => int(1, n - 1));
      const ps = ks.map((k, i) => k / ns[i]);
      if (new Set(ps).size < 3) return lesson43.exercises[3]();
      const best = ps.indexOf(Math.max(...ps));
      return choice(
        bi((L) => T(L, `Ba bạn ném phi tiêu: ${names.map((m, i) => `${m} ném ${ns[i]} lần, trúng ${ks[i]} lần`).join('; ')}. Bạn nào có xác suất thực nghiệm ném trúng <b>cao nhất</b>?`, `Three friends throw darts: ${names.map((m, i) => `${m} hits ${ks[i]} out of ${ns[i]}`).join('; ')}. Who has the <b>highest</b> experimental probability of hitting?`)),
        names[best],
        names.filter((_, i) => i !== best),
        bi((L) => names.map((m, i) => `${m}: ${D(ps[i], L)}`).join('; ')),
      );
    },
  ],
};

export const CHAPTER9 = [lesson38, lesson39, lesson40, lesson41, lesson42, lesson43];

// ---------- Nâng cao ----------

export const ADVANCED9 = {
  c9b38: [
    // Marks at least 8.
    () => {
      const n = int(12, 20);
      const marks = Array.from({ length: n }, () => int(4, 10));
      const t = int(7, 9);
      const count = marks.filter((m) => m >= t).length;
      return input(
        bi((L) => T(L, `Điểm kiểm tra Toán của một nhóm: ${marks.join('; ')}. Có bao nhiêu bạn đạt từ ${t} điểm trở lên?`, `A group's maths marks: ${marks.join(', ')}. How many pupils got ${t} or more?`)),
        count,
        bi((L) => T(L, `Đếm các điểm ${t}, …, 10: ${count} bạn.`, `Count the marks from ${t} to 10: ${count} pupils.`)),
        { marks, t },
      );
    },
    // Most frequent answer.
    () => {
      for (;;) {
        const data = Array.from({ length: int(14, 20) }, () => int(0, 3));
        const counts = [0, 1, 2, 3].map((k) => data.filter((v) => v === k).length);
        const top = Math.max(...counts);
        if (counts.filter((c) => c === top).length !== 1) continue;
        const best = counts.indexOf(top);
        return choice(
          bi((L) => T(L, `Quả yêu thích của các bạn: ${data.map((v) => FRUITS(L)[v]).join(', ')}. Quả nào được chọn nhiều nhất?`, `Favourite fruits: ${data.map((v) => FRUITS(L)[v]).join(', ')}. Which fruit was chosen most often?`)),
          bi((L) => FRUITS(L)[best]),
          [0, 1, 2, 3].filter((k) => k !== best).map((k) => bi((L) => FRUITS(L)[k])),
          bi((L) => FRUITS(L).map((f, k) => `${f}: ${counts[k]}`).join('; ')),
        );
      }
    },
    // A wrongly recorded total.
    () => {
      const parts = Array.from({ length: 4 }, () => int(4, 15));
      const extra = int(1, 6);
      const N = sum(parts);
      const sports = (L) => T(L, 'Bóng đá,Cầu lông,Bơi,Cờ vua', 'Football,Badminton,Swimming,Chess').split(',');
      const shown = [...parts];
      const i = int(0, 3);
      shown[i] += extra;
      return input(
        bi((L) => T(L, `Lớp 6A có ${N} bạn, mỗi bạn chọn đúng một môn thể thao. Tổ trưởng ghi: ${sports(L).map((s, j) => `${s} ${shown[j]}`).join(', ')}. Tổng số ghi lại thừa bao nhiêu bạn so với sĩ số?`, `Class 6A has ${N} pupils; each chose exactly one sport. The monitor wrote: ${sports(L).map((s, j) => `${s} ${shown[j]}`).join(', ')}. By how many pupils does the total exceed the class size?`)),
        extra,
        bi(() => `${shown.join(' + ')} = ${sum(shown)}; ${sum(shown)} − ${N} = ${extra}`),
      );
    },
  ],
  c9b39: [
    // Unknown key.
    () => {
      const d = dataset(4, { maxSteps: 6 });
      const per = pick([2, 3, 4, 5, 10]);
      const icons = d.values.map((v) => v / d.step);
      const total = sum(icons) * per;
      const dd = { ...d, values: icons.map((k) => k * per), step: per };
      return input(
        bi((L) => `${T(L, `Biểu đồ tranh bị mất chú thích. Biết tổng cộng là ${total} ${d.theme.unit.vi}. Mỗi ${d.theme.icon} biểu diễn bao nhiêu ${d.theme.unit.vi}?`, `The pictogram's key is missing. The total is ${total} ${d.theme.unit.en}. How many does each ${d.theme.icon} stand for?`)}${pictogram(dd, L, { key: false })}`),
        per,
        bi((L) => T(L, `Có ${sum(icons)} biểu tượng: ${total} : ${sum(icons)} = ${per}.`, `There are ${sum(icons)} icons: ${total} : ${sum(icons)} = ${per}.`)),
      );
    },
    // Share as a percentage.
    () => {
      const total = pick([20, 25, 40, 50]);
      for (;;) {
        const a = int(1, total - 3);
        const b = int(1, total - a - 2);
        const c = total - a - b;
        const vals = [a, b, c];
        const i = int(0, 2);
        if ((vals[i] * 100) % total) continue;
        const names = (L) => T(L, 'Đi bộ,Xe đạp,Xe buýt', 'Walk,Bike,Bus').split(',');
        return input(
          bi((L) => `${T(L, `Cách đến trường của ${total} bạn. Bao nhiêu phần trăm số bạn ${names(L)[i].toLowerCase()}?`, `How ${total} pupils get to school. What percentage come by ${names(L)[i].toLowerCase()}?`)}${statTable([T(L, 'Cách đi', 'Way'), T(L, 'Số bạn', 'Pupils')], names(L).map((nm, j) => [nm, vals[j]]))}`),
          (vals[i] * 100) / total,
          bi(() => `${vals[i]} : ${total} · 100% = ${(vals[i] * 100) / total}%`),
        );
      }
    },
    // Total from icons with halves.
    () => {
      const d = dataset(4, { maxSteps: 5 });
      const per = pick([2, 4, 10]);
      const vals = d.values.map((v) => (v / d.step) * per + (Math.random() < 0.5 ? per / 2 : 0));
      const dd = { ...d, values: vals, step: per };
      return input(
        bi((L) => `${T(L, `${d.theme.title.vi}. Tổng cộng có bao nhiêu ${d.theme.unit.vi}?`, `${d.theme.title.en}. How many ${d.theme.unit.en} altogether?`)}${pictogram(dd, L)}`),
        sum(vals),
        bi((L) => T(L, `${D(sum(vals) / per, L)} biểu tượng × ${per} = ${sum(vals)}.`, `${D(sum(vals) / per, L)} icons × ${per} = ${sum(vals)}.`)),
      );
    },
  ],
  c9b40: [
    // Average.
    () => {
      for (;;) {
        const d = dataset();
        if (sum(d.values) % d.n) continue;
        return input(
          bi((L) => `${T(L, `Trung bình mỗi mục là bao nhiêu ${d.theme.unit.vi}?`, `What is the average per group, in ${d.theme.unit.en}?`)}${titled(d, L, chartOf(d, L))}`),
          sum(d.values) / d.n,
          bi(() => `(${d.values.join(' + ')}) : ${d.n} = ${sum(d.values)} : ${d.n} = ${sum(d.values) / d.n}`),
          { values: d.values },
        );
      }
    },
    // Biggest rise between neighbours.
    () => {
      for (;;) {
        const d = dataset(5);
        const rises = d.values.slice(1).map((v, i) => v - d.values[i]);
        const top = Math.max(...rises);
        if (top <= 0 || rises.filter((r) => r === top).length !== 1) continue;
        const i = rises.indexOf(top);
        const pair = (k) => bi((L) => `${d.theme.cats(L)[k]} → ${d.theme.cats(L)[k + 1]}`);
        return choice(
          bi((L) => `${T(L, 'Giữa hai mục liền nhau nào số liệu <b>tăng nhiều nhất</b>?', 'Between which two neighbouring groups is the <b>biggest rise</b>?')}${titled(d, L, chartOf(d, L))}`),
          pair(i),
          [0, 1, 2, 3].filter((k) => k !== i).map(pair),
          bi((L) => rises.map((r, k) => `${d.theme.cats(L)[k]}→${d.theme.cats(L)[k + 1]}: ${r > 0 ? '+' : ''}${r < 0 ? `−${-r}` : r}`).join('; ')),
        );
      }
    },
    // Missing bar from the total.
    () => {
      const d = dataset(4);
      const i = int(0, 3);
      const total = sum(d.values);
      return input(
        bi((L) => `${T(L, `Cột <b>${d.theme.cats(L)[i]}</b> bị mất. Biết tổng cả bốn mục là ${total} ${d.theme.unit.vi}. Mục đó là bao nhiêu?`, `The <b>${d.theme.cats(L)[i]}</b> bar is missing. The four groups total ${total} ${d.theme.unit.en}. What is the missing value?`)}${titled(d, L, chartOf(d, L, { shown: (k) => k !== i }))}`),
        d.values[i],
        bi(() => `${total} − (${d.values.filter((_, k) => k !== i).join(' + ')}) = ${d.values[i]}`),
      );
    },
  ],
  c9b41: [
    // Categories where the second group is larger.
    () => {
      const dd = doubleData();
      const count = dd.a.filter((v, i) => dd.b[i] > v).length;
      return input(
        bi((L) => `${T(L, `Ở bao nhiêu mục nhóm <b>${dd.th.names(L)[1]}</b> nhiều hơn nhóm <b>${dd.th.names(L)[0]}</b>?`, `In how many groups is <b>${dd.th.names(L)[1]}</b> more than <b>${dd.th.names(L)[0]}</b>?`)}${doubleChart(dd, L)}`),
        count,
        bi((L) => dd.th.cats(L).map((c, i) => `${c}: ${dd.a[i]} ${dd.b[i] > dd.a[i] ? '&lt;' : '&gt;'} ${dd.b[i]}`).join('; ')),
        { values: [dd.a, dd.b] },
      );
    },
    // Category with the largest total.
    () => {
      for (;;) {
        const dd = doubleData();
        const totals = dd.a.map((v, i) => v + dd.b[i]);
        const top = Math.max(...totals);
        if (totals.filter((t) => t === top).length !== 1) continue;
        const best = totals.indexOf(top);
        return choice(
          bi((L) => `${T(L, 'Mục nào có <b>tổng hai nhóm lớn nhất</b>?', 'Which group has the <b>largest total</b> of both bars?')}${doubleChart(dd, L)}`),
          catName(dd.th, best),
          [0, 1, 2, 3].filter((i) => i !== best).map((i) => catName(dd.th, i)),
          bi((L) => dd.th.cats(L).map((c, i) => `${c}: ${totals[i]}`).join('; ')),
        );
      }
    },
    // Difference of the two totals.
    () => {
      const dd = doubleData();
      const [sa, sb] = [sum(dd.a), sum(dd.b)];
      if (sa === sb) return ADVANCED9.c9b41[2]();
      return input(
        bi((L) => `${T(L, 'Tổng của hai nhóm chênh lệch nhau bao nhiêu?', 'By how much do the two groups\' totals differ?')}${doubleChart(dd, L)}`),
        Math.abs(sa - sb),
        bi((L) => `${dd.th.names(L)[0]}: ${sa}; ${dd.th.names(L)[1]}: ${sb}; ${Math.max(sa, sb)} − ${Math.min(sa, sb)} = ${Math.abs(sa - sb)}`),
        { values: [dd.a, dd.b] },
      );
    },
  ],
  c9b42: [
    // Two dice: sum or product.
    () => {
      const bySum = Math.random() < 0.5;
      const pairs = [];
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) pairs.push([a, b]);
      if (bySum) {
        const s = int(2, 12);
        const good = pairs.filter(([a, b]) => a + b === s);
        return input(
          bi((L) => T(L, `Gieo hai con xúc xắc (một xanh, một đỏ) cùng lúc. Có bao nhiêu kết quả có thể làm cho tổng số chấm bằng ${s}?`, `Two dice (one blue, one red) are rolled together. How many outcomes give a total of ${s} dots?`)),
          good.length,
          bi((L) => `${good.map(([a, b]) => `(${a}${T(L, '; ', ', ')}${b})`).join(' ')}: ${good.length}`),
          { kind: 'sum', s },
        );
      }
      const even = Math.random() < 0.5;
      const good = pairs.filter(([a, b]) => (a * b) % 2 === (even ? 0 : 1));
      return input(
        bi((L) => T(L, `Gieo hai con xúc xắc (một xanh, một đỏ) cùng lúc. Có bao nhiêu kết quả có thể làm cho tích số chấm là số ${even ? 'chẵn' : 'lẻ'}?`, `Two dice (one blue, one red) are rolled together. How many outcomes give an ${even ? 'even' : 'odd'} product of dots?`)),
        good.length,
        bi((L) => (even
          ? T(L, `Có 6 · 6 = 36 kết quả; tích lẻ khi cả hai số lẻ: 3 · 3 = 9. Tích chẵn: 36 − 9 = 27.`, `36 outcomes in all; the product is odd only when both are odd: 3 · 3 = 9. Even: 36 − 9 = 27.`)
          : T(L, 'Tích lẻ khi cả hai số đều lẻ: 3 · 3 = 9.', 'The product is odd only when both are odd: 3 · 3 = 9.'))),
        { kind: even ? 'evenProduct' : 'oddProduct' },
      );
    },
    // Two coins / three coins.
    () => {
      const c = pick([2, 3]);
      const ask = pick(['all', 'oneHead']);
      const n = 2 ** c;
      const ans = ask === 'all' ? n : c;
      return input(
        bi((L) => (ask === 'all'
          ? T(L, `Tung ${c} đồng xu cùng lúc (các đồng xu khác nhau). Có bao nhiêu kết quả có thể?`, `${c} different coins are tossed together. How many possible outcomes are there?`)
          : T(L, `Tung ${c} đồng xu cùng lúc (các đồng xu khác nhau). Có bao nhiêu kết quả có đúng một mặt sấp?`, `${c} different coins are tossed together. How many outcomes have exactly one head?`))),
        ans,
        bi((L) => (ask === 'all'
          ? T(L, `Mỗi đồng xu có 2 kết quả: ${Array(c).fill(2).join(' · ')} = ${n}.`, `Each coin has 2 outcomes: ${Array(c).fill(2).join(' · ')} = ${n}.`)
          : T(L, `Mặt sấp nằm ở một trong ${c} đồng xu: ${c} kết quả.`, `The head can be on any one of the ${c} coins: ${c} outcomes.`))),
        { coins: c, ask },
      );
    },
    // Cards divisible by a or b.
    () => {
      const n = int(15, 40);
      const [a, b] = pick([[2, 3], [2, 5], [3, 5], [3, 4], [4, 6]]);
      const good = Array.from({ length: n }, (_, i) => i + 1).filter((x) => x % a === 0 || x % b === 0);
      return input(
        bi((L) => T(L, `${cards(n).vi}. Có bao nhiêu kết quả làm cho sự kiện "số trên thẻ chia hết cho ${a} hoặc cho ${b}" xảy ra?`, `${cards(n).en}. How many outcomes make the event "the number on the card is divisible by ${a} or by ${b}" happen?`)),
        good.length,
        bi((L) => T(L, `Các số: ${good.join('; ')} — ${good.length} số.`, `The numbers: ${good.join(', ')} — ${good.length} of them.`)),
        { n, a, b },
      );
    },
  ],
  c9b43: [
    // Two experiments combined.
    () => {
      const n = pick([100, 200, 500, 1000]);
      const n1 = int(1, 9) * (n / 10);
      const n2 = n - n1;
      const k1 = int(Math.round(n1 * 0.3), Math.round(n1 * 0.7));
      const k2 = int(Math.round(n2 * 0.3), Math.round(n2 * 0.7));
      return inputD(
        bi((L) => T(L, `Hai bạn cùng tung đồng xu: Nam tung ${n1} lần được ${k1} lần sấp; Lan tung ${n2} lần được ${k2} lần sấp. Gộp kết quả của cả hai bạn, tính xác suất thực nghiệm của sự kiện "xuất hiện mặt sấp" (số thập phân).`, `Two friends toss coins: Nam gets ${k1} heads in ${n1} tosses, Lan gets ${k2} heads in ${n2}. Putting both together, find the experimental probability of heads (as a decimal).`)),
        exact((k1 + k2) / n),
        bi((L) => `${frac(`${k1} + ${k2}`, `${n1} + ${n2}`)} = ${frac(k1 + k2, n)} = ${D((k1 + k2) / n, L)}`),
      );
    },
    // k from the probability.
    () => {
      const n = pick(NICE_N);
      const k = int(1, n - 1);
      const ex = pick(EXPERIMENTS);
      return input(
        bi((L) => T(L, `Thực hiện ${n} lần, xác suất thực nghiệm của sự kiện "${ex.ev.vi}" là ${D(k / n, L)}. Sự kiện đó đã xảy ra bao nhiêu lần?`, `In ${n} tries, the experimental probability of "${ex.ev.en}" is ${D(k / n, L)}. How many times did it happen?`)),
        k,
        bi((L) => `${D(k / n, L)} · ${n} = ${k}`),
      );
    },
    // Complement.
    () => {
      const n = pick(NICE_N);
      const k = int(1, n - 1);
      return inputD(
        bi((L) => T(L, `Một xạ thủ bắn ${fmt(n, L)} viên đạn, có ${fmt(k, L)} viên trúng bia. Tính xác suất thực nghiệm của sự kiện "viên đạn <b>không</b> trúng bia" (số thập phân).`, `A marksman fires ${fmt(n, L)} shots and ${fmt(k, L)} hit the target. Find the experimental probability that a shot does <b>not</b> hit (as a decimal).`)),
        exact((n - k) / n),
        bi((L) => `${frac(`${n} − ${k}`, n)} = ${frac(n - k, n)} = ${D((n - k) / n, L)}`),
      );
    },
    // n from k and the probability.
    () => {
      const n = pick([20, 25, 40, 50, 100, 200]);
      const k = int(1, n - 1);
      const p = k / n;
      return input(
        bi((L) => T(L, `Bình ném phi tiêu, trúng hồng tâm ${k} lần; xác suất thực nghiệm của sự kiện "trúng hồng tâm" là ${D(p, L)}. Bình đã ném bao nhiêu lần?`, `Binh hits the bullseye ${k} times; the experimental probability of a bullseye is ${D(p, L)}. How many darts did Binh throw?`)),
        n,
        bi((L) => `${k} : ${D(p, L)} = ${n}`),
      );
    },
  ],
};

