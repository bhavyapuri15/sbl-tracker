<div align="center">

# SBL Tracker

**Science-Based Lifting + Nutrition — all in one app.**

Track workouts, rank your strength, log food, and get intelligent coaching suggestions powered by exercise science.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sbl--tracker--app.vercel.app-b0f060?style=for-the-badge&logo=vercel&logoColor=black)](https://sbl-tracker-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

</div>

---

## Screenshots

<table>
  <tr>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>Workout Logger</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/dashboard.png" alt="Dashboard" width="400"/></td>
    <td><img src="docs/screenshots/workout.png" alt="Workout Logger" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>Strength Progress</b></td>
    <td align="center"><b>Nutrition</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/progress.png" alt="Progress" width="400"/></td>
    <td><img src="docs/screenshots/nutrition.png" alt="Nutrition" width="400"/></td>
  </tr>
</table>

---

## Features

### Workout Tracking
- Log sets with weight, reps, and RPE
- Auto-detects personal records (e1RM via Epley formula)
- Split recommender (Full Body / Upper-Lower / PPL / Bro Split) with science-backed volume targets
- Rest timer with haptic feedback
- Offline-first — sets queue locally and sync when connection returns

### Strength Ranking
- e1RM charts per exercise (30-day history)
- Tier badges: Beginner → Novice → Intermediate → Advanced → Elite
- Animated anatomical muscle map showing weekly volume per muscle group
- MEV / MAV / MRV volume landmarks (Renaissance Periodization methodology)

### Nutrition
- Daily macro rings (calories, protein, carbs, fat)
- Food logging by meal slot (breakfast / lunch / dinner / snacks)
- TDEE computed from Mifflin-St Jeor BMR + activity level
- Goal-aware targets (cut / maintain / bulk)

### Intelligence Layer
- **Stall detection** — flags lifts flat for 15+ days, suggests deload after 6 weeks
- **Volume warnings** — alerts when any muscle exceeds MRV or falls below MEV
- **Calorie drift** — linear regression on 14-day weight trend, suggests calorie adjustment to stay on goal

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email + Google OAuth) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 |
| Charts | Recharts 3 |
| State | Zustand (offline queue) + TanStack Query |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project
- (Optional) Google OAuth credentials for social login

### 1. Clone and install

```bash
git clone https://github.com/bhavyapuri15/sbl-tracker.git
cd sbl-tracker
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database

Run the SQL files in your Supabase SQL editor:

```
supabase/migrations/   ← schema (tables, RLS policies)
supabase/seed/         ← exercise library + volume landmarks
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

```
profiles            user bio, goal, activity level
workout_sessions    training sessions
workout_exercises   exercises within a session
workout_sets        individual sets (weight, reps, RPE)
personal_records    best e1RM per exercise
exercises           exercise library (150+ movements)
body_metrics        weight, height, measurements log
nutrition_goals     TDEE-computed macro targets
food_entries        daily food log
strength_standards  tier thresholds by sex + bodyweight
volume_landmarks    MEV/MAV/MRV per muscle group
```

---

## Architecture Notes

- **Server components** handle all Supabase queries — no client-side data fetching for page loads
- **Server actions** handle all mutations (log set, add food, save profile)
- **Offline queue** (`src/stores/pendingQueue.ts`) buffers mutations in localStorage when offline, flushed on `online` event
- **Service worker** (`public/sw.js`) caches the app shell; network-first for API/Supabase calls
- **e1RM** computed via Epley formula in `src/lib/e1rm.ts`
- **TDEE** via Mifflin-St Jeor BMR in `src/lib/nutrition.ts`
- **Suggestions** computed server-side on every dashboard load in `src/lib/suggestions.ts`

---

## Inspiration

Built as a personal alternative to juggling Hevy (workout logging), StrengthLevel (strength ranking), and MacroFactor (nutrition). One app, one dark theme, science-backed throughout.

---

<div align="center">
  Built with Next.js + Supabase
</div>
