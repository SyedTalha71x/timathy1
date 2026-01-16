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

const EditorToolbar = ({
  selectedTool,
  onSelectTool,
  onAddText,
  onAddShape,
  onAddImage,
  onAddLine,
  onAddGradient,
  onAddDivider,
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
      case 'divider': return <Minus size={12} className="text-yellow-400" />;
      default: return <LayersIcon size={12} className="text-gray-400" />;
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
      case 'divider': return 'bg-yellow-500/10';
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
    if (el.type === 'divider') return 'Divider';
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
    <div className="w-[280px] min-w-[280px] h-full bg-[#141414] border-r border-[#333333] flex flex-col overflow-hidden relative z-10">
      {/* Tools Section */}
      <div className="p-2 border-b border-[#333333]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-2">Tools</p>
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
      <div className="p-2 border-b border-[#333333]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-2">Add Elements</p>
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
          <div className="relative">
            <ToolButton
              icon={Square}
              label="Shapes"
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              hasDropdown
            />
            {showShapeMenu && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setShowShapeMenu(false)} />
                <div className="absolute left-full top-0 ml-1 bg-[#1C1C1C] border border-[#333333] rounded-lg p-2 shadow-2xl z-[110] min-w-[160px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-1">Shapes</p>
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
                          className="p-2 rounded hover:bg-[#2F2F2F] transition-colors group"
                          title={shape.name}
                        >
                          <Icon size={16} className="text-gray-400 group-hover:text-orange-500 mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Lines */}
          <div className="relative">
            <ToolButton
              icon={Minus}
              label="Lines"
              onClick={() => setShowLineMenu(!showLineMenu)}
              hasDropdown
            />
            {showLineMenu && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setShowLineMenu(false)} />
                <div className="absolute left-full top-0 ml-1 bg-[#1C1C1C] border border-[#333333] rounded-lg p-2 shadow-2xl z-[110] min-w-[140px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-1">Lines</p>
                  <div className="space-y-0.5">
                    {lineStyles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => handleAddLine(style.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#2F2F2F] transition-colors text-left"
                      >
                        <div className="w-8 h-3 flex items-center">
                          {style.id === 'solid' && <div className="w-full h-0.5 bg-gray-400" />}
                          {style.id === 'dashed' && <div className="w-full h-0.5 bg-gray-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor, currentColor 4px, transparent 4px, transparent 8px)' }} />}
                          {style.id === 'dotted' && <div className="w-full h-0.5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9ca3af, #9ca3af 2px, transparent 2px, transparent 6px)' }} />}
                          {style.id === 'arrow' && <ArrowRight size={14} className="text-gray-400" />}
                          {style.id === 'double-arrow' && <div className="flex items-center text-gray-400"><span className="text-[10px]">←</span><span className="text-[10px]">→</span></div>}
                        </div>
                        <span className="text-xs text-gray-300">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Gradients */}
          <div className="relative">
            <ToolButton
              icon={Droplet}
              label="Gradients"
              onClick={() => setShowGradientMenu(!showGradientMenu)}
              hasDropdown
            />
            {showGradientMenu && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setShowGradientMenu(false)} />
                <div className="absolute left-full top-0 ml-1 bg-[#1C1C1C] border border-[#333333] rounded-lg p-2 shadow-2xl z-[110] min-w-[160px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-1">Gradients</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {gradientPresets.map(gradient => (
                      <button
                        key={gradient.id}
                        onClick={() => {
                          onAddGradient?.(gradient.colors);
                          setShowGradientMenu(false);
                        }}
                        className="p-1 rounded hover:ring-2 hover:ring-orange-500 transition-all"
                        title={gradient.name}
                      >
                        <div 
                          className="w-full h-8 rounded"
                          style={{ background: `linear-gradient(135deg, ${gradient.colors.join(', ')})` }}
                        />
                        <span className="text-[9px] text-gray-500 block mt-0.5 truncate">{gradient.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Divider */}
          <ToolButton
            icon={Minus}
            label="Divider"
            onClick={() => onAddDivider?.()}
          />
          
          {/* Image */}
          <ToolButton
            icon={ImageIcon}
            label="Image"
            onClick={onAddImage}
          />
        </div>
      </div>

      {/* Layers Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#1a1a1a] transition-colors"
        >
          {showLayers ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
          <LayersIcon size={12} className="text-gray-400" />
          <span className="text-gray-300 text-xs font-medium uppercase tracking-wider flex-1 text-left">Layers</span>
          <span className="text-gray-500 text-[10px] bg-[#0a0a0a] px-1.5 py-0.5 rounded-full">{elements.length}</span>
        </button>
        
        {showLayers && (
          <div className="flex-1 overflow-y-auto px-1.5 pb-2">
            {elements.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 text-xs">No layers</p>
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
                        ${isActive ? 'bg-orange-500/10 border border-orange-500/30' : 'hover:bg-[#1a1a1a] border border-transparent'}
                        ${isHidden ? 'opacity-50' : ''}
                        ${isDragging && !isBackground ? 'opacity-50 scale-95' : ''}
                        ${isDragOver && !isBackground ? 'border-orange-500/50' : ''}
                      `}
                      onClick={() => onSelectElement?.(el.id)}
                      draggable={!isBackground}
                      onDragStart={(e) => !isBackground && handleLayerDragStart(e, el.id)}
                      onDragOver={(e) => !isBackground && handleLayerDragOver(e, el.id)}
                      onDrop={(e) => !isBackground && handleLayerDrop(e, el.id)}
                      onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                    >
                      {!isBackground ? (
                        <GripVertical size={10} className="text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab" />
                      ) : <div className="w-[10px]" />}

                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(el.id); }}
                        className="p-0.5 text-gray-500 hover:text-white"
                      >
                        {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>

                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${getElementColor(el)}`}>
                        {getElementIcon(el)}
                      </div>
                      <span className={`flex-1 truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {getElementName(el)}
                      </span>

                      {(el.type === 'shape' || el.type === 'text' || el.type === 'line' || el.type === 'divider') && (
                        <div className="w-3 h-3 rounded border border-[#333] flex-shrink-0" style={{ backgroundColor: el.color }} />
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleLock?.(el.id); }}
                        className={`p-0.5 rounded opacity-0 group-hover:opacity-100 ${isElLocked ? 'text-orange-500' : 'text-gray-500 hover:text-white'}`}
                      >
                        {isElLocked ? <Lock size={10} /> : <Unlock size={10} />}
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); if (!isElLocked) onDeleteElement?.(el.id); }}
                        disabled={isElLocked}
                        className={`p-0.5 rounded opacity-0 group-hover:opacity-100 ${isElLocked ? 'text-gray-700' : 'text-gray-500 hover:text-red-400'}`}
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
      <div className="p-2 border-t border-[#333333]">
        <button
          onMouseEnter={() => setShowShortcutsTooltip(true)}
          onMouseLeave={() => setShowShortcutsTooltip(false)}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-gray-600 hover:text-gray-400 hover:bg-[#1a1a1a] rounded-lg transition-colors relative"
        >
          <Keyboard size={14} />
          <span className="text-xs">Shortcuts</span>
          
          {showShortcutsTooltip && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1C1C1C] border border-[#333333] rounded-lg p-2 shadow-xl z-50">
              <div className="text-[10px] text-gray-300 space-y-1">
                <div className="flex justify-between"><span>Delete</span><kbd className="bg-[#0a0a0a] px-1 rounded text-gray-500">Del</kbd></div>
                <div className="flex justify-between"><span>Undo</span><kbd className="bg-[#0a0a0a] px-1 rounded text-gray-500">Ctrl+Z</kbd></div>
                <div className="flex justify-between"><span>Redo</span><kbd className="bg-[#0a0a0a] px-1 rounded text-gray-500">Ctrl+Shift+Z</kbd></div>
                <div className="flex justify-between"><span>Duplicate</span><kbd className="bg-[#0a0a0a] px-1 rounded text-gray-500">Ctrl+D</kbd></div>
                <div className="flex justify-between"><span>Save</span><kbd className="bg-[#0a0a0a] px-1 rounded text-gray-500">Ctrl+S</kbd></div>
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
        ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' 
        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'}
    `}
  >
    <Icon size={16} />
    <span className="text-sm flex-1">{label}</span>
    {hasDropdown && <ChevronRight size={12} className="text-gray-600" />}
  </button>
);

export default EditorToolbar;
