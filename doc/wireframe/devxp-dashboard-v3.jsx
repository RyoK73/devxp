import { useState, useRef, useCallback, useEffect } from "react";

const INITIAL_REWARDS = [
  { id: 1, name: "コーヒー1杯", cost: 500, filled: 0, confirmed: 0, unlocked: false, emoji: "☕" },
  { id: 2, name: "ガチャ1回", cost: 1200, filled: 0, confirmed: 0, unlocked: false, emoji: "🎰" },
  { id: 3, name: "ゲーム30分", cost: 300, filled: 300, confirmed: 300, unlocked: true, emoji: "🎮" },
  { id: 4, name: "好きなもの買う", cost: 3000, filled: 800, confirmed: 800, unlocked: false, emoji: "🛍️" },
  { id: 5, name: "昼寝タイム", cost: 800, filled: 200, confirmed: 200, unlocked: false, emoji: "😴" },
];

const mockBadges = [
  { id: 1, name: "First Commit", desc: "最初のコミット", unlocked: true, emoji: "⚔️" },
  { id: 2, name: "Code Warrior", desc: "累計10,000行", unlocked: true, emoji: "🛡️" },
  { id: 3, name: "Night Owl", desc: "深夜コーディング", unlocked: false, emoji: "🦉" },
  { id: 4, name: "Streak ×7", desc: "7日連続", unlocked: false, emoji: "🔥" },
  { id: 5, name: "Refactor King", desc: "削除行 > 追加行", unlocked: false, emoji: "✂️" },
  { id: 6, name: "Marathon", desc: "1日500行超", unlocked: true, emoji: "🏃" },
];

const heatmapData = Array.from({ length: 70 }, (_, i) => ({
  day: i,
  xp: Math.random() > 0.35 ? Math.floor(Math.random() * 500) : 0,
}));

// XP換算設定
const XP_RULES = { addPerLine: 2, deletePerLine: 1 };

function getHeatColor(xp) {
  if (xp === 0) return "rgba(255,255,255,0.04)";
  if (xp < 100) return "rgba(99,102,241,0.25)";
  if (xp < 250) return "rgba(99,102,241,0.5)";
  if (xp < 400) return "rgba(99,102,241,0.75)";
  return "#6366f1";
}

function XPBar({ current, max }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #6366f1, #a78bfa)" }} />
    </div>
  );
}

