# Node Service Template

This template provides a production-ready Express server with sensible tooling and configuration managed via Nix.

## Features

- Express 5 server with health and metrics endpoints
- Nodemon-powered development server with automatic reloads
- Jest test setup with supertest
- Environment variable management through dotenv
- Nix flake for reproducible toolchains

## Usage

```bash
npm install
npm run dev
```

Run tests with:

```bash
npm test
```

Build a production bundle with:

```bash
npm run build
npm start
```
