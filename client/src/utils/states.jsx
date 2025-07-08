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
    }
];

export const appointmentsData =  [
      {
        "id": 1,
        "name": "Yolanda",
        "time": "09:00 - 09:30",
        "date": "Mon | 07-02-2025",
        "color": "bg-[#4169E1]",
        "startTime": "09:00",
        "endTime": "09:30",
        "type": "Strength Training",
        "specialNote": {
          "text": "Prefers morning sessions",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 2,
        "name": "Denis",
        "time": "09:00 - 09:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "09:00",
        "endTime": "09:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 3,
        "name": "Nicole",
        "time": "09:00 - 09:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "09:00",
        "endTime": "09:30",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 4,
        "name": "Melanie",
        "time": "09:00 - 09:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#8b5cf6]",
        "startTime": "09:00",
        "endTime": "09:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 5,
        "name": "Angela",
        "time": "09:30 - 10:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#ef4444]",
        "startTime": "09:30",
        "endTime": "10:00",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 6,
        "name": "Kristina",
        "time": "09:30 - 10:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#06b6d4]",
        "startTime": "09:30",
        "endTime": "10:00",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 7,
        "name": "Melanie",
        "time": "10:00 - 10:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f59e0b]",
        "startTime": "10:00",
        "endTime": "10:30",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 8,
        "name": "Annett",
        "time": "10:00 - 10:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#10b981]",
        "startTime": "10:00",
        "endTime": "10:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 9,
        "name": "Justin",
        "time": "10:00 - 10:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "10:00",
        "endTime": "10:30",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 10,
        "name": "Michel",
        "time": "10:00 - 10:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "10:00",
        "endTime": "10:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 11,
        "name": "Colin",
        "time": "11:30 - 12:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "11:30",
        "endTime": "12:00",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 12,
        "name": "Yvonne",
        "time": "11:30 - 12:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#06b6d4]",
        "startTime": "11:30",
        "endTime": "12:00",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 13,
        "name": "Jennifer",
        "time": "12:00 - 12:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#ef4444]",
        "startTime": "12:00",
        "endTime": "12:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 14,
        "name": "Michael",
        "time": "12:00 - 12:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#8b5cf6]",
        "startTime": "12:00",
        "endTime": "12:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 15,
        "name": "Furkan",
        "time": "13:00 - 13:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "13:00",
        "endTime": "13:30",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 16,
        "name": "Heike",
        "time": "12:30 - 13:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "12:30",
        "endTime": "13:00",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 17,
        "name": "Sandy",
        "time": "12:30 - 13:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f59e0b]",
        "startTime": "12:30",
        "endTime": "13:00",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 18,
        "name": "Ann-Kathrin",
        "time": "13:00 - 13:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "13:00",
        "endTime": "13:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 19,
        "name": "Katharina",
        "time": "13:00 - 14:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#06b6d4]",
        "startTime": "13:00",
        "endTime": "14:00",
        "type": "Probetraining",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": true
      },
      {
        "id": 20,
        "name": "Joanna",
        "time": "14:00 - 14:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "14:00",
        "endTime": "14:30",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 21,
        "name": "Iris",
        "time": "14:00 - 14:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f59e0b]",
        "startTime": "14:00",
        "endTime": "14:30",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 22,
        "name": "Jürgen",
        "time": "14:00 - 14:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "14:00",
        "endTime": "14:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 23,
        "name": "Corinna",
        "time": "14:30 - 15:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "14:30",
        "endTime": "15:00",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 24,
        "name": "Anzi",
        "time": "14:30 - 15:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "14:30",
        "endTime": "15:00",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 25,
        "name": "Gabriela",
        "time": "15:00 - 15:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "15:00",
        "endTime": "15:30",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 26,
        "name": "Stefanie",
        "time": "15:00 - 15:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "15:00",
        "endTime": "15:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 27,
        "name": "Gabriele",
        "time": "15:00 - 15:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f59e0b]",
        "startTime": "15:00",
        "endTime": "15:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 28,
        "name": "Aylin",
        "time": "15:30 - 16:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "15:30",
        "endTime": "16:00",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 29,
        "name": "Conrad",
        "time": "15:30 - 16:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#8b5cf6]",
        "startTime": "15:30",
        "endTime": "16:00",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 30,
        "name": "Michael",
        "time": "16:00 - 16:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "16:00",
        "endTime": "16:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 31,
        "name": "Ralf",
        "time": "16:00 - 16:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "16:00",
        "endTime": "16:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 32,
        "name": "Sarah",
        "time": "16:30 - 17:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "16:30",
        "endTime": "17:00",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 33,
        "name": "Sabrina",
        "time": "16:30 - 17:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "16:30",
        "endTime": "17:00",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 34,
        "name": "Nadine",
        "time": "17:00 - 17:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#8b5cf6]",
        "startTime": "17:00",
        "endTime": "17:30",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 35,
        "name": "Jana",
        "time": "17:00 - 17:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "17:00",
        "endTime": "17:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 36,
        "name": "Andreas",
        "time": "17:00 - 17:30",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "17:00",
        "endTime": "17:30",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 37,
        "name": "Nicole",
        "time": "17:30 - 18:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "17:30",
        "endTime": "18:00",
        "type": "Yoga",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 38,
        "name": "Irene",
        "time": "17:30 - 18:00",
        "date": "Mon | 03-02-2025",
        "color": "bg-[#f97316]",
        "startTime": "17:30",
        "endTime": "18:00",
        "type": "Personal Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "pending",
        "isTrial": false
      },
      {
        "id": 39,
        "name": "Past User 1",
        "time": "08:00 - 08:30",
        "date": "Sun | 02-02-2025",
        "color": "bg-[#4169E1]",
        "startTime": "08:00",
        "endTime": "08:30",
        "type": "Strength Training",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "completed",
        "isTrial": false
      },
      {
        "id": 40,
        "name": "Past User 2",
        "time": "09:00 - 09:30",
        "date": "Sun | 02-02-2025",
        "color": "bg-[#22c55e]",
        "startTime": "09:00",
        "endTime": "09:30",
        "type": "Cardio",
        "specialNote": {
          "text": "",
          "startDate": null,
          "endDate": null,
          "isImportant": false
        },
        "status": "completed",
        "isTrial": false
      }
]  

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