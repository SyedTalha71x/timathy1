/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  FileText,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ImageIcon,
  Printer,
} from "lucide-react"
import { DEFAULT_CONTRACT_FORMS, DEFAULT_CONTRACT_TYPES, studioData } from "../../../utils/studio-states/configuration-states"
import { SYSTEM_VARIABLES, USER_VARIABLES } from "../../studio-components/configuration-components/contract-builder-components/constants/elementConstants"

// =============================================================================
// LAYOUT CONSTANTS - EXACT MATCH WITH CONTRACT BUILDER
// =============================================================================
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 20;
const MM_TO_PX = 96 / 25.4; // 3.7795275591

const PAGE_WIDTH_PX = Math.round(PAGE_WIDTH_MM * MM_TO_PX);   // ~794px
const PAGE_HEIGHT_PX = Math.round(PAGE_HEIGHT_MM * MM_TO_PX); // ~1123px
const MARGIN_PX = Math.round(PAGE_MARGIN_MM * MM_TO_PX);      // ~76px
const CONTENT_WIDTH_PX = Math.round((PAGE_WIDTH_MM - 2 * PAGE_MARGIN_MM) * MM_TO_PX);  // ~642px
const CONTENT_HEIGHT_PX = Math.round((PAGE_HEIGHT_MM - 2 * PAGE_MARGIN_MM) * MM_TO_PX); // ~971px

const HEADER_TOP_MARGIN = 20;
const FOOTER_BOTTOM_MARGIN = 20;

// System variable to contract data mapping
const SYSTEM_VARIABLE_MAPPING = {
  'Member ID': 'memberId',
  'Contract Start Date': 'startDate',
  'Contract End Date': 'endDate',
  'Minimum Term': 'minimumTerm',
  'Training Start Date': 'trainingStartDate',
  'Contract Type': 'contractType',
  'Contract Cost': 'contractCost',
  'Termination Notice Period': 'terminationNoticePeriod',
  'Contract Renewal Duration': 'renewalDuration',
  'Contribution Adjustment': 'contributionAdjustment',
  'SEPA mandate reference': 'sepaReference',
};

// User variable to field name mapping
const USER_VARIABLE_MAPPING = {
  'Salutation': 'salutation',
  'Member First Name': 'firstName',
  'Member Last Name': 'lastName',
  'Street': 'street',
  'House Number': 'houseNumber',
  'ZIP Code': 'zipCode',
  'City': 'city',
  'Telephone number': 'telephone',
  'Mobile number': 'mobile',
  'Email Address': 'email',
  'Date of Birth': 'dateOfBirth',
  'Member first name and last name (account holder)': 'accountHolder',
  'Credit institution': 'bankName',
  'IBAN': 'iban',
  'BIC': 'bic',
};

// =============================================================================
// SIGNATURE PAD COMPONENT
// =============================================================================
const SignaturePad = ({ value, onChange, width = 300, height = 80 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setIsEmpty(false);
      };
      img.src = value;
    }
  }, [width, height, value]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      onChange(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange(null);
  };

  return (
    <div className="relative" style={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded bg-white cursor-crosshair touch-none"
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {!isEmpty && (
        <button
          type="button"
          onClick={clearSignature}
          className="absolute top-1 right-1 p-1 bg-red-100 hover:bg-red-200 rounded text-red-600"
          title="Clear signature"
        >
          <Trash2 size={14} />
        </button>
      )}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-xs">
          Sign here
        </div>
      )}
    </div>
  );
};

