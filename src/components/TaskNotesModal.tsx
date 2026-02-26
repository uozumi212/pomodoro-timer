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
	Box,
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
	const [modalPosition, setModalPosition] = useState({ top: 120, left: 80 });
	const dragOffsetRef = useRef({ x: 0, y: 0 });
	const isDraggingRef = useRef(false);
	const toast = useToast();

	useEffect(() => {
		const savedNotes = localStorage.getItem("pomodoroTaskNotes");
		if (savedNotes) {
			try {
				const parsedNotes = JSON.parse(savedNotes);
				setNotes(parsedNotes);
			} catch {
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

	// Add or update a note
	const addOrUpdateNote = () => {
		if (currentNote.trim() === "") return;

		let updatedNotes: Note[];

		if (editingNoteId) {
			updatedNotes = notes.map((note) => {
				if (note.id === editingNoteId) {
					return {
						...note,
						text: currentNote,
						category: currentCategory || note.category,
						lastEdited: new Date().toLocaleString("ja-JP"),
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
		if (e.key === "Escape" && editingNoteId) {
			e.preventDefault();
			setEditingNoteId(null);
			setCurrentNote("");
		}
	};

	const deleteNote = (id: string) => {
		const updatedNotes = notes.filter((note) => note.id !== id);
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

	const handleDragStart = (e: React.MouseEvent<HTMLElement>) => {
		if (e.button !== 0) return;
		const target = e.target as HTMLElement;
		if (target.closest("button,input,textarea,select,a,[role='button'],[contenteditable='true']")) return;
		if (target.closest("[data-no-drag='true']")) return;

		isDraggingRef.current = true;
		dragOffsetRef.current = {
			x: e.clientX - modalPosition.left,
			y: e.clientY - modalPosition.top,
		};
		document.body.style.userSelect = "none";
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} isCentered={false} closeOnOverlayClick={true} closeOnEsc={true}>
			<ModalOverlay sx={{ pointerEvents: "none" }} backgroundColor="transparent" />
			<ModalContent
				position="fixed"
				minWidth="300px"
				width="500px"
				maxWidth="80vw"
				minHeight="300px"
				maxHeight="80vh"
				top={`${modalPosition.top}px`}
				left={`${modalPosition.left}px`}
				color="black"
				onMouseDown={handleDragStart}
				sx={{
					backgroundColor: "white",
					border: "1px solid #E2E8F0",
					borderRadius: "8px",
					boxShadow: "0 4px 6px rgba(0, 0, 0 , 0.1)",
					resize: "both",
					overflow: "auto",
					"&:hover": {
						boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
					},
					"&:active": {
						cursor: "move",
					},
					// リサイズハンドルをカスタマイズ
					"&::after": {
						content: '""',
						position: "absolute",
						bottom: "0",
						right: "0",
						width: "15px",
						height: "15px",
						cursor: "nwse-resize",
						background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)",
					},
				}}
			>
				<ModalHeader
					sx={{
						textAlign: "center",
						cursor: "move",
						borderBottom: "1px solid #E2E8F0",
						backgroundColor: "#F7FAFC",
						borderTopRadius: "8px",
						fontWeight: "bold",
						userSelect: "none",
						color: "black",
						fontSize: "20px",
						padding: "10px 0",
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
						position: "absolute",
						right: "8px",
						top: "13px",
						color: "black",
						fontSize: "20px",
						"&:hover": {
							backgroundColor: "#EDF2F7",
						},
					}}
				/>

				<ModalBody
					sx={{
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						height: "calc(100% - 120px)",
						overflowY: "auto",
					}}
				>
					<Box mb={4}>
						<Flex direction="column">
							<Textarea
								value={currentNote}
								onChange={(e) => setCurrentNote(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder={editingNoteId ? "メモを編集中...(Shift+Enterで更新)" : "新しいタスクメモを入力してください...(Shift+Enterで追加)"}
								size="md"
								resize="none"
								height="100px"
								fontSize="16px"
								mb={2}
								sx={{
									border: editingNoteId ? "1px solid #ED8936" : "1px solid #CBD5E0",
									borderRadius: "4px",
									padding: "10px",
									"&:focus": {
										borderColor: editingNoteId ? "#ED8936" : "#3182CE",
										boxShadow: `0 0 0 1px ${editingNoteId ? "#ED8936" : "#3182CE"}`,
									},
								}}
							/>

							<Flex mt={2} justifyContent="space-between" alignItems="center">
								<Flex>
									{CATEGORIES.map((category) => (
										<Button
											key={category.value}
											size="sm"
											ml={4}
											colorScheme={category.value === currentCategory ? category.color.split(".")[0] : "gray"}
											variant={category.value === currentCategory ? "solid" : "outline"}
											onClick={() => setCurrentCategory(category.value === currentCategory ? "" : category.value)}
										>
											{category.label}
										</Button>
									))}
								</Flex>

								<Flex>
									<IconButton aria-label={editingNoteId ? "Update note" : "Add note"} icon={<AddIcon />} colorScheme={editingNoteId ? "orange" : "teal"} onClick={addOrUpdateNote} mr={2} />
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

					<Box mt={2} mb={2} alignItems="center">
						<InputGroup mr={2} justifyContent="space-between" width={300}>
							<InputLeftElement pointerEvents="none">
								<SearchIcon color="gray.400" fontSize={16} ml={2} />
							</InputLeftElement>
							<Input placeholder="メモを検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} borderRadius="md" pl={8} size="md" mb={2} ml={2} />
						</InputGroup>

						<Flex whiteSpace="nowrap" py={1}>
							<Button size="md" fontSize={14} ml={2} colorScheme={filterCategory === "" ? "gray" : "gray"} variant={filterCategory === "" ? "solid" : "outline"} onClick={() => setFilterCategory("")}>
								すべて
							</Button>
							{CATEGORIES.map((category) => (
								<Button
									key={category.value}
									fontSize={14}
									size="md"
									ml={4}
									colorScheme={category.color.split(".")[0]}
									variant={filterCategory === category.value ? "solid" : "outline"}
									onClick={() => setFilterCategory(filterCategory === category.value ? "" : category.value)}
								>
									{category.label}
								</Button>
							))}
						</Flex>
					</Box>

					<VStack mt={8} spacing={4} align="stretch" flex="1" overflowY="auto">
						{notes.length === 0 ? (
							<Text color="gray.500" textAlign="center">
								メモはまだありません。新しいメモを追加してください。
							</Text>
						) : searchQuery && !notes.some((note) => note.text.toLowerCase().includes(searchQuery.toLowerCase()) || note.timestamp.includes(searchQuery)) ? (
							<Text color="gray.500" textAlign="center">
								検索結果はありません。
							</Text>
						) : (
							[...notes]
								.filter(
									(note) =>
										// Filter by search query
										(searchQuery === "" || note.text.toLowerCase().includes(searchQuery.toLowerCase()) || note.timestamp.includes(searchQuery)) &&
										// Filter by category
										(filterCategory === "" || note.category === filterCategory),
								)
								.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
								.map((note) => (
									<Box
										key={note.id}
										p={2}
										borderWidth="1px"
										borderRadius="md"
										position="relative"
										_hover={{
											boxShadow: "sm",
											"& > .action-btn": { opacity: 1 },
										}}
										bg={editingNoteId === note.id ? "orange.50" : "white"}
									>
										<Flex position="absolute" top={6} right={2}>
											<IconButton
												aria-label="Edit note"
												icon={<EditIcon boxSize={7} color="white" />}
												size="sm"
												colorScheme="blue"
												opacity={1}
												className="action-btn"
												onClick={() => editNote(note)}
												transition="opacity 0.2s"
												mr={1}
												mt={1}
												mb={1}
											/>
											<IconButton
												aria-label="Delete note"
												icon={<DeleteIcon boxSize={8} color="red" />}
												size="md"
												colorScheme="white"
												opacity={1}
												className="action-btn"
												onClick={() => deleteNote(note.id)}
												transition="opacity 0.2s"
											/>
										</Flex>
										<Flex justifyContent="space-between" alignItems="center" pb={1}>
											<Flex alignItems="center">
												<Text fontSize="xs" color="gray.500" mb={1}>
													{note.timestamp}
												</Text>
												{note.category && (
													<Box ml={2} px={2} py={0.5} borderRadius="full" bg={CATEGORIES.find((c) => c.value === note.category)?.color || "gray.500"} color="white" fontSize="xs">
														{CATEGORIES.find((c) => c.value === note.category)?.label || note.category}
													</Box>
												)}
											</Flex>
											{note.lastEdited && (
												<Text fontSize="xs" color="orange.500" mb={1} mt={-2} mr={1}>
													編集: {note.lastEdited}
												</Text>
											)}
										</Flex>
										<Text data-no-drag="true" whiteSpace="pre-wrap" userSelect="text" cursor="text">
											{note.text}
										</Text>
									</Box>
								))
						)}
					</VStack>

					<Flex justifyContent="center" mt={8}>
						<Button onClick={onClose} color="white" width="50%" borderRadius="5px" padding={6} backgroundColor="black">
							閉じる
						</Button>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default TaskNotesModal;
