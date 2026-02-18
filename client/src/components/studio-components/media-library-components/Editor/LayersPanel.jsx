import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  GripVertical,
  Type,
  Square,
  Image as ImageIcon,
  Layers as LayersIcon,
  HelpCircle
} from 'lucide-react';

const LayersPanel = ({
  elements,
  activeElementId,
  lockedElements,
  hiddenLayers,
  onSelectElement,
  onToggleLock,
  onToggleVisibility,
  onDeleteElement,
  onReorderElements
}) => {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  
  // Sort elements by z-index (highest first for display)
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const handleDragStart = (e, elementId) => {
    setDraggedId(elementId);
    e.dataTransfer.setData('text/plain', elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, elementId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (elementId !== draggedId) {
      setDragOverId(elementId);
    }
  };
  
  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId && sourceId !== targetId) {
      // In the sorted list (highest z-index first), dropping ABOVE means lower z-index
      // So we use 'after' position since we want the dragged item to have lower z-index
      onReorderElements(sourceId, targetId, 'after');
    }
    setDraggedId(null);
    setDragOverId(null);
  };
  
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const getElementIcon = (element) => {
    switch (element.type) {
      case 'text':
        return <Type size={14} className="text-blue-400" />;
      case 'shape':
        return <Square size={14} className="text-green-400" />;
      case 'image':
        return <ImageIcon size={14} className="text-purple-400" />;
      default:
        return <LayersIcon size={14} className="text-content-muted" />;
    }
  };

  const getElementColor = (element) => {
    switch (element.type) {
      case 'text': return 'bg-blue-500/10';
      case 'shape': return 'bg-green-500/10';
      case 'image': return 'bg-purple-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getElementName = (element) => {
    if (element.type === 'text') {
      return element.content?.substring(0, 20) || 'Text';
    }
    if (element.type === 'shape') {
      return element.shape?.charAt(0).toUpperCase() + element.shape?.slice(1) || 'Shape';
    }
    if (element.type === 'image') {
      return 'Image';
    }
    return 'Layer';
  };

  return (
    <div className="h-full flex flex-col bg-surface-dark">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <LayersIcon size={16} className="text-content-muted" />
          <h3 className="text-content-primary font-medium text-sm">Layers</h3>
          <span className="ml-auto text-content-faint text-xs bg-surface-dark px-2 py-0.5 rounded-full">
            {elements.length}
          </span>
          
          {/* Help Tooltip Trigger */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowHelpTooltip(true)}
              onMouseLeave={() => setShowHelpTooltip(false)}
              className="p-1 text-content-faint hover:text-content-secondary transition-colors"
            >
              <HelpCircle size={14} />
            </button>
            
            {/* Tooltip */}
            {showHelpTooltip && (
              <div className="absolute top-full right-0 mt-2 bg-surface-card border border-border rounded-xl p-3 shadow-xl z-50 w-48">
                <p className="text-[10px] text-content-muted uppercase tracking-wider mb-2 font-medium">Tips</p>
                <div className="text-[11px] text-content-secondary space-y-1.5">
                  <p>- Drag layers to reorder</p>
                  <p>- Click eye to hide/show</p>
                  <p>- Lock to prevent edits</p>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-surface-card border-l border-t border-border transform rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-surface-dark rounded-xl flex items-center justify-center mx-auto mb-2">
              <LayersIcon size={18} className="text-content-faint" />
            </div>
            <p className="text-content-faint text-sm">No layers yet</p>
            <p className="text-content-faint text-xs mt-0.5">Add elements to start</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedElements.map((element, index) => {
              const isActive = activeElementId === element.id;
              const isLocked = lockedElements.has(element.id);
              const isHidden = hiddenLayers.has(element.id);
              const isDragging = draggedId === element.id;
              const isDragOver = dragOverId === element.id;

              return (
                <div
                  key={element.id}
                  className={`
                    group flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-surface-button border border-transparent'}
                    ${isHidden ? 'opacity-50' : ''}
                    ${isDragging ? 'opacity-50 scale-95' : ''}
                    ${isDragOver ? 'border-primary/50 bg-primary/5' : ''}
                  `}
                  onClick={() => onSelectElement(element.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, element.id)}
                  onDragOver={(e) => handleDragOver(e, element.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, element.id)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Drag Handle */}
                  <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={12} className="text-content-faint" />
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(element.id);
                    }}
                    className="p-1 text-content-muted hover:text-content-primary transition-colors"
                    title={isHidden ? 'Show layer' : 'Hide layer'}
                  >
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {/* Element Icon & Name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${getElementColor(element)}`}>
                      {getElementIcon(element)}
                    </div>
                    <span className={`text-sm truncate ${isActive ? 'text-content-primary' : 'text-content-secondary'}`}>
                      {getElementName(element)}
                    </span>
                  </div>

                  {/* Color Preview (for shapes and text) */}
                  {(element.type === 'shape' || element.type === 'text') && (
                    <div 
                      className="w-4 h-4 rounded border border-border flex-shrink-0"
                      style={{ backgroundColor: element.color }}
                      title={element.color}
                    />
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(element.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        isLocked 
                          ? 'text-primary bg-primary/10' 
                          : 'text-content-muted hover:text-content-primary hover:bg-surface-button'
                      }`}
                      title={isLocked ? 'Unlock' : 'Lock'}
                    >
                      {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLocked) {
                          onDeleteElement(element.id);
                        }
                      }}
                      disabled={isLocked}
                      className={`p-1 rounded transition-colors ${
                        isLocked 
                          ? 'text-content-faint cursor-not-allowed' 
                          : 'text-content-muted hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
