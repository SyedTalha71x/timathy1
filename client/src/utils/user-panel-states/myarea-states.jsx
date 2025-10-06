import Rectangle1 from "../../../public/Rectangle 1.png"


const today = new Date().toISOString().split('T')[0]; // Get today's date

export const notificationData = [
    {
        id: 1,
        title: "New Member Registration",
        message: "John Smith has registered for a premium membership",
        time: "2 minutes ago",
        isRead: false
    },
    {
        id: 2,
        title: "Payment Due Reminder",
        message: "3 members have overdue payments this month",
        time: "15 minutes ago",
        isRead: false
    },

]
export const memberRelationsData = {
    1: {
        family: [
            { name: "Anna Doe", relation: "Mother", id: 101, type: "member" },
            { name: "Peter Doe", relation: "Father", id: 102, type: "lead" },
            { name: "Lisa Doe", relation: "Sister", id: 103, type: "manual" },
        ],
        friendship: [
            { name: "Max Miller", relation: "Best Friend", id: 201, type: "member" }
        ],
        relationship: [
            { name: "Marie Smith", relation: "Partner", id: 301, type: "member" },
            { name: "Julia Brown", relation: "Ex-Partner", id: 302, type: "manual" },
        ],
        work: [
            { name: "Tom Wilson", relation: "Colleague", id: 401, type: "lead" },
            { name: "Mr. Johnson", relation: "Boss", id: 402, type: "manual" },
        ],
        other: [
            { name: "Mrs. Smith", relation: "Neighbor", id: 501, type: "manual" }
        ],
    },
    2: {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
    },
};
export const availableMembersLeadsNew = [
    { id: 101, name: "Anna Doe", type: "member" },
    { id: 102, name: "Peter Doe", type: "lead" },
    { id: 103, name: "Lisa Doe", type: "member" },
    { id: 201, name: "Max Miller", type: "member" },
    { id: 301, name: "Marie Smith", type: "member" },
    { id: 401, name: "Tom Wilson", type: "lead" },
];
export const relationOptions = {
    family: ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother"],
    friendship: ["Best Friend", "Close Friend", "Friend", "Acquaintance"],
    relationship: ["Partner", "Spouse", "Ex-Partner", "Boyfriend", "Girlfriend"],
    work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
    other: ["Neighbor", "Doctor", "Lawyer", "Trainer", "Other"],
};
export const mockMemberHistoryNew = {
    1: {
        general: [
            {
                id: 1,
                action: "Profile Updated",
                date: "2025-01-08",
                user: "Admin",
                details: "Updated contact information and address"
            },
            {
                id: 2,
                action: "Membership Renewed",
                date: "2025-01-01",
                user: "System",
                details: "Annual membership automatically renewed"
            }
        ],
        checkins: [
            {
                id: 1,
                type: "Check-in",
                date: "2025-01-08T10:00:00",
                location: "Main Gym"
            },
            {
                id: 2,
                type: "Check-out",
                date: "2025-01-08T11:30:00",
                location: "Main Gym"
            }
        ],
        appointments: [
            {
                id: 1,
                title: "Personal Training Session",
                date: "2025-01-07T14:00:00",
                trainer: "John Smith",
                status: "completed"
            }
        ],
        finance: [
            {
                id: 1,
                type: "Membership Fee",
                amount: "$50.00",
                date: "2025-01-01",
                status: "completed",
                description: "Monthly membership payment"
            }
        ],
        contracts: [
            {
                id: 1,
                action: "Contract Extended",
                date: "2025-01-01",
                user: "Manager",
                details: "Extended contract for 12 months"
            }
        ]
    }
};
export const mockMemberRelationsNew = {
    1: {
        family: [
            { id: 1, name: "Sarah Wilson", relation: "Spouse", type: "member" },
            { id: 2, name: "Mike Wilson", relation: "Son", type: "lead" }
        ],
        friendship: [
            { id: 3, name: "Alex Johnson", relation: "Friend", type: "member" }
        ],
        relationship: [],
        work: [
            { id: 4, name: "Company Gym", relation: "Colleague", type: "external" }
        ]
    }
};
export const memberContingentDataNew = {
    1: {
        current: { used: 2, total: 7 },
        future: {
            "05.14.25 - 05.18.2025": { used: 0, total: 8 },
            "06.14.25 - 06.18.2025": { used: 0, total: 8 },
            "07.14.25 - 07.18.2025": { used: 0, total: 8 },
            "08.14.25 - 08.18.2025": { used: 0, total: 8 },
            "09.14.25 - 09.18.2025": { used: 0, total: 8 },
        },
    },
    2: {
        current: { used: 1, total: 8 },
        future: {
            "05.14.25 - 05.18.2025": { used: 0, total: 8 },
            "06.14.25 - 06.18.2025": { used: 0, total: 8 },
        },
    },
    3: {
        current: { used: 0, total: 5 },
        future: {}
    },
    4: {
        current: { used: 3, total: 10 },
        future: {}
    },
    5: {
        current: { used: 0, total: 6 },
        future: {}
    },
    100: {
        current: { used: 0, total: 0 }, // Company chat has no contingent
        future: {},
    },
};
export const customLinksData = [
    {
        id: "link1",
        url: "https://fitness-web-kappa.vercel.app/",
        title: "Timathy Fitness Town",
    },
    {
        id: "link2",
        url: "https://oxygengym.pk/",
        title: "Oxygen Gyms"
    },
    {
        id: "link3",
        url: "https://google.com",
        title: "Fitness Gyms"
    },
];
export const communicationsData = [
    {
        id: 1,
        name: "Jennifer Markus",
        message: "Hey! Did you think the NFT marketplace for Alice app design?",
        time: "Today | 05:30 PM",
        avatar: Rectangle1, // You'll need to import this separately
    },
    {
        id: 2,
        name: "Alex Johnson",
        message: "The new dashboard looks great! When can we review it?",
        time: "Today | 03:15 PM",
        avatar: Rectangle1, // You'll need to import this separately
    },
];
export const todosData = [
    {
        id: 1,
        title: "Task 1",
        assignees: ["Jack"],
        roles: "Trainer",
        tags: ["Important", "Urgent"],
        status: "ongoing",
        category: "member",
        dueDate: "2025-01-15",
        isPinned: false,
        dueTime: "10:00 AM",
        completed: false,
    },
    {
        id: 2,
        title: "Review membership applications",
        assignees: ["Sarah"],
        roles: "Manager",
        tags: ["Review"],
        status: "canceled",
        category: "staff",
        dueDate: "2025-01-20",
        isPinned: false,
        dueTime: "2:00 PM",
        completed: false,
    },
    {
        id: 3,
        title: "Update equipment maintenance",
        assignees: ["Mike"],
        roles: "Technician",
        tags: ["Maintenance"],
        status: "completed",
        category: "equipment",
        dueDate: "2025-01-10",
        isPinned: false,
        dueTime: "9:00 AM",
        completed: true,
    },
    {
        id: 4,
        title: "Prepare monthly report",
        assignees: ["Admin"],
        roles: "Admin",
        tags: ["Report", "Monthly"],
        status: "ongoing",
        category: "admin",
        dueDate: "2025-01-25",
        isPinned: false,
        dueTime: "11:00 AM",
        completed: false,
    },
];
export const appointmentsData = [
    {
        id: 1,
        name: "Yolanda",
        time: "10:00 - 14:00",
        date: "Mon | 03-08-2025",
        color: "bg-[#4169E1]",
        startTime: "10:00",
        endTime: "14:00",
        type: "Strength Training",
        specialNote: {
            text: "Prefers morning sessions",
            startDate: null,
            endDate: null,
            isImportant: false,
        },
        status: "pending",
        isTrial: false,
    },
    {
        id: 2,
        name: "Alexandra",
        time: "10:00 - 18:00",
        date: "Tue | 04-02-2025",
        color: "bg-[#FF6B6B]",
        startTime: "10:00",
        endTime: "18:00",
        type: "Cardio",
        specialNote: {
            text: "",
            startDate: null,
            endDate: null,
            isImportant: false,
        },
        status: "pending",
        isTrial: true,
    },
    {
        id: 3,
        name: "Marcus",
        time: "14:00 - 16:00",
        date: "Wed | 05-02-2025",
        color: "bg-[#50C878]",
        startTime: "14:00",
        endTime: "16:00",
        type: "Yoga",
        specialNote: {
            text: "",
            startDate: null,
            endDate: null,
            isImportant: false,
        },
        status: "pending",
        isTrial: false,
    },
    {
        id: 4,
        name: "John",
        time: "14:00 - 16:00",
        date: "Thu | 06-02-2025",
        color: "bg-[#50C878]",
        startTime: "14:00",
        endTime: "16:00",
        type: "Yoga",
        specialNote: {
            text: "",
            startDate: null,
            endDate: null,
            isImportant: false,
        },
        status: "pending",
        isTrial: false,
    },
];
export const appointmentTypesData = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
];

