/* eslint-disable react/prop-types */
/**
 * ContractPDFDocument - Generates exact PDF replica of contract forms
 * Uses @react-pdf/renderer for high-quality client-side PDF generation
 * 
 * Installation: npm install @react-pdf/renderer
 */
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Line,
  Rect,
  Circle as SvgCircle,
  Polygon,
} from '@react-pdf/renderer';

// =============================================================================
// LAYOUT CONSTANTS - EXACT MATCH WITH CONTRACT BUILDER
// =============================================================================
const PAGE_WIDTH_PT = 595.28; // A4 width in points (210mm)
const PAGE_HEIGHT_PT = 841.89; // A4 height in points (297mm)
const MARGIN_PT = 56.69; // 20mm in points
const CONTENT_WIDTH_PT = 481.89; // (210mm - 40mm) in points
const CONTENT_HEIGHT_PT = 728.5; // (297mm - 40mm) in points

// Conversion factor: pixels to points (assuming 96 DPI for web)
const PX_TO_PT = 0.75;

// Header/Footer margins in points
const HEADER_TOP_MARGIN_PT = 15;
const FOOTER_BOTTOM_MARGIN_PT = 15;

// =============================================================================
// VARIABLE MAPPINGS (same as ContractFormFillModal)
// =============================================================================
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
  'SEPA Reference': 'sepaReference',
};

const USER_VARIABLE_MAPPING = {
  'Salutation': 'salutation',
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Street': 'street',
  'House Number': 'houseNumber',
  'ZIP Code': 'zipCode',
  'City': 'city',
  'Telephone': 'telephone',
  'Mobile': 'mobile',
  'Email': 'email',
  'Date of Birth': 'dateOfBirth',
  'Account Holder': 'accountHolder',
  'Bank Name': 'bankName',
  'IBAN': 'iban',
  'BIC': 'bic',
};

// =============================================================================
// STYLES - All borders explicitly defined
// =============================================================================
const styles = StyleSheet.create({
  page: {
    width: PAGE_WIDTH_PT,
    height: PAGE_HEIGHT_PT,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  contentArea: {
    position: 'absolute',
    top: MARGIN_PT,
    left: MARGIN_PT,
    width: CONTENT_WIDTH_PT,
    height: CONTENT_HEIGHT_PT,
  },
  headerArea: {
    position: 'absolute',
    top: HEADER_TOP_MARGIN_PT,
    left: MARGIN_PT,
    width: CONTENT_WIDTH_PT,
  },
  footerArea: {
    position: 'absolute',
    bottom: FOOTER_BOTTOM_MARGIN_PT,
    left: MARGIN_PT,
    width: CONTENT_WIDTH_PT,
  },
  // Input field styles - all borders explicit
  inputBox: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#d1d5db',
    borderRightColor: '#d1d5db',
    borderBottomColor: '#d1d5db',
    borderLeftColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 21,
    justifyContent: 'center',
  },
  systemInputBox: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#d1d5db',
    borderRightColor: '#d1d5db',
    borderBottomColor: '#d1d5db',
    borderLeftColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 21,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 6,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#374151',
    borderRightColor: '#374151',
    borderBottomColor: '#374151',
    borderLeftColor: '#374151',
    marginRight: 6,
    marginTop: 2,
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#374151',
    borderRightColor: '#374151',
    borderBottomColor: '#374151',
    borderLeftColor: '#374151',
    backgroundColor: '#3b82f6',
    marginRight: 6,
    marginTop: 2,
  },
  signatureBox: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#d1d5db',
    borderRightColor: '#d1d5db',
    borderBottomColor: '#d1d5db',
    borderLeftColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    width: '100%',
  },
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Convert px to pt - with safety check
const pxToPt = (px) => {
  const num = Number(px);
  return isNaN(num) ? 0 : num * PX_TO_PT;
};

// Get system value
const getSystemValue = (variable, systemValues) => {
  const fieldName = SYSTEM_VARIABLE_MAPPING[variable];
  return systemValues?.[fieldName] || '';
};

// Get user value
const getUserValue = (variable, formValues) => {
  const fieldName = USER_VARIABLE_MAPPING[variable];
  return formValues?.[fieldName] || '';
};

// Safe number with default
const safeNum = (val, defaultVal = 0) => {
  const num = Number(val);
  return isNaN(num) ? defaultVal : num;
};

