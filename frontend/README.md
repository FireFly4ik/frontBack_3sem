# React + Vite

Currently, two official plugins are available:
  - `DELETE /api/products/:id`

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
## Хранение токенов
- `accessToken` и `refreshToken` в `localStorage`
- При `401` клиент делает refresh и повторяет исходный запрос

## Запуск

1. Запусти backend в корне проекта:
```bash
npm install
node app.js
## Expanding the ESLint configuration
```

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
Открой `http://localhost:5173`.
