# SHOP-API `[SERVER]`

Демонстративный проект который показывает как работает интерфейс интернет-магазина. Это серверная часть целого приложения, клиент находится по этой [ссылке](https://github.com/brokuka/shop-api-client).

## Технологии которые используется в проекте

- [Express](https://expressjs.com/) - фреймворк для создания [NodeJS](https://nodejs.org/) сервера.
- [Nodemon](https://nodemon.io/) - мониторинг проекта в реальном времени.
- [Typescript](https://www.typescriptlang.org/) - Типизация для уменьшение ошибок при (-пере)использования кода.
- [tsx](https://www.npmjs.com/package/tsx) - библиотека для автоматической компиляции [Typescript](https://www.typescriptlang.org/) кода\файлов в JavaScript.
- [Eslint](https://eslint.org/) - Линтер отслеживания ошибок в коде, отдельный удобный конфиг от [@antfu](https://github.com/antfu) (как без этого писать проекты 🤷‍♂️)
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

> Важно! Не забывайте заполнять данные в ваши переменные окружения, файл `.env-example.env` добавлен исключительно как пример использования.

### Локально

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

### Docker

> В файле `Dockerfile` можно выбрать свой менеджер пакетов изменив значения переменной `PACKAGE_MANAGER` на ваше значение, по умолчанию это `yarn`.

Вы можете запустить проект двумя способами:

1. Продакшен `app`
2. Режим разработки `dev-app`

> Для первого запуска добавляйте к запуску параметр --build

```bash
docker-compose up app
docker-compose up dev_app
```

## Документация

> `/api` - основная приставка для использования ручек, все ручки которые не будут с этой приставкой(помимо документации) будут считаться как неправильный путь.

На том же порту как и **сервер** поднимается **Swagger** [(ссылка)](https://server.shop-api.online/swagger). Посмотреть можно по пути `/swagger`, а чтобы получить данные в формате `JSON` нужно перейти на страницу `/swagger.json`

## Что где хостится

- [Front](https://github.com/brokuka/shop-api-client) и Back часть находятся на [Vercel](https://vercel.com/)
- База данных находиться на [Render](https://render.com/)

---

Если нашли ошибку либо опечатку в описании, пожалуйста напишите об этом создав в [ишью](https://github.com/brokuka/shop-api-server/issues).
