# DevXP — Next.js App Router 構成

## ディレクトリ構成(最終版)

```
app/
├── (marketing)/
│   ├── layout.tsx                    # ヘッダー/フッター共通。サーバー側でセッションを確認しCTAを出し分け
│   ├── page.tsx                      # Landing Page              →  /
│   ├── trial/
│   │   └── page.tsx                  # 試用モード(git log貼付→XP計算デモ)  →  /trial
│   ├── pricing/
│   │   └── page.tsx                  # 料金                       →  /pricing
│   └── docs/
│       └── page.tsx                  # ドキュメント(トップ)          →  /docs
│
├── login/
│   └── page.tsx                      # Login Page(loading/error stateはsearchParamsで判定)  →  /login
├── auth/
│   └── callback/
│       └── route.ts                  # Supabase OAuth callback(Route Handler、code交換)
├── logout/
│   └── page.tsx                      # Logout Page(送別トロフィー画面)  →  /logout
│
├── dashboard/
│   ├── layout.tsx                    # アプリシェル本体: サイドバー+sticky XPバー+背景ファクトリー(fixed)
│   ├── page.tsx                      # /dashboard → /dashboard/stats へredirect
│   ├── stats/
│   │   └── page.tsx                  # 📊 統計情報      →  /dashboard/stats
│   ├── status/
│   │   └── page.tsx                  # 🧑 ステータス     →  /dashboard/status
│   ├── rewards/
│   │   └── page.tsx                  # 🎁 Reward一覧     →  /dashboard/rewards
│   └── settings/
│       ├── layout.tsx                # 設定内リストナビ(報酬登録/除外フィルター/連携管理/プラン管理)
│       ├── page.tsx                  # /dashboard/settings → /dashboard/settings/reward-rules へredirect
│       ├── reward-rules/
│       │   └── page.tsx              # 報酬登録・編集フォーム   →  /dashboard/settings/reward-rules
│       ├── filters/
│       │   └── page.tsx              # 除外フィルター           →  /dashboard/settings/filters
│       ├── integrations/
│       │   └── page.tsx              # 連携管理(GitHub連携状態) →  /dashboard/settings/integrations
│       └── plan/
│           └── page.tsx              # プラン管理(実体は/pricingへのリンクのみ)  →  /dashboard/settings/plan
│
└── middleware.ts                      # /dashboard/* はSupabaseセッション必須。未ログインは/loginへ
```

---

## ルーティング上の決定事項

### 1. ダッシュボード内パネルはURLを持たせる
統計情報/ステータス/Reward一覧/設定は、クライアント側stateではなくApp Routerの共有`layout.tsx`+サブページとして実装する。理由:
- `/dashboard/rewards`のように直接共有・ブックマークできる
- ブラウザの戻る/進むが自然に機能する
- `dashboard/layout.tsx`はページ遷移時に再マウントされないため、サイドバーや背景ファクトリーのアニメーションが途切れず、「クリックで即座にコンテンツだけ切り替わる」というMMO的な挙動がApp Router標準の仕組みでそのまま実現できる

### 2. Route Group `(marketing)` と `dashboard` の分離
未ログイン面(Landing/試用/料金/ドキュメント)とログイン後(dashboard)はヘッダー・フッターの構造が根本的に違うため、Route Groupで別の`layout.tsx`に分ける。URLパスには影響しない。

### 3. `/docs`・`/pricing` はログイン前後で共通の1ルートのみ
当初「ログイン中は`/docs`もdashboard配下に複製するか」を検討したが、同じ内容を2箇所でメンテナンスすると内容やデザインが乖離するリスクがあるため却下。

**結論**: `/docs`と`/pricing`は`(marketing)`側に1つだけ存在させる。ログイン中のユーザーがサイドバーから`/docs`へ遷移した場合、一時的にdashboardのアプリシェルを抜けるが、`(marketing)/layout.tsx`のヘッダーには元々ログイン状態を見て「ダッシュボードへ」ボタンが出る実装になっているため、迷子にならず1クリックで戻れる。

**原則**: layout・CTA文言などの「見た目の出し分け」はログイン状態で分岐させてよいが、ページの実体(コンテンツ・構造)自体は分岐させない。

### 4. `(marketing)/layout.tsx` のCTA出し分け
サーバーコンポーネントでSupabaseのセッション有無を確認し、ヘッダー右上の同じ位置のボタンを出し分ける。クライアント側の状態管理は不要。

```tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <>
      <header>
        {session ? (
          <a href="/dashboard" className="button-primary">ダッシュボードへ</a>
        ) : (
          <a href="/login" className="button-primary">GitHubで登録/ログイン</a>
        )}
      </header>
      {children}
      <footer>{/* ロゴ + GitHub + X */}</footer>
    </>
  )
}
```

### 5. ダッシュボードから(marketing)への導線
サイドバー下部に区切り線を入れ、小さなユーティリティアイコン(❓ドキュメント)から`/docs`へリンクする。料金/プランは独自ページを持たせず、設定内の新しい行「プラン管理」(`/dashboard/settings/plan`)から`/pricing`へリンクするだけに留める。

### 6. `reward-rules` と `rewards` の命名分離
どちらも「報酬」を扱うが、性質が異なるため命名を分ける:
- `/dashboard/rewards` — ユーザー向けの閲覧・アンロック画面
- `/dashboard/settings/reward-rules` — 報酬の登録・編集フォーム

同じ`rewards`という単語を2箇所で使うとURLだけ見たときに紛らわしくなるための配慮。

### 7. `page.tsx`のみのredirect
`/dashboard`と`/dashboard/settings`はコンテンツを持たず、`redirect()`でデフォルトのサブページに飛ばすだけにする。これによりサイドバー側の「選択中ハイライト」判定が、常にサブページのpathnameを見るだけで済みシンプルになる。

### 8. 認証ガード
`middleware.ts`で`/dashboard`以下すべてに対しSupabaseセッションの有無をチェックし、未ログインなら`/login`へリダイレクトする。GitHub OAuthのcode交換自体は`auth/callback/route.ts`(Route Handler)で行い、成功後は`/dashboard`へリダイレクトする。

---

## 次のステップ候補
- `dashboard/layout.tsx`(アプリシェル本体: サイドバー+XPバー+背景ファクトリー)のコンポーネント設計
- `dashboard/settings/layout.tsx`(Melvor風リストナビ)の実装イメージ
- `docs/[slug]/page.tsx`など、ドキュメントが増えた場合の動的ルート設計
