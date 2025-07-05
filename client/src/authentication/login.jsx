/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react"
import Art from "../../public/Art.png"
import { gsap } from "gsap"

export default function SignInPage() {
  const [loginType, setLoginType] = useState("user") // "user" or "admin"
  const tabAnimationRef = useRef(null)
  const userTabRef = useRef(null)
  const adminTabRef = useRef(null)
  const formContainerRef = useRef(null)

  const [userFormData, setUserFormData] = useState({
    studioName: "",
    email: "",
    password: "",
  })

  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
  })

  const handleUserSubmit = (e) => {
    e.preventDefault()
    // Handle user login logic
  }

  const handleAdminSubmit = (e) => {
    e.preventDefault()
    // Handle admin login logic
  }

  const redirectUser = () => {
    window.location.href = "/dashboard/my-area"
  }

  const redirectAdmin = () => {
    window.location.href = "/customer-dashboard/my-area"
  }

  const switchTab = (type) => {
    if (type === loginType) return;

    const formContainer = formContainerRef.current;
        gsap.to(formContainer, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      onComplete: () => {
        setLoginType(type);
        
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
        
        // Fade in new form
        gsap.fromTo(
          formContainer,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
        );
      }
    });
  };

  // Initialize the animation indicator on mount
  useEffect(() => {
    const userTab = userTabRef.current;
    const initialLeft = loginType === "user" ? 0 : "50%";
    const initialColor = loginType === "user" ? "#3F74FF" : "#FF3F3F";
    
    gsap.set(tabAnimationRef.current, {
      left: initialLeft,
      backgroundColor: initialColor
    });

    gsap.fromTo(
      formContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="h-screen bg-[#0E0E0E] overflow-hidden flex justify-center items-center p-8">
      <div className="flex h-full w-full lg:p-10 md:p-8 sm:p-0 p-0 flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-1 flex-col justify-center lg:p-16 md:p-14 sm:p-6 p-4">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <h1 className="mb-2 text-3xl login_h1 font-bold text-white">
              Welcome Back <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="mb-8 login_p login_btn text-gray-400">
              Today is a new day. It's your day. You shape it.
              <br />
              Sign in to start managing your projects.
            </p>

            {/* Login Type Toggle with Animation */}
            <div className="relative mb-6 rounded-xl overflow-hidden bg-[#181818]">
              {/* Animated tab indicator */}
              <div 
                ref={tabAnimationRef}
                className="absolute top-0 bottom-0 w-1/2 z-0 transition-all rounded-xl"
              ></div>
              
              {/* Tab buttons */}
              <button
                ref={userTabRef}
                className="relative z-10 text-sm flex-1 w-1/2 py-2 text-white"
                onClick={() => switchTab("user")}
              >
                User/Customer Login
              </button>
              <button
                ref={adminTabRef}
                className="relative z-10 text-sm flex-1 w-1/2 py-2 text-gray-400"
                onClick={() => switchTab("admin")}
              >
                Admin Login
              </button>
            </div>

            {/* Form Container with Animation */}
            <div ref={formContainerRef}>
              {/* User Login Form */}
              {loginType === "user" && (
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
                  <div className="text-right">
                    <a href="#" className="text-sm text-gray-400 hover:text-white">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    onClick={redirectUser}
                    type="submit"
                    className="w-full rounded-xl login_btn cursor-pointer bg-[#3F74FF] px-4 py-3 text-white hover:bg-blue-700 transition-all duration-500 ease-in-out"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {/* Admin Login Form */}
              {loginType === "admin" && (
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
                  <div className="text-right">
                    <a href="#" className="text-sm text-gray-400 hover:text-white">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    onClick={redirectAdmin}
                    type="submit"
                    className="w-full rounded-xl login_btn cursor-pointer bg-[#FF3F3F] px-4 py-3 text-white hover:bg-red-700 transition-all duration-500 ease-in-out"
                  >
                    Admin Sign In
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 p-10">
          <div className="relative h-full w-full">
            <img
              src={Art || "/placeholder.svg"}
              alt="Fitness enthusiasts working out"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}