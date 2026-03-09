/**
 * Calculate the required dimensions for text-based elements
 * This ensures text elements auto-resize to fit their content
 */

/**
 * Measure text dimensions using a temporary canvas element
 */
export function measureText(text, fontSize, fontFamily, fontWeight = 'normal', fontStyle = 'normal') {
  // Create a temporary canvas for text measurement
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set font properties
  const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  context.font = font;
  
  // Measure width
  const metrics = context.measureText(text);
  const width = metrics.width;
  
  // Height is the actual font size (line-height will be applied separately)
  const height = fontSize;
  
  return { width, height };
}

/**
 * Calculate dimensions for heading/subheading elements
 * When content is empty or placeholder, use the placeholder text size for initial dimensions
 */
export function calculateHeadingDimensions(element) {
  const isPlaceholder = !element.content || element.content === '' || 
    element.content === 'Heading...' || element.content === 'Subheading...';
  
  // Always use placeholder text for dimension calculation when empty
  const placeholderText = element.type === 'heading' ? 'Heading...' : 'Subheading...';
  const content = isPlaceholder ? placeholderText : element.content;
  
  const fontSize = element.fontSize || (element.type === 'heading' ? 24 : 18);
  const fontFamily = element.fontFamily || 'Arial, sans-serif';
  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const lineHeight = 1.2; // Tighter line height for headings
  
  const lines = content.split('\n');
  let maxWidth = 0;
  let totalHeight = 0;
  
  lines.forEach(line => {
    const { width, height } = measureText(line || ' ', fontSize, fontFamily, fontWeight, fontStyle);
    maxWidth = Math.max(maxWidth, width);
    totalHeight += height * lineHeight;
  });
  
  // Add padding - reduced for tighter fit
  const padding = 10;
  
  return {
    width: Math.max(100, Math.ceil(maxWidth + padding)),
    height: Math.max(40, Math.ceil(totalHeight + padding))
  };
}

/**
 * Calculate dimensions for textarea/paragraph elements
 * Note: Paragraph elements always use full width (643px) - only height adjusts dynamically
 */
export function calculateTextareaDimensions(element, maxWidth = 643) {
  const content = element.content || 'Paragraph...';
  const fontSize = element.fontSize || 14;
  const fontFamily = element.fontFamily || 'Arial, sans-serif';
  const fontWeight = element.bold ? 'bold' : 'normal';
  const fontStyle = element.italic ? 'italic' : 'normal';
  const lineHeight = element.lineHeight || 1.5;
  
  const lines = content.split('\n');
  let totalHeight = 0;
  
  // Use the full maxWidth for calculations (643px)
  const effectiveWidth = maxWidth;
  
  lines.forEach(line => {
    const { width, height } = measureText(line || ' ', fontSize, fontFamily, fontWeight, fontStyle);
    
    // Check if line wraps
    if (width > effectiveWidth) {
      // Calculate number of wrapped lines
      const wrappedLines = Math.ceil(width / effectiveWidth);
      totalHeight += height * lineHeight * wrappedLines;
    } else {
      totalHeight += height * lineHeight;
    }
  });
  
  // Add padding - reduced for tighter fit
  const padding = 10;
  
  // Always return full width (643px) - paragraphs don't shrink horizontally
  return {
    width: maxWidth,
    height: Math.max(60, Math.ceil(totalHeight + padding))
  };
}

/**
 * Calculate dimensions for text field (input) elements
 * Note: Variable fields can GROW when text gets longer, but never SHRINK below their initial/current width
 */
