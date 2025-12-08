/* eslint-disable react/prop-types */
import { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const PDFUploadModal = ({ onUpload, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pageCount = pdf.numPages

      const htmlPages = []
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i)
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        const viewport = page.getViewport({ scale: 2 })
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        const imageData = canvas.toDataURL("image/png")
        htmlPages.push(`<img src="${imageData}" style="width: 100%; height: auto; display: block;" />`)
      }

      onUpload(htmlPages)
      onClose()
    } catch (err) {
      setError("Error processing PDF: " + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "32px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Upload PDF</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#999",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            border: "2px dashed #3b82f6",
            borderRadius: "8px",
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: "#eff6ff",
            marginBottom: "20px",
          }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isProcessing}
            style={{
              display: "none",
            }}
            id="pdf-input"
          />
          <label
            htmlFor="pdf-input"
            style={{
              display: "block",
              cursor: isProcessing ? "not-allowed" : "pointer",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
            <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 8px 0", color: "#1f2937" }}>
              Click to upload or drag and drop
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Only PDF files are allowed</p>
          </label>
        </div>

        {isProcessing && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#3b82f6",
              fontSize: "14px",
            }}
          >
            Processing PDF... Please wait
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: "#e5e7eb",
              color: "#1f2937",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PDFUploadModal
