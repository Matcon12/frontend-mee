import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ isAuth, children }) => {
    if (!isAuth) {
        return <Navigate to="/" replace />
    }
    return children
}
export default ProtectedRoutes;