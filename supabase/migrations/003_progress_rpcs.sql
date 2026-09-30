-- One outstanding checkout per player, including its immutable Stripe payload.
CREATE TABLE public.checkout_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  params jsonb NOT NULL,
  stripe_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.checkout_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.checkout_attempts FROM anon, authenticated;
GRANT ALL ON public.checkout_attempts TO service_role;

CREATE FUNCTION public.reserve_checkout(p_user_id uuid, p_params jsonb)
RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
DECLARE attempt public.checkout_attempts;
BEGIN
  INSERT INTO public.checkout_attempts (user_id, params)
    VALUES (p_user_id, p_params) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO attempt FROM public.checkout_attempts
    WHERE user_id = p_user_id FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.purchases WHERE user_id = p_user_id AND status = 'completed') THEN
    RETURN jsonb_build_object('error', 'already_purchased');
  END IF;
  RETURN to_jsonb(attempt);
END;
$$;

-- Both writes and resets lock the same row. A reset leaves a versioned tombstone
-- so stale saves cannot recreate deleted progress, even from another device.
-- Levels do not have to be completed in order — once purchased, the in-game
-- level-select menu lets a player jump straight to any of levels 2-8 — so,
-- unlike a strictly sequential game, this RPC does not require the previous
-- level to already be in completed_levels.
CREATE FUNCTION public.save_level_progress(p_user_id uuid, p_level integer,
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
  SELECT ARRAY(SELECT DISTINCT n FROM unnest(saved.completed_levels || p_level) n ORDER BY n)
    INTO saved.completed_levels;
  saved.level_stats := jsonb_set(saved.level_stats, ARRAY[p_level::text], p_stat);
  UPDATE public.progress SET completed_levels = saved.completed_levels, level_stats = saved.level_stats,
    updated_at = now() WHERE user_id = p_user_id;
  RETURN jsonb_build_object('completedLevels', saved.completed_levels, 'levelStats', saved.level_stats,
    'resetVersion', saved.reset_version);
END;
$$;

CREATE FUNCTION public.reset_level_progress(p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
DECLARE version integer;
BEGIN
  INSERT INTO public.progress (user_id, reset_version) VALUES (p_user_id, 1)
  ON CONFLICT (user_id) DO UPDATE SET completed_levels = '{}', level_stats = '{}',
    reset_version = progress.reset_version + 1, updated_at = now()
  RETURNING reset_version INTO version;
  RETURN jsonb_build_object('completedLevels', '[]'::jsonb, 'levelStats', '{}'::jsonb, 'resetVersion', version);
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_checkout(uuid, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.save_level_progress(uuid, integer, jsonb, integer, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_level_progress(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_checkout(uuid, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.save_level_progress(uuid, integer, jsonb, integer, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_level_progress(uuid) TO service_role;
