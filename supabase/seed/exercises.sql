-- ============================================================
-- Exercise database seed
-- Primary muscles drive volume accounting (weight = 1.0 set).
-- Secondary muscles count as 0.5 sets toward their MRV/MEV.
-- Equipment values: barbell | dumbbell | cable | machine | bodyweight | ez-bar | smith
-- ============================================================

INSERT INTO exercises (name, slug, primary_muscles, secondary_muscles, equipment, category, force, is_unilateral) VALUES

-- ── LEGS ─────────────────────────────────────────────────────────────
('Barbell Back Squat',       'barbell-back-squat',       ARRAY['quads','glutes'],       ARRAY['hamstrings','erectors'], 'barbell',    'compound', 'squat',  false),
('Barbell Front Squat',      'barbell-front-squat',      ARRAY['quads'],                ARRAY['glutes','erectors'],     'barbell',    'compound', 'squat',  false),
('Hack Squat',               'hack-squat',               ARRAY['quads'],                ARRAY['glutes','hamstrings'],   'machine',    'compound', 'squat',  false),
('Leg Press',                'leg-press',                ARRAY['quads','glutes'],       ARRAY['hamstrings'],            'machine',    'compound', 'push',   false),
('Bulgarian Split Squat',    'bulgarian-split-squat',    ARRAY['quads','glutes'],       ARRAY['hamstrings'],            'dumbbell',   'compound', 'squat',  true),
('Walking Lunge',            'walking-lunge',            ARRAY['quads','glutes'],       ARRAY['hamstrings'],            'dumbbell',   'compound', 'squat',  true),
('Conventional Deadlift',    'conventional-deadlift',    ARRAY['hamstrings','glutes'],  ARRAY['erectors','traps','quads'], 'barbell', 'compound', 'hinge',  false),
('Sumo Deadlift',            'sumo-deadlift',            ARRAY['glutes','hamstrings'],  ARRAY['quads','erectors'],      'barbell',    'compound', 'hinge',  false),
('Romanian Deadlift',        'romanian-deadlift',        ARRAY['hamstrings','glutes'],  ARRAY['erectors'],              'barbell',    'compound', 'hinge',  false),
('Dumbbell RDL',             'dumbbell-rdl',             ARRAY['hamstrings','glutes'],  ARRAY['erectors'],              'dumbbell',   'compound', 'hinge',  false),
('Leg Curl (Seated)',        'leg-curl-seated',          ARRAY['hamstrings'],           ARRAY[]::text[],                        'machine',    'isolation','pull',   false),
('Leg Curl (Lying)',         'leg-curl-lying',           ARRAY['hamstrings'],           ARRAY[]::text[],                        'machine',    'isolation','pull',   false),
('Leg Extension',            'leg-extension',            ARRAY['quads'],                ARRAY[]::text[],                        'machine',    'isolation','push',   false),
('Hip Thrust (Barbell)',     'hip-thrust-barbell',       ARRAY['glutes'],               ARRAY['hamstrings'],            'barbell',    'compound', 'hinge',  false),
('Hip Thrust (Machine)',     'hip-thrust-machine',       ARRAY['glutes'],               ARRAY['hamstrings'],            'machine',    'compound', 'hinge',  false),
('Cable Pull-Through',       'cable-pull-through',       ARRAY['glutes','hamstrings'],  ARRAY['erectors'],              'cable',      'compound', 'hinge',  false),
('Seated Calf Raise',        'seated-calf-raise',        ARRAY['calves'],               ARRAY[]::text[],                        'machine',    'isolation','push',   false),
('Standing Calf Raise',      'standing-calf-raise',      ARRAY['calves'],               ARRAY[]::text[],                        'machine',    'isolation','push',   false),

-- ── CHEST ────────────────────────────────────────────────────────────
('Barbell Bench Press',      'barbell-bench-press',      ARRAY['chest'],                ARRAY['triceps','shoulders'],   'barbell',    'compound', 'push',   false),
('Incline Barbell Press',    'incline-barbell-press',    ARRAY['chest'],                ARRAY['triceps','shoulders'],   'barbell',    'compound', 'push',   false),
('Dumbbell Bench Press',     'dumbbell-bench-press',     ARRAY['chest'],                ARRAY['triceps','shoulders'],   'dumbbell',   'compound', 'push',   false),
('Incline Dumbbell Press',   'incline-dumbbell-press',   ARRAY['chest'],                ARRAY['triceps','shoulders'],   'dumbbell',   'compound', 'push',   false),
('Dip (Chest)',              'dip-chest',                ARRAY['chest'],                ARRAY['triceps'],               'bodyweight', 'compound', 'push',   false),
('Cable Fly (Low)',          'cable-fly-low',            ARRAY['chest'],                ARRAY[]::text[],                        'cable',      'isolation','push',   false),
('Cable Fly (Mid)',          'cable-fly-mid',            ARRAY['chest'],                ARRAY[]::text[],                        'cable',      'isolation','push',   false),
('Pec Deck',                 'pec-deck',                 ARRAY['chest'],                ARRAY[]::text[],                        'machine',    'isolation','push',   false),
('Push-Up',                  'push-up',                  ARRAY['chest'],                ARRAY['triceps','shoulders'],   'bodyweight', 'compound', 'push',   false),

