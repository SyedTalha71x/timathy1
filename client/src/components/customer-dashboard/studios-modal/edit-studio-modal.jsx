/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import { X, Plus, Trash2, Bold, Italic, Underline } from "lucide-react"
import { toast } from "react-hot-toast"

const TabButton = ({ id, label, activeTab, setActiveTab }) => (
  <button
    role="tab"
    aria-selected={activeTab === id}
    aria-controls={`panel-${id}`}
    onClick={() => setActiveTab(id)}
    className={[
      "px-3 py-2 rounded-lg text-sm whitespace-nowrap",
      activeTab === id ? "bg-[#303030] text-white" : "text-gray-300 hover:text-white hover:bg-[#242424]",
    ].join(" ")}
  >
    {label}
  </button>
)

const Section = ({ title, children }) => (
  <section className="bg-[#161616] rounded-xl p-4">
    <h3 className="text-white font-medium mb-4">{title}</h3>
    {children}
  </section>
)

const smallInput = "w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm placeholder:text-gray-400"
const smallNumber =
  "w-full bg-[#101010] rounded-xl px-3 py-2 text-white outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
const smallSelect = "w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
const smallButtonBase = "rounded-xl text-sm cursor-pointer px-3 py-2"
const smallBtnPrimary = smallButtonBase + " bg-[#FF843E] hover:bg-[#FF843E]/90 text-white"
const smallBtnMuted = smallButtonBase + " bg-gray-600 hover:bg-gray-700 text-white"
const iconBtn =
  "inline-flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] p-2 text-gray-300 hover:text-white"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const BILLING_PERIODS = ["monthly", "quarterly", "yearly"]

