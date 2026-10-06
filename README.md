# AeroLoop — Drone Delivery Booking MVP

A front-end-only prototype built to demonstrate the AeroLoop concept without the cost of building an actual drone: a Swiggy/Zomato-style web app where a customer can book a drone delivery, watch a simulated flight in real time, and view their order history.

**Live demo:** open `aeroloop-mvp.html` in any browser, or use the published artifact link shared alongside this file.

---

## 1. Why this exists

Building and flying a real drone for a college-stage MVP is expensive and regulatorily complex (BVLOS approval, hardware costs, pilot certification — see the venture's Milestone 1/2 decks for details). Instead, this MVP validates the **customer-facing experience** of the service first: can someone understand the offer, see a price quoted instantly, and follow a delivery from pickup to drop-off, the same way they already do on a food-delivery app?

This is a **Wizard-of-Oz / simulated MVP** — a recognized, legitimate way to test demand and usability before investing in physical infrastructure.

---

## 2. What's included — built in 4 phases

The MVP's four screens map naturally onto four phases, each one building on the last. This is useful both as a way to explain the build to your professor and as the actual order you'd re-build it in if you were starting from scratch.

### Phase 1 — Login
A simple email/password form. Accepts any input — there is no real authentication, no account database, and no password checking. Its only job is to give the app a natural entry point and a reason to show a personalized "logged in" state afterward.

### Phase 2 — Book a Delivery
The core transaction screen. The customer enters a pickup point, drop point, distance (km), and payload (kg), and sees the price update live as they type. This is the single most important screen to validate first — if people don't understand or trust the price, nothing downstream matters.

### Phase 3 — Flight Tracking (Simulation)
After booking, an animated drone icon flies along a curved flight path from pickup to drop, with status updates ("Dispatched" → "In flight" → "Arriving" → "Delivered") and a progress bar — simulating what a real tracking screen would show. This phase is what makes the experience feel like a real delivery app (Swiggy/Zomato-style) rather than just a quote form.

### Phase 4 — Order History
Every completed booking in the current browser is listed with route, payload, price, and timestamp, stored in `localStorage`. This closes the loop — a customer can see that their booking "happened" and build trust for repeat use.

| Phase | Screen | Primary purpose |
|---|---|---|
| 1 | Login | Entry point / personalization |
| 2 | Book a Delivery | Price validation — the core transaction |
| 3 | Flight Tracking | Experience & trust-building |
| 4 | Order History | Retention / repeat-use signal |

---

## 3. How pricing is calculated (demo formula)

```
Total = ₹300 base fee
      + (distance in km × ₹15)
      + (payload in kg × ₹20)
```

This mirrors the subscription + per-flight pricing model described in the venture's business model (see the Business Model Canvas / Lean Canvas slides) but simplified into a single instant quote for demo purposes. Payload is capped at 15 kg per flight, matching the drone specification used throughout the project.

---

## 4. How the "flight simulation" works

There is **no real drone, no live video feed, and no AI-generated video** — building or licensing that was out of scope for this MVP. Instead:

- The drone icon moves along a predefined SVG flight path using JavaScript animation (`requestAnimationFrame`), timed to match a sequence of status messages.
- The whole simulated flight takes about 7 seconds, standing in for the real 7–10 minute flight described in the pitch deck.
- This is intentionally presented to test users as "here's what the tracking experience would feel like" rather than claimed to be a real flight.

**Being transparent about this with your professor and test users is important** — a simulated experience is a valid MVP technique, but only if it isn't misrepresented as a working drone system.

---

## 5. What is NOT included (by design)

- ❌ No backend server or database — this is a single static HTML file.
- ❌ No real user accounts or authentication.
- ❌ No real drone hardware, flight data, GPS, or video feed.
- ❌ No payment processing.
- Order history is saved only in the current browser's `localStorage`, so it is private to that device/browser and will be lost if browser data is cleared. It is **not** shared between different users or devices.

---

## 6. Tech stack

- Plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.
- Google Fonts (Lora for headings, Inter for body text).
- Browser `localStorage` for session-level order history.

This keeps the MVP trivially easy to host (any static file host works) and easy for teammates to edit without needing a development environment.

---

## 7. How to test this with real users

Suggested lightweight validation plan (see the Milestone 2 deck's MVP Validation slide for the full template):

1. Share the live link with 5–10 people who fit the target persona (e.g., dark-store operations managers, or friends/classmates role-playing that persona).
2. Ask them to book a delivery without guidance and narrate their thoughts out loud.
3. Note where they hesitate, what price they expected, and whether the tracking screen felt believable.
4. Record results in the MVP Validation slide — do not present this document's content as real test results until that testing has actually happened.

---

## 8. Where this fits in the bigger picture

This MVP covers **Phase 1** of AeroLoop's roadmap (warehouse → dark store resupply). The same booking-and-tracking pattern shown here is designed to extend to later phases — medical logistics, insurance assessment, agriculture, and air ambulance — once the core experience is validated.

---

## 9. File structure

```
aeroloop-mvp.html   → the entire app (single self-contained file)
README.md           → this file
```

---

## 10. Credits

Built as the MVP deliverable for the AeroLoop venture, IEB Section C, Milestone 2.
