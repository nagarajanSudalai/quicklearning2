import { useEffect, useState } from 'react';
import { appLink, useGrade } from '../grade-context';

const SECTIONS = ['top', 'learning', 'discover', 'parents'] as const;

export function Header() {
  const { grade } = useGrade();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>('top');

  // Highlight the menu item for the section under the header (the last one whose top has scrolled past it).
  useEffect(() => {
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let id: string = SECTIONS[0];
      for (const s of SECTIONS) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top <= 120) id = s;
      }
      setCurrent(atBottom ? SECTIONS[SECTIONS.length - 1] : id);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const nav = [
    { label: 'Home', href: '#top', id: 'top' },
    { label: 'Learning', href: '#learning', id: 'learning' },
    { label: 'Games', href: appLink(grade, 'puzzles') },
    { label: 'Practice', href: appLink(grade, 'practice') },
    { label: 'Discover', href: '#discover', id: 'discover' },
    { label: 'For Parents', href: '#parents', id: 'parents' },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#top" className="logo" aria-label="QuickStep home">
          <span className="logo__word">
            Quick<span style={{ color: '#ff7a3d' }}>S</span>te<span style={{ color: '#ff4f8b' }}>p</span>
          </span>
          <span className="logo__tagline">Learn · Think · Discover</span>
        </a>
        <button className="menu-btn" aria-expanded={open} aria-controls="main-nav" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
        <nav id="main-nav" className={open ? 'main-nav main-nav--open' : 'main-nav'}>
          {nav.map((n) => {
            const active = n.id === current;
            return (
              <a key={n.label} href={n.href} className={active ? 'nav-link nav-link--active' : 'nav-link'} aria-current={active ? 'location' : undefined} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
