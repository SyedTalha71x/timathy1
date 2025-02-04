import { useState } from "react"
import { Menu, X, Search, ThumbsUp } from "lucide-react"
import ProfileAvatar from "../../public/Rectangle 1.png"
import { HiDotsVertical } from "react-icons/hi"

export default function Messages() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)

  return (
    <div className="relative flex h-screen bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {isMessagesOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMessagesOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[380px] w-full rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${
          isMessagesOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-black z-40`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl oxanium_font">Messages</h1>
            <button onClick={() => setIsMessagesOpen(false)} className="md:hidden text-gray-400 hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 items-center open_sans_font justify-between mb-4">
            <div className="flex gap-2">
              <button className="px-6 py-2 text-sm bg-white text-black rounded-xl">All</button>
              <button className="px-6 py-2 text-sm text-gray-200 border border-slate-300 hover:bg-gray-800 rounded-xl">
                Unread
              </button>
            </div>

            <div>
              <HiDotsVertical className="w-6 h-6 text-gray-200 cursor-pointer" />
            </div>
          </div>

          <div className="relative mb-4 open_sans_font">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-slate-200 bg-black rounded-xl text-sm outline-none"
            />
            <svg
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {[
              { name: "Jennifer Markus", time: "Today | 05:30 PM", active: true, logo: ProfileAvatar },
              { name: "Group 1", time: "Today | 05:30 PM", logo: ProfileAvatar },
              { name: "Jerry Haffer", time: "Today | 05:30 PM", verified: true, logo: ProfileAvatar },
              { name: "David Eison", time: "Today | 05:30 PM", logo: ProfileAvatar },
              { name: "Mary Freund", time: "Today | 05:30 PM", logo: ProfileAvatar },
            ].map((chat, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-lg ${
                  chat.active ? "bg-gray-800" : "hover:bg-gray-800/50"
                } cursor-pointer`}
              >
                <div>
                  <img src={chat.logo || "/placeholder.svg"} className="h-10 w-10 rounded-full" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate">{chat.name}</span>
                      {chat.verified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <button className="text-blue-500 hover:text-blue-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <p className="truncate">Hey! Did you finish the Hi-Fi wireframes for Beta app design?</p>
                    <span className="flex-shrink-0">{chat.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 open_sans_font cursor-pointer">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMessagesOpen(true)} className="md:hidden text-gray-400 hover:text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <img src={ProfileAvatar || "/placeholder.svg"} className="h-12 w-12 rounded-full object-center" alt="" />
            </div>
            <span className="font-medium ">Jennifer Markus</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-blue-500 hover:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            <div>
              <Search className="w-5 h-5 " />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"></div>
              <div className="bg-black rounded-2xl text-sm p-4 max-w-md">
                <p>Oh, hello! All perfectly.</p>
                <p>I will check it and get back to you soon.</p>
              </div>
              <span className="text-sm text-gray-400">04:45 PM</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <div className="flex flex-col gap-1 items-end">
              <div className="bg-[#3F74FF] rounded-2xl p-4 text-sm max-w-md">
                <p>Yes, hello! All perfectly.</p>
                <p>I will check it and get back to you soon.</p>
              </div>
              <span className="text-sm text-gray-400">04:45 PM</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 bg-black rounded-lg p-2">
            <button className="p-2 hover:bg-gray-700 rounded-full flex-shrink-0">
              <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent focus:outline-none text-sm min-w-0"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="p-2 hover:bg-gray-700 rounded-full">
                <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-full">
                <ThumbsUp className="w-5 h-5 text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

