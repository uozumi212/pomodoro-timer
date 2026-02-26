import { Button, Icon } from "@chakra-ui/react";
import { FaPause, FaPlay, FaSquare } from "react-icons/fa";
import { MdFreeBreakfast } from "react-icons/md";
import type { Phase } from "../hooks/useTimer";

interface PlayIconButtonProps {
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: (phase: Phase) => void;
}

const PlayIconButton: React.FC<PlayIconButtonProps> = ({ isActive, toggleTimer, resetTimer }) => {
  return (
    <div>
      <Button colorScheme={isActive ? "red" : "green"} onClick={toggleTimer} aria-label={isActive ? "Pause" : "Play"} size="lg" borderRadius="full">
        <Icon as={isActive ? FaPause : FaPlay} />
      </Button>
      <Button colorScheme="blue" ml={2} onClick={() => resetTimer("work")} aria-label="Reset work" size="lg" borderRadius="full">
        <Icon as={FaSquare} />
      </Button>
      <Button h={12} ml={4} onClick={() => resetTimer("shortBreak")} aria-label="Start short break">
        <Icon as={MdFreeBreakfast} boxSize={6} />
      </Button>
    </div>
  );
};

export default PlayIconButton;
