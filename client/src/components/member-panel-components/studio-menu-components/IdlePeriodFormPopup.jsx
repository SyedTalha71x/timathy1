/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import { haptic } from "../../../utils/haptic";
import CustomSelect from "../../../components/shared/CustomSelect";
import DatePickerField from "../../../components/shared/DatePickerField";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const IdlePeriodFormPopup = ({ show, onClose }) => {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  if (!show) return null;

  const formatDate = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-");
    return `${d}.${m}.${y}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndSetFile = (f) => {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError("Only PDF, JPG and PNG files are allowed");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError("File must be smaller than 10MB");
      return;
    }
    haptic.light();
    setFile(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) validateAndSetFile(f);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSetFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeFile = () => {
    haptic.light();
    setFile(null);
    setFileError(null);
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-surface-card rounded-xl max-w-md w-full max-h-[85dvh] sm:max-h-[80dvh] border border-border shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-content-primary">Apply for Idle Period</h3>
          <button onClick={() => { haptic.light(); onClose(); }} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-content-secondary block mb-2">Reason for idle period<span className="text-accent-red ml-1">*</span></label>
              <CustomSelect
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Select reason..."
                options={[
                  { value: "Vacation", label: "Vacation" },
                  { value: "Medical", label: "Medical" },
                  { value: "Business Travel", label: "Business Travel" },
                  { value: "Personal", label: "Personal" },
                ]}
              />
            </div>

            <div>
              <label className="text-sm text-content-secondary block mb-2">Start Date<span className="text-accent-red ml-1">*</span></label>
              <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                <span className={startDate ? "text-content-primary" : "text-content-faint"}>
                  {startDate ? formatDate(startDate) : "Select date"}
                </span>
                <DatePickerField
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-content-secondary block mb-2">Duration<span className="text-accent-red ml-1">*</span></label>
              <CustomSelect
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Select duration..."
                options={[
                  { value: "1 week", label: "1 week" },
                  { value: "2 weeks", label: "2 weeks" },
                  { value: "1 month", label: "1 month" },
                  { value: "2 months", label: "2 months" },
                  { value: "3 months", label: "3 months" },
                ]}
              />
            </div>

            <div>
              <label className="text-sm text-content-secondary block mb-2">Document</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />

              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-colors ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-content-faint"
                  }`}
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-content-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {/* Mobile: "Click to upload" — Desktop: "Click to upload or drag and drop" */}
                  <p className="text-content-muted text-xs sm:text-sm">
                    <span className="sm:hidden">Tap to upload</span>
                    <span className="hidden sm:inline">Click to upload or drag and drop</span>
                  </p>
                  <p className="text-content-faint text-[10px] sm:text-xs">PDF, JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-content-primary truncate">{file.name}</p>
                    <p className="text-xs text-content-faint">{formatFileSize(file.size)}</p>
                  </div>
                  <button onClick={removeFile} className="p-1 text-content-muted hover:text-content-primary transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {fileError && (
                <p className="text-xs text-red-400 mt-1.5">{fileError}</p>
              )}
            </div>

            <button onClick={() => { haptic.success(); }}
              className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 sm:py-3 px-4 rounded-xl transition-colors text-sm sm:text-base">
              Apply for Idle Period
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdlePeriodFormPopup;
