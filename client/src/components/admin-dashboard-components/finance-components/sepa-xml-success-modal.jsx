/* eslint-disable react/prop-types */
import { Download, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function SepaXmlSuccessModal({ 
  isOpen, 
  onClose, 
  fileName,
  transactionCount,
  totalAmount,
  shouldAutoDownload = false
}) {
  // Auto-download when modal opens if shouldAutoDownload is true
  useEffect(() => {
    if (isOpen && shouldAutoDownload) {
      handleDownload();
    }
  }, [isOpen, shouldAutoDownload]);

  const handleDownload = () => {
    // Simulate download - in real app, this would download the actual XML file
    const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?><sepa>...</sepa>'], { 
      type: 'application/xml' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Don't close automatically after download
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] rounded-2xl border border-gray-700 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-green-500/20 p-2 rounded-full flex-shrink-0">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <h3 className="text-white text-base sm:text-lg font-semibold truncate">
              SEPA XML Generated
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-gray-300 text-sm">
            {shouldAutoDownload 
              ? "Your SEPA XML file has been generated and downloaded automatically."
              : "Your SEPA XML file has been generated successfully and is ready for download."
            }
          </p>
          
          <div className="bg-[#141414] rounded-lg p-3 sm:p-4 space-y-3">
            <div className="flex justify-between items-center gap-2 text-sm min-w-0">
              <span className="text-gray-400 flex-shrink-0 whitespace-nowrap">File Name:</span>
              <span className="text-white font-medium truncate text-right" title={fileName}>{fileName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transactions:</span>
              <span className="text-white">{transactionCount} records</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-green-500 font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(totalAmount)}
              </span>
            </div>
          </div>

          <p className="text-gray-400 text-xs">
            The XML file follows SEPA ISO 20022 standards and is ready for bank processing.
          </p>
        </div>

        {/* Footer - Show download button only if auto-download was disabled */}
        <div className={`flex gap-3 p-4 sm:p-6 border-t border-gray-700 ${shouldAutoDownload ? 'justify-center' : ''}`}>
          {shouldAutoDownload ? (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download XML</span>
                <span className="sm:hidden">Download</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
