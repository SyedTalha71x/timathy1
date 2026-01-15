import { useState, useCallback } from 'react';
import { generateId } from '../utils/canvasUtils';
import { folderColors } from '../constants/platformSizes';

const defaultFolders = [
  { 
    id: "default", 
    name: "All Designs", 
    color: "#6B7280", 
    isExpanded: true, 
    isDefault: true 
  },
  { 
    id: "social", 
    name: "Social Media", 
    color: "#3B82F6", 
    isExpanded: true, 
    isDefault: false 
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    color: "#10B981", 
    isExpanded: true, 
    isDefault: false 
  },
  { 
    id: "brand", 
    name: "Branding", 
    color: "#8B5CF6", 
    isExpanded: true, 
    isDefault: false 
  }
];

/**
 * Custom hook for managing folders
 */
export const useFolders = (initialFolders = defaultFolders) => {
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolderId, setSelectedFolderId] = useState(
    initialFolders.find(f => f.isDefault)?.id || initialFolders[0]?.id
  );
  
  // Create new folder
  const createFolder = useCallback((name, color = folderColors[0]) => {
    const newFolder = {
      id: `folder-${generateId()}`,
      name: name.trim(),
      color,
      isExpanded: true,
      isDefault: false
    };
    
    setFolders(prev => [...prev, newFolder]);
    return newFolder.id;
  }, []);
  
  // Update folder
  const updateFolder = useCallback((id, updates) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === id) {
        // If setting as default, remove default from others
        if (updates.isDefault && !folder.isDefault) {
          return { ...folder, ...updates };
        }
        return { ...folder, ...updates };
      }
      // Remove default from other folders if new default is set
      if (updates.isDefault) {
        return { ...folder, isDefault: false };
      }
      return folder;
    }));
  }, []);
  
  // Delete folder
  const deleteFolder = useCallback((id) => {
    const folder = folders.find(f => f.id === id);
    if (!folder) return false;
    
    // Find default folder to move designs to
    const defaultFolder = folders.find(f => f.isDefault && f.id !== id) || 
                         folders.find(f => f.id !== id);
    
    if (!defaultFolder) return false;
    
    setFolders(prev => prev.filter(f => f.id !== id));
    
    // If deleting selected folder, select default
    if (selectedFolderId === id) {
      setSelectedFolderId(defaultFolder.id);
    }
    
    return defaultFolder.id; // Return the folder to move designs to
  }, [folders, selectedFolderId]);
  
  // Toggle folder expansion
  const toggleExpand = useCallback((id) => {
    setFolders(prev => prev.map(folder => 
      folder.id === id ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ));
  }, []);
  
  // Reorder folders
  const reorderFolders = useCallback((fromIndex, toIndex) => {
    setFolders(prev => {
      const newFolders = [...prev];
      const [removed] = newFolders.splice(fromIndex, 1);
      newFolders.splice(toIndex, 0, removed);
      return newFolders;
    });
  }, []);
  
  // Get default folder
  const defaultFolder = folders.find(f => f.isDefault) || folders[0];
  
  // Get selected folder
  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  
  return {
    folders,
    setFolders,
    selectedFolderId,
    setSelectedFolderId,
    selectedFolder,
    defaultFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    toggleExpand,
    reorderFolders
  };
};

export default useFolders;
