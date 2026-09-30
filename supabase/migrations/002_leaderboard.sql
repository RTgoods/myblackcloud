-- Leaderboard — one best-score row per player, publicly readable.
-- All writes go through the service-role-only submit_leaderboard_score RPC
-- (called from POST /api/leaderboard after the server validates the caller's
-- session and, for level_reached > 1, their purchase status).

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT        NOT NULL,
  score         INTEGER     NOT NULL CHECK (score >= 0),
  level_reached INTEGER     NOT NULL CHECK (level_reached BETWEEN 1 AND 8),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_leaderboard"
  ON leaderboard_entries FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policy for anon/authenticated — all writes are via
-- the service-role RPC below.

-- Level n requires n discharges (quota = n in game.js), so a full 8-level run
-- tops out at 1+2+...+8 = 36 total discharges — 50 is a generous ceiling
-- against a hand-crafted request, not a tuned gameplay limit.
CREATE FUNCTION public.submit_leaderboard_score(
  p_user_id UUID, p_display_name TEXT, p_score INTEGER, p_level_reached INTEGER
) RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF p_level_reached < 1 OR p_level_reached > 8 THEN RAISE EXCEPTION 'Invalid level'; END IF;
  IF p_score < 0 OR p_score > 50 THEN RAISE EXCEPTION 'Invalid score'; END IF;
  INSERT INTO leaderboard_entries (user_id, display_name, score, level_reached)
    VALUES (p_user_id, p_display_name, p_score, p_level_reached)
  ON CONFLICT (user_id) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        score = GREATEST(leaderboard_entries.score, EXCLUDED.score),
        level_reached = GREATEST(leaderboard_entries.level_reached, EXCLUDED.level_reached),
        created_at = CASE WHEN EXCLUDED.score > leaderboard_entries.score THEN now() ELSE leaderboard_entries.created_at END;
  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_leaderboard_score(uuid, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_leaderboard_score(uuid, text, integer, integer) TO service_role;
