import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  FileIcon, ChevronLeftIcon, ChevronRightIcon,
  ZoomInIcon, ZoomOutIcon,
  ChevronRightIcon as ChevronRight,
  LayoutIcon, CheckSquareIcon, FileTextIcon
} from 'lucide-react';
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, MARGIN_PX, CONTENT_WIDTH_PX, CONTENT_HEIGHT_PX, calculateDynamicContentArea } from '../utils/layoutUtils';

// YouTube-style Tooltip Component
const KeyboardTooltip = ({ label, shortcut, children, disabled = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => !disabled && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && !disabled && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <span>{label}</span>
          {shortcut && (
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontFamily: 'monospace'
            }}>
              {shortcut}
            </span>
          )}
          {/* Tooltip arrow */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '4px solid rgba(0, 0, 0, 0.9)'
          }} />
        </div>
      )}
    </div>
  );
};

// Minimum distances for header/footer from page edge (as in CanvasArea.jsx)
const HEADER_TOP_MARGIN = 20; // 20px from top page edge (doubled from 10px)
const FOOTER_BOTTOM_MARGIN = 20; // 20px from bottom page edge (doubled from 10px)
const HEADER_FOOTER_HORIZONTAL_PADDING = 20; // 20px left/right padding

// Header/Footer Editor with State Management
const HeaderFooterEditorWithState = ({ content, onChange, placeholder, editorId }) => {
  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(10);
  const [currentFontFamily, setCurrentFontFamily] = useState('Arial, sans-serif');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentAlignment, setCurrentAlignment] = useState(null);
  const isUpdatingRef = useRef(false);

  // Update toolbar state based on current selection/cursor
  const updateToolbarState = useCallback(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const hasSelection = !range.collapsed;
    
    // Only update from document if there's an actual selection
    // This preserves manual toolbar settings when typing
    if (!hasSelection) {
      // No selection - just update bold/italic/underline state
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      return;
    }
    
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));

    // Check alignment using queryCommandState
    if (document.queryCommandState('justifyCenter')) {
      setCurrentAlignment('center');
    } else if (document.queryCommandState('justifyRight')) {
      setCurrentAlignment('right');
    } else if (document.queryCommandState('justifyLeft')) {
      setCurrentAlignment('left');
    } else {
      // Fallback: check computed style
      const container = range.commonAncestorContainer;
      const element = container.nodeType === 3 ? container.parentElement : container;
      
      if (element && editorRef.current.contains(element)) {
        let alignElement = element;
        let alignment = 'left';
        while (alignElement && alignElement !== editorRef.current) {
          const align = window.getComputedStyle(alignElement).textAlign;
          if (align) {
            if (align === 'center') {
              alignment = 'center';
              break;
            } else if (align === 'right' || align === 'end') {
              alignment = 'right';
              break;
            } else if (align === 'left' || align === 'start') {
              alignment = 'left';
              break;
            }
          }
          alignElement = alignElement.parentElement;
        }
        setCurrentAlignment(alignment);
      }
    }

    const container = range.commonAncestorContainer;
    const element = container.nodeType === 3 ? container.parentElement : container;

    if (element && editorRef.current.contains(element)) {
      const styles = window.getComputedStyle(element);
      
      // Font size - check if selection has mixed font sizes
      let fontSize = parseInt(styles.fontSize) || 10;
      
      // If we have a non-collapsed selection, check for mixed font sizes
      if (!range.collapsed) {
        const fragment = range.cloneContents();
        const sizes = new Set();
        
        // Walk through all elements in selection
        const walker = document.createTreeWalker(
          fragment,
          NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
          null
        );
        
        let node = walker.currentNode;
        while (node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.style && node.style.fontSize) {
            sizes.add(parseInt(node.style.fontSize) || 10);
          } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            const parent = node.parentElement;
            if (parent.style && parent.style.fontSize) {
              sizes.add(parseInt(parent.style.fontSize) || 10);
            }
          }
          node = walker.nextNode();
        }
        
        // If we have mixed sizes, use the first one or show a placeholder
        if (sizes.size > 1) {
          fontSize = Math.min(...sizes); // Use smallest size
        } else if (sizes.size === 1) {
          fontSize = [...sizes][0];
        }
      }
      
      setCurrentFontSize(fontSize);

      // Font family
      let fontFamily = styles.fontFamily || 'Arial, sans-serif';
      fontFamily = fontFamily.replace(/['"]/g, '');
      if (fontFamily.includes('Times New Roman')) {
        setCurrentFontFamily("'Times New Roman', serif");
      } else if (fontFamily.includes('Courier New')) {
        setCurrentFontFamily("'Courier New', monospace");
      } else if (fontFamily.includes('Georgia')) {
        setCurrentFontFamily('Georgia, serif');
      } else if (fontFamily.includes('Verdana')) {
        setCurrentFontFamily('Verdana, sans-serif');
      } else {
        setCurrentFontFamily('Arial, sans-serif');
      }

      // Color
      const rgbToHex = (rgb) => {
        if (!rgb) return '#000000';
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return rgb.startsWith('#') ? rgb : '#000000';
        const hex = (x) => {
          const h = parseInt(x).toString(16);
          return h.length === 1 ? "0" + h : h;
        };
        return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
      };
      setCurrentColor(rgbToHex(styles.color));
    }
  }, []);

  // Apply formatting
  const applyFormat = useCallback((command, value = null) => {
    isUpdatingRef.current = true;
    
    const selection = window.getSelection();
    const hasSelection = selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
    
    // For alignment commands, we need to work with the current block even without selection
    if (command.startsWith('justify')) {
      let wasCollapsed = false;
      if (!hasSelection && selection.rangeCount > 0) {
        wasCollapsed = true;
        // No selection - select the current block/line
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        const cursorNode = range.startContainer;
        const container = range.commonAncestorContainer;
        const element = container.nodeType === 3 ? container.parentElement : container;
        
        if (element && editorRef.current.contains(element)) {
          // Find the block element (div, p, or similar)
          let blockElement = element;
          while (blockElement && blockElement !== editorRef.current && 
                 !['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(blockElement.tagName)) {
            blockElement = blockElement.parentElement;
          }
          
          if (blockElement && blockElement !== editorRef.current) {
            // Select the entire block
            const newRange = document.createRange();
            newRange.selectNodeContents(blockElement);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } else {
            // If no block element found, select the entire editor content
            const newRange = document.createRange();
            newRange.selectNodeContents(editorRef.current);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      }
      
      // Now apply the alignment
      document.execCommand(command, false, value);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      
      // If there was no selection originally, collapse it back to cursor
      if (wasCollapsed && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.collapse(false); // Collapse to end
      }
      
      // Update alignment state
      setTimeout(() => {
        if (command === 'justifyLeft') setCurrentAlignment('left');
        if (command === 'justifyCenter') setCurrentAlignment('center');
        if (command === 'justifyRight') setCurrentAlignment('right');
      }, 0);
    } else if (hasSelection) {
      // Has selection - apply format immediately
      document.execCommand(command, false, value);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
    
    // Update state for visual feedback and future typed text
    if (command === 'bold') setIsBold(hasSelection ? document.queryCommandState('bold') : !isBold);
    if (command === 'italic') setIsItalic(hasSelection ? document.queryCommandState('italic') : !isItalic);
    if (command === 'underline') setIsUnderline(hasSelection ? document.queryCommandState('underline') : !isUnderline);
    if (command === 'foreColor') setCurrentColor(value);
    if (command === 'fontName') setCurrentFontFamily(value);
    
    setTimeout(() => {
      isUpdatingRef.current = false;
      editorRef.current?.focus();
      // Only update toolbar state from selection if we had a selection
      // Otherwise, keep the user's manual settings
      if (hasSelection || command.startsWith('justify')) {
        updateToolbarState();
      }
    }, 10);
  }, [onChange, updateToolbarState, isBold, isItalic, isUnderline]);

  // Handle font size change
  const handleFontSizeChange = useCallback((size) => {
    isUpdatingRef.current = true;
    setCurrentFontSize(size);
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        // Has selection - apply immediately to all selected content
        // Remove any existing font-size spans and apply new uniform size
        const fragment = range.cloneContents();
        const walker = document.createTreeWalker(
          fragment,
          NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
          null
        );
        
        // Create a new span with the desired font size
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        
        // Extract the content and clean up nested font-size spans
        const content = range.extractContents();
        
        // Remove font-size from nested elements
        const cleanContent = (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Remove inline font-size style
            if (node.style && node.style.fontSize) {
              node.style.fontSize = '';
            }
            // If it's a span with no other styles/attributes, unwrap it
            if (node.tagName === 'SPAN' && 
                !node.style.cssText && 
                !node.className && 
                !node.id) {
              const parent = node.parentNode;
              while (node.firstChild) {
                parent.insertBefore(node.firstChild, node);
              }
              parent.removeChild(node);
            } else {
              // Recursively clean children
              Array.from(node.childNodes).forEach(cleanContent);
            }
          }
        };
        
        // Clean the extracted content
        Array.from(content.childNodes).forEach(cleanContent);
        
        // Add cleaned content to new span
        span.appendChild(content);
        range.insertNode(span);
        
        // Restore selection
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
      // No selection - only update state, don't modify existing text
    }
    
    setTimeout(() => {
      isUpdatingRef.current = false;
      editorRef.current?.focus();
      updateToolbarState();
    }, 10);
  }, [onChange, updateToolbarState]);

  // Handle input - simpler version
  const handleInput = useCallback((e) => {
    if (isUpdatingRef.current) return;
    onChange(e.currentTarget.innerHTML);
  }, [onChange]);

  // Handle keydown to apply formatting to typed text
  const handleKeyDown = useCallback((e) => {
    // Allow normal editing keys
    if (e.ctrlKey || e.metaKey || e.key === 'Backspace' || e.key === 'Delete' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || 
        e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Tab') {
      return;
    }

    // For regular character input, apply current formatting
    if (e.key.length === 1) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Check if we need to apply formatting
        const container = range.commonAncestorContainer;
        const element = container.nodeType === 3 ? container.parentElement : container;
        
        if (element && editorRef.current.contains(element)) {
          const styles = window.getComputedStyle(element);
          const currentSize = parseInt(styles.fontSize) || 10;
          let currentFamily = styles.fontFamily || 'Arial, sans-serif';
          
          // Normalize font family for comparison
          currentFamily = currentFamily.replace(/['"]/g, '');
          let normalizedTargetFamily = currentFontFamily.replace(/['"]/g, '');
          
          const needsFontChange = !currentFamily.includes(normalizedTargetFamily.split(',')[0].trim());
          const needsSizeChange = currentSize !== currentFontSize;
          
          // If formatting needs to be applied, wrap the typed character
          if (needsFontChange || needsSizeChange) {
            e.preventDefault();
            
            const span = document.createElement('span');
            span.style.fontSize = `${currentFontSize}px`;
            span.style.fontFamily = currentFontFamily;
            span.style.color = currentColor;
            
            // Apply bold, italic, underline if active
            if (isBold) span.style.fontWeight = 'bold';
            if (isItalic) span.style.fontStyle = 'italic';
            if (isUnderline) span.style.textDecoration = 'underline';
            
            span.textContent = e.key;
            
            range.deleteContents();
            range.insertNode(span);
            
            // Move cursor after the inserted character
            const newRange = document.createRange();
            newRange.setStartAfter(span);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            if (editorRef.current) {
              onChange(editorRef.current.innerHTML);
            }
          }
        }
      }
    }
  }, [currentFontSize, currentFontFamily, currentColor, isBold, isItalic, isUnderline, onChange]);

  // Don't reset toolbar state on blur - keep current formatting
  const handleBlur = useCallback(() => {
    // Keep all formatting states as they are
    // This allows users to set formatting before typing (like Word)
  }, []);

  // Listen to selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current && !isUpdatingRef.current) {
        updateToolbarState();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateToolbarState]);

  // Update toolbar on mount
  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => updateToolbarState(), 100);
    }
  }, [updateToolbarState]);

  return (
    <div className="space-y-3">
      {/* Formatting Toolbar */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 items-center">
        <div className="text-xs font-medium text-gray-700 mr-2">Format:</div>
        
        {/* Font Family */}
        <select
          value={currentFontFamily}
          onChange={(e) => applyFormat('fontName', e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 font-medium"
          title="Font Family"
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
        </select>

        {/* Font Size */}
        <input
          type="number"
          min="8"
          max="72"
          value={currentFontSize}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 10)}
          className="w-16 text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 font-medium"
          title="Font Size"
        />

        {/* Color */}
        <input
          type="color"
          value={currentColor}
          onChange={(e) => applyFormat('foreColor', e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="Text Color"
        />

        <div className="w-px h-6 bg-gray-300" />

        {/* Bold, Italic, Underline */}
        <button
          onClick={() => applyFormat('bold')}
          className={`p-1.5 rounded ${isBold ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title="Bold (Ctrl+B)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className={`p-1.5 rounded ${isItalic ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title="Italic (Ctrl+I)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className={`p-1.5 rounded ${isUnderline ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title="Underline (Ctrl+U)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
            <line x1="4" y1="21" x2="20" y2="21" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Alignment */}
        <button
          onClick={() => applyFormat('justifyLeft')}
          className={`p-1.5 rounded ${currentAlignment === 'left' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title="Align Left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="17" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={() => applyFormat('justifyCenter')}
          className={`p-1.5 rounded ${currentAlignment === 'center' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title="Align Center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="10" x2="6" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={() => applyFormat('justifyRight')}
          className={`p-1.5 rounded ${currentAlignment === 'right' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title="Align Right"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="21" y1="10" x2="7" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Editor Area */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {editorId.includes('header') ? 'Header Content' : 'Footer Content'}
        </label>
        
        <div className="border border-gray-300 rounded-lg bg-white relative" style={{ width: `${CONTENT_WIDTH_PX + 16}px`, padding: '8px' }}>
          <div
            id={editorId}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={updateToolbarState}
            onKeyUp={updateToolbarState}
            onFocus={updateToolbarState}
            onBlur={handleBlur}
            ref={(el) => {
              if (el) {
                editorRef.current = el;
                if (!el._initialized) {
                  el.innerHTML = content || '';
                  el._initialized = true;
                }
              }
            }}
            className="outline-none min-h-[60px] cursor-text"
            style={{
              width: `${CONTENT_WIDTH_PX}px`,
              fontSize: '10px',
              fontFamily: 'Arial, sans-serif',
              color: '#000',
              lineHeight: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              padding: '0',
              margin: '0',
              boxSizing: 'border-box'
            }}
          />
          {!content && (
            <div 
              className="text-gray-400 text-xs pointer-events-none absolute"
              style={{ 
                fontSize: '10px', 
                top: '8px',
                left: '10px'
              }}
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Modals = ({
  showPreview,
  setShowPreview,
  previewPage,
  setPreviewPage,
  contractPages,
  setContractPages,
  previewZoom,
  setPreviewZoom,
  globalHeader,
  globalFooter,
  renderElementContent,
  showAddPageModal,
  setShowAddPageModal,
  newPageName,
  setNewPageName,
  addPage,
  newPageNameInputRef,
  showCreateFolderModal,
  setShowCreateFolderModal,
  newFolderName,
  setNewFolderName,
  newFolderColor,
  setNewFolderColor,
  createFolder,
  showEditFolderModal,
  setShowEditFolderModal,
  editingFolderId,
  setEditingFolderId,
  editingFolderName,
  setEditingFolderName,
  editingFolderColor,
  setEditingFolderColor,
  saveEditFolder,
  headerFooterSettingsOpen,
  setHeaderFooterSettingsOpen,
  updateGlobalHeader,
  updateGlobalFooter,
  headerSettingsExpanded,
  setHeaderSettingsExpanded,
  footerSettingsExpanded,
  setFooterSettingsExpanded,
  // Crop modal props
  showImageCropModal,
  setShowImageCropModal,
  cropImageElement,
  updateElement,
  currentPage,
  folders,
  saveToHistory,
  // Validation warning props
  showValidationWarning,
  setShowValidationWarning,
  validationWarnings,
  handleSaveAnyway,
  // Hotkeys modal props
  showHotkeysModal,
  setShowHotkeysModal
}) => {
  // Preview header/footer refs and measured heights
  const previewHeaderRef = useRef(null);
  const previewFooterRef = useRef(null);
  const [previewMeasuredHeaderHeight, setPreviewMeasuredHeaderHeight] = useState(0);
  const [previewMeasuredFooterHeight, setPreviewMeasuredFooterHeight] = useState(0);
  
  // Preview mode state: 'builder', 'filled', 'empty'
  const [previewMode, setPreviewMode] = useState('builder');
  
  // Crop modal state - MOVED TO TOP LEVEL
  const [cropLeft, setCropLeft] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  
  // Crop modal drag state - MOVED TO TOP LEVEL
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropAreaRef = useRef(null);
  const imageRef = useRef(null);

  // Calculate dynamic content area for preview (MOVED OUT OF renderPreview)
  const previewDynamicContentArea = useMemo(() => {
    if (!showPreview || !contractPages[previewPage]) {
      return { top: MARGIN_PX, height: CONTENT_HEIGHT_PX, headerHeight: 0, footerHeight: 0 };
    }
    const page = contractPages[previewPage];
    const isPdfPage = page?.locked || page?.isPdfPage;
    
    if (isPdfPage) {
      return {
        top: MARGIN_PX,
        height: CONTENT_HEIGHT_PX,
        headerHeight: 0,
        footerHeight: 0
      };
    }

    // Use measured heights if available
    const headerHeight = previewMeasuredHeaderHeight || 0;
    const footerHeight = previewMeasuredFooterHeight || 0;

    const contentTop = MARGIN_PX + headerHeight;
    const contentHeight = CONTENT_HEIGHT_PX - headerHeight - footerHeight;

    return {
      top: contentTop,
      height: Math.max(100, contentHeight),
      headerHeight,
      footerHeight
    };
  }, [showPreview, contractPages, previewPage, previewMeasuredHeaderHeight, previewMeasuredFooterHeight]);

  // Measure preview header height
  useEffect(() => {
    if (previewHeaderRef.current && showPreview) {
      const measureHeight = () => {
        const height = previewHeaderRef.current.offsetHeight;
        if (height !== previewMeasuredHeaderHeight && height > 0) {
          setPreviewMeasuredHeaderHeight(height);
        }
      };
      
      measureHeight();
      const timeoutId = setTimeout(measureHeight, 50);
      return () => clearTimeout(timeoutId);
    } else if (!showPreview && previewMeasuredHeaderHeight !== 0) {
      setPreviewMeasuredHeaderHeight(0);
    }
  }, [globalHeader, previewPage, contractPages, showPreview]);

  // Measure preview footer height
  useEffect(() => {
    if (previewFooterRef.current && showPreview) {
      const measureHeight = () => {
        const height = previewFooterRef.current.offsetHeight;
        if (height !== previewMeasuredFooterHeight && height > 0) {
          setPreviewMeasuredFooterHeight(height);
        }
      };
      
      measureHeight();
      const timeoutId = setTimeout(measureHeight, 50);
      return () => clearTimeout(timeoutId);
    } else if (!showPreview && previewMeasuredFooterHeight !== 0) {
      setPreviewMeasuredFooterHeight(0);
    }
  }, [globalFooter, previewPage, contractPages, showPreview]);

  // Zoom with Ctrl + Mouse Wheel in Preview
  useEffect(() => {
    if (!showPreview) return;

    const handleWheel = (e) => {
      // Nur wenn Ctrl/Cmd gedrückt ist
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Verhindert Browser-Zoom
        
        // deltaY > 0 = runter scrollen = Zoom Out
        // deltaY < 0 = hoch scrollen = Zoom In
        if (e.deltaY < 0) {
          // Zoom In
          setPreviewZoom(prev => Math.min(1.0, prev + 0.1));
        } else if (e.deltaY > 0) {
          // Zoom Out
          setPreviewZoom(prev => Math.max(0.4, prev - 0.1));
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [showPreview, setPreviewZoom]);

  // Update crop values when modal opens with existing element
  useEffect(() => {
    if (showImageCropModal && cropImageElement) {
      // Force update crop values every time modal opens
      const currentCropLeft = cropImageElement.cropLeft ?? 0;
      const currentCropTop = cropImageElement.cropTop ?? 0;
      const currentCropRight = cropImageElement.cropRight ?? 0;
      const currentCropBottom = cropImageElement.cropBottom ?? 0;
      
      console.log('🖼️ Crop Modal Opened - Loading crop values from element:', {
        elementId: cropImageElement.id,
        cropLeft: currentCropLeft,
        cropTop: currentCropTop,
        cropRight: currentCropRight,
        cropBottom: currentCropBottom,
        hasCrop: currentCropLeft > 0 || currentCropTop > 0 || currentCropRight > 0 || currentCropBottom > 0
      });
      
      // Always set the values, even if they're 0
      setCropLeft(currentCropLeft);
      setCropTop(currentCropTop);
      setCropRight(currentCropRight);
      setCropBottom(currentCropBottom);
    } else if (!showImageCropModal) {
      // Reset crop values when modal closes
      console.log('🖼️ Crop Modal Closed - Resetting crop values');
      setCropLeft(0);
      setCropTop(0);
      setCropRight(0);
      setCropBottom(0);
    }
  }, [showImageCropModal]); // Only depend on modal state, always re-read element values

  // Crop modal handlers
  const handleApplyCrop = useCallback(() => {
    if (!cropImageElement) return;
    
    // Calculate visible area percentage
    const visibleWidthPercent = (100 - cropLeft - cropRight) / 100;
    const visibleHeightPercent = (100 - cropTop - cropBottom) / 100;
    
    // Get the ORIGINAL preCrop dimensions, or if this is the first crop, use current dimensions
    // This ensures that we always calculate based on the uncropped image size
    const originalPreCropWidth = cropImageElement.preCropWidth || cropImageElement.width;
    const originalPreCropHeight = cropImageElement.preCropHeight || cropImageElement.height;
    
    // Calculate new element dimensions based on crop - NO ROUNDING for precision
    const newWidth = originalPreCropWidth * visibleWidthPercent;
    const newHeight = originalPreCropHeight * visibleHeightPercent;
    
    // Update all values at once to avoid race conditions and ensure consistent state
    const newPages = contractPages.map((page, pIdx) => {
      if (pIdx !== currentPage) return page;
      const newElements = page.elements.map(el => {
        if (el.id !== cropImageElement.id) return el;
        return {
          ...el,
          cropLeft: cropLeft,
          cropTop: cropTop,
          cropRight: cropRight,
          cropBottom: cropBottom,
          // ALWAYS preserve the original preCrop dimensions
          preCropWidth: originalPreCropWidth,
          preCropHeight: originalPreCropHeight,
          // Update element size to match cropped area - use exact values without artificial minimum
          width: newWidth,
          height: newHeight
        };
      });
      return { ...page, elements: newElements };
    });
    
    setContractPages(newPages);
    saveToHistory(newPages, folders, 'crop_image');
    setShowImageCropModal(false);
  }, [cropImageElement, cropLeft, cropTop, cropRight, cropBottom, contractPages, currentPage, setContractPages, saveToHistory, folders, setShowImageCropModal]);

  const handleCropMouseDown = useCallback((e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (handle === 'move') {
      // Start dragging the entire crop area
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (handle) {
      // Start resizing from a specific handle
      setIsResizing(true);
      setResizeHandle(handle);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleCropMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    
    const imageRect = imageRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / imageRect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / imageRect.height) * 100;

    if (isDragging) {
      // Move the entire crop area
      e.preventDefault();
      
      // Calculate new positions, ensuring we don't go out of bounds
      const newLeft = Math.max(0, Math.min(100 - (100 - cropLeft - cropRight), cropLeft + deltaX));
      const newTop = Math.max(0, Math.min(100 - (100 - cropTop - cropBottom), cropTop + deltaY));
      
      // Only update if the move is valid (doesn't push crop area out of bounds)
      const cropWidth = 100 - cropLeft - cropRight;
      const cropHeight = 100 - cropTop - cropBottom;
      
      if (newLeft >= 0 && newLeft + cropWidth <= 100) {
        setCropLeft(newLeft);
        setCropRight(100 - newLeft - cropWidth);
      }
      
      if (newTop >= 0 && newTop + cropHeight <= 100) {
        setCropTop(newTop);
        setCropBottom(100 - newTop - cropHeight);
      }
      
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing && resizeHandle) {
      // Resize based on handle
      e.preventDefault();
      
      switch(resizeHandle) {
        case 'nw':
          setCropLeft(prev => Math.max(0, Math.min(100 - cropRight - 10, prev + deltaX)));
          setCropTop(prev => Math.max(0, Math.min(100 - cropBottom - 10, prev + deltaY)));
          break;
        case 'ne':
          setCropRight(prev => Math.max(0, Math.min(100 - cropLeft - 10, prev - deltaX)));
          setCropTop(prev => Math.max(0, Math.min(100 - cropBottom - 10, prev + deltaY)));
          break;
        case 'sw':
          setCropLeft(prev => Math.max(0, Math.min(100 - cropRight - 10, prev + deltaX)));
          setCropBottom(prev => Math.max(0, Math.min(100 - cropTop - 10, prev - deltaY)));
          break;
        case 'se':
          setCropRight(prev => Math.max(0, Math.min(100 - cropLeft - 10, prev - deltaX)));
          setCropBottom(prev => Math.max(0, Math.min(100 - cropTop - 10, prev - deltaY)));
          break;
        case 'n':
          setCropTop(prev => Math.max(0, Math.min(100 - cropBottom - 10, prev + deltaY)));
          break;
        case 's':
          setCropBottom(prev => Math.max(0, Math.min(100 - cropTop - 10, prev - deltaY)));
          break;
        case 'w':
          setCropLeft(prev => Math.max(0, Math.min(100 - cropRight - 10, prev + deltaX)));
          break;
        case 'e':
          setCropRight(prev => Math.max(0, Math.min(100 - cropLeft - 10, prev - deltaX)));
          break;
      }
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, cropLeft, cropTop, cropRight, cropBottom]);

  const handleCropMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // Event listeners for crop modal
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleCropMouseMove);
      document.addEventListener('mouseup', handleCropMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCropMouseMove);
        document.removeEventListener('mouseup', handleCropMouseUp);
      };
    }
  }, [isDragging, isResizing, handleCropMouseMove, handleCropMouseUp]);
  
  // Helper function to render element content based on preview mode
  const renderPreviewElementContent = useCallback((element) => {
    // Builder mode - show as normal with all placeholders and asterisks
    if (previewMode === 'builder') {
      return renderElementContent(element);
    }
    
    // Clone element to avoid mutating original
    const modifiedElement = { ...element };
    
    // FILLED MODE - Show with dummy data, no asterisks, no placeholders
    if (previewMode === 'filled') {
      // Remove required asterisk for all elements
      modifiedElement.required = false;
      
      if (element.type === 'text' || element.type === 'system-text') {
        // Generate realistic dummy value based on variable name
        const varName = element.variable?.toLowerCase() || '';
        let dummyValue = 'Sample Value';
        
        if (varName.includes('name') || varName.includes('vorname') || varName.includes('nachname')) {
          dummyValue = 'Max Mustermann';
        } else if (varName.includes('firma') || varName.includes('company')) {
          dummyValue = 'Musterfirma GmbH';
        } else if (varName.includes('date') || varName.includes('datum')) {
          dummyValue = new Date().toLocaleDateString('de-DE');
        } else if (varName.includes('address') || varName.includes('adresse') || varName.includes('strasse')) {
          dummyValue = 'Musterstraße 123';
        } else if (varName.includes('city') || varName.includes('stadt') || varName.includes('ort')) {
          dummyValue = 'Musterstadt';
        } else if (varName.includes('plz') || varName.includes('zip') || varName.includes('postal')) {
          dummyValue = '12345';
        } else if (varName.includes('email') || varName.includes('mail')) {
          dummyValue = 'max.mustermann@example.com';
        } else if (varName.includes('phone') || varName.includes('tel') || varName.includes('telefon')) {
          dummyValue = '+49 123 456789';
        } else if (varName.includes('time') || varName.includes('uhr') || varName.includes('zeit')) {
          dummyValue = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        } else if (varName.includes('page') || varName.includes('seite')) {
          dummyValue = `${previewPage + 1}`;
        } else if (varName.includes('betrag') || varName.includes('amount') || varName.includes('price')) {
          dummyValue = '1.234,56 €';
        }
        
        // Create custom rendering for filled text/system-text
        // We need to show the dummy value in the input field without the {Variable} syntax
        modifiedElement.variable = null; // Remove variable to hide {Variable} text
        modifiedElement.content = dummyValue; // Set dummy content
        
        // For rendering, we need to modify how it displays
        // The element renderer shows {Variable} if variable exists, otherwise shows content
        // By setting variable to null and content to dummyValue, it will show dummyValue
      } else if (element.type === 'checkbox') {
        // Show checkbox as checked, no placeholder text
        return renderPreviewCheckbox(element, true, false);
      } else if (element.type === 'signature') {
        // Add a dummy signature image
        return renderPreviewSignature(element, true);
      } else if (element.type === 'heading' || element.type === 'subheading') {
        // Only show if there's actual content (not placeholder)
        const isPlaceholder = !element.content || 
          element.content === 'Heading...' || 
          element.content === 'Subheading...';
        if (isPlaceholder) {
          return null; // Don't render placeholder content in filled mode
        }
      } else if (element.type === 'paragraph') {
        // Only show if there's actual content (not placeholder)
        const isPlaceholder = !element.content || element.content === 'Paragraph...';
        if (isPlaceholder) {
          return null; // Don't render placeholder content in filled mode
        }
      } else if (element.type === 'textarea') {
        // Only show if there's actual content
        const isPlaceholder = !element.content || element.content.trim() === '';
        if (isPlaceholder) {
          return null; // Don't render empty textarea in filled mode
        }
      } else if (element.type === 'image') {
        // Only show if an image has been uploaded
        if (!element.src) {
          return null; // Don't render image placeholder in filled mode
        }
      }
    }
    
    // EMPTY MODE - Show blank contract, no asterisks, no placeholders, no variable content
    if (previewMode === 'empty') {
      // Remove required asterisk for all elements
      modifiedElement.required = false;
      
      if (element.type === 'text' || element.type === 'system-text') {
        // Show empty field - no variable text, no placeholder
        modifiedElement.variable = null; // Remove {Variable} text
        modifiedElement.content = null; // No content
        // The element renderer will show '...' as placeholder, but we want it empty
        // We need to handle this differently
      } else if (element.type === 'checkbox') {
        // Show unchecked checkbox, no placeholder text
        return renderPreviewCheckbox(element, false, false);
      } else if (element.type === 'signature') {
        // No signature, no placeholder text
        return renderPreviewSignature(element, false);
      } else if (element.type === 'heading' || element.type === 'subheading') {
        // Only show if there's actual content (not placeholder)
        const isPlaceholder = !element.content || 
          element.content === 'Heading...' || 
          element.content === 'Subheading...';
        if (isPlaceholder) {
          return null; // Don't render placeholder content in empty mode
        }
      } else if (element.type === 'paragraph') {
        // Only show if there's actual content (not placeholder)
        const isPlaceholder = !element.content || element.content === 'Paragraph...';
        if (isPlaceholder) {
          return null; // Don't render placeholder content in empty mode
        }
      } else if (element.type === 'textarea') {
        // Only show if there's actual content
        const isPlaceholder = !element.content || element.content.trim() === '';
        if (isPlaceholder) {
          return null; // Don't render empty textarea in empty mode
        }
      } else if (element.type === 'image') {
        // Only show if an image has been uploaded
        if (!element.src) {
          return null; // Don't render image placeholder in empty mode
        }
      }
    }
    
    // For text/system-text in empty mode, we need custom rendering
    // because the standard renderer shows '...' when content is empty
    if (previewMode === 'empty' && (element.type === 'text' || element.type === 'system-text')) {
      const labelColor = modifiedElement.labelColor || '#111827';
      const labelFontSize = modifiedElement.labelFontSize || 14;
      const labelFontFamily = modifiedElement.labelFontFamily || 'Arial, sans-serif';
      
      const labelBold = modifiedElement.labelBold || false;
      const labelItalic = modifiedElement.labelItalic || false;
      const labelUnderline = modifiedElement.labelUnderline || false;
      const labelCapsLock = modifiedElement.labelCapsLock || false;
      
      const hasCustomLabel = modifiedElement.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(modifiedElement.label);
      // Placeholder wie im Builder, aber unsichtbar wenn kein custom Label
      const placeholderText = modifiedElement.type === 'text' ? 'Variable Field (Input)...' : 'Variable Field (System)...';
      
      return (
        <div className="flex flex-col h-full w-full p-0">
          {/* Label-Div IMMER rendern wenn showTitle !== false - wie im Builder */}
          {modifiedElement.showTitle !== false && (
            <div 
              className="mb-1"
              style={{
                fontSize: `${labelFontSize}px`,
                fontFamily: labelFontFamily,
                color: labelColor,
                paddingLeft: '0px'
              }}
            >
              <span
                style={{
                  fontWeight: labelBold ? 'bold' : 'normal',
                  fontStyle: labelItalic ? 'italic' : 'normal',
                  textDecoration: labelUnderline ? 'underline' : 'none',
                  textTransform: labelCapsLock ? 'uppercase' : undefined,
                  // Wenn KEIN custom Label: unsichtbar machen, damit Div trotzdem richtige HÃ¶he hat
                  opacity: hasCustomLabel ? 1 : 0
                }}
              >
                {hasCustomLabel ? modifiedElement.label : placeholderText}
              </span>
            </div>
          )}
          <div 
            className="w-full h-full border border-gray-300 rounded bg-gray-50 flex-grow flex items-center" 
            style={{ 
              paddingLeft: '8px', 
              paddingRight: '12px'
            }}
          >
            {/* Empty - no content */}
          </div>
        </div>
      );
    }
    
    // For text/system-text in filled mode, we need custom rendering
    // to show the dummy value instead of {Variable}
    if (previewMode === 'filled' && (element.type === 'text' || element.type === 'system-text')) {
      const labelColor = modifiedElement.labelColor || '#111827';
      const inputColor = modifiedElement.inputColor || '#374151';
      const labelFontSize = modifiedElement.labelFontSize || 14;
      const inputFontSize = modifiedElement.inputFontSize || 14;
      const labelFontFamily = modifiedElement.labelFontFamily || 'Arial, sans-serif';
      const inputFontFamily = modifiedElement.inputFontFamily || 'Arial, sans-serif';
      
      const labelBold = modifiedElement.labelBold || false;
      const labelItalic = modifiedElement.labelItalic || false;
      const labelUnderline = modifiedElement.labelUnderline || false;
      const labelCapsLock = modifiedElement.labelCapsLock || false;
      
      const inputBold = modifiedElement.inputBold || false;
      const inputItalic = modifiedElement.inputItalic || false;
      const inputUnderline = modifiedElement.inputUnderline || false;
      const inputCapsLock = modifiedElement.inputCapsLock || false;
      
      const hasCustomLabel = modifiedElement.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(modifiedElement.label);
      // Placeholder wie im Builder, aber unsichtbar wenn kein custom Label
      const placeholderText = modifiedElement.type === 'text' ? 'Variable Field (Input)...' : 'Variable Field (System)...';
      
      return (
        <div className="flex flex-col h-full w-full p-0">
          {/* Label-Div IMMER rendern wenn showTitle !== false - wie im Builder */}
          {modifiedElement.showTitle !== false && (
            <div 
              className="mb-1"
              style={{
                fontSize: `${labelFontSize}px`,
                fontFamily: labelFontFamily,
                color: labelColor,
                paddingLeft: '0px'
              }}
            >
              <span
                style={{
                  fontWeight: labelBold ? 'bold' : 'normal',
                  fontStyle: labelItalic ? 'italic' : 'normal',
                  textDecoration: labelUnderline ? 'underline' : 'none',
                  textTransform: labelCapsLock ? 'uppercase' : undefined,
                  // Wenn KEIN custom Label: unsichtbar machen, damit Div trotzdem richtige HÃ¶he hat
                  opacity: hasCustomLabel ? 1 : 0
                }}
              >
                {hasCustomLabel ? modifiedElement.label : placeholderText}
              </span>
            </div>
          )}
          <div 
            className="w-full h-full border border-gray-300 rounded bg-gray-50 flex-grow flex items-center" 
            style={{ 
              paddingLeft: '8px', 
              paddingRight: '12px'
            }}
          >
            <span 
              style={{
                fontSize: `${inputFontSize}px`,
                fontFamily: inputFontFamily,
                fontWeight: inputBold ? 'bold' : 'normal',
                fontStyle: inputItalic ? 'italic' : 'normal',
                textDecoration: inputUnderline ? 'underline' : 'none',
                color: inputColor,
                textAlign: 'left',
                textTransform: inputCapsLock ? 'uppercase' : undefined
              }}
            >
              {modifiedElement.content}
            </span>
          </div>
        </div>
      );
    }
    
    // For all other cases, use the standard renderer with modified element
    return renderElementContent(modifiedElement);
  }, [previewMode, renderElementContent, previewPage]);

  // Custom checkbox rendering for filled/empty modes
  const renderPreviewCheckbox = (element, isChecked, showPlaceholders) => {
    const checkboxTitleFontFamily = element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif';
    const checkboxDescriptionFontFamily = element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif';
    const checkboxLabelSize = element.checkboxLabelSize || 16;
    const checkboxDescriptionSize = element.checkboxDescriptionSize || 14;
    
    const titleBold = element.titleBold || false;
    const titleItalic = element.titleItalic || false;
    const titleUnderline = element.titleUnderline || false;
    const titleColor = element.titleColor || '#000000';
    const titleCapsLock = element.titleCapsLock || false;
    
    const descriptionBold = element.descriptionBold || false;
    const descriptionItalic = element.descriptionItalic || false;
    const descriptionUnderline = element.descriptionUnderline || false;
    const descriptionColor = element.descriptionColor || '#374151';
    const descriptionCapsLock = element.descriptionCapsLock || false;
    
    const hasCustomLabel = element.label && element.label !== 'Checkbox Title...';
    const hasCustomDescription = element.description && element.description !== 'Description...';
    
    return (
      <div className="flex flex-col w-full min-h-full">
        <div className="flex items-start gap-2 p-2">
          <input 
            type="checkbox" 
            disabled 
            checked={isChecked}
            className="w-4 h-4 mt-1 flex-shrink-0" 
          />
          <div className="flex-1">
            {element.showTitle !== false && hasCustomLabel && (
              <div 
                style={{
                  fontFamily: checkboxTitleFontFamily,
                  fontSize: `${checkboxLabelSize}px`,
                  color: titleColor
                }}
              >
                <span
                  style={{
                    fontWeight: titleBold ? 'bold' : 'normal',
                    fontStyle: titleItalic ? 'italic' : 'normal',
                    textDecoration: titleUnderline ? 'underline' : 'none',
                    textTransform: titleCapsLock ? 'uppercase' : undefined
                  }}
                >
                  {element.label}
                </span>
              </div>
            )}
          </div>
        </div>
        {element.showDescription && hasCustomDescription && (
          <div 
            className="px-2 pb-2"
            style={{
              fontFamily: checkboxDescriptionFontFamily,
              fontSize: `${checkboxDescriptionSize}px`,
              fontWeight: descriptionBold ? 'bold' : 'normal',
              fontStyle: descriptionItalic ? 'italic' : 'normal',
              textDecoration: descriptionUnderline ? 'underline' : 'none',
              color: descriptionColor,
              whiteSpace: 'pre-wrap',
              textTransform: descriptionCapsLock ? 'uppercase' : undefined
            }}
          >
            {element.description}
          </div>
        )}
      </div>
    );
  };

  // Custom signature rendering for filled/empty modes
  const renderPreviewSignature = (element, showSignature) => {
    const today = new Date();
    const dateFormat = element.dateFormat || 'de-DE';
    
    let currentDate;
    if (dateFormat === 'iso') {
      currentDate = today.toISOString().split('T')[0];
    } else {
      currentDate = today.toLocaleDateString(dateFormat, { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    }
    
    let locationDateText = '';
    const showDate = element.showDate !== false;
    
    if (element.location && showDate) {
      locationDateText = `${element.location}, ${currentDate}`;
    } else if (element.location) {
      locationDateText = element.location;
    } else if (showDate) {
      locationDateText = currentDate;
    }
    
    const hasCustomBelowText = element.belowSignatureText && element.belowSignatureText !== 'Location, Date/Signature...';
    
    const locationFontFamily = element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif';
    const belowTextFontFamily = element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif';
    const signatureFontSize = element.signatureFontSize || 14;
    
    const locationBold = element.locationBold || false;
    const locationItalic = element.locationItalic || false;
    const locationUnderline = element.locationUnderline || false;
    const locationColor = element.locationColor || '#374151';
    const locationCapsLock = element.locationCapsLock || false;
    
    const belowTextBold = element.belowTextBold || false;
    const belowTextItalic = element.belowTextItalic || false;
    const belowTextUnderline = element.belowTextUnderline || false;
    const belowTextColor = element.belowTextColor || '#374151';
    const belowTextFontSize = element.belowTextFontSize || 14;
    const belowTextCapsLock = element.belowTextCapsLock || false;
    
    // Create a realistic handwritten-style signature SVG
    const handwrittenSignatureSVG = `<svg width="150" height="50" xmlns="http://www.w3.org/2000/svg">
      <!-- First name initial with flourish - "M" style -->
      <path d="M 8 38 Q 6 28, 10 18 Q 12 12, 16 18 L 18 28 Q 20 22, 24 16 Q 28 12, 30 20 L 32 32 Q 34 36, 38 34" 
            stroke="#1a365d" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Connecting stroke -->
      <path d="M 38 34 Q 42 30, 46 32" 
            stroke="#1a365d" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <!-- Middle cursive letters -->
      <path d="M 44 34 Q 48 24, 54 26 Q 58 28, 56 34 Q 54 38, 60 36 Q 66 32, 70 34 Q 74 36, 72 30 Q 70 24, 76 26 Q 82 28, 80 34" 
            stroke="#1a365d" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Last name initial with flourish - tall letter -->
      <path d="M 85 36 Q 88 32, 90 14 Q 91 10, 94 14 Q 96 20, 95 28 L 94 36 Q 96 40, 100 36" 
            stroke="#1a365d" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Final letters with ending flourish -->
      <path d="M 100 36 Q 104 30, 108 32 Q 112 34, 110 38 Q 108 42, 114 38 Q 120 32, 126 34 Q 132 36, 140 30" 
            stroke="#1a365d" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Decorative underline flourish -->
      <path d="M 30 42 Q 60 44, 90 40 Q 110 38, 130 42" 
            stroke="#1a365d" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.6"/>
    </svg>`;
    const base64Signature = btoa(handwrittenSignatureSVG);
    const signatureDataUrl = `data:image/svg+xml;base64,${base64Signature}`;
    
    return (
      <div className="flex flex-col items-start justify-start h-full w-full p-2 relative" style={{ overflow: 'visible' }}>
        {/* Top row: Location/Date Text + Signature nebeneinander */}
        <div className="w-full relative" style={{ overflow: 'visible' }}>
          {/* Flex container für Text links und Unterschrift rechts */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            width: '100%',
            minHeight: '50px',
            overflow: 'visible'
          }}>
            {/* Location/Date Text links */}
            {element.showLocationDate !== false && locationDateText ? (
              <div 
                style={{
                  fontFamily: locationFontFamily,
                  fontSize: `${signatureFontSize}px`,
                  color: locationColor,
                  flexShrink: 0
                }}
              >
                <span
                  style={{
                    fontWeight: locationBold ? 'bold' : 'normal',
                    fontStyle: locationItalic ? 'italic' : 'normal',
                    textDecoration: locationUnderline ? 'underline' : 'none',
                    textTransform: locationCapsLock ? 'uppercase' : undefined
                  }}
                >
                  {locationDateText}
                </span>
              </div>
            ) : <div />}
            
            {/* Signature rechts neben dem Text */}
            {showSignature && (
              <div 
                style={{ 
                  width: '150px',
                  height: '50px',
                  flexShrink: 0,
                  marginLeft: '20px',
                  marginBottom: '-10px', // Sitzt auf der Linie
                  overflow: 'visible'
                }}
              >
                <img 
                  src={signatureDataUrl}
                  alt="Signature" 
                  style={{ 
                    width: '150px', 
                    height: '50px', 
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
              </div>
            )}
          </div>
          
          {/* Signature line - direkt unter dem Text/Unterschrift */}
          <div className="w-full border-t-2 border-gray-400"></div>
        </div>
        
        {/* Below signature text */}
        {element.showBelowSignature !== false && hasCustomBelowText && (
          <div 
            className="text-left"
            style={{
              fontFamily: belowTextFontFamily,
              fontSize: `${belowTextFontSize}px`,
              fontWeight: belowTextBold ? 'bold' : 'normal',
              fontStyle: belowTextItalic ? 'italic' : 'normal',
              textDecoration: belowTextUnderline ? 'underline' : 'none',
              color: belowTextColor,
              textTransform: belowTextCapsLock ? 'uppercase' : undefined,
              marginTop: '4px'
            }}
          >
            {element.belowSignatureText}
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    const page = contractPages[previewPage];

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-7xl h-[95vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-black">
              Contract Preview - {contractPages[previewPage]?.title || `Page ${previewPage + 1}`}
              {page?.locked && <span className="text-gray-500 ml-2">(PDF)</span>}
            </h2>
            <div className="flex items-center gap-4">
              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
                <button
                  onClick={() => setPreviewMode('builder')}
                  className={`p-1.5 rounded ${previewMode === 'builder' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Builder View"
                >
                  <LayoutIcon size={16} />
                </button>
                <button
                  onClick={() => setPreviewMode('filled')}
                  className={`p-1.5 rounded ${previewMode === 'filled' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Filled Preview"
                >
                  <CheckSquareIcon size={16} />
                </button>
                <button
                  onClick={() => setPreviewMode('empty')}
                  className={`p-1.5 rounded ${previewMode === 'empty' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Empty Preview"
                >
                  <FileTextIcon size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPage(prev => Math.max(0, prev - 1))}
                  disabled={previewPage === 0}
                  className={`p-2 rounded-lg ${previewPage === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeftIcon size={20} />
                </button>
                <span className="text-sm font-medium text-black flex items-center gap-2">
                  Page {previewPage + 1} of {contractPages.length}
                </span>
                <button
                  onClick={() => setPreviewPage(prev => Math.min(contractPages.length - 1, prev + 1))}
                  disabled={previewPage === contractPages.length - 1}
                  className={`p-2 rounded-lg ${previewPage === contractPages.length - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRightIcon size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <KeyboardTooltip label="Zoom Out" shortcut="Ctrl+Scroll ↓">
                  <button
                    onClick={() => setPreviewZoom(prev => Math.max(0.4, prev - 0.1))}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ZoomOutIcon size={20} />
                  </button>
                </KeyboardTooltip>
                <span className="text-sm font-medium text-black">{Math.round(previewZoom * 100)}%</span>
                <KeyboardTooltip label="Zoom In" shortcut="Ctrl+Scroll ↑">
                  <button
                    onClick={() => setPreviewZoom(prev => Math.min(1.0, prev + 0.1))}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ZoomInIcon size={20} />
                  </button>
                </KeyboardTooltip>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          
          <div 
            className="flex-1 bg-gray-100" 
            style={{ 
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <div
              style={{
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: previewZoom <= 0.85 ? 'center' : 'flex-start',
                padding: '40px 20px'
              }}
            >
              <div 
                className="bg-white shadow-lg" 
                style={{
                  width: `${PAGE_WIDTH_PX}px`,
                  height: `${PAGE_HEIGHT_PX}px`,
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'top center',
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
              {/* Header - at actual top edge */}
              {!page?.locked && !page?.isPdfPage && globalHeader.enabled && globalHeader.content && ((globalHeader.showOnPages === 'all') || 
                 (globalHeader.showOnPages === 'first' && previewPage === 0)) && (
              <div 
  ref={previewHeaderRef}
  className="absolute bg-white"
  style={{
    top: `${HEADER_TOP_MARGIN}px`, // Feste Position oben
    left: `${MARGIN_PX}px`,
    width: `${CONTENT_WIDTH_PX}px`,
    fontSize: '10px',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
    lineHeight: '1.2',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    padding: '0',
    margin: '0',
    zIndex: 1,
    boxSizing: 'border-box'
  }}
  dangerouslySetInnerHTML={{ __html: globalHeader.content || '' }}
/>
              )}
              
              {/* PDF Background */}
              {page?.locked && page?.backgroundImage && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${page.backgroundImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    opacity: 1,
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                />
              )}
              
              {/* Content Area - within margins */}
              <div 
                style={{
                  position: 'absolute',
                  top: `${previewDynamicContentArea.top}px`,
                  left: `${MARGIN_PX}px`,
                  width: `${CONTENT_WIDTH_PX}px`,
                  height: `${previewDynamicContentArea.height}px`,
                  backgroundColor: 'transparent',
                  overflow: 'hidden'
                }}
              >
                
                {!page?.locked && page?.elements.map((element, index) => {
                  // Calculate zIndex based on element position in array (later elements = higher z-index)
                  const calculatedZIndex = 100 + (page.elements.length - 1 - index);
                  
                  const elementStyle = {
                    position: 'absolute',
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    backgroundColor: element.type === 'image' || element.type === 'divider' || element.type === 'signature' ? 'transparent' : 'white',
                    borderRadius: '4px',
                    padding: '0',
                    boxSizing: 'border-box',
                    zIndex: calculatedZIndex
                  };

                  return (
                    <div key={element.id} style={elementStyle}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        overflow: ['heading', 'subheading', 'text', 'system-text', 'textarea', 'checkbox', 'signature'].includes(element.type) 
                          ? 'hidden'
                          : 'visible',
                        position: 'relative',
                        transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
                        transformOrigin: 'center center'
                      }}>
                        {renderPreviewElementContent(element)}
                      </div>
                    </div>
                  );
                })}
                
                {!page?.locked && page?.elements.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <FileIcon size={48} className="mx-auto mb-4" />
                    <p>No elements on this page</p>
                  </div>
                )}
              </div>
              
              {/* Footer - at actual bottom edge */}
              {!page?.locked && !page?.isPdfPage && globalFooter.enabled && globalFooter.content && ((globalFooter.showOnPages === 'all') || 
                 (globalFooter.showOnPages === 'first' && previewPage === 0)) && (
                <div 
  ref={previewFooterRef}
  className="absolute bg-white"
  style={{
    bottom: `${FOOTER_BOTTOM_MARGIN}px`, // Feste Position unten
    left: `${MARGIN_PX}px`,
    width: `${CONTENT_WIDTH_PX}px`,
    fontSize: '10px',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
    lineHeight: '1.2',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    padding: '0',
    margin: '0',
    zIndex: 1,
    boxSizing: 'border-box'
  }}
  dangerouslySetInnerHTML={{ __html: globalFooter.content || '' }}
/>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddPageModal = () => {
    if (!showAddPageModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Page Name</label>
                <input
                  ref={newPageNameInputRef}
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPage(newPageName);
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setShowAddPageModal(false);
                      setNewPageName('Contract Page');
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Contract Page"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowAddPageModal(false);
                    setNewPageName('Contract Page');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addPage(newPageName)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateFolderModal = () => {
    if (!showCreateFolderModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Folder</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="My Folder"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Folder Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newFolderColor}
                    onChange={(e) => setNewFolderColor(e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newFolderColor}
                    onChange={(e) => setNewFolderColor(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowCreateFolderModal(false);
                    setNewFolderName('');
                    setNewFolderColor('#3b82f6');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createFolder(newFolderName, newFolderColor)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditFolderModal = () => {
    if (!showEditFolderModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Folder</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Folder Name</label>
                <input
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="My Folder"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Folder Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingFolderColor}
                    onChange={(e) => setEditingFolderColor(e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingFolderColor}
                    onChange={(e) => setEditingFolderColor(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowEditFolderModal(false);
                    setEditingFolderId(null);
                    setEditingFolderName('');
                    setEditingFolderColor('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (saveEditFolder(editingFolderId, editingFolderName, editingFolderColor)) {
                      setShowEditFolderModal(false);
                      setEditingFolderId(null);
                      setEditingFolderName('');
                      setEditingFolderColor('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeaderFooterSettings = () => {
    if (!headerFooterSettingsOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Header/Footer Settings</h2>
            <button
              onClick={() => setHeaderFooterSettingsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl px-2"
            >
              x
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
  
            {/* Header Section */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setHeaderSettingsExpanded(!headerSettingsExpanded)}
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  Header (global)
                  <ChevronRight 
                    size={18} 
                    className={`transform transition-transform ${headerSettingsExpanded ? 'rotate-90' : ''}`}
                  />
                </h3>
                <label 
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={globalHeader.enabled}
                    onChange={(e) => updateGlobalHeader({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {headerSettingsExpanded && globalHeader.enabled && (
                <div className="space-y-4 pl-4">
                  <HeaderFooterEditorWithState
                    content={globalHeader.content || ''}
                    onChange={(html) => updateGlobalHeader({ content: html })}
                    placeholder="Enter header text..."
                    editorId="header-editable-area"
                  />
                  
                  <div className="space-y-3 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-900">Show header on:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="header-pages"
                          checked={globalHeader.showOnPages === 'all'}
                          onChange={(e) => updateGlobalHeader({ 
                            showOnPages: 'all',
                            showOnFirstPage: true,
                            showOnOtherPages: true 
                          })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">All Pages</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="header-pages"
                          checked={globalHeader.showOnPages === 'first'}
                          onChange={(e) => updateGlobalHeader({ 
                            showOnPages: 'first',
                            showOnFirstPage: true,
                            showOnOtherPages: false 
                          })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">First Page Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Section */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setFooterSettingsExpanded(!footerSettingsExpanded)}
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  Footer (global)
                  <ChevronRight 
                    size={18} 
                    className={`transform transition-transform ${footerSettingsExpanded ? 'rotate-90' : ''}`}
                  />
                </h3>
                <label 
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={globalFooter.enabled}
                    onChange={(e) => updateGlobalFooter({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {footerSettingsExpanded && globalFooter.enabled && (
                <div className="space-y-4 pl-4">
                  <HeaderFooterEditorWithState
                    content={globalFooter.content || ''}
                    onChange={(html) => updateGlobalFooter({ content: html })}
                    placeholder="Enter footer text..."
                    editorId="footer-editable-area"
                  />
                  
                  <div className="space-y-3 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-900">Show footer on:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="footer-pages"
                          checked={globalFooter.showOnPages === 'all'}
                          onChange={(e) => updateGlobalFooter({ 
                            showOnPages: 'all',
                            showOnFirstPage: true,
                            showOnOtherPages: true 
                          })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">All Pages</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="footer-pages"
                          checked={globalFooter.showOnPages === 'first'}
                          onChange={(e) => updateGlobalFooter({ 
                            showOnPages: 'first',
                            showOnFirstPage: true,
                            showOnOtherPages: false 
                          })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">First Page Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
            <button
              onClick={() => setHeaderFooterSettingsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderImageCropModal = () => {
    if (!showImageCropModal || !cropImageElement) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Crop Image</h2>
            <button
              onClick={() => setShowImageCropModal(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl px-2"
            >
              x
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded p-3">
              <strong>Tip:</strong> Drag the frame to move the crop area. Drag the corners/edges to resize it.
              {(cropLeft > 0 || cropTop > 0 || cropRight > 0 || cropBottom > 0) && (
                <div className="mt-2 text-xs text-blue-700">
                  Current crop: Left {cropLeft.toFixed(0)}%, Top {cropTop.toFixed(0)}%, Right {cropRight.toFixed(0)}%, Bottom {cropBottom.toFixed(0)}%
                </div>
              )}
            </div>

            <div className="flex items-center justify-center" style={{ minHeight: '500px' }}>
              <div className="relative inline-block">
                <img
                  ref={imageRef}
                  src={cropImageElement.src}
                  alt="Crop"
                  className="max-w-full max-h-[500px] select-none"
                  draggable={false}
                />
                
                {/* Crop overlay - darkens areas outside crop */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(to right, 
                        rgba(0,0,0,0.6) ${cropLeft}%, 
                        transparent ${cropLeft}%, 
                        transparent ${100 - cropRight}%, 
                        rgba(0,0,0,0.6) ${100 - cropRight}%
                      ),
                      linear-gradient(to bottom, 
                        rgba(0,0,0,0.6) ${cropTop}%, 
                        transparent ${cropTop}%, 
                        transparent ${100 - cropBottom}%, 
                        rgba(0,0,0,0.6) ${100 - cropBottom}%
                      )
                    `
                  }}
                />

                {/* Crop area - clean single border */}
                <div
                  ref={cropAreaRef}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${cropLeft}%`,
                    top: `${cropTop}%`,
                    right: `${cropRight}%`,
                    bottom: `${cropBottom}%`,
                    border: '3px solid #3b82f6',
                    boxShadow: '0 0 0 1px white, 0 0 0 2000px rgba(0,0,0,0.6)',
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={(e) => {
                    // Only start dragging if clicking on the crop area itself, not on handles
                    if (e.target === e.currentTarget) {
                      handleCropMouseDown(e, 'move');
                    }
                  }}
                >
                  {/* Corner handles */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'nw'); }} />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'ne'); }} />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'sw'); }} />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'se'); }} />
                  
                  {/* Edge handles */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-n-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'n'); }} />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-s-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 's'); }} />
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-w-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'w'); }} />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-e-resize shadow-md" onMouseDown={(e) => { e.stopPropagation(); handleCropMouseDown(e, 'e'); }} />
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t bg-gray-50 flex justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCropLeft(0);
                  setCropTop(0);
                  setCropRight(0);
                  setCropBottom(0);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setCropLeft(25);
                  setCropTop(25);
                  setCropRight(25);
                  setCropBottom(25);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Center
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImageCropModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // VALIDATION WARNING MODAL (from old code - 1:1)
  const renderValidationWarningModal = () => {
    if (!showValidationWarning) return null;

    const { unassignedVariables, fieldsWithoutVariables } = validationWarnings || {};
    const hasUnassignedVars = unassignedVariables?.length > 0;
    const hasFieldsWithoutVars = fieldsWithoutVariables?.length > 0;

    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Validation Warning</h2>
                <p className="text-sm text-gray-600 mt-1">Potential issues have been found</p>
              </div>
            </div>
            <button
              onClick={() => setShowValidationWarning(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl px-2"
            >
              x
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Permanent Important Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-800">
                  <strong>Important:</strong> Data from input fields without an assigned variable will not be captured during contract creation and therefore will not be saved when creating a member.
                </div>
              </div>
            </div>

            {/* Unassigned Variables */}
            {hasUnassignedVars && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Unassigned Variables ({unassignedVariables.length})
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      These variables are currently not assigned to any field and will not be considered during contract creation.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {unassignedVariables.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              item.type === 'System' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-gray-900 font-medium">{item.variable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fields Without Variables */}
            {hasFieldsWithoutVars && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Fields Without Assigned Variable ({fieldsWithoutVariables.length})
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      These fields have no assigned variable and will not capture any data during contract creation.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <div className="space-y-3">
                        {fieldsWithoutVariables.map((item, index) => (
                          <div key={index} className="border-b border-yellow-200 last:border-b-0 pb-2 last:pb-0">
                            <div className="flex items-start gap-2 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                item.fieldType === 'System' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {item.fieldType}
                              </span>
                              <div className="flex-1">
                                <div className="text-gray-900 font-medium">{item.fieldLabel}</div>
                                <div className="text-gray-600 text-xs mt-1">
                                  Page {item.pageIndex}: {item.pageTitle}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t bg-gray-50 flex justify-end items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setShowValidationWarning(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAnyway}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Hotkeys Modal
    const renderHotkeysModal = () => {
    if (!showHotkeysModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-semibold text-black">Keyboard Shortcuts</h2>
            <button
              onClick={() => setShowHotkeysModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              
              {/* Navigation & Views */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Navigation & Views
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">New Page</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">N</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Add PDF</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">A</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Preview Contract</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">P</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Header/Footer Settings</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">H</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Next Page (Canvas & Preview)</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">→</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Previous Page (Canvas & Preview)</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">←</kbd>
                  </div>
                </div>
              </div>

              {/* Element Editing */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Element Editing
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Copy Element</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">C</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Delete Element</span>
                    <div className="flex gap-2">
                      <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Del</kbd>
                      <span className="text-gray-400">or</span>
                      <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Backspace</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zoom */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Zoom
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Zoom In (Canvas & Preview)</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Ctrl + Scroll ↑</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Zoom Out (Canvas & Preview)</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Ctrl + Scroll ↓</kbd>
                  </div>
                </div>
              </div>

              {/* Save & History */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Save & History
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Save Contract</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Ctrl + S</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Undo</span>
                    <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Ctrl + Z</kbd>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Redo</span>
                    <div className="flex gap-2">
                      <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Ctrl + Y</kbd>
                      <span className="text-gray-400">or</span>
                      <kbd className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded shadow-sm font-mono text-sm">Ctrl + Shift + Z</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Note</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Shortcuts work only when no input field is focused</li>
                  <li>• Shortcuts are disabled when modals are open (except in Preview)</li>
                  <li>• Arrow keys (← →) work in both Canvas and Preview mode for page navigation</li>
                  <li>• On Mac, use <kbd className="px-2 py-0.5 bg-gray-700 text-white border border-gray-600 rounded font-mono text-xs">Cmd</kbd> instead of <kbd className="px-2 py-0.5 bg-gray-700 text-white border border-gray-600 rounded font-mono text-xs">Ctrl</kbd></li>
                </ul>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={() => setShowHotkeysModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderPreview()}
      {renderAddPageModal()}
      {renderCreateFolderModal()}
      {renderEditFolderModal()}
      {renderHeaderFooterSettings()}
      {renderImageCropModal()}
      {renderValidationWarningModal()}
      {renderHotkeysModal()}
    </>
  );
};

export default Modals;