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

// Отримання всіх транспортних засобів
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await executeQuery('SELECT * FROM vehicles');
        res.writeHead(200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify(vehicles));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Отримання транспортного засобу за ID
const getVehicleById = async (req, res, vehicleId) => {
    try {
        const [vehicle] = await executeQuery('SELECT * FROM vehicles WHERE id = ?', [vehicleId]);

        if (!vehicle) {
            res.writeHead(404, CONTENT_TYPE_JSON);
            return res.end(JSON.stringify({ message: 'Vehicle not found' }));
        }

        res.writeHead(200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify(vehicle));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Додавання нового транспортного засобу
const addVehicle = async (req, res) => {
    try {
        const body = await parseRequestBody(req);
        console.log("🟡 Отримано тіло:", body); // ⬅️ Ось цей лог друкує JSON у консоль

        const { license_plate, model, year } = body;

        if (!license_plate || !model || !year) {
            res.writeHead(400, CONTENT_TYPE_JSON);
            return res.end(JSON.stringify({ message: 'All fields are required' }));
        }

        const result = await executeRun(
            'INSERT INTO vehicles (license_plate, model, year) VALUES (?, ?, ?)',
            [license_plate, model, year]
        );

        res.writeHead(201, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ message: 'Vehicle added', id: result.lastID }));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Оновлення інформації про транспортний засіб
const updateVehicle = async (req, res, vehicleId) => {
    try {
        const { model, year } = await parseRequestBody(req);

        if (!model && !year) {
            res.writeHead(400, CONTENT_TYPE_JSON);
            return res.end(JSON.stringify({ message: 'At least one field is required to update' }));
        }

        const updates = [];
        const values = [];

        if (model) {
            updates.push('model = ?');
            values.push(model);
        }
        if (year) {
            updates.push('year = ?');
            values.push(year);
        }

        values.push(vehicleId);
        const query = `UPDATE vehicles SET ${updates.join(', ')} WHERE id = ?`;

        const result = await executeRun(query, values);

        res.writeHead(result.changes === 0 ? 404 : 200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({
            message: result.changes === 0 ? 'Vehicle not found' : 'Vehicle updated successfully'
        }));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

// Видалення транспортного засобу
const deleteVehicle = async (req, res, vehicleId) => {
    try {
        const result = await executeRun('DELETE FROM vehicles WHERE id = ?', [vehicleId]);

        res.writeHead(result.changes === 0 ? 404 : 200, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({
            message: result.changes === 0 ? 'Vehicle not found' : 'Vehicle deleted'
        }));
    } catch (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: err.message }));
    }
};

module.exports = { getAllVehicles, getVehicleById, addVehicle, updateVehicle, deleteVehicle };
