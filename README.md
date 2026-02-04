# 🌐 Web Monitor Pro

Масштабируемое приложение для мониторинга изменений на веб-сайтах с поддержкой Firebase.

![Web Monitor Pro](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-blue?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)

## ✨ Возможности

- 🔗 **Мониторинг URL** — отслеживание множества веб-страниц
- 📦 **Чанки и контрольные суммы** — умное определение изменений
- 📊 **История изменений** — таблица и JSON формат
- 🔔 **Уведомления** — Email и Webhook (Telegram, Slack)
- 👥 **Многопользовательность** — изоляция данных
- 📝 **Логирование** — полная история действий
- 🎨 **Современный UI** — тёмная тема, анимации, параллакс

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build
```

### Деплой на Vercel

#### Способ 1: Через GitHub

1. Загрузите проект на GitHub
2. Откройте [vercel.com](https://vercel.com)
3. Нажмите "Add New Project"
4. Импортируйте репозиторий
5. Добавьте переменные окружения (см. ниже)
6. Нажмите "Deploy"

#### Способ 2: Через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
vercel

# Для продакшена
vercel --prod
```

## ⚙️ Переменные окружения

Добавьте в Vercel Dashboard → Settings → Environment Variables:

| Переменная | Описание |
|------------|----------|
| `VITE_FIREBASE_API_KEY` | API ключ Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth домен Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID проекта Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

## 🔥 Настройка Firebase

### 1. Создание проекта

1. Откройте [Firebase Console](https://console.firebase.google.com)
2. Создайте новый проект
3. Добавьте веб-приложение
4. Скопируйте конфигурацию

### 2. Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /urls/{urlId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /changes/{changeId} {
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /logs/{logId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
    }
  }
}
```

### 3. Cloud Functions (опционально)

Для автоматического мониторинга по расписанию:

```bash
cd functions
npm install
firebase deploy --only functions
```

## 📁 Структура проекта

```
├── src/
│   ├── components/
│   │   ├── Auth/         # Компоненты авторизации
│   │   ├── Dashboard/    # Основной интерфейс
│   │   └── UI/           # UI компоненты
│   ├── config/           # Конфигурация Firebase
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript типы
│   └── utils/            # Утилиты (checksum, cn)
├── vercel.json           # Конфигурация Vercel
├── .env.example          # Пример переменных окружения
└── README.md
```

## 🧪 Тестирование

```bash
# Запуск тестов в консоли браузера
window.runTests()
```

## 📖 API Reference

### Store Actions

```typescript
// Авторизация
login(email, password): Promise<void>
register(email, password, displayName): Promise<void>
logout(): void

// URL управление
addUrls(urls: string[]): void
removeUrl(urlId: string): void
indexUrl(urlId: string): Promise<void>
monitorUrl(urlId: string): Promise<void>

// Утилиты
addLog(action, message, urlId?, url?, details?): void
clearLogs(): void
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License — используйте свободно!

---

Сделано с ❤️ для мониторинга веб-изменений
