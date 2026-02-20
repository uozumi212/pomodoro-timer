# ポモドーロタイマー

![タイマーアイコン](public/タイマーアイコン.png)

## 概要

ポモドーロテクニックを手軽に取り入れ、作業効率化を支援する Web アプリです。

> ポモドーロテクニックとは → [参考リンク](https://www.seraku.co.jp/tectec-note/recruit/recruit_pomodoro/)

## 🔗 ライブデモ

https://pomodoro-timer-1d0fe.web.app

## ✨ 機能

- ⏱ 作業時間・休憩時間のカスタマイズ（分単位で入力可能）
- 🔄 タイマー終了時に自動で作業 ↔ 休憩を切り替え
- 🎨 外観テーマ切替（ライト・ダーク・レトロ・各カラーテーマ）
- 🖌 タイマー円内の背景色をカラーピッカーで自由に変更
- 🔔 タイマー終了時の通知（ブラウザ通知 + カスタムサウンド）
- 🔊 通知音声のアップロード・音量調整
- 📝 タスクメモ機能
- 🗒 メモ帳機能
- 🕐 現在時刻の表示（ドラッグ可能なフローティングウィンドウ）
- 📖 操作説明書モーダル

## 🛠 使用技術

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 18 / TypeScript |
| UI ライブラリ | Chakra UI 2 |
| ビルドツール | Vite |
| ホスティング | Firebase Hosting |

## 📦 インストール

**動作確認済み環境:** Node.js 18 以上

```bash
git clone https://github.com/<your-username>/pomodoro-timer.git
cd pomodoro-timer
npm install
```

## 🚀 開発用コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # プロダクションビルド (dist/ に出力)
npm run preview  # ビルド結果のローカルプレビュー
npm run lint     # ESLint 実行
```

## 🔥 Firebase へのデプロイ

### 初回のみ：Firebase CLI のセットアップ

```bash
# Firebase CLI をインストール（未インストールの場合）
npm install -g firebase-tools

# Firebase にログイン
firebase login

# プロジェクトの確認（pomodoro-timer-1d0fe が表示されればOK）
firebase projects:list
```

### デプロイ手順（毎回）

```bash
# 1. プロダクションビルド
npm run build

# 2. Firebase Hosting にデプロイ
firebase deploy --only hosting
```

デプロイ完了後、以下の URL で公開されます：
```
https://pomodoro-timer-1d0fe.web.app
```

## 📖 使い方

1. テーマセレクトで外観テーマを、タイマー円をクリックしてカラーピッカーで背景色を設定
2. アップロードボタンで通知音声をカスタマイズ（省略可）
3. 作業開始時に ▶ ボタンを押す（フォームで作業時間を変更可）
4. タイマーが切れたら、自動で休憩モードに切り替わるので ▶ ボタンで休憩タイマーを開始
5. 手順 3〜4 を繰り返す

> 各ボタンの詳細は画面内の **📖 説明書ボタン** を参照してください。

## 📄 ライセンス

MIT