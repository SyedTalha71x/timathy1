// Platform size presets with aspect ratios
export const platformSizes = {
  instagram: [
    { id: "feed-square", name: "Feed (Square)", size: "1080x1080", ratio: "1:1", icon: "square" },
    { id: "feed-vertical", name: "Feed (Vertical)", size: "1080x1350", ratio: "4:5", icon: "portrait" },
    { id: "story", name: "Story/Reels", size: "1080x1920", ratio: "9:16", icon: "story" },
    { id: "landscape", name: "Landscape", size: "1080x566", ratio: "1.91:1", icon: "landscape" }
  ],
  facebook: [
    { id: "feed-square", name: "Feed (Square)", size: "1200x1200", ratio: "1:1", icon: "square" },
    { id: "feed-vertical", name: "Feed (Vertical)", size: "1200x1500", ratio: "4:5", icon: "portrait" },
    { id: "story", name: "Story", size: "1080x1920", ratio: "9:16", icon: "story" },
    { id: "cover", name: "Cover Photo", size: "820x312", ratio: "~2.6:1", icon: "cover" },
    { id: "event", name: "Event Cover", size: "1920x1080", ratio: "16:9", icon: "event" }
  ],
  both: [
    { id: "universal", name: "Universal", size: "1200x1200", ratio: "1:1", icon: "square" },
    { id: "mobile-feed", name: "Mobile Feed", size: "1080x1350", ratio: "4:5", icon: "portrait" },
    { id: "story", name: "Stories/Reels", size: "1080x1920", ratio: "9:16", icon: "story" }
  ],
  print: [
    { id: "a4", name: "A4", size: "2480x3508", ratio: "1:1.41", icon: "document" },
    { id: "letter", name: "Letter", size: "2550x3300", ratio: "1:1.29", icon: "document" },
    { id: "poster", name: "Poster", size: "3000x4000", ratio: "3:4", icon: "poster" }
  ],
  presentation: [
    { id: "16-9", name: "Widescreen", size: "1920x1080", ratio: "16:9", icon: "presentation" },
    { id: "4-3", name: "Standard", size: "1024x768", ratio: "4:3", icon: "presentation" }
  ]
};

// Available shapes with paths
export const shapes = [
  { id: "rectangle", name: "Rectangle", icon: "Square" },
  { id: "rounded-rectangle", name: "Rounded Rectangle", icon: "RectangleHorizontal" },
  { id: "circle", name: "Circle", icon: "Circle" },
  { id: "triangle", name: "Triangle", icon: "Triangle" },
  { id: "star", name: "Star", icon: "Star" },
  { id: "heart", name: "Heart", icon: "Heart" },
  { id: "hexagon", name: "Hexagon", icon: "Hexagon" },
  { id: "arrow-right", name: "Arrow", icon: "ArrowRight" },
  { id: "diamond", name: "Diamond", icon: "Diamond" },
  { id: "pentagon", name: "Pentagon", icon: "Pentagon" }
];

// Font families available
export const fontFamilies = [
  { id: "inter", name: "Inter", family: "Inter, sans-serif", category: "sans-serif" },
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif", category: "serif" },
  { id: "montserrat", name: "Montserrat", family: "Montserrat, sans-serif", category: "sans-serif" },
  { id: "roboto", name: "Roboto", family: "Roboto, sans-serif", category: "sans-serif" },
  { id: "open-sans", name: "Open Sans", family: "'Open Sans', sans-serif", category: "sans-serif" },
  { id: "lato", name: "Lato", family: "Lato, sans-serif", category: "sans-serif" },
  { id: "poppins", name: "Poppins", family: "Poppins, sans-serif", category: "sans-serif" },
  { id: "oswald", name: "Oswald", family: "Oswald, sans-serif", category: "display" },
  { id: "raleway", name: "Raleway", family: "Raleway, sans-serif", category: "sans-serif" },
  { id: "merriweather", name: "Merriweather", family: "Merriweather, serif", category: "serif" },
  { id: "dancing-script", name: "Dancing Script", family: "'Dancing Script', cursive", category: "handwriting" },
  { id: "bebas-neue", name: "Bebas Neue", family: "'Bebas Neue', sans-serif", category: "display" },
  { id: "archivo-black", name: "Archivo Black", family: "'Archivo Black', sans-serif", category: "display" }
];

// Color palettes for quick selection
export const colorPalettes = [
  {
    id: "vibrant",
    name: "Vibrant",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E0BBE4", "#D4A5A5"]
  },
  {
    id: "bold",
    name: "Bold",
    colors: ["#E63946", "#1D3557", "#457B9D", "#F4A261", "#2A9D8F", "#264653", "#E9C46A"]
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: ["#000000", "#1A1A1A", "#333333", "#4D4D4D", "#666666", "#808080", "#FFFFFF"]
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: ["#FF7E5F", "#FEB47B", "#FF6F61", "#FFE66D", "#F7797D", "#C471ED", "#F8B500"]
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#023E8A", "#03045E", "#48CAE4"]
  },
  {
    id: "earth",
    name: "Earth",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#D2B48C", "#DEB887", "#F5DEB3", "#3D5A3D"]
  },
  {
    id: "neon",
    name: "Neon",
    colors: ["#FF00FF", "#00FFFF", "#FF1493", "#7FFF00", "#FFD700", "#FF4500", "#8A2BE2"]
  }
];

// Default folder colors
export const folderColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#6366F1"  // Indigo
];

export default {
  platformSizes,
  shapes,
  fontFamilies,
  colorPalettes,
  folderColors
};
