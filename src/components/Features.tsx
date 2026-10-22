import { PatternPuzzle } from './PatternPuzzle';

const POINTS = [
  { text: 'Age-appropriate content for Grades 1–5', color: '#2fbf71' },
  { text: 'Adaptive practice and personalized progress', color: '#2fbf71' },
  { text: 'Fun games that build core skills', color: '#2fbf71' },
  { text: 'Helpful resources for parents', color: '#3b8cff' },
];

export function Features({ animations }: { animations: boolean }) {
  return (
    <section className="container features">
      <div className="features__panel">
        <PatternPuzzle animations={animations} />
        <div className="features__copy">
          <h2 className="features__title">Learn, Play, Practice All in One Place</h2>
          <p className="features__lead">
            From interactive lessons to exciting puzzles and adaptive practice, Mindora keeps children engaged while building real skills.
          </p>
          <div className="features__points">
            {POINTS.map((pt) => (
              <span key={pt.text} className="point">
                <span className="point__check" style={{ background: pt.color }} aria-hidden>
                  ✓
                </span>
                {pt.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