-- ── BACK ─────────────────────────────────────────────────────────────
('Pull-Up',                  'pull-up',                  ARRAY['back'],                 ARRAY['biceps'],                'bodyweight', 'compound', 'pull',   false),
('Weighted Pull-Up',         'weighted-pull-up',         ARRAY['back'],                 ARRAY['biceps'],                'bodyweight', 'compound', 'pull',   false),
('Chin-Up',                  'chin-up',                  ARRAY['back'],                 ARRAY['biceps'],                'bodyweight', 'compound', 'pull',   false),
('Lat Pulldown',             'lat-pulldown',             ARRAY['back'],                 ARRAY['biceps'],                'cable',      'compound', 'pull',   false),
('Barbell Row (Overhand)',   'barbell-row-overhand',     ARRAY['back'],                 ARRAY['biceps','traps'],        'barbell',    'compound', 'pull',   false),
('Barbell Row (Underhand)',  'barbell-row-underhand',    ARRAY['back'],                 ARRAY['biceps'],                'barbell',    'compound', 'pull',   false),
('Dumbbell Row',             'dumbbell-row',             ARRAY['back'],                 ARRAY['biceps','traps'],        'dumbbell',   'compound', 'pull',   true),
('Cable Row (Seated)',       'cable-row-seated',         ARRAY['back'],                 ARRAY['biceps','traps'],        'cable',      'compound', 'pull',   false),
('Chest-Supported Row',      'chest-supported-row',      ARRAY['back'],                 ARRAY['biceps','traps'],        'machine',    'compound', 'pull',   false),
('Face Pull',                'face-pull',                ARRAY['traps'],                ARRAY['shoulders'],             'cable',      'isolation','pull',   false),
('Shrug (Barbell)',          'shrug-barbell',            ARRAY['traps'],                ARRAY[]::text[],                        'barbell',    'isolation','pull',   false),

-- ── SHOULDERS ────────────────────────────────────────────────────────
('Overhead Press (Barbell)', 'overhead-press-barbell',   ARRAY['shoulders'],            ARRAY['triceps','traps'],       'barbell',    'compound', 'push',   false),
('Overhead Press (Dumbbell)','overhead-press-dumbbell',  ARRAY['shoulders'],            ARRAY['triceps'],               'dumbbell',   'compound', 'push',   false),
('Lateral Raise',            'lateral-raise',            ARRAY['shoulders'],            ARRAY[]::text[],                        'dumbbell',   'isolation','push',   false),
('Cable Lateral Raise',      'cable-lateral-raise',      ARRAY['shoulders'],            ARRAY[]::text[],                        'cable',      'isolation','push',   true),
('Rear Delt Fly',            'rear-delt-fly',            ARRAY['shoulders'],            ARRAY['traps'],                 'dumbbell',   'isolation','pull',   false),
('Machine Shoulder Press',   'machine-shoulder-press',   ARRAY['shoulders'],            ARRAY['triceps'],               'machine',    'compound', 'push',   false),

-- ── BICEPS ───────────────────────────────────────────────────────────
('Barbell Curl',             'barbell-curl',             ARRAY['biceps'],               ARRAY['forearms'],              'barbell',    'isolation','pull',   false),
('EZ-Bar Curl',              'ez-bar-curl',              ARRAY['biceps'],               ARRAY['forearms'],              'ez-bar',     'isolation','pull',   false),
('Dumbbell Curl',            'dumbbell-curl',            ARRAY['biceps'],               ARRAY['forearms'],              'dumbbell',   'isolation','pull',   true),
('Hammer Curl',              'hammer-curl',              ARRAY['biceps'],               ARRAY['forearms'],              'dumbbell',   'isolation','pull',   true),
('Incline Dumbbell Curl',    'incline-dumbbell-curl',    ARRAY['biceps'],               ARRAY[]::text[],                        'dumbbell',   'isolation','pull',   true),
('Cable Curl',               'cable-curl',               ARRAY['biceps'],               ARRAY[]::text[],                        'cable',      'isolation','pull',   false),
('Preacher Curl',            'preacher-curl',            ARRAY['biceps'],               ARRAY[]::text[],                        'ez-bar',     'isolation','pull',   false),

-- ── TRICEPS ──────────────────────────────────────────────────────────
('Tricep Pushdown (Bar)',    'tricep-pushdown-bar',      ARRAY['triceps'],              ARRAY[]::text[],                        'cable',      'isolation','push',   false),
('Tricep Pushdown (Rope)',   'tricep-pushdown-rope',     ARRAY['triceps'],              ARRAY[]::text[],                        'cable',      'isolation','push',   false),
('Skull Crusher',            'skull-crusher',            ARRAY['triceps'],              ARRAY[]::text[],                        'ez-bar',     'isolation','push',   false),
('Close-Grip Bench Press',   'close-grip-bench-press',   ARRAY['triceps'],              ARRAY['chest'],                 'barbell',    'compound', 'push',   false),
('Overhead Tricep Ext.',     'overhead-tricep-extension',ARRAY['triceps'],              ARRAY[]::text[],                        'cable',      'isolation','push',   false),
('Dip (Tricep)',             'dip-tricep',               ARRAY['triceps'],              ARRAY['chest'],                 'bodyweight', 'compound', 'push',   false),

-- ── CORE ─────────────────────────────────────────────────────────────
('Cable Crunch',             'cable-crunch',             ARRAY['abs'],                  ARRAY[]::text[],                        'cable',      'isolation','pull',   false),
('Hanging Leg Raise',        'hanging-leg-raise',        ARRAY['abs'],                  ARRAY[]::text[],                        'bodyweight', 'isolation','pull',   false),
('Ab Wheel Rollout',         'ab-wheel-rollout',         ARRAY['abs'],                  ARRAY['erectors'],              'bodyweight', 'compound', 'push',   false),
('Plank',                    'plank',                    ARRAY['abs'],                  ARRAY['erectors'],              'bodyweight', 'isolation',NULL,     false)

ON CONFLICT (slug) DO NOTHING;
