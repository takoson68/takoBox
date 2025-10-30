# Static Site Template

This template bootstraps a Vite-powered static site with sensible defaults for modern frontend development.

## Features

- Vite dev server with hot module replacement
- Preconfigured ESLint and Prettier for consistent code style
- Basic file structure with a single-page app entry point
- Nix shell for reproducible Node.js tooling

## Getting Started

```bash
npm install
npm run dev
```

If you are using Nix:

```bash
nix develop
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build output is placed in the `dist/` directory.
