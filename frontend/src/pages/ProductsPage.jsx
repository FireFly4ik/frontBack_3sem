import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProductsPage() {
    const { isAuthenticated, user } = useAuth();
    const canCreate = user && ['seller', 'admin'].includes(user.role);
    const canEdit = user && ['seller', 'admin'].includes(user.role);

    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        price: ""
    });

    async function loadProducts() {
        try {
            const response = await productsApi.getAll();
            setProducts(response.data);
        } catch (err) {
            setError(err?.response?.data?.error || "Ошибка загрузки товаров");
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function onCreate(e) {
        e.preventDefault();
        setError("");
        try {
            await productsApi.create({
                ...form,
                price: Number(form.price)
            });
            setForm({ title: "", category: "", description: "", price: "" });
            await loadProducts();
        } catch (err) {
            setError(err?.response?.data?.error || "Ошибка создания товара");
        }
    }

    return (
        <section>
            <h2>Товары</h2>

            <div className="card">
                <h3>Список</h3>
                {products.length === 0 ? (
                    <p>Товаров пока нет</p>
                ) : (
                    <ul>
                        {products.map((p) => (
                            <li key={p.id}>
                                <b>{p.title}</b> ({p.category}) - {p.price} руб.
                                {isAuthenticated && (
                                    <>
                                        {" "}
                                        <Link to={`/products/${p.id}`}>Открыть</Link>
                                        {canEdit && (
                                            <>
                                                {" | "}
                                                <Link to={`/products/${p.id}/edit`}>Редактировать</Link>
                                            </>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {canCreate && (
                <div className="card">
                    <h3>Создать товар</h3>
                    <form onSubmit={onCreate}>
                        <input
                            placeholder="Название"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <input
                            placeholder="Категория"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        />
                        <input
                            placeholder="Описание"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <input
                            placeholder="Цена"
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                        />
                        <button type="submit">Создать</button>
                    </form>
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </section>
    );
}
