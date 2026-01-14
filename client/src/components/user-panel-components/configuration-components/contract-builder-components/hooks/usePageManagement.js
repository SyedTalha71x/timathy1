import { useCallback } from 'react';
import { Modal, notification } from 'antd';

export const usePageManagement = (
  contractPages,
  setContractPages,
  currentPage,
  setCurrentPage,
  saveToHistory,
  nextPageId,
  setEditingPageTitle,
  setShowAddPageModal,
  setNewPageName
) => {
  const addPage = useCallback((newPageName) => {
    // Add defensive check
    const title = (typeof newPageName === 'string' ? newPageName.trim() : '') || 'Contract Page';
    
    const newPage = {
      id: nextPageId.current++,
      title: title,
      elements: [],
      backgroundImage: null,
    };
    
    const newPages = [...contractPages, newPage];
    setContractPages(newPages);
    setCurrentPage(newPages.length - 1);
    saveToHistory(newPages, [], 'add_page');
    
    // Close modal and reset input
    setShowAddPageModal(false);
    setNewPageName('Contract Page');
  }, [contractPages, setContractPages, saveToHistory, nextPageId, setCurrentPage, setShowAddPageModal, setNewPageName]);

  const movePage = useCallback((fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= contractPages.length) return;
    
    const fromPage = contractPages[fromIndex];
    
    if (fromPage?.locked) {
      const pdfFileName = fromPage.pdfFileName;
      const pdfBlockIndices = contractPages
        .map((page, idx) => ({ page, idx }))
        .filter(({ page }) => page.locked && page.pdfFileName === pdfFileName)
        .map(({ idx }) => idx);
      
      if (pdfBlockIndices.length === 0) return;
      
      if (toIndex >= Math.min(...pdfBlockIndices) && toIndex <= Math.max(...pdfBlockIndices)) {
        return;
      }
      
      const firstBlockIndex = Math.min(...pdfBlockIndices);
      const blockSize = pdfBlockIndices.length;
      
      let adjustedToIndex = toIndex;
      if (toIndex > firstBlockIndex) {
        adjustedToIndex = toIndex - blockSize + 1;
      }
      
      const newPages = [...contractPages];
      const blockPages = [];
      for (let i = 0; i < blockSize; i++) {
        blockPages.push(newPages.splice(firstBlockIndex, 1)[0]);
      }
      
      newPages.splice(adjustedToIndex, 0, ...blockPages);
      
      setContractPages(newPages);
      saveToHistory(newPages, [], 'move_pdf_block');
      
      if (currentPage === fromIndex) {
        const newPageIndex = newPages.findIndex((p, idx) => 
          p.id === fromPage.id
        );
        if (newPageIndex !== -1) {
          setCurrentPage(newPageIndex);
        }
      }
      
      return;
    }
    
    const newPages = [...contractPages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);
    
    setContractPages(newPages);
    saveToHistory(newPages, [], 'move_page');
    
    if (currentPage === fromIndex) {
      setCurrentPage(toIndex);
    } else if (currentPage > fromIndex && currentPage <= toIndex) {
      setCurrentPage(currentPage - 1);
    } else if (currentPage < fromIndex && currentPage >= toIndex) {
      setCurrentPage(currentPage + 1);
    }
  }, [contractPages, setContractPages, currentPage, setCurrentPage, saveToHistory]);

  const removePage = useCallback((pageIndex) => {
    const page = contractPages[pageIndex];
    
    if (page?.locked) {
      Modal.confirm({
        title: "Delete PDF Pages",
        content: `Do you want to delete all ${page.pdfTotalPages} pages from "${page.pdfFileName}"? PDF pages can only be deleted as a complete block.`,
        okText: "Yes, delete entire block",
        cancelText: "Cancel",
        okType: "danger",
        onOk: () => {
          const pdfFileName = page.pdfFileName;
          const newPages = contractPages.filter(p => !p.locked || p.pdfFileName !== pdfFileName);
          
          setContractPages(newPages);
          
          const newCurrentPage = Math.min(currentPage, newPages.length - 1);
          setCurrentPage(newCurrentPage >= 0 ? newCurrentPage : 0);
          
          saveToHistory(newPages, [], 'remove_pdf_block');
          
          notification.success({
            message: "PDF Block Deleted",
            description: `All pages from "${pdfFileName}" have been removed`
          });
        }
      });
      return;
    }
    
    if (contractPages.length === 1) {
      notification.warning({
        message: "Cannot Delete Page",
        description: "The contract must have at least one page"
      });
      return;
    }

    Modal.confirm({
      title: "Delete Page",
      content: "Are you sure you want to delete this page?",
      okText: "Yes, delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        const newPages = contractPages.filter((_, i) => i !== pageIndex);
        setContractPages(newPages);
        setCurrentPage(cp => (cp >= newPages.length ? newPages.length - 1 : cp));
        saveToHistory(newPages, [], 'remove_page');
      }
    });
  }, [contractPages, setContractPages, currentPage, setCurrentPage, saveToHistory]);

  const updatePageTitle = useCallback((pageIndex, newTitle) => {
    if (!newTitle.trim()) {
      setEditingPageTitle(null);
      return;
    }
    
    const newPages = contractPages.map((page, idx) => 
      idx === pageIndex ? { ...page, title: newTitle.replace(/^\d+\.\s*/, '') } : page
    );
    setContractPages(newPages);
    saveToHistory(newPages, [], 'update_page_title');
    setEditingPageTitle(null);
  }, [contractPages, setContractPages, saveToHistory, setEditingPageTitle]);

  return {
    addPage,
    movePage,
    removePage,
    updatePageTitle
  };
};
