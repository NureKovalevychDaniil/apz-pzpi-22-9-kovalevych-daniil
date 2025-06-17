const http = require('http');
const routeHandler = require('./routes/apiRoutes');

const server = http.createServer((req, res) => {
  // Додати CORS-заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Обробка preflight-запитів
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Звичайна обробка запитів
  routeHandler(req, res);
});

server.listen(3001, () => {
  console.log('Server running at http://localhost:3001/');
});