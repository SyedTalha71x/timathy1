import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  DndContext, 
  PointerSensor, 
  TouchSensor,
  useSensor, 
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { 
  Plus, 
  Search, 
  Folder as FolderIcon, 
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  Palette,
  X,
  Trash2,
  Edit2,
  GripVertical,
  Layers,
  Eye,
  AlertTriangle,
  FolderInput,
  Info,
  MoreHorizontal
} from 'lucide-react';

// Components
import TemplateGallery from '../../components/user-panel-components/media-library-components/Templates/TemplateGallery';
import CreateDesignModal from '../../components/user-panel-components/media-library-components/Modals/CreateDesignModal';
import Modal from '../../components/user-panel-components/media-library-components/Modals/Modal';
import DesignCard from '../../components/user-panel-components/media-library-components/Designs/DesignCard';
import EditorModal from '../../components/user-panel-components/media-library-components/Editor/EditorModal';
import SharedFolderModal from '../../components/shared/SharedFolderModal';

// Hooks & Utils
import useFolders from '../../components/user-panel-components/media-library-components/hooks/useFolders';
import { generateThumbnail, generateId, deepClone, applyPersonalization } from '../../components/user-panel-components/media-library-components/utils/canvasUtils';
import { templates } from '../../components/user-panel-components/media-library-components/constants/templates';

