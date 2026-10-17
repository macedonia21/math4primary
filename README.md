# Vui Học Toán · Math Fun

A colourful math learning website in Vietnamese and English, with two sections:

- **Tiểu học (Primary school):** counting, addition, subtraction and times tables, as quick game rounds.
- **Lớp 6 (Grade 6):** lessons following the Vietnamese Grade 6 maths curriculum, each with key ideas, step-by-step visual examples and practice.

**Live site:** https://macedonia21.github.io/math4primary/

## Primary school

| Activity | What children practise |
|---|---|
| 🔢 Learn Numbers | Counting objects, comparing numbers, finding the missing number |
| ➕ Addition | Sums within 10, 20 and 100 |
| ➖ Subtraction | Differences within 10, 20 and 100 (never below zero) |
| 🎯 Challenge | Addition and subtraction mixed together |
| ✖️ Times Tables | Multiplication tables of 2 to 10 |

The first four activities have 5 levels each:

| Level | Addition / Subtraction / Challenge | Learn Numbers |
|---|---|---|
| 1 | Within 10 | Count objects up to 10 |
| 2 | Within 20, no carrying/borrowing | Count and compare up to 20 |
| 3 | Within 20, with carrying/borrowing | Missing number up to 20 |
| 4 | Within 100, no carrying/borrowing | Compare numbers up to 100 |
| 5 | Within 100, with carrying/borrowing | Missing number up to 100 |

### Times tables

The Times Tables activity has 10 levels: one for each table, plus one that mixes all tables. All of them are open from the start, since children may be learning any table at school.

The tables are listed easiest first: **2, 5, 10, 9, 4, 3, 6, 8, 7**. The 2s are doubling, the 5s end in 0 or 5, the 10s add a 0, the 9s have a pattern (9 × 7 = 63: the tens digit is one less than 7, and the digits add to 9), and the 4s, 6s and 8s are doubles of the 2s, 3s and 4s. The 7s come last because by then swapping the order already gives every 7 fact except 7 × 7 and 7 × 8.

- Choosing a table first shows the whole table (3 × 1 = 3 … 3 × 10 = 30) in big numbers, with a **Play now** button. The results screen has a **See the table** button to review it again.
- Questions follow the Vietnamese textbook reading of `a × b`: "a taken b times". So 3 × 4 shows **4 dashed boxes with 3 objects each**, and objects inside a box are still in rows of 5.
- **Swap hint:** after the child answers 3 × 7, the 7 boxes of 3 regroup into 3 boxes of 7. Each new box takes one object from every old box (rows become columns), then the line under the sum shows `3 × 7 = 7 × 3 = 21`. This shows that every fact learned also gives its swapped fact for free. It is skipped when both numbers are the same (4 × 4).
- Wrong answer choices are the neighbouring answers in the same table (e.g. 24 and 30 for 3 × 9), the mistakes children make most often.

### Counting objects in groups of 5

On levels 1–3 (numbers up to 20), each calculation shows objects underneath so children can count. The objects are always split into rows of 5, so children learn to count by fives.

- **Addition** (e.g. 8 + 9) shows two piles of the same object. After the child answers, the full groups of 5 slide together as whole groups, then the loose objects gather into a new group of 5 plus any leftover: `[5][3] + [5][4]` becomes `[5][5][5][2]`.
- **Subtraction** (e.g. 16 − 8) shows one pile with the objects being taken away crossed out. After the child answers, the crossed-out objects fly away and fade, leaving the answer in groups of 5.

The animation plays after both right and wrong answers, so it also shows why the answer is correct. It plays even when the device is set to reduce motion, because the movement is part of the lesson; decorative motion (confetti, drifting clouds, button pops) still follows that setting. Levels 4–5 (up to 100) show the calculation only.

### Rounds and stars

A round has 10 questions. Children earn 1 star for 6 correct answers, 2 stars for 8 and 3 stars for 10. Earning at least 1 star unlocks the next level.

Progress is saved in the browser (`localStorage`), so it survives closing the browser. Each browser, device and web address keeps its own progress, and private/incognito windows don't keep it.

## Grade 6

