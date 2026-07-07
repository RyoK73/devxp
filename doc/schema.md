# Supabase スキーマ定義

## テーブル一覧

### `projects`（ユーザー定義のリポジトリ設定）

```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
display_name text NOT NULL
created_at   timestamptz NOT NULL DEFAULT now()
```

### `api_keys`（CLI 認証キー）

```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
key_hash     text NOT NULL UNIQUE
name         text NOT NULL
last_used_at timestamptz
created_at   timestamptz NOT NULL DEFAULT now()
```

### `activity_logs`（commit 単位の XP ログ）

```sql
id                 uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
project_id         uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE
commit_hash_digest text NOT NULL
lines_added        integer NOT NULL DEFAULT 0
lines_deleted      integer NOT NULL DEFAULT 0
xp_earned          integer NOT NULL DEFAULT 0
committed_at       timestamptz NOT NULL
created_at         timestamptz NOT NULL DEFAULT now()

UNIQUE(user_id, commit_hash_digest)
```

### `rewards`（報酬定義）

```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
name        text NOT NULL
description text
required_xp integer NOT NULL
daily_limit integer NOT NULL DEFAULT 1
repeat_type text NOT NULL DEFAULT 'daily'
created_at  timestamptz NOT NULL DEFAULT now()
updated_at  timestamptz NOT NULL DEFAULT now()
```

### `reward_logs`（報酬へのXP投入履歴）

```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
reward_id   uuid NOT NULL REFERENCES rewards(id) ON DELETE CASCADE
xp_amount   integer NOT NULL
created_at  timestamptz NOT NULL DEFAULT now()
```

### `reward_unlock_logs`（解放日時の記録）

```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
reward_id   uuid NOT NULL REFERENCES rewards(id) ON DELETE CASCADE
unlocked_at timestamptz NOT NULL DEFAULT now()
```

## 関連ドキュメント

- [RLS設計](rls.md) — Row Level Security のポリシー方針

## 設計メモ

- `auth.users` は Supabase 管理。`profiles` テーブルは作成しない
- `total_xp` はカラムとして持たず `activity_logs` の `SUM(xp_earned)` で導出する
- `commit_hash_digest` は SHA-256 ハッシュ済み（元の commit hash は保存しない）
- `projects.display_name` はユーザーが設定するカスタム名（実リポジトリ名は保存しない）
- 利用可能XP = `SUM(activity_logs.xp_earned)` − `SUM(reward_logs.xp_amount)`
- サイクル開始時刻は `repeat_type` から導出（`daily` = 今日0時、`weekly` = 今週月曜0時）
  - 今サイクルの投入済みXP → `SUM(reward_logs.xp_amount) WHERE created_at >= <cycle_start>`
  - 今サイクルの解放回数 → `COUNT(*) FROM reward_unlock_logs WHERE unlocked_at >= <cycle_start>`
