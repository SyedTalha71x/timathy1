/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const SimpleTitleEditModal = ({ 
    isOpen, 
    onClose, 
    task, 
    onSave 
  }) => {
    const [editedTitle, setEditedTitle] = useState("");
    const textareaRef = useRef(null);
  
    useEffect(() => {
      if (task) {
        setEditedTitle(task.title || "");
      }
    }, [task]);
  
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Esca pe') {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus the textarea when modal opens
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(
              textareaRef.current.value.length, 
              textareaRef.current.value.length
            );
          }
        }, 100);
      } else {
        document.body.style.overflow = 'unset';
      }
  
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);
  
    const handleSave = () => {
      if (editedTitle.trim() && task) {
        onSave({
          ...task,
          title: editedTitle.trim()
        });
      }
      onClose();
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };
  
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    if (!isOpen || !task) return null;
  
    return (
      <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-[#1a1a1a] rounded-2xl w-full max-w-md mx-auto border border-gray-700 shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Edit Task Title</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Task Title
            </label>
            <textarea
              ref={textareaRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#2d2d2d] text-white px-4 py-3 rounded-xl outline-none resize-none min-h-[120px] border border-gray-600 focus:border-[#FF843E] transition-colors placeholder-gray-500 text-sm"
              placeholder="Enter task title..."
            />
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#2d2d2d] text-gray-300 rounded-xl hover:bg-[#3d3d3d] transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editedTitle.trim()}
              className="px-6 py-2.5 bg-[#FF843E] text-white rounded-xl hover:bg-[#FF943E] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF843E]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };