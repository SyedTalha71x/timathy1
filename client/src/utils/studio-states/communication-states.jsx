// ============================================================================
// COMMUNICATION-STATES.JS - Chat & Email Daten
// ============================================================================
// Alle Communication-bezogenen Daten und Helper-Funktionen
// Backend-Endpoints: GET /api/chats, GET /api/emails
// ============================================================================

// =============================================================================
// MEMBER CHAT LIST
// =============================================================================
export const memberChatListData = [
  { 
    id: 1, memberId: 1, name: "John Doe", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi John! How was your first EMS session?", time: "01:45 PM", timestamp: "2025-01-25T13:45:00", status: "read" },
      { id: 2, sender: "John", content: "It was amazing! I can really feel the difference already.", time: "01:52 PM", timestamp: "2025-01-25T13:52:00", status: "read" },
      { id: 3, sender: "You", content: "Great to hear! Remember to stay hydrated and get enough protein today.", time: "02:00 PM", timestamp: "2025-01-25T14:00:00", status: "read" },
      { id: 4, sender: "John", content: "Will do! When is my next appointment?", time: "02:15 PM", timestamp: "2025-01-25T14:15:00", status: "read" },
      { id: 5, sender: "You", content: "You're scheduled for Monday at 10:00 AM. See you then! 💪", time: "02:20 PM", timestamp: "2025-01-25T14:20:00", status: "read" },
      { id: 6, sender: "John", content: "Thanks for the session!", time: "02:30 PM", timestamp: "2025-01-25T14:30:00", status: "read" },
    ]
  },
  { 
    id: 2, memberId: 4, name: "Sarah Williams", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Sarah", content: "Hi! I wanted to ask about the yoga class schedule.", time: "10:30 AM", timestamp: "2025-01-25T10:30:00", status: "read" },
      { id: 2, sender: "You", content: "Hi Sarah! We have yoga classes every Tuesday and Thursday at 6 PM.", time: "10:45 AM", timestamp: "2025-01-25T10:45:00", status: "read" },
      { id: 3, sender: "Sarah", content: "Perfect! Can I still join tomorrow's class?", time: "11:00 AM", timestamp: "2025-01-25T11:00:00", status: "read" },
      { id: 4, sender: "You", content: "Yes, there are still 2 spots available! I'll reserve one for you.", time: "11:15 AM", timestamp: "2025-01-25T11:15:00", status: "read" },
      { id: 5, sender: "Sarah", content: "Is the yoga class still on?", time: "11:30 AM", timestamp: "2025-01-25T11:30:00", status: "delivered" },
      { id: 6, sender: "Sarah", content: "Looking forward to the yoga class!", time: "11:45 AM", timestamp: "2025-01-25T11:45:00", status: "delivered" },
    ]
  },
  { 
    id: 3, memberId: 3, name: "Michael Johnson", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi Michael! Ready for your marathon training session?", time: "03:00 PM", timestamp: "2025-01-24T15:00:00", status: "read" },
      { id: 2, sender: "Michael", content: "Absolutely! I've been preparing all week.", time: "03:15 PM", timestamp: "2025-01-24T15:15:00", status: "read" },
      { id: 3, sender: "You", content: "Great! We'll focus on endurance today. Don't forget to bring extra water.", time: "03:30 PM", timestamp: "2025-01-24T15:30:00", status: "read" },
      { id: 4, sender: "Michael", content: "Got it! See you at 4 PM.", time: "03:45 PM", timestamp: "2025-01-24T15:45:00", status: "read" },
      { id: 5, sender: "You", content: "See you soon! 🏃", time: "04:00 PM", timestamp: "2025-01-24T16:00:00", status: "read" },
      { id: 6, sender: "Michael", content: "See you at marathon prep!", time: "04:20 PM", timestamp: "2025-01-24T16:20:00", status: "read" },
    ]
  },
  { 
    id: 4, memberId: 5, name: "David Brown", 
    logo: null, isBirthday: true, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Happy Birthday, David! 🎂🎉", time: "08:00 AM", timestamp: "2025-01-25T08:00:00", status: "read" },
      { id: 2, sender: "David", content: "Thank you so much! That's so nice of you!", time: "08:30 AM", timestamp: "2025-01-25T08:30:00", status: "read" },
      { id: 3, sender: "You", content: "We have a special birthday discount for you - 20% off your next month!", time: "08:45 AM", timestamp: "2025-01-25T08:45:00", status: "read" },
      { id: 4, sender: "David", content: "Wow, that's amazing! I'll definitely use that.", time: "09:00 AM", timestamp: "2025-01-25T09:00:00", status: "read" },
      { id: 5, sender: "You", content: "Your next session is tomorrow at 3 PM. See you there!", time: "09:10 AM", timestamp: "2025-01-25T09:10:00", status: "read" },
      { id: 6, sender: "David", content: "Perfect, I'll be there!", time: "09:15 AM", timestamp: "2025-01-25T09:15:00", status: "read" },
    ]
  },
  { 
    id: 5, memberId: 7, name: "Robert Miller", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Robert", content: "Hello! I booked a trial training for today.", time: "07:30 AM", timestamp: "2025-01-25T07:30:00", status: "read" },
      { id: 2, sender: "You", content: "Welcome Robert! Yes, we have you down for 10 AM. Please bring your ID.", time: "07:45 AM", timestamp: "2025-01-25T07:45:00", status: "read" },
      { id: 3, sender: "Robert", content: "Great! What should I wear?", time: "07:50 AM", timestamp: "2025-01-25T07:50:00", status: "read" },
      { id: 4, sender: "You", content: "Comfortable sportswear is fine. We'll provide everything else including the EMS suit!", time: "07:55 AM", timestamp: "2025-01-25T07:55:00", status: "read" },
      { id: 5, sender: "Robert", content: "Looking forward to the tour!", time: "08:00 AM", timestamp: "2025-01-25T08:00:00", status: "delivered" },
    ]
  },
  { 
    id: 6, memberId: 8, name: "Lisa Garcia", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi Lisa! Just confirming your cardio session for Monday at 9 AM.", time: "04:00 PM", timestamp: "2025-01-24T16:00:00", status: "read" },
      { id: 2, sender: "Lisa", content: "Thanks for the reminder! I'll be there.", time: "04:30 PM", timestamp: "2025-01-24T16:30:00", status: "read" },
      { id: 3, sender: "You", content: "Perfect! Have a great weekend!", time: "04:45 PM", timestamp: "2025-01-24T16:45:00", status: "read" },
      { id: 4, sender: "Lisa", content: "You too! See you Monday!", time: "05:00 PM", timestamp: "2025-01-24T17:00:00", status: "read" },
    ]
  },
];

