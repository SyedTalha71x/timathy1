/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"

export function AddLeadModal({ isVisible, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phoneNumber: "",
    trialPeriod: "Trial Period",
    hasTrialTraining: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl outline-none bg-[#141414] border-gray-600 text-white text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-400">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl outline-none bg-[#141414] border-gray-600 text-white text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl outline-none bg-[#141414] border-gray-600 text-white text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl outline-none bg-[#141414] border-gray-600 text-white text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="trialPeriod" className="block text-sm font-medium text-gray-400">
              Trial Period
            </label>
            <input
              type="text"
              id="trialPeriod"
              name="trialPeriod"
              value={formData.trialPeriod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl outline-none bg-[#141414] border-gray-600 text-white text-sm p-2"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasTrialTraining"
              name="hasTrialTraining"
              checked={formData.hasTrialTraining}
              onChange={handleChange}
              className="rounded bg-[#141414] border-gray-600 text-[#FF5733] focus:ring-[#FF5733]"
            />
            <label htmlFor="hasTrialTraining" className="ml-2 block text-sm text-gray-400">
              Trial Training Arranged
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl outline-none hover:bg-[#E64D2E] transition-colors duration-200"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

