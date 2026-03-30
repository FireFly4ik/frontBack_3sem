import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usersApi } from "../api/client";

export default function UserEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ first_name: "", last_name: "", role: "user" });
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await usersApi.getById(id);
                setForm({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    role: res.data.role,
                });
            } catch {
                setError("Ошибка загрузки");
            }
        }
        load();
    }, [id]);

    async function onSubmit(e) {
        e.preventDefault();
        try {
            await usersApi.update(id, form);
            navigate("/users");
        } catch {
            setError("Ошибка сохранения");
        }
    }

    return (
        <section>
            <h2>Редактирование пользователя</h2>
            <form onSubmit={onSubmit} className="card">
                <input
                    placeholder="Имя"
                    value={form.first_name}
                    onChange={e => setForm({ ...form, first_name: e.target.value })}
                />
                <input
                    placeholder="Фамилия"
                    value={form.last_name}
                    onChange={e => setForm({ ...form, last_name: e.target.value })}
                />
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="user">Пользователь</option>
                    <option value="seller">Продавец</option>
                    <option value="admin">Администратор</option>
                </select>
                <button type="submit">Сохранить</button>
                {error && <p className="error">{error}</p>}
            </form>
        </section>
    );
}