// =============================================================================
// STAFF CHAT LIST
// =============================================================================
export const staffChatListData = [
  { 
    id: 101, staffId: 2, name: "John Trainer", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hey John, can you cover my 2 PM session today?", time: "12:00 PM", timestamp: "2025-01-25T12:00:00", status: "read" },
      { id: 2, sender: "John Trainer", content: "Sure, no problem! Is everything okay?", time: "12:15 PM", timestamp: "2025-01-25T12:15:00", status: "read" },
      { id: 3, sender: "You", content: "Yes, just have a doctor's appointment. Thanks so much!", time: "12:20 PM", timestamp: "2025-01-25T12:20:00", status: "read" },
      { id: 4, sender: "John Trainer", content: "No worries. Who's the client?", time: "12:30 PM", timestamp: "2025-01-25T12:30:00", status: "read" },
      { id: 5, sender: "You", content: "It's David Brown - EMS Strength session. He prefers upper body focus.", time: "12:35 PM", timestamp: "2025-01-25T12:35:00", status: "read" },
      { id: 6, sender: "John Trainer", content: "Got it! I'll check the schedule.", time: "05:30 PM", timestamp: "2025-01-25T17:30:00", status: "delivered" },
    ]
  },
  { 
    id: 102, staffId: 3, name: "Sarah Coach", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Sarah Coach", content: "Hi! The yoga mats need to be replaced soon.", time: "01:00 PM", timestamp: "2025-01-25T13:00:00", status: "read" },
      { id: 2, sender: "You", content: "Thanks for letting me know. How many do we need?", time: "01:30 PM", timestamp: "2025-01-25T13:30:00", status: "read" },
      { id: 3, sender: "Sarah Coach", content: "At least 5 new ones. The current ones are getting worn.", time: "02:00 PM", timestamp: "2025-01-25T14:00:00", status: "read" },
      { id: 4, sender: "You", content: "I'll order them today. Any specific brand preference?", time: "02:30 PM", timestamp: "2025-01-25T14:30:00", status: "read" },
      { id: 5, sender: "Sarah Coach", content: "The Manduka ones are great if they're in budget.", time: "03:00 PM", timestamp: "2025-01-25T15:00:00", status: "read" },
      { id: 6, sender: "Sarah Coach", content: "Can we discuss the schedule?", time: "03:15 PM", timestamp: "2025-01-25T15:15:00", status: "delivered" },
    ]
  },
  { 
    id: 103, staffId: 4, name: "Mike Manager", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Mike Manager", content: "Team, don't forget the staff meeting tomorrow at 10 AM.", time: "04:00 PM", timestamp: "2025-01-24T16:00:00", status: "read" },
      { id: 2, sender: "You", content: "Will be there! Do we need to prepare anything?", time: "04:30 PM", timestamp: "2025-01-24T16:30:00", status: "read" },
      { id: 3, sender: "Mike Manager", content: "Just bring your monthly stats if you have them ready.", time: "05:00 PM", timestamp: "2025-01-24T17:00:00", status: "read" },
      { id: 4, sender: "You", content: "Perfect, I'll have them ready.", time: "05:30 PM", timestamp: "2025-01-24T17:30:00", status: "read" },
      { id: 5, sender: "Mike Manager", content: "Staff meeting confirmed.", time: "06:00 PM", timestamp: "2025-01-24T18:00:00", status: "read" },
    ]
  },
  { 
    id: 104, staffId: 5, name: "Lisa Reception", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "Lisa Reception", content: "New member signed up! Robert Miller, trial training today.", time: "08:00 AM", timestamp: "2025-01-25T08:00:00", status: "read" },
      { id: 2, sender: "You", content: "Great! Who's assigned to his trial?", time: "08:15 AM", timestamp: "2025-01-25T08:15:00", status: "read" },
      { id: 3, sender: "Lisa Reception", content: "John Trainer will handle it at 10 AM.", time: "08:20 AM", timestamp: "2025-01-25T08:20:00", status: "read" },
      { id: 4, sender: "You", content: "Perfect. Did you send the confirmation email?", time: "08:30 AM", timestamp: "2025-01-25T08:30:00", status: "read" },
      { id: 5, sender: "Lisa Reception", content: "Yes, all done! Forms are printed too.", time: "08:35 AM", timestamp: "2025-01-25T08:35:00", status: "read" },
    ]
  },
  { 
    id: 105, staffId: 1, name: "Natalia Brown", 
    logo: null, isBirthday: false, isArchived: false,
    messages: [
      { id: 1, sender: "You", content: "Hi Natalia, can you update the member database today?", time: "10:00 AM", timestamp: "2025-01-25T10:00:00", status: "read" },
      { id: 2, sender: "Natalia Brown", content: "Sure! Any specific members?", time: "10:15 AM", timestamp: "2025-01-25T10:15:00", status: "read" },
      { id: 3, sender: "You", content: "The new trial members from this week need their info completed.", time: "10:30 AM", timestamp: "2025-01-25T10:30:00", status: "read" },
      { id: 4, sender: "Natalia Brown", content: "I'll get on it right away.", time: "10:45 AM", timestamp: "2025-01-25T10:45:00", status: "read" },
    ]
  },
];

