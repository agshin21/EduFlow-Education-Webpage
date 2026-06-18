import { createJSONStorage, persist } from 'zustand/middleware'

import type { CartItem } from '../@types/types'
import { create } from 'zustand'

interface PurchasedState {
  purchased: CartItem[]
  addPurchased: (items: CartItem[]) => void
  clearPurchased: () => void
}

const getCurrentUserId = (): string => {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (!raw) return 'guest'
  try {
    return String(JSON.parse(raw).id ?? 'guest')
  } catch {
    return 'guest'
  }
}

export const usePurchased = create<PurchasedState>()(
  persist(
    (set, get) => ({
      purchased: [],
      addPurchased: (items) =>
        set({
          purchased: [
            ...get().purchased,
            ...items.filter(
              (item) => !get().purchased.some((c) => c.id === item.id)
            ),
          ],
        }),
      clearPurchased: () => set({ purchased: [] }),
    }),
    {
      name: 'purchased-courses',
      storage: createJSONStorage(() => ({
        getItem: (name) =>
          localStorage.getItem(`${name}_${getCurrentUserId()}`),
        setItem: (name, value) =>
          localStorage.setItem(`${name}_${getCurrentUserId()}`, value),
        removeItem: (name) =>
          localStorage.removeItem(`${name}_${getCurrentUserId()}`),
      })),
    }
  )
)
