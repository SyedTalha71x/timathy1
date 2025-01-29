import { useState, useEffect } from "react";
import FitnessLogo from "../../public/FitNess.png";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black bg-opacity-80" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-white">
            <img src={FitnessLogo} alt="Fitness Logo" />
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
            <a href="/#pricing" className="text-white hover:text-gray-300">
              Pricing
            </a>
            <a href="/#contact" className="text-white hover:text-gray-300">
              Contact us
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link
            to={"/login"}
              className="px-8 text-sm py-2 text-white border-2 border-blue-700 rounded-2xl transition-all duration-500 ease-in-out hover:bg-blue-500"
            >
              Login
            </Link>
            <Link 
            to={"/register"}
          
              className="px-8 text-sm py-2 bg-blue-500 border-2 border-blue-700 text-white rounded-2xl hover:bg-blue-700 transition-all duration-500 ease-in-out"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
