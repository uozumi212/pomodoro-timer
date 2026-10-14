import { useState, useEffect, useCallback, useRef, useReducer } from "react";
import { toast } from "react-toastify";
import { createTimerState, timerReducer } from "./timer";
import type { Phase, TimerSettings } from "./timer";

export type { Phase, TimerSettings } from "./timer";

interface UseTimerParams {
  playSound: () => void;
  settings: TimerSettings;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const useTimer = ({ playSound, settings }: UseTimerParams) => {
  const [state, dispatch] = useReducer(
    timerReducer,
    settings,
    createTimerState,
  );
  const notifiedCompletionRef = useRef(0);
  const [originalTitle] = useState(() => document.title);
  const time = Math.ceil(state.remainingMs / 1000);
  const isActive = state.deadline !== null;
  const phaseLabel =
    state.phase === "work"
      ? "作業"
      : state.phase === "longBreak"
        ? "長休憩"
        : "短休憩";

  useEffect(() => {
    dispatch({ type: "settings", settings });
  }, [settings]);

  useEffect(() => {
    if (!isActive) return;
    const tick = () => dispatch({ type: "tick", now: Date.now(), settings });
    // 呼び出し間隔が遅れても、終了予定時刻との差から残り時間を求める。
    const intervalId = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    tick();
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, [isActive, settings]);

  useEffect(() => {
    if (state.completionId <= notifiedCompletionRef.current) return;
    notifiedCompletionRef.current = state.completionId;
    const label = state.lastCompletedPhase === "work" ? "作業" : "休憩";
    toast.success(`${label}時間が終了しました。`, {
      position: "top-center",
      autoClose: 5000,
    });
    playSound();
  }, [state.completionId, state.lastCompletedPhase, playSound]);

  useEffect(() => {
    document.title = `${formatTime(time)}｜${phaseLabel}${isActive ? "" : "（停止中）"}｜ポモドーロタイマー`;
  }, [time, phaseLabel, isActive]);

  useEffect(
    () => () => {
      document.title = originalTitle;
    },
    [originalTitle],
  );

  const resetTimer = useCallback(
    (phase: Phase) => {
      dispatch({ type: "reset", phase, settings });
    },
    [settings],
  );

  const toggleTimer = () =>
    dispatch({ type: "toggle", now: Date.now(), settings });

  return {
    time,
    isActive,
    isBreak: state.phase !== "work",
    phaseLabel,
    completedWorkCount: state.completedWorkCount,
    workUntilLongBreak:
      settings.longBreakEvery -
      (state.completedWorkCount % settings.longBreakEvery),
    maxTime: state.durationSeconds,
    formatTime,
    resetTimer,
    toggleTimer,
  };
};

export default useTimer;
