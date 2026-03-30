import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productsApi } from "../api/client";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const response = await productsApi.getById(id);
                setProduct(response.data);
            } catch (err) {
                setError(err?.response?.data?.error || "Ошибка загрузки товара");
            }
        }
        load();
    }, [id]);

    async function onDelete() {
        try {
            await productsApi.remove(id);
            navigate("/products");
        } catch (err) {
            setError(err?.response?.data?.error || "Ошибка удаления");
        }
    }

    if (error) return <p className="error">{error}</p>;
    if (!product) return <p>Загрузка...</p>;

    return (
        <section className="card">
            <h2>{product.title}</h2>
            <p><b>Категория:</b> {product.category}</p>
            <p><b>Описание:</b> {product.description}</p>
            <p><b>Цена:</b> {product.price} руб.</p>
            <div>
                <Link to={`/products/${id}/edit`}>Редактировать</Link>{" "}
                <button onClick={onDelete}>Удалить</button>
            </div>
        </section>
    );
}
