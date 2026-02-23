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
        color: var(--color-content-primary);
      }
      .view-rich-content em {
        font-style: italic;
      }
      .view-rich-content h1 {
        font-size: 1.5em;
        font-weight: 600;
        margin: 0.3em 0;
        color: var(--color-content-primary);
      }
      .view-rich-content h2 {
        font-size: 1.25em;
        font-weight: 600;
        margin: 0.3em 0;
        color: var(--color-content-primary);
      }
      .view-rich-content h3 {
        font-size: 1.1em;
        font-weight: 600;
        margin: 0.3em 0;
        color: var(--color-content-primary);
      }
      .view-rich-content a {
        color: var(--color-primary);
        text-decoration: underline;
      }
      .view-rich-content a:hover {
        color: var(--color-primary-hover);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - just close button */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors p-1 flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Cover Image */}
          {post?.image && (
            <div className="relative rounded-xl overflow-hidden border border-border mb-4 bg-surface-dark aspect-video">
              <img 
                src={post.image} 
                alt="Post cover" 
                className="w-full h-full object-contain" 
                draggable="false"
              />
            </div>
          )}

          {/* Title - below image */}
          <h2 className="text-xl font-semibold text-content-primary mb-3">{post?.title || "Post"}</h2>

          {/* Custom Tags */}
          {post?.tags && post.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-4">
              {post.tags.map((tagId) => {
                const tag = getTagById(tagId)
                return tag ? (
                  <span
                    key={tag.id}
                    className="text-[10px] px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Content - Rich Text */}
          <div className="border border-border rounded-xl p-4">
            <div 
              className="text-content-secondary text-sm leading-normal view-rich-content"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
