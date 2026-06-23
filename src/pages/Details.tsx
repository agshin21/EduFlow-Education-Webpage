import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { Avatar, AvatarGroup, Button, Rating } from "@mui/material";
import type { Course, Description, DiscountPrice, Review, Syllabus, Topic } from "../@types/types";
import { IoIosArrowForward, IoMdTime } from "react-icons/io";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import ArticleIcon from '@mui/icons-material/Article';
import CircularIndeterminate from "../components/Progressbar";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from "../components/Footer";
import { MdLockOutline } from "react-icons/md";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { PiMoneyLight } from "react-icons/pi";
import { PiUsersBold } from "react-icons/pi";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../store/cartStore";
import { useMediaQuery } from "react-responsive";
import { usePurchased } from "../store/purchasedStore";
import { useTheme } from "../context/ThemeContext";

const Details = () => {
  const [description, setDescription] = useState<Description | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState<number | null>(0)
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const {purchased} = usePurchased()
  const [lessonSyllabus, setLessonSyllabus] = useState<Syllabus| null>(null)
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { cart } = useCart()
  const addCart = useCart((state) => state.addCart)
  const isSmallDevices = useMediaQuery({ query: "(max-width: 1023px)" });
  const isLargeDevices = useMediaQuery({ query: "(min-width: 1024px)" });
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [discountPrices, setDiscountPrices] = useState<DiscountPrice[]>([]);
  const [studentReviews, setStudentReviews] = useState<Review[]>([]);
  const isInCart = (id?: number | string) => {
    return cart.some((item) => String(item.id) === String(id))
  }
  const isPurchased = (id?: number | string) => {
    return purchased.some((item) => String(item.id) === String(id))
  }
const getCourseStatus = (course: Course): string => {
  const today = new Date().setHours(0, 0, 0, 0);
  const startDateRaw = new Date(course.startDate)
  const endDateRaw = new Date(course.endDate)
  const startDate = isNaN(startDateRaw.getTime()) ? today : startDateRaw.setHours(0, 0, 0, 0);
  const endDate = isNaN(endDateRaw.getTime()) ? today : endDateRaw.setHours(0, 0, 0, 0);  
  const owned = isPurchased(course.id);

  if (owned) {
    if (today > endDate) return "completed"; 
    return "active";                          
  }

 
  if (today >= endDate) return "locked";   
  if (today < startDate) return "upcoming";
  return "active";
};


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [courseRes, discountsRes, syllabusRes, reviewsRes, descriptionRes] = await Promise.all([
          axios.get(`https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers/${id}`),
          axios.get("/data/discountPrices.json"),
          axios.get(`https://6a2ec8d2c9776ca6c0c4f04a.mockapi.io/lessons/v1/previews/${id}`),
          axios.get("/data/studentReviews.json"),
          axios.get(`https://6a3409f48248ee962fa4fc34.mockapi.io/api/v1/descriptions/${id}`)
        ]);
        setLessonSyllabus(syllabusRes.data)
        setCourse(courseRes.data);
        setDiscountPrices(discountsRes.data);
        setStudentReviews(reviewsRes.data);
        setDescription(descriptionRes.data)
      }
      catch (err) {
        console.error(err);
      }
    };

    if (id) fetchAllData();
  }, [id]);


