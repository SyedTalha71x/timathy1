export const demoNotes = {
    personal: [
      {
        id: 1,
        title: "Welcome to Personal Notes",
        content: "This is your first personal note. You can edit or delete it anytime.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Shopping List",
        content: "Milk, Eggs, Bread, Fruits, Vegetables, Coffee",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        title: "Book Recommendations",
        content: "1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      }
    ],
    studio: [
      {
        id: 4,
        title: "Studio Project Ideas",
        content: "1. New album concept\n2. Collaboration with artist X\n3. Live session recording",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        title: "Equipment Maintenance",
        content: "Schedule monthly maintenance for all studio equipment. Check microphone diaphragms.",
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 6,
        title: "Upcoming Sessions",
        content: "Monday: Band rehearsal\nWednesday: Vocal recording\nFriday: Mixing session",
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
      }
    ],
  }