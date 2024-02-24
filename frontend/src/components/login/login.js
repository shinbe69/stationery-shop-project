import { Outlet } from 'react-router-dom'
import './login.css'
import { useEffect } from 'react'

export default function Login() {

    // useEffect(() => {
    //     document.getElementById('sideMenuSwitch').style.display = 'none'
    // }, [])

    return (
        <div id='login'>
            <Outlet />
        </div>
    )
}