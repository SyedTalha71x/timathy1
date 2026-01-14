export const financesData = [
  // Sample documents for demonstration
  {
    id: "doc-001",
    filename: "SEPA_Payment_2023-05-15.xml",
    createdAt: "2023-05-15T10:30:00Z",
    size: 2048,
    transactionCount: 3,
    content: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
<CstmrCdtTrfInitn>
  <GrpHdr>
    <MsgId>MSG-001-20230515</MsgId>
    <CreDtTm>2023-05-15T10:30:00</CreDtTm>
    <NbOfTxs>3</NbOfTxs>
    <CtrlSum>500.00</CtrlSum>
  </GrpHdr>
  <PmtInf>
    <PmtInfId>PMT-001</PmtInfId>
    <PmtMtd>TRF</PmtMtd>
    <ReqdExctnDt>2023-05-16</ReqdExctnDt>
    <Dbtr>
      <Nm>Studio Management Company</Nm>
    </Dbtr>
  </PmtInf>
</CstmrCdtTrfInitn>
</Document>`,
  },
  {
    id: "doc-002",
    filename: "SEPA_Payment_2023-05-10.xml",
    createdAt: "2023-05-10T14:15:00Z",
    size: 1536,
    transactionCount: 2,
    content: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
<CstmrCdtTrfInitn>
  <GrpHdr>
    <MsgId>MSG-002-20230510</MsgId>
    <CreDtTm>2023-05-10T14:15:00</CreDtTm>
    <NbOfTxs>2</NbOfTxs>
    <CtrlSum>350.00</CtrlSum>
  </GrpHdr>
  <PmtInf>
    <PmtInfId>PMT-002</PmtInfId>
    <PmtMtd>TRF</PmtMtd>
    <ReqdExctnDt>2023-05-11</ReqdExctnDt>
    <Dbtr>
      <Nm>Studio Management Company</Nm>
    </Dbtr>
  </PmtInf>
</CstmrCdtTrfInitn>
</Document>`,
  },
]

