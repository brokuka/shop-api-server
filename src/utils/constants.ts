export const SUCCESS_STATUS_CODE = 200;

export const ERROR = {
  BAD_REQUEST: {
    CODE: 400,
    MESSAGE: "Ошибка в теле запроса",
  },
  UNAUTHORIZED: {
    CODE: 401,
    MESSAGE: "Не авторизован",
  },
  FORBIDDEN: {
    CODE: 403,
    MESSAGE: "Ошибка доступа",
  },
  NOT_FOUND: {
    CODE: 404,
    MESSAGE: "Не правильный путь",
  },
  UNPROCESSABLE_ENTITY: {
    CODE: 422,
    MESSAGE: "Неподдерживаемый контент",
  },
} as const;

export const CUSTOM_MESSAGE = {
  SUCCESS_REGISTER: "Регистрация успешно пройдена",
  SUCCESS_LOGIN: "Авторизация прошла успешна",
  SUCCESS_LOGOUT: "Выход произошёл успешно",
  SUCCESS_ADD_TO_CART: "Товар добавлен в корзину",
  SUCCESS_REMOVE_FROM_CART: "Продукт успешно удалён из корзины",
  SUCCESS_ORDER: "Заказ отправлен",
  SUCCESS_PROFILE_EDIT: "Профиль успешно изменён",
  EMPTY_CART: "Корзина пуста",
  EMPTY_ORDERS: "Заказы пусты",
  BAD_PARAMS: "Ошибка в параметрах запроса",
  EMAIL_EXIST: "Пользователь с таким Email уже зарегистрирован",
  INVALID_USER_DATA: "Неверно указаны пользовательские данные",
  INVALID_PRODUCT: "Такого продукта не существует",
} as const;
