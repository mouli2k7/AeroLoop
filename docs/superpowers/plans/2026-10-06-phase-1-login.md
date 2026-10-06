# Phase 1: Login Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 1 of AeroLoop — a modern dark aerospace-themed simulated login portal with session persistence, persona quick-fill chips, and authenticated state readiness in a self-contained web app.

**Architecture:** Self-contained Single-Page Application (`aeroloop-mvp.html`) with embedded vanilla CSS design system and JavaScript `AppState` managing authentication and view transitions via `localStorage`. Accompanied by a lightweight `package.json` with a zero-config dev server.

**Tech Stack:** Vanilla HTML5, Vanilla CSS3 (Custom Properties, Glassmorphism, CSS Animations), Vanilla JavaScript (ES6+), Google Fonts (`Lora`, `Inter`), Node.js / `serve` or `live-server`.

**Spec:** `docs/superpowers/specs/2026-10-06-phase-1-login-design.md`

## Global Constraints
- App core must be contained in `aeroloop-mvp.html` and operable standalone via any web browser.
- Aesthetic: Modern dark aerospace theme (`#080d19` background, `#00e5ff` cyan glow accents, glassmorphic cards).
- Typography: Headings in `'Lora', serif`; Body in `'Inter', sans-serif`.
- Authentication is simulated (Wizard-of-Oz): accepts any non-empty credentials, zero backend required.
- Session persistence must survive page reloads via `localStorage` under `aeroloop_session`.

## Review Focus
1. Empty email submission: Form gracefully blocks submit and highlights missing input rather than crashing or storing blank session.
2. Direct reload while logged in: Page loads directly into the authenticated state without flashing the unauthenticated login card.
3. Sign out action: Clears `aeroloop_session` from `localStorage` and resets navbar and card smoothly back to the login state.
4. Demo Quick-Fill chips: Clicking "Dark Store Manager" or "Warehouse Ops" immediately fills inputs without triggering premature form submission.
5. Mobile viewport scaling: Card remains centered and readable on narrow viewports (375px) without horizontal overflow.

---

### Task 1: Project Scaffolding & Development Environment

**Files:**
- Create: `package.json`
- Test: Verification via Node assertion script

**Interfaces:**
- Produces: `npm run dev` and `npm start` commands to preview `aeroloop-mvp.html` locally.

- [ ] **Step 1: Write failing test script for project tooling**

Create a temporary check script `tests/check_scaffold.js`:
```javascript
const fs = require('fs');
const assert = require('assert');
assert(fs.existsSync('./package.json'), 'package.json must exist');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
assert(pkg.scripts && pkg.scripts.dev, 'scripts.dev must exist');
assert(pkg.scripts && pkg.scripts.start, 'scripts.start must exist');
console.log('Scaffold check passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/check_scaffold.js`
Expected: FAIL with "package.json must exist"

- [ ] **Step 3: Implement `package.json`**

Create `package.json` with project metadata, dev scripts, and `serve` dependency:
```json
{
  "name": "aeroloop-mvp",
  "version": "1.0.0",
  "description": "AeroLoop - Drone Delivery Booking MVP",
  "main": "aeroloop-mvp.html",
  "scripts": {
    "start": "npx -y serve -l 3000 -s .",
    "dev": "npx -y serve -l 3000 -s ."
  },
  "keywords": ["aeroloop", "drone-delivery", "mvp"],
  "author": "mouli2k7",
  "license": "ISC"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/check_scaffold.js`
Expected: PASS ("Scaffold check passed")
Remove temporary test file `tests/check_scaffold.js`.

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "chore: setup project package configuration and dev server script"
```

---

### Task 2: Core SPA Skeleton, Navbar & Dark Aerospace Design System

**Files:**
- Create: `aeroloop-mvp.html`

**Interfaces:**
- Produces: Base HTML document, CSS custom properties, navigation bar `#main-nav`, `#nav-user-status`, and empty screen container `#app-view`.

- [ ] **Step 1: Write verification test for base HTML layout**

