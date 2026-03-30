import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usersApi } from "../api/client";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const res = await usersApi.getAll();
            setUsers(res.data);
        } catch (err) {
            setError("Ошибка загрузки пользователей");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Заблокировать пользователя?")) return;
        try {
            await usersApi.remove(id);
            setUsers(users.filter(u => u.id !== id));
        } catch {
            setError("Ошибка блокировки");
        }
    }

    return (
        <section>
            <h2>Пользователи</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {users.map(u => (
                    <li key={u.id}>
                        {u.email} ({u.first_name} {u.last_name}) – роль: {u.role}
                        <Link to={`/users/${u.id}/edit`}> Редактировать</Link>
                        <button onClick={() => handleDelete(u.id)}>Заблокировать</button>
                    </li>
                ))}
            </ul>
        </section>
    );
}