const EditStudioModal = ({
  isOpen,
  onClose,
  selectedStudio,
  editForm,
  setEditForm,
  handleInputChange,
  handleEditSubmit,
  DefaultStudioImage,
}) => {
  const [activeTab, setActiveTab] = useState("data")

  if (!isOpen || !selectedStudio) return null

  const handleOpeningHoursChange = (day, value) => {
    setEditForm((prev) => ({
      ...prev,
      openingHours: { ...(prev.openingHours || {}), [day]: value },
    }))
  }

  const setField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateArrayItem = (key, index, patch) => {
    setEditForm((prev) => {
      const list = [...(prev[key] || [])]
      list[index] = { ...(list[index] || {}), ...patch }
      return { ...prev, [key]: list }
    })
  }

  const addArrayItem = (key, item) => {
    setEditForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), item] }))
  }

  const removeArrayItem = (key, index) => {
    setEditForm((prev) => {
      const list = [...(prev[key] || [])]
      list.splice(index, 1)
      return { ...prev, [key]: list }
    })
  }

  const onLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setField("logoUrl", url)
    setField("logoFile", file)
    toast.success("Logo selected")
  }

  const applyFormatting = (textareaId, formatType, index) => {
    const el = document.getElementById(textareaId)
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const sel = el.value.substring(start, end)
    let wrapped = sel
    if (formatType === "bold") wrapped = `<strong>${sel}</strong>`
    if (formatType === "italic") wrapped = `<em>${sel}</em>`
    if (formatType === "underline") wrapped = `<u>${sel}</u>`
    const newContent = el.value.substring(0, start) + wrapped + el.value.substring(end)
    updateArrayItem("contractSections", index, { content: newContent })
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + wrapped.length, start + wrapped.length)
    }, 0)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleEditSubmit?.(e)
  }

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[9999] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Edit Studio"
    >
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl my-8 relative">
        <div className="md:p-6 p-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Studio</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-4 overflow-x-auto">
            <div role="tablist" className="flex gap-2 min-w-max">
              <TabButton id="data" label="Studio Data" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="resources" label="Resources" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="contracts" label="Contracts" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="communication" label="Communication" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="appearance" label="Appearance" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Tab Panels */}
            {/* Studio Data */}
            <div id="panel-data" role="tabpanel" hidden={activeTab !== "data"} className="space-y-4">
              <Section title="Studio Logo">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden">
                    <img
                      src={editForm.logoUrl || selectedStudio.image || DefaultStudioImage}
                      alt="Studio Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className={smallBtnPrimary}>
                      <input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
                      Update logo
                    </label>
                    {editForm.logoUrl ? (
                      <button type="button" onClick={() => setField("logoUrl", "")} className={smallBtnMuted}>
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </Section>

              <Section title="Studio Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Studio Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter studio name"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Studio Operator</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={editForm.ownerName || ""}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter studio operator name"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "")
                        setField("phone", onlyDigits)
                      }}
                      className={smallInput}
                      inputMode="numeric"
                      maxLength={15}
                      placeholder="Enter phone no"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter email"
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Street (with number)</label>
                    <input
                      type="text"
                      name="street"
                      value={editForm.street}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter street and number"
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={editForm.zipCode}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter ZIP code"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter city"
                      maxLength={40}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <select
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      className={smallSelect}
                    >
                      <option value="">Select Country</option>
                      <option value="DE">Germany (€)</option>
                      <option value="AT">Austria (€)</option>
                      <option value="CH">Switzerland (fr)</option>
                      <option value="NL">Netherlands (€)</option>
                      <option value="BE">Belgium (€)</option>
                      <option value="FR">France (€)</option>
                      <option value="IT">Italy (€)</option>
                      <option value="ES">Spain (€)</option>
                      <option value="GB">United Kingdom (£)</option>
                      <option value="US">United States ($)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-200 block mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={editForm.website}
                      onChange={handleInputChange}
                      className={smallInput}
                      placeholder="Enter studio website URL"
                      maxLength={50}
                    />
                  </div>
                </div>
              </Section>

              <Section title="Opening Hours">
                <div className="space-y-3">
                  {(editForm.openingHoursList || []).map((row, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="sm:col-span-2">
                        <select
                          className={smallSelect}
                          value={row.day || ""}
                          onChange={(e) => updateArrayItem("openingHoursList", idx, { day: e.target.value })}
                        >
                          <option value="">Select day</option>
                          {DAYS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="time"
                          className={smallInput}
                          value={row.startTime || ""}
                          onChange={(e) => updateArrayItem("openingHoursList", idx, { startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          className={smallInput}
                          value={row.endTime || ""}
                          onChange={(e) => updateArrayItem("openingHoursList", idx, { endTime: e.target.value })}
                        />
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          className={iconBtn + " w-full sm:w-auto"}
                          onClick={() => removeArrayItem("openingHoursList", idx)}
                          aria-label="Remove opening hour"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() => addArrayItem("openingHoursList", { day: "", startTime: "", endTime: "" })}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Opening Hour
                    </span>
                  </button>
                </div>

                {/* Keep legacy per-day text inputs (from original modal) so existing data continues to work */}
                <div className="border border-slate-700 rounded-xl p-4 mt-4">
                  <label className="text-sm text-gray-200 block mb-3 font-medium">Opening Hours (legacy per-day)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <div key={day} className="grid grid-cols-[80px,1fr] items-center gap-2">
                        <label className="text-xs text-gray-300 capitalize">{day}:</label>
                        <input
                          type="text"
                          value={editForm.openingHours?.[day] || ""}
                          onChange={(e) => handleOpeningHoursChange(day, e.target.value)}
                          className="bg-[#101010] rounded-lg px-3 py-2 text-white outline-none text-xs"
                          placeholder="9:00 - 22:00"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Closing Days">
                <div className="space-y-3">
                  {(editForm.closingDaysList || []).map((row, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="sm:col-span-2">
                        <input
                          type="date"
                          className={smallInput}
                          value={row.date || ""}
                          onChange={(e) => updateArrayItem("closingDaysList", idx, { date: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          className={smallInput}
                          placeholder="Description (e.g., Public Holiday)"
                          value={row.description || ""}
                          onChange={(e) => updateArrayItem("closingDaysList", idx, { description: e.target.value })}
                        />
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          className={iconBtn + " w-full sm:w-auto"}
                          onClick={() => removeArrayItem("closingDaysList", idx)}
                          aria-label="Remove closing day"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() => addArrayItem("closingDaysList", { date: "", description: "" })}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Closing Day
                    </span>
                  </button>
                </div>

                {/* Keep legacy single string for compatibility */}
                <div className="mt-4">
                  <label className="text-sm text-gray-200 block mb-2">Closing Days (legacy notes)</label>
                  <input
                    type="text"
                    name="closingDays"
                    value={editForm.closingDays || ""}
                    onChange={handleInputChange}
                    className={smallInput}
                    placeholder="e.g., Christmas Day, New Year's Day"
                  />
                </div>
              </Section>

              <Section title="Contract Dates">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Contract Start</label>
                    <input
                      type="date"
                      name="contractStart"
                      value={editForm.contractStart}
                      onChange={handleInputChange}
                      className={smallInput}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Contract End</label>
                    <input
                      type="date"
                      name="contractEnd"
                      value={editForm.contractEnd}
                      onChange={handleInputChange}
                      className={smallInput}
                    />
                  </div>
                </div>
              </Section>

              <Section title="About Studio">
                <label className="text-sm text-gray-200 block mb-2">Studio Description</label>
                <textarea
                  name="about"
                  value={editForm.about}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[120px]"
                  placeholder="Describe your studio, services, specialties, equipment, atmosphere, etc..."
                />
                <p className="text-xs text-gray-400 mt-2">
                  This will be shown on the studio profile and helps members understand what makes your studio unique.
                </p>
              </Section>

              <Section title="Special Note">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-200 font-medium">Mark as Important</label>
                    <input
                      type="checkbox"
                      checked={editForm.noteImportance === "important"}
                      onChange={(e) => setField("noteImportance", e.target.checked ? "important" : "unimportant")}
                      className="h-4 w-4 accent-[#FF843E]"
                    />
                  </div>

                  <textarea
                    name="note"
                    value={editForm.note}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                    placeholder="Enter internal note for this studio..."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Note Valid From</label>
                      <input
                        type="date"
                        name="noteStartDate"
                        value={editForm.noteStartDate}
                        onChange={handleInputChange}
                        className={smallInput}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Note Valid Until</label>
                      <input
                        type="date"
                        name="noteEndDate"
                        value={editForm.noteEndDate}
                        onChange={handleInputChange}
                        className={smallInput}
                      />
                    </div>
                  </div>

                  <div className="bg-[#101010] rounded-lg p-3">
                    <p className="text-xs text-gray-400">
                      <strong>Note:</strong> Important notes display prominently for internal management. If no dates
                      are specified, the note will be considered always valid.
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            {/* Resources */}
            <div id="panel-resources" role="tabpanel" hidden={activeTab !== "resources"} className="space-y-4">
              <Section title="Capacity Settings">
                <div className="grid grid-cols-1 sm:grid-cols-[240px,1fr] gap-3 items-center">
                  <label className="text-sm text-gray-200">Default Maximum Capacity</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.maxCapacity ?? 10}
                    onChange={(e) => setField("maxCapacity", Number(e.target.value || 0))}
                    className={smallNumber}
                  />
                </div>
              </Section>

              <Section title="Appointment Types">
                <div className="space-y-4">
                  {(editForm.appointmentTypes || []).map((type, index) => (
                    <div key={index} className="flex flex-col gap-4 p-4 border border-[#303030] rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                          placeholder="Appointment Type Name"
                          value={type.name || ""}
                          onChange={(e) => updateArrayItem("appointmentTypes", index, { name: e.target.value })}
                          className={smallInput}
                        />
                        <input
                          type="number"
                          placeholder="Duration (min)"
                          value={type.duration ?? 30}
                          onChange={(e) =>
                            updateArrayItem("appointmentTypes", index, { duration: Number(e.target.value || 0) })
                          }
                          className={smallNumber}
                        />
                        <input
                          type="number"
                          placeholder="Capacity"
                          value={type.capacity ?? 1}
                          onChange={(e) =>
                            updateArrayItem("appointmentTypes", index, { capacity: Number(e.target.value || 0) })
                          }
                          className={smallNumber}
                        />
                        <input
                          type="color"
                          aria-label="Color"
                          value={type.color || "#1890ff"}
                          onChange={(e) => updateArrayItem("appointmentTypes", index, { color: e.target.value })}
                          className="w-full h-10 bg-[#101010] rounded-xl p-1"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Interval"
                            value={type.interval ?? 30}
                            onChange={(e) =>
                              updateArrayItem("appointmentTypes", index, { interval: Number(e.target.value || 0) })
                            }
                            className={smallNumber}
                          />
                          <button
                            type="button"
                            className={iconBtn + " flex-shrink-0"}
                            onClick={() => removeArrayItem("appointmentTypes", index)}
                            aria-label="Remove appointment type"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-200 block mb-2">Upload Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            updateArrayItem("appointmentTypes", index, { images: files })
                            toast.success(`${files.length} image(s) selected`)
                          }}
                          className="block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#303030] file:text-white hover:file:bg-[#3a3a3a]"
                        />
                        {Array.isArray(type.images) && type.images.length > 0 ? (
                          <p className="text-xs text-gray-400 mt-2">{type.images.length} image(s) selected</p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() =>
                      addArrayItem("appointmentTypes", {
                        name: "",
                        duration: 30,
                        capacity: 1,
                        color: "#1890ff",
                        interval: 30,
                        images: [],
                      })
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Appointment Type
                    </span>
                  </button>
                </div>
              </Section>

              <Section title="Trial Training Settings">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      className={smallNumber}
                      value={editForm.trialTraining?.duration ?? 60}
                      onChange={(e) =>
                        setField("trialTraining", {
                          ...(editForm.trialTraining || {}),
                          duration: Number(e.target.value || 0),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Capacity</label>
                    <input
                      type="number"
                      className={smallNumber}
                      value={editForm.trialTraining?.capacity ?? 1}
                      onChange={(e) =>
                        setField("trialTraining", {
                          ...(editForm.trialTraining || {}),
                          capacity: Number(e.target.value || 0),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Color</label>
                    <input
                      type="color"
                      className="w-full h-10 bg-[#101010] rounded-xl p-1"
                      value={editForm.trialTraining?.color || "#1890ff"}
                      onChange={(e) =>
                        setField("trialTraining", { ...(editForm.trialTraining || {}), color: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Section>
            </div>

            {/* Contracts */}
            <div id="panel-contracts" role="tabpanel" hidden={activeTab !== "contracts"} className="space-y-4">
              <Section title="Contract Types">
                <div className="space-y-3">
                  {(editForm.contractTypes || []).map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-6 gap-2 items-start border border-[#303030] p-3 rounded-lg"
                    >
                      <input
                        className={smallInput}
                        placeholder="Name"
                        value={row.name || ""}
                        onChange={(e) => updateArrayItem("contractTypes", idx, { name: e.target.value })}
                      />
                      <input
                        type="number"
                        className={smallNumber}
                        placeholder="Duration (months)"
                        value={row.duration ?? 12}
                        onChange={(e) =>
                          updateArrayItem("contractTypes", idx, { duration: Number(e.target.value || 0) })
                        }
                      />
                      <input
                        type="number"
                        className={smallNumber}
                        placeholder="Cost"
                        value={row.cost ?? 0}
                        onChange={(e) => updateArrayItem("contractTypes", idx, { cost: Number(e.target.value || 0) })}
                      />
                      <select
                        className={smallSelect}
                        value={row.billingPeriod || "monthly"}
                        onChange={(e) => updateArrayItem("contractTypes", idx, { billingPeriod: e.target.value })}
                      >
                        {BILLING_PERIODS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className={smallNumber}
                        placeholder="User Capacity"
                        value={row.userCapacity ?? 0}
                        onChange={(e) =>
                          updateArrayItem("contractTypes", idx, { userCapacity: Number(e.target.value || 0) })
                        }
                      />
                      <div className="flex items-center gap-2">
                        <input
                          id={`auto-${idx}`}
                          type="checkbox"
                          checked={!!row.autoRenewal}
                          onChange={(e) => updateArrayItem("contractTypes", idx, { autoRenewal: e.target.checked })}
                          className="h-4 w-4 accent-[#FF843E]"
                        />
                        <label htmlFor={`auto-${idx}`} className="text-xs text-gray-300">
                          Auto renew
                        </label>
                      </div>

                      <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="number"
                          className={smallNumber}
                          placeholder="Renewal Period (months)"
                          value={row.renewalPeriod ?? 1}
                          onChange={(e) =>
                            updateArrayItem("contractTypes", idx, { renewalPeriod: Number(e.target.value || 0) })
                          }
                        />
                        <input
                          type="number"
                          className={smallNumber}
                          placeholder="Renewal Price"
                          value={row.renewalPrice ?? 0}
                          onChange={(e) =>
                            updateArrayItem("contractTypes", idx, { renewalPrice: Number(e.target.value || 0) })
                          }
                        />
                        <input
                          type="number"
                          className={smallNumber}
                          placeholder="Cancellation Period (days)"
                          value={row.cancellationPeriod ?? 30}
                          onChange={(e) =>
                            updateArrayItem("contractTypes", idx, { cancellationPeriod: Number(e.target.value || 0) })
                          }
                        />
                      </div>

                      <div className="md:col-span-6">
                        <button
                          type="button"
                          className={iconBtn}
                          onClick={() => removeArrayItem("contractTypes", idx)}
                          aria-label="Remove contract type"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() =>
                      addArrayItem("contractTypes", {
                        name: "",
                        duration: 12,
                        cost: 0,
                        billingPeriod: "monthly",
                        userCapacity: 0,
                        autoRenewal: false,
                        renewalPeriod: 1,
                        renewalPrice: 0,
                        cancellationPeriod: 30,
                      })
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Contract Type
                    </span>
                  </button>
                </div>
              </Section>

              <Section title="Contract Sections">
                <div className="space-y-3">
                  {(editForm.contractSections || []).map((sec, idx) => (
                    <div key={idx} className="space-y-2 border border-[#303030] p-3 rounded-lg">
                      <input
                        className={smallInput}
                        placeholder="Section Title"
                        value={sec.title || ""}
                        onChange={(e) => updateArrayItem("contractSections", idx, { title: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={iconBtn}
                          onClick={() => applyFormatting(`contract-content-${idx}`, "bold", idx)}
                          aria-label="Bold"
                        >
                          <Bold size={16} />
                        </button>
                        <button
                          type="button"
                          className={iconBtn}
                          onClick={() => applyFormatting(`contract-content-${idx}`, "italic", idx)}
                          aria-label="Italic"
                        >
                          <Italic size={16} />
                        </button>
                        <button
                          type="button"
                          className={iconBtn}
                          onClick={() => applyFormatting(`contract-content-${idx}`, "underline", idx)}
                          aria-label="Underline"
                        >
                          <Underline size={16} />
                        </button>
                      </div>
                      <textarea
                        id={`contract-content-${idx}`}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[120px]"
                        placeholder="Section content (HTML supported)"
                        value={sec.content || ""}
                        onChange={(e) => updateArrayItem("contractSections", idx, { content: e.target.value })}
                      />
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            checked={!!sec.editable}
                            onChange={(e) => updateArrayItem("contractSections", idx, { editable: e.target.checked })}
                            className="h-4 w-4 accent-[#FF843E]"
                          />
                          Editable by member
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            checked={sec.requiresAgreement !== false}
                            onChange={(e) =>
                              updateArrayItem("contractSections", idx, { requiresAgreement: e.target.checked })
                            }
                            className="h-4 w-4 accent-[#FF843E]"
                          />
                          Requires agreement
                        </label>
                        <button
                          type="button"
                          className={iconBtn + " ml-auto"}
                          onClick={() => removeArrayItem("contractSections", idx)}
                          aria-label="Remove contract section"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() =>
                      addArrayItem("contractSections", {
                        title: "",
                        content: "",
                        editable: true,
                        requiresAgreement: true,
                      })
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Contract Section
                    </span>
                  </button>
                </div>
              </Section>

              <Section title="Pause Reasons">
                <div className="space-y-3">
                  {(editForm.contractPauseReasons || []).map((row, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr,180px,48px] gap-2 items-center">
                      <input
                        className={smallInput}
                        placeholder="Reason (e.g., Vacation)"
                        value={row.name || ""}
                        onChange={(e) => updateArrayItem("contractPauseReasons", idx, { name: e.target.value })}
                      />
                      <input
                        type="number"
                        className={smallNumber}
                        placeholder="Max Days"
                        value={row.maxDays ?? 30}
                        onChange={(e) =>
                          updateArrayItem("contractPauseReasons", idx, { maxDays: Number(e.target.value || 0) })
                        }
                      />
                      <button
                        type="button"
                        className={iconBtn}
                        onClick={() => removeArrayItem("contractPauseReasons", idx)}
                        aria-label="Remove pause reason"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() => addArrayItem("contractPauseReasons", { name: "", maxDays: 30 })}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Pause Reason
                    </span>
                  </button>
                </div>
              </Section>

              <Section title="Contract Settings">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Notice Period (days)</label>
                    <input
                      type="number"
                      className={smallNumber}
                      value={editForm.noticePeriod ?? 30}
                      onChange={(e) => setField("noticePeriod", Number(e.target.value || 0))}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Extension Period (months)</label>
                    <input
                      type="number"
                      className={smallNumber}
                      value={editForm.extensionPeriod ?? 12}
                      onChange={(e) => setField("extensionPeriod", Number(e.target.value || 0))}
                    />
                  </div>
                </div>
              </Section>
            </div>

            {/* Communication */}
            <div id="panel-communication" role="tabpanel" hidden={activeTab !== "communication"} className="space-y-4">
              <Section title="General Notifications">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#FF843E]"
                      checked={!!editForm.emailNotifications}
                      onChange={(e) => setField("emailNotifications", e.target.checked)}
                    />
                    Email Notifications
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#FF843E]"
                      checked={!!editForm.chatNotifications}
                      onChange={(e) => setField("chatNotifications", e.target.checked)}
                    />
                    Chat Notifications
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#FF843E]"
                      checked={!!editForm.studioChatNotifications}
                      onChange={(e) => setField("studioChatNotifications", e.target.checked)}
                    />
                    Studio Chat Notifications
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#FF843E]"
                      checked={!!editForm.memberChatNotifications}
                      onChange={(e) => setField("memberChatNotifications", e.target.checked)}
                    />
                    Member Chat Notifications
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-3 items-center mt-4">
                  <label className="text-sm text-gray-200">Auto-Archive Messages (days)</label>
                  <input
                    type="number"
                    className={smallNumber}
                    value={editForm.autoArchiveDuration ?? 30}
                    onChange={(e) => setField("autoArchiveDuration", Number(e.target.value || 0))}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-200 block mb-2">Email Signature</label>
                  <textarea
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                    value={editForm.emailSignature || "Best regards,\n{Studio_Name} Team"}
                    onChange={(e) => setField("emailSignature", e.target.value)}
                  />
                </div>
              </Section>

              <Section title="Appointment Notifications">
                <div className="space-y-4">
                  {(editForm.appointmentNotifications || []).map((n, idx) => (
                    <div key={idx} className="border border-[#303030] p-3 rounded-lg space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          className={smallInput}
                          placeholder="Type (e.g., booking)"
                          value={n.type || ""}
                          onChange={(e) => updateArrayItem("appointmentNotifications", idx, { type: e.target.value })}
                        />
                        <input
                          className={smallInput}
                          placeholder="Title"
                          value={n.title || ""}
                          onChange={(e) => updateArrayItem("appointmentNotifications", idx, { title: e.target.value })}
                        />
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#FF843E]"
                            checked={n.enabled !== false}
                            onChange={(e) =>
                              updateArrayItem("appointmentNotifications", idx, { enabled: e.target.checked })
                            }
                          />
                          Enabled
                        </label>
                      </div>
                      <textarea
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[80px]"
                        placeholder="Message with variables..."
                        value={n.message || ""}
                        onChange={(e) => updateArrayItem("appointmentNotifications", idx, { message: e.target.value })}
                      />
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#FF843E]"
                            checked={(n.sendVia || []).includes("email")}
                            onChange={(e) => {
                              const current = new Set(n.sendVia || [])
                              e.target.checked ? current.add("email") : current.delete("email")
                              updateArrayItem("appointmentNotifications", idx, { sendVia: Array.from(current) })
                            }}
                          />
                          Email
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#FF843E]"
                            checked={(n.sendVia || []).includes("platform")}
                            onChange={(e) => {
                              const current = new Set(n.sendVia || [])
                              e.target.checked ? current.add("platform") : current.delete("platform")
                              updateArrayItem("appointmentNotifications", idx, { sendVia: Array.from(current) })
                            }}
                          />
                          Platform
                        </label>

                        <button
                          type="button"
                          className={iconBtn + " ml-auto"}
                          onClick={() => removeArrayItem("appointmentNotifications", idx)}
                          aria-label="Remove notification"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() =>
                      addArrayItem("appointmentNotifications", {
                        type: "booking",
                        title: "Appointment Confirmation",
                        message: "Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}.",
                        sendVia: ["email", "platform"],
                        enabled: true,
                      })
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Notification
                    </span>
                  </button>
                </div>
              </Section>

              <Section title="Broadcast Messages">
                <div className="space-y-3">
                  {(editForm.broadcastMessages || []).map((m, idx) => (
                    <div key={idx} className="border border-[#303030] p-3 rounded-lg space-y-2">
                      <input
                        className={smallInput}
                        placeholder="Title"
                        value={m.title || ""}
                        onChange={(e) => updateArrayItem("broadcastMessages", idx, { title: e.target.value })}
                      />
                      <textarea
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[80px]"
                        placeholder="Message..."
                        value={m.message || ""}
                        onChange={(e) => updateArrayItem("broadcastMessages", idx, { message: e.target.value })}
                      />
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#FF843E]"
                            checked={(m.sendVia || []).includes("email")}
                            onChange={(e) => {
                              const current = new Set(m.sendVia || [])
                              e.target.checked ? current.add("email") : current.delete("email")
                              updateArrayItem("broadcastMessages", idx, { sendVia: Array.from(current) })
                            }}
                          />
                          Email
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#FF843E]"
                            checked={(m.sendVia || []).includes("platform")}
                            onChange={(e) => {
                              const current = new Set(m.sendVia || [])
                              e.target.checked ? current.add("platform") : current.delete("platform")
                              updateArrayItem("broadcastMessages", idx, { sendVia: Array.from(current) })
                            }}
                          />
                          Platform
                        </label>
                        <button
                          type="button"
                          className={iconBtn + " ml-auto"}
                          onClick={() => removeArrayItem("broadcastMessages", idx)}
                          aria-label="Remove broadcast"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={smallBtnMuted}
                    onClick={() =>
                      addArrayItem("broadcastMessages", { title: "", message: "", sendVia: ["email", "platform"] })
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} /> Add Broadcast
                    </span>
                  </button>
                </div>
              </Section>

              <Section title="Email Configuration">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className={smallInput}
                    placeholder="SMTP Server"
                    value={editForm.emailConfig?.smtpServer || ""}
                    onChange={(e) =>
                      setField("emailConfig", { ...(editForm.emailConfig || {}), smtpServer: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className={smallNumber}
                    placeholder="SMTP Port"
                    value={editForm.emailConfig?.smtpPort ?? 587}
                    onChange={(e) =>
                      setField("emailConfig", {
                        ...(editForm.emailConfig || {}),
                        smtpPort: Number(e.target.value || 0),
                      })
                    }
                  />
                  <input
                    className={smallInput}
                    placeholder="SMTP User"
                    value={editForm.emailConfig?.smtpUser || ""}
                    onChange={(e) =>
                      setField("emailConfig", { ...(editForm.emailConfig || {}), smtpUser: e.target.value })
                    }
                  />
                  <input
                    className={smallInput}
                    placeholder="SMTP Pass"
                    type="password"
                    value={editForm.emailConfig?.smtpPass || ""}
                    onChange={(e) =>
                      setField("emailConfig", { ...(editForm.emailConfig || {}), smtpPass: e.target.value })
                    }
                  />
                  <input
                    className={smallInput}
                    placeholder="Sender Name"
                    value={editForm.emailConfig?.senderName || ""}
                    onChange={(e) =>
                      setField("emailConfig", { ...(editForm.emailConfig || {}), senderName: e.target.value })
                    }
                  />
                  <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#FF843E]"
                      checked={!!editForm.emailConfig?.useSSL}
                      onChange={(e) =>
                        setField("emailConfig", { ...(editForm.emailConfig || {}), useSSL: e.target.checked })
                      }
                    />
                    Use SSL
                  </label>
                </div>
              </Section>
            </div>

            {/* Appearance */}
            <div id="panel-appearance" role="tabpanel" hidden={activeTab !== "appearance"} className="space-y-4">
              <Section title="Theme">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-200">Theme</label>
                    <select
                      className={smallSelect}
                      value={editForm.appearance?.theme || "dark"}
                      onChange={(e) =>
                        setField("appearance", { ...(editForm.appearance || {}), theme: e.target.value })
                      }
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Primary Color</label>
                    <input
                      type="color"
                      className="w-full h-10 bg-[#101010] rounded-xl p-1"
                      value={editForm.appearance?.primaryColor || "#FF843E"}
                      onChange={(e) =>
                        setField("appearance", { ...(editForm.appearance || {}), primaryColor: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Secondary Color</label>
                    <input
                      type="color"
                      className="w-full h-10 bg-[#101010] rounded-xl p-1"
                      value={editForm.appearance?.secondaryColor || "#1890ff"}
                      onChange={(e) =>
                        setField("appearance", { ...(editForm.appearance || {}), secondaryColor: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#FF843E]"
                      checked={!!editForm.appearance?.allowUserThemeToggle}
                      onChange={(e) =>
                        setField("appearance", {
                          ...(editForm.appearance || {}),
                          allowUserThemeToggle: e.target.checked,
                        })
                      }
                    />
                    Allow user theme toggle
                  </label>
                </div>
              </Section>
            </div>

            <div className="flex gap-3 pt-2 sticky bottom-0 bg-[#1C1C1C] py-2">
              <button type="button" onClick={onClose} className={"flex-1 " + smallBtnMuted}>
                Cancel
              </button>
              <button type="submit" className={"flex-1 " + smallBtnPrimary}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditStudioModal
