# SHOP-API `[SERVER]`

## Технологии которые используется в проекте

- [Express](https://expressjs.com/) - фреймворк для создания [NodeJS](https://nodejs.org/) сервера.
- [Nodemon](https://nodemon.io/) - мониторинг проекта в реальном времени.
- [Typescript](https://www.typescriptlang.org/) - Типизация для уменьшение ошибок при (-пере)использования кода.
- [tsx](https://www.npmjs.com/package/tsx) - библиотека для автоматической компиляции [Typescript](https://www.typescriptlang.org/) кода\файлов в JavaScript.
- [Axios](https://axios-http.com/) - удобная библиотека для запросов (временная).
- [cross-env](https://www.npmjs.com/package/cross-env) - библиотека для использования\изменения переменных окружения на всех платформах.
- [bcrypt](https://www.npmjs.com/package/bcrypt) - библиотека на хеширования паролей.
- [JWT](https://www.npmjs.com/package/jsonwebtoken) - основная защита серверных данных.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - без этой библитечки сервер не будет знать о куках в запросе.
- [cors](https://www.npmjs.com/package/cors) - удобная работа с `cors`.
- [dotenv](https://www.npmjs.com/package/dotenv) - знаю в ноде есть уже поддержка переменных окружения, но с этой либой работать куда удобнее.
- [envalid](https://www.npmjs.com/package/envalid) - библиотека для типизации переменных окружения, если не будет переменной которая используется она оповестит в консоле.
- [pg](https://www.npmjs.com/package/pg) - библиотека для удобной работы с базы данных [PostgreSQL](https://www.postgresql.org/).

## Установка зависимостей

Перед использованием, убедитесь что установили зависимости проекта

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Режимы запуска

Вы можете запустить проект двумя способами:

1. Продакшен `start`
2. Режим разработки `dev`

Это было сделано для тестирования приложения вне зависимости от того какая цель запуска.

```bash
# npm
npm start
npm run dev

# pnpm
pnpm start
pnpm dev

# yarn
yarn start
yarn dev
```

## API

> `/api` - основная приставка для использования ручек, все ручки которые не будут с этой приставкой будут считаться как неправильный путь.

### Аутентификация

#### [`POST`] Авторизация - `/auth/login`

```json
{
  "email": "anymail@mail.com",
  "password": "12345678"
}
```

#### [`POST`] Регистрация - `/auth/register`

```json
{
  "email": "anymail@mail.com",
  "password": "12345678"
}
```

#### [`POST`] Обновление токена - `/auth/refresh`

> Требует в запросе заголовок `authorization`\*

```json
{
  "user_id": 1
}
```

#### [`POST`] Выход - `/auth/logout`

> Требует в запросе заголовок `authorization`\*

```json
{
  "user_id": 1
}
```

### Пользователь

#### [`GET`] Получить данные пользователя - `/user`

#### [`PATCH`] Обновить данные профиля - `/user`

> Обязательный параметр: `user_id`

> Необязательные параметры: `name`, `surname` и `middlename`

```json
{
  "name": "Ivan",
  "user_id": 1
}
```

### Продукты

#### [`GET`] Получить все продукты - `/product`

#### [`GET`] Получить конкретный продукт - `/product/:product_id`

### Корзина

#### [`POST`] Добавить в корзину - `/cart`

> Требует в запросе заголовок `authorization`\*

```json
{
  "product_id": 1,
  "quantity": 1,
  "user_id": 1
}
```

#### [`GET`] Получить корзину - `/cart`

```json
{
  "user_id": 1
}
```

#### [`POST`] Обновить товар в корзине - `/cart/update`

> Требует в запросе заголовок `authorization`\*

```json
{
  "product_id": 3,
  "quantity": 25
}
```

#### [`DELETE`] Удаление товара из корзины - `/cart/:cart_item_id`

> Требует в запросе заголовок `authorization`\*

### Заказы

#### [`POST`] Отправить заказ - `/order`

> Требует в запросе заголовок `authorization`\*

> В теле запроса обязательно должен быть массив, даже если количество продукта `1`

```json
[
  {
    "product_id": 1,
    "quantity": 1
  },
  {
    "product_id": 2,
    "quantity": 1
  }
]
```

#### [`GET`] Получить все заказы - `/order`

#### [`POST`] Получить конкретный заказ - `/order/:order_id`

> Требует в запросе заголовок `authorization`\*

```json
{
  "user_id": 1
}
```

---

> `*` - (A || a)uthorization: Bearer `<token>`

## Что где хостится

- [Front](https://github.com/brokuka/shop-api-client) и Back часть находятся на [Vercel](https://vercel.com/)
- База данных находиться на [Render](https://render.com/)

---

Если нашли ошибку либо опечатку в описании, пожалуйста напишите об этом создав в [ишью](https://github.com/brokuka/shop-api-server/issues).
