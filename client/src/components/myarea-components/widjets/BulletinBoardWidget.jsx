/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react"
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import Modal from "../bulletin-board-widjet-components/Modal"


export const BulletinBoardWidget = () => {
  const [bulletinPosts, setBulletinPosts] = useState([
    {
      id: 1,
      title: "Welcome to Our Studio!",
      content: "We're excited to announce our new fitness programs starting next month. Stay tuned for more updates!",
      category: "staff",
      date: "2024-01-15",
      visibility: "Staff",
      status: "Active"
    },
    {
      id: 2,
      title: "Holiday Schedule",
      content: "Please note our modified hours during the holiday season. The studio will close early on December 24th.",
      category: "members",
      date: "2024-01-10",
      visibility: "Members",
      status: "Active"
    },
    {
      id: 3,
      title: "New Equipment Arrival",
      content: "We've added new cardio machines in section B. Members are welcome to try them out!",
      category: "members",
      date: "2024-01-08",
      visibility: "Members",
      status: "Active"
    }
  ])

  const [filter, setFilter] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [dropdownOpenId, setDropdownOpenId] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "Members",
    status: "Active"
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on dropdown button or dropdown menu
      const isDropdownClick = event.target.closest('[data-dropdown-button]') ||
        event.target.closest('[data-dropdown-menu]');

      if (!isDropdownClick) {
        setDropdownOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter posts based on category
  const getFilteredPosts = () => {
    if (filter === "all") {
      return bulletinPosts
    }
    return bulletinPosts.filter(post => post.category === filter)
  }

  // Handle create new post
  const handleCreatePost = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all fields")
      return
    }

    const newPost = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      category: formData.visibility.toLowerCase().includes("staff") ? "staff" : "members",
      date: new Date().toISOString().split('T')[0],
      visibility: formData.visibility,
      status: formData.status
    }

    setBulletinPosts(prev => [newPost, ...prev])
    setShowCreateModal(false)
    setFormData({ title: "", content: "", visibility: "Members", status: "Active" })
    console.log("Post created successfully!")
  }

  // Handle edit post
  const handleEditPost = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all fields")
      return
    }

    setBulletinPosts(prev =>
      prev.map(post =>
        post.id === selectedPost.id
          ? {
            ...post,
            title: formData.title,
            content: formData.content,
            visibility: formData.visibility,
            status: formData.status,
            category: formData.visibility.toLowerCase().includes("staff") ? "staff" : "members"
          }
          : post
      )
    )

    setShowEditModal(false)
    setSelectedPost(null)
    setFormData({ title: "", content: "", visibility: "Members", status: "Active" })
    console.log("Post updated successfully!")
  }

  // Handle delete post
  const handleDeletePost = () => {
    setBulletinPosts(prev => prev.filter(post => post.id !== selectedPost.id))
    setShowDeleteModal(false)
    setSelectedPost(null)
    console.log("Post deleted successfully!")
  }

  // Open edit modal
  const openEditModal = (post, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      visibility: post.visibility,
      status: post.status
    })
    setShowEditModal(true)
    setDropdownOpenId(null)
  }

  // Open delete modal
  const openDeleteModal = (post, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPost(post)
    setShowDeleteModal(true)
    setDropdownOpenId(null)
  }

  // Open create modal
  const openCreateModal = () => {
    setFormData({ title: "", content: "", visibility: "Members", status: "Active" })
    setShowCreateModal(true)
  }

  // Toggle dropdown
  const toggleDropdown = (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpenId(dropdownOpenId === postId ? null : postId);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
      {/* Header with + icon */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Bulletin Board</h2>
        <button
          onClick={openCreateModal}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
          title="Add New Post"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Filter */}
      <div className="relative">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 bg-black rounded-xl text-white text-sm cursor-pointer"
        >
          <option value="all">All Posts</option>
          <option value="staff">Staff Only</option>
          <option value="members">Members Only</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto max-h-60 custom-scrollbar pr-1 mt-2">
        <div className="space-y-2">
          {getFilteredPosts().length > 0 ? (
            getFilteredPosts().slice(0, 3).map((post) => (
              <div key={post.id} className="p-3 bg-black rounded-xl relative ">
                <div className="absolute top-3 right-3">
                  <button
                    data-dropdown-button
                    onClick={(e) => toggleDropdown(post.id, e)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {dropdownOpenId === post.id && (
                    <div
                      data-dropdown-menu
                      className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px] border border-gray-600"
                    >
                      <button
                        onClick={(e) => openEditModal(post, e)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg flex items-center gap-2 transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(post, e)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="pr-8">
                  <h3 className="font-semibold text-sm">{post.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-zinc-500 capitalize">{post.category}</span>
                    <span className="text-xs text-zinc-500">{post.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-sm">No posts found</p>
            </div>
          )}
        </div>
      </div>

      {/* See All Link */}
      {getFilteredPosts().length > 0 && (
        <div className="flex justify-center pt-2">
          <button className="text-sm text-white hover:underline">
            See all
          </button>
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Post">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              placeholder="Enter post title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
              placeholder="Write your post content here..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="Members">Members</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              className="flex-1 bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Create Post
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Post">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="Members">Members</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-600 text-sm cursor-pointer hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditPost}
              className="flex-1 bg-blue-600 text-sm cursor-pointer hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Post">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              Do you really want to delete "{selectedPost?.title}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 text-sm cursor-pointer bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePost}
              className="flex-1 text-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Delete Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BulletinBoardWidget