import React, { useState, useEffect } from "react";
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
  Box,
  Divider,
  IconButton,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";

interface Note {
  id: string;
  text: string;
  timestamp: string;
  lastEdited?: string;
  category?: string;
}

interface TaskNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { value: "work", label: "作業", color: "blue.500" },
  { value: "study", label: "勉強", color: "green.500" },
  { value: "personal", label: "個人", color: "purple.500" },
  { value: "important", label: "重要", color: "red.500" },
  { value: "idea", label: "アイデア", color: "orange.500" },
];

const TaskNotesModal: React.FC<TaskNotesModalProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const toast = useToast();

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem("pomodoroTaskNotes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Failed to parse saved notes:", error);
        // If there's an error parsing, try to migrate old format
        if (typeof savedNotes === "string") {
          const newNote = {
            id: Date.now().toString(),
            text: savedNotes,
            timestamp: new Date().toLocaleString("ja-JP"),
          };
          setNotes([newNote]);
        }
      }
    }
  }, []);

  // Add or update a note
  const addOrUpdateNote = () => {
    if (currentNote.trim() === "") return;

    let updatedNotes: Note[];

    if (editingNoteId) {
      // Update existing note
      updatedNotes = notes.map(note => {
        if (note.id === editingNoteId) {
          return {
            ...note,
            text: currentNote,
            category: currentCategory || note.category,
            lastEdited: new Date().toLocaleString("ja-JP")
          };
        }
        return note;
      });

      toast({
        title: "メモを更新しました",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setEditingNoteId(null);
    } else {
      // Add new note
      const newNote = {
        id: Date.now().toString(),
        text: currentNote,
        timestamp: new Date().toLocaleString("ja-JP"),
        category: currentCategory || undefined,
      };

      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    setCurrentNote("");
    setCurrentCategory("");
    saveNotesToStorage(updatedNotes);
  };

  // Start editing a note
  const editNote = (note: Note) => {
    setCurrentNote(note.text);
    setCurrentCategory(note.category || "");
    setEditingNoteId(note.id);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Shift+Enter to add or update a note
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      addOrUpdateNote();
    }

    // Escape to cancel editing (if currently editing)
    if (e.key === "Escape" && editingNoteId) {
      e.preventDefault();
      setEditingNoteId(null);
      setCurrentNote("");
    }

    // Escape to close the modal (handled by Chakra UI Modal)
  };

  // Delete a note
  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // Save notes to localStorage
  const saveNotesToStorage = (notesToSave: Note[]) => {
    localStorage.setItem("pomodoroTaskNotes", JSON.stringify(notesToSave));
    toast({
      title: "メモを保存しました",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      isCentered={false}
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <ModalOverlay sx={{ pointerEvents: "none" }} backgroundColor="transparent" />
      <ModalContent
        position="fixed"
        draggable="true"
        minWidth="300px"
        width="500px"
        maxWidth="80vw"
        minHeight="300px"
        maxHeight="80vh"
        top="20%"
        left="5%"
        color="black"
        onDragStart={(e) => {
          const target = e.target as HTMLDivElement;
          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          target.dataset.x = x.toString();
          target.dataset.y = y.toString();
        }}
        onDrag={(e) => {
          if (e.clientX === 0 && e.clientY === 0) return;
          const target = e.target as HTMLDivElement;
          const x = parseInt(target.dataset.x || "0");
          const y = parseInt(target.dataset.y || "0");
          target.style.left = `${e.clientX - x}px`;
          target.style.top = `${e.clientY - y}px`;
        }}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0 , 0.1)',
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
            textAlign: 'center',
            cursor: 'move',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F7FAFC',
            borderTopRadius: '8px',
            fontWeight: 'bold',
            userSelect: 'none',
            color: 'black',
            fontSize: '20px',
            padding: '10px 0',
          }}
        >
          <Flex justifyContent="space-around" alignItems="center" width="100%" px={4}>
            <Text>タスクメモ</Text>
            <Text fontSize="sm" color="gray.500">
              {notes.length > 0 ? `${notes.length}件のメモ` : ""}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton
          sx={{
            position: 'absolute',
            right: '8px',
            top: '13px',
            color: 'black',
            fontSize: '20px',
            '&:hover': {
              backgroundColor: '#EDF2F7'
            }
          }}
        />

        <ModalBody
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 120px)',
            overflowY: 'auto',
          }}
        >
          <Box mb={4}>
            <Flex direction="column">
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={editingNoteId 
                  ? "メモを編集中...(Shift+Enterで更新)" 
                  : "新しいタスクメモを入力してください...(Shift+Enterで追加)"}
                size="md"
                resize="none"
                height="100px"
                fontSize="16px"
                mb={2}
                sx={{
                  border: editingNoteId ? '1px solid #ED8936' : '1px solid #CBD5E0',
                  borderRadius: '4px',
                  padding: '10px',
                  '&:focus': {
                    borderColor: editingNoteId ? '#ED8936' : '#3182CE',
                    boxShadow: `0 0 0 1px ${editingNoteId ? '#ED8936' : '#3182CE'}`,
                  }
                }}
              />

              <Flex mt={2} justifyContent="space-between" alignItems="center">
                <Flex>
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.value}
                      size="sm"
                      ml={6}
                      colorScheme={category.value === currentCategory ? category.value.split('.')[0] : "gray"}
                      variant={category.value === currentCategory ? "solid" : "outline"}
                      onClick={() => setCurrentCategory(
                        category.value === currentCategory ? "" : category.value
                      )}
                    >
                      {category.label}
                    </Button>
                  ))}
                </Flex>

                <Flex>
                  <IconButton
                    aria-label={editingNoteId ? "Update note" : "Add note"}
                    icon={<AddIcon />}
                    colorScheme={editingNoteId ? "orange" : "teal"}
                    onClick={addOrUpdateNote}
                    mr={2}
                  />
                  {editingNoteId && (
                    <IconButton
                      aria-label="Cancel editing"
                      icon={<DeleteIcon />}
                      colorScheme="gray"
                      onClick={() => {
                        setEditingNoteId(null);
                        setCurrentNote("");
                        setCurrentCategory("");
                      }}
                    />
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Box>

          <Divider mb={4} />

          <Flex mt={4} mb={4} alignItems="center">
            <InputGroup mr={2} justifyContent="space-between" width={200}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" mt={5} ml={4} fontSize={14} />
              </InputLeftElement>
              <Input
                placeholder="メモを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="md"
                pl={20}
                size="md"
              />
            </InputGroup>

            <Flex overflowX="auto" whiteSpace="nowrap" py={1} mr={20}>
              <Button 
                size="sm" 
                ml={8}
                colorScheme={filterCategory === "" ? "gray" : "gray"} 
                variant={filterCategory === "" ? "solid" : "outline"}
                onClick={() => setFilterCategory("")}
              >
                すべて
              </Button>
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  size="sm"
                  ml={4}
                  colorScheme={category.value.split('.')[0]}
                  variant={filterCategory === category.value ? "solid" : "outline"}
                  onClick={() => setFilterCategory(
                    filterCategory === category.value ? "" : category.value
                  )}
                >
                  {category.label}
                </Button>
              ))}
            </Flex>
          </Flex>

          <VStack mt={8} spacing={4} align="stretch" flex="1" overflowY="auto">
            {notes.length === 0 ? (
              <Text color="gray.500" textAlign="center">メモはまだありません。新しいメモを追加してください。</Text>
            ) : searchQuery && !notes.some(note => 
                note.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                note.timestamp.includes(searchQuery)
              ) ? (
              <Text color="gray.500" textAlign="center">検索結果はありません。</Text>
            ) : (
              // Filter notes by search query and sort by timestamp (newest first)
              [...notes]
                .filter(note => (
                  // Filter by search query
                  (searchQuery === "" || 
                   note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   note.timestamp.includes(searchQuery)) &&
                  // Filter by category
                  (filterCategory === "" || note.category === filterCategory)
                ))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((note) => (
                <Box 
                  key={note.id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  position="relative"
                  _hover={{ 
                    boxShadow: "sm",
                    "& > .action-btn": { opacity: 1 }
                  }}
                  bg={editingNoteId === note.id ? "orange.50" : "white"}
                >
                  <Flex position="absolute" top={2} right={2}>
                    <IconButton
                      aria-label="Edit note"
                      icon={<EditIcon boxSize={20} color="blue" />}
                      size="md"
                      colorScheme="blue"
                      opacity={1}
                      className="action-btn"
                      onClick={() => editNote(note)}
                      transition="opacity 0.2s"
                      mr={1}
                    />
                    <IconButton
                      aria-label="Delete note"
                      icon={<DeleteIcon boxSize={20} color="red" />}
                      size="xl"
                      colorScheme="red"
                      opacity={1}
                      className="action-btn"
                      onClick={() => deleteNote(note.id)}
                      transition="opacity 0.2s"
                    />
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center">
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        {note.timestamp}
                      </Text>
                      {note.category && (
                        <Box 
                          ml={2} 
                          px={2} 
                          py={0.5} 
                          borderRadius="full" 
                          bg={CATEGORIES.find(c => c.value === note.category)?.color || "gray.500"}
                          color="white"
                          fontSize="xs"
                        >
                          {CATEGORIES.find(c => c.value === note.category)?.label || note.category}
                        </Box>
                      )}
                    </Flex>
                    {note.lastEdited && (
                      <Text fontSize="xs" color="orange.500" mb={1}>
                        編集: {note.lastEdited}
                      </Text>
                    )}
                  </Flex>
                  <Text whiteSpace="pre-wrap">{note.text}</Text>
                </Box>
              ))
            )}
          </VStack>

          <Flex justifyContent="center" mt={8}>
            <Button
              onClick={onClose}
              color="white"
              width="50%"
              borderRadius="5px"
              padding={6}
              backgroundColor="black"
            >
              閉じる
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskNotesModal;
