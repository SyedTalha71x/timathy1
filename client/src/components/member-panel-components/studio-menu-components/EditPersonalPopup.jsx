/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";
import { FormField, FormActions } from "./FormComponents";
import KeyboardSpacer from "../../../components/shared/KeyboardSpacer";
import CustomSelect from "../../../components/shared/CustomSelect";
import DatePickerField from "../../../components/shared/DatePickerField";

const EditPersonalPopup = ({ show, data, onChange, onSave, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md relative max-h-[90%] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl text-content-primary font-bold">Edit Personal Data</h2>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Personal Information</div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" value={data.firstName} onChange={(e) => onChange("firstName", e.target.value)} required />
            <FormField label="Last Name" value={data.lastName} onChange={(e) => onChange("lastName", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div data-no-spacer>
              <label className="text-sm text-content-secondary block mb-2">Gender</label>
              <CustomSelect
                name="gender"
                value={data.gender || ""}
                onChange={(e) => onChange("gender", e.target.value)}
                placeholder="Select gender"
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </div>
            <div>
              <label className="text-sm text-content-secondary block mb-2">Birthday</label>
              <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                <span className={data.dateOfBirth ? "text-content-primary" : "text-content-faint"}>
                  {data.dateOfBirth
                    ? (() => { const [y, m, d] = (data.dateOfBirth || "").split('-'); return `${d}.${m}.${y}` })()
                    : "Select date"}
                </span>
                <DatePickerField
                  value={data.dateOfBirth || ""}
                  onChange={(val) => onChange("dateOfBirth", val)}
                />
              </div>
            </div>
          </div>
          <KeyboardSpacer />
        </div>

        <FormActions onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditPersonalPopup;
