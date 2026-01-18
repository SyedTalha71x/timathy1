import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Grid3X3, 
  Instagram, 
  Megaphone, 
  Dumbbell, 
  Calendar, 
  Quote, 
  Bell, 
  Minus,
  Plus,
  Sparkles,
  Image as ImageIcon,
  X,
  Settings,
  ChevronDown,
  ChevronRight,
  Bookmark,
  AlertTriangle,
  Lock,
  Zap,
  Clock
} from 'lucide-react';
import { templates, templateCategories } from '../constants/templates';
import { applyPersonalization, deepClone } from '../utils/canvasUtils';

const iconMap = {
  Grid3X3,
  Instagram,
  Megaphone,
  Dumbbell,
  Calendar,
  Quote,
  Bell,
  Minus,
  Bookmark,
  AlertTriangle,
  Lock,
  Zap,
  Clock
};

// Extended blank templates with standard social media sizes
const blankTemplates = [
  // Instagram
  { id: "ig-feed-square", name: "Instagram Feed", size: "1080x1080", category: "Instagram" },
  { id: "ig-feed-portrait", name: "Instagram Portrait", size: "1080x1350", category: "Instagram" },
  { id: "ig-story", name: "Instagram Story", size: "1080x1920", category: "Instagram" },
  { id: "ig-landscape", name: "Instagram Landscape", size: "1080x566", category: "Instagram" },
  // Facebook
  { id: "fb-feed-square", name: "Facebook Feed", size: "1200x1200", category: "Facebook" },
  { id: "fb-feed-portrait", name: "Facebook Portrait", size: "1200x1500", category: "Facebook" },
  { id: "fb-story", name: "Facebook Story", size: "1080x1920", category: "Facebook" },
  { id: "fb-cover", name: "Facebook Cover", size: "820x312", category: "Facebook" },
  { id: "fb-event", name: "Facebook Event", size: "1920x1080", category: "Facebook" },
];

