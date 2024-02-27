import { useContext, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { MessageContext } from '../../AppContainer'
import { showPopup } from '../popup/popup'

export default function LoginForm() {
    const location = useLocation()
    const navigate = useNavigate()
    const [cookie, setCookie, removeCookie] = useCookies()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useContext(MessageContext)

    //handle submit button
    function handleLogin(event) {
        event.preventDefault()
        if (password.length < 6) {
            setMessage('Mật khẩu phải có ít nhất 6 ký tự!')
            showPopup()
        }
        else {
            //lOGIN
            fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({username: username, password: password})
            })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/')
                }
                else {
                    setMessage('Tên đăng nhập hoặc mật khẩu không đúng!')
                    showPopup()
                }
            })
            .catch((err) => {
                console.log(err)
            })
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
    }

    function handleOnKeyDown(event) {
        if (event.key === 'Enter')
            handleLogin(event)
    }

    return (
        <form id='loginForm' className='form'>
            <input type='text' name='username' onChange={handleChange} placeholder='Email hoặc số điện thoại' value={ username } onKeyDown={ handleOnKeyDown } />
            <input type='password' name='password' onChange={handleChange} placeholder='Mật khẩu' value={ password } onKeyDown={ handleOnKeyDown }/>
            <p id='submitLogin' disabled={ !(username !== "" && password !== "") } onClick={ handleLogin }>Đăng nhập</p>
            <p id='register' onClick={() => navigate('/signup') } >Tạo tài khoản mới</p>
            <p id='forgotPassword'>Quên mật khẩu?</p>
        </form>
    )
}