// Design templates organized by category
export const templateCategories = [
  { id: "all", name: "All Templates", icon: "Grid3X3" },
  { id: "custom", name: "My Templates", icon: "Bookmark" },
  { id: "social", name: "Social Media", icon: "Instagram" },
  { id: "marketing", name: "Marketing", icon: "Megaphone" },
  { id: "fitness", name: "Fitness & Gym", icon: "Dumbbell" },
  { id: "events", name: "Events", icon: "Calendar" },
  { id: "quotes", name: "Quotes", icon: "Quote" },
  { id: "announcements", name: "Announcements", icon: "Bell" },
  { id: "minimal", name: "Minimal", icon: "Minus" }
];

// Pre-designed templates with elements
// Note: All templates now use isBackground: true for the background layer
export const templates = [
  // ============================================
  // FITNESS TEMPLATES
  // ============================================
  {
    id: "fitness-motivation-1",
    name: "Fitness Motivation",
    category: "fitness",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#FF6B35",
      secondary: "#1A1A2E",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A2E",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "accent-line",
        type: "shape",
        shape: "rectangle",
        color: "#FF6B35",
        x: 50,
        y: 200,
        width: 8,
        height: 200,
        zIndex: 1
      },
      {
        id: "headline",
        type: "text",
        content: "PUSH YOUR\nLIMITS",
        color: "#FFFFFF",
        size: 72,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "left",
        x: 80,
        y: 200,
        width: 900,
        height: 200,
        zIndex: 2
      },
      {
        id: "subtext",
        type: "text",
        content: "Every rep counts. Every set matters.",
        color: "#FF6B35",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        x: 80,
        y: 420,
        width: 900,
        height: 50,
        zIndex: 3
      }
    ]
  },
  {
    id: "fitness-promo-1",
    name: "Gym Promo",
    category: "fitness",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#00D9FF",
      secondary: "#0D0D0D",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#0D0D0D",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "circle-accent",
        type: "shape",
        shape: "circle",
        color: "#00D9FF",
        x: 700,
        y: -200,
        width: 600,
        height: 600,
        zIndex: 1
      },
      {
        id: "offer-badge",
        type: "shape",
        shape: "circle",
        color: "#FF3366",
        x: 750,
        y: 750,
        width: 250,
        height: 250,
        zIndex: 2
      },
      {
        id: "offer-text",
        type: "text",
        content: "50%\nOFF",
        color: "#FFFFFF",
        size: 48,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 775,
        y: 800,
        width: 200,
        height: 120,
        zIndex: 3
      },
      {
        id: "headline",
        type: "text",
        content: "JOIN\nTODAY",
        color: "#FFFFFF",
        size: 96,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "left",
        x: 60,
        y: 350,
        width: 600,
        height: 250,
        zIndex: 4
      },
      {
        id: "cta",
        type: "text",
        content: "Limited time offer - New members only",
        color: "#00D9FF",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        x: 60,
        y: 620,
        width: 500,
        height: 30,
        zIndex: 5
      }
    ]
  },
  {
    id: "fitness-bold-energy",
    name: "Bold Energy",
    category: "fitness",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#FFE600",
      secondary: "#000000",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#000000",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "diagonal-stripe",
        type: "shape",
        shape: "rectangle",
        color: "#FFE600",
        x: -200,
        y: 400,
        width: 1500,
        height: 120,
        zIndex: 1
      },
      {
        id: "headline",
        type: "text",
        content: "NO EXCUSES",
        color: "#FFFFFF",
        size: 84,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 300,
        width: 900,
        height: 100,
        zIndex: 2
      },
      {
        id: "subheadline",
        type: "text",
        content: "JUST RESULTS",
        color: "#FFE600",
        size: 84,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 580,
        width: 900,
        height: 100,
        zIndex: 2
      },
      {
        id: "cta-text",
        type: "text",
        content: "Start your transformation today →",
        color: "#888888",
        size: 20,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 750,
        width: 900,
        height: 30,
        zIndex: 3
      }
    ]
  },
  {
    id: "fitness-gradient-modern",
    name: "Gradient Workout",
    category: "fitness",
    size: "1080x1920",
    thumbnail: null,
    colors: {
      primary: "#667EEA",
      secondary: "#764BA2",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#667EEA",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "bottom-gradient",
        type: "shape",
        shape: "rectangle",
        color: "#764BA2",
        x: 0,
        y: 1200,
        width: 1080,
        height: 720,
        zIndex: 1
      },
      {
        id: "workout-title",
        type: "text",
        content: "30 MIN\nHIIT",
        color: "#FFFFFF",
        size: 120,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 700,
        width: 900,
        height: 300,
        zIndex: 2
      },
      {
        id: "workout-subtitle",
        type: "text",
        content: "HIGH INTENSITY INTERVAL TRAINING",
        color: "rgba(255,255,255,0.7)",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 1050,
        width: 900,
        height: 30,
        zIndex: 3
      },
      {
        id: "circle-decoration",
        type: "shape",
        shape: "circle",
        color: "rgba(255,255,255,0.1)",
        x: -150,
        y: 100,
        width: 400,
        height: 400,
        zIndex: 1
      },
      {
        id: "circle-decoration-2",
        type: "shape",
        shape: "circle",
        color: "rgba(255,255,255,0.1)",
        x: 800,
        y: 1500,
        width: 350,
        height: 350,
        zIndex: 1
      }
    ]
  },

  // ============================================
  // MARKETING TEMPLATES
  // ============================================
  {
    id: "sale-announcement",
    name: "Sale Announcement",
    category: "marketing",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#FF4757",
      secondary: "#2F3542",
      accent: "#FFA502"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#2F3542",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "sale-banner",
        type: "shape",
        shape: "rectangle",
        color: "#FF4757",
        x: 0,
        y: 400,
        width: 1080,
        height: 280,
        zIndex: 1
      },
      {
        id: "sale-text",
        type: "text",
        content: "MEGA SALE",
        color: "#FFFFFF",
        size: 96,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 440,
        width: 900,
        height: 120,
        zIndex: 2
      },
      {
        id: "discount",
        type: "text",
        content: "UP TO 70% OFF",
        color: "#FFA502",
        size: 48,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 560,
        width: 900,
        height: 60,
        zIndex: 3
      },
      {
        id: "cta",
        type: "text",
        content: "Shop Now",
        color: "#FFFFFF",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 750,
        width: 900,
        height: 40,
        zIndex: 4
      }
    ]
  },
  {
    id: "new-product",
    name: "New Product Launch",
    category: "marketing",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#00CEC9",
      secondary: "#0A0A0A",
      accent: "#FDCB6E"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#0A0A0A",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "new-badge",
        type: "shape",
        shape: "circle",
        color: "#00CEC9",
        x: 800,
        y: 80,
        width: 180,
        height: 180,
        zIndex: 1
      },
      {
        id: "new-text",
        type: "text",
        content: "NEW",
        color: "#0A0A0A",
        size: 36,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 830,
        y: 140,
        width: 120,
        height: 50,
        zIndex: 2
      },
      {
        id: "product-name",
        type: "text",
        content: "INTRODUCING\nOUR LATEST\nPRODUCT",
        color: "#FFFFFF",
        size: 64,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "left",
        x: 60,
        y: 500,
        width: 960,
        height: 250,
        zIndex: 3
      },
      {
        id: "tagline",
        type: "text",
        content: "Innovation meets excellence",
        color: "#00CEC9",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: true,
        underline: false,
        align: "left",
        x: 60,
        y: 780,
        width: 960,
        height: 40,
        zIndex: 4
      }
    ]
  },
  {
    id: "flash-sale-modern",
    name: "Flash Sale",
    category: "marketing",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#FF6B6B",
      secondary: "#FFFFFF",
      accent: "#2D3436"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "red-circle-1",
        type: "shape",
        shape: "circle",
        color: "#FF6B6B",
        x: -100,
        y: -100,
        width: 400,
        height: 400,
        zIndex: 1
      },
      {
        id: "red-circle-2",
        type: "shape",
        shape: "circle",
        color: "#FF6B6B",
        x: 780,
        y: 780,
        width: 400,
        height: 400,
        zIndex: 1
      },
      {
        id: "flash-text",
        type: "text",
        content: "FLASH",
        color: "#2D3436",
        size: 120,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 350,
        width: 900,
        height: 140,
        zIndex: 2
      },
      {
        id: "sale-text",
        type: "text",
        content: "SALE",
        color: "#FF6B6B",
        size: 120,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 480,
        width: 900,
        height: 140,
        zIndex: 2
      },
      {
        id: "timer-text",
        type: "text",
        content: "24 HOURS ONLY",
        color: "#2D3436",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 650,
        width: 900,
        height: 40,
        zIndex: 3
      }
    ]
  },
  {
    id: "premium-brand",
    name: "Premium Brand",
    category: "marketing",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#C9A962",
      secondary: "#1A1A1A",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A1A",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "gold-line-top",
        type: "shape",
        shape: "rectangle",
        color: "#C9A962",
        x: 100,
        y: 100,
        width: 880,
        height: 2,
        zIndex: 1
      },
      {
        id: "gold-line-bottom",
        type: "shape",
        shape: "rectangle",
        color: "#C9A962",
        x: 100,
        y: 1248,
        width: 880,
        height: 2,
        zIndex: 1
      },
      {
        id: "brand-text",
        type: "text",
        content: "LUXURY\nCOLLECTION",
        color: "#FFFFFF",
        size: 72,
        font: "'Playfair Display', serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 550,
        width: 900,
        height: 200,
        zIndex: 2
      },
      {
        id: "year-text",
        type: "text",
        content: "— 2025 —",
        color: "#C9A962",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 780,
        width: 900,
        height: 30,
        zIndex: 3
      }
    ]
  },

  // ============================================
  // QUOTE TEMPLATES
  // ============================================
  {
    id: "motivational-quote-1",
    name: "Motivational Quote Dark",
    category: "quotes",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#E17055",
      secondary: "#2D3436",
      accent: "#DFE6E9"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#2D3436",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "quote-mark",
        type: "text",
        content: "\"",
        color: "#E17055",
        size: 200,
        font: "'Playfair Display', serif",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        x: 60,
        y: 150,
        width: 200,
        height: 200,
        zIndex: 1
      },
      {
        id: "quote-text",
        type: "text",
        content: "The only way to do\ngreat work is to love\nwhat you do.",
        color: "#FFFFFF",
        size: 48,
        font: "'Playfair Display', serif",
        bold: false,
        italic: true,
        underline: false,
        align: "center",
        x: 90,
        y: 380,
        width: 900,
        height: 200,
        zIndex: 2
      },
      {
        id: "author",
        type: "text",
        content: "- Steve Jobs",
        color: "#E17055",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 620,
        width: 900,
        height: 40,
        zIndex: 3
      }
    ]
  },
  {
    id: "inspirational-quote-light",
    name: "Inspirational Quote Light",
    category: "quotes",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#6C5CE7",
      secondary: "#FFEAA7",
      accent: "#2D3436"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFEAA7",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "accent-circle",
        type: "shape",
        shape: "circle",
        color: "#6C5CE7",
        x: -100,
        y: -100,
        width: 400,
        height: 400,
        zIndex: 1
      },
      {
        id: "accent-circle-2",
        type: "shape",
        shape: "circle",
        color: "#A29BFE",
        x: 800,
        y: 1050,
        width: 400,
        height: 400,
        zIndex: 2
      },
      {
        id: "quote-text",
        type: "text",
        content: "Believe you can\nand you're\nhalfway there.",
        color: "#2D3436",
        size: 56,
        font: "'Playfair Display', serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 500,
        width: 900,
        height: 250,
        zIndex: 3
      },
      {
        id: "author",
        type: "text",
        content: "- Theodore Roosevelt",
        color: "#6C5CE7",
        size: 20,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 780,
        width: 900,
        height: 30,
        zIndex: 4
      }
    ]
  },
  {
    id: "quote-modern-gradient",
    name: "Modern Gradient Quote",
    category: "quotes",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#A855F7",
      secondary: "#3B82F6",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#3B82F6",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "gradient-overlay",
        type: "shape",
        shape: "rectangle",
        color: "#A855F7",
        x: 0,
        y: 540,
        width: 1080,
        height: 540,
        zIndex: 1
      },
      {
        id: "quote-text",
        type: "text",
        content: "Dream big.\nStart small.\nAct now.",
        color: "#FFFFFF",
        size: 64,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 380,
        width: 900,
        height: 320,
        zIndex: 2
      }
    ]
  },
  {
    id: "quote-clean-serif",
    name: "Clean Serif Quote",
    category: "quotes",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#1A1A1A",
      secondary: "#F8F8F8",
      accent: "#E0E0E0"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#F8F8F8",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "top-line",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A1A",
        x: 440,
        y: 350,
        width: 200,
        height: 3,
        zIndex: 1
      },
      {
        id: "bottom-line",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A1A",
        x: 440,
        y: 1000,
        width: 200,
        height: 3,
        zIndex: 1
      },
      {
        id: "quote-text",
        type: "text",
        content: "Simplicity is the\nultimate\nsophistication.",
        color: "#1A1A1A",
        size: 52,
        font: "'Playfair Display', serif",
        bold: false,
        italic: true,
        underline: false,
        align: "center",
        x: 90,
        y: 500,
        width: 900,
        height: 300,
        zIndex: 2
      },
      {
        id: "author",
        type: "text",
        content: "Leonardo da Vinci",
        color: "#888888",
        size: 16,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 850,
        width: 900,
        height: 30,
        zIndex: 3
      }
    ]
  },

  // ============================================
  // EVENT TEMPLATES
  // ============================================
  {
    id: "event-announcement",
    name: "Event Announcement",
    category: "events",
    size: "1080x1920",
    thumbnail: null,
    colors: {
      primary: "#F39C12",
      secondary: "#1A1A2E",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A2E",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "date-circle",
        type: "shape",
        shape: "circle",
        color: "#F39C12",
        x: 390,
        y: 300,
        width: 300,
        height: 300,
        zIndex: 1
      },
      {
        id: "date-text",
        type: "text",
        content: "15\nJAN",
        color: "#1A1A2E",
        size: 64,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 430,
        y: 370,
        width: 220,
        height: 150,
        zIndex: 2
      },
      {
        id: "event-title",
        type: "text",
        content: "GRAND\nOPENING",
        color: "#FFFFFF",
        size: 72,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 700,
        width: 900,
        height: 200,
        zIndex: 3
      },
      {
        id: "event-details",
        type: "text",
        content: "Join us for an unforgettable experience\n\nMain Street, Downtown\n7:00 PM - 11:00 PM",
        color: "#B0B0B0",
        size: 22,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 950,
        width: 900,
        height: 200,
        zIndex: 4
      }
    ]
  },
  {
    id: "event-neon-party",
    name: "Neon Party",
    category: "events",
    size: "1080x1920",
    thumbnail: null,
    colors: {
      primary: "#FF00FF",
      secondary: "#0A0A0A",
      accent: "#00FFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#0A0A0A",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "neon-circle-1",
        type: "shape",
        shape: "circle",
        color: "#FF00FF",
        x: -200,
        y: 200,
        width: 500,
        height: 500,
        zIndex: 1
      },
      {
        id: "neon-circle-2",
        type: "shape",
        shape: "circle",
        color: "#00FFFF",
        x: 780,
        y: 1300,
        width: 400,
        height: 400,
        zIndex: 1
      },
      {
        id: "party-title",
        type: "text",
        content: "NEON\nNIGHTS",
        color: "#FF00FF",
        size: 96,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 750,
        width: 900,
        height: 250,
        zIndex: 2
      },
      {
        id: "party-date",
        type: "text",
        content: "SATURDAY • DEC 31 • 10PM",
        color: "#00FFFF",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 1050,
        width: 900,
        height: 40,
        zIndex: 3
      },
      {
        id: "party-cta",
        type: "text",
        content: "FREE ENTRY BEFORE MIDNIGHT",
        color: "#FFFFFF",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 1700,
        width: 900,
        height: 30,
        zIndex: 4
      }
    ]
  },
  {
    id: "event-elegant-invitation",
    name: "Elegant Invitation",
    category: "events",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#D4AF37",
      secondary: "#1C1C1C",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#1C1C1C",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "border-frame",
        type: "shape",
        shape: "rectangle",
        color: "#D4AF37",
        x: 60,
        y: 60,
        width: 960,
        height: 1230,
        zIndex: 1
      },
      {
        id: "inner-frame",
        type: "shape",
        shape: "rectangle",
        color: "#1C1C1C",
        x: 70,
        y: 70,
        width: 940,
        height: 1210,
        zIndex: 2
      },
      {
        id: "you-are-invited",
        type: "text",
        content: "YOU ARE INVITED",
        color: "#D4AF37",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 350,
        width: 900,
        height: 30,
        zIndex: 3
      },
      {
        id: "event-name",
        type: "text",
        content: "Gala\nDinner",
        color: "#FFFFFF",
        size: 72,
        font: "'Playfair Display', serif",
        bold: false,
        italic: true,
        underline: false,
        align: "center",
        x: 90,
        y: 500,
        width: 900,
        height: 200,
        zIndex: 3
      },
      {
        id: "event-info",
        type: "text",
        content: "December 15, 2025\n7:00 PM\nThe Grand Ballroom",
        color: "#888888",
        size: 20,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 800,
        width: 900,
        height: 150,
        zIndex: 3
      }
    ]
  },

  // ============================================
  // MINIMAL TEMPLATES
  // ============================================
  {
    id: "minimal-announcement",
    name: "Minimal Announcement",
    category: "minimal",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#000000",
      secondary: "#FFFFFF",
      accent: "#E0E0E0"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "border",
        type: "shape",
        shape: "rectangle",
        color: "#000000",
        x: 40,
        y: 40,
        width: 1000,
        height: 1000,
        zIndex: 1
      },
      {
        id: "inner-bg",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 50,
        y: 50,
        width: 980,
        height: 980,
        zIndex: 2
      },
      {
        id: "main-text",
        type: "text",
        content: "Something\nnew is\ncoming",
        color: "#000000",
        size: 64,
        font: "'Playfair Display', serif",
        bold: false,
        italic: true,
        underline: false,
        align: "center",
        x: 90,
        y: 380,
        width: 900,
        height: 300,
        zIndex: 3
      },
      {
        id: "date",
        type: "text",
        content: "01.01.2025",
        color: "#666666",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 720,
        width: 900,
        height: 30,
        zIndex: 4
      }
    ]
  },
  {
    id: "minimal-text-only",
    name: "Clean Text",
    category: "minimal",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#1A1A1A",
      secondary: "#F5F5F5",
      accent: "#888888"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#F5F5F5",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "main-text",
        type: "text",
        content: "Less is\nmore.",
        color: "#1A1A1A",
        size: 96,
        font: "'Bebas Neue', sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 500,
        width: 900,
        height: 250,
        zIndex: 1
      },
      {
        id: "subtitle",
        type: "text",
        content: "- Ludwig Mies van der Rohe",
        color: "#888888",
        size: 16,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 780,
        width: 900,
        height: 30,
        zIndex: 2
      }
    ]
  },
  {
    id: "minimal-bold-statement",
    name: "Bold Statement",
    category: "minimal",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#000000",
      secondary: "#FFFFFF",
      accent: "#FF0000"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "main-text",
        type: "text",
        content: "MAKE\nIT\nHAPPEN",
        color: "#000000",
        size: 120,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 280,
        width: 900,
        height: 500,
        zIndex: 1
      },
      {
        id: "red-dot",
        type: "shape",
        shape: "circle",
        color: "#FF0000",
        x: 920,
        y: 720,
        width: 60,
        height: 60,
        zIndex: 2
      }
    ]
  },
  {
    id: "minimal-duotone",
    name: "Duotone Split",
    category: "minimal",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#000000",
      secondary: "#FFFFFF",
      accent: "#000000"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "black-half",
        type: "shape",
        shape: "rectangle",
        color: "#000000",
        x: 0,
        y: 0,
        width: 540,
        height: 1350,
        zIndex: 1
      },
      {
        id: "text-left",
        type: "text",
        content: "THINK",
        color: "#FFFFFF",
        size: 72,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 20,
        y: 600,
        width: 500,
        height: 100,
        zIndex: 2
      },
      {
        id: "text-right",
        type: "text",
        content: "CREATE",
        color: "#000000",
        size: 72,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 560,
        y: 600,
        width: 500,
        height: 100,
        zIndex: 2
      }
    ]
  },

  // ============================================
  // SOCIAL MEDIA TEMPLATES
  // ============================================
  {
    id: "instagram-story-promo",
    name: "Story Promo",
    category: "social",
    size: "1080x1920",
    thumbnail: null,
    colors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FF6B6B",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "bottom-section",
        type: "shape",
        shape: "rectangle",
        color: "#4ECDC4",
        x: 0,
        y: 960,
        width: 1080,
        height: 960,
        zIndex: 1
      },
      {
        id: "swipe-up",
        type: "text",
        content: "SWIPE UP",
        color: "#FFFFFF",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 390,
        y: 1750,
        width: 300,
        height: 40,
        zIndex: 2
      },
      {
        id: "main-text",
        type: "text",
        content: "NEW\nCOLLECTION",
        color: "#FFFFFF",
        size: 96,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 800,
        width: 900,
        height: 280,
        zIndex: 3
      }
    ]
  },
  {
    id: "carousel-slide",
    name: "Carousel Slide",
    category: "social",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#5B5EA6",
      secondary: "#F5F5F5",
      accent: "#9B9ECE"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#5B5EA6",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "content-box",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 80,
        y: 200,
        width: 920,
        height: 680,
        zIndex: 1
      },
      {
        id: "slide-number",
        type: "text",
        content: "01",
        color: "#9B9ECE",
        size: 120,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "left",
        x: 120,
        y: 250,
        width: 200,
        height: 140,
        zIndex: 2
      },
      {
        id: "slide-title",
        type: "text",
        content: "Key Point",
        color: "#5B5EA6",
        size: 48,
        font: "'Playfair Display', serif",
        bold: true,
        italic: false,
        underline: false,
        align: "left",
        x: 120,
        y: 420,
        width: 840,
        height: 60,
        zIndex: 3
      },
      {
        id: "slide-content",
        type: "text",
        content: "Add your content here. Make it engaging and easy to read.",
        color: "#666666",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        x: 120,
        y: 500,
        width: 840,
        height: 100,
        zIndex: 4
      }
    ]
  },
  {
    id: "social-tips-carousel",
    name: "Tips Carousel",
    category: "social",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#10B981",
      secondary: "#064E3B",
      accent: "#FFFFFF"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#064E3B",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "tip-badge",
        type: "shape",
        shape: "rounded-rectangle",
        color: "#10B981",
        x: 60,
        y: 60,
        width: 140,
        height: 50,
        zIndex: 1
      },
      {
        id: "tip-label",
        type: "text",
        content: "TIP #1",
        color: "#FFFFFF",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 70,
        y: 72,
        width: 120,
        height: 30,
        zIndex: 2
      },
      {
        id: "tip-title",
        type: "text",
        content: "Start with\nthe basics",
        color: "#FFFFFF",
        size: 72,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "left",
        x: 60,
        y: 350,
        width: 960,
        height: 200,
        zIndex: 2
      },
      {
        id: "tip-description",
        type: "text",
        content: "Master the fundamentals before moving to advanced techniques.",
        color: "#A7F3D0",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        x: 60,
        y: 600,
        width: 800,
        height: 80,
        zIndex: 2
      },
      {
        id: "swipe-indicator",
        type: "text",
        content: "→ Swipe for more",
        color: "#6EE7B7",
        size: 16,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "right",
        x: 660,
        y: 980,
        width: 360,
        height: 30,
        zIndex: 2
      }
    ]
  },
  {
    id: "social-question-poll",
    name: "Question Poll",
    category: "social",
    size: "1080x1920",
    thumbnail: null,
    colors: {
      primary: "#F59E0B",
      secondary: "#FFFBEB",
      accent: "#92400E"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFFBEB",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "question-mark-bg",
        type: "shape",
        shape: "circle",
        color: "#FEF3C7",
        x: 340,
        y: 300,
        width: 400,
        height: 400,
        zIndex: 1
      },
      {
        id: "question-mark",
        type: "text",
        content: "?",
        color: "#F59E0B",
        size: 200,
        font: "'Playfair Display', serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 340,
        y: 380,
        width: 400,
        height: 250,
        zIndex: 2
      },
      {
        id: "question-text",
        type: "text",
        content: "What's your\nbiggest\nchallenge?",
        color: "#92400E",
        size: 64,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 800,
        width: 900,
        height: 280,
        zIndex: 2
      },
      {
        id: "cta-text",
        type: "text",
        content: "TAP TO ANSWER",
        color: "#F59E0B",
        size: 20,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 1600,
        width: 900,
        height: 30,
        zIndex: 2
      }
    ]
  },

  // ============================================
  // ANNOUNCEMENT TEMPLATES
  // ============================================
  {
    id: "coming-soon",
    name: "Coming Soon",
    category: "announcements",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#8E44AD",
      secondary: "#1A1A1A",
      accent: "#E74C3C"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A1A",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "glow-circle",
        type: "shape",
        shape: "circle",
        color: "#8E44AD",
        x: 290,
        y: 290,
        width: 500,
        height: 500,
        zIndex: 1
      },
      {
        id: "inner-circle",
        type: "shape",
        shape: "circle",
        color: "#1A1A1A",
        x: 340,
        y: 340,
        width: 400,
        height: 400,
        zIndex: 2
      },
      {
        id: "coming-text",
        type: "text",
        content: "COMING\nSOON",
        color: "#FFFFFF",
        size: 64,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 340,
        y: 460,
        width: 400,
        height: 160,
        zIndex: 3
      },
      {
        id: "notify-text",
        type: "text",
        content: "Stay tuned for updates",
        color: "#8E44AD",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 290,
        y: 850,
        width: 500,
        height: 30,
        zIndex: 4
      }
    ]
  },
  {
    id: "now-open",
    name: "Now Open",
    category: "announcements",
    size: "1080x1350",
    thumbnail: null,
    colors: {
      primary: "#27AE60",
      secondary: "#FFFFFF",
      accent: "#2ECC71"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "top-accent",
        type: "shape",
        shape: "rectangle",
        color: "#27AE60",
        x: 0,
        y: 0,
        width: 1080,
        height: 300,
        zIndex: 1
      },
      {
        id: "now-open-text",
        type: "text",
        content: "WE'RE\nNOW OPEN!",
        color: "#27AE60",
        size: 72,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 550,
        width: 900,
        height: 200,
        zIndex: 2
      },
      {
        id: "details",
        type: "text",
        content: "Visit us today!\n\nMon-Fri: 9AM - 8PM\nSat-Sun: 10AM - 6PM",
        color: "#666666",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 800,
        width: 900,
        height: 200,
        zIndex: 3
      }
    ]
  },
  {
    id: "announcement-big-news",
    name: "Big News",
    category: "announcements",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#EF4444",
      secondary: "#FEF2F2",
      accent: "#991B1B"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FEF2F2",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "exclamation-bg",
        type: "shape",
        shape: "circle",
        color: "#EF4444",
        x: 415,
        y: 180,
        width: 250,
        height: 250,
        zIndex: 1
      },
      {
        id: "exclamation",
        type: "text",
        content: "!",
        color: "#FFFFFF",
        size: 150,
        font: "'Archivo Black', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 415,
        y: 210,
        width: 250,
        height: 180,
        zIndex: 2
      },
      {
        id: "big-news-text",
        type: "text",
        content: "BIG NEWS",
        color: "#991B1B",
        size: 96,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 500,
        width: 900,
        height: 120,
        zIndex: 2
      },
      {
        id: "announcement-details",
        type: "text",
        content: "We have something exciting to share",
        color: "#EF4444",
        size: 24,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 640,
        width: 900,
        height: 40,
        zIndex: 2
      },
      {
        id: "stay-tuned",
        type: "text",
        content: "Stay tuned →",
        color: "#991B1B",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 900,
        width: 900,
        height: 30,
        zIndex: 2
      }
    ]
  },
  {
    id: "announcement-thank-you",
    name: "Thank You",
    category: "announcements",
    size: "1080x1080",
    thumbnail: null,
    colors: {
      primary: "#EC4899",
      secondary: "#FDF2F8",
      accent: "#9D174D"
    },
    elements: [
      {
        id: "background",
        type: "shape",
        shape: "rectangle",
        color: "#FDF2F8",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        zIndex: -1,
        isBackground: true,
        name: "Background"
      },
      {
        id: "heart-shape",
        type: "shape",
        shape: "heart",
        color: "#EC4899",
        x: 440,
        y: 200,
        width: 200,
        height: 200,
        zIndex: 1
      },
      {
        id: "thank-you-text",
        type: "text",
        content: "Thank You",
        color: "#9D174D",
        size: 72,
        font: "'Playfair Display', serif",
        bold: false,
        italic: true,
        underline: false,
        align: "center",
        x: 90,
        y: 480,
        width: 900,
        height: 100,
        zIndex: 2
      },
      {
        id: "milestone-text",
        type: "text",
        content: "10,000\nFOLLOWERS",
        color: "#EC4899",
        size: 56,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 600,
        width: 900,
        height: 150,
        zIndex: 2
      },
      {
        id: "gratitude-text",
        type: "text",
        content: "Your support means everything to us ♥",
        color: "#9D174D",
        size: 18,
        font: "Montserrat, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 800,
        width: 900,
        height: 30,
        zIndex: 2
      }
    ]
  }
];

// Blank templates for starting fresh
export const blankTemplates = [
  { id: "blank-square", name: "Blank Square", size: "1080x1080", category: "blank" },
  { id: "blank-portrait", name: "Blank Portrait", size: "1080x1350", category: "blank" },
  { id: "blank-story", name: "Blank Story", size: "1080x1920", category: "blank" },
  { id: "blank-landscape", name: "Blank Landscape", size: "1920x1080", category: "blank" }
];

export default {
  templateCategories,
  templates,
  blankTemplates
};
