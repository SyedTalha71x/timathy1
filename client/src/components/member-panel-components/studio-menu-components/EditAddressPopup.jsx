/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";
import { haptic } from "../../../utils/haptic";
import { FormField, FormActions } from "./FormComponents";
import CustomSelect from "../../../components/shared/CustomSelect";

const EditAddressPopup = ({ show, data, onChange, onSave, onClose, countries, countriesLoading }) => {
  const { t, i18n } = useTranslation();
  if (!show) return null;

  /** Translate ISO country code to localized name, e.g. "DE" → "Deutschland" */
  const regionNames = (() => {
    try { return new Intl.DisplayNames([i18n.language], { type: "region" }) }
    catch { return null }
  })()
  const localCountryName = (country) => {
    if (regionNames && country.code) {
      try { return regionNames.of(country.code) } catch { /* fall through */ }
    }
    return country.name
  }

  const sortedCountries = [...countries]
    .map(c => ({ ...c, localName: localCountryName(c) }))
    .sort((a, b) => a.localName.localeCompare(b.localName, i18n.language))

  return (
    <div className="absolute inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md relative max-h-[90%] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl text-content-primary font-bold">{t("studioMenu.personal.editAddress")}</h2>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">{t("studioMenu.personal.address")}</div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("studioMenu.popup.street")} value={data.street} onChange={(e) => onChange("street", e.target.value)} placeholder="Main Street" />
            <FormField label={t("studioMenu.popup.houseNumber")} value={data.houseNumber} onChange={(e) => onChange("houseNumber", e.target.value)} placeholder="123" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("studioMenu.popup.zipCode")} value={data.zipCode} onChange={(e) => onChange("zipCode", e.target.value)} placeholder="12345" />
            <FormField label={t("studioMenu.popup.city")} value={data.city} onChange={(e) => onChange("city", e.target.value)} placeholder="Berlin" />
          </div>

          <div data-no-spacer>
            <label className="text-sm text-content-secondary block mb-2">{t("studioMenu.popup.country")}</label>
            <CustomSelect
              name="country"
              value={data.country}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder={countriesLoading ? t("studioMenu.forms.loadingCountries") : t("studioMenu.popup.selectCountry")}
              searchable
              options={sortedCountries.map((country) => ({
                value: country.name,
                label: country.localName,
              }))}
              disabled={countriesLoading}
            />
          </div>
        </div>

        <FormActions onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditAddressPopup;
