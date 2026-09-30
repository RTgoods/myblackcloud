-- ──────────────────────────────────────────────────────────────────────────────
-- MyBlackCloud — initial schema
-- Run in: Supabase Dashboard → SQL Editor → New query
-- Single-game site — no games catalog table; everything below is scoped by
-- user_id alone (no game_id dimension).
-- ──────────────────────────────────────────────────────────────────────────────

-- User profiles (auto-created on signup)
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Purchase records (written by Stripe webhook via service role) — one per account.
CREATE TABLE IF NOT EXISTS purchases (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id        TEXT        UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_paid_cents        INTEGER,
  status                   TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cloud save — one row per player.
CREATE TABLE IF NOT EXISTS progress (
  user_id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_levels INTEGER[]   NOT NULL DEFAULT '{}',
  level_stats      JSONB       NOT NULL DEFAULT '{}',
  reset_version    INTEGER     NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row-level security ────────────────────────────────────────────────────────

ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress  ENABLE ROW LEVEL SECURITY;

-- Users manage their own profile
CREATE POLICY "read_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users read their own purchase
CREATE POLICY "read_own_purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Users may only READ their own progress row directly. All writes go through
-- /api/progress using the service-role client + save_level_progress RPC (see
-- 003_progress_rpcs.sql), so the anon key can never forge completed levels.
CREATE POLICY "read_own_progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

-- ── Triggers ─────────────────────────────────────────────────────────────────

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep updated_at current
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
