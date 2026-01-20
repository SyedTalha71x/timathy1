/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosSend, IoIosClock, IoIosBuild, IoIosCreate, IoIosJournal } from "react-icons/io";
import { MdPerson, MdEmail, MdBusiness, MdPhotoCamera } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import LeadSelectionModal from "../../components/admin-dashboard-components/demo-access-components/LeadSelectionModal";
import TemplateSelectionModal from "../../components/admin-dashboard-components/demo-access-components/TemplateSelectionModal";
import DemoConfiguratorModal from "../../components/admin-dashboard-components/demo-access-components/DemoConfiguratorModal";
import SendEmailModal from "../../components/admin-dashboard-components/demo-access-components/SendEmailModal";
import CustomConfirmationModal from "../../components/admin-dashboard-components/demo-access-components/CustomConfirmationModal";
import JournalModal from "../../components/admin-dashboard-components/demo-access-components/JournalModal";

// Mock data for leads and templates
const mockLeads = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", company: "Tech Corp" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", company: "Fitness Plus" },
  { id: 3, name: "Mike Wilson", email: "mike.wilson@example.com", company: "Global Gym" },
  { id: 4, name: "Emily Davis", email: "emily.davis@example.com", company: "FitLife Studios" },
];

const mockTemplates = [
  {
    id: "basic",
    name: "Basic Demo",
    description: "Limited access with core features",
    permissions: {
      dashboard: true,
      analytics: false,
      billing: false,
      settings: false,
      reports: true
    }
  },
  {
    id: "standard",
    name: "Standard Demo",
    description: "Full access with some restrictions",
    permissions: {
      dashboard: true,
      analytics: true,
      billing: false,
      settings: true,
      reports: true
    }
  },
  {
    id: "premium",
    name: "Premium Demo",
    description: "Complete platform access",
    permissions: {
      dashboard: true,
      analytics: true,
      billing: true,
      settings: true,
      reports: true
    }
  }
];

// Mock journal data
const mockJournalData = [
  { id: 1, action: "Demo Created", timestamp: "2024-01-20 10:30:00", user: "Admin", details: "Created demo for John Smith" },
  { id: 2, action: "Email Sent", timestamp: "2024-01-20 10:35:00", user: "System", details: "Access email sent to john.smith@example.com" },
  { id: 3, action: "Demo Accessed", timestamp: "2024-01-20 11:15:00", user: "John Smith", details: "User logged in for the first time" },
  { id: 4, action: "Configuration Changed", timestamp: "2024-01-20 14:20:00", user: "Admin", details: "Changed demo duration from 7 to 14 days" },
];