// XP換算UIパネル
function XPCalcPanel() {
  const [addLines, setAddLines] = useState(100);
  const [delLines, setDelLines] = useState(50);
  const xp = addLines * XP_RULES.addPerLine + delLines * XP_RULES.deletePerLine;

  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>XP換算レート</span>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>
          +{xp.toLocaleString()} XP
        </span>
      </div>

      <div className="space-y-4">
        {/* 追加行数 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>追加行数</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#34d399", fontFamily: "'DM Mono', monospace" }}>
                +{(addLines * XP_RULES.addPerLine).toLocaleString()} XP
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
                ({addLines} 行 × {XP_RULES.addPerLine})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="range" min="0" max="500" value={addLines}
              onChange={(e) => setAddLines(Number(e.target.value))}
              className="flex-1" style={{ accentColor: "#6366f1", cursor: "pointer" }} />
            <input type="number" min="0" value={addLines}
              onChange={(e) => setAddLines(Math.max(0, Number(e.target.value)))}
              className="w-16 text-xs text-center rounded-lg px-2 py-1"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontFamily: "'DM Mono', monospace" }} />
          </div>
        </div>

        {/* 削除行数 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>削除行数</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#f87171", fontFamily: "'DM Mono', monospace" }}>
                +{(delLines * XP_RULES.deletePerLine).toLocaleString()} XP
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
                ({delLines} 行 × {XP_RULES.deletePerLine})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="range" min="0" max="500" value={delLines}
              onChange={(e) => setDelLines(Number(e.target.value))}
              className="flex-1" style={{ accentColor: "#8b5cf6", cursor: "pointer" }} />
            <input type="number" min="0" value={delLines}
              onChange={(e) => setDelLines(Math.max(0, Number(e.target.value)))}
              className="w-16 text-xs text-center rounded-lg px-2 py-1"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontFamily: "'DM Mono', monospace" }} />
          </div>
        </div>

        {/* 合計 */}
        <div className="rounded-xl p-3 flex items-center justify-between"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="space-y-0.5">
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>合計獲得XP</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
              ({addLines}行×{XP_RULES.addPerLine}) + ({delLines}行×{XP_RULES.deletePerLine})
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: "#a78bfa" }}>
            {xp.toLocaleString()}
            <span className="text-sm font-normal ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardCard({ reward, onHoldStart, onHoldEnd, onMinus, onReset, pendingXP, availableXP }) {
  const totalFilled = reward.confirmed + pendingXP;
  const pct = Math.min((totalFilled / reward.cost) * 100, 100);
  const confirmedPct = Math.min((reward.confirmed / reward.cost) * 100, 100);
  const canAdd = availableXP > 0 && !reward.unlocked && totalFilled < reward.cost;
  const canMinus = pendingXP > 0;
  const isAlmostFull = pct >= 80 && pct < 100;
  const remaining = reward.cost - totalFilled;

  return (
    <div className="rounded-2xl p-4 transition-all duration-200"
      style={{
        background: reward.unlocked ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)",
        border: reward.unlocked
          ? "1px solid rgba(52,211,153,0.2)"
          : isAlmostFull
          ? "1px solid rgba(99,102,241,0.4)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isAlmostFull ? "0 0 24px rgba(99,102,241,0.12)" : "none",
      }}>

      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{reward.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: reward.unlocked ? "#34d399" : "#e2e8f0" }}>
            {reward.name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>
            {totalFilled.toLocaleString()} / {reward.cost.toLocaleString()} XP
            {pendingXP > 0 && (
              <span style={{ color: "#fbbf24" }}> (+{pendingXP.toLocaleString()} 仮)</span>
            )}
          </div>
        </div>
        {reward.unlocked ? (
          <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
            style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>解放済</span>
        ) : (
          <span className="text-xs flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
            残 {remaining.toLocaleString()}
          </span>
        )}
      </div>

      {/* ゲージ：確定分＋仮分を重ねて表示 */}
      {!reward.unlocked && (
        <div className="relative h-2.5 rounded-full overflow-hidden mb-3"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          {/* 確定済み */}
          <div className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${confirmedPct}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              transition: "width 0.3s ease",
            }} />
          {/* 仮置き（黄色） */}
          {pendingXP > 0 && (
            <div className="absolute inset-y-0 rounded-full"
              style={{
                left: `${confirmedPct}%`,
                width: `${Math.min(pct - confirmedPct, 100 - confirmedPct)}%`,
                background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                transition: "width 0.15s ease",
              }} />
          )}
          {/* グロー */}
          {pct > 0 && (
            <div className="absolute inset-y-0 left-0 rounded-full opacity-30 blur-sm"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #6366f1, #a78bfa)",
              }} />
          )}
        </div>
      )}

      {/* 解放済みゲージ */}
      {reward.unlocked && (
        <div className="relative h-2.5 rounded-full overflow-hidden mb-3"
          style={{ background: "rgba(52,211,153,0.1)" }}>
          <div className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #34d399, #6ee7b7)" }} />
        </div>
      )}

      {/* 操作ボタン */}
      {!reward.unlocked && (
        <div className="flex gap-2">
          {/* マイナス */}
          <button
            onClick={() => onMinus(reward.id)}
            disabled={!canMinus}
            className="w-9 h-9 rounded-xl text-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: canMinus ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.03)",
              border: canMinus ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: canMinus ? "#fbbf24" : "rgba(255,255,255,0.1)",
              cursor: canMinus ? "pointer" : "not-allowed",
            }}>
            −
          </button>

          {/* 長押し */}
          <button
            onMouseDown={() => onHoldStart(reward.id)}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
            onTouchStart={(e) => { e.preventDefault(); onHoldStart(reward.id); }}
            onTouchEnd={onHoldEnd}
            disabled={!canAdd}
            className="flex-1 h-9 rounded-xl text-sm font-medium transition-all select-none"
            style={{
              background: canAdd
                ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))"
                : "rgba(255,255,255,0.03)",
              border: canAdd
                ? "1px solid rgba(99,102,241,0.35)"
                : "1px solid rgba(255,255,255,0.06)",
              color: canAdd ? "#a78bfa" : "rgba(255,255,255,0.15)",
              cursor: canAdd ? "pointer" : "not-allowed",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}>
            {canAdd ? "長押しで注ぐ ＋" : availableXP === 0 ? "XP 不足" : "満タン"}
          </button>

          {/* リセット */}
          <button
            onClick={() => onReset(reward.id)}
            disabled={pendingXP === 0}
            className="w-9 h-9 rounded-xl text-sm flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: pendingXP > 0 ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
              border: pendingXP > 0 ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(255,255,255,0.06)",
              color: pendingXP > 0 ? "#f87171" : "rgba(255,255,255,0.1)",
              cursor: pendingXP > 0 ? "pointer" : "not-allowed",
            }}>
            ↺
          </button>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl text-center"
      style={{
        background: badge.unlocked ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.02)",
        border: badge.unlocked ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(255,255,255,0.05)",
      }}>
      <span className="text-3xl" style={{ filter: badge.unlocked ? "none" : "grayscale(1) opacity(0.2)" }}>
        {badge.emoji}
      </span>
      <div className="text-xs font-medium" style={{ color: badge.unlocked ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
        {badge.name}
      </div>
      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>{badge.desc}</div>
    </div>
  );
}

