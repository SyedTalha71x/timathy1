import React, { useState, useEffect } from 'react';
import { Sparkles, Folder as FolderIcon, ChevronDown, Palette } from 'lucide-react';
import Modal from './Modal';
import ColorPickerModal from '../../../shared/ColorPickerModal';

// Read the primary color from the global CSS variable --color-primary
const getPrimaryColor = () => {
  if (typeof document === 'undefined') return '#f97316'
  const value = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
  return value || '#f97316';
};

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
  const [secondaryColor, setSecondaryColor] = useState(getPrimaryColor());
  const [textColor, setTextColor] = useState('#FFFFFF');

  // ColorPicker modal state
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [editingColorField, setEditingColorField] = useState(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setDesignName('');
      const defaultFolder = folders.find(f => f.isDefault) || folders[0];
      setSelectedFolderId(defaultFolderId || defaultFolder?.id || null);
      setShowFolderDropdown(false);
      setPrimaryColor('#1A1A2E');
      setSecondaryColor(getPrimaryColor());
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

  const openColorPicker = (field) => {
    setEditingColorField(field);
    setColorPickerOpen(true);
  };

  const handleColorSelect = (color) => {
    if (editingColorField === 'background') setPrimaryColor(color);
    else if (editingColorField === 'accent') setSecondaryColor(color);
    else if (editingColorField === 'text') setTextColor(color);
  };

  const getCurrentColor = () => {
    if (editingColorField === 'background') return primaryColor;
    if (editingColorField === 'accent') return secondaryColor;
    if (editingColorField === 'text') return textColor;
    return '#FFFFFF';
  };

  const getPickerTitle = () => {
    if (editingColorField === 'background') return 'Background Color';
    if (editingColorField === 'accent') return 'Accent Color';
    if (editingColorField === 'text') return 'Text Color';
    return 'Choose Color';
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  const colorFields = [
    { key: 'background', label: 'Background', value: primaryColor },
    { key: 'accent', label: 'Accent', value: secondaryColor },
    { key: 'text', label: 'Text', value: textColor },
  ];

  return (
    <>
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
            <label className="block text-xs font-medium text-content-secondary mb-1">Design Name</label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-surface-dark border border-border rounded-lg py-2 px-3 text-content-primary text-sm placeholder-content-faint focus:outline-none focus:border-primary"
              placeholder="Untitled Design"
              autoFocus
            />
          </div>

          {/* Folder Selection */}
          {folders.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1">Save to Folder</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                  className="w-full flex items-center gap-2 bg-surface-dark border border-border rounded-lg py-2 px-3 text-content-primary hover:border-border focus:outline-none focus:border-primary"
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
                    <span className="text-content-faint text-sm">Select folder</span>
                  )}
                  <ChevronDown size={14} className={`text-content-muted flex-shrink-0 transition-transform ${showFolderDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showFolderDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFolderDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-card border border-border rounded-lg shadow-xl z-50 max-h-32 overflow-y-auto">
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => {
                            setSelectedFolderId(folder.id);
                            setShowFolderDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-button ${
                            selectedFolderId === folder.id ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${folder.color}20` }}
                          >
                            <FolderIcon size={12} style={{ color: folder.color }} />
                          </div>
                          <span className={`flex-1 text-left text-sm truncate ${selectedFolderId === folder.id ? 'text-primary' : 'text-content-primary'}`}>
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

          {/* Color Theme Section */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 p-2.5 border-b border-border bg-surface-hover/50">
              <Palette size={14} className="text-primary" />
              <span className="text-sm font-medium text-content-primary">Color Theme</span>
            </div>

            <div className="p-2.5 space-y-2">
              {colorFields.map((field) => (
                <button
                  key={field.key}
                  type="button"
                  onClick={() => openColorPicker(field.key)}
                  className="flex items-center gap-3 w-full p-2 bg-surface-dark rounded-lg hover:border-primary/50 border border-transparent transition-colors"
                >
                  <div 
                    className="w-7 h-7 rounded-lg flex-shrink-0 border border-border"
                    style={{ backgroundColor: field.value }}
                  />
                  <div className="flex-1 text-left">
                    <p className="text-[10px] text-content-muted uppercase">{field.label}</p>
                    <p className="text-xs text-content-primary font-mono uppercase">{field.value}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            <Sparkles size={16} />
            Choose Template
          </button>
        </div>
      </Modal>

      {/* Shared Color Picker Modal */}
      <ColorPickerModal
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        onSelectColor={handleColorSelect}
        currentColor={getCurrentColor()}
        title={getPickerTitle()}
      />
    </>
  );
};

export default CreateDesignModal;
