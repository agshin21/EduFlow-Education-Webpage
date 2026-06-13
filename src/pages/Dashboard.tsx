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
import React, { useEffect, useState } from 'react';

import CircularIndeterminate from '../components/Progressbar';
import Footer from '../components/Footer';
import { Line } from 'react-chartjs-2';
import { logoutUser } from '../services/authService';
import { purchasedCourses } from '../components/Alertbutton';
import { useNavigate } from 'react-router-dom';
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

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

const Dashboard: React.FC = () => {
  const {theme} = useTheme()
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
const status = () => {
  const today = new Date().setHours(0, 0, 0, 0);

  purchasedCourses.forEach((item) => {
    const startDate = new Date(item.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(item.endDate).setHours(0, 0, 0, 0);

    if (endDate < today) {
      item.status = 'completed';
    } else if (startDate > today) {
      item.status = 'upcoming';
    } else {
      item.status = 'active';
    }
  });
};

status();   
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


  if(!user) return <div className={`flex ${ theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'} items-center justify-center h-screen text-gray-700`}><CircularIndeterminate /></div>
  

  const totalHours = purchasedCourses.reduce((acc, curr) => acc + Number(curr.totalTime), 0);
  const completedCourses = purchasedCourses.filter((purchased) => purchased.status === 'completed').length
  const activeCourses = purchasedCourses.filter((purchased) => purchased.status === 'active').length
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lesson hours',
        data: [12, 19, 15, 20, 24, 18],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        labelColor: '#e1dede'
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
      <div className="flex justify-between mt-14 items-center mb-8">
        <div>
          <h1 className={` ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'} text-3xl font-bold`}>Student Dashboard</h1>
          <p className={`${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-600'} mt-1 font-medium`}>
            Welcome, <strong className="text-blue-600">{user?.firstName || 'User'}</strong>!
          </p>
        </div>
      
        <button
          onClick={handleLogout}
          className="px-5 py-2 font-semibold text-base sm:text-xl bg-red-500 hover:bg-red-600 text-white rounded-md shadow transition"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart.js */}
        <div className={` ${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} duration-500 transition p-6 rounded-lg shadow-md`}>
          <Line data={chartData} options={chartOptions}/>
        </div>

        {/* Upcoming lessons */}
        <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} duration-500 transition p-6 rounded-lg shadow-md overflow-hidden`}>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'}  mb-4`}>Upcoming Lessons</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-500 text-sm">
                  <th className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'}`}>Start Date</th>
                  <th className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'}`}>End Date</th>
                  <th className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'}`}>Total time</th>
                  <th className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-500'}`}>Course</th>
                </tr>
              </thead>
              <tbody>
                {purchasedCourses.filter((course) => course.status === 'upcoming').map((course) => (
                  <tr key={course.id} className="border-b font-medium border-gray-50 hover:bg-gray-50">
                    <td className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>{course.startDate}</td>
                    <td className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>{course.endDate}</td>
                    <td className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>{course.totalTime} Hours</td>
                    <td className={`py-3 px-2 ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>{course.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} duration-500 transition p-6 rounded-lg shadow-md`}>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'} mb-4`}>My Enrolled Courses</h3>
        <div className="grid gap-4">
          {purchasedCourses.length === 0 && (<p className={`flex justify-center font-medium ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-black/50'} `}>Course Not Found</p>)}
          {purchasedCourses.map((course) => (
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
              <span className={course.status === 'completed' && styles.completed || 
              course.status === 'upcoming' && styles.upcoming || 
              course.status === 'locked' && styles.locked || 
              course.status === 'active' && styles.active}>
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
  upcoming: "mt-2 sm:mt-0 bg-orange-200 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
  locked : "mt-2 sm:mt-0 bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
}
export default Dashboard;   