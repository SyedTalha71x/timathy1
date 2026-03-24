/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import { haptic } from "../../../utils/haptic";

export const FormField = ({ label, type = "text", value, onChange, required, placeholder }) => (
  <div>
    <label className="text-sm text-content-secondary block mb-2">
      {label}{required && <span className="text-accent-red ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
    />
  </div>
);

export const FormActions = ({ onSave, onCancel }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end gap-2 pt-4 mt-auto flex-shrink-0">
      <button type="button" onClick={() => { haptic.light(); onCancel(); }}
        className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">
        {t("common.cancel")}
      </button>
      <button type="button" onClick={() => { haptic.success(); onSave(); }}
        className="px-4 py-2 text-sm text-white rounded-xl bg-primary hover:bg-primary-hover transition-colors">
        {t("studioMenu.popup.requestChange")}
      </button>
    </div>
  );
};
