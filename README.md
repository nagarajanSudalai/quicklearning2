# QuickStep

Grade-wise puzzles and games for children in Grades 1–5. One codebase, three parts:

| Path | What it is |
|---|---|
| `apps/web` | Marketing homepage (React + Vite) |
| `apps/mobile` | The app — Expo / React Native for iOS, Android and web |
| `packages/content` | Shared puzzle bank (JSON), curriculum, puzzle types and design tokens |

See [ROADMAP.md](ROADMAP.md) for the phase plan. **Current status: Grades 1–5 are playable in all six subjects — Maths, English, Science, Puzzles, Thinking Skills (1,960 puzzles) and Practice & Tests — with adaptive difficulty.**

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

## Grade 3, NCERT/CBSE Class 3

17 topics, 20 puzzles each across 3 levels — 340 puzzles.

| Subject | Topic | Puzzle type | Levels |
|---|---|---|---|
| Maths | Numbers to 1000 | `place-value` (hundreds), `compare-numbers` | read the blocks · "How many hundreds/tens?" · <, =, > |
| Maths | Add and subtract | `arithmetic` | 3-digit, no carrying · carrying in one place · in two places |
| Maths | Times tables | `arithmetic` × | tables 2–5 · 6–9 · missing factor (? × 5 = 45) |
| Maths | Sharing equally | `arithmetic` ÷ | with pictures · numbers · word problems |
| Maths | Fractions | `fraction` | halves and quarters · thirds · "Which picture shows ¾?" |
| Maths | Time and calendar | `clock`, `calendar` | 5-minute times · days of the week · months and days in a month |
| Maths | Money and length | `money`, `measure` | totals with ₹100/₹200 · change · ruler in cm |
| English | Naming, doing, describing | `word-class` | nouns · verbs · adjectives |
| English | Past tense | `fill-blank` (past) | -ed · cried, stopped, danced · went, ate, swam |
| English | Synonyms and homophones | `fill-blank` (synonym, homophone) | same meaning · there/their, to/two/too · mixed |
| English | Spelling bee | `build` | 6 letters · 7 · 8 + a spare |
| English | Read and answer | `passage` | who · what · why |
| Puzzles | Clue crossword | `crossword` (text clues) | 3 words · 4 words · 4 words, 8 blanks |
| Puzzles | Sudoku 6×6 | `sudoku` | 8 blanks · 14 · 20 |
| Thinking | Logic grids | `logic-grid` | 2×2 · 3×3 with "has" clues · 3×3 with "does not have" clues |
| Thinking | Analogies | `analogy` | pictures · words · harder words |
| Thinking | Magic squares | `magic-square` | 2 blanks · 4 · 6 |

Content lives in:
- `src/words3.ts`: tagged sentences, past tense, synonyms, homophones, spelling words, passages.
- `src/thinking3.ts`: crossword clues, logic-grid sets, analogies.
- `src/calendar.ts`, `src/crossword.ts` (layout shared with Grade 2), `src/sudoku.ts` (4×4 and 6×6) and `src/logic.ts`.

The checker recomputes every answer:
- no wrong fraction equals the right one (1/2 vs 2/4);
- each sentence asks about a word class that appears exactly once;
- each logic grid and magic square has exactly one solution;
- each 6×6 sudoku has exactly one solution.

## Grade 4, NCERT/CBSE Class 4

17 topics, 20 puzzles each across 3 levels — 340 puzzles.

| Subject | Topic | Puzzle type | Levels |
|---|---|---|---|
| Maths | Large numbers | `place-value` (thousands, expanded), `compare-numbers` | thousands/hundreds · 3000 + 300 + 6 · compare 4-digit |
| Maths | Multiply and divide | `arithmetic` | 2-digit × 1-digit · 3-digit ÷ 1-digit · 2-digit × 2-digit |
| Maths | Factors and multiples | `pick-all` | multiples · factors · common multiples |
| Maths | Fractions | `fraction-op` | equivalent · bigger · add like fractions |
| Maths | Decimals | `decimal` | ₹ to paise · tenths on a bar · compare (0.3 vs 0.13) |
| Maths | Time | `clock`, `time-calc` | to the minute · 24-hour ↔ am/pm · how long |
| Maths | Area and perimeter | `grid-shape` | count squares · count edges · rectangle sides |
| English | Pronouns and adverbs | `word-class` | pronouns · adverbs · mixed |
| English | Tenses | `fill-blank` (future, continuous) | will play · is playing · mixed |
| English | Prefixes and suffixes | `fill-blank` (affix) | un-/re-/dis- · -ful/-less/-er · mixed |
| English | Word ladders | `word-ladder` | 2 steps · 3 steps · 3–4 steps |
| English | Read and think | `passage` | what · why · word meaning in context |
| Puzzles | Big crossword | `crossword` (text clues) | 4 words · 5 words · 5 words, 11 blanks |
| Puzzles | Hard sudoku | `sudoku` (6×6) | 18 blanks · 22 · 24 |
| Thinking | Logic grids | `logic-grid` | 3×3 · 3×3 "not" clues · 4×4 |
| Thinking | Number patterns | `number-pattern` (rules) | doubling · growing steps · squares |
| Thinking | Secret codes | `cipher` | A=1 codes · shift codes · write in code |

