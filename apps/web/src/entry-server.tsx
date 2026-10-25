/* oxlint-disable react/only-export-components -- build-time entry, not a hot-reloaded module */
// Server-side entry used only at build time: renders the homepage to HTML so search engines and
// link previews see real content, and exposes the curriculum for the generated grade pages.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.tsx';

export const render = () => renderToString(<StrictMode><App /></StrictMode>);
export { GRADES, GRADE_NOTES, SUBJECTS, TOPICS, isAvailable } from '@quickstep/content';