// Custom FolderCard with 3-dot menu always visible
const FolderCardWithMenu = ({ folder, isSelected, designCount, onSelect, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div
      className={`relative group bg-[#1C1C1C] rounded-xl p-4 border transition-all cursor-pointer ${
        isSelected 
          ? 'border-orange-500 ring-2 ring-orange-500/20' 
          : 'border-[#333333] hover:border-orange-500/50'
      }`}
      onClick={() => onSelect(folder.id === onSelect ? null : folder.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${folder.color || '#FF843E'}20` }}
          >
            <FolderIcon 
              size={20} 
              style={{ color: folder.color || '#FF843E' }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-white truncate">{folder.name}</h4>
            <p className="text-xs text-gray-500">
              {designCount} design{designCount !== 1 ? 's' : ''}
              {folder.isDefault && <span className="ml-1.5 text-orange-400">• Default</span>}
            </p>
          </div>
        </div>
        
        {/* 3-dot menu - always visible */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 w-32 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-xl py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(folder);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800 text-gray-300 flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                {!folder.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(folder);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800 text-red-400 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MediaLibrary = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [showMoveDesignsModal, setShowMoveDesignsModal] = useState(false);
  const [designsToMove, setDesignsToMove] = useState([]);
  
  // Design states
  const [myCreations, setMyCreations] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [designToDelete, setDesignToDelete] = useState(null);
  const [pendingDesignName, setPendingDesignName] = useState('');
  const [pendingFolderId, setPendingFolderId] = useState(null);
  const [pendingPersonalization, setPendingPersonalization] = useState(null);
  const [editorKey, setEditorKey] = useState(0);
  
  // Section visibility
  const [showFoldersSection, setShowFoldersSection] = useState(true);
  const [showDesignsSection, setShowDesignsSection] = useState(true);
  const [showDraftsSection, setShowDraftsSection] = useState(true);
  
  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDesign, setPreviewDesign] = useState(null);
  
  // Mobile info tooltip state
  const [showMobileInfoTooltip, setShowMobileInfoTooltip] = useState(false);

  // Folder management
  const {
    folders,
    selectedFolderId,
    setSelectedFolderId,
    selectedFolder,
    defaultFolder,
    createFolder,
    updateFolder,
    deleteFolder
  } = useFolders();

  // Folder modal state
  const [editingFolder, setEditingFolder] = useState(null);

  // Keyboard shortcut for 'C' to create design (but NOT Ctrl+C)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Don't trigger if any modal is open
      if (showCreateModal || showTemplateGallery || showEditor || showDeleteConfirm || showFolderModal) return;
      
      // Don't trigger if Ctrl, Meta, or Alt is pressed (e.g., Ctrl+C for copy)
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowCreateModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal, showTemplateGallery, showEditor, showDeleteConfirm, showFolderModal]);

  // Get designs for selected folder
  const getDesignsForFolder = (folderId) => {
    return myCreations.filter(design => design.folderId === folderId);
  };

  // Filter designs by search
  const filteredDesigns = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return myCreations.filter(design => 
        design.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return myCreations.filter(design => design.folderId === selectedFolderId);
  }, [myCreations, searchQuery, selectedFolderId]);

  // Filter drafts by search
  const filteredDrafts = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return drafts.filter(draft => 
        draft.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return drafts;
  }, [drafts, searchQuery]);

  // Check if we're in search mode
  const isSearching = searchQuery.trim() !== '';

  // Handle create new design
  const handleCreateDesign = (name, folderId, personalization) => {
    setPendingDesignName(name || 'Untitled Design');
    setPendingFolderId(folderId || defaultFolder?.id);
    setPendingPersonalization(personalization || null);
    setShowCreateModal(false);
    setShowTemplateGallery(true);
  };

  // Helper function to constrain elements within canvas bounds
  const constrainElementToBounds = (element, canvasWidth, canvasHeight) => {
    let { x, y, width, height } = element;
    
    // Check if this is a background element (covers full canvas or starts at origin with large size)
    const isBackgroundElement = (
      (x === 0 && y === 0 && width >= canvasWidth * 0.9 && height >= canvasHeight * 0.9) ||
      (x <= 0 && y <= 0 && x + width >= canvasWidth && y + height >= canvasHeight)
    );
    
    // Allow background elements to fill the entire canvas
    if (isBackgroundElement) {
      // Just ensure it covers the full canvas
      return { 
        ...element, 
        x: 0, 
        y: 0, 
        width: Math.max(width, canvasWidth), 
        height: Math.max(height, canvasHeight) 
      };
    }
    
    // For non-background elements, constrain to canvas bounds
    
    // Step 1: Ensure element dimensions don't exceed canvas
    if (width > canvasWidth) {
      const scale = canvasWidth / width;
      width = canvasWidth * 0.9;
      height = height * scale;
    }
    if (height > canvasHeight) {
      const scale = canvasHeight / height;
      height = canvasHeight * 0.9;
      width = width * scale;
    }
    
    // Ensure minimum dimensions
    width = Math.max(20, width);
    height = Math.max(20, height);
    
    // Step 2: Position element within bounds
    // If x is negative, move it inside
    if (x < 0) {
      x = 10;
    } else if (x + width > canvasWidth) {
      x = canvasWidth - width - 10;
    }
    
    // If y is negative, move it inside
    if (y < 0) {
      y = 10;
    } else if (y + height > canvasHeight) {
      y = canvasHeight - height - 10;
    }
    
    // Step 3: Final safety clamp
    x = Math.max(0, Math.min(x, canvasWidth - width));
    y = Math.max(0, Math.min(y, canvasHeight - height));
    
    return { ...element, x, y, width, height };
  };

  // Handle select template
  const handleSelectTemplate = (template, selectedSize) => {
    const targetSize = selectedSize || template.size;
    let elements = deepClone(template.elements);
    
    const [targetWidth, targetHeight] = targetSize.split('x').map(Number);
    
    // If using a different size than the template's native size, scale elements
    if (template.size !== targetSize) {
      const [templateWidth, templateHeight] = template.size.split('x').map(Number);
      
      const scaleX = targetWidth / templateWidth;
      const scaleY = targetHeight / templateHeight;
      
      elements = elements.map(el => {
        let scaledX = el.x * scaleX;
        let scaledY = el.y * scaleY;
        let scaledWidth = el.width * scaleX;
        let scaledHeight = el.height * scaleY;
        
        return {
          ...el,
          x: scaledX,
          y: scaledY,
          width: scaledWidth,
          height: scaledHeight,
          size: el.size ? Math.round(el.size * Math.min(scaleX, scaleY)) : el.size
        };
      });
    }
    
    // Apply personalization if provided
    if (pendingPersonalization) {
      elements = applyPersonalization(elements, pendingPersonalization);
    }
    
    // Constrain all elements to stay within canvas bounds
    elements = elements.map(el => constrainElementToBounds(el, targetWidth, targetHeight));
    
    // Determine design name - use custom title if provided, otherwise template name
    const designName = (pendingPersonalization?.titleText?.trim()) || pendingDesignName || template.name;
    
    setCurrentDesign({
      name: designName,
      size: targetSize,
      elements: elements,
      folderId: pendingFolderId || selectedFolderId || defaultFolder?.id
    });
    setEditorKey(prev => prev + 1);
    setShowTemplateGallery(false);
    setShowEditor(true);
    
    // Clear pending personalization after use
    setPendingPersonalization(null);
  };

  // Handle select blank
  const handleSelectBlank = (size) => {
    setCurrentDesign({
      name: pendingDesignName || 'Untitled Design',
      size,
      elements: [],
      folderId: pendingFolderId || selectedFolderId || defaultFolder?.id
    });
    setEditorKey(prev => prev + 1);
    setShowTemplateGallery(false);
    setShowEditor(true);
    
    // Clear pending personalization
    setPendingPersonalization(null);
  };

  // Handle save design
  const handleSaveDesign = (design) => {
    const newDesign = {
      ...design,
      folderId: currentDesign?.folderId || selectedFolderId || defaultFolder?.id,
      isDraft: false
    };

    const existingIndex = myCreations.findIndex(d => d.id === currentDesign?.id);
    
    if (existingIndex >= 0) {
      setMyCreations(prev => {
        const updated = [...prev];
        updated[existingIndex] = newDesign;
        return updated;
      });
    } else {
      setMyCreations(prev => [...prev, newDesign]);
    }

    // Remove from drafts if it was a draft
    if (currentDesign?.isDraft) {
      setDrafts(prev => prev.filter(d => d.id !== currentDesign.id));
    }

    setShowEditor(false);
    setCurrentDesign(null);
  };

  // Handle save as draft
  const handleSaveDraft = (draft) => {
    setDrafts(prev => [...prev, draft]);
  };

  // Handle edit design
  const handleEditDesign = (design) => {
    setCurrentDesign(design);
    setEditorKey(prev => prev + 1);
    setShowEditor(true);
  };

  // Handle edit draft
  const handleEditDraft = (draft) => {
    setCurrentDesign({ ...draft, isDraft: true });
    setEditorKey(prev => prev + 1);
    setShowEditor(true);
  };

  // Handle download design
  const handleDownloadDesign = async (design) => {
    try {
      let thumbnail = design.thumbnail;
      if (!thumbnail || thumbnail === 'data:,') {
        thumbnail = await generateThumbnail(design.elements, design.size);
      }
      
      const link = document.createElement('a');
      link.href = thumbnail;
      link.download = `${design.name}_${design.size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Failed to download. Please try again.');
    }
  };

  // Handle delete design
  const handleDeleteDesign = (design) => {
    setDesignToDelete(design);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDesign = () => {
    if (designToDelete) {
      if (designToDelete.isDraft) {
        setDrafts(prev => prev.filter(d => d.id !== designToDelete.id));
      } else {
        setMyCreations(prev => prev.filter(d => d.id !== designToDelete.id));
      }
      setDesignToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // Handle duplicate design
  const handleDuplicateDesign = (design) => {
    const duplicated = {
      ...deepClone(design),
      id: generateId(),
      name: `${design.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setMyCreations(prev => [...prev, duplicated]);
  };

  // Handle preview design
  const handlePreviewDesign = (design) => {
    setPreviewDesign(design);
    setShowPreviewModal(true);
  };

  // Handle delete draft
  const handleDeleteDraft = (draft) => {
    setDesignToDelete({ ...draft, isDraft: true });
    setShowDeleteConfirm(true);
  };

  // Folder management
  const handleOpenFolderModal = (folder = null) => {
    setEditingFolder(folder);
    setShowFolderModal(true);
  };

  const handleSaveFolder = (folderData) => {
    if (editingFolder) {
      updateFolder(editingFolder.id, {
        name: folderData.name,
        color: folderData.color,
        isDefault: folderData.isDefault
      });
    } else {
      createFolder(folderData.name, folderData.color);
    }
    setShowFolderModal(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folder) => {
    if (folder.isDefault) {
      alert('Cannot delete the default folder');
      return;
    }
    
    // Get designs in this folder
    const designsInFolder = myCreations.filter(d => d.folderId === folder.id);
    
    setFolderToDelete(folder);
    setDesignsToMove(designsInFolder);
    setShowFolderDeleteModal(true);
  };

  // Handle folder deletion - only folder (move designs)
  const handleDeleteFolderOnly = () => {
    setShowFolderDeleteModal(false);
    setShowMoveDesignsModal(true);
  };

  // Handle folder deletion - with all contents
  const handleDeleteFolderWithContents = () => {
    if (folderToDelete) {
      // Delete all designs in this folder
      setMyCreations(prev => prev.filter(d => d.folderId !== folderToDelete.id));
      // Delete the folder
      deleteFolder(folderToDelete.id);
      setFolderToDelete(null);
      setDesignsToMove([]);
      setShowFolderDeleteModal(false);
    }
  };

  // Handle moving designs to another folder
  const handleMoveDesignsToFolder = (targetFolderId) => {
    if (folderToDelete && designsToMove.length > 0) {
      setMyCreations(prev => 
        prev.map(design => 
          design.folderId === folderToDelete.id 
            ? { ...design, folderId: targetFolderId }
            : design
        )
      );
    }
    // Delete the folder
    if (folderToDelete) {
      deleteFolder(folderToDelete.id);
    }
    setFolderToDelete(null);
    setDesignsToMove([]);
    setShowMoveDesignsModal(false);
  };

  // Design drag handling with @dnd-kit
  const [draggingDesign, setDraggingDesign] = useState(null);

  // @dnd-kit sensors - works in Edge, Firefox, Chrome
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    })
  );

  // @dnd-kit drag handlers
  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.type === 'design') {
      setDraggingDesign(active.data.current.design);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setDraggingDesign(null);
    
    if (!over) return;
    
    // Check if dropped on a folder
    if (over.data.current?.type === 'folder') {
      const targetFolderId = over.data.current.folderId;
      const design = active.data.current?.design;
      
      if (design && design.folderId !== targetFolderId) {
        setMyCreations(prev =>
          prev.map(d => d.id === design.id ? { ...d, folderId: targetFolderId } : d)
        );
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
    <div className="min-h-screen rounded-3xl p-4 md:p-6 bg-[#1C1C1C] transition-all duration-300 ease-in-out flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl text-white oxanium_font">Media Library</h1>
          
          {/* Mobile Info Tooltip - only visible on mobile */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setShowMobileInfoTooltip(!showMobileInfoTooltip)}
              onMouseEnter={() => setShowMobileInfoTooltip(true)}
              onMouseLeave={() => setShowMobileInfoTooltip(false)}
              className="text-gray-400 hover:text-gray-300 transition-colors p-1"
              aria-label="Design Information"
            >
              <Info size={16} />
            </button>
            
            {showMobileInfoTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl p-4 z-50">
                <div className="text-sm space-y-2">
                  <p className="text-orange-400 font-medium">Desktop Only</p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Creating and editing designs is only available on desktop devices for the best experience.
                  </p>
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2a2a2a] border-l border-t border-gray-700 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Create Design Button with Tooltip */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block relative group">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create Design</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
              <span className="font-medium">Create Design</span>
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                C
              </span>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search all designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
          {/* Folders Section */}
          {!isSearching && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowFoldersSection(!showFoldersSection)}
                  className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
                >
                  {showFoldersSection ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <FolderIcon size={18} />
                  <span className="font-medium text-sm">Folders</span>
                  <span className="text-gray-500 text-xs ml-1">({folders.length})</span>
                </button>
                
                <button
                  onClick={() => handleOpenFolderModal()}
                  className="flex items-center gap-1.5 text-orange-500 hover:text-orange-400 text-xs transition-colors"
                >
                  <FolderPlus size={14} />
                  New Folder
                </button>
              </div>

              {showFoldersSection && (
                <>
                  {/* Drag hint when dragging a design */}
                  {draggingDesign && (
                    <div className="mb-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-2 text-orange-400 text-sm">
                      <GripVertical size={16} />
                      <span>Drop "<strong>{draggingDesign.name}</strong>" on a folder to move it</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {folders.map((folder) => (
                    <FolderCardWithMenu
                      key={folder.id}
                      folder={folder}
                      isSelected={selectedFolderId === folder.id}
                      designCount={getDesignsForFolder(folder.id).length}
                      onSelect={setSelectedFolderId}
                      onEdit={(f) => handleOpenFolderModal(f)}
                      onDelete={handleDeleteFolder}
                    />
                  ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* Designs Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowDesignsSection(!showDesignsSection)}
                className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
              >
                {showDesignsSection ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <Palette size={18} />
                <span className="font-medium text-sm">
                  {isSearching 
                    ? `Search Results for "${searchQuery}"` 
                    : (selectedFolder?.name || 'All Designs')
                  }
                </span>
                <span className="text-gray-500 text-xs ml-1">
                  ({filteredDesigns.length})
                </span>
              </button>
              {isSearching && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <X size={12} />
                  Clear search
                </button>
              )}
            </div>

            {showDesignsSection && (
              filteredDesigns.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredDesigns.map((design) => (
                    <DesignCard
                      key={design.id}
                      design={design}
                      onEdit={() => handleEditDesign(design)}
                      onDownload={() => handleDownloadDesign(design)}
                      onDelete={() => handleDeleteDesign(design)}
                      onDuplicate={() => handleDuplicateDesign(design)}
                      onPreview={() => handlePreviewDesign(design)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#141414] rounded-xl border border-[#333333]">
                  <div className="w-16 h-16 bg-[#141414] rounded-xl flex items-center justify-center mx-auto mb-3">
                    {isSearching ? <Search size={28} className="text-gray-600" /> : <Sparkles size={28} className="text-gray-600" />}
                  </div>
                  <h3 className="text-white font-medium mb-1">
                    {isSearching ? 'No designs found' : 'No designs yet'}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {isSearching 
                      ? `No designs matching "${searchQuery}"` 
                      : 'Create your first design to get started'
                    }
                  </p>
                  {isSearching ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      <X size={16} />
                      Clear Search
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        <Plus size={16} />
                        Create Design
                      </button>
                      <p className="sm:hidden text-gray-500 text-xs mt-2">
                        Design creation is only available on desktop
                      </p>
                    </>
                  )}
                </div>
              )
            )}
          </section>

          {/* Drafts Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowDraftsSection(!showDraftsSection)}
                className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
              >
                {showDraftsSection ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <FileText size={18} />
                <span className="font-medium text-sm">Drafts</span>
                <span className="text-gray-500 text-xs ml-1">({filteredDrafts.length})</span>
              </button>
            </div>

            {showDraftsSection && (
              filteredDrafts.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredDrafts.map((draft) => {
                    const formatDate = (dateString) => {
                      const date = new Date(dateString);
                      const now = new Date();
                      const diffTime = Math.abs(now - date);
                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                      
                      if (diffDays === 0) return 'Today';
                      if (diffDays === 1) return 'Yesterday';
                      if (diffDays < 7) return `${diffDays} days ago`;
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    };

                    return (
                      <div
                        key={draft.id}
                        className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-dashed border-[#444444] hover:border-orange-500/50 transition-all"
                      >
                        {/* Fixed-size Preview Container - same height as DesignCard */}
                        <div className="relative w-full h-[180px] bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                          {draft.thumbnail && draft.thumbnail !== 'data:,' ? (
                            <img 
                              src={draft.thumbnail}
                              alt={draft.name}
                              className="max-w-full max-h-full object-contain"
                              draggable={false}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <FileText size={32} className="mb-2 opacity-50" />
                              <span className="text-xs">Draft</span>
                            </div>
                          )}

                          {/* Draft badge */}
                          <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500/80 text-white text-[10px] font-medium rounded-lg">
                            DRAFT
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditDraft(draft)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
                            >
                              <Edit2 size={14} />
                              Continue
                            </button>
                            <button
                              onClick={() => handleDeleteDraft(draft)}
                              className="p-2 bg-white/10 hover:bg-red-500/50 backdrop-blur-sm text-white rounded-lg transition-all hover:scale-105"
                              title="Delete Draft"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Info - consistent with DesignCard */}
                        <div className="p-3 bg-[#1a1a1a]">
                          <h4 className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
                            {draft.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-gray-500 text-xs">{formatDate(draft.createdAt)}</span>
                            <span className="text-gray-500 text-xs">{draft.size}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                            <Layers size={10} />
                            <span>{draft.elements?.length || 0} layers</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-[#141414] rounded-xl border border-[#333333]">
                  <FileText size={28} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-500 text-sm">No drafts saved</p>
                </div>
              )
            )}
          </section>
        </div>

      {/* Modals */}
      <CreateDesignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateDesign={handleCreateDesign}
        folders={folders}
        defaultFolderId={defaultFolder?.id}
      />

      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleSelectTemplate}
        onSelectBlank={handleSelectBlank}
        personalization={pendingPersonalization}
      />

      {showEditor && currentDesign && (
        <EditorModal
          key={`editor-${editorKey}`}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setCurrentDesign(null);
          }}
          onSave={handleSaveDesign}
          onSaveDraft={handleSaveDraft}
          initialElements={currentDesign.elements}
          initialName={currentDesign.name}
          initialSize={currentDesign.size}
          designId={currentDesign.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDesignToDelete(null);
        }}
        title={designToDelete?.isDraft ? "Delete Draft" : "Delete Design"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Are you sure you want to delete "{designToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDesignToDelete(null);
              }}
              className="flex-1 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteDesign}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Folder Modal - Using SharedFolderModal */}
      <SharedFolderModal
        isOpen={showFolderModal}
        onClose={() => {
          setShowFolderModal(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
        onSave={handleSaveFolder}
        showColorPicker={true}
        showDefaultCheckbox={true}
        defaultColor="#FF843E"
      />

      {/* Folder Delete Confirmation Modal */}
      <Modal
        isOpen={showFolderDeleteModal}
        onClose={() => {
          setShowFolderDeleteModal(false);
          setFolderToDelete(null);
          setDesignsToMove([]);
        }}
        title={`Delete "${folderToDelete?.name || 'Folder'}"`}
        subtitle={designsToMove.length > 0 
          ? `This folder contains ${designsToMove.length} design${designsToMove.length !== 1 ? 's' : ''}`
          : 'This folder is empty'
        }
        size="sm"
      >
        <div className="space-y-4">
          {/* Options - only show "delete folder only" if folder has designs */}
          {designsToMove.length > 0 ? (
            <div className="space-y-2">
              <button
                onClick={handleDeleteFolderOnly}
                className="w-full flex items-center gap-3 p-3 bg-[#0a0a0a] hover:bg-[#2F2F2F] text-white rounded-xl transition-colors text-left"
              >
                <FolderInput size={18} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium">Delete folder only</p>
                  <p className="text-gray-500 text-xs">Move designs to another folder</p>
                </div>
              </button>
              
              <button
                onClick={handleDeleteFolderWithContents}
                className="w-full flex items-center gap-3 p-3 bg-[#0a0a0a] hover:bg-red-500/10 text-white hover:text-red-400 rounded-xl transition-colors text-left border border-transparent hover:border-red-500/30"
              >
                <Trash2 size={18} className="text-red-400" />
                <div>
                  <p className="text-sm font-medium">Delete folder and designs</p>
                  <p className="text-gray-500 text-xs">Permanently delete {designsToMove.length} design{designsToMove.length !== 1 ? 's' : ''}</p>
                </div>
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Are you sure you want to delete this empty folder?
            </p>
          )}
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setShowFolderDeleteModal(false);
                setFolderToDelete(null);
                setDesignsToMove([]);
              }}
              className="flex-1 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            {designsToMove.length === 0 && (
              <button
                onClick={handleDeleteFolderWithContents}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Move Designs to Folder Modal */}
      <Modal
        isOpen={showMoveDesignsModal}
        onClose={() => {
          setShowMoveDesignsModal(false);
          setFolderToDelete(null);
          setDesignsToMove([]);
        }}
        title="Move Designs"
        subtitle={`Select a folder for ${designsToMove.length} design${designsToMove.length !== 1 ? 's' : ''}`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {folders
              .filter(f => f.id !== folderToDelete?.id)
              .map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveDesignsToFolder(folder.id)}
                  className="w-full flex items-center gap-3 p-3 bg-[#0a0a0a] hover:bg-[#2F2F2F] text-white rounded-xl transition-colors text-left"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${folder.color}20` }}
                  >
                    <FolderIcon size={20} style={{ color: folder.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{folder.name}</p>
                    <p className="text-gray-500 text-xs">
                      {getDesignsForFolder(folder.id).length} designs
                    </p>
                  </div>
                  {folder.isDefault && (
                    <span className="text-[10px] bg-[#2F2F2F] text-gray-400 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </button>
              ))}
          </div>
          
          <button
            onClick={() => {
              setShowMoveDesignsModal(false);
              setShowFolderDeleteModal(true);
            }}
            className="w-full py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
          >
            Back
          </button>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewDesign(null);
        }}
        title={previewDesign?.name || 'Preview'}
        size="4xl"
      >
        <div className="flex flex-col items-center">
          {previewDesign?.thumbnail && previewDesign.thumbnail !== 'data:,' ? (
            <div 
              className="relative rounded-xl p-4 w-full flex items-center justify-center" 
              style={{ 
                maxHeight: '70vh',
                backgroundImage: `
                  linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
                  linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
                  linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                backgroundColor: '#1a1a1a'
              }}
            >
              <img 
                src={previewDesign.thumbnail}
                alt={previewDesign.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                draggable={false}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Eye size={48} className="mb-4 opacity-50" />
              <span>No preview available</span>
            </div>
          )}
          <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-[#333333]">
            <div>
              <p className="text-gray-400 text-sm">{previewDesign?.size}</p>
              <p className="text-gray-500 text-xs">{previewDesign?.elements?.length || 0} layers</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleEditDesign(previewDesign);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Floating Action Button - disabled (design creation not supported on mobile) */}
    </div>
    
    {/* Drag Overlay - shows preview while dragging */}
    <DragOverlay>
      {draggingDesign ? (
        <div className="bg-[#1a1a1a] rounded-xl border-2 border-orange-500 shadow-2xl shadow-orange-500/20 p-3 w-48 opacity-90">
          <div className="h-24 bg-[#2a2a2a] rounded-lg mb-2 flex items-center justify-center overflow-hidden">
            {draggingDesign.thumbnail && draggingDesign.thumbnail !== 'data:,' ? (
              <img 
                src={draggingDesign.thumbnail}
                alt={draggingDesign.name}
                className="max-w-full max-h-full object-contain"
                draggable="false"
              />
            ) : (
              <Layers size={24} className="text-gray-500" />
            )}
          </div>
          <p className="text-white text-sm font-medium truncate">{draggingDesign.name}</p>
          <p className="text-orange-400 text-xs mt-1">Drop on folder to move</p>
        </div>
      ) : null}
    </DragOverlay>
    </DndContext>
  );
};

export default MediaLibrary;
