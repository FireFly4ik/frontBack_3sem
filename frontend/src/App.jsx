import { Link, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./pages/UsersPage";
import UserEditPage from "./pages/UserEditPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <div className="container">
            <header className="header">
                <h1>Практика 10</h1>
                <nav className="nav">
                    <Link to="/products">Товары</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/me">Профиль</Link>
                            {user?.role === 'admin' && <Link to="/users">Пользователи</Link>}
                            {user && ['seller', 'admin'].includes(user.role) && <Link to="/products/new">Создать товар</Link>}
                            <button onClick={logout}>Выход</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Вход</Link>
                            <Link to="/register">Регистрация</Link>
                        </>
                    )}
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/me"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/products" element={<ProductsPage />} />
                <Route
                    path="/products/:id"
                    element={
                        <ProtectedRoute>
                            <ProductDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/:id/edit"
                    element={
                        <ProtectedRoute allowedRoles={['seller', 'admin']}>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/new"
                    element={
                        <ProtectedRoute allowedRoles={['seller', 'admin']}>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/:id/edit"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <UserEditPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}
