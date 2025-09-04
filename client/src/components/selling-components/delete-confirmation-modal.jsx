/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmationModal({
  show,
  onClose,
  onConfirm,
  productToDelete,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-red-500/20 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-white text-lg open_sans_font_700 text-center">
              Delete {productToDelete?.type === "service" ? "Service" : "Product"}
            </h2>
            <p className="text-gray-400 text-center mt-2">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
          </div>

          <div className="flex flex-row justify-center items-center gap-3 pt-2">
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-8 py-2.5 bg-red-500 text-sm text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-sm text-white rounded-xl border border-[#333333] hover:bg-[#101010] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
