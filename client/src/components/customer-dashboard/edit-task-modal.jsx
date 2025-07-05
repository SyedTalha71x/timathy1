/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const EditTaskModal = ({
  task,
  onClose,
  onUpdateTask,
  configuredTags = [],
}) => {
  // Initialize the task data, converting single assignee/role to arrays if needed
  const [editedTask, setEditedTask] = useState({
    ...task,
    dueTime: task.dueTime || "",
  });
  
  // Determine assignment type based on which array has items
  const [assignmentType, setAssignmentType] = useState(
    task.assignees?.length > 0 || task.assignee ? "assignee" : "role"
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedTask.dueDate) {
      toast.error("Task not updated. You must add a due date.");
      return;
    }

    if (onUpdateTask) {
      const updatedTask = {
        ...editedTask,
        // Clear the array that's not being used
        assignees: assignmentType === "assignee" ? editedTask.assignees : [],
        roles: assignmentType === "role" ? editedTask.roles : [],
        // Include these for backward compatibility
        assignee: assignmentType === "assignee" ? editedTask.assignees[0] || "" : "",
        role: assignmentType === "role" ? editedTask.roles[0] || "" : "",
      };
      onUpdateTask(updatedTask);
      toast.success("Task has been updated successfully!");

      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      console.error("onUpdateTask function is not provided!");
      toast.error("Something went wrong. Please try again.");
    }
  };


  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value === "") return;
    
    setEditedTask((prev) => ({
      ...prev,
      tags: prev.tags.includes(value)
        ? prev.tags.filter((tag) => tag !== value)
        : [...prev.tags, value],
    }));
  };
  

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-[#181818] rounded-xl w-[500px] p-6">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-white text-lg open_sans_font_700 font-semibold">Edit task</h2>
            <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 custom-scrollbar max-h-[calc(100vh-180px)] overflow-y-auto"
          >
            <div>
              <label className="text-sm text-gray-200">Task Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200">Task Description</label>
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                className="w-full bg-[#101010] resize-none mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                rows={3}
              />
            </div>

            
            <div>
              <label className="text-sm text-gray-200">Tags</label>
              <div className="relative">
                <select
                  value=""
                  onChange={handleTagChange}
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                >
                  <option value="">Select Tags</option>
                  {configuredTags.map((tag) => (
                    <option
                      key={tag}
                      value={tag}
                      className={
                        editedTask.tags.includes(tag) ? "bg-[#3F74FF]" : ""
                      }
                    >
                      {tag} {editedTask.tags.includes(tag) ? "✓" : ""}
                    </option>
                  ))}
                </select>
                {editedTask.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editedTask.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#3F74FF] text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setEditedTask((prev) => ({
                              ...prev,
                              tags: prev.tags.filter((t) => t !== tag),
                            }))
                          }
                          className="hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200">Due Date</label>
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, dueDate: e.target.value })
                  }
                  className="w-full bg-[#101010] white-calendar-icon mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-200">
                  Due Time (Optional)
                </label>
                <input
                  type="time"
                  value={editedTask.dueTime}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, dueTime: e.target.value })
                  }
                  className="w-full bg-[#101010] white-calendar-icon mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>
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
};

export default EditTaskModal;