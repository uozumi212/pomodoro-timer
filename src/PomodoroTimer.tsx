import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  VStack,
  Text,
  HStack,
  useColorModeValue,
  Icon,
  Circle,
  Box,
  Input,
  Select,
  Center,
  useTheme,
  NumberInput,
  NumberInputField,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Flex,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaSquare, FaUpload,FaPlus,FaMinus } from 'react-icons/fa';
import { MdFreeBreakfast } from "react-icons/md";
import { lightTheme, darkTheme, retroTheme, sunsetOradientTheme, oceanGradientTheme, yellowGradientTheme, greenGradientTheme, purpleGradientTheme, skyBlueGradientTheme } from './theme/theme';
import { SiEnterprisedb } from 'react-icons/si';

interface PomodoroTimerProps {
  setTheme: (theme: any) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ setTheme }) => {
  const [time, setTime] = useState(1500);
  const [maxTime, setMaxTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [customSound, setCustomSound] = useState<string | null>(null);
  const [customSoundName, setCustomSoundName] = useState<string | null>('決定ボタンを押す22.mp3');
  const [currentTheme, setCurrentTheme] = useState('light');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [notificationShown, setNotificationShown] = useState(false);

  const [volume, setVolume] = useState(30);
  // const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(300);
  const [isBreak, setIsBreak] = useState(false);
  const [defaultAudio, setDefaultAudio] = useState<HTMLAudioElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const theme = useTheme();
  // Chakra UIのテーマ設定
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const progressColor = useColorModeValue('red.300', 'red.300');

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // 時間フォーマット関数
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

// お知らせの表示と音声の再生
const showNotification = useCallback(() => {
  toast.success(`${isBreak ? '休憩' : '作業' }時間が終了しました。`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  playSound();
}, [isBreak]);

  // タイマーリセット機能
  const resetTimer = useCallback((minutes: number) => {
    if (minutes > 0) {
      const totalSeconds = minutes * 60;
      setMaxTime(totalSeconds);
      setTime(totalSeconds);
      setIsActive(false);
      setNotificationShown(false);
    }
  },[]);

useEffect(() => {
  if (time <= 0 && !notificationShown) {
    showNotification();
    setNotificationShown(true);
    setIsActive(false);
    setIsBreak(!isBreak);
    resetTimer(isBreak ? 25 : 5);
  }
}, [time, notificationShown, isBreak, showNotification, resetTimer]);

  // タイマーのアニメーション設定
  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current != undefined) {
        const deltaTime = time - previousTimeRef.current;

        if (isActive && deltaTime >= 1000) {
          setTime((prevTime) => Math.max(prevTime - 1, 0));
          previousTimeRef.current = time;
          }
        } else {
            previousTimeRef.current = time;
        }
      requestRef.current = requestAnimationFrame(animate);
    },
    [isActive]
  );

  // テーマ変更のための useEffect
  useEffect(() => {
    switch (currentTheme) {
      case 'light':
        setTheme(lightTheme);
        break;
      case 'dark':
        setTheme(darkTheme);
        break;
      case 'retro':
        setTheme(retroTheme);
        break;
      case 'sunset':
        setTheme(sunsetOradientTheme);
        break;
      case 'ocean':
        setTheme(oceanGradientTheme);
        break;
      case 'yellow':
        setTheme(yellowGradientTheme);
        break;
      case 'green':
        setTheme(greenGradientTheme);
        break;
      case 'purple':
        setTheme(purpleGradientTheme);
        break;
      case 'skyBlue':
        setTheme(skyBlueGradientTheme);
        break;
    }
  }, [currentTheme, setTheme]);

  // テーマ変更のハンドラ
  const handleThemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(e.target.value);
  };

  // アニメーションフレーム設定
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const soundUrl = URL.createObjectURL(file);
      setCustomSound(soundUrl);
      setCustomSoundName(file.name);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (defaultAudio) {
      defaultAudio.volume = volume / 100;
    }
  }, [volume, defaultAudio]);

  useEffect(() => {
    const audio = new Audio('../public/決定ボタンを押す22.mp3');
    setDefaultAudio(audio);
  }, []);

  const playSound = useCallback(() => {
    const audioToPlay = customSound ? audioRef.current : defaultAudio;
    if (audioToPlay instanceof HTMLAudioElement) {
      audioToPlay.volume = volume / 100;
      audioToPlay.currentTime = 0;
      audioToPlay.play().catch((error) => console.error('音声再生エラー:', error));
    } else {
      const audio = new Audio('../public/決定ボタンを押す22.mp3');
      audio.volume = volume / 100;
      audio.play().catch((error) => console.error('音声再生エラー:', error));
    }
  }, [customSound, volume, defaultAudio]);



  const toggleTimer = () => {
    setIsActive(!isActive);
  };



  // 音量を小さくする
  const handleMinus = () => {
    setVolume((prev) => Math.max(prev - 10, 0));
  };

  // 音量を大きくする
  const handlePlus = () => {
    setVolume((prev) => Math.min(prev + 10, 100));
  };

  const onClose = () => {
    setIsModalOpen(false);
  };


  return (
    <VStack spacing={6}>
      <Circle size="300px" bg={bgColor} position="relative" mt={4}>
        <Circle
          size="280px"
          bg={progressColor}
          position="absolute"
       clipPath={`inset(${100 - (time / maxTime) * 100}% 0 0 0)`}
        />
        <Box position="relative" zIndex={1}>
          <Text fontSize="6xl" fontWeight="bold" color={textColor}>
            {formatTime(time)}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
             {isBreak ? '休憩中' : '作業中'}
          </Text>
        </Box>
      </Circle>
      <HStack>
        <Button
          colorScheme={isActive ? 'red' : 'green'}
          onClick={toggleTimer}
          aria-label={isActive ? 'Pause' : 'Play'}
          size="lg"
          borderRadius="full"
        >
          <Icon as={isActive ? FaPause : FaPlay} />
        </Button>
        <Button
          colorScheme="blue"
          onClick={() =>  {
            setIsBreak(false);
            resetTimer(25)
          }}
          aria-label="Reset"
          size="lg"
          borderRadius="full"
        >
          <Icon as={FaSquare} />
        </Button>
        <Button h={12} onClick={() => {
          setIsBreak(true);
          resetTimer(5);
          }}>
          <Icon as={MdFreeBreakfast} boxSize={6}/>
        </Button>
        <Button onClick={() => setIsModalOpen(true)} h={50}>
          <Text fontSize={18} fontWeight="bold">説明書</Text>
        </Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size='lg'>
          <ModalOverlay />
          <ModalContent maxWidth="40vw" maxHeight="80vh">
          <ModalCloseButton fontSize={18}/>
          <ModalBody width="100%" height="100%" display="flex" flexDirection="column">
            <img src="../public/説明書.png"  alt="説明画像" width="100%" height="100%"/>
            <Button colorScheme='blue' w="50%" mb={6} py={6} onClick={onClose} mx="auto">
              <Text fontSize="22" fontWeight="bold">閉じる</Text>
            </Button>
          </ModalBody>
          </ModalContent>
        </Modal>
      </HStack>

      <Flex>
        <NumberInput onChange={(valueString) => resetTimer(Number(valueString))} min={1} max={60} defaultValue={25}  bg={bgColor}  color='black'>
          <NumberInputField placeholder="分単位で入力" sx={{ '::placeholder': {fontSize: '17px',} }} fontSize={22} fontWeight={600} w={150}/>
        </NumberInput>
        <Select value={currentTheme} onChange={handleThemaChange} bg={bgColor} ml={2} color={textColor} fontSize={20} fontWeight={600} w={150}  placeholder='外観テーマを選択' size="md">
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
          <option value='retro'>Retro</option>
          <option value="sunset">Red</option>
          <option value="ocean">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="skyBlue">SkyBlue</option>
        </Select>
      </Flex>
      <Flex >
      <Button as="label" htmlFor="sound-upload" cursor="pointer" h={12}>
          <Icon as={FaUpload}  boxSize={6}/>
          <Input
            id="sound-upload"
            type="file"
            accept="audio/*"
            onChange={handleSoundUpload}
            display="none"
            />
        </Button>
        <Box
          border="2px"
          borderColor="gray.200"
          borderRadius="md"
          bg={bgColor}
          p={2}
          ml={2}
          w="250px"
          isTruncated
        >
          <Text textAlign="center" alignItems="center" mt={1} color="black"  fontWeight="bold" fontSize={17}>{customSoundName}</Text>
        </Box>
        {customSound && <audio ref={audioRef} src={customSound} />}
      </Flex>
      <Flex alignItems="center" width="100%">
          <Icon  onClick={handleMinus} as={FaMinus} boxSize={8} mr={4} flexShrink={0} cursor='pointer' />

        <Slider aria-label='volume-slider' value={volume} onChange={(val) => setVolume(val)} min={0} max={100} step={1} flex={1}>
          <SliderTrack h={2}>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Icon onClick={handlePlus} as={FaPlus} boxSize={8} ml={4} flexShrink={0} cursor='pointer' />
      </Flex>

      <ToastContainer />
    </VStack>
  );
};

export default PomodoroTimer;
