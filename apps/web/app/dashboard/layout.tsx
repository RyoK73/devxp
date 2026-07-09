import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      <aside className="w-56 shrink-0 bg-surface p-md">
        {/* TODO: sticky XPバー、背景ファクトリー(fixed) */}
        <nav className="flex flex-col gap-sm text-on-surface-muted">
          <Link href="/dashboard/stats">📊 統計情報</Link>
          <Link href="/dashboard/status">🧑 ステータス</Link>
          <Link href="/dashboard/rewards">🎁 Reward一覧</Link>
          <Link href="/dashboard/settings">⚙️ 設定</Link>
          <hr className="border-neutral" />
          <Link href="/docs">❓ ドキュメント</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-surface-elevated p-lg">{children}</main>
    </div>
  );
}
