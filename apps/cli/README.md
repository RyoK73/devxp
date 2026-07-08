# devxp cli

DevXP の CLI。git commit 時の diff 情報を収集し、Web API へ送信する OSS ツール（npm 公開）。

詳細な全体構成やコマンド一覧は[ルートREADME](../../README.md#cli-の使い方)を参照。

## 責任範囲

**担うこと**

- `git log` からの diff 収集（追加 / 削除行数）
- API キーの初期設定（`devxp init`）
- 手動での diff 送信（`devxp sync`）
- post-commit hook の自動設定（`devxp install`）
- 収集した生 diff データの Web API への送信（API キー認証）

**担わないこと**

- XP 算出ロジック——CLI は OSS として npm 公開されるため、換算ロジックの改ざん（チート）を防ぐ目的で意図的に含めない。算出は非公開の [Web](../web/README.md) 側で行う

## ディレクトリ構造（予定）

```
apps/cli/
└── src/
    ├── commands/
    │   ├── init.ts      # API キー登録
    │   ├── sync.ts      # 手動同期
    │   └── install.ts   # post-commit hook 設定
    └── lib/
        └── git.ts       # git log / diff 収集
```

## 開発コマンド

実装は未着手であり、現状 `package.json` にはテストスクリプトのプレースホルダーのみが存在する。コマンド群は今後 `src/` 配下に整備する予定。
