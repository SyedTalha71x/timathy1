import React, { useState, useEffect } from 'react';
import { Sparkles, Folder as FolderIcon, ChevronDown } from 'lucide-react';
import Modal from './Modal';

const CreateDesignModal = ({ 
  isOpen, 
  onClose, 
  onCreateDesign,
  folders = [],
  defaultFolderId = null
}) => {
  const [designName, setDesignName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(defaultFolderId);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  // Reset and set default folder when modal opens
  useEffect(() => {
    if (isOpen) {
      setDesignName('');
      // Set default folder - find the default one or use the first folder
      const defaultFolder = folders.find(f => f.isDefault) || folders[0];
      setSelectedFolderId(defaultFolderId || defaultFolder?.id || null);
      setShowFolderDropdown(false);
    }
  }, [isOpen, folders, defaultFolderId]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalName = designName.trim() || 'Untitled Design';
    onCreateDesign(finalName, selectedFolderId);
    setDesignName(''); // Reset for next time
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Design"
      subtitle="Give your design a name and choose a folder"
      size="sm"
    >
      <div className="space-y-5">
        {/* Design Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Design Name
          </label>
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="Untitled Design"
            autoFocus
          />
        </div>

        {/* Folder Selection */}
        {folders.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Save to Folder
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                className="w-full flex items-center gap-3 bg-[#0a0a0a] border border-[#333333] rounded-xl py-3 px-4 text-white hover:border-[#444444] focus:outline-none focus:border-orange-500 transition-colors"
              >
                {selectedFolder ? (
                  <>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${selectedFolder.color}20` }}
                    >
                      <FolderIcon size={16} style={{ color: selectedFolder.color }} />
                    </div>
                    <span className="flex-1 text-left">{selectedFolder.name}</span>
                    {selectedFolder.isDefault && (
                      <span className="text-[10px] bg-[#2F2F2F] text-gray-400 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">Select a folder</span>
                )}
                <ChevronDown 
                  size={18} 
                  className={`text-gray-400 transition-transform ${showFolderDropdown ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown */}
              {showFolderDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowFolderDropdown(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1C] border border-[#333333] rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => {
                          setSelectedFolderId(folder.id);
                          setShowFolderDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2F2F2F] transition-colors ${
                          selectedFolderId === folder.id ? 'bg-orange-500/10' : ''
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${folder.color}20` }}
                        >
                          <FolderIcon size={16} style={{ color: folder.color }} />
                        </div>
                        <span className={`flex-1 text-left text-sm ${
                          selectedFolderId === folder.id ? 'text-orange-500' : 'text-white'
                        }`}>
                          {folder.name}
                        </span>
                        {folder.isDefault && (
                          <span className="text-[10px] bg-[#0a0a0a] text-gray-500 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
        >
          <Sparkles size={18} />
          Choose Template
        </button>
        
        <p className="text-center text-gray-500 text-xs">
          You'll be able to choose a template or start with a blank canvas
        </p>
      </div>
    </Modal>
  );
};

export default CreateDesignModal;
