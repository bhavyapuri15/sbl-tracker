-- ============================================================
-- SBL Tracker — Initial Schema
-- Run via: supabase db push  (or paste into Supabase SQL editor)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Seed tables (public read, no user ownership) ─────────────────────

CREATE TABLE IF NOT EXISTS exercises (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL UNIQUE,
  slug              text        NOT NULL UNIQUE,
  primary_muscles   text[]      NOT NULL DEFAULT '{}',
  secondary_muscles text[]      NOT NULL DEFAULT '{}',
  equipment         text        NOT NULL,
  category          text        NOT NULL CHECK (category IN ('compound','isolation')),
  force             text,
  is_unilateral     boolean     NOT NULL DEFAULT false,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS strength_standards (
  id             uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_slug  text    NOT NULL REFERENCES exercises(slug) ON DELETE CASCADE,
  sex            text    NOT NULL CHECK (sex IN ('male','female')),
  bw_lower_kg    numeric NOT NULL,
  bw_upper_kg    numeric NOT NULL,
  tier           text    NOT NULL CHECK (tier IN ('beginner','novice','intermediate','advanced','elite')),
  min_e1rm_kg    numeric NOT NULL,
  source         text
);

CREATE TABLE IF NOT EXISTS volume_landmarks (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  muscle_group text    NOT NULL UNIQUE,
  mv_sets      integer NOT NULL,
  mev_sets     integer NOT NULL,
  mav_lower    integer NOT NULL,
  mav_upper    integer NOT NULL,
  mrv_sets     integer NOT NULL,
  source       text
);

-- ── User tables ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name        text,
  sex                 text        CHECK (sex IN ('male','female')),
  date_of_birth       date,
  unit_system         text        NOT NULL DEFAULT 'metric' CHECK (unit_system IN ('metric','imperial')),
  theme               text        NOT NULL DEFAULT 'dark'   CHECK (theme IN ('dark','light','system')),
  activity_level      text        CHECK (activity_level IN ('sedentary','light','moderate','active','very_active')),
  goal                text        CHECK (goal IN ('cut','maintain','bulk')),
  cut_deficit_pct     numeric     NOT NULL DEFAULT 15,
  bulk_surplus_pct    numeric     NOT NULL DEFAULT 10,
  protein_target_gkg  numeric     NOT NULL DEFAULT 2.0,
  fat_floor_gkg       numeric     NOT NULL DEFAULT 0.7,
  e1rm_formula        text        NOT NULL DEFAULT 'epley' CHECK (e1rm_formula IN ('epley','brzycki')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS body_metrics (
  id             uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_at      date    NOT NULL,
  weight_kg      numeric,
  height_cm      numeric,
  body_fat_pct   numeric,
  chest_cm       numeric,
  waist_cm       numeric,
  hips_cm        numeric,
  left_arm_cm    numeric,
  right_arm_cm   numeric,
  left_thigh_cm  numeric,
  right_thigh_cm numeric,
  notes          text,
  UNIQUE (user_id, logged_at)
);

CREATE TABLE IF NOT EXISTS workout_sessions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         text,
  notes        text,
  started_at   timestamptz NOT NULL,
  ended_at     timestamptz,
  is_template  boolean     NOT NULL DEFAULT false,
  template_id  uuid        REFERENCES workout_sessions(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid    NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid    NOT NULL REFERENCES exercises(id),
  order_index integer NOT NULL,
  notes       text
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id  uuid        NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number           integer     NOT NULL,
  weight_kg            numeric,
  reps                 integer,
  rir                  integer     CHECK (rir BETWEEN 0 AND 10),
  rpe                  numeric     CHECK (rpe BETWEEN 5 AND 10),
  set_type             text        NOT NULL DEFAULT 'working' CHECK (set_type IN ('warmup','working','drop','failure')),
  e1rm_kg              numeric,
  is_pr                boolean     NOT NULL DEFAULT false,
  logged_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS personal_records (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id  uuid        NOT NULL REFERENCES exercises(id),
  e1rm_kg      numeric     NOT NULL,
  weight_kg    numeric     NOT NULL,
  reps         integer     NOT NULL,
  achieved_at  timestamptz NOT NULL,
  set_id       uuid        REFERENCES workout_sets(id) ON DELETE SET NULL,
  UNIQUE (user_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS food_entries (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_at    date        NOT NULL,
  meal_slot    text        NOT NULL DEFAULT 'any' CHECK (meal_slot IN ('breakfast','lunch','dinner','snack','any')),
  food_name    text        NOT NULL,
  calories     numeric     NOT NULL,
  protein_g    numeric,
  carbs_g      numeric,
  fat_g        numeric,
  fiber_g      numeric,
  serving_size text,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nutrition_goals (
  user_id            uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  effective_from     date        NOT NULL,
  calories_target    numeric,
  protein_g          numeric,
  carbs_g            numeric,
  fat_g              numeric,
  tdee_estimate      numeric,
  bmr_estimate       numeric,
  adjustment_reason  text,
  PRIMARY KEY (user_id, effective_from)
);

-- ── Indexes ───────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_body_metrics_user_date
  ON body_metrics(user_id, logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user
  ON workout_sessions(user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_session
  ON workout_exercises(session_id, order_index);

CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise
  ON workout_sets(workout_exercise_id, set_number);

CREATE INDEX IF NOT EXISTS idx_food_entries_user_date
  ON food_entries(user_id, logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_personal_records_user
  ON personal_records(user_id, exercise_id);

CREATE INDEX IF NOT EXISTS idx_strength_standards_slug
  ON strength_standards(exercise_slug, sex, bw_lower_kg);

-- ── RLS ──────────────────────────────────────────────────────────────

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: own row" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- body_metrics
CREATE POLICY "body_metrics: own rows" ON body_metrics
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- workout_sessions
CREATE POLICY "workout_sessions: own rows" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- workout_exercises — access via session ownership
CREATE POLICY "workout_exercises: own via session" ON workout_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_id AND ws.user_id = auth.uid()
    )
  );

-- workout_sets — access via workout_exercise → session ownership
CREATE POLICY "workout_sets: own via exercise" ON workout_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM workout_exercises we
      JOIN workout_sessions ws ON ws.id = we.session_id
      WHERE we.id = workout_exercise_id AND ws.user_id = auth.uid()
    )
  );

-- personal_records
CREATE POLICY "personal_records: own rows" ON personal_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- food_entries
CREATE POLICY "food_entries: own rows" ON food_entries
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- nutrition_goals
CREATE POLICY "nutrition_goals: own rows" ON nutrition_goals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- seed tables: public read, no user writes
ALTER TABLE exercises         ENABLE ROW LEVEL SECURITY;
ALTER TABLE strength_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE volume_landmarks  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises: public read" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "strength_standards: public read" ON strength_standards
  FOR SELECT USING (true);

CREATE POLICY "volume_landmarks: public read" ON volume_landmarks
  FOR SELECT USING (true);

-- ── Auto-create profile on sign-up ───────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── updated_at trigger for profiles ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
