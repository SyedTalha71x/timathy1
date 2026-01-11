/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import {
  Menu,
  X,
  Search,
  MoreVertical,
  Smile,
  Clock,
  Send,
  Gift,
  Calendar,
  Mail,
  Archive,
  Eye,
  EyeOff,
  User,
  Building2,
  Settings,
  Pin,
  Check,
  CheckCheck,
  FolderPlus,
  FileText,
  MessageCircle,
  Home,
  CheckSquare,
  Users,
  ShoppingCart,
  BadgeDollarSign,
} from "lucide-react"

import { ToastContainer } from "react-toastify"
import { IoIosMegaphone } from "react-icons/io"
import CommuncationBg from "../../../public/communication-bg.svg"
import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { appointmentNotificationTypesNew, companyChatListNew, emailListNew, emailTemplatesNew, memberChatListNew, memberHistoryNew, memberRelationsNew, preConfiguredMessagesNew, settingsNew, staffChatListNew } from "../../utils/user-panel-states/communication-states"
import { memberContingentDataNew } from "../../utils/user-panel-states/myarea-states"
import { appointmentsData, membersData } from "../../utils/user-panel-states/appointment-states"

import AddAppointmentModal from "../../components/user-panel-components/appointments-components/add-appointment-modal"
import EmailManagement from "../../components/user-panel-components/communication-components/EmailManagement"
import ContingentModal from "../../components/user-panel-components/communication-components/ContingentModal"
import CreateMessageModal from "../../components/user-panel-components/communication-components/CreateMessageModal"
import AddBillingPeriodModal from "../../components/user-panel-components/communication-components/AddBillingPeriodModal"
import NotifyMemberModal from "../../components/user-panel-components/communication-components/NotifyMemberModal"
import SettingsModal from "../../components/user-panel-components/communication-components/SettingsModal"
import ArchiveModal from "../../components/user-panel-components/communication-components/ArchiveModal"
import DraftModal from "../../components/user-panel-components/communication-components/DraftModal"
import EmailModal from "../../components/user-panel-components/communication-components/EmailModal"
import SidebarMenu from "../../components/user-panel-components/communication-components/Sidebar"
import BroadcastModal from "../../components/user-panel-components/communication-components/BroadcastModal"
import ShowAppointmentModal from "../../components/user-panel-components/communication-components/ShowAppointmentsModal"
import FolderModal from "../../components/user-panel-components/communication-components/broadcast-modal-components/FolderModal"
import EditAppointmentModalMain from '../../components/user-panel-components/appointments-components/selected-appointment-modal'
import ViewMemberConfirmationModal from "../../components/user-panel-components/communication-components/ViewConfirmationModal"
// import ViewMemberConfirmationModal from "../../components/user-panel-components/communication-components/ViewMemberConfirmationModal"

