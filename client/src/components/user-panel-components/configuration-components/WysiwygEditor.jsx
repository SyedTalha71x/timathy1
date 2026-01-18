/* eslint-disable react/prop-types */
import { useEffect } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

export const WysiwygEditor = ({ value, onChange, placeholder, minHeight = 120 }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link'
  ]

  // Add custom CSS for dark theme styling
  useEffect(() => {
    const styleId = 'wysiwyg-custom-styles'
    
    // Check if styles already exist
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* Container */
      .wysiwyg-dark-container {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #333333;
      }
      
      /* Toolbar */
      .wysiwyg-dark-container .ql-toolbar {
        border: none !important;
        border-bottom: 1px solid #333333 !important;
        background-color: #1F1F1F !important;
        padding: 8px !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 4px !important;
      }
      
      .wysiwyg-dark-container .ql-toolbar .ql-formats {
        margin-right: 8px !important;
      }
      
      /* Toolbar buttons */
      .wysiwyg-dark-container .ql-toolbar button {
        width: 28px !important;
        height: 28px !important;
        padding: 4px !important;
        border-radius: 6px !important;
      }
      
      .wysiwyg-dark-container .ql-toolbar button:hover {
        background-color: #333333 !important;
      }
      
      .wysiwyg-dark-container .ql-toolbar button.ql-active {
        background-color: #FF843E !important;
      }
      
      /* Toolbar icons */
      .wysiwyg-dark-container .ql-snow .ql-stroke {
        stroke: #9CA3AF !important;
      }
      
      .wysiwyg-dark-container .ql-snow .ql-fill {
        fill: #9CA3AF !important;
      }
      
      .wysiwyg-dark-container .ql-toolbar button:hover .ql-stroke,
      .wysiwyg-dark-container .ql-toolbar button.ql-active .ql-stroke {
        stroke: #ffffff !important;
      }
      
      .wysiwyg-dark-container .ql-toolbar button:hover .ql-fill,
      .wysiwyg-dark-container .ql-toolbar button.ql-active .ql-fill {
        fill: #ffffff !important;
      }
      
      /* Picker labels */
      .wysiwyg-dark-container .ql-snow .ql-picker-label {
        color: #9CA3AF !important;
        border: 1px solid #333333 !important;
        border-radius: 6px !important;
        padding: 2px 8px !important;
      }
      
      .wysiwyg-dark-container .ql-snow .ql-picker-label:hover {
        color: #ffffff !important;
        background-color: #333333 !important;
      }
      
      /* Picker options dropdown */
      .wysiwyg-dark-container .ql-snow .ql-picker-options {
        background-color: #1F1F1F !important;
        border: 1px solid #333333 !important;
        border-radius: 8px !important;
        padding: 4px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
      }
      
      .wysiwyg-dark-container .ql-snow .ql-picker-item {
        color: #9CA3AF !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
      }
      
      .wysiwyg-dark-container .ql-snow .ql-picker-item:hover {
        color: #ffffff !important;
        background-color: #333333 !important;
      }
      
      /* Editor container */
      .wysiwyg-dark-container .ql-container {
        border: none !important;
        background-color: #141414 !important;
        font-family: inherit !important;
      }
      
      /* Editor content */
      .wysiwyg-dark-container .ql-editor {
        color: #ffffff !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        padding: 16px !important;
        min-height: ${minHeight}px !important;
        max-height: 400px !important;
        overflow-y: auto !important;
      }
      
      /* Placeholder */
      .wysiwyg-dark-container .ql-editor.ql-blank::before {
        color: #6B7280 !important;
        font-style: normal !important;
        left: 16px !important;
        right: 16px !important;
      }
      
      /* Links */
      .wysiwyg-dark-container .ql-editor a {
        color: #FF843E !important;
      }
      
      /* Scrollbar */
      .wysiwyg-dark-container .ql-editor::-webkit-scrollbar {
        width: 8px;
      }
      
      .wysiwyg-dark-container .ql-editor::-webkit-scrollbar-track {
        background: #1F1F1F;
        border-radius: 4px;
      }
      
      .wysiwyg-dark-container .ql-editor::-webkit-scrollbar-thumb {
        background: #444444;
        border-radius: 4px;
      }
      
      .wysiwyg-dark-container .ql-editor::-webkit-scrollbar-thumb:hover {
        background: #555555;
      }
      
      /* Color picker dropdown */
      .wysiwyg-dark-container .ql-color-picker .ql-picker-options,
      .wysiwyg-dark-container .ql-background .ql-picker-options {
        padding: 8px !important;
        width: auto !important;
      }
      
      /* Tooltip (for link input) */
      .wysiwyg-dark-container .ql-tooltip {
        background-color: #1F1F1F !important;
        border: 1px solid #333333 !important;
        border-radius: 8px !important;
        color: #ffffff !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        padding: 8px 12px !important;
      }
      
      .wysiwyg-dark-container .ql-tooltip input[type=text] {
        background-color: #141414 !important;
        border: 1px solid #333333 !important;
        border-radius: 6px !important;
        color: #ffffff !important;
        padding: 6px 10px !important;
      }
      
      .wysiwyg-dark-container .ql-tooltip a.ql-action,
      .wysiwyg-dark-container .ql-tooltip a.ql-remove {
        color: #FF843E !important;
      }
      
      /* Focus state */
      .wysiwyg-dark-container:focus-within {
        border-color: #FF843E !important;
      }
      
      /* Responsive */
      @media (max-width: 640px) {
        .wysiwyg-dark-container .ql-toolbar {
          padding: 6px !important;
        }
        
        .wysiwyg-dark-container .ql-toolbar button {
          width: 24px !important;
          height: 24px !important;
        }
        
        .wysiwyg-dark-container .ql-toolbar .ql-formats {
          margin-right: 4px !important;
        }
        
        .wysiwyg-dark-container .ql-editor {
          padding: 12px !important;
          font-size: 14px !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      // Don't remove on unmount to avoid flicker when multiple editors exist
    }
  }, [minHeight])

  return (
    <div className="wysiwyg-dark-container">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
      />
    </div>
  )
}
