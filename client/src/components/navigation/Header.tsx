import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { FaTelegramPlane, FaVolumeDown } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import ConnectButton from "../wallet/ConnectButton";

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { label: "Staking", path: "/staking" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Holder Rewards", path: "/holder-rewards" },
    { label: "Platform ", path: "/platform" },
    { label: "Temple Of Moon", path: "/moon" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled ? "backdrop-blur-xl bg-black/20" : ""
          }`}
      >
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Logo & Search */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Link to="/" className="flex-shrink-0">
                  <img
                    className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-full"
                    alt="Profile"
                    src="/logo.png"
                  />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:block">
                  <div className="relative">
                    <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      placeholder="Search"
                      className="w-40 lg:w-48 h-9 pl-10 pr-4 rounded-full border border-gray-300 bg-transparent text-sm text-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://t.me/buffdogecoin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white w-[30px] h-[30px] flex items-center justify-center hover:text-blue-400 transition-colors border border-white/30 rounded-full "
                  >
                    <FaTelegramPlane size={16} />
                  </a>
                  <a
                    href="https://x.com/buffdogefun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white w-[30px] h-[30px] flex items-center justify-center hover:text-blue-400 transition-colors border border-white/30 rounded-full "
                  >
                    <FaXTwitter size={16} />
                  </a>
                  <a
                    href="https://buffdoge.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xs px-3 py-1.5 hover:text-yellow-400 transition-colors border border-white/30 rounded-full font-semibold"
                  >
                    Website
                  </a>
                </div>
              </div>
            </div>

            {/* Center Section - Navigation Links - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <Link
                  to={item.path}
                  key={index}
                  className={`relative font-medium text-sm lg:text-base transition-colors hover:text-white ${location.pathname === item.path
                    ? "text-purple-400"
                    : "text-gray-300"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section - Buttons & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Action Buttons - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-3">
                <button onClick={() => navigate("/start")} className="cursor-pointer px-4 lg:px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-full text-black text-xs lg:text-sm font-semibold transition-colors">
                  Start A Cult
                </button>
                <ConnectButton variant="desktop" />
              </div>

              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-white hover:text-blue-400 transition-colors"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>

              <button className="w-[35px] h-[35px] flex items-center justify-center text-white border border-white/30 rounded-full ">
                <FaVolumeDown size={16} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 lg:hidden z-50">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center p-6">
            <div
              className="w-full max-w-xs backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-white text-sm font-semibold">Menu</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  >
                    <HiX size={18} />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="p-4 border-b border-white/10">
                  <div className="relative">
                    <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      placeholder="Search"
                      className="w-full h-9 pl-10 pr-3 rounded-full border border-white/20 bg-transparent text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="p-4">
                  <div className="space-y-1">
                    {navigationItems.map((item, index) => (
                      <Link
                        to={item.path}
                        key={index}
                        onClick={toggleMobileMenu}
                        className={`flex items-center py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${location.pathname === item.path
                          ? "text-purple-400 bg-purple-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile Action Buttons */}
                <div className="p-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={toggleMobileMenu}
                    className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 rounded-full text-black font-semibold text-sm transition-all"
                  >
                    Start A Cult
                  </button>
                  <ConnectButton variant="mobile" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};
