import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoutes = () => {
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        setIsAuth(localStorage.getItem("user") ? true : false);
    }, [])
    
    return (isAuth === true ? <Outlet /> : <Navigate to="/" replace/>)
}
export default ProtectedRoutes;