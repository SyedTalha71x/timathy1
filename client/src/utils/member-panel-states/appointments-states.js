export const services = [
    {
      id: 1,
      name: "Body Composition Analysis",
      duration: "30 min",
      category: "Health Check",
      price: "€25",
      description: "Complete body analysis including muscle mass, body fat percentage, and metabolic rate",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      trainer: "Dr. Sarah Mueller",
    },
    {
      id: 2,
      name: "EMS Training Session",
      duration: "45 min",
      category: "Personal Training",
      price: "€65",
      description: "High-intensity electrical muscle stimulation training for maximum efficiency",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&crop=center",
      trainer: "Michael Schmidt",
    },
    {
      id: 3,
      name: "Nutrition Consultation",
      duration: "60 min",
      category: "Wellness",
      price: "€45",
      description: "Personalized nutrition plan based on your goals and lifestyle",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center",
      trainer: "Lisa Wagner",
    },
    {
      id: 4,
      name: "Physiotherapy Session",
      duration: "50 min",
      category: "Recovery",
      price: "€55",
      description: "Professional physiotherapy for injury prevention and rehabilitation",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      trainer: "Thomas Becker",
    },
    {
      id: 5,
      name: "Yoga & Meditation",
      duration: "75 min",
      category: "Mindfulness",
      price: "€35",
      description: "Relaxing yoga session combined with guided meditation",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
      trainer: "Anna Kowalski",
    },
    {
      id: 6,
      name: "HIIT Training",
      duration: "40 min",
      category: "Group Class",
      price: "€20",
      description: "High-intensity interval training for maximum calorie burn",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=center",
      trainer: "David Martinez",
    },
  ]

  export const currentAppointments = [
    {
      id: 1,
      service: "EMS Training Session",
      date: "June 22, 2025",
      time: "4:30 PM - 5:15 PM",
      trainer: "Michael Schmidt",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Body Composition Analysis",
      date: "June 25, 2025",
      time: "10:00 AM - 10:30 AM",
      trainer: "Dr. Sarah Mueller",
      status: "confirmed",
    },
  ]

  export const pendingAppointments = [
    {
      id: 3,
      service: "Nutrition Consultation",
      date: "June 28, 2025",
      time: "2:00 PM - 3:00 PM",
      trainer: "Lisa Wagner",
      status: "pending",
    },
  ]

  export const pastAppointments = [
    {
      id: 4,
      service: "Nutrition Consultation",
      date: "May 15, 2025",
      time: "2:00 PM - 3:00 PM",
      trainer: "Lisa Wagner",
      status: "completed",
    },
  ]

  export const timeSlots = [
    { id: 1, time: "9:00 AM – 9:45 AM", period: "morning", available: true },
    { id: 2, time: "10:30 AM – 11:15 AM", period: "morning", available: true },
    { id: 3, time: "2:00 PM – 2:45 PM", period: "afternoon", available: false },
    { id: 4, time: "4:30 PM – 5:15 PM", period: "afternoon", available: true },
    { id: 5, time: "6:00 PM – 6:45 PM", period: "evening", available: true },
    { id: 6, time: "7:30 PM – 8:15 PM", period: "evening", available: true },
  ]
