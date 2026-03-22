/* eslint-disable no-unused-vars */
import LanguageDropdown from "../../LanguageDropdown"

/**
 * LoginHeader Component
 *
 * Minimal header for the login / landing page.
 * Always dark. Only language switching.
 */
const LoginHeader = () => {
  return (
    <>
      {/* ===== MOBILE HEADER (lg:hidden) ===== */}
      <div
        className="fixed top-0 left-0 w-full bg-[#0E0E0E] pb-1.5 px-3 flex items-center justify-end lg:hidden z-40 select-none"
        style={{ touchAction: "manipulation", paddingTop: "calc(env(safe-area-inset-top, 0px) + 6px)" }}
      >
        <LanguageDropdown isMobile={true} />
      </div>

      {/* ===== DESKTOP HEADER (hidden lg:flex) ===== */}
      <div className="lg:flex hidden justify-end bg-[#0E0E0E] z-20 py-1 px-2 mb-2 items-center select-none sticky top-0">
        <LanguageDropdown isMobile={false} />
      </div>
    </>
  )
}

export default LoginHeader
