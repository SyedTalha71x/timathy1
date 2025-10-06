// utils/fixModals.js
export const fixAllModals = () => {
    const modalOverlays = document.querySelectorAll('.fixed.inset-0');
    
    modalOverlays.forEach(overlay => {
      // Super high z-index for overlay
      overlay.style.zIndex = '2147483646';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
  
      // Dark blur background
      overlay.style.background = 'rgba(0, 0, 0, 0.8)';
      overlay.style.backdropFilter = 'blur(6px)';
  
      // Modal content on top of everything
      const modalContent = overlay.querySelector(':scope > div');
      if (modalContent) {
        modalContent.style.zIndex = '2147483647'; // max
        modalContent.style.position = 'relative';
      }
    });
  };
  
  // Auto-run
  export const startModalWatcher = () => {
    fixAllModals();
  
    const observer = new MutationObserver(fixAllModals);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  
    setInterval(fixAllModals, 1000);
  
    return observer;
  };
  