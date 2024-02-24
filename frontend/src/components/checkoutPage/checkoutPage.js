import { useContext } from 'react'
import { ForwardDataContext } from '../onlyForwarded/onlyForwarded'
import './checkoutPage.css'
import { Navigate } from 'react-router-dom'

export default function CheckoutPage () {
    const cart = useContext(ForwardDataContext)
    console.log(cart)
    if (cart) {
        return (
            <div id="checkoutPage">
                <h3>checkout</h3>
            </div>
        )
    }
    return (
        <Navigate to='/' replace/>
    )
}