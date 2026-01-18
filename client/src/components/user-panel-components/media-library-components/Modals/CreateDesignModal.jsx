import React, { useState, useEffect } from 'react';
import { Sparkles, Folder as FolderIcon, ChevronDown, Palette } from 'lucide-react';
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
  
  // Color state
  const [primaryColor, setPrimaryColor] = useState('#1A1A2E');
  const [secondaryColor, setSecondaryColor] = useState('#F97316');
  const [textColor, setTextColor] = useState('#FFFFFF');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setDesignName('');
      const defaultFolder = folders.find(f => f.isDefault) || folders[0];
      setSelectedFolderId(defaultFolderId || defaultFolder?.id || null);
      setShowFolderDropdown(false);
      setPrimaryColor('#1A1A2E');
      setSecondaryColor('#F97316');
      setTextColor('#FFFFFF');
    }
  }, [isOpen, folders, defaultFolderId]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalName = designName.trim() || 'Untitled Design';
    
    const personalization = {
      primaryColor,
      secondaryColor,
      textColor
    };
    
    onCreateDesign(finalName, selectedFolderId, personalization);
    setDesignName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Design"
      subtitle="Name your design and choose colors"
      size="sm"
    >
      <div className="space-y-3">
        {/* Design Name */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Design Name</label>
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500"
            placeholder="Untitled Design"
            autoFocus
          />
        </div>

        {/* Folder Selection */}
        {folders.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Save to Folder</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                className="w-full flex items-center gap-2 bg-[#0a0a0a] border border-[#333] rounded-lg py-2 px-3 text-white hover:border-[#444] focus:outline-none focus:border-orange-500"
              >
                {selectedFolder ? (
                  <>
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${selectedFolder.color}20` }}
                    >
                      <FolderIcon size={12} style={{ color: selectedFolder.color }} />
                    </div>
                    <span className="flex-1 text-left text-sm truncate">{selectedFolder.name}</span>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">Select folder</span>
                )}
                <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${showFolderDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFolderDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFolderDropdown(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1C] border border-[#333] rounded-lg shadow-xl z-50 max-h-32 overflow-y-auto">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => {
                          setSelectedFolderId(folder.id);
                          setShowFolderDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2F2F2F] ${
                          selectedFolderId === folder.id ? 'bg-orange-500/10' : ''
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${folder.color}20` }}
                        >
                          <FolderIcon size={12} style={{ color: folder.color }} />
                        </div>
                        <span className={`flex-1 text-left text-sm truncate ${selectedFolderId === folder.id ? 'text-orange-500' : 'text-white'}`}>
                          {folder.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Color Theme Section - Always visible */}
        <div className="border border-[#333] rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 p-2.5 border-b border-[#333] bg-[#1a1a1a]/50">
            <Palette size={14} className="text-orange-500" />
            <span className="text-sm font-medium text-white">Color Theme</span>
          </div>

          <div className="p-2.5 space-y-2">
            {/* Background Color */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1 uppercase">Background</label>
              <div className="flex items-center gap-2 bg-[#0a0a0a] rounded p-1.5">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1 uppercase">Accent</label>
              <div className="flex items-center gap-2 bg-[#0a0a0a] rounded p-1.5">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1 uppercase">Text</label>
              <div className="flex items-center gap-2 bg-[#0a0a0a] rounded p-1.5">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          <Sparkles size={16} />
          Choose Template
        </button>
      </div>
    </Modal>
  );
};

export default CreateDesignModal;
