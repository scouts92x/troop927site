# Troop 927 Website

Public website for **Troop 927** — a girl troop in Scouting America based in Rock Hill, SC.
Served at **troop927.org** and linked from **scouts92x.com**.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | Home page — welcome, program overview, meeting details, join call-to-action. |
| `events.html` | Calendar page — dynamically shows **current and upcoming** events only. |
| `css/styles.css` | Shared styles. |
| `js/main.js` | Navigation + footer year helper. |
| `js/events.js` | Event data **and** the render logic that filters to upcoming events. |
| `assets/logo.png` | Troop crest / favicon (Scouting America emblem, transparent background). |
| `staticwebapp.config.json` | Azure Static Web Apps routing config. |

## Updating the calendar

All events live in the `TROOP_EVENTS` array at the top of **`js/events.js`**. Each entry:

```js
{ start: "2026-09-25", end: "2026-09-27", title: "Campout: Kayaking", desc: "New River, Sparta, NC.", cat: "campout" }
```

- `start` (required) and optional `end` use `YYYY-MM-DD`.
- `cat` is one of: `meeting`, `campout`, `service`, `holiday`, `event` (controls the color + tag).
- The page renders only events whose final day is **today or later**, so past events drop off automatically. Visitors can click **Show past events** to reveal the full year.

No build step is required — it's plain HTML/CSS/JS.

## Hosting

Deployed on **Azure Static Web Apps** (scouts92x.com tenant) via GitHub Actions on push to `main`.

## Local preview

```powershell
npx http-server . -p 8080
# then open http://localhost:8080
```
