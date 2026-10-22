const NAV = ['Home', 'Learning', 'Games', 'Practice', 'Discover', 'For Parents'];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="logo">
          <span className="logo__word">
            Min<span style={{ color: '#ff7a3d' }}>d</span>or<span style={{ color: '#ff4f8b' }}>a</span>
          </span>
          <span className="logo__tagline">Learn · Think · Discover</span>
        </div>
        <nav className="main-nav">
          {NAV.map((item, i) => (
            <a key={item} href="#" className={i === 0 ? 'nav-link nav-link--active' : 'nav-link'} aria-current={i === 0 ? 'page' : undefined}>
              {item}
            </a>
          ))}
        </nav>
        <button className="btn-3d btn-get-app">Get the App</button>
      </div>
    </header>
  );
}
