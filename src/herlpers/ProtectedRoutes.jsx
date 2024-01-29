import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const ProtectedRoutes = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(localStorage.getItem("user") ? true : false);
    }, [])

    if (!isAuth) return <Navigate to="/" replace/>

    return (
        <>
            {children}
        </>
    )
}
export default ProtectedRoutes;