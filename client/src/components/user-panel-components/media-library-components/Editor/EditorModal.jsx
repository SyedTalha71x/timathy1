import React, { useState, useCallback, useEffect } from 'react';
import { 
  X, 
  Save, 
  ChevronDown,
  Settings,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2
} from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import LayersPanel from './LayersPanel';
import useCanvasElements from '../hooks/useCanvasElements';
import { generateId, generateThumbnail } from '../utils/canvasUtils';

// All available sizes
const availableSizes = [
  { id: "ig-feed-square", name: "Instagram Feed", size: "1080x1080" },
  { id: "ig-feed-portrait", name: "Instagram Portrait", size: "1080x1350" },
  { id: "ig-story", name: "Instagram Story", size: "1080x1920" },
  { id: "ig-landscape", name: "Instagram Landscape", size: "1080x566" },
  { id: "fb-feed-square", name: "Facebook Feed", size: "1200x1200" },
  { id: "fb-feed-portrait", name: "Facebook Portrait", size: "1200x1500" },
  { id: "fb-story", name: "Facebook Story", size: "1080x1920" },
  { id: "fb-cover", name: "Facebook Cover", size: "820x312" },
  { id: "fb-event", name: "Facebook Event", size: "1920x1080" },
  { id: "universal-square", name: "Universal Square", size: "1200x1200" },
  { id: "universal-wide", name: "Widescreen 16:9", size: "1920x1080" },
  { id: "universal-portrait", name: "Portrait 4:5", size: "1080x1350" },
];

// Helper to get original dimensions from size string
const getOriginalDimensions = (imageSize) => {
  if (!imageSize || !imageSize.includes('x')) {
    return { width: 1080, height: 1080 };
  }
  const [width, height] = imageSize.split('x').map(Number);
  return { width: width || 1080, height: height || 1080 };
};

