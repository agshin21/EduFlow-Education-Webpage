import type { CartState } from "../@types/types"
import {create} from "zustand"
import {persist} from "zustand/middleware"

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      count: 0,
      addCart: (item) => 
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
            if(existing) {
              return {
                count: state.count + 1,
                cart: state.cart.map((i) => 
                  i.id === item.id ? {...i, quantity: i.quantity + 1} :i
                ),
              };
            }
            return {
              count: state.count + 1,
              cart:[...state.cart, {...item, quantity: 1}],
            };
        }),
      removeCart: (id) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === id);
            if(!existing) return state;
            if(existing.quantity > 1) {
              return {
                count: state.count - 1,
                cart: state.cart.map((i) =>
                  i.id === id ? {...i, quantity: i.quantity - 1} : i
                ),
              };
            }
            return {
              count: state.count - 1,
              cart: state.cart.filter((i) => i.id !== id)   
            }
        }),
        clearCart: () => set({cart: [], count: 0}),
    }),
    {name: 'cart-storage'}    
  )
)