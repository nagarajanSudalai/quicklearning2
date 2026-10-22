# QuickStep

Grade-wise puzzles and games for children in Grades 1–5. One codebase, three parts:

| Path | What it is |
|---|---|
| `apps/web` | Marketing homepage (React + Vite) |
| `apps/mobile` | The app — Expo / React Native for iOS, Android and web |
| `packages/content` | Shared puzzle bank (JSON), curriculum, puzzle types and design tokens |

See [ROADMAP.md](ROADMAP.md) for the phase plan. **Current status: Grades 1 and 2 are playable in all four subjects — Maths, English, Puzzles and Thinking Skills (640 puzzles) — with adaptive difficulty.**

## Getting started

```bash
npm install                 # once, at the repo root (npm workspaces)

npm run mobile              # Expo dev server — press w for web, or scan the QR code with Expo Go
npm run web                 # homepage dev server
npm run validate-content    # check every puzzle in packages/content/puzzles
npm run typecheck
```

## Deploying (Vercel)

`vercel.json` at the repo root builds both parts into one site:

- `/` is the homepage (`apps/web`).
- `/app` is the app's web version (`apps/mobile`, exported by Expo with base path `/app`).

`npm run build` does the same locally; the output goes to `apps/web/dist`. In Vercel project settings, leave **Root Directory** empty (repo root) and the framework preset on **Other**. `vercel.json` sets the build command and output directory.

## Grade 1 Maths (Phase 1)

Six topics, 20 puzzles each across 3 levels — 120 puzzles:

| Topic | Puzzle type | Levels |
|---|---|---|
| Counting | `count-objects` | 1–5 · 6–10 · 11–20 |
| Adding | `arithmetic` | sums to 5 with pictures · to 10 with pictures · to 10, numbers only |
| Taking away | `arithmetic` | within 5 · within 10 · numbers only |
| Shapes | `shape-match` | circle/square/triangle · + star/diamond · square vs rectangle |
| More or fewer | `compare` | big gap · gap of 2 · gap of 1 |
| Patterns | `pattern` | AB · AAB/ABB · ABC/ABBC |

## Grade 1 English (Phase 1)

Four topics, 20 puzzles each across 3 levels — 80 puzzles, built from the word bank in `packages/content/src/words.ts`:

| Topic | Puzzle type | Levels |
|---|---|---|
| Big & small letters | `letter-match` | very different letters · mixed · look-alikes (b d p q) |
| First letters | `first-letter` | 3 very different letters · mixed · 4 options with look-alikes |
| Picture words | `picture-word` | different first letters · same first letter (moon/mouse/milk) · missing letter (v_n) |
| Rhyming words | `rhyme` | 3 options · with a same-start decoy (cat → cake) · 4 options |

Rhymes are grouped by sound, not spelling (bear/chair, bee/key), in `RHYME_FAMILIES`. A missing-letter puzzle never offers a wrong letter that spells another real word (c_t: no "o", because "cot" is a word). The content checker enforces both. No puzzle depends on hearing an isolated letter sound, because the device voice can't say "buh"; recorded clips can add that later.

## Grade 1 Puzzles and Thinking Skills (Phase 1)

Five topics, 20 puzzles each across 3 levels — 100 puzzles, built from the picture categories in `packages/content/src/categories.ts` (farm, wild and sea animals; fruit; vegetables; vehicles; clothes; school things; weather).

| Subject | Topic | Puzzle type | Levels | Star for… |
|---|---|---|---|---|
| Puzzles | Odd one out | `odd-one-out` | very different (3 vegetables + a lion) · same family (sea animals + a giraffe) · 5 items | right on the first tap |
| Puzzles | Picture crossword | `crossword` | two 3-letter words, 2 blanks · up to 4 letters, 3 blanks · 4–5 letters, 4 blanks incl. the shared square | no wrong letters |
| Thinking | Sorting | `sort-into-groups` | 2 groups, 4 items · 2 groups, 6 items · 3 animal or thing groups | no wrong groups |
| Thinking | Memory pairs | `memory-match` | 3 pairs · 4 pairs · 6 pairs | no more wrong guesses than pairs |
| Thinking | Mazes | `maze` | 3×3 · 4×4 · 5×5 | at most 2 bumps into walls |

