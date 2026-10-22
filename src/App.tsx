import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SubjectBar } from './components/SubjectBar';
import { Features } from './components/Features';
import { Discover } from './components/Discover';

export default function App({ animations = true }: { animations?: boolean }) {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero animations={animations} />
        <SubjectBar />
        <Features animations={animations} />
        <Discover />
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>© 2026 Mindora</span>
          <span className="site-footer__links">
            <a href="#">Privacy</a>
            <a href="#">For Schools</a>
            <a href="#">Contact</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
