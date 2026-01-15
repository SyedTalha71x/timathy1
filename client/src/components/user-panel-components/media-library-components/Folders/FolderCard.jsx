import React, { useState } from 'react';
import { 
  Folder as FolderIcon, 
  FolderInput,
  Edit, 
  Trash2, 
  Check
} from 'lucide-react';

const FolderCard = ({ 
  folder, 
  isSelected, 
  designCount,
  onSelect, 
  onEdit, 
  onDelete,
  onDrop,
  isDragging
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're dragging a design (not a folder)
    const hasDesignData = e.dataTransfer.types.includes('application/json');
    if (hasDesignData) {
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const hasDesignData = e.dataTransfer.types.includes('application/json');
    if (hasDesignData) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set to false if we're actually leaving the element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const designData = e.dataTransfer.getData('application/json');
      if (designData) {
        onDrop?.(e, folder.id);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  return (
    <div
      className={`
        group relative p-3.5 rounded-xl cursor-pointer transition-all duration-200 border-2
        ${isDragOver 
          ? 'bg-orange-500/20 border-orange-500 scale-[1.02] shadow-lg shadow-orange-500/20' 
          : isSelected 
            ? 'bg-orange-500/10 border-orange-500' 
            : 'bg-[#141414] border-transparent hover:border-[#444444]'
        }
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      onClick={() => onSelect(folder.id)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator overlay */}
      {isDragOver && (
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-orange-500 bg-orange-500/10 flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 text-orange-500 font-medium text-sm">
            <FolderInput size={18} />
            <span>Drop here</span>
          </div>
        </div>
      )}

      {/* Folder Content */}
      <div className={`flex items-start gap-3 ${isDragOver ? 'opacity-30' : ''}`}>
        {/* Folder Icon */}
        <div 
          className="p-2.5 rounded-xl transition-colors flex-shrink-0"
          style={{ 
            backgroundColor: `${folder.color}15`,
            boxShadow: isSelected ? `0 0 16px ${folder.color}15` : 'none'
          }}
        >
          <FolderIcon 
            size={20} 
            style={{ color: folder.color }}
            className="transition-transform group-hover:scale-105"
          />
        </div>

        {/* Folder Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium text-sm truncate">{folder.name}</h4>
            {folder.isDefault && (
              <span className="flex items-center gap-0.5 text-[9px] bg-[#2F2F2F] text-gray-400 px-1.5 py-0.5 rounded">
                <Check size={8} />
                Default
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-0.5">
            {designCount} {designCount === 1 ? 'design' : 'designs'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}
            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
            title="Edit folder"
          >
            <Edit size={13} />
          </button>
          {!folder.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder);
              }}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete folder"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
