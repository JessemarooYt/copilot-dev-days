# Copilot Instructions for Mona Mayhem

## Project Overview

**Mona Mayhem** is a GitHub Contribution Battle Arena — a retro arcade-themed web application built with Astro that displays and compares GitHub contribution graphs of two users.

This is a **workshop template** designed for learning GitHub Copilot workflows. The application is intentionally incomplete; participants follow workshop guides to build features using Copilot in either VS Code or CLI mode.

## Tech Stack

- **Framework**: Astro v5 (file-based routing)
- **Runtime**: Node.js with @astrojs/node adapter
- **Language**: TypeScript (Astro uses strict tsconfig)
- **Styling**: Currently vanilla CSS (retro gaming theme — Press Start 2P font)
- **API Integration**: GitHub contribution graph endpoint (https://github.com/{username}.contribs)

## Build & Development

### Commands

- `npm run dev` — Start Astro development server (hot reload on changes)
- `npm run build` — Build for production (outputs to `dist/`)
- `npm run preview` — Preview production build locally
- `npm run astro` — Direct access to Astro CLI for additional commands

### File Structure

- **src/pages/** — Astro file-based routing
  - `index.astro` — Homepage
  - `api/contributions/[username].ts` — Dynamic API endpoint for fetching user contribution data
- **src/** — All other components and utilities go here (can be created as needed)
- **astro.config.mjs** — Astro configuration (using Node.js adapter, server output mode)
- **tsconfig.json** — TypeScript config (extends Astro's strict preset)

### Development Notes

- **Server-side rendering**: `output: 'server'` in astro.config.mjs means routes are rendered on request
- **Dynamic routes**: Use bracket notation (e.g., `[username].ts`) for parameterized endpoints
- **Astro components**: Mix HTML, CSS, and JavaScript in `.astro` files using frontmatter syntax (code above `---` separator)
- **API routes**: Export `APIRoute` handlers in `src/pages/api/` to create backend endpoints

## Architecture Patterns

### GitHub Contribution Data Endpoint

The API endpoint at `src/pages/api/contributions/[username].ts` should:
- Accept a username as a path parameter
- Fetch data from GitHub's contribution endpoint (https://github.com/{username}.contribs)
- Return JSON with contribution data
- Handle CORS restrictions (client-side requests can't fetch directly from GitHub)
- Include error handling for invalid usernames, rate limiting, or network errors

**API Pattern**: Route parameters are extracted from the URL and available via `params` in the APIRoute context.

### Error Handling

Endpoints should return appropriate HTTP status codes:
- `200` for successful responses
- `404` for not found (invalid username)
- `429` for rate limiting
- `500` for server errors
- `501` for not yet implemented features

### Caching Strategy (if implemented)

Consider caching contribution data to reduce API calls to GitHub. Common approaches:
- In-memory cache with TTL
- Request deduplication (multiple simultaneous requests for same user)
- Cache invalidation strategy (e.g., 1 hour TTL per user)

## Workshop Context

This repository includes a multi-part workshop (in `workshop/` directory):
- **Part 00**: Overview and track selection
- **Part 01**: Setup & Context Engineering
- **Part 02**: Plan & Scaffold (plan the API and page architecture)
- **Part 03**: Build the Game (agentic implementation)
- **Part 04**: Design & Theming
- **Part 05**: Polish & Parallel Work
- **Part 06**: Bonus Features

Participants should follow the workshop guides sequentially. When assisting with workshop tasks, reference the relevant section.

## Key Conventions

- **Frontmatter in Astro files**: Use `---` separators at the top of `.astro` files
- **TypeScript**: Strict mode is enforced; use proper type annotations
- **API responses**: Always include `Content-Type: application/json` header for JSON endpoints
- **Status codes**: Use proper HTTP status codes to indicate outcome of API calls
- **TODOs**: Incomplete implementations are marked with `// TODO` comments (see `[username].ts`)

## Common Tasks

### Implementing an API Endpoint

1. Create/update file in `src/pages/api/`
2. Export `GET`, `POST`, etc. as `APIRoute` function
3. Use `params` to extract route parameters
4. Use `new Response()` to return data with appropriate status and headers

### Adding a New Page

1. Create `src/pages/yourpage.astro`
2. Astro automatically creates route based on file location
3. Nested folders map to nested routes (e.g., `pages/game/arena.astro` → `/game/arena`)

### Debugging

- Check browser console and terminal logs (dev server runs in foreground)
- Use `npm run astro` to run Astro CLI directly for diagnostics
- Production builds are in `dist/` after running `npm run build`

## Testing & Browser Automation

### No Automated Tests Yet

This workshop template doesn't include automated tests. If adding tests, place them in a `tests/` or `__tests__/` directory and update this guide.

### MCP Servers

**Playwright MCP Server** is configured for browser automation and testing:
- Enables Copilot to control and test the application in a real browser
- Useful for validating UI behavior, comparing contribution graphs visually, and testing arcade game mechanics
- Can take screenshots, interact with elements, and verify visual appearance
- Particularly helpful for the design/polish phases (parts 04-05 of the workshop)
