import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Star,
  Heart,
  Hexagon,
  Diamond,
  Image as ImageIcon,
  MousePointer,
  ChevronRight,
  ChevronDown,
  Keyboard,
  Layers as LayersIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
  Frame,
  Minus,
  ArrowRight,
  Droplet
} from 'lucide-react';

const shapes = [
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
  { id: 'hexagon', name: 'Hexagon', icon: Hexagon },
  { id: 'diamond', name: 'Diamond', icon: Diamond },
];

const lineStyles = [
  { id: 'solid', name: 'Solid Line' },
  { id: 'dashed', name: 'Dashed Line' },
  { id: 'dotted', name: 'Dotted Line' },
  { id: 'arrow', name: 'Arrow' },
  { id: 'double-arrow', name: 'Double Arrow' },
];

const gradientPresets = [
  { id: 'sunset', name: 'Sunset', colors: ['#FF6B6B', '#FFA500'] },
  { id: 'ocean', name: 'Ocean', colors: ['#00D9FF', '#0077B6'] },
  { id: 'forest', name: 'Forest', colors: ['#10B981', '#064E3B'] },
  { id: 'fire', name: 'Fire', colors: ['#F59E0B', '#DC2626'] },
  { id: 'night', name: 'Night', colors: ['#8B5CF6', '#1E1B4B'] },
  { id: 'candy', name: 'Candy', colors: ['#EC4899', '#8B5CF6'] },
];

// Portal-based Popup component that renders outside overflow:hidden containers
const PortalPopup = ({ isOpen, onClose, triggerRef, children, width = 160 }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popupHeight = popupRef.current?.offsetHeight || 200;
      
      // Position to the right of the trigger
      let top = rect.top;
      let left = rect.right + 8;
      
      // Check if popup would go off screen bottom
      if (top + popupHeight > window.innerHeight - 20) {
        top = window.innerHeight - popupHeight - 20;
      }
      
      // Check if popup would go off screen right
      if (left + width > window.innerWidth - 20) {
        left = rect.left - width - 8;
      }
      
      setPosition({ top: Math.max(10, top), left: Math.max(10, left) });
    }
  }, [isOpen, triggerRef, width]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 99998 
        }}
        onClick={onClose} 
      />
      {/* Popup */}
      <div 
        ref={popupRef}
        style={{ 
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 99999,
          minWidth: `${width}px`
        }}
        className="bg-surface-card border border-border rounded-lg p-2 shadow-2xl"
      >
        {children}
      </div>
    </>,
    document.body
  );
};

