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