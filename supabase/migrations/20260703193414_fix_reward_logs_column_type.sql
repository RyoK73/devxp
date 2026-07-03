SET LOCAL lock_timeout = '2s';

ALTER TABLE reward_logs
  ALTER COLUMN xp_amount TYPE bigint;
