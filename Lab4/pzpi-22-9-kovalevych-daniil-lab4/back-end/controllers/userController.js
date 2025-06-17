const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './db/vehicles.db';
const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };

// Функція для створення підключення до БД
const connectDB = () => new sqlite3.Database(DB_PATH);

// Виконання SQL-запиту з поверненням результатів
const executeQuery = async (query, params = []) => {
    return new Promise((resolve, reject) => {
        const db = connectDB();
        db.all(query, params, (err, rows) => {
            db.close();
            err ? reject(err) : resolve(rows);
        });
    });
};

// Виконання SQL-запиту без повернення даних
const executeRun = async (query, params = []) => {
    return new Promise((resolve, reject) => {
        const db = connectDB();
        db.run(query, params, function (err) {
            db.close();
            err ? reject(err) : resolve(this);
        });
    });
};

// Обробка JSON-запиту
const parseRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('Invalid JSON format'));
            }
        });
    });
};

// Додавання нового користувача
const addUser = async (req, res) => {
    try {
        const { username, password, role } = await parseRequestBody(req);
        if (!username || !password || !role) {
            res.writeHead(400, CONTENT_TYPE_JSON);
            return res.end(JSON.stringify({ message: 'All fields are required' }));
        }

        const result = await executeRun('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
            [username, password, role]);

        res.writeHead(201, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ message: 'User added', id: result.lastID }));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Отримання всіх користувачів
const getAllUsers = async (req, res) => {
    try {
        const users = await executeQuery('SELECT * FROM users');
        res.writeHead(200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify(users));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Видалення користувача за ID
const deleteUser = async (req, res, userId) => {
    try {
        const result = await executeRun('DELETE FROM users WHERE id = ?', [userId]);

        res.writeHead(result.changes === 0 ? 404 : 200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({
            message: result.changes === 0 ? 'User not found' : 'User deleted'
        }));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Оновлення інформації про користувача
const updateUser = async (req, res, userId) => {
    try {
        const { username, password, role } = await parseRequestBody(req);
        if (!username && !password && !role) {
            res.writeHead(400, CONTENT_TYPE_JSON);
            return res.end(JSON.stringify({ message: 'At least one field is required to update' }));
        }

        const updates = [];
        const values = [];

        if (username) {
            updates.push('username = ?');
            values.push(username);
        }
        if (password) {
            updates.push('password = ?');
            values.push(password);
        }
        if (role) {
            updates.push('role = ?');
            values.push(role);
        }

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

        const result = await executeRun(query, values);

        res.writeHead(result.changes === 0 ? 404 : 200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({
            message: result.changes === 0 ? 'User not found' : 'User updated successfully'
        }));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Авторизація користувача
const loginUser = async (req, res) => {
  try {
    const { username, password } = await parseRequestBody(req);
    console.log('Login attempt:', username, password); // 👈

    const users = await executeQuery('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    console.log('Login result:', users); // 👈

    if (users.length === 0) {
      res.writeHead(401, CONTENT_TYPE_JSON);
      return res.end(JSON.stringify({ message: 'Invalid credentials' }));
    }

    const user = users[0];
    const fakeToken = `token-${user.id}-${Date.now()}`;

    res.writeHead(200, CONTENT_TYPE_JSON);
    res.end(JSON.stringify({
      token: fakeToken,
      user: { id: user.id, role: user.role, username: user.username }
    }));
  } catch (err) {
    res.writeHead(500, CONTENT_TYPE_JSON);
    res.end(JSON.stringify({ error: err.message }));
  }
};

module.exports = {
    addUser,
    getAllUsers,
    deleteUser,
    updateUser,
    loginUser // <-- додай сюди
};
