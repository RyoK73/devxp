import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-lg">
      <nav className="w-48 shrink-0 flex flex-col gap-sm text-on-surface-muted">
        <Link href="/dashboard/settings/reward-rules">報酬登録・編集</Link>
        <Link href="/dashboard/settings/filters">除外フィルター</Link>
        <Link href="/dashboard/settings/integrations">連携管理</Link>
        <Link href="/dashboard/settings/plan">プラン管理</Link>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}
