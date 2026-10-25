// Runs after the full build (root `npm run build`): pre-renders the homepage, writes one landing
// page per class, fills in the site address, and writes sitemap.xml and robots.txt.
//   SITE_URL=https://www.example.com node apps/web/scripts/seo.mjs
// SITE_URL is the only thing to change when the real domain is ready.
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WEB = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(WEB, 'dist');
const SITE = (process.env.SITE_URL || 'https://quicklearning2.vercel.app').replace(/\/$/, '');
const VERIFY = process.env.GOOGLE_SITE_VERIFICATION;
const TODAY = new Date().toISOString().slice(0, 10);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ssr = await import(pathToFileURL(join(WEB, 'dist-ssr', 'entry-server.js')).href);

// 1. Pre-render the homepage.
const indexPath = join(DIST, 'index.html');
writeFileSync(indexPath, readFileSync(indexPath, 'utf8').replace('<!--app-->', ssr.render()));

// 2. One landing page per class, listing every topic with a link into the app.
const SUBJECT_INTRO = {
  maths: 'Numbers, operations, fractions, time, money and shapes — practised as puzzles.',
  english: 'Reading, phonics, vocabulary, grammar and spelling.',
  science: 'EVS and science: living things, our body, plants, water, matter and space.',
  coding: 'Block coding with a robot: sequences, debugging, loops, conditions and functions — no typing needed.',
  robotics: 'How robots work: parts, sensors, power, circuits and robot missions.',
  puzzles: 'Crosswords, sudoku and number grids.',
  thinking: 'Logic, patterns, riddles and brain teasers.',
};
const page = ({ title, description, path, body, jsonld }) => `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${SITE}${path}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${SITE}${path}" />
<meta property="og:image" content="${SITE}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/articles/article.css" />
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<header><div class="bar"><a class="logo" href="/">Quick<span>S</span>te<span>p</span></a><a class="back" href="/app/">Open the app</a></div></header>
<main>
${body}
</main>
<footer>${ssr.GRADES.map((g) => `<a href="/class-${g}/">Class ${g}</a>`).join(' · ')} · <a href="/articles/">Articles</a> · <a href="/privacy.html">Privacy</a></footer>
</body>
</html>
`;
const pages = [];
for (const g of ssr.GRADES) {
  const subjects = ssr.SUBJECTS.filter((s) => s.id !== 'practice' && ssr.isAvailable(g, s.id));
  const sections = subjects.map((s) => {
    const topics = ssr.TOPICS.filter((t) => t.grade === g && t.subject === s.id);
    return `<h2>Class ${g} ${esc(s.name)}</h2>
<p>${esc(SUBJECT_INTRO[s.id] ?? s.desc)}</p>
<ul class="list">${topics.map((t) => `<li><a href="/app/play/${t.id}"><strong>${esc(t.title)}</strong>${esc(t.blurb)} · 20 puzzles, 3 levels</a></li>`).join('')}</ul>`;
  }).join('\n');
  const names = subjects.map((s) => s.name);
  const title = `Class ${g} Learning Games: ${names.slice(0, 3).join(', ')} & More | QuickStep`;
  const description = `Free practice for Class ${g} (Grade ${g}) — ${names.join(', ')}. NCERT/CBSE aligned puzzles, games and tests that adapt to your child. No ads.`;
  const path = `/class-${g}/`;
  const body = `<span class="tag" style="background:#eeebff;color:#3b2fd0">CLASS ${g}</span>
<h1>Class ${g} learning games and practice</h1>
<p class="lead">For ${esc(ssr.GRADE_NOTES[g].replace(/^Grade \d · /, ''))} Every topic has 20 puzzles across 3 levels, and the app moves your child up or down a level as they go.</p>
<p><a class="cta" href="/app/grade/${g}">Start Class ${g} in the app</a></p>
${sections}
<h2>Practice tests for Class ${g}</h2>
<p>Ten-question tests for each subject show a score, the time taken and which topics need more practice — handy before school assessments.</p>
<p><a class="cta" href="/app/grade/${g}/practice">Take a Class ${g} test</a></p>`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: `Class ${g}`, item: `${SITE}${path}` }] },
      { '@type': 'Course', name: `Class ${g} learning games and practice`, description, provider: { '@type': 'Organization', name: 'QuickStep', sameAs: `${SITE}/` }, educationalLevel: `Class ${g}`, inLanguage: 'en-IN', isAccessibleForFree: true, hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT15M' } },
    ],
  };
  mkdirSync(join(DIST, `class-${g}`), { recursive: true });
  writeFileSync(join(DIST, `class-${g}`, 'index.html'), page({ title, description, path, body, jsonld }));
  pages.push(path);
}

// 3. Fill in the site address everywhere (homepage, articles, privacy, grade pages).
const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) return f === 'app' ? [] : htmlFiles(p);
  return f.endsWith('.html') ? [p] : [];
});
for (const f of htmlFiles(DIST)) {
  let s = readFileSync(f, 'utf8').replaceAll('__SITE_URL__', SITE);
  if (VERIFY) s = s.replace('<!-- __SEARCH_CONSOLE__ -->', `<meta name="google-site-verification" content="${esc(VERIFY)}" />`);
  writeFileSync(f, s);
}

// 4. The app's screens are for playing, not for search results.
const appIndex = join(DIST, 'app', 'index.html');
if (existsSync(appIndex)) {
  const s = readFileSync(appIndex, 'utf8');
  if (!s.includes('name="robots"')) writeFileSync(appIndex, s.replace('<head>', '<head><meta name="robots" content="noindex, follow" />'));
}

// 5. Sitemap and robots.txt.
const urls = ['/', ...pages, '/articles/', ...readdirSync(join(DIST, 'articles')).filter((f) => f.endsWith('.html') && f !== 'index.html').map((f) => `/articles/${f}`), '/privacy.html'];
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><changefreq>${u === '/' || u.startsWith('/class-') ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : u.startsWith('/class-') ? '0.9' : '0.6'}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /app/

Sitemap: ${SITE}/sitemap.xml
`);

rmSync(join(WEB, 'dist-ssr'), { recursive: true, force: true });
console.log(`SEO: ${SITE} · homepage pre-rendered · ${pages.length} class pages · ${urls.length} URLs in sitemap · ${relative(WEB, DIST)}`);
