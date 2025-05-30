// utils/studioMembersData.js

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
              id: 1,
              firstName: "John",
              surname: "Smith",
              email: "john.smith@example.com",
              phoneNumber: "+1234567890",
              trialPeriod: "Trial Period",
              hasTrialTraining: true,
              avatar: "",
              source: "hardcoded",
              status: "active",
              about: "Software Engineer",
              createdAt: "2025-01-15T10:30:00Z",
              specialNote: {
                text: "Interested in personal training sessions twice a week.",
                isImportant: false,
                startDate: "2025-01-15",
                endDate: "2025-03-15",
              },
            },
    ],
    2: [
        {
              id: 2,
              firstName: "John",
              surname: "Smith",
              email: "john.smith@example.com",
              phoneNumber: "+1234567890",
              trialPeriod: "Trial Period",
              hasTrialTraining: true,
              avatar: "",
              source: "hardcoded",
              status: "active",
              about: "Software Engineer",
              createdAt: "2025-01-15T10:30:00Z",
              specialNote: {
                text: "Interested in personal training sessions twice a week.",
                isImportant: false,
                startDate: "2025-01-15",
                endDate: "2025-03-15",
              },
            },
    ],
}

export const studioContractsData = {
    1: [
        {
            id: 1,
            memberName: "John Doe",
            duration: "12 months",
            startDate: "2023-01-15",
            endDate: "2024-01-15",
            status: "active",
            files: ["contract_john.pdf", "terms_john.pdf"],
        },
        {
            id: 2,
            memberName: "Jane Smith",
            duration: "6 months",
            startDate: "2023-02-20",
            endDate: "2023-08-20",
            status: "paused",
            files: ["contract_jane.pdf"],
        },
        {
            id: 3,
            memberName: "Mike Johnson",
            duration: "12 months",
            startDate: "2023-03-10",
            endDate: "2024-03-10",
            status: "inactive",
            files: ["contract_mike.pdf", "cancellation_mike.pdf"],
        },
    ],
    2: [
        {
            id: 4,
            memberName: "Sarah Wilson",
            duration: "24 months",
            startDate: "2023-01-05",
            endDate: "2025-01-05",
            status: "active",
            files: ["contract_sarah.pdf"],
        },
        {
            id: 5,
            memberName: "Tom Brown",
            duration: "12 months",
            startDate: "2023-02-15",
            endDate: "2024-02-15",
            status: "active",
            files: ["contract_tom.pdf", "addendum_tom.pdf"],
        },
    ],
}

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
    1: { members: 120, trainers: 8, classes: 15 },
    2: { members: 85, trainers: 5, classes: 10 },
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
        taxId: "DE111222333",
        loginEmail: "admin@fitchain.com",
        loginPassword: "franchise123",
        createdDate: "2023-01-15",
        studioCount: 2,
    }
];