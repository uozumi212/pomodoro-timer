import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";

interface UseTimerParams {
	playSound: () => void;
	audioRef: React.RefObject<HTMLAudioElement>;
	settings: TimerSettings;
}

interface TimerHookReturn {
	time: number;
	setTime: React.Dispatch<React.SetStateAction<number>>;
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	isBreak: boolean;
	setIsBreak: React.Dispatch<React.SetStateAction<boolean>>;
	maxTime: number;
	setMaxTime: React.Dispatch<React.SetStateAction<number>>;
	formatTime: (time: number) => string;
	resetTimer: (minutes: number) => void;
	toggleTimer: () => void;
	animate: (time: number) => void;
	showNotification: () => void;
	setNotificationShown: React.Dispatch<React.SetStateAction<boolean>>;
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
	// const [time, setTime] = useState(1500);
	const [phase, setPhase] = useState<Phase>("work");
	const [completedWorkCount, setCompletedWorkCount] = useState(0);

	const handlePhaseEnd = useCallback(() => {
		if (phase === "work") {
			const nextCount = completedWorkCount + 1;
			setCompletedWorkCount(nextCount);

			const nextPhase = nextCount % settings.longBreakEvery === 0 ? "longBreak" : "shortBreak";
			setPhase(nextPhase);
			setTime(phaseToSeconds(nextPhase, settings));
			const nextSeconds = phaseToSeconds(nextPhase, settings);
			setMaxTime(nextSeconds);
			setIsActive(settings.autoStartNext);
		} else {
			setPhase("work");
			setTime(phaseToSeconds("work", settings));
			setIsActive(settings.autoStartNext);
		}
	}, [phase, completedWorkCount, settings]);

	const [time, setTime] = useState(() => phaseToSeconds("work", settings));
	const [isActive, setIsActive] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [maxTime, setMaxTime] = useState(1500);
	const [notificationShown, setNotificationShown] = useState(false);
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();

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

	// タイマーリセット機能
	const resetTimer = useCallback((minutes: number) => {
		if (minutes > 0) {
			const totalSeconds = minutes * 60;
			setMaxTime(totalSeconds);
			setTime(totalSeconds);
			setIsActive(false);
			setNotificationShown(false);
		}
	}, []);

	// タイマー動作中か判定
	const toggleTimer = () => {
		setIsActive(!isActive);
	};

	useEffect(() => {
		if (time <= 0 && !notificationShown) {
			showNotification();
			setNotificationShown(true);
			// setIsActive(false);
			// setIsBreak(!isBreak);
			// resetTimer(isBreak ? 25 : 5);
			handlePhaseEnd();
		}
	}, [time, notificationShown, showNotification, handlePhaseEnd]);

	useEffect(() => {
		if (!isActive) {
			const newTime = phaseToSeconds(phase, settings);
			setTime(newTime);
			setMaxTime(newTime);
			setNotificationShown(false);
		}
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
		setTime,
		isActive,
		setIsActive,
		isBreak,
		setIsBreak,
		maxTime,
		setMaxTime,
		formatTime,
		resetTimer,
		toggleTimer,
		animate,
		showNotification,
		setNotificationShown,
	};
};

export default useTimer;
