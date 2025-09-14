/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from "react"

const BulletinBoard = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Welcome to the Bulletin Board",
      content: "This is where important announcements and information will be shared with team members and staff.",
      visibility: "Members",
      status: "Active",
      author: "Admin",
      createdAt: new Date().toLocaleDateString(),
      createdBy: "current-user",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [filterVisibility, setFilterVisibility] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "Members",
    status: "Active",
  })

  const handleCreatePost = () => {
    if (formData.title.trim() && formData.content.trim()) {
      const newPost = {
        id: Date.now(),
        ...formData,
        author: "Current User",
        createdAt: new Date().toLocaleDateString(),
        createdBy: "current-user",
      }
      setPosts([newPost, ...posts])
      setFormData({ title: "", content: "", visibility: "Members", status: "Active" })
      setShowCreateModal(false)
    }
  }

  const handleEditPost = () => {
    if (formData.title.trim() && formData.content.trim()) {
      setPosts(posts.map((post) => (post.id === selectedPost.id ? { ...post, ...formData } : post)))
      setShowEditModal(false)
      setSelectedPost(null)
    }
  }

  const handleDeletePost = () => {
    setPosts(posts.filter((post) => post.id !== selectedPost.id))
    setShowDeleteModal(false)
    setSelectedPost(null)
  }

  const openEditModal = (post) => {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      visibility: post.visibility,
      status: post.status,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (post) => {
    setSelectedPost(post)
    setShowDeleteModal(true)
  }

  const filteredPosts = posts.filter((post) => {
    const visibilityMatch = filterVisibility === "All" || post.visibility === filterVisibility
    const statusMatch = filterStatus === "All" || post.status === filterStatus
    return visibilityMatch && statusMatch
  })

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#1C1C1C] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  } 

  return (
    <div className="min-h-screen rounded-3xl md:p-5 p-3 bg-[#1C1C1C] text-white">
      <div className="">
        <div className="">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
            
              <div>
                <h1 className="text-2xl font-bold text-white">Bulletin Board</h1>
              </div>
            </div>
            <button
  onClick={() => setShowCreateModal(true)}
  className="bg-orange-500 text-sm cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
  <span className="hidden sm:inline">Create Post</span>
</button>

          </div>
        </div>
      </div>

      <div className="md:p-5 p-3 mt-10">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 text-sm">
            <label className="block text-sm font-medium text-gray-300 mb-2 ">Filter by Visibility</label>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
            >
              <option value="All">All Visibility</option>
              <option value="Members">Members</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2 ">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#181818] border outline-none border-slate-300/10 text-white rounded-xl px-4 py-2 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:shadow-xl hover:border-gray-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 text-balance">{post.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                      {post.visibility}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-300 mb-4 text-sm text-pretty leading-relaxed">{post.content}</p>

              {/* Post Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-400">By {post.author}</p>
                  <p>{post.createdAt}</p>
                </div>
                {post.createdBy === "current-user" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-gray-800"
                      title="Edit post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(post)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-gray-800"
                      title="Delete post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-3">No posts found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or create a new post</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </button>
          </div>
        )}
      </div>

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
              className="flex-1 bg-blue-600 text-sm cursor-pointer  text-white py-3 px-4 rounded-lg font-medium transition-colors"
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
              className="flex-1 bg-blue-600 text-sm cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors"
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

export default BulletinBoard
