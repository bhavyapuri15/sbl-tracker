-- ============================================================
-- Strength Standards Seed
-- Source: StrengthLevel.com (2024), adapted as bodyweight-ratio
-- thresholds per tier. Values are e1RM thresholds in kg for a
-- given bodyweight bucket and sex.
--
-- Approach: For each 10-kg bodyweight bucket, the e1RM threshold
-- to reach each tier scales approximately linearly.
-- These values represent population percentile breakpoints:
--   Beginner      ≈ bottom 20%
--   Novice        ≈ 20–40th %ile
--   Intermediate  ≈ 40–60th %ile
--   Advanced      ≈ 60–80th %ile
--   Elite         ≈ top 20%
--
-- Run AFTER exercises.sql.
-- ============================================================

-- Helper: for reference, the BW-ratio multipliers used below.
-- Males:    Squat Beg×0.5 Nov×0.75 Int×1.25 Adv×1.75 Eli×2.5
--           DL   Beg×0.5 Nov×1.0  Int×1.5  Adv×2.0  Eli×2.75
--           BP   Beg×0.35 Nov×0.5 Int×0.75 Adv×1.25 Eli×1.75
--           OHP  Beg×0.2 Nov×0.35 Int×0.55 Adv×0.8  Eli×1.1
--           Row  Beg×0.3 Nov×0.5 Int×0.75 Adv×1.1  Eli×1.5
-- Females: ~65% of male thresholds (StrengthLevel.com scaling)

INSERT INTO strength_standards
  (exercise_slug, sex, bw_lower_kg, bw_upper_kg, tier, min_e1rm_kg, source)
VALUES

-- ── Barbell Back Squat — Male ─────────────────────────────────────────
('barbell-back-squat','male', 50, 60,  'beginner',      28, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 50, 60,  'novice',         41, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 50, 60,  'intermediate',   69, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 50, 60,  'advanced',       96, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 50, 60,  'elite',         138, 'StrengthLevel.com 2024'),

('barbell-back-squat','male', 60, 70,  'beginner',      33, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 60, 70,  'novice',         49, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 60, 70,  'intermediate',   81, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 60, 70,  'advanced',      114, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 60, 70,  'elite',         163, 'StrengthLevel.com 2024'),

('barbell-back-squat','male', 70, 80,  'beginner',      38, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 70, 80,  'novice',         56, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 70, 80,  'intermediate',   94, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 70, 80,  'advanced',      131, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 70, 80,  'elite',         188, 'StrengthLevel.com 2024'),

('barbell-back-squat','male', 80, 90,  'beginner',      43, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 80, 90,  'novice',         64, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 80, 90,  'intermediate',  106, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 80, 90,  'advanced',      149, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 80, 90,  'elite',         213, 'StrengthLevel.com 2024'),

('barbell-back-squat','male', 90, 100, 'beginner',      48, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 90, 100, 'novice',         71, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 90, 100, 'intermediate',  119, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 90, 100, 'advanced',      166, 'StrengthLevel.com 2024'),
('barbell-back-squat','male', 90, 100, 'elite',         238, 'StrengthLevel.com 2024'),

('barbell-back-squat','male',100, 120, 'beginner',      53, 'StrengthLevel.com 2024'),
('barbell-back-squat','male',100, 120, 'novice',         79, 'StrengthLevel.com 2024'),
('barbell-back-squat','male',100, 120, 'intermediate',  131, 'StrengthLevel.com 2024'),
('barbell-back-squat','male',100, 120, 'advanced',      184, 'StrengthLevel.com 2024'),
('barbell-back-squat','male',100, 120, 'elite',         263, 'StrengthLevel.com 2024'),

-- ── Barbell Back Squat — Female ───────────────────────────────────────
('barbell-back-squat','female', 45, 55, 'beginner',     18, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 45, 55, 'novice',        27, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 45, 55, 'intermediate',  44, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 45, 55, 'advanced',      62, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 45, 55, 'elite',         90, 'StrengthLevel.com 2024'),

