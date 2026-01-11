export const financesData=  [
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
      totalRevenue: 12500,
      pendingPayments: 1800,
      failedPayments: 750,
      successfulPayments: 9950,
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