export const birthdaysData = [
    {
        id: 1,
        name: "John Smith",
        date: today, // Today's birthday for testing
        avatar: Rectangle1, // Import separately
    },
    {
        id: 2,
        name: "Sarah Johnson",
        date: "2025-01-20",
        avatar: Rectangle1, // Import separately
    },
    {
        id: 3,
        name: "Mike Wilson",
        date: "2025-01-25",
        avatar: Rectangle1, // Import separately
    },
];
export const expiringContractsData = [
    {
        id: 1,
        title: "Oxygen Gym Membership",
        expiryDate: "June 30, 2025",
        status: "Expiring Soon",
    },
    {
        id: 3,
        title: "Studio Space Rental",
        expiryDate: "August 5, 2025",
        status: "Expiring Soon",
    },
    {
        id: 4,
        title: "Insurance Policy",
        expiryDate: "September 10, 2025",
        status: "Expiring Soon",
    },
    {
        id: 5,
        title: "Software License",
        expiryDate: "October 20, 2025",
        status: "Expiring Soon",
    },
];
export const memberTypesData = {
    "All members": {
        data: [
            [50, 280, 200, 450, 250, 400, 300, 200, 450],
            [100, 150, 200, 100, 150, 300, 400, 100, 400],
        ],
        growth: "4%",
        title: "Members",
    },
    "Checked in": {
        data: [
            [30, 180, 150, 350, 200, 300, 250, 150, 350],
            [80, 120, 150, 80, 120, 250, 300, 80, 300],
        ],
        growth: "2%",
        title: "Checked In Members",
    },
    "Cancelled appointment": {
        data: [
            [20, 100, 50, 100, 50, 100, 50, 50, 100],
            [20, 30, 50, 20, 30, 50, 100, 20, 100],
        ],
        growth: "-1%",
        title: "Cancelled Appointments",
    },
    Finances: {
        data: [
            [150, 320, 280, 500, 350, 450, 380, 300, 520],
            [200, 250, 300, 200, 280, 400, 500, 200, 480],
        ],
        growth: "8%",
        title: "Financial Overview",
    },
    Selling: {
        data: [
            [80, 220, 180, 380, 280, 350, 320, 250, 400],
            [120, 180, 220, 120, 200, 320, 420, 150, 380],
        ],
        growth: "6%",
        title: "Sales Performance",
    },
    Leads: {
        data: [
            [40, 160, 120, 280, 180, 250, 220, 180, 300],
            [60, 100, 140, 80, 120, 200, 280, 100, 260],
        ],
        growth: "5%",
        title: "Lead Generation",
    },
    "Top-selling by revenue": {
        data: [
            [40, 160, 120, 280, 180, 250, 220, 180, 300],
            [60, 100, 140, 80, 120, 200, 280, 100, 260],
        ],
        growth: "2%",
        title: "Top-selling by revenue",
    },
    "Most frequently sold": {
        data: [
            [40, 160, 120, 280, 180, 250, 220, 180, 300],
            [60, 100, 140, 80, 120, 200, 280, 100, 260],
        ],
        growth: "3%",
        title: "Most frequently sold",
    },
};
export const mockTrainingPlansNew = [
    {
        id: 1,
        name: "Beginner Full Body Workout",
        description: "A comprehensive full-body workout plan designed for beginners",
        createdBy: "John Trainer",
        duration: "4 weeks",
        difficulty: "Beginner",
        workoutsPerWeek: 3,
        category: "Strength Training",
        exercises: [
            {
                videoId: "1",
                sets: 3,
                reps: "10-12",
            },
            {
                videoId: "2",
                sets: 3,
                reps: "8-10",
            },
        ],
    },
];
export const mockVideosNew = [
    {
        id: "1",
        title: "Push-ups",
        instructor: "Mike Trainer",
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYOeTbdunIjiy-rOAtmyyBMIYoNlmWCl28Fg&s",
        targetMuscles: ["Chest", "Triceps", "Shoulders"],
    },
    {
        id: "2",
        title: "Squats",
        instructor: "Lisa Coach",
        thumbnail: "https://www.shutterstock.com/image-vector/exercise-guide-by-man-doing-260nw-2081735731.jpg",
        targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    },
];

export const bulletinBoardData = [
    {
      id: 1,
      title: "Gym Maintenance Notice",
      content: "The gym will be closed for maintenance on Saturday from 2 PM to 6 PM.",
      category: "staff",
      date: "2025-01-15",
      author: "Admin",
      priority: "high"
    },
    {
      id: 2,
      title: "New Yoga Classes Starting",
      content: "We're excited to announce new yoga classes starting next week. Sign up now!",
      category: "members",
      date: "2025-01-14",
      author: "Fitness Team",
      priority: "medium"
    },
    {
      id: 3,
      title: "Holiday Schedule Update",
      content: "Special holiday hours: Open 8 AM - 4 PM on December 24th and 25th.",
      category: "all",
      date: "2025-01-13",
      author: "Management",
      priority: "low"
    },
    {
      id: 4,
      title: "Staff Meeting Reminder",
      content: "Monthly staff meeting this Friday at 10 AM in the conference room.",
      category: "staff",
      date: "2025-01-12",
      author: "Manager",
      priority: "high"
    },
    {
      id: 5,
      title: "Member Appreciation Day",
      content: "Join us this Saturday for free classes and refreshments!",
      category: "members",
      date: "2025-01-11",
      author: "Events Team",
      priority: "medium"
    }
  ];

   