import { useState, createContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import './index.css';
import Popup from './components/popup/popup';
import Header from './components/header/header';
import Footer from './components/footer/footer'

export const CartQuantityContext = createContext()
export const CartContext = createContext()
export const MessageContext = createContext()

export default function AppContainer() {
  const [cookie, setCookie] = useCookies()
  const [cartQuantity, setCartQuantity] = useState(0)
  const [cart, setCart] = useState(!cookie.cart ? { cartItems: [], totalQuantity: 0 } : cookie.cart)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!cookie.cart) setCookie('cart', [], {maxAge: 60*60*24*3})
    else {
        let quantity = 0
        cookie.cart.forEach(item => {
            quantity += item.quantity
        })
        setCartQuantity(quantity)
        setCart(cookie.cart)
    }
  }, [cookie.cart])

  return (
    <CookiesProvider>
      <CartQuantityContext.Provider value={[cartQuantity, setCartQuantity]}>
        <CartContext.Provider value={[cart, setCart]}>
          <Popup message={ message }/>
          <MessageContext.Provider value={ [message, setMessage] }>
            <Header />
            <Outlet />
            <Footer />
          </MessageContext.Provider>
        </CartContext.Provider>
      </CartQuantityContext.Provider>
    </CookiesProvider>
  );
}