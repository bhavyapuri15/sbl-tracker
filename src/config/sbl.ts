/**
 * Science-Based Lifting (SBL) configuration.
 * All tunable thresholds and scientific constants live here.
 * Change a value, the whole app updates — no code hunts required.
 *
 * Sources:
 *  - Epley (1985) and Brzycki (1993) for e1RM
 *  - Mifflin & St Jeor (1990) for BMR
 *  - Israetel et al., "Scientific Principles of Hypertrophy Training" (2019) for volume landmarks
 *  - StrengthLevel.com for strength standards (used under research/educational use)
 */

export const SBL = {
  // ── e1RM ────────────────────────────────────────────────────────────
  e1rm: {
    defaultFormula: "epley" as "epley" | "brzycki",
    // Reliability drops above 12 reps — flag in UI
    maxReliableReps: 12,
  },

  // ── Activity multipliers (Mifflin-St Jeor TDEE) ─────────────────────
  activityFactors: {
    sedentary:   1.2,    // desk job, no exercise
    light:       1.375,  // 1-3 days/week light exercise
    moderate:    1.55,   // 3-5 days/week moderate exercise
    active:      1.725,  // 6-7 days/week hard exercise
    very_active: 1.9,    // twice/day or very hard physical job
  } as Record<string, number>,

  // ── Nutrition targets ────────────────────────────────────────────────
  protein: {
    minGPerKg:     1.6,
    maxGPerKg:     2.2,
    defaultGPerKg: 2.0,
  },
  fat: {
    minGPerKg:     0.5,
    maxGPerKg:     0.8,
    defaultGPerKg: 0.7,
  },

  // ── Goal calorie adjustments ─────────────────────────────────────────
  goals: {
    cut: {
      deficitPctMin:    10,
      deficitPctMax:    25,
      deficitPctDefault: 15,
      targetKgPerWeek:  -0.5,
    },
    maintain: {
      deficitPctMin:    0,
      deficitPctMax:    0,
      deficitPctDefault: 0,
      targetKgPerWeek:   0,
    },
    bulk: {
      surplusPctMin:    5,
      surplusPctMax:    15,
      surplusPctDefault: 10,
      targetKgPerWeek:  0.25,
    },
  },

  // Weekly weight-trend adjustment trigger
  weeklyAdjustment: {
    deviationThresholdKg: 0.1,  // deviate this much from goal rate → suggest tweak
    adjustmentKcal:       150,  // suggested kcal change per adjustment
  },

  // ── Volume landmarks (RP framework, Israetel et al. 2019) ────────────
  // All values in sets/week. Secondary muscles count 0.5 sets.
  volumeLandmarks: {
    chest:       { mv: 6,  mev: 8,  mavLow: 12, mavHigh: 20, mrv: 22 },
    back:        { mv: 8,  mev: 10, mavLow: 14, mavHigh: 22, mrv: 25 },
    quads:       { mv: 6,  mev: 8,  mavLow: 12, mavHigh: 20, mrv: 20 },
    hamstrings:  { mv: 4,  mev: 6,  mavLow: 10, mavHigh: 16, mrv: 20 },
    glutes:      { mv: 0,  mev: 2,  mavLow: 4,  mavHigh: 12, mrv: 16 },
    shoulders:   { mv: 6,  mev: 8,  mavLow: 16, mavHigh: 22, mrv: 26 },
    biceps:      { mv: 4,  mev: 6,  mavLow: 10, mavHigh: 18, mrv: 20 },
    triceps:     { mv: 4,  mev: 6,  mavLow: 10, mavHigh: 18, mrv: 20 },
    calves:      { mv: 6,  mev: 8,  mavLow: 12, mavHigh: 16, mrv: 20 },
    abs:         { mv: 0,  mev: 0,  mavLow: 6,  mavHigh: 16, mrv: 20 },
    traps:       { mv: 0,  mev: 2,  mavLow: 6,  mavHigh: 16, mrv: 20 },
    forearms:    { mv: 0,  mev: 0,  mavLow: 4,  mavHigh: 14, mrv: 16 },
  } as Record<string, { mv: number; mev: number; mavLow: number; mavHigh: number; mrv: number }>,

  // Secondary muscle contribution weight (fraction of a full set)
  secondaryMuscleWeight: 0.5,

  // ── Progressive overload ─────────────────────────────────────────────
  progressiveOverload: {
    defaultRepRangeMin: 5,
    defaultRepRangeMax: 12,
    rirTarget:          2,   // target reps in reserve for working sets
    stallSessions:      3,   // sessions without e1RM improvement = stall
  },

  // ── Deload triggers ──────────────────────────────────────────────────
  deload: {
    sessionsSinceLastPR:   6,   // no PR in N sessions → suggest deload
    mrvWeeksThreshold:     2,   // at/above MRV for N weeks → suggest deload
    deloadVolumePct:      50,   // reduce volume by this % during deload
  },

  // ── Strength tier order ──────────────────────────────────────────────
  tierOrder: [
    "beginner",
    "novice",
    "intermediate",
    "advanced",
    "elite",
  ] as const,

  // ── Training split recommendations ──────────────────────────────────
  splits: {
    full_body: {
      label: "Full Body",
      daysPerWeek: [3, 4],
      freqPerMuscle: 3,
      rationale:
        "Highest frequency per muscle. Ideal for beginners and intermediate trainees; each session hits every muscle group.",
    },
    upper_lower: {
      label: "Upper / Lower",
      daysPerWeek: [4],
      freqPerMuscle: 2,
      rationale:
        "2× frequency per muscle, balanced push/pull each upper session. Well-supported for intermediate hypertrophy.",
    },
    ppl: {
      label: "Push / Pull / Legs",
      daysPerWeek: [6],
      freqPerMuscle: 2,
      rationale:
        "High volume with 2× frequency. Popular for intermediate-to-advanced trainees who can recover from 6 sessions/week.",
    },
    bro_split: {
      label: "Body Part Split",
      daysPerWeek: [5],
      freqPerMuscle: 1,
      rationale:
        "1× frequency per muscle. High per-session volume can be effective for advanced trainees, but lower frequency is suboptimal for most.",
    },
  },
} as const

export type SplitKey = keyof typeof SBL.splits
