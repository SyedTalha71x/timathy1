/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Search,
  MoreVertical,
  Smile,
  Clock,
  Send,
  Calendar,
  Mail,
  MailCheck,
  MailOpen,
  Archive,
  Eye,
  EyeOff,
  User,
  Building2,
  Settings,
  Pin,
  PinOff,
  Check,
  CheckCheck,
  FolderPlus,
  FileText,
  MessageCircle,
  Home,
  CheckSquare,
  Copy,
  Users,
  ShoppingCart,
  BadgeDollarSign,
  Reply,
  Trash2,
  XCircle,
  Inbox,
  Paperclip,
  RefreshCw,
} from "lucide-react"

import { ToastContainer, toast } from "react-toastify"
import { IoIosMegaphone } from "react-icons/io"
import CommuncationBg from "../../../public/communication-bg.svg"
import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { WysiwygEditor } from "../../components/shared/WysiwygEditor"

import { appointmentNotificationTypesNew, appointmentsNew, companyChatListNew, emailListNew, emailTemplatesNew, memberChatListNew, memberContingentDataNew, memberHistoryNew, membersNew, memberRelationsNew, preConfiguredMessagesNew, settingsNew, staffChatListNew, appointmentTypesData, freeAppointmentsData, availableMembersLeadsMain, staffData, getLastMessage, getLastMessageContent, getLastMessageTime, getUnreadCount, isChatRead, getLastMessageStatus, relationOptionsMain } from "../../utils/studio-states"

import { fetchMessagesThunk, fetchStaffAllChatThunk, fetchStudioChatThunk, accessChatThunk, accessStudioChatThunk, sendMessageThunk, deleteMessageThunk, createGroupThunk, setActiveChat, receiveSocketMessage } from '../../features/communication/chatSlice'
import { socket } from '../../services/socket'
import { useDispatch, useSelector } from 'react-redux'

import CreateAppointmentModal from "../../components/shared/appointments/CreateAppointmentModal"
import BirthdayBadge from "../../components/shared/BirthdayBadge"
import EditMemberModalMain from "../../components/studio-components/members-components/EditMemberModal"
import ContingentModal from "../../components/shared/appointments/ShowContigentModal"
import AddBillingPeriodModal from "../../components/shared/appointments/AddBillingPeriodModal"
import NotifyModal from "../../components/shared/NotifyModal"
import ArchiveModal from "../../components/studio-components/communication-components/ArchiveModal"
import DraftModal from "../../components/shared/communication/DraftModal"
import SendEmailModal from "../../components/shared/communication/SendEmailModal"
import SendEmailReplyModal from "../../components/studio-components/communication-components/SendEmailReplyModal"
import BroadcastModal from "../../components/studio-components/communication-components/broadcast-modal-components/BroadcastModal"
import ShowAppointmentModal from "../../components/shared/appointments/ShowAppointmentModal"
import EditAppointmentModalMain from '../../components/shared/appointments/EditAppointmentModal'
import ViewMemberModal from "../../components/shared/members/ViewMemberModal"
import ViewStaffModal from "../../components/shared/ViewStaffModal"

// ==========================================
// HIGHLIGHTED TEXT COMPONENT - for dates/times
// ==========================================
const HighlightedText = ({ text, isUserMessage }) => {
  if (!text) return null;

  const dateTimeRegex = /(\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}:\d{2}(?:\s*(?:Uhr|AM|PM|am|pm))?|(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|(?:heute|morgen|gestern|übermorgen|today|tomorrow|yesterday))/gi;

  const parts = text.split(dateTimeRegex);
  const matches = text.match(dateTimeRegex) || [];

  if (matches.length === 0) {
    return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</span>;
  }

  const result = [];

  parts.forEach((part, index) => {
    if (part) {
      const isMatch = matches.some(match => match.toLowerCase() === part.toLowerCase());

      if (isMatch) {
        result.push(
          <span
            key={`match-${index}`}
            className={`border-b ${isUserMessage ? 'border-white/60' : 'border-border'}`}
            style={{ borderBottomStyle: 'dotted', paddingBottom: '1px', whiteSpace: 'pre-wrap' }}
          >
            {part}
          </span>
        );
      } else {
        result.push(<span key={`text-${index}`} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>);
      }
    }
  });

  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</span>;
};

// ==========================================
// INITIALS AVATAR - Orange for members, Blue for staff
// ==========================================
const InitialsAvatar = ({ firstName, lastName, size = "md", isStaff = false, className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-20 h-20 text-2xl",
  }

  const bgColor = isStaff ? "bg-primary" : "bg-primary"

  return (
    <div
      className={`${bgColor} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
};

// ==========================================
// MOBILE EMAIL ITEM COMPONENT
// ==========================================
const MobileEmailItem = ({
  email,
  emailTab,
  selectedEmailIds,
  toggleEmailSelection,
  handleEmailItemClick,
  formatEmailTime,
  truncateEmailText,
  moveEmailToTrash
}) => {
  const [touchStart, setTouchStart] = useState(null)
  const [showActions, setShowActions] = useState(false)

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (touchStart !== null) {
      const diff = e.changedTouches[0].clientX - touchStart
      if (diff < -50) {
        setShowActions(true)
      } else if (diff > 50) {
        setShowActions(false)
      }
      setTouchStart(null)
    }
  }

  return (
    <div
      className="relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b border-border active:bg-surface-hover transition-transform duration-200 ${showActions ? '-translate-x-20' : 'translate-x-0'
          }`}
        onClick={() => {
          if (!showActions) {
            handleEmailItemClick(email)
          }
        }}
      >
        {/* Selection Checkbox */}
        <div
          className="flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            toggleEmailSelection(email.id)
          }}
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${selectedEmailIds.includes(email.id)
            ? "bg-primary"
            : "border-2 border-border"
            }`}>
            {selectedEmailIds.includes(email.id) && (
              <Check size={14} className="text-content-primary" />
            )}
          </div>
        </div>

        {/* Email Icon with Unread Indicator */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-surface-hover flex items-center justify-center">
            <Mail size={18} className="text-content-faint" />
          </div>
          {!email.isRead && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-surface-card" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`font-medium truncate ${!email.isRead ? 'text-content-primary' : 'text-content-secondary'}`}>
              {emailTab === "sent" ? email.recipient : email.sender}
            </span>
            <span className="text-xs text-content-faint flex-shrink-0">{formatEmailTime(email.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className={`text-sm truncate ${!email.isRead ? "font-medium text-content-primary" : "text-content-muted"}`}>
              {email.subject || "(No subject)"}
            </p>
            {email.status === "Draft" && (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded flex-shrink-0">
                Draft
              </span>
            )}
          </div>
          <p className="text-xs text-content-faint truncate mt-0.5">{truncateEmailText(email.body, 50)}</p>
          {email.attachments?.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-xs text-content-faint">
              <Paperclip size={10} />
              <span>{email.attachments.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Swipe Actions */}
      <div className={`absolute right-0 top-0 bottom-0 flex items-center transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
        <button
          className="h-full w-20 bg-red-500 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation()
            moveEmailToTrash(email.id)
            setShowActions(false)
          }}
        >
          <Trash2 size={20} className="text-content-primary" />
        </button>
      </div>
    </div>
  )
}

