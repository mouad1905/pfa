import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isScrolledOrNotHome = scrolled || !isHome;

  const navLinkStyles = `font-semibold text-lg transition-colors duration-300 hover:text-emerald-500 ${
    isScrolledOrNotHome ? "text-slate-800" : "text-white"
  }`;

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-500">
      {/* TOP MINI NAV — desktop only */}
      <div className="bg-[#0b1716] border-b border-emerald-900/30 py-2 px-4 md:px-12 hidden lg:flex justify-between items-center text-[11px] font-medium text-slate-300">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1">
            Welcome to{" "}
            <span className="text-emerald-400 font-bold">Uniconnect</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>Connect, Study, Live Better.</span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors uppercase tracking-wider text-[10px] font-bold"
          >
            <FaUser className="text-emerald-500" /> Login
          </Link>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav
        className={`transition-all duration-500 px-4  md:px-12 py-3 flex justify-between items-center ${
          isScrolledOrNotHome || menuOpen
            ? "bg-white/95 backdrop-blur-xl border-b border-emerald-900/10 shadow-xl"
            : "bg-transparent"
        }`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className={`text-3xl font-black tracking-tight transition-colors duration-500 ${
              isScrolledOrNotHome ? "text-slate-900" : "text-white"
            }`}
          >
            Uni<span className="text-[#10b981]">Connect</span>
          </span>
        </Link>

        {/* NAV LINKS — desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className={navLinkStyles}>
            Home
          </Link>
          <Link to="/colocations" className={navLinkStyles}>
            Colocations
          </Link>
          <Link to="/revisions" className={navLinkStyles}>
            Revisions
          </Link>
          <Link to="/support" className={navLinkStyles}>
            Support
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Get Started — always visible */}
          <Link to="/login">
            <button className="bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2 rounded-full font-bold text-sm tracking-tight cursor-pointer transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-emerald-500/20">
              Get Started
              <div className="bg-white/20 p-1.5 rounded-full  group-hover:translate-x-1 transition-transform">
                <FaArrowRight className="text-[10px]" />
              </div>
            </button>
          </Link>

          {/* Hamburger — tablet & mobile */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolledOrNotHome || menuOpen
                ? "text-slate-800 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE / TABLET DROPDOWN MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 backdrop-blur-xl border-b border-emerald-900/10 shadow-xl`}
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/colocations", label: "Colocations" },
            { to: "/revisions", label: "Revisions" },
            { to: "/support", label: "Support" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`py-3 px-3 rounded-xl font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-between group ${
                location.pathname === to ? "text-emerald-600 bg-emerald-50" : ""
              }`}
            >
              {label}
              <FaArrowRight className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}

          {/* Divider + Login for mobile */}
          <div className="border-t border-slate-100 mt-2 pt-3">
            <Link
              to="/login"
              className="py-3 px-3 rounded-xl font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2"
            >
              <FaUser className="text-emerald-500 text-sm" />
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
