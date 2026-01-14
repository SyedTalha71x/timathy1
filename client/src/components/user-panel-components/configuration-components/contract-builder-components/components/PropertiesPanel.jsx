import React, { useState, useMemo, useEffect } from 'react';
import {
  SettingsIcon, LayersIcon, FolderIcon, FolderPlusIcon,
  TrashIcon, EditIcon, XIcon, GripVerticalIcon,
  TextIcon, FileTextIcon, CheckSquareIcon, SignatureIcon,
  TypeIcon, MinusIcon, ImageIcon, DatabaseIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, FileIcon,
  BoldIcon, ItalicIcon, ChevronRightIcon, MoveIcon, MaximizeIcon,
  PaletteIcon
} from 'lucide-react';

// Enhanced CSS for full cross-browser range input support including Edge
const rangeInputStyles = `
  /* Base styling - remove default appearance */
  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    height: 0.5rem;
    background: #e5e7eb; /* CHANGED: Fallback background for Edge */
    border-radius: 0.5rem;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  
  /* Webkit (Chrome, Safari, newer Edge Chromium) */
  input[type="range"]::-webkit-slider-track {
    width: 100%;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 0.5rem;
    border: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-top: -0.25rem;
    position: relative; /* ADDED: Ensure proper positioning in Edge */
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    background: #2563eb;
  }
  
  input[type="range"]::-webkit-slider-thumb:active {
    background: #1d4ed8;
  }
  
  /* Firefox */
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 0.5rem;
    border: none;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    background: #2563eb;
  }
  
  input[type="range"]::-moz-range-thumb:active {
    background: #1d4ed8;
  }
  
  /* Edge Legacy and IE 10-11 */
  input[type="range"]::-ms-track {
    width: 100%;
    height: 0.5rem;
    background: #e5e7eb; /* CHANGED: Set background for visibility */
    border-color: transparent;
    color: transparent;
    cursor: pointer;
    border-radius: 0.5rem;
  }
  
  input[type="range"]::-ms-fill-lower {
    background: #3b82f6;
    border-radius: 0.5rem;
  }
  
  input[type="range"]::-ms-fill-upper {
    background: #e5e7eb;
    border-radius: 0.5rem;
  }
  
  input[type="range"]::-ms-thumb {
    width: 1rem;
    height: 1rem;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-top: 0;
  }
  
  input[type="range"]::-ms-thumb:hover {
    background: #2563eb;
  }
  
  input[type="range"]::-ms-thumb:active {
    background: #1d4ed8;
  }
  
  /* Remove focus outline but add visual feedback */
  input[type="range"]:focus {
    outline: none;
  }
  
  input[type="range"]:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  input[type="range"]:focus::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  input[type="range"]:focus::-ms-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  /* ADDED: Extra fix for Edge Chromium - ensure track is always visible */
  @supports (-ms-ime-align:auto) {
    input[type="range"] {
      background: #e5e7eb !important;
    }
  }
`;

