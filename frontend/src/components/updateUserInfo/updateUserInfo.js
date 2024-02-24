import { useContext, useEffect, useState } from "react"
import { useLoaderData, useNavigate, useLocation } from "react-router-dom"
import { showPopup, selectTypeOfPopup } from "../popup/popup"
import { useCookies } from "react-cookie"
import { MessageContext } from "../../AppContainer"
import './updateUserInfo.css'

export default function UpdateUserInfo() {
    const username = useLocation().state.username
    const onlyUpdateAddress = useLocation().state.onlyUpdateAddress
    const navigateBack = useLocation().state.navigateBack
    const [cookie, setCookie, removeCookie] = useCookies()
    const navigate = useNavigate()
    const [message, setMessage] = useContext(MessageContext)
    const provinces = useLoaderData().results
    const [province, setProvince] = useState('')
    const [districts, setDistricts] = useState([])
    const [district, setDistrict] = useState('')
    const [wards, setWards] = useState([])
    const [ward, setWard] = useState('')
    const [street, setStreet] = useState('')
    const [gender, setGender] = useState('')
    const [dob, setDob] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        let buttonContainerWidth = document.getElementById('buttonContainer').offsetWidth
        document.getElementById('buttonContainer').style.right =  (100 - ((buttonContainerWidth / document.body.offsetWidth) * 100)) / 2 + '%'
    }, [])

    function handleChange(event) {
        switch (event.target.name) {
            case 'province':
                setProvince(event.target.value)
                break
            case 'district':
                setDistrict(event.target.value)
                break
            case 'ward':
                setWard(event.target.value)
                break
            case 'street':
                setStreet(event.target.value)
                break
            case 'gender':
                setGender(event.target.value)
                break
            case 'dob':
                let dobArr = (event.target.value).split('-')
                if (1920 <= parseInt(dobArr[0]) && parseInt(dobArr[0]) < new Date().getFullYear())
                    setDob(event.target.value)
                break
            case 'phone':
                setPhoneNumber(event.target.value)
                break
        }
    }

    useEffect(() => {
        setWards([])
        if (province !== '') {
            let provinceArr = province.split(',')
            fetch('https://vapi.vnappmob.com/api/province/district/'.concat(provinceArr[0]))
            .then(res => res.json())
            .then(results => setDistricts(results.results))
            .catch(err => console.log(err))
        }
    }, [province])

    useEffect(() => {
        setWards([])
        if (district !== '') {
            let districtArr = district.split(',')
            fetch('https://vapi.vnappmob.com/api/province/ward/'.concat(districtArr[0]))
            .then(res => res.json())
            .then(results => setWards(results.results))
            .catch(err => console.log(err))
        }
    }, [district])

    function saveInfo() {
        if (province !== '' && district !== '' && ward !== '' && street !== '' && phoneNumber !== '' && (onlyUpdateAddress ? true :  gender !== '' && dob !== '')) {
            if (phoneNumber.length === 10) {
                let prepareAddress = street + ', ' + ward + ', ' + district.split(',')[1] + ', ' + province.split(',')[1]
                fetch('/api/users/updateUser', {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(onlyUpdateAddress ? { username, address: prepareAddress, phoneNumber } : { username, address: prepareAddress, gender, dob, phoneNumber })
                })
                .then(res => {
                    if (res.status === 200) {
                        selectTypeOfPopup('SUCCESS')
                        setMessage('Cập nhật thành công')
                        showPopup()
                        setTimeout(() => {
                            navigate(navigateBack ? -1 : '/')
                        }, 700)
                    }
                    else {
                        selectTypeOfPopup('WARNING')
                        setMessage('Có lỗi xảy ra, bạn vui lòng thử lại')
                        showPopup()
                    }
                    
                })
                .catch(error => console.log(error))
            }
            else {
                selectTypeOfPopup('WARNING')
                setMessage('Số điện thoại không hợp lệ')
                showPopup()
            }
        }
        else {
            selectTypeOfPopup('WARNING')
            setMessage('Vui lòng nhập đầy đủ thông tin bên dưới')
            showPopup()
        }
    }

    return (
        <div id="updateUserInfo">
            <div id='addressInfo'>
                <h3 style={{ textDecoration: 'underline' }}>Địa chỉ</h3>
                <div className='inputProductInfo'>
                    <label >Tỉnh / Thành phố:</label>
                    <br />
                    <select name="province" required value={ province } onChange={ handleChange } style={{ padding: '0 0.5em' }}>
                        <option style={{ fontStyle: 'italic' }} value={ '' }>--Chọn tỉnh / thành phố--</option>
                        { provinces.map(province => (
                            <option key={province.province_id} value={[province.province_id, province.province_name]} >{ (province.province_name).replace(/Tỉnh|Thành phố/g, '') }</option>
                        )) }
                    </select>
                </div>
                <div className='inputProductInfo'>
                    <label >Quận / Huyện / Thị xã:</label>
                    <br />
                    <select name="district" required value={ district } onChange={ handleChange } style={{ padding: '0 0.5em' }}>
                        <option style={{ fontStyle: 'italic' }} value={ '' } >--Chọn quận / huyện / thị xã--</option>
                        {districts.length !== 0 ? districts.map(district => (
                            <option key={district.district_id} value={[district.district_id, district.district_name]}>{ (district.district_name).replace(/Huyện|Quận|Thị xã|Thành phố/g, '') }</option>
                        )) : <></> }
                    </select>
                </div>
                <div className='inputProductInfo'>
                    <label >Xã / Thị trấn:</label>
                    <br />
                    <select name="ward" required value={ ward } onChange={ handleChange } style={{ padding: '0 0.5em' }}>
                        <option style={{ fontStyle: 'italic' }} value={ '' } >--Chọn xã / thị trấn--</option>
                        {wards.length !== 0 ? wards.map(ward => (
                            <option key={ward.ward_id}  value={ ward.ward_name }>{ (ward.ward_name).replace(/Xã/g, '') }</option>
                        )) : <></> }
                    </select>
                </div>
                <div className='inputProductInfo'>
                    <label >Địa chỉ nhà (tên đường, số nhà,...):</label>
                    <br />
                    <input type="text" name="street" value={ street } onChange={ handleChange } placeholder="Nhập địa chỉ nhà"/>
                </div>
                <div className='inputProductInfo'>
                    <label >Số điện thoại giao hàng:</label>
                    <br />
                    <input style={{ width: '80%' }} type="phone" name="phone" value={ phoneNumber } onChange={ handleChange } placeholder="Nhập số điện thoại (10 chữ số)"/>
                </div>
            </div>
            <hr style={{ margin: 'auto 1em', height: '75%' }} />
            <div id='bio' style={{ opacity: onlyUpdateAddress ? '0.5' : '1'}}>
                <h3 style={{ textDecoration: 'underline' }}>Thông tin cá nhân</h3>
                <div className='inputProductInfo'>
                    <label >Ngày sinh (theo định dạng 'tháng/ngày/năm'):</label>
                    <br />
                    <input disabled={onlyUpdateAddress} type="date" name="dob" onChange={ handleChange }/>
                </div>
                <div className='inputProductInfo'>
                    <label >Giới tính:</label>
                    <br />
                    <select disabled={onlyUpdateAddress} name="gender" required style={{ padding: '0 0.5em' }} onChange={ handleChange }>
                        <option style={{ fontStyle: 'italic' }} value={ '' } >--Chọn giới tính--</option>
                        <option value={'male'}>Nam</option>
                        <option value={'female'}>Nữ</option>
                        <option value={'other'}>Khác</option>
                    </select>
                </div>
            </div>
            <div id="buttonContainer">
                <h3 id='submitSaveInfo' onClick={ saveInfo }>Lưu thông tin</h3>
                { onlyUpdateAddress ? <></> : <h3 id='skip' onClick={ () => navigate('/') }>Bổ sung sau</h3>}
            </div>
        </div>
    )
}