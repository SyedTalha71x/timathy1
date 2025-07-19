"use client"
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
  Inbox,
  FileText,
  Info,
  CalendarIcon,
  History,
  MessageCircle,
  Lock,
  Plus,
  Cake,
} from "lucide-react"
import { IoIosMegaphone } from "react-icons/io"
import CommuncationBg from "../../public/communication-bg.svg"
import AddAppointmentModal from "../components/appointments-components/add-appointment-modal"
import SelectedAppointmentModal from "../components/appointments-components/selected-appointment-modal"
import DefaultAvatar from "../../public/default-avatar.avif" // Assuming this path is correct

const img1 = "/Rectangle 1.png"
const img2 = "/avatar3.png"

const emailList = {
  inbox: [
    {
      id: 1,
      sender: "support@example.com",
      subject: "Your recent inquiry",
      body: "Dear user, thank you for contacting us. We have received your inquiry and will get back to you within 24 hours. Best regards, Support Team",
      time: "2025-07-18T10:00:00Z",
      isRead: false,
    },
    {
      id: 2,
      sender: "marketing@example.com",
      subject: "New product launch!",
      body: "Exciting news! Our new product is now available. Check it out here: [link]",
      time: "2025-07-17T15:30:00Z",
      isRead: true,
    },
  ],
  sent: [
    {
      id: 3,
      recipient: "jennifer@example.com",
      subject: "Meeting Reminder",
      body: "Hi Jennifer, just a friendly reminder about our meeting tomorrow at 10 AM. Please be prepared to discuss the project milestones. Thanks!",
      status: "Delivered",
      time: "2025-07-16T09:00:00Z",
      isRead: true,
    },
    {
      id: 4,
      recipient: "jerry@example.com",
      subject: "Event Announcement",
      body: "Hi Jerry, We're excited to announce our upcoming event! It will be held on August 1st at the community center. More details to follow soon.",
      status: "Read",
      time: "2025-07-15T14:30:00Z",
      isRead: true,
    },
  ],
  draft: [
    {
      id: 5,
      recipient: "draft@example.com",
      subject: "Draft Email Subject",
      body: "This is a draft email. I'll finish it later.",
      status: "Draft",
      time: "2025-07-19T11:00:00Z",
      isRead: true,
    },
  ],
  outbox: [],
  archive: [],
  error: [],
}

