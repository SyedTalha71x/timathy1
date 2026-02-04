// ─── Training Initial Data & Constants ────────────────────────────────────────
// All multilingual initial data for the Training Exercises module.
// Languages: EN (English), DE (Deutsch), FR (Français), IT (Italiano), ES (Español)

// ─── Difficulty Options (not translated – universal terms) ────────────────────

export const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

// ─── Muscle Groups ───────────────────────────────────────────────────────────

export const initialMuscleOptions = [
  {
    id: "chest",
    translations: {
      en: "Chest",
      de: "Brust",
      fr: "Poitrine",
      it: "Petto",
      es: "Pecho",
    },
  },
  {
    id: "shoulders",
    translations: {
      en: "Shoulders",
      de: "Schultern",
      fr: "Épaules",
      it: "Spalle",
      es: "Hombros",
    },
  },
  {
    id: "triceps",
    translations: {
      en: "Triceps",
      de: "Trizeps",
      fr: "Triceps",
      it: "Tricipiti",
      es: "Tríceps",
    },
  },
  {
    id: "biceps",
    translations: {
      en: "Biceps",
      de: "Bizeps",
      fr: "Biceps",
      it: "Bicipiti",
      es: "Bíceps",
    },
  },
  {
    id: "back",
    translations: {
      en: "Back",
      de: "Rücken",
      fr: "Dos",
      it: "Schiena",
      es: "Espalda",
    },
  },
  {
    id: "lats",
    translations: {
      en: "Lats",
      de: "Latissimus",
      fr: "Dorsaux",
      it: "Dorsali",
      es: "Dorsales",
    },
  },
  {
    id: "traps",
    translations: {
      en: "Traps",
      de: "Trapezmuskel",
      fr: "Trapèzes",
      it: "Trapezi",
      es: "Trapecios",
    },
  },
  {
    id: "core",
    translations: {
      en: "Core",
      de: "Rumpf",
      fr: "Tronc",
      it: "Core",
      es: "Core",
    },
  },
  {
    id: "abs",
    translations: {
      en: "Abs",
      de: "Bauchmuskeln",
      fr: "Abdominaux",
      it: "Addominali",
      es: "Abdominales",
    },
  },
  {
    id: "obliques",
    translations: {
      en: "Obliques",
      de: "Schräge Bauchmuskeln",
      fr: "Obliques",
      it: "Obliqui",
      es: "Oblicuos",
    },
  },
  {
    id: "quadriceps",
    translations: {
      en: "Quadriceps",
      de: "Quadrizeps",
      fr: "Quadriceps",
      it: "Quadricipiti",
      es: "Cuádriceps",
    },
  },
  {
    id: "hamstrings",
    translations: {
      en: "Hamstrings",
      de: "Oberschenkelrückseite",
      fr: "Ischio-jambiers",
      it: "Femorali",
      es: "Isquiotibiales",
    },
  },
  {
    id: "glutes",
    translations: {
      en: "Glutes",
      de: "Gesäßmuskel",
      fr: "Fessiers",
      it: "Glutei",
      es: "Glúteos",
    },
  },
  {
    id: "calves",
    translations: {
      en: "Calves",
      de: "Waden",
      fr: "Mollets",
      it: "Polpacci",
      es: "Pantorrillas",
    },
  },
  {
    id: "forearms",
    translations: {
      en: "Forearms",
      de: "Unterarme",
      fr: "Avant-bras",
      it: "Avambracci",
      es: "Antebrazos",
    },
  },
  {
    id: "lower_back",
    translations: {
      en: "Lower Back",
      de: "Unterer Rücken",
      fr: "Bas du dos",
      it: "Zona lombare",
      es: "Espalda baja",
    },
  },
];

// ─── Equipment ───────────────────────────────────────────────────────────────

export const initialEquipmentOptions = [
  {
    id: "none",
    translations: {
      en: "None",
      de: "Keines",
      fr: "Aucun",
      it: "Nessuno",
      es: "Ninguno",
    },
  },
  {
    id: "dumbbells",
    translations: {
      en: "Dumbbells",
      de: "Kurzhanteln",
      fr: "Haltères",
      it: "Manubri",
      es: "Mancuernas",
    },
  },
  {
    id: "barbell",
    translations: {
      en: "Barbell",
      de: "Langhantel",
      fr: "Barre",
      it: "Bilanciere",
      es: "Barra",
    },
  },
  {
    id: "resistance_bands",
    translations: {
      en: "Resistance Bands",
      de: "Widerstandsbänder",
      fr: "Bandes de résistance",
      it: "Bande elastiche",
      es: "Bandas de resistencia",
    },
  },
  {
    id: "pull-up_bar",
    translations: {
      en: "Pull-up Bar",
      de: "Klimmzugstange",
      fr: "Barre de traction",
      it: "Sbarra per trazioni",
      es: "Barra de dominadas",
    },
  },
  {
    id: "kettlebell",
    translations: {
      en: "Kettlebell",
      de: "Kettlebell",
      fr: "Kettlebell",
      it: "Kettlebell",
      es: "Kettlebell",
    },
  },
  {
    id: "medicine_ball",
    translations: {
      en: "Medicine Ball",
      de: "Medizinball",
      fr: "Ballon lesté",
      it: "Palla medica",
      es: "Balón medicinal",
    },
  },
  {
    id: "cable_machine",
    translations: {
      en: "Cable Machine",
      de: "Kabelzugmaschine",
      fr: "Machine à câble",
      it: "Macchina a cavi",
      es: "Máquina de poleas",
    },
  },
  {
    id: "bench",
    translations: {
      en: "Bench",
      de: "Hantelbank",
      fr: "Banc",
      it: "Panca",
      es: "Banco",
    },
  },
  {
    id: "squat_rack",
    translations: {
      en: "Squat Rack",
      de: "Kniebeuge-Rack",
      fr: "Rack à squat",
      it: "Squat rack",
      es: "Rack de sentadillas",
    },
  },
  {
    id: "weight_plates",
    translations: {
      en: "Weight Plates",
      de: "Hantelscheiben",
      fr: "Disques de poids",
      it: "Dischi per pesi",
      es: "Discos de pesas",
    },
  },
  {
    id: "foam_roller",
    translations: {
      en: "Foam Roller",
      de: "Faszienrolle",
      fr: "Rouleau en mousse",
      it: "Rullo in schiuma",
      es: "Rodillo de espuma",
    },
  },
  {
    id: "yoga_mat",
    translations: {
      en: "Yoga Mat",
      de: "Yogamatte",
      fr: "Tapis de yoga",
      it: "Tappetino yoga",
      es: "Esterilla de yoga",
    },
  },
  {
    id: "trx_straps",
    translations: {
      en: "TRX Straps",
      de: "TRX-Schlingen",
      fr: "Sangles TRX",
      it: "Cinghie TRX",
      es: "Correas TRX",
    },
  },
];

