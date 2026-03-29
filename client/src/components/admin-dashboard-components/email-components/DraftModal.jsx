/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const DraftModal = ({ show, onClose, onDiscard, onSave }) => {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t("admin.email.draftModal.title")}</h3>
            <p className="text-sm text-gray-500">{t("admin.email.draftModal.subtitle")}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          {t("admin.email.draftModal.message")}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onDiscard}
            className="px-5 py-2.5 bg-[#333333] hover:bg-[#444444] text-white rounded-xl text-sm font-medium transition-colors"
          >
            {t("admin.email.draftModal.discard")}
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {t("admin.email.draftModal.saveDraft")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
