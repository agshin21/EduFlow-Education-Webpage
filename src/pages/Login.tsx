import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import { loginUser } from '../services/authService'
import { routes } from '../route/routes';
import { toast } from 'react-toastify';
import { usePurchased } from '../store/purchasedStore';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const {theme} = useTheme()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      await loginUser(email, password, rememberMe);
      await usePurchased.persist.rehydrate()
      toast.success("Login was completed successful!");
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      console.error(error)
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[url('/bg-img.jpg')] bg-no-repeat">
      {/* Dark Mode Overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'dark' ? 'bg-black/60 backdrop-blur-md' : 'backdrop-blur-md bg-transparent'}`} />

      {/* Grid Container */}
      <div className={` relative z-10 flex max-w-xs w-full mt-15 sm:max-w-lg  lg:max-w-4xl xl:max-w-5xl h-118 sm:h-150 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl transition duration-500 ${
          theme === 'dark' ? 'bg-gray-900/30 text-white' : 'bg-white/10 text-gray-900'
        }`}>
        {/* Left Column */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-12 lg:w-1/2">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl lg:text-4xl font-bold">Welcome back</h1>
            <p className={`mt-2 text-sm lg:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Please enter your details to sign in.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleLogin} noValidate>
              <div className="space-y-4">
                <div>
                  <label className="block text-md font-semibold uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`mt-1 block w-full rounded-lg border placeholder:text-lg px-4 py-2.5 outline-none transition duration-500 focus:ring-2 ${
                      theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                        : 'bg-white/50 border-gray-300 transition text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-md font-semibold uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`mt-1 block w-full placeholder:text-lg rounded-lg border px-4 py-2.5 outline-none transition duration-500 focus:ring-2 ${
                      theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                        : 'bg-white/50 border-gray-300  text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="remember" className="ml-1 block text-md">Remember me</label>
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
              Don't have an account?{' '}
              <Link to={routes[5]?.href} className="font-semibold text-blue-600 hover:text-blue-500">
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



export default Login