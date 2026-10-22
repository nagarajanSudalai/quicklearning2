import { useState, type CSSProperties } from 'react';
import { FLOATERS, GRADES, GRADE_COLORS, GRADE_NOTES, type Grade } from '../data';

const BADGES = [
  { label: 'Curriculum aligned', color: '#2fbf71' },
  { label: 'Fun & engaging', color: '#ff4f8b' },
  { label: 'Track progress', color: '#ff9a2e' },
  { label: 'Safe & ad-free', color: '#3b8cff' },
];

const RIBBONS = [
  { label: 'Learn', bg: '#ff9a2e', shadow: '#c46e14', rot: '-3deg' },
  { label: 'Play', bg: '#3b8cff', shadow: '#2163c4', rot: '2deg' },
  { label: 'Practice', bg: '#9a5cf0', shadow: '#6c37bd', rot: '-2deg' },
  { label: 'Grow', bg: '#2fbf71', shadow: '#1f8a50', rot: '3deg' },
];

export function Hero({ animations }: { animations: boolean }) {
  const [grade, setGrade] = useState<Grade>(1);

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            Make Learning an <span style={{ color: '#4b3fe0' }}>Adventure</span>
          </h1>
          <p className="hero__lead">Interactive lessons, fun games, puzzles and real-world learning for Grades 1 to 5.</p>
          <div className="grade-picker">
            <span className="eyebrow">Pick your grade</span>
            <div className="grade-picker__buttons" role="group" aria-label="Pick your grade">
              {GRADES.map((g) => (
                <button
                  key={g}
                  className="grade-btn"
                  aria-pressed={grade === g}
                  style={{ '--c': GRADE_COLORS[g] } as CSSProperties}
                  onClick={() => setGrade(g)}
                >
                  Grade {g}
                </button>
              ))}
            </div>
            <span className="grade-picker__note" aria-live="polite">
              {GRADE_NOTES[grade]}
            </span>
          </div>
          <div className="badges">
            {BADGES.map((b) => (
              <span key={b.label} className="badge">
                <span className="badge__dot" style={{ background: b.color }} />
                {b.label}
              </span>
            ))}
          </div>
          <div>
            <a href="/app/" className="btn-3d btn-explore">Explore the App →</a>
          </div>
        </div>

        <div className="hero__art">
          {FLOATERS.map((f, i) => (
            <span
              key={i}
              aria-hidden
              className="floater"
              style={
                {
                  left: f.l,
                  top: f.tp,
                  color: f.c,
                  '--r': f.r,
                  transform: `rotate(${f.r})`,
                  animation: animations ? `bob 3.2s ${f.d}s ease-in-out infinite` : 'none',
                } as CSSProperties
              }
            >
              {f.t}
            </span>
          ))}
          {/* TODO: replace with the real hero illustration */}
          <div className="placeholder hero__placeholder">
            <span>hero illustration — kids + robot mascot hopping number stepping-stones</span>
          </div>
          <div className="ribbons">
            {RIBBONS.map((r) => (
              <span key={r.label} className="ribbon" style={{ background: r.bg, boxShadow: `0 4px 0 ${r.shadow}`, transform: `rotate(${r.rot})` }}>
                {r.label}
              </span>
            ))}
          </div>
          <div className="hero__bubble">Small steps every day lead to big results!</div>
        </div>
      </div>
    </section>
  );
}
