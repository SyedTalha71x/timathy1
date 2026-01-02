import dayjs from "dayjs";
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import FranchiseImage from '../../../public/franchise-icon.png'
import StudioIcon from '../../../public/studio.avif'

export const studioMembersData = {
  1: [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+49123456789",
      street: "Hauptstraße 123",
      zipCode: "10115",
      city: "Berlin",
      dateOfBirth: "1990-05-15",
      about: "Regular gym member who enjoys weightlifting and cardio workouts.",
      note: "Prefers evening workout sessions",
      noteStartDate: "2023-01-15",
      noteEndDate: "2023-12-31",
      noteImportance: "unimportant",
      contractStart: "2023-01-15",
      contractEnd: "2024-01-15",
      membershipType: "Premium",
      joinDate: "2023-01-15",
      status: "active",
      image: "/default-avatar.avif",
    },
    // ... other members
  ],
  2: [
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@example.com",
      phone: "+49111222333",
      street: "Alexanderplatz 12",
      zipCode: "10178",
      city: "Berlin",
      dateOfBirth: "1988-04-17",
      about: "Dance instructor and fitness enthusiast. Specializes in Zumba and aerobics.",
      note: "Allergic to latex - use alternative equipment",
      noteStartDate: "2023-01-05",
      noteEndDate: "2024-01-05",
      noteImportance: "important",
      contractStart: "2023-01-05",
      contractEnd: "2024-01-05",
      membershipType: "Basic",
      joinDate: "2023-01-05",
      status: "active",
      image: "/default-avatar.avif",
    },
    // ... other members
  ],
};

export const studioStaffData = {
  1: [
    {
      id: 1,
      firstName: "Natalia",
      lastName: "Brown",
      role: "Telephone operator",
      email: "natalia.brown@example.com",
      phone: "+1234567890",
      description: "Experienced telephone operator with excellent communication skills.",
      img: null,
      userId: "natalia.telephone-operator",
      username: "natalia.brown",
      street: "123 Main St",
      zipCode: "12345",
      city: "Anytown",
      vacationEntitlement: 30,
      birthday: "1990-05-10",
    },
  ],
  2: [
    {
      id: 2,
      firstName: "Natalia",
      lastName: "Brown",
      role: "Telephone operator",
      email: "natalia.brown@example.com",
      phone: "+1234567890",
      description: "Experienced telephone operator with excellent communication skills.",
      img: null,
      userId: "natalia.telephone-operator",
      username: "natalia.brown",
      street: "123 Main St",
      zipCode: "12345",
      city: "Anytown",
      vacationEntitlement: 30,
      birthday: "1990-05-10",
    },
  ],
}

export const studioLeadData = {
  1: [
    {
      id: "h1",
      firstName: "John",
      surname: "Smith",
      email: "john.smith@example.com",
      phoneNumber: "+1234567890",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "Website",
      status: "active",
      about: "Software Engineer",
      createdAt: "2025-01-15T10:30:00Z",
      specialNote: {
        text: "Interested in personal training sessions twice a week.",
        isImportant: false,
        startDate: "2025-01-15",
        endDate: "2025-03-15",
      },
      columnId: "active",
      studioName: "Studio Name XYZ..",
      street: "123 Main St",
      zipCode: "12345",
      city: "New York",
      country: "USA",
      website: "https://example.com",
      leadId: "LEAD-001",
      prospectCategory: "active", // Added
    },
    {
      id: "h2",
      firstName: "Sarah",
      surname: "Wilson",
      email: "sarah.wilson@example.com",
      phoneNumber: "+1987654321",
      trialPeriod: "Trial Period",
      hasTrialTraining: false,
      avatar: Avatar,
      source: "Google Ads",
      status: "passive",
      createdAt: "2025-01-20T14:45:00Z",
      specialNote: {
        text: "Has dietary restrictions - needs specialized nutrition plan.",
        isImportant: false,
        startDate: "2025-01-20",
        endDate: "2025-04-20",
      },
      columnId: "passive",
      studioName: "Studio Name XYZ..",
      street: "456 Oak Ave",
      zipCode: "67890",
      city: "Los Angeles",
      country: "USA",
      website: "https://sarahwilson.com",
      leadId: "LEAD-002",
      prospectCategory: "passive", // Added
    },
  ],
  2: [
    {
      id: "h3",
      firstName: "Michael",
      surname: "Brown",
      email: "michael.brown@example.com",
      phoneNumber: "+1122334455",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "Social Media Ads",
      status: "active",
      createdAt: "2025-01-25T09:15:00Z",
      specialNote: {
        text: "Former athlete, looking for high-intensity workouts.",
        isImportant: false,
        startDate: "2025-01-25",
        endDate: "2025-02-25",
      },
      columnId: "active",
      studioName: "Studio Name XYZ..",
      street: "789 Pine Rd",
      zipCode: "54321",
      city: "Chicago",
      country: "USA",
      website: "https://michaelbrown.fitness",
      leadId: "LEAD-003",
      prospectCategory: "active", // Added
    },
    {
      id: "h4",
      firstName: "Emma",
      surname: "Davis",
      email: "emma.davis@example.com",
      phoneNumber: "+1555666777",
      trialPeriod: "Trial Period",
      hasTrialTraining: false,
      avatar: Avatar,
      source: "Email Campaign",
      status: "uninterested",
      createdAt: "2025-02-01T11:20:00Z",
      specialNote: {
        text: "Requested follow-up in 3 months - not ready to commit now.",
        isImportant: true,
        startDate: "2025-02-01",
        endDate: "2025-05-01",
      },
      columnId: "uninterested",
      studioName: "",
      street: "321 Elm St",
      zipCode: "98765",
      city: "Miami",
      country: "USA",
      website: "https://emmadavis.com",
      leadId: "LEAD-004",
      prospectCategory: "uninterested", // Added
    },
  ],
}

export const studioContractsData = {
  1: [
    {
      id: "12321-1",
      studioName: "Pro Physio Studio",
      studioOwnerName: "John Doe",
      memberName: "Jane Smith",
      contractType: "Premium",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      status: "Active",
      pauseReason: null,
      cancelReason: null,
      isDigital: true,
      email: "prostudio@example.com",
      phone: "1234567890",
      iban: "DE89370400440532013000",
    },
  ],

  2: [
    {
      id: "12321-2",
      studioName: "Power Fitness Gym",
      studioOwnerName: "Jane Smith",
      memberName: "Jane Smith",
      contractType: "Basic",
      startDate: "2023-02-15",
      endDate: "2024-02-15",
      status: "Paused",
      pauseReason: "Pregnancy",
      cancelReason: null,
      isDigital: false,
    },

  ],
};


export const studioFinanceData = {
  1: {
    month: { totalRevenue: 45000, successfulPayments: 42000, pendingPayments: 2500, failedPayments: 500 },
    quarter: { totalRevenue: 135000, successfulPayments: 128000, pendingPayments: 5500, failedPayments: 1500 },
    year: { totalRevenue: 540000, successfulPayments: 515000, pendingPayments: 18000, failedPayments: 7000 },
    overall: { totalRevenue: 640000, successfulPayments: 215000, pendingPayments: 28000, failedPayments: 4000 },

  },
  2: {
    month: { totalRevenue: 32000, successfulPayments: 30000, pendingPayments: 1500, failedPayments: 500 },
    quarter: { totalRevenue: 96000, successfulPayments: 91000, pendingPayments: 3500, failedPayments: 1500 },
    year: { totalRevenue: 384000, successfulPayments: 365000, pendingPayments: 12000, failedPayments: 7000 },
    overall: { totalRevenue: 984000, successfulPayments: 165000, pendingPayments: 42000, failedPayments: 9000 },
  },
}

export const studioStatsData = {
  1: { members: 120, trainers: 8, classes: 15, leads: 4, contracts: 6 },
  2: { members: 85, trainers: 5, classes: 10, leads: 4, contracts: 6 },
}

