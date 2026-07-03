SET LOCAL lock_timeout = '2s';

ALTER TABLE public.projects
  DROP CONSTRAINT projects_display_name_key;

ALTER TABLE public.activity_logs
  DROP CONSTRAINT activity_logs_commit_hash_digest_key;

ALTER TABLE public.activity_logs
  DROP CONSTRAINT activity_logs_project_id_key;

ALTER TABLE public.activity_logs
  DROP CONSTRAINT activity_logs_user_id_key;

ALTER TABLE public.activity_logs
  ADD CONSTRAINT "activity_logs_user_id_commit_hash_digest_key" UNIQUE (user_id,
  commit_hash_digest);

ALTER TABLE public.api_keys
  ALTER COLUMN user_id DROP DEFAULT;
