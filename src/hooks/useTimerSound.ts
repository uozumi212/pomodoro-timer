import { useCallback, useEffect, useRef, useState } from "react";
import defaultSound from "../assets/notification.mp3";

const useTimerSound = () => {
	const [volume, setVolume] = useState(30);
	const [customSound, setCustomSound] = useState<string | null>(null);
	const [customSoundName, setCustomSoundName] = useState<string | null>("notification.mp3");
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// 初期化時にデフォルト音声を設定
	useEffect(() => {
		if (!audioRef.current && !customSound) {
			const defaultAudio = new Audio(defaultSound);
			defaultAudio.volume = volume / 100;
			audioRef.current = defaultAudio;
		}
	}, [customSound, volume]);

	// 通知音声アップロード
	const handleSoundUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				// 既存のURLを解放
				if (customSound) {
					URL.revokeObjectURL(customSound);
				}

				const soundUrl = URL.createObjectURL(file);
				setCustomSound(soundUrl);
				setCustomSoundName(file.name);

				// 新しいAudioオブジェクトを作成
				const newAudio = new Audio(soundUrl);
				newAudio.volume = volume / 100;
				audioRef.current = newAudio;
			}
		},
		[volume, customSound],
	);

	// ボリューム設定
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [volume]);

	// 音声再生
	const playSound = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.play().catch((error) => console.error("音声再生エラー:", error));
		}
	}, [customSound]);

	// コンポーネントのクリーンアップ
	useEffect(() => {
		return () => {
			if (customSound) {
				URL.revokeObjectURL(customSound);
			}
		};
	}, [customSound]);

	// ボリューム調整ハンドラ
	const handleMinus = () => setVolume((prev) => Math.max(prev - 10, 0));
	const handlePlus = () => setVolume((prev) => Math.min(prev + 10, 100));

	return {
		volume,
		setVolume,
		handleSoundUpload,
		customSoundName,
		bgColor: "gray.100",
		customSound,
		audioRef,
		handleMinus,
		handlePlus,
		playSound,
	};
};

export default useTimerSound;
