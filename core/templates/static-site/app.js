import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState } from 'https://esm.sh/preact@10.19.2/hooks';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(h);

const messages = [
  'Welcome to the Tako static site template!',
  'Edit src/App.jsx and save to test hot module replacement.',
  'Use pnpm or npm to manage dependencies inside the Nix shell.',
];

function App() {
  const [index, setIndex] = useState(0);
  const cycleMessage = () => setIndex((index + 1) % messages.length);

  return html`<main class="app">
    <h1>Tako Static Site</h1>
    <p>${messages[index]}</p>
    <button type="button" onClick=${cycleMessage}>Cycle message</button>
  </main>`;
}

const container = document.getElementById('app');
render(html`<${App} />`, container);
