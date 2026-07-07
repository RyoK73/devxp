GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE projects TO authenticated;

GRANT SELECT ON TABLE activity_logs TO authenticated;

GRANT SELECT, INSERT, DELETE ON TABLE api_keys TO authenticated;

GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE rewards TO authenticated;

GRANT SELECT ON TABLE reward_logs TO authenticated;

GRANT SELECT ON TABLE reward_unlock_logs TO authenticated;
