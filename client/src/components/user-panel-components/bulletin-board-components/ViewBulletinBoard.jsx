/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function ViewBulletinModal({ isOpen, onClose, post, allTags }) {
  // Add styles for rich text content
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .view-rich-content p {
        margin: 0 0 0.5em 0;
      }
      .view-rich-content p:last-child {
        margin-bottom: 0;
      }
      .view-rich-content ul, .view-rich-content ol {
        margin: 0.5em 0;
        padding-left: 1.5em;
      }
      .view-rich-content li {
        margin: 0.15em 0;
      }
      .view-rich-content strong {
        font-weight: 600;
        color: #fff;
      }
      .view-rich-content em {
        font-style: italic;
      }
      .view-rich-content h1 {
        font-size: 1.5em;
        font-weight: 600;
        margin: 0.3em 0;
        color: #fff;
      }
      .view-rich-content h2 {
        font-size: 1.25em;
        font-weight: 600;
        margin: 0.3em 0;
        color: #fff;
      }
      .view-rich-content h3 {
        font-size: 1.1em;
        font-weight: 600;
        margin: 0.3em 0;
        color: #fff;
      }
      .view-rich-content a {
        color: #f97316;
        text-decoration: underline;
      }
      .view-rich-content a:hover {
        color: #fb923c;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  if (!isOpen) return null

  const getTagById = (tagId) => {
    return allTags?.find((tag) => tag.id === tagId)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - just close button */}
        <div className="flex items-center justify-end p-4 border-b border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Cover Image */}
          {post?.image && (
            <div className="relative rounded-xl overflow-hidden border border-gray-700 mb-4 bg-black aspect-video">
              <img 
                src={post.image} 
                alt="Post cover" 
                className="w-full h-full object-contain" 
              />
            </div>
          )}

          {/* Title - below image */}
          <h2 className="text-xl font-semibold text-white mb-3">{post?.title || "Post"}</h2>

          {/* Custom Tags */}
          {post?.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.tags.map((tagId) => {
                const tag = getTagById(tagId)
                return tag ? (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Content - Rich Text */}
          <div className="bg-[#181818] rounded-xl p-4">
            <div 
              className="text-gray-300 text-sm leading-normal view-rich-content"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
