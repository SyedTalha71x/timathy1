// Page dimensions in pixels
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 20;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - (2 * PAGE_MARGIN_MM); // 170mm
const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - (2 * PAGE_MARGIN_MM); // 257mm

// Convert mm to pixels (at 96 DPI)
const MM_TO_PX = 96 / 25.4; // 3.7795275591
export const PAGE_WIDTH_PX = Math.round(PAGE_WIDTH_MM * MM_TO_PX); // ~794px
export const PAGE_HEIGHT_PX = Math.round(PAGE_HEIGHT_MM * MM_TO_PX); // ~1123px
export const CONTENT_WIDTH_PX = Math.round(CONTENT_WIDTH_MM * MM_TO_PX); // ~642px
export const CONTENT_HEIGHT_PX = Math.round(CONTENT_HEIGHT_MM * MM_TO_PX); // ~971px
export const MARGIN_PX = Math.round(PAGE_MARGIN_MM * MM_TO_PX); // ~76px

// Calculate dynamic content area based on header/footer
export const calculateDynamicContentArea = (globalHeader, globalFooter, pageIndex = 0, isPdfPage = false, measuredHeaderHeight = 0, measuredFooterHeight = 0) => {
  // PDF pages don't have header/footer
  if (isPdfPage) {
    return {
      top: MARGIN_PX,
      height: CONTENT_HEIGHT_PX,
      headerHeight: 0,
      footerHeight: 0
    };
  }

  let headerHeight = 0;
  let footerHeight = 0;

  // Check if header should be shown
  const showHeader = globalHeader?.enabled && 
                    globalHeader?.content && 
                    ((globalHeader?.showOnPages === 'all') || 
                     (globalHeader?.showOnPages === 'first' && pageIndex === 0));

  // Check if footer should be shown
  const showFooter = globalFooter?.enabled && 
                    globalFooter?.content && 
                    ((globalFooter?.showOnPages === 'all') || 
                     (globalFooter?.showOnPages === 'first' && pageIndex === 0));

  // Use measured heights if available (more accurate), otherwise estimate
  if (showHeader) {
    if (measuredHeaderHeight > 0) {
      headerHeight = measuredHeaderHeight;
    } else {
      // Estimate with tighter bounds - only if no measurement available
      const fontSize = globalHeader.fontSize || 12;
      const lineHeight = 1.2;
      const availableTextWidth = CONTENT_WIDTH_PX - 16;
      const estimatedLines = estimateTextLines(
        globalHeader.content || '', 
        fontSize, 
        availableTextWidth,
        globalHeader.fontFamily
      );
      // Add small buffer but cap the height to prevent excessive space usage
      headerHeight = Math.min(
        fontSize * lineHeight * estimatedLines + 4, // +4px for minimal spacing
        60 // Maximum 60px for header to prevent excessive space consumption
      );
    }
  }

  if (showFooter) {
    if (measuredFooterHeight > 0) {
      footerHeight = measuredFooterHeight;
    } else {
      // Estimate with tighter bounds
      const fontSize = globalFooter.fontSize || 12;
      const lineHeight = 1.2;
      const availableTextWidth = CONTENT_WIDTH_PX - 16;
      const estimatedLines = estimateTextLines(
        globalFooter.content || '', 
        fontSize, 
        availableTextWidth,
        globalFooter.fontFamily
      );
      // Add small buffer but cap the height
      footerHeight = Math.min(
        fontSize * lineHeight * estimatedLines + 4,
        60 // Maximum 60px for footer
      );
    }
  }

  // Calculate content area position and height
  // Header stays in margin area (first 76px), content area only reduces if header exceeds margin
  const headerOverflow = Math.max(0, headerHeight - (MARGIN_PX - 25)); // 25px buffer from top
  const footerOverflow = Math.max(0, footerHeight - (MARGIN_PX - 25)); // 25px buffer from bottom
  
  const contentTop = MARGIN_PX + headerOverflow;
  const contentHeight = CONTENT_HEIGHT_PX - headerOverflow - footerOverflow;

  return {
    top: contentTop,
    height: Math.max(200, contentHeight), // Minimum 200px for usable space
    headerHeight,
    footerHeight,
    headerOverflow,
    footerOverflow
  };
};

