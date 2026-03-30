import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <section>
            <h2>Профиль</h2>
            {user ? (
                <div className="card">
                    <p><b>ID:</b> {user.id}</p>
                    <p><b>Email:</b> {user.email}</p>
                </div>
            ) : (
                <p>Нет данных пользователя</p>
            )}
        </section>
    );
}
