/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react"
import { pdfjs } from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.min.js"

pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.min.js"

function SignaturePad({ value, onChange, width = 500, height = 160 }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#111"
    if (value) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = value
    }
  }, [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    return { x, y }
  }

  const start = (e) => {
    drawing.current = true
    last.current = getPos(e)
  }

  const move = (e) => {
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext("2d")
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    last.current = pos
  }

  const end = () => {
    drawing.current = false
    const data = canvasRef.current.toDataURL("image/png")
    onChange && onChange(data)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange && onChange("")
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #dcdcdc", borderRadius: 8, background: "#fff", touchAction: "none" }}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button type="button" onClick={clear} style={buttonSmStyle}>
        Clear
      </button>
    </div>
  )
}

const colors = {
  bg: "#0f0f10",
  panel: "#17181a",
  border: "#2a2b2e",
  text: "#e6e7ea",
  subtext: "#afb2b8",
  accent: "#2d7ef7",
}

const pageStyle = {
  width: "794px", // A4 @ 96dpi approx
  minHeight: "1123px",
  margin: "0 auto",
  background: "#fff",
  color: "#111",
  padding: "32px 40px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  borderRadius: 8,
}

const labelStyle = { display: "block", fontSize: 12, color: "#374151", marginBottom: 4 }
const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "10px 12px",
  background: "#fff",
  color: "#111",
}
const checkboxRow = { display: "flex", alignItems: "center", gap: 8 }
const toolbarBtn = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
}
const buttonStyle = {
  border: `1px solid ${colors.border}`,
  background: colors.panel,
  color: colors.text,
  padding: "10px 12px",
  borderRadius: 8,
  cursor: "pointer",
}
const buttonSmStyle = { ...buttonStyle, padding: "6px 8px", fontSize: 12 }
const selectStyle = { ...inputStyle, background: "#fff", color: "#111" }

function RichText({ value, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && value !== undefined && value !== null) {
      ref.current.innerHTML = value
    }
  }, [value])

  const exec = (cmd, arg) => {
    document.execCommand(cmd, false, arg)
    onChange && onChange(ref.current.innerHTML)
  }

  const onInput = () => {
    onChange && onChange(ref.current.innerHTML)
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={toolbarBtn} onClick={() => exec("bold")}>
          Bold
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("italic")}>
          Italic
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("underline")}>
          Underline
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("fontSize", 3)}>
          A-
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("fontSize", 5)}>
          A+
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("justifyLeft")}>
          Left
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("justifyCenter")}>
          Center
        </button>
        <button type="button" style={toolbarBtn} onClick={() => exec("justifyRight")}>
          Right
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={onInput}
        suppressContentEditableWarning
        style={{
          border: "1px solid #d1d5db",
          minHeight: 120,
          borderRadius: 8,
          padding: 12,
          background: "#fff",
          color: "#111",
        }}
      />
    </div>
  )
}

function PdfPreview({ files, startPageNumber }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const render = async () => {
      const container = containerRef.current
      if (!container) return
      container.innerHTML = ""

      let pageCounter = startPageNumber || 1

      for (const f of files) {
        const data = await f.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data }).promise
        const total = pdf.numPages
        for (let i = 1; i <= total; i++) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1.2 })
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          canvas.width = viewport.width
          canvas.height = viewport.height
          const wrapper = document.createElement("div")
          wrapper.style.margin = "24px 0"
          wrapper.style.display = "grid"
          wrapper.style.justifyItems = "center"
          const label = document.createElement("div")
          label.style.margin = "6px 0 0"
          label.style.fontSize = "12px"
          label.style.color = "#6b7280"
          label.textContent = `Page ${pageCounter}`
          container.appendChild(wrapper)
          wrapper.appendChild(canvas)
          wrapper.appendChild(label)
          await page.render({ canvasContext: ctx, viewport }).promise
          pageCounter++
        }
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [files, startPageNumber])

  return <div ref={containerRef} />
}

