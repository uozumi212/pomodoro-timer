export type Phase = "work" | "shortBreak" | "longBreak";

export interface TimerSettings {
  workMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  longBreakEvery: number;
  autoStartNext: boolean;
}

export interface TimerState {
  phase: Phase;
  completedWorkCount: number;
  durationSeconds: number;
  remainingMs: number;
  deadline: number | null;
  hasStarted: boolean;
  completionId: number;
  lastCompletedPhase: Phase | null;
}

export type TimerAction =
  | { type: "tick"; now: number; settings: TimerSettings }
  | { type: "toggle"; now: number; settings: TimerSettings }
  | { type: "reset"; phase: Phase; settings: TimerSettings }
  | { type: "settings"; settings: TimerSettings };

const phaseToSeconds = (phase: Phase, settings: TimerSettings) => {
  if (phase === "work") return settings.workMin * 60;
  if (phase === "shortBreak") return settings.shortBreakMin * 60;
  return settings.longBreakMin * 60;
};

export const createTimerState = (settings: TimerSettings): TimerState => ({
  phase: "work",
  completedWorkCount: 0,
  durationSeconds: phaseToSeconds("work", settings),
  remainingMs: phaseToSeconds("work", settings) * 1000,
  deadline: null,
  hasStarted: false,
  completionId: 0,
  lastCompletedPhase: null,
});

const enterPhase = (
  state: TimerState,
  phase: Phase,
  settings: TimerSettings,
  now: number,
  autoStart: boolean,
): TimerState => {
  const durationSeconds = phaseToSeconds(phase, settings);
  return {
    ...state,
    phase,
    durationSeconds,
    remainingMs: durationSeconds * 1000,
    deadline: autoStart ? now + durationSeconds * 1000 : null,
    hasStarted: autoStart,
  };
};

export const timerReducer = (
  state: TimerState,
  action: TimerAction,
): TimerState => {
  if (action.type === "reset") {
    // 手動の切替では完了セット数を増やさない。
    return enterPhase(state, action.phase, action.settings, 0, false);
  }

  if (action.type === "settings") {
    // 一時停止中も、計測を始めたフェーズの残り時間を守る。
    if (state.hasStarted) return state;
    return enterPhase(state, state.phase, action.settings, 0, false);
  }

  if (state.deadline !== null) {
    const remainingMs = Math.max(0, state.deadline - action.now);
    if (remainingMs === 0) {
      const completedWorkCount =
        state.completedWorkCount + (state.phase === "work" ? 1 : 0);
      const nextPhase =
        state.phase === "work"
          ? completedWorkCount % action.settings.longBreakEvery === 0
            ? "longBreak"
            : "shortBreak"
          : "work";
      // 遅れて検知しても、離席中の作業・休憩を連続して完了扱いにしない。
      return enterPhase(
        {
          ...state,
          completedWorkCount,
          completionId: state.completionId + 1,
          lastCompletedPhase: state.phase,
        },
        nextPhase,
        action.settings,
        action.now,
        action.settings.autoStartNext,
      );
    }

    return {
      ...state,
      remainingMs,
      deadline: action.type === "toggle" ? null : state.deadline,
    };
  }

  if (action.type === "toggle") {
    return {
      ...state,
      hasStarted: true,
      deadline: action.now + state.remainingMs,
    };
  }

  return state;
};
