// ─── Marketplace Initial Data & Constants ─────────────────────────────────────
// All multilingual initial data for the Admin Marketplace module.
// Languages: EN (English), DE (Deutsch), FR (Français), IT (Italiano), ES (Español)
//
// Translated fields: productName, infoText
// Single-language fields: brandName, articleNo, price, link, picture, isPinned, isActive

export const initialProducts = [
  {
    id: "1",
    brandName: "Nike",
    productName: {
      en: "Air Jordan 1 Retro High",
      de: "Air Jordan 1 Retro High",
      fr: "Air Jordan 1 Retro High",
      it: "Air Jordan 1 Retro High",
      es: "Air Jordan 1 Retro High",
    },
    articleNo: "555088-101",
    price: "180.00",
    link: "https://nike.com/air-jordan-1",
    picture:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    isPinned: false,
    infoText: {
      en: "",
      de: "",
      fr: "",
      it: "",
      es: "",
    },
    isActive: true,
  },
  {
    id: "2",
    brandName: "Apple",
    productName: {
      en: "iPhone 15 Pro",
      de: "iPhone 15 Pro",
      fr: "iPhone 15 Pro",
      it: "iPhone 15 Pro",
      es: "iPhone 15 Pro",
    },
    articleNo: "MPXN3LL/A",
    price: "999.00",
    link: "https://apple.com/iphone-15",
    picture:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    isPinned: true,
    infoText: {
      en: "Latest iPhone model with titanium design and advanced camera system",
      de: "Neuestes iPhone-Modell mit Titan-Design und fortschrittlichem Kamerasystem",
      fr: "Dernier modèle d'iPhone avec design en titane et système de caméra avancé",
      it: "Ultimo modello di iPhone con design in titanio e sistema fotocamera avanzato",
      es: "Último modelo de iPhone con diseño de titanio y sistema de cámara avanzado",
    },
    isActive: true,
  },
  {
    id: "3",
    brandName: "Sony",
    productName: {
      en: "WH-1000XM5 Headphones",
      de: "WH-1000XM5 Kopfhörer",
      fr: "Casque WH-1000XM5",
      it: "Cuffie WH-1000XM5",
      es: "Auriculares WH-1000XM5",
    },
    articleNo: "WH1000XM5/B",
    price: "399.99",
    link: "https://sony.com/wh-1000xm5",
    picture:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    isPinned: false,
    infoText: {
      en: "Industry-leading noise cancellation with 30-hour battery life",
      de: "Branchenführende Geräuschunterdrückung mit 30 Stunden Akkulaufzeit",
      fr: "Réduction de bruit de pointe avec 30 heures d'autonomie",
      it: "Cancellazione del rumore leader del settore con 30 ore di autonomia",
      es: "Cancelación de ruido líder en la industria con 30 horas de batería",
    },
    isActive: false,
  },
];

// ─── Sidebar Initial Data (shared across pages) ──────────────────────────────

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
  { id: 1, title: "Oxygen Gym Membership", expiryDate: "June 30, 2025", status: "Expiring Soon" },
  { id: 2, title: "Timathy Fitness Equipment Lease", expiryDate: "July 15, 2025", status: "Expiring Soon" },
  { id: 3, title: "Studio Space Rental", expiryDate: "August 5, 2025", status: "Expiring Soon" },
  { id: 4, title: "Insurance Policy", expiryDate: "September 10, 2025", status: "Expiring Soon" },
  { id: 5, title: "Software License", expiryDate: "October 20, 2025", status: "Expiring Soon" },
];
