import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

let hasMounted = false;

export function mountWeddingApp() {
  if (hasMounted) return;
  hasMounted = true;

  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  rootElement.replaceChildren();
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
