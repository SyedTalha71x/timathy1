/* eslint-disable no-unused-vars */
import { useState } from "react";
import { X, Bell } from "lucide-react";
import Profile from "../../../public/Rectangle 27.png";

function App() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
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
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen relative">
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl md:text-2xl font-bold oxanium_font">Profile settings</h1>
           
          </div>

          <div className="mb-8 flex flex-col justify-start items-start">
            <div className="flex items-center justify-center flex-col">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4">
                <img src={Profile || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="bg-[#3F74FF] open_sans_font hover:bg-blue-700 text-white px-6 text-sm py-1.5 rounded-xl  transition-colors duration-200">
                Upload picture
              </button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-4 custom-scrollbar">
            <form className="space-y-6 w-full max-w-md p-2 open_sans_font">
              <div className="space-y-4">
                {[
                  { label: "First Name", id: "firstName", type: "text", placeholder: "First name" },
                  { label: "Last Name", id: "lastName", type: "text", placeholder: "Last name" },
                  { label: "Email", id: "email", type: "email", placeholder: "Email" },
                  { label: "Input", id: "input", type: "text", placeholder: "Input" },
                ].map(({ label, id, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      id={id}
                      className="w-full px-4 py-3 rounded-xl  bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone No
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="countryCode"
                      className="w-20 px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                      placeholder="+1"
                    />
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>


      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[320px] bg-[#181818] p-6 z-50 
          lg:static lg:w-80 lg:block lg:rounded-3xl
          transform ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          transition-all duration-500 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold oxanium_font">Notification</h2>
          <button
            onClick={toggleRightSidebar}
            className="lg:hidden p-2 hover:bg-zinc-700 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
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
              <h3 className=" mb-2 oxanium_font">{notification.heading}</h3>
              <p className="text-sm open_sans_font text-zinc-400">{notification.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default App;