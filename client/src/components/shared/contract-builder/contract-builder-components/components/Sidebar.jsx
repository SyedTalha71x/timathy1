import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const isPdfPage = contractPages?.[currentPage]?.locked;
  
  return (
    <div className="hidden lg:flex lg:w-64 bg-surface-card border-r border-border flex-col shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg text-content-primary">{t("contractBuilder.title")}</h2>
          <button
            onClick={() => setShowHotkeysModal(true)}
            className="text-content-muted hover:text-primary p-1 rounded-xl hover:bg-surface-hover transition-colors"
            title={t("contractBuilder.keyboardShortcuts")}
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
                  setContractName(contractForm?.name || t('contractBuilder.unnamed'));
                }
              }}
              className="text-sm flex-1"
              placeholder={t("contractBuilder.contractName")}
              autoFocus
            />
          ) : (
            <>
              <span className="text-sm text-content-primary flex-1 truncate">{contractName}</span>
              <button
                onClick={() => setEditingContractName(true)}
                className="text-content-muted hover:text-primary p-1"
                title={t("contractBuilder.renameContract")}
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
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="text-center p-4">
              <FileIcon size={48} className="mx-auto mb-3 text-white/80" />
              <p className="text-white font-medium mb-1">{t("contractBuilder.properties.pdfSelected")}</p>
              <p className="text-white/80 text-sm">{t("contractBuilder.properties.pdfReadonly")}</p>
            </div>
          </div>
        )}
        
        {ELEMENT_CATEGORIES.map(category => (
          <div key={t(category.category)} className="mb-6">
            <h3 className="font-medium text-sm text-content-primary mb-2 uppercase tracking-wide">
              {t(category.category)}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {category.types.map(type => (
                <button
                  key={type.value}
                  onClick={() => addElement(type.value)}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors ${type.color}`}
                  disabled={isPdfPage}
                >
                  <span className="mb-1 text-content-primary">{type.icon}</span>
                  <span className="text-xs text-content-primary">{t(type.label)}</span>
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
