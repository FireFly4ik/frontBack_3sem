import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsApi } from "../api/client";

export default function ProductEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        price: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const response = await productsApi.getById(id);
                const p = response.data;
                setForm({
                    title: p.title,
                    category: p.category,
                    description: p.description,
                    price: String(p.price)
                });
            } catch (err) {
                setError(err?.response?.data?.error || "Ошибка загрузки");
            }
        }
        load();
    }, [id]);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await productsApi.update(id, {
                ...form,
                price: Number(form.price)
            });
            navigate(`/products/${id}`);
        } catch (err) {
            setError(err?.response?.data?.error || "Ошибка обновления");
        }
    }

    return (
        <section>
            <h2>Редактирование товара</h2>
            <form onSubmit={onSubmit} className="card">
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
                    type="number"
                    placeholder="Цена"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <button type="submit">Сохранить</button>
                {error && <p className="error">{error}</p>}
            </form>
        </section>
    );
}
