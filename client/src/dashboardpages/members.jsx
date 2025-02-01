/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import Profile from "../../public/Rectangle 27.png";

export default function Members() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks] = useState([
    {
      id: 1,
      title: "Name",
      description: "Description",
      image: "../../public/avatar.png",
    },
    {
      id: 2,
      title: "Name",
      description: "Description",
      image: "../../public/avatar.png",
    },
    {
      id: 3,
      title: "Name",
      description: "Description",
      image: "../../public/avatar.png",
    },
    {
      id: 4,
      title: "Name",
      description: "Description",
      image: "../../public/avatar.png",
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

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsShowDetails(true);
  };

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white">
      <div className="flex-1 min-w-0 p-6 pb-36">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF843E] cursor-pointer text-white px-10 py-2 rounded-full text-sm"
          >
            + Add a member
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
            <div className="bg-[#181818] rounded-xl w-full max-w-md lg:p-6 md:p-6 sm:p-4 p-4 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-semibold">Add Member</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 cursor-pointer hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-4 w-full">
                <div className="mb-6 sm:mb-8 flex flex-col justify-start items-center w-full">
                  <div className="flex items-start justify-start flex-col w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 sm:mb-4">
                      <img
                        src={Profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="bg-[#3F74FF] hover:bg-blue-700 text-white px-4 sm:px-6 text-sm py-1.5 rounded-3xl">
                      Upload picture
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="firstName"
                      className="text-sm text-gray-200 block mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter first name"
                      className="w-full bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="lastName"
                      className="text-sm text-gray-200 block mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Enter last name"
                      className="w-full bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="text-sm text-gray-200 block mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      className="w-full bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="phone"
                      className="text-sm text-gray-200 block mb-1"
                    >
                      Phone No
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                      className="w-full bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="text-gray-200 text-sm block mb-1">
                    Input
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none">
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="text-gray-200 text-sm block mb-1">
                    Input
                  </label>
                  <div className="flex gap-2 sm:gap-1">
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-full sm:w-24 bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-full bg-[#101010] text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-start gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-3xl hover:bg-[#3F74FF]/90 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-8 py-2 bg-black text-red-500 border-slate-500 border-2 rounded-3xl text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isShowDetails && selectedTask && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
            <div className="bg-[#1C1C1C] rounded-xl lg:p-8 md:p-4 sm:p-4 p-4 max-w-sm relative">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsShowDetails(false);
                    setSelectedTask(null);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
                <div className="flex justify-start mb-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Member Name
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Rerum facere quod earum iusto itaque accusantium molestias
                    nisi fugiat laboriosam perspiciatis, eum maiores tempore, in
                    omnis sed sapiente sunt iure sequi!
                  </p>
                </div>
                <div className="bg-slate-500 h-[1px] w-full mt-2"></div>
                <div className="flex gap-2">
                  <span className="text-gray-400 px-3 py-1 text-sm">Tag</span>
                  <span className="text-gray-400 px-3 py-1 text-sm">Tag</span>
                </div>
                <div className="bg-slate-500 h-[1px] w-full mt-2"></div>
                <div className="space-y-3">
                  <span className="text-sm text-gray-400 italic">
                    Special Note
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-black rounded-xl p-4 mt-[10%]">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-[#161616] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={task.image || "/placeholder.svg"}
                      className="h-16 w-16 rounded-full"
                      alt={task.title}
                    />
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleViewDetails(task)}
                      className="text-gray-400 bg-black rounded-full py-1.5 px-8 hover:text-white text-sm"
                    >
                      View details
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside
        className={`
          w-80 bg-[#181818] p-6 rounded-3xl fixed top-0 bottom-0 right-0 z-50 lg:static lg:block
          ${
            isRightSidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }
          transition-transform duration-300 ease-in-out
        `}
      >
        <h2 className="text-2xl font-bold mb-6">Notification</h2>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1C1C1C] rounded-lg p-4 relative"
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
              <h3 className="font-semibold mb-2">{notification.heading}</h3>
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
