/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Clock } from "lucide-react";
import DefaultAvatar1 from "../../../../../public/gray-avatar-fotor-20250912192528.png"; 

const MemberDetailsModal = ({ isOpen, onClose, member, calculateAge, isContractExpiringSoon }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-semibold">Member Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 text-white">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                src={member.image || DefaultAvatar1}
                alt="Profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold">
                  {member.firstName} {member.lastName}{" "}
                  ({(member.dateOfBirth)})
                </h3>
                <p className="text-gray-400 mt-1 text-sm">
                  Contract: {member.contractStart} -{" "}
                  <span
                    className={
                      isContractExpiringSoon?.(member.contractEnd)
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {member.contractEnd}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Membership Type</p>
                <p className="text-sm">{member.membershipType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-sm capitalize">{member.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm break-all">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-sm">{member.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Join Date</p>
                <p className="text-sm">{member.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date of Birth</p>
                <p className="text-sm">
                  {member.dateOfBirth} (Age: {calculateAge?.(member.dateOfBirth)})
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p className="text-sm">
                {`${member.street}, ${member.zipCode} ${member.city}`}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">About</p>
              <p className="text-sm">{member.about}</p>
            </div>

            {member.note && (
              <div>
                <p className="text-sm text-gray-400">Note</p>
                <div className="mt-1 p-2 bg-gray-800/40 border border-gray-700/30 rounded-lg">
                  <p className="text-sm">{member.note}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {member.noteStartDate} - {member.noteEndDate} (
                    {member.noteImportance})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
