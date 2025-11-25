/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdEmail, MdBusiness, MdPerson } from "react-icons/md";
import { IoIosClock } from "react-icons/io";

const DemoConfiguratorModal = ({ isOpen, onClose, demo, onUpdate }) => {
  const [formData, setFormData] = useState({
    studioName: demo?.config.studioName || "",
    studioOwner: demo?.config.studioOwner || "",
    demoDuration: demo?.config.demoDuration || 7,
    email: demo?.config.email || "",
    sendEmail: demo?.config.sendEmail ?? true
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-md w-full border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Edit Demo Configuration</h2>
          <p className="text-gray-400 text-sm mt-1">Update demo details and permissions</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Studio Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.studioName}
                onChange={(e) => setFormData({...formData, studioName: e.target.value})}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
              <MdBusiness className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Studio Owner
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.studioOwner}
                onChange={(e) => setFormData({...formData, studioOwner: e.target.value})}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
              <MdPerson className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Demo Duration (Days)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={formData.demoDuration}
                onChange={(e) => setFormData({...formData, demoDuration: parseInt(e.target.value)})}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
              <IoIosClock className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
              <MdEmail className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendEmail"
              checked={formData.sendEmail}
              onChange={(e) => setFormData({...formData, sendEmail: e.target.checked})}
              className="mr-3"
            />
            <label htmlFor="sendEmail" className="text-sm text-gray-300">
              Send setup email to user
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoConfiguratorModal;