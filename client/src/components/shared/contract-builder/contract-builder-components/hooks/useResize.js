import { useState, useRef, useCallback } from 'react';

/**
 * Hook for handling element resizing via drag handles
 * Supports 8 resize handles (corners and edges)
 */
export const useResize = (
  contractPages,
  currentPage,
  setContractPages,
  selectedElement,
  saveToHistory,
  folders,
  dynamicContentArea
) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    elementX: 0,
    elementY: 0,
    elementWidth: 0,
    elementHeight: 0
  });

  const handleResizeStart = useCallback((elementId, handle, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = contractPages[currentPage]?.elements.find(el => el.id === elementId);
    if (!element) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    
    resizeStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      elementX: element.x,
      elementY: element.y,
      elementWidth: element.width,
      elementHeight: element.height
    };
    
    // Set cursor based on handle type
    if (handle === 'rotate') {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = getCursorForHandle(handle);
    }
    document.body.style.userSelect = 'none';
  }, [contractPages, currentPage]);

  const handleResize = useCallback((e) => {
    if (!isResizing || !selectedElement || !resizeHandle) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (clientX == null || clientY == null) return;
    
    const element = contractPages[currentPage]?.elements.find(el => el.id === selectedElement);
    if (!element) return;
    
    // Handle rotation
    if (resizeHandle === 'rotate') {
      // Calculate angle based on mouse position relative to element center
      const elementCenterX = resizeStartRef.current.elementX + resizeStartRef.current.elementWidth / 2;
      const elementCenterY = resizeStartRef.current.elementY + resizeStartRef.current.elementHeight / 2;
      
      // Get canvas offset
      const canvas = document.querySelector('.bg-white.shadow-lg.mx-auto.my-4');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      const canvasScale = canvasRect.width / 794; // PAGE_WIDTH_PX = 794
      
      // Calculate mouse position relative to canvas
      const mouseXInCanvas = (clientX - canvasRect.left) / canvasScale;
      const mouseYInCanvas = (clientY - canvasRect.top) / canvasScale;
      
      // Calculate angle in degrees
      const deltaX = mouseXInCanvas - (76 + elementCenterX); // 76 = MARGIN_PX
      const deltaY = mouseYInCanvas - (dynamicContentArea.top + elementCenterY);
      const angleRad = Math.atan2(deltaY, deltaX);
      // Normalize angle to 0-360 range (handle negative values correctly)
      const angleDeg = ((angleRad * 180 / Math.PI + 90) % 360 + 360) % 360;
      
      // Round to nearest 1 degree for smoother control
      const roundedAngle = Math.round(angleDeg);
      
      // Calculate rotated bounding box to check if element stays within content area
      const width = resizeStartRef.current.elementWidth;
      const height = resizeStartRef.current.elementHeight;
      const x = resizeStartRef.current.elementX;
      const y = resizeStartRef.current.elementY;
      
      // Helper function to calculate rotated bounding box
      const getRotatedBoundingBox = (cx, cy, w, h, angle) => {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        // Calculate all 4 corners relative to center
        const corners = [
          { x: -w/2, y: -h/2 },
          { x: w/2, y: -h/2 },
          { x: w/2, y: h/2 },
          { x: -w/2, y: h/2 }
        ];
        
        // Rotate corners and find min/max
        const rotatedCorners = corners.map(corner => ({
          x: cx + corner.x * cos - corner.y * sin,
          y: cy + corner.x * sin + corner.y * cos
        }));
        
        const minX = Math.min(...rotatedCorners.map(c => c.x));
        const maxX = Math.max(...rotatedCorners.map(c => c.x));
        const minY = Math.min(...rotatedCorners.map(c => c.y));
        const maxY = Math.max(...rotatedCorners.map(c => c.y));
        
        return { minX, maxX, minY, maxY };
      };
      
      // Check if rotated element stays within bounds
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const bbox = getRotatedBoundingBox(centerX, centerY, width, height, roundedAngle);
      
      const maxWidth = 642; // CONTENT_WIDTH_PX
      const maxHeight = dynamicContentArea.height;
      
      // Check if bounding box is within content area
      const isWithinBounds = 
        bbox.minX >= 0 && 
        bbox.maxX <= maxWidth && 
        bbox.minY >= 0 && 
        bbox.maxY <= maxHeight;
      
      // Only update rotation if it keeps element within bounds
      if (isWithinBounds) {
        // Update element rotation
        const newPages = contractPages.map((page, pIdx) => {
          if (pIdx !== currentPage) return page;
          const newElements = page.elements.map(el => {
            if (el.id !== selectedElement) return el;
            return {
              ...el,
              rotation: roundedAngle
            };
          });
          return { ...page, elements: newElements };
        });
        
        setContractPages(newPages);
      }
      // If out of bounds, don't update (rotation is blocked at this angle)
      return;
    }
    
    const deltaX = clientX - resizeStartRef.current.mouseX;
    const deltaY = clientY - resizeStartRef.current.mouseY;
    
    let newX = resizeStartRef.current.elementX;
    let newY = resizeStartRef.current.elementY;
    let newWidth = resizeStartRef.current.elementWidth;
    let newHeight = resizeStartRef.current.elementHeight;
    
    // Minimum sizes
    const MIN_WIDTH = 50;
    const MIN_HEIGHT = 30;
    
    // Calculate new dimensions based on handle
    switch (resizeHandle) {
      case 'nw': // Top-left
        newX = resizeStartRef.current.elementX + deltaX;
        newY = resizeStartRef.current.elementY + deltaY;
        newWidth = resizeStartRef.current.elementWidth - deltaX;
        newHeight = resizeStartRef.current.elementHeight - deltaY;
        break;
      case 'n': // Top-center
        newY = resizeStartRef.current.elementY + deltaY;
        newHeight = resizeStartRef.current.elementHeight - deltaY;
        break;
      case 'ne': // Top-right
        newY = resizeStartRef.current.elementY + deltaY;
        newWidth = resizeStartRef.current.elementWidth + deltaX;
        newHeight = resizeStartRef.current.elementHeight - deltaY;
        break;
      case 'w': // Middle-left
        newX = resizeStartRef.current.elementX + deltaX;
        newWidth = resizeStartRef.current.elementWidth - deltaX;
        break;
      case 'e': // Middle-right
        newWidth = resizeStartRef.current.elementWidth + deltaX;
        break;
      case 'sw': // Bottom-left
        newX = resizeStartRef.current.elementX + deltaX;
        newWidth = resizeStartRef.current.elementWidth - deltaX;
        newHeight = resizeStartRef.current.elementHeight + deltaY;
        break;
      case 's': // Bottom-center
        newHeight = resizeStartRef.current.elementHeight + deltaY;
        break;
      case 'se': // Bottom-right
        newWidth = resizeStartRef.current.elementWidth + deltaX;
        newHeight = resizeStartRef.current.elementHeight + deltaY;
        break;
    }
    
    // ASPECT RATIO LOCK: Maintain proportions for images when enabled
    if (element.type === 'image' && element.maintainAspectRatio !== false) {
      const originalAspectRatio = resizeStartRef.current.elementWidth / resizeStartRef.current.elementHeight;
      
      // For corner handles (nw, ne, sw, se), maintain aspect ratio
      if (['nw', 'ne', 'sw', 'se'].includes(resizeHandle)) {
        // Use width as primary dimension for corner resizing
        newHeight = newWidth / originalAspectRatio;
        
        // Adjust position for top handles
        if (resizeHandle === 'nw' || resizeHandle === 'ne') {
          const heightDiff = newHeight - resizeStartRef.current.elementHeight;
          newY = resizeStartRef.current.elementY - heightDiff;
        }
        
        // Adjust position for left handles
        if (resizeHandle === 'nw' || resizeHandle === 'sw') {
          const widthDiff = newWidth - resizeStartRef.current.elementWidth;
          newX = resizeStartRef.current.elementX - widthDiff;
        }
      }
      // For edge handles (n, s, e, w), adjust the other dimension
      else if (resizeHandle === 'n' || resizeHandle === 's') {
        newWidth = newHeight * originalAspectRatio;
      } else if (resizeHandle === 'e' || resizeHandle === 'w') {
        newHeight = newWidth / originalAspectRatio;
        
        // Adjust position for left handle
        if (resizeHandle === 'w') {
          const widthDiff = newWidth - resizeStartRef.current.elementWidth;
          newX = resizeStartRef.current.elementX - widthDiff;
        }
      }
    }
    
    // FIX ISSUE 3: Calculate element-specific minimum heights based on internal structure
    let elementMinHeight = MIN_HEIGHT;
    let elementMaxHeight = null; // NEW: Maximum height for certain element types
    
    if (element.type === 'text' || element.type === 'system-text') {
      // Variable fields need space for label + input field
      const labelHeight = (element.labelFontSize || 14) * 1.2; // Line height factor
      const inputHeight = (element.inputFontSize || 14) * 2.0; // Input field height (reduced from 2.5 to 2.0 for more flexibility)
      const spacing = 4; // Gap between label and input (reduced from 8 to 4)
      const padding = 4; // Top/bottom padding
      elementMinHeight = Math.ceil(labelHeight + inputHeight + spacing + padding);
    } else if (element.type === 'checkbox') {
      // Checkbox needs space for checkbox + label + optional description
      const labelHeight = (element.checkboxLabelSize || 16) * 1.2;
      const checkboxSpace = 24; // Checkbox + padding
      let totalHeight = checkboxSpace + labelHeight;
      
      if (element.showDescription !== false && element.description) {
        const descHeight = (element.checkboxDescriptionSize || 14) * 1.2;
        totalHeight += descHeight + 8; // Description + spacing
      }
      elementMinHeight = Math.ceil(totalHeight + 16); // Additional padding
    } else if (element.type === 'signature') {
      // Signature needs space for optional location/date + signature line + optional below text
      const fontSize = element.signatureFontSize || 14;
      const lineHeight = fontSize * 1.2;
      let totalHeight = 32; // Signature line + spacing
      
      if (element.showLocationDate !== false) {
        totalHeight += lineHeight + 8; // Location/date line + spacing
      }
      
      if (element.showBelowSignature !== false) {
        totalHeight += lineHeight + 8; // Below signature text + spacing
      }
      
      elementMinHeight = Math.ceil(totalHeight + 16); // Additional padding
    } else if (element.type === 'heading' || element.type === 'subheading') {
      // Headings need space for their font size
      const fontSize = element.fontSize || (element.type === 'heading' ? 24 : 18);
      elementMinHeight = Math.ceil(fontSize * 1.4); // Include line height and padding
    } else if (element.type === 'textarea') {
      // Paragraphs need space for at least 2 lines of text
      const fontSize = element.fontSize || 14;
      const lineHeight = element.lineHeight || 1.5;
      elementMinHeight = Math.ceil(fontSize * lineHeight * 2 + 16); // 2 lines + padding
    } else if (element.type === 'divider') {
      // NEW: Divider has special constraints - must be between 2px and 10px
      elementMinHeight = 2;
      elementMaxHeight = 10;
    }
    
    // Apply minimum constraints with element-specific minimums
    if (newWidth < MIN_WIDTH) {
      if (resizeHandle.includes('w')) {
        newX = resizeStartRef.current.elementX + resizeStartRef.current.elementWidth - MIN_WIDTH;
      }
      newWidth = MIN_WIDTH;
    }
    
    if (newHeight < elementMinHeight) {
      if (resizeHandle.includes('n')) {
        newY = resizeStartRef.current.elementY + resizeStartRef.current.elementHeight - elementMinHeight;
      }
      newHeight = elementMinHeight;
    }
    
    // NEW: Apply maximum height constraints if defined
    if (elementMaxHeight !== null && newHeight > elementMaxHeight) {
      if (resizeHandle.includes('n')) {
        // When resizing from top, adjust Y position to maintain bottom edge
        newY = resizeStartRef.current.elementY + resizeStartRef.current.elementHeight - elementMaxHeight;
      }
      newHeight = elementMaxHeight;
    }
    
    // Clamp to content area bounds
    const maxWidth = 642; // CONTENT_WIDTH_PX
    const maxHeight = dynamicContentArea.height;
    
    // Don't allow resizing beyond right edge
    if (newX + newWidth > maxWidth) {
      if (resizeHandle.includes('e')) {
        newWidth = maxWidth - newX;
      } else if (resizeHandle.includes('w')) {
        newX = maxWidth - newWidth;
        if (newX < 0) {
          newX = 0;
          newWidth = maxWidth;
        }
      }
    }
    
    // Don't allow resizing beyond bottom edge
    if (newY + newHeight > maxHeight) {
      if (resizeHandle.includes('s')) {
        newHeight = maxHeight - newY;
      } else if (resizeHandle.includes('n')) {
        newY = maxHeight - newHeight;
        if (newY < 0) {
          newY = 0;
          newHeight = maxHeight;
        }
      }
    }
    
    // Don't allow negative positions
    if (newX < 0) {
      if (resizeHandle.includes('w')) {
        newWidth = newWidth + newX;
        newX = 0;
      }
    }
    
    if (newY < 0) {
      if (resizeHandle.includes('n')) {
        newHeight = newHeight + newY;
        newY = 0;
      }
    }
    
    // Update element
    const newPages = contractPages.map((page, pIdx) => {
      if (pIdx !== currentPage) return page;
      const newElements = page.elements.map(el => {
        if (el.id !== selectedElement) return el;
        
        // For text/system-text fields, update initialWidth when manually resized
        const updatedElement = {
          ...el,
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        };
        
        // Update initialWidth for variable fields when resized
        if (el.type === 'text' || el.type === 'system-text') {
          updatedElement.initialWidth = Math.round(newWidth);
        }
        
        return updatedElement;
      });
      return { ...page, elements: newElements };
    });
    
    setContractPages(newPages);
  }, [isResizing, selectedElement, resizeHandle, contractPages, currentPage, setContractPages, dynamicContentArea]);

  const handleResizeEnd = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      if (selectedElement) {
        saveToHistory(contractPages, folders, 'resize_element');
      }
    }
  }, [isResizing, selectedElement, contractPages, folders, saveToHistory]);

  return {
    isResizing,
    resizeHandle,
    handleResizeStart,
    handleResize,
    handleResizeEnd
  };
};

/**
 * Get the appropriate cursor style for each resize handle
 */
function getCursorForHandle(handle) {
  const cursors = {
    'nw': 'nw-resize',
    'n': 'n-resize',
    'ne': 'ne-resize',
    'w': 'w-resize',
    'e': 'e-resize',
    'sw': 'sw-resize',
    's': 's-resize',
    'se': 'se-resize',
    'rotate': 'grab'
  };
  return cursors[handle] || 'default';
}
