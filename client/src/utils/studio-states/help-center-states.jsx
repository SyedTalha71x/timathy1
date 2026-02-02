export const sampleTickets = [
  {
    id: 1,
    subject: "Account is not premium",
    status: "Open",
    date: "28/1/2025",
    messages: [
      {
        id: 1,
        sender: "user",
        content: "Account is not premium.",
        timestamp: "28/1/2025",
      },
    ],
    createdTimestamp: "2024-12-15T10:30:00.000Z",
    updatedTimestamp: "2024-12-15T10:30:00.000Z",
  },
  {
    id: 2,
    subject: "Subscription renewal issue",
    status: "Awaiting your reply",
    date: "27/1/2025",
    messages: [
      {
        id: 1,
        sender: "support",
        content:
          "We are very sorry, the current subscription cannot be maintained due to official technical problems of Disney+. We must replace you with a more stable subscription. Thank you for your understanding.",
        timestamp: "27/1/2025",
      },
      {
        id: 2,
        sender: "support",
        content:
          'We have updated your subscription information. Please log in to GamsGo using your personal email and click on "Subscription" to view the latest details of your current subscription. If you have any other questions, feel free to contact us anytime. We will do our best to provide you with a satisfactory solution!',
        timestamp: "28/1/2025",
      },
    ],
    createdTimestamp: "2024-12-15T10:30:00.000Z",
    updatedTimestamp: "2024-12-15T10:30:00.000Z",
  },
  {
    id: 3,
    subject: "Payment processing error",
    status: "Closed",
    date: "25/1/2025",
    messages: [
      {
        id: 1,
        sender: "user",
        content: "Having trouble with payment processing",
        timestamp: "25/1/2025",
      },
      {
        id: 2,
        sender: "support",
        content:
          "Issue has been resolved. Your payment has been processed successfully.",
        timestamp: "25/1/2025",
      },
    ],
    createdTimestamp: "2024-12-15T10:30:00.000Z",
    updatedTimestamp: "2024-12-15T10:30:00.000Z",
  },
  {
    id: 4,
    subject: "Login issue on mobile app",
    status: "Open",
    date: "29/1/2025",
    messages: [
      {
        id: 1,
        sender: "user",
        content: "I am unable to log in on the mobile app. It keeps showing an error.",
        timestamp: "29/1/2025",
      },
      {
        id: 2,
        sender: "support",
        content:
          "Thank you for reaching out. Could you please share a screenshot of the error you are seeing?",
        timestamp: "29/1/2025",
      },
    ],
    createdTimestamp: "2025-01-29T09:15:00.000Z",
    updatedTimestamp: "2025-01-29T09:20:00.000Z",
  },
];

