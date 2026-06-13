import HamburgerC from "./Hamburger";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { Link } from "react-router"
import ThemeToggle from "../context/ThemeToggle";
import { routes } from "../route/routes";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "../context/ThemeContext";

function NavbarC() {
const isSmallDevices = useMediaQuery({query: '(max-width: 1023px)'})
const isLargeDevices = useMediaQuery({query: '(min-width: 1024px)'})  
const {theme} = useTheme()  
return (
<>
{isSmallDevices && <header className={`${theme === 'dark' 
? 'bg-[#313131]/30 backdrop-blur-xl w-full shadow-sm fixed top-0 left-0 z-50 transition' 
: 'bg-[#e7edff]/30 backdrop-blur-xl w-full shadow-sm fixed top-0 left-0 z-50 transition'}`}>
<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-10">
        <Link to="/"  className="h-8 text-[21px] sm:text-3xl font-bold text-[#005bbf] flex items-center"><HiMiniAcademicCap />EduFlow</Link>
    </div>
    <div className="flex items-center gap-4">
        <HamburgerC />
        <ThemeToggle />
    </div>
</div>
</header>}


{isLargeDevices &&<header className={`${theme === 'dark' 
? 'bg-[#313131]/30 backdrop-blur-xl w-full shadow-sm fixed top-0 left-0 z-50 transition duration-500' 
: 'bg-[#e7edff]/30 backdrop-blur-xl  w-full shadow-sm fixed top-0 left-0 z-50 transition duration-500'}`}>
<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-10">
        <Link to="/"  className="h-8 text-3xl font-bold text-[#005bbf] flex items-center"><HiMiniAcademicCap />EduFlow</Link>
        <nav className={`${theme === 'dark' 
        ? 'flex items-center gap-8 text-[#cccccc] font-medium' 
        : 'flex items-center gap-8 text-gray-600 font-medium'}`}>
            <Link to={routes[1]?.href} className="hover:text-blue-600 transition">{routes[1]?.title}</Link>
            <Link to={routes[2]?.href} className="hover:text-blue-600 transition">{routes[2]?.title}</Link>
            <Link to={routes[0]?.href} className="hover:text-blue-600 transition">{routes[0]?.title}</Link>
        </nav>
    </div>
    <div className="flex items-center gap-4">
        <HamburgerC />
        <Link to={routes[3]?.href} className={`${theme === 'dark' 
        ? 'text-white rounded-xl bg-[#251cd5] hover:bg-[#150f7e] py-2 px-8 text-xl font-semibold transition' 
        : 'text-white rounded-xl bg-[#251cd5] hover:bg-[#150f7e] py-2 px-8 text-xl font-semibold transition'}`}>{routes[3]?.title}</Link>
        <ThemeToggle />
    </div>
</div>
</header>
}
</>
)
}

export default NavbarC