Crosswords, sorting, memory and mazes take several taps, so each has its own player in `apps/mobile/src/components/puzzles/interactive.tsx`; single-tap types use `renderers.tsx`. The content checker makes sure:
- exactly one item can be the odd one out (counting families too: cow, pig, hen, lion → only lion);
- crossword words agree where they cross and every missing letter is offered;
- each sorting item belongs to exactly one of its groups;
- every memory card has one match;
- every maze can be solved.

Tap a crossword clue picture or a sorting item to hear its name. Mazes work with the arrow buttons, by tapping the next square, or with the keyboard arrow keys on the web.

## Grade 2 (Phase 3), NCERT/CBSE Class 2

17 topics, 20 puzzles each across 3 levels — 340 puzzles.

| Subject | Topic | Puzzle type | Levels |
|---|---|---|---|
| Maths | Tens and ones | `place-value` | blocks to 50 · to 99 · "How many tens/ones in 47?" |
| Maths | Adding to 100 | `arithmetic` | 2-digit + 1-digit · 2-digit + 2-digit · with carrying |
| Maths | Taking away to 100 | `arithmetic` | − 1-digit · 2-digit − 2-digit · with borrowing |
| Maths | Skip counting | `number-pattern` | by 2s/5s/10s, last missing · by 2–10, middle missing · counting back |
| Maths | Equal groups | `arithmetic` (×) | groups of pictures up to 5 × 3 · up to 5 × 5 · ×2, ×5, ×10 facts |
| Maths | Time | `clock` | o'clock · half past · quarter past / quarter to |
| Maths | Money | `money` | ₹1/₹2/₹5 coins to ₹10 · coins and ₹10/₹20 notes to ₹50 · with ₹50 notes to ₹100 |
| English | One and many | `fill-blank` (plural) | add -s · add -es · mice, feet, teeth, children, sheep |
| English | Opposites | `fill-blank` (opposite) | big/small… · heavy/light… · open/close, inside/outside… |
| English | a or an, is or are | `fill-blank` (article, is-are) | a/an · is/are · mixed |
| English | Spell it | `build` (letters) | 3 letters · 4 letters · 5 letters + a spare |
| English | Make a sentence | `build` (words) | 3 words · 4–5 words · 5–6 words + a spare |
| Puzzles | Mini crossword | `crossword` | 2 words, 3 blanks · 3 words, 4 blanks · 3 words, 6 blanks |
| Puzzles | Picture sudoku | `sudoku` (4×4) | 3 blanks · 6 blanks · 9 blanks |
| Thinking | What comes first? | `order-steps` | 2–3 steps · 4 steps · 4–5 steps |
| Thinking | Who am I? | `riddle` | 2 clues, very different pictures · 3 clues, look-alikes · 4 look-alikes |
| Thinking | Bigger mazes | `maze` | 5×5 · 6×6 · 7×7 |

Content lives in `src/words2.ts` (plurals, opposites, a/an nouns, is/are subjects, sentences), `src/thinking2.ts` (sequences, riddles), `src/time.ts` and `src/sudoku.ts`. The checker recomputes every answer:
- each clock label matches its hands;
- coins and notes add up;
- the place-value answer matches its blocks;
- skip-counting sequences go up by a constant step;
- each fill-blank answer follows its rule;
- build tiles spell the target;
- crossword clue squares are clear;
- each sudoku has exactly one solution;
- ordered steps match their sequence.

## Adaptive difficulty

A session is 10 puzzles. It starts at the easiest level that still has unsolved puzzles, moves **up a level after 3 first-try answers in a row**, and **down a level after 2 misses in a row**. Within a level, unsolved puzzles come before replays. The rules are in `packages/content/src/adaptive.ts`, and `npm test` covers them.

How play works: Each question is read aloud (with a 🔊 button to repeat it). A wrong pick wiggles and the child can try again. A star is earned only for a right answer on the first try. Stars, solved puzzles and the daily streak are saved on the device. Parent settings (progress, sound, change grade, reset) are behind a parent gate: a 2-digit × 1-digit question.

## Voice

Every question is read aloud in Indian English.

