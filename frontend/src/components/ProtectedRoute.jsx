import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = null }) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/products" replace />;
    }

    return children;
}