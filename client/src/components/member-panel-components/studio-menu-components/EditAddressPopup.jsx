/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { haptic } from "../../../utils/haptic";
import { FormField, FormActions } from "./FormComponents";
import KeyboardSpacer from "../../../components/shared/KeyboardSpacer";
import CustomSelect from "../../../components/shared/CustomSelect";

const EditAddressPopup = ({ show, data, onChange, onSave, onClose, countries, countriesLoading }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md relative max-h-[90%] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl text-content-primary font-bold">Edit Address</h2>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Address</div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Street" value={data.street} onChange={(e) => onChange("street", e.target.value)} placeholder="Main Street" />
            <FormField label="House Number" value={data.houseNumber} onChange={(e) => onChange("houseNumber", e.target.value)} placeholder="123" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="ZIP Code" value={data.zipCode} onChange={(e) => onChange("zipCode", e.target.value)} placeholder="12345" />
            <FormField label="City" value={data.city} onChange={(e) => onChange("city", e.target.value)} placeholder="Berlin" />
          </div>

          <div data-no-spacer>
            <label className="text-sm text-content-secondary block mb-2">Country</label>
            <CustomSelect
              name="country"
              value={data.country}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder={countriesLoading ? "Loading countries..." : "Select a country"}
              searchable
              options={countries.map((country) => ({
                value: country.name,
                label: country.name,
              }))}
              disabled={countriesLoading}
            />
          </div>
          <KeyboardSpacer />
        </div>

        <FormActions onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditAddressPopup;
