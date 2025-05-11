const express = require('express');
const cors = require('cors');

const routes = express.Router();
const app = express();

// config
const PORT = 5000;


//Middlewar
app.use(cors());

app.get('/', (req, res) => {
	console.log(res);
	res.end("Hello World!");
})


app.listen(PORT,() => {
	console.log(`Server is running on http://127.0.0.1:${PORT}`);
})
