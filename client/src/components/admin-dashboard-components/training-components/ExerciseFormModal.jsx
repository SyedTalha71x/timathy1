/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Save, Upload } from "lucide-react";

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
  const isOpen = isCreateModalOpen || isEditModalOpen;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl max-h-[80vh] custom-scrollbar overflow-y-auto">
        <div className="p-4 sm:p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isCreateModalOpen ? "Upload New Exercise" : "Edit Exercise"}
            </h2>

            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedVideo(null);
                resetForm();
              }}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
                  placeholder="Enter exercise name..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none resize-none"
                  rows={4}
                  placeholder="Describe the exercise..."
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                  className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 focus:border-blue-500 outline-none"
                >
                  {["Easy", "Medium", "Hard"].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Uploads */}
              <div className="space-y-4">
                {/* Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Exercise Video {isCreateModalOpen ? "*" : "(Optional)"}
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
                    className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Thumbnail Image (Optional)
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
                    className="w-full bg-[#161616] rounded-xl px-4 py-3 text-white border border-gray-700 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Target Muscles */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Target Muscles * ({formData.targetMuscles.length} selected)
                </label>

                <div className="max-h-48 overflow-y-auto custom-scrollbar bg-[#161616] rounded-xl border border-gray-700 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {muscleOptions.map((muscle) => (
                      <label
                        key={muscle}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[#2F2F2F] p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetMuscles.includes(muscle)}
                          onChange={() => handleMuscleToggle(muscle)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-white text-sm">{muscle}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Equipment Needed ({formData.equipment.length} selected)
                </label>

                <div className="max-h-48 overflow-y-auto custom-scrollbar bg-[#161616] rounded-xl border border-gray-700 p-3">
                  {equipmentOptions.map((equipment) => (
                    <label
                      key={equipment}
                      className="flex items-center gap-2 cursor-pointer hover:bg-[#2F2F2F] p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.equipment.includes(equipment)}
                        onChange={() => handleEquipmentToggle(equipment)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-white text-sm">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Selected Muscles:
                </h4>
                <div className="flex flex-wrap gap-1 mb-4">
                  {formData.targetMuscles.map((m, i) => (
                    <span key={i} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {m}
                    </span>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Selected Equipment:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {formData.equipment.length > 0 ? (
                    formData.equipment.map((e, i) => (
                      <span key={i} className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                        {e}
                      </span>
                    ))
                  ) : (
                    <span className="bg-[#2F2F2F] text-gray-300 px-2 py-1 rounded text-xs">
                      None
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedVideo(null);
                resetForm();
              }}
              className="flex-1 px-4 py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-white"
            >
              Cancel
            </button>

            <button
              onClick={isCreateModalOpen ? handleCreate : handleEdit}
              disabled={
                !formData.name ||
                !formData.description ||
                formData.targetMuscles.length === 0
              }
              className="flex-1 px-4 py-3 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl text-white flex items-center justify-center gap-2"
            >
              {isCreateModalOpen ? <Upload size={16} /> : <Save size={16} />}
              {isCreateModalOpen ? "Upload Exercise" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
