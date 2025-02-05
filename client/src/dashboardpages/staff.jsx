import { useEffect, useState } from "react";
import { MoreHorizontal, X, Bell } from "lucide-react";
import Staff from "../../public/avatar3.png";
import Profile from "../../public/avatar3.png";

export default function StaffComponent() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-trigger") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [tasks] = useState([
    {
      id: 1,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff,
    },
    {
      id: 2,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff,
    },
    {
      id: 3,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff,
    },
    {
      id: 4,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff,
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

  const toggleDropdown = (taskId, event) => {
    event.stopPropagation();
    setActiveDropdownId(activeDropdownId === taskId ? null : taskId);
  };

  return (
    <>
      <div className="flex relative rounded-3xl cursor-pointer bg-[#1C1C1C] text-white">
        <div className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl oxanium_font text-white">
              Staff management
            </h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF843E] text-white open_sans_font px-6 sm:px-10 py-2 rounded-full text-sm flex-1 sm:flex-none"
              >
                + Add Roles
              </button>
              <button
                onClick={() => setIsRightSidebarOpen(true)}
                className="p-2 hover:bg-black/20 rounded-full transition-colors"
                aria-label="Open notifications"
              >
                <Bell size={24} className="lg:hidden block" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 open_sans_font md:grid-cols-2 mt-8 sm:mt-[10%] gap-4 max-w-5xl mx-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#141414] rounded-xl p-4 sm:p-6 flex flex-col items-center text-center"
              >
                <div className="relative w-full mb-4">
                  <button className="absolute right-0 top-0 text-gray-400 hover:text-white">
                    <MoreHorizontal
                      size={20}
                      onClick={(e) => toggleDropdown(task.id, e)}
                    />

                    {activeDropdownId === task.id && (
                      <div className="dropdown-menu absolute right-3 top-2 mt-2 w-32 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-lg border border-gray-800 shadow-lg overflow-hidden z-10">
                        <button
                          className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(null);
                          }}
                        >
                          Edit
                        </button>
                        <div className="h-[1px] bg-[#BCBBBB] w-[85%] mx-auto"></div>
                        <button
                          className="w-full px-4 py-2 text-red-500 text-sm  hover:bg-gray-800 text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </button>
                  <img
                    src={task.image || "/placeholder.svg"}
                    width={80}
                    height={80}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto"
                    alt={task.title}
                  />
                </div>
                <h3 className="text-white font-medium text-base sm:text-lg mb-1">
                  {task.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2">
                  {task.role}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">
                  {task.description}
                </p>
                <button
                  onClick={() => handleViewDetails(task)}
                  className="text-white border border-slate-500 bg-black rounded-full py-1.5 px-6 sm:px-8 hover:text-white text-sm w-fit"
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        </div>

        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsRightSidebarOpen(false)}
          />
        )}

        <aside
          className={`
          w-80 bg-[#181818] p-6 md:rounded-3xl rounded-none fixed top-0 bottom-0 right-0 z-50 lg:static lg:block
          ${
            isRightSidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }
          transition-transform duration-500 ease-in-out
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl oxanium_font font-bold">
              Notifications
            </h2>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-black/20 rounded-full transition-colors"
              aria-label="Close notifications"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 open_sans_font">
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
                <h3 className="font-semibold open_sans_font_700 mb-2">
                  {notification.heading}
                </h3>
                <p className="text-sm text-zinc-400">
                  {notification.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          {" "}
          <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg open_sans_font_700">
                  Add Member
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-3">
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={Profile || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-3xl text-sm">
                    Upload picture
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Phone No
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Input
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-[30%] bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Input
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors">
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="flex flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-2.5 bg-[#3F74FF] text-sm text-white rounded-3xl hover:bg-[#3F74FF]/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-red-500 border-2 border-slate-500 rounded-3xl text-sm hover:bg-slate-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isShowDetails && selectedTask && (
        <div className="fixed open_sans_font inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          {" "}
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <button
                onClick={() => {
                  setIsShowDetails(false);
                  setSelectedTask(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                  <img
                    src={Profile}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-white open_sans_font_700 text-xl font-bold mb-3">
                    Staff Name
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Rerum facere quod earum iusto itaque accusantium molestias
                    nisi fugiat laboriosam perspiciatis.
                  </p>
                </div>

                <div className="h-px bg-slate-500" />

                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-400 px-4 py-1.5 text-sm">
                    Roles
                  </span>
                  <span className="text-gray-400 px-4 py-1.5 text-sm">
                    Roles
                  </span>
                </div>

                <div className="h-px bg-slate-500" />
                <div className="m-3">
                  <div>
                    <span className="text-sm text-gray-400">Permissions</span>
                  </div>

                  <div className="mt-2">
                    <button className="py-2 px-7 cursor-pointer text-white bg-[#3F74FF] rounded-xl text-sm">
                      Permission 1
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
