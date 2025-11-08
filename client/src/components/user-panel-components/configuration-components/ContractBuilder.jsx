/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback, useEffect } from 'react';

const ContractBuilder = () => {
  const [contractPages, setContractPages] = useState([
    {
      id: 1,
      title: 'Contract Page 1',
      elements: []
    }
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [templates, setTemplates] = useState([]);
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

  const containerRef = useRef();
  const nextElementId = useRef(1);
  const nextPageId = useRef(2);

  // Field types with icons and categories
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

  // Add new page
  const addPage = () => {
    const newPage = {
      id: nextPageId.current++,
      title: `Contract Page ${contractPages.length + 1}`,
      elements: []
    };
    setContractPages([...contractPages, newPage]);
    setCurrentPage(contractPages.length);
  };

  // Remove page
  const removePage = (pageIndex) => {
    if (contractPages.length === 1) return;
    const updatedPages = contractPages.filter((_, i) => i !== pageIndex);
    setContractPages(updatedPages);
    if (currentPage >= updatedPages.length) {
      setCurrentPage(updatedPages.length - 1);
    }
  };

  // Add element to current page
  const addElement = (type) => {
    const baseElement = {
      id: nextElementId.current++,
      type,
      x: 50,
      y: contractPages[currentPage].elements.length * 60 + 50,
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

    const updatedPages = [...contractPages];
    updatedPages[currentPage].elements.push(element);
    setContractPages(updatedPages);
    setSelectedElement(element.id);
  };

  // Update element property
  const updateElement = (elementId, property, value) => {
    const updatedPages = [...contractPages];
    const elementIndex = updatedPages[currentPage].elements.findIndex(el => el.id === elementId);
    
    if (elementIndex !== -1) {
      if (property.includes('.')) {
        const [parent, child] = property.split('.');
        updatedPages[currentPage].elements[elementIndex][parent][child] = value;
      } else {
        updatedPages[currentPage].elements[elementIndex][property] = value;
      }
      setContractPages(updatedPages);
    }
  };

  // Remove element
  const removeElement = (elementId) => {
    const updatedPages = [...contractPages];
    updatedPages[currentPage].elements = updatedPages[currentPage].elements.filter(
      el => el.id !== elementId
    );
    setContractPages(updatedPages);
    setSelectedElement(null);
  };

  // Handle drag start
  const handleDragStart = (elementId, e) => {
    const element = contractPages[currentPage].elements.find(el => el.id === elementId);
    if (element) {
      setIsDragging(true);
      setSelectedElement(elementId);
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle drag
  const handleDrag = useCallback((e) => {
    if (!isDragging || !selectedElement) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;

    updateElement(selectedElement, 'x', Math.max(0, Math.min(95, x)));
    updateElement(selectedElement, 'y', Math.max(0, Math.min(95, y)));
  }, [isDragging, selectedElement, dragOffset]);

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag]);

  // Render element in builder
  const renderBuilderElement = (element) => {
    const isSelected = selectedElement === element.id;
    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}px`,
      position: 'absolute',
      border: isSelected ? '2px solid #3b82f6' : '1px dashed #6b7280',
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'white',
      borderRadius: '4px',
      padding: '8px',
      cursor: 'move',
      boxSizing: 'border-box'
    };

    return (
      <div
        key={element.id}
        style={style}
        className="element"
        onMouseDown={(e) => handleDragStart(element.id, e)}
        onClick={() => setSelectedElement(element.id)}
      >
        {renderElementContent(element)}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex gap-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            <button
              onClick={() => removeElement(element.id)}
              className="hover:bg-blue-600 px-1 rounded"
            >
              🗑️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Clone element
                const newElement = { ...element, id: nextElementId.current++ };
                const updatedPages = [...contractPages];
                updatedPages[currentPage].elements.push(newElement);
                setContractPages(updatedPages);
              }}
              className="hover:bg-blue-600 px-1 rounded"
            >
              📋
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render element content based on type
  const renderElementContent = (element) => {
    switch (element.type) {
      case 'heading':
        return (
          <h3 style={{
            fontSize: `${element.fontSize}px`,
            fontWeight: element.bold ? 'bold' : 'normal',
            textAlign: element.alignment,
            margin: 0
          }}>
            {element.content}
          </h3>
        );
      case 'paragraph':
        return (
          <p style={{
            fontSize: `${element.fontSize}px`,
            fontWeight: element.bold ? 'bold' : 'normal',
            textAlign: element.alignment,
            margin: 0
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
            <label className="block text-sm font-medium mb-1">
              {element.label} {element.required && '*'}
            </label>
            <input
              type={element.type}
              placeholder={element.placeholder}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              disabled
            />
          </div>
        );
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium mb-1">
              {element.label} {element.required && '*'}
            </label>
            <textarea
              placeholder={element.placeholder}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              rows={3}
              disabled
            />
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" disabled />
            <span className="text-sm">
              {element.label} {element.required && '*'}
            </span>
          </div>
        );
      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium mb-1">
              {element.label} {element.required && '*'}
            </label>
            <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" disabled />
          </div>
        );
      case 'signature':
        return (
          <div>
            <label className="block text-sm font-medium mb-1">
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
            <label className="block text-sm font-medium mb-1">
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
        return <div>Unknown element type</div>;
    }
  };

  // Property panel for selected element
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
        <h3 className="font-semibold text-lg">Element Properties</h3>
        
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
                onChange={(e) => updateElement(element.id, 'x', parseInt(e.target.value))}
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
                onChange={(e) => updateElement(element.id, 'y', parseInt(e.target.value))}
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
                onChange={(e) => updateElement(element.id, 'width', parseInt(e.target.value))}
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
                  onChange={(e) => updateElement(element.id, 'height', parseInt(e.target.value))}
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
                onChange={(e) => updateElement(element.id, 'fontSize', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs">{element.fontSize}px</span>
            </div>

            <div className="flex items-center gap-4">
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
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Contract Builder</h2>
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

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={addPage}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Page
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Page Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center px-4">
            {contractPages.map((page, index) => (
              <div
                key={page.id}
                className={`flex items-center px-4 py-2 border-b-2 ${
                  currentPage === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                }`}
              >
                <button
                  onClick={() => setCurrentPage(index)}
                  className="mr-2"
                >
                  {page.title}
                </button>
                {contractPages.length > 1 && (
                  <button
                    onClick={() => removePage(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4">
          <div
            ref={containerRef}
            className="bg-white border border-gray-300 rounded-lg relative h-full overflow-auto"
            style={{ minHeight: '500px' }}
          >
            {contractPages[currentPage]?.elements.map(renderBuilderElement)}
            
            {contractPages[currentPage]?.elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">📄</div>
                  <p>Add elements from the sidebar to build your contract</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        {renderPropertyPanel()}
      </div>
    </div>
  );
};

export default ContractBuilder;