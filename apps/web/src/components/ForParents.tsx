const POINTS = [
  { icon: '👨‍👩‍👧', title: 'One account, up to 4 children', text: 'Sign in with your email — no password — and every child’s stars and progress stay the same on phone, tablet and computer.' },
  { icon: '📝', title: 'Tests with a report', text: '10-question tests for each subject show a score, the time taken and which topics need more practice.' },
  { icon: '📈', title: 'Grows with your child', text: 'Puzzles get harder after three right answers in a row and easier after two misses, so practice stays just right.' },
  { icon: '🛡️', title: 'Safe and ad-free', text: 'No ads, no tracking, no chat. We only keep a nickname and grade for each child, and you can delete everything any time.' },
];

export function ForParents() {
  return (
    <section id="parents" className="container parents">
      <div className="parents__head">
        <h2 className="discover__title">For Parents</h2>
        <p className="discover__lead">Follow your child’s learning without getting in the way.</p>
      </div>
      <div className="parents__grid">
        {POINTS.map((p) => (
          <div key={p.title} className="parents__card">
            <span className="parents__icon" aria-hidden>{p.icon}</span>
            <h3 className="parents__title">{p.title}</h3>
            <p className="parents__text">{p.text}</p>
          </div>
        ))}
      </div>
      <div className="parents__actions">
        <a href="/app/parents" className="btn-3d btn-explore">Open parent settings →</a>
        <a href="/privacy.html" className="parents__link">How we handle your data</a>
      </div>
    </section>
  );
}
