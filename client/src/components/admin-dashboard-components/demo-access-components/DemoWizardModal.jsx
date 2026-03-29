/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Search, X, ChevronLeft, ChevronRight, Plus, Shield, Clock, Mail, User, Building2, Check, UserX,
} from "lucide-react";
import { MdPerson } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

// ============================================
// Shared sub-components
// ============================================
const StepIndicator = ({ current, total }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
      <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s <= current ? "bg-orange-500 w-8" : "bg-gray-700 w-6"}`} />
    ))}
  </div>
);

// ============================================
// Step 1: Lead Selection
// ============================================
const LeadStep = ({ leads, selectedLead, onSelect, onSkip }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={t("admin.demoAccess.wizard.searchLeads")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4 space-y-2">
        {/* Skip / guest option */}
        <button
          onClick={onSkip}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
            selectedLead?.id === "guest"
              ? "border-orange-500 bg-orange-500/10"
              : "border-dashed border-gray-700 hover:border-gray-600 bg-[#2A2A2A]"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <UserX size={16} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-300">{t("admin.demoAccess.wizard.continueWithoutLead")}</p>
            <p className="text-xs text-gray-500">{t("admin.demoAccess.wizard.manualDetails")}</p>
          </div>
        </button>

        {filtered.length === 0 && search && (
          <div className="py-8 text-center text-gray-500 text-sm">{t("admin.demoAccess.wizard.noLeadsFound")}</div>
        )}

        {filtered.map((lead) => {
          const isSelected = selectedLead?.id === lead.id;
          return (
            <button
              key={lead.id}
              onClick={() => onSelect(lead)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                isSelected ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-600 bg-[#2A2A2A]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <MdPerson size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                <p className="text-xs text-gray-500 truncate">{lead.company}</p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// Step 2: Template Selection
// ============================================
const TemplateStep = ({ templates, selectedTemplate, onSelect }) => {
  const { t } = useTranslation();
  return (
  <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
    <div className="grid grid-cols-1 gap-3">
      {templates.map((tmpl) => {
        const isSelected = selectedTemplate?.id === tmpl.id;
        const permEntries = Object.entries(tmpl.permissions || {});
        const enabledCount = permEntries.filter(([, v]) => v).length;

        return (
          <button
            key={tmpl.id}
            onClick={() => onSelect(tmpl)}
            className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
              isSelected ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-[#2A2A2A] hover:border-gray-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tmpl.color}20` }}>
                <RiShieldKeyholeLine size={20} style={{ color: tmpl.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-white">{tmpl.name}</h3>
                  <span className="text-xs text-gray-500">{enabledCount}/{permEntries.length} {t("admin.demoAccess.wizard.features")}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{tmpl.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {permEntries.map(([key, val]) => (
                    <span key={key} className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${val ? "bg-green-500/15 text-green-400" : "bg-gray-700/50 text-gray-500 line-through"}`}>
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-600"}`}>
                {isSelected && <Check size={12} className="text-white" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
  );
};

// ============================================
// Step 3: Configuration
// ============================================
const ConfigStep = ({ config, onChange, selectedLead, selectedTemplate }) => {
  const { t } = useTranslation();
  return (
  <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
    {/* Context bar */}
    <div className="flex flex-wrap items-center gap-2 py-2.5 px-3 bg-[#222222] rounded-xl text-xs text-gray-400">
      <span>
        Lead:{" "}
        <span className="text-white">{selectedLead?.id === "guest" ? t("admin.demoAccess.wizard.noLead") : (selectedLead?.name || "—")}</span>
      </span>
      <div className="w-px h-3 bg-gray-700" />
      <span>
        {t("admin.demoAccess.wizard.template")}:{" "}
        <span className="text-white">{selectedTemplate?.name || "—"}</span>
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.studioName")}</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            value={config.studioName}
            onChange={(e) => onChange({ ...config, studioName: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder={t("admin.demoAccess.wizard.placeholders.studioName")}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.ownerFirstName")}</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            value={config.studioOwnerFirstName}
            onChange={(e) => onChange({ ...config, studioOwnerFirstName: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder={t("admin.demoAccess.wizard.placeholders.firstName")}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.ownerLastName")}</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            value={config.studioOwnerLastName}
            onChange={(e) => onChange({ ...config, studioOwnerLastName: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder={t("admin.demoAccess.wizard.placeholders.lastName")}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.duration")}</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="number"
            min="1"
            max="90"
            value={config.demoDuration}
            onChange={(e) => onChange({ ...config, demoDuration: parseInt(e.target.value) || 7 })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.email")}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="email"
            value={config.email}
            onChange={(e) => onChange({ ...config, email: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="user@example.com"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

// ============================================
// Edit Mode: Config + Template in one view
// ============================================
const EditView = ({ config, onChange, templates, selectedTemplateId, onSelectTemplate }) => {
  const { t } = useTranslation();
  return (
  <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.studioName")}</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input type="text" value={config.studioName} onChange={(e) => onChange({ ...config, studioName: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.ownerFirstName")}</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input type="text" value={config.studioOwnerFirstName} onChange={(e) => onChange({ ...config, studioOwnerFirstName: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.ownerLastName")}</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input type="text" value={config.studioOwnerLastName} onChange={(e) => onChange({ ...config, studioOwnerLastName: e.target.value })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.duration")}</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input type="number" min="1" max="90" value={config.demoDuration} onChange={(e) => onChange({ ...config, demoDuration: parseInt(e.target.value) || 7 })}
            className="w-full bg-[#2A2A2A] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("admin.demoAccess.wizard.fields.emailAddress")}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input type="email" value={config.email} disabled
            className="w-full bg-[#222222] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none" />
        </div>
        <p className="text-[10px] text-gray-600 mt-1">{t("admin.demoAccess.wizard.emailCannotChange")}</p>
      </div>
    </div>

    {/* Template selector */}
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2">{t("admin.demoAccess.wizard.template")}</label>
      <div className="grid grid-cols-1 gap-2">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          const permCount = Object.values(tmpl.permissions || {}).filter(Boolean).length;
          const totalPerm = Object.keys(tmpl.permissions || {}).length;
          return (
            <button key={tmpl.id} type="button" onClick={() => onSelectTemplate(tmpl.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-[#2A2A2A] hover:border-gray-600"}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tmpl.color}20` }}>
                <Shield size={14} style={{ color: tmpl.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{tmpl.name}</p>
                <p className="text-xs text-gray-500">{tmpl.description} · {permCount}/{totalPerm} {t("admin.demoAccess.wizard.features")}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-600"}`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
  );
};

// ============================================
// Main Wizard Modal
// ============================================
const DemoWizardModal = ({
  isOpen, onClose, mode = "create", leads = [], templates = [], onCreate, demo, onUpdate, initialLead = null,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [config, setConfig] = useState({ studioName: "", studioOwnerFirstName: "", studioOwnerLastName: "", demoDuration: 7, email: "" });
  const [editTemplateId, setEditTemplateId] = useState("");

  const stepLabels = [t("admin.demoAccess.wizard.steps.selectLead"), t("admin.demoAccess.wizard.steps.chooseTemplate"), t("admin.demoAccess.wizard.steps.configure")];

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && demo) {
      setConfig({ studioName: demo.config?.studioName || "", studioOwnerFirstName: demo.config?.studioOwnerFirstName || "", studioOwnerLastName: demo.config?.studioOwnerLastName || "", demoDuration: demo.config?.demoDuration || 7, email: demo.config?.email || "" });
      setEditTemplateId(demo.template?.id || "");
    } else if (initialLead) {
      setSelectedLead(initialLead);
      const nameParts = (initialLead.name || "").trim().split(/\s+/);
      setConfig({ studioName: initialLead.company ? `${initialLead.company} Studio` : "", studioOwnerFirstName: nameParts[0] || "", studioOwnerLastName: nameParts.slice(1).join(" ") || "", demoDuration: 7, email: initialLead.email || "" });
      setSelectedTemplate(null);
      setStep(2);
    } else {
      setStep(1); setSelectedLead(null); setSelectedTemplate(null);
      setConfig({ studioName: "", studioOwnerFirstName: "", studioOwnerLastName: "", demoDuration: 7, email: "" });
    }
  }, [isOpen, mode, demo, initialLead]);

  if (!isOpen) return null;

  const isCreate = mode === "create";
  const totalSteps = 3;

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    const nameParts = (lead.name || "").trim().split(/\s+/);
    setConfig((prev) => ({ ...prev, studioName: `${lead.company} Studio`, studioOwnerFirstName: nameParts[0] || "", studioOwnerLastName: nameParts.slice(1).join(" ") || "", email: lead.email || "" }));
  };

  const handleSkipLead = () => {
    setSelectedLead({ id: "guest", name: "", email: "", company: "" });
    setConfig((prev) => ({ ...prev, studioName: "", studioOwnerFirstName: "", studioOwnerLastName: "", email: "" }));
  };

  const canGoNext = () => {
    if (step === 1) return selectedLead !== null;
    if (step === 2) return selectedTemplate !== null;
    if (step === 3) return config.studioName && config.studioOwnerFirstName && config.studioOwnerLastName && config.email;
    return false;
  };

  const handleNext = () => { if (step < totalSteps) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleCreate = () => { if (onCreate) onCreate({ lead: selectedLead, template: selectedTemplate, config }); };
  const handleUpdate = () => { if (onUpdate) { const template = templates.find((tmpl) => tmpl.id === editTemplateId) || demo?.template; onUpdate({ ...config, sendEmail: demo?.config?.sendEmail ?? true, template, templateId: editTemplateId }); } };
  const canSubmitEdit = config.studioName && config.studioOwnerFirstName && config.studioOwnerLastName && config.email && editTemplateId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-2xl max-w-2xl w-full border border-gray-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-white">
              {isCreate ? t("admin.demoAccess.wizard.newAccess") : t("admin.demoAccess.wizard.editAccess")}
            </h2>
            {isCreate && (
              <>
                <StepIndicator current={step} total={totalSteps} />
                <span className="text-xs text-gray-500 hidden sm:inline">{stepLabels[step - 1]}</span>
              </>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#333333] rounded-lg transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {isCreate ? (
            <>
              {step === 1 && <LeadStep leads={leads} selectedLead={selectedLead} onSelect={handleSelectLead} onSkip={handleSkipLead} />}
              {step === 2 && <TemplateStep templates={templates} selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} />}
              {step === 3 && <ConfigStep config={config} onChange={setConfig} selectedLead={selectedLead} selectedTemplate={selectedTemplate} />}
            </>
          ) : (
            <EditView config={config} onChange={setConfig} templates={templates} selectedTemplateId={editTemplateId} onSelectTemplate={setEditTemplateId} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between flex-shrink-0">
          {isCreate ? (
            <>
              <button onClick={step === 1 ? onClose : handleBack}
                className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333333] text-gray-300 text-sm rounded-xl transition-colors flex items-center gap-1.5">
                {step === 1 ? t("common.cancel") : (<><ChevronLeft size={14} /> {t("common.back")}</>)}
              </button>
              {step < totalSteps ? (
                <button onClick={handleNext} disabled={!canGoNext()}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-xl transition-colors flex items-center gap-1.5">
                  {t("admin.demoAccess.wizard.next")} <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={handleCreate} disabled={!canGoNext()}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-xl transition-colors flex items-center gap-1.5">
                  <Plus size={14} /> {t("admin.demoAccess.wizard.createAccess")}
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333333] text-gray-300 text-sm rounded-xl transition-colors">
                {t("common.cancel")}
              </button>
              <button onClick={handleUpdate} disabled={!canSubmitEdit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-xl transition-colors">
                {t("admin.demoAccess.wizard.updateAccess")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoWizardModal;
