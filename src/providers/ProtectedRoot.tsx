import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { useEffect } from "react"

const ProtectedRoot = ({ userType }: { userType: string }) => {

    const { profile, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && profile !== userType) {
            navigate('/')
        }
    }, [loading, profile, userType, navigate])


    if (loading || profile !== userType) {
        return null
    }

    return <Outlet />
}

export default ProtectedRoot