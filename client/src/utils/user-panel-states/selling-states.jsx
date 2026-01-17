/**
 * Selling States & Configuration
 * 
 * Zentrale Konfiguration für das Verkaufsmodul.
 * Diese Datei wird später mit dem Backend-Konfigurationsmenü verknüpft.
 */

// =============================================================================
// WÄHRUNGSKONFIGURATION
// =============================================================================
// Diese Einstellung wird später vom Backend/Konfigurationsmenü gesetzt.
// Alle Komponenten im Selling-Modul nutzen diese zentrale Definition.

export const currencyConfig = {
  code: "EUR",           // ISO 4217 Währungscode (EUR, USD, GBP, CHF, etc.)
  symbol: "€",           // Währungssymbol
  name: "Euro",          // Voller Name
  position: "after",     // "before" = $10.00, "after" = 10.00 €
  decimalSeparator: ",", // Dezimaltrennzeichen
  thousandsSeparator: ".", // Tausendertrennzeichen
  decimals: 2,           // Anzahl Dezimalstellen
}

// Vordefinierte Währungspresets für einfache Umschaltung im Konfigurationsmenü
export const currencyPresets = {
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    position: "after",
    decimalSeparator: ",",
    thousandsSeparator: ".",
    decimals: 2,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    position: "before",
    decimalSeparator: ".",
    thousandsSeparator: ",",
    decimals: 2,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    position: "before",
    decimalSeparator: ".",
    thousandsSeparator: ",",
    decimals: 2,
  },
  CHF: {
    code: "CHF",
    symbol: "CHF",
    name: "Swiss Franc",
    position: "before",
    decimalSeparator: ".",
    thousandsSeparator: "'",
    decimals: 2,
  },
}

// =============================================================================
// WÄHRUNGS-FORMATIERUNG
// =============================================================================

/**
 * Formatiert einen Betrag als Währungsstring
 * @param {number} amount - Der zu formatierende Betrag
 * @param {boolean} showSymbol - Ob das Währungssymbol angezeigt werden soll (Standard: true)
 * @returns {string} Formatierter Währungsstring
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    amount = 0
  }

  const absAmount = Math.abs(amount)
  const formattedNumber = absAmount.toFixed(currencyConfig.decimals)
  
  // Tausendertrennzeichen hinzufügen
  const parts = formattedNumber.split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currencyConfig.thousandsSeparator)
  const formatted = parts.join(currencyConfig.decimalSeparator)

  if (!showSymbol) {
    return amount < 0 ? `-${formatted}` : formatted
  }

  const sign = amount < 0 ? "-" : ""
  
  if (currencyConfig.position === "before") {
    return `${sign}${currencyConfig.symbol}${formatted}`
  } else {
    return `${sign}${formatted} ${currencyConfig.symbol}`
  }
}

/**
 * Gibt das Währungssymbol zurück
 * @returns {string} Währungssymbol
 */
export const getCurrencySymbol = () => currencyConfig.symbol

/**
 * Gibt den Währungscode zurück (z.B. EUR, USD)
 * @returns {string} Währungscode
 */
export const getCurrencyCode = () => currencyConfig.code

// =============================================================================
// MWST-KONFIGURATION
// =============================================================================
// Standard-MwSt-Sätze (können später ebenfalls vom Backend kommen)

export const vatConfig = {
  defaultRate: 19,
  rates: [
    { value: 19, label: "19% (eat-in)", description: "Standard rate" },
    { value: 7, label: "7% (take-away)", description: "Reduced rate" },
  ],
}

// =============================================================================
// ZAHLUNGSMETHODEN
// =============================================================================
// Verfügbare Zahlungsmethoden (können später vom Backend konfiguriert werden)

export const paymentMethods = [
  { id: "cash", name: "Cash", icon: "banknote", enabled: true },
  { id: "card", name: "Card", icon: "credit-card", enabled: true },
  { id: "direct_debit", name: "Direct Debit", icon: "building-2", enabled: true, requiresMember: true },
]

// =============================================================================
// PRODUKTE
// =============================================================================

export const productsMainData = [
  {
    id: 1,
    name: "Premium Orange Sneakers",
    brandName: "ORANGEWEAR",
    price: 129.99,
    image: null,
    articalNo: "ORG-001",
    paymentOption: "Card",
    type: "product",
    position: 0,
    link: "https://example.com/product1",
    vatRate: 19,
    vatSelectable: false,
  },
  {
    id: 2,
    name: "Athletic Shoes",
    brandName: "ORANGEFIT",
    price: 189.5,
    image: null,
    articalNo: "ORG-002",
    paymentOption: "Card",
    type: "product",
    position: 1,
    link: "",
    vatRate: 7,
    vatSelectable: true,
  },
  {
    id: 3,
    name: "Pro",
    brandName: "SportMax",
    price: 79.99,
    image: null,
    articalNo: "ORG-003",
    paymentOption: "Cash",
    type: "product",
    position: 2,
    link: "",
    vatRate: 19,
    vatSelectable: false,
  },
  {
    id: 4,
    name: "Fitness Resistance Bands Set with Handles",
    brandName: "FlexFit",
    price: 34.99,
    image: null,
    articalNo: "ORG-004",
    paymentOption: "Card",
    type: "product",
    position: 3,
    link: "",
    vatRate: 7,
    vatSelectable: true,
  },
]

// =============================================================================
// SERVICES
// =============================================================================

export const serviceMainData = [
  {
    id: 101,
    name: "Personal Training",
    price: 75.0,
    image: null,
    paymentOption: "Card",
    type: "service",
    position: 0,
    link: "https://example.com/training",
    vatRate: 19,
    vatSelectable: false,
  },
  {
    id: 102,
    name: "Nutrition Consultation Session",
    price: 50.0,
    image: null,
    paymentOption: "Cash",
    type: "service",
    position: 1,
    link: "",
    vatRate: 7,
    vatSelectable: true,
  },
  {
    id: 103,
    name: "Yoga",
    price: 25.0,
    image: null,
    paymentOption: "Cash",
    type: "service",
    position: 2,
    link: "",
    vatRate: 19,
    vatSelectable: false,
  },
]

// =============================================================================
// VERKAUFSHISTORIE (Demo-Daten)
// =============================================================================

export const sellingMainData = [
  {
    id: 1,
    date: "2024-01-15 14:30:22",
    member: "John Doe",
    email: "johndoe@gmail.com",
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
    email: "",
    memberType: "N/A",
    items: [{ name: "Athletic Shoes", quantity: 1, price: 189.5, type: "Product", vatRate: 7 }],
    totalAmount: 189.5,
    paymentMethod: "Cash",
    soldBy: "Sarah Johnson",
    invoiceNumber: "INV-2024-002",
    canCancel: true,
  },
  {
    id: 3,
    date: "2024-01-13 16:45:12",
    member: "Jane Smith",
    memberType: "Temporary Member",
    email: "janesmith@gmail.com",
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
