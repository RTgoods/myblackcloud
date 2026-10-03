-- Track two more per-level stats: codes survived (count of code-blue events
-- resolved) and whether the level was a "clean shift" (no code, no relapse).
-- Leaderboard gets lifetime totals — codes survived sums across every
-- submission, clean shifts counts how many submitted runs were clean —
-- rather than a GREATEST()-style best-run snapshot, since these read as
-- cumulative operator achievements, not a single high score.

ALTER TABLE leaderboard_entries
  ADD COLUMN total_codes_survived INTEGER NOT NULL DEFAULT 0 CHECK (total_codes_survived >= 0),
  ADD COLUMN clean_shifts INTEGER NOT NULL DEFAULT 0 CHECK (clean_shifts >= 0);

DROP FUNCTION IF EXISTS public.submit_leaderboard_score(uuid, text, integer, integer);

CREATE FUNCTION public.submit_leaderboard_score(
  p_user_id UUID, p_display_name TEXT, p_score INTEGER, p_level_reached INTEGER,
  p_codes_survived INTEGER DEFAULT 0, p_clean_shift BOOLEAN DEFAULT false
) RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF p_level_reached < 1 OR p_level_reached > 8 THEN RAISE EXCEPTION 'Invalid level'; END IF;
  IF p_score < 0 OR p_score > 50 THEN RAISE EXCEPTION 'Invalid score'; END IF;
  IF p_codes_survived < 0 OR p_codes_survived > 20 THEN RAISE EXCEPTION 'Invalid codes survived'; END IF;
  INSERT INTO leaderboard_entries (user_id, display_name, score, level_reached, total_codes_survived, clean_shifts)
    VALUES (p_user_id, p_display_name, p_score, p_level_reached, p_codes_survived, CASE WHEN p_clean_shift THEN 1 ELSE 0 END)
  ON CONFLICT (user_id) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        score = GREATEST(leaderboard_entries.score, EXCLUDED.score),
        level_reached = GREATEST(leaderboard_entries.level_reached, EXCLUDED.level_reached),
        total_codes_survived = leaderboard_entries.total_codes_survived + EXCLUDED.total_codes_survived,
        clean_shifts = leaderboard_entries.clean_shifts + EXCLUDED.clean_shifts,
        created_at = CASE WHEN EXCLUDED.score > leaderboard_entries.score THEN now() ELSE leaderboard_entries.created_at END;
  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_leaderboard_score(uuid, text, integer, integer, integer, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_leaderboard_score(uuid, text, integer, integer, integer, boolean) TO service_role;
