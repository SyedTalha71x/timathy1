import { useState } from "react"
import CreateNoteModal from "../../components/notes-components/CreateNoteModal"
import EditNoteModal from "../../components/notes-components/EditNoteModal"
import DeleteConfirmModal from "../../components/notes-components/DeleteConfirmModal"
import { demoNotes } from "../../utils/user-panel-states/notes-states"

export default function NotesApp() {
  const [activeTab, setActiveTab] = useState("personal")
  const [notes, setNotes] = useState(demoNotes)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)





const createNote = (noteData) => {
  const note = {
    id: Date.now(),
    title: noteData.title,
    content: noteData.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  setNotes((prev) => ({
    ...prev,
    [activeTab]: [...prev[activeTab], note],
  }))
}

const updateNote = (id, updatedNote) => {
  setNotes((prev) => ({
    ...prev,
    [activeTab]: prev[activeTab].map((note) =>
      note.id === id ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } : note,
    ),
  }))
}

const deleteNote = (id) => {
  setNotes((prev) => ({
    ...prev,
    [activeTab]: prev[activeTab].filter((note) => note.id !== id),
  }))
  setDeleteConfirm(null)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const currentNotes = notes[activeTab]

return (
  <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white">
    <div className="container mx-auto md:p-5 p-3 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold oxanium_font whitespace-nowrap">Notes</h1>
      </div>

      {/* Tabs - Fixed border issue */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "personal" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
            }`}
        >
          Personal Notes
        </button>
        <button
          onClick={() => setActiveTab("studio")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "studio" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
            }`}
        >
          Studio Notes
        </button>
      </div>

      <div className="mb-8 flex justify-end items-center">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>

      {/* Notes Grid */}
      {currentNotes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-300 mb-3">No notes yet</h3>
          <p className="text-gray-500 mb-6">Create your first {activeTab} note to get started</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentNotes.map((note) => (
            <div
              key={note.id}
              className="bg-[#1A1A1A] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1 mr-2">{note.title}</h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      title="Edit note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(note)}
                      className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      title="Delete note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-6 line-clamp-4 leading-relaxed">{note.content}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Created: {formatDate(note.createdAt)}</p>
                  {note.updatedAt !== note.createdAt && <p>Updated: {formatDate(note.updatedAt)}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <CreateNoteModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={createNote} />

    <EditNoteModal
      isOpen={!!editingNote}
      onClose={() => setEditingNote(null)}
      note={editingNote}
      onSave={(updatedNote) => updateNote(editingNote.id, updatedNote)}
    />

    <DeleteConfirmModal
      isOpen={!!deleteConfirm}
      onClose={() => setDeleteConfirm(null)}
      onConfirm={() => deleteNote(deleteConfirm.id)}
      noteTitle={deleteConfirm?.title}
    />
  </div>
)
}