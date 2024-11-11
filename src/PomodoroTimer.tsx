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
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaSquare, FaUpload } from 'react-icons/fa';
import { lightTheme, darkTheme, retroTheme } from './theme/theme';

// type TimeProps = {
//   time: Date;
// };

interface PomodoroTimerProps {
  setTheme: (theme: any) => void;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ setTheme }) => {
  const [time, setTime] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [customSound, setCustomSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // const theme = useTheme();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const progressColor = useColorModeValue('red.400', 'red.300');

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current != undefined) {
        const deltaTime = time - previousTimeRef.current;

        if (isActive && deltaTime >= 1000) {
          setTime((prevTime) => {
            if (prevTime <= 1) {
              showNotification();
              setIsActive(false);
              return 0;
            }
            return prevTime - 1;
          });
          previousTimeRef.current = time;
        }
      } else {
        previousTimeRef.current = time;
      }
      requestRef.current = requestAnimationFrame(animate);
    },
    [isActive]
  );

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
    }
  };


  const playSound = useCallback(() => {
    if (customSound && audioRef.current) {
      audioRef.current.play().catch((error) => console.error('音声再生エラー:', error));
    } else {
      const audio = new Audio('../public/決定ボタンを押す22.mp3');
      audio.play().catch((error) => console.error('音声再生エラー:', error));
    }
  }, [customSound]);

  const showNotification = useCallback(() => {
    toast.success(`${time}分経ちました、休憩しましょう。`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    playSound();

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ポモドーロタイマー', {
        body: 'タイマーが終了しました！休憩しましょう。',
      });
    }
    // notification.onclick = function () {
    //   window.focus();
    //   notification.close();
    // };
  }, [playSound]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(10);
    setIsActive(false);
  };

  return (
    <VStack spacing={6}>
      <Circle size="300px" bg={bgColor} position="relative" mt={4}>
        <Circle
          size="280px"
          bg={progressColor}
          position="absolute"
          clipPath={`inset(${100 - (time / 1500) * 100}% 0 0 0)`}
        />
        <Box position="relative" zIndex={1}>
          <Text fontSize="6xl" fontWeight="bold" color={textColor}>
            {formatTime(time)}
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
          onClick={resetTimer}
          aria-label="Reset"
          size="lg"
          borderRadius="full"
        >
          <Icon as={FaSquare} />
        </Button>
        <Button as="label" htmlFor="sound-upload" cursor="pointer">
          <Icon as={FaUpload} />
          <Input
            id="sound-upload"
            type="file"
            accept="audio/*"
            onChange={handleSoundUpload}
            display="none"
            />
        </Button>
        {customSound && <audio ref={audioRef} src={customSound} />}
      </HStack>
      <HStack>
        <Button onClick={() => setTheme(lightTheme)}>Light</Button>
        <Button onClick={() => setTheme(darkTheme)}>Dark</Button>
        <Button onClick={() => setTheme(retroTheme)}>Retro</Button>
      </HStack>
      <ToastContainer />
    </VStack>
  );
};

export default PomodoroTimer;