Grade 6 follows the chapters and lessons of the Vietnamese Grade 6 maths curriculum (Toán 6, volume 1). All theory, examples and exercises are written for this site rather than copied from a textbook.

| Chapter | Status |
|---|---|
| I. The set of natural numbers (lessons 1–7) | Done |
| II. Divisibility in the natural numbers (lessons 8–12) | Done |
| III. Integers (lessons 13–17) | Done |
| IV. Plane shapes in real life (lessons 18–20) | Done |
| V. Symmetry of shapes in nature (lessons 21–22) | Done |

The chapter list is a carousel showing one chapter at a time: switch with the I–V tabs, the ◀ ▶ arrows, the ← → keys, or by swiping. Coming back from a lesson returns to its chapter.

Each lesson page has:

- **Key ideas** for each main point of the lesson, in short bullet points.
- **A step-by-step example** for each point, drawn as a picture (number ray, set diagram, place-value table, dot grid, groups of objects, or lines of working). The **Next step** button reveals one step at a time with a gentle animation; ◀ goes back and ↺ starts again.
- **Practice: 10 questions** generated fresh every time from the lesson's exercise types. Some are multiple choice; others are answered by typing a number on the on-screen number pad (or the keyboard); in Chapter III the pad has a **±** key for negative answers (the keyboard's − key works too). A wrong answer shows the correct one with a short explanation and a **Next question** button. Stars work the same way as in the primary section.

- **🚀 Challenge (Nâng cao): 10 harder questions**, a separate practice with its own stars and a purple style. It uses problem types common in Vietnamese Grade 6 enrichment material, with original wording and random numbers:

  | Lesson | Challenge question types |
  |---|---|
  | 1. Sets | Counting elements of evenly spaced sets; odd/even numbers in a range; two-digit numbers with a given digit sum; describing a set by a formula (x = 3k + 1) |
  | 2. Writing numbers | Digits needed to number a book's pages; writing a digit on the right; how many numbers with different digits; smallest/largest number with different digits |
  | 3. Order | Sums of consecutive (even) numbers; product of two consecutive numbers; counting three-digit numbers above/below a bound; ordering similar numbers |
  | 4. Add and subtract | Sum of an arithmetic series; find x with two operations; sum-and-difference problems; age problems |
  | 5. Multiply and divide | Common-factor shortcuts; dividend + divisor known; largest/smallest number with a given remainder |
  | 6. Powers | Last digit of a power; comparing powers like 2³⁰ and 3²⁰; find x inside a power; rewriting 8ᵐ · 4ⁿ as a power of 2 |
  | 7. Order of operations | Long expressions with ( ), [ ] and { }; find x inside an expression; where to put brackets to reach a value |
  | 8. Divisibility | How many n make (n + c) divisible by n, or by n + 1; two-digit multiples; choosing x so a sum is divisible |
  | 9. Divisibility rules | Remainder on division by 9 or 3; counting three-digit numbers divisible by 2, 3, 5, 9 together; smallest/largest such four-digit number; two missing digits |
  | 10. Primes | Two primes with an odd sum; number of divisors from the factorisation; consecutive primes from their product; prime or composite without a calculator |
  | 11. GCD | Largest divisor leaving given remainders; equal teams of boys and girls; largest square tiles; simplifying large fractions |
  | 12. LCM | Lining up students exactly or with a remainder; GCD · LCM = product; adding three fractions |
  | 13. Integers | Sum of all integers in a range; largest/smallest negative numbers; moving along the number line; counting integers between negatives |
  | 14. Add and subtract integers | Sums from −a to b; find x; submarine depths; lifespans in years BC |
  | 15. Brackets | 1 − 2 + 3 − 4 + … ± n; find x with brackets; nested brackets; big numbers that cancel |
  | 16. Multiply integers | Powers of negative numbers; find x in a product; comparing powers of negatives; longer expressions |
  | 17. Divisors of integers | How many integers n make (n + c) divisible by n + 1, or (2x + c) by x + 1; products equal to 0; multiples between −a and b |
  | 18. Triangles, squares, hexagons | Matchsticks in a row of triangles or squares; how many squares hide in an n × n grid; hexagon from six triangles |
  | 19. Quadrilaterals | Rectangle from perimeter and difference or ratio; which shapes are also other shapes (a square is a rhombus…) |
  | 20. Perimeter and area | L-shaped areas; garden with a path; missing height or diagonal; fence cost |
  | 21. Lines of symmetry | Regular n-sided shapes; letters with a line of symmetry in a phrase; adding up lines of symmetry |
  | 22. Centre of symmetry | Regular shapes with an even number of sides; letters with a centre in a phrase; shapes with only one kind of symmetry |

