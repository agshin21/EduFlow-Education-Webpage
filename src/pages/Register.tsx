import { Link, useNavigate } from 'react-router-dom'
import React, {useState} from 'react'

import { registerUser, type RegisterData } from '../services/authService'
import { routes } from '../route/routes';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Register: React.FC = () => { 
  const {theme} = useTheme()
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isShortPassword = formData.password.length < 8
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    if(isShortPassword) {
      setError("Password must be at least 8 characters!")
      toast.error("Password must be at least 8 characters!")
      return
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter correct email address");
      toast.error("Please enter correct email address")
      return;
    }
    try {
      await registerUser(formData);
      toast.success("Registration been successful!");
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[url('src/assets/bg-img.jpg')] bg-no-repeat">
          
          {/* Dark Mode Overlay */}
          <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'dark' ? 'bg-black/60' : 'bg-transparent'}`} />
    
          {/* Grid Container */}
          <div className={`relative z-10 flex w-fit min-w-xs sm:min-w-md max-w-4xl overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
              theme === 'dark' ? 'bg-gray-900/50 text-white' : 'bg-white/20 text-gray-900'
            }`}>
            
            {/* Left Column */}
            <div className="flex w-full flex-col justify-center p-8 sm:p-12 lg:w-1/2">
              <div className="mx-auto w-full max-w-sm">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Please enter your details to sign in.
                </p>
    
                <form className=" space-y-6 pt-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider">Name</label>
                      <input
                        id='name'
                        type="text"
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="Enter your Name"
                        className={`mt-1 block w-full rounded-lg border px-4 py-2.5 outline-none transition focus:ring-2 ${
                          theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider">Surname</label>
                      <input
                        id='surname'
                        type="text"
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Enter your Surname"
                        className={`mt-1 block w-full rounded-lg border px-4 py-2.5 outline-none transition focus:ring-2 ${
                          theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider">Email</label>
                      <input
                        id='email'
                        type="email"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter your email"
                        className={`mt-1 block w-full rounded-lg border px-4 py-2.5 outline-none transition focus:ring-2 ${
                          theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20'
                        }`}
                      />
                    </div>
    
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider">Password</label>
                      <input
                        id='password'
                        type="password"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                        className={`mt-1 block w-full rounded-lg border px-4 py-2.5 outline-none transition focus:ring-2 ${
                          theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20'
                        }`}
                      />
                    </div>
                  </div>
    
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign in
                  </button>
                </form>
    
                <p className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Link to={routes[3]?.href} className="font-semibold text-blue-600 hover:text-blue-500">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
    
            {/* Right Column */}
            <div className="hidden w-1/2 flex-col items-center justify-center bg-linear-to-br from-[#020024] via-[#090979] to-[#006aff]  p-12 text-center text-white lg:flex relative overflow-hidden">
               <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl"></div>
               <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl"></div>
               
               <div className="relative z-10">
                 <h2 className="text-4xl font-bold">Start Your Journey</h2>
                 <p className="mt-4 text-blue-100">Explore our courses and boost your skills today.</p>
               </div>
            </div>
          </div>
        </div>
  )
}


export default Register