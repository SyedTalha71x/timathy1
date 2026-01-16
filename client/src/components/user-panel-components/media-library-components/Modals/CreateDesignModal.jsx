import React, { useState, useEffect } from 'react';
import { Sparkles, Folder as FolderIcon, ChevronDown, ChevronUp, Palette, Type } from 'lucide-react';
import Modal from './Modal';

// Color presets - Default: orange-500 primary, blue-600 secondary
const colorPresets = [
  { id: 'default', name: 'Default', primary: '#F97316', secondary: '#2563EB' },
  { id: 'sunset', name: 'Sunset', primary: '#FF6B6B', secondary: '#1A1A2E' },
  { id: 'ocean', name: 'Ocean', primary: '#00D9FF', secondary: '#0D0D0D' },
  { id: 'forest', name: 'Forest', primary: '#10B981', secondary: '#064E3B' },
  { id: 'royal', name: 'Royal', primary: '#8B5CF6', secondary: '#1E1B4B' },
  { id: 'energy', name: 'Energy', primary: '#F59E0B', secondary: '#292524' },
  { id: 'berry', name: 'Berry', primary: '#EC4899', secondary: '#1C1C1C' },
  { id: 'mono', name: 'Mono', primary: '#000000', secondary: '#FFFFFF' },
];

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
  
  // Personalization state
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#F97316');
  const [secondaryColor, setSecondaryColor] = useState('#2563EB');
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('default');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setDesignName('');
      const defaultFolder = folders.find(f => f.isDefault) || folders[0];
      setSelectedFolderId(defaultFolderId || defaultFolder?.id || null);
      setShowFolderDropdown(false);
      setShowPersonalization(false);
      setPrimaryColor('#F97316');
      setSecondaryColor('#2563EB');
      setTitleText('');
      setSubtitleText('');
      setSelectedPreset('default');
    }
  }, [isOpen, folders, defaultFolderId]);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalName = designName.trim() || 'Untitled Design';
    
    // Pass personalization data when section was expanded
    const personalization = showPersonalization ? {
      primaryColor,
      secondaryColor,
      titleText: titleText.trim(),
      subtitleText: subtitleText.trim()
    } : null;
    
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
      subtitle="Name your design and customize"
      size="sm"
    >
      {/* Scrollable content */}
      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden space-y-3 pr-1">
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

        {/* Personalization Section */}
        <div className="border border-[#333] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPersonalization(!showPersonalization)}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-orange-500" />
              <span className="text-sm font-medium text-white">Personalize Template</span>
            </div>
            {showPersonalization ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </button>

          {showPersonalization && (
            <div className="p-2.5 pt-0 space-y-2.5 border-t border-[#333]">
              {/* Color Presets */}
              <div className="pt-2">
                <label className="block text-[10px] text-gray-400 mb-1.5 uppercase">Quick Presets</label>
                <div className="grid grid-cols-4 gap-1">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-1 rounded border transition-all ${
                        selectedPreset === preset.id 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-transparent hover:border-[#444] bg-[#1a1a1a]'
                      }`}
                    >
                      <div className="flex h-4 rounded overflow-hidden">
                        <div className="flex-1" style={{ backgroundColor: preset.primary }} />
                        <div className="flex-1" style={{ backgroundColor: preset.secondary }} />
                      </div>
                      <span className="text-[8px] text-gray-400 mt-0.5 block truncate text-center">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors - Stacked vertically for responsive */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1 uppercase">Primary Color</label>
                  <div className="flex items-center gap-2 bg-[#0a0a0a] rounded p-1.5">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => { setPrimaryColor(e.target.value); setSelectedPreset(null); }}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => { setPrimaryColor(e.target.value); setSelectedPreset(null); }}
                      className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                      maxLength={7}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1 uppercase">Secondary Color</label>
                  <div className="flex items-center gap-2 bg-[#0a0a0a] rounded p-1.5">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => { setSecondaryColor(e.target.value); setSelectedPreset(null); }}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => { setSecondaryColor(e.target.value); setSelectedPreset(null); }}
                      className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-2 p-1.5 bg-[#0a0a0a] rounded">
                <span className="text-[9px] text-gray-500 flex-shrink-0">Preview:</span>
                <div 
                  className="flex-1 h-4 rounded"
                  style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
                />
              </div>

              {/* Text Inputs */}
              <div className="space-y-2">
                <div>
                  <label className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 uppercase">
                    <Type size={9} /> Title
                  </label>
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1.5 px-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500"
                    placeholder="Your headline..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 uppercase">
                    <Type size={9} /> Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitleText}
                    onChange={(e) => setSubtitleText(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1.5 px-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500"
                    placeholder="Your tagline..."
                  />
                </div>
              </div>

              <p className="text-[9px] text-gray-500 text-center">
                Colors & text will be applied to your template
              </p>
            </div>
          )}
        </div>
        
        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          <Sparkles size={16} />
          Choose Template
        </button>
        
        <p className="text-center text-gray-500 text-[10px]">
          You'll choose a template or start blank next
        </p>
      </div>
    </Modal>
  );
};

export default CreateDesignModal;
