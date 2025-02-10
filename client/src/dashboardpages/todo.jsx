/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { X, Bell, Plus } from "lucide-react";
import AddTaskModal from "../components/add-task-modal";
import TaskItem from "../components/task-item";
import Notification from "../components/notification";

export default function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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

  const filteredTasks = tasks.filter((task) => task.status === activeFilter);

  return (
    <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative min-h-screen overflow-hidden">
      <div className="flex-1 p-4 sm:p-6">
        <div className="pb-16 sm:pb-24 lg:pb-36">
          <div className="flex  justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-white oxanium_font">
              To-Do
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF843E] cursor-pointer text-white px-4 sm:px-10 py-2 rounded-xl text-sm flex items-center gap-2"
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

          <div className="mb-4 flex flex-wrap gap-2 cursor-pointer">
            {["ongoing", "completed", "canceled"].map((filter) => {
              const bgColor =
                filter === "completed"
                  ? "bg-[#152619] border border-slate-300/30 cursor-pointer"
                  : filter === "ongoing"
                  ? "bg-[#1B2236] border border-slate-300/30 cursor-pointer"
                  : filter === "canceled"
                  ? "bg-[#261515] border border-slate-300/30 cursor-pointer"
                  : "bg-gray-800";

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 cursor-pointer rounded-xl text-sm ${
                    activeFilter === filter
                      ? `${bgColor} text-white`
                      : "bg-[#2F2F2F] text-gray-300"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              );
            })}
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