export const clampElementBounds = (element, maxWidth = CONTENT_WIDTH_PX, maxHeight = CONTENT_HEIGHT_PX) => {
  const maxX = Math.max(0, maxWidth - element.width);
  const maxY = Math.max(0, maxHeight - element.height);
  
  let clampedX = Math.max(0, Math.min(element.x, maxX));
  let clampedY = Math.max(0, Math.min(element.y, maxY));
  
  let clampedWidth = Math.min(element.width, maxWidth);
  let clampedHeight = Math.min(element.height, maxHeight);
  
  return {
    x: Math.round(clampedX),
    y: Math.round(clampedY),
    width: Math.round(clampedWidth),
    height: Math.round(clampedHeight)
  };
};

// Clamp all elements in a page to fit within the dynamic content area
// This should be called when header/footer settings change to ensure
// elements don't end up outside the content boundaries
export const clampPageElementsToContentArea = (page, dynamicContentArea) => {
  if (!page || !page.elements || page.locked || page.isPdfPage) {
    return page;
  }

  const clampedElements = page.elements.map(element => {
    if (!element || typeof element !== 'object' || !element.id) {
      return element;
    }

    // Calculate max positions based on content area height
    const maxY = Math.max(0, dynamicContentArea.height - element.height);
    
    // Only clamp if element is actually outside bounds
    if (element.y > maxY) {
      return {
        ...element,
        y: Math.round(maxY)
      };
    }
    
    return element;
  });

  return {
    ...page,
    elements: clampedElements
  };
};

export const cleanElements = (elements) => {
  return (elements || []).filter(el => 
    el != null && 
    typeof el === 'object' && 
    el.id != null
  );
};

// Estimate the number of lines text will occupy based on content width and font size
export const estimateTextLines = (text, fontSize, availableWidth, fontFamily = 'Arial') => {
  if (!text || !text.trim()) return 0;
  
  // Average character width approximation based on font size
  // This is a rough estimate: monospace ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€¹Ã¢â‚¬Â  0.6, sans-serif ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€¹Ã¢â‚¬Â  0.5, serif ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€¹Ã¢â‚¬Â  0.55
  const avgCharWidth = fontSize * 0.52; // Conservative estimate for mixed content
  
  // Split by explicit line breaks first
  const explicitLines = text.split('\n');
  let totalLines = 0;
  
  explicitLines.forEach(line => {
    if (!line.trim()) {
      // Empty line still takes up space
      totalLines += 1;
    } else {
      // Estimate how many lines this text will wrap to
      const textWidth = line.length * avgCharWidth;
      const linesForThisText = Math.ceil(textWidth / availableWidth);
      totalLines += Math.max(1, linesForThisText);
    }
  });
  
  return totalLines;
};

