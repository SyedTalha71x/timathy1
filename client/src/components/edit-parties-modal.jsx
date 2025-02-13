/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/avatar.png"

export function EditPartiesModal({ isVisible, onClose, onSave, partyData }) {
  const [avatar, setAvatar] = useState(Avatar)
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    trialPeriod: "",
  })

  // Populate form when partyData changes
  useEffect(() => {
    if (partyData) {
      const [firstName = "", surname = ""] = partyData.name.split(" ")
      setFormData({
        firstName,
        surname,
        email: partyData.email || "",
        phoneCode: "+1",
        phoneNumber: partyData.phoneNumber || "",
        trialPeriod: partyData.period || "",
      })
      setAvatar(partyData.avatar)
    }
  }, [partyData])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ 
      id: partyData?.id,
      ...formData, 
      avatar 
    })
    toast.success("Leet has been updated")
    onClose()
  }

  if (!isVisible) return null

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <div className="fixed inset-0 z-[100]">
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md bg-[#1C1C1C] rounded-xl shadow-xl p-6">
            <h1 className="font-bold text-lg">Edit Leet</h1>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-200 hover:text-white"
            >
              <X className="h-8 w-8" />
            </button>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 custom-scrollbar mt-10 overflow-y-auto max-h-[70vh]"
            >
              <div className="flex flex-col items-start">
                <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                  <img
                    src={avatar || "/placeholder.svg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
                >
                  Upload picture
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-200 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-200 mb-1">
                    Surname
                  </label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) =>
                      setFormData({ ...formData, surname: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-200 mb-1">
                    Phone No
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.phoneCode}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneCode: e.target.value })
                      }
                      className="w-16 px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                    />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      className="flex-1 px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-200 mb-1">
                    Trial period time
                  </label>
                  <input
                    type="text"
                    value={formData.trialPeriod}
                    onChange={(e) =>
                      setFormData({ ...formData, trialPeriod: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#101010] border border-gray-800 rounded-lg text-white outline-none text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-2 py-2 bg-[#3B82F6] text-white cursor-pointer text-sm rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-2 py-2 bg-black text-red-600 cursor-pointer text-sm rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
