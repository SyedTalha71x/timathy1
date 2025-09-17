import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"

export const hardcodedLeads = [
    {
      id: "h1",
      firstName: "John",
      surname: "Smith",
      email: "john.smith@example.com",
      phoneNumber: "+1234567890",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "Social Media Ads",
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
      company: "Fitness Pro", // Added for contract pre-selection
      interestedIn: "Premium", // Added for contract pre-selection
      birthday: "1990-05-20", // Added for ViewLeadDetailsModal
      address: "123 Main St, Anytown, USA", // Added for ViewLeadDetailsModal
      country: "USA",
      leadId: "LEAD-001",
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
      company: "Wellness Hub", // Added for contract pre-selection
      interestedIn: "Basic", // Added for contract pre-selection
      birthday: "1988-11-10", // Added for ViewLeadDetailsModal
      address: "456 Oak Ave, Otherville, USA", // Added for ViewLeadDetailsModal
      country: "USA",
      leadId: "LEAD-002",
    },
    {
      id: "h3",
      firstName: "Michael",
      surname: "Brown",
      email: "michael.brown@example.com",
      phoneNumber: "+1122334455",
      trialPeriod: "Trial Period",
      hasTrialTraining: true,
      avatar: Avatar,
      source: "Email Campaign",
      status: "trial",
      createdAt: "2025-01-25T09:15:00Z",
      specialNote: {
        text: "Former athlete, looking for high-intensity workouts.",
        isImportant: false,
        startDate: "2025-01-25",
        endDate: "2025-02-25",
      },
      columnId: "trial",
      company: "Gym Central", // Added for contract pre-selection
      interestedIn: "Bronze", // Added for contract pre-selection
      birthday: "1995-03-01", // Added for ViewLeadDetailsModal
      address: "789 Pine Ln, Anycity, USA", // Added for ViewLeadDetailsModal
      country: "USA",
      leadId: "LEAD-003",
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
      source: "Website",
      status: "uninterested",
      createdAt: "2025-02-01T11:20:00Z",
      specialNote: {
        text: "Requested follow-up in 3 months - not ready to commit now.",
        isImportant: true,
        startDate: "2025-02-01",
        endDate: "2025-05-01",
      },
      columnId: "uninterested",
      company: "Active Life", // Added for contract pre-selection
      interestedIn: "Basic", // Added for contract pre-selection
      birthday: "1992-07-18", // Added for ViewLeadDetailsModal
      address: "101 Elm St, Smalltown, USA", // Added for ViewLeadDetailsModal
      country: "USA",
      leadId: "LEAD-004",
    },
  ]

  export const memberRelationsLeadNew = {
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