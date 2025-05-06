/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useRef, useEffect } from "react";
import Art from "../../public/Art1.png";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

export default function Register() {
  const [registerType, setRegisterType] = useState("user");
  const tabAnimationRef = useRef(null);
  const userTabRef = useRef(null);
  const adminTabRef = useRef(null);
  const formContainerRef = useRef(null);

  const [userFormData, setUserFormData] = useState({
    studioName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });

  const handleUserSubmit = (e) => {
    e.preventDefault();
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
  };

  const redirectUser = () => {
    window.location.href = "/login";
  };

  const redirectAdmin = () => {
    window.location.href = "/login";
  };

  const switchTab = (type) => {
    if (type === registerType) return;

    const formContainer = formContainerRef.current;
    
    gsap.to(formContainer, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      onComplete: () => {
        setRegisterType(type);
        
        if (type === "user") {
          gsap.to(tabAnimationRef.current, {
            left: 0,
            backgroundColor: "#3F74FF",
            duration: 0.4,
            ease: "power2.inOut"
          });
          gsap.to(userTabRef.current, { color: "white", duration: 0.3 });
          gsap.to(adminTabRef.current, { color: "#9CA3AF", duration: 0.3 });
        } else {
          gsap.to(tabAnimationRef.current, {
            left: "50%",
            backgroundColor: "#FF3F3F",
            duration: 0.4,
            ease: "power2.inOut"
          });
          gsap.to(adminTabRef.current, { color: "white", duration: 0.3 });
          gsap.to(userTabRef.current, { color: "#9CA3AF", duration: 0.3 });
        }
        
        gsap.fromTo(
          formContainer,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
        );
      }
    });
  };

  useEffect(() => {
    const initialLeft = registerType === "user" ? 0 : "50%";
    const initialColor = registerType === "user" ? "#3F74FF" : "#FF3F3F";
    
    gsap.set(tabAnimationRef.current, {
      left: initialLeft,
      backgroundColor: initialColor
    });

    gsap.fromTo(
      formContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="h-screen bg-[#0E0E0E] overflow-hidden flex justify-center items-center p-8">
      <div className="flex h-full w-full lg:p-10 md:p-8 sm:p-0 p-0 flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-1 flex-col justify-center lg:p-16 md:p-14 sm:p-6 p-4">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <h1 className="mb-2 text-3xl font-bold register_h1 text-white">
              Create Account <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="mb-8 register_p text-gray-400">
              Today is a new day. It's your day. You shape it.
              <br />
              Sign up to start managing your projects.
            </p>

            <div className="relative mb-6 rounded-xl overflow-hidden bg-[#181818]">
              <div 
                ref={tabAnimationRef}
                className="absolute top-0 bottom-0 w-1/2 z-0 transition-all rounded-xl"
              ></div>
              
              <button
                ref={userTabRef}
                className="relative z-10 flex-1 w-1/2 py-2 text-white"
                onClick={() => switchTab("user")}
              >
                User Register
              </button>
              <button
                ref={adminTabRef}
                className="relative z-10 flex-1 w-1/2 py-2 text-gray-400"
                onClick={() => switchTab("admin")}
              >
                Admin Register
              </button>
            </div>

            <div ref={formContainerRef}>
              {registerType === "user" && (
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Studio name"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={userFormData.studioName}
                      onChange={(e) => setUserFormData({ ...userFormData, studioName: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={userFormData.confirmPassword}
                      onChange={(e) => setUserFormData({ ...userFormData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={redirectUser}
                    type="submit"
                    className="w-full register_btn rounded-xl cursor-pointer bg-[#3F74FF] px-4 py-3 text-white hover:bg-blue-700 transition-all duration-500 ease-in-out"
                  >
                    Sign Up
                  </button>
                  
                  <div className="mt-6 text-center">
                    <div className="text-white">
                      Already have an account?
                      <Link
                        to={"/login"}
                        className="text-blue-500 ml-1 hover:underline"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                </form>
              )}

              {registerType === "admin" && (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Admin Email"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={adminFormData.email}
                      onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Admin Password"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={adminFormData.confirmPassword}
                      onChange={(e) => setAdminFormData({ ...adminFormData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Admin Authorization Code"
                      className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                      value={adminFormData.adminCode}
                      onChange={(e) => setAdminFormData({ ...adminFormData, adminCode: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={redirectAdmin}
                    type="submit"
                    className="w-full register_btn rounded-xl cursor-pointer bg-[#FF3F3F] px-4 py-3 text-white hover:bg-red-700 transition-all duration-500 ease-in-out"
                  >
                    Admin Sign Up
                  </button>
                  
                  <div className="mt-6 text-center">
                    <div className="text-white">
                      Already have an account?
                      <Link
                        to={"/login"}
                        className="text-blue-500 ml-1 hover:underline"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 p-10">
          <div className="relative h-full w-full">
            <img
              src={Art}
              alt="Fitness enthusiasts working out"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}