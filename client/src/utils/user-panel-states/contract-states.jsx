export const initialContracts = [
    {
        id: "12321-1",
        memberName: "John Doe",
        contractType: "Premium",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        status: "Active",
        pauseReason: null,
        cancelReason: null,
        isDigital: true,
        email: "john@example.com",
        phone: "1234567890",
        iban: "DE89370400440532013000",
    },
    {
        id: "12321-2",
        memberName: "Jane Smith",
        contractType: "Basic",
        startDate: "2023-02-15",
        endDate: "2024-02-15",
        status: "Paused",
        pauseReason: "Pregnancy",
        cancelReason: null,
        isDigital: false,
    },
    {
        id: "12321-3",
        memberName: "Bob Johnson",
        contractType: "Premium",
        startDate: "2023-03-01",
        endDate: "2024-03-01",
        status: "Cancelled",
        pauseReason: null,
        cancelReason: null,
        isDigital: true,
        email: "bob@example.com",
        phone: "9876543210",
        iban: "FR1420041010050500013M02606",
    },
    {
        id: "12321-4",
        memberName: "Scarlet Johnson",
        contractType: "Bronze",
        startDate: "2023-03-01",
        endDate: "2024-03-01",
        status: "Cancelled",
        pauseReason: null,
        cancelReason: "Financial Reasons",
        isDigital: false,
    },
    {
        id: "12321-5",
        memberName: "Alice Cooper",
        contractType: "Premium",
        startDate: "2023-06-01",
        endDate: "2024-06-01",
        status: "Ongoing",
        pauseReason: null,
        cancelReason: null,
        isDigital: true,
        email: "alice@example.com",
        phone: "5551234567",
        iban: "GB82WEST12345698765432",
        signatureRequired: true,
    },
]

export const contractHistory = {
    "12321-1": [
        {
            id: "hist-1",
            date: "2023-12-15",
            action: "Contract Changed",
            details: "Changed from Basic to Premium",
            performedBy: "Admin User",
            oldValue: "Basic",
            newValue: "Premium",
        },
        {
            id: "hist-2",
            date: "2023-11-20",
            action: "Contract Renewed",
            details: "Renewed for 12 months",
            performedBy: "System",
            oldValue: "2023-01-01 to 2024-01-01",
            newValue: "2024-01-01 to 2025-01-01",
        },
    ],
    "12321-2": [
        {
            id: "hist-3",
            date: "2023-10-10",
            action: "Contract Paused",
            details: "Paused due to Pregnancy",
            performedBy: "Admin User",
            oldValue: "Active",
            newValue: "Paused",
        },
    ],
}

export const sampleLeads = [
    {
        id: "lead-1",
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "5551234567",
        interestedIn: "Premium",
    },
    {
        id: "lead-2",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "5559876543",
        interestedIn: "Basic",
    },
]



export const contractTypes = [
  {
    id: "basic",
    name: "Basic",
    duration: "12 months",
    cost: "$29.99",
    billingPeriod: "Monthly",
  },
  {
    id: "premium",
    name: "Premium",
    duration: "12 months",
    cost: "$49.99",
    billingPeriod: "Monthly",
  },
  {
    id: "bronze",
    name: "Bronze",
    duration: "6 months",
    cost: "$19.99",
    billingPeriod: "Monthly",
  },
]
export const mediaTemplates = [
  {
    id: "template-1",
    name: "Basic Introduction",
    description: "Standard introductory materials for new members",
    pages: [
      {
        id: "page-1",
        title: "Welcome to Our Studio",
        content: "Welcome message and overview of facilities",
        media: ["image1.jpg", "video1.mp4"]
      },
      {
        id: "page-2",
        title: "Studio Rules",
        content: "Important guidelines and policies",
        media: ["image2.jpg"]
      },
      {
        id: "page-3",
        title: "Getting Started",
        content: "How to begin your fitness journey",
        media: ["image3.jpg", "pdf-guide.pdf"]
      }
    ]
  },
  {
    id: "template-2",
    name: "Premium Package",
    description: "Comprehensive materials for premium members",
    pages: [
      {
        id: "page-1",
        title: "Premium Benefits",
        content: "Exclusive features for premium members",
        media: ["premium1.jpg", "video2.mp4"]
      },
      {
        id: "page-2",
        title: "Advanced Training",
        content: "Specialized workout programs",
        media: ["premium2.jpg"]
      }
    ]
  }
]
