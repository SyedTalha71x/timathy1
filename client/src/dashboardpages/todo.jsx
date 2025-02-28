/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { X, Bell, Plus, ChevronDown } from "lucide-react";
import AddTaskModal from "../components/add-task-modal";
import TaskItem from "../components/task-item";
import Notification from "../components/notification";

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ongoing");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      description: "This is a short description for Task 1",
      assignee: "Jack",
      role: "Trainer",
      tags: ["Important", "Urgent"],
      status: "ongoing",
      dueDate: "2023-06-20",
    },
    {
      id: 2,
      title: "Task 2",
      description: "This is a short description for Task 2",
      assignee: "Jane",
      role: "Manager",
      tags: ["Meeting"],
      status: "ongoing",
      dueDate: "2023-06-25",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "completed",
      message: "Task 'Prepare weekly report' has been completed",
    },
    {
      id: 2,
      type: "ongoing",
      message: "New task 'Client meeting' has been assigned to you",
    },
    {
      id: 3,
      type: "canceled",
      message: "Task 'Review project proposal' has been canceled",
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskRemove = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing': return 'bg-yellow-600 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'canceled': return 'bg-red-600 text-white';
      default: return '';
    }
  };

  const filteredTasks = tasks.filter((task) => task.status === activeFilter);

  // const getStatusBgColor = (status) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'bg-[#152619]';
  //     case 'ongoing':
  //       return 'bg-[#1B2236]';
  //     case 'canceled':
  //       return 'bg-[#261515]';
  //     default:
  //       return 'bg-[#000000]';
  //   }
  // };

  return (
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden">
      <div className="flex-1 p-4 sm:p-6">
        <div className="pb-16 sm:pb-24 lg:pb-36">
          <div className="flex justify-between items-start mb-6 gap-4">
            <h1 className="text-2xl font-bold text-white oxanium_font">
              To-Do
            </h1>
            <div className="flex flex-col justify-end items-end  gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF843E] cursor-pointer text-white px-4 sm:px-10 py-2 rounded-xl text-sm flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="open_sans_font">Add task</span>
              </button>
              <div className="relative status-dropdown">
      <button
        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
        className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl text-sm ${getStatusColor(activeFilter)} border border-slate-300/30`}
      >
        <span className="capitalize">{activeFilter}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform cursor-pointer duration-500 ${
            isStatusDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isStatusDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg backdrop-blur-3xl bg-[#2F2F2F]/40 shadow-lg z-50 border border-slate-300/30">
          {["ongoing", "completed", "canceled"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveFilter(status);
                setIsStatusDropdownOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm ${getStatusColor(status)}`}
            >
              <span className="capitalize">{status}</span>
            </button>
          ))}
        </div>
      )}
    </div>
              {/* <button
                onClick={() => setIsNotificationOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Bell size={20} />
              </button> */}
            </div>
          </div>

          <div className="bg-black rounded-xl open_sans_font p-3 mt-4 sm:mt-8 lg:mt-16">
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={handleTaskStatusChange}
                    onUpdate={handleTaskUpdate}
                    onRemove={handleTaskRemove}
                  />
                ))}
              </div>
            ) : (
              <div className="text-red-500 text-center py-4">
                No {activeFilter} tasks yet
              </div>
            )}
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
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
