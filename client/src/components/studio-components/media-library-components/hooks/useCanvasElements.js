import { useState, useCallback, useRef } from 'react';
import { generateId, deepClone, getCanvasDimensions, scaleElementToCanvas } from '../utils/canvasUtils';

/**
 * Custom hook for managing canvas elements
 */
export const useCanvasElements = (initialElements = []) => {
  const [elements, setElements] = useState(initialElements);
  const [activeElementId, setActiveElementId] = useState(null);
  const [lockedElements, setLockedElements] = useState(new Set());
  const [hiddenLayers, setHiddenLayers] = useState(new Set());
  const [history, setHistory] = useState([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Add element to canvas
  const addElement = useCallback((element) => {
    const newElement = {
      ...element,
      id: element.id || generateId(),
      zIndex: element.zIndex ?? elements.length
    };
    
    setElements(prev => {
      const newElements = [...prev, newElement];
      // Add to history
      setHistory(h => [...h.slice(0, historyIndex + 1), newElements]);
      setHistoryIndex(i => i + 1);
      return newElements;
    });
    
    setActiveElementId(newElement.id);
    return newElement.id;
  }, [elements.length, historyIndex]);
  
  // Update element
  const updateElement = useCallback((id, updates) => {
    if (lockedElements.has(id)) return;
    
    setElements(prev => {
      const newElements = prev.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );
      return newElements;
    });
  }, [lockedElements]);
  
  // Update element with history
  const updateElementWithHistory = useCallback((id, updates) => {
    if (lockedElements.has(id)) return;
    
    setElements(prev => {
      const newElements = prev.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );
      setHistory(h => [...h.slice(0, historyIndex + 1), newElements]);
      setHistoryIndex(i => i + 1);
      return newElements;
    });
  }, [lockedElements, historyIndex]);
  
  // Delete element
  const deleteElement = useCallback((id) => {
    if (lockedElements.has(id)) return false;
    
    setElements(prev => {
      const newElements = prev.filter(el => el.id !== id);
      setHistory(h => [...h.slice(0, historyIndex + 1), newElements]);
      setHistoryIndex(i => i + 1);
      return newElements;
    });
    
    if (activeElementId === id) {
      setActiveElementId(null);
    }
    
    setLockedElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    return true;
  }, [activeElementId, lockedElements, historyIndex]);
  
  // Toggle element lock
  const toggleLock = useCallback((id) => {
    setLockedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  
  // Toggle element visibility
  const toggleVisibility = useCallback((id) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  
  // Reorder elements (change z-index) - takes element IDs
  const reorderElements = useCallback((draggedId, targetId, position = 'before') => {
    setElements(prev => {
      const draggedElement = prev.find(el => el.id === draggedId);
      const targetElement = prev.find(el => el.id === targetId);
      
      if (!draggedElement || !targetElement) return prev;
      
      // Remove dragged element
      const newElements = prev.filter(el => el.id !== draggedId);
      
      // Find target index
      const targetIndex = newElements.findIndex(el => el.id === targetId);
      
      // Insert at correct position
      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
      newElements.splice(insertIndex, 0, draggedElement);
      
      // Update z-indices
      return newElements.map((el, index) => ({
        ...el,
        zIndex: index
      }));
    });
  }, []);
  
  // Move element to front
  const bringToFront = useCallback((id) => {
    setElements(prev => {
      const maxZIndex = Math.max(...prev.map(el => el.zIndex || 0));
      return prev.map(el => 
        el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
      );
    });
  }, []);
  
  // Move element to back
  const sendToBack = useCallback((id) => {
    setElements(prev => {
      const minZIndex = Math.min(...prev.map(el => el.zIndex || 0));
      return prev.map(el => 
        el.id === id ? { ...el, zIndex: minZIndex - 1 } : el
      );
    });
  }, []);
  
  // Duplicate element
  const duplicateElement = useCallback((id) => {
    const element = elements.find(el => el.id === id);
    if (!element) return null;
    
    const duplicated = {
      ...deepClone(element),
      id: generateId(),
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length
    };
    
    setElements(prev => [...prev, duplicated]);
    setActiveElementId(duplicated.id);
    return duplicated.id;
  }, [elements]);
  
  // Clear all elements
  const clearAll = useCallback(() => {
    setElements([]);
    setActiveElementId(null);
    setLockedElements(new Set());
    setHiddenLayers(new Set());
    setHistory([[]]);
    setHistoryIndex(0);
  }, []);
  
  // Load elements (e.g., from template) - with scaling
  const loadElements = useCallback((newElements, imageSize) => {
    const canvasDim = getCanvasDimensions(imageSize);
    
    // Scale elements from template size to canvas size
    const scaledElements = newElements.map((el, index) => {
      const scaled = scaleElementToCanvas(el, imageSize, canvasDim);
      return {
        ...scaled,
        id: generateId(),
        zIndex: index
      };
    });
    
    setElements(scaledElements);
    setActiveElementId(null);
    setLockedElements(new Set());
    setHiddenLayers(new Set());
    setHistory([scaledElements]);
    setHistoryIndex(0);
  }, []);
  
  // Set initial elements directly without scaling (for editing existing designs)
  const setInitialElements = useCallback((newElements) => {
    // Keep existing IDs and properties, just ensure zIndex is set
    const elementsWithZIndex = newElements.map((el, index) => ({
      ...el,
      zIndex: el.zIndex ?? index
    }));
    
    setElements(elementsWithZIndex);
    setActiveElementId(null);
    setLockedElements(new Set());
    setHiddenLayers(new Set());
    setHistory([elementsWithZIndex]);
    setHistoryIndex(0);
  }, []);
  
  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);
  
  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(i => i + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);
  
  // Get active element
  const activeElement = elements.find(el => el.id === activeElementId);
  
  // Get visible elements sorted by z-index
  const visibleElements = elements
    .filter(el => !hiddenLayers.has(el.id))
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  return {
    elements,
    setElements,
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
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};

export default useCanvasElements;
