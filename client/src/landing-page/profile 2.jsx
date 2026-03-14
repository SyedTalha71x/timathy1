/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef } from "react";
import ProfileGym from '../../public/Profile.png';
import EditProfile from '../../public/Rectangle 27.png';

export default function ProfileSetup() {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen bg-[#0E0E0E] overflow-hidden flex justify-center items-center p-8">
      <div className="flex h-full w-full lg:p-10 md:p-8 sm:p-0 p-0 flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-1 flex-col justify-center lg:p-16 md:p-14 sm:p-6 p-4">
          <div className="mx-auto text-left w-full max-w-sm lg:max-w-md">
            <h1 className="mb-2 text-3xl profile_h1  font-bold text-white">
              Setup your profile 
            </h1>
            <p className="mb-8 profile_p text-gray-300">
              Today is a new day. It's your day. You shape it.
              <br />
              Complete your profile to get started.
            </p>

            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-800">
                {profileImage ? (
                  <img
                    src={profileImage || '../../public/Rectangle 27.png'}
                    alt="Profile preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl bg-[#3F74FF] transition-all ease-in-out duration-500 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Upload picture
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full rounded-lg bg-[#181818] text-sm px-4 py-3 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full rounded-lg bg-[#181818] text-sm px-4 py-3 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full rounded-lg bg-[#181818] text-sm px-4 py-3 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="w-full rounded-lg bg-[#181818] text-sm px-4 py-3 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#3F74FF] text-sm cursor-pointer px-4 py-3 text-white hover:bg-blue-700 transition-all duration-500 ease-in-out"
              >
                Save Profile
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:block flex-1 p-10">
          <div className="relative h-full w-full">
            <img
              src={ProfileGym}
              alt="Person exercising with weights"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
