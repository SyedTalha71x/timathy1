import Rectangle1 from "../../../public/Rectangle 1.png";
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png";

export const communicationsData = [
  {
    id: 1,
    name: "John Doe",
    message: "Hey, how's the project going?",
    time: "2 min ago",
    avatar: Rectangle1,
  },
  {
    id: 2,
    name: "Jane Smith",
    message: "Meeting scheduled for tomorrow",
    time: "10 min ago",
    avatar: Rectangle1,
  },
];

export const todosData = [
  {
    id: 1,
    title: "Review project proposal",
    assignee: "Mike Johnson",
  },
  {
    id: 2,
    title: "Update documentation",
    assignee: "Sarah Davis",
  },
];

export const birthdaysData = [
  {
    id: 1,
    name: "Alice Johnson",
    date: "Dec 15, 2024",
    avatar: Avatar,
  },
  {
    id: 2,
    name: "Bob Wilson",
    date: "Dec 20, 2024",
    avatar: Avatar,
  },
];

export const customLinksData = [
  {
    id: 1,
    title: "Google Drive",
    url: "https://drive.google.com",
  },
  {
    id: 2,
    title: "GitHub",
    url: "https://github.com",
  },
];

export const todosTaskData = [
  {
    id: 1,
    title: "Task 1",
    assignees: ["Jack Smith"],
    roles: ["Trainer"],
    tags: ["Important", "Urgent"],
    status: "ongoing",
    category: "member",
    dueDate: "2023-06-20",
    dueTime: "10:00",
    reminder: "15 minutes before",
    repeat: "Never",
    isPinned: false,
    dragVersion: 0,
  },
  {
    id: 2,
    title: "Task 2",
    assignees: ["Jane Doe"],
    roles: ["Manager"],
    tags: ["Meeting"],
    status: "ongoing",
    category: "staff",
    dueDate: "2023-06-25",
    dueTime: "14:00",
    reminder: "30 minutes before",
    repeat: "Weekly",
    isPinned: false,
    dragVersion: 0,
  },
  {
    id: 3,
    title: "Reply to client inquiry",
    assignees: ["Sarah Davis"],
    roles: ["Support"],
    tags: ["Client", "Important"],
    status: "ongoing",
    category: "staff",
    dueDate: "2023-06-22",
    dueTime: "11:30",
    reminder: "On time",
    repeat: "Never",
    isPinned: false,
    dragVersion: 0,
  },
  {
    id: 4,
    title: "Schedule member onboarding",
    assignees: ["Mike Johnson"],
    roles: ["Trainer"],
    tags: ["Onboarding"],
    status: "completed",
    category: "member",
    dueDate: "2023-06-18",
    dueTime: "09:00",
    reminder: "1 hour before",
    repeat: "Monthly",
    isPinned: false,
    dragVersion: 0,
  },
  {
    id: 5,
    title: "Staff meeting preparation",
    assignees: ["Alex Miller"],
    roles: ["Manager"],
    tags: ["Meeting"],
    status: "ongoing",
    category: "staff",
    dueDate: "2023-06-24",
    dueTime: "15:00",
    reminder: "1 day before",
    repeat: "Daily",
    isPinned: false,
    dragVersion: 0,
  },
  {
    id: 6,
    title: "Cancelled Task Example",
    assignees: ["John Wilson"],
    roles: ["Admin"],
    tags: ["Urgent"],
    status: "canceled",
    category: "staff",
    dueDate: "2023-06-28",
    dueTime: "13:00",
    reminder: "5 minutes before",
    repeat: "Never",
    isPinned: false,
    dragVersion: 0,
  },

];

export const configuredTagsData = [

        { id: 1, name: "Important", color: "#D32F2F" },   // Dark Red
        { id: 2, name: "Urgent", color: "#F57C00" },      // Dark Orange
        { id: 3, name: "Meeting", color: "#7B1FA2" },     // Dark Purple (new for meeting)
        { id: 4, name: "Client", color: "#1565C0" },      // Dark Blue
        { id: 5, name: "Onboarding", color: "#512DA8" },  // Dark Indigo
        { id: 6, name: "Personal", color: "#C2185B" },    // Dark Pink
        { id: 7, name: "Work", color: "#2E7D32" },        // Dark Green
        { id: 8, name: "Study", color: "#FF8F00" },       // Dark Amber
      
]


export const availableAssigneesData = [
    { id: 1, firstName: "Jack", lastName: "Smith" },
    { id: 2, firstName: "Jane", lastName: "Doe" },
    { id: 3, firstName: "John", lastName: "Wilson" },
    { id: 4, firstName: "Jessica", lastName: "Brown" },
    { id: 5, firstName: "Mike", lastName: "Johnson" },
    { id: 6, firstName: "Sarah", lastName: "Davis" },
    { id: 7, firstName: "Alex", lastName: "Miller" },
  ]