// =============================================================================
// COMPANY CHAT LIST (Team/Group Chat)
// =============================================================================
export const companyChatListData = [
  { 
    id: 100, 
    name: "Fit & Fun Studio", 
    logo: null,
    avatar: null,
    isCompany: true,
    isArchived: false,
    messages: [
      { id: 1, sender: "Mike Manager", staffId: 4, content: "Guten Morgen zusammen! Kurze Erinnerung: Heute um 10 Uhr findet das Team-Meeting statt.", time: "09:00 AM", timestamp: "2025-01-25T09:00:00", status: "read" },
      { id: 2, sender: "You", content: "Danke für die Erinnerung! Bin dabei.", time: "09:10 AM", timestamp: "2025-01-25T09:10:00", status: "read" },
      { id: 3, sender: "Sarah Coach", staffId: 3, content: "Ich bereite die Statistiken für die Gruppenklassen vor.", time: "09:15 AM", timestamp: "2025-01-25T09:15:00", status: "read" },
      { id: 4, sender: "John Trainer", staffId: 2, content: "Ich habe die neuen Trainingspläne fertig. Kann ich die im Meeting kurz vorstellen?", time: "09:22 AM", timestamp: "2025-01-25T09:22:00", status: "read" },
      { id: 5, sender: "Mike Manager", staffId: 4, content: "Ja klar, John! Das passt perfekt in die Agenda.", time: "09:25 AM", timestamp: "2025-01-25T09:25:00", status: "read" },
      { id: 6, sender: "You", content: "Super, freue mich auf die Vorstellung!", time: "09:30 AM", timestamp: "2025-01-25T09:30:00", status: "read" },
      { id: 7, sender: "Lisa Reception", staffId: 5, content: "Ich habe gerade einen Anruf bekommen - der neue Interessent Robert Miller kommt heute um 10 Uhr zum Probetraining.", time: "09:45 AM", timestamp: "2025-01-25T09:45:00", status: "read" },
      { id: 8, sender: "Natalia Brown", staffId: 1, content: "Super! Ich habe seine Kontaktdaten schon im System angelegt.", time: "09:50 AM", timestamp: "2025-01-25T09:50:00", status: "read" },
      { id: 9, sender: "John Trainer", staffId: 2, content: "Perfekt, ich übernehme das Probetraining dann. Ist alles vorbereitet?", time: "10:30 AM", timestamp: "2025-01-25T10:30:00", status: "read" },
      { id: 10, sender: "Lisa Reception", staffId: 5, content: "Ja, die Einverständniserklärung liegt bereit!", time: "10:35 AM", timestamp: "2025-01-25T10:35:00", status: "read" },
      { id: 11, sender: "You", content: "Perfekt organisiert, Team! 👏", time: "10:40 AM", timestamp: "2025-01-25T10:40:00", status: "read" },
      { id: 12, sender: "Sarah Coach", staffId: 3, content: "Kurze Info: Der Yoga-Kurs um 18 Uhr ist schon fast ausgebucht - nur noch 2 Plätze frei!", time: "01:15 PM", timestamp: "2025-01-25T13:15:00", status: "read" },
      { id: 13, sender: "Mike Manager", staffId: 4, content: "Das sind tolle Neuigkeiten! Vielleicht sollten wir einen zweiten Kurs anbieten?", time: "01:30 PM", timestamp: "2025-01-25T13:30:00", status: "read" },
      { id: 14, sender: "Sarah Coach", staffId: 3, content: "Gute Idee! Ich könnte Donnerstags noch einen Kurs übernehmen.", time: "02:00 PM", timestamp: "2025-01-25T14:00:00", status: "read" },
      { id: 15, sender: "John Trainer", staffId: 2, content: "Das Probetraining mit Robert lief super! Er möchte sich für eine Mitgliedschaft anmelden. 💪", time: "02:30 PM", timestamp: "2025-01-25T14:30:00", status: "delivered" },
      { id: 16, sender: "You", content: "Fantastisch! Gut gemacht, John!", time: "02:35 PM", timestamp: "2025-01-25T14:35:00", status: "delivered" },
      { id: 17, sender: "Lisa Reception", staffId: 5, content: "Alles klar, ich kümmere mich um die Anmeldung!", time: "02:45 PM", timestamp: "2025-01-25T14:45:00", status: "delivered" },
    ]
  },
];

