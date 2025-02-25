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
  const [editedTask, setEditedTask] = useState({
    ...task,
    dueTime: task.dueTime || "",
  });
  const [assignmentType, setAssignmentType] = useState(
    task.assignee ? "assignee" : "role"
  );
  const assignees = ["John Doe", "Jane Smith", "Peter Jones"]; // Example assignees
  const roles = ["Developer", "Designer", "Manager"]; // Example roles

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedTask.dueDate) {
      toast.error("Task not updated. You must add a due date.");
      return;
    }

    if (onUpdateTask) {
      const updatedTask = {
        ...editedTask,
        assignee: assignmentType === "assignee" ? editedTask.assignee : "",
        role: assignmentType === "role" ? editedTask.role : "",
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

  const handleAssignmentTypeChange = (type) => {
    setAssignmentType(type);
    setEditedTask((prev) => ({
      ...prev,
      assignee: "",
      role: "",
    }));
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
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
      <div className="fixed inset-0 bg-black/50  flex justify-center items-center z-50">
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
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 mb-2">
                Assignment Type
              </label>
              <div className="flex gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => handleAssignmentTypeChange("assignee")}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    assignmentType === "assignee"
                      ? "bg-[#3F74FF] text-white"
                      : "bg-[#2F2F2F] text-gray-200"
                  }`}
                >
                  Assign to Person
                </button>
                <button
                  type="button"
                  onClick={() => handleAssignmentTypeChange("role")}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    assignmentType === "role"
                      ? "bg-[#3F74FF] text-white"
                      : "bg-[#2F2F2F] text-gray-200"
                  }`}
                >
                  Assign to Role
                </button>
              </div>
            </div>
            {assignmentType === "assignee" && (
              <div>
                <label className="text-sm text-gray-200">Assignee</label>
                <select
                  value={editedTask.assignee}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, assignee: e.target.value })
                  }
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                  required
                >
                  <option value="">Select Assignee</option>
                  {assignees.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {assignmentType === "role" && (
              <div>
                <label className="text-sm text-gray-200">Role</label>
                <select
                  value={editedTask.role}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, role: e.target.value })
                  }
                  className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
