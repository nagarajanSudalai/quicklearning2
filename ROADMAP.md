# QuickStep roadmap

**Approach: grade-wise.** We finish one grade across its subjects before moving up. A Grade 1 child gets a complete app on day one, we can launch after one grade instead of five, and each later grade is mostly new content (data) on the same puzzle engine.

**Rule: one puzzle engine, content as data.** Every puzzle is a JSON record `{ id, grade, subject, topic, type, difficulty, prompt, payload, options, answer }`. Each `type` has one renderer. Adding a grade means adding data plus a few new types.

## Phase 0 — Foundation ✅
- npm workspaces: `apps/web` (homepage), `apps/mobile` (Expo app), `packages/content` (shared).
- Puzzle schema, content validator, shared design tokens.
- Expo Router screens: pick grade → subjects → topics → play → result, plus parent settings.
- `PuzzlePlayer` engine that renders any puzzle type and awards stars.

## Phase 1 — Grade 1, offline, no accounts
- **Maths ✅** — counting, adding, taking away, shapes, more/fewer, patterns (120 puzzles, 3 levels).
- **English ✅** — big & small letters, first letters, picture words (with missing letters), rhyming words (80 puzzles, 3 levels).
- **Puzzles ✅** — odd one out, picture crossword (40 puzzles).
- **Thinking Skills ✅** — sorting, memory pairs, mazes (60 puzzles).
- **Voice ✅** — best Indian English device voice; optional recorded natural voice (Google Cloud TTS en-IN) once an API key is added.
- Still to do: letter-sound puzzles (need recorded clips), mascot animation (Lottie/Rive) once art is ready, sound effects, internal test builds with EAS (TestFlight + Play internal track).

## Phase 2 — Accounts, progress and store launch
- Supabase: parent sign-up, up to 4 child profiles, progress synced across devices.
- Parent dashboard: time spent, topics done, weak areas.
- Compliance: COPPA / GDPR-K, Apple Kids category, Google Designed for Families. No ads, no third-party tracking, privacy policy.
- **Public launch with Grade 1.**

## Phase 3 — Grade 2 ✅
- NCERT/CBSE Class 2 order, all four subjects (340 puzzles):
  - **Maths:** place value, adding and taking away to 100, skip counting, equal groups (×), time, rupees.
  - **English:** plurals, opposites, a/an and is/are, spelling and sentence building.
  - **Puzzles:** 3-word mini crosswords, 4×4 picture sudoku.
  - **Thinking:** ordering steps, riddles, mazes up to 7×7.
- **Adaptive difficulty v1:** up a level after 3 first-try answers in a row, down after 2 misses in a row.

## Phase 4 — Science, Practice & Tests
- **Science ✅** — Grades 1–5, NCERT/CBSE EVS order, 3 topics per grade (300 puzzles): labelled diagrams (body, plant, water cycle), picture quizzes, true/false and sorting.
- **Practice & Tests ✅** — 10-question tests per subject plus a mixed test, for every grade: one try per question, a count-up clock, a per-topic report with "Practise →" links, and recent tests in parent settings.

## Phase 5 — Grades 3, 4 and 5
- **Grade 3 ✅** — NCERT/CBSE Class 3, all four subjects (340 puzzles):
  - **Maths:** numbers to 1000, 3-digit add/subtract, times tables, sharing (÷), fractions, time and calendar, money and length.
  - **English:** word classes, past tense, synonyms and homophones, spelling bee, reading comprehension.
  - **Puzzles:** text-clue crosswords, 6×6 sudoku.
  - **Thinking:** logic grids, analogies, magic squares.
- **Grade 4 ✅** — NCERT/CBSE Class 4, all four subjects (340 puzzles):
  - **Maths:** large numbers, multiply/divide, factors and multiples, fractions, decimals, 24-hour time, area and perimeter.
  - **English:** pronouns and adverbs, tenses, prefixes and suffixes, word ladders, reading.
  - **Puzzles:** 5-word crosswords, hard 6×6 sudoku.
  - **Thinking:** 4-person logic grids, number patterns, codes.
- **Grade 5 ✅** — NCERT/CBSE Class 5, all four subjects (340 puzzles):
  - **Maths:** numbers to 1 lakh, long division with remainders, fractions, decimals, percentages, angles, bar charts.
  - **English:** conjunctions and prepositions, passive and reported speech, idioms, tricky spellings, inference.
  - **Puzzles:** 6-word crosswords, 3×3 sum grids.
  - **Thinking:** brain teasers, series and analogies, logic grids and A ↔ Z codes.
- Spreadsheet → JSON importer so non-developers can add puzzles.

## Phase 6 — Growth
- Discover / articles section backed by a CMS.
- Subscriptions and family plan, school and teacher accounts, more languages.
