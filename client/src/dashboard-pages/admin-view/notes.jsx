/* eslint-disable no-unused-vars */
import { useState } from "react"
import CreateNoteModal from "../../components/user-panel-components/notes-components/CreateNoteModal"
import EditNoteModal from "../../components/user-panel-components/notes-components/EditNoteModal"
import DeleteConfirmModal from "../../components/user-panel-components/notes-components/DeleteConfirmModal"


import { demoNotes } from "../../utils/user-panel-states/notes-states"
import toast, { Toaster } from "react-hot-toast"
import { IoIosMenu } from "react-icons/io"


import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import ConfirmationModal from '../../components/admin-dashboard-components/myarea-components/confirmation-modal';
import Sidebar from '../../components/admin-dashboard-components/central-sidebar';


export default function NotesApp() {
    const [notes, setNotes] = useState(demoNotes)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingNote, setEditingNote] = useState(null)
    const [viewingNote, setViewingNote] = useState(null)

    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const createNote = (noteData) => {
      const note = {
          id: Date.now(),
          title: noteData.title,
          content: noteData.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
      }
  
      setNotes((prev) => [...prev, note])
  }

  const updateNote = (id, updatedNote) => {
    setNotes((prev) => 
        prev.map((note) =>
            note.id === id ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } : note
        )
    )
}

const deleteNote = (id) => {
  setNotes((prev) => prev.filter((note) => note.id !== id))
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


     //sidebar related logic and states 
      const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
      const [isEditing, setIsEditing] = useState(false)
      const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
      const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
      const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
      const [editingLink, setEditingLink] = useState(null)
      const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
    
      const [sidebarWidgets, setSidebarWidgets] = useState([
        { id: "sidebar-chart", type: "chart", position: 0 },
        { id: "sidebar-todo", type: "todo", position: 1 },
        { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
        { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
        { id: "sidebar-notes", type: "notes", position: 4 },
      ])
    
      const [todos, setTodos] = useState([
        {
          id: 1,
          title: "Review Design",
          description: "Review the new dashboard design",
          assignee: "Jack",
          dueDate: "2024-12-15",
          dueTime: "14:30",
        },
        {
          id: 2,
          title: "Team Meeting",
          description: "Weekly team sync",
          assignee: "Jack",
          dueDate: "2024-12-16",
          dueTime: "10:00",
        },
      ])
    
      const memberTypes = {
        "Studios Acquired": {
          data: [
            [30, 45, 60, 75, 90, 105, 120, 135, 150],
            [25, 40, 55, 70, 85, 100, 115, 130, 145],
          ],
          growth: "12%",
          title: "Studios Acquired",
        },
        Finance: {
          data: [
            [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
            [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
          ],
          growth: "8%",
          title: "Finance Statistics",
        },
        Leads: {
          data: [
            [120, 150, 180, 210, 240, 270, 300, 330, 360],
            [100, 130, 160, 190, 220, 250, 280, 310, 340],
          ],
          growth: "15%",
          title: "Leads Statistics",
        },
        Franchises: {
          data: [
            [120, 150, 180, 210, 240, 270, 300, 330, 360],
            [100, 130, 160, 190, 220, 250, 280, 310, 340],
          ],
          growth: "10%",
          title: "Franchises Acquired",
        },
      }
    
      const [customLinks, setCustomLinks] = useState([
        {
          id: "link1",
          url: "https://fitness-web-kappa.vercel.app/",
          title: "Timathy Fitness Town",
        },
        { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
        { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
      ])
    
      const [expiringContracts, setExpiringContracts] = useState([
        {
          id: 1,
          title: "Oxygen Gym Membership",
          expiryDate: "June 30, 2025",
          status: "Expiring Soon",
        },
        {
          id: 2,
          title: "Timathy Fitness Equipment Lease",
          expiryDate: "July 15, 2025",
          status: "Expiring Soon",
        },
        {
          id: 3,
          title: "Studio Space Rental",
          expiryDate: "August 5, 2025",
          status: "Expiring Soon",
        },
        {
          id: 4,
          title: "Insurance Policy",
          expiryDate: "September 10, 2025",
          status: "Expiring Soon",
        },
        {
          id: 5,
          title: "Software License",
          expiryDate: "October 20, 2025",
          status: "Expiring Soon",
        },
      ])

       // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }
    
      // -------------- end of sidebar logic

    return (
        <>
            <style>
                {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
        `}
            </style>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />
            <div className={`
    min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
    transition-all duration-500 ease-in-out flex-1  ${isRightSidebarOpen
        ? 'lg:mr-86 mr-0'
        : 'mr-0'
      }
  `}>
                <div className=" ">
                    <div className="mb-8 flex justify-between items-center w-full">
                        <h1 className="text-xl md:text-2xl font-bold oxanium_font whitespace-nowrap">Notes</h1>
                        <div>
                            <div className="block">
                            <img
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="h-5 w-5  cursor-pointer"
                  src="/icon.svg"
                  alt=""
                />
                            </div>
                        </div>

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
                    {notes.length === 0 ? (
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
                            <p className="text-gray-500 mb-6">Create your first note to get started</p>
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
                        <div
                            className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
                                } gap-6`}
                        >
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="bg-[#1A1A1A] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 h-64 flex flex-col"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-white line-clamp-1 flex-1 mr-2">
                                                {note.title}
                                            </h3>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => setViewingNote(note)}
                                                    className="text-gray-400 hover:text-green-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                                    title="View note"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </button>
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
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-1 overflow-hidden">
                                            {note.content}
                                        </p>
                                        <div className="text-xs text-gray-500 mt-auto">
                                            <p>Created: {formatDate(note.createdAt)}</p>
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

            {viewingNote && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1A1A] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-800">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-white pr-8">{viewingNote.title}</h2>
                            <button
                                onClick={() => setViewingNote(null)}
                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                                {viewingNote.content}
                            </p>
                        </div>
                        <div className="p-6 border-t border-gray-800 text-xs text-gray-500 space-y-1">
                            <p>Created: {formatDate(viewingNote.createdAt)}</p>
                            {viewingNote.updatedAt !== viewingNote.createdAt && (
                                <p>Updated: {formatDate(viewingNote.updatedAt)}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

              {/* sidebar related modals */}

      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
        onToggleEditing={()=>{ setIsEditing(!isEditing);}} // Add this line
        setTodos={setTodos}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}



        </>
    )
}