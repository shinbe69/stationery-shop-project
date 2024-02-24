import { useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Typography } from 'antd'
import { CartQuantityContext, CartContext, MessageContext } from '../../AppContainer'
import { showPopup, selectTypeOfPopup } from '../popup/popup'
import './productPage.css'

const { Title, Paragraph, h3 } = Typography

export default function ProductPage() {
    const navigate = useNavigate()
    const product = useLocation()
    const [cookie, setCookie, removeCookie] = useCookies()
    const [quantity, selectQuantity] = useState(1)
    const [cartQuantity, setCartQuantity] = useContext(CartQuantityContext)
    const [cart, setCart] = useContext(CartContext)
    const [message, setMessage] = useContext(MessageContext)

    function handleAddToCart() {
        // if (typeof cookie.user !== 'undefined') {
        //     fetch('/api/users/addToCart', {
        //         method: 'PATCH',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ username: cookie.user, cart: [{id: product.state._id, quantity}]})
        //     }).then(result => result.json())
        //     .then(cart => {
        //         setCartQuantity(cart.totalQuantity)
        //         setCart(cart)
        //         selectTypeOfPopup('SUCCESS')
        //         setMessage('Thêm vào giỏ thành công')
        //         showPopup()
        //     })
        //     .catch(error => console.log(error))
        // }
        // else {
        //     navigate('/login')
        //     selectTypeOfPopup('WARNING')
        //     setMessage('Bạn vui lòng đăng nhập để thêm vào giỏ hàng')
        //     showPopup()
        // }
        cookie.cart.push({id: product.state._id, quantity})
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

    return (
        <div id="productPage" >
            <div id='productThumnail' >
                <img src={ product.state.thumnail } alt='product thumnail' />
            </div>
            <div id='productInfo'>
                <div id='addToCartSection'>
                    <p style={{ whiteSpace: 'nowrap', color: '#999' }}>Số lượng</p>
                    <div id='selectQuantity'>
                        <div id='subtractButton' style={{ fontWeight: 'bold', width: '25%', display: 'flex' }} onClick={() => quantity === 1 ? {} : selectQuantity(quantity - 1) }>
                            <p>-</p>
                        </div>
                        <p id='quantity' style={{ fontWeight: 'bold', width: '50%', textAlign: 'center' }}>{quantity}</p>
                        <div id='plusButton' style={{ fontWeight: 'bold', width: '25%', display: 'flex' }} onClick={() => selectQuantity(quantity + 1) }>
                            <p >+</p>
                        </div>
                    </div>
                    <div id='addToCartButton' onClick={ handleAddToCart }>
                        <img src="add-to-cart.png" alt="add-to-cart" style={{ margin: 'auto' }} />
                        <p style={{ whiteSpace: 'nowrap', margin: 'auto', color: '#FFF' }} ><b>Thêm vào giỏ hàng</b></p>
                    </div>
                </div>
                <div id='specificInfo'>
                    <h2>Thông tin sản phẩm</h2>
                    <p><label style={{ color: '#999' }} >Tên:</label> &ensp;{ product.state.name }</p>
                    <p style={{ color: '#FF9B9B' }}><label style={{ color: '#999' }}>Giá:</label> &ensp;
                        <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.state.price) }</b>
                    </p>
                    <p><label style={{ color: '#999' }}>Mô tả:</label> &ensp;{ product.state.description }</p>
                    <h4 style={{ border: '1px solid #D8D9DA', borderRadius: '0.3em', width: 'fit-content', height: 'fit-content', padding: '0.5em', color: '#FFFFFF', backgroundColor:  product.state.quantity > 0 ? '#00C851' : '#F05E16' }}>{ product.state.quantity > 0 ? 'Còn hàng' : 'Tạm hết hàng'}</h4>
                </div>

            </div>
            {/* <div id='additionalInfo'>
                <h3>Thông tin chi tiết</h3>
                <p>{ product.state.additionalInfo || 'Đang cập nhật'}</p>
            </div> */}
            <Typography >
                <h3>Thông tin chi tiết</h3>
                <Paragraph>
                    { product.state.additionalInfo || 'Đang cập nhật'}
                </Paragraph>
            </Typography>
        </div>
    )
}