Content lives in `src/maths4.ts`, `src/words4.ts` and `src/thinking4.ts`. The checker:
- recomputes fractions exactly (cross-multiplying);
- recomputes area and perimeter from the shaded cells;
- requires each word-ladder step to offer exactly one valid one-letter move;
- rejects any number pattern that a constant step would also explain;
- re-encodes every code.

## Grade 5, NCERT/CBSE Class 5

17 topics, 20 puzzles each across 3 levels — 340 puzzles.

| Subject | Topic | Puzzle type | Levels |
|---|---|---|---|
| Maths | Numbers to 1 lakh | `place-value` (ten thousands), `compare-numbers` | read digits · expanded form · compare 5-digit |
| Maths | Big × and ÷ | `arithmetic` (with remainder) | 3-digit × 2-digit · 4-digit ÷ 1-digit · long division with remainder |
| Maths | Fractions | `fraction-op` | simplify · fraction of a number · add unlike fractions |
| Maths | Decimals | `decimal` | hundredths · add/subtract money · round to the nearest whole |
| Maths | Percentages | `percent` | shaded 10×10 grid · % of a number · sale price |
| Maths | Angles and area | `angle`, `grid-shape` | name the angle · measure it · triangle area |
| Maths | Bar charts | `chart` | read a bar · difference · total, most, least |
| English | Joining and position words | `fill-blank` | and/but/or · because/so · prepositions |
| English | Passive and reported speech | `fill-blank`, `build` | passive · reported speech · quotation marks |
| English | Idioms and proverbs | `idiom` | idioms · proverbs · idiom in a sentence |
| English | Tricky spellings | `fill-blank`, `build` | silent letters · -tion/-sion · commonly misspelt |
| English | Read and infer | `passage` | main idea · inference · best title |
| Puzzles | Crosswords | `crossword` (text clues) | 5 words · 6 words · 6 words, 13 blanks |
| Puzzles | Sum grids | `sum-grid` (3×3, digits 1–9) | 3 blanks · 5 · 7 |
| Thinking | Brain teasers | `teaser` | 1-step · 2-step · classic teasers |
| Thinking | Series and analogies | `analogy`, `number-pattern` | 2 : 4 :: 5 : ? · alternating steps · Fibonacci-like |
| Thinking | Logic and codes | `logic-grid`, `cipher` | 4×4 grids · A ↔ Z codes · write in code |

Content lives in `src/maths5.ts`, `src/words5.ts` and `src/thinking5.ts`. The checker:
- recomputes percentages, angles, chart answers, simplified fractions, rounding and remainders;
- brute-forces every sum grid so it has exactly one solution;
- re-runs each teaser's `solve()` where it has one.

## Science, Grades 1–5 (NCERT/CBSE EVS)

15 topics (3 per grade), 20 puzzles each across 3 levels — 300 puzzles.

| Grade | Topics |
|---|---|
| 1 | My body · Living and non-living · Animals around us |
| 2 | Plants · Food · Weather and seasons |
| 3 | Animal life (what animals eat) · Senses and body care · Air and water |
| 4 | Plants and food · Solids, liquids, gases and magnets · The water cycle |
| 5 | Body systems · Living world (food chains, habitats) · Earth and space |

New puzzle types:
- **`label-diagram`**: a drawn body, plant or water cycle. Level 1 marks one part with "?"; level 2 numbers every part and asks for one by name or by its job.
- **`science-quiz`**: a picture and a question.
- **`true-false`**: a picture and a statement.
- Sorting reuses `sort-into-groups`, with science groups such as living/non-living, floats/sinks, solid/liquid/gas and magnetic/non-magnetic.

