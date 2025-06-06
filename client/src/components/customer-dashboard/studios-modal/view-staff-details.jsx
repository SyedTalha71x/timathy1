/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export function ViewStaffModal({ isVisible, onClose, staffData }) {
    if (!isVisible || !staffData) return null

    const {
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        country,
        city,
        zipCode,
        address,
        joinedAt,
    } = staffData

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center p-2 items-center z-[1000] overflow-y-auto">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-white font-bold">Staff Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-200 block mb-2">First Name</label>
                                <p className="text-sm text-white  rounded-xl ">{firstName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                                <p className="text-sm text-white  rounded-xl ">{lastName}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Email</label>
                            <p className="text-sm text-white  rounded-xl ">{email || 'No Email Found'}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Phone</label>
                            <p className="text-sm text-white  rounded-xl ">{phone || 'No Phone Found'}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Position</label>
                            <p className="text-sm text-white  rounded-xl ">{position || 'No Position Found'}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Department</label>
                            <p className="text-sm text-white  rounded-xl ">{department || 'No Department Found'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-200 block mb-2">City</label>
                                <p className="text-sm text-white  rounded-xl ">{city || 'No City Found'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                                <p className="text-sm text-white  rounded-xl ">{zipCode || 'No ZipCode Found'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Country</label>
                            <p className="text-sm text-white  rounded-xl ">{country || 'No Country Found'}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Address</label>
                            <p className="text-sm text-white  rounded-xl ">{address || 'No Address Found'}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-200 block mb-2">Joined At</label>
                            <p className="text-sm text-white  rounded-xl ">
                                {new Date(joinedAt).toLocaleDateString() || 'No Date Found'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
