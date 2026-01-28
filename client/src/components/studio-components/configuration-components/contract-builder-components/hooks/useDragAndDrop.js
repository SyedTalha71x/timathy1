import { useState, useRef, useCallback } from 'react';
import { calculateSnapLines, calculateSnappedPosition } from '../utils/layoutUtils';

export const useDragAndDrop = (
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
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [snapLines, setSnapLines] = useState([]);
  const [draggedElementIndex, setDraggedElementIndex] = useState(null);
  const [dragOverElementIndex, setDragOverElementIndex] = useState(null);
  const [isDraggingPage, setIsDraggingPage] = useState(false);
  const [dragOverPageIndex, setDragOverPageIndex] = useState(null);
  const [draggedPageIndex, setDraggedPageIndex] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'before' or 'after'

  const dragStartMousePosition = useRef({ x: 0, y: 0 });
  const dragStartElementPosition = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const containerRef = useRef();
  const dropZoneRef = useRef(null);

  const handleDragStart = useCallback((elementId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const elNode = e.currentTarget;
    if (!elNode || !containerRef.current) return;
    
    setIsDragging(true);
    isDraggingRef.current = true;
    setSelectedElement(elementId);
    
    const mouseX = e.clientX || (e.touches && e.touches[0].clientX);
    const mouseY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStartMousePosition.current = { 
      x: mouseX, 
      y: mouseY 
    };
    
    const currentElement = contractPages[currentPage]?.elements.find(el => el.id === elementId);
    dragStartElementPosition.current = {
      x: currentElement.x,
      y: currentElement.y
    };
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [contractPages, currentPage, setSelectedElement]);

  const handleDrag = useCallback((e) => {
    if (!isDraggingRef.current || !selectedElement || !containerRef.current) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (clientX == null || clientY == null) return;

    const deltaX = clientX - dragStartMousePosition.current.x;
    const deltaY = clientY - dragStartMousePosition.current.y;
    
    const currentElement = contractPages[currentPage]?.elements.find(el => el.id === selectedElement);
    if (!currentElement) return;
    
    let newX = dragStartElementPosition.current.x + deltaX;
    let newY = dragStartElementPosition.current.y + deltaY;
    
    // If element is rotated, check rotated bounding box
    if (currentElement.rotation && currentElement.rotation !== 0) {
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
      
      // Calculate center position with new x, y
      const centerX = newX + currentElement.width / 2;
      const centerY = newY + currentElement.height / 2;
      const bbox = getRotatedBoundingBox(centerX, centerY, currentElement.width, currentElement.height, currentElement.rotation);
      
      const maxWidth = 642; // CONTENT_WIDTH_PX
      const maxHeight = dynamicContentArea.height;
      
      // Constrain position to keep rotated bounding box within content area
      if (bbox.minX < 0) {
        newX = newX - bbox.minX;
      }
      if (bbox.maxX > maxWidth) {
        newX = newX - (bbox.maxX - maxWidth);
      }
      if (bbox.minY < 0) {
        newY = newY - bbox.minY;
      }
      if (bbox.maxY > maxHeight) {
        newY = newY - (bbox.maxY - maxHeight);
      }
      
      // Recalculate bbox with constrained position to ensure it's fully within bounds
      const constrainedCenterX = newX + currentElement.width / 2;
      const constrainedCenterY = newY + currentElement.height / 2;
      const constrainedBbox = getRotatedBoundingBox(constrainedCenterX, constrainedCenterY, currentElement.width, currentElement.height, currentElement.rotation);
      
      // Final clamp to ensure no overflow
      if (constrainedBbox.minX < 0 || constrainedBbox.maxX > maxWidth || constrainedBbox.minY < 0 || constrainedBbox.maxY > maxHeight) {
        // If still out of bounds, don't update position
        return;
      }
    } else {
      // Standard non-rotated element boundary check
      const maxX = 642 - currentElement.width;
      const maxY = Math.max(0, dynamicContentArea.height - currentElement.height);
      
      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));
    }
    
    // Calculate snaplines with improved system
    const otherElements = contractPages[currentPage]?.elements.filter(el => el.id !== selectedElement && el.visible) || [];
    const tempElement = {...currentElement, x: newX, y: newY, width: currentElement.width, height: currentElement.height};
    const calculatedSnapLines = calculateSnapLines(tempElement, otherElements, dynamicContentArea);
    
    // Apply snapping to position
    const snappedPosition = calculateSnappedPosition(tempElement, calculatedSnapLines);
    
    if (snappedPosition.snapped) {
      newX = snappedPosition.x;
      newY = snappedPosition.y;
    }
    
    // Update snaplines for visual feedback (only show active snap lines)
    setSnapLines(calculatedSnapLines);
    
    if (Math.round(newX) !== currentElement.x || Math.round(newY) !== currentElement.y) {
      const newPages = contractPages.map((page, pIdx) => {
        if (pIdx !== currentPage) return page;
        const newElements = page.elements.map(el => {
          if (el.id !== selectedElement) return el;
          return { ...el, x: Math.round(newX), y: Math.round(newY) };
        });
        return { ...page, elements: newElements };
      });
      setContractPages(newPages);
    }
  }, [selectedElement, contractPages, currentPage, setContractPages, dynamicContentArea]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
    setSnapLines([]);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (selectedElement) {
      saveToHistory(contractPages, folders, 'drag_element');
    }
  }, [selectedElement, contractPages, folders, saveToHistory]);

  const handleElementDragStart = useCallback((e, index, elementId = null, isFolder = false, folderId = null) => {
    e.stopPropagation();
    setDraggedElementIndex(index);
    dropZoneRef.current = null;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('elementId', elementId || '');
    e.dataTransfer.setData('isFolder', isFolder.toString());
    e.dataTransfer.setData('folderId', folderId || '');
    e.dataTransfer.setData('draggedIndex', index.toString());
    
    console.log('ðŸš€ Drag start:', { 
      index, 
      elementId, 
      isFolder, 
      folderId,
      elementIdType: typeof elementId 
    });
  }, []);

  const handleElementDragOver = useCallback((e, index, isFolder = false, folderId = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const relativeY = mouseY - rect.top;
    const height = rect.height;
    
    // Default to 50/50 split for before/after
    const dropZone = relativeY < height / 2 ? 'before' : 'after';
    dropZoneRef.current = dropZone;
    
    // Visual feedback
    e.currentTarget.setAttribute('data-drop-zone', dropZone);
    
    const isDraggingFolder = e.dataTransfer.getData('isFolder') === 'true';
    
    // Special handling for folders: larger "into" zone when dragging an element
    if (isFolder && folderId && !isDraggingFolder) {
      // Large "into" zone: 20% to 80% of folder height (60% total)
      // This makes it much easier to drop into folders
      if (relativeY > height * 0.20 && relativeY < height * 0.80) {
        dropZoneRef.current = 'into';
        e.currentTarget.setAttribute('data-drop-zone', 'into');
        e.currentTarget.style.borderTop = '';
        e.currentTarget.style.borderBottom = '';
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        e.currentTarget.style.outline = '2px dashed #3b82f6';
        e.currentTarget.style.outlineOffset = '-2px';
        
        // Add a visual indicator icon
        if (!e.currentTarget.querySelector('.drop-into-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'drop-into-indicator';
          indicator.style.cssText = `
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: #3b82f6;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            pointer-events: none;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          `;
          indicator.textContent = 'â†“ In Folder';
          e.currentTarget.appendChild(indicator);
        }
      } else {
        // In the outer 20% zones - show before/after
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.outline = '';
        
        // Remove indicator if exists
        const indicator = e.currentTarget.querySelector('.drop-into-indicator');
        if (indicator) indicator.remove();
        
        if (relativeY <= height * 0.20) {
          dropZoneRef.current = 'before';
          e.currentTarget.style.borderTop = '3px solid #3b82f6';
          e.currentTarget.style.borderBottom = '';
        } else {
          dropZoneRef.current = 'after';
          e.currentTarget.style.borderTop = '';
          e.currentTarget.style.borderBottom = '3px solid #3b82f6';
        }
      }
    } else {
      // Regular element or folder-to-folder drag
      e.currentTarget.style.backgroundColor = '';
      e.currentTarget.style.outline = '';
      
      if (dropZone === 'before') {
        e.currentTarget.style.borderTop = '3px solid #3b82f6';
        e.currentTarget.style.borderBottom = '';
      } else {
        e.currentTarget.style.borderTop = '';
        e.currentTarget.style.borderBottom = '3px solid #3b82f6';
      }
    }
    
    setDragOverElementIndex(index);
  }, []);

  const handleElementDragLeave = useCallback((e) => {
    e.stopPropagation();
    
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget;
    
    // Only reset if we're actually leaving the element
    if (!currentTarget.contains(relatedTarget)) {
      currentTarget.style.borderTop = '';
      currentTarget.style.borderBottom = '';
      currentTarget.style.backgroundColor = '';
      currentTarget.style.outline = '';
      currentTarget.removeAttribute('data-drop-zone');
      
      // Remove drop indicator if exists
      const indicator = currentTarget.querySelector('.drop-into-indicator');
      if (indicator) indicator.remove();
    }
  }, []);

  const handleElementDrop = useCallback((e, dropIndex, isFolder = false, targetFolderId = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedElementId = e.dataTransfer.getData('elementId');
    const isDraggingFolder = e.dataTransfer.getData('isFolder') === 'true';
    const sourceFolderId = e.dataTransfer.getData('folderId');
    const dropZone = dropZoneRef.current;
    
    console.log('🎯 Drop:', { draggedElementId, isDraggingFolder, sourceFolderId, dropIndex, dropZone, targetFolderId, isFolder });
    
    // Reset visual styles
    if (e.currentTarget) {
      e.currentTarget.removeAttribute('data-drop-zone');
      e.currentTarget.style.borderTop = '';
      e.currentTarget.style.borderBottom = '';
      e.currentTarget.style.backgroundColor = '';
      e.currentTarget.style.outline = '';
      
      const indicator = e.currentTarget.querySelector('.drop-into-indicator');
      if (indicator) indicator.remove();
    }
    
    // CASE 1: Drop INTO folder (drag onto folder itself)
    // BUT: If dragging from the SAME folder, treat as "drag out" instead
    if (dropZone === 'into' && isFolder && targetFolderId && draggedElementId && !isDraggingFolder) {
      // Check if element is being dragged FROM this same folder
      if (sourceFolderId && String(sourceFolderId) === String(targetFolderId)) {
        console.log('→ Element dragged from same folder onto folder - treating as drag OUT');
        // Fall through to CASE 3 (drag out logic)
      } else {
        console.log('→ Drop INTO folder');
        const elementId = parseInt(draggedElementId);
        
        const newPages = contractPages.map((page, idx) => {
          if (idx !== currentPage) return page;
          return {
            ...page,
            elements: page.elements.map(el => 
              el.id === elementId ? { ...el, folderId: targetFolderId } : el
            )
          };
        });

        const newFolders = folders.map(folder => {
          if (String(folder.id) === String(targetFolderId)) {
            const elementIds = [...(folder.elementIds || [])];
            if (!elementIds.includes(elementId)) elementIds.push(elementId);
            return { ...folder, elementIds };
          }
          if (sourceFolderId && String(folder.id) === String(sourceFolderId)) {
            return { ...folder, elementIds: (folder.elementIds || []).filter(id => id !== elementId) };
          }
          return folder;
        });

        setContractPages(newPages);
        setFolders(newFolders);
        saveToHistory(newPages, newFolders, 'add_to_folder');
        setDraggedElementIndex(null);
        setDragOverElementIndex(null);
        dropZoneRef.current = null;
        return;
      }
    }
    
    const currentPageData = contractPages[currentPage];
    if (!currentPageData || !draggedElementId) return;
    
    // Build the visible items list to understand what we're dropping onto
    // This MUST match the order in PropertiesPanel exactly
    const allElements = currentPageData.elements || [];
    const sortedFolders = [...folders].sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    const independentElements = allElements.filter(el => !el.folderId).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    
    // Combine folders and independent elements, then sort
    const layerItems = [
      ...sortedFolders.map(f => ({ type: 'folder', data: f, sortIndex: f.sortIndex || 0 })),
      ...independentElements.map(el => ({ type: 'element', data: el, sortIndex: el.sortIndex || 0 }))
    ];
    layerItems.sort((a, b) => a.sortIndex - b.sortIndex);
    
    const visibleItems = [];
    let itemIdx = 0;
    
    layerItems.forEach(item => {
      if (item.type === 'folder') {
        const folder = item.data;
        visibleItems.push({ type: 'folder', data: folder, index: itemIdx++ });
        
        if (folder.expanded && folder.elementIds.length > 0) {
          folder.elementIds.forEach(elementId => {
            const element = allElements.find(el => el.id === elementId);
            if (element) {
              visibleItems.push({ 
                type: 'folderElement', 
                data: element, 
                folderId: folder.id, 
                index: itemIdx++ 
              });
            }
          });
        }
      } else {
        visibleItems.push({ type: 'element', data: item.data, index: itemIdx++ });
      }
    });
    
    const dropTargetItem = visibleItems[dropIndex];
    const draggedId = parseInt(draggedElementId);
    
    console.log('📋 Visible items:', visibleItems.map((it, i) => `${i}: ${it.type} ${it.data?.id || it.data?.name}`));
    console.log('🎯 Drop target:', dropTargetItem);
    
    // CASE 2: Drop onto a folder element - add to that folder OR reorder within folder
    if (!isDraggingFolder && dropTargetItem && dropTargetItem.type === 'folderElement') {
      const targetFolderId = dropTargetItem.folderId;
      
      // CASE 2A: Element is already in the same folder - reorder within folder
      if (sourceFolderId && String(sourceFolderId) === String(targetFolderId)) {
        console.log('🔄 Reordering within folder:', targetFolderId);
        
        const targetFolder = folders.find(f => String(f.id) === String(targetFolderId));
        if (!targetFolder) return;
        
        const elementIds = [...targetFolder.elementIds];
        const dropTargetId = dropTargetItem.data.id;
        
        const draggedIndex = elementIds.indexOf(draggedId);
        const dropTargetIndex = elementIds.indexOf(dropTargetId);
        
        if (draggedIndex === -1 || dropTargetIndex === -1) {
          console.error('❌ Element not found in folder elementIds');
          return;
        }
        
        // Remove from current position
        elementIds.splice(draggedIndex, 1);
        
        // Calculate new position
        let newIndex = dropTargetIndex;
        if (draggedIndex < dropTargetIndex) {
          newIndex--;
        }
        
        if (dropZone === 'after') {
          newIndex++;
        }
        
        // Insert at new position
        elementIds.splice(newIndex, 0, draggedId);
        
        const newFolders = folders.map(f =>
          String(f.id) === String(targetFolderId) ? { ...f, elementIds } : f
        );
        
        setFolders(newFolders);
        saveToHistory(contractPages, newFolders, 'reorder_in_folder');
        setDraggedElementIndex(null);
        setDragOverElementIndex(null);
        dropZoneRef.current = null;
        return;
      }
      
      // CASE 2B: Element is NOT in this folder - add it to the folder
      console.log('➕ Adding element to folder:', targetFolderId);
      
      const targetFolder = folders.find(f => String(f.id) === String(targetFolderId));
      if (!targetFolder) return;
      
      const dropTargetId = dropTargetItem.data.id;
      const elementIds = [...targetFolder.elementIds];
      const dropTargetIndex = elementIds.indexOf(dropTargetId);
      
      if (dropTargetIndex === -1) return;
      
      // Calculate insertion position
      let insertIndex = dropTargetIndex;
      if (dropZone === 'after') {
        insertIndex++;
      }
      
      // Insert element at specific position in folder
      elementIds.splice(insertIndex, 0, draggedId);
      
      const newFolders = folders.map(folder => {
        if (String(folder.id) === String(targetFolderId)) {
          return { ...folder, elementIds };
        }
        // Remove from source folder if it was in one
        if (sourceFolderId && String(folder.id) === String(sourceFolderId)) {
          return { ...folder, elementIds: folder.elementIds.filter(id => id !== draggedId) };
        }
        return folder;
      });
      
      const newElements = currentPageData.elements.map(el => 
        el.id === draggedId ? { ...el, folderId: targetFolderId } : el
      );
      
      const newPages = contractPages.map((page, idx) => 
        idx === currentPage ? { ...page, elements: newElements } : page
      );
      
      setContractPages(newPages);
      setFolders(newFolders);
      saveToHistory(newPages, newFolders, 'add_to_folder');
      setDraggedElementIndex(null);
      setDragOverElementIndex(null);
      dropZoneRef.current = null;
      return;
    }
    
    // CASE 3: Reorder top-level items (folders and independent elements)
    // This includes dragging elements OUT of folders onto the top level
    console.log('→ Reorder top-level items');
    
    // Build sorted list of all top-level items
    const allItems = [
      ...folders.map(f => ({ type: 'folder', id: f.id, data: f, sortIndex: f.sortIndex || 0 })),
      ...independentElements.map(el => ({ type: 'element', id: el.id, data: el, sortIndex: el.sortIndex || 0 }))
    ];
    allItems.sort((a, b) => a.sortIndex - b.sortIndex);
    
    console.log('📋 Top-level items before:', allItems.map((it, i) => `${i}: ${it.type} ${it.id}`));
    
    // Find dragged item
    let draggedIdx = allItems.findIndex(it => 
      (isDraggingFolder && it.type === 'folder' && String(it.id) === String(draggedId)) ||
      (!isDraggingFolder && it.type === 'element' && String(it.id) === String(draggedId))
    );
    
    // If element is in a folder, it's not in allItems yet - add it
    if (draggedIdx === -1 && !isDraggingFolder && sourceFolderId) {
      console.log('🎯 Dragging element OUT of folder:', sourceFolderId);
      
      const draggedElement = allElements.find(el => String(el.id) === String(draggedId));
      if (!draggedElement) {
        console.error('❌ Element not found');
        return;
      }
      
      // Create item for this element
      const newItem = { 
        type: 'element', 
        id: draggedElement.id, 
        data: draggedElement, 
        sortIndex: 0 
      };
      
      // Calculate insert position based on drop target
      let insertIdx = dropIndex;
      if (dropZone === 'after') {
        insertIdx++;
      }
      insertIdx = Math.max(0, Math.min(insertIdx, allItems.length));
      
      allItems.splice(insertIdx, 0, newItem);
      
      console.log('📋 After inserting:', allItems.map((it, i) => `${i}: ${it.type} ${it.id}`));
      
      // Update sortIndex
      allItems.forEach((item, idx) => {
        item.sortIndex = idx + 1;
      });
      
      // Remove from folder
      const newFolders = folders.map(folder => {
        if (String(folder.id) === String(sourceFolderId)) {
          return { ...folder, elementIds: folder.elementIds.filter(id => String(id) !== String(draggedId)) };
        }
        const updated = allItems.find(it => it.type === 'folder' && String(it.id) === String(folder.id));
        if (updated) return { ...folder, sortIndex: updated.sortIndex };
        return folder;
      });
      
      // Update elements
      const newElements = allElements.map(element => {
        if (String(element.id) === String(draggedId)) {
          const updated = allItems.find(it => it.type === 'element' && String(it.id) === String(draggedId));
          return { ...element, folderId: null, sortIndex: updated ? updated.sortIndex : element.sortIndex };
        }
        if (!element.folderId) {
          const updated = allItems.find(it => it.type === 'element' && String(it.id) === String(element.id));
          if (updated) return { ...element, sortIndex: updated.sortIndex };
        }
        return element;
      });
      
      const newPages = contractPages.map((page, idx) => 
        idx === currentPage ? { ...page, elements: newElements } : page
      );
      
      setContractPages(newPages);
      setFolders(newFolders);
      saveToHistory(newPages, newFolders, 'move_out_of_folder');
      setDraggedElementIndex(null);
      setDragOverElementIndex(null);
      dropZoneRef.current = null;
      return;
    }
    
    if (draggedIdx === -1) {
      console.error('❌ Dragged item not found');
      return;
    }
    
    // Normal reordering of top-level items
    const [draggedItem] = allItems.splice(draggedIdx, 1);
    
    let insertIdx;
    if (dropZone === 'before') {
      insertIdx = draggedIdx < dropIndex ? dropIndex - 1 : dropIndex;
    } else {
      insertIdx = draggedIdx < dropIndex ? dropIndex : dropIndex + 1;
    }
    insertIdx = Math.max(0, Math.min(insertIdx, allItems.length));
    
    allItems.splice(insertIdx, 0, draggedItem);
    
    console.log('📋 After:', allItems.map((it, i) => `${i}: ${it.type} ${it.id}`));
    
    // Update sortIndex
    allItems.forEach((item, idx) => {
      item.sortIndex = idx + 1;
    });
    
    // Apply updates
    const newFolders = folders.map(folder => {
      const updated = allItems.find(it => it.type === 'folder' && String(it.id) === String(folder.id));
      if (updated) return { ...folder, sortIndex: updated.sortIndex };
      return folder;
    });
    
    const newElements = allElements.map(element => {
      if (!element.folderId) {
        const updated = allItems.find(it => it.type === 'element' && String(it.id) === String(element.id));
        if (updated) return { ...element, sortIndex: updated.sortIndex };
      }
      return element;
    });
    
    const newPages = contractPages.map((page, idx) => 
      idx === currentPage ? { ...page, elements: newElements } : page
    );
    
    setContractPages(newPages);
    setFolders(newFolders);
    saveToHistory(newPages, newFolders, 'reorder');
    setDraggedElementIndex(null);
    setDragOverElementIndex(null);
    dropZoneRef.current = null;
  }, [contractPages, currentPage, folders, saveToHistory, setContractPages, setFolders]);

  const handleElementDragEnd = useCallback(() => {
    document.querySelectorAll('[data-drop-zone]').forEach(el => {
      el.removeAttribute('data-drop-zone');
      el.style.borderTop = '';
      el.style.borderBottom = '';
      el.style.backgroundColor = '';
      el.style.outline = '';
    });
    
    // Remove all drop indicators
    document.querySelectorAll('.drop-into-indicator').forEach(indicator => {
      indicator.remove();
    });
    
    setDraggedElementIndex(null);
    setDragOverElementIndex(null);
    dropZoneRef.current = null;
  }, []);

  // Page drag & drop (keeping existing logic)
  const handlePageDragStart = useCallback((e, pageIndex) => {
    if (editingPageTitle !== null) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', pageIndex.toString());
    setDraggedPageIndex(pageIndex);
    setIsDraggingPage(true);
    setDragOverPageIndex(null);
  }, [editingPageTitle]);

  const handlePageDragOver = useCallback((e, pageIndex) => {
    e.preventDefault();
    if (editingPageTitle !== null || draggedPageIndex === null) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX;
    const relativeX = mouseX - rect.left;
    const width = rect.width;
    const position = relativeX < width / 2 ? 'before' : 'after';
    
    const dragIndex = draggedPageIndex;
    const draggedPage = contractPages[dragIndex];
    const targetPage = contractPages[pageIndex];
    
    if (!draggedPage || !targetPage) return;
    
    const getPdfBlockInfo = (page) => {
      if (!page.locked) return null;
      const pdfFileName = page.pdfFileName;
      const blockIndices = contractPages
        .map((p, idx) => ({ page: p, idx }))
        .filter(({ page: p }) => p.locked && p.pdfFileName === pdfFileName)
        .map(({ idx }) => idx);
      return {
        fileName: pdfFileName,
        indices: blockIndices,
        minIndex: Math.min(...blockIndices),
        maxIndex: Math.max(...blockIndices)
      };
    };
    
    if (draggedPage.locked && targetPage.locked && 
        draggedPage.pdfFileName === targetPage.pdfFileName) {
      setDropPosition(null);
      setDragOverPageIndex(null);
      return;
    }
    
    if (!draggedPage.locked && targetPage.locked) {
      const pdfBlock = getPdfBlockInfo(targetPage);
      const insertIndex = position === 'before' ? pageIndex : pageIndex + 1;
      if (insertIndex > pdfBlock.minIndex && insertIndex <= pdfBlock.maxIndex) {
        setDropPosition(null);
        setDragOverPageIndex(null);
        return;
      }
    }
    
    if (draggedPage.locked && !targetPage.locked) {
      const pdfBlock = getPdfBlockInfo(draggedPage);
      const insertIndex = position === 'before' ? pageIndex : pageIndex + 1;
      const pageAtInsert = contractPages[insertIndex];
      if (pageAtInsert?.locked) {
        const targetPdfBlock = getPdfBlockInfo(pageAtInsert);
        if (insertIndex > targetPdfBlock.minIndex && insertIndex <= targetPdfBlock.maxIndex) {
          setDropPosition(null);
          setDragOverPageIndex(null);
          return;
        }
      }
    }
    
    setDragOverPageIndex(pageIndex);
    setDropPosition(position);
  }, [contractPages, draggedPageIndex, editingPageTitle]);

  const handlePageDragLeave = useCallback(() => {
    setDragOverPageIndex(null);
    setDropPosition(null);
  }, []);

  const handlePageDragEnd = useCallback(() => {
    setIsDraggingPage(false);
    setDragOverPageIndex(null);
    setDraggedPageIndex(null);
    setDropPosition(null);
  }, []);

  const handlePageDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    if (editingPageTitle !== null || draggedPageIndex === null || dropPosition === null) return;
    
    const dragIndex = draggedPageIndex;
    const draggedPage = contractPages[dragIndex];
    const targetPage = contractPages[dropIndex];
    
    if (!draggedPage || !targetPage || dragIndex === dropIndex) {
      setIsDraggingPage(false);
      setDragOverPageIndex(null);
      setDraggedPageIndex(null);
      setDropPosition(null);
      return;
    }
    
    let actualDropIndex = dropPosition === 'before' ? dropIndex : dropIndex + 1;
    if (dragIndex < actualDropIndex) actualDropIndex -= 1;
    
    movePage(dragIndex, actualDropIndex);
    
    setIsDraggingPage(false);
    setDragOverPageIndex(null);
    setDraggedPageIndex(null);
    setDropPosition(null);
  }, [contractPages, editingPageTitle, movePage, draggedPageIndex, dropPosition]);

  return {
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
    handleElementDragLeave,
    handleElementDrop,
    handleElementDragEnd,
    handlePageDragStart,
    handlePageDragOver,
    handlePageDragLeave,
    handlePageDrop,
    handlePageDragEnd,
    containerRef,
    isDraggingPage,
    dragOverPageIndex,
    dropPosition
  };
};
