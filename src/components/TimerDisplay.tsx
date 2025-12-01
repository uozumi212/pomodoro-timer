import { Box, Circle, Text, useColorModeValue, HStack } from "@chakra-ui/react";
import ColorPickerComponent from "./ColorPickerComponent";
import React, { useState } from "react";

interface TimerDisplayProps {
  formatTime: (time: number) => string;
  time: number;
  maxTime: number;
  isBreak: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  formatTime,
  time,
  maxTime,
  isBreak,
}) => {

  const [colorPick, setColorPick] = useState("#50e3c2");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [animationMode, setAnimationMode] = useState<'vertical' | 'radial'>('vertical');

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const progressColor = colorPick;
  const segmentBg = useColorModeValue("gray.200", "gray.600");
  const activeBg = useColorModeValue("white", "gray.800");
  const activeColor = useColorModeValue("gray.800", "white");

  const handleCircleClick = () => {
    setPickerVisible(!pickerVisible);
  };

  // Radial animation calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const pct = time / maxTime;
  const dashArray = `${pct * circumference} ${circumference}`;
  const dashOffset = -1 * (1 - pct) * circumference;

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="center">
      <Circle
        size="300px"
        bg={bgColor}
        position="relative"
        mt={4}
        onClick={handleCircleClick}
        cursor="pointer"
      >
        {animationMode === 'vertical' ? (
          <Circle
            size="280px"
            bg={progressColor}
            position="absolute"
            clipPath={`inset(${100 - (time / maxTime) * 100}% 0 0 0)`}
          />
        ) : (
          <Box
            position="absolute"
            width="280px"
            height="280px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
              {/* Background Circle */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                fill="transparent"
                stroke={progressColor}
                strokeWidth="140"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            </svg>
          </Box>
        )}

        <Box position="relative" zIndex={1} pointerEvents="none">
          <Text fontSize="6xl" fontWeight="bold" color={textColor}>
            {formatTime(time)}
          </Text>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={textColor}
            textAlign="center"
          >
            {isBreak ? "休憩中" : "作業中"}
          </Text>
        </Box>
      </Circle>

      <HStack
        mt={4}
        bg={segmentBg}
        p={1}
        borderRadius="full"
        spacing={0}
      >
        <Box
          as="button"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setAnimationMode('vertical'); }}
          bg={animationMode === 'vertical' ? activeBg : "transparent"}
          color={animationMode === 'vertical' ? activeColor : "gray.500"}
          boxShadow={animationMode === 'vertical' ? "sm" : "none"}
          px={4}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
          transition="all 0.2s"
        >
          垂直
        </Box>
        <Box
          as="button"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setAnimationMode('radial'); }}
          bg={animationMode === 'radial' ? activeBg : "transparent"}
          color={animationMode === 'radial' ? activeColor : "gray.500"}
          boxShadow={animationMode === 'radial' ? "sm" : "none"}
          px={4}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
          transition="all 0.2s"
        >
          円形
        </Box>
      </HStack>

      <ColorPickerComponent
        colorPick={colorPick}
        setColorPick={setColorPick}
        pickerVisible={pickerVisible}
        setPickerVisible={setPickerVisible}
      />
    </Box>
  );
};

export default TimerDisplay;
