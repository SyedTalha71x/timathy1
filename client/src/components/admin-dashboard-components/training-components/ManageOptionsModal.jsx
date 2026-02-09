/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { X, Edit, Trash2, Save } from "lucide-react";
import LanguageTabs, { LANGUAGES, getOptionName } from "../shared/LanguageTabs";

export default function ManageOptionsModal({
  isOpen,

  muscleOptions,
  newMuscleGroup,
  setNewMuscleGroup,
  addMuscleGroup,
  removeMuscleGroup,
  editingMuscleIndex,
  editingMuscleValue,
  setEditingMuscleValue,
  startEditingMuscle,
  saveEditedMuscle,

  equipmentOptions,
  newEquipment,
  setNewEquipment,
  addEquipment,
  removeEquipment,
  editingEquipmentIndex,
  editingEquipmentValue,
  setEditingEquipmentValue,
  startEditingEquipment,
  saveEditedEquipment,

  cancelEditing,
  onClose,
}) {
  const [muscleLang, setMuscleLang] = useState("en");
  const [equipLang, setEquipLang] = useState("en");

  if (!isOpen) return null;

  const muscleLangLabel =
    LANGUAGES.find((l) => l.code === muscleLang)?.fullLabel || "English";
  const equipLangLabel =
    LANGUAGES.find((l) => l.code === equipLang)?.fullLabel || "English";

  const renderOptionRow = ({
    option,
    index,
    lang,
    editingIndex,
    editingValue,
    setEditingValue,
    onStartEditing,
    onSave,
    onRemove,
  }) => {
    const displayName = option.translations?.[lang]?.trim() || "";
    const fallbackName =
      option.translations?.en?.trim() ||
      Object.values(option.translations || {}).find((v) => v?.trim()) ||
      "(unnamed)";
    const isFallback = !displayName;
    const shownName = displayName || fallbackName;

    return (
      <div
        key={option.id || index}
        className="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0"
      >
        {editingIndex === index ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              className="flex-1 bg-[#2F2F2F] rounded px-3 py-1 text-white border border-gray-600 outline-none"
              placeholder={`${LANGUAGES.find((l) => l.code === lang)?.fullLabel} translation...`}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave(lang);
                if (e.key === "Escape") cancelEditing();
              }}
              autoFocus
            />
            <button
              onClick={() => onSave(lang)}
              className="p-1 text-green-400 hover:text-green-300"
            >
              <Save size={16} />
            </button>
            <button
              onClick={cancelEditing}
              className="p-1 text-gray-400 hover:text-gray-300"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <span
                className={`block truncate ${isFallback ? "text-gray-500 italic" : "text-white"}`}
              >
                {shownName}
              </span>
              {isFallback && (
                <span className="text-xs text-gray-600">
                  no {LANGUAGES.find((l) => l.code === lang)?.fullLabel}{" "}
                  translation
                </span>
              )}
              {!isFallback &&
                lang !== "en" &&
                option.translations?.en?.trim() && (
                  <span className="text-xs text-gray-600 block truncate">
                    🇬🇧 {option.translations.en}
                  </span>
                )}
            </div>
            <div className="flex items-center gap-1 ml-2">
              {/* Translation status dots */}
              <div className="flex gap-0.5 mr-2">
                {LANGUAGES.map((l) => (
                  <span
                    key={l.code}
                    title={`${l.fullLabel}: ${option.translations?.[l.code]?.trim() ? "✓" : "—"}`}
                    className={`w-1.5 h-1.5 rounded-full ${
                      option.translations?.[l.code]?.trim()
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  onStartEditing(index, option.translations?.[lang] || "")
                }
                className="p-1 text-blue-400 hover:text-blue-300"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onRemove(index)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] custom-scrollbar overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Manage Exercise Options
            </h2>
            <button
              onClick={() => {
                onClose();
                cancelEditing();
              }}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Muscle Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Muscle Groups
              </h3>

              <LanguageTabs
                selectedLang={muscleLang}
                onSelect={(lang) => {
                  setMuscleLang(lang);
                  cancelEditing();
                }}
              />

              {/* Add Muscle */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMuscleGroup}
                  onChange={(e) => setNewMuscleGroup(e.target.value)}
                  placeholder={`Add muscle group (${muscleLangLabel})...`}
                  className="flex-1 bg-[#161616] rounded-xl px-4 py-2 text-white border border-gray-700 focus:border-blue-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMuscleGroup.trim())
                      addMuscleGroup(muscleLang);
                  }}
                />
                <button
                  onClick={() => addMuscleGroup(muscleLang)}
                  disabled={!newMuscleGroup.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl text-white"
                >
                  Add
                </button>
              </div>

              {/* Muscle List */}
              <div className="bg-[#161616] rounded-xl border border-gray-700 max-h-64 overflow-y-auto">
                {muscleOptions.length === 0 ? (
                  <p className="text-gray-500 text-sm p-3 text-center">
                    No muscle groups added yet.
                  </p>
                ) : (
                  muscleOptions.map((muscle, index) =>
                    renderOptionRow({
                      option: muscle,
                      index,
                      lang: muscleLang,
                      editingIndex: editingMuscleIndex,
                      editingValue: editingMuscleValue,
                      setEditingValue: setEditingMuscleValue,
                      onStartEditing: startEditingMuscle,
                      onSave: saveEditedMuscle,
                      onRemove: removeMuscleGroup,
                    })
                  )
                )}
              </div>
            </div>

            {/* Equipment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Equipment</h3>

              <LanguageTabs
                selectedLang={equipLang}
                onSelect={(lang) => {
                  setEquipLang(lang);
                  cancelEditing();
                }}
              />

              {/* Add Equipment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder={`Add equipment (${equipLangLabel})...`}
                  className="flex-1 bg-[#161616] rounded-xl px-4 py-2 text-white border border-gray-700 focus:border-blue-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newEquipment.trim())
                      addEquipment(equipLang);
                  }}
                />
                <button
                  onClick={() => addEquipment(equipLang)}
                  disabled={!newEquipment.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl text-white"
                >
                  Add
                </button>
              </div>

              {/* Equipment List */}
              <div className="bg-[#161616] rounded-xl border border-gray-700 max-h-64 overflow-y-auto">
                {equipmentOptions.length === 0 ? (
                  <p className="text-gray-500 text-sm p-3 text-center">
                    No equipment added yet.
                  </p>
                ) : (
                  equipmentOptions.map((equip, index) =>
                    renderOptionRow({
                      option: equip,
                      index,
                      lang: equipLang,
                      editingIndex: editingEquipmentIndex,
                      editingValue: editingEquipmentValue,
                      setEditingValue: setEditingEquipmentValue,
                      onStartEditing: startEditingEquipment,
                      onSave: saveEditedEquipment,
                      onRemove: removeEquipment,
                    })
                  )
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                onClose();
                cancelEditing();
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
