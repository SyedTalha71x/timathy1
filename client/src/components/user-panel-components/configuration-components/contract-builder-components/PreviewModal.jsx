/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import html2pdf from "html2pdf"

const PreviewModal = ({ pages, logo, onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const previewRef = useRef()

  const renderElementPreview = (element, isFromPDF) => {
    if (isFromPDF) return null

    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: element.type === "divider" ? "2px" : `${element.height}px`,
      position: "absolute",
      boxSizing: "border-box",
      overflow: "hidden",
    }

    switch (element.type) {
      case "heading":
        return (
          <h3
            key={element.id}
            style={{
              ...style,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.bold ? "bold" : "normal",
              textAlign: element.alignment,
              margin: 0,
              color: "#000",
              padding: "8px",
            }}
          >
            {element.content}
          </h3>
        )
      case "paragraph":
        return (
          <p
            key={element.id}
            style={{
              ...style,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.bold ? "bold" : "normal",
              textAlign: element.alignment,
              margin: 0,
              color: "#000",
              padding: "8px",
            }}
          >
            {element.content}
          </p>
        )
      case "text":
      case "textarea":
        return (
          <div key={element.id} style={style}>
            <label
              style={{ display: "block", fontSize: "12px", fontWeight: "500", marginBottom: "4px", color: "#000" }}
            >
              {element.label} {element.required && "*"}
            </label>
            {element.type === "text" ? (
              <input
                type="text"
                placeholder={element.placeholder}
                style={{
                  width: "100%",
                  border: "1px solid #000",
                  borderRadius: "2px",
                  padding: "4px 6px",
                  fontSize: "11px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                }}
                disabled
              />
            ) : (
              <textarea
                placeholder={element.placeholder}
                style={{
                  width: "100%",
                  border: "1px solid #000",
                  borderRadius: "2px",
                  padding: "4px 6px",
                  fontSize: "11px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  resize: "none",
                }}
                rows={2}
                disabled
              />
            )}
          </div>
        )
      case "checkbox":
        return (
          <div key={element.id} style={{ ...style, display: "flex", alignItems: "center", gap: "6px", padding: "4px" }}>
            <input type="checkbox" disabled style={{ width: "16px", height: "16px" }} />
            <span style={{ fontSize: "11px", color: "#000" }}>
              {element.label} {element.required && "*"}
            </span>
          </div>
        )
      case "signature":
        return (
          <div key={element.id} style={style}>
            <label
              style={{ display: "block", fontSize: "11px", fontWeight: "500", marginBottom: "2px", color: "#000" }}
            >
              {element.label} {element.required && "*"}
            </label>
            <div
              style={{
                border: "1px solid #000",
                borderRadius: "2px",
                height: "100%",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: "11px",
                backgroundColor: "white",
              }}
            >
              Signature
            </div>
          </div>
        )
      case "divider":
        return <hr key={element.id} style={{ ...style, border: "none", borderTop: "1px solid #000", margin: 0 }} />
      default:
        return null
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const element = previewRef.current
    const options = {
      margin: 10,
      filename: "contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }
    html2pdf().set(options).from(element).save()
  }

  const page = pages[currentPageIndex]

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
          width: "100%",
          maxWidth: "900px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Contract Preview</h2>
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
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            ref={previewRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              margin: "0 auto",
              position: "relative",
              padding: "20px",
              boxSizing: "border-box",
              pageBreakAfter: "always",
            }}
          >
            {logo && (
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "100px",
                  height: "60px",
                  backgroundColor: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid #d1d5db",
                }}
              >
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
            )}
            {page.isFromPDF ? (
              <iframe
                srcDoc={page.pdfContent}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "500px",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
            ) : (
              page.elements.map((el) => renderElementPreview(el, false))
            )}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              style={{
                backgroundColor: currentPageIndex === 0 ? "#e5e7eb" : "#3b82f6",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: currentPageIndex === 0 ? "not-allowed" : "pointer",
                fontSize: "12px",
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Page {currentPageIndex + 1} of {pages.length}
            </span>
            <button
              onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
              disabled={currentPageIndex === pages.length - 1}
              style={{
                backgroundColor: currentPageIndex === pages.length - 1 ? "#e5e7eb" : "#3b82f6",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: currentPageIndex === pages.length - 1 ? "not-allowed" : "pointer",
                fontSize: "12px",
              }}
            >
              Next
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
