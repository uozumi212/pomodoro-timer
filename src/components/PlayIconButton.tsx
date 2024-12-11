import { Button, Icon } from "@chakra-ui/react";
import { FaPause, FaPlay, FaSquare } from "react-icons/fa";
import { MdFreeBreakfast } from "react-icons/md";

interface PlayIconButtonProps {
  isActive: boolean;
  toggleTimer: () => void;
  setIsBreak: (isBreak: boolean) => void;
  resetTimer: (minutes: number) => void;
}

const PlayIconButton: React.FC<PlayIconButtonProps> = ({
  isActive,
  toggleTimer,
  setIsBreak,
  resetTimer,
}) => {

  return (
    <div>
      <Button
        colorScheme={isActive ? "red" : "green"}
        onClick={toggleTimer}
        aria-label={isActive ? "Pause" : "Play"}
        size="lg"
        borderRadius="full"
      >
        <Icon as={isActive ? FaPause : FaPlay} />
      </Button>
      <Button
        colorScheme="blue"
        ml={2}
        onClick={() => {
          setIsBreak(false);
          resetTimer(25);
        }}
        aria-label="Reset"
        size="lg"
        borderRadius="full"
      >
        <Icon as={FaSquare} />
      </Button>
      <Button
        h={12}
        ml={4}
        onClick={() => {
          setIsBreak(true);
          resetTimer(5);
        }}
      >
        <Icon as={MdFreeBreakfast} boxSize={6} />
      </Button>
    </div>
  );
};

export default PlayIconButton;
