const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const server = http.createServer((req, res) => {
    // Security: Prevent directory traversal
    let filepath = path.join('.', path.normalize(req.url));
    if (filepath === './') {
        filepath = './index.html';
    }

    const extname = String(path.extname(filepath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.xml': 'application/xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filepath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else if (err.code === 'EACCES') {
                res.writeHead(403, { 'Content-Type': 'text/html' });
                res.end('403 Forbidden');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            console.log(`Serving ${filepath} with content type ${contentType}`);
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
