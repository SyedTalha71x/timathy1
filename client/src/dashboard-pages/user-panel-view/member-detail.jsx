/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import {
  X,
  Cake,
  Eye,
  Info,
  AlertTriangle,
  Calendar,
  History,
  MessageCircle,
  Dumbbell,
  FileText,
  Users,
  Edit2,
  //   Archive,
  //   Unarchive,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User,
  ChevronLeft,
} from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

// Importing necessary modals from your existing code
import HistoryModalMain from "../../components/user-panel-components/members-components/HistoryModal"
import NotifyMemberModalMain from "../../components/user-panel-components/members-components/NotifyMemberModal"
import EditMemberModalMain from "../../components/user-panel-components/members-components/EditMemberModal"
import AddBillingPeriodModalMain from "../../components/user-panel-components/members-components/AddBillingPeriodModal"
import ContingentModalMain from "../../components/user-panel-components/members-components/ShowContigentModal"
import ViewDetailsModal from "../../components/user-panel-components/members-components/ViewDetailsModal"
import AppointmentModalMain from "../../components/user-panel-components/members-components/AppointmentModal"
import { MemberDocumentModal } from "../../components/user-panel-components/members-components/MemberDocumentModal"
import AddAppointmentModal from "../../components/user-panel-components/members-components/AddAppointmentModal"
import EditAppointmentModalMain from "../../components/user-panel-components/members-components/EditAppointmentModal"
import ChatPopup from "../../components/shared/ChatPopup"
import TrainingPlansModalMain from "../../components/user-panel-components/members-components/TrainingPlanModal"

// Importing data states
import {
  appointmentsMainData,
  appointmentTypeMainData,
  freeAppointmentsMainData,
  memberHistoryMainData,
  memberRelationsMainData,
} from "../../utils/user-panel-states/members-states"

import DefaultAvatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import { appointmentsData, membersData } from "../../utils/user-panel-states/appointment-states"

