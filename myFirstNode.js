let http = require('http');
let url = require('url');

const PORT = 8080;
let server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
  
    let q = url.parse(req.url, true).query;
    let txt = q.fname + " " + q.lname;
    res.write(txt);
  
    res.write('<br>Hello CAMT CMU <hr> Phukrit');
    res.end('<H1>Hello CAMT</H1>');
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});