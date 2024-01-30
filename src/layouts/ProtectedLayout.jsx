import React from 'react'
import ProtectedRoutes from '../herlpers/ProtectedRoutes';

const ProtectedLayout = ({ children }) => {
    const isAuth = localStorage.getItem("user") ? true : false;
    return (
        <ProtectedRoutes isAuth={isAuth}>
            {children}
        </ProtectedRoutes>
    )
}

export default ProtectedLayout