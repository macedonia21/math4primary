# Vui Học Toán · Math Fun

A colourful math practice website for primary school children, in Vietnamese and English.

**Live site:** https://macedonia21.github.io/math4primary/

## What's inside

| Activity | What children practise |
|---|---|
| 🔢 Learn Numbers | Counting objects, comparing numbers, finding the missing number |
| ➕ Addition | Sums within 10, 20 and 100 |
| ➖ Subtraction | Differences within 10, 20 and 100 (never below zero) |
| 🎯 Challenge | Addition and subtraction mixed together |
| ✖️ Times Tables | Multiplication tables of 2 to 9 |

The first four activities have 5 levels each:

| Level | Addition / Subtraction / Challenge | Learn Numbers |
|---|---|---|
| 1 | Within 10 | Count objects up to 10 |
| 2 | Within 20, no carrying/borrowing | Count and compare up to 20 |
| 3 | Within 20, with carrying/borrowing | Missing number up to 20 |
| 4 | Within 100, no carrying/borrowing | Compare numbers up to 100 |
| 5 | Within 100, with carrying/borrowing | Missing number up to 100 |

### Times tables

The Times Tables activity has 9 levels: one for each table from 2 to 9, plus one that mixes all tables. All of them are open from the start, since children may be learning any table at school.

- Choosing a table first shows the whole table (3 × 1 = 3 … 3 × 10 = 30) in big numbers, with a **Play now** button. The results screen has a **See the table** button to review it again.
- Questions follow the Vietnamese textbook reading of `a × b`: "a taken b times". So 3 × 4 shows **4 dashed boxes with 3 objects each**, and objects inside a box are still in rows of 5.
- Wrong answer choices are the neighbouring answers in the same table (e.g. 24 and 30 for 3 × 9), the mistakes children make most often.

### Counting objects in groups of 5

On levels 1–3 (numbers up to 20), each calculation shows objects underneath so children can count. The objects are always split into rows of 5, so children learn to count by fives.

- **Addition** (e.g. 8 + 9) shows two piles of the same object. After the child answers, the full groups of 5 slide together as whole groups, then the loose objects gather into a new group of 5 plus any leftover: `[5][3] + [5][4]` becomes `[5][5][5][2]`.
- **Subtraction** (e.g. 16 − 8) shows one pile with the objects being taken away crossed out. After the child answers, the crossed-out objects fly away and fade, leaving the answer in groups of 5.

The animation plays after both right and wrong answers, so it also shows why the answer is correct. It plays even when the device is set to reduce motion, because the movement is part of the lesson; decorative motion (confetti, drifting clouds, button pops) still follows that setting. Levels 4–5 (up to 100) show the calculation only.

### Rounds and stars

A round has 10 questions. Children earn 1 star for 6 correct answers, 2 stars for 8 and 3 stars for 10. Earning at least 1 star unlocks the next level.

Progress is saved in the browser (`localStorage`), so it survives closing the browser. Each browser, device and web address keeps its own progress, and private/incognito windows don't keep it.

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
  css/style.css       All styling (colours, sizes, animations)
  js/app.js           Screens, game flow, sounds and confetti
  js/questions.js     Question generators for every activity and level
  js/i18n.js          Vietnamese and English text
  js/storage.js       Saving progress in localStorage
server.js             Local Express server for development
test/                 Unit tests for the question rules
```

To change wording, edit `public/js/i18n.js`. To change level rules, edit `public/js/questions.js` and run `npm test`.
