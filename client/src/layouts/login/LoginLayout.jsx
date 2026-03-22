/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { Outlet } from "react-router-dom"
import LoginHeader from "./components/LoginHeader"

/**
 * LoginLayout Component
 *
 * Minimal layout wrapper for the login / landing page.
 * Always dark background. Language switching via header.
 * No sidebar, no bottom bar — just header + centered content.
 */
const LoginLayout = ({ children }) => {
  return (
    <div className="login-layout-root h-dvh overflow-hidden" style={{ backgroundColor: "#0E0E0E" }}>
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

      <LoginHeader />

      <main
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 3.5rem)",
        }}
        className="h-full overflow-y-auto lg:pt-0"
      >
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default LoginLayout