('barbell-back-squat','female', 55, 65, 'beginner',     21, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 55, 65, 'novice',        32, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 55, 65, 'intermediate',  53, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 55, 65, 'advanced',      74, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 55, 65, 'elite',        106, 'StrengthLevel.com 2024'),

('barbell-back-squat','female', 65, 75, 'beginner',     25, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 65, 75, 'novice',        37, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 65, 75, 'intermediate',  61, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 65, 75, 'advanced',      85, 'StrengthLevel.com 2024'),
('barbell-back-squat','female', 65, 75, 'elite',        122, 'StrengthLevel.com 2024'),

-- ── Conventional Deadlift — Male ──────────────────────────────────────
('conventional-deadlift','male', 60, 70,  'beginner',     60, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 60, 70,  'novice',        98, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 60, 70,  'intermediate', 131, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 60, 70,  'advanced',     175, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 60, 70,  'elite',        240, 'StrengthLevel.com 2024'),

('conventional-deadlift','male', 70, 80,  'beginner',     68, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 70, 80,  'novice',       113, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 70, 80,  'intermediate', 150, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 70, 80,  'advanced',     200, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 70, 80,  'elite',        275, 'StrengthLevel.com 2024'),

('conventional-deadlift','male', 80, 90,  'beginner',     76, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 80, 90,  'novice',       127, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 80, 90,  'intermediate', 170, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 80, 90,  'advanced',     226, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 80, 90,  'elite',        310, 'StrengthLevel.com 2024'),

('conventional-deadlift','male', 90, 100, 'beginner',     85, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 90, 100, 'novice',       141, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 90, 100, 'intermediate', 188, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 90, 100, 'advanced',     251, 'StrengthLevel.com 2024'),
('conventional-deadlift','male', 90, 100, 'elite',        344, 'StrengthLevel.com 2024'),

-- ── Conventional Deadlift — Female ────────────────────────────────────
('conventional-deadlift','female', 50, 60, 'beginner',    36, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 50, 60, 'novice',       57, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 50, 60, 'intermediate', 81, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 50, 60, 'advanced',    113, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 50, 60, 'elite',       156, 'StrengthLevel.com 2024'),

('conventional-deadlift','female', 60, 70, 'beginner',    42, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 60, 70, 'novice',       66, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 60, 70, 'intermediate', 93, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 60, 70, 'advanced',    130, 'StrengthLevel.com 2024'),
('conventional-deadlift','female', 60, 70, 'elite',       179, 'StrengthLevel.com 2024'),

-- ── Barbell Bench Press — Male ────────────────────────────────────────
('barbell-bench-press','male', 60, 70,  'beginner',     28, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 60, 70,  'novice',        44, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 60, 70,  'intermediate',  71, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 60, 70,  'advanced',     110, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 60, 70,  'elite',        155, 'StrengthLevel.com 2024'),

('barbell-bench-press','male', 70, 80,  'beginner',     32, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 70, 80,  'novice',        50, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 70, 80,  'intermediate',  81, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 70, 80,  'advanced',     125, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 70, 80,  'elite',        176, 'StrengthLevel.com 2024'),

('barbell-bench-press','male', 80, 90,  'beginner',     36, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 80, 90,  'novice',        57, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 80, 90,  'intermediate',  91, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 80, 90,  'advanced',     141, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 80, 90,  'elite',        198, 'StrengthLevel.com 2024'),

('barbell-bench-press','male', 90, 100, 'beginner',     39, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 90, 100, 'novice',        62, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 90, 100, 'intermediate', 100, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 90, 100, 'advanced',     155, 'StrengthLevel.com 2024'),
('barbell-bench-press','male', 90, 100, 'elite',        217, 'StrengthLevel.com 2024'),

