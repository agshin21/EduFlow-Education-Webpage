import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'
import { useCart } from '../store/cartStore'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { usePurchased } from '../store/purchasedStore'

export default function Alertbutton() {
  const {addPurchased} = usePurchased()
  const {theme} = useTheme()
  const {cart, clearCart} = useCart()
  const [isOpen, setIsOpen] = useState(false)  
  
  const handleButtonClick = () => {
    toast.success('Payment was completed successfully')
    setIsOpen(false)
    addPurchased(cart)
    clearCart() 
  }
  
  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }
 
  return (
    <>
      <Button
        onClick={open}
        className="w-full bg-blue-600 text-white px-2 py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600 hover:cursor-pointer"
      >
         Checkout <ArrowRight size={20} />
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/20 transition">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className={`w-full max-w-md rounded-xl ${theme === 'dark' ? 'bg-[#222121]/30' : 'bg-[#f1f5fc]/30'}  p-6 backdrop-blur-xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0`}
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-gray-500">
                Alert
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-gray-500">
                Do you want confirm the payment?
              </p>
              <div className="mt-4 flex gap-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-blue-800 transition data-open:bg-gray-700"
                  onClick={handleButtonClick}
                  
                >
                  Confirm
                </Button>
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-700 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-white/60 transition data-open:bg-gray-700"
                  onClick={close}
                >
                  Cancel
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
