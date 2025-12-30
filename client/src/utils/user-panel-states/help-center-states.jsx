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

  // ➤ NEW TICKET ADDED
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

export   const categories = [
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
      ],
    },
  ]
