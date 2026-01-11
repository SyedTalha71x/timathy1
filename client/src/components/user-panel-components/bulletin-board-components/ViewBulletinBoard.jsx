/* eslint-disable react/prop-types */
import { useState } from 'react'; // Add this import
import { MdOutlineZoomOutMap } from 'react-icons/md';

export default function ViewBulletinModal({ isOpen, onClose, post, allTags }) {
  const [expandedImage, setExpandedImage] = useState(null); // Fixed this line

  if (!isOpen) return null

  const getTagById = (tagId) => {
    return allTags?.find((tag) => tag.id === tagId)
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-xl shadow-2xl custom-scrollbar w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{post?.title || "Post"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close view post modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${post?.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"}`}
            >
              {post?.status}
            </span>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
              {post?.visibility}
            </span>
            {post?.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tagId) => {
                  const tag = getTagById(tagId)
                  return tag ? (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>

          {post?.image && (
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-auto max-h-96 object-cover" />
              <button
                onClick={() => setExpandedImage(post.image)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                title="Expand image"
              >
                <MdOutlineZoomOutMap />

              </button>
            </div>
          )}

          <div className="bg-[#181818] rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-gray-300 whitespace-pre-wrap">{post?.content}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              <p>By {post?.author}</p>
              <p>Created on {post?.createdAt}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={expandedImage || "/placeholder.svg"} alt="Expanded" className="w-full md:h-[500px] h-auto object-contain" />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}