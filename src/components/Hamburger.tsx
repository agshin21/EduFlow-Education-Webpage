import { useRef, useState } from "react";

import Hamburger from "hamburger-react";
import { createPortal } from "react-dom";
import { routes } from "../route/routes";
import { useClickAway } from "react-use";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "../context/ThemeContext";

const HamburgerC = () => {
  const isSmallDevices = useMediaQuery({ query: '(max-width: 1023px)' });
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (!isOpen) setIsOpen(false);
  });

  if (!isSmallDevices) return null;

  const menuContent = (
    <div
      ref={ref}
      className={`fixed z-40 left-0 right-0 top-19 p-6 duration-500 transition
        ${theme === 'dark' 
          ? 'bg-[#1a1919]/30 backdrop-blur-2xl shadow-4xl' 
          : 'bg-[#f5f5f5]/60 backdrop-blur-2xl shadow-4xl'
        }`}
    >
      <ul className="grid gap-1 max-h-115 sm:max-h-150">
        {routes.slice(0, 5).map((route) => (
          <div
            key={route.title}
            className={`max-w-150 mx-auto w-full rounded-xl duration-500 transition
              ${theme === 'dark' 
                ? 'bg-[#313131]/30 backdrop-blur-2xl' 
                : 'bg-white/30 backdrop-blur-2xl'
              }`}
          >
            <a
              href={route.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full row-span-3 py-7.5 sm:py-10.5 rounded-xl"
            >
              <span className={`flex gap-1 text-2xl sm:text-3xl font-bold transition ${theme === 'dark' ? 'text-[#cccccc]' : ''}`}>
                {route.title}
              </span>
            </a>
          </div>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="hamburger-wrapper block max-h-90 relative z-50">
      <Hamburger toggled={isOpen} toggle={setIsOpen} size={25} />
      
      {isOpen && createPortal(menuContent, document.body)}
    </div>
  );
};

export default HamburgerC;   