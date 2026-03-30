import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: ""
    });
    const [error, setError] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await register(form);
            navigate("/login");
        } catch (err) {
            setError(err?.response?.data?.error || "Ошибка регистрации");
        }
    }

    return (
        <section>
            <h2>Регистрация</h2>
            <form onSubmit={onSubmit} className="card">
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    placeholder="Имя"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
                <input
                    placeholder="Фамилия"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
                <input
                    placeholder="Пароль"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="submit">Зарегистрироваться</button>
                {error && <p className="error">{error}</p>}
            </form>
            <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </section>
    );
}
