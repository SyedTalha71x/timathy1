/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Calendar } from "lucide-react";
import DefaultAvatar from "../../../../public/gray-avatar-fotor-20250912192528.png"; // update path

export function ViewStaffModal({ isVisible, onClose, staffData }) {
  if (!isVisible || !staffData) return null;

  const {
    firstName,
    lastName,
    role,
    email,
    phone,
    description,
    img,
    username,
    street,
    zipCode,
    city,
    vacationEntitlement,
    birthday,
  } = staffData;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center p-2 items-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl my-8 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-white font-bold">Staff Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 text-white">
            {/* Profile */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                src={img || DefaultAvatar}
                alt="Profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold">
                  {firstName} {lastName}{" "}
                  {birthday && `(${birthday})`}
                </h3>
                <p className="text-gray-400 mt-1 text-sm">{role}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm break-all">{email || "No Email Found"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-sm">{phone || "No Phone Found"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="text-sm">{username || "No Username Found"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Vacation Entitlement</p>
                <p className="text-sm">
                  {vacationEntitlement
                    ? `${vacationEntitlement} days`
                    : "Not Set"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Birthday</p>
                <p className="text-sm">
                  {birthday
                    ?  `${birthday && `(${birthday})`}`
                    : "No Birthday Found"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">City / ZIP</p>
                <p className="text-sm">
                  {city || "Unknown"}, {zipCode || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Street</p>
              <p className="text-sm">{street || "No Street Found"}</p>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-gray-400">Description</p>
              <p className="text-sm">{description || "No Description"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
