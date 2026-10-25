import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// The built page is pre-rendered (scripts/seo.mjs); in dev it starts empty.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
