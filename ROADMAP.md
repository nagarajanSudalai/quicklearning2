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
- English — letters & sounds, picture words, rhyming (`picture-word`, `letter-sound`).
- Puzzles — odd one out, 3×3 picture crossword (`odd-one-out`, `picture-crossword`).
- Thinking Skills — sorting, memory pairs, mazes (`sort-into-groups`, `memory-match`).
- Still to do: mascot animation (Lottie/Rive) once art is ready, sound effects, recorded voice prompts to replace text-to-speech, internal test builds with EAS (TestFlight + Play internal track).

## Phase 2 — Accounts, progress and store launch
- Supabase: parent sign-up, up to 4 child profiles, progress synced across devices.
- Parent dashboard: time spent, topics done, weak areas.
- Compliance: COPPA / GDPR-K, Apple Kids category, Google Designed for Families. No ads, no third-party tracking, privacy policy.
- **Public launch with Grade 1.**

## Phase 3 — Grade 2
- Reuse all Grade 1 types at higher levels.
- New types: `mini-crossword`, `number-pattern`, add/subtract within 100, `word-builder`.
- Adaptive difficulty v1: move up or down a level based on the last 5 answers.

## Phase 4 — Science, Practice & Tests (Grades 1–2)
- Science: `picture-quiz`, `true-false`, `label-the-picture`.
- Timed topic tests with a report for parents.

## Phase 5 — Grades 3, 4 and 5
- Grade 3: times tables, logic grids. Grade 4: fractions, sudoku 4×4/6×6, word ladders. Grade 5: decimals, brain teasers.
- Spreadsheet → JSON importer so non-developers can add puzzles.

## Phase 6 — Growth
- Discover / articles section backed by a CMS.
- Subscriptions and family plan, school and teacher accounts, more languages.
