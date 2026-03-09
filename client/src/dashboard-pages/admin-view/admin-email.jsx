/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useRef } from "react"
import {
  Search, Send, Mail, MailCheck, MailOpen, Archive, Pin, PinOff, Check,
  FileText, Reply, Trash2, XCircle, Inbox, Paperclip, RefreshCw, X,
} from "lucide-react"
import { IoIosMegaphone } from "react-icons/io"

// ── Admin-panel states (NOT studio-states) ─────────────────
import {
  adminContactsData, adminStaffData, adminEmailListData,
  adminEmailTemplatesData, adminEmailSettings,
  adminBroadcastFolders, adminPreConfiguredMessages,
} from "../../utils/admin-panel-states/email-states"

// ── Sub-components (same email-components directory) ───────
import SendEmailModal from "../../components/admin-dashboard-components/email-components/SendEmailModal"
import SendEmailReplyModal from "../../components/admin-dashboard-components/email-components/SendEmailReplyModal"
import BroadcastModal from "../../components/admin-dashboard-components/email-components/broadcast-modal-components/BroadcastModal"

// ═══════════════════════════════════════════════════════════
// MOBILE EMAIL ITEM
// ═══════════════════════════════════════════════════════════
const MobileEmailItem = ({ email, emailTab, selectedEmailIds, toggleEmailSelection, handleEmailItemClick, formatEmailTime, truncateEmailText, moveEmailToTrash }) => {
  const [touchStart, setTouchStart] = useState(null)
  const [showActions, setShowActions] = useState(false)
  return (
    <div className="relative overflow-hidden select-none"
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => { if (touchStart !== null) { const diff = e.changedTouches[0].clientX - touchStart; if (diff < -50) setShowActions(true); else if (diff > 50) setShowActions(false); setTouchStart(null) } }}>
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800/50 active:bg-[#222222] transition-transform duration-200 ${showActions ? "-translate-x-20" : "translate-x-0"}`}
        onClick={() => !showActions && handleEmailItemClick(email)}>
        <div className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleEmailSelection(email.id) }}>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${selectedEmailIds.includes(email.id) ? "bg-orange-500" : "border-2 border-gray-600"}`}>
            {selectedEmailIds.includes(email.id) && <Check size={14} className="text-white" />}
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#222222] flex items-center justify-center"><Mail size={18} className="text-gray-500" /></div>
          {!email.isRead && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#1C1C1C]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`font-medium truncate ${!email.isRead ? "text-white" : "text-gray-300"}`}>{emailTab === "sent" ? email.recipient : email.sender}</span>
            <span className="text-xs text-gray-500 flex-shrink-0">{formatEmailTime(email.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className={`text-sm truncate ${!email.isRead ? "font-medium text-white" : "text-gray-400"}`}>{email.subject || "(No subject)"}</p>
            {email.status === "Draft" && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded flex-shrink-0">Draft</span>}
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{truncateEmailText(email.body, 50)}</p>
          {email.attachments?.length > 0 && <div className="flex items-center gap-1 mt-1 text-xs text-gray-500"><Paperclip size={10} /><span>{email.attachments.length}</span></div>}
        </div>
      </div>
      <div className={`absolute right-0 top-0 bottom-0 flex items-center transition-opacity duration-200 ${showActions ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button className="h-full w-20 bg-red-500 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); moveEmailToTrash(email.id); setShowActions(false) }}><Trash2 size={20} className="text-white" /></button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// DESKTOP EMAIL LIST ITEM
// ═══════════════════════════════════════════════════════════
function EmailListItem({ email, emailTab, isSelected, isChecked, onToggleSelect, onClick, formatEmailTime, truncateEmailText }) {
  return (
    <div draggable={!["draft","error","trash"].includes(emailTab)}
      onDragStart={(e) => { if (["draft","error","trash"].includes(emailTab)) { e.preventDefault(); return } e.dataTransfer.setData("emailId", email.id.toString()); e.currentTarget.classList.add("opacity-50") }}
      onDragEnd={(e) => e.currentTarget.classList.remove("opacity-50")}
      onClick={(e) => { if (e.target.closest(".email-checkbox")) return; onClick(email) }}
      className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 group border-b border-slate-700 ${isSelected ? "bg-[#181818] border-l-2 border-l-orange-500" : "hover:bg-[#181818] border-l-2 border-l-transparent"}`}>
      <div className="email-checkbox flex-shrink-0" onClick={(e) => { e.stopPropagation(); onToggleSelect(email.id) }}>
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${isChecked ? "bg-orange-500 border-orange-500" : "border-gray-500 hover:border-gray-400"}`}>
          {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#222222]"><Mail size={20} className="text-gray-500" /></div>
        {!email.isRead && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`font-medium truncate ${isSelected ? "text-orange-400" : "text-white"}`}>{emailTab === "sent" ? email.recipient : email.sender}</span>
          <span className="text-xs text-gray-500 flex-shrink-0">{formatEmailTime(email.time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className={`text-sm truncate ${!email.isRead ? "font-medium text-white" : "text-gray-400"}`}>{email.subject || "(No subject)"}</p>
          {email.status === "Draft" && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded flex-shrink-0">Draft</span>}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{truncateEmailText(email.body)}</p>
        {email.attachments?.length > 0 && <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500 select-none"><Paperclip size={12} /><span>{email.attachments.length}</span></div>}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// EMAIL PANEL — Main standalone component for Admin Dashboard
// ═══════════════════════════════════════════════════════════
//
// File location:
//   client/src/components/admin-dashboard-components/email-components/EmailPanel.jsx
//
// Usage:
//   import EmailPanel from "./email-components/EmailPanel"
//   <EmailPanel />
//   <EmailPanel className="h-screen" />
//
// ═══════════════════════════════════════════════════════════

export default function EmailPanel({ className = "h-[92vh]" }) {
  // ── Email State ──────────────────────────────────────────
  const [emailList, setEmailList] = useState(() => ({ ...adminEmailListData, error: adminEmailListData.error || [], trash: adminEmailListData.trash || [] }))
  const [emailTab, setEmailTab] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [emailSearchQuery, setEmailSearchQuery] = useState("")
  const [selectedEmailIds, setSelectedEmailIds] = useState([])

  // ── Modal State ──────────────────────────────────────────
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [editingDraft, setEditingDraft] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyInitialRecipient, setReplyInitialRecipient] = useState(null)
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false)
  const [emailsToDelete, setEmailsToDelete] = useState([])
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)

  // ── Compose State ────────────────────────────────────────
  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" })

  // ── Broadcast State ──────────────────────────────────────
  const [broadcastFolders, setBroadcastFolders] = useState(adminBroadcastFolders)
  const [preConfiguredMessages, setPreConfiguredMessages] = useState(adminPreConfiguredMessages)

  // ── Mobile State ─────────────────────────────────────────
  const [mobileView, setMobileView] = useState("list")

  // ── Folder Definitions ───────────────────────────────────
  const emailFolders = [
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "sent", label: "Sent", icon: Send },
    { id: "draft", label: "Drafts", icon: FileText },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "error", label: "Failed", icon: XCircle },
    { id: "trash", label: "Trash", icon: Trash2 },
  ]

  // ═══════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════

  const getEmailFolderCount = (folderId) => {
    if (folderId === "archive") return Object.values(emailList).filter(Array.isArray).flat().filter((e) => e?.isArchived).length
    return (emailList[folderId] || []).filter((e) => !e?.isArchived).length
  }

  const getUnreadCountForFolder = (folderId) => {
    if (folderId === "archive") return Object.values(emailList).filter(Array.isArray).flat().filter((e) => e?.isArchived && !e.isRead).length
    return (emailList[folderId] || []).filter((e) => !e.isRead && !e?.isArchived).length
  }

  const getFilteredEmails = (includePinned = true) => {
    let emails = emailList[emailTab] || []
    if (!Array.isArray(emails)) emails = []
    if (emailTab === "archive") emails = Object.values(emailList).filter(Array.isArray).flat().filter((e) => e?.isArchived)
    if (emailSearchQuery.trim()) { const q = emailSearchQuery.toLowerCase(); emails = emails.filter((e) => e.subject?.toLowerCase().includes(q) || e.sender?.toLowerCase().includes(q) || e.recipient?.toLowerCase().includes(q)) }
    if (emailTab !== "archive") emails = emails.filter((e) => e && !e.isArchived)
    if (!includePinned) emails = emails.filter((e) => !e.isPinned)
    return emails.sort((a, b) => new Date(b.time) - new Date(a.time))
  }

  const getPinnedEmails = () => {
    let emails = emailList[emailTab] || []
    if (!Array.isArray(emails)) emails = []
    if (emailTab === "archive") emails = Object.values(emailList).filter(Array.isArray).flat().filter((e) => e?.isArchived)
    else emails = emails.filter((e) => e && !e.isArchived)
    if (emailSearchQuery.trim()) { const q = emailSearchQuery.toLowerCase(); emails = emails.filter((e) => e.subject?.toLowerCase().includes(q) || e.sender?.toLowerCase().includes(q) || e.recipient?.toLowerCase().includes(q)) }
    return emails.filter((e) => e.isPinned).sort((a, b) => new Date(b.time) - new Date(a.time))
  }

  const formatEmailTime = (ds) => { if (!ds) return ""; const d = new Date(ds); if (isNaN(d.getTime())) return ""; const t = new Date(); if (d.toDateString() === t.toDateString()) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); return d.toLocaleDateString() }
  const truncateEmailText = (text, ml = 60) => { if (!text) return ""; const s = text.replace(/<[^>]*>/g, ""); return s.length > ml ? s.substring(0, ml) + "..." : s }

  // ═══════════════════════════════════════════════════════════
  // EMAIL ACTIONS
  // ═══════════════════════════════════════════════════════════

  const handleEmailItemClick = (email) => {
    if (emailTab === "draft" || email.status === "Draft") { setEmailData({ subject: email.subject || "", body: email.body || "" }); setEditingDraft(email); setShowEmailModal(true); return }
    if (!email.isRead) { setEmailList((prev) => { const n = { ...prev }; Object.keys(n).forEach((f) => { if (Array.isArray(n[f])) n[f] = n[f].map((e) => (e.id === email.id ? { ...e, isRead: true } : e)) }); return n }); setSelectedEmail({ ...email, isRead: true }) } else setSelectedEmail(email)
    setMobileView("detail")
  }

  const updateEmailStatus = (emailId, updates) => {
    setEmailList((prev) => { const n = { ...prev }; Object.keys(n).forEach((f) => { if (Array.isArray(n[f])) n[f] = n[f].map((e) => (e.id === emailId ? { ...e, ...updates } : e)) }); return n })
    if (selectedEmail?.id === emailId) setSelectedEmail((p) => (p ? { ...p, ...updates } : null))
  }

  const moveEmailToTrash = (emailId) => {
    setEmailList((prev) => { let em = null, sf = null; Object.keys(prev).forEach((f) => { if (f !== "trash" && Array.isArray(prev[f])) { const found = prev[f].find((e) => e.id === emailId); if (found) { em = found; sf = f } } }); if (!em || !sf) return prev; return { ...prev, [sf]: prev[sf].filter((e) => e.id !== emailId), trash: [...(prev.trash || []), { ...em, deletedAt: new Date().toISOString() }] } })
    if (selectedEmail?.id === emailId) { setSelectedEmail(null); setMobileView("list") }
  }

  const retryFailedEmail = (email) => { setEmailList((prev) => ({ ...prev, error: (prev.error || []).filter((e) => e.id !== email.id), sent: [{ ...email, status: "Sent", time: new Date().toISOString() }, ...(prev.sent || [])] })); if (selectedEmail?.id === email.id) { setSelectedEmail(null); setMobileView("list") } }
  const permanentlyDeleteEmail = (emailId) => { setEmailList((prev) => ({ ...prev, trash: (prev.trash || []).filter((e) => e.id !== emailId) })); if (selectedEmail?.id === emailId) { setSelectedEmail(null); setMobileView("list") } }

  const handleMoveEmailToFolder = (emailId, targetFolder) => {
    if (targetFolder === "draft") return
    setEmailList((prev) => { const n = { ...prev }; let em = null, sf = null; Object.keys(n).forEach((f) => { if (Array.isArray(n[f])) { const idx = n[f].findIndex((e) => e.id === emailId || e.id === parseInt(emailId)); if (idx !== -1) { em = { ...n[f][idx] }; sf = f; n[f] = n[f].filter((_, i) => i !== idx) } } }); if (em && targetFolder !== sf) { em.isArchived = targetFolder === "archive"; if (targetFolder === "trash") em.deletedAt = new Date().toISOString(); if (!n[targetFolder]) n[targetFolder] = []; n[targetFolder] = [em, ...n[targetFolder]] } return n })
    if (selectedEmail?.id === emailId || selectedEmail?.id === parseInt(emailId)) { setSelectedEmail(null); setMobileView("list") }
  }

  // ── Selection / Bulk ─────────────────────────────────────
  const toggleEmailSelection = (id) => setSelectedEmailIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id])
  const selectAllEmails = () => { const ids = [...getPinnedEmails(), ...getFilteredEmails(false)].map((e) => e.id); setSelectedEmailIds(ids.every((id) => selectedEmailIds.includes(id)) ? [] : ids) }
  const bulkMarkAsRead = (isRead) => { setEmailList((prev) => { const n = { ...prev }; Object.keys(n).forEach((f) => { if (Array.isArray(n[f])) n[f] = n[f].map((e) => selectedEmailIds.includes(e.id) ? { ...e, isRead } : e) }); return n }); setSelectedEmailIds([]) }
  const bulkArchive = () => { selectedEmailIds.forEach((id) => updateEmailStatus(id, { isArchived: true })); setSelectedEmailIds([]) }
  const bulkDelete = () => { if (emailTab === "trash") { setEmailsToDelete(selectedEmailIds); setShowPermanentDeleteConfirm(true) } else { selectedEmailIds.forEach((id) => moveEmailToTrash(id)); setSelectedEmailIds([]) } }
  const confirmPermanentDelete = () => { emailsToDelete.forEach((id) => permanentlyDeleteEmail(id)); setSelectedEmailIds([]); setEmailsToDelete([]); setShowPermanentDeleteConfirm(false) }

  // ── Reply ────────────────────────────────────────────────
  const handleEmailReply = (email) => {
    if (!email) return
    const se = email.senderEmail || "", sn = email.sender || ""
    let sd = adminContactsData.find((m) => m.email?.toLowerCase() === se.toLowerCase())
    let ir = null
    if (!sd) { const st = adminStaffData.find((s) => s.email?.toLowerCase() === se.toLowerCase()); if (st) ir = { id: `staff-${st.id}`, email: st.email, name: `${st.firstName || ""} ${st.lastName || ""}`.trim(), firstName: st.firstName, lastName: st.lastName, image: st.img, type: "staff" } }
    else ir = { id: `member-${sd.id}`, email: sd.email, name: `${sd.firstName || ""} ${sd.lastName || ""}`.trim(), firstName: sd.firstName, lastName: sd.lastName, image: sd.image, type: "member" }
    if (!ir) { const np = sn.split(" "); ir = { id: null, email: se || sn, name: sn, firstName: np[0] || "", lastName: np.slice(1).join(" ") || "", isManual: true } }
    setReplyInitialRecipient(ir); setShowReplyModal(true)
  }
  const handleSendReply = (rp) => setEmailList((p) => ({ ...p, sent: [rp, ...(p.sent || [])] }))
  const handleSaveReplyAsDraft = (dp) => setEmailList((p) => ({ ...p, draft: [dp, ...(p.draft || [])] }))

  // ── Compose / Send ──────────────────────────────────────
  const handleSaveEmailAsDraft = (dd) => {
    const draft = { id: dd.id || Date.now(), sender: adminEmailSettings.senderName, senderEmail: adminEmailSettings.senderEmail, recipient: dd.toRecipients?.map((r) => r.name || r.email).join(", ") || "", recipientEmail: dd.toRecipients?.map((r) => r.email).join(", ") || "", cc: dd.ccRecipients?.map((r) => r.email).join(", ") || "", bcc: dd.bccRecipients?.map((r) => r.email).join(", ") || "", subject: dd.subject || "", body: dd.body || "", time: new Date().toISOString(), isRead: true, isPinned: false, isArchived: false, status: "Draft", attachments: dd.attachments?.map((a) => ({ name: a.name, size: a.size, type: a.type })) || [] }
    setEmailList((p) => { if (dd.id) return { ...p, draft: (p.draft || []).map((d) => (d.id === dd.id ? draft : d)) }; return { ...p, draft: [draft, ...(p.draft || [])] } })
  }

  const handleSendEmail = (ed) => {
    const toEmails = Array.isArray(ed.to) ? ed.to : [ed.to].filter(Boolean)
    if (toEmails.length === 0 || !ed.subject || !ed.body) { alert("Please fill in all required email fields"); return }
    const body = adminEmailSettings.emailSignature ? `${ed.body}<br><br>${adminEmailSettings.emailSignature}` : ed.body
    const ne = { id: Date.now(), sender: adminEmailSettings.senderName, senderEmail: adminEmailSettings.senderEmail, recipient: toEmails.join(", "), cc: ed.cc?.join(", ") || "", bcc: ed.bcc?.join(", ") || "", subject: ed.subject, body, status: "Sent", time: new Date().toISOString(), isRead: true, isPinned: false, isArchived: false, attachments: ed.attachments || [] }
    if (editingDraft) { setEmailList((p) => ({ ...p, draft: (p.draft || []).filter((d) => d.id !== editingDraft.id), sent: [ne, ...p.sent] })); setEditingDraft(null) }
    else setEmailList((p) => ({ ...p, sent: [ne, ...p.sent] }))
    alert("Email sent successfully!"); setEmailData({ to: "", subject: "", body: "" }); setShowEmailModal(false)
  }

  // ── Search contacts ──────────────────────────────────────
  const handleSearchContacts = (query) => {
    if (!query) return []
    const q = query.toLowerCase()
    const mr = adminContactsData.filter((m) => m.firstName?.toLowerCase().includes(q) || m.lastName?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)).map((m) => ({ id: `member-${m.id}`, email: m.email, name: `${m.firstName || ""} ${m.lastName || ""}`.trim(), firstName: m.firstName, lastName: m.lastName, image: m.image, type: "member" }))
    const sr = adminStaffData.filter((s) => s.firstName?.toLowerCase().includes(q) || s.lastName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)).map((s) => ({ id: `staff-${s.id}`, email: s.email, name: `${s.firstName || ""} ${s.lastName || ""}`.trim(), firstName: s.firstName, lastName: s.lastName, image: s.img, type: "staff" }))
    return [...mr, ...sr].slice(0, 10)
  }

  // ── Broadcast ────────────────────────────────────────────
  const handleBroadcast = (bd) => { if (!bd.message || bd.recipients.length === 0) return; console.log(`Broadcast sent to ${bd.recipients.length} recipients`) }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className={`relative flex bg-[#1C1C1C] text-gray-200 rounded-3xl overflow-hidden ${className}`}>

      {/* ─── SIDEBAR: Folders + Search + Send (Desktop) ──── */}
      <div className="hidden md:flex flex-col w-[280px] bg-black flex-shrink-0 border-r border-[#333333]" style={{ minHeight: 0 }}>
        <div className="flex-shrink-0 p-4">
          <h1 className="text-2xl font-bold text-white mb-4">Email</h1>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search emails..." value={emailSearchQuery} onChange={(e) => setEmailSearchQuery(e.target.value)} className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 border border-[#333333] focus:border-[#3F74FF] transition-colors" />
          </div>
          <button onClick={() => setShowEmailModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm text-white font-medium transition-colors w-full"><Send className="w-4 h-4" /> Send Email</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar select-none px-4 pb-6" style={{ minHeight: 0 }}>
          <div className="space-y-1">
            {emailFolders.map((folder) => { const Icon = folder.icon; const tc = getEmailFolderCount(folder.id); const uc = getUnreadCountForFolder(folder.id); const isA = emailTab === folder.id; return (
              <button key={folder.id} onClick={() => { setEmailTab(folder.id); setSelectedEmail(null); setSelectedEmailIds([]) }}
                onDragOver={(e) => { if (["draft","error","trash"].includes(folder.id) || ["draft","error","trash"].includes(emailTab)) return; e.preventDefault(); e.currentTarget.classList.add("bg-[#333333]") }}
                onDragLeave={(e) => e.currentTarget.classList.remove("bg-[#333333]")}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("bg-[#333333]"); if (["draft","error","trash"].includes(folder.id) || ["draft","error","trash"].includes(emailTab)) return; const eid = e.dataTransfer.getData("emailId"); if (eid && folder.id !== emailTab) handleMoveEmailToFolder(eid, folder.id) }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors border-l-2 ${isA ? "bg-[#181818] border-l-orange-500 text-white" : "border-l-transparent text-gray-400 hover:bg-[#222222] hover:text-white"}`}>
                <div className="flex items-center gap-3"><Icon size={18} className={isA ? "text-orange-400" : ""} /><span className={`text-sm font-medium ${isA ? "text-orange-400" : ""}`}>{folder.label} <span className={isA ? "text-gray-400" : "text-gray-500"}>[{tc}]</span></span></div>
                {uc > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500 text-white">{uc}</span>}
              </button>
            ) })}
          </div>
        </div>

        {/* Broadcast Button */}
        <div className="absolute bottom-6 right-6 z-50 hidden md:block">
          <button onClick={() => setShowBroadcastModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95"><IoIosMegaphone size={22} /></button>
        </div>
      </div>

      {/* ─── MAIN CONTENT (Desktop) ──────────────────────── */}
      <div className="hidden md:flex flex-1 min-w-0 h-full overflow-hidden">
        {/* Email List Column */}
        <div className="w-[400px] flex-shrink-0 border-r border-[#333333] flex flex-col">
          {(getPinnedEmails().length > 0 || getFilteredEmails(false).length > 0) && (
            <div className="px-3 py-2 border-b border-[#333333] flex items-center gap-2">
              <button onClick={selectAllEmails} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#222222] rounded-lg transition-colors">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedEmailIds.length > 0 && selectedEmailIds.length === [...getPinnedEmails(), ...getFilteredEmails(false)].length ? "bg-orange-500 border-orange-500" : selectedEmailIds.length > 0 ? "bg-orange-500/50 border-orange-500" : "border-gray-500"}`}>
                  {selectedEmailIds.length > 0 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs text-gray-400">{selectedEmailIds.length > 0 ? `${selectedEmailIds.length} selected` : "Select all"}</span>
              </button>
              {selectedEmailIds.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                  {!["draft","error","trash"].includes(emailTab) && (<><button onClick={() => bulkMarkAsRead(true)} className="p-1.5 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white" title="Mark as read"><MailCheck size={16} /></button><button onClick={() => bulkMarkAsRead(false)} className="p-1.5 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white" title="Mark as unread"><MailOpen size={16} /></button><button onClick={bulkArchive} className="p-1.5 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white" title="Archive"><Archive size={16} /></button></>)}
                  <button onClick={bulkDelete} className="p-1.5 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-red-400" title={emailTab === "trash" ? "Delete permanently" : "Delete"}><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {getPinnedEmails().length === 0 && getFilteredEmails(false).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6"><div className="w-16 h-16 rounded-2xl bg-[#222222] border border-[#333333] flex items-center justify-center mb-4"><Mail className="w-8 h-8 text-gray-600" /></div><p className="text-gray-400 text-sm">No emails in this folder</p></div>
            ) : (
              <div className="px-2 py-2 select-none">
                {getPinnedEmails().length > 0 && (<><div className="flex items-center gap-2 px-2 py-1"><Pin size={12} className="text-orange-500 fill-orange-500" /><span className="text-xs text-orange-500 font-medium">Pinned</span><div className="flex-1 h-px bg-orange-500/30" /></div>{getPinnedEmails().map((e) => <EmailListItem key={e.id} email={e} emailTab={emailTab} isSelected={selectedEmail?.id === e.id} isChecked={selectedEmailIds.includes(e.id)} onToggleSelect={toggleEmailSelection} onClick={handleEmailItemClick} formatEmailTime={formatEmailTime} truncateEmailText={truncateEmailText} />)}{getFilteredEmails(false).length > 0 && <div className="flex items-center px-2 py-1 mt-2"><div className="flex-1 h-px bg-gray-700" /></div>}</>)}
                {getFilteredEmails(false).map((e) => <EmailListItem key={e.id} email={e} emailTab={emailTab} isSelected={selectedEmail?.id === e.id} isChecked={selectedEmailIds.includes(e.id)} onToggleSelect={toggleEmailSelection} onClick={handleEmailItemClick} formatEmailTime={formatEmailTime} truncateEmailText={truncateEmailText} />)}
              </div>
            )}
          </div>
        </div>

        {/* Email Detail */}
        {selectedEmail ? (
          <div className="flex-1 flex flex-col min-w-0 select-text">
            <div className="p-4 border-b border-[#333333] flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">{selectedEmail.isPinned && <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg"><Pin size={12} /> Pinned</span>}</div>
                <div className="flex items-center gap-1">
                  {emailTab === "error" && <button onClick={() => retryFailedEmail(selectedEmail)} className="p-2 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white" title="Retry"><RefreshCw size={18} /></button>}
                  {!["draft","error","trash"].includes(emailTab) && <button onClick={() => handleEmailReply(selectedEmail)} className="p-2 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white" title="Reply"><Reply size={18} /></button>}
                  {!["trash","error"].includes(emailTab) && (<><button onClick={() => updateEmailStatus(selectedEmail.id, { isPinned: !selectedEmail.isPinned })} className={`p-2 hover:bg-[#333333] rounded-lg ${selectedEmail.isPinned ? "text-amber-500" : "text-gray-400 hover:text-white"}`}>{selectedEmail.isPinned ? <PinOff size={18} /> : <Pin size={18} />}</button><button onClick={() => { updateEmailStatus(selectedEmail.id, { isArchived: !selectedEmail.isArchived }); setSelectedEmail(null) }} className="p-2 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white"><Archive size={18} /></button></>)}
                  <button onClick={() => { if (emailTab === "trash") { setEmailsToDelete([selectedEmail.id]); setShowPermanentDeleteConfirm(true) } else moveEmailToTrash(selectedEmail.id) }} className="p-2 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">{selectedEmail.subject}</h2>
              <div className="flex items-start justify-between">
                <div><p className="text-sm text-white font-medium">{selectedEmail.sender}</p>{selectedEmail.senderEmail && <p className="text-xs text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</p>}<p className="text-xs text-gray-500 mt-1">To: {selectedEmail.recipient}{selectedEmail.recipientEmail && <span> &lt;{selectedEmail.recipientEmail}&gt;</span>}{selectedEmail.cc && <span> · CC: {selectedEmail.cc}</span>}</p></div>
                <div className="text-right"><p className="text-xs text-gray-500">{new Date(selectedEmail.time).toLocaleString()}</p>{selectedEmail.status === "Failed" && <span className="inline-flex items-center text-xs px-2 py-0.5 rounded mt-1 bg-red-500/20 text-red-400">Failed</span>}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {selectedEmail.attachments?.length > 0 && (<div className="mb-6 pb-4 border-b border-[#333333] select-none"><p className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2"><Paperclip size={16} /> Attachments ({selectedEmail.attachments.length})</p><div className="flex flex-wrap gap-2">{selectedEmail.attachments.map((f, i) => <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#222222] rounded-lg border border-[#333333]"><Paperclip size={14} className="text-gray-500" /><span className="text-sm text-gray-300">{f.name || f}</span>{f.size && <span className="text-xs text-gray-500">({f.size})</span>}</div>)}</div></div>)}
              <div className="max-w-none bg-white p-6 rounded-xl" style={{ color: "#1f2937", fontSize: "14px", lineHeight: "1.5", fontFamily: "Arial, sans-serif" }} dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-6"><div className="w-24 h-24 rounded-2xl bg-[#222222] border border-[#333333] flex items-center justify-center mb-4"><Mail className="w-12 h-12 text-gray-600" /></div><h3 className="text-white font-medium text-lg mb-2">No email selected</h3><p className="text-gray-500 text-sm">Select an email from the list to view its contents</p></div>
        )}
      </div>

      {/* ─── MOBILE LAYOUT ───────────────────────────────── */}

      {mobileView === "list" && (
        <div className="md:hidden flex flex-col w-full h-full">
          <div className="flex items-center justify-between p-3 border-b border-gray-800 flex-shrink-0">
            <h2 className="text-lg font-semibold text-white">Email</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowBroadcastModal(true)} className="p-2 bg-[#222222] hover:bg-[#333333] rounded-xl"><IoIosMegaphone size={18} className="text-orange-400" /></button>
              <button onClick={() => setShowEmailModal(true)} className="p-2 bg-orange-500 hover:bg-orange-600 rounded-xl"><Send size={18} className="text-white" /></button>
            </div>
          </div>
          <div className="border-b border-gray-800 flex-shrink-0"><div className="flex overflow-x-auto px-2 py-2 gap-1" style={{ scrollbarWidth: "none" }}>{emailFolders.map((f) => { const Icon = f.icon; const uc = getUnreadCountForFolder(f.id); const isA = emailTab === f.id; return (<button key={f.id} onClick={() => { setEmailTab(f.id); setSelectedEmailIds([]) }} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${isA ? "bg-orange-500 text-white" : "bg-[#222222] text-gray-400"}`}><Icon size={16} /><span>{f.label}</span>{uc > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${isA ? "bg-white/20" : "bg-orange-500 text-white"}`}>{uc}</span>}</button>) })}</div></div>
          <div className="px-3 py-2 border-b border-gray-800 flex-shrink-0"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="text" placeholder="Search emails..." value={emailSearchQuery} onChange={(e) => setEmailSearchQuery(e.target.value)} className="w-full bg-[#222222] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-500 focus:outline-none" /></div></div>
          {selectedEmailIds.length > 0 && (<div className="px-3 py-2 bg-[#181818] border-b border-gray-800 flex items-center justify-between flex-shrink-0"><button onClick={() => setSelectedEmailIds([])} className="text-sm text-gray-400 flex items-center gap-1"><X size={16} /> {selectedEmailIds.length} selected</button><div className="flex items-center gap-2">{!["draft","error","trash"].includes(emailTab) && (<><button onClick={() => bulkMarkAsRead(true)} className="p-2 text-gray-400"><MailCheck size={18} /></button><button onClick={() => bulkMarkAsRead(false)} className="p-2 text-gray-400"><MailOpen size={18} /></button><button onClick={bulkArchive} className="p-2 text-gray-400"><Archive size={18} /></button></>)}<button onClick={bulkDelete} className="p-2 text-red-400"><Trash2 size={18} /></button></div></div>)}
          <div className="flex-1 overflow-y-auto select-none">
            {getPinnedEmails().length === 0 && getFilteredEmails(false).length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-center p-6"><div className="w-20 h-20 rounded-2xl bg-[#222222] border border-[#333333] flex items-center justify-center mb-4"><Mail className="w-10 h-10 text-gray-600" /></div><h3 className="text-white font-medium text-lg mb-2">No emails</h3></div>) : (
              <div className="pb-20">
                {getPinnedEmails().length > 0 && (<><div className="flex items-center gap-2 px-4 py-2 bg-[#0E0E0E]"><Pin size={12} className="text-orange-500 fill-orange-500" /><span className="text-xs text-orange-500 font-medium">Pinned</span><div className="flex-1 h-px bg-orange-500/30" /></div>{getPinnedEmails().map((e) => <MobileEmailItem key={e.id} email={e} emailTab={emailTab} selectedEmailIds={selectedEmailIds} toggleEmailSelection={toggleEmailSelection} handleEmailItemClick={handleEmailItemClick} formatEmailTime={formatEmailTime} truncateEmailText={truncateEmailText} moveEmailToTrash={moveEmailToTrash} />)}</>)}
                {getPinnedEmails().length > 0 && getFilteredEmails(false).length > 0 && <div className="h-px bg-gray-800 mx-4 my-2" />}
                {getFilteredEmails(false).map((e) => <MobileEmailItem key={e.id} email={e} emailTab={emailTab} selectedEmailIds={selectedEmailIds} toggleEmailSelection={toggleEmailSelection} handleEmailItemClick={handleEmailItemClick} formatEmailTime={formatEmailTime} truncateEmailText={truncateEmailText} moveEmailToTrash={moveEmailToTrash} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileView === "detail" && selectedEmail && (
        <div className="md:hidden flex flex-col w-full h-full">
          <div className="flex items-center justify-between p-3 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3"><button onClick={() => { setSelectedEmail(null); setMobileView("list") }} className="text-gray-400 hover:text-white p-1.5"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><span className="font-medium text-white text-sm">Email</span></div>
            <div className="flex items-center gap-1">
              {emailTab === "error" && <button onClick={() => retryFailedEmail(selectedEmail)} className="p-2 text-gray-400"><RefreshCw size={18} /></button>}
              {!["trash","error"].includes(emailTab) && (<><button onClick={() => updateEmailStatus(selectedEmail.id, { isPinned: !selectedEmail.isPinned })} className={`p-2 ${selectedEmail.isPinned ? "text-orange-500" : "text-gray-400"}`}>{selectedEmail.isPinned ? <PinOff size={18} /> : <Pin size={18} />}</button><button onClick={() => { updateEmailStatus(selectedEmail.id, { isArchived: !selectedEmail.isArchived }); setSelectedEmail(null); setMobileView("list") }} className="p-2 text-gray-400"><Archive size={18} /></button></>)}
              <button onClick={() => { if (emailTab === "trash") { setEmailsToDelete([selectedEmail.id]); setShowPermanentDeleteConfirm(true) } else moveEmailToTrash(selectedEmail.id) }} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold text-white mb-3">{selectedEmail.subject}</h2>
            <div className="flex items-start justify-between mb-4"><div><p className="text-sm text-white font-medium">{selectedEmail.sender}</p>{selectedEmail.senderEmail && <p className="text-xs text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</p>}<p className="text-xs text-gray-500 mt-1">To: {selectedEmail.recipient}</p></div><p className="text-xs text-gray-500">{formatEmailTime(selectedEmail.time)}</p></div>
            {selectedEmail.attachments?.length > 0 && (<div className="mb-4 pb-4 border-b border-[#333333]"><p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2"><Paperclip size={14} /> Attachments</p>{selectedEmail.attachments.map((f, i) => <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#222222] rounded-lg mb-1"><Paperclip size={14} className="text-gray-500" /><span className="text-sm text-gray-300">{f.name || f}</span></div>)}</div>)}
            <div className="bg-white p-4 rounded-xl" style={{ color: "#1f2937", fontSize: "14px", lineHeight: "1.5", fontFamily: "Arial, sans-serif" }} dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
          </div>
          {!["trash","draft"].includes(emailTab) && (<div className="p-3 border-t border-[#333333] bg-[#181818]">{emailTab === "error" ? <button onClick={() => retryFailedEmail(selectedEmail)} className="w-full py-3 bg-green-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><RefreshCw size={16} /> Retry Send</button> : <button onClick={() => handleEmailReply(selectedEmail)} className="w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Reply size={16} /> Reply</button>}</div>)}
        </div>
      )}

      {/* ─── MODALS ──────────────────────────────────────── */}

      <div className="relative z-[80]">
        <SendEmailModal showEmailModal={showEmailModal} handleCloseEmailModal={() => { setShowEmailModal(false); setEditingDraft(null); setEmailData({ to: "", subject: "", body: "" }) }} handleSendEmail={handleSendEmail} emailData={emailData} setEmailData={setEmailData} handleSearchMemberForEmail={handleSearchContacts} signature={adminEmailSettings.emailSignature} editingDraft={editingDraft} onSaveAsDraft={handleSaveEmailAsDraft} />
      </div>

      <SendEmailReplyModal isOpen={showReplyModal} onClose={() => { setShowReplyModal(false); setReplyInitialRecipient(null) }} originalEmail={selectedEmail} initialRecipient={replyInitialRecipient} searchMembers={handleSearchContacts} onSendReply={handleSendReply} onSaveAsDraft={handleSaveReplyAsDraft} />

      {showBroadcastModal && (<div className="fixed inset-0 z-[100] hidden md:flex items-center justify-center"><div className="absolute inset-0 bg-black/60" onClick={() => setShowBroadcastModal(false)} /><div className="relative z-10 w-full h-full max-w-[95vw] max-h-[95vh] m-4"><BroadcastModal onClose={() => setShowBroadcastModal(false)} broadcastFolders={broadcastFolders} preConfiguredMessages={preConfiguredMessages} settings={{}} onBroadcast={handleBroadcast} onCreateMessage={(d) => { const nid = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1; setPreConfiguredMessages([...preConfiguredMessages, { id: nid, ...d }]) }} onUpdateMessage={(d) => setPreConfiguredMessages((p) => p.map((m) => m.id === d.id ? d : m))} onDeleteMessage={(id) => setPreConfiguredMessages((p) => p.filter((m) => m.id !== id))} onCreateFolder={(n) => { const nid = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1; setBroadcastFolders([...broadcastFolders, { id: nid, name: n }]) }} onUpdateFolder={(fid, fn) => setBroadcastFolders((p) => p.map((f) => f.id === fid ? { ...f, name: fn } : f))} onDeleteFolder={(fid) => { setBroadcastFolders((p) => p.filter((f) => f.id !== fid)); setPreConfiguredMessages((p) => p.filter((m) => m.folderId !== fid)) }} /></div></div>)}
      {showBroadcastModal && (<div className="md:hidden fixed inset-0 bg-[#1C1C1C] z-[100] flex flex-col overflow-auto"><BroadcastModal onClose={() => setShowBroadcastModal(false)} broadcastFolders={broadcastFolders} preConfiguredMessages={preConfiguredMessages} settings={{}} onBroadcast={handleBroadcast} onCreateMessage={(d) => { const nid = Math.max(0, ...preConfiguredMessages.map((m) => m.id)) + 1; setPreConfiguredMessages([...preConfiguredMessages, { id: nid, ...d }]) }} onUpdateMessage={(d) => setPreConfiguredMessages((p) => p.map((m) => m.id === d.id ? d : m))} onDeleteMessage={(id) => setPreConfiguredMessages((p) => p.filter((m) => m.id !== id))} onCreateFolder={(n) => { const nid = Math.max(0, ...broadcastFolders.map((f) => f.id)) + 1; setBroadcastFolders([...broadcastFolders, { id: nid, name: n }]) }} onUpdateFolder={(fid, fn) => setBroadcastFolders((p) => p.map((f) => f.id === fid ? { ...f, name: fn } : f))} onDeleteFolder={(fid) => { setBroadcastFolders((p) => p.filter((f) => f.id !== fid)); setPreConfiguredMessages((p) => p.filter((m) => m.folderId !== fid)) }} /></div>)}

      {showPermanentDeleteConfirm && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90] p-4"><div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center"><Trash2 className="w-6 h-6 text-red-400" /></div><div><h3 className="text-lg font-semibold text-white">Delete Permanently?</h3><p className="text-sm text-gray-500">This action cannot be undone</p></div></div><p className="text-gray-400 text-sm mb-6">{emailsToDelete.length === 1 ? "Are you sure you want to permanently delete this email?" : `Are you sure you want to permanently delete ${emailsToDelete.length} emails?`}</p><div className="flex justify-end gap-3"><button onClick={() => { setShowPermanentDeleteConfirm(false); setEmailsToDelete([]) }} className="px-4 py-2.5 bg-[#333333] hover:bg-[#444444] text-white rounded-xl text-sm font-medium">Cancel</button><button onClick={confirmPermanentDelete} className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button></div></div></div>)}
    </div>
  )
}
