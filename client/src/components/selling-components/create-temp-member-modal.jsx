/* eslint-disable react/prop-types */
import { X, Info } from "lucide-react";

export default function CreateTempMemberModal({
  show,
  onClose,
  onSubmit,
  tempMemberModalTab,
  setTempMemberModalTab,
  tempMemberForm,
  handleTempMemberInputChange,
  setTempMemberForm,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">
              Create Temporary Member
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Info */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-yellow-500 " size={50} />
              <div>
                <p className="text-yellow-200 text-sm font-medium mb-1">
                  Temporary Member Information
                </p>
                <p className="text-yellow-300/80 text-xs">
                  Temporary members are members without a contract and are not included in payment runs. 
                  They will be automatically archived after the specified period.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setTempMemberModalTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                tempMemberModalTab === "details"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setTempMemberModalTab("note")}
              className={`px-4 py-2 text-sm font-medium ${
                tempMemberModalTab === "note"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Special Note
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="space-y-4 custom-scrollbar overflow-y-auto max-h-[50vh]"
          >
            {/* Details Tab */}
            {tempMemberModalTab === "details" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={tempMemberForm.firstName}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={tempMemberForm.lastName}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={tempMemberForm.email}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={tempMemberForm.phone}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={tempMemberForm.street}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={tempMemberForm.zipCode}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={tempMemberForm.city}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={tempMemberForm.dateOfBirth}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Auto-Archive Period (weeks)</label>
                  <input
                    type="number"
                    name="autoArchivePeriod"
                    value={tempMemberForm.autoArchivePeriod}
                    onChange={handleTempMemberInputChange}
                    min="1"
                    max="52"
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Member will be automatically archived after this period
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">About</label>
                  <textarea
                    name="about"
                    value={tempMemberForm.about}
                    onChange={handleTempMemberInputChange}
                    className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  />
                </div>
              </>
            )}

            {/* Note Tab */}
            {tempMemberModalTab === "note" && (
              <div className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-200 font-medium">Special Note</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tempNoteImportance"
                      checked={tempMemberForm.noteImportance === "important"}
                      onChange={(e) => {
                        setTempMemberForm({
                          ...tempMemberForm,
                          noteImportance: e.target.checked ? "important" : "unimportant",
                        });
                      }}
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="tempNoteImportance" className="text-sm text-gray-200">
                      Important
                    </label>
                  </div>
                </div>
                <textarea
                  name="note"
                  value={tempMemberForm.note}
                  onChange={handleTempMemberInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                  placeholder="Enter special note..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                    <input
                      type="date"
                      name="noteStartDate"
                      value={tempMemberForm.noteStartDate}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">End Date</label>
                    <input
                      type="date"
                      name="noteEndDate"
                      value={tempMemberForm.noteEndDate}
                      onChange={handleTempMemberInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 text-sm cursor-pointer"
            >
              Create Temporary Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
