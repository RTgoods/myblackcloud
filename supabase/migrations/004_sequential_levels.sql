-- Levels must now be cleared in order. Purchasing unlocks the *ability* to play
-- levels 2-8, but level n (n>1) still will not save/start until level n-1 is in
-- completed_levels — this supersedes the "jump to any purchased level" design
-- note in 003_progress_rpcs.sql. Admins still bypass both the purchase and the
-- sequential check, same as before.
CREATE OR REPLACE FUNCTION public.save_level_progress(p_user_id uuid, p_level integer,
  p_stat jsonb, p_reset_version integer, p_is_admin boolean)
RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
DECLARE saved public.progress;
BEGIN
  INSERT INTO public.progress (user_id) VALUES (p_user_id) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO saved FROM public.progress WHERE user_id = p_user_id FOR UPDATE;
  IF saved.reset_version <> p_reset_version THEN
    RETURN jsonb_build_object('error', 'stale_progress', 'resetVersion', saved.reset_version);
  END IF;
  IF p_level < 1 OR p_level > 8 THEN RAISE EXCEPTION 'Invalid level'; END IF;
  IF NOT p_is_admin AND p_level > 1 AND NOT EXISTS (
    SELECT 1 FROM public.purchases WHERE user_id = p_user_id AND status = 'completed'
  ) THEN
    RETURN jsonb_build_object('error', 'purchase_required');
  END IF;
  IF NOT p_is_admin AND p_level > 1 AND NOT (p_level - 1 = ANY(saved.completed_levels)) THEN
    RETURN jsonb_build_object('error', 'level_locked', 'requiredLevel', p_level - 1);
  END IF;
  SELECT ARRAY(SELECT DISTINCT n FROM unnest(saved.completed_levels || p_level) n ORDER BY n)
    INTO saved.completed_levels;
  saved.level_stats := jsonb_set(saved.level_stats, ARRAY[p_level::text], p_stat);
  UPDATE public.progress SET completed_levels = saved.completed_levels, level_stats = saved.level_stats,
    updated_at = now() WHERE user_id = p_user_id;
  RETURN jsonb_build_object('completedLevels', saved.completed_levels, 'levelStats', saved.level_stats,
    'resetVersion', saved.reset_version);
END;
$$;
