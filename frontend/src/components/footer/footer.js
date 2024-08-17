import './footer.css'

export default function Footer() {
    return (
        <div id="footer">
            <hr style={{ marginBottom: '1em' }} />
            <div id='footerChild' >
                <div style={{ textAlign: 'center' }} className='footerInfo'>
                    <div >
                        <h3>Về cửa hàng Diệu Thiện</h3>
                        <p>Shop Diệu Thiện chuyên cung cấp các sản phẩm là cây xanh mini để bàn trang trí, phong thủy, quà tặng.</p>
                    </div>
                </div>

                <div className='footerInfo'>
                    <h3>Thông tin liên hệ:</h3>
                    <p>Địa chỉ: 2A Trương Phước Phan, Phường Bình Trị Đông, Quận Bình Tân.</p>
                    <p>Số điện thoại: 0964209830</p>
                    <h3>Phương thức thanh toán:</h3>
                    <div style={{ display: 'flex' }}>
                        <img alt='momo' src='momo.png' />
                        <img alt='cod' src='cod.png' />
                        <img alt='visa' src='visa.png' />
                    </div>
                </div>
            
            </div>
        </div>
    )
}