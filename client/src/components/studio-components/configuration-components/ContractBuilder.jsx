/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Modal, notification } from 'antd';
import {
  FileIcon, FilePlusIcon, SaveIcon, FolderIcon,
  FolderPlusIcon, EditIcon, TrashIcon, EyeIcon,
  UndoIcon, RedoIcon, ZoomInIcon, ZoomOutIcon,
  PrinterIcon, ChevronLeftIcon, ChevronRightIcon
} from 'lucide-react';

import { ELEMENT_CATEGORIES, SYSTEM_VARIABLES, USER_VARIABLES } from './contract-builder-components/constants/elementConstants.jsx';
import {
  PAGE_WIDTH_PX, PAGE_HEIGHT_PX, CONTENT_WIDTH_PX, CONTENT_HEIGHT_PX,
  MARGIN_PX, clampElementBounds, cleanElements, calculateDynamicContentArea
} from './contract-builder-components/utils/layoutUtils';
import { useDragAndDrop } from './contract-builder-components/hooks/useDragAndDrop';
import { useHistory } from './contract-builder-components/hooks/useHistory';
import { usePDFProcessor } from './contract-builder-components/hooks/usePDFProcessor';
import { useElementManagement } from './contract-builder-components/hooks/useElementManagement';
import { useFolderManagement } from './contract-builder-components/hooks/useFolderManagement.jsx';
import { usePageManagement } from './contract-builder-components/hooks/usePageManagement';
import { useResize } from './contract-builder-components/hooks/useResize';
import { renderElementContent, renderBuilderElement } from './contract-builder-components/utils/elementRenderer.jsx';

import Sidebar from './contract-builder-components/components/Sidebar';
import TopToolbar from './contract-builder-components/components/TopToolbar';
import PageTabs from './contract-builder-components/components/PageTabs';
import CanvasArea from './contract-builder-components/components/CanvasArea';
import PropertiesPanel from './contract-builder-components/components/PropertiesPanel';
import Modals from './contract-builder-components/components/Modals';

