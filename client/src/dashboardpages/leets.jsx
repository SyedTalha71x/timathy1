/* eslint-disable no-unused-vars */
import { Bell, Edit2, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import Avatar from "../../public/avatar.png";
import { AddPartiesModal } from "../components/add-parties-modal";
import { EditPartiesModal } from "../components/edit-parties-modal";

export default function Leets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [parties, setParties] = useState([
    {
      id: 1,
      name: "John Smith",
      period: "Trail Period",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Sarah Wilson",
      period: "Trail Period",
      avatar: Avatar,
    },
    {
      id: 3,
      name: "Michael Brown",
      period: "Trail Period",
      avatar: Avatar,
    },
    {
      id: 4,
      name: "Emma Davis",
      period: "Trail Period",
      avatar: Avatar,
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
    {
      id: 2,
      heading: "Heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
  ]);

  const handleEditParty = (party) => {
    setSelectedParty(party);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (data) => {
    setParties(
      parties.map((party) =>
        party.id === data.id
          ? {
              ...party,
              name: `${data.firstName} ${data.surname}`,
              period: data.trialPeriod,
              avatar: data.avatar,
              email: data.email,
              phoneNumber: data.phoneNumber,
            }
          : party
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const handleSaveParty = (data) => {
    setParties([
      ...parties,
      {
        id: parties.length + 1,
        name: `${data.firstName} ${data.surname}`,
        period: data.trialPeriod,
        avatar: data.avatar,
      },
    ]);
  };

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen relative">
      <main className="flex-1 min-w-0 p-6">
        <div className="flex flex-col sm:flex-row justify-between  sm:items-center gap-4 sm:gap-0 mb-6">
          <h2 className="text-xl md:text-2xl oxanium_font font-bold">
            Interested parties
          </h2>
          <div className="flex ">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF5733] lg:text-sm text-xs w-full text-center hover:bg-[#E64D2E] text-white px-4 py-2 rounded-xl cursor-pointer transition-colors duration-200 flex justify-center items-center gap-1"
            >
              <span>Add Parties</span>
            </button>
            <button
              onClick={() => setIsRightSidebarOpen(true)}
              className="text-gray-400 hover:text-white lg:hidden p-2"
            >
              <Bell size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:mt-24 mt-10 bg-[#000000] p-4 rounded-xl max-w-4xl mx-auto">
          {parties.map((party) => (
            <div
              key={party.id}
              className="bg-[#141414] rounded-lg p-5 flex md:flex-row flex-col items-center justify-between"
            >
              <div className="flex md:flex-row flex-col items-center gap-3">
                <img
                  src={party.avatar}
                  alt={`${party.name}'s avatar`}
                  className="w-14 h-14 rounded-full bg-zinc-800"
                />
                <div className="flex flex-col md:text-left text-center">
                  <span className="font-bold text-md">{party.name}</span>
                  <div className="text-gray-400 text-sm">{party.period}</div>
                </div>
              </div>
              <button   onClick={() => handleEditParty(party)} className="text-gray-300 px-6 py-2 md:w-auto w-full lg:mt-0 mt-3 text-sm border border-slate-400/30  transition-colors duration-500 p-2 cursor-pointer bg-black rounded-xl">
                Edit
              </button>
            </div>
          ))}
        </div>
      </main>

      <AddPartiesModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveParty}
      />

      <EditPartiesModal
        isVisible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedParty(null);
        }}
        onSave={handleSaveEdit}
        partyData={selectedParty}
      />

      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsRightSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[320px] bg-[#181818] p-6 z-50 
          lg:static lg:w-80 lg:block lg:rounded-3xl
          transform ${
            isRightSidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold oxanium_font">Notification</h2>
          <button
            onClick={() => setIsRightSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative transform transition-all duration-200 hover:scale-[1.02]"
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
              <h3 className="mb-2">{notification.heading}</h3>
              <p className="text-sm text-zinc-400">
                {notification.description}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
