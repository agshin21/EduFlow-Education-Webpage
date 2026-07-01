import { Link, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

import HamburgerC from "./Hamburger";
import { HiMiniAcademicCap } from "react-icons/hi2";
import ThemeToggle from "../context/ThemeToggle";
import { logoutUser } from "../services/authService";
import { routes } from "../route/routes";
import { useClickAway } from "react-use";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "../context/ThemeContext";

function NavbarC() {
  const isSmallDevices = useMediaQuery({ query: "(max-width: 1023px)" });
  const isLargeDevices = useMediaQuery({ query: "(min-width: 1024px)" });
  const { theme } = useTheme();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useClickAway(menuRef, () => setMenuOpen(false));

  useEffect(() => {
    setMenuOpen(false);
  }, [user?.id]);

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    navigate("/login");
  };

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const profileBtn = user ? (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="flex items-center gap-2 rounded-full ring-2 ring-transparent transition hover:ring-blue-500/60"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.firstName || "Profile"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#251cd5] to-[#005bbf] text-sm font-bold text-white">
            {initials}
          </span>
        )}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className={`absolute -translate-x-20 mt-3 w-56 overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl transition ${
            theme === "dark"
              ? "bg-gray-900/80 text-white ring-1 ring-gray-700"
              : "bg-white/90 text-gray-900 ring-1 ring-gray-200"
          }`}
        >
          <div
            className={`border-b px-4 py-3 text-sm ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p
              className={`truncate text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {user.email}
            </p>
          </div>
          <Link
            to={routes[8]?.href || "/settings"}
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-2.5 text-sm font-medium transition ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {routes[8]?.title || "Settings"}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-2.5 text-sm font-medium transition ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition ${
              theme === "dark"
                ? "text-red-300 hover:bg-gray-800"
                : "text-red-600 hover:bg-gray-100"
            }`}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link
      to={routes[3]?.href}
      className={`text-white hidden sm:block rounded-xl bg-[#251cd5] hover:bg-[#150f7e] py-2 px-8 text-xl font-semibold transition`}
    >
      {routes[3]?.title}
    </Link>
  );

  return (
    <>
      {isSmallDevices && (
        <header
          className={`${
            theme === "dark"
              ? "bg-[#313131]/30 backdrop-blur-xl w-full shadow-sm fixed top-0 left-0 z-50 transition"
              : "bg-[#e7edff]/30 backdrop-blur-xl w-full shadow-sm fixed top-0 left-0 z-50 transition"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                to="/"
                className="h-8 text-[21px] sm:text-3xl font-bold text-[#005bbf] flex items-center"
              >
                <HiMiniAcademicCap />
                EduFlow
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {profileBtn}
              <HamburgerC />
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {isLargeDevices && (
        <header
          className={`${
            theme === "dark"
              ? "bg-[#313131]/30 backdrop-blur-xl w-full shadow-sm fixed top-0 left-0 z-50 transition duration-500"
              : "bg-[#e7edff]/30 backdrop-blur-xl  w-full shadow-sm fixed top-0 left-0 z-50 transition duration-500"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                to="/"
                className="h-8 text-3xl font-bold text-[#005bbf] flex items-center"
              >
                <HiMiniAcademicCap />
                EduFlow
              </Link>
              <nav
                className={`${
                  theme === "dark"
                    ? "flex items-center gap-8 text-[#cccccc] font-medium"
                    : "flex items-center gap-8 text-gray-600 font-medium"
                }`}
              >
                <Link
                  to={routes[0]?.href}
                  className="hover:text-blue-600 transition"
                >
                  {routes[0]?.title}
                </Link>
                <Link
                  to={routes[1]?.href}
                  className="hover:text-blue-600 transition"
                >
                  {routes[1]?.title}
                </Link>
                <Link
                  to={routes[2]?.href}
                  className="hover:text-blue-600 transition"
                >
                  {routes[2]?.title}
                </Link>
                <Link
                  to={routes[4]?.href}
                  className="hover:text-blue-600 transition"
                >
                  {routes[4]?.title}
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <HamburgerC />
              {profileBtn}
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
    </>
  );
}

export default NavbarC;