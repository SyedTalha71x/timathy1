import React, { useState } from 'react';
import {
  TextIcon, FileTextIcon, CheckSquareIcon, SignatureIcon,
  TypeIcon, MinusIcon, ImageIcon, DatabaseIcon,
  TrashIcon, CopyIcon, MoveIcon
} from 'lucide-react';
import { CONTENT_WIDTH_PX, CONTENT_HEIGHT_PX, clampElementBounds } from './layoutUtils';

// Helper function to clean elements
const cleanElements = (elements) => {
  if (!elements || !Array.isArray(elements)) return [];
  return elements.filter(el => el && el.id);
};

// YouTube-style Tooltip Component
const KeyboardTooltip = ({ label, shortcut, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',  // Unter dem Button statt darüber
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <span>{label}</span>
          {shortcut && (
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontFamily: 'monospace'
            }}>
              {shortcut}
            </span>
          )}
          {/* Tooltip arrow - zeigt nach OBEN */}
          <div style={{
            position: 'absolute',
            top: '-4px',  // Oben am Tooltip
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '4px solid rgba(0, 0, 0, 0.9)'  // Pfeil zeigt nach oben
          }} />
        </div>
      )}
    </div>
  );
};

export const renderElementContent = (element) => {
  if (!element.visible) return null;

  switch (element.type) {
    case 'heading':
    case 'subheading':
      const headingContent = element.content && 
        !['Heading...', 'Subheading...'].includes(element.content) 
        ? element.content 
        : (element.type === 'heading' ? 'Heading...' : 'Subheading...');
      
      return (
        <div style={{
          fontSize: `${element.fontSize || (element.type === 'heading' ? 24 : 18)}px`,
          fontFamily: element.fontFamily || 'Arial, sans-serif',
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal',
          textDecoration: element.underline ? 'underline' : 'none',
          textAlign: element.alignment || 'left',
          color: element.content && !['Heading...', 'Subheading...'].includes(element.content) 
            ? (element.color || '#000') 
            : '#9ca3af',
          width: '100%',
          height: '100%',
          paddingTop: '8px',
          lineHeight: '1.2',
          textTransform: element.capsLock ? 'uppercase' : undefined,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {headingContent}
        </div>
      );
      
    case 'text':
    case 'system-text':
      const labelColor = element.labelColor || '#111827';
      const inputColor = element.inputColor || '#374151';
      const labelFontSize = element.labelFontSize || 14;
      const inputFontSize = element.inputFontSize || 14;
      const labelFontFamily = element.labelFontFamily || 'Arial, sans-serif';
      const inputFontFamily = element.inputFontFamily || 'Arial, sans-serif';
      
      // Label formatting
      const labelBold = element.labelBold || false;
      const labelItalic = element.labelItalic || false;
      const labelUnderline = element.labelUnderline || false;
      const labelCapsLock = element.labelCapsLock || false;
      
      // Input formatting
      const inputBold = element.inputBold || false;
      const inputItalic = element.inputItalic || false;
      const inputUnderline = element.inputUnderline || false;
      const inputCapsLock = element.inputCapsLock || false;
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel
        ? element.label
        : (element.type === 'text' ? 'Variable Field (Input)...' : 'Variable Field (System)...');
      const finalLabelColor = hasCustomLabel ? labelColor : '#9ca3af';
      
      const displayText = element.variable ? `{${element.variable}}` : '';
      
      return (
        <div className="flex flex-col h-full w-full p-0">
          {element.showTitle !== false && (
            <div 
              className="mb-1"
              style={{
                fontSize: `${labelFontSize}px`,
                fontFamily: labelFontFamily,
                color: finalLabelColor,
                paddingLeft: '0px'
              }}
            >
              <span
                style={{
                  fontWeight: labelBold ? 'bold' : 'normal',
                  fontStyle: labelItalic ? 'italic' : 'normal',
                  textDecoration: labelUnderline ? 'underline' : 'none',
                  textTransform: labelCapsLock ? 'uppercase' : undefined
                }}
              >
                {labelText}
              </span>
              {element.required && element.type !== 'system-text' && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </div>
          )}
          {element.showTitle === false && element.required && element.type !== 'system-text' && (
            <div className="text-right mb-1">
              <span className="text-red-500 text-sm">*</span>
            </div>
          )}
          <div className="w-full h-full border border-gray-300 rounded bg-gray-50 flex-grow flex items-center" style={{ paddingLeft: '8px', paddingRight: '12px' }}>
            <span 
              style={{
                fontSize: `${inputFontSize}px`,
                fontFamily: inputFontFamily,
                fontWeight: inputBold ? 'bold' : 'normal',
                fontStyle: inputItalic ? 'italic' : 'normal',
                textDecoration: inputUnderline ? 'underline' : 'none',
                color: element.variable ? inputColor : '#9ca3af',
                textAlign: 'left',
                textTransform: inputCapsLock ? 'uppercase' : undefined
              }}
            >
              {displayText || '...'}
            </span>
          </div>
        </div>
      );
      
    case 'textarea':
      const isPlaceholder = !element.content || element.content === 'Paragraph...';
      const textareaContent = !isPlaceholder 
        ? element.content 
        : 'Paragraph...';
      
      let listStyle = 'none';
      let paddingLeft = '0';
      
      if (element.listStyle === 'bullet') {
        listStyle = 'disc';
        paddingLeft = '20px';
      } else if (element.listStyle === 'number') {
        listStyle = 'decimal';
        paddingLeft = '20px';
      }

      const isList = element.listStyle !== 'none';
      const textAlign = element.alignment || 'left';
      
      const renderListContent = () => {
        if (isPlaceholder) {
          return 'Paragraph...';
        }
        
        const lines = element.content.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
          return 'Paragraph...';
        }
        
        if (textAlign !== 'left' && isList) {
          return (
            <div style={{ width: '100%', textAlign: 'left' }}>
              {lines.map((line, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: textAlign === 'center' ? 'center' : 'flex-end',
                    marginBottom: '0.5em',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: '100%' }}>
                    <span style={{ marginRight: '8px', flexShrink: 0, display: 'inline-block', minWidth: '20px', textAlign: 'center' }}>
                      {element.listStyle === 'bullet' ? '•' : `${index + 1}.`}
                    </span>
                    <span style={{ flex: 1 }}>{line.trim()}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        
        if (textAlign === 'left' && isList) {
          if (element.listStyle === 'bullet') {
            return (
              <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>
                {lines.map((line, index) => (
                  <li key={index} style={{ marginBottom: '0.5em' }}>{line.trim()}</li>
                ))}
              </ul>
            );
          } else if (element.listStyle === 'number') {
            return (
              <ol style={{ margin: 0, paddingLeft: '24px', listStyleType: 'decimal' }}>
                {lines.map((line, index) => (
                  <li key={index} style={{ marginBottom: '0.5em' }}>{line.trim()}</li>
                ))}
              </ol>
            );
          }
        }
        
        return lines.map((line, index) => (
          <div 
            key={index} 
            style={{ marginBottom: '0.5em', display: 'block', textAlign: textAlign }}
          >
            {line.trim()}
          </div>
        ));
      };

      const renderPlainContent = () => {
        if (isPlaceholder) {
          return 'Paragraph...';
        }
        
        const lines = element.content.split('\n');
        return lines.map((line, index) => (
          <div key={index} style={{ textAlign: textAlign }}>
            {line}
            {index < lines.length - 1 && <br />}
          </div>
        ));
      };

      const baseStyles = {
        fontSize: `${element.fontSize || 14}px`,
        fontFamily: element.fontFamily || 'Arial, sans-serif',
        fontWeight: element.bold ? 'bold' : 'normal',
        fontStyle: element.italic ? 'italic' : 'normal',
        textDecoration: element.underline ? 'underline' : 'none',
        textDecorationStyle: element.underline ? 'solid' : 'none',
        textDecorationColor: element.underline ? (element.color || '#000') : 'transparent',
        lineHeight: element.lineHeight || 1.5,
        color: isPlaceholder ? '#9ca3af' : (element.color || '#000'),
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        textAlign: element.alignment || 'left',
        textTransform: element.capsLock ? 'uppercase' : undefined
      };

      if (isList) {
        return (
          <div style={baseStyles}>
            {renderListContent()}
          </div>
        );
      }

      return (
        <div style={baseStyles}>
          {renderPlainContent()}
        </div>
      );
      
    case 'checkbox':
      const checkboxLabel = element.label && element.label !== 'Checkbox Title...'
        ? element.label
        : 'Checkbox Title...';
      
      const checkboxDescription = element.showDescription && element.description && element.description !== 'Description...'
        ? element.description
        : (element.showDescription ? 'Description...' : null);
      
      const checkboxTitleFontFamily = element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif';
      const checkboxDescriptionFontFamily = element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif';
      const checkboxLabelSize = element.checkboxLabelSize || 16;
      const checkboxDescriptionSize = element.checkboxDescriptionSize || 14;
      
      // Title formatting
      const titleBold = element.titleBold || false;
      const titleItalic = element.titleItalic || false;
      const titleUnderline = element.titleUnderline || false;
      const titleColor = element.titleColor || '#000000';
      const titleCapsLock = element.titleCapsLock || false;
      
      // Description formatting
      const descriptionBold = element.descriptionBold || false;
      const descriptionItalic = element.descriptionItalic || false;
      const descriptionUnderline = element.descriptionUnderline || false;
      const descriptionColor = element.descriptionColor || '#374151';
      const descriptionCapsLock = element.descriptionCapsLock || false;
      
      return (
        <div className="flex flex-col w-full min-h-full">
          <div className="flex items-start gap-2 p-2">
            <input type="checkbox" disabled className="w-4 h-4 mt-1 flex-shrink-0" />
            <div className="flex-1">
              {element.showTitle !== false && (
                <div 
                  className={`${element.label && element.label !== 'Checkbox Title...' ? '' : 'text-gray-400'}`}
                  style={{
                    fontFamily: checkboxTitleFontFamily,
                    fontSize: `${checkboxLabelSize}px`,
                    color: element.label && element.label !== 'Checkbox Title...' ? titleColor : '#9ca3af'
                  }}
                >
                  <span
                    style={{
                      fontWeight: titleBold ? 'bold' : 'normal',
                      fontStyle: titleItalic ? 'italic' : 'normal',
                      textDecoration: titleUnderline ? 'underline' : 'none',
                      textTransform: titleCapsLock ? 'uppercase' : undefined
                    }}
                  >
                    {checkboxLabel}
                  </span>
                  {element.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </div>
              )}
              {/* Required Asterisk auch anzeigen wenn Titel deaktiviert ist */}
              {element.showTitle === false && element.required && (
                <span className="text-red-500 text-sm">*</span>
              )}
            </div>
          </div>
          {checkboxDescription && (
            <div 
              className={`${element.description && element.description !== 'Description...' ? '' : 'text-gray-400'} px-2 pb-2`}
              style={{
                fontFamily: checkboxDescriptionFontFamily,
                fontSize: `${checkboxDescriptionSize}px`,
                fontWeight: descriptionBold ? 'bold' : 'normal',
                fontStyle: descriptionItalic ? 'italic' : 'normal',
                textDecoration: descriptionUnderline ? 'underline' : 'none',
                color: element.description && element.description !== 'Description...' ? descriptionColor : '#9ca3af',
                whiteSpace: 'pre-wrap',
                textTransform: descriptionCapsLock ? 'uppercase' : undefined
              }}
            >
              {checkboxDescription}
            </div>
          )}
        </div>
      );
      
    case 'signature':
      // Get current date dynamically with format support
      const today = new Date();
      const dateFormat = element.dateFormat || 'de-DE';
      
      let currentDate;
      if (dateFormat === 'iso') {
        currentDate = today.toISOString().split('T')[0];
      } else {
        // Standard formats (de-DE, en-US, en-GB)
        currentDate = today.toLocaleDateString(dateFormat, { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        });
      }
      
      // Build location/date text based on settings
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
        ? element.belowSignatureText
        : 'Location, Date/Signature...';
      
      // Separate font families with fallback to signatureFontFamily
      const locationFontFamily = element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif';
      const belowTextFontFamily = element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif';
      const signatureFontSize = element.signatureFontSize || 14;
      
      // Location text formatting
      const locationBold = element.locationBold || false;
      const locationItalic = element.locationItalic || false;
      const locationUnderline = element.locationUnderline || false;
      const locationColor = element.locationColor || '#374151';
      const locationCapsLock = element.locationCapsLock || false;
      
      // Below text formatting
      const belowTextBold = element.belowTextBold || false;
      const belowTextItalic = element.belowTextItalic || false;
      const belowTextUnderline = element.belowTextUnderline || false;
      const belowTextColor = element.belowTextColor || '#374151';
      const belowTextFontSize = element.belowTextFontSize || 14;
      const belowTextCapsLock = element.belowTextCapsLock || false;
      
      return (
        <div className="flex flex-col items-start justify-start h-full w-full p-2 relative">
          {element.showLocationDate !== false && locationDateText && (
            <div 
              className="text-left"
              style={{
                fontFamily: locationFontFamily,
                fontSize: `${signatureFontSize}px`,
                color: locationColor,
                marginBottom: '8px'
              }}
            >
              <span
                style={{
                  fontWeight: locationBold ? 'bold' : 'normal',
                  fontStyle: locationItalic ? 'italic' : 'normal',
                  textDecoration: locationUnderline ? 'underline' : 'none',
                  textTransform: locationCapsLock ? 'uppercase' : undefined
                }}
              >
                {locationDateText}
              </span>
              {element.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </div>
          )}
          {((element.showLocationDate === false && element.required) || (element.showLocationDate !== false && !locationDateText && element.required)) && (
            <div className="text-right w-full" style={{ marginBottom: '8px' }}>
              <span className="text-red-500 text-sm">*</span>
            </div>
          )}
          <div className="w-full border-t-2 border-gray-400">
          </div>
          {element.showBelowSignature !== false && (
            <div 
              className="text-left"
              style={{
                fontFamily: belowTextFontFamily,
                fontSize: `${belowTextFontSize}px`,
                fontWeight: belowTextBold ? 'bold' : 'normal',
                fontStyle: belowTextItalic ? 'italic' : 'normal',
                textDecoration: belowTextUnderline ? 'underline' : 'none',
                color: element.belowSignatureText && element.belowSignatureText !== 'Location, Date/Signature...' ? belowTextColor : '#9ca3af',
                textTransform: belowTextCapsLock ? 'uppercase' : undefined,
                marginTop: '4px'
              }}
            >
              {signatureBelowText}
            </div>
          )}
        </div>
      );
      
    case 'image':
      if (element.src) {
        const cropLeft = element.cropLeft || 0;
        const cropTop = element.cropTop || 0;
        const cropRight = element.cropRight || 0;
        const cropBottom = element.cropBottom || 0;
        
        const hasCrop = cropLeft > 0 || cropTop > 0 || cropRight > 0 || cropBottom > 0;
        
        if (!hasCrop) {
          return (
            <div 
              className="w-full h-full bg-transparent overflow-hidden relative"
              style={{
                backgroundImage: `url(${element.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          );
        }
        
        // Calculate the visible area percentage based on crop values
        const visibleWidthPercent = (100 - cropLeft - cropRight) / 100;
        const visibleHeightPercent = (100 - cropTop - cropBottom) / 100;
        
        // Scale the full image size based on current element dimensions
        // element.width/height represents the visible (cropped) area
        // We calculate what the full image size should be at the current scale
        const scaledFullImageWidth = element.width / visibleWidthPercent;
        const scaledFullImageHeight = element.height / visibleHeightPercent;
        
        // Calculate offsets using the scaled full image dimensions
        const leftOffset = -(cropLeft / 100) * scaledFullImageWidth;
        const topOffset = -(cropTop / 100) * scaledFullImageHeight;
        
        return (
          <div 
            className="w-full h-full relative"
            style={{
              overflow: 'hidden',
              backgroundColor: 'transparent'
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: `${leftOffset}px`,
                top: `${topOffset}px`,
                width: `${scaledFullImageWidth}px`,
                height: `${scaledFullImageHeight}px`,
                backgroundImage: `url(${element.src})`,
                backgroundSize: '100% 100%',
                backgroundPosition: '0 0',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center h-full w-full p-2">
          <div className="text-gray-400 text-center p-4 border-2 border-dashed border-gray-300 rounded-lg w-full h-full flex flex-col items-center justify-center">
            <ImageIcon size={24} className="mx-auto mb-2 text-gray-300" />
            <span className="text-xs">Insert image here</span>
            {element.fileName && (
              <span className="text-xs mt-1 text-gray-500">
                Last file: {element.fileName}
              </span>
            )}
          </div>
        </div>
      );
      
    case 'divider':
      let borderStyle = 'solid';
      switch(element.lineStyle) {
        case 'dashed':
          borderStyle = 'dashed';
          break;
        case 'dotted':
          borderStyle = 'dotted';
          break;
        default:
          borderStyle = 'solid';
      }
      
      return (
        <div 
          className="w-full h-full" 
          style={{ 
            height: `${element.height}px`,
            borderBottom: `${element.height}px ${borderStyle} ${element.lineColor || '#000000'}`,
            backgroundColor: 'transparent'
          }} 
        />
      );

    case 'rectangle':
      let rectBorderStyle = 'solid';
      switch(element.lineStyle) {
        case 'dashed':
          rectBorderStyle = 'dashed';
          break;
        case 'dotted':
          rectBorderStyle = 'dotted';
          break;
        default:
          rectBorderStyle = 'solid';
      }
      
      return (
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundColor: element.backgroundColor || '#f3f4f6',
            border: element.borderWidth > 0 
              ? `${element.borderWidth}px ${rectBorderStyle} ${element.borderColor || '#000000'}` 
              : 'none',
            borderRadius: `${element.borderRadius || 0}px`
          }} 
        />
      );

    case 'circle':
      let circleBorderStyle = 'solid';
      switch(element.lineStyle) {
        case 'dashed':
          circleBorderStyle = 'dashed';
          break;
        case 'dotted':
          circleBorderStyle = 'dotted';
          break;
        default:
          circleBorderStyle = 'solid';
      }
      
      return (
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundColor: element.backgroundColor || '#f3f4f6',
            border: element.borderWidth > 0 
              ? `${element.borderWidth}px ${circleBorderStyle} ${element.borderColor || '#000000'}` 
              : 'none',
            borderRadius: '50%'
          }} 
        />
      );

    case 'triangle':
      let triangleBorderStyle = element.lineStyle || 'solid';
      const triangleBorderWidth = element.borderWidth || 0;
      const triangleBorderColor = element.borderColor || '#000000';
      const triangleBackgroundColor = element.backgroundColor || '#f3f4f6';
      
      return (
        <svg 
          viewBox="0 0 100 100" 
          width="100%" 
          height="100%" 
          preserveAspectRatio="none"
          style={{ 
            overflow: 'visible'
          }}
        >
          <polygon 
            points="50,5 95,95 5,95" 
            fill={triangleBackgroundColor}
            stroke={triangleBorderWidth > 0 ? triangleBorderColor : 'none'}
            strokeWidth={triangleBorderWidth}
            strokeDasharray={triangleBorderStyle === 'dashed' ? '5,5' : triangleBorderStyle === 'dotted' ? '2,2' : '0'}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'semicircle':
      let semicircleBorderStyle = element.lineStyle || 'solid';
      const semicircleBorderWidth = element.borderWidth || 0;
      const semicircleBorderColor = element.borderColor || '#000000';
      const semicircleBackgroundColor = element.backgroundColor || '#f3f4f6';
      
      return (
        <svg 
          viewBox="0 0 100 50" 
          width="100%" 
          height="100%" 
          preserveAspectRatio="none"
          style={{ 
            overflow: 'visible'
          }}
        >
          <path 
            d="M 0 50 A 50 50 0 0 1 100 50 Z" 
            fill={semicircleBackgroundColor}
            stroke={semicircleBorderWidth > 0 ? semicircleBorderColor : 'none'}
            strokeWidth={semicircleBorderWidth}
            strokeDasharray={semicircleBorderStyle === 'dashed' ? '5,5' : semicircleBorderStyle === 'dotted' ? '2,2' : '0'}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'arrow':
      let arrowBorderStyle = element.lineStyle || 'solid';
      const arrowBorderWidth = element.borderWidth || 0;
      const arrowBorderColor = element.borderColor || '#000000';
      const arrowBackgroundColor = element.backgroundColor || '#f3f4f6';
      
      return (
        <svg 
          viewBox="0 0 100 50" 
          width="100%" 
          height="100%" 
          preserveAspectRatio="none"
          style={{ 
            overflow: 'visible'
          }}
        >
          <path 
            d="M 5 15 L 65 15 L 65 5 L 95 25 L 65 45 L 65 35 L 5 35 Z" 
            fill={arrowBackgroundColor}
            stroke={arrowBorderWidth > 0 ? arrowBorderColor : 'none'}
            strokeWidth={arrowBorderWidth}
            strokeDasharray={arrowBorderStyle === 'dashed' ? '5,5' : arrowBorderStyle === 'dotted' ? '2,2' : '0'}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    default:
      return <div className="text-gray-900">Unknown element type</div>;
  }
};
/**
 * Render builder element with functional resize handles
 */
export const renderBuilderElement = (
  element,
  selectedElement,
  setSelectedElement,
  handleDragStart,
  isDragging,
  removeElement,
  nextElementId,
  contractPages,
  currentPage,
  setContractPages,
  saveToHistory,
  folders,
  handleResizeStart = null,  // NEW: Resize handler
  isResizing = false,         // NEW: Resize state
  dynamicContentArea = null   // NEW: Dynamic content area for bounds checking
) => {
  if (!element || typeof element !== 'object' || !element.id) {
    console.warn('Attempted to render invalid element:', element);
    return null;
  }

  const isSelected = selectedElement === element.id;
  const elements = cleanElements(contractPages[currentPage]?.elements || []);
  
  let calculatedZIndex;
  
  // Calculate z-index based on sortIndex to respect layer order
  // Lower sortIndex = appears higher in layer list = higher z-index (foreground)
  // Higher sortIndex = appears lower in layer list = lower z-index (background)
  
  if (element.folderId) {
    const folder = folders.find(f => f.id === element.folderId);
    if (folder) {
      // Find max sortIndex across all folders and independent elements
      const maxSortIndex = Math.max(
        ...folders.map(f => f.sortIndex || 0),
        ...elements.filter(el => !el.folderId).map(el => el.sortIndex || 0),
        0
      );
      
      // Calculate folder's base z-index: lower sortIndex = higher z-index
      const folderSortIndex = folder.sortIndex || 0;
      const folderBaseZ = 1000 + (maxSortIndex - folderSortIndex + 1) * 100;
      
      // Within folder, elements are ordered by position in elementIds array
      // First element in elementIds = highest z-index within folder (frontmost)
      const indexInFolder = folder.elementIds.indexOf(element.id);
      const numElementsInFolder = folder.elementIds.length;
      
      // Reverse the index: first in array = highest sub-z-index
      calculatedZIndex = isSelected ? 10000 : (folderBaseZ + (numElementsInFolder - 1 - indexInFolder));
    } else {
      calculatedZIndex = isSelected ? 10000 : 1000;
    }
  } else {
    // Independent element - use sortIndex directly
    const elementSortIndex = element.sortIndex || 0;
    
    // Find max sortIndex
    const maxSortIndex = Math.max(
      ...folders.map(f => f.sortIndex || 0),
      ...elements.filter(el => !el.folderId).map(el => el.sortIndex || 0),
      0
    );
    
    // Lower sortIndex = higher z-index (foreground)
    calculatedZIndex = isSelected ? 10000 : (1000 + (maxSortIndex - elementSortIndex + 1) * 100);
  }

  const style = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    position: 'absolute',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    padding: '0',
    cursor: isDragging ? 'grabbing' : isResizing ? 'default' : 'grab',
    boxSizing: 'border-box',
    touchAction: 'none',
    zIndex: calculatedZIndex,
    display: 'flex',
    flexDirection: 'column',
    opacity: element.visible ? 1 : 0.5,
    transition: (isDragging || isResizing) ? 'none' : 'border 0.2s',
  };

  if (element.type === 'text' || element.type === 'system-text') {
    style.backgroundColor = 'transparent';
    style.padding = '0';
  }

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
      }}
    >
      {isSelected && (
        <>
          {/* Wrapper for selection border and handles - rotates with element */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 9
          }}>
            {/* Selection border */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '2px solid #3b82f6',
              borderRadius: '4px',
              pointerEvents: 'none'
            }} />
            
            {/* Resize handles - 8 points */}
            {renderResizeHandle('nw', -4, -4, 'nw-resize', element.id, handleResizeStart)}
            {renderResizeHandle('n', '50%', -4, 'n-resize', element.id, handleResizeStart, { transform: 'translateX(-50%)' })}
            {renderResizeHandle('ne', null, -4, 'ne-resize', element.id, handleResizeStart, { right: '-4px' })}
            {renderResizeHandle('w', -4, '50%', 'w-resize', element.id, handleResizeStart, { transform: 'translateY(-50%)' })}
            {renderResizeHandle('e', null, '50%', 'e-resize', element.id, handleResizeStart, { right: '-4px', transform: 'translateY(-50%)' })}
            {renderResizeHandle('sw', -4, null, 'sw-resize', element.id, handleResizeStart, { bottom: '-4px' })}
            {renderResizeHandle('s', '50%', null, 's-resize', element.id, handleResizeStart, { bottom: '-4px', transform: 'translateX(-50%)' })}
            {renderResizeHandle('se', null, null, 'se-resize', element.id, handleResizeStart, { right: '-4px', bottom: '-4px' })}
          </div>
          
          {/* Action toolbar - stays horizontal and readable, not rotated */}
          <div style={{ 
            position: 'absolute', 
            top: -36, 
            left: 0, 
            display: 'flex', 
            gap: 4, 
            background: '#3b82f6', 
            color: '#fff', 
            padding: '4px 8px', 
            borderRadius: 6, 
            zIndex: 20,
            pointerEvents: 'auto'
          }}>
            <KeyboardTooltip label="Remove" shortcut="Del">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(element.id);
                }}
                className="hover:bg-blue-600 p-1 rounded"
              >
                <TrashIcon size={14} />
              </button>
            </KeyboardTooltip>
            <KeyboardTooltip label="Copy" shortcut="C">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Erstelle neues Element mit Offset
                  let newElement = {
                    ...element,
                    id: nextElementId.current++,
                    x: element.x + 20,
                    y: element.y + 20,
                    variable: (element.type === 'text' || element.type === 'system-text') ? null : element.variable
                  };
                  
                  // Stelle sicher, dass das Element innerhalb der Grenzen bleibt
                  const contentHeight = dynamicContentArea ? dynamicContentArea.height : CONTENT_HEIGHT_PX;
                  const clampedBounds = clampElementBounds(
                    newElement,
                    CONTENT_WIDTH_PX,
                    contentHeight
                  );
                  
                  newElement = {
                    ...newElement,
                    ...clampedBounds
                  };
                  
                  const newPages = contractPages.map((page, idx) => 
                    idx === currentPage ? { ...page, elements: [newElement, ...(page.elements || [])] } : page
                  );
                  setContractPages(newPages);
                  setSelectedElement(newElement.id);
                  saveToHistory(newPages, folders, 'duplicate_element');
                }}
                className="hover:bg-blue-600 p-1 rounded"
              >
                <CopyIcon size={14} />
              </button>
            </KeyboardTooltip>
            <div className="h-4 border-l border-blue-400 mx-1"></div>
            {/* Rotation button - only for decorative elements and images */}
            {['rectangle', 'circle', 'triangle', 'semicircle', 'arrow', 'divider', 'image'].includes(element.type) && (
              <>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleResizeStart(element.id, 'rotate', e);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleResizeStart(element.id, 'rotate', e);
                  }}
                  className="hover:bg-blue-600 p-1 rounded"
                  title="Rotate"
                  style={{ cursor: 'grab' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                </button>
                <div className="h-4 border-l border-blue-400 mx-1"></div>
              </>
            )}
            <MoveIcon size={14} className="text-blue-200" />
          </div>
        </>
      )}
      
      {/* Content wrapper with overflow hidden and rotation */}
      <div style={{
        width: '100%',
        height: '100%',
        overflow: ['heading', 'subheading', 'text', 'system-text', 'textarea', 'checkbox', 'signature'].includes(element.type) 
          ? 'hidden'   // Text elements need clipping
          : 'visible', // Decorative elements (shapes, images) need visible overflow for SVG
        position: 'relative',
        transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
        transformOrigin: 'center center'
      }}>
        {renderElementContent(element)}
      </div>
    </div>
  );
};
/**
 * Helper function to render a resize handle
 */
function renderResizeHandle(handle, left, top, cursor, elementId, handleResizeStart, extraStyles = {}) {
  // If no resize handler provided, render non-functional handles
  if (!handleResizeStart) {
    return (
      <div
        key={handle}
        style={{
          position: 'absolute',
          top: top,
          left: left,
          width: '8px',
          height: '8px',
          backgroundColor: '#3b82f6',
          border: '1px solid #fff',
          borderRadius: '50%',
          cursor: cursor,
          zIndex: 11,
          ...extraStyles
        }}
        onMouseDown={(e) => e.stopPropagation()}
      />
    );
  }
  
  // Render functional resize handle
  return (
    <div
      key={handle}
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: '8px',
        height: '8px',
        backgroundColor: '#3b82f6',
        border: '1px solid #fff',
        borderRadius: '50%',
        cursor: cursor,
        zIndex: 11,
        pointerEvents: 'auto',
        ...extraStyles
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleResizeStart(elementId, handle, e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        handleResizeStart(elementId, handle, e);
      }}
    />
  );
}