// =============================================================================
// EMAIL DATA
// =============================================================================
export const emailListData = {
  inbox: [
    {
      id: 1,
      sender: "John Doe",
      senderEmail: "john.doe@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Membership Upgrade Request",
      body: `<p>Hello FitLife Team,</p>
<p>I've been a member for over <strong>6 months</strong> now and I'm absolutely loving the experience!</p>
<p>I wanted to inquire about upgrading my current membership to the <strong>Premium Plan</strong>.</p>
<p>Best regards,<br/><strong>John Doe</strong><br/>Member #M001</p>`,
      time: "2025-01-26T09:30:00Z",
      isRead: false,
      isPinned: true,
      isArchived: false,
      status: "Delivered",
      attachments: []
    },
    {
      id: 2,
      sender: "Sarah Williams",
      senderEmail: "sarah.w@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Yoga Class Schedule Change Request",
      body: `<p>Hi there,</p>
<p>I hope this email finds you well! I'm writing regarding the <em>morning yoga classes</em>.</p>
<p>Due to a change in my work schedule, I'm no longer able to attend the <strong>7:00 AM sessions</strong>.</p>
<p>Thank you for your flexibility!</p>
<p>Warm regards,<br/><strong>Sarah Williams</strong></p>`,
      time: "2025-01-26T08:15:00Z",
      isRead: false,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: [
        { name: "work_schedule.pdf", size: "125 KB", type: "application/pdf" }
      ]
    },
    {
      id: 3,
      sender: "Michael Johnson",
      senderEmail: "michael.j@example.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "Nutrition Consultation Question",
      body: `<p>Hi FitLife Team!</p>
<p>I'm training for a marathon and have some questions about nutrition.</p>
<p>Looking forward to your advice!</p>
<p>Cheers,<br/><strong>Michael Johnson</strong> 💪</p>`,
      time: "2025-01-25T16:45:00Z",
      isRead: false,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: []
    },
  ],
  sent: [
    {
      id: 101,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "John Doe",
      recipientEmail: "john.doe@example.com",
      subject: "Welcome to FitLife - Your Journey Starts Now! 🎉",
      body: `<p>Dear John,</p>
<p>Welcome to the FitLife family!</p>
<p>We're thrilled to have you join us!</p>
<p>Best regards,<br/><strong>The FitLife Team</strong></p>`,
      time: "2025-01-25T10:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Delivered",
      attachments: []
    },
  ],
  draft: [
    {
      id: 201,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "",
      recipientEmail: "",
      subject: "March Promotions - Spring Into Fitness! 🌷",
      body: `<p>Dear Members,</p>
<p>Get ready for an amazing March at FitLife!</p>
<p><em>[Continue drafting...]</em></p>`,
      time: "2025-01-24T16:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Draft",
      attachments: []
    },
  ],
  archive: [],
  trash: [
    {
      id: 301,
      sender: "Promo Deals",
      senderEmail: "noreply@spam-promo.com",
      recipient: "FitLife Studio",
      recipientEmail: "studio@fitlife.com",
      subject: "🎁 EXCLUSIVE: 90% OFF SUPPLEMENTS!!!",
      body: `<p>SPAM content removed</p>`,
      time: "2025-01-20T03:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Read",
      attachments: [],
      deletedAt: "2025-01-20T08:00:00Z"
    },
  ],
  error: [
    {
      id: 401,
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: "Unknown User",
      recipientEmail: "invalid.email@nonexistent-domain.xyz",
      subject: "Your Membership Renewal Reminder",
      body: `<p>Dear Member,</p>
<p>This is a friendly reminder that your membership is due for renewal.</p>
<p>Best regards,<br/>FitLife Studio</p>`,
      time: "2025-01-21T10:00:00Z",
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Failed",
      attachments: [],
      errorMessage: "Recipient email address does not exist (550 5.1.1 User unknown)"
    }
  ]
};

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================
export const emailTemplatesData = [
  { id: 1, name: "Welcome Email", subject: "Welcome to {Studio_Name}!", body: "Dear {Member_Name},\n\nWelcome!\n\nBest regards" },
  { id: 2, name: "Appointment Reminder", subject: "Reminder: {Date}", body: "Dear {Member_Name},\n\nReminder for your appointment on {Date}." },
  { id: 3, name: "Birthday Greeting", subject: "Happy Birthday!", body: "Dear {Member_Name},\n\nHappy Birthday! 🎂" },
];

