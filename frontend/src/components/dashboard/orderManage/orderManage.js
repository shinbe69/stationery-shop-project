import { useEffect, useState, useContext } from "react"
import { ForwardDataContext } from "../../onlyForwarded/onlyForwarded"
import { useCookies } from "react-cookie"
import Order from "./order/order"
import './orderManage.css'

export default function OrderManage() {
    const [cookie] = useCookies()
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('default')

    useEffect(() => {
        fetch('/api/orders')
        .then(res => res.json())
        .then(orders => setOrders(orders))
        .catch(err => console.log(err))
    }, [])

    // useEffect(() => {
    //     if (typeof category !== 'undefined') {
    //         fetch('/api/products/getProducts', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({ filter, category })
    //         }).then(res => res.json())
    //         .then(products => setProducts(products))
    //         .catch(err => console.log(err))
    //     }
    // }, [filter])

    function handleChangeFilter(event) {
        setFilter(event.target.value)
    }

    return (
        <div id="orderManage">
            { cookie.isAdmin ? <></> : <h2 style={{ marginBottom: '2em' }}>Danh sách đơn hàng của bạn</h2> }
            <div id='productNavigator'>
                <div className='naviOption'>
                    <label>Sắp xếp theo:</label>
                    <select style={{ fontStyle: 'italic' }} onChange={ handleChangeFilter }>
                        <option value='default'>Mặc định</option>
                        <option value='increase'>Giá thấp &#62; cao</option>
                        <option value='decrease'>Giá cao &#62; thấp</option>
                        <option value='bestsell'>Bán chạy nhất</option>
                        <option value='recently'>Mới thêm gần đây</option>
                    </select>
                </div>
            </div>
            <div id="orderContainer">
                { orders.map(order => (
                    <Order key={ order._id } order={order} />
                )) }
            </div>
        </div>
    )
}