// Export calculateSnapLines with advanced snapping features
export const calculateSnapLines = (element, elements, contentArea = null) => {
  const lines = [];
  const SNAP_TOLERANCE = 5; // Pixels - wie in Figma/Adobe XD
  
  const snapPoints = {
    horizontal: [], // y-positions to snap to
    vertical: []    // x-positions to snap to
  };

  // Add page boundaries as snap points
  if (contentArea) {
    // Vertical boundaries (x-axis)
    snapPoints.vertical.push(
      { position: 0, type: 'page-left', label: 'Page Left' },
      { position: CONTENT_WIDTH_PX, type: 'page-right', label: 'Page Right' },
      { position: CONTENT_WIDTH_PX / 2, type: 'page-center-v', label: 'Page Center' }
    );
    
    // Horizontal boundaries (y-axis)
    snapPoints.horizontal.push(
      { position: 0, type: 'page-top', label: 'Content Top' },
      { position: contentArea.height, type: 'page-bottom', label: 'Content Bottom' },
      { position: contentArea.height / 2, type: 'page-center-h', label: 'Page Center' }
    );
    
    // Header/Footer boundaries if they exist
    if (contentArea.headerHeight > 0) {
      snapPoints.horizontal.push({
        position: 0,
        type: 'header-bottom',
        label: 'Header Bottom'
      });
    }
    if (contentArea.footerHeight > 0) {
      snapPoints.horizontal.push({
        position: contentArea.height,
        type: 'footer-top',
        label: 'Footer Top'
      });
    }
  }

  // Current element bounds
  const currentLeft = element.x;
  const currentRight = element.x + element.width;
  const currentTop = element.y;
  const currentBottom = element.y + element.height;
  const currentCenterX = element.x + element.width / 2;
  const currentCenterY = element.y + element.height / 2;

  // Check against other elements
  elements.forEach(otherElement => {
    if (otherElement.id === element.id || !otherElement.visible) return;
    
    const otherLeft = otherElement.x;
    const otherRight = otherElement.x + otherElement.width;
    const otherTop = otherElement.y;
    const otherBottom = otherElement.y + otherElement.height;
    const otherCenterX = otherElement.x + otherElement.width / 2;
    const otherCenterY = otherElement.y + otherElement.height / 2;

    // Vertical snap points (x-axis)
    snapPoints.vertical.push(
      { position: otherLeft, type: 'left', elementId: otherElement.id },
      { position: otherRight, type: 'right', elementId: otherElement.id },
      { position: otherCenterX, type: 'center-v', elementId: otherElement.id }
    );

    // Horizontal snap points (y-axis)
    snapPoints.horizontal.push(
      { position: otherTop, type: 'top', elementId: otherElement.id },
      { position: otherBottom, type: 'bottom', elementId: otherElement.id },
      { position: otherCenterY, type: 'center-h', elementId: otherElement.id }
    );
  });

  // Find best snap matches for vertical lines (x-axis)
  const verticalSnaps = [
    { current: currentLeft, edge: 'left' },
    { current: currentRight, edge: 'right' },
    { current: currentCenterX, edge: 'center' }
  ];

  verticalSnaps.forEach(({ current, edge }) => {
    snapPoints.vertical.forEach(snapPoint => {
      const distance = Math.abs(current - snapPoint.position);
      if (distance <= SNAP_TOLERANCE) {
        lines.push({
          type: 'vertical',
          position: snapPoint.position,
          elementId: snapPoint.elementId,
          snapType: snapPoint.type,
          isPageBoundary: snapPoint.type.startsWith('page-'),
          isCenter: snapPoint.type.includes('center'),
          currentEdge: edge,
          distance,
          priority: distance // Lower is better
        });
      }
    });
  });

  // Find best snap matches for horizontal lines (y-axis)
  const horizontalSnaps = [
    { current: currentTop, edge: 'top' },
    { current: currentBottom, edge: 'bottom' },
    { current: currentCenterY, edge: 'center' }
  ];

  horizontalSnaps.forEach(({ current, edge }) => {
    snapPoints.horizontal.forEach(snapPoint => {
      const distance = Math.abs(current - snapPoint.position);
      if (distance <= SNAP_TOLERANCE) {
        lines.push({
          type: 'horizontal',
          position: snapPoint.position,
          elementId: snapPoint.elementId,
          snapType: snapPoint.type,
          isPageBoundary: snapPoint.type.startsWith('page-') || snapPoint.type.includes('header') || snapPoint.type.includes('footer'),
          isCenter: snapPoint.type.includes('center'),
          currentEdge: edge,
          distance,
          priority: distance
        });
      }
    });
  });

  // Sort by priority (distance) and remove duplicates
  const uniqueLines = [];
  const seen = new Set();

  lines
    .sort((a, b) => a.priority - b.priority)
    .forEach(line => {
      const key = `${line.type}-${line.position}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    });

  return uniqueLines;
};

// Calculate snapped position for an element
export const calculateSnappedPosition = (element, snapLines) => {
  if (!snapLines || snapLines.length === 0) {
    return { x: element.x, y: element.y, snapped: false };
  }

  let snappedX = element.x;
  let snappedY = element.y;
  let hasSnappedX = false;
  let hasSnappedY = false;

  // Find the best vertical snap (affects x position)
  const verticalSnaps = snapLines.filter(line => line.type === 'vertical');
  if (verticalSnaps.length > 0) {
    const bestVertical = verticalSnaps[0]; // Already sorted by priority
    
    // Adjust x based on which edge is snapping
    if (bestVertical.currentEdge === 'left') {
      snappedX = bestVertical.position;
    } else if (bestVertical.currentEdge === 'right') {
      snappedX = bestVertical.position - element.width;
    } else if (bestVertical.currentEdge === 'center') {
      snappedX = bestVertical.position - element.width / 2;
    }
    hasSnappedX = true;
  }

  // Find the best horizontal snap (affects y position)
  const horizontalSnaps = snapLines.filter(line => line.type === 'horizontal');
  if (horizontalSnaps.length > 0) {
    const bestHorizontal = horizontalSnaps[0]; // Already sorted by priority
    
    // Adjust y based on which edge is snapping
    if (bestHorizontal.currentEdge === 'top') {
      snappedY = bestHorizontal.position;
    } else if (bestHorizontal.currentEdge === 'bottom') {
      snappedY = bestHorizontal.position - element.height;
    } else if (bestHorizontal.currentEdge === 'center') {
      snappedY = bestHorizontal.position - element.height / 2;
    }
    hasSnappedY = true;
  }

  return {
    x: Math.round(snappedX),
    y: Math.round(snappedY),
    snapped: hasSnappedX || hasSnappedY,
    snappedX: hasSnappedX,
    snappedY: hasSnappedY
  };
};