- **Now:** the app picks the best voice on each device. It prefers Indian English, then high-quality voices (iOS Enhanced, Android network, browser cloud voices), and falls back to British English. Speech is slightly slower and higher-pitched than normal, for children (`apps/mobile/src/lib/voice.ts`).
- **Recorded clips (optional, sounds much more natural):** `npm run voice -w packages/content` records one clip for every puzzle prompt and fixed phrase with Google Cloud Text-to-Speech (`en-IN-Neural2-A`). It needs `GOOGLE_TTS_API_KEY`. Clips go to `apps/mobile/assets/voice/` and are listed in `src/lib/voice-manifest.ts`. The app plays a clip when one exists and uses the device voice for anything else. Re-run it after adding puzzles; only new lines are recorded. Use `--sample 5` to audition a few clips first, and `--voice` / `--rate` / `--pitch` to change the voice.
- Spoken fixed lines ("Great job!", result messages) live in `packages/content/src/voice.ts`, so they get clips too. `npm test` checks the voice picker and adaptive difficulty.

## Adding content

Puzzles are data, not code. Each record in `packages/content/puzzles/**.json` looks like:

```json
{ "id": "g1-addition-03", "grade": 1, "subject": "maths", "topic": "g1-addition", "difficulty": 1,
  "prompt": "What is 2 plus 1?", "type": "arithmetic",
  "payload": { "a": 2, "op": "+", "b": 1, "item": "🎈" }, "options": [1, 3, 4], "answer": 3 }
```

- Edit or add records by hand, then run `npm run validate-content`. It checks ids are unique, the answer is one of the options, and the answer is actually correct (the sum adds up, the count matches, the pattern continues).
- `packages/content/scripts/generate-g1-maths.ts` made the first Grade 1 bank. Running it again **overwrites** `puzzles/g1-maths/`.
- New puzzle type: add it to `src/types.ts` and the validator, then add one renderer entry in `apps/mobile/src/components/puzzles/renderers.tsx`.
- New topic: add it to `TOPICS` in `src/curriculum.ts` and import its JSON in `src/index.ts`. Unlock a subject or grade in `AVAILABLE`.

## Screenshots

| Pick grade | Topics | Adding | Patterns | Result |
|---|---|---|---|---|
| ![](docs/screenshots/app-1-grades.png) | ![](docs/screenshots/app-3-topics.png) | ![](docs/screenshots/app-5-right.png) | ![](docs/screenshots/app-type-g1-patterns.png) | ![](docs/screenshots/app-6-result.png) |

| English topics | Picture words | Missing letter | First letters | Rhymes |
|---|---|---|---|---|
| ![](docs/screenshots/app-7-english-topics.png) | ![](docs/screenshots/app-8-picture-words.png) | ![](docs/screenshots/app-hard-g1-words.png) | ![](docs/screenshots/app-hard-g1-sounds.png) | ![](docs/screenshots/app-type-g1-rhymes.png) |

| Odd one out | Crossword | Sorting | Memory | Maze |
|---|---|---|---|---|
| ![](docs/screenshots/app-type-g1-odd-one-out.png) | ![](docs/screenshots/app-type-g1-crossword.png) | ![](docs/screenshots/app-type-g1-sorting.png) | ![](docs/screenshots/app-type-g1-memory.png) | ![](docs/screenshots/app-type-g1-mazes.png) |

### Grade 2

| Grades | Tens and ones | Time | Money | Equal groups |
|---|---|---|---|---|
| ![](docs/screenshots/g2-grades.png) | ![](docs/screenshots/g2-place-value.png) | ![](docs/screenshots/g2-time.png) | ![](docs/screenshots/g2-money.png) | ![](docs/screenshots/g2-groups.png) |

| One and many | Spell it | Make a sentence | Mini crossword | Sudoku |
|---|---|---|---|---|
| ![](docs/screenshots/g2-plurals.png) | ![](docs/screenshots/g2-spelling.png) | ![](docs/screenshots/g2-sentences.png) | ![](docs/screenshots/g2-crossword-19.png) | ![](docs/screenshots/g2-sudoku-start.png) |

| What comes first? | Who am I? | Bigger maze |
|---|---|---|
| ![](docs/screenshots/g2-order.png) | ![](docs/screenshots/g2-riddle.png) | ![](docs/screenshots/g2-maze.png) |
