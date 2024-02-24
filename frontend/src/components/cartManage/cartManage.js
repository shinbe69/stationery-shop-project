import { useLocation, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useEffect, useState, useRef, useContext} from 'react'
import { showPopup, selectTypeOfPopup } from '../popup/popup'
import { MessageContext, CartContext } from '../../AppContainer'
import './cartManage.css'
import Item from './item'

export default function CartManage () {
    const [cart, setCart] = useContext(CartContext)
    const [message, setMessage] = useContext(MessageContext)
    const [cookie, setCookie, removeCookie] = useCookies()
    const navigate = useNavigate()
    const products = useLocation().state
    const [phone, setPhone] = useState('')
    const [buttonContent, setButtonContent] = useState('Đặt hàng')
    const intervalID = useRef()
    const timer = useRef(5)

    let totalPrice = 0
    products.forEach(item => {
        totalPrice += item.price * item.cartQuantity
    })

    useEffect(() => {
        // fetch('/api/users/getUser', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ username: cookie.user })
        // }).then(result => result.json())
        // .then(user => {
        //     setAddress(user.address)
        //     setPhone(user.phoneNumber)
        // })
        // .catch(error => console.log(error))
    }, [])


    function handlePurchase() {
        if (phone === '') {
            selectTypeOfPopup('WARNING')
            setMessage('Bạn chưa nhập số điện thoại!')
            showPopup()
        }
        else {
            if (timer.current !== 5) {
                let prepareItems = []
                products.forEach(product => {
                    prepareItems.push({ id: product._id, quantity: product.cartQuantity })
                })
                fetch('/api/orders/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ items: prepareItems, phone, value: totalPrice })
                }).then(res => res.json())
                .then(orderID => {
                    setCart({ cartItems: [], totalQuantity: 0 })
                    removeCookie('cart')
                    selectTypeOfPopup('SUCCESS')
                    setMessage('Đơn hàng được tạo thành công, vui lòng chờ xác nhận từ nhân viên')
                    showPopup()
                    setTimeout(() => {
                        navigate('/', {
                            state: true
                        })
                    }, 700)
                })
                .catch(error => {
                    console.log(error)
                    selectTypeOfPopup('WARNING')
                    setMessage('Có lỗi xảy ra, bạn vui lòng thử lại')
                    showPopup()
                })
            }
            else {
                selectTypeOfPopup('WARNING')
                setMessage('Vui lòng kiểm tra lại thông tin một lần nữa')
                showPopup()
                document.getElementById('purchase').style.cursor = 'not-allowed'
                document.getElementById('purchase').setAttribute('disabled', 'true')
                setButtonContent('( ' + timer.current + 's ) Xác nhận')
                intervalID.current = setInterval(() => {
                    timer.current -= 1
                    setButtonContent('( ' + timer.current + 's ) Xác nhận')
                }, 1000)
                setTimeout(() => {
                    clearInterval(intervalID.current)
                    document.getElementById('purchase').style.cursor = 'pointer'
                    document.getElementById('purchase').removeAttribute('disabled')
                    setButtonContent('Xác nhận')
                }, 5000)
            }
        }
    }

    function handleChange(event) {
        setPhone(event.target.value)
    }
    
    return (
        <div id="cartManage">
            <h2>Các sản phẩm đang chờ trong giỏ hàng</h2>
            <div id='cartItemsContainer'>
                <div id='cartListHeader' >
                    <h3 style={{ width: '50%', textDecoration: 'underline' }}>Sản phẩm</h3>
                    <hr />
                    <h3 style={{ width: '25%', textDecoration: 'underline' }}>Đơn giá</h3>
                    <hr />
                    <h3 style={{ width: '25%', textDecoration: 'underline' }}>Số lượng</h3>
                </div>
                {products.map(product => (
                    <Item key={ product._id } product={ product } />
                ))}
            </div>
            <div id='purchaseInfoContainer'>
            { products.length === 0 ? <h3>Giỏ hàng của bạn đang trống</h3> : <>
            <div className='seperateLine'></div>
                <div id='paymentInfo' >
                    <div >
                        <div id='addressConfirm'>
                            <h3 style={{ textDecoration: 'underline' }}>Số điện thoại đặt hàng:</h3>
                            { !cookie.phone ? 
                            <div className='inputProductInfo'>
                                <input type="text" name="street" value={ phone } onChange={ handleChange } placeholder="Nhập số điện thoại" style={{ width: '100%', height: '3em', padding: '0.2em', fontSize: '1em' }}/>
                            </div> : <p>Số điện thoại: { cookie.phone }</p> }
                            
                        </div>
                        <div id='paymentMethod'>
                            <h3 style={{ textDecoration: 'underline', marginBottom: '1em' }}>Phương thức thanh toán:</h3>
                            <select style={{ width: '100%', height: '3em', padding: '0.2em', fontSize: '1em' }}>
                                <option>Thanh toán khi nhận hàng (COD)</option>
                                <option disabled>Thanh toán qua thẻ ATM nội địa (đang phát triển)</option>
                            </select>
                        </div>
                    </div>
                    <div id='purchaseContainer'>
                        <h3 style={{ textDecoration: 'underline', marginBottom: '1em' }}>Tạm tính: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice) }</h3>
                        <button id='purchase' onClick={ handlePurchase } >{ buttonContent }</button>
                    </div>
                </div>
                <div className='seperateLine'></div>
            </> }
            </div>
        </div>
    )
}