# 🚀 Инструкция по деплою на Vercel

## Подготовка

### 1. Создайте аккаунт на Vercel
Перейдите на [vercel.com](https://vercel.com) и зарегистрируйтесь (можно через GitHub).

### 2. Настройте Firebase (опционально для продакшена)
1. Создайте проект в [Firebase Console](https://console.firebase.google.com)
2. Включите Authentication → Email/Password
3. Создайте Firestore Database
4. Скопируйте конфигурацию

## Деплой

### Способ 1: Через веб-интерфейс Vercel

1. **Загрузите код на GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/web-monitor.git
   git push -u origin main
   ```

2. **Импортируйте в Vercel**
   - Откройте [vercel.com/new](https://vercel.com/new)
   - Выберите ваш GitHub репозиторий
   - Нажмите "Import"

3. **Добавьте переменные окружения**
   - В настройках проекта: Settings → Environment Variables
   - Добавьте все переменные из `.env.example`

4. **Деплой**
   - Нажмите "Deploy"
   - Дождитесь завершения сборки

### Способ 2: Через Vercel CLI

```bash
# Установите CLI глобально
npm install -g vercel

# Залогиньтесь
vercel login

# Деплой (preview)
vercel

# Деплой в продакшен
vercel --prod
```

При первом запуске CLI задаст вопросы:
- **Set up and deploy?** → Yes
- **Which scope?** → Выберите ваш аккаунт
- **Link to existing project?** → No (создать новый)
- **Project name?** → web-monitor (или любое)
- **Directory?** → ./
- **Override settings?** → No

## Переменные окружения

Добавьте в Vercel Dashboard или через CLI:

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

## После деплоя

### Проверка
1. Откройте URL вашего проекта (например: `web-monitor-xxx.vercel.app`)
2. Попробуйте войти/зарегистрироваться
3. Добавьте тестовые URL

### Кастомный домен (опционально)
1. Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи

### Автоматические деплои
- Каждый push в `main` ветку автоматически запускает деплой
- Pull Request'ы создают preview-деплои

## Troubleshooting

### Ошибка сборки
```bash
# Проверьте локально
npm run build
```

### Firebase не работает
- Убедитесь, что все переменные окружения добавлены
- Проверьте, что домен добавлен в Firebase Console → Authentication → Settings → Authorized domains

### CORS ошибки
- Для реального парсинга страниц нужен серверный прокси или Cloud Functions

## Структура файлов для Vercel

```
├── vercel.json          # Конфигурация Vercel
├── vite.config.vercel.ts # Оптимизированный Vite конфиг
├── .env.example         # Пример переменных
├── dist/                # Папка сборки (создается при build)
└── src/                 # Исходный код
```

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Firebase Documentation](https://firebase.google.com/docs)
