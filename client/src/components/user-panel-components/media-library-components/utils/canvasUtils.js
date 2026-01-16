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
 * Calculate aspect ratio style for design cards
 */
export const getDesignAspectRatioStyle = (size, cardWidth = 200) => {
  if (!size || !size.includes('x')) {
    return { 
      height: '120px',
      width: '100%', 
      position: 'relative',
      backgroundColor: '#ffffff' 
    };
  }
  
  const [width, height] = size.split('x').map(Number);
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return { 
      height: '120px',
      width: '100%', 
      position: 'relative',
      backgroundColor: '#ffffff' 
    };
  }
  
  const ratio = height / width;
  const calculatedHeight = cardWidth * ratio;
  const maxHeight = 250;
  const minHeight = 100;
  
  return {
    height: `${Math.max(minHeight, Math.min(calculatedHeight, maxHeight))}px`,
    width: `${cardWidth}px`,
    margin: '0 auto',
    position: 'relative',
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  };
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
      
      // Sort elements by zIndex (background layer will be drawn first due to zIndex: -1)
      const sortedElements = [...elements]
        .filter(el => !hiddenLayers.has(el.id))
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      
      const imageElements = sortedElements.filter(el => el.type === 'image');
      
      if (imageElements.length === 0) {
        drawElements(ctx, sortedElements, targetWidth, targetHeight, size);
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
              drawElementsWithImages(ctx, sortedElements, targetWidth, targetHeight, size, loadedImages);
              resolve(canvas.toDataURL('image/png'));
            }
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
              drawElementsWithImages(ctx, sortedElements, targetWidth, targetHeight, size, loadedImages);
              resolve(canvas.toDataURL('image/png'));
            }
          };
          img.src = element.content;
        });
        
        // Timeout fallback
        setTimeout(() => {
          if (imagesLoaded < totalImages) {
            drawElementsWithImages(ctx, sortedElements, targetWidth, targetHeight, size, loadedImages);
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
 * Elements are stored in original canvas dimensions, so draw at 1:1 scale
 */
const drawElements = (ctx, elements, targetWidth, targetHeight, size) => {
  // Elements are already stored in target/original dimensions - no scaling needed
  elements.forEach(element => {
    drawElement(ctx, element, 1, 1, targetWidth, targetHeight);
  });
};

/**
 * Draw elements with pre-loaded images
 * Elements are stored in original canvas dimensions, so draw at 1:1 scale
 */
const drawElementsWithImages = (ctx, elements, targetWidth, targetHeight, size, loadedImages) => {
  elements.forEach(element => {
    if (element.type === 'image' && loadedImages[element.id]) {
      const x = element.x;
      const y = element.y;
      const width = element.width;
      const height = element.height;
      
      try {
        ctx.drawImage(loadedImages[element.id], x, y, width, height);
      } catch (e) {
        console.warn("Could not draw image:", e);
      }
    } else {
      drawElement(ctx, element, 1, 1, targetWidth, targetHeight);
    }
  });
};

/**
 * Draw a single element on canvas
 */
const drawElement = (ctx, element, scaleX, scaleY, targetWidth, targetHeight) => {
  if (element.type === 'text') {
    ctx.fillStyle = element.color;
    
    let fontStyle = '';
    if (element.bold) fontStyle += 'bold ';
    if (element.italic) fontStyle += 'italic ';
    
    const fontSize = element.size * scaleY;
    ctx.font = `${fontStyle}${fontSize}px ${element.font || 'Arial'}`;
    ctx.textAlign = element.align || 'left';
    ctx.textBaseline = 'top';
    
    // Add padding offset to match editor display (4px padding in editor)
    const padding = 4 * scaleY;
    const x = element.x * scaleX + padding;
    const y = element.y * scaleY + padding;
    const maxWidth = (element.width * scaleX) - (padding * 2);
    
    // Handle multi-line text
    const lines = element.content.split('\n');
    const lineHeight = fontSize * 1.2;
    
    lines.forEach((line, index) => {
      let textX = x;
      if (element.align === 'center') {
        textX = element.x * scaleX + (element.width * scaleX) / 2;
      } else if (element.align === 'right') {
        textX = element.x * scaleX + element.width * scaleX - padding;
      }
      
      // Don't use maxWidth parameter for fillText as it can squish text
      ctx.fillText(line, textX, y + index * lineHeight);
    });
    
  } else if (element.type === 'shape') {
    ctx.fillStyle = element.color;
    
    const x = element.x * scaleX;
    const y = element.y * scaleY;
    const width = element.width * scaleX;
    const height = element.height * scaleY;
    
    switch (element.shape) {
      case 'rectangle':
        ctx.fillRect(x, y, width, height);
        break;
        
      case 'rounded-rectangle':
        const radius = Math.min(width, height) * 0.1;
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
        
      case 'hexagon':
        drawHexagon(ctx, x + width / 2, y + height / 2, Math.min(width, height) / 2);
        break;
        
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height / 2);
        ctx.lineTo(x + width / 2, y + height);
        ctx.lineTo(x, y + height / 2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'pentagon':
        drawPentagon(ctx, x + width / 2, y + height / 2, Math.min(width, height) / 2);
        break;
        
      default:
        ctx.fillRect(x, y, width, height);
    }
  }
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
 * Draw hexagon shape
 */
const drawHexagon = (ctx, cx, cy, radius) => {
  const sides = 6;
  const angle = (2 * Math.PI) / sides;
  
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const x = cx + radius * Math.cos(angle * i - Math.PI / 2);
    const y = cy + radius * Math.sin(angle * i - Math.PI / 2);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
};

/**
 * Draw pentagon shape
 */
const drawPentagon = (ctx, cx, cy, radius) => {
  const sides = 5;
  const angle = (2 * Math.PI) / sides;
  
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const x = cx + radius * Math.cos(angle * i - Math.PI / 2);
    const y = cy + radius * Math.sin(angle * i - Math.PI / 2);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
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

export default {
  getCanvasDimensions,
  getDesignAspectRatioStyle,
  generateThumbnail,
  generateId,
  deepClone,
  scaleElementToCanvas
};
