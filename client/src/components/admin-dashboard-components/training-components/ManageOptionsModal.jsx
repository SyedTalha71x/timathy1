/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X, Edit, Trash2, Save } from "lucide-react";

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
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] custom-scrollbar overflow-y-auto">
        <div className="p-4 sm:p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Manage Exercise Options</h2>
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
              <h3 className="text-lg font-semibold text-white">Muscle Groups</h3>

              {/* Add Muscle */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMuscleGroup}
                  onChange={(e) => setNewMuscleGroup(e.target.value)}
                  placeholder="Add new muscle group..."
                  className="flex-1 bg-[#161616] rounded-xl px-4 py-2 text-white border border-gray-700 focus:border-blue-500 outline-none"
                />
                <button
                  onClick={addMuscleGroup}
                  disabled={!newMuscleGroup.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl text-white"
                >
                  Add
                </button>
              </div>

              {/* Muscle List */}
              <div className="bg-[#161616] rounded-xl border border-gray-700 max-h-64 overflow-y-auto">
                {muscleOptions.map((muscle, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0"
                  >
                    {editingMuscleIndex === index ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingMuscleValue}
                          onChange={(e) => setEditingMuscleValue(e.target.value)}
                          className="flex-1 bg-[#2F2F2F] rounded px-3 py-1 text-white border border-gray-600 outline-none"
                        />
                        <button onClick={saveEditedMuscle} className="p-1 text-green-400 hover:text-green-300">
                          <Save size={16} />
                        </button>
                        <button onClick={cancelEditing} className="p-1 text-gray-400 hover:text-gray-300">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-white flex-1">{muscle}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditingMuscle(index, muscle)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => removeMuscleGroup(index)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Equipment</h3>

              {/* Add Equipment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Add new equipment..."
                  className="flex-1 bg-[#161616] rounded-xl px-4 py-2 text-white border border-gray-700 focus:border-blue-500 outline-none"
                />
                <button
                  onClick={addEquipment}
                  disabled={!newEquipment.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl text-white"
                >
                  Add
                </button>
              </div>

              {/* Equipment List */}
              <div className="bg-[#161616] rounded-xl border border-gray-700 max-h-64 overflow-y-auto">
                {equipmentOptions.map((equipment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0"
                  >
                    {editingEquipmentIndex === index ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingEquipmentValue}
                          onChange={(e) => setEditingEquipmentValue(e.target.value)}
                          className="flex-1 bg-[#2F2F2F] rounded px-3 py-1 text-white border border-gray-600 outline-none"
                        />
                        <button onClick={saveEditedEquipment} className="p-1 text-green-400 hover:text-green-300">
                          <Save size={16} />
                        </button>
                        <button onClick={cancelEditing} className="p-1 text-gray-400 hover:text-gray-300">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-white flex-1">{equipment}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditingEquipment(index, equipment)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => removeEquipment(index)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
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
