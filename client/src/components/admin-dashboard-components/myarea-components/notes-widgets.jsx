
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Plus, Filter, MoreVertical, X, Edit, Trash2, ArrowDown } from "lucide-react";
import CreateNoteModal from "../../myarea-components/notes-widget-components/CreateNoteModal";
import EditNoteModal from "../../myarea-components/notes-widget-components/EditNoteModal";
import DeleteConfirmModal from "../../myarea-components/notes-widget-components/DeleteConfirmModal";

const NotesWidget = () => {
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: "Meeting Notes",
            content: "Discussed new training programs with the team",
            category: "studio",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Personal Goals",
            content: "Focus on improving client retention this quarter",
            category: "personal",
            createdAt: "2024-01-14",
            updatedAt: "2024-01-14"
        }
    ]);

    const [filter, setFilter] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const categories = [
        { value: "all", label: "All Notes" },
        { value: "personal", label: "Personal" },
        { value: "studio", label: "Studio" }
    ];

    const filteredNotes = notes.filter(note =>
        filter === "all" || note.category === filter
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is on dropdown button or dropdown menu
            const isDropdownClick = event.target.closest('[data-dropdown-button]') ||
                event.target.closest('[data-dropdown-menu]');

            if (!isDropdownClick) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCreateNote = (newNoteData) => {
        const note = {
            id: Date.now(),
            ...newNoteData,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        setNotes([note, ...notes]);
    };

    const handleUpdateNote = (updatedNoteData) => {
        setNotes(notes.map(note =>
            note.id === selectedNote.id
                ? { ...note, ...updatedNoteData, updatedAt: new Date().toISOString().split('T')[0] }
                : note
        ));
        setSelectedNote(null);
    };

    const handleDeleteNote = () => {
        if (noteToDelete) {
            setNotes(notes.filter(note => note.id !== noteToDelete.id));
            setNoteToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const handleEditClick = (note, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedNote(note);
        setIsEditModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleDeleteClick = (note, e) => {
        e.preventDefault();
        e.stopPropagation();
        setNoteToDelete(note);
        setIsDeleteModalOpen(true);
        setOpenDropdownId(null);
    };

    const toggleDropdown = (noteId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === noteId ? null : noteId);
    };

    return (
        <>
            <div className="space-y-4 p-4 rounded-xl md:h-[340px] h-auto bg-[#2F2F2F]">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Notes</h2>
                    <div className="flex items-center gap-2">


                        {/* Add Note Button */}
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                <div className="w-full relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full p-2 bg-black rounded-xl text-white text-sm"
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>

                 
                </div>


                <div className="space-y-3 max-h-50 overflow-y-auto custom-scrollbar">
                    {filteredNotes.map((note) => (
                        <div key={note.id} className="bg-black p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-sm">{note.title}</h3>
                                <div className="relative">
                                    <button
                                        data-dropdown-button
                                        onClick={(e) => toggleDropdown(note.id, e)}
                                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                                    >
                                        <MoreVertical size={14} />
                                    </button>

                                    {openDropdownId === note.id && (
                                        <div
                                            data-dropdown-menu
                                            className="absolute right-0 top-6 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[100px] border border-gray-600"
                                        >
                                            <button
                                                onClick={(e) => handleEditClick(note, e)}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-600 rounded-t-lg flex items-center gap-2 transition-colors"
                                            >
                                                <Edit size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(note, e)}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-600 rounded-b-lg text-red-400 flex items-center gap-2 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-300 text-xs mb-2 line-clamp-2">{note.content}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span className="capitalize px-2 py-1 rounded-full">{note.category}</span>
                                <span>{note.updatedAt}</span>
                            </div>
                        </div>
                    ))}

                    {filteredNotes.length === 0 && (
                        <div className="text-center py-4 text-gray-400">
                            <p className="text-sm">No notes found</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateNoteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateNote}
            />

            <EditNoteModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedNote(null);
                }}
                note={selectedNote}
                onSave={handleUpdateNote}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setNoteToDelete(null);
                }}
                onConfirm={handleDeleteNote}
                noteTitle={noteToDelete?.title || ""}
            />
        </>
    );
};

export default NotesWidget;