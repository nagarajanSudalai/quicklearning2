import { SUBJECTS } from '../data';
import { appLink, useGrade } from '../grade-context';

export function SubjectBar() {
  const { grade } = useGrade();
  return (
    <section id="learning" className="container subjects">
      <div className="subjects__card">
        {SUBJECTS.map((s) => (
          <a key={s.name} href={appLink(grade, s.id)} className="subject">
            <span className="subject__tile" style={{ background: s.color }} aria-hidden>
              {s.glyph}
            </span>
            <span className="subject__text">
              <span className="subject__name">{s.name}</span>
              <span className="subject__desc">{s.desc}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