const StatusTag = ({ status, reason = "" }) => {
  const getStatusColor = (status, isArchived) => {
    if (isArchived) return 'bg-red-600';
    if (status === 'active') return 'bg-green-600';
    if (status === 'paused') return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  const getStatusText = (status, reason, isArchived) => {
    if (isArchived) return 'Archived';
    if (status === 'active') return 'Active';
    if (status === 'paused') return `Paused${reason ? ` (${reason})` : ''}`;
    return 'Unknown';
  };

  const bgColor = getStatusColor(status, status === 'archived');
  const statusText = getStatusText(status, reason, status === 'archived');

  return (
    <div className={`inline-flex items-center gap-2 ${bgColor} text-white px-3 py-1.5 rounded-xl text-sm font-medium`}>
      <span>{statusText}</span>
    </div>
  );
};

export default function MemberDetailPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals states
  const [isEditModalOpenMain, setIsEditModalOpenMain] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [viewDetailsInitialTab, setViewDetailsInitialTab] = useState("details");

  const [activeNoteIdMain, setActiveNoteIdMain] = useState(null);
  const [editModalTabMain, setEditModalTabMain] = useState("details");

  const [chatPopup, setChatPopup] = useState({
    isOpen: false,
    member: null
  });

  const [showAppointmentModalMain, setShowAppointmentModalMain] = useState(false);
  const [showAddAppointmentModalMain, setShowAddAppointmentModalMain] = useState(false);
  const [showSelectedAppointmentModalMain, setShowSelectedAppointmentModalMain] = useState(false);
  const [selectedAppointmentDataMain, setSelectedAppointmentDataMain] = useState(null);

  const [isNotifyMemberOpenMain, setIsNotifyMemberOpenMain] = useState(false);
  const [notifyActionMain, setNotifyActionMain] = useState("");

  const [showContingentModalMain, setShowContingentModalMain] = useState(false);
  const [tempContingentMain, setTempContingentMain] = useState({ used: 0, total: 0 });
  const [currentBillingPeriodMain] = useState("04.14.25 - 04.18.2025");
  const [selectedBillingPeriodMain, setSelectedBillingPeriodMain] = useState("current");
  const [showAddBillingPeriodModalMain, setShowAddBillingPeriodModalMain] = useState(false);
  const [newBillingPeriodMain, setNewBillingPeriodMain] = useState("");

  const [showHistoryModalMain, setShowHistoryModalMain] = useState(false);
  const [historyTabMain, setHistoryTabMain] = useState("general");

  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [showTrainingPlansModalMain, setShowTrainingPlansModalMain] = useState(false);
  const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({});

  const [editingRelationsMain, setEditingRelationsMain] = useState(false);
  const [newRelationMain, setNewRelationMain] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  });

  // Data states
  const [memberContingent, setMemberContingent] = useState({
    1: {
      current: { used: 2, total: 7 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
    2: {
      current: { used: 1, total: 8 },
      future: {
        "05.14.25 - 05.18.2025": { used: 0, total: 8 },
        "06.14.25 - 06.18.2025": { used: 0, total: 8 },
      },
    },
  });

  const [appointmentsMain, setAppointmentsMain] = useState(appointmentsMainData);
  const [appointmentTypesMain, setAppointmentTypesMain] = useState(appointmentTypeMainData);
  const [freeAppointmentsMain, setFreeAppointmentsMain] = useState(freeAppointmentsMainData);
  const [memberHistoryMain, setMemberHistoryMain] = useState(memberHistoryMainData);
  const [memberRelationsMain, setMemberRelationsMain] = useState(memberRelationsMainData);
  const [availableBillingPeriods, setAvailableBillingPeriods] = useState([
    "07.14.25 - 07.18.2025",
    "08.14.25 - 08.18.2025",
    "09.14.25 - 09.18.2025",
    "10.14.25 - 10.18.2025"
  ]);

  const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([
    {
      id: 1,
      name: "Beginner Full Body",
      description: "Complete full body workout for beginners",
      duration: "4 weeks",
      difficulty: "Beginner",
    },
    {
      id: 2,
      name: "Advanced Strength Training",
      description: "High intensity strength building program",
      duration: "8 weeks",
      difficulty: "Advanced",
    },
    {
      id: 3,
      name: "Weight Loss Circuit",
      description: "Fat burning circuit training program",
      duration: "6 weeks",
      difficulty: "Intermediate",
    },
    {
      id: 4,
      name: "Muscle Building Split",
      description: "Targeted muscle building program",
      duration: "12 weeks",
      difficulty: "Intermediate",
    },
  ]);

  const [editFormMain, setEditFormMain] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    gender: "",
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    contractStart: "",
    contractEnd: "",
  });

  const notePopoverRefMain = useRef(null);


  useEffect(() => {
    const fetchMemberData = () => {
      setIsLoading(true);

      // First find the member from membersData array using memberId
      const foundMember = membersData.find(member => member.id === parseInt(memberId));
      console.log('found the member', foundMember);
      

      if (foundMember) {
        setMember(foundMember);
        setEditFormMain({
          firstName: foundMember.firstName || "",
          lastName: foundMember.lastName || "",
          email: foundMember.email || "",
          phone: foundMember.phone || "",
          street: foundMember.street || "",
          zipCode: foundMember.zipCode || "",
          gender: foundMember.gender || "",
          city: foundMember.city || "",
          dateOfBirth: foundMember.dateOfBirth || "",
          about: foundMember.about || "",
          note: foundMember.note || "",
          noteStartDate: foundMember.noteStartDate || "",
          noteEndDate: foundMember.noteEndDate || "",
          noteImportance: foundMember.noteImportance || "",
          contractStart: foundMember.contractStart || "",
          contractEnd: foundMember.contractEnd || "",
        });
      } else {
        // If member not found in membersData, check if we have any appointment with this memberId
        const appointmentWithMember = appointmentsData.find(app =>
          app.memberId === parseInt(memberId)
        );

        if (appointmentWithMember) {
          // Create a dynamic member from appointment data
          const dynamicMember = {
            id: parseInt(memberId),
            firstName: appointmentWithMember.name,
            lastName: appointmentWithMember.lastName,
            title: `${appointmentWithMember.name} ${appointmentWithMember.lastName}`,
            email: "",
            phone: "",
            street: "",
            zipCode: "",
            city: "",
            image: null,
            isActive: true,
            note: "",
            noteStartDate: "",
            noteEndDate: "",
            noteImportance: "unimportant",
            dateOfBirth: "",
            about: "",
            joinDate: new Date().toISOString().split('T')[0],
            contractStart: "",
            contractEnd: "",
            memberType: "full",
            isArchived: false,
          };

          setMember(dynamicMember);
          setEditFormMain({
            firstName: dynamicMember.firstName,
            lastName: dynamicMember.lastName,
            email: "",
            phone: "",
            street: "",
            zipCode: "",
            gender: "",
            city: "",
            dateOfBirth: "",
            about: "",
            note: "",
            noteStartDate: "",
            noteEndDate: "",
            noteImportance: "unimportant",
            contractStart: "",
            contractEnd: "",
          });
        } else {
          toast.error("Member not found");
          navigate("/dashboard/members");
        }
      }

      setIsLoading(false);
    };

    fetchMemberData();
  }, [memberId, navigate]);

  // Close note popover on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRefMain.current && !notePopoverRefMain.current.contains(event.target)) {
        setActiveNoteIdMain(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper functions
  const getRelationsCount = (memberId) => {
    const relations = memberRelationsMain[memberId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0);
  };

  const calculateAgeMain = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  };

  const isContractExpiringSoonMain = (contractEnd) => {
    if (!contractEnd) return false;
    const today = new Date();
    const endDate = new Date(contractEnd);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    return endDate <= oneMonthFromNow && endDate >= today;
  };

  const getBillingPeriodsMain = (memberId) => {
    const memberData = memberContingent[memberId];
    if (!memberData) return [];
    const periods = [{ id: "current", label: `Current (${currentBillingPeriodMain})`, data: memberData.current }];
    if (memberData.future) {
      Object.entries(memberData.future).forEach(([period, data]) => {
        periods.push({
          id: period,
          label: `Future (${period})`,
          data: data,
        });
      });
    }
    return periods;
  };

  const getMemberAppointmentsMain = (memberId) => {
    return appointmentsMain.filter((app) => app.memberId === memberId);
  };

  const handleInputChangeMain = (e) => {
    const { name, value } = e.target;
    setEditFormMain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmitMain = (e) => {
    e.preventDefault();
    const updatedMember = {
      ...member,
      ...editFormMain,
      title: `${editFormMain.firstName} ${editFormMain.lastName}`,
    };

    setMember(updatedMember);
    setIsEditModalOpenMain(false);
    toast.success("Member details have been updated successfully");
  };

  const handleArchiveMemberMain = () => {
    if (member && member.memberType === "temporary") {
      if (window.confirm("Are you sure you want to archive this temporary member?")) {
        const updatedMember = {
          ...member,
          isArchived: true,
          archivedDate: new Date().toISOString().split("T")[0],
        };
        setMember(updatedMember);
        toast.success("Temporary member archived successfully");
      }
    } else {
      toast.error("Only temporary members can be archived");
    }
  };

  const handleUnarchiveMemberMain = () => {
    if (member && member.memberType === "temporary") {
      const updatedMember = {
        ...member,
        isArchived: false,
        archivedDate: null,
      };
      setMember(updatedMember);
      toast.success("Temporary member unarchived successfully");
    } else {
      toast.error("Only temporary members can be unarchived");
    }
  };

  const handleCalendarClick = () => {
    setShowAppointmentModalMain(true);
  };

  const handleTrainingPlansClickMain = () => {
    setShowTrainingPlansModalMain(true);
  };

  const handleHistoryClick = () => {
    setShowHistoryModalMain(true);
  };

  const handleDocumentClick = () => {
    setShowDocumentModal(true);
  };

  const handleChatClick = () => {
    setChatPopup({
      isOpen: true,
      member: member
    });
  };

  const handleRelationClick = () => {
    setViewDetailsInitialTab("relations");
    setIsViewDetailsModalOpen(true);
  };

  const handleAddRelationMain = () => {
    if (!newRelationMain.name || !newRelationMain.relation) {
      toast.error("Please fill in all fields");
      return;
    }
    const relationId = Date.now();
    const updatedRelations = { ...memberRelationsMain };
    if (!updatedRelations[member.id]) {
      updatedRelations[member.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      };
    }
    updatedRelations[member.id][newRelationMain.category].push({
      id: relationId,
      name: newRelationMain.name,
      relation: newRelationMain.relation,
      type: newRelationMain.type,
    });
    setMemberRelationsMain(updatedRelations);
    setNewRelationMain({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null });
    toast.success("Relation added successfully");
  };

  const handleDeleteRelationMain = (category, relationId) => {
    const updatedRelations = { ...memberRelationsMain };
    updatedRelations[member.id][category] = updatedRelations[member.id][category].filter(
      (rel) => rel.id !== relationId,
    );
    setMemberRelationsMain(updatedRelations);
    toast.success("Relation deleted successfully");
  };

  const handleEditAppointmentMain = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: member?.title || "Member",
      specialNote: appointment.specialNote || {
        text: "",
        isImportant: false,
        startDate: "",
        endDate: "",
      },
    };
    setSelectedAppointmentDataMain(fullAppointment);
    setShowSelectedAppointmentModalMain(true);
    setShowAppointmentModalMain(false);
  };

  const handleCreateNewAppointmentMain = () => {
    setShowAddAppointmentModalMain(true);
    setShowAppointmentModalMain(false);
  };

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointmentsMain.map((a) => a.id)) + 1,
      ...data,
      memberId: member?.id,
    };
    setAppointmentsMain([...appointmentsMain, newAppointment]);
    setShowAddAppointmentModalMain(false);
  };

  const handleDeleteAppointmentMain = (id) => {
    setAppointmentsMain(appointmentsMain.filter((app) => app.id !== id));
    setSelectedAppointmentDataMain(null);
    setShowSelectedAppointmentModalMain(false);
    setIsNotifyMemberOpenMain(true);
    setNotifyActionMain("delete");
  };

  const handleBillingPeriodChange = (periodId) => {
    setSelectedBillingPeriodMain(periodId);
    const memberData = memberContingent[member.id];
    if (periodId === "current") {
      setTempContingentMain(memberData.current);
    } else {
      setTempContingentMain(memberData.future[periodId] || { used: 0, total: 0 });
    }
  };

  const handleSaveContingentMain = () => {
    if (member) {
      const updatedContingent = { ...memberContingent };
      if (selectedBillingPeriodMain === "current") {
        updatedContingent[member.id].current = { ...tempContingentMain };
      } else {
        if (!updatedContingent[member.id].future) {
          updatedContingent[member.id].future = {};
        }
        updatedContingent[member.id].future[selectedBillingPeriodMain] = { ...tempContingentMain };
      }
      setMemberContingent(updatedContingent);
      toast.success("Contingent updated successfully");
    }
    setShowContingentModalMain(false);
  };

  const handleAddBillingPeriodMain = () => {
    if (newBillingPeriodMain.trim() && member) {
      const updatedContingent = { ...memberContingent };
      if (!updatedContingent[member.id].future) {
        updatedContingent[member.id].future = {};
      }
      updatedContingent[member.id].future[newBillingPeriodMain] = { used: 0, total: 0 };
      setMemberContingent(updatedContingent);

      setAvailableBillingPeriods(prev =>
        prev.filter(period => period !== newBillingPeriodMain)
      );

      setNewBillingPeriodMain("");
      setShowAddBillingPeriodModalMain(false);
      toast.success("New billing period added successfully");
    }
  };

  const handleAssignTrainingPlanMain = (planId) => {
    const plan = availableTrainingPlansMain.find((p) => p.id === Number.parseInt(planId));
    if (plan) {
      const assignedPlan = {
        ...plan,
        assignedDate: new Date().toLocaleDateString(),
      };

      setMemberTrainingPlansMain((prev) => ({
        ...prev,
        [member.id]: [...(prev[member.id] || []), assignedPlan],
      }));

      toast.success(`Training plan "${plan.name}" assigned successfully!`);
    }
  };

  const handleRemoveTrainingPlanMain = (planId) => {
    setMemberTrainingPlansMain((prev) => ({
      ...prev,
      [member.id]: (prev[member.id] || []).filter((plan) => plan.id !== planId),
    }));

    toast.success("Training plan removed successfully!");
  };

  const handleOpenFullMessenger = () => {
    setChatPopup({ isOpen: false, member: null });
    window.location.href = `/dashboard/communication`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
        <div className="text-white text-xl">Loading member details...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
        <div className="text-white text-xl">Member not found</div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="min-h-screen bg-[#1C1C1C] text-white p-3 sm:p-4 md:p-6">

        {/* Back Button for Mobile */}
        <button
          onClick={() => navigate(-1)}
          className="lg:hidden flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {/* Member Detail Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <div className="relative">
              <img
                src={member.image || DefaultAvatar}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover"
                alt={member.title}
              />
              {isBirthday(member.dateOfBirth) && (
                <div className="absolute -top-2 -right-2 bg-yellow-900/80 text-yellow-300 p-1 rounded-full">
                  <Cake size={14} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <h1 className="text-lg sm:text-xl font-bold truncate">{member.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <StatusTag
                    status={member.isArchived ? 'archived' : member.isActive ? 'active' : 'paused'}
                    reason={member.reason}
                  />
                  {isBirthday(member.dateOfBirth) && (
                    <div className="lg:hidden flex items-center gap-1 bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      <Cake size={12} />
                      <span>Birthday!</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-gray-400 text-xs sm:text-sm space-y-0.5">
                <p>Member Type: {member.memberType === "full" ? "Full Member" : "Temporary Member"}</p>
                {member.dateOfBirth && (
                  <p>Age: {calculateAgeMain(member.dateOfBirth)} years</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditModalOpenMain(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit Member</span>
              <span className="sm:hidden">Edit</span>
            </button>

            {member.memberType === "temporary" && (
              member.isArchived ? (
                <button
                  onClick={handleUnarchiveMemberMain}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-sm"
                >
                  Unarchive
                </button>
              ) : (
                <button
                  onClick={handleArchiveMemberMain}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm"
                >
                  Archive
                </button>
              )
            )}
          </div>
        </div>

        {/* Quick Info Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[#161616] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Contract Status</h3>
            <p className={`text-sm sm:text-lg ${isContractExpiringSoonMain(member.contractEnd) ? 'text-red-500' : 'text-white'} truncate`}>
              {member.memberType === "full"
                ? `${member.contractStart} - ${member.contractEnd}`
                : "No Contract"}
            </p>
            {isContractExpiringSoonMain(member.contractEnd) && (
              <p className="text-red-400 text-xs sm:text-sm mt-1 truncate">Expiring soon!</p>
            )}  
          </div>

          <div className="bg-[#161616] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Relations</h3>
            <p className="text-white text-sm sm:text-lg">
              {getRelationsCount(member.id)} relations
            </p>
            <button
              onClick={handleRelationClick}
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm mt-1 w-full text-left truncate"
            >
              View all relations
            </button>
          </div>

          <div className="bg-[#161616] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Appointments</h3>
            <p className="text-white text-sm sm:text-lg">
              {getMemberAppointmentsMain(member.id).length} upcoming
            </p>
            <button
              onClick={handleCalendarClick}
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm mt-1 w-full text-left truncate"
            >
              View calendar
            </button>
          </div>

          <div className="bg-[#161616] p-3 sm:p-4 rounded-xl">
            <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Training Plans</h3>
            <p className="text-white text-sm sm:text-lg">
              {(memberTrainingPlansMain[member.id] || []).length} assigned
            </p>
            <button
              onClick={handleTrainingPlansClickMain}
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm mt-1 w-full text-left truncate"
            >
              Manage plans
            </button>
          </div>
        </div>

        {/* Action Buttons Grid - Responsive */}
        <div className="bg-[#161616] rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Member Actions</h2>
          <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3">
            <button
              onClick={() => setIsViewDetailsModalOpen(true)}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <Eye size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">View Details</span>
            </button>

            <button
              onClick={handleCalendarClick}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <Calendar size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">Appointments</span>
            </button>

            <button
              onClick={handleTrainingPlansClickMain}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <Dumbbell size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">Training Plans</span>
            </button>

            <button
              onClick={handleHistoryClick}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <History size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">History</span>
            </button>

            <button
              onClick={handleDocumentClick}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <FileText size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">Documents</span>
            </button>

            <button
              onClick={handleChatClick}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <MessageCircle size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">Chat</span>
            </button>

            <button
              onClick={handleRelationClick}
              className="flex flex-col items-center justify-center p-2 sm:p-3 bg-black rounded-xl hover:bg-gray-900 transition-colors min-h-[80px]"
            >
              <Users size={20} className="mb-1 sm:mb-2" />
              <span className="text-xs text-center md:block hidden">Relations</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-start sm:items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={16} />
                  <span className="text-sm">Email</span>
                </div>
                <span className="text-white text-sm sm:text-base text-right break-all">
                  {member.email || "Not provided"}
                </span>
              </div>
              
              {/* Phone */}
              <div className="flex items-start sm:items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={16} />
                  <span className="text-sm">Phone</span>
                </div>
                <span className="text-white text-sm sm:text-base">
                  {member.phone || "Not provided"}
                </span>
              </div>
              
              {/* Date of Birth */}
              <div className="flex items-start sm:items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span className="text-sm">Date of Birth</span>
                </div>
                <span className="text-white text-sm sm:text-base">
                  {member.dateOfBirth || "Not provided"}
                </span>
              </div>
              
              {/* Gender */}
              <div className="flex items-start sm:items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <User size={16} />
                  <span className="text-sm">Gender</span>
                </div>
                <span className="text-white text-sm sm:text-base">
                  {member.gender || "Not provided"}
                </span>
              </div>
              
              {/* Address */}
              <div className="flex items-start justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} />
                  <span className="text-sm">Address</span>
                </div>
                <span className="text-white text-sm sm:text-base text-right max-w-[60%] break-words">
                  {member.street ? (
                    <>
                      {member.street}<br />
                      {member.city}, {member.zipCode}
                    </>
                  ) : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="bg-[#161616] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Additional Information</h2>
            <div className="space-y-3">
              {/* About */}
              <div className="py-2 border-b border-gray-800">
                <h3 className="text-gray-400 text-sm mb-2">About</h3>
                <p className="text-white text-sm sm:text-base">
                  {member.about || "No information provided"}
                </p>
              </div>
              
              {/* Notes */}
              <div className="py-2 border-b border-gray-800">
                <h3 className="text-gray-400 text-sm mb-2">Notes</h3>
                <p className="text-white text-sm sm:text-base">
                  {member.note || "No notes"}
                </p>
                {member.note && (
                  <div className="mt-1 text-xs text-gray-500">
                    {member.noteStartDate && member.noteEndDate && 
                      `Active from ${member.noteStartDate} to ${member.noteEndDate}`
                    }
                  </div>
                )}
              </div>
              
              {/* Member Since */}
              <div className="py-2">
                <h3 className="text-gray-400 text-sm mb-2">Member Since</h3>
                <p className="text-white text-sm sm:text-base">
                  {member.joinDate || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

    
      </div>

      {/* All Modals */}
      <EditMemberModalMain
        isOpen={isEditModalOpenMain}
        onClose={() => {
          setIsEditModalOpenMain(false);
        }}
        selectedMemberMain={member}
        editModalTabMain={editModalTabMain}
        setEditModalTabMain={setEditModalTabMain}
        editFormMain={editFormMain}
        handleInputChangeMain={handleInputChangeMain}
        handleEditSubmitMain={handleEditSubmitMain}
        editingRelationsMain={editingRelationsMain}
        setEditingRelationsMain={setEditingRelationsMain}
        newRelationMain={newRelationMain}
        setNewRelationMain={setNewRelationMain}
        availableMembersLeadsMain={membersData}
        relationOptionsMain={[
          { id: "family", label: "Family" },
          { id: "friendship", label: "Friendship" },
          { id: "relationship", label: "Relationship" },
          { id: "work", label: "Work" },
          { id: "other", label: "Other" },
        ]}
        handleAddRelationMain={handleAddRelationMain}
        memberRelationsMain={memberRelationsMain}
        handleDeleteRelationMain={handleDeleteRelationMain}
        handleArchiveMemberMain={handleArchiveMemberMain}
        handleUnarchiveMemberMain={handleUnarchiveMemberMain}
      />

      <ViewDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
        }}
        selectedMemberMain={member}
        memberRelationsMain={memberRelationsMain}
        calculateAgeMain={calculateAgeMain}
        isContractExpiringSoonMain={isContractExpiringSoonMain}
        redirectToContract={() => { }}
        handleEditMember={() => setIsEditModalOpenMain(true)}
        setEditModalTabMain={setEditModalTabMain}
        DefaultAvatar1={DefaultAvatar}
        initialTab={viewDetailsInitialTab}
      />

      <AppointmentModalMain
        isOpen={showAppointmentModalMain}
        onClose={() => {
          setShowAppointmentModalMain(false);
        }}
        selectedMemberMain={member}
        getMemberAppointmentsMain={getMemberAppointmentsMain}
        appointmentTypesMain={appointmentTypesMain}
        handleEditAppointmentMain={handleEditAppointmentMain}
        handleDeleteAppointmentMain={handleDeleteAppointmentMain}
        memberContingent={memberContingent}
        currentBillingPeriodMain={currentBillingPeriodMain}
        handleManageContingentMain={() => setShowContingentModalMain(true)}
        handleCreateNewAppointmentMain={handleCreateNewAppointmentMain}
      />

      {showAddAppointmentModalMain && (
        <AddAppointmentModal
          isOpen={showAddAppointmentModalMain}
          onClose={() => setShowAddAppointmentModalMain(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
          setNotifyActionMain={setNotifyActionMain}
          freeAppointmentsMain={freeAppointmentsMain}
        />
      )}

      {showSelectedAppointmentModalMain && selectedAppointmentDataMain && (
        <EditAppointmentModalMain
          selectedAppointmentMain={selectedAppointmentDataMain}
          setSelectedAppointmentMain={setSelectedAppointmentDataMain}
          appointmentTypesMain={appointmentTypesMain}
          freeAppointmentsMain={freeAppointmentsMain}
          handleAppointmentChange={(changes) => {
            setSelectedAppointmentDataMain({ ...selectedAppointmentDataMain, ...changes });
          }}
          appointmentsMain={appointmentsMain}
          setAppointmentsMain={setAppointmentsMain}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
          setNotifyActionMain={setNotifyActionMain}
          onDelete={handleDeleteAppointmentMain}
        />
      )}

      <MemberDocumentModal
        member={member}
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
      />

      <ContingentModalMain
        showContingentModalMain={showContingentModalMain}
        setShowContingentModalMain={setShowContingentModalMain}
        selectedMemberForAppointmentsMain={member}
        getBillingPeriodsMain={getBillingPeriodsMain}
        selectedBillingPeriodMain={selectedBillingPeriodMain}
        handleBillingPeriodChange={handleBillingPeriodChange}
        setShowAddBillingPeriodModalMain={setShowAddBillingPeriodModalMain}
        currentBillingPeriodMain={currentBillingPeriodMain}
        tempContingentMain={tempContingentMain}
        setTempContingentMain={setTempContingentMain}
        handleSaveContingentMain={handleSaveContingentMain}
      />

      <AddBillingPeriodModalMain
        open={showAddBillingPeriodModalMain}
        newBillingPeriodMain={newBillingPeriodMain}
        setNewBillingPeriodMain={setNewBillingPeriodMain}
        onClose={() => setShowAddBillingPeriodModalMain(false)}
        onAdd={handleAddBillingPeriodMain}
        availableBillingPeriods={availableBillingPeriods}
      />

      <TrainingPlansModalMain
        isOpen={showTrainingPlansModalMain}
        onClose={() => {
          setShowTrainingPlansModalMain(false);
        }}
        selectedMemberMain={member}
        memberTrainingPlansMain={memberTrainingPlansMain[member.id] || []}
        availableTrainingPlansMain={availableTrainingPlansMain}
        onAssignPlanMain={handleAssignTrainingPlanMain}
        onRemovePlanMain={handleRemoveTrainingPlanMain}
      />

      <HistoryModalMain
        show={showHistoryModalMain}
        member={member}
        memberHistoryMain={memberHistoryMain}
        historyTabMain={historyTabMain}
        setHistoryTabMain={setHistoryTabMain}
        onClose={() => setShowHistoryModalMain(false)}
      />

      <NotifyMemberModalMain
        open={isNotifyMemberOpenMain}
        action={notifyActionMain}
        onClose={() => setIsNotifyMemberOpenMain(false)}
      />

      {chatPopup.isOpen && chatPopup.member && (
        <ChatPopup
          member={chatPopup.member}
          isOpen={chatPopup.isOpen}
          onClose={() => setChatPopup({ isOpen: false, member: null })}
          onOpenFullMessenger={handleOpenFullMessenger}
        />
      )}
    </>
  );
}