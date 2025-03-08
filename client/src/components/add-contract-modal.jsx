/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client"

import { X, FileText, Upload, Save, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

export function AddContractModal({ onClose, onSave, leadData = null }) {
  const [isDigital, setIsDigital] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [contractData, setContractData] = useState({
    fullName: "",
    contractTerm: "",
    iban: "",
    email: "",
    phone: "",
    sepaMandate: "",
    leadId: "",
    rateType: "",
    signedFile: null,
    // Additional fields for the contract forms
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
    kreditinstitut: "",
    bic: "",
    ort_datum_unterschrift: "",
    acceptTerms: false,
    acceptPrivacy: false,
  })
  const [showFormView, setShowFormView] = useState(true)

  // Pre-fill data if lead information is available
  useEffect(() => {
    if (leadData) {
      setContractData((prevData) => ({
        ...prevData,
        fullName: leadData.name || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        leadId: leadData.id || "",
        rateType: leadData.interestedIn || "",
        // Split name into first and last name if available
        ...(leadData.name && {
          vorname: leadData.name.split(" ")[0] || "",
          nachname: leadData.name.split(" ").slice(1).join(" ") || "",
        }),
        emailAdresse: leadData.email || "",
        telefonnummer: leadData.phone || "",
      }))
    }
  }, [leadData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setContractData({
      ...contractData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setContractData({ ...contractData, signedFile: file })
    }
  }

  const handlePrintContract = () => {
    // In a real implementation, this would generate a PDF for printing
    window.print()
  }

  const handleSaveContract = () => {
    // Save the contract with all the collected data
    onSave({
      ...contractData,
      isDigital,
    })
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

  return (
    <div className="fixed inset-0 bg-black/50 flex open_sans_font items-center justify-center z-[1000]">
      <div className="bg-[#181818] p-3 w-full max-w-3xl mx-4 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-base open_sans_font_700 text-white">Add Contract</h2>
            <div className="flex items-center gap-2">
              {!showFormView && (
                <button
                  onClick={toggleView}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  <span className="text-xs">Form View</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 open_sans_font">
          {showFormView ? (
            <div>
              <div className="space-y-4 mb-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Lead</label>
                  <select
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
                    name="leadId"
                    value={contractData.leadId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select lead</option>
                    {leadData && <option value={leadData.id}>{leadData.name}</option>}
                  </select>
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
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Bronze">Bronze</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Contract Type</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsDigital(true)}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm ${
                        isDigital ? "bg-[#3F74FF] text-white" : "bg-black text-gray-400 border border-gray-800"
                      }`}
                    >
                      Digital
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDigital(false)}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm ${
                        !isDigital ? "bg-[#3F74FF] text-white" : "bg-black text-gray-400 border border-gray-800"
                      }`}
                    >
                      Analog
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleView}
                className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                {isDigital ? "Fill Contract Digitally" : "Print Contract"}
              </button>

              {!isDigital && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">Upload Signed Contract</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        id="contract-file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="contract-file"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 flex items-center justify-center gap-2 cursor-pointer border border-gray-800"
                      >
                        <Upload size={16} />
                        {contractData.signedFile ? contractData.signedFile.name : "Choose file..."}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isDigital ? (
                <div>
                  {currentPage === 0 ? (
                    <div className="bg-white rounded-lg p-6 relative font-sans">
                      <div className="flex justify-between items-start mb-6">
                        <h1 className="text-black text-2xl font-bold">Member Contract</h1>
                        <div className="bg-gray-700 text-white p-4 w-40 h-20 flex items-center justify-center">
                          <span className="text-2xl font-bold">LOGO</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                          PERSÖNLICHE DATEN
                        </h2>
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Mitgliedsnummer</label>
                            <input
                              type="text"
                              name="mitgliedsnummer"
                              value={contractData.mitgliedsnummer}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded p-2 text-black"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Anrede</label>
                              <input
                                type="text"
                                name="anrede"
                                value={contractData.anrede}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Vorname</label>
                              <input
                                type="text"
                                name="vorname"
                                value={contractData.vorname}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Nachname</label>
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
                              <label className="block text-xs text-gray-600 mb-1">Straße</label>
                              <input
                                type="text"
                                name="strasse"
                                value={contractData.strasse}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Hausnummer</label>
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
                              <label className="block text-xs text-gray-600 mb-1">PLZ</label>
                              <input
                                type="text"
                                name="plz"
                                value={contractData.plz}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-600 mb-1">Ort</label>
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
                            <label className="block text-xs text-gray-600 mb-1">Telefonnummer</label>
                            <input
                              type="tel"
                              name="telefonnummer"
                              value={contractData.telefonnummer}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded p-2 text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Mobil</label>
                            <input
                              type="tel"
                              name="mobil"
                              value={contractData.mobil}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded p-2 text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">E-Mail Adresse</label>
                            <input
                              type="email"
                              name="emailAdresse"
                              value={contractData.emailAdresse}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded p-2 text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Geburtsdatum</label>
                            <input
                              type="date"
                              name="geburtsdatum"
                              value={contractData.geburtsdatum}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded p-2 text-black"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                          VERTRAGSDATEN
                        </h2>
                        <p className="text-sm text-gray-700 mb-2">
                          Ich habe mich für den nachfolgenden Tarif entschieden:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Tarif Mindestlaufzeit</label>
                              <input
                                type="text"
                                name="tarifMindestlaufzeit"
                                value={contractData.tarifMindestlaufzeit}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Preis pro Woche (in €)</label>
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
                              <label className="block text-xs text-gray-600 mb-1">Startbox</label>
                              <input
                                type="text"
                                name="startbox"
                                value={contractData.startbox}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Mindestlaufzeit</label>
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
                              <label className="block text-xs text-gray-600 mb-1">
                                Start der Mitgliedschaft (Montag)
                              </label>
                              <input
                                type="date"
                                name="startDerMitgliedschaft"
                                value={contractData.startDerMitgliedschaft}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Start des Trainings</label>
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
                              <label className="block text-xs text-gray-600 mb-1">Vertragsverlängerungsdauer</label>
                              <input
                                type="text"
                                name="vertragsverlaengerungsdauer"
                                value={contractData.vertragsverlaengerungsdauer}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                                placeholder="1 Woche"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Kündigungsfrist</label>
                              <input
                                type="text"
                                name="kuendigungsfrist"
                                value={contractData.kuendigungsfrist}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded p-2 text-black"
                                placeholder="1 Monat"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-700">
                          <p>Es gelten die beigefügten AGB des Vertragsgebers, namentlich:</p>
                          <p className="mt-2">
                            Die Mitgliedschaft verlängert sich nach Ablauf der Mindestlaufzeit auf unbestimmte Zeit zum
                            Preis von 42,90 €/Woche, sofern sie nicht innerhalb der Kündigungsfrist von 1 Monat vor
                            Ablauf der Mindestlaufzeit in Textform gekündigt & keine individuellen Konditionen für die
                            Folgezeit im Textfeld "Vertragsbemerkung" vereinbart werden.
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                          BEITRAGSANPASSUNGEN
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" className="w-full border border-gray-300 rounded p-2 text-black" />
                          <input type="text" className="w-full border border-gray-300 rounded p-2 text-black" />
                          <input type="text" className="w-full border border-gray-300 rounded p-2 text-black" />
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="border-t border-gray-300 pt-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Ort, Datum/Unterschrift Vertragsnehmer
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
                              <p className="text-xs text-gray-600 mb-1">
                                Dieser Vertrag ist auch ohne Unterschrift gültig
                              </p>
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
                      <h1 className="text-black text-xl font-bold mb-4 text-[#8B4513]">SEPA-LASTSCHRIFTMANDAT</h1>

                      <p className="text-sm text-gray-700 mb-4">
                        Ich ermächtige{" "}
                        <span className="font-medium">
                          Zahlungen von meinem Konto unter Angabe der Gläubiger ID-Nr:
                        </span>{" "}
                        mittels Lastschrift einzuziehen.
                      </p>
                      <p className="text-sm text-gray-700 mb-4">
                        Zugleich weise ich mein Kreditinstitut an, die von{" "}
                        <span className="font-medium">auf meinem Konto gezogenen Lastschriften einzulösen.</span>
                      </p>

                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Vorname und Name (Kontoinhaber)</label>
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
                            <label className="block text-xs text-gray-600 mb-1">Kreditinstitut (Name)</label>
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
                            <label className="block text-xs text-gray-600 mb-1">SEPA Mandatsreferenz Nummer</label>
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
                            Ort, Datum/Unterschrift Kontoinhaber
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
                            <span className="font-bold">LEISTUNGSBESCHREIBUNG & AGB</span>
                            <br />
                            Hiermit stimme ich der angehängenen Leistungsbeschreibung & den allgemeinen
                            Geschäftsbedingungen (AGB) zu, soweit im Textfeld "Vertragsbemerkung" nichts anderes
                            schriftlich vereinbart wurde.
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
                            <span className="font-bold">DATENSCHUTZVEREINBARUNG</span>
                            <br />
                            Hiermit stimme ich der Erhebung und Verarbeitung meiner personenbezogenen Daten gem.
                            angehängener Datenschutzvereinbarung durch die zu.
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
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handlePrintContract}
                    className="px-4 py-2 bg-[#3F74FF] text-white rounded-xl text-sm flex items-center gap-2 mx-auto"
                  >
                    <FileText size={16} />
                    Print Contract
                  </button>

                  <div className="mt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Upload Signed Contract</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          id="contract-file-analog"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="contract-file-analog"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 flex items-center justify-center gap-2 cursor-pointer border border-gray-800"
                        >
                          <Upload size={16} />
                          {contractData.signedFile ? contractData.signedFile.name : "Choose file..."}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-800 mt-4">
            <button
              type="button"
              onClick={handleSaveContract}
              className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={!isDigital && !contractData.signedFile}
            >
              <Save size={16} />
              Save Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