export default function ContractSandbox() {
  const [pages, setPages] = useState([{ id: 1, title: "Contract - Page 1", elements: [] }])
  const [current, setCurrent] = useState(0)
  const [logoUrl, setLogoUrl] = useState("")
  const [logoPlacement, setLogoPlacement] = useState("right") // left, center, right
  const [pdfs, setPdfs] = useState([])
  const [showPreview, setShowPreview] = useState(false)

  const addPage = () => {
    setPages((p) => [...p, { id: Date.now(), title: `Contract - Page ${p.length + 1}`, elements: [] }])
    setCurrent(pages.length)
  }

  const removePage = (idx) => {
    if (pages.length === 1) return
    const next = pages.filter((_, i) => i !== idx)
    setPages(next)
    setCurrent(Math.max(0, idx - 1))
  }

  const addField = (type) => {
    const el = {
      id: Date.now(),
      type, // "text" | "checkbox" | "paragraph" | "signature"
      label: type === "checkbox" ? "I agree" : "Label",
      placeholder: type === "text" ? "Enter text" : "",
      required: false,
      value: "",
      html: type === "paragraph" ? "<p>Type paragraph text...</p>" : "",
      sigDataUrl: "",
    }
    const next = [...pages]
    next[current].elements.push(el)
    setPages(next)
  }

  const updateEl = (elId, patch) => {
    const next = pages.map((pg, i) =>
      i !== current ? pg : { ...pg, elements: pg.elements.map((e) => (e.id === elId ? { ...e, ...patch } : e)) },
    )
    setPages(next)
  }

  const removeEl = (elId) => {
    const next = pages.map((pg, i) =>
      i !== current ? pg : { ...pg, elements: pg.elements.filter((e) => e.id !== elId) },
    )
    setPages(next)
  }

  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setLogoUrl(url)
  }

  const onPdfUpload = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type === "application/pdf")
    setPdfs((prev) => [...prev, ...files])
  }

  const totalBuilderPages = pages.length

  const PagePreview = ({ pageIndex, page }) => {
    const align = logoPlacement === "left" ? "flex-start" : logoPlacement === "center" ? "center" : "flex-end"
    return (
      <div style={{ ...pageStyle, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: align, marginBottom: 24 }}>
          {logoUrl ? (
            <img
              src={logoUrl || "/placeholder.svg"}
              alt="Logo"
              style={{ width: 100, height: 60, objectFit: "contain" }}
            />
          ) : (
            <div style={{ width: 100, height: 60 }} />
          )}
        </div>

        <h2 style={{ fontSize: 20, margin: "0 0 16px" }}>{page.title}</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {page.elements.map((el) => {
            if (el.type === "text") {
              return (
                <div key={el.id}>
                  <label style={labelStyle}>{el.label}</label>
                  <input style={inputStyle} placeholder={el.placeholder} value={el.value || ""} readOnly />
                </div>
              )
            }
            if (el.type === "checkbox") {
              return (
                <label key={el.id} style={checkboxRow}>
                  <input type="checkbox" checked={!!el.value} readOnly />
                  <span>{el.label}</span>
                </label>
              )
            }
            if (el.type === "paragraph") {
              return (
                <div key={el.id}>
                  <div style={labelStyle}>{el.label || "Text"}</div>
                  <div
                    style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 8 }}
                    dangerouslySetInnerHTML={{ __html: el.html || "" }}
                  />
                </div>
              )
            }
            if (el.type === "signature") {
              return (
                <div key={el.id} style={{ display: "grid", gap: 8 }}>
                  <div style={labelStyle}>{el.label || "Signature"}</div>
                  {el.sigDataUrl ? (
                    <img
                      src={el.sigDataUrl || "/placeholder.svg"}
                      alt="Signature"
                      style={{ width: 500, height: 160, border: "1px solid #e5e7eb", borderRadius: 8 }}
                    />
                  ) : (
                    <div style={{ height: 160, border: "1px dashed #9ca3af", borderRadius: 8 }} />
                  )}
                </div>
              )
            }
            return null
          })}
        </div>
        <div style={{ marginTop: 24, fontSize: 12, color: "#6b7280" }}>Page {pageIndex + 1}</div>
      </div>
    )
  }

  const [previewReady, setPreviewReady] = useState(false)
  useEffect(() => {
    if (!showPreview) return
    // Small delay for DOM paint
    const t = setTimeout(() => setPreviewReady(true), 50)
    return () => {
      clearTimeout(t)
      setPreviewReady(false)
    }
  }, [showPreview])

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gap: 12,
          background: colors.panel,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ color: colors.text, fontWeight: 600 }}>Logo & Formatting</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input type="file" accept="image/*" onChange={onLogo} />
          <select value={logoPlacement} onChange={(e) => setLogoPlacement(e.target.value)} style={selectStyle}>
            <option value="left">Logo Left</option>
            <option value="center">Logo Center</option>
            <option value="right">Logo Right</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          background: colors.panel,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: colors.text, fontWeight: 600 }}>Pages</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={addPage} style={buttonSmStyle}>
              Add Page
            </button>
            <button
              type="button"
              onClick={() => removePage(current)}
              style={{ ...buttonSmStyle, opacity: pages.length === 1 ? 0.5 : 1 }}
            >
              Remove Page
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCurrent(i)}
              style={{
                ...buttonSmStyle,
                background: i === current ? colors.accent : colors.panel,
                borderColor: i === current ? colors.accent : colors.border,
              }}
            >
              {p.title || `Page ${i + 1}`}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <input
            style={{ ...inputStyle, background: "#111", color: colors.text, borderColor: colors.border }}
            value={pages[current]?.title || ""}
            onChange={(e) => {
              const next = [...pages]
              next[current].title = e.target.value
              setPages(next)
            }}
            placeholder="Page title"
          />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={buttonSmStyle} onClick={() => addField("text")}>
              + Text Field
            </button>
            <button type="button" style={buttonSmStyle} onClick={() => addField("checkbox")}>
              + Checkbox
            </button>
            <button type="button" style={buttonSmStyle} onClick={() => addField("paragraph")}>
              + Paragraph
            </button>
            <button type="button" style={buttonSmStyle} onClick={() => addField("signature")}>
              + Signature
            </button>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {pages[current]?.elements.map((el) => (
              <div key={el.id} style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ color: colors.text, fontWeight: 600 }}>{el.type.toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" style={buttonSmStyle} onClick={() => removeEl(el.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                {el.type !== "signature" && (
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    <label style={{ color: colors.subtext, fontSize: 12 }}>Label</label>
                    <input
                      style={{ ...inputStyle, background: "#111", color: colors.text, borderColor: colors.border }}
                      value={el.label}
                      onChange={(e) => updateEl(el.id, { label: e.target.value })}
                    />
                  </div>
                )}

                {el.type === "text" && (
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    <label style={{ color: colors.subtext, fontSize: 12 }}>Placeholder</label>
                    <input
                      style={{ ...inputStyle, background: "#111", color: colors.text, borderColor: colors.border }}
                      value={el.placeholder}
                      onChange={(e) => updateEl(el.id, { placeholder: e.target.value })}
                    />
                  </div>
                )}

                {el.type === "checkbox" && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, color: colors.text }}>
                    <input
                      type="checkbox"
                      checked={!!el.value}
                      onChange={(e) => updateEl(el.id, { value: e.target.checked })}
                    />
                    <span>Checked by default</span>
                  </div>
                )}

                {el.type === "paragraph" && (
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    <RichText value={el.html} onChange={(html) => updateEl(el.id, { html })} />
                  </div>
                )}

                {el.type === "signature" && (
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    <SignaturePad value={el.sigDataUrl} onChange={(sig) => updateEl(el.id, { sigDataUrl: sig })} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          background: colors.panel,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ color: colors.text, fontWeight: 600, marginBottom: 8 }}>Additional Documents (PDF)</div>
        <input type="file" accept="application/pdf" multiple onChange={onPdfUpload} />
        {!!pdfs.length && (
          <div style={{ color: colors.subtext, fontSize: 12 }}>
            {pdfs.length} PDF file{pdfs.length > 1 ? "s" : ""} attached. They will follow after your last contract page.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" style={buttonStyle} onClick={() => setShowPreview(true)}>
          Contract Preview
        </button>
      </div>

      {showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "grid",
            gridTemplateRows: "auto 1fr",
            zIndex: 60,
          }}
        >
          <div
            style={{
              background: colors.panel,
              borderBottom: `1px solid ${colors.border}`,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ color: colors.text, fontWeight: 600 }}>Contract Preview</div>
            <button type="button" style={buttonSmStyle} onClick={() => setShowPreview(false)}>
              Close
            </button>
          </div>
          <div style={{ overflow: "auto", padding: 24 }}>
            {/* Builder Pages */}
            {pages.map((p, i) => (
              <PagePreview key={p.id} pageIndex={i} page={p} />
            ))}

            {/* PDF Append */}
            {previewReady && pdfs.length > 0 && (
              <div style={{ width: 820, margin: "0 auto" }}>
                <PdfPreview files={pdfs} startPageNumber={totalBuilderPages + 1} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
