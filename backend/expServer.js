const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/subject', require('./routes/subject'));

//GET api
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

//POST api
app.post('/api', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello ${name} from the server!` });
});



// start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
