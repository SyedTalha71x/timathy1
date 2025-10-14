/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react';
import {
  Button,
  Input,
  Select,
  Upload,
  Form,
  Space,
  Divider,
  ColorPicker,
  InputNumber,
  Switch,
  Modal,
  Tabs,
  Card,
  notification,
  Checkbox,
  Radio,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  FontSizeOutlined,
  FileTextOutlined,
  SaveOutlined,
  DragOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const ContractBuilder = () => {
  const [contractPages, setContractPages] = useState([
    {
      id: 1,
      title: 'Page 1',
      elements: []
    }
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [contractLogo, setContractLogo] = useState(null);
  const [contractLogoUrl, setContractLogoUrl] = useState('');
  const nextElementId = useRef(1);
  const nextPageId = useRef(2);

  const inputStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#f3f4f6',
    padding: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#f3f4f6',
  };

  const saveButtonStyle = {
    backgroundColor: '#f97316',
    border: '1px solid #ea580c',
    color: '#fff',
  };

  // Field type options
  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: <FileTextOutlined /> },
    { value: 'textarea', label: 'Text Area', icon: <AlignLeftOutlined /> },
    { value: 'checkbox', label: 'Checkbox', icon: '☑' },
    { value: 'signature', label: 'Signature Field', icon: '✍' },
    { value: 'date', label: 'Date Field', icon: '📅' },
    { value: 'heading', label: 'Heading Text', icon: <FontSizeOutlined /> },
    { value: 'paragraph', label: 'Paragraph Text', icon: <AlignLeftOutlined /> },
  ];

  // Add new page
  const addPage = () => {
    setContractPages([
      ...contractPages,
      {
        id: nextPageId.current++,
        title: `Page ${contractPages.length + 1}`,
        elements: []
      }
    ]);
  };

  // Remove page
  const removePage = (pageIndex) => {
    if (contractPages.length === 1) {
      notification.warning({
        message: 'Cannot Remove',
        description: 'Contract must have at least one page.'
      });
      return;
    }
    const updatedPages = contractPages.filter((_, i) => i !== pageIndex);
    setContractPages(updatedPages);
    if (currentPage >= updatedPages.length) {
      setCurrentPage(updatedPages.length - 1);
    }
  };

  // Add element to current page
  const addElement = (type) => {
    const newElement = {
      id: nextElementId.current++,
      type,
      label: type === 'heading' ? 'Section Title' : type === 'paragraph' ? 'Content text here...' : `${type} field`,
      placeholder: type === 'text' || type === 'textarea' ? 'Enter text...' : '',
      required: false,
      width: '100',
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        alignment: 'left',
        fontSize: type === 'heading' ? '24' : '14',
        color: '#000000'
      }
    };

    const updatedPages = [...contractPages];
    updatedPages[currentPage].elements.push(newElement);
    setContractPages(updatedPages);
  };

  // Update element
  const updateElement = (elementId, field, value) => {
    const updatedPages = [...contractPages];
    const element = updatedPages[currentPage].elements.find(el => el.id === elementId);
    if (element) {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        element[parent][child] = value;
      } else {
        element[field] = value;
      }
    }
    setContractPages(updatedPages);
  };

  // Remove element
  const removeElement = (elementId) => {
    const updatedPages = [...contractPages];
    updatedPages[currentPage].elements = updatedPages[currentPage].elements.filter(
      el => el.id !== elementId
    );
    setContractPages(updatedPages);
  };

  // Move element up/down
  const moveElement = (elementId, direction) => {
    const updatedPages = [...contractPages];
    const elements = updatedPages[currentPage].elements;
    const index = elements.findIndex(el => el.id === elementId);
    
    if (direction === 'up' && index > 0) {
      [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
    } else if (direction === 'down' && index < elements.length - 1) {
      [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
    }
    
    setContractPages(updatedPages);
  };

  // Handle logo upload
  const handleLogoUpload = (info) => {
    if (info.file.originFileObj) {
      const url = URL.createObjectURL(info.file.originFileObj);
      setContractLogoUrl(url);
      setContractLogo([info.file]);
    }
  };

  // Handle additional documents
  const handleDocumentUpload = (info) => {
    setAdditionalDocuments(info.fileList);
  };

  // Render element in builder
  const renderBuilderElement = (element) => {
    const formatStyle = {
      fontWeight: element.formatting.bold ? 'bold' : 'normal',
      fontStyle: element.formatting.italic ? 'italic' : 'normal',
      textDecoration: element.formatting.underline ? 'underline' : 'none',
      textAlign: element.formatting.alignment,
      fontSize: `${element.formatting.fontSize}px`,
      color: element.formatting.color
    };

    return (
      <Card
        key={element.id}
        className="mb-3 sm:mb-4"
        style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        extra={
          <Space size="small">
            <Button
              icon={<DragOutlined />}
              size="small"
              style={buttonStyle}
              onClick={() => moveElement(element.id, 'up')}
            >
              ↑
            </Button>
            <Button
              icon={<DragOutlined />}
              size="small"
              style={buttonStyle}
              onClick={() => moveElement(element.id, 'down')}
            >
              ↓
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => removeElement(element.id)}
            />
          </Space>
        }
      >
        <Space direction="vertical" className="w-full" size="small">
          {/* Element Type */}
          <div className="text-gray-400 text-xs">
            {fieldTypes.find(t => t.value === element.type)?.label}
          </div>

          {/* Label/Content */}
          {(element.type === 'heading' || element.type === 'paragraph') ? (
            <TextArea
              value={element.label}
              onChange={(e) => updateElement(element.id, 'label', e.target.value)}
              placeholder="Enter text content..."
              rows={element.type === 'paragraph' ? 4 : 2}
              style={{...inputStyle, ...formatStyle}}
            />
          ) : (
            <Input
              value={element.label}
              onChange={(e) => updateElement(element.id, 'label', e.target.value)}
              placeholder="Field label"
              style={inputStyle}
            />
          )}

          {/* Placeholder for input fields */}
          {(element.type === 'text' || element.type === 'textarea') && (
            <Input
              value={element.placeholder}
              onChange={(e) => updateElement(element.id, 'placeholder', e.target.value)}
              placeholder="Placeholder text"
              style={inputStyle}
            />
          )}

          {/* Formatting toolbar */}
          <Space wrap className="w-full" size="small">
            <Tooltip title="Bold">
              <Button
                icon={<BoldOutlined />}
                size="small"
                type={element.formatting.bold ? 'primary' : 'default'}
                onClick={() => updateElement(element.id, 'formatting.bold', !element.formatting.bold)}
              />
            </Tooltip>
            <Tooltip title="Italic">
              <Button
                icon={<ItalicOutlined />}
                size="small"
                type={element.formatting.italic ? 'primary' : 'default'}
                onClick={() => updateElement(element.id, 'formatting.italic', !element.formatting.italic)}
              />
            </Tooltip>
            <Tooltip title="Underline">
              <Button
                icon={<UnderlineOutlined />}
                size="small"
                type={element.formatting.underline ? 'primary' : 'default'}
                onClick={() => updateElement(element.id, 'formatting.underline', !element.formatting.underline)}
              />
            </Tooltip>
            
            <Select
              value={element.formatting.alignment}
              onChange={(value) => updateElement(element.id, 'formatting.alignment', value)}
              style={{ width: 90 }}
              size="small"
            >
              <Option value="left"><AlignLeftOutlined /> Left</Option>
              <Option value="center"><AlignCenterOutlined /> Center</Option>
              <Option value="right"><AlignRightOutlined /> Right</Option>
            </Select>

            <InputNumber
              value={element.formatting.fontSize}
              onChange={(value) => updateElement(element.id, 'formatting.fontSize', value)}
              min={8}
              max={72}
              size="small"
              addonBefore={<FontSizeOutlined />}
              style={{ width: 90 }}
              className='white-text text-white'
            />

            <ColorPicker
              value={element.formatting.color}
              onChange={(color) => updateElement(element.id, 'formatting.color', color.toHexString())}
              size="small"
            />
          </Space>

          {/* Additional options */}
          <Space wrap size="small">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-xs sm:text-sm">Width:</span>
              <InputNumber
                value={element.width}
                onChange={(value) => updateElement(element.id, 'width', value)}
                min={10}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                size="small"
                style={{ width: 70 }}
                className='white-text text-white'
              />
            </div>
            
            {element.type !== 'heading' && element.type !== 'paragraph' && (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-xs sm:text-sm">Required:</span>
                <Switch
                  checked={element.required}
                  onChange={(checked) => updateElement(element.id, 'required', checked)}
                  size="small"
                />
              </div>
            )}
          </Space>

          {/* Preview */}
          <div className="mt-2 p-2 sm:p-3 bg-white rounded" style={{ width: `${element.width}%` }}>
            <div style={formatStyle}>
              {element.type === 'heading' && element.label}
              {element.type === 'paragraph' && element.label}
              {element.type === 'text' && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">{element.label} {element.required && <span className="text-red-500">*</span>}</div>
                  <input
                    type="text"
                    placeholder={element.placeholder}
                    className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-sm"
                    disabled
                  />
                </div>
              )}
              {element.type === 'textarea' && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">{element.label} {element.required && <span className="text-red-500">*</span>}</div>
                  <textarea
                    placeholder={element.placeholder}
                    className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-sm"
                    rows={4}
                    disabled
                  />
                </div>
              )}
              {element.type === 'checkbox' && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled />
                  <span className="text-xs sm:text-sm">{element.label} {element.required && <span className="text-red-500">*</span>}</span>
                </div>
              )}
              {element.type === 'signature' && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">{element.label} {element.required && <span className="text-red-500">*</span>}</div>
                  <div className="border-2 border-dashed border-gray-300 rounded p-3 sm:p-4 text-center text-gray-400 text-xs sm:text-sm">
                    Signature Area
                  </div>
                </div>
              )}
              {element.type === 'date' && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">{element.label} {element.required && <span className="text-red-500">*</span>}</div>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-sm"
                    disabled
                  />
                </div>
              )}
            </div>
          </div>
        </Space>
      </Card>
    );
  };

  // Render preview
  const renderPreview = () => {
    return (
      <div className="bg-gray-100 text-black max-w-4xl mx-auto">
        {/* Logo */}
        {contractLogoUrl && (
          <div className="flex justify-end p-4 sm:p-6 lg:p-8 bg-white">
            <img src={contractLogoUrl} alt="Logo" className="h-12 sm:h-16 lg:h-20 object-contain" />
          </div>
        )}

        {/* Contract pages */}
        {contractPages.map((page, pageIndex) => (
          <div key={page.id} className="p-4 sm:p-6 lg:p-8 min-h-screen bg-white" style={{ pageBreakAfter: 'always' }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{page.title}</h2>
            
            {page.elements.map(element => {
              const formatStyle = {
                fontWeight: element.formatting.bold ? 'bold' : 'normal',
                fontStyle: element.formatting.italic ? 'italic' : 'normal',
                textDecoration: element.formatting.underline ? 'underline' : 'none',
                textAlign: element.formatting.alignment,
                fontSize: `${element.formatting.fontSize}px`,
                color: element.formatting.color,
                marginBottom: '1rem'
              };

              return (
                <div key={element.id} style={{ width: `${element.width}%`, marginBottom: '1.5rem' }}>
                  {element.type === 'heading' && (
                    <h3 style={formatStyle}>{element.label}</h3>
                  )}
                  {element.type === 'paragraph' && (
                    <p style={formatStyle}>{element.label}</p>
                  )}
                  {element.type === 'text' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">
                        {element.label} {element.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={element.placeholder}
                        className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-sm"
                      />
                    </div>
                  )}
                  {element.type === 'textarea' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">
                        {element.label} {element.required && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        placeholder={element.placeholder}
                        className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-sm"
                        rows={4}
                      />
                    </div>
                  )}
                  {element.type === 'checkbox' && (
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="mt-1" />
                      <span style={formatStyle}>{element.label} {element.required && <span className="text-red-500">*</span>}</span>
                    </div>
                  )}
                  {element.type === 'signature' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">
                        {element.label} {element.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="border-2 border-gray-300 rounded p-6 sm:p-8 text-center text-gray-400">
                        Signature
                      </div>
                    </div>
                  )}
                  {element.type === 'date' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">
                        {element.label} {element.required && <span className="text-red-500">*</span>}
                      </label>
                      <input type="date" className="border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-2 text-sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Additional documents note */}
        {additionalDocuments.length > 0 && (
          <div className="p-4 sm:p-6 lg:p-8 bg-white">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Additional Documents</h3>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">The following documents are attached to this contract:</p>
            <ul className="list-disc pl-4 sm:pl-6">
              {additionalDocuments.map((doc, index) => (
                <li key={index} className="text-gray-700 text-sm sm:text-base">{doc.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl space-y-4 sm:space-y-6 lg:space-y-8 bg-[#111827] min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Contract Builder</h1>
        <Space wrap size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => setPreviewVisible(true)}
            style={buttonStyle}
            size="small"
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Preview Contract</span>
            <span className="sm:hidden">Preview</span>
          </Button>
          <Button
            icon={<SaveOutlined />}
            type="primary"
            style={saveButtonStyle}
            size="small"
            className="text-xs sm:text-sm"
            onClick={() => {
              notification.success({
                message: 'Contract Saved',
                description: 'Your contract template has been saved successfully.'
              });
            }}
          >
            <span className="hidden sm:inline">Save Contract</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {/* Sidebar - Tools */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <Card 
            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            title={<span className="text-white text-sm sm:text-base">Contract Logo</span>}
          >
            <Space direction="vertical" className="w-full" size="small">
              {contractLogoUrl && (
                <div className="w-full h-24 sm:h-32 flex items-center justify-center bg-white rounded">
                  <img src={contractLogoUrl} alt="Logo" className="max-h-full object-contain" />
                </div>
              )}
              <Upload
                accept="image/*"
                maxCount={1}
                onChange={handleLogoUpload}
                fileList={contractLogo}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} style={buttonStyle} className="w-full text-xs sm:text-sm">
                  {contractLogo ? 'Change Logo' : 'Upload Logo'}
                </Button>
              </Upload>
              {contractLogo && (
                <Button
                  danger
                  size="small"
                  onClick={() => {
                    setContractLogo(null);
                    setContractLogoUrl('');
                  }}
                  className="w-full text-xs sm:text-sm"
                >
                  Remove Logo
                </Button>
              )}
            </Space>
          </Card>

<div className='mt-2'>


          <Card 
            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            title={<span className="text-white text-sm sm:text-base">Add Elements</span>}
          >
            <Space direction="vertical" className="w-full" size="small">
              {fieldTypes.map(type => (
                <Button
                  key={type.value}
                  icon={type.icon}
                  onClick={() => addElement(type.value)}
                  style={buttonStyle}
                  className="w-full justify-start text-xs sm:text-sm"
                  size="small"
                >
                  {type.label}
                </Button>
              ))}
            </Space>
          </Card>
          </div>

          <Card 
            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            title={<span className="text-white text-sm sm:text-base">Additional Documents</span>}
          >
            <Upload
              accept=".pdf"
              multiple
              onChange={handleDocumentUpload}
              fileList={additionalDocuments}
            >
              <Button icon={<UploadOutlined />} style={buttonStyle} className="w-full text-xs sm:text-sm" size="small">
                Upload PDFs
              </Button>
            </Upload>
            <p className="text-xs text-gray-400 mt-2">
              Upload additional PDF documents. They will be appended after your contract pages.
            </p>
          </Card>
        </div>

        {/* Main area - Pages */}
        <div className="lg:col-span-3">
          <Card style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <Tabs
              activeKey={currentPage.toString()}
              onChange={(key) => setCurrentPage(parseInt(key))}
              tabBarExtraContent={
                <Button
                  icon={<PlusOutlined />}
                  onClick={addPage}
                  style={buttonStyle}
                  size="small"
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Add Page</span>
                  <span className="sm:hidden">+</span>
                </Button>
              }
            >
              {contractPages.map((page, index) => (
                <TabPane
                  tab={
                    <span className="text-xs sm:text-sm">
                      {page.title}
                      {contractPages.length > 1 && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            removePage(index);
                          }}
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </span>
                  }
                  key={index.toString()}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <Input
                      value={page.title}
                      onChange={(e) => {
                        const updatedPages = [...contractPages];
                        updatedPages[index].title = e.target.value;
                        setContractPages(updatedPages);
                      }}
                      placeholder="Page title"
                      style={inputStyle}
                      className="mb-3 sm:mb-4"
                    />

                    {page.elements.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 text-gray-400">
                        <FileTextOutlined style={{ fontSize: 36, marginBottom: 12 }} className="sm:text-5xl" />
                        <p className="text-sm sm:text-base">No elements added yet.</p>
                        <p className="text-xs sm:text-sm">Use the sidebar to add fields and content.</p>
                      </div>
                    ) : (
                      page.elements.map(element => renderBuilderElement(element))
                    )}
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        title={<span className="text-sm sm:text-base">Contract Preview</span>}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width="95%"
        style={{ top: 10, maxWidth: '1200px' }}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)} size="small">
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            onClick={() => window.print()}
            style={saveButtonStyle}
            size="small"
          >
            Print
          </Button>
        ]}
      >
        <div style={{ maxHeight: '75vh', overflow: 'auto' }} className="bg-gray-100 p-2 sm:p-4">
          {renderPreview()}
        </div>
      </Modal>
    </div>
  );
};

export default ContractBuilder;