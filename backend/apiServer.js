const express = require('express');
const cors = require('cors');

const app = express();

// config
const PORT = 5000;


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const subscribeRoutes = require('./routes/subscribe');

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/subscribe', subscribeRoutes);

app.get('/', (req, res) => {
	res.end("Hello World!");
})


app.listen(PORT,() => {
	console.log(`Server is running on http://127.0.0.1:${PORT}`);
})