export function calculateTextFieldDimensions(element) {
  const labelText = element.label || 'Variable Field...';
  const labelFontSize = element.labelFontSize || 14;
  const labelFontFamily = element.labelFontFamily || 'Arial, sans-serif';
  const labelFontWeight = element.labelBold ? 'bold' : 'normal';
  const labelFontStyle = element.labelItalic ? 'italic' : 'normal';
  
  const inputFontSize = element.inputFontSize || 14;
  const inputHeight = inputFontSize * 2.0; // Input field height
  
  // Measure label for width calculation
  const labelMetrics = measureText(labelText, labelFontSize, labelFontFamily, labelFontWeight, labelFontStyle);
  
  const totalHeight = labelMetrics.height + inputHeight + 4; // 4px gap between label and input
  
  // Add padding
  const padding = 8;
  
  // Calculate required width based on label text
  const inputMinWidth = 200;
  const requiredWidth = Math.max(labelMetrics.width + padding, inputMinWidth);
  
  // Get the minimum width (initial or current width)
  const minWidth = element.initialWidth || element.width || 150;
  
  // Width can GROW if label is longer, but never SHRINK below minWidth
  const finalWidth = Math.max(minWidth, Math.ceil(requiredWidth));
  
  return {
    width: finalWidth,
    height: Math.max(50, Math.ceil(totalHeight + padding))
  };
}

/**
 * Calculate dimensions for checkbox elements
 */
export function calculateCheckboxDimensions(element) {
  const labelText = element.label || 'Checkbox Title...';
  const labelFontSize = element.checkboxTitleSize || element.checkboxLabelSize || 16;
  const titleFontFamily = element.checkboxTitleFontFamily || element.checkboxFontFamily || 'Arial, sans-serif';
  const titleFontWeight = element.titleBold ? 'bold' : 'normal';
  const titleFontStyle = element.titleItalic ? 'italic' : 'normal';
  
  let totalHeight = 0;
  let maxWidth = 0;
  
  // Calculate title height if shown
  if (element.showTitle !== false) {
    const labelMetrics = measureText(labelText, labelFontSize, titleFontFamily, titleFontWeight, titleFontStyle);
    totalHeight += labelMetrics.height + 8; // 8px for checkbox and minimal gap
    maxWidth = labelMetrics.width + 40; // 40px for checkbox and spacing
  } else {
    totalHeight += 20; // Just checkbox height (reduced from 24)
    maxWidth = 40; // Just checkbox width
  }
  
  // Add description if shown - handle multiple lines
  if (element.showDescription !== false && element.description) {
    const descFontSize = element.checkboxDescriptionSize || 14;
    const descFontFamily = element.checkboxDescriptionFontFamily || element.checkboxFontFamily || 'Arial, sans-serif';
    const descFontWeight = element.descriptionBold ? 'bold' : 'normal';
    const descFontStyle = element.descriptionItalic ? 'italic' : 'normal';
    const lineHeight = 1.5;
    
    // Split description into lines
    const lines = element.description.split('\n');
    let descHeight = 0;
    
    lines.forEach(line => {
      const descMetrics = measureText(line || ' ', descFontSize, descFontFamily, descFontWeight, descFontStyle);
      descHeight += descMetrics.height * lineHeight;
      maxWidth = Math.max(maxWidth, descMetrics.width + 40); // 40px for left padding
    });
    
    totalHeight += descHeight + 4; // Minimal 4px gap before description (reduced from 8)
  }
  
  // Add padding - reduced for tighter fit
  const padding = 10;
  
  return {
    width: Math.max(180, Math.ceil(maxWidth + padding)),
    height: Math.max(60, Math.ceil(totalHeight + padding))
  };
}

/**
 * Calculate dimensions for signature elements
 */
