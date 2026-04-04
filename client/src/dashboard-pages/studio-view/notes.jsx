/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react"
import { Search, Plus, X, GripVertical, Edit, Copy, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Paperclip, Tag, Pin, PinOff, ArrowRightLeft, Info } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { WysiwygEditor } from "../../components/shared/WysiwygEditor"
import DeleteConfirmModal from "../../components/shared/notes/DeleteConfirmModal"
import TagManagerModal from "../../components/shared/TagManagerModal"
import ImageSourceModal from "../../components/shared/image-handler/ImageSourceModal"
import MediaLibraryPickerModal from "../../components/shared/image-handler/MediaLibraryPickerModal"
import toast from "../../components/shared/SharedToast"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { getTagsThunk } from "../../features/todos/todosSlice"
import { createPersonalNotesThunk, createStudioNotesThunk, deleteNoteThunk, getPersonalNotesThunk, getStudioNotesThunk, updateNoteThunk } from "../../features/notes/noteSlice"

// Helper function to strip HTML tags and normalize whitespace for preview
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.replace(/\s+/g, ' ').trim()
}

const NoteOverlayItem = ({ note, availableTags, t }) => {
  const stripText = stripHtmlTags(note.content)
  return (
    <div
      className="bg-surface-hover/95 rounded-xl border border-primary/50 shadow-2xl"
      style={{ boxShadow: '0 12px 32px rgba(249, 115, 22, 0.25)', width: 'var(--note-list-width, 300px)' }}
    >
      <div className="flex items-start gap-2 p-3 overflow-hidden">
        <div className="text-primary mt-0.5 flex-shrink-0 p-1">
          <GripVertical className="w-5 h-5 md:w-3.5 md:h-3.5" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className={`text-sm font-medium truncate ${note.title ? 'text-content-primary' : 'text-content-faint italic'}`}>
            {note.title || 'Untitled'}
          </h4>
          <p className="text-xs text-content-muted mt-1 truncate">{stripText || t('notes.noContent')}</p>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {note.tags.slice(0, 3).map(tagId => {
                const tag = availableTags.find(t => t._id === tagId)
                return tag ? (
                  <span key={tagId} className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SortableNoteItem = React.memo(({ note, isSelected, onClick, availableTags, onPin, isPinning, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note._id })

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const stripText = stripHtmlTags(note.content)

  const handleNoteClick = (e) => {
    // Don't trigger if clicking on the drag handle or pin button
    if (e.target.closest('[data-drag-handle]') || e.target.closest('[data-pin-button]')) {
      return;
    }
    onClick(note);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    onPin(note._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-pointer select-none border-b border-border ${isSelected
        ? 'bg-surface-hover/80'
        : 'hover:bg-surface-hover/50 active:bg-surface-hover/70'
        } ${isDragging ? 'pointer-events-none' : ''}`}
      onClick={handleNoteClick}
    >
      <div className="flex items-start gap-2 p-3 overflow-hidden">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          data-drag-handle
          className="cursor-grab active:cursor-grabbing text-content-muted hover:text-content-primary active:text-primary mt-0.5 flex-shrink-0 touch-none p-2 -m-2 md:p-1 md:-m-1 rounded-lg active:bg-primary/30"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <GripVertical className="w-5 h-5 md:w-3.5 md:h-3.5" />
        </div>

        {/* Note Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-medium truncate ${note.title ? 'text-content-primary' : 'text-content-faint italic'}`}>
              {note.title || 'Untitled'}
            </h4>
            <button
              data-pin-button
              onClick={handlePinClick}
              disabled={isPinning}
              className="flex-shrink-0 p-1 rounded hover:bg-surface-hover transition-colors disabled:opacity-50"
              title={note.isPinned ? 'Unpin' : 'Pin'}
            >
              {isPinning ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent" />
              ) : note.isPinned ? (
                <Pin size={12} className="text-primary fill-primary" />
              ) : (
                <PinOff size={12} className="text-content-muted" />
              )}
            </button>
          </div>

          <p
            className="text-xs text-content-muted mb-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
          >
            {stripText || t('notes.noContent')}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 4).map(tagId => {
                const tag = availableTags.find(t => t._id === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="text-[10px] px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ) : null
              })}
              {note.tags.length > 4 && (
                <span className="text-[10px] text-content-faint">+{note.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default function NotesApp() {
  // Get notes from Redux
  const { tags = [] } = useSelector((state) => state.todos || {});
  const {
    personalNotes = [],
    studioNotes = [],
    loading
  } = useSelector((state) => state.notes || {});
  const dispatch = useDispatch();

  // Local state
  const [activeTab, setActiveTab] = useState("studio");
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [pinningNoteId, setPinningNoteId] = useState(null);

  // Editing state
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [editedAttachments, setEditedAttachments] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false);
  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Image source modal states
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);

  // Refs
  const sortDropdownRef = useRef(null);
  const desktopSortDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const mobileActionsMenuRef = useRef(null);
  const studioTooltipRef = useRef(null);
  const [showStudioTooltip, setShowStudioTooltip] = useState(false);
  const loadedNoteIdRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 0, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideMobileSort = sortDropdownRef.current && sortDropdownRef.current.contains(event.target);
      const isInsideDesktopSort = desktopSortDropdownRef.current && desktopSortDropdownRef.current.contains(event.target);
      if (!isInsideMobileSort && !isInsideDesktopSort) {
        setShowSortDropdown(false);
      }
      if (studioTooltipRef.current && !studioTooltipRef.current.contains(event.target)) {
        setShowStudioTooltip(false);
      }
      if (mobileActionsMenuRef.current && !mobileActionsMenuRef.current.contains(event.target)) {
        setShowMobileActionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notes and tags on mount
  useEffect(() => {
    dispatch(getTagsThunk());
    dispatch(getStudioNotesThunk());
    dispatch(getPersonalNotesThunk());
  }, [dispatch]);

  // Helper: select a note and set editing state
  const selectNote = (note) => {
    if (!note) {
      setSelectedNote(null);
      return;
    }

    // Only update if it's a different note
    if (!selectedNote || selectedNote._id !== note._id) {
      console.log('Selecting note:', note._id, 'Title:', note.title);

      setEditedTitle(note.title || '');
      setEditedContent(note.content || '');
      setEditedTags(note.tags || []);

      const attachments = (note.attachment || []).map(att => ({
        name: att.name,
        url: att.url,
        public_id: att.public_id,
        isNew: false
      }));
      setEditedAttachments(attachments || []);
      setHasUnsavedChanges(false);
      setShowAllAttachments(false);
      setShowAllTags(false);
      loadedNoteIdRef.current = note._id;
    }

    setSelectedNote(note);
  };

  // Cleanup editing state when note is closed
  useEffect(() => {
    if (!selectedNote) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      setEditedTitle('');
      setEditedContent('');
      setEditedTags([]);
      setEditedAttachments([]);
      setHasUnsavedChanges(false);
      setShowAllAttachments(false);
      setShowAllTags(false);
      loadedNoteIdRef.current = null;

      if (pendingSaveRef.current && pendingSaveRef.current.noteId) {
        const { noteId, updateData } = pendingSaveRef.current;
        dispatch(updateNoteThunk({ noteId, updateData }))
          .unwrap()
          .catch((error) => {
            console.error("Final save failed:", error);
          });
        pendingSaveRef.current = null;
      }
    }
  }, [selectedNote, dispatch]);

  // Auto-save functionality with debounce
  useEffect(() => {
    if (!selectedNote || !selectedNote._id) return;

    const hasTitleChange = editedTitle !== (selectedNote.title || '');
    const hasContentChange = editedContent !== (selectedNote.content || '');
    const hasTagsChange = JSON.stringify(editedTags) !== JSON.stringify(selectedNote.tags || []);

    const currentAttachments = editedAttachments.map(a => ({
      name: a.name,
      url: a.url,
      public_id: a.public_id
    }));
    const originalAttachments = (selectedNote.attachment || []).map(a => ({
      name: a.name,
      url: a.url,
      public_id: a.public_id
    }));
    const hasAttachmentsChange = JSON.stringify(currentAttachments) !== JSON.stringify(originalAttachments);

    if (!hasTitleChange && !hasContentChange && !hasTagsChange && !hasAttachmentsChange) {
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      setIsAutoSaving(true);

      try {
        const updateData = {};

        if (hasTitleChange) updateData.title = editedTitle;
        if (hasContentChange) updateData.content = editedContent;
        if (hasTagsChange) updateData.tagsId = editedTags;

        if (hasAttachmentsChange) {
          const attachmentsToSave = editedAttachments.map(att => ({
            name: att.name,
            url: att.url,
            public_id: att.public_id
          }));
          updateData.attachment = attachmentsToSave;
        }

        await dispatch(updateNoteThunk({
          noteId: selectedNote._id,
          updateData
        })).unwrap();

      } catch (error) {
        console.error("Auto-save failed:", error);
        if (error.message !== 'Request failed with status code 304') {
          toast.error(t("notes.toasts.failedAutoSave"));
        }
      } finally {
        setIsAutoSaving(false);
      }
    }, 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [selectedNote, editedTitle, editedContent, editedTags, editedAttachments, dispatch]);

  // Create new note
  const handleCreateNote = async () => {
    const newNote = {
      title: 'untitled',
      content: '',
      tags: [],
      attachment: [],
      isPinned: false,
    };

    try {
      let result;
      if (activeTab === 'studio') {
        result = await dispatch(createStudioNotesThunk(newNote)).unwrap();
        await dispatch(getStudioNotesThunk());
      } else {
        result = await dispatch(createPersonalNotesThunk(newNote)).unwrap();
        await dispatch(getPersonalNotesThunk());
      }

      if (result && result._id) {
        selectNote(result);
        t_noteCreated(); function t_noteCreated() { toast.success(t("notes.toasts.created")) };

        setTimeout(() => {
          const titleInputs = document.querySelectorAll('[data-title-input]');
          const visibleInput = Array.from(titleInputs).find(input => {
            const rect = input.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          if (visibleInput) {
            visibleInput.focus();
          }
        }, 100);
      } else {
        console.error('Created note missing _id:', result);
        t_noteCreated(); function t_noteCreated() { toast.success(t("notes.toasts.created")) };
      }
    } catch (error) {
      toast.error(t("notes.toasts.failedCreate"));
      console.error("Create note error:", error);
    }
  };

  // Delete note
  const deleteNote = async (noteId) => {
    try {
      await dispatch(deleteNoteThunk(noteId)).unwrap();

      if (selectedNote?._id === noteId) {
        setSelectedNote(null);
      }

      // Refresh the notes list
      if (activeTab === 'studio') {
        await dispatch(getStudioNotesThunk());
      } else {
        await dispatch(getPersonalNotesThunk());
      }

      toast.success(t("notes.toasts.deleted"));
    } catch (error) {
      toast.error(t("notes.toasts.failedDelete"));
      console.error("Delete note error:", error);
    }
  };

  // Duplicate note
  const duplicateNote = async () => {
    if (!selectedNote) return;

    const duplicated = {
      title: `${selectedNote.title} (Copy)`,
      content: selectedNote.content,
      tags: selectedNote.tags || [],
      attachment: selectedNote.attachment || [],
      isPinned: false,
    };

    try {
      let result;
      if (activeTab === 'studio') {
        result = await dispatch(createStudioNotesThunk(duplicated)).unwrap();
        await dispatch(getStudioNotesThunk());
      } else {
        result = await dispatch(createPersonalNotesThunk(duplicated)).unwrap();
        await dispatch(getPersonalNotesThunk());
      }

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSelectedNote(null);
      } else {
        selectNote(result);
      }
      toast.success(t("notes.toasts.duplicated"));
    } catch (error) {
      toast.error(t("notes.toasts.failedDuplicate"));
      console.error("Duplicate note error:", error);
    }
  };

  // Toggle pin - FIXED
  const togglePin = async (noteId) => {
    // Get the note from current tab's notes
    const currentNotesList = activeTab === 'studio' ? studioNotes : personalNotes;
    const note = currentNotesList.find(n => n._id === noteId);

    if (!note) {
      console.error('Note not found:', noteId);
      return;
    }

    setPinningNoteId(noteId);

    try {
      // Optimistically update the selected note if it's the current one
      if (selectedNote?._id === noteId) {
        setSelectedNote(prev => ({ ...prev, isPinned: !prev.isPinned }));
      }

      await dispatch(updateNoteThunk({
        noteId,
        updateData: { isPinned: !note.isPinned }
      })).unwrap();

      // Refresh the notes list to ensure consistency
      if (activeTab === 'studio') {
        await dispatch(getStudioNotesThunk());
      } else {
        await dispatch(getPersonalNotesThunk());
      }

      toast.success(note.isPinned ? t("notes.toasts.unpinned") : t("notes.toasts.pinned"));
    } catch (error) {
      console.error("Toggle pin error:", error);

      // Revert the optimistic update on error
      if (selectedNote?._id === noteId) {
        setSelectedNote(prev => ({ ...prev, isPinned: note.isPinned }));
      }

      if (error.message === 'Request failed with status code 304') {
        toast.info(t("notes.toasts.upToDate"));
      } else {
        toast.error(t("notes.toasts.failedPin"));
      }
    } finally {
      setPinningNoteId(null);
    }
  };

  // Move note to other tab
  const moveNoteToOtherTab = async () => {
    if (!selectedNote) return;

    const targetTab = activeTab === 'personal' ? 'studio' : 'personal';

    try {
      await dispatch(deleteNoteThunk(selectedNote._id)).unwrap();

      const noteToMove = {
        title: selectedNote.title,
        content: selectedNote.content,
        tags: selectedNote.tags || [],
        attachment: selectedNote.attachment || [],
        isPinned: selectedNote.isPinned,
      };

      if (targetTab === 'studio') {
        await dispatch(createStudioNotesThunk(noteToMove)).unwrap();
        await dispatch(getStudioNotesThunk());
      } else {
        await dispatch(createPersonalNotesThunk(noteToMove)).unwrap();
        await dispatch(getPersonalNotesThunk());
      }

      await dispatch(getPersonalNotesThunk());
      await dispatch(getStudioNotesThunk());

      setActiveTab(targetTab);
      setSelectedNote(null);
      toast.success(t('notes.toasts.movedTo', { tab: targetTab === 'personal' ? t('notes.tabs.personal').split(' ')[0] : t('notes.tabs.studio').split(' ')[0] }));
    } catch (error) {
      toast.error(t("notes.toasts.failedMove"));
      console.error("Move note error:", error);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newAttachments = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
      isNew: true
    }));

    setEditedAttachments(prev => [...prev, ...newAttachments]);
    setHasUnsavedChanges(true);
  };

  // Handle media library selection
  const handleMediaLibrarySelect = (imageUrl) => {
    const filename = imageUrl.split('/').pop() || `media-${Date.now()}.jpg`;
    const newAttachment = {
      name: filename,
      url: imageUrl,
      file: null
    };
    setEditedAttachments(prev => [...prev, newAttachment]);
    setHasUnsavedChanges(true);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setEditedAttachments(prev => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  // Toggle tag
  const toggleTag = (tagId) => {
    setEditedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
    setHasUnsavedChanges(true);
  };

  // Handle drag end
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSortBy('custom');
    // Note: Order persistence would require backend support
  };

  // Get current notes (filtered, sorted)
  const getCurrentNotes = () => {
    let currentNotes = [];

    if (activeTab === "studio") {
      currentNotes = [...(Array.isArray(studioNotes) ? studioNotes : [])];
    } else {
      currentNotes = [...(Array.isArray(personalNotes) ? personalNotes : [])];
    }

    // Filter by search
    if (searchQuery && searchQuery.trim()) {
      currentNotes = currentNotes.filter(note => {
        if (!note) return false;
        const titleMatch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const contentMatch = stripHtmlTags(note.content || '').toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || contentMatch;
      });
    }

    // Sort
    currentNotes.sort((a, b) => {
      if (!a || !b) return 0;

      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      let comparison = 0;
      switch (sortBy) {
        case 'date':
          const aDate = new Date(a.updatedAt || a.createdAt);
          const bDate = new Date(b.updatedAt || b.createdAt);
          comparison = bDate - aDate;
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'custom':
          return 0;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? -comparison : comparison;
    });

    return currentNotes;
  };

  const currentNotes = getCurrentNotes();
  const noteIds = currentNotes.map(note => note?._id).filter(id => id);

  // Sort options
  const sortOptions = [
    { value: 'date', label: t('notes.sortOptions.date') },
    { value: 'title', label: t('notes.sortOptions.title') },
    { value: 'custom', label: t('notes.sortOptions.custom') },
  ];
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Date';

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-content-muted" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp size={14} className="text-content-primary" />
      : <ArrowDown size={14} className="text-content-primary" />;
  };

  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom');
      setShowSortDropdown(false);
    } else if (sortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        return;
      }

      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable === true ||
        target.closest?.('[contenteditable="true"]')
      ) {
        if (e.key === 'Escape') {
          target.blur?.();
        }
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Escape') {
        if (showImageSourceModal) setShowImageSourceModal(false);
        else if (showMediaLibraryModal) setShowMediaLibraryModal(false);
        else if (deleteConfirm) setDeleteConfirm(null);
        else if (showTagsModal) setShowTagsModal(false);
        else if (selectedNote) setSelectedNote(null);
        return;
      }

      const anyModalOpen = deleteConfirm || showTagsModal || showImageSourceModal || showMediaLibraryModal;
      if (anyModalOpen) return;

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCreateNote();
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setShowTagsModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [deleteConfirm, selectedNote, showTagsModal, showImageSourceModal, showMediaLibraryModal]);

  const handleDeleteTag = (tagId) => {
    // dispatch()
    // Implement tag deletion logic here
  };

  return (
    <>
      <div className="min-h-screen rounded-3xl bg-surface-base text-content-primary p-3 md:p-6 flex flex-col transition-all duration-500 ease-in-out flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-content-primary">{t("notes.title")}</h1>
            <div className="relative" ref={studioTooltipRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStudioTooltip(!showStudioTooltip);
                }}
                onMouseEnter={() => setShowStudioTooltip(true)}
                onMouseLeave={() => setShowStudioTooltip(false)}
                className="text-content-muted hover:text-content-secondary transition-colors p-1"
                aria-label={t("notes.title")}
              >
                <Info size={16} />
              </button>

              {showStudioTooltip && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-surface-button border border-border rounded-lg shadow-xl p-4 z-50">
                  <div className="text-sm space-y-3">
                    <div>
                      <p className="text-primary font-medium mb-1">{t("notes.tooltip.studioTitle")}</p>
                      <p className="text-content-secondary text-xs leading-relaxed">
                        {t("notes.tooltip.studioDesc")}
                      </p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-primary font-medium mb-1">{t("notes.tooltip.personalTitle")}</p>
                      <p className="text-content-secondary text-xs leading-relaxed">
                        {t("notes.tooltip.personalDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-surface-button border-l border-t border-border transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 overflow-hidden">
          {/* Left Sidebar - Notes List */}
          <div className="w-full md:w-[22rem] flex flex-col bg-surface-card rounded-xl border border-border h-[calc(100vh-140px)] md:max-h-[calc(100vh-200px)]">
            {/* Desktop: Buttons Row + Search Row */}
            <div className="hidden md:flex p-3 gap-2">
              <div className="relative group">
                <button
                  onClick={handleCreateNote}
                  className="bg-primary hover:bg-primary-hover text-sm text-white px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium whitespace-nowrap flex-shrink-0"
                >
                  <Plus size={16} />
                  <span className="hidden min-[400px]:inline">{t("notes.createNote")}</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">{t("notes.createNote")}</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    C
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                </div>
              </div>

              {/* Sort Dropdown - Desktop */}
              <div className="relative flex-1 max-w-[180px]" ref={desktopSortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className="w-full px-3 py-2.5 bg-surface-button text-content-secondary rounded-xl text-sm hover:bg-surface-button-hover transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getSortIcon()}
                    <span className="truncate text-xs sm:text-sm">{currentSortLabel}</span>
                  </div>
                </button>

                {showSortDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-full w-max">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSortOptionClick(option.value);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'
                            }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-content-muted ml-3">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Button - Desktop */}
              <div className="relative group">
                <button
                  onClick={() => setShowTagsModal(true)}
                  className="bg-surface-button hover:bg-surface-button-hover text-content-secondary text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium flex-shrink-0"
                >
                  <Tag size={16} />
                  <span className="hidden sm:inline">{t("notes.tags")}</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">{t("notes.manageTags")}</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    T
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                </div>
              </div>
            </div>

            {/* Search Bar + Icon Buttons */}
            <div className="p-2 md:px-3 md:py-3 border-b md:border-b-0 border-border flex gap-2">
              <div className="relative flex-1">
                <div className="bg-surface-dark rounded-xl px-3 py-2 min-h-[42px] flex items-center gap-1.5 border border-border focus-within:border-primary transition-colors cursor-text">
                  <Search className="text-content-muted flex-shrink-0" size={16} />
                  <input
                    type="text"
                    placeholder={t("notes.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm text-content-primary selection:bg-primary selection:text-white"
                  />
                </div>
              </div>

              {/* Mobile Only: Sort Icon Button */}
              <div className="md:hidden relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-surface-button text-content-secondary rounded-lg hover:bg-surface-button-hover transition-colors"
                  title="Sort"
                >
                  <ArrowUpDown size={14} />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSortOptionClick(option.value);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'
                            }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && option.value !== 'custom' && (
                            <span className="text-content-muted ml-3">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Only: Tags Icon Button */}
              <button
                onClick={() => setShowTagsModal(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-lg transition-colors"
                title="Manage Tags (T)"
              >
                <Tag size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mt-1">
              <button
                onClick={() => {
                  setActiveTab("studio");
                  setSelectedNote(null);
                }}
                className={`flex-1 px-4 py-4 text-base font-medium transition-colors ${activeTab === "studio"
                  ? "text-content-primary border-b-2 border-primary"
                  : "text-content-muted hover:text-content-primary"
                  }`}
              >
                {t("notes.tabs.studio")}
              </button>

              <button
                onClick={() => {
                  setActiveTab("personal");
                  setSelectedNote(null);
                }}
                className={`flex-1 px-4 py-4 text-base font-medium transition-colors ${activeTab === "personal"
                  ? "text-content-primary border-b-2 border-primary"
                  : "text-content-muted hover:text-content-primary"
                  }`}
              >
                {t("notes.tabs.personal")}
              </button>
            </div>

            {/* Notes List with DnD */}
            <div className="flex-1 overflow-y-auto">
              {loading && currentNotes.length === 0 ? (
                <div className="p-6 md:p-8 text-center text-content-faint">
                  <p className="text-sm">{t("notes.empty.loading")}</p>
                </div>
              ) : currentNotes.length === 0 ? (
                <div className="p-6 md:p-8 text-center text-content-faint">
                  <p className="text-sm">{t("notes.empty.noNotes")}</p>
                  <p className="text-xs mt-2">{t("notes.empty.createFirst")}</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={() => setActiveId(null)}
                >
                  <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
                    {currentNotes.map(note => (
                      <SortableNoteItem
                        key={note._id}
                        note={note}
                        isSelected={selectedNote?._id === note._id}
                        onClick={() => selectNote(note)}
                        availableTags={tags}
                        onPin={togglePin}
                        isPinning={pinningNoteId === note._id}
                        t={t}
                      />
                    ))}
                  </SortableContext>
                  <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
                    {activeId ? (
                      <NoteOverlayItem
                        note={currentNotes.find(n => n._id === activeId)}
                        availableTags={tags}
                        t={t}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </div>

          {/* Right Content Area - Note Editor (Desktop only) */}
          <div className="hidden md:flex flex-1 flex-col bg-surface-card rounded-xl border border-border overflow-hidden min-w-0 max-h-[calc(100vh-200px)]">
            {selectedNote ? (
              <>
                {/* Note Header */}
                <div className="p-4 md:p-6 border-b border-border flex-shrink-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        data-title-input
                        value={editedTitle}
                        onChange={(e) => {
                          setEditedTitle(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        placeholder={t("notes.untitled")}
                        className="w-full bg-transparent text-xl md:text-2xl font-bold text-content-primary outline-none border-b-2 border-transparent hover:border-border-subtle focus:border-primary transition-all pb-1 truncate"
                      />
                      <div className="flex flex-wrap gap-3 mt-2 text-[10px] md:text-xs text-content-faint">
                        <span>{t("common.created")}: {formatDateTime(selectedNote.createdAt)}</span>
                        {selectedNote.updatedAt !== selectedNote.createdAt && (
                          <span>{t("common.updated")}: {formatDateTime(selectedNote.updatedAt)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePin(selectedNote._id)}
                        disabled={pinningNoteId === selectedNote._id}
                        className={`p-2 rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50 ${selectedNote.isPinned ? 'text-primary' : 'text-content-muted hover:text-content-primary'
                          }`}
                        title={selectedNote.isPinned ? t('common.unpin') : t('common.pin')}
                      >
                        {pinningNoteId === selectedNote._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        ) : selectedNote.isPinned ? (
                          <Pin size={18} className="fill-current" />
                        ) : (
                          <PinOff size={18} />
                        )}
                      </button>
                      <button
                        onClick={duplicateNote}
                        className="text-content-muted hover:text-content-primary p-2 rounded-lg hover:bg-surface-hover transition-colors hidden md:block"
                        title={t("common.duplicate")}
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={moveNoteToOtherTab}
                        className="text-content-muted hover:text-content-primary p-2 rounded-lg hover:bg-surface-hover transition-colors hidden md:block"
                        title={activeTab === 'personal' ? t("notes.actions.moveToStudio") : t("notes.actions.moveToPersonal")}
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(selectedNote)}
                        className="text-content-muted hover:text-red-500 p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        title={t("common.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {(showAllTags ? tags : tags.slice(0, 6)).map(tag => (
                        <button
                          key={tag._id}
                          onClick={() => toggleTag(tag._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${editedTags.includes(tag._id) ? "text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                            }`}
                          style={{ backgroundColor: editedTags.includes(tag._id) ? tag.color : undefined }}
                        >
                          <Tag size={10} />
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    {tags.length > 6 && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="mt-2 text-sm text-primary hover:text-primary-hover transition-colors"
                      >
                        {showAllTags
                          ? t('notes.showLess')
                          : t('notes.showMore', { count: tags.length - 6 })}
                      </button>
                    )}
                  </div>
                </div>

                {/* Note Content */}
                <div className="flex-1 min-h-0 overflow-hidden p-6 flex flex-col">
                  <WysiwygEditor
                    key={`editor-${selectedNote._id}`}
                    value={editedContent}
                    onChange={(value) => {
                      setEditedContent(value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder={t("notes.editorPlaceholder")}
                    minHeight={350}
                    maxHeight={9999}
                    className="flex-1"
                  />
                </div>

                {/* Attachments Section */}
                <div className="flex-shrink-0 border-t border-border p-4 md:p-6 bg-surface-card">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                      <Paperclip size={14} />
                      {t("notes.attachments")}
                    </label>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => setShowImageSourceModal(true)}
                        className="text-sm bg-surface-button hover:bg-surface-button-hover text-content-secondary px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        {t("notes.addImages")}
                      </button>
                    </div>
                  </div>

                  {editedAttachments.length > 0 && (
                    <div>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {(showAllAttachments ? editedAttachments : editedAttachments.slice(0, 5)).map((attachment, index) => (
                          <div key={index} className="relative group">
                            <div
                              className="cursor-pointer"
                              onClick={() => setViewingImage({ image: attachment, images: editedAttachments, index })}
                            >
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-full h-14 md:h-16 object-cover rounded-lg border border-border"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <span className="text-content-primary text-xs font-medium bg-surface-hover px-3 py-1 rounded">{t("notes.view")}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {editedAttachments.length > 5 && (
                        <button
                          onClick={() => setShowAllAttachments(!showAllAttachments)}
                          className="mt-2 text-sm text-primary hover:text-primary-hover transition-colors"
                        >
                          {showAllAttachments
                            ? t('notes.showLess')
                            : t('notes.showMore', { count: editedAttachments.length - 5 })}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-4 md:p-8 text-center">
                <div>
                  <div className="text-content-faint mb-4">
                    <Edit size={40} className="mx-auto md:w-12 md:h-12" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-content-muted mb-2">{t("notes.empty.noSelected")}</h3>
                  <p className="text-xs md:text-sm text-content-faint mb-6">
                    {t("notes.empty.selectOrCreate")}
                  </p>
                  <button
                    onClick={handleCreateNote}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    {t("notes.createNote")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          deleteNote(deleteConfirm._id);
          setDeleteConfirm(null);
        }}
        noteTitle={deleteConfirm?.title || ''}
      />

      {/* Image Lightbox */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 text-white hover:text-content-secondary p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={32} />
          </button>

          {viewingImage.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = viewingImage.index > 0 ? viewingImage.index - 1 : viewingImage.images.length - 1;
                  setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex });
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-lg hover:bg-white/10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = viewingImage.index < viewingImage.images.length - 1 ? viewingImage.index + 1 : 0;
                  setViewingImage({ ...viewingImage, image: viewingImage.images[newIndex], index: newIndex });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-lg hover:bg-white/10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="max-w-[90vw] max-h-[90vh] flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-black/60 rounded-lg px-4 py-3 backdrop-blur-sm">
              <p className="text-content-primary text-sm font-medium text-center">
                {viewingImage.image.name}
                {viewingImage.images.length > 1 && (
                  <span className="text-content-muted ml-2">
                    ({viewingImage.index + 1}/{viewingImage.images.length})
                  </span>
                )}
              </p>
            </div>
            <img
              src={viewingImage.image.url}
              alt={viewingImage.image.name}
              className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Note Editor Overlay */}
      {selectedNote && (
        <div className="md:hidden fixed inset-0 bg-surface-base z-[60] flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <button
              onClick={() => setSelectedNote(null)}
              className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg transition-colors"
              aria-label={t("common.back")}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              {selectedNote.isPinned && (
                <button
                  onClick={() => togglePin(selectedNote._id)}
                  disabled={pinningNoteId === selectedNote._id}
                  className="text-primary p-1 hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-50"
                  aria-label={t("notes.actions.unpinNote")}
                >
                  {pinningNoteId === selectedNote._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  ) : (
                    <Pin size={20} className="fill-primary" />
                  )}
                </button>
              )}

              <div className="relative" ref={mobileActionsMenuRef}>
                <button
                  onClick={() => setShowMobileActionsMenu(!showMobileActionsMenu)}
                  className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-hover rounded-lg transition-colors"
                  aria-label={t("common.actions")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>

                {showMobileActionsMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-surface-hover border border-border rounded-lg shadow-lg min-w-[180px] z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          togglePin(selectedNote._id);
                          setShowMobileActionsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                      >
                        {selectedNote.isPinned ? (
                          <>
                            <PinOff size={16} />
                            <span>{t('notes.actions.unpinNote')}</span>
                          </>
                        ) : (
                          <>
                            <Pin size={16} />
                            <span>{t('notes.actions.pinNote')}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          duplicateNote();
                          setShowMobileActionsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                      >
                        <Copy size={16} />
                        <span>{t("common.duplicate")}</span>
                      </button>

                      <button
                        onClick={() => {
                          moveNoteToOtherTab();
                          setShowMobileActionsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-content-secondary"
                      >
                        <ArrowRightLeft size={16} />
                        <span>{activeTab === 'personal' ? t('notes.actions.moveToStudio') : t('notes.actions.moveToPersonal')}</span>
                      </button>

                      <div className="border-t border-border my-1"></div>

                      <button
                        onClick={() => {
                          setDeleteConfirm(selectedNote);
                          setShowMobileActionsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center gap-3 text-red-500"
                      >
                        <Trash2 size={16} />
                        <span>{t("common.delete")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note Content - Scrollable */}
          <div className="flex-1 overflow-y-auto mobile-note-scroll">
            {/* Title Input */}
            <div className="p-4 border-b border-border">
              <input
                type="text"
                data-title-input
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder={t("notes.untitled")}
                className="w-full bg-transparent text-xl font-bold text-content-primary outline-none border-b-2 border-transparent hover:border-border-subtle focus:border-primary transition-all pb-1"
              />
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-content-faint">
                <span>{t("common.created")}: {formatDateTime(selectedNote.createdAt)}</span>
                {selectedNote.updatedAt !== selectedNote.createdAt && (
                  <span>{t("common.updated")}: {formatDateTime(selectedNote.updatedAt)}</span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-content-secondary">{t("notes.tags")}</label>
                <button
                  onClick={() => setShowTagsModal(true)}
                  className="text-xs text-primary hover:text-primary-hover transition-colors"
                >
                  {t("notes.manageTags")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllTags ? tags : tags.slice(0, 4)).map(tag => (
                  <button
                    key={tag._id}
                    onClick={() => toggleTag(tag._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${editedTags.includes(tag._id) ? "text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                      }`}
                    style={{ backgroundColor: editedTags.includes(tag._id) ? tag.color : undefined }}
                  >
                    <Tag size={10} />
                    {tag.name}
                  </button>
                ))}
              </div>
              {tags.length > 4 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="mt-2 text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  {showAllTags
                    ? t('notes.showLess')
                    : t('notes.showMore', { count: tags.length - 4 })}
                </button>
              )}
            </div>

            {/* Editor */}
            <div className="mobile-editor-container">
              <WysiwygEditor
                key={`editor-mobile-${selectedNote._id}`}
                value={editedContent}
                onChange={(value) => {
                  setEditedContent(value);
                  setHasUnsavedChanges(true);
                }}
                placeholder={t("notes.editorPlaceholder")}
                minHeight={300}
                maxHeight={9999}
              />
            </div>

            {/* Attachments */}
            {editedAttachments.length > 0 && (
              <div className="p-4 border-t border-border">
                <h4 className="text-sm font-medium text-content-secondary mb-3 flex items-center gap-2">
                  <Paperclip size={14} />
                  {t("notes.attachmentsCount", { count: editedAttachments.length })}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(showAllAttachments ? editedAttachments : editedAttachments.slice(0, 3)).map((attachment, index) => (
                    <div key={index} className="relative group">
                      <div
                        className="cursor-pointer"
                        onClick={() => setViewingImage({ image: attachment, images: editedAttachments, index })}
                      >
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-full h-20 object-cover rounded-lg border border-border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-content-primary text-xs font-medium">{t("notes.view")}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(index);
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                {editedAttachments.length > 3 && (
                  <button
                    onClick={() => setShowAllAttachments(!showAllAttachments)}
                    className="mt-2 text-sm text-primary hover:text-primary-hover transition-colors"
                  >
                    {showAllAttachments
                      ? t('notes.showLess')
                      : t('notes.showMore', { count: editedAttachments.length - 3 })}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Action Bar */}
          <div className="border-t border-border p-4 flex gap-2 flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => setShowImageSourceModal(true)}
              className="w-full bg-surface-button hover:bg-surface-button-hover text-content-secondary px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Paperclip size={16} />
              {t("notes.addImages")}
            </button>
          </div>
        </div>
      )}

      {/* Tags Management Modal */}
      <TagManagerModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={tags}
        onDeleteTag={handleDeleteTag}
      />

      {/* Image Source Modal */}
      <ImageSourceModal
        isOpen={showImageSourceModal}
        onClose={() => setShowImageSourceModal(false)}
        onSelectFile={() => fileInputRef.current?.click()}
        onSelectMediaLibrary={() => setShowMediaLibraryModal(true)}
      />

      {/* Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={showMediaLibraryModal}
        onClose={() => setShowMediaLibraryModal(false)}
        onSelectImage={handleMediaLibrarySelect}
      />

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={handleCreateNote}
        className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
        aria-label={t("notes.createNote")}
      >
        <Plus size={22} />
      </button>
    </>
  );
}