export default function DemoCreationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [demoConfig, setDemoConfig] = useState({
    studioName: "",
    studioOwner: "",
    studioLogo: null,
    demoDuration: 7,
    email: "",
    sendEmail: true
  });
  const [createdDemos, setCreatedDemos] = useState([]);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState(null);
  const [demoToResend, setDemoToResend] = useState(null);
  const [journalData, setJournalData] = useState(mockJournalData);
  const [selectedDemoForJournal, setSelectedDemoForJournal] = useState(null);

  // Initialize with empty demo config
  useEffect(() => {
    if (selectedLead) {
      setDemoConfig(prev => ({
        ...prev,
        studioName: `${selectedLead.company} Studio` || "",
        studioOwner: selectedLead.name || "",
        email: selectedLead.email || ""
      }));
    }
  }, [selectedLead]);

  const handleCreateDemo = () => {
    const newDemo = {
      id: Date.now(),
      lead: selectedLead,
      template: selectedTemplate,
      config: demoConfig,
      createdAt: new Date().toISOString(),
      status: 'active',
      expiryDate: new Date(Date.now() + demoConfig.demoDuration * 24 * 60 * 60 * 1000).toISOString(),
      journal: [
        {
          action: "Demo Created",
          timestamp: new Date().toISOString(),
          user: "Admin",
          details: `Created demo for ${demoConfig.studioName}`
        }
      ]
    };

    setCreatedDemos(prev => [newDemo, ...prev]);
    setCurrentStep(1);
    setSelectedLead(null);
    setSelectedTemplate(null);
    setDemoConfig({
      studioName: "",
      studioOwner: "",
      studioLogo: null,
      demoDuration: 7,
      email: "",
      sendEmail: true
    });

    setIsEmailModalOpen(true);
    toast.success("Demo created successfully!");
  };

  const handleUpdateDemo = (updatedConfig, updatedTemplate) => {
    const updatedDemos = createdDemos.map(demo => {
      if (demo.id === editingDemo.id) {
        const updatedExpiryDate = demo.status === 'active' 
          ? new Date(Date.now() + updatedConfig.demoDuration * 24 * 60 * 60 * 1000).toISOString()
          : demo.expiryDate;
        
        return {
          ...demo,
          template: updatedTemplate || demo.template,
          config: updatedConfig,
          expiryDate: updatedExpiryDate,
          journal: [
            ...demo.journal,
            {
              action: "Demo Updated",
              timestamp: new Date().toISOString(),
              user: "Admin",
              details: `Updated configuration for ${updatedConfig.studioName}`
            }
          ]
        };
      }
      return demo;
    });
    
    setCreatedDemos(updatedDemos);
    setEditingDemo(null);
    setIsConfigModalOpen(false);
    toast.success("Demo updated successfully!");
  };

  const handleToggleDemoStatus = (demoId) => {
    const updatedDemos = createdDemos.map(demo => {
      if (demo.id === demoId) {
        const newStatus = demo.status === 'active' ? 'inactive' : 'active';
        
        return {
          ...demo,
          status: newStatus,
          // Remove expiry date when set to inactive
          expiryDate: newStatus === 'inactive' ? null : demo.expiryDate,
          journal: [
            ...demo.journal,
            {
              action: `Demo ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
              timestamp: new Date().toISOString(),
              user: "Admin",
              details: `Demo status changed to ${newStatus}`
            }
          ]
        };
      }
      return demo;
    });
    
    setCreatedDemos(updatedDemos);
    toast.success(`Demo status updated to ${updatedDemos.find(d => d.id === demoId).status}`);
  };

  const handleSendEmail = (demoId, shouldSend) => {
    if (shouldSend) {
      // Add journal entry
      const demo = createdDemos.find(d => d.id === demoId);
      if (demo) {
        const updatedDemos = createdDemos.map(d => {
          if (d.id === demoId) {
            return {
              ...d,
              journal: [
                ...d.journal,
                {
                  action: "Email Sent",
                  timestamp: new Date().toISOString(),
                  user: "System",
                  details: `Access email sent to ${d.config.email}`
                }
              ]
            };
          }
          return d;
        });
        setCreatedDemos(updatedDemos);
      }
      toast.success("Demo access email sent successfully!");
    } else {
      toast.success("Demo created without email notification");
    }
    setIsEmailModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleSkipLead = () => {
    setSelectedLead({
      id: 'guest',
      name: 'Guest User',
      email: demoConfig.email || 'guest@example.com',
      company: 'Unknown Company'
    });
    setIsLeadModalOpen(false);
    setCurrentStep(2);
  };

  const handleResendEmail = (demoId) => {
    setDemoToResend(demoId);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmResend = () => {
    if (demoToResend) {
      handleSendEmail(demoToResend, true);
      setDemoToResend(null);
    }
  };

  const handleViewJournal = (demo) => {
    setSelectedDemoForJournal(demo);
    setIsJournalModalOpen(true);
  };

  const canProceedToStep2 = selectedLead !== null;
  const canProceedToStep3 = selectedTemplate !== null;
  const canCreateDemo = demoConfig.studioName && demoConfig.studioOwner && demoConfig.email;

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4 md:p-6 lg:p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <h1 className="text-xl md:text-2xl font-bold oxanium_font">Demo Access</h1>
        </div>
      </div>

      {/* Progress Steps - Mobile Optimized */}
      <div className="flex items-center justify-center mb-8 md:mb-12">
        <div className="flex items-center w-full max-w-5xl">
          {/* Step 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-600'
            }`}>
              <MdPerson size={16} className={`${currentStep >= 1 ? 'text-white' : 'text-gray-400'} md:w-5 md:h-5 lg:w-6 lg:h-6`} />
            </div>
            <span className="text-xs md:text-sm mt-1 md:mt-2 text-gray-300 text-center">Select Lead</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-600'
            }`}>
              <RiShieldKeyholeLine size={16} className={`${currentStep >= 2 ? 'text-white' : 'text-gray-400'} md:w-5 md:h-5 lg:w-6 lg:h-6`} />
            </div>
            <span className="text-xs md:text-sm mt-1 md:mt-2 text-gray-300 text-center">Choose Template</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 3 ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-600'
            }`}>
              <IoIosBuild size={16} className={`${currentStep >= 3 ? 'text-white' : 'text-gray-400'} md:w-5 md:h-5 lg:w-6 lg:h-6`} />
            </div>
            <span className="text-xs md:text-sm mt-1 md:mt-2 text-gray-300 text-center">Configure</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto">
        {currentStep === 1 && (
          <div className="bg-[#2A2A2A] rounded-xl p-4 md:p-6 lg:p-8 border border-gray-700">
            <h2 className="text-lg md:text-xl font-bold mb-2">Select a Lead</h2>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Choose an existing lead or proceed without one</p>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div 
                onClick={() => setIsLeadModalOpen(true)}
                className="border-2 border-dashed border-gray-600 rounded-xl p-4 md:p-6 lg:p-8 text-center hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer"
              >
                <MdPerson size={32} className="mx-auto text-gray-400 mb-3 md:mb-4 w-8 h-8 md:w-12 md:h-12" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Select from Leads</h3>
                <p className="text-gray-400 text-xs md:text-sm">Choose from your existing lead database</p>
              </div>

              <div 
                onClick={handleSkipLead}
                className="border-2 border-dashed border-gray-600 rounded-xl p-4 md:p-6 lg:p-8 text-center hover:border-green-500 hover:bg-green-500/10 transition-all cursor-pointer"
              >
                <MdBusiness size={32} className="mx-auto text-gray-400 mb-3 md:mb-4 w-8 h-8 md:w-12 md:h-12" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Proceed Without Lead</h3>
                <p className="text-gray-400 text-xs md:text-sm">Create demo access without linking to a specific lead</p>
              </div>
            </div>

            {selectedLead && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <p className="text-green-400 text-sm md:text-base">
                  Selected: <strong>{selectedLead.name}</strong> ({selectedLead.email})
                </p>
              </div>
            )}

            <div className="flex justify-end mt-6 md:mt-8">
              <button
                onClick={() => canProceedToStep2 && setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className="bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm md:text-base w-full md:w-auto"
              >
                Continue to Template
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-[#2A2A2A] rounded-xl p-4 md:p-6 lg:p-8 border border-gray-700">
            <h2 className="text-lg md:text-xl font-bold mb-2">Choose Template</h2>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Select a template with specific permissions for the demo</p>
            
            <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-3">
              {mockTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`border-2 rounded-xl p-4 md:p-6 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <RiShieldKeyholeLine size={24} className="text-blue-400 mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8" />
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{template.name}</h3>
                  <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">{template.description}</p>
                  <div className="space-y-1 md:space-y-2">
                    {Object.entries(template.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center text-xs md:text-sm">
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-2 ${
                          value ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="capitalize">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-0 mt-6 md:mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-gray-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm md:text-base w-full md:w-auto"
              >
                Back
              </button>
              <button
                onClick={() => canProceedToStep3 && setCurrentStep(3)}
                disabled={!canProceedToStep3}
                className="bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm md:text-base w-full md:w-auto"
              >
                Continue to Configuration
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-[#2A2A2A] rounded-xl p-4 md:p-6 lg:p-8 border border-gray-700">
            <h2 className="text-lg md:text-xl font-bold mb-2">Configure Demo Details</h2>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Set up the demo environment and access details</p>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Studio Name
                </label>
                <input
                  type="text"
                  value={demoConfig.studioName}
                  onChange={(e) => setDemoConfig({...demoConfig, studioName: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white focus:outline-none focus:border-blue-500 text-sm md:text-base"
                  placeholder="Enter studio name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Studio Owner
                </label>
                <input
                  type="text"
                  value={demoConfig.studioOwner}
                  onChange={(e) => setDemoConfig({...demoConfig, studioOwner: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white focus:outline-none focus:border-blue-500 text-sm md:text-base"
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Demo Duration (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={demoConfig.demoDuration}
                    onChange={(e) => setDemoConfig({...demoConfig, demoDuration: parseInt(e.target.value)})}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white focus:outline-none focus:border-blue-500 text-sm md:text-base pr-10"
                  />
                  <IoIosClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={demoConfig.email}
                    onChange={(e) => setDemoConfig({...demoConfig, email: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white focus:outline-none focus:border-blue-500 text-sm md:text-base pr-10"
                    placeholder="user@example.com"
                  />
                  <MdEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-0">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-gray-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm  w-full md:w-auto"
              >
                Back
              </button>
              <button
                onClick={handleCreateDemo}
                disabled={!canCreateDemo}
                className="bg-orange-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-1 md:gap-2 text-sm  w-full md:w-auto"
              >
                Create Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Created Demos List */}
      {createdDemos.length > 0 && (
        <div className="mt-8 md:mt-12">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Created Demos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {createdDemos.map(demo => (
              <div key={demo.id} className="bg-[#2A2A2A] rounded-xl p-4 md:p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <h3 className="font-semibold text-base md:text-lg truncate mr-2">{demo.config.studioName}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleDemoStatus(demo.id)}
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        demo.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {demo.status}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                  <p className="truncate">Owner: {demo.config.studioOwner}</p>
                  <p className="truncate">Email: {demo.config.email}</p>
                  <p className="truncate">Template: {demo.template.name}</p>
                  <p>Duration: {demo.config.demoDuration} days</p>
                  {demo.status === 'active' && demo.expiryDate ? (
                    <p className="text-xs">Expires: {new Date(demo.expiryDate).toLocaleDateString()}</p>
                  ) : (
                    <p className="text-xs text-red-400">Inactive - No expiry date</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewJournal(demo)}
                    className="flex-1 bg-purple-600 text-white py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                  >
                    {/* <IoIosJournal size={12} className="md:w-3.5 md:h-3.5" /> */}
                    Journal
                  </button>
                  <button
                    onClick={() => {
                      setEditingDemo(demo);
                      setIsConfigModalOpen(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    {/* <IoIosBuild size={12} className="md:w-3.5 md:h-3.5" /> */}
                    Edit
                  </button>
                  <button
                    onClick={() => handleResendEmail(demo.id)}
                    className="flex-1 bg-orange-600 text-white py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
                  >
                    {/* <IoIosSend size={12} className="md:w-3.5 md:h-3.5" /> */}
                    Resend Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <LeadSelectionModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSelectLead={setSelectedLead}
        leads={mockLeads}
        onSkip={handleSkipLead}
      />

      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={setSelectedTemplate}
        templates={mockTemplates}
      />

      {editingDemo && (
        <DemoConfiguratorModal
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false);
            setEditingDemo(null);
          }}
          demo={editingDemo}
          onUpdate={handleUpdateDemo}
          availableTemplates={mockTemplates}
        />
      )}

      {createdDemos[0] && (
        <SendEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          demo={createdDemos[0]}
          onSend={(shouldSend) => handleSendEmail(createdDemos[0].id, shouldSend)}
        />
      )}

      <CustomConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setDemoToResend(null);
        }}
        onConfirm={handleConfirmResend}
        title="Resend Email"
        message="Are you sure you want to send the email again?"
        confirmText="Yes, Send Email"
        confirmColor="orange"
      />

      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => {
          setIsJournalModalOpen(false);
          setSelectedDemoForJournal(null);
        }}
        demo={selectedDemoForJournal}
      />
    </div>
  );
}