import "swiper/css";
import "swiper/css/navigation";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineColorLens, MdWorkOutline } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

import Accordion from "../components/Accordion";
import { Avatar } from "@mui/material";
import Avatargroup from "../components/Avatargroup";
import CircularIndeterminate from "../components/Progressbar";
import type { Course } from "../@types/types";
import Footer from "../components/Footer";
import { GoArrowRight } from "react-icons/go";
import { IoCode } from "react-icons/io5";
import { Link } from "react-router";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { Navigation } from "swiper/modules";
import { TbWorld } from "react-icons/tb";
import axios from "axios";
import { faqList } from "../App";
import { routes } from "../route/routes";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const [loading, setLoading] = useState(true)
  const {theme} = useTheme()
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    axios
      .get("https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers")
      .then((res: any) => setCourses(res.data))
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false))
  }, []);
 if(loading)return <div className={`flex ${theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc] '} items-center justify-center h-screen`}><CircularIndeterminate /></div>
  return (
    <div className={`${theme === 'dark' 
    ? "bg-[#2f2c2c] transition duration-500" 
    : "bg-white transition duration-500"}`}>
      
      {/* Hero */}
      <section className={`${theme === 'dark' 
      ? "pt-32 pb-20 bg-[#2e2a2a] text-[#cccccc] transition duration-500" 
      : "pt-32 pb-20 bg-gray-50 transition duration-500"}`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#3c8d68] bg-[#68fadd] px-4 py-1 rounded-full text-sm font-medium">
              Master New Skills Faster
            </span>
            <h1 className={`${theme === 'dark' 
            ? "text-4xl md:text-5xl font-bold text-[#cccccc] leading-tight transition text-reveal" 
            : "text-4xl md:text-5xl font-bold text-gray-900 leading-tight transition text-reveal"}`}>
              Elevate Your Career
              <br /> with EduFlow
              <br /> Experts
            </h1>
            <p className={`${theme === 'dark' 
            ? "text-gray-300 text-sm sm:text-lg transition" 
            : "text-gray-600 text-sm sm:text-lg transition"}`}>
              Access world-class curriculum designed by industry
              <br /> leaders. Learn at your own pace with interactive
              <br /> modules and personalized mentorship.
            </p>
            <div className="flex gap-4">
              <Link
                to={routes[1]?.href}
                className="flex items-center gap-3 bg-[#005bbf] text-white px-2 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-[#004084] transition shadow-lg cursor-pointer text-sm sm:text-lg"
              >
                Explore All {routes[1]?.title} <GoArrowRight />
              </Link>
              <Link
                to={routes[2]?.href}
                className="border border-gray-300 px-3 py-3 sm:px-6 sm:py-3 rounded-xl hover:bg-gray-100 transition font-semibold text-[#005bbf] cursor-pointer text-sm sm:text-lg"
              >
                Go to {routes[2]?.title}
              </Link>
            </div>
            <Avatargroup />
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl md:text-4xl font-bold">
              Most Selling Course of
              <br /> This Week
            </h2>
            <div className="relative border-gray-200 border-16 w-fit rounded-lg">
              <img
                src={courses[0]?.thumbnail}
                alt=""
                className="w-78 md:w-96 lg:w-138"
              />
            </div>
            <Link
              to={`${routes[1]?.href}`}
              className="bg-[#005bbf] hover:bg-[#004084] px-8 py-2 text-white rounded-lg transition text-md sm:text-xl flex items-center w-46.5 sm:w-54 gap-2"
            >
              Buy Course <GoArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`${theme === 'dark' 
      ? "py-20 bg-[#313131] transition duration-500" 
      : "py-20 bg-[#eff4ff] transition duration-500"}`}>
        <div className="max-w-7xl mx-auto px-6 grid items-center justify-center">
          <h2 className={`${theme === 'dark' 
          ? "text-4xl font-bold text-center mb-6 text-[#cccccc] transition" 
          : "text-4xl font-bold text-center mb-6 transition"}`}>
            Explore top-tier categories
          </h2>
          <p className={`${theme === 'dark' 
          ? "text-center mb-8 text-[#ababab] transition" 
          : "text-center mb-8 transition"}`}>
            Diverse learning paths curated by industry experts to help you
            achieve your career goals.
          </p>
          <div className="grid lg:grid-cols-12 gap-6 lg:auto-rows-[170px]">
            <div className={`px-6 py-13 lg:py-18 rounded-2xl bg-[#005bbf] shadow-md ${theme === 'dark' ? 'shadow-[#90ff6e]' : 'shadow-gray-900'}  lg:col-span-4 lg:row-span-2 text-white/80 hover:text-white transition duration-500 group`}>
              <IoCode className="text-3xl mb-20 group-hover:text-white" />
              <h2 className="font-semibold text-2xl mb-4">Development</h2>
              <p className="mb-3">
               Master Full-Stack, Mobile, and Cloud Computing.
              </p>
              <Link className="flex items-center gap-2" to={routes[1]?.href}>
               Browse {routes[1]?.title} <GoArrowRight />
              </Link>
            </div>
            <div className={`${theme === 'dark' 
            ? "bg-[#999999] rounded-2xl lg:col-span-4 flex gap-3 items-center justify-start h-45 px-5 lg:px-15 group text-white transition duration-500 shadow-md shadow-[#90ff6e]" 
            : "bg-white rounded-2xl lg:col-span-4 flex gap-3 items-center justify-start h-45 px-5 lg:px-15 group transition duration-500 shadow-md shadow-gray-900"}`}>
              <div className="bg-[#68fadd] text-3xl rounded-2xl text-[#357e70] p-3">
                <MdOutlineColorLens />
              </div>
              <div>
                <h2 className="font-semibold text-xl">UI/UX Design</h2>
                <p className="font-semibold">120+ Courses</p>
              </div>
            </div>
            <div className={`${theme === 'dark' 
            ? "bg-[#999999] rounded-2xl lg:col-span-4 flex gap-3 items-center justify-start h-45 px-5 lg:px-15 group shadow-md shadow-[#90ff6e] text-white transition duration-500" 
            : "bg-white rounded-2xl lg:col-span-4 flex gap-3 items-center justify-start h-45 px-5 lg:px-15 group shadow-md shadow-gray-900 transition duration-500"}`}>
              <div className="bg-[#f9eee5] text-3xl rounded-2xl text-[#af7767] p-3">
                <LuChartNoAxesCombined />
              </div>
              <div>
                <h2 className="font-semibold text-xl">Data Science</h2>
                <p className="font-semibold">85+ Courses</p>
              </div>
            </div>
            <div className={`${theme === 'dark' 
            ? "bg-[#999999] rounded-2xl lg:col-span-6 flex gap-3 items-center justify-start h-45 px-5 lg:px-15 group shadow-md shadow-[#90ff6e] text-white duration-500 transition" 
            : "bg-white rounded-2xl lg:col-span-6 flex gap-3 items-center justify-start h-45 px-5 lg:px-15 group shadow-md shadow-gray-900 duration-500 transition"}`}>
              <div className="bg-[#e8f1fd] text-3xl rounded-2xl text-[#005ec2] p-3">
                <MdWorkOutline />
              </div>
              <div>
                <h2 className="font-semibold text-xl">Business Strategy</h2> 
                <p className="font-semibold">240+ Courses available</p>
              </div>
            </div>
            <div className={`bg-[#006b5c] rounded-2xl flex flex-row lg:flex-col lg:col-span-2 gap-3 ${theme === 'dark' ? 'shadow-[#90ff6e]' : 'shadow-gray-900'} shadow-md justify-start items-center lg:justify-center h-45 px-5 group duration-500 transition`}>
              <div className="text-4xl rounded-2xl text-white">
                <TbWorld />
              </div>
              <h2 className="text-white text-md font-bold">Languages</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className={`${theme === 'dark' 
      ? "py-20 bg-[#292929] w-full grid justify-around gap-20 transition duration-500" 
      : "py-20 bg-gray-50 w-full grid justify-around gap-20 transition duration-500"}`}>
        <div className="flex flex-col lg:flex-row lg:justify-between items-center px-8 mt-14 gap-4">
          <div>
            <h2 className={`${theme === 'dark' 
            ? " text-[#cccccc] text-2xl md:text-4xl xl:text-5xl text-center lg:text-left font-semibold mb-3 transition " 
            : "text-2xl md:text-4xl xl:text-5xl text-center lg:text-left font-semibold mb-3 transition "}`}>
              Meet our world-class mentors
            </h2>
            <p className={`${theme === 'dark' 
            ? "text-center lg:text-left text-base text-[#b9b6b6] font-semibold transition" 
            : "text-center lg:text-left text-base font-semibold transition"}`}>
              Learn directly from the experts shaping the future of technology.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto px-8 mb-14">
          {courses.slice(8, 12).map((c) => {
            return (
              <div className={`${theme === 'dark' 
              ? "rounded-2xl bg-[#313131] max-h-md h-full overflow-hidden shadow-md transition duration-500 flex flex-col gap-2 items-start p-4" 
              : "rounded-2xl bg-white max-h-md h-full overflow-hidden shadow-md transition duration-500 flex flex-col gap-2 items-start p-4"}`}>
                <img
                  src={c.avatar}
                  alt={c.instructorName}
                  className="rounded-2xl"
                />
                <h2 className={`${theme === 'dark' 
                ? "text-3xl lg:text-2xl xl:text-3xl font-semibold text-white transition" 
                : "text-3xl lg:text-2xl xl:text-3xl font-semibold transition"}`}>
                  {c.instructorName}
                </h2>
                <p className={`${theme === 'dark' 
                ? "text-xl font-bold text-white transition" 
                : "text-xl font-bold transition"}`}>{c.businessCategory}</p>
                <p className={`${theme === 'dark' 
                ? "text-white font-semibold transition" 
                : "font-semibold transition"}`}>{c.headline}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonial */}
      <section className={`${theme === 'dark' 
      ? "py-20 bg-[#2d3033] transition duration-500 w-full grid gap-20 overflow-x-hidden" 
      : "py-20 bg-[#d5e3fc] transition duration-500 w-full grid gap-20 overflow-x-hidden"}`}>
        <div className="px-4 sm:px-6 lg:px-16 max-w-7xl flex flex-col lg:flex-row justify-around">
          <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
            <h2 className={`${theme === 'dark' 
            ? "text-white text-2xl md:text-3xl font-bold xl:text-4xl transition" 
            : "text-2xl md:text-3xl font-bold xl:text-4xl transition"}`}>
              Hear from our <br className="hidden lg:block" /> thriving students
            </h2>
            <p className={`${theme === 'dark' 
              ? "text-[12px] mb-4 md:text-xl lg:text-[15px] xl:text-xl font-medium text-white transition" 
              : "text-[12px] mb-4 md:text-xl lg:text-[15px] xl:text-xl font-medium transition"}
             `}>
              Thousands of professionals have
              <br /> transformed their careers through
              <br /> EduFlow's curriculum.
            </p>
          </div>
          <div className="relative">
            <div className="flex mb-2 justify-around">
              <button className="swiper-prev z-10 bg-white/90 hover:bg-white shadow rounded-full p-3 flex items-center justify-center">
                <IoIosArrowBack />
              </button>
              <button className="swiper-next z-10 bg-white/90 hover:bg-white shadow rounded-full p-3 flex items-center justify-center">
                <IoIosArrowForward />
              </button>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              spaceBetween={12}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 24 },
              }}
              loop={true}
              autoplay={true}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              className="max-w-60 md:max-w-140 lg:max-w-150 xl:max-w-180 max-h-120"
            >
              {courses.slice(21, 25).map((c) => {
                return (
                  <SwiperSlide className="bg-white p-8 rounded-2xl shadow-md w-full h-full">
                    <div className="max-w-35 lg:max-w-50 xl:max-w-60 text-[15px] xl:text-[21px] mb-6">
                      <em>"{c.testimonial}"</em>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Avatar
                        src={c.avatar}
                        sx={{
                          width: { xs: 34, md: 50 },
                          height: { xs: 34, md: 50 },
                        }}
                      />
                      <div>
                        <h2 className="text-xs sm:text-sm lg:text-md xl:text-xl font-bold">
                          {c.instructorName}
                        </h2>
                        <span className="text-[10px] md:text-xs font-semibold">
                          {c.businessCategory}
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="max-w-3xl mx-auto">
        <div>
        <h2 className={`${theme === 'dark' 
        ? 'text-center pt-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white transition' 
        : "text-center pt-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold transition"}`}>
          Frequently Asked Questions
        </h2>
        <Accordion faqList={faqList} />
      </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default Home;