export default function DevXPDashboard() {
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  // pendingXP: 仮置きXP { rewardId: amount }
  const [pendingMap, setPendingMap] = useState({});
  const [availableXP, setAvailableXP] = useState(1847);
  const [tab, setTab] = useState("rewards");
  const [unlockFlash, setUnlockFlash] = useState(null);

  const holdRef = useRef(null);
  const fillingIdRef = useRef(null);

  const totalXP = 8432;
  const level = 12;
  const nextLevelXP = 2000;
  const currentLevelXP = 1847;
  const todayLines = 312;

  // 仮置き合計
  const totalPending = Object.values(pendingMap).reduce((a, b) => a + b, 0);
  const hasPending = totalPending > 0;

  // 長押しtick
  const fillTick = useCallback(() => {
    const id = fillingIdRef.current;
    if (id === null) return;

    setAvailableXP((xp) => {
      if (xp <= 0) { clearInterval(holdRef.current); return xp; }

      setRewards((prev) => {
        const reward = prev.find((r) => r.id === id);
        if (!reward || reward.unlocked) return prev;

        setPendingMap((pm) => {
          const currentPending = pm[id] || 0;
          const totalFilled = reward.confirmed + currentPending;
          const addAmount = Math.min(10, reward.cost - totalFilled, xp);
          if (addAmount <= 0) { clearInterval(holdRef.current); return pm; }
          return { ...pm, [id]: currentPending + addAmount };
        });

        return prev;
      });

      // xpはpendingMap更新後に減らす（近似）
      return xp - Math.min(10, xp);
    });
  }, []);

  const handleHoldStart = useCallback((id) => {
    fillingIdRef.current = id;
    holdRef.current = setInterval(fillTick, 80);
  }, [fillTick]);

  const handleHoldEnd = useCallback(() => {
    clearInterval(holdRef.current);
    fillingIdRef.current = null;
  }, []);

  // マイナス（仮置きを50減らす）
  const handleMinus = useCallback((id) => {
    setPendingMap((pm) => {
      const cur = pm[id] || 0;
      const sub = Math.min(50, cur);
      setAvailableXP((xp) => xp + sub);
      const next = cur - sub;
      return next <= 0 ? { ...pm, [id]: 0 } : { ...pm, [id]: next };
    });
  }, []);

  // リセット（仮置きを全戻し）
  const handleReset = useCallback((id) => {
    setPendingMap((pm) => {
      const cur = pm[id] || 0;
      setAvailableXP((xp) => xp + cur);
      return { ...pm, [id]: 0 };
    });
  }, []);

  // 全体確定
  const handleConfirm = useCallback(() => {
    setRewards((prev) =>
      prev.map((r) => {
        const pending = pendingMap[r.id] || 0;
        if (pending === 0 || r.unlocked) return r;
        const newConfirmed = r.confirmed + pending;
        const unlocked = newConfirmed >= r.cost;
        if (unlocked) {
          setUnlockFlash(r.name);
          setTimeout(() => setUnlockFlash(null), 2500);
        }
        return { ...r, confirmed: Math.min(newConfirmed, r.cost), unlocked };
      })
    );
    setPendingMap({});
  }, [pendingMap]);

  useEffect(() => () => clearInterval(holdRef.current), []);

  return (
    <div className="min-h-screen p-4 md:p-8"
      style={{
        background: "#0a0a0f",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 10% 0%, rgba(99,102,241,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 90% 100%, rgba(139,92,246,0.08) 0%, transparent 50%)
        `,
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input[type=range] { height: 4px; }
      `}</style>

      {/* アンロックフラッシュ */}
      {unlockFlash && (
        <div className="fixed top-6 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(99,102,241,0.5)",
            whiteSpace: "nowrap",
          }}>
          🎉 {unlockFlash} を解放しました！
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">

        {/* ヘッダー */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>⚡</div>
            <span className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>DevXP</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>
            ryoma.dev
          </span>
        </div>

        {/* ステータス */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))", border: "1px solid rgba(99,102,241,0.4)" }}>
              👨‍💻
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>LEVEL</span>
                <span className="text-4xl font-bold" style={{ color: "#fff", lineHeight: 1 }}>{level}</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(99,102,241,0.2)", color: "#a78bfa" }}>Code Warrior</span>
              </div>
              <div className="mt-3 space-y-1.5">
                <XPBar current={currentLevelXP} max={nextLevelXP} />
                <div className="flex justify-between text-xs"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>
                  <span>{currentLevelXP.toLocaleString()} XP</span>
                  <span>次のレベルまで {(nextLevelXP - currentLevelXP).toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="my-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "利用可能XP", value: availableXP.toLocaleString(), unit: "xp", color: "#6366f1" },
              { label: "累計XP", value: totalXP.toLocaleString(), unit: "xp", color: "#8b5cf6" },
              { label: "今日の行数", value: todayLines, unit: "lines", color: "#a78bfa" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'DM Mono', monospace" }}>{s.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ヒートマップ */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>アクティビティ</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>10 weeks</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(70, 1fr)", gap: "3px" }}>
            {heatmapData.map((d) => (
              <div key={d.day} title={`${d.xp} XP`} className="rounded-sm"
                style={{ height: "10px", background: getHeatColor(d.xp) }} />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>少</span>
            {["rgba(99,102,241,0.2)", "rgba(99,102,241,0.45)", "rgba(99,102,241,0.7)", "#6366f1"].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
            ))}
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>多</span>
          </div>
        </div>

        {/* タブ */}
        <div className="flex rounded-xl p-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ key: "rewards", label: "ご褒美" }, { key: "calc", label: "XP換算" }, { key: "badges", label: "バッジ" }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                background: tab === t.key ? "rgba(99,102,241,0.3)" : "transparent",
                color: tab === t.key ? "#a78bfa" : "rgba(255,255,255,0.3)",
                border: "none", cursor: "pointer",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* リワードタブ */}
        {tab === "rewards" && (
          <div className="space-y-3">
            <div className="px-1">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                長押しでXPを仮置き → 確定で反映されます
              </p>
            </div>

            {rewards.map((r) => (
              <RewardCard
                key={r.id}
                reward={r}
                onHoldStart={handleHoldStart}
                onHoldEnd={handleHoldEnd}
                onMinus={handleMinus}
                onReset={handleReset}
                pendingXP={pendingMap[r.id] || 0}
                availableXP={availableXP}
              />
            ))}

            <button className="w-full py-3 rounded-xl text-sm transition-all"
              style={{
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.25)", cursor: "pointer",
              }}>
              ＋ ご褒美を追加
            </button>

            {/* 振り分け確定ボタン */}
            <div className="pt-1">
              <button
                onClick={handleConfirm}
                disabled={!hasPending}
                className="w-full py-4 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  background: hasPending
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.04)",
                  border: hasPending
                    ? "1px solid rgba(99,102,241,0.5)"
                    : "1px solid rgba(255,255,255,0.06)",
                  color: hasPending ? "#fff" : "rgba(255,255,255,0.2)",
                  cursor: hasPending ? "pointer" : "not-allowed",
                  boxShadow: hasPending ? "0 4px 24px rgba(99,102,241,0.35)" : "none",
                  letterSpacing: "0.02em",
                }}>
                {hasPending
                  ? `振り分けを確定する（${totalPending.toLocaleString()} XP）`
                  : "XPを振り分けてください"}
              </button>
            </div>
          </div>
        )}

        {/* XP換算タブ */}
        {tab === "calc" && <XPCalcPanel />}

        {/* バッジタブ */}
        {tab === "badges" && (
          <div className="grid grid-cols-3 gap-3">
            {mockBadges.map((b) => (<BadgeCard key={b.id} badge={b} />))}
          </div>
        )}

      </div>
    </div>
  );
}
