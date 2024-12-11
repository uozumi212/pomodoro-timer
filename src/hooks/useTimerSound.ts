import { useCallback, useEffect, useRef, useState } from "react";

const UseTimerSound = () => {
  const [volume, setVolume] = useState(30);
  const [defaultAudio, setDefaultAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [customSound, setCustomSound] = useState<string | null>(null);
  const [customAudio, setCustomAudio] = useState<HTMLAudioElement | null>(null);
  const [customSoundName, setCustomSoundName] = useState<string | null>(
    "決定ボタンを押す22.mp3"
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 通知音声アップロード
  const handleSoundUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const soundUrl = URL.createObjectURL(file);

      setCustomSound(soundUrl);
      setCustomSoundName(file.name);
      const newAudio = new Audio(soundUrl);
      audioRef.current = newAudio;

    newAudio; console.log("Custom sound uploaded and set to audioRef:",newAudio);
    }
  },[]);

  // ボリューム設定
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (defaultAudio) {
      defaultAudio.volume = volume / 100;
    }
  }, [volume, defaultAudio]);

  useEffect(() => {
    const audio = new Audio("../public/決定ボタンを押す22.mp3");
    setDefaultAudio(audio);
    if (!audioRef.current) {
      audioRef.current = audio;
    }
  }, []);

  // 音声呼び出し
  const playSound = useCallback(() => {
    const audioToPlay = audioRef.current || defaultAudio;

    if (audioToPlay instanceof HTMLAudioElement) {
      console.log("audioToPlay:", audioToPlay.src);
      audioToPlay.volume = volume / 100;
      audioToPlay.currentTime = 0;
      audioToPlay
        .play()
        .catch((error) => console.error("音声再生エラー:", error));
    }
  }, [volume]);

  // 音量を小さくする
  const handleMinus = () => {
    setVolume((prev) => Math.max(prev - 10, 0));
  };

  // 音量を大きくする
  const handlePlus = () => {
    setVolume((prev) => Math.min(prev + 10, 100));
  };

  return {
    volume,
    setVolume,
    handleSoundUpload,
    customSoundName,
    bgColor: "gray.100",
    customSound,
    customAudio,
    audioRef,
    handleMinus,
    handlePlus,
    playSound,
  };
};

export default UseTimerSound;
