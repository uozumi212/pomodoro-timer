import React, { useState } from "react";
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
  Select,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import useThemeSwitcher from "./hooks/useThemeSwitcher";
import { lightTheme } from "./theme/theme";
import SoundComponent from "./components/SoundComponent";
import ModalComponent from "./components/ModalComponent";
import useTimer from "./hooks/useTimer";
import TimerDisplay from "./components/TimerDisplay";
import PlayIconButton from "./components/PlayIconButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useTimerSound from "./hooks/useTimerSound";

const PomodoroTimer: React.FC = () => {
  const sound = useTimerSound();
  const timer = useTimer({ playSound: sound.playSound, audioRef: sound.audioRef });
  const [currentTheme, setCurrentTheme] = useState("light");
  const [theme, setTheme] = useState(lightTheme);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");

  // テーマ変更のための useEffectを使用するカスタムフック
  useThemeSwitcher(currentTheme, setTheme);

  // テーマ変更のハンドラ
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(e.target.value);
  };

  return (
    <VStack spacing={6}>
      <ChakraProvider theme={theme}>
        <Box minHeight="100vh" color="text" p={4}>
          <Center flexDirection="column">
            <Heading as="h1" mb="{4}" mt={4}>
              ポモドーロタイマー
            </Heading>
            <TimerDisplay
              formatTime={timer.formatTime}
              time={timer.time}
              maxTime={timer.maxTime}
              isBreak={timer.isBreak}
            />
          </Center>

          <Flex mt={4}>
            <PlayIconButton
              isActive={timer.isActive}
              toggleTimer={timer.toggleTimer}
              setIsBreak={timer.setIsBreak}
              resetTimer={timer.resetTimer}
            />

            <Button onClick={() => setIsModalOpen1(true)} h={50} ml={4}>
              <Text fontSize={18} fontWeight="bold">
                説明書
              </Text>
            </Button>
          </Flex>

          <Flex mt={3}>
            <NumberInput
              onChange={(valueString) => timer.resetTimer(Number(valueString))}
              min={1}
              max={60}
              defaultValue={25}
              bg={bgColor}
              color="black"
            >
              <NumberInputField
                placeholder="分単位で入力"
                sx={{ "::placeholder": { fontSize: "17px" } }}
                fontSize={22}
                fontWeight={600}
                w={150}
              />
            </NumberInput>
            <Select
              value={currentTheme}
              onChange={handleThemeChange}
              bg={bgColor}
              ml={2}
              color={textColor}
              fontSize={20}
              fontWeight={600}
              w={157}
              placeholder="外観テーマを選択"
              size="md"
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
              <option value="retro">レトロ</option>
              <option value="sunset">赤色</option>
              <option value="ocean">青色</option>
              <option value="yellow">黄色</option>
              <option value="green">緑色</option>
              <option value="purple">紫色</option>
              <option value="skyBlue">水色</option>
            </Select>
          </Flex>

          <Flex mt={3}>
            <Button
              onClick={() => {
                setIsModalOpen2(true);
              }}
              w={315}
              fontSize={20}
            >
              おすすめシーン別テーマ
            </Button>
          </Flex>
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

        <ModalComponent
          isModalOpen1={isModalOpen1}
          isModalOpen2={isModalOpen2}
          onClose1={() => setIsModalOpen1(false)}
          onClose2={() => setIsModalOpen2(false)}
        />
        <ToastContainer />
      </ChakraProvider>
    </VStack>
  );
};

export default PomodoroTimer;
