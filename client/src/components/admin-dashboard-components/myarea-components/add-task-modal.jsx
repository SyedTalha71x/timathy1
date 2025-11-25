/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { X, ChevronDown, Tag, Bell, Repeat } from "lucide-react"
import { useState } from "react"
import { toast, Toaster } from "react-hot-toast"

const AddTaskModal = ({ onClose, onAddTask, configuredTags = [] }) => {
    const [newTask, setNewTask] = useState({
        title: "",

        tags: [],
        dueDate: "",
        dueTime: "",
    })


    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)

    const [reminder, setReminder] = useState("")
    const [showCustomReminder, setShowCustomReminder] = useState(false)
    const [customValue, setCustomValue] = useState("")
    const [customUnit, setCustomUnit] = useState("Minutes")

    const [repeat, setRepeat] = useState("")
    const [repeatEndType, setRepeatEndType] = useState("never")
    const [repeatEndDate, setRepeatEndDate] = useState("")
    const [repeatOccurrences, setRepeatOccurrences] = useState("")


    const handleSubmit = (e) => {
        e.preventDefault()

        if (!newTask.title.trim()) {
            toast.error("Please enter a task description")
            return
        }

        if (!newTask.dueDate) {
            toast.error("You must add a due date.")
            return
        }

        // Build repeat settings only when repeat is chosen
        const builtRepeatSettings =
            repeat && repeat !== ""
                ? {
                    frequency: repeat.toLowerCase(), // daily | weekly | monthly
                    endType: repeatEndType, // never | onDate | after
                    endDate: repeatEndType === "onDate" ? repeatEndDate : "",
                    occurrences: repeatEndType === "after" ? Number(repeatOccurrences) || "" : "",
                }
                : undefined

        // Generate a unique ID for the new task
        const taskId = Date.now()

        const taskToAdd = {
            id: taskId,
            title: newTask.title,
            assignees: newTask.assignees,
            roles: newTask.roles,
            tags: newTask.tags,
            dueDate: newTask.dueDate,
            dueTime: newTask.dueTime,
            status: "ongoing",
            category: "general",
            isPinned: false,
            dragVersion: 0,
            reminder,
            customReminderValue: reminder === "Custom" ? customValue : "",
            customReminderUnit: reminder === "Custom" ? customUnit : "",
            repeatSettings: builtRepeatSettings,
            createdAt: new Date().toISOString(),
        }

        if (onAddTask) {
            onAddTask(taskToAdd)
            onClose()
            toast.success("Task has been added successfully!")
        }
    }



    const handleTagToggle = (tagName) => {
        setNewTask((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagName) ? prev.tags.filter((tag) => tag !== tagName) : [...prev.tags, tagName],
        }))
    }

    const handleClearForm = () => {
        setNewTask({
            title: "",

            tags: [],
            dueDate: "",
            dueTime: "",
        })
        setReminder("")
        setRepeat("")
        setRepeatEndType("never")
        setRepeatEndDate("")
        setRepeatOccurrences("")
        setCustomValue("")
        setCustomUnit("Minutes")
        setShowCustomReminder(false)
    }

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
                <div className="bg-[#181818] rounded-xl w-[500px] max-h-[90vh] p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-white text-lg font-semibold">Add New Task</h2>
                        <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar pr-2"
                    >
                        <div>
                            <label className="text-sm text-gray-200">Task Description</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                                placeholder="Enter task title"
                                required
                            />
                        </div>



                        <div>
                            <label className="text-sm text-gray-200">Add Tags</label>
                            <div className="relative mt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} />
                                        <span>{newTask.tags.length > 0 ? `${newTask.tags.length} tags selected` : "Select tags"}</span>
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform ${isTagDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isTagDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700 z-50 max-h-48 overflow-y-auto">
                                        {configuredTags.map((tag) => {
                                            const isSelected = newTask.tags.includes(tag.name)
                                            return (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => handleTagToggle(tag.name)}
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                                        <span className="text-gray-200">{tag.name}</span>
                                                    </div>
                                                    {isSelected && <span className="text-green-400">✓</span>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {newTask.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {newTask.tags.map((tagName) => {
                                        const tag = configuredTags.find((t) => t.name === tagName)
                                        return (
                                            <span
                                                key={tagName}
                                                className="text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                                                style={{ backgroundColor: tag?.color || "#3F74FF" }}
                                            >
                                                {tagName}
                                                <button type="button" onClick={() => handleTagToggle(tagName)} className="hover:text-gray-200">
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-200">Due Date</label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-200">Due Time (Optional)</label>
                                <input
                                    type="time"
                                    value={newTask.dueTime}
                                    onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                                    className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-2 space-y-2">
                            <label className="text-sm text-gray-200 flex items-center gap-2">
                                <Bell size={16} className="text-gray-400" />
                                Reminder
                            </label>
                            <select
                                value={reminder}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setReminder(val)
                                    setShowCustomReminder(val === "Custom")
                                }}
                                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                            >
                                <option value="">None</option>
                                <option value="On time">On time</option>
                                <option value="5 minutes before">5 minutes before</option>
                                <option value="15 minutes before">15 minutes before</option>
                                <option value="30 minutes before">30 minutes before</option>
                                <option value="1 hour before">1 hour before</option>
                                <option value="1 day before">1 day before</option>
                                <option value="Custom">Custom</option>
                            </select>

                            {showCustomReminder && (
                                <div className="flex items-center gap-2 ml-1">
                                    <input
                                        type="number"
                                        min="1"
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        className="bg-[#101010] text-white px-3 py-2 rounded-xl text-sm w-24 outline-none"
                                        placeholder="30"
                                    />
                                    <select
                                        value={customUnit}
                                        onChange={(e) => setCustomUnit(e.target.value)}
                                        className="bg-[#101010] text-white px-3 py-2 rounded-xl text-sm outline-none"
                                    >
                                        <option value="Minutes">Minutes</option>
                                        <option value="Hours">Hours</option>
                                        <option value="Days">Days</option>
                                        <option value="Weeks">Weeks</option>
                                    </select>
                                    <span className="text-sm text-gray-400">ahead</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-3 space-y-2">
                            <label className="text-sm text-gray-200 flex items-center gap-2">
                                <Repeat size={16} className="text-gray-400" />
                                Repeat
                            </label>
                            <select
                                value={repeat}
                                onChange={(e) => setRepeat(e.target.value)}
                                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none"
                            >
                                <option value="">Never</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>

                            {repeat && (
                                <div className="ml-1 space-y-2">
                                    <div className="text-sm text-gray-200">Ends:</div>
                                    <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="repeatEnd"
                                            value="never"
                                            checked={repeatEndType === "never"}
                                            onChange={() => setRepeatEndType("never")}
                                            className="form-radio h-3 w-3 text-[#FF843E]"
                                        />
                                        Never
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="repeatEnd"
                                            value="onDate"
                                            checked={repeatEndType === "onDate"}
                                            onChange={() => setRepeatEndType("onDate")}
                                            className="form-radio h-3 w-3 text-[#FF843E]"
                                        />
                                        On date:
                                        <input
                                            type="date"
                                            value={repeatEndDate}
                                            onChange={(e) => setRepeatEndDate(e.target.value)}
                                            onClick={() => setRepeatEndType("onDate")}
                                            className="bg-[#101010] text-white px-3 py-2 rounded-xl text-xs ml-1 outline-none"
                                        />
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="repeatEnd"
                                            value="after"
                                            checked={repeatEndType === "after"}
                                            onChange={() => setRepeatEndType("after")}
                                            className="form-radio h-3 w-3 text-[#FF843E]"
                                        />
                                        After
                                        <input
                                            type="number"
                                            min="1"
                                            value={repeatOccurrences}
                                            onChange={(e) => setRepeatOccurrences(e.target.value)}
                                            onClick={() => setRepeatEndType("after")}
                                            className="w-20 bg-[#101010] text-white px-3 py-2 rounded-xl text-xs ml-1 outline-none"
                                        />
                                        occurrences
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    handleClearForm()
                                    onClose()
                                }}
                                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90"
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2F2F2F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
        </>
    )
}

export default AddTaskModal