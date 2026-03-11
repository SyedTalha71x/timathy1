/* eslint-disable react/prop-types */
import { Trash2 } from "lucide-react";
import { getTranslation } from "../shared/LanguageTabs";

export default function DeleteExerciseModal({
  isOpen,
  videoToDelete,
  onClose,
  onConfirmDelete,
}) {
  if (!isOpen || !videoToDelete) return null;

  const exerciseName = getTranslation(videoToDelete.name, "en");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-auto border-t sm:border border-[#333333] shadow-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/15 rounded-xl">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Delete Exercise
              </h3>
              <p className="text-gray-400 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-gray-300 mb-6 text-sm">
            Are you sure you want to delete{" "}
            <strong className="text-white">&quot;{exerciseName}&quot;</strong>?
            All associated data and translations will be permanently removed.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#2F2F2F] text-sm cursor-pointer hover:bg-[#3F3F3F] rounded-xl text-white transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirmDelete}
              className="flex-1 px-4 py-3 bg-red-600 text-sm cursor-pointer hover:bg-red-700 rounded-xl text-white transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
