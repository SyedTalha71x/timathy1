// ══════════════════════════════════════════════════════════
// ADMIN PANEL - EMAIL STATES
// ══════════════════════════════════════════════════════════
// Standalone data layer for the Admin Email Panel.
// Keeps admin panel independent from studio-states.
// ══════════════════════════════════════════════════════════

// ── Contacts (replaces membersData + staffData) ────────────
// These are the people the admin can email / broadcast to.
// Extend or replace with your own API data as needed.

export const adminContactsData = [
  {
    id: 1,
    firstName: "Max",
    lastName: "Mustermann",
    email: "max.mustermann@example.com",
    image: null,
    type: "member",
    isActive: true,
    isArchived: false,
  },
  {
    id: 2,
    firstName: "Anna",
    lastName: "Schmidt",
    email: "anna.schmidt@example.com",
    image: null,
    type: "member",
    isActive: true,
    isArchived: false,
  },
  {
    id: 3,
    firstName: "Lena",
    lastName: "Weber",
    email: "lena.weber@example.com",
    image: null,
    type: "member",
    isActive: true,
    isArchived: false,
  },
  {
    id: 4,
    firstName: "Tom",
    lastName: "Fischer",
    email: "tom.fischer@example.com",
    image: null,
    type: "member",
    isActive: true,
    isArchived: false,
  },
  {
    id: 5,
    firstName: "Sophie",
    lastName: "Bauer",
    email: "sophie.bauer@example.com",
    image: null,
    type: "member",
    isActive: true,
    isArchived: false,
  },
]

export const adminStaffData = [
  {
    id: 101,
    firstName: "Julia",
    lastName: "Meier",
    email: "julia.meier@studio.com",
    img: null,
    role: "Trainer",
    type: "staff",
  },
  {
    id: 102,
    firstName: "Markus",
    lastName: "König",
    email: "markus.koenig@studio.com",
    img: null,
    role: "Manager",
    type: "staff",
  },
  {
    id: 103,
    firstName: "Sarah",
    lastName: "Hoffmann",
    email: "sarah.hoffmann@studio.com",
    img: null,
    role: "Trainer",
    type: "staff",
  },
]

// ── Email List (Inbox, Sent, Drafts, etc.) ─────────────────

export const adminEmailListData = {
  inbox: [
    {
      id: 1001,
      sender: "Max Mustermann",
      senderEmail: "max.mustermann@example.com",
      recipient: "Admin",
      recipientEmail: "admin@studio.com",
      subject: "Question about membership",
      body: "<p>Hello,</p><p>I have a question about my current membership plan. Could you provide more details about upgrading options?</p><p>Best regards,<br/>Max</p>",
      time: "2025-02-02T10:30:00Z",
      isRead: false,
      isPinned: false,
      isArchived: false,
      status: "Received",
      attachments: [],
    },
    {
      id: 1002,
      sender: "Anna Schmidt",
      senderEmail: "anna.schmidt@example.com",
      recipient: "Admin",
      recipientEmail: "admin@studio.com",
      subject: "Appointment cancellation",
      body: "<p>Hi,</p><p>Unfortunately I need to cancel my appointment next Thursday. Can we reschedule?</p><p>Thanks,<br/>Anna</p>",
      time: "2025-02-01T14:15:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Received",
      attachments: [],
    },
    {
      id: 1003,
      sender: "Lena Weber",
      senderEmail: "lena.weber@example.com",
      recipient: "Admin",
      recipientEmail: "admin@studio.com",
      subject: "Invoice request",
      body: "<p>Good morning,</p><p>Could you please send me the invoice for last month? I need it for my records.</p><p>Thank you,<br/>Lena</p>",
      time: "2025-01-31T09:00:00Z",
      isRead: false,
      isPinned: true,
      isArchived: false,
      status: "Received",
      attachments: [{ name: "previous_invoice.pdf", size: "245 KB", type: "application/pdf" }],
    },
  ],
  sent: [
    {
      id: 2001,
      sender: "Admin",
      senderEmail: "admin@studio.com",
      recipient: "Max Mustermann",
      recipientEmail: "max.mustermann@example.com",
      subject: "Re: Question about membership",
      body: "<p>Hi Max,</p><p>Thank you for reaching out! Here are the available upgrade options...</p><p>Best,<br/>Admin Team</p>",
      time: "2025-02-02T11:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Sent",
      attachments: [],
    },
    {
      id: 2002,
      sender: "Admin",
      senderEmail: "admin@studio.com",
      recipient: "All Members",
      recipientEmail: "members@studio.com",
      subject: "February Newsletter",
      body: "<p>Dear Members,</p><p>Here's what's new this month at our studio...</p>",
      time: "2025-02-01T08:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Sent",
      attachments: [{ name: "february_schedule.pdf", size: "512 KB", type: "application/pdf" }],
    },
  ],
  draft: [
    {
      id: 3001,
      sender: "Admin",
      senderEmail: "admin@studio.com",
      recipient: "Tom Fischer",
      recipientEmail: "tom.fischer@example.com",
      subject: "Payment reminder",
      body: "<p>Hi Tom,</p><p>This is a friendly reminder that your payment is...</p>",
      time: "2025-02-03T07:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Draft",
      attachments: [],
    },
  ],
  archive: [],
  error: [
    {
      id: 5001,
      sender: "Admin",
      senderEmail: "admin@studio.com",
      recipient: "unknown@invalid.tld",
      recipientEmail: "unknown@invalid.tld",
      subject: "Test Email",
      body: "<p>This email failed to deliver.</p>",
      time: "2025-01-28T16:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Failed",
      attachments: [],
    },
  ],
  trash: [],
}

