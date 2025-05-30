/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X, Users, Building } from 'lucide-react';

const StudioDetailsModal = ({ 
  isOpen, 
  onClose, 
  studio, 
  franchises = [], 
  studioStats = {},
  DefaultStudioImage,
  isContractExpiringSoon 
}) => {
  if (!isOpen || !studio) return null;

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
        <div className="p-6 custom-scrollbar overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Studio Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4 text-white">
            <div className="flex items-center gap-4">
              <img
                src={studio.image || DefaultStudioImage}
                alt="Studio Logo"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{studio.name}</h3>
                <p className="text-gray-400">
                  Contract: {studio.contractStart} -
                  <span className={isContractExpiringSoon(studio.contractEnd) ? "text-red-500" : ""}>
                    {studio.contractEnd}
                  </span>
                </p>
                {studio.franchiseId && (
                  <p className="text-purple-400 text-sm">
                    Franchise: {franchises.find((f) => f.id === studio.franchiseId)?.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Owner</p>
                <p>{studio.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tax ID</p>
                <p>{studio.taxId}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{studio.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p>{studio.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Website</p>
              <p>{studio.website}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p>{`${studio.street}, ${studio.zipCode} ${studio.city}`}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <p className="text-xl font-semibold">{studioStats[studio.id]?.members || 0}</p>
                </div>
                <p className="text-xs text-gray-400">Members</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Building size={16} className="text-green-400" />
                  <p className="text-xl font-semibold">{studioStats[studio.id]?.trainers || 0}</p>
                </div>
                <p className="text-xs text-gray-400">Trainers</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">About</p>
              <p>{studio.about}</p>
            </div>

            {studio.note && (
              <div>
                <p className="text-sm text-gray-400">Special Note</p>
                <p>{studio.note}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Note Period: {studio.noteStartDate} to {studio.noteEndDate}
                </p>
                <p className="text-sm text-gray-400">Importance: {studio.noteImportance}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDetailsModal;