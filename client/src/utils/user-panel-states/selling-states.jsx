export const productsMainData = [
  {
    id: 1,
    name: "Premium Orange Sneakers",
    brandName: "ORANGEWEAR",
    price: 129.99,
    image: null, // No image - will show orange background
    articalNo: "ORG-001",
    paymentOption: "Card",
    type: "product",
    position: 0,
    link: "https://example.com/product1",
    vatRate: 19, // Changed from string "19" to number 19
    vatSelectable: false,
  },
  {
    id: 2,
    name: "Athletic Shoes",
    brandName: "ORANGEFIT",
    price: 189.5,
    image: null, // No image - will show orange background
    articalNo: "ORG-002",
    paymentOption: "Card",
    type: "product",
    position: 1,
    link: "",
    vatRate: 7, // Changed from string "7" to number 7
    vatSelectable: true,
  },
  {
    id: 3,
    name: "Pro",
    brandName: "SportMax",
    price: 79.99,
    image: null, // Short name example
    articalNo: "ORG-003",
    paymentOption: "Cash",
    type: "product",
    position: 2,
    link: "",
    vatRate: 19, // Changed from string "19" to number 19
    vatSelectable: false,
  },
  {
    id: 4,
    name: "Fitness Resistance Bands Set with Handles",
    brandName: "FlexFit",
    price: 34.99,
    image: null, // Long name example
    articalNo: "ORG-004",
    paymentOption: "Card",
    type: "product",
    position: 3,
    link: "",
    vatRate: 7, // Changed from string "7" to number 7
    vatSelectable: true,
  },
]

export const serviceMainData = [
  {
    id: 101,
    name: "Personal Training",
    price: 75.0,
    image: null, // No image - will show orange background
    paymentOption: "Card",
    type: "service",
    position: 0,
    link: "https://example.com/training",
    vatRate: 19, // Changed from string "19" to number 19
    vatSelectable: false,
  },
  {
    id: 102,
    name: "Nutrition Consultation Session",
    price: 50.0,
    image: null, // No image - will show orange background
    paymentOption: "Cash",
    type: "service",
    position: 1,
    link: "",
    vatRate: 7, // Changed from string "7" to number 7
    vatSelectable: true,
  },
  {
    id: 103,
    name: "Yoga",
    price: 25.0,
    image: null, // Short name example
    paymentOption: "Cash",
    type: "service",
    position: 2,
    link: "",
    vatRate: 19, // Changed from string "19" to number 19
    vatSelectable: false,
  },
]

export const sellingMainData = [
  {
    id: 1,
    date: "2024-01-15 14:30:22",
    member: "John Doe",
    email: 'johndoe@gmail.com',
    memberType: "Full Member",
    items: [
      { name: "Premium Orange Sneakers", quantity: 2, price: 129.99, type: "Product", vatRate: 19 },
      { name: "Personal Training", quantity: 1, price: 75.0, type: "Service", vatRate: 19 },
    ],
    totalAmount: 334.98,
    paymentMethod: "Credit Card",
    soldBy: "John Smith",
    invoiceNumber: "INV-2024-001",
    canCancel: true,
  },
  {
    id: 2,
    date: "2024-01-14 09:15:45",
    member: "No Member",
    email: '',
    memberType: "N/A",
    items: [{ name: "Athletic Shoes", quantity: 1, price: 189.5, type: "Product", vatRate: 7 }],
    totalAmount: 189.5,
    paymentMethod: "Cash",
    soldBy: "Sarah Johnson",
    invoiceNumber: "INV-2024-002",
    canCancel: true, // Changed from false to true - now shows X button
  },
  {
    id: 3,
    date: "2024-01-13 16:45:12",
    member: "Jane Smith",
    memberType: "Temporary Member",
    email: 'janesmith@gmail.com',
    items: [
      { name: "Nutrition Consultation Session", quantity: 3, price: 50.0, type: "Service", vatRate: 7 },
      { name: "Premium Orange Sneakers", quantity: 1, price: 129.99, type: "Product", vatRate: 19 },
    ],
    totalAmount: 279.99,
    paymentMethod: "Debit Card",
    soldBy: "Mike Davis",
    invoiceNumber: "INV-2024-003",
    canCancel: true,
  },
]