export const FranchiseData = [
  {
    id: 1,
    name: "FitChain Franchise Group",
    email: "info@fitchain.com",
    phone: "+49123456789",
    street: "Franchise Straße 1",
    zipCode: "10115",
    city: "Berlin",
    website: "www.fitchain.com",
    about: "Leading fitness franchise with multiple studio locations across Germany.",
    ownerName: "Klaus Weber",
    ownerFirstName: "Klaus",
    ownerLastName: "Weber",
    taxId: "DE111222333",
    loginEmail: "admin@fitchain.com",
    loginPassword: "franchise123",
    createdDate: "2023-01-15",
    studioCount: 2,
    img: FranchiseImage
  }
];


export const financialData = {
  "This Month": {
    totalRevenue: 12500,
    pendingPayments: 1800,
    failedPayments: 750,
    successfulPayments: 9950,
    transactions: [
      {
        id: "tx-001",
        memberName: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-003",
        memberName: "Bob Johnson",
        date: "2023-05-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
      {
        id: "tx-004",
        memberName: "Alice Williams",
        date: "2023-05-10",
        amount: 300,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 200, description: "Premium membership with extra benefits" },
          { name: "Equipment Rental", cost: 50, description: "Specialized equipment rental" },
          { name: "Technical Support", cost: 50, description: "Dedicated technical support" },
        ],
      },
      {
        id: "tx-005",
        memberName: "Charlie Brown",
        date: "2023-05-08",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
    ],
  },
  "Last Month": {
    totalRevenue: 11800,
    pendingPayments: 1200,
    failedPayments: 600,
    successfulPayments: 10000,
    transactions: [
      {
        id: "tx-101",
        memberName: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-102",
        memberName: "Jane Smith",
        date: "2023-04-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-103",
        memberName: "Bob Johnson",
        date: "2023-04-12",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "Last 3 Months": {
    totalRevenue: 35400,
    pendingPayments: 3600,
    failedPayments: 1800,
    successfulPayments: 30000,
    transactions: [
      {
        id: "tx-201",
        memberName: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-202",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-203",
        memberName: "Bob Johnson",
        date: "2023-01-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "Last 6 Months": {
    totalRevenue: 70800,
    pendingPayments: 7200,
    failedPayments: 3600,
    successfulPayments: 60000,
    transactions: [
      {
        id: "tx-301",
        memberName: "John Doe",
        date: "2022-12-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-302",
        memberName: "Jane Smith",
        date: "2022-11-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-303",
        memberName: "Bob Johnson",
        date: "2022-10-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "This Year": {
    totalRevenue: 141600,
    pendingPayments: 14400,
    failedPayments: 7200,
    successfulPayments: 120000,
    transactions: [
      {
        id: "tx-401",
        memberName: "John Doe",
        date: "2023-01-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-402",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-403",
        memberName: "Bob Johnson",
        date: "2023-03-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  Overall: {
    totalRevenue: 284100,
    pendingPayments: 28800,
    failedPayments: 14400,
    successfulPayments: 240900,
    transactions: [
      // Combined transactions from all periods
      {
        id: "tx-001",
        memberName: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-101",
        memberName: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-201",
        memberName: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
    ],
  },
}


export const appointmentsData = [
  {
    id: 1,
    name: "Yolanda",
    time: "09:00 - 09:30",
    date: "Mon | 07-02-2025",
    color: "bg-[#4169E1]",
    startTime: "09:00",
    endTime: "09:30",
    type: "Strength Training",
    specialNote: { text: "Prefers morning sessions", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: true,
  },
  {
    id: 2,
    name: "Denis",
    time: "09:00 - 09:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "09:00",
    endTime: "09:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 3,
    name: "Nicole",
    time: "09:00 - 09:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "09:00",
    endTime: "09:30",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 4,
    name: "Melanie",
    time: "09:00 - 09:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#8b5cf6]",
    startTime: "09:00",
    endTime: "09:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 5,
    name: "Angela",
    time: "09:30 - 10:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#ef4444]",
    startTime: "09:30",
    endTime: "10:00",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 6,
    name: "Kristina",
    time: "09:30 - 10:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#06b6d4]",
    startTime: "09:30",
    endTime: "10:00",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 7,
    name: "Melanie",
    time: "10:00 - 10:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f59e0b]",
    startTime: "10:00",
    endTime: "10:30",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 8,
    name: "Annett",
    time: "10:00 - 10:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#10b981]",
    startTime: "10:00",
    endTime: "10:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 9,
    name: "Justin",
    time: "10:00 - 10:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "10:00",
    endTime: "10:30",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 10,
    name: "Michel",
    time: "10:00 - 10:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "10:00",
    endTime: "10:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 11,
    name: "Colin",
    time: "11:30 - 12:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "11:30",
    endTime: "12:00",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 12,
    name: "Yvonne",
    time: "11:30 - 12:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#06b6d4]",
    startTime: "11:30",
    endTime: "12:00",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 13,
    name: "Jennifer",
    time: "12:00 - 12:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#ef4444]",
    startTime: "12:00",
    endTime: "12:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 14,
    name: "Michael",
    time: "12:00 - 12:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#8b5cf6]",
    startTime: "12:00",
    endTime: "12:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 15,
    name: "Furkan",
    time: "13:00 - 13:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "13:00",
    endTime: "13:30",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 16,
    name: "Heike",
    time: "12:30 - 13:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "12:30",
    endTime: "13:00",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 17,
    name: "Sandy",
    time: "12:30 - 13:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#f59e0b]",
    startTime: "12:30",
    endTime: "13:00",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 18,
    name: "Ann-Kathrin",
    time: "13:00 - 13:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "13:00",
    endTime: "13:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 19,
    name: "Katharina",
    time: "13:00 - 14:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#06b6d4]",
    startTime: "13:00",
    endTime: "14:00",
    type: "Probetraining",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: true,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 20,
    name: "Joanna",
    time: "14:00 - 14:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "14:00",
    endTime: "14:30",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 21,
    name: "Iris",
    time: "14:00 - 14:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f59e0b]",
    startTime: "14:00",
    endTime: "14:30",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 22,
    name: "Jürgen",
    time: "14:00 - 14:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "14:00",
    endTime: "14:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 23,
    name: "Corinna",
    time: "14:30 - 15:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "14:30",
    endTime: "15:00",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 24,
    name: "Anzi",
    time: "14:30 - 15:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "14:30",
    endTime: "15:00",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 25,
    name: "Gabriela",
    time: "15:00 - 15:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "15:00",
    endTime: "15:30",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 26,
    name: "Stefanie",
    time: "15:00 - 15:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "15:00",
    endTime: "15:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 27,
    name: "Gabriele",
    time: "15:00 - 15:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f59e0b]",
    startTime: "15:00",
    endTime: "15:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 28,
    name: "Aylin",
    time: "15:30 - 16:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "15:30",
    endTime: "16:00",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 29,
    name: "Conrad",
    time: "15:30 - 16:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#8b5cf6]",
    startTime: "15:30",
    endTime: "16:00",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 30,
    name: "Michael",
    time: "16:00 - 16:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "16:00",
    endTime: "16:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 31,
    name: "Ralf",
    time: "16:00 - 16:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "16:00",
    endTime: "16:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 32,
    name: "Sarah",
    time: "16:30 - 17:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "16:30",
    endTime: "17:00",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 33,
    name: "Sabrina",
    time: "16:30 - 17:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "16:30",
    endTime: "17:00",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 34,
    name: "Nadine",
    time: "17:00 - 17:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#8b5cf6]",
    startTime: "17:00",
    endTime: "17:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 35,
    name: "Jana",
    time: "17:00 - 17:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "17:00",
    endTime: "17:30",
    type: "Cardio",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 36,
    name: "Andreas",
    time: "17:00 - 17:30",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "17:00",
    endTime: "17:30",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 37,
    name: "Nicole",
    time: "17:30 - 18:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#22c55e]",
    startTime: "17:30",
    endTime: "18:00",
    type: "Yoga",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 38,
    name: "Irene",
    time: "17:30 - 18:00",
    date: "Mon | 03-02-2025",
    color: "bg-[#f97316]",
    startTime: "17:30",
    endTime: "18:00",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 39,
    name: "Past User 1",
    time: "08:00 - 08:30",
    date: "Sun | 02-02-2025", // Example past date
    color: "bg-[#4169E1]",
    startTime: "08:00",
    endTime: "08:30",
    type: "Strength Training",
    specialNote: { text: "Completed session", startDate: null, endDate: null, isImportant: false },
    status: "completed",
    isTrial: false,
    isCancelled: false,
    isPast: true, // Marked as past
  },
  {
    id: 40,
    name: "Past User 2",
    time: "09:00 - 09:30",
    date: "Sun | 02-02-2025", // Example past date
    color: "bg-[#22c55e]",
    startTime: "09:00",
    endTime: "09:30",
    type: "Cardio",
    specialNote: { text: "Completed session", startDate: null, endDate: null, isImportant: false },
    status: "completed",
    isTrial: false,
    isCancelled: false,
    isPast: true, // Marked as past
  },
  {
    id: 41,
    name: "Cancelled User 1",
    time: "10:00 - 10:30",
    date: "Mon | 03-02-2025", // Example current/future date for cancellation
    color: "bg-[#f97316]",
    startTime: "10:00",
    endTime: "10:30",
    type: "Yoga",
    specialNote: { text: "Client cancelled due to illness", startDate: null, endDate: null, isImportant: true },
    status: "cancelled",
    isTrial: false,
    isCancelled: true, // Marked as cancelled
    isPast: false,
  },
  {
    id: 42,
    name: "Cancelled User 2",
    time: "11:00 - 11:30",
    date: "Tue | 04-02-2025", // Example current/future date for cancellation
    color: "bg-[#8b5cf6]",
    startTime: "11:00",
    endTime: "11:30",
    type: "Personal Training",
    specialNote: { text: "Trainer unavailable", startDate: null, endDate: null, isImportant: true },
    status: "cancelled",
    isTrial: false,
    isCancelled: true, // Marked as cancelled
    isPast: false,
  },
  {
    id: 43,
    name: "Blocked Slot",
    time: "14:00 - 15:00",
    date: "Wed | 05-02-2025",
    color: "bg-[#FF4D4F]", // Red color for blocked slots
    startTime: "14:00",
    endTime: "15:00",
    type: "Blocked Time",
    specialNote: { text: "Facility maintenance", startDate: null, endDate: null, isImportant: true },
    status: "blocked",
    isTrial: false,
    isCancelled: false,
    isPast: false,
    isBlocked: true, // Explicitly mark as blocked
  },
  // New future appointments to ensure more colorful events are visible by default
  {
    id: 44,
    name: "Alice",
    time: "09:00 - 09:45",
    date: "Mon | 08-05-2025",
    color: "bg-[#3F74FF]",
    startTime: "09:00",
    endTime: "09:45",
    type: "Cardio",
    specialNote: { text: "First session with new trainer", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 45,
    name: "Bob",
    time: "10:00 - 11:00",
    date: "Tue | 08-06-2025",
    color: "bg-[#FF843E]",
    startTime: "10:00",
    endTime: "11:00",
    type: "Strength Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 46,
    name: "Charlie",
    time: "11:30 - 12:30",
    date: "Wed | 08-07-2025",
    color: "bg-[#50C878]",
    startTime: "11:30",
    endTime: "12:30",
    type: "Yoga",
    specialNote: { text: "Advanced poses focus", startDate: null, endDate: null, isImportant: true },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 47,
    name: "Diana",
    time: "14:00 - 14:30",
    date: "Thu | 08-08-2025",
    color: "bg-[#8b5cf6]",
    startTime: "14:00",
    endTime: "14:30",
    type: "Personal Training",
    specialNote: { text: "", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 48,
    name: "Eve",
    time: "15:00 - 15:30",
    date: "Fri | 08-09-2025",
    color: "bg-[#06b6d4]",
    startTime: "15:00",
    endTime: "15:30",
    type: "Cardio",
    specialNote: { text: "Treadmill interval training", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 49,
    name: "Frank",
    time: "16:00 - 17:00",
    date: "Mon | 08-12-2025",
    color: "bg-[#f59e0b]",
    startTime: "16:00",
    endTime: "17:00",
    type: "Strength Training",
    specialNote: { text: "Upper body focus", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
  {
    id: 50,
    name: "Grace",
    time: "17:30 - 18:30",
    date: "Tue | 08-13-2025",
    color: "bg-[#ef4444]",
    startTime: "17:30",
    endTime: "18:30",
    type: "Yoga",
    specialNote: { text: "Restorative yoga", startDate: null, endDate: null, isImportant: false },
    status: "pending",
    isTrial: false,
    isCancelled: false,
    isPast: false,
  },
]

export const membersData = [
  {
    id: 1,
    firstName: "Yolanda",
    lastName: "Martinez",
    title: "Yolanda",
    email: "yolanda@example.com",
    phone: "+1234567890",
    street: "123 Main St",
    zipCode: "12345",
    city: "New York",
    image: null,
    isActive: true,
    note: "Prefers morning sessions",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1990-05-15",
    about: "Fitness enthusiast with a passion for strength training.",
    joinDate: "2022-03-01",
    contractStart: "2022-03-01",
    contractEnd: "2025-03-01",
  },
  {
    id: 2,
    firstName: "Denis",
    lastName: "Johnson",
    title: "Denis",
    email: "denis@example.com",
    phone: "+1234567891",
    street: "456 Oak St",
    zipCode: "67890",
    city: "Los Angeles",
    image: null,
    isActive: true,
    note: "Loves cardio workouts",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1985-08-22",
    about: "Marathon runner and cardio specialist.",
    joinDate: "2021-11-15",
    contractStart: "2021-11-15",
    contractEnd: "2025-04-15",
  },
  {
    id: 3,
    firstName: "Nicole",
    lastName: "Smith",
    title: "Nicole",
    email: "nicole@example.com",
    phone: "+1234567892",
    street: "789 Pine St",
    zipCode: "54321",
    city: "Chicago",
    image: null,
    isActive: true,
    note: "Yoga instructor background",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1992-03-10",
    about: "Certified yoga instructor with 5 years experience.",
    joinDate: "2022-01-01",
    contractStart: "2022-01-01",
    contractEnd: "2025-01-01",
  },
  {
    id: 4,
    firstName: "Melanie",
    lastName: "Brown",
    title: "Melanie",
    email: "melanie@example.com",
    phone: "+1234567893",
    street: "321 Elm St",
    zipCode: "98765",
    city: "Miami",
    image: null,
    isActive: true,
    note: "Personal training focused",
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
    firstName: "Angela",
    lastName: "Davis",
    title: "Angela",
    email: "angela@example.com",
    phone: "+1234567894",
    street: "654 Maple Ave",
    zipCode: "13579",
    city: "Seattle",
    image: null,
    isActive: true,
    note: "Strength training enthusiast",
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
    id: 6,
    firstName: "Kristina",
    lastName: "Wilson",
    title: "Kristina",
    email: "kristina@example.com",
    phone: "+1234567895",
    street: "987 Cedar Rd",
    zipCode: "24680",
    city: "Denver",
    image: null,
    isActive: true,
    note: "Cardio specialist",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1989-04-18",
    about: "Cardio enthusiast and fitness model.",
    joinDate: "2022-04-01",
    contractStart: "2022-04-01",
    contractEnd: "2025-04-01",
  },
  {
    id: 7,
    firstName: "Annett",
    lastName: "Taylor",
    title: "Annett",
    email: "annett@example.com",
    phone: "+1234567896",
    street: "147 Birch St",
    zipCode: "36912",
    city: "Boston",
    image: null,
    isActive: true,
    note: "Personal training focused",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1987-09-30",
    about: "Personal trainer with nutrition background.",
    joinDate: "2022-05-01",
    contractStart: "2022-05-01",
    contractEnd: "2025-05-01",
  },
  {
    id: 8,
    firstName: "Justin",
    lastName: "Miller",
    title: "Justin",
    email: "justin@example.com",
    phone: "+1234567897",
    street: "258 Spruce Ave",
    zipCode: "47103",
    city: "Phoenix",
    image: null,
    isActive: true,
    note: "Strength training focus",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1993-11-12",
    about: "Bodybuilder and strength athlete.",
    joinDate: "2022-07-01",
    contractStart: "2022-07-01",
    contractEnd: "2025-07-01",
  },
  {
    id: 9,
    firstName: "Michel",
    lastName: "Garcia",
    title: "Michel",
    email: "michel@example.com",
    phone: "+1234567898",
    street: "369 Willow Dr",
    zipCode: "58214",
    city: "Portland",
    image: null,
    isActive: true,
    note: "Cardio and endurance",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1986-02-28",
    about: "Endurance athlete and triathlete.",
    joinDate: "2022-08-01",
    contractStart: "2022-08-01",
    contractEnd: "2025-08-01",
  },
  {
    id: 10,
    firstName: "Colin",
    lastName: "Anderson",
    title: "Colin",
    email: "colin@example.com",
    phone: "+1234567899",
    street: "741 Poplar St",
    zipCode: "69325",
    city: "Austin",
    image: null,
    isActive: true,
    note: "Strength training specialist",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1990-06-14",
    about: "Powerlifting competitor and coach.",
    joinDate: "2022-09-01",
    contractStart: "2022-09-01",
    contractEnd: "2025-09-01",
  },
  {
    id: 11,
    firstName: "Yvonne",
    lastName: "Thomas",
    title: "Yvonne",
    email: "yvonne@example.com",
    phone: "+1234567800",
    street: "852 Ash Ave",
    zipCode: "70436",
    city: "Nashville",
    image: null,
    isActive: true,
    note: "Yoga and flexibility",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1984-10-07",
    about: "Yoga instructor and flexibility coach.",
    joinDate: "2022-10-01",
    contractStart: "2022-10-01",
    contractEnd: "2025-10-01",
  },
  {
    id: 12,
    firstName: "Jennifer",
    lastName: "Jackson",
    title: "Jennifer",
    email: "jennifer@example.com",
    phone: "+1234567801",
    street: "963 Hickory Rd",
    zipCode: "81547",
    city: "San Diego",
    image: null,
    isActive: true,
    note: "Personal training focus",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1991-01-20",
    about: "Certified personal trainer and nutritionist.",
    joinDate: "2022-11-01",
    contractStart: "2022-11-01",
    contractEnd: "2025-11-01",
  },
  {
    id: 13,
    firstName: "Michael",
    lastName: "White",
    title: "Michael",
    email: "michael@example.com",
    phone: "+1234567802",
    street: "174 Walnut St",
    zipCode: "92658",
    city: "Las Vegas",
    image: null,
    isActive: true,
    note: "Cardio enthusiast",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1987-05-03",
    about: "Marathon runner and cardio specialist.",
    joinDate: "2022-12-01",
    contractStart: "2022-12-01",
    contractEnd: "2025-12-01",
  },
  {
    id: 14,
    firstName: "Furkan",
    lastName: "Ozkan",
    title: "Furkan",
    email: "furkan@example.com",
    phone: "+1234567803",
    street: "285 Cherry Ave",
    zipCode: "03769",
    city: "Salt Lake City",
    image: null,
    isActive: true,
    note: "Strength training focus",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1994-08-16",
    about: "Bodybuilder and fitness enthusiast.",
    joinDate: "2023-01-01",
    contractStart: "2023-01-01",
    contractEnd: "2026-01-01",
  },
  {
    id: 15,
    firstName: "Heike",
    lastName: "Mueller",
    title: "Heike",
    email: "heike@example.com",
    phone: "+1234567804",
    street: "396 Peach Dr",
    zipCode: "14870",
    city: "Minneapolis",
    image: null,
    isActive: true,
    note: "Yoga specialist",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1983-12-29",
    about: "Advanced yoga practitioner and teacher.",
    joinDate: "2023-02-01",
    contractStart: "2023-02-01",
    contractEnd: "2026-02-01",
  }, // Add more members as needed for other appointment names
  {
    id: 16,
    firstName: "Sandy",
    lastName: "Rodriguez",
    title: "Sandy",
    email: "sandy@example.com",
    phone: "+1234567805",
    street: "507 Orange St",
    zipCode: "25981",
    city: "Tampa",
    image: null,
    isActive: true,
    note: "Personal training specialist",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1989-03-22",
    about: "Certified personal trainer with sports background.",
    joinDate: "2023-03-01",
    contractStart: "2023-03-01",
    contractEnd: "2026-03-01",
  },
  {
    id: 17,
    firstName: "Ann-Kathrin",
    lastName: "Schmidt",
    title: "Ann-Kathrin",
    email: "ann-kathrin@example.com",
    phone: "+1234567806",
    street: "618 Lemon Ave",
    zipCode: "36092",
    city: "Orlando",
    image: null,
    isActive: true,
    note: "Cardio and fitness",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1992-07-08",
    about: "Fitness instructor and cardio specialist.",
    joinDate: "2023-04-01",
    contractStart: "2023-04-01",
    contractEnd: "2026-04-01",
  },
  {
    id: 18,
    firstName: "Katharina",
    lastName: "Weber",
    title: "Katharina",
    email: "katharina@example.com",
    phone: "+1234567807",
    street: "729 Grape Dr",
    zipCode: "47103",
    city: "Jacksonville",
    image: null,
    isActive: true,
    note: "Trial training participant",
    noteStartDate: "2023-01-01",
    noteNoteEndDate: "2023-12-31",
    noteImportance: "important",
    dateOfBirth: "1995-11-15",
    about: "New member interested in comprehensive fitness program.",
    joinDate: "2023-05-01",
    contractStart: "2023-05-01",
    contractEnd: "2026-05-01",
  },
  // New members for the new future appointments
  {
    id: 19,
    firstName: "Alice",
    lastName: "Wonder",
    title: "Alice",
    email: "alice@example.com",
    phone: "+1234567808",
    street: "101 Wonderland Rd",
    zipCode: "10101",
    city: "Fairyland",
    image: null,
    isActive: true,
    note: "Loves morning workouts",
    noteStartDate: "2024-01-01",
    noteEndDate: "2025-12-31",
    noteImportance: "unimportant",
    dateOfBirth: "1998-01-01",
    about: "Enthusiastic about fitness and healthy living.",
    joinDate: "2024-01-01",
    contractStart: "2024-01-01",
    contractEnd: "2027-01-01",
  },
  {
    id: 20,
    firstName: "Bob",
    lastName: "Builder",
    title: "Bob",
    email: "bob@example.com",
    phone: "+1234567809",
    street: "202 Construction St",
    zipCode: "20202",
    city: "Buildville",
    image: null,
    isActive: true,
    note: "Focus on strength gains",
    noteStartDate: "2024-02-01",
    noteEndDate: "2026-02-28",
    noteImportance: "important",
    dateOfBirth: "1980-02-02",
    about: "Dedicated to building muscle and endurance.",
    joinDate: "2024-02-01",
    contractStart: "2024-02-01",
    contractEnd: "2027-02-01",
  },
  {
    id: 21,
    firstName: "Charlie",
    lastName: "Chaplin",
    title: "Charlie",
    email: "charlie@example.com",
    phone: "+1234567810",
    street: "303 Silent Film Ave",
    zipCode: "30303",
    city: "Hollywood",
    image: null,
    isActive: true,
    note: "Prefers evening yoga",
    noteStartDate: "2024-03-01",
    noteEndDate: "2025-03-31",
    noteImportance: "unimportant",
    dateOfBirth: "1995-03-03",
    about: "Enjoys flexibility and mindfulness through yoga.",
    joinDate: "2024-03-01",
    contractStart: "2024-03-01",
    contractEnd: "2027-03-01",
  },
  {
    id: 22,
    firstName: "Diana",
    lastName: "Prince",
    title: "Diana",
    email: "diana@example.com",
    phone: "+1234567811",
    street: "404 Amazonian Way",
    zipCode: "40404",
    city: "Themyscira",
    image: null,
    isActive: true,
    note: "Personal training for combat readiness",
    noteStartDate: "2024-04-01",
    noteEndDate: "2026-04-30",
    noteImportance: "important",
    dateOfBirth: "1984-04-04",
    about: "Seeking to maintain peak physical condition.",
    joinDate: "2024-04-01",
    contractStart: "2024-04-01",
    contractEnd: "2027-04-01",
  },
  {
    id: 23,
    firstName: "Eve",
    lastName: "Adams",
    title: "Eve",
    email: "eve@example.com",
    phone: "+1234567812",
    street: "505 Garden of Eden",
    zipCode: "50505",
    city: "Paradise",
    image: null,
    isActive: true,
    note: "Loves outdoor cardio",
    noteStartDate: "2024-05-01",
    noteEndDate: "2025-05-31",
    noteImportance: "unimportant",
    dateOfBirth: "1992-05-05",
    about: "Enjoys running and high-intensity cardio.",
    joinDate: "2024-05-01",
    contractStart: "2024-05-01",
    contractEnd: "2027-05-01",
  },
  {
    id: 24,
    firstName: "Frank",
    lastName: "Sinatra",
    title: "Frank",
    email: "frank@example.com",
    phone: "+1234567813",
    street: "606 Crooner's Lane",
    zipCode: "60606",
    city: "Las Vegas",
    image: null,
    isActive: true,
    note: "Strength training for stage presence",
    noteStartDate: "2024-06-01",
    noteEndDate: "2026-06-30",
    noteImportance: "important",
    dateOfBirth: "1970-06-06",
    about: "Keeping fit for performances.",
    joinDate: "2024-06-01",
    contractStart: "2024-06-01",
    contractEnd: "2027-06-01",
  },
  {
    id: 25,
    firstName: "Grace",
    lastName: "Kelly",
    title: "Grace",
    email: "grace@example.com",
    phone: "+1234567814",
    street: "707 Royal Palace",
    zipCode: "70707",
    city: "Monaco",
    image: null,
    isActive: true,
    note: "Gentle yoga for relaxation",
    noteStartDate: "2024-07-01",
    noteEndDate: "2025-07-31",
    noteImportance: "unimportant",
    dateOfBirth: "1988-07-07",
    about: "Seeks balance and tranquility through yoga.",
    joinDate: "2024-07-01",
    contractStart: "2024-07-01",
    contractEnd: "2027-07-01",
  },
]


export const studioHistoryMainData = {
  1: {
    general: [
      {
        id: 1,
        date: "2025-02-01",
        action: "Studio name updated",
        details: "Changed from 'Old Studio' to 'New Studio Elite'",
        user: "Admin",
      },
    ],
    contract: [
      {
        id: 1,
        date: "2025-01-18",
        action: "New Contract Signed",
        details: "3-year partnership renewal with vendor",
        user: "Legal Team",
      },
      {
        id: 2,
        date: "2025-02-10",
        action: "Contract Terminated",
        details: "Terminated contract with old cleaning service",
        user: "Admin",
      },
    ],
    finance: [
      {
        id: 1,
        date: "2025-01-10",
        type: "Expense",
        amount: "$500",
        description: "Equipment repair cost",
        status: "completed",
      },
      {
        id: 2,
        date: "2025-01-05",
        type: "Revenue",
        amount: "$1500",
        description: "Membership sales",
        status: "completed",
      },
    ],
    tickets: [
      {
        id: 1,
        date: "2025-01-12",
        title: "AC not cooling properly",
        description: "Reported by staff, resolved next day",
        status: "Resolved",
      },
      {
        id: 2,
        date: "2025-01-20",
        title: "Treadmill malfunction",
        description: "Motor issue under service warranty",
        status: "In Progress",
      },
    ],
  },
  2: {
    general: [],
    contract: [],
    finance: [],
    tickets: [],
  },
};

export const studioDataNew = [
  {
    id: 1,
    name: "Fitness for Life GmbH",
    email: "info@fitnessforlife.de",
    phone: "+49123456789",
    street: "Hauptstraße 123",
    zipCode: "10115",
    city: "Berlin",
    country: "DE",
    iban: "DE89 3704 0044 0532 0130 00",
    taxId: "DE123456789",
    image: StudioIcon,
    isActive: true,
    note: "Premium partner, VIP treatment",
    noteStartDate: "2023-01-01",
    noteEndDate: "2023-12-31",
    noteImportance: "important",
    website: "www.fitnessforlife.de",
    about: "Premium fitness studio with state-of-the-art equipment and certified trainers.",
    joinDate: "2022-03-01",
    contractStart: "2022-03-01",
    contractEnd: "2023-03-01",
    ownerName: "Hans Mueller",
    franchiseId: 1,

    // Studio Data (Corrected for ConfigurationPage)
    studioName: "Fitness for Life GmbH",
    studioOperator: "Hans Mueller",
    studioPhoneNo: "+49123456789",
    studioEmail: "info@fitnessforlife.de",
    studioStreet: "Hauptstraße 123",
    studioZipCode: "10115",
    studioCity: "Berlin",
    studioCountry: "DE",
    studioWebsite: "https://www.fitnessforlife.de",
    logoUrl: "",
    logo: [],

    // Opening Hours (Corrected - Array format)
    openingHours: [
      { day: "Monday", startTime: dayjs("06:00", "HH:mm"), endTime: dayjs("22:00", "HH:mm") },
      { day: "Tuesday", startTime: dayjs("06:00", "HH:mm"), endTime: dayjs("22:00", "HH:mm") },
      { day: "Wednesday", startTime: dayjs("06:00", "HH:mm"), endTime: dayjs("22:00", "HH:mm") },
      { day: "Thursday", startTime: dayjs("06:00", "HH:mm"), endTime: dayjs("22:00", "HH:mm") },
      { day: "Friday", startTime: dayjs("06:00", "HH:mm"), endTime: dayjs("22:00", "HH:mm") },
      { day: "Saturday", startTime: dayjs("08:00", "HH:mm"), endTime: dayjs("20:00", "HH:mm") },
      { day: "Sunday", startTime: dayjs("10:00", "HH:mm"), endTime: dayjs("18:00", "HH:mm") }
    ],

    // Closing Days (Array format)
    closingDays: [
      { date: dayjs("2024-12-25"), description: "Christmas Day" },
      { date: dayjs("2025-01-01"), description: "New Year's Day" }
    ],

    // Public Holidays (for import functionality)
    publicHolidays: [
      { date: "2024-12-25", name: "Christmas Day" },
      { date: "2025-01-01", name: "New Year's Day" }
    ],

    // Resources
    maxCapacity: 15,

    // Appointment Types (Array format)
    appointmentTypes: [
      {
        name: "Personal Training",
        duration: 60,
        capacity: 1,
        color: "#FF843E",
        interval: 30,
        images: []
      },
      {
        name: "Group Fitness",
        duration: 45,
        capacity: 12,
        color: "#3F74FF",
        interval: 15,
        images: []
      },
      {
        name: "Yoga Class",
        duration: 60,
        capacity: 8,
        color: "#10B981",
        interval: 30,
        images: []
      }
    ],

    // Trial Training (Object format)
    trialTraining: {
      duration: 60,
      capacity: 1,
      color: "#1890ff"
    },

    // Staff Management
    // Updated roles section using the PERMISSION_GROUPS format
    roles: [
      {
        name: "Manager",
        permissions: [
          // Appointments
          "appointments.view",
          "appointments.create",
          "appointments.edit",
          "appointments.cancel",
          "appointments.manage_contingent",

          // Communication
          "communication.view",
          "emails.send",
          "chat.member_send",
          "chat.studio_send",
          "broadcasts.send",
          "bulletin_board.view",
          "bulletin_board.posts_create",
          "bulletin_board.posts_edit",
          "bulletin_board.posts_delete",

          // Activity Monitor
          "activity_monitor.view",
          "activity_monitor.take_actions",

          // To-Do & Tags
          "todos.view",
          "todos.create",
          "todos.edit",
          "todos.delete",
          "tags.manage",

          // Notes
          "notes.view",
          "notes.personal_create",
          "notes.studio_create",
          "notes.studio_delete",

          // Members
          "members.view",
          "members.create",
          "members.edit",
          "members.history_view",
          "members.documents_manage",

          // Staff
          "staff.view",
          "staff.create",
          "staff.edit",
          "staff.history_view",
          "staff.vacation_calendar_view",
          "staff.planning_view",
          "staff.shifts_manage",

          // Leads
          "leads.view",
          "leads.create",
          "leads.edit",
          "leads.columns_edit",

          // Contracts
          "contracts.view",
          "contracts.create",
          "contracts.edit",
          "contracts.cancel",
          "contracts.view_details",
          "contracts.documents_manage",

          // Selling & Products
          "selling.view",
          "products.manage",
          "services.manage",
          "sales_journal.view",
          "sales_journal.take_actions",

          // Finances
          "finances.view",
          "payments.run",

          // Training
          "training.view",
          "training_plans.create",
          "training_plans.assign",

          // Analytics
          "analytics.view",
          "analytics.finance_view",
          "analytics.members_view",
          "analytics.leads_view",
          "analytics.appointments_view",

          // Configuration
          "profile.edit_own",
          "studio.config_manage",
          "appointments.config_manage",
          "staff.config_manage",
          "leads.sources_manage",
          "contracts.config_manage",
          "documents.config_manage",
          "communication.config_manage",
          "finance.config_manage",
          "appearance.manage"
        ],
        color: "#FF843E",
        defaultVacationDays: 25
      },
      {
        name: "Trainer",
        permissions: [
          // Appointments
          "appointments.view",
          "appointments.create",
          "appointments.edit",
          "appointments.cancel",

          // Communication
          "communication.view",
          "chat.member_send",
          "bulletin_board.view",

          // To-Do & Tags
          "todos.view",
          "todos.create",
          "todos.edit",

          // Notes
          "notes.view",
          "notes.personal_create",
          "notes.studio_create",

          // Members
          "members.view",
          "members.history_view",

          // Staff - Limited
          "staff.vacation_calendar_view",
          "staff.planning_view",

          // Leads
          "leads.view",

          // Contracts
          "contracts.view",

          // Selling & Products
          "selling.view",

          // Training
          "training.view",
          "training_plans.assign",

          // Analytics - Limited
          "analytics.members_view",
          "analytics.appointments_view",

          // Configuration - Limited
          "profile.edit_own"
        ],
        color: "#3F74FF",
        defaultVacationDays: 20
      },
      {
        name: "Reception",
        permissions: [
          // Appointments
          "appointments.view",
          "appointments.create",
          "appointments.edit",
          "appointments.cancel",

          // Communication
          "communication.view",
          "chat.member_send",
          "bulletin_board.view",

          // To-Do & Tags
          "todos.view",
          "todos.create",

          // Notes
          "notes.view",
          "notes.personal_create",

          // Members
          "members.view",
          "members.create",
          "members.edit",

          // Leads
          "leads.view",
          "leads.create",

          // Contracts
          "contracts.view",

          // Selling & Products
          "selling.view",

          // Configuration - Limited
          "profile.edit_own"
        ],
        color: "#10B981",
        defaultVacationDays: 20
      },
      {
        name: "Read Only",
        permissions: [
          // View only permissions across most modules
          "appointments.view",
          "communication.view",
          "activity_monitor.view",
          "todos.view",
          "notes.view",
          "members.view",
          "staff.view",
          "leads.view",
          "contracts.view",
          "selling.view",
          "training.view",
          "analytics.view",
          "profile.edit_own"
        ],
        color: "#6B7280",
        defaultVacationDays: 20
      }
    ],
    defaultVacationDays: 20,

    // Member Management
    allowMemberQRCheckIn: true,
    memberQRCodeUrl: "https://fitnessforlife.de/checkin/qr123",

    // Lead Sources (Array format)
    leadSources: [
      { id: 1, name: "Website", color: "#3F74FF" },
      { id: 2, name: "Referral", color: "#10B981" },
      { id: 3, name: "Social Media", color: "#FF843E" },
      { id: 4, name: "Walk-in", color: "#8B5CF6" }
    ],

    // Tags (Array format)
    tags: [
      { name: "VIP", color: "#FF843E" },
      { name: "New", color: "#3F74FF" },
      { name: "Renewal", color: "#10B981" }
    ],

    // Contracts
    contractTypes: [
      {
        name: "Premium Membership",
        duration: 12,
        cost: 89.99,
        billingPeriod: "monthly",
        userCapacity: 8,
        autoRenewal: true,
        renewalPeriod: 12,
        renewalPrice: 79.99,
        cancellationPeriod: 30
      },
      {
        name: "Basic Membership",
        duration: 6,
        cost: 59.99,
        billingPeriod: "monthly",
        userCapacity: 4,
        autoRenewal: false,
        renewalPeriod: 6,
        renewalPrice: 54.99,
        cancellationPeriod: 30
      }
    ],

    // Contract Pause Reasons (Array format)
    contractPauseReasons: [
      { name: "Vacation", maxDays: 30 },
      { name: "Medical", maxDays: 90 },
      { name: "Business Trip", maxDays: 21 }
    ],

    noticePeriod: 30,
    extensionPeriod: 12,
    allowMemberSelfCancellation: true,

    // Settings (Structured for ConfigurationPage)
    settings: {
      // General Communication
      autoArchiveDuration: 30,

      // Notification Settings
      notificationSubTab: "email",
      emailNotificationEnabled: true,
      appNotificationEnabled: true,

      // Birthday Messages
      birthdayMessageEnabled: true,
      birthdayMessageTemplate: "Happy Birthday, {Member_First_Name} {Member_Last_Name}! Best wishes from {Studio_Name}!",
      birthdayAppNotificationEnabled: true,

      // Appointment Notifications
      appointmentNotificationEnabled: true,
      appointmentAppNotificationEnabled: true,

      // Email Notifications
      appConfirmationEnabled: true,
      appCancellationEnabled: true,
      appRescheduledEnabled: true,
      appReminderEnabled: true,

      // Appointment Notification Types
      appointmentNotificationTypes: {
        confirmation: {
          enabled: true,
          template: "Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been booked for {Booked_Time}.",
          sendApp: true,
          sendEmail: true,
          hoursBefore: 24
        },
        cancellation: {
          enabled: true,
          template: "Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} scheduled for {Booked_Time} has been cancelled.",
          sendApp: true,
          sendEmail: true,
          hoursBefore: 24
        },
        rescheduled: {
          enabled: true,
          template: "Hello {Member_First_Name} {Member_Last_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}.",
          sendApp: true,
          sendEmail: true,
          hoursBefore: 24
        },
        reminder: {
          enabled: true,
          template: "Hello {Member_First_Name} {Member_Last_Name}, this is a reminder for your {Appointment_Type} at {Booked_Time}.",
          sendApp: true,
          sendEmail: true,
          hoursBefore: 24
        }
      },

      // SMTP Configuration
      smtpHost: "smtp.fitnessforlife.de",
      smtpPort: 587,
      smtpUser: "noreply@fitnessforlife.de",
      smtpPass: "encrypted_password",

      // Email Signature
      emailSignature: "Best regards,\n{Studio_Name} Team"
    },

    // Email Configuration (for backward compatibility)
    emailConfig: {
      smtpServer: "smtp.fitnessforlife.de",
      smtpPort: 587,
      emailAddress: "noreply@fitnessforlife.de",
      password: "encrypted_password",
      useSSL: false,
      senderName: "Fitness for Life",
      smtpUser: "noreply@fitnessforlife.de",
      smtpPass: "encrypted_password"
    },

    // Finances
    currency: "€",

    // VAT Rates (Array format)
    vatRates: [
      { name: "Standard", percentage: 19, description: "Standard VAT rate for services" },
      { name: "Reduced", percentage: 7, description: "Reduced VAT rate for essential goods" }
    ],

    vatNumber: "DE123456789",
    bankName: "Deutsche Bank",
    creditorId: "DE98ZZZ09999999999",

    // Appearance
    appearance: {
      theme: "dark",
      primaryColor: "#FF843E",
      secondaryColor: "#3F74FF",
      allowStaffThemeToggle: true,
      allowMemberThemeToggle: false
    },

    // Additional Documents
    additionalDocs: [
      "terms_and_conditions.pdf",
      "privacy_policy.pdf",
      "health_declaration_form.pdf"
    ],

    // ========== ADMIN CONFIGURATION DATA ==========

    // Legal Information for Admin Panel
    imprint: "<h1>Fitness for Life GmbH</h1><p>Hauptstraße 123<br>10115 Berlin<br>Germany</p><p><strong>Managing Director:</strong> Hans Mueller</p><p><strong>Commercial Register:</strong> Amtsgericht Berlin Charlottenburg, HRB 123456</p><p><strong>VAT ID:</strong> DE123456789</p>",

    privacyPolicy: "<h1>Privacy Policy</h1><p>We take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.</p><h2>Data Collection</h2><p>We collect and process personal data only to the extent necessary for the fulfillment of contracts and legal obligations.</p>",

    termsAndConditions: "<h1>Terms and Conditions</h1><p><strong>§1 General</strong></p><p>These terms and conditions govern the contractual relationship between Fitness for Life GmbH and its members.</p><p><strong>§2 Membership</strong></p><p>Membership begins on the date of contract conclusion and runs for the agreed minimum term.</p>",

    // Changelog for Admin Panel
    changelog: [
      {
        version: "2.1.0",
        date: dayjs("2024-01-15"),
        color: "#10B981",
        content: "<h3>New Features</h3><ul><li>Added advanced reporting dashboard</li><li>Integrated new payment gateway</li><li>Enhanced mobile app performance</li></ul>"
      },
      {
        version: "2.0.5",
        date: dayjs("2023-11-20"),
        color: "#3B82F6",
        content: "<h3>Improvements</h3><ul><li>Optimized database queries</li><li>Improved email template system</li><li>Enhanced security features</li></ul>"
      },
      {
        version: "2.0.0",
        date: dayjs("2023-09-01"),
        color: "#FF843E",
        content: "<h3>Major Release</h3><ul><li>Complete UI redesign</li><li>New appointment scheduling system</li><li>Advanced member management</li></ul>"
      }
    ],

    // Demo Access Email Settings
    demoEmailSettings: {
      subject: "Demo Access to Fitness for Life Management System",
      content: "<p>Dear {Recipient_Name},</p><p>You have been granted demo access to our Fitness for Life management system.</p><p><strong>Access Link:</strong> {Link}</p><p>This demo access will expire on {Expiry_Date}.</p><p>Best regards,<br>Fitness for Life Team</p>",
      expiryDays: 7
    },

    // Email Signature Settings
    emailSignatureSettings: {
      autoAppend: true,
      includeInReplies: true,
      useHTML: true
    }
  },
  {
    id: 2,
    name: "PowerGym AG",
    email: "contact@powergym.com",
    phone: "+49987654321",
    street: "Friedrichstraße 45",
    zipCode: "20354",
    city: "Hamburg",
    country: "DE",
    image: StudioIcon,

    // Studio Data
    studioName: "PowerGym AG",
    studioOperator: "Maria Schmidt",
    studioPhoneNo: "+49987654321",
    studioEmail: "contact@powergym.com",
    studioStreet: "Friedrichstraße 45",
    studioZipCode: "20354",
    studioCity: "Hamburg",
    studioCountry: "DE",
    studioWebsite: "https://www.powergym.com",
    logoUrl: "",
    logo: [],

    // Opening Hours (Array format)
    openingHours: [
      { day: "Monday", startTime: dayjs("05:00", "HH:mm"), endTime: dayjs("23:00", "HH:mm") },
      { day: "Tuesday", startTime: dayjs("05:00", "HH:mm"), endTime: dayjs("23:00", "HH:mm") },
      { day: "Wednesday", startTime: dayjs("05:00", "HH:mm"), endTime: dayjs("23:00", "HH:mm") },
      { day: "Thursday", startTime: dayjs("05:00", "HH:mm"), endTime: dayjs("23:00", "HH:mm") },
      { day: "Friday", startTime: dayjs("05:00", "HH:mm"), endTime: dayjs("23:00", "HH:mm") },
      { day: "Saturday", startTime: dayjs("07:00", "HH:mm"), endTime: dayjs("21:00", "HH:mm") },
      { day: "Sunday", startTime: dayjs("09:00", "HH:mm"), endTime: dayjs("19:00", "HH:mm") }
    ],

    // Closing Days
    closingDays: [
      { date: dayjs("2024-04-21"), description: "Easter Sunday" },
      { date: dayjs("2024-12-25"), description: "Christmas Day" }
    ],

    // Resources
    maxCapacity: 20,

    // Appointment Types
    appointmentTypes: [
      {
        name: "Strength Training",
        duration: 90,
        capacity: 1,
        color: "#DC2626",
        interval: 30,
        images: []
      },
      {
        name: "Bodybuilding Class",
        duration: 60,
        capacity: 15,
        color: "#7C3AED",
        interval: 15,
        images: []
      }
    ],

    trialTraining: {
      duration: 45,
      capacity: 1,
      color: "#1890ff"
    },

    // Staff Management
    roles: [
      {
        name: "Head Coach",
        permissions: ["read", "write", "delete"],
        color: "#DC2626",
        defaultVacationDays: 25
      },
      {
        name: "Assistant Coach",
        permissions: ["read", "write"],
        color: "#7C3AED",
        defaultVacationDays: 20
      }
    ],
    defaultVacationDays: 20,

    // Member Management
    allowMemberQRCheckIn: false,
    memberQRCodeUrl: "",

    // Lead Sources
    leadSources: [
      { id: 1, name: "Website", color: "#DC2626" },
      { id: 2, name: "Referral", color: "#7C3AED" }
    ],

    // Tags
    tags: [
      { name: "Bodybuilding", color: "#DC2626" },
      { name: "Strength", color: "#7C3AED" }
    ],

    // Contracts
    contractTypes: [
      {
        name: "Pro Bodybuilding",
        duration: 12,
        cost: 129.99,
        billingPeriod: "monthly",
        userCapacity: 12,
        autoRenewal: true,
        renewalPeriod: 12,
        renewalPrice: 119.99,
        cancellationPeriod: 60
      }
    ],

    contractPauseReasons: [
      { name: "Vacation", maxDays: 30 },
      { name: "Medical", maxDays: 90 }
    ],

    noticePeriod: 60,
    extensionPeriod: 12,
    allowMemberSelfCancellation: false,

    // Settings
    settings: {
      autoArchiveDuration: 45,
      notificationSubTab: "email",
      emailNotificationEnabled: true,
      appNotificationEnabled: false,
      birthdayMessageEnabled: false,
      birthdayMessageTemplate: "",
      birthdayAppNotificationEnabled: false,
      appointmentNotificationEnabled: true,
      appointmentAppNotificationEnabled: false,
      appointmentNotificationTypes: {
        confirmation: {
          enabled: true,
          template: "Your strength training session is confirmed for {Booked_Time}.",
          sendApp: false,
          sendEmail: true,
          hoursBefore: 24
        },
        cancellation: {
          enabled: false,
          template: "",
          sendApp: false,
          sendEmail: false,
          hoursBefore: 24
        },
        rescheduled: {
          enabled: false,
          template: "",
          sendApp: false,
          sendEmail: false,
          hoursBefore: 24
        },
        reminder: {
          enabled: false,
          template: "",
          sendApp: false,
          sendEmail: false,
          hoursBefore: 24
        }
      },
      smtpHost: "smtp.powergym.com",
      smtpPort: 587,
      smtpUser: "info@powergym.com",
      smtpPass: "encrypted_password",
      emailSignature: "Best regards,\nPowerGym Team"
    },

    // Finances
    currency: "€",
    vatRates: [
      { name: "Standard", percentage: 19, description: "Standard VAT rate" }
    ],

    // Appearance
    appearance: {
      theme: "dark",
      primaryColor: "#DC2626",
      secondaryColor: "#7C3AED",
      allowStaffThemeToggle: false,
      allowMemberThemeToggle: false
    },

    // ========== ADMIN CONFIGURATION DATA ==========

    // Legal Information for Admin Panel
    imprint: "<h1>PowerGym AG</h1><p>Friedrichstraße 45<br>20354 Hamburg<br>Germany</p><p><strong>CEO:</strong> Maria Schmidt</p><p><strong>Commercial Register:</strong> Amtsgericht Hamburg, HRB 98765</p><p><strong>VAT ID:</strong> DE987654321</p>",

    privacyPolicy: "<h1>Privacy Policy</h1><p>At PowerGym, we are committed to protecting your privacy and ensuring the security of your personal information.</p><h2>Information We Collect</h2><p>We collect information that you provide directly to us when you register for our services, including your name, email address, and fitness goals.</p>",

    termsAndConditions: "<h1>Terms and Conditions</h1><p><strong>1. Membership Agreement</strong></p><p>By signing up for PowerGym services, you agree to abide by these terms and conditions.</p><p><strong>2. Payment Terms</strong></p><p>All membership fees are due monthly in advance.</p>",

    // Changelog for Admin Panel
    changelog: [
      {
        version: "1.8.2",
        date: dayjs("2024-02-10"),
        color: "#DC2626",
        content: "<h3>Bug Fixes</h3><ul><li>Fixed payment processing issues</li><li>Resolved calendar synchronization problems</li><li>Fixed member import functionality</li></ul>"
      },
      {
        version: "1.8.0",
        date: dayjs("2024-01-05"),
        color: "#7C3AED",
        content: "<h3>New Features</h3><ul><li>Added advanced analytics</li><li>Integrated with fitness tracking apps</li><li>Enhanced staff management tools</li></ul>"
      }
    ],

    // Demo Access Email Settings
    demoEmailSettings: {
      subject: "PowerGym Management System Demo Access",
      content: "<p>Hello {Recipient_Name},</p><p>Welcome to PowerGym! You now have demo access to our management system.</p><p><strong>Demo Link:</strong> {Link}</p><p>This access is valid until {Expiry_Date}.</p><p>Strength & Success,<br>PowerGym Team</p>",
      expiryDays: 5
    },

    // Email Signature Settings
    emailSignatureSettings: {
      autoAppend: false,
      includeInReplies: false,
      useHTML: false
    }
  }
];


export const studiomemberHistoryNew = {
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
  3: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  4: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  5: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  100: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
};

export const studioappointmentsMainData = [
  {
    id: 1,
    title: "Initial Consultation",
    date: "2025-03-15T10:00",
    status: "upcoming",
    type: "Consultation",
    memberId: 1,
    specialNote: {
      text: "First time client, needs introduction to equipment",
      isImportant: true,
      startDate: "2025-03-15",
      endDate: "2025-03-20",
    },
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
]

export const studioappointmentTypeMainData = [
  { name: "Consultation", duration: 30, color: "bg-blue-700" },
  { name: "Follow-up", duration: 45, color: "bg-green-700" },
  { name: "Annual Review", duration: 60, color: "bg-purple-600" },
  { name: "Training", duration: 60, color: "bg-orange-600" },
  { name: "Assessment", duration: 90, color: "bg-red-600" },
]

export const studiofreeAppointmentsMainData = [
  { id: 1, date: "2025-03-15", time: "9:00 AM" },
  { id: 2, date: "2025-03-15", time: "11:00 AM" },
  { id: 3, date: "2025-03-15", time: "2:00 PM" },
  { id: 4, date: "2025-03-20", time: "10:00 AM" },
  { id: 5, date: "2025-03-20", time: "1:30 PM" },
  { id: 6, date: "2025-04-05", time: "9:30 AM" },
  { id: 7, date: "2025-04-05", time: "3:00 PM" },
]




export const studiostaffHistoryNew = {
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
  3: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  4: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  5: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
  100: { general: [], checkins: [], appointments: [], finance: [], contracts: [] },
};

export const studioappointmentsStaffData = [
  {
    id: 1,
    title: "Initial Consultation",
    date: "2025-03-15T10:00",
    status: "upcoming",
    type: "Consultation",
    staffId: 1,
    specialNote: {
      text: "First time client, needs introduction to equipment",
      isImportant: true,
      startDate: "2025-03-15",
      endDate: "2025-03-20",
    },
  },
  {
    id: 2,
    title: "Follow-up Meeting",
    date: "2025-03-20T14:30",
    status: "upcoming",
    type: "Follow-up",
    staffId: 1,
  },
  {
    id: 3,
    title: "Annual Review",
    date: "2025-04-05T11:00",
    status: "upcoming",
    type: "Annual Review",
    staffId: 2,
  },
]

export const studioappointmentTypeStaffData = [
  { name: "Consultation", duration: 30, color: "bg-blue-700" },
  { name: "Follow-up", duration: 45, color: "bg-green-700" },
  { name: "Annual Review", duration: 60, color: "bg-purple-600" },
  { name: "Training", duration: 60, color: "bg-orange-600" },
  { name: "Assessment", duration: 90, color: "bg-red-600" },
]

export const studiofreeAppointmentsStaffData = [
  { id: 1, date: "2025-03-15", time: "9:00 AM" },
  { id: 2, date: "2025-03-15", time: "11:00 AM" },
  { id: 3, date: "2025-03-15", time: "2:00 PM" },
  { id: 4, date: "2025-03-20", time: "10:00 AM" },
  { id: 5, date: "2025-03-20", time: "1:30 PM" },
  { id: 6, date: "2025-04-05", time: "9:30 AM" },
  { id: 7, date: "2025-04-05", time: "3:00 PM" },
]


export const studioContractHistoryData = {
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

export const studioLeadsRelatonData = {
  h1: {
    family: [
      { name: "Anna Doe", relation: "Mother", id: 101, type: "member" },
      { name: "Peter Doe", relation: "Father", id: 102, type: "lead" },
    ],
    friendship: [{ name: "Max Miller", relation: "Best Friend", id: 201, type: "member" }],
    relationship: [],
    work: [{ name: "Tom Wilson", relation: "Colleague", id: 401, type: "lead" }],
    other: [],
  },
  h2: {
    family: [],
    friendship: [],
    relationship: [{ name: "Marie Smith", relation: "Partner", id: 301, type: "member" }],
    work: [],
    other: [],
  },
}