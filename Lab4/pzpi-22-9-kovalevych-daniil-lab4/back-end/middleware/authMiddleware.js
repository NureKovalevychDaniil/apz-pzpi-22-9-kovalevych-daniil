const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './db/vehicles.db';
const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };

// Функція для виконання SQL-запитів (Promise-based)
const executeQuery = async (query, params = []) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH);
        db.get(query, params, (err, row) => {
            db.close();
            err ? reject(err) : resolve(row);
        });
    });
};

// Middleware для перевірки ролі користувача через токен
const checkRole = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                res.writeHead(401, CONTENT_TYPE_JSON);
                return res.end(JSON.stringify({ message: 'Authorization header missing' }));
            }

            const parts = authHeader.trim().split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                res.writeHead(403, CONTENT_TYPE_JSON);
                return res.end(JSON.stringify({ message: 'Invalid authorization format' }));
            }

            const token = parts[1];
            if (!token.startsWith('token-')) {
                res.writeHead(403, CONTENT_TYPE_JSON);
                return res.end(JSON.stringify({ message: 'Invalid token' }));
            }

            const userId = token.split('-')[1];

            const user = await executeQuery('SELECT id, username, role FROM users WHERE id = ?', [userId]);
            if (!user) {
                res.writeHead(403, CONTENT_TYPE_JSON);
                return res.end(JSON.stringify({ message: 'User not found' }));
            }

            if (!allowedRoles.includes(user.role)) {
                res.writeHead(403, CONTENT_TYPE_JSON);
                return res.end(JSON.stringify({ message: 'Access denied' }));
            }

            req.user = { id: user.id, username: user.username, role: user.role };
            next();
        } catch (err) {
            console.error('Database error:', err.message);
            res.writeHead(500, CONTENT_TYPE_JSON);
            res.end(JSON.stringify({ error: err.message }));
        }
    };
};

module.exports = { checkRole };