const EditorModal = ({
  isOpen,
  onClose,
  onSave,
  onSaveDraft,
  initialElements = [],
  initialName = 'Untitled Design',
  initialSize = '1080x1080',
  designId = null
}) => {
  const [designName, setDesignName] = useState(initialName);
  const [imageSize, setImageSize] = useState(initialSize);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState({ width: '1080', height: '1080' });
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState('select');
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const {
    elements,
    activeElementId,
    setActiveElementId,
    activeElement,
    visibleElements,
    lockedElements,
    hiddenLayers,
    addElement,
    updateElement,
    updateElementWithHistory,
    deleteElement,
    toggleLock,
    toggleVisibility,
    reorderElements,
    bringToFront,
    sendToBack,
    duplicateElement,
    clearAll,
    loadElements,
    setInitialElements,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCanvasElements([]);

  // Load initial elements when modal opens
  useEffect(() => {
    if (initialElements.length > 0) {
      setInitialElements(initialElements);
    }
  }, []);

  // Update state when props change
  useEffect(() => {
    setDesignName(initialName);
    setImageSize(initialSize);
  }, [initialName, initialSize]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && activeElementId) {
        if (!lockedElements.has(activeElementId)) {
          e.preventDefault();
          deleteElement(activeElementId);
        }
      }

      if (e.key === 'Escape') {
        setActiveElementId(null);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && activeElementId) {
        e.preventDefault();
        duplicateElement(activeElementId);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeElementId, lockedElements, deleteElement, undo, redo, duplicateElement]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(3, Math.max(0.25, prev + delta)));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, [isOpen, handleWheel]);

  // Add text element
  const handleAddText = useCallback(() => {
    const { width, height } = getOriginalDimensions(imageSize);
    addElement({
      type: 'text',
      content: 'Double click to edit',
      color: '#000000',
      size: 32,
      font: 'Inter, sans-serif',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      x: width / 2 - 100,
      y: height / 2 - 20,
      width: 200,
      height: 50
    });
    setSelectedTool('text');
  }, [imageSize, addElement]);

  // Add shape element
  const handleAddShape = useCallback((shapeType) => {
    const { width, height } = getOriginalDimensions(imageSize);
    addElement({
      type: 'shape',
      shape: shapeType,
      color: '#FF843E',
      x: width / 2 - 50,
      y: height / 2 - 50,
      width: 100,
      height: 100
    });
    setSelectedTool('shape');
  }, [imageSize, addElement]);

  // Add image element
  const handleAddImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const { width: canvasWidth, height: canvasHeight } = getOriginalDimensions(imageSize);
          const scale = Math.min(
            (canvasWidth * 0.5) / img.width,
            (canvasHeight * 0.5) / img.height
          );

          addElement({
            type: 'image',
            content: event.target.result,
            x: canvasWidth / 2 - (img.width * scale) / 2,
            y: canvasHeight / 2 - (img.height * scale) / 2,
            width: img.width * scale,
            height: img.height * scale,
            originalWidth: img.width,
            originalHeight: img.height
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [imageSize, addElement]);

  // Handle save
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const thumbnail = await generateThumbnail(elements, imageSize, hiddenLayers);
      
      const design = {
        id: designId || generateId(),
        name: designName,
        size: imageSize,
        elements: [...elements],
        thumbnail,
        createdAt: new Date().toISOString()
      };

      onSave(design);
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Failed to save design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle close - show confirmation if there are unsaved changes
  const handleClose = () => {
    if (elements.length > 0 && !designId) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    try {
      const thumbnail = await generateThumbnail(elements, imageSize, hiddenLayers);
      
      const draft = {
        id: generateId(),
        name: designName,
        size: imageSize,
        elements: [...elements],
        thumbnail,
        createdAt: new Date().toISOString(),
        isDraft: true
      };

      if (onSaveDraft) {
        onSaveDraft(draft);
      }
      setShowCloseConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      onClose();
    }
  };

  // Handle discard
  const handleDiscard = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  // Handle size change
  const handleSizeChange = (newSize) => {
    setImageSize(newSize);
    setShowSizeDropdown(false);
  };

  // Apply custom size
  const applyCustomSize = () => {
    const width = parseInt(customSize.width);
    const height = parseInt(customSize.height);
    
    if (width >= 100 && width <= 5000 && height >= 100 && height <= 5000) {
      setImageSize(`${width}x${height}`);
      setShowCustomSize(false);
    } else {
      alert('Size must be between 100 and 5000 pixels');
    }
  };

  // Handle duplicate from canvas
  const handleDuplicateElement = useCallback((id) => {
    duplicateElement(id);
  }, [duplicateElement]);

  // Handle delete from canvas
  const handleDeleteElement = useCallback((id) => {
    deleteElement(id);
  }, [deleteElement]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="h-14 bg-[#141414] border-b border-[#333333] flex items-center justify-between px-4 flex-shrink-0">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
          
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="bg-transparent text-white font-medium text-base border-b border-transparent hover:border-[#333333] focus:border-orange-500 outline-none px-1 min-w-[200px] transition-colors"
          />

          {/* Undo/Redo in Top Bar */}
          <div className="flex items-center gap-1 ml-4">
            <div className="relative group">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-xl transition-colors ${
                  canUndo 
                    ? 'text-gray-400 hover:text-white hover:bg-[#2F2F2F]' 
                    : 'text-gray-700 cursor-not-allowed'
                }`}
              >
                <Undo2 size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Undo</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                  Ctrl+Z
                </span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
            
            <div className="relative group">
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-xl transition-colors ${
                  canRedo 
                    ? 'text-gray-400 hover:text-white hover:bg-[#2F2F2F]' 
                    : 'text-gray-700 cursor-not-allowed'
                }`}
              >
                <Redo2 size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Redo</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                  Ctrl+Shift+Z
                </span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Size Selector & Zoom */}
        <div className="flex items-center gap-2">
          {/* Size Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] hover:bg-[#2F2F2F] text-white rounded-xl transition-colors border border-[#333333]"
            >
              <span className="text-sm">{imageSize}</span>
              <ChevronDown size={16} className={`transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSizeDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#1C1C1C] border border-[#333333] rounded-xl shadow-xl overflow-hidden z-20 min-w-[220px] max-h-[400px] overflow-y-auto">
                {availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeChange(size.size)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#2F2F2F] transition-colors ${
                      imageSize === size.size ? 'bg-orange-500/10 text-orange-500' : 'text-white'
                    }`}
                  >
                    <span className="text-sm">{size.name}</span>
                    <span className="text-xs text-gray-500">{size.size}</span>
                  </button>
                ))}
                <div className="border-t border-[#333333]">
                  <button
                    onClick={() => {
                      setShowSizeDropdown(false);
                      setShowCustomSize(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#2F2F2F] transition-colors"
                  >
                    <Settings size={14} />
                    <span className="text-sm">Custom Size</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-[#333333]" />

          {/* Zoom Controls with Tooltips */}
          <div className="flex items-center gap-1 bg-[#0a0a0a] rounded-xl px-2 py-1 border border-[#333333]">
            <div className="relative group">
              <button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <ZoomOut size={16} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Zoom Out</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                  Ctrl+-
                </span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
            
            <div className="relative group">
              <span className="text-xs text-gray-400 font-medium min-w-[45px] text-center cursor-default">
                {Math.round(zoom * 100)}%
              </span>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Scroll to zoom</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                  Ctrl+Scroll
                </span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
            
            <div className="relative group">
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <ZoomIn size={16} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                <span className="font-medium">Zoom In</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                  Ctrl++
                </span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Save Button with Tooltip */}
          <div className="relative group">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              <Save size={16} />
              <span className="text-sm">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
              <span className="font-medium">Save Design</span>
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                Ctrl+S
              </span>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Toolbar */}
        <EditorToolbar
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
        />

        {/* Canvas Area */}
        <div className="flex-1 min-w-0">
          <Canvas
            elements={elements}
            activeElementId={activeElementId}
            lockedElements={lockedElements}
            hiddenLayers={hiddenLayers}
            imageSize={imageSize}
            zoom={zoom}
            onSelectElement={setActiveElementId}
            onUpdateElement={updateElement}
            onDeselectAll={() => setActiveElementId(null)}
            onDuplicateElement={handleDuplicateElement}
            onDeleteElement={handleDeleteElement}
          />
        </div>

        {/* Right Panels */}
        <div className="w-[300px] min-w-[300px] flex flex-col border-l border-[#333333] bg-[#141414]">
          {/* Properties Panel */}
          {showProperties && (
            <div className="flex-1 overflow-hidden">
              <PropertiesPanel
                element={activeElement}
                onUpdate={(updates) => updateElementWithHistory(activeElementId, updates)}
                isLocked={lockedElements.has(activeElementId)}
                onToggleLock={() => toggleLock(activeElementId)}
                elements={elements}
                activeElementId={activeElementId}
                lockedElements={lockedElements}
                hiddenLayers={hiddenLayers}
                onSelectElement={setActiveElementId}
                onToggleVisibility={toggleVisibility}
                onDeleteElement={deleteElement}
                onReorderElements={reorderElements}
              />
            </div>
          )}
        </div>
      </div>

      {/* Custom Size Modal */}
      {showCustomSize && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-sm border border-[#333333]">
            <h3 className="text-white font-medium text-lg mb-4">Custom Size</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">Width (px)</label>
                  <input
                    type="number"
                    value={customSize.width}
                    onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    min="100"
                    max="5000"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">Height (px)</label>
                  <input
                    type="number"
                    value={customSize.height}
                    onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    min="100"
                    max="5000"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomSize(false)}
                  className="flex-1 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCustomSize}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-sm border border-[#333333] relative">
            {/* Close X Button */}
            <button
              onClick={() => setShowCloseConfirm(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-white font-medium text-lg mb-2 pr-8">Save as Draft?</h3>
            <p className="text-gray-400 text-sm mb-5">
              You have unsaved changes. Would you like to save this design as a draft?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveAsDraft}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={handleDiscard}
                className="w-full py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorModal;
