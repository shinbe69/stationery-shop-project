import { useEffect, useState, useContext } from "react"
import { useCookies } from "react-cookie"
import { Dropdown, Menu } from "antd"
import { showPopup, selectTypeOfPopup } from "../../../popup/popup"
import { MessageContext } from "../../../../AppContainer"

export default function Order({ order }) {
    const statusSet = (
        <Menu>
            <Menu.Item key={1}>Đang chờ xác nhận</Menu.Item>
            <Menu.Item key={2} onClick={() => setStatus('confirmed')}>Đã xác nhận</Menu.Item>
            <Menu.Item key={3} onClick={() => setStatus('delivering')}>Đang giao hàng</Menu.Item>
            <Menu.Item key={4} onClick={() => setStatus('deliveried')}>Giao hàng thành công</Menu.Item>
        </Menu>
    )
    const [cookie] = useCookies()
    const [message, setMessage] = useContext(MessageContext)
    const [status, setStatus] = useState(order.status)
    const [statusMessage, setStatusMessage] = useState('')
    const [address, setAddress] = useState(order.address)
    const [phone, setPhone] = useState(order.phone)

    useEffect(() => {
        switch (status) {
            case 'unconfirm':
                setStatusMessage('Đang chờ xác nhận')
                break
            case 'confirmed':
                setStatusMessage('Đã xác nhận')
                break
            case 'delivering':
                setStatusMessage('Đang giao hàng')
                break
            case 'deliveried':
                setStatusMessage('Giao hàng thành công')
                break
        }
    }, [status])

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
        fetch('/api/orders/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ orderID: order._id, phone, address, status })
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
                <div className="orderInfo">
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>ID:</label>
                        <p>{ order._id }</p>
                    </div>
                    <div className="orderInfoItem">
                        <label style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Trạng thái:</label>
                        <Dropdown dropdownRender={() => (statusSet)} arrow placement='bottom' trigger={['click']}>
                        <p style={{ border: '1px solid #9CAFAA', padding: '0 1em', borderRadius: '0.5em', backgroundColor: '#FEFDED' }}>{ statusMessage }</p>
                        </Dropdown>
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
                            <button >Chi tiết</button>
                            <button onClick={handleUpdate}>Cập nhật</button>
                        </div>
                    </div>
                </div>
        </div>
    )
}