Create `tests/check_base_layout.js`:
```javascript
const fs = require('fs');
const assert = require('assert');
assert(fs.existsSync('./aeroloop-mvp.html'), 'aeroloop-mvp.html must exist');
const html = fs.readFileSync('./aeroloop-mvp.html', 'utf8');
assert(html.includes('--bg-canvas: #080d19'), 'Must contain --bg-canvas token');
assert(html.includes('--accent-cyan: #00e5ff'), 'Must contain --accent-cyan token');
assert(html.includes('id="main-nav"'), 'Must contain #main-nav');
assert(html.includes('id="app-view"'), 'Must contain #app-view');
assert(html.includes('Lora'), 'Must import Lora font');
assert(html.includes('Inter'), 'Must import Inter font');
console.log('Base layout verification passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/check_base_layout.js`
Expected: FAIL with "aeroloop-mvp.html must exist"

- [ ] **Step 3: Implement base layout & CSS tokens in `aeroloop-mvp.html`**

Write standard HTML5 doctype in `aeroloop-mvp.html` with:
- `<head>`: Google Fonts preconnect and import for `Lora:wght@500;600;700` and `Inter:wght@400;500;600;700`.
- `<style>`:
  - Tokens: `--bg-canvas: #080d19`, `--glass-bg: rgba(15, 23, 42, 0.78)`, `--accent-cyan: #00e5ff`, `--accent-teal: #00b4d8`, `--border-cyan: rgba(0, 229, 255, 0.18)`, `--text-primary: #f8fafc`, `--text-muted: #94a3b8`, `--status-green: #10b981`.
  - Body: deep aerospace dark canvas with subtle radial backdrop grid pattern.
  - `#main-nav`: sticky top bar with logo (drone loop SVG mark), title "AeroLoop", badge "MVP • Phase 1", and `#nav-user-status`.
  - Container `#app-view`: flex centering wrapper with responsive padding.
- `<body>`: `#main-nav`, `#app-view`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/check_base_layout.js`
Expected: PASS ("Base layout verification passed")
Remove temporary test file `tests/check_base_layout.js`.

- [ ] **Step 5: Commit**

```bash
git add aeroloop-mvp.html
git commit -m "feat: implement base SPA layout, navigation bar, and aerospace dark design tokens"
```

---

### Task 3: Login View Component & Interactive Form Controls

**Files:**
- Modify: `aeroloop-mvp.html`

**Interfaces:**
- Consumes: `#app-view` container, CSS custom properties.
- Produces: `#screen-login`, `#login-form`, `#login-email`, `#login-password`, `.persona-chip`, `#btn-login-submit`.

- [ ] **Step 1: Write verification test for login elements**

Create `tests/check_login_dom.js`:
```javascript
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('./aeroloop-mvp.html', 'utf8');
assert(html.includes('id="screen-login"'), 'Must have #screen-login');
assert(html.includes('id="login-form"'), 'Must have #login-form');
assert(html.includes('id="login-email"'), 'Must have #login-email');
assert(html.includes('id="login-password"'), 'Must have #login-password');
assert(html.includes('id="btn-login-submit"'), 'Must have #btn-login-submit');
assert(html.includes('darkstore.hub4@aeroloop.io'), 'Must include Dark Store Manager demo chip');
assert(html.includes('fleet.central@aeroloop.io'), 'Must include Fleet Ops demo chip');
console.log('Login DOM verification passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/check_login_dom.js`
Expected: FAIL with "Must have #screen-login"

- [ ] **Step 3: Implement Login Card & Form in `aeroloop-mvp.html`**

Add `#screen-login` inside `#app-view`:
- Glowing radar drone icon animation (`@keyframes pulseRadar`).
- Header: "Drone Logistics Portal", subhead: "Autonomous dark-store resupply & aerial courier network".
- Form `#login-form`:
  - Email field (`#login-email`) with email SVG icon and placeholder.
  - Password field (`#login-password`) with lock SVG icon and toggle visibility button (`#btn-toggle-password`).
  - Demo Quick-Fill chips:
    - Chip 1: `data-email="darkstore.hub4@aeroloop.io"`: "Dark Store Manager"
    - Chip 2: `data-email="fleet.central@aeroloop.io"`: "Warehouse Fleet Ops"
  - Remember me checkbox (`#login-remember`).
  - Submit button (`#btn-login-submit`): "Enter Flight Portal →" with spinner container.
