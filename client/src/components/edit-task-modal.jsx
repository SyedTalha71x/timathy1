/* eslint-disable react/prop-types */
import { useState } from "react";
import { X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const assignees = ["Jack", "Jane", "John", "Jessica"];
const roles = ["Trainer", "Manager", "Developer", "Designer"];

export default function EditTaskModal({ task, onClose, onUpdateTask }) {
  const [editedTask, setEditedTask] = useState(task);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedTask.dueDate) {
      toast.error("Task not updated. You must add a due date.");
      return;
    }

    if (onUpdateTask) {
      onUpdateTask(editedTask);
      toast.success("Task has been updated successfully!");
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      console.error("onUpdateTask function is not provided!");
      toast.error("Something went wrong. Please try again.");
    }
  };

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
            <h2 className="text-white text-lg open_sans_font_700 font-semibold">
              Edit task
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-200">Assignee</label>
              <select
                value={editedTask.assignee}
                onChange={(e) =>
                  setEditedTask((prev) => ({ ...prev, assignee: e.target.value }))
                }
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
                value={editedTask.role}
                onChange={(e) =>
                  setEditedTask((prev) => ({ ...prev, role: e.target.value }))
                }
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
            <div>
              <label className="text-sm text-gray-200">Task Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-200">Task Description</label>
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm text-gray-200">Tags (comma-separated)</label>
              <input
                type="text"
                value={editedTask.tags.join(", ")}
                onChange={(e) =>
                  setEditedTask((prev) => ({
                    ...prev,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  }))
                }
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-200">Due Date</label>
              <input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) =>
                  setEditedTask((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}