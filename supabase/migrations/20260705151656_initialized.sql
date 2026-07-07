SET statement_timeout = 0;

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET client_encoding TO utf8;

SET standard_conforming_strings = 'on';

SELECT set_config('search_path', '', FALSE);

SET check_function_bodies = 'false';

SET xmloption = content;

SET client_min_messages = warning;

SET row_security = off;

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

COMMENT ON SCHEMA public IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  created_at date,
  user_id uuid NOT NULL,
  CONSTRAINT "projects_user_id_fkey"
  FOREIGN KEY
  (user_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

ALTER TABLE public.projects
  OWNER TO postgres,
  ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.projects IS 'プロジェクト情報の静的テーブル';

CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  key_hash text NOT NULL UNIQUE,
  name text NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
  DEFAULT NOW()
  NOT NULL,
  CONSTRAINT "api_keys_user_id_fkey"
  FOREIGN KEY
  (user_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

ALTER TABLE public.api_keys
  OWNER TO postgres,
  ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.api_keys IS 'apiキーの静的テーブル';

CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  required_xp int NOT NULL,
  daily_limit smallint DEFAULT 1 NOT NULL,
  repeat_type text
  DEFAULT CAST('daily' AS text)
  NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE
  DEFAULT NOW()
  NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
  DEFAULT NOW()
  NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT "rewards_user_id_fkey"
  FOREIGN KEY
  (user_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

ALTER TABLE public.rewards
  OWNER TO postgres,
  ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.rewards IS '報酬の静的テーブル';

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  project_id uuid NOT NULL,
  commit_hash_digest text NOT NULL,
  lines_added smallint DEFAULT 0 NOT NULL,
  lines_deleted smallint DEFAULT 0 NOT NULL,
  xp_earned int DEFAULT 0 NOT NULL,
  committed_at TIMESTAMP WITH TIME ZONE
  DEFAULT NOW()
  NOT NULL,
  CONSTRAINT "activity_logs_user_id_commit_hash_digest_key" UNIQUE (user_id,
  commit_hash_digest),
  CONSTRAINT "activity_logs_project_id_fkey"
  FOREIGN KEY
  (project_id)
  REFERENCES public.projects (id),
  CONSTRAINT "activity_logs_user_id_fkey"
  FOREIGN KEY
  (user_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

ALTER TABLE public.activity_logs
  OWNER TO postgres,
  ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.activity_logs IS 'CLIから登録したユーザーアクティビティの動的テーブル';

CREATE TABLE IF NOT EXISTS public.reward_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL,
  xp_amount bigint NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE
  DEFAULT NOW()
  NOT NULL,
  CONSTRAINT "reward_logs_reward_id_fkey"
  FOREIGN KEY
  (reward_id)
  REFERENCES public.rewards (id),
  CONSTRAINT "reward_logs_user_id_fkey"
  FOREIGN KEY
  (user_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

ALTER TABLE public.reward_logs
  OWNER TO postgres,
  ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.reward_logs IS '報酬へのXP投入履歴の動的テーブル';

CREATE TABLE IF NOT EXISTS public.reward_unlock_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE
  DEFAULT NOW()
  NOT NULL,
  CONSTRAINT "reward_unlock_logs_reward_id_fkey"
  FOREIGN KEY
  (reward_id)
  REFERENCES public.rewards (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT "reward_unlock_logs_user_id_fkey"
  FOREIGN KEY
  (user_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

ALTER TABLE public.reward_unlock_logs
  OWNER TO postgres,
  ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.reward_unlock_logs IS '報酬の解放履歴の動的テーブル';

CREATE POLICY access_own_projects
ON public.projects
AS permissive
FOR ALL
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id)
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY access_own_rewards
ON public.rewards
AS permissive
FOR ALL
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id)
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY delete_own_api
ON public.api_keys
AS permissive
FOR DELETE
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY insert_own_api
ON public.api_keys
AS permissive
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY select_own_activity_logs
ON public.activity_logs
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY select_own_api
ON public.api_keys
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY select_own_reward_logs
ON public.reward_logs
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY select_own_reward_unlock_logs
ON public.reward_unlock_logs
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() AS uid) = user_id);

ALTER PUBLICATION supabase_realtime OWNER TO postgres;

GRANT USAGE ON SCHEMA public TO postgres;

GRANT USAGE ON SCHEMA public TO anon;

GRANT USAGE ON SCHEMA public TO authenticated;

GRANT USAGE ON SCHEMA public TO service_role;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.activity_logs TO anon;

GRANT SELECT,
REFERENCES,
TRIGGER,
TRUNCATE,
MAINTAIN
ON TABLE public.activity_logs
TO authenticated;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.activity_logs TO service_role;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.api_keys TO anon;

GRANT SELECT,
INSERT,
REFERENCES,
DELETE,
TRIGGER,
TRUNCATE,
MAINTAIN
ON TABLE public.api_keys
TO authenticated;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.api_keys TO service_role;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.projects TO anon;

GRANT ALL ON TABLE public.projects TO authenticated;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.projects TO service_role;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.reward_logs TO anon;

GRANT SELECT, REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.reward_logs TO authenticated;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.reward_logs TO service_role;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.reward_unlock_logs TO anon;

GRANT SELECT,
REFERENCES,
TRIGGER,
TRUNCATE,
MAINTAIN
ON TABLE public.reward_unlock_logs
TO authenticated;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.reward_unlock_logs TO service_role;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.rewards TO anon;

GRANT ALL ON TABLE public.rewards TO authenticated;

GRANT REFERENCES, TRIGGER, TRUNCATE, MAINTAIN ON TABLE public.rewards TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;
