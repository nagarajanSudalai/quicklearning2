import { useState } from 'react';
import { POSTS, TABS, TAGS, type Tab } from '../data';

export function Discover() {
  const [tab, setTab] = useState<Tab>('All');
  const posts = POSTS.filter((x) => tab === 'All' || x.cat === tab);

  return (
    <section id="discover" className="container discover">
      <div className="discover__head">
        <div>
          <h2 className="discover__title">Discover, Learn Beyond the App</h2>
          <p className="discover__lead">Stay updated with exam news, study tips, parenting guides and more.</p>
        </div>
        <div className="tabs" role="group" aria-label="Filter articles">
          {TABS.map((t) => (
            <button key={t} className="tab" aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="posts">
        {posts.map((x) => {
          const [tagBg, tagFg, tagLabel] = TAGS[x.cat];
          return (
            <a key={x.title} href={`/articles/${x.slug}.html`} className="post">
              <span className="post__thumb" style={{ background: x.bg }}>
                <img src={x.img} alt="" width={400} height={400} />
              </span>
              <span className="post__body">
                <span className="post__tag" style={{ background: tagBg, color: tagFg }}>
                  {tagLabel}
                </span>
                <span className="post__title">{x.title}</span>
                <span className="post__desc">{x.desc}</span>
                <span className="post__when">{x.when}</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
