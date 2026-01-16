// Canvas utility functions for media library

/**
 * Calculate canvas dimensions based on target size and container constraints
 */
export const getCanvasDimensions = (imageSize, maxWidth = 800, maxHeight = 600) => {
  if (!imageSize || !imageSize.includes('x')) {
    return { width: 400, height: 400, scale: 1, originalWidth: 400, originalHeight: 400 };
  }
  
  const [width, height] = imageSize.split('x').map(Number);
  
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return { width: 400, height: 400, scale: 1, originalWidth: 400, originalHeight: 400 };
  }
  
  let scale = 1;
  if (width > maxWidth || height > maxHeight) {
    scale = Math.min(maxWidth / width, maxHeight / height);
  }
  
  return {
    width: width * scale,
    height: height * scale,
    scale: scale,
    originalWidth: width,
    originalHeight: height
  };
};

/**
 * Scale element coordinates from template to canvas
 */
export const scaleElementToCanvas = (element, fromSize, toCanvasDim) => {
  if (!fromSize || !fromSize.includes('x')) return element;
  
  const [fromWidth, fromHeight] = fromSize.split('x').map(Number);
  const scaleX = toCanvasDim.width / fromWidth;
  const scaleY = toCanvasDim.height / fromHeight;
  
  return {
    ...element,
    x: element.x * scaleX,
    y: element.y * scaleY,
    width: element.width * scaleX,
    height: element.height * scaleY,
    size: element.size ? element.size * Math.min(scaleX, scaleY) : element.size
  };
};
/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Apply personalization to template elements
 * @param {Array} elements - Template elements to personalize
 * @param {Object} personalization - Personalization options
 * @param {string} personalization.primaryColor - Primary accent color
 * @param {string} personalization.secondaryColor - Secondary/background color
 * @param {string} personalization.titleText - Text to replace in title elements
 * @param {string} personalization.subtitleText - Text to replace in subtitle elements
 * @returns {Array} - Personalized elements
 */
export const applyPersonalization = (elements, personalization) => {
  if (!personalization || !elements || elements.length === 0) {
    return elements;
  }

  const { primaryColor, secondaryColor, titleText, subtitleText } = personalization;
  
  return elements.map(element => {
    const newElement = { ...element };
    
    // Apply to background elements - use secondary color
    if (element.isBackground && secondaryColor) {
      if (element.type === 'shape') {
        newElement.color = secondaryColor;
      } else if (element.type === 'gradient') {
        // For gradient backgrounds, create gradient from secondary to a darker version
        newElement.gradientColors = [secondaryColor, adjustBrightness(secondaryColor, -20)];
      }
      return newElement;
    }
    
    // Apply colors to shapes (non-background) - use primary color
    if (element.type === 'shape' && !element.isBackground) {
      if (primaryColor) {
        newElement.color = primaryColor;
      }
    }
    
    // Apply colors to gradients (non-background)
    if (element.type === 'gradient' && !element.isBackground) {
      if (primaryColor && secondaryColor) {
        newElement.gradientColors = [primaryColor, secondaryColor];
      } else if (primaryColor) {
        newElement.gradientColors = [primaryColor, adjustBrightness(primaryColor, -30)];
      }
    }
    
    // Apply colors to lines and dividers
    if ((element.type === 'line' || element.type === 'divider') && primaryColor) {
      newElement.color = primaryColor;
    }
    
    // Apply text changes
    if (element.type === 'text') {
      // Determine if this is a title (larger text) or subtitle (smaller text)
      const isTitle = (element.size || 24) >= 48;
      const isSubtitle = (element.size || 24) < 48 && (element.size || 24) >= 16;
      
      // Apply text content if provided
      if (isTitle && titleText) {
        newElement.content = titleText;
      } else if (isSubtitle && subtitleText) {
        newElement.content = subtitleText;
      }
      
      // Apply colors based on background
      // If text is on a light background, use dark color
      // If text is on a dark background, use light color or primary
      if (secondaryColor) {
        const isLightBg = isLightColor(secondaryColor);
        if (isLightBg) {
          // Light background - use dark text
          newElement.color = '#1A1A1A';
        } else {
          // Dark background - headlines white, accent text uses primary
          if (isTitle) {
            newElement.color = '#FFFFFF';
          } else if (primaryColor) {
            newElement.color = primaryColor;
          }
        }
      }
    }
    
    return newElement;
  });
};

/**
 * Check if a color is light or dark
 */
export const isLightColor = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

