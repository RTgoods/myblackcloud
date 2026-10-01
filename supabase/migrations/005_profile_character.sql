-- Settings page lets a player set their leaderboard handle (profiles.display_name,
-- already what /api/leaderboard reads) plus which character they play: role
-- (RT or RN — defaults to RT) and gender (male or female), used to pick one of
-- the four character portraits and to seed the in-game role on auto-launch.
-- No length constraint on display_name: existing rows may already hold values
-- outside a 2-20 char range, and a CHECK added via ALTER TABLE validates every
-- existing row. The 2-20 char rule is enforced client-side (SettingsForm) only.
ALTER TABLE profiles
  ADD COLUMN role TEXT NOT NULL DEFAULT 'RT' CHECK (role IN ('RT', 'RN')),
  ADD COLUMN gender TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female'));
