import { useState } from 'react';
import { puzzlesFor, type PatternPuzzle as Pattern, type ShapeKind } from '@quickstep/content';
import { Shape } from './Shape';

// The easiest pattern puzzles from the app's Grade 1 Maths bank.
const PUZZLES = (puzzlesFor('g1-patterns') as Pattern[]).filter((p) => p.difficulty === 1);

export function PatternPuzzle({ animations }: { animations: boolean }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<ShapeKind | null>(null);
  const [stars, setStars] = useState(12);

  const p = PUZZLES[round % PUZZLES.length];
  const correct = picked === p.answer;

  const pick = (k: ShapeKind) => {
    if (picked) return;
    setPicked(k);
    if (k === p.answer) setStars((s) => s + 1);
  };

  const next = () => {
    setRound((r) => r + 1);
    setPicked(null);
  };

  return (
    <div className="puzzle">
      <div className="puzzle__head">
        <span className="puzzle__title">What comes next?</span>
        <span className="puzzle__stars">★ {stars}</span>
      </div>

      <div className="puzzle__seq">
        {p.payload.seq.map((k, i) => (
          // keyed by round so the pop animation replays for each new puzzle
          <Shape key={`${round}-${i}`} kind={k} animation={animations ? `pop .4s ${i * 0.07}s both` : undefined} />
        ))}
        <span className="puzzle__blank" aria-label="missing shape">?</span>
      </div>

      <div className="puzzle__choices">
        {p.options.map((k) => {
          const state = picked === k ? (k === p.answer ? 'right' : 'wrong') : undefined;
          return (
            <button
              key={`${round}-${k}`}
              className="choice"
              data-state={state}
              disabled={!!picked}
              onClick={() => pick(k)}
            >
              <Shape kind={k} size={44} animation={state && animations ? (state === 'right' ? 'pop .4s both' : 'wiggle .35s 2') : undefined} />
            </button>
          );
        })}
      </div>

      <div className="puzzle__foot">
        <span
          key={`${picked}-${round}`}
          className="puzzle__feedback"
          aria-live="polite"
          style={{
            color: !picked ? '#6b6890' : correct ? '#1f8a50' : '#d6336c',
            animation: picked && animations ? 'pop .35s both' : 'none',
          }}
        >
          {!picked ? 'Tap the shape that comes next.' : correct ? 'Great job! +1 star' : 'Almost! Look at the pattern again.'}
        </span>
        <button className="puzzle__next" onClick={next}>
          New puzzle →
        </button>
      </div>
    </div>
  );
}
