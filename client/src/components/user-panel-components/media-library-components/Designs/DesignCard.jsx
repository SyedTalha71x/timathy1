import React, { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  Copy, 
  Download,
  Layers,
  GripVertical
} from 'lucide-react';

const DesignCard = ({ 
  design, 
  onEdit, 
  onDownload, 
  onDelete, 
  onDuplicate,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(design));
    e.dataTransfer.setData('text/plain', design.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add drag image
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.opacity = '0.8';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 100, 100);
    setTimeout(() => document.body.removeChild(dragImage), 0);
    
    onDragStart?.(e, design);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`
        group relative bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-200 border border-[#333333]
        hover:border-[#444444] hover:shadow-lg
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Drag Handle - Top Left */}
      <div 
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing text-white/70 hover:text-white p-1.5 rounded-lg bg-black/50 hover:bg-black/70 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to move"
      >
        <GripVertical size={14} />
      </div>

      {/* Fixed-size Preview Container - Larger size */}
      <div className="relative w-full h-[180px] bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
        {design.thumbnail && design.thumbnail !== 'data:,' ? (
          <img 
            src={design.thumbnail}
            alt={design.name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Layers size={32} className="mb-2 opacity-50" />
            <span className="text-xs">No preview</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className={`
          absolute inset-0 bg-black/60 backdrop-blur-sm
          flex flex-col items-center justify-center gap-2
          transition-all duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          {/* Quick Actions */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(design);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
          >
            <Edit2 size={14} />
            Edit
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(design);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all hover:scale-105"
              title="Download"
            >
              <Download size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.(design);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all hover:scale-105"
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(design);
              }}
              className="p-2 bg-white/10 hover:bg-red-500/50 backdrop-blur-sm text-white rounded-lg transition-all hover:scale-105"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Info - Always at the same position */}
      <div className="p-3 bg-[#1a1a1a]">
        <h4 className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
          {design.name}
        </h4>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-gray-500 text-xs">{formatDate(design.createdAt)}</span>
          <span className="text-gray-500 text-xs">{design.size}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
          <Layers size={10} />
          <span>{design.elements?.length || 0} layers</span>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
