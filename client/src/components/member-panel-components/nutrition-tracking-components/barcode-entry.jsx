import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Barcode scanner is now integrated as a modal in nutrition-tracker.jsx
// This component redirects to the nutrition page for backwards compatibility
function BarcodeScanner() {
  const navigate = useNavigate()
  useEffect(() => { navigate("/member-view/nutrition", { replace: true }) }, [navigate])
  return (
    <div className="flex items-center justify-center h-full bg-surface-base text-content-muted text-sm">
      Redirecting to Nutrition Tracker...
    </div>
  )
}

export default BarcodeScanner
