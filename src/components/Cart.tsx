import { ShoppingBag, Trash2 } from 'lucide-react';

import Alertbutton from './Alertbutton';
import Footer from './Footer';
import { Link } from 'react-router';
import { routes } from '../route/routes';
import { useCart } from '../store/cartStore';
import { useShallow } from 'zustand/react/shallow'
import { useTheme } from '../context/ThemeContext';

export default function CartPage() {
  const {theme} = useTheme()
  const {cart} = useCart(useShallow((state) => ({cart: state.cart})))
  const { removeCart } = useCart();
  const numberOfCartItems = cart.length
  // Calculations
  const originalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountedTotal = cart.reduce((sum, item) => {
    const num = 0
    const price = item.discountPrice;
    return sum + Number(price ?? num) * (item.quantity ?? 0);
  }, 0);
  const differentOfTotals = cart.reduce((sum) => 
    sum + discountedTotal / numberOfCartItems - originalTotal / numberOfCartItems
  , 0)


  if (cart.length === 0) {
    return (
      <div>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1919]' : 'bg-gray-50'} transition duration-500 flex flex-col items-center justify-center p-4`}>
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
        <Link to={routes[1]?.href} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Start Shopping
        </Link>
      </div>
      <Footer />
      </div>
    );
  }

  return (
   <div>
   <div className={`min-h-screen transition duration-500 ${theme === 'dark' ? 'bg-[#1a1919]' : 'bg-[#f1f5fc]'} pb-24 md:pb-8`}>
      <div className="max-w-7xl mx-auto pt-24 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN (Items & Related) */}
        <div className="lg:col-span-2 space-y-6">
          
          <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'} flex items-center gap-2`}>
            <ShoppingBag className="text-blue-600" />
            Shopping Cart <span className="text-gray-400 text-lg font-normal">({cart.length} items)</span>
          </h1>
          {/* Cart Items List */}
          <div className={`${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} transition duration-500 rounded-2xl shadow-sm p-4 md:p-6 space-y-6`}>
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                
                <div className="w-full sm:max-w-64 max-h-40 sm:max-h-40 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                     <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'}  text-lg`}>{item.title}</h3>
                    <button onClick={() => removeCart(item.id)} className="text-red-500 p-2 bg-red-50 rounded-full sm:hidden">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex gap-3 text-sm mt-1 mb-3">
                    <p className={`${theme === 'dark' ? 'text-[#e1dede]/60' : 'text-black'}`}>{item.description}</p>
                  </div>

                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className={`flex items-center gap-3 transition ${theme === 'dark' ? 'bg-[#5f5e5e]' : 'bg-gray-100'} rounded-lg p-1`}>
                      <span className={`w-6 text-center ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-700'} font-bold `}>{item.quantity}</span>
                    </div>
                    
                    <div className="text-center sm:text-right">
                      <span className="text-xs text-gray-500 block sm:hidden">Total</span>
                      <span className={`text-lg font-bold ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-gray-700'}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                
                <button onClick={() => removeCart(item.id)} className="hidden sm:block text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN (Desktop Summary Card) */}
        <div className="hidden lg:block mt-14 lg:col-span-1">
          <div className={`sticky top-8 transition duration-500 ${theme === 'dark' ? 'bg-[#222121]' : 'bg-white'} rounded-2xl shadow-lg p-6 `}>
            <h2 className={`${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-800'} text-lg font-bold  mb-6`}>Order Summary</h2>
            <div className={`flex justify-between font-semibold ${theme === 'dark' ? 'text-[#e1dede]/60' : 'text-black/50'}`}>
              <h2>Original Price</h2>
              <p>${discountedTotal.toFixed(2)}</p>
            </div>
            <div className={`flex justify-between font-semibold ${theme === 'dark' ? 'text-[#e1dede]/60' : 'text-black/50'}`}>
              <h2>Discounts</h2>
              <p>-${differentOfTotals.toFixed(2)}</p>
            </div>
            <div className="space-y-4">
              <div className="border-t pt-4 flex justify-between items-center">
                <span className={`text-lg font-bold ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-800'}`}>Total Amount</span>
                <span className="text-3xl font-bold text-blue-600">${originalTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <Alertbutton />
            </div>
          </div>
        </div>

      </div>
        <div>
        </div>    
      {/* MOBILE STICKY BOTTOM BAR (Hidden on Desktop) */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-[#212122]/60' : 'bg-white/60'} backdrop-blur-xl duration-500 transition border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Amount</span>
            <span className="text-xl font-bold text-blue-600">${originalTotal.toFixed(2)}</span>
          </div>
          <div className="text-right">
             <span className="block text-xs text-gray-400 line-through">${discountedTotal.toFixed(2)}</span>
          </div>
        </div>
       <Alertbutton/>
      </div>
    </div>
    <Footer/>
    </div>
  );
}   