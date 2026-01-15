import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Lock,
  Unlock,
  Palette,
  Type,
  Maximize2,
  Image as ImageIcon,
  Move,
  Layers as LayersIcon,
  PenTool,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  Square
} from 'lucide-react';
import { fontFamilies, colorPalettes } from '../constants/platformSizes';

const PropertiesPanel = ({
  element,
  onUpdate,
  isLocked,
  onToggleLock,
  // Layer props
  elements = [],
  activeElementId,
  lockedElements = new Set(),
  hiddenLayers = new Set(),
  onSelectElement,
  onToggleVisibility,
  onDeleteElement,
  onReorderElements
}) => {
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    layers: true,
    content: true,
    formatting: true,
    font: true,
    color: true,
    position: false
  });

  // Layer drag state
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
    switch (el.type) {
      case 'text':
        return <Type size={14} className="text-blue-400" />;
      case 'shape':
        return <Square size={14} className="text-green-400" />;
      case 'image':
        return <ImageIcon size={14} className="text-purple-400" />;
      default:
        return <LayersIcon size={14} className="text-gray-400" />;
    }
  };

  const getElementColor = (el) => {
    switch (el.type) {
      case 'text': return 'bg-blue-500/10';
      case 'shape': return 'bg-green-500/10';
      case 'image': return 'bg-purple-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getElementName = (el) => {
    if (el.type === 'text') {
      return el.content?.substring(0, 20) || 'Text';
    }
    if (el.type === 'shape') {
      return el.shape?.charAt(0).toUpperCase() + el.shape?.slice(1) || 'Shape';
    }
    if (el.type === 'image') {
      return 'Image';
    }
    return 'Layer';
  };

  const getActiveElementIcon = () => {
    switch (element?.type) {
      case 'text': return <Type size={16} className="text-blue-400" />;
      case 'shape': return <Palette size={16} className="text-green-400" />;
      case 'image': return <ImageIcon size={16} className="text-purple-400" />;
      default: return <Maximize2 size={16} className="text-gray-400" />;
    }
  };

  const getActiveElementColor = () => {
    switch (element?.type) {
      case 'text': return 'bg-blue-500/10';
      case 'shape': return 'bg-green-500/10';
      case 'image': return 'bg-purple-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#141414]">
      {/* Layers Section - Collapsible at top */}
      <div className="border-b border-[#333333]">
        <button
          onClick={() => toggleSection('layers')}
          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#1a1a1a] transition-colors"
        >
          {expandedSections.layers ? (
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
        
        {expandedSections.layers && (
          <div className="px-2 pb-3 max-h-[200px] overflow-y-auto">
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

                  return (
                    <div
                      key={el.id}
                      className={`
                        group flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-all text-xs
                        ${isActive 
                          ? 'bg-orange-500/10 border border-orange-500/30' 
                          : 'hover:bg-[#2F2F2F] border border-transparent'}
                        ${isHidden ? 'opacity-50' : ''}
                        ${isDragging ? 'opacity-50 scale-95' : ''}
                        ${isDragOver ? 'border-orange-500/50 bg-orange-500/5' : ''}
                      `}
                      onClick={() => onSelectElement?.(el.id)}
                      draggable
                      onDragStart={(e) => handleLayerDragStart(e, el.id)}
                      onDragOver={(e) => handleLayerDragOver(e, el.id)}
                      onDragLeave={handleLayerDragLeave}
                      onDrop={(e) => handleLayerDrop(e, el.id)}
                      onDragEnd={handleLayerDragEnd}
                    >
                      {/* Drag Handle */}
                      <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={10} className="text-gray-500" />
                      </div>

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

      {/* Properties - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {!element ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-4">
              <Maximize2 size={22} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No element selected</p>
            <p className="text-gray-600 text-xs mt-1">Click on any element in the canvas</p>
          </div>
        ) : (
          <>
            {/* Element Type Header */}
            <div className="p-4 border-b border-[#333333]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${getActiveElementColor()}`}>
                    {getActiveElementIcon()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm capitalize">{element.type}</p>
                    {element.shape && (
                      <p className="text-gray-500 text-xs capitalize">{element.shape}</p>
                    )}
                  </div>
                </div>
                
                {/* Lock Button */}
                <button
                  onClick={onToggleLock}
                  className={`p-2 rounded-xl transition-colors ${
                    isLocked 
                      ? 'bg-orange-500/10 text-[#FF843E]' 
                      : 'text-gray-400 hover:bg-[#2F2F2F] hover:text-white'
                  }`}
                  title={isLocked ? 'Unlock element' : 'Lock element'}
                >
                  {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
              </div>
            </div>

            {/* Text Properties */}
            {element.type === 'text' && (
              <>
                {/* Content Section */}
                <CollapsibleSection
                  title="Content"
                  icon={Type}
                  isExpanded={expandedSections.content}
                  onToggle={() => toggleSection('content')}
                >
                  <textarea
                    value={element.content || ''}
                    onChange={(e) => onUpdate({ content: e.target.value })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-3 px-4 text-white text-sm resize-none focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                    rows={3}
                    placeholder="Enter text..."
                  />
                </CollapsibleSection>

                {/* Formatting Section */}
                <CollapsibleSection
                  title="Formatting"
                  icon={PenTool}
                  isExpanded={expandedSections.formatting}
                  onToggle={() => toggleSection('formatting')}
                >
                  <div className="flex gap-1 flex-wrap">
                    <FormatButton
                      icon={Bold}
                      isActive={element.bold}
                      onClick={() => onUpdate({ bold: !element.bold })}
                      disabled={isLocked}
                      title="Bold"
                    />
                    <FormatButton
                      icon={Italic}
                      isActive={element.italic}
                      onClick={() => onUpdate({ italic: !element.italic })}
                      disabled={isLocked}
                      title="Italic"
                    />
                    <FormatButton
                      icon={Underline}
                      isActive={element.underline}
                      onClick={() => onUpdate({ underline: !element.underline })}
                      disabled={isLocked}
                      title="Underline"
                    />
                    <div className="w-px bg-[#333333] mx-1" />
                    <FormatButton
                      icon={AlignLeft}
                      isActive={element.align === 'left'}
                      onClick={() => onUpdate({ align: 'left' })}
                      disabled={isLocked}
                      title="Align Left"
                    />
                    <FormatButton
                      icon={AlignCenter}
                      isActive={element.align === 'center'}
                      onClick={() => onUpdate({ align: 'center' })}
                      disabled={isLocked}
                      title="Align Center"
                    />
                    <FormatButton
                      icon={AlignRight}
                      isActive={element.align === 'right'}
                      onClick={() => onUpdate({ align: 'right' })}
                      disabled={isLocked}
                      title="Align Right"
                    />
                  </div>
                </CollapsibleSection>

                {/* Font Section */}
                <CollapsibleSection
                  title="Font & Size"
                  icon={Type}
                  isExpanded={expandedSections.font}
                  onToggle={() => toggleSection('font')}
                >
                  <div className="space-y-3">
                    <select
                      value={element.font || 'Inter, sans-serif'}
                      onChange={(e) => onUpdate({ font: e.target.value })}
                      disabled={isLocked}
                      className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                    >
                      {fontFamilies.map(font => (
                        <option key={font.id} value={font.family} style={{ fontFamily: font.family }}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="8"
                        max="200"
                        value={element.size || 24}
                        onChange={(e) => onUpdate({ size: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-2 bg-[#333333] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-orange-500"
                      />
                      <div className="w-16 bg-[#0a0a0a] border border-[#333333] rounded-lg py-1.5 px-2 text-center">
                        <span className="text-white text-sm">{element.size || 24}px</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            )}

            {/* Color Section */}
            {(element.type === 'text' || element.type === 'shape') && (
              <CollapsibleSection
                title="Color"
                icon={Palette}
                isExpanded={expandedSections.color}
                onToggle={() => toggleSection('color')}
              >
                <div className="space-y-3">
                  {/* Color Input */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl border-2 border-[#333333] cursor-pointer overflow-hidden">
                      <input
                        type="color"
                        value={element.color || '#ffffff'}
                        onChange={(e) => onUpdate({ color: e.target.value })}
                        disabled={isLocked}
                        className="w-full h-full cursor-pointer border-0"
                        style={{ transform: 'scale(1.5)' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={element.color || '#ffffff'}
                      onChange={(e) => onUpdate({ color: e.target.value })}
                      disabled={isLocked}
                      className="flex-1 bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 px-3 text-white text-sm uppercase font-mono focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                    />
                  </div>

                  {/* Color Palettes */}
                  <div className="space-y-2">
                    {colorPalettes.slice(0, 3).map(palette => (
                      <div key={palette.id}>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1.5">{palette.name}</p>
                        <div className="flex gap-1">
                          {palette.colors.map((color, index) => (
                            <button
                              key={index}
                              onClick={() => onUpdate({ color })}
                              disabled={isLocked}
                              className="w-7 h-7 rounded-lg transition-transform hover:scale-110 disabled:opacity-50 border border-[#333333]"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Position & Size Section */}
            <CollapsibleSection
              title="Position & Size"
              icon={Move}
              isExpanded={expandedSections.position}
              onToggle={() => toggleSection('position')}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">X</label>
                  <input
                    type="number"
                    value={Math.round(element.x || 0)}
                    onChange={(e) => onUpdate({ x: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Y</label>
                  <input
                    type="number"
                    value={Math.round(element.y || 0)}
                    onChange={(e) => onUpdate({ y: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Width</label>
                  <input
                    type="number"
                    value={Math.round(element.width || 0)}
                    onChange={(e) => onUpdate({ width: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Height</label>
                  <input
                    type="number"
                    value={Math.round(element.height || 0)}
                    onChange={(e) => onUpdate({ height: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#3F74FF] disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
  <div className="border-b border-[#333333]">
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#1a1a1a] transition-colors"
    >
      {isExpanded ? (
        <ChevronDown size={14} className="text-gray-400" />
      ) : (
        <ChevronRight size={14} className="text-gray-400" />
      )}
      <Icon size={14} className="text-gray-400" />
      <span className="text-gray-300 text-xs font-medium uppercase tracking-wider flex-1 text-left">
        {title}
      </span>
    </button>
    {isExpanded && (
      <div className="px-4 pb-4">
        {children}
      </div>
    )}
  </div>
);

// Format Button Component
const FormatButton = ({ icon: Icon, isActive, onClick, disabled, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-2 rounded-lg transition-colors
      ${isActive 
        ? 'bg-orange-500/10 text-[#FF843E]' 
        : 'text-gray-400 hover:bg-[#2F2F2F] hover:text-white'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    title={title}
  >
    <Icon size={16} />
  </button>
);

export default PropertiesPanel;
