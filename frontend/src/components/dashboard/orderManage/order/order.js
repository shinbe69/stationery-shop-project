import { useEffect, useState, useContext } from "react"
import { useCookies } from "react-cookie"
import { showPopup, selectTypeOfPopup } from "../../../popup/popup"
import { MessageContext } from "../../../../AppContainer"

export default function Order({ order }) {
    const [cookie] = useCookies()
    const [message, setMessage] = useContext(MessageContext)
    const [status, setStatus] = useState('')
    const [address, setAddress] = useState(order.address)
    const [phone, setPhone] = useState(order.phone)
    const [orderColor, setOrderColor] = useState('')
    useEffect(() => {
        switch (order.status) {
            case 'unconfirmed':
                setStatus('Đang chờ xác nhận')
                setOrderColor('repeating-linear-gradient(180deg,#FFA500,#FFA500 1em,transparent 0,transparent 2em, #FFA500,#FFA500 1em)')
                break
            case 'confirmed':
                setStatus('Đã xác nhận')
                setOrderColor('repeating-linear-gradient(180deg,#08acec,#08acec 1em,transparent 0,transparent 2em, #08acec,#08acec 1em)')
                break
        }
    }, [])

    function handleConfirmOrder() {
        fetch('/api/orders/confirmOrder', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ orderID: order._id })
        }).then(res => {
            if (res.ok) {
                selectTypeOfPopup('SUCCESS')
                setMessage('Xác nhận đơn hàng thành công')
                showPopup()
                order.status = 'confirmed'
                setStatus('Đã xác nhận')
            }
            else {
                selectTypeOfPopup('WARNING')
                setMessage('Có lỗi xảy ra, vui lòng thử lại')
                showPopup()
            }
        })
    }

    function handleChange(event) {
        switch (event.target.name) {
            case 'phone':
                setPhone(event.target.value)
                break
            case 'address': 
                setAddress(event.target.value)
                break
        }
    }

    function handleUpdate() {
        fetch('/api/orders/updateOrder', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ orderID: order._id, phone, address })
        }).then(res => {
            if (res.ok) {
                selectTypeOfPopup('SUCCESS')
                setMessage('Cập nhật đơn hàng thành công')
                showPopup()
            }
            else {
                selectTypeOfPopup('WARNING')
                setMessage('Có lỗi xảy ra, vui lòng thử lại')
                showPopup()
            }
        })
    }

    return (
        <div className="order">
            <div style={{ width: '10%', position: 'relative' }}>
                <div className="seperateLineOrder" style={{ backgroundImage: orderColor }} ></div>
            </div>
                <div className="orderInfo">
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>ID:</label>
                        <p>{ order._id }</p>
                    </div>
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Trạng thái:</label>
                        <p>{ status }</p>
                    </div>
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Được tạo vào:</label>
                        <p>{ new Date(order.createAt).toLocaleString() }</p>
                    </div>
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Số điện thoại:</label>
                        <input name="phone" onChange={handleChange} value={phone} style={{ outline: 'none', width: 'fit-content' }} />
                    </div>
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Giá trị đơn hàng:</label>
                        <p style={{ color: '#FF9B9B', fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.value)}</p>
                    </div>
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Địa chỉ:</label>
                        <input name="address" onChange={handleChange} value={address} style={{ outline: 'none', width: '70%' }} />
                    </div>
                    <div className="orderQuickAction">
                        <div style={{ width: 'fit-content', margin: 'auto' }}>
                            { order.status === 'unconfirmed' ? <button onClick={ handleConfirmOrder }>Xác nhận</button> : <></> }
                            <button >Chi tiết</button>
                            <button onClick={handleUpdate}>Cập nhật</button>
                        </div>
                    </div>
                </div>
        </div>
    )
}