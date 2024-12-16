import {
  Button,
  Flex,
  Icon,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Box,
} from "@chakra-ui/react";
import { FaMinus, FaPlus, FaUpload } from "react-icons/fa";
import { useEffect } from "react";

interface SoundComponentProps {
  volume: number;
  setVolume: (volume: number) => void;
  handleSoundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customSoundName: string | null;
  bgColor: string;
  audioRef: React.RefObject<HTMLAudioElement>;
  handleMinus: () => void;
  handlePlus: () => void;
  playSound: () => void;
}

const SoundComponent: React.FC<SoundComponentProps> = ({
    volume,
    setVolume,
    handleSoundUpload,
    customSoundName,
    bgColor,
    audioRef,
    handleMinus,
    handlePlus,
    playSound,
  }) => {
  useEffect(() => {
    if (audioRef.current) {
     audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  return (
    <div>
      <Flex mt={3}>
        <Button as="label" htmlFor="sound-upload" cursor="pointer" h={12}>
          <Icon as={FaUpload} boxSize={6} />
          <Input
            id="sound-upload"
            type="file"
            accept="audio/*"
            onChange={handleSoundUpload}
            display="none"
          />
        </Button>
        <Button onClick={playSound} ml={2} h={50} fontSize={18}>
          音声視聴
        </Button>
        <Box
          border="2px"
          borderColor="gray.200"
          borderRadius="md"
          bg={bgColor}
          p={2}
          ml={2}
          w="140px"
          isTruncated
        >
          <Text
            textAlign="center"
            alignItems="center"
            mt={1}
            color="black"
            fontWeight="bold"
            fontSize={17}
          >
            {customSoundName}
          </Text>
        </Box>
      </Flex>

      <Flex alignItems="center" width="100%" mt={3}>
        <Icon
          onClick={handleMinus}
          as={FaMinus}
          boxSize={8}
          mr={4}
          flexShrink={0}
          cursor="pointer"
        />

        <Slider
          aria-label="volume-slider"
          value={volume}
          onChange={(val) => setVolume(val)}
          min={0}
          max={100}
          step={1}
          flex={1}
        >
          <SliderTrack h={2}>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Icon
          onClick={handlePlus}
          as={FaPlus}
          boxSize={8}
          ml={4}
          flexShrink={0}
          cursor="pointer"
        />
      </Flex>
    </div>
  );
};

export default SoundComponent;