// =============================================================================
// PRE-CONFIGURED MESSAGES
// =============================================================================
export const preConfiguredMessagesData = [
  { id: 1, title: "Greeting", message: "Hello! How can I help you today?" },
  { id: 2, title: "Confirmation", message: "Your appointment has been confirmed." },
  { id: 3, title: "Reschedule", message: "When would you like to reschedule?" },
];

// =============================================================================
// COMMUNICATION SETTINGS
// =============================================================================
export const communicationSettingsData = {
  autoArchiveDuration: 30,
  emailNotificationEnabled: true,
  birthdayMessageEnabled: true,
  birthdayMessageTemplate: "Happy Birthday! 🎂",
  birthdaySendTime: "09:00",
  appointmentNotificationEnabled: true,
  emailSignature: "<p>Best regards,<br><strong>FitLife Studio Team</strong></p><p>📞 +49 30 12345678<br>📧 info@fitlife-studio.de<br>🌐 www.fitlife-studio.de</p><p style=\"color: #666; font-size: 12px;\">Musterstraße 123, 10115 Berlin</p>",
};

// Notification Types
export const appointmentNotificationTypesData = { email: true, sms: false, push: true };

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getLastMessage = (chat) => {
  if (!chat?.messages || chat.messages.length === 0) return null;
  return chat.messages[chat.messages.length - 1];
};

