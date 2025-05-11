const express = require('express');
const routes = express.routes();
const fs = require('fs');
const path = require('path');


routes.post('/', (req, res) => {
    const { username, password } = req.body;
    // Here you would typically check the username and password against a database
    // For this example, we'll just send a success message back
    if (username && password) {
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});


module.exports = routes;