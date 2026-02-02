/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { useSelector, useDispatch } from "react-redux"
import { memberLogin } from "../features/member/memberSlice"
import { fetchMyStudio } from '../features/studio/studioSlice'
import { fetchMyServices } from "../features/services/servicesSlice"
import { fetchMyAppointments } from "../features/appointments/AppointmentSlice"
export default function SignInPage() {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState("user")
  const { member, loading, error } = useSelector((state) => state.members)
  const tabAnimationRef = useRef(null)
  const userTabRef = useRef(null);
  const adminTabRef = useRef(null);
  const memberTabRef = useRef(null)
  const formContainerRef = useRef(null)
  const didInitRef = useRef(false);



  const dispatch = useDispatch();
  const [userFormData, setUserFormData] = useState({
    studioName: "",
    email: "",
    password: "",
  })

// Login-Typ Konfiguration
const LOGIN_TYPES = {
  studio: {
    id: "studio",
    label: "Studio",
    color: "#3F74FF",
    hoverColor: "hover:bg-blue-700",
    bgColor: "bg-[#3F74FF]",
    redirectPath: "/dashboard/my-area",
    fields: ["studioName", "email", "password"],
  },
  admin: {
    id: "admin",
    label: "Admin",
    color: "#FF3F3F",
    hoverColor: "hover:bg-red-700",
    bgColor: "bg-[#FF3F3F]",
    redirectPath: "/admin-dashboard/my-area",
    fields: ["email", "password"],
  },
  member: {
    id: "member",
    label: "Member",
    color: "#22C55E",
    hoverColor: "hover:bg-green-700",
    bgColor: "bg-green-600",
    redirectPath: "/member-view/studio-menu",
    fields: ["email", "password"],
  },
}

// Tab-Positionen für Animation
const TAB_POSITIONS = {
  studio: "0%",
  admin: "33.33%",
  member: "66.66%",
}

  // Schnelle Navigation mit React Router (kein Page Reload!)
  // const redirectMember = () => navigate("/member-view/studio-menu")
  const redirectUser = () => navigate("/dashboard/my-area")
  const redirectAdmin = () => navigate("/admin-dashboard/my-area")

  // -------------------------------------------------------------------------
  // REFS für GSAP Animationen
  // -------------------------------------------------------------------------
  const tabIndicatorRef = useRef(null)
  const tabRefs = {
    studio: useRef(null),
    admin: useRef(null),
    member: useRef(null),
  }
  const formContainerRef = useRef(null)

  // -------------------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------------------
  
  // Initiale Tab-Position setzen
  useEffect(() => {
    if (tabIndicatorRef.current) {
      gsap.set(tabIndicatorRef.current, {
        left: TAB_POSITIONS[activeLoginType],
        backgroundColor: LOGIN_TYPES[activeLoginType].color,
        width: "33.33%",
      })
    }
  }, [])

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(memberLogin(memberFormData)).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (member) {
      dispatch(fetchMyStudio());
      dispatch(fetchMyServices());
      dispatch(fetchMyAppointments());
      navigate('/member-view/studio-menu')
    }
  }, [member, navigate]);

  // Tab wechseln mit Animation
  const handleTabSwitch = (newType) => {
    if (newType === activeLoginType) return

    const formContainer = formContainerRef.current
    const config = LOGIN_TYPES[newType]

    // Fade out aktuelles Formular
    gsap.to(formContainer, {
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActiveLoginType(newType)

        // Tab-Indikator animieren
        gsap.to(tabIndicatorRef.current, {
          left: TAB_POSITIONS[newType],
          backgroundColor: config.color,
          duration: 0.35,
          ease: "power2.inOut",
        })

        // Tab-Text Farben aktualisieren
        Object.entries(tabRefs).forEach(([type, ref]) => {
          gsap.to(ref.current, {
            color: type === newType ? "white" : "#9CA3AF",
            duration: 0.25,
          })
        })

        // Fade in neues Formular
        gsap.fromTo(
          formContainer,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: "power2.out" }
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

  // -------------------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------------------
  
  const renderFormFields = () => {
    const config = LOGIN_TYPES[activeLoginType]
    const currentFormData = formData[activeLoginType]

    return (
      <>
        {/* Studio Name Feld (nur für Studio-Login) */}
        {activeLoginType === "studio" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 ml-1">
              Studio Name
            </label>
            <input
              type="text"
              placeholder="Enter your studio name"
              className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none text-sm border border-transparent focus:border-[#333333] transition-colors"
              value={currentFormData.studioName || ""}
              onChange={(e) => handleInputChange(activeLoginType, "studioName", e.target.value)}
              autoComplete="organization"
            />
          </div>
        )}

        {/* Email Feld */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder={`Enter your ${config.label.toLowerCase()} email`}
            className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none text-sm border border-transparent focus:border-[#333333] transition-colors"
            value={currentFormData.email}
            onChange={(e) => handleInputChange(activeLoginType, "email", e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* Password Feld */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none text-sm border border-transparent focus:border-[#333333] transition-colors"
            value={currentFormData.password}
            onChange={(e) => handleInputChange(activeLoginType, "password", e.target.value)}
            autoComplete="current-password"
          />
        </div>
      </>
    )
  }

  const config = LOGIN_TYPES[activeLoginType]

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        
        {/* ================================================================= */}
        {/* Login Form - Centered */}
        {/* ================================================================= */}
        <div className="flex flex-col justify-center w-full">
          
          {/* OrgaGym Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <img src={OrgaGymLogo} alt="ORGAGYM" className="w-10 h-10" />
              <span className="text-2xl font-bold text-white">ORGAGYM</span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* Login Type Tabs */}
          {/* ============================================================= */}
          <div className="relative mb-6 rounded-xl overflow-hidden bg-[#181818] flex">
            {/* Animated Tab Indicator */}
            <div
              ref={tabIndicatorRef}
              className="absolute top-0 bottom-0 w-1/3 rounded-xl transition-colors"
              style={{ backgroundColor: config.color }}
            />

            {/* Tab Buttons */}
            {Object.values(LOGIN_TYPES).map((type) => (
              <button
                key={type.id}
                ref={tabRefs[type.id]}
                onClick={() => handleTabSwitch(type.id)}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeLoginType === type.id ? "text-white" : "text-gray-400"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

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
                    disabled={loading}
                    className="w-full rounded-xl bg-green-600 px-4 py-2 sm:py-3 text-white hover:bg-green-700 transition-all duration-500 ease-in-out text-sm sm:text-base"
                  >
                    {loading ? "Member Signing..." : "Member Sign In"}
                  </button>
                  <p className="text-red-500 text-sm p-2">{error}</p>
                </form>
              )}

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full rounded-xl ${config.bgColor} ${config.hoverColor} px-4 py-3 text-white font-medium transition-all duration-300 text-sm sm:text-base`}
              >
                Sign In as {config.label}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
