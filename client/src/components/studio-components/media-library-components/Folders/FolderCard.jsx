import React from 'react';
import { useDroppable } from '@dnd-kit/core';
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
}) => {
  // @dnd-kit droppable setup
  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      type: 'folder',
      folderId: folder.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        group relative p-3.5 rounded-xl cursor-pointer transition-all duration-200 border-2
        ${isOver 
          ? 'bg-primary/20 border-primary scale-[1.02] shadow-lg shadow-primary/20' 
          : isSelected 
            ? 'bg-primary/10 border-primary' 
            : 'bg-surface-dark border-transparent hover:border-border'
        }
      `}
      onClick={() => onSelect(folder.id)}
    >
      {/* Drop indicator overlay */}
      {isOver && (
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-primary bg-primary/10 flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <FolderInput size={18} />
            <span>Drop here</span>
          </div>
        </div>
      )}

      {/* Folder Content */}
      <div className={`flex items-start gap-3 ${isOver ? 'opacity-30' : ''}`}>
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
            <h4 className="text-content-primary font-medium text-sm truncate">{folder.name}</h4>
            {folder.isDefault && (
              <span className="flex items-center gap-0.5 text-[9px] bg-surface-button text-content-muted px-1.5 py-0.5 rounded">
                <Check size={8} />
                Default
              </span>
            )}
          </div>
          <p className="text-content-faint text-xs mt-0.5">
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
            className="p-1.5 text-content-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
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
              className="p-1.5 text-content-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
