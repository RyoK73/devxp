# RLS 設計

## 設計原則

### 書き込み経路によるRLS範囲の分岐

業務ロジックの検証（残XP計算、サイクル制限など）が必要な書き込みは、Next.js の API Route から `service_role` 経由で行い、RLS をバイパスする。`authenticated` にはその代わり SELECT のみ許可する。

一方、単純に「自分の行を作る/直す/消す」だけの静的データ（プロジェクトの登録・報酬の定義など）は、Web クライアントから `authenticated` として直接 CRUD させる。

RLS の `USING`/`WITH CHECK` 句は「その行が自分のものか」というオーナーシップしか判定できない。残XPの計算やサイクル制限のような業務ロジックまでRLSやDB制約側に寄せようとすると、ロジックがDBとアプリの両方に分散して保守しづらくなるため、検証が必要な書き込みはバックエンドに集約する。

### ログ系テーブルは追記のみ

`activity_logs` / `reward_logs` / `reward_unlock_logs` は、UPDATE/DELETE のポリシーを意図的に作らない。ポリシーが存在しない操作はデフォルトで拒否されるため、`authenticated` からはこれらのログを一切書き換え・削除できず、履歴の改ざんを防げる。

### `(select auth.uid())` によるパフォーマンス最適化

ポリシーの条件式は `auth.uid() = user_id` ではなく `(select auth.uid()) = user_id` の形で書く。

`auth.uid()` を素のまま書くと、行ごとのフィルタ評価の中で呼び出しが行われうる。`(select auth.uid())` のように相関のないサブクエリとして包むと、PostgreSQL のプランナはこれを InitPlan として扱い、クエリ実行につき1回だけ評価してその結果を使い回す。スキャンする行数が多いテーブルほど効果が大きいため、行数が伸びていく `activity_logs` / `reward_logs` / `reward_unlock_logs` で特に有効。

## テーブルごとの許可操作

| テーブル | authenticated の範囲 | 備考 |
|---|---|---|
| `projects` | SELECT/INSERT/UPDATE/DELETE（own） | |
| `activity_logs` | SELECT のみ | 書き込みは CLI → API Route（service_role） |
| `api_keys` | SELECT/INSERT/DELETE（own） | UPDATE（`last_used_at`）は API 検証時に service_role 側で実施 |
| `rewards` | SELECT/INSERT/UPDATE/DELETE（own） | |
| `reward_logs` | SELECT のみ | 投入は API 経由 |
| `reward_unlock_logs` | SELECT のみ | 解放記録も API 経由 |
