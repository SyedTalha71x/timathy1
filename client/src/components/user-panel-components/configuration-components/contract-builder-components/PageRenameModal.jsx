/* eslint-disable react/prop-types */

import { useState } from "react"

const PageRenameModal = ({ initialName, onSubmit, onClose }) => {
  const [name, setName] = useState(initialName)

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim())
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
          padding: "24px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 16px 0" }}>Rename Page</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
          autoFocus
          style={{
            width: "100%",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            padding: "10px 12px",
            fontSize: "14px",
            boxSizing: "border-box",
            marginBottom: "16px",
          }}
        />

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
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageRenameModal
