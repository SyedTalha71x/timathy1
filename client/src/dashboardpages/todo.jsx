import { useState } from "react";
import { MoreHorizontal, X, Bell, Plus } from "lucide-react";
import Avatar from "../../public/avatar.png";

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [tasks] = useState([
    {
      id: 1,
      title: "Task",
      description: "Description",
      assignee: "Jack",
      priority: "P1",
    },
    {
      id: 2,
      title: "Task",
      description: "Description",
      assignee: "Jack",
      priority: "P1",
    },
    {
      id: 3,
      title: "Task",
      description: "Description",
      assignee: "Jack",
      priority: "P1",
    },
    {
      id: 4,
      title: "Task",
      description: "Description",
      assignee: "Jack",
      priority: "P1",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "completed",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    },
    {
      id: 2,
      type: "ongoing",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    },
    {
      id: 3,
      type: "canceled",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
    },
  ]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case "completed":
        return "bg-[#152619]";
      case "ongoing":
        return "bg-[#1B2236]";
      case "canceled":
        return "bg-[#261515]";
      default:
        return "bg-gray-800";
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsShowDetails(true);
  };

  return (
    <>
      <div className="flex rounded-3xl bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden">
        {isNotificationOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsNotificationOpen(false)}
          />
        )}

        <div className="flex-1 lg:p-6 md:p-6 sm:p-5 p-5">
          <div className="lg:pb-36 md:pb-32 sm:pb-16 pb-16">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white oxanium_font">To-Do</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#FF843E] cursor-pointer text-white px-4 sm:px-10 py-2 rounded-full text-sm flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="open_sans_font">Add task</span>
                </button>
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <Bell size={20} />
                </button>
              </div>
            </div>

            <div className="bg-black rounded-xl open_sans_font p-3 lg:mt-24 md:mt-20 sm:mt-16 mt-16">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-[#161616] rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex flex-col">
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <p className="text-gray-400 text-sm mt-3">{task.description}</p>

                      </div>
                      <button className="text-gray-400 hover:text-white sm:hidden">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                    <div className="w-full">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                          onClick={() => handleViewDetails(task)}
                          className="w-full  sm:w-full text-gray-200 border-[1px] border-slate-600 bg-black rounded-xl py-1.5 px-6 hover:text-white text-sm"
                        >
                          View details
                        </button>
                        <div className="w-full flex flex-col sm:flex-row gap-2">
                          <button className="w-full sm:w-auto bg-[#3F74FF] text-white px-4 py-1.5 rounded-xl text-sm flex items-center gap-2">
                            <img
                              src={Avatar}
                              alt=""
                              className="w-4 h-4 rounded-full"
                            />
                            {task.assignee}
                          </button>
                          <span className="w-full sm:w-auto bg-black text-white px-6 py-1 rounded-xl border-[1px] border-slate-600 text-sm">
                            {task.priority}
                          </span>
                        </div>
                        <button className="w-full sm:w-auto text-gray-400 hidden sm:block hover:text-white">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed lg:static inset-y-0 right-0 w-[320px] bg-[#181818] p-6 transform transition-transform duration-500 ease-in-out ${
            isNotificationOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          } z-40`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl oxanium_font text-white">Notification</h2>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3 ">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${getNotificationStyles(
                  notification.type
                )} rounded-xl p-4 relative`}
              >
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
                <h3 className="text-white open_sans_font_700 font-medium capitalize mb-2">
                  {notification.type}
                </h3>
                <p className="text-gray-400 text-sm">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 open_sans_font w-screen h-screen bg-black/50 flex items-center p-3 sm:p-4 md:p-6 justify-center z-[1000]">
    <div className="bg-[#181818] rounded-xl w-full max-w-md p-4 sm:p-5 md:p-6 lg:p-6 relative">
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <h2 className="text-white text-lg open_sans_font_700 font-semibold">Add task</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-400 cursor-pointer hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-4">
          {Array(4).fill("").map((_, index) => (
            <div key={index}>
              <label className="text-sm text-gray-200">Input</label>
              <input
                type="text"
                placeholder="Input"
                className="w-full bg-[#101010] mt-1 text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm text-gray-200">Select Input</label>
          <select className="w-full bg-[#101010] mt-1 text-sm rounded-lg px-4 py-2.5 text-white outline-none">
            <option value="">Select</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-200">Double Input</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Short"
              className="w-24 bg-[#101010] text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
            />
            <input
              type="text"
              placeholder="Full Width"
              className="w-full bg-[#101010] text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-3 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-3xl hover:bg-[#3F74FF]/90 cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-8 py-2 bg-black text-red-500 border-slate-500 border-2 rounded-3xl text-sm cursor-pointer"
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
              <div>
                <h3 className="text-white text-xl font-bold mb-2">
                  Task Heading
                </h3>
                <p className="text-gray-400 text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
                  voluptatibus atque laborum dolor sunt cumque dolorem rerum
                  eius, sed, esse quod, aliquam praesentium alias maxime
                  officiis delectus nemo fuga nesciunt et vitae!
                </p>
              </div>

              <div className="bg-slate-500 h-[1px] w-full mt-2"></div>
              <div className="flex gap-2">
                <span className=" text-gray-400 px-3 py-1  text-sm">Tag</span>
                <span className=" text-gray-400 px-3 py-1  text-sm">Tag</span>
              </div>

              <div className="bg-slate-500 h-[1px] w-full mt-2"></div>

              <div className="space-y-3">
                <p className="text-gray-400 text-sm">Assign to & priority</p>
                <div className="flex flex-col justify-start items-start gap-2">
                  <button className="bg-[#3F74FF]  text-white px-6 py-2 rounded-2xl  text-sm">
                    Assignee
                  </button>
                  <span className="bg-black  text-white px-6 py-2 rounded-2xl border-[1px] border-slate-600 text-sm">
                    P1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
