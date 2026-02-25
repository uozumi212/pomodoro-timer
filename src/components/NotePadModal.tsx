import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  Flex,
  Textarea,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface NotePadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotePadModal: React.FC<NotePadModalProps> = ({ isOpen, onClose }) => {
  const [noteContent, setNoteContent] = useState<string>("");
  const [fileName] = useState<string>("無題");
  const [modalPosition, setModalPosition] = useState({ top: 100, left: 60 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const toast = useToast();

  // Load note content from localStorage when component mounts
  useEffect(() => {
    const savedContent = localStorage.getItem("pomodoroNotepadContent");
    if (savedContent) {
      setNoteContent(savedContent);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setModalPosition({
        left: Math.max(0, event.clientX - dragOffsetRef.current.x),
        top: Math.max(0, event.clientY - dragOffsetRef.current.y),
      });
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, []);

  // Save note content to localStorage
  const saveNoteContent = () => {
    localStorage.setItem("pomodoroNotepadContent", noteContent);
    toast({
      title: "メモを保存しました",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Clear note content
  const clearNoteContent = () => {
    if (window.confirm("メモの内容をクリアしますか？")) {
      setNoteContent("");
      localStorage.removeItem("pomodoroNotepadContent");
      toast({
        title: "メモをクリアしました",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveNoteContent();
    }
  };

  const handleDragStart = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if (isDraggingRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest("button,input,textarea,select,a,[role='button'],[contenteditable='true']")) return;
    if (target.closest("[data-no-drag='true']")) return;

    e.preventDefault();
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - modalPosition.left,
      y: e.clientY - modalPosition.top,
    };
    document.body.style.userSelect = "none";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      isCentered={false}
      closeOnOverlayClick={true}
      closeOnEsc={true}
      size="xl"
    >
      <ModalOverlay sx={{ pointerEvents: "none" }} backgroundColor="transparent" />
      <ModalContent
        position="fixed"
        minWidth="400px"
        width="500px"
        height="100px"
        maxWidth="90vw"
        minHeight="400px"
        maxHeight="90vh"
        top={`${modalPosition.top}px`}
        left={`${modalPosition.left}px`}
        onMouseDown={handleDragStart}
        onDragStart={(e) => e.preventDefault()}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
            textAlign: 'left',
            cursor: 'move',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F0F0F0',
            borderTopRadius: '4px',
            fontWeight: 'bold',
            userSelect: 'none',
            color: 'black',
            fontSize: '16px',
            padding: '8px 16px',
            height: '40px',
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{fileName} - メモ帳</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            color: 'black',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#EDF2F7'
            }
          }}
        />

        {/* Menu Bar */}
        <Flex
          borderBottom="1px solid #E2E8F0"
          backgroundColor="#F0F0F0"
          px={2}
          py={1}
          color="black"
        >
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="ghost">
              ファイル
            </MenuButton>
            <MenuList>
              <MenuItem onClick={saveNoteContent}>保存 (Ctrl+S)</MenuItem>
              <MenuItem onClick={clearNoteContent}>新規作成</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="ghost">
              編集
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => document.execCommand('cut')}>切り取り (Ctrl+X)</MenuItem>
              <MenuItem onClick={() => document.execCommand('copy')}>コピー (Ctrl+C)</MenuItem>
              <MenuItem onClick={() => document.execCommand('paste')}>貼り付け (Ctrl+V)</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <ModalBody
          sx={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 80px)',
            overflow: 'hidden',
            color: 'black',
          }}
        >
          <Textarea
            data-no-drag="true"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ここにメモを入力してください..."
            size="md"
            resize="none"
            height="100%"
            fontSize="16px"
            fontFamily="monospace"
            border="none"
            borderRadius="0"
            p={4}
            sx={{
              '&:focus': {
                boxShadow: 'none',
                outline: 'none',
              }
            }}
          />
        </ModalBody>

        <Flex
          borderTop="1px solid #E2E8F0"
          backgroundColor="#F0F0F0"
          p={2}
          justifyContent="space-between"
        >
          <Button
            onClick={saveNoteContent}
            size="sm"
            colorScheme="blue"
            variant="outline"
            color="black"
            ml={8}
          >
            保存
          </Button>
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            color="black"
            mr={8}
          >
            閉じる
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default NotePadModal;
