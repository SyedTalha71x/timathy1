import React, { useState, useCallback, useEffect } from 'react';
import { 
  X, 
  Save, 
  ChevronDown,
  Settings,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Bookmark
} from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import useCanvasElements from '../hooks/useCanvasElements';
import { generateId, generateThumbnail } from '../utils/canvasUtils';

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
];

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
  onSaveAsTemplate,
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
    duplicateElement,
    setInitialElements,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCanvasElements([]);

  const createBackgroundElement = useCallback((size) => {
    const { width, height } = getOriginalDimensions(size);
    return {
      id: 'background',
      type: 'shape',
      shape: 'rectangle',
      color: '#FFFFFF',
      x: 0,
      y: 0,
      width: width,
      height: height,
      zIndex: -1,
      isBackground: true,
      name: 'Background'
    };
  }, []);

  const elementsLoadedRef = React.useRef(false);
  const backgroundLockedRef = React.useRef(false);
  
  useEffect(() => {
    if (!elementsLoadedRef.current) {
      if (initialElements.length > 0) {
        const hasBackground = initialElements.some(el => el.isBackground);
        if (hasBackground) {
          setInitialElements(initialElements);
        } else {
          const bgElement = createBackgroundElement(initialSize);
          setInitialElements([bgElement, ...initialElements]);
        }
      } else {
        const bgElement = createBackgroundElement(initialSize);
        setInitialElements([bgElement]);
      }
      elementsLoadedRef.current = true;
    }
  }, [initialElements, setInitialElements, initialSize, createBackgroundElement]);

  useEffect(() => {
    if (elementsLoadedRef.current && !backgroundLockedRef.current && initialElements.length === 0) {
      toggleLock('background');
      backgroundLockedRef.current = true;
    }
  }, [elements, toggleLock, initialElements.length]);

  useEffect(() => {
    return () => {
      elementsLoadedRef.current = false;
      backgroundLockedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setDesignName(initialName);
    setImageSize(initialSize);
  }, [initialName, initialSize]);

  // Keyboard shortcuts
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

  // Mouse wheel zoom
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

  // Add text
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
      height: 50,
      opacity: 1
    });
    setSelectedTool('text');
  }, [imageSize, addElement]);

  // Add shape
  const handleAddShape = useCallback((shapeType) => {
    const { width, height } = getOriginalDimensions(imageSize);
    addElement({
      type: 'shape',
      shape: shapeType,
      color: '#FF843E',
      x: width / 2 - 50,
      y: height / 2 - 50,
      width: 100,
      height: 100,
      opacity: 1
    });
    setSelectedTool('shape');
  }, [imageSize, addElement]);

  // Add line
  const handleAddLine = useCallback((options = {}) => {
    const { width, height } = getOriginalDimensions(imageSize);
    addElement({
      type: 'line',
      color: '#FFFFFF',
      lineStyle: options.lineStyle || 'solid',
      strokeWidth: 2,
      arrowStart: options.arrowStart || false,
      arrowEnd: options.arrowEnd || false,
      x: width / 2 - 100,
      y: height / 2,
      width: 200,
      height: 20,
      opacity: 1
    });
    setSelectedTool('line');
  }, [imageSize, addElement]);

  // Add gradient
  const handleAddGradient = useCallback((colors) => {
    const { width, height } = getOriginalDimensions(imageSize);
    addElement({
      type: 'gradient',
      gradientColors: colors || ['#FF6B6B', '#FFA500'],
      gradientAngle: 135,
      x: width / 2 - 100,
      y: height / 2 - 100,
      width: 200,
      height: 200,
      borderRadius: 0,
      opacity: 1
    });
    setSelectedTool('gradient');
  }, [imageSize, addElement]);

  // Add divider
  const handleAddDivider = useCallback(() => {
    const { width, height } = getOriginalDimensions(imageSize);
    addElement({
      type: 'divider',
      color: '#FFFFFF',
      dividerStyle: 'solid',
      strokeWidth: 2,
      x: width / 4,
      y: height / 2,
      width: width / 2,
      height: 20,
      opacity: 1
    });
    setSelectedTool('divider');
  }, [imageSize, addElement]);

  // Add image
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
            originalHeight: img.height,
            opacity: 1
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [imageSize, addElement]);

  // Save
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const elementsToSave = JSON.parse(JSON.stringify(elements));
      const thumbnail = await generateThumbnail(elementsToSave, imageSize, hiddenLayers);
      
      const design = {
        id: designId || generateId(),
        name: designName,
        size: imageSize,
        elements: elementsToSave,
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

  // Save as template
  const handleSaveAsTemplate = async () => {
    if (elements.length === 0) {
      alert('Add some elements before saving as template');
      return;
    }

    try {
      const elementsToSave = JSON.parse(JSON.stringify(elements));
      const thumbnail = await generateThumbnail(elementsToSave, imageSize, hiddenLayers);
      
      const templateData = {
        name: designName,
        size: imageSize,
        elements: elementsToSave,
        thumbnail,
        colors: {
          primary: elementsToSave.find(el => el.color)?.color || '#FF843E',
          secondary: '#1A1A1A',
          accent: '#FFFFFF'
        }
      };

      if (onSaveAsTemplate) {
        onSaveAsTemplate(templateData);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Close handling
  const handleClose = () => {
    if (elements.length > 0 && !designId) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const elementsToSave = JSON.parse(JSON.stringify(elements));
      const thumbnail = await generateThumbnail(elementsToSave, imageSize, hiddenLayers);
      
      const draft = {
        id: generateId(),
        name: designName,
        size: imageSize,
        elements: elementsToSave,
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

  const handleSizeChange = (newSize) => {
    setImageSize(newSize);
    setShowSizeDropdown(false);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="h-12 bg-[#141414] border-b border-[#333333] flex items-center justify-between px-3 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
          
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="bg-transparent text-white font-medium text-sm border-b border-transparent hover:border-[#333333] focus:border-orange-500 outline-none px-1 min-w-0 max-w-[200px] transition-colors"
          />
        </div>

        {/* Center */}
        <div className="flex items-center gap-2">
          {/* Size Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white text-sm rounded-lg transition-colors border border-[#333333]"
            >
              <span className="text-xs">{imageSize}</span>
              <ChevronDown size={14} className={`transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSizeDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSizeDropdown(false)} />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#1C1C1C] border border-[#333333] rounded-lg shadow-xl overflow-hidden z-50 min-w-[180px] max-h-[300px] overflow-y-auto">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size.size)}
                      className={`w-full flex items-center justify-between px-3 py-2 hover:bg-[#2F2F2F] transition-colors text-left ${
                        imageSize === size.size ? 'bg-orange-500/10 text-orange-500' : 'text-white'
                      }`}
                    >
                      <span className="text-xs">{size.name}</span>
                      <span className="text-[10px] text-gray-500">{size.size}</span>
                    </button>
                  ))}
                  <div className="border-t border-[#333333]">
                    <button
                      onClick={() => { setShowSizeDropdown(false); setShowCustomSize(true); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] transition-colors"
                    >
                      <Settings size={12} />
                      <span className="text-xs">Custom Size</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-px h-5 bg-[#333333]" />

          {/* Zoom */}
          <div className="flex items-center gap-0.5 bg-[#0a0a0a] rounded-lg px-1.5 py-1 border border-[#333333]">
            <button
              onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[10px] text-gray-400 font-medium w-9 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="flex items-center gap-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${canUndo ? 'text-gray-400 hover:text-white hover:bg-[#2F2F2F]' : 'text-gray-700'}`}
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${canRedo ? 'text-gray-400 hover:text-white hover:bg-[#2F2F2F]' : 'text-gray-700'}`}
            >
              <Redo2 size={16} />
            </button>
          </div>

          <div className="w-px h-5 bg-[#333333]" />

          {onSaveAsTemplate && (
            <button
              onClick={handleSaveAsTemplate}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
              title="Save as Template"
            >
              <Bookmark size={16} />
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
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
          onAddLine={handleAddLine}
          onAddGradient={handleAddGradient}
          onAddDivider={handleAddDivider}
          elements={elements}
          activeElementId={activeElementId}
          lockedElements={lockedElements}
          hiddenLayers={hiddenLayers}
          onSelectElement={setActiveElementId}
          onToggleLock={toggleLock}
          onToggleVisibility={toggleVisibility}
          onDeleteElement={deleteElement}
          onReorderElements={reorderElements}
        />

        {/* Canvas */}
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
            onDuplicateElement={duplicateElement}
            onDeleteElement={deleteElement}
          />
        </div>

        {/* Right Panel */}
        <div className="w-[320px] min-w-[320px] border-l border-[#333333] bg-[#141414]">
          <PropertiesPanel
            element={activeElement}
            onUpdate={(updates) => updateElementWithHistory(activeElementId, updates)}
            isLocked={lockedElements.has(activeElementId)}
            onToggleLock={() => toggleLock(activeElementId)}
          />
        </div>
      </div>

      {/* Custom Size Modal */}
      {showCustomSize && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] rounded-xl p-5 w-full max-w-xs border border-[#333333]">
            <h3 className="text-white font-medium text-base mb-4">Custom Size</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">Width</label>
                  <input
                    type="number"
                    value={customSize.width}
                    onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2 px-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    min="100"
                    max="5000"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">Height</label>
                  <input
                    type="number"
                    value={customSize.height}
                    onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2 px-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    min="100"
                    max="5000"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomSize(false)}
                  className="flex-1 py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCustomSize}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirm Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] rounded-xl p-5 w-full max-w-xs border border-[#333333]">
            <h3 className="text-white font-medium text-base mb-2">Save as Draft?</h3>
            <p className="text-gray-400 text-sm mb-4">You have unsaved changes.</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveAsDraft}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => { setShowCloseConfirm(false); onClose(); }}
                className="w-full py-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white text-sm rounded-lg transition-colors"
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
