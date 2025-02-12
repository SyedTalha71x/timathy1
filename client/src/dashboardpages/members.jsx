import { useEffect, useState } from "react";
import { X, Bell, Search, AlertTriangle, ChevronDown } from "lucide-react";
import Profile from "../../public/image10.png";
import toast, { Toaster } from "react-hot-toast";

export default function Members() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showExpiredContracts, setShowExpiredContracts] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    if (selectedMember) {
      setEditForm({
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        email: selectedMember.email,
        phone: selectedMember.phone,
        address: selectedMember.address,
        note: selectedMember.note,
      });
    }
  }, [selectedMember]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updatedMembers = members.map((member) => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          title: `${editForm.firstName} ${editForm.lastName}`,
          email: editForm.email,
          phone: editForm.phone,
          address: editForm.address,
          note: editForm.note,
        };
      }
      return member;
    });

    setMembers(updatedMembers);
    setIsEditModalOpen(false);
    setSelectedMember(null);
    toast.success("Member details have been updated successfully");
  };

  const [members, setMembers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      title: "John Doe",
      description: "Software Developer",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St",
      image: Profile,
      isActive: true,
      note: "Allergic to peanuts",
      contractExpiryDate: "2024-12-31",
      inactiveReason: "",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      title: "Jane Smith",
      description: "Project Manager",
      email: "jane@example.com",
      phone: "+1234567891",
      address: "456 Oak St",
      image: Profile,
      isActive: false,
      note: "",
      contractExpiryDate: "2024-06-30",
      inactiveReason: "Contract terminated",
    },
  ]);

  const filterOptions = [
    { id: "all", label: `All Members (${members.length})` },
    {
      id: "active",
      label: `Active Members (${members.filter((m) => m.isActive).length})`,
    },
    {
      id: "inactive",
      label: `Inactive Members (${members.filter((m) => !m.isActive).length})`,
    },
    {
      id: "expired",
      label: `Expired Contracts (${
        members.filter(
          (m) =>
            !m.isActive &&
            m.inactiveReason.toLowerCase() === "contract terminated"
        ).length
      })`,
    },
  ];

  // const getFilterBgColor = (filter) => {
  //   switch (filter) {
  //     case 'all':
  //       return 'bg-[#FF843E]';
  //     case 'active':
  //       return 'bg-[#152619]';
  //     case 'inactive':
  //       return 'bg-[#261515]';
  //     case 'expired':
  //       return 'bg-[#1B2236]';
  //     default:
  //       return 'bg-[#2F2F2F]';
  //   }
  // }

  const filteredAndSortedMembers = () => {
    let filtered = members.filter(
      (member) =>
        member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showExpiredContracts) {
      filtered = filtered.filter(
        (member) =>
          !member.isActive &&
          member.inactiveReason.toLowerCase() === "contract terminated"
      );
    } else if (filterStatus !== "all") {
      filtered = filtered.filter((member) =>
        filterStatus === "active" ? member.isActive : !member.isActive
      );
    }

    return filtered;
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      heading: "Heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ]);

  const handleFilterSelect = (filterId) => {
    if (filterId === "expired") {
      setShowExpiredContracts(true);
      setFilterStatus("all");
    } else {
      setShowExpiredContracts(false);
      setFilterStatus(filterId);
    }
    setIsFilterDropdownOpen(false);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  // const handleFilterClick = (status) => {
  //   setFilterStatus(status)
  //   setShowExpiredContracts(false)
  // }

  // const handleExpiredContractsClick = () => {
  //   setShowExpiredContracts(true)
  //   setFilterStatus("all")
  // }

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

      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative">
        <div className="flex-1 min-w-0 p-6 pb-36">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
  <h1 className="text-xl sm:text-2xl oxanium_font text-white">Members</h1>
  <div className="flex items-center gap-3 w-full sm:w-auto">
    <div className="relative filter-dropdown flex-1 sm:flex-none">
      <button
        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
        className={`flex w-full sm:w-auto cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
      >
        <span className="truncate">
          {
            filterOptions.find(
              (opt) =>
                (opt.id === "expired" && showExpiredContracts) ||
                (opt.id === filterStatus && !showExpiredContracts)
            )?.label
          }
        </span>
        <ChevronDown
          size={16}
          className={`transform transition-transform flex-shrink-0 ${
            isFilterDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isFilterDropdownOpen && (
        <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFilterSelect(option.id)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${
                (option.id === "expired" && showExpiredContracts) ||
                (option.id === filterStatus && !showExpiredContracts)
                  ? "bg-[#000000]"
                  : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
    <button
      onClick={() => setIsRightSidebarOpen(true)}
      className="text-gray-400 hover:text-white lg:hidden p-2"
    >
      <Bell size={24} />
    </button>
  </div>
</div>
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#101010] pl-10 pr-4 py-3 text-sm outline-none rounded-xl text-white placeholder-gray-500 border border-transparent"
                />
              </div>
            </div>
          </div>
          {isEditModalOpen && selectedMember && (
            <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
              <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                      Edit Member
                    </h2>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setSelectedMember(null);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} className="cursor-pointer" />
                    </button>
                  </div>

                  <form
                    onSubmit={handleEditSubmit}
                    className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]"
                  >
                    <div className="flex flex-col items-start">
                      <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                        <img
                          src={selectedMember.image || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm">
                        Update picture
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none  text-sm cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none  text-sm cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none  text-sm cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-200 block mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none  text-sm cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none  text-sm cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        Special Note
                      </label>
                      <textarea
                        name="note"
                        value={editForm.note}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none  text-sm cursor-pointer min-h-[100px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="bg-black rounded-xl open_sans_font p-4">
            {filteredAndSortedMembers().length > 0 ? (
              <div className="space-y-3">
                {filteredAndSortedMembers().map((member) => (
                  <div key={member.id} className="bg-[#161616] rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                        <img
                          src={member.image}
                          className="h-20 w-20 sm:h-16 sm:w-16 rounded-full flex-shrink-0"
                          alt=""
                        />
                        <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <h3 className="text-white font-medium truncate text-lg sm:text-base">
                              {member.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  member.isActive
                                    ? "bg-green-900 text-green-300"
                                    : "bg-red-900 text-red-300"
                                }`}
                              >
                                {member.isActive ? "Active" : "Inactive"}
                              </span>
                              {!member.isActive && (
                                <span className="text-gray-400 text-xs">
                                  ({member.inactiveReason})
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm truncate mt-1 text-center sm:text-left">
                            {member.description}
                          </p>
                          {member.note && (
                            <div className="flex items-center justify-center sm:justify-start gap-1 text-yellow-500 text-sm mt-1">
                              <AlertTriangle size={13} />
                              <span className="text-sm">{member.note}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-end gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-6 hover:text-white hover:border-slate-400 transition-colors text-sm w-full sm:w-auto"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {showExpiredContracts
                    ? "No expired contracts found."
                    : filterStatus === "active"
                    ? "No active members found."
                    : filterStatus === "inactive"
                    ? "No inactive members found."
                    : "No members found."}
                </p>
              </div>
            )}
          </div>
        </div>

        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsRightSidebarOpen(false)}
          />
        )}

        <aside
          className={`w-80 bg-[#181818] p-6 fixed top-0 bottom-0 right-0 z-50 lg:static lg:block ${
            isRightSidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          } transition-transform duration-500 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold oxanium_font">Notification</h2>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 open_sans_font">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-[#1C1C1C] rounded-xl p-4 relative"
              >
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
                <h3 className="open_sans_font_700 mb-2">
                  {notification.heading}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {notification.description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
