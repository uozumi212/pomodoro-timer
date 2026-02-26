import React, { useState, useEffect } from "react";
import "./App.css";

import {
	ChakraProvider,
	Box,
	Heading,
	Center,
	Button,
	Flex,
	NumberInput,
	NumberInputField,
	FormControl,
	FormLabel,
	Select,
	SimpleGrid,
	Switch,
	Text,
	useColorModeValue,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from "@chakra-ui/react";
import useThemeSwitcher from "./hooks/useThemeSwitcher";
import { darkTheme } from "./theme/theme";
import SoundComponent from "./components/SoundComponent";
import ModalComponent from "./components/ModalComponent";
import TaskNotesModal from "./components/TaskNotesModal";
import NotePadModal from "./components/NotePadModal";
import useTimer from "./hooks/useTimer";
import TimerDisplay from "./components/TimerDisplay";
import PlayIconButton from "./components/PlayIconButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useTimerSound from "./hooks/useTimerSound";
import { usePersistendState } from "./hooks/usePersistendState";
import type { TimerSettings } from "./hooks/useTimer";

const THEME_OPTIONS = ["light", "dark", "retro", "sunset", "ocean", "yellow", "green", "purple", "skyBlue"] as const;
const THEME_LABELS: Record<(typeof THEME_OPTIONS)[number], string> = {
	light: "ライト",
	dark: "ダーク",
	retro: "レトロ",
	sunset: "赤色",
	ocean: "青色",
	yellow: "黄色",
	green: "緑色",
	purple: "紫色",
	skyBlue: "水色",
};

const PomodoroTimer: React.FC = () => {
	const [settings, setSettings] = usePersistendState<TimerSettings>("pomodoro.settings", {
		workMin: 25,
		shortBreakMin: 5,
		longBreakMin: 15,
		longBreakEvery: 4,
		autoStartNext: true,
	});
	const sound = useTimerSound();
	const timer = useTimer({ playSound: sound.playSound, audioRef: sound.audioRef, settings });
	const [currentTheme, setCurrentTheme] = usePersistendState<string>("pomodoro.theme", "light");
	const [theme, setTheme] = useState(darkTheme);
	const [isModalOpen1, setIsModalOpen1] = useState(false);
	const [isModalOpen2, setIsModalOpen2] = useState(false);
	const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
	const [isTaskNotesOpen, setIsTaskNotesOpen] = useState(false);
	const [isNotePadOpen, setIsNotePadOpen] = useState(false);
	useEffect(() => {
		if (!THEME_OPTIONS.includes(currentTheme as (typeof THEME_OPTIONS)[number])) {
			setCurrentTheme("light");
		}
	}, [currentTheme, setCurrentTheme]);

	const getCurrentTime = () => {
		const now = new Date();
		return now.toLocaleTimeString("ja-JP", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	const updateSetting = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	const [currentTime, setCurrentTime] = useState(getCurrentTime());

	const bgColor = useColorModeValue("gray.100", "gray.700");
	const panelBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.700", "white");

	// テーマ変更のための useEffectを使用するカスタムフック
	useThemeSwitcher(currentTheme, setTheme);

	// テーマ変更のハンドラ
	const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentTheme(e.target.value);
	};

	useEffect(() => {
		let intervalId: number;

		if (isTimePopupOpen) {
			intervalId = window.setInterval(() => {
				setCurrentTime(getCurrentTime());
			}, 1000);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isTimePopupOpen]);

	const now = new Date();

	const formatter = () => {
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, "0");
		const date = now.getDate();
		return `${year}年${month}月${date}日`;
	};

	return (
		<ChakraProvider theme={theme}>
			{/* ── 全画面ラッパー ── */}
			<Box minHeight="100vh" color="text" px={4} py={6}>
				{/* ── 固定幅・中央揃えコンテナ ── */}
				<VStack spacing={5} maxWidth="480px" mx="auto" align="stretch">
					{/* 1. ヘッダー：タイトル ＋ 説明書ボタン */}
					<Flex justify="center" align="center">
						<Heading as="h1" fontSize="3xl">
							ポモドーロタイマー
						</Heading>
					</Flex>

					{/* 2. タイマー表示（中央） */}
					<Center>
						<TimerDisplay formatTime={timer.formatTime} time={timer.time} maxTime={timer.maxTime} isBreak={timer.isBreak} />
					</Center>

					{/* 3. 再生ボタン群（中央揃え） */}
								<Center>
									<PlayIconButton isActive={timer.isActive} toggleTimer={timer.toggleTimer} resetTimer={timer.resetTimer} />
								</Center>

								{/* 4. タイマー設定 ＋ テーマ */}
								<Box bg={panelBg} borderRadius="md" p={4} color={textColor} boxShadow="sm">
									<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
																						<NumberInput
																							value={settings.workMin}
																							min={1}
																							max={180}
																							bg={bgColor}
																							color={textColor}
											onChange={(_, valueAsNumber) => updateSetting("workMin", Number.isFinite(valueAsNumber) && valueAsNumber > 0 ? valueAsNumber : 1)}
										>
											<NumberInputField placeholder="作業時間（分）" sx={{ "::placeholder": { fontSize: "15px" } }} fontSize={16} fontWeight={600} />
										</NumberInput>
																						<NumberInput
																							value={settings.shortBreakMin}
																							min={1}
																							max={60}
																							bg={bgColor}
																							color={textColor}
											onChange={(_, valueAsNumber) => updateSetting("shortBreakMin", Number.isFinite(valueAsNumber) && valueAsNumber > 0 ? valueAsNumber : 1)}
										>
											<NumberInputField placeholder="短休憩（分）" sx={{ "::placeholder": { fontSize: "15px" } }} fontSize={16} fontWeight={600} />
										</NumberInput>
																						<NumberInput
																							value={settings.longBreakMin}
																							min={1}
																							max={90}
																							bg={bgColor}
																							color={textColor}
											onChange={(_, valueAsNumber) => updateSetting("longBreakMin", Number.isFinite(valueAsNumber) && valueAsNumber > 0 ? valueAsNumber : 5)}
										>
											<NumberInputField placeholder="長休憩（分）" sx={{ "::placeholder": { fontSize: "15px" } }} fontSize={16} fontWeight={600} />
										</NumberInput>
																						<NumberInput
																							value={settings.longBreakEvery}
																							min={1}
																							max={12}
																							bg={bgColor}
																							color={textColor}
											onChange={(_, valueAsNumber) => updateSetting("longBreakEvery", Number.isFinite(valueAsNumber) && valueAsNumber > 0 ? Math.floor(valueAsNumber) : 4)}
										>
											<NumberInputField placeholder="長休憩の間隔（回）" sx={{ "::placeholder": { fontSize: "15px" } }} fontSize={16} fontWeight={600} />
										</NumberInput>
									</SimpleGrid>
									<FormControl display="flex" alignItems="center" justifyContent="space-between" mt={4} gap={3}>
										<FormLabel mb="0" fontWeight={600} fontSize="sm">
											自動で次フェーズを開始
										</FormLabel>
										<Switch isChecked={settings.autoStartNext} onChange={(e) => updateSetting("autoStartNext", e.target.checked)} colorScheme="teal" />
									</FormControl>
									<Select mt={4} value={currentTheme} onChange={handleThemeChange} bg={bgColor} color={textColor} fontSize={16} fontWeight={600} placeholder="テーマ選択">
										{THEME_OPTIONS.map((option) => (
											<option key={option} value={option}>
												{THEME_LABELS[option]}
											</option>
										))}
									</Select>
								</Box>

					{/* 5. ユーティリティボタン（3等分） */}
					<SimpleGrid columns={3} spacing={3}>
						<Button onClick={() => setIsTaskNotesOpen(true)} colorScheme="teal" fontSize={14}>
							タスクメモ
						</Button>
						<Button onClick={() => setIsNotePadOpen(true)} colorScheme="blue" fontSize={14}>
							メモ帳
						</Button>
						<Button onClick={() => setIsTimePopupOpen((prev) => !prev)} fontSize={14}>
							{isTimePopupOpen ? "時刻を閉じる" : "現在時刻"}
						</Button>
					</SimpleGrid>

					{/* 6. おすすめテーマ */}
					<Button onClick={() => setIsModalOpen2(true)} bg={bgColor} color={textColor} fontSize={16} w="full">
						おすすめテーマ
					</Button>

					{/* 7. サウンドコントロール（カード） */}
					<Box className="timer-card">
						<SoundComponent
							volume={sound.volume}
							setVolume={sound.setVolume}
							handleSoundUpload={sound.handleSoundUpload}
							customSoundName={sound.customSoundName}
							bgColor={sound.bgColor}
							audioRef={sound.audioRef}
							handleMinus={sound.handleMinus}
							handlePlus={sound.handlePlus}
							playSound={sound.playSound}
						/>
					</Box>
				</VStack>
			</Box>

			<ModalComponent isModalOpen1={isModalOpen1} isModalOpen2={isModalOpen2} onClose1={() => setIsModalOpen1(false)} onClose2={() => setIsModalOpen2(false)} />
			<ToastContainer />

			{/* ── 現在時刻ポップアップ ── */}
			<Modal isOpen={isTimePopupOpen} onClose={() => setIsTimePopupOpen(false)} blockScrollOnMount={false} isCentered={false} closeOnEsc={false}>
				<ModalOverlay sx={{ pointerEvents: "none" }} backgroundColor="transparent" />
				<ModalContent
					position="fixed"
					draggable="true"
					minWidth="250px"
					width="500px"
					maxWidth="80vw"
					minHeight="150px"
					maxHeight="80vh"
					top="20%"
					right="5%"
					onDragStart={(e) => {
						const target = e.target as HTMLDivElement;
						const rect = target.getBoundingClientRect();
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;
						target.dataset.x = x.toString();
						target.dataset.y = y.toString();
					}}
					onDrag={(e) => {
						if (e.clientX === 0 && e.clientY === 0) return;
						const target = e.target as HTMLDivElement;
						const x = parseInt(target.dataset.x || "0");
						const y = parseInt(target.dataset.y || "0");
						target.style.left = `${e.clientX - x}px`;
						target.style.top = `${e.clientY - y}px`;
					}}
					sx={{
						backgroundColor: "white",
						border: "1px solid #E2E8F0",
						borderRadius: "8px",
						boxShadow: "0 4px 6px rgba(0, 0, 0 , 0.1)",
						resize: "both",
						overflow: "auto",
						"&:hover": {
							boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
						},
						"&:active": {
							cursor: "move",
						},
						// リサイズハンドルをカスタマイズ
						"&::after": {
							content: '""',
							position: "absolute",
							bottom: "0",
							right: "0",
							width: "15px",
							height: "15px",
							cursor: "nwse-resize",
							background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)",
						},
					}}
				>
					<ModalHeader
						sx={{
							textAlign: "center",
							cursor: "move",
							borderBottom: "1px solid #E2E8F0",
							backgroundColor: "#F7FAFC",
							borderTopRadius: "8px",
							fontWeight: "bold",
							userSelect: "none",
							color: "black",
							fontSize: "20px",
							padding: "10px 0",
						}}
					>
						<Flex>
							<Text ml="10px">現在時刻</Text>
							<Text ml="15%">{formatter()}</Text>
						</Flex>
					</ModalHeader>
					<ModalCloseButton
						sx={{
							position: "absolute",
							right: "8px",
							top: "13px",
							color: "black",
							fontSize: "20px",
							"&:hover": {
								backgroundColor: "#EDF2F7",
							},
						}}
					/>

					<ModalBody
						sx={{
							padding: "20px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text
							fontSize="30px"
							fontWeight="bold"
							sx={{
								color: "#2D3748",
								textAlign: "center",
								userSelect: "none",
							}}
						>
							{currentTime}
						</Text>
					</ModalBody>
					<Button onClick={() => setIsTimePopupOpen(false)} backgroundColor="#66CCFF" color="white" width="50%" margin="auto" borderRadius="5px" padding={10} mb={30}>
						閉じる
					</Button>
				</ModalContent>
			</Modal>

			<TaskNotesModal isOpen={isTaskNotesOpen} onClose={() => setIsTaskNotesOpen(false)} />

			<NotePadModal isOpen={isNotePadOpen} onClose={() => setIsNotePadOpen(false)} />
		</ChakraProvider>
	);
};

export default PomodoroTimer;
