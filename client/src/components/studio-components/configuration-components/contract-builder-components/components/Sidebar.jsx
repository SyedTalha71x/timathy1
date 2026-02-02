import React from 'react';
import { Input } from 'antd';
import { EditIcon, FileIcon, HelpCircle } from 'lucide-react';

const Sidebar = ({
  ELEMENT_CATEGORIES,
  addElement,
  contractName,
  editingContractName,
  setEditingContractName,
  setContractName,
  contractForm,
  onUpdate,
  contractNameInputRef,
  contractPages,
  currentPage,
  setShowHotkeysModal  // NEU: Für Hotkeys-Modal
}) => {
  const isPdfPage = contractPages?.[currentPage]?.locked;
  
  return (
    <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg text-black">Contract Builder</h2>
          <button
            onClick={() => setShowHotkeysModal(true)}
            className="text-gray-400 hover:text-blue-500 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="Keyboard Shortcuts"
          >
            <HelpCircle size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {editingContractName ? (
            <Input
              ref={contractNameInputRef}
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              onBlur={() => {
                setEditingContractName(false);
                const updatedForm = {
                  ...(contractForm || {}),
                  name: contractName
                };
                onUpdate(updatedForm);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingContractName(false);
                  const updatedForm = {
                    ...(contractForm || {}),
                    name: contractName
                  };
                  onUpdate(updatedForm);
                } else if (e.key === 'Escape') {
                  setEditingContractName(false);
                  setContractName(contractForm?.name || 'Unnamed Contract');
                }
              }}
              className="text-sm flex-1"
              placeholder="Contract name"
              autoFocus
            />
          ) : (
            <>
              <span className="text-sm text-black flex-1 truncate">{contractName}</span>
              <button
                onClick={() => setEditingContractName(true)}
                className="text-gray-400 hover:text-blue-500 p-1"
                title="Rename contract"
              >
                <EditIcon size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative">
        {/* PDF page overlay for element area */}
        {isPdfPage && (
          <div className="absolute inset-0 bg-gray-600 bg-opacity-90 z-50 flex items-center justify-center">
            <div className="text-center p-4">
              <FileIcon size={48} className="mx-auto mb-3 text-gray-200" />
              <p className="text-white font-medium mb-1">PDF page selected.</p>
              <p className="text-gray-200 text-sm">PDF pages cannot be edited.</p>
            </div>
          </div>
        )}
        
        {ELEMENT_CATEGORIES.map(category => (
          <div key={category.category} className="mb-6">
            <h3 className="font-medium text-sm text-black mb-2 uppercase tracking-wide">
              {category.category}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {category.types.map(type => (
                <button
                  key={type.value}
                  onClick={() => addElement(type.value)}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-colors ${type.color}`}
                  disabled={isPdfPage}
                >
                  <span className="mb-1 text-black">{type.icon}</span>
                  <span className="text-xs text-black">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
