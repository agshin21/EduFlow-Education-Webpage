import { Avatar, AvatarGroup, Button, Rating } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward, IoMdTime } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { BsPlayBtn } from "react-icons/bs";
import CircularIndeterminate from "../components/Progressbar";
import type { Course } from "../@types/types";
import type { DiscountPrice } from "../@types/types";
import { FaRegFileAlt } from "react-icons/fa";
import Footer from "../components/Footer";
import { IoInfiniteSharp } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { Navigation } from "swiper/modules";
import { PiCertificateBold } from "react-icons/pi";
import { PiMoneyLight } from "react-icons/pi";
import { PiUsersBold } from "react-icons/pi";
import type { Review } from "../@types/types";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { useCart } from "../store/cartStore";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router";
import { useTheme } from "../context/ThemeContext";

const Details = () => {
const {theme} = useTheme()
const [loading, setLoading] = useState(true)
const {cart} = useCart()  
const addCart = useCart((state) => state.addCart)  
const isSmallDevices = useMediaQuery({ query: "(max-width: 1023px)" });
const isLargeDevices = useMediaQuery({ query: "(min-width: 1024px)" });
const { id } = useParams();
const [courses, setCourses] = useState<Course[]>([]);
const [discountPrices, setDiscountPrices] = useState<DiscountPrice[]>([]);
const [studentReviews, setStudentReviews] = useState<Review[]>([]);
const isInCart = (id?: number | string) => {
  return cart.some((item) => item.id === id)
}

const handleAddCart = (course: Course) => {
  const discountEntry = discountPrices.find((d) => String(d.id) === String(course.id))

  addCart({
    ...course,
    discountPrice: discountEntry?.discountPrice
  })
}

useEffect(() => {
  const fetchAllData = async() => {
    try {
      const [courseData, discountPriceData, studentReviewData] = await Promise.all([
        axios.get("https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers"),
        axios.get("../data/discountPrices.json"),
        axios.get("../data/studentReviews.json")
      ])

      setCourses(courseData.data)
      setDiscountPrices(discountPriceData.data)
      setStudentReviews(studentReviewData.data)
    }
    catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  fetchAllData()
}, [])  



if(loading) return <div className={`flex ${ theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'} items-center justify-center h-screen text-gray-700`}><CircularIndeterminate /></div>


return (
<div className="">
{isSmallDevices &&
courses &&
courses.map((course) => {
  if (course.id == id) {
    return studentReviews.map((review) => {
      if(review.id == id) return(
      <div className={`max-w-lg sm:max-w-4xl ${theme === 'dark' ? 'bg-[#1a1919]' : ''} transition duration-500 mx-auto min-h-screen font-sans relative pt-20 pb-20`}>
 
      {/* ── HERO IMAGE ── */}
      <div className="relative w-full h-44 sm:h-84 bg-gray-800 overflow-hidden">
        <img
          src={course.thumbnail}
          alt="Course hero"
          className="w-full h-full object-cover opacity-70"
        />
      </div>
      {/* ── COURSE INFO ── */}
      <div className={`px-4 pt-3 ${theme === 'dark' ? 'bg-[#1a1919]' : 'border-b border-gray-100'} transition duration-500 pb-2 `}>
        <h1 className={`text-md font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}  leading-snug`}>
          {course.title}
        </h1>
 
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-500 text-xs font-bold">{course.rating}</span>
          <Rating value={Number(course.rating)} readOnly precision={0.5} size="small" sx={{ fontSize: 14, color: "#EAB308" }} />
          <span className="text-sm text-gray-500 font-medium">({review.totalReviews} Reviews)</span>
          <span className="text-sm text-gray-500 font-medium ml-1">{course.studentsCount} students</span>
        </div>
 
        <div className="flex items-center gap-2 mt-2">
          <AvatarGroup max={1}>
            <Avatar src={course.avatar} sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, bgcolor: "#6366f1" }}/>
          </AvatarGroup>
          <div>
            <p className={`text-md font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'}  leading-none`}>{course.instructorName}</p>
            <p className="text-sm text-gray-500 font-medium">{course.businessCategory}</p>
          </div>
        </div>
      </div>
 
      {/* ── MEET YOUR INSTRUCTOR ── */}
      <div className={`px-4 pt-4 pb-3 ${theme === 'dark'? 'bg-[#252424]' : 'bg-gray-50 border-b border-gray-100'} transition duration-500`}>
        <h2 className={`text-md font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}  mb-3`}>Meet Your Instructor</h2>
 
        <div className="flex items-start gap-3">
          <AvatarGroup max={1}>
            <Avatar src={course.avatar} sx={{ width: 52, height: 52, fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg,#6366f1,#818cf8)", flexShrink: 0 }}/>
          </AvatarGroup>
          <div>
            <p className={`text-md font-bold ${theme === 'dark' ? 'text-[#e5e5e6]' : 'text-gray-900'} `}>{course.instructorName}</p>
            <p className="text-sm font-medium text-gray-500">{course.businessCategory}</p>
          </div>
        </div>

        <p className={`text-sm font-medium text-gray-500 leading-relaxed mt-3`}>{course.aboutInstructor}</p>
      </div>
 
      {/* ── STUDENT REVIEWS ── */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-md font-bold ${theme === 'dark' ? 'text-[#dedee1]' : 'text-gray-900'}`}>Student Reviews</h2>
        </div>
 
        {/* Review 1 */}
        <div className="flex gap-2 mb-3">
          <AvatarGroup max={1}>
            <Avatar src={review.studentsProfileUrl.student_1} sx={{ bgcolor: "#4B5EAA", width: 34, height: 34, fontSize: 12, fontWeight: 700, flexShrink: 0 }}/>
          </AvatarGroup>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-900'}`}>{review.studentsFullName.student_1}</span>
              <Rating value={Number(review.lessonRatings.student_1)} readOnly size="small" sx={{ fontSize: 13, color: "#EAB308" }} />
            </div>
            <p className="text-XS font-medium text-gray-500 mt-0.5 leading-relaxed">{review.studentsReview.student_1}</p>
          </div>
        </div>
 
        {/* Review 2 */}
        <div className="flex gap-2 mb-3">
          <AvatarGroup max={1}>
            <Avatar src={review.studentsProfileUrl.student_2} sx={{ bgcolor: "#4B5EAA", width: 34, height: 34, fontSize: 12, fontWeight: 700, flexShrink: 0 }}/>
          </AvatarGroup>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-900'}`}>{review.studentsFullName.student_2}</span>
              <Rating value={Number(review.lessonRatings.student_2)} readOnly size="small" sx={{ fontSize: 13, color: "#EAB308" }} />
            </div>
            <p className="text-XS font-medium text-gray-500 mt-0.5 leading-relaxed">{review.studentsReview.student_2}</p>
          </div>
        </div>

        {/* Review 3 */}
        <div className="flex gap-2 mb-3">
          <AvatarGroup max={1}>
            <Avatar src={review.studentsProfileUrl.student_3} sx={{ bgcolor: "#4B5EAA", width: 34, height: 34, fontSize: 12, fontWeight: 700, flexShrink: 0 }}/>
          </AvatarGroup>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-900'}`}>{review.studentsFullName.student_3}</span>
              <Rating value={Number(review.lessonRatings.student_3)} readOnly size="small" sx={{ fontSize: 13, color: "#EAB308" }} />
            </div>
            <p className="text-XS font-medium text-gray-500 mt-0.5 leading-relaxed">{review.studentsReview.student_3}</p>
          </div>
        </div>

        {/* Review 4 */}
        <div className="flex gap-2 mb-3">
          <AvatarGroup max={1}>
            <Avatar src={review.studentsProfileUrl.student_4} sx={{ bgcolor: "#4B5EAA", width: 34, height: 34, fontSize: 12, fontWeight: 700, flexShrink: 0 }}/>
          </AvatarGroup>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-900'}`}>{review.studentsFullName.student_4}</span>
              <Rating value={Number(review.lessonRatings.student_4)} readOnly size="small" sx={{ fontSize: 13, color: "#EAB308" }} />
            </div>
            <p className="text-XS font-medium text-gray-500 mt-0.5 leading-relaxed">{review.studentsReview.student_4}</p>
          </div>
        </div>
      </div>
 
      {/* ── STICKY ENROLL FOOTER ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg sm:max-w-4xl bg-blue-600 px-4 py-3 flex items-center justify-between z-50">
        <div>
          <p className="text-xs font-medium  text-blue-200">Total Price</p>
          <p className="text-xl font-black text-white">${course.price.toFixed(2)}</p>
        </div>
        <Button
          onClick={() => handleAddCart(course)}
          variant="contained"
          endIcon={<IoIosArrowForward />}
          sx={{
            bgcolor: "#fff", color: "#2563EB", fontWeight: 800, fontSize: 14,
            borderRadius: 2, textTransform: "none", px: 2.5, py: 1,
            "&:hover": { bgcolor: "#EFF6FF" }, boxShadow: "none",
          }}
        >
          {isInCart(course.id) ? 'In cart' : 'Add to Cart'}
        </Button>
      </div>
 
    </div>
    )
  })
  }
})}
{isLargeDevices &&
courses &&
discountPrices &&
courses.map((course: Course) => {
if (course.id == id) {
return discountPrices.map((discount) => {
if (discount.id == id)
return studentReviews.map((review) => {
if (review.id == id)
return (
<>
  <main className={`py-21 transition duration-500 ${theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'}`}>
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-3 grid justify-center grid-cols-3 text-left">

        {/* Thumbnail */}
        <div className="max-w-xl xl:max-w-3xl mb-20 mt-10 col-span-2">
          <h2 className={`text-5xl xl:text-6xl font-bold mb-5 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
          {course.title}
          </h2>
          <p className={`text-lg xl:text-2xl mb-4 font-medium ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
          {course.description}
          </p>
          <img src={course.thumbnail} alt="" className="w-full mt-11 h-96 xl:h-114 rounded-2xl"/>
          <div className="flex justify-start items-center gap-4 mb-4">
           <div className="flex items-center">
             <Rating
              max={1}
              name="text-feedback"
              value={Number(course.rating)}
              readOnly
              precision={0.5}
              emptyIcon={
                <StarIcon
                style={{ opacity: 0.55 }}
                fontSize="inherit"
                />
                }
                sx={{ fontSize: 25 }}
              />
              <p className={`font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
              {course.rating}
              </p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>({review.totalReviews} Review)</p>
            </div>
            <div className="flex gap-1">
             <PiUsersBold className={`size-6 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`} />
             <p className={`text-[17px] font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
             {course.studentsCount} Students enrolled
             </p>
            </div>
          </div>
          
          {/* Instructor */}
          <h2 className={`text-5xl font-bold mt-16 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>Instructor</h2>
          <div className={`${theme === 'dark' ? 'text-[#e1dede] bg-[#222121]' : 'text-black bg-[#ffffff]'} duration-500 transition mt-8 shadow-lg max-w-xl xl:max-w-3xl w-full px-10 py-7 rounded-2xl flex flex-col items-start gap-2`}>
           <div className="flex gap-5 mb-2">
             <AvatarGroup max={1} className="flex">
               <Avatar
               src={course.avatar}
               sx={{
                width: { md: 140, lg: 160 },
                height: { md: 140, lg: 160 },
               }}
               />
              </AvatarGroup>
              <div>
                <h2 className="text-2xl xl:text-5xl font-semibold">
                  {course.instructorName}
                </h2>
                <p className="text-lg xl:text-4xl font-medium text-[#1232c2] mb-3">
                  {course.businessCategory}
                </p>
                <p className="max-w-sm w-full text-[14px] xl:text-lg xl:max-w-md text-left font-semibold">
                  {course.aboutInstructor}
                </p>
              </div>
            </div>
          </div>
        </div>
              
        {/* Add to Cart */}
        <div className="mb-20 mt-10">
          <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-[#ffffff]'} duration-500 transition shadow-lg h-fit px-9 py-11 rounded-2xl space-y-4 mb-3`}>
            <h2 className="font-bold text-sm text-red-600">
              LIMITED TIME OFFER
            </h2>
            <div className="flex items-end gap-3">
              <h2 className={`font-bold text-5xl ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
                ${course.price.toFixed(2)}
              </h2>
              <h2 className={`text-3xl font-semibold ${theme === 'dark' ? 'text-[#e1dede]/60' : 'text-black/40'} line-through`}>
                ${Number(discount.discountPrice).toFixed(2)}
              </h2>
            </div>
            <p className="text-red-600 flex items-center gap-1 font-semibold">
              <IoMdTime />2 days left at this price!
            </p>
            <button
            onClick={() => handleAddCart(course)}
            className="bg-[#2f71f7] rounded-xl py-5 w-full text-white text-2xl xl:text-3xl font-semibold hover:bg-[#224ea6] transition hover:cursor-pointer">
              {isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
            </button>
            <hr className={`${theme === 'dark' ? 'text-[#e1dede]/40' : 'text-black/20'} `} />
            <h2 className={`font-bold text-md ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
              This course includes:
            </h2>
            <p className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-black/60'}`}>
              <BsPlayBtn /> 28 hours on-demand video
            </p>
            <p className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-black/60'}`}>
              <FaRegFileAlt /> 15 downloadable resources
            </p>
            <p className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-black/60'}`}>
              <IoInfiniteSharp /> Full lifetime access
            </p>
            <p className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-black/60'}`}>
              <PiCertificateBold /> Certificate of
              completion
            </p>
          </div>

          {/* Guarantee Card */}
          <div className={`flex flex-col items-center rounded-xl shadow-lg py-5 transition duration-500 ${theme === 'dark' ? 'text-[#e1dede] bg-[#222121] ' : 'text-black bg-[#EFF4FF] '}`}>
            <h2 className="text-md font-semibold mb-2">30-Day Money-Back Guarantee</h2>
            <div className={`flex text-5xl gap-4 transition ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-black/60'}`}>
              <AiOutlineSafetyCertificate />
              <PiMoneyLight />
              <MdLockOutline />
          </div>
         </div>
        </div>

        {/* Student Reviews */}
        <div className="grid col-span-2">
          <div className="flex justify-between">
            <h2 className={`mb-8 text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>Student Reviews</h2>
            <div className="flex mb-2 gap-2">
             <button className="swiper-prev bg-white h-fit my-auto p-3 rounded-full shadow-lg hover:cursor-pointer">
              <IoIosArrowBack />
             </button>
             <button className="swiper-next bg-white h-fit my-auto p-3 rounded-full shadow-lg hover:cursor-pointer">
              <IoIosArrowForward />
             </button>
            </div>
          </div>
          <Swiper
          pagination={{clickable: true}}
          scrollbar={{draggable: true}}
          slidesPerView={2}
          spaceBetween={24}
          navigation={{prevEl: ".swiper-prev", nextEl: ".swiper-next"}}
          modules={[Navigation]}
          loop={true}
          autoplay={true}
          className="max-w-220 w-full max-h-90"
          >
            <SwiperSlide>
              <div className="bg-white px-6 py-4 border h-48 border-black/10 rounded-xl shadow-lg">
               <div className="flex items-start justify-start gap-4">
                <AvatarGroup max={1} className="flex">
                  <Avatar src={review.studentsProfileUrl.student_1} sx={{width: 50, height: 50}}/>
                </AvatarGroup>
                <div className="flex flex-col">
                 <h2 className="text-2xl font-semibold">{review.studentsFullName.student_1}</h2>
                 <Rating max={5} readOnly value={Number(review.lessonRatings.student_1)}/>
                 <em>"{review.studentsReview.student_1}"</em> 
                </div>
               </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white px-6 py-4 border h-48 border-black/10 rounded-xl shadow-lg">
               <div className="flex items-start justify-start gap-4">
                <AvatarGroup max={1} className="flex">
                  <Avatar src={review.studentsProfileUrl.student_2} sx={{width: 50, height: 50}}/>
                </AvatarGroup>
                <div className="flex flex-col">
                 <h2 className="text-2xl font-semibold">{review.studentsFullName.student_2}</h2>
                 <Rating max={5} readOnly value={Number(review.lessonRatings.student_2)}/>
                 <em>"{review.studentsReview.student_2}"</em> 
                </div>
               </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white px-6 py-4 border h-48 border-black/10 rounded-xl shadow-lg">
               <div className="flex items-start justify-start gap-4">
                <AvatarGroup max={1} className="flex">
                  <Avatar src={review.studentsProfileUrl.student_3} sx={{width: 50, height: 50}}/>
                </AvatarGroup>
                <div className="flex flex-col">
                 <h2 className="text-2xl font-semibold">{review.studentsFullName.student_3}</h2>
                 <Rating max={5} readOnly value={Number(review.lessonRatings.student_3)}/>
                 <em>"{review.studentsReview.student_3}"</em> 
                </div>
               </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white px-6 py-4 border h-48 border-black/10 rounded-xl shadow-lg">
               <div className="flex items-start justify-start gap-4">
                <AvatarGroup max={1} className="flex">
                  <Avatar src={review.studentsProfileUrl.student_4} sx={{width: 50, height: 50}}/>
                </AvatarGroup>
                <div className="flex flex-col">
                 <h2 className="text-2xl font-semibold">{review.studentsFullName.student_4}</h2>
                 <Rating max={5} readOnly value={Number(review.lessonRatings.student_4)}/>
                 <em>"{review.studentsReview.student_4}"</em> 
                </div>
               </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  </main>
  
  {/* Footer */}
  <Footer />
  </>
   );
  });
 });
}
})} 
</div>
);
}; export default Details;