Chapters IV and V draw every shape as SVG (`shapes.js`): equal-side ticks, right angles, diagonals, lines and centres of symmetry appear one step at a time, and some steps move — a triangle constructed with compasses, a parallelogram cut and rearranged into a rectangle, a trapezoid turned into a parallelogram, a butterfly folded along its axis, a parallelogram turned half a turn about its centre.

Lessons are in `public/js/grade6/`. Each chapter file lists its lessons with their theory, examples and exercise generators; `test/grade6.test.js` checks every exercise type hundreds of times (answers present, no duplicate choices, both languages filled in, order-of-operations answers recomputed independently).

## Run it on your computer

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm start
```

The terminal shows the addresses to open:

```
Math4Primary is running at:
  This computer:  http://localhost:3000
  Other devices:  http://192.168.0.28:3000
```

- Open the **This computer** address in a browser on the same PC.
- Open an **Other devices** address on phones or tablets connected to the same Wi-Fi. If they can't connect, allow Node.js through Windows Firewall for **Private** networks.
- To use a different port, set the `PORT` environment variable (for example `$env:PORT=8080; npm start` in PowerShell).

## Run the tests

```bash
npm test
```

The tests check the question rules: answers are correct, numbers stay within each level's limit, subtraction never goes below zero, and carrying/borrowing only appears on levels 3 and 5.

## Deploy

The site is hosted for free on **GitHub Pages**. Deployment is automatic: every push to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml), which runs the tests and then publishes the `public/` folder. It usually takes under a minute. If a test fails, nothing is published and the previous version stays online.

To publish a change:

```bash
git add -A
git commit -m "Describe the change"
git push
```

Check the deploy under the repository's **Actions** tab. To redeploy without changing anything, open **Actions → Deploy to GitHub Pages → Run workflow**.

### Setting up Pages on a new copy of this repo

1. Push the code to a GitHub repository.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow by hand. The site appears at `https://<username>.github.io/<repo-name>/`.

The site is plain HTML, CSS and JavaScript, so it also works on any static host (Netlify, Cloudflare Pages, Firebase Hosting): publish the `public/` folder. The Express server in `server.js` is only for running it locally.

## Project structure

```
public/
  index.html          Page shell
  css/style.css       Styling for the home page and primary section
  css/grade6.css      Styling for Grade 6 pages and illustrations
  js/app.js           Screens, game flow, sounds and confetti
  js/questions.js     Question generators for the primary activities
  js/i18n.js          Vietnamese and English interface text
  js/storage.js       Saving progress in localStorage
  js/grade6/
    index.js          Chapter list and practice rounds
    chapter1.js       Chapter I lessons: theory, examples, exercises
    chapter1Advanced.js  Chapter I challenge (Nâng cao) exercises
    chapter2.js       Chapter II lessons (divisibility, primes, GCD, LCM)
    chapter2Advanced.js  Chapter II challenge exercises
    chapter3.js       Chapter III lessons (integers)
    chapter3Advanced.js  Chapter III challenge exercises
    chapter4.js       Chapter IV lessons and challenge (plane shapes, perimeter, area)
    chapter5.js       Chapter V lessons and challenge (symmetry)
    shapes.js         SVG drawings of the shapes, their axes and centres
    visuals.js        Illustration building blocks for the examples
    ui.js             Grade 6 screens: lesson list, lesson page, practice
    util.js           Bilingual text, number formatting, question builders
server.js             Local Express server for development
test/                 Unit tests for the question and exercise rules
```

To change wording, edit `public/js/i18n.js`. To change level rules, edit `public/js/questions.js` and run `npm test`.
