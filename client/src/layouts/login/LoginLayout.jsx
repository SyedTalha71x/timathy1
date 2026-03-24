/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { Outlet } from "react-router-dom"
import LoginHeader from "./components/LoginHeader"

/**
 * LoginLayout Component
 *
 * Minimal layout wrapper for the login / landing page.
 * Uses min-h-dvh + flex-col (like Home pattern) instead of
 * h-dvh overflow-hidden to avoid iOS bottom bar issues.
 */
const LoginLayout = ({ children }) => {
  return (
    <div className="login-layout-root min-h-dvh flex flex-col" style={{ backgroundColor: "#0E0E0E" }}>
      <style>{`
        .login-layout-root {
          -webkit-user-select: none;
          user-select: none;
        }
        .login-layout-root input {
          -webkit-user-select: text;
          user-select: text;
        }
        .login-layout-root img,
        .login-layout-root svg {
          -webkit-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }
      `}</style>

      {/* Header — Language only */}
      <LoginHeader />

      {/* Main Content — flex-1 fills remaining space for vertical centering */}
      <main
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 3.5rem)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        className="flex-1 flex flex-col lg:pt-0"
      >
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default LoginLayout
