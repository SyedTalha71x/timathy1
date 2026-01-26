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
} from "lucide-react"

import { ToastContainer } from "react-toastify"
import { IoIosMegaphone } from "react-icons/io"
import CommuncationBg from "../../../public/communication-bg.svg"
import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { WysiwygEditor } from "../../components/shared/WysiwygEditor"

import { appointmentNotificationTypesNew, appointmentsNew, companyChatListNew, emailListNew, emailTemplatesNew, memberChatListNew, memberContingentDataNew, memberHistoryNew, membersNew, memberRelationsNew, preConfiguredMessagesNew, settingsNew, staffChatListNew, appointmentTypesData, freeAppointmentsData, availableMembersLeadsMain, staffData, getLastMessage, getLastMessageContent, getLastMessageTime, getUnreadCount, isChatRead, getLastMessageStatus, relationOptionsMain } from "../../utils/user-panel-states/app-states"
import { membersData } from "../../utils/user-panel-states/app-states"

import CreateAppointmentModal from "../../components/shared/appointments/CreateAppointmentModal"
import BirthdayBadge from "../../components/shared/BirthdayBadge"
import EditMemberModalMain from "../../components/user-panel-components/members-components/EditMemberModal"
// EmailManagement removed - Email is now natively integrated
// import EmailManagement from "../../components/user-panel-components/communication-components/EmailManagement"
import ContingentModal from "../../components/shared/appointments/ShowContigentModal"
import CreateMessageModal from "../../components/user-panel-components/communication-components/CreateMessageModal"
import AddBillingPeriodModal from "../../components/shared/appointments/AddBillingPeriodModal"
import NotifyMemberModal from "../../components/shared/appointments/NotifyMemberModal"
import ArchiveModal from "../../components/user-panel-components/communication-components/ArchiveModal"
import DraftModal from "../../components/user-panel-components/communication-components/DraftModal"
import SendEmailModal from "../../components/shared/SendEmailModal"
import BroadcastModal from "../../components/user-panel-components/communication-components/broadcast-modal-components/BroadcastModal"
import ShowAppointmentModal from "../../components/shared/appointments/ShowAppointmentModal"
import EditAppointmentModalMain from '../../components/shared/appointments/EditAppointmentModal'
import ViewMemberConfirmationModal from "../../components/user-panel-components/communication-components/broadcast-modal-components/ViewConfirmationModal"


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
            className={`border-b ${isUserMessage ? 'border-white/60' : 'border-gray-400'}`}
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

  // Blue for staff, Orange for members
  const bgColor = isStaff ? "bg-blue-600" : "bg-orange-500"

  return (
    <div 
      className={`${bgColor} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
};

// Truncate text for reply preview
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function Communications() {
  // Router hooks for external navigation
  const location = useLocation();
  const navigate = useNavigate();
  
  // UI States
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
  const [chatType, setChatType] = useState("member")
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
  const [mobileContextMenu, setMobileContextMenu] = useState(null) // { messageId, x, y }
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [showCopiedToast, setShowCopiedToast] = useState(false)

  // Email States
  const [emailList, setEmailList] = useState(emailListNew)
  const [emailTemplates, setEmailTemplates] = useState(emailTemplatesNew)
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  })

  // Modal States
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [showMemberConfirmation, setShowMemberConfirmation] = useState(false)
  const [selectedMemberForConfirmation, setSelectedMemberForConfirmation] = useState(null)
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [editMemberInitialTab, setEditMemberInitialTab] = useState("note")
  const [editFormMain, setEditFormMain] = useState({})
  const [editingRelationsMain, setEditingRelationsMain] = useState({})
  const [newRelationMain, setNewRelationMain] = useState({ category: "", member: null })
  const [memberRelationsState, setMemberRelationsState] = useState(memberRelationsNew)

  // Email States (native integration)
  const [emailTab, setEmailTab] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [emailSearchQuery, setEmailSearchQuery] = useState("")
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyData, setReplyData] = useState({ to: "", toName: "", cc: "", bcc: "", subject: "", body: "" })
  const [replyAttachments, setReplyAttachments] = useState([])
  const [showOriginalMessage, setShowOriginalMessage] = useState(true)

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

  // Chat list states - initialized from imported data
  const [companyChatListState, setCompanyChatListState] = useState(
    companyChatListNew.map(chat => ({ ...chat, markedUnread: chat.markedUnread || false }))
  )
  const [staffChatListState, setStaffChatListState] = useState(
    staffChatListNew.map(chat => ({ ...chat, markedUnread: chat.markedUnread || false }))
  )
  
  // Constants (for backwards compatibility references)
  const memberChatList = memberChatListNew
  const currentBillingPeriod = "04.14.25 - 04.18.2025"

  // EFFECTS SECTION
  
  // Disable parent scrolling and reset scroll position when this component is mounted
  useEffect(() => {
    // Reset scroll position to top immediately
    window.scrollTo(0, 0);
    
    // Find the main container element
    const mainContainer = document.querySelector('main');
    const originalOverflow = mainContainer?.style.overflow;
    const originalScrollTop = mainContainer?.scrollTop;
    
    if (mainContainer) {
      // Reset scroll position of main container
      mainContainer.scrollTop = 0;
      // Disable scrolling
      mainContainer.style.overflow = 'hidden';
    }
    
    // Also reset any parent scrollable containers
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
      dashboardContent.scrollTop = 0;
    }
    
    // Reset body scroll as well
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Cleanup: restore overflow when component unmounts
    return () => {
      if (mainContainer) {
        mainContainer.style.overflow = originalOverflow || '';
      }
    };
  }, []);

  // Helper function to check if today is someone's birthday
  const checkIfBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate();
  };

  // Track if member chat list was already initialized
  const memberChatInitializedRef = useRef(false);

  // Single useEffect to handle chat list initialization based on chatType
  useEffect(() => {
    if (chatType === "member" && !memberChatInitializedRef.current) {
      memberChatInitializedRef.current = true;
      
      // Start with existing chat data (which has messages)
      // IMPORTANT: Use memberId as the chat id for consistency
      const existingChats = memberChatListNew.map(chat => {
        const member = membersData.find(m => m.id === chat.memberId);
        return {
          ...chat,
          id: chat.memberId, // Use memberId as the unique identifier
          logo: chat.logo || member?.image || null,
          dateOfBirth: member?.dateOfBirth || null, // Add dateOfBirth for age calculation in tooltip
          isBirthday: checkIfBirthday(member?.dateOfBirth),
          markedUnread: chat.markedUnread || false,
        };
      });
      
      // Get IDs of members who already have chats
      const existingMemberIds = existingChats.map(chat => chat.memberId);
      
      // Add remaining active members without existing chats
      const additionalChats = membersData
        .filter(member => member.isActive && !member.isArchived && !existingMemberIds.includes(member.id))
        .map(member => ({
          id: member.id, // Use member.id as the chat id (same as memberId)
          memberId: member.id,
          name: `${member.firstName} ${member.lastName}`,
          email: member.email,
          logo: member.image || null,
          dateOfBirth: member.dateOfBirth || null, // Add dateOfBirth for age calculation in tooltip
          messages: [],
          isBirthday: checkIfBirthday(member.dateOfBirth),
          isArchived: false,
          markedUnread: false,
        }));
    
      setChatList([...existingChats, ...additionalChats]);
    }
    // Note: For "staff" and "company" chatTypes, we use staffChatListState and companyChatListState directly
    // via getCombinedChatList(), so we don't need to set chatList here
  }, [chatType]);

  // Handle navigation from ChatPopup or other components
  // Stored in ref to prevent re-triggering
  const pendingNavigationRef = useRef(null);
  const hasProcessedNavigationRef = useRef(false);
  
  // Store navigation state when it arrives
  useEffect(() => {
    if (location.state?.openChatId && location.state?.openChatType && !hasProcessedNavigationRef.current) {
      pendingNavigationRef.current = {
        openChatId: location.state.openChatId,
        openChatType: location.state.openChatType
      };
      // Clear navigation state immediately to prevent issues
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // Process pending navigation after chat lists are loaded
  useEffect(() => {
    if (!pendingNavigationRef.current || hasProcessedNavigationRef.current) return;
    
    const { openChatId, openChatType } = pendingNavigationRef.current;
    
    // Check if we have the necessary data loaded
    const hasMemberData = chatList.length > 0;
    const hasStaffData = staffChatListState.length > 0;
    
    if ((openChatType === "member" && !hasMemberData) || 
        (openChatType === "company" && !hasStaffData)) {
      return; // Wait for data to load
    }
    
    // Mark as processed
    hasProcessedNavigationRef.current = true;
    pendingNavigationRef.current = null;
    
    // Set the correct chat type first (without triggering re-initialization)
    if (chatType !== openChatType) {
      setChatType(openChatType);
    }
    
    // Small delay to ensure chatType change is reflected
    setTimeout(() => {
      let targetChat = null;
      
      if (openChatType === "member") {
        // Find in member chat list - check both id and memberId with type coercion
        const searchId = Number(openChatId);
        targetChat = chatList.find(c => 
          c.id === searchId || 
          c.memberId === searchId ||
          c.id === openChatId || 
          c.memberId === openChatId
        );
        
        // Don't create new chats - the initialization already adds all active members
        if (targetChat) {
          // Mark messages as read and select chat
          const updatedMessages = (targetChat.messages || []).map(msg => ({
            ...msg,
            status: msg.sender !== "You" ? "read" : msg.status
          }));
          const updatedChat = { ...targetChat, messages: updatedMessages, markedUnread: false };
          setSelectedChat(updatedChat);
          setMessages(updatedMessages);
          
          // Update chat list
          setChatList(prevList => prevList.map(c => 
            (c.id === targetChat.id || c.memberId === targetChat.memberId) ? updatedChat : c
          ));
        }
      } else if (openChatType === "company") {
        // Find in staff chat list
        const searchId = Number(openChatId);
        targetChat = staffChatListState.find(c => 
          c.id === searchId || 
          c.staffId === searchId ||
          c.id === openChatId || 
          c.staffId === openChatId
        );
        
        if (targetChat) {
          const updatedMessages = (targetChat.messages || []).map(msg => ({
            ...msg,
            status: msg.sender !== "You" ? "read" : msg.status
          }));
          const updatedChat = { ...targetChat, messages: updatedMessages, markedUnread: false };
          setSelectedChat(updatedChat);
          setMessages(updatedMessages);
          
          // Update staff chat list
          setStaffChatListState(prevList => prevList.map(c => 
            (c.id === targetChat.id || c.staffId === targetChat.staffId) ? updatedChat : c
          ));
        }
      }
      
      // Set UI state to show the chat
      if (targetChat) {
        setIsMessagesOpen(false);
        setActiveScreen("chat");
        setReplyingTo(null);
        setSearchMember("");
      }
      
      // Reset the flag after a delay so new navigations can work
      setTimeout(() => {
        hasProcessedNavigationRef.current = false;
      }, 1000);
    }, 150);
  }, [chatList, staffChatListState]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      birthdaySendApp: typeof prev.birthdaySendApp === "boolean" ? prev.birthdaySendApp : false,
      birthdaySendEmail: typeof prev.birthdaySendEmail === "boolean" ? prev.birthdaySendEmail : false,
    }))

    setAppointmentNotificationTypes((prev) => ({
      ...prev,
      confirmation: {
        ...(prev.confirmation || {}),
        sendApp: typeof prev.confirmation?.sendApp === "boolean" ? prev.confirmation.sendApp : false,
        sendEmail: typeof prev.confirmation?.sendEmail === "boolean" ? prev.confirmation.sendEmail : false,
      },
      cancellation: {
        ...(prev.cancellation || {}),
        sendApp: typeof prev.cancellation?.sendApp === "boolean" ? prev.cancellation.sendApp : false,
        sendEmail: typeof prev.cancellation?.sendEmail === "boolean" ? prev.cancellation.sendEmail : false,
      },
      rescheduled: {
        ...(prev.rescheduled || {}),
        sendApp: typeof prev.rescheduled?.sendApp === "boolean" ? prev.rescheduled.sendApp : false,
        sendEmail: typeof prev.rescheduled?.sendEmail === "boolean" ? prev.rescheduled.sendEmail : false,
      },
      reminder: {
        ...(prev.reminder || {}),
        enabled: typeof prev.reminder?.enabled === "boolean" ? prev.reminder.enabled : false,
        template: typeof prev.reminder?.template === "string" ? prev.reminder.template : "",
        hoursBefore: typeof prev.reminder?.hoursBefore === "number" ? prev.reminder.hoursBefore : 24,
        sendApp: typeof prev.reminder?.sendApp === "boolean" ? prev.reminder.sendApp : false,
        sendEmail: typeof prev.reminder?.sendEmail === "boolean" ? prev.reminder.sendEmail : false,
      },
    }))
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    if (mobileMessagesContainerRef.current) {
      mobileMessagesContainerRef.current.scrollTop = mobileMessagesContainerRef.current.scrollHeight;
    }
  }, [messages])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }

      // Emoji Picker - improved detection for Shadow DOM and Web Components
      if (showEmojiPicker) {
        const isInsideEmojiPicker = emojiPickerRef.current?.contains(event.target);
        const isEmojiButton = event.target.closest('button[aria-label="Add emoji"]');
        
        // Check for emoji-mart elements - they use Web Components with Shadow DOM
        // composedPath() gives us all elements including those in Shadow DOM
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
        // Check composedPath for Shadow DOM elements
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

  // FUNCTIONS SECTION

  const handleTemplateSelect = (template) => {
    setSelectedEmailTemplate(template)
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body,
    })
    setShowTemplateDropdown(false)
  }

  const handleSaveDraft = () => {
    const newDraft = {
      id: Date.now(),
      recipient: emailData.to || "draft@example.com",
      subject: emailData.subject || "Draft Email Subject",
      body: emailData.body || "This is a draft email.",
      status: "Draft",
      time: new Date().toISOString(),
      isRead: true,
      isPinned: false,
      isArchived: false,
    }

    setEmailList((prev) => ({
      ...prev,
      draft: [newDraft, ...prev.draft],
    }))

    setShowDraftModal(false)
    setShowEmailModal(false)
    setEmailData({ to: "", subject: "", body: "" })
    setSelectedEmailTemplate(null)
    alert("Draft saved successfully!")
  }

  const handleDiscardDraft = () => {
    setShowDraftModal(false)
    setShowEmailModal(false)
    setEmailData({ to: "", subject: "", body: "" })
    setSelectedEmailTemplate(null)
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
      // Check if it's the main studio chat or a staff chat
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
      // Check if it's the main studio chat or a staff chat
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

    if (chatType === "company") {
      return;
    }

    let member = members.find((m) => m.id === chatId);
    if (!member) {
      const chat = chatList.find((c) => c.id === chatId) || archivedChats.find((c) => c.id === chatId);
      if (chat) {
        member = members.find((m) => m.name === chat.name);
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
      window.location.href = `/dashboard/member-details/${selectedMemberForConfirmation.id}`;
    }
    setShowMemberConfirmation(false);
    setSelectedMemberForConfirmation(null);
  };

  // ==========================================
  // MESSAGE HANDLING FUNCTIONS
  // ==========================================

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return
    const now = new Date();
    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: messageText,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now.toISOString(),
      isUnread: false,
      status: "sent",
      isDeleted: false,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender
      } : null
    }
    setMessages([...messages, newMessage])
    
    // Update the appropriate chat list based on chatType
    if (chatType === "member") {
      // Update chatList for member chats
      setChatList((prevList) =>
        prevList.map((chat) =>
          chat.id === selectedChat.id
            ? {
              ...chat,
              messages: [...(chat.messages || []), newMessage],
            }
            : chat,
        ),
      )
    } else if (chatType === "company") {
      // Update company or staff chat state
      if (selectedChat.id === 100 || selectedChat.isCompany) {
        // Company chat
        setCompanyChatListState((prevList) =>
          prevList.map((chat) =>
            chat.id === selectedChat.id
              ? {
                ...chat,
                messages: [...(chat.messages || []), newMessage],
              }
              : chat,
          ),
        )
      } else {
        // Staff chat
        setStaffChatListState((prevList) =>
          prevList.map((chat) =>
            chat.id === selectedChat.id
              ? {
                ...chat,
                messages: [...(chat.messages || []), newMessage],
              }
              : chat,
          ),
        )
      }
    }

    // Also update selectedChat to reflect the new message
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...(prev.messages || []), newMessage]
    } : prev);

    if (archivedChats.some((chat) => chat.id === selectedChat.id)) {
      handleRestoreChat(selectedChat.id)
    }

    setMessageText("")
    setReplyingTo(null)
    setShowEmojiPicker(false)

    // Reset textarea height for both desktop and mobile
    if (textareaRef.current) {
      textareaRef.current.style.height = '32px';
    }
    if (mobileTextareaRef.current) {
      mobileTextareaRef.current.style.height = '32px';
    }

    // Auto-scroll to bottom for both desktop and mobile
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      if (mobileMessagesContainerRef.current) {
        mobileMessagesContainerRef.current.scrollTop = mobileMessagesContainerRef.current.scrollHeight;
      }
    }, 50);

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      // Also update in the appropriate chat list
      if (chatType === "member") {
        setChatList((prevList) =>
          prevList.map((chat) =>
            chat.id === selectedChat.id
              ? { ...chat, messages: chat.messages.map((msg) => msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg) }
              : chat
          )
        )
      } else if (chatType === "company") {
        if (selectedChat.id === 100 || selectedChat.isCompany) {
          setCompanyChatListState((prevList) =>
            prevList.map((chat) =>
              chat.id === selectedChat.id
                ? { ...chat, messages: chat.messages.map((msg) => msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg) }
                : chat
            )
          )
        } else {
          setStaffChatListState((prevList) =>
            prevList.map((chat) =>
              chat.id === selectedChat.id
                ? { ...chat, messages: chat.messages.map((msg) => msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg) }
                : chat
            )
          )
        }
      }
    }, 1000)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      // Also update in the appropriate chat list
      if (chatType === "member") {
        setChatList((prevList) =>
          prevList.map((chat) =>
            chat.id === selectedChat.id
              ? { ...chat, messages: chat.messages.map((msg) => msg.id === newMessage.id ? { ...msg, status: "read" } : msg) }
              : chat
          )
        )
      } else if (chatType === "company") {
        if (selectedChat.id === 100 || selectedChat.isCompany) {
          setCompanyChatListState((prevList) =>
            prevList.map((chat) =>
              chat.id === selectedChat.id
                ? { ...chat, messages: chat.messages.map((msg) => msg.id === newMessage.id ? { ...msg, status: "read" } : msg) }
                : chat
            )
          )
        } else {
          setStaffChatListState((prevList) =>
            prevList.map((chat) =>
              chat.id === selectedChat.id
                ? { ...chat, messages: chat.messages.map((msg) => msg.id === newMessage.id ? { ...msg, status: "read" } : msg) }
                : chat
            )
          )
        }
      }
    }, 3000)
  }

  // Handle reaction with full emoji picker (like ChatPopup)
  const handleReaction = (messageId, emoji) => {
    setMessageReactions((prev) => {
      const newReactions = { ...prev };
      
      // Toggle reaction - if same emoji clicked, remove it
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

  // Delete message - mark as deleted instead of removing
  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isDeleted: true, content: "" }
        : msg
    ));
    // Remove reactions for deleted message
    setMessageReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[messageId];
      return newReactions;
    });
    // Update the appropriate chat list based on chatType
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

  // Mobile Long Press handlers
  const handleTouchStart = (message, e) => {
    if (message.isDeleted) return;
    const timer = setTimeout(() => {
      // Vibrate if supported
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

  const handleEmailClick = () => {
    setActiveScreen("email-frontend")
    setSelectedChat(null)
    setIsMessagesOpen(false)
  }

  // Email helper functions
  const emailFolders = [
    { id: "inbox", label: "Inbox", icon: Inbox, showCount: true, count: () => emailList.inbox?.filter(e => !e.isRead && !e.isArchived).length || 0 },
    { id: "sent", label: "Sent", icon: Send, showCount: false },
    { id: "draft", label: "Drafts", icon: FileText, showCount: false },
    { id: "archive", label: "Archive", icon: Archive, showCount: false },
    { id: "trash", label: "Trash", icon: Trash2, showCount: false },
  ]

  const getFilteredEmails = () => {
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

    return emails.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.time) - new Date(a.time)
    })
  }

  const handleEmailItemClick = (email) => {
    setSelectedEmail(email)
    if (!email.isRead && emailTab === "inbox") {
      setEmailList(prev => {
        const newList = { ...prev }
        Object.keys(newList).forEach(folder => {
          if (Array.isArray(newList[folder])) {
            newList[folder] = newList[folder].map(e => e.id === email.id ? { ...e, isRead: true } : e)
          }
        })
        return newList
      })
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
  }

  const moveEmailToTrash = (emailId) => {
    setEmailList(prev => {
      const newList = { ...prev }
      let emailToMove = null
      Object.keys(newList).forEach(folder => {
        if (folder !== "trash" && Array.isArray(newList[folder])) {
          const idx = newList[folder].findIndex(e => e.id === emailId)
          if (idx !== -1) {
            emailToMove = newList[folder][idx]
            newList[folder].splice(idx, 1)
          }
        }
      })
      if (emailToMove) {
        newList.trash = [...(newList.trash || []), { ...emailToMove, deletedAt: new Date().toISOString() }]
      }
      return newList
    })
    if (selectedEmail?.id === emailId) setSelectedEmail(null)
  }

  const handleEmailReply = (email) => {
    setReplyData({
      to: email.senderEmail || email.sender,
      toName: email.sender,
      cc: "",
      bcc: "",
      subject: email.subject.startsWith("Re: ") ? email.subject : `Re: ${email.subject}`,
      body: "",
    })
    setReplyAttachments([])
    setShowOriginalMessage(true)
    setShowReplyModal(true)
  }

  const sendEmailReply = () => {
    const newReply = {
      id: Date.now().toString(),
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: replyData.toName || replyData.to,
      recipientEmail: replyData.to,
      subject: replyData.subject,
      body: replyData.body + (showOriginalMessage && selectedEmail ? `<div style="margin-top:30px;padding-top:20px;border-top:1px solid #444;color:#888;font-size:12px;"><strong>--- Original Message ---</strong><br/><strong>From:</strong> ${selectedEmail.sender}${selectedEmail.senderEmail ? ` &lt;${selectedEmail.senderEmail}&gt;` : ''}<br/><strong>Date:</strong> ${new Date(selectedEmail.time).toLocaleString()}<br/><strong>Subject:</strong> ${selectedEmail.subject}<br/><br/>${selectedEmail.body}</div>` : ""),
      time: new Date().toISOString(),
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Sent",
      attachments: replyAttachments,
    }
    setEmailList(prev => ({ ...prev, sent: [newReply, ...(prev.sent || [])] }))
    setShowReplyModal(false)
    setReplyData({ to: "", toName: "", cc: "", bcc: "", subject: "", body: "" })
    setReplyAttachments([])
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
    setEmailList(prev => {
      const newList = { ...prev }
      let emailToMove = null
      let sourceFolder = null
      
      // Find and remove email from current folder
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
        // Handle special folder logic
        if (targetFolder === 'archive') {
          emailToMove.isArchived = true
        } else {
          emailToMove.isArchived = false
        }
        if (targetFolder === 'trash') {
          emailToMove.deletedAt = new Date().toISOString()
        }
        
        // Add to target folder
        if (!newList[targetFolder]) newList[targetFolder] = []
        newList[targetFolder] = [emailToMove, ...newList[targetFolder]]
      }
      
      return newList
    })
    
    if (selectedEmail?.id === emailId || selectedEmail?.id === parseInt(emailId)) {
      setSelectedEmail(null)
    }
  }

  const handleSendEmail = (emailDataWithAttachments) => {
    // SendEmailModal liefert to als Array, also prüfen wir die Länge
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

    setEmailList(prev => ({
      ...prev,
      sent: [newEmail, ...prev.sent]
    }));

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

    if (!message) {
      return;
    }

    if (recipients.length === 0) {
      return;
    }

    // Broadcast sent - no alert, no screen change
    // The BroadcastModal handles its own success state
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
    setShowCreateMessageModal(false)
    setNewMessage({ title: "", message: "", folderId: 1 })
  }

  const handleChatSelect = (chat) => {
    // Handle new chats (members not yet in chat list)
    if (chat.isNewChat && chatType === "member") {
      // Get member data for dateOfBirth
      const member = membersData.find(m => m.id === chat.memberId);
      
      // Create a proper chat entry and add to chatList
      // Use memberId as the chat id for consistency
      const newChat = {
        id: chat.memberId, // Use memberId as the unique identifier
        memberId: chat.memberId,
        name: chat.name,
        logo: chat.logo,
        dateOfBirth: member?.dateOfBirth || null, // Add dateOfBirth for age calculation in tooltip
        isBirthday: chat.isBirthday || false,
        isArchived: false,
        markedUnread: false,
        messages: []
      };
      setChatList(prevList => [newChat, ...prevList]);
      setSelectedChat(newChat);
      setMessages([]);
    } else {
      // Mark messages as read when opening chat and clear markedUnread flag
      const updatedMessages = (chat.messages || []).map(msg => ({
        ...msg,
        status: msg.sender !== "You" ? "read" : msg.status
      }));
      
      const updatedChat = { ...chat, messages: updatedMessages, markedUnread: false };
      setSelectedChat(updatedChat);
      setMessages(updatedMessages);
      
      // Update the appropriate chat list based on type
      if (chatType === "member") {
        setChatList(prevList => prevList.map(c => 
          c.id === chat.id ? updatedChat : c
        ));
      } else if (chatType === "company") {
        // Update company or staff chat state
        if (chat.id === 100 || chat.isCompany) {
          setCompanyChatListState(prevList => prevList.map(c => 
            c.id === chat.id ? updatedChat : c
          ));
        } else {
          setStaffChatListState(prevList => prevList.map(c => 
            c.id === chat.id ? updatedChat : c
          ));
        }
      }
    }
    setIsMessagesOpen(false);
    setActiveScreen("chat");
    setReplyingTo(null);
    setSearchMember(""); // Clear search after selection
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
    const allMembers = [...staffChatListState, ...memberChatList].filter(
      (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.email?.toLowerCase().includes(query.toLowerCase()),
    )
    return allMembers
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
    // Filter out archived chats
    const activeChats = list.filter(chat => {
      if (chat.type === 'separator') return true;
      return !archivedChats.some(archived => archived.id === chat.id);
    });
    return activeChats;
  };

  // Get pinned and unpinned chats separately
  const getPinnedAndUnpinnedChats = () => {
    const allChats = getSortedChatList();
    const pinned = allChats.filter(chat => chat.type !== 'separator' && pinnedChats.has(chat.id));
    const unpinned = allChats.filter(chat => chat.type === 'separator' || !pinnedChats.has(chat.id));
    return { pinned, unpinned };
  };

  const getCombinedChatList = () => {
    if (chatType === "company") {
      // For company/studio tab, use state-managed lists
      const allStaffChats = staffData.map(staff => {
        // Check if there's an existing chat for this staff member in state
        const existingChat = staffChatListState.find(chat => chat.staffId === staff.id);
        if (existingChat) {
          return {
            ...existingChat,
            dateOfBirth: staff.dateOfBirth || existingChat.dateOfBirth || null,
            isBirthday: checkIfBirthday(staff.dateOfBirth) || existingChat.isBirthday
          };
        }
        // Create a new empty chat entry for staff without existing chat
        return {
          id: 100 + staff.id,
          staffId: staff.id,
          name: `${staff.firstName} ${staff.lastName}`,
          logo: staff.image || null,
          dateOfBirth: staff.dateOfBirth || null, // Add dateOfBirth for age calculation in tooltip
          isBirthday: checkIfBirthday(staff.dateOfBirth),
          isArchived: false,
          markedUnread: false,
          messages: []
        };
      });
      return [...companyChatListState, { id: "separator", type: "separator" }, ...allStaffChats];
    } else if (chatType === "member") {
      // For member tab, use chatList which has the updated read/unread states
      return chatList;
    }
  
    return staffChatListState;
  };

  // Extended search that includes members/staff not in chat list
  const getSearchResults = () => {
    if (!searchMember) return [];
    
    const lowerQuery = searchMember.toLowerCase();
    const existingChats = getCombinedChatList().filter((chat) =>
      chat.type !== 'separator' && chat.name?.toLowerCase().includes(lowerQuery)
    );
    
    if (chatType === "member") {
      // Also search for members who don't have a chat yet
      // Use memberId for consistency (id === memberId for member chats)
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
          dateOfBirth: member.dateOfBirth || null, // Add dateOfBirth for age calculation in tooltip
          isBirthday: checkIfBirthday(member.dateOfBirth),
          isArchived: false,
          isNewChat: true, // Flag to indicate this is a new chat
          messages: []
        }));
      
      return [...existingChats, ...newMemberChats];
    }
    
    return existingChats;
  };

  const searchResults = getSearchResults();

  // Calculate total unread messages for each tab
  const getTotalUnreadCount = (type) => {
    if (type === "member") {
      // Count chats with unread messages OR manually marked as unread
      return chatList.reduce((total, chat) => {
        const unreadCount = getUnreadCount(chat);
        if (unreadCount > 0) return total + unreadCount;
        if (chat.markedUnread) return total + 1;
        return total;
      }, 0);
    } else if (type === "company") {
      // Count unread messages from company + staff chats
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
        color: firstApp?.color || "bg-gray-700",
        duration: 30
      };
    });

    return typesArray;
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-3.5 h-3.5 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
      case "read":
        return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
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

  // Use appointmentTypesData from app-states.jsx instead of generating from appointments
  const appointmentTypes = appointmentTypesData;

  // Search members function for CreateAppointmentModal
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

  // Handle edit member for special notes and relations in CreateAppointmentModal
  const handleEditMember = (member, tab = "note") => {
    // Find the full member data from membersData
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

  // Handle input change for edit form
  const handleEditInputChange = (field, value) => {
    setEditFormMain(prev => ({ ...prev, [field]: value }));
  };

  // Handle save from EditMemberModal
  const handleSaveEditedMember = () => {
    // Update members data (in a real app, this would be an API call)
    setMembers(prevMembers => 
      prevMembers.map(m => m.id === editingMember.id ? { ...m, ...editFormMain } : m)
    );
    // Update relations
    setMemberRelationsState(prev => ({
      ...prev,
      [editingMember.id]: editingRelationsMain
    }));
    setShowEditMemberModal(false);
    setEditingMember(null);
  };

  // Handle add relation
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

  // Handle delete relation
  const handleDeleteRelationMain = (category, memberId) => {
    setEditingRelationsMain(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(m => m.id !== memberId)
    }));
  };

  // Handle archive member (placeholder)
  const handleArchiveMemberMain = () => {
    // Placeholder - implement if needed
    console.log("Archive member:", editingMember?.id);
  };

  // Handle unarchive member (placeholder)
  const handleUnarchiveMemberMain = () => {
    // Placeholder - implement if needed
    console.log("Unarchive member:", editingMember?.id);
  };

  // ==========================================
  // CHAT ITEM COMPONENT - with orange stripe for selected
  // ==========================================
  const ChatItem = ({ chat, isSelected, onSelect, onMenuClick, index, totalChats }) => {
    const chatItemRef = useRef(null);
    const isCompanyChat = chatType === "company";
    // Staff chats are in the company/studio tab but NOT the main studio group (ID 100)
    const isStaffChat = chatType === "company" && chat.id !== 100;
    
    // Parse name for InitialsAvatar
    const nameParts = chat.name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    
    // Determine if we should show image or InitialsAvatar
    const showImage = (chat.id === 100 && chat.logo) || (chat.logo && chat.logo !== DefaultAvatar && !chat.logo?.includes('placeholder'));
    
    // Check if menu should open upwards (for items in lower half of list)
    const shouldOpenUpward = () => {
      if (chatItemRef.current) {
        const rect = chatItemRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // If the bottom of the item is in the lower 40% of viewport, open upward
        return rect.bottom > viewportHeight * 0.6;
      }
      // Fallback: if index is more than 60% of total, open upward
      return index >= totalChats * 0.6;
    };
    
    return (
      <div
        ref={chatItemRef}
        onClick={() => onSelect(chat)}
        className={`
          relative flex items-start gap-3 p-4 rounded-xl cursor-pointer select-none
          transition-all duration-200 group border-b border-slate-700
          ${isSelected 
            ? "bg-[#181818] border-l-2 border-l-orange-500" 
            : "hover:bg-[#181818] border-l-2 border-l-transparent"
          }
        `}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {showImage ? (
            <img
              src={chat.logo}
              alt={`${chat.name}'s avatar`}
              className="w-12 h-12 rounded-xl object-cover"
              onClick={(e) => {
                e.stopPropagation();
                !isCompanyChat && handleViewMember(chat.id, e);
              }}
            />
          ) : chat.id === 100 ? (
            /* Special Studio Avatar - Use DefaultAvatar image */
            <img
              src={chat.logo || DefaultAvatar}
              alt="Studio"
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <InitialsAvatar 
              firstName={firstName}
              lastName={lastName}
              size="lg"
              isStaff={isStaffChat}
            />
          )}
          {/* Birthday Badge */}
          <BirthdayBadge 
            show={chat.isBirthday}
            dateOfBirth={chat.dateOfBirth}
            size="md"
            withTooltip={true}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Name + New Chat Badge */}
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${isSelected ? 'text-orange-400' : 'text-white'}`}>
              {chat.name}
            </span>
            {chat.isNewChat && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">New</span>
            )}
          </div>
          
          {/* Row 2: Message Preview - dynamically computed from messages */}
          <p className="text-sm text-gray-400 truncate mt-0.5">
            {getLastMessageContent(chat)}
          </p>
          
          {/* Row 3: Time - dynamically computed from messages */}
          <div className="flex items-center gap-1 text-gray-500 mt-1.5">
            <Clock size={12} />
            <span className="text-xs">{getLastMessageTime(chat) || "No messages"}</span>
          </div>
        </div>

        {/* Right side: Icons stacked vertically - positioned to align with message preview */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 w-[24px] mt-1">
          {/* Unread indicator - shows count or dot based on state */}
          <div className="h-[18px] flex items-center justify-center">
            {getUnreadCount(chat) > 0 ? (
              // Real unread messages - show count
              <span className="bg-orange-600 text-white text-[10px] rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center font-medium">
                {getUnreadCount(chat)}
              </span>
            ) : chat.markedUnread ? (
              // Manually marked as unread - show dot without number
              <span className="bg-orange-600 rounded-full h-[10px] w-[10px]" />
            ) : (
              <span className="w-[18px]" /> 
            )}
          </div>
          
          {/* Checkmarks - dynamically computed from last message status */}
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            {getMessageStatusIcon(getLastMessageStatus(chat))}
          </div>
          
          {/* Horizontal 3-dot menu - available for all chats */}
          <div className="h-[18px] flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick(chat.id);
              }}
              className="w-[18px] h-[18px] flex items-center justify-center text-gray-400 hover:text-orange-400 rounded hover:bg-gray-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Menu Dropdown */}
        {showChatMenu === chat.id && (
          <div
            ref={chatMenuRef}
            className={`absolute right-4 w-48 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-20 ${
              shouldOpenUpward() ? 'bottom-16' : 'top-16'
            }`}
          >
            {/* Mark as read/unread - available for all chat types */}
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800 text-gray-300 flex items-center gap-2 transition-colors"
              onClick={(e) => {
                const hasUnread = getUnreadCount(chat) > 0 || chat.markedUnread;
                hasUnread ? handleMarkChatAsRead(chat.id, e, isCompanyChat) : handleMarkChatAsUnread(chat.id, e, isCompanyChat);
              }}
            >
              {(getUnreadCount(chat) > 0 || chat.markedUnread) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Mark as {(getUnreadCount(chat) > 0 || chat.markedUnread) ? "read" : "unread"}
            </button>
            
            {/* Additional options - only for member chats */}
            {!isCompanyChat && (
              <>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800 text-gray-300 flex items-center gap-2 transition-colors"
                  onClick={(e) => handlePinChat(chat.id, e)}
                >
                  {pinnedChats.has(chat.id) ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {pinnedChats.has(chat.id) ? "Unpin" : "Pin"} chat
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800 text-gray-300 flex items-center gap-2 transition-colors"
                  onClick={(e) => handleArchiveChat(chat.id, e)}
                >
                  <Archive className="w-4 h-4" />
                  Archive chat
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800 text-gray-300 flex items-center gap-2 transition-colors"
                  onClick={(e) => handleViewMember(chat.id, e)}
                >
                  <User className="w-4 h-4" />
                  View Member
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex h-[92vh] max-h-[92vh] bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      <ToastContainer />

      {/* Chat List Sidebar - Fixed height container */}
      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[400px] w-full md:rounded-none rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${isMessagesOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } bg-black z-30 select-none md:top-0 top-[52px] md:h-[92vh] h-[calc(100vh-52px)]`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Header Section - Fixed, doesn't scroll */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Messenger</h1>
          </div>

          {/* Tabs - Equal width, full width */}
          <div className="mb-4">
            <div className="flex bg-[#141414] rounded-xl border border-[#333333] p-1 w-full overflow-hidden">
              <button
                className={`flex-1 py-2 flex items-center justify-center rounded-lg text-sm transition-colors relative ${chatType === "member" && activeScreen !== "email-frontend" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white hover:bg-[#222222]"
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
                  <span className="absolute top-0.5 right-0.5 bg-orange-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalUnreadCount("member")}
                  </span>
                )}
              </button>
              <button
                className={`flex-1 py-2 flex items-center justify-center rounded-lg text-sm transition-colors relative ${chatType === "company" && activeScreen !== "email-frontend" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white hover:bg-[#222222]"
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
                  <span className="absolute top-0.5 right-0.5 bg-orange-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalUnreadCount("company")}
                  </span>
                )}
              </button>
              <button
                className={`flex-1 py-2 flex items-center justify-center rounded-lg text-sm transition-colors relative ${activeScreen === "email-frontend" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white hover:bg-[#222222]"}`}
                onClick={handleEmailClick}
              >
                <Mail size={16} className="mr-2" />
                Email
                {emailList.inbox.filter((e) => !e.isRead && !e.isArchived).length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-orange-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {emailList.inbox.filter((e) => !e.isRead && !e.isArchived).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search - Conditional based on screen */}
          {activeScreen !== "email-frontend" ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search chats by name..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 border border-[#333333] focus:border-[#3F74FF] transition-colors"
                />
              </div>

              {/* Archive Button - Only for Member Chat */}
              {chatType === "member" && (
                <button
                  onClick={() => setShowArchive(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl text-sm text-white transition-colors w-full mb-4"
                >
                  <Archive className="w-4 h-4 text-white" />
                  Archived ({archivedChats.length})
                </button>
              )}
            </>
          ) : (
            <>
              {/* Email Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 border border-[#333333] focus:border-[#3F74FF] transition-colors"
                />
              </div>

              {/* Send Email Button */}
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm text-white font-medium transition-colors w-full mb-4"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </>
          )}
        </div>

        {/* Content Area - Chat List OR Email Folders */}
        {activeScreen !== "email-frontend" ? (
          /* Chat List - ONLY this area scrolls */
          <div 
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{ minHeight: 0 }}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="px-4 pb-24 space-y-2">
              {searchMember && searchResults.length > 0
                ? searchResults.map((chat, index) => (
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
                : (() => {
                  const { pinned, unpinned } = getPinnedAndUnpinnedChats();
                  return (
                    <>
                      {/* Pinned Section */}
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
                          {/* Divider between pinned and unpinned */}
                          <div className="flex items-center px-2 py-1 mt-2">
                            <div className="flex-1 h-px bg-gray-700"></div>
                          </div>
                        </>
                      )}
                      
                      {/* Unpinned Chats */}
                      {unpinned.map((chat, index) => {
                        if (chat.type === "separator") {
                          return (
                            <div key="separator" className="border-t border-gray-600 my-2">
                              <div className="text-xs text-gray-500 text-center py-2">Staff Chats</div>
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
          /* Email Folders List */
          <div 
            className="flex-1 overflow-y-auto custom-scrollbar select-none"
            style={{ minHeight: 0 }}
          >
            <div className="px-4 pb-24 space-y-1">
              {emailFolders.map((folder) => {
                const Icon = folder.icon
                const count = folder.showCount && folder.count ? folder.count() : 0
                const isActive = emailTab === folder.id
                
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setEmailTab(folder.id)
                      setSelectedEmail(null)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add('bg-[#333333]')
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('bg-[#333333]')
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('bg-[#333333]')
                      const emailId = e.dataTransfer.getData('emailId')
                      if (emailId && folder.id !== emailTab) {
                        handleMoveEmailToFolder(emailId, folder.id)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? "bg-[#3F74FF] text-white" 
                        : "text-gray-400 hover:bg-[#222222] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{folder.label}</span>
                    </div>
                    {folder.showCount && count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20" : "bg-orange-500 text-white"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Floating Broadcast Button - Desktop only, within sidebar */}
        <div className="hidden md:block absolute bottom-6 right-6 z-50">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            <IoIosMegaphone size={22} />
          </button>
        </div>
      </div>

      {/* Main Chat Area - Desktop only, Mobile uses Fullscreen Overlay */}
      <div className="hidden md:flex flex-1 flex-col min-w-0 h-[92vh] max-h-[92vh] overflow-hidden">
        {!selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] border border-[#333333] flex items-center justify-center mx-auto">
                <MessageCircle className="w-12 h-12 text-gray-600" />
              </div>
            </div>
            <h3 className="text-white font-medium text-lg mb-2">No chat selected</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Select a conversation from the chatlist to start messaging.
            </p>
          </div>
        )}

        {selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0 select-none">
              <div className="flex items-center gap-3">
                {/* Clickable Profile Container */}
                <div 
                  className={`flex items-center gap-3 px-3 py-2 bg-black rounded-xl ${chatType !== "company" ? "cursor-pointer hover:bg-gray-700 active:scale-[0.98] transition-all duration-200" : ""}`}
                  onClick={(e) => {
                    if (chatType !== "company") {
                      handleViewMember(selectedChat.id, e)
                    }
                  }}
                >
                  <div className="relative">
                    {/* Show image for studio chat or real uploaded images */}
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
                  <span className="font-medium text-white">
                    {selectedChat.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chatType !== "company" && (
                  <button
                    className="text-blue-500 hover:text-blue-400"
                    aria-label="View appointments"
                    onClick={handleCalendarClick}
                  >
                    <Calendar className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area - Scrollable, fills remaining space */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
              style={{ minHeight: 0 }}
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-2 ${message.sender === "You" ? "justify-end" : ""} group`}>
                  
                  {/* Menu button - LEFT side for own messages */}
                  {message.sender === "You" && !message.isDeleted && (
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveMessageMenu(activeMessageMenu === message.id ? null : message.id)}
                        className="message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-700 rounded-lg mt-2"
                      >
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                      
                      {/* Menu for own messages - appears to the right of button */}
                      {activeMessageMenu === message.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-[1099]"
                            onClick={() => setActiveMessageMenu(null)}
                          />
                          <div
                            ref={messageMenuRef}
                            className="absolute top-0 left-full ml-1 z-[1100] bg-[#2a2a2a] rounded-xl shadow-xl p-1 min-w-[140px] border border-gray-700"
                          >
                            <button
                              onClick={() => handleReplyToMessage(message)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
                            >
                              <Reply size={14} />
                              Reply
                            </button>

                            <button
                              onClick={() => {
                                setShowReactionPicker(message.id);
                                setActiveMessageMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
                            >
                              <Smile size={14} />
                              React
                            </button>

                            <button
                              onClick={() => handleCopyMessage(message)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
                            >
                              <Copy size={14} />
                              Copy
                            </button>

                            <button
                              onClick={() => {
                                setShowDeleteConfirm(message.id);
                                setActiveMessageMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-red-400 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col gap-1 ${message.sender === "You" ? "items-end" : ""} max-w-lg`}>
                    {/* Sender name ONLY for main studio group chat (ID 100) */}
                    {selectedChat?.id === 100 && message.sender !== "You" && !message.isDeleted && (
                      <div className="text-xs text-gray-500 font-medium mb-1">
                        {message.sender}
                      </div>
                    )}

                    <div
                      className={`rounded-xl p-3 ${
                        message.isDeleted
                          ? "bg-gray-800/50 text-gray-500 italic"
                          : message.sender === "You"
                            ? "bg-orange-500"
                            : "bg-black"
                      }`}
                    >
                      {/* Reply/Quote Preview */}
                      {message.replyTo && !message.isDeleted && (
                        <div
                          className={`mb-2 p-2 rounded-lg text-xs border-l-2 ${
                            message.sender === 'You'
                              ? "bg-orange-600/50 border-l-white"
                              : "bg-gray-700 border-l-orange-500"
                          }`}
                        >
                          <p className="font-semibold mb-0.5 text-white text-xs">
                            {message.replyTo.sender === 'You' ? 'You' : message.replyTo.sender}
                          </p>
                          <p className={`${message.sender === 'You' ? 'text-orange-100/80' : 'text-gray-400'} text-xs`}>
                            {truncateText(message.replyTo.content, 50)}
                          </p>
                        </div>
                      )}

                      {/* Message Content */}
                      <p 
                        className={`text-sm ${message.isDeleted ? "" : "text-white"}`}
                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {message.isDeleted ? (
                          <span className="flex items-center gap-1.5">
                            <Trash2 size={14} />
                            The message was deleted.
                          </span>
                        ) : (
                          <HighlightedText text={message.content} isUserMessage={message.sender === 'You'} />
                        )}
                      </p>

                      {/* Time and status */}
                      <div className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                        message.sender === "You" ? "text-white/70 justify-end" : "text-gray-500"
                      }`}>
                        <span>{message.time || formatTimestamp(message.timestamp)}</span>
                        {message.sender === "You" && !message.isDeleted && (
                          <span className="ml-1">
                            {message.status === "read" ? (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                            ) : message.status === "delivered" ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reaction Display */}
                    {messageReactions[message.id] && !message.isDeleted && (
                      <div className={`flex gap-1 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <button
                          onClick={(e) => removeReaction(message.id, e)}
                          className="bg-gray-700/80 rounded-full px-2 py-0.5 text-base flex items-center gap-1 hover:bg-gray-600 transition-colors group/reaction"
                          title="Click to remove"
                        >
                          <span>{messageReactions[message.id]}</span>
                          <span className="opacity-0 group-hover/reaction:opacity-100 text-xs text-gray-400">✕</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Menu button - RIGHT side for received messages */}
                  {message.sender !== "You" && !message.isDeleted && (
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveMessageMenu(activeMessageMenu === message.id ? null : message.id)}
                        className={`message-menu-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-700 rounded-lg ${
                          selectedChat?.id === 100 ? "mt-7" : "mt-2"
                        }`}
                      >
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                      
                      {/* Menu for received messages - appears to the left of button */}
                      {activeMessageMenu === message.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-[1099]"
                            onClick={() => setActiveMessageMenu(null)}
                          />
                          <div
                            ref={messageMenuRef}
                            className="absolute top-0 right-full mr-1 z-[1100] bg-[#2a2a2a] rounded-xl shadow-xl p-1 min-w-[140px] border border-gray-700"
                          >
                            <button
                              onClick={() => handleReplyToMessage(message)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
                            >
                              <Reply size={14} />
                              Reply
                            </button>

                            <button
                              onClick={() => {
                                setShowReactionPicker(message.id);
                                setActiveMessageMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
                            >
                              <Smile size={14} />
                              React
                            </button>

                            <button
                              onClick={() => handleCopyMessage(message)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
                            >
                              <Copy size={14} />
                              Copy
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview Bar */}
            {replyingTo && (
              <div className="px-4 py-3 bg-[#1a1a1a] border-t border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-xl p-3">
                  <div className="w-1 h-10 bg-orange-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-orange-400 text-xs font-semibold">
                      Replying to {replyingTo.sender === 'You' ? 'yourself' : replyingTo.sender}
                    </p>
                    <p className="text-gray-300 text-sm truncate">{truncateText(replyingTo.content, 50)}</p>
                  </div>
                  <button
                    onClick={cancelReply}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Input Area - Fixed at bottom like WhatsApp */}
            <div className="px-4 pt-4 pb-6 border-t border-gray-800 flex-shrink-0 bg-[#1C1C1C] relative">
              <div className="flex items-end gap-2 bg-black rounded-xl p-2">
                <button
                  className="p-2 hover:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0"
                  aria-label="Add emoji"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  type="button"
                >
                  <Smile className="w-6 h-6 text-gray-200" />
                </button>

                <textarea
                  ref={textareaRef}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent focus:outline-none text-sm min-w-0 resize-none overflow-y-auto leading-5 text-gray-200 placeholder-gray-400 max-h-[150px]"
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
                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                    messageText.trim() 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  type="button"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>

              {/* Desktop Emoji Picker */}
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full mb-2 left-4 z-[1020]"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      setMessageText(prev => prev + emoji.native);
                    }}
                    theme="dark"
                    previewPosition="none"
                    skinTonePosition="none"
                    perLine={8}
                    maxFrequentRows={2}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email View - Desktop */}
        {activeScreen === "email-frontend" && (
          <div className="flex h-full select-none">
            {/* Email List - Fixed width, always visible separator */}
            <div className="w-[400px] flex-shrink-0 border-r border-[#333333] flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {getFilteredEmails().length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#222222] border border-[#333333] flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-sm">No emails in this folder</p>
                  </div>
                ) : (
                  <div className="px-2 py-2 space-y-1">
                    {getFilteredEmails().map((email) => (
                      <div
                        key={email.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('emailId', email.id.toString())
                          e.currentTarget.classList.add('opacity-50')
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove('opacity-50')
                        }}
                        onClick={() => handleEmailItemClick(email)}
                        className={`
                          relative flex items-start gap-3 p-4 rounded-xl cursor-pointer
                          transition-all duration-200 group border-b border-slate-700
                          ${selectedEmail?.id === email.id 
                            ? "bg-[#181818] border-l-2 border-l-orange-500" 
                            : "hover:bg-[#181818] border-l-2 border-l-transparent"
                          }
                        `}
                      >
                        {/* Email Icon */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            !email.isRead ? "bg-orange-500/20" : "bg-[#222222]"
                          }`}>
                            <Mail size={20} className={!email.isRead ? "text-orange-400" : "text-gray-500"} />
                          </div>
                          {email.isPinned && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                              <Pin size={10} className="text-black" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Row 1: Sender + Time */}
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`font-medium truncate ${selectedEmail?.id === email.id ? 'text-orange-400' : 'text-white'}`}>
                              {emailTab === "sent" ? email.recipient : email.sender}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">{formatEmailTime(email.time)}</span>
                          </div>
                          {/* Row 2: Subject */}
                          <p className={`text-sm truncate ${!email.isRead ? "font-medium text-white" : "text-gray-400"}`}>
                            {email.subject || "(No subject)"}
                          </p>
                          {/* Row 3: Preview */}
                          <p className="text-xs text-gray-500 truncate mt-0.5">{truncateEmailText(email.body)}</p>
                          {/* Attachments indicator */}
                          {email.attachments?.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                              <Paperclip size={12} />
                              <span>{email.attachments.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email Detail View */}
            {selectedEmail ? (
              <div className="flex-1 flex flex-col min-w-0 select-text">
                {/* Email Header */}
                <div className="p-4 border-b border-[#333333] flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {selectedEmail.isPinned && (
                        <span className="flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                          <Pin size={12} />
                          Pinned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEmailReply(selectedEmail)}
                        className="p-2 hover:bg-[#333333] rounded-lg transition-colors text-gray-400 hover:text-white"
                        title="Reply"
                      >
                        <Reply size={18} />
                      </button>
                      <button
                        onClick={() => updateEmailStatus(selectedEmail.id, { isPinned: !selectedEmail.isPinned })}
                        className={`p-2 hover:bg-[#333333] rounded-lg transition-colors ${selectedEmail.isPinned ? "text-yellow-500" : "text-gray-400 hover:text-white"}`}
                        title={selectedEmail.isPinned ? "Unpin" : "Pin"}
                      >
                        {selectedEmail.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          updateEmailStatus(selectedEmail.id, { isArchived: !selectedEmail.isArchived })
                          setSelectedEmail(null)
                        }}
                        className="p-2 hover:bg-[#333333] rounded-lg transition-colors text-gray-400 hover:text-white"
                        title={selectedEmail.isArchived ? "Unarchive" : "Archive"}
                      >
                        <Archive size={18} />
                      </button>
                      <button
                        onClick={() => moveEmailToTrash(selectedEmail.id)}
                        className="p-2 hover:bg-[#333333] rounded-lg transition-colors text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-3">{selectedEmail.subject}</h2>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{selectedEmail.sender}</p>
                      {selectedEmail.senderEmail && (
                        <p className="text-xs text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        To: {selectedEmail.recipient}
                        {selectedEmail.recipientEmail && <span> &lt;{selectedEmail.recipientEmail}&gt;</span>}
                        {selectedEmail.cc && <span> • CC: {selectedEmail.cc}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{new Date(selectedEmail.time).toLocaleString()}</p>
                      {selectedEmail.status && (
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded mt-1 ${
                          selectedEmail.status === "Delivered" ? "bg-green-500/20 text-green-400" :
                          selectedEmail.status === "Read" ? "bg-blue-500/20 text-blue-400" :
                          selectedEmail.status === "Failed" ? "bg-red-500/20 text-red-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {selectedEmail.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div 
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                  />
                  
                  {selectedEmail.attachments?.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-[#333333]">
                      <p className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                        <Paperclip size={16} />
                        Attachments ({selectedEmail.attachments.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.attachments.map((file, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-[#222222] rounded-lg border border-[#333333] hover:border-[#444444] cursor-pointer transition-colors"
                          >
                            <Paperclip size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-300">{file.name || file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Reply Bar */}
                <div className="p-4 border-t border-[#333333] flex-shrink-0 bg-[#181818]">
                  <button
                    onClick={() => handleEmailReply(selectedEmail)}
                    className="w-full py-3 bg-[#222222] hover:bg-[#333333] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-[#333333]"
                  >
                    <Reply size={16} />
                    Reply to this email
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-24 h-24 rounded-2xl bg-[#222222] border border-[#333333] flex items-center justify-center mb-4">
                  <Mail className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-white font-medium text-lg mb-2">No email selected</h3>
                <p className="text-gray-500 text-sm">Select an email from the list to view its contents</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Broadcast Modal - Overlay on top of everything */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] hidden md:flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBroadcastModal(false)} />
          <div className="relative z-10 w-full h-full max-w-[95vw] max-h-[95vh] m-4">
            <BroadcastModal
              onClose={() => setShowBroadcastModal(false)}
              broadcastFolders={broadcastFolders}
              preConfiguredMessages={preConfiguredMessages}
              chatList={chatList}
              archivedChats={archivedChats}
              settings={settings}
              onBroadcast={handleBroadcast}
              onCreateMessage={(messageData) => {
                const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1
                const newMessage = {
                  id: newId,
                  ...messageData
                }
                setPreConfiguredMessages([...preConfiguredMessages, newMessage])
              }}
              onUpdateMessage={(messageData) => {
                setPreConfiguredMessages(prev =>
                  prev.map(msg =>
                    msg.id === messageData.id ? messageData : msg
                  )
                )
              }}
              onDeleteMessage={(messageId) => {
                setPreConfiguredMessages(prev =>
                  prev.filter(msg => msg.id !== messageId)
                )
              }}
              onCreateFolder={(folderName) => {
                const newId = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1
                setBroadcastFolders([...broadcastFolders, {
                  id: newId,
                  name: folderName,
                  messages: []
                }])
              }}
              onUpdateFolder={(folderId, folderName) => {
                setBroadcastFolders(prev =>
                  prev.map(folder =>
                    folder.id === folderId
                      ? { ...folder, name: folderName }
                      : folder
                  )
                )
              }}
              onDeleteFolder={(folderId) => {
                setBroadcastFolders(prev =>
                  prev.filter(folder => folder.id !== folderId)
                )
                setPreConfiguredMessages(prev =>
                  prev.filter(msg => msg.folderId !== folderId)
                )
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Broadcast Modal */}
      {showBroadcastModal && (
        <div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[100] flex flex-col overflow-auto">
          <BroadcastModal
            onClose={() => setShowBroadcastModal(false)}
            broadcastFolders={broadcastFolders}
            preConfiguredMessages={preConfiguredMessages}
            chatList={chatList}
            archivedChats={archivedChats}
            settings={settings}
            onBroadcast={handleBroadcast}
            onCreateMessage={(messageData) => {
              const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1
              const newMessage = {
                id: newId,
                ...messageData
              }
              setPreConfiguredMessages([...preConfiguredMessages, newMessage])
            }}
            onUpdateMessage={(messageData) => {
              setPreConfiguredMessages(prev =>
                prev.map(msg =>
                  msg.id === messageData.id ? messageData : msg
                )
              )
            }}
            onDeleteMessage={(messageId) => {
              setPreConfiguredMessages(prev =>
                prev.filter(msg => msg.id !== messageId)
              )
            }}
            onCreateFolder={(folderName) => {
              const newId = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1
              setBroadcastFolders([...broadcastFolders, {
                id: newId,
                name: folderName,
                messages: []
              }])
            }}
            onUpdateFolder={(folderId, folderName) => {
              setBroadcastFolders(prev =>
                prev.map(folder =>
                  folder.id === folderId
                    ? { ...folder, name: folderName }
                    : folder
                )
              )
            }}
            onDeleteFolder={(folderId) => {
              setBroadcastFolders(prev =>
                prev.filter(folder => folder.id !== folderId)
              )
              setPreConfiguredMessages(prev =>
                prev.filter(msg => msg.folderId !== folderId)
              )
            }}
          />
        </div>
      )}

      {/* Mobile Fullscreen Chat Overlay - same as notes.jsx */}
      {selectedChat && activeScreen === "chat" && (
        <div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[60] flex flex-col">
          {/* Mobile Chat Header with Back Button */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedChat(null);
                  setMessages([]);
                  setIsMessagesOpen(true);
                }}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Back to chat list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Profile Container */}
              <div 
                className={`flex items-center gap-2 px-2 py-1.5 bg-black rounded-xl ${chatType !== "company" ? "cursor-pointer hover:bg-gray-700 active:scale-[0.98] transition-all duration-200" : ""}`}
                onClick={(e) => {
                  if (chatType !== "company") {
                    handleViewMember(selectedChat.id, e);
                  }
                }}
              >
                <div className="relative">
                  {selectedChat.id === 100 ? (
                    <img
                      src={selectedChat.logo || DefaultAvatar}
                      alt="Studio"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : selectedChat.logo && selectedChat.logo !== DefaultAvatar && !selectedChat.logo?.includes('placeholder') ? (
                    <img
                      src={selectedChat.logo}
                      alt="Current chat avatar"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <InitialsAvatar 
                      firstName={selectedChat.name?.split(" ")[0] || ""}
                      lastName={selectedChat.name?.split(" ").slice(1).join(" ") || ""}
                      size="sm"
                      isStaff={chatType === "company" && selectedChat.id !== 100}
                    />
                  )}
                  <BirthdayBadge 
                    show={selectedChat.isBirthday}
                    dateOfBirth={selectedChat.dateOfBirth}
                    size="sm"
                    className="absolute -top-1 -right-1"
                  />
                </div>
                <span className="font-medium text-white text-sm truncate max-w-[150px]">
                  {selectedChat.name}
                </span>
              </div>
            </div>
            
            {/* Calendar Button */}
            {chatType !== "company" && (
              <button
                className="text-blue-500 hover:text-blue-400 p-1.5"
                aria-label="View appointments"
                onClick={handleCalendarClick}
              >
                <Calendar className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Messages Area */}
          <div
            ref={mobileMessagesContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3"
            style={{ minHeight: 0 }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"} max-w-[80%] min-w-0`}>
                    {/* Sender name for group chats */}
                    {selectedChat?.id === 100 && message.sender !== "You" && !message.isDeleted && (
                      <span className="text-xs text-gray-500 font-medium mb-1 px-1">
                        {message.sender}
                      </span>
                    )}

                    {/* Message bubble with Long Press */}
                    <div
                      className={`rounded-xl px-3 py-2 max-w-full overflow-hidden select-none ${
                        message.isDeleted
                          ? "bg-gray-800/50"
                          : message.sender === "You"
                            ? "bg-orange-500"
                            : "bg-[#2a2a2a]"
                      }`}
                      style={{ wordBreak: 'break-word', WebkitUserSelect: 'none', userSelect: 'none' }}
                      onTouchStart={(e) => handleTouchStart(message, e)}
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchMove}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (!message.isDeleted) {
                          setMobileContextMenu({ messageId: message.id, message });
                        }
                      }}
                    >
                      {/* Reply preview */}
                      {message.replyTo && !message.isDeleted && (
                        <div 
                          className={`mb-2 pl-2 border-l-2 ${
                            message.sender === "You" 
                              ? "border-white/40" 
                              : "border-gray-600"
                          }`}
                        >
                          <p className={`text-xs font-medium ${message.sender === "You" ? "text-white/80" : "text-gray-400"}`}>
                            {message.replyTo.sender}
                          </p>
                          <p className={`text-xs truncate max-w-[200px] ${message.sender === "You" ? "text-white/60" : "text-gray-500"}`}>
                            {message.replyTo.content || message.replyTo.text}
                          </p>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <p 
                        className={`text-sm ${
                          message.isDeleted 
                            ? "text-gray-500 italic" 
                            : "text-white"
                        }`}
                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {message.isDeleted 
                          ? "This message was deleted" 
                          : (message.content || message.text || "")
                        }
                      </p>
                      
                      {/* Time and status */}
                      <div className={`text-[11px] mt-1 flex items-center gap-1 ${
                        message.sender === "You" ? "text-white/70 justify-end" : "text-gray-500"
                      }`}>
                        <span>{message.time || formatTimestamp(message.timestamp)}</span>
                        {message.sender === "You" && !message.isDeleted && (
                          <span className="ml-1">
                            {message.status === "read" ? (
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            ) : message.status === "delivered" ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Reaction Display */}
                    {messageReactions[message.id] && !message.isDeleted && (
                      <div className={`flex gap-1 mt-1 ${message.sender === "You" ? "justify-end" : ""}`}>
                        <button
                          onClick={(e) => removeReaction(message.id, e)}
                          className="bg-gray-700/80 rounded-full px-2 py-0.5 text-base flex items-center gap-1 hover:bg-gray-600 transition-colors"
                        >
                          <span>{messageReactions[message.id]}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile Reply Preview */}
          {replyingTo && (
            <div className="px-4 py-2 bg-[#1a1a1a] border-t border-gray-800 flex items-center gap-3">
              <div className="flex-1 pl-3 border-l-2 border-orange-500">
                <p className="text-xs font-medium text-orange-400">{replyingTo.sender}</p>
                <p className="text-xs text-gray-400 truncate">{truncateText(replyingTo.content || replyingTo.text, 50)}</p>
              </div>
              <button
                onClick={cancelReply}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Input Area - Multi-line with auto-resize */}
          <div className="p-3 bg-[#1C1C1C] border-t border-gray-800 flex-shrink-0 relative">
            <div className="flex items-end gap-2 bg-black px-3 py-2 rounded-xl border border-gray-800">
              <button
                className="p-2 hover:bg-gray-700 rounded-full flex-shrink-0"
                aria-label="Add emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                type="button"
              >
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full mb-2 left-3 z-[201]"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Picker 
                    data={data} 
                    onEmojiSelect={(emoji) => {
                      setMessageText(prev => prev + emoji.native);
                    }}
                    theme="dark"
                    previewPosition="none"
                    skinTonePosition="none"
                    perLine={8}
                    maxFrequentRows={2}
                  />
                </div>
              )}
              <textarea
                ref={mobileTextareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "32px";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white outline-none text-sm min-w-0 resize-none max-h-[120px] leading-5"
                rows={1}
                style={{ height: '32px' }}
              />
              <button
                className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                  messageText.trim() 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Send message"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                type="button"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Context Menu Modal */}
      {mobileContextMenu && (
        <div 
          className="md:hidden fixed inset-0 z-[9998] flex items-end justify-center"
          onClick={() => setMobileContextMenu(null)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div 
            className="relative bg-[#2a2a2a] rounded-t-2xl w-full max-w-lg p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  handleReplyToMessage(mobileContextMenu.message);
                  setMobileContextMenu(null);
                }}
                className="w-full text-left px-4 py-3 text-base hover:bg-gray-700 rounded-xl text-white flex items-center gap-3"
              >
                <Reply size={20} />
                Reply
              </button>

              <button
                onClick={() => {
                  setShowReactionPicker(mobileContextMenu.messageId);
                  setMobileContextMenu(null);
                }}
                className="w-full text-left px-4 py-3 text-base hover:bg-gray-700 rounded-xl text-white flex items-center gap-3"
              >
                <Smile size={20} />
                React
              </button>

              <button
                onClick={() => {
                  handleCopyMessage(mobileContextMenu.message);
                }}
                className="w-full text-left px-4 py-3 text-base hover:bg-gray-700 rounded-xl text-white flex items-center gap-3"
              >
                <Copy size={20} />
                Copy
              </button>

              {mobileContextMenu.message?.sender === 'You' && (
                <button
                  onClick={() => {
                    setShowDeleteConfirm(mobileContextMenu.messageId);
                    setMobileContextMenu(null);
                  }}
                  className="w-full text-left px-4 py-3 text-base hover:bg-gray-700 rounded-xl text-red-400 flex items-center gap-3"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileContextMenu(null)}
              className="w-full mt-4 px-4 py-3 text-base bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Global Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]">
          <div className="bg-[#2a2a2a] rounded-xl p-5 mx-4 max-w-sm w-full shadow-xl border border-gray-700">
            <h4 className="text-white font-medium mb-2">Delete Message?</h4>
            <p className="text-gray-400 text-sm mb-4">This message will be marked as deleted and cannot be recovered.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-700 text-white text-sm rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Reaction Picker (for both Desktop and Mobile) */}
      {showReactionPicker && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/50"
            onClick={() => setShowReactionPicker(null)}
          />
          <div
            ref={reactionPickerRef}
            className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji) => handleReaction(showReactionPicker, emoji.native)}
              theme="dark"
              previewPosition="none"
              skinTonePosition="none"
              perLine={8}
              maxFrequentRows={2}
            />
          </div>
        </>
      )}

      {/* Mobile Fullscreen Email Overlay */}
      {activeScreen === "email-frontend" && selectedEmail && (
        <div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[60] flex flex-col">
          {/* Mobile Email Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-medium text-white text-sm">Email</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEmailReply(selectedEmail)}
                className="p-2 hover:bg-[#333333] rounded-lg text-gray-400"
              >
                <Reply size={18} />
              </button>
              <button
                onClick={() => moveEmailToTrash(selectedEmail.id)}
                className="p-2 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold text-white mb-3">{selectedEmail.subject}</h2>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-white font-medium">{selectedEmail.sender}</p>
                {selectedEmail.senderEmail && (
                  <p className="text-xs text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  To: {selectedEmail.recipient}
                  {selectedEmail.recipientEmail && <span> &lt;{selectedEmail.recipientEmail}&gt;</span>}
                </p>
              </div>
              <p className="text-xs text-gray-500">{formatEmailTime(selectedEmail.time)}</p>
            </div>
            <div 
              className="prose prose-invert prose-sm max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
            />
            {selectedEmail.attachments?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#333333]">
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Attachments ({selectedEmail.attachments.length})
                </p>
                <div className="space-y-2">
                  {selectedEmail.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[#222222] rounded-lg">
                      <Paperclip size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-300">{file.name || file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Reply Button */}
          <div className="p-3 border-t border-[#333333] bg-[#181818]">
            <button
              onClick={() => handleEmailReply(selectedEmail)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <Reply size={16} />
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Copied Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          Copied!
        </div>
      )}

      {/* Floating Broadcast Button - Mobile Only (on chat list or email list) */}
      {((activeScreen === "chat" && !selectedChat) || (activeScreen === "email-frontend" && !selectedEmail)) && (
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          aria-label="Broadcast Message"
        >
          <IoIosMegaphone size={22} />
        </button>
      )}

      {/* Modals - rendered outside of flex layout flow */}
      <>
        <ShowAppointmentModal
          isOpen={showAppointmentModal}
          selectedMemberMain={selectedMember}
          appointmentTypesMain={appointmentTypes}
          getMemberAppointmentsMain={getMemberAppointments}
          handleEditAppointmentMain={handleEditAppointment}
          handleDeleteAppointmentMain={handleCancelAppointment}
          handleManageContingentMain={handleManageContingent}
          handleCreateNewAppointmentMain={handleCreateNewAppointment}
          currentBillingPeriodMain={currentBillingPeriod}
          memberContingent={memberContingentData}
          onClose={() => {
            setShowAppointmentModal(false)
            setSelectedMember(null)
          }}
        />

        {/* EmailManagement removed - Email is now natively integrated */}

        <SendEmailModal
          showEmailModal={showEmailModal}
          handleCloseEmailModal={() => setShowEmailModal(false)}
          handleSendEmail={handleSendEmail}
          setShowTemplateDropdown={setShowTemplateDropdown}
          showTemplateDropdown={showTemplateDropdown}
          selectedEmailTemplate={selectedEmailTemplate}
          emailTemplates={emailTemplates}
          handleTemplateSelect={handleTemplateSelect}
          setSelectedEmailTemplate={setSelectedEmailTemplate}
          emailData={emailData}
          setEmailData={setEmailData}
          handleSearchMemberForEmail={handleSearchMemberForEmail}
          signature={settings?.emailSignature || ""}
      />

      {/* Email Reply Modal */}
      {showReplyModal && selectedEmail && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#333333] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Reply to {selectedEmail.sender}</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">To</label>
                <div className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm border border-[#333333]">
                  {replyData.toName && replyData.toName !== replyData.to ? (
                    <span>{replyData.toName} <span className="text-gray-500">&lt;{replyData.to}&gt;</span></span>
                  ) : (
                    <span>{replyData.to}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                  className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm border border-[#333333] focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Message</label>
                <WysiwygEditor
                  value={replyData.body}
                  onChange={(content) => setReplyData({ ...replyData, body: content })}
                  placeholder="Write your reply..."
                  minHeight={150}
                  maxHeight={300}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOriginalMessage}
                  onChange={(e) => setShowOriginalMessage(e.target.checked)}
                  className="rounded border-gray-600 bg-transparent text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-400">Include original message</span>
              </label>
            </div>

            <div className="p-4 border-t border-[#333333] flex justify-end gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2.5 bg-[#333333] hover:bg-[#444444] text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendEmailReply}
                disabled={!replyData.to || !replyData.body}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Send size={16} />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      <ArchiveModal
        showArchive={showArchive}
        setShowArchive={setShowArchive}
        archivedChats={archivedChats}
        handleRestoreChat={(id) => handleRestoreChat(id)}
        chatType={chatType}
      />


      {showCreateAppointmentModal && (
        <CreateAppointmentModal
          isOpen={showCreateAppointmentModal}
          onClose={() => setShowCreateAppointmentModal(false)}
          appointmentTypesMain={appointmentTypes}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpen}
          setNotifyActionMain={setNotifyAction}
          freeAppointmentsMain={freeAppointmentsData}
          availableMembersLeads={availableMembersLeadsMain}
          searchMembersMain={searchMembersMain}
          selectedMemberMain={selectedChat && chatType === "member" ? (() => {
            const member = membersData.find(m => m.id === selectedChat.id);
            return {
              id: selectedChat.id,
              name: selectedChat.name,
              firstName: member?.firstName || selectedChat.name?.split(" ")[0] || "",
              lastName: member?.lastName || selectedChat.name?.split(" ").slice(1).join(" ") || "",
              image: selectedChat.logo,
              title: selectedChat.name,
              note: member?.note || "",
              noteImportance: member?.noteImportance || "unimportant",
              noteStartDate: member?.noteStartDate || "",
              noteEndDate: member?.noteEndDate || "",
            };
          })() : null}
          memberCredits={selectedChat && chatType === "member" ? memberContingentData[selectedChat.id] : null}
          currentBillingPeriod={currentBillingPeriod}
          memberRelations={memberRelationsState}
          onOpenEditMemberModal={handleEditMember}
        />
      )}

      {showSelectedAppointmentModal && selectedAppointmentData && (
        <EditAppointmentModalMain
          selectedAppointmentMain={selectedAppointmentData}
          setSelectedAppointmentMain={setSelectedAppointmentData}
          appointmentTypesMain={appointmentTypes}
          freeAppointmentsMain={freeAppointmentsData}
          handleAppointmentChange={handleAppointmentChange}
          appointmentsMain={appointments}
          setAppointmentsMain={setAppointments}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpen}
          setNotifyActionMain={setNotifyAction}
          onDelete={handleDeleteAppointment}
          onClose={() => {
            setShowSelectedAppointmentModal(false);
            setSelectedAppointmentData(null);
          }}
        />
      )}

      <DraftModal
        show={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onDiscard={handleDiscardDraft}
        onSave={handleSaveDraft}
      />

      <CreateMessageModal
        show={showCreateMessageModal}
        setShow={setShowCreateMessageModal}
        broadcastFolders={broadcastFolders}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSaveNewMessage={handleSaveNewMessage}
      />

      <ContingentModal
        show={showContingentModal}
        setShow={setShowContingentModal}
        selectedMember={selectedMember}
        getBillingPeriods={getBillingPeriods}
        selectedBillingPeriod={selectedBillingPeriod}
        handleBillingPeriodChange={setSelectedBillingPeriod}
        setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        currentBillingPeriod={currentBillingPeriod}
        handleSaveContingent={handleSaveContingent}
      />

      <AddBillingPeriodModal
        show={showAddBillingPeriodModal}
        setShow={setShowAddBillingPeriodModal}
        newBillingPeriod={newBillingPeriod}
        setNewBillingPeriod={setNewBillingPeriod}
        handleAddBillingPeriod={handleAddBillingPeriod}
      />

      <NotifyMemberModal
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
      />

      <ViewMemberConfirmationModal
        isOpen={showMemberConfirmation}
        onClose={() => {
          setShowMemberConfirmation(false);
          setSelectedMemberForConfirmation(null);
        }}
        onConfirm={handleConfirmViewMember}
        memberName={selectedMemberForConfirmation ? `${selectedMemberForConfirmation.firstName || ''} ${selectedMemberForConfirmation.lastName || ''}`.trim() || selectedMemberForConfirmation.name : ''}
      />

      {/* Edit Member Modal for Special Notes and Relations */}
      <EditMemberModalMain
        isOpen={showEditMemberModal}
        onClose={() => {
          setShowEditMemberModal(false);
          setEditingMember(null);
        }}
        selectedMemberMain={editingMember}
        editModalTabMain={editMemberInitialTab}
        setEditModalTabMain={setEditMemberInitialTab}
        editFormMain={editFormMain}
        handleInputChangeMain={handleEditInputChange}
        handleEditSubmitMain={handleSaveEditedMember}
        editingRelationsMain={editingRelationsMain}
        setEditingRelationsMain={setEditingRelationsMain}
        newRelationMain={newRelationMain}
        setNewRelationMain={setNewRelationMain}
        availableMembersLeadsMain={availableMembersLeadsMain}
        relationOptionsMain={relationOptionsMain}
        handleAddRelationMain={handleAddRelationMain}
        memberRelationsMain={memberRelationsState}
        handleDeleteRelationMain={handleDeleteRelationMain}
        handleArchiveMemberMain={handleArchiveMemberMain}
        handleUnarchiveMemberMain={handleUnarchiveMemberMain}
      />
      </>
    </div>
  )
}