// ── Insert Variables (Single Source of Truth) ──────────────

export const EMAIL_INSERT_VARIABLES = [
  { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
  { id: 'franchise_name', label: 'Franchise Name', value: '{Franchise_Name}' },
  { id: 'operator_first_name', label: 'Studio Operator First Name', value: '{Studio_Operator_First_Name}' },
  { id: 'operator_last_name', label: 'Studio Operator Last Name', value: '{Studio_Operator_Last_Name}' },
]

// ── Email Templates ────────────────────────────────────────
// Alias: components import `emailTemplatesData` (backward-compatible name)

export const adminEmailTemplatesData = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to {Studio_Name}!",
    body: "<p>Hello,</p><p>Welcome to {Studio_Name}! We're excited to have you on board.</p><p>Best regards,<br/>{Studio_Operator_First_Name} {Studio_Operator_Last_Name}<br/>{Studio_Name}</p>",
  },
  {
    id: 2,
    name: "Payment Reminder",
    subject: "Payment Reminder - {Studio_Name}",
    body: "<p>Dear Customer,</p><p>This is a friendly reminder that your payment is due. Please settle it at your earliest convenience.</p><p>Best regards,<br/>{Studio_Operator_First_Name} {Studio_Operator_Last_Name}<br/>{Studio_Name}</p>",
  },
  {
    id: 3,
    name: "Appointment Confirmation",
    subject: "Your Appointment is Confirmed",
    body: "<p>Hello,</p><p>Your appointment has been confirmed. We look forward to seeing you!</p><p>Best,<br/>{Studio_Name}</p>",
  },
  {
    id: 4,
    name: "Monthly Newsletter",
    subject: "What's New at {Studio_Name}",
    body: "<p>Dear Member,</p><p>Here are the latest updates and events happening this month...</p><p>Best regards,<br/>{Franchise_Name} - {Studio_Name}</p>",
  },
]

// Backward-compatible alias used by SendEmailModal, SendEmailReplyModal
export const emailTemplatesData = adminEmailTemplatesData

// ── Email Settings / Configuration ─────────────────────────

export const adminEmailSettings = {
  emailSignature:
    "<p>Best regards,<br/><strong>Admin Team</strong><br/>FitLife Studio<br/>info@fitlife-studio.com</p>",
  senderName: "FitLife Studio Admin",
  senderEmail: "admin@fitlife-studio.com",
}

// ── Broadcast Data ─────────────────────────────────────────

export const adminBroadcastFolders = [
  { id: 1, name: "General", color: "#FF843E" },
  { id: 2, name: "Announcements", color: "#3B82F6" },
  { id: 3, name: "Events", color: "#10B981" },
]

export const adminPreConfiguredMessages = [
  {
    id: 1,
    name: "Studio Closed",
    subject: "Studio Closed - {Studio_Name}",
    body: "<p>Please note that {Studio_Name} will be closed on the following date. We apologize for any inconvenience.</p><p>Best regards,<br/>{Studio_Operator_First_Name} {Studio_Operator_Last_Name}</p>",
    folderId: 1,
  },
  {
    id: 2,
    name: "New Class Available",
    subject: "New Class Available at {Studio_Name}!",
    body: "<p>We're excited to announce a new class at {Studio_Name}! Check the schedule for details.</p>",
    folderId: 3,
  },
  {
    id: 3,
    name: "Maintenance Notice",
    subject: "Maintenance Notice - {Studio_Name}",
    body: "<p>Please be aware of scheduled maintenance at {Studio_Name}. Some equipment may be temporarily unavailable.</p>",
    folderId: 2,
  },
]