// =============================================================================
// PDF ELEMENT RENDERER
// =============================================================================
const PDFElement = ({ element, formValues, systemValues }) => {
  if (!element || element.visible === false) return null;

  // Convert position and size from px to pt with safety
  const x = pxToPt(element.x || 0);
  const y = pxToPt(element.y || 0);
  const width = pxToPt(element.width || 100);
  const height = pxToPt(element.height || 30);

  // Base wrapper style - no borders here
  const wrapperStyle = {
    position: 'absolute',
    left: x,
    top: y,
    width: width,
    height: height,
  };

  switch (element.type) {
    case 'heading':
    case 'subheading': {
      const content = element.content && 
        !['Heading...', 'Subheading...'].includes(element.content) 
        ? element.content 
        : '';
      
      if (!content) return null;
      
      const fontSize = pxToPt(element.fontSize || (element.type === 'heading' ? 24 : 18));
      
      return (
        <View style={wrapperStyle}>
          <Text style={{
            fontSize: fontSize,
            fontFamily: 'Helvetica',
            fontWeight: element.bold ? 'bold' : 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
            textAlign: element.alignment || 'left',
            color: element.color || '#000000',
            textTransform: element.capsLock ? 'uppercase' : 'none',
          }}>
            {content}
          </Text>
        </View>
      );
    }

    case 'text': {
      const labelFontSize = pxToPt(element.labelFontSize || 14);
      const inputFontSize = pxToPt(element.inputFontSize || 14);
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel ? element.label : '';
      
      const userVariable = element.variable;
      const currentValue = userVariable ? getUserValue(userVariable, formValues) : '';

      return (
        <View style={wrapperStyle}>
          <View style={{ flexDirection: 'column', height: '100%' }}>
            {element.showTitle !== false && labelText ? (
              <Text style={{
                fontSize: labelFontSize,
                fontFamily: 'Helvetica',
                color: element.labelColor || '#111827',
                marginBottom: 3,
                fontWeight: element.labelBold ? 'bold' : 'normal',
                fontStyle: element.labelItalic ? 'italic' : 'normal',
                textTransform: element.labelCapsLock ? 'uppercase' : 'none',
              }}>
                {labelText}{element.required ? ' *' : ''}
              </Text>
            ) : null}
            <View style={styles.inputBox}>
              <Text style={{
                fontSize: inputFontSize,
                fontFamily: 'Helvetica',
                fontWeight: element.inputBold ? 'bold' : 'normal',
                fontStyle: element.inputItalic ? 'italic' : 'normal',
                color: currentValue ? (element.inputColor || '#374151') : '#9ca3af',
              }}>
                {currentValue || userVariable || ''}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    case 'system-text': {
      const labelFontSize = pxToPt(element.labelFontSize || 14);
      const inputFontSize = pxToPt(element.inputFontSize || 14);
      
      const hasCustomLabel = element.label && !['Variable Field (Input)', 'Variable Field (System)'].includes(element.label);
      const labelText = hasCustomLabel ? element.label : '';
      
      const sysVariable = element.variable;
      const displayValue = sysVariable ? getSystemValue(sysVariable, systemValues) : '';

      return (
        <View style={wrapperStyle}>
          <View style={{ flexDirection: 'column', height: '100%' }}>
            {element.showTitle !== false && labelText ? (
              <Text style={{
                fontSize: labelFontSize,
                fontFamily: 'Helvetica',
                color: element.labelColor || '#111827',
                marginBottom: 3,
                fontWeight: element.labelBold ? 'bold' : 'normal',
                fontStyle: element.labelItalic ? 'italic' : 'normal',
              }}>
                {labelText}
              </Text>
            ) : null}
            <View style={styles.systemInputBox}>
              <Text style={{
                fontSize: inputFontSize,
                fontFamily: 'Helvetica',
                fontWeight: element.inputBold ? 'bold' : 'normal',
                color: displayValue ? (element.inputColor || '#374151') : '#9ca3af',
              }}>
                {displayValue || `{${sysVariable || 'System'}}`}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    case 'textarea': {
      const content = element.content && element.content !== 'Paragraph...' 
        ? element.content 
        : '';
      
      if (!content) return null;
      
      const fontSize = pxToPt(element.fontSize || 14);
      
      return (
        <View style={wrapperStyle}>
          <Text style={{
            fontSize: fontSize,
            fontFamily: 'Helvetica',
            fontWeight: element.bold ? 'bold' : 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
            lineHeight: safeNum(element.lineHeight, 1.5),
            color: element.color || '#000000',
            textAlign: element.alignment || 'left',
            textTransform: element.capsLock ? 'uppercase' : 'none',
          }}>
            {content}
          </Text>
        </View>
      );
    }

    case 'checkbox': {
      const isChecked = formValues?.[`checkbox_${element.id}`] || false;
      
      const checkboxLabel = element.label && element.label !== 'Checkbox Title...'
        ? element.label : '';
      
      const checkboxDescription = element.showDescription && element.description && element.description !== 'Description...'
        ? element.description : '';

      const labelSize = pxToPt(element.checkboxLabelSize || 16);
      const descSize = pxToPt(element.checkboxDescriptionSize || 14);

      return (
        <View style={wrapperStyle}>
          <View style={styles.checkboxContainer}>
            <View style={isChecked ? styles.checkboxChecked : styles.checkbox}>
              {isChecked ? (
                <Svg width={10} height={10} viewBox="0 0 24 24">
                  <Line x1={4} y1={12} x2={10} y2={18} stroke="#ffffff" strokeWidth={3} />
                  <Line x1={10} y1={18} x2={20} y2={6} stroke="#ffffff" strokeWidth={3} />
                </Svg>
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              {element.showTitle !== false && checkboxLabel ? (
                <Text style={{
                  fontSize: labelSize,
                  fontFamily: 'Helvetica',
                  color: element.titleColor || '#000000',
                  fontWeight: element.titleBold ? 'bold' : 'normal',
                  fontStyle: element.titleItalic ? 'italic' : 'normal',
                  textTransform: element.titleCapsLock ? 'uppercase' : 'none',
                }}>
                  {checkboxLabel}{element.required ? ' *' : ''}
                </Text>
              ) : null}
              {checkboxDescription ? (
                <Text style={{
                  fontSize: descSize,
                  fontFamily: 'Helvetica',
                  color: element.descriptionColor || '#374151',
                  fontWeight: element.descriptionBold ? 'bold' : 'normal',
                  fontStyle: element.descriptionItalic ? 'italic' : 'normal',
                  marginTop: 3,
                  textTransform: element.descriptionCapsLock ? 'uppercase' : 'none',
                }}>
                  {checkboxDescription}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
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
        ? element.belowSignatureText : 'Unterschrift';

      const fontSize = pxToPt(element.signatureFontSize || 14);
      const belowFontSize = pxToPt(element.belowTextFontSize || 14);
      
      // Calculate signature box height
      const locationHeight = element.showLocationDate !== false && locationDateText ? 18 : 0;
      const belowTextHeight = element.showBelowSignature !== false ? 15 : 0;
      const signatureBoxHeight = Math.max(30, height - locationHeight - belowTextHeight - 12);

      return (
        <View style={wrapperStyle}>
          <View style={{ flexDirection: 'column', padding: 6 }}>
            {element.showLocationDate !== false && locationDateText ? (
              <Text style={{
                fontSize: fontSize,
                fontFamily: 'Helvetica',
                color: element.locationColor || '#374151',
                marginBottom: 3,
                fontWeight: element.locationBold ? 'bold' : 'normal',
                fontStyle: element.locationItalic ? 'italic' : 'normal',
              }}>
                {locationDateText}{element.required ? ' *' : ''}
              </Text>
            ) : null}
            
            <View style={[styles.signatureBox, { height: signatureBoxHeight }]}>
              {signatureValue ? (
                <Image 
                  src={signatureValue} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    padding: 4,
                  }} 
                />
              ) : (
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}>
                  <Text style={{ fontSize: 10, color: '#9ca3af' }}>Unterschrift</Text>
                </View>
              )}
            </View>
            
            {element.showBelowSignature !== false ? (
              <Text style={{
                fontSize: belowFontSize,
                fontFamily: 'Helvetica',
                color: element.belowTextColor || '#374151',
                fontWeight: element.belowTextBold ? 'bold' : 'normal',
                fontStyle: element.belowTextItalic ? 'italic' : 'normal',
                marginTop: 3,
              }}>
                {signatureBelowText}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }

    case 'image': {
      if (element.src) {
        return (
          <View style={wrapperStyle}>
            <Image 
              src={element.src} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          </View>
        );
      }
      return null;
    }

    case 'divider': {
      const lineColor = element.lineColor || '#000000';
      const lineHeight = Math.max(1, pxToPt(element.height || 1));
      const isDashed = element.lineStyle === 'dashed';
      const isDotted = element.lineStyle === 'dotted';
      
      return (
        <View style={wrapperStyle}>
          <Svg width={width} height={lineHeight}>
            <Line
              x1={0}
              y1={lineHeight / 2}
              x2={width}
              y2={lineHeight / 2}
              stroke={lineColor}
              strokeWidth={lineHeight}
              strokeDasharray={isDashed ? '5,5' : isDotted ? '2,2' : undefined}
            />
          </Svg>
        </View>
      );
    }

    case 'rectangle': {
      const bgColor = element.backgroundColor || '#f3f4f6';
      const borderColor = element.borderColor || '#000000';
      const bw = safeNum(element.borderWidth, 0);
      const br = pxToPt(element.borderRadius || 0);
      
      // Use SVG for rectangle to avoid border issues
      return (
        <View style={wrapperStyle}>
          <Svg width={width} height={height}>
            <Rect
              x={bw / 2}
              y={bw / 2}
              width={width - bw}
              height={height - bw}
              fill={bgColor}
              stroke={bw > 0 ? borderColor : 'none'}
              strokeWidth={bw}
              rx={br}
              ry={br}
            />
          </Svg>
        </View>
      );
    }

    case 'circle': {
      const bgColor = element.backgroundColor || '#f3f4f6';
      const borderColor = element.borderColor || '#000000';
      const bw = safeNum(element.borderWidth, 0);
      const radius = Math.min(width, height) / 2 - bw / 2;
      
      return (
        <View style={wrapperStyle}>
          <Svg width={width} height={height}>
            <SvgCircle
              cx={width / 2}
              cy={height / 2}
              r={Math.max(0, radius)}
              fill={bgColor}
              stroke={bw > 0 ? borderColor : 'none'}
              strokeWidth={bw}
            />
          </Svg>
        </View>
      );
    }

    case 'triangle': {
      const bgColor = element.backgroundColor || '#f3f4f6';
      const borderColor = element.borderColor || '#000000';
      const bw = safeNum(element.borderWidth, 0);
      
      return (
        <View style={wrapperStyle}>
          <Svg width={width} height={height}>
            <Polygon
              points={`${width/2},${bw} ${width-bw},${height-bw} ${bw},${height-bw}`}
              fill={bgColor}
              stroke={bw > 0 ? borderColor : 'none'}
              strokeWidth={bw}
            />
          </Svg>
        </View>
      );
    }

    default:
      return null;
  }
};

// =============================================================================
// PDF PAGE COMPONENT
// =============================================================================
const PDFContractPage = ({ page, pageIndex, contractForm, formValues, systemValues }) => {
  // Sort elements by sortIndex (higher sortIndex = rendered first = behind)
  const sortedElements = [...(page.elements || [])].sort((a, b) => {
    const sortA = a.sortIndex ?? 0;
    const sortB = b.sortIndex ?? 0;
    return sortB - sortA;
  });

  return (
    <Page size="A4" style={styles.page}>
      {/* Global Header */}
      {contractForm.globalHeader?.enabled && contractForm.globalHeader?.content ? (
        (contractForm.globalHeader.showOnPages === 'all' || 
         (contractForm.globalHeader.showOnPages === 'first' && pageIndex === 0)) ? (
          <View style={styles.headerArea}>
            <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: '#000000' }}>
              {/* Strip HTML tags for PDF - simple approach */}
              {contractForm.globalHeader.content.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        ) : null
      ) : null}

      {/* Page Content */}
      <View style={styles.contentArea}>
        {sortedElements.map((element) => (
          <PDFElement
            key={element.id}
            element={element}
            formValues={formValues}
            systemValues={systemValues}
          />
        ))}
      </View>

      {/* Global Footer */}
      {contractForm.globalFooter?.enabled && contractForm.globalFooter?.content ? (
        (contractForm.globalFooter.showOnPages === 'all' || 
         (contractForm.globalFooter.showOnPages === 'first' && pageIndex === 0)) ? (
          <View style={styles.footerArea}>
            <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: '#000000' }}>
              {/* Strip HTML tags for PDF - simple approach */}
              {contractForm.globalFooter.content.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        ) : null
      ) : null}
    </Page>
  );
};

// =============================================================================
// MAIN PDF DOCUMENT COMPONENT
// =============================================================================
const ContractPDFDocument = ({ contractForm, formValues, systemValues }) => {
  if (!contractForm || !contractForm.pages) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ padding: 40 }}>
            <Text>No contract form data available</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document
      title={`Contract - ${formValues?.firstName || ''} ${formValues?.lastName || ''}`}
      author="Contract Management System"
      subject="Contract Document"
      creator="@react-pdf/renderer"
    >
      {contractForm.pages.map((page, index) => (
        <PDFContractPage
          key={page.id || index}
          page={page}
          pageIndex={index}
          contractForm={contractForm}
          formValues={formValues || {}}
          systemValues={systemValues || {}}
        />
      ))}
    </Document>
  );
};

export default ContractPDFDocument;
