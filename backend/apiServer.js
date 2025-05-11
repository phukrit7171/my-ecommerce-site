const express = require('express');
const cors = require('cors');

const app = express();

// config
const PORT = 5000;


//Middleware
app.use(cors());
app.use(express.json());

// Routes
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);

app.get('/', (req, res) => {
	console.log(res);
	res.end("Hello World!");
})


app.listen(PORT,() => {
	console.log(`Server is running on http://127.0.0.1:${PORT}`);
})