const EditorToolbar = ({
  selectedTool,
  onSelectTool,
  onAddText,
  onAddShape,
  onAddImage,
  onAddLine,
  onAddGradient,
  elements = [],
  activeElementId,
  lockedElements = new Set(),
  hiddenLayers = new Set(),
  onSelectElement,
  onToggleLock,
  onToggleVisibility,
  onDeleteElement,
  onReorderElements
}) => {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showLineMenu, setShowLineMenu] = useState(false);
  const [showGradientMenu, setShowGradientMenu] = useState(false);
  const [showShortcutsTooltip, setShowShortcutsTooltip] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Refs for popup positioning
  const shapeButtonRef = useRef(null);
  const lineButtonRef = useRef(null);
  const gradientButtonRef = useRef(null);

  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const handleLayerDragStart = (e, elementId) => {
    setDraggedId(elementId);
    e.dataTransfer.setData('text/plain', elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLayerDragOver = (e, elementId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (elementId !== draggedId) {
      setDragOverId(elementId);
    }
  };

  const handleLayerDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId && sourceId !== targetId) {
      onReorderElements?.(sourceId, targetId, 'after');
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const getElementIcon = (el) => {
    if (el.isBackground) return <Frame size={12} className="text-amber-400" />;
    switch (el.type) {
      case 'text': return <Type size={12} className="text-blue-400" />;
      case 'shape': return <Square size={12} className="text-green-400" />;
      case 'image': return <ImageIcon size={12} className="text-purple-400" />;
      case 'line': return <Minus size={12} className="text-cyan-400" />;
      case 'gradient': return <Droplet size={12} className="text-pink-400" />;
      default: return <LayersIcon size={12} className="text-content-muted" />;
    }
  };

  const getElementColor = (el) => {
    if (el.isBackground) return 'bg-amber-500/10';
    switch (el.type) {
      case 'text': return 'bg-blue-500/10';
      case 'shape': return 'bg-green-500/10';
      case 'image': return 'bg-purple-500/10';
      case 'line': return 'bg-cyan-500/10';
      case 'gradient': return 'bg-pink-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getElementName = (el) => {
    if (el.isBackground) return 'Background';
    if (el.type === 'text') return el.content?.substring(0, 12) || 'Text';
    if (el.type === 'shape') return el.shape?.charAt(0).toUpperCase() + el.shape?.slice(1) || 'Shape';
    if (el.type === 'image') return 'Image';
    if (el.type === 'line') return 'Line';
    if (el.type === 'gradient') return 'Gradient';
    return 'Layer';
  };

  const handleAddLine = (style) => {
    const arrowStart = style === 'double-arrow';
    const arrowEnd = style === 'arrow' || style === 'double-arrow';
    const lineStyle = style === 'arrow' || style === 'double-arrow' ? 'solid' : style;
    onAddLine?.({ lineStyle, arrowStart, arrowEnd });
    setShowLineMenu(false);
  };

  return (
    <div className="w-[280px] min-w-[280px] h-full bg-surface-dark border-r border-border flex flex-col overflow-hidden">
      {/* Tools Section */}
      <div className="p-2 border-b border-border">
        <p className="text-[10px] text-content-faint uppercase tracking-wider mb-1.5 px-2">Tools</p>
        <div className="space-y-0.5">
          <ToolButton
            icon={MousePointer}
            label="Select"
            isActive={selectedTool === 'select'}
            onClick={() => onSelectTool('select')}
          />
        </div>
      </div>

      {/* Add Elements Section */}
      <div className="p-2 border-b border-border">
        <p className="text-[10px] text-content-faint uppercase tracking-wider mb-1.5 px-2">Add Elements</p>
        <div className="space-y-0.5">
          <ToolButton
            icon={Type}
            label="Text"
            onClick={() => {
              onSelectTool('text');
              onAddText();
            }}
          />
          
          {/* Shapes */}
          <div ref={shapeButtonRef}>
            <ToolButton
              icon={Square}
              label="Shapes"
              onClick={() => {
                setShowLineMenu(false);
                setShowGradientMenu(false);
                setShowShapeMenu(!showShapeMenu);
              }}
              hasDropdown
              isActive={showShapeMenu}
            />
          </div>
          
          {/* Lines */}
          <div ref={lineButtonRef}>
            <ToolButton
              icon={Minus}
              label="Lines"
              onClick={() => {
                setShowShapeMenu(false);
                setShowGradientMenu(false);
                setShowLineMenu(!showLineMenu);
              }}
              hasDropdown
              isActive={showLineMenu}
            />
          </div>
          
          {/* Gradients */}
          <div ref={gradientButtonRef}>
            <ToolButton
              icon={Droplet}
              label="Gradients"
              onClick={() => {
                setShowShapeMenu(false);
                setShowLineMenu(false);
                setShowGradientMenu(!showGradientMenu);
              }}
              hasDropdown
              isActive={showGradientMenu}
            />
          </div>
          
          {/* Image */}
          <ToolButton
            icon={ImageIcon}
            label="Image"
            onClick={onAddImage}
          />
        </div>
      </div>

      {/* Portal-based Popups */}
      <PortalPopup 
        isOpen={showShapeMenu} 
        onClose={() => setShowShapeMenu(false)}
        triggerRef={shapeButtonRef}
        width={180}
      >
        <p className="text-[10px] text-content-faint uppercase tracking-wider mb-1.5 px-1">Shapes</p>
        <div className="grid grid-cols-4 gap-1">
          {shapes.map(shape => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.id}
                onClick={() => {
                  onAddShape(shape.id);
                  setShowShapeMenu(false);
                }}
                className="p-2 rounded hover:bg-surface-button transition-colors group"
                title={shape.name}
              >
                <Icon size={16} className="text-content-muted group-hover:text-primary mx-auto" />
              </button>
            );
          })}
        </div>
      </PortalPopup>

      <PortalPopup 
        isOpen={showLineMenu} 
        onClose={() => setShowLineMenu(false)}
        triggerRef={lineButtonRef}
        width={160}
      >
        <p className="text-[10px] text-content-faint uppercase tracking-wider mb-1.5 px-1">Lines</p>
        <div className="space-y-0.5">
          {lineStyles.map(style => (
            <button
              key={style.id}
              onClick={() => handleAddLine(style.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-button transition-colors text-left"
            >
              <div className="w-8 h-3 flex items-center">
                {style.id === 'solid' && <div className="w-full h-0.5 bg-gray-400" />}
                {style.id === 'dashed' && <div className="w-full h-0.5 bg-gray-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor, currentColor 4px, transparent 4px, transparent 8px)' }} />}
                {style.id === 'dotted' && <div className="w-full h-0.5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9ca3af, #9ca3af 2px, transparent 2px, transparent 6px)' }} />}
                {style.id === 'arrow' && <ArrowRight size={14} className="text-content-muted" />}
                {style.id === 'double-arrow' && <div className="flex items-center text-content-muted text-[10px]">&lt;-&gt;</div>}
              </div>
              <span className="text-xs text-content-secondary">{style.name}</span>
            </button>
          ))}
        </div>
      </PortalPopup>

      <PortalPopup 
        isOpen={showGradientMenu} 
        onClose={() => setShowGradientMenu(false)}
        triggerRef={gradientButtonRef}
        width={180}
      >
        <p className="text-[10px] text-content-faint uppercase tracking-wider mb-1.5 px-1">Gradients</p>
        <div className="grid grid-cols-2 gap-1.5">
          {gradientPresets.map(gradient => (
            <button
              key={gradient.id}
              onClick={() => {
                onAddGradient?.(gradient.colors);
                setShowGradientMenu(false);
              }}
              className="p-1 rounded hover:ring-2 hover:ring-primary transition-all"
              title={gradient.name}
            >
              <div 
                className="w-full h-8 rounded"
                style={{ background: `linear-gradient(135deg, ${gradient.colors.join(', ')})` }}
              />
              <span className="text-[9px] text-content-faint block mt-0.5 truncate">{gradient.name}</span>
            </button>
          ))}
        </div>
      </PortalPopup>

      {/* Layers Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover transition-colors"
        >
          {showLayers ? <ChevronDown size={12} className="text-content-muted" /> : <ChevronRight size={12} className="text-content-muted" />}
          <LayersIcon size={12} className="text-content-muted" />
          <span className="text-content-secondary text-xs font-medium uppercase tracking-wider flex-1 text-left">Layers</span>
          <span className="text-content-faint text-[10px] bg-surface-dark px-1.5 py-0.5 rounded-full">{elements.length}</span>
        </button>
        
        {showLayers && (
          <div className="flex-1 overflow-y-auto px-1.5 pb-2">
            {elements.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-content-faint text-xs">No layers</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {sortedElements.map((el) => {
                  const isActive = activeElementId === el.id;
                  const isElLocked = lockedElements.has(el.id);
                  const isHidden = hiddenLayers.has(el.id);
                  const isDragging = draggedId === el.id;
                  const isDragOver = dragOverId === el.id;
                  const isBackground = el.isBackground;

                  return (
                    <div
                      key={el.id}
                      className={`
                        group flex items-center gap-1 p-1.5 rounded-lg cursor-pointer transition-all text-xs
                        ${isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-surface-hover border border-transparent'}
                        ${isHidden ? 'opacity-50' : ''}
                        ${isDragging && !isBackground ? 'opacity-50 scale-95' : ''}
                        ${isDragOver && !isBackground ? 'border-primary/50' : ''}
                      `}
                      onClick={() => onSelectElement?.(el.id)}
                      draggable={!isBackground}
                      onDragStart={(e) => !isBackground && handleLayerDragStart(e, el.id)}
                      onDragOver={(e) => !isBackground && handleLayerDragOver(e, el.id)}
                      onDrop={(e) => !isBackground && handleLayerDrop(e, el.id)}
                      onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                    >
                      {!isBackground ? (
                        <GripVertical size={10} className="text-content-faint opacity-0 group-hover:opacity-100 cursor-grab" />
                      ) : <div className="w-[10px]" />}

                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(el.id); }}
                        className="p-0.5 text-content-faint hover:text-content-primary"
                      >
                        {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>

                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${getElementColor(el)}`}>
                        {getElementIcon(el)}
                      </div>
                      <span className={`flex-1 truncate ${isActive ? 'text-content-primary' : 'text-content-muted'}`}>
                        {getElementName(el)}
                      </span>

                      {(el.type === 'shape' || el.type === 'text' || el.type === 'line') && (
                        <div className="w-3 h-3 rounded border border-border flex-shrink-0" style={{ backgroundColor: el.color }} />
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleLock?.(el.id); }}
                        className={`p-0.5 rounded opacity-0 group-hover:opacity-100 ${isElLocked ? 'text-primary' : 'text-content-faint hover:text-content-primary'}`}
                      >
                        {isElLocked ? <Lock size={10} /> : <Unlock size={10} />}
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); if (!isElLocked) onDeleteElement?.(el.id); }}
                        disabled={isElLocked}
                        className={`p-0.5 rounded opacity-0 group-hover:opacity-100 ${isElLocked ? 'text-content-faint' : 'text-content-faint hover:text-red-400'}`}
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div className="p-2 border-t border-border">
        <button
          onMouseEnter={() => setShowShortcutsTooltip(true)}
          onMouseLeave={() => setShowShortcutsTooltip(false)}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-content-faint hover:text-content-muted hover:bg-surface-hover rounded-lg transition-colors relative"
        >
          <Keyboard size={14} />
          <span className="text-xs">Shortcuts</span>
          
          {showShortcutsTooltip && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-card border border-border rounded-lg p-2 shadow-xl z-[99999]">
              <div className="text-[10px] text-content-secondary space-y-1">
                <div className="flex justify-between"><span>Delete</span><kbd className="bg-surface-dark px-1 rounded text-content-faint">Del</kbd></div>
                <div className="flex justify-between"><span>Undo</span><kbd className="bg-surface-dark px-1 rounded text-content-faint">Ctrl+Z</kbd></div>
                <div className="flex justify-between"><span>Redo</span><kbd className="bg-surface-dark px-1 rounded text-content-faint">Ctrl+Shift+Z</kbd></div>
                <div className="flex justify-between"><span>Duplicate</span><kbd className="bg-surface-dark px-1 rounded text-content-faint">Ctrl+D</kbd></div>
                <div className="flex justify-between"><span>Save</span><kbd className="bg-surface-dark px-1 rounded text-content-faint">Ctrl+S</kbd></div>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

const ToolButton = ({ icon: Icon, label, isActive, onClick, hasDropdown }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all text-left
      ${isActive 
        ? 'bg-primary/10 text-primary border border-primary/30' 
        : 'text-content-muted hover:bg-surface-hover hover:text-content-primary border border-transparent'}
    `}
  >
    <Icon size={16} />
    <span className="text-sm flex-1">{label}</span>
    {hasDropdown && <ChevronRight size={12} className="text-content-faint" />}
  </button>
);

export default EditorToolbar;
