"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Eye } from "lucide-react"
import { toast } from "react-hot-toast"

const contractTypes = [
  {
    id: "basic",
    name: "Basic",
    duration: "12 months",
    cost: "$29.99",
    billingPeriod: "Monthly",
  },
  {
    id: "premium",
    name: "Premium",
    duration: "12 months",
    cost: "$49.99",
    billingPeriod: "Monthly",
  },
  {
    id: "bronze",
    name: "Bronze",
    duration: "6 months",
    cost: "$19.99",
    billingPeriod: "Monthly",
  },
]

export function EditContractModal({ onClose, onSave, contractData: initialContractData, memberName }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [showFormView, setShowFormView] = useState(false)
  const [contractData, setContractData] = useState({
    fullName: memberName || "",
    studioName: "",
    studioOwnerName: "",
    contractTerm: "",
    iban: "",
    email: "",
    phone: "",
    sepaMandate: "",
    leadId: "",
    rateType: "",
    signedFile: null,
    // Additional fields for the contract form
    vorname: "",
    nachname: "",
    anrede: "",
    strasse: "",
    hausnummer: "",
    plz: "",
    ort: "",
    telefonnummer: "",
    mobil: "",
    emailAdresse: "",
    geburtsdatum: "",
    mitgliedsnummer: "",
    tarifMindestlaufzeit: "",
    startbox: "",
    mindestlaufzeit: "",
    preisProWoche: "",
    startDerMitgliedschaft: "",
    startDesTrainings: "",
    vertragsverlaengerungsdauer: "",
    kuendigungsfrist: "",
    ort_datum_unterschrift: "",
    kreditinstitut: "",
    bic: "",
    acceptTerms: false,
    acceptPrivacy: false,
    ...initialContractData, // Pre-fill with existing contract data
  })

  const [discount, setDiscount] = useState({
    percentage: 0,
    duration: 1,
    isPermanent: false,
  })

  useEffect(() => {
    setShowFormView(true)
  }, [])

  const selectedContractType = contractTypes.find((type) => type.name === contractData.rateType)

  const priceCalculation = selectedContractType
    ? {
        originalPrice: Number.parseFloat(selectedContractType.cost.replace("$", "")),
        discountAmount: (Number.parseFloat(selectedContractType.cost.replace("$", "")) * discount.percentage) / 100,
        finalPrice:
          Number.parseFloat(selectedContractType.cost.replace("$", "")) -
          (Number.parseFloat(selectedContractType.cost.replace("$", "")) * discount.percentage) / 100,
        currency: "$",
      }
    : null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setContractData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleDiscountChange = (e) => {
    const { name, value, type, checked } = e.target
    setDiscount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const toggleView = () => {
    setShowFormView(!showFormView)
  }

  const nextPage = () => {
    setCurrentPage(1)
  }

  const prevPage = () => {
    setCurrentPage(0)
  }

  const handleGenerateContract = () => {
    const signedContractData = {
      ...contractData,
      isSigned: true,
      signedDate: new Date().toISOString(),
      contractId: `contract-${Date.now()}`,
    }

    // Simulate PDF generation
    toast.loading("Generating signed contract PDF...")

    setTimeout(() => {
      toast.dismiss()
      toast.success("Contract signed and PDF generated successfully!")
      onSave(signedContractData)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-white text-lg sm:text-xl font-medium">Edit Contract - {memberName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {showFormView ? (
            <div>
              <div className="space-y-4 mb-4">
                <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white text-sm font-medium mb-2">Contract Information</h4>
                  <div className="text-sm text-gray-300">
                    <p>
                      <span className="text-gray-400">Member:</span> {memberName}
                    </p>
                    <p>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        Unsigned Contract
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Rate Type</label>
                  <select
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
                    name="rateType"
                    value={contractData.rateType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select rate type</option>
                    {contractTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedContractType && (
                  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-white text-sm font-medium mb-2">Contract Details</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-400 text-xs">Duration</span>
                        <span className="text-white">{selectedContractType.duration}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Cost</span>
                        <span className="text-white">{selectedContractType.cost}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Billing Period</span>
                        <span className="text-white">{selectedContractType.billingPeriod}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white text-sm font-medium mb-2">Discount</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Percentage (%)</label>
                      <input
                        type="number"
                        name="percentage"
                        min="0"
                        max="100"
                        value={discount.percentage}
                        onChange={handleDiscountChange}
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className={discount.isPermanent ? "opacity-50" : ""}>
                      <label className="block text-gray-400 text-xs mb-1">Billing Periods</label>
                      <input
                        type="number"
                        name="duration"
                        min="1"
                        value={discount.duration}
                        onChange={handleDiscountChange}
                        disabled={discount.isPermanent}
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mt-7 text-xs mb-1"></label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPermanent"
                          checked={discount.isPermanent}
                          onChange={handleDiscountChange}
                          className="form-checkbox h-5 w-5 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
                        />
                        <span className="text-gray-400 text-xs">Till End of Contract</span>
                      </label>
                    </div>
                  </div>
                  {priceCalculation && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h5 className="text-white text-sm font-medium mb-2">Price Calculation</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Original Price:</span>
                          <span className="text-white">
                            {priceCalculation.currency}
                            {priceCalculation.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Discount ({discount.percentage}%):</span>
                          <span className="text-red-400">
                            -{priceCalculation.currency}
                            {priceCalculation.discountAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-700 pt-2">
                          <span className="text-white font-medium">Final Price:</span>
                          <span className="text-green-400 font-medium">
                            {priceCalculation.currency}
                            {priceCalculation.finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={toggleView}
                className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Eye size={16} /> Review & Sign Contract
              </button>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              {currentPage === 0 ? (
                <div className="bg-white rounded-lg p-6 relative font-sans">
                  <div className="flex justify-between items-start mb-6">
                    <h1 className="text-black text-2xl font-bold">Studio Contract</h1>
                    <div className="bg-gray-700 text-white p-4 w-40 h-20 flex items-center justify-center">
                      <span className="text-2xl font-bold">LOGO</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                      STUDIO INFORMATION
                    </h2>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Studio Name</label>
                        <input
                          type="text"
                          name="studioName"
                          value={contractData.studioName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Studio Owner Name</label>
                        <input
                          type="text"
                          name="studioOwnerName"
                          value={contractData.studioOwnerName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Title</label>
                          <input
                            type="text"
                            name="anrede"
                            value={contractData.anrede}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">First Name</label>
                          <input
                            type="text"
                            name="vorname"
                            value={contractData.vorname}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                          <input
                            type="text"
                            name="nachname"
                            value={contractData.nachname}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Street</label>
                          <input
                            type="text"
                            name="strasse"
                            value={contractData.strasse}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">House Number</label>
                          <input
                            type="text"
                            name="hausnummer"
                            value={contractData.hausnummer}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Postal Code</label>
                          <input
                            type="text"
                            name="plz"
                            value={contractData.plz}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">City</label>
                          <input
                            type="text"
                            name="ort"
                            value={contractData.ort}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="telefonnummer"
                          value={contractData.telefonnummer}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Mobile</label>
                        <input
                          type="tel"
                          name="mobil"
                          value={contractData.mobil}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="emailAdresse"
                          value={contractData.emailAdresse}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                      CONTRACT DETAILS
                    </h2>
                    <p className="text-sm text-gray-700 mb-2">I have chosen the following plan:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Plan Minimum Term</label>
                          <input
                            type="text"
                            name="tarifMindestlaufzeit"
                            value={contractData.tarifMindestlaufzeit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Price per Week (€)</label>
                          <input
                            type="text"
                            name="preisProWoche"
                            value={contractData.preisProWoche}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Starter Box</label>
                          <input
                            type="text"
                            name="startbox"
                            value={contractData.startbox}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Minimum Term</label>
                          <input
                            type="text"
                            name="mindestlaufzeit"
                            value={contractData.mindestlaufzeit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Contract Start (Monday)</label>
                          <input
                            type="date"
                            name="startDerMitgliedschaft"
                            value={contractData.startDerMitgliedschaft}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Service Start</label>
                          <input
                            type="date"
                            name="startDesTrainings"
                            value={contractData.startDesTrainings}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Contract Extension Period</label>
                          <input
                            type="text"
                            name="vertragsverlaengerungsdauer"
                            value={contractData.vertragsverlaengerungsdauer}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                            placeholder="1 Week"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Notice Period</label>
                          <input
                            type="text"
                            name="kuendigungsfrist"
                            value={contractData.kuendigungsfrist}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                            placeholder="1 Month"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700">
                      <p>The provider's terms and conditions apply, namely:</p>
                      <p className="mt-2">
                        After the minimum term expires, the contract will continue indefinitely at a price of
                        €42.90/week, unless terminated in writing within the notice period of 1 month before the end of
                        the minimum term & no individual conditions for the subsequent period are agreed in the
                        "Contract remarks" text field.
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="border-t border-gray-300 pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Place, Date/Signature of Contracting Party
                          </label>
                          <input
                            type="text"
                            name="ort_datum_unterschrift"
                            value={contractData.ort_datum_unterschrift}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">This contract is valid without signature</p>
                          <p className="text-xs text-gray-600">i.A.kom.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={nextPage}
                      className="px-4 py-2 bg-[#3F74FF] text-white rounded-xl text-sm"
                    >
                      Next: SEPA Mandate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 relative font-sans">
                  <h1 className="text-black text-xl font-bold mb-4 text-[#8B4513]">SEPA DIRECT DEBIT MANDATE</h1>
                  <p className="text-sm text-gray-700 mb-4">
                    I authorize <span className="font-medium">payments from my account with creditor ID no:</span> to be
                    collected by direct debit.
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    At the same time, I instruct my credit institution to{" "}
                    <span className="font-medium">honor the direct debits drawn on my account.</span>
                  </p>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">First and Last Name (Account Holder)</label>
                      <input
                        type="text"
                        name="fullName"
                        value={contractData.fullName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Credit Institution (Name)</label>
                        <input
                          type="text"
                          name="kreditinstitut"
                          value={contractData.kreditinstitut}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">BIC</label>
                        <input
                          type="text"
                          name="bic"
                          value={contractData.bic}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">IBAN</label>
                        <input
                          type="text"
                          name="iban"
                          value={contractData.iban}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">SEPA Mandate Reference Number</label>
                        <input
                          type="text"
                          name="sepaMandate"
                          value={contractData.sepaMandate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4 mb-4">
                    <div className="mb-8">
                      <label className="block text-xs text-gray-600 mb-1">
                        Place, Date/Signature of Account Holder
                      </label>
                      <div className="border-b border-gray-300 mt-8"></div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={contractData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                        <span className="font-bold">SERVICE DESCRIPTION & TERMS</span>
                        <br />I hereby agree to the attached service description & general terms and conditions (GTC),
                        unless otherwise agreed in writing in the "Contract remarks" text field.
                      </label>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <input
                        type="checkbox"
                        id="acceptPrivacy"
                        name="acceptPrivacy"
                        checked={contractData.acceptPrivacy}
                        onChange={handleInputChange}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor="acceptPrivacy" className="text-sm text-gray-700">
                        <span className="font-bold">DATA PROTECTION AGREEMENT</span>
                        <br />I hereby consent to the collection and processing of my personal data according to the
                        attached data protection agreement.
                      </label>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4 mb-4"></div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevPage}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateContract}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium"
                      disabled={!contractData.acceptTerms || !contractData.acceptPrivacy}
                    >
                      Sign & Generate PDF Contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-sm text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          {showFormView && (
            <button
              onClick={toggleView}
              className="px-4 py-2 bg-[#F27A30] text-sm text-white rounded-xl hover:bg-[#F27A30]/90 transition-colors"
            >
              Back to Settings
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
