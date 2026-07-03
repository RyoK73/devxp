SET LOCAL lock_timeout = '2s';

ALTER TABLE rewards
  ALTER COLUMN daily_limit TYPE smallint;
