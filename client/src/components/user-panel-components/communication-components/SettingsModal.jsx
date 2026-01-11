/* eslint-disable react/prop-types */

import { useRef } from "react"
import { Settings, X, Info } from 'lucide-react'
import { WysiwygEditor } from "../configuration-components/WysiwygEditor"


const SettingsModal = ({
  showSettings,
  setShowSettings,
  settings,
  setSettings,
  settingsTab,
  setSettingsTab,
  appointmentNotificationTypes,
  setAppointmentNotificationTypes,
  handleSaveSettings,
}) => {
  const birthdayTextareaRef = useRef(null)
  const confirmationTextareaRef = useRef(null)
  const cancellationTextareaRef = useRef(null)
  const rescheduledTextareaRef = useRef(null)
  const reminderTextareaRef = useRef(null)

  // <CHANGE> Add state for sub-tabs in notifications
  const notificationSubTab = settings?.notificationSubTab || "email"

  const insertVariable = (variable, textareaRef, currentValue, setValue) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = currentValue.substring(0, start) + `{${variable}}` + currentValue.substring(end)
      setValue(newValue)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2)
      }, 0)
    }
  }

  if (!showSettings) return null

  const bool = (v, d = false) => (typeof v === "boolean" ? v : d)

  const getType = (key) => {
    const t = appointmentNotificationTypes?.[key] || {}
    return {
      enabled: bool(t.enabled, false),
      template: t.template || "",
      sendApp: bool(t.sendApp, false),
      sendEmail: bool(t.sendEmail, false),
      hoursBefore: typeof t.hoursBefore === "number" ? t.hoursBefore : 24,
    }
  }

  const conf = getType("confirmation")
  const canc = getType("cancellation")
  const resch = getType("rescheduled")
  const reminder = getType("reminder")

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Messenger Settings
            </h2>
            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="flex gap-1 mb-6 border-b border-gray-700">
            <button
              onClick={() => setSettingsTab("notifications")}
              className={`px-4 py-2 text-sm rounded-t-lg ${settingsTab === "notifications" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setSettingsTab("setup")}
              className={`px-4 py-2 text-sm rounded-t-lg ${settingsTab === "setup" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              Setup
            </button>
          </div>

          <div className="space-y-4">
            {settingsTab === "notifications" && (
              <>
                {/* <CHANGE> Sub-tabs for Email and App Notifications */}
                <div className="flex gap-1 mb-4 border-b border-gray-600">
                  <button
                    onClick={() => setSettings({ ...settings, notificationSubTab: "email" })}
                    className={`px-4 py-2 text-sm ${notificationSubTab === "email"
                        ? "bg-blue-500 text-white rounded-t"
                        : "text-gray-400 hover:text-white"
                      }`}
                  >
                    E-Mail Notification
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, notificationSubTab: "app" })}
                    className={`px-4 py-2 text-sm ${notificationSubTab === "app"
                        ? "bg-blue-500 text-white rounded-t"
                        : "text-gray-400 hover:text-white"
                      }`}
                  >
                    App Notification
                  </button>
                </div>

                {/* <CHANGE> E-Mail Notification Tab */}
                {notificationSubTab === "email" && (
                  <div>
                    {/* Central Activation Toggle for E-Mail */}
                    <div className="mb-6 p-4 bg-[#222222] rounded-lg">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={bool(settings?.emailNotificationEnabled, false)}
                          onChange={(e) =>
                            setSettings({ ...settings, emailNotificationEnabled: e.target.checked })
                          }
                          className="rounded border-gray-600 bg-transparent cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-200">Activate E-Mail Notifications</span>
                      </label>
                    </div>

                    {/* Email Notification Options */}
                    {bool(settings?.emailNotificationEnabled, false) && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-500">
                        {/* Birthday Message */}
                        <div>
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={bool(settings?.birthdayMessageEnabled, false)}
                              onChange={(e) =>
                                setSettings({ ...settings, birthdayMessageEnabled: e.target.checked })
                              }
                              className="rounded border-gray-600 bg-transparent"
                            />
                            <span className="text-sm text-gray-300">Send automatic Birthday Messages</span>
                          </label>
                          {bool(settings?.birthdayMessageEnabled, false) && (
                            <div className="ml-6">
                              <div className="flex gap-2 mb-2 flex-wrap">
                                <button
                                  onClick={() =>
                                    insertVariable(
                                      "Studio_Name",
                                      birthdayTextareaRef,
                                      settings.birthdayMessageTemplate || "",
                                      (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                    )
                                  }
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                >
                                  Studio Name
                                </button>
                                <button
                                  onClick={() =>
                                    insertVariable(
                                      "Member_First_Name",
                                      birthdayTextareaRef,
                                      settings.birthdayMessageTemplate || "",
                                      (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                    )
                                  }
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                >
                                  Member First Name
                                </button>
                                <button
                                  onClick={() =>
                                    insertVariable(
                                      "Member_Last_Name",
                                      birthdayTextareaRef,
                                      settings.birthdayMessageTemplate || "",
                                      (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                    )
                                  }
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                >
                                  Member Last Name
                                </button>
                              </div>
                              <textarea
                                ref={birthdayTextareaRef}
                                value={settings.birthdayMessageTemplate || ""}
                                onChange={(e) => setSettings({ ...settings, birthdayMessageTemplate: e.target.value })}
                                className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                placeholder="Happy Birthday, {Member_First_Name} {Member_Last_Name}! Best wishes from {Studio_Name}!"
                              />
                            </div>
                          )}
                        </div>

                        {/* Appointment Notifications */}
                        <div>
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={bool(settings?.appointmentNotificationEnabled, false)}
                              onChange={(e) =>
                                setSettings({ ...settings, appointmentNotificationEnabled: e.target.checked })
                              }
                              className="rounded border-gray-600 bg-transparent"
                            />
                            <span className="text-sm text-gray-300">Appointment Notifications</span>
                          </label>

                          {bool(settings?.appointmentNotificationEnabled, false) && (
                            <div className="ml-6 space-y-4">
                              {/* Confirmation */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={conf.enabled}
                                    onChange={(e) =>
                                      setAppointmentNotificationTypes((prev) => ({
                                        ...prev,
                                        confirmation: { ...(prev.confirmation || {}), enabled: e.target.checked },
                                      }))
                                    }
                                    className="rounded border-gray-600 bg-transparent"
                                  />
                                  <span className="text-sm font-medium">Appointment Confirmation</span>
                                </div>
                                {conf.enabled && (
                                  <div className="ml-6">
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Studio_Name",
                                            confirmationTextareaRef,
                                            appointmentNotificationTypes?.confirmation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                confirmation: { ...(prev.confirmation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Studio Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_First_Name",
                                            confirmationTextareaRef,
                                            appointmentNotificationTypes?.confirmation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                confirmation: { ...(prev.confirmation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member First Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_Last_Name",
                                            confirmationTextareaRef,
                                            appointmentNotificationTypes?.confirmation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                confirmation: { ...(prev.confirmation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member Last Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Appointment_Type",
                                            confirmationTextareaRef,
                                            appointmentNotificationTypes?.confirmation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                confirmation: { ...(prev.confirmation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Appointment Type
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Booked_Time",
                                            confirmationTextareaRef,
                                            appointmentNotificationTypes?.confirmation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                confirmation: { ...(prev.confirmation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Booked Time
                                      </button>
                                    </div>
                                    <textarea
                                      ref={confirmationTextareaRef}
                                      value={appointmentNotificationTypes?.confirmation?.template || ""}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          confirmation: { ...(prev.confirmation || {}), template: e.target.value },
                                        }))
                                      }
                                      className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                      placeholder="Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been booked for {Booked_Time}."
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Cancellation */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={canc.enabled}
                                    onChange={(e) =>
                                      setAppointmentNotificationTypes((prev) => ({
                                        ...prev,
                                        cancellation: { ...(prev.cancellation || {}), enabled: e.target.checked },
                                      }))
                                    }
                                    className="rounded border-gray-600 bg-transparent"
                                  />
                                  <span className="text-sm font-medium">Appointment Cancellation</span>
                                </div>
                                {canc.enabled && (
                                  <div className="ml-6">
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Studio_Name",
                                            cancellationTextareaRef,
                                            appointmentNotificationTypes?.cancellation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                cancellation: { ...(prev.cancellation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Studio Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_First_Name",
                                            cancellationTextareaRef,
                                            appointmentNotificationTypes?.cancellation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                cancellation: { ...(prev.cancellation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member First Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_Last_Name",
                                            cancellationTextareaRef,
                                            appointmentNotificationTypes?.cancellation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                cancellation: { ...(prev.cancellation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member Last Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Appointment_Type",
                                            cancellationTextareaRef,
                                            appointmentNotificationTypes?.cancellation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                cancellation: { ...(prev.cancellation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Appointment Type
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Booked_Time",
                                            cancellationTextareaRef,
                                            appointmentNotificationTypes?.cancellation?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                cancellation: { ...(prev.cancellation || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Booked Time
                                      </button>
                                    </div>
                                    <textarea
                                      ref={cancellationTextareaRef}
                                      value={appointmentNotificationTypes?.cancellation?.template || ""}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          cancellation: { ...(prev.cancellation || {}), template: e.target.value },
                                        }))
                                      }
                                      className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                      placeholder="Hello {Member_First_Name} {Member_Last_Name} , your {Appointment_Type} has been cancelled."
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Rescheduled */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={resch.enabled}
                                    onChange={(e) =>
                                      setAppointmentNotificationTypes((prev) => ({
                                        ...prev,
                                        rescheduled: { ...(prev.rescheduled || {}), enabled: e.target.checked },
                                      }))
                                    }
                                    className="rounded border-gray-600 bg-transparent"
                                  />
                                  <span className="text-sm font-medium">Appointment Rescheduled</span>
                                </div>
                                {resch.enabled && (
                                  <div className="ml-6">
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Studio_Name",
                                            rescheduledTextareaRef,
                                            appointmentNotificationTypes?.rescheduled?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                rescheduled: { ...(prev.rescheduled || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Studio Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_First_Name",
                                            rescheduledTextareaRef,
                                            appointmentNotificationTypes?.rescheduled?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                rescheduled: { ...(prev.rescheduled || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member First Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_Last_Name",
                                            rescheduledTextareaRef,
                                            appointmentNotificationTypes?.rescheduled?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                rescheduled: { ...(prev.rescheduled || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member Last Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Appointment_Type",
                                            rescheduledTextareaRef,
                                            appointmentNotificationTypes?.rescheduled?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                rescheduled: { ...(prev.rescheduled || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Appointment Type
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Booked_Time",
                                            rescheduledTextareaRef,
                                            appointmentNotificationTypes?.rescheduled?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                rescheduled: { ...(prev.rescheduled || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Booked Time
                                      </button>
                                    </div>
                                    <textarea
                                      ref={rescheduledTextareaRef}
                                      value={appointmentNotificationTypes?.rescheduled?.template || ""}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          rescheduled: { ...(prev.rescheduled || {}), template: e.target.value },
                                        }))
                                      }
                                      className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                      placeholder="Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}."
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="border-t border-gray-700 my-4" />

                              {/* Reminder */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={reminder.enabled}
                                    onChange={(e) =>
                                      setAppointmentNotificationTypes((prev) => ({
                                        ...prev,
                                        reminder: { ...(prev.reminder || {}), enabled: e.target.checked },
                                      }))
                                    }
                                    className="rounded border-gray-600 bg-transparent"
                                  />
                                  <span className="text-sm font-medium">Appointment Reminder</span>
                                </div>
                                {reminder.enabled && (
                                  <div className="ml-6">
                                    {/* Hours before */}
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                      <label className="text-sm text-gray-300">Send reminder</label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={reminder.hoursBefore}
                                        onChange={(e) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            reminder: {
                                              ...(prev.reminder || {}),
                                              hoursBefore: Number.parseInt(e.target.value || "1", 10),
                                            },
                                          }))
                                        }
                                        className="w-24 bg-[#222222] text-white rounded-lg px-3 py-1 text-sm"
                                      />
                                      <span className="text-sm text-gray-300">hours before</span>
                                    </div>

                                    {/* Variables */}
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Studio_Name",
                                            reminderTextareaRef,
                                            appointmentNotificationTypes?.reminder?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                reminder: { ...(prev.reminder || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Studio Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_First_Name",
                                            reminderTextareaRef,
                                            appointmentNotificationTypes?.reminder?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                reminder: { ...(prev.reminder || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member First Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Member_Last_Name",
                                            reminderTextareaRef,
                                            appointmentNotificationTypes?.reminder?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                reminder: { ...(prev.reminder || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Member Last Name
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Appointment_Type",
                                            reminderTextareaRef,
                                            appointmentNotificationTypes?.reminder?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                reminder: { ...(prev.reminder || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Appointment Type
                                      </button>
                                      <button
                                        onClick={() =>
                                          insertVariable(
                                            "Booked_Time",
                                            reminderTextareaRef,
                                            appointmentNotificationTypes?.reminder?.template || "",
                                            (value) =>
                                              setAppointmentNotificationTypes((prev) => ({
                                                ...prev,
                                                reminder: { ...(prev.reminder || {}), template: value },
                                              })),
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                      >
                                        Booked Time
                                      </button>
                                    </div>

                                    <textarea
                                      ref={reminderTextareaRef}
                                      value={appointmentNotificationTypes?.reminder?.template || ""}
                                      onChange={(e) =>
                                        setAppointmentNotificationTypes((prev) => ({
                                          ...prev,
                                          reminder: { ...(prev.reminder || {}), template: e.target.value },
                                        }))
                                      }
                                      className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                      placeholder="Hello {Member_First_Name} {Member_Last_Name}, this is a reminder for your {Appointment_Type} at {Booked_Time}."
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* <CHANGE> App Notification Tab */}
                {notificationSubTab === "app" && (
                  <div>
                    {/* Central Activation Toggle for App */}
                    <div className="mb-6 p-4 bg-[#222222] rounded-lg">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={bool(settings?.appNotificationEnabled, false)}
                          onChange={(e) =>
                            setSettings({ ...settings, appNotificationEnabled: e.target.checked })
                          }
                          className="rounded border-gray-600 bg-transparent cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-200">Activate App Notifications</span>
                      </label>
                    </div>

                    {/* App Notification Options */}
                    {bool(settings?.appNotificationEnabled, false) && (
                      <div className="space-y-4 pl-4 border-l-2 border-purple-500">
                        {/* Birthday Message */}
                        <div>
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={bool(settings?.birthdayAppNotificationEnabled, false)}
                              onChange={(e) =>
                                setSettings({ ...settings, birthdayAppNotificationEnabled: e.target.checked })
                              }
                              className="rounded border-gray-600 bg-transparent"
                            />
                            <span className="text-sm text-gray-300">Send automatic Birthday Messages</span>
                          </label>
                        </div>

                        {/* Appointment Notifications */}
                        <div>
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={bool(settings?.appointmentAppNotificationEnabled, false)}
                              onChange={(e) =>
                                setSettings({ ...settings, appointmentAppNotificationEnabled: e.target.checked })
                              }
                              className="rounded border-gray-600 bg-transparent"
                            />
                            <span className="text-sm text-gray-300">Appointment Notifications</span>
                          </label>

                          {bool(settings?.appointmentAppNotificationEnabled, false) && (
                            <div className="ml-6 space-y-3">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={bool(settings?.appConfirmationEnabled, false)}
                                  onChange={(e) =>
                                    setSettings({ ...settings, appConfirmationEnabled: e.target.checked })
                                  }
                                  className="rounded border-gray-600 bg-transparent"
                                />
                                <span className="text-sm">Appointment Confirmation</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={bool(settings?.appCancellationEnabled, false)}
                                  onChange={(e) =>
                                    setSettings({ ...settings, appCancellationEnabled: e.target.checked })
                                  }
                                  className="rounded border-gray-600 bg-transparent"
                                />
                                <span className="text-sm">Appointment Cancellation</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={bool(settings?.appRescheduledEnabled, false)}
                                  onChange={(e) =>
                                    setSettings({ ...settings, appRescheduledEnabled: e.target.checked })
                                  }
                                  className="rounded border-gray-600 bg-transparent"
                                />
                                <span className="text-sm">Appointment Rescheduled</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={bool(settings?.appReminderEnabled, false)}
                                  onChange={(e) =>
                                    setSettings({ ...settings, appReminderEnabled: e.target.checked })
                                  }
                                  className="rounded border-gray-600 bg-transparent"
                                />
                                <span className="text-sm">Appointment Reminder</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {settingsTab === "setup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <span className="inline-flex items-center gap-2">
                      Auto-Archive Duration (days)
                      <span
                        className="inline-flex items-center justify-center align-middle"
                        title="This only archives member chats automatically after the defined number of days. Chats are not lost and can be restored anytime."
                      >
                        <Info className="w-4 h-4 text-gray-400" />
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    value={settings.autoArchiveDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, autoArchiveDuration: Number.parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    min="1"
                    max="365"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Setup</label>
                  <input
                    type="text"
                    placeholder="SMTP Host"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm mb-2"
                  />
                  <input
                    type="number"
                    placeholder="SMTP Port"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) || 0 })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm mb-2"
                  />
                  <input
                    type="text"
                    placeholder="SMTP Username"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm mb-2"
                  />
                  <input
                    type="password"
                    placeholder="SMTP Password"
                    value={settings.smtpPass}
                    onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Email Signature</label>
                  <div className="bg-[#222222] rounded-xl">
                    <WysiwygEditor
                      value={settings.emailSignature}
                      onChange={(value) => setSettings({ ...settings, emailSignature: value })}
                      placeholder="Enter your default email signature..."
                    />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleSaveSettings}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal