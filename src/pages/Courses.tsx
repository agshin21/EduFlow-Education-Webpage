import { useEffect, useState } from "react";

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
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";

const Courses = () => {
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [checked, setChecked] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(8)
  const handleCheckbox = (e: any, c: Course) => {

    if (e.target.checked) {
      setChecked((prevChecked) => [...prevChecked, c.businessCategory])
    } else {
      setChecked((prevChecked) =>
        prevChecked.filter((prevOneChecked) => prevOneChecked !== c.businessCategory))
    }
  };

  const selectAllCategories = (e: any) => {
    setChecked(
      e.target.checked
        ? courses.map((course) => course.businessCategory)
        : []
    )
  }
  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    return;
  };

  useEffect(() => {
    axios
      .get("https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, []);

  if (loading) return <div className={`flex ${theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'} transition duration-500 items-center justify-center h-screen text-gray-700`}><CircularIndeterminate /></div>

  const changePageNo = (number: number) => setCurrentPage(number)
  const lastPostIndex = currentPage * coursesPerPage
  const firstPostIndex = lastPostIndex - coursesPerPage
  const displayedCourses = courses
    .filter(
      (course) =>
        checked.length === 0 ||
        checked.includes(course.businessCategory))
    .filter(
      (course) =>
        course.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        course.businessCategory.toLowerCase().includes(search.trim().toLowerCase()))
    .slice(firstPostIndex, lastPostIndex)
    .map((course) => (
      <div
        key={course.id}
        className={`${theme === 'dark'
          ? 'bg-[#313131] text-[#cccccc] max-w-108 p-5 lg:max-w-full h-fit space-y-2 lg:col-span-2 rounded-2xl shadow-sm hover:shadow-lg transition duration-500 overflow-hidden group'
          : 'bg-white max-w-108 p-5 lg:max-w-full h-fit space-y-2 lg:col-span-2 rounded-2xl shadow-sm hover:shadow-lg transition duration-500 overflow-hidden group'}`}
      >
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 md:h-63 xl:h-63 lg:h-40 object-cover"
          />
        </div>
        <h2 className="font-bold lg:font-medium xl:font-bold text-lg md:text-2xl lg:text-md xl:text-2xl min-h-16">{course.title}</h2>
        <p>{`${course.description.slice(0, 49)}...`}</p>
        <div className="flex flex-col gap-2 items-center justify-between">
          <button onClick={() => { navigate(`/details/` + course.id) }} className="font-bold text-sm md:text-lg lg:text-base xl:text-lg bg-[#5760fe] transition hover:bg-[#323795] text-white text-center py-4 px-15 w-full rounded-2xl hover:cursor-pointer">
            Browse Course
          </button>
        </div>
        <div className="flex items-center">
          <Box sx={{ width: { xs: 170, sm: 230, md: 140, lg: 240 }, display: 'flex', alignItems: 'center' }}>
            <Rating
              name="text-feedback"
              value={Number(course.rating)}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              sx={{ fontSize: { xs: 15, sm: 25 } }} />
          </Box>
          <p className="text-sm md:text-lg lg:text-sm xl:text-lg font-semibold text-green-500">{course.studentsCount} Active Students</p>

        </div>
        <p className="bg-[#a0faaa] w-fit py-2 px-3 rounded-2xl text-[#57845c] font-semibold">{course.businessCategory}</p>
      </div>
    ))
  return (
    <>
      <main className={`${theme === 'dark'
        ? 'pt-28 pb-20 min-h-screen bg-[#1a1919] transition duration-500'
        : 'pt-28 pb-20 min-h-screen bg-[#f1f5fc] transition duration-500'}`}>
          <Cartbutton />
        {/* Searchbar */}
        <section className="max-w-7xl mx-auto text-center lg:text-left px-6 mb-10">
          <h1 className={`${theme === 'dark'
            ? 'text-4xl md:text-5xl font-bold text-[#cccccc] mb-6'
            : 'text-4xl md:text-5xl font-bold text-gray-900 mb-6'}`}>
            Course Catalog
          </h1>
          <Form.Control placeholder="Search..." id="search" type="search" onChange={handleSearch} className="bg-white border-2 rounded-xl focus:outline-blue-600 max-w-74 md:max-w-96 w-full px-2 py-1 md:py-2 placeholder:font-medium" />
        </section>
        <section>
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {/* Filter */}
            <div className={`${theme === 'dark'
              ? 'bg-[#313131] p-6 rounded-2xl shadow-sm h-fit top-28 hidden lg:block transition duration-500'
              : 'bg-white p-6 rounded-2xl shadow-sm h-fit top-28 hidden lg:block transition duration-500'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`${theme === 'dark'
                  ? 'font-semibold text-lg text-[#cccccc]'
                  : 'font-semibold text-lg text-black'}`}>Filters</h2>
                <div className="flex items-center font-semibold gap-1">
                  <Form.Control
                    checked={checked?.length === courses?.length}
                    type="checkbox"
                    id="SelectAll"
                    onChange={selectAllCategories}
                  />
                  <label className={`${theme === 'dark'
                    ? 'text-[#cccccc]'
                    : 'text-black'}`} htmlFor="SelectAll">
                    Select All
                  </label>
                </div>
              </div>
              <form className="grid grid-cols-2 gap-2">
                {courses.map((course) => (
                  <div key={course.id} className="">
                    <Form.Control
                      type="checkbox"
                      checked={checked.includes(course.businessCategory)}
                      id={course.id}
                      onChange={(e) => handleCheckbox(e, course)}
                      className="block group w-3 rounded border bg-white data-checked:bg-blue-500"
                    />
                    <label
                      htmlFor={course.businessCategory}
                      className={`${theme === 'dark'
                        ? 'text-[11px] font-semibold text-[#cccccc]'
                        : 'text-[11px] font-semibold text-black'}`}
                    >
                      {course.businessCategory}
                    </label>
                  </div>
                ))}
              </form>
            </div>

            {/* Courses */}
            <div className="grid justify-center lg:grid-cols-4 lg:col-span-2 xl:col-span-3 gap-6">
              {displayedCourses}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            enabled={checked?.length}
            coursesPerPage={coursesPerPage}
            courses={courses?.length}
            currentPage={currentPage}
            changePageNo={changePageNo} />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Courses;
