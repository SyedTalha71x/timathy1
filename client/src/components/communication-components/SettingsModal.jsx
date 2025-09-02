/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useRef } from 'react';
import { Settings, X, Mail, Send, Search } from 'lucide-react';

const SettingsModal = ({ 
  showSettings, 
  setShowSettings, 
  settings, 
  setSettings, 
  settingsTab, 
  setSettingsTab,
  appointmentNotificationTypes,
  setAppointmentNotificationTypes,
  handleSaveSettings 
}) => {
  const birthdayTextareaRef = useRef(null);
  const confirmationTextareaRef = useRef(null);
  const cancellationTextareaRef = useRef(null);
  const rescheduledTextareaRef = useRef(null);

  const insertVariable = (variable, textareaRef, currentValue, setValue) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentValue.substring(0, start) + `{${variable}}` + currentValue.substring(end);
      setValue(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
      }, 0);
    }
  };

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Communication Settings
            </h2>
            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="flex gap-1 mb-6 border-b border-gray-700">
            <button
              onClick={() => setSettingsTab("notifications")}
              className={`px-4 py-2 text-sm rounded-t-lg ${
                settingsTab === "notifications" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setSettingsTab("setup")}
              className={`px-4 py-2 text-sm rounded-t-lg ${
                settingsTab === "setup" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Setup
            </button>
          </div>

          <div className="space-y-4">
            {settingsTab === "notifications" && (
              <>
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-3">Client Notifications</h3>
                  <div className="space-y-2 pl-4 border-l-2 border-blue-500">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Email Notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.studioChatNotifications}
                        onChange={(e) => setSettings({ ...settings, studioChatNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Studio Chat Notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.memberChatNotifications}
                        onChange={(e) => setSettings({ ...settings, memberChatNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Member Chat Notifications</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-3">Member Notifications</h3>
                  <div className="space-y-4 pl-4 border-l-2 border-green-500">
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={settings.birthdayMessageEnabled}
                          onChange={(e) => setSettings({ ...settings, birthdayMessageEnabled: e.target.checked })}
                          className="rounded border-gray-600 bg-transparent"
                        />
                        <span className="text-sm text-gray-300">Birthday Messages</span>
                      </label>
                      {settings.birthdayMessageEnabled && (
                        <div className="ml-6">
                          <div className="flex gap-2 mb-2">
                            <button
                              onClick={() =>
                                insertVariable(
                                  "Studio_Name",
                                  birthdayTextareaRef,
                                  settings.birthdayMessageTemplate,
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
                                  "Member_Name",
                                  birthdayTextareaRef,
                                  settings.birthdayMessageTemplate,
                                  (value) => setSettings({ ...settings, birthdayMessageTemplate: value }),
                                )
                              }
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                            >
                              Member Name
                            </button>
                          </div>
                          <textarea
                            ref={birthdayTextareaRef}
                            value={settings.birthdayMessageTemplate}
                            onChange={(e) => setSettings({ ...settings, birthdayMessageTemplate: e.target.value })}
                            className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                            placeholder="Happy Birthday, {Member_Name}! Best wishes from {Studio_Name}!"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={settings.appointmentNotificationEnabled}
                          onChange={(e) =>
                            setSettings({ ...settings, appointmentNotificationEnabled: e.target.checked })
                          }
                          className="rounded border-gray-600 bg-transparent"
                        />
                        <span className="text-sm text-gray-300">Appointment Notifications</span>
                      </label>
                      {settings.appointmentNotificationEnabled && (
                        <div className="ml-6 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={appointmentNotificationTypes.confirmation.enabled}
                                onChange={(e) =>
                                  setAppointmentNotificationTypes((prev) => ({
                                    ...prev,
                                    confirmation: { ...prev.confirmation, enabled: e.target.checked },
                                  }))
                                }
                                className="rounded border-gray-600 bg-transparent"
                              />
                              <span className="text-sm font-medium">Appointment Confirmation</span>
                            </div>
                            {appointmentNotificationTypes.confirmation.enabled && (
                              <div className="ml-6">
                                <div className="flex gap-2 mb-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Studio_Name",
                                        confirmationTextareaRef,
                                        appointmentNotificationTypes.confirmation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            confirmation: { ...prev.confirmation, template: value },
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
                                        "Member_Name",
                                        confirmationTextareaRef,
                                        appointmentNotificationTypes.confirmation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            confirmation: { ...prev.confirmation, template: value },
                                          })),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Member Name
                                  </button>
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Appointment_Type",
                                        confirmationTextareaRef,
                                        appointmentNotificationTypes.confirmation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            confirmation: { ...prev.confirmation, template: value },
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
                                        appointmentNotificationTypes.confirmation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            confirmation: { ...prev.confirmation, template: value },
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
                                  value={appointmentNotificationTypes.confirmation.template}
                                  onChange={(e) =>
                                    setAppointmentNotificationTypes((prev) => ({
                                      ...prev,
                                      confirmation: { ...prev.confirmation, template: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                  placeholder="Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}."
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={appointmentNotificationTypes.cancellation.enabled}
                                onChange={(e) =>
                                  setAppointmentNotificationTypes((prev) => ({
                                    ...prev,
                                    cancellation: { ...prev.cancellation, enabled: e.target.checked },
                                  }))
                                }
                                className="rounded border-gray-600 bg-transparent"
                              />
                              <span className="text-sm font-medium">Appointment Cancellation</span>
                            </div>
                            {appointmentNotificationTypes.cancellation.enabled && (
                              <div className="ml-6">
                                <div className="flex gap-2 mb-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Studio_Name",
                                        cancellationTextareaRef,
                                        appointmentNotificationTypes.cancellation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            cancellation: { ...prev.cancellation, template: value },
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
                                        "Member_Name",
                                        cancellationTextareaRef,
                                        appointmentNotificationTypes.cancellation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            cancellation: { ...prev.cancellation, template: value },
                                          })),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Member Name
                                  </button>
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Appointment_Type",
                                        cancellationTextareaRef,
                                        appointmentNotificationTypes.cancellation.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            cancellation: { ...prev.cancellation, template: value },
                                          })),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Appointment Type
                                  </button>
                                </div>
                                <textarea
                                  ref={cancellationTextareaRef}
                                  value={appointmentNotificationTypes.cancellation.template}
                                  onChange={(e) =>
                                    setAppointmentNotificationTypes((prev) => ({
                                      ...prev,
                                      cancellation: { ...prev.cancellation, template: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                  placeholder="Hello {Member_Name}, your {Appointment_Type} has been cancelled."
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="checkbox"
                                checked={appointmentNotificationTypes.rescheduled.enabled}
                                onChange={(e) =>
                                  setAppointmentNotificationTypes((prev) => ({
                                    ...prev,
                                    rescheduled: { ...prev.rescheduled, enabled: e.target.checked },
                                  }))
                                }
                                className="rounded border-gray-600 bg-transparent"
                              />
                              <span className="text-sm font-medium">Appointment Rescheduled</span>
                            </div>
                            {appointmentNotificationTypes.rescheduled.enabled && (
                              <div className="ml-6">
                                <div className="flex gap-2 mb-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Studio_Name",
                                        rescheduledTextareaRef,
                                        appointmentNotificationTypes.rescheduled.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            rescheduled: { ...prev.rescheduled, template: value },
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
                                        "Member_Name",
                                        rescheduledTextareaRef,
                                        appointmentNotificationTypes.rescheduled.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            rescheduled: { ...prev.rescheduled, template: value },
                                          })),
                                      )
                                    }
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                  >
                                    Member Name
                                  </button>
                                  <button
                                    onClick={() =>
                                      insertVariable(
                                        "Appointment_Type",
                                        rescheduledTextareaRef,
                                        appointmentNotificationTypes.rescheduled.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            rescheduled: { ...prev.rescheduled, template: value },
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
                                        appointmentNotificationTypes.rescheduled.template,
                                        (value) =>
                                          setAppointmentNotificationTypes((prev) => ({
                                            ...prev,
                                            rescheduled: { ...prev.rescheduled, template: value },
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
                                  value={appointmentNotificationTypes.rescheduled.template}
                                  onChange={(e) =>
                                    setAppointmentNotificationTypes((prev) => ({
                                      ...prev,
                                      rescheduled: { ...prev.rescheduled, template: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                                  placeholder="Hello {Member_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}."
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {settingsTab === "setup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Auto-Archive Duration (days)
                  </label>
                  <input
                    type="number"
                    value={settings.autoArchiveDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, autoArchiveDuration: Number.parseInt(e.target.value) })
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
                    onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Default Broadcast Distribution
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.broadcastEmail}
                        onChange={(e) => setSettings({ ...settings, broadcastEmail: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.broadcastChat}
                        onChange={(e) => setSettings({ ...settings, broadcastChat: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Chat Notification</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Email Signature</label>
                  <div className="bg-[#222222] rounded-xl">
                    <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                      <button className="p-1 hover:bg-gray-600 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm underline">U</button>
                    </div>
                    <textarea
                      value={settings.emailSignature}
                      onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                      className="w-full bg-transparent text-white px-4 py-2 text-sm h-24 resize-none focus:outline-none"
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
  );
};

export default SettingsModal