export function calculateSignatureDimensions(element) {
  const signatureFontSize = element.signatureFontSize || 14;
  const belowTextFontSize = element.belowTextFontSize || 14;
  const padding = 10;
  const signatureWidth = 150; // Breite der Unterschrift
  const signaturePuffer = 20; // Extra Puffer rechts von der Unterschrift
  
  let totalHeight = 0;
  let maxWidth = 0;
  
  // Add location/date text height if shown
  if (element.showLocationDate !== false && (element.location || element.showDate !== false)) {
    const locationFontFamily = element.locationFontFamily || element.signatureFontFamily || 'Arial, sans-serif';
    const locationFontWeight = element.locationBold ? 'bold' : 'normal';
    const locationFontStyle = element.locationItalic ? 'italic' : 'normal';
    
    // Approximate text width (location + date)
    const locationText = element.location || '';
    const dateText = element.showDate !== false ? '00.00.0000' : '';
    const fullText = locationText && dateText ? `${locationText}, ${dateText}` : locationText || dateText;
    
    const locationMetrics = measureText(fullText, signatureFontSize, locationFontFamily, locationFontWeight, locationFontStyle);
    
    // Height: Location/Date Zeile ist so hoch wie die Unterschrift (50px) oder der Text, je nachdem was grÃ¶ÃŸer ist
    totalHeight += Math.max(50, locationMetrics.height);
    
    // Width: Location/Date Text + gap (16px) + Unterschrift + Puffer
    maxWidth = Math.max(maxWidth, locationMetrics.width + 16 + signatureWidth + signaturePuffer);
    
    // Add 4px margin below location/date row
    totalHeight += 4;
  } else {
    // Auch ohne Location/Date brauchen wir Platz fÃ¼r die Unterschrift in filled preview
    // Mindestens 50px HÃ¶he fÃ¼r die Unterschrift-Zeile
    totalHeight += 50;
    totalHeight += 4;
    maxWidth = Math.max(maxWidth, signatureWidth + signaturePuffer);
  }
  
  // Add signature line height (2px border)
  totalHeight += 2;
  
  // Add below text height if shown
  if (element.showBelowSignature !== false && element.belowSignatureText && element.belowSignatureText !== 'Location, Date/Signature...') {
    const belowTextFontFamily = element.belowTextFontFamily || element.signatureFontFamily || 'Arial, sans-serif';
    const belowTextFontWeight = element.belowTextBold ? 'bold' : 'normal';
    const belowTextFontStyle = element.belowTextItalic ? 'italic' : 'normal';
    
    const belowTextMetrics = measureText(element.belowSignatureText, belowTextFontSize, belowTextFontFamily, belowTextFontWeight, belowTextFontStyle);
    
    // Add 4px margin above below text
    totalHeight += 4;
    totalHeight += belowTextMetrics.height;
    maxWidth = Math.max(maxWidth, belowTextMetrics.width + padding);
  }
  
  return {
    width: Math.max(250, Math.ceil(maxWidth + padding)),
    height: Math.max(60, Math.ceil(totalHeight + padding))
  };
}

/**
 * Auto-resize element based on its type and content
 * This is the main function to call when element content changes
 */
export function autoResizeElement(element, maxContentWidth = 643) {
  switch (element.type) {
    case 'heading':
    case 'subheading':
      return calculateHeadingDimensions(element);
      
    case 'textarea':
      // Paragraph uses full width (643px) - no margin deduction
      return calculateTextareaDimensions(element, maxContentWidth);
      
    case 'text':
    case 'system-text':
      return calculateTextFieldDimensions(element);
      
    case 'checkbox':
      return calculateCheckboxDimensions(element);
      
    case 'signature':
      return calculateSignatureDimensions(element);
      
    default:
      // For other element types, return current dimensions
      return {
        width: element.width || 200,
        height: element.height || 100
      };
  }
}

/**
 * Update element dimensions while maintaining position constraints
 * Ensures element doesn't overflow content area
 */
export function updateElementDimensionsWithConstraints(
  element,
  newDimensions,
  maxContentWidth = 642,
  maxContentHeight = 907
) {
  let { width, height } = newDimensions;
  let { x, y } = element;
  
  // Ensure element doesn't overflow right edge
  if (x + width > maxContentWidth) {
    width = maxContentWidth - x;
    if (width < 50) { // Minimum width
      width = 50;
      x = maxContentWidth - width;
    }
  }
  
  // Ensure element doesn't overflow bottom edge
  if (y + height > maxContentHeight) {
    height = maxContentHeight - y;
    if (height < 30) { // Minimum height
      height = 30;
      y = maxContentHeight - height;
    }
  }
  
  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.round(width),
    height: Math.round(height)
  };
}
