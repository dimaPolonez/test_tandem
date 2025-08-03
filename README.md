# Blog CRUD API

CRUD API для блога на NestJS с TypeORM, PostgreSQL, Fastify, Redis и Swagger.

## Установка

```bash
npm install
```

## Быстрый запуск с Docker

### Вариант 1: Только база данных и Redis

```bash
# Запуск PostgreSQL и Redis
docker-compose up -d

# Запуск приложения локально
npm run start:dev
```

### Вариант 2: Полный стек в Docker

```bash
# Запуск всего приложения в Docker
docker-compose -f docker-compose.full.yml up --build -d
```

## Ручная настройка

### Настройка базы данных

1. Создайте базу данных PostgreSQL
2. Скопируйте `env.example` в `.env` и настройте параметры подключения

### Настройка Redis

1. Установите и запустите Redis сервер
2. Настройте параметры Redis в `.env` файле

## Переменные окружения

Скопируйте `env.example` в `.env` и настройте:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=blog_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache settings
CACHE_TTL=3600
CACHE_POST_TTL=1800
CACHE_LIST_TTL=900
CACHE_RETRY_ATTEMPTS=3
CACHE_RETRY_DELAY=100
CACHE_MONITORING_ENABLED=true
CACHE_LOG_LEVEL=debug
```

## Запуск

```bash
# Разработка
npm run start:dev

# Продакшн
npm run build
npm run start:prod
```

## API Endpoints

- `POST /posts` - Создать пост
- `GET /posts` - Получить страницу постов (с пагинацией)
- `GET /posts/:id` - Получить пост по ID
- `PATCH /posts/:id` - Редактировать пост
- `DELETE /posts/:id` - Удалить пост

### Структура данных

#### Создание поста (POST /posts)

```json
{
  "title": "Заголовок поста",
  "description": "Описание поста"
}
```

#### Ответ

```json
{
  "id": "uuid",
  "title": "Заголовок поста",
  "description": "Описание поста",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Пагинация (GET /posts)

```
GET /posts?page=1&step=10
```

## Кэширование

Приложение использует Redis для кэширования с продвинутой системой управления:

- **Кэширование постов**: Отдельные посты кэшируются с ключом `post:{id}` (TTL: 30 минут)
- **Кэширование списков**: Списки постов кэшируются с ключом `posts:list:{page}:{step}` (TTL: 15 минут)
- **Инвалидация кэша**: При создании, обновлении или удалении поста автоматически инвалидируется соответствующий кэш
- **Retry механизм**: Автоматические повторные попытки при сбоях Redis
- **Мониторинг**: Логирование операций кэширования для отладки

### Настройки кэширования

- `CACHE_POST_TTL=1800` - TTL для отдельных постов (30 минут)
- `CACHE_LIST_TTL=900` - TTL для списков постов (15 минут)
- `CACHE_RETRY_ATTEMPTS=3` - Количество попыток повтора
- `CACHE_RETRY_DELAY=100` - Задержка между попытками (мс)
- `CACHE_MONITORING_ENABLED=true` - Включение мониторинга
- `CACHE_LOG_LEVEL=debug` - Уровень логирования

## Swagger документация

Доступна по адресу: http://localhost:3000/api

## Тестирование

```bash
# Запуск тестов
npm test

# Тесты в режиме watch
npm run test:watch

# Тесты с покрытием
npm run test:cov
```

## Миграции

```bash
# Генерация миграции
npm run migration:generate

# Создание пустой миграции
npm run migration:create

# Запуск миграций
npm run migration:run

# Откат последней миграции
npm run migration:revert

# Просмотр статуса миграций
npm run migration:show
```

## Docker команды

```bash
# Запуск только БД и Redis
docker-compose up -d

# Запуск всего приложения
docker-compose -f docker-compose.full.yml up --build -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## Структура проекта

```
src/
├── common/           # Общие утилиты и конфигурации
│   ├── config/      # Конфигурации приложения
│   ├── constants/   # Константы
│   ├── interfaces/  # Интерфейсы
│   ├── pagination/  # Пагинация
│   └── pipes/       # Валидационные пайпы
├── infrastructure/   # Инфраструктурный слой
│   ├── cache/       # Система кэширования
│   └── database/    # База данных и миграции
├── modules/         # Модули приложения
│   └── posts/       # Модуль постов
│       ├── controllers/  # Контроллеры
│       ├── dto/          # Data Transfer Objects
│       └── services/     # Бизнес-логика
└── main.ts          # Точка входа
```

## Технологии

- **NestJS** - Фреймворк для Node.js
- **TypeORM** - ORM для работы с базой данных
- **PostgreSQL** - Основная база данных
- **Redis** - Кэширование и сессии
- **Fastify** - HTTP сервер
- **Swagger** - API документация
- **Jest** - Тестирование
- **Docker** - Контейнеризация
