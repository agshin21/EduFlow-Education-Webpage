import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import Box from '@mui/material/Box';
import Cartbutton from "../components/Cartbutton";
import CircularIndeterminate from "../components/Progressbar";
import type { Course } from "../@types/types";
import Footer from "../components/Footer";
import Form from "react-bootstrap/Form";
import Pagination from "../components/Pagination";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from "axios";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../context/ThemeContext";

const Courses = () => {
  const location = useLocation()
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const heroRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = Number(searchParams.get("limit")) || 6;
  const checked = searchParams.get("categories")
    ? searchParams.get("categories")!.split(",")
    : [];

  const updateParams = (updates: Record<string, string | null>) => {
    setSearchParams((prev) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
      });
      return prev;
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers"
      );
      return data;
    },
  });

  
  useEffect(() => {
    if (!data) return;

    const allElements = document.querySelectorAll<HTMLElement>(".transition");
    allElements.forEach(el => el.style.transition = "none");

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }

    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".course-card");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.07,
          }
        );
      }
    }
    
    allElements.forEach(el => el.style.transition = "")
  }, [data, location.key]);
  

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ search: e.target.value, page: "1" });
  };

  const courses: Course[] = data?.data || data || [];

  const allCategories = useMemo(
    () => [...new Set(courses.map((c: Course) => c.businessCategory))] as string[],
    [courses]
  );

  const selectAllCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({
      categories: e.target.checked ? allCategories.join(",") : null,
      page: "1",
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const next = e.target.checked
      ? [...checked, category]
      : checked.filter((c) => c !== category);
    updateParams({
      categories: next.length > 0 ? next.join(",") : null,
      page: "1",
    });
  };

  const setPage = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (search.trim()) {
      result = result.filter((course: Course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (checked.length > 0) {
      result = result.filter((course: Course) =>
        checked.includes(course.businessCategory)
      );
    }
    return result;
  }, [courses, checked, search]);

  const paginatedCourses = useMemo(
    () => filteredCourses.slice((page - 1) * limit, page * limit),
    [filteredCourses, page, limit]
  );

  if (isLoading)
    return (
      <div className={`flex ${theme === "dark" ? "bg-[#1a1919]" : "bg-[#f1f5fc]"} transition duration-500 items-center justify-center h-screen text-gray-700`}>
        <CircularIndeterminate />
      </div>
    );

  if (isError)
    return (
      <div className={`${theme === "dark" ? "bg-[#1a1919]" : "bg-[#f1f5fc]"} transition duration-500 flex justify-center items-center h-screen text-red-800`}>
        An Error Occurred
      </div>
    );

  return (
    <>
      <main className={`${theme === "dark" ? "pt-28 pb-20 min-h-screen bg-[#1a1919] transition duration-500" : "pt-28 pb-20 min-h-screen bg-[#f1f5fc] transition duration-500"}`}>
        <Cartbutton />

        {/* Searchbar */}
        <section ref={heroRef} className="max-w-7xl mx-auto text-center lg:text-left px-6 mb-10">
          <h1 className={`${theme === "dark" ? "text-4xl md:text-5xl font-bold text-[#cccccc] mb-6" : "text-4xl md:text-5xl font-bold text-gray-900 mb-6"}`}>
            Course Catalog
          </h1>
          <Form.Control
            placeholder="Search..."
            id="search"
            type="search"
            value={search}
            onChange={handleSearch}
            className="bg-white border-2 rounded-xl focus:outline-blue-600 max-w-74 md:max-w-96 w-full px-2 py-1 md:py-2 placeholder:font-medium"
          />
        </section>

        <section>
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {/* Filter Sidebar */}
            <div
              ref={sidebarRef}
              className={`top-20 ${theme === "dark" ? "bg-[#313131] p-6 rounded-2xl shadow-sm h-fit hidden lg:block transition duration-500" : "bg-white p-6 rounded-2xl shadow-sm h-fit hidden lg:block transition duration-500"}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`${theme === "dark" ? "font-semibold text-lg text-[#cccccc]" : "font-semibold text-lg text-black"}`}>
                  Filters
                </h2>
                <div className="flex items-center font-semibold gap-1">
                  <input
                    checked={checked.length > 0 && checked.length === allCategories.length}
                    type="checkbox"
                    id="SelectAll"
                    onChange={selectAllCategories}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label className={`${theme === "dark" ? "text-[#cccccc]" : "text-black"}`} htmlFor="SelectAll">
                    Select All
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {allCategories.map((category, idx) => (
                  <div key={idx}>
                    <input
                      type="checkbox"
                      checked={checked.includes(category)}
                      id={`cat-${category}`}
                      onChange={(e) => handleCategoryChange(e, category)}
                      className="w-3 rounded border bg-white cursor-pointer"
                    />
                    <label
                      htmlFor={`cat-${category}`}
                      className={`${theme === "dark" ? "text-[11px] font-semibold text-[#cccccc]" : "text-[11px] font-semibold text-black"}`}
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Grid - Stagger animation */}
            <div
              ref={gridRef}
              className="grid justify-center lg:grid-cols-4 lg:col-span-2 xl:col-span-3 gap-6"
            >
              {paginatedCourses.map((course: Course) => {
                const daysLeft = getRemainingDays(course.endDate);
                const styles = {
                  red: "bg-red-200 w-fit text-md font-semibold py-1 shadow-red-300 rounded-lg text-red-700 shadow-lg px-3",
                  green: "bg-green-200 w-fit text-md font-semibold py-1 shadow-green-300 rounded-lg text-green-700 shadow-lg px-3",
                  locked: "bg-gray-200 w-fit text-md font-semibold py-1 shadow-gray-300 rounded-lg text-gray-700 shadow-lg px-3",
                };

                let text = "";
                let statusCourse = "";

                if (daysLeft <= 0) {
                  text = "Closed";
                  statusCourse = styles.locked;
                } else if (daysLeft <= 5) {
                  text = `${daysLeft} days left`;
                  statusCourse = styles.red;
                } else {
                  text = `${daysLeft} days left`;
                  statusCourse = styles.green;
                }

                return (
                  <div
                    key={course.id}
                    className={`course-card ${ 
                      theme === "dark"
                        ? "bg-[#313131] text-[#cccccc] max-w-108 p-5 lg:max-w-full h-fit space-y-2 lg:col-span-2 rounded-2xl shadow-sm hover:shadow-lg transition duration-500 overflow-hidden group"
                        : "bg-white max-w-108 p-5 lg:max-w-full h-fit space-y-2 lg:col-span-2 rounded-2xl shadow-sm hover:shadow- transition duration-500 overflow-hidden group"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 md:h-63 xl:h-63 lg:h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h2 className="font-bold lg:font-medium xl:font-bold text-lg md:text-2xl lg:text-md xl:text-2xl min-h-16">
                      {course.title}
                    </h2>
                    <p>{`${course.description.slice(0, 49)}...`}</p>
                    <div className="flex flex-col gap-2 items-center justify-between">
                      <button
                        onClick={() => course.id ? navigate(`/details/${course.id}`) : console.error("Course id is nothing!")}
                        className="font-bold text-sm md:text-lg lg:text-base xl:text-lg shadow-lg shadow-blue-600 bg-blue-600 transition hover:bg-[#323795] text-white text-center py-4 px-15 w-full rounded-2xl hover:cursor-pointer"
                      >
                        Browse Course
                      </button>
                    </div>
                    <div className="flex items-center">
                      <Box sx={{ width: { xs: 170, sm: 230, md: 140, lg: 240 }, display: "flex", alignItems: "center" }}>
                        <Rating
                          name="text-feedback"
                          value={Number(course.rating)}
                          readOnly
                          precision={0.5}
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          sx={{ fontSize: { xs: 15, sm: 25 } }}
                        />
                      </Box>
                      <p className="text-sm md:text-lg lg:text-sm xl:text-lg font-semibold text-green-500">
                        {course.studentsCount} Active Students
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={styles.green}>{course.businessCategory}</p>
                      <p className={statusCourse}>{text}</p>
                    </div>
                  </div>
                );
              })}

              {paginatedCourses.length === 0 && (
                <p className={`col-span-full text-center py-10 ${theme === "dark" ? "text-[#cccccc]" : "text-gray-700"}`}>
                  No courses found with selected filters.
                </p>
              )}
            </div>
          </div>

          <Pagination
            enabled={checked?.length}
            changePageNo={setPage}
            courses={filteredCourses.length}
            coursesPerPage={limit}
            currentPage={page}
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Courses;