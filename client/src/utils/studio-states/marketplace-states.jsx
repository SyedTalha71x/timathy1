// Marketplace Default Data
// This file contains initial/dummy data for the marketplace
// Replace with API calls when backend is ready

export const defaultCategories = [
  { id: 1, name: "Shoes", icon: "👟" },
  { id: 2, name: "Apparel", icon: "👕" },
  { id: 3, name: "Equipment", icon: "🏋️" },
  { id: 4, name: "Accessories", icon: "🎒" },
  { id: 5, name: "Nutrition", icon: "🥤" },
]

export const defaultBrands = [
  { id: 1, name: "JORDAN" },
  { id: 2, name: "NIKE" },
  { id: 3, name: "ADIDAS" },
  { id: 4, name: "PUMA" },
  { id: 5, name: "UNDER ARMOUR" },
  { id: 6, name: "REEBOK" },
]

export const defaultProducts = [
  {
    id: 1,
    name: "Mens Jordan Trainer",
    brand: "JORDAN",
    articleNo: "456",
    price: 89.99,
    originalPrice: null, // No discount
    currency: "€",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1xUYD-Gqa5d08aoyqp4g1i6vs4lySrH4cA&s",
    link: "https://example.com/product/1",
    pinned: true,
    infoText: "Premium basketball shoes with enhanced ankle support and cushioning. Made from breathable materials.",
    categoryId: 1,
    inStock: true,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 2,
    name: "Sneakers Off-White 2024",
    brand: "NIKE",
    articleNo: "123",
    price: 149.99,
    originalPrice: 199.99, // Discounted from 199.99€
    currency: "€",
    image: "https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/105/365/563/original/1507255_01.jpg.jpeg?action=crop&width=750",
    link: "https://example.com/product/2",
    pinned: false,
    infoText: "Limited edition collaboration with Off-White. Features deconstructed design elements.",
    categoryId: 1,
    inStock: true,
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: 3,
    name: "Air Max 90 Essential",
    brand: "NIKE",
    articleNo: "AM90-001",
    price: 129.99,
    originalPrice: null,
    currency: "€",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99a38ed6-99d7-4d6a-9156-d0e7fcfb56f0/air-max-90-shoes-N7Tbw0.png",
    link: "https://example.com/product/3",
    pinned: false,
    infoText: "Classic Air Max 90 design with visible Air cushioning and premium leather overlays.",
    categoryId: 1,
    inStock: true,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 4,
    name: "Ultraboost Light Running",
    brand: "ADIDAS",
    articleNo: "UB-2024",
    price: 139.99,
    originalPrice: 179.99, // 22% off
    currency: "€",
    image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_Light_Running_Shoes_Black_HQ6339_01_standard.jpg",
    link: "https://example.com/product/4",
    pinned: true,
    infoText: "30% lighter than previous Ultraboost models. Features Light BOOST midsole for responsive cushioning.",
    categoryId: 1,
    inStock: true,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 5,
    name: "Pro Training Shorts",
    brand: "NIKE",
    articleNo: "NK-SH-001",
    price: 34.99,
    originalPrice: null,
    currency: "€",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d6051653-33e5-47ba-9d74-87c46a4bf1e5/pro-dri-fit-fitness-shorts-KXK6rl.png",
    link: "https://example.com/product/5",
    pinned: false,
    infoText: "Dri-FIT technology keeps you dry and comfortable. Elastic waistband with internal drawcord.",
    categoryId: 2,
    inStock: true,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 6,
    name: "Fleece Training Hoodie",
    brand: "UNDER ARMOUR",
    articleNo: "UA-HD-042",
    price: 49.99,
    originalPrice: 69.99, // Sale!
    currency: "€",
    image: "https://underarmour.scene7.com/is/image/Underarmour/V5-1373358-012_FC?rp=standard-0pad%7CpdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on%2Con&bgc=f0f0f0&wid=566&hei=708&size=566%2C708",
    link: "https://example.com/product/6",
    pinned: false,
    infoText: "Soft, midweight cotton-blend fleece. Front kangaroo pocket and ribbed cuffs.",
    categoryId: 2,
    inStock: true,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 7,
    name: "Resistance Bands Set",
    brand: "UNDER ARMOUR",
    articleNo: "UA-RB-005",
    price: 24.99,
    originalPrice: null,
    currency: "€",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop",
    link: "https://example.com/product/7",
    pinned: false,
    infoText: "Set of 5 resistance bands with varying resistance levels. Includes carrying bag and exercise guide.",
    categoryId: 3,
    inStock: true,
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: 8,
    name: "Premium Yoga Mat",
    brand: "PUMA",
    articleNo: "PM-YM-101",
    price: 39.99,
    originalPrice: 54.99, // Discount
    currency: "€",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    link: "https://example.com/product/8",
    pinned: false,
    infoText: "6mm thick non-slip yoga mat. Made from eco-friendly TPE material. Includes carrying strap.",
    categoryId: 3,
    inStock: true,
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: 9,
    name: "Sports Duffle Bag",
    brand: "ADIDAS",
    articleNo: "AD-DB-033",
    price: 59.99,
    originalPrice: null,
    currency: "€",
    image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ae7f9dff43324a5b88e1af1600e0b399_9366/Essentials_Training_Duffel_Bag_Medium_Black_HT4749_01_standard.jpg",
    link: "https://example.com/product/9",
    pinned: false,
    infoText: "Medium-sized duffle with separate shoe compartment. Water-resistant bottom panel.",
    categoryId: 4,
    inStock: true,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 10,
    name: "Performance Backpack",
    brand: "NIKE",
    articleNo: "NK-BP-022",
    price: 79.99,
    originalPrice: 99.99, // Sale
    currency: "€",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e9ef7ca9-1a43-4ccd-acf3-4e2f5bbd8c89/brasilia-9-5-training-backpack-extra-large-30l-F9xRmD.png",
    link: "https://example.com/product/10",
    pinned: true,
    infoText: "Extra-large 30L capacity. Padded laptop sleeve and multiple compartments for organization.",
    categoryId: 4,
    inStock: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 11,
    name: "Whey Protein Isolate 2kg",
    brand: "UNDER ARMOUR",
    articleNo: "UA-WP-2KG",
    price: 54.99,
    originalPrice: 64.99,
    currency: "€",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&h=500&fit=crop",
    link: "https://example.com/product/11",
    pinned: false,
    infoText: "Premium whey protein isolate with 25g protein per serving. Available in chocolate and vanilla.",
    categoryId: 5,
    inStock: true,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 12,
    name: "Energy Gel Pack (12x)",
    brand: "PUMA",
    articleNo: "PM-EG-12",
    price: 29.99,
    originalPrice: null,
    currency: "€",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=500&fit=crop",
    link: "https://example.com/product/12",
    pinned: false,
    infoText: "Quick-absorbing energy gels for endurance sports. Mixed fruit flavors. 100 calories per gel.",
    categoryId: 5,
    inStock: false,
    createdAt: Date.now() - 86400000 * 8,
  },
]

// Helper function to format price with currency
export const formatPrice = (price, currency = "€") => {
  return `${price.toFixed(2).replace(".", ",")} ${currency}`
}

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// Helper function to check if product is on sale
export const isOnSale = (product) => {
  return product.originalPrice !== null && product.originalPrice > product.price
}
