import { useState } from 'preact/hooks';

const messages = [
  'Welcome to the Tako static site template!',
  'Edit src/App.jsx and save to test hot module replacement.',
  'Use pnpm or npm to manage dependencies inside the Nix shell.',
];

export function App() {
  const [index, setIndex] = useState(0);

  const cycleMessage = () => {
    setIndex((index + 1) % messages.length);
  };

  return (
    <main className="app">
      <h1>Tako Static Site</h1>
      <p>{messages[index]}</p>
      <button type="button" onClick={cycleMessage}>
        Cycle message
      </button>
    </main>
  );
}