// =============================================================================
// ELEMENT RENDERER - MATCHES CONTRACT BUILDER EXACTLY
// =============================================================================
const RenderElement = ({ 
  element, 
  formValues, 
  onValueChange, 
  systemValues,
  isPreview = false 
}) => {
  if (!element || element.visible === false) return null;

  // Get system value
  const getSystemValue = (variable) => {
    const fieldName = SYSTEM_VARIABLE_MAPPING[variable];
    return systemValues?.[fieldName] || '';
  };

  // Get user value
  const getUserValue = (variable) => {
    const fieldName = USER_VARIABLE_MAPPING[variable];
    return formValues?.[fieldName] || '';
  };

  // Set user value
  const setUserValue = (variable, value) => {
    const fieldName = USER_VARIABLE_MAPPING[variable];
    if (fieldName && onValueChange) {
      onValueChange(fieldName, value);
    }
  };

  // Base wrapper style - position element absolutely within content area
  const wrapperStyle = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    transformOrigin: 'center center',
    zIndex: element.sortIndex ? (1000 - element.sortIndex) : 1,
  };

  switch (element.type) {
    case 'heading':
    case 'subheading': {
      const content = element.content && 
        !['Heading...', 'Subheading...'].includes(element.content) 
        ? element.content 
        : (element.type === 'heading' ? 'Heading...' : 'Subheading...');
      const isPlaceholder = !element.content || ['Heading...', 'Subheading...'].includes(element.content);
      
      return (
        <div style={wrapperStyle}>
          <div style={{
            fontSize: `${element.fontSize || (element.type === 'heading' ? 24 : 18)}px`,
            fontFamily: element.fontFamily || 'Arial, sans-serif',
            fontWeight: element.bold ? 'bold' : 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
            textAlign: element.alignment || 'left',
            color: isPlaceholder ? '#9ca3af' : (element.color || '#000'),
            width: '100%',
            height: '100%',
            paddingTop: '8px',
            lineHeight: '1.2',
            textTransform: element.capsLock ? 'uppercase' : undefined,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}>
            {content}
          </div>
        </div>
      );
    }

    case 'text': {
      const labelColor = element.labelColor || '#111827';
      const inputColor = element.inputColor || '#374151';
      const labelFontSize = element.labelFontSize || 14;
      const inputFontSize = element.inputFontSize || 14;
      const labelFontFamily = element.labelFontFamily || 'Arial, sans-serif';
      const inputFontFamily = element.inputFontFamily || 'Arial, sans-serif';
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel ? element.label : 'Variable Field (Input)...';
      const finalLabelColor = hasCustomLabel ? labelColor : '#9ca3af';
      
      const userVariable = element.variable;
      const currentValue = userVariable ? getUserValue(userVariable) : '';

      return (
        <div style={wrapperStyle}>
          <div className="flex flex-col h-full w-full">
            {element.showTitle !== false && (
              <div 
                style={{
                  fontSize: `${labelFontSize}px`,
                  fontFamily: labelFontFamily,
                  color: finalLabelColor,
                  marginBottom: '4px',
                  fontWeight: element.labelBold ? 'bold' : 'normal',
                  fontStyle: element.labelItalic ? 'italic' : 'normal',
                  textDecoration: element.labelUnderline ? 'underline' : 'none',
                  textTransform: element.labelCapsLock ? 'uppercase' : undefined,
                }}
              >
                {labelText}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </div>
            )}
            <input
              type={userVariable === 'Date of Birth' ? 'date' : 'text'}
              value={currentValue}
              onChange={(e) => setUserValue(userVariable, e.target.value)}
              placeholder={userVariable || '...'}
              className="flex-1 w-full border border-gray-300 rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                fontSize: `${inputFontSize}px`,
                fontFamily: inputFontFamily,
                fontWeight: element.inputBold ? 'bold' : 'normal',
                fontStyle: element.inputItalic ? 'italic' : 'normal',
                color: inputColor,
                minHeight: '28px',
              }}
              required={element.required}
            />
          </div>
        </div>
      );
    }

    case 'system-text': {
      const labelColor = element.labelColor || '#111827';
      const inputColor = element.inputColor || '#374151';
      const labelFontSize = element.labelFontSize || 14;
      const inputFontSize = element.inputFontSize || 14;
      const labelFontFamily = element.labelFontFamily || 'Arial, sans-serif';
      const inputFontFamily = element.inputFontFamily || 'Arial, sans-serif';
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel ? element.label : 'Variable Field (System)...';
      const finalLabelColor = hasCustomLabel ? labelColor : '#9ca3af';
      
      const sysVariable = element.variable;
      const displayValue = sysVariable ? getSystemValue(sysVariable) : '';

      return (
        <div style={wrapperStyle}>
          <div className="flex flex-col h-full w-full">
            {element.showTitle !== false && (
              <div 
                style={{
                  fontSize: `${labelFontSize}px`,
                  fontFamily: labelFontFamily,
                  color: finalLabelColor,
                  marginBottom: '4px',
                  fontWeight: element.labelBold ? 'bold' : 'normal',
                  fontStyle: element.labelItalic ? 'italic' : 'normal',
                }}
              >
                {labelText}
              </div>
            )}
            <div
              className="flex-1 w-full border border-gray-300 rounded bg-gray-50 px-2 flex items-center"
              style={{
                fontSize: `${inputFontSize}px`,
                fontFamily: inputFontFamily,
                fontWeight: element.inputBold ? 'bold' : 'normal',
                color: displayValue ? inputColor : '#9ca3af',
                minHeight: '28px',
              }}
            >
              {displayValue || `{${sysVariable || 'System Variable'}}`}
            </div>
          </div>
        </div>
      );
    }

    case 'textarea': {
      const isPlaceholder = !element.content || element.content === 'Paragraph...';
      const content = !isPlaceholder ? element.content : 'Paragraph...';
      
      return (
        <div style={wrapperStyle}>
          <div style={{
            fontSize: `${element.fontSize || 14}px`,
            fontFamily: element.fontFamily || 'Arial, sans-serif',
            fontWeight: element.bold ? 'bold' : 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
            lineHeight: element.lineHeight || 1.5,
            color: isPlaceholder ? '#9ca3af' : (element.color || '#000'),
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            textAlign: element.alignment || 'left',
            textTransform: element.capsLock ? 'uppercase' : undefined,
          }}>
            {content}
          </div>
        </div>
      );
    }

    case 'checkbox': {
      const checkboxId = `checkbox-${element.id}`;
      const isChecked = formValues?.[`checkbox_${element.id}`] || false;
      
      const checkboxLabel = element.label && element.label !== 'Checkbox Title...'
        ? element.label : 'Checkbox Title...';
      const isLabelPlaceholder = !element.label || element.label === 'Checkbox Title...';
      
      const checkboxDescription = element.showDescription && element.description && element.description !== 'Description...'
        ? element.description : (element.showDescription ? 'Description...' : null);
      const isDescPlaceholder = !element.description || element.description === 'Description...';

      return (
        <div style={wrapperStyle}>
          <div className="flex flex-col w-full min-h-full">
            <div className="flex items-start gap-2 p-2">
              <input 
                type="checkbox" 
                id={checkboxId}
                checked={isChecked}
                onChange={(e) => onValueChange?.(`checkbox_${element.id}`, e.target.checked)}
                className="w-4 h-4 mt-1 flex-shrink-0 cursor-pointer"
                required={element.required}
              />
              <label htmlFor={checkboxId} className="flex-1 cursor-pointer">
                {element.showTitle !== false && (
                  <div style={{
                    fontFamily: element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif',
                    fontSize: `${element.checkboxLabelSize || 16}px`,
                    color: isLabelPlaceholder ? '#9ca3af' : (element.titleColor || '#000'),
                    fontWeight: element.titleBold ? 'bold' : 'normal',
                    fontStyle: element.titleItalic ? 'italic' : 'normal',
                    textDecoration: element.titleUnderline ? 'underline' : 'none',
                    textTransform: element.titleCapsLock ? 'uppercase' : undefined,
                  }}>
                    {checkboxLabel}
                    {element.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                )}
              </label>
            </div>
            {checkboxDescription && (
              <div 
                className="px-2 pb-2"
                style={{
                  fontFamily: element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif',
                  fontSize: `${element.checkboxDescriptionSize || 14}px`,
                  fontWeight: element.descriptionBold ? 'bold' : 'normal',
                  fontStyle: element.descriptionItalic ? 'italic' : 'normal',
                  textDecoration: element.descriptionUnderline ? 'underline' : 'none',
                  color: isDescPlaceholder ? '#9ca3af' : (element.descriptionColor || '#374151'),
                  whiteSpace: 'pre-wrap',
                  textTransform: element.descriptionCapsLock ? 'uppercase' : undefined,
                  marginLeft: '24px',
                }}
              >
                {checkboxDescription}
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'signature': {
      const signatureValue = formValues?.[`signature_${element.id}`] || null;
      
      const today = new Date();
      const dateFormat = element.dateFormat || 'de-DE';
      let currentDate;
      if (dateFormat === 'iso') {
        currentDate = today.toISOString().split('T')[0];
      } else {
        currentDate = today.toLocaleDateString(dateFormat, { year: 'numeric', month: '2-digit', day: '2-digit' });
      }
      
      let locationDateText = '';
      const showDate = element.showDate !== false;
      if (element.location && showDate) {
        locationDateText = `${element.location}, ${currentDate}`;
      } else if (element.location) {
        locationDateText = element.location;
      } else if (showDate) {
        locationDateText = currentDate;
      }

      const signatureBelowText = element.showBelowSignature && element.belowSignatureText && element.belowSignatureText !== 'Location, Date/Signature...'
        ? element.belowSignatureText : 'Location, Date/Signature...';
      const isBelowTextPlaceholder = !element.belowSignatureText || element.belowSignatureText === 'Location, Date/Signature...';

      const locationHeight = element.showLocationDate !== false && locationDateText ? 24 : 0;
      const belowTextHeight = element.showBelowSignature !== false ? 20 : 0;
      const signatureCanvasHeight = Math.max(40, element.height - locationHeight - belowTextHeight - 16);

      return (
        <div style={wrapperStyle}>
          <div className="flex flex-col items-start justify-start h-full w-full p-2">
            {element.showLocationDate !== false && locationDateText && (
              <div style={{
                fontFamily: element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif',
                fontSize: `${element.signatureFontSize || 14}px`,
                color: element.locationColor || '#374151',
                marginBottom: '4px',
                fontWeight: element.locationBold ? 'bold' : 'normal',
                fontStyle: element.locationItalic ? 'italic' : 'normal',
                textDecoration: element.locationUnderline ? 'underline' : 'none',
                textTransform: element.locationCapsLock ? 'uppercase' : undefined,
              }}>
                {locationDateText}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </div>
            )}
            
            <div className="w-full flex-1" style={{ minHeight: `${signatureCanvasHeight}px` }}>
              <SignaturePad
                value={signatureValue}
                onChange={(val) => onValueChange?.(`signature_${element.id}`, val)}
                width={element.width - 16}
                height={signatureCanvasHeight}
              />
            </div>
            
            {element.showBelowSignature !== false && (
              <div style={{
                fontFamily: element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif',
                fontSize: `${element.belowTextFontSize || 14}px`,
                fontWeight: element.belowTextBold ? 'bold' : 'normal',
                fontStyle: element.belowTextItalic ? 'italic' : 'normal',
                textDecoration: element.belowTextUnderline ? 'underline' : 'none',
                color: isBelowTextPlaceholder ? '#9ca3af' : (element.belowTextColor || '#374151'),
                textTransform: element.belowTextCapsLock ? 'uppercase' : undefined,
                marginTop: '4px',
              }}>
                {signatureBelowText}
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'image': {
      if (element.src) {
        return (
          <div style={wrapperStyle}>
            <div 
              className="w-full h-full bg-transparent overflow-hidden"
              style={{
                backgroundImage: `url(${element.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        );
      }
      return (
        <div style={wrapperStyle}>
          <div className="flex flex-col items-center justify-center h-full w-full p-2">
            <div className="text-gray-400 text-center p-4 border-2 border-dashed border-gray-300 rounded-lg w-full h-full flex flex-col items-center justify-center">
              <ImageIcon size={24} className="mx-auto mb-2 text-gray-300" />
              <span className="text-xs">Image</span>
            </div>
          </div>
        </div>
      );
    }

    case 'divider': {
      let borderStyle = element.lineStyle || 'solid';
      return (
        <div style={wrapperStyle}>
          <div 
            className="w-full" 
            style={{ 
              height: `${element.height}px`,
              borderBottom: `${element.height}px ${borderStyle} ${element.lineColor || '#000000'}`,
              backgroundColor: 'transparent',
            }} 
          />
        </div>
      );
    }

    case 'rectangle': {
      let borderStyle = element.lineStyle || 'solid';
      return (
        <div style={wrapperStyle}>
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundColor: element.backgroundColor || '#f3f4f6',
              border: element.borderWidth > 0 
                ? `${element.borderWidth}px ${borderStyle} ${element.borderColor || '#000000'}` 
                : 'none',
              borderRadius: `${element.borderRadius || 0}px`,
            }} 
          />
        </div>
      );
    }

    case 'circle': {
      let borderStyle = element.lineStyle || 'solid';
      return (
        <div style={wrapperStyle}>
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundColor: element.backgroundColor || '#f3f4f6',
              border: element.borderWidth > 0 
                ? `${element.borderWidth}px ${borderStyle} ${element.borderColor || '#000000'}` 
                : 'none',
              borderRadius: '50%',
            }} 
          />
        </div>
      );
    }

    case 'triangle': {
      return (
        <div style={wrapperStyle}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <polygon 
              points="50,5 95,95 5,95" 
              fill={element.backgroundColor || '#f3f4f6'}
              stroke={element.borderWidth > 0 ? (element.borderColor || '#000000') : 'none'}
              strokeWidth={element.borderWidth || 0}
              strokeDasharray={element.lineStyle === 'dashed' ? '5,5' : element.lineStyle === 'dotted' ? '2,2' : '0'}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      );
    }

    case 'semicircle': {
      return (
        <div style={wrapperStyle}>
          <svg viewBox="0 0 100 50" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <path 
              d="M 0 50 A 50 50 0 0 1 100 50 Z" 
              fill={element.backgroundColor || '#f3f4f6'}
              stroke={element.borderWidth > 0 ? (element.borderColor || '#000000') : 'none'}
              strokeWidth={element.borderWidth || 0}
              strokeDasharray={element.lineStyle === 'dashed' ? '5,5' : element.lineStyle === 'dotted' ? '2,2' : '0'}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      );
    }

    case 'arrow': {
      return (
        <div style={wrapperStyle}>
          <svg viewBox="0 0 100 50" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <path 
              d="M 5 15 L 65 15 L 65 5 L 95 25 L 65 45 L 65 35 L 5 35 Z" 
              fill={element.backgroundColor || '#f3f4f6'}
              stroke={element.borderWidth > 0 ? (element.borderColor || '#000000') : 'none'}
              strokeWidth={element.borderWidth || 0}
              strokeDasharray={element.lineStyle === 'dashed' ? '5,5' : element.lineStyle === 'dotted' ? '2,2' : '0'}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      );
    }

    default:
      return null;
  }
};

// =============================================================================
// MAIN MODAL COMPONENT
// =============================================================================
export function ContractFormFillModal({
  isOpen,
  onClose,
  onSubmit,
  contractType,
  contractData = {},
  leadData = {},
  existingFormData = null,
}) {
  const [contractForm, setContractForm] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [zoom, setZoom] = useState(1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // States for Generate and Print Prompts
  const [showGeneratePrompt, setShowGeneratePrompt] = useState(false);
  const [showPrintPrompt, setShowPrintPrompt] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  
  const containerRef = useRef(null);
  const contractPageRef = useRef(null);

  // Load contract form based on contract type
  useEffect(() => {
    if (contractType?.contractFormId) {
      const form = DEFAULT_CONTRACT_FORMS.find(
        f => String(f.id) === String(contractType.contractFormId)
      );
      setContractForm(form || null);
      setCurrentPageIndex(0);
    } else {
      setContractForm(null);
    }
  }, [contractType]);

  // Initialize form values
  useEffect(() => {
    const initialValues = {
      salutation: leadData.salutation || '',
      firstName: leadData.firstName || leadData.name?.split(' ')[0] || '',
      lastName: leadData.lastName || leadData.name?.split(' ').slice(1).join(' ') || '',
      street: leadData.street || '',
      houseNumber: leadData.houseNumber || '',
      zipCode: leadData.zipCode || leadData.zip || '',
      city: leadData.city || '',
      telephone: leadData.phone || leadData.phoneNumber || '',
      mobile: leadData.mobile || '',
      email: leadData.email || '',
      dateOfBirth: leadData.dateOfBirth || '',
      accountHolder: `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim(),
      bankName: leadData.bankName || '',
      iban: leadData.iban || '',
      bic: leadData.bic || '',
      ...(existingFormData || {}),
    };
    setFormValues(initialValues);
  }, [leadData, existingFormData]);

  // System values
  const systemValues = {
    memberId: contractData.memberId || contractData.id || 'TBD',
    startDate: contractData.startDate || new Date().toISOString().split('T')[0],
    endDate: contractData.endDate || '',
    minimumTerm: contractType?.duration ? `${contractType.duration} Monate` : '',
    trainingStartDate: contractData.trainingStartDate || contractData.startDate || '',
    contractType: contractType?.name || '',
    contractCost: contractType?.cost ? `€${contractType.cost}` : '',
    terminationNoticePeriod: contractType?.terminationNotice || '4 Wochen',
    renewalDuration: contractType?.renewalDuration || '12 Monate',
    contributionAdjustment: contractType?.contributionAdjustment || 'Keine',
    sepaReference: contractData.sepaReference || `SEPA-${Date.now()}`,
  };

  // Handle value changes
  const handleValueChange = useCallback((fieldName, value) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
    setErrors(prev => prev.filter(e => e.field !== fieldName));
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = [];
    if (!contractForm?.pages) return true;

    contractForm.pages.forEach((page, pageIndex) => {
      (page.elements || []).forEach(element => {
        if (element.required && element.visible !== false) {
          if (element.type === 'text') {
            const fieldName = USER_VARIABLE_MAPPING[element.variable];
            if (fieldName && !formValues[fieldName]) {
              newErrors.push({
                field: fieldName,
                message: `${element.label || element.variable} is required`,
                pageIndex,
              });
            }
          } else if (element.type === 'checkbox') {
            if (!formValues[`checkbox_${element.id}`]) {
              newErrors.push({
                field: `checkbox_${element.id}`,
                message: `${element.label || 'Checkbox'} must be checked`,
                pageIndex,
              });
            }
          } else if (element.type === 'signature') {
            if (!formValues[`signature_${element.id}`]) {
              newErrors.push({
                field: `signature_${element.id}`,
                message: `Signature is required`,
                pageIndex,
              });
            }
          }
        }
      });
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle "Generate Contract" button click - shows confirmation prompt
  const handleGenerateClick = () => {
    if (validateForm()) {
      setShowGeneratePrompt(true);
    } else if (errors.length > 0) {
      setCurrentPageIndex(errors[0].pageIndex);
    }
  };

  // Handle generate confirmation - user clicked "Yes"
  const handleGenerateConfirm = () => {
    setShowGeneratePrompt(false);
    setShowPrintPrompt(true);
  };

  // Handle generate cancel - user clicked "No"
  const handleGenerateCancel = () => {
    setShowGeneratePrompt(false);
  };

  // Handle print confirmation - user wants to print
  const handlePrintConfirm = () => {
    setShowPrintPrompt(false);
    
    // Try to print the contract
    if (contractPageRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Contract - ${formValues.firstName} ${formValues.lastName}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${contractPageRef.current.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
    
    // Submit the contract data with contractForm for PDF generation
    onSubmit({
      formValues,
      systemValues,
      contractFormId: contractForm?.id,
      contractFormName: contractForm?.name,
      contractFormData: contractForm, // Store the full contract form structure for PDF generation
      completedAt: new Date().toISOString(),
      shouldPrint: true,
      status: 'Active',
    });
  };

  // Handle print skip - user doesn't want to print
  const handlePrintSkip = () => {
    setShowPrintPrompt(false);
    
    // Submit the contract data without printing
    onSubmit({
      formValues,
      systemValues,
      contractFormId: contractForm?.id,
      contractFormName: contractForm?.name,
      contractFormData: contractForm, // Store the full contract form structure for PDF generation
      completedAt: new Date().toISOString(),
      shouldPrint: false,
      status: 'Active',
    });
  };

  // Handle close attempt - show exit prompt if there's unsaved data
  const handleCloseAttempt = () => {
    // Check if any form data has been entered
    const hasData = Object.values(formValues).some(val => val && val !== '');
    if (hasData) {
      setShowExitPrompt(true);
    } else {
      onClose();
    }
  };

  // Handle save as draft (Ongoing status)
  const handleSaveAsDraft = () => {
    setShowExitPrompt(false);
    onSubmit({
      formValues,
      systemValues,
      contractFormId: contractForm?.id,
      contractFormName: contractForm?.name,
      contractFormData: contractForm, // Store the full contract form structure for PDF generation
      completedAt: null, // Not completed yet
      shouldPrint: false,
      status: 'Ongoing', // Draft status
      isDraft: true,
    });
  };

  // Handle discard draft
  const handleDiscard = () => {
    setShowExitPrompt(false);
    onClose();
  };

  // Get current page
  const currentPage = contractForm?.pages?.[currentPageIndex];
  const totalPages = contractForm?.pages?.length || 0;

  // Sort elements by sortIndex
  const sortedElements = [...(currentPage?.elements || [])].sort((a, b) => {
    const sortA = a.sortIndex ?? 0;
    const sortB = b.sortIndex ?? 0;
    return sortB - sortA;
  });

  // Navigation
  const goToNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Zoom
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  if (!isOpen) return null;

  // No contract form linked
  if (!contractForm) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-xl border border-gray-800">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold text-white">No Contract Form</h2>
            </div>
            <p className="text-gray-400 mb-6">
              The contract type "{contractType?.name || 'Unknown'}" has no form linked.
            </p>
            <button onClick={onClose} className="w-full px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      
      {/* Generate Contract Confirmation Prompt */}
      {showGeneratePrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <FileText className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Generate Contract</h3>
                <p className="text-gray-400 text-sm">Confirm contract generation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to generate this contract? The contract will be created with all the information you have entered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateCancel}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateConfirm}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                Yes, Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Contract Prompt */}
      {showPrintPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Printer className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Print Contract</h3>
                <p className="text-gray-400 text-sm">Would you like to print?</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Would you like to print the contract now? You can also print it later from the contract management.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePrintSkip}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                No, Skip
              </button>
              <button
                onClick={handlePrintConfirm}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Yes, Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Prompt - Save as Draft or Discard */}
      {showExitPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl border border-gray-800 relative">
            {/* X Button to continue editing */}
            <button
              onClick={() => setShowExitPrompt(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-yellow-500" size={24} />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Unsaved Changes</h3>
                <p className="text-gray-400 text-sm">What would you like to do?</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              You have unsaved changes in this contract form. Would you like to save it as a draft (Ongoing) to continue later, or discard all changes?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveAsDraft}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                Save as Draft (Ongoing)
              </button>
              <button
                onClick={handleDiscard}
                className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 flex flex-col ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[95vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="text-orange-500" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-white">{contractForm.name}</h2>
              <p className="text-sm text-gray-400">
                Page {currentPageIndex + 1} of {totalPages}
                {currentPage?.title && ` - ${currentPage.title}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-lg px-2 py-1">
              <button onClick={zoomOut} className="p-1 hover:bg-[#3a3a3a] rounded" title="Zoom out">
                <ZoomOut size={18} className="text-gray-400" />
              </button>
              <span className="text-sm text-gray-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} className="p-1 hover:bg-[#3a3a3a] rounded" title="Zoom in">
                <ZoomIn size={18} className="text-gray-400" />
              </button>
            </div>
            
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-[#2a2a2a] rounded-lg">
              {isFullscreen ? <Minimize2 size={20} className="text-gray-400" /> : <Maximize2 size={20} className="text-gray-400" />}
            </button>
            
            <button onClick={handleCloseAttempt} className="p-2 hover:bg-[#2a2a2a] rounded-lg">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Page Tabs */}
        {totalPages > 1 && (
          <div className="flex gap-2 px-4 py-2 border-b border-gray-800 overflow-x-auto flex-shrink-0">
            {contractForm.pages.map((page, index) => {
              const pageErrors = errors.filter(e => e.pageIndex === index);
              return (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                    index === currentPageIndex
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                  }`}
                >
                  {page.title || `Page ${index + 1}`}
                  {pageErrors.length > 0 && (
                    <span className="w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {pageErrors.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto flex justify-center"
          style={{ 
            backgroundColor: '#2a2a2a',
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%),
              linear-gradient(-45deg, #333 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #333 75%),
              linear-gradient(-45deg, transparent 75%, #333 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            padding: '20px',
          }}
        >
          {/* A4 Page */}
          <div
            ref={contractPageRef}
            className="bg-white shadow-2xl"
            style={{
              width: `${PAGE_WIDTH_PX}px`,
              height: `${PAGE_HEIGHT_PX}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Global Header */}
            {contractForm.globalHeader?.enabled && contractForm.globalHeader?.content && (
              (contractForm.globalHeader.showOnPages === 'all' || 
               (contractForm.globalHeader.showOnPages === 'first' && currentPageIndex === 0)) && (
                <div 
                  className="header-footer-content"
                  style={{
                    position: 'absolute',
                    top: `${HEADER_TOP_MARGIN}px`,
                    left: `${MARGIN_PX}px`,
                    width: `${CONTENT_WIDTH_PX}px`,
                    fontSize: '10px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#000',
                    lineHeight: 'normal',
                    zIndex: 1,
                  }}
                  dangerouslySetInnerHTML={{ __html: contractForm.globalHeader.content }}
                />
              )
            )}
            
            {/* Content Area */}
            <div
              style={{
                position: 'absolute',
                top: `${MARGIN_PX}px`,
                left: `${MARGIN_PX}px`,
                width: `${CONTENT_WIDTH_PX}px`,
                height: `${CONTENT_HEIGHT_PX}px`,
                border: 'none',
                backgroundColor: 'transparent',
                overflow: 'visible',
                zIndex: 2,
              }}
            >
              {sortedElements.map(element => (
                <RenderElement
                  key={element.id}
                  element={element}
                  formValues={formValues}
                  onValueChange={handleValueChange}
                  systemValues={systemValues}
                />
              ))}
            </div>
            
            {/* Global Footer */}
            {contractForm.globalFooter?.enabled && contractForm.globalFooter?.content && (
              (contractForm.globalFooter.showOnPages === 'all' || 
               (contractForm.globalFooter.showOnPages === 'first' && currentPageIndex === 0)) && (
                <div 
                  className="header-footer-content"
                  style={{
                    position: 'absolute',
                    bottom: `${FOOTER_BOTTOM_MARGIN}px`,
                    left: `${MARGIN_PX}px`,
                    width: `${CONTENT_WIDTH_PX}px`,
                    fontSize: '10px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#000',
                    lineHeight: 'normal',
                    zIndex: 1,
                  }}
                  dangerouslySetInnerHTML={{ __html: contractForm.globalFooter.content }}
                />
              )
            )}
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="px-4 py-2 bg-red-900/30 border-t border-red-800 flex-shrink-0">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>
                {errors.length} required field{errors.length > 1 ? 's' : ''} missing
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800 flex-shrink-0">
          <button onClick={handleCloseAttempt} className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700">
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                currentPageIndex === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            {currentPageIndex < totalPages - 1 ? (
              <button onClick={goToNextPage} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleGenerateClick} className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
                <Check size={18} /> Generate Contract
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractFormFillModal;
