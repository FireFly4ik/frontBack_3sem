# Products API

Base URL: `http://localhost:3000`

## Endpoints

### GET /api/products
Получить список всех товаров.

### POST /api/products
Создать новый товар.

**Body:**
```json
{
  "name": "Название",
  "category": "Категория",
  "description": "Описание",
  "price": 9999,
  "stock": 10
}
```

### GET /api/products/:id
Получить товар по ID.

### PATCH /api/products/:id
Частично обновить товар.

**Body** (любое подмножество полей):
```json
{
  "price": 4999,
  "stock": 5
}
```

### DELETE /api/products/:id
Удалить товар по ID.

---

Документация: `http://localhost:3000/api-docs`

