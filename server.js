const http = require('http');
const fs = require('fs');
const path = require('path');

const servePath = path.join(__dirname);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(servePath, decodeURIComponent(req.url));
  if (filePath.endsWith('/') || filePath === servePath) {
    filePath = path.join(servePath, 'index.html');
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
