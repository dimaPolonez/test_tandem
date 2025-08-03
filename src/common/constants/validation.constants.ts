export const VALIDATION_CONSTANTS = {
  LIMITS: {
    TITLE_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 10000,
  },

  ERROR_MESSAGES: {
    TITLE_REQUIRED: 'Заголовок обязателен',
    TITLE_MAX_LENGTH: 'Заголовок не должен превышать 255 символов',
    DESCRIPTION_REQUIRED: 'Описание обязательно',
    DESCRIPTION_MAX_LENGTH: 'Описание не должно превышать 10000 символов',
    INVALID_UUID: 'ID должен быть в формате UUID',
    POST_NOT_FOUND: 'Пост не найден',
  },

  PATTERNS: {
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
} as const;
