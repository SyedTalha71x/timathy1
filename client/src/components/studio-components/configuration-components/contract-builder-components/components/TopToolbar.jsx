import React, { useState } from 'react';
import {
  PlusIcon, FilePlusIcon, SaveIcon, EyeIcon,
  UndoIcon, RedoIcon, ZoomInIcon, ZoomOutIcon, XIcon
} from 'lucide-react';

// YouTube-style Tooltip Component
const KeyboardTooltip = ({ label, shortcut, children, disabled = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => !disabled && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && !disabled && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <span>{label}</span>
          {shortcut && (
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontFamily: 'monospace'
            }}>
              {shortcut}
            </span>
          )}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '4px solid rgba(0, 0, 0, 0.9)'
          }} />
        </div>
      )}
    </div>
  );
};

const TopToolbar = ({
  setShowAddPageModal,
  setPdfInputRef,
  handlePdfUpload,
  isPdfProcessing,
  canvasZoom,
  setCanvasZoom,
  setHeaderFooterSettingsOpen,
  setShowPreview,
  setPreviewPage,
  setPreviewZoom,
  undo,
  redo,
  historyIndex,
  history,
  contractPages,
  currentPage,
  handleSave,
  onClose // NEW: Close handler
}) => {
  const isPdfPage = contractPages?.[currentPage]?.locked;
  
  return (
    <div className="bg-surface-card border-b border-border flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <KeyboardTooltip label="New Page" shortcut="N">
            <button
              onClick={() => setShowAddPageModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
            >
              <PlusIcon size={18} />
              <span className="text-sm font-medium">New Page</span>
            </button>
          </KeyboardTooltip>

          <KeyboardTooltip label="Add PDF" shortcut="A">
            <label className="flex items-center gap-2 bg-surface-button text-content-primary px-4 py-2 rounded-xl hover:bg-surface-button-hover transition-colors cursor-pointer relative">
              <FilePlusIcon size={18} className="text-content-primary" />
              <span className="text-sm font-medium">Add PDF</span>
              <input
                type="file"
                accept=".pdf"
                ref={setPdfInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handlePdfUpload(file);
                    e.target.value = '';
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isPdfProcessing}
              />
              {isPdfProcessing && (
                <span className="ml-2 text-xs text-content-muted">Processing...</span>
              )}
            </label>
          </KeyboardTooltip>
        </div>

        <div className="flex items-center gap-2">
          <KeyboardTooltip label="Zoom Out" shortcut="Ctrl+Scroll ↓">
            <button
              onClick={() => setCanvasZoom(prev => Math.max(0.5, prev - 0.05))}
              className="p-2 text-content-secondary hover:bg-surface-hover rounded-xl"
            >
              <ZoomOutIcon size={18} />
            </button>
          </KeyboardTooltip>
          <span className="text-sm font-medium text-content-secondary w-12 text-center">
            {Math.round(canvasZoom * 100)}%
          </span>
          <KeyboardTooltip label="Zoom In" shortcut="Ctrl+Scroll ↑">
            <button
              onClick={() => setCanvasZoom(prev => Math.min(1.2, prev + 0.05))}
              className="p-2 text-content-secondary hover:bg-surface-hover rounded-xl"
            >
              <ZoomInIcon size={18} />
            </button>
          </KeyboardTooltip>
        </div>

        <div className="flex items-center gap-2">
          <KeyboardTooltip label="Header/Footer Settings" shortcut="H" disabled={isPdfPage}>
            <button
              onClick={() => setHeaderFooterSettingsOpen(true)}
              disabled={isPdfPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                isPdfPage 
                  ? 'bg-surface-hover text-content-muted cursor-not-allowed' 
                  : 'bg-surface-button text-content-primary hover:bg-surface-button-hover'
              }`}
            >
              <span className="text-sm font-medium">Header/Footer</span>
            </button>
          </KeyboardTooltip>
          
          <KeyboardTooltip label="Preview Contract" shortcut="P">
            <button
              onClick={() => {
                setShowPreview(true);
                setPreviewPage(0);
                setPreviewZoom(0.7);
              }}
              className="flex items-center gap-2 bg-surface-button text-content-primary px-4 py-2 rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              <EyeIcon size={18} />
              <span className="text-sm font-medium">Preview</span>
            </button>
          </KeyboardTooltip>

          <KeyboardTooltip label="Save Contract" shortcut="Ctrl+S">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
            >
              <SaveIcon size={18} />
              <span className="text-sm font-medium">Save</span>
            </button>
          </KeyboardTooltip>

          <div className="flex items-center gap-2 border-l border-border pl-2">
            <KeyboardTooltip label="Undo" shortcut="Ctrl+Z" disabled={historyIndex <= 0}>
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${historyIndex <= 0 ? 'bg-surface-hover text-content-muted cursor-not-allowed' : 'bg-surface-button text-content-primary hover:bg-surface-button-hover'}`}
              >
                <UndoIcon size={18} />
              </button>
            </KeyboardTooltip>
            <KeyboardTooltip label="Redo" shortcut="Ctrl+Y" disabled={historyIndex >= history.length - 1}>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${historyIndex >= history.length - 1 ? 'bg-surface-hover text-content-muted cursor-not-allowed' : 'bg-surface-button text-content-primary hover:bg-surface-button-hover'}`}
              >
                <RedoIcon size={18} />
              </button>
            </KeyboardTooltip>
          </div>

          {/* Close Button - only shown when onClose is provided */}
          {onClose && (
            <div className="border-l border-border pl-2 ml-1">
              <KeyboardTooltip label="Close" shortcut="Esc">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors bg-surface-button text-content-primary hover:bg-surface-button-hover"
                >
                  <XIcon size={18} />
                </button>
              </KeyboardTooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
