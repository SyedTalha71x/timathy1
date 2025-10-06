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
          content: "Issue has been resolved. Your payment has been processed successfully.",
          timestamp: "25/1/2025",
        },
      ],
    },
  ]