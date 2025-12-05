import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'

export interface CartProduct {
  name: string
  images: string[]
  product_code: string
  quantity: number
  price: number 
}

interface Notification {
  visible: boolean
  product: CartProduct
}

interface CartContextType {
  cart: CartProduct[]
  notification?: Notification
  addToCart: (product: CartProduct) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

// ✅ Zod: esquema para validar lo que viene del localStorage
const CartProductSchema = z.object({
  name: z.string(),
  images: z.array(z.string()),
  product_code: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().nonnegative(),
})

const CartSchema = z.array(CartProductSchema)

export function CartProvider({ children }: Props) {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    // En SSR / tests no hay window
    if (typeof window === 'undefined') return []

    const saved = window.localStorage.getItem('cart')
    if (!saved) return []

    try {
      const raw = JSON.parse(saved)
      const parsed = CartSchema.safeParse(raw)

      if (!parsed.success) {
        console.warn('[Cart] invalid data in localStorage, clearing', parsed.error)
        window.localStorage.removeItem('cart')
        return []
      }

      // Los datos ya vienen validados por Zod
      return parsed.data
    } catch (error) {
      console.warn('[Cart] error parsing localStorage, clearing', error)
      window.localStorage.removeItem('cart')
      return []
    }
  })

  const [notification, setNotification] = useState<Notification | undefined>(
    undefined,
  )

  // Persistencia segura del carrito
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
      console.warn('[Cart] error saving to localStorage', error)
    }
  }, [cart])

  const addToCart = (product: CartProduct) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        p => p.product_code === product.product_code,
      )

      if (existingIndex >= 0) {
        // Producto ya existe: sumamos cantidad
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + product.quantity,
          price: product.price, // 👈 actualizar precio por si cambió
        }

        const updatedProduct = updated[existingIndex]
        setNotification({ visible: true, product: updatedProduct })
        setTimeout(() => setNotification(undefined), 3000)

        return updated
      } else {
        // Nuevo producto
        setNotification({ visible: true, product })
        setTimeout(() => setNotification(undefined), 3000)

        return [...prev, product]
      }
    })
  }

  const clearCart = () => setCart([])

  const getTotalItems = () => cart.reduce((acc, p) => acc + p.quantity, 0)

  const getTotalPrice = () =>
    cart.reduce((acc, p) => acc + p.quantity * (p.price ?? 0), 0)

  return (
    <CartContext.Provider
      value={{ cart, notification, addToCart, clearCart, getTotalItems, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}
