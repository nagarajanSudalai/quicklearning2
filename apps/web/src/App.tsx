import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SubjectBar } from './components/SubjectBar';
import { Features } from './components/Features';
import { Discover } from './components/Discover';
import { ForParents } from './components/ForParents';
import { GradeProvider } from './grade';

export default function App({ animations = true }: { animations?: boolean }) {
  return (
    <GradeProvider>
    <div className="page" id="top">
      <Header />
      <main>
        <Hero animations={animations} />
        <SubjectBar />
        <Features animations={animations} />
        <Discover />
        <ForParents />
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>© 2026 QuickStep</span>
          <span className="site-footer__links">
            {[1, 2, 3, 4, 5].map((g) => <a key={g} href={`/class-${g}/`}>Class {g}</a>)}
            <a href="/privacy.html">Privacy</a>
            <a href="#parents">For Parents</a>
            <a href="/articles/">Articles</a>
          </span>
        </div>
      </footer>
    </div>
    </GradeProvider>
  );
}
