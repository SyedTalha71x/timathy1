import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GripVerticalIcon, EditIcon, TrashIcon } from 'lucide-react';

const PageTabs = ({
  contractPages,
  currentPage,
  setCurrentPage,
  editingPageTitle,
  setEditingPageTitle,
  updatePageTitle,
  removePage,
  pageTitleInputRef,
  isDraggingPage,
  dragOverPageIndex,
  dropPosition,
  handlePageDragStart,
  handlePageDragOver,
  handlePageDragLeave,
  handlePageDrop,
  handlePageDragEnd
}) => {
  const { t } = useTranslation();
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});

  // Auto-scroll to current page tab when currentPage changes
  useEffect(() => {
    if (tabsContainerRef.current && tabRefs.current[currentPage]) {
      const container = tabsContainerRef.current;
      const activeTab = tabRefs.current[currentPage];
      
      // Calculate the position to scroll to center the active tab
      const containerWidth = container.offsetWidth;
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      
      // Scroll so the tab is centered (or as close as possible)
      const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentPage]);

  return (
    <div 
      ref={tabsContainerRef}
      className="flex items-center px-4 overflow-x-auto py-1 border-t"
    >
      {contractPages.map((page, index) => {
        const isPdfBlock = page.locked;
        const pdfBlockIndex = isPdfBlock ? contractPages.findIndex(p => p.pdfFileName === page.pdfFileName && p.locked) : -1;
        const isFirstInPdfBlock = isPdfBlock && pdfBlockIndex === index;
        
        const isDraggingThisPdfBlock = isDraggingPage && 
          isPdfBlock && 
          contractPages[parseInt(dragOverPageIndex)]?.locked &&
          contractPages[parseInt(dragOverPageIndex)]?.pdfFileName === page.pdfFileName;
        
        return (
          <div
            key={page.id}
            ref={(el) => (tabRefs.current[index] = el)}
            draggable={true}
            onDragStart={(e) => handlePageDragStart(e, index)}
            onDragOver={(e) => handlePageDragOver(e, index)}
            onDragLeave={handlePageDragLeave}
            onDrop={(e) => handlePageDrop(e, index)}
            onDragEnd={handlePageDragEnd}
            className={`flex items-center px-4 py-2 border-b-2 flex-shrink-0 transition-all cursor-move relative ${
              currentPage === index 
                ? 'border-primary text-primary bg-primary/10' 
                : 'border-transparent text-content-secondary hover:text-content-primary'
            } ${page.locked ? 'bg-surface-hover' : ''} ${isDraggingThisPdfBlock ? 'ring-2 ring-primary bg-primary/10' : ''}`}
          >
            {/* Drop indicator - vertical line */}
            {dragOverPageIndex === index && dropPosition && (
              <div 
                className={`absolute top-0 bottom-0 w-1 bg-primary z-10 ${
                  dropPosition === 'before' ? '-left-0.5' : '-right-0.5'
                }`}
                style={{
                  boxShadow: '0 0 8px var(--color-primary-glow, rgba(59, 130, 246, 0.6))'
                }}
              />
            )}
            
            <GripVerticalIcon 
              size={14} 
              className="text-content-muted mr-2 flex-shrink-0" 
            />
            
            <div 
              className="w-4 h-4 rounded mr-2 flex-shrink-0"
              style={{ backgroundColor: page.locked ? '#9ca3af' : 'var(--color-primary)' }}
            >
              <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                {index + 1}
              </span>
            </div>
            
            {editingPageTitle === index ? (
              <input
                ref={pageTitleInputRef}
                type="text"
                defaultValue={page.title.replace(/^\d+\.\s*/, '')}
                onBlur={(e) => {
                  const newTitle = e.target.value.trim();
                  if (newTitle) {
                    updatePageTitle(index, newTitle);
                  } else {
                    setEditingPageTitle(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newTitle = e.target.value.trim();
                    if (newTitle) {
                      updatePageTitle(index, newTitle);
                    } else {
                      setEditingPageTitle(null);
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setEditingPageTitle(null);
                  }
                }}
                className="px-2 py-1 bg-surface-dark rounded-xl text-sm w-40 text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onDragStart={(e) => e.stopPropagation()}
                draggable={false}
              />
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Close any open page title editor before switching pages
                    if (editingPageTitle !== null && editingPageTitle !== index && pageTitleInputRef.current) {
                      const newTitle = pageTitleInputRef.current.value.trim();
                      if (newTitle) {
                        updatePageTitle(editingPageTitle, newTitle);
                      } else {
                        setEditingPageTitle(null);
                      }
                    }
                    setCurrentPage(index);
                  }}
                  className="mr-2 text-sm font-medium text-content-primary hover:text-primary"
                  onDragStart={(e) => e.stopPropagation()}
                  draggable={false}
                >
                  {page.title}
                  {page.locked && (
                    <span className="text-xs text-content-muted ml-2">
                      (PDF {page.pdfPageNum}/{page.pdfTotalPages})
                    </span>
                  )}
                </button>
                
                {/* FIXED: Edit icon now shows for ALL pages including PDF pages */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPageTitle(index);
                  }}
                  className="text-content-muted hover:text-primary p-1 rounded hover:bg-primary/10"
                  title={t("contractBuilder.pages.renamePage")}
                  onDragStart={(e) => e.stopPropagation()}
                  draggable={false}
                >
                  <EditIcon size={12} />
                </button>
              </>
            )}
            
            {((!page.locked && contractPages.length > 1) || (page.locked && isFirstInPdfBlock)) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePage(index);
                }}
                className="text-content-muted hover:text-content-primary p-1 rounded hover:bg-surface-hover ml-1"
                title={page.locked ? "Delete PDF block" : "Delete page"}
                onDragStart={(e) => e.stopPropagation()}
                draggable={false}
              >
                <TrashIcon size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PageTabs;
