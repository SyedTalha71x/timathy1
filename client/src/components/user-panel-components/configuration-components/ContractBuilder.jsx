/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Modal, notification } from 'antd';

const ContractBuilder = ({ contractForm, onUpdate }) => {
  const [contractPages, setContractPages] = useState(
    contractForm?.pages || [
      {
        id: 1,
        title: 'Contract Page 1',
        elements: []
      }
    ]
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const containerRef = useRef();
  const nextElementId = useRef(2);
  const nextPageId = useRef(2);

  const [variables] = useState([
    'Studio Name',
    'Studio Owner Name',
    'Salutation',
    'Member First Name',
    'Member Last Name',
    'Street',
    'House Number',
    'ZIP Code',
    'City',
    'Phone Number',
    'Email Address',
    'Date of Birth',
    'Contract Type',
    'Contract Cost',
    'Contract Start',
    'Termination Notice Period',
    'Contract Renewal Duration',
    'Contribution Adjustment',
    'Creditor ID'
  ]);

  const fieldTypes = [
    { 
      category: 'Basic Fields',
      types: [
        { value: 'text', label: 'Text Input', icon: '📝' },
        { value: 'textarea', label: 'Text Area', icon: '📄' },
        { value: 'number', label: 'Number', icon: '🔢' },
        { value: 'date', label: 'Date', icon: '📅' },
        { value: 'email', label: 'Email', icon: '📧' },
        { value: 'phone', label: 'Phone', icon: '📞' }
      ]
    },
    {
      category: 'Special Fields',
      types: [
        { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
        { value: 'signature', label: 'Signature', icon: '✍️' },
        { value: 'initial', label: 'Initial', icon: '🖊️' }
      ]
    },
    {
      category: 'Content',
      types: [
        { value: 'heading', label: 'Heading', icon: '🔤' },
        { value: 'paragraph', label: 'Paragraph', icon: '📝' },
        { value: 'divider', label: 'Divider', icon: '➖' }
      ]
    }
  ];

  const pagesEqual = (a, b) => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);


  useEffect(() => {
    if (contractForm?.pages && !pagesEqual(contractForm.pages, contractPages)) {
      setContractPages(contractForm.pages);
      // Find the maximum element ID
      const maxId = contractForm.pages.reduce((max, page) => {
        const pageMax = (page.elements || []).reduce((pageMax, el) => Math.max(pageMax, el.id || 0), 0);
        return Math.max(max, pageMax);
      }, 0);
      nextElementId.current = Math.max(nextElementId.current, maxId + 1);
      // Also set nextPageId
      const maxPageId = contractForm.pages.reduce((m, p) => Math.max(m, p.id || 0), 0);
      nextPageId.current = Math.max(nextPageId.current, maxPageId + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractForm?.pages]);

  // Notify parent component of changes only when pages actually differ from prop
  useEffect(() => {
    if (!onUpdate) return;
    const propPages = contractForm?.pages;
    if (propPages && pagesEqual(propPages, contractPages)) {
      return; // no change -> don't call onUpdate (prevents update loop)
    }
    // Build updated form and call onUpdate
    const updatedForm = {
      ...(contractForm || {}),
      pages: contractPages
    };
    onUpdate(updatedForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractPages, onUpdate]);

  const addPage = () => {
    const newPage = {
      id: nextPageId.current++,
      title: `Contract Page ${contractPages.length + 1}`,
      elements: []
    };
    setContractPages(prev => [...prev, newPage]);
    setCurrentPage(contractPages.length);
  };

  const removePage = (pageIndex) => {
    if (contractPages.length === 1) {
      notification.warning({
        message: "Cannot Remove Page",
        description: "Contract must have at least one page"
      });
      return;
    }
    
    Modal.confirm({
      title: "Remove Page",
      content: "Are you sure you want to remove this page?",
      okText: "Yes, Remove",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        setContractPages(prev => {
          const updatedPages = prev.filter((_, i) => i !== pageIndex);
          // adjust currentPage if needed
          setCurrentPage(cp => (cp >= updatedPages.length ? updatedPages.length - 1 : cp));
          return updatedPages;
        });
      }
    });
  };

  const updateElement = useCallback((elementId, property, value) => {
    setContractPages(prev => {
      return prev.map((page, pIdx) => {
        if (pIdx !== currentPage) return page;
        const newElements = page.elements.map(el => {
          if (el.id !== elementId) return el;
          if (!property.includes('.')) {
            // simple property
            return { ...el, [property]: value };
          }
          // nested property like parent.child
          const [parent, child] = property.split('.');
          return {
            ...el,
            [parent]: {
              ...(el[parent] || {}),
              [child]: value
            }
          };
        });
        return { ...page, elements: newElements };
      });
    });
  }, [currentPage]);

  const addElement = (type) => {
    const yPercent = Math.min(85, (contractPages[currentPage]?.elements.length || 0) * 8 + 5);
    const baseElement = {
      id: nextElementId.current++,
      type,
      x: 5, // start near left edge
      y: yPercent,
      width: type === 'heading' ? 80 : type === 'paragraph' ? 90 : 45,
      height: type === 'textarea' ? 80 : type === 'paragraph' ? 60 : 40,
      required: false,
      variable: null
    };

    let element;
    switch (type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        element = {
          ...baseElement,
          label: 'Text Field',
          placeholder: 'Enter text...',
          value: ''
        };
        break;
      case 'textarea':
        element = {
          ...baseElement,
          label: 'Text Area',
          placeholder: 'Enter longer text...',
          value: ''
        };
        break;
      case 'date':
        element = {
          ...baseElement,
          label: 'Date',
          value: ''
        };
        break;
      case 'checkbox':
        element = {
          ...baseElement,
          label: 'Checkbox option',
          checked: false
        };
        break;
      case 'heading':
        element = {
          ...baseElement,
          content: 'Section Heading',
          fontSize: 24,
          bold: true,
          alignment: 'left'
        };
        break;
      case 'paragraph':
        element = {
          ...baseElement,
          content: 'Paragraph text goes here...',
          fontSize: 14,
          bold: false,
          alignment: 'left'
        };
        break;
      case 'signature':
        element = {
          ...baseElement,
          label: 'Signature',
          width: 60,
          height: 80
        };
        break;
      case 'initial':
        element = {
          ...baseElement,
          label: 'Initial',
          width: 20,
          height: 40
        };
        break;
      case 'divider':
        element = {
          ...baseElement,
          width: 90,
          height: 2
        };
        break;
      default:
        element = baseElement;
    }

    setContractPages(prev => {
      return prev.map((page, idx) => idx === currentPage
        ? { ...page, elements: [...(page.elements || []), element] }
        : page
      );
    });
    setSelectedElement(element.id);

    // Close sidebar on mobile after adding element
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const removeElement = (elementId) => {
    Modal.confirm({
      title: "Remove Element",
      content: "Are you sure you want to remove this element?",
      okText: "Yes, Remove",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        setContractPages(prev => prev.map((page, idx) => {
          if (idx !== currentPage) return page;
          return { ...page, elements: (page.elements || []).filter(el => el.id !== elementId) };
        }));
        setSelectedElement(null);
      },
    });
  };

  const handleDragStart = (elementId, e) => {
    const elNode = e.currentTarget;
    if (!elNode || !containerRef.current) return;
    setIsDragging(true);
    setSelectedElement(elementId);
    const rect = elNode.getBoundingClientRect();
    // compute offset relative to element top-left
    setDragOffset({
      x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
      y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
    });
    e.preventDefault?.();
  };

  const handleDrag = useCallback((e) => {
    if (!isDragging || !selectedElement || !containerRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (clientX == null || clientY == null) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const y = ((clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;

    updateElement(selectedElement, 'x', Math.max(0, Math.min(95, x)));
    updateElement(selectedElement, 'y', Math.max(0, Math.min(95, y)));
    e.preventDefault?.();
  }, [isDragging, selectedElement, dragOffset, updateElement]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDrag, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
    return undefined;
  }, [isDragging, handleDrag, handleDragEnd]);

  const handleCanvasClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
      setPropertiesOpen(false);
    }
    // Deselect element on blank click
    setSelectedElement(null);
  };

  const renderElementContent = (element) => {
    switch (element.type) {
      case 'heading':
        return (
          <h3 style={{
            fontSize: `${Math.min(element.fontSize || 24, viewportWidth < 768 ? 18 : (element.fontSize || 24))}px`,
            fontWeight: element.bold ? 'bold' : 'normal',
            textAlign: element.alignment,
            margin: 0,
            color: '#000'
          }}>
            {element.content}
          </h3>
        );
      case 'paragraph':
        return (
          <p style={{
            fontSize: `${Math.min(element.fontSize || 14, viewportWidth < 768 ? 12 : (element.fontSize || 14))}px`,
            fontWeight: element.bold ? 'bold' : 'normal',
            textAlign: element.alignment,
            margin: 0,
            color: '#000'
          }}>
            {element.content}
          </p>
        );
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000' }}>
              {element.label} {element.required && '*'}
            </label>
            <input
              type={element.type}
              placeholder={element.placeholder}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              disabled
              style={{ color: '#000' }}
            />
          </div>
        );
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000' }}>
              {element.label} {element.required && '*'}
            </label>
            <textarea
              placeholder={element.placeholder}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              rows={3}
              disabled
              style={{ color: '#000' }}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" disabled />
            <span className="text-sm" style={{ color: '#000' }}>
              {element.label} {element.required && '*'}
            </span>
          </div>
        );
      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000' }}>
              {element.label} {element.required && '*'}
            </label>
            <input 
              type="date" 
              className="border border-gray-300 rounded px-2 py-1 text-sm" 
              disabled 
              style={{ color: '#000' }}
            />
          </div>
        );
      case 'signature':
        return (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000' }}>
              {element.label} {element.required && '*'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded h-16 flex items-center justify-center text-gray-400">
              Signature
            </div>
          </div>
        );
      case 'initial':
        return (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000' }}>
              {element.label} {element.required && '*'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded w-12 h-8 flex items-center justify-center text-gray-400">
              Initial
            </div>
          </div>
        );
      case 'divider':
        return <hr className="border-t border-gray-300 my-2" />;
      default:
        return <div style={{ color: '#000' }}>Unknown element type</div>;
    }
  };

  const renderBuilderElement = (element) => {
    const isSelected = selectedElement === element.id;
    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}px`,
      position: 'absolute',
      border: isSelected ? '2px solid #3b82f6' : '1px dashed #6b7280',
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.06)' : 'white',
      borderRadius: '4px',
      padding: '8px',
      cursor: 'move',
      boxSizing: 'border-box',
      touchAction: 'none',
      zIndex: isSelected ? 10 : 1
    };

    return (
      <div
        key={element.id}
        style={style}
        className="element"
        onMouseDown={(e) => handleDragStart(element.id, e)}
        onTouchStart={(e) => handleDragStart(element.id, e)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element.id);
          if (window.innerWidth < 1024) {
            setPropertiesOpen(true);
            setSidebarOpen(false);
          }
        }}
      >
        {renderElementContent(element)}
        {isSelected && (
          <div style={{ position: 'absolute', top: -36, left: 0, display: 'flex', gap: 6, background: '#3b82f6', color: '#fff', padding: '4px 6px', borderRadius: 6, zIndex: 20 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              🗑️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Clone element
                const newElement = { 
                  ...element, 
                  id: nextElementId.current++,
                  x: Math.min(90, (element.x || 5) + 5),
                  y: Math.min(90, (element.y || 5) + 5)
                };
                setContractPages(prev => prev.map((page, idx) => idx === currentPage ? { ...page, elements: [...(page.elements || []), newElement] } : page));
                setSelectedElement(newElement.id);
              }}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              📋
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPropertyPanel = () => {
    if (!selectedElement) {
      return (
        <div className="p-4 text-gray-500 text-sm">
          Select an element to edit its properties
        </div>
      );
    }

    const element = contractPages[currentPage].elements.find(el => el.id === selectedElement);
    if (!element) return null;

    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Element Properties</h3>
          <button
            onClick={() => setPropertiesOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Common properties */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Position & Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs">X: {Math.round(element.x)}%</span>
              <input
                type="range"
                min="0"
                max="95"
                value={element.x}
                onChange={(e) => updateElement(element.id, 'x', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span className="text-xs">Y: {Math.round(element.y)}%</span>
              <input
                type="range"
                min="0"
                max="95"
                value={element.y}
                onChange={(e) => updateElement(element.id, 'y', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span className="text-xs">Width: {element.width}%</span>
              <input
                type="range"
                min="10"
                max="100"
                value={element.width}
                onChange={(e) => updateElement(element.id, 'width', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            {element.height !== undefined && (
              <div>
                <span className="text-xs">Height: {element.height}px</span>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={element.height}
                  onChange={(e) => updateElement(element.id, 'height', parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Type-specific properties */}
        {['text', 'textarea', 'email', 'phone', 'number', 'date', 'checkbox'].includes(element.type) && (
          <>
            <div>
              <label className="block text-sm font-medium">Label</label>
              <input
                type="text"
                value={element.label || ''}
                onChange={(e) => updateElement(element.id, 'label', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
            
            {['text', 'textarea'].includes(element.type) && (
              <div>
                <label className="block text-sm font-medium">Placeholder</label>
                <input
                  type="text"
                  value={element.placeholder || ''}
                  onChange={(e) => updateElement(element.id, 'placeholder', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={element.required || false}
                onChange={(e) => updateElement(element.id, 'required', e.target.checked)}
              />
              <label className="text-sm font-medium">Required Field</label>
            </div>

            <div>
              <label className="block text-sm font-medium">Bind to Variable</label>
              <select
                value={element.variable || ''}
                onChange={(e) => updateElement(element.id, 'variable', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">None</option>
                {variables.map(variable => (
                  <option key={variable} value={variable}>{variable}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {['heading', 'paragraph'].includes(element.type) && (
          <>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={element.content || ''}
                onChange={(e) => updateElement(element.id, 'content', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Font Size</label>
              <input
                type="range"
                min="8"
                max="48"
                value={element.fontSize || 14}
                onChange={(e) => updateElement(element.id, 'fontSize', parseInt(e.target.value, 10))}
                className="w-full"
              />
              <span className="text-xs">{element.fontSize}px</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={element.bold || false}
                  onChange={(e) => updateElement(element.id, 'bold', e.target.checked)}
                />
                <span className="text-sm">Bold</span>
              </label>
              
              <label className="block text-sm font-medium">Alignment</label>
              <select
                value={element.alignment || 'left'}
                onChange={(e) => updateElement(element.id, 'alignment', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-gray-100" style={{ height: 'calc(100vh - 108px)' }}>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-40">
        <h2 className="font-semibold text-lg">Contract Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            🛠️ Tools
          </button>
          <button
            onClick={() => setPropertiesOpen(!propertiesOpen)}
            className="bg-green-500 text-white p-2 rounded-lg"
          >
            ⚙️ Properties
          </button>
          <button
            onClick={addPage}
            className="bg-purple-500 text-white p-2 rounded-lg"
          >
            📄 Add Page
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Add Elements</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {fieldTypes.map(category => (
                <div key={category.category} className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">{category.category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.types.map(type => (
                      <button
                        key={type.value}
                        onClick={() => addElement(type.value)}
                        className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <span className="text-xl mb-1">{type.icon}</span>
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {propertiesOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 bg-opacity-50" onClick={() => setPropertiesOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white overflow-y-auto">
            {renderPropertyPanel()}
          </div>
        </div>
      )}

      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Contract Builder</h2>
          <p className="text-sm text-gray-500 mt-1">{contractForm?.name || 'Untitled Form'}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {fieldTypes.map(category => (
            <div key={category.category} className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-sm text-gray-500 mb-2">{category.category}</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => addElement(type.value)}
                    className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:bg-gray-50 text-sm"
                  >
                    <span className="text-lg mb-1">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={addPage}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Page
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 mt-16 lg:mt-0" style={{ overflow: 'hidden' }}>
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center px-4 overflow-x-auto">
            {contractPages.map((page, index) => (
              <div
                key={page.id}
                className={`flex items-center px-4 py-2 border-b-2 flex-shrink-0 ${
                  currentPage === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                }`}
              >
                <button
                  onClick={() => setCurrentPage(index)}
                  className="mr-2 text-sm lg:text-base"
                >
                  {page.title}
                </button>
                {contractPages.length > 1 && (
                  <button
                    onClick={() => removePage(index)}
                    className="text-gray-400 hover:text-red-500 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-2 lg:p-4" style={{ overflow: 'auto' }}>
          <div
            ref={containerRef}
            className="bg-white border border-gray-300 rounded-lg relative h-full overflow-auto flex items-start justify-center"
            style={{ 
              minHeight: '400px',
              backgroundImage: `
                linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
            onClick={handleCanvasClick}
          >
            {/* A4 Page Simulation */}
            <div 
              className="bg-white shadow-lg mx-auto my-4 relative"
              style={{
                width: viewportWidth < 768 ? '95%' : '210mm',
                minHeight: viewportWidth < 768 ? 'auto' : '297mm',
                maxWidth: '95%',
                maxHeight: '95%',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              {contractPages[currentPage]?.elements.map(renderBuilderElement)}
              
              {contractPages[currentPage]?.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-sm lg:text-base">
                      {viewportWidth < 1024 
                        ? 'Tap "Tools" to add elements' 
                        : 'Add elements from the sidebar to build your contract'
                      }
                    </p>
                    {viewportWidth < 1024 && (
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      >
                        Open Tools
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-80 bg-white border-l border-gray-200 overflow-y-auto">
        {renderPropertyPanel()}
      </div>
    </div>
  );
};

export default ContractBuilder;