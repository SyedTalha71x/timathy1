// Design templates organized by category
export const templateCategories = [
  { id: "all", name: "All Templates", icon: "Grid3X3" },
  { id: "social", name: "Social Media", icon: "Instagram" },
  { id: "marketing", name: "Marketing", icon: "Megaphone" },
  { id: "fitness", name: "Fitness & Gym", icon: "Dumbbell" },
  { id: "events", name: "Events", icon: "Calendar" },
  { id: "quotes", name: "Quotes", icon: "Quote" },
  { id: "announcements", name: "Announcements", icon: "Bell" },
  { id: "minimal", name: "Minimal", icon: "Minus" }
];

// Pre-designed templates with elements
export const templates = [
  // Fitness Templates
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A2E",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#0D0D0D",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
        zIndex: 5
      }
    ]
  },
  {
    id: "workout-schedule",
    name: "Workout Schedule",
    category: "fitness",
    size: "1080x1920",
    thumbnail: null,
    colors: {
      primary: "#7C3AED",
      secondary: "#1F1F1F",
      accent: "#A78BFA"
    },
    elements: [
      {
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#1F1F1F",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        locked: true,
        zIndex: 0
      },
      {
        id: "header-bg",
        type: "shape",
        shape: "rectangle",
        color: "#7C3AED",
        x: 0,
        y: 0,
        width: 1080,
        height: 350,
        locked: false,
        zIndex: 1
      },
      {
        id: "title",
        type: "text",
        content: "THIS WEEK'S\nWORKOUT PLAN",
        color: "#FFFFFF",
        size: 56,
        font: "'Bebas Neue', sans-serif",
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        x: 90,
        y: 100,
        width: 900,
        height: 150,
        locked: false,
        zIndex: 2
      }
    ]
  },
  
  // Marketing Templates
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#2F3542",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#0A0A0A",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
        zIndex: 4
      }
    ]
  },
  
  // Quote Templates
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#2D3436",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#FFEAA7",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
        zIndex: 4
      }
    ]
  },
  
  // Event Templates
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A2E",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
        zIndex: 4
      }
    ]
  },
  
  // Minimal Templates
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#F5F5F5",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
        zIndex: 2
      }
    ]
  },
  
  // Social Media Templates
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
        id: "bg-gradient-1",
        type: "shape",
        shape: "rectangle",
        color: "#FF6B6B",
        x: 0,
        y: 0,
        width: 1080,
        height: 960,
        locked: true,
        zIndex: 0
      },
      {
        id: "bg-gradient-2",
        type: "shape",
        shape: "rectangle",
        color: "#4ECDC4",
        x: 0,
        y: 960,
        width: 1080,
        height: 960,
        locked: true,
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
        locked: false,
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
        locked: false,
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#5B5EA6",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
        zIndex: 4
      }
    ]
  },
  
  // Announcement Templates
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#1A1A1A",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        locked: false,
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
        id: "bg-1",
        type: "shape",
        shape: "rectangle",
        color: "#FFFFFF",
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        locked: true,
        zIndex: 0
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
        locked: false,
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
        locked: false,
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
        locked: false,
        zIndex: 3
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
