import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";

interface UseTimerParams {
	playSound: () => void;
	audioRef: React.RefObject<HTMLAudioElement>;
	settings: TimerSettings;
}

interface TimerHookReturn {
	time: number;
	isActive: boolean;
	isBreak: boolean;
	maxTime: number;
	formatTime: (time: number) => string;
	resetTimer: (phase: Phase) => void;
	toggleTimer: () => void;
}

export type Phase = "work" | "shortBreak" | "longBreak";

export interface TimerSettings {
	workMin: number;
	shortBreakMin: number;
	longBreakMin: number;
	longBreakEvery: number;
	autoStartNext: boolean;
}

const phaseToSeconds = (phase: Phase, s: TimerSettings) => {
	if (phase === "work") return s.workMin * 60;
	if (phase === "shortBreak") return s.shortBreakMin * 60;
	return s.longBreakMin * 60;
};

const useTimer = ({ playSound, settings }: UseTimerParams): TimerHookReturn => {
	const [phase, setPhase] = useState<Phase>("work");
	const [completedWorkCount, setCompletedWorkCount] = useState(0);
	const [time, setTime] = useState(() => phaseToSeconds("work", settings));
	const [maxTime, setMaxTime] = useState(() => phaseToSeconds("work", settings));
	const [isActive, setIsActive] = useState(false);
	const [notificationShown, setNotificationShown] = useState(false);
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();
	const phaseRef = useRef<Phase>("work");
	const isBreak = phase !== "work";

	const transitionToPhase = useCallback(
		(nextPhase: Phase, shouldAutoStart: boolean) => {
			setPhase(nextPhase);
			phaseRef.current = nextPhase;
			const seconds = phaseToSeconds(nextPhase, settings);
			setTime(seconds);
			setMaxTime(seconds);
			setNotificationShown(false);
			setIsActive(shouldAutoStart);
		},
		[settings],
	);

	const resetTimer = useCallback(
		(targetPhase: Phase) => {
			transitionToPhase(targetPhase, false);
		},
		[transitionToPhase],
	);

	const handlePhaseEnd = useCallback(() => {
		if (phase === "work") {
			const nextCount = completedWorkCount + 1;
			setCompletedWorkCount(nextCount);
			const nextPhase = nextCount % settings.longBreakEvery === 0 ? "longBreak" : "shortBreak";
			transitionToPhase(nextPhase, settings.autoStartNext);
		} else {
			transitionToPhase("work", settings.autoStartNext);
		}
	}, [phase, completedWorkCount, settings, transitionToPhase]);

	// お知らせの表示と音声の再生
	const showNotification = useCallback(() => {
		toast.success(`${isBreak ? "休憩" : "作業"}時間が終了しました。`, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		});
		playSound();
	}, [isBreak, playSound]);

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	// タイマー動作中か判定
	const toggleTimer = () => {
		setIsActive((prev) => !prev);
	};

	useEffect(() => {
		if (time <= 0 && !notificationShown) {
			showNotification();
			setNotificationShown(true);
			handlePhaseEnd();
		}
	}, [time, notificationShown, showNotification, handlePhaseEnd]);

	useEffect(() => {
		phaseRef.current = phase;
	}, [phase]);

	useEffect(() => {
		const currentPhase = phaseRef.current;
		const seconds = phaseToSeconds(currentPhase, settings);
		setTime(seconds);
		setMaxTime(seconds);
		setIsActive(false);
		setNotificationShown(false);
	}, [settings]);

	// タイマーのアニメーション設定
	const animate = useCallback(
		(currentTime: number) => {
			if (previousTimeRef.current != undefined) {
				const deltaTime = currentTime - previousTimeRef.current;

				if (isActive && deltaTime >= 1000) {
					setTime((prevTime) => Math.max(prevTime - 1, 0));
					previousTimeRef.current = currentTime;
				}
			} else {
				previousTimeRef.current = currentTime;
			}
			requestRef.current = requestAnimationFrame(animate);
		},
		[isActive],
	);

	// アニメーションフレーム設定
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, [animate]);

	return {
		time,
		isActive,
		isBreak,
		maxTime,
		formatTime,
		resetTimer,
		toggleTimer,
	};
};

export default useTimer;