// ─── Training Videos (Exercises) ─────────────────────────────────────────────

export const initialTrainingVideos = [
  {
    id: 1,
    name: {
      en: "Push-Up Variations",
      de: "Liegestütz-Variationen",
      fr: "Variations de pompes",
      it: "Variazioni di flessioni",
      es: "Variaciones de flexiones",
    },
    description: {
      en: "Learn different push-up techniques for building upper body strength",
      de: "Lerne verschiedene Liegestütz-Techniken für den Aufbau von Oberkörperkraft",
      fr: "Apprenez différentes techniques de pompes pour développer la force du haut du corps",
      it: "Impara diverse tecniche di flessioni per sviluppare la forza della parte superiore del corpo",
      es: "Aprende diferentes técnicas de flexiones para desarrollar la fuerza del tren superior",
    },
    targetMuscles: ["chest", "shoulders", "triceps", "core"],
    equipment: ["none"],
    difficulty: "Beginner",
    duration: "8:45",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    uploadedAt: "2024-03-15",
    uploadedBy: "Admin",
  },
  {
    id: 2,
    name: {
      en: "Squat Progressions",
      de: "Kniebeuge-Progressionen",
      fr: "Progressions de squats",
      it: "Progressioni di squat",
      es: "Progresiones de sentadillas",
    },
    description: {
      en: "Progressive squat exercises from bodyweight to weighted variations",
      de: "Progressive Kniebeuge-Übungen von Eigengewicht bis hin zu gewichteten Variationen",
      fr: "Exercices de squat progressifs, du poids du corps aux variations lestées",
      it: "Esercizi di squat progressivi, dal peso corporeo alle variazioni con pesi",
      es: "Ejercicios progresivos de sentadillas, desde peso corporal hasta variaciones con carga",
    },
    targetMuscles: ["quadriceps", "glutes", "hamstrings", "core"],
    equipment: ["none", "dumbbells", "barbell"],
    difficulty: "Beginner",
    duration: "10:15",
    thumbnail:
      "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
    uploadedAt: "2024-03-13",
    uploadedBy: "Admin",
  },
];

// ─── Sidebar Initial Data ────────────────────────────────────────────────────

export const initialSidebarWidgets = [
  { id: "sidebar-chart", type: "chart", position: 0 },
  { id: "sidebar-todo", type: "todo", position: 1 },
  { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
  { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
  { id: "sidebar-notes", type: "notes", position: 4 },
];

export const initialTodos = [
  {
    id: 1,
    title: "Review Design",
    description: "Review the new dashboard design",
    assignee: "Jack",
    dueDate: "2024-12-15",
    dueTime: "14:30",
  },
  {
    id: 2,
    title: "Team Meeting",
    description: "Weekly team sync",
    assignee: "Jack",
    dueDate: "2024-12-16",
    dueTime: "10:00",
  },
];

export const memberTypes = {
  "Studios Acquired": {
    data: [
      [30, 45, 60, 75, 90, 105, 120, 135, 150],
      [25, 40, 55, 70, 85, 100, 115, 130, 145],
    ],
    growth: "12%",
    title: "Studios Acquired",
  },
  Finance: {
    data: [
      [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
      [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
    ],
    growth: "8%",
    title: "Finance Statistics",
  },
  Leads: {
    data: [
      [120, 150, 180, 210, 240, 270, 300, 330, 360],
      [100, 130, 160, 190, 220, 250, 280, 310, 340],
    ],
    growth: "15%",
    title: "Leads Statistics",
  },
  Franchises: {
    data: [
      [120, 150, 180, 210, 240, 270, 300, 330, 360],
      [100, 130, 160, 190, 220, 250, 280, 310, 340],
    ],
    growth: "10%",
    title: "Franchises Acquired",
  },
};

export const initialCustomLinks = [
  {
    id: "link1",
    url: "https://fitness-web-kappa.vercel.app/",
    title: "Timathy Fitness Town",
  },
  { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
  {
    id: "link3",
    url: "https://fitness-web-kappa.vercel.app/",
    title: "Timathy V1",
  },
];

export const initialExpiringContracts = [
  {
    id: 1,
    title: "Oxygen Gym Membership",
    expiryDate: "June 30, 2025",
    status: "Expiring Soon",
  },
  {
    id: 2,
    title: "Timathy Fitness Equipment Lease",
    expiryDate: "July 15, 2025",
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
