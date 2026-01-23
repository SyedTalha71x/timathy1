import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit2, 
  Trash2, 
  Copy, 
  Download,
  Layers,
  GripVertical,
  Eye,
  MoreVertical
} from 'lucide-react';

const DesignCard = ({ 
  design, 
  onEdit, 
  onDownload, 
  onDelete, 
  onDuplicate,
  onPreview,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const [isDragHandleHeld, setIsDragHandleHeld] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cardRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMobileMenu]);

  const handleDragStart = (e) => {
    // Only allow drag if drag handle is being held
    if (!isDragHandleHeld) {
      e.preventDefault();
      return;
    }
    
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

  const handleDragHandleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragHandleHeld(true);
  };

  const handleDragHandleMouseUp = () => {
    setIsDragHandleHeld(false);
  };

  const handleDragEnd = () => {
    setIsDragHandleHeld(false);
    onDragEnd?.();
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
      ref={cardRef}
      className={`
        group relative bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-200 border border-[#333333]
        hover:border-[#444444] hover:shadow-lg select-none
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isDragHandleHeld ? 'cursor-grabbing' : ''}
      `}
      onMouseLeave={() => {
        setIsDragHandleHeld(false);
      }}
      draggable={isDragHandleHeld}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Drag Handle - Top Left - Desktop only */}
      <div 
        className="hidden sm:block absolute top-2 left-2 cursor-grab active:cursor-grabbing text-white/70 hover:text-white p-1.5 rounded-lg bg-black/50 hover:bg-black/70 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to move to folder"
        onMouseDown={handleDragHandleMouseDown}
        onMouseUp={handleDragHandleMouseUp}
        onMouseLeave={handleDragHandleMouseUp}
      >
        <GripVertical size={14} />
      </div>

      {/* Preview Button - Desktop only (hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPreview?.(design);
        }}
        className="hidden sm:block absolute top-2 right-2 cursor-pointer text-white/70 hover:text-white p-1.5 rounded-lg bg-black/50 hover:bg-black/70 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Preview"
      >
        <Eye size={14} />
      </button>

      {/* Mobile Menu Button - Mobile only */}
      <div className="sm:hidden absolute top-2 right-2 z-20" ref={mobileMenuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMobileMenu(!showMobileMenu);
          }}
          className="text-white/70 hover:text-white p-1.5 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
        >
          <MoreVertical size={16} />
        </button>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="absolute top-full right-0 mt-1 w-40 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.(design);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#3a3a3a] transition-colors text-sm"
            >
              <Eye size={16} className="text-gray-400" />
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(design);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#3a3a3a] transition-colors text-sm"
            >
              <Download size={16} className="text-gray-400" />
              Download
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.(design);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#3a3a3a] transition-colors text-sm"
            >
              <Copy size={16} className="text-gray-400" />
              Duplicate
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(design);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Fixed-size Preview Container - Solid gray background like drafts */}
      <div 
        className="relative w-full h-[180px] bg-[#2a2a2a] flex items-center justify-center overflow-hidden"
        onDragStart={(e) => e.preventDefault()}
      >
        {design.thumbnail && design.thumbnail !== 'data:,' ? (
          <img 
            src={design.thumbnail}
            alt={design.name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 pointer-events-none">
            <Layers size={32} className="mb-2 opacity-50" />
            <span className="text-xs">No preview</span>
          </div>
        )}

        {/* Hover Overlay - Desktop only */}
        <div className="hidden sm:flex absolute inset-0 bg-black/60 backdrop-blur-sm flex-col items-center justify-center gap-2 transition-all duration-200 opacity-0 group-hover:opacity-100">
          {/* Quick Actions */}
          {/* Edit Button - Desktop only */}
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
      <div className="p-3 bg-[#1a1a1a]" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
        <h4 className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors pointer-events-none">
          {design.name}
        </h4>
        <div className="flex items-center justify-between mt-1.5 pointer-events-none">
          <span className="text-gray-500 text-xs">{formatDate(design.createdAt)}</span>
          <span className="text-gray-500 text-xs">{design.size}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 pointer-events-none">
          <Layers size={10} />
          <span>{design.elements?.length || 0} layers</span>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
