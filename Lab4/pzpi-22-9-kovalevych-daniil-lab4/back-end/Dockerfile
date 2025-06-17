# 1. Базовий образ Node.js
FROM node:18

# 2. Робоча директорія всередині контейнера
WORKDIR /app

# 3. Копіюємо package.json і package-lock.json (якщо є)
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install

# 5. Копіюємо всі інші файли до контейнера
COPY . .

# 6. Вказуємо порт, який слухає твій сервер
EXPOSE 3001

# 7. Запускаємо сервер
CMD ["node", "server.js"]
