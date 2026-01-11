/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import FitnessLogo from "../../public/FitNess.png";

import { Link } from "react-router-dom";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".sidebar")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black bg-opacity-80" : "bg-transparent"
      }`}
    >
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } fixed inset-0 bg-black/40  z-40 transition-opacity`}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold logo text-white">
            <h1 className="text-white text-3xl navbar_h1">FitNess</h1>
          </a>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8 nav_links">
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
            <a href="#pricing" className="text-white hover:text-gray-300">
              Pricing
            </a>
            <a href="#contact" className="text-white hover:text-gray-300">
              Contact us
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4 button_links">
            <Link
              to={"/login"}
              className="px-8 text-sm py-2 text-white border-2 border-blue-500  rounded-xl  transition-all duration-500 ease-in-out hover:bg-[#3F74FF]"
            >
              Login
            </Link>
            <Link
              to={"/register"}
              className="px-10 text-sm py-2 bg-[#3F74FF] border-2 border-blue-500  text-white rounded-xl  hover:bg-blue-700 transition-all duration-500 ease-in-out"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-64 h-full bg-[#141414] bg-opacity-90 transition-transform duration-500 ease-in-out z-40`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute  bottom-3 left-26 text-white cursor-pointer text-4xl focus:outline-none"
        >
          &times;
        </button>

        <div className="flex flex-col items-center space-y-8 mt-20 nav_links">
          <a href="/" className="text-white hover:text-gray-300">
            Home
          </a>
          <a href="#pricing" className="text-white hover:text-gray-300">
            Pricing
          </a>
          <a href="#contact" className="text-white hover:text-gray-300">
            Contact us
          </a>

          <div className="flex flex-col items-center space-y-4 mt-10 button_links">
            <Link
              to={"/login"}
              className="px-8 text-sm py-2 text-white border-2 border-blue-500  rounded-xl  transition-all duration-500 ease-in-out hover:bg-[#3F74FF]"
            >
              Login
            </Link>
            <Link
              to={"/register"}
              className="px-10 text-sm py-2 bg-[#3F74FF]  text-white rounded-xl  hover:bg-blue-700 transition-all duration-500 ease-in-out"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
