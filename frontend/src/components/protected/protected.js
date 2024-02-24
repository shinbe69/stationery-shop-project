import { Navigate, useLocation } from "react-router-dom"

export default function Protected({children}) {
    const isAdmin = useLocation().state
    if (!isAdmin) {
        return (
            <Navigate to='/' replace/>
        )
    }
    return children
}