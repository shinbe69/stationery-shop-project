import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { showPopup, selectTypeOfPopup } from '../popup/popup'
import { CartQuantityContext, CartContext, MessageContext } from '../../AppContainer'

export default function Product({ product }) {
    const navigate = useNavigate()
    const [message, setMessage] = useContext(MessageContext)
    const [quantity, selectQuantity] = useState(1)
    const [cookie, setCookie, removeCookie] = useCookies()

    function forwardToProduct() {
        navigate('/product', {
            state: product
        })
    }

    function addToCart() {
        cookie.cart.push({id: product._id, quantity})
        let prepareCart = cookie.cart.reduce(mergeCart, [])
        setCookie('cart', prepareCart)
        selectTypeOfPopup('SUCCESS')
        setMessage('Thêm vào giỏ thành công')
        showPopup()
    }

    function mergeCart(accumulator, currentValue) {
        let isMerge = false
        accumulator.forEach((cartItem) => {
          if (currentValue.id === cartItem.id) {
                cartItem.quantity += currentValue.quantity
                isMerge = true
                return
          }
        })
        if (!isMerge)
          accumulator.push(currentValue)
        return accumulator
      }

    return(
        <div className="product" onClick={ forwardToProduct }>
            <div className="productThumnail">
                <img src={ product.thumnail } alt="thumnail" className="productThumnailImg" />
            </div>
            <div className="productInfo">
                <h3>{ product.name }</h3>
                <p style={{ color: '#FF9B9B' }} ><b>{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) }</b></p>
            </div>
            <img onClick={addToCart} className="addToCartButton" src="add-to-cart.png" alt="add-to-cart"/>
        </div>
    )
}