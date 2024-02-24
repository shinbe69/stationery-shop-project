import { useContext, useEffect, useState } from "react"
import { MessageContext } from "../../../AppContainer"
import { showPopup, selectTypeOfPopup } from "../../popup/popup"
import { useNavigate } from "react-router-dom"

export default function AddNewProduct() {
    const navigate = useNavigate()
    const [message, setMessage] = useContext(MessageContext)
    const [thumnail, setThumnail] = useState('')
    const [categories, setCategories] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [unitPrice, setUnitPrice] = useState(1000)
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [additionalInfo, setAdditionalInfo] = useState('')

    useEffect(() => {
        fetch('/api/category')
        .then(res => res.json())
        .then(categories => setCategories(categories))
      }, [])

    function handleChange(event) {
        let target = event.target.name
        let value = event.target.value
        switch (target) {
            case 'name':
                setName(value)
                break
            case 'category':
                setCategory(value)
                break
            case 'description':
                setDescription(value)
                break
            case 'unit-price':
                setUnitPrice(value)
                break
            case 'quantity':
                setQuantity(value)
                break
            case 'additionalInfoInput':
                setAdditionalInfo(value)
                break
        }
    }

    async function handleUpload(event) {
        let image = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onloadend = () => {
            setThumnail(reader.result)
        }
    }

    function handleAddNewProduct() {
        if (name === '' || category === '' || description === '' || quantity === '' || thumnail === '') {
            setMessage('Bạn vui lòng điền đầy đủ thông tin bắt buộc')
            showPopup()
        }
        else if (unitPrice < 0) {
            setMessage('Giá tiền phải lớn hơn hoặc bằng 0 đồng')
            showPopup()
        }
        else if (quantity < 1) {
            setMessage('Số lượng phải lớn hơn hoặc bằng 1')
            showPopup()
        }
        else {
            fetch('/api/products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, category, description, unitPrice, quantity, thumnail, additionalInfo })
            }).then(res => res.json())
            .then(product => {
                setMessage('Thêm sản phẩm thành công')
                selectTypeOfPopup('SUCCESS')
                showPopup()
                setTimeout(() => {
                    navigate('/')
                }, 700)
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <div id="addNewProduct" style={{ textAlign: 'left' }}>
            <div id='compulsoryInfo'>
                <div className='inputProductInfo' style={{ marginTop: '0'}}>
                    <label >Tên sản phẩm:</label>
                    <br />
                    <input type='text' autoFocus name='name' value={name} onChange={handleChange} placeholder='Nhập tên sản phẩm' />
                </div>
                <div className='inputProductInfo'>
                    <label >Danh mục sản phẩm:</label>
                    <br />
                    <select name="category" required onChange={ handleChange } value={category} style={{ padding: '0 0.5em' }}>
                        <option style={{ fontStyle: 'italic' }} >--Chọn danh mục--</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>{ category.name }</option>
                        ))}
                    </select>
                </div>
                <div className='inputProductInfo'>
                    <label >Mô tả:</label>
                    <br />
                    <input type='text' name='description' value={description} onChange={handleChange} placeholder='Nhập ngắn gọn mô tả về sản phẩm' />
                </div>
                <div className='inputProductInfo'>
                    <label >Đơn giá:</label>
                    <br />
                    <input type='number' min={1000} name='unit-price' value={unitPrice} step={1000} onChange={handleChange} placeholder='Nhập đơn giá (giá trị bắt buộc là chữ số và lớn hơn 1.000)'/>
                </div>
                <div className='inputProductInfo'>
                    <label >Tổng số lượng:</label>
                    <br />
                    <input type='number' min={1} name='quantity' value={quantity} step={1} onChange={handleChange} placeholder='Nhập tổng số lượng sản phẩm trong kho (giá trị là chữ số và bắt buộc lớn hơn 1)'/>
                </div>
                <div className='inputProductInfo'>
                    <label >Tải lên ảnh thumnail:</label>
                    <br />
                    <input type='file' accept="image/*" name='thumnail' onChange={ handleUpload } />
                </div>
            </div>
            <div id='optionalInfo'>
                <label >Thông tin chi tiết:</label>
                    <br />
                <textarea id="additionalInfoInput" name="additionalInfoInput" placeholder="Thông tin chi tiết của sản phẩm (không bắt buộc)" onChange={ handleChange }/>
                <div id="previewThumnail">
                    <h3 style={{ textDecoration: 'underline' }}>Preview ảnh</h3>
                    <img style={{ marginTop: '1em' }} src={thumnail} />
                </div>
            </div>
            <h3 id='submitAddProduct' onClick={ handleAddNewProduct }>Tạo</h3>
        </div>
    )
}