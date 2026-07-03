CREATE POLICY access_own_projects
ON projects
AS permissive
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY select_own_activity_logs
ON activity_logs
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY select_own_api
ON api_keys
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY insert_own_api
ON api_keys
AS permissive
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY delete_own_api
ON api_keys
AS permissive
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY access_own_rewards
ON rewards
AS permissive
FOR ALL
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY select_own_reward_logs
ON reward_logs
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY select_own_reward_unlock_logs
ON reward_unlock_logs
AS permissive
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);
