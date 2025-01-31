import { useState } from "react"
import { MoreHorizontal, X } from "lucide-react"

export default function Members() {
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
      image: "../../public/avatar.png",    },
    {
      id: 3,
      title: "Name",
      description: "Description",
      image: "../../public/avatar.png",    },
    {
      id: 4,
      title: "Name",
      description: "Description",
      image: "../../public/avatar.png",    },
  ])

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
  ])

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  // const getNotificationStyles = (type) => {
  //   switch (type) {
  //     case "completed":
  //       return "bg-[#152619]"
  //     case "ongoing":
  //       return "bg-[#1B2236]"
  //     case "canceled":
  //       return "bg-[#261515]"
  //     default:
  //       return "bg-gray-800"
  //   }
  // }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] p-6">
    {/* Main Members Section */}
    <div className="flex-1 min-w-0 mr-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <button className="bg-[#FF843E] text-white px-10 py-2 rounded-full text-sm">
          + Add a member
        </button>
      </div>

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
                    <p className="text-gray-400 text-sm">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 bg-black rounded-full py-1.5 px-8 hover:text-white text-sm">
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

    {/* Notifications Section */}
    <div className="lg:w-80 md:w-full sm:w-full w-full shrink-0 bg-[#181818] p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Notification</h2>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-gray-800 rounded-xl p-4 relative">
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
            <h3 className="text-white font-medium capitalize mb-2">
              {notification.heading}
            </h3>
            <p className="text-gray-400 text-sm">{notification.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

