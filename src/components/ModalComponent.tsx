import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import React from "react";

interface ModalComponentProps {
  isModalOpen1: boolean;
  isModalOpen2: boolean;
  onClose1: () => void;
  onClose2: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isModalOpen1,
  isModalOpen2,
  onClose1,
  onClose2,
}) => {
  const scrollBehavior = "inside";

  return (
    <div>
      <Modal isOpen={isModalOpen1} onClose={onClose1} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="40vw" maxHeight="80vh">
          <ModalCloseButton fontSize={18} />
          <ModalBody
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
          >
            <img
              src="../assets/説明書.png"
              alt="説明画像"
              width="100%"
              height="100%"
            />
            <Button
              colorScheme="blue"
              w="50%"
              mb={6}
              py={6}
              onClick={onClose1}
              mx="auto"
            >
              <Text fontSize="22" fontWeight="bold">
                閉じる
              </Text>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        onClose={onClose2}
        isOpen={isModalOpen2}
        scrollBehavior={scrollBehavior}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxWidth="60vw" maxHeight="80vh">
          <ModalHeader textAlign="center" fontSize={25}>
            シーン別使い分け
          </ModalHeader>
          <ModalCloseButton fontSize={18} />
          <ModalBody>
            <Flex color="gray.900" fontSize={20} flexWrap="wrap">
              {[
                {
                  label: "ライト",
                  value: "開放感、清潔感、未来志向、軽快な印象を与える",
                  usage:
                    "作業時：明るく集中できる環境を提供。休養時：軽快な気分でリラックスできる。",
                },
                {
                  label: "ダーク",
                  value:
                    "高級感、落ち着き、シックな印象を与える。神秘的な雰囲気も演出可能",
                  usage:
                    "作業時：落ち着いて集中できる環境を提供。休養時：静かでリラックスできる空間を演出。",
                },
                {
                  label: "レトロ",
                  value:
                    "懐かしさ、温かさ、落ち着き、安定感を与える。ノスタルジックな雰囲気も演出可能",
                  usage:
                    "作業時：安定感のある環境で集中力を高める。休養時：心地よくリラックスできる空間を提供。",
                },
                {
                  label: "赤色",
                  value:
                    "情熱、興奮、活気、注意を引きやすい。食欲を刺激する効果も",
                  usage:
                    "作業時：エネルギーと活気を提供し、モチベーションを高める。休養時：過剰な興奮を避けるため控えめに使用。",
                },
                {
                  label: "青色",
                  value:
                    "冷静、信頼、誠実、広がりを感じさせる。リラックス効果も",
                  usage:
                    "作業時：冷静で集中力を高める環境を提供。休養時：リラックス効果を促進し、穏やかな空間を演出。",
                },
                {
                  label: "黄色",
                  value:
                    "明るさ、楽しさ、好奇心、注意を引きやすい。暖かさも感じさせる",
                  usage:
                    "作業時：創造力やアイデアを活性化。休養時：楽しい雰囲気で気分を明るく保つ。",
                },
                {
                  label: "緑色",
                  value: "自然、癒し、安らぎ、調和。集中力を高める効果も",
                  usage:
                    "作業時：安らぎと集中力を両立させる環境を提供。休養時：リラックス効果を高め、自然に囲まれたような安らぎを演出。",
                },
                {
                  label: "水色",
                  value:
                    "爽やかさ、清潔感、広がり、涼しげな印象を与える。穏やかな気持ちにさせる",
                  usage:
                    "作業時：爽やかでクリアな思考を促進。休養時：清潔感とリラックス効果を高め、心を落ち着かせる。",
                },
              ].map(({ label, value, usage }, index) => (
                <Flex key={index} width="100%" mb={6}>
                  <Text
                    fontWeight="bold"
                    mr={2}
                    width="120px"
                    whiteSpace="nowrap"
                  >
                    {label}：
                  </Text>
                  <Flex direction="column" width="90%" fontSize={22}>
                    <Text>{value}</Text>
                    <Text>{usage}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter mx="auto">
            <Button onClick={onClose2} colorScheme="green" py={6} px={8}>
              <Text fontSize="22" fontWeight="bold">
                閉じる
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalComponent;