const PropertiesPanel = ({
  activeTab,
  setActiveTab,
  contractPages,
  currentPage,
  selectedElement,
  selectedFolder,
  setSelectedElement,
  setSelectedFolder,
  folders,
  updateElement,
  removeElement,
  toggleElementVisibility,
  usedVariables,
  SYSTEM_VARIABLES,
  USER_VARIABLES,
  CONTENT_WIDTH_PX,
  CONTENT_HEIGHT_PX,
  editingFolderId,
  editingFolderName,
  editingFolderColor,
  setEditingFolderName,
  setEditingFolderColor,
  saveEditFolder,
  setEditingFolderId,
  startEditFolder,
  deleteFolder,
  toggleFolder,
  removeElementFromFolder,
  draggedElementIndex,
  dragOverElementIndex,
  handleElementDragStart,
  handleElementDragOver,
  handleElementDragLeave,
  handleElementDrop,
  handleElementDragEnd,
  removeAllElements,
  setShowCreateFolderModal,
  setShowEditFolderModal,
  cleanElements,
  imageInputRefs,
  handleImageUpload
}) => {
  // Helper function to handle number input - only allows integers
  const handleNumberInput = (e) => {
    const key = e.key;
    // Allow: backspace, delete, tab, escape, enter, arrows
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'Tab' ||
      key === 'Escape' ||
      key === 'Enter' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End'
    ) {
      return; // Allow these keys
    }
    // Allow Ctrl/Cmd combinations (like Ctrl+A, Ctrl+C, etc.)
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    // Block anything that's not a digit
    if (!/^[0-9]$/.test(key)) {
      e.preventDefault();
    }
  };

  // Helper function to safely parse integer input
  const safeParseInt = (value, fallback) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  const isPdfPage = contractPages[currentPage]?.locked;

  // State for collapsible sections - stored per element
  const [elementExpandedSections, setElementExpandedSections] = useState({});

  // Get the expanded sections for the current element
  const expandedSections = selectedElement 
    ? (elementExpandedSections[selectedElement] || {
        position: false,
        size: false,
        content: true,
        formatting: true
      })
    : {
        position: false,
        size: false,
        content: true,
        formatting: true
      };

  const toggleSection = (section) => {
    if (!selectedElement) return;
    
    const currentSections = elementExpandedSections[selectedElement] || {
      position: false,
      size: false,
      content: true,
      formatting: true
    };
    
    setElementExpandedSections(prev => ({
      ...prev,
      [selectedElement]: {
        ...currentSections,
        [section]: !currentSections[section]
      }
    }));
  };


  const usedSystemVariables = useMemo(() => {
    const used = new Set();
    contractPages.forEach(page => {
      if (page.elements) {
        page.elements.forEach(element => {
          // Only consider system-text variables
          if (element.type === 'system-text' && element.variable) {
            used.add(element.variable);
          }
        });
      }
    });
    return used;
  }, [contractPages]);

  const usedUserVariables = useMemo(() => {
    const used = new Set();
    contractPages.forEach(page => {
      if (page.elements) {
        page.elements.forEach(element => {
          // Only consider text (user input) variables
          if (element.type === 'text' && element.variable) {
            used.add(element.variable);
          }
        });
      }
    });
    return used;
  }, [contractPages]);

  const renderPropertyPanel = () => {
    const currentPageData = contractPages[currentPage];
    if (currentPageData?.locked) {
      return (
        <div className="p-6 text-gray-500 text-sm h-full flex items-center justify-center">
          <div className="text-center">
            <FileIcon size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-center text-gray-600">
              PDF pages cannot be edited.
            </p>
          </div>
        </div>
      );
    }
    
    // FIXED: Settings tab is ONLY for elements, never for folders
    // If no element is selected (even if a folder is selected), show the prompt
    if (!selectedElement) {
      return (
        <div className="p-6 text-gray-500 text-sm h-full flex items-center justify-center">
          <div className="text-center">
            <SettingsIcon size={24} className="mx-auto mb-3 text-gray-300" />
            <p className="text-center text-gray-600">Select an element to edit its properties.</p>
          </div>
        </div>
      );
    }

    // Only show element properties in the Settings tab
    const element = contractPages[currentPage]?.elements?.find(el => el.id === selectedElement);
    if (!element) return null;

    const availableVariables = element.type === 'system-text' 
      ? SYSTEM_VARIABLES.filter(v => !usedSystemVariables.has(v) || element.variable === v)
      : USER_VARIABLES.filter(v => !usedUserVariables.has(v) || element.variable === v);

    return (
      <div className="p-4 space-y-4">
        <div className="border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Element Properties</h3>
          <p className="text-xs text-gray-500 mt-1">
            {element.type === 'text' ? 'Variable Field (Input)' :
             element.type === 'system-text' ? 'Variable Field (System)' :
             element.type === 'textarea' ? 'Paragraph' :
             element.type === 'checkbox' ? 'Checkbox' :
             element.type === 'heading' ? 'Heading' :
             element.type === 'subheading' ? 'Subheading' :
             element.type === 'signature' ? 'Signature' :
             element.type === 'image' ? 'Image' :
             element.type === 'rectangle' ? 'Rectangle' :
             element.type === 'circle' ? 'Circle' :
             element.type === 'triangle' ? 'Triangle' :
             element.type === 'semicircle' ? 'Semicircle' :
             element.type === 'arrow' ? 'Arrow' :
             element.type === 'divider' ? 'Divider' : element.type}
          </p>
        </div>

        {/* ==================== REQUIRED FIELD SETTING ==================== */}
        {(element.type === 'text' || element.type === 'checkbox' || element.type === 'signature') && (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-3 mb-4">
            <input
              type="checkbox"
              id={`required-${element.id}`}
              checked={element.required}
              onChange={(e) => updateElement(element.id, 'required', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`required-${element.id}`} className="text-sm font-medium text-gray-900">
              Required Field
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
        )}

{/* ==================== POSITION SECTION ==================== */}
<div className="border-t-2 border-gray-300 pt-4 mt-4">
  <button
    onClick={() => toggleSection('position')}
    className="w-full flex items-center justify-between py-3 px-3 hover:bg-blue-50 rounded-lg transition-colors bg-gradient-to-r from-blue-50 to-transparent"
  >
    <div className="flex items-center gap-2 flex-1">
      <MoveIcon size={18} className="text-blue-600" />
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide m-0 p-0 leading-relaxed"> {/* m-0 p-0 und leading-relaxed */}
        Position
      </h4>
    </div>
    <ChevronRightIcon 
      size={16} 
      className={`text-gray-600 transition-transform ${expandedSections.position ? 'rotate-90' : ''}`}
    />
  </button>

  {expandedSections.position && (
    <div className="mt-3 pb-3 px-2 space-y-4 bg-gray-50 rounded-lg p-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-700">X Position</label>
          <span className="text-xs font-medium text-gray-900">{Math.round(element.x)}px</span>
        </div>
        <input
          type="range"
          min="0"
          max={CONTENT_WIDTH_PX}
          step="1"
          value={Math.round(element.x)}
          onChange={(e) => updateElement(element.id, 'x', parseInt(e.target.value) || 0)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="0"
          max={CONTENT_WIDTH_PX}
          step="1"
          value={Math.round(element.x)}
          onKeyDown={handleNumberInput}
          onChange={(e) => {
            const val = safeParseInt(e.target.value, element.x);
            updateElement(element.id, 'x', val);
          }}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-700">Y Position</label>
          <span className="text-xs font-medium text-gray-900">{Math.round(element.y)}px</span>
        </div>
        <input
          type="range"
          min="0"
          max={CONTENT_HEIGHT_PX}
          step="1"
          value={Math.round(element.y)}
          onChange={(e) => updateElement(element.id, 'y', parseInt(e.target.value) || 0)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="0"
          max={CONTENT_HEIGHT_PX}
          step="1"
          value={Math.round(element.y)}
          onKeyDown={handleNumberInput}
          onChange={(e) => {
            const val = safeParseInt(e.target.value, element.y);
            updateElement(element.id, 'y', val);
          }}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
        />
      </div>

      {/* Rotation - nur fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r dekorative Elemente und Bilder */}
      {['rectangle', 'circle', 'triangle', 'semicircle', 'arrow', 'divider', 'image'].includes(element.type) && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-700">
              Rotation
            </label>
            <span className="text-xs font-medium text-gray-900">{element.rotation || 0}</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={Math.round(element.rotation || 0)}
            onChange={(e) => updateElement(element.id, 'rotation', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min="0"
            max="360"
            step="1"
            value={Math.round(element.rotation || 0)}
            onKeyDown={handleNumberInput}
            onChange={(e) => {
              const val = safeParseInt(e.target.value, element.rotation || 0);
              updateElement(element.id, 'rotation', val);
            }}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
          />
        </div>
      )}
    </div>
  )}
</div>

{/* ==================== SIZE SECTION ==================== */}
<div className="border-t-2 border-gray-300 pt-4 mt-4">
  <button
    onClick={() => toggleSection('size')}
    className="w-full flex items-center justify-between py-3 px-3 hover:bg-blue-50 rounded-lg transition-colors bg-gradient-to-r from-blue-50 to-transparent"
  >
    <div className="flex items-center gap-2 flex-1">
      <MaximizeIcon size={18} className="text-blue-600" />
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide m-0 p-0 leading-relaxed">
        Size
      </h4>
    </div>
    <ChevronRightIcon 
      size={16} 
      className={`text-gray-600 transition-transform ${expandedSections.size ? 'rotate-90' : ''}`}
    />
  </button>

  {expandedSections.size && (
    <div className="mt-3 pb-3 px-2 space-y-4 bg-gray-50 rounded-lg p-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-700">Width</label>
          <span className="text-xs font-medium text-gray-900">{Math.round(element.width)}px</span>
        </div>
        <input
          type="range"
          min="10"
          max={CONTENT_WIDTH_PX}
          step="1"
          value={Math.round(element.width)}
          onChange={(e) => {
            const newWidth = parseInt(e.target.value) || 10;
            updateElement(element.id, 'width', newWidth);
            if (element.x + newWidth > CONTENT_WIDTH_PX) {
              updateElement(element.id, 'x', Math.max(0, CONTENT_WIDTH_PX - newWidth));
            }
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="10"
          max={CONTENT_WIDTH_PX}
          step="1"
          value={Math.round(element.width)}
          onKeyDown={handleNumberInput}
          onChange={(e) => {
            const newWidth = safeParseInt(e.target.value, element.width);
            const clampedWidth = Math.max(10, Math.min(newWidth, CONTENT_WIDTH_PX));
            updateElement(element.id, 'width', clampedWidth);
            if (element.x + clampedWidth > CONTENT_WIDTH_PX) {
              updateElement(element.id, 'x', Math.max(0, CONTENT_WIDTH_PX - clampedWidth));
            }
          }}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
        />
      </div>

      {element.height !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-700">Height</label>
            <span className="text-xs font-medium text-gray-900">{Math.round(element.height)}px</span>
          </div>
          <input
            type="range"
            min="2"
            max={element.type === 'divider' ? 10 : CONTENT_HEIGHT_PX}
            step="1"
            value={Math.round(element.height)}
            onChange={(e) => updateElement(element.id, 'height', parseInt(e.target.value) || 20)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min="2"
            max={element.type === 'divider' ? 10 : CONTENT_HEIGHT_PX}
            step="1"
            value={Math.round(element.height)}
            onKeyDown={handleNumberInput}
            onChange={(e) => {
              const val = safeParseInt(e.target.value, element.height || 20);
              updateElement(element.id, 'height', val);
            }}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
          />
        </div>
      )}
    </div>
  )}
</div>

{/* ==================== CONTENT SECTION ==================== */}
<div className="border-t-2 border-gray-300 pt-4 mt-4">
  <button
    onClick={() => toggleSection('content')}
    className="w-full flex items-center justify-between py-3 px-3 hover:bg-blue-50 rounded-lg transition-colors bg-gradient-to-r from-blue-50 to-transparent"
  >
    <div className="flex items-center gap-2 flex-1">
      <FileTextIcon size={18} className="text-blue-600" />
      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide m-0 p-0 leading-relaxed">
        Content
      </h4>
    </div>
    <ChevronRightIcon 
      size={16} 
      className={`text-gray-600 transition-transform ${expandedSections.content ? 'rotate-90' : ''}`}
    />
  </button>

  {expandedSections.content && (
    <div className="mt-3 pb-3 px-2 space-y-4 bg-gray-50 rounded-lg p-3">
      {/* CONTENT FOR TEXT AND SYSTEM-TEXT ELEMENTS */}
      {(element.type === 'text' || element.type === 'system-text') && (
        <>
          {/* Show Title Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`show-title-${element.id}`}
              checked={element.showTitle !== false}
              onChange={(e) => updateElement(element.id, 'showTitle', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`show-title-${element.id}`} className="text-sm font-medium text-gray-900">
              Show Title
            </label>
          </div>

          {/* Title Section - nur wenn showTitle aktiviert */}
          {element.showTitle !== false && (
            <div className="space-y-3 border-l-2 border-blue-200 pl-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <input
                  type="text"
                  value={element.label || ''}
                  onChange={(e) => updateElement(element.id, 'label', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder={element.type === 'text' ? 'Variable Field (Input)' : 'Variable Field (System)'}
                />
              </div>

              {/* Title Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title Font Family</label>
                <select
                  value={element.labelFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'labelFontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>

              {/* Title Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-900">Title Font Size</label>
                  <span className="text-xs font-medium text-gray-700">{element.labelFontSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  step="1"
                  value={element.labelFontSize || 14}
                  onChange={(e) => updateElement(element.id, 'labelFontSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Title Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Title Formatting</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'labelBold', !element.labelBold)}
                    className={`p-2 rounded ${element.labelBold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bold"
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'labelItalic', !element.labelItalic)}
                    className={`p-2 rounded ${element.labelItalic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Italic"
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'labelUnderline', !element.labelUnderline)}
                    className={`p-2 rounded ${element.labelUnderline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'labelCapsLock', !element.labelCapsLock)}
                    className={`p-2 rounded ${element.labelCapsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Uppercase (Caps Lock)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title Color */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={element.labelColor || '#111827'}
                    onChange={(e) => updateElement(element.id, 'labelColor', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.labelColor || '#111827'}
                    onChange={(e) => updateElement(element.id, 'labelColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#111827"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Variable Section - immer sichtbar, ORANGER RAND */}
          <div className="space-y-3 border-l-2 border-orange-200 pl-3 border-t pt-4">
            {/* Variable Dropdown - gelbe Box */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 a1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Link to a Variable
              </label>
              <select
                value={element.variable || ''}
                onChange={(e) => updateElement(element.id, 'variable', e.target.value)}
                className="w-full border-2 border-yellow-400 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white font-medium"
              >
                <option value="" className="text-gray-900">No Variable</option>
                {availableVariables.map(variable => (
                  <option 
                    key={variable} 
                    value={variable} 
                    className="text-gray-900"
                  >
                    {variable}
                  </option>
                ))}
              </select>
              <p className="text-xs text-yellow-800 mt-2 font-medium">
                This setting is important for contract creation.
              </p>
            </div>

            {/* Variable Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Variable/Input Font Family</label>
              <select
                value={element.inputFontFamily || 'Arial, sans-serif'}
                onChange={(e) => updateElement(element.id, 'inputFontFamily', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>

            {/* Variable Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-900">Variable/Input Font Size</label>
                <span className="text-xs font-medium text-gray-700">{element.inputFontSize || 14}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                step="1"
                value={element.inputFontSize || 14}
                onChange={(e) => updateElement(element.id, 'inputFontSize', parseInt(e.target.value) || 14)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Variable Formatting Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Variable/Input Formatting</label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => updateElement(element.id, 'inputBold', !element.inputBold)}
                  className={`p-2 rounded ${element.inputBold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                  title="Bold"
                >
                  <BoldIcon size={16} />
                </button>
                <button
                  onClick={() => updateElement(element.id, 'inputItalic', !element.inputItalic)}
                  className={`p-2 rounded ${element.inputItalic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                  title="Italic"
                >
                  <ItalicIcon size={16} />
                </button>
                <button
                  onClick={() => updateElement(element.id, 'inputUnderline', !element.inputUnderline)}
                  className={`p-2 rounded ${element.inputUnderline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                  title="Underline"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                    <line x1="4" y1="21" x2="20" y2="21" />
                  </svg>
                </button>
                <button
                  onClick={() => updateElement(element.id, 'inputCapsLock', !element.inputCapsLock)}
                  className={`p-2 rounded ${element.inputCapsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                  title="Uppercase (Caps Lock)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Variable Color */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Variable/Input Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.inputColor || '#374151'}
                  onChange={(e) => updateElement(element.id, 'inputColor', e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.inputColor || '#374151'}
                  onChange={(e) => updateElement(element.id, 'inputColor', e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="#374151"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* CHECKBOX CONTENT */}
      {element.type === 'checkbox' && (
        <>
          {/* Show Title Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`show-title-${element.id}`}
              checked={element.showTitle !== false}
              onChange={(e) => updateElement(element.id, 'showTitle', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`show-title-${element.id}`} className="text-sm font-medium text-gray-900">
              Show Title
            </label>
          </div>

          {/* Title Section - nur wenn showTitle aktiviert */}
          {element.showTitle !== false && (
            <div className="space-y-3 border-l-2 border-blue-200 pl-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Checkbox Title</label>
                <input
                  type="text"
                  value={element.label || ''}
                  onChange={(e) => updateElement(element.id, 'label', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Checkbox Title..."
                />
              </div>

              {/* Title Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title Font Family</label>
                <select
                  value={element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'checkboxTitleFontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>

              {/* Title Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-900">Title Font Size</label>
                  <span className="text-xs font-medium text-gray-700">{element.checkboxTitleSize || 16}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="1"
                  value={element.checkboxTitleSize || 16}
                  onChange={(e) => updateElement(element.id, 'checkboxTitleSize', parseInt(e.target.value) || 16)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Title Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Title Formatting</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'titleBold', !element.titleBold)}
                    className={`p-2 rounded ${element.titleBold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bold"
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'titleItalic', !element.titleItalic)}
                    className={`p-2 rounded ${element.titleItalic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Italic"
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'titleUnderline', !element.titleUnderline)}
                    className={`p-2 rounded ${element.titleUnderline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'titleCapsLock', !element.titleCapsLock)}
                    className={`p-2 rounded ${element.titleCapsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Uppercase (Caps Lock)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title Color */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={element.titleColor || '#000000'}
                    onChange={(e) => updateElement(element.id, 'titleColor', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.titleColor || '#000000'}
                    onChange={(e) => updateElement(element.id, 'titleColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show Description Checkbox */}
          <div className="flex items-center gap-2 border-t pt-4">
            <input
              type="checkbox"
              id={`show-description-${element.id}`}
              checked={element.showDescription !== false}
              onChange={(e) => updateElement(element.id, 'showDescription', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`show-description-${element.id}`} className="text-sm font-medium text-gray-900">
              Show Description
            </label>
          </div>

          {/* Description Section - nur wenn showDescription aktiviert */}
          {element.showDescription !== false && (
            <div className="space-y-3 border-l-2 border-orange-200 pl-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Checkbox Description</label>
                <textarea
                  value={element.description || ''}
                  onChange={(e) => {
                    updateElement(element.id, 'description', e.target.value);
                  }}
                  onInput={(e) => {
                    // Auto-resize textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  ref={(textarea) => {
                    if (textarea) {
                      // Set initial height
                      textarea.style.height = 'auto';
                      textarea.style.height = textarea.scrollHeight + 'px';
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none overflow-hidden"
                  rows="3"
                  placeholder="Description..."
                  style={{ whiteSpace: 'pre-wrap', minHeight: '72px' }}
                />
              </div>

              {/* Description Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description Font Family</label>
                <select
                  value={element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'checkboxDescriptionFontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>

              {/* Description Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-900">Description Font Size</label>
                  <span className="text-xs font-medium text-gray-700">{element.checkboxDescriptionSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={element.checkboxDescriptionSize || 14}
                  onChange={(e) => updateElement(element.id, 'checkboxDescriptionSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Description Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Description Formatting</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'descriptionBold', !element.descriptionBold)}
                    className={`p-2 rounded ${element.descriptionBold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bold"
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'descriptionItalic', !element.descriptionItalic)}
                    className={`p-2 rounded ${element.descriptionItalic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Italic"
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'descriptionUnderline', !element.descriptionUnderline)}
                    className={`p-2 rounded ${element.descriptionUnderline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'descriptionCapsLock', !element.descriptionCapsLock)}
                    className={`p-2 rounded ${element.descriptionCapsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Uppercase (Caps Lock)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description Color */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={element.descriptionColor || '#374151'}
                    onChange={(e) => updateElement(element.id, 'descriptionColor', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.descriptionColor || '#374151'}
                    onChange={(e) => updateElement(element.id, 'descriptionColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#374151"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* HEADING/SUBHEADING/TEXTAREA CONTENT */}
      {(element.type === 'heading' || element.type === 'subheading' || element.type === 'textarea') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              {element.type === 'heading' ? 'Heading' : 
               element.type === 'subheading' ? 'Subheading' : 'Content'}
            </label>
            {element.type === 'textarea' ? (
              <textarea
                value={element.content || ''}
                onChange={(e) => updateElement(element.id, 'content', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                rows="4"
                placeholder={element.type === 'textarea' ? 'Paragraph...' : ''}
              />
            ) : (
              <input
                type="text"
                value={element.content || ''}
                onChange={(e) => updateElement(element.id, 'content', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder={element.type === 'heading' ? 'Heading...' : 'Subheading...'}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Font Family</label>
            <select
              value={element.fontFamily || 'Arial, sans-serif'}
              onChange={(e) => updateElement(element.id, 'fontFamily', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Font Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.color || '#000000'}
                onChange={(e) => updateElement(element.id, 'color', e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.color || '#000000'}
                onChange={(e) => updateElement(element.id, 'color', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-900">Font size</label>
              <span className="text-xs font-medium text-gray-700">
                {element.type === 'heading' ? (element.fontSize || 24) :
                 element.type === 'subheading' ? (element.fontSize || 18) :
                 (element.fontSize || 14)}px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max={element.type === 'heading' ? '48' : element.type === 'subheading' ? '36' : '48'}
              step="1"
              value={element.fontSize || (element.type === 'heading' ? 24 : element.type === 'subheading' ? 18 : 14)}
              onChange={(e) => updateElement(element.id, 'fontSize', parseInt(e.target.value) || 
                (element.type === 'heading' ? 24 : element.type === 'subheading' ? 18 : 14)
              )}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => updateElement(element.id, 'bold', !element.bold)}
              className={`p-2 rounded ${element.bold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              title="Bold"
            >
              <BoldIcon size={16} />
            </button>
            <button
              onClick={() => updateElement(element.id, 'italic', !element.italic)}
              className={`p-2 rounded ${element.italic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              title="Italic"
            >
              <ItalicIcon size={16} />
            </button>
            <button
              onClick={() => updateElement(element.id, 'underline', !element.underline)}
              className={`p-2 rounded ${element.underline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              title="Underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                <line x1="4" y1="21" x2="20" y2="21" />
              </svg>
            </button>
            <button
              onClick={() => updateElement(element.id, 'capsLock', !element.capsLock)}
              className={`p-2 rounded ${element.capsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              title="Uppercase (Caps Lock)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
              </svg>
            </button>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Alignment</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateElement(element.id, 'alignment', 'left')}
                className={`p-2 rounded ${element.alignment === 'left' || !element.alignment ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                title="Left-aligned"
              >
                <AlignLeftIcon size={16} />
              </button>
              <button
                onClick={() => updateElement(element.id, 'alignment', 'center')}
                className={`p-2 rounded ${element.alignment === 'center' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                title="Centered"
              >
                <AlignCenterIcon size={16} />
              </button>
              <button
                onClick={() => updateElement(element.id, 'alignment', 'right')}
                className={`p-2 rounded ${element.alignment === 'right' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                title="right-aligned"
              >
                <AlignRightIcon size={16} />
              </button>
            </div>
          </div>

          {element.type === 'textarea' && (
            <>
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">List Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateElement(element.id, 'listStyle', 'none')}
                    className={`p-2 rounded ${element.listStyle === 'none' || !element.listStyle ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="No List"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'listStyle', 'bullet')}
                    className={`p-2 rounded ${element.listStyle === 'bullet' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bullets"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <circle cx="5" cy="6" r="2" />
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="5" cy="18" r="2" />
                      <line x1="10" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
                      <line x1="10" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
                      <line x1="10" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'listStyle', 'number')}
                    className={`p-2 rounded ${element.listStyle === 'number' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Numbered List"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <text x="3" y="8" fontSize="8" fill="currentColor" stroke="none">1.</text>
                      <text x="3" y="14" fontSize="8" fill="currentColor" stroke="none">2.</text>
                      <text x="3" y="20" fontSize="8" fill="currentColor" stroke="none">3.</text>
                      <line x1="10" y1="6" x2="21" y2="6" />
                      <line x1="10" y1="12" x2="21" y2="12" />
                      <line x1="10" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Tip: Use line breaks (Enter key) for list items.
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-900">Line Spacing</label>
                  <span className="text-xs font-medium text-gray-700">{element.lineHeight || 1.5}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={element.lineHeight || 1.5}
                  onChange={(e) => updateElement(element.id, 'lineHeight', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Tight</span>
                  <span>Normal</span>
                  <span>Wide</span>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* IMAGE CONTENT */}
      {element.type === 'image' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(element.id, file);
                    e.target.value = '';
                  }
                }}
                className="hidden"
                id={`image-upload-${element.id}`}
              />
              <label
                htmlFor={`image-upload-${element.id}`}
                className="flex items-center justify-between w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {element.fileName ? (
                    <span className="text-sm text-gray-700 font-medium truncate">{element.fileName}</span>
                  ) : (
                    <span className="text-sm text-gray-500">Select file...</span>
                  )}
                </div>
                <span className="text-xs text-blue-600 font-medium ml-2 flex-shrink-0">Browse</span>
              </label>
            </div>
          </div>
          
          {element.src && (
            <>
              <div className="pt-2">
                <button
                  onClick={() => {
                    // Open crop modal
                    const event = new CustomEvent('openImageCrop', { 
                      detail: { elementId: element.id } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/>
                    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>
                  </svg>
                  Crop Image
                </button>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id={`maintain-aspect-ratio-${element.id}`}
                    checked={element.maintainAspectRatio !== false}
                    onChange={(e) => updateElement(element.id, 'maintainAspectRatio', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`maintain-aspect-ratio-${element.id}`} className="text-sm font-medium text-gray-900 cursor-pointer flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M9 9l6 6M15 9l-6 6"/>
                    </svg>
                    Lock Aspect Ratio
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  When enabled, resizing maintains the image proportions without distortion.
                </p>
              </div>
            </>
          )}
        </>
      )}

      {/* DIVIDER CONTENT */}
      {element.type === 'divider' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Line Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.lineColor || '#000000'}
                onChange={(e) => updateElement(element.id, 'lineColor', e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.lineColor || '#000000'}
                onChange={(e) => updateElement(element.id, 'lineColor', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="#000000"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">Line Style</label>
              <select
                value={element.lineStyle || 'solid'}
                onChange={(e) => updateElement(element.id, 'lineStyle', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* SIGNATURE CONTENT */}
      {element.type === 'signature' && (
        <>
          {/* Show Location/Date Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`show-location-date-${element.id}`}
              checked={element.showLocationDate !== false}
              onChange={(e) => updateElement(element.id, 'showLocationDate', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`show-location-date-${element.id}`} className="text-sm font-medium text-gray-900">
              Show Location and Date
            </label>
          </div>

          {/* Location & Date Section - nur wenn showLocationDate aktiviert */}
          {element.showLocationDate !== false && (
            <div className="space-y-3 border-l-2 border-blue-200 pl-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Location</label>
                <input
                  type="text"
                  value={element.location || ''}
                  onChange={(e) => updateElement(element.id, 'location', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="e.g. Berlin"
                />
              </div>

              {/* Show Date Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`show-date-${element.id}`}
                  checked={element.showDate !== false}
                  onChange={(e) => updateElement(element.id, 'showDate', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`show-date-${element.id}`} className="text-sm font-medium text-gray-900">
                  Show Date
                </label>
              </div>

              {/* Date Format - nur wenn showDate aktiviert */}
              {element.showDate !== false && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Date Format</label>
                  <select
                    value={element.dateFormat || 'de-DE'}
                    onChange={(e) => updateElement(element.id, 'dateFormat', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="de-DE">DD.MM.YYYY</option>
                    <option value="en-US">MM/DD/YYYY</option>
                    <option value="en-GB">DD/MM/YYYY</option>
                    <option value="iso">YYYY-MM-DD</option>
                  </select>
                </div>
              )}

              {/* Location Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Location & Date Font Family</label>
                <select
                  value={element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'locationFontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>

              {/* Location Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-900">Location & Date Font Size</label>
                  <span className="text-xs font-medium text-gray-700">{element.signatureFontSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={element.signatureFontSize || 14}
                  onChange={(e) => updateElement(element.id, 'signatureFontSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Location Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Location & Date Formatting</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'locationBold', !element.locationBold)}
                    className={`p-2 rounded ${element.locationBold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bold"
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'locationItalic', !element.locationItalic)}
                    className={`p-2 rounded ${element.locationItalic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Italic"
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'locationUnderline', !element.locationUnderline)}
                    className={`p-2 rounded ${element.locationUnderline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'locationCapsLock', !element.locationCapsLock)}
                    className={`p-2 rounded ${element.locationCapsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Uppercase (Caps Lock)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Location Color */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Location & Date Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={element.locationColor || '#374151'}
                    onChange={(e) => updateElement(element.id, 'locationColor', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.locationColor || '#374151'}
                    onChange={(e) => updateElement(element.id, 'locationColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#374151"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show Text Below Signature Checkbox */}
          <div className="flex items-center gap-2 border-t pt-4">
            <input
              type="checkbox"
              id={`show-below-signature-${element.id}`}
              checked={element.showBelowSignature !== false}
              onChange={(e) => updateElement(element.id, 'showBelowSignature', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`show-below-signature-${element.id}`} className="text-sm font-medium text-gray-900">
              Show Text Below Signature
            </label>
          </div>

          {/* Below Signature Text Section - nur wenn showBelowSignature aktiviert */}
          {element.showBelowSignature !== false && (
            <div className="space-y-3 border-l-2 border-orange-200 pl-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Text Below Signature</label>
                <input
                  type="text"
                  value={element.belowSignatureText || ''}
                  onChange={(e) => updateElement(element.id, 'belowSignatureText', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="e.g. Location, Date/Signature"
                />
              </div>

              {/* Below Text Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Below Text Font Family</label>
                <select
                  value={element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'belowTextFontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>

              {/* Below Text Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-900">Below Text Font Size</label>
                  <span className="text-xs font-medium text-gray-700">{element.belowTextFontSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={element.belowTextFontSize || 14}
                  onChange={(e) => updateElement(element.id, 'belowTextFontSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Below Text Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Below Text Formatting</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'belowTextBold', !element.belowTextBold)}
                    className={`p-2 rounded ${element.belowTextBold ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Bold"
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'belowTextItalic', !element.belowTextItalic)}
                    className={`p-2 rounded ${element.belowTextItalic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Italic"
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'belowTextUnderline', !element.belowTextUnderline)}
                    className={`p-2 rounded ${element.belowTextUnderline ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'belowTextCapsLock', !element.belowTextCapsLock)}
                    className={`p-2 rounded ${element.belowTextCapsLock ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    title="Uppercase (Caps Lock)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Below Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Below Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={element.belowTextColor || '#374151'}
                    onChange={(e) => updateElement(element.id, 'belowTextColor', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.belowTextColor || '#374151'}
                    onChange={(e) => updateElement(element.id, 'belowTextColor', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#374151"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* DECORATIVE ELEMENTS (rectangle, circle, triangle, semicircle, arrow) */}
      {['rectangle', 'circle', 'triangle', 'semicircle', 'arrow'].includes(element.type) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.backgroundColor || '#f3f4f6'}
                onChange={(e) => updateElement(element.id, 'backgroundColor', e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.backgroundColor || '#f3f4f6'}
                onChange={(e) => updateElement(element.id, 'backgroundColor', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="#f3f4f6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.borderColor || '#000000'}
                onChange={(e) => updateElement(element.id, 'borderColor', e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.borderColor || '#000000'}
                onChange={(e) => updateElement(element.id, 'borderColor', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-900">Border Width</label>
              <span className="text-xs font-medium text-gray-700">{element.borderWidth ?? 2}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={element.borderWidth ?? 2}
              onChange={(e) => updateElement(element.id, 'borderWidth', safeParseInt(e.target.value, element.borderWidth ?? 2))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="20"
              step="1"
              value={element.borderWidth ?? 2}
              onKeyDown={handleNumberInput}
              onChange={(e) => {
                const value = safeParseInt(e.target.value, element.borderWidth ?? 2);
                const clamped = Math.max(0, Math.min(value, 20));
                updateElement(element.id, 'borderWidth', clamped);
              }}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-1">Border Style</label>
            <select
              value={element.lineStyle || 'solid'}
              onChange={(e) => updateElement(element.id, 'lineStyle', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          {/* Border Radius - ONLY for Rectangle */}
          {element.type === 'rectangle' && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-900">Border Radius (Rounded Corners)</label>
                <span className="text-xs font-medium text-gray-700">{element.borderRadius || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={element.borderRadius || 0}
                onChange={(e) => updateElement(element.id, 'borderRadius', safeParseInt(e.target.value, element.borderRadius || 0))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={element.borderRadius || 0}
                onKeyDown={handleNumberInput}
                onChange={(e) => {
                  const value = safeParseInt(e.target.value, element.borderRadius || 0);
                  const clamped = Math.max(0, Math.min(value, 50));
                  updateElement(element.id, 'borderRadius', clamped);
                }}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mt-1"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sharp</span>
                <span>Rounded</span>
              </div>
            </div>
          )}
        </>
       )}
    </div>
  )}
</div>
      </div>
    );
  };
       

  const renderContentPanel = () => {
    const elements = cleanElements(contractPages[currentPage]?.elements || []);

    // Build layer list sorted by sortIndex
    const allItems = [];
    let itemIndex = 0;
    
    // Collect folders and independent elements
    const independentElements = elements.filter(element => element && !element.folderId);
    
    // Create combined list with sortIndex
    const layerItems = [
      ...folders.map(f => ({ type: 'folder', data: f, sortIndex: f.sortIndex || 0 })),
      ...independentElements.map(el => ({ type: 'element', data: el, sortIndex: el.sortIndex || 0 }))
    ];
    
    // Sort by sortIndex (lower = higher in list)
    layerItems.sort((a, b) => a.sortIndex - b.sortIndex);
    
    // Build final list with proper indices
    // All visible items (folders, folderElements, and independent elements) get sequential indices
    layerItems.forEach(item => {
      if (item.type === 'folder') {
        const folder = item.data;
        allItems.push({
          type: 'folder',
          data: folder,
          index: itemIndex  // Assign current index
        });
        itemIndex++;  // Increment AFTER adding folder
        
        // Add folder's child elements if expanded
        if (folder.expanded && folder.elementIds.length > 0) {
          folder.elementIds.forEach(elementId => {
            const element = elements.find(el => el.id === elementId);
            if (element) {
              allItems.push({
                type: 'folderElement',
                data: element,
                folderId: folder.id,
                index: itemIndex  // Assign sequential index for drop target detection
              });
              itemIndex++;  // Increment for each folder element
            }
          });
        }
      } else {
        // Independent element
        allItems.push({
          type: 'element',
          data: item.data,
          index: itemIndex  // Assign current index
        });
        itemIndex++;  // Increment AFTER adding element
      }
    });
    
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 bg-blue-50 rounded"
              title="Create Folder"
              disabled={isPdfPage}
            >
              <FolderPlusIcon size={14} />
              Create Folder
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={removeAllElements}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 bg-red-50 rounded"
              title="Delete all element"
              disabled={isPdfPage}
            >
              <TrashIcon size={14} />
            </button>
          </div>
        </div>

        {allItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <LayersIcon size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No elements or folders available.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allItems.map((item) => {
              if (item.type === 'folder') {
                const folder = item.data;
                return (
                  <div
                    key={`folder-${folder.id}`}
                    draggable={!isPdfPage}
                    onDragStart={(e) => !isPdfPage && handleElementDragStart(e, item.index, folder.id, true, null)}
                    onDragOver={(e) => !isPdfPage && handleElementDragOver(e, item.index, true, folder.id)}
                    onDragLeave={handleElementDragLeave}
                    onDrop={(e) => !isPdfPage && handleElementDrop(e, item.index, true, folder.id)}
                    onDragEnd={handleElementDragEnd}
                    className={`border-2 rounded-lg relative transition-all ${
                      selectedFolder === folder.id 
                        ? 'border-blue-500 shadow-md' 
                        : 'border-gray-300 shadow-sm'
                    } ${
                      dragOverElementIndex === item.index ? 'ring-2 ring-blue-400' : ''
                    } ${isPdfPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      background: selectedFolder === folder.id 
                        ? `linear-gradient(135deg, ${folder.color}15 0%, ${folder.color}08 100%)`
                        : `linear-gradient(135deg, ${folder.color}10 0%, ${folder.color}05 100%)`
                    }}
                  >
                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        !isPdfPage ? 'cursor-pointer hover:bg-white/50' : 'cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (!isPdfPage) {
                          setSelectedFolder(folder.id);
                          setSelectedElement(null);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <GripVerticalIcon size={16} className="text-gray-400 flex-shrink-0" />
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: `${folder.color}20`,
                            border: `1px solid ${folder.color}40`
                          }}
                        >
                          <FolderIcon size={16} style={{ color: folder.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-black">{folder.name}</div>
                          <div className="text-xs text-gray-500">{folder.elementIds.length} Element(s)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            if (!isPdfPage) {
                              e.stopPropagation();
                              const editData = startEditFolder(folder);
                              setEditingFolderId(editData.id);
                              setEditingFolderName(editData.name);
                              setEditingFolderColor(editData.color);
                              setShowEditFolderModal(true);
                            }
                          }}
                          className="text-gray-400 hover:text-blue-500 p-1 rounded hover:bg-white/80"
                          title="Edit Folder"
                          disabled={isPdfPage}
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            if (!isPdfPage) {
                              e.stopPropagation();
                              deleteFolder(folder.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-white/80"
                          title="Delete Folder"
                          disabled={isPdfPage}
                        >
                          <TrashIcon size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            if (!isPdfPage) {
                              e.stopPropagation();
                              toggleFolder(folder.id);
                            }
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          disabled={isPdfPage}
                        >
                          <ChevronRightIcon 
                            size={16} 
                            className={`transform transition-transform ${folder.expanded ? 'rotate-90' : ''}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else if (item.type === 'folderElement') {
                const element = item.data;
                const folder = folders.find(f => f.id === item.folderId);
                const isSelected = selectedElement === element.id;
                
                return (
                  <div
                    key={`folder-element-${element.id}`}
                    draggable={!isPdfPage}
                    onDragStart={(e) => !isPdfPage && handleElementDragStart(e, item.index, element.id, false, item.folderId)}
                    onDragOver={(e) => !isPdfPage && handleElementDragOver(e, item.index, false, null)}
                    onDragLeave={handleElementDragLeave}
                    onDrop={(e) => !isPdfPage && handleElementDrop(e, item.index, false, null)}
                    onDragEnd={handleElementDragEnd}
                    className={`ml-8 flex items-center justify-between p-3 border rounded-lg cursor-move transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${
                      dragOverElementIndex === item.index ? 'ring-2 ring-green-400' : ''
                    } ${isPdfPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={folder?.color && !isSelected ? {
                      borderLeftWidth: '3px',
                      borderLeftColor: folder.color
                    } : undefined}
                    onClick={() => {
                      if (!isPdfPage) {
                        setSelectedElement(element.id);
                        setSelectedFolder(null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GripVerticalIcon size={16} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          {element.type === 'text' && <TextIcon size={14} className="text-purple-600 flex-shrink-0" />}
                          {element.type === 'system-text' && <DatabaseIcon size={14} className="text-purple-600 flex-shrink-0" />}
                          {element.type === 'textarea' && <FileTextIcon size={14} className="text-orange-600 flex-shrink-0" />}
                          {element.type === 'checkbox' && <CheckSquareIcon size={14} className="text-purple-600 flex-shrink-0" />}
                          {element.type === 'heading' && <TypeIcon size={14} className="text-orange-600 flex-shrink-0" />}
                          {element.type === 'subheading' && <TypeIcon size={14} className="text-orange-600 flex-shrink-0" />}
                          {element.type === 'signature' && <SignatureIcon size={14} className="text-purple-600 flex-shrink-0" />}
                          {element.type === 'image' && <ImageIcon size={14} className="text-red-600 flex-shrink-0" />}
                          {element.type === 'divider' && <MinusIcon size={14} className="text-red-600 flex-shrink-0" />}
                          {element.type === 'rectangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                          {element.type === 'circle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0"><circle cx="12" cy="12" r="9"/></svg>}
                          {element.type === 'triangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0"><path d="M12 2 L22 20 L2 20 Z"/></svg>}
                          {element.type === 'semicircle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0"><path d="M3 12 A9 9 0 0 1 21 12 Z"/></svg>}
                          {element.type === 'arrow' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                          <span className="font-medium text-sm text-black truncate min-w-0">
                            {element.type === 'text' ? 'Variable Field (Input)' :
                             element.type === 'system-text' ? 'Variable Field (System)' :
                             element.type === 'textarea' ? 'Paragraph' :
                             element.type === 'checkbox' ? 'Checkbox' :
                             element.type === 'heading' ? 'Heading' :
                             element.type === 'subheading' ? 'Subheading' :
                             element.type === 'signature' ? 'Signature' :
                             element.type === 'image' ? 'Image' :
                             element.type === 'rectangle' ? 'Rectangle' :
                             element.type === 'circle' ? 'Circle' :
                             element.type === 'triangle' ? 'Triangle' :
                             element.type === 'semicircle' ? 'Semicircle' :
                             element.type === 'arrow' ? 'Arrow' :
                             element.type === 'divider' ? 'Divider' : element.type}
                          </span>
                          {element.required && element.type !== 'system-text' && (
                            <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded flex-shrink-0">
                              *
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          {element.label || element.content || `Position: ${element.x}px, ${element.y}px`}
                        </div>
                        {element.variable && (
                          <div className="text-xs mt-1 flex items-center gap-2 min-w-0">
                            <span className="text-gray-500 flex-shrink-0">Variable:</span>
                            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium truncate" title={element.variable}>
                              {element.variable}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          if (!isPdfPage) {
                            e.stopPropagation();
                            removeElementFromFolder(element.id, item.folderId);
                          }
                        }}
                        className="text-gray-400 hover:text-orange-500 p-1"
                        title="Remove from Folder"
                        disabled={isPdfPage}
                      >
                        <XIcon size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          if (!isPdfPage) {
                            e.stopPropagation();
                            removeElement(element.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete"
                        disabled={isPdfPage}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                );
              } else {
                const element = item.data;
                return (
                  <div
                    key={`element-${element.id}`}
                    draggable={!isPdfPage}
                    onDragStart={(e) => !isPdfPage && handleElementDragStart(e, item.index, element.id)}
                    onDragOver={(e) => !isPdfPage && handleElementDragOver(e, item.index)}
                    onDragLeave={handleElementDragLeave}
                    onDrop={(e) => !isPdfPage && handleElementDrop(e, item.index)}
                    onDragEnd={handleElementDragEnd}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-move transition-all ${
                      selectedElement === element.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${
                      dragOverElementIndex === item.index ? 'ring-2 ring-green-400' : ''
                    } ${isPdfPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!isPdfPage) {
                        setSelectedElement(element.id);
                        setSelectedFolder(null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <GripVerticalIcon size={16} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {element.type === 'text' && <TextIcon size={14} className="text-purple-600" />}
                          {element.type === 'system-text' && <DatabaseIcon size={14} className="text-purple-600" />}
                          {element.type === 'textarea' && <FileTextIcon size={14} className="text-orange-600" />}
                          {element.type === 'checkbox' && <CheckSquareIcon size={14} className="text-purple-600" />}
                          {element.type === 'heading' && <TypeIcon size={14} className="text-orange-600" />}
                          {element.type === 'subheading' && <TypeIcon size={14} className="text-orange-600" />}
                          {element.type === 'signature' && <SignatureIcon size={14} className="text-purple-600" />}
                          {element.type === 'image' && <ImageIcon size={14} className="text-red-600" />}
                          {element.type === 'divider' && <MinusIcon size={14} className="text-red-600" />}
                          {element.type === 'rectangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                          {element.type === 'circle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><circle cx="12" cy="12" r="9"/></svg>}
                          {element.type === 'triangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><path d="M12 2 L22 20 L2 20 Z"/></svg>}
                          {element.type === 'semicircle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><path d="M3 12 A9 9 0 0 1 21 12 Z"/></svg>}
                          {element.type === 'arrow' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                          <span className="font-medium text-sm text-black truncate">
                            {element.type === 'text' ? 'Variable Field (Input)' :
                             element.type === 'system-text' ? 'Variable Field (System)' :
                             element.type === 'textarea' ? 'Paragraph' :
                             element.type === 'checkbox' ? 'Checkbox' :
                             element.type === 'heading' ? 'Heading' :
                             element.type === 'subheading' ? 'Subheading' :
                             element.type === 'signature' ? 'Signature' :
                             element.type === 'image' ? 'Image' :
                             element.type === 'rectangle' ? 'Rectangle' :
                             element.type === 'circle' ? 'Circle' :
                             element.type === 'triangle' ? 'Triangle' :
                             element.type === 'semicircle' ? 'Semicircle' :
                             element.type === 'arrow' ? 'Arrow' :
                             element.type === 'divider' ? 'Divider' : element.type}
                          </span>
                          {element.required && element.type !== 'system-text' && (
                            <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded flex-shrink-0">
                              *
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {element.label || element.content || `Position: ${element.x}px, ${element.y}px`}
                        </div>
                        {element.variable && (
                          <div className="text-xs mt-1 flex items-center gap-2">
                            <span className="text-gray-500">Variable:</span>
                            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium" title={element.variable}>
                              {element.variable}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          if (!isPdfPage) {
                            e.stopPropagation();
                            removeElement(element.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete"
                        disabled={isPdfPage}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <strong>Tip:</strong> Drag elements onto folders to add them. Drag them out of folders to remove them.
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{rangeInputStyles}</style>
      <div className="hidden lg:flex flex-col w-80">
        <div className="bg-white border-l border-gray-200 overflow-hidden shadow-sm flex flex-col h-full relative">
          {/* PDF-Seite Overlay gesamtes Panel */}
          {isPdfPage && (
            <div className="absolute inset-0 bg-gray-600 bg-opacity-90 z-50 flex items-center justify-center">
              <div className="text-center p-4">
                <FileIcon size={48} className="mx-auto mb-3 text-gray-200" />
                <p className="text-white font-medium mb-1">PDF page selected.</p>
                <p className="text-gray-200 text-sm">PDF pages cannot be edited.</p>
              </div>
            </div>
          )}
          
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'properties' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('properties')}
              >
                <SettingsIcon size={16} />
                Settings
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'content' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('content')}
              >
                <LayersIcon size={16} />
                Layers
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'properties' ? renderPropertyPanel() : renderContentPanel()}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesPanel;