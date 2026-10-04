-- New signups now default to the RN character instead of RT. Only changes
-- the column default for future inserts (profiles.id is inserted with no
-- role via the handle_new_user trigger, relying on this default) — existing
-- rows that already hold an explicit 'RT' or 'RN' are untouched, since there
-- is no way to tell "never chosen, got the old default" apart from "chosen
-- on purpose."
ALTER TABLE profiles
  ALTER COLUMN role SET DEFAULT 'RN';
