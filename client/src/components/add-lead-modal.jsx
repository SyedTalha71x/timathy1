/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"
import Avatar from "../../public/avatar.png"

export const AddLeadModal = ({ isVisible, onClose, onSave }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [trialPeriod, setTrialPeriod] = useState("")
  const [hasTrialTraining, setHasTrialTraining] = useState(false)
  const [avatar, setAvatar] = useState(Avatar)
  const [status, setStatus] = useState("passive")
  const [note, setNote] = useState("")
  const [noteImportance, setNoteImportance] = useState("normal")
  const [noteStartDate, setNoteStartDate] = useState(null)
  const [noteEndDate, setNoteEndDate] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const leadData = {
      firstName,
      lastName,
      email,
      phone,
      trialPeriod,
      hasTrialTraining,
      avatar,
      status,
      note,
      noteImportance,
      noteStartDate,
      noteEndDate,
    }
    onSave(leadData)
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-200 block mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E]">
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
