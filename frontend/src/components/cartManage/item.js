import { Button, Form, InputNumber, Space, Table } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { CartQuantityContext, CartContext, MessageContext } from '../../AppContainer'
import { showPopup, selectTypeOfPopup } from '../popup/popup'


export default function Item({ product }) {
    const navigate = useNavigate()
    const [cookie, setCookie] = useCookies()
    const [message, setMessage] = useContext(MessageContext)
    const [quantity, selectQuantity] = useState(product.cartQuantity)
    const columns = [
        {
            title: 'Sản phẩm',
            key: 'name'
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (value) => (
                <h4 id="unitPrice" >{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) }</h4>
            )
        },
        {
            title: 'Số lượng',
            key: 'quantity'
        }
    ]

    useEffect(() => {
        console.log(product)
    }, [])

    // function handleChangeItemQuantity(event) {
    //     switch (event.target.className) {
    //         case 'removeCartItem':
    //             cookie.cart.forEach((item, index) => {
    //                 if (item.id === product._id) {
    //                     cookie.cart.splice(index, 1)
                        
    //                 }
    //             })
    //             setCookie('cart', cookie.cart)
    //             setMessage('Xóa sản phẩm thành công')
    //             break
    //         case 'subtract':
    //             cookie.cart.forEach((item, index) => {
    //                 if (item.id === product._id) {
    //                     if (item.quantity === 1)
    //                         cookie.cart.splice(index, 1)
    //                     else 
    //                         item.quantity--
    //                 }
    //             })
    //             setCookie('cart', cookie.cart)
    //             setMessage('Giảm số lượng thành công')
    //             break
    //         case 'plus':
    //             cookie.cart.forEach(item => {
    //                 if (item.id === product._id) {
    //                     item.quantity++
    //                 }
    //             })
    //             setCookie('cart', cookie.cart)
    //             setMessage('Tăng số lượng thành công')
    //             break
    //     }
    //         selectTypeOfPopup('SUCCESS')
    //         showPopup()
    //         let idArr = []
    //         cookie.cart.forEach(item => {
    //             idArr.push(item.id)
    //         })

    //         fetch('/api/products/getProductsById', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ productID: idArr })
    //         }).then(res => res.json())
    //         .then(products => {
    //             products.forEach((product) => {
    //                 cookie.cart.forEach(item => {
    //                     if (item.id === product._id)
    //                         product.cartQuantity = item.quantity
    //                 })
    //             })
    //             navigate('/cart-manage', {
    //                 state: products
    //             })
    //         })
    //         .catch(error => console.log(error))
    // }

    // function updateCartManagePage(inputCart) {
    //     let idArr = []
    //         inputCart.cartItems.forEach(item => {
    //             idArr.push(item.id)
    //         })
    //         fetch('/api/products/getProductsById', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ productID: idArr })
    //         }).then(res => res.json())
    //         .then(products => {
    //             products.forEach((product) => {
    //                 inputCart.cartItems.forEach(item => {
    //                     if (item.id === product._id)
    //                         product.cartQuantity = item.quantity
    //                 })
    //             })
    //             navigate(typeof cookie.user !== 'undefined' ? '/cart-manage' : '/login', {
    //                 state: products
    //             })
    //         })
    //         .catch(error => console.log(error))
    // }

    return (
        <div id="cartItem">
            <Table bordered columns={columns} dataSource={product} />
            <div id="itemThumnail">
                <img src={ product.thumnail } alt='thumnail'/>
            </div>
            <p style={{ width: '35%'}}>{ product.name }</p>
            <h4 id="unitPrice" >{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) }</h4>
            
                {/* <div id='selectQuantity' >
                    <div className='subtract' style={{ fontWeight: 'bold', width: '25%', display: 'flex' }} onClick={(event) => {
                        if (quantity > 1) selectQuantity(quantity - 1)
                        handleChangeItemQuantity(event)
                        }}>
                        <p className='subtract'>-</p>
                    </div>
                    <hr style={{ margin: '0.4em 0' }} />
                    <p id='quantity' style={{ fontWeight: 'bold', width: '50%', textAlign: 'center' }}>{quantity}</p>
                    <hr style={{ margin: '0.4em 0' }} />
                    <div className='plus' style={{ fontWeight: 'bold', width: '25%', display: 'flex' }} onClick={(event) => {
                        selectQuantity(quantity + 1) 
                        handleChangeItemQuantity(event)
                        }}>
                        <p className='plus'>+</p>
                    </div>
                </div> */}
                <Form size='large' layout='inline'>
                    <Space >
                        <Form.Item >
                            <InputNumber min={1} defaultValue={1} step={1} />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' danger onClick={ handleChangeItemQuantity }>
                                Xóa sản phẩm
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
                
        </div>
    )
}