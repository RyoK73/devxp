SET LOCAL lock_timeout = '2s';

ALTER TABLE activity_logs
  ALTER COLUMN lines_added TYPE smallint,
  ALTER COLUMN lines_deleted TYPE smallint;
