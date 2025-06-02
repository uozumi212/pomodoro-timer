import { Box, Circle, Text, useColorModeValue } from "@chakra-ui/react";
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

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const progressColor = colorPick;

  const handleCircleClick = () => {
    setPickerVisible(!pickerVisible);
  };

  return (
    <Box position="relative">
      <Circle
        size="300px"
        bg={bgColor}
        position="relative"
        mt={4}
        onClick={handleCircleClick}
      >
        <Circle
          size="280px"
          bg={progressColor}
          position="absolute"
          clipPath={`inset(${100 - (time / maxTime) * 100}% 0 0 0)`}
          _hover={{ cursor: "pointer" }}
        />
        <Box position="relative" zIndex={1}>
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
