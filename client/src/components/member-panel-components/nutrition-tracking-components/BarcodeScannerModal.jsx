import { X, ScanBarcode } from "lucide-react"
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import { SettingsCard, mealIcons } from "./nutritionConstants"

const BarcodeScannerModal = ({
  show, onClose, barcodeActive, setBarcodeActive,
  barcodeLoading, barcodeFood, barcodeError,
  lastScanned, dispatch, barcodeScanAction,
  onAddFood,
}) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary flex items-center gap-2">
            <ScanBarcode className="w-4 h-4 text-primary" /> Barcode Scanner
          </h3>
          <button onClick={onClose}
            className="p-1 text-content-muted hover:text-content-primary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-dark border-2 border-dashed border-border">
            {barcodeActive ? (
              <BarcodeScannerComponent
                width="100%"
                height="100%"
                onUpdate={(err, result) => {
                  if (result?.text) {
                    const code = result.text.trim()
                    if (code !== lastScanned.current) {
                      lastScanned.current = code
                      dispatch(barcodeScanAction(code))
                    }
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-content-muted">Scanner paused</p>
              </div>
            )}
          </div>

          <p className="text-xs text-content-faint text-center">
            {barcodeLoading ? "Searching..." : lastScanned.current ? `Scanned: ${lastScanned.current}` : "Point camera at barcode"}
          </p>

          {barcodeFood && (
            <SettingsCard className="!p-4">
              <h4 className="text-sm font-semibold text-content-primary mb-2">{barcodeFood.name}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-content-secondary mb-3">
                {barcodeFood.serving && <p>Serving: {barcodeFood.serving}</p>}
                {barcodeFood.servingSize && <p>Size: {barcodeFood.servingSize}g</p>}
                <p>Calories: {barcodeFood.calories} kcal</p>
                <p>Protein: {barcodeFood.protein}g</p>
                <p>Carbs: {barcodeFood.carbs}g</p>
                <p>Fats: {barcodeFood.fats}g</p>
              </div>
              <div className="flex gap-2">
                {["breakfast", "lunch", "dinner", "snacks"].map((m) => {
                  const MealIcon = mealIcons[m]
                  return (
                    <button key={m} onClick={() => onAddFood(m, barcodeFood)}
                      className="flex-1 flex flex-col items-center gap-1 py-2.5 bg-surface-button hover:bg-primary hover:text-white rounded-xl text-xs text-content-primary transition-colors">
                      <MealIcon className="w-4 h-4" />
                      <span className="capitalize text-[10px]">{m}</span>
                    </button>
                  )
                })}
              </div>
            </SettingsCard>
          )}

          {barcodeError && (
            <p className="text-xs text-red-400 text-center">{barcodeError}</p>
          )}

          <button onClick={() => setBarcodeActive(!barcodeActive)}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
              barcodeActive
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-primary hover:bg-primary-hover text-white"
            }`}>
            {barcodeActive ? "Pause Scanner" : "Resume Scanner"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BarcodeScannerModal
