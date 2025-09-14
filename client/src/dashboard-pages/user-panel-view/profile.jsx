/* eslint-disable no-unused-vars */
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("details");
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    vacationEntitlement: 30,
    birthday: "",
    username: "",
    password: "",
  });

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Profile data updated:", profileData);
  };

  const renderTabContent = () => {
    if (activeTab === "details") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium mb-2">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={profileData.birthday}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone No
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-2">
              Street
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={profileData.street}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={profileData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={profileData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter country"
            />
          </div>

          <div>
            <label htmlFor="vacationEntitlement" className="block text-sm font-medium mb-2">
              Vacation Entitlement (Days)
            </label>
            <input
              type="number"
              id="vacationEntitlement"
              name="vacationEntitlement"
              value={profileData.vacationEntitlement}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );
    } else if (activeTab === "access") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={profileData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl md:text-2xl font-bold oxanium_font">Profile settings</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "details" 
                  ? "text-blue-400 border-b-2 border-blue-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "access" 
                  ? "text-blue-400 border-b-2 border-blue-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Access Data
            </button>
          </div>

          <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-6 w-full max-w-2xl open_sans_font">
              {renderTabContent()}
              
              <div className="flex justify-start pt-4">
                <button
                  onClick={handleSave}
                  className="bg-[#3F74FF] hover:bg-blue-700 text-white px-8 py-2.5 text-sm rounded-xl transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;