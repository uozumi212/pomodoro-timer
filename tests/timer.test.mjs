import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// 既存のTypeScriptを利用し、追加依存なしで時間計測のロジックを検証する。
const source = await readFile(
  new URL("../src/hooks/timer.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const { createTimerState, timerReducer } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const settings = {
  workMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  longBreakEvery: 4,
  autoStartNext: true,
};
const act = (state, type, now = 0, config = settings) =>
  timerReducer(state, { type, now, settings: config });
const start = (config = settings) =>
  act(createTimerState(config), "toggle", 0, config);

test("バックグラウンドで10分間更新されなくても経過時間を反映する", () => {
  const state = act(start(), "tick", 600_000);
  assert.equal(state.remainingMs, 15 * 60_000);
  assert.equal(state.deadline, 25 * 60_000);
});

test("一時停止時は最新の残り時間を保存し、再開後はそこから計測する", () => {
  const paused = act(start(), "toggle", 60_250);
  assert.equal(paused.remainingMs, 1_439_750);
  assert.equal(paused.deadline, null);
  assert.deepEqual(act(paused, "tick", 500_000), paused);
  const resumed = act(paused, "toggle", 500_000);
  assert.equal(act(resumed, "tick", 510_000).remainingMs, 1_429_750);
});

test("開始前の時間設定は即座に反映する", () => {
  const state = act(createTimerState(settings), "settings", 0, {
    ...settings,
    workMin: 30,
  });
  assert.equal(state.remainingMs, 30 * 60_000);
  assert.equal(state.durationSeconds, 30 * 60);
});

test("計測中と一時停止中の設定変更で残り時間をリセットしない", () => {
  const active = act(start(), "tick", 60_000);
  const config = { ...settings, workMin: 30, autoStartNext: false };
  assert.deepEqual(act(active, "settings", 0, config), active);
  const paused = act(active, "toggle", 65_000);
  assert.deepEqual(act(paused, "settings", 0, config), paused);
});

test("終了時に最新の休憩時間と自動開始設定を適用する", () => {
  const config = { ...settings, shortBreakMin: 10, autoStartNext: false };
  const ended = act(start(), "tick", 25 * 60_000, config);
  assert.equal(ended.phase, "shortBreak");
  assert.equal(ended.remainingMs, 10 * 60_000);
  assert.equal(ended.deadline, null);
  assert.equal(ended.completedWorkCount, 1);
  assert.equal(ended.completionId, 1);
});

test("4回作業を完了すると長休憩へ進み、休憩ではセット数を増やさない", () => {
  let state = start();
  for (let count = 1; count <= 4; count++) {
    state = act(state, "tick", state.deadline);
    assert.equal(state.completedWorkCount, count);
    assert.equal(state.phase, count === 4 ? "longBreak" : "shortBreak");
    if (count < 4) {
      state = act(state, "tick", state.deadline);
      assert.equal(state.phase, "work");
      assert.equal(state.completedWorkCount, count);
    }
  }
  assert.equal(state.remainingMs, 15 * 60_000);
  state = act(state, "tick", state.deadline);
  assert.equal(state.phase, "work");
  assert.equal(state.completedWorkCount, 4);
});

test("長時間離席しても複数セットを完了扱いにせず、終了を重複処理しない", () => {
  const ended = act(start(), "tick", 8 * 60 * 60_000);
  assert.equal(ended.completedWorkCount, 1);
  assert.equal(ended.deadline, 8 * 60 * 60_000 + 5 * 60_000);
  const repeated = act(ended, "tick", 8 * 60 * 60_000);
  assert.equal(repeated.completionId, 1);
  assert.equal(repeated.remainingMs, 5 * 60_000);
});

test("手動の切替は完了セットに加算せず、新しい設定の時間で停止する", () => {
  const state = timerReducer(start(), {
    type: "reset",
    phase: "shortBreak",
    settings: { ...settings, shortBreakMin: 10 },
  });
  assert.equal(state.completedWorkCount, 0);
  assert.equal(state.completionId, 0);
  assert.equal(state.remainingMs, 10 * 60_000);
  assert.equal(state.deadline, null);
  assert.equal(state.hasStarted, false);
});
