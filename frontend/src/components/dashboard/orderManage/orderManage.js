import { useEffect, useState, useContext } from "react"
import { ForwardDataContext } from "../../onlyForwarded/onlyForwarded"
import { useCookies } from "react-cookie"
import Order from "./order/order"
import './orderManage.css'

export default function OrderManage() {
    const [cookie] = useCookies()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetch('/api/orders/')
        .then(res => res.json())
        .then(orders => setOrders(orders))
        .catch(err => console.log(err))
    }, [])

    return (
        <div id="orderManage">
            { cookie.isAdmin ? <></> : <h2 style={{ marginBottom: '2em' }}>Danh sách đơn hàng của bạn</h2> }
            <div id="orderContainer">
                { orders.map(order => (
                    <Order key={ order._id } order={order} />
                )) }
            </div>
        </div>
    )
}