useEffect(() => {
  const fetchUserReviews = async () => {
    try {
      const res = await axios.get(
        `https://6a2ec8d2c9776ca6c0c4f04a.mockapi.io/lessons/v1/courseReviews?courseId=${id}`
      );
      setUserReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  if (id) fetchUserReviews();
}, [id]);

const handleSubmitReview = async () => {
  if (!userAuth) {
    navigate('/login');
    toast.error('Please login to write a review');
    return;
  }
  if (!reviewRating || reviewText.trim() === "") {
    toast.error("Please add a rating and a comment");
    return;
  }

  try {
    if (!course) return;
    setSubmitting(true);
    const newReview = {
      courseId: String(id),
      studentName: userAuth.fullName || userAuth?.firstName || "Anonymous",
      avatar: userAuth.avatar || "",
      rating: String(reviewRating),
      comment: reviewText.trim(),
      createdAt: new Date().toISOString(),
    };

    const res = await axios.post(
      `https://6a2ec8d2c9776ca6c0c4f04a.mockapi.io/lessons/v1/courseReviews`,
      newReview
    );

    setUserReviews((prev) => [res.data, ...prev]); 
    setReviewText("");
    setReviewRating(0);
    toast.success("Review added successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong, try again");
  } finally {
    setSubmitting(false);
  }
};

  const topics = useMemo<Topic[]>(() => {
  if (!lessonSyllabus) return [];
  return [
    lessonSyllabus.topic_1,
    lessonSyllabus.topic_2,
    lessonSyllabus.topic_3,
  ].filter(Boolean);
  }, [lessonSyllabus]);

  
  const courseStatus = useMemo(() => {
    if (!course) return "";
    return getCourseStatus(course);
  }, [course, purchased]);

  const currentDiscount = useMemo(() => {
    return discountPrices.find((discount) => String(discount.id) === String(course?.id)) || null;
  }, [discountPrices, course]);
  const userAuth = JSON.parse(String(localStorage.getItem('user'))) || JSON.parse(String(sessionStorage.getItem('user')))
  const handleAddCart = (course: Course) => {
    if(!userAuth){
      navigate('/login')
      toast.error('Please create or login your account first')
      return
    }
    
    if(courseStatus === "locked"){
      toast.error("This course status is locked try again later")
      return
    }

    if (courseStatus === "upcoming") {
      toast.info("This course is upcoming and cannot be added yet.");
      return;
    }
    addCart({
      ...course,
      discountPrice: currentDiscount?.discountPrice,
    });
  };
 
  if (!course) return <div className={`flex ${theme === 'dark' ? 'bg-[#1a1919]/95' : 'bg-[#f1f5fc]'} items-center justify-center h-screen text-gray-700`}><CircularIndeterminate /></div>

  return (
    <div>
      {isSmallDevices &&
        studentReviews.filter((review) => String(review.id) === String(course.id)).map((review) =>
        (<div key={review.id} className={`max-w-lg sm:max-w-4xl ${theme === 'dark' ? 'bg-[#1a1919]' : ''} transition duration-500 mx-auto min-h-screen font-sans relative pt-20 pb-20`}>

          {/* ── HERO IMAGE ── */}
          <div className="relative w-full h-44 sm:h-84 bg-gray-800 overflow-hidden">
            <iframe src={`https://www.youtube.com/embed/${course.previewVideoId}`} className="w-full h-full object-cover"></iframe>
          </div>
          {/* ── COURSE INFO ── */}
          <div className={`px-4 pt-3 ${theme === 'dark' ? 'bg-[#1a1919]' : 'border-b border-gray-100'} transition duration-500 pb-2 `}>
            <h1 className={`text-md font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}  leading-snug`}>
              {course.title}
            </h1>

            <div className="flex items-center gap-1 mt-1 pb-2">
              <span className="text-yellow-500 text-xs font-bold">{course.rating}</span>
              <Rating value={Number(course.rating)} readOnly precision={0.5} size="small" sx={{ fontSize: 14, color: "#EAB308" }} />
              <span className="text-sm text-gray-500 font-medium">({review.totalReviews} Reviews)</span>
              <span className="text-sm text-gray-500 font-medium ml-1">{course.studentsCount} students</span>
            </div>

            <div className="pb-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/70'}`}>Course is openning: {course.startDate}</p>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/70'}`}>Course is closing: {course.endDate}</p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <AvatarGroup max={1}>
                <Avatar src={course.avatar} sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, bgcolor: "#6366f1" }} />
              </AvatarGroup>
              <div>
                <p className={`text-md font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'}  leading-none`}>{course.instructorName}</p>
                <p className="text-sm text-gray-500 font-medium">{course.businessCategory}</p>
              </div>
            </div>
          </div>
          
          <p className={`text-xs px-4 ${theme === "dark" ? "text-[#e1dede]/70" : "text-black/70"}`}>{description?.courseDescription}</p>

          {/* ── COURSE SYLLABUS (MOBILE) ── */}
          <div className={`px-4 pt-4 pb-3 ${theme === 'dark' ? 'bg-[#1a1919]' : 'border-b border-gray-100'} transition duration-500`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-md font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-[#0f0f23]'}`}>
                Course Syllabus
              </h2>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${theme === 'dark' ? 'bg-[#2a2929] text-[#e1dede]/80' : 'bg-indigo-50 text-indigo-600'}`}>
                {topics.length} modules
              </span>
            </div>

            {lessonSyllabus?.id ? (
              <div className="flex flex-col gap-3">
                {topics.map((topic, index) => {
                  const lessons = Object.values(topic.lesson_syllabus);
                  const times = Object.values(topic.lessonsTime);

                  const totalTopicTime =
                    times.reduce((sum, t) => sum + (parseInt(t) || 0), 0) + 'h';

                  return (
                    <Accordion
                      key={index}
                      disableGutters
                      className={`!rounded-xl !shadow-none before:!hidden ${
                        theme === 'dark'
                          ? '!bg-[#222121] !border !border-white/5'
                          : '!bg-white !border !border-slate-100'
                      }`}
                      sx={{
                        transition: 'all .25s ease',
                        '&.Mui-expanded': { borderColor: 'rgba(99,102,241,.45)' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                            <ExpandMoreIcon className="!text-[16px]" />
                          </div>
                        }
                        className="!px-3 !py-2"
                      >
                        <div className="flex w-full items-center gap-3 pr-2">
                          {/* Step number */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white shadow-md shadow-indigo-500/30">
                            {String(index + 1).padStart(2, '0')}
                          </div>

                          <div className="min-w-0 flex-1">
                            <Typography className={`!text-[14px] !font-bold !leading-tight ${theme === 'dark' ? '!text-[#e1dede]' : '!text-[#0f0f23]'}`}>
                              {topic.title}
                            </Typography>
                            <div className="mt-1.5 flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                <PlayCircleOutlineIcon className="!text-[13px] !text-indigo-400" />
                                {lessons.length} lessons
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                <AccessTimeIcon className="!text-[13px] !text-violet-400" />
                                {totalTopicTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionSummary>

                      <AccordionDetails className="!px-3 !pb-3 !pt-0">
                        <div className="ml-4 flex flex-col border-l-2 border-dashed border-indigo-200/60 pl-4">
                          {lessons.map((subTopic, subIndex) => {
                            const lessonTime = times[subIndex];
                            return (
                              <div
                                key={subIndex}
                                className="group relative flex items-center justify-between gap-2 py-2"
                              >
                                {/* Timeline dot */}
                                <span className="absolute -left-[23px] flex h-3 w-3 items-center justify-center">
                                  <span className={`h-2 w-2 rounded-full bg-slate-300 ring-4 ${theme === 'dark' ? 'ring-[#222121]' : 'ring-white'}`} />
                                </span>

                                <div className="flex min-w-0 items-center gap-2">
                                  {subIndex === 0 ? (
                                    <PlayCircleOutlineIcon className="!shrink-0 !text-[16px] !text-indigo-500" />
                                  ) : subIndex === 1 ? (
                                    <ArticleIcon className="!shrink-0 !text-[16px] !text-amber-500" />
                                  ) : (
                                    <QuizIcon className="!shrink-0 !text-[16px] !text-emerald-500" />
                                  )}
                                  <span className={`truncate text-[12px] font-medium transition-colors ${
                                    theme === 'dark' ? 'text-[#e1dede]/80' : 'text-slate-600'
                                  }`}>
                                    {subTopic}
                                  </span>
                                </div>

                                <span className="shrink-0 text-[11px] font-medium text-slate-400">
                                  {lessonTime}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-10 ${theme === 'dark' ? 'border-white/10 text-[#e1dede]/50' : 'border-slate-200 text-slate-400'}`}>
                <MenuBookIcon className="!text-[24px] !text-indigo-300" />
                <p className="m-0 text-xs font-medium italic">Loading syllabus...</p>
              </div>
            )}
          </div>


          {/* ── MEET YOUR INSTRUCTOR ── */}
          <div className={`px-4 pt-4 pb-3 ${theme === 'dark' ? 'bg-[#252424]' : 'bg-gray-50 border-b border-gray-100'} transition duration-500`}>
            <h2 className={`text-md font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}  mb-3`}>Meet Your Instructor</h2>

            <div className="flex items-start gap-3">
              <AvatarGroup max={1}>
                <Avatar src={course.avatar} sx={{ width: 52, height: 52, fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg,#6366f1,#818cf8)", flexShrink: 0 }} />
              </AvatarGroup>
              <div>
                <p className={`text-md font-bold ${theme === 'dark' ? 'text-[#e5e5e6]' : 'text-gray-900'} `}>{course.instructorName}</p>
                <p className="text-sm font-medium text-gray-500">{course.businessCategory}</p>
              </div>
            </div>

            <p className={`text-sm font-medium text-gray-500 leading-relaxed mt-3`}>{course.aboutInstructor}</p>
          </div>
          
          <div className="grid col-span-2 px-2 mt-12">
            <h2 className={`mb-6 text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
              Write a Review
            </h2>

            <div className={`max-w-220 w-full rounded-2xl p-6 shadow-md shadow-slate-400 ${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-700'}`}>
                  Your rating:
                </span>
                <Rating
                  value={reviewRating}
                  onChange={(_, v) => setReviewRating(v)}
                  precision={1}
                  sx={{ fontSize: 30, color: "#EAB308" }}
                />
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this course..."
                rows={4}
                className={`w-full rounded-xl border p-4 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200 ${
                  theme === 'dark'
                    ? 'bg-[#1a1919] border-white/10 text-[#e1dede] placeholder:text-[#e1dede]/40'
                    : 'bg-white border-slate-200 text-gray-800'
                }`}
              />

              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className={`mt-4 rounded-xl px-6 py-3 text-base font-semibold text-white transition ${
                  submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>

            {/* User reviews list */}
            {userReviews && userReviews.length > 0 && (
              <div className="max-w-220 w-full mt-8 flex flex-col gap-4">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
                  Recent Student Reviews
                </h3>
                {userReviews.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-2xl p-5 shadow-md shadow-slate-300 ${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar src={r.avatar} sx={{ width: 48, height: 48 }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>
                            {r.studentName}
                          </h4>
                          <Rating value={Number(r.rating)} readOnly size="small" sx={{ color: "#EAB308" }} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{r.comment}</p>
                        {r.createdAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {courseStatus === "upcoming" ? "Coming Soon" : isPurchased(course.id) ? "Owned" : isInCart(course.id) ? 'In cart' : 'Add to Cart'}
            </Button>
          </div>

        </div>))
      }
{isLargeDevices &&
studentReviews.filter((review) => String(review.id) === String(course.id)).map((review) => {
return discountPrices.filter((discount) => String(discount.id) === String(course.id)).map((discount) =>
<div key={discount.id}>
  <main className={`py-21 transition duration-500 ${theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'}`}>
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-3 grid justify-center grid-cols-3 text-left">

        {/* Thumbnail */}
        <div className="max-w-xl xl:max-w-3xl mb-20 mt-10 col-span-2">
          <h2 className={`text-5xl xl:text-6xl font-bold mb-5 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
            {course.title}
          </h2>
          
          <div className="flex gap-4 pb-7">
          <div className="flex gap-1 items-center">
              <PiUsersBold className={`size-10 rounded-full shadow-md shadow-indigo-400 bg-[#563fec] p-2 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-white'}`} />
              <p className={`text-[23px] tracking-tighter font-medium ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
                {course.studentsCount} Students enrolled
              </p>
            </div>
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
                sx={{ fontSize: 40 }}
              />
              <p className={`font-semibold text-[23px] ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
                {course.rating}
              </p>
              <p className={`font-semibold text-[23px] ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>({review.totalReviews} Review)</p>
            </div>
            </div>
            <div>
              <p className={`text-xl font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/70'}`}>Course is openning: {course.startDate}</p>
              <p className={`text-xl font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/70'}`}>Course is closing: {course.endDate}</p>
            </div>
          <iframe src={`https://www.youtube.com/embed/${course.previewVideoId}`} className="w-full mb-8 shadow-md mt-11 h-96 xl:h-114 rounded-2xl"></iframe>
          
          <p className={`text-md p-6 xl:text-lg mb-4 font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/70'}`}>
            {description?.courseDescription}
          </p>
        {/* Course Syllabus */}
        <div className="course-syllabus mx-auto mt-14 max-w-[820px]">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className={`mt-1 text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-[#e1dede]' : 'text-[#0f0f23]'}`}>
                Course Syllabus
              </h2>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${theme === 'dark' ? 'bg-[#2a2929] text-[#e1dede]/80' : 'bg-indigo-50 text-indigo-600'}`}>
              {topics.length} modules
            </span>
          </div>

          {lessonSyllabus?.id ? (
            <div className="flex flex-col gap-4">
              {topics.map((topic, index) => {
                const lessons = Object.values(topic.lesson_syllabus);
                const times = Object.values(topic.lessonsTime);

                const totalTopicTime =
                  times.reduce((sum, t) => sum + (parseInt(t) || 0), 0) + 'h';

                return (
                  <Accordion
                    key={index}
                    disableGutters
                    className={`!rounded-2xl !shadow-none before:!hidden transition! duration-500! ${
                      theme === 'dark'
                        ? '!bg-[#222121] !border !border-white/5'
                        : '!bg-white !border !border-slate-100'
                    }`}
                    sx={{
                      transition: 'all .25s ease',
                      '&:hover': { boxShadow: '0 12px 30px -12px rgba(99,102,241,.35)' },
                      '&.Mui-expanded': { borderColor: 'rgba(99,102,241,.45)' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                          <ExpandMoreIcon className="!text-[20px]" />
                        </div>
                      }
                      className="!px-5 !py-4"
                    >
                      <div className="flex w-full items-center gap-4 pr-3">
                        {/* Step number */}
                        <div className="relative shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black text-white shadow-lg shadow-indigo-500/30">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <Typography className={`!text-[17px] !font-bold !leading-tight ${theme === 'dark' ? '!text-[#e1dede]' : '!text-[#0f0f23]'}`}>
                            {topic.title}
                          </Typography>
                          <div className="mt-2 flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400">
                              <PlayCircleOutlineIcon className="!text-[15px] !text-indigo-400" />
                              {lessons.length} lessons
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400">
                              <AccessTimeIcon className="!text-[15px] !text-violet-400" />
                              {totalTopicTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionSummary>

                    <AccordionDetails className="!px-5 !pb-5 !pt-0">
                      <div className="ml-6 flex flex-col border-l-2 border-dashed border-indigo-200/60 pl-6">
                        {lessons.map((subTopic, subIndex) => {
                          const lessonTime = times[subIndex];
                          return (
                            <div
                              key={subIndex}
                              className="group relative flex items-center justify-between gap-3 py-3"
                            >
                              {/* Timeline dot */}
                              <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center">
                                <span className={`h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ${theme === 'dark' ? 'ring-[#222121]' : 'ring-white'}`} />
                              </span>

                              <div className="flex min-w-0 items-center gap-3">
                                {subIndex === 0 ? (
                                  <PlayCircleOutlineIcon className="!shrink-0 !text-[19px] !text-indigo-500" />
                                ) : subIndex === 1 ? (
                                  <ArticleIcon className="!shrink-0 !text-[19px] !text-amber-500" />
                                ) : (
                                  <QuizIcon className="!shrink-0 !text-[19px] !text-emerald-500" />
                                )}
                                <span className={`truncate text-[14px] font-medium transition-colors ${
                                  theme === 'dark' ? 'text-[#e1dede]/80 group-hover:text-[#e1dede]' : 'text-slate-600 group-hover:text-indigo-600'
                                }`}>
                                  {subTopic}
                                </span>
                              </div>

                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-[12px] font-medium text-slate-400">
                                  {lessonTime}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-14 ${theme === 'dark' ? 'border-white/10 text-[#e1dede]/50' : 'border-slate-200 text-slate-400'}`}>
              <MenuBookIcon className="!text-[28px] !text-indigo-300" />
              <p className="m-0 text-sm font-medium italic">Loading syllabus...</p>
            </div>
          )}
        </div>

 
          {/* Instructor */}
          <h2 className={`text-5xl font-bold mt-16 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>Instructor</h2>
          <div className={`${theme === 'dark' ? 'text-[#e1dede] bg-[#313131]/60' : 'text-black bg-[#ffffff]'} shadow-md duration-500 transition mt-8 max-w-xl xl:max-w-3xl w-full px-10 py-7 rounded-2xl flex flex-col items-start gap-2`}>
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
          <div className={`${theme === 'dark' ? 'bg-[#313131]/60' : 'bg-[#ffffff]'} sticky top-28 duration-500 transition shadow-md h-fit px-9 py-11 rounded-2xl space-y-4 mb-3`}>
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
              className={`${isPurchased(course.id) || courseStatus === "locked" ? 'bg-gray-600 hover:cursor-not-allowed' : 'bg-[#2f71f7] hover:bg-[#224ea6] hover:cursor-pointer'} rounded-xl py-5 w-full text-white text-2xl xl:text-3xl font-semibold transition`}>
              {courseStatus === "locked" ? "Locked" : courseStatus === "upcoming" ? "Coming Soon" : isPurchased(course.id) ? 'Owned' : isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
            </button>
            <hr className={`${theme === 'dark' ? 'text-[#e1dede]/40' : 'text-black/20'} `} />
            
            {/* Guarantee card */}
            <div className={`flex flex-col items-center rounded-xl shadow-md py-5 transition  duration-500 ${theme === 'dark' ? 'text-[#e1dede] bg-[#222121] ' : 'text-black bg-[#EFF4FF] '}`}>
              <h2 className="text-md font-semibold mb-2">30-Day Money-Back Guarantee</h2>
              <div className={`flex text-5xl gap-4 transition ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-black/60'}`}>
                <AiOutlineSafetyCertificate />
                <PiMoneyLight />
                <MdLockOutline />
              </div>
            </div>
          </div> 
        </div>
        
      </div>
      {/* ── WRITE A REVIEW + USER REVIEWS ── */}
      <div className="grid col-span-2 px-12 mt-12">
        <h2 className={`mb-6 text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
          Write a Review
        </h2>

        <div className={`max-w-220 w-full rounded-2xl p-6 shadow-md transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/80' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-700'}`}>
              Your rating:
            </span>
            <Rating
              value={reviewRating}
              onChange={(_, v) => setReviewRating(v)}
              precision={1}
              sx={{ fontSize: 30, color: "#EAB308" }}
            />
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this course..."
            rows={4}
            className={`w-full rounded-xl border duration-500 p-4 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200 ${
              theme === 'dark'
                ? 'bg-[#1a1919] border-white/10 text-[#e1dede] placeholder:text-[#e1dede]/40'
                : 'bg-white border-slate-200 text-gray-800'
            }`}
          />

          <button
            onClick={handleSubmitReview}
            disabled={submitting}
            className={`mt-4 rounded-xl px-6 py-3 text-base font-semibold text-white transition ${
              submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* User reviews list */}
        {userReviews && userReviews.length > 0 && (
          <div className="max-w-220 w-full mt-8 flex flex-col gap-4">
            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-black'}`}>
              Recent Student Reviews
            </h3>
            {userReviews.map((r) => (
              <div
                key={r.id}
                className={`rounded-2xl p-5 shadow-md transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/80' : 'bg-white'}`}
              >
                <div className="flex items-start gap-4">
                  <Avatar src={r.avatar} sx={{ width: 48, height: 48 }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>
                        {r.studentName}
                      </h4>
                      <Rating value={Number(r.rating)} readOnly size="small" sx={{ color: "#EAB308" }} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{r.comment}</p>
                    {r.createdAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
   </main>

  {/* Footer */}
   <Footer />
   </div>)
   })}
 </div>)
}
export default Details
