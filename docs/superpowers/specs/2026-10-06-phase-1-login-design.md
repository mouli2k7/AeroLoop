# AeroLoop Phase 1 — Login Screen Design Specification

## Overview
AeroLoop is a Wizard-of-Oz drone delivery booking MVP built as a front-end-only web application. This specification defines **Phase 1: Login & Authentication Simulation**, providing an authentic entry point and session management for users before booking and tracking drone deliveries.

## Goals & Constraints
- **Primary Goal**: Validate the entry-point experience and user personalization flow for logistics managers.
- **Constraints**:
  - Front-end only: no real backend database, zero server requirements.
  - Accepts any email/password input while providing realistic feedback.
  - Single self-contained file (`aeroloop-mvp.html`) that works out-of-the-box in any web browser.
  - Modern dark aerospace aesthetic with cyan/teal glow accents.
  - Persists session state in browser `localStorage` across page refreshes.

---

## 1. Architecture & Directory Layout

```
AeroLoop/
├── aeroloop-mvp.html       # Self-contained SPA containing HTML, CSS, and JS
├── package.json            # Development scripts and local live-server dependency
├── package-lock.json
├── README.md               # Project documentation
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-10-06-phase-1-login-design.md
```

### Development Environment & Packages
- Node.js runtime with `package.json` providing:
  - `npm start` / `npm run dev`: spins up a local zero-config HTTP server (`live-server` or `serve`) with auto-reload on port 3000 / 8080.
- Standalone execution: `aeroloop-mvp.html` can also be opened directly via `file://` protocol with full functionality.

---

## 2. Design System & Aesthetics

### Visual Tone: Modern Aerospace Dark Mode
- **Canvas Base Background**: `#080d19` (deep midnight aerospace slate) with a subtle radial gradient accent (`rgba(0, 229, 255, 0.04)` to `rgba(15, 23, 42, 0.95)`).
- **Glassmorphic Surface**:
  - Background: `rgba(15, 23, 42, 0.78)`
  - Backdrop Blur: `blur(16px)`
  - Border: `1px solid rgba(0, 229, 255, 0.18)`
  - Box Shadow: `0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(0, 229, 255, 0.12)`
- **Color Palette**:
  - Primary Accent: Electric Cyan (`#00e5ff`)
  - Secondary Accent: Sky Teal (`#00b4d8`)
  - Button Gradient: `linear-gradient(135deg, #00e5ff 0%, #0077b6 100%)`
  - Text Primary: `#f8fafc`
  - Text Muted: `#94a3b8`
  - Text Subtle / Placeholders: `#64748b`
  - Online / Active Indicator: `#10b981` (emerald green)
  - Error Accent: `#f43f5e` (rose)
- **Typography**:
  - Headings: `'Lora', Georgia, serif`
  - Body & UI: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

---

## 3. Component & Screen Specifications

### Top Navigation Bar (`#main-nav`)
- **Brand Identity**:
  - AeroLoop Logo mark: Stylized SVG drone rotor / loop emblem.
  - Brand Title: "AeroLoop" (`Lora`, 20px, bold).
  - Version / Phase Tag: "MVP • Phase 1 (Simulated)".
- **Session Status Widget (`#nav-user-status`)**:
  - When logged out: Shows status badge "Offline • Demo Mode".
  - When logged in: Shows green pulsing status dot, user email/name, and a "Sign Out" button.

### Screen 1: Login View (`#screen-login`)
- **Hero / Card Header**:
  - Pulsing radar badge animation.
  - Title: *"Drone Logistics Portal"*
  - Subtitle: *"Autonomous dark-store resupply & aerial courier network"*
- **Login Form (`#login-form`)**:
  - **Email Field**:
    - Input type `email`, icon prefix `@`.
    - Real-time subtle focus glow.
    - Default placeholder: `ops@aeroloop.io`.
  - **Password Field**:
    - Input type `password`, lock icon prefix.
    - Show/Hide password toggle button.
    - Placeholder: `••••••••`.
  - **Remember Session**: Checkbox (default checked) to retain login across sessions.
  - **Quick-Fill Demo Personas**:
    - Chip 1: *"Dark Store Manager"* (`darkstore.hub4@aeroloop.io`)
    - Chip 2: *"Warehouse Fleet Ops"* (`fleet.central@aeroloop.io`)
    - Clicking a chip instantly populates email & password fields with a brief highlight pulse.
  - **Submit Button**:
    - Text: *"Enter Flight Portal →"*
    - Hover: Glow expansion & slight lift.
    - Active click: Brief spinner micro-animation (400ms) to simulate biometric/credential check, then transitions.
- **Transparency Notice**:
  - Subtext card: *"Wizard-of-Oz Simulation • Any credentials accepted for review and testing."*

### Screen 1 (Authenticated State): Welcome & Readiness Card
- When authenticated, the login card transitions into an operations summary card:
  - Header: *"Welcome back, [Display Name]"*
  - Active simulated metrics:
    - Fleet Status: `3 / 3 Drones Ready`
    - Weather / Airspace: `Clear • Wind 4 kt • BVLOS OK`
    - Hub: `Bengaluru Sector 4 Dark Store`
  - Call to Action: *"Proceed to Book Delivery (Phase 2)"* (dispatches to Phase 2 placeholder / prepares next phase).
  - Secondary Action: *"Sign Out"*, which resets state and returns to login form.

---

## 4. State Management & Data Flow

### State Object Schema
```javascript
const AppState = {
  session: {
    isAuthenticated: false,
    email: '',
    displayName: '',
    role: '',
    token: null,
    loggedInAt: null
  },
  currentScreen: 'login', // 'login' | 'book' | 'track' | 'history'
  init() { ... },
  login(email, password) { ... },
  logout() { ... },
  switchScreen(screenId) { ... }
};
```

### LocalStorage Persistence
- Key: `aeroloop_session`
- On page load, `AppState.init()` reads `localStorage.getItem('aeroloop_session')`. If present, automatically renders the authenticated state.
- `AppState.logout()` clears the key and transitions back to the unauthenticated login view.

---

## 5. Error Handling & Validation
- **Empty input handling**: If submitted without an email, displays a gentle cyan/red warning tooltip: *"Please provide an email address to continue"*.
- **Email format**: Accepts any valid string containing `@`.
- **Password**: Accepts any password (minimum 1 character) for smooth demo testing without lockouts.

---

## 6. Testing & Validation Plan
1. **Unauthenticated initial load**: Verify clean dark aerospace theme, logo, fonts, and login form rendered cleanly.
2. **Demo Quick-Fill**: Click persona chips and verify form inputs populate instantly.
3. **Authentication flow**: Submit form; verify spinner animation, smooth transition to authenticated card, and navbar status update.
4. **Session persistence**: Reload browser window; verify user remains logged in without re-entering credentials.
5. **Sign Out**: Click "Sign Out"; verify `localStorage` cleared, navbar resets, and login form is displayed.
6. **Responsiveness**: Verify card layout looks pristine on mobile screens (375px), tablets (768px), and desktops (1280px+).
