/* eslint-disable react/prop-types */
import { X } from "lucide-react";

export function ViewLeadDetailsModal({ isVisible, onClose, leadData }) {
  if (!isVisible || !leadData) return null;

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'passive':
        return 'text-yellow-500';
      case 'uninterested':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-lg">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Lead Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile section */}
        <div className="flex items-center  md:flex-row flex-col mb-6 border-b border-gray-700 pb-6">
          <img
            src={leadData.avatar}
            alt={`${leadData.firstName} ${leadData.surname}'s avatar`}
            className="w-20 h-20 rounded-full bg-zinc-800 object-cover"
          />
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-white">
              {`${leadData.firstName} ${leadData.surname}`}
            </h3>
            <p className={`text-sm font-medium ${getStatusColor(leadData.status)} capitalize`}>
              {leadData.status}
            </p>
          </div>
        </div>

        {/* Details grid - two fields per row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {/* Email */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Email</p>
            <p className="text-white break-words">{leadData.email}</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Phone Number</p>
            <p className="text-white">{leadData.phoneNumber}</p>
          </div>

          {/* Trial Period */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Trial Period</p>
            <p className="text-white">{leadData.trialPeriod}</p>
          </div>

          {/* Trial Training Status */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Trial Training</p>
            <p className={leadData.hasTrialTraining ? "text-green-500" : "text-red-500"}>
              {leadData.hasTrialTraining ? "Arranged" : "Not Arranged"}
            </p>
          </div>

          {/* Created Date */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Created At</p>
            <p className="text-white">{formatDate(leadData.createdAt)}</p>
          </div>

          {/* ID */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Lead ID</p>
            <p className="text-white font-mono text-sm">{leadData.id}</p>
          </div>

          {/* Source */}
          {/* <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium text-gray-400">Source</p>
            <p className="text-white capitalize">{leadData.source}</p>
          </div> */}
        </div>
      
      </div>
    </div>
  );
}