/**
 * Adjust color brightness
 * @param {string} color - Hex color
 * @param {number} amount - Amount to adjust (-100 to 100)
 * @returns {string} - Adjusted hex color
 */
export const adjustBrightness = (color, amount) => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Generate thumbnail from canvas elements
 */
export const generateThumbnail = async (elements, size, hiddenLayers = new Set()) => {
  return new Promise((resolve) => {
    try {
      if (!size || !size.includes('x')) {
        resolve('data:,');
        return;
      }
      
      const [targetWidth, targetHeight] = size.split('x').map(Number);
      
      if (isNaN(targetWidth) || isNaN(targetHeight)) {
        resolve('data:,');
        return;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('data:,');
        return;
      }
      
      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort elements by zIndex
      const sortedElements = [...elements]
        .filter(el => !hiddenLayers.has(el.id))
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      
      const imageElements = sortedElements.filter(el => el.type === 'image');
      
      if (imageElements.length === 0) {
        drawElements(ctx, sortedElements, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/png'));
      } else {
        let imagesLoaded = 0;
        const totalImages = imageElements.length;
        const loadedImages = {};
        
        imageElements.forEach(element => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            loadedImages[element.id] = img;
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
              drawElementsWithImages(ctx, sortedElements, targetWidth, targetHeight, loadedImages);
              resolve(canvas.toDataURL('image/png'));
            }
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
              drawElementsWithImages(ctx, sortedElements, targetWidth, targetHeight, loadedImages);
              resolve(canvas.toDataURL('image/png'));
            }
          };
          img.src = element.content;
        });
        
        // Timeout fallback
        setTimeout(() => {
          if (imagesLoaded < totalImages) {
            drawElementsWithImages(ctx, sortedElements, targetWidth, targetHeight, loadedImages);
            resolve(canvas.toDataURL('image/png'));
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      resolve('data:,');
    }
  });
};

/**
 * Draw elements on canvas context
 */
const drawElements = (ctx, elements, targetWidth, targetHeight) => {
  elements.forEach(element => {
    drawElement(ctx, element, targetWidth, targetHeight);
  });
};

/**
 * Draw elements with pre-loaded images
 */
const drawElementsWithImages = (ctx, elements, targetWidth, targetHeight, loadedImages) => {
  elements.forEach(element => {
    if (element.type === 'image' && loadedImages[element.id]) {
      const x = element.x;
      const y = element.y;
      const width = element.width;
      const height = element.height;
      
      try {
        ctx.save();
        if (element.blur) {
          ctx.filter = `blur(${element.blur}px)`;
        }
        if (element.opacity !== undefined) {
          ctx.globalAlpha = element.opacity;
        }
        ctx.drawImage(loadedImages[element.id], x, y, width, height);
        ctx.restore();
      } catch (e) {
        console.warn("Could not draw image:", e);
      }
    } else {
      drawElement(ctx, element, targetWidth, targetHeight);
    }
  });
};

/**
 * Draw a single element on canvas
 */
const drawElement = (ctx, element, targetWidth, targetHeight) => {
  ctx.save();
  
  // Apply opacity
  if (element.opacity !== undefined) {
    ctx.globalAlpha = element.opacity;
  }
  
  if (element.type === 'text') {
    ctx.fillStyle = element.color;
    
    let fontStyle = '';
    if (element.bold) fontStyle += 'bold ';
    if (element.italic) fontStyle += 'italic ';
    
    const fontSize = element.size;
    ctx.font = `${fontStyle}${fontSize}px ${element.font || 'Arial'}`;
    ctx.textAlign = element.align || 'left';
    ctx.textBaseline = 'top';
    
    const padding = 4;
    const x = element.x + padding;
    const y = element.y + padding;
    
    const lines = element.content.split('\n');
    const lineHeight = fontSize * 1.2;
    
    lines.forEach((line, index) => {
      let textX = x;
      if (element.align === 'center') {
        textX = element.x + element.width / 2;
      } else if (element.align === 'right') {
        textX = element.x + element.width - padding;
      }
      ctx.fillText(line, textX, y + index * lineHeight);
    });
    
  } else if (element.type === 'shape') {
    ctx.fillStyle = element.color;
    
    const x = element.x;
    const y = element.y;
    const width = element.width;
    const height = element.height;
    
    switch (element.shape) {
      case 'rectangle':
        if (element.borderRadius) {
          drawRoundedRect(ctx, x, y, width, height, element.borderRadius);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, width, height);
        }
        break;
        
      case 'rounded-rectangle':
        const radius = Math.min(width, height) * 0.1;
        drawRoundedRect(ctx, x, y, width, height, radius);
        ctx.fill();
        break;
        
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'star':
        drawStar(ctx, x + width / 2, y + height / 2, 5, Math.min(width, height) / 2, Math.min(width, height) / 4);
        break;
        
      case 'heart':
        drawHeart(ctx, x, y, width, height);
        break;
        
      default:
        ctx.fillRect(x, y, width, height);
    }
    
    // Draw border if present
    if (element.borderWidth && element.borderColor) {
      ctx.strokeStyle = element.borderColor;
      ctx.lineWidth = element.borderWidth;
      ctx.stroke();
    }
    
  } else if (element.type === 'gradient') {
    const x = element.x;
    const y = element.y;
    const width = element.width;
    const height = element.height;
    const angle = (element.gradientAngle || 135) * Math.PI / 180;
    
    const cx = x + width / 2;
    const cy = y + height / 2;
    const len = Math.max(width, height);
    
    const x1 = cx - Math.cos(angle) * len / 2;
    const y1 = cy - Math.sin(angle) * len / 2;
    const x2 = cx + Math.cos(angle) * len / 2;
    const y2 = cy + Math.sin(angle) * len / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    const colors = element.gradientColors || ['#FF6B6B', '#FFA500'];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
  } else if (element.type === 'line') {
    ctx.strokeStyle = element.color || '#FFFFFF';
    ctx.lineWidth = element.strokeWidth || 2;
    
    if (element.lineStyle === 'dashed') {
      ctx.setLineDash([10, 5]);
    } else if (element.lineStyle === 'dotted') {
      ctx.setLineDash([2, 4]);
    }
    
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.x + element.width, element.y + element.height);
    ctx.stroke();
    
    // Draw arrows if needed
    if (element.arrowEnd) {
      drawArrow(ctx, element.x + element.width, element.y + element.height, 
                Math.atan2(element.height, element.width));
    }
    if (element.arrowStart) {
      drawArrow(ctx, element.x, element.y, 
                Math.atan2(-element.height, -element.width));
    }
    
  } else if (element.type === 'divider') {
    ctx.strokeStyle = element.color || '#FFFFFF';
    ctx.lineWidth = element.strokeWidth || 2;
    
    if (element.dividerStyle === 'dashed') {
      ctx.setLineDash([10, 5]);
    } else if (element.dividerStyle === 'dotted') {
      ctx.setLineDash([2, 4]);
    } else if (element.dividerStyle === 'double') {
      // Draw double line
      ctx.beginPath();
      ctx.moveTo(element.x, element.y - 2);
      ctx.lineTo(element.x + element.width, element.y - 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(element.x, element.y + 2);
      ctx.lineTo(element.x + element.width, element.y + 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.x + element.width, element.y);
    ctx.stroke();
  }
  
  ctx.restore();
};

/**
 * Draw rounded rectangle
 */
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

/**
 * Draw star shape
 */
const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius;
    let y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
};

