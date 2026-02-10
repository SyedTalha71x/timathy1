export const adminTickets = [
    {
        id: 1,
        subject: "Account – Premium Issue",
        studioName: 'FitZone Studio',
        status: "Open",
        priority: "Medium",
        category: "Account",
        customer: {
            name: "John Doe",
            email: "john.doe@example.com",
            id: "USR001"
        },
        assignedTo: "Sarah Wilson",
        createdDate: "28/1/2025",
        lastUpdated: "28/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "John Doe",
                content: "Account is not premium.",
                timestamp: "28/1/2025 10:30 AM",
                attachments: []
            },
        ],
    },
    {
        id: 2,
        subject: "Billing – Subscription Renewal",
        studioName: 'FitZone Studio',
        status: "Open",
        priority: "High",
        category: "Billing",
        customer: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            id: "USR002"
        },
        assignedTo: "Mike Johnson",
        createdDate: "27/1/2025",
        lastUpdated: "28/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Jane Smith",
                content: "Having issues with subscription renewal. Payment keeps failing.",
                timestamp: "27/1/2025 2:15 PM",
                attachments: []
            },
            {
                id: 2,
                sender: "support",
                senderName: "OrgaGym",
                content: "I've checked your payment method and it seems there's an issue with your card. Please try updating your payment information.",
                timestamp: "27/1/2025 3:20 PM",
                attachments: []
            },
            {
                id: 3,
                sender: "support",
                senderName: "OrgaGym",
                content: "We have updated your subscription information. Please log in using your personal email and click on 'Subscription' to view the latest details.",
                timestamp: "28/1/2025 9:45 AM",
                attachments: []
            },
        ],
    },
    {
        id: 3,
        subject: "Billing – Payment Error",
        studioName: 'FitZone Studio',
        status: "Closed",
        priority: "Medium",
        category: "Payment",
        customer: {
            name: "Robert Brown",
            email: "robert.brown@example.com",
            id: "USR003"
        },
        assignedTo: "Sarah Wilson",
        createdDate: "25/1/2025",
        lastUpdated: "25/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Robert Brown",
                content: "Having trouble with payment processing",
                timestamp: "25/1/2025 11:00 AM",
                attachments: []
            },
            {
                id: 2,
                sender: "support",
                senderName: "OrgaGym",
                content: "Issue has been resolved. Your payment has been processed successfully.",
                timestamp: "25/1/2025 1:30 PM",
                attachments: []
            },
        ],
    },
    {
        id: 4,
        subject: "Technical – Widget Issue",
        studioName: 'FitZone Studio',
        status: "Open",
        priority: "Low",
        category: "Technical",
        customer: {
            name: "Emily Davis",
            email: "emily.davis@example.com",
            id: "USR004"
        },
        assignedTo: "Unassigned",
        createdDate: "29/1/2025",
        lastUpdated: "29/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Emily Davis",
                content: "The dashboard widget is not loading properly on my account. It shows a blank screen.",
                timestamp: "29/1/2025 8:15 AM",
                attachments: []
            },
        ],
    },
    {
        id: 5,
        subject: "Billing – Duplicate Charge",
        studioName: 'FitZone Studio',
        status: "Awaiting your reply",
        priority: "High",
        category: "Billing",
        customer: {
            name: "Michael Wilson",
            email: "michael.wilson@example.com",
            id: "USR005"
        },
        assignedTo: "Lisa Chen",
        createdDate: "26/1/2025",
        lastUpdated: "27/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Michael Wilson",
                content: "I was charged twice for the same subscription. Please help resolve this.",
                timestamp: "26/1/2025 4:30 PM",
                attachments: []
            },
            {
                id: 2,
                sender: "support",
                senderName: "OrgaGym",
                content: "I can see the duplicate charge on your account. Can you please provide the transaction IDs for both charges so I can process a refund?",
                timestamp: "27/1/2025 10:15 AM",
                attachments: []
            },
        ],
    }
]
