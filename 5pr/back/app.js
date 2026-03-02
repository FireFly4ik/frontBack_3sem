const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           example: "aB3dEf"
 *           description: Уникальный идентификатор товара (генерируется автоматически)
 *         name:
 *           type: string
 *           example: "Механическая клавиатура Keychron"
 *           description: Название товара
 *         category:
 *           type: string
 *           example: "Периферия"
 *           description: Категория товара
 *         description:
 *           type: string
 *           example: "Алюминиевый корпус, RGB подсветка"
 *           description: Описание товара
 *         price:
 *           type: number
 *           example: 14990
 *           description: Цена товара в рублях
 *         stock:
 *           type: integer
 *           example: 8
 *           description: Количество на складе
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           example: "Механическая клавиатура Keychron"
 *         category:
 *           type: string
 *           example: "Периферия"
 *         description:
 *           type: string
 *           example: "Алюминиевый корпус, RGB подсветка"
 *         price:
 *           type: number
 *           example: 14990
 *         stock:
 *           type: integer
 *           example: 8
 *     ProductPatch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Новое название"
 *         category:
 *           type: string
 *           example: "Периферия"
 *         description:
 *           type: string
 *           example: "Обновлённое описание"
 *         price:
 *           type: number
 *           example: 9999
 *         stock:
 *           type: integer
 *           example: 5
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Product not found"
 */

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products API',
            version: '1.0.0',
            description: 'REST API для управления товарами (практическое занятие №5)',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Локальный сервер' },
        ],
    },
    apis: [__filename],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return null;
    }
    return product;
}

let products = [
    { id: nanoid(6), name: 'Механическая клавиатура Keychron', category: 'Периферия', description: 'Алюминиевый корпус, RGB подсветка', price: 14990, stock: 8 },
    { id: nanoid(6), name: 'Игровая мышь Logitech', category: 'Периферия', description: 'Беспроводная', price: 9490, stock: 15 },
    { id: nanoid(6), name: 'Монитор LG', category: 'Мониторы', description: '3840x2160, 144Hz', price: 54990, stock: 3 },
    { id: nanoid(6), name: 'SSD 1TB', category: 'Накопители', description: '5 лет гарантии', price: 7490, stock: 22 },
    { id: nanoid(6), name: 'Видеокарта RTX', category: 'Комплектующие', description: 'Поддержка 4K игр', price: 79990, stock: 5 },
    { id: nanoid(6), name: 'Процессор Intel', category: 'Комплектующие', description: '24 ядра, до 5.8 GHz', price: 44990, stock: 7 },
    { id: nanoid(6), name: 'Наушники Sony', category: 'Звук', description: 'Шумоподавление, 30 часов работы', price: 29990, stock: 11 },
    { id: nanoid(6), name: 'Веб-камера Logitech', category: 'Периферия', description: '4K 30fps', price: 18490, stock: 6 },
    { id: nanoid(6), name: 'Оперативная память 32GB', category: 'Комплектующие', description: 'DDR5', price: 11990, stock: 14 },
    { id: nanoid(6), name: 'Блок питания Seasonic', category: 'Комплектующие', description: '850W', price: 12490, stock: 9 },
    { id: nanoid(6), name: 'Микрофон Blue', category: 'Звук', description: 'Подставка в комплекте', price: 13990, stock: 4 },
    { id: nanoid(6), name: 'Кресло игровое', category: 'Мебель', description: 'Очень мягкое и удобное', price: 18990, stock: 2 },
];

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Некорректные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock } = req.body;
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products);
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновить товар по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductPatch'
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нечего обновлять
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    const { name, category, description, price, stock } = req.body;
    if ([name, category, description, price, stock].every(v => v === undefined)) {
        return res.status(400).json({ error: 'Nothing to update' });
    }

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    res.json(product);
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор товара
 *     responses:
 *       204:
 *         description: Товар успешно удалён
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/products/:id', (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) return res.status(404).json({ error: 'Product not found' });
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});

