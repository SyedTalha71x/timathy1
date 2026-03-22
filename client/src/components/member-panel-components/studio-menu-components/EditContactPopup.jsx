/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";
import { FormField, FormActions } from "./FormComponents";
import KeyboardSpacer from "../../../components/shared/KeyboardSpacer";

const EditContactPopup = ({ show, data, onChange, onSave, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md relative max-h-[90%] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl text-content-primary font-bold">Edit Contact Details</h2>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Contact Information</div>

          <FormField label="Email" type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)} required />

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Mobile Number" type="tel" value={data.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+49 123 456789" />
            <FormField label="Telephone Number" type="tel" value={data.telephoneNumber} onChange={(e) => onChange("telephoneNumber", e.target.value)} placeholder="030 12345678" />
          </div>
          <KeyboardSpacer />
        </div>

        <FormActions onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditContactPopup;
