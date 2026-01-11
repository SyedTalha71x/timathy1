import { useEffect } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

/* eslint-disable react/prop-types */
export const WysiwygEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link', 'image'
  ]

  // Add custom CSS for placeholder and responsive styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .wysiwyg-container .ql-editor.ql-blank::before {
        color: #ffffff !important;
        opacity: 0.7 !important;
        font-style: normal !important;
        left: 0 !important;
        right: 0 !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
        white-space: pre-wrap !important;
        word-break: break-word !important;
      }
      .wysiwyg-container .ql-editor {
        color: #ffffff !important;
        min-height: 120px;
        max-height: 300px;
        overflow-y: auto;
      }
      .wysiwyg-container .ql-toolbar {
        border-color: #303030 !important;
        background-color: #151515 !important;
        display: flex !important;
        flex-wrap: wrap !important;
      }
      .wysiwyg-container .ql-container {
        border-color: #303030 !important;
        background-color: #101010 !important;
        border-radius: 0 0 4px 4px;
      }
      .wysiwyg-container .ql-snow .ql-stroke {
        stroke: #ffffff !important;
      }
      .wysiwyg-container .ql-snow .ql-fill {
        fill: #ffffff !important;
      }
      .wysiwyg-container .ql-snow .ql-picker-label {
        color: #ffffff !important;
      }
      .wysiwyg-container .ql-snow .ql-picker-options {
        background-color: #252525 !important;
        border-color: #303030 !important;
      }
      .wysiwyg-container {
        width: 100%;
        margin-top: 0.5rem;
      }
      
      /* Responsive toolbar adjustments */
      @media (max-width: 640px) {
        .wysiwyg-container .ql-toolbar {
          padding: 4px !important;
        }
        .wysiwyg-container .ql-toolbar .ql-formats {
          margin-right: 4px !important;
          margin-bottom: 4px !important;
        }
        .wysiwyg-container .ql-toolbar button {
          padding: 3px 5px !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="wysiwyg-container">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        bounds=".wysiwyg-container"
      />
    </div>
  )
}