/* eslint-disable react/no-unknown-property */

import { useState } from "react"

function BarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState("Item not found. Try manual entry or scan again.")

  const handleScanBarcode = () => {
    setIsScanning(true)
    setScanStatus("Scanning...")
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false)
      setScanStatus("Item not found. Try manual entry or scan again.")
    }, 2000)
  }

  const handleManualEntry = () => {
    console.log("Manual entry clicked")
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white flex flex-col items-center justify-center p-6">
      <div className="mb-8">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-indigo-500"
        >
          {/* Top Left Corner */}
          <path d="M4 16V8C4 5.79086 5.79086 4 8 4H16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Top Right Corner */}
          <path d="M60 16V8C60 5.79086 58.2091 4 56 4H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Bottom Left Corner */}
          <path d="M4 48V56C4 58.2091 5.79086 60 8 60H16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Bottom Right Corner */}
          <path
            d="M60 48V56C60 58.2091 58.2091 60 56 60H48"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="text-white text-center mb-8 text-base">Align the barcode within the frame to scan</p>

      <div className="relative mb-4">
        <div
          className={`w-[280px] h-[160px] sm:w-[320px] sm:h-[180px] border-2 border-dashed rounded-lg transition-colors ${
            isScanning ? "border-indigo-500" : "border-gray-600"
          }`}
        >
          {isScanning && (
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <div className="h-0.5 w-full bg-indigo-500 animate-scan"></div>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-center mb-12 text-sm max-w-xs">{scanStatus}</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
        <button
          onClick={handleScanBarcode}
          disabled={isScanning}
          className="flex items-center text-sm justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="2" height="12" fill="currentColor" />
            <rect x="6" y="6" width="1" height="12" fill="currentColor" />
            <rect x="9" y="6" width="2" height="12" fill="currentColor" />
            <rect x="13" y="6" width="1" height="12" fill="currentColor" />
            <rect x="16" y="6" width="3" height="12" fill="currentColor" />
            <rect x="21" y="6" width="1" height="12" fill="currentColor" />
          </svg>
          Scan Barcode
        </button>

        <button
          onClick={handleManualEntry}
          className="flex items-center text-sm justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 9H17M7 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Manual Entry
        </button>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(160px);
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default BarcodeScanner