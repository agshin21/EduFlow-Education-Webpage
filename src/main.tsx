import './index.css'

import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Cart from './pages/Cart.tsx'
import Courses from './pages/Courses.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Details from './pages/Details.tsx'
import Home from './pages/Home.tsx'
import Learning from './pages/Learning.tsx'
import Login from './pages/Login.tsx'
import MyCourses from './pages/Mycourses.tsx'
import NavbarC from './components/Navbar.tsx'
import Register from './pages/Register.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { ToastContainer } from 'react-toastify'
import { createRoot } from 'react-dom/client'
import { routes } from './route/routes.ts'
import { useEffect } from 'react'
import { usePurchased } from './store/purchasedStore.ts'

const queryClient = new QueryClient()

function Root() {
  useEffect(() => {
    usePurchased.persist.rehydrate()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <ToastContainer
            style={{ position: 'absolute', top: '80px', maxWidth: 280 }}
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <NavbarC />
          <Routes>
            <Route path="/learn/:id" element={<Learning />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path={routes[3]?.href} element={<Login />} />
            <Route path={routes[4]?.href} element={<Register />} />
            <Route path={routes[2]?.href} element={<Dashboard />} />
            <Route path={routes[0]?.href} element={<Home />} />
            <Route path={routes[1]?.href} element={<Courses />} />
            <Route path={`${routes[6]?.href}/:id`} element={<Details />} />
            <Route path={routes[5]?.href} element={<Cart />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
