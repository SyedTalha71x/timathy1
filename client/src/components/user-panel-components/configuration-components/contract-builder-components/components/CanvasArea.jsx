import React, { useRef, useEffect } from 'react';
import { FileTextIcon } from 'lucide-react';
import { 
  PAGE_WIDTH_PX, 
  PAGE_HEIGHT_PX, 
  MARGIN_PX,
  CONTENT_WIDTH_PX,
  CONTENT_HEIGHT_PX
} from '../utils/layoutUtils';

// Minimale Abstände für Kopf-/Fußzeile vom Blattrand
const HEADER_TOP_MARGIN = 20; // 20px vom oberen Blattrand
const FOOTER_BOTTOM_MARGIN = 20; // 20px vom unteren Blattrand
const HEADER_FOOTER_HORIZONTAL_PADDING = 20; // 20px links/rechts Padding

const CanvasArea = ({
  containerRef,
  contractPages,
  currentPage,
  canvasZoom,
  snapLines,
  selectedElement,
  setSelectedElement,
  setSelectedFolder,
  handleDragStart,
  isDragging,
  renderBuilderElement,
  globalHeader,
  globalFooter,
  removeElement,
  nextElementId,
  setContractPages,
  saveToHistory,
  folders,
  measuredHeaderHeight,
  setMeasuredHeaderHeight,
  measuredFooterHeight,
  setMeasuredFooterHeight,
  dynamicContentArea,
  // NEW PROPS for resize functionality
  handleResizeStart,
  isResizing
}) => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const handleCanvasClick = () => {
    setSelectedElement(null);
    setSelectedFolder(null);
  };

  // Measure actual rendered header height
  useEffect(() => {
    if (headerRef.current && shouldShowHeader()) {
      const measureHeight = () => {
        const height = headerRef.current.offsetHeight;
        if (height !== measuredHeaderHeight && height > 0) {
          setMeasuredHeaderHeight(height);
        }
      };
      
      measureHeight();
      const timeoutId = setTimeout(measureHeight, 50);
      return () => clearTimeout(timeoutId);
    } else if (!shouldShowHeader() && measuredHeaderHeight !== 0) {
      setMeasuredHeaderHeight(0);
    }
  }, [globalHeader, currentPage, contractPages, measuredHeaderHeight, setMeasuredHeaderHeight]);

  // Measure actual rendered footer height
  useEffect(() => {
    if (footerRef.current && shouldShowFooter()) {
      const measureHeight = () => {
        const height = footerRef.current.offsetHeight;
        if (height !== measuredFooterHeight && height > 0) {
          setMeasuredFooterHeight(height);
        }
      };
      
      measureHeight();
      const timeoutId = setTimeout(measureHeight, 50);
      return () => clearTimeout(timeoutId);
    } else if (!shouldShowFooter() && measuredFooterHeight !== 0) {
      setMeasuredFooterHeight(0);
    }
  }, [globalFooter, currentPage, contractPages, measuredFooterHeight, setMeasuredFooterHeight]);

  // Check if header/footer should be shown on current page
  const shouldShowHeader = () => {
    const page = contractPages[currentPage];
    if (page?.locked || page?.isPdfPage) return false;
    if (!globalHeader.enabled || !globalHeader.content) return false;
    return (globalHeader.showOnPages === 'all') || 
           (globalHeader.showOnPages === 'first' && currentPage === 0);
  };

  const shouldShowFooter = () => {
    const page = contractPages[currentPage];
    if (page?.locked || page?.isPdfPage) return false;
    if (!globalFooter.enabled || !globalFooter.content) return false;
    return (globalFooter.showOnPages === 'all') || 
           (globalFooter.showOnPages === 'first' && currentPage === 0);
  };

  const renderPageBackground = () => {
    const page = contractPages[currentPage];
    
    if (page?.backgroundImage && page?.isPdfPage) {
      return (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${page.backgroundImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 1,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      );
    }
    return null;
  };

  const renderSnapLines = () => {
    return snapLines.map((line, index) => {
      // Determine color based on snap type
      let color = '#3b82f6'; // Default blue for element alignment
      let opacity = 0.8;
      let isDashed = false;
      
      if (line.isPageBoundary) {
        color = '#8b5cf6'; // Purple for page boundaries
        opacity = 0.9;
      } else if (line.isCenter) {
        color = '#10b981'; // Green for center alignment
        isDashed = true;
        opacity = 0.85;
      }
      
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: line.type === 'vertical' ? `${line.position}px` : '0',
            top: line.type === 'horizontal' ? `${line.position}px` : '0',
            width: line.type === 'vertical' ? '1px' : '100%',
            height: line.type === 'horizontal' ? '1px' : '100%',
            backgroundColor: color,
            opacity,
            zIndex: 999,
            pointerEvents: 'none',
            boxShadow: `0 0 2px ${color}`,
            ...(isDashed && {
              backgroundImage: `repeating-linear-gradient(
                ${line.type === 'vertical' ? '180deg' : '90deg'},
                ${color},
                ${color} 5px,
                transparent 5px,
                transparent 10px
              )`
            })
          }}
        />
      );
    });
  };

  return (
    <>
      <style>
        {`
          /* Improve visibility of text decorations in header/footer at all zoom levels */
          .header-footer-content u,
          .header-footer-content [style*="text-decoration: underline"],
          .header-footer-content [style*="text-decoration:underline"] {
            text-decoration-thickness: 1.5px !important;
            text-underline-offset: 1px !important;
          }
          
          /* Ensure bold text is always visible */
          .header-footer-content strong,
          .header-footer-content b,
          .header-footer-content [style*="font-weight: bold"],
          .header-footer-content [style*="font-weight:bold"],
          .header-footer-content [style*="font-weight: 700"],
          .header-footer-content [style*="font-weight:700"] {
            font-weight: 700 !important;
          }
          
          /* Ensure italic is visible */
          .header-footer-content em,
          .header-footer-content i,
          .header-footer-content [style*="font-style: italic"],
          .header-footer-content [style*="font-style:italic"] {
            font-style: italic !important;
          }
          
          /* Improve line rendering */
          .header-footer-content * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
      <div className="flex-1 p-2 lg:p-4" style={{ 
        overflow: 'auto', 
        minHeight: 'calc(100vh - 160px)',
        height: '100%'
      }}>
      <div
        ref={containerRef}
        className="bg-white border border-gray-300 rounded-lg relative flex items-start justify-center"
        style={{
          minHeight: '600px',
          height: 'auto',
          backgroundImage: `
            linear-gradient(45deg, #f8f9fa 25%, transparent 25%),
            linear-gradient(-45deg, #f8f9fa 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f8f9fa 75%),
            linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          overflow: 'auto'
        }}
        onClick={handleCanvasClick}
      >
        {renderSnapLines()}
        
        <div
          className="bg-white shadow-lg mx-auto my-4"
          style={{
            width: `${PAGE_WIDTH_PX}px`,
            height: `${PAGE_HEIGHT_PX}px`,
            transform: `scale(${canvasZoom})`,
            transformOrigin: 'top center',
            boxSizing: 'border-box',
            position: 'relative',
            marginTop: '20px',
            marginBottom: '20px',
            overflow: 'hidden'
          }}
        >
          {renderPageBackground()}
          
          {/* Header */}
          {shouldShowHeader() && (
            <div 
              ref={headerRef}
              className="w-full bg-white header-footer-content"
              style={{
                position: 'absolute',
                top: `${HEADER_TOP_MARGIN}px`,
                left: `${MARGIN_PX}px`,
                width: `${CONTENT_WIDTH_PX}px`,
                fontSize: '10px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                lineHeight: 'normal',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                padding: '0',
                margin: '0',
                zIndex: 1,
                boxSizing: 'border-box'
              }}
              dangerouslySetInnerHTML={{ __html: globalHeader.content || '' }}
            />
          )}
          
          {/* Content Area */}
          <div
            style={{
              position: 'absolute',
              top: `${dynamicContentArea.top}px`,
              left: `${MARGIN_PX}px`,
              width: `${CONTENT_WIDTH_PX}px`,
              height: `${dynamicContentArea.height}px`,
              border: contractPages[currentPage]?.locked ? 'none' : '2px dashed #3b82f6',
              backgroundColor: 'transparent',
              boxSizing: 'content-box',
              overflow: 'visible',
              zIndex: 2
            }}
          >
           {!contractPages[currentPage]?.locked && 
             contractPages[currentPage]?.elements
               .filter(element => element != null && typeof element === 'object' && element.id != null)
               .map(element => renderBuilderElement(
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
                 handleResizeStart,  // NEW: Pass resize handler
                 isResizing,         // NEW: Pass resize state
                 dynamicContentArea  // NEW: Pass dynamic content area for bounds checking
               ))}
            
            {!contractPages[currentPage]?.locked && 
             contractPages[currentPage]?.elements.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8">
                <div className="text-center">
                  <FileTextIcon size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Empty Contract Page</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Add elements from the sidebar to create your contract
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          {shouldShowFooter() && (
            <div 
              ref={footerRef}
              className="w-full bg-white header-footer-content"
              style={{
                position: 'absolute',
                bottom: `${FOOTER_BOTTOM_MARGIN}px`,
                left: `${MARGIN_PX}px`,
                width: `${CONTENT_WIDTH_PX}px`,
                fontSize: '10px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                lineHeight: 'normal',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                padding: '0',
                margin: '0',
                zIndex: 1,
                boxSizing: 'border-box'
              }}
              dangerouslySetInnerHTML={{ __html: globalFooter.content || '' }}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CanvasArea;
