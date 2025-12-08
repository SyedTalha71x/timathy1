/* eslint-disable react/prop-types */
import { memo, useCallback, useState, useMemo } from 'react';

const OptimizedCreateBulletinModal = memo(function OptimizedCreateBulletinModal({
  isOpen,
  onClose,
  onCreate,
  availableTags,
  onOpenTagManager,
}) {
  // Local state for form data to prevent parent re-renders
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "Members",
    status: "Active",
    image: null,
    tags: [],
  });

  // Reset form when modal closes/opens
  useState(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        content: "",
        visibility: "Members",
        status: "Active",
        image: null,
        tags: [],
      });
    }
  }, [isOpen]);

  // Optimized handlers with useCallback
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleTagToggle = useCallback((tagId) => {
    setFormData(prev => {
      const selectedTags = prev.tags || [];
      if (selectedTags.includes(tagId)) {
        return {
          ...prev,
          tags: selectedTags.filter((id) => id !== tagId),
        };
      } else {
        return {
          ...prev,
          tags: [...selectedTags, tagId],
        };
      }
    });
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setFormData(prev => ({ ...prev, image: null }));
  }, []);

  const handleCreate = useCallback(() => {
    if (formData.title.trim() && formData.content.trim()) {
      onCreate(formData);
      onClose();
    }
  }, [formData, onCreate, onClose]);

  // Memoized tags display
  const tagsDisplay = useMemo(() => {
    if (!availableTags || availableTags.length === 0) {
      return <p className="text-gray-400 text-xs">No tags available. Create one using Manage Tags.</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              (formData.tags || []).includes(tag.id)
                ? "opacity-100 border-2"
                : "opacity-50 border border-gray-600"
            }`}
            style={{
              backgroundColor: tag.color,
              borderColor: tag.color,
              color: "white",
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    );
  }, [availableTags, formData.tags, handleTagToggle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close create post modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleInputChange('title')}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              placeholder="Enter post title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={handleInputChange('content')}
              rows={6}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              />
              {formData.image && (
                <button
                  onClick={handleRemoveImage}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                  title="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {formData.image && (
              <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-gray-700">
                <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Tags</label>
              <button
                onClick={onOpenTagManager}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Manage Tags
              </button>
            </div>
            <div className="bg-[#181818] border border-slate-300/10 rounded-xl p-3 max-h-32 overflow-y-auto">
              {tagsDisplay}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={handleInputChange('visibility')}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="Members">Members</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={handleInputChange('status')}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OptimizedCreateBulletinModal;