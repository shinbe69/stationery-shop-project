import { useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { MessageContext } from '../../../AppContainer'
import { showPopup, selectTypeOfPopup } from '../../popup/popup'

export default function SignupForm() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [reEnterPassword, setReEnterPassword] = useState("")
    const [message, setMessage] = useContext(MessageContext)

    //handle signup
    function handleSignup(event) {
        event.preventDefault()
        if (!username.includes('@') && !username.includes('0')) {
            selectTypeOfPopup('WARNING')
            setMessage('Vui lòng nhập email hoặc số điện thoại hợp lệ!')
            showPopup()
        }
        else if (!username.includes('@') && username.length !== 10) {
            selectTypeOfPopup('WARNING')
            setMessage('Vui lòng nhập số điện thoại hợp lệ!')
            showPopup()
        }
        else if (password.length < 6) {
            selectTypeOfPopup('WARNING')
            setMessage('Mật khẩu phải có ít nhất 6 ký tự!')
            showPopup()
        }
        else {
            if (event.target.id === 'register') {
                if (password === reEnterPassword) {
                    fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({username, password, reEnterPassword: reEnterPassword})
                        })
                        .then(res => {
                            if (res.status === 409) {
                                selectTypeOfPopup('WARNING')
                                setMessage('Tài khoản đã tồn tại trong hệ thống')
                                showPopup()
                                return
                            }
                            else if (res.status === 500) {
                                selectTypeOfPopup('WARNING')
                                setMessage('Có lỗi xảy ra ở hệ thống, vui lòng thử lại')
                                showPopup()
                                return
                            }
                            else {
                                let user = res.json()
                                fetch('/api/auth/login', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({username, password})
                                })
                                .then((response) => {
                                    if (response.status === 200) {
                                        navigate('/update-user-info', {
                                            state: {
                                                username
                                            }
                                        })
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            }
                        })
                }
                else {
                    setMessage('Xác nhận mật khẩu không trùng khớp!')
                    showPopup()
                }
            }
        }
    }
    //handle change event of a username and password
    function handleChange(event) {
        let tartget = event.target.name
        if(tartget === "username") {
            setUsername(event.target.value)
        }
        else if(tartget === 'password'){    
            setPassword(event.target.value)
        }
        else {
            setReEnterPassword(event.target.value)
        }
    }

    function handleBackButton() {
        navigate('/login')
    }

    function handleOnKeyDown(event) {
        if (event.key === 'Enter')
            handleSignup(event)
    }

    return (
            <form id='signupForm' className='form'>
                <input type='text' name='username' onChange={handleChange} onKeyDown={ handleOnKeyDown } placeholder='Email hoặc số điện thoại' value={ username }/>
                <input type='password' name='password' onChange={handleChange} onKeyDown={ handleOnKeyDown } placeholder='Mật khẩu' value={ password }/>
                <input id='re-enterPassword' type='password' name='password1' onChange={handleChange} onKeyDown={ handleOnKeyDown } placeholder='Nhập lại mật khẩu'/>
                <p id='register' disabled={  !(username !== "" && password !== "" && reEnterPassword !== "") } onClick={ handleSignup }>Tạo tài khoản mới</p>
                <p id='forgotPassword'>Quên mật khẩu?</p>
                <img id='back2Login' onClick={ handleBackButton } src='back.png' alt='back'/>
            </form>
    )
}