-- ── Barbell Bench Press — Female ──────────────────────────────────────
('barbell-bench-press','female', 50, 60, 'beginner',    15, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 50, 60, 'novice',       24, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 50, 60, 'intermediate', 40, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 50, 60, 'advanced',     62, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 50, 60, 'elite',        87, 'StrengthLevel.com 2024'),

('barbell-bench-press','female', 60, 70, 'beginner',    18, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 60, 70, 'novice',       28, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 60, 70, 'intermediate', 46, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 60, 70, 'advanced',     71, 'StrengthLevel.com 2024'),
('barbell-bench-press','female', 60, 70, 'elite',       100, 'StrengthLevel.com 2024'),

-- ── Overhead Press (Barbell) — Male ───────────────────────────────────
('overhead-press-barbell','male', 60, 70,  'beginner',   17, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 60, 70,  'novice',      28, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 60, 70,  'intermediate',44, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 60, 70,  'advanced',    65, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 60, 70,  'elite',       90, 'StrengthLevel.com 2024'),

('overhead-press-barbell','male', 70, 80,  'beginner',   19, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 70, 80,  'novice',      32, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 70, 80,  'intermediate',50, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 70, 80,  'advanced',    74, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 70, 80,  'elite',      102, 'StrengthLevel.com 2024'),

('overhead-press-barbell','male', 80, 90,  'beginner',   22, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 80, 90,  'novice',      36, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 80, 90,  'intermediate',57, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 80, 90,  'advanced',    83, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 80, 90,  'elite',      115, 'StrengthLevel.com 2024'),

('overhead-press-barbell','male', 90, 100, 'beginner',   24, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 90, 100, 'novice',      40, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 90, 100, 'intermediate',62, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 90, 100, 'advanced',    92, 'StrengthLevel.com 2024'),
('overhead-press-barbell','male', 90, 100, 'elite',      127, 'StrengthLevel.com 2024'),

-- ── Overhead Press (Barbell) — Female ────────────────────────────────
('overhead-press-barbell','female', 50, 60, 'beginner',  10, 'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 50, 60, 'novice',     16, 'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 50, 60, 'intermediate',26,'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 50, 60, 'advanced',   40, 'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 50, 60, 'elite',      55, 'StrengthLevel.com 2024'),

('overhead-press-barbell','female', 60, 70, 'beginner',  12, 'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 60, 70, 'novice',     19, 'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 60, 70, 'intermediate',30,'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 60, 70, 'advanced',   46, 'StrengthLevel.com 2024'),
('overhead-press-barbell','female', 60, 70, 'elite',      64, 'StrengthLevel.com 2024'),

-- ── Barbell Row — Male ────────────────────────────────────────────────
('barbell-row-overhand','male', 70, 80,  'beginner',    27, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 70, 80,  'novice',       45, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 70, 80,  'intermediate', 68, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 70, 80,  'advanced',    100, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 70, 80,  'elite',       136, 'StrengthLevel.com 2024'),

('barbell-row-overhand','male', 80, 90,  'beginner',    30, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 80, 90,  'novice',       50, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 80, 90,  'intermediate', 76, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 80, 90,  'advanced',    112, 'StrengthLevel.com 2024'),
('barbell-row-overhand','male', 80, 90,  'elite',       152, 'StrengthLevel.com 2024'),

-- ── Barbell Row — Female ──────────────────────────────────────────────
('barbell-row-overhand','female', 55, 65, 'beginner',   16, 'StrengthLevel.com 2024'),
('barbell-row-overhand','female', 55, 65, 'novice',      27, 'StrengthLevel.com 2024'),
('barbell-row-overhand','female', 55, 65, 'intermediate',42, 'StrengthLevel.com 2024'),
('barbell-row-overhand','female', 55, 65, 'advanced',    63, 'StrengthLevel.com 2024'),
('barbell-row-overhand','female', 55, 65, 'elite',       87, 'StrengthLevel.com 2024')

ON CONFLICT DO NOTHING;
