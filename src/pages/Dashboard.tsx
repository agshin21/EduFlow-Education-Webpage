import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import CircularIndeterminate from '../components/Progressbar';
import Footer from '../components/Footer';
import { Line } from 'react-chartjs-2';
import type { StatusInput } from '../@types/types';
import gsap from 'gsap';
import { logoutUser } from '../services/authService';
import { useProgress } from '../store/progressStore';
import { usePurchased } from '../store/purchasedStore';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}
const Dashboard: React.FC = () => {
  const isCourseCompleted = useProgress((s) => s.isCourseCompleted);
  const {purchased} = usePurchased()
  const titleRef = useRef(null)
  const statsRef = useRef(null)
  const chartRef = useRef(null)
  const tableRef = useRef(null)
  const enrolledRef = useRef(null)
  const location = useLocation()
  const {theme} = useTheme()
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  


  const isPurchased = (id?: number | string) => {
    return purchased.some((item) => String(item.id) === String(id))
  }
  
  const getCourseStatus = (course: StatusInput): string => {
    const today = new Date().setHours(0, 0, 0, 0);
    const startDateRaw = new Date(course.startDate)
    const endDateRaw = new Date(course.endDate)
    const startDate = isNaN(startDateRaw.getTime()) ? today : startDateRaw.setHours(0, 0, 0, 0);
    const endDate = isNaN(endDateRaw.getTime()) ? today : endDateRaw.setHours(0, 0, 0, 0);  
    const owned = isPurchased(course.id);
  
    if (owned) {
      if (isCourseCompleted(String(course.id))) return "completed";
      return "active";
    }

  
   
    if (today > endDate) return "locked";   
    if (today < startDate) return "upcoming";
    return "active";
  };

  useEffect(() => {
    const allElements = document.querySelectorAll<HTMLElement>(".transition");
    allElements.forEach(el => el.style.transition = "none")
    if(titleRef.current){
    gsap.fromTo(
      titleRef.current,
      {y: -80, opacity: 0},
      {y: 0, opacity: 1, duration: 0.7, ease: "power2.out"}
    );}

    
    if(statsRef.current){
    gsap.fromTo(
      statsRef.current,
      {y: -80, opacity: 0},
      {y: 0, opacity: 1, duration: 0.4, ease: "power2.out"}
    );}

    if(chartRef.current){
    gsap.fromTo(
      chartRef.current,
      {y: -80, opacity: 0},
      {y: 0, opacity: 1, duration:0.4, ease: "power2.out"}
    );}

    if(tableRef.current){
    gsap.fromTo(
      tableRef.current,
      {y: -80, opacity: 0},
      {y: 0, opacity: 1, duration: 0.4, ease: "power2.out"}
    );}

    if(enrolledRef.current){
    gsap.fromTo(
      enrolledRef.current,
      {y: -80, opacity: 0},
      {y: 0, opacity: 1, duration: 0.7, ease: "power2.out"}
    );}
    allElements.forEach(el => el.style.transition = "")
  }, [location.key])
   
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  const purchasedWithStatus = useMemo(() => {
  return purchased.map((course) => ({
    ...course,
    status: getCourseStatus(course),
  }));
}, [purchased, isCourseCompleted]);


  if(!user) return <div className={`flex ${ theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'} items-center justify-center h-screen text-gray-700`}><CircularIndeterminate /></div>
  

  const totalHours = purchasedWithStatus.reduce((acc, curr) => acc + Number(curr.totalTime), 0);
const completedCourses = purchasedWithStatus.filter((course) => course.status === 'completed').length;
const activeCourses = purchasedWithStatus.filter((course) => course.status === 'active').length;
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lesson hours',
        data: [12, 13, 16, 14, 18, 12],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.5,
        labelColor: '#e1dede',
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e1dede' : '#000000'
        } 
      },
      title: { display: true, 
        text: 'Yearly Education Activity', 
        color: theme === 'dark' ? '#e1dede' : '#000000' },
    },
    scales: {
      x: {
        ticks: {
         color: theme === 'dark' ? '#e1dede' : '#000000'}
      }, 
      y: {
        ticks: {
          color: theme === 'dark' ? '#e1dede' : '#000000'}
      }
    }
  };

 
  return (
    <div>
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1919]' :'bg-[#f1f5fc]'} duration-500 transition p-6 font-sans`}>
      {/* Header */}
      <div  className="flex justify-between mt-14 items-center mb-8">
        <div ref={titleRef}>
          <h1 className={`${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'} text-3xl font-bold`}>Student Dashboard</h1>
          <p className={`${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-600'} mt-1 font-medium`}>
            Welcome, <strong className="text-blue-600">{user?.firstName || 'User'}</strong>!
          </p>
        </div>
        <div className='flex sm:flex-wrap items-center gap-2'>
        <div className='px-3 py-1 text-slate-300 rounded-full uppercase text-2xl bg-green-800'>{user.firstName?.charAt(0)}</div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 font-semibold text-base sm:text-xl bg-red-500 hover:bg-red-600 text-white rounded-md shadow transition"
        >
          Logout
        </button>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="grid transition duration-500 grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} duration-500 transition p-6 rounded-lg shadow-md border-l-4 border-blue-500`}>
          <h3 className={`${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'} text-sm font-semibold uppercase`}>Active Courses</h3>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-800'}  mt-2`}>{activeCourses}</p>
        </div>
        <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} duration-500 transition p-6 rounded-lg shadow-md border-l-4 border-green-500`}>
          <h3 className={`${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'}  text-sm font-semibold uppercase`}>Completed Courses</h3>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-800'}  mt-2`}>{completedCourses}</p>
        </div>
        <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} duration-500 transition p-6 rounded-lg shadow-md border-l-4 border-yellow-500`}>
          <h3 className={`${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'}  text-sm font-semibold uppercase`}>Total Lesson Time</h3>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-800'}  mt-2`}>{totalHours}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Chart.js */}
        <div ref={chartRef} className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} transition duration-500 p-6 rounded-lg shadow-md`}>
          <Line data={chartData} options={chartOptions}/>
        </div>
      </div>

      {/* Course list */}
      <div ref={enrolledRef} className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} transition duration-500 p-6 rounded-lg shadow-md`}>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'} mb-4`}>My Enrolled Courses</h3>
        <div className="grid gap-4">
          {purchasedWithStatus.length === 0 && (<p className={`flex justify-center font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/50'} `}>Course Not Found</p>)}
          {purchasedWithStatus.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-lg transition"
            >
              <div>
                <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'}`}>{course.title}</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'} mt-1`}>
                  {course.startDate} — {course.endDate} | Total: <span className={`font-medium ${theme === 'dark' ? 'text-[#cbcbcb]' : 'text-gray-800'}`}>{course.totalTime} hours</span>
                </p>
              </div>
              <span className={`${course.status === 'completed' && styles.completed || 
              course.status === 'active' && styles.active}`}>
                {course.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};


const styles = {
  completed: "mt-2 sm:mt-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
  active: "mt-2 sm:mt-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
}
export default Dashboard;   