/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { useSelector, useDispatch } from "react-redux"
import { memberLogin } from "../features/member/memberSlice"
import { fetchMyStudio } from "../features/studio/studioSlice"
import { fetchMyServices } from "../features/services/servicesSlice"
import { fetchMyAppointments } from "../features/appointments/AppointmentSlice"
// import OrgaGymLogo from "../assets/logo.png"

export default function SignInPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { member, loading, error } = useSelector((state) => state.members)

  /* ---------------- REQUIRED STATE (missing before) ---------------- */
  const [activeLoginType, setActiveLoginType] = useState("member")

  const [memberFormData, setMemberFormData] = useState({
    email: "",
    password: "",
  })
  /* ---------------------------------------------------------------- */

  const formContainerRef = useRef(null)
  const tabIndicatorRef = useRef(null)

  const tabRefs = {
    studio: useRef(null),
    admin: useRef(null),
    member: useRef(null),
  }

  const LOGIN_TYPES = {
    studio: {
      id: "studio",
      label: "Studio",
      color: "#3F74FF",
    },
    admin: {
      id: "admin",
      label: "Admin",
      color: "#FF3F3F",
    },
    member: {
      id: "member",
      label: "Member",
      color: "#22C55E",
    },
  }

  const TAB_POSITIONS = {
    studio: "0%",
    admin: "33.33%",
    member: "66.66%",
  }

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(memberLogin(memberFormData)).unwrap()
    } catch (err) {
      console.log(err)
    }
  }

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (!tabIndicatorRef.current) return

    gsap.set(tabIndicatorRef.current, {
      left: TAB_POSITIONS[activeLoginType],
      backgroundColor: LOGIN_TYPES[activeLoginType].color,
      width: "33.33%",
    })
  }, [])

  useEffect(() => {
    if (member) {
      dispatch(fetchMyStudio())
      dispatch(fetchMyServices())
      dispatch(fetchMyAppointments())
      navigate("/member-view/studio-menu")
    }
  }, [member])

  /* ---------------- HANDLERS ---------------- */
  const handleTabSwitch = (newType) => {
    if (newType === activeLoginType) return

    gsap.to(tabIndicatorRef.current, {
      left: TAB_POSITIONS[newType],
      backgroundColor: LOGIN_TYPES[newType].color,
      duration: 0.3,
    })

    setActiveLoginType(newType)
  }



  const config = LOGIN_TYPES[activeLoginType]

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <div className="flex flex-col justify-center w-full" ref={formContainerRef}>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">ORGAGYM</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative mb-6 rounded-xl overflow-hidden bg-[#181818] flex">
            <div
              ref={tabIndicatorRef}
              className="absolute top-0 bottom-0 w-1/3 rounded-xl transition-colors"
              style={{ backgroundColor: config.color }}
            />

            {Object.values(LOGIN_TYPES).map((type) => (
              <button
                key={type.id}
                ref={tabRefs[type.id]}
                onClick={() => handleTabSwitch(type.id)}
                type="button"
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${activeLoginType === type.id ? "text-white" : "text-gray-400"
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* MEMBER LOGIN */}
          {activeLoginType === "member" && (
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Member Email"
                className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white outline-none text-sm"
                value={memberFormData.email}
                onChange={(e) =>
                  setMemberFormData({ ...memberFormData, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-xl bg-[#181818] px-4 py-3 text-white outline-none text-sm"
                value={memberFormData.password}
                onChange={(e) =>
                  setMemberFormData({ ...memberFormData, password: e.target.value })
                }
              />

              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700"
              >
                {loading ? "Signing in..." : "Sign In as Member"}
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