All content lives in `src/science.ts` and is arranged by `scripts/generate-science.ts`. The checker looks every question and fact up in the bank for its topic, checks each diagram answer against the part list (numbers, names and jobs), and keeps science sorting groups apart from the odd-one-out categories.

## Practice & Tests

Each grade has a 10-question test for every subject with enough one-tap puzzles, plus a **Mixed test**:
- Maths, English and Science for every grade;
- Thinking Skills for Grades 4–5 (earlier grades' Thinking topics are mostly interactive).

How a test works:
- **Questions**: 3 easy, 4 medium and 3 tricky, spread across topics and drawn from the existing banks. Crosswords, sudoku, sorting and other interactive puzzles are left out.
- **One try per question**: a wrong answer is marked and the right one is shown. No stars are given.
- **Clock**: it counts up, with no time limit.
- **Report**: score, time taken, and one row per topic. Topics under two-thirds right link to "Practise →".
- **Parents**: parent settings lists recent tests and the topics that need practice.
- **Saving**: reports are stored on the device with the rest of the progress.

The logic is in `packages/content/src/tests.ts` (`testsFor`, `buildTest`, `scoreTest`). `npm test` checks every grade's tests (level mix, no repeats, the right bank) and the scoring.

## Parent accounts (Supabase)

Optional. Without an account the app works exactly as before, with progress kept on the device.

What a signed-in parent gets:
- **Sign-in**: an email address and a 6-digit code, with no password.
- **Children**: up to 4 profiles, each with a nickname and a grade.
- **Sync**: each child's stars, solved puzzles, streak and test reports are kept on every device.
- **Switching**: children switch profile on **Who's playing?** (from "Playing as … · Switch" on the grade screen) without the parent gate.
- **First child**: takes over whatever was already played on that device.
- **Merging**: progress is merged, never overwritten. Solved puzzles are combined, the higher star count is kept, and test reports are combined (`packages/content/src/sync.ts`).
- **Delete account**: removes the parent, every child profile and all synced progress.

How it's built:
- **Database**: `supabase/migrations/0001_parent_accounts.sql` creates the `children` and `progress` tables.
  - Row-level security means a parent only ever sees their own children.
  - A trigger caps each parent at 4 children.
  - `delete_my_account()` removes the parent and everything linked to them.
- **App**: `apps/mobile/src/lib/supabase.ts` and `lib/progress.tsx` handle sync, and the parent-settings UI is `components/AccountCard.tsx`.
- **Privacy**: the policy is at `/privacy.html`.

### Setup status
Done:
- The tables, security rules and functions are applied to the QuickStep Supabase project (migrations `0001`–`0002`).
- I checked that a parent can't see or change another parent's children and that a 5th child is blocked.
- The publishable key is in `apps/mobile/.env`, so accounts are switched on.

Still to do in the Supabase dashboard:
1. **Authentication → Emails → Magic Link**: put the code in the template body, e.g. `Your QuickStep code is {{ .Token }}`, so parents get a 6-digit code.
2. **Authentication → URL Configuration**: set the Site URL to `https://quicklearning2.vercel.app`.
3. Before launch, add your own SMTP provider under Authentication → SMTP. The built-in sender allows only a few emails an hour.

## Adaptive difficulty

A session is 10 puzzles. It starts at the easiest level that still has unsolved puzzles, moves **up a level after 3 first-try answers in a row**, and **down a level after 2 misses in a row**. Within a level, unsolved puzzles come before replays. The rules are in `packages/content/src/adaptive.ts`, and `npm test` covers them.

How play works: Each question is read aloud (with a 🔊 button to repeat it). A wrong pick wiggles and the child can try again. A star is earned only for a right answer on the first try. Stars, solved puzzles and the daily streak are saved on the device. Parent settings (progress, sound, change grade, reset) are behind a parent gate: a 2-digit × 2-digit question.

## Voice

Every question is read aloud in Indian English.

- **Now:** the app picks the best voice on each device. It prefers Indian English, then high-quality voices (iOS Enhanced, Android network, browser cloud voices), and falls back to British English. Speech is slightly slower and higher-pitched than normal, for children (`apps/mobile/src/lib/voice.ts`).
- **Recorded clips (optional, sounds much more natural):** `npm run voice -w packages/content` records one clip for every puzzle prompt and fixed phrase with Google Cloud Text-to-Speech (`en-IN-Neural2-A`). It needs `GOOGLE_TTS_API_KEY`. Clips go to `apps/mobile/assets/voice/` and are listed in `src/lib/voice-manifest.ts`. The app plays a clip when one exists and uses the device voice for anything else. Re-run it after adding puzzles; only new lines are recorded. Use `--sample 5` to audition a few clips first, and `--voice` / `--rate` / `--pitch` to change the voice.
- Spoken fixed lines ("Great job!", result messages) live in `packages/content/src/voice.ts`, so they get clips too. `npm test` checks the voice picker, speech rules, adaptive difficulty and the sudoku, logic-grid and magic-square solvers.

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

### Grade 3

| Subjects | Numbers | Fractions | Ruler | Sharing | Reading |
|---|---|---|---|---|---|
| ![](docs/screenshots/g3-subjects.png) | ![](docs/screenshots/g3-numbers.png) | ![](docs/screenshots/g3-fractions.png) | ![](docs/screenshots/g3-ruler.png) | ![](docs/screenshots/g3-sharing.png) | ![](docs/screenshots/g3-reading.png) |

| Word classes | Clue crossword | Sudoku 6×6 | Logic grid | Analogy | Magic square |
|---|---|---|---|---|---|
| ![](docs/screenshots/g3-word-class.png) | ![](docs/screenshots/g3-crossword.png) | ![](docs/screenshots/g3-sudoku.png) | ![](docs/screenshots/g3-logic.png) | ![](docs/screenshots/g3-analogy.png) | ![](docs/screenshots/g3-magic.png) |

### Grade 4

| Subjects | Expanded form | Fractions | Decimals | Time | Area | Factors |
|---|---|---|---|---|---|---|
| ![](docs/screenshots/g4-subjects.png) | ![](docs/screenshots/g4-numbers.png) | ![](docs/screenshots/g4-fractions.png) | ![](docs/screenshots/g4-decimals.png) | ![](docs/screenshots/g4-time.png) | ![](docs/screenshots/g4-area.png) | ![](docs/screenshots/g4-factors.png) |

| Tenses | Word ladder | Reading | Big crossword | Logic grid 4×4 | Codes | Patterns |
|---|---|---|---|---|---|---|
| ![](docs/screenshots/g4-tenses.png) | ![](docs/screenshots/g4-ladder.png) | ![](docs/screenshots/g4-reading.png) | ![](docs/screenshots/g4-crossword.png) | ![](docs/screenshots/g4-logic.png) | ![](docs/screenshots/g4-codes.png) | ![](docs/screenshots/g4-patterns.png) |

### Grade 5

| Thinking topics | Percent | Angles | Bar chart | Fractions | Idioms | Passive |
|---|---|---|---|---|---|---|
| ![](docs/screenshots/g5-topics.png) | ![](docs/screenshots/g5-percent.png) | ![](docs/screenshots/g5-angle.png) | ![](docs/screenshots/g5-chart.png) | ![](docs/screenshots/g5-fractions.png) | ![](docs/screenshots/g5-idioms.png) | ![](docs/screenshots/g5-voice.png) |

| Crossword | Sum grid | Brain teaser | Series | Codes |
|---|---|---|---|---|
| ![](docs/screenshots/g5-crossword.png) | ![](docs/screenshots/g5-sumgrid.png) | ![](docs/screenshots/g5-teaser.png) | ![](docs/screenshots/g5-series.png) | ![](docs/screenshots/g5-codes.png) |

### Science

| Topics | Label the part | Numbered diagram | True or false | Quiz | Sorting |
|---|---|---|---|---|---|
| ![](docs/screenshots/sci-topics.png) | ![](docs/screenshots/sci-label.png) | ![](docs/screenshots/sci-water-cycle.png) | ![](docs/screenshots/sci-true-false.png) | ![](docs/screenshots/sci-quiz.png) | ![](docs/screenshots/sci-sort.png) |

### Practice & Tests

| Tests | One try | Report | Parents |
|---|---|---|---|
| ![](docs/screenshots/tests-list.png) | ![](docs/screenshots/tests-question.png) | ![](docs/screenshots/tests-report.png) | ![](docs/screenshots/tests-parents.png) |

### Parent accounts

| Sign in | Children | Who's playing? |
|---|---|---|
| ![](docs/screenshots/account-signin.png) | ![](docs/screenshots/account-children.png) | ![](docs/screenshots/account-who.png) |
