export const PAGINATION_CONSTANTS = {
  DEFAULTS: {
    PAGE: 1,
    STEP: 10,
  },

  LIMITS: {
    MIN_PAGE: 1,
    MIN_STEP: 1,
    MAX_STEP: 100,
  },

  ERROR_MESSAGES: {
    INVALID_PAGE: 'Номер страницы должен быть больше 0',
    INVALID_STEP: 'Количество элементов на странице должно быть от 1 до 100',
  },
} as const;
