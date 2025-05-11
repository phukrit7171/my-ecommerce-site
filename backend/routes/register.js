const express = require('express');
const routes = express.routes();
const fs = require('fs');
const path = require('path');

routes.post('/', (req, res) => {
    const { fnmae, lname,  } = req.body;
    // Here you would typically save the username and password to a database.
    // For this example, we'll just send a success message back
    if (username && password) {
        res.status(200).json({ message: 'Registration successful!' });
    } else {
        res.status(400).json({ message: 'Invalid input' });
    }
});

module.exports = routes;