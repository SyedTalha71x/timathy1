export const exportToExcel = (data, filename) => {
    // Create workbook and worksheet
    const wb = {
      SheetNames: ["Sheet1"],
      Sheets: {},
    }
  
    // Convert data to worksheet format
    const ws = {}
    const headers = data[0]
    const rows = data.slice(1)
  
    // Add headers
    headers.forEach((header, colIndex) => {
      const cellAddress = String.fromCharCode(65 + colIndex) + "1"
      ws[cellAddress] = { v: header, t: "s" }
    })
  
    // Add data rows
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellAddress = String.fromCharCode(65 + colIndex) + (rowIndex + 2)
        ws[cellAddress] = { v: cell, t: typeof cell === "number" ? "n" : "s" }
      })
    })
  
    // Set worksheet range
    const range = `A1:${String.fromCharCode(65 + headers.length - 1)}${rows.length + 1}`
    ws["!ref"] = range
  
    wb.Sheets["Sheet1"] = ws
  
    // Create Excel file and download
    const wbout = writeExcel(wb)
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Simple Excel writer (basic implementation)
  const writeExcel = (wb) => {
    const worksheet = wb.Sheets[wb.SheetNames[0]]
    let csv = ""
  
    // Convert to CSV first, then we'll enhance this for Excel format
    const range = worksheet["!ref"]
    if (!range) return new Uint8Array()
  
    const [start, end] = range.split(":")
    const startCol = start.charCodeAt(0) - 65
    const startRow = Number.parseInt(start.slice(1))
    const endCol = end.charCodeAt(0) - 65
    const endRow = Number.parseInt(end.slice(1))
  
    for (let row = startRow; row <= endRow; row++) {
      const rowData = []
      for (let col = startCol; col <= endCol; col++) {
        const cellAddress = String.fromCharCode(65 + col) + row
        const cell = worksheet[cellAddress]
        rowData.push(cell ? cell.v : "")
      }
      csv += rowData.join(",") + "\n"
    }
  
    // For now, return as CSV bytes (in a real implementation, you'd use a library like xlsx)
    return new TextEncoder().encode(csv)
  }
  