// Custom Scrollbar Styles - Applied globally within ContractBuilder
const scrollbarStyles = `
  /* Custom scrollbar for all scrollable areas in ContractBuilder */
  .contract-builder-container *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .contract-builder-container *::-webkit-scrollbar-track {
    background: transparent;
  }
  .contract-builder-container *::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .contract-builder-container *::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Firefox scrollbar */
  .contract-builder-container * {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }
  
  /* Specific fix for Properties Panel scrollbar */
  .contract-builder-container .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  .contract-builder-container .overflow-y-auto::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  .contract-builder-container .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .contract-builder-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ContractBuilder = ({ contractForm, onUpdate, onClose }) => {
  // Initial State
  const [contractPages, setContractPages] = useState(
    contractForm?.pages || [
      {
        id: 1,
        title: 'Contract Page',
        elements: [],
        backgroundImage: null,
      }
    ]
  );
  
  const [folders, setFolders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [showPreview, setShowPreview] = useState(false);
  const [headerFooterSettingsOpen, setHeaderFooterSettingsOpen] = useState(false);
  const [contractName, setContractName] = useState(contractForm?.name || 'Unnamed Contract');
  const [previewPage, setPreviewPage] = useState(0);
  const [editingContractName, setEditingContractName] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1.0);
  const [previewZoom, setPreviewZoom] = useState(0.6);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('Contract Page');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingFolderColor, setEditingFolderColor] = useState('');
  const [editingPageTitle, setEditingPageTitle] = useState(null);
  const [headerSettingsExpanded, setHeaderSettingsExpanded] = useState(true);
  const [footerSettingsExpanded, setFooterSettingsExpanded] = useState(true);
  const [showImageCropModal, setShowImageCropModal] = useState(false);
  const [cropImageElement, setCropImageElement] = useState(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState({
    unassignedVariables: [],
    fieldsWithoutVariables: []
  });
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0);
  const [measuredFooterHeight, setMeasuredFooterHeight] = useState(0);
  const [showHotkeysModal, setShowHotkeysModal] = useState(false);

  // Global Header/Footer State
  const [globalHeader, setGlobalHeader] = useState(
    contractForm?.globalHeader || {
      enabled: false,
      content: '',
      fontSize: 12,
      alignment: 'center',
      verticalAlignment: 'center',
      bold: false,
      italic: false,
      showOnPages: 'all'
    }
  );

  const [globalFooter, setGlobalFooter] = useState(
    contractForm?.globalFooter || {
      enabled: false,
      content: '',
      fontSize: 12,
      alignment: 'center',
      verticalAlignment: 'center',
      bold: false,
      italic: false,
      showOnPages: 'all'
    }
  );

  // Refs
  const nextElementId = useRef(2);
  const nextPageId = useRef(2);
  const nextFolderId = useRef(1);
  const pageTitleInputRef = useRef();
  const contractNameInputRef = useRef();
  const newPageNameInputRef = useRef();
  const canvasContainerRef = useRef();
  const imageInputRefs = useRef({});
  const pdfInputRef = useRef(null);

  // Custom Hooks
  const { saveToHistory, undo, redo, history, historyIndex } = useHistory(
    contractPages,
    folders,
    setContractPages,
    setFolders
  );

  const { handlePdfUpload, isPdfProcessing, setPdfInputRef } = usePDFProcessor(
    contractPages,
    setContractPages,
    saveToHistory,
    nextPageId
  );

  // Calculate dynamic content area
  const dynamicContentArea = useMemo(() => 
    calculateDynamicContentArea(
      globalHeader,
      globalFooter,
      currentPage,
      contractPages[currentPage]?.locked || contractPages[currentPage]?.isPdfPage,
      measuredHeaderHeight,
      measuredFooterHeight
    ),
    [globalHeader, globalFooter, currentPage, contractPages, measuredHeaderHeight, measuredFooterHeight]
  );

  // useElementManagement with dynamicContentArea
  const { 
    addElement,
    updateElement,
    removeElement,
    removeAllElements,
    toggleElementVisibility,
    toggleAllElementsVisibility,
    showAllElements,
    setShowAllElements
  } = useElementManagement(
    contractPages,
    currentPage,
    setContractPages,
    setSelectedElement,
    saveToHistory,
    nextElementId,
    selectedElement,
    globalHeader,
    globalFooter,
    dynamicContentArea,
    folders,
    setFolders,
    setSelectedFolder
  );

  const {
    createFolder: createFolderBase,
    updateFolder,
    deleteFolder,
    toggleFolder,
    startEditFolder,
    saveEditFolder,
    addElementToFolder,
    removeElementFromFolder
  } = useFolderManagement(
    folders,
    setFolders,
    contractPages,
    currentPage,
    setContractPages,
    setSelectedFolder,
    saveToHistory,
    nextFolderId
  );

  const {
    addPage,
    removePage,
    movePage,
    updatePageTitle
  } = usePageManagement(
    contractPages,
    setContractPages,
    currentPage,
    setCurrentPage,
    saveToHistory,
    nextPageId,
    setEditingPageTitle,
    setShowAddPageModal,
    setNewPageName
  );

  // useResize Hook - FIX: Pass canvasZoom for correct delta scaling
  const {
    isResizing,
    resizeHandle,
    handleResizeStart,
    handleResize,
    handleResizeEnd
  } = useResize(
    contractPages,
    currentPage,
    setContractPages,
    selectedElement,
    saveToHistory,
    folders,
    dynamicContentArea,
    canvasZoom
  );

  // useDragAndDrop with dynamicContentArea
  const {
    isDragging,
    setIsDragging,
    snapLines,
    setSnapLines,
    draggedElementIndex,
    setDraggedElementIndex,
    dragOverElementIndex,
    setDragOverElementIndex,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleElementDragStart,
    handleElementDragOver,
    handlePageDragEnd,
    handleElementDragLeave,
    handleElementDrop,
    handleElementDragEnd,
    handlePageDragStart,
    handlePageDragOver,
    handlePageDragLeave,
    handlePageDrop,
    isDraggingPage,
    dragOverPageIndex,
    dropPosition,
    containerRef
  } = useDragAndDrop(
    contractPages,
    currentPage,
    setContractPages,
    selectedElement,
    setSelectedElement,
    saveToHistory,
    folders,
    editingPageTitle,
    setFolders,
    movePage,
    globalHeader,
    globalFooter,
    dynamicContentArea
  );

  // Event Listeners for Resize
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => handleResize(e);
      const handleMouseUp = () => handleResizeEnd();
      const handleTouchMove = (e) => handleResize(e);
      const handleTouchEnd = () => handleResizeEnd();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  // Event Listeners for Drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDrag(e);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (e) => handleDrag(e);
      const handleTouchEnd = () => handleDragEnd();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  // Helper functions
  const createFolder = useCallback(() => {
    createFolderBase(newFolderName, newFolderColor);
    setNewFolderName('');
    setNewFolderColor('#3b82f6');
    setShowCreateFolderModal(false);
  }, [createFolderBase, newFolderName, newFolderColor]);

  const usedVariables = useMemo(() => {
    const vars = new Set();
    contractPages.forEach(page => {
      if (page.elements) {
        cleanElements(page.elements).forEach(element => {
          if (element.variable) {
            vars.add(element.variable);
          }
        });
      }
    });
    return vars;
  }, [contractPages]);

  // Update functions for global header/footer
  const updateGlobalHeader = (updates) => {
    const newHeader = { ...globalHeader, ...updates };
    setGlobalHeader(newHeader);
    saveToHistory(contractPages, folders, 'update_global_header');
  };

  const updateGlobalFooter = (updates) => {
    const newFooter = { ...globalFooter, ...updates };
    setGlobalFooter(newFooter);
    saveToHistory(contractPages, folders, 'update_global_footer');
  };

  // Validation and Save functions
  const validateVariables = useCallback(() => {
    const warnings = {
      unassignedVariables: [],
      fieldsWithoutVariables: []
    };

    const assignedVariables = new Set();
    contractPages.forEach(page => {
      if (page.elements) {
        cleanElements(page.elements).forEach(element => {
          if (element.variable && (element.type === 'text' || element.type === 'system-text')) {
            assignedVariables.add(element.variable);
          }
        });
      }
    });

    SYSTEM_VARIABLES.forEach(sysVar => {
      if (!assignedVariables.has(sysVar)) {
        warnings.unassignedVariables.push({
          variable: sysVar,
          type: 'System'
        });
      }
    });

    USER_VARIABLES.forEach(userVar => {
      if (!assignedVariables.has(userVar)) {
        warnings.unassignedVariables.push({
          variable: userVar,
          type: 'Input'
        });
      }
    });

    contractPages.forEach((page, pageIndex) => {
      if (page.elements) {
        cleanElements(page.elements).forEach(element => {
          if ((element.type === 'text' || element.type === 'system-text') && !element.variable) {
            warnings.fieldsWithoutVariables.push({
              fieldLabel: element.label || `${element.type === 'text' ? 'Input Field' : 'System Field'}`,
              fieldType: element.type === 'text' ? 'Input' : 'System',
              pageTitle: page.title,
              pageIndex: pageIndex + 1
            });
          }
        });
      }
    });

    return warnings;
  }, [contractPages]);

  const handleSave = useCallback(() => {
    const warnings = validateVariables();
    const hasWarnings = warnings.unassignedVariables.length > 0 || 
                        warnings.fieldsWithoutVariables.length > 0;

    if (hasWarnings) {
      setValidationWarnings(warnings);
      setShowValidationWarning(true);
    } else {
      performSave();
    }
  }, [validateVariables]);

  const performSave = useCallback(() => {
    notification.success({
      message: 'Contract Saved',
      description: 'The contract has been saved successfully.'
    });

    if (onUpdate) {
      const updatedForm = {
        ...(contractForm || {}),
        pages: contractPages,
        folders: folders,
        globalHeader,
        globalFooter,
        name: contractName
      };
      onUpdate(updatedForm);
    }

    setShowValidationWarning(false);
  }, [contractPages, folders, globalHeader, globalFooter, contractName, contractForm, onUpdate]);

  // Handler for close button - opens confirmation modal
  const handleCloseClick = useCallback(() => {
    setShowCloseConfirmModal(true);
  }, []);

  // Image Upload Handler
  const handleImageUpload = useCallback((elementId, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let newWidth = 200;
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > CONTENT_HEIGHT_PX) {
          newHeight = CONTENT_HEIGHT_PX;
          newWidth = newHeight * aspectRatio;
        }
        
        if (newWidth > CONTENT_WIDTH_PX) {
          newWidth = CONTENT_WIDTH_PX;
          newHeight = newWidth / aspectRatio;
        }
        
        const newPages = contractPages.map((page, pIdx) => {
          if (pIdx !== currentPage) return page;
          const newElements = page.elements.map(el => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              src: dataUrl,
              fileName: file.name,
              width: newWidth,
              height: newHeight,
              originalWidth: img.width,
              originalHeight: img.height,
              preCropWidth: newWidth,
              preCropHeight: newHeight,
              cropLeft: 0,
              cropTop: 0,
              cropRight: 0,
              cropBottom: 0
            };
          });
          return { ...page, elements: newElements };
        });
        
        setContractPages(newPages);
        saveToHistory(newPages, folders, 'upload_image');
        
        const uploadedElement = newPages[currentPage].elements.find(el => el.id === elementId);
        if (uploadedElement) {
          setCropImageElement(uploadedElement);
          setShowImageCropModal(true);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load image for dimensions');
        const newPages = contractPages.map((page, pIdx) => {
          if (pIdx !== currentPage) return page;
          const newElements = page.elements.map(el => {
            if (el.id !== elementId) return el;
            return {
              ...el,
              src: dataUrl,
              fileName: file.name,
              cropLeft: 0,
              cropTop: 0,
              cropRight: 0,
              cropBottom: 0
            };
          });
          return { ...page, elements: newElements };
        });
        
        setContractPages(newPages);
        saveToHistory(newPages, folders, 'upload_image');
      };
      
      img.src = dataUrl;
    };
    
    reader.onerror = () => {
      console.error('Failed to read file');
    };
    
    reader.readAsDataURL(file);
  }, [contractPages, currentPage, setContractPages, saveToHistory, folders, setCropImageElement, setShowImageCropModal]);

  // Initialize history
  useEffect(() => {
    if (contractPages.length > 0 && history.length === 0) {
      saveToHistory(contractPages, folders, 'initial');
    }
  }, [contractPages, folders, history.length, saveToHistory]);

  // Sync with props - ONLY on initial mount or when contractForm ID changes
  // This prevents the infinite loop: onUpdate → parent sets new contractForm → sync fires → setContractPages → onUpdate → ...
  const initializedFormRef = useRef(null);
  useEffect(() => {
    if (contractForm?.pages && contractForm?.id !== initializedFormRef.current) {
      initializedFormRef.current = contractForm.id;
      setContractPages(contractForm.pages);
      const maxId = contractForm.pages.reduce((max, page) => {
        const pageMax = (page.elements || []).reduce((pageMax, el) => Math.max(pageMax, el.id || 0), 0);
        return Math.max(max, pageMax);
      }, 0);
      nextElementId.current = Math.max(nextElementId.current, maxId + 1);
      const maxPageId = contractForm.pages.reduce((m, p) => Math.max(m, p.id || 0), 0);
      nextPageId.current = Math.max(nextPageId.current, maxPageId + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractForm?.id]);

  // Update callback - notify parent of changes
  // FIX: Use a ref for contractForm to avoid re-triggering when parent sends it back
  const contractFormRef = useRef(contractForm);
  useEffect(() => { contractFormRef.current = contractForm; }, [contractForm]);
  
  useEffect(() => {
    if (!onUpdate) return;
    
    const updatedForm = {
      ...(contractFormRef.current || {}),
      pages: contractPages,
      folders: folders,
      globalHeader,
      globalFooter,
      name: contractName
    };
    onUpdate(updatedForm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractPages, folders, contractName, globalHeader, globalFooter]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if a modal is open
      const isModalOpen = showPreview || 
                         showAddPageModal || 
                         showCreateFolderModal || 
                         headerFooterSettingsOpen || 
                         showImageCropModal || 
                         showValidationWarning ||
                         showHotkeysModal ||
                         showCloseConfirmModal;
      
      // Check if an input field is focused
      const isInputFocused = e.target.closest('input, textarea, select');
      
      // Check if current page is a PDF page
      const isPdfPage = contractPages?.[currentPage]?.locked;
      
      // ESC - Close builder or close modal
      if (e.key === 'Escape' && !isInputFocused) {
        e.preventDefault();
        if (showCloseConfirmModal) {
          setShowCloseConfirmModal(false);
        } else if (!isModalOpen && onClose) {
          setShowCloseConfirmModal(true);
        }
      }
      
      // N - New page
      if ((e.key === 'n' || e.key === 'N') && !isInputFocused && !isModalOpen && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowAddPageModal(true);
      }
      
      // P - Preview
      if ((e.key === 'p' || e.key === 'P') && !isInputFocused && !isModalOpen && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowPreview(true);
        setPreviewPage(0);
        setPreviewZoom(0.7);
      }
      
      // H - Header/Footer Settings
      if ((e.key === 'h' || e.key === 'H') && !isInputFocused && !isModalOpen && !isPdfPage && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setHeaderFooterSettingsOpen(true);
      }

      // A - Add PDF
      if ((e.key === 'a' || e.key === 'A') && !isInputFocused && !isModalOpen && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (pdfInputRef.current) {
          pdfInputRef.current.click();
        }
      }

      // Arrow keys for page navigation (circular)
      const isModalOpenExceptPreview = showAddPageModal || 
                                       showCreateFolderModal || 
                                       headerFooterSettingsOpen || 
                                       showImageCropModal || 
                                       showValidationWarning ||
                                       showHotkeysModal ||
                                       showCloseConfirmModal;
      
      if (e.key === 'ArrowRight' && !isInputFocused && !isModalOpenExceptPreview) {
        e.preventDefault();
        if (showPreview) {
          setPreviewPage(prev => (prev + 1) % contractPages.length);
        } else {
          setCurrentPage(prev => (prev + 1) % contractPages.length);
        }
      }

      if (e.key === 'ArrowLeft' && !isInputFocused && !isModalOpenExceptPreview) {
        e.preventDefault();
        if (showPreview) {
          setPreviewPage(prev => (prev - 1 + contractPages.length) % contractPages.length);
        } else {
          setCurrentPage(prev => (prev - 1 + contractPages.length) % contractPages.length);
        }
      }
      
      // Ctrl+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !isInputFocused && !isModalOpen && !e.repeat) {
        e.preventDefault();
        removeElement(selectedElement);
      }
      
      // Copy with "C" key
      if ((e.key === 'c' || e.key === 'C') && selectedElement && !isInputFocused && !isModalOpen && !e.ctrlKey && !e.metaKey && !e.repeat) {
        e.preventDefault();
        const currentPageData = contractPages[currentPage];
        const element = currentPageData?.elements.find(el => el.id === selectedElement);
        
        if (element) {
          let newElement = {
            ...element,
            id: nextElementId.current++,
            x: element.x + 20,
            y: element.y + 20,
            variable: (element.type === 'text' || element.type === 'system-text') ? null : element.variable
          };
          
          const clampedBounds = clampElementBounds(
            newElement,
            CONTENT_WIDTH_PX,
            dynamicContentArea.height
          );
          
          newElement = {
            ...newElement,
            ...clampedBounds
          };
          
          const newPages = contractPages.map((page, idx) => 
            idx === currentPage ? { ...page, elements: [newElement, ...(page.elements || [])] } : page
          );
          
          setContractPages(newPages);
          setSelectedElement(newElement.id);
          saveToHistory(newPages, folders, 'duplicate_element');
        }
      }
      
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !e.repeat) {
        e.preventDefault();
        undo();
      }
      
      // Redo
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'y' && !e.shiftKey) || (e.key === 'Z' && e.shiftKey)) && !e.repeat) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElement, 
    undo, 
    redo, 
    removeElement, 
    showPreview, 
    showAddPageModal, 
    showCreateFolderModal, 
    headerFooterSettingsOpen, 
    showImageCropModal, 
    showValidationWarning, 
    showHotkeysModal,
    showCloseConfirmModal,
    contractPages, 
    currentPage, 
    setContractPages, 
    setSelectedElement, 
    saveToHistory, 
    folders, 
    nextElementId,
    dynamicContentArea,
    setShowAddPageModal,
    setShowPreview,
    setPreviewPage,
    setPreviewZoom,
    setHeaderFooterSettingsOpen,
    handleSave,
    setCurrentPage,
    onClose
  ]);

  // Zoom with Ctrl + Mouse Wheel
  useEffect(() => {
    const handleWheel = (e) => {
      const isModalOpen = showPreview || 
                         showAddPageModal || 
                         showCreateFolderModal || 
                         headerFooterSettingsOpen || 
                         showImageCropModal || 
                         showValidationWarning ||
                         showHotkeysModal ||
                         showCloseConfirmModal;
      
      const isInputFocused = document.activeElement && 
                            (document.activeElement.tagName === 'INPUT' || 
                             document.activeElement.tagName === 'TEXTAREA' || 
                             document.activeElement.tagName === 'SELECT');
      
      if ((e.ctrlKey || e.metaKey) && !isModalOpen && !isInputFocused) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
          setCanvasZoom(prev => Math.min(1.2, prev + 0.05));
        } else if (e.deltaY > 0) {
          setCanvasZoom(prev => Math.max(0.5, prev - 0.05));
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [setCanvasZoom, showPreview, showAddPageModal, showCreateFolderModal, headerFooterSettingsOpen, showImageCropModal, showValidationWarning, showCloseConfirmModal]);

  // Close page title editing when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingPageTitle !== null) {
        const inputElement = pageTitleInputRef.current;
        if (inputElement && !inputElement.contains(e.target)) {
          const newTitle = inputElement.value.trim();
          if (newTitle) {
            const newPages = contractPages.map((page, idx) => 
              idx === editingPageTitle ? { ...page, title: newTitle.replace(/^\d+\.\s*/, '') } : page
            );
            setContractPages(newPages);
            saveToHistory(newPages, folders, 'update_page_title');
          }
          setEditingPageTitle(null);
        }
      }
    };

    if (editingPageTitle !== null) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('click', handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [editingPageTitle, contractPages, folders, saveToHistory, setContractPages, setEditingPageTitle]);

  // Listen for openImageCrop custom event
  useEffect(() => {
    const handleOpenImageCrop = (e) => {
      const elementId = e.detail?.elementId;
      if (elementId) {
        const element = contractPages[currentPage]?.elements.find(el => el.id === elementId);
        if (element) {
          setCropImageElement(element);
          setShowImageCropModal(true);
        }
      }
    };

    window.addEventListener('openImageCrop', handleOpenImageCrop);
    return () => window.removeEventListener('openImageCrop', handleOpenImageCrop);
  }, [contractPages, currentPage]);

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="contract-builder-container flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          ELEMENT_CATEGORIES={ELEMENT_CATEGORIES}
          addElement={addElement}
          contractName={contractName}
          setContractName={setContractName}
          editingContractName={editingContractName}
          setEditingContractName={setEditingContractName}
          contractNameInputRef={contractNameInputRef}
          contractPages={contractPages}
          currentPage={currentPage}
          setShowHotkeysModal={setShowHotkeysModal}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Toolbar - with onClose prop for integrated X button */}
          <TopToolbar
            setShowAddPageModal={setShowAddPageModal}
            setPdfInputRef={(ref) => {
              setPdfInputRef(ref);
              pdfInputRef.current = ref;
            }}
            handlePdfUpload={handlePdfUpload}
            isPdfProcessing={isPdfProcessing}
            canvasZoom={canvasZoom}
            setCanvasZoom={setCanvasZoom}
            setHeaderFooterSettingsOpen={setHeaderFooterSettingsOpen}
            setShowPreview={setShowPreview}
            setPreviewPage={setPreviewPage}
            setPreviewZoom={setPreviewZoom}
            undo={undo}
            redo={redo}
            historyIndex={historyIndex}
            history={history}
            contractPages={contractPages}
            currentPage={currentPage}
            handleSave={handleSave}
            onClose={onClose ? handleCloseClick : undefined}
          />

          {/* Pages Tabs */}
          <PageTabs
            contractPages={contractPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            editingPageTitle={editingPageTitle}
            setEditingPageTitle={setEditingPageTitle}
            updatePageTitle={updatePageTitle}
            removePage={removePage}
            pageTitleInputRef={pageTitleInputRef}
            isDraggingPage={isDraggingPage}
            dragOverPageIndex={dragOverPageIndex}
            dropPosition={dropPosition}
            handlePageDragStart={handlePageDragStart}
            handlePageDragOver={handlePageDragOver}
            handlePageDragLeave={handlePageDragLeave}
            handlePageDrop={handlePageDrop}
            handlePageDragEnd={handlePageDragEnd}
          />

          {/* Canvas Area */}
          <CanvasArea
            containerRef={containerRef}
            contractPages={contractPages}
            currentPage={currentPage}
            canvasZoom={canvasZoom}
            snapLines={snapLines}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            setSelectedFolder={setSelectedFolder}
            handleDragStart={handleDragStart}
            isDragging={isDragging}
            renderBuilderElement={(element, selectedEl, setSelectedEl, handleDragStartParam, isDraggingParam) => renderBuilderElement(
              element,
              selectedEl,
              setSelectedEl,
              handleDragStartParam,
              isDraggingParam,
              removeElement,
              nextElementId,
              contractPages,
              currentPage,
              setContractPages,
              saveToHistory,
              folders,
              handleResizeStart,
              isResizing,
              dynamicContentArea
            )}
            globalHeader={globalHeader}
            globalFooter={globalFooter}
            imageInputRefs={imageInputRefs}
            handleImageUpload={handleImageUpload}
            updateElement={updateElement}
            removeElement={removeElement}
            nextElementId={nextElementId}
            setContractPages={setContractPages}
            saveToHistory={saveToHistory}
            folders={folders}
            measuredHeaderHeight={measuredHeaderHeight}
            setMeasuredHeaderHeight={setMeasuredHeaderHeight}
            measuredFooterHeight={measuredFooterHeight}
            setMeasuredFooterHeight={setMeasuredFooterHeight}
            dynamicContentArea={dynamicContentArea}
            handleResizeStart={handleResizeStart}
            isResizing={isResizing}
          />
        </div>

        {/* Desktop Properties Panel with Tabs */}
        <PropertiesPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          contractPages={contractPages}
          currentPage={currentPage}
          selectedElement={selectedElement}
          selectedFolder={selectedFolder}
          setSelectedElement={setSelectedElement}
          setSelectedFolder={setSelectedFolder}
          folders={folders}
          updateElement={updateElement}
          removeElement={removeElement}
          toggleElementVisibility={toggleElementVisibility}
          usedVariables={usedVariables}
          SYSTEM_VARIABLES={SYSTEM_VARIABLES}
          USER_VARIABLES={USER_VARIABLES}
          CONTENT_WIDTH_PX={CONTENT_WIDTH_PX}
          CONTENT_HEIGHT_PX={dynamicContentArea.height}
          editingFolderId={editingFolderId}
          editingFolderName={editingFolderName}
          editingFolderColor={editingFolderColor}
          setEditingFolderName={setEditingFolderName}
          setEditingFolderColor={setEditingFolderColor}
          saveEditFolder={saveEditFolder}
          setEditingFolderId={setEditingFolderId}
          startEditFolder={startEditFolder}
          deleteFolder={deleteFolder}
          toggleFolder={toggleFolder}
          removeElementFromFolder={removeElementFromFolder}
          draggedElementIndex={draggedElementIndex}
          dragOverElementIndex={dragOverElementIndex}
          handleElementDragStart={handleElementDragStart}
          handleElementDragOver={handleElementDragOver}
          handleElementDragLeave={handleElementDragLeave}
          handleElementDrop={handleElementDrop}
          handleElementDragEnd={handleElementDragEnd}
          removeAllElements={removeAllElements}
          setShowCreateFolderModal={setShowCreateFolderModal}
          setShowEditFolderModal={setShowEditFolderModal}
          cleanElements={cleanElements}
          imageInputRefs={imageInputRefs}
          handleImageUpload={handleImageUpload}
        />

        {/* Modals */}
        <Modals
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          previewPage={previewPage}
          setPreviewPage={setPreviewPage}
          contractPages={contractPages}
          setContractPages={setContractPages}
          previewZoom={previewZoom}
          setPreviewZoom={setPreviewZoom}
          globalHeader={globalHeader}
          globalFooter={globalFooter}
          renderElementContent={renderElementContent}
          showAddPageModal={showAddPageModal}
          setShowAddPageModal={setShowAddPageModal}
          newPageName={newPageName}
          setNewPageName={setNewPageName}
          addPage={addPage}
          newPageNameInputRef={newPageNameInputRef}
          showCreateFolderModal={showCreateFolderModal}
          setShowCreateFolderModal={setShowCreateFolderModal}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          newFolderColor={newFolderColor}
          setNewFolderColor={setNewFolderColor}
          createFolder={createFolder}
          showEditFolderModal={showEditFolderModal}
          setShowEditFolderModal={setShowEditFolderModal}
          editingFolderId={editingFolderId}
          setEditingFolderId={setEditingFolderId}
          editingFolderName={editingFolderName}
          setEditingFolderName={setEditingFolderName}
          editingFolderColor={editingFolderColor}
          setEditingFolderColor={setEditingFolderColor}
          saveEditFolder={saveEditFolder}
          headerFooterSettingsOpen={headerFooterSettingsOpen}
          setHeaderFooterSettingsOpen={setHeaderFooterSettingsOpen}
          updateGlobalHeader={updateGlobalHeader}
          updateGlobalFooter={updateGlobalFooter}
          headerSettingsExpanded={headerSettingsExpanded}
          setHeaderSettingsExpanded={setHeaderSettingsExpanded}
          footerSettingsExpanded={footerSettingsExpanded}
          setFooterSettingsExpanded={setFooterSettingsExpanded}
          showImageCropModal={showImageCropModal}
          setShowImageCropModal={setShowImageCropModal}
          cropImageElement={cropImageElement}
          updateElement={updateElement}
          currentPage={currentPage}
          showValidationWarning={showValidationWarning}
          setShowValidationWarning={setShowValidationWarning}
          validationWarnings={validationWarnings}
          handleSaveAnyway={performSave}
          folders={folders}
          saveToHistory={saveToHistory}
          showHotkeysModal={showHotkeysModal}
          setShowHotkeysModal={setShowHotkeysModal}
        />

        {/* Close Confirmation Modal */}
        {showCloseConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Close Contract Builder?</h3>
              <p className="text-gray-600 mb-6">Do you want to save your changes before closing?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCloseConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCloseConfirmModal(false);
                    onClose?.();
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    performSave();
                    setShowCloseConfirmModal(false);
                    onClose?.();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContractBuilder;
