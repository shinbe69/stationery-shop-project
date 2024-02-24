import { useContext, useEffect, useState } from "react"
import { MessageContext } from "../../../AppContainer"
import { showPopup, selectTypeOfPopup } from "../../popup/popup"
import { useNavigate } from "react-router-dom"

export default function AddNewCategory() {
    const navigate = useNavigate()
    const [message, setMessage] = useContext(MessageContext)
    const [name, setName] = useState('')
    const [thumnail, setThumnail] = useState('')
    

    // useEffect(() => {
    //     fetch('/api/getCategories')
    //     .then(res => res.json())
    //     .then(categories => setCategories(categories))
    //   }, [])

    async function handleUpload(event) {
        let image = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onloadend = () => {
            setThumnail(reader.result)
        }
    }

    function handleAddNewCategory() {
        if (name === '' || thumnail === '') {
            setMessage('Bạn vui lòng điền đầy đủ thông tin bắt buộc')
            showPopup()
        }
        else {
            fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name,  thumnail})
            })
            .then(res => {
                if (res.ok) {
                    selectTypeOfPopup('SUCCESS')
                    setMessage('Thêm danh mục thành công')
                    showPopup()
                    setTimeout(() => {
                        navigate('/')
                    }, 700)
                }
                else if (res.status === 409) {
                    selectTypeOfPopup('WARNING')
                    setMessage('Tên danh mục đã tồn tại')
                    showPopup()
                }
            })
            .catch(err => console.log(err))
        }
    }

    function handleOnChangeName(event) {
        setName(event.target.value)
    }

    return (
        <div id="addNewProduct">
            <div id='compulsoryInfo'>
                <div className='inputProductInfo' style={{ marginTop: '0'}}>
                    <label >Tên danh mục:</label>
                    <br />
                    <input type='text' autoFocus name='name' value={name} onChange={ handleOnChangeName } placeholder='Nhập tên danh mục' />
                </div>
                <div className='inputProductInfo'>
                    <label >Tải lên icon:</label>
                    <br />
                    <input type='file' accept="image/*" name='thumnail' onChange={ handleUpload } />
                </div>
            </div>
            <div id='optionalInfo'>
                <div id="previewThumnail">
                    <h3 style={{ textDecoration: 'underline' }}>Preview icon</h3>
                    <img style={{ marginTop: '1em' }} src={thumnail} />
                </div>
            </div>
            <h3 id='submitAddProduct' onClick={ handleAddNewCategory }>Tạo</h3>
        </div>
    )
}