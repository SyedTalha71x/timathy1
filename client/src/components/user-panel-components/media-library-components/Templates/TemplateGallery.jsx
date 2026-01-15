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
  ChevronRight
} from 'lucide-react';
import { templates, templateCategories } from '../constants/templates';

const iconMap = {
  Grid3X3,
  Instagram,
  Megaphone,
  Dumbbell,
  Calendar,
  Quote,
  Bell,
  Minus
};

// Extended blank templates with standard social media sizes (no Universal)
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
  onSelectBlank
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
    return templates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
              const count = category.id === 'all' 
                ? templates.length 
                : templates.filter(t => t.category === category.id).length;
              
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
                      className="group relative rounded-xl overflow-hidden transition-all hover:ring-2 hover:ring-orange-500/50 hover:shadow-lg border border-[#333333]"
                    >
                      {/* Fixed height preview area */}
                      <div 
                        className="w-full h-[140px] relative overflow-hidden"
                        style={{ backgroundColor: template.colors?.secondary || '#1a1a1a' }}
                      >
                        {/* Simplified Preview Rendering */}
                        <TemplatePreview template={template} />
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg">
                            Use Template
                          </span>
                        </div>
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

// Simplified Template Preview Component
const TemplatePreview = ({ template }) => {
  const [width, height] = template.size.split('x').map(Number);
  const scale = 140 / Math.max(width, height);
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: template.colors?.secondary || '#1a1a1a' }}
    >
      {template.elements?.slice(0, 5).map((element, index) => {
        const scaledX = element.x * scale;
        const scaledY = element.y * scale;
        const scaledWidth = element.width * scale;
        const scaledHeight = element.height * scale;
        
        if (element.type === 'shape') {
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                backgroundColor: element.color,
                borderRadius: element.shape === 'circle' ? '50%' : 
                             element.shape === 'rounded-rectangle' ? '6px' : '0'
              }}
            />
          );
        }
        
        if (element.type === 'text') {
          return (
            <div
              key={index}
              className="absolute overflow-hidden"
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                color: element.color,
                fontSize: `${Math.max(4, element.size * scale)}px`,
                fontFamily: element.font,
                fontWeight: element.bold ? 'bold' : 'normal',
                fontStyle: element.italic ? 'italic' : 'normal',
                textAlign: element.align || 'left',
                lineHeight: 1.1,
                whiteSpace: 'pre-wrap'
              }}
            >
              {element.content}
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default TemplateGallery;
