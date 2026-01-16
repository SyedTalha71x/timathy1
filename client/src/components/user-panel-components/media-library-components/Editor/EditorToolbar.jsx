import React, { useState } from 'react';
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
  HelpCircle,
  Layers as LayersIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
  Frame
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

const EditorToolbar = ({
  selectedTool,
  onSelectTool,
  onAddText,
  onAddShape,
  onAddImage,
  // Layer props
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
  const [showShortcutsTooltip, setShowShortcutsTooltip] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  
  // Layer drag state
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Sort elements by z-index (highest first for display)
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  // Layer drag handlers
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
  
  const handleLayerDragLeave = () => {
    setDragOverId(null);
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
  
  const handleLayerDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const getElementIcon = (el) => {
    if (el.isBackground) {
      return <Frame size={12} className="text-amber-400" />;
    }
    switch (el.type) {
      case 'text':
        return <Type size={12} className="text-blue-400" />;
      case 'shape':
        return <Square size={12} className="text-green-400" />;
      case 'image':
        return <ImageIcon size={12} className="text-purple-400" />;
      default:
        return <LayersIcon size={12} className="text-gray-400" />;
    }
  };

  const getElementColor = (el) => {
    if (el.isBackground) return 'bg-amber-500/10';
    switch (el.type) {
      case 'text': return 'bg-blue-500/10';
      case 'shape': return 'bg-green-500/10';
      case 'image': return 'bg-purple-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getElementName = (el) => {
    if (el.isBackground) {
      return 'Background';
    }
    if (el.type === 'text') {
      return el.content?.substring(0, 15) || 'Text';
    }
    if (el.type === 'shape') {
      return el.shape?.charAt(0).toUpperCase() + el.shape?.slice(1) || 'Shape';
    }
    if (el.type === 'image') {
      return 'Image';
    }
    return 'Layer';
  };

  return (
    <div className="w-[260px] min-w-[260px] h-full bg-[#141414] border-r border-[#333333] flex flex-col overflow-hidden">
      {/* Main Tools */}
      <div className="p-3 border-b border-[#333333]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-2">Tools</p>
        <div className="space-y-1">
          {/* Select Tool */}
          <ToolButton
            icon={MousePointer}
            label="Select"
            isActive={selectedTool === 'select'}
            onClick={() => onSelectTool('select')}
          />
        </div>
      </div>

      {/* Add Elements */}
      <div className="p-3 border-b border-[#333333]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-2">Add Elements</p>
        <div className="space-y-1">
          {/* Text Tool */}
          <ToolButton
            icon={Type}
            label="Text"
            isActive={selectedTool === 'text'}
            onClick={() => {
              onSelectTool('text');
              onAddText();
            }}
          />
          
          {/* Shape Tool */}
          <div className="relative">
            <ToolButton
              icon={Square}
              label="Shapes"
              isActive={selectedTool === 'shape'}
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              hasDropdown
            />
            
            {showShapeMenu && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowShapeMenu(false)}
                />
                <div className="fixed left-[270px] top-[150px] bg-[#1C1C1C] border border-[#333333] rounded-xl p-3 shadow-2xl z-50 min-w-[180px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">Select Shape</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {shapes.map(shape => {
                      const Icon = shape.icon;
                      return (
                        <button
                          key={shape.id}
                          onClick={() => {
                            onAddShape(shape.id);
                            setShowShapeMenu(false);
                            onSelectTool('shape');
                          }}
                          className="p-2.5 rounded-lg hover:bg-[#2F2F2F] transition-colors group"
                          title={shape.name}
                        >
                          <Icon size={18} className="text-gray-400 group-hover:text-[#FF843E] transition-colors mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Image Tool */}
          <ToolButton
            icon={ImageIcon}
            label="Image"
            onClick={onAddImage}
          />
        </div>
      </div>

      {/* Layers Section */}
      <div className="flex-1 flex flex-col overflow-hidden border-b border-[#333333]">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="flex items-center gap-2 px-4 py-3 hover:bg-[#1a1a1a] transition-colors"
        >
          {showLayers ? (
            <ChevronDown size={14} className="text-gray-400" />
          ) : (
            <ChevronRight size={14} className="text-gray-400" />
          )}
          <LayersIcon size={14} className="text-gray-400" />
          <span className="text-gray-300 text-xs font-medium uppercase tracking-wider flex-1 text-left">
            Layers
          </span>
          <span className="text-gray-500 text-xs bg-[#0a0a0a] px-2 py-0.5 rounded-full">
            {elements.length}
          </span>
        </button>
        
        {showLayers && (
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {elements.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-xs">No layers yet</p>
              </div>
            ) : (
              <div className="space-y-1">
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
                        group flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-all text-xs
                        ${isActive 
                          ? 'bg-orange-500/10 border border-orange-500/30' 
                          : 'hover:bg-[#2F2F2F] border border-transparent'}
                        ${isHidden ? 'opacity-50' : ''}
                        ${isDragging && !isBackground ? 'opacity-50 scale-95' : ''}
                        ${isDragOver && !isBackground ? 'border-orange-500/50 bg-orange-500/5' : ''}
                        ${isBackground ? 'border-dashed' : ''}
                      `}
                      onClick={() => onSelectElement?.(el.id)}
                      draggable={!isBackground}
                      onDragStart={(e) => !isBackground && handleLayerDragStart(e, el.id)}
                      onDragOver={(e) => !isBackground && handleLayerDragOver(e, el.id)}
                      onDragLeave={handleLayerDragLeave}
                      onDrop={(e) => !isBackground && handleLayerDrop(e, el.id)}
                      onDragEnd={handleLayerDragEnd}
                    >
                      {/* Drag Handle - hidden for background */}
                      {!isBackground ? (
                        <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical size={10} className="text-gray-500" />
                        </div>
                      ) : (
                        <div className="w-[10px]" /> 
                      )}

                      {/* Visibility Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisibility?.(el.id);
                        }}
                        className="p-0.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>

                      {/* Element Icon & Name */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${getElementColor(el)}`}>
                          {getElementIcon(el)}
                        </div>
                        <span className={`truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {getElementName(el)}
                        </span>
                      </div>

                      {/* Color Preview */}
                      {(el.type === 'shape' || el.type === 'text') && (
                        <div 
                          className="w-3 h-3 rounded border border-[#333333] flex-shrink-0"
                          style={{ backgroundColor: el.color }}
                        />
                      )}

                      {/* Lock Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLock?.(el.id);
                        }}
                        className={`p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${
                          isElLocked 
                            ? 'text-[#FF843E]' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {isElLocked ? <Lock size={10} /> : <Unlock size={10} />}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isElLocked) {
                            onDeleteElement?.(el.id);
                          }
                        }}
                        disabled={isElLocked}
                        className={`p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${
                          isElLocked 
                            ? 'text-gray-600 cursor-not-allowed' 
                            : 'text-gray-400 hover:text-red-400'
                        }`}
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

      {/* Keyboard Shortcuts - Tooltip */}
      <div className="p-3 border-t border-[#333333]">
        <div className="relative">
          <button
            onMouseEnter={() => setShowShortcutsTooltip(true)}
            onMouseLeave={() => setShowShortcutsTooltip(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-[#2F2F2F] rounded-xl transition-colors"
          >
            <Keyboard size={16} />
            <span className="text-xs">Keyboard Shortcuts</span>
            <HelpCircle size={12} className="ml-auto" />
          </button>
          
          {/* Tooltip */}
          {showShortcutsTooltip && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1C1C1C] border border-[#333333] rounded-xl p-3 shadow-xl z-50">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-medium">Shortcuts</p>
              <div className="text-[11px] text-gray-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Delete element</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Del</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Undo</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+Z</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Redo</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+Shift+Z</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duplicate</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+D</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Save</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zoom</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+Scroll</kbd>
                </div>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1C1C] border-r border-b border-[#333333] transform rotate-45" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tool Button Component
const ToolButton = ({ icon: Icon, label, isActive, onClick, hasDropdown }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
        ${isActive 
          ? 'bg-orange-500/10 text-[#FF843E] border border-orange-500/30' 
          : 'text-gray-400 hover:bg-[#2F2F2F] hover:text-white border border-transparent'}
      `}
    >
      <Icon size={18} />
      <span className="text-sm flex-1 text-left">{label}</span>
      {hasDropdown && (
        <ChevronRight size={14} className="text-gray-600" />
      )}
    </button>
  );
};

export default EditorToolbar;
