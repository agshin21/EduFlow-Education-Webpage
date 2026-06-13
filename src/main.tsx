import './index.css'

import { BrowserRouter, Route, Routes } from 'react-router'

import Cart from './components/Cart.tsx'
import Courses from './pages/Courses.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Details from './pages/Details.tsx'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import NavbarC from './components/Navbar.tsx'
import Register from './pages/Register.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { ToastContainer } from 'react-toastify'
import { createRoot } from 'react-dom/client'
import { routes } from './route/routes.ts'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
    <ToastContainer
      style={{position: "absolute", top: "80px", maxWidth: 280}} 
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
    <NavbarC/>
    <Routes>
      <Route path={routes[2]?.href} element={<Dashboard />} />
      <Route path={routes[3]?.href} element={<Login/>} />
      <Route path={routes[4]?.href} element={<Register/>} />
      <Route path={routes[0]?.href} element={<Home />}/>
      <Route path={routes[1]?.href} element={<Courses />}/>
      <Route path={`${routes[6]?.href}/:id`} element={<Details />}/>
      <Route path={routes[5]?.href} element={<Cart/>}/>
    </Routes>
    </ThemeProvider>
  </BrowserRouter>
  
)