const TemplateGallery = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate, 
  onSelectBlank,
  customTemplates = [],
  personalization = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState('1080');
  const [customHeight, setCustomHeight] = useState('1080');
  
  // Collapsed sections state - Instagram and Facebook collapsed by default
  const [collapsedSections, setCollapsedSections] = useState({
    Instagram: true,
    Facebook: true
  });

  // Toggle section collapse
  const toggleSection = (category) => {
    setCollapsedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    // Combine built-in templates with custom templates
    const allTemplates = [...templates, ...customTemplates];
    
    return allTemplates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        template.category === selectedCategory ||
        (selectedCategory === 'custom' && template.isCustom);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, customTemplates]);

  // Group blank templates by category
  const groupedBlankTemplates = useMemo(() => {
    const groups = {};
    blankTemplates.forEach(template => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    return groups;
  }, []);

  // Handle custom size submit
  const handleCustomSizeSubmit = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (width >= 100 && width <= 5000 && height >= 100 && height <= 5000) {
      onSelectBlank(`${width}x${height}`);
      setShowCustomSize(false);
    } else {
      alert('Size must be between 100 and 5000 pixels');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#141414] border-r border-[#333333] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#333333]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-orange-500" size={20} />
              Templates
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#2F2F2F] rounded-xl transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 pl-9 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-2">Categories</p>
          <div className="space-y-1">
            {templateCategories.map(category => {
              const Icon = iconMap[category.icon] || Grid3X3;
              const isSelected = selectedCategory === category.id;
              let count;
              if (category.id === 'all') {
                count = templates.length + customTemplates.length;
              } else if (category.id === 'custom') {
                count = customTemplates.length;
              } else {
                count = templates.filter(t => t.category === category.id).length;
              }
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' 
                      : 'text-gray-400 hover:bg-[#2F2F2F] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left text-sm">{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-orange-500/20 text-orange-500' : 'bg-[#0a0a0a] text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="p-5 border-b border-[#333333] bg-[#141414]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-white font-medium">
                {selectedCategory === 'all' ? 'All Templates' : templateCategories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <p className="text-gray-500 text-sm">{filteredTemplates.length} templates available</p>
            </div>
            
            {/* Color Preview - Show selected colors */}
            {personalization && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] rounded-lg border border-[#333]">
                <span className="text-xs text-gray-500">Your colors:</span>
                <div className="flex h-5 w-12 rounded overflow-hidden border border-[#444]">
                  <div className="flex-1" style={{ backgroundColor: personalization.primaryColor }} />
                  <div className="flex-1" style={{ backgroundColor: personalization.secondaryColor }} />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Blank Templates Section */}
          <div className="mb-8">
            <h4 className="text-white text-base font-medium mb-4 flex items-center gap-2">
              <ImageIcon size={18} />
              Start from Scratch
            </h4>
            
            {/* Custom Size Card - Always first */}
            <div className="mb-5">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Custom</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                <button
                  onClick={() => setShowCustomSize(true)}
                  className="group relative bg-[#141414] border-2 border-dashed border-orange-500/30 hover:border-orange-500 rounded-xl overflow-hidden transition-all hover:bg-[#1a1a1a]"
                >
                  {/* Fixed height preview area */}
                  <div className="w-full h-[120px] bg-orange-500/5 flex flex-col items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                    <Settings size={24} className="text-orange-500 mb-2" />
                    <span className="text-orange-500 text-xs font-medium">Custom Size</span>
                  </div>
                  {/* Fixed info area */}
                  <div className="p-2.5 bg-[#141414]">
                    <p className="text-white text-sm font-medium truncate">Custom Dimensions</p>
                    <p className="text-orange-500 text-xs mt-0.5">Enter your own size</p>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Collapsible Category Sections */}
            {Object.entries(groupedBlankTemplates).map(([category, categoryTemplates]) => {
              const isCollapsed = collapsedSections[category];
              
              return (
                <div key={category} className="mb-5">
                  <button
                    onClick={() => toggleSection(category)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3 group"
                  >
                    {isCollapsed ? (
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                    )}
                    <span className="text-xs font-medium uppercase tracking-wider">{category}</span>
                    <span className="text-xs text-gray-600">({categoryTemplates.length})</span>
                  </button>
                  
                  {!isCollapsed && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {categoryTemplates.map(blank => (
                        <button
                          key={blank.id}
                          onClick={() => onSelectBlank(blank.size)}
                          className="group relative bg-[#141414] border-2 border-dashed border-[#333333] hover:border-orange-500/50 rounded-xl overflow-hidden transition-all hover:bg-[#1a1a1a]"
                        >
                          {/* Fixed height preview area */}
                          <div className="w-full h-[120px] bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Plus size={24} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                          </div>
                          {/* Fixed info area */}
                          <div className="p-2.5 bg-[#141414]">
                            <p className="text-gray-300 text-sm font-medium truncate group-hover:text-white transition-colors">
                              {blank.name}
                            </p>
                            <p className="text-gray-600 text-xs mt-0.5">{blank.size}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Divider */}
          <div className="border-t border-[#333333] my-6" />
          
          {/* Pre-designed Templates Section */}
          {filteredTemplates.length > 0 ? (
            <div>
              <h4 className="text-white text-base font-medium mb-4 flex items-center gap-2">
                <Sparkles size={18} />
                Pre-designed Templates
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredTemplates.map(template => {
                  const isHovered = hoveredTemplate === template.id;
                  
                  return (
                    <button
                      key={template.id}
                      onClick={() => onSelectTemplate(template)}
                      onMouseEnter={() => setHoveredTemplate(template.id)}
                      onMouseLeave={() => setHoveredTemplate(null)}
                      className="group relative rounded-xl overflow-hidden transition-all hover:ring-2 hover:ring-orange-500/50 hover:shadow-lg border border-[#333333] bg-[#141414]"
                    >
                      {/* Preview area with correct aspect ratio */}
                      <div className="w-full h-[160px] bg-[#0a0a0a] flex items-center justify-center p-3">
                        <TemplatePreview template={template} personalization={personalization} />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg">
                          Use Template
                        </span>
                      </div>
                      
                      {/* Fixed info area - consistent layout */}
                      <div className="p-2.5 bg-[#141414]">
                        <p className="text-white text-sm font-medium truncate">{template.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-gray-500 text-xs">{template.size}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#0a0a0a] text-gray-400 rounded capitalize">
                            {template.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-[#141414] rounded-xl flex items-center justify-center mb-3">
                <Search size={28} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-base">No templates found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your search or category</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Size Modal */}
      {showCustomSize && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-sm border border-[#333333]">
            <h3 className="text-white font-medium text-lg mb-4 flex items-center gap-2">
              <Settings size={20} className="text-orange-500" />
              Custom Size
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">Width (px)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    min="100"
                    max="5000"
                    placeholder="1080"
                  />
                </div>
                <div className="flex items-end pb-2.5 text-gray-500">
                  <X size={16} />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">Height (px)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    min="100"
                    max="5000"
                    placeholder="1080"
                  />
                </div>
              </div>
              
              {/* Quick presets */}
              <div>
                <p className="text-gray-500 text-xs mb-2">Quick Presets</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Square", w: "1080", h: "1080" },
                    { label: "Portrait", w: "1080", h: "1350" },
                    { label: "Story", w: "1080", h: "1920" },
                    { label: "Wide", w: "1920", h: "1080" },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setCustomWidth(preset.w);
                        setCustomHeight(preset.h);
                      }}
                      className="px-3 py-1.5 bg-[#0a0a0a] hover:bg-[#2F2F2F] text-gray-400 hover:text-white text-xs rounded-lg transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCustomSize(false)}
                  className="flex-1 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomSizeSubmit}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Template Preview Component - Render elements exactly like Canvas.jsx
const TemplatePreview = ({ template, personalization }) => {
  const [width, height] = template.size.split('x').map(Number);
  
  const maxWidth = 160;
  const maxHeight = 140;
  const aspectRatio = width / height;
  
  let previewWidth, previewHeight;
  if (aspectRatio > maxWidth / maxHeight) {
    previewWidth = maxWidth;
    previewHeight = maxWidth / aspectRatio;
  } else {
    previewHeight = maxHeight;
    previewWidth = maxHeight * aspectRatio;
  }
  
  // This is equivalent to displayScale in Canvas.jsx
  const displayScale = previewWidth / width;
  
  const elements = useMemo(() => {
    if (!template.elements) return [];
    const clonedElements = deepClone(template.elements);
    if (personalization) {
      return applyPersonalization(clonedElements, personalization)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    }
    return clonedElements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [template.elements, personalization]);
  
  // Find background element and get its color
  const backgroundColor = useMemo(() => {
    const bgElement = elements.find(el => el.isBackground);
    if (!bgElement) return '#1a1a1a';
    
    if (bgElement.type === 'gradient' && bgElement.gradientColors) {
      // Return first gradient color as fallback background
      return bgElement.gradientColors[0] || '#1a1a1a';
    }
    return bgElement.color || '#1a1a1a';
  }, [elements]);

  // Render shape - exactly like Canvas.jsx
  const renderShape = (element) => {
    const color = element.color || '#CCCCCC';
    const borderRadius = element.borderRadius ? element.borderRadius * displayScale : 0;
    
    const style = { 
      width: '100%', 
      height: '100%', 
      backgroundColor: color,
      borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined
    };

    switch (element.shape) {
      case 'rectangle':
        return <div style={style} />;
      case 'rounded-rectangle':
        return <div style={{ ...style, borderRadius: '12px' }} />;
      case 'circle':
        return <div style={{ ...style, borderRadius: '50%' }} />;
      case 'triangle':
        return (
          <div style={{
            ...style,
            backgroundColor: 'transparent',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            background: color
          }} />
        );
      case 'star':
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <polygon points="12,2 15,9 22,9 16,14 19,21 12,17 5,21 8,14 2,9 9,9" />
          </svg>
        );
      case 'heart':
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
          </svg>
        );
      case 'diamond':
        return (
          <div style={{
            ...style,
            backgroundColor: 'transparent',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            background: color
          }} />
        );
      default:
        return <div style={style} />;
    }
  };

  // Render line - exactly like Canvas.jsx
  const renderLine = (element, scaledWidth, scaledHeight) => {
    const strokeWidth = (element.strokeWidth || 2) * displayScale;
    const color = element.color || '#FFFFFF';
    
    let strokeDasharray = '';
    if (element.lineStyle === 'dashed') strokeDasharray = `${strokeWidth * 4} ${strokeWidth * 2}`;
    if (element.lineStyle === 'dotted') strokeDasharray = `${strokeWidth} ${strokeWidth * 2}`;
    
    return (
      <svg width={scaledWidth} height={scaledHeight} style={{ overflow: 'visible' }}>
        <line
          x1="0"
          y1={scaledHeight / 2}
          x2={scaledWidth}
          y2={scaledHeight / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Render gradient - exactly like Canvas.jsx
  const renderGradient = (element) => {
    const colors = element.gradientColors || ['#FF6B6B', '#FFA500'];
    const angle = element.gradientAngle || 135;
    const borderRadius = element.borderRadius ? element.borderRadius * displayScale : 0;
    
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
          borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined
        }}
      />
    );
  };

  // Render divider - exactly like Canvas.jsx
  const renderDivider = (element) => {
    const strokeWidth = (element.strokeWidth || 2) * displayScale;
    const color = element.color || '#FFFFFF';
    
    if (element.dividerStyle === 'double') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: `${strokeWidth}px` }}>
          <div style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
          <div style={{ height: `${strokeWidth}px`, backgroundColor: color }} />
        </div>
      );
    }
    
    let borderStyle = 'solid';
    if (element.dividerStyle === 'dashed') borderStyle = 'dashed';
    if (element.dividerStyle === 'dotted') borderStyle = 'dotted';
    
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', borderTop: `${strokeWidth}px ${borderStyle} ${color}` }} />
      </div>
    );
  };
  
  // Render background element (can be shape or gradient)
  const renderBackground = () => {
    const bgElement = elements.find(el => el.isBackground);
    if (!bgElement) return null;
    
    if (bgElement.type === 'gradient') {
      return renderGradient(bgElement);
    }
    
    // Shape background is handled by backgroundColor style
    return null;
  };
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg"
      style={{ 
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
        backgroundColor: backgroundColor,
        flexShrink: 0
      }}
    >
      {/* Render gradient background if exists */}
      {(() => {
        const bgElement = elements.find(el => el.isBackground && el.type === 'gradient');
        if (bgElement) {
          return (
            <div 
              className="absolute inset-0"
              style={{ zIndex: 0 }}
            >
              {renderGradient(bgElement)}
            </div>
          );
        }
        return null;
      })()}
      
      {elements.map((element, index) => {
        if (element.isBackground) return null;
        
        const scaledX = element.x * displayScale;
        const scaledY = element.y * displayScale;
        const scaledWidth = element.width * displayScale;
        const scaledHeight = element.height * displayScale;
        
        const baseStyle = {
          position: 'absolute',
          left: `${scaledX}px`,
          top: `${scaledY}px`,
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          opacity: element.opacity !== undefined ? element.opacity : 1,
          zIndex: index + 1
        };
        
        if (element.type === 'shape') {
          return (
            <div key={element.id || index} style={baseStyle}>
              {renderShape(element)}
            </div>
          );
        }
        
        if (element.type === 'gradient') {
          return (
            <div key={element.id || index} style={baseStyle}>
              {renderGradient(element)}
            </div>
          );
        }
        
        if (element.type === 'text') {
          const fontSize = (element.size || 24) * displayScale;
          const padding = 4 * displayScale;
          return (
            <div
              key={element.id || index}
              style={{
                ...baseStyle,
                color: element.color || '#FFFFFF',
                fontSize: `${fontSize}px`,
                fontFamily: element.font || 'Inter, sans-serif',
                fontWeight: element.bold ? 'bold' : 'normal',
                fontStyle: element.italic ? 'italic' : 'normal',
                textDecoration: element.underline ? 'underline' : 'none',
                textAlign: element.align || 'left',
                lineHeight: 1.2,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                padding: `${padding}px`,
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              {element.content}
            </div>
          );
        }
        
        if (element.type === 'line') {
          return (
            <div key={element.id || index} style={baseStyle}>
              {renderLine(element, scaledWidth, scaledHeight)}
            </div>
          );
        }
        
        if (element.type === 'divider') {
          return (
            <div key={element.id || index} style={baseStyle}>
              {renderDivider(element)}
            </div>
          );
        }
        
        if (element.type === 'image' && element.content) {
          return (
            <div key={element.id || index} style={{ ...baseStyle, overflow: 'hidden' }}>
              <img
                src={element.content}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
              />
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default TemplateGallery;
