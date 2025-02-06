import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  ThumbsUp,
  MoreVertical,
  Star,
  Mic,
  Smile,
  Clock,
} from "lucide-react";
import image1 from "../../public/Rectangle 1.png";
import image2 from "../../public/avatar3.png";

export default function Messages() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const groupDropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setActiveDropdownId(null);
      }

      if (
        chatDropdownRef.current &&
        !chatDropdownRef.current.contains(event.target)
      ) {
        setShowChatDropdown(false);
      }

      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(event.target)
      ) {
        setShowGroupDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chatList = [
    {
      name: "Jennifer Markus",
      time: "Today | 05:30 PM",
      active: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: image1,
    },
    {
      name: "Group 1",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: image2,
    },
    {
      name: "Jerry Haffer",
      time: "Today | 05:30 PM",
      verified: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: image1,
    },
    {
      name: "David Eison",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: image2,
    },
    {
      name: "Mary Freund",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: image2,
    },
  ];

  const handleNewChat = () => {
    setShowChatDropdown(true);
    setShowGroupDropdown(false);
    setActiveDropdownId(null);
  };

  const handleNewGroup = () => {
    setShowGroupDropdown(true);
    setShowChatDropdown(false);
    setActiveDropdownId(null);
  };

  return (
    <div className="relative flex h-screen bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {isMessagesOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMessagesOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[380px] w-full rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${
          isMessagesOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } bg-black z-40`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <button
              onClick={() => setIsMessagesOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-300"
              aria-label="Close messages"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 items-center justify-between mb-4">
            <div className="flex gap-2">
              <button className="px-6 py-2 text-sm bg-white text-black rounded-xl">
                All
              </button>
              <button className="px-6 py-2 text-sm text-gray-200 border border-slate-300 hover:bg-gray-800 rounded-xl">
                Unread
              </button>
            </div>

            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() =>
                  setActiveDropdownId(activeDropdownId ? null : "main")
                }
                className="p-2 hover:bg-gray-800 rounded-full"
                aria-label="More options"
              >
                <MoreVertical className="w-6 h-6 cursor-pointer text-gray-200" />
              </button>

              {activeDropdownId === "main" && (
                <div
                  ref={dropdownRef}
                  className="absolute right-5 top-5 cursor-pointer mt-1 w-32 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-lg border border-gray-800 shadow-lg overflow-hidden z-10"
                >
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                    onClick={handleNewChat}
                  >
                    New Chat
                  </button>
                  <div className="h-[1px] bg-[#BCBBBB] w-[85%] mx-auto" />
                  <button
                    className="w-full px-4 py-2 text-sm hover:bg-gray-800 text-left"
                    onClick={handleNewGroup}
                  >
                    New Group
                  </button>
                  <div className="h-[1px] bg-[#BCBBBB] w-[85%] mx-auto" />
                  <button
                    className="w-full px-4 py-2 text-sm hover:bg-gray-800 text-left"
                    onClick={() => setActiveDropdownId(null)}
                  >
                    Unread
                  </button>
                </div>
              )}

              {showChatDropdown && (
                <div
                  ref={chatDropdownRef}
                  className="absolute right-5 top-5 w-64 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-lg shadow-lg z-20 mt-2"
                >
                  <div className="p-3">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <img
                          src={image1}
                          alt="User"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">Jennifer Markus</span>
                        <input type="checkbox" className="ml-auto" />
                      </div>
                    ))}
                    <button
                      className="w-full mt-2 py-1.5 text-sm px-4 cursor-pointer bg-[#FF843E] text-white rounded-full hover:bg-orange-600"
                      onClick={() => setShowChatDropdown(false)}
                    >
                      Start chat
                    </button>
                  </div>
                </div>
              )}

              {showGroupDropdown && (
                <div
                  ref={groupDropdownRef}
                  className="absolute right-5 top-5 w-64 bg-[#2F2F2F]/10 backdrop-blur-xl rounded-lg shadow-lg z-20 mt-2"
                >
                  <div className="p-3">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <img
                          src={image1}
                          alt="User"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">Jennifer Markus</span>
                        <input type="checkbox" className="ml-auto" />
                      </div>
                    ))}
                    <button
                      className="w-full mt-2 py-1.5 text-sm px-4 cursor-pointer bg-[#FF843E] text-white rounded-full hover:bg-orange-600"
                      onClick={() => setShowGroupDropdown(false)}
                    >
                      Create Group
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 pl-10 border border-slate-200 bg-black rounded-xl text-sm outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {chatList.map((chat, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-5 border-b border-slate-700 rounded-lg ${
                  chat.active ? "bg-[#181818]" : "hover:bg-[#181818]"
                } cursor-pointer`}
              >
                <div>
                  <img
                    src={chat.logo}
                    className="h-10 w-10 rounded-full"
                    alt={`${chat.name}'s avatar`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate">{chat.name}</span>
                      {chat.verified && (
                        <div className="text-blue-500">
                          <Star className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <button className="text-blue-500 hover:text-blue-400">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <p className="truncate">{chat.message}</p>
                  </div>
                  <div className="flex mt-1 text-gray-400 items-center gap-1">
                    <Clock size={15} />
                    <span className=" text-sm text-gray-400">{chat.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMessagesOpen(true)}
              className="md:hidden text-gray-400 hover:text-gray-300"
              aria-label="Open messages"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <img
                src={image1}
                className="h-12 w-12 rounded-full object-center"
                alt="Current chat avatar"
              />
            </div>
            <span className="font-medium">Jennifer Markus</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-blue-500 hover:text-blue-400"
              aria-label="Star conversation"
            >
              <Star className="w-5 h-5" />
            </button>
            <button
              className="hover:text-gray-300"
              aria-label="Search conversation"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
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
            <button
              className="p-2 hover:bg-gray-700 rounded-full"
              aria-label="Add emoji"
            >
              <Smile className="w-5 h-5 text-gray-200" />
            </button>
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent focus:outline-none text-sm min-w-0"
            />
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-gray-700 rounded-full"
                aria-label="Voice message"
              >
                <Mic className="w-5 h-5 text-gray-200" />
              </button>
              <button
                className="p-2 hover:bg-gray-700 rounded-full"
                aria-label="Send thumbs up"
              >
                <ThumbsUp className="w-5 h-5 text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