/**
 * Draw heart shape
 */
const drawHeart = (ctx, x, y, width, height) => {
  const topCurveHeight = height * 0.3;
  
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + topCurveHeight);
  
  ctx.bezierCurveTo(
    x + width / 2, y,
    x, y,
    x, y + topCurveHeight
  );
  
  ctx.bezierCurveTo(
    x, y + (height + topCurveHeight) / 2,
    x + width / 2, y + (height + topCurveHeight) / 2,
    x + width / 2, y + height
  );
  
  ctx.bezierCurveTo(
    x + width / 2, y + (height + topCurveHeight) / 2,
    x + width, y + (height + topCurveHeight) / 2,
    x + width, y + topCurveHeight
  );
  
  ctx.bezierCurveTo(
    x + width, y,
    x + width / 2, y,
    x + width / 2, y + topCurveHeight
  );
  
  ctx.closePath();
  ctx.fill();
};

/**
 * Draw arrow head
 */
const drawArrow = (ctx, x, y, angle) => {
  const headLen = 15;
  const headAngle = Math.PI / 6;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - headLen * Math.cos(angle - headAngle), y - headLen * Math.sin(angle - headAngle));
  ctx.moveTo(x, y);
  ctx.lineTo(x - headLen * Math.cos(angle + headAngle), y - headLen * Math.sin(angle + headAngle));
  ctx.stroke();
};

export default {
  getCanvasDimensions,
  generateId,
  deepClone,
  applyPersonalization,
  isLightColor,
  adjustBrightness,
  generateThumbnail,
  scaleElementToCanvas
};
