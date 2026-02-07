// ============================================
// Customers / Studios Page — States & Data
// Single Source of Truth for all customers page data
// ============================================

// ============================================
// STUDIO DATA
// ============================================
export const studioDataNew = [
  {
    id: 1, studioNumber: 10001, name: "FitZone München", image: "",
    email: "info@fitzone-muenchen.de", phone: "+49 89 1234567", website: "https://www.fitzone-muenchen.de",
    street: "Leopoldstraße 42", zipCode: "80802", city: "München", country: "DE",
    ownerName: "Thomas Berger", about: "Premium fitness studio in the heart of Munich with state-of-the-art equipment.",
    isActive: true, franchiseId: 1, contractStart: "2023-01-01", contractEnd: "2025-12-31",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "DE123456789", iban: "DE89370400440532013000",
    creditorName: "FitZone GmbH", creditorId: "DE98ZZZ09999999001", vatNumber: "DE123456789", bankName: "Commerzbank", bic: "COBADEFFXXX",
    openingHours: { monday: "06:00–22:00", tuesday: "06:00–22:00", wednesday: "06:00–22:00", thursday: "06:00–22:00", friday: "06:00–21:00", saturday: "08:00–18:00", sunday: "09:00–14:00" },
    accessRole: "Premium", leadSource: "Website",
  },
  {
    id: 2, studioNumber: 10002, name: "PowerHouse Berlin", image: "",
    email: "kontakt@powerhouse-berlin.de", phone: "+49 30 9876543", website: "https://www.powerhouse-berlin.de",
    street: "Friedrichstraße 118", zipCode: "10117", city: "Berlin", country: "DE",
    ownerName: "Anna Schneider", about: "Urban fitness experience with CrossFit, yoga, and functional training.",
    isActive: true, franchiseId: 1, contractStart: "2023-06-01", contractEnd: "2026-05-31",
    note: "Renovation planned for Q3 2025", noteStartDate: "2025-07-01", noteEndDate: "2025-09-30", noteImportance: "important",
    taxId: "DE987654321", iban: "DE27100777770209299700",
    creditorName: "PowerHouse Fitness GmbH", creditorId: "DE98ZZZ09999999002", vatNumber: "DE987654321", bankName: "Deutsche Bank", bic: "DEUTDEDB110",
    openingHours: { monday: "05:30–23:00", tuesday: "05:30–23:00", wednesday: "05:30–23:00", thursday: "05:30–23:00", friday: "05:30–22:00", saturday: "07:00–20:00", sunday: "08:00–16:00" },
    accessRole: "Premium", leadSource: "Referral",
  },
  {
    id: 3, studioNumber: 10003, name: "VitalFit Hamburg", image: "",
    email: "hello@vitalfit-hamburg.de", phone: "+49 40 5551234", website: "https://www.vitalfit-hamburg.de",
    street: "Mönckebergstraße 7", zipCode: "20095", city: "Hamburg", country: "DE",
    ownerName: "Lars Jensen", about: "Wellness-oriented studio combining fitness with spa and recovery services.",
    isActive: true, franchiseId: 2, contractStart: "2024-01-01", contractEnd: "2026-12-31",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "DE456789123", iban: "DE75512108001245126199",
    creditorName: "VitalFit UG", creditorId: "DE98ZZZ09999999003", vatNumber: "DE456789123", bankName: "ING-DiBa", bic: "INGDDEFFXXX",
    openingHours: { monday: "06:00–22:00", tuesday: "06:00–22:00", wednesday: "06:00–22:00", thursday: "06:00–22:00", friday: "06:00–21:00", saturday: "08:00–18:00", sunday: "09:00–15:00" },
    accessRole: "Standard", leadSource: "Social Media",
  },
  {
    id: 4, studioNumber: 10004, name: "IronWorks Köln", image: "",
    email: "info@ironworks-koeln.de", phone: "+49 221 7778899", website: "https://www.ironworks-koeln.de",
    street: "Hohenzollernring 25", zipCode: "50672", city: "Köln", country: "DE",
    ownerName: "Markus Weber", about: "Hardcore strength training facility with competitive powerlifting focus.",
    isActive: true, franchiseId: null, contractStart: "2024-03-01", contractEnd: "2027-02-28",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "DE321654987", iban: "DE68210501700012345678",
    creditorName: "IronWorks Köln e.K.", creditorId: "DE98ZZZ09999999004", vatNumber: "DE321654987", bankName: "Sparkasse KölnBonn", bic: "COLSDE33XXX",
    openingHours: { monday: "07:00–22:00", tuesday: "07:00–22:00", wednesday: "07:00–22:00", thursday: "07:00–22:00", friday: "07:00–21:00", saturday: "09:00–18:00", sunday: "Closed" },
    accessRole: "Standard", leadSource: "Walk-in",
  },
  {
    id: 5, studioNumber: 10005, name: "ZenFit Frankfurt", image: "",
    email: "namaste@zenfit-frankfurt.de", phone: "+49 69 4445566", website: "https://www.zenfit-frankfurt.de",
    street: "Berger Straße 80", zipCode: "60316", city: "Frankfurt", country: "DE",
    ownerName: "Sophia Klein", about: "Mind-body studio specializing in yoga, pilates, and meditation classes.",
    isActive: true, franchiseId: 2, contractStart: "2024-06-01", contractEnd: "2026-05-31",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "DE654321987", iban: "DE44500105175407324931",
    creditorName: "ZenFit Studio GmbH", creditorId: "DE98ZZZ09999999005", vatNumber: "DE654321987", bankName: "Frankfurter Sparkasse", bic: "HELADEF1822",
    openingHours: { monday: "07:00–21:00", tuesday: "07:00–21:00", wednesday: "07:00–21:00", thursday: "07:00–21:00", friday: "07:00–20:00", saturday: "08:00–17:00", sunday: "09:00–14:00" },
    accessRole: "Basic", leadSource: "Email Campaign",
  },
  {
    id: 6, studioNumber: 10006, name: "SprintGym Stuttgart", image: "",
    email: "team@sprintgym-stuttgart.de", phone: "+49 711 2233445", website: "https://www.sprintgym-stuttgart.de",
    street: "Königstraße 58", zipCode: "70173", city: "Stuttgart", country: "DE",
    ownerName: "Felix Braun", about: "High-performance training center with athletics and speed coaching.",
    isActive: false, franchiseId: 3, contractStart: "2022-01-01", contractEnd: "2024-12-31",
    note: "Contract expired – pending renewal", noteStartDate: "2025-01-01", noteEndDate: "", noteImportance: "critical",
    taxId: "DE111222333", iban: "DE89370400440532013000",
    creditorName: "SprintGym GmbH", creditorId: "DE98ZZZ09999999006", vatNumber: "DE111222333", bankName: "BW-Bank", bic: "SOLADEST600",
    openingHours: { monday: "06:00–22:00", tuesday: "06:00–22:00", wednesday: "06:00–22:00", thursday: "06:00–22:00", friday: "06:00–20:00", saturday: "08:00–16:00", sunday: "Closed" },
    accessRole: "Standard", leadSource: "Event",
  },
  {
    id: 7, studioNumber: 10007, name: "BodyCraft Düsseldorf", image: "",
    email: "info@bodycraft-dus.de", phone: "+49 211 6677889", website: "https://www.bodycraft-dus.de",
    street: "Schadowstraße 33", zipCode: "40212", city: "Düsseldorf", country: "DE",
    ownerName: "Julia Richter", about: "Boutique fitness studio with personal training and nutrition coaching.",
    isActive: true, franchiseId: 3, contractStart: "2024-09-01", contractEnd: "2027-08-31",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "DE444555666", iban: "DE27100777770209299700",
    creditorName: "BodyCraft Fitness GmbH", creditorId: "DE98ZZZ09999999007", vatNumber: "DE444555666", bankName: "Stadtsparkasse Düsseldorf", bic: "DUSSDEDDXXX",
    openingHours: { monday: "06:30–21:30", tuesday: "06:30–21:30", wednesday: "06:30–21:30", thursday: "06:30–21:30", friday: "06:30–20:00", saturday: "08:00–17:00", sunday: "09:00–13:00" },
    accessRole: "Premium", leadSource: "Google Ads",
  },
  {
    id: 8, studioNumber: 10008, name: "FlexArena Leipzig", image: "",
    email: "hallo@flexarena-leipzig.de", phone: "+49 341 8899001", website: "https://www.flexarena-leipzig.de",
    street: "Petersstraße 15", zipCode: "04109", city: "Leipzig", country: "DE",
    ownerName: "Niklas Hoffmann", about: "Community-driven gym with group classes, open gym, and family programs.",
    isActive: true, franchiseId: null, contractStart: "2025-01-01", contractEnd: "2027-12-31",
    note: "New studio – onboarding phase", noteStartDate: "2025-01-01", noteEndDate: "2025-03-31", noteImportance: "important",
    taxId: "DE777888999", iban: "DE75512108001245126199",
    creditorName: "FlexArena Leipzig GbR", creditorId: "DE98ZZZ09999999008", vatNumber: "DE777888999", bankName: "Sparkasse Leipzig", bic: "WEABOREDD",
    openingHours: { monday: "06:00–22:00", tuesday: "06:00–22:00", wednesday: "06:00–22:00", thursday: "06:00–22:00", friday: "06:00–21:00", saturday: "08:00–18:00", sunday: "09:00–15:00" },
    accessRole: "Basic", leadSource: "Referral",
  },
  {
    id: 9, studioNumber: 10009, name: "AlpinFit Innsbruck", image: "",
    email: "kontakt@alpinfit.at", phone: "+43 512 334455", website: "https://www.alpinfit.at",
    street: "Maria-Theresien-Straße 18", zipCode: "6020", city: "Innsbruck", country: "AT",
    ownerName: "Georg Steiner", about: "Mountain-inspired fitness combining outdoor training with modern gym facilities.",
    isActive: true, franchiseId: 4, contractStart: "2024-10-01", contractEnd: "2027-09-30",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "ATU12345678", iban: "AT611904300234573201",
    creditorName: "AlpinFit GmbH", creditorId: "AT61ZZZ01234567890", vatNumber: "ATU12345678", bankName: "Tiroler Sparkasse", bic: "SPIHAT22XXX",
    openingHours: { monday: "06:00–21:00", tuesday: "06:00–21:00", wednesday: "06:00–21:00", thursday: "06:00–21:00", friday: "06:00–20:00", saturday: "07:00–17:00", sunday: "08:00–14:00" },
    accessRole: "Premium", leadSource: "Website",
  },
  {
    id: 10, studioNumber: 10010, name: "FitFactory Nürnberg", image: "",
    email: "info@fitfactory-nbg.de", phone: "+49 911 5566778", website: "https://www.fitfactory-nuernberg.de",
    street: "Breite Gasse 42", zipCode: "90402", city: "Nürnberg", country: "DE",
    ownerName: "Sandra Lehmann", about: "24/7 fitness studio with self-service access and automated check-in.",
    isActive: true, franchiseId: 1, contractStart: "2025-01-15", contractEnd: "2027-01-14",
    note: "New partner location", noteStartDate: "2025-01-15", noteEndDate: "2025-04-15", noteImportance: "important",
    taxId: "DE555666777", iban: "DE35760300800500123456",
    creditorName: "FitFactory Nürnberg GmbH", creditorId: "DE98ZZZ09999999010", vatNumber: "DE555666777", bankName: "N26 Bank", bic: "NTSBDEB1XXX",
    openingHours: { monday: "00:00–23:59", tuesday: "00:00–23:59", wednesday: "00:00–23:59", thursday: "00:00–23:59", friday: "00:00–23:59", saturday: "00:00–23:59", sunday: "00:00–23:59" },
    accessRole: "Standard", leadSource: "Social Media Ads",
  },
  {
    id: 11, studioNumber: 10011, name: "WaveGym Rostock", image: "",
    email: "team@wavegym-rostock.de", phone: "+49 381 2244668", website: "https://www.wavegym-rostock.de",
    street: "Kröpeliner Straße 55", zipCode: "18055", city: "Rostock", country: "DE",
    ownerName: "Hendrik Voß", about: "Coastal fitness studio with aqua fitness, surfboard training, and beach workouts.",
    isActive: false, franchiseId: null, contractStart: "2023-04-01", contractEnd: "2025-03-31",
    note: "Studio paused – seasonal closure", noteStartDate: "2025-11-01", noteEndDate: "2026-03-01", noteImportance: "important",
    taxId: "DE888999000", iban: "DE12130000000012345678",
    creditorName: "WaveGym Rostock UG", creditorId: "DE98ZZZ09999999011", vatNumber: "DE888999000", bankName: "Ostsee Sparkasse Rostock", bic: "NOLADE21ROS",
    openingHours: { monday: "07:00–21:00", tuesday: "07:00–21:00", wednesday: "07:00–21:00", thursday: "07:00–21:00", friday: "07:00–20:00", saturday: "08:00–16:00", sunday: "Closed" },
    accessRole: "Basic", leadSource: "Cold Call (Outbound)",
  },
  {
    id: 12, studioNumber: 10012, name: "EnergyHub Hannover", image: "",
    email: "hello@energyhub-hannover.de", phone: "+49 511 7788990", website: "https://www.energyhub-hannover.de",
    street: "Georgstraße 36", zipCode: "30159", city: "Hannover", country: "DE",
    ownerName: "Katharina Weiß", about: "Full-service fitness club with sauna, pool, and group courses.",
    isActive: true, franchiseId: 2, contractStart: "2024-05-01", contractEnd: "2027-04-30",
    note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant",
    taxId: "DE222333444", iban: "DE50250500000123456789",
    creditorName: "EnergyHub Hannover GmbH", creditorId: "DE98ZZZ09999999012", vatNumber: "DE222333444", bankName: "Norddeutsche Landesbank", bic: "NOLADE2HXXX",
    openingHours: { monday: "06:00–23:00", tuesday: "06:00–23:00", wednesday: "06:00–23:00", thursday: "06:00–23:00", friday: "06:00–22:00", saturday: "07:00–20:00", sunday: "08:00–18:00" },
    accessRole: "Premium", leadSource: "Inbound Call",
  },
]

