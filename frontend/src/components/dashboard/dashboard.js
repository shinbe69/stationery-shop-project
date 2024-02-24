import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './dashboard.css'

export default function Dashboard() {
    const [cookie, setCookie, removeCookie] = useCookies()
    const navigate = useNavigate()
    
    return (
        <div id="dashboard">
            <hr style={{ margin: '0 1em' }} />
            <div id='controlPanel'>
                <Outlet />
            </div>
        </div>
    )
}