export const getLastMessageContent = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return "No messages yet";
  return lastMsg.content;
};

export const getLastMessageTime = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return "";
  
  if (lastMsg.timestamp) {
    const msgDate = new Date(lastMsg.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = msgDate.toDateString() === today.toDateString();
    const isYesterday = msgDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today | ${lastMsg.time}`;
    } else if (isYesterday) {
      return `Yesterday | ${lastMsg.time}`;
    } else {
      return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` | ${lastMsg.time}`;
    }
  }
  return lastMsg.time;
};

export const getUnreadCount = (chat) => {
  if (!chat?.messages) return 0;
  return chat.messages.filter(msg => msg.sender !== "You" && (msg.status === "delivered" || msg.status === "sent")).length;
};

export const isChatRead = (chat) => {
  const lastMsg = getLastMessage(chat);
  if (!lastMsg) return true;
  return lastMsg.sender === "You" || lastMsg.status === "read";
};

export const getChatByMemberId = (memberId) => 
  memberChatListData.find(c => c.memberId === memberId) || null;

export const getChatByStaffId = (staffId) => 
  staffChatListData.find(c => c.staffId === staffId) || null;

// =============================================================================
// MOCK API
// =============================================================================

export const chatsApi = {
  getMemberChats: async () => memberChatListData,
  getStaffChats: async () => staffChatListData,
  getCompanyChat: async () => companyChatListData[0],
  getChatById: async (id) => [...memberChatListData, ...staffChatListData, ...companyChatListData].find(c => c.id === id),
  sendMessage: async (chatId, message) => ({ success: true, message }),
};

export const emailsApi = {
  getInbox: async () => emailListData.inbox,
  getSent: async () => emailListData.sent,
  getDrafts: async () => emailListData.draft,
  getTrash: async () => emailListData.trash,
  send: async (email) => ({ success: true, email }),
  saveDraft: async (email) => ({ success: true, email }),
  delete: async (id) => ({ success: true }),
};

export default {
  memberChatListData,
  staffChatListData,
  companyChatListData,
  emailListData,
  emailTemplatesData,
  preConfiguredMessagesData,
  communicationSettingsData,
  appointmentNotificationTypesData,
  getLastMessage,
  getLastMessageContent,
  getLastMessageTime,
  getUnreadCount,
  isChatRead,
  getChatByMemberId,
  getChatByStaffId,
  chatsApi,
  emailsApi,
};