- Disclaimer badge: "Wizard-of-Oz Simulation • Any credentials accepted".
- CSS: Glassmorphic card styling, hover effects, input focus glow, chip micro-animations.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/check_login_dom.js`
Expected: PASS ("Login DOM verification passed")
Remove temporary test file `tests/check_login_dom.js`.

- [ ] **Step 5: Commit**

```bash
git add aeroloop-mvp.html
git commit -m "feat: add login card, persona quick-fill chips, and form controls"
```

---

### Task 4: Session State Management & Authenticated Operations Card

**Files:**
- Modify: `aeroloop-mvp.html`

**Interfaces:**
- Consumes: `#login-form`, `#btn-login-submit`, `#nav-user-status`.
- Produces: `window.AppState` with `session`, `login(email, password)`, `logout()`, `init()`, `#screen-authenticated`, `#btn-logout`, `#btn-proceed-phase2`.

- [ ] **Step 1: Write verification test for AppState and Authenticated Card**

Create `tests/check_auth_state.js`:
```javascript
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('./aeroloop-mvp.html', 'utf8');
assert(html.includes('id="screen-authenticated"'), 'Must have #screen-authenticated');
assert(html.includes('aeroloop_session'), 'Must reference localStorage key aeroloop_session');
assert(html.includes('AppState'), 'Must define AppState');
assert(html.includes('id="btn-logout"'), 'Must have #btn-logout');
assert(html.includes('id="btn-proceed-phase2"'), 'Must have #btn-proceed-phase2');
console.log('Auth state and operations view verification passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/check_auth_state.js`
Expected: FAIL with "Must have #screen-authenticated"

- [ ] **Step 3: Implement `AppState` logic and Authenticated Card**

In `aeroloop-mvp.html`:
1. HTML View `#screen-authenticated`:
   - Title: "Operations Command • Active Session".
   - Personalized welcome: "Welcome back, <span id='auth-user-name'>...</span>".
   - Fleet Readiness Metrics:
     - 3 / 3 Drones Available (Ready for BVLOS dispatch)
     - Weather: Clear • Wind 4 kt • Sector 4
     - Active Route Buffer: Warehouse ↔ Dark Store
   - CTAs:
     - Primary: "Proceed to Book Delivery (Phase 2)" (`#btn-proceed-phase2`).
     - Secondary: "Sign Out" (`#btn-logout`).
2. Script `<script>` block:
   - `AppState` object:
     - `session`: reads from `localStorage.getItem('aeroloop_session')`.
     - `login(email, password, remember)`: sets session, stores to `localStorage`, updates navbar, transitions view with 400ms spinner.
     - `logout()`: clears `localStorage`, resets form, updates navbar, transitions back to `#screen-login`.
     - `init()`: sets up event listeners on quick-fill chips, password toggle, form submit, logout button, and renders current state.
   - Setup `DOMContentLoaded` calling `AppState.init()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/check_auth_state.js`
Expected: PASS ("Auth state and operations view verification passed")
Remove temporary test file `tests/check_auth_state.js`.

- [ ] **Step 5: Commit**

```bash
git add aeroloop-mvp.html
git commit -m "feat: implement session state persistence, authenticated operations card, and sign out flow"
```

---

### Task 5: End-to-End Browser Flow Verification & Git Remote Sync

**Files:**
- Test: Functional verification using headless browser / agent inspection
- Push: `git push origin loop`

**Interfaces:**
- Validates the complete user journey:
  1. Login page loads unauthenticated with dark aerospace styling.
  2. Clicking "Dark Store Manager" quick-fills email & password.
  3. Clicking "Enter Flight Portal" shows spinner and transitions into authenticated operations card.
  4. Top navbar reflects user status with green active beacon and user email.
  5. Reloading page preserves authenticated session.
  6. Clicking "Sign Out" restores unauthenticated login card cleanly.

- [ ] **Step 1: Perform complete browser verification**

Open `aeroloop-mvp.html` via test script or browser agent, exercise all interactions, and verify zero console errors.

- [ ] **Step 2: Verify git status and push to remote**

```bash
git status
git push origin loop
```

Expected: Clean working tree and all commits pushed to GitHub `origin/loop`.
