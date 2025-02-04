import { useState } from "react";
import { MoreHorizontal, X, Bell } from "lucide-react";
import Profile from "../../public/image10.png";

export default function Members() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks] = useState([
    { id: 1, title: "Name", description: "Description", image: Profile },
    { id: 2, title: "Name", description: "Description", image: Profile },
    { id: 3, title: "Name", description: "Description", image: Profile },
    { id: 4, title: "Name", description: "Description", image: Profile },
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
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative">
      <div className="flex-1 min-w-0 p-6 pb-36">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl oxanium_font text-white">Members</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsRightSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Bell size={24} className="lg:hidden block" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF843E] flex gap-2 cursor-pointer text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#FF843E]/90 transition-colors"
            >
              + <span className="lg:block open_sans_font hidden">Add a member</span>
            </button>
          </div>
        </div>

        {isModalOpen && (
  <div className="fixed open_sans_font inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
    <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white open_sans_font_700 text-lg font-semibold">
            Add Member
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5">
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

          {/* Inputs in Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Phone No</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>
          </div>

          {/* Select Input */}
          <div>
            <label className="text-sm text-gray-200 block mb-2">Input</label>
            <select className="w-full bg-[#101010] text-sm rounded-lg px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors">
              <option value="">Select</option>
            </select>
          </div>

          {/* Two Inputs in a Row (Fixed for Small Screens) */}
          <div>
            <label className="text-sm text-gray-200 block mb-2">Input</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Short"
                className="w-[40%] sm:w-24 bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
              <input
                type="text"
                placeholder="Full Width"
                className="w-full sm:flex-1 bg-[#101010] text-sm rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
          <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
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
                      src={Profile }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-white open_sans_font_700 text-xl font-bold mb-3">
                      Member Name
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Rerum facere quod earum iusto itaque accusantium molestias
                      nisi fugiat laboriosam perspiciatis.
                    </p>
                  </div>

                  <div className="h-px bg-slate-500" />

                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-400 px-4 py-1.5 text-sm bg-[#161616] rounded-full">
                      Tag
                    </span>
                    <span className="text-gray-400 px-4 py-1.5 text-sm bg-[#161616] rounded-full">
                      Tag
                    </span>
                  </div>

                  <div className="h-px bg-slate-500" />

                  <div>
                    <span className="text-sm text-gray-400 italic">
                      Special Note
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-black rounded-xl open_sans_font p-4 mt-[10%]">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-[#161616] rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={task.image || "/placeholder.svg"}
                      className="h-16 w-16 rounded-full flex-shrink-0"
                      alt=""
                    />
                    <div className="min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {task.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleViewDetails(task)}
                      className="text-gray-200 bg-black rounded-xl border border-slate-600 py-2 px-6 hover:text-white hover:border-slate-400 transition-colors text-sm"
                    >
                      View details
                    </button>
                    <button className="text-gray-400 hover:text-white p-1.5 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        w-80 bg-[#181818] p-6 fixed top-0 bottom-0 right-0 z-50 lg:static lg:block
        ${
          isRightSidebarOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
        }
        transition-transform duration-300 ease-in-out
      `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold oxanium_font">Notification</h2>
          <button
            onClick={() => setIsRightSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden transition-colors"
          >
            <X size={24} />
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
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
              <h3 className="open_sans_font_700 mb-2">{notification.heading}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {notification.description}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
