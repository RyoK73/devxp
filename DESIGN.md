---
version: alpha
name: devxp
description: ダーク基調のゲーミフィケーション系開発者ツール。RuneScape/Melvor Idleにインスパイアされた深緑×青×ゴールドの配色で、フラットな階層UIによりXP換算・進捗の可視化を行う。
colors:
  primary: "#2E7D4F"
  secondary: "#2568C7"
  tertiary: "#E0A030"
  neutral: "#35424F"
  surface: "#141A22"
  surface-elevated: "#1B232D"
  surface-card: "#232D3A"
  on-surface: "#EDEDED"
  on-surface-muted: "#9AA5B1"
  error: "#D33A3A"
typography:
  display:
    fontFamily: "var(--font-geist-sans)"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: "var(--font-geist-sans)"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
  headline-md:
    fontFamily: "var(--font-geist-sans)"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: "var(--font-geist-sans)"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "var(--font-geist-sans)"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "var(--font-geist-sans)"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "#3B7FE0"
  button-accent:
    backgroundColor: "{colors.tertiary}"
    textColor: "#1A1305"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 16px
  badge-level:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-xp:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px
  progress-bar-skill:
    backgroundColor: "{colors.surface-elevated}"
    height: 8px
    rounded: "{rounded.full}"
  progress-bar-mastery:
    backgroundColor: "{colors.surface-elevated}"
    height: 8px
    rounded: "{rounded.full}"
  input:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 8px
  nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
---

# devxp DESIGN.md

## Overview

devxpは、開発活動をXP（経験値）に換算して可視化する開発者向けツールである。ブランドの核は「実務ツールとしての明快さ」と「ゲームの達成感」の両立にあり、参考UIとして採用したMelvor Idle（RuneScapeにインスパイアされたブラウザ版アイドルRPG）の実際のゲーム画面を解析した結果、装飾過多なファンタジー表現ではなく、**フラットでモダンなダークダッシュボードUI**であることが判明した。devxpはこの実態に忠実に、シャドウを使わないトーナルレイヤーと差し色バーによる階層表現、緑を基調としたスキル/進捗表現、青いアクションボタン、ゴールドを実績・XP消費などの「ここぞ」の瞬間に限定使用する配色戦略を採用する。

対象ユーザーは開発者自身であり、UIが喚起すべき感情は「静かな没頭」と「レベルアップの瞬間の高揚感」のコントラストである。画面の大部分は落ち着いたダークトーンで情報密度を保ちつつ、XP獲得やレベルアップなど達成イベントの瞬間だけ`primary`や`tertiary`を強く効かせる。

## Colors

- `primary`（`#2E7D4F`）: RuneScape伝統の深緑。スキル系のヘッダー、レベルバッジ、進捗バーのメインカラーとして最も高頻度に使用する。
- `secondary`（`#2568C7`）: 実行系アクションボタン・XPバッジ・リンクに使う青。実画面の「OK」「Force Save」ボタンの使われ方に対応する。
- `tertiary`（`#E0A030`）: GP（コイン）・マスタリー・トロフィー実績のハイライト専用のゴールド。多用せず、達成演出の一点にのみ使うことで特別感を保つ。
- `neutral`（`#35424F`）: カードや区切り線の境界線。差し色バー以外の輪郭に使う。
- `surface` / `surface-elevated` / `surface-card`: サイドバー最暗→メイン背景→カードの3段階トーナルレイヤー。ダークテーマを基準とする。
- `on-surface` / `on-surface-muted`: 本文テキストとラベル・補助テキスト。
- `error`（`#D33A3A`）: 戦闘・危険・失敗状態に相当するエラー表現。

## Typography

フォントは既存コードベースが採用するGeist Sans（`var(--font-geist-sans)`）を継続使用し、装飾フォントは追加しない。実務ツールとしての可読性を最優先しつつ、`display`/`headline-*`でfontWeight 700とletterSpacingを効かせることで、Melvor Idle実画面に見られる「太字サンセリフのみで力強さを出す」スタイルを再現する。`label-md`はボタンラベルやバッジに使い、letterSpacingを広めに取ることでゲームUI的な締まりを出す。

## Layout

Fluidグリッドを基本とし、コンテナ内パディングは4pxベースのspacingスケール（`xs`〜`2xl`）に従う。実画面同様、左サイドバー（ナビゲーション）＋メインコンテンツという2カラム構成を基本形とし、メインコンテンツ内はカードのグリッドで機能単位を並べる。

## Elevation & Depth

シャドウはほぼ使用しない。実際のMelvor Idle UIがそうであるように、`surface`→`surface-elevated`→`surface-card`の明度差による3段階のトーナルレイヤーと、`neutral`の細い境界線、そしてカード上部の`primary`色バー（4px程度）によって視覚的階層を作る。

## Shapes

角丸は控えめに保つ（`sm: 4px`〜`lg: 12px`）。カードやボタンなど大半の要素は`sm`〜`md`程度の端正な角丸とし、レベル/XPバッジなどのpill要素にのみ`full`を使う。角丸とシャープの混在は避け、同一画面内での一貫性を保つ。

## Components

- **button-primary**: `secondary`（青）背景の実行系CTA。ホバーで明るい青に変化。
- **button-accent**: `tertiary`（ゴールド）背景。XP消費・実績関連など「特別なアクション」にのみ使用。
- **card**: `surface-card`背景＋上部`primary`色バー＋`neutral`境界線。シャドウなし。
- **badge-level / badge-xp**: pill形状のバッジ。レベルは`primary`、XPは`secondary`で色分け。
- **progress-bar-skill / progress-bar-mastery**: スキル進捗は`primary`、マスタリー/実績進捗は`tertiary`で塗り分け、ユーザーが一目で種類を判別できるようにする。
- **input / nav**: 実装がまだ乏しいため、一般的なdevツールのコンポーネントセットとして定義。`surface-elevated`背景に`neutral`境界線というシンプルな構成。

## Do's and Don'ts

- Do: `primary`はスキル系ヘッダー・レベルバッジ・進捗バーなど「進捗」を表す要素に一貫して使う
- Do: `tertiary`（ゴールド）は実績・マスタリー・XP消費など「達成の瞬間」にのみ使い、多用しない
- Do: カード等の階層表現はシャドウではなくトーナルレイヤー＋差し色バーで行う
- Do: WCAG AA基準（通常テキスト4.5:1、大きいテキスト3:1）を維持する
- Don't: `tertiary`（ゴールド, `#E0A030`）の背景に白文字を使わない（コントラスト比2.3:1でAA未達）。ゴールド背景には濃色テキスト（例: `#1A1305`）を使うこと
- Don't: `primary`（深緑, `#2E7D4F`）を`surface`上の本文サイズの文字色として使わない（コントラスト比3.2:1でAA未達）。見出し等の大きな文字・アイコン用途に限定すること
- Don't: 同一画面で角丸とシャープなエッジを混在させない
