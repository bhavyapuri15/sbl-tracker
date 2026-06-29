-- ============================================================
-- Volume Landmarks Seed
-- Source: Israetel, M., Hoffman, J., & Case, N. (2019).
--   "Scientific Principles of Hypertrophy Training."
--   Renaissance Periodization.
--
-- All values are sets per week for a trained individual.
-- Individual MRV can vary ±30%. These are population averages.
-- MV  = Maintenance Volume  (keep muscle without gaining)
-- MEV = Minimum Effective Volume  (minimum to grow)
-- MAV = Maximum Adaptive Volume   (optimal growth range)
-- MRV = Maximum Recoverable Volume (cap before overtraining)
-- ============================================================

INSERT INTO volume_landmarks
  (muscle_group, mv_sets, mev_sets, mav_lower, mav_upper, mrv_sets, source)
VALUES
  ('chest',      6,  8,  12, 20, 22, 'Israetel et al. 2019, RP Hypertrophy'),
  ('back',       8, 10,  14, 22, 25, 'Israetel et al. 2019, RP Hypertrophy'),
  ('quads',      6,  8,  12, 20, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('hamstrings', 4,  6,  10, 16, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('glutes',     0,  2,   4, 12, 16, 'Israetel et al. 2019, RP Hypertrophy'),
  ('shoulders',  6,  8,  16, 22, 26, 'Israetel et al. 2019, RP Hypertrophy'),
  ('biceps',     4,  6,  10, 18, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('triceps',    4,  6,  10, 18, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('calves',     6,  8,  12, 16, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('abs',        0,  0,   6, 16, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('traps',      0,  2,   6, 16, 20, 'Israetel et al. 2019, RP Hypertrophy'),
  ('forearms',   0,  0,   4, 14, 16, 'Israetel et al. 2019, RP Hypertrophy')

ON CONFLICT (muscle_group) DO UPDATE SET
  mv_sets   = EXCLUDED.mv_sets,
  mev_sets  = EXCLUDED.mev_sets,
  mav_lower = EXCLUDED.mav_lower,
  mav_upper = EXCLUDED.mav_upper,
  mrv_sets  = EXCLUDED.mrv_sets,
  source    = EXCLUDED.source;
