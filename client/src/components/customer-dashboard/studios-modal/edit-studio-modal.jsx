/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast

const EditStudioModal = ({
  isOpen,
  onClose,
  selectedStudio,
  editForm,
  setEditForm,
  handleInputChange,
  handleEditSubmit,
  DefaultStudioImage
}) => {
  if (!isOpen || !selectedStudio) return null;

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Studio</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="flex flex-col items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                <img
                  src={selectedStudio.image || DefaultStudioImage}
                  alt="Studio Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                id="logo"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    toast.success("Logo selected successfully")
                  }
                }}
              />
              <label
                htmlFor="logo"
                className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
              >
                Update logo
              </label>
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Studio Name</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={editForm.ownerName}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={editForm.website}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={editForm.taxId}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Street</label>
              <input
                type="text"
                name="street"
                value={editForm.street}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={editForm.zipCode}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-gray-200 font-medium">Special Note</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noteImportance"
                    checked={editForm.noteImportance === "important"}
                    onChange={(e) => {
                      setEditForm({
                        ...editForm,
                        noteImportance: e.target.checked ? "important" : "unimportant",
                      })
                    }}
                    className="mr-2 h-4 w-4 accent-[#FF843E]"
                  />
                  <label htmlFor="noteImportance" className="text-sm text-gray-200">
                    Important
                  </label>
                </div>
              </div>

              <textarea
                name="note"
                value={editForm.note}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                placeholder="Enter special note..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                  <input
                    type="date"
                    name="noteStartDate"
                    value={editForm.noteStartDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">End Date</label>
                  <input
                    type="date"
                    name="noteEndDate"
                    value={editForm.noteEndDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">About</label>
              <textarea
                name="about"
                value={editForm.about}
                onChange={handleInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Contract Start</label>
                <input
                  type="date"
                  name="contractStart"
                  value={editForm.contractStart}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Contract End</label>
                <input
                  type="date"
                  name="contractEnd"
                  value={editForm.contractEnd}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudioModal;