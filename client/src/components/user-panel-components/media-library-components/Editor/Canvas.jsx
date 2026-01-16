import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Copy, Trash2 } from 'lucide-react';

// Calculate canvas dimensions that fit nicely in the viewport
const getCanvasDimensions = (imageSize, containerWidth = 600, containerHeight = 500) => {
  if (!imageSize || !imageSize.includes('x')) {
    return { width: 400, height: 400, scale: 1, originalWidth: 400, originalHeight: 400 };
  }
  
  const [width, height] = imageSize.split('x').map(Number);
  
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return { width: 400, height: 400, scale: 1, originalWidth: 400, originalHeight: 400 };
  }
  
  // Calculate scale to fit within container
  let scale = Math.min(containerWidth / width, containerHeight / height);
  
  // Cap at 1 to avoid upscaling small designs
  scale = Math.min(scale, 1);
  
  return {
    width: width * scale,
    height: height * scale,
    scale: scale,
    originalWidth: width,
    originalHeight: height
  };
};

const Canvas = ({
  elements,
  activeElementId,
  lockedElements,
  hiddenLayers,
  imageSize,
  zoom = 1,
  onSelectElement,
  onUpdateElement,
  onDeselectAll,
  onDuplicateElement,
  onDeleteElement
}) => {
  const canvasContainerRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState('');
  const [editingTextId, setEditingTextId] = useState(null);
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const textInputRef = useRef(null);

  // Measure container size
  useEffect(() => {
    const updateContainerSize = () => {
      if (canvasWrapperRef.current) {
        const rect = canvasWrapperRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width - 64,
          height: rect.height - 64
        });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    const timer = setTimeout(updateContainerSize, 100);
    
    return () => {
      window.removeEventListener('resize', updateContainerSize);
      clearTimeout(timer);
    };
  }, [imageSize]);

  const canvasDim = getCanvasDimensions(imageSize, containerSize.width, containerSize.height);

  // Focus text input when editing starts
  useEffect(() => {
    if (editingTextId && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [editingTextId]);

  // Handle element mouse down - single click selects/drags, double click edits text
  const handleElementMouseDown = (e, elementId) => {
    const element = elements.find(el => el.id === elementId);
    if (!element || lockedElements.has(elementId)) return;

    // If we're currently editing this text element, let the textarea handle it
    if (editingTextId === elementId) {
      return;
    }

    // If we're editing a DIFFERENT text element, stop editing it
    if (editingTextId && editingTextId !== elementId) {
      setEditingTextId(null);
    }

    e.preventDefault();
    e.stopPropagation();

    // Select the element
    onSelectElement(elementId);

    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    // Check if clicking resize handle
    const handleSize = 12;
    const isResizeHandle = 
      localX >= rect.width - handleSize && 
      localY >= rect.height - handleSize;

    if (isResizeHandle) {
      setIsResizing(true);
      setResizeDirection('se');
    } else {
      // Start dragging
      setIsDragging(true);
      const canvasRect = canvasContainerRef.current?.getBoundingClientRect();
      if (canvasRect) {
        setDragStart({
          x: e.clientX - canvasRect.left - element.x * canvasDim.scale * zoom,
          y: e.clientY - canvasRect.top - element.y * canvasDim.scale * zoom
        });
      }
    }
  };

  // Handle text double click for editing
  const handleTextDoubleClick = (e, elementId) => {
    e.preventDefault();
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (element && element.type === 'text' && !lockedElements.has(elementId)) {
      setEditingTextId(elementId);
    }
  };

  // Handle text change
  const handleTextChange = (e, elementId) => {
    onUpdateElement(elementId, { content: e.target.value });
  };

  // Handle text blur (finish editing)
  const handleTextBlur = () => {
    setEditingTextId(null);
  };

  // Handle text keydown
  const handleTextKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditingTextId(null);
    }
  };

  // Handle canvas mouse move
  const handleCanvasMouseMove = useCallback((e) => {
    if (!canvasContainerRef.current || !activeElementId) return;
    if (editingTextId) return;

    const canvasRect = canvasContainerRef.current.getBoundingClientRect();
    const totalScale = canvasDim.scale * zoom;
    const mouseX = (e.clientX - canvasRect.left) / totalScale;
    const mouseY = (e.clientY - canvasRect.top) / totalScale;

    const element = elements.find(el => el.id === activeElementId);
    if (!element || lockedElements.has(activeElementId)) return;

    if (isDragging) {
      let newX = mouseX - dragStart.x / totalScale;
      let newY = mouseY - dragStart.y / totalScale;

      // Boundary constraints using original dimensions
      newX = Math.max(0, Math.min(newX, canvasDim.originalWidth - element.width));
      newY = Math.max(0, Math.min(newY, canvasDim.originalHeight - element.height));

      onUpdateElement(activeElementId, { x: newX, y: newY });
    }

    if (isResizing) {
      const minSize = 20;
      let newWidth = Math.max(minSize, mouseX - element.x);
      let newHeight = Math.max(minSize, mouseY - element.y);

      // Boundary constraints
      newWidth = Math.min(newWidth, canvasDim.originalWidth - element.x);
      newHeight = Math.min(newHeight, canvasDim.originalHeight - element.y);

      // Maintain aspect ratio for images
      if (element.type === 'image' && element.originalWidth && element.originalHeight) {
        const aspectRatio = element.originalWidth / element.originalHeight;
        newHeight = newWidth / aspectRatio;
        
        if (newHeight > canvasDim.originalHeight - element.y) {
          newHeight = canvasDim.originalHeight - element.y;
          newWidth = newHeight * aspectRatio;
        }
      }

      onUpdateElement(activeElementId, { width: newWidth, height: newHeight });
    }
  }, [activeElementId, isDragging, isResizing, dragStart, elements, lockedElements, canvasDim, zoom, onUpdateElement, editingTextId]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  // Handle canvas click
  const handleCanvasClick = (e) => {
    // Check if click is on canvas background (not on an element)
    const isCanvasBackground = 
      e.target === canvasContainerRef.current || 
      e.target.classList.contains('canvas-area') || 
      e.target.classList.contains('canvas-scroll-area') || 
      e.target.classList.contains('canvas-center-wrapper');
    
    if (isCanvasBackground) {
      onDeselectAll();
      setEditingTextId(null);
    }
  };

  // Handle global mousedown to exit text editing when clicking outside
  const handleGlobalMouseDown = useCallback((e) => {
    if (!editingTextId) return;
    
    // Check if click is inside the textarea
    if (textInputRef.current && textInputRef.current.contains(e.target)) {
      return;
    }
    
    // Check if click is inside the editing element's container
    const editingElement = document.querySelector(`[data-element-id="${editingTextId}"]`);
    if (editingElement && editingElement.contains(e.target)) {
      return;
    }
    
    // Click was outside - exit editing mode
    setEditingTextId(null);
  }, [editingTextId]);

  // Add global event listeners
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleCanvasMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, [handleMouseUp, handleCanvasMouseMove]);

  // Add global mousedown listener to exit text editing
  useEffect(() => {
    if (editingTextId) {
      document.addEventListener('mousedown', handleGlobalMouseDown);
      return () => {
        document.removeEventListener('mousedown', handleGlobalMouseDown);
      };
    }
  }, [editingTextId, handleGlobalMouseDown]);

  // Render shape
  const renderShape = (shape, color, width, height) => {
    const style = { width: '100%', height: '100%', backgroundColor: color };

    switch (shape) {
      case 'rectangle':
        return <div style={style} />;
      case 'rounded-rectangle':
        return <div style={{ ...style, borderRadius: '12px' }} />;
      case 'circle':
        return <div style={{ ...style, borderRadius: '50%' }} />;
      case 'triangle':
        return (
          <div style={{
            ...style,
            backgroundColor: 'transparent',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: color
          }} />
        );
      case 'star':
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <polygon points="12,2 15,9 22,9 16,14 19,21 12,17 5,21 8,14 2,9 9,9" />
          </svg>
        );
      case 'heart':
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
          </svg>
        );
      case 'diamond':
        return (
          <div style={{
            ...style,
            backgroundColor: 'transparent',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            background: color
          }} />
        );
      default:
        return <div style={style} />;
    }
  };

  // Sort visible elements by z-index
  const visibleElements = elements
    .filter(el => !hiddenLayers.has(el.id))
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Get cursor style for element
  const getCursorStyle = (element, isActive, isLocked) => {
    if (isLocked) return 'cursor-not-allowed';
    if (editingTextId === element.id) return 'cursor-text';
    if (isActive) return 'cursor-move';
    return 'cursor-pointer';
  };

  // Combined scale for display
  const displayScale = canvasDim.scale * zoom;
  
  // Calculate the actual canvas dimensions with zoom
  const canvasWidth = canvasDim.width * zoom;
  const canvasHeight = canvasDim.height * zoom;

  return (
    <div 
      ref={canvasWrapperRef}
      className="flex-1 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Scrollable canvas area with true centering */}
      <div 
        className="canvas-scroll-area w-full h-full overflow-auto"
        onClick={handleCanvasClick}
      >
        {/* Centering wrapper - uses flexbox for true vertical and horizontal centering */}
        <div 
          className="canvas-center-wrapper flex items-center justify-center"
          style={{
            minHeight: '100%',
            minWidth: '100%',
            height: canvasHeight + 160 > containerSize.height + 64 ? 'auto' : '100%',
            paddingTop: '80px',
            paddingBottom: '80px',
            paddingLeft: '64px',
            paddingRight: '64px',
            boxSizing: 'border-box'
          }}
        >
          {/* Canvas Container */}
          <div
            ref={canvasContainerRef}
            className="canvas-area relative flex-shrink-0 overflow-hidden"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transformOrigin: 'center',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 0 40px rgba(0,0,0,0.5), 0 0 80px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)'
            }}
          >
            {/* Transparency Checkerboard Pattern (like Photoshop) */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
                  linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
                  linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
                `,
                backgroundSize: `${16 * displayScale}px ${16 * displayScale}px`,
                backgroundPosition: `0 0, 0 ${8 * displayScale}px, ${8 * displayScale}px -${8 * displayScale}px, -${8 * displayScale}px 0px`,
                backgroundColor: '#ffffff'
              }}
            />

            {/* Elements */}
            {visibleElements.map((element) => {
              const isActive = activeElementId === element.id;
              const isLocked = lockedElements.has(element.id);
              const isEditing = editingTextId === element.id;

              return (
                <div
                  key={element.id}
                  data-element-id={element.id}
                  onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                  onDoubleClick={(e) => element.type === 'text' && handleTextDoubleClick(e, element.id)}
                  className={`absolute ${getCursorStyle(element, isActive, isLocked)}`}
                  style={{
                    left: `${element.x * displayScale}px`,
                    top: `${element.y * displayScale}px`,
                    width: `${element.width * displayScale}px`,
                    height: `${element.height * displayScale}px`,
                    outline: isActive ? '2px solid #FF843E' : 'none',
                    outlineOffset: '2px',
                    transition: isDragging || isResizing ? 'none' : 'outline 0.15s ease'
                  }}
                >
                  {/* Text Element */}
                  {element.type === 'text' && (
                    isEditing ? (
                      <textarea
                        ref={textInputRef}
                        value={element.content}
                        onChange={(e) => handleTextChange(e, element.id)}
                        onBlur={handleTextBlur}
                        onKeyDown={handleTextKeyDown}
                        className="w-full h-full resize-none border-none outline-none bg-transparent"
                        style={{
                          color: element.color,
                          fontSize: `${(element.size || 24) * displayScale}px`,
                          fontFamily: element.font || 'Inter, sans-serif',
                          fontWeight: element.bold ? 'bold' : 'normal',
                          fontStyle: element.italic ? 'italic' : 'normal',
                          textDecoration: element.underline ? 'underline' : 'none',
                          textAlign: element.align || 'left',
                          lineHeight: 1.2,
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          padding: `${4 * displayScale}px`
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          color: element.color,
                          fontSize: `${(element.size || 24) * displayScale}px`,
                          fontFamily: element.font || 'Inter, sans-serif',
                          fontWeight: element.bold ? 'bold' : 'normal',
                          fontStyle: element.italic ? 'italic' : 'normal',
                          textDecoration: element.underline ? 'underline' : 'none',
                          textAlign: element.align || 'left',
                          lineHeight: 1.2,
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          padding: `${4 * displayScale}px`,
                          userSelect: 'none'
                        }}
                      >
                        {element.content}
                      </div>
                    )
                  )}

                  {/* Shape Element */}
                  {element.type === 'shape' && (
                    <div style={{ width: '100%', height: '100%' }}>
                      {renderShape(element.shape, element.color, element.width, element.height)}
                    </div>
                  )}

                  {/* Image Element */}
                  {element.type === 'image' && (
                    <img
                      src={element.content}
                      alt="Layer"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  )}

                  {/* Resize Handle */}
                  {isActive && !isLocked && !isEditing && (
                    <div
                      className="absolute -right-1 -bottom-1 w-2 h-2 bg-[#FF843E] border border-white rounded-sm cursor-se-resize shadow-sm"
                      style={{
                        transform: `scale(${1 / Math.max(displayScale, 0.5)})`,
                        transformOrigin: 'center'
                      }}
                    />
                  )}

                  {/* Corner Handles (for visual feedback) */}
                  {isActive && !isLocked && !isEditing && (
                    <>
                      <div 
                        className="absolute bg-white border border-[#FF843E] rounded-sm"
                        style={{
                          width: '5px',
                          height: '5px',
                          left: '-2px',
                          top: '-2px',
                          transform: `scale(${1 / Math.max(displayScale, 0.5)})`,
                          transformOrigin: 'center'
                        }}
                      />
                      <div 
                        className="absolute bg-white border border-[#FF843E] rounded-sm"
                        style={{
                          width: '5px',
                          height: '5px',
                          right: '-2px',
                          top: '-2px',
                          transform: `scale(${1 / Math.max(displayScale, 0.5)})`,
                          transformOrigin: 'center'
                        }}
                      />
                      <div 
                        className="absolute bg-white border border-[#FF843E] rounded-sm"
                        style={{
                          width: '5px',
                          height: '5px',
                          left: '-2px',
                          bottom: '-2px',
                          transform: `scale(${1 / Math.max(displayScale, 0.5)})`,
                          transformOrigin: 'center'
                        }}
                      />
                    </>
                  )}

                  {/* Action Buttons - Duplicate & Delete on Selection Box */}
                  {isActive && !isLocked && !isEditing && (
                    <div 
                      className="absolute -top-5 left-1/2 flex items-center gap-px bg-[#1C1C1C]/90 border border-[#333333] rounded-sm shadow-lg"
                      style={{
                        transform: `translateX(-50%) scale(${1 / Math.max(displayScale, 0.5)})`,
                        transformOrigin: 'bottom center',
                        padding: '1px'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateElement?.(element.id);
                        }}
                        className="p-0.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-sm transition-colors"
                        title="Duplicate (Ctrl+D)"
                      >
                        <Copy size={9} />
                      </button>
                      <div className="w-px h-2 bg-[#444]" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement?.(element.id);
                        }}
                        className="p-0.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
                        title="Delete (Del)"
                      >
                        <Trash2 size={9} />
                      </button>
                    </div>
                  )}

                  {/* Lock Indicator */}
                  {isLocked && isActive && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF843E] text-white text-[10px] px-2 py-0.5 rounded font-medium">
                      Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
