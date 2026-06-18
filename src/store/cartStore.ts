import type { CartState } from "../@types/types"
import {create} from "zustand"
import {persist} from "zustand/middleware"
import { toast } from "react-toastify";
import { usePurchased } from "./purchasedStore";

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      count: 0,
      addCart: (item) => 
        set((state) => {
          const existing = state.cart.find((course) => String(course.id) === String(item.id));
            if(existing) {
              return {
                count: state.count,
                cart: state.cart.map((course) => 
                  String(course.id) !== String(item.id) ? {...course, quantity: course.quantity} : course 
                ),
              };
            }
            const purchased = usePurchased.getState().purchased
            if(purchased.some((course) => String(course.id) === String(item.id))){
              toast.error("This course already in dashboard!")
              return {
                count: state.count,
                cart: state.cart
              }
            }
  
            return {
              count: state.count + 1,
              cart:[...state.cart, {...item, quantity: 1}],
            }
        }),
      removeCart: (id) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === id);
            if(!existing) return state;
            if(existing.quantity > 1) {
              return {
                count: state.count - 1,
                cart: state.cart.map((course) =>
                  course.id === id ? {...course, quantity: course.quantity - 1} : course
                ),
              };
            }
            return {
              count: state.count === 0 ? state.count : state.count - 1,
              cart: state.cart.filter((i) => i.id !== id)   
            }
        }),
        clearCart: () => set({cart: [], count: 0}),
    }),
    {name: 'cart-storage'}    
  )
)