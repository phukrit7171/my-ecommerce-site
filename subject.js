const http = require('http');
const PORT = 1143;


const server = http.createServer((req, res) => {
    // Set the response header to allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.writeHead(200, { 'Content-Type': 'text/json' });
    res.end(JSON.stringify({ contactSubject: ['Software Developer', 'System Administrator', 'Data Analyst', 'Cybersecurity Specialist', 'Cloud Engineer', 'UX/UI Designer', 'Other'] }));
    
});


server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});