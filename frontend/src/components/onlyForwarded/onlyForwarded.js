import { useLocation, Navigate } from "react-router-dom"
import { createContext } from "react"

export const ForwardDataContext = createContext()

export default function OnlyForwarded({children}) {
    const data = useLocation().state
    if (data !== null) {
        return <ForwardDataContext.Provider value={ data }>
            {children}
        </ForwardDataContext.Provider>
    }
    return <Navigate to='/' replace />
}