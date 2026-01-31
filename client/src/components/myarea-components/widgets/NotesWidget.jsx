/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import CreateNoteModal from "../../shared/notes/CreateNoteModal";
import EditNoteModal from "../../shared/notes/EditNoteModal";
import DeleteConfirmModal from "../../shared/notes/DeleteConfirmModal";
import { Link } from "react-router-dom";

const NotesWidget = ({isSidebarEditing}) => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Meeting Notes",
      content: "Discussed new training programs with the team",
      category: "studio",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Personal Goals",
      content: "Focus on improving client retention this quarter",
      category: "personal",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-14",
    },
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
    { value: "studio", label: "Studio" },
  ];

  const filteredNotes = notes.filter(
    (note) => filter === "all" || note.category === filter
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDropdownClick =
        event.target.closest("[data-dropdown-button]") ||
        event.target.closest("[data-dropdown-menu]");

      if (!isDropdownClick) setOpenDropdownId(null);
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
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setNotes([note, ...notes]);
  };

  const handleUpdateNote = (updatedNoteData) => {
    setNotes(
      notes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              ...updatedNoteData,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : note
      )
    );
    setSelectedNote(null);
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      setNotes(notes.filter((note) => note.id !== noteToDelete.id));
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
      {/* Main Card Container */}
      <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] flex flex-col md:h-[340px] h-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notes</h2>
          {!isSidebarEditing && <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus size={18} />
          </button>}
        </div>

        {/* Filter */}
        <div className="w-full">
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

        {/* Scrollable Notes */}
        <div className="flex-1 overflow-y-auto max-h-60 custom-scrollbar pr-1 mt-2">
          <div className="space-y-3">
            {filteredNotes.length > 0 ? (
              filteredNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="p-3 bg-black rounded-xl relative">
                  <div className="absolute top-3 right-3">
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
                        className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px] border border-gray-600"
                      >
                        <button
                          onClick={(e) => handleEditClick(note, e)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(note, e)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pr-8">
                    <h3 className="font-semibold text-sm">{note.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-zinc-500 capitalize">
                        {note.category}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {note.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No notes found</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ See All (Now Inside Container) */}
        {filteredNotes.length > 0 && (
          <Link to="/dashboard/notes">
            <div className="flex justify-center pt-2">
              <button className="text-sm text-white hover:underline">
                See all
              </button>
            </div>
          </Link>
        )}
      </div>

      {/* Modals */}
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
