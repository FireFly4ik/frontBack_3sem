import { Link, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="container">
            <header className="header">
                <h1>Практика 10</h1>
                <nav className="nav">
                    <Link to="/products">Товары</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/me">Профиль</Link>
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
                        <ProtectedRoute>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}
