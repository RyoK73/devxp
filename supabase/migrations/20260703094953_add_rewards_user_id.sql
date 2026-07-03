ALTER TABLE public.rewards ADD COLUMN user_id uuid NOT NULL;
ALTER TABLE public.rewards ADD CONSTRAINT rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