// Truncate text for reply preview
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function Communications() {
  // ==========================================
  // REDUX & ROUTER HOOKS
  // ==========================================
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth) || {};
  const { studio } = useSelector((state) => state.studios) || {};
  const chatState = useSelector((state) => state.chats) || {};
  const { messages: reduxMessages = [], loading: chatLoading } = chatState;
  const { members: membersData = [] } = useSelector((state) => state.member) || {};

  // ==========================================
  // UI STATES
  // ==========================================
  const [isMessagesOpen, setIsMessagesOpen] = useState(true)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [showChatDropdown, setShowChatDropdown] = useState(false)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [showChatMenu, setShowChatMenu] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const [open, setOpen] = useState(false)

  // Chat feature states
  const [activeMessageMenu, setActiveMessageMenu] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Navigation States
  const [chatType, setChatType] = useState("company") // Changed default to "company" for staff
  const [activeScreen, setActiveScreen] = useState("chat")
  const [settingsTab, setSettingsTab] = useState("notifications")

  // Chat States
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([])
  const [chatList, setChatList] = useState([])
  const [archivedChats, setArchivedChats] = useState([])
  const [pinnedChats, setPinnedChats] = useState(new Set())
  const [searchMember, setSearchMember] = useState("")
  const [messageReactions, setMessageReactions] = useState({})
  const [mobileContextMenu, setMobileContextMenu] = useState(null)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [showCopiedToast, setShowCopiedToast] = useState(false)

  // ==========================================
  // API & SOCKET STATES
  // ==========================================
  const [isConnected, setIsConnected] = useState(false)
  const [chatListLoaded, setChatListLoaded] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [apiError, setApiError] = useState(null)

  // Email States (unchanged)
  const [emailList, setEmailList] = useState(() => ({
    ...emailListNew,
    error: emailListNew.error || [],
    trash: emailListNew.trash || []
  }))
  const [emailTemplates, setEmailTemplates] = useState(emailTemplatesNew)
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  })

  // Modal States (unchanged)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [editingDraft, setEditingDraft] = useState(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [showMemberConfirmation, setShowMemberConfirmation] = useState(false)
  const [selectedMemberForConfirmation, setSelectedMemberForConfirmation] = useState(null)
  const [showStaffConfirmation, setShowStaffConfirmation] = useState(false)
  const [selectedStaffForConfirmation, setSelectedStaffForConfirmation] = useState(null)
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [editMemberInitialTab, setEditMemberInitialTab] = useState("note")
  const [editFormMain, setEditFormMain] = useState({})
  const [editingRelationsMain, setEditingRelationsMain] = useState({})
  const [newRelationMain, setNewRelationMain] = useState({ category: "", member: null })
  const [memberRelationsState, setMemberRelationsState] = useState(memberRelationsNew)

  // Email States
  const [emailTab, setEmailTab] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [emailSearchQuery, setEmailSearchQuery] = useState("")
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyInitialRecipient, setReplyInitialRecipient] = useState(null)
  const [selectedEmailIds, setSelectedEmailIds] = useState([])
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false)
  const [emailsToDelete, setEmailsToDelete] = useState([])

  // Data States
  const [appointmentNotificationTypes, setAppointmentNotificationTypes] = useState(appointmentNotificationTypesNew)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState({
    member: 0,
    company: 0,
    email: 0,
  })
  const [broadcastFolders, setBroadcastFolders] = useState([
    { id: 1, name: "General", messages: [] },
    { id: 2, name: "Announcements", messages: [] },
    { id: 3, name: "Events", messages: [] },
  ])
  const [settings, setSettings] = useState(settingsNew)
  const [preConfiguredMessages, setPreConfiguredMessages] = useState(preConfiguredMessagesNew)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [appointments, setAppointments] = useState(appointmentsNew)
  const [freeAppointments, setFreeAppointments] = useState([
    { id: 1, date: "2025-03-15", time: "9:00 AM" },
    { id: 2, date: "2025-03-15", time: "11:00 AM" },
    { id: 3, date: "2025-03-15", time: "2:00 PM" },
    { id: 4, date: "2025-03-20", time: "10:00 AM" },
    { id: 5, date: "2025-03-20", time: "1:30 PM" },
    { id: 6, date: "2025-04-05", time: "9:30 AM" },
    { id: 7, date: "2025-04-05", time: "3:00 PM" },
  ])
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [members, setMembers] = useState(membersData)

  // Form States
  const [newMessage, setNewMessage] = useState({ title: "", message: "", folderId: 1 })
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current")
  const [newBillingPeriod, setNewBillingPeriod] = useState("")
  const [memberContingentData, setMemberContingentData] = useState(memberContingentDataNew)
  const [notifyAction, setNotifyAction] = useState("")
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  // Refs
  const dropdownRef = useRef(null)
  const chatDropdownRef = useRef(null)
  const groupDropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const recipientDropdownRef = useRef(null)
  const messagesEndRef = useRef(null)
  const chatMenuRef = useRef(null)
  const menuRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const mobileMessagesContainerRef = useRef(null)
  const messageMenuRef = useRef(null)
  const textareaRef = useRef(null)
  const mobileTextareaRef = useRef(null)
  const reactionPickerRef = useRef(null)
  const emojiPickerRef = useRef(null)

  // Legacy states (kept for compatibility)
  const [companyChatListState, setCompanyChatListState] = useState(
    companyChatListNew.map(chat => ({ ...chat, markedUnread: chat.markedUnread || false }))
  )
  const [staffChatListState, setStaffChatListState] = useState(
    staffChatListNew.map(chat => ({ ...chat, markedUnread: chat.markedUnread || false }))
  )
  const memberChatList = memberChatListNew
  const currentBillingPeriod = "04.14.25 - 04.18.2025"

  // ==========================================
  // DEBUG LOGGING HELPER
  // ==========================================
  const debugLog = (source, message, data = null) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`[${timestamp}] [Communications:${source}] ${message}`, data ? data : '');
  };

  // ==========================================
  // EFFECTS - DISABLE PARENT SCROLLING
  // ==========================================
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContainer = document.querySelector('main');
    const originalOverflow = mainContainer?.style.overflow;
    if (mainContainer) {
      mainContainer.scrollTop = 0;
      mainContainer.style.overflow = 'hidden';
    }
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
      dashboardContent.scrollTop = 0;
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    return () => {
      if (mainContainer) {
        mainContainer.style.overflow = originalOverflow || '';
      }
    };
  }, []);

  // Detect keyboard open/close
  useEffect(() => {
    const onFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) {
        setKeyboardOpen(true)
      }
    }
    const onFocusOut = () => {
      setTimeout(() => {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea" && !document.activeElement?.isContentEditable) {
          setKeyboardOpen(false)
        }
      }, 100)
    }
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  // ==========================================
  // LOAD STAFF CHATS FROM API
  // ==========================================
  const loadStaffChats = async () => {
    debugLog('loadStaffChats', 'Starting to load staff chats...');
    try {
      const result = await dispatch(fetchStaffAllChatThunk()).unwrap();
      debugLog('loadStaffChats', 'API Response received', { count: result?.length || 0 });

      if (!result || !Array.isArray(result)) {
        debugLog('loadStaffChats', 'Invalid API response format', result);
        setApiError('Invalid response from server');
        return;
      }

      const transformed = result.map(chat => ({
        _id: chat._id,
        id: chat._id,
        name: getChatDisplayName(chat),
        logo: getChatAvatar(chat),
        chatType: chat.chatCategory || getChatCategory(chat),
        isGroupChat: chat.isGroupChat || false,
        chatName: chat.chatName,
        member: chat.member,
        users: chat.users,
        studio: chat.studio,
        lastMessage: chat.lastMessage || '',
        updatedAt: chat.updatedAt,
        createdAt: chat.createdAt,
        markedUnread: false,
        messages: [],
        isBirthday: false,
        dateOfBirth: null,
        isArchived: false
      }));

      setChatList(transformed);
      setChatListLoaded(true);
      debugLog('loadStaffChats', 'Chats loaded successfully', { count: transformed.length });

      // Show success toast
      toast.success(`${transformed.length} chats loaded`);

    } catch (error) {
      debugLog('loadStaffChats', 'ERROR loading chats', error);
      setApiError(error?.message || 'Failed to load chats');
      toast.error('Failed to load chats: ' + (error?.message || 'Unknown error'));
    }
  };

  // Helper functions for chat display
  const getChatDisplayName = (chat) => {
    if (chat.isGroupChat) return chat.chatName || "Group Chat";
    if (chat.member) return `${chat.member.firstName || ''} ${chat.member.lastName || ''}`.trim() || "Member";
    if (chat.users && Array.isArray(chat.users)) {
      const otherUser = chat.users.find(u => u?._id !== user?._id);
      if (otherUser) return `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || "Staff";
    }
    if (chat.studio) return studio?.studioName || "Studio Chat";
    return "Unknown Chat";
  };

  const getChatAvatar = (chat) => {
    if (chat.member?.img) return chat.member.img;
    if (chat.member?.image) return chat.member.image;
    if (chat.users && Array.isArray(chat.users)) {
      const otherUser = chat.users.find(u => u?._id !== user?._id);
      if (otherUser?.img) return otherUser.img;
      if (otherUser?.image) return otherUser.image;
    }
    return null;
  };

  const getChatCategory = (chat) => {
    if (chat.isGroupChat) return "group";
    if (chat.member) return "studio-member";
    return "one-to-one";
  };

  // Load chats when component mounts or chatType changes
  useEffect(() => {
    if (chatType === "company" && !chatListLoaded) {
      debugLog('useEffect', 'Chat type is company, loading staff chats');
      loadStaffChats();
    } else if (chatType === "member") {
      debugLog('useEffect', 'Chat type is member, using mock data for now');
      setChatListLoaded(true);
    }
  }, [chatType, chatListLoaded]);

  // ==========================================
  // SOCKET.IO SETUP
  // ==========================================
  useEffect(() => {
    if (!socket || !user?._id) {
      debugLog('socket', 'Socket or user not available', { socket: !!socket, userId: user?._id });
      return;
    }

    debugLog('socket', 'Setting up socket connection for user', user._id);
    socket.emit("setup", user._id);

    socket.on("connected", () => {
      debugLog('socket', 'Socket connected successfully');
      setIsConnected(true);
      toast.success('Connected to chat server');
    });

    socket.on("disconnect", () => {
      debugLog('socket', 'Socket disconnected');
      setIsConnected(false);
      toast.warning('Disconnected from chat server');
    });

    const handleNewMessage = (newMessage) => {
      debugLog('socket', 'New message received via socket', newMessage);
      dispatch(receiveSocketMessage(newMessage));

      // Update local messages if this chat is open
      if (selectedChat?._id === newMessage.chat?._id) {
        const transformedMsg = transformMessage(newMessage);
        setMessages(prev => [...prev, transformedMsg]);
        debugLog('socket', 'Added message to current chat');
      }

      // Update chat list with last message
      setChatList(prev => prev.map(chat =>
        chat._id === newMessage.chat?._id
          ? { ...chat, lastMessage: newMessage.content, updatedAt: new Date() }
          : chat
      ));
    };

    socket.on("new message", handleNewMessage);

    return () => {
      debugLog('socket', 'Cleaning up socket listeners');
      socket.off("connected");
      socket.off("disconnect");
      socket.off("new message", handleNewMessage);
    };
  }, [user, dispatch, selectedChat]);

  // ==========================================
  // JOIN CHAT ROOM WHEN SELECTED
  // ==========================================
  useEffect(() => {
    if (!socket || !selectedChat?._id) {
      return;
    }

    debugLog('joinRoom', 'Joining chat room', selectedChat._id);
    socket.emit("join chat", selectedChat._id);

    return () => {
      debugLog('joinRoom', 'Leaving chat room', selectedChat._id);
      socket.emit("leave chat", selectedChat._id);
    };
  }, [selectedChat?._id]);

  // ==========================================
  // FETCH MESSAGES WHEN CHAT IS SELECTED
  // ==========================================
  const loadMessages = async (chatId) => {
    debugLog('loadMessages', 'Fetching messages for chat', chatId);
    try {
      const result = await dispatch(fetchMessagesThunk(chatId)).unwrap();
      debugLog('loadMessages', 'Messages received', { count: result?.length || 0 });

      if (!result || !Array.isArray(result)) {
        debugLog('loadMessages', 'Invalid messages response', result);
        return;
      }

      const transformedMessages = result.map(transformMessage);
      setMessages(transformedMessages);

    } catch (error) {
      debugLog('loadMessages', 'ERROR loading messages', error);
      toast.error('Failed to load messages: ' + (error?.message || 'Unknown error'));
    }
  };

  const transformMessage = (msg) => ({
    id: msg._id,
    _id: msg._id,
    sender: msg.sender?._id === user?._id ? "You" : (msg.sender?.firstName || "Other"),
    senderId: msg.sender?._id,
    content: msg.content,
    text: msg.content,
    time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    timestamp: msg.createdAt,
    createdAt: msg.createdAt,
    status: msg.status || "read",
    isDeleted: msg.isDeleted || false,
    replyTo: msg.replyTo ? {
      id: msg.replyTo._id,
      content: msg.replyTo.content,
      sender: msg.replyTo.sender?.firstName || "Unknown"
    } : null
  });

  useEffect(() => {
    if (selectedChat?._id) {
      loadMessages(selectedChat._id);
    }
  }, [selectedChat?._id]);

  // ==========================================
  // AUTO-SCROLL
  // ==========================================
  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    if (mobileMessagesContainerRef.current) {
      mobileMessagesContainerRef.current.scrollTop = mobileMessagesContainerRef.current.scrollHeight;
    }
  }, [messages])

  // ==========================================
  // SEND MESSAGE - REAL API
  // ==========================================
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat?._id || sendingMessage) {
      debugLog('sendMessage', 'Blocked - conditions not met', {
        hasText: !!messageText.trim(),
        hasChat: !!selectedChat?._id,
        isSending: sendingMessage
      });
      return;
    }

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}`;

    debugLog('sendMessage', 'Sending message', { chatId: selectedChat._id, content: messageContent });
    setSendingMessage(true);

    // Create optimistic message
    const tempMessage = {
      id: tempId,
      _id: tempId,
      sender: "You",
      senderId: user?._id,
      content: messageContent,
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: "sending",
      isDeleted: false,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender
      } : null
    };

    // Add to UI immediately
    setMessages(prev => [...prev, tempMessage]);
    setMessageText("");
    setReplyingTo(null);
    setShowEmojiPicker(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '32px';
    }
    if (mobileTextareaRef.current) {
      mobileTextareaRef.current.style.height = '32px';
    }

    // Auto-scroll
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      if (mobileMessagesContainerRef.current) {
        mobileMessagesContainerRef.current.scrollTop = mobileMessagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      const messageData = {
        chatId: selectedChat._id,
        content: messageContent,
        replyTo: replyingTo?._id || null
      };

      // Emit via socket for real-time
      if (socket && isConnected) {
        debugLog('sendMessage', 'Emitting via socket');
        socket.emit("new message", messageData);
      }

      // Save to backend
      debugLog('sendMessage', 'Calling sendMessageThunk');
      const result = await dispatch(sendMessageThunk(messageData)).unwrap();
      debugLog('sendMessage', 'Message sent successfully', result);

      // Replace temp message with real one
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? transformMessage(result) : msg
      ));

      // Update chat list last message
      setChatList(prev => prev.map(chat =>
        chat._id === selectedChat._id
          ? { ...chat, lastMessage: messageContent, updatedAt: new Date() }
          : chat
      ));

    } catch (error) {
      debugLog('sendMessage', 'ERROR sending message', error);
      toast.error('Failed to send message: ' + (error?.message || 'Unknown error'));
      // Mark as failed
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, status: "failed" } : msg
      ));
    } finally {
      setSendingMessage(false);
    }
  };

  // ==========================================
  // SELECT CHAT
  // ==========================================
  const handleChatSelect = (chat) => {
    debugLog('handleChatSelect', 'Selecting chat', { chatId: chat.id, name: chat.name });

    // Find full chat data
    const fullChat = chatList.find(c => c._id === chat.id || c.id === chat.id);

    if (fullChat) {
      setSelectedChat(fullChat);
      setIsMessagesOpen(false);
      setActiveScreen("chat");
      setReplyingTo(null);
      setSearchMember("");
      dispatch(setActiveChat(fullChat));

      // Mark as read in UI
      setChatList(prev => prev.map(c =>
        (c._id === fullChat._id || c.id === fullChat.id)
          ? { ...c, markedUnread: false }
          : c
      ));

      debugLog('handleChatSelect', 'Chat selected successfully', fullChat);
    } else {
      debugLog('handleChatSelect', 'Chat not found in list', chat);
    }
  };

  // ==========================================
  // CLICK OUTSIDE HANDLERS
  // ==========================================
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }

      if (showEmojiPicker) {
        const isInsideEmojiPicker = emojiPickerRef.current?.contains(event.target);
        const isEmojiButton = event.target.closest('button[aria-label="Add emoji"]');
        const path = event.composedPath ? event.composedPath() : [];
        const isInEmojiMartPath = path.some(el =>
          el.tagName === 'EM-EMOJI-PICKER' ||
          el.classList?.contains('emoji-mart') ||
          (el.getAttribute && el.getAttribute('data-emoji-picker'))
        );
        const isEmojiMartElement = event.target.closest('em-emoji-picker') ||
          event.target.tagName === 'EM-EMOJI-PICKER' ||
          event.target.closest('.emoji-mart');

        if (!isInsideEmojiPicker && !isEmojiButton && !isEmojiMartElement && !isInEmojiMartPath) {
          setShowEmojiPicker(false);
        }
      }

      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target) &&
        !event.target.closest('.message-menu-trigger')) {
        setActiveMessageMenu(null);
      }

      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
        const path = event.composedPath ? event.composedPath() : [];
        const isInEmojiMartPath = path.some(el =>
          el.tagName === 'EM-EMOJI-PICKER' ||
          el.classList?.contains('emoji-mart')
        );
        if (!event.target.closest('em-emoji-picker') && !isInEmojiMartPath) {
          setShowReactionPicker(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [showEmojiPicker])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setActiveDropdownId(null)
      }
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setShowChatDropdown(false)
      }
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setShowGroupDropdown(false)
      }
      if (recipientDropdownRef.current && !recipientDropdownRef.current.contains(event.target)) {
        setShowRecipientDropdown(false)
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
        setShowChatMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // ==========================================
  // LEGACY FUNCTIONS (kept for compatibility)
  // ==========================================
  const handleTemplateSelect = (template) => {
    setSelectedEmailTemplate(template)
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body,
    })
    setShowTemplateDropdown(false)
  }

  const handleArchiveChat = (chatId, e) => {
    e.stopPropagation();
    const chatToArchive = chatList.find((chat) => chat.id === chatId);
    if (chatToArchive) {
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === chatId
            ? { ...member, isArchived: true }
            : member
        )
      );
      setArchivedChats((prev) => [...prev, { ...chatToArchive, isArchived: true }]);
      setChatList((prevList) => prevList.filter((chat) => chat.id !== chatId));
      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat(null);
        setIsMessagesOpen(true);
      }
    }
    setShowChatMenu(null);
  };

  const handleRestoreChat = (chatId) => {
    const chatToRestore = archivedChats.find((chat) => chat.id === chatId);
    if (chatToRestore) {
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === chatId
            ? { ...member, isArchived: false }
            : member
        )
      );
      setChatList((prev) => [...prev, { ...chatToRestore, isArchived: false }]);
      setArchivedChats((prev) => prev.filter((chat) => chat.id !== chatId));
      handleChatSelect(chatToRestore);
    }
    setShowArchive(false);
  };

  const handlePinChat = (chatId, e) => {
    e.stopPropagation()
    setPinnedChats((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(chatId)) {
        newSet.delete(chatId)
      } else {
        newSet.add(chatId)
      }
      return newSet
    })
    setShowChatMenu(null)
  }

  const handleMarkChatAsRead = (chatId, e, isCompanyChat = false) => {
    e.stopPropagation()
    const updateChat = (chat) => {
      if (chat.id === chatId) {
        const updatedMessages = (chat.messages || []).map(msg => ({
          ...msg,
          status: msg.sender !== "You" ? "read" : msg.status
        }));
        return { ...chat, messages: updatedMessages, markedUnread: false };
      }
      return chat;
    };
    if (isCompanyChat) {
      if (chatId === 100) {
        setCompanyChatListState(prev => prev.map(updateChat));
      } else {
        setStaffChatListState(prev => prev.map(updateChat));
      }
    } else {
      setChatList(prev => prev.map(updateChat));
    }
    setShowChatMenu(null)
  }

  const handleMarkChatAsUnread = (chatId, e, isCompanyChat = false) => {
    e.stopPropagation()
    const updateChat = (chat) => {
      if (chat.id === chatId) {
        return { ...chat, markedUnread: true };
      }
      return chat;
    };
    if (isCompanyChat) {
      if (chatId === 100) {
        setCompanyChatListState(prev => prev.map(updateChat));
      } else {
        setStaffChatListState(prev => prev.map(updateChat));
      }
    } else {
      setChatList(prev => prev.map(updateChat));
    }
    setShowChatMenu(null)
  }

  const handleViewMember = (chatId, e) => {
    if (e) e.stopPropagation();
    if (chatType === "company") return;
    const chat = chatList.find((c) => c.id === chatId) || archivedChats.find((c) => c.id === chatId);
    let member = null;
    if (chat) {
      const memberIdToFind = chat.memberId || chat.id;
      member = members.find((m) => m.id === memberIdToFind);
      if (!member) {
        member = members.find((m) =>
          m.name === chat.name ||
          `${m.firstName} ${m.lastName}` === chat.name ||
          m.title === chat.name
        );
      }
    }
    if (member) {
      setSelectedMemberForConfirmation(member);
      setShowMemberConfirmation(true);
    } else {
      alert("Member details not found.");
    }
    setShowChatMenu(null);
  };

  const handleConfirmViewMember = () => {
    if (selectedMemberForConfirmation) {
      navigate('/dashboard/members', {
        state: {
          filterMemberId: selectedMemberForConfirmation.id,
          filterMemberName: selectedMemberForConfirmation.name ||
            `${selectedMemberForConfirmation.firstName} ${selectedMemberForConfirmation.lastName}`
        }
      });
    }
    setShowMemberConfirmation(false);
    setSelectedMemberForConfirmation(null);
  };

  const handleViewStaff = (chatId, e) => {
    if (e) e.stopPropagation();
    const chat = staffChatListState.find((c) => c.id === chatId);
    let staff = null;
    if (chat) {
      const staffIdToFind = chat.staffId || chat.id;
      staff = staffData.find((s) => s.id === staffIdToFind);
      if (!staff) {
        staff = staffData.find((s) =>
          `${s.firstName} ${s.lastName}` === chat.name ||
          s.name === chat.name
        );
      }
    }
    if (staff) {
      setSelectedStaffForConfirmation(staff);
      setShowStaffConfirmation(true);
    } else {
      alert("Staff details not found.");
    }
    setShowChatMenu(null);
  };

  const handleConfirmViewStaff = () => {
    if (selectedStaffForConfirmation) {
      navigate('/dashboard/staff', {
        state: {
          filterStaffId: selectedStaffForConfirmation.id,
          filterStaffName: selectedStaffForConfirmation.name ||
            `${selectedStaffForConfirmation.firstName} ${selectedStaffForConfirmation.lastName}`
        }
      });
    }
    setShowStaffConfirmation(false);
    setSelectedStaffForConfirmation(null);
  };

  // Reaction handlers
  const handleReaction = (messageId, emoji) => {
    setMessageReactions((prev) => {
      const newReactions = { ...prev };
      if (newReactions[messageId] === emoji) {
        delete newReactions[messageId];
      } else {
        newReactions[messageId] = emoji;
      }
      return newReactions;
    });
    setShowReactionPicker(null);
    setActiveMessageMenu(null);
  };

  const removeReaction = (messageId, e) => {
    e.stopPropagation();
    setMessageReactions((prev) => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, isDeleted: true, content: "" }
        : msg
    ));
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
    if (chatType === "member") {
      setChatList((prevList) =>
        prevList.map((chat) =>
          chat.id === selectedChat?.id
            ? {
              ...chat,
              messages: chat.messages?.map(msg =>
                msg.id === messageId
                  ? { ...msg, isDeleted: true, content: "" }
                  : msg
              ) || [],
            }
            : chat,
        ),
      );
    } else if (chatType === "company") {
      if (selectedChat?.id === 100 || selectedChat?.isCompany) {
        setCompanyChatListState((prevList) =>
          prevList.map((chat) =>
            chat.id === selectedChat?.id
              ? {
                ...chat,
                messages: chat.messages?.map(msg =>
                  msg.id === messageId
                    ? { ...msg, isDeleted: true, content: "" }
                    : msg
                ) || [],
              }
              : chat,
          ),
        );
      } else {
        setStaffChatListState((prevList) =>
          prevList.map((chat) =>
            chat.id === selectedChat?.id
              ? {
                ...chat,
                messages: chat.messages?.map(msg =>
                  msg.id === messageId
                    ? { ...msg, isDeleted: true, content: "" }
                    : msg
                ) || [],
              }
              : chat,
          ),
        );
      }
    }
    setShowDeleteConfirm(null);
    setActiveMessageMenu(null);
  };

  const handleReplyToMessage = (msg) => {
    if (msg.isDeleted) return;
    setReplyingTo(msg);
    setActiveMessageMenu(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCopyMessage = (msg) => {
    if (msg.isDeleted) return;
    const textToCopy = msg.content || msg.text || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
    setActiveMessageMenu(null);
    setMobileContextMenu(null);
  };

  const handleTouchStart = (message, e) => {
    if (message.isDeleted) return;
    const timer = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      setMobileContextMenu({ messageId: message.id, message });
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ==========================================
  // EMAIL FUNCTIONS (unchanged)
  // ==========================================
  const handleEmailClick = () => {
    setActiveScreen("email-frontend")
    setSelectedChat(null)
    setIsMessagesOpen(false)
  }

  const getEmailFolderCount = (folderId) => {
    if (folderId === "archive") {
      return Object.values(emailList).filter(arr => Array.isArray(arr)).flat().filter(e => e?.isArchived).length
    }
    return (emailList[folderId] || []).filter(e => !e?.isArchived).length
  }

  const getUnreadCountForFolder = (folderId) => {
    if (folderId === "archive") {
      return Object.values(emailList).filter(arr => Array.isArray(arr)).flat().filter(e => e?.isArchived && !e.isRead).length
    }
    return (emailList[folderId] || []).filter(e => !e.isRead && !e?.isArchived).length
  }

  const getTotalUnreadEmails = () => {
    let count = 0
    Object.keys(emailList).forEach(folder => {
      if (folder !== "trash" && Array.isArray(emailList[folder])) {
        count += emailList[folder].filter(e => !e.isRead && !e.isArchived).length
      }
    })
    return count
  }

  const emailFolders = [
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "sent", label: "Sent", icon: Send },
    { id: "draft", label: "Drafts", icon: FileText },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "error", label: "Failed", icon: XCircle },
    { id: "trash", label: "Trash", icon: Trash2 },
  ]

  const getFilteredEmails = (includePinned = true) => {
    let emails = emailList[emailTab] || []
    if (!Array.isArray(emails)) emails = []
    if (emailTab === "archive") {
      emails = Object.values(emailList).filter(arr => Array.isArray(arr)).flat().filter(e => e?.isArchived)
    }
    if (emailSearchQuery.trim()) {
      const query = emailSearchQuery.toLowerCase()
      emails = emails.filter(e =>
        e.subject?.toLowerCase().includes(query) ||
        e.sender?.toLowerCase().includes(query) ||
        e.recipient?.toLowerCase().includes(query)
      )
    }
    if (emailTab !== "archive") {
      emails = emails.filter(e => e && !e.isArchived)
    }
    if (!includePinned) {
      emails = emails.filter(e => !e.isPinned)
    }
    return emails.sort((a, b) => new Date(b.time) - new Date(a.time))
  }

  const handleEmailItemClick = (email) => {
    if (emailTab === "draft" || email.status === "Draft") {
      const toRecipients = email.recipientEmail
        ? email.recipientEmail.split(",").map(e => e.trim()).filter(Boolean).map(email => ({
          email,
          name: email,
          isManual: true
        }))
        : []
      setEmailData({
        subject: email.subject || "",
        body: email.body || "",
      })
      setEditingDraft(email)
      setShowEmailModal(true)
      return
    }
    if (!email.isRead) {
      setEmailList(prev => {
        const newList = { ...prev }
        Object.keys(newList).forEach(folder => {
          if (Array.isArray(newList[folder])) {
            newList[folder] = newList[folder].map(e => e.id === email.id ? { ...e, isRead: true } : e)
          }
        })
        return newList
      })
      setSelectedEmail({ ...email, isRead: true })
    } else {
      setSelectedEmail(email)
    }
  }

  const updateEmailStatus = (emailId, updates) => {
    setEmailList(prev => {
      const newList = { ...prev }
      Object.keys(newList).forEach(folder => {
        if (Array.isArray(newList[folder])) {
          newList[folder] = newList[folder].map(e => e.id === emailId ? { ...e, ...updates } : e)
        }
      })
      return newList
    })
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const moveEmailToTrash = (emailId) => {
    setEmailList(prev => {
      let emailToMove = null
      let sourceFolder = null
      Object.keys(prev).forEach(folder => {
        if (folder !== "trash" && Array.isArray(prev[folder])) {
          const email = prev[folder].find(e => e.id === emailId)
          if (email) {
            emailToMove = email
            sourceFolder = folder
          }
        }
      })
      if (!emailToMove || !sourceFolder) return prev
      return {
        ...prev,
        [sourceFolder]: prev[sourceFolder].filter(e => e.id !== emailId),
        trash: [...(prev.trash || []), { ...emailToMove, deletedAt: new Date().toISOString() }]
      }
    })
    if (selectedEmail?.id === emailId) setSelectedEmail(null)
  }

  const retryFailedEmail = (email) => {
    setEmailList(prev => ({
      ...prev,
      error: (prev.error || []).filter(e => e.id !== email.id),
      sent: [{ ...email, status: "Sent", time: new Date().toISOString() }, ...(prev.sent || [])]
    }))
    if (selectedEmail?.id === email.id) setSelectedEmail(null)
  }

  const permanentlyDeleteEmail = (emailId) => {
    setEmailList(prev => ({
      ...prev,
      trash: (prev.trash || []).filter(e => e.id !== emailId)
    }))
    if (selectedEmail?.id === emailId) setSelectedEmail(null)
  }

  const handleEmailReply = (email) => {
    if (!email) return
    const senderEmail = email.senderEmail || ""
    const senderName = email.sender || ""
    let senderData = membersData.find(m =>
      m.email?.toLowerCase() === senderEmail.toLowerCase()
    )
    let initialRecipient = null
    if (!senderData) {
      const staffMember = staffData.find(s =>
        s.email?.toLowerCase() === senderEmail.toLowerCase()
      )
      if (staffMember) {
        initialRecipient = {
          id: `staff-${staffMember.id}`,
          email: staffMember.email,
          name: `${staffMember.firstName || ''} ${staffMember.lastName || ''}`.trim(),
          firstName: staffMember.firstName,
          lastName: staffMember.lastName,
          image: staffMember.img,
          type: 'staff'
        }
      }
    } else {
      initialRecipient = {
        id: `member-${senderData.id}`,
        email: senderData.email,
        name: `${senderData.firstName || ''} ${senderData.lastName || ''}`.trim(),
        firstName: senderData.firstName,
        lastName: senderData.lastName,
        image: senderData.image,
        type: 'member'
      }
    }
    if (!initialRecipient) {
      const nameParts = senderName.split(' ')
      initialRecipient = {
        id: null,
        email: senderEmail || senderName,
        name: senderName,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        isManual: true
      }
    }
    setReplyInitialRecipient(initialRecipient)
    setShowReplyModal(true)
  }

  const closeReplyModal = () => {
    setShowReplyModal(false)
    setReplyInitialRecipient(null)
  }

  const handleSendReply = (replyPayload) => {
    setEmailList(prev => ({ ...prev, sent: [replyPayload, ...(prev.sent || [])] }))
  }

  const handleSaveReplyAsDraft = (draftPayload) => {
    setEmailList(prev => ({ ...prev, draft: [draftPayload, ...(prev.draft || [])] }))
  }

  const handleSearchMemberForReply = (query) => {
    if (!query) return []
    const q = query.toLowerCase()
    const memberResults = membersData.filter(m =>
      m.firstName?.toLowerCase().includes(q) ||
      m.lastName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
    ).map(m => ({
      id: `member-${m.id}`,
      email: m.email,
      name: `${m.firstName || ''} ${m.lastName || ''}`.trim(),
      firstName: m.firstName,
      lastName: m.lastName,
      image: m.image || m.avatar,
      type: 'member'
    }))
    const staffResults = staffData.filter(s =>
      s.firstName?.toLowerCase().includes(q) ||
      s.lastName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    ).map(s => ({
      id: `staff-${s.id}`,
      email: s.email,
      name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      firstName: s.firstName,
      lastName: s.lastName,
      image: s.img,
      type: 'staff'
    }))
    return [...memberResults, ...staffResults].slice(0, 10)
  }

  const formatEmailTime = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString()
  }

  const truncateEmailText = (text, maxLength = 60) => {
    if (!text) return ""
    const stripped = text.replace(/<[^>]*>/g, '')
    return stripped.length > maxLength ? stripped.substring(0, maxLength) + "..." : stripped
  }

  const handleMoveEmailToFolder = (emailId, targetFolder) => {
    if (targetFolder === 'draft') return
    setEmailList(prev => {
      const newList = { ...prev }
      let emailToMove = null
      let sourceFolder = null
      Object.keys(newList).forEach(folder => {
        if (Array.isArray(newList[folder])) {
          const idx = newList[folder].findIndex(e => e.id === emailId || e.id === parseInt(emailId))
          if (idx !== -1) {
            emailToMove = { ...newList[folder][idx] }
            sourceFolder = folder
            newList[folder] = newList[folder].filter((_, i) => i !== idx)
          }
        }
      })
      if (emailToMove && targetFolder !== sourceFolder) {
        if (targetFolder === 'archive') {
          emailToMove.isArchived = true
        } else {
          emailToMove.isArchived = false
        }
        if (targetFolder === 'trash') {
          emailToMove.deletedAt = new Date().toISOString()
        }
        if (!newList[targetFolder]) newList[targetFolder] = []
        newList[targetFolder] = [emailToMove, ...newList[targetFolder]]
      }
      return newList
    })
    if (selectedEmail?.id === emailId || selectedEmail?.id === parseInt(emailId)) {
      setSelectedEmail(null)
    }
  }

  const getPinnedEmails = () => {
    let emails = emailList[emailTab] || []
    if (!Array.isArray(emails)) emails = []
    if (emailTab === "archive") {
      emails = Object.values(emailList).filter(arr => Array.isArray(arr)).flat().filter(e => e?.isArchived)
    } else {
      emails = emails.filter(e => e && !e.isArchived)
    }
    if (emailSearchQuery.trim()) {
      const query = emailSearchQuery.toLowerCase()
      emails = emails.filter(e =>
        e.subject?.toLowerCase().includes(query) ||
        e.sender?.toLowerCase().includes(query) ||
        e.recipient?.toLowerCase().includes(query)
      )
    }
    return emails.filter(e => e.isPinned).sort((a, b) => new Date(b.time) - new Date(a.time))
  }

  const toggleEmailSelection = (emailId) => {
    setSelectedEmailIds(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    )
  }

  const selectAllEmails = () => {
    const allEmails = [...getPinnedEmails(), ...getFilteredEmails(false)]
    const allIds = allEmails.map(e => e.id)
    const allSelected = allIds.every(id => selectedEmailIds.includes(id))
    if (allSelected) {
      setSelectedEmailIds([])
    } else {
      setSelectedEmailIds(allIds)
    }
  }

  const bulkMarkAsRead = (isRead) => {
    setEmailList(prev => {
      const newList = { ...prev }
      Object.keys(newList).forEach(folder => {
        if (Array.isArray(newList[folder])) {
          newList[folder] = newList[folder].map(email =>
            selectedEmailIds.includes(email.id) ? { ...email, isRead } : email
          )
        }
      })
      return newList
    })
    setSelectedEmailIds([])
  }

  const bulkArchive = () => {
    selectedEmailIds.forEach(id => {
      updateEmailStatus(id, { isArchived: true })
    })
    setSelectedEmailIds([])
  }

  const bulkDelete = () => {
    if (emailTab === "trash") {
      setEmailsToDelete(selectedEmailIds)
      setShowPermanentDeleteConfirm(true)
    } else {
      selectedEmailIds.forEach(id => {
        moveEmailToTrash(id)
      })
      setSelectedEmailIds([])
    }
  }

  const confirmPermanentDelete = () => {
    emailsToDelete.forEach(id => {
      permanentlyDeleteEmail(id)
    })
    setSelectedEmailIds([])
    setEmailsToDelete([])
    setShowPermanentDeleteConfirm(false)
  }

  const handleSaveEmailAsDraft = (draftData) => {
    const draft = {
      id: draftData.id || Date.now(),
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: draftData.toRecipients?.map(r => r.name || r.email).join(", ") || "",
      recipientEmail: draftData.toRecipients?.map(r => r.email).join(", ") || "",
      cc: draftData.ccRecipients?.map(r => r.email).join(", ") || "",
      bcc: draftData.bccRecipients?.map(r => r.email).join(", ") || "",
      subject: draftData.subject || "",
      body: draftData.body || "",
      time: new Date().toISOString(),
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Draft",
      attachments: draftData.attachments?.map(a => ({ name: a.name, size: a.size, type: a.type })) || [],
    }
    setEmailList(prev => {
      if (draftData.id) {
        return {
          ...prev,
          draft: (prev.draft || []).map(d => d.id === draftData.id ? draft : d)
        }
      }
      return {
        ...prev,
        draft: [draft, ...(prev.draft || [])]
      }
    })
  }

  const handleSendEmail = (emailDataWithAttachments) => {
    const toEmails = Array.isArray(emailDataWithAttachments.to)
      ? emailDataWithAttachments.to
      : [emailDataWithAttachments.to].filter(Boolean);
    if (toEmails.length === 0 || !emailDataWithAttachments.subject || !emailDataWithAttachments.body) {
      alert("Please fill in all required email fields");
      return;
    }
    const bodyWithSignature = settings.emailSignature
      ? `${emailDataWithAttachments.body}<br><br>${settings.emailSignature}`
      : emailDataWithAttachments.body;
    const newEmail = {
      id: Date.now(),
      recipient: toEmails.join(", "),
      cc: emailDataWithAttachments.cc?.join(", ") || "",
      bcc: emailDataWithAttachments.bcc?.join(", ") || "",
      subject: emailDataWithAttachments.subject,
      body: bodyWithSignature,
      status: "Sent",
      time: new Date().toISOString(),
      isRead: true,
      isPinned: false,
      isArchived: false,
      attachments: emailDataWithAttachments.attachments || []
    };
    if (editingDraft) {
      setEmailList(prev => ({
        ...prev,
        draft: (prev.draft || []).filter(d => d.id !== editingDraft.id),
        sent: [newEmail, ...prev.sent]
      }));
      setEditingDraft(null);
    } else {
      setEmailList(prev => ({
        ...prev,
        sent: [newEmail, ...prev.sent]
      }));
    }
    alert("Email sent successfully!");
    setEmailData({ to: "", subject: "", body: "" });
    setShowEmailModal(false);
  };

  const handleAppointmentChange = (changes) => {
    if (selectedAppointmentData) {
      setSelectedAppointmentData({
        ...selectedAppointmentData,
        ...changes,
      })
    }
  }

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((app) => app.id !== id))
    setSelectedAppointmentData(null)
    setShowSelectedAppointmentModal(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointments.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedChat?.id,
    }
    setAppointments([...appointments, newAppointment])
    setShowCreateAppointmentModal(false)
  }

  const handleCalendarClick = () => {
    if (selectedChat) {
      const foundMember = membersData.find((m) => m.id === selectedChat.id)
      if (foundMember) {
        setSelectedMember({
          ...foundMember,
          title: `${foundMember.firstName} ${foundMember.lastName}`
        })
        setShowAppointmentModal(true)
      } else {
        setSelectedMember({
          id: selectedChat.id,
          firstName: selectedChat.name.split(' ')[0],
          lastName: selectedChat.name.split(' ')[1] || '',
          email: selectedChat.email || '',
          title: selectedChat.name,
          ...selectedChat
        })
        setShowAppointmentModal(true)
      }
    }
  }

  const handleEditAppointment = (appointment) => {
    const memberId = appointment.memberId;
    const member = membersData.find(m => m.id === memberId);
    const fullAppointment = {
      ...appointment,
      name: member ? `${member.firstName} ${member.lastName}` : "Member",
      memberImage: member?.image || null,
      memberNote: member?.note || "",
      memberNoteImportance: member?.noteImportance || "unimportant",
      memberNoteStartDate: member?.noteStartDate || "",
      memberNoteEndDate: member?.noteEndDate || "",
      memberNotes: member?.notes || [],
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: null,
        endDate: null,
      },
    };
    setSelectedAppointmentData(fullAppointment);
    setShowSelectedAppointmentModal(true);
    setShowAppointmentModal(false);
  }

  const handleCreateNewAppointment = () => {
    setShowCreateAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleBroadcast = (broadcastData) => {
    const { message, recipients, settings } = broadcastData;
    if (!message) return;
    if (recipients.length === 0) return;
    console.log(`Broadcast sent to ${recipients.length} recipients via ${settings.broadcastEmail ? "Email" : "Push"}`);
  }

  const handleSaveNewMessage = () => {
    if (!newMessage.title.trim() || !newMessage.message.trim()) {
      alert("Please enter both title and message")
      return
    }
    const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1
    const messageToAdd = {
      id: newId,
      title: newMessage.title,
      message: newMessage.message,
      folderId: newMessage.folderId,
    }
    setPreConfiguredMessages([...preConfiguredMessages, messageToAdd])
    setSelectedMessage(messageToAdd)
    setNewMessage({ title: "", message: "", folderId: 1 })
  }

  const handleCancelAppointment = (id) => {
    setSelectedAppointmentData(appointments.find((app) => app.id === id))
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
  }

  const handleManageContingent = () => {
    const memberId = selectedChat?.id
    if (memberId && memberContingentData[memberId]) {
      setTempContingent(memberContingentData[memberId].current)
      setSelectedBillingPeriod("current")
    } else {
      setTempContingent({ used: 0, total: 0 })
      setSelectedBillingPeriod("current")
    }
    setShowContingentModal(true)
  }

  const handleSaveContingent = () => {
    const memberId = selectedChat?.id
    if (memberId && memberContingentData[memberId]) {
      const updatedContingent = { ...memberContingentData }
      if (selectedBillingPeriod === "current") {
        updatedContingent[memberId].current = { ...tempContingent }
      } else {
        if (!updatedContingent[memberId].future) {
          updatedContingent[memberId].future = {}
        }
        updatedContingent[memberId].future[selectedBillingPeriod] = { ...tempContingent }
      }
      setMemberContingentData(updatedContingent)
      alert("Contingent updated successfully!")
    }
    setShowContingentModal(false)
  }

  const handleSaveSettings = () => {
    setShowSettings(false)
    alert("Settings saved successfully!")
  }

  const handleAddBillingPeriod = () => {
    if (newBillingPeriod.trim() && selectedChat) {
      const updatedContingent = { ...memberContingentData }
      if (!updatedContingent[selectedChat.id].future) {
        updatedContingent[selectedChat.id].future = {}
      }
      updatedContingent[selectedChat.id].future[newBillingPeriod] = { used: 0, total: 0 }
      setMemberContingentData(updatedContingent)
      setNewBillingPeriod("")
      setShowAddBillingPeriodModal(false)
      alert("New billing period added successfully")
    }
  }

  const handleSearchMemberForEmail = (query) => {
    if (!query) return []
    const q = query.toLowerCase()
    const memberResults = membersData.filter(m =>
      m.firstName?.toLowerCase().includes(q) ||
      m.lastName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
    ).map(m => ({
      id: `member-${m.id}`,
      email: m.email,
      name: `${m.firstName || ''} ${m.lastName || ''}`.trim(),
      firstName: m.firstName,
      lastName: m.lastName,
      image: m.image || m.avatar,
      type: 'member'
    }))
    const staffResults = staffData.filter(s =>
      s.firstName?.toLowerCase().includes(q) ||
      s.lastName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    ).map(s => ({
      id: `staff-${s.id}`,
      email: s.email,
      name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      firstName: s.firstName,
      lastName: s.lastName,
      image: s.img,
      type: 'staff'
    }))
    return [...memberResults, ...staffResults].slice(0, 10)
  }

  const handleSelectEmailRecipient = (member) => {
    setEmailData((prev) => ({ ...prev, to: member.email || member.name }))
    setShowRecipientDropdown(false)
  }

  const getMemberAppointments = (memberId) => {
    return appointments.filter((app) => app.memberId === memberId)
  }

  const getSortedChatList = () => {
    const list = getCombinedChatList();
    const activeChats = list.filter(chat => {
      if (chat.type === 'separator') return true;
      return !archivedChats.some(archived => archived.id === chat.id);
    });
    return activeChats;
  };

  const getPinnedAndUnpinnedChats = () => {
    const allChats = getSortedChatList();
    const pinned = allChats.filter(chat => chat.type !== 'separator' && pinnedChats.has(chat.id));
    const unpinned = allChats.filter(chat => chat.type === 'separator' || !pinnedChats.has(chat.id));
    return { pinned, unpinned };
  };

  const getCombinedChatList = () => {
    if (chatType === "company") {
      // For staff view - use API data
      const studioMemberChats = chatList.filter(chat => chat.chatType === "studio-member");
      const oneToOneChats = chatList.filter(chat => chat.chatType === "one-to-one");
      const groupChats = chatList.filter(chat => chat.chatType === "group");

      const result = [];
      if (studioMemberChats.length > 0) result.push(...studioMemberChats);
      if (oneToOneChats.length > 0) {
        if (studioMemberChats.length > 0) result.push({ id: "separator", type: "separator" });
        result.push(...oneToOneChats);
      }
      if (groupChats.length > 0) {
        if (studioMemberChats.length > 0 || oneToOneChats.length > 0) {
          result.push({ id: "group-separator", type: "separator" });
        }
        result.push(...groupChats);
      }
      return result;
    } else if (chatType === "member") {
      return chatList.filter(chat => chat.chatType === "studio-member");
    }
    return chatList;
  };

  const getSearchResults = () => {
    if (!searchMember) return [];
    const lowerQuery = searchMember.toLowerCase();
    const existingChats = getCombinedChatList().filter((chat) =>
      chat.type !== 'separator' && chat.name?.toLowerCase().includes(lowerQuery)
    );
    if (chatType === "member") {
      const existingMemberIds = chatList.map(chat => chat.memberId);
      const newMemberChats = membersData
        .filter(member =>
          member.isActive &&
          !member.isArchived &&
          !existingMemberIds.includes(member.id) &&
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(lowerQuery)
        )
        .map(member => ({
          id: `new-${member.id}`,
          memberId: member.id,
          name: `${member.firstName} ${member.lastName}`,
          logo: member.image || null,
          dateOfBirth: member.dateOfBirth || null,
          isBirthday: checkIfBirthday(member.dateOfBirth),
          isArchived: false,
          isNewChat: true,
          messages: []
        }));
      return [...existingChats, ...newMemberChats];
    }
    return existingChats;
  };

  const checkIfBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate();
  };

  const searchResults = getSearchResults();

  const getTotalUnreadCount = (type) => {
    if (type === "member") {
      return chatList.reduce((total, chat) => {
        const unreadCount = getUnreadCount(chat);
        if (unreadCount > 0) return total + unreadCount;
        if (chat.markedUnread) return total + 1;
        return total;
      }, 0);
    } else if (type === "company") {
      const companyUnread = companyChatListState.reduce((total, chat) => {
        const unreadCount = getUnreadCount(chat);
        if (unreadCount > 0) return total + unreadCount;
        if (chat.markedUnread) return total + 1;
        return total;
      }, 0);
      const staffUnread = staffChatListState.reduce((total, chat) => {
        const unreadCount = getUnreadCount(chat);
        if (unreadCount > 0) return total + unreadCount;
        if (chat.markedUnread) return total + 1;
        return total;
      }, 0);
      return companyUnread + staffUnread;
    }
    return 0;
  };

  const getAppointmentTypesFromData = () => {
    const typesSet = new Set();
    appointmentsNew.forEach(app => {
      if (app.type) {
        typesSet.add(app.type);
      }
    });
    const typesArray = Array.from(typesSet).map(type => {
      const firstApp = appointmentsNew.find(app => app.type === type);
      return {
        name: type,
        color: firstApp?.color || "bg-surface-button",
        duration: 30
      };
    });
    return typesArray;
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-3.5 h-3.5 text-content-muted" />
      case "delivered":
        return <CheckCheck className="w-3.5 h-3.5 text-content-muted" />
      case "read":
        return <CheckCheck className="w-3.5 h-3.5 text-primary" />
      default:
        return null
    }
  }

  const getBillingPeriods = (memberId) => {
    const memberData = memberContingentData[memberId]
    if (!memberData) return []
    const periods = [{ id: "current", label: `Current (${currentBillingPeriod})`, data: memberData.current }]
    if (memberData.future) {
      Object.entries(memberData.future).forEach(([period, data]) => {
        periods.push({
          id: period,
          label: `Future (${period})`,
          data: data,
        })
      })
    }
    return periods
  }

  const appointmentTypes = appointmentTypesData;

  const searchMembersMain = (query) => {
    if (!query || query.trim() === "") return [];
    const lowerQuery = query.toLowerCase();
    return membersData
      .filter(member =>
        member.isActive &&
        !member.isArchived &&
        (
          member.firstName?.toLowerCase().includes(lowerQuery) ||
          member.lastName?.toLowerCase().includes(lowerQuery) ||
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(lowerQuery) ||
          member.email?.toLowerCase().includes(lowerQuery)
        )
      )
      .map(member => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        image: member.image,
        note: member.note,
        noteImportance: member.noteImportance,
        noteStartDate: member.noteStartDate,
        noteEndDate: member.noteEndDate,
      }));
  };

  const getRelationsCount = (memberId) => {
    const relations = memberRelationsState[memberId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0);
  };

  const handleEditMember = (member, tab = "note") => {
    const fullMember = membersData.find(m => m.id === member.id) || member;
    const memberData = {
      ...fullMember,
      title: fullMember.title || `${fullMember.firstName} ${fullMember.lastName}`,
    };
    setEditingMember(memberData);
    setEditFormMain({
      ...memberData,
      note: memberData.note || "",
      noteImportance: memberData.noteImportance || "unimportant",
      noteStartDate: memberData.noteStartDate || "",
      noteEndDate: memberData.noteEndDate || "",
    });
    setEditingRelationsMain(memberRelationsState[memberData.id] || {});
    setEditMemberInitialTab(tab);
    setShowEditMemberModal(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditFormMain(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEditedMember = () => {
    setMembers(prevMembers =>
      prevMembers.map(m => m.id === editingMember.id ? { ...m, ...editFormMain } : m)
    );
    setMemberRelationsState(prev => ({
      ...prev,
      [editingMember.id]: editingRelationsMain
    }));
    setShowEditMemberModal(false);
    setEditingMember(null);
  };

  const handleAddRelationMain = () => {
    if (!newRelationMain.category || !newRelationMain.member) return;
    setEditingRelationsMain(prev => {
      const category = newRelationMain.category;
      const existingRelations = prev[category] || [];
      return {
        ...prev,
        [category]: [...existingRelations, newRelationMain.member]
      };
    });
    setNewRelationMain({ category: "", member: null });
  };

  const handleDeleteRelationMain = (category, memberId) => {
    setEditingRelationsMain(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(m => m.id !== memberId)
    }));
  };

  const handleArchiveMemberMain = () => {
    console.log("Archive member:", editingMember?.id);
  };

  const handleUnarchiveMemberMain = () => {
    console.log("Unarchive member:", editingMember?.id);
  };

  // ==========================================
  // CHAT ITEM COMPONENT
  // ==========================================
  const ChatItem = ({ chat, isSelected, onSelect, onMenuClick, index, totalChats }) => {
    const chatItemRef = useRef(null);
    const isCompanyChat = chatType === "company";
    const isStaffChat = chatType === "company" && chat.id !== 100;

    const nameParts = chat.name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const showImage = (chat.id === 100 && chat.logo) || (chat.logo && chat.logo !== DefaultAvatar && !chat.logo?.includes('placeholder'));

    const shouldOpenUpward = () => {
      if (chatItemRef.current) {
        const rect = chatItemRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        return rect.bottom > viewportHeight * 0.6;
      }
      return index >= totalChats * 0.6;
    };

    return (
      <div
        ref={chatItemRef}
        onClick={() => onSelect(chat)}
        className={`
          relative flex items-start gap-3 p-4 rounded-xl cursor-pointer select-none
          transition-all duration-200 group border-b border-border
          ${isSelected
            ? "bg-surface-card border-l-2 border-l-primary"
            : "hover:bg-surface-card border-l-2 border-l-transparent"
          }
        `}
      >
        <div className="relative flex-shrink-0">
          {showImage ? (
            <img
              src={chat.logo}
              alt={`${chat.name}'s avatar`}
              className="w-12 h-12 rounded-xl object-cover"
              onClick={(e) => {
                e.stopPropagation();
                if (isStaffChat) {
                  handleViewStaff(chat.id, e);
                } else if (!isCompanyChat) {
                  handleViewMember(chat.id, e);
                }
              }}
            />
          ) : chat.id === 100 ? (
            <img
              src={chat.logo || DefaultAvatar}
              alt="Studio"
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (isStaffChat) {
                  handleViewStaff(chat.id, e);
                } else if (!isCompanyChat) {
                  handleViewMember(chat.id, e);
                }
              }}
              className="cursor-pointer"
            >
              <InitialsAvatar
                firstName={firstName}
                lastName={lastName}
                size="lg"
                isStaff={isStaffChat}
              />
            </div>
          )}
          <BirthdayBadge
            show={chat.isBirthday}
            dateOfBirth={chat.dateOfBirth}
            size="md"
            withTooltip={true}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${isSelected ? 'text-primary' : 'text-content-primary'}`}>
              {chat.name}
            </span>
            {chat.isNewChat && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">New</span>
            )}
          </div>
          <p className="text-sm text-content-muted truncate mt-0.5">
            {chat.lastMessage || "No messages yet"}
          </p>
          <div className="flex items-center gap-1 text-content-faint mt-1.5">
            <Clock size={12} />
            <span className="text-xs">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString() : "No messages"}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-shrink-0 w-[24px] mt-1">
          <div className="h-[18px] flex items-center justify-center">
            {chat.markedUnread ? (
              <span className="bg-primary rounded-full h-[10px] w-[10px]" />
            ) : (
              <span className="w-[18px]" />
            )}
          </div>
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            {/* Status icon placeholder */}
          </div>
          <div className="h-[18px] flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick(chat.id);
              }}
              className="w-[18px] h-[18px] flex items-center justify-center text-content-muted hover:text-primary rounded hover:bg-surface-hover transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>

        {showChatMenu === chat.id && (
          <div
            ref={chatMenuRef}
            className={`absolute right-4 w-48 bg-surface-base border border-border rounded-lg shadow-lg py-1 z-20 ${shouldOpenUpward() ? 'bottom-16' : 'top-16'
              }`}
          >
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-surface-hover text-content-secondary flex items-center gap-2 transition-colors"
              onClick={(e) => {
                const hasUnread = chat.markedUnread;
                hasUnread ? handleMarkChatAsRead(chat.id, e, isCompanyChat) : handleMarkChatAsUnread(chat.id, e, isCompanyChat);
              }}
            >
              {chat.markedUnread ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Mark as {chat.markedUnread ? "read" : "unread"}
            </button>

            {!isCompanyChat && !isStaffChat && (
              <>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-surface-hover text-content-secondary flex items-center gap-2 transition-colors"
                  onClick={(e) => handlePinChat(chat.id, e)}
                >
                  {pinnedChats.has(chat.id) ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {pinnedChats.has(chat.id) ? "Unpin" : "Pin"} chat
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-surface-hover text-content-secondary flex items-center gap-2 transition-colors"
                  onClick={(e) => handleArchiveChat(chat.id, e)}
                >
                  <Archive className="w-4 h-4" />
                  Archive chat
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-surface-hover text-content-secondary flex items-center gap-2 transition-colors"
                  onClick={(e) => handleViewMember(chat.id, e)}
                >
                  <User className="w-4 h-4" />
                  View Member
                </button>
              </>
            )}
            {isStaffChat && (
              <button
                className="w-full px-3 py-2 text-sm text-left hover:bg-surface-hover text-content-secondary flex items-center gap-2 transition-colors"
                onClick={(e) => handleViewStaff(chat.id, e)}
              >
                <User className="w-4 h-4" />
                View Staff
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="relative flex h-[92vh] max-h-[92vh] bg-surface-base text-content-secondary rounded-3xl overflow-hidden">
      <ToastContainer />

      {/* Connection Status Bar */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 text-black text-xs text-center py-1">
          ⚡ Connecting to chat server...
        </div>
      )}

      {apiError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
          Error: {apiError}
        </div>
      )}

      {/* Chat List Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[400px] w-full md:rounded-none rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${isMessagesOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } bg-surface-base z-30 select-none md:top-0 top-[52px] md:h-[92vh] h-[calc(100vh-52px)] md:border-r md:border-border`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-content-primary">Messenger</h1>
          </div>

          <div className="mb-4">
            <div className="flex bg-surface-card rounded-xl border border-border p-1 w-full overflow-hidden">
              <button
                className={`flex-1 py-2 flex items-center justify-center rounded-lg text-sm transition-colors relative ${chatType === "member" && activeScreen !== "email-frontend" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                  }`}
                onClick={() => {
                  setChatType("member");
                  setActiveScreen("chat");
                  setSelectedChat(null);
                  setSelectedEmail(null);
                  setMessages([]);
                }}
              >
                <User size={16} className="mr-2" />
                Member
                {getTotalUnreadCount("member") > 0 && (
                  <span className={`absolute top-0.5 right-0.5 text-[10px] rounded-full h-4 w-4 flex items-center justify-center ${chatType === "member" && activeScreen !== "email-frontend" ? "bg-white text-primary" : "bg-primary text-white"
                    }`}>
                    {getTotalUnreadCount("member")}
                  </span>
                )}
              </button>
              <button
                className={`flex-1 py-2 flex items-center justify-center rounded-lg text-sm transition-colors relative ${chatType === "company" && activeScreen !== "email-frontend" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                  }`}
                onClick={() => {
                  setChatType("company");
                  setActiveScreen("chat");
                  setSelectedChat(null);
                  setSelectedEmail(null);
                  setMessages([]);
                }}
              >
                <Building2 size={16} className="mr-2" />
                Studio
                {getTotalUnreadCount("company") > 0 && (
                  <span className={`absolute top-0.5 right-0.5 text-[10px] rounded-full h-4 w-4 flex items-center justify-center ${chatType === "company" && activeScreen !== "email-frontend" ? "bg-white text-primary" : "bg-primary text-white"
                    }`}>
                    {getTotalUnreadCount("company")}
                  </span>
                )}
              </button>
              <button
                className={`flex-1 py-2 flex items-center justify-center rounded-lg text-sm transition-colors relative ${activeScreen === "email-frontend" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary hover:bg-surface-hover"}`}
                onClick={handleEmailClick}
              >
                <Mail size={16} className="mr-2" />
                Email
                {getTotalUnreadEmails() > 0 && (
                  <span className={`absolute top-0.5 right-0.5 text-[10px] rounded-full h-4 w-4 flex items-center justify-center ${activeScreen === "email-frontend" ? "bg-white text-primary" : "bg-primary text-white"
                    }`}>
                    {getTotalUnreadEmails()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeScreen !== "email-frontend" ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search chats by name..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 border border-border focus:border-primary transition-colors"
                />
              </div>
              {chatType === "member" && (
                <button
                  onClick={() => setShowArchive(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-sm text-content-primary transition-colors w-full mb-4"
                >
                  <Archive className="w-4 h-4 text-content-primary" />
                  Archived ({archivedChats.length})
                </button>
              )}
            </>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  className="w-full bg-surface-card outline-none text-sm text-content-primary rounded-xl px-4 py-2 pl-9 border border-border focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-sm text-white font-medium transition-colors w-full mb-4"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </>
          )}
        </div>

        {activeScreen !== "email-frontend" ? (
          <div
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{ minHeight: 0 }}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="px-4 pb-24 space-y-2">
              {chatLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : searchMember && searchResults.length > 0 ? (
                searchResults.map((chat, index) => (
                  chat.type !== "separator" && (
                    <ChatItem
                      key={`search-${chat.id}-${index}`}
                      chat={chat}
                      isSelected={selectedChat?.id === chat.id}
                      onSelect={handleChatSelect}
                      onMenuClick={(id) => setShowChatMenu(showChatMenu === id ? null : id)}
                      index={index}
                      totalChats={searchResults.length}
                    />
                  )
                ))
              ) : (() => {
                const { pinned, unpinned } = getPinnedAndUnpinnedChats();
                return (
                  <>
                    {pinned.length > 0 && (
                      <>
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Pin size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs text-amber-500 font-medium">Pinned</span>
                          <div className="flex-1 h-px bg-amber-500/30"></div>
                        </div>
                        {pinned.map((chat, index) => (
                          <ChatItem
                            key={`pinned-${chat.id}-${index}`}
                            chat={chat}
                            isSelected={selectedChat?.id === chat.id}
                            onSelect={handleChatSelect}
                            onMenuClick={(id) => setShowChatMenu(showChatMenu === id ? null : id)}
                            index={index}
                            totalChats={pinned.length + unpinned.length}
                          />
                        ))}
                        <div className="flex items-center px-2 py-1 mt-2">
                          <div className="flex-1 h-px bg-surface-button"></div>
                        </div>
                      </>
                    )}
                    {unpinned.map((chat, index) => {
                      if (chat.type === "separator") {
                        return (
                          <div key="separator" className="border-t border-border my-2">
                            <div className="text-xs text-content-faint text-center py-2">Staff Chats</div>
                          </div>
                        )
                      }
                      return (
                        <ChatItem
                          key={`${chatType}-${chat.id}-${index}`}
                          chat={chat}
                          isSelected={selectedChat?.id === chat.id}
                          onSelect={handleChatSelect}
                          onMenuClick={(id) => setShowChatMenu(showChatMenu === id ? null : id)}
                          index={pinned.length + index}
                          totalChats={pinned.length + unpinned.length}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto custom-scrollbar select-none"
            style={{ minHeight: 0 }}
          >
            <div className="px-4 pb-24 space-y-1">
              {emailFolders.map((folder) => {
                const Icon = folder.icon
                const totalCount = getEmailFolderCount(folder.id)
                const unreadCount = getUnreadCountForFolder(folder.id)
                const isActive = emailTab === folder.id

                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setEmailTab(folder.id)
                      setSelectedEmail(null)
                      setSelectedEmailIds([])
                    }}
                    onDragOver={(e) => {
                      if (folder.id === 'draft' || folder.id === 'error' || folder.id === 'trash') return
                      if (emailTab === 'draft' || emailTab === 'error' || emailTab === 'trash') return
                      e.preventDefault()
                      e.currentTarget.classList.add('bg-surface-button-hover')
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('bg-surface-button-hover')
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('bg-surface-button-hover')
                      if (folder.id === 'draft' || folder.id === 'error' || folder.id === 'trash') return
                      if (emailTab === 'draft' || emailTab === 'error' || emailTab === 'trash') return
                      const emailId = e.dataTransfer.getData('emailId')
                      if (emailId && folder.id !== emailTab) {
                        handleMoveEmailToFolder(emailId, folder.id)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors border-l-2 ${isActive
                      ? "bg-surface-card border-l-primary text-content-primary"
                      : "border-l-transparent text-content-muted hover:bg-surface-hover hover:text-content-primary"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-primary" : ""} />
                      <span className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>
                        {folder.label} <span className={isActive ? "text-content-muted" : "text-content-faint"}>[{totalCount}]</span>
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="hidden md:block absolute bottom-6 right-6 z-50">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            <IoIosMegaphone size={22} />
          </button>
        </div>
      </div>

      {/* Main Chat Area - Desktop */}
      <div className="hidden md:flex flex-1 flex-col min-w-0 h-[92vh] max-h-[92vh] overflow-hidden">
        {!selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mx-auto">
                <MessageCircle className="w-12 h-12 text-content-faint" />
              </div>
            </div>
            <h3 className="text-content-primary font-medium text-lg mb-2">No chat selected</h3>
            <p className="text-content-faint text-sm max-w-xs">
              Select a conversation from the chatlist to start messaging.
            </p>
          </div>
        )}

        {selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-3 px-3 py-2 bg-surface-dark rounded-xl ${(chatType !== "company" || (chatType === "company" && selectedChat.id !== 100)) ? "cursor-pointer hover:bg-surface-button active:scale-[0.98] transition-all duration-200" : ""}`}
                  onClick={(e) => {
                    const isStaffChat = chatType === "company" && selectedChat.id !== 100;
                    if (isStaffChat) {
                      handleViewStaff(selectedChat.id, e);
                    } else if (chatType !== "company") {
                      handleViewMember(selectedChat.id, e);
                    }
                  }}
                >
                  <div className="relative">
                    {selectedChat.id === 100 ? (
                      <img
                        src={selectedChat.logo || DefaultAvatar}
                        alt="Studio"
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                    ) : selectedChat.logo && selectedChat.logo !== DefaultAvatar && !selectedChat.logo?.includes('placeholder') ? (
                      <img
                        src={selectedChat.logo}
                        alt="Current chat avatar"
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                    ) : (
                      <InitialsAvatar
                        firstName={selectedChat.name?.split(" ")[0] || ""}
                        lastName={selectedChat.name?.split(" ").slice(1).join(" ") || ""}
                        size="md"
                        isStaff={chatType === "company" && selectedChat.id !== 100}
                      />
                    )}
                    <BirthdayBadge
                      show={selectedChat.isBirthday}
                      dateOfBirth={selectedChat.dateOfBirth}
                      size="md"
                    />
                  </div>
                  <span className="font-medium text-content-primary">
                    {selectedChat.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chatType !== "company" && (
                  <button
                    className="text-primary hover:text-primary-hover"
                    aria-label="View appointments"
                    onClick={handleCalendarClick}
                  >
                    <Calendar className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
              style={{ minHeight: 0 }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-content-faint" />
                  </div>
                  <p className="text-content-faint">No messages yet</p>
                  <p className="text-xs text-content-faint mt-1">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-2 ${message.sender === "You" ? "justify-end" : ""} group`}>
                    {message.sender === "You" && !message.isDeleted && (
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setActiveMessageMenu(activeMessageMenu === message.id ? null : message.id)}
                          className="message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg mt-2"
                        >
                          <MoreVertical size={18} className="text-content-muted" />
                        </button>
                        {activeMessageMenu === message.id && (
                          <>
                            <div className="fixed inset-0 z-[1099]" onClick={() => setActiveMessageMenu(null)} />
                            <div ref={messageMenuRef} className="absolute top-0 left-full ml-1 z-[1100] bg-surface-button rounded-xl shadow-xl p-1 min-w-[140px] border border-border">
                              <button onClick={() => handleReplyToMessage(message)} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2">
                                <Reply size={14} /> Reply
                              </button>
                              <button onClick={() => { setShowReactionPicker(message.id); setActiveMessageMenu(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2">
                                <Smile size={14} /> React
                              </button>
                              <button onClick={() => handleCopyMessage(message)} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2">
                                <Copy size={14} /> Copy
                              </button>
                              <button onClick={() => { setShowDeleteConfirm(message.id); setActiveMessageMenu(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-red-400 flex items-center gap-2">
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className={`flex flex-col gap-1 ${message.sender === "You" ? "items-end" : ""} max-w-lg`}>
                      {selectedChat?.id === 100 && message.sender !== "You" && !message.isDeleted && (
                        <div className="text-xs text-content-faint font-medium mb-1">{message.sender}</div>
                      )}
                      <div className={`rounded-xl p-3 ${message.isDeleted ? "bg-surface-hover text-content-faint italic" : message.sender === "You" ? "bg-primary" : "bg-surface-dark"}`}>
                        {message.replyTo && !message.isDeleted && (
                          <div className={`mb-2 p-2 rounded-lg text-xs border-l-2 ${message.sender === 'You' ? "bg-primary/50 border-l-white" : "bg-surface-button border-l-primary"}`}>
                            <p className={`font-semibold mb-0.5 text-xs ${message.sender === 'You' ? 'text-white' : 'text-content-primary'}`}>
                              {message.replyTo.sender === 'You' ? 'You' : message.replyTo.sender}
                            </p>
                            <p className={`${message.sender === 'You' ? 'text-white/80' : 'text-content-muted'} text-xs`}>
                              {truncateText(message.replyTo.content, 50)}
                            </p>
                          </div>
                        )}
                        <p className={`text-sm ${message.isDeleted ? "" : message.sender === "You" ? "text-white" : "text-content-primary"}`} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {message.isDeleted ? (
                            <span className="flex items-center gap-1.5"><Trash2 size={14} /> The message was deleted.</span>
                          ) : (
                            <HighlightedText text={message.content} isUserMessage={message.sender === 'You'} />
                          )}
                        </p>
                        <div className={`text-[11px] mt-1.5 flex items-center gap-1 ${message.sender === "You" ? "text-white/70 justify-end" : "text-content-faint"}`}>
                          <span>{message.time || formatTimestamp(message.timestamp)}</span>
                          {message.sender === "You" && !message.isDeleted && (
                            <span className="ml-1">
                              {message.status === "read" ? <CheckCheck className="w-3.5 h-3.5 text-white" /> :
                                message.status === "delivered" ? <CheckCheck className="w-3.5 h-3.5" /> :
                                  message.status === "sending" ? <div className="animate-pulse w-3.5 h-3.5 rounded-full bg-white/50" /> :
                                    <Check className="w-3.5 h-3.5" />}
                            </span>
                          )}
                        </div>
                      </div>
                      {messageReactions[message.id] && !message.isDeleted && (
                        <div className={`flex gap-1 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                          <button onClick={(e) => removeReaction(message.id, e)} className="bg-surface-button/80 rounded-full px-2 py-0.5 text-base flex items-center gap-1 hover:bg-surface-button transition-colors group/reaction">
                            <span>{messageReactions[message.id]}</span>
                            <span className="opacity-0 group-hover/reaction:opacity-100 text-xs text-content-muted">×</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {message.sender !== "You" && !message.isDeleted && (
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setActiveMessageMenu(activeMessageMenu === message.id ? null : message.id)}
                          className={`message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface-button rounded-lg ${selectedChat?.id === 100 ? "mt-7" : "mt-2"}`}
                        >
                          <MoreVertical size={18} className="text-content-muted" />
                        </button>
                        {activeMessageMenu === message.id && (
                          <>
                            <div className="fixed inset-0 z-[1099]" onClick={() => setActiveMessageMenu(null)} />
                            <div ref={messageMenuRef} className="absolute top-0 right-full mr-1 z-[1100] bg-surface-button rounded-xl shadow-xl p-1 min-w-[140px] border border-border">
                              <button onClick={() => handleReplyToMessage(message)} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2">
                                <Reply size={14} /> Reply
                              </button>
                              <button onClick={() => { setShowReactionPicker(message.id); setActiveMessageMenu(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2">
                                <Smile size={14} /> React
                              </button>
                              <button onClick={() => handleCopyMessage(message)} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-button rounded-lg text-content-primary flex items-center gap-2">
                                <Copy size={14} /> Copy
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {replyingTo && (
              <div className="px-4 py-3 bg-surface-hover border-t border-border flex-shrink-0">
                <div className="flex items-center gap-3 bg-surface-button rounded-xl p-3">
                  <div className="w-1 h-10 bg-primary rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-primary text-xs font-semibold">Replying to {replyingTo.sender === 'You' ? 'yourself' : replyingTo.sender}</p>
                    <p className="text-content-secondary text-sm truncate">{truncateText(replyingTo.content, 50)}</p>
                  </div>
                  <button onClick={cancelReply} className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg"><X size={16} /></button>
                </div>
              </div>
            )}

            <div className="px-4 pt-4 pb-6 border-t border-border flex-shrink-0 bg-surface-base relative">
              <div className="flex items-end gap-2 bg-surface-dark rounded-xl p-2">
                <button className="p-2 hover:bg-surface-button rounded-full" onClick={() => setShowEmojiPicker(prev => !prev)}>
                  <Smile className="w-6 h-6 text-content-secondary" />
                </button>
                <textarea
                  ref={textareaRef}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent focus:outline-none text-sm min-w-0 resize-none overflow-y-auto leading-5 text-content-secondary placeholder-content-faint max-h-[150px]"
                  rows={1}
                  value={messageText}
                  onInput={(e) => {
                    e.target.style.height = "32px";
                    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{ height: '32px' }}
                />
                <button
                  className={`p-2 rounded-lg transition-colors ${messageText.trim() && !sendingMessage ? 'bg-primary hover:bg-primary-hover text-white' : 'text-content-faint cursor-not-allowed'}`}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage}
                >
                  {sendingMessage ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Send className="w-6 h-6" />}
                </button>
              </div>
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-4 z-[1020]" onMouseDown={(e) => e.stopPropagation()}>
                  <Picker data={data} onEmojiSelect={(emoji) => setMessageText(prev => prev + emoji.native)} theme="dark" previewPosition="none" skinTonePosition="none" perLine={8} maxFrequentRows={2} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email View - Desktop (unchanged) */}
        {activeScreen === "email-frontend" && (
          <div className="flex h-full select-none">
            <div className="w-[400px] flex-shrink-0 border-r border-border flex flex-col">
              {(getPinnedEmails().length > 0 || getFilteredEmails(false).length > 0) && (
                <div className="px-3 py-2 border-b border-border flex items-center gap-2">
                  <button onClick={selectAllEmails} className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-hover rounded-lg">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedEmailIds.length > 0 && selectedEmailIds.length === [...getPinnedEmails(), ...getFilteredEmails(false)].length ? "bg-primary border-primary" : selectedEmailIds.length > 0 ? "bg-primary/50 border-primary" : "border-border"}`}>
                      {selectedEmailIds.length > 0 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-xs text-content-muted">{selectedEmailIds.length > 0 ? `${selectedEmailIds.length} selected` : "Select all"}</span>
                  </button>
                  {selectedEmailIds.length > 0 && (
                    <div className="flex items-center gap-1 ml-auto">
                      {emailTab !== "draft" && emailTab !== "error" && emailTab !== "trash" && (
                        <>
                          <button onClick={() => bulkMarkAsRead(true)} className="p-1.5 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><MailCheck size={16} /></button>
                          <button onClick={() => bulkMarkAsRead(false)} className="p-1.5 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><MailOpen size={16} /></button>
                          <button onClick={bulkArchive} className="p-1.5 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><Archive size={16} /></button>
                        </>
                      )}
                      <button onClick={bulkDelete} className="p-1.5 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-red-400"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                {getPinnedEmails().length === 0 && getFilteredEmails(false).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mb-4"><Mail className="w-8 h-8 text-content-faint" /></div>
                    <p className="text-content-muted text-sm">No emails in this folder</p>
                  </div>
                ) : (
                  <div className="px-2 py-2 select-none">
                    {getPinnedEmails().length > 0 && (
                      <>
                        <div className="flex items-center gap-2 px-2 py-1"><Pin size={12} className="text-primary fill-primary" /><span className="text-xs text-primary font-medium">Pinned</span><div className="flex-1 h-px bg-primary/30"></div></div>
                        {getPinnedEmails().map((email) => (
                          <div key={email.id} draggable={emailTab !== 'draft' && emailTab !== 'error' && emailTab !== 'trash'} onDragStart={(e) => { if (emailTab === 'draft' || emailTab === 'error' || emailTab === 'trash') { e.preventDefault(); return; } e.dataTransfer.setData('emailId', email.id.toString()); e.currentTarget.classList.add('opacity-50'); }} onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')} onClick={(e) => { if (e.target.closest('.email-checkbox')) return; handleEmailItemClick(email); }} className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 group border-b border-border ${selectedEmail?.id === email.id ? "bg-surface-card border-l-2 border-l-primary" : "hover:bg-surface-card border-l-2 border-l-transparent"}`}>
                            <div className="email-checkbox flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleEmailSelection(email.id); }}><div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${selectedEmailIds.includes(email.id) ? "bg-primary border-primary" : "border-border hover:border-border"}`}>{selectedEmailIds.includes(email.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div></div>
                            <div className="relative flex-shrink-0"><div className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-hover"><Mail size={20} className="text-content-faint" /></div>{!email.isRead && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full" />}</div>
                            <div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2 mb-0.5"><span className={`font-medium truncate ${selectedEmail?.id === email.id ? 'text-primary' : 'text-content-primary'}`}>{emailTab === "sent" ? email.recipient : email.sender}</span><span className="text-xs text-content-faint flex-shrink-0">{formatEmailTime(email.time)}</span></div><div className="flex items-center gap-2"><p className={`text-sm truncate ${!email.isRead ? "font-medium text-content-primary" : "text-content-muted"}`}>{email.subject || "(No subject)"}</p>{email.status === "Draft" && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Draft</span>}</div><p className="text-xs text-content-faint truncate mt-0.5">{truncateEmailText(email.body)}</p>{email.attachments?.length > 0 && <div className="flex items-center gap-1 mt-1.5 text-xs text-content-faint"><Paperclip size={12} /><span>{email.attachments.length}</span></div>}</div>
                          </div>
                        ))}
                        {getFilteredEmails(false).length > 0 && <div className="flex items-center px-2 py-1 mt-2"><div className="flex-1 h-px bg-surface-button"></div></div>}
                      </>
                    )}
                    {getFilteredEmails(false).map((email) => (
                      <div key={email.id} draggable={emailTab !== 'draft' && emailTab !== 'error' && emailTab !== 'trash'} onDragStart={(e) => { if (emailTab === 'draft' || emailTab === 'error' || emailTab === 'trash') { e.preventDefault(); return; } e.dataTransfer.setData('emailId', email.id.toString()); e.currentTarget.classList.add('opacity-50'); }} onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')} onClick={(e) => { if (e.target.closest('.email-checkbox')) return; handleEmailItemClick(email); }} className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 group border-b border-border ${selectedEmail?.id === email.id ? "bg-surface-card border-l-2 border-l-primary" : "hover:bg-surface-card border-l-2 border-l-transparent"}`}>
                        <div className="email-checkbox flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleEmailSelection(email.id); }}><div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${selectedEmailIds.includes(email.id) ? "bg-primary border-primary" : "border-border hover:border-border"}`}>{selectedEmailIds.includes(email.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div></div>
                        <div className="relative flex-shrink-0"><div className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-hover"><Mail size={20} className="text-content-faint" /></div>{!email.isRead && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full" />}</div>
                        <div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2 mb-0.5"><span className={`font-medium truncate ${selectedEmail?.id === email.id ? 'text-primary' : 'text-content-primary'}`}>{emailTab === "sent" ? email.recipient : email.sender}</span><span className="text-xs text-content-faint flex-shrink-0">{formatEmailTime(email.time)}</span></div><div className="flex items-center gap-2"><p className={`text-sm truncate ${!email.isRead ? "font-medium text-content-primary" : "text-content-muted"}`}>{email.subject || "(No subject)"}</p>{email.status === "Draft" && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Draft</span>}</div><p className="text-xs text-content-faint truncate mt-0.5">{truncateEmailText(email.body)}</p>{email.attachments?.length > 0 && <div className="flex items-center gap-1 mt-1.5 text-xs text-content-faint"><Paperclip size={12} /><span>{email.attachments.length}</span></div>}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {selectedEmail ? (
              <div className="flex-1 flex flex-col min-w-0 select-text">
                <div className="p-4 border-b border-border flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">{selectedEmail.isPinned && <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg"><Pin size={12} />Pinned</span>}</div>
                    <div className="flex items-center gap-1">
                      {emailTab === "error" && <button onClick={() => retryFailedEmail(selectedEmail)} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><RefreshCw size={18} /></button>}
                      {emailTab !== "draft" && emailTab !== "error" && emailTab !== "trash" && <button onClick={() => handleEmailReply(selectedEmail)} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><Reply size={18} /></button>}
                      {emailTab !== "trash" && emailTab !== "error" && <button onClick={() => updateEmailStatus(selectedEmail.id, { isPinned: !selectedEmail.isPinned })} className={`p-2 hover:bg-surface-button-hover rounded-lg ${selectedEmail.isPinned ? "text-amber-500" : "text-content-muted hover:text-content-primary"}`}>{selectedEmail.isPinned ? <PinOff size={18} /> : <Pin size={18} />}</button>}
                      {emailTab !== "trash" && emailTab !== "error" && <button onClick={() => { updateEmailStatus(selectedEmail.id, { isArchived: !selectedEmail.isArchived }); setSelectedEmail(null); }} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><Archive size={18} /></button>}
                      <button onClick={() => { if (emailTab === "trash") { setEmailsToDelete([selectedEmail.id]); setShowPermanentDeleteConfirm(true); } else { moveEmailToTrash(selectedEmail.id); } }} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-red-400"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-content-primary mb-3">{selectedEmail.subject}</h2>
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm text-content-primary font-medium">{selectedEmail.sender}</p>{selectedEmail.senderEmail && <p className="text-xs text-content-faint">&lt;{selectedEmail.senderEmail}&gt;</p>}<p className="text-xs text-content-faint mt-1">To: {selectedEmail.recipient}{selectedEmail.recipientEmail && <span> &lt;{selectedEmail.recipientEmail}&gt;</span>}{selectedEmail.cc && <span> • CC: {selectedEmail.cc}</span>}</p></div>
                    <div className="text-right"><p className="text-xs text-content-faint">{new Date(selectedEmail.time).toLocaleString()}</p>{selectedEmail.status === "Failed" && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded mt-1 bg-red-500/20 text-red-400">Failed</span>}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedEmail.attachments?.length > 0 && <div className="mb-6 pb-4 border-b border-border select-none"><p className="text-sm font-medium text-content-muted mb-3 flex items-center gap-2"><Paperclip size={16} />Attachments ({selectedEmail.attachments.length})</p><div className="flex flex-wrap gap-2">{selectedEmail.attachments.map((file, index) => <div key={index} className="flex items-center gap-2 px-3 py-2 bg-surface-hover rounded-lg border border-border"><Paperclip size={14} className="text-content-faint" /><span className="text-sm text-content-secondary">{file.name || file}</span>{file.size && <span className="text-xs text-content-faint">({file.size})</span>}</div>)}</div></div>}
                  <div className="max-w-none bg-white p-6 rounded-xl" style={{ color: 'var(--color-content-primary)', fontSize: '14px', lineHeight: '1.5', fontFamily: 'Arial, sans-serif' }} dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-24 h-24 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mb-4"><Mail className="w-12 h-12 text-content-faint" /></div>
                <h3 className="text-content-primary font-medium text-lg mb-2">No email selected</h3>
                <p className="text-content-faint text-sm">Select an email from the list to view its contents</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] hidden md:flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBroadcastModal(false)} />
          <div className="relative z-10 w-full h-full max-w-[95vw] max-h-[95vh] m-4">
            <BroadcastModal onClose={() => setShowBroadcastModal(false)} broadcastFolders={broadcastFolders} preConfiguredMessages={preConfiguredMessages} chatList={chatList} archivedChats={archivedChats} settings={settings} onBroadcast={handleBroadcast} onCreateMessage={(messageData) => { const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1; setPreConfiguredMessages([...preConfiguredMessages, { id: newId, ...messageData }]); }} onUpdateMessage={(messageData) => setPreConfiguredMessages(prev => prev.map(msg => msg.id === messageData.id ? messageData : msg))} onDeleteMessage={(messageId) => setPreConfiguredMessages(prev => prev.filter(msg => msg.id !== messageId))} onCreateFolder={(folderName) => { const newId = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1; setBroadcastFolders([...broadcastFolders, { id: newId, name: folderName, messages: [] }]); }} onUpdateFolder={(folderId, folderName) => setBroadcastFolders(prev => prev.map(folder => folder.id === folderId ? { ...folder, name: folderName } : folder))} onDeleteFolder={(folderId) => { setBroadcastFolders(prev => prev.filter(folder => folder.id !== folderId)); setPreConfiguredMessages(prev => prev.filter(msg => msg.folderId !== folderId)); }} />
          </div>
        </div>
      )}

      {/* Mobile Broadcast Modal */}
      {showBroadcastModal && (
        <div className="md:hidden fixed inset-0 bg-surface-base z-[100] flex flex-col overflow-auto">
          <BroadcastModal onClose={() => setShowBroadcastModal(false)} broadcastFolders={broadcastFolders} preConfiguredMessages={preConfiguredMessages} chatList={chatList} archivedChats={archivedChats} settings={settings} onBroadcast={handleBroadcast} onCreateMessage={(messageData) => { const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1; setPreConfiguredMessages([...preConfiguredMessages, { id: newId, ...messageData }]); }} onUpdateMessage={(messageData) => setPreConfiguredMessages(prev => prev.map(msg => msg.id === messageData.id ? messageData : msg))} onDeleteMessage={(messageId) => setPreConfiguredMessages(prev => prev.filter(msg => msg.id !== messageId))} onCreateFolder={(folderName) => { const newId = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1; setBroadcastFolders([...broadcastFolders, { id: newId, name: folderName, messages: [] }]); }} onUpdateFolder={(folderId, folderName) => setBroadcastFolders(prev => prev.map(folder => folder.id === folderId ? { ...folder, name: folderName } : folder))} onDeleteFolder={(folderId) => { setBroadcastFolders(prev => prev.filter(folder => folder.id !== folderId)); setPreConfiguredMessages(prev => prev.filter(msg => msg.folderId !== folderId)); }} />
        </div>
      )}

      {/* Mobile Fullscreen Chat Overlay */}
      {selectedChat && activeScreen === "chat" && (
        <div className="md:hidden fixed inset-x-0 top-0 bottom-0 bg-surface-base z-[60] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => { setSelectedChat(null); setMessages([]); setIsMessagesOpen(true); }} className="text-content-muted hover:text-content-primary p-1.5 hover:bg-surface-hover rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <div className={`flex items-center gap-2 px-2 py-1.5 bg-surface-dark rounded-xl ${(chatType !== "company" || (chatType === "company" && selectedChat.id !== 100)) ? "cursor-pointer hover:bg-surface-button active:scale-[0.98] transition-all duration-200" : ""}`} onClick={(e) => { const isStaffChat = chatType === "company" && selectedChat.id !== 100; if (isStaffChat) handleViewStaff(selectedChat.id, e); else if (chatType !== "company") handleViewMember(selectedChat.id, e); }}>
                <div className="relative">
                  {selectedChat.id === 100 ? <img src={selectedChat.logo || DefaultAvatar} alt="Studio" className="w-8 h-8 rounded-lg object-cover" /> : selectedChat.logo && selectedChat.logo !== DefaultAvatar && !selectedChat.logo?.includes('placeholder') ? <img src={selectedChat.logo} alt="Avatar" className="w-8 h-8 rounded-lg object-cover" /> : <InitialsAvatar firstName={selectedChat.name?.split(" ")[0] || ""} lastName={selectedChat.name?.split(" ").slice(1).join(" ") || ""} size="sm" isStaff={chatType === "company" && selectedChat.id !== 100} />}
                  <BirthdayBadge show={selectedChat.isBirthday} dateOfBirth={selectedChat.dateOfBirth} size="sm" className="absolute -top-1 -right-1" />
                </div>
                <span className="font-medium text-content-primary text-sm truncate max-w-[150px]">{selectedChat.name}</span>
              </div>
            </div>
            {chatType !== "company" && <button className="text-primary hover:text-primary-hover p-1.5" onClick={handleCalendarClick}><Calendar className="w-5 h-5" /></button>}
          </div>
          <div ref={mobileMessagesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.length === 0 ? <div className="flex items-center justify-center h-full text-content-faint"><p>No messages yet</p></div> : messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"} max-w-[80%] min-w-0`}>
                  {selectedChat?.id === 100 && message.sender !== "You" && !message.isDeleted && <span className="text-xs text-content-faint font-medium mb-1 px-1">{message.sender}</span>}
                  <div className={`rounded-xl px-3 py-2 max-w-full overflow-hidden select-none ${message.isDeleted ? "bg-surface-hover" : message.sender === "You" ? "bg-primary" : "bg-surface-button"}`} style={{ wordBreak: 'break-word', WebkitUserSelect: 'none', userSelect: 'none' }} onTouchStart={(e) => handleTouchStart(message, e)} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove} onContextMenu={(e) => { e.preventDefault(); if (!message.isDeleted) setMobileContextMenu({ messageId: message.id, message }); }}>
                    {message.replyTo && !message.isDeleted && <div className={`mb-2 pl-2 border-l-2 ${message.sender === "You" ? "border-white/40" : "border-border"}`}><p className={`text-xs font-medium ${message.sender === "You" ? "text-white/80" : "text-content-muted"}`}>{message.replyTo.sender}</p><p className={`text-xs truncate max-w-[200px] ${message.sender === "You" ? "text-white/60" : "text-content-faint"}`}>{message.replyTo.content || message.replyTo.text}</p></div>}
                    <p className={`text-sm ${message.isDeleted ? "text-content-faint italic" : message.sender === "You" ? "text-white" : "text-content-primary"}`} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.isDeleted ? "This message was deleted" : (message.content || message.text || "")}</p>
                    <div className={`text-[11px] mt-1 flex items-center gap-1 ${message.sender === "You" ? "text-white/70 justify-end" : "text-content-faint"}`}><span>{message.time || formatTimestamp(message.timestamp)}</span>{message.sender === "You" && !message.isDeleted && <span className="ml-1">{message.status === "read" ? <CheckCheck className="w-3 h-3 text-white" /> : message.status === "delivered" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}</span>}</div>
                  </div>
                  {messageReactions[message.id] && !message.isDeleted && <div className={`flex gap-1 mt-1 ${message.sender === "You" ? "justify-end" : ""}`}><button onClick={(e) => removeReaction(message.id, e)} className="bg-surface-button/80 rounded-full px-2 py-0.5 text-base flex items-center gap-1 hover:bg-surface-button"><span>{messageReactions[message.id]}</span></button></div>}
                </div>
              </div>
            ))}
          </div>
          {replyingTo && (
            <div className="px-4 py-2 bg-surface-hover border-t border-border flex items-center gap-3">
              <div className="flex-1 pl-3 border-l-2 border-primary"><p className="text-xs font-medium text-primary">{replyingTo.sender}</p><p className="text-xs text-content-muted truncate">{truncateText(replyingTo.content || replyingTo.text, 50)}</p></div>
              <button onClick={cancelReply} className="text-content-muted hover:text-content-primary p-1"><X className="w-4 h-4" /></button>
            </div>
          )}
          <div className="px-2 pt-1.5 pb-2.5 bg-surface-base border-t border-border flex-shrink-0 relative" style={{ paddingBottom: keyboardOpen ? '0.625rem' : 'calc(0.625rem + env(safe-area-inset-bottom, 0px))' }}>
            {showEmojiPicker && <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-3 z-[201]" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}><Picker data={data} onEmojiSelect={(emoji) => setMessageText(prev => prev + emoji.native)} theme="dark" previewPosition="none" skinTonePosition="none" perLine={8} maxFrequentRows={2} /></div>}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-surface-dark px-3 py-2 rounded-xl border border-border flex items-center">
                <textarea ref={mobileTextareaRef} value={messageText} onChange={(e) => setMessageText(e.target.value)} onInput={(e) => { e.target.style.height = "20px"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." className="w-full bg-transparent text-content-primary outline-none text-xs resize-none max-h-[120px] leading-5 placeholder:text-content-faint" rows={1} style={{ height: '20px' }} />
              </div>
              <button className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${messageText.trim() && !sendingMessage ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-surface-button text-content-faint'}`} onClick={handleSendMessage} disabled={!messageText.trim() || sendingMessage}>{sendingMessage ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Send className="w-4 h-4" />}</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Context Menu */}
      {mobileContextMenu && (
        <div className="md:hidden fixed inset-0 z-[9998] flex items-end justify-center" onClick={() => setMobileContextMenu(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-surface-button rounded-t-2xl w-full max-w-lg p-4 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-surface-button rounded-full mx-auto mb-4" />
            <div className="space-y-1">
              <button onClick={() => { handleReplyToMessage(mobileContextMenu.message); setMobileContextMenu(null); }} className="w-full text-left px-4 py-3 text-base hover:bg-surface-button rounded-xl text-content-primary flex items-center gap-3"><Reply size={20} />Reply</button>
              <button onClick={() => { setShowReactionPicker(mobileContextMenu.messageId); setMobileContextMenu(null); }} className="w-full text-left px-4 py-3 text-base hover:bg-surface-button rounded-xl text-content-primary flex items-center gap-3"><Smile size={20} />React</button>
              <button onClick={() => handleCopyMessage(mobileContextMenu.message)} className="w-full text-left px-4 py-3 text-base hover:bg-surface-button rounded-xl text-content-primary flex items-center gap-3"><Copy size={20} />Copy</button>
              {mobileContextMenu.message?.sender === 'You' && <button onClick={() => { setShowDeleteConfirm(mobileContextMenu.messageId); setMobileContextMenu(null); }} className="w-full text-left px-4 py-3 text-base hover:bg-surface-button rounded-xl text-red-400 flex items-center gap-3"><Trash2 size={20} />Delete</button>}
            </div>
            <button onClick={() => setMobileContextMenu(null)} className="w-full mt-4 px-4 py-3 text-base bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary font-medium">Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-surface-button rounded-xl p-5 mx-4 max-w-sm w-full shadow-xl border border-border">
            <h4 className="text-content-primary font-medium mb-2">Delete Message?</h4>
            <p className="text-content-muted text-sm mb-4">This message will be marked as deleted and cannot be recovered.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover">Cancel</button>
              <button onClick={() => handleDeleteMessage(showDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reaction Picker */}
      {showReactionPicker && (
        <>
          <div className="fixed inset-0 z-[9998] bg-black/50" onClick={() => setShowReactionPicker(null)} />
          <div ref={reactionPickerRef} className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <Picker data={data} onEmojiSelect={(emoji) => handleReaction(showReactionPicker, emoji.native)} theme="dark" previewPosition="none" skinTonePosition="none" perLine={8} maxFrequentRows={2} />
          </div>
        </>
      )}

      {/* Mobile Email Views */}
      {activeScreen === "email-frontend" && !selectedEmail && (
        <div className="md:hidden fixed inset-0 bg-surface-base z-[60] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3"><button onClick={() => { setActiveScreen("chat"); setIsMessagesOpen(true); }} className="text-content-muted hover:text-content-primary p-1.5 hover:bg-surface-hover rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><h2 className="text-lg font-semibold text-content-primary">Email</h2></div>
            <button onClick={() => setShowEmailModal(true)} className="p-2 bg-primary hover:bg-primary-hover rounded-xl"><Send size={18} className="text-content-primary" /></button>
          </div>
          <div className="border-b border-border flex-shrink-0"><div className="flex overflow-x-auto px-2 py-2 gap-1" style={{ scrollbarWidth: 'none' }}>{emailFolders.map((folder) => { const Icon = folder.icon; const unreadCount = getUnreadCountForFolder(folder.id); const isActive = emailTab === folder.id; return <button key={folder.id} onClick={() => { setEmailTab(folder.id); setSelectedEmailIds([]); }} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary text-white" : "bg-surface-hover text-content-muted"}`}><Icon size={16} /><span>{folder.label}</span>{unreadCount > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-primary text-white"}`}>{unreadCount}</span>}</button> })}</div></div>
          <div className="px-3 py-2 border-b border-border flex-shrink-0"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" /><input type="text" placeholder="Search emails..." value={emailSearchQuery} onChange={(e) => setEmailSearchQuery(e.target.value)} className="w-full bg-surface-hover text-content-primary text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder-content-faint focus:outline-none focus:ring-1 focus:ring-primary/50" /></div></div>
          {selectedEmailIds.length > 0 && <div className="px-3 py-2 bg-surface-card border-b border-border flex items-center justify-between flex-shrink-0"><button onClick={() => setSelectedEmailIds([])} className="text-sm text-content-muted flex items-center gap-1"><X size={16} />{selectedEmailIds.length} selected</button><div className="flex items-center gap-2">{emailTab !== "draft" && emailTab !== "error" && emailTab !== "trash" && <><button onClick={() => bulkMarkAsRead(true)} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted"><MailCheck size={18} /></button><button onClick={() => bulkMarkAsRead(false)} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted"><MailOpen size={18} /></button><button onClick={bulkArchive} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted"><Archive size={18} /></button></>}<button onClick={bulkDelete} className="p-2 hover:bg-surface-button-hover rounded-lg text-red-400"><Trash2 size={18} /></button></div></div>}
          <div className="flex-1 overflow-y-auto select-none">{getPinnedEmails().length === 0 && getFilteredEmails(false).length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center p-6"><div className="w-20 h-20 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mb-4"><Mail className="w-10 h-10 text-content-faint" /></div><h3 className="text-content-primary font-medium text-lg mb-2">No emails</h3><p className="text-content-faint text-sm">No emails in this folder</p></div> : <div className="pb-20">{getPinnedEmails().length > 0 && <><div className="flex items-center gap-2 px-4 py-2 bg-surface-dark"><Pin size={12} className="text-primary fill-primary" /><span className="text-xs text-primary font-medium">Pinned</span><div className="flex-1 h-px bg-primary/30"></div></div>{getPinnedEmails().map((email) => <MobileEmailItem key={email.id} email={email} emailTab={emailTab} selectedEmailIds={selectedEmailIds} toggleEmailSelection={toggleEmailSelection} handleEmailItemClick={handleEmailItemClick} formatEmailTime={formatEmailTime} truncateEmailText={truncateEmailText} moveEmailToTrash={moveEmailToTrash} />)}</>}{getPinnedEmails().length > 0 && getFilteredEmails(false).length > 0 && <div className="h-px bg-surface-hover mx-4 my-2" />}{getFilteredEmails(false).map((email) => <MobileEmailItem key={email.id} email={email} emailTab={emailTab} selectedEmailIds={selectedEmailIds} toggleEmailSelection={toggleEmailSelection} handleEmailItemClick={handleEmailItemClick} formatEmailTime={formatEmailTime} truncateEmailText={truncateEmailText} moveEmailToTrash={moveEmailToTrash} />)}</div>}</div>
        </div>
      )}

      {activeScreen === "email-frontend" && selectedEmail && (
        <div className="md:hidden fixed inset-0 bg-surface-base z-[60] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3"><button onClick={() => setSelectedEmail(null)} className="text-content-muted hover:text-content-primary p-1.5 hover:bg-surface-hover rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><span className="font-medium text-content-primary text-sm">Email</span></div>
            <div className="flex items-center gap-1">{emailTab === "error" && <button onClick={() => retryFailedEmail(selectedEmail)} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><RefreshCw size={18} /></button>}{emailTab !== "trash" && emailTab !== "error" && <button onClick={() => updateEmailStatus(selectedEmail.id, { isPinned: !selectedEmail.isPinned })} className={`p-2 hover:bg-surface-button-hover rounded-lg ${selectedEmail.isPinned ? "text-primary" : "text-content-muted hover:text-content-primary"}`}>{selectedEmail.isPinned ? <PinOff size={18} /> : <Pin size={18} />}</button>}{emailTab !== "trash" && emailTab !== "error" && <button onClick={() => { updateEmailStatus(selectedEmail.id, { isArchived: !selectedEmail.isArchived }); setSelectedEmail(null); }} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-content-primary"><Archive size={18} /></button>}<button onClick={() => { if (emailTab === "trash") { setEmailsToDelete([selectedEmail.id]); setShowPermanentDeleteConfirm(true); } else { moveEmailToTrash(selectedEmail.id); } }} className="p-2 hover:bg-surface-button-hover rounded-lg text-content-muted hover:text-red-400"><Trash2 size={18} /></button></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4"><h2 className="text-lg font-semibold text-content-primary mb-3">{selectedEmail.subject}</h2><div className="flex items-start justify-between mb-4"><div><p className="text-sm text-content-primary font-medium">{selectedEmail.sender}</p>{selectedEmail.senderEmail && <p className="text-xs text-content-faint">&lt;{selectedEmail.senderEmail}&gt;</p>}<p className="text-xs text-content-faint mt-1">To: {selectedEmail.recipient}{selectedEmail.recipientEmail && <span> &lt;{selectedEmail.recipientEmail}&gt;</span>}</p></div><p className="text-xs text-content-faint">{formatEmailTime(selectedEmail.time)}</p></div>{selectedEmail.attachments?.length > 0 && <div className="mb-4 pb-4 border-b border-border select-none"><p className="text-sm font-medium text-content-muted mb-2 flex items-center gap-2"><Paperclip size={14} />Attachments ({selectedEmail.attachments.length})</p><div className="space-y-2">{selectedEmail.attachments.map((file, index) => <div key={index} className="flex items-center gap-2 px-3 py-2 bg-surface-hover rounded-lg"><Paperclip size={14} className="text-content-faint" /><span className="text-sm text-content-secondary">{file.name || file}</span>{file.size && <span className="text-xs text-content-faint">({file.size})</span>}</div>)}</div></div>}<div className="max-w-none bg-white p-4 rounded-xl" style={{ color: 'var(--color-content-primary)', fontSize: '14px', lineHeight: '1.5', fontFamily: 'Arial, sans-serif' }} dangerouslySetInnerHTML={{ __html: selectedEmail.body }} /></div>
          {emailTab !== "trash" && emailTab !== "draft" && <div className="p-3 border-t border-border bg-surface-card">{emailTab === "error" ? <button onClick={() => retryFailedEmail(selectedEmail)} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><RefreshCw size={16} />Retry Send</button> : <button onClick={() => handleEmailReply(selectedEmail)} className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Reply size={16} />Reply</button>}</div>}
        </div>
      )}

      {/* Copied Toast */}
      {showCopiedToast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-surface-hover text-content-primary px-4 py-2 rounded-lg shadow-lg text-sm font-medium">Copied!</div>}

      {/* Floating Broadcast Button - Mobile */}
      {((activeScreen === "chat" && !selectedChat) || (activeScreen === "email-frontend" && !selectedEmail)) && <button onClick={() => setShowBroadcastModal(true)} className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-[70]"><IoIosMegaphone size={22} /></button>}

      {/* Modals */}
      <>
        <ShowAppointmentModal isOpen={showAppointmentModal} selectedMemberMain={selectedMember} appointmentTypesMain={appointmentTypes} getMemberAppointmentsMain={getMemberAppointments} handleEditAppointmentMain={handleEditAppointment} handleDeleteAppointmentMain={handleCancelAppointment} handleManageContingentMain={handleManageContingent} handleCreateNewAppointmentMain={handleCreateNewAppointment} currentBillingPeriodMain={currentBillingPeriod} memberContingent={memberContingentData} onClose={() => { setShowAppointmentModal(false); setSelectedMember(null); }} />
        <SendEmailModal showEmailModal={showEmailModal} handleCloseEmailModal={() => { setShowEmailModal(false); setEditingDraft(null); setEmailData({ to: "", subject: "", body: "" }); }} handleSendEmail={handleSendEmail} emailData={emailData} setEmailData={setEmailData} handleSearchMemberForEmail={handleSearchMemberForEmail} signature={settings?.emailSignature || ""} editingDraft={editingDraft} onSaveAsDraft={handleSaveEmailAsDraft} />
        <SendEmailReplyModal isOpen={showReplyModal} onClose={closeReplyModal} originalEmail={selectedEmail} initialRecipient={replyInitialRecipient} searchMembers={handleSearchMemberForReply} onSendReply={handleSendReply} onSaveAsDraft={handleSaveReplyAsDraft} />
        {showPermanentDeleteConfirm && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4"><div className="bg-surface-card rounded-xl w-full max-w-md p-6"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center"><Trash2 className="w-6 h-6 text-red-400" /></div><div><h3 className="text-lg font-semibold text-content-primary">Delete Permanently?</h3><p className="text-sm text-content-faint">This action cannot be undone</p></div></div><p className="text-content-muted text-sm mb-6">{emailsToDelete.length === 1 ? "Are you sure you want to permanently delete this email?" : `Are you sure you want to permanently delete ${emailsToDelete.length} emails?`}</p><div className="flex justify-end gap-3"><button onClick={() => { setShowPermanentDeleteConfirm(false); setEmailsToDelete([]); }} className="px-4 py-2.5 bg-surface-button-hover text-content-primary rounded-xl text-sm font-medium">Cancel</button><button onClick={confirmPermanentDelete} className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete Permanently</button></div></div></div>}
        <ArchiveModal showArchive={showArchive} setShowArchive={setShowArchive} archivedChats={archivedChats} handleRestoreChat={(id) => handleRestoreChat(id)} chatType={chatType} />
        {showCreateAppointmentModal && <CreateAppointmentModal isOpen={showCreateAppointmentModal} onClose={() => setShowCreateAppointmentModal(false)} appointmentTypesMain={appointmentTypes} onSubmit={handleAddAppointmentSubmit} setIsNotifyMemberOpenMain={setIsNotifyMemberOpen} setNotifyActionMain={setNotifyAction} freeAppointmentsMain={freeAppointmentsData} availableMembersLeads={availableMembersLeadsMain} searchMembersMain={searchMembersMain} selectedMemberMain={selectedChat && chatType === "member" ? (() => { const member = membersData.find(m => m.id === selectedChat.id); return { id: selectedChat.id, name: selectedChat.name, firstName: member?.firstName || selectedChat.name?.split(" ")[0] || "", lastName: member?.lastName || selectedChat.name?.split(" ").slice(1).join(" ") || "", image: selectedChat.logo, title: selectedChat.name, note: member?.note || "", noteImportance: member?.noteImportance || "unimportant", noteStartDate: member?.noteStartDate || "", noteEndDate: member?.noteEndDate || "" }; })() : null} memberCredits={selectedChat && chatType === "member" ? memberContingentData[selectedChat.id] : null} currentBillingPeriod={currentBillingPeriod} memberRelations={memberRelationsState} onOpenEditMemberModal={handleEditMember} />}
        {showSelectedAppointmentModal && selectedAppointmentData && <EditAppointmentModalMain selectedAppointmentMain={selectedAppointmentData} setSelectedAppointmentMain={setSelectedAppointmentData} appointmentTypesMain={appointmentTypes} freeAppointmentsMain={freeAppointmentsData} handleAppointmentChange={handleAppointmentChange} appointmentsMain={appointments} setAppointmentsMain={setAppointments} setIsNotifyMemberOpenMain={setIsNotifyMemberOpen} setNotifyActionMain={setNotifyAction} onDelete={handleDeleteAppointment} onOpenEditMemberModal={handleEditMember} memberRelations={memberRelationsState} onClose={() => { setShowSelectedAppointmentModal(false); setSelectedAppointmentData(null); }} />}
        <ContingentModal showContingentModalMain={showContingentModal} setShowContingentModalMain={setShowContingentModal} selectedMemberForAppointmentsMain={selectedMember} getBillingPeriodsMain={getBillingPeriods} selectedBillingPeriodMain={selectedBillingPeriod} handleBillingPeriodChange={setSelectedBillingPeriod} setShowAddBillingPeriodModalMain={setShowAddBillingPeriodModal} tempContingentMain={tempContingent} setTempContingentMain={setTempContingent} currentBillingPeriodMain={currentBillingPeriod} handleSaveContingentMain={handleSaveContingent} />
        <AddBillingPeriodModal open={showAddBillingPeriodModal} onClose={() => setShowAddBillingPeriodModal(false)} newBillingPeriodMain={newBillingPeriod} setNewBillingPeriodMain={setNewBillingPeriod} onAdd={handleAddBillingPeriod} />
        <NotifyModal isOpen={isNotifyMemberOpen} onClose={() => setIsNotifyMemberOpen(false)} notifyAction={notifyAction} />
        <ViewMemberModal isOpen={showMemberConfirmation} onClose={() => { setShowMemberConfirmation(false); setSelectedMemberForConfirmation(null); }} onConfirm={handleConfirmViewMember} member={selectedMemberForConfirmation} onEditMember={(member, tab) => handleEditMember(member, tab)} relationsCount={selectedMemberForConfirmation ? getRelationsCount(selectedMemberForConfirmation.id) : 0} />
        <ViewStaffModal isOpen={showStaffConfirmation} onClose={() => { setShowStaffConfirmation(false); setSelectedStaffForConfirmation(null); }} onConfirm={handleConfirmViewStaff} staff={selectedStaffForConfirmation} />
        <EditMemberModalMain isOpen={showEditMemberModal} onClose={() => { setShowEditMemberModal(false); setEditingMember(null); }} selectedMemberMain={editingMember} editModalTabMain={editMemberInitialTab} setEditModalTabMain={setEditMemberInitialTab} editFormMain={editFormMain} handleInputChangeMain={handleEditInputChange} handleEditSubmitMain={handleSaveEditedMember} editingRelationsMain={editingRelationsMain} setEditingRelationsMain={setEditingRelationsMain} newRelationMain={newRelationMain} setNewRelationMain={setNewRelationMain} availableMembersLeadsMain={availableMembersLeadsMain} relationOptionsMain={relationOptionsMain} handleAddRelationMain={handleAddRelationMain} memberRelationsMain={memberRelationsState} handleDeleteRelationMain={handleDeleteRelationMain} handleArchiveMemberMain={handleArchiveMemberMain} handleUnarchiveMemberMain={handleUnarchiveMemberMain} />
      </>
    </div>
  )
}