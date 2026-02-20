import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { barcodeScanner } from '../../../features/barcodeScanner/barCodeSlice';

function BarcodeScanner() {
  const dispatch = useDispatch();
  const { scanning, foodData, error } = useSelector((state) => state.barCode);

  const [isScanning, setIsScanning] = useState(true);
  const [scanStatus, setScanStatus] = useState("Align the barcode within the frame to scan");

  // Track last scanned barcode to prevent duplicates
  const lastScanned = useRef(null);

  const handleManualEntry = () => {
    console.log("Manual entry clicked");
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white flex flex-col items-center justify-center p-6">
      <div className="mb-8">
        {/* Your SVG icon */}
      </div>

      <p className="text-white text-center mb-8 text-base">{scanStatus}</p>

      <div className="relative mb-4 w-[280px] h-[160px] sm:w-[320px] sm:h-[180px] border-2 border-dashed rounded-lg transition-colors border-gray-600">
        {isScanning && (
          <BarcodeScannerComponent
            width={320}
            height={180}
            onUpdate={(err, result) => {
              if (result?.text) {
                const code = result.text.trim();
                if (code !== lastScanned.current) {
                  lastScanned.current = code;
                  setScanStatus(`Scanning: ${code}`);
                  dispatch(barcodeScanner(code)); // fetch data
                }
              } else if (err) {
                setScanStatus("Align the barcode within the frame to scan");
              }
            }}
          />
        )}
      </div>

      {/* Display food info */}
      {scanning && <p className="text-gray-400 text-center mb-2 text-sm">Loading...</p>}
      {foodData && (
        <div className="bg-[#2a2a2a] rounded-lg p-4 text-gray-200 w-full max-w-md mb-4">
          <h2 className="text-lg font-semibold mb-2">{foodData.name}</h2>
          <p>Serving: {foodData.serving} ({foodData.servingSize}g)</p>
          <p>Calories: {foodData.calories} kcal</p>
          <p>Protein: {foodData.protein} g</p>
          <p>Carbs: {foodData.carbs} g</p>
          <p>Fats: {foodData.fats} g</p>
          <p className="text-sm text-gray-400 mt-1">Barcode: {foodData.barcode}</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="flex items-center text-sm justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isScanning ? "Stop Scanner" : "Start Scanner"}
        </button>

        <button
          onClick={handleManualEntry}
          className="flex items-center text-sm justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Manual Entry
        </button>
      </div>
    </div>
  );
}

export default BarcodeScanner;