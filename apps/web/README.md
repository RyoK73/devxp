# devxp web

DevXP の Web ダッシュボード。CLI から送信された diff データを受け取り、XP を算出して Supabase に保存し、ダッシュボードとして表示する。

詳細な全体構成は[ルートREADME](../../README.md)を参照。

## 責任範囲

**担うこと**

- CLI からの diff データ受信（API キー認証）
- XP 算出ロジック（非公開）——CLI は OSS として npm 公開されるため、換算ロジックの改ざん（チート）を防ぐ目的で Web 側に閉じる
- Supabase への永続化
- GitHub OAuth によるユーザー識別
- ダッシュボード UI（レベル / XP バー / アクティビティヒートマップ / ご褒美システム / バッジ / ジャーナル）

**担わないこと**

- git diff の収集そのもの（[CLI](../cli/README.md)の責務）

## ディレクトリ構造（予定）

```
apps/web/
└── app/
    ├── api/            # CLI から diff を受け取るエンドポイント（予定）
    ├── (dashboard)/     # ダッシュボード画面（予定）
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番起動
pnpm start

# Lint
pnpm lint
```
