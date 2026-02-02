import { useState, useCallback } from 'react';
import { Modal, notification } from 'antd';
import { CONTENT_WIDTH_PX, CONTENT_HEIGHT_PX, clampElementBounds, calculateDynamicContentArea } from '../utils/layoutUtils';
import { autoResizeElement, updateElementDimensionsWithConstraints, calculateHeadingDimensions } from '../utils/autoResizeUtils';

export const useElementManagement = (
  contractPages,
  currentPage,
  setContractPages,
  setSelectedElement,
  saveToHistory,
  nextElementId,
  selectedElement,
  globalHeader,
  globalFooter,
  dynamicContentArea, // NEU: Empfange dynamicContentArea von auÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸en
  folders, // NEW: Need folders to calculate sortIndex
  setFolders, // NEW: Need setFolders to clear folders when deleting all elements
  setSelectedFolder
) => {
  const [showAllElements, setShowAllElements] = useState(true);

  const addElement = useCallback((type) => {
    const currentPageData = contractPages[currentPage];
    if (currentPageData?.locked) {
      notification.warning({
        message: "Page Locked",
        description: "Elements cannot be added to PDF pages"
      });
      return;
    }

    // Use provided dynamic content area or calculate it
    const contentArea = dynamicContentArea || calculateDynamicContentArea(
      globalHeader,
      globalFooter,
      currentPage,
      currentPageData?.locked || currentPageData?.isPdfPage,
      0,
      0
    );

    // Calculate sortIndex for independent elements (not in folders)
    // This allows proper ordering with folders
    const currentElements = contractPages[currentPage]?.elements || [];
    const maxY = currentElements.length > 0 
      ? Math.max(...currentElements.map(el => el.y + el.height))
      : 50;
    
    // NEW ELEMENT GOES TO TOP OF LIST (sortIndex = 1)
    // All existing folders and independent elements get their sortIndex increased by 1
    
    const baseElement = {
      id: nextElementId.current++,
      type,
      x: 50,
      y: 50,
      width: type === 'image' ? 200 : type === 'signature' ? 300 : 400,
      height: type === 'textarea' ? 120 : type === 'divider' ? 10 : type === 'image' ? 150 : type === 'signature' ? 150 : 40,
      required: ['text', 'checkbox', 'signature'].includes(type),
      variable: null,
      visible: true,
      folderId: null,
      sortIndex: 1  // New element goes to TOP of layer list
    };
    
    const getValidYPosition = (elementHeight) => {
      const proposedY = maxY + 20;
      const maxAllowedY = contentArea.height - elementHeight;
      return Math.min(proposedY, Math.max(0, maxAllowedY));
    };

    let element;
    switch (type) {
      case 'text':
        element = {
          ...baseElement,
          label: '',
          value: '',
          placeholder: '...',
          labelColor: '#111827',
          inputColor: '#374151',
          labelFontSize: 14,
          inputFontSize: 14,
          labelFontFamily: 'Arial, sans-serif',
          inputFontFamily: 'Arial, sans-serif',
          // Label formatting
          labelBold: false,
          labelItalic: false,
          labelUnderline: false,
          // Input formatting
          inputBold: false,
          inputItalic: false,
          inputUnderline: false,
          x: 0,
          y: getValidYPosition(60),
          width: 310,
          height: 60,
          initialWidth: 310  // Store initial width to prevent shrinking
        };
        break;
        
      case 'system-text':
        element = {
          ...baseElement,
          label: '',
          value: '',
          placeholder: '...',
          labelColor: '#111827',
          inputColor: '#374151',
          labelFontSize: 14,
          inputFontSize: 14,
          labelFontFamily: 'Arial, sans-serif',
          inputFontFamily: 'Arial, sans-serif',
          // Label formatting
          labelBold: false,
          labelItalic: false,
          labelUnderline: false,
          // Input formatting
          inputBold: false,
          inputItalic: false,
          inputUnderline: false,
          required: false,
          x: 0,
          y: getValidYPosition(60),
          width: 310,
          height: 60,
          initialWidth: 310  // Store initial width to prevent shrinking
        };
        break;
        
      case 'checkbox':
        element = {
          ...baseElement,
          label: '',
          description: '',
          showDescription: true,
          checked: false,
          fontSize: 14,
          checkboxFontFamily: 'Arial, sans-serif',
          checkboxLabelSize: 16,
          checkboxDescriptionSize: 14,
          // Title formatting
          titleBold: false,
          titleItalic: false,
          titleUnderline: false,
          titleColor: '#000000',
          // Description formatting
          descriptionBold: false,
          descriptionItalic: false,
          descriptionUnderline: false,
          descriptionColor: '#374151',
          variable: null,
          width: 643,
          x: 0,
          y: getValidYPosition(65),
          height: 65
        };
        break;
        
      case 'heading':
        // Calculate dimensions based on placeholder text "Heading..."
        const headingPlaceholderDims = calculateHeadingDimensions({
          type: 'heading',
          content: '',  // Empty content will use placeholder
          fontSize: 24,
          fontFamily: 'Arial, sans-serif',
          bold: true
        });
        element = {
          ...baseElement,
          content: '',
          fontSize: 24,
          fontFamily: 'Arial, sans-serif',
          bold: true,
          italic: false,
          underline: false,
          alignment: 'left',
          color: '#000000',
          x: 0,
          y: getValidYPosition(headingPlaceholderDims.height),
          width: headingPlaceholderDims.width,
          height: headingPlaceholderDims.height
        };
        break;
        
      case 'subheading':
        // Calculate dimensions based on placeholder text "Subheading..."
        const subheadingPlaceholderDims = calculateHeadingDimensions({
          type: 'subheading',
          content: '',  // Empty content will use placeholder
          fontSize: 18,
          fontFamily: 'Arial, sans-serif',
          bold: true
        });
        element = {
          ...baseElement,
          content: '',
          fontSize: 18,
          fontFamily: 'Arial, sans-serif',
          bold: true,
          italic: false,
          underline: false,
          alignment: 'left',
          color: '#000000',
          x: 0,
          y: getValidYPosition(subheadingPlaceholderDims.height),
          width: subheadingPlaceholderDims.width,
          height: subheadingPlaceholderDims.height
        };
        break;
        
      case 'textarea':
        element = {
          ...baseElement,
          content: '',
          fontSize: 14,
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
          width: 643,
          x: 0,
          y: getValidYPosition(80),
          height: 80,
          alignment: 'left',
          bold: false,
          italic: false,
          underline: false,
          listStyle: 'none',
          lineHeight: 1.5
        };
        break;
        
      case 'signature':
        element = {
          ...baseElement,
          label: '',
          width: 350,
          height: 95,
          x: 0,
          y: getValidYPosition(95),
          variable: null,
          location: '',
          showLocationDate: true,
          showBelowSignature: true,
          belowSignatureText: '',
          signatureFontFamily: 'Arial, sans-serif',
          signatureFontSize: 14,
          // Location text formatting
          locationBold: false,
          locationItalic: false,
          locationUnderline: false,
          locationColor: '#374151',
          // Below signature text formatting
          belowTextBold: false,
          belowTextItalic: false,
          belowTextUnderline: false,
          belowTextColor: '#374151',
          belowTextFontSize: 14
        };
        break;

      case 'divider':
        element = {
          ...baseElement,
          width: CONTENT_WIDTH_PX,
          height: 2,
          x: 0,
          y: getValidYPosition(2),
          lineColor: '#000000',
          lineStyle: 'solid'
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      case 'rectangle':
        element = {
          ...baseElement,
          width: 200,
          height: 150,
          x: 0,
          y: getValidYPosition(150),
          backgroundColor: '#f3f4f6',
          borderColor: '#000000',
          borderWidth: 2,
          lineStyle: 'solid',
          borderRadius: 0,
          rotation: 0
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      case 'circle':
        element = {
          ...baseElement,
          width: 150,
          height: 150,
          x: 0,
          y: getValidYPosition(150),
          backgroundColor: '#f3f4f6',
          borderColor: '#000000',
          borderWidth: 2,
          lineStyle: 'solid',
          rotation: 0
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      case 'triangle':
        element = {
          ...baseElement,
          width: 150,
          height: 150,
          x: 0,
          y: getValidYPosition(150),
          backgroundColor: '#f3f4f6',
          borderColor: '#000000',
          borderWidth: 2,
          lineStyle: 'solid',
          rotation: 0
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      case 'semicircle':
        element = {
          ...baseElement,
          width: 150,
          height: 75,
          x: 0,
          y: getValidYPosition(75),
          backgroundColor: '#f3f4f6',
          borderColor: '#000000',
          borderWidth: 2,
          lineStyle: 'solid',
          rotation: 0
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      case 'arrow':
        element = {
          ...baseElement,
          width: 200,
          height: 100,
          x: 0,
          y: getValidYPosition(100),
          backgroundColor: '#f3f4f6',
          borderColor: '#000000',
          borderWidth: 2,
          lineStyle: 'solid',
          rotation: 0
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      case 'image':
        element = {
          ...baseElement,
          src: '',
          alt: 'Image/Logo...',
          maintainAspectRatio: true,
          fileName: '',
          x: 0,
          y: getValidYPosition(100),
          width: 150,
          height: 100,
          cropLeft: 0,
          cropTop: 0,
          cropRight: 0,
          cropBottom: 0
        };
        element = { ...element, ...clampElementBounds(element) };
        break;

      default:
        element = baseElement;
    }

    // Update all existing elements and folders: increase their sortIndex by 1
    // This makes room for the new element at sortIndex 1 (top of list)
    const newPages = contractPages.map((page, idx) => {
      if (idx !== currentPage) return page;
      
      const updatedElements = (page.elements || []).map(el => ({
        ...el,
        sortIndex: (el.sortIndex || 0) + 1  // Shift all elements down by 1
      }));
      
      return { 
        ...page, 
        elements: [element, ...updatedElements]  // New element at front with sortIndex 1
      };
    });
    
    // Also update all folders: increase their sortIndex by 1
    const newFolders = folders.map(f => ({
      ...f,
      sortIndex: (f.sortIndex || 0) + 1  // Shift all folders down by 1
    }));
    
    setContractPages(newPages);
    setFolders(newFolders);
    setSelectedElement(element.id);
    saveToHistory(newPages, newFolders, 'add_element');
  }, [contractPages, currentPage, setContractPages, setSelectedElement, saveToHistory, nextElementId, dynamicContentArea, globalHeader, globalFooter, folders, setFolders]);

  const updateElement = useCallback((elementId, property, value, skipClamping = false) => {
    const page = contractPages[currentPage];
    const contentArea = dynamicContentArea || calculateDynamicContentArea(
      globalHeader,
      globalFooter,
      currentPage,
      page?.locked || page?.isPdfPage,
      0,
      0
    );
    
    const newPages = contractPages.map((page, pIdx) => {
      if (pIdx !== currentPage) return page;
      const newElements = page.elements.map(el => {
        if (el.id !== elementId) return el;
        
        let updatedElement = { ...el };
        
        if (!property.includes('.')) {
          updatedElement[property] = value;
        } else {
          const [parent, child] = property.split('.');
          updatedElement[parent] = {
            ...(el[parent] || {}),
            [child]: value
          };
        }
        
        // Special handling for rotation: check if element stays within bounds
        if (property === 'rotation') {
          // Helper function to calculate rotated bounding box
          const getRotatedBoundingBox = (cx, cy, w, h, angle) => {
            const rad = (angle * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            
            // Calculate all 4 corners relative to center
            const corners = [
              { x: -w/2, y: -h/2 },
              { x: w/2, y: -h/2 },
              { x: w/2, y: h/2 },
              { x: -w/2, y: h/2 }
            ];
            
            // Rotate corners and find min/max
            const rotatedCorners = corners.map(corner => ({
              x: cx + corner.x * cos - corner.y * sin,
              y: cy + corner.x * sin + corner.y * cos
            }));
            
            const minX = Math.min(...rotatedCorners.map(c => c.x));
            const maxX = Math.max(...rotatedCorners.map(c => c.x));
            const minY = Math.min(...rotatedCorners.map(c => c.y));
            const maxY = Math.max(...rotatedCorners.map(c => c.y));
            
            return { minX, maxX, minY, maxY };
          };
          
          // Check if rotated element stays within bounds
          const centerX = el.x + el.width / 2;
          const centerY = el.y + el.height / 2;
          const bbox = getRotatedBoundingBox(centerX, centerY, el.width, el.height, value);
          
          const maxWidth = CONTENT_WIDTH_PX;
          const maxHeight = contentArea.height || CONTENT_HEIGHT_PX;
          
          // Check if bounding box is within content area
          const isWithinBounds = 
            bbox.minX >= 0 && 
            bbox.maxX <= maxWidth && 
            bbox.minY >= 0 && 
            bbox.maxY <= maxHeight;
          
          // If rotation would move element out of bounds, keep old rotation value
          if (!isWithinBounds) {
            updatedElement[property] = el.rotation || 0;
          }
        }
        
        // NEU: Auto-Resize fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r Text-Elemente
        const contentChanged = 
          property === 'content' ||
          property === 'fontSize' ||
          property === 'fontFamily' ||
          property === 'bold' ||
          property === 'italic' ||
          property === 'lineHeight' ||
          property === 'label' ||
          property === 'description' ||
          property === 'showDescription' ||
          property === 'showTitle' ||
          property === 'labelFontSize' ||
          property === 'inputFontSize' ||
          property === 'checkboxLabelSize' ||
          property === 'checkboxTitleSize' ||
          property === 'checkboxDescriptionSize' ||
          property === 'checkboxFontFamily' ||
          property === 'checkboxTitleFontFamily' ||
          property === 'checkboxDescriptionFontFamily' ||
          property === 'titleBold' ||
          property === 'titleItalic' ||
          property === 'descriptionBold' ||
          property === 'descriptionItalic' ||
          property === 'labelCapsLock' ||
          property === 'inputCapsLock' ||
          property === 'capsLock' ||
          // Signature properties
          property === 'location' ||
          property === 'showDate' ||
          property === 'showLocationDate' ||
          property === 'showBelowSignature' ||
          property === 'belowSignatureText' ||
          property === 'signatureFontSize' ||
          property === 'belowTextFontSize' ||
          property === 'locationFontFamily' ||
          property === 'belowTextFontFamily' ||
          property === 'locationBold' ||
          property === 'locationItalic' ||
          property === 'belowTextBold' ||
          property === 'belowTextItalic';
        
        if (contentChanged && shouldAutoResize(updatedElement.type)) {
          const newDimensions = autoResizeElement(
            updatedElement,
            contentArea.width || CONTENT_WIDTH_PX
          );
          
          const constrainedDimensions = updateElementDimensionsWithConstraints(
            updatedElement,
            newDimensions,
            contentArea.width || CONTENT_WIDTH_PX,
            contentArea.height || CONTENT_HEIGHT_PX
          );
          
          updatedElement = {
            ...updatedElement,
            ...constrainedDimensions
          };
        } else if (!skipClamping) {
          const clamped = clampElementBounds(
            updatedElement,
            CONTENT_WIDTH_PX,
            contentArea.height
          );
          updatedElement = { ...updatedElement, ...clamped };
        }
        
        return updatedElement;
      });
      return { ...page, elements: newElements };
    });
    
    setContractPages(newPages);
    saveToHistory(newPages, [], 'update_element');
  }, [contractPages, currentPage, setContractPages, saveToHistory, globalHeader, globalFooter, dynamicContentArea]);

  const removeElement = useCallback((elementId) => {
    const newPages = contractPages.map((page, idx) => {
      if (idx !== currentPage) return page;
      return { ...page, elements: (page.elements || []).filter(el => el.id !== elementId) };
    });
    
    setContractPages(newPages);
    setSelectedElement(null);
    saveToHistory(newPages, [], 'remove_element');
  }, [contractPages, currentPage, setContractPages, setSelectedElement, saveToHistory]);

 const removeAllElements = useCallback(() => {
  if (contractPages[currentPage]?.elements.length === 0) {
    notification.info({
      message: "No Elements",
      description: "There are no elements to delete."
    });
    return;
  }

  Modal.confirm({
    title: "Delete All Elements",
    content: "Are you sure you want to delete all elements on this page? This will also delete any folders on this page.",
    okText: "Yes, delete all",
    cancelText: "Cancel",
    okType: "danger",
    onOk: () => {
      // 1. LÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶schen der Elemente auf der Seite
      const newPages = contractPages.map((page, idx) => 
        idx === currentPage ? { ...page, elements: [] } : page
      );
      
      // 2. LÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶schen der Ordner, die zu dieser Seite gehÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶ren
      const foldersOnCurrentPage = folders.filter(folder => 
        folder.pageId === currentPage || folder.pageId === undefined
      );
      
      let newFolders = [...folders];
      
      if (foldersOnCurrentPage.length > 0) {
        // Option 1: Ordner vollstÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ndig lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶schen
        newFolders = folders.filter(folder => 
          !(folder.pageId === currentPage || folder.pageId === undefined)
        );
      
      }
      
      setContractPages(newPages);
      setFolders(newFolders); // WICHTIG: Ordner aktualisieren
      setSelectedElement(null);
      setSelectedFolder(null);
      saveToHistory(newPages, newFolders, 'remove_all_elements_and_folders');
    },
  });
}, [contractPages, currentPage, folders, setContractPages, setFolders, setSelectedElement, setSelectedFolder, saveToHistory]);

  const toggleElementVisibility = useCallback((elementId) => {
    const element = contractPages[currentPage]?.elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, 'visible', !element.visible);
    }
  }, [contractPages, currentPage, updateElement]);

  const toggleAllElementsVisibility = useCallback(() => {
    const elements = contractPages[currentPage]?.elements || [];
    const allVisible = elements.every(el => el.visible);
    
    const newPages = contractPages.map((page, idx) => {
      if (idx !== currentPage) return page;
      return {
        ...page,
        elements: page.elements.map(el => ({
          ...el,
          visible: !allVisible
        }))
      };
    });
    
    setContractPages(newPages);
    setShowAllElements(!allVisible);
    saveToHistory(newPages, [], 'toggle_all_visibility');
  }, [contractPages, currentPage, setContractPages, setShowAllElements, saveToHistory]);

  return {
    addElement,
    updateElement,
    removeElement,
    removeAllElements,
    toggleElementVisibility,
    toggleAllElementsVisibility,
    showAllElements,
    setShowAllElements
  };
};

/**
 * Helper: Determine if element type should auto-resize
 */
function shouldAutoResize(elementType) {
  const autoResizeTypes = [
    'heading',
    'subheading',
    'textarea',
    'text',
    'system-text',
    'checkbox',
    'signature'
  ];
  return autoResizeTypes.includes(elementType);
}
