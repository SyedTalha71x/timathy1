import React, { useState } from 'react';
import { 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Star,
  Heart,
  Hexagon,
  Diamond,
  Image as ImageIcon,
  MousePointer,
  ChevronRight,
  Keyboard,
  HelpCircle
} from 'lucide-react';

const shapes = [
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
  { id: 'hexagon', name: 'Hexagon', icon: Hexagon },
  { id: 'diamond', name: 'Diamond', icon: Diamond },
];

const EditorToolbar = ({
  selectedTool,
  onSelectTool,
  onAddText,
  onAddShape,
  onAddImage
}) => {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showShortcutsTooltip, setShowShortcutsTooltip] = useState(false);

  return (
    <div className="w-[220px] min-w-[220px] h-full bg-[#141414] border-r border-[#333333] flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Main Tools */}
      <div className="p-3 border-b border-[#333333]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-2">Tools</p>
        <div className="space-y-1">
          {/* Select Tool */}
          <ToolButton
            icon={MousePointer}
            label="Select"
            isActive={selectedTool === 'select'}
            onClick={() => onSelectTool('select')}
          />
        </div>
      </div>

      {/* Add Elements */}
      <div className="p-3 border-b border-[#333333]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-2">Add Elements</p>
        <div className="space-y-1">
          {/* Text Tool */}
          <ToolButton
            icon={Type}
            label="Text"
            isActive={selectedTool === 'text'}
            onClick={() => {
              onSelectTool('text');
              onAddText();
            }}
          />
          
          {/* Shape Tool */}
          <div className="relative">
            <ToolButton
              icon={Square}
              label="Shapes"
              isActive={selectedTool === 'shape'}
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              hasDropdown
            />
            
            {showShapeMenu && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowShapeMenu(false)}
                />
                <div className="fixed left-[230px] top-[150px] bg-[#1C1C1C] border border-[#333333] rounded-xl p-3 shadow-2xl z-50 min-w-[180px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">Select Shape</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {shapes.map(shape => {
                      const Icon = shape.icon;
                      return (
                        <button
                          key={shape.id}
                          onClick={() => {
                            onAddShape(shape.id);
                            setShowShapeMenu(false);
                            onSelectTool('shape');
                          }}
                          className="p-2.5 rounded-lg hover:bg-[#2F2F2F] transition-colors group"
                          title={shape.name}
                        >
                          <Icon size={18} className="text-gray-400 group-hover:text-[#FF843E] transition-colors mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Image Tool */}
          <ToolButton
            icon={ImageIcon}
            label="Image"
            onClick={onAddImage}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Keyboard Shortcuts - Tooltip */}
      <div className="p-3 border-t border-[#333333]">
        <div className="relative">
          <button
            onMouseEnter={() => setShowShortcutsTooltip(true)}
            onMouseLeave={() => setShowShortcutsTooltip(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-[#2F2F2F] rounded-xl transition-colors"
          >
            <Keyboard size={16} />
            <span className="text-xs">Keyboard Shortcuts</span>
            <HelpCircle size={12} className="ml-auto" />
          </button>
          
          {/* Tooltip */}
          {showShortcutsTooltip && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1C1C1C] border border-[#333333] rounded-xl p-3 shadow-xl z-50">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-medium">Shortcuts</p>
              <div className="text-[11px] text-gray-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Delete element</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Del</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Undo</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+Z</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Redo</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+Shift+Z</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duplicate</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+D</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Save</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zoom</span>
                  <kbd className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-gray-400 text-[10px]">Ctrl+Scroll</kbd>
                </div>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1C1C] border-r border-b border-[#333333] transform rotate-45" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tool Button Component
const ToolButton = ({ icon: Icon, label, isActive, onClick, hasDropdown }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
        ${isActive 
          ? 'bg-orange-500/10 text-[#FF843E] border border-orange-500/30' 
          : 'text-gray-400 hover:bg-[#2F2F2F] hover:text-white border border-transparent'}
      `}
    >
      <Icon size={18} />
      <span className="text-sm flex-1 text-left">{label}</span>
      {hasDropdown && (
        <ChevronRight size={14} className="text-gray-600" />
      )}
    </button>
  );
};

export default EditorToolbar;
