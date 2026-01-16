import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Lock, Unlock, Palette, Type, Maximize2, Image as ImageIcon, Move,
  PenTool, ChevronRight, ChevronDown, Frame, Droplet, Minus, Sun, Crop
} from 'lucide-react';
import { fontFamilies } from '../constants/platformSizes';

const PropertiesPanel = ({
  element,
  onUpdate,
  isLocked,
  onToggleLock,
  onStartCrop
}) => {
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    formatting: true,
    font: true,
    color: true,
    effects: false,
    position: false,
    gradient: true,
    line: true,
    image: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getActiveElementIcon = () => {
    if (element?.isBackground) return <Frame size={14} className="text-amber-400" />;
    switch (element?.type) {
      case 'text': return <Type size={14} className="text-blue-400" />;
      case 'shape': return <Palette size={14} className="text-green-400" />;
      case 'image': return <ImageIcon size={14} className="text-purple-400" />;
      case 'line': return <Minus size={14} className="text-cyan-400" />;
      case 'gradient': return <Droplet size={14} className="text-pink-400" />;
      case 'divider': return <Minus size={14} className="text-yellow-400" />;
      default: return <Maximize2 size={14} className="text-gray-400" />;
    }
  };

  const getActiveElementColor = () => {
    if (element?.isBackground) return 'bg-amber-500/10';
    switch (element?.type) {
      case 'text': return 'bg-blue-500/10';
      case 'shape': return 'bg-green-500/10';
      case 'image': return 'bg-purple-500/10';
      case 'line': return 'bg-cyan-500/10';
      case 'gradient': return 'bg-pink-500/10';
      case 'divider': return 'bg-yellow-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#141414] overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!element ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-3">
              <Maximize2 size={20} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No element selected</p>
            <p className="text-gray-600 text-xs mt-1">Click on any element</p>
          </div>
        ) : (
          <>
            {/* Element Header */}
            <div className="p-3 border-b border-[#333]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActiveElementColor()}`}>
                    {getActiveElementIcon()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm capitalize truncate">
                      {element.isBackground ? 'Background' : element.type}
                    </p>
                    {element.shape && !element.isBackground && (
                      <p className="text-gray-500 text-[10px] capitalize truncate">{element.shape}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onToggleLock}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                    isLocked ? 'bg-orange-500/10 text-[#FF843E]' : 'text-gray-400 hover:bg-[#2F2F2F]'
                  }`}
                >
                  {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            </div>

            {/* TEXT PROPERTIES */}
            {element.type === 'text' && (
              <>
                <CollapsibleSection title="Content" icon={Type} isExpanded={expandedSections.content} onToggle={() => toggleSection('content')}>
                  <textarea
                    value={element.content || ''}
                    onChange={(e) => onUpdate({ content: e.target.value })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg py-2 px-2 text-white text-sm resize-none focus:outline-none focus:border-orange-500 disabled:opacity-50"
                    rows={3}
                  />
                </CollapsibleSection>

                <CollapsibleSection title="Formatting" icon={PenTool} isExpanded={expandedSections.formatting} onToggle={() => toggleSection('formatting')}>
                  <div className="flex flex-wrap gap-1">
                    <FormatButton icon={Bold} isActive={element.bold} onClick={() => onUpdate({ bold: !element.bold })} disabled={isLocked} />
                    <FormatButton icon={Italic} isActive={element.italic} onClick={() => onUpdate({ italic: !element.italic })} disabled={isLocked} />
                    <FormatButton icon={Underline} isActive={element.underline} onClick={() => onUpdate({ underline: !element.underline })} disabled={isLocked} />
                    <div className="w-px h-6 bg-[#333] mx-0.5" />
                    <FormatButton icon={AlignLeft} isActive={element.align === 'left'} onClick={() => onUpdate({ align: 'left' })} disabled={isLocked} />
                    <FormatButton icon={AlignCenter} isActive={element.align === 'center'} onClick={() => onUpdate({ align: 'center' })} disabled={isLocked} />
                    <FormatButton icon={AlignRight} isActive={element.align === 'right'} onClick={() => onUpdate({ align: 'right' })} disabled={isLocked} />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Font & Size" icon={Type} isExpanded={expandedSections.font} onToggle={() => toggleSection('font')}>
                  <div className="space-y-2">
                    <select
                      value={element.font || 'Inter, sans-serif'}
                      onChange={(e) => onUpdate({ font: e.target.value })}
                      disabled={isLocked}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg py-1.5 px-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    >
                      {(fontFamilies || []).map(font => (
                        <option key={font.id} value={font.family}>{font.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min="8" max="200" value={element.size || 24}
                        onChange={(e) => onUpdate({ size: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-white text-xs w-12 text-right flex-shrink-0">{element.size || 24}px</span>
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            )}

            {/* LINE PROPERTIES */}
            {element.type === 'line' && (
              <CollapsibleSection title="Line" icon={Minus} isExpanded={expandedSections.line} onToggle={() => toggleSection('line')}>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1.5 block uppercase">Style</label>
                    <div className="grid grid-cols-3 gap-1">
                      {['solid', 'dashed', 'dotted'].map(style => (
                        <button key={style} onClick={() => onUpdate({ lineStyle: style })} disabled={isLocked}
                          className={`p-1.5 rounded text-[10px] capitalize ${element.lineStyle === style ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-[#0a0a0a] text-gray-400 hover:bg-[#1a1a1a]'}`}
                        >{style}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Thickness</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="1" max="20" value={element.strokeWidth || 2}
                        onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-white text-xs w-10 text-right flex-shrink-0">{element.strokeWidth || 2}px</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1.5 block uppercase">Arrows</label>
                    <div className="flex gap-2">
                      <button onClick={() => onUpdate({ arrowStart: !element.arrowStart })} disabled={isLocked}
                        className={`flex-1 p-1.5 rounded text-[10px] ${element.arrowStart ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-[#0a0a0a] text-gray-400'}`}
                      >← Start</button>
                      <button onClick={() => onUpdate({ arrowEnd: !element.arrowEnd })} disabled={isLocked}
                        className={`flex-1 p-1.5 rounded text-[10px] ${element.arrowEnd ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-[#0a0a0a] text-gray-400'}`}
                      >End →</button>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* GRADIENT PROPERTIES */}
            {element.type === 'gradient' && (
              <CollapsibleSection title="Gradient" icon={Droplet} isExpanded={expandedSections.gradient} onToggle={() => toggleSection('gradient')}>
                <div className="space-y-3">
                  {/* Start Color */}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Start Color</label>
                    <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg p-1.5">
                      <input
                        type="color"
                        value={element.gradientColors?.[0] || '#FF6B6B'}
                        onChange={(e) => onUpdate({ gradientColors: [e.target.value, element.gradientColors?.[1] || '#FFA500'] })}
                        disabled={isLocked}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={element.gradientColors?.[0] || '#FF6B6B'}
                        onChange={(e) => onUpdate({ gradientColors: [e.target.value, element.gradientColors?.[1] || '#FFA500'] })}
                        disabled={isLocked}
                        className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                        maxLength={7}
                      />
                    </div>
                  </div>
                  
                  {/* End Color */}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">End Color</label>
                    <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg p-1.5">
                      <input
                        type="color"
                        value={element.gradientColors?.[1] || '#FFA500'}
                        onChange={(e) => onUpdate({ gradientColors: [element.gradientColors?.[0] || '#FF6B6B', e.target.value] })}
                        disabled={isLocked}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={element.gradientColors?.[1] || '#FFA500'}
                        onChange={(e) => onUpdate({ gradientColors: [element.gradientColors?.[0] || '#FF6B6B', e.target.value] })}
                        disabled={isLocked}
                        className="flex-1 min-w-0 bg-transparent text-white text-xs font-mono uppercase focus:outline-none"
                        maxLength={7}
                      />
                    </div>
                  </div>
                  
                  {/* Angle */}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Angle</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="360" value={element.gradientAngle || 135}
                        onChange={(e) => onUpdate({ gradientAngle: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-white text-xs w-10 text-right flex-shrink-0">{element.gradientAngle || 135}°</span>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Preview</label>
                    <div className="h-6 rounded-lg border border-[#333]"
                      style={{ background: `linear-gradient(${element.gradientAngle || 135}deg, ${element.gradientColors?.[0] || '#FF6B6B'}, ${element.gradientColors?.[1] || '#FFA500'})` }}
                    />
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* DIVIDER PROPERTIES */}
            {element.type === 'divider' && (
              <CollapsibleSection title="Divider" icon={Minus} isExpanded={expandedSections.line} onToggle={() => toggleSection('line')}>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1.5 block uppercase">Style</label>
                    <div className="grid grid-cols-2 gap-1">
                      {['solid', 'dashed', 'dotted', 'double'].map(style => (
                        <button key={style} onClick={() => onUpdate({ dividerStyle: style })} disabled={isLocked}
                          className={`p-1.5 rounded text-[10px] capitalize ${element.dividerStyle === style ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-[#0a0a0a] text-gray-400 hover:bg-[#1a1a1a]'}`}
                        >{style}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Thickness</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="1" max="10" value={element.strokeWidth || 2}
                        onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-white text-xs w-10 text-right flex-shrink-0">{element.strokeWidth || 2}px</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* COLOR SECTION */}
            {(element.type === 'text' || element.type === 'shape' || element.type === 'line' || element.type === 'divider') && (
              <CollapsibleSection title="Color" icon={Palette} isExpanded={expandedSections.color} onToggle={() => toggleSection('color')}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg p-1.5">
                    <input
                      type="color" value={element.color || '#ffffff'}
                      onChange={(e) => onUpdate({ color: e.target.value })}
                      disabled={isLocked}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                    />
                    <input
                      type="text" value={element.color || '#ffffff'}
                      onChange={(e) => onUpdate({ color: e.target.value })}
                      disabled={isLocked}
                      className="flex-1 min-w-0 bg-transparent text-white text-xs uppercase font-mono focus:outline-none"
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase mb-1">Quick Colors</p>
                    <div className="flex flex-wrap gap-1">
                      {['#FFFFFF', '#000000', '#F97316', '#2563EB', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B'].map(color => (
                        <button key={color} onClick={() => onUpdate({ color })} disabled={isLocked}
                          className="w-5 h-5 rounded border border-[#333] hover:scale-110 transition-transform disabled:opacity-50"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* IMAGE PROPERTIES */}
            {element.type === 'image' && (
              <CollapsibleSection title="Image" icon={ImageIcon} isExpanded={expandedSections.image} onToggle={() => toggleSection('image')}>
                <div className="space-y-3">
                  {onStartCrop && (
                    <button onClick={() => onStartCrop(element.id)} disabled={isLocked}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white text-sm rounded-lg border border-[#333] disabled:opacity-50"
                    >
                      <Crop size={14} /> Crop Image
                    </button>
                  )}
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Blur</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="20" value={element.blur || 0}
                        onChange={(e) => onUpdate({ blur: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-white text-xs w-10 text-right flex-shrink-0">{element.blur || 0}px</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block uppercase">Brightness</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="50" max="150" value={element.brightness || 100}
                        onChange={(e) => onUpdate({ brightness: parseInt(e.target.value) })}
                        disabled={isLocked}
                        className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="text-white text-xs w-10 text-right flex-shrink-0">{element.brightness || 100}%</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* EFFECTS SECTION */}
            <CollapsibleSection title="Effects" icon={Sun} isExpanded={expandedSections.effects} onToggle={() => toggleSection('effects')}>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block uppercase">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" value={(element.opacity ?? 1) * 100}
                      onChange={(e) => onUpdate({ opacity: parseInt(e.target.value) / 100 })}
                      disabled={isLocked}
                      className="flex-1 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer accent-orange-500"
                    />
                    <span className="text-white text-xs w-10 text-right flex-shrink-0">{Math.round((element.opacity ?? 1) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block uppercase">Shadow</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="text-[9px] text-gray-600 block mb-0.5">X</label>
                        <input type="number" value={element.shadowX || 0}
                          onChange={(e) => onUpdate({ shadowX: parseInt(e.target.value) || 0 })}
                          disabled={isLocked}
                          className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-600 block mb-0.5">Y</label>
                        <input type="number" value={element.shadowY || 0}
                          onChange={(e) => onUpdate({ shadowY: parseInt(e.target.value) || 0 })}
                          disabled={isLocked}
                          className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-600 block mb-0.5">Blur</label>
                        <input type="number" min="0" value={element.shadowBlur || 0}
                          onChange={(e) => onUpdate({ shadowBlur: parseInt(e.target.value) || 0 })}
                          disabled={isLocked}
                          className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#0a0a0a] rounded p-1.5">
                      <input type="color" value={element.shadowColor || '#000000'}
                        onChange={(e) => onUpdate({ shadowColor: e.target.value })}
                        disabled={isLocked}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                      />
                      <span className="text-gray-400 text-[10px]">Shadow Color</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* POSITION SECTION */}
            <CollapsibleSection title="Position & Size" icon={Move} isExpanded={expandedSections.position} onToggle={() => toggleSection('position')}>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">X</label>
                  <input type="number" value={Math.round(element.x || 0)}
                    onChange={(e) => onUpdate({ x: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">Y</label>
                  <input type="number" value={Math.round(element.y || 0)}
                    onChange={(e) => onUpdate({ y: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">Width</label>
                  <input type="number" value={Math.round(element.width || 0)}
                    onChange={(e) => onUpdate({ width: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">Height</label>
                  <input type="number" value={Math.round(element.height || 0)}
                    onChange={(e) => onUpdate({ height: parseFloat(e.target.value) })}
                    disabled={isLocked}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded py-1 px-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
};

const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
  <div className="border-b border-[#333]">
    <button onClick={onToggle} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1a1a1a] transition-colors">
      {isExpanded ? <ChevronDown size={12} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />}
      <Icon size={12} className="text-gray-400 flex-shrink-0" />
      <span className="text-gray-300 text-xs font-medium uppercase tracking-wider flex-1 text-left truncate">{title}</span>
    </button>
    {isExpanded && <div className="px-3 pb-3">{children}</div>}
  </div>
);

const FormatButton = ({ icon: Icon, isActive, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className={`p-1.5 rounded transition-colors ${isActive ? 'bg-orange-500/10 text-[#FF843E]' : 'text-gray-400 hover:bg-[#2F2F2F]'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Icon size={14} />
  </button>
);

export default PropertiesPanel;
