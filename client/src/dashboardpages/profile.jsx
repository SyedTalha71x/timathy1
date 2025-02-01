/* eslint-disable no-unused-vars */
import { useState } from "react";
import { X, Menu } from "lucide-react";
import Profile from "../../public/Rectangle 27.png";

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

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white">
      <main className="flex-1  min-w-0">
        <div className="  p-8 ">
          <h1 className="text-2xl font-bold mb-8">Profile settings</h1>

          <div className="mb-8 flex flex-col justify-start items-start">
            <div className="flex items-center justify-center flex-col">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4">
                <img src={Profile || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="bg-[#3F74FF] hover:bg-blue-700 text-white px-6 text-sm py-1.5 rounded-3xl">
                Upload picture
              </button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-4 custom-scrollbar">
            <form className="space-y-6 w-full max-w-md">
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
                      className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm "
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone No
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      id="countryCode"
                      className="w-20 px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm "
                      placeholder="+1"
                    />
                    <input
                      type="tel"
                      id="phone"
                      className="flex-1 px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm "
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside
        className={`
          w-80 bg-[#181818] p-6 rounded-3xl fixed top-0 bottom-0 right-0 z-50 lg:static lg:block
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
        `}
      >
        <h2 className="text-2xl font-bold mb-6">Notification</h2>
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

export default App;
