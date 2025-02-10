/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

const assignees = ["Jack", "Jane", "John", "Jessica"]
const roles = ["Trainer", "Manager", "Developer", "Designer"]

export default function AddTaskModal({ onClose, onAddTask }) {
  const [step, setStep] = useState(1)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    role: "",
    tags: [],
    dueDate: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newTask.dueDate) {
      toast.error("Task not added. You must add a due date.")
      return
    }

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      status: "ongoing",
    }

    onAddTask(taskToAdd)
    toast.success("Task has been added successfully!")
    
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div>
              <label className="text-sm text-gray-200">Assignee</label>
              <select
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
              >
                <option value="">Select Assignee</option>
                {assignees.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-200">Role</label>
              <select
                value={newTask.role}
                onChange={(e) => setNewTask({ ...newTask, role: e.target.value })}
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 cursor-pointer"
              disabled={!newTask.assignee || !newTask.role}
            >
              Next
            </button>
          </>
        )
      case 2:
        return (
          <>
            <div>
              <label className="text-sm text-gray-200">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-200">Task Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm text-gray-200">Tags (comma-separated)</label>
              <input
                type="text"
                value={newTask.tags.join(", ")}
                onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(",").map((tag) => tag.trim()) })}
                placeholder="Tags"
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 cursor-pointer"
                disabled={!newTask.title}
              >
                Next
              </button>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div>
              <label className="text-sm text-gray-200">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 cursor-pointer"
              >
                Save
              </button>
            </div>
          </>
        )
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <div className="fixed inset-0 open_sans_font w-screen h-screen bg-black/50 flex items-center p-3 sm:p-4 md:p-6 justify-center z-[1000]">
        <div className="bg-[#181818] rounded-2xl w-full max-w-md p-4 sm:p-5 md:p-6 lg:p-6 relative">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-white text-lg open_sans_font_700 font-semibold">Add task</h2>
            <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form className="space-y-4">{renderStep()}</form>
        </div>
      </div>
    </>
  )
}