// ============================================
// FRANCHISE DATA
// ============================================
export const FranchiseData = [
  {
    id: 1, name: "FitGroup Deutschland", img: "",
    email: "admin@fitgroup.de", phone: "+49 89 9999000", website: "https://www.fitgroup.de",
    street: "Maximilianstraße 10", zipCode: "80539", city: "München", country: "DE",
    ownerFirstName: "Christian", ownerLastName: "Müller",
    about: "Germany's leading premium fitness franchise with over 50 locations nationwide.",
    loginEmail: "admin@fitgroup.de", loginPassword: "FG2025!secure",
    createdDate: "2020-03-15", isArchived: false,
    specialNote: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "",
    logo: null,
  },
  {
    id: 2, name: "WellnessPlus Gruppe", img: "",
    email: "kontakt@wellnessplus.de", phone: "+49 40 8887766", website: "https://www.wellnessplus.de",
    street: "Jungfernstieg 30", zipCode: "20354", city: "Hamburg", country: "DE",
    ownerFirstName: "Katrin", ownerLastName: "Fischer",
    about: "Wellness and lifestyle franchise focusing on holistic health and recovery.",
    loginEmail: "katrin@wellnessplus.de", loginPassword: "WP2024!pass",
    createdDate: "2021-07-01", isArchived: false,
    specialNote: "Expansion into Austria planned for 2026", noteImportance: "important", noteStartDate: "2025-06-01", noteEndDate: "2026-12-31",
    logo: null,
  },
  {
    id: 3, name: "UrbanFit Network", img: "",
    email: "hello@urbanfit-network.de", phone: "+49 711 3344556", website: "https://www.urbanfit-network.de",
    street: "Calwer Straße 12", zipCode: "70173", city: "Stuttgart", country: "DE",
    ownerFirstName: "David", ownerLastName: "Schwarz",
    about: "Modern urban fitness network targeting young professionals in major German cities.",
    loginEmail: "david@urbanfit-network.de", loginPassword: "UF2025!net",
    createdDate: "2022-11-20", isArchived: false,
    specialNote: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "",
    logo: null,
  },
  {
    id: 4, name: "AlpinSport Holding", img: "",
    email: "office@alpinsport-holding.at", phone: "+43 512 990011", website: "https://www.alpinsport-holding.at",
    street: "Brixner Straße 4", zipCode: "6020", city: "Innsbruck", country: "AT",
    ownerFirstName: "Georg", ownerLastName: "Steiner",
    about: "Austrian-based franchise specializing in mountain and outdoor fitness concepts.",
    loginEmail: "georg@alpinsport-holding.at", loginPassword: "AS2024!alpin",
    createdDate: "2023-09-01", isArchived: false,
    specialNote: "New franchise partner – first year review pending", noteImportance: "important", noteStartDate: "2024-09-01", noteEndDate: "2025-09-01",
    logo: null,
  },
  {
    id: 5, name: "OldSchool Gym Verbund", img: "",
    email: "info@oldschoolgym.de", phone: "+49 30 1122334", website: "https://www.oldschoolgym.de",
    street: "Torstraße 80", zipCode: "10119", city: "Berlin", country: "DE",
    ownerFirstName: "Stefan", ownerLastName: "Krause",
    about: "Traditional bodybuilding and powerlifting gym franchise. Archived due to restructuring.",
    loginEmail: "stefan@oldschoolgym.de", loginPassword: "OSG2023!gym",
    createdDate: "2019-05-10", isArchived: true,
    specialNote: "Franchise archived – studios reassigned", noteImportance: "critical", noteStartDate: "2024-06-01", noteEndDate: "",
    logo: null,
  },
]

// ============================================
// STUDIO STATS (per studio ID)
// ============================================
export const studioStatsData = {
  1: { members: 245, trainers: 12, contracts: 198 },
  2: { members: 312, trainers: 18, contracts: 267 },
  3: { members: 178, trainers: 9, contracts: 145 },
  4: { members: 156, trainers: 8, contracts: 130 },
  5: { members: 89, trainers: 6, contracts: 72 },
  6: { members: 42, trainers: 3, contracts: 28 },
  7: { members: 134, trainers: 7, contracts: 112 },
  8: { members: 67, trainers: 5, contracts: 45 },
  9: { members: 103, trainers: 6, contracts: 88 },
  10: { members: 28, trainers: 2, contracts: 15 },
  11: { members: 35, trainers: 3, contracts: 22 },
  12: { members: 201, trainers: 11, contracts: 174 },
}

// ============================================
// STUDIO MEMBERS (per studio ID)
// ============================================
export const studioMembersData = {
  1: [
    { id: 1, firstName: "Max", lastName: "Mustermann", email: "max@example.de", phone: "+49 170 1111111", status: "active", joinDate: "2023-02-15", membershipType: "Premium", dateOfBirth: "1990-05-20", gender: "male", street: "Hauptstraße 1", zipCode: "80331", city: "München", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
    { id: 2, firstName: "Lisa", lastName: "Schmidt", email: "lisa.schmidt@example.de", phone: "+49 171 2222222", status: "active", joinDate: "2023-05-10", membershipType: "Standard", dateOfBirth: "1995-11-03", gender: "female", street: "Marienplatz 5", zipCode: "80331", city: "München", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
    { id: 3, firstName: "David", lastName: "Wagner", email: "david.wagner@example.de", phone: "+49 172 3333333", status: "active", joinDate: "2024-01-20", membershipType: "Premium", dateOfBirth: "1988-03-14", gender: "male", street: "Sendlinger Str. 22", zipCode: "80331", city: "München", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  2: [
    { id: 4, firstName: "Sarah", lastName: "Becker", email: "sarah.becker@example.de", phone: "+49 173 4444444", status: "active", joinDate: "2023-08-01", membershipType: "Premium", dateOfBirth: "1992-07-22", gender: "female", street: "Unter den Linden 10", zipCode: "10117", city: "Berlin", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
    { id: 5, firstName: "Florian", lastName: "Koch", email: "florian.koch@example.de", phone: "+49 174 5555555", status: "active", joinDate: "2024-02-14", membershipType: "Standard", dateOfBirth: "1997-01-30", gender: "male", street: "Alexanderplatz 3", zipCode: "10178", city: "Berlin", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  3: [
    { id: 6, firstName: "Hannah", lastName: "Meyer", email: "hannah.meyer@example.de", phone: "+49 175 6666666", status: "active", joinDate: "2024-03-01", membershipType: "Standard", dateOfBirth: "1994-09-12", gender: "female", street: "Reeperbahn 20", zipCode: "20359", city: "Hamburg", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  4: [
    { id: 7, firstName: "Tim", lastName: "Schulz", email: "tim.schulz@example.de", phone: "+49 176 7777777", status: "active", joinDate: "2024-04-15", membershipType: "Premium", dateOfBirth: "1991-12-05", gender: "male", street: "Ehrenstraße 15", zipCode: "50672", city: "Köln", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  5: [
    { id: 8, firstName: "Elena", lastName: "Wolf", email: "elena.wolf@example.de", phone: "+49 177 8888888", status: "active", joinDate: "2024-07-01", membershipType: "Basic", dateOfBirth: "1996-04-18", gender: "female", street: "Sachsenhäuser Ufer 5", zipCode: "60594", city: "Frankfurt", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  6: [],
  7: [
    { id: 9, firstName: "Lukas", lastName: "Frank", email: "lukas.frank@example.de", phone: "+49 178 9999999", status: "active", joinDate: "2024-10-01", membershipType: "Premium", dateOfBirth: "1993-06-25", gender: "male", street: "Königsallee 80", zipCode: "40212", city: "Düsseldorf", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  8: [
    { id: 10, firstName: "Mia", lastName: "Neumann", email: "mia.neumann@example.de", phone: "+49 179 1010101", status: "active", joinDate: "2025-01-15", membershipType: "Standard", dateOfBirth: "1998-10-08", gender: "female", street: "Augustusplatz 1", zipCode: "04109", city: "Leipzig", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  9: [
    { id: 11, firstName: "Georg", lastName: "Steiner Jr.", email: "georg.jr@alpinfit.at", phone: "+43 660 1122334", status: "active", joinDate: "2024-10-15", membershipType: "Premium", dateOfBirth: "1999-02-11", gender: "male", street: "Innrain 5", zipCode: "6020", city: "Innsbruck", country: "AT", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  10: [
    { id: 12, firstName: "Sandra", lastName: "Lehmann", email: "sandra.l@fitfactory.de", phone: "+49 911 3344556", status: "active", joinDate: "2025-01-20", membershipType: "Standard", dateOfBirth: "1993-08-30", gender: "female", street: "Hauptmarkt 2", zipCode: "90403", city: "Nürnberg", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
  11: [],
  12: [
    { id: 13, firstName: "Tobias", lastName: "Krug", email: "tobias.krug@example.de", phone: "+49 511 2233445", status: "active", joinDate: "2024-06-01", membershipType: "Premium", dateOfBirth: "1987-11-15", gender: "male", street: "Lister Meile 25", zipCode: "30161", city: "Hannover", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
    { id: 14, firstName: "Amelie", lastName: "Roth", email: "amelie.roth@example.de", phone: "+49 511 5566778", status: "active", joinDate: "2024-08-20", membershipType: "Standard", dateOfBirth: "1995-03-22", gender: "female", street: "Maschsee Ufer 8", zipCode: "30169", city: "Hannover", country: "DE", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", image: "" },
  ],
}

// ============================================
// STUDIO STAFF (per studio ID)
// ============================================
export const studioStaffData = {
  1: [
    { id: 101, firstName: "Marco", lastName: "Rossi", email: "marco@fitzone.de", phone: "+49 160 1010101", role: "Head Trainer", status: "active", joinDate: "2023-01-15", image: "" },
    { id: 102, firstName: "Nina", lastName: "Vogel", email: "nina@fitzone.de", phone: "+49 160 2020202", role: "Yoga Instructor", status: "active", joinDate: "2023-03-01", image: "" },
  ],
  2: [
    { id: 103, firstName: "Jan", lastName: "Peters", email: "jan@powerhouse.de", phone: "+49 160 3030303", role: "CrossFit Coach", status: "active", joinDate: "2023-07-01", image: "" },
    { id: 104, firstName: "Lena", lastName: "Krüger", email: "lena@powerhouse.de", phone: "+49 160 4040404", role: "Personal Trainer", status: "active", joinDate: "2023-09-15", image: "" },
  ],
  3: [
    { id: 105, firstName: "Oliver", lastName: "Scholz", email: "oliver@vitalfit.de", phone: "+49 160 5050505", role: "Wellness Coach", status: "active", joinDate: "2024-01-10", image: "" },
  ],
  4: [
    { id: 106, firstName: "Patrick", lastName: "Bauer", email: "patrick@ironworks.de", phone: "+49 160 6060606", role: "Strength Coach", status: "active", joinDate: "2024-04-01", image: "" },
  ],
  5: [
    { id: 107, firstName: "Yuki", lastName: "Tanaka", email: "yuki@zenfit.de", phone: "+49 160 7070707", role: "Pilates Instructor", status: "active", joinDate: "2024-06-15", image: "" },
  ],
  6: [
    { id: 108, firstName: "Alexander", lastName: "Fuchs", email: "alex@sprintgym.de", phone: "+49 160 8080808", role: "Athletics Coach", status: "inactive", joinDate: "2022-02-01", image: "" },
  ],
  7: [
    { id: 109, firstName: "Carla", lastName: "Zimmermann", email: "carla@bodycraft.de", phone: "+49 160 9090909", role: "Nutrition Coach", status: "active", joinDate: "2024-09-15", image: "" },
  ],
  8: [
    { id: 110, firstName: "Ben", lastName: "Hartmann", email: "ben@flexarena.de", phone: "+49 160 1112233", role: "Group Fitness Instructor", status: "active", joinDate: "2025-01-05", image: "" },
  ],
  9: [
    { id: 111, firstName: "Maximilian", lastName: "Huber", email: "max@alpinfit.at", phone: "+43 660 2233445", role: "Outdoor Trainer", status: "active", joinDate: "2024-10-01", image: "" },
  ],
  10: [
    { id: 112, firstName: "Tanja", lastName: "Graf", email: "tanja@fitfactory.de", phone: "+49 160 4455667", role: "Fitness Coach", status: "active", joinDate: "2025-01-20", image: "" },
  ],
  11: [
    { id: 113, firstName: "Hendrik", lastName: "Voß", email: "hendrik@wavegym.de", phone: "+49 160 5566778", role: "Aqua Trainer", status: "inactive", joinDate: "2023-04-15", image: "" },
  ],
  12: [
    { id: 114, firstName: "Silke", lastName: "Brandt", email: "silke@energyhub.de", phone: "+49 160 6677889", role: "Group Course Manager", status: "active", joinDate: "2024-05-10", image: "" },
    { id: 115, firstName: "Moritz", lastName: "Engel", email: "moritz@energyhub.de", phone: "+49 160 7788990", role: "Personal Trainer", status: "active", joinDate: "2024-07-01", image: "" },
  ],
}

// ============================================
// STUDIO CONTRACTS (per studio ID)
// ============================================
export const studioContractsData = {
  1: [
    { id: 1001, memberName: "Max Mustermann", type: "Premium 24 Months", startDate: "2023-02-15", endDate: "2025-02-14", status: "active", monthlyFee: 79.90, files: ["contract_1001.pdf"] },
    { id: 1002, memberName: "Lisa Schmidt", type: "Standard 12 Months", startDate: "2023-05-10", endDate: "2024-05-09", status: "expired", monthlyFee: 49.90, files: ["contract_1002.pdf"] },
  ],
  2: [
    { id: 1003, memberName: "Sarah Becker", type: "Premium 24 Months", startDate: "2023-08-01", endDate: "2025-07-31", status: "active", monthlyFee: 89.90, files: ["contract_1003.pdf"] },
  ],
  3: [
    { id: 1004, memberName: "Hannah Meyer", type: "Wellness Plus 12 Months", startDate: "2024-03-01", endDate: "2025-02-28", status: "active", monthlyFee: 69.90, files: [] },
  ],
  4: [
    { id: 1005, memberName: "Tim Schulz", type: "Strength Premium 12 Months", startDate: "2024-04-15", endDate: "2025-04-14", status: "active", monthlyFee: 59.90, files: ["contract_1005.pdf", "waiver_1005.pdf"] },
  ],
  5: [], 6: [],
  7: [
    { id: 1006, memberName: "Lukas Frank", type: "Boutique Premium 12 Months", startDate: "2024-10-01", endDate: "2025-09-30", status: "active", monthlyFee: 99.90, files: [] },
  ],
  8: [], 9: [], 10: [], 11: [],
  12: [
    { id: 1007, memberName: "Tobias Krug", type: "Premium 24 Months", startDate: "2024-06-01", endDate: "2026-05-31", status: "active", monthlyFee: 79.90, files: ["contract_1007.pdf"] },
  ],
}

// ============================================
// STUDIO LEADS (per studio ID)
// ============================================
export const studioLeadData = {
  1: [
    { id: 2001, firstName: "Christina", surname: "Maier", email: "christina.maier@example.de", phoneNumber: "+49 171 5001001", about: "Interested in personal training", source: "Website", hasTrialTraining: true, trialPeriod: "Trial Period", avatar: "" },
    { id: 2002, firstName: "Robert", surname: "Lang", email: "robert.lang@example.de", phoneNumber: "+49 172 5002002", about: "Looking for group classes", source: "Referral", hasTrialTraining: false, trialPeriod: "", avatar: "" },
  ],
  2: [
    { id: 2003, firstName: "Marie", surname: "Weiß", email: "marie.weiss@example.de", phoneNumber: "+49 173 5003003", about: "CrossFit beginner, wants trial", source: "Social Media", hasTrialTraining: true, trialPeriod: "Trial Period", avatar: "" },
  ],
  3: [
    { id: 2004, firstName: "Paul", surname: "Hartmann", email: "paul.hartmann@example.de", phoneNumber: "+49 174 5004004", about: "Spa and recovery focus", source: "Walk-in", hasTrialTraining: false, trialPeriod: "", avatar: "" },
  ],
  4: [],
  5: [
    { id: 2005, firstName: "Leonie", surname: "Schäfer", email: "leonie.schaefer@example.de", phoneNumber: "+49 175 5005005", about: "Interested in yoga and meditation", source: "Event", hasTrialTraining: true, trialPeriod: "Trial Period", avatar: "" },
  ],
  6: [],
  7: [
    { id: 2006, firstName: "Simon", surname: "Böhm", email: "simon.boehm@example.de", phoneNumber: "+49 176 5006006", about: "Looking for nutrition coaching", source: "Website", hasTrialTraining: false, trialPeriod: "", avatar: "" },
  ],
  8: [
    { id: 2007, firstName: "Emilia", surname: "Kraft", email: "emilia.kraft@example.de", phoneNumber: "+49 177 5007007", about: "Family fitness programs", source: "Referral", hasTrialTraining: true, trialPeriod: "Trial Period", avatar: "" },
    { id: 2008, firstName: "Jonas", surname: "Stein", email: "jonas.stein@example.de", phoneNumber: "+49 178 5008008", about: "Wants to try the open gym", source: "Social Media", hasTrialTraining: false, trialPeriod: "", avatar: "" },
  ],
  9: [
    { id: 2009, firstName: "Lara", surname: "Wimmer", email: "lara.wimmer@example.at", phoneNumber: "+43 660 5009009", about: "Outdoor training interest", source: "Event", hasTrialTraining: true, trialPeriod: "Trial Period", avatar: "" },
  ],
  10: [], 11: [],
  12: [
    { id: 2010, firstName: "Nils", surname: "Brinkmann", email: "nils.brinkmann@example.de", phoneNumber: "+49 511 5010010", about: "Pool and sauna access", source: "Walk-in", hasTrialTraining: false, trialPeriod: "", avatar: "" },
  ],
}

// ============================================
// LEAD RELATIONS (per studio ID)
// ============================================
export const studioLeadsRelatonData = {
  1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {}, 11: {}, 12: {},
}

// ============================================
// MEMBER HISTORY (per member ID)
// ============================================
export const studiomemberHistoryNew = {
  1: [
    { id: 1, date: "2023-02-15", action: "Member Created", details: "Account created via registration", category: "general" },
    { id: 2, date: "2023-02-15", action: "Contract Signed", details: "Premium 24 Months contract activated", category: "contract" },
    { id: 3, date: "2024-06-10", action: "Plan Assigned", details: "Beginner Strength Program assigned", category: "training" },
  ],
  2: [
    { id: 4, date: "2023-05-10", action: "Member Created", details: "Account created via registration", category: "general" },
    { id: 5, date: "2024-05-09", action: "Contract Expired", details: "Standard 12 Months contract expired", category: "contract" },
  ],
}

// ============================================
// STAFF HISTORY (per staff ID)
// ============================================
export const studiostaffHistoryNew = {
  101: [
    { id: 1, date: "2023-01-15", action: "Staff Added", details: "Hired as Head Trainer", category: "general" },
    { id: 2, date: "2024-01-15", action: "Role Updated", details: "Promoted to Head Trainer", category: "general" },
  ],
}

// ============================================
// APPOINTMENTS (main & staff)
// ============================================
export const studioappointmentsMainData = [
  { id: 1, memberId: 1, type: "Personal Training", date: "2025-02-10", time: "10:00", duration: 60, trainer: "Marco Rossi", status: "confirmed", specialNote: { text: "", isImportant: false, startDate: "", endDate: "" } },
  { id: 2, memberId: 1, type: "Fitness Assessment", date: "2025-02-14", time: "14:00", duration: 30, trainer: "Nina Vogel", status: "confirmed", specialNote: { text: "", isImportant: false, startDate: "", endDate: "" } },
  { id: 3, memberId: 2, type: "Yoga Class", date: "2025-02-11", time: "18:00", duration: 60, trainer: "Nina Vogel", status: "confirmed", specialNote: { text: "", isImportant: false, startDate: "", endDate: "" } },
]
export const studioappointmentsStaffData = []

// ============================================
// APPOINTMENT TYPES (main & staff)
// ============================================
export const studioappointmentTypeMainData = [
  { id: 1, name: "Personal Training", duration: 60, color: "#FF843E", capacity: 1 },
  { id: 2, name: "Yoga Class", duration: 60, color: "#8B5CF6", capacity: 15 },
  { id: 3, name: "Fitness Assessment", duration: 30, color: "#3B82F6", capacity: 1 },
  { id: 4, name: "CrossFit WOD", duration: 45, color: "#EF4444", capacity: 20 },
  { id: 5, name: "Pilates", duration: 50, color: "#EC4899", capacity: 12 },
  { id: 6, name: "Trial Training", duration: 60, color: "#10B981", capacity: 1 },
]
export const studioappointmentTypeStaffData = []

// ============================================
// FREE APPOINTMENTS (main & staff)
// ============================================
export const studiofreeAppointmentsMainData = [
  { id: 1, type: "Personal Training", date: "2025-02-12", time: "09:00", trainer: "Marco Rossi" },
  { id: 2, type: "Personal Training", date: "2025-02-12", time: "11:00", trainer: "Marco Rossi" },
  { id: 3, type: "Yoga Class", date: "2025-02-13", time: "17:00", trainer: "Nina Vogel" },
  { id: 4, type: "Fitness Assessment", date: "2025-02-14", time: "10:00", trainer: "Marco Rossi" },
]
export const studiofreeAppointmentsStaffData = []

// ============================================
// CONTRACT HISTORY (per studio ID)
// ============================================
export const studioContractHistoryData = {
  1: [
    { id: 1, contractId: 1001, date: "2023-02-15", action: "Contract Created", details: "Premium 24 Months – Max Mustermann" },
    { id: 2, contractId: 1002, date: "2023-05-10", action: "Contract Created", details: "Standard 12 Months – Lisa Schmidt" },
    { id: 3, contractId: 1002, date: "2024-05-09", action: "Contract Expired", details: "Standard 12 Months – Lisa Schmidt" },
  ],
  2: [
    { id: 4, contractId: 1003, date: "2023-08-01", action: "Contract Created", details: "Premium 24 Months – Sarah Becker" },
  ],
}

// ============================================
// STUDIO FINANCE DATA (passed directly to modal)
// ============================================
export const studioFinanceData = {
  revenue: { current: 24580, previous: 22340, change: 10.0 },
  expenses: { current: 12450, previous: 11890, change: 4.7 },
  profit: { current: 12130, previous: 10450, change: 16.1 },
  membershipRevenue: 18200,
  personalTraining: 4380,
  shopSales: 2000,
  monthlyData: [
    { month: "Jan", revenue: 22000, expenses: 11500 },
    { month: "Feb", revenue: 24580, expenses: 12450 },
    { month: "Mar", revenue: 23100, expenses: 11800 },
    { month: "Apr", revenue: 25200, expenses: 12900 },
    { month: "May", revenue: 26800, expenses: 13200 },
    { month: "Jun", revenue: 24100, expenses: 12600 },
  ],
}

// ============================================
// STUDIO HISTORY (main, passed directly to modal)
// ============================================
export const studioHistoryMainData = [
  { id: 1, date: "2025-02-01", action: "Settings Updated", details: "Opening hours modified for weekends", category: "general", user: "Admin" },
  { id: 2, date: "2025-01-15", action: "Staff Added", details: "New personal trainer onboarded", category: "staff", user: "Admin" },
  { id: 3, date: "2024-12-20", action: "Contract Renewal", details: "Franchise contract renewed for 2 years", category: "contract", user: "System" },
  { id: 4, date: "2024-11-10", action: "Member Milestone", details: "Studio reached 200 active members", category: "general", user: "System" },
  { id: 5, date: "2024-10-05", action: "Equipment Update", details: "New cardio equipment installed", category: "general", user: "Admin" },
]

// ============================================
// DEFAULT FORMS & CONSTANTS
// ============================================

export const DEFAULT_EDIT_FORM = {
  name: "", email: "", phone: "", street: "", zipCode: "", city: "", country: "", website: "", about: "",
  note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant", ownerName: "",
  openingHours: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
  closingDays: "", openingHoursList: [], closingDaysList: [], logoUrl: "", logoFile: null,
  maxCapacity: 10, appointmentTypes: [],
  trialTraining: { name: "Trial Training", duration: 60, capacity: 1, color: "#1890ff" },
  contractTypes: [],
  contractSections: [
    { title: "Personal Information", content: "", editable: false, requiresAgreement: true },
    { title: "Contract Terms", content: "", editable: false, requiresAgreement: true },
  ],
  contractPauseReasons: [{ name: "Vacation", maxDays: 30 }, { name: "Medical", maxDays: 90 }],
  noticePeriod: 30, extensionPeriod: 12, allowMemberSelfCancellation: false,
  autoArchiveDuration: 30, emailNotifications: true, chatNotifications: true,
  studioChatNotifications: true, memberChatNotifications: true,
  emailSignature: "Best regards,\n{Studio_Name} Team",
  appointmentNotifications: [
    { type: "booking", title: "Appointment Confirmation", message: "Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}.", sendVia: ["email", "platform"], enabled: true },
    { type: "cancellation", title: "Appointment Cancellation", message: "Hello {Member_Name}, your {Appointment_Type} scheduled for {Booked_Time} has been cancelled.", sendVia: ["email", "platform"], enabled: true },
    { type: "rescheduled", title: "Appointment Rescheduled", message: "Hello {Member_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}.", sendVia: ["email", "platform"], enabled: true },
  ],
  broadcastMessages: [],
  emailConfig: { smtpServer: "", smtpPort: 587, emailAddress: "", password: "", useSSL: false, senderName: "", smtpUser: "", smtpPass: "" },
  birthdayMessages: { enabled: false, subject: "Happy Birthday from {Studio_Name}", message: "Dear {Member_Name},\nWishing you a wonderful birthday!", sendVia: ["email"], sendTime: "09:00" },
  appearance: { theme: "dark", primaryColor: "#FF843E", secondaryColor: "#1890ff", allowUserThemeToggle: true },
  roles: [], permissionTemplates: [], leadSources: [], tags: [],
  currency: "EUR", vatRates: [{ name: "Standard", rate: 19 }, { name: "Reduced", rate: 7 }],
  additionalContractDocuments: [], additionalDocs: [],
}

export const DEFAULT_FRANCHISE_FORM = {
  name: "", email: "", phone: "", street: "", zipCode: "", city: "", website: "", about: "",
  ownerFirstName: "", ownerLastName: "", country: "", specialNote: "", noteImportance: "unimportant",
  noteStartDate: "", noteEndDate: "", loginEmail: "", loginPassword: "", confirmPassword: "", logo: null,
}

export const DEFAULT_MEMBER_EDIT_FORM = {
  name: "", email: "", phone: "", membershipType: "", joinDate: "", status: "active",
}

export const DEFAULT_TEMP_MEMBER_FORM = {
  img: "", firstName: "", lastName: "", email: "", phone: "", gender: "", country: "", street: "",
  zipCode: "", city: "", dateOfBirth: "", about: "", note: "", noteImportance: "unimportant",
  noteStartDate: "", noteEndDate: "", autoArchivePeriod: 4,
  relations: { family: [], friendship: [], relationship: [], work: [], other: [] },
}

export const DEFAULT_NEW_RELATION = {
  name: "", relation: "", category: "family", type: "manual", selectedMemberId: null,
}

export const AVAILABLE_TRAINING_PLANS = [
  { id: 1, name: "Beginner Strength Program", description: "8-week beginner strength training program", duration: "8 weeks", difficulty: "Beginner", assignedDate: "2024-01-15" },
  { id: 2, name: "Advanced HIIT Program", description: "High-intensity interval training for advanced users", duration: "6 weeks", difficulty: "Advanced", assignedDate: "2024-01-20" },
  { id: 3, name: "Cardio Endurance Plan", description: "12-week cardiovascular endurance program", duration: "12 weeks", difficulty: "Intermediate", assignedDate: "2024-02-01" },
]

export const DEFAULT_MEMBER_CONTINGENT = {
  1: { current: { used: 2, total: 7 }, future: { "05.14.25 - 05.18.2025": { used: 0, total: 8 }, "06.14.25 - 06.18.2025": { used: 0, total: 8 } } },
  2: { current: { used: 1, total: 8 }, future: { "05.14.25 - 05.18.2025": { used: 0, total: 8 }, "06.14.25 - 06.18.2025": { used: 0, total: 8 } } },
}

export const DEFAULT_BILLING_PERIOD = "04.14.25 - 04.18.2025"

export const STUDIO_SORT_OPTIONS = [
  { value: "alphabetical", label: "Name" },
  { value: "memberCount", label: "Members" },
  { value: "staffCount", label: "Staff" },
  { value: "contractCount", label: "Contracts" },
  { value: "leadCount", label: "Leads" },
]

export const FRANCHISE_SORT_OPTIONS = [
  { value: "alphabetical", label: "Name" },
  { value: "studioCount", label: "Studios" },
]

export const DEFAULT_LEAD_SOURCES = [
  "Website", "Referral", "Social Media", "Walk-in", "Phone Call", "Email", "Event", "Other",
]

export const RELATION_OPTIONS = {
  family: ["Parent", "Child", "Sibling", "Spouse", "Grandparent", "Grandchild", "Cousin", "Aunt/Uncle", "Nephew/Niece"],
  friendship: ["Friend", "Close Friend", "Best Friend", "Acquaintance"],
  relationship: ["Partner", "Fiancé(e)", "Girlfriend/Boyfriend", "Ex-partner"],
  work: ["Colleague", "Boss", "Employee", "Business Partner", "Client"],
  other: ["Neighbor", "Mentor", "Teammate", "Classmate", "Other"],
}

export const ACCESS_ROLE_COLORS = {
  Premium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Standard: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Basic: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}
