import { useCallback } from 'react';
import { Modal, notification } from 'antd';

export const useFolderManagement = (
  folders,
  setFolders,
  contractPages,
  currentPage,
  setContractPages,
  setSelectedFolder,
  saveToHistory,
  nextFolderId
) => {
  const createFolder = useCallback((folderName, folderColor) => {
    if (!folderName || !folderName.trim()) {
      notification.warning({
        message: "Create Folder",
        description: "Please enter a folder name"
      });
      return;
    }

    // NEW FOLDER GOES TO TOP OF LIST (sortIndex = 1)
    // All existing folders and independent elements get their sortIndex increased by 1
    
    const newFolder = {
      id: nextFolderId.current++,
      name: folderName.trim(),
      color: folderColor || '#3b82f6',
      elementIds: [],
      expanded: true,
      sortIndex: 1  // New folder goes to TOP of layer list
    };

    // Update all existing folders: increase their sortIndex by 1
    const updatedFolders = folders.map(f => ({
      ...f,
      sortIndex: (f.sortIndex || 0) + 1  // Shift all folders down by 1
    }));
    
    // Update all independent elements on current page: increase their sortIndex by 1
    const newPages = contractPages.map((page, idx) => {
      if (idx !== currentPage) return page;
      
      const updatedElements = (page.elements || []).map(el => {
        if (!el.folderId) {
          return { ...el, sortIndex: (el.sortIndex || 0) + 1 };  // Shift independent elements down
        }
        return el;  // Elements in folders don't change
      });
      
      return { ...page, elements: updatedElements };
    });
    
    const newFolders = [newFolder, ...updatedFolders];
    setFolders(newFolders);
    setContractPages(newPages);
    saveToHistory(newPages, newFolders, 'create_folder');
  }, [folders, setFolders, contractPages, currentPage, setContractPages, saveToHistory, nextFolderId]);

  const updateFolder = useCallback((folderId, updates) => {
    const newFolders = folders.map(folder => 
      folder.id === folderId ? { ...folder, ...updates } : folder
    );
    setFolders(newFolders);
    saveToHistory(contractPages, newFolders, 'update_folder');
  }, [folders, setFolders, saveToHistory, contractPages]);

  const deleteFolder = useCallback((folderId) => {
    const folder = folders.find(f => f.id === folderId);
    
    if (!folder) return;
    
    if (folder.elementIds.length > 0) {
      // Folder has elements - Show dialog with three options
      let modalInstance;
      
      const handleDeleteAll = () => {
        // Delete folder AND elements
        const newPages = contractPages.map(page => {
          if (page.id === contractPages[currentPage].id) {
            return {
              ...page,
              elements: page.elements.filter(element => !folder.elementIds.includes(element.id))
            };
          }
          return page;
        });

        const newFolders = folders.filter(f => f.id !== folderId);
        setFolders(newFolders);
        setContractPages(newPages);
        setSelectedFolder(null);
        saveToHistory(newPages, newFolders, 'delete_folder_with_elements');
        
        notification.success({
          message: "Folder and Elements Deleted",
          description: `The folder "${folder.name}" and its ${folder.elementIds.length} element(s) have been deleted`
        });
        
        modalInstance?.destroy();
      };
      
      const handleDeleteFolderOnly = () => {
        // Delete only folder, keep elements
        const newPages = contractPages.map(page => {
          if (page.id === contractPages[currentPage].id) {
            return {
              ...page,
              elements: page.elements.map(element => {
                if (folder.elementIds.includes(element.id)) {
                  return { ...element, folderId: null };
                }
                return element;
              })
            };
          }
          return page;
        });

        const newFolders = folders.filter(f => f.id !== folderId);
        setFolders(newFolders);
        setContractPages(newPages);
        setSelectedFolder(null);
        saveToHistory(newPages, newFolders, 'delete_folder_keep_elements');
        
        notification.success({
          message: "Folder Deleted",
          description: `The folder "${folder.name}" has been deleted. The elements were kept.`
        });
        
        modalInstance?.destroy();
      };
      
      const handleCancel = () => {
        modalInstance?.destroy();
      };
      
      modalInstance = Modal.confirm({
        title: "Delete Folder",
        content: (
          <div>
            <p>This folder contains {folder.elementIds.length} element(s).</p>
            <p style={{ marginTop: 10 }}>How would you like to proceed?</p>
          </div>
        ),
        footer: () => (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFolderOnly}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Delete Folder Only
            </button>
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Folder + Elements
            </button>
          </div>
        ),
      });
    } else {
      // Folder is empty - Delete directly
      Modal.confirm({
        title: "Delete Folder",
        content: `Do you really want to delete the folder "${folder.name}"?`,
        okText: "Yes, delete",
        cancelText: "Cancel",
        okType: "danger",
        onOk: () => {
          const newFolders = folders.filter(f => f.id !== folderId);
          setFolders(newFolders);
          setSelectedFolder(null);
          saveToHistory(contractPages, newFolders, 'delete_empty_folder');
          
          notification.success({
            message: "Folder Deleted",
            description: `The folder "${folder.name}" has been deleted`
          });
        }
      });
    }
  }, [folders, setFolders, contractPages, currentPage, setContractPages, setSelectedFolder, saveToHistory]);

  const toggleFolder = useCallback((folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      updateFolder(folderId, { expanded: !folder.expanded });
    }
  }, [folders, updateFolder]);

  const startEditFolder = useCallback((folder) => {
    return {
      id: folder.id,
      name: folder.name,
      color: folder.color
    };
  }, []);

  const saveEditFolder = useCallback((folderId, editingFolderName, editingFolderColor) => {
    if (!editingFolderName || !editingFolderName.trim()) {
      notification.warning({
        message: "Edit Folder",
        description: "Please enter a folder name"
      });
      return false;
    }

    updateFolder(folderId, { 
      name: editingFolderName.trim(), 
      color: editingFolderColor 
    });
    
    notification.success({
      message: "Folder Updated",
      description: "Changes have been saved"
    });
    
    return true;
  }, [updateFolder]);

  const addElementToFolder = useCallback((elementId, folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    let newPages = contractPages.map(page => {
      if (page.id === contractPages[currentPage].id) {
        return {
          ...page,
          elements: page.elements.map(element => {
            if (element.id === elementId) {
              return { ...element, folderId: folderId };
            }
            return element;
          })
        };
      }
      return page;
    });

    const newFolders = folders.map(f => {
      if (f.id === folderId) {
        if (!f.elementIds.includes(elementId)) {
          return { ...f, elementIds: [...f.elementIds, elementId] };
        }
        return f;
      } else {
        return { ...f, elementIds: f.elementIds.filter(id => id !== elementId) };
      }
    });

    setContractPages(newPages);
    setFolders(newFolders);
    saveToHistory(newPages, newFolders, 'add_element_to_folder');
  }, [folders, contractPages, currentPage, setContractPages, setFolders, saveToHistory]);

  const removeElementFromFolder = useCallback((elementId, folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    
    // Calculate the sortIndex for the element (right after the folder)
    const folderSortIndex = folder.sortIndex || 0;
    const newElementSortIndex = folderSortIndex + 1;
    
    // Update all items with sortIndex >= newElementSortIndex to shift them down
    const updatedFolders = folders.map(f => {
      if (f.id === folderId) {
        // Remove element from this folder
        return { ...f, elementIds: f.elementIds.filter(id => id !== elementId) };
      }
      // Shift folders that come after the insertion point
      if ((f.sortIndex || 0) >= newElementSortIndex) {
        return { ...f, sortIndex: (f.sortIndex || 0) + 1 };
      }
      return f;
    });
    
    const newPages = contractPages.map(page => {
      if (page.id === contractPages[currentPage].id) {
        return {
          ...page,
          elements: page.elements.map(element => {
            if (element.id === elementId) {
              // Remove from folder and set sortIndex right after folder
              return { ...element, folderId: null, sortIndex: newElementSortIndex };
            }
            // Shift independent elements that come after the insertion point
            if (!element.folderId && (element.sortIndex || 0) >= newElementSortIndex) {
              return { ...element, sortIndex: (element.sortIndex || 0) + 1 };
            }
            return element;
          })
        };
      }
      return page;
    });

    setContractPages(newPages);
    setFolders(updatedFolders);
    saveToHistory(newPages, updatedFolders, 'remove_element_from_folder');
  }, [folders, contractPages, currentPage, setContractPages, setFolders, saveToHistory]);

  return {
    createFolder,
    updateFolder,
    deleteFolder,
    toggleFolder,
    startEditFolder,
    saveEditFolder,
    addElementToFolder,
    removeElementFromFolder
  };
};
