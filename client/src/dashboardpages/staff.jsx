import { useState } from "react";
import { MoreHorizontal, X, Bell } from "lucide-react";
import Staff from '../../public/avatar3.png';

export default function Members() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const [tasks] = useState([
    {
      id: 1,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff
    },
    {
      id: 2,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff
    },
    {
      id: 3,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff
    },
    {
      id: 4,
      title: "Natalia Brown",
      role: "Telephone operator",
      description: "Minim dolor in amet nulla laboris enim dolore.",
      image: Staff
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

  return (
    <div className="flex relative rounded-3xl bg-[#1C1C1C] text-white">
      <div className="flex-1 min-w-0 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Staff management</h1>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              className="bg-[#FF843E] text-white px-6 sm:px-10 py-2 rounded-full text-sm flex-1 sm:flex-none"
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

        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 sm:mt-[10%] gap-4 max-w-5xl mx-auto">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#141414] rounded-xl p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="relative w-full mb-4">
                <button className="absolute right-0 top-0 text-gray-400 hover:text-white">
                  <MoreHorizontal size={20} />
                </button>
                <img
                  src={task.image}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto"
                  alt={task.title}
                />
              </div>
              <h3 className="text-white font-medium text-base sm:text-lg mb-1">{task.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-2">{task.role}</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">{task.description}</p>
              <button className="text-white border border-slate-500 bg-black rounded-full py-1.5 px-6 sm:px-8 hover:text-white text-sm w-fit">
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
          <h2 className="text-xl sm:text-2xl font-bold">Notifications</h2>
          <button 
            onClick={() => setIsRightSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-black/20 rounded-full transition-colors"
            aria-label="Close notifications"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-[#1C1C1C] rounded-lg p-4 relative">
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
              <h3 className="font-semibold mb-2">{notification.heading}</h3>
              <p className="text-sm text-zinc-400">{notification.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}