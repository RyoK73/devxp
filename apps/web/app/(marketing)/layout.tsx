import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-neutral p-md">
        {/* TODO: Supabaseセッション有無でCTAを出し分ける(ログイン中: 「ダッシュボードへ」/dashboard、未ログイン: 「GitHubで登録/ログイン」/login) */}
        <Link href="/login" className="text-on-surface">
          GitHubで登録/ログイン
        </Link>
      </header>
      {children}
      <footer className="border-t border-neutral p-md">
        {/* TODO: ロゴ + GitHub + X リンク */}
      </footer>
    </>
  );
}
