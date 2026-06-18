import { Link } from 'react-router'
import { LuShoppingCart } from 'react-icons/lu'
import { routes } from '../route/routes'
import { toast } from 'react-toastify'
import { useCart } from '../store/cartStore'
import { useTheme } from '../context/ThemeContext'

const Cartbutton = () => {
  const {theme} = useTheme()
  const {cart} = useCart()
  const cartLength = cart.length
  const userAuth = JSON.parse(String(localStorage.getItem('user'))) || JSON.parse(String(sessionStorage.getItem('user')))
  const toastError = () => {
    if(!userAuth){
      toast.error('Please create or login your account first')
    } 
    return
  }
  return (
    <Link onClick={toastError} to={!userAuth ? '/login' : routes[6]?.href} className={`p-2 fixed right-5 z-10 ${theme === 'dark' ? 'bg-[#373535]' : 'bg-white'} transition duration-500 rounded-full`}>
      <LuShoppingCart className={`size-9 ${theme === 'dark' ? 'text-white' : 'text-black'}`}/>
      <p className='px-2 rounded-full text-white font-semibold absolute bg-red-400 w-fit'>{cartLength}</p>
    </Link>
  )
}

export default Cartbutton