export default function Communications() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(true)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [showChatDropdown, setShowChatDropdown] = useState(false)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [chatType, setChatType] = useState("member")
  const [activeScreen, setActiveScreen] = useState("chat") // 'chat', 'send-message', 'email-frontend', 'email-view'
  const [selectedMembers, setSelectedMembers] = useState([])
  const [messageText, setMessageText] = useState("")
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaUpload, setShowMediaUpload] = useState(false)
  const [chatList, setChatList] = useState([])
  const [archivedChats, setArchivedChats] = useState([])
  const [searchMember, setSearchMember] = useState("")
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [messageReactions, setMessageReactions] = useState({})
  const [unreadMessagesCount, setUnreadMessagesCount] = useState({
    member: 0,
    company: 0,
    email: 0,
  })
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showEmailFrontend, setShowEmailFrontend] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showChatMenu, setShowChatMenu] = useState(null)
  const [pinnedChats, setPinnedChats] = useState(new Set())
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [broadcastFolders, setBroadcastFolders] = useState([
    { id: 1, name: "General", messages: [] },
    { id: 2, name: "Announcements", messages: [] },
    { id: 3, name: "Events", messages: [] },
  ])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  })
  const [settings, setSettings] = useState({
    autoArchiveDuration: 30, // days
    emailNotifications: true,
    chatNotifications: true,
    studioChatNotifications: true, // New
    memberChatNotifications: true, // New
    emailSignature: "Best regards,\nYour Team",
    broadcastEmail: true,
    broadcastChat: true,
    smtpHost: "smtp.example.com", // New
    smtpPort: 587, // New
    smtpUser: "user@example.com", // New
    smtpPass: "password", // New
    birthdayMessageEnabled: true, // New
    birthdayMessageTemplate: "Happy Birthday, {name}!", // New
    appointmentNotificationEnabled: true, // New
    appointmentNotificationTemplate: "Reminder: You have an appointment on {date} at {time}.", // New
  })
  const [preConfiguredMessages, setPreConfiguredMessages] = useState([
    {
      id: 1,
      title: "Meeting Reminder",
      message: "This is a reminder about our upcoming meeting.",
      folderId: 1,
    },
    {
      id: 2,
      title: "Event Announcement",
      message: "We're excited to announce our upcoming event!",
      folderId: 2,
    },
    {
      id: 3,
      title: "Important Update",
      message: "There has been an important update to our policies.",
      folderId: 2,
    },
    {
      id: 4,
      title: "Welcome Message",
      message: "Welcome to our platform! We're glad to have you here.",
      folderId: 1,
    },
  ])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: "Initial Consultation",
      date: "2025-03-15T10:00",
      status: "upcoming",
      type: "Consultation",
      memberId: 1,
    },
    {
      id: 2,
      title: "Follow-up Meeting",
      date: "2025-03-20T14:30",
      status: "upcoming",
      type: "Follow-up",
      memberId: 1,
    },
    {
      id: 3,
      title: "Annual Review",
      date: "2025-04-05T11:00",
      status: "upcoming",
      type: "Annual Review",
      memberId: 2,
    },
  ])
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    date: "",
    status: "upcoming",
  })
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showSelectedAppointmentModal, setShowSelectedAppointmentModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("")
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null)
  const [appointmentTypes, setAppointmentTypes] = useState([
    { name: "Consultation", duration: 30, color: "bg-blue-700" },
    { name: "Follow-up", duration: 45, color: "bg-green-700" },
    { name: "Annual Review", duration: 60, color: "bg-purple-600" },
  ])
  const [freeAppointments, setFreeAppointments] = useState([
    { id: 1, date: "2025-03-15", time: "9:00 AM" },
    { id: 2, date: "2025-03-15", time: "11:00 AM" },
    { id: 3, date: "2025-03-15", time: "2:00 PM" },
    { id: 4, date: "2025-03-20", time: "10:00 AM" },
    { id: 5, date: "2025-03-20", time: "1:30 PM" },
    { id: 6, date: "2025-04-05", time: "9:30 AM" },
    { id: 7, date: "2025-04-05", time: "3:00 PM" },
  ])
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
  const [newMessage, setNewMessage] = useState({ title: "", message: "", folderId: 1 })
  const [contingent, setContingent] = useState({ used: 1, total: 7 })
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("04.14.25 - 04.18.2025")
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 }) // For contingent modal
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("current") // For contingent modal
  const [showAddBillingPeriodModal, setShowAddBillingPeriodModal] = useState(false) // For contingent modal
  const [newBillingPeriod, setNewBillingPeriod] = useState("") // For contingent modal

  // Member contingent data structure (from Members.jsx reference)
  const [memberContingentData, setMemberContingentData] = useState({
    1: {
      current: { used: 2, total: 7 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
        "07.14.25 - 07.18.2025": { used: 0, total: 8 },
        "08.14.25 - 08.18.2025": { used: 0, total: 8 },
        "09.14.25 - 09.18.2025": { used: 0, total: 8 },
      },
    },
    2: {
      current: { used: 1, total: 8 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
    3: {
      current: { used: 0, total: 5 },
      future: {},
    },
    4: {
      current: { used: 3, total: 10 },
      future: {},
    },
    5: {
      current: { used: 0, total: 6 },
      future: {},
    },
    100: {
      current: { used: 0, total: 0 }, // Company chat has no contingent
      future: {},
    },
  })

  const [emailTab, setEmailTab] = useState("inbox") // 'inbox', 'sent', 'draft', 'outbox', 'archive', 'error'
  const [selectedEmail, setSelectedEmail] = useState(null) // For viewing full email content

  // Member View States (from Members.jsx context)
  const [isMemberOverviewModalOpen, setIsMemberOverviewModalOpen] = useState(false)
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] = useState("details") // 'details', 'relations'
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })

  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const chatDropdownRef = useRef(null)
  const groupDropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const recipientDropdownRef = useRef(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const chatMenuRef = useRef(null)
  const emailSearchInputRef = useRef(null)
  const notePopoverRef = useRef(null)

  // Dummy Member Data (from Members.jsx context)
  const [members, setMembers] = useState([
    {
      id: 1,
      firstName: "Jennifer",
      lastName: "Markus",
      title: "Jennifer Markus",
      email: "jennifer@example.com",
      phone: "+1234567890",
      street: "123 Main St",
      zipCode: "12345",
      city: "New York",
      image: img1,
      isActive: true,
      isArchived: false,
      memberType: "full",
      note: "Allergic to peanuts. Prefers morning sessions.",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1990-05-15",
      about: "Experienced developer with a passion for clean code.",
      joinDate: "2022-03-01",
      contractStart: "2022-03-01",
      contractEnd: "2025-03-01",
    },
    {
      id: 2,
      firstName: "Jerry",
      lastName: "Haffer",
      title: "Jerry Haffer",
      email: "jerry@example.com",
      phone: "+1234567891",
      street: "456 Oak St",
      zipCode: "67890",
      city: "Los Angeles",
      image: img1,
      isActive: true,
      isArchived: false,
      memberType: "full",
      note: "Loves cardio workouts.",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1985-08-22",
      about: "Certified PMP with 10 years of experience in IT project management.",
      joinDate: "2021-11-15",
      contractStart: "2021-11-15",
      contractEnd: "2025-04-15",
    },
    {
      id: 3,
      firstName: "Group",
      lastName: "1",
      title: "Group 1",
      email: "group1@example.com",
      phone: null,
      street: null,
      zipCode: null,
      city: null,
      image: img2,
      isActive: true,
      isArchived: false,
      memberType: "group", // Custom type for groups
      note: "General group chat for project updates.",
      noteStartDate: null,
      noteEndDate: null,
      noteImportance: "unimportant",
      dateOfBirth: null,
      about: "A group of members working on Project X.",
      joinDate: "2023-01-01",
      contractStart: null,
      contractEnd: null,
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Eison",
      title: "David Eison",
      email: "david@example.com",
      phone: "+1234567893",
      street: "321 Elm St",
      zipCode: "98765",
      city: "Miami",
      image: img2,
      isActive: true,
      isArchived: false,
      memberType: "full",
      note: "Personal training focused.",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      dateOfBirth: "1988-07-25",
      about: "Dedicated to personal fitness goals.",
      joinDate: "2022-06-01",
      contractStart: "2022-06-01",
      contractEnd: "2025-06-01",
    },
    {
      id: 5,
      firstName: "Mary",
      lastName: "Freund",
      title: "Mary Freund",
      email: "mary@example.com",
      phone: "+1234567894",
      street: "654 Maple Ave",
      zipCode: "13579",
      city: "Seattle",
      image: img1,
      isActive: true,
      isArchived: false,
      memberType: "full",
      note: "Strength training enthusiast.",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1991-12-05",
      about: "Powerlifter and strength training coach.",
      joinDate: "2022-02-15",
      contractStart: "2022-02-15",
      contractEnd: "2025-02-15",
    },
    {
      id: 100,
      firstName: "Fit Chain",
      lastName: "GmbH",
      title: "Fit Chain GmbH",
      email: "studio@fitchain.com",
      phone: null,
      street: null,
      zipCode: null,
      city: null,
      image: img1,
      isActive: true,
      isArchived: false,
      memberType: "company",
      note: "Official studio communication channel.",
      noteStartDate: null,
      noteEndDate: null,
      noteImportance: "unimportant",
      dateOfBirth: null,
      about: "The main communication channel for Fit Chain GmbH.",
      joinDate: "2020-01-01",
      contractStart: null,
      contractEnd: null,
    },
  ])

  // Dummy Member Relations Data (from Members.jsx context)
  const [memberRelations, setMemberRelations] = useState({
    1: {
      family: [
        { name: "Anna Doe", relation: "Mother", id: 101, type: "member" },
        { name: "Peter Doe", relation: "Father", id: 102, type: "lead" },
      ],
      friendship: [{ name: "Max Miller", relation: "Best Friend", id: 201, type: "member" }],
      relationship: [{ name: "Marie Smith", relation: "Partner", id: 301, type: "member" }],
      work: [{ name: "Tom Wilson", relation: "Colleague", id: 401, type: "lead" }],
      other: [{ name: "Mrs. Smith", relation: "Neighbor", id: 501, type: "manual" }],
    },
    2: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
    3: { family: [], friendship: [], relationship: [], work: [], other: [] }, // Group 1
    4: { family: [], friendship: [], relationship: [], work: [], other: [] }, // David Eison
    5: { family: [], friendship: [], relationship: [], work: [], other: [] }, // Mary Freund
    100: { family: [], friendship: [], relationship: [], work: [], other: [] }, // Fit Chain GmbH
  })

  // Dummy Member History Data (from Members.jsx context)
  const [memberHistory, setMemberHistory] = useState({
    1: {
      general: [
        {
          id: 1,
          date: "2025-01-15",
          action: "Email updated",
          details: "Changed from old@email.com to jennifer@example.com",
          user: "Admin",
        },
        { id: 2, date: "2025-01-10", action: "Phone updated", details: "Updated phone number", user: "Admin" },
      ],
      checkins: [
        { id: 1, date: "2025-01-20T09:30", type: "Check-in", location: "Main Entrance", user: "Jennifer Markus" },
        { id: 2, date: "2025-01-20T11:45", type: "Check-out", location: "Main Entrance", user: "Jennifer Markus" },
      ],
      appointments: [
        { id: 1, date: "2025-01-18T10:00", title: "Personal Training", status: "completed", trainer: "Mike Johnson" },
        { id: 2, date: "2025-01-15T14:30", title: "Consultation", status: "completed", trainer: "Sarah Wilson" },
      ],
      finance: [
        {
          id: 1,
          date: "2025-01-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
        {
          id: 2,
          date: "2024-12-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
      ],
      contracts: [
        {
          id: 1,
          date: "2024-03-01",
          action: "Contract signed",
          details: "Initial 12-month membership contract",
          user: "Admin",
        },
        { id: 2, date: "2024-02-28", action: "Contract updated", details: "Extended contract duration", user: "Admin" },
      ],
    },
    2: {
      general: [
        {
          id: 1,
          date: "2025-01-12",
          action: "Profile updated",
          details: "Updated personal information",
          user: "Admin",
        },
      ],
      checkins: [
        { id: 1, date: "2025-01-19T08:00", type: "Check-in", location: "Main Entrance", user: "Jerry Haffer" },
        { id: 2, date: "2025-01-19T10:30", type: "Check-out", location: "Main Entrance", user: "Jerry Haffer" },
      ],
      appointments: [
        { id: 1, date: "2025-01-17T14:00", title: "Cardio Session", status: "completed", trainer: "Lisa Davis" },
      ],
      finance: [
        {
          id: 1,
          date: "2025-01-01",
          type: "Payment",
          amount: "$89.99",
          description: "Monthly membership fee",
          status: "completed",
        },
      ],
      contracts: [
        {
          id: 1,
          date: "2021-11-15",
          action: "Contract signed",
          details: "Initial membership contract",
          user: "Admin",
        },
      ],
    },
    3: { general: [], checkins: [], appointments: [], finance: [], contracts: [] }, // Group 1
    4: { general: [], checkins: [], appointments: [], finance: [], contracts: [] }, // David Eison
    5: { general: [], checkins: [], appointments: [], finance: [], contracts: [] }, // Mary Freund
    100: { general: [], checkins: [], appointments: [], finance: [], contracts: [] }, // Fit Chain GmbH
  })

  // Dummy Available Members/Leads for Relations (from Members.jsx context)
  const availableMembersLeads = [
    { id: 1, name: "Jennifer Markus", type: "member" },
    { id: 2, name: "Jerry Haffer", type: "member" },
    { id: 4, name: "David Eison", type: "member" },
    { id: 5, name: "Mary Freund", type: "member" },
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
  ]

  // Relation options by category (from Members.jsx context)
  const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
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
        // Close note popover if clicked outside
        // This state is not directly used in Communications, but good practice if it were.
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    // Calculate unread counts for tabs
    const memberUnread = memberChatList.filter((chat) => !chat.isRead && chat.unreadCount > 0).length
    const companyUnread = companyChatList.filter((chat) => !chat.isRead && chat.unreadCount > 0).length
    const emailUnread = emailList.inbox.filter((email) => !email.isRead).length

    setUnreadMessagesCount({
      member: memberUnread,
      company: companyUnread,
      email: emailUnread,
    })
  }, [chatList, archivedChats, emailList]) // Depend on lists that might change unread status

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleNewChat = () => {
    setShowChatDropdown(true)
    setShowGroupDropdown(false)
    setActiveDropdownId(null)
  }
  const handleNewGroup = () => {
    setShowGroupDropdown(true)
    setShowChatDropdown(false)
    setActiveDropdownId(null)
  }

  // Staff chat list (renamed from employee)
  const staffChatList = [
    {
      id: 1,
      name: "Jennifer Markus",
      time: "Today | 05:30 PM",
      active: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      isBirthday: true,
      isRead: false,
      unreadCount: 2, // New
      messageStatus: "read",
      messages: [
        {
          id: 1,
          sender: "Jennifer",
          content: "Oh, hello! All perfectly. I will check it and get back to you soon.",
          time: "04:45 PM",
          isUnread: false,
          status: "read",
        },
        {
          id: 2,
          sender: "You",
          content: "Yes, hello! All perfectly. I will check it and get back to you soon.",
          time: "04:45 PM",
          isUnread: false,
          status: "read",
        },
      ],
    },
    {
      id: 2,
      name: "Jerry Haffer",
      time: "Today | 05:30 PM",
      verified: true,
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      isRead: true,
      unreadCount: 0, // New
      messageStatus: "delivered",
      messages: [
        {
          id: 1,
          sender: "Jerry",
          content: "Have you seen the latest design updates?",
          time: "03:30 PM",
          isUnread: false,
          status: "delivered",
        },
        {
          id: 2,
          sender: "You",
          content: "Not yet, I'll take a look right away.",
          time: "03:32 PM",
          isUnread: false,
          status: "sent",
        },
      ],
    },
  ]
  const memberChatList = [
    {
      id: 3,
      name: "Group 1",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
      isRead: true,
      unreadCount: 0, // New
      messageStatus: "read",
      messages: [
        {
          id: 1,
          sender: "Alex",
          content: "When is our next meeting scheduled?",
          time: "02:15 PM",
          isUnread: false,
          status: "read",
        },
        {
          id: 2,
          sender: "You",
          content: "Tomorrow at 10 AM.",
          time: "02:17 PM",
          isUnread: false,
          status: "read",
        },
      ],
    },
    {
      id: 4,
      name: "David Eison",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img2,
      isBirthday: true,
      isRead: false,
      unreadCount: 5, // New
      messageStatus: "sent",
      messages: [
        {
          id: 1,
          sender: "David",
          content: "Can we discuss the project timeline?",
          time: "01:45 PM",
          isUnread: false,
          status: "sent",
        },
        {
          id: 2,
          sender: "You",
          content: "Sure, I'm available this afternoon.",
          time: "01:50 PM",
          isUnread: false,
          status: "delivered",
        },
      ],
    },
    {
      id: 5,
      name: "Mary Freund",
      time: "Today | 05:30 PM",
      message: "Hey! Did you finish the Hi-Fi wireframes for Beta app design?",
      logo: img1,
      isRead: true,
      unreadCount: 0, // New
      messageStatus: "delivered",
      messages: [
        {
          id: 1,
          sender: "Mary",
          content: "Did you review the latest feedback?",
          time: "11:20 AM",
          isUnread: false,
          status: "delivered",
        },
        {
          id: 2,
          sender: "You",
          content: "Yes, I've incorporated the changes.",
          time: "11:25 AM",
          isUnread: false,
          status: "read",
        },
      ],
    },
  ]
  // Company chat - single chat with studio name
  const companyChatList = [
    {
      id: 100,
      name: "Fit Chain GmbH",
      time: "Today | 05:30 PM",
      message: "Welcome to Fit Chain GmbH communications",
      logo: img1,
      isRead: false, // Changed to unread for demo
      unreadCount: 1, // New
      messageStatus: "read",
      messages: [
        {
          id: 1,
          sender: "System",
          content: "Welcome to Fit Chain GmbH internal communications.",
          time: "09:00 AM",
          isUnread: false,
          status: "read",
        },
      ],
    },
  ]



  const handleArchiveChat = (chatId, e) => {
    e.stopPropagation()
    const chatToArchive = chatList.find((chat) => chat.id === chatId)
    if (chatToArchive) {
      setArchivedChats((prev) => [...prev, { ...chatToArchive, isArchived: true }])
    }
    setChatList((prevList) => prevList.filter((chat) => chat.id !== chatId))
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(null)
      setIsMessagesOpen(true) // Go back to sidebar on mobile
    }
    setShowChatMenu(null)
  }

  const handleRestoreChat = (chatId) => {
    const chatToRestore = archivedChats.find((chat) => chat.id === chatId)
    if (chatToRestore) {
      setChatList((prev) => [...prev, { ...chatToRestore, isArchived: false }])
      setArchivedChats((prev) => prev.filter((chat) => chat.id !== chatId))
    }
  }

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
    ) // Set unread count to 1 for simplicity
    setShowChatMenu(null)
  }

  const handleViewMember = (chatId, e) => {
    if (e) e.stopPropagation() // Stop propagation if event object exists

    let member = members.find((m) => m.id === chatId)
    if (!member) {
      // If it's a chat, try to find the corresponding member
      const chat = chatList.find((c) => c.id === chatId) || archivedChats.find((c) => c.id === chatId)
      if (chat) {
        member = members.find((m) => m.name === chat.name) // Assuming name matches for simplicity
      }
    }

    if (member) {
      setSelectedMember(member)
      setIsMemberOverviewModalOpen(true) // Open the overview modal
      setIsMessagesOpen(false) // Close sidebar on mobile
    } else {
      alert("Member details not found.")
    }
    setShowChatMenu(null) // Close chat menu if opened from there
  }

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
              isRead: true, // Mark as read when sending a message
              unreadCount: 0,
            }
          : chat,
      ),
    )
    // Auto-dearchive if chat was archived
    if (archivedChats.some((chat) => chat.id === selectedChat.id)) {
      handleRestoreChat(selectedChat.id)
    }
    setMessageText("")
    // Simulate message status updates
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
    setIsMessagesOpen(false) // Close sidebar on mobile
  }

  const handleSendEmail = () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      alert("Please fill in all email fields")
      return
    }
    // Add signature if enabled
    const bodyWithSignature = settings.emailSignature
      ? `${emailData.body}\n\n${settings.emailSignature}`
      : emailData.body
    console.log("Sending email:", { ...emailData, body: bodyWithSignature })
    alert("Email sent successfully!")
    setEmailData({ to: "", subject: "", body: "" })
    setShowEmailModal(false)
    // Simulate adding to sent emails
    emailList.sent.unshift({
      id: Date.now(),
      recipient: emailData.to,
      subject: emailData.subject,
      body: bodyWithSignature,
      status: "Sent",
      time: new Date().toLocaleString(),
      isRead: true,
    })
  }

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
      memberId: selectedChat?.id, // Associate with selected chat member
    }
    setAppointments([...appointments, newAppointment])
    setShowAddAppointmentModal(false)
  }

  const handleCalendarClick = () => {
    // When clicking calendar icon in chat header, open appointment modal for selected chat member
    if (selectedChat) {
      setSelectedMember(members.find((m) => m.id === selectedChat.id)) // Find the full member object
      setShowAppointmentModal(true)
    }
  }

  const handleEditAppointment = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: selectedChat?.name || "Member",
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    }
    setSelectedAppointmentData(fullAppointment)
    setShowSelectedAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleCreateNewAppointment = () => {
    setShowAddAppointmentModal(true)
    setShowAppointmentModal(false)
  }

  const handleMemberSelect = (member) => {
    setSelectedRecipients((prev) => (prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]))
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    if (newSelectAll) {
      const filteredList = [...chatList, ...archivedChats].filter(
        (chat) => searchMember === "" || chat.name.toLowerCase().includes(searchMember.toLowerCase()),
      )
      setSelectedRecipients(filteredList)
    } else {
      setSelectedRecipients([])
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessageText((prevText) => prevText + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File uploaded:", file.name)
      setShowMediaUpload(false)
    }
  }

  const handleBroadcast = () => {
    if (!selectedMessage) {
      alert("Please select a message to broadcast")
      return
    }
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient")
      return
    }
    // Add message to selected folder
    if (selectedFolder) {
      setBroadcastFolders((prev) =>
        prev.map((folder) =>
          folder.id === selectedFolder.id ? { ...folder, messages: [...folder.messages, selectedMessage] } : folder,
        ),
      )
    }
    console.log("Broadcasting message to recipients:", selectedRecipients)
    console.log("Broadcast title:", selectedMessage.title)
    console.log("Broadcast message:", selectedMessage.message)
    console.log("Distribution methods:", { email: settings.broadcastEmail, chat: settings.broadcastChat })
    alert(
      `Broadcast sent to ${selectedRecipients.length} recipients via ${
        settings.broadcastEmail && settings.broadcastChat
          ? "Email and Chat"
          : settings.broadcastEmail
            ? "Email"
            : "Chat"
      }`,
    )
    setSelectedMessage(null)
    setSelectedRecipients([])
    setActiveScreen("chat")
  }

  const handleCreateMessage = () => {
    setShowCreateMessageModal(true)
    // Pre-select the first folder when opening "Create New Template"
    if (broadcastFolders.length > 0) {
      setNewMessage((prev) => ({ ...prev, folderId: broadcastFolders[0].id }))
    }
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
    setIsMessagesOpen(false) // Close sidebar on mobile
    setActiveScreen("chat") // Ensure we are on the chat screen
    // Mark chat as read when opened
    setChatList((prevList) => prevList.map((c) => (c.id === chat.id ? { ...c, isRead: true, unreadCount: 0 } : c)))
  }

  const handleCancelAppointment = (id) => {
    setSelectedAppointmentData(appointments.find((app) => app.id === id))
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
  }

  const handleSaveAppointment = () => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((app) => (app.id === editingAppointment.id ? { ...app, ...newAppointment } : app)),
      )
      setEditingAppointment(null)
    } else {
      const id = Math.max(0, ...appointments.map((a) => a.id)) + 1
      setAppointments([...appointments, { id, ...newAppointment }])
    }
    setNewAppointment({ title: "", date: "", status: "upcoming" })
  }

  const handleManageContingent = () => {
    // Use selectedChat.id to get the correct contingent data
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
    // Save settings logic here
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

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-10 h-10 text-gray-400" /> // Larger checkmark
      case "delivered":
        return <CheckCheck className="w-10 h-10 text-gray-400" /> // Larger checkmark
      case "read":
        return <CheckCheck className="w-10 h-10 text-blue-500" /> // Larger checkmark
      default:
        return null
    }
  }

  const reactions = [
    { emoji: "❤️", name: "heart" },
    { emoji: "😂", name: "laugh" },
    { emoji: "😮", name: "wow" },
    { emoji: "😢", name: "sad" },
    { emoji: "😡", name: "angry" },
  ]

  // Filter and sort chats (pinned first, then by time)
  const sortedChatList = [...chatList].sort((a, b) => {
    const aPinned = pinnedChats.has(a.id)
    const bPinned = pinnedChats.has(b.id)
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1
    return 0
  })

  // Combined search for both active and archived chats
  const searchResults = searchMember
    ? [...chatList, ...archivedChats].filter((chat) => chat.name.toLowerCase().includes(searchMember.toLowerCase()))
    : []

  // Contingent management functions (from Members.jsx reference)
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

  const handleBillingPeriodChange = (periodId) => {
    setSelectedBillingPeriod(periodId)
    const memberId = selectedChat?.id
    const memberData = memberContingentData[memberId]
    if (periodId === "current") {
      setTempContingent(memberData.current)
    } else {
      setTempContingent(memberData.future[periodId] || { used: 0, total: 0 })
    }
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

  const handleEmailTabClick = (tab) => {
    setEmailTab(tab)
    setSelectedEmail(null) // Close email view when changing tabs
  }

  const handleEmailItemClick = (email) => {
    setSelectedEmail(email)
    // Mark email as read
    if (!email.isRead) {
      const updatedEmailList = { ...emailList }
      const tabToUpdate = updatedEmailList[emailTab]
      const emailIndex = tabToUpdate.findIndex((e) => e.id === email.id)
      if (emailIndex !== -1) {
        tabToUpdate[emailIndex] = { ...tabToUpdate[emailIndex], isRead: true }
        // This is a shallow copy, for a real app you'd need to update the state immutably
        // For this demo, direct modification is fine as emailList is a local const
      }
      setUnreadMessagesCount((prev) => ({
        ...prev,
        email: updatedEmailList.inbox.filter((e) => !e.isRead).length,
      }))
    }
  }

  const handleSearchMemberForEmail = (query) => {
    // This would typically fetch members from a backend
    // For now, filter from existing chat lists
    const allMembers = [...staffChatList, ...memberChatList].filter(
      (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.email?.toLowerCase().includes(query.toLowerCase()),
    )
    return allMembers
  }

  const handleSelectEmailRecipient = (member) => {
    setEmailData((prev) => ({ ...prev, to: member.email || member.name }))
    setShowRecipientDropdown(false) // Close dropdown after selection
  }

  // Member Details/Overview Functions (from Members.jsx context)
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const isContractExpiringSoon = (contractEnd) => {
    if (!contractEnd) return false
    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)
    return endDate <= oneMonthFromNow && endDate >= today
  }

  const redirectToContract = () => {
    alert("Redirecting to contract page (placeholder)")
    // window.location.href = "/dashboard/contract"
  }

  const handleViewDetailedInfo = () => {
    setIsMemberOverviewModalOpen(false)
    setActiveMemberDetailsTab("details")
    setIsMemberDetailsModalOpen(true)
  }

  const handleCalendarFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // Set the selected member for appointments and open the appointment modal
    setSelectedMember(selectedMember) // Ensure selectedMember is passed to the appointment modal context
    setShowAppointmentModal(true)
  }

  const handleHistoryFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    setShowHistoryModal(true)
  }

  const handleCommunicationFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    // If the member has a chat, select it and go to chat view
    const chat = chatList.find((c) => c.id === selectedMember?.id)
    if (chat) {
      handleChatSelect(chat)
    } else {
      alert("No direct chat found for this member.")
    }
  }

  const handleEditFromOverview = () => {
    setIsMemberOverviewModalOpen(false)
    alert("Edit functionality would be implemented here.")
  }

  const handleAddRelation = () => {
    if (!newRelation.name || !newRelation.relation) {
      alert("Please fill in all fields")
      return
    }
    const relationId = Date.now()
    const updatedRelations = { ...memberRelations }
    if (!updatedRelations[selectedMember.id]) {
      updatedRelations[selectedMember.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }
    updatedRelations[selectedMember.id][newRelation.category].push({
      id: relationId,
      name: newRelation.name,
      relation: newRelation.relation,
      type: newRelation.type,
    })
    setMemberRelations(updatedRelations)
    setNewRelation({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
    alert("Relation added successfully")
  }

  const handleDeleteRelation = (category, relationId) => {
    const updatedRelations = { ...memberRelations }
    updatedRelations[selectedMember.id][category] = updatedRelations[selectedMember.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelations(updatedRelations)
    alert("Relation deleted successfully")
  }

  const getMemberAppointments = (memberId) => {
    return appointments.filter((app) => app.memberId === memberId)
  }

  return (
    <div className="relative flex h-screen bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden">
      {isMessagesOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMessagesOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 md:w-[380px] w-full rounded-tr-3xl rounded-br-3xl transform transition-transform duration-500 ease-in-out ${
          isMessagesOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-black z-40`}
      >
        <div className="p-4 h-full flex flex-col relative">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Communications</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-800 rounded-full"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              {/* Removed X button from sidebar header */}
            </div>
          </div>
          <div className="flex gap-2 items-center justify-between mb-4">
            <div className="flex bg-[#000000] rounded-xl border border-slate-300/30 p-1">
              <button
                className={`px-4 py-2 flex items-center rounded-lg text-sm transition-colors relative ${
                  chatType === "member" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setChatType("member")}
              >
                <User size={16} className="inline mr-2" />
                Member
                {unreadMessagesCount.member > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount.member}
                  </span>
                )}
              </button>
              <button
                className={`px-4 flex items-center py-2 rounded-lg text-sm transition-colors relative ${
                  chatType === "company" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setChatType("company")}
              >
                <Building2 size={16} className="inline mr-2" />
                Studio
                {unreadMessagesCount.company > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                {unreadMessagesCount.email > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount.email}
                  </span>
                )}
              </button>
            </div>
            {/* Removed MoreVertical dropdown (New Chat, New Group) */}
          </div>
          {chatType !== "company" && (
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
          )}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
            {/* Show search results if searching */}
            {searchMember && searchResults.length > 0
              ? searchResults.map((chat, index) => (
                  <div
                    key={`search-${chat.id}-${index}`}
                    className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-xl ${
                      selectedChat?.id === chat.id ? "bg-[#181818]" : "hover:bg-[#181818]"
                    } cursor-pointer relative group`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="relative">
                      <img
                        src={chat.logo || "/placeholder.svg?height=40&width=40"}
                        alt={`${chat.name}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewMember(chat.id, e)
                        }}
                      />
                      {chat.isBirthday && (
                        <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                          <Gift className="w-4 h-4 text-white" />
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
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <p className="truncate">{chat.message}</p>
                        {getMessageStatusIcon(chat.messageStatus)}
                      </div>
                      <div className="flex mt-1 text-gray-400 items-center gap-1">
                        <Clock size={15} />
                        <span className="text-sm text-gray-400">{chat.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              : /* Regular chat list */
                sortedChatList.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-6 border-b border-slate-700 rounded-xl ${
                      selectedChat?.id === chat.id ? "bg-[#181818]" : "hover:bg-[#181818]"
                    } cursor-pointer relative group`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="relative">
                      <img
                        src={chat.logo || "/placeholder.svg?height=40&width=40"}
                        alt={`${chat.name}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          {chatType !== 'company' && handleViewMember(chat.id, e)}
                        }}
                      />
                      {chat.isBirthday && (
                        <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                          <Gift className="w-5 h-5 text-white" />
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
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <p className="truncate">{chat.message}</p>
                        {getMessageStatusIcon(chat.messageStatus)}
                      </div>
                      <div className="flex mt-1 text-gray-400 items-center gap-1">
                        <Clock size={15} />
                        <span className="text-sm text-gray-400">{chat.time}</span>
                      </div>
                    </div>
                    {chatType !== "company" && (
                      <div className="relative">
                        <button
                          className="opacity-100 p-1 hover:bg-gray-600 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowChatMenu(showChatMenu === chat.id ? null : chat.id)
                          }}
                          aria-label="Chat options"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-300" />
                        </button>
                        {showChatMenu === chat.id && (
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
                              View Member {/* Renamed */}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            {sortedChatList.length === 0 && !searchMember && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="mb-2">No chats available</p>
                {chatType !== "company" && (
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2"
                    onClick={handleNewChat}
                  >
                    Start a new chat
                  </button>
                )}
              </div>
            )}
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
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
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
                    className="rounded-full cursor-pointer"
                    onClick={() => handleViewMember(selectedChat.id, {})}
                  />
                  {selectedChat.isBirthday && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <span
                  className="font-medium cursor-pointer hover:text-blue-400"
                  onClick={() => handleViewMember(selectedChat.id, {})}
                >
                  {selectedChat.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-400"
                  aria-label="View appointments"
                  onClick={handleCalendarClick}
                >
                  <Calendar className="w-6 h-6" />
                </button>
               
                <div className="relative flex items-center">
                  <button
                    className="hover:text-gray-300 z-10"
                    aria-label="Search conversation"
                    onClick={handleSearchClick}
                  >
                    <Search className="w-6 h-6" />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="absolute right-0 bg-gray-800 text-white rounded-md py-1 px-2 text-sm focus:outline-none search-input-animation"
                    style={{
                      width: isSearchOpen ? 200 : 0,
                      opacity: isSearchOpen ? 1 : 0,
                      visibility: isSearchOpen ? "visible" : "hidden",
                    }}
                  />
                </div>
                {/* Removed X button from chat header */}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === "You" ? "justify-end" : ""} group`}>
                  <div className={`flex flex-col gap-1 ${message.sender === "You" ? "items-end" : ""}`}>
                    <div
                      className={`rounded-xl p-4 text-sm max-w-md relative ${
                        message.sender === "You" ? "bg-[#3F74FF]" : "bg-black"
                      } ${message.isUnread ? "border-2 border-yellow-500" : ""}`}
                    >
                      <p>{message.content}</p>
                      {/* Message actions */}
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <button
                          onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                          className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full"
                          title="Add reaction"
                        >
                          <Smile className="w-5 h-5" />
                        </button>
                        {/* Removed individual message mark as unread button as per new requirement */}
                      </div>
                      {/* Reaction picker */}
                      {showReactionPicker === message.id && (
                        <div className="absolute -top-12 left-0 bg-gray-800 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                          {reactions.map((reaction) => (
                            <button
                              key={reaction.name}
                              onClick={() => handleReaction(message.id, reaction.name)}
                              className="p-1 hover:bg-gray-700 rounded text-xl"
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Display reactions */}
                      {messageReactions[message.id] && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(messageReactions[message.id]).map(([reactionName, count]) => {
                            const reaction = reactions.find((r) => r.name === reactionName)
                            return (
                              <span
                                key={reactionName}
                                className="bg-gray-700 rounded-full px-2 py-1 text-xs flex items-center gap-1"
                              >
                                <span className="text-lg">{reaction?.emoji}</span> {count}
                              </span>
                            )
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
            <div className="p-4 border-t border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2 bg-black rounded-xl p-2">
                <button
                  className="p-2 hover:bg-gray-700 rounded-full"
                  aria-label="Add emoji"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-7 h-7 text-gray-200" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent focus:outline-none text-sm min-w-0"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 hover:bg-gray-700 rounded-full"
                    aria-label="Send message"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-7 h-7 text-gray-200" />
                  </button>
                </div>
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {["😀", "😂", "😊", "❤️", "👍", "🎉", "🔥", "⭐", "🙏", "👏"].map((emoji, i) => (
                        <button
                          key={i}
                          className="p-2 hover:bg-gray-700 rounded-md text-2xl"
                          onClick={() => handleEmojiSelect({ native: emoji })}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {activeScreen === "send-message" && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">New Broadcast</h2>
                  <button onClick={() => setActiveScreen("chat")} className="p-2 hover:bg-zinc-700 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Folder Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-400">Message Folder</label>
                      <button
                        onClick={() => setShowFolderModal(true)}
                        className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1"
                      >
                        <FolderPlus className="w-4 h-4" />
                        New Folder
                      </button>
                    </div>
                    <select
                      value={selectedFolder?.id || ""}
                      onChange={(e) =>
                        setSelectedFolder(broadcastFolders.find((f) => f.id === Number.parseInt(e.target.value)))
                      }
                      className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    >
                      <option value="">Select folder...</option>
                      {broadcastFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name} ({folder.messages.length} messages)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Select Pre-configured Message
                    </label>
                    <div className="bg-[#222222] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      {preConfiguredMessages
                        .filter((msg) => !selectedFolder || msg.folderId === selectedFolder.id)
                        .map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => setSelectedMessage(msg)}
                            className={`p-3 cursor-pointer hover:bg-[#2F2F2F] ${
                              selectedMessage?.id === msg.id ? "bg-[#2F2F2F] border-l-4 border-blue-500" : ""
                            }`}
                          >
                            <p className="font-medium text-sm">{msg.title}</p>
                            <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={handleCreateMessage}
                      className="w-full py-2 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      Create New Template {/* Renamed */}
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowRecipientDropdown(!showRecipientDropdown)
                        if (!showRecipientDropdown) {
                          setSearchMember("")
                        }
                      }}
                      className="w-full py-3 bg-blue-600 text-sm hover:bg-blue-700 text-white rounded-xl"
                    >
                      Select Recipients
                    </button>
                    {showRecipientDropdown && (
                      <div
                        ref={recipientDropdownRef}
                        className="absolute left-0 right-0 mt-2 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-50 max-h-[250px] overflow-y-auto custom-scrollbar"
                      >
                        <div className="p-2 border-b border-gray-800">
                          <div className="relative mb-2">
                            <input
                              type="text"
                              value={searchMember}
                              onChange={(e) => setSearchMember(e.target.value)}
                              className="w-full bg-[#222222] text-white rounded-xl pl-10 pr-4 py-2 text-sm"
                              placeholder="Search members..."
                              autoFocus
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-300">Select all</span>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="rounded border-gray-600 bg-transparent"
                            />
                          </div>
                        </div>
                        {[...chatList, ...archivedChats]
                          .filter(
                            (chat) =>
                              searchMember === "" || chat.name.toLowerCase().includes(searchMember.toLowerCase()),
                          )
                          .map((chat, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-[#2F2F2F] cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={chat.logo || "/placeholder.svg"}
                                  alt={chat.name}
                                  className="h-8 w-8 rounded-full"
                                />
                                <span className="text-sm text-gray-300">{chat.name}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedRecipients.includes(chat)}
                                onChange={() => handleMemberSelect(chat)}
                                className="rounded border-gray-600 bg-transparent"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {selectedRecipients.map((recipient, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#222222] rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={recipient.logo || "/placeholder.svg"}
                            alt={recipient.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-sm text-gray-300">{recipient.name}</span>
                        </div>
                        <button
                          className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                          onClick={() => handleMemberSelect(recipient)}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Broadcast Distribution Options */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Distribution Methods</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.broadcastEmail}
                          onChange={(e) => setSettings({ ...settings, broadcastEmail: e.target.checked })}
                          className="rounded border-gray-600 bg-transparent"
                        />
                        <span className="text-sm text-gray-300">Email</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.broadcastChat}
                          onChange={(e) => setSettings({ ...settings, broadcastChat: e.target.checked })}
                          className="rounded border-gray-600 bg-transparent"
                        />
                        <span className="text-sm text-gray-300">Chat Notification</span>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handleBroadcast}
                    className={`w-full py-3 ${
                      selectedMessage &&
                      selectedRecipients.length > 0 &&
                      (settings.broadcastEmail || settings.broadcastChat)
                        ? "bg-[#FF843E] text-sm hover:bg-orange-600"
                        : "bg-gray-600"
                    } text-white text-sm rounded-xl`}
                    disabled={
                      !selectedMessage ||
                      selectedRecipients.length === 0 ||
                      (!settings.broadcastEmail && !settings.broadcastChat)
                    }
                  >
                    Send Broadcast
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Email Frontend Modal (Full Screen) */}
      {showEmailFrontend && (
        <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
          <div className="bg-[#181818] flex-1 flex flex-col rounded-xl m-4">
            <div className="p-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </button>
                  <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-zinc-700 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowEmailFrontend(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
              </div>
              {/* Email Tabs */}
              <div className="flex gap-2 mb-4 border-b border-gray-700">
                <button
                  onClick={() => handleEmailTabClick("inbox")}
                  className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
                    emailTab === "inbox" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Inbox size={16} />
                  Inbox
                  {emailList.inbox.filter((e) => !e.isRead).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {emailList.inbox.filter((e) => !e.isRead).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleEmailTabClick("sent")}
                  className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
                    emailTab === "sent" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Send size={16} />
                  Sent
                </button>
                <button
                  onClick={() => handleEmailTabClick("draft")}
                  className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
                    emailTab === "draft" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <FileText size={16} />
                  Draft
                </button>
                {/* Other tabs can be added here if needed */}
              </div>
            </div>
            {/* Email List / Email View */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedEmail ? (
                // Full Email Content View
                <div className="bg-[#222222] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">{selectedEmail.subject}</h3>
                    <button onClick={() => setSelectedEmail(null)} className="p-2 hover:bg-zinc-700 rounded-lg">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    <p>
                      From: {selectedEmail.sender || "You"}
                      {selectedEmail.recipient && ` To: ${selectedEmail.recipient}`}
                    </p>
                    <p>Date: {new Date(selectedEmail.time).toLocaleString()}</p>
                  </div>
                  <div className="prose prose-invert text-white text-sm leading-relaxed">
                    <p>{selectedEmail.body}</p>
                  </div>
                </div>
              ) : (
                // Email List
                <div className="space-y-2">
                  {emailList[emailTab].length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No emails in this folder.</div>
                  ) : (
                    emailList[emailTab].map((email) => (
                      <div
                        key={email.id}
                        className={`flex items-center justify-between p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F] cursor-pointer ${
                          !email.isRead ? "border-l-4 border-blue-500" : ""
                        }`}
                        onClick={() => handleEmailItemClick(email)}
                      >
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="rounded border-gray-600 bg-transparent" />
                          <div>
                            <p className="font-medium text-sm">
                              {email.sender || email.recipient}
                              {!email.isRead && <span className="ml-2 text-blue-400"> (Unread)</span>}
                            </p>
                            <p className="text-xs text-gray-400">{email.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              email.status === "Read"
                                ? "bg-blue-600"
                                : email.status === "Delivered"
                                  ? "bg-green-600"
                                  : "bg-gray-600"
                            }`}
                          >
                            {email.status}
                          </span>
                          <span className="text-xs text-gray-400">{new Date(email.time).toLocaleDateString()}</span>
                          <button className="p-1 hover:bg-gray-600 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Auto-Archive Duration (days)</label>
                  <input
                    type="number"
                    value={settings.autoArchiveDuration}
                    onChange={(e) => setSettings({ ...settings, autoArchiveDuration: Number.parseInt(e.target.value) })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Notifications</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Email Notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.chatNotifications}
                        onChange={(e) => setSettings({ ...settings, chatNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">General Chat Notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.studioChatNotifications}
                        onChange={(e) => setSettings({ ...settings, studioChatNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Studio Chat Notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.memberChatNotifications}
                        onChange={(e) => setSettings({ ...settings, memberChatNotifications: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Member Chat Notifications</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Email Signature</label>
                  <div className="bg-[#222222] rounded-xl">
                    <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                      <button className="p-1 hover:bg-gray-600 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm underline">U</button>
                    </div>
                    <textarea
                      value={settings.emailSignature}
                      onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                      className="w-full bg-transparent text-white px-4 py-2 text-sm h-24 resize-none focus:outline-none"
                      placeholder="Enter your default email signature..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Setup</label>
                  <input
                    type="text"
                    placeholder="SMTP Host"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm mb-2"
                  />
                  <input
                    type="number"
                    placeholder="SMTP Port"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm mb-2"
                  />
                  <input
                    type="text"
                    placeholder="SMTP Username"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm mb-2"
                  />
                  <input
                    type="password"
                    placeholder="SMTP Password"
                    value={settings.smtpPass}
                    onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Birthday Messages</label>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={settings.birthdayMessageEnabled}
                      onChange={(e) => setSettings({ ...settings, birthdayMessageEnabled: e.target.checked })}
                      className="rounded border-gray-600 bg-transparent"
                    />
                    <span className="text-sm text-gray-300">Enable Birthday Messages</span>
                  </label>
                  <textarea
                    value={settings.birthdayMessageTemplate}
                    onChange={(e) => setSettings({ ...settings, birthdayMessageTemplate: e.target.value })}
                    className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                    placeholder="Happy Birthday, {name}!"
                    disabled={!settings.birthdayMessageEnabled}
                  />
                  <p className="text-xs text-gray-400 mt-1">Use {"{name}"} for recipient's name.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Appointment Notifications</label>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={settings.appointmentNotificationEnabled}
                      onChange={(e) => setSettings({ ...settings, appointmentNotificationEnabled: e.target.checked })}
                      className="rounded border-gray-600 bg-transparent"
                    />
                    <span className="text-sm text-gray-300">Enable Appointment Notifications</span>
                  </label>
                  <textarea
                    value={settings.appointmentNotificationTemplate}
                    onChange={(e) => setSettings({ ...settings, appointmentNotificationTemplate: e.target.value })}
                    className="w-full bg-[#222222] resize-none text-white rounded-xl px-4 py-2 text-sm h-20"
                    placeholder="Reminder: You have an appointment on {date} at {time}."
                    disabled={!settings.appointmentNotificationEnabled}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Use {"{date}"} and {"{time}"} for appointment details.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Broadcast Distribution</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.broadcastEmail}
                        onChange={(e) => setSettings({ ...settings, broadcastEmail: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.broadcastChat}
                        onChange={(e) => setSettings({ ...settings, broadcastChat: e.target.checked })}
                        className="rounded border-gray-600 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Chat Notification</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Email Modal (Send Email) */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Email
                </h2>
                <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailData.to}
                      onChange={(e) => {
                        setEmailData({ ...emailData, to: e.target.value })
                        // Show dropdown if input is not empty
                        setShowRecipientDropdown(e.target.value.length > 0)
                      }}
                      onFocus={() => setShowRecipientDropdown(emailData.to.length > 0)}
                      className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm pr-10"
                      placeholder="Search members or type email"
                    />
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    {showRecipientDropdown && emailData.to.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto custom-scrollbar">
                        {handleSearchMemberForEmail(emailData.to).map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleSelectEmailRecipient(member)}
                            className="w-full text-left p-2 hover:bg-[#2F2F2F] flex items-center gap-2"
                          >
                            <img
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <span className="text-sm">
                              {member.name} ({member.email})
                            </span>
                          </button>
                        ))}
                        {handleSearchMemberForEmail(emailData.to).length === 0 && (
                          <p className="p-2 text-sm text-gray-400">No members found. Type full email to send.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <div className="bg-[#222222] rounded-xl">
                    {/* Email Toolbar */}
                    <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                      <button className="p-1 hover:bg-gray-600 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm underline">U</button>
                      <div className="w-px h-4 bg-gray-600 mx-1" />
                      <button className="p-1 hover:bg-gray-600 rounded text-sm">📎</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-600 rounded text-sm">📊</button>
                    </div>
                    <textarea
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      className="w-full bg-transparent text-white px-4 py-2 text-sm h-48 resize-none focus:outline-none"
                      placeholder="Type your email message here..."
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Archive Modal */}
      {showArchive && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Archived Chats
                </h2>
                <button onClick={() => setShowArchive(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {archivedChats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Archive className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No archived chats</p>
                  </div>
                ) : (
                  archivedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F] cursor-pointer"
                      onClick={() => handleViewMember(chat.id, {})} // Open member view from archive
                    >
                      <img
                        src={chat.logo || "/placeholder.svg?height=32&width=32"}
                        alt={`${chat.name}'s avatar`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{chat.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {chat.message.length > 50 ? chat.message.substring(0, 50) + "..." : chat.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestoreChat(chat.id)
                          // Automatically open chat after restoring
                          handleChatSelect(chat)
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                      >
                        Restore
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Folder Creation Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <FolderPlus className="w-5 h-5" />
                  Create New Folder
                </h2>
                <button onClick={() => setShowFolderModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Folder Name</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="Enter folder name"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowFolderModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                  >
                    Create Folder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Appointment Modal */}
      {showAppointmentModal && selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">{selectedMember.name}'s Appointments</h2>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false)
                    setSelectedMember(null)
                  }}
                  className="p-2 hover:bg-zinc-700 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
                {getMemberAppointments(selectedMember.id).length > 0 ? (
                  getMemberAppointments(selectedMember.id).map((appointment) => {
                    const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                    const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700"
                    return (
                      <div
                        key={appointment.id}
                        className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{appointment.title}</p>
                            <div>
                              <p className="text-sm text-white/70">
                                {new Date(appointment.date).toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-white/70">
                                {new Date(appointment.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(
                                  new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAppointment(appointment)
                              }}
                              className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelAppointment(appointment.id)
                              }}
                              className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash-2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                    No appointments scheduled
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
                <div className="text-sm text-gray-300">
                  Contingent ({currentBillingPeriod}): {memberContingentData[selectedMember.id]?.current?.used || 0} /{" "}
                  {memberContingentData[selectedMember.id]?.current?.total || 0}
                </div>
                <button
                  onClick={handleManageContingent}
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Manage
                </button>
              </div>
              <button
                onClick={handleCreateNewAppointment}
                className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
              >
                Create New Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Appointment Modal */}
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
      {/* Edit Appointment Modal */}
      {showSelectedAppointmentModal && selectedAppointmentData && (
        <SelectedAppointmentModal
          selectedAppointment={selectedAppointmentData}
          setSelectedAppointment={setSelectedAppointmentData}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={handleAppointmentChange}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointment}
        />
      )}
      {showCreateMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#3F74FF] rounded-xl w-full max-w-md mx-4">
            {" "}
            {/* Changed color to blue */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Create New Template</h2> {/* Renamed */}
                <button onClick={() => setShowCreateMessageModal(false)} className="p-2 hover:bg-blue-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Folder</label>
                  <select
                    value={newMessage.folderId}
                    onChange={(e) => setNewMessage({ ...newMessage, folderId: Number.parseInt(e.target.value) })}
                    className="w-full bg-blue-700 text-white rounded-xl px-4 py-2 text-sm"
                  >
                    {broadcastFolders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Title</label>
                  <input
                    type="text"
                    value={newMessage.title}
                    onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                    className="w-full bg-blue-700 text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="Enter message title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Message</label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    className="w-full bg-blue-700 resize-none text-white rounded-xl px-4 py-2 text-sm h-32 resize-none"
                    placeholder="Enter your message content"
                  />
                </div>
                <button
                  onClick={handleSaveNewMessage}
                  className="w-full py-3 bg-white text-blue-600 text-sm hover:bg-gray-100 rounded-xl"
                  disabled={!newMessage.title.trim() || !newMessage.message.trim()}
                >
                  Save Template {/* Renamed */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showContingentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Manage Appointment Contingent</h2>
                <button onClick={() => setShowContingentModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              {/* Billing Period Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Select Billing Period</label>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {selectedMember &&
                    getBillingPeriods(selectedMember.id).map((period) => (
                      <button
                        key={period.id}
                        onClick={() => handleBillingPeriodChange(period.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors ${
                          selectedBillingPeriod === period.id
                            ? "bg-blue-600/20 border-blue-500 text-blue-300"
                            : "bg-[#222222] border-gray-600 text-gray-300 hover:bg-[#2A2A2A]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{period.label}</span>
                          <span className="text-sm">
                            {period.data.used}/{period.data.total}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
                {/* Add New Billing Period Button */}
                <button
                  onClick={() => setShowAddBillingPeriodModal(true)}
                  className="w-full mt-3 p-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Future Billing Period
                </button>
              </div>
              {/* Contingent Management */}
              <div className="space-y-4">
                <div className="bg-[#222222] rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">
                    {selectedBillingPeriod === "current"
                      ? `Current Period (${currentBillingPeriod})`
                      : `Future Period (${selectedBillingPeriod})`}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Used Appointments</label>
                      <input
                        type="number"
                        min={0}
                        max={tempContingent.total}
                        value={tempContingent.used}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, used: Number.parseInt(e.target.value) })
                        }
                        className="w-full bg-[#333333] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                        Total Appointments
                        {selectedBillingPeriod === "current" && (
                          <Lock size={14} className="text-gray-500" title="Locked for current period" />
                        )}
                      </label>
                      <input
                        type="number"
                        min={selectedBillingPeriod === "current" ? tempContingent.used : 0}
                        value={tempContingent.total}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, total: Number.parseInt(e.target.value) })
                        }
                        disabled={selectedBillingPeriod === "current"}
                        className={`w-full rounded-xl px-4 py-2 text-sm ${
                          selectedBillingPeriod === "current"
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-[#333333] text-white"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-white font-medium">
                      {tempContingent.total - tempContingent.used} appointments
                    </span>
                  </div>
                </div>
                {selectedBillingPeriod === "current" && (
                  <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
                    <p className="text-yellow-200 text-sm flex items-center gap-2">
                      <Lock size={14} />
                      Total appointments are locked for the current billing period. You can only edit used appointments.
                    </p>
                  </div>
                )}
                {selectedBillingPeriod !== "current" && (
                  <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                    <p className="text-blue-200 text-sm flex items-center gap-2">
                      <Info size={14} />
                      You can edit both used and total appointments for future billing periods.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowContingentModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContingent}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Billing Period Modal */}
      {showAddBillingPeriodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Add Future Billing Period</h2>
                <button
                  onClick={() => setShowAddBillingPeriodModal(false)}
                  className="p-2 hover:bg-zinc-700 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Billing Period (e.g., "07.14.25 - 07.18.2025")
                  </label>
                  <input
                    type="text"
                    value={newBillingPeriod}
                    onChange={(e) => setNewBillingPeriod(e.target.value)}
                    placeholder="MM.DD.YY - MM.DD.YYYY"
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-xl">
                  <p className="text-blue-200 text-sm">
                    <Info className="inline mr-1" size={14} />
                    New billing periods will start with 0 used appointments and 0 total appointments. You can edit these
                    values after creation.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setShowAddBillingPeriodModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBillingPeriod}
                  disabled={!newBillingPeriod.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl text-sm"
                >
                  Add Period
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isNotifyMemberOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Notify and Delete Member</h2>
                <button onClick={() => setIsNotifyMemberOpen(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {notifyAction === "book" && "Would you like to notify the member about their new appointment?"}
                {notifyAction === "change" && "Would you like to notify the member about changes to their appointment?"}
                {notifyAction === "delete" &&
                  "Would you like to notify the member that their appointment has been cancelled?"}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsNotifyMemberOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    alert("Member has been notified and appointment is deleted")
                    setIsNotifyMemberOpen(false)
                  }}
                  className="px-4 py-1.5 bg-red-600 text-sm  text-white rounded-xl"
                >
                  Yes, Notify and delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Overview Modal - INTEGRATED */}
      {isMemberOverviewModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-6xl mx-4 my-8 relative">
            <div className="p-6">
              {/* Header matching the image design */}
              <div className="flex items-center justify-between bg-[#161616] rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <img
                    src={selectedMember.image || DefaultAvatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {/* Member Info */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-white text-xl font-semibold">
                        {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                      </h2>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          selectedMember.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                        }`}
                      >
                        {selectedMember.isActive ? "Active" : "Inactive"}
                      </span>
                      {selectedMember.isBirthday && <Cake size={16} className="text-yellow-500" />}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      Contract: {selectedMember.contractStart} -
                      <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                        {selectedMember.contractEnd}
                      </span>
                    </p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Calendar Button */}
                  <button
                    onClick={handleCalendarFromOverview}
                    className="p-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-blue-500 hover:text-blue-400"
                    title="View Calendar"
                  >
                    <CalendarIcon size={20} />
                  </button>
                  {/* History Button */}
                  <button
                    onClick={handleHistoryFromOverview}
                    className="p-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-purple-500 hover:text-purple-400"
                    title="View History"
                  >
                    <History size={20} />
                  </button>
                  {/* Communication Button */}
                  <button
                    onClick={handleCommunicationFromOverview}
                    className="p-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-green-500 hover:text-green-400"
                    title="Communication"
                  >
                    <MessageCircle size={20} />
                  </button>
                  {/* View Details Button */}
                  <button
                    onClick={handleViewDetailedInfo}
                    className="flex items-center gap-2 px-4 py-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-gray-200 hover:text-white"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={handleEditFromOverview}
                    className="px-4 py-3 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-gray-200 hover:text-white"
                  >
                    Edit
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setIsMemberOverviewModalOpen(false)
                      setSelectedMember(null)
                    }}
                    className="p-3 text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Modal with Tabs - INTEGRATED */}
      {isMemberDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
                <button
                  onClick={() => {
                    setIsMemberDetailsModalOpen(false)
                    setSelectedMember(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  onClick={() => setActiveMemberDetailsTab("details")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeMemberDetailsTab === "details"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveMemberDetailsTab("relations")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeMemberDetailsTab === "relations"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Relations
                </button>
              </div>
              {/* Tab Content */}
              {activeMemberDetailsTab === "details" && (
                <div className="space-y-4 text-white">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMember.image || DefaultAvatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            selectedMember.memberType === "full"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-purple-900 text-purple-300"
                          }`}
                        >
                          {selectedMember.memberType === "full"
                            ? "Full Member (with contract)"
                            : "Temporary Member (without contract)"}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1">
                        {selectedMember.memberType === "full" ? (
                          <>
                            Contract: {selectedMember.contractStart} -
                            <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                              {selectedMember.contractEnd}
                            </span>
                          </>
                        ) : (
                          <>Auto-archive date: {selectedMember.autoArchiveDate}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{selectedMember.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{selectedMember.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p>{`${selectedMember.street}, ${selectedMember.zipCode} ${selectedMember.city}`}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Date of Birth</p>
                      <p>
                        {selectedMember.dateOfBirth} (Age: {calculateAge(selectedMember.dateOfBirth)})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Join Date</p>
                      <p>{selectedMember.joinDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">About</p>
                    <p>{selectedMember.about}</p>
                  </div>
                  {selectedMember.note && (
                    <div>
                      <p className="text-sm text-gray-400">Special Note</p>
                      <p>{selectedMember.note}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Note Period: {selectedMember.noteStartDate} to {selectedMember.noteEndDate}
                      </p>
                      <p className="text-sm text-gray-400">Importance: {selectedMember.noteImportance}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
                    {selectedMember.memberType === "full" && (
                      <button
                        onClick={redirectToContract}
                        className="flex items-center gap-2 text-sm bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90"
                      >
                        <FileText size={16} />
                        View Contract
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeMemberDetailsTab === "relations" && (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Relations Tree Visualization */}
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                    <div className="flex flex-col items-center space-y-8">
                      {/* Central Member */}
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                        {selectedMember.title}
                      </div>
                      {/* Connection Lines and Categories */}
                      <div className="relative w-full">
                        {/* Horizontal line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>
                        {/* Category sections */}
                        <div className="grid grid-cols-5 gap-4 pt-8">
                          {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                            <div key={category} className="flex flex-col items-center space-y-4">
                              {/* Vertical line */}
                              <div className="w-0.5 h-8 bg-gray-600"></div>
                              {/* Category header */}
                              <div
                                className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                                  category === "family"
                                    ? "bg-yellow-600 text-yellow-100"
                                    : category === "friendship"
                                      ? "bg-green-600 text-green-100"
                                      : category === "relationship"
                                        ? "bg-red-600 text-red-100"
                                        : category === "work"
                                          ? "bg-blue-600 text-blue-100"
                                          : "bg-gray-600 text-gray-100"
                                }`}
                              >
                                {category}
                              </div>
                              {/* Relations in this category */}
                              <div className="space-y-2">
                                {relations.map((relation) => (
                                  <div
                                    key={relation.id}
                                    className={`bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-[#3F3F3F] ${
                                      relation.type === "member" || relation.type === "lead"
                                        ? "border border-blue-500/30"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      if (relation.type === "member" || relation.type === "lead") {
                                        alert(`Clicked on ${relation.name} (${relation.type})`)
                                      }
                                    }}
                                  >
                                    <div className="text-white text-sm font-medium">{relation.name}</div>
                                    <div className="text-gray-400 text-xs">({relation.relation})</div>
                                    <div
                                      className={`text-xs mt-1 px-1 py-0.5 rounded ${
                                        relation.type === "member"
                                          ? "bg-green-600 text-green-100"
                                          : relation.type === "lead"
                                            ? "bg-blue-600 text-blue-100"
                                            : "bg-gray-600 text-gray-100"
                                      }`}
                                    >
                                      {relation.type}
                                    </div>
                                  </div>
                                ))}
                                {relations.length === 0 && (
                                  <div className="text-gray-500 text-xs text-center">No relations</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Relations List */}
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                    <div className="space-y-4">
                      {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                        <div key={category}>
                          <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {relations.length > 0 ? (
                              relations.map((relation) => (
                                <div
                                  key={relation.id}
                                  className={`flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3 ${
                                    relation.type === "member" || relation.type === "lead"
                                      ? "cursor-pointer hover:bg-[#3F3F3F] border border-blue-500/30"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (relation.type === "member" || relation.type === "lead") {
                                      alert(`Clicked on ${relation.name} (${relation.type})`)
                                    }
                                  }}
                                >
                                  <div>
                                    <span className="text-white font-medium">{relation.name}</span>
                                    <span className="text-gray-400 ml-2">- {relation.relation}</span>
                                    <span
                                      className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                        relation.type === "member"
                                          ? "bg-green-600 text-green-100"
                                          : relation.type === "lead"
                                            ? "bg-blue-600 text-blue-100"
                                            : "bg-gray-600 text-gray-100"
                                      }`}
                                    >
                                      {relation.type}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No {category} relations</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Modal - INTEGRATED */}
      {showHistoryModal && selectedMember && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                History - {selectedMember.firstName} {selectedMember.lastName}
              </h2>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-300 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex space-x-1 mb-6 bg-[#141414] rounded-lg p-1">
              {[
                { id: "general", label: "General Changes" },
                { id: "checkins", label: "Check-ins & Check-outs" },
                { id: "appointments", label: "Past Appointments" },
                { id: "finance", label: "Finance Transactions" },
                { id: "contracts", label: "Contract Changes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setHistoryTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    historyTab === tab.id ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="bg-[#141414] rounded-xl p-4">
              {historyTab === "general" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Changes</h3>
                  <div className="space-y-3">
                    {memberHistory[selectedMember.id]?.general?.map((change) => (
                      <div key={change.id} className="bg-[#1C1C1C] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-white">{change.action}</p>
                            <p className="text-sm text-gray-400">
                              {change.date} by {change.user}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-300">{change.details}</p>
                        </div>
                      </div>
                    )) || <p className="text-gray-400">No general changes recorded</p>}
                  </div>
                </div>
              )}
              {historyTab === "checkins" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Check-ins & Check-outs</h3>
                  <div className="space-y-3">
                    {memberHistory[selectedMember.id]?.checkins?.map((activity) => (
                      <div key={activity.id} className="bg-[#1C1C1C] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  activity.type === "Check-in" ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></span>
                              {activity.type}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(activity.date).toLocaleDateString()} at{" "}
                              {new Date(activity.date).toLocaleTimeString()}
                            </p>
                            <p className="text-sm text-gray-300">Location: {activity.location}</p>
                          </div>
                        </div>
                      </div>
                    )) || <p className="text-gray-400">No check-in/check-out history</p>}
                  </div>
                </div>
              )}
              {historyTab === "appointments" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
                  <div className="space-y-3">
                    {memberHistory[selectedMember.id]?.appointments?.map((appointment) => (
                      <div key={appointment.id} className="bg-[#1C1C1C] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-white">{appointment.title}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(appointment.date).toLocaleDateString()} at{" "}
                              {new Date(appointment.date).toLocaleTimeString()} with {appointment.trainer}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              appointment.status === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-orange-600 text-white"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    )) || <p className="text-gray-400">No past appointments</p>}
                  </div>
                </div>
              )}
              {historyTab === "finance" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Finance Transactions</h3>
                  <div className="space-y-3">
                    {memberHistory[selectedMember.id]?.finance?.map((transaction) => (
                      <div key={transaction.id} className="bg-[#1C1C1C] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-white">
                              {transaction.type} - {transaction.amount}
                            </p>
                            <p className="text-sm text-gray-400">{transaction.date}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              transaction.status === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-orange-600 text-white"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{transaction.description}</p>
                      </div>
                    )) || <p className="text-gray-400">No financial transactions</p>}
                  </div>
                </div>
              )}
              {historyTab === "contracts" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contract Changes</h3>
                  <div className="space-y-3">
                    {memberHistory[selectedMember.id]?.contracts?.map((contract) => (
                      <div key={contract.id} className="bg-[#1C1C1C] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-white">{contract.action}</p>
                            <p className="text-sm text-gray-400">
                              {contract.date} by {contract.user}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{contract.details}</p>
                      </div>
                    )) || <p className="text-gray-400">No contract changes</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