export const categories = [
  {
    id: 1,
    name: "Online Support",
    description: "Help you contact online customer service.",
    topics: [
      {
        id: 101,
        title: "How to contact online customer service",
        content:
          "When you need help from customer service, you can contact online customer service by following the steps below. Open www.gamsgo.com and click on the chat option at the bottom right of the screen.",
        updatedDate: "2024-01-15",
        updatedTime: "10:30 AM",
        category: "Online Support",
      },
      {
        id: 102,
        title: "Response time and hours",
        content:
          "Our customer service team is available 24/7 to assist you. Response times vary during peak hours. For urgent issues, please use the priority support option.",
        updatedDate: "2024-01-14",
        updatedTime: "2:15 PM",
        category: "Online Support",
      },
      {
        id: 103,
        title: "Submitting a support ticket",
        content:
          "To submit a support ticket, navigate to the Tickets section in your dashboard. Click 'Create Ticket', describe your issue in detail, and attach any relevant screenshots. Our team typically responds within 24 hours.",
        updatedDate: "2024-01-13",
        updatedTime: "11:00 AM",
        category: "Online Support",
      },
      {
        id: 104,
        title: "Live chat vs email support",
        content:
          "Live chat is best for quick questions and immediate assistance. Email support is recommended for complex issues that require detailed explanations or file attachments. Both channels are monitored by our expert team.",
        updatedDate: "2024-01-12",
        updatedTime: "3:45 PM",
        category: "Online Support",
      },
      {
        id: 105,
        title: "Escalating your issue",
        content:
          "If your issue hasn't been resolved satisfactorily, you can request escalation to a senior support agent. Simply reply to your existing ticket with 'Request Escalation' and provide additional context.",
        updatedDate: "2024-01-11",
        updatedTime: "9:30 AM",
        category: "Online Support",
      },
    ],
  },
  {
    id: 2,
    name: "Marketplace",
    description:
      "A platform connecting sellers and buyers to enable secure, efficient trades and simplify transactions.",
    topics: [
      {
        id: 201,
        title: "How to list items on marketplace",
        content:
          'To list items on our marketplace, navigate to your seller dashboard and click "Create Listing". Fill in the required information including title, description, price, and upload clear product images.',
        updatedDate: "2024-01-13",
        updatedTime: "11:45 AM",
        category: "Marketplace",
      },
      {
        id: 202,
        title: "Marketplace fees and commissions",
        content:
          "We charge a small commission on each sale to maintain our platform. The fee structure varies based on product category. Standard categories have a 5% commission rate.",
        updatedDate: "2024-01-12",
        updatedTime: "3:20 PM",
        category: "Marketplace",
      },
      {
        id: 203,
        title: "Managing your orders",
        content:
          "Keep track of all your orders in the Orders section. You can view pending orders, process shipments, handle returns, and communicate with buyers. Our system automatically notifies you when new orders come in.",
        updatedDate: "2024-01-11",
        updatedTime: "10:00 AM",
        category: "Marketplace",
      },
      {
        id: 204,
        title: "Payment processing and withdrawals",
        content:
          "Payments are processed securely through our platform. Funds are held for 7 days after delivery confirmation before becoming available for withdrawal. You can withdraw to your bank account or PayPal.",
        updatedDate: "2024-01-10",
        updatedTime: "2:30 PM",
        category: "Marketplace",
      },
      {
        id: 205,
        title: "Handling disputes and refunds",
        content:
          "If a buyer opens a dispute, you will be notified immediately. Respond within 48 hours with evidence supporting your case. Our team will review and make a fair decision based on the provided information.",
        updatedDate: "2024-01-09",
        updatedTime: "4:15 PM",
        category: "Marketplace",
      },
    ],
  },
  {
    id: 3,
    name: "AI Chatbot",
    description: "Choosing the Right AI Chatbot for You",
    topics: [
      {
        id: 301,
        title: "Getting started with AI Chatbot",
        content:
          "Our AI Chatbot integrates seamlessly with your website. Simply add the provided script tag to your HTML and configure your preferences in the dashboard.",
        updatedDate: "2024-01-11",
        updatedTime: "9:00 AM",
        category: "AI Chatbot",
      },
      {
        id: 302,
        title: "Customizing chatbot responses",
        content:
          "You can train your chatbot by providing sample conversations and expected responses. Use our training interface to upload FAQ data or custom conversation scripts.",
        updatedDate: "2024-01-10",
        updatedTime: "4:30 PM",
        category: "AI Chatbot",
      },
      {
        id: 303,
        title: "Chatbot analytics and insights",
        content:
          "Monitor your chatbot's performance in the Analytics section. View conversation metrics, user satisfaction scores, and identify common questions that need better answers.",
        updatedDate: "2024-01-09",
        updatedTime: "11:15 AM",
        category: "AI Chatbot",
      },
      {
        id: 304,
        title: "Multi-language support",
        content:
          "Our AI Chatbot supports over 50 languages. Enable automatic language detection or set a default language in your settings. Translations are powered by advanced neural networks.",
        updatedDate: "2024-01-08",
        updatedTime: "3:00 PM",
        category: "AI Chatbot",
      },
    ],
  },
  {
    id: 4,
    name: "Netflix",
    description: "NFLX related issues, account renewal, expiration, PIN code, etc.",
    topics: [
      {
        id: 401,
        title: "How to reset Netflix password",
        content:
          'To reset your Netflix password, go to your account settings and click "Change password". Enter your current password and set a new one. You will need to log in again on all devices.',
        updatedDate: "2024-01-09",
        updatedTime: "1:15 PM",
        category: "Netflix",
      },
      {
        id: 402,
        title: "Netflix device management",
        content:
          "Manage which devices can access your Netflix account. Go to Account Settings > Sign Out Of All Devices to remotely log out from specific devices.",
        updatedDate: "2024-01-08",
        updatedTime: "5:45 PM",
        category: "Netflix",
      },
      {
        id: 403,
        title: "Setting up Netflix profiles",
        content:
          "Create up to 5 profiles on a single Netflix account. Each profile has its own personalized recommendations and watch history. Kids profiles have additional parental controls.",
        updatedDate: "2024-01-07",
        updatedTime: "10:30 AM",
        category: "Netflix",
      },
      {
        id: 404,
        title: "Netflix PIN code setup",
        content:
          "Protect your profile with a 4-digit PIN. Go to Account > Profile & Parental Controls and select your profile. Click 'Profile Lock' to enable PIN protection.",
        updatedDate: "2024-01-06",
        updatedTime: "2:00 PM",
        category: "Netflix",
      },
      {
        id: 405,
        title: "Troubleshooting playback issues",
        content:
          "If you're experiencing buffering or playback problems, try restarting your device, checking your internet connection, or lowering the video quality in settings. Clear app cache if issues persist.",
        updatedDate: "2024-01-05",
        updatedTime: "4:45 PM",
        category: "Netflix",
      },
    ],
  },
  {
    id: 5,
    name: "YouTube",
    description: "YouTube subscription and account management guide",
    topics: [
      {
        id: 501,
        title: "How to activate YouTube subscription on GamsGo",
        content:
          "You can activate your YouTube subscription through GamsGo by going to the marketplace and selecting the YouTube Premium plan. Follow the checkout process to complete your purchase.",
        updatedDate: "2024-01-07",
        updatedTime: "10:00 AM",
        category: "YouTube",
      },
      {
        id: 502,
        title: "YouTube Premium benefits",
        content:
          "YouTube Premium includes ad-free videos, background play, offline downloads, and access to YouTube Music Premium. Enjoy uninterrupted viewing across all your devices.",
        updatedDate: "2024-01-06",
        updatedTime: "1:30 PM",
        category: "YouTube",
      },
      {
        id: 503,
        title: "Managing YouTube family plan",
        content:
          "With YouTube Premium Family, you can share benefits with up to 5 family members. All members must be in the same household. Manage members through your Google account settings.",
        updatedDate: "2024-01-05",
        updatedTime: "11:00 AM",
        category: "YouTube",
      },
    ],
  },
  {
    id: 6,
    name: "Disney+",
    description: "Disney+ streaming service support and FAQ",
    topics: [
      {
        id: 601,
        title: "Disney+ account setup",
        content:
          "Create your Disney+ account by visiting our platform and following the registration steps. You can link your existing Disney account or create a new one.",
        updatedDate: "2024-01-06",
        updatedTime: "2:30 PM",
        category: "Disney+",
      },
      {
        id: 602,
        title: "Disney+ supported devices",
        content:
          "Disney+ is available on smart TVs, gaming consoles, mobile devices, tablets, and web browsers. Check the Disney+ website for a complete list of supported devices and system requirements.",
        updatedDate: "2024-01-05",
        updatedTime: "10:15 AM",
        category: "Disney+",
      },
      {
        id: 603,
        title: "Downloading content for offline viewing",
        content:
          "Download movies and shows to watch offline on the Disney+ mobile app. Select the download icon next to any title. Downloads are available for 30 days and expire 48 hours after starting playback.",
        updatedDate: "2024-01-04",
        updatedTime: "3:45 PM",
        category: "Disney+",
      },
      {
        id: 604,
        title: "Disney+ parental controls",
        content:
          "Set up Kids Profiles with age-appropriate content only. You can also add a PIN to restrict access to mature content on adult profiles. Manage these settings in Account > Parental Controls.",
        updatedDate: "2024-01-03",
        updatedTime: "9:00 AM",
        category: "Disney+",
      },
    ],
  },
]
