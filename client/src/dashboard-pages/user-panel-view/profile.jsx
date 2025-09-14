/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'

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
    birthday: "",
    username: "",
    password: "",
    profilePicture: null, // store uploaded file

    
  });

  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, profilePicture: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // button click -> open file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };


  const handleSave = () => {
    console.log("Profile data updated:", profileData);
    if (profileData.profilePicture) {
      console.log("Profile Picture File:", profileData.profilePicture);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "details") {
      return (
        <div className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img
                src={previewUrl || DefaultAvatar}
                alt="Profile Preview"
                className="w-24 h-24 rounded-xl object-cover "
              />
            </div>
            <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
            <button
            onClick={handleUploadClick}
            className="bg-blue-600 text-sm py-2 px-8 rounded-xl cursor-pointer">
              Upload Picture
            </button>
          </div>

          {/* Fist + Last Name */}
          <div className="grid grid-cols-1 mt-7 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Birthday */}
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
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email + Phone */}
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Street */}
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
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter street address"
            />
          </div>

          {/* ZIP + City */}
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
              />
            </div>
          </div>

          {/* Country */}
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
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter country"
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
              className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border-none outline-none text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white transition"
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
            <h1 className="text-xl md:text-2xl font-bold">Profile settings</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "details"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "access"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Access Data
            </button>
          </div>

          <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-6 w-full max-w-2xl">
              {renderTabContent()}

              <div className="flex justify-start pt-4">
                <button
                  onClick={handleSave}
                  className="bg-[#3F74FF] hover:bg-blue-700 text-white px-8 py-2.5 text-sm rounded-xl transition"
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
