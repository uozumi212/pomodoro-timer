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
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaSquare, FaUpload,FaPlus,FaMinus } from 'react-icons/fa';
import { MdFreeBreakfast } from "react-icons/md";
import { lightTheme, darkTheme, retroTheme, sunsetOradientTheme, oceanGradientTheme, yellowGradientTheme, greenGradientTheme, purpleGradientTheme, skyBlueGradientTheme } from './theme/theme';
import { SketchPicker, ColorResult } from 'react-color';

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
  const [colorPick, setColorPick] = useState('red.300');
  const [pickerVisible, setPickerVisible] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [volume, setVolume] = useState(30);

  const [isBreak, setIsBreak] = useState(false);
  const [defaultAudio, setDefaultAudio] = useState<HTMLAudioElement | null>(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [scrollBehavior] = React.useState<'inside' | 'outside'>('inside')


  // Chakra UIのテーマ設定
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');

  const progressColor = colorPick;

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
    position: 'top-center',
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

  // 通知音声アップロード
  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const soundUrl = URL.createObjectURL(file);
      setCustomSound(soundUrl);
      setCustomSoundName(file.name);
    }
  };

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
    const audio = new Audio('../public/決定ボタンを押す22.mp3');
    setDefaultAudio(audio);
  }, []);

  // 音声呼び出し
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

  // タイマー動作中か判定
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

  // カラーピッカー起動とカラー設定
  const handleChangeComplete = (color: ColorResult) => {
    setColorPick(color.hex);
  };

  // カラーピッカーを閉じる
  const handlePickerClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setPickerVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickerRef]);

  // 説明書モーダル閉じる
  const onClose1 = () => {
    setIsModalOpen1(false);
  };

  // おすすめシーン別テーマモーダル閉じる
  const onClose2 = () => {
    setIsModalOpen2(false);
  };


  return (

    <VStack spacing={6}>
      <Circle size="300px" bg={bgColor} position="relative" mt={4} onClick={() => setPickerVisible(true)}>
        <Circle
          size="280px"
          bg={progressColor}
          position="absolute"
          clipPath={`inset(${100 - (time / maxTime) * 100}% 0 0 0)`}
          _hover={{ cursor: 'pointer' }}
        />
        {pickerVisible && (
          <div ref={pickerRef} style={{ position: 'absolute', zIndex: 2, background: 'white', padding: '10px', borderRadius: '8px', marginTop: '500px' }}>
            <SketchPicker
              color={colorPick}
              onChangeComplete={handleChangeComplete}
              />
              <Button mt={3} onClick={handlePickerClose} w="100%" _hover={{ bgColor: 'red.300' }}>閉じる</Button>
          </div>
        )}
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
        <Button onClick={() => setIsModalOpen1(true)} h={50}>
          <Text fontSize={18} fontWeight="bold">説明書</Text>
        </Button>
        <Modal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false)} size='lg'>
          <ModalOverlay />
          <ModalContent maxWidth="40vw" maxHeight="80vh">
          <ModalCloseButton fontSize={18}/>
          <ModalBody width="100%" height="100%" display="flex" flexDirection="column">
            <img src="../public/説明書.png"  alt="説明画像" width="100%" height="100%"/>
            <Button colorScheme='blue' w="50%" mb={6} py={6} onClick={onClose1} mx="auto">
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
          <option value='light'>ライト</option>
          <option value='dark'>ダーク</option>
          <option value='retro'>レトロ</option>
          <option value="sunset">赤色</option>
          <option value="ocean">青色</option>
          <option value="yellow">黄色</option>
          <option value="green">緑色</option>
          <option value="purple">紫色</option>
          <option value="skyBlue">水色</option>
        </Select>
      </Flex>

      <Button onClick={() => {setIsModalOpen2(true)}} w={310} fontSize={20}>
          おすすめシーン別テーマ
      </Button>

      <Modal
        onClose={onClose2}
        isOpen={isModalOpen2}
        scrollBehavior={scrollBehavior}
        size="lg"
      >
    <ModalOverlay />
            <ModalContent maxWidth="60vw" maxHeight="80vh">
              <ModalHeader textAlign="center" fontSize={25}>シーン別使い分け</ModalHeader>
              <ModalCloseButton fontSize={18}/>
              <ModalBody>
                <Flex color="gray.900" fontSize={20} flexWrap="wrap">
                {[
               { "label": "ライト", "value": "開放感、清潔感、未来志向、軽快な印象を与える", "usage": "作業時：明るく集中できる環境を提供。休養時：軽快な気分でリラックスできる。" },
               { "label": "ダーク", "value": "高級感、落ち着き、シックな印象を与える。神秘的な雰囲気も演出可能", "usage": "作業時：落ち着いて集中できる環境を提供。休養時：静かでリラックスできる空間を演出。" },
               { "label": "レトロ", "value": "懐かしさ、温かさ、落ち着き、安定感を与える。ノスタルジックな雰囲気も演出可能", "usage": "作業時：安定感のある環境で集中力を高める。休養時：心地よくリラックスできる空間を提供。" },
               { "label": "赤色", "value": "情熱、興奮、活気、注意を引きやすい。食欲を刺激する効果も", "usage": "作業時：エネルギーと活気を提供し、モチベーションを高める。休養時：過剰な興奮を避けるため控えめに使用。" },
                { "label": "青色", "value": "冷静、信頼、誠実、広がりを感じさせる。リラックス効果も", "usage": "作業時：冷静で集中力を高める環境を提供。休養時：リラックス効果を促進し、穏やかな空間を演出。" },
                 { "label": "黄色", "value": "明るさ、楽しさ、好奇心、注意を引きやすい。暖かさも感じさせる", "usage": "作業時：創造力やアイデアを活性化。休養時：楽しい雰囲気で気分を明るく保つ。" },
                 { "label": "緑色", "value": "自然、癒し、安らぎ、調和。集中力を高める効果も", "usage": "作業時：安らぎと集中力を両立させる環境を提供。休養時：リラックス効果を高め、自然に囲まれたような安らぎを演出。" },
                 { "label": "水色", "value": "爽やかさ、清潔感、広がり、涼しげな印象を与える。穏やかな気持ちにさせる", "usage": "作業時：爽やかでクリアな思考を促進。休養時：清潔感とリラックス効果を高め、心を落ち着かせる。" }
                ].map(({ label, value, usage }, index) => (
                  <Flex key={index} width="100%" mb={6}>
                    <Text fontWeight="bold" mr={2} width="120px" whiteSpace="nowrap">{label}：</Text>
                    <Flex direction="column" width="90%" fontSize={22}>
                      <Text>{value}</Text>
                      <Text>{usage}</Text>
                    </Flex>

                  </Flex>
                ))}
              </Flex>

              </ModalBody>
              <ModalFooter mx="auto">
                <Button onClick={onClose2} colorScheme='green' py={6} px={8}>
                 <Text fontSize="22" fontWeight="bold">閉じる</Text>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

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
