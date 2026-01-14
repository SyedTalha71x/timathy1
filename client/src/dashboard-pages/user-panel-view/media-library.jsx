/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Download, 
  Edit2, 
  Trash2,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Image as ImageIcon,
  Layers,
  Save,
  X,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  Sparkles,
  GripVertical,
  Crop,
  Move,
  XCircle,
  Palette,
  Folder,
  FolderPlus,
  Plus,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Settings,
  FileText,
  Save as SaveIcon,
  Edit,
  Check,
  Info,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff
} from "lucide-react";
import "../../custom-css/media-library-table-style.css";
import { useNavigate } from "react-router-dom";

const MediaLibrary = () => {
  const [currentTab, setCurrentTab] = useState("creative-hub");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [myCreations, setMyCreations] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [platform, setPlatform] = useState("instagram");
  const [imageSize, setImageSize] = useState("1080x1350");
  const [customSize, setCustomSize] = useState({ width: "1080", height: "1350" });
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [designName, setDesignName] = useState("Untitled Design");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Editor states
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [canvasElements, setCanvasElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [textContent, setTextContent] = useState("Your text here");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(24);
  const [textFont, setTextFont] = useState("Arial");
  const [selectedTool, setSelectedTool] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [lockedElements, setLockedElements] = useState(new Set());
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [shapeColor, setShapeColor] = useState("#ff0000");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempDesignName, setTempDesignName] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [isExitingEditor, setIsExitingEditor] = useState(false);
  
  // Text formatting states
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [showTextFormatting, setShowTextFormatting] = useState(false);
  
  // Crop state
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [cropStartPos, setCropStartPos] = useState({ x: 0, y: 0 });
  const [cropImageUrl, setCropImageUrl] = useState("");
  const [cropImageSize, setCropImageSize] = useState({ width: 0, height: 0 });
  const [isMovingCrop, setIsMovingCrop] = useState(false);
  const [cropScale, setCropScale] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  
  // Element interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalElement, setOriginalElement] = useState(null);
  const [resizeDirection, setResizeDirection] = useState("");
  
  // Delete confirmation state
  const [showDeleteElementModal, setShowDeleteElementModal] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  
  // Canvas reference
  const canvasContainerRef = useRef(null);
  const cropContainerRef = useRef(null);
  const cropImageRef = useRef(null);

  // Folder system
  const [folders, setFolders] = useState([
    { 
      id: "default", 
      name: "Designs", 
      icon: Folder, 
      color: "#6B7280", 
      isExpanded: true, 
      designs: [],
      isDefault: true 
    },
    { 
      id: "social", 
      name: "Social Media", 
      icon: Folder, 
      color: "#3B82F6", 
      isExpanded: true, 
      designs: [],
      isDefault: false 
    },
    { 
      id: "ads", 
      name: "Advertising", 
      icon: Folder, 
      color: "#10B981", 
      isExpanded: true, 
      designs: [],
      isDefault: false 
    },
    { 
      id: "brand", 
      name: "Branding", 
      icon: Folder, 
      color: "#8B5CF6", 
      isExpanded: true, 
      designs: [],
      isDefault: false 
    }
  ]);
  const [selectedFolder, setSelectedFolder] = useState("default");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6");
  const [draggedDesign, setDraggedDesign] = useState(null);
  const [draggedFolder, setDraggedFolder] = useState(null);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [renamedFolderName, setRenamedFolderName] = useState("");
  const [folderEditColor, setFolderEditColor] = useState("#3B82F6");
  const [tempIsDefault, setTempIsDefault] = useState(false);
  
  // Section visibility
  const [showDraftsSection, setShowDraftsSection] = useState(false);
  const [showFoldersSection, setShowFoldersSection] = useState(true);
  const [showFolderContent, setShowFolderContent] = useState(true);

  // Hidden layers state
  const [hiddenLayers, setHiddenLayers] = useState(new Set());

  // White background layer - FIX 4: Always present
  const [whiteBackgroundLayer, setWhiteBackgroundLayer] = useState({
    id: "white-bg",
    type: "shape",
    shape: "rectangle",
    color: "#FFFFFF",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    locked: true,
    zIndex: -1000
  });

  // Additional color layers
  const [colorLayers, setColorLayers] = useState([]);

  // Platform size presets
  const platformSizes = {
    instagram: [
      { id: "feed-square", name: "Feed (Square)", size: "1080x1080", ratio: "1:1" },
      { id: "feed-vertical", name: "Feed (Vertical)", size: "1080x1350", ratio: "4:5" },
      { id: "story", name: "Story/Reels", size: "1080x1920", ratio: "9:16" }
    ],
    facebook: [
      { id: "feed-square", name: "Feed (Square)", size: "1200x1200", ratio: "1:1" },
      { id: "feed-vertical", name: "Feed (Vertical)", size: "1200x1500", ratio: "4:5" },
      { id: "story", name: "Story", size: "1080x1920", ratio: "9:16" },
      { id: "cover", name: "Cover Photo", size: "820x312", ratio: "~2.6:1" }
    ],
    both: [
      { id: "universal", name: "Universal", size: "1200x1200", ratio: "1:1" },
      { id: "mobile-feed", name: "Mobile Feed", size: "1080x1350", ratio: "4:5" },
      { id: "story", name: "Stories/Reels", size: "1080x1920", ratio: "9:16" }
    ]
  };

  // Available shapes
  const shapes = [
    { id: "rectangle", name: "Rectangle", icon: Square },
    { id: "circle", name: "Circle", icon: Circle },
    { id: "triangle", name: "Triangle", icon: Triangle },
    { id: "star", name: "Star", icon: Star },
    { id: "heart", name: "Heart", icon: Heart },
  ];

  // Canvas dimensions based on selected size
  const getCanvasDimensions = () => {
    const [width, height] = imageSize.split('x').map(Number);
    const maxWidth = 800;
    const maxHeight = 600;
    
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

  // Calculate aspect ratio for design cards
  const getDesignAspectRatioStyle = (size) => {
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
    const cardWidth = 200;
    const calculatedHeight = cardWidth * ratio;
    const maxHeight = 200;
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

  // Handle platform change
const handlePlatformChange = (newPlatform) => {
  setPlatform(newPlatform);
  
  if (newPlatform === "custom") {
    setShowCustomSize(true);
    if (imageSize && imageSize.includes('x')) {
      const [width, height] = imageSize.split('x');
      setCustomSize({ width, height });
    }
  } else {
    setShowCustomSize(false);
    if (platformSizes[newPlatform] && platformSizes[newPlatform][0]) {
      setImageSize(platformSizes[newPlatform][0].size);
    }
  }
};

// Verbesserte Error Handling
const handleCustomSizeChange = (dimension, value) => {
  try {
    const numValue = value.replace(/\D/g, '');
    
    if (numValue === '') {
      setCustomSize(prev => ({ ...prev, [dimension]: '' }));
      return;
    }
    
    const numericValue = parseInt(numValue);
    
    if (numericValue < 100) {
      alert("Minimum size is 100 pixels");
      return;
    }
    
    if (numericValue > 5000) {
      alert("Maximum size is 5000 pixels");
      return;
    }
    
    setCustomSize(prev => ({
      ...prev,
      [dimension]: numValue
    }));
    
  } catch (error) {
    console.error("Error handling custom size change:", error);
  }
};

const applyCustomSize = () => {
  const width = parseInt(customSize.width);
  const height = parseInt(customSize.height);
  
  if (isNaN(width) || isNaN(height) || width < 100 || height < 100) {
    alert("Minimum size is 100x100 pixels");
    return;
  }
  
  if (width > 5000 || height > 5000) {
    alert("Maximum size is 5000x5000 pixels");
    return;
  }
  
setImageSize(`${width}x${height}`);  // ✅ MIT Backtick am Anfang
  setShowCustomSize(false);
  
  setTimeout(() => {
    const canvasDim = getCanvasDimensions();
    console.log("New canvas dimensions:", canvasDim);
  }, 100);
};

  // Open editor with save draft check
  const openEditorModal = () => {
    setTempDesignName("Untitled Design");
    const defaultFolder = folders.find(f => f.isDefault);
    if (defaultFolder) {
      setSelectedFolder(defaultFolder.id);
    }
    setShowNameModal(true);
  };

  // Handle exit editor with save draft option
  const handleExitEditor = () => {
    if (canvasElements.length > 0) {
      setIsExitingEditor(true);
      setShowSaveDraftModal(true);
    } else {
      setEditorModalOpen(false);
      setCanvasElements([]);
      setActiveElementId(null);
      setHiddenLayers(new Set());
    }
  };


// Generate thumbnail for designs and drafts - FIX 2: Fixed preview rendering
const generateThumbnail = (elements, size) => {
  return new Promise((resolve) => {
    try {
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
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Sort elements by zIndex (lowest first = background)
      const sortedElements = [...elements]
        .filter(el => !hiddenLayers.has(el.id))
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      
      // Check if there are images that need loading
      const imageElements = sortedElements.filter(el => el.type === 'image');
      
      if (imageElements.length === 0) {
        // No images, draw immediately
        drawElements(ctx, sortedElements, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/png'));
      } else {
        // Load images first
        let imagesLoaded = 0;
        const totalImages = imageElements.length;
        
        imageElements.forEach(element => {
          const img = new Image();
          img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
              drawElements(ctx, sortedElements, targetWidth, targetHeight);
              resolve(canvas.toDataURL('image/png'));
            }
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
              drawElements(ctx, sortedElements, targetWidth, targetHeight);
              resolve(canvas.toDataURL('image/png'));
            }
          };
          img.src = element.content;
        });
        
        // Timeout fallback (3 seconds)
        setTimeout(() => {
          if (imagesLoaded < totalImages) {
            drawElements(ctx, sortedElements, targetWidth, targetHeight);
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

// Helper function to draw all elements
const drawElements = (ctx, elements, targetWidth, targetHeight) => {
  const canvasDim = getCanvasDimensions();
  
  elements.forEach(element => {
    if (element.type === 'text') {
      const scaleX = targetWidth / canvasDim.width;
      const scaleY = targetHeight / canvasDim.height;
      
      ctx.fillStyle = element.color;
      ctx.font = `${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${element.size * scaleY}px ${element.font}`;
      ctx.textAlign = element.align || 'left';
      
      const x = element.x * scaleX;
      const y = element.y * scaleY + element.size * scaleY;
      
      ctx.fillText(element.content, x, y);
      
    } else if (element.type === 'shape') {
      ctx.fillStyle = element.color;
      
      const x = element.x * (targetWidth / canvasDim.width);
      const y = element.y * (targetHeight / canvasDim.height);
      const width = element.width * (targetWidth / canvasDim.width);
      const height = element.height * (targetHeight / canvasDim.height);
      
      if (element.shape === 'rectangle') {
        ctx.fillRect(x, y, width, height);
      } else if (element.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Add other shapes as needed
      
    } else if (element.type === 'image' && element.content) {
      const img = new Image();
      img.src = element.content;
      
      const x = element.x * (targetWidth / canvasDim.width);
      const y = element.y * (targetHeight / canvasDim.height);
      const width = element.width * (targetWidth / canvasDim.width);
      const height = element.height * (targetHeight / canvasDim.height);
      
      try {
        ctx.drawImage(img, x, y, width, height);
      } catch (e) {
        console.warn("Could not draw image:", e);
      }
    }
  });
};

  const saveAsDraft = async () => {
    if (!canvasElements.length) return;
    
    try {
      const thumbnail = await generateThumbnail(canvasElements, imageSize);
      
      const draft = {
        id: Date.now(),
        name: designName || "Untitled Draft",
        platform: platform,
        size: imageSize,
        elements: [...canvasElements],
        createdAt: new Date().toISOString(),
        thumbnail: thumbnail
      };
      
      setDrafts(prev => [...prev, draft]);
      setShowSaveDraftModal(false);
      setIsExitingEditor(false);
      setEditorModalOpen(false);
      setCanvasElements([]);
      setActiveElementId(null);
      setHiddenLayers(new Set());
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error saving draft. Please try again.");
    }
  };

  const handleNameSubmit = () => {
    if (tempDesignName.trim()) {
      setDesignName(tempDesignName);
      setShowNameModal(false);
      setShowUploadOptions(true);
    }
  };

  const handleUploadOption = (option) => {
    setShowUploadOptions(false);
    
    if (option === 'upload') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const image = {
            id: Date.now(),
            name: file.name,
            url: URL.createObjectURL(file),
            platform: platform,
            size: imageSize,
            uploadedAt: new Date().toISOString()
          };
          
          setUploadedImages(prev => [...prev, image]);
          setCropImageUrl(image.url);
          setCropModalOpen(true);
          
          const img = new Image();
          img.onload = () => {
            setCropImageSize({ width: img.width, height: img.height });
            
            const [targetWidth, targetHeight] = imageSize.split('x').map(Number);
            const targetRatio = targetWidth / targetHeight;
            const imageRatio = img.width / img.height;
            
            let cropWidth, cropHeight;
            let cropX = 0, cropY = 0;
            
            if (imageRatio > targetRatio) {
              // Image is wider than target
              cropHeight = img.height;
              cropWidth = cropHeight * targetRatio;
              cropX = (img.width - cropWidth) / 2;
            } else {
              // Image is taller than target
              cropWidth = img.width;
              cropHeight = cropWidth / targetRatio;
              cropY = (img.height - cropHeight) / 2;
            }
            
            setCropArea({
              x: cropX,
              y: cropY,
              width: cropWidth,
              height: cropHeight
            });
            
            // Calculate initial scale
            const containerWidth = 800;
            const containerHeight = 600;
            const scaleX = containerWidth / img.width;
            const scaleY = containerHeight / img.height;
            const scale = Math.min(scaleX, scaleY) * 0.9;
            
            setCropScale(scale);
            setCropPosition({ x: 0, y: 0 });
          };
          img.src = image.url;
        }
      };
      input.click();
    } else if (option === 'ai') {
      alert("AI Generation feature would open here");
    }
  };

  // Folder management
  const createNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        icon: Folder,
        color: newFolderColor,
        isExpanded: true,
        designs: [],
        isDefault: false
      };
      
      setFolders(prev => [...prev, newFolder]);
      setSelectedFolder(newFolder.id);
      setNewFolderName("");
      setNewFolderColor("#3B82F6");
      setIsCreatingFolder(false);
    }
  };

  // Open edit folder modal
  const openEditFolderModal = (folder) => {
    setFolderToRename(folder);
    setRenamedFolderName(folder.name);
    setFolderEditColor(folder.color);
    setTempIsDefault(folder.isDefault);
    setShowRenameFolderModal(true);
  };

  // Edit folder
  const editFolder = () => {
    if (folderToRename && renamedFolderName.trim()) {
      setFolders(prev => 
        prev.map(folder => {
          if (folder.id === folderToRename.id) {
            const updatedFolder = { 
              ...folder, 
              name: renamedFolderName,
              color: folderEditColor
            };
            
            if (tempIsDefault && !folder.isDefault) {
              return { ...updatedFolder, isDefault: true };
            } else if (!tempIsDefault && folder.isDefault) {
              return { ...updatedFolder, isDefault: false };
            }
            return updatedFolder;
          } else if (tempIsDefault) {
            return { ...folder, isDefault: false };
          }
          return folder;
        })
      );
      
      setShowRenameFolderModal(false);
      setFolderToRename(null);
      setRenamedFolderName("");
      setFolderEditColor("#3B82F6");
      setTempIsDefault(false);
    }
  };

  // Delete folder with confirmation modal
  const confirmDeleteFolder = (folder) => {
    if (folder.isDefault) {
      const otherFolders = folders.filter(f => f.id !== folder.id);
      if (otherFolders.length > 0) {
        setFolders(prev => 
          prev.map(f => 
            f.id === otherFolders[0].id 
              ? { ...f, isDefault: true }
              : f
          )
        );
      }
    }
    
    setFolderToDelete(folder);
    setShowDeleteFolderModal(true);
  };

  const deleteFolderConfirmed = () => {
    if (!folderToDelete) return;
    
    const defaultFolder = folders.find(f => f.isDefault) || folders[0];
    setMyCreations(prev => 
      prev.map(creation => 
        creation.folderId === folderToDelete.id
          ? { ...creation, folderId: defaultFolder.id }
          : creation
      )
    );
    
    setFolders(prev => prev.filter(f => f.id !== folderToDelete.id));
    if (selectedFolder === folderToDelete.id) {
      setSelectedFolder(defaultFolder.id);
    }
    
    setShowDeleteFolderModal(false);
    setFolderToDelete(null);
  };

  // Improved Drag and Drop for folders
  const handleFolderDragStart = (e, folderId) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', folderId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedFolder(folderId);
  };

  const handleFolderDragOver = (e, targetFolderId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedFolderId = e.dataTransfer.getData('text/plain');
    if (!draggedFolderId || draggedFolderId === targetFolderId) return;
    
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.transition = 'transform 0.2s ease';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
  };

  const handleFolderDragLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleFolderDrop = (e, targetFolderId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedFolderId = e.dataTransfer.getData('text/plain');
    if (!draggedFolderId || draggedFolderId === targetFolderId) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = 'none';
      return;
    }
    
    const draggedIndex = folders.findIndex(f => f.id === draggedFolderId);
    const targetIndex = folders.findIndex(f => f.id === targetFolderId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newFolders = [...folders];
      const [draggedFolder] = newFolders.splice(draggedIndex, 1);
      newFolders.splice(targetIndex, 0, draggedFolder);
      
      setFolders(newFolders);
    }
    
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
    setDraggedFolder(null);
  };

  // Improved Drag and Drop for designs
  const handleDesignDragStart = (e, design) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/json', JSON.stringify(design));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDesign(design.id);
  };

  const handleFolderDragOverDesign = (e, folderId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const designData = e.dataTransfer.getData('application/json');
    if (!designData) return;
    
    e.dataTransfer.dropEffect = 'move';
    const folderElement = e.currentTarget;
    
    // Visual feedback - FIX 1: Only highlight if folder has designs
    const hasDesigns = getDesignsForFolder(folderId).length > 0;
    folderElement.style.transform = 'translateY(-2px)';
    folderElement.style.transition = 'all 0.2s ease';
    folderElement.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
    folderElement.style.border = '2px solid #3B82F6';
    folderElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
  };

  const handleFolderDragLeaveDesign = (e) => {
    e.stopPropagation();
    const folderElement = e.currentTarget;
    
    folderElement.style.transform = 'translateY(0)';
    folderElement.style.boxShadow = 'none';
    folderElement.style.border = 'none';
    folderElement.style.backgroundColor = '';
  };

 const handleFolderDropDesign = (e, folderId) => {
  e.preventDefault();
  e.stopPropagation();
  
  const designData = e.dataTransfer.getData('application/json');
  if (!designData) return;
  
  try {
    const design = JSON.parse(designData);
    
    // Design dem neuen Ordner zuweisen
    setMyCreations(prev => 
      prev.map(creation => {
        if (creation.id === design.id) {
          return { ...creation, folderId };
        }
        return creation;
      })
    );
    
    // Visual feedback for successful drop
    const folderElement = e.currentTarget;
    folderElement.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
    setTimeout(() => {
      folderElement.style.transform = 'translateY(0)';
      folderElement.style.boxShadow = 'none';
      folderElement.style.border = 'none';
      folderElement.style.backgroundColor = '';
    }, 300);
    
    // State zurücksetzen (nur einmal!)
    setDraggedDesign(null);
    setSelectedFolder(folderId);
    
  } catch (error) {
    console.error("Error parsing design data:", error);
  }
};

  // Handle design drag end
  const handleDesignDragEnd = (e) => {
    e.stopPropagation();
    setDraggedDesign(null);
    
    document.querySelectorAll('[data-folder-id]').forEach(el => {
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = 'none';
      el.style.border = 'none';
      el.style.backgroundColor = '';
    });
  };

  const getDesignsForFolder = (folderId) => {
  return myCreations.filter(creation => creation.folderId === folderId);
};

// FIX 1: Folder tiles - only dimmed when empty
const getFolderStyle = (folder) => {
  const hasDesigns = getDesignsForFolder(folder.id).length > 0;
  const isSelected = selectedFolder === folder.id;
  const isDragged = draggedDesign === folder.id;
  
  return {
    backgroundColor: hasDesigns 
      ? 'rgb(31 41 55)'  // Solid when has designs
      : 'rgba(31, 41, 55, 0.5)', // Dimmed when empty
    opacity: isDragged ? 0.5 : 1,
    border: isSelected ? '1px solid #F27A30' : 'none',
    transition: 'all 0.2s ease'
  };
};

  const handleDeleteCreation = (id, e) => {
    e.stopPropagation();
    const creation = myCreations.find(c => c.id === id);
    if (creation && window.confirm(`Are you sure you want to delete the design "${creation.name}"?`)) {
      setMyCreations(prev => prev.filter(creation => creation.id !== id));
    }
  };

  const handleDeleteDraft = (id, e) => {
    e.stopPropagation();
    const draft = drafts.find(d => d.id === id);
    if (draft && window.confirm(`Are you sure you want to delete the draft "${draft.name}"?`)) {
      setDrafts(prev => prev.filter(draft => draft.id !== id));
    }
  };

  // Confirm delete element
  const confirmDeleteElement = (id, e) => {
    e.stopPropagation();
    if (lockedElements.has(id)) return;
    
    setElementToDelete(id);
    setShowDeleteElementModal(true);
  };

  const deleteElementConfirmed = () => {
    if (!elementToDelete) return;
    
    setCanvasElements(prev => prev.filter(el => el.id !== elementToDelete));
    if (activeElementId === elementToDelete) {
      setActiveElementId(null);
    }
    setLockedElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementToDelete);
      return newSet;
    });
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementToDelete);
      return newSet;
    });
    
    setShowDeleteElementModal(false);
    setElementToDelete(null);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editorModalOpen) return;
      
      // Delete key
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeElementId) {
        e.preventDefault();
        confirmDeleteElement(activeElementId, { stopPropagation: () => {} });
      }
      
      // Escape key
      if (e.key === 'Escape') {
        setActiveElementId(null);
      }
      
      // Text formatting shortcuts
      if (activeElementId && canvasElements.find(el => el.id === activeElementId)?.type === 'text') {
        const element = canvasElements.find(el => el.id === activeElementId);
        if (e.ctrlKey || e.metaKey) {
          switch(e.key) {
            case 'b':
              e.preventDefault();
              setTextBold(!textBold);
              updateTextElement(textContent);
              break;
            case 'i':
              e.preventDefault();
              setTextItalic(!textItalic);
              updateTextElement(textContent);
              break;
            case 'u':
              e.preventDefault();
              setTextUnderline(!textUnderline);
              updateTextElement(textContent);
              break;
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorModalOpen, activeElementId, canvasElements, textBold, textItalic, textUnderline]);

  // FIX 6: Improved Crop Functions - YouTube-style cropping
  const handleCropStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = cropContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is inside crop overlay
    const overlayRect = cropContainerRef.current.querySelector('.crop-overlay')?.getBoundingClientRect();
    if (!overlayRect) return;
    
    const relativeX = x - (rect.width - overlayRect.width) / 2;
    const relativeY = y - (rect.height - overlayRect.height) / 2;
    
    if (relativeX >= 0 && relativeX <= overlayRect.width && 
        relativeY >= 0 && relativeY <= overlayRect.height) {
      setIsMovingCrop(true);
      setCropStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCropMove = (e) => {
    if (!isMovingCrop || !cropContainerRef.current || !cropImageRef.current) return;
    
    const deltaX = e.clientX - cropStartPos.x;
    const deltaY = e.clientY - cropStartPos.y;
    
    const img = cropImageRef.current;
    const containerRect = cropContainerRef.current.getBoundingClientRect();
    
    // Calculate maximum movement bounds
    const maxX = (img.width * cropScale - containerRect.width) / 2;
    const maxY = (img.height * cropScale - containerRect.height) / 2;
    
    let newX = cropPosition.x + deltaX / cropScale;
    let newY = cropPosition.y + deltaY / cropScale;
    
    // Constrain to image bounds
    newX = Math.max(-maxX / cropScale, Math.min(newX, maxX / cropScale));
    newY = Math.max(-maxY / cropScale, Math.min(newY, maxY / cropScale));
    
    setCropPosition({ x: newX, y: newY });
    setCropStartPos({ x: e.clientX, y: e.clientY });
    
    // Update crop area based on position
    const [targetWidth, targetHeight] = imageSize.split('x').map(Number);
    const targetRatio = targetWidth / targetHeight;
    
    const cropWidth = cropImageSize.width;
    const cropHeight = cropImageSize.height / targetRatio;
    
    const cropX = (cropImageSize.width / 2) + newX - (cropWidth / 2);
    const cropY = (cropImageSize.height / 2) + newY - (cropHeight / 2);
    
    setCropArea({
      x: Math.max(0, Math.min(cropX, cropImageSize.width - cropWidth)),
      y: Math.max(0, Math.min(cropY, cropImageSize.height - cropHeight)),
      width: cropWidth,
      height: cropHeight
    });
  };

  const handleCropEnd = () => {
    setIsMovingCrop(false);
  };

  const handleCropScale = (delta) => {
    const newScale = Math.max(0.1, Math.min(3, cropScale + delta));
    setCropScale(newScale);
  };

  const handleCrop = () => {
    if (!cropImageUrl) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      const [targetWidth, targetHeight] = imageSize.split('x').map(Number);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Draw cropped portion
      ctx.drawImage(
        image,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, targetWidth, targetHeight
      );
      
      const croppedImageUrl = canvas.toDataURL('image/png');
      
      setEditorModalOpen(true);
      setCropModalOpen(false);
      
      const canvasDim = getCanvasDimensions();
      
      // FIX 4: White background layer (always present)
      const whiteBg = {
        id: "white-bg",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: canvasDim.width,
        height: canvasDim.height,
        locked: true,
        zIndex: -1000
      };
      
      const backgroundElement = {
        id: Date.now(),
        type: "image",
        content: croppedImageUrl,
        x: 0,
        y: 0,
        width: canvasDim.width,
        height: canvasDim.height,
        originalWidth: targetWidth,
        originalHeight: targetHeight,
        locked: false,
        zIndex: 0
      };
      
      setCanvasElements([whiteBg, backgroundElement]);
      setWhiteBackgroundLayer(whiteBg);
      setActiveElementId(null);
    };
    
    image.src = cropImageUrl;
  };

  // Element interaction
  const handleElementMouseDown = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = canvasElements.find(el => el.id === id);
    if (!element || lockedElements.has(id)) return;
    
    setActiveElementId(id);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasContainerRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    // Check if mouse is on resize handle
    const isResizeHandle = 
      localX >= rect.width - 12 && localX <= rect.width &&
      localY >= rect.height - 12 && localY <= rect.height;
    
    if (isResizeHandle) {
      setIsResizing(true);
      setResizeDirection("se");
      setOriginalElement({ ...element });
    } else {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - canvasRect.left - element.x, 
        y: e.clientY - canvasRect.top - element.y 
      });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasContainerRef.current) return;
    
    const canvasRect = canvasContainerRef.current.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;
    
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    
    if (isDragging && activeElementId) {
      const element = canvasElements.find(el => el.id === activeElementId);
      if (!element || lockedElements.has(activeElementId)) return;
      
      let newX = mouseX - dragStart.x;
      let newY = mouseY - dragStart.y;
      
      // Boundary constraints
      newX = Math.max(0, Math.min(newX, canvasWidth - element.width));
      newY = Math.max(0, Math.min(newY, canvasHeight - element.height));
      
      setCanvasElements(prev => 
        prev.map(el => 
          el.id === activeElementId 
            ? { ...el, x: newX, y: newY }
            : el
        )
      );
    }
    
    if (isResizing && activeElementId) {
      const element = canvasElements.find(el => el.id === activeElementId);
      if (!element || lockedElements.has(activeElementId)) return;
      
      const minSize = 20;
      let newWidth = Math.max(minSize, mouseX - element.x);
      let newHeight = Math.max(minSize, mouseY - element.y);
      
      // Boundary constraints for resizing
      newWidth = Math.min(newWidth, canvasWidth - element.x);
      newHeight = Math.min(newHeight, canvasHeight - element.y);
      
      // Maintain aspect ratio for images
      if (element.type === "image" && element.originalWidth && element.originalHeight) {
        const aspectRatio = element.originalWidth / element.originalHeight;
        newHeight = newWidth / aspectRatio;
        
        if (newHeight > canvasHeight - element.y) {
          newHeight = canvasHeight - element.y;
          newWidth = newHeight * aspectRatio;
        }
      }
      
      setCanvasElements(prev => 
        prev.map(el => 
          el.id === activeElementId 
            ? { ...el, width: newWidth, height: newHeight }
            : el
        )
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection("");
  };

  const handleCanvasClick = (e) => {
    if (!e.defaultPrevented) {
      const canvasContainer = canvasContainerRef.current;
      if (canvasContainer && e.target === canvasContainer) {
        setActiveElementId(null);
      }
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsMovingCrop(false);
      setIsCropping(false);
      setResizeDirection("");
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Text element
  const addTextElement = () => {
    const canvasDim = getCanvasDimensions();
    const newElement = {
      id: Date.now(),
      type: "text",
      content: textContent,
      color: textColor,
      size: textSize,
      font: textFont,
      bold: textBold,
      italic: textItalic,
      underline: textUnderline,
      align: textAlign,
      x: canvasDim.width / 2 - 100,
      y: canvasDim.height / 2 - 20,
      width: 200,
      height: 40,
      locked: false,
      zIndex: canvasElements.length
    };
    setCanvasElements(prev => [...prev, newElement]);
    setActiveElementId(newElement.id);
    setSelectedTool("text");
    setShowTextFormatting(true);
  };

  // Shape element - FIX 4: No automatic shape added
  const addShapeElement = (shapeType) => {
    const canvasDim = getCanvasDimensions();
    const newElement = {
      id: Date.now(),
      type: "shape",
      shape: shapeType,
      color: shapeColor,
      x: canvasDim.width / 2 - 50,
      y: canvasDim.height / 2 - 50,
      width: 100,
      height: 100,
      locked: false,
      zIndex: canvasElements.length
    };
    setCanvasElements(prev => [...prev, newElement]);
    setActiveElementId(newElement.id);
    setShowShapeMenu(false);
  };

  // FIX 4: Add color layer (additional to white background)
  const addColorLayer = () => {
    const canvasDim = getCanvasDimensions();
    const newColorLayer = {
      id: `color-layer-${Date.now()}`,
      type: "shape",
      shape: "rectangle",
      color: "#FF0000",
      x: 0,
      y: 0,
      width: canvasDim.width,
      height: canvasDim.height,
      locked: false,
      zIndex: canvasElements.length - 500 // Above white bg, below other elements
    };
    
    setCanvasElements(prev => [...prev, newColorLayer]);
    setColorLayers(prev => [...prev, newColorLayer]);
    setActiveElementId(newColorLayer.id);
  };

  // FIX 4: Update white background color
  const updateWhiteBackgroundColor = (color) => {
    setWhiteBackgroundLayer(prev => ({
      ...prev,
      color
    }));
    
    setCanvasElements(prev => 
      prev.map(el => 
        el.id === "white-bg" 
          ? { ...el, color }
          : el
      )
    );
  };

  // Image element
  const addImageElement = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        
        const img = new Image();
        img.onload = () => {
          const canvasDim = getCanvasDimensions();
          const scale = Math.min(
            canvasDim.width / img.width * 0.5,
            canvasDim.height / img.height * 0.5
          );
          
          const newElement = {
            id: Date.now(),
            type: "image",
            content: imageUrl,
            x: canvasDim.width / 2 - (img.width * scale) / 2,
            y: canvasDim.height / 2 - (img.height * scale) / 2,
            width: img.width * scale,
            height: img.height * scale,
            originalWidth: img.width,
            originalHeight: img.height,
            locked: false,
            zIndex: canvasElements.length
          };
          setCanvasElements(prev => [...prev, newElement]);
          setActiveElementId(newElement.id);
        };
        img.src = imageUrl;
      }
    };
    input.click();
  };

  const handleTextDoubleClick = (id) => {
    const element = canvasElements.find(el => el.id === id);
    if (element && element.type === "text") {
      setTextContent(element.content);
      setTextColor(element.color);
      setTextSize(element.size);
      setTextFont(element.font || "Arial");
      setTextBold(element.bold || false);
      setTextItalic(element.italic || false);
      setTextUnderline(element.underline || false);
      setTextAlign(element.align || "left");
      setActiveElementId(id);
      setSelectedTool("text");
      setShowTextFormatting(true);
    }
  };

  // Update text element with formatting
  const updateTextElement = (content = textContent) => {
    if (!activeElementId || lockedElements.has(activeElementId)) return;
    
    setCanvasElements(prev => prev.map(el => {
      if (el.id === activeElementId && el.type === "text") {
        const updatedElement = {
          ...el,
          content: content,
          color: textColor,
          size: textSize,
          font: textFont,
          bold: textBold,
          italic: textItalic,
          underline: textUnderline,
          align: textAlign
        };
        
        return updatedElement;
      }
      return el;
    }));
  };

  // Live Text-Update
  const handleTextChange = (e) => {
    const newContent = e.target.value;
    setTextContent(newContent);
    updateTextElement(newContent);
  };

  const updateShapeElement = () => {
    if (!activeElementId || lockedElements.has(activeElementId)) return;
    
    setCanvasElements(prev => prev.map(el => {
      if (el.id === activeElementId && el.type === "shape") {
        return {
          ...el,
          color: shapeColor
        };
      }
      return el;
    }));
  };

  const toggleElementLock = (id, e) => {
    e.stopPropagation();
    setLockedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Layer visibility toggle
  const toggleLayerVisibility = (id, e) => {
    e.stopPropagation();
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Layer drag and drop reorder
  const handleLayerDragStart = (e, elementId) => {
    e.dataTransfer.setData('text/plain', elementId.toString());
  };

  const handleLayerDragOver = (e) => {
    e.preventDefault();
  };

  const handleLayerDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;
    
    const draggedElement = canvasElements.find(el => el.id.toString() === draggedId);
    if (!draggedElement) return;
    
    const currentIndex = canvasElements.findIndex(el => el.id.toString() === draggedId);
    if (currentIndex === targetIndex) return;
    
    const newElements = [...canvasElements];
    newElements.splice(currentIndex, 1);
    newElements.splice(targetIndex, 0, draggedElement);
    
    // Update z-index based on position
    const updatedElements = newElements.map((el, index) => ({
      ...el,
      zIndex: index
    }));
    
    setCanvasElements(updatedElements);
  };

  // Check for duplicate design names
  const isDesignNameDuplicate = (name) => {
    return myCreations.some(creation => 
      creation.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Save creation with proper thumbnail
  const saveCreation = async (overwrite = false) => {
    if (!canvasElements.length) {
      alert("Please add some elements to save your creation!");
      return;
    }
    
    try {
      const thumbnail = await generateThumbnail(canvasElements, imageSize);
      
      if (!overwrite && isDesignNameDuplicate(designName)) {
        if (window.confirm(`A design named "${designName}" already exists. Do you want to overwrite it?`)) {
          setMyCreations(prev => prev.filter(creation => 
            creation.name.toLowerCase() !== designName.toLowerCase()
          ));
        } else {
          return;
        }
      }
      
      const creation = {
        id: Date.now(),
        name: designName,
        platform: platform,
        size: imageSize,
        elements: [...canvasElements],
        folderId: selectedFolder,
        createdAt: new Date().toISOString(),
        thumbnail: thumbnail
      };
      
      setMyCreations(prev => [...prev, creation]);
      setEditorModalOpen(false);
      setIsExitingEditor(false);
      setCanvasElements([]);
      setActiveElementId(null);
      setHiddenLayers(new Set());
    } catch (error) {
      console.error("Error saving creation:", error);
      alert("Error saving design. Please try again.");
    }
  };

  // Handle saving from editor with overwrite check
  const handleSaveFromEditor = async () => {
    const existingDesign = myCreations.find(creation => 
      creation.name === designName && 
      creation.size === imageSize
    );
    
    if (existingDesign) {
      if (window.confirm(`Do you want to overwrite the existing design "${designName}"?`)) {
        setMyCreations(prev => prev.filter(creation => 
          !(creation.name === designName && creation.size === imageSize)
        ));
        await saveCreation(true);
      }
    } else {
      await saveCreation(false);
    }
  };

  const downloadCreation = async (creation) => {
    try {
      if (!creation.thumbnail) {
        const thumbnail = await generateThumbnail(creation.elements, creation.size);
        creation.thumbnail = thumbnail;
      }
      
      const link = document.createElement('a');
      link.href = creation.thumbnail;
      link.download = `${creation.name}_${creation.size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading creation:", error);
      alert("Error downloading design. Please try again.");
    }
  };

  const renderShape = (shape, color, width, height) => {
    switch (shape) {
      case "rectangle":
        return <div style={{ width: '100%', height: '100%', backgroundColor: color }}></div>;
      case "circle":
        return <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '50%' }}></div>;
      case "triangle":
        return <div style={{
          width: '100%',
          height: '100%',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          backgroundColor: color
        }}></div>;
      case "star":
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <polygon points="12,2 15,9 22,9 16,14 19,21 12,17 5,21 8,14 2,9 9,9" />
          </svg>
        );
      case "heart":
        return (
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      default:
        return <div style={{ width: '100%', height: '100%', backgroundColor: color }}></div>;
    }
  };

  const canvasDim = getCanvasDimensions();
  const defaultFolder = folders.find(f => f.isDefault);

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] lg:p-4 md:p-3 sm:p-2 p-1">
      <div className="rounded-xl lg:p-4 md:p-3 sm:p-2 p-2 w-full overflow-hidden">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl oxanium_font text-white mb-1">Media Library</h1>
        </div>

        {/* Main Content Area */}
        <div className="bg-[#141414] rounded-xl p-4">
          {/* Platform and Create Button */}
          <div className="flex flex-wrap gap-4 mb-6 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${platform === "instagram" ? "text-white" : "text-gray-300 hover:bg-gray-700"}`}
                    onClick={() => handlePlatformChange("instagram")}
                    style={{
                      background: platform === "instagram" 
                        ? 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)'
                        : 'transparent',
                      border: platform === "instagram" ? 'none' : '1px solid #374151',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Instagram
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${platform === "facebook" ? "text-white" : "text-gray-300 hover:bg-gray-700"}`}
                    onClick={() => handlePlatformChange("facebook")}
                    style={{
                      background: platform === "facebook" 
                        ? 'linear-gradient(45deg, #1877F2, #0D8AF0)'
                        : 'transparent',
                      border: platform === "facebook" ? 'none' : '1px solid #374151',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Facebook
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${platform === "both" ? "text-white" : "text-gray-300 hover:bg-gray-700"}`}
                    onClick={() => handlePlatformChange("both")}
                    style={{
                      background: platform === "both" 
                        ? 'linear-gradient(45deg, #F27A30, #FF8C42)'
                        : 'transparent',
                      border: platform === "both" ? 'none' : '1px solid #374151',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Both
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${platform === "custom" ? "bg-[#F27A30] text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                    onClick={() => handlePlatformChange("custom")}
                  >
                    Custom
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Image Size</label>
                {showCustomSize ? (
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                      <input
                        type="text"
                        value={customSize.width}
                        onChange={(e) => handleCustomSizeChange('width', e.target.value)}
                        className="w-20 bg-transparent text-white text-center outline-none"
                        placeholder="Width"
                      />
                      <span className="text-gray-400">×</span>
                      <input
                        type="text"
                        value={customSize.height}
                        onChange={(e) => handleCustomSizeChange('height', e.target.value)}
                        className="w-20 bg-transparent text-white text-center outline-none"
                        placeholder="Height"
                      />
                      <span className="text-gray-400 text-sm">px</span>
                    </div>
                    <button
                      onClick={applyCustomSize}
                      className="bg-[#F27A30] text-white px-3 py-2 rounded-lg hover:bg-[#e6691d]"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomSize(false);
                        handlePlatformChange("instagram");
                      }}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    className="bg-gray-800 text-white rounded-lg p-2 text-sm w-64"
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                  >
                    {platformSizes[platform].map((size) => (
                      <option key={size.id} value={size.size}>
                        {size.name} ({size.size})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={openEditorModal}
                className="flex items-center gap-2 bg-[#F27A30] text-white px-5 py-2.5 rounded-lg hover:bg-[#e6691d] transition-colors"
              >
                <Plus size={18} />
                Create New Design
              </button>
            </div>
          </div>
          
          {/* Folders Section - FIX 1: Only dim empty folders */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowFoldersSection(!showFoldersSection)}
                className="flex items-center gap-2 text-white text-lg hover:text-[#F27A30]"
              >
                {showFoldersSection ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                <Folder size={20} />
                <span>Folders ({folders.length})</span>
              </button>
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="flex items-center gap-2 text-[#F27A30] hover:text-[#e6691d]"
              >
                <FolderPlus size={18} />
                <span>New Folder</span>
              </button>
            </div>
            
            {showFoldersSection && (
              <>
                {isCreatingFolder && (
                  <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Folder name"
                          className="flex-1 bg-gray-700 text-white rounded-lg p-2"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') createNewFolder();
                            if (e.key === 'Escape') setIsCreatingFolder(false);
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newFolderColor}
                            onChange={(e) => setNewFolderColor(e.target.value)}
                            className="w-10 h-10 cursor-pointer rounded-lg border-2 border-gray-600"
                            title="Folder color"
                            style={{
                              width: '40px',
                              height: '40px',
                              padding: 0,
                              border: '2px solid #4B5563'
                            }}
                          />
                          <button
                            onClick={createNewFolder}
                            className="bg-[#F27A30] text-white px-4 py-2 rounded-lg hover:bg-[#e6691d]"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => setIsCreatingFolder(false)}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {folders.map((folder) => {
                    const hasDesigns = getDesignsForFolder(folder.id).length > 0;
                    return (
                      <div
                        key={folder.id}
                        className={`rounded-lg p-4 cursor-pointer transition-all design-item ${selectedFolder === folder.id ? 'ring-2 ring-[#F27A30]' : 'hover:ring-1 hover:ring-gray-600'} ${draggedFolder === folder.id ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedFolder(folder.id)}
                        draggable
                        onDragStart={(e) => handleFolderDragStart(e, folder.id)}
                        onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                        onDragLeave={handleFolderDragLeave}
                        onDrop={(e) => {
                          const data = e.dataTransfer.getData('text/plain');
                          const jsonData = e.dataTransfer.getData('application/json');
                          
                          if (data && !jsonData) {
                            handleFolderDrop(e, folder.id);
                          } else if (jsonData) {
                            handleFolderDropDesign(e, folder.id);
                          }
                        }}
                        data-folder-id={folder.id}
                        style={getFolderStyle(folder)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${folder.color}20` }}
                            >
                              <folder.icon size={18} style={{ color: folder.color }} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{folder.name}</span>
                              {folder.isDefault && (
                                <span className="text-xs text-gray-400 mt-0.5 bg-gray-700 px-2 py-1 rounded inline-block w-fit">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditFolderModal(folder);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-400"
                              title="Edit folder"
                            >
                              <Edit size={16} />
                            </button>
                            {!folder.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDeleteFolder(folder);
                                }}
                                className="p-1 text-gray-400 hover:text-red-400"
                                title="Delete folder"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm flex justify-between items-center">
                          <span>{getDesignsForFolder(folder.id).length} designs</span>
                          {!hasDesigns && (
                            <span className="text-xs text-gray-500 italic">Empty</span>
                          )}
                          <GripVertical size={14} className="text-gray-500 cursor-grab" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          
          {/* Folder Content Section - FIX 2: Preview visible */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowFolderContent(!showFolderContent)}
                className="flex items-center gap-2 text-white text-lg hover:text-[#F27A30]"
              >
                {showFolderContent ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                <span>
                  {folders.find(f => f.id === selectedFolder)?.name} 
                  <span className="text-gray-400 text-sm ml-2">
                    ({getDesignsForFolder(selectedFolder).length} designs)
                  </span>
                </span>
              </button>
            </div>
            
            {showFolderContent && (
              getDesignsForFolder(selectedFolder).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {getDesignsForFolder(selectedFolder).map((creation) => (
                    <div
                      key={creation.id}
                      className="bg-gray-800 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow design-item"
                      draggable
                      onDragStart={(e) => handleDesignDragStart(e, creation)}
                      onDragEnd={handleDesignDragEnd}
                    >
                      <div className="relative overflow-hidden" style={getDesignAspectRatioStyle(creation.size)}>
                        {creation.thumbnail && creation.thumbnail !== 'data:,' ? (
                          <img 
                            src={creation.thumbnail}
                            alt={creation.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            style={{ backgroundColor: '#ffffff' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-gray-400">No preview available</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {creation.size}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => downloadCreation(creation)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform translate-y-2 group-hover:translate-y-0 transition-all"
                            title="Download"
                          >
                            <Download size={20} />
                          </button>
                          <button
                            onClick={() => {
                              setCanvasElements(creation.elements || []);
                              setDesignName(creation.name);
                              setEditorModalOpen(true);
                              setHiddenLayers(new Set());
                            }}
                            className="p-2 bg-[#F27A30] text-white rounded-lg hover:bg-[#e6691d] transform translate-y-2 group-hover:translate-y-0 transition-all delay-100"
                            title="Edit"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCreation(creation.id, e)}
                            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transform translate-y-2 group-hover:translate-y-0 transition-all delay-200"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium">{creation.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                                {creation.platform}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(creation.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          <p>Elements: {creation.elements?.length || 0}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <GripVertical size={12} className="text-gray-500" />
                            <span className="text-gray-500">Drag to move between folders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/50 rounded-lg mb-6">
                  <Palette size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No designs in this folder</p>
                  <p className="text-gray-500 text-sm mt-2">Create new designs or drag designs from other folders</p>
                </div>
              )
            )}
          </div>
          
          {/* Drafts Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowDraftsSection(!showDraftsSection)}
                className="flex items-center gap-2 text-white text-lg hover:text-[#F27A30]"
              >
                {showDraftsSection ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                <FileText size={20} />
                <span>Drafts ({drafts.length})</span>
              </button>
            </div>
            
            {showDraftsSection && (
              drafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {drafts.map((draft) => (
                    <div key={draft.id} className="bg-gray-800 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="relative overflow-hidden" style={getDesignAspectRatioStyle(draft.size)}>
                        {draft.thumbnail && draft.thumbnail !== 'data:,' ? (
                          <img 
                            src={draft.thumbnail}
                            alt={draft.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            style={{ backgroundColor: '#ffffff' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-gray-400">No preview available</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {draft.size}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setCanvasElements(draft.elements || []);
                              setDesignName(draft.name);
                              setEditorModalOpen(true);
                              setHiddenLayers(new Set());
                            }}
                            className="p-2 bg-[#F27A30] text-white rounded-lg hover:bg-[#e6691d] transform translate-y-2 group-hover:translate-y-0 transition-all"
                            title="Continue Editing"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteDraft(draft.id, e)}
                            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transform translate-y-2 group-hover:translate-y-0 transition-all delay-100"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium">{draft.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                                DRAFT
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(draft.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          <p>Platform: {draft.platform}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-800/50 rounded-lg mb-6">
                  <FileText size={36} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-400">No drafts yet</p>
                  <p className="text-gray-500 text-sm mt-1">Your unsaved designs will appear here</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modals remain the same as before */}
      {/* Name & Folder Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-semibold">Create New Design</h2>
              <button
                onClick={() => setShowNameModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Design Name</label>
                <input
                  type="text"
                  value={tempDesignName}
                  onChange={(e) => setTempDesignName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 text-sm"
                  placeholder="Enter design name"
                  autoFocus
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-gray-400">Folder</label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(true)}
                    className="text-xs text-[#F27A30] hover:text-[#e6691d] flex items-center gap-1"
                  >
                    <Plus size={12} />
                    New Folder
                  </button>
                </div>
                
                {isCreatingFolder && (
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="New folder name"
                        className="flex-1 bg-gray-700 text-white rounded p-2 text-sm"
                      />
                      <input
                        type="color"
                        value={newFolderColor}
                        onChange={(e) => setNewFolderColor(e.target.value)}
                        className="w-8 h-8 cursor-pointer rounded border-2 border-gray-600"
                        style={{
                          width: '32px',
                          height: '32px',
                          padding: 0
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          createNewFolder();
                          setIsCreatingFolder(false);
                        }}
                        className="flex-1 bg-[#F27A30] text-white px-3 py-1.5 rounded text-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setIsCreatingFolder(false)}
                        className="flex-1 bg-gray-700 text-white px-3 py-1.5 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 text-sm"
                >
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name} {folder.isDefault ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameSubmit}
                  className="flex-1 bg-[#F27A30] text-white py-3 rounded-lg hover:bg-[#e6691d]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Draft Modal */}
      {showSaveDraftModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-semibold">Save as Draft?</h2>
              <button
                onClick={() => {
                  setShowSaveDraftModal(false);
                  setIsExitingEditor(false);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                You have unsaved changes. Would you like to save this design as a draft?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaveDraftModal(false);
                    setEditorModalOpen(false);
                    setIsExitingEditor(false);
                    setCanvasElements([]);
                    setActiveElementId(null);
                    setHiddenLayers(new Set());
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Discard
                </button>
                <button
                  onClick={saveAsDraft}
                  className="flex-1 bg-[#F27A30] text-white py-3 rounded-lg hover:bg-[#e6691d]"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {showRenameFolderModal && folderToRename && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-semibold">Edit Folder</h2>
              <button
                onClick={() => {
                  setShowRenameFolderModal(false);
                  setFolderToRename(null);
                  setRenamedFolderName("");
                  setFolderEditColor("#3B82F6");
                  setTempIsDefault(false);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={renamedFolderName}
                  onChange={(e) => setRenamedFolderName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 text-sm"
                  placeholder="Enter new folder name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Folder Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={folderEditColor}
                    onChange={(e) => setFolderEditColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer rounded-lg border-2 border-gray-600"
                    style={{
                      width: '48px',
                      height: '48px',
                      padding: 0,
                      border: '2px solid #4B5563'
                    }}
                  />
                  <span className="text-gray-300">{folderEditColor}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="defaultFolder"
                  checked={tempIsDefault}
                  onChange={(e) => setTempIsDefault(e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <label 
                    htmlFor="defaultFolder" 
                    className="text-gray-300 cursor-pointer"
                  >
                    Set as default folder
                  </label>
                  <div className="relative group">
                    <Info size={16} className="text-gray-400 cursor-help" />
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 w-48 p-2 bg-gray-800 text-xs text-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      Will be selected automatically for new designs
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRenameFolderModal(false);
                    setFolderToRename(null);
                    setRenamedFolderName("");
                    setFolderEditColor("#3B82F6");
                    setTempIsDefault(false);
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={editFolder}
                  className="flex-1 bg-[#F27A30] text-white py-3 rounded-lg hover:bg-[#e6691d]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Folder Confirmation Modal */}
      {showDeleteFolderModal && folderToDelete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-semibold">Delete Folder</h2>
              <button
                onClick={() => {
                  setShowDeleteFolderModal(false);
                  setFolderToDelete(null);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete the folder "<span className="text-white">{folderToDelete.name}</span>"?
                All designs in this folder will be moved to the {defaultFolder ? defaultFolder.name : 'Designs'} folder.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteFolderModal(false);
                    setFolderToDelete(null);
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteFolderConfirmed}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Element Confirmation Modal */}
      {showDeleteElementModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-semibold">Delete Element</h2>
              <button
                onClick={() => {
                  setShowDeleteElementModal(false);
                  setElementToDelete(null);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete this element? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteElementModal(false);
                    setElementToDelete(null);
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteElementConfirmed}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Options Modal */}
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-semibold">Create New Design</h2>
              <button
                onClick={() => setShowUploadOptions(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleUploadOption('upload')}
                className="w-full p-6 bg-gray-800 hover:bg-gray-700 rounded-xl flex flex-col items-center gap-3"
              >
                <Upload size={32} className="text-blue-400" />
                <span className="text-white text-lg">Upload Image</span>
                <p className="text-gray-400 text-sm text-center">Upload your own image to start designing</p>
              </button>
              
              <button
                onClick={() => handleUploadOption('ai')}
                className="w-full p-6 bg-gray-800 hover:bg-gray-700 rounded-xl flex flex-col items-center gap-3"
              >
                <Sparkles size={32} className="text-[#F27A30]" />
                <span className="text-white text-lg">Generate with AI</span>
                <p className="text-gray-400 text-sm text-center">Create unique images using AI technology</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIX 6: Improved Crop Modal - YouTube-style */}
      {cropModalOpen && cropImageUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-5xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl text-white font-semibold">Crop Image</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Drag to position and use mouse wheel to zoom. Orange border shows final size.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCropScale(-0.1)}
                    className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <span className="text-gray-300 text-sm">{Math.round(cropScale * 100)}%</span>
                  <button
                    onClick={() => handleCropScale(0.1)}
                    className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
                <button
                  onClick={handleCrop}
                  className="flex items-center gap-2 bg-[#F27A30] text-white px-5 py-2.5 rounded-xl hover:bg-[#e6691d]"
                >
                  <Check size={18} />
                  Apply Crop
                </button>
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <div 
                className="relative m-auto overflow-hidden rounded-lg bg-black"
                style={{ width: '800px', height: '600px', maxWidth: '100%', maxHeight: '70vh' }}
                ref={cropContainerRef}
                onMouseDown={handleCropStart}
                onMouseMove={handleCropMove}
                onMouseUp={handleCropEnd}
                onMouseLeave={handleCropEnd}
                onWheel={(e) => {
                  e.preventDefault();
                  handleCropScale(e.deltaY > 0 ? -0.1 : 0.1);
                }}
              >
                <img
                  ref={cropImageRef}
                  src={cropImageUrl}
                  alt="Crop preview"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${cropScale}) translate(${cropPosition.x}px, ${cropPosition.y}px)`,
                    cursor: isMovingCrop ? 'grabbing' : 'grab',
                    maxWidth: 'none',
                    transition: isMovingCrop ? 'none' : 'transform 0.1s ease'
                  }}
                />
                
                {/* Crop overlay */}
                <div className="crop-overlay absolute inset-0 pointer-events-none">
                  {/* Dark overlay outside crop area */}
                  <div className="absolute inset-0 bg-black/50" />
                  
                  {/* Target crop area (orange border) */}
                  <div
                    className="absolute border-2 border-[#F27A30]"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: `${(canvasDim.originalWidth / cropImageSize.width) * 100 * (cropImageSize.width / 800)}%`,
                      height: `${(canvasDim.originalHeight / cropImageSize.height) * 100 * (cropImageSize.height / 600)}%`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
                    }}
                  />
                </div>
              </div>
              
              <div className="text-center mt-4 text-gray-400 text-sm">
                <p>• Drag image to position • Use mouse wheel to zoom • Orange border shows final crop</p>
                <p className="text-xs mt-2">
                  Image: {cropImageSize.width}x{cropImageSize.height}px • 
                  Target: {canvasDim.originalWidth}x{canvasDim.originalHeight}px • 
                  Zoom: {Math.round(cropScale * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Improved Editor Modal */}
      {editorModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] w-full h-full rounded-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  className="text-xl text-white font-semibold bg-transparent border-b border-transparent hover:border-gray-600 focus:border-[#F27A30] outline-none px-1"
                  style={{ minWidth: '200px' }}
                />
                <p className="text-gray-400 text-sm">
                  Platform: {platform} | Size: {imageSize}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveFromEditor}
                  className="flex items-center gap-2 bg-[#F27A30] text-white px-5 py-2.5 rounded-xl hover:bg-[#e6691d]"
                >
                  <Save size={18} />
                  Save Design
                </button>
                <button
                  onClick={handleExitEditor}
                  className="p-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Tools */}
              <div className="w-72 bg-[#141414] p-5 border-r border-gray-800 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-4">Canvas Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Platform</label>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {["instagram", "facebook", "both", "custom"].map((plat) => (
                            <button
                              key={plat}
                              className={`px-3 py-1.5 rounded text-xs ${platform === plat ? "bg-[#F27A30] text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                              onClick={() => handlePlatformChange(plat)}
                            >
                              {plat === "both" ? "Both" : plat === "custom" ? "Custom" : plat.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {showCustomSize ? (
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Custom Size</label>
                          <div className="flex gap-2 items-center bg-gray-700 rounded-lg p-2 mb-2">
                            <input
                              type="text"
                              value={customSize.width}
                              onChange={(e) => handleCustomSizeChange('width', e.target.value)}
                              className="w-20 bg-transparent text-white text-center outline-none"
                              placeholder="Width"
                            />
                            <span className="text-gray-400">×</span>
                            <input
                              type="text"
                              value={customSize.height}
                              onChange={(e) => handleCustomSizeChange('height', e.target.value)}
                              className="w-20 bg-transparent text-white text-center outline-none"
                              placeholder="Height"
                            />
                            <span className="text-gray-400 text-sm">px</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={applyCustomSize}
                              className="flex-1 bg-[#F27A30] text-white px-3 py-2 rounded-lg hover:bg-[#e6691d]"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => {
                                setShowCustomSize(false);
                                handlePlatformChange("instagram");
                              }}
                              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Size</label>
                          <select
                            className="w-full bg-gray-700 text-white rounded p-2.5 text-sm"
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value)}
                          >
                            {platformSizes[platform].map((size) => (
                              <option key={size.id} value={size.size}>
                                {size.name} ({size.size})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-4">Design Tools</h3>
                    
                    {/* FIX 4: Background Color Section */}
                    <div className="mb-4 bg-gray-800 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white text-sm font-medium">Background</h4>
                        <button
                          onClick={addColorLayer}
                          className="text-xs text-[#F27A30] hover:text-[#e6691d]"
                        >
                          + Add Color Layer
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Base Color</label>
                          <input
                            type="color"
                            value={whiteBackgroundLayer.color}
                            onChange={(e) => updateWhiteBackgroundColor(e.target.value)}
                            className="w-full h-8 cursor-pointer rounded-lg border border-gray-600"
                          />
                        </div>
                        {colorLayers.map((layer) => (
                          <div key={layer.id} className="flex items-center gap-2">
                            <input
                              type="color"
                              value={layer.color}
                              onChange={(e) => {
                                setCanvasElements(prev => 
                                  prev.map(el => 
                                    el.id === layer.id 
                                      ? { ...el, color: e.target.value }
                                      : el
                                  )
                                );
                                setColorLayers(prev => 
                                  prev.map(l => 
                                    l.id === layer.id 
                                      ? { ...l, color: e.target.value }
                                      : l
                                  )
                                );
                              }}
                              className="w-8 h-8 cursor-pointer rounded border border-gray-600"
                            />
                            <span className="text-xs text-gray-300 flex-1">Color Layer</span>
                            <button
                              onClick={() => {
                                setCanvasElements(prev => prev.filter(el => el.id !== layer.id));
                                setColorLayers(prev => prev.filter(l => l.id !== layer.id));
                              }}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        className={`p-4 rounded-xl flex flex-col items-center ${selectedTool === "text" ? "bg-[#F27A30]" : "bg-gray-700 hover:bg-gray-600"}`}
                        onClick={() => {
                          setSelectedTool("text");
                          addTextElement();
                        }}
                        title="Text Tool"
                      >
                        <Type size={22} className="text-white" />
                        <span className="text-xs mt-2 text-white">Text</span>
                      </button>
                      
                      <button
                        className={`p-4 rounded-xl flex flex-col items-center ${selectedTool === "shapes" ? "bg-[#F27A30]" : "bg-gray-700 hover:bg-gray-600"}`}
                        onClick={() => {
                          setSelectedTool("shapes");
                          setShowShapeMenu(!showShapeMenu);
                        }}
                        title="Shapes"
                      >
                        <Square size={22} className="text-white" />
                        <span className="text-xs mt-2 text-white">Shapes</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={addImageElement}
                      className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center gap-2 text-white mb-4"
                    >
                      <ImageIcon size={18} />
                      <span>Add Image</span>
                    </button>
                    
                    {selectedTool === "text" && showTextFormatting && (
                      <div className="mt-4 bg-gray-800 rounded-xl p-4">
                        <h4 className="text-white text-sm font-medium mb-3">Text Formatting</h4>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          <button
                            className={`p-2 rounded-lg ${textBold ? 'bg-[#F27A30]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => {
                              setTextBold(!textBold);
                              updateTextElement();
                            }}
                            title="Bold (Ctrl+B)"
                          >
                            <Bold size={16} className="text-white" />
                          </button>
                          <button
                            className={`p-2 rounded-lg ${textItalic ? 'bg-[#F27A30]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => {
                              setTextItalic(!textItalic);
                              updateTextElement();
                            }}
                            title="Italic (Ctrl+I)"
                          >
                            <Italic size={16} className="text-white" />
                          </button>
                          <button
                            className={`p-2 rounded-lg ${textUnderline ? 'bg-[#F27A30]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => {
                              setTextUnderline(!textUnderline);
                              updateTextElement();
                            }}
                            title="Underline (Ctrl+U)"
                          >
                            <Underline size={16} className="text-white" />
                          </button>
                          <button
                            className={`p-2 rounded-lg ${textAlign === 'left' ? 'bg-[#F27A30]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => {
                              setTextAlign('left');
                              updateTextElement();
                            }}
                            title="Align Left"
                          >
                            <AlignLeft size={16} className="text-white" />
                          </button>
                          <button
                            className={`p-2 rounded-lg ${textAlign === 'center' ? 'bg-[#F27A30]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => {
                              setTextAlign('center');
                              updateTextElement();
                            }}
                            title="Align Center"
                          >
                            <AlignCenter size={16} className="text-white" />
                          </button>
                          <button
                            className={`p-2 rounded-lg ${textAlign === 'right' ? 'bg-[#F27A30]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            onClick={() => {
                              setTextAlign('right');
                              updateTextElement();
                            }}
                            title="Align Right"
                          >
                            <AlignRight size={16} className="text-white" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Text Content</label>
                            <textarea
                              value={textContent}
                              onChange={handleTextChange}
                              className="w-full bg-gray-700 text-white rounded p-2.5 text-sm"
                              rows="3"
                              onBlur={() => updateTextElement(textContent)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Text Color</label>
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => {
                                setTextColor(e.target.value);
                                updateTextElement();
                              }}
                              className="w-full h-10 cursor-pointer rounded-lg border-2 border-gray-600"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Font Size: {textSize}px</label>
                            <input
                              type="range"
                              min="12"
                              max="72"
                              value={textSize}
                              onChange={(e) => {
                                setTextSize(parseInt(e.target.value));
                                updateTextElement();
                              }}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Font Family</label>
                            <select
                              value={textFont}
                              onChange={(e) => {
                                setTextFont(e.target.value);
                                updateTextElement();
                              }}
                              className="w-full bg-gray-700 text-white rounded p-2.5 text-sm"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Helvetica">Helvetica</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Courier New">Courier New</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedTool === "shapes" && showShapeMenu && (
                      <div className="mt-4 bg-gray-800 rounded-xl p-4">
                        <h4 className="text-white text-sm font-medium mb-3">Select Shape</h4>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {shapes.map((shape) => {
                            const Icon = shape.icon;
                            return (
                              <button
                                key={shape.id}
                                className={`p-3 rounded-lg flex flex-col items-center ${selectedShape === shape.id ? "bg-[#F27A30]" : "bg-gray-700 hover:bg-gray-600"}`}
                                onClick={() => {
                                  setSelectedShape(shape.id);
                                  addShapeElement(shape.id);
                                }}
                              >
                                <Icon size={18} className="text-white" />
                                <span className="text-xs mt-1 text-white">{shape.name}</span>
                              </button>
                            );
                          })}
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Shape Color</label>
                          <input
                            type="color"
                            value={shapeColor}
                            onChange={(e) => setShapeColor(e.target.value)}
                            className="w-full h-10 cursor-pointer rounded-lg border-2 border-gray-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">
                      Canvas - {imageSize}
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowLayersPanel(!showLayersPanel)}
                        className="flex items-center gap-2 text-gray-300 hover:text-white"
                      >
                        <Layers size={18} />
                        <span className="text-sm">{showLayersPanel ? "Hide Layers" : "Show Layers"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden justify-center items-center">
                  {/* Main Canvas */}
                  <div 
                    className="canvas-container relative bg-gray-900 overflow-auto flex items-center justify-center"
                    ref={canvasContainerRef}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onClick={handleCanvasClick}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <div 
                      className="relative bg-white shadow-lg"
                      style={{
                        width: `${canvasDim.width}px`,
                        height: `${canvasDim.height}px`,
                        position: 'relative',
                        border: '2px solid #F27A30',
                        margin: 'auto'
                      }}
                    >
                      {[...canvasElements]
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map((element) => {
                          const isActive = activeElementId === element.id;
                          const isLocked = lockedElements.has(element.id);
                          const isHidden = hiddenLayers.has(element.id);
                          
                          if (isHidden) return null;
                          
                          return (
                            <div
                              key={element.id}
                              onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                              onDoubleClick={() => element.type === 'text' && !isLocked && handleTextDoubleClick(element.id)}
                              style={{
                                position: 'absolute',
                                left: `${element.x}px`,
                                top: `${element.y}px`,
                                width: `${element.width}px`,
                                height: `${element.height}px`,
                                cursor: isLocked ? 'not-allowed' : (isActive ? 'move' : 'pointer'),
                                border: isActive ? '2px solid #F27A30' : 'none',
                                padding: element.type === 'text' ? '8px' : '4px',
                                backgroundColor: isActive ? 'rgba(242, 122, 48, 0.05)' : 'transparent',
                                userSelect: 'none',
                                boxSizing: 'border-box',
                                overflow: element.type === 'text' ? 'hidden' : 'visible',
                                transition: isDragging || isResizing ? 'none' : 'all 0.1s ease'
                              }}
                            >
                              {element.type === 'text' && (
                                <div style={{
                                  color: element.color,
                                  fontSize: `${element.size}px`,
                                  fontFamily: element.font,
                                  fontWeight: element.bold ? 'bold' : 'normal',
                                  fontStyle: element.italic ? 'italic' : 'normal',
                                  textDecoration: element.underline ? 'underline' : 'none',
                                  textAlign: element.align || 'left',
                                  width: '100%',
                                  height: '100%',
                                  overflow: 'hidden',
                                  wordWrap: 'break-word',
                                  whiteSpace: 'normal',
                                  lineHeight: '1.2'
                                }}>
                                  {element.content}
                                </div>
                              )}
                              
                              {element.type === 'shape' && (
                                <div style={{ width: '100%', height: '100%' }}>
                                  {renderShape(element.shape, element.color, element.width, element.height)}
                                </div>
                              )}
                              
                              {element.type === 'image' && (
                                <img
                                  src={element.content}
                                  alt="Layer"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    display: 'block'
                                  }}
                                />
                              )}
                              
                              {isActive && !isLocked && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    right: '-6px',
                                    bottom: '-6px',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: '#F27A30',
                                    borderRadius: '2px',
                                    cursor: 'se-resize',
                                    border: '2px solid white',
                                    boxShadow: '0 0 2px rgba(0,0,0,0.5)'
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* FIX 3 & 5: Improved Layers Panel - Responsive and positioned at top */}
                  {showLayersPanel && (
                    <div className="w-80 bg-[#141414] border-l border-gray-800 flex flex-col">
                      <div className="p-5 border-b border-gray-800">
                        <h3 className="text-white font-medium flex items-center gap-2">
                          <Layers size={18} />
                          Layers ({canvasElements.length})
                        </h3>
                      </div>
                      
                      <div 
                        className="flex-1 overflow-y-auto p-4"
                        style={{ maxHeight: 'calc(100vh - 200px)' }}
                      >
                        {canvasElements.length === 0 ? (
                          <p className="text-gray-400 text-sm text-center py-8">
                            No layers yet. Add elements using the tools.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {[...canvasElements].sort((a, b) => b.zIndex - a.zIndex).map((element, index) => {
                              const isLocked = lockedElements.has(element.id);
                              const isActive = activeElementId === element.id;
                              const isHidden = hiddenLayers.has(element.id);
                              
                              return (
                                <div 
                                  key={element.id}
                                  className={`p-3 rounded-lg flex items-center justify-between ${
                                    isActive 
                                      ? 'bg-[#F27A30]/20 border border-[#F27A30]' 
                                      : 'bg-gray-800 hover:bg-gray-700'
                                  } ${isHidden ? 'opacity-50' : ''}`}
                                  onClick={() => setActiveElementId(element.id)}
                                  draggable
                                  onDragStart={(e) => handleLayerDragStart(e, element.id)}
                                  onDragOver={handleLayerDragOver}
                                  onDrop={(e) => handleLayerDrop(e, canvasElements.length - 1 - index)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <GripVertical size={14} className="text-gray-400 cursor-grab flex-shrink-0" />
                                    <button
                                      onClick={(e) => toggleLayerVisibility(element.id, e)}
                                      className="p-1 text-gray-400 hover:text-white flex-shrink-0"
                                      title={isHidden ? "Show layer" : "Hide layer"}
                                    >
                                      {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      {element.type === 'text' && <Type size={14} className="text-blue-400 flex-shrink-0" />}
                                      {element.type === 'shape' && <Square size={14} className="text-green-400 flex-shrink-0" />}
                                      {element.type === 'image' && <ImageIcon size={14} className="text-purple-400 flex-shrink-0" />}
                                      <span className="text-white text-sm truncate flex-1">
                                        {element.type === 'text' ? 'Text' : 
                                         element.type === 'shape' ? `Shape (${element.shape})` : 
                                         'Image'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={(e) => toggleElementLock(element.id, e)}
                                      className="p-1 text-gray-400 hover:text-white"
                                      title={isLocked ? "Unlock" : "Lock"}
                                    >
                                      {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                                    </button>
                                    <button
                                      onClick={(e) => confirmDeleteElement(element.id, e)}
                                      disabled={isLocked}
                                      className={`p-1 ${isLocked ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-gray-300'}`}
                                      title={isLocked ? "Locked - Cannot delete" : "Delete (Del)"}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;