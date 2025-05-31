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
  Select,
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
  const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("ja-JP", {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const bgColor = useColorModeValue("gray.100", "gray.700");
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
    const month = now.getMonth() + 1;
    const date = now.getDate();
    return `${year}年${month}月${date}日`;
  }

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
              w={150}
              fontSize={16}
            >
              おすすめテーマ
            </Button>
            <Button onClick={() => setIsTimePopupOpen(prev => !prev)}  ml={2} w={157}>
                {isTimePopupOpen ? '現在時刻を閉じる' : '現在時刻を表示' }
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
      <Modal
          isOpen={isTimePopupOpen}
          onClose={() => setIsTimePopupOpen(false)}
          blockScrollOnMount={false}
          isCentered={false}
          closeOnOverlayClick={false}
          closeOnEsc={false}
      >
        <ModalOverlay backgroundColor="transparent" />
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
              e.preventDefault();
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
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0 , 0.1)',
                  resize: 'both',
                  overflow: 'auto',
                  '&:hover': {
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
                  },
                  '&:active': {
                    cursor: 'move'
                  },
                  // リサイズハンドルをカスタマイズ
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '15px',
                    height: '15px',
                    cursor: 'nwse-resize',
                    background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)',
                }
            }}
        >
          <ModalHeader
              sx={{
                textAlign: 'center',
                cursor: 'move',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F7FAFC',
                borderTopRadius: '8px',
                fontWeight: 'bold',
                userSelect: 'none',
                color: 'black',
                fontSize: '20px',
                padding: '10px 0',
              }}
          >
            <Flex>
              <Text ml="10px">
                現在時刻
              </Text>
              <Text ml="15%">
                {formatter()}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton
              sx={{
                position: 'absolute',
                right: '8px',
                top: '13px',
                color: 'black',
                fontSize: '20px',
                '&:hover': {
                  backgroundColor: '#EDF2F7'
                }
              }}
          />

          <ModalBody
              sx={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
          >
            <Text
                fontSize="30px"
                fontWeight="bold"
                sx={{
                  color: '#2D3748',
                  textAlign: 'center',
                  userSelect: 'none'
                }}
            >
              {currentTime}
            </Text>
          </ModalBody>
            <Button
                onClick={() => setIsTimePopupOpen(false)}
                backgroundColor="#66CCFF"
                color="white"
                width="50%"
                margin="auto"
                borderRadius="5px"
                padding={10}
                mb={30}>
            閉じる
            </Button>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default PomodoroTimer;
