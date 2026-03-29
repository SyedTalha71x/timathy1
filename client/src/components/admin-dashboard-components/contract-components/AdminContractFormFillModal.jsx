/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
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
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"
import { pdf } from "@react-pdf/renderer"
import { DEFAULT_ADMIN_CONTRACT_FORMS, DEFAULT_ADMIN_CONTRACT_TYPES, adminPlatformData } from "../../../utils/admin-panel-states/admin-contract-states"
import { ADMIN_SYSTEM_VARIABLES, ADMIN_USER_VARIABLES } from "../../../utils/admin-panel-states/admin-contract-states"
import AdminContractPDFDocument from "../../admin-dashboard-components/contract-components/AdminContractPDFDocument"

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

// Admin: System variable to contract data mapping
const SYSTEM_VARIABLE_MAPPING = {
  'Studio ID': 'studioId',
  'Contract Start Date': 'startDate',
  'Contract End Date': 'endDate',
  'Minimum Term': 'minimumTerm',
  'Contract Type': 'contractType',
  'Contract Cost': 'contractCost',
  'Termination Notice Period': 'terminationNoticePeriod',
  'Contract Renewal Duration': 'renewalDuration',
};

// Admin: User variable to field name mapping
const USER_VARIABLE_MAPPING = {
  'Studio Name': 'studioName',
  'Owner Name': 'ownerName',
  'Street & Number': 'street',
  'ZIP Code': 'zipCode',
  'City': 'city',
  'Country': 'country',
  'Telephone Number': 'telephone',
  'Email Address': 'email',
  'Tax ID': 'taxId',
  'IBAN': 'iban',
  'BIC': 'bic',
  'Bank Name': 'bankName',
  'Creditor ID': 'creditorId',
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
        className="border border-border rounded bg-white cursor-crosshair touch-none"
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
          className="absolute top-1 right-1 p-1 bg-accent-red/20 hover:bg-accent-red/30 rounded text-accent-red"
          title={t("admin.contract.formFill.clearSignature")}
        >
          <Trash2 size={14} />
        </button>
      )}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-content-muted text-xs">
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
  bankLookupStatus,
  fieldWarnings = {},
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
                {element.required && <span className="text-accent-red ml-1">*</span>}
              </div>
            )}
            {userVariable === 'Salutation' ? (
              <CustomSelect
                name="salutation"
                value={currentValue}
                onChange={(e) => setUserValue(userVariable, e.target.value)}
                options={[
                  { value: "Mr.", label: t("admin.contract.salutation.mr") },
                  { value: "Mrs.", label: t("admin.contract.salutation.mrs") },
                  { value: "Ms.", label: t("admin.contract.salutation.ms") },
                ]}
                placeholder={t("admin.contract.formFill.selectSalutation")}
                className="flex-1 w-full !bg-white !text-black !border-border !rounded"
              />
            ) : userVariable === 'Date of Birth' ? (
              <div className="flex items-center border border-border rounded bg-white px-2" style={{ minHeight: '28px' }}>
                <span
                  className="flex-1"
                  style={{
                    fontSize: `${inputFontSize}px`,
                    fontFamily: inputFontFamily,
                    fontWeight: element.inputBold ? 'bold' : 'normal',
                    fontStyle: element.inputItalic ? 'italic' : 'normal',
                    color: currentValue ? (inputColor || '#374151') : '#9ca3af',
                  }}
                >
                  {currentValue ? new Date(currentValue + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }) : t("admin.contract.contractModal.selectDate") + '...'}
                </span>
                <DatePickerField
                  value={currentValue}
                  onChange={(val) => setUserValue(userVariable, val)}
                  iconSize={14}
                />
              </div>
            ) : userVariable === 'IBAN' ? (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase();
                  setUserValue(userVariable, val);
                }}
                placeholder={userVariable || '...'}
                className="flex-1 w-full border border-border rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  fontSize: `${inputFontSize}px`,
                  fontFamily: 'monospace',
                  fontWeight: element.inputBold ? 'bold' : 'normal',
                  fontStyle: element.inputItalic ? 'italic' : 'normal',
                  color: inputColor,
                  minHeight: '28px',
                  letterSpacing: '0.05em',
                }}
                required={element.required}
              />
            ) : (userVariable === 'BIC' || userVariable === 'Credit institution') ? (
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => setUserValue(userVariable, userVariable === 'BIC' ? e.target.value.toUpperCase() : e.target.value)}
                  placeholder={userVariable || '...'}
                  disabled={bankLookupStatus === "success"}
                  className="w-full border border-border rounded px-2 pr-7 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{
                    fontSize: `${inputFontSize}px`,
                    fontFamily: userVariable === 'BIC' ? 'monospace' : inputFontFamily,
                    fontWeight: element.inputBold ? 'bold' : 'normal',
                    fontStyle: element.inputItalic ? 'italic' : 'normal',
                    color: bankLookupStatus === "success" ? '#9ca3af' : inputColor,
                    backgroundColor: bankLookupStatus === "success" ? '#f5f5f5' : '#fff',
                    minHeight: '28px',
                    cursor: bankLookupStatus === "success" ? 'not-allowed' : undefined,
                  }}
                  required={element.required}
                />
                {bankLookupStatus === "loading" && (
                  <Loader2 size={13} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin" style={{ color: '#9ca3af' }} />
                )}
                {bankLookupStatus === "success" && (
                  <CheckCircle2 size={13} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: '#f59e0b' }} />
                )}
              </div>
            ) : (userVariable === 'Telephone number' || userVariable === 'Mobile number') ? (
              <input
                type="tel"
                value={currentValue}
                onChange={(e) => { const sanitized = e.target.value.replace(/[^0-9+]/g, ''); setUserValue(userVariable, sanitized); }}
                placeholder={userVariable === 'Mobile number' ? '+49 170 1234567' : '+49 30 12345678'}
                className="flex-1 w-full border border-border rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
            ) : userVariable === 'Email Address' ? (
              <input
                type="email"
                value={currentValue}
                onChange={(e) => setUserValue(userVariable, e.target.value)}
                placeholder="email@example.com"
                className="flex-1 w-full border border-border rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setUserValue(userVariable, e.target.value)}
                placeholder={userVariable || '...'}
                className="flex-1 w-full border border-border rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
            )}
            {/* Inline validation warning */}
            {userVariable && (() => {
              const fieldName = USER_VARIABLE_MAPPING[userVariable];
              return fieldWarnings[fieldName] ? (
                <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '1px', lineHeight: '1' }}>{fieldWarnings[fieldName]}</div>
              ) : null;
            })()}
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
              className="flex-1 w-full border border-border rounded bg-surface-dark px-2 flex items-center"
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
                className="primary-check mt-1"
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
                    {element.required && <span className="text-accent-red ml-1">*</span>}
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
      const dateFormat = element.dateFormat || i18n.language;
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
                {element.required && <span className="text-accent-red ml-1">*</span>}
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
            <div className="text-content-muted text-center p-4 border-2 border-dashed border-border rounded-lg w-full h-full flex flex-col items-center justify-center">
              <ImageIcon size={24} className="mx-auto mb-2 text-content-secondary" />
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
// MOBILE FORM ELEMENT RENDERER - Stacked, full-width form fields
// =============================================================================
const MobileFormElement = ({ 
  element, 
  formValues, 
  onValueChange, 
  systemValues,
  bankLookupStatus,
  fieldWarnings = {},
}) => {
  if (!element || element.visible === false) return null;

  const getSystemValue = (variable) => {
    const fieldName = SYSTEM_VARIABLE_MAPPING[variable];
    return systemValues?.[fieldName] || '';
  };

  const getUserValue = (variable) => {
    const fieldName = USER_VARIABLE_MAPPING[variable];
    return formValues?.[fieldName] || '';
  };

  const setUserValue = (variable, value) => {
    const fieldName = USER_VARIABLE_MAPPING[variable];
    if (fieldName && onValueChange) {
      onValueChange(fieldName, value);
    }
  };

  switch (element.type) {
    case 'heading':
    case 'subheading': {
      const content = element.content && 
        !['Heading...', 'Subheading...'].includes(element.content) 
        ? element.content : null;
      if (!content) return null;
      
      return (
        <div style={{
          fontSize: `${Math.min(element.fontSize || (element.type === 'heading' ? 24 : 18), element.type === 'heading' ? 22 : 16)}px`,
          fontFamily: element.fontFamily || 'Arial, sans-serif',
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal',
          textDecoration: element.underline ? 'underline' : 'none',
          textAlign: element.alignment || 'left',
          color: element.color || '#000',
          textTransform: element.capsLock ? 'uppercase' : undefined,
          lineHeight: '1.3',
          paddingTop: '6px',
          wordWrap: 'break-word',
        }}>
          {content}
        </div>
      );
    }

    case 'text': {
      const labelColor = element.labelColor || '#111827';
      const inputColor = element.inputColor || '#374151';
      const labelFontSize = Math.min(element.labelFontSize || 14, 14);
      const inputFontSize = Math.min(element.inputFontSize || 14, 14);
      const labelFontFamily = element.labelFontFamily || 'Arial, sans-serif';
      const inputFontFamily = element.inputFontFamily || 'Arial, sans-serif';
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel ? element.label : (element.variable || 'Field');
      const finalLabelColor = hasCustomLabel ? labelColor : '#9ca3af';
      
      const userVariable = element.variable;
      const currentValue = userVariable ? getUserValue(userVariable) : '';

      return (
        <div>
          {element.showTitle !== false && (
            <div style={{
              fontSize: `${labelFontSize}px`,
              fontFamily: labelFontFamily,
              color: finalLabelColor,
              marginBottom: '4px',
              fontWeight: element.labelBold ? 'bold' : 'normal',
              fontStyle: element.labelItalic ? 'italic' : 'normal',
              textDecoration: element.labelUnderline ? 'underline' : 'none',
              textTransform: element.labelCapsLock ? 'uppercase' : undefined,
            }}>
              {labelText}
              {element.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
            </div>
          )}
          {userVariable === 'Salutation' ? (
            <select
              value={currentValue}
              onChange={(e) => setUserValue(userVariable, e.target.value)}
              className="w-full border border-[#d1d5db] rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              style={{ fontSize: `${inputFontSize}px`, fontFamily: inputFontFamily, color: inputColor, minHeight: '32px' }}
            >
              <option value="">{t("admin.contract.salutation.select")}</option>
              <option value="Mr.">{t("admin.contract.salutation.mr")}</option>
              <option value="Mrs.">{t("admin.contract.salutation.mrs")}</option>
              <option value="Ms.">{t("admin.contract.salutation.ms")}</option>
            </select>
          ) : userVariable === 'Date of Birth' ? (
            <div className="flex items-center border border-[#d1d5db] rounded bg-white px-2" style={{ minHeight: '32px' }}>
              <span className="flex-1" style={{
                fontSize: `${inputFontSize}px`, fontFamily: inputFontFamily,
                color: currentValue ? inputColor : '#9ca3af',
              }}>
                {currentValue ? new Date(currentValue + 'T00:00').toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }) : t("admin.contract.contractModal.selectDate") + '...'}
              </span>
              <DatePickerField value={currentValue} onChange={(val) => setUserValue(userVariable, val)} iconSize={14} />
            </div>
          ) : userVariable === 'IBAN' ? (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => { const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase(); setUserValue(userVariable, val); }}
              placeholder={userVariable || '...'}
              className="w-full border border-[#d1d5db] rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              style={{ fontSize: `${inputFontSize}px`, fontFamily: 'monospace', color: inputColor, minHeight: '32px', letterSpacing: '0.05em' }}
              required={element.required}
            />
          ) : (userVariable === 'BIC' || userVariable === 'Credit institution') ? (
            <div className="relative">
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setUserValue(userVariable, userVariable === 'BIC' ? e.target.value.toUpperCase() : e.target.value)}
                placeholder={userVariable || '...'}
                disabled={bankLookupStatus === "success"}
                className="w-full border border-[#d1d5db] rounded bg-white px-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                style={{
                  fontSize: `${inputFontSize}px`, fontFamily: userVariable === 'BIC' ? 'monospace' : inputFontFamily,
                  color: bankLookupStatus === "success" ? '#9ca3af' : inputColor,
                  backgroundColor: bankLookupStatus === "success" ? '#f5f5f5' : '#fff',
                  minHeight: '32px', cursor: bankLookupStatus === "success" ? 'not-allowed' : undefined,
                }}
                required={element.required}
              />
              {bankLookupStatus === "loading" && <Loader2 size={13} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin" style={{ color: '#9ca3af' }} />}
              {bankLookupStatus === "success" && <CheckCircle2 size={13} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: '#f59e0b' }} />}
            </div>
          ) : (userVariable === 'Telephone number' || userVariable === 'Mobile number') ? (
            <input
              type="tel"
              value={currentValue}
              onChange={(e) => { const sanitized = e.target.value.replace(/[^0-9+]/g, ''); setUserValue(userVariable, sanitized); }}
              placeholder={userVariable === 'Mobile number' ? '+49 170 1234567' : '+49 30 12345678'}
              className="w-full border border-[#d1d5db] rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              style={{
                fontSize: `${inputFontSize}px`, fontFamily: inputFontFamily,
                fontWeight: element.inputBold ? 'bold' : 'normal',
                fontStyle: element.inputItalic ? 'italic' : 'normal',
                color: inputColor, minHeight: '32px',
              }}
              required={element.required}
            />
          ) : userVariable === 'Email Address' ? (
            <input
              type="email"
              value={currentValue}
              onChange={(e) => setUserValue(userVariable, e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-[#d1d5db] rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              style={{
                fontSize: `${inputFontSize}px`, fontFamily: inputFontFamily,
                fontWeight: element.inputBold ? 'bold' : 'normal',
                fontStyle: element.inputItalic ? 'italic' : 'normal',
                color: inputColor, minHeight: '32px',
              }}
              required={element.required}
            />
          ) : (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setUserValue(userVariable, e.target.value)}
              placeholder={userVariable || '...'}
              className="w-full border border-[#d1d5db] rounded bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              style={{
                fontSize: `${inputFontSize}px`, fontFamily: inputFontFamily,
                fontWeight: element.inputBold ? 'bold' : 'normal',
                fontStyle: element.inputItalic ? 'italic' : 'normal',
                color: inputColor, minHeight: '32px',
              }}
              required={element.required}
            />
          )}
          {/* Inline validation warning */}
          {userVariable && (() => {
            const fieldName = USER_VARIABLE_MAPPING[userVariable];
            return fieldWarnings[fieldName] ? (
              <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{fieldWarnings[fieldName]}</div>
            ) : null;
          })()}
        </div>
      );
    }

    case 'system-text': {
      const labelColor = element.labelColor || '#111827';
      const inputColor = element.inputColor || '#374151';
      const labelFontSize = Math.min(element.labelFontSize || 14, 14);
      const inputFontSize = Math.min(element.inputFontSize || 14, 14);
      const labelFontFamily = element.labelFontFamily || 'Arial, sans-serif';
      const inputFontFamily = element.inputFontFamily || 'Arial, sans-serif';
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel ? element.label : (element.variable || 'System Field');
      const finalLabelColor = hasCustomLabel ? labelColor : '#9ca3af';
      
      const sysVariable = element.variable;
      const displayValue = sysVariable ? getSystemValue(sysVariable) : '';

      return (
        <div>
          {element.showTitle !== false && (
            <div style={{
              fontSize: `${labelFontSize}px`, fontFamily: labelFontFamily,
              color: finalLabelColor, marginBottom: '4px',
              fontWeight: element.labelBold ? 'bold' : 'normal',
              fontStyle: element.labelItalic ? 'italic' : 'normal',
            }}>
              {labelText}
            </div>
          )}
          <div
            className="w-full border border-[#d1d5db] rounded px-2 flex items-center"
            style={{
              fontSize: `${inputFontSize}px`, fontFamily: inputFontFamily,
              fontWeight: element.inputBold ? 'bold' : 'normal',
              color: displayValue ? inputColor : '#9ca3af',
              minHeight: '32px', backgroundColor: '#f3f4f6',
            }}
          >
            {displayValue || `{${sysVariable || 'System Variable'}}`}
          </div>
        </div>
      );
    }

    case 'textarea': {
      const isPlaceholder = !element.content || element.content === 'Paragraph...';
      if (isPlaceholder) return null;
      
      return (
        <div style={{
          fontSize: `${Math.min(element.fontSize || 14, 14)}px`,
          fontFamily: element.fontFamily || 'Arial, sans-serif',
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal',
          textDecoration: element.underline ? 'underline' : 'none',
          lineHeight: element.lineHeight || 1.5,
          color: element.color || '#000',
          textAlign: element.alignment || 'left',
          textTransform: element.capsLock ? 'uppercase' : undefined,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}>
          {element.content}
        </div>
      );
    }

    case 'checkbox': {
      const checkboxId = `mobile-checkbox-${element.id}`;
      const isChecked = formValues?.[`checkbox_${element.id}`] || false;
      
      const checkboxLabel = element.label && element.label !== 'Checkbox Title...' ? element.label : null;
      const checkboxDescription = element.showDescription && element.description && element.description !== 'Description...' ? element.description : null;
      if (!checkboxLabel && !checkboxDescription) return null;

      return (
        <div className="flex items-start gap-2" style={{ padding: '4px 0' }}>
          <input 
            type="checkbox" 
            id={checkboxId}
            checked={isChecked}
            onChange={(e) => onValueChange?.(`checkbox_${element.id}`, e.target.checked)}
            className="primary-check mt-1"
            required={element.required}
          />
          <label htmlFor={checkboxId} className="flex-1 cursor-pointer">
            {element.showTitle !== false && checkboxLabel && (
              <div style={{
                fontFamily: element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif',
                fontSize: `${Math.min(element.checkboxLabelSize || 16, 15)}px`,
                color: element.titleColor || '#000',
                fontWeight: element.titleBold ? 'bold' : 'normal',
                fontStyle: element.titleItalic ? 'italic' : 'normal',
                textDecoration: element.titleUnderline ? 'underline' : 'none',
                textTransform: element.titleCapsLock ? 'uppercase' : undefined,
              }}>
                {checkboxLabel}
                {element.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
              </div>
            )}
            {checkboxDescription && (
              <div style={{
                fontFamily: element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif',
                fontSize: `${Math.min(element.checkboxDescriptionSize || 14, 13)}px`,
                fontWeight: element.descriptionBold ? 'bold' : 'normal',
                fontStyle: element.descriptionItalic ? 'italic' : 'normal',
                color: element.descriptionColor || '#374151',
                whiteSpace: 'pre-wrap',
                textTransform: element.descriptionCapsLock ? 'uppercase' : undefined,
                marginTop: '2px',
              }}>
                {checkboxDescription}
              </div>
            )}
          </label>
        </div>
      );
    }

    case 'signature': {
      const signatureValue = formValues?.[`signature_${element.id}`] || null;
      const today = new Date();
      const dateFormat = element.dateFormat || i18n.language;
      let currentDate = dateFormat === 'iso' 
        ? today.toISOString().split('T')[0] 
        : today.toLocaleDateString(dateFormat, { year: 'numeric', month: '2-digit', day: '2-digit' });
      
      let locationDateText = '';
      const showDate = element.showDate !== false;
      if (element.location && showDate) locationDateText = `${element.location}, ${currentDate}`;
      else if (element.location) locationDateText = element.location;
      else if (showDate) locationDateText = currentDate;

      const belowText = element.showBelowSignature && element.belowSignatureText && element.belowSignatureText !== 'Location, Date/Signature...'
        ? element.belowSignatureText : null;

      return (
        <div style={{ padding: '4px 0' }}>
          {element.showLocationDate !== false && locationDateText && (
            <div style={{
              fontFamily: element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif',
              fontSize: `${Math.min(element.signatureFontSize || 14, 14)}px`,
              color: element.locationColor || '#374151',
              marginBottom: '4px',
              fontWeight: element.locationBold ? 'bold' : 'normal',
            }}>
              {locationDateText}
              {element.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
            </div>
          )}
          <SignaturePad
            value={signatureValue}
            onChange={(val) => onValueChange?.(`signature_${element.id}`, val)}
            width={300}
            height={80}
          />
          {element.showBelowSignature !== false && belowText && (
            <div style={{
              fontFamily: element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif',
              fontSize: `${Math.min(element.belowTextFontSize || 14, 13)}px`,
              color: element.belowTextColor || '#374151',
              marginTop: '4px',
            }}>
              {belowText}
            </div>
          )}
        </div>
      );
    }

    case 'divider': {
      return (
        <div style={{
          borderBottom: `${element.height || 1}px ${element.lineStyle || 'solid'} ${element.lineColor || '#000'}`,
          margin: '6px 0',
        }} />
      );
    }

    case 'image': {
      if (!element.src) return null;
      return (
        <div style={{ padding: '4px 0' }}>
          <img src={element.src} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      );
    }

    case 'rectangle':
    case 'circle':
    case 'triangle':
    case 'semicircle':
    case 'arrow':
      return null;

    default:
      return null;
  }
};
export function AdminContractFormFillModal({
  isOpen,
  onClose,
  onSubmit,
  contractType,
  contractData = {},
  leadData = {},
  existingFormData = null,
}) {
  const { t, i18n } = useTranslation()
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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const containerRef = useRef(null);
  const contractPageRef = useRef(null);
  const tabsRef = useRef(null);
  const sepaFallbackRef = useRef(`SEPA-${Date.now()}`);
  const lastLookedUpIban = useRef("");
  const [bankLookupStatus, setBankLookupStatus] = useState(null); // null | "loading" | "success" | "error"
  const [fieldWarnings, setFieldWarnings] = useState({}); // { fieldName: "warning message" }

  // Validation helpers
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidPhone = (val) => /^\+?[0-9]{4,}$/.test(val.replace(/\s/g, ''));
  // Load contract form based on contract type
  useEffect(() => {
    if (contractType?.contractFormId) {
      const form = DEFAULT_ADMIN_CONTRACT_FORMS.find(
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
    accessStartDate: contractData.accessStartDate || contractData.startDate || '',
    contractType: contractType?.name || '',
    contractCost: contractType?.cost ? `\u20AC${contractType.cost}` : '',
    terminationNoticePeriod: contractType?.terminationNotice || '4 Wochen',
    renewalDuration: contractType?.renewalDuration || '12 Monate',
    contributionAdjustment: contractType?.contributionAdjustment || 'Keine',
    sepaReference: contractData.sepaReference || sepaFallbackRef.current,
  };

  // Handle value changes
  const handleValueChange = useCallback((fieldName, value) => {
    setFormValues(prev => {
      const updated = { ...prev, [fieldName]: value };
      // Reset BIC and bankName when IBAN changes
      if (fieldName === 'iban') {
        setBankLookupStatus(null);
        lastLookedUpIban.current = "";
        updated.bic = "";
        updated.bankName = "";
      }
      return updated;
    });
    setErrors(prev => prev.filter(e => e.field !== fieldName));
    
    // Inline validation for email and phone
    if (fieldName === 'email') {
      if (value && !isValidEmail(value)) {
        setFieldWarnings(prev => ({ ...prev, email: 'Invalid email format' }));
      } else {
        setFieldWarnings(prev => { const n = { ...prev }; delete n.email; return n; });
      }
    }
    if (fieldName === 'telephone' || fieldName === 'mobile') {
      if (value && !isValidPhone(value)) {
        setFieldWarnings(prev => ({ ...prev, [fieldName]: 'Invalid phone number' }));
      } else {
        setFieldWarnings(prev => { const n = { ...prev }; delete n[fieldName]; return n; });
      }
    }
  }, []);

  // Auto-fill BIC and bank name via OpenIBAN API (same logic as PaymentDetailsModal)
  useEffect(() => {
    const cleaned = (formValues.iban || '').replace(/\s/g, "").toUpperCase();

    // Only lookup when we have a plausible full IBAN and it changed
    if (cleaned.length < 15 || cleaned === lastLookedUpIban.current) {
      if (cleaned.length < 15) setBankLookupStatus(null);
      return;
    }

    setBankLookupStatus("loading");

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://openiban.com/validate/${encodeURIComponent(cleaned)}?getBIC=true&validateBankCode=true`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        lastLookedUpIban.current = cleaned;
        if (data.valid && data.bankData) {
          setFormValues(prev => ({
            ...prev,
            bic: data.bankData.bic || prev.bic,
            bankName: data.bankData.name || prev.bankName,
          }));
          setBankLookupStatus("success");
        } else {
          setFormValues(prev => ({ ...prev, bic: "", bankName: "" }));
          setBankLookupStatus("error");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Bank lookup failed:", err);
          setFormValues(prev => ({ ...prev, bic: "", bankName: "" }));
          setBankLookupStatus("error");
        }
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [formValues.iban]);

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
            // Email format validation
            if (element.variable === 'Email Address' && formValues[fieldName] && !isValidEmail(formValues[fieldName])) {
              newErrors.push({
                field: fieldName,
                message: `Please enter a valid email address`,
                pageIndex,
              });
            }
            // Phone format validation
            if ((element.variable === 'Telephone number' || element.variable === 'Mobile number') && formValues[fieldName] && !isValidPhone(formValues[fieldName])) {
              newErrors.push({
                field: fieldName,
                message: `Please enter a valid phone number`,
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
  const handlePrintConfirm = async () => {
    setShowPrintPrompt(false);
    
    // Generate PDF using @react-pdf/renderer (same as contract-management.jsx)
    if (contractForm) {
      toast.loading(t("admin.contract.formFill.preparingPrint"), { id: 'pdf-print' });
      try {
        const pdfBlob = await pdf(
          <AdminContractPDFDocument
            contractForm={contractForm}
            formValues={formValues}
            systemValues={systemValues}
          />
        ).toBlob();
        
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
              URL.revokeObjectURL(pdfUrl);
            }, 500);
          };
        }
        toast.dismiss('pdf-print');
      } catch (error) {
        toast.dismiss('pdf-print');
        toast.error(t("admin.contract.formFill.pdfPrintFailed"));
        console.error(error);
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

  // Handle save as draft (Pending status)
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
      status: 'Pending', // Draft status
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
    }
  };
  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Zoom
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  // Auto-scroll page tabs to show active tab
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.children[currentPageIndex];
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Scroll content area to top on page change
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPageIndex]);

  if (!isOpen) return null;

  // No contract form linked
  if (!contractForm) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-4">
        <div className="bg-surface-card rounded-2xl w-full max-w-md shadow-xl border border-border">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold text-content-primary">No Contract Form</h2>
            </div>
            <p className="text-content-muted mb-6">
              The contract type "{contractType?.name || 'Unknown'}" has no form linked.
            </p>
            <button onClick={onClose} className="w-full px-4 py-3 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return createPortal(
    <div className={`fixed inset-0 z-[2000] bg-black/70 sm:flex sm:items-center sm:justify-center ${
      isFullscreen ? '' : 'sm:p-4'
    }`}>
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }

        /* Force light mode inside the A4 contract document */
        .contract-doc-light {
          --color-border: #d1d5db;
          --color-surface-card: #ffffff;
          --color-surface-hover: #f3f4f6;
          --color-surface-button: #e5e7eb;
          --color-surface-button-hover: #d1d5db;
          --color-surface-dark: #f3f4f6;
          --color-content-primary: #111827;
          --color-content-secondary: #374151;
          --color-content-muted: #6b7280;
          --color-content-faint: #9ca3af;
          --color-primary: #f97316;
          --color-primary-hover: #ea580c;
          --color-accent-red: #ef4444;
          --color-secondary: #6366f1;
          color-scheme: light;
        }
        .contract-doc-light *, .contract-doc-light { color-scheme: light; }
        .contract-doc-light input:not([type="checkbox"]):not([type="radio"]),
        .contract-doc-light select,
        .contract-doc-light textarea {
          background-color: #ffffff !important;
          color: #111827 !important;
          border-color: #d1d5db !important;
        }
        .contract-doc-light input::placeholder { color: #9ca3af !important; }
        .contract-doc-light .bg-surface-dark { background-color: #f3f4f6 !important; }
        .contract-doc-light .bg-white { background-color: #ffffff !important; }
        .contract-doc-light .border-border { border-color: #d1d5db !important; }
        .contract-doc-light .text-content-muted { color: #6b7280 !important; }
        .contract-doc-light .text-content-secondary { color: #374151 !important; }
        .contract-doc-light .text-accent-red { color: #ef4444 !important; }
      `}</style>
      
      {/* Generate Contract Confirmation Prompt */}
      {showGeneratePrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2001]">
          <div className="bg-surface-card rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <FileText className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-content-primary text-lg font-semibold">{t("admin.contract.formFill.generateTitle")}</h3>
                <p className="text-content-muted text-sm">{t("admin.contract.formFill.generateSubtitle")}</p>
              </div>
            </div>
            <p className="text-content-secondary mb-6">
              {t("admin.contract.formFill.generateConfirm")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateCancel}
                className="flex-1 px-4 py-3 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleGenerateConfirm}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                {t("admin.contract.formFill.yesGenerate")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Contract Prompt */}
      {showPrintPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2001]">
          <div className="bg-surface-card rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Printer className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-content-primary text-lg font-semibold">{t("admin.contract.formFill.printTitle")}</h3>
                <p className="text-content-muted text-sm">{t("admin.contract.formFill.printSubtitle")}</p>
              </div>
            </div>
            <p className="text-content-secondary mb-6">
              {t("admin.contract.formFill.printConfirm")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePrintSkip}
                className="flex-1 px-4 py-3 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button transition-colors"
              >
                {t("admin.contract.formFill.noSkip")}
              </button>
              <button
                onClick={handlePrintConfirm}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
              >
                {t("admin.contract.formFill.yesPrint")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Prompt - Save as Draft or Discard */}
      {showExitPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2001]">
          <div className="bg-surface-card rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl border border-border relative">
            {/* X Button to continue editing */}
            <button
              onClick={() => setShowExitPrompt(false)}
              className="absolute top-4 right-4 p-2 hover:bg-surface-hover rounded-lg text-content-muted hover:text-content-primary transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-yellow-500" size={24} />
              </div>
              <div>
                <h3 className="text-content-primary text-lg font-semibold">{t("admin.contract.formFill.unsavedTitle")}</h3>
                <p className="text-content-muted text-sm">{t("admin.contract.formFill.unsavedSubtitle")}</p>
              </div>
            </div>
            <p className="text-content-secondary mb-6">
              {t("admin.contract.formFill.unsavedConfirm")}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveAsDraft}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                {t("admin.contract.formFill.saveAsDraft")}
              </button>
              <button
                onClick={handleDiscard}
                className="w-full px-4 py-3 bg-surface-button text-content-secondary rounded-xl hover:bg-surface-button transition-colors"
              >
                {t("admin.contract.formFill.discardChanges")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-surface-card flex flex-col w-full h-[100dvh] ${
        isFullscreen ? '' : 'sm:h-auto sm:max-w-6xl sm:max-h-[95vh] sm:rounded-2xl sm:shadow-xl sm:border sm:border-border'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <FileText className="text-orange-500 flex-shrink-0 hidden sm:block" size={24} />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-semibold text-content-primary truncate">{contractForm.name}</h2>
              <p className="text-xs sm:text-sm text-content-muted">
                {t("admin.contract.formFill.pageOf", { current: currentPageIndex + 1, total: totalPages })}
                {currentPage?.title && <span className="hidden sm:inline"> — {currentPage.title}</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Zoom controls - desktop only */}
            {!isMobile && (
              <div className="flex items-center gap-1 bg-surface-hover rounded-lg px-2 py-1">
                <button onClick={zoomOut} className="p-1 hover:bg-surface-button-hover rounded" title={t("admin.contract.formFill.zoomOut")}>
                  <ZoomOut size={18} className="text-content-muted" />
                </button>
                <span className="text-sm text-content-muted w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} className="p-1 hover:bg-surface-button-hover rounded" title={t("admin.contract.formFill.zoomIn")}>
                  <ZoomIn size={18} className="text-content-muted" />
                </button>
              </div>
            )}
            
            {!isMobile && (
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-surface-hover rounded-lg">
                {isFullscreen ? <Minimize2 size={20} className="text-content-muted" /> : <Maximize2 size={20} className="text-content-muted" />}
              </button>
            )}
            
            <button onClick={handleCloseAttempt} className="p-2 hover:bg-surface-hover rounded-lg">
              <X size={20} className="text-content-muted" />
            </button>
          </div>
        </div>

        {/* Page Tabs */}
        {totalPages > 1 && (
          <div ref={tabsRef} className="flex gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border-b border-border overflow-x-auto flex-shrink-0">
            {contractForm.pages.map((page, index) => {
              const pageErrors = errors.filter(e => e.pageIndex === index);
              return (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${
                    index === currentPageIndex
                      ? 'bg-orange-500 text-white'
                      : 'bg-surface-hover text-content-muted hover:bg-surface-button-hover'
                  }`}
                >
                  {page.title || t("admin.contract.formFill.page", { number: index + 1 })}
                  {pageErrors.length > 0 && (
                    <span className="w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center text-white">
                      {pageErrors.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Canvas Area / Mobile Form */}
        {isMobile ? (
          /* ===== MOBILE: Flowing contract document view ===== */
          <div 
            ref={containerRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden contract-doc-light"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <div className="bg-white mx-2 my-2 rounded-lg shadow-sm" style={{
              padding: `${Math.min(MARGIN_PX * 0.4, 24)}px`,
              fontFamily: 'Arial, sans-serif',
              color: '#000',
            }}>
              {/* Global Header on mobile */}
              {contractForm.globalHeader?.enabled && contractForm.globalHeader?.content && (
                (contractForm.globalHeader.showOnPages === 'all' || 
                 (contractForm.globalHeader.showOnPages === 'first' && currentPageIndex === 0)) && (
                  <div 
                    className="header-footer-content"
                    style={{
                      fontSize: '9px',
                      fontFamily: 'Arial, sans-serif',
                      color: '#000',
                      lineHeight: 'normal',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                    dangerouslySetInnerHTML={{ __html: contractForm.globalHeader.content }}
                  />
                )
              )}

              {/* Page title on mobile */}
              {currentPage?.title && (
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  marginBottom: '12px',
                  fontWeight: '500',
                }}>
                  {currentPage.title}
                </div>
              )}
              
              {/* Render elements sorted by Y position for natural reading order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...(currentPage?.elements || [])]
                  .filter(el => el.visible !== false)
                  .sort((a, b) => (a.y || 0) - (b.y || 0))
                  .map(element => (
                    <MobileFormElement
                      key={element.id}
                      element={element}
                      formValues={formValues}
                      onValueChange={handleValueChange}
                      systemValues={systemValues}
                      bankLookupStatus={bankLookupStatus}
                      fieldWarnings={fieldWarnings}
                    />
                  ))
                }
              </div>

              {/* Global Footer on mobile */}
              {contractForm.globalFooter?.enabled && contractForm.globalFooter?.content && (
                (contractForm.globalFooter.showOnPages === 'all' || 
                 (contractForm.globalFooter.showOnPages === 'first' && currentPageIndex === 0)) && (
                  <div 
                    className="header-footer-content"
                    style={{
                      fontSize: '9px',
                      fontFamily: 'Arial, sans-serif',
                      color: '#000',
                      lineHeight: 'normal',
                      marginTop: '16px',
                      paddingTop: '8px',
                      borderTop: '1px solid #e5e7eb',
                    }}
                    dangerouslySetInnerHTML={{ __html: contractForm.globalFooter.content }}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          /* ===== DESKTOP: A4 Canvas view ===== */
          <div 
            ref={containerRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex justify-center"
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
            {/* Wrapper to constrain scroll to actual page size */}
            <div style={{
              width: `${PAGE_WIDTH_PX * zoom}px`,
              height: `${PAGE_HEIGHT_PX * zoom + 40}px`,
              flexShrink: 0,
              position: 'relative',
            }}>
              {/* A4 Page */}
              <div
                ref={contractPageRef}
                className="bg-white shadow-2xl contract-doc-light"
                style={{
                  width: `${PAGE_WIDTH_PX}px`,
                  height: `${PAGE_HEIGHT_PX}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
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
                      bankLookupStatus={bankLookupStatus}
                      fieldWarnings={fieldWarnings}
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
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="px-3 sm:px-4 py-2 bg-accent-red/10 border-t border-accent-red/30 flex-shrink-0">
            <div className="flex items-center gap-2 text-accent-red text-xs sm:text-sm">
              <AlertCircle size={16} />
              <span>
                {t("admin.contract.formFill.fieldsAttention", { count: errors.length })}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-t border-border flex-shrink-0">
          <button onClick={handleCloseAttempt} className="px-3 sm:px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button">
            {t("common.cancel")}
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm ${
                currentPageIndex === 0 ? 'bg-surface-button text-content-faint cursor-not-allowed' : 'bg-surface-hover text-content-primary hover:bg-surface-button-hover'
              }`}
            >
              <ChevronLeft size={18} /> <span className="hidden sm:inline">{t("admin.contract.formFill.previous")}</span>
            </button>

            {currentPageIndex < totalPages - 1 ? (
              <button onClick={goToNextPage} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover">
                {t("admin.contract.formFill.next")} <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleGenerateClick} className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600">
                <Check size={18} /> <span className="hidden sm:inline">{t("admin.contract.formFill.generateContract")}</span><span className="sm:hidden">{t("admin.contract.formFill.generate")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AdminContractFormFillModal;
