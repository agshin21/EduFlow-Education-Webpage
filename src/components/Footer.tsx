import { HiMiniAcademicCap } from "react-icons/hi2";
import { Link } from "react-router";
import { routes } from "../route/routes";
import { useTheme } from "../context/ThemeContext";

function Footer() {
  const {theme} = useTheme()
  return (
    <>
      <footer className={`${theme === 'dark' 
      ? 'bg-[#222121] py-12 lg:py-9 transition duration-500 shadow-lg' 
      : 'bg-[#e7edff] py-12 lg:py-9 transition duration-500 border-black/20 border-t'}`}>
        <div className="grid lg:grid-cols-2 items-center gap-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-[21px] sm:text-3xl font-bold text-[#005bbf] flex items-center lg:items-start">
              <HiMiniAcademicCap />
              EduFlow
            </h1>
            <p className={`${theme === 'dark' 
            ? 'text-[#cccccc] text-[16px] md:text-base font-semibold transition' 
            : 'text-[16px] md:text-base font-semibold transition'}`}>
              Connecting ambitious learners with the world's best mentors since
              2024.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-4 font-semibold justify-start lg:justify-end">
            {routes.slice(0, 5).map((route, idx) => {
              return (
                <Link
                  key={idx}
                  className={`${theme === 'dark' 
                  ? 'text-[#cccccc] text-base md:text-md lg:text-lg transition' 
                  : 'text-gray-700 text-base md:text-md lg:text-lg transition'}`}
                  to={route.href}
                >
                  {route.title}
                </Link>
              );
            })}
          </div>
          <hr className="col-start-1 col-span-2 row-start-3 hidden lg:block mt-8 mb-18 text-[#a0a0a0]"/>
          <div className="col-start-1 row-start-4 lg:row-start-3">
            <p className={`${theme === 'dark' 
            ? 'flex font-semibold text-[#cccccc] transition' 
            : 'flex font-semibold transition'}`}>
              © 2024 EduFlow Global Education. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
