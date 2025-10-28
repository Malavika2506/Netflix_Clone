// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "../assets/netflix_logo.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Smooth scroll and set active tab
  const handleScroll = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const navItemClass = (tab) =>
    `relative pb-1 transition-colors duration-200 hover:text-white ${
      activeTab === tab
        ? "text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white"
        : "text-gray-300"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md z-50 shadow-md transition-all duration-300">
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={logoImage}
            alt="Netflix Logo"
            className="w-24 sm:w-28 md:w-32"
            onClick={() => {
              setActiveTab("home");
              navigate("/");
            }}
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex gap-6 font-medium text-sm md:text-base">
          <Link
            to="/"
            onClick={() => setActiveTab("home")}
            className={navItemClass("home")}
          >
            Home
          </Link>
          <button
            onClick={() => handleScroll("movies-section")}
            className={navItemClass("movies-section")}
          >
            Movies
          </button>
          <button
            onClick={() => handleScroll("trending-section")}
            className={navItemClass("trending-section")}
          >
            Trending
          </button>
          <Link
            to="/favorites"
            onClick={() => setActiveTab("favorites")}
            className={navItemClass("favorites")}
          >
            Favorites ❤️
          </Link>
        </div>

        {/* Right Section: Logout + Mobile Menu Icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded text-sm sm:text-base font-semibold transition-transform hover:scale-105"
          >
            Logout
          </button>

          {/* Hamburger Menu for Mobile */}
          <button
            className="sm:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-black/90 text-white flex flex-col items-center gap-4 py-4 border-t border-gray-700">
          <Link
            to="/"
            onClick={() => {
              setMenuOpen(false);
              setActiveTab("home");
            }}
            className={navItemClass("home")}
          >
            Home
          </Link>
          <button
            onClick={() => handleScroll("movies-section")}
            className={navItemClass("movies-section")}
          >
            Movies
          </button>
          <button
            onClick={() => handleScroll("trending-section")}
            className={navItemClass("trending-section")}
          >
            Trending
          </button>
          <Link
            to="/favorites"
            onClick={() => {
              setMenuOpen(false);
              setActiveTab("favorites");
            }}
            className={navItemClass("favorites")}
          >
            Favorites ❤️
          </Link>
        </div>
      )}
    </nav>
  );
}
