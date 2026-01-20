/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Art from "../../public/Art.png"
import { gsap } from "gsap"

export default function SignInPage() {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState("user")
  const tabAnimationRef = useRef(null)
  const userTabRef = useRef(null)
  const adminTabRef = useRef(null)
  const memberTabRef = useRef(null)
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

  const [memberFormData, setMemberFormData] = useState({
    email: "",
    password: "",
  })

  // Schnelle Navigation mit React Router (kein Page Reload!)
  const redirectMember = () => navigate("/member-view/studio-menu")
  const redirectUser = () => navigate("/dashboard/my-area")
  const redirectAdmin = () => navigate("/admin-dashboard/my-area")

  const handleUserSubmit = (e) => {
    e.preventDefault()
    redirectUser()
  }

  const handleAdminSubmit = (e) => {
    e.preventDefault()
    redirectAdmin()
  }

  const handleMemberSubmit = (e) => {
    e.preventDefault()
    redirectMember()
  }

  const switchTab = (type) => {
    if (type === loginType) return

    const formContainer = formContainerRef.current
    gsap.to(formContainer, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      onComplete: () => {
        setLoginType(type)

        const colorMap = {
          user: "#3F74FF",
          admin: "#FF3F3F",
          member: "#22C55E",
        }

        const leftMap = {
          user: "0%",
          admin: "33.33%",
          member: "66.66%",
        }

        gsap.to(tabAnimationRef.current, {
          left: leftMap[type],
          backgroundColor: colorMap[type],
          duration: 0.4,
          ease: "power2.inOut",
        })

        gsap.to(userTabRef.current, { color: type === "user" ? "white" : "#9CA3AF", duration: 0.3 })
        gsap.to(adminTabRef.current, { color: type === "admin" ? "white" : "#9CA3AF", duration: 0.3 })
        gsap.to(memberTabRef.current, { color: type === "member" ? "white" : "#9CA3AF", duration: 0.3 })

        gsap.fromTo(
          formContainer,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
        )
      },
    })
  }

  useEffect(() => {
    const initialLeft =
      loginType === "user" ? "0%" : loginType === "admin" ? "33.33%" : "66.66%"
    const initialColor =
      loginType === "user"
        ? "#3F74FF"
        : loginType === "admin"
        ? "#FF3F3F"
        : "#22C55E"

    gsap.set(tabAnimationRef.current, {
      left: initialLeft,
      backgroundColor: initialColor,
      width: "33.33%",
    })
  }, [])

  return (
    <div className="h-screen bg-[#0E0E0E] overflow-hidden flex justify-center items-center md:p-8 p-3">
      <div className="flex h-full w-full lg:p-10 md:p-8 p-3 flex-col lg:flex-row items-center justify-center">
        {/* ==== LEFT SIDE (FORM) ==== */}
        <div className="flex flex-1 flex-col justify-center lg:p-16 md:p-14 sm:p-8 p-5">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
              Welcome Back <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="mb-6 sm:mb-8 text-gray-400 text-sm sm:text-base text-center sm:text-left">
              Today is a new day. It's your day. You shape it. <br className="hidden sm:block" />
              Sign in to start managing your projects.
            </p>

            {/* Login Tabs */}
            <div className="relative mb-5 sm:mb-6 rounded-xl overflow-hidden bg-[#181818] flex text-xs sm:text-sm">
              <div
                ref={tabAnimationRef}
                className="absolute top-0 bottom-0 w-1/3 z-0 transition-all rounded-xl"
              ></div>

              <button
                ref={userTabRef}
                className="relative z-10 flex-1 py-2 text-white"
                onClick={() => switchTab("user")}
              >
                User
              </button>

              <button
                ref={adminTabRef}
                className="relative z-10 flex-1 py-2 text-gray-400"
                onClick={() => switchTab("admin")}
              >
                Admin
              </button>

              <button
                ref={memberTabRef}
                className="relative z-10 flex-1 py-2 text-gray-400"
                onClick={() => switchTab("member")}
              >
                Member
              </button>
            </div>

            {/* Form Container */}
            <div ref={formContainerRef} className="space-y-4 sm:space-y-5">
              {loginType === "user" && (
                <form onSubmit={handleUserSubmit} className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    placeholder="Studio name"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={userFormData.studioName}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, studioName: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={userFormData.email}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, email: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={userFormData.password}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, password: e.target.value })
                    }
                  />
                  <div className="text-right">
                    <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white">
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#3F74FF] px-4 py-2 sm:py-3 text-white hover:bg-blue-700 transition-all duration-500 ease-in-out text-sm sm:text-base"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {loginType === "admin" && (
                <form onSubmit={handleAdminSubmit} className="space-y-3 sm:space-y-4">
                  <input
                    type="email"
                    placeholder="Admin Email"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={adminFormData.email}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, email: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Admin Password"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={adminFormData.password}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, password: e.target.value })
                    }
                  />
                  <div className="text-right">
                    <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white">
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#FF3F3F] px-4 py-2 sm:py-3 text-white hover:bg-red-700 transition-all duration-500 ease-in-out text-sm sm:text-base"
                  >
                    Admin Sign In
                  </button>
                </form>
              )}

              {loginType === "member" && (
                <form onSubmit={handleMemberSubmit} className="space-y-3 sm:space-y-4">
                  <input
                    type="email"
                    placeholder="Member Email"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={memberFormData.email}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, email: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-xl bg-[#181818] px-3 py-2 sm:py-3 text-white placeholder-gray-500 outline-none text-sm"
                    value={memberFormData.password}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, password: e.target.value })
                    }
                  />
                  <div className="text-right">
                    <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white">
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-green-600 px-4 py-2 sm:py-3 text-white hover:bg-green-700 transition-all duration-500 ease-in-out text-sm sm:text-base"
                  >
                    Member Sign In
                  </button>
                </form>
              )}

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <span className="text-gray-400 text-sm">Don't have an account? </span>
                <Link to="/register" className="text-blue-500 text-sm hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ==== RIGHT SIDE (IMAGE) ==== */}
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
