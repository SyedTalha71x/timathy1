import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Copy, Trash2, Check, X } from 'lucide-react';

// Calculate canvas dimensions that fit nicely in the viewport
const getCanvasDimensions = (imageSize, containerWidth = 600, containerHeight = 500) => {
  if (!imageSize || !imageSize.includes('x')) {
    return { width: 400, height: 400, scale: 1, originalWidth: 400, originalHeight: 400 };
  }
  
  const [width, height] = imageSize.split('x').map(Number);
  
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return { width: 400, height: 400, scale: 1, originalWidth: 400, originalHeight: 400 };
  }
  
  let scale = Math.min(containerWidth / width, containerHeight / height);
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
  onDeleteElement,
  // Crop props from parent
  croppingElementId = null,
  onApplyCrop,
  onCancelCrop
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
  
  // Crop box state (local UI state for the crop region)
  const [cropBox, setCropBox] = useState(null);
  const [isCropDragging, setIsCropDragging] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });
  const [cropDragType, setCropDragType] = useState(null); // 'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
  const [cropInitialBox, setCropInitialBox] = useState(null);

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

  // Initialize crop box when cropping starts
  useEffect(() => {
    if (croppingElementId) {
      const element = elements.find(el => el.id === croppingElementId);
      if (element && element.type === 'image') {
        // Initialize crop box to full element or existing crop
        setCropBox({
          x: element.cropX || 0,
          y: element.cropY || 0,
          width: element.cropWidth || element.width,
          height: element.cropHeight || element.height
        });
      }
    } else {
      setCropBox(null);
    }
  }, [croppingElementId, elements]);

  // Apply crop handler
  const handleApplyCrop = useCallback(() => {
    if (cropBox && onApplyCrop) {
      onApplyCrop(cropBox);
    }
  }, [cropBox, onApplyCrop]);

  // Cancel crop handler
  const handleCancelCrop = useCallback(() => {
    setCropBox(null);
    if (onCancelCrop) {
      onCancelCrop();
    }
  }, [onCancelCrop]);

  // Handle crop drag start
  const handleCropDragStart = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCropDragging(true);
    setCropDragType(type);
    setCropDragStart({ x: e.clientX, y: e.clientY });
    setCropInitialBox({ ...cropBox });
  }, [cropBox]);

  // Handle crop drag move
  const handleCropDragMove = useCallback((e) => {
    if (!isCropDragging || !cropInitialBox || !croppingElementId) return;

    const element = elements.find(el => el.id === croppingElementId);
    if (!element) return;

    const displayScale = canvasDim.scale * zoom;
    const deltaX = (e.clientX - cropDragStart.x) / displayScale;
    const deltaY = (e.clientY - cropDragStart.y) / displayScale;

    let newBox = { ...cropInitialBox };

    switch (cropDragType) {
      case 'move':
        newBox.x = Math.max(0, Math.min(element.width - cropInitialBox.width, cropInitialBox.x + deltaX));
        newBox.y = Math.max(0, Math.min(element.height - cropInitialBox.height, cropInitialBox.y + deltaY));
        break;
      case 'nw':
        newBox.x = Math.max(0, cropInitialBox.x + deltaX);
        newBox.y = Math.max(0, cropInitialBox.y + deltaY);
        newBox.width = Math.max(20, cropInitialBox.width - deltaX);
        newBox.height = Math.max(20, cropInitialBox.height - deltaY);
        break;
      case 'ne':
        newBox.y = Math.max(0, cropInitialBox.y + deltaY);
        newBox.width = Math.max(20, Math.min(element.width - cropInitialBox.x, cropInitialBox.width + deltaX));
        newBox.height = Math.max(20, cropInitialBox.height - deltaY);
        break;
      case 'sw':
        newBox.x = Math.max(0, cropInitialBox.x + deltaX);
        newBox.width = Math.max(20, cropInitialBox.width - deltaX);
        newBox.height = Math.max(20, Math.min(element.height - cropInitialBox.y, cropInitialBox.height + deltaY));
        break;
      case 'se':
        newBox.width = Math.max(20, Math.min(element.width - cropInitialBox.x, cropInitialBox.width + deltaX));
        newBox.height = Math.max(20, Math.min(element.height - cropInitialBox.y, cropInitialBox.height + deltaY));
        break;
      case 'n':
        newBox.y = Math.max(0, cropInitialBox.y + deltaY);
        newBox.height = Math.max(20, cropInitialBox.height - deltaY);
        break;
      case 's':
        newBox.height = Math.max(20, Math.min(element.height - cropInitialBox.y, cropInitialBox.height + deltaY));
        break;
      case 'e':
        newBox.width = Math.max(20, Math.min(element.width - cropInitialBox.x, cropInitialBox.width + deltaX));
        break;
      case 'w':
        newBox.x = Math.max(0, cropInitialBox.x + deltaX);
        newBox.width = Math.max(20, cropInitialBox.width - deltaX);
        break;
    }

    setCropBox(newBox);
  }, [isCropDragging, cropInitialBox, cropDragStart, cropDragType, croppingElementId, elements, canvasDim.scale, zoom]);

  // Handle crop drag end
  const handleCropDragEnd = useCallback(() => {
    setIsCropDragging(false);
    setCropDragType(null);
    setCropInitialBox(null);
  }, []);

  // Add crop drag listeners
  useEffect(() => {
    if (isCropDragging) {
      document.addEventListener('mousemove', handleCropDragMove);
      document.addEventListener('mouseup', handleCropDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleCropDragMove);
        document.removeEventListener('mouseup', handleCropDragEnd);
      };
    }
  }, [isCropDragging, handleCropDragMove, handleCropDragEnd]);

  // Handle element mouse down
  const handleElementMouseDown = (e, elementId) => {
    // Don't handle if we're cropping a different element
    if (croppingElementId && croppingElementId !== elementId) return;
    
    const element = elements.find(el => el.id === elementId);
    if (!element || lockedElements.has(elementId)) return;

    if (editingTextId === elementId) return;

    if (editingTextId && editingTextId !== elementId) {
      setEditingTextId(null);
    }

    // Don't start drag if we're cropping
    if (croppingElementId === elementId) return;

    e.preventDefault();
    e.stopPropagation();

    onSelectElement(elementId);

    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    const handleSize = 12;
    const isResizeHandle = 
      localX >= rect.width - handleSize && 
      localY >= rect.height - handleSize;

    if (isResizeHandle) {
      setIsResizing(true);
      setResizeDirection('se');
    } else {
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

  // Handle text double click
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

  // Handle text blur
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
    if (croppingElementId) return; // Don't move elements while cropping

    const canvasRect = canvasContainerRef.current.getBoundingClientRect();
    const totalScale = canvasDim.scale * zoom;
    const mouseX = (e.clientX - canvasRect.left) / totalScale;
    const mouseY = (e.clientY - canvasRect.top) / totalScale;

    const element = elements.find(el => el.id === activeElementId);
    if (!element || lockedElements.has(activeElementId)) return;

    if (isDragging) {
      let newX = mouseX - dragStart.x / totalScale;
      let newY = mouseY - dragStart.y / totalScale;

      newX = Math.max(0, Math.min(newX, canvasDim.originalWidth - element.width));
      newY = Math.max(0, Math.min(newY, canvasDim.originalHeight - element.height));

      onUpdateElement(activeElementId, { x: newX, y: newY });
    }

    if (isResizing) {
      const minSize = 20;
      let newWidth = Math.max(minSize, mouseX - element.x);
      let newHeight = Math.max(minSize, mouseY - element.y);

      newWidth = Math.min(newWidth, canvasDim.originalWidth - element.x);
      newHeight = Math.min(newHeight, canvasDim.originalHeight - element.y);

      if (element.type === 'image' && element.originalWidth && element.originalHeight) {
        const aspectRatio = element.originalWidth / element.originalHeight;
        newHeight = newWidth / aspectRatio;
        
        if (newHeight > canvasDim.originalHeight - element.y) {
          newHeight = canvasDim.originalHeight - element.y;
          newWidth = newHeight * aspectRatio;
        }
      }

      // Scale crop values proportionally when resizing (uniform scale to prevent distortion)
      const updates = { width: newWidth, height: newHeight };
      if (element.type === 'image' && element.cropWidth && element.cropHeight) {
        const uniformScale = newWidth / element.width;
        updates.cropX = element.cropX * uniformScale;
        updates.cropY = element.cropY * uniformScale;
        updates.cropWidth = element.cropWidth * uniformScale;
        updates.cropHeight = element.cropHeight * uniformScale;
      }

      onUpdateElement(activeElementId, updates);
    }
  }, [activeElementId, isDragging, isResizing, dragStart, elements, lockedElements, canvasDim, zoom, onUpdateElement, editingTextId, croppingElementId]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  // Handle canvas click
  const handleCanvasClick = (e) => {
    // Don't deselect if cropping
    if (croppingElementId) return;
    
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

  // Handle global mousedown
  const handleGlobalMouseDown = useCallback((e) => {
    if (!editingTextId) return;
    
    if (textInputRef.current && textInputRef.current.contains(e.target)) return;
    
    const editingElement = document.querySelector(`[data-element-id="${editingTextId}"]`);
    if (editingElement && editingElement.contains(e.target)) return;
    
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

  useEffect(() => {
    if (editingTextId) {
      document.addEventListener('mousedown', handleGlobalMouseDown);
      return () => document.removeEventListener('mousedown', handleGlobalMouseDown);
    }
  }, [editingTextId, handleGlobalMouseDown]);

  // Get element styles with effects
  const getElementStyles = (element) => {
    const styles = {};
    
    if (element.opacity !== undefined && element.opacity !== 1) {
      styles.opacity = element.opacity;
    }
    
    if (element.shadow) {
      const displayScale = canvasDim.scale * zoom;
      styles.boxShadow = `${element.shadow.x * displayScale}px ${element.shadow.y * displayScale}px ${element.shadow.blur * displayScale}px ${element.shadow.color || 'rgba(0,0,0,0.5)'}`;
    }
    
    if (element.borderWidth && element.borderWidth > 0) {
      const displayScale = canvasDim.scale * zoom;
      styles.border = `${element.borderWidth * displayScale}px solid ${element.borderColor || '#000'}`;
    }
    
    if (element.borderRadius && element.type === 'shape' && element.shape !== 'circle') {
      const displayScale = canvasDim.scale * zoom;
      styles.borderRadius = `${element.borderRadius * displayScale}px`;
    }
    
    if (element.blur && element.type === 'image') {
      styles.filter = `blur(${element.blur}px)`;
    }
    
    return styles;
  };

  // Render shape
  const renderShape = (shape, color, width, height, borderRadius = 0) => {
    const displayScale = canvasDim.scale * zoom;
    const style = { 
      width: '100%', 
      height: '100%', 
      backgroundColor: color,
      borderRadius: borderRadius > 0 ? `${borderRadius * displayScale}px` : undefined
    };

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

  // Render line
  const renderLine = (element, displayScale) => {
    const strokeWidth = (element.strokeWidth || 2) * displayScale;
    const height = element.height * displayScale;
    const width = element.width * displayScale;
    
    let strokeDasharray = '';
    if (element.lineStyle === 'dashed') strokeDasharray = `${strokeWidth * 4} ${strokeWidth * 2}`;
    if (element.lineStyle === 'dotted') strokeDasharray = `${strokeWidth} ${strokeWidth * 2}`;
    
    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <marker
            id={`arrowEnd-${element.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill={element.color || '#FFFFFF'} />
          </marker>
          <marker
            id={`arrowStart-${element.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M9,0 L9,6 L0,3 z" fill={element.color || '#FFFFFF'} />
          </marker>
        </defs>
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={element.color || '#FFFFFF'}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          markerEnd={element.arrowEnd ? `url(#arrowEnd-${element.id})` : ''}
          markerStart={element.arrowStart ? `url(#arrowStart-${element.id})` : ''}
        />
      </svg>
    );
  };

  // Render gradient
  const renderGradient = (element, displayScale) => {
    const colors = element.gradientColors || ['#FF6B6B', '#FFA500'];
    const angle = element.gradientAngle || 135;
    const borderRadius = element.borderRadius ? element.borderRadius * displayScale : 0;
    
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
          borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined
        }}
      />
    );
  };

  // Render divider
  const renderDivider = (element, displayScale) => {
    const strokeWidth = (element.strokeWidth || 2) * displayScale;
    const color = element.color || '#FFFFFF';
    
    if (element.dividerStyle === 'double') {
      return (
        <div className="w-full h-full flex flex-col justify-center" style={{ gap: strokeWidth }}>
          <div style={{ height: strokeWidth, backgroundColor: color }} />
          <div style={{ height: strokeWidth, backgroundColor: color }} />
        </div>
      );
    }
    
    let borderStyle = 'solid';
    if (element.dividerStyle === 'dashed') borderStyle = 'dashed';
    if (element.dividerStyle === 'dotted') borderStyle = 'dotted';
    
    return (
      <div className="w-full h-full flex items-center">
        <div style={{ 
          width: '100%', 
          borderTop: `${strokeWidth}px ${borderStyle} ${color}` 
        }} />
      </div>
    );
  };

  // Render image with optional crop
  const renderImage = (element, displayScale, isCropping) => {
    // During cropping: show full image stretched to element bounds
    if (isCropping) {
      return (
        <img
          src={element.content}
          alt="Layer"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            filter: element.blur ? `blur(${element.blur}px)` : undefined
          }}
        />
      );
    }
    
    // If image has been cropped, show only the cropped region
    if (element.cropWidth && element.cropHeight) {
      // Use uniform scale to prevent distortion
      const scale = element.width / element.cropWidth;
      
      // Full image size when scaled
      const fullWidth = element.width * scale * displayScale;
      const fullHeight = element.height * scale * displayScale;
      
      // Offset to position the crop region at origin
      const offsetX = -element.cropX * scale * displayScale;
      const offsetY = -element.cropY * scale * displayScale;
      
      return (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          position: 'relative',
          filter: element.blur ? `blur(${element.blur}px)` : undefined
        }}>
          <img
            src={element.content}
            alt="Layer"
            draggable={false}
            style={{
              position: 'absolute',
              left: `${offsetX}px`,
              top: `${offsetY}px`,
              width: `${fullWidth}px`,
              height: `${fullHeight}px`,
              maxWidth: 'none',
              objectFit: 'fill'
            }}
          />
        </div>
      );
    }
    
    // Normal image display (no crop)
    return (
      <img
        src={element.content}
        alt="Layer"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          filter: element.blur ? `blur(${element.blur}px)` : undefined
        }}
      />
    );
  };

  // Sort visible elements by z-index
  const visibleElements = elements
    .filter(el => !hiddenLayers.has(el.id))
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Get cursor style
  const getCursorStyle = (element, isActive, isLocked) => {
    if (isLocked) return 'cursor-not-allowed';
    if (editingTextId === element.id) return 'cursor-text';
    if (croppingElementId === element.id) return 'cursor-crosshair';
    if (isActive) return 'cursor-move';
    return 'cursor-pointer';
  };

  const displayScale = canvasDim.scale * zoom;
  const canvasWidth = canvasDim.width * zoom;
  const canvasHeight = canvasDim.height * zoom;

  return (
    <div 
      ref={canvasWrapperRef}
      className="flex-1 bg-[#0a0a0a] overflow-auto"
    >
      <div 
        className="canvas-scroll-area w-full h-full"
        onClick={handleCanvasClick}
      >
        <div 
          className="canvas-center-wrapper flex items-center justify-center"
          style={{
            minHeight: '100%',
            minWidth: '100%',
            width: canvasWidth + 128 > containerSize.width ? canvasWidth + 128 : '100%',
            height: canvasHeight + 160 > containerSize.height ? canvasHeight + 160 : '100%',
            paddingTop: '80px',
            paddingBottom: '80px',
            paddingLeft: '64px',
            paddingRight: '64px',
            boxSizing: 'border-box'
          }}
        >
          <div
            ref={canvasContainerRef}
            className="canvas-area relative flex-shrink-0 overflow-hidden"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transformOrigin: 'center',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 0 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* Checkerboard Pattern */}
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
            {visibleElements.map((element, index) => {
              const isActive = activeElementId === element.id;
              const isLocked = lockedElements.has(element.id);
              const isEditing = editingTextId === element.id;
              const isCropping = croppingElementId === element.id;
              const elementStyles = getElementStyles(element);

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
                    zIndex: index + 1,
                    outline: isActive && !isCropping ? '2px solid #FF843E' : 'none',
                    outlineOffset: '2px',
                    transition: isDragging || isResizing ? 'none' : 'outline 0.15s ease',
                    ...elementStyles
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
                      {renderShape(element.shape, element.color, element.width, element.height, element.borderRadius)}
                    </div>
                  )}

                  {/* Image Element */}
                  {element.type === 'image' && renderImage(element, displayScale, isCropping)}

                  {/* Line Element */}
                  {element.type === 'line' && renderLine(element, displayScale)}

                  {/* Gradient Element */}
                  {element.type === 'gradient' && renderGradient(element, displayScale)}

                  {/* Divider Element */}
                  {element.type === 'divider' && renderDivider(element, displayScale)}

                  {/* Crop Overlay for Images */}
                  {isCropping && cropBox && (
                    <div className="absolute inset-0 z-50">
                      {/* Dark overlay outside crop region */}
                      <div 
                        className="absolute inset-0 bg-black/60 pointer-events-none"
                        style={{
                          clipPath: `polygon(
                            0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                            ${(cropBox.x / element.width) * 100}% ${(cropBox.y / element.height) * 100}%,
                            ${(cropBox.x / element.width) * 100}% ${((cropBox.y + cropBox.height) / element.height) * 100}%,
                            ${((cropBox.x + cropBox.width) / element.width) * 100}% ${((cropBox.y + cropBox.height) / element.height) * 100}%,
                            ${((cropBox.x + cropBox.width) / element.width) * 100}% ${(cropBox.y / element.height) * 100}%,
                            ${(cropBox.x / element.width) * 100}% ${(cropBox.y / element.height) * 100}%
                          )`
                        }}
                      />
                      
                      {/* Crop box */}
                      <div
                        className="absolute border-2 border-white cursor-move"
                        style={{
                          left: `${(cropBox.x / element.width) * 100}%`,
                          top: `${(cropBox.y / element.height) * 100}%`,
                          width: `${(cropBox.width / element.width) * 100}%`,
                          height: `${(cropBox.height / element.height) * 100}%`,
                          boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                        }}
                        onMouseDown={(e) => handleCropDragStart(e, 'move')}
                      >
                        {/* Grid lines */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                        </div>
                        
                        {/* Corner handles */}
                        {['nw', 'ne', 'sw', 'se'].map(corner => (
                          <div
                            key={corner}
                            className="absolute w-3 h-3 bg-white border-2 border-[#FF843E] rounded-sm"
                            style={{
                              left: corner.includes('w') ? '-6px' : undefined,
                              right: corner.includes('e') ? '-6px' : undefined,
                              top: corner.includes('n') ? '-6px' : undefined,
                              bottom: corner.includes('s') ? '-6px' : undefined,
                              cursor: `${corner}-resize`
                            }}
                            onMouseDown={(e) => handleCropDragStart(e, corner)}
                          />
                        ))}
                        
                        {/* Edge handles */}
                        {['n', 's', 'e', 'w'].map(edge => (
                          <div
                            key={edge}
                            className="absolute bg-white"
                            style={{
                              left: edge === 'e' ? undefined : edge === 'w' ? '-2px' : '50%',
                              right: edge === 'e' ? '-2px' : undefined,
                              top: edge === 's' ? undefined : edge === 'n' ? '-2px' : '50%',
                              bottom: edge === 's' ? '-2px' : undefined,
                              width: edge === 'n' || edge === 's' ? '24px' : '4px',
                              height: edge === 'e' || edge === 'w' ? '24px' : '4px',
                              transform: edge === 'n' || edge === 's' ? 'translateX(-50%)' : 'translateY(-50%)',
                              cursor: edge === 'n' || edge === 's' ? 'ns-resize' : 'ew-resize',
                              borderRadius: '2px'
                            }}
                            onMouseDown={(e) => handleCropDragStart(e, edge)}
                          />
                        ))}
                      </div>
                      
                      {/* Crop controls */}
                      <div 
                        className="absolute flex items-center gap-2 bg-[#1C1C1C] rounded-lg shadow-xl border border-[#333] p-1"
                        style={{
                          left: '50%',
                          bottom: '-50px',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <button
                          onClick={handleCancelCrop}
                          className="flex items-center gap-1 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-[#2F2F2F] rounded transition-colors text-xs"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                        <div className="w-px h-5 bg-[#333]" />
                        <button
                          onClick={handleApplyCrop}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#FF843E] hover:bg-[#e6762e] text-white rounded transition-colors text-xs"
                        >
                          <Check size={14} />
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Controls Overlay - Rendered separately to always be on top */}
            {activeElementId && !croppingElementId && (() => {
              const element = elements.find(el => el.id === activeElementId);
              if (!element || hiddenLayers.has(element.id)) return null;
              
              const isLocked = lockedElements.has(activeElementId);
              const isEditing = editingTextId === activeElementId;
              
              const handleResizeMouseDown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
                setResizeDirection('se');
              };
              
              return (
                <div 
                  className="pointer-events-none absolute inset-0"
                  style={{ zIndex: 10000 }}
                >
                  {/* Resize Handle */}
                  {!isLocked && !isEditing && (
                    <div
                      onMouseDown={handleResizeMouseDown}
                      className="pointer-events-auto absolute w-2 h-2 bg-[#FF843E] border border-white rounded-sm cursor-se-resize shadow-sm"
                      style={{
                        left: `${(element.x + element.width) * displayScale - 4}px`,
                        top: `${(element.y + element.height) * displayScale - 4}px`,
                        transform: `scale(${1 / Math.max(displayScale, 0.5)})`,
                        transformOrigin: 'center'
                      }}
                    />
                  )}

                  {/* Corner Handles */}
                  {!isLocked && !isEditing && ['tl', 'tr', 'bl'].map(corner => (
                    <div 
                      key={corner}
                      className="pointer-events-auto absolute bg-white border border-[#FF843E] rounded-sm"
                      style={{
                        width: '5px',
                        height: '5px',
                        left: corner.includes('l') 
                          ? `${element.x * displayScale - 2}px` 
                          : `${(element.x + element.width) * displayScale - 2}px`,
                        top: corner.includes('t') 
                          ? `${element.y * displayScale - 2}px` 
                          : `${(element.y + element.height) * displayScale - 2}px`,
                        transform: `scale(${1 / Math.max(displayScale, 0.5)})`,
                        transformOrigin: 'center'
                      }}
                    />
                  ))}

                  {/* Action Buttons */}
                  {!isLocked && !isEditing && (
                    <div 
                      className="pointer-events-auto absolute flex items-center gap-px bg-[#1C1C1C]/90 border border-[#333333] rounded-sm shadow-lg"
                      style={{
                        left: `${(element.x + element.width / 2) * displayScale}px`,
                        top: `${element.y * displayScale - 20}px`,
                        transform: `translateX(-50%) scale(${1 / Math.max(displayScale, 0.5)})`,
                        transformOrigin: 'bottom center',
                        padding: '1px'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateElement?.(activeElementId);
                        }}
                        className="p-0.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-sm transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={9} />
                      </button>
                      <div className="w-px h-2 bg-[#444]" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement?.(activeElementId);
                        }}
                        className="p-0.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={9} />
                      </button>
                    </div>
                  )}

                  {/* Lock Indicator */}
                  {isLocked && (
                    <div 
                      className="pointer-events-auto absolute bg-[#FF843E] text-white text-[10px] px-2 py-0.5 rounded font-medium"
                      style={{
                        left: `${(element.x + element.width / 2) * displayScale}px`,
                        top: `${element.y * displayScale - 24}px`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      Locked
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