export default function Communications() {
  // UI States
  const [isMessagesOpen, setIsMessagesOpen] = useState(true)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [showChatDropdown, setShowChatDropdown] = useState(false)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [showChatMenu, setShowChatMenu] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const [open, setOpen] = useState(false)

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
  const [showEmailFrontend, setShowEmailFrontend] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [showMemberConfirmation, setShowMemberConfirmation] = useState(false)
  const [selectedMemberForConfirmation, setSelectedMemberForConfirmation] = useState(null)

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
  const [appointments, setAppointments] = useState(appointmentsData)
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
  const [newFolderName, setNewFolderName] = useState("")
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
  const notePopoverRef = useRef(null)
  const menuRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Constants
  const staffChatList = staffChatListNew
  const memberChatList = memberChatListNew
  const companyChatList = companyChatListNew
  const currentBillingPeriod = "04.14.25 - 04.18.2025"

  // EFFECTS SECTION
  useEffect(() => {
    const initialMemberChats = membersData
      .filter(member => member.isActive && !member.isArchived) // This filters archived members
      .map(member => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        logo: member.image || DefaultAvatar,
        message: "No messages yet",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        unreadCount: 0,
        messageStatus: "sent",
        messages: [],
        isBirthday: checkIfBirthday(member.dateOfBirth),
        isArchived: false
      }));
  
    const mergedChats = [...initialMemberChats];
    if (chatType === "member") {
      setChatList(mergedChats);
    }
  }, [membersData, chatType]);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }

      if (showEmojiPicker &&
        !event.target.closest('.emoji-picker-container') &&
        !event.target.closest('button[aria-label="Add emoji"]')) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
      if (notePopoverRef.current && !notePopoverRef.current.contains(event.target)) {
        // Close note popover
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (chatType === "staff") {
      setChatList(staffChatList)
    } else if (chatType === "member") {
      setChatList(memberChatList)
    } else if (chatType === "company") {
      setChatList(companyChatList)
    }
  }, [chatType])

  useEffect(() => {
    const memberUnread = memberChatList.filter((chat) => !chat.isRead && chat.unreadCount > 0).length
    const companyUnread = companyChatList.filter((chat) => !chat.isRead && chat.unreadCount > 0).length
    const emailUnread = emailList.inbox.filter((email) => !email.isRead && !email.isArchived).length

    setUnreadMessagesCount({
      member: memberUnread,
      company: companyUnread,
      email: emailUnread,
    })
  }, [chatList, archivedChats, emailList])

  // FUNCTIONS SECTION
  const checkIfBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate();
  };

  const handleEmailManagementClose = () => {
    setShowEmailFrontend(false)
    setIsMessagesOpen(true)
    setChatType("member")
  }

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

  const handleMarkChatAsRead = (chatId, e) => {
    e.stopPropagation()
    setChatList((prevList) =>
      prevList.map((chat) => (chat.id === chatId ? { ...chat, isRead: true, unreadCount: 0 } : chat)),
    )
    setShowChatMenu(null)
  }

  const handleMarkChatAsUnread = (chatId, e) => {
    e.stopPropagation()
    setChatList((prevList) =>
      prevList.map((chat) => (chat.id === chatId ? { ...chat, isRead: false, unreadCount: 1 } : chat)),
    )
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

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUnread: false,
      status: "sent",
    }
    setMessages([...messages, newMessage])
    setChatList((prevList) =>
      prevList.map((chat) =>
        chat.id === selectedChat.id
          ? {
            ...chat,
            messages: [...(chat.messages || []), newMessage],
            message: messageText,
            messageStatus: "sent",
            isRead: true,
            unreadCount: 0,
          }
          : chat,
      ),
    )

    if (archivedChats.some((chat) => chat.id === selectedChat.id)) {
      handleRestoreChat(selectedChat.id)
    }

    setMessageText("")

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
    }, 1000)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
    }, 3000)
  }

  const handleReaction = (messageId, reaction) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [reaction]: (prev[messageId]?.[reaction] || 0) + 1,
      },
    }))
    setShowReactionPicker(null)
  }

  const handleEmailClick = () => {
    setActiveScreen("email-frontend")
    setShowEmailFrontend(true)
    setIsMessagesOpen(false)
  }

  const handleSendEmail = (emailDataWithAttachments) => {
    if (!emailDataWithAttachments.to || !emailDataWithAttachments.subject || !emailDataWithAttachments.body) {
      alert("Please fill in all required email fields");
      return;
    }

    const bodyWithSignature = settings.emailSignature
      ? `${emailDataWithAttachments.body}<br><br>${settings.emailSignature}`
      : emailDataWithAttachments.body;

    const newEmail = {
      id: Date.now(),
      recipient: emailDataWithAttachments.to,
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
    setShowAddAppointmentModal(false)
  }

  const handleCalendarClick = () => {
    if (selectedChat) {
      const foundMember = membersData.find((m) => m.id === selectedChat.id)
      if (foundMember) {
        setSelectedMember(foundMember)
        setShowAppointmentModal(true)
      } else {
        setSelectedMember({
          id: selectedChat.id,
          firstName: selectedChat.name.split(' ')[0],
          lastName: selectedChat.name.split(' ')[1] || '',
          email: selectedChat.email || '',
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
    setShowAddAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleRemoveEmoji = (messageId, emojiName) => {
    setMessageReactions((prev) => {
      const updatedReactions = { ...prev };

      if (updatedReactions[messageId] && updatedReactions[messageId][emojiName]) {
        updatedReactions[messageId][emojiName] -= 1;

        if (updatedReactions[messageId][emojiName] <= 0) {
          delete updatedReactions[messageId][emojiName];
        }

        if (Object.keys(updatedReactions[messageId]).length === 0) {
          delete updatedReactions[messageId];
        }
      }

      return updatedReactions;
    });
  };

  const handleBroadcast = (broadcastData) => {
    const { message, recipients, settings } = broadcastData;

    if (!message) {
      alert("Please select a message to broadcast");
      return;
    }

    if (recipients.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    alert(
      `Broadcast sent to ${recipients.length} recipients via ${settings.broadcastEmail && settings.broadcastChat
        ? "Email and Chat"
        : settings.broadcastEmail
          ? "Email"
          : "Chat"
      }`,
    );

    setActiveScreen("chat");
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
    setSelectedChat(chat)
    setMessages(chat.messages || [])
    setIsMessagesOpen(false)
    setActiveScreen("chat")
    if (chatType !== "company") {
      setChatList((prevList) => prevList.map((c) => (c.id === chat.id ? { ...c, isRead: true, unreadCount: 0 } : c)))
    }
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

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert("Please enter a folder name")
      return
    }
    const newId = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1
    setBroadcastFolders([...broadcastFolders, { id: newId, name: newFolderName, messages: [] }])
    setNewFolderName("")
    setShowFolderModal(false)
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
    const allMembers = [...staffChatList, ...memberChatList].filter(
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
    return list.sort((a, b) => {
      if (a.type === 'separator' || b.type === 'separator') return 0;
      const aPinned = pinnedChats.has(a.id);
      const bPinned = pinnedChats.has(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  };

  const getCombinedChatList = () => {
    if (chatType === "company") {
      return [...companyChatList, { id: "separator", type: "separator" }, ...staffChatList];
    } else if (chatType === "member") {
      const activeMembers = membersData.filter(member =>
        member.isActive &&
        !member.isArchived && 
        member.memberType !== "blocked"
      );
  
      const newMemberChats = activeMembers.map(member => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        logo: member.image || DefaultAvatar,
        message: "New member - Start conversation",
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isRead: true,
        unreadCount: 0,
        messageStatus: "sent",
        messages: [],
        isBirthday: checkIfBirthday(member.dateOfBirth),
        isArchived: false,
        isNewMember: true
      }));
  
      return newMemberChats;
    }
  
    return staffChatList;
  };

  const getAppointmentTypesFromData = () => {
    const typesSet = new Set();
    appointmentsData.forEach(app => {
      if (app.type) {
        typesSet.add(app.type);
      }
    });

    const typesArray = Array.from(typesSet).map(type => {
      const firstApp = appointmentsData.find(app => app.type === type);
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
        return <Check className="w-5 h-5 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-5 h-5 text-gray-400" />
      case "read":
        return <CheckCheck className="w-5 h-5 text-blue-500" />
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

  // Helper Arrays
  const reactions = [
    { emoji: "❤️", name: "heart" },
    { emoji: "😂", name: "laugh" },
    { emoji: "😮", name: "wow" },
    { emoji: "😢", name: "sad" },
    { emoji: "😡", name: "angry" },
  ]

  const searchResults = searchMember
    ? getCombinedChatList().filter((chat) =>
      chat.name.toLowerCase().includes(searchMember.toLowerCase())
    )
    : [];

  const appointmentTypes = getAppointmentTypesFromData();

  return (

    <div className="relative flex lg:min-h-[92vh]   h-auto bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      <ToastContainer />
      <SidebarMenu showSidebar={showSidebar} setShowSidebar={setShowSidebar} />



      {isMessagesOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMessagesOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[400px] w-full rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${isMessagesOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } bg-black z-40`}
      >
        <div className="p-4 h-full flex flex-col relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 ">
              {/* <button
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-gray-800 rounded-full"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5" />
              </button> */}
              <div onClick={() => setShowSidebar(true)} className="">
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer lg:hidden block" alt="" />
              </div>
              <h1 className="text-2xl font-bold">Messenger</h1>
            </div>
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-800 rounded-full"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div> */}
          </div>

          <div className="flex gap-2 items-center justify-between mb-4">
            <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
              <button
                className={`px-4 py-2 flex items-center rounded-lg text-sm transition-colors relative ${chatType === "member" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                onClick={() => setChatType("member")}
              >
                <User size={16} className="inline mr-2" />
                Member
                {unreadMessagesCount.member > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount.member}
                  </span>
                )}
              </button>
              <button
                className={`px-4 flex items-center py-2 rounded-lg text-sm transition-colors relative ${chatType === "company" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                  }`}
                onClick={() => setChatType("company")}
              >
                <Building2 size={16} className="inline mr-2" />
                Studio
                {unreadMessagesCount.company > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount.company}
                  </span>
                )}
              </button>
              <button
                className="px-4 py-2 flex items-center rounded-lg text-sm text-gray-400 hover:text-white transition-colors relative"
                onClick={handleEmailClick}
              >
                <Mail size={16} className="inline mr-2" />
                Email
                {emailList.inbox.filter((e) => !e.isRead && !e.isArchived).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {emailList.inbox.filter((e) => !e.isRead && !e.isArchived).length}
                  </span>
                )}
              </button>
            </div>
            {/* Removed MoreVertical dropdown (New Chat, New Group) */}
          </div>

          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-200 bg-black rounded-xl text-sm outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {/* Archive Button */}
            <button
              onClick={() => setShowArchive(true)}
              className="flex items-center gap-2 px-4 py-2 mb-4 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-xl text-sm transition-colors"
            >
              <Archive className="w-4 h-4" />
              Archived ({archivedChats.length})
            </button>
          </>


          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {/* Show search results if searching */}
            {searchMember && searchResults.length > 0
              ? searchResults.map((chat, index) => (
                <div
                  key={`search-${chat.id}-${index}`}
                  className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-xl ${selectedChat?.id === chat.id ? "bg-[#181818]" : "hover:bg-[#181818]"
                    } cursor-pointer relative group`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="relative">
                    <img
                      src={chat.logo || "/placeholder.svg?height=40&width=40"}
                      alt={`${chat.name}'s avatar`}
                      width={40}
                      height={40}
                      className="rounded-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (chatType !== "company") {
                          // Show confirmation dialog
                          if (window.confirm(`Do you want to view details of ${chat.name}?`)) {
                            // Find member and redirect
                            const member = members.find(m => m.id === chat.id);
                            if (member) {
                              window.location.href = `/dashboard/member-details/${member.id}`;
                            }
                          }
                        }
                      }}
                    />
                    {chat.isBirthday && (
                      <div className="absolute -top-4 -right-4  rounded-md p-1">
                        <span className="text-yellow-500">🎂</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-medium truncate">{chat.name}</span>
                        {pinnedChats.has(chat.id) && <Pin className="w-3 h-3 text-gray-400" />}
                        {chat.isArchived && <span className="text-xs bg-gray-600 px-2 py-1 rounded">Archived</span>}
                      </div>

                      {chat.unreadCount > 0 && (
                        <span className="bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="truncate">{chat.message}</p>
                    </div>
                    <div className="flex mt-1 text-gray-400 items-center gap-1">
                      <Clock size={15} />
                      <span className="text-sm text-gray-400">{chat.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      className="opacity-100 p-1 hover:bg-gray-600 rounded-full z-10 relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChatMenu(showChatMenu === chat.id ? null : chat.id);
                      }}
                      aria-label="Chat options"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-300" />
                    </button>
                    {getMessageStatusIcon(chat.messageStatus)}
                  </div>
                </div>
              ))
              : getSortedChatList().map((chat, index) => {
                // Handle separator
                if (chat.type === "separator") {
                  return (
                    <div key="separator" className="border-t border-gray-600 my-2 mx-4">
                      <div className="text-xs text-gray-500 text-center py-2">Staff Chats</div>
                    </div>
                  )
                }

                return (
                  <div
                    key={`${chatType}-${chat.id}-${index}`}
                    className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-xl ${selectedChat?.id === chat.id ? "bg-[#181818]" : "hover:bg-[#181818]"
                      } cursor-pointer relative group`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="relative">
                      <img
                        src={chat.logo || "/placeholder.svg"}
                        alt={`${chat.name}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-xl cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          chatType !== "company" && handleViewMember(chat.id, e)
                        }}
                      />
                      {chat.isBirthday && (
                        <div className="absolute -top-4 -right-4  rounded-md p-1">
                          <span className="text-yellow-500">🎂</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-medium truncate">{chat.name}</span>
                          {pinnedChats.has(chat.id) && <Pin className="w-4 h-4 text-gray-400" />}
                        </div>
                        {chat.unreadCount > 0 && (
                          <span className="bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        <p className="truncate">{chat.message}</p>
                      </div>
                      <div className="flex mt-1 text-gray-400 items-center gap-1">
                        <Clock size={15} />
                        <span className="text-sm text-gray-400">{chat.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {chatType !== "company" && (
                        <button
                          className="opacity-100 p-1 hover:bg-gray-600 rounded-full z-10 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowChatMenu(showChatMenu === chat.id ? null : chat.id);
                          }}
                          aria-label="Chat options"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-300" />
                        </button>
                      )}
                      {getMessageStatusIcon(chat.messageStatus)}
                      {showChatMenu === chat.id && chatType !== "company" && (
                        <div
                          ref={chatMenuRef}
                          className="absolute right-0 top-8 w-48 bg-[#2F2F2F] rounded-xl border border-gray-800 shadow-lg overflow-hidden z-20"
                        >
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2"
                            onClick={(e) =>
                              chat.isRead ? handleMarkChatAsUnread(chat.id, e) : handleMarkChatAsRead(chat.id, e)
                            }
                          >
                            {chat.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            Mark as {chat.isRead ? "unread" : "read"}
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2"
                            onClick={(e) => handlePinChat(chat.id, e)}
                          >
                            <Pin className="w-4 h-4" />
                            {pinnedChats.has(chat.id) ? "Unpin" : "Pin"} chat
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2"
                            onClick={(e) => handleArchiveChat(chat.id, e)}
                          >
                            <Archive className="w-4 h-4" />
                            Archive chat
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2"
                            onClick={(e) => handleViewMember(chat.id, e)}
                          >
                            <User className="w-4 h-4" />
                            View Member
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
          <button
            onClick={() => setActiveScreen("send-message")}
            className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
          >
            <IoIosMegaphone className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {!selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <button
              onClick={() => setIsMessagesOpen(true)}
              className="md:hidden absolute top-4 left-4 text-gray-400 hover:text-gray-300"
              aria-label="Open messages"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="mb-5">
              <img
                src={CommuncationBg || "/placeholder.svg"}
                alt="Welcome to Communications"
                className="w-64 h-64 mx-auto"
              />
            </div>
            <p className="md:w-[50%] text-gray-400 text-sm mx-auto w-full">
              Select a chat to start messaging or choose from your archived conversations. Click on a member's name or
              avatar to view their profile.
            </p>
          </div>
        )}
        {selectedChat && activeScreen === "chat" && (
          <div className="flex flex-col h-full">
            {/* Header - Fixed at top */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMessagesOpen(true)}
                  className="md:hidden text-gray-400 hover:text-gray-300"
                  aria-label="Open messages"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="relative">
                  <img
                    src={selectedChat.logo || "/placeholder.svg"}
                    alt="Current chat avatar"
                    width={48}
                    height={48}
                    className="rounded-xl cursor-pointer"
                    onClick={(e) => {
                      if (chatType !== "company") {
                        handleViewMember(selectedChat.id, e)
                      }
                    }}
                  />
                  {selectedChat.isBirthday && (
                    <div className="absolute -top-4 -right-4 rounded-md p-1">
                      <span className="text-yellow-500">🎂</span>
                    </div>
                  )}
                </div>
                <span
                  className="font-medium cursor-pointer hover:text-blue-400"
                  onClick={(e) => {
                    if (chatType !== "company") {
                      handleViewMember(selectedChat.id, e)
                    }
                  }}
                >
                  {selectedChat.name}
                </span>
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

            {/* Messages Container - FIXED HEIGHT, SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-hidden md:overflow-y-auto md:max-h-[70vh]">
              {/* This wrapper ensures proper scrolling on mobile */}
              <div
                ref={messagesContainerRef}
                className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4"
                style={{
                  // Mobile-specific: fixed height container with scroll
                  maxHeight: 'calc(100vh - 12rem)' // Adjust based on header + input height
                }}
              >
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.sender === "You" ? "justify-end" : ""} group`}>
                    <div className={`flex flex-col gap-1 ${message.sender === "You" ? "items-end" : ""}`}>
                      {/* Add sender name ONLY for company chats (studio group chats) */}
                      {chatType === "company" && message.sender !== "You" && (
                        <div className="text-xs text-gray-500 font-medium mb-1">
                          {message.sender}
                        </div>
                      )}

                      <div
                        className={`rounded-xl p-4 text-sm max-w-md relative ${message.sender === "You" ? "bg-[#3F74FF]" : "bg-black"
                          }`}
                      >
                        <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>

                        {/* Message actions */}
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                          <button
                            onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                            title="Add reaction"
                          >
                            <Smile className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Reaction picker */}
                        {showReactionPicker === message.id && (
                          <div className="absolute top-14 -left-6 bg-gray-800 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                            {reactions.map((reaction) => (
                              <button
                                key={reaction.name}
                                onClick={() => handleReaction(message.id, reaction.name)}
                                className="p-1 hover:bg-gray-700 rounded text-xl transition-colors"
                                title={`Add ${reaction.name} reaction`}
                              >
                                {reaction.emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Display reactions with removal option */}
                        {messageReactions[message.id] && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {Object.entries(messageReactions[message.id]).map(([reactionName, count]) => {
                              const reaction = reactions.find((r) => r.name === reactionName);
                              return (
                                <div
                                  key={reactionName}
                                  className="bg-gray-700 rounded-full px-2 py-1 text-xs flex items-center gap-1 group/reaction relative"
                                >
                                  <span className="text-lg">{reaction?.emoji}</span>
                                  <span>{count}</span>

                                  <button
                                    onClick={() => handleRemoveEmoji(message.id, reactionName)}
                                    className="opacity-0 group-hover/reaction:opacity-100 transition-opacity ml-1 text-red-400 hover:text-red-300"
                                    title={`Remove ${reactionName} reaction`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span>{message.time}</span>
                        {message.sender === "You" && getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-4 border-t border-gray-800 flex-shrink-0">
              <div className="flex items-end gap-2 bg-black rounded-xl p-2 relative">
                <div className="relative">
                  <button
                    className="p-2 hover:bg-gray-700 rounded-full flex items-center justify-center"
                    aria-label="Add emoji"
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    type="button"
                  >
                    <Smile className="w-6 h-6 text-gray-200" />
                  </button>

                  {showEmojiPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowEmojiPicker(false)}
                      />

                      <div className="absolute bottom-12 left-0 md:left-1/2 md:-translate-x-1/2 z-50">
                        <div className="w-screen max-w-[90vw] md:w-auto">
                          <Picker
                            data={data}
                            onEmojiSelect={(emoji) => {
                              setMessageText(prev => prev + emoji.native);
                              setShowEmojiPicker(false);
                            }}
                            theme="dark"
                            previewPosition="none"
                            skinTonePosition="none"
                            perLine={8}
                            maxFrequentRows={1}
                            emojiSize={28}
                            emojiButtonSize={40}
                            searchPosition="top"
                            width="100%"
                            maxWidth="100%"
                            categories={[
                              'frequent',
                              'people',
                              'nature',
                              'foods',
                              'activity',
                              'places',
                              'objects',
                              'symbols',
                              'flags'
                            ]}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <textarea
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent focus:outline-none text-sm min-w-0 resize-none overflow-hidden leading-relaxed text-gray-200 py-2 placeholder-gray-400"
                  rows={1}
                  value={messageText}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  onChange={(e) => setMessageText(e.target.value)}
                />

                <button
                  className="p-2 hover:bg-gray-700 rounded-full flex items-center justify-center"
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  type="button"
                >
                  <Send className="w-6 h-6 text-gray-200" />
                </button>
              </div>
            </div>
          </div>
        )}
        {activeScreen === "send-message" && (
          <BroadcastModal
            onClose={() => setActiveScreen("chat")}
            broadcastFolders={broadcastFolders}
            preConfiguredMessages={preConfiguredMessages}
            chatList={chatList}
            archivedChats={archivedChats}
            settings={settings}
            onBroadcast={handleBroadcast}
            onCreateMessage={(messageData) => {
              // Handle creating new message
              const newId = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1
              const newMessage = {
                id: newId,
                ...messageData
              }
              setPreConfiguredMessages([...preConfiguredMessages, newMessage])
            }}
            onUpdateMessage={(messageData) => {
              // Handle updating message
              setPreConfiguredMessages(prev =>
                prev.map(msg =>
                  msg.id === messageData.id ? messageData : msg
                )
              )
            }}
            onDeleteMessage={(messageId) => {
              // Handle deleting message
              setPreConfiguredMessages(prev =>
                prev.filter(msg => msg.id !== messageId)
              )
            }}
            onCreateFolder={(folderName) => {
              // Handle creating folder
              const newId = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1
              setBroadcastFolders([...broadcastFolders, {
                id: newId,
                name: folderName,
                messages: []
              }])
            }}
            onUpdateFolder={(folderId, folderName) => {
              // Handle updating folder
              setBroadcastFolders(prev =>
                prev.map(folder =>
                  folder.id === folderId
                    ? { ...folder, name: folderName }
                    : folder
                )
              )
            }}
            onDeleteFolder={(folderId) => {
              // Handle deleting folder
              setBroadcastFolders(prev =>
                prev.filter(folder => folder.id !== folderId)
              )

              // Also remove messages in this folder
              setPreConfiguredMessages(prev =>
                prev.filter(msg => msg.folderId !== folderId)
              )
            }}
          />
        )}
      </div>

      <ShowAppointmentModal
        show={showAppointmentModal}
        member={selectedMember}
        appointmentTypes={appointmentTypes}
        getMemberAppointments={getMemberAppointments}
        handleEditAppointment={handleEditAppointment}
        handleCancelAppointment={handleCancelAppointment}
        handleManageContingent={handleManageContingent}
        handleCreateNewAppointment={handleCreateNewAppointment}
        currentBillingPeriod={currentBillingPeriod}
        memberContingentData={memberContingentData}
        onClose={() => {
          setShowAppointmentModal(false)
          setSelectedMember(null)
        }}
      />

      <EmailManagement
        isOpen={showEmailFrontend}
        onClose={handleEmailManagementClose}
        onOpenSendEmail={() => setShowEmailModal(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenBroadcast={() => setActiveScreen("send-message")}
        initialEmailList={emailList}
      />
      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settings={settings}
        setSettings={setSettings}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
        appointmentNotificationTypes={appointmentNotificationTypes}
        setAppointmentNotificationTypes={setAppointmentNotificationTypes}
        handleSaveSettings={handleSaveSettings}
      />

      <EmailModal
        show={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        emailData={emailData}
        setEmailData={setEmailData}
        handleSendEmail={handleSendEmail}
        emailTemplates={emailTemplates}
        selectedEmailTemplate={selectedEmailTemplate}
        handleTemplateSelect={handleTemplateSelect}
        showTemplateDropdown={showTemplateDropdown}
        setShowTemplateDropdown={setShowTemplateDropdown}
        showRecipientDropdown={showRecipientDropdown}
        setShowRecipientDropdown={setShowRecipientDropdown}
        handleSearchMemberForEmail={handleSearchMemberForEmail}
        handleSelectEmailRecipient={handleSelectEmailRecipient}
      />
      <ArchiveModal
        showArchive={showArchive}
        setShowArchive={setShowArchive}
        archivedChats={archivedChats}
        handleRestoreChat={(id) => handleRestoreChat(id)}
      />

      <FolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onCreateFolder={handleCreateFolder}
      />

      {showAddAppointmentModal && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModal}
          onClose={() => setShowAddAppointmentModal(false)}
          appointmentTypes={appointmentTypes}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          freeAppointments={freeAppointments}
        />
      )}
      {showSelectedAppointmentModal && selectedAppointmentData && (
        <EditAppointmentModalMain
          selectedAppointmentMain={selectedAppointmentData}
          setSelectedAppointmentMain={setSelectedAppointmentData}
          appointmentTypesMain={appointmentTypes}
          freeAppointmentsMain={freeAppointments}
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

    </div>
  )
}
