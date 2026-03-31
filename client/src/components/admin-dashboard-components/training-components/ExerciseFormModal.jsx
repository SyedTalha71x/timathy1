/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { X, Save, Upload } from "lucide-react";
import LanguageTabs, { LANGUAGES, getOptionName } from "../../shared/LanguageTabs";
import { useTranslation } from "react-i18next";

export default function ExerciseFormModal({
  isCreateModalOpen,
  isEditModalOpen,
  formData,
  setFormData,
  muscleOptions,
  equipmentOptions,
  handleMuscleToggle,
  handleEquipmentToggle,
  handleCreate,
  handleEdit,
  setIsCreateModalOpen,
  setIsEditModalOpen,
  setSelectedVideo,
  resetForm,
}) {
  const { t } = useTranslation();
  const [formLang, setFormLang] = useState("en");

  const isOpen = isCreateModalOpen || isEditModalOpen;
  if (!isOpen) return null;

  const updateTranslation = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [formLang]: value },
    }));
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedVideo(null);
    resetForm();
    setFormLang("en");
  };

  const currentLangLabel = t(`languages.${formLang}`);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[80vh] overflow-y-auto custom-scrollbar border-t sm:border border-[#333333] shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-[#1C1C1C] z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-[#333333] flex-shrink-0 rounded-t-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isCreateModalOpen ? t("admin.exercises.form.titleCreate") : t("admin.exercises.form.titleEdit")}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Language Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t("admin.exercises.form.language")}
            </label>
            <LanguageTabs
              selectedLang={formLang}
              onSelect={setFormLang}
              translations={formData.name}
            />
            {formLang !== "en" && (
              <p className="text-xs text-gray-500 mt-1.5">
                {t("admin.exercises.form.langHint", { language: currentLangLabel })}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-5 sm:space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t("admin.exercises.form.exerciseName")}{" "}
                  {formLang === "en" ? "*" : `(${currentLangLabel})`}
                </label>
                <input
                  type="text"
                  value={formData.name?.[formLang] || ""}
                  onChange={(e) => updateTranslation("name", e.target.value)}
                  className="w-full bg-[#161616] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm border border-[#333333] focus:border-blue-500 outline-none"
                  placeholder={
                    formLang === "en"
                      ? t("admin.exercises.form.exerciseNamePlaceholder")
                      : formData.name?.en
                        ? t("admin.exercises.form.translationFor", { name: formData.name.en })
                        : t("admin.exercises.form.enterTranslation")
                  }
                />
                {formLang !== "en" && formData.name?.en && (
                  <p className="text-xs text-gray-600 mt-1">
                    🇬🇧 {formData.name.en}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t("admin.exercises.form.description")}{" "}
                  {formLang === "en" ? "*" : `(${currentLangLabel})`}
                </label>
                <textarea
                  value={formData.description?.[formLang] || ""}
                  onChange={(e) =>
                    updateTranslation("description", e.target.value)
                  }
                  className="w-full bg-[#161616] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm border border-[#333333] focus:border-blue-500 outline-none resize-none"
                  rows={4}
                  placeholder={
                    formLang === "en"
                      ? t("admin.exercises.form.descriptionPlaceholder")
                      : formData.description?.en
                        ? t("admin.exercises.form.descriptionTranslationPlaceholder")
                        : t("admin.exercises.form.enterTranslation")
                  }
                />
                {formLang !== "en" && formData.description?.en && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    🇬🇧 {formData.description.en}
                  </p>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t("admin.exercises.form.difficultyLevel")}
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full bg-[#161616] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm border border-[#333333] focus:border-blue-500 outline-none"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((option) => (
                    <option key={option} value={option}>{t(`training.difficulty.${option.toLowerCase()}`)}</option>
                  ))}
                </select>
              </div>

              {/* Uploads */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("admin.exercises.form.exerciseVideo")} {isCreateModalOpen ? "*" : `(${t("admin.exercises.form.optional")})`}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videoFile: e.target.files[0],
                      })
                    }
                    className="w-full bg-[#161616] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm border border-[#333333] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("admin.exercises.form.thumbnailImage")} ({t("admin.exercises.form.optional")})
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        thumbnailFile: e.target.files[0],
                      })
                    }
                    className="w-full bg-[#161616] rounded-xl px-4 py-2.5 sm:py-3 text-white text-sm border border-[#333333] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5 sm:space-y-6">
              {/* Target Muscles */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  {t("admin.exercises.form.targetMuscles")} * ({t("admin.exercises.form.selectedCount", { count: formData.targetMuscles.length })})
                </label>
                <div className="max-h-48 overflow-y-auto custom-scrollbar bg-[#161616] rounded-xl border border-[#333333] p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {muscleOptions.map((muscle) => (
                      <label
                        key={muscle.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[#2F2F2F] p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetMuscles.includes(muscle.id)}
                          onChange={() => handleMuscleToggle(muscle.id)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-white text-sm">
                          {getOptionName(muscle, formLang)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  {t("admin.exercises.form.equipmentNeeded")} ({t("admin.exercises.form.selectedCount", { count: formData.equipment.length })})
                </label>
                <div className="max-h-48 overflow-y-auto custom-scrollbar bg-[#161616] rounded-xl border border-[#333333] p-3">
                  {equipmentOptions.map((equip) => (
                    <label
                      key={equip.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-[#2F2F2F] p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.equipment.includes(equip.id)}
                        onChange={() => handleEquipmentToggle(equip.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-white text-sm">
                        {getOptionName(equip, formLang)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  {t("admin.exercises.form.selectedMuscles")}
                </h4>
                <div className="flex flex-wrap gap-1 mb-4">
                  {formData.targetMuscles.map((muscleId, i) => {
                    const muscle = muscleOptions.find(
                      (m) => m.id === muscleId
                    );
                    return (
                      <span
                        key={i}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      >
                        {muscle ? getOptionName(muscle, formLang) : muscleId}
                      </span>
                    );
                  })}
                </div>

                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  {t("admin.exercises.form.selectedEquipment")}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {formData.equipment.length > 0 ? (
                    formData.equipment.map((equipId, i) => {
                      const equip = equipmentOptions.find(
                        (e) => e.id === equipId
                      );
                      return (
                        <span
                          key={i}
                          className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {equip ? getOptionName(equip, formLang) : equipId}
                        </span>
                      );
                    })
                  ) : (
                    <span className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                      {t("admin.exercises.form.none")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS - sticky bottom */}
        <div className="sticky bottom-0 bg-[#1C1C1C] border-t border-[#333333] px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={isCreateModalOpen ? handleCreate : handleEdit}
              disabled={
                !formData.name?.en ||
                !formData.description?.en ||
                formData.targetMuscles.length === 0
              }
              className="flex-1 px-4 py-3 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl text-white flex items-center justify-center gap-2"
            >
              {isCreateModalOpen ? <Upload size={16} /> : <Save size={16} />}
              {isCreateModalOpen ? t("admin.exercises.uploadExercise") : t("admin.exercises.form.saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
