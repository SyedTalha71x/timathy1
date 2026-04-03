import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ColorPickerModal from '../../../../shared/ColorPickerModal';
import { VARIABLE_TRANSLATION_KEYS } from '../constants/elementConstants';
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
// Plus custom scrollbar styles
const rangeInputStyles = `
  /* Primary Checkbox */
  .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
  .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
  .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }

  /* Remove browser default blue focus outlines on all form elements */
  .properties-panel input:focus,
  .properties-panel select:focus,
  .properties-panel textarea:focus {
    outline: none;
    box-shadow: none;
  }

  /* Custom Scrollbar Styles for Properties Panel */
  .properties-panel-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .properties-panel-scroll::-webkit-scrollbar-track {
    background: var(--color-surface-card);
  }
  .properties-panel-scroll::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }
  .properties-panel-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-content-muted);
  }
  

  /* Base styling - remove default appearance */
  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    height: 0.5rem;
    background: var(--color-border); /* CHANGED: Fallback background for Edge */
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
    background: var(--color-border);
    border-radius: 0.5rem;
    border: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-top: -0.25rem;
    position: relative; /* ADDED: Ensure proper positioning in Edge */
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    background: var(--color-primary-hover);
  }
  
  input[type="range"]::-webkit-slider-thumb:active {
    background: var(--color-primary-hover);
  }
  
  /* Firefox */
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 0.5rem;
    background: var(--color-border);
    border-radius: 0.5rem;
    border: none;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    background: var(--color-primary-hover);
  }
  
  input[type="range"]::-moz-range-thumb:active {
    background: var(--color-primary-hover);
  }
  
  /* Edge Legacy and IE 10-11 */
  input[type="range"]::-ms-track {
    width: 100%;
    height: 0.5rem;
    background: var(--color-border); /* CHANGED: Set background for visibility */
    border-color: transparent;
    color: transparent;
    cursor: pointer;
    border-radius: 0.5rem;
  }
  
  input[type="range"]::-ms-fill-lower {
    background: var(--color-primary);
    border-radius: 0.5rem;
  }
  
  input[type="range"]::-ms-fill-upper {
    background: var(--color-border);
    border-radius: 0.5rem;
  }
  
  input[type="range"]::-ms-thumb {
    width: 1rem;
    height: 1rem;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-top: 0;
  }
  
  input[type="range"]::-ms-thumb:hover {
    background: var(--color-primary-hover);
  }
  
  input[type="range"]::-ms-thumb:active {
    background: var(--color-primary-hover);
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
      background: var(--color-border) !important;
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
  const { t } = useTranslation();
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
  const [colorPickerConfig, setColorPickerConfig] = useState({ isOpen: false, property: '', currentColor: '#000000', title: '' });

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
        <div className="p-6 text-content-muted text-sm h-full flex items-center justify-center">
          <div className="text-center">
            <FileIcon size={32} className="mx-auto mb-3 text-content-faint" />
            <p className="text-center text-content-secondary">
              {t("contractBuilder.properties.pdfReadonly")}
            </p>
          </div>
        </div>
      );
    }
    
    // FIXED: Settings tab is ONLY for elements, never for folders
    // If no element is selected (even if a folder is selected), show the prompt
    if (!selectedElement) {
      return (
        <div className="p-6 text-content-muted text-sm h-full flex items-center justify-center">
          <div className="text-center">
            <SettingsIcon size={24} className="mx-auto mb-3 text-content-faint" />
            <p className="text-center text-content-secondary">{t("contractBuilder.properties.selectElement")}</p>
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
          <h3 className="text-lg font-semibold text-content-primary">{t("contractBuilder.properties.elementProperties")}</h3>
          <p className="text-xs text-content-muted mt-1">
            {element.type === 'text' ? t('contractBuilder.elements.variableFieldInput') :
             element.type === 'system-text' ? t('contractBuilder.elements.variableFieldSystem') :
             element.type === 'textarea' ? t('contractBuilder.elements.paragraph') :
             element.type === 'checkbox' ? t('contractBuilder.elements.checkbox') :
             element.type === 'heading' ? t('contractBuilder.elements.heading') :
             element.type === 'subheading' ? t('contractBuilder.elements.subheading') :
             element.type === 'signature' ? t('contractBuilder.elements.signature') :
             element.type === 'image' ? t('contractBuilder.elements.imageLogo') :
             element.type === 'rectangle' ? t('contractBuilder.elements.rectangle') :
             element.type === 'circle' ? t('contractBuilder.elements.circle') :
             element.type === 'triangle' ? t('contractBuilder.elements.triangle') :
             element.type === 'semicircle' ? t('contractBuilder.elements.semicircle') :
             element.type === 'arrow' ? 'Arrow' :
             element.type === 'divider' ? t('contractBuilder.elements.divider') : element.type}
          </p>
        </div>

        {/* ==================== REQUIRED FIELD SETTING ==================== */}
        {(element.type === 'text' || element.type === 'checkbox' || element.type === 'signature') && (
          <div className="flex items-center gap-2 bg-surface-hover border border-border rounded-xl p-3 mb-4">
            <input
              type="checkbox"
              id={`required-${element.id}`}
              checked={element.required}
              onChange={(e) => updateElement(element.id, 'required', e.target.checked)}
              className="primary-check"
            />
            <label htmlFor={`required-${element.id}`} className="text-sm font-medium text-content-primary">
              {t("contractBuilder.properties.requiredField")}
              <span className="text-primary ml-1">*</span>
            </label>
          </div>
        )}

{/* ==================== POSITION SECTION ==================== */}
<div className="border-t-2 border-border pt-4 mt-4">
  <button
    onClick={() => toggleSection('position')}
    className="w-full flex items-center justify-between py-3 px-3 hover:bg-primary/10 rounded-xl transition-colors bg-gradient-to-r from-primary/10 to-transparent"
  >
    <div className="flex items-center gap-2 flex-1">
      <MoveIcon size={18} className="text-primary" />
      <h4 className="text-sm font-bold text-content-primary uppercase tracking-wide m-0 p-0 leading-relaxed"> {/* m-0 p-0 und leading-relaxed */}
        {t("contractBuilder.properties.position")}
      </h4>
    </div>
    <ChevronRightIcon 
      size={16} 
      className={`text-content-secondary transition-transform ${expandedSections.position ? 'rotate-90' : ''}`}
    />
  </button>

  {expandedSections.position && (
    <div className="mt-3 pb-3 px-2 space-y-4 bg-surface-hover rounded-xl p-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-content-secondary">{t("contractBuilder.properties.xPosition")}</label>
          <span className="text-xs font-medium text-content-primary">{Math.round(element.x)}px</span>
        </div>
        <input
          type="range"
          min="0"
          max={CONTENT_WIDTH_PX}
          step="1"
          value={Math.round(element.x)}
          onChange={(e) => updateElement(element.id, 'x', parseInt(e.target.value) || 0)}
          className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
          className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-content-secondary">{t("contractBuilder.properties.yPosition")}</label>
          <span className="text-xs font-medium text-content-primary">{Math.round(element.y)}px</span>
        </div>
        <input
          type="range"
          min="0"
          max={CONTENT_HEIGHT_PX}
          step="1"
          value={Math.round(element.y)}
          onChange={(e) => updateElement(element.id, 'y', parseInt(e.target.value) || 0)}
          className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
          className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
        />
      </div>

      {/* Rotation - nur für dekorative Elemente und Bilder */}
      {['rectangle', 'circle', 'triangle', 'semicircle', 'arrow', 'divider', 'image'].includes(element.type) && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-content-secondary">
              {t("contractBuilder.properties.rotation")}
            </label>
            <span className="text-xs font-medium text-content-primary">{element.rotation || 0}</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={Math.round(element.rotation || 0)}
            onChange={(e) => updateElement(element.id, 'rotation', parseInt(e.target.value))}
            className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
            className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
          />
        </div>
      )}
    </div>
  )}
</div>

{/* ==================== SIZE SECTION ==================== */}
<div className="border-t-2 border-border pt-4 mt-4">
  <button
    onClick={() => toggleSection('size')}
    className="w-full flex items-center justify-between py-3 px-3 hover:bg-primary/10 rounded-xl transition-colors bg-gradient-to-r from-primary/10 to-transparent"
  >
    <div className="flex items-center gap-2 flex-1">
      <MaximizeIcon size={18} className="text-primary" />
      <h4 className="text-sm font-bold text-content-primary uppercase tracking-wide m-0 p-0 leading-relaxed">
        {t("contractBuilder.properties.size")}
      </h4>
    </div>
    <ChevronRightIcon 
      size={16} 
      className={`text-content-secondary transition-transform ${expandedSections.size ? 'rotate-90' : ''}`}
    />
  </button>

  {expandedSections.size && (
    <div className="mt-3 pb-3 px-2 space-y-4 bg-surface-hover rounded-xl p-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-content-secondary">{t("contractBuilder.properties.width")}</label>
          <span className="text-xs font-medium text-content-primary">{Math.round(element.width)}px</span>
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
          className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
          className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
        />
      </div>

      {element.height !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-content-secondary">{t("contractBuilder.properties.height")}</label>
            <span className="text-xs font-medium text-content-primary">{Math.round(element.height)}px</span>
          </div>
          <input
            type="range"
            min="2"
            max={element.type === 'divider' ? 10 : CONTENT_HEIGHT_PX}
            step="1"
            value={Math.round(element.height)}
            onChange={(e) => updateElement(element.id, 'height', parseInt(e.target.value) || 20)}
            className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
            className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
          />
        </div>
      )}
    </div>
  )}
</div>

{/* ==================== CONTENT SECTION ==================== */}
<div className="border-t-2 border-border pt-4 mt-4">
  <button
    onClick={() => toggleSection('content')}
    className="w-full flex items-center justify-between py-3 px-3 hover:bg-primary/10 rounded-xl transition-colors bg-gradient-to-r from-primary/10 to-transparent"
  >
    <div className="flex items-center gap-2 flex-1">
      <FileTextIcon size={18} className="text-primary" />
      <h4 className="text-sm font-bold text-content-primary uppercase tracking-wide m-0 p-0 leading-relaxed">
        {t("contractBuilder.properties.content")}
      </h4>
    </div>
    <ChevronRightIcon 
      size={16} 
      className={`text-content-secondary transition-transform ${expandedSections.content ? 'rotate-90' : ''}`}
    />
  </button>

  {expandedSections.content && (
    <div className="mt-3 pb-3 px-2 space-y-4 bg-surface-hover rounded-xl p-3">
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
              className="primary-check"
            />
            <label htmlFor={`show-title-${element.id}`} className="text-sm font-medium text-content-primary">
              {t("contractBuilder.properties.showTitle")}
            </label>
          </div>

          {/* Title Section - nur wenn showTitle aktiviert */}
          {element.showTitle !== false && (
            <div className="space-y-3 border-l-2 border-primary/30 pl-3">
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.title")}</label>
                <input
                  type="text"
                  value={element.label || ''}
                  onChange={(e) => updateElement(element.id, 'label', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                  placeholder={element.type === 'text' ? t('contractBuilder.elements.variableFieldInput') : t('contractBuilder.elements.variableFieldSystem')}
                />
              </div>

              {/* Title Font Family */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.titleFontFamily")}</label>
                <select
                  value={element.labelFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'labelFontFamily', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                  <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.titleFontSize")}</label>
                  <span className="text-xs font-medium text-content-secondary">{element.labelFontSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  step="1"
                  value={element.labelFontSize || 14}
                  onChange={(e) => updateElement(element.id, 'labelFontSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
                />
              </div>

              {/* Title Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.titleFormatting")}</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'labelBold', !element.labelBold)}
                    className={`p-2 rounded-xl ${element.labelBold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.bold")}
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'labelItalic', !element.labelItalic)}
                    className={`p-2 rounded-xl ${element.labelItalic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.italic")}
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'labelUnderline', !element.labelUnderline)}
                    className={`p-2 rounded-xl ${element.labelUnderline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.underline")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'labelCapsLock', !element.labelCapsLock)}
                    className={`p-2 rounded-xl ${element.labelCapsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.uppercase")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title Color */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.titleColor")}</label>
                <button
                  type="button"
                  onClick={() => setColorPickerConfig({ isOpen: true, property: 'labelColor', currentColor: element.labelColor || '#111827', title: t('contractBuilder.properties.titleColor') })}
                  className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.labelColor || '#111827' }} />
                  <span className="text-content-primary">{element.labelColor || '#111827'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Variable Section - immer sichtbar, ORANGER RAND */}
          <div className="space-y-3 border-l-2 border-primary/30 pl-3 border-t pt-4">
            {/* Variable Dropdown - gelbe Box */}
            <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-4">
              <label className="block text-sm font-bold text-content-primary mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 a1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t("contractBuilder.properties.linkVariable")}
              </label>
              <select
                value={element.variable || ''}
                onChange={(e) => updateElement(element.id, 'variable', e.target.value)}
                className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border-2 border-primary focus:border-primary transition-colors font-medium"
              >
                <option value="" className="text-content-primary">{t("contractBuilder.properties.noVariable")}</option>
                {availableVariables.map(variable => (
                  <option 
                    key={variable} 
                    value={variable} 
                    className="text-content-primary"
                  >
                    {t(VARIABLE_TRANSLATION_KEYS[variable]) || variable}
                  </option>
                ))}
              </select>
              <p className="text-xs text-content-muted mt-2 font-medium">
                {t("contractBuilder.properties.variableImportant")}
              </p>
            </div>

            {/* Variable Font Family */}
            <div>
              <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.variableInputFontFamily")}</label>
              <select
                value={element.inputFontFamily || 'Arial, sans-serif'}
                onChange={(e) => updateElement(element.id, 'inputFontFamily', e.target.value)}
                className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.variableInputFontSize")}</label>
                <span className="text-xs font-medium text-content-secondary">{element.inputFontSize || 14}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                step="1"
                value={element.inputFontSize || 14}
                onChange={(e) => updateElement(element.id, 'inputFontSize', parseInt(e.target.value) || 14)}
                className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
              />
            </div>

            {/* Variable Formatting Buttons */}
            <div>
              <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.variableInputFormatting")}</label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => updateElement(element.id, 'inputBold', !element.inputBold)}
                  className={`p-2 rounded-xl ${element.inputBold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                  title={t("contractBuilder.properties.bold")}
                >
                  <BoldIcon size={16} />
                </button>
                <button
                  onClick={() => updateElement(element.id, 'inputItalic', !element.inputItalic)}
                  className={`p-2 rounded-xl ${element.inputItalic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                  title={t("contractBuilder.properties.italic")}
                >
                  <ItalicIcon size={16} />
                </button>
                <button
                  onClick={() => updateElement(element.id, 'inputUnderline', !element.inputUnderline)}
                  className={`p-2 rounded-xl ${element.inputUnderline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                  title={t("contractBuilder.properties.underline")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                    <line x1="4" y1="21" x2="20" y2="21" />
                  </svg>
                </button>
                <button
                  onClick={() => updateElement(element.id, 'inputCapsLock', !element.inputCapsLock)}
                  className={`p-2 rounded-xl ${element.inputCapsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                  title={t("contractBuilder.properties.uppercase")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Variable Color */}
            <div>
              <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.variableInputColor")}</label>
              <button
                type="button"
                onClick={() => setColorPickerConfig({ isOpen: true, property: 'inputColor', currentColor: element.inputColor || '#374151', title: t('contractBuilder.properties.variableInputColor') })}
                className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
              >
                <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.inputColor || '#374151' }} />
                <span className="text-content-primary">{element.inputColor || '#374151'}</span>
              </button>
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
              className="primary-check"
            />
            <label htmlFor={`show-title-${element.id}`} className="text-sm font-medium text-content-primary">
              {t("contractBuilder.properties.showTitle")}
            </label>
          </div>

          {/* Title Section - nur wenn showTitle aktiviert */}
          {element.showTitle !== false && (
            <div className="space-y-3 border-l-2 border-primary/30 pl-3">
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.checkboxTitle")}</label>
                <input
                  type="text"
                  value={element.label || ''}
                  onChange={(e) => updateElement(element.id, 'label', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                  placeholder={t("contractBuilder.placeholders.checkboxTitle")}
                />
              </div>

              {/* Title Font Family */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.titleFontFamily")}</label>
                <select
                  value={element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'checkboxTitleFontFamily', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                  <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.titleFontSize")}</label>
                  <span className="text-xs font-medium text-content-secondary">{element.checkboxTitleSize || 16}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="1"
                  value={element.checkboxTitleSize || 16}
                  onChange={(e) => updateElement(element.id, 'checkboxTitleSize', parseInt(e.target.value) || 16)}
                  className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
                />
              </div>

              {/* Title Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.titleFormatting")}</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'titleBold', !element.titleBold)}
                    className={`p-2 rounded-xl ${element.titleBold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.bold")}
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'titleItalic', !element.titleItalic)}
                    className={`p-2 rounded-xl ${element.titleItalic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.italic")}
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'titleUnderline', !element.titleUnderline)}
                    className={`p-2 rounded-xl ${element.titleUnderline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.underline")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'titleCapsLock', !element.titleCapsLock)}
                    className={`p-2 rounded-xl ${element.titleCapsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.uppercase")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title Color */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.titleColor")}</label>
                <button
                  type="button"
                  onClick={() => setColorPickerConfig({ isOpen: true, property: 'titleColor', currentColor: element.titleColor || '#000000', title: t('contractBuilder.properties.titleColor') })}
                  className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.titleColor || '#000000' }} />
                  <span className="text-content-primary">{element.titleColor || '#000000'}</span>
                </button>
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
              className="primary-check"
            />
            <label htmlFor={`show-description-${element.id}`} className="text-sm font-medium text-content-primary">
              {t("contractBuilder.properties.showDescription")}
            </label>
          </div>

          {/* Description Section - nur wenn showDescription aktiviert */}
          {element.showDescription !== false && (
            <div className="space-y-3 border-l-2 border-primary/30 pl-3">
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.checkboxDescription")}</label>
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
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors resize-none overflow-hidden"
                  rows="3"
                  placeholder={t("contractBuilder.placeholders.description")}
                  style={{ whiteSpace: 'pre-wrap', minHeight: '72px' }}
                />
              </div>

              {/* Description Font Family */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.descFontFamily")}</label>
                <select
                  value={element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'checkboxDescriptionFontFamily', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                  <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.descFontSize")}</label>
                  <span className="text-xs font-medium text-content-secondary">{element.checkboxDescriptionSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={element.checkboxDescriptionSize || 14}
                  onChange={(e) => updateElement(element.id, 'checkboxDescriptionSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
                />
              </div>

              {/* Description Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.descFormatting")}</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'descriptionBold', !element.descriptionBold)}
                    className={`p-2 rounded-xl ${element.descriptionBold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.bold")}
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'descriptionItalic', !element.descriptionItalic)}
                    className={`p-2 rounded-xl ${element.descriptionItalic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.italic")}
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'descriptionUnderline', !element.descriptionUnderline)}
                    className={`p-2 rounded-xl ${element.descriptionUnderline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.underline")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'descriptionCapsLock', !element.descriptionCapsLock)}
                    className={`p-2 rounded-xl ${element.descriptionCapsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.uppercase")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description Color */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.descColor")}</label>
                <button
                  type="button"
                  onClick={() => setColorPickerConfig({ isOpen: true, property: 'descriptionColor', currentColor: element.descriptionColor || '#374151', title: t('contractBuilder.properties.descColor') })}
                  className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.descriptionColor || '#374151' }} />
                  <span className="text-content-primary">{element.descriptionColor || '#374151'}</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* HEADING/SUBHEADING/TEXTAREA CONTENT */}
      {(element.type === 'heading' || element.type === 'subheading' || element.type === 'textarea') && (
        <>
          <div>
            <label className="text-sm text-content-secondary block mb-2">
              {element.type === 'heading' ? t('contractBuilder.elements.heading') : 
               element.type === 'subheading' ? t('contractBuilder.elements.subheading') : t('contractBuilder.properties.content')}
            </label>
            {element.type === 'textarea' ? (
              <textarea
                value={element.content || ''}
                onChange={(e) => updateElement(element.id, 'content', e.target.value)}
                className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                rows="4"
                placeholder={element.type === 'textarea' ? t('contractBuilder.placeholders.paragraph') : ''}
              />
            ) : (
              <input
                type="text"
                value={element.content || ''}
                onChange={(e) => updateElement(element.id, 'content', e.target.value)}
                className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                placeholder={element.type === 'heading' ? t('contractBuilder.placeholders.heading') : t('contractBuilder.placeholders.subheading')}
              />
            )}
          </div>

          <div>
            <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.fontFamily")}</label>
            <select
              value={element.fontFamily || 'Arial, sans-serif'}
              onChange={(e) => updateElement(element.id, 'fontFamily', e.target.value)}
              className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.fontColor")}</label>
            <button
              type="button"
              onClick={() => setColorPickerConfig({ isOpen: true, property: 'color', currentColor: element.color || '#000000', title: t('contractBuilder.properties.fontColor') })}
              className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
            >
              <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.color || '#000000' }} />
              <span className="text-content-primary">{element.color || '#000000'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.fontSize")}</label>
              <span className="text-xs font-medium text-content-secondary">
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
              className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => updateElement(element.id, 'bold', !element.bold)}
              className={`p-2 rounded-xl ${element.bold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
              title={t("contractBuilder.properties.bold")}
            >
              <BoldIcon size={16} />
            </button>
            <button
              onClick={() => updateElement(element.id, 'italic', !element.italic)}
              className={`p-2 rounded-xl ${element.italic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
              title={t("contractBuilder.properties.italic")}
            >
              <ItalicIcon size={16} />
            </button>
            <button
              onClick={() => updateElement(element.id, 'underline', !element.underline)}
              className={`p-2 rounded-xl ${element.underline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
              title={t("contractBuilder.properties.underline")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                <line x1="4" y1="21" x2="20" y2="21" />
              </svg>
            </button>
            <button
              onClick={() => updateElement(element.id, 'capsLock', !element.capsLock)}
              className={`p-2 rounded-xl ${element.capsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
              title={t("contractBuilder.properties.uppercase")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
              </svg>
            </button>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.alignment")}</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateElement(element.id, 'alignment', 'left')}
                className={`p-2 rounded-xl ${element.alignment === 'left' || !element.alignment ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                title={t("contractBuilder.properties.alignLeft")}
              >
                <AlignLeftIcon size={16} />
              </button>
              <button
                onClick={() => updateElement(element.id, 'alignment', 'center')}
                className={`p-2 rounded-xl ${element.alignment === 'center' ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                title={t("contractBuilder.properties.alignCenter")}
              >
                <AlignCenterIcon size={16} />
              </button>
              <button
                onClick={() => updateElement(element.id, 'alignment', 'right')}
                className={`p-2 rounded-xl ${element.alignment === 'right' ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                title="right-aligned"
              >
                <AlignRightIcon size={16} />
              </button>
            </div>
          </div>

          {element.type === 'textarea' && (
            <>
              <div className="pt-4">
                <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.listFormat")}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateElement(element.id, 'listStyle', 'none')}
                    className={`p-2 rounded-xl ${element.listStyle === 'none' || !element.listStyle ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.noList")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'listStyle', 'bullet')}
                    className={`p-2 rounded-xl ${element.listStyle === 'bullet' ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.bullets")}
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
                    className={`p-2 rounded-xl ${element.listStyle === 'number' ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.numberedList")}
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
                <div className="mt-2 text-xs text-content-muted">
                  {t("contractBuilder.properties.tipListBreaks")}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.lineSpacing")}</label>
                  <span className="text-xs font-medium text-content-secondary">{element.lineHeight || 1.5}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={element.lineHeight || 1.5}
                  onChange={(e) => updateElement(element.id, 'lineHeight', parseFloat(e.target.value))}
                  className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-content-muted mt-1">
                  <span>{t("contractBuilder.properties.tight")}</span>
                  <span>{t("contractBuilder.properties.normal")}</span>
                  <span>{t("contractBuilder.properties.wide")}</span>
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
            <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.uploadImage")}</label>
            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg"
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
                className="flex items-center justify-between w-full px-4 py-2.5 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-content-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {element.fileName ? (
                    <span className="text-sm text-content-secondary font-medium truncate">{element.fileName}</span>
                  ) : (
                    <span className="text-sm text-content-muted">{t("contractBuilder.properties.selectFile")}</span>
                  )}
                </div>
                <span className="text-xs text-primary font-medium ml-2 flex-shrink-0">{t("contractBuilder.properties.browse")}</span>
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/>
                    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>
                  </svg>
                  {t("contractBuilder.properties.cropImage")}
                </button>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center gap-2 p-3 bg-surface-hover rounded-xl border border-border">
                  <input
                    type="checkbox"
                    id={`maintain-aspect-ratio-${element.id}`}
                    checked={element.maintainAspectRatio !== false}
                    onChange={(e) => updateElement(element.id, 'maintainAspectRatio', e.target.checked)}
                    className="primary-check"
                  />
                  <label htmlFor={`maintain-aspect-ratio-${element.id}`} className="text-sm font-medium text-content-primary cursor-pointer flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M9 9l6 6M15 9l-6 6"/>
                    </svg>
                    {t("contractBuilder.properties.lockAspectRatio")}
                  </label>
                </div>
                <p className="text-xs text-content-muted mt-2">
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
            <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.lineColor")}</label>
            <button
              type="button"
              onClick={() => setColorPickerConfig({ isOpen: true, property: 'lineColor', currentColor: element.lineColor || '#000000', title: t('contractBuilder.properties.lineColor') })}
              className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
            >
              <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.lineColor || '#000000' }} />
              <span className="text-content-primary">{element.lineColor || '#000000'}</span>
            </button>
            <div className="mt-4">
              <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.lineStyle")}</label>
              <select
                value={element.lineStyle || 'solid'}
                onChange={(e) => updateElement(element.id, 'lineStyle', e.target.value)}
                className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
              >
                <option value="solid">{t("contractBuilder.properties.solid")}</option>
                <option value="dashed">{t("contractBuilder.properties.dashed")}</option>
                <option value="dotted">{t("contractBuilder.properties.dotted")}</option>
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
              className="primary-check"
            />
            <label htmlFor={`show-location-date-${element.id}`} className="text-sm font-medium text-content-primary">
              {t("contractBuilder.properties.showLocationDate")}
            </label>
          </div>

          {/* Location & Date Section - nur wenn showLocationDate aktiviert */}
          {element.showLocationDate !== false && (
            <div className="space-y-3 border-l-2 border-primary/30 pl-3">
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.location")}</label>
                <input
                  type="text"
                  value={element.location || ''}
                  onChange={(e) => updateElement(element.id, 'location', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                  className="primary-check"
                />
                <label htmlFor={`show-date-${element.id}`} className="text-sm font-medium text-content-primary">
                  {t("contractBuilder.properties.showDate")}
                </label>
              </div>

              {/* Date Format - nur wenn showDate aktiviert */}
              {element.showDate !== false && (
                <div>
                  <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.dateFormat")}</label>
                  <select
                    value={element.dateFormat || 'de-DE'}
                    onChange={(e) => updateElement(element.id, 'dateFormat', e.target.value)}
                    className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                <label className="text-sm text-content-secondary block mb-2">Location & Date {t("contractBuilder.properties.fontFamily")}</label>
                <select
                  value={element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'locationFontFamily', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                  <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.locDateFontSize")}</label>
                  <span className="text-xs font-medium text-content-secondary">{element.signatureFontSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={element.signatureFontSize || 14}
                  onChange={(e) => updateElement(element.id, 'signatureFontSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
                />
              </div>

              {/* Location Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.locDateFormatting")}</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'locationBold', !element.locationBold)}
                    className={`p-2 rounded-xl ${element.locationBold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.bold")}
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'locationItalic', !element.locationItalic)}
                    className={`p-2 rounded-xl ${element.locationItalic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.italic")}
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'locationUnderline', !element.locationUnderline)}
                    className={`p-2 rounded-xl ${element.locationUnderline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.underline")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'locationCapsLock', !element.locationCapsLock)}
                    className={`p-2 rounded-xl ${element.locationCapsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.uppercase")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Location Color */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.locDateColor")}</label>
                <button
                  type="button"
                  onClick={() => setColorPickerConfig({ isOpen: true, property: 'locationColor', currentColor: element.locationColor || '#374151', title: t('contractBuilder.properties.locDateColor') })}
                  className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.locationColor || '#374151' }} />
                  <span className="text-content-primary">{element.locationColor || '#374151'}</span>
                </button>
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
              className="primary-check"
            />
            <label htmlFor={`show-below-signature-${element.id}`} className="text-sm font-medium text-content-primary">
              {t("contractBuilder.properties.showBelowSignature")}
            </label>
          </div>

          {/* Below Signature Text Section - nur wenn showBelowSignature aktiviert */}
          {element.showBelowSignature !== false && (
            <div className="space-y-3 border-l-2 border-primary/30 pl-3">
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.belowSignatureText")}</label>
                <input
                  type="text"
                  value={element.belowSignatureText || ''}
                  onChange={(e) => updateElement(element.id, 'belowSignatureText', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                  placeholder="e.g. Location, Date/Signature"
                />
              </div>

              {/* Below Text Font Family */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">Below Text {t("contractBuilder.properties.fontFamily")}</label>
                <select
                  value={element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, 'belowTextFontFamily', e.target.value)}
                  className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
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
                  <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.belowTextFontSize")}</label>
                  <span className="text-xs font-medium text-content-secondary">{element.belowTextFontSize || 14}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={element.belowTextFontSize || 14}
                  onChange={(e) => updateElement(element.id, 'belowTextFontSize', parseInt(e.target.value) || 14)}
                  className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
                />
              </div>

              {/* Below Text Formatting Buttons */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">{t("contractBuilder.properties.belowTextFormatting")}</label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => updateElement(element.id, 'belowTextBold', !element.belowTextBold)}
                    className={`p-2 rounded-xl ${element.belowTextBold ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.bold")}
                  >
                    <BoldIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'belowTextItalic', !element.belowTextItalic)}
                    className={`p-2 rounded-xl ${element.belowTextItalic ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.italic")}
                  >
                    <ItalicIcon size={16} />
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'belowTextUnderline', !element.belowTextUnderline)}
                    className={`p-2 rounded-xl ${element.belowTextUnderline ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.underline")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                      <line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateElement(element.id, 'belowTextCapsLock', !element.belowTextCapsLock)}
                    className={`p-2 rounded-xl ${element.belowTextCapsLock ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-content-secondary'}`}
                    title={t("contractBuilder.properties.uppercase")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M6 13l6-8 6 8M8 13h8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Below Text Color */}
              <div>
                <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.belowTextColor")}</label>
                <button
                  type="button"
                  onClick={() => setColorPickerConfig({ isOpen: true, property: 'belowTextColor', currentColor: element.belowTextColor || '#374151', title: t('contractBuilder.properties.belowTextColor') })}
                  className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.belowTextColor || '#374151' }} />
                  <span className="text-content-primary">{element.belowTextColor || '#374151'}</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* DECORATIVE ELEMENTS (rectangle, circle, triangle, semicircle, arrow) */}
      {['rectangle', 'circle', 'triangle', 'semicircle', 'arrow'].includes(element.type) && (
        <>
          <div>
            <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.backgroundColor")}</label>
            <button
              type="button"
              onClick={() => setColorPickerConfig({ isOpen: true, property: 'backgroundColor', currentColor: element.backgroundColor || '#f3f4f6', title: t('contractBuilder.properties.backgroundColor') })}
              className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
            >
              <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.backgroundColor || '#f3f4f6' }} />
              <span className="text-content-primary">{element.backgroundColor || '#f3f4f6'}</span>
            </button>
          </div>

          <div>
            <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.borderColor")}</label>
            <button
              type="button"
              onClick={() => setColorPickerConfig({ isOpen: true, property: 'borderColor', currentColor: element.borderColor || '#000000', title: t('contractBuilder.properties.borderColor') })}
              className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
            >
              <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: element.borderColor || '#000000' }} />
              <span className="text-content-primary">{element.borderColor || '#000000'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.borderWidth")}</label>
              <span className="text-xs font-medium text-content-secondary">{element.borderWidth ?? 2}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={element.borderWidth ?? 2}
              onChange={(e) => updateElement(element.id, 'borderWidth', safeParseInt(e.target.value, element.borderWidth ?? 2))}
              className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
              className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
            />
          </div>
          
          <div className="mt-4">
            <label className="text-sm text-content-secondary block mb-2">{t("contractBuilder.properties.borderStyle")}</label>
            <select
              value={element.lineStyle || 'solid'}
              onChange={(e) => updateElement(element.id, 'lineStyle', e.target.value)}
              className="w-full bg-surface-dark rounded-xl px-4 py-2 text-sm text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
            >
              <option value="solid">{t("contractBuilder.properties.solid")}</option>
              <option value="dashed">{t("contractBuilder.properties.dashed")}</option>
              <option value="dotted">{t("contractBuilder.properties.dotted")}</option>
            </select>
          </div>

          {/* Border Radius - ONLY for Rectangle */}
          {element.type === 'rectangle' && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-content-primary">{t("contractBuilder.properties.borderRadius")}</label>
                <span className="text-xs font-medium text-content-secondary">{element.borderRadius || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={element.borderRadius || 0}
                onChange={(e) => updateElement(element.id, 'borderRadius', safeParseInt(e.target.value, element.borderRadius || 0))}
                className="w-full h-2 bg-surface-button-hover rounded-xl appearance-none cursor-pointer"
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
                className="w-full bg-surface-dark rounded-xl px-2 py-1 text-sm text-content-primary mt-1 outline-none border border-transparent focus:border-primary transition-colors"
              />
              <div className="flex justify-between text-xs text-content-muted mt-1">
                <span>{t("contractBuilder.properties.sharp")}</span>
                <span>{t("contractBuilder.properties.rounded")}</span>
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
              className="text-sm text-primary hover:text-primary flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-xl"
              title={t("contractBuilder.folders.createFolder")}
              disabled={isPdfPage}
            >
              <FolderPlusIcon size={14} />
              {t("contractBuilder.modals.createFolder")}
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={removeAllElements}
              className="text-sm text-content-muted hover:text-content-primary flex items-center gap-1 px-2 py-1 bg-surface-hover rounded-xl"
              title={t("contractBuilder.properties.deleteAll")}
              disabled={isPdfPage}
            >
              <TrashIcon size={14} />
            </button>
          </div>
        </div>

        {allItems.length === 0 ? (
          <div className="text-center py-8 text-content-muted">
            <LayersIcon size={32} className="mx-auto mb-2 text-content-faint" />
            <p className="text-sm">{t("contractBuilder.properties.noElementsOrFolders")}</p>
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
                    className={`border-2 rounded-xl relative transition-all ${
                      selectedFolder === folder.id 
                        ? 'border-primary shadow-md' 
                        : 'border-border shadow-sm'
                    } ${
                      dragOverElementIndex === item.index ? 'ring-2 ring-primary' : ''
                    } ${isPdfPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      background: selectedFolder === folder.id 
                        ? `linear-gradient(135deg, ${folder.color}15 0%, ${folder.color}08 100%)`
                        : `linear-gradient(135deg, ${folder.color}10 0%, ${folder.color}05 100%)`
                    }}
                  >
                    <div 
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        !isPdfPage ? 'cursor-pointer hover:bg-surface-hover' : 'cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (!isPdfPage) {
                          setSelectedFolder(folder.id);
                          setSelectedElement(null);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <GripVerticalIcon size={16} className="text-content-muted flex-shrink-0" />
                        <div 
                          className="p-2 rounded-xl"
                          style={{ 
                            backgroundColor: `${folder.color}20`,
                            border: `1px solid ${folder.color}40`
                          }}
                        >
                          <FolderIcon size={16} style={{ color: folder.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-content-primary">{folder.name}</div>
                          <div className="text-xs text-content-muted">{folder.elementIds.length} Element(s)</div>
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
                          className="text-content-muted hover:text-primary p-1 rounded hover:bg-surface-hover"
                          title={t("contractBuilder.folders.editFolder")}
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
                          className="text-content-muted hover:text-content-primary p-1 rounded hover:bg-surface-hover"
                          title={t("contractBuilder.folders.deleteFolder")}
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
                          className="text-content-muted hover:text-content-secondary p-1"
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
                    className={`ml-8 flex items-center justify-between p-3 border rounded-xl cursor-move transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-surface-hover'
                    } ${
                      dragOverElementIndex === item.index ? 'ring-2 ring-primary' : ''
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
                      <GripVerticalIcon size={16} className="text-content-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          {element.type === 'text' && <TextIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'system-text' && <DatabaseIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'textarea' && <FileTextIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'checkbox' && <CheckSquareIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'heading' && <TypeIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'subheading' && <TypeIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'signature' && <SignatureIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'image' && <ImageIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'divider' && <MinusIcon size={14} className="text-content-muted flex-shrink-0" />}
                          {element.type === 'rectangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted flex-shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                          {element.type === 'circle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted flex-shrink-0"><circle cx="12" cy="12" r="9"/></svg>}
                          {element.type === 'triangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted flex-shrink-0"><path d="M12 2 L22 20 L2 20 Z"/></svg>}
                          {element.type === 'semicircle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted flex-shrink-0"><path d="M3 12 A9 9 0 0 1 21 12 Z"/></svg>}
                          {element.type === 'arrow' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                          <span className="font-medium text-sm text-content-primary truncate min-w-0">
                            {element.type === 'text' ? t('contractBuilder.elements.variableFieldInput') :
                             element.type === 'system-text' ? t('contractBuilder.elements.variableFieldSystem') :
                             element.type === 'textarea' ? t('contractBuilder.elements.paragraph') :
                             element.type === 'checkbox' ? t('contractBuilder.elements.checkbox') :
                             element.type === 'heading' ? t('contractBuilder.elements.heading') :
                             element.type === 'subheading' ? t('contractBuilder.elements.subheading') :
                             element.type === 'signature' ? t('contractBuilder.elements.signature') :
                             element.type === 'image' ? t('contractBuilder.elements.imageLogo') :
                             element.type === 'rectangle' ? t('contractBuilder.elements.rectangle') :
                             element.type === 'circle' ? t('contractBuilder.elements.circle') :
                             element.type === 'triangle' ? t('contractBuilder.elements.triangle') :
                             element.type === 'semicircle' ? t('contractBuilder.elements.semicircle') :
                             element.type === 'arrow' ? t('contractBuilder.elements.arrow') :
                             element.type === 'divider' ? t('contractBuilder.elements.divider') : element.type}
                          </span>
                          {element.required && element.type !== 'system-text' && (
                            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded flex-shrink-0">
                              *
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-content-secondary mt-1 truncate">
                          {element.label || element.content || `Position: ${element.x}px, ${element.y}px`}
                        </div>
                        {element.variable && (
                          <div className="text-xs mt-1 flex items-center gap-2 min-w-0">
                            <span className="text-content-muted flex-shrink-0">{t("contractBuilder.properties.variable")}</span>
                            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium truncate" title={t(VARIABLE_TRANSLATION_KEYS[element.variable]) || element.variable}>
                              {t(VARIABLE_TRANSLATION_KEYS[element.variable]) || element.variable}
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
                        className="text-content-muted hover:text-primary p-1"
                        title={t("contractBuilder.folders.removeFromFolder")}
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
                        className="text-content-muted hover:text-content-primary p-1"
                        title={t("contractBuilder.properties.delete")}
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
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-move transition-all ${
                      selectedElement === element.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-surface-hover'
                    } ${
                      dragOverElementIndex === item.index ? 'ring-2 ring-primary' : ''
                    } ${isPdfPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!isPdfPage) {
                        setSelectedElement(element.id);
                        setSelectedFolder(null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <GripVerticalIcon size={16} className="text-content-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {element.type === 'text' && <TextIcon size={14} className="text-content-muted" />}
                          {element.type === 'system-text' && <DatabaseIcon size={14} className="text-content-muted" />}
                          {element.type === 'textarea' && <FileTextIcon size={14} className="text-content-muted" />}
                          {element.type === 'checkbox' && <CheckSquareIcon size={14} className="text-content-muted" />}
                          {element.type === 'heading' && <TypeIcon size={14} className="text-content-muted" />}
                          {element.type === 'subheading' && <TypeIcon size={14} className="text-content-muted" />}
                          {element.type === 'signature' && <SignatureIcon size={14} className="text-content-muted" />}
                          {element.type === 'image' && <ImageIcon size={14} className="text-content-muted" />}
                          {element.type === 'divider' && <MinusIcon size={14} className="text-content-muted" />}
                          {element.type === 'rectangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
                          {element.type === 'circle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted"><circle cx="12" cy="12" r="9"/></svg>}
                          {element.type === 'triangle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted"><path d="M12 2 L22 20 L2 20 Z"/></svg>}
                          {element.type === 'semicircle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted"><path d="M3 12 A9 9 0 0 1 21 12 Z"/></svg>}
                          {element.type === 'arrow' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-content-muted"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                          <span className="font-medium text-sm text-content-primary truncate">
                            {element.type === 'text' ? t('contractBuilder.elements.variableFieldInput') :
                             element.type === 'system-text' ? t('contractBuilder.elements.variableFieldSystem') :
                             element.type === 'textarea' ? t('contractBuilder.elements.paragraph') :
                             element.type === 'checkbox' ? t('contractBuilder.elements.checkbox') :
                             element.type === 'heading' ? t('contractBuilder.elements.heading') :
                             element.type === 'subheading' ? t('contractBuilder.elements.subheading') :
                             element.type === 'signature' ? t('contractBuilder.elements.signature') :
                             element.type === 'image' ? t('contractBuilder.elements.imageLogo') :
                             element.type === 'rectangle' ? t('contractBuilder.elements.rectangle') :
                             element.type === 'circle' ? t('contractBuilder.elements.circle') :
                             element.type === 'triangle' ? t('contractBuilder.elements.triangle') :
                             element.type === 'semicircle' ? t('contractBuilder.elements.semicircle') :
                             element.type === 'arrow' ? t('contractBuilder.elements.arrow') :
                             element.type === 'divider' ? t('contractBuilder.elements.divider') : element.type}
                          </span>
                          {element.required && element.type !== 'system-text' && (
                            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded flex-shrink-0">
                              *
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-content-secondary mt-1">
                          {element.label || element.content || `Position: ${element.x}px, ${element.y}px`}
                        </div>
                        {element.variable && (
                          <div className="text-xs mt-1 flex items-center gap-2">
                            <span className="text-content-muted">{t("contractBuilder.properties.variable")}</span>
                            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium" title={t(VARIABLE_TRANSLATION_KEYS[element.variable]) || element.variable}>
                              {t(VARIABLE_TRANSLATION_KEYS[element.variable]) || element.variable}
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
                        className="text-content-muted hover:text-content-primary p-1"
                        title={t("contractBuilder.properties.delete")}
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
        
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary">
          <strong>{t("contractBuilder.tip")}</strong> {t("contractBuilder.tipDragElements")}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{rangeInputStyles}</style>
      <div className="hidden lg:flex flex-col w-80 properties-panel">
        <div className="bg-surface-card border-l border-border overflow-hidden shadow-sm flex flex-col h-full relative">
          {/* PDF-Seite Overlay gesamtes Panel */}
          {isPdfPage && (
            <div className="absolute inset-0 bg-surface-card bg-opacity-95 z-50 flex items-center justify-center">
              <div className="text-center p-4">
                <FileIcon size={48} className="mx-auto mb-3 text-content-faint" />
                <p className="text-white font-medium mb-1">{t("contractBuilder.properties.pdfSelected")}</p>
                <p className="text-content-faint text-sm">{t("contractBuilder.properties.pdfReadonly")}</p>
              </div>
            </div>
          )}
          
          <div className="border-b border-border">
            <div className="flex">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'properties' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-content-muted hover:text-content-secondary'
                }`}
                onClick={() => setActiveTab('properties')}
              >
                <SettingsIcon size={16} />
                {t("contractBuilder.properties.settings")}
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'content' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-content-muted hover:text-content-secondary'
                }`}
                onClick={() => setActiveTab('content')}
              >
                <LayersIcon size={16} />
                {t("contractBuilder.properties.layers")}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto properties-panel-scroll" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
            {activeTab === 'properties' ? renderPropertyPanel() : renderContentPanel()}
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={colorPickerConfig.isOpen}
        onClose={() => setColorPickerConfig(prev => ({ ...prev, isOpen: false }))}
        onSelectColor={(color) => {
          if (selectedElement && colorPickerConfig.property) {
            updateElement(selectedElement, colorPickerConfig.property, color);
          }
        }}
        currentColor={colorPickerConfig.currentColor}
        title={colorPickerConfig.title}
      />
    </>
  );
};

export default PropertiesPanel;