export const financialData = {
  "This Month": {
    totalRevenue: 28500,
    pendingPayments: 4800,
    failedPayments: 1250,
    successfulPayments: 22450,
    transactions: [
      {
        id: "tx-001",
        memberName: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-003",
        memberName: "Bob Johnson",
        date: "2023-05-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
      {
        id: "tx-004",
        memberName: "Alice Williams",
        date: "2023-05-10",
        amount: 300,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 200, description: "Premium membership with extra benefits" },
          { name: "Equipment Rental", cost: 50, description: "Specialized equipment rental" },
          { name: "Technical Support", cost: 50, description: "Dedicated technical support" },
        ],
      },
      {
        id: "tx-005",
        memberName: "Charlie Brown",
        date: "2023-05-08",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-006",
        memberName: "Emma Wilson",
        date: "2023-05-15",
        amount: 180,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Locker Rental", cost: 25, description: "Personal locker" },
          { name: "Towel Service", cost: 25, description: "Fresh towels daily" },
        ],
      },
      {
        id: "tx-007",
        memberName: "Michael Davis",
        date: "2023-05-14",
        amount: 220,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Personal Training", cost: 70, description: "2 PT sessions included" },
        ],
      },
      {
        id: "tx-008",
        memberName: "Sarah Miller",
        date: "2023-05-13",
        amount: 95,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Student Membership", cost: 75, description: "Discounted student rate" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-009",
        memberName: "David Garcia",
        date: "2023-05-12",
        amount: 250,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Spa Access", cost: 50, description: "Sauna and steam room" },
          { name: "Nutrition Plan", cost: 50, description: "Personalized meal plan" },
        ],
      },
      {
        id: "tx-010",
        memberName: "Lisa Anderson",
        date: "2023-05-11",
        amount: 175,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Group Classes", cost: 45, description: "Unlimited group fitness classes" },
        ],
      },
      {
        id: "tx-011",
        memberName: "Thomas Martinez",
        date: "2023-05-10",
        amount: 320,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "VIP Membership", cost: 250, description: "All-inclusive VIP access" },
          { name: "Guest Passes", cost: 70, description: "5 guest passes per month" },
        ],
      },
      {
        id: "tx-012",
        memberName: "Jennifer Taylor",
        date: "2023-05-09",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-013",
        memberName: "Robert Hernandez",
        date: "2023-05-08",
        amount: 185,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Parking", cost: 35, description: "Reserved parking spot" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-014",
        memberName: "Maria Lopez",
        date: "2023-05-07",
        amount: 125,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Locker Rental", cost: 25, description: "Personal locker" },
        ],
      },
      {
        id: "tx-015",
        memberName: "William Clark",
        date: "2023-05-06",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support" },
        ],
      },
      {
        id: "tx-016",
        memberName: "Patricia Lewis",
        date: "2023-05-05",
        amount: 165,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Towel Service", cost: 15, description: "Fresh towels" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-017",
        memberName: "James Walker",
        date: "2023-05-04",
        amount: 280,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Personal Training", cost: 100, description: "4 PT sessions" },
          { name: "Nutrition Counseling", cost: 30, description: "Monthly consultation" },
        ],
      },
      {
        id: "tx-018",
        memberName: "Elizabeth Hall",
        date: "2023-05-03",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-019",
        memberName: "Christopher Young",
        date: "2023-05-02",
        amount: 195,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Group Classes", cost: 45, description: "Unlimited group fitness classes" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-020",
        memberName: "Susan King",
        date: "2023-05-01",
        amount: 350,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "VIP Membership", cost: 250, description: "All-inclusive VIP access" },
          { name: "Spa Access", cost: 50, description: "Sauna and steam room" },
          { name: "Valet Parking", cost: 50, description: "Complimentary valet service" },
        ],
      },
      {
        id: "tx-021",
        memberName: "Daniel Wright",
        date: "2023-05-15",
        amount: 140,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Locker Rental", cost: 25, description: "Personal locker" },
          { name: "Towel Service", cost: 15, description: "Fresh towels" },
        ],
      },
      {
        id: "tx-022",
        memberName: "Nancy Scott",
        date: "2023-05-14",
        amount: 210,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Kids Club", cost: 60, description: "Childcare while you work out" },
        ],
      },
      {
        id: "tx-023",
        memberName: "Mark Green",
        date: "2023-05-13",
        amount: 175,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Group Classes", cost: 45, description: "Unlimited group fitness classes" },
        ],
      },
      {
        id: "tx-024",
        memberName: "Karen Adams",
        date: "2023-05-12",
        amount: 85,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Senior Membership", cost: 65, description: "Discounted senior rate" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-025",
        memberName: "Steven Baker",
        date: "2023-05-11",
        amount: 230,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Personal Training", cost: 80, description: "2 PT sessions" },
        ],
      },
      {
        id: "tx-026",
        memberName: "Betty Nelson",
        date: "2023-05-10",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-027",
        memberName: "Paul Carter",
        date: "2023-05-09",
        amount: 290,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Massage Therapy", cost: 90, description: "Monthly massage session" },
          { name: "Spa Access", cost: 50, description: "Sauna and steam room" },
        ],
      },
      {
        id: "tx-028",
        memberName: "Dorothy Mitchell",
        date: "2023-05-08",
        amount: 165,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Standard Membership", cost: 130, description: "Standard membership fee" },
          { name: "Parking", cost: 35, description: "Reserved parking spot" },
        ],
      },
      {
        id: "tx-029",
        memberName: "Andrew Roberts",
        date: "2023-05-07",
        amount: 200,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support" },
        ],
      },
      {
        id: "tx-030",
        memberName: "Sandra Turner",
        date: "2023-05-06",
        amount: 110,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Utilities", cost: 10, description: "Electricity" },
        ],
      },
    ],
  },
  "Last Month": {
    totalRevenue: 11800,
    pendingPayments: 1200,
    failedPayments: 600,
    successfulPayments: 10000,
    transactions: [
      {
        id: "tx-101",
        memberName: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-102",
        memberName: "Jane Smith",
        date: "2023-04-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-103",
        memberName: "Bob Johnson",
        date: "2023-04-12",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "Last 3 Months": {
    totalRevenue: 35400,
    pendingPayments: 3600,
    failedPayments: 1800,
    successfulPayments: 30000,
    transactions: [
      {
        id: "tx-201",
        memberName: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-202",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-203",
        memberName: "Bob Johnson",
        date: "2023-01-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "Last 6 Months": {
    totalRevenue: 70800,
    pendingPayments: 7200,
    failedPayments: 3600,
    successfulPayments: 60000,
    transactions: [
      {
        id: "tx-301",
        memberName: "John Doe",
        date: "2022-12-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-302",
        memberName: "Jane Smith",
        date: "2022-11-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-303",
        memberName: "Bob Johnson",
        date: "2022-10-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "This Year": {
    totalRevenue: 141600,
    pendingPayments: 14400,
    failedPayments: 7200,
    successfulPayments: 120000,
    transactions: [
      {
        id: "tx-401",
        memberName: "John Doe",
        date: "2023-01-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-402",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-403",
        memberName: "Bob Johnson",
        date: "2023-03-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  Overall: {
    totalRevenue: 284100,
    pendingPayments: 28800,
    failedPayments: 14400,
    successfulPayments: 240900,
    transactions: [
      // Combined transactions from all periods
      {
        id: "tx-001",
        memberName: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-101",
        memberName: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-